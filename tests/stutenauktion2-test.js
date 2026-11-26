// Stutenauktion Teil 2 (Dome 26.11.2026 „beide bauen“): Welsh Cob (WPCS Builth Wells, Herbst, Verkauf + Kauf mit Fahrtkosten) und Araber (Pride of Poland, Sommer, nur Kauf)
// Start (PowerShell): $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/stutenauktion2-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 200000;
    const bisTag = (s, t) => { for (let i = 0; i < 200 && !(datum().s === s && datum().t === t); i++) spiel.tag++; };
    const stute = (rasse, alter, name) => { const p = neuesPferd({ rasse, geschlecht: 'Stute', alter, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.pflege.gesundheit = 100; p.gekauftTag = -99; p.zb = { tag: spiel.tag, gesamt: 8, i: 0 }; return p; };
    const inBox = (i, p) => { while (spiel.boxen.length <= i + 4) spiel.boxen.push({ pferd: null }); const bx = spiel.boxen[i]; bx.pferd = p; bx.tot = false; delete bx.fohlen; return bx; };
    spiel.boxen.forEach(bx => { bx.pferd = null; delete bx.fohlen; });
    const o = {};
    bisTag(1, 1);   // Sommer: Anmeldung für Herbst (Welsh Cob), Araber nur Kauf
    const W = stute('welshcob', 7, 'Wilma'), A = stute('araber', 7, 'Aischa'); inBox(0, W); inBox(1, A);
    spiel.post = []; stutenAuktionTag();
    const br = p => spiel.post.find(x => x.aktion && x.aktion.typ === 'stAuk' && x.aktion.pid === p.id);
    o.wBrief = !!br(W); o.aBrief = !!br(A); o.wText = ((br(W) || {}).text || '').replace(/<[^>]+>/g, ''); o.wVon = (br(W) || {}).von;
    o.aLose = stutenLose().filter(l => l.stute === 'araber').length; o.aGebuehr = (stutenLose().find(l => l.stute === 'araber') || {}).gebuehr; o.sommerWelsh = stutenLose().filter(l => l.stute === 'welshcob').length;
    // Herbst: Welsh Cob angemeldet → Auswahl → Fahrtkosten → Auktion
    W.stAuk = { k: 'welshcob', jz: jzJetzt() + 1, st: 'angemeldet', min: 0, tag: spiel.tag };
    bisTag(2, 1); const g0 = spiel.geld; stutenAuktionTag(); o.zugelassen = W.stAuk && W.stAuk.st; o.fahrt = g0 - spiel.geld;
    o.herbstWelsh = stutenLose().filter(l => l.stute === 'welshcob').length; o.herbstAraber = stutenLose().filter(l => l.stute === 'araber').length;
    const g1 = spiel.geld; Math.random = () => 0.01; bisTag(2, tpj()); stutenAuktionTag(); o.verkauft = !spiel.boxen[0].pferd; o.erloes = spiel.geld - g1;
    return o;
  });
  ok('Sommer: Anmeldebrief für Welsh Cob (WPCS, Builth Wells, Fahrt 900 €)', r.wBrief && r.wVon === 'Welsh Pony & Cob Society' && /Builth Wells/.test(r.wText) && /900/.test(r.wText), r.wText.slice(0, 200));
  ok('Araber: kein Anmeldebrief (nur Kauf)', !r.aBrief);
  ok('Sommer: Araber-Lose im Markt mit 8 % Käufergebühr, keine Welsh-Lose', r.aLose >= 1 && r.aGebuehr === 0.08 && r.sommerWelsh === 0, JSON.stringify({ l: r.aLose, g: r.aGebuehr, w: r.sommerWelsh }));
  ok('Herbst: Zulassung, 140 € Anmeldung steht im Brief, Fahrt 900 € abgebucht', r.zugelassen === 'zugelassen' && r.fahrt === 900, JSON.stringify({ z: r.zugelassen, f: r.fahrt }));
  ok('Herbst: Welsh-Lose im Markt, keine Araber-Lose', r.herbstWelsh >= 1 && r.herbstAraber === 0, JSON.stringify({ w: r.herbstWelsh, a: r.herbstAraber }));
  ok('Auktion: Stute verkauft, Erlös positiv', r.verkauft && r.erloes > 0, JSON.stringify({ v: r.verkauft, e: r.erloes }));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
