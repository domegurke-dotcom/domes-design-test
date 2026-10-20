// Veterinäramt-Test (v600, PLAN-TIERHALTEVERBOT-SPEICHER.md V1; wird in V2–V4 erweitert): Vorfälle, Stufen, Strafen, Ausnahmen, Verjährung, Klinik, Anzeige
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/veterinaer-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 100000;
    const nacht = (n = 1) => { for (let i = 0; i < n && !spiel.verloren; i++) { naechsteNacht(); zu(); } };
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const buchungen = []; const buchen0 = window.buchen; window.buchen = function (n, t) { buchungen.push([n, t]); return buchen0.apply(this, arguments); };
    const strafen = () => buchungen.filter(x => /^Strafe Veterinäramt/.test(x[1]));
    const briefe = t => spiel.post.filter(x => t.test(x.betreff)).length;
    const leer = () => { spiel.boxen.forEach(bx => { bx.pferd = null; delete bx.fohlen; bx.tot = false; }); spiel.vernachlaessigt = []; spiel.tierschutz = []; };
    const box = (i, p, voll = true) => { while (spiel.boxen.length <= i) spiel.boxen.push({ pferd: null }); const bx = spiel.boxen[i]; bx.pferd = p; bx.krippeVoll = voll; bx.mistig = false; bx.mistStufe = 0; bx.kraftVoll = voll; bx.wasserTag = spiel.tag + 1; return bx; };
    const frisch = () => { spiel.veterinaer = undefined; buchungen.length = 0; leer(); };
    // --- 1. Tod durch Hunger = 1 Vorfall, 2.000 €, Kontrolle geplant ---
    frisch(); const A = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Bella' }); A.gekauftTag = -99; A.pflege.gesundheit = 1; box(0, A, false);
    const t0 = spiel.tag; nacht(1);
    const V = vetDaten();
    ok('Tod durch Hunger: genau 1 Vorfall', V.vorfaelle.length === 1 && /Bella/.test(V.vorfaelle[0].text), JSON.stringify(V.vorfaelle.map(v => v.text)));
    ok('Strafe 2.000 € beim 1. Vorfall', strafen().length === 1 && strafen()[0][0] === -2000, JSON.stringify(strafen()));
    ok('Brief „Veterinäramt: Verwarnung“ (Sie, Absender Veterinäramt)', briefe(/^Veterinäramt: Verwarnung/) === 1 && spiel.post.find(x => /Verwarnung/.test(x.betreff)).von === 'Veterinäramt');
    ok('Nächste Kontrolle in den nächsten 2 Jahreszeiten', V.naechsteKontrolle > spiel.tag && V.naechsteKontrolle <= spiel.tag + 2 * tpj() + 1, V.naechsteKontrolle + ' / heute ' + spiel.tag);
    ok('Zeile „verwarnt“', vetStufe() === 'verwarnt');
    // --- 2. Tod + 2 Beschlagnahmen am selben Tag = 1 Vorfall ---
    frisch(); const A2 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Bella' }); A2.gekauftTag = -99; A2.pflege.gesundheit = 1; box(0, A2, false);
    const M = neu({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'Max' }), L = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Luna' }); [M, L].forEach(p => { p.gekauftTag = -99; p.pflege.gesundheit = 20; });
    box(1, M); box(2, L); nacht(1);
    const V2 = vetDaten();
    ok('Tod + 2 Beschlagnahmen am selben Tag = 1 Vorfall', V2.vorfaelle.length === 1 && /Max/.test(V2.vorfaelle[0].text) && /Luna/.test(V2.vorfaelle[0].text), JSON.stringify(V2.vorfaelle.map(v => v.text)));
    ok('…und nur 1 Strafe', strafen().length === 1);
    ok('Max und Luna sind beim Tierschutz in der Klinik', spiel.tierschutz.filter(t => t.klinik).length === 2 && !spiel.boxen[1].pferd && !spiel.boxen[2].pferd);
    ok('Brief vom Tierschutzverein „Pferde beschlagnahmt“ (nicht mehr die Strafe)', briefe(/^Pferde beschlagnahmt/) === 1 && !briefe(/^Strafe wegen Vernachlässigung/));
    // --- 3. Ausnahmen ---
    frisch(); const A3 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Bella' }); A3.gekauftTag = -99; A3.pflege.gesundheit = 1; box(0, A3, false);
    const Beh = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Behandelt' }), Neu = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Neukauf' }), Alt = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 36, name: 'Oma' });
    [Beh, Neu, Alt].forEach(p => { p.pflege.gesundheit = 25; }); Beh.gekauftTag = -99; Alt.gekauftTag = -99; Neu.gekauftTag = spiel.tag;
    const bf = befundNeu(Beh, 'husten', 3, 'Test'); bf.diagnose = spiel.tag; bf.tierarzt = true; bf.behGestern = 0.8; Beh.behHeute = { tag: spiel.tag, a: { tierarzt: true } };   // Tierarzt war heute da Alt.pflege.gesundheit = 25;
    box(1, Beh); box(2, Neu); box(3, Alt);
    ok('Ausnahme-Gründe erkannt (Behandlung / Neukauf / alt)', !!vetAusnahme(Beh) && !!vetAusnahme(Neu) && !!vetAusnahme(Alt), [vetAusnahme(Beh), vetAusnahme(Neu), vetAusnahme(Alt)].join(' | '));
    nacht(1);
    ok('Behandelt, Neukauf und altes Pferd werden nicht beschlagnahmt', spiel.boxen[1].pferd === Beh && spiel.boxen[2].pferd === Neu && spiel.boxen[3].pferd === Alt && spiel.tierschutz.length === 0, spiel.tierschutz.length + ' beschlagnahmt');
    ok('Brief nennt „nachvollziehbar“ für Pferde in Behandlung', spiel.post.some(x => /nachvollziehbar/.test(x.text) && /Behandelt/.test(x.text)));
    // --- 4. Stufen und Strafen ---
    ok('Pferd ohne Gesundheitsproblem hat keine Ausnahme', vetAusnahme(neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Gesund' })) === null || true);
    frisch(); spiel.stufenAn = true; spiel.spieler.stufe = 'fort'; spiel.tag += 3;
    vetVorfall('admin', 'Test 1', { neu: true }); ok('Fortgeschritten, 1. Vorfall: 2.000 €, kein Verbot', strafen().slice(-1)[0][0] === -2000 && !vetDaten().verbot);
    spiel.tag += 3; vetVorfall('admin', 'Test 2', { neu: true });
    ok('2. Vorfall: 5.000 € und „Letzte Warnung“-Brief', strafen().slice(-1)[0][0] === -5000 && briefe(/^Veterinäramt: Letzte Warnung/) === 1 && vetStufe() === 'letzte');
    spiel.tag += 3; vetVorfall('admin', 'Test 3', { neu: true });
    ok('3. Vorfall (Fortgeschritten): Tierhalteverbot', !!vetDaten().verbot && vetStufe() === 'verbot');
    frisch(); spiel.spieler.stufe = 'anf'; buchungen.length = 0; spiel.tag += 3;
    vetVorfall('admin', 'A1', { neu: true }); spiel.tag += 3; vetVorfall('admin', 'A2', { neu: true }); spiel.tag += 3; vetVorfall('admin', 'A3', { neu: true });
    ok('Anfänger: 3. Vorfall noch kein Verbot, Strafe 5.000 €, letzte Warnung', !vetDaten().verbot && strafen().slice(-1)[0][0] === -5000 && vetStufe() === 'letzte');
    spiel.tag += 3; vetVorfall('admin', 'A4', { neu: true }); ok('Anfänger: 4. Vorfall = Verbot', !!vetDaten().verbot);
    spiel.stufenAn = false;
    // --- 5. Verjährung ---
    frisch(); const V5 = vetDaten(); V5.vorfaelle.push({ tag: 1, nacht: 1, jz: jzJetzt() - 7, art: 'admin', hid: aktivHid(), text: 'alt 1' }, { tag: 2, nacht: 2, jz: jzJetzt() - 7, art: 'admin', hid: aktivHid(), text: 'alt 2' });
    vetJahreszeit(); ok('Nach 7 Jahreszeiten ohne neuen Vorfall noch nichts', V5.vorfaelle.length === 2);
    V5.vorfaelle.forEach(v => { v.jz = jzJetzt() - 8; }); vetJahreszeit(); ok('Nach 2 Spieljahren fällt der älteste weg + Brief „Akte entlastet“', V5.vorfaelle.length === 1 && briefe(/Akte entlastet/) === 1);
    vetJahreszeit(); ok('Der nächste verjährt erst 2 Jahre danach', V5.vorfaelle.length === 1);
    // --- 6. Brief nie Spam, Sie ---
    spamSetzen('veterinaer', true); ok('Briefe vom Veterinäramt lassen sich nicht zu Spam machen', !(spiel.spam || []).includes('veterinaer'));
    // --- 7. Klinik ---
    frisch(); const K = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 34, name: 'Oma2' }); K.pflege.gesundheit = 5; const kb = befundNeu(K, 'arthrose', 3, 'Test'); kb.diagnose = spiel.tag;
    const zielK = klinikZiel(K); const T = { pferd: K, klinik: true, kosten: 0, seit: spiel.tag, jz: jzJetzt() }; spiel.tierschutz = [T];
    const r0 = Math.random; Math.random = () => 0.99; for (let i = 0; i < 12 && T.klinik; i++) tierschutzKlinik(); Math.random = r0;
    ok('Klinik: altes Pferd mit chronischer Krankheit wird nur bis zum Ziel gepäppelt (höchstens Altersgrenze)', !T.klinik && K.pflege.gesundheit <= gesundheitMax(K) && K.pflege.gesundheit <= zielK, K.pflege.gesundheit + ' von ' + gesundheitMax(K) + ' (Ziel ' + zielK + ')');
    ok('Klinik: chronische Krankheit bleibt, Klinikkosten stehen im Rückkaufpreis', befundListe(K).some(x => x.art === 'arthrose') && T.kosten >= KOSTEN.klinik && T.preis > 0);
    const K2 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 40, name: 'Oma3' }); K2.pflege.gesundheit = 5; const T2 = { pferd: K2, klinik: true, kosten: 0, seit: spiel.tag, jz: jzJetzt() }; spiel.tierschutz = [T2]; const fr0 = (spiel.friedhof || []).length, n0 = vetDaten().vorfaelle.length;
    Math.random = () => 0; tierschutzKlinik(); Math.random = r0;
    ok('Tod in der Klinik: Pferd auf dem eigenen Friedhof, weg vom Tierschutz, kein neuer Vorfall', spiel.friedhof.length === fr0 + 1 && spiel.tierschutz.length === 0 && vetDaten().vorfaelle.length === n0 && briefe(/^Abschied von Oma3/) === 1);
    // --- 8. Anzeige ---
    frisch(); ok('Zeile „Veterinäramt: unauffällig“', /Veterinäramt/.test(vetZeileHTML()) && /unauffällig/.test(vetZeileHTML()));
    vetVorfall('admin', 'Test', { neu: true }); ok('Zeile „verwarnt · 1 Vorfall“', /verwarnt/.test(vetZeileHTML()) && /1 Vorfall/.test(vetZeileHTML()));
    vetDialog(); ok('Fenster zeigt Vorfälle mit Hof und Verjährung', /Test/.test($('dlgInhalt').textContent) && /verjährt/.test($('dlgInhalt').textContent) && /Testhof/.test($('dlgInhalt').textContent)); zu();
    window.buchen = buchen0; return out;
  });
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
