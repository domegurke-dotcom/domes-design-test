// v960 (Dome 8.11.): Hofhelfer bekommen nur sinnvolle Eigenschaften (fleißig = repariert mehr, lernbegierig), keine Box-/Pferde-Eigenschaften
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const alle = new Set(); for (let i = 0; i < 60; i++) bewerber('hofhelfer').forEach(x => (x.eig || []).forEach(e => alle.add(e)));
    ok('Hofhelfer-Bewerber: nur fleißig/lernbegierig', [...alle].every(e => ['fleissig', 'lernbegierig'].includes(e)), [...alle].join());
    const m = { id: 'hh', typ: 'hofhelfer', name: 'Hans', w: false, wissen: {}, eig: ['fleissig', 'zuverlaessig', 'nachteule'], gehalt: 280, ab: jzJetzt() - 2, bis: null };
    const html = eigHTML(m); ok('Alte unpassende Eigenschaften werden nicht gezeigt', !/zuverlässig|Nachteule|Box/.test(html) && /repariert mehr/.test(html), html);
    ok('Stallbursche zeigt weiter „schafft 1 Box mehr“', /1 Box mehr/.test(eigHTML({ typ: 'stallbursche', eig: ['fleissig'] })));
    (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m); const g = gebaeude()[0]; g.zustand = 50; delete g.bau; const z0 = g.zustand; hofhelferTag(); const plus1 = g.zustand - z0; m.eig = []; g.zustand = 50; hofhelferTag(); const plus0 = g.zustand - 50;
    ok('Fleißiger Hofhelfer repariert mehr', plus1 > plus0 && Math.abs(plus1 - plus0 - proTag(1)) < 1e-6, plus1 + ' / ' + plus0);
    const neu = []; for (let i = 0; i < 60; i++) ['futterexperte', 'physio', 'stallmeister'].forEach(t => bewerber(t).forEach(x => (x.eig || []).forEach(e => neu.push(e))));
    ok('Berater/Physio/Meister: nur lernbegierig', neu.every(e => e === 'lernbegierig'), [...new Set(neu)].join());
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
