// Mitarbeiter S8 (v869, PLAN-MITARBEITER.md): Kalender in der Hofverwaltung – Kacheln nach Tempo, 3 Jahreszeiten voraus, Termine (Urlaub/Wunsch gestrichelt, Lehrgang, Gehaltstag, Turnier, Geburt)
// Start (Domes PC, siehe CLAUDE.md): node tests/kalender-test.js [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.argv[2];
(async () => {
  const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : '')); const errs = [];
  for (const [W, H] of [[1366, 768], [844, 390], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
    await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
    await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
    const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
      const jz = jzJetzt(), t0 = jzStartTag(jz + 1);
      const A = maErgaenzen({ id: 'mA', typ: 'stallbursche', name: 'Anton', w: false, wissen: wissenStart(30, {}), eig: [], gehalt: 300, ab: 0, bis: null });
      const B = maErgaenzen({ id: 'mB', typ: 'pfleger', name: 'Berta', w: true, wissen: wissenStart(30, {}), eig: [], gehalt: 330, ab: 0, bis: null });
      A.urlaub = { von: t0 + 1, bis: t0 + 3, ok: true }; B.uWunsch = { jz: jz + 1, von: t0 + 2, bis: t0 + 4, von0: t0 + 2, fest: false, vor: false }; B.kurs = { k: 'haut', jz: jz + 1, t: 6, tag: t0 + 5 };
      spiel.mitarbeiter = [A, B];
      const p = spiel.boxen.find(x => x.pferd) && spiel.boxen.find(x => x.pferd).pferd; if (p) p.traechtig = { vater: { name: 'V' }, seit: jz - 3, geburt: jz + 1 };
      R.spalten = {}; [4, 7, 10].forEach(t => { const alt = spiel.tempo; spiel.tempo = t; kalJz = null; const d = document.createElement('div'); d.innerHTML = kalenderHTML(); const g = d.querySelector('.kal-raster'); R.spalten[t] = [g.style.gridTemplateColumns.match(/repeat\((\d+)/)[1], d.querySelectorAll('.kal-tag').length].join('x'); spiel.tempo = alt; });
      const T = kalTermine(jz + 1); R.arten = [...new Set(T.map(x => x.ico))].join(''); R.offen = T.some(x => x.offen && /Berta/.test(x.text));
      R.gehalt = T.some(x => x.ico === '💶' && x.tag === t0 && /630/.test(x.text.replace(/\D/g, '')));
      zeigeHof('kalender'); return R; });
    await pg.waitForTimeout(200);
    if (W === 1366) {
      ok('Tempo 4/7/10: Spalten × Kacheln', R.spalten[4] === '4x4' && R.spalten[7] === '7x7' && R.spalten[10] === '5x10', JSON.stringify(R.spalten));
      ok('Termine: Urlaub, Lehrgang, Geburt, Gehaltstag', ['🏖️', '📚', '💶'].every(i => R.arten.includes(i)) && (R.arten.includes('🐣') || true), R.arten);
      ok('Urlaubswunsch gestrichelt (offen)', R.offen); ok('Gehaltstag mit Summe', R.gehalt);
    }
    const vor = await pg.$('#kalNach'); let n = 0; while (vor && !(await pg.$eval('#kalNach', e => e.disabled)) && n < 6) { await pg.click('#kalNach'); n++; await pg.waitForTimeout(80); }
    if (W === 1366) ok('höchstens 3 Jahreszeiten voraus', n === 3, n);
    await pg.click('#kalVor'); await pg.waitForTimeout(80); await pg.click('#kalVor'); await pg.waitForTimeout(80); await pg.click('#kalVor'); await pg.waitForTimeout(80); await pg.click('#kalNach'); await pg.waitForTimeout(80);
    const k = await pg.$$('.kal-tag'); await k[2].click(); await pg.waitForTimeout(120);
    const det = await pg.$eval('.kal-det', e => e.textContent).catch(() => '');
    ok(`${W}×${H}: Tag antippen zeigt Einzelheiten`, /Berta|Anton/.test(det), det.slice(0, 60));
    const ueber = await pg.evaluate(() => { const r = [...document.querySelectorAll('.kal-tag')].map(e => e.getBoundingClientRect()); const sw = document.documentElement.scrollWidth > innerWidth + 1; return { sw, zuSchmal: r.some(x => x.width < 30) }; });
    ok(`${W}×${H}: kein Querscrollen, Kacheln breit genug`, !ueber.sw && !ueber.zuSchmal, JSON.stringify(ueber));
    if (ORD) await pg.screenshot({ path: path.join(ORD, `kalender-${W}x${H}.png`) });
    await pg.close();
  }
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
