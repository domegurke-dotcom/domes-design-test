// A2 (v861, PLAN-AQUA.md): Höchstenergie aus Ausdauer und Alter, Arbeitsstufe relativ zur Höchstenergie, Turnier nach Klasse, Überlastung
// Start (Domes PC, siehe CLAUDE.md): node tests/energie-a2-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const neu = (rasse, alter, aus) => { const p = neuesPferd({ rasse, geschlecht: 'Stute', alter, name: 'T' + rasse }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); p.pflege.gesundheit = 100; p.befunde = []; p.fz = 5; if (aus != null) p.werte.ist.ausdauer = aus; return p; };
    const fit = p => { p.pflege.wohl = 100; spiel.boxen[0].pferd = p; return energieMax(p); };
    R.vb = fit(neu('vollblut', 8, 90)); R.sh = fit(neu('shetty', 8, 30)); R.fo = fit(neu('vollblut', 1, 60)); R.alt = fit(neu('vollblut', 24, 60)); R.normal = fit(neu('hannoveraner', 8, 60));
    const serie = (Ts) => { const p = neu('hannoveraner', 8, 60); spiel.boxen[0].pferd = p; p.arbeitSchnitt = 0; let max = false; Ts.forEach(T => { p.trainHeute = { tag: spiel.tag - 1, verbraucht: T }; arbeitNacht(p); if (ueberlastet(p)) max = true; }); return { max, stufe: arbeitStufe(p)[0], schnitt: p.arbeitSchnitt, p }; };
    const s1 = serie([90, 90, 0, 90, 90, 0, 90]); R.wechsel = s1.max; const s2 = serie([90, 90, 90, 90, 90, 90]); R.dauer = s2.max; R.stufe = s2.stufe;
    const p = s2.p, box = spiel.boxen[0]; const r1 = Object.fromEntries(befundRisiko(p, box, 'box')); p.schwerN = 0; const r0 = Object.fromEntries(befundRisiko(p, box, 'box')); R.lahm = r0.lahmheit ? r1.lahmheit / r0.lahmheit : null;
    const q = neu('hannoveraner', 8, 60); q.arbeitSchnitt = 0; q.turnierGestern = 5; delete q.trainHeute; arbeitNacht(q); R.turS = q.arbeitSchnitt; q.arbeitSchnitt = 0; q.turnierGestern = 1; arbeitNacht(q); R.turE = q.arbeitSchnitt; q.arbeitSchnitt = 0; q.turnierGestern = true; arbeitNacht(q); R.turAlt = q.arbeitSchnitt;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('trainiertes Vollblut (Ausdauer 90) über 100', R.vb > 100 && R.vb <= 115, R.vb); ok('Shetty mit Ausdauer 30 unter 100', R.sh < 100 && R.sh >= 85, R.sh); ok('Ausdauer 60 = 100', R.normal === 100, R.normal);
  ok('Fohlen (1 Jahr) ×0,8', R.fo === 80, R.fo); ok('24-jähriges Pferd −10 %', R.alt === 90, R.alt);
  ok('2-2-Ruhe-2 ist keine Überlastung', !R.wechsel); ok('jeden Tag hart ist Überlastung', R.dauer && R.stufe === 'schwer');
  ok('Überlastung: Lahmheit ×1,3', R.lahm != null && Math.abs(R.lahm - 1.3) < 0.01, R.lahm);
  ok('Turnier S zählt 70, E 25, alter Stand 45 (×0,4 im Schnitt)', R.turS === 28 && R.turE === 10 && R.turAlt === 18, `${R.turS}/${R.turE}/${R.turAlt}`);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
