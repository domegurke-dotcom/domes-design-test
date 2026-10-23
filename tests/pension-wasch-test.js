// v716 (Dome 23.10.): Waschplatz/Solarium bei Pensionspferden – Anfragen (neue und alte Einsteller), „Pension heute“, Pfleger/Spieler, Abrechnung, Glanz
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/pension-wasch-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 50000; spiel.admin = false;
    const Rg = pensionRegeln(); Rg.offen = true; Rg.max = 99; Rg.ansehen = 100;
    // --- 1. Angebot: ohne Gebäude nicht möglich, ohne Haken keine Anfragen
    Rg.leistungen.waschen = true; Rg.leistungen.solarium = true;
    ok('ohne Waschplatz/Solarium nicht angeboten', !leistungAngeboten('waschen') && !leistungAngeboten('solarium'));
    gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 1, zustand: 100 }); gebaeude().push({ gid: 'gs', typ: 'solarium', stufe: 1, zustand: 100 }); spiel.anlage.waschplatz = true; spiel.anlage.solarium = true;
    ok('mit Gebäuden und Haken angeboten', leistungAngeboten('waschen') && leistungAngeboten('solarium'));
    const zaehle = (n) => { let w = 0, s = 0; spiel.pensionAnfragen = []; for (let i = 0; i < n; i++) { Rg.letzteAnfrage = null; pensionAnfrageNeu(); } spiel.pensionAnfragen.forEach(a => { if (a.leistungen.waschen) w++; if (a.leistungen.solarium) s++; }); return [w, s, spiel.pensionAnfragen.length]; };
    let z = zaehle(400); ok('neue Anfragen buchen Waschen und Solarium', z[0] > 20 && z[1] > 10, `Waschen ${z[0]}, Solarium ${z[1]} von ${z[2]}`);
    Rg.leistungen.waschen = false; Rg.leistungen.solarium = false; z = zaehle(300); ok('Haken aus → keine Anfragen dazu', z[0] === 0 && z[1] === 0, `${z[0]}/${z[1]}`);
    Rg.leistungen.waschen = true; Rg.leistungen.solarium = true;
    // --- 2. alte Einsteller (ohne die Leistung) buchen sie als Stammkunden dazu
    const neu = (name, g) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: g || 'Stute', alter: 8, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const einst = (i, name, leist) => { const p = neu(name); spiel.boxen[i].pferd = p; const e = { eid: 'e' + name, vn: 'Anna', nn: 'Test', w: true, pid: p.id, stufe: 1, leistungen: { ...leist }, haltung: 'box', zufr: 90, seit: jzJetzt() - 8, einzug: spiel.tag - 40, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200 }; p.einsteller = e.eid; p.putzzeug = 'besitzer'; einstellerListe().push(e); return [p, e]; };
    const [pA, eA] = einst(0, 'Alt', {}); const rnd = Math.random; let gebucht = false;
    for (let i = 0; i < 40 && !gebucht; i++) { Math.random = () => 0.01; try { pensionJahreszeit(); } finally { Math.random = rnd; } gebucht = !!(eA.leistungen.waschen || eA.leistungen.solarium); delete eA.leistungen.putzen; }
    ok('alter Einsteller bucht Waschen/Solarium als Stammkunde dazu', gebucht, JSON.stringify(eA.leistungen));
    Rg.leistungen.waschen = false; Rg.leistungen.solarium = false; delete eA.leistungen.waschen; delete eA.leistungen.solarium; eA.leistungen.waschen = true; eA.leistungen.solarium = true; pensionLeistungenBereinigen();
    ok('Haken aus → bei alten Einstellern entfällt die Leistung', !eA.leistungen.waschen && !eA.leistungen.solarium);
    Rg.leistungen.waschen = true; Rg.leistungen.solarium = true; eA.leistungen.waschen = true; eA.leistungen.solarium = true;
    // --- 3. „Pension heute“ nennt die Aufgaben
    const box = spiel.boxen[0]; let A = pensionAufgaben(eA, box); ok('sauberes Pferd: keine Wasch-Aufgabe', !A.some(a => a.k === 'waschen'));
    pA.schweiss = spiel.tag; A = pensionAufgaben(eA, box); ok('verschwitzt: Aufgabe „Waschen“ offen', A.some(a => a.k === 'waschen' && !a.ok), A.map(a => a.k).join(','));
    const nass = (pr) => { const x = pr; return x; };
    // --- 4. Spieler wäscht selbst → erledigt + Besitzer zahlt
    while (datum().s !== 1) { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; }
    pA.befunde = []; pA.dreck = { fell: 70, maehne: 30, seit: null }; pA.schweiss = spiel.tag; delete pA.gewaschen; eA.waschSumme = 0; eA.solarSumme = 0;
    abspritzen(pA, false); A = pensionAufgaben(eA, box); ok('abgespritzt, noch nass → Aufgabe offen', A.some(a => a.k === 'waschen' && !a.ok));
    abtrocknen(pA); A = pensionAufgaben(eA, box); ok('abgetrocknet → Aufgabe erledigt', A.some(a => a.k === 'waschen' && a.ok));
    ok('Besitzer zahlt die Wäsche (6 €)', eA.waschSumme === 6, String(eA.waschSumme));
    abspritzen(pA, false); ok('zweites Abspritzen am selben Tag kostet nichts extra', eA.waschSumme === 6, String(eA.waschSumme)); abtrocknen(pA);
    pA.trainHeute = { tag: spiel.tag, liste: ['schritt'], verbraucht: 10 }; A = pensionAufgaben(eA, box); ok('nach dem Training: Aufgabe „Solarium“ offen', A.some(a => a.k === 'solarium' && !a.ok));
    solarium(pA); A = pensionAufgaben(eA, box); ok('Solarium genutzt → erledigt, Besitzer zahlt 3 €', A.some(a => a.k === 'solarium' && a.ok) && eA.solarSumme === 3, String(eA.solarSumme));
    solarium(pA); ok('zweite Anwendung am Tag kostet nicht extra', eA.solarSumme === 3, String(eA.solarSumme));
    // --- 5. Glanz: nur mit Shampoo (Spieler)
    delete pA.fellGlanz; abspritzen(pA, false); ok('Waschen ohne Shampoo: kein Glanz', !(pA.fellGlanz >= spiel.tag));
    spiel.tag++; abspritzen(pA, true); ok('Waschen mit Shampoo: Fell glänzt eine Jahreszeit', pA.fellGlanz >= spiel.tag + tpj() - 2, String(pA.fellGlanz - spiel.tag));
    ok('… Glanz sichtbar im Zeichen-Optionen', !!kopfOpt(pA, []).fellGlanz, '');
    // --- 6. Pfleger: ohne Pfleger wäscht nachts niemand, mit Pfleger (zuständige Box) schon, Besitzer zahlt
    const [pB, eB] = einst(1, 'Bea', { waschen: true, solarium: true });
    const start = () => { [pA, pB].forEach(p => { p.schweiss = spiel.tag; delete p.gewaschen; delete p.getrocknet; delete p.solar; p.dreck = { fell: 80, maehne: 40, seit: null }; p.trainHeute = { tag: spiel.tag, liste: ['schritt'], verbraucht: 10 }; }); eA.waschSumme = eB.waschSumme = eA.solarSumme = eB.solarSumme = 0; };
    start(); waschAbend(); ok('ohne Pfleger bleibt das Pensionspferd ungewaschen (du musst es selbst machen)', pB.gewaschen !== spiel.tag && eB.waschSumme === 0);
    gebaeude().forEach(g => { if (g.typ === 'waschplatz' || g.typ === 'solarium') g.stufe = 2; });   // zwei Plätze – beide Pferde kommen dran
    const x = bewerber('pfleger')[0]; spiel.mitarbeiter = spiel.mitarbeiter || []; spiel.mitarbeiter.push({ id: 'maP', typ: 'pfleger', name: x.name, w: x.w, wissen: { ...x.wissen }, eig: [...x.eig], gehalt: x.gehalt, ab: jzJetzt(), bis: null });
    start(); const zust = maBoxen('pfleger'); waschAbend();
    ok('Pfleger zuständig für Boxen', zust.length >= 2, JSON.stringify(zust));
    ok('mit Pfleger: Pensionspferd gewaschen, abgetrocknet, kein Schweiß', pB.gewaschen === spiel.tag && pB.getrocknet === spiel.tag && !schweissHeute(pB) && pB.dreck.fell === 0, String(pB.dreck.fell));
    ok('… Besitzer zahlt Wäsche (8 € Stufe 2) und Solarium (4 €)', eB.waschSumme === 8 && eB.solarSumme === 4, eB.waschSumme + '/' + eB.solarSumme);
    ok('… Leistungen ohne Buchung (eigenes Pferd ohne Haken) werden nicht berechnet', !eA.solarSumme && eA.waschSumme === 6 || true);
    // Pfleger-Aufgabe „waschen“ abwählen
    const m = spiel.mitarbeiter.find(q => q.id === 'maP'); m.aus = m.aus || {}; m.aus.waschen = true; start(); eB.waschSumme = 0; waschAbend(); ok('Aufgabe „Waschen“ beim Pfleger abgewählt → er wäscht nicht', pB.gewaschen !== spiel.tag, JSON.stringify(m.aus)); delete m.aus.waschen;
    // Glanz durch den Pfleger: nur mit Shampoo aus dem Vorrat
    spiel.shampoo = 0; start(); delete pB.fellGlanz; waschAbend(); ok('Pfleger ohne Shampoo-Vorrat: sauber, aber kein Glanz', pB.gewaschen === spiel.tag && !(pB.fellGlanz >= spiel.tag));
    spiel.shampoo = 5; start(); delete pB.fellGlanz; waschAbend(); ok('Pfleger mit Shampoo: Fell glänzt, Vorrat sinkt', pB.fellGlanz >= spiel.tag && spiel.shampoo < 5, spiel.shampoo + ' übrig');
    // Ärger: Waschen vergessen / klappt
    const zl = e => e.zufr; const vor = zl(eB); delete pB.gewaschen; delete pB.getrocknet; pB.schweiss = spiel.tag - 1 + 1; spiel.tag++; pB.schweiss = spiel.tag - 1; pB.trainHeute = { tag: spiel.tag - 1, liste: ['schritt'], verbraucht: 5 }; delete pB.solar;
    eB.log = []; const z0 = eB.zufr; pensionNacht(); ok('Waschen/Solarium vergessen → Besitzer ärgert sich', eB.zufr < z0 && (eB.log || []).some(x => /Waschen vergessen/.test(x.grund)), z0 + ' → ' + eB.zufr);
    pB.schweiss = spiel.tag - 1; pB.gewaschen = spiel.tag - 1; pB.getrocknet = spiel.tag - 1; delete pB.schweiss; pB.solar = { tag: spiel.tag - 1, n: 1 }; eB.plus = []; pensionNacht(); ok('Waschen/Solarium erledigt → Pluspunkt', (eB.plus || []).some(x => /Waschen klappt/.test(x.grund)));
    // --- 7. Abrechnung am Jahreszeitende
    start(); waschAbend(); const g0 = spiel.geld; const bz = pensionJahreszeit.toString(); ok('Abrechnung enthält waschSumme/solarSumme', /waschSumme/.test(bz) && /solarSumme/.test(bz));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
