// Berufe-Popup-Test (v649): Fenster, wenn neue Mitarbeiter-Berufe freigeschaltet werden
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/berufe-popup-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; delete spiel.maBekannt; spiel.hofFenster = [];
    maFreischaltTag();
    ok('Erster Lauf: still gemerkt, kein Fenster', Array.isArray(spiel.maBekannt) && spiel.maBekannt.includes('stallbursche') && !spiel.hofFenster.length, JSON.stringify(spiel.maBekannt));
    ok('Kleiner Stall: Pferdewirt noch nicht dabei', !spiel.maBekannt.includes('pferdewirt'));
    maFreischaltTag(); ok('Zweiter Lauf ohne Änderung: kein Fenster', !spiel.hofFenster.length);
    while (spiel.boxen.length < 9) spiel.boxen.push({ pferd: null }); spiel.stallarten = ['zucht'];
    ok('9 Boxen + Zuchtstall: Pferdewirt freigeschaltet', maFreischaltListe().includes('pferdewirt'), JSON.stringify(maFreischaltListe()));
    maFreischaltTag();
    ok('Fenster „Neue Berufe“ mit Pferdewirt', spiel.hofFenster.length === 1 && /Neue Berufe/.test(spiel.hofFenster[0]) && /Pferdewirt/.test(spiel.hofFenster[0]), spiel.hofFenster[0] && spiel.hofFenster[0].replace(/<[^>]+>/g, ' ').slice(0, 160));
    spiel.hofFenster = []; maFreischaltTag(); ok('Nur einmal', !spiel.hofFenster.length);
    maFreischaltTag(); spiel.tutorial = {}; spiel.maBekannt = []; maFreischaltTag(); ok('Im Tutorial kein Fenster', !spiel.hofFenster.length); delete spiel.tutorial;
    // Anzeige
    spiel.maBekannt = ['stallbursche', 'pfleger']; maFreischaltTag(); weideFreiFenster();
    return new Promise(r => setTimeout(() => { const d = document.getElementById('dlg'); ok('Fenster wird angezeigt', !d.hidden && /Neue Berufe/.test(d.textContent)); r(out); }, 500));
  });
  console.log(R.join('\n')); console.log('Seitenfehler:', errs.length ? errs.join('; ') : 'keine');
  await pg.screenshot({ path: (process.argv[2] || '/tmp') + '/berufe-popup.png' }); await b.close();
})();
