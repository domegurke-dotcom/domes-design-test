// Tutorial (v639): Blase wegtippen – der blaue Rahmen bleibt, bis die Aktion gemacht ist; Erklär-Schritte gehen beim Antippen weiter
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/tutorial-ring-test.js [BxH]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(300); await pg.fill('#chName', 'Test'); await pg.click('#chTutorial'); await pg.waitForTimeout(1800);
  const st = () => pg.evaluate(() => ({ k: blase && blase.k, schritt: spiel.tutorial.schritt, blaseSichtbar: !!(blase && !document.getElementById('hinweisBlase').hidden), ringSichtbar: !document.getElementById('hinweisRing').hidden, nurRing: !!(blase && blase.nurRing) }));
  const R = {};
  R.start = await st();   // „Deine Box“ – Erklär-Schritt
  await pg.click('#hinweisBlase'); await pg.waitForTimeout(900); R.nachErklaer = await st();   // → „Heu geben“ (Aktion, mit Rahmen)
  const bb = await pg.evaluate(() => { const r = document.getElementById('hinweisBlase').getBoundingClientRect(); return [r.x + r.width / 2, r.y + 20]; });
  await pg.mouse.click(bb[0], bb[1]); await pg.waitForTimeout(1500); R.weg = await st();   // Blase weggetippt: weg, Rahmen bleibt (auch nach mehreren Prüfungen)
  await pg.evaluate(() => { spiel.boxen[0].krippeVoll = true; }); await pg.waitForTimeout(1200); R.weiter = await st();   // Aktion gemacht → nächster Schritt mit Blase
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(x)));
  ok('Erklär-Schritt zeigt Blase', R.start.blaseSichtbar && R.start.schritt === 0, R.start);
  ok('Erklär-Schritt antippen → nächster Schritt (Heu geben)', R.nachErklaer.schritt === 1 && R.nachErklaer.blaseSichtbar && R.nachErklaer.ringSichtbar, R.nachErklaer);
  ok('Aktions-Schritt: Blase weggetippt, Rahmen bleibt stehen', !R.weg.blaseSichtbar && R.weg.ringSichtbar && R.weg.schritt === 1 && R.weg.nurRing, R.weg);
  ok('Aktion gemacht → nächster Schritt mit neuer Blase', R.weiter.schritt >= 2 && R.weiter.blaseSichtbar && !R.weiter.nurRing, R.weiter);
  ok('keine Seitenfehler', !errs.length, errs);
  console.log(out.join('\n')); await b.close();
})();
