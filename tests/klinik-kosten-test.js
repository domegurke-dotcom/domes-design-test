// Auftrag 25 Block 4, Etappe 4a (v1062): Klinik 45 €/Tag + Zusatz nach Leistung (Behandlung 20, Infusion 30, Intensiv 65), Aufnahme auch über 75 % bei bemerkter Krankheit,
// Erlösen 200 € (nur Tierarzt), Abholung je Bundesland, Sektion 365 € auf Wunsch, Erbkrankheits-Träger nur bei Zuchtpferden −5 %.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/klinik-kosten-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    /* Klinik: Tagessatz und Zusatz nach Leistung */
    let r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 50000;
      const mk = (name, i, g) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: g || 'Stute', alter: 8, name }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; P.pflege.zahn = spiel.tag; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; return P; };
      const A = mk('Husti', 0), K = mk('Kolli', 1);
      const sp = () => ANH_ZIEL.stationaer.sperre(A, spiel.boxen[0]); A.pflege.gesundheit = 95; const s0 = sp();
      const bu = befundNeu(A, 'husten', 2, 'Test'); bu.bemerkt = false; bu.diagnose = false; const s1 = sp(); bu.bemerkt = true; const s2 = sp();
      A.pflege.gesundheit = 60; ANH_ZIEL.stationaer.aus(A, spiel.boxen[0]);
      K.pflege.gesundheit = 40; const bk = befundNeu(K, 'kolik', 4, 'Test'); bk.bemerkt = true; bk.opNein = false; ANH_ZIEL.stationaer.aus(K, spiel.boxen[1]);
      let n = 0; while (n++ < 40 && (A.klinik || (K.klinik && !spiel.boxen[1].tot))) { naechsteNacht(); zu(); }
      const R = name => { const x = (spiel.post || []).find(q => /wieder fit/.test(q.betreff) && q.betreff.includes(name)); return x ? { t: (x.text + ' ' + JSON.stringify(x.rechnung || x.aktion || '')).replace(/<[^>]+>/g, ' '), posten: (x.rechnung && x.rechnung.posten) || (x.aktion && x.aktion.posten) || null } : null; };
      return { s0, s1, s2, tagessatz: KOSTEN.klinik, A: R('Husti'), K: R('Kolli'), kTot: !!spiel.boxen[1].tot, n, post: spiel.post.slice(0, 8).map(q => q.betreff) }; });
    ok('Aufnahme: gesund ohne Krankheit „nicht nötig“, unbemerkte Krankheit verrät nichts, bemerkte Krankheit erlaubt die Klinik auch über 75 %', r.s0 === 'nicht nötig' && r.s1 === 'nicht nötig' && r.s2 === '', JSON.stringify([r.s0, r.s1, r.s2]));
    ok('Tagessatz 45 €, Rechnung nennt „× 45 €“ und „Behandlung – n Tage × 20 €“ (Husten)', r.tagessatz === 45 && r.A && /×\s*45\s*€/.test(r.A.t) && /Behandlung – \d+ Tage? ×\s*20\s*€/.test(r.A.t), JSON.stringify(r.A).slice(0, 500) + ' ' + r.post.join(' | '));
    ok('schwere Kolik: Intensivüberwachung 65 € und danach Infusionen 30 € auf der Rechnung' + (r.kTot ? ' (Pferd in diesem Lauf gestorben – nicht prüfbar)' : ''), r.kTot || (r.K && /Intensivüberwachung – \d+ Tage? ×\s*65\s*€/.test(r.K.t) && /Infusionen – \d+ Tage? ×\s*30\s*€/.test(r.K.t)), JSON.stringify(r.K).slice(0, 600) + ' ' + r.post.join(' | '));
    /* Erlösen 200 € mit echten Klicks, danach Brief der Tierbestattung mit Abholpreis je Bundesland und Sektion */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.hof.bundesland = '11';
      const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Leni' }); P.pflege = erzeugePflege(P); werteErgaenzen(P); spiel.boxen[2].pferd = P; spiel.boxen[2].tot = false;
      const bf = befundNeu(P, 'arthrose', 5, 'Test'); bf.bemerkt = true; bf.diagnose = true; bf.keineHeilung = true; const bu = befundNeu(P, 'magengeschwuer', 2, 'Test'); bu.bemerkt = false; bu.diagnose = false;
      const k = Object.keys(ERBKRANK)[0]; P.erb = P.erb || {}; P.erb[k] = 1; spiel.aktBox = 2;
      const land = { be: abholPreis(), rp: (spiel.hof.bundesland = '07', abholPreis()), by: (spiel.hof.bundesland = '09', abholPreis()), ohne: (spiel.hof.bundesland = undefined, abholPreis()) }; spiel.hof.bundesland = '11';
      erloesenDialog(P, spiel.boxen[2]); return { geld: spiel.geld, land, grund: erloesenGrund(P), erbName: ERBKRANK[k].n, text: document.getElementById('dlgInhalt').innerText }; });
    await pg.waitForTimeout(250); await bild('K1-erloesen');
    ok('Abholpreis je Bundesland: Berlin 273 €, Rheinland-Pfalz 79 €, Bayern 70 €, ohne Bundesland 200 €', r.land.be === 273 && r.land.rp === 79 && r.land.by === 70 && r.land.ohne === 200, JSON.stringify(r.land));
    ok('Erlösen-Fenster: 200 € für den Tierarzt, Abholung kommt dazu (273 € in Berlin)', /200\s*€/.test(r.text) && /273\s*€/.test(r.text) && !/250/.test(r.text), r.text.slice(0, 400));
    const g0 = r.geld, erbName = r.erbName;
    await pg.click('#dlgKnoepfe button[data-txt="Ja, erlösen lassen"]'); await pg.waitForTimeout(400); await pg.click('#dlgKnoepfe button').catch(() => {}); await pg.waitForTimeout(200);
    r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const p = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'grab'), ta = (spiel.post || []).find(x => /Abschied von Leni/.test(x.betreff) && x.von === 'Tierarztpraxis'); return { geld: spiel.geld, br: p && p.id, text: p ? p.text.replace(/<[^>]+>/g, ' ') : '', ta: ta ? ta.text.replace(/<[^>]+>/g, ' ') : '' }; });
    ok('Erlösen kostet 200 €; Tierarzt-Brief nennt nur den Tierarzt', g0 - r.geld === 200 && /200\s*€ \(Tierarzt\)/.test(r.ta), JSON.stringify([g0 - r.geld, r.ta.slice(0, 300)]));
    ok('Brief der Tierbestattung: Abholung 273 € (nicht mehr „schon bezahlt“), Sektion 365 € angeboten', !!r.br && /Tierkörperbeseitigung:\s*273\s*€/.test(r.text) && /Sektion machen \(365\s*€\)/.test(r.text) && !/schon bezahlt/.test(r.text), r.text.slice(0, 500));
    const g1 = r.geld;
    await pg.evaluate(() => zeigeHof('post')); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); }
    await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(400); await bild('K2-brief');
    ok('Brief hat die Knöpfe Abholung · 273 € und Sektion · 365 €', /273/.test(await pg.innerText('[data-baktion="grab-abholung"]')) && /365/.test(await pg.innerText('[data-baktion="sektion"]')));
    await pg.click('[data-baktion="sektion"]'); await pg.waitForTimeout(300); await bild('K3-sektion'); await pg.click('#dlgKnoepfe button').catch(() => {}); await pg.waitForTimeout(200);
    r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const p = (spiel.post || []).find(x => /^Sektion:/.test(x.betreff)), g = (spiel.friedhof || []).find(x => x.name === 'Leni'); return { geld: spiel.geld, br: p && p.id, text: p ? p.text.replace(/<[^>]+>/g, ' ') : '', wahl: g && g.wahl, sek: g && !!g.sektion }; });
    ok('Sektion kostet 365 €; Bericht nennt Todesursache, die unerkannte Krankheit und die Erbanlage; die Wahl der Bestattung bleibt offen', g1 - r.geld === 365 && /Todesursache:.*erlöst/.test(r.text) && /Magengeschwür \(war nicht erkannt\)/.test(r.text) && r.text.includes(erbName) && /Träger|betroffen/.test(r.text) && r.wahl === 'offen' && r.sek, JSON.stringify(r).slice(0, 600));
    await pg.evaluate(() => zeigeHof('post')); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); }
    await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(400); await bild('K4-sektionsbrief');
    const g2 = r.geld;
    r = await pg.evaluate(() => { const g = (spiel.friedhof || []).find(x => x.name === 'Leni'), p = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'grab' && x.aktion.gid === g.gid); return { br: p.id }; });
    await pg.click('#briefZurueck'); await pg.waitForTimeout(300); await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(400);
    ok('nach der Sektion ist der Sektion-Knopf weg', !(await pg.$('[data-baktion="sektion"]')) && /Sektion gemacht/.test(await pg.innerText('#hofInhalt, body')));
    await pg.click('[data-baktion="grab-abholung"]'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => ({ geld: spiel.geld, wahl: (spiel.friedhof || []).find(x => x.name === 'Leni').wahl }));
    ok('Abholung kostet in Berlin 273 € (auch nach dem Erlösen)', g2 - r.geld === 273 && r.wahl === 'abholung', JSON.stringify([g2 - r.geld, r.wahl]));
    /* Erbkrankheits-Träger: Zuchtpferd −5 %, Wallach ohne Abzug, betroffen −25 % */
    r = await pg.evaluate(() => { const k = Object.keys(ERBKRANK).find(x => !ERBKRANK[x].dominant) || Object.keys(ERBKRANK)[0];
      const w = (geschl, n) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: geschl, alter: 8, name: 'M' }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.erb = {}; Object.keys(ERBKRANK).forEach(x => { P.erb[x] = 0; }); P.tests = { krank: true };   /* alle Anlagen frei, damit der Vergleich nicht vom Zufall abhängt */ const frei = marktwert(P); P.erb[k] = n; return marktwert(P) / frei; };
      return { stute: w('Stute', 1), hengst: w('Hengst', 1), wallach: w('Wallach', 1), betroffen: w('Stute', 2), dom: !!ERBKRANK[k].dominant }; });
    const nah = (a, z) => Math.abs(a - z) < 0.012;
    ok(`Träger: Stute ×${r.stute.toFixed(2)}, Hengst ×${r.hengst.toFixed(2)}, Wallach ×${r.wallach.toFixed(2)}; betroffen ×${r.betroffen.toFixed(2)}`, nah(r.stute, 0.95) && nah(r.hengst, 0.95) && nah(r.wallach, 1) && nah(r.betroffen, 0.75), JSON.stringify(r));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
