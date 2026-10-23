// v668: Einsteller und Boxstufen – Wunsch bei der Anfrage, Umzug in bessere/schlechtere Box, Frage nach besserer Box per Brief
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; pensionRegeln().offen = true;
    spiel.boxen.forEach((bx, i) => { bx.stufe = i < 3 ? 1 : 2; });   // 3 einfache, 3 bessere Boxen (ein Gebäude – für den Test reicht es)
    let ws = 0; for (let i = 0; i < 40; i++) { spiel.pensionAnfragen = []; pensionAnfrageNeu(); const a = spiel.pensionAnfragen[0]; if (a && a.stufeWunsch) ws++; }
    ok('Anfragen nennen manchmal eine Wunsch-Boxstufe', ws > 5, ws + ' von 40');
    spiel.pensionAnfragen = []; pensionAnfrageNeu(); const a = spiel.pensionAnfragen[0]; a.stufeWunsch = 2; a.angenommen = true; a.tag = spiel.tag - 1;
    for (let i = 0; i < 6; i++) spiel.boxen[i].pferd = null;
    const zb = pensionZielBox(a); ok('Zielbox hat die gewünschte Stufe', zb >= 3 && boxenStufe(spiel.boxen[zb]) === 2, 'Box ' + zb);
    pensionRegeln().max = 99;
    // Einsteller direkt anlegen (wie nach Einzug)
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name: 'Gast' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P);
    const e = { eid: 'eT', vn: 'Anna', nn: 'Test', w: true, pid: P.id, stufe: 1, leistungen: {}, haltung: 'box', preis: pensionRegeln().preis[1], zufr: 80, seit: jzJetzt(), einzug: spiel.tag, kuendigt: null, log: [], befSeen: [] };
    P.einsteller = 'eT'; einstellerListe().push(e); spiel.boxen[0].pferd = P;
    const z0 = e.zufr; einstellerBoxWechsel(P, 1, 2); ok('Besserer Umzug: Stufe und Zufriedenheit steigen, Preisprüfung läuft', e.stufe === 2 && e.zufr > z0 - 1 && !!(e.preisNeu || e.kuendigt != null || e.preisBasis != null), 'zufr ' + z0 + '→' + e.zufr);
    const z1 = e.zufr; einstellerBoxWechsel(P, 2, 1); ok('Schlechterer Umzug: Zufriedenheit sinkt', e.stufe === 1 && e.zufr < z1, 'zufr ' + z1 + '→' + e.zufr);
    // Frage nach besserer Box
    spiel.boxen[0].pferd = P; e.stufe = 1; e.zufr = 90; delete e.stufeFrage; delete e.kuendigt; const r0 = Math.random; Math.random = () => 0; const n0 = (spiel.post || []).length; stufenWunschBriefe(); Math.random = r0;
    const br = (spiel.post || []).find(x => /bessere Box/.test(x.betreff)); ok('Zufriedener Einsteller fragt per Brief nach besserer Box', !!br && br.aktion && br.aktion.typ === 'stufeWunsch');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
