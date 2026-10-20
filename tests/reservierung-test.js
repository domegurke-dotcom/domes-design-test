// Verwaiste Box-Reservierung (v628): ohne passende Anfrage/Außer-Haus-Pferd wird die Box nachts wieder frei, echte Reservierungen bleiben
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/reservierung-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const R = {}; const bx = spiel.boxen; bx[1].reserviert = 'verwaist-1'; bx[2].reserviert = 'echt-1'; spiel.pensionAnfragen = [{ aid: 'a1', angenommen: true, tag: spiel.tag, pferd: { id: 'echt-1', name: 'Echt' }, leistungen: {} }];
    bx[3].reserviert = 'extern-1'; spiel.extern = [{ pferd: { id: 'extern-1', name: 'Ext' }, ort: 'ausbildung', seit: spiel.tag }];
    pensionAnfragenTag();
    R.verwaist = !bx[1].reserviert; R.echt = bx[2].reserviert === 'echt-1'; R.extern = bx[3].reserviert === 'extern-1'; return R; });
  const out = [], ok = (n, c) => out.push((c ? '✓ ' : '✗ ') + n);
  ok('verwaiste Reservierung wird frei', R.verwaist); ok('Reservierung einer angenommenen Anfrage bleibt', R.echt); ok('Reservierung für Pferd außer Haus bleibt', R.extern); ok('keine Seitenfehler', !errs.length);
  console.log(out.join('\n')); await b.close();
})();
