// B2 (PLAN-BOXANSICHT.md, Dome 24.10.): am PC öffnen die Symbole Fenster über der Box, Putzen zeigt Werkzeuge im Kreis
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/boxfenster-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const start = async (w, h) => { const pg = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.errs = errs;
    await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  if (process.env.PCZOOM) await pg.addInitScript(() => localStorage.setItem('zuchtstall-pczoom', '1'));   // v831: PC-Vergrößerung auf großen Bildschirmen mitprüfen
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false;
      const p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Flocke' }); p.pflege = erzeugePflege(p); p.pflege.dreck = 60; spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); });
    await pg.waitForTimeout(400); return pg; };
  const pg = await start(W, H);
  const zust = () => pg.evaluate(() => { const I = document.getElementById('info'), q = I.getBoundingClientRect(), k = document.querySelector('#info .info-kopf');
    return { f: bxFenster, putz: bxPutz, pm: putzModus, offen: document.body.classList.contains('infoOffen'), fest: getComputedStyle(I).position === 'fixed', titel: k ? k.querySelector('b').textContent : '',
      tabs: [...document.querySelectorAll('#info .vs-tabs button')].map(x => x.dataset.vstab + (x.classList.contains('an') ? '*' : '')), sichtbar: [...document.querySelectorAll('#info [data-vs]')].filter(x => x.offsetParent).map(x => x.dataset.vs),
      imBild: q.left >= 0 && q.right <= innerWidth && q.top >= 0 && q.bottom <= innerHeight + 1, tools: [...document.querySelectorAll('#boxUI .bxtool')].map(x => x.dataset.bxtool), wisch: wisch && wisch.tool, y: scrollY }; });
  ok('Fenster-Modus an (body.boxfenster)', await pg.evaluate(() => document.body.classList.contains('boxfenster')));
  let z = await pg.evaluate(() => [...document.querySelectorAll('#boxUI .bxs')].map(x => x.dataset.bx));
  ok('kein eigenes Putzen-Symbol mehr (liegt unter Ausrüstung)', !z.includes('putzen') && z.includes('ausruestung'), z);
  await pg.click('#kopfRinge [data-vstab="heute"]'); await pg.waitForTimeout(400);
  z = await pg.evaluate(() => ({ links: [...document.querySelectorAll('#boxUI .bxs')].map(x => x.dataset.bx), ringe: [...document.querySelectorAll('#kopfRinge [data-vstab]')].map(x => x.dataset.vstab) }));
  ok('kein Versorgung-Symbol mehr, die Ringe öffnen die Versorgung (Gesund → Gesundheit, Wohl/Pflege → Heute)', !z.links.includes('versorgung') && z.ringe.join() === 'gesund,heute,heute', z);
  z = await zust();
  ok('Versorgung öffnet ein Fenster über der Box (fest, ganz im Bild, ohne Scrollen)', z.f === 'versorgung' && z.offen && z.fest && z.imBild && z.y === 0, z);
  ok('Fenster-Kopf: Titel mit Pferdename, Reiter Heute/Gesundheit', /Versorgung · Flocke/.test(z.titel) && z.tabs.join() === 'heute*,gesund', z);
  ok('Reiter „Heute“ zeigt nur die Tages-Versorgung', z.sichtbar.join() === 'heute', z.sichtbar);
  if (ORD) await pg.screenshot({ path: `${ORD}/boxfenster-heute-${W}x${H}.png` });
  z = await pg.$$eval('#info .kb-zeile', a => a.map(x => x.dataset.kb + (x.disabled ? '✔' : '')));
  ok('Klemmbrett „Flocke · heute“ mit Heu, Misten, Putzen, Hufe', ['heu', 'mist', 'putz'].every(k => z.some(x => x.startsWith(k))) && !!(await pg.$('#info .klemmbrett')), z);
  await pg.click('#info .kb-zeile[data-kb="heu"]'); await pg.waitForTimeout(300);
  z = await pg.evaluate(() => ({ puls: document.querySelectorAll('.bxpuls').length, f: bxFenster })); ok('Klemmbrett „Heu“ antippen: Fenster zu, Heuhaufen leuchtet auf', z.puls === 1 && !z.f, z);
  await pg.click('#kopfRinge [data-vstab="heute"]'); await pg.waitForTimeout(400);
  await pg.click('#info [data-vstab="gesund"]'); await pg.waitForTimeout(300); z = await zust();
  ok('Reiter „Gesundheit“ umschalten', z.tabs.join() === 'heute,gesund*' && z.sichtbar.join() === 'gesund', z);
  await pg.click('#info .info-zu'); await pg.waitForTimeout(300); z = await zust(); ok('✕ schließt das Fenster', !z.f && !z.offen, z);
  // krankes Pferd → Tierarzt öffnet direkt Gesundheit
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; befundListe(p).push({ id: 'bfT', art: 'husten', grad: 2, seit: spiel.tag, ursache: 'Test', bemerkt: { von: 'du', tag: spiel.tag }, meldungen: [], vermutung: null }); zeigeStall(); });
  await pg.waitForTimeout(300);
  await pg.click('#boxUI [data-bx="ausruestung"]'); await pg.waitForTimeout(200); await pg.click('#boxUI .bxtool.zu'); await pg.waitForTimeout(200); ok('✕ in der Mitte schließt den Kreis', !(await pg.$('#boxUI [data-bxring]')));
  await pg.click('#boxUI [data-bx="tierarzt"]'); await pg.waitForTimeout(400); z = await zust();
  ok('Tierarzt öffnet Versorgung auf „Gesundheit“ mit Tierarzt-Knopf', z.f === 'versorgung' && z.tabs.includes('gesund*') && await pg.isVisible('#tierarztKnopf'), z);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); z = await zust(); ok('Escape schließt das Fenster', !z.f && !z.offen, z);
  // Pensionspferd → Reiter Besitzer
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; p.einsteller = 'ex1'; einstellerListe().push({ eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'box', leistungen: {}, zufr: 80, stufe: 1, preis: 200 }); zeigeStall(); });
  await pg.waitForTimeout(200);
  ok('Pensionspferd: dritter Ring öffnet „Besitzer“', await pg.$eval('#kopfRinge .kring:nth-child(3)', x => x.dataset.vstab) === 'besitzer');
  await pg.click('#kopfRinge [data-vstab="besitzer"]'); await pg.waitForTimeout(400); z = await zust();
  ok('Pensionspferd: Fenster mit Reiter „Besitzer“ (aktiv)', z.tabs.includes('besitzer*'), z.tabs);
  z = await zust(); ok('Reiter „Besitzer“ zeigt nur die Besitzer-Karte', z.sichtbar.join() === 'besitzer', z.sichtbar);
  await pg.keyboard.press('Escape'); await pg.evaluate(() => { const p = spiel.boxen[0].pferd; delete p.einsteller; spiel.einsteller = []; zeigeStall(); }); await pg.waitForTimeout(300);
  // Orte: Plan im Fenster, Doppelklick zoomt
  await pg.click('#boxUI [data-bx="orte"]'); await pg.waitForTimeout(400); z = await zust(); ok('Orte öffnet ein Fenster mit dem Hofplan', z.f === 'orte' && await pg.isVisible('#info .plan-scroll'), z);
  { const vb0 = await pg.evaluate(() => document.getElementById('planOrtSvg').getAttribute('viewBox')); await pg.click('.ort-zoom [data-oz="1"]', { force: true }).catch(() => {}); await pg.waitForTimeout(200);   // v832: Zoom über die Leiste statt Doppelklick
    ok('„+“ in der Zoom-Leiste zoomt in den Plan', await pg.evaluate(v => !!document.querySelector('.ort-zoom') && document.getElementById('planOrtSvg').getAttribute('viewBox') !== v, vb0)); }
  if (ORD) await pg.screenshot({ path: `${ORD}/boxfenster-orte-${W}x${H}.png` });
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
  // Steckbrief
  await pg.click('#boxUI [data-bx="steckbrief"]'); await pg.waitForTimeout(300);
  z = await pg.evaluate(() => [...document.querySelectorAll('#boxUI [data-bxring]')].map(x => x.dataset.bxring)); ok('Steckbrief-Kreis: Daten, Genetik, Merkmale, Ausbildung', z.join() === 'steckbrief,genetik,merkmale,ausbildung', z);
  await pg.click('#boxUI [data-bxring="genetik"]'); await pg.waitForTimeout(400); z = await zust();
  ok('Genetik antippen → Steckbrief-Fenster auf Genetik', z.f === 'steckbrief' && await pg.evaluate(() => aktenReiter === 'genetik'), z);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
  // Putzen: Werkzeuge im Kreis, kein Fenster
  await pg.click('#boxUI [data-bx="ausruestung"]'); await pg.waitForTimeout(300);
  z = await pg.evaluate(() => [...document.querySelectorAll('#boxUI [data-bxring]')].map(x => x.dataset.bxring)); ok('Ausrüstung-Kreis: Zaumzeug, Putzkiste, Hufschuhe', z.join() === 'zaum,putzkiste,hufschuhe', z);
  await pg.click('#boxUI [data-bxring="putzkiste"]'); await pg.waitForTimeout(400); z = await zust();
  ok('Putzen: kein Fenster, Werkzeuge im Kreis (Bürste, Kamm, Hufkratzer, Streicheln) und ✕', !z.offen && z.putz && z.pm && ['buerste', 'kamm', 'huf', 'streicheln', 'zu'].every(t => z.tools.includes(t)), z);
  const ueber = await pg.evaluate(() => { const E = [...document.querySelectorAll('#boxUI .bxtool, #boxUI .bxs')], P = [];   // runde Knöpfe: Abstand der Mittelpunkte
    E.forEach((a, i) => E.forEach((c, j) => { if (j <= i) return; const A = a.getBoundingClientRect(), C = c.getBoundingClientRect(), d = Math.hypot(A.x + A.width / 2 - C.x - C.width / 2, A.y + A.height / 2 - C.y - C.height / 2);
      if (d < (A.width + C.width) / 2 - 2) P.push((a.dataset.bxtool || a.dataset.bx) + '/' + (c.dataset.bxtool || c.dataset.bx)); })); return P.join(); });
  ok('Werkzeuge und Symbole überdecken sich nicht', !ueber, ueber);
  await pg.click('#boxUI [data-bxtool="buerste"]'); await pg.waitForTimeout(300); z = await zust(); ok('Bürste antippen startet das Wischen', z.wisch === 'buerste', z);
  if (ORD) await pg.screenshot({ path: `${ORD}/boxfenster-putzen-${W}x${H}.png` });
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); z = await zust(); ok('Escape schließt die Putzkiste', !z.putz && !z.pm && !z.tools.length, z);
  // Zaumzeug → Ausrüstungs-Fenster; dort führt die Putzkiste ebenfalls zum Kreis
  await pg.click('#boxUI [data-bx="ausruestung"]'); await pg.waitForTimeout(300); await pg.click('#boxUI [data-bxring="zaum"]'); await pg.waitForTimeout(400); z = await zust();
  ok('Zaumzeug öffnet das Ausrüstungs-Fenster', z.f === 'ausruestung' && z.offen && await pg.evaluate(() => zaumModus), z);
  await pg.evaluate(() => { zaumModus = false; zeigeAkte(); }); await pg.waitForTimeout(300);
  await pg.click('#info #putzKachel'); await pg.waitForTimeout(400); z = await zust();
  ok('Putzkiste im Ausrüstungs-Fenster: Fenster zu, Werkzeuge im Kreis', !z.offen && z.putz && z.tools.includes('buerste'), z);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(200);
  ok('keine Seitenfehler (PC)', !pg.errs.length, pg.errs); await pg.close();
  // Handy hochkant: Fenster-Modus jetzt auch mobil (Dome 25.10.) – Einzelheiten in tests/boxmobil-test.js
  const h = await start(390, 844); const hz = await h.evaluate(() => document.body.classList.contains('boxfenster') && document.body.classList.contains('bxhoch'));
  ok('Handy hochkant: Fenster-Modus an (Einzelheiten: boxmobil-test)', hz); await h.close();
  out.forEach(l => console.log(l)); await b.close(); process.exit(out.some(l => l[0] === '✗') ? 1 : 0); })();
