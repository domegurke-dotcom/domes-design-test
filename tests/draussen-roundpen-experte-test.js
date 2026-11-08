// v995 (Dome 8.11.): Waschen/Solarium, Decken und Medikament auch bei Pferd draußen · Roundpen 2 Pferde je Tag · Futterexperte höchstens 10 Pferde · Tierarzt-Sammeltermin mit einmaliger Anfahrt
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99;
    const mk = (n, i, g = 'Stute') => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0), box = spiel.boxen[0]; spiel.tag = 3; A.weide = { wid: 'w1', seit: 1 };
    gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 2, zustand: 100 }, { gid: 'gs', typ: 'solarium', stufe: 1, zustand: 100 });
    ok('Waschen: Pferd auf der Weide ist nicht gesperrt', !/draußen/.test(waschSperre(A, box) || ''), waschSperre(A, box));
    ok('Solarium: Pferd auf der Weide ist nicht gesperrt', !/draußen/.test(solarSperre(A, box) || ''), solarSperre(A, box));
    ok('Decken: Stute auf der Weide ist nicht gesperrt („auf der Weide“ entfällt)', zuchtSperre(A, box) !== 'auf der Weide', zuchtSperre(A, box));
    const bh = behandlungHTML(A, box); ok('Medikament geben: Knopf nicht gesperrt bei Pferd draußen', /data-behmed="1" >/.test(bh) || /data-behmed="1" ?>/.test(bh) || !/data-behmed="1" disabled/.test(bh), (bh.match(/<button[^>]*data-behmed[^>]*>/) || [''])[0]);
    delete A.weide;
    // Tierarzt-Sammeltermin: Anfahrt einmal
    const B = mk('Berta', 1); A.pflege.impf = 0; B.pflege.impf = 0; const post0 = (spiel.post || []).length; vorsorgeSammel([{ p: A, was: 'impfung' }, { p: B, was: 'impfung' }]);
    const br = (spiel.post || []).find(x => /Tierarzt: Impfen und Zähne/.test(x.betreff || '')); ok('Sammeltermin: eine Rechnung mit einer Anfahrt (60 €) + 2 Impfungen', !!br && (JSON.stringify(br).match(/Anfahrt Tierarzt/g) || []).length === 1 && (spiel.post || []).length === post0 + 1, JSON.stringify(br).slice(0, 300));
    // Roundpen: 2 Pferde je Tag
    spiel.anlage = spiel.anlage || {}; spiel.anlage.roundpen = true; gebaeude().push({ gid: 'grp', typ: 'roundpen', stufe: 1, zustand: 100 });
    const T = (p, o) => { p.trainHeute = { tag: spiel.tag, liste: [], verbraucht: 0, orte: [o] }; };
    ok('Roundpen: leer = frei', !roundpenBelegt()); T(A, 'roundpen'); ok('Roundpen: 1 Pferd drin = noch frei (2 je Tag)', !roundpenBelegt()); T(B, 'roundpen'); ok('Roundpen: 2 Pferde heute = belegt (für alle: Spieler, Mitarbeiter, Pension)', roundpenBelegt());
    delete A.trainHeute; delete B.trainHeute;
    // Futterexperte: höchstens 10 Pferde
    const x0 = bewerber('futterexperte')[0]; spiel.mitarbeiter = [{ id: 'fe1', typ: 'futterexperte', name: 'Katharina', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 4, bis: null }];
    while (spiel.boxen.length < 12) spiel.boxen.push(Object.assign({}, spiel.boxen[0], { pferd: null, fohlen: null, tot: false, gesperrt: false })); for (let i = 0; i < 12; i++) mk('P' + i, i);
    ok('Experte betreut 10 von 12 Pferden', expertListe().length === 10, String(expertListe().length)); ok('Das 11. Pferd bekommt keine Betreuung (Meldung bleibt möglich)', !expertZustaendig(spiel.boxen[10].pferd) && expertZustaendig(spiel.boxen[9].pferd));
    spiel.mitarbeiter.push(Object.assign({}, spiel.mitarbeiter[0], { id: 'fe2', name: 'Zweiter' })); ok('Mit zwei Experten: 20 (hier alle 12)', expertListe().length === 12, String(expertListe().length));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
