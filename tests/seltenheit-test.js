// Seltenheits-Test (v556, PLAN-RARITAETEN.md R1): Gen-/Leistungs-Rarität, Stufen, Sichtbarkeit (Fellfarben-Test), Symbole, Plakette, Verkaufsfenster, Verteilung je Rasse
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/seltenheit-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; zu(); spiel.tippsAus = true; spiel.admin = false;
    const rein = (rasse, i, alter = 8, g = 'Stute') => { const p = neuesPferd({ id: 'sl' + rasse + i, rasse, plaetze: Array(8).fill(rasse), geschlecht: g, alter, name: 'Test' + i }); p.werte = p.werte || erzeugeWerte(p); p.pflege = erzeugePflege(p); return p; };
    // --- 1. Stufen aus Wahrscheinlichkeit ---
    ok('Stufen: 2,5 % selten, 0,5 % sehr selten, 0,05 % einzigartig, 0,005 % Ausnahme, 0,0005 % Jahrhundert, 5 % keine', [0.025, 0.005, 0.0005, 0.00005, 0.000005, 0.05].map(stufeVonP).join('') === '123450' && [0.03, 0.01, 0.001].map(stufeVonP).join('') === '123', 'Grenzen 3 % / 1 % / 0,1 % zählen mit');
    // --- 2. Gen-Rarität: Friese mit ee (E-Häufigkeit .98) ---
    const F = rein('friese', 1); F.gen = genVon(F); F.gen.E = ['e', 'e']; F.farbe = farbeAus(F.gen, F.ex);
    const sg = seltenGen(F); ok('Friese ee: Gen-Rarität, Wahrscheinlichkeit ≈ 0,04 % → einzigartig', sg && sg.p < 0.001 && sg.p > 0.0001 && sg.merkmale.some(m => m.k === 'E'), sg && sg.p);
    ok('Ohne Fellfarben-Test: keine Gen-Seltenheit sichtbar', seltenheit(F).gen === null && seltenheit(F).stufe === 0);
    F.tests = { farbe: true }; ok('Mit Fellfarben-Test: Stufe 3 (einzigartig)', seltenheit(F).stufe === 3, seltenheit(F).stufe);
    delete F.tests; spiel.admin = true; ok('Adminmodus sieht die Gen-Seltenheit immer', seltenheit(F).stufe === 3); spiel.admin = false;
    ok('Markt-/Alle-Modus (alle = true) ohne Test', seltenheit(F, true).stufe === 3);
    const M = rein('friese', 2); M.gen = genVon(M); M.gen.E = ['e', 'e']; M.anteile = { friese: 50, hannoveraner: 50 }; M.tests = { farbe: true }; M.werte.gang = { schritt: 10, trab: 10, galopp: 10 }; ok('Mischling: gar keine Seltenheit (weder Gen noch Leistung)', seltenGen(M) === null && seltenheit(M).stufe === 0 && seltenheit(M, true).stufe === 0 && seltenheit(M).leist === null);
    const H = rein('haflinger', 3); H.tests = { farbe: true }; let hg = 0; for (let i = 0; i < 300; i++) { const q = rein('haflinger', 100 + i); if (seltenGen(q)) hg++; } ok('Haflinger hat nur selten ein Gen-Merkmal (Schwelle 0,1; meist ohne Stufe)', hg <= 30, hg + ' von 300');
    const Hg = rein('shetty', 4, 8, 'Hengst'); Hg.gen = genVon(Hg); ok('Hengst mit BR1: X-Chromosom (nur ein Allel) rechnet ohne Fehler', (() => { Hg.gen.Br1 = ['BR1', 'n']; return typeof genotypProb(Hg.rasse, 'Br1', Hg.gen, true) === 'number'; })());
    // --- 3. Leistungs-Rarität: Ausbildung ---
    const L = rein('hannoveraner', 5); L.bilanz = { 'dressur|S': [3, 0, 1, 0] }; L.bilanzV = 3; L.erfolge = [{ disz: 'dressur', stufe: 4, platz: 2, plaziert: true }];
    ok('Klasse S + 1 Platzierung → selten (Stufe 1)', seltenheit(L).stufe === 1 && seltenheit(L).leist.art === 'Ausbildung', JSON.stringify(seltenheit(L).stufe));
    L.bilanz = { 'dressur|S': [8, 5, 1, 0] }; ok('≥ 5 Siege in S → sehr selten (Stufe 2)', seltenheit(L).stufe === 2);
    L.bilanz = { 'dressur|S': [20, 15, 1, 0], 'dressur|S (Meisterschaft)': [2, 1, 0, 0] }; L.erfolge = [1, 2, 3].map(() => ({ disz: 'dressur', stufe: 4, platz: 1, plaziert: true, art: 'gross' }));
    ok('≥ 15 Siege in S, davon 3 auf großen Turnieren → einzigartig (Stufe 3)', seltenheit(L).stufe === 3, seltenheit(L).stufe);
    L.erfolge = []; ok('15 Siege ohne große Turniere: nur sehr selten', seltenheit(L).stufe === 2);
    L.bilanz = { 'dressur|L': [30, 20, 5, 2] }; ok('Viele Siege in Klasse L zählen nicht (nicht die höchste Klasse)', seltenheit(L).leist === null || seltenheit(L).leist.art !== 'Ausbildung');
    const J = rein('hannoveraner', 6, 1); J.bilanz = { 'dressur|S': [30, 20, 5, 2] }; J.bilanzV = 3; ok('Unter 2 Jahren keine Leistungs-Seltenheit', seltenLeistung(J) === null);
    // --- 4. Leistungs-Rarität: Rang in der Rasse ---
    const G = rein('araber', 7); G.werte.gang = { schritt: 10, trab: 10, galopp: 10 }; ok('Gangwerk 10/10/10 beim Araber: obere 0,1 % → ≈ 0,2 % (sehr selten, Stufe 2)', Math.abs(seltenLeistung(G).p - 0.001999) < 1e-6 && seltenLeistung(G).art === 'Gangwerk' && seltenheit(G).stufe === 2, JSON.stringify(seltenLeistung(G)));
    const G2 = rein('araber', 8); G2.werte.gang = { schritt: 4, trab: 4, galopp: 4 }; G2.werte.charakter = { mut: 10, wachheit: 10, bezug: 10, wille: 10, nerven: 10 }; ok('Schwaches Pferd: keine Leistungs-Seltenheit', seltenLeistung(G2) === null);
    const C = rein('araber', 9); C.werte.gang = { schritt: 5, trab: 5, galopp: 5 }; C.werte.charakter = { mut: 99, wachheit: 99, bezug: 99, wille: 99, nerven: 99 }; ok('Charakter zählt nicht mehr (Charakter 99 → keine Leistungs-Seltenheit)', seltenLeistung(C) === null || seltenLeistung(C).art !== 'Charakter');
    const D1 = rein('araber', 11); D1.werte.gang = { schritt: 5, trab: 5, galopp: 5 }; D1.werte.charakter = { mut: 50, wachheit: 50, bezug: 50, wille: 50, nerven: 50 }; const tg = SELTEN_SCHWELLE.araber; D1.werte.gang = { schritt: tg[0] + 0.05, trab: tg[0] + 0.05, galopp: tg[0] + 0.05 }; ok('Obere 5 % in einer Kategorie reicht allein noch nicht (zwei Chancen ≈ 10 %)', !(seltenLeistung(D1) && seltenLeistung(D1).art === 'Gangwerk'));
    // --- 5. Gen und Leistung werden multipliziert ---
    const K = rein('friese', 10); K.gen = genVon(K); K.gen.E = ['e', 'e']; K.farbe = farbeAus(K.gen, K.ex); K.tests = { farbe: true }; K.werte.gang = { schritt: 10, trab: 10, galopp: 10 };
    const sk = seltenheit(K); ok('Gen (≈0,04 %) × Leistung (0,1 %) ≈ 0,00004 % → Jahrhundertpferd (Stufe 5)', sk.stufe === 5 && Math.abs(sk.p - sk.gen.p * sk.leist.p) < 1e-12, sk.stufe + ' / ' + sk.p);
    // --- 6. Anzeige ---
    ok('5 Symbole, jedes mit eigener Farbverlauf-ID', [1, 2, 3, 4, 5].every(s => /<svg/.test(seltenSymbol(s))) && new Set([1, 2, 3, 4, 5].map(s => (seltenSymbol(s).match(/id="(sg\d+)"/) || [])[1])).size === 5);
    ok('Marke hinter dem Namen nur bei Stufe > 0', seltenMarke(K).includes('data-selten') && seltenMarke(G2) === '');
    ok('Plakette (rund) bei seltenen Pferden', plakettenVon(K).some(x => x.rund && x.stufe === 5) && !plakettenVon(G2).some(x => x.rund));
    ok('Plakette im Boxbild', /<circle/.test(plakettenSVG([K])));
    spiel.boxen[0].pferd = K; K.pflege.gesundheit = 100; verkaufDialog(K, () => {}); ok('Verkaufsfenster: Hinweis „nur auf dem Raritäten-Markt“', /nur auf dem Raritäten-Markt mehr wert/.test(document.getElementById('dlgInhalt').innerText)); zu();
    seltenDialog(K); const dt = document.getElementById('dlgInhalt').innerText; ok('Info-Fenster: Stufe, Gene, Leistung, Hinweis', /Jahrhundertpferd/.test(dt) && /Extension/.test(dt) && /Gangwerk/.test(dt) && /Raritäten-Markt/.test(dt), dt.replace(/\s+/g, ' ').slice(0, 160)); zu();
    // --- 7. Verteilung je Rasse (Stichprobe 400) ---
    const zeilen = []; let ausserhalb = [];
    RASSEN.forEach(ra => { let n = 0; for (let i = 0; i < 400; i++) { const q = rein(ra.id, 5000 + i, 8, i % 2 ? 'Hengst' : 'Stute'); if (seltenheit(q, true).stufe > 0) n++; } const pr = n / 4; zeilen.push(ra.id + ' ' + pr.toFixed(1)); if (pr > 30) ausserhalb.push(ra.id + ' ' + pr.toFixed(1)); });
    ok('Verteilung: keine Rasse mit mehr als 30 % „selten“ (Stichprobe je 400)', ausserhalb.length === 0, ausserhalb.join(', ') || zeilen.slice(0, 6).join(', ') + ' …');
    return out.join('\n');
  });
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
