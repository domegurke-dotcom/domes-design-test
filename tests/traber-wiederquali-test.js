// v1055: Traber – Wiederqualifikation nach vier Disqualifikationen in Folge (HVT, § 51 Abs. 4 TRO); Altersgrenze § 28 TRO (Stuten bis 10, Hengste/Wallache bis 14 Jahre)
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/traber-wiederquali-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on('pageerror', e => fehler.push(e.message));
  let rot = 0; const ok = (t, b, x) => { console.log((b ? '✓ ' : '✗ ') + t + (b ? '' : ' – ' + (x || ''))); if (!b) rot++; };
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei.replace(/\\/g, '/')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  // v1055: weitere Regeln aus § 28 TRO (Zweijährige: Stichtage und höchstens 8 Starts; Stute nach dem Abfohlen; Schutzsperre)
  const z = await pg.evaluate(() => {
    document.getElementById("dlg").hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const T = tpj(), d0 = datum(), start = spiel.tag - (d0.t - 1) + ((4 - d0.s) % 4) * T;   /* nächster (oder heutiger) Frühling, Tag 1 */
    const Z = neuesPferd({ rasse: "traber", geschlecht: "Hengst", alter: 2, name: "Zwei" }); Z.pflege = erzeugePflege(Z); Z.werte = Z.werte || erzeugeWerte(Z); spiel.boxen[1].pferd = Z;
    const A = neuesPferd({ rasse: "traber", geschlecht: "Wallach", alter: 5, name: "Alt" });
    const out = { jz: [datum(start).s, datum(start).t, datum(start + T).s], alter: alterJZ(Z),
      qFrueh: trab28Sperre(Z, start, true), qSpaet: trab28Sperre(Z, start + T - 1, true), rFruehling: trab28Sperre(Z, start + T - 1, false),
      rSommer1: trab28Sperre(Z, start + T, false), rSommerMitte: trab28Sperre(Z, start + T + Math.ceil(T / 2), false), altFrueh: trab28Sperre(A, start, false) };
    Z.trabZwei = 8; out.acht = trab28Sperre(Z, start + T + Math.ceil(T / 2), false); Z.trabZwei = 0;
    const S = neuesPferd({ rasse: "traber", geschlecht: "Stute", alter: 6, name: "Mama" }); S.abfohlTag = start; out.stute = [trab28Sperre(S, start + 2 * T - 1, false), trab28Sperre(S, start + 2 * T, false), trab28Sperre(S, start + 1, true)];
    A.trabSchutz = start + 1; out.schutz = [trab28Sperre(A, start + 1, false), trab28Sperre(A, start + 2, false), trabSchutzTage()];
    /* Qualifikationslauf eines Zweijährigen vor dem 15. Mai: zählt nur als Training */
    if (spiel.tag === start) { Z.skalaT = [80, 80, 80, 80, 10]; Z.energie = 100; delete Z.trainHeute; let e = null; try { e = trainieren(Z, "trabquali", "rennbahn"); } catch (x) { out.err = x.message; }
      out.lauf = { h: ((Z.trainHeute && Z.trainHeute.hinweise) || (e && e.hinweise) || []).join(" | ").slice(0, 200), q: !!Z.trabQuali, n: Z.trabZwei || 0 }; }
    spiel.boxen[1].pferd = null; return out; });
  ok("Zweijähriger: Qualifikation vor dem 15. Mai gesperrt, am Ende des Frühlings frei", /15. Mai/.test(z.qFrueh) && z.qSpaet === "", JSON.stringify(z));
  ok("Zweijähriger: Rennen im Frühling und Anfang Sommer gesperrt, ab Mitte Sommer frei", /15. Juni/.test(z.rFruehling) && /15. Juni/.test(z.rSommer1) && z.rSommerMitte === "", JSON.stringify([z.rFruehling, z.rSommer1, z.rSommerMitte]));
  ok("Ältere Pferde betrifft der Stichtag nicht", z.altFrueh === "", z.altFrueh);
  ok("Zweijähriger: nach 8 Starts gesperrt", /höchstens 8 Starts/.test(z.acht), z.acht);
  ok("Stute: bis 6 Monate nach dem Abfohlen keine Rennen, danach frei; Qualifikation nicht betroffen", /sechs Monate/.test(z.stute[0]) && z.stute[1] === "" && z.stute[2] === "", JSON.stringify(z.stute));
  ok("Schutzsperre nach Abmeldung wegen Krankheit: nächster Spieltag gesperrt, danach frei", /Schutzsperre/.test(z.schutz[0]) && z.schutz[1] === "" && z.schutz[2] === 1, JSON.stringify(z.schutz));
  if (z.lauf) ok("Qualifikationslauf eines Zweijährigen vor dem Stichtag zählt nur als Training", !z.err && /Noch keine Qualifikation möglich/.test(z.lauf.h) && !z.lauf.q && z.lauf.n === 0, JSON.stringify(z.lauf) + " " + (z.err || ""));
  else ok("Spielstart liegt im Frühling Tag 1 (für den Lauf-Test)", false, JSON.stringify(z.jz));
  const r = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000;
    const P = neuesPferd({ rasse: 'traber', geschlecht: 'Wallach', alter: 5, name: 'Blitz' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[0].pferd = P; spiel.boxen[0].krippeVoll = true;
    P.skalaT = [80, 80, 80, 80, 0]; P.trabQuali = { tag: spiel.tag, zeit: 84 }; if (P.pflege) P.pflege.impf = spiel.tag;
    const out = { vor: trabQualiStand(P), rennen: [] };
    const echt = ergebnisText; let disq = true;
    ergebnisText = function (disz, ...rest) { return disz === 'trabrennen' && disq ? { sort: -999, txt: 'Galoppade – disqualifiziert' } : echt(disz, ...rest); };
    const such = () => (spiel.turniere || []).filter(x => x.tag > spiel.tag && (x.pruef || []).some(q => q.disz === 'trabrennen' && !q.jung)).sort((a, b) => a.tag - b.tag)[0];
    const lauf = () => { try { turnierKalender(); } catch (e) { } let t = such(); for (let i = 0; i < 40 && !t; i++) { naechsteNacht(); t = such(); } if (!t) return null;
      const q = t.pruef.find(x => x.disz === 'trabrennen' && !x.jung); P.trabQuali.tag = t.tag - 1; delete P.turnier; P.pflege.gesundheit = 100;
      t.nennung.push({ pid: P.id, prid: q.id, geld: 0, reiter: 'profi' }); spiel.tag = t.tag; turnierMorgen(); turnierNacht();
      const e = (P.erfolge || [])[0]; return { erg: e && e.erg, disz: e && e.disz, n: P.trabDisq || 0, neu: !!P.trabNeuQuali }; };
    /* drei Disqualifikationen stehen schon, die vierte kommt im echten Rennen */
    P.trabDisq = 3; out.rennen.push(lauf()); out.sperre = trabQualiStand(P);
    /* neu qualifiziert: Sperre weg; ein sauberes Rennen setzt den Zähler zurück */
    P.skalaT = [80, 80, 80, 80, 10]; P.energie = 100; delete P.trainHeute; let versuche = 0; while (P.trabNeuQuali && versuche++ < 40) { delete P.trainHeute; P.energie = 100; try { trainieren(P, 'trabquali', 'rennbahn'); } catch (e) { out.err = e.message; break; } }
    out.nachQuali = { neu: !!P.trabNeuQuali, stand: trabQualiStand(P), versuche };
    P.trabDisq = 2; disq = false; out.rennen.push(lauf());
    ergebnisText = echt;
    /* Altersgrenze § 28 TRO */
    const S = neuesPferd({ rasse: 'traber', geschlecht: 'Stute', alter: 11, name: 'Alte' }), H = neuesPferd({ rasse: 'traber', geschlecht: 'Wallach', alter: 14, name: 'Opa' });
    out.alt = [alterJZ(S) >= 44, alterJZ(H) >= 60, alterJZ(H)];
    out.text = [...document.scripts].some(x => x.textContent.includes('Stuten bis 10, Hengste und Wallache bis 14 Jahre'));
    return out; });
  ok('Vorher qualifiziert und startberechtigt', r.vor === '', r.vor);
  ok('Rennen gelaufen und als disqualifiziert eingetragen', r.rennen[0] && r.rennen[0].disz === 'trabrennen' && /disqualifiziert/.test(r.rennen[0].erg || ''), JSON.stringify(r.rennen[0]));
  ok('Vierte Disqualifikation in Folge: neue Qualifikation nötig, Ergebnis nennt es', r.rennen[0] && r.rennen[0].neu && /neu qualifizieren/.test(r.rennen[0].erg || ''), JSON.stringify(r.rennen[0]));
  ok('Nennen gesperrt mit Grund', /viermal in Folge disqualifiziert/.test(r.sperre), r.sperre);
  ok('Qualifikationslauf geschafft: Sperre weg', !r.err && !r.nachQuali.neu && r.nachQuali.stand === '', JSON.stringify(r.nachQuali) + ' ' + (r.err || ''));
  ok('Sauberes Rennen setzt den Zähler zurück', r.rennen[1] && r.rennen[1].n === 0 && !r.rennen[1].neu && !/disqualifiziert/.test(r.rennen[1].erg || ''), JSON.stringify(r.rennen[1]));
  ok('Altersgrenze steht im Spiel (Stuten bis 10, Hengste und Wallache bis 14 Jahre)', r.text && r.alt[0] && !r.alt[1], JSON.stringify(r.alt));
  ok('keine Seitenfehler', !fehler.length, fehler.join(' | '));
  await br.close(); process.exit(rot ? 1 : 0);
})();
