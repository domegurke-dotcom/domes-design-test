// Aqua A3, Grundspiel (v871, PLAN-AQUA.md): Pausennacht nach dem Turnier, Verlauf chronischer Befunde (Grad 1 kein Dauerabzug, Grad 2 halb), Schubtage (Chance, Wirkung ×0,85/0,7/0,6, Aufwärmen), Turnier-Schub, „So verläuft es“
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-a3-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; VET.verbotAb = 99;
    const box = spiel.boxen[0]; const p = neuesPferd({ name: 'Fiona', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 10 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); box.pferd = p; p.pflege.gesundheit = 80;
    const neu = (art, grad) => { p.befunde = []; befundNeu(p, art, grad, 'Test'); const x = p.befunde[0]; x.diagnose = spiel.tag; x.bemerkt = { von: 'du', tag: spiel.tag }; delete x.inkub; return x; };
    // Pausennacht: Befund und Gesundheit bleiben
    let x = neu('lahmheit', 3); p.pauseTag = spiel.tag; const g0 = p.pflege.gesundheit; spiel.tag++; befundeNacht(); R.pause = x.grad === 3 && p.pflege.gesundheit === g0 && x.pause === spiel.tag;
    // ohne Pause: es tut sich etwas (Gesundheit sinkt)
    p.pauseTag = -5; const g1 = p.pflege.gesundheit; spiel.tag++; befundeNacht(); R.ohnePause = p.pflege.gesundheit < g1 || x.grad !== 3;
    // Verlauf: Arthrose Grad 1 kein Abzug, Grad 2 halb, Grad 3 voll
    const verlust = grad => { const y = neu('arthrose', grad); KRANK.arthrose.schlimmer0 = KRANK.arthrose.schlimmer; KRANK.arthrose.schlimmer = 0; p.pflege.gesundheit = 80; p.pauseTag = -5; spiel.tag++; befundeNacht(); KRANK.arthrose.schlimmer = KRANK.arthrose.schlimmer0; return Math.round((80 - p.pflege.gesundheit) * 100) / 100; };
    R.verl = [1, 2, 3].map(verlust);
    // Schub: Winter + Arthrose Grad 1 → 25 %, Grad 2 → 40 %
    spiel.spieler = spiel.spieler || {}; spiel.spieler.stufe = 'fort';
    while (datum().s !== 3) spiel.tag++;
    const rate = grad => { let n = 0; for (let i = 0; i < 2000; i++) { const y = { art: 'arthrose', grad }; schubNacht(p, y); if (y.schub) n++; } return n / 2000; };
    R.rate = [rate(1), rate(2)].map(v => Math.round(v * 100));
    // Wirkung im Training
    const y = neu('arthrose', 2); y.schub = { tag: spiel.tag, grund: 'kalt' }; R.schub = schubHeute(p) && schubHeute(p).grad === 2;
    const T = { liste: [] }; R.warmOhne = schubWarm(p, T, null); T.liste.push({ k: 'spazieren' }); R.warmSpazier = schubWarm(p, T, null); T.liste.push({ k: 'bodenarbeit' }); R.warmZwei = schubWarm(p, T, null);
    R.warmLonge = schubWarm(p, { liste: [{ k: 'longieren' }] }, null);
    R.turnier = [1, 2, 3].map(g => { y.grad = g; return schubTurnierF(p); }); y.grad = 2;
    // Anfänger: keine Schübe
    spiel.stufenAn = true; spiel.spieler.stufe = 'anf'; const z = { art: 'arthrose', grad: 2 }; let n = 0; for (let i = 0; i < 300; i++) { schubNacht(p, z); if (z.schub) n++; } R.anf = n; spiel.stufenAn = false; spiel.spieler.stufe = 'fort';
    // So verläuft es
    R.verlauf = /So verläuft es: Arthrose/.test(verlaufHTML(p)) && /Heute Schub/.test(verlaufHTML(p));
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Pausennacht: Befund und Gesundheit bleiben', R.pause); ok('normale Nacht wirkt weiter', R.ohnePause);
  ok('Arthrose Grad 1 kein Abzug, Grad 2 halb, Grad 3 voll', R.verl[0] === 0 && Math.abs(R.verl[1] - R.verl[2] / 3) < 0.15 && R.verl[2] > 0, R.verl.join(' / '));
  ok('Schubchance Winter Grad 1 ≈ 25 %, Grad 2 ≈ 40 %', Math.abs(R.rate[0] - 25) <= 4 && Math.abs(R.rate[1] - 40) <= 4, R.rate.join(' / '));
  ok('Schub heute erkannt', R.schub);
  ok('Aufwärmen: Spaziergang allein nicht, zwei leichte oder Longieren schon', !R.warmOhne && !R.warmSpazier && R.warmZwei && R.warmLonge);
  ok('Turnier: Grad 1 0 %, Grad 2 −3 %, ab 3 −6 %', R.turnier.join(',') === '1,0.97,0.94', R.turnier.join(','));
  ok('Anfänger ohne Schubtage', R.anf === 0, R.anf); ok('Befundkarte „So verläuft es“ mit Schub', R.verlauf);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
