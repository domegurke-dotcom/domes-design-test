// Stutenauktion Teil 3 (26.11.2026): Westfale (Münster-Handorf, Herbst, Stutbuch I), Connemara (Clifden, Sommer, Stutbuch I + Zuchtnachweis, Fahrt 1.200 €), Welsh Pony (wie Welsh Cob, Builth Wells, Herbst)
// Start (PowerShell): $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/stutenauktion3-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 300000;
    const bisTag = (s, t) => { for (let i = 0; i < 400 && !(datum().s === s && datum().t === t); i++) spiel.tag++; };
    const stute = (rasse, alter, name, kind) => { const p = neuesPferd({ rasse, geschlecht: 'Stute', alter, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.pflege.gesundheit = 100; p.gekauftTag = -99; p.zb = { tag: spiel.tag, gesamt: 8, i: 0 }; if (kind) p.kinder = [{ id: 'k1', name: 'Kind' }]; return p; };
    const inBox = (i, p) => { while (spiel.boxen.length <= i + 4) spiel.boxen.push({ pferd: null }); const bx = spiel.boxen[i]; bx.pferd = p; bx.tot = false; delete bx.fohlen; return bx; };
    spiel.boxen.forEach(bx => { bx.pferd = null; delete bx.fohlen; });
    const o = {}, br = p => spiel.post.find(x => x.aktion && x.aktion.typ === 'stAuk' && x.aktion.pid === p.id), txt = p => ((br(p) || {}).text || '').replace(/<[^>]+>/g, '');
    o.verband = { w: VERBAND.westfale.v, c: VERBAND.connemara.v, p: VERBAND.welshpony.v }; o.hengst = ['westfale', 'connemara', 'welshpony'].map(k => HENGST[k].sys);
    // Frühling: Connemara-Anmeldung für den Sommer
    bisTag(0, 1);
    const C = stute('connemara', 7, 'Connie', true), C0 = stute('connemara', 7, 'Cora', false); inBox(0, C); inBox(1, C0);
    spiel.post = []; stutenAuktionTag(); o.cBrief = !!br(C); o.cText = txt(C); o.cVon = (br(C) || {}).von;
    // Sommer: Welsh Pony + Westfale Anmeldung für den Herbst; Connemara-Lose im Markt
    bisTag(1, 1);
    const Wp = stute('welshpony', 6, 'Wanda'), We = stute('westfale', 6, 'Westi'); inBox(2, Wp); inBox(3, We);
    spiel.post = []; stutenAuktionTag();
    o.wpBrief = !!br(Wp); o.wpText = txt(Wp); o.weBrief = !!br(We); o.weText = txt(We); o.weVon = (br(We) || {}).von;
    o.sommerConn = stutenLose().filter(l => l.stute === 'connemara').length; o.sommerConnTrag = stutenLose().filter(l => l.stute === 'connemara' && l.pferd.traechtig).length;
    o.sommerWest = stutenLose().filter(l => l.stute === 'westfale' || l.stute === 'welshpony').length;
    // Connemara-Auktion im Sommer: angemeldet → Auswahl → Fahrt 1.200 → Auktion
    C.stAuk = { k: 'connemara', jz: jzJetzt(), st: 'angemeldet', min: 0, tag: spiel.tag }; C0.stAuk = { k: 'connemara', jz: jzJetzt(), st: 'angemeldet', min: 0, tag: spiel.tag };
    const g0 = spiel.geld; spiel.post = []; stutenAuktionTag(); o.cZug = C.stAuk && C.stAuk.st; o.c0Zug = C0.stAuk ? C0.stAuk.st : 'weg'; o.cFahrt = g0 - spiel.geld;
    const g1 = spiel.geld; Math.random = () => 0.01; bisTag(1, tpj()); stutenAuktionTag(); o.cVerkauft = !spiel.boxen[0].pferd; o.cErloes = spiel.geld - g1;
    // Herbst: Lose Westfale + Welsh Pony, keine Connemara
    bisTag(2, 1);
    o.herbstWe = stutenLose().filter(l => l.stute === 'westfale').length; o.herbstWp = stutenLose().filter(l => l.stute === 'welshpony').length; o.herbstConn = stutenLose().filter(l => l.stute === 'connemara').length;
    o.weGebuehr = (stutenLose().find(l => l.stute === 'westfale') || {}).gebuehr; o.weRoe = stutenLose().filter(l => l.stute === 'westfale' && l.pferd.roeBefund).length;
    o.wpGebuehr = (stutenLose().find(l => l.stute === 'welshpony') || {}).gebuehr;
    We.stAuk = { k: 'westfale', jz: jzJetzt(), st: 'angemeldet', min: 0, tag: spiel.tag }; Wp.stAuk = { k: 'welshpony', jz: jzJetzt(), st: 'angemeldet', min: 0, tag: spiel.tag };
    const g2 = spiel.geld; stutenAuktionTag(); o.weZug = We.stAuk && We.stAuk.st; o.wpZug = Wp.stAuk && Wp.stAuk.st; o.herbstKosten = g2 - spiel.geld;
    const g3 = spiel.geld; Math.random = () => 0.01; bisTag(2, tpj()); stutenAuktionTag(); o.weVerkauft = !spiel.boxen[3].pferd; o.wpVerkauft = !spiel.boxen[2].pferd; o.herbstErloes = spiel.geld - g3;
    return o;
  });
  ok('Verbände und Körung: Westfale/Connemara/Welsh Pony mit Körung (koer)', r.hengst.every(x => x === 'koer') && /Westfälisches/.test(r.verband.w) && /Clifden/.test(r.verband.c) && /WPCS/.test(r.verband.p), JSON.stringify(r.verband));
  ok('Frühling: Connemara-Anmeldebrief (Clifden, Fahrt 1.200 €, Zuchtnachweis-Regel)', r.cBrief && /Clifden/.test(r.cText) && /1\.200/.test(r.cText) && /Zuchtnachweis/.test(r.cText) && r.cVon === "Connemara Pony Breeders' Society", r.cText.slice(0, 220));
  ok('Sommer: Anmeldebriefe Welsh Pony (Builth Wells, 900 €) und Westfale (Münster-Handorf, 250 € Zulassung)', r.wpBrief && /Builth Wells/.test(r.wpText) && /900/.test(r.wpText) && r.weBrief && /Münster-Handorf/.test(r.weText) && /250/.test(r.weText) && r.weVon === 'Westfälisches Pferdestammbuch', r.weText.slice(0, 200));
  ok('Sommer: Connemara-Lose im Markt (alle mit Zuchtnachweis), keine Westfale/Welsh-Lose', r.sommerConn >= 1 && r.sommerConn === r.sommerConnTrag && r.sommerWest === 0, JSON.stringify({ c: r.sommerConn, t: r.sommerConnTrag, w: r.sommerWest }));
  ok('Connemara: Stute mit Fohlen zugelassen, ohne Zuchtnachweis abgelehnt, Fahrt 1.200 € abgebucht', r.cZug === 'zugelassen' && r.c0Zug !== 'zugelassen' && r.cFahrt === 1200, JSON.stringify({ z: r.cZug, z0: r.c0Zug, f: r.cFahrt }));
  ok('Connemara-Auktion: Stute verkauft, Erlös positiv', r.cVerkauft && r.cErloes > 0, JSON.stringify({ v: r.cVerkauft, e: r.cErloes }));
  ok('Herbst: Westfale-Lose (7,5 % Käufergebühr, ohne Röntgen) und Welsh-Pony-Lose (keine Gebühr), keine Connemara-Lose', r.herbstWe >= 1 && r.weGebuehr === 0.075 && r.weRoe === 0 && r.herbstWp >= 1 && r.wpGebuehr === 0 && r.herbstConn === 0, JSON.stringify({ we: r.herbstWe, g: r.weGebuehr, wp: r.herbstWp, c: r.herbstConn }));
  ok('Herbst: Zulassung beider, Kosten abgebucht (Westfale 250, Welsh Fahrt 900)', r.weZug === 'zugelassen' && r.wpZug === 'zugelassen' && r.herbstKosten >= 1150, JSON.stringify({ k: r.herbstKosten }));
  ok('Herbst-Auktion: beide Stuten verkauft, Erlös positiv', r.weVerkauft && r.wpVerkauft && r.herbstErloes > 0, JSON.stringify({ we: r.weVerkauft, wp: r.wpVerkauft, e: r.herbstErloes }));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
