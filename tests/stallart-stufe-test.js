// Renn-, Western- und Gangpferdestall und ihre Gebäude nur für Experten (v886, Dome 27.10.)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message)); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.waitForTimeout(120); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(120);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(350);
  for (const st of ['fort', 'exp', 'anf']) {
    const R = await pg.evaluate(s => { document.getElementById('dlg').hidden = true; spiel.stufenAn = true; spiel.spieler.stufe = s; spiel.hof.bauHa += 2; try { planLandAbgleich(); } catch (e) { } hofBereich = 'uebersicht'; zeigeHof('hof');
      document.querySelectorAll('details.bzn-e').forEach(d => d.open = true);
      const wahl = [...document.querySelectorAll('[data-stallart]')].map(x => x.dataset.stallart);
      const bau = ['rennbahn', 'ovalbahn', 'trail', 'reitplatz'].map(k => freiStufe('bauen', k));
      return { wahl, bau, ma: freiStufe('ma', 'westerntrainer') }; }, st);
    if (st === 'exp') ok('Experte: alle drei Stallarten wählbar, alle Gebäude baubar', ['renn', 'western', 'gang'].every(k => R.wahl.includes(k)) && R.bau.every(Boolean), JSON.stringify(R));
    else ok(`${st}: keine Renn-/Western-/Gangpferdestall-Wahl, keine Bahnen/Trail, Reitplatz bleibt, kein Pferdewirt Spezialreitweisen`, !['renn', 'western', 'gang'].some(k => R.wahl.includes(k)) && !R.bau[0] && !R.bau[1] && !R.bau[2] && R.bau[3] && !R.ma, JSON.stringify(R));
  }
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
