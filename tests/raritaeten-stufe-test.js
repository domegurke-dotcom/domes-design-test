// v1000-Entwurf (Dome 8.11.): Der Raritäten-Markt enthält in keinem Marktjahr ein Pferd ohne Seltenheitsstufe (Stufe 0), und die Filterzeile stürzt nicht ab
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/raritaeten-stufe-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = { jahre: 0, pferde: 0, null0: [] }; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; if (!spiel.rar) spiel.rar = { mj: 2001, karte: false, wahl: {}, vor: {}, auk: {}, weg: [], salz: 0 };
    const mj0 = spiel.rar.mj;
    for (let mj = mj0; mj < mj0 + 25; mj++) { spiel.rar.mj = mj; rarCache = null; const L = rarAngebot(); R.jahre++; R.pferde += L.length; L.forEach(h => { if (!(h.rarStufe >= 1)) R.null0.push(mj + ':' + h.id); }); }
    spiel.rar.mj = mj0; rarCache = null; spiel.rar.karte = true; try { zeigeMarkt('raritaeten'); R.markt = true; } catch (e) { R.markt = false; R.fehler = e.message; }
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('25 Marktjahre, alle Raritäten mindestens „selten“ (Stufe ≥ 1)', R.null0.length === 0, R.pferde + ' Pferde; ohne Stufe: ' + R.null0.join(', '));
  ok('Raritäten-Markt öffnet ohne Fehler (Filterzeile)', R.markt === true, R.fehler || '');
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
