// Fragen 45/48/49 (26.11.2026): Hengstzahl der Gestüte, Lebensversicherung mit Unbrauchbarkeit + Selbstbehalt (echte Klicks), 15-Tage-Grenze der OP-Versicherung, Kolik-OP-Rückkehr.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/fragen-45-49-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 100000; spiel.einsteller = []; spiel.pensionAnfragen = [];
      const mk = (name, i, x) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name, ...(x || {}) }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; P.pflege.zahn = spiel.tag; P.befunde = []; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; return P; };
      ['Anna', 'Bella', 'Cora'].forEach((n, i) => mk(n, i)); });
    const pid = n => pg.evaluate(n => spiel.boxen.find(x => x.pferd && x.pferd.name === n).pferd.id, n);
    /* A: Hengstzahlen nach der Regel */
    const h = await pg.evaluate(() => ({ celle: GESTUETE.celle.h.hannoveraner, marbach: GESTUETE.marbach.h.araber, helenen: GESTUETE.helenenhof.h.traber, ebbs: GESTUETE.ebbs.h.haflinger, max: Math.max(...Object.values(GESTUETE).flatMap(G => Object.values(G.h))) }));
    ok('Hengstzahlen: Celle 8 (Grenze), Marbach 6, Helenenhof 5, Ebbs 5, nirgends mehr als 8', h.celle === 8 && h.marbach === 6 && h.helenen === 5 && h.ebbs === 5 && h.max <= 8, JSON.stringify(h));
    /* B1: Lebensversicherung mit Unbrauchbarkeit + 10 % Selbstbehalt (echte Klicks) */
    await pg.evaluate(() => zeigeHof('finanzen')); await pg.waitForTimeout(300); await pg.click('[data-ftab="vers"]'); await pg.waitForTimeout(300);
    const su = await pg.evaluate(() => lebenSumme(spiel.boxen[0].pferd)), g0 = await pg.evaluate(() => spiel.geld);
    await pg.click(`[data-vleben="${await pid('Anna')}"]`); await pg.waitForTimeout(250);
    let t = await pg.innerText('#dlgInhalt'); ok('Dialog nennt Dauernde Unbrauchbarkeit mit Info-Knopf', /Dauernde Unbrauchbarkeit/.test(t) && await pg.$('#dlgInhalt .begriff-k') !== null, t.slice(0, 200));
    await pg.click('#dlgKnoepfe button[data-txt^="Mit Unbrauchbarkeit"]'); await pg.waitForTimeout(250);
    t = await pg.innerText('#dlgInhalt') + await pg.innerText('#dlgKnoepfe'); ok('Selbstbehalt-Fenster mit 10 % und 20 % und Info-Knopf', /10 %/.test(t) && /20 %/.test(t) && await pg.$('#dlgInhalt .begriff-k') !== null, t.slice(0, 200));
    await pg.click('#dlgKnoepfe button[data-txt^="10 %"]'); await pg.waitForTimeout(400);
    let r = await pg.evaluate(() => ({ L: spiel.boxen[0].pferd.vers && spiel.boxen[0].pferd.vers.leben, geld: spiel.geld }));
    const su2 = r.L.summe, beitrag = Math.round(su2 * 0.027 * 0.92 / 4);
    ok(`Leben mit DU + 10 % Selbstbehalt: Beitrag ${beitrag} € je Jz (2,7 % × 0,92 ÷ 4), Untersuchung 200 €`, r.L && r.L.du && r.L.sb === 10 && g0 - r.geld === 200 + beitrag, JSON.stringify([r, g0 - r.geld]));
    /* B2: Unbrauchbarkeit tritt ein (chronisch: erst nach 2 Jahreszeiten) */
    r = await pg.evaluate(() => { const p = spiel.boxen[0].pferd, su = p.vers.leben.summe; const bf = befundNeu(p, 'arthrose', 5, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag }; bf.diagnose = { tag: spiel.tag, von: 'Tierarzt' }; bf.keineHeilung = spiel.tag; const g = spiel.geld; versDuTag(); const fr = !!p.duAus;
      spiel.tag += 2 * tpj(); versDuTag(); return { frueh: fr, nach: !!p.duAus, plus: spiel.geld - g, ende: !(p.vers && p.vers.leben), sperre: nennSperre(p, { art: 'hof' }, {}), q: alterJZ(p) / 4 >= 9 || su > 25000 ? 0.7 : 0.8 }; });
    const soll = Math.round(su2 * r.q * 0.9) - Math.min(2500, Math.max(500, Math.round(su2 * 0.1 / 50) * 50));
    ok(`Unbrauchbarkeit: vor der Wartezeit nichts, danach ${soll} € (${r.q * 100} % − 10 % SB − Abzug), Vertrag endet, Turnier gesperrt`, !r.frueh && r.nach && r.plus === soll && r.ende && /unbrauchbar/.test(String(r.sperre)), JSON.stringify([r, soll]));
    /* B3: 15-Tage-Grenze der OP-Versicherung */
    r = await pg.evaluate(() => { const p = spiel.boxen[1].pferd; p.vers = { op: { tarif: 'exzellent', ab: spiel.tag - 99, sb: 0, aus: [] } }; const extra = 10 * KOSTEN.klinik, G = versKlinikGrenze(7, extra), ohne = versOpPosten(p, 'tieback', 3000 + extra, true)[0], mit = versOpPosten(p, 'tieback', 3000 + extra, true, G)[0];
      return { G, ohne: ohne.betrag, mit: mit.betrag, text: mit.text, klein: versKlinikGrenze(7, 5 * KOSTEN.klinik) }; });
    ok('Klinik 7 + 10 Zusatztage = 17: die 2 Tage über 15 zahlt der Spieler, Text nennt die Grenze; bis 15 Tage keine Kürzung', r.G && r.G.tage === 2 && r.mit === r.ohne + 2 * 45 && /15-Tage-Grenze/.test(r.text) && r.klein === null, JSON.stringify(r));
    /* B4: Kolik-OP – Rückkehr (Studien 72–84 %) und schwächere Leistung */
    r = await pg.evaluate(() => { let schwach = 0; for (let i = 0; i < 4000; i++) if (Math.random() >= KOLIK_NACH.zurueck) schwach++; const p = spiel.boxen[2].pferd, a = diszWert(p, 'dressur').wert; p.kolikSchwach = true; const b2 = diszWert(p, 'dressur').wert; p.kolikSchwach = false; return { anteil: 1 - schwach / 4000, a, b2 }; });
    ok('Kolik-OP: 78 % kommen zurück; „schwächer“ senkt die Leistung um 7 %', KOLIK_NACH_OK(r), JSON.stringify(r));
    function KOLIK_NACH_OK(x) { return x.anteil > 0.74 && x.anteil < 0.82 && Math.abs(x.b2 / x.a - 0.93) < 0.01; }
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
