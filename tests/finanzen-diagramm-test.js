// Finanzen als Diagramm (v634): Umschalter Tabelle/Diagramm (bleibt eingestellt), 5-Jahres-Fenster mit Pfeilen, Linien ein/aus, Ablesung
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/finanzen-diagramm-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.tag = 7 * 4 * 8 + 3; const j = datum().j; spiel.finanzSaison = {}; spiel.finanzen = {};
    for (let y = j - 6; y <= j; y++) { spiel.finanzSaison[y] = {}; for (let s = 0; s < 4; s++) { if (y === j && s > datum().s) break; spiel.finanzSaison[y][s] = { Pension: { ein: 1500 + s * 100, aus: 0, n: 2 }, Futter: { ein: 0, aus: 1000, n: 3 }, ...(y === j - 6 && s === 0 ? { Hofkauf: { ein: 0, aus: 20000, n: 1 } } : {}) }; } }
    hofReiter = 'finanzen'; zeigeHof(); });
  const R = {}; R.startTabelle = await pg.evaluate(() => !document.querySelector('.fin-dia') && !!document.querySelector('.fin-karte'));
  await pg.click('[data-fansicht="diagramm"]'); await pg.waitForTimeout(200);
  R.dia = await pg.evaluate(() => ({ an: spiel.finAnsicht, linien: document.querySelectorAll('.fd-linie').length, titel: document.querySelector('.fd-leiste b').textContent, jetzt: String(datum().j), abl: document.getElementById('finAbl').textContent, r: document.querySelector('[data-fpfeil="1"]').disabled, l: document.querySelector('[data-fpfeil="-1"]').disabled }));
  await pg.click('[data-fpfeil="-1"]'); R.titel2 = await pg.evaluate(() => document.querySelector('.fd-leiste b').textContent);
  await pg.click('[data-flinie="aus"]'); R.aus = await pg.evaluate(() => ({ linien: document.querySelectorAll('.fd-linie').length, gesp: spiel.finLinien.aus }));
  await pg.evaluate(() => { zeigeHof(); }); R.bleibt = await pg.evaluate(() => !!document.querySelector('.fin-dia'));
  await pg.click('[data-fansicht="tabelle"]'); R.zurueck = await pg.evaluate(() => !document.querySelector('.fin-dia') && spiel.finAnsicht === 'tabelle');
  const out = [], ok = (n, c) => out.push((c === true ? '✓ ' : '✗ ') + n + (c === true ? '' : ' → ' + JSON.stringify(c)));
  ok('Start in der Tabelle', R.startTabelle); ok('Diagramm zeigt 3 Linien und die Ablesung', R.dia.an === 'diagramm' && R.dia.linien === 3 && /Insgesamt/.test(R.dia.abl) ? true : R.dia); ok('Fenster endet im laufenden Jahr, 5 Jahre', R.dia.titel === `${+R.dia.jetzt - 4} – ${R.dia.jetzt}` ? true : R.dia.titel);
  ok('rechts gesperrt, links frei', R.dia.r && !R.dia.l ? true : R.dia); ok('Pfeil links verschiebt um 1 Jahr', R.titel2 === `${+R.dia.jetzt - 5} – ${+R.dia.jetzt - 1}` ? true : R.titel2);
  ok('Linie ausblenden (2 Linien, gemerkt)', R.aus.linien === 2 && R.aus.gesp === false ? true : R.aus); ok('Diagramm bleibt nach Neuzeichnen', R.bleibt); ok('Zurück zur Tabelle, Wahl gemerkt', R.zurueck); ok('keine Seitenfehler', errs.length ? errs : true);
  console.log(out.join('\n')); await b.close();
})();
