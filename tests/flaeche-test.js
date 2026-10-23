// v667: Flächenbedarf nach echten Maßen (+30 % Wege), Reitplatz/Sandpaddock je Stufe, Umbau braucht Platz
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    { const H = spiel.hof; delete H.halleV; gebaeude().push({ gid: 'hl', typ: 'reithalle', stufe: 3, zustand: 90 }); H.bauHa = 0.5; const b0 = H.bauHa; halleGeschenk(); ok('Alte Halle Stufe 3 bei zu wenig Bauland: einmalig +1 ha', H.bauHa === b0 + 1 && H.halleV === 1); halleGeschenk(); ok('nur einmal', H.bauHa === b0 + 1); gebaeude().pop(); H.bauHa = 2; }
    ok('Reithalle Stufe 1/2/3 = wie Reitplatz (1040/1560/4160 m² mit Zuschlag) und Platz für 7/10/18', [1, 2, 3].map(x => Math.round(platzVon('reithalle', 0, x) * 1e4)).join('/') === '1040/1560/4160' && BAUTEN.reithalle.kap.join() === '7,10,18' && BAUTEN.reitplatz.kap.join() === '7,10,18');
    ok('Reitplatz Stufe 1/2/3 = 800 / 1200 / 3200 m² plus 30 %', [1, 2, 3].map(s => Math.round(platzVon('reitplatz', 0, s) * 1e4)).join('/') === '1040/1560/4160', [1, 2, 3].map(s => Math.round(platzVon('reitplatz', 0, s) * 1e4)).join('/'));
    ok('Sandpaddock Stufe 1/2/3 = 400 / 600 / 800 m² plus 30 %', [1, 2, 3].map(s => Math.round(platzVon('sandpaddock', 0, s) * 1e4)).join('/') === '520/780/1040');
    ok('Rennbahn 2 ha plus 30 %', Math.abs(platzVon('rennbahn') - 2.6) < 1e-6);
    ok('Start: Bauland frei bleibt positiv', baulandFrei() > 0.3, baulandFrei());
    const frei0 = baulandFrei(); spiel.hof.bauHa = baulandBelegt() + 0.05; const g = gebaeude().find(x => x.typ === 'reitplatz'); g.stufe = 1; g.zustand = 100; spiel.geld = 99999;
    const v = umbauStarten(g); ok('Umbau auf höhere Stufe wird ohne Platz abgelehnt', v === false && g.stufe === 1);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
