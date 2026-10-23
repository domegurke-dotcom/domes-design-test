// Zaun-Abgleich (v726, Dome 23.10.): Weide und Zäune stimmen überein; Pachtzaun wird nicht zum Eigentum/umgekehrt
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/zaun-abgleich-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 800 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(x)));
  const R = await pg.evaluate(() => { speicherSperre = true; spiel.admin = true; document.getElementById('dlg').hidden = true; const r = {};
    const zaeune = () => gebaeude().filter(g => g.typ === 'weide' && !g.bau).map(g => [g.wid || '-', g.ziel || '-', g.ha, !!g.pacht]);
    const fertig = () => gebaeude().filter(g => g.bau).forEach(g => { bauFertig(g, 'neu'); delete g.bau; });
    // 1. neues Spiel: eigene Weide + gepachtete Erweiterung bleiben getrennt (früher wurde der Eigenzaun zum Pachtzaun)
    spiel.hof.pacht = 4; bauStarten('weide', 1, { ha: 1, ziel: 'w1' }); fertig(); gebVerschmelzen(); r.getrennt = zaeune();
    r.tag = weidePachtTag(weiden()[0]).replace(/<[^>]+>/g, '').trim();
    // 2. alter Stand: Weide 2 ha, aber nur ein Zaun von 1 ha → Erweiterung kommt dazu
    spiel.gebaeude = gebaeude().filter(g => !g.ziel); weiden()[0].ha = 2; spiel.hof.pacht = 0; gebVerschmelzen(); r.repariert = zaeune(); r.summe = gebaeude().filter(g => g.typ === 'weide').reduce((a, g) => a + g.ha, 0); r.weide = weiden()[0].ha;
    // 3. kein zweites Mal
    const vor = gebaeude().length; gebVerschmelzen(); r.nochmal = gebaeude().length === vor;
    return r; });
  ok('Eigenzaun und Pachtzaun getrennt', R.getrennt.length === 2 && R.getrennt.some(z => !z[3]) && R.getrennt.some(z => z[3]), R.getrennt);
  ok('Weide zeigt „1 ha gepachtet, Rest eigen“', /1 ha gepachtet, Rest eigen/.test(R.tag), R.tag);
  ok('fehlender Zaunteil wird ergänzt, Summe = Weide', R.summe === R.weide && R.repariert.reduce((a, z) => a + z[2], 0) === 2, R);
  ok('Abgleich läuft nur einmal', R.nochmal, R);
  ok('keine Seitenfehler', !errs.length, errs);
  console.log(out.join('\n')); await b.close();
})();
