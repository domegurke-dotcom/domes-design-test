// v712 (Dome 23.10.): Whiteboard – Pferde in andere Box ziehen, Weideplan je Jahreszeit, freie ha, Namen ändern, Hufrehe-Markierung, Einsteller
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/whiteboard-plan-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 1000 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 20000; spiel.stufenAn = true; spiel.spieler.stufe = 'fort';
    while (spiel.boxen.length < 8) spiel.boxen.push({ pferd: null });
    const mk = (n, g, r) => { const P = neuesPferd({ rasse: r || 'paint', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); return P; };
    ['Anna', 'Berta', 'Cora'].forEach((n, i) => { spiel.boxen[i].pferd = mk(n, 'Stute'); spiel.boxen[i].krippeVoll = true; });
    if (!weiden().some(w => w.wid === 'w2')) weiden().push({ wid: 'w2', name: 'Weide 2', ha: 2, gras: 80, matsch: 0 });
    const A = spiel.boxen[0].pferd, B = spiel.boxen[1].pferd, C = spiel.boxen[2].pferd, s0 = datum().s, s1 = (s0 + 1) % 4, s2 = (s0 + 2) % 4;
    // 1. Pferd in andere Box ziehen – auch wenn es draußen ist
    A.weide = { seit: spiel.tag, wid: 'w1' }; rausAusBox(spiel.boxen[0]); spiel.boxen[0].krippeVoll = true;
    ok('Pferd auf der Weide darf in andere Box (wbOk)', wbOk('k:0', 'b:5'));
    ok('belegte Box ist kein Ziel', !wbOk('k:0', 'b:1'));
    wbAnwenden('k:0', 'b:5'); ok('Anna steht jetzt in Box 6, Box 1 ist leer', spiel.boxen[5].pferd === A && !spiel.boxen[0].pferd && !!spiel.boxen[5].vorWeide && !spiel.boxen[0].vorWeide);
    delete A.weide; delete spiel.boxen[5].vorWeide;
    // 2. Whiteboard-Ansicht: Rahmen, Name, Box-Nummer
    wbSicht = 'boxen'; zeigeBoxen(); const bz = document.querySelector('[data-wbz="b:5"]');
    ok('Box zeigt Nummer mittig, Rahmenbild und Namen im Rahmen', !!bz.querySelector('.wb-nr') && !!bz.querySelector('.wb-rahmen .paar-bild svg') && /Anna/.test(bz.querySelector('.wb-rahmen .paar-brett').textContent));
    ok('Rahmen ist greifbar (k:5) und führt in die Box', bz.querySelector('.wb-rahmen').dataset.wbq === 'k:5' && bz.querySelector('.wb-rahmen').dataset.wbgo === '5');
    // 3. Jahreszeit-Plan
    wbSicht = 'weiden'; wbJz = null; wbAnwenden('p:1', 'w:w2:t');
    ok('aktuelle Jz: live am Pferd', B.auslaufZiel === 'w2' && B.weidegang === 'taeglich');
    wbJz = s1; zeigeBoxen();
    ok('nächste Jz ohne Plan zeigt den Stand der aktuellen', !!document.querySelector('[data-wbz="w:w2:t"] [data-wbq="c:1:w2:t"]'));
    wbModusSetzen('w2', 'jeden2'); wbAnwenden('c:1:w2:t', 'w:w2:a');
    ok('Plan nächste Jz gespeichert, Pferd live unverändert', spiel.wbPlan[s1][B.id].weidegang === 'jeden2' && B.weidegang === 'taeglich');
    wbJz = s2; zeigeBoxen();
    ok('übernächste Jz ohne Eintrag übernimmt die davor', !!document.querySelector('[data-wbq="c:1:w2:a"]'));
    wbJz = null; zeigeBoxen(); ok('zurück zur aktuellen Jz: unverändert täglich', !!document.querySelector('[data-wbq="c:1:w2:t"]'));
    spiel.wbPlan[s0] = { [B.id]: { auslaufZiel: 'w2', weidegang: 'jeden2', weideTag: 'b' } }; wbPlanJahreszeit();
    ok('Plan wird zu Beginn der Jahreszeit angewendet', B.weidegang === 'jeden2' && B.weideTag === 'b'); delete spiel.wbPlan[s0];
    // 4. freie ha
    wbJz = null; wbAnwenden('p:2', 'w:w2:t'); wbModusSetzen('w2', 'taeglich'); zeigeBoxen();
    const kk = document.querySelector('[data-wbname="w2"]').closest('.wb-wkopf');
    ok('Weide zeigt Größe und freie ha', /2 ha/.test(kk.textContent) && /frei \d/.test(kk.textContent), kk.textContent);
    // 5. Umbenennen
    wbUmbenennen('w2'); document.getElementById('wbNeuName').value = 'Oberwiese'; [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Speichern/.test(x.textContent)).click();
    ok('Weide umbenannt', weiden().find(w => w.wid === 'w2').name === 'Oberwiese');
    // 6. Hufrehe im Frühling
    C.fz = 8; wbJz = 0; wbSicht = 'weiden'; zeigeBoxen(); wbAnwenden('p:2', 'w:w2:t'); zeigeBoxen();
    ok('Hufrehe-Pferd auf der Weide (Frühlingsplan): rot gepunktet', !!document.querySelector('.wb-chip.rehe'));
    ok('nicht in anderen Jahreszeiten gepunktet', (() => { wbJz = 1; zeigeBoxen(); return !document.querySelector('.wb-chip.rehe'); })());
    wbJz = 0; spiel.boxen[2].paddock = true; zeigeBoxen();
    ok('Pferd in Paddockbox mit Hufrehe-Gefahr bleibt im Frühling in der Box', !document.querySelector('[data-wbq="c:2:w2:t"]') && !!document.querySelector('#wbBleibt [data-wbq="p:2"]') && !wbOk('p:2', 'w:w2:t'));
    delete spiel.boxen[2].paddock; C.fz = 5; wbJz = null;
    // 7. Einsteller nicht gesperrt
    const e = { eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'weide', leistungen: {}, zufr: 80 }; einstellerListe().push(e); B.einsteller = 'ex1'; B.weidegang = 'taeglich'; B.auslaufZiel = 'w2'; wbSicht = 'weiden'; zeigeBoxen();
    ok('Einsteller ist fremd', fremd(B));
    ok('Einsteller: „alle 2 Tage“ erlaubt', wbOk('c:1:w2:t', 'w:w2:a'));
    wbModusSetzen('w2', 'jeden2'); wbAnwenden('c:1:w2:t', 'w:w2:a'); ok('Einsteller: Tag A gesetzt', B.weidegang === 'jeden2' && B.weideTag === 'a');
    ok('Einsteller: in der Box lassen erlaubt', wbOk('c:1:w2:a', 'drin')); wbAnwenden('c:1:w2:a', 'drin'); ok('Einsteller bleibt in der Box', B.auslauf === 'box' && !B.weidegang && !weidegangHeute(B, spiel.boxen[1]));
    if (paddocks().length) { const g = paddocks()[0]; ok('Einsteller (Weide-Wunsch) auf Sandpaddock erlaubt', wbOk('p:1', 'w:' + g.gid + ':t')); wbAnwenden('p:1', 'w:' + g.gid + ':t'); ok('Einsteller steht auf dem Sandpaddock-Plan', B.auslauf === 'paddock' && B.auslaufZiel === g.gid); }
    wbAnwenden('p:1', 'w:w2:t'); ok('Einsteller zurück auf die Weide', B.auslauf === 'weide' && B.auslaufZiel === 'w2');
    B.einsteller = null; einstellerListe().length = 0;
    wbJz = null; wbSicht = 'uebersicht'; zeigeBoxen(); ok('Übersicht zeigt keine Jahreszeit-Knöpfe als bedienbar', !document.querySelector('[data-wbjz]'));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler');
  if (ORD) { await pg.evaluate(() => { wbSicht = 'boxen'; wbJz = null; zeigeBoxen(); }); await pg.waitForTimeout(200); await pg.screenshot({ path: ORD + `/wbp-boxen-${W}x${H}.png` }); await pg.evaluate(() => { wbSicht = 'weiden'; wbJz = 0; zeigeBoxen(); }); await pg.waitForTimeout(200); await pg.screenshot({ path: ORD + `/wbp-weiden-${W}x${H}.png`, fullPage: false }); }
  await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
