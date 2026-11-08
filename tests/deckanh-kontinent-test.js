// v1000-Entwurf (Dome 8.11.): Hengste der Deckstation im Pferdeanhänger nach Kontinent sortierbar
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/deckanh-kontinent-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.anlage.anhaenger = true;
    const st = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Stella' }); st.pflege = erzeugePflege(st); st.werte = st.werte || erzeugeWerte(st); st.befunde = []; spiel.boxen[0].pferd = st; spiel.boxen[0].krippeVoll = true;
    R.hengste = deckhengste(st).map(h => h.rasse + ':' + kontinentVon(h.rasse)).join(',');
    deckstationStapel([{ p: st, box: spiel.boxen[0], key: 'b0' }]);
    const d = document.getElementById('dlg'), tiles = () => [...d.querySelectorAll('.anh-wahl[data-rasse]')];
    R.kacheln = tiles().length; R.konts = [...new Set(tiles().map(c => kontinentVon(c.dataset.rasse)))].sort();
    R.segment = !!d.querySelector('[data-sortseg]');
    if (R.segment) { const knopf = [...d.querySelectorAll('[data-sortseg] button')].find(x => x.dataset.sort); knopf.click(); R.gewaehlt = knopf.dataset.sort;
      R.sichtbar = tiles().filter(c => c.style.display !== 'none').length; R.nurKont = tiles().filter(c => c.style.display !== 'none').every(c => kontinentVon(c.dataset.rasse) === R.gewaehlt);
      [...d.querySelectorAll('[data-sortseg] button')].find(x => !x.dataset.sort).click(); R.alleWieder = tiles().filter(c => c.style.display !== 'none').length === tiles().length; }
    R.dialogNochDa = !d.hidden; spiel.sortKont = false; return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Deckstation zeigt Hengst-Kacheln mit Rasse', R.kacheln > 0, JSON.stringify(R));
  if (R.konts.length >= 2) {
    ok('Kontinent-Knöpfe da', R.segment);
    ok('ein Kontinent zeigt nur dessen Hengste', R.nurKont && R.sichtbar > 0 && R.sichtbar < R.kacheln, R.gewaehlt + ': ' + R.sichtbar + ' von ' + R.kacheln);
    ok('„Alle“ zeigt wieder alle, Fenster bleibt offen', R.alleWieder && R.dialogNochDa);
  } else ok('nur ein Kontinent in der Liste: keine Knöpfe (wie überall)', !R.segment, R.konts.join(','));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
