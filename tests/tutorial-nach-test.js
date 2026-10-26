// T-D „erst tippen, dann erklären“ (v859): jede Erklärung „danach“ hängt an einem Aktions-Schritt; Mechanik: erst die kurze Blase, nach der Aktion die Erklärung, Antippen = weiter
// Start (Domes PC, siehe CLAUDE.md): node tests/tutorial-nach-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  const R = await pg.evaluate(() => { const R = {};
    const sets = [["TUT", TUT], ["TUT_FORT", TUT_FORT], ["TUT_EXP", TUT_EXP]], gefunden = new Set();
    sets.forEach(([nm, L]) => L.forEach(K => { const z = {}; K.schritte.forEach(S => { z[S[0]] = (z[S[0]] || 0) + 1; const key = `${nm}|${K.n}|${S[0]}${z[S[0]] > 1 ? "#" + z[S[0]] : ""}`; if (TUT_NACH[key]) { if (S.nach) gefunden.add(key); } }); }));
    R.offen = Object.keys(TUT_NACH).filter(k => !gefunden.has(k)); R.anzahl = gefunden.size;
    R.lang = []; sets.forEach(([nm, L]) => L.forEach(K => K.schritte.forEach(S => { const t = (S[1] || "").replace(/<[^>]+>/g, "").replace(/z\. B\.|\d+\./g, "").replace(/[–-]? ?[Tt]ippe auf diese Blase\.?/g, ""); if ((t.match(/[.!?](\s|$)/g) || []).length > 2) R.lang.push(nm + "|" + K.n + "|" + S[0]); })));
    const H = TUT.find(k => k.n === "Hofausbau"); R.hof = H.schritte.map(S => S[0]);
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('alle Erklärungen „danach“ hängen an einem Aktions-Schritt', R.offen.length === 0, R.anzahl + ' angehängt' + (R.offen.length ? '; offen: ' + R.offen.join('; ') : ''));
  ok('kein Schritt-Text länger als 2 Sätze', R.lang.length === 0, R.lang.join('; '));
  ok('Hofplan-Kapitel hat Kreis, Bestätigen, Blaupause, Verschieben, Bauland', ['Stall antippen', 'Reparieren', 'Bestätigen', 'Anbauen', 'Blaupause antippen', 'Bau bestätigen', 'Verschieben', 'Bauland', 'Abbrechen'].every(x => R.hof.includes(x)), R.hof.join(', '));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
