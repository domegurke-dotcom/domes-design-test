// v1052 (17.11.2026, Reste der Aufträge 10–12): Rückmeldung zur Bestattung, Urnengrab beim Löschen, Zwillinge bei Pensionsstuten (Besitzer entscheidet),
// Verfohlen-Brief bei bekannten Zwillingen, Aufsicht hilft dem zweiten Zwilling, Leihmutter-Fohlen alter Stände ziehen um, Traber-Qualifikation (1:25,0, nach 6 Monaten neu),
// Pass aus dem Tölt (Tölt wird passig), neue Wissenskarten.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/reste-1052-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99;
    while (spiel.boxen.length < 10) spiel.boxen.push(JSON.parse(JSON.stringify({ ...spiel.boxen[spiel.boxen.length - 1], pferd: null, fohlen: null })));
    window.neu = (i, rasse, o) => { const P = neuesPferd({ rasse: rasse || 'hannoveraner', geschlecht: (o && o.g) || 'Wallach', alter: (o && o.alter) || 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; return P; };
    window.letzterBrief = () => (spiel.post || [])[0] || {}; });
  let r;
  // 1) Gedenkplatz: Rückmeldung zur Wahl
  r = await pg.evaluate(() => { const g = { name: 'Bella', wahl: 'offen', ursache: 'Kolik', alter: '20 Jahre' }; (spiel.friedhof = spiel.friedhof || []).push(g); const okW = grabWaehlen(g, 'fremd');
    return { okW, grab: g.grab, txt: document.getElementById('dlgInhalt').innerText }; });
  ok('Bestattung „Tierfriedhof“: Fenster nennt die Wahl', r.okW && r.grab === 'fremd' && /Tierfriedhof beigesetzt/.test(r.txt), JSON.stringify(r));
  await pg.click('#dlgKnoepfe button').catch(() => {});
  // 2) Zwillinge: Pensionsstute – Besitzer entscheidet, kein Aktions-Brief an dich, keine Kosten
  r = await pg.evaluate(() => { const P = neu(1, 'vollblut', { g: 'Stute', alter: 9 }); P.einsteller = { id: 'e1', name: 'Frau Muster' };
    const ist = typeof fremd === 'function' ? fremd(P) : null; P.gedeckt = { vater: { name: 'V', rasse: 'vollblut' }, art: 'natur', tag: spiel.tag - 3, seit: jzJetzt(), erfolg: true, zw: true };
    const g0 = spiel.geld, t = zwillingErkannt(P, true), B = letzterBrief();
    return { ist, t, geld: spiel.geld - g0, br: B.betreff, akt: !!B.aktion, ant: (P.gedeckt || P.traechtig || {}).zwAntwort || (P.gedeckt ? '' : 'leer') }; });
  ok('Pensionsstute mit Zwillingen: Besitzer entscheidet (Brief ohne Knopf, keine Kosten)', r.ist === false || (/Besitzer/.test(r.t) && !r.akt && r.geld === 0 && /Zwillinge/.test(r.br || '')), JSON.stringify(r));
  // 3) Verfohlen-Brief bei bekannten Zwillingen
  // (der Verfohlen-Lauf hängt am Jahreszeitwechsel – geprüft wird der Text im Code)
  r = await pg.evaluate(() => /hat die Zwillinge verloren/.test(document.documentElement.innerHTML) || /die Zwillinge verloren/.test([...document.scripts].map(s => s.textContent).join('')));
  ok('Verfohlen-Brief nennt bekannte Zwillinge als Ursache (Text im Spiel)', r);
  // 4) Aufsicht verbessert die Chance auf zwei lebende Zwillinge
  r = await pg.evaluate(() => ({ x: ZWILLING.aufsichtX.maAbfohl, o: ZWILLING.aufsichtX.ohne }));
  ok('Aufsicht bei der Geburt: zweiter Zwilling überlebt öfter (Nachtdienst+Abfohlbox ×2)', r.x === 2 && r.o === undefined, JSON.stringify(r));
  // 5) Leihmutter-Fohlen (alter Spielstand) zieht nachts zur Leihmutter
  r = await pg.evaluate(() => { const M = neu(4, 'hannoveraner', { g: 'Stute', alter: 9 }); const F0 = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Eigen' }); spiel.boxen[4].fohlen = F0;
    const W = neu(5, 'hannoveraner', { g: 'Stute', alter: 0.3 }); W.waise = { art: 'leihmutter', mid: M.id, tag: spiel.tag }; waiseNacht();
    return { zu: spiel.boxen[4].fohlen2 === W, frei: !spiel.boxen[5].pferd }; });
  ok('Leihmutter-Fohlen eines alten Stands zieht zur Leihmutter, eigene Box wird frei', r.zu && r.frei, JSON.stringify(r));
  // 6) Traber-Qualifikation
  r = await pg.evaluate(() => { const P = neu(6, 'traber', { g: 'Wallach', alter: 4 }); P.skalaT = [0, 0, 0, 0, 0];
    const s0 = trabQualiStand(P); P.trabQuali = { tag: spiel.tag, zeit: 84.2 }; const s1 = trabQualiStand(P);
    P.trabQuali.tag = spiel.tag - 2 * tpj() - 1; const s2 = trabQualiStand(P);
    P.erfolge = [{ tag: spiel.tag - 2, disz: 'trabrennen' }]; const s3 = trabQualiStand(P);
    const alt = neu(7, 'traber', { g: 'Wallach', alter: 5 }); (alt.skalaT = alt.skalaT || [0, 0, 0, 0, 0])[4] = 60; const s4 = trabQualiStand(alt);
    return { s0, s1, s2, s3, s4, zeit: kmZeitTxt(84.2), inSperre: [...document.scripts].some(x => x.textContent.includes('const q = trabQualiStand(p) || trab28Sperre(p, t.tag, false); if (q) return q;')) }; });
  ok('Traber: ohne Qualifikation gesperrt, mit Quali frei', /Qualifikation fehlt/.test(r.s0) && r.s1 === '' && r.inSperre, JSON.stringify(r));
  ok('Traber: 6 Monate ohne Rennen → Quali abgelaufen; Rennen dazwischen hält sie gültig', /abgelaufen/.test(r.s2) && r.s3 === '', JSON.stringify(r));
  ok('Traber alter Spielstand (Quali-Stufe ≥ 50 %) gilt als qualifiziert; km-Zeit 1:24,2', r.s4 === '' && r.zeit === '1:24,2', JSON.stringify(r));
  // 7) Qualifikationslauf über das echte Training
  r = await pg.evaluate(() => { const P = spiel.boxen[6].pferd; delete P.trabQuali; P.skalaT = [80, 80, 80, 60, 10]; P.energie = 100; delete P.trainHeute; let e = null, err = '';
    try { e = trainieren(P, 'trabquali', 'rennbahn'); } catch (x) { err = x.message; } const h = (P.trainHeute && P.trainHeute.hinweise) || (e && e.hinweise) || [];
    return { err, h: h.join(' | ').slice(0, 300), q: P.trabQuali || null }; });
  ok('Qualifikationslauf meldet die km-Zeit (geschafft oder nicht)', !r.err && /Kilometerzeit von 1:\d\d,\d/.test(r.h), JSON.stringify(r));
  // 8) Pass aus dem Tölt
  r = await pg.evaluate(() => { const U = UEBUNG.passtoelt, P = neu(8, 'isi', { g: 'Wallach', alter: 8 }); P.werte.gang.toelt = P.werte.gang.toelt ?? 7; P.werte.gang.pass = P.werte.gang.pass ?? 6;
    const t0 = gangGezeigt(P).toelt; for (let i = 0; i < 40; i++) { P.gangToelt = r2(Math.max(-PASS_TOELT_MAX, (P.gangToelt || 0) - PASS_TOELT_ABZUG)); }
    return { da: !!U, n: U && U.n, gang: U && U.gangart, skN: U && JSON.stringify(U.skN), t0, t1: gangGezeigt(P).toelt, abz: PASS_TOELT_ABZUG, ist: istPassUeb('passtoelt') && istPassUeb('passtraining') }; });
  ok('Übung „Passtraining (aus dem Tölt)“ wie Passtraining, zählt beim Übertraining mit', r.da && /Tölt/.test(r.n) && r.gang === 'pass' && /pass/.test(r.skN) && r.ist, JSON.stringify(r));
  ok('Zu oft Pass aus dem Tölt: Tölt-Note sinkt (passig), höchstens um 0,5 (Auftrag 25)', r.t1 === r.t0 - 0.5 && r.abz === 0.015, JSON.stringify(r));
  // 9) Wissenskarten
  r = await pg.evaluate(() => ENZY.wissen.eintraege.map(e => e[0]).filter(t => /stirbt|Zwillinge|Traber|Rennpass/.test(t)));
  ok('Wissenskarten: Tod, Zwillinge, Traber, Rennpass', r.length === 4, JSON.stringify(r));
  // 10) Urnengrab beim „Ganz löschen“ genannt (Text im Spiel)
  ok('Aufräumen: Rückfrage nennt Urnengräber', await pg.evaluate(() => [...document.scripts].some(s => /Urnengrab – es wird/.test(s.textContent))));
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
