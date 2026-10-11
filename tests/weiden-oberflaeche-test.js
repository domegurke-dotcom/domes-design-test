// Oberflächen-Test Weiden (H6): Weideland kaufen, als neue Weide einzäunen, Weide vergrößern, zwei Pferde über Ort → Weide auf verschiedene Weiden stellen.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/weiden-oberflaeche-test.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const log = (...a) => console.log(...a);
  const klick = async sel => { await pg.click(sel); await pg.waitForTimeout(250); };
  await pg.goto('file://' + require('path').resolve(__dirname, '..', 'index.html'));
  await klick('#smNeu'); await pg.fill('#chName', 'Test'); await klick('#chLos'); await klick('#dlgKnoepfe button');
  await klick('[data-immo="pension"]'); await pg.fill('#kaufName', 'Hof'); await klick('#dlgKnoepfe button:first-child');
  await pg.evaluate(() => { buchen(30000, 'Test'); ['Hanni', 'Ali'].forEach(n => { const h = neuesPferd({ rasse: 'araber', geschlecht: 'Stute', alter: 7, name: n }); pferdEinstellen(h, 0, 'Händler'); }); $('dlg').hidden = true; });
  log('Start: Weiden', await pg.evaluate(() => JSON.stringify(weiden().map(w => [w.name, w.ha])) + ' freiesLand ' + freiesLand()));
  // 1. Weideland kaufen über hvw – Hof – Land
  await pg.evaluate(() => { hofBereich = 'land'; zeigeHof('hof'); });
  await pg.selectOption('#landArt', 'weide'); await pg.selectOption('#landHa', '2'); await klick('#landKauf'); await klick('#dlgKnoepfe button:first-child');
  log('Nach Landkauf: freies Weideland', await pg.evaluate(() => freiesLand()));
  // 2. Einzäunen als neue Weide über Bauen
  const zaun = async (ziel) => { await pg.evaluate(() => { hofBereich = 'bauen'; zeigeHof('hof'); }); await klick('[data-bau="weide"]');
    const hatZiel = await pg.$('#bauZiel'); if (hatZiel) { await pg.selectOption('#bauZiel', ziel); await pg.waitForTimeout(200); }
    log('  Dialog Weide-Auswahl:', hatZiel ? await pg.$$eval('#bauZiel option', o => o.map(x => x.textContent).join(' / ')) : 'keine (erste Weide)');
    await pg.selectOption('#bauMenge', '0.5').catch(() => pg.selectOption('#bauMenge', { index: 0 }));
    await klick('#dlgKnoepfe button:first-child');
    await pg.evaluate(() => { for (let i = 0; i < 4; i++) { spiel.boxen.forEach(bx => { if (bx.pferd) bx.krippeVoll = true; }); naechsteNacht(); } }); };
  await zaun('neu');
  log('Nach Einzäunen „neue Weide“:', await pg.evaluate(() => JSON.stringify(weiden().map(w => [w.name, w.ha]))));
  const w1 = await pg.evaluate(() => weiden()[0].wid);
  await zaun(w1);
  log('Nach Einzäunen „Weide 1 vergrößern“:', await pg.evaluate(() => JSON.stringify(weiden().map(w => [w.name, w.ha]))));
  // 3. Pferde über Box – ppf – Ort – Weide auf verschiedene Weiden
  const aufWeideUI = async (boxNr, wahl) => {
    await pg.evaluate(n => { aktBox = n; spiel.aktBox = n; zeigeSchirm(null); zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; zeigeAkte(); }, boxNr);
    await klick('[data-ort="koppel"]'); await klick('[data-ort="weide"]');   // Weide liegt seit v293 unter „Koppel“
    const liste = await pg.$$eval('[data-wziel]', x => x.map(e => e.textContent.replace(/\s+/g, ' ').trim()));
    log('  Auswahl-Fenster:', liste.join(' | ') || '(keins)');
    if (liste.length) { await klick(`[data-wziel]:nth-of-type(${wahl + 1})`); }
    const dl = await pg.$('#dlg:not([hidden]) #dlgKnoepfe button'); if (dl) { log('  Hinweis:', await pg.$eval('#dlg h3', e => e.textContent)); await klick('#dlgKnoepfe button:first-child'); }
  };
  const boxen = await pg.evaluate(() => spiel.boxen.map((b, i) => b.pferd ? i : -1).filter(i => i >= 0));
  await aufWeideUI(boxen[0], 0); await aufWeideUI(boxen[1], 1);
  log('Pferde auf Weiden:', await pg.evaluate(() => JSON.stringify(spiel.boxen.filter(b => b.pferd).map(b => [b.pferd.name, b.pferd.weide ? weideVon(b.pferd).name : 'Box']))));
  await pg.evaluate(() => { hofBereich = 'weiden'; zeigeHof('hof'); });
  
  log('Sandpaddock bauen (2×):', await pg.evaluate(() => { const a = bauStarten('sandpaddock', 1); const c = bauStarten('sandpaddock', 1); $('dlg').hidden = true; return [a, c, gebaeude().filter(g => g.typ === 'sandpaddock').length, BAUTEN.sandpaddock.einmal ? 'nur einmal' : 'mehrfach'].join(' '); }));
  log('Fehler', errs);
  await b.close();
})();
