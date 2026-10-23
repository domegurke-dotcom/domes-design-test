// v661: auch der Zaun der Start-Weide ist ein Gebäude, verfällt und wird repariert; alte Spielstände bekommen ihn einmal nachgetragen
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const z = gebaeude().filter(g => g.typ === 'weide'); ok('Start-Weide hat einen Zaun als Gebäude', z.length === 1 && z[0].wid === 'w1' && z[0].ha === weiden()[0].ha, JSON.stringify(z[0]));
    const z0 = z[0].zustand; gebaeudeJahreszeit(); ok('Zaun verfällt', gebaeude().find(g => g.typ === 'weide').zustand < z0);
    // alter Stand: Zaun fehlt
    spiel.gebaeude = spiel.gebaeude.filter(g => g.typ !== 'weide'); delete spiel.hof.zaunV; ok('Alter Stand: Zaun wird einmal nachgetragen', gebaeude().filter(g => g.typ === 'weide').length === 1);
    gebaeude(); ok('Nur einmal', gebaeude().filter(g => g.typ === 'weide').length === 1);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
