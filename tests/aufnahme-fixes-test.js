// Test der Fehlerbehebungen aus Domes Aufnahmen vom 23.10. (v654)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/aufnahme-fixes-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); return p; };
    // 1. Start-Fohlen zählen nicht als gezüchtet
    const P0 = spiel.protokoll ? JSON.stringify(Object.values(spiel.protokoll).map(x => x['Fohlen geboren'] || 0)) : '';
    const M = neu({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'M' }), V = neu({ rasse: 'paint', geschlecht: 'Hengst', alter: 8, name: 'V' }); geburt({ pferd: M }, V, true);
    ok('Marktfohlen (geburt mit still) zählt nicht als „Fohlen geboren“', (spiel.protokoll ? JSON.stringify(Object.values(spiel.protokoll).map(x => x['Fohlen geboren'] || 0)) : '') === P0);
    geburt({ pferd: M }, V); ok('echte Geburt zählt weiter', Object.values(spiel.protokoll).some(x => (x['Fohlen geboren'] || 0) >= 1));
    // 2. Gegensätze in der Rückmeldung
    const e = { zufr: 70, log: [], plus: [] }; eZufr(e, -2, 'wird nicht nach meinem Wunsch gefüttert'); eZufr(e, 0.5, 'wird nach meinem Wunsch gefüttert');
    ok('Futterwunsch: nur noch 👍, kein 👎 dazu', e.plus.some(x => x.grund === 'wird nach meinem Wunsch gefüttert') && !e.log.some(x => /nicht nach meinem Wunsch/.test(x.grund)));
    eZufr(e, -0.3, 'kein Weidegang'); eZufr(e, 0.1, 'der regelmäßige Weidegang'); ok('Weidegang: Gegensatz entfernt', !e.log.some(x => x.grund === 'kein Weidegang'));
    ok('Weidegang-Quote je Jahreszeit (Sommer > Frühling > Herbst > Winter)', WEIDE_QUOTE[1] > WEIDE_QUOTE[0] && WEIDE_QUOTE[0] > WEIDE_QUOTE[2] && WEIDE_QUOTE[2] > WEIDE_QUOTE[3]);
    // 3. Nachnamen der Besitzer nur einmal
    spiel.pensionAnfragen = []; const namen = new Set(); for (let i = 0; i < 12; i++) { const n = pensionNN(l => l[0]); ok; namen.add(n); spiel.pensionAnfragen.push({ nn: n, bis: 1e9 }); }
    ok('12 Anfragen nacheinander: 12 verschiedene Nachnamen', namen.size === 12, namen.size);
    // 4. Rezept nach Untersuchung
    const Q = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Q' }); spiel.boxen[0].pferd = Q; const bf = befundNeu(Q, 'sehne', 3, 'Test'); bf.bemerkt = { von: 'Tierarzt', tag: spiel.tag }; bf.diagnose = spiel.tag; bf.tierarzt = true;
    const art = bf.art, plan = PLAN[art] || [], R1 = rezeptNachBefund(Q, [bf]);
    ok('Rezept nach Untersuchung: Rezeptmittel des Plans mit ' + REZEPT_DOSEN + ' Dosen', plan.filter(k => APO[k] && !APO[k].frei).every(k => rezeptVon(Q)[k] >= REZEPT_DOSEN) && R1.posten.length === R1.mittel.length, R1.mittel.join(','));
    ok('Folgerezept auch für nicht-chronische Befunde mit Tierarzt-Plan', folgerezeptMittel(Q).length === R1.mittel.length);
    // 5. Fellmuster springt nicht beim Neuzeichnen
    const norm = x => x.replace(/(id="|url\(#|href="#)[^"\)]*/g, '$1').replace(/data-k="[a-z0-9]*?(?=alle)/g, 'data-k="'); let stabil = 0, n = 0;   // data-k trägt einen Zufallsschlüssel der Randmessung
    for (let i = 0; i < 12; i++) { const F = neu({ rasse: 'paint', geschlecht: 'Stute', alter: 1, name: 'F' + i }); n++; if (norm(ganzBild(F)) === norm(ganzBild(F))) stabil++; }
    ok('Fohlenbild gleich bei jedem Zeichnen (12 Paint-Fohlen)', stabil === n, stabil + '/' + n);
    // 6. Bessere Auswahl: Vorschlag des Azubis steht in den Möglichkeiten
    const Z = neu({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 7, name: 'Z' }); const bz = befundNeu(Z, 'husten', 2, 'Test'); const falsch = Object.keys(KRANK).find(k => k !== 'husten' && KRANK[k].bereich !== KRANK.husten.bereich); bz.meldungen = [{ von: 'Azubi', tipp: falsch }];
    ok('Vorschlag eines Mitarbeiters steht immer zur Wahl', bfOptionen(bz).includes(falsch) && bfOptionen(bz).includes('husten'), bfOptionen(bz).join(','));
    // 7. Schleife: Ziffer in Arial
    ok('Schleife: Platznummer mit Arial (gleich hohe Ziffern)', /Arial/.test(schleifeSVG(2, 3, false, 40)));
    return out; });
  console.log(R.join('\n')); console.log('Seitenfehler:', errs.length ? errs.join('; ') : 'keine'); await b.close(); })();
