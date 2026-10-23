// v687: Info zur Reitanlage – Platz für N Reiter, heute N Pensionsreiter, Umbau-Fenster mit vorher/nachher
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; $('dlg').hidden = true; spiel.geld = 50000; spiel.hof.bauHa = 3;
    let g = gebaeude().find(x => x.typ === 'reitplatz'); if (!g) { gebaeude().push(g = { gid: 'grp', typ: 'reitplatz', stufe: 1, zustand: 90 }); spiel.anlage.reitplatz = true; }
    const z = gebZeile(g); ok('Zeile zeigt Platz für 7 Reiter gleichzeitig und nächste Stufe 10', /Platz für <b>7<\/b> Reiter gleichzeitig/.test(z) && /nächste Stufe: 10/.test(z), (z.match(/👥[^<]*/) || [''])[0]);
    ok('Stufe 3 hat keine „nächste Stufe“', !/nächste Stufe/.test(gebZeile({ ...g, stufe: 3 })));
    umbauDialog(g); const t = $('dlgInhalt').textContent; ok('Umbau-Fenster nennt „statt 7 dann 10 Reiter“ und 20 × 60 m', /statt 7 dann 10 Reiter/.test(t) && /20 × 60 m/.test(t), t.slice(0, 220));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
