// v993 (Dome 8.11.): Rosse wird bemerkt (Mitarbeiter-Brief oder du beim Besuch der Box, auch Fohlenrosse); Aqua und Fohlen-Duschen gehen auch, wenn das Pferd draußen steht
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0); spiel.tag = 1; const box = spiel.boxen[0];
    // einen Tag mit Rosse finden (Frühling = Decksaison)
    let d = 1; for (; d <= 40; d++) { spiel.tag = d; if (DECK_SAISON[datum().s] > 0 && rosseLage(A, box)) break; } ok('Es gibt Tage mit Rosse im Frühling/Sommer', !!rosseLage(A, box), 'Tag ' + d);
    const mkM = (typ, id, name) => { const x0 = bewerber(typ)[0]; return { id, typ, name, w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; };
    const rnd = Math.random; Math.random = () => 0.0;
    spiel.mitarbeiter = [mkM('stallbursche', 's1', 'Frieda')]; delete A.rosse; delete A.rosseOffen; const b0 = (spiel.post || []).length; rosseMorgen();
    ok('Mit Mitarbeiter: er bemerkt die Rosse – Brief „Frieda: Anna ist rossig“', !!A.rosse && A.rosse.von === 'Frieda' && (spiel.post || []).length === b0 + 1 && /rossig/.test(JSON.stringify((spiel.post || [])[0])), JSON.stringify(A.rosse));
    const b1 = (spiel.post || []).length; rosseMorgen(); ok('Nur einmal je Rosse (kein zweiter Brief)', (spiel.post || []).length === b1);
    const zs = (() => { zeigeAkte; return rosseBemerkt(A); })(); ok('Steckbrief-Status kennt die bemerkte Rosse', zs);
    // ohne Mitarbeiter: du siehst es beim Besuch der Box
    Math.random = () => 0.99; spiel.mitarbeiter = []; delete A.rosse; delete A.rosseOffen; rosseMorgen(); ok('Niemand merkt es: „offen“ (stille Rosse)', !!A.rosseOffen && !A.rosse, JSON.stringify(A.rosseOffen));
    Math.random = () => 0.5; anzeichenBeimBesuch(box); ok('Beim Besuch der Box bemerkst du es selbst', !!A.rosse && A.rosse.von === 'du' && !A.rosseOffen, JSON.stringify(A.rosse));
    // Stute mit Fohlen bei Fuß: Fohlenrosse
    const B = mk('Berta', 1); const bx = spiel.boxen[1]; spiel.tag = 3; const f = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 0.2, name: 'Fina' }); f.gebTag = spiel.tag - 1; bx.fohlen = f; delete B.rosse; delete B.rosseOffen;
    const r = rosseLage(B, bx); ok('Stute mit Fohlen: Fohlenrosse ab dem Tag nach der Geburt', !!r && r.fohlen === true, JSON.stringify(r));
    Math.random = () => 0.0; spiel.mitarbeiter = [mkM('stallbursche', 's1', 'Frieda')]; rosseMorgen(); ok('Fohlenrosse wird gemeldet', !!B.rosse && /Fohlenrosse/.test(JSON.stringify((spiel.post || [])[0])), JSON.stringify((spiel.post || [])[0]).slice(0, 200));
    Math.random = rnd;
    // tragende Stute: keine Rosse
    const C = mk('Cora', 2); C.traechtig = { vater: { name: 'X', rasse: 'paint' }, geburt: 5 }; ok('Tragende Stute rosst nicht', rosseLage(C, spiel.boxen[2]) === null);
    // Aqua draußen
    gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 2, zustand: 100 }); A.weide = { wid: 'w1', seit: spiel.tag }; ok('Aqua: Pferd auf der Weide ist nicht gesperrt', !/draußen/.test(aquaSperre(A, box, 'schwimmen') || ''), aquaSperre(A, box, 'schwimmen'));
    // Fohlen duschen mit Stute draußen
    gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 2, zustand: 100 }); spiel.tag = 12; spiel.shampoo = 3; f.gebTag = 1; f.abcTag = undefined; box.fohlen = f; spiel.boxen[0].fohlen = f; A.weide = { wid: 'w1', seit: 1 };
    const txt = fohlenDuschen(f, spiel.boxen[0]); ok('Fohlen-Duschen geht, obwohl die Stute auf der Weide steht', !/draußen/.test(txt) && /Duschen geübt|Wasser|Winter|zu jung/.test(txt), txt);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
