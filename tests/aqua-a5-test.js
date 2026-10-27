// Aqua A5 (v874, PLAN-AQUA.md): Hinweisblasen a–k vorhanden, Einsteiger-Wissen „Aqua-Center“ und „Chronische Krankheiten“, Experten-Tutorial „Aqua-Center“ (Testpferd mit Arthrose, Reha erlaubt), alter Spielstand
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-a5-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true;
    R.blasen = ['aquaFertig', 'aquaReha', 'aquaNass', 'aquaWinter', 'aquaAlgen', 'aquaHinten', 'schubtag', 'verlauf', 'pausennacht', 'ueberlast', 'energieA2'].filter(k => !HINWEISE[k]);
    const E = ENZY.einsteiger.eintraege.map(x => x[0]); R.enzy = E.includes('🏊 Aqua-Center') && E.includes('📈 Chronische Krankheiten');
    const K = TUT_EXP.find(k => k.n === 'Aqua-Center'); R.kap = !!K; try { K.neu(); } catch (e) { R.neuFehler = e.message; }
    const p = spiel.boxen[0].pferd; R.reha = p && !aquaSperre(p, spiel.boxen[0], 'reha'); R.arthrose = p && p.befunde.some(x => x.art === 'arthrose');
    // alter Spielstand: Pferd ohne neue Felder
    const q = { ...p }; delete q.aquaLog; delete q.aquaWunsch; delete q.aquaGewohnt; delete q.pauseTag; R.alt = aquaKuerzlich(q, 14) === 0 && aquaWunschHeute(q) === null && aquaGewohnt(q) === false;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Hinweisblasen a–k vorhanden', R.blasen.length === 0, R.blasen.join(','));
  ok('Einsteiger-Wissen: Aqua-Center und Chronische Krankheiten', R.enzy);
  ok('Experten-Tutorial „Aqua-Center“: Testpferd mit Arthrose, Reha erlaubt', R.kap && !R.neuFehler && R.arthrose && R.reha, R.neuFehler || '');
  ok('alter Spielstand ohne neue Felder', R.alt);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
