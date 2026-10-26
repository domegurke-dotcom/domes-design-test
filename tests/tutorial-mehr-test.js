// «Mehr dazu» im Tutorial (v858): der lange Text hinter dem Knopf in der Hinweisblase
// Start (Domes PC, siehe CLAUDE.md): node tests/tutorial-mehr-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true;
    R.anzahl = Object.values(TUT_MEHR).map(o => Object.keys(o).length);
    HINWEISE.xx_test = ['Titel', 'kurz', '', null, null, 'anf', null, 'Der <b>lange</b> Text'];
    blaseZeigen('xx_test'); const knopf = document.querySelector('#hinweisBlase .hb-mehr'); R.knopf = !!knopf; if (knopf) knopf.click();
    R.dialog = !document.getElementById('dlg').hidden && /lange/.test(document.getElementById('dlgInhalt').textContent);
    document.getElementById('dlg').hidden = true; HINWEISE.yy_test = ['Titel', 'kurz', '', null, null, 'anf']; blaseWeg(false); blaseZeigen('yy_test'); R.ohne = !document.querySelector('#hinweisBlase .hb-mehr');
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Mehr-dazu-Texte im Anfänger- und Fortgeschrittenen-Tutorial', R.anzahl[0] > 3 && R.anzahl[1] > 3, R.anzahl.join('/')); ok('Knopf in der Blase', R.knopf); ok('Knopf öffnet den langen Text', R.dialog); ok('ohne langen Text kein Knopf', R.ohne); ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
