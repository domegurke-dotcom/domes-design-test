// Stufen-Test (T2, PLAN-HINWEISE.md/PLAN-STUFEN.md): Sperren je Erfahrungsstufe (Märkte, Zucht, Labor, Turniere, Bauen, Mitarbeiter, Höfe, Krankheiten), alte Spielstände frei, Umstellen, Spende bleibt
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/stufen-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; spiel.tippsAus = true;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Stufe' }); p.pflege = erzeugePflege(p); spiel.boxen[0].pferd = p; aktBox = 0; const box = spiel.boxen[0];
    const markt = () => { zeigeMarkt(null); return [...document.querySelectorAll('[data-mb]')].map(x => x.dataset.mb); };
    const krank = () => befundRisiko(p, box, 'box').map(x => x[0]);
    const ns = (a, b, c) => { try { return nennSperre(a, b, c) || ''; } catch (e) { return '(weiter geprüft)'; } }; const T = { art: 'gross', tag: spiel.tag + 5, nennung: [] }, S4 = { stufe: 4, disz: 'dressur' }, E0 = { stufe: 0, disz: 'dressur' }, M2 = { stufe: 2, disz: 'dressur' };
    ok('Neues Spiel: Spielumfang je Stufe an', spiel.stufenAn === true && stufeAktiv() === 'anf');
    const m1 = markt(); ok('Anfänger: nur Händler/Tierschutz (kein Auktionshaus, keine Raritäten)', !m1.includes('auktion') && !m1.includes('raritaeten') && m1.includes('tierschutz'), m1.join(','));
    ok('Anfänger: Zucht/Labor gesperrt', !frei('zucht') && !frei('labor'));
    ok('Anfänger: Turnier S gesperrt, E erlaubt (Sperrgrund)', /nur Wettbewerbe/.test(ns(p, T, S4) || '') && !/nur Wettbewerbe/.test(ns(p, T, E0) || ''), ns(p, T, S4));
    ok('Anfänger: Bauen nur Stall/Weide/Reitplatz', frei('bauen', 'reitplatz') && !frei('bauen', 'roundpen') && !frei('bauen', 'waschplatz'));
    ok('Anfänger: Mitarbeiter ohne Bereiter', frei('ma', 'stallbursche') && !frei('ma', 'bereiter'));
    ok('Anfänger: nur ein Hof', /einen Hof/.test(immoSperre2({ mid: 'x', preis: 10 }) || ''));
    const k1 = krank(); ok('Anfänger: nur Husten/Erkältung/Verletzung/Mauke', k1.every(k => ['husten', 'erkaeltung', 'verletzung', 'mauke'].includes(k)), k1.join(','));
    ok('Anfänger: kein Tod durch Krankheit', STUFE().krankTod === false);
    spiel.spieler.stufe = 'fort'; const m2 = markt(); ok('Fortgeschritten: Auktionshaus ja, Raritäten nein', m2.includes('auktion') && !m2.includes('raritaeten'), m2.join(','));
    ok('Fortgeschritten: Turnier M ja, S nein', !/nur bis/.test(ns(p, T, M2) || '') && /nur bis Klasse M/.test(ns(p, T, S4) || ''));
    ok('Fortgeschritten: Championat gesperrt', /Experte/.test(ns(p, { ...T, art: 'championat' }, M2) || ''));
    const k2 = krank(); ok('Fortgeschritten: mehr Krankheiten, ohne Erbkrankheiten', k2.length > 4 && !k2.includes('mondblind'), k2.length + '');
    spiel.spieler.stufe = 'exp'; const m3 = markt(); ok('Experte: Raritäten-Markt da', m3.includes('raritaeten'));
    spiel.spieler.stufe = 'anf'; spiel.stufenAn = undefined; ok('Alter Spielstand (ohne stufenAn): alles frei', frei('zucht') && frei('markt', 'auktion') && STUFE().krankF === 1);
    spiel.stufenAn = true; spiel.spieler.stufe = 'anf'; delete spiel.spieler.stufeStart; stufeWaehlen(); [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Experte/.test(x.textContent)).click();
    ok('Umstellen auf Experte: Liste der Neuheiten, Spende bleibt an der Start-Stufe', spiel.spieler.stufe === 'exp' && spiel.spieler.stufeStart === 'anf' && /Raritäten/.test(document.getElementById('dlgInhalt').textContent));
    return out.join('\n'); });
  // Dome 20.10.: alter Spielstand (ohne stufenAn) wird beim Laden Experte, Spielumfang an, Spende bleibt an der alten Stufe
  await pg.evaluate(() => { spiel.spieler.stufe = 'anf'; delete spiel.spieler.stufeStart; delete spiel.stufenAn; speicherSperre = true; schreiben(SPEICHER, spiel); });
  await pg.reload(); await pg.waitForTimeout(800);
  const M = await pg.evaluate(() => ({ an: spiel.stufenAn, st: spiel.spieler.stufe, start: spiel.spieler.stufeStart, zucht: frei('zucht') }));
  console.log((M.an === true && M.st === 'exp' && M.start === 'anf' && M.zucht ? '✓ ' : '✗ ') + 'Alter Spielstand beim Laden: Experte, Spielumfang an, Spende-Stufe bleibt – ' + JSON.stringify(M));
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
