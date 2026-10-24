// v814 (Dome 24.10.): Frühling + Hufrehe-Gefahr: Pensionspferd mit Wunsch „Weide“ hat für diese Zeit den Wunsch „Sandpaddock“
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/rehe-wunsch-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 50000; spiel.stufenAn = false; spiel.admin = true;
    if (!paddocks().length) { bauStarten('sandpaddock', 1); planAutoSetzen(); gebaeude().forEach(g => { if (g.bau) g.bau.rest = 0; }); bauNacht(); }
    spiel.admin = false;
    const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: 'Rehe' }); P.pflege = erzeugePflege(P); P.fz = 8; const box = spiel.boxen[0]; box.pferd = P; box.krippeVoll = true;
    const e = { eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'weide', leistungen: {}, zufr: 80, stufe: 1, preis: 200 }; einstellerListe().push(e); P.einsteller = 'ex1'; P.weidegang = 'taeglich';
    const zuJz = s => { spiel.kal = { tag: spiel.tag, i: 0 }; let n = 0; while (datum().s !== s && n++ < 40) spiel.tag++; };
    zuJz(0);
    ok('Frühling, Hufrehe-Gefahr: Wunsch ist Sandpaddock', reheGefaehrdet(P) && haltungJetzt(e, P) === 'sandpaddock', haltungJetzt(e, P));
    ok('Text sagt „statt Weide – Hufrehe-Gefahr“', /statt Weide/.test(haltungText(e, P)), haltungText(e, P));
    const A = pensionAufgaben(e, box).map(a => a.txt).join(' | ');
    ok('„Pension heute“ nennt Sandpaddock, keinen Weidegang', /Sandpaddock statt Weide/.test(A) && !/Weidegang/.test(A), A);
    P.auslauf = 'weide'; P.auslaufZiel = 'w1';
    const pl = wbPlanVon(P); ok('Whiteboard-Plan „Weide“ wird im Frühling zum Sandpaddock', pl && pl.pd === true && !!pl.ziel, JSON.stringify(pl));
    ok('Stallbursche bringt es auf den Sandpaddock (auch mit Plan Weide)', paddockgangHeute(P, box) && !weidegangHeute(P, box));
    P.paddock = { seit: spiel.tag, pid: paddocks()[0].gid }; const ab = wbAbweichung(P, box); ok('auf dem Sandpaddock: kein roter Hinweis „Weide gebucht“', !/Weide gebucht, steht aber/.test(ab), ab); delete P.paddock;
    zuJz(1);
    ok('Sommer: wieder Wunsch Weide', haltungJetzt(e, P) === 'weide' && !/statt Weide/.test(haltungText(e, P)));
    zuJz(0); P.fz = 5; P.rasse = 'hannoveraner';
    ok('ohne Hufrehe-Gefahr: Wunsch Weide auch im Frühling', !reheGefaehrdet(P) && haltungJetzt(e, P) === 'weide');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join('; ') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
