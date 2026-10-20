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
    ok('Nächste Kontrolle in den nächsten 2 Jahreszeiten', V.naechsteKontrolle && V.naechsteKontrolle.tag > spiel.tag && V.naechsteKontrolle.tag <= spiel.tag + 2 * tpj() + 1 && V.naechsteKontrolle.art === 'vorfall', JSON.stringify(V.naechsteKontrolle) + ' / heute ' + spiel.tag);
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
    ok('Gesundes Pferd hat keinen Ausnahmegrund', vetAusnahme(neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Gesund' })) === null);
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
    // --- 9. V2: Kontrollen, Auflagen, Meldungen ---
    const einBox = (name, o = {}) => { frisch(); const p = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); p.gekauftTag = -99; const bx = box(0, p, true); Object.assign(bx, o); return { p, bx }; };
    let X = einBox('Luna', { mistig: true, mistStufe: 1 }); X.p.pflege.huf = spiel.tag;
    ok('Kontrolle: Morgenmist (Stufe 1) und frische Hufe sind kein Mangel', vetMaengel().length === 0);
    X.bx.krippeVoll = false; ok('Kontrolle: leere Krippe am Morgen zählt nicht', vetMaengel().length === 0);
    X.bx.mistStufe = 2; ok('Kontrolle: 1 Tag nicht gemistet (Stufe 2) zählt nicht', vetMaengel().length === 0);
    X.bx.mistStufe = 3; ok('Kontrolle: Stufe 3 (2 Tage nicht gemistet) ist ein Mangel mit Box und Pferd', vetMaengel().length === 1 && /Box 1 \(Luna\)/.test(vetMaengel()[0].text) && /seit 2 Tagen/.test(vetMaengel()[0].text), vetMaengel().map(m => m.text).join());
    X.bx.mistStufe = 1; X.bx.hunger = { pid: X.p.id, bits: 0b011 }; ok('Futter: 2 von 3 Nächten hungrig = Mangel, 1 von 3 nicht', vetMaengel().some(m => m.art === 'futter')); X.bx.hunger.bits = 0b001; ok('…1 von 3 Nächten ist keiner', !vetMaengel().some(m => m.art === 'futter'));
    X.bx.hunger = { pid: 'anderes-pferd', bits: 7 }; ok('Hunger-Bits eines früheren Pferdes in der Box zählen nicht', !vetMaengel().some(m => m.art === 'futter'));
    X.bx.stufe = 1; X.bx.durst = { pid: X.p.id, bits: 0b11 }; ok('Wasser: 2 Nächte ohne Wasser (Boxstufe 1) = Mangel', vetMaengel().some(m => m.art === 'wasser')); X.bx.durst.bits = 0b01; ok('…eine Nacht nicht', !vetMaengel().some(m => m.art === 'wasser')); X.bx.durst.bits = 0;
    X.p.pflege.huf = spiel.tag - hufIntervall(X.p) - 10; ok('Hufe: weit überfällig = Mangel', vetMaengel().some(m => m.art === 'huf')); X.p.pflege.huf = spiel.tag;
    X.p.dreck = { fell: 80, maehne: 0, seit: spiel.tag - tpj() - 2 }; ok('Dreck: länger als eine Jahreszeit = Mangel', vetMaengel().some(m => m.art === 'dreck')); delete X.p.dreck;
    const kr = befundNeu(X.p, 'husten', 3, 'Test'); ok('Krankheit mittel ohne Behandlung = Mangel', vetMaengel().some(m => m.art === 'krankheit')); kr.diagnose = spiel.tag; kr.tierarzt = true; X.p.behHeute = { tag: spiel.tag, a: { tierarzt: true } }; ok('…in Behandlung nicht', !vetMaengel().some(m => m.art === 'krankheit')); X.p.befunde = []; delete X.p.behHeute;
    X.p.pflege.gesundheit = 20; ok('Gesundheit unter 30 % ohne Grund = Mangel', vetMaengel().some(m => m.art === 'gesundheit')); X.p.pflege.gesundheit = 80;
    X.p.gekauftTag = spiel.tag; X.bx.mistStufe = 5; ok('Neu gekauftes Pferd (erste 7 Tage): keine Mängel', vetMaengel().length === 0); X.p.gekauftTag = -99;
    // Kontrolle ohne / mit Mängeln, Auflage mit Frist
    X.bx.mistStufe = 1; vetKontrolle('vorfall'); ok('Kontrolle ohne Mängel: Brief „ohne Beanstandung“, keine Auflage', briefe(/ohne Beanstandung/) === 1 && !vetDaten().auflage);
    X.bx.mistStufe = 4; const alteTempo = spiel.tempo; vetKontrolle('vorfall'); const AU = vetDaten().auflage;
    ok('Kontrolle mit Mängeln: Brief mit Box und Pferd, Auflage', briefe(/mit Beanstandungen/) === 1 && /Box 1 \(Luna\)/.test(spiel.post.find(x => /mit Beanstandungen/.test(x.betreff)).text) && AU && AU.maengel.length === 1);
    ok('Auflage-Frist mindestens 7 Spieltage (auch bei kurzer Jahreszeit)', AU.bis - spiel.tag >= 7, 'bis Tag ' + AU.bis + ', heute ' + spiel.tag + ', tpj ' + tpj());
    vetDialog(); ok('Fenster zeigt offene Auflage mit Frist', /Offene Auflage/.test($('dlgInhalt').textContent) && /Frist bis Tag/.test($('dlgInhalt').textContent)); zu();
    // Nachkontrolle behoben / nicht behoben
    X.bx.mistStufe = 1; const vor1 = vetDaten().vorfaelle.length; spiel.tag = AU.bis + 1; vetKontrolleTag();
    ok('Nachkontrolle mit behobenen Mängeln: „Auflage erfüllt“, kein Vorfall', briefe(/Auflage erfüllt/) === 1 && !vetDaten().auflage && vetDaten().vorfaelle.length === vor1);
    X.bx.mistStufe = 4; vetKontrolle('vorfall'); const AU2 = vetDaten().auflage; X.bx.mistStufe = 5; spiel.tag = AU2.bis + 1; vetKontrolleTag();
    ok('Nachkontrolle mit unbehobenen Mängeln: neuer Vorfall (Brief „nicht erfüllt“)', briefe(/Auflage nicht erfüllt/) === 1 && vetDaten().vorfaelle.length === vor1 + 1 && !vetDaten().auflage);
    // Meldungen
    X = einBox('Mela', { mistig: true, mistStufe: 1 }); X.p.pflege.huf = spiel.tag; const r1 = Math.random; let hits = 0;
    Math.random = () => 0; for (let i = 0; i < 60; i++) vetMeldungTag(); Math.random = r1; ok('Anonyme Meldung: ohne Mängel nie, auch bei Zufall 0', !vetDaten().meldung && briefe(/Hinweis zur Tierhaltung/) === 0);
    X.bx.mistStufe = 4; Math.random = () => 0.99; for (let i = 0; i < 30; i++) vetMeldungTag(); Math.random = r1; ok('Mit Mängeln, aber ohne Glück: keine Meldung', !vetDaten().meldung);
    Math.random = () => 0.001; vetMeldungTag(); Math.random = r1; const KM = vetDaten().naechsteKontrolle;
    ok('Mit Mängeln und Glück: Meldung → Brief ohne Absender-Hinweis, Kontrolle innerhalb von 7 Tagen', !!vetDaten().meldung && briefe(/Hinweis zur Tierhaltung/) === 1 && KM && KM.art === 'meldung' && KM.tag > spiel.tag && KM.tag <= spiel.tag + 7 && !/Nachbar|Einsteller|Tierarzt/.test(spiel.post[0].text), JSON.stringify(KM));
    Math.random = () => 0.001; vetMeldungTag(); Math.random = r1; ok('Höchstens eine offene Meldung gleichzeitig', briefe(/Hinweis zur Tierhaltung/) === 1);
    spiel.tag = KM.tag; vetKontrolleTag(); ok('Die Kontrolle läuft am genannten Tag, danach ist die Meldung erledigt', vetDaten().kontrollen.length >= 1 && !vetDaten().meldung && !vetDaten().naechsteKontrolle && !!vetDaten().auflage);
    // Meldung durch Einsteller, Tierarzt, Hufschmied
    X = einBox('Besuch', { mistig: true, mistStufe: 4 }); Math.random = () => 0; vetMeldungVon('tierarzt', X.bx); Math.random = r1; ok('Tierarzt sieht einen Mangel und meldet (Chance 50 %)', !!vetDaten().meldung && vetDaten().meldung.quelle === 'tierarzt');
    X = einBox('Besuch2', { mistig: true, mistStufe: 1 }); Math.random = () => 0; vetMeldungVon('hufschmied', X.bx); Math.random = r1; ok('Ohne Mangel meldet niemand', !vetDaten().meldung);
    // Pensionsansehen bei Mängeln
    X = einBox('Pens', { mistig: true, mistStufe: 4 }); X.p.pflege.huf = spiel.tag; const ans0 = pensionRegeln().ansehen; spiel.einsteller = [{ eid: 'e1', pid: X.p.id }]; vetKontrolle('vorfall'); const ans1 = pensionRegeln().ansehen; spiel.einsteller = [];
    ok('Kontrolle mit Mängeln senkt das Pensionsansehen um 3 (mit Einsteller)', ans1 === ans0 - 3, ans0 + ' → ' + ans1);
    // Kontrollhof existiert nicht mehr
    frisch(); vetDaten().naechsteKontrolle = { tag: spiel.tag, hid: 'gibtsnicht', art: 'vorfall' }; vetKontrolleTag(); ok('Kontrolle für einen nicht mehr vorhandenen Hof wird verworfen', vetDaten().naechsteKontrolle === null);
    // --- 10. Ablauf über echte Nächte: Vorfall → Kontrolle am geplanten Tag ---
    frisch(); spiel.stufenAn = false; const pk = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Fein' }); pk.gekauftTag = -99; box(0, pk, true); vetVorfall('admin', 'Testvorfall', { neu: true });
    const kt = vetDaten().naechsteKontrolle.tag, b0 = briefe(/ohne Beanstandung/); let n = 0; while (spiel.tag <= kt && n++ < 40) { spiel.boxen[0].krippeVoll = true; spiel.boxen[0].mistig = false; spiel.boxen[0].wasserTag = spiel.tag; pk.pflege.huf = spiel.tag; nacht(1); }
    ok('Über die Nächte: Kontrolle fand am geplanten Tag statt (ohne Mängel → „ohne Beanstandung“)', vetDaten().kontrollen.length === 1 && vetDaten().kontrollen[0].tag === kt && briefe(/ohne Beanstandung/) === b0 + 1 && !vetDaten().naechsteKontrolle, JSON.stringify(vetDaten().kontrollen) + ' kt ' + kt + ' brief ' + briefe(/ohne Beanstandung/) + ' nk ' + JSON.stringify(vetDaten().naechsteKontrolle));
    window.buchen = buchen0; return out;
  });
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
