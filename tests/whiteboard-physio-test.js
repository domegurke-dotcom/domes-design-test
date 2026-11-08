// v967 (Dome 8.11.): Pferdephysiotherapeut ist im Whiteboard sichtbar und Boxen zuteilbar (Aqua); Zuteilung wirkt in aquaMorgen
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; VET.verbotAb = 99;
    const mk = (name, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; return P; };
    ['Anna', 'Berta', 'Cora'].forEach((n, i) => { spiel.boxen[i].pferd = mk(n, 'Stute'); });
    const x0 = bewerber('physio')[0], m = { id: 'ph1', typ: 'physio', name: 'Petra', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 2, zustand: 100 });
    ok('Physiotherapeutin ist aktiv und da', aktive('physio').length === 1);
    ok('Whiteboard-Mitarbeiterliste enthält die Physiotherapeutin', wbMitarbeiter().some(x => x.id === 'ph1'), wbMitarbeiter().map(x => x.name).join());
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const karte = document.querySelector('.wb-ma[data-wbq="m:ph1"]');
    ok('Karte im Whiteboard unten, mit „von 2 Aqua-Plätzen“', !!karte && /von 2 Aqua-Plätzen/.test(karte.textContent), karte && karte.textContent);
    ok('Zuteilen auf eine Box mit Pferd ist erlaubt', wbOk('m:ph1', 'b:0') && !wbOk('m:ph1', 'b:5'), '');
    wbAnwenden('m:ph1', 'b:0'); ok('Zuteilung gespeichert (maPlan.aqua)', spiel.boxen[0].maPlan && spiel.boxen[0].maPlan.aqua === 'ph1', JSON.stringify(spiel.boxen[0].maPlan));
    zeigeWhiteboard(); const z = [...document.querySelectorAll('.wb-ma-zeile')].find(x => /Petra/.test(x.textContent)); ok('Zeile „🏊 Petra“ in der Box im Whiteboard', !!z && /🏊/.test(z.textContent), z && z.textContent);
    // Wirkung: Pferd ohne eigenen Aqua-Wunsch kommt trotzdem dran
    const A = spiel.boxen[0].pferd; ok('Ohne Zuteilung kein Aqua (Berta, kein Wunsch)', aquaWunschHeute(spiel.boxen[1].pferd) === null);
    ok('Mit Zuteilung gilt ein Aqua-Wunsch (Anna)', !!aquaWunschHeute(A), JSON.stringify(aquaWunschHeute(A)));
    const vorher = aquaLetzt(A); aquaMorgen(); ok('Morgens: Anna war im Aqua-Center', aquaLetzt(A) === spiel.tag, vorher + ' → ' + aquaLetzt(A));
    // Platzgrenze: Stufe 2 = 2 Plätze am Tag
    wbAnwenden('m:ph1', 'b:1'); wbAnwenden('m:ph1', 'b:2'); const zu = maZuteilung('aqua'); ok('Höchstens 2 Pferde (Stufe 2) werden dem Therapeuten angerechnet', zu.length === 2, zu.length);
    // Ohne Aqua-Center nicht zuteilbar
    gebaeude().pop(); ok('Ohne Aqua-Center nicht zuteilbar', !wbOk('m:ph1', 'b:0'));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
