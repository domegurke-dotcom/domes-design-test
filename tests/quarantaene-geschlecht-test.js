// v966 (Dome 8.11.): Nach der Quarantäne zieht ein Pferd nur in einen Stall, in dem sein Geschlecht erlaubt ist (Hengst kam in den Stutenstall)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const mk = (name, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    // Quarantäne-Box + Boxenstall nur für Stuten und Wallache + Paddock-Stall für alle
    const neu = (art, geb) => { const x = JSON.parse(JSON.stringify(spiel.boxen[0])); x.pferd = null; x.fohlen = null; delete x.reserviert; x[art] = true; x.geb = geb; spiel.boxen.push(x); return spiel.boxen.length - 1; };
    const qi = neu('quar', 'gQ'), pi = neu('paddock', 'gP');
    spiel.hof.stallGeschl = { [boxGruppe(spiel.boxen[0]) + '|' + gebWurzel(spiel.boxen[0].geb)]: { h: false } };
    const H = mk('Hans', 'Hengst'); spiel.boxen[qi].pferd = H; H.quarantaene = spiel.tag - 9999;
    quarantaeneUmzug(); const wo = spiel.boxen.findIndex(x => x.pferd === H);
    ok('Hengst zieht nicht in den Stutenstall (Boxenstall ohne Hengste)', wo === pi, 'steht in Box ' + wo + ' (Paddock ' + pi + ')');
    // keine erlaubte Box frei → bleibt in Quarantäne, Brief
    spiel.boxen[pi].pferd = mk('Blocker', 'Stute'); spiel.boxen[pi].quar = false; const H2 = mk('Heinz', 'Hengst'); spiel.boxen[qi].pferd = H2; spiel.boxen[qi].quar = true; H2.quarantaene = spiel.tag - 9999; const vorher = (spiel.post || []).length; quarantaeneUmzug();
    ok('Ohne erlaubte freie Box bleibt der Hengst im Quarantänestall', spiel.boxen[qi].pferd === H2, spiel.boxen.findIndex(x => x.pferd === H2));
    ok('Brief erklärt, warum', (spiel.post || []).length === vorher + 1 && /keine passende Box/.test(spiel.post[0].betreff), spiel.post[0] && spiel.post[0].betreff);
    // Whiteboard-Ziehen und Orte · Box wechseln
    const E = mk('Egon', 'Hengst'); spiel.boxen[0].pferd = null; spiel.boxen[3].pferd = E; spiel.boxen[3].quar = false; spiel.boxen[3].paddock = false; spiel.boxen[3].geb = spiel.boxen[1].geb; spiel.boxen[1].pferd = null; spiel.boxen[2].pferd = null;
    spiel.hof.stallGeschl = { [boxGruppe(spiel.boxen[0]) + '|' + gebWurzel(spiel.boxen[0].geb)]: { h: false } }; spiel.boxen[3].pferd = null; spiel.boxen[4].pferd = E;
    ok('Whiteboard-Ziehen: Hengst nicht in den Stall ohne Hengste', !wbKZiel(spiel.boxen[4], spiel.boxen[0]) && stallErlaubt(spiel.boxen[pi], E), '');
    // Stute mit Fohlen nach der Quarantäne: in die Abfohlbox
    const ab = neu('abfohl', 'gA'), q2 = neu('quar', 'gQ2'); spiel.hof.stallGeschl = {}; spiel.boxen.forEach((bx, k) => { if (k !== q2) { bx.pferd = null; bx.fohlen = null; bx.quar = !!bx.quar && k === q2; } }); spiel.boxen[ab].abfohl = true; spiel.boxen[qi].quar = false; spiel.boxen[pi].paddock = false;
    const M = mk('Mama', 'Stute'), F = mk('Fohlen', 'Stute'); F.geb = { s: datum().s, j: datum().j }; spiel.boxen[q2].pferd = M; spiel.boxen[q2].fohlen = F; M.quarantaene = spiel.tag - 9999; quarantaeneUmzug();
    const wm = spiel.boxen.findIndex(x => x.pferd === M); ok('Stute mit Fohlen kommt in die Abfohlbox', wm === ab && spiel.boxen[ab].fohlen === F, 'Box ' + wm + ' (Abfohl ' + ab + ')');
    ok('Brief ohne Warnung, wenn die Abfohlbox da war', !/keine Abfohlbox frei/.test((spiel.post[0] || {}).text || ''), (spiel.post[0] || {}).text);
    // Keine Abfohlbox frei: Hinweis im Brief
    spiel.boxen[ab].pferd = mk('Belegt', 'Stute'); const M2 = mk('Mama2', 'Stute'), F2 = mk('Fohlen2', 'Stute'); spiel.boxen[q2].pferd = M2; spiel.boxen[q2].fohlen = F2; spiel.boxen[q2].quar = true; M2.quarantaene = spiel.tag - 9999; quarantaeneUmzug();
    const w2 = spiel.boxen.findIndex(x => x.pferd === M2); ok('Ohne freie Abfohlbox: Stute geht in eine normale Box', w2 >= 0 && w2 !== ab, 'Box ' + w2); ok('… und der Brief weist darauf hin', /keine Abfohlbox frei/.test((spiel.post[0] || {}).text || '') && /Fohlen2/.test((spiel.post[0] || {}).text || ''), (spiel.post[0] || {}).text);
    spiel.boxen[ab].pferd = null;
    // Stute ohne Fohlen: nicht in die Abfohlbox, wenn eine normale Box frei ist
    const N = mk('Nora', 'Stute'); spiel.boxen[q2].pferd = N; spiel.boxen[q2].quar = true; N.quarantaene = spiel.tag - 9999; spiel.boxen[ab].pferd = null; spiel.boxen[ab].fohlen = null; quarantaeneUmzug(); const wn = spiel.boxen.findIndex(x => x.pferd === N); ok('Stute ohne Fohlen bleibt aus der Abfohlbox', wn >= 0 && wn !== ab, 'Box ' + wn);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
