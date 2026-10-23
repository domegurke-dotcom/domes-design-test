// v710 (Dome 23.10.): Weide aus 1 + 1 ha Pachtland wird eine 2-ha-Pachtweide, Anzeige „gepachtet“ / „eigenes Land“
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/pacht-zaun-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true;
    const H = spiel.hof; const eigen = Math.max(0, H.ha - bauHa()); const alt = gebaeude().filter(g => g.typ === 'weide');
    const w1 = alt[0]; H.pacht = 2; H.weideHa = (w1 ? w1.ha : 0) + 2; delete H.pachtV;
    gebaeude().push({ gid: 'p1', typ: 'weide', wid: 'w2', ha: 1, stufe: 1, zustand: 90 }, { gid: 'p2', typ: 'weide', ha: 1, stufe: 1, zustand: 80, ziel: 'w2' });
    gebVerschmelzen(); const W = gebaeude().filter(g => g.typ === 'weide');
    ok('alte Zäune: gepachtetes Land markiert', W.filter(g => g.pacht).reduce((a, g) => a + g.ha, 0) === 2, JSON.stringify(W.map(g => [g.gid, g.ha, !!g.pacht])));
    ok('1 + 1 ha werden eine 2-ha-Pachtweide', W.filter(g => g.pacht).length === 1 && W.find(g => g.pacht).ha === 2, JSON.stringify(W.map(g => [g.gid, g.ha, !!g.pacht])));
    ok('Eigenes Land bleibt eigen', !w1 || !w1.pacht);
    const html = bauenHTML ? bauenHTML() : ''; ok('Anzeige „gepachtet“', /pacht-tag miete/.test(html)); ok('Anzeige „eigenes Land“', /pacht-tag eigen/.test(html));
    return out; });
  console.log(R.join('\n'), errs.length ? '\nFEHLER ' + errs : ''); await b.close(); })();
