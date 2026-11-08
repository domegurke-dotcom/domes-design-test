// v990 (Dome 8.11.): fester Futterexperte prüft jeden Morgen; passt der Bedarf nicht, rechnet er neu – ohne Brief und ohne Meldung „Futter passt nicht mehr“; im Whiteboard als Karte
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P;
    const x0 = bewerber('futterexperte')[0]; spiel.mitarbeiter = [{ id: 'fe1', typ: 'futterexperte', name: 'Katharina', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 4, bis: null }];
    ok('Experte ist da und darf Pläne machen', expertDa());
    spiel.ersteBeratung = true; futterBeratung([P], true, '', true); ok('Erster Plan vom Experten, leise (kein Brief)', P.expertBetreut === true && !(spiel.post || []).some(x => x.von === 'Futterberatung'), JSON.stringify((spiel.post || []).map(x => x.von)));
    P.umstellung = null; const plan0 = JSON.stringify(P.futterplan);
    // Bedarf steigt (schwere Arbeit) → Plan passt nicht mehr
    P.arbeitSchnitt = 400; P.trainHeute = null; const rot = () => bedarfCheck(planWerte(P, spiel.boxen[0], futterplanVon(P, spiel.boxen[0]))).some(r => r[2] !== 'passt');
    ok('Bedarf passt jetzt nicht mehr (Test-Voraussetzung)', rot());
    const briefe0 = (spiel.post || []).length; delete P.bedarfMeldung; P.bedarfRot = []; bedarfTag(); const meldungOhne = !!P.bedarfMeldung;
    ok('Meldung „Futter passt nicht mehr“ kommt nicht, solange der Experte da ist', !meldungOhne, JSON.stringify(P.bedarfMeldung));
    futterexperteTagCheck(); ok('Experte hat den Plan neu gerechnet', JSON.stringify(P.futterplan) !== plan0 && !!P.umstellung, JSON.stringify(P.futterplan) + ' / ' + plan0);
    ok('Kein neuer Brief', (spiel.post || []).length === briefe0, (spiel.post || []).length + ' vs ' + briefe0);
    // Experte im Urlaub → die Meldung kommt wieder
    spiel.mitarbeiter[0].urlaub = { von: spiel.tag, bis: spiel.tag + 3 }; P.umstellung = null; delete P.bedarfMeldung; P.bedarfRot = []; P.futterplan = { mahl: 2, kg: { heu: 1 }, vom: 'selbst' }; P.expertBetreut = true; bedarfTag();
    ok('Experte nicht da: Meldung kommt wieder', !expertDa() && !!P.bedarfMeldung, String(expertDa()) + JSON.stringify(P.bedarfMeldung));
    // Whiteboard-Karte
    delete spiel.mitarbeiter[0].urlaub; wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const k = [...document.querySelectorAll('#wbMaReihe .wb-ma-info')].find(e => /Katharina/.test(e.textContent));
    ok('Whiteboard: Karte des Futterexperten mit „Pferd betreut“', !!k && /1 von 10 Pferden betreut/.test(k.textContent), k && k.textContent);
    ok('Karte ist nicht zuteilbar (kein data-wbq)', !!k && !k.hasAttribute('data-wbq'));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
