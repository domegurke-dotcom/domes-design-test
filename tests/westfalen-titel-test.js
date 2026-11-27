// Westfalen-Titel (26.11.2026): Verbandsprämie, Staatsprämie, Leistungsstute, Elitestute, Westfälische Hauptprämie
// Quelle: westfalenpferde.de, "Stutbucheintragung und Stutenprämierungsklassen im Westfälischen Pferdestammbuch", Stand 04/2025
// Start: $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/westfalen-titel-test.js   ·   MOTOR=1 prüft den Motor
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
    const o = {}, mk = (n, alter, g) => { const p = neuesPferd({ rasse: 'westfale', geschlecht: g || 'Stute', alter, name: n }); p.anteile = { westfale: 100 }; p.pflege = p.pflege || erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.papiere = true; return p; };
    const V = VERBAND.westfale; o.v = [V.ehre, V.staatsBis, V.staatsSlp, V.vpNote];
    const S = (p, st) => { p.erfolge = p.erfolge || []; p.erfolge.push({ disz: 'dressur', stufe: st, plaziert: true, platz: 1 }); delete p.zbZ; };
    // 1) Eintragung mit 3 Jahren
    const a = mk('Anna', 3); const i = zbEintragen(a, 'schau', 'Stutenschau Test', () => 0.99);
    o.eintr = [i, a.zb && a.zb.gesamt, !!(a.zb && a.zb.anw), !!(a.zb && a.zb.vp), !!(a.zb && a.zb.praemie)];
    const noten = a.zb.noten;
    a.zb = { i: 0, gesamt: 7.8, tag: spiel.tag, anw: true, praemie: true, vp: true, noten };
    o.titelA = (zuchtbuchVon(a) || {}).titel;
    // 2) SLP ab 7,0 gibt die Staatsprämie
    zbSlp(a, 'feld', 'profi', 'Test', () => 0.5, { N: { trab: 7 }, gesamt: 7.0, abzug: 0 });
    o.staats = !!a.zb.staats; o.titelA2 = (zuchtbuchVon(a) || {}).titel;
    // 3) 6-jährige: keine Anwartschaft, keine Staatsprämie
    const c = mk('Cora', 6); c.zb = { i: 0, gesamt: 7.9, tag: spiel.tag, noten }; zbSlp(c, 'feld', 'profi', 'Test', () => 0.5, { N: { trab: 8 }, gesamt: 8, abzug: 0 }); o.cStaats = !!c.zb.staats;
    // 4) Leistungsstute
    const d = mk('Dora', 8); d.zb = { i: 0, gesamt: 7, tag: spiel.tag, noten }; o.l0 = zbEhren(d).find(x => x.k === 'leist').ok;
    S(d, 3); o.lM = zbEhren(d).find(x => x.k === 'leist').b.map(y => y[0]);
    const fo = mk('Fohlen1', 1); fo.papiere = true; d.kinder = [fo]; S(d, 4); o.lS = zbEhren(d).find(x => x.k === 'leist').ok;
    d.zb.leist = spiel.tag; o.titelD = (zuchtbuchVon(d) || {}).titel; o.wertD = zuchtbuchVon(d).f;
    // 5) Elitestute
    const e = mk('Elke', 10); e.zb = { i: 0, gesamt: 7, tag: spiel.tag, noten };
    const k1 = mk('K1', 6); k1.zb = { i: 0, gesamt: 7, tag: spiel.tag, leist: 1 }; const k2 = mk('K2', 6); k2.zb = { i: 0, gesamt: 7, tag: spiel.tag, elite: 1 };
    e.kinder = [k1]; o.e5 = zbEhren(e).find(x => x.k === 'elite').ok; e.kinder = [k1, k2]; o.e10 = zbEhren(e).find(x => x.k === 'elite').ok;
    const eII = mk('Emma', 10); eII.zb = { i: 1, gesamt: 6, tag: spiel.tag, noten }; eII.kinder = [k1, k2]; o.eII = zbEhren(eII).find(x => x.k === 'elite').ok;
    // 6) Hauptprämie
    const h = mk('Hanna', 12); h.zb = { i: 0, gesamt: 7.6, tag: spiel.tag, staats: true, noten };
    const ks = [1, 2, 3, 4, 5, 6].map(n => { const q = mk('S' + n, 8); q.zb = { i: 0, gesamt: 7, tag: spiel.tag }; S(q, 4); return q; });
    h.roeBefund = { k: 1, tag: spiel.tag };
    h.kinder = ks.slice(0, 4); o.h5 = zbEhren(h).find(x => x.k === 'haupt').b.map(y => y[0]);
    h.kinder = ks.slice(0, 5); o.h6 = zbEhren(h).find(x => x.k === 'haupt').b.map(y => y[0]);   /* 5 Kinder + sie selbst ohne S = 5 */
    h.kinder = ks; h.roeBefund = { k: 3, tag: spiel.tag }; o.hRoe3 = zbEhren(h).find(x => x.k === 'haupt').b.map(y => y[0]);
    h.roeBefund = { k: 1, tag: spiel.tag }; o.hOk = zbEhren(h).find(x => x.k === 'haupt').ok;
    const q0 = mk('Quer', 12); q0.zb = { i: 0, gesamt: 7, tag: spiel.tag, noten }; q0.kinder = ks; q0.roeBefund = { k: 1 }; o.hQuer = zbEhren(q0).find(x => x.k === 'haupt').ok;
    h.zb.haupt = spiel.tag; o.titelH = (zuchtbuchVon(h) || {}).titel; o.wertH = zuchtbuchVon(h).f;
    // 7) Hannoveraner unverändert
    const hv = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Hv' }); hv.anteile = { hannoveraner: 100 }; hv.werte = hv.werte || erzeugeWerte(hv); hv.zb = { i: 0, gesamt: 7, tag: spiel.tag }; hv.papiere = true;
    o.hannEhre = zbEhren(hv).map(x => x.k);
    return o;
  });
  ok('Westfale: ehre west, Staatsprämie bis Stutbuch I, SLP 7,0, Verbandsprämie 7,33', JSON.stringify(r.v) === JSON.stringify(['west', 0, 7, 7.33]), JSON.stringify(r.v));
  ok('Eintragung läuft ohne Fehler', r.eintr[0] === 0 || r.eintr[0] === 1 || r.eintr[0] === 2, JSON.stringify(r.eintr));
  ok('Titel Verbandsprämie', /Verbandsprämie/.test(r.titelA || ''), r.titelA);
  ok('SLP 7,0 reicht für die Staatsprämie (3–4 Jahre, Note 7,8)', r.staats === true && /Staatsprämienstute/.test(r.titelA2 || ''), r.titelA2);
  ok('6-jährige ohne Anwartschaft wird nicht Staatsprämienstute', r.cStaats === false);
  ok('Leistungsstute: erst mit Fohlen und Klasse S (Klasse M reicht nicht)', r.l0 === false && r.lM[1] === false && r.lM[2] === false && r.lS === true, JSON.stringify(r.lM));
  ok('Leistungsstute als Titel, Marktwert-Faktor ab 1,08', /Leistungsstute/.test(r.titelD || '') && r.wertD >= 1.08, r.titelD + ' ' + r.wertD);
  ok('Elitestute: 5 Punkte reichen nicht, 10 schon, nur im Stutbuch I', r.e5 === false && r.e10 === true && r.eII === false, [r.e5, r.e10, r.eII].join());
  ok('Hauptprämie: 4 bzw. 5 S-Pferde reichen nicht, 6 + Röntgen ja, Röntgen mit Risiko nein', r.h5[1] === false && r.h6[1] === false && r.hRoe3[1] === true && r.hRoe3[2] === false && r.hOk === true, JSON.stringify([r.h5, r.h6, r.hRoe3, r.hOk]));
  ok('Hauptprämie: Quereinstieg über S-Erfolg der Nachkommen', r.hQuer === true);
  ok('Hauptprämie als Titel, Faktor 1,2', /Westfälische Hauptprämie/.test(r.titelH || '') && r.wertH >= 1.2, r.titelH + ' ' + r.wertH);
  ok('Hannoveraner behält nur Leistungsstute', JSON.stringify(r.hannEhre) === '["leist"]', JSON.stringify(r.hannEhre));
  // Klick-Test
  await pg.evaluate(() => {
    const e = neuesPferd({ rasse: 'westfale', geschlecht: 'Stute', alter: 12, name: 'Klickstute' }); window.__e = e; e.anteile = { westfale: 100 }; e.werte = e.werte || erzeugeWerte(e); e.pflege = e.pflege || erzeugePflege(e); e.papiere = true;
    e.zb = { i: 0, gesamt: 7, tag: spiel.tag, noten: { typ: 7, koerper: 7, korrekt: 7, schritt: 7, trab: 7, eindruck: 7, gesamt: 7 } };
    const f = neuesPferd({ rasse: 'westfale', geschlecht: 'Stute', alter: 1, name: 'KlickFohlen' }); f.papiere = true; e.kinder = [f]; e.erfolge = [{ disz: 'springen', stufe: 4, plaziert: true, platz: 2 }];
    spiel.boxen[0].pferd = e; zuchtverbandDialog(e, () => {});
  });
  await pg.waitForTimeout(300);
  const knopf = await pg.$('[data-zbehre="leist"]'); ok('Dialog zeigt Knopf Beantragen für die Leistungsstute', !!knopf);
  const txt = await pg.evaluate(() => document.getElementById('dlg').innerText);
  ok('Dialog nennt Elitestute und Westfälische Hauptprämie mit Bedingungen', /Elitestute/.test(txt) && /Westfälische Hauptprämie/.test(txt) && /Klasse S/.test(txt));
  if (knopf) { await knopf.click(); await pg.waitForTimeout(300); }
  const titel = await pg.evaluate(() => (zuchtbuchVon(window.__e) || {}).titel);
  ok('Nach dem Klick: Leistungsstute verliehen', /Leistungsstute/.test(titel || ''), titel);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
