// Waschplatz-Test (W1/W2, PLAN-WASCHPLATZ.md): Abspritzen, Abtrocknen, nass/verschwitzt über Nacht, Jahreszeit/Wetter/Stufe, Sperren, Gewöhnung, Hufe, Mauke, Ansicht mit Wischen
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/waschplatz-test.js [Ordner für Bildschirmfotos]
const { chromium } = require('playwright'); const path = require('path');
const ORDNER = process.argv[2];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const A = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const p = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nixe' }); spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0;
    R.ohne = waschStufe(); gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 1, zustand: 100 }); spiel.anlage.waschplatz = true; R.mit = waschStufe();
    const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    while (datum().s !== 1) nacht(); p.befunde = []; p.pflege.gesundheit = 100;
    R.sommer = waschErlaubt(p);
    p.dreck = { fell: 70, maehne: 60, seit: spiel.tag - 2 }; p.wasserGewohnt = 0; const w0 = p.pflege.wohl;
    R.txt = abspritzen(p, false); R.fell = p.dreck.fell; R.maehne = p.dreck.maehne; R.nass = nassHeute(p); R.gew = p.wasserGewohnt;
    R.trocken = (abtrocknen(p), !nassHeute(p));
    // Gewöhnung zählt nur 1× am Tag und insgesamt
    abspritzen(p, false); R.gew2 = p.wasserGewohnt;
    // Risiken über Nacht (Herbst): nass → Mauke ×2, Erkältung ×1,5; verschwitzt → Erkältung ×1,5
    while (datum().s !== 2) nacht(); nacht(); p.befunde = [];
    const box = spiel.boxen[0], rz = () => Object.fromEntries(befundRisiko(p, box, 'box'));
    delete p.nass; delete p.schweiss; const r0 = rz(); p.nass = spiel.tag - 1; const r1 = rz(); delete p.nass; p.schweiss = spiel.tag - 1; const r2 = rz(); delete p.schweiss;
    R.mauke = r1.mauke / r0.mauke; R.erk = r1.erkaeltung / r0.erkaeltung; R.schw = r2.erkaeltung / r0.erkaeltung;
    p.hufGew = [spiel.tag - 1, spiel.tag - 2]; const r3 = rz(); delete p.hufGew; R.huf = r3.strahlfaeule / r0.strahlfaeule;
    // Sommer: nass schadet nicht
    // Winter: Stufe 1 gesperrt, Stufe 2 nur Beine
    while (datum().s !== 3) nacht(); p.befunde = [];
    R.w1 = waschErlaubt(p); gebaeude().find(g => g.gid === 'gw').stufe = 2; R.w2 = waschErlaubt(p);
    // Sperre bei Erkältung
    befundNeu(p, 'erkaeltung', 2, 'Test', 'du'); const B = p.befunde.find(x => x.art === 'erkaeltung'); B.bemerkt = true; B.diagnose = true; delete B.inkub; R.sperre = waschSperre(p, box); p.befunde = [];
    // verschwitzt nach Training
    p.energie = energieMax(p); delete p.schweiss; Object.keys(UEBUNG).filter(k => UEBUNG[k].wo === 'platz' || UEBUNG[k].wo === 'boden').slice(0, 8).forEach(k => { try { if (!(p.trainHeute && p.trainHeute.verbraucht >= 45)) trainieren(p, k, 'reitplatz'); } catch (e) { R.trainFehler = e.message; } });
    R.schweiss = schweissHeute(p); R.verbraucht = p.trainHeute && p.trainHeute.verbraucht;
    // Mauke: Beine waschen + trocknen + Salbe hilft mehr, ohne Trocknen schadet
    befundNeu(p, 'mauke', 2, 'Test', 'du'); const M = p.befunde.find(x => x.art === 'mauke'); M.diagnose = true; delete M.inkub;
    const bw = () => behandlungsWert(p, M); p.behHeute = { tag: spiel.tag - 1, a: { wundsalbe: 1 } }; const m0 = bw();
    p.beineGew = spiel.tag - 1; p.getrocknet = spiel.tag - 1; const m1 = bw(); delete p.getrocknet; const m2 = bw();
    R.m0 = m0; R.m1 = m1; R.m2 = m2; delete p.beineGew; p.befunde = [];
    return R; });
  ok('Ohne Waschplatz kein Waschen (Spieler)', A.ohne === 0 && A.mit === 1);
  ok('Sommer: ganzes Pferd erlaubt', A.sommer.ganz && A.sommer.beine);
  ok('Abspritzen: Fell sauber, Mähne halb, nass', A.fell === 0 && A.maehne === 30 && A.nass, JSON.stringify([A.fell, A.maehne, A.nass]));
  ok('Abtrocknen: nicht mehr nass', A.trocken); ok('Gewöhnung zählt 1× am Tag', A.gew === 1 && A.gew2 === 1, A.gew + '/' + A.gew2);
  ok('Herbst: nass über Nacht → Mauke ×2, Erkältung ×1,5', Math.abs(A.mauke - 2) < 0.01 && Math.abs(A.erk - 1.5) < 0.01, A.mauke + ' / ' + A.erk);
  ok('Herbst: verschwitzt → Erkältung ×1,5', Math.abs(A.schw - 1.5) < 0.01, String(A.schw)); ok('Hufe öfter als jeden 2. Tag → Strahlfäule ×1,3', Math.abs(A.huf - 1.3) < 0.01, String(A.huf));
  ok('Winter Stufe 1: alles gesperrt', !A.w1.ganz && !A.w1.beine, A.w1.grund); ok('Winter Stufe 2: nur Beine/Hufe', !A.w2.ganz && A.w2.beine, A.w2.grund);
  ok('Sperre bei Erkältung', /erkältet/.test(A.sperre), A.sperre); ok('Verschwitzt nach viel Training', A.schweiss, 'verbraucht ' + A.verbraucht + (A.trainFehler ? ' ' + A.trainFehler : ''));
  ok('Mauke: gewaschen + getrocknet + Salbe besser', A.m1.wert > A.m0.wert, JSON.stringify([A.m0, A.m1])); ok('Mauke: gewaschen ohne Trocknen schadet', A.m2.schaden > A.m0.schaden, JSON.stringify(A.m2));
  // Oberfläche: Sommer, Waschplatz im Ort, Abspritzen durch Wischen
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    while (datum().s !== 1) nacht(); p.befunde = []; p.dreck = { fell: 60, maehne: 40, seit: null }; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = 'waschplatz'; zeigeAkte(); });
  await pg.waitForTimeout(300); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  const K = await pg.evaluate(() => [...document.querySelectorAll('[data-wasch]')].map(x => x.dataset.wasch + (x.disabled ? '-' : '+')).join(','));
  ok('Waschplatz-Ansicht mit Werkzeugen', /spritzen\+/.test(K) && /trocknen\+/.test(K), K);
  if (ORDNER) for (const [n, w, h] of [['pc', 1366, 768], ['quer', 844, 390], ['hoch', 390, 844]]) { await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(250); await pg.screenshot({ path: `${ORDNER}/waschplatz-${n}.png` }); }
  await pg.setViewportSize({ width: 1366, height: 768 });
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.click('[data-wasch="spritzen"]'); await pg.waitForTimeout(900);
  const bb = await pg.evaluate(() => { const r = document.getElementById('stall').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await pg.mouse.move(bb.x + bb.w * .4, bb.y + bb.h * .5); await pg.mouse.down();
  for (let i = 0; i < 40 && await pg.evaluate(() => !!wisch); i++) { await pg.mouse.move(bb.x + bb.w * (i % 2 ? .62 : .38), bb.y + bb.h * (.45 + (i % 4) * .05), { steps: 10 }); }
  await pg.mouse.up(); await pg.waitForTimeout(300);
  const U = await pg.evaluate(() => { const p = spiel.boxen[0].pferd; return { fell: p.dreck.fell, nass: nassHeute(p), filter: document.getElementById('pferdPlatz').getAttribute('filter'), meld: document.getElementById('info').textContent.includes('abgespritzt') }; });
  ok('Wischen: Pferd abgespritzt, Fell dunkel (nass)', U.fell === 0 && U.nass && U.filter === 'url(#nassF)' && U.meld, JSON.stringify(U));
  if (ORDNER) await pg.screenshot({ path: `${ORDNER}/nass-pc.png` });
  console.log(out.join('\n')); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
