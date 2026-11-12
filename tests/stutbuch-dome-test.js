// Domes Entscheidungen 12.11.2026 zum Stutbuch: (a) Staatsprämie = Hauptstutbuch/Stutbuch I + SLP ab 7,5 ohne Prämie,
// (b) Islandpferd: Reitprüfung (FIZO) gehört zur Eintragung, (c) Mutter in der Hauptabteilung reicht (Hannoveraner), (d) Wappen-Zeichen nach dem Namen
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.env.BILDER_ORDNER;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere || []; zbBestand();
    window.mk = (n, g, i, rasse = 'hannoveraner', alter = 6) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; }; });
  let r;
  // a) Staatsprämie ohne Prämie: Hauptstutbuch, Schau-Note 7,0, 9 Jahre, SLP ≥ 7,5
  r = await pg.evaluate(() => { const S = mk('Staatsi', 'Stute', 0, 'hannoveraner', 9); let erg = null;
    for (let k = 0; k < 40; k++) { S.zb = { i: 0, noten: { typ: 7, koerper: 7, korrekt: 7, schritt: 7, trab: 7, eindruck: 7, gesamt: 7 }, gesamt: 7, tag: spiel.tag, art: 'schau' }; zbSlp(S, 'station', 'profi', 'Station', zufall('st' + k)); if (S.zb.slp >= 7.5) { erg = { slp: S.zb.slp, staats: !!S.zb.staats, praemie: !!S.zb.praemie }; break; } erg = { slp: S.zb.slp, staats: !!S.zb.staats }; }
    const S2 = mk('Stutbuchi', 'Stute', 1, 'hannoveraner', 9); S2.zb = { i: 1, noten: { typ: 7, koerper: 7, korrekt: 7, schritt: 7, trab: 7, eindruck: 7, gesamt: 7 }, gesamt: 7, tag: spiel.tag, art: 'schau' }; S2.werte.gang = { ...S2.werte.gang }; let e2 = null; for (let k = 0; k < 40; k++) { S2.zb = { ...S2.zb, slp: 0, staats: false, slpStation: false }; zbSlp(S2, 'station', 'profi', 'Station', zufall('s2' + k)); if (S2.zb.slp >= 7.5) { e2 = { slp: S2.zb.slp, i: S2.zb.i, staats: !!S2.zb.staats }; break; } }
    return { erg, e2, bis: zbStaatsBis(VERBAND.hannoveraner) }; });
  ok('Staatsprämie ohne Prämienanwartschaft (Hauptstutbuch + SLP ≥ 7,5)', r.erg && (r.erg.slp < 7.5 || r.erg.staats), JSON.stringify(r));
  ok('Hannoveraner: auch Stutbuch zählt für die Staatsprämie', r.bis === 1 && (!r.e2 || r.e2.staats), JSON.stringify(r));
  // b) Islandpferd: geritten → FIZO bei der Eintragung
  r = await pg.evaluate(() => { const I = mk('Isa', 'Stute', 2, 'isi', 6); I.ahnenUnvollst = false; I.training = I.training || {}; const alt = diszAusb; window.__ausb = true;
    const orig = window.diszAusb; const i = (() => { const save = I.skala; try { I.ausb = I.ausb || {}; } catch (e) {} return null; })();
    const vor = diszAusb(I, DISZ.toelt); if (vor < STUFE_STAND[0]) { try { Object.keys(I.ausbildung || {}).forEach(k => {}); } catch (e) {} }
    return { vor, stand: STUFE_STAND[0] }; });
  out.push('ℹ Isa Tölt-Ausbildung vorher: ' + JSON.stringify(r));
  r = await pg.evaluate(() => { const I = spiel.boxen[2].pferd; const echt = diszAusb; diszAusb = (p, D) => p === I ? 40 : echt(p, D); let res;
    try { const i = zbEintragen(I, 'schau', 'Stutenschau in X', zufall('isi1')); res = { i, zb: I.zb, brief: ((spiel.post || []).slice().reverse().find(x => /Eintragung: Isa/.test(x.betreff || '')) || {}).text || '' }; } finally { diszAusb = echt; }
    const J = mk('Jungisa', 'Stute', 3, 'isi', 3); J.ahnenUnvollst = false; zbEintragen(J, 'schau', 'Stutenschau in X', zufall('isi2')); const b2 = ((spiel.post || []).slice().reverse().find(x => /Eintragung: Jungisa/.test(x.betreff || '')) || {}).text || '';
    return { ...res, b2: /nur an der Hand/.test(b2), fizoTxt: /Reitprüfung \(FIZO\)/.test(res.brief) }; });
  ok('Islandpferd geritten: Reitprüfung (FIZO) bei der Eintragung, Note gespeichert', r.zb && r.zb.fizo && r.zb.slp > 0 && r.fizoTxt, JSON.stringify({ i: r.i, slp: r.zb && r.zb.slp }));
  ok('Junges Islandpferd: nur an der Hand vorgestellt (Hinweis)', r.b2, r.b2);
  // c) Mutter im Stutbuch (Rang 1) reicht fürs Hauptstutbuch
  r = await pg.evaluate(() => { const T = mk('Tochter', 'Stute', 4); const M = { nr: 'm-x' }; T.ahnen.mutter = { ...T.ahnen.mutter, nr: 'm-x' }; T.mutterZb = 1; const a = zbMutterOk(T, true); T.mutterZb = 2; const c = zbMutterOk(T, true); T.rasse = 'trakehner'; T.mutterZb = 1; const d = zbMutterOk(T, true); T.rasse = 'hannoveraner'; return { stutbuch: a, vorbuch: c, trakehner: d }; });
  ok('Hannoveraner: Mutter im Stutbuch reicht, im Vorbuch nicht', r.stutbuch === true && r.vorbuch === false, JSON.stringify(r));
  // d) Wappen (jeder Balken enthält das Muster „V44 H“ zweimal)
  r = await pg.evaluate(() => { const L = [['Hauptstutbuch', 'gold'], ['Stutbuch I', 'gold'], ['Stutbuch II', 'silber'], ['Stutbuch III', 'bronze'], ['Stutbuch II', 'bronze'], ['Vorbuch', 'gruen'], ['Anhang', 'gruen'], ['Prämienbuch', 'gold'], ['Basisstutbuch', 'gruen']];
    const zaehl = (svg) => (svg.match(/V44 H/g) || []).length;
    const res = L.map(([n, f]) => ({ n, f, balken: zaehl(zuchtbuchSymbol(n, 60, f)) }));
    dialog(`<h3>Wappen</h3><div style="display:flex;flex-wrap:wrap;gap:14px">${L.map(([n, f]) => `<div style="text-align:center;font-size:12px">${zuchtbuchSymbol(n, 60, f)}<br>${n}<br>(${f})</div>`).join('')}</div>`); return res; });
  const z = Object.fromEntries(r.map(x => [x.n + '/' + x.f, x.balken]));
  ok('Wappen: Stutbuch II (silber) zeigt II, Stutbuch III zeigt III, Anhang ohne Zeichen', z['Stutbuch II/silber'] === 4 && z['Stutbuch III/bronze'] === 6 && z['Stutbuch I/gold'] === 2 && z['Anhang/gruen'] === 0, JSON.stringify(z));
  if (ORD) await pg.screenshot({ path: path.join(ORD, 'wappen.png') });
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
