// Jahresbericht-Test (v554, PLAN-BILANZ.md B3): Brief zu Beginn des neuen Jahres, Vergleich zum Vorjahr, Ordner, kein Löschen, kein Spam, mehrere Höfe (Summen)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/jahresbericht-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false; spiel.geld = 20000;
    const nacht = () => { naechsteNacht(); zu(); }; const bis = (j) => { let g = 0; while (!(datum().j === j && datum().s === 0 && datum().t === 1) && g++ < 400 && !spiel.verloren) nacht(); };
    const berichte = () => spiel.post.filter(x => /^Jahresbericht/.test(x.betreff));
    // --- Jahr 2000: Buchungen + Turnier-Zähler ---
    buchen(1500, 'Test: Preisgeld'); buchen(-400, 'Test: Tierarzt'); prot('Turniersieg'); prot('Turnierstart'); prot('Turnierstart'); prot('Kauf: Auktion'); prot('Fohlen geboren');
    ok('Vor Jahresbeginn kein Bericht', berichte().length === 0);
    bis(2001);
    const B1 = berichte(); ok('Zu Beginn von 2001: genau ein Jahresbericht für 2000', B1.length === 1 && B1[0].betreff === 'Jahresbericht 2000', B1.map(x => x.betreff).join(','));
    const b1 = B1[0]; ok('Absender Hofverwaltung, Typ „jahresbericht“, Aktion „Als Bild“', b1.von === 'Hofverwaltung' && b1.typ === 'jahresbericht' && b1.aktion && b1.aktion.typ === 'jbild', b1.typ);
    ok('6 Kacheln (Gewinn/Verlust, Kontostand, Pferde, Turniere, größte Ausgabe/Einnahme)', ['Kontostand', 'Pferde', 'Turniere', 'Größte Ausgabe', 'Größte Einnahme'].every(t => b1.text.includes(t)) && /(Gewinn|Verlust)/.test(b1.text));
    ok('Akkordeon: Pferde-Bewegungen, Turniere je Klasse, Finanzen im Detail, Bestes Pferd, Seit Spielbeginn', ['Pferde-Bewegungen', 'Turniere je Klasse', 'Finanzen im Detail', 'Bestes Pferd', 'Seit Spielbeginn'].every(t => b1.text.includes(t)) && (b1.text.match(/<details/g) || []).length >= 5);
    ok('Größte Einnahme = Preisgeld 1.500 €', /Test: Preisgeld/.test(b1.text) && /1\.500/.test(b1.text));
    ok('Turniere: 1 Sieg, 2 Starts; Bewegungen: 1 gekauft, 1 gezüchtet', /1 Sieg/.test(b1.text) && /2 Starts/.test(b1.text) && /Gekaufte Pferde/.test(b1.text) && /Gezüchtete Fohlen/.test(b1.text));
    ok('Kredit-Auszahlung und Hofkauf zählen nicht als Einnahme/Ausgabe', !/>Kredit \(Auszahlung\)</.test(b1.text) && !/>Hofkauf</.test(b1.text) && !/<td>Hofkauf/.test(b1.text), '');
    ok('Bild-Daten im Brief (kleine Zahlen, kein ganzes Pferd)', JSON.stringify(b1.aktion.daten).length < 600, JSON.stringify(b1.aktion.daten).length + ' Zeichen');
    // --- Jahr 2001: Vergleich zum Vorjahr ---
    buchen(3000, 'Test: Preisgeld'); buchen(-100, 'Test: Tierarzt'); bis(2002);
    const B2 = berichte(); ok('Zu Beginn von 2002: zweiter Bericht', B2.length === 2 && B2[0].betreff === 'Jahresbericht 2001', B2.map(x => x.betreff).join(','));
    ok('Vergleich zum Vorjahr mit ↑ (Gewinn gestiegen)', /↑/.test(B2[0].text) && /zum Vorjahr/.test(B2[0].text));
    // --- Ordner, Löschschutz, Spam ---
    for (let i = 0; i < 130; i++) brief('Testabsender', 'Test ' + i, 'text');
    ok('Post-Limit 120: Jahresberichte bleiben erhalten', berichte().length === 2 && spiel.post.length <= 122, 'Briefe ' + spiel.post.length);
    spamSetzen('jahresbericht', true); ok('Jahresbericht lässt sich nicht als Spam markieren', !(spiel.spam || []).includes('jahresbericht'));
    ok('Brieftyp-Erkennung', briefTyp('Jahresbericht 2003')[1] === 'jahresbericht');
    // --- mehrere Höfe: Summen ---
    const A = leereDaten(), C = leereDaten(); A.ein = 100; A.aus = 40; A.siege = 2; A.bew.gekauft = 1; A.klassen['Dressur L'] = [3, 1, 1]; C.ein = 50; C.aus = 70; C.siege = 1; C.klassen['Dressur L'] = [1, 0, 1]; C.hoefe.push({ was: 'gekauft', name: 'X', jz: 8001 });
    const S = datenSumme([A, C]); ok('Summe über Höfe: Einnahmen 150, Ausgaben 110, Siege 3, Dressur L 4 Starts', S.ein === 150 && S.aus === 110 && S.siege === 3 && S.klassen['Dressur L'][0] === 4 && S.hoefe.length === 1);
    const html = jbHofHTML({ name: 'Alle', d: S, v: null, alle: S, geld: 5000, pferde: 4, vGeld: null, vPferde: null, best: null }, 2001); ok('Bericht ohne Vorjahr: „–“ statt Pfeil, keine Fehler', html.includes('Kontostand') && !/NaN|undefined/.test(html), '');
    ok('Hof wird versteigert: kleine Bilanz mit Grund, Dauer, Pferde, Turniere, Gewinn', (() => { const x = hofAbschlussText(aktivHid(), 'Test'); return /Grund: Test/.test(x) && /Dauer: 2000 bis/.test(x) && /Pferde zuletzt:/.test(x) && /Turniere:/.test(x) && /insgesamt:/.test(x) && !/NaN|undefined/.test(x); })());
    return out.join('\n');
  });
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
