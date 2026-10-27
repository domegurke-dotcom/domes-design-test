// Aqua wie ein Spieler, Teil 2 (v878): Physiotherapeut in der Mitarbeiter-Liste anklicken und einstellen, Einsteller buchen Aqua (Anfragen, Stammkunden, Haken aus), Therapeut arbeitet, Abrechnung, Zufriedenheit
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-einsteller-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.geld = 400000; VET.verbotAb = 99; spiel.stufenAn = true; spiel.spieler.stufe = 'exp'; while (spiel.boxen.length < 12) spiel.boxen.push({ pferd: null }); });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  // 1. ohne Aqua-Center: keine Kachel mit Physiotherapeut als Beruf
  await pg.evaluate(() => zeigeHof('mitarbeiter')); await pg.waitForTimeout(250);
  ok('ohne Aqua-Center keine Physio-Kachel', !(await pg.$('[data-ma="physio"]')));
  // 2. Aqua-Center bauen (Stufe 2: 2 Plätze) → Kachel erscheint, anklicken, einstellen
  await pg.evaluate(() => { gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 2, zustand: 100 }); spiel.anlage.aqua = true; zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(250);
  const kachel = await pg.$('[data-ma="physio"]'); ok('mit Aqua-Center: Physio-Kachel da und anklickbar', !!kachel && !(await kachel.evaluate(e => e.disabled)));
  if (kachel) { await kachel.click(); await pg.waitForTimeout(300); }
  ok('Bewerber werden angezeigt', (await pg.$$('[data-einst]')).length > 0);
  const e1 = await pg.$('[data-einst]'); if (e1) { await e1.click(); await pg.waitForTimeout(300); }
  const angestellt = await pg.evaluate(() => angestellte('physio').length); ok('Physiotherapeut eingestellt', angestellt === 1, angestellt);
  const probe = await pg.evaluate(() => { const m = angestellte('physio')[0]; return m && m.probe != null; }); ok('hat Probezeit wie die anderen Fachkräfte', probe);
  // 3. Platzgrenze: zweiter geht (2 Plätze), dritter nicht
  await pg.evaluate(() => { const m = maErgaenzen({ id: 'p2', typ: 'physio', name: 'Zwei', w: true, wissen: wissenStart(40, {}), eig: [], gehalt: 480, ab: 0, bis: null }); (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m); });
  ok('bei 2 Plätzen und 2 Therapeuten ist kein dritter anstellbar', await pg.evaluate(() => !maVerfuegbar('physio')));
  // 4. Pension: Haken Aqua in hvw – Hof – Pension anklicken
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const R = pensionRegeln(); R.offen = true; R.max = 99; R.ansehen = 100; hofBereich = 'pension'; zeigeHof('hof'); }); await pg.waitForTimeout(300);
  const hk = await pg.$('[data-pnleist="aqua"]'); ok('Pension-Einstellungen haben den Haken Aqua', !!hk);
  if (hk) { await pg.evaluate(() => { document.querySelector('[data-pnleist="aqua"]').click(); }); await pg.waitForTimeout(300); }
  ok('Haken wirkt: Aqua wird angeboten', await pg.evaluate(() => leistungAngeboten('aqua') && !!pensionRegeln().leistungen.aqua));
  // 5. neue Anfragen buchen Aqua; Haken aus → keine
  const R = await pg.evaluate(() => { const Rg = pensionRegeln(), res = {}; const z = n => { let a = 0; spiel.pensionAnfragen = []; for (let i = 0; i < n; i++) { Rg.letzteAnfrage = null; pensionAnfrageNeu(); } spiel.pensionAnfragen.forEach(x => { if (x.leistungen.aqua) a++; }); return a; };
    res.an = z(500); const brief = (spiel.post || []).some(x => /Aqua/.test(x.text || x.inhalt || '') && /gebucht/.test(x.text || x.inhalt || '')); res.brief = brief; Rg.leistungen.aqua = false; res.aus = z(300); Rg.leistungen.aqua = true;
    // 6. alter Einsteller bucht dazu
    const mk = n => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: n }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); p.wasserGewohnt = 9; p.aquaGewohnt = 9; ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const p = mk('Gast'); spiel.boxen[0].pferd = p; const e = { eid: 'eGast', vn: 'Anna', nn: 'Test', w: true, pid: p.id, stufe: 1, leistungen: {}, haltung: 'box', zufr: 80, seit: jzJetzt() - 8, einzug: spiel.tag - 40, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200 }; p.einsteller = e.eid; p.putzzeug = 'besitzer'; einstellerListe().push(e);
    const rnd = Math.random; let ge = false; for (let i = 0; i < 80 && !ge; i++) { Math.random = () => 0.01; try { pensionJahreszeit(); } finally { Math.random = rnd; } ge = !!e.leistungen.aqua; if (!ge) delete e.leistungen.putzen; } res.stamm = ge;
    // 7. Therapeut führt das gebuchte Pferd (alle 2 Tage), trocknet ab, Besitzer zahlt
    e.leistungen.aqua = true; e.aquaSumme = 0; e.aquaN = 0; const mp = angestellte('physio')[0]; mp.zufr = 80; p.aquaLog = []; spiel.tag += 3; p.energie = energieMax(p); const z0 = e.zufr;
    aquaMorgen(); res.gefuehrt = !!(p.aquaTag && p.aquaTag.tag === spiel.tag); res.trocken = !p.nass; res.summe = e.aquaSumme; res.zufr = e.zufr > z0;
    // 8. Abrechnung zu Beginn der Jahreszeit enthält Aqua
    const geld0 = spiel.geld; pensionJahreszeit(); res.rechnung = e.aquaSumme === 0;
    // 9. Haken aus: Leistung entfällt bei alten Einstellern, Therapeut führt es nicht mehr
    Rg.leistungen.aqua = false; pensionLeistungenBereinigen(); res.weg = !e.leistungen.aqua;
    return res; });
  ok('neue Anfragen buchen Aqua (Haken an)', R.an > 5, R.an); ok('Haken aus → keine Anfragen mit Aqua', R.aus === 0, R.aus); ok('alter Einsteller bucht Aqua als Stammkunde dazu', R.stamm);
  ok('Therapeut führt das gebuchte Pferd und trocknet es ab', R.gefuehrt && R.trocken); ok('Besitzer zahlt je Einheit (Summe gebucht) und wird zufriedener', R.summe >= 45 && R.zufr, R.summe);
  ok('Abrechnung zu Beginn der Jahreszeit setzt die Summe zurück', R.rechnung); ok('Haken aus → bei alten Einstellern entfällt Aqua', R.weg);
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
