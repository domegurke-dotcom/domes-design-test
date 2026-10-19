// Bestenliste-Test (v549, PLAN-BILANZ.md B2 Teil 2): 3 beste / 3 wertvollste je Hof, Verlassen des Hofs, Archiv-Schutz, Anzeige mit anklickbarem Namen
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/bestenliste-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false; spiel.geld = 1e6;
    const g0 = spiel.boxen[0]; while (spiel.boxen.length < 10) spiel.boxen.push({ nr: spiel.boxen.length + 1, pferd: null, krippeVoll: false, mistig: false, mistStufe: 0, tot: false, geb: g0.geb, stufe: g0.stufe });
    const neu = (o) => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const erf = (p, siege, plaetze) => { p.erfolge = []; for (let i = 0; i < siege; i++) p.erfolge.push({ tag: 1, platz: 1, plaziert: true }); for (let i = 0; i < plaetze; i++) p.erfolge.push({ tag: 1, platz: 2, plaziert: true }); };
    const h = aktivHid(); spiel.chronik = undefined; spiel.archiv = {}; spiel.friedhof = [];
    // --- 1. Auswertung: 3 beste, 3 wertvollste, Pensionspferd zählt nicht ---
    const P = [['A', 5, 0, 'shetty'], ['B', 2, 3, 'hannoveraner'], ['C', 1, 0, 'hannoveraner'], ['D', 0, 4, 'araber'], ['E', 0, 0, 'vollblut']].map(([n, s, pl, r], i) => { const p = neu({ rasse: r, geschlecht: 'Stute', alter: 8, name: n }); erf(p, s, pl); spiel.boxen[i].pferd = p; return p; });
    const F = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Fremd' }); F.einsteller = 'x'; erf(F, 9, 9); spiel.boxen[5].pferd = F;
    bestenAlle(); const L = spiel.chronik[h];
    ok('Beste: höchstens 3, nach Punkten (A 15, B 9, D 4)', L.beste.length === 3 && L.beste.map(x => x.n).join('') === 'ABD', L.beste.map(x => x.n + x.e).join(' '));
    ok('Wertvollste: 3 Einträge, absteigend', L.wertvoll.length === 3 && L.wertvoll[0].w >= L.wertvoll[1].w && L.wertvoll[1].w >= L.wertvoll[2].w, L.wertvoll.map(x => x.n + ' ' + x.w).join(' '));
    ok('Pferd ohne Erfolg (E) nicht bei den Besten', !L.beste.some(x => x.n === 'E'));
    ok('Pensionspferd zählt nicht', !L.beste.concat(L.wertvoll).some(x => x.n === 'Fremd'));
    ok('Mini-Eintrag, kein ganzes Pferd', JSON.stringify(L).length < 1500, JSON.stringify(L).length + ' Zeichen');
    // --- 2. Verlassen des Hofs: letzter Stand bleibt, Archiv-Schutz ---
    erf(P[0], 6, 0); const bi = spiel.boxen[0]; archivieren(P[0]); bi.pferd = null;
    ok('Verkauftes Pferd A bleibt in der Liste mit letztem Stand (18 Punkte)', spiel.chronik[h].beste[0].n === 'A' && spiel.chronik[h].beste[0].e === 18, JSON.stringify(spiel.chronik[h].beste[0]));
    for (let i = 0; i < 45; i++) { const d = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 5, name: 'Dummy' + i }); spiel.boxen[6].pferd = d; archivieren(d); spiel.boxen[6].pferd = null; }
    ok('Archiv-Limit 40: A ist trotzdem noch da (geschützt)', !!spiel.archiv[P[0].id], Object.keys(spiel.archiv).length + ' Einträge');
    ok('Archiv wächst nicht über 40 + Schutz hinaus', Object.keys(spiel.archiv).length <= 40 + bestenIds().size);
    // --- 3. Tod und Rückgabe ---
    spiel.boxen[1].pferd = P[1]; erf(P[1], 4, 0); begraben(P[1], 'Test'); spiel.boxen[1].pferd = null;
    ok('Verstorbenes Pferd B zählt mit letztem Stand (12 Punkte)', spiel.chronik[h].beste.find(x => x.n === 'B').e === 12);
    // --- 4. Anzeige ---
    const html = bestenKarteHTML();
    ok('Anzeige: Namen anklickbar (data-ansehen) für verkauftes und verstorbenes Pferd', (html.match(/data-ansehen=/g) || []).length >= 2, (html.match(/data-ansehen=/g) || []).length + ' Links');
    ok('Anzeige: „Stand beim Verkauf/Abgang“ beim verkauften Pferd', /A<\/b>[^<]*·[^<]*·[^<]*<br><small>Stand beim Verkauf\/Abgang/.test(html));
    ok('Anzeige: „verstorben“ beim toten Pferd', /B<\/b>[^]*?<small>verstorben/.test(html));
    // --- 5. Alter Spielstand ohne Chronik ---
    spiel.chronik = undefined; ok('Ohne Chronik: Auswertung läuft ohne Fehler', (() => { bestenAlle(); return !!spiel.chronik[h]; })());
    spiel.chronik = undefined; ok('Ohne Daten keine Karte', bestenKarteHTML() === '');
    return out.join('\n');
  });
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
