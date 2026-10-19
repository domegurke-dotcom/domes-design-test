// Chronik-Test (v548, PLAN-BILANZ.md B2 Teil 1): Zähler je Hof, Turnier-Klassen, höchster/tiefster Kontostand, Abgaben, Pfändung, Höfe
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/chronik-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false;
    const nacht = (n = 1) => { for (let i = 0; i < n && !spiel.verloren; i++) { naechsteNacht(); zu(); } };
    const neu = (o) => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const z = () => { const d = datum(); return d.j + '-' + d.s; };
    // --- 1. Zähler je Hof getrennt, alte globale Zähler bleiben ---
    spiel.chronik = undefined; spiel.protokoll = {}; const h1 = aktivHid();
    prot('Test A'); prot('Test A'); spiel.hof.hid = 'h2'; prot('Test A'); prot('Test B'); spiel.hof.hid = h1;
    ok('Hof 1 zählt 2× „Test A“', spiel.chronik[h1][z()].k['Test A'] === 2, JSON.stringify(spiel.chronik[h1][z()].k));
    ok('Hof 2 zählt getrennt (1× A, 1× B)', spiel.chronik.h2[z()].k['Test A'] === 1 && spiel.chronik.h2[z()].k['Test B'] === 1);
    ok('Globaler Zähler (Gesamt) bleibt: A = 3', spiel.protokoll[z()]['Test A'] === 3, JSON.stringify(spiel.protokoll[z()]));
    ok('Alter Spielstand ohne Chronik: prot legt sie an', (() => { delete spiel.chronik; prot('Neu'); return spiel.chronik[h1][z()].k.Neu === 1; })());
    // --- 2. Höchster/tiefster Kontostand je Jahreszeit ---
    let g = 0; while (datum().t !== 1 && g++ < 30) nacht(1); nacht(1); while (datum().t !== 1 && g++ < 60) nacht(1);   // frische Jahreszeit
    spiel.geld = 1000; spiel.chronik[h1] = {}; buchen(-300, 'Test'); buchen(500, 'Test'); buchen(-900, 'Test');
    const C = spiel.chronik[h1][z()]; ok('Start der Jahreszeit 1.000 €, höchster Stand 1.200 €', C.hoch === 1200, 'hoch ' + C.hoch);
    ok('Tiefster Stand 300 €', C.tief === 300, 'tief ' + C.tief);
    // --- 3. Turniere je Klasse + höchste Klasse ---
    const P = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Sportlerin' }); const t = { name: 'Hofturnier' };
    protKlasse('Start', P, t, { disz: 'dressur', stufe: 2 }); protKlasse('Sieg', P, t, { disz: 'dressur', stufe: 2 }); protKlasse('Platz', P, t, { disz: 'springen', stufe: 1 }); protKlasse('Start', P, t, { disz: 'dressur', stufe: 0 });
    const k = spiel.chronik[h1][z()].k; const namen = Object.keys(k).filter(x => /^Turnier /.test(x));
    ok('Zähler je Disziplin und Klasse', namen.length >= 3 && k[namen.find(x => /Dressur/.test(x) && /Sieg/.test(x))] === 1, namen.join(' | '));
    ok('Höchste Klasse Dressur = Stufe 2, Springen nicht (nur Platz)', spiel.chronik[h1].klasse.dressur === 2 && spiel.chronik[h1].klasse.springen == null, JSON.stringify(spiel.chronik[h1].klasse));
    ok('Klasse „ohne Klasse“ bei Stufe −1', turnierKlasse({ disz: 'dressur', stufe: -1 }) === 'ohne Klasse');
    // --- 4. Abgabe, Pfändung, Verkauf ---
    const S = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 22, name: 'Oma' }); spiel.boxen[0].pferd = S; aufGnadenhof(S, spiel.boxen[0]);
    ok('Abgabe: Gnadenhof gezählt', spiel.chronik[h1][z()].k['Abgabe: Gnadenhof'] === 1);
    const Q = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Pfand' }); spiel.boxen[1].pferd = Q; spiel.geld = -3000; pfaendung(null);
    ok('Pferd gepfändet gezählt', spiel.chronik[h1][z()].k['Pferd gepfändet'] === 1);
    // --- 5. Höfe ---
    spiel.chronikHoefe = undefined; chronikHof('gekauft', 'Zweiter Hof'); zwangsversteigerung(null);
    ok('Höfe: gekauft + verloren mit Name und Jahreszeit', spiel.chronikHoefe.length === 2 && spiel.chronikHoefe[0].was === 'gekauft' && spiel.chronikHoefe[1].was === 'verloren' && spiel.chronikHoefe[1].jz > 0, JSON.stringify(spiel.chronikHoefe));
    ok('Spiel verloren (letzter Hof) gesetzt', !!spiel.verloren);
    return out.join('\n');
  });
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
