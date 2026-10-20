// Shampoo-Reihenfolge (v609, Dome): erst nass machen, dann einschäumen, dann abspülen (erst dann glänzt das Fell)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/shampoo-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nixe' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); spiel.boxen[0].pferd = p; spiel.aktBox = 0; aktBox = 0;
    spiel.shampoo = 5; p.dreck = { fell: 60, maehne: 40, seit: spiel.tag - 1 };
    const tool = t => { wisch = { p, tool: t }; wischEnde(true); document.getElementById('dlg').hidden = true; };
    tool('shampoo'); R.ohneNass = { schaum: p.schaum, flasche: spiel.shampoo, glanz: p.fellGlanz };
    tool('spritzen'); R.nass = p.nass === spiel.tag; R.glanz1 = p.fellGlanz;
    tool('shampoo'); R.schaum = p.schaum === spiel.tag; R.flasche = spiel.shampoo; R.glanz2 = p.fellGlanz;
    tool('spritzen'); R.ausgespuelt = !p.schaum; R.glanz3 = !!p.fellGlanz; return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  ok('Shampoo ohne vorher nass: nichts passiert, Flasche bleibt', !R.ohneNass.schaum && R.ohneNass.flasche === 5 && !R.ohneNass.glanz, JSON.stringify(R.ohneNass));
  ok('Abspritzen macht nass, kein Glanz', R.nass && !R.glanz1);
  ok('Shampoo bei nassem Pferd: eingeschäumt, Flasche −1, noch kein Glanz', R.schaum && R.flasche === 4 && !R.glanz2);
  ok('Erneut abspülen: Schaum weg, Fell glänzt', R.ausgespuelt && R.glanz3);
  ok('Keine Seitenfehler', errs.length === 0, errs.join('|'));
  console.log(out.join('\n')); await b.close();
})();
