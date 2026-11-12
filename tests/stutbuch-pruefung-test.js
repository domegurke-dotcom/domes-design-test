// Stutbuch-Prüfung (Dome 12.11.2026): Befunde aus der gründlichen Durchsicht von Eignungsprüfung und Stutbuch
// Pensionsstuten gesperrt, keine Gebühr für Anfänger/Gnadenhof/alte Stuten, ohne Papiere nur unterste Abteilung (dann Papiere), Papiere sichtbar,
// Kauf-Fohlen-Papiere passend zur Mutter, Anwartschaft nach SLP-Aufstieg, Appaloosa-Prämie, Quarter ohne Noten, Marwari-Mischling,
// Turnier am 2. Stationstag, Mutter-Eintragung gemerkt, Kalender, Nachholen alter Termine
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.env.BILDER_ORDNER;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  const bild = async n => { if (ORD) await pg.screenshot({ path: path.join(ORD, n + '.png') }); };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere || []; zbBestand();
    window.mk = (n, g, i, rasse = 'hannoveraner', alter = 6) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; }; });
  let r;
  // 1 Pensionsstute
  r = await pg.evaluate(() => { const P = mk('Pensi', 'Stute', 0); P.einsteller = 'e1'; einstellerListe().push({ eid: 'e1', vn: 'A', nn: 'B', w: true, pid: P.id, leistungen: {}, zufr: 70, preis: 200 }); return { sp: zbSperre(P, null, { zb: 'hof' }), html: merkmaleHTML(P, {}, () => '', () => '', () => '') }; });
  ok('Pensionsstute: gesperrt, kein Knopf Zuchtverband', /Pensionspferd/.test(r.sp) && !/data-zuchtverband/.test(r.html), r.sp);
  // 2/14 Jahresgebühr
  r = await pg.evaluate(() => { const A = mk('Alt', 'Stute', 1, 'hannoveraner', 23); A.zb = { i: 0, gesamt: 7 }; const J = mk('Jung', 'Stute', 2); J.zb = { i: 0, gesamt: 7 };
    spiel.kal = null; spiel.tag = 1 + 4 * tpj(); delete (spiel.hof || spiel).zbJahr; let g = spiel.geld; zbJahresgebuehr(); const exp = g - spiel.geld;
    const st = spiel.spieler.stufe; spiel.stufenAn = true; spiel.spieler.stufe = 'anf'; delete (spiel.hof || spiel).zbJahr; g = spiel.geld; let anf = 0; try { zbJahresgebuehr(); anf = g - spiel.geld; } finally { spiel.stufenAn = false; spiel.spieler.stufe = st; } return { exp, anf }; });
  ok('Jahresgebühr nur für Stuten bis 20 Jahre (40 €)', r.exp === 40, JSON.stringify(r));
  ok('Anfänger zahlen keine Jahresgebühr', r.anf === 0, JSON.stringify(r));
  // 3 ohne Papiere
  r = await pg.evaluate(() => { const S = mk('Ohne', 'Stute', 3); S.papiere = false; S.ahnenUnvollst = false; const N = { typ: 9, koerper: 9, korrekt: 9, schritt: 9, trab: 9, eindruck: 9, gesamt: 9 }; const i = zbStufeFinden(S, N, null, null), V = verbandVon(S);
    spiel.kal = null; spiel.tag = 1; const iE = zbEintragen(S, 'hof', 'Hofbesuch', zufall('o1')); return { i, letzte: V.stufen.length - 1, iE, pap: S.papiere, wf: zbWertFaktor(S) }; });
  ok('Ohne Papiere: höchstens unterste Abteilung', r.i === r.letzte, JSON.stringify(r));
  ok('Eingetragen: bekommt Papiere, kein Abzug mehr', r.iE == null || (r.pap === true && r.wf > 0.9), JSON.stringify(r));
  // 4 Papiere sichtbar
  r = await pg.evaluate(() => { const F = mk('Fohli', 'Stute', 4, 'hannoveraner', 1); F.papiere = false; F.papiereNie = true; const h1 = merkmaleHTML(F, {}, () => '', () => '', () => ''); F.papiere = true; const h2 = merkmaleHTML(F, {}, () => '', () => '', () => ''); return [/Nur Equidenpass/.test(h1), /Papiere mit Abstammungsnachweis/.test(h2)]; });
  ok('Merkmale zeigen Papiere / nur Equidenpass', r[0] && r[1], r.join());
  // 5 Kauf: Fohlen-Papiere passen zur Mutter
  r = await pg.evaluate(() => { let falsch = 0, n = 0; for (let i = 0; i < 80; i++) { const M = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'K' + i }); M.anteile = { hannoveraner: 100 }; M.werte = M.werte || erzeugeWerte(M); const F = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'KF' + i }); F.anteile = { hannoveraner: 100 }; M.fohlenBeiFuss = F;
      zbKauf(M, 'Privat'); n++; const mz = !!(M.zb && M.zb.i != null); if (F.papiere !== mz) falsch++; } return { n, falsch }; });
  ok('Kaufstute mit Fohlen: Fohlen hat genau dann Papiere, wenn die Mutter eingetragen ist', r.falsch === 0, JSON.stringify(r));
  // 6 Araber: Anwartschaft nach SLP-Aufstieg
  r = await pg.evaluate(() => { const A = mk('Ara', 'Stute', 5, 'araber', 5); const V = verbandVon(A); A.zb = { i: 1, noten: { typ: 8, koerper: 8, korrekt: 8, schritt: 8, trab: 8, eindruck: 8, gesamt: 8 }, gesamt: 8, tag: spiel.tag, art: 'schau' };
    const rnd = Math.random; let res; try { const orig = zbSlpNote; window.__n = 0; res = (() => { const R = { N: { a: 9 }, gesamt: 9, abzug: 0 }; const Z = A.zb; Z.slp = 9; return R; })(); } finally { Math.random = rnd; }
    const neuI = zbStufeFinden(A, A.zb.noten, 9, null); return { sys: V.sys, stufen: V.stufen.map(s => s.n + (s.slp ? '(slp)' : '')), neuI }; });
  out.push('ℹ Araber: ' + JSON.stringify(r));
  r = await pg.evaluate(() => { const A = spiel.boxen[5].pferd; A.zb = { i: 1, noten: { typ: 8, koerper: 8, korrekt: 8, schritt: 8, trab: 8, eindruck: 8, gesamt: 8 }, gesamt: 8, tag: spiel.tag, art: 'schau' }; let fertig = false;
    for (let k = 0; k < 30 && !fertig; k++) { const z = { ...A.zb }; delete z.slp; delete z.slpStation; delete z.slpFeld; delete z.anw; delete z.praemie; A.zb = z; zbSlp(A, 'station', 'profi', 'Station', zufall('ara' + k)); fertig = A.zb.i === 0; }
    return { i: A.zb.i, slp: A.zb.slp, anw: !!A.zb.anw, praemie: !!A.zb.praemie }; });
  ok('Araber: nach SLP-Aufstieg ins Leistungsstutbuch Prämienanwärterin/Prämienstute', r.i !== 0 || (r.anw && (r.praemie || r.slp < 5)), JSON.stringify(r));
  // 8/9 Appaloosa / Quarter
  r = await pg.evaluate(() => { const Q = mk('Appi', 'Stute', 0, 'appaloosa', 6); Q.ahnenUnvollst = false; const lin = zbLinear(Q); const i = zbEintragen(Q, 'hof', 'Hofbesuch', zufall('ap')); zuchtverbandDialog(Q, null); const txt = $('dlg').textContent; return { lg: lin.lg, i, praemie: !!(Q.zb && Q.zb.praemie), txt: /Leistungsgruppe/.test(txt), noten: /Korrektheit des Gangs/.test(txt) }; });
  ok('Appaloosa: Fenster zeigt Leistungsgruppe statt Noten', r.txt && !r.noten, JSON.stringify(r));
  ok('Appaloosa: Gruppe I = Prämienstute', r.i == null || (r.lg === 1) === r.praemie, JSON.stringify(r));
  await bild('stutbuch-appaloosa'); await pg.evaluate(() => { $('dlg').hidden = true; });
  // 10 Marwari-Mischling
  r = await pg.evaluate(() => { const W = mk('Mawa', 'Stute', 1, 'marwari', 6); W.anteile = { marwari: 75, araber: 25 }; return zbEintragen(W, 'hof', 'Hofbesuch', zufall('mw')); });
  ok('Marwari-Mischling wird nicht registriert', r == null, r);
  // 11 Turnier am 2. Tag der Stationsprüfung
  r = await pg.evaluate(() => { const S = spiel.boxen[2].pferd; spiel.kal = null; spiel.tag = 1; const st = { id: 'stx', tag: 5, art: 'slp', typ: 'zucht', name: 'Station', pruef: [{ id: 'q', zb: 'station' }], nennung: [{ pid: S.id, prid: 'q' }] };
    const T = { id: 'ttx', tag: 6, art: 'turnier', typ: 'regional', name: 'Turnier', pruef: [{ id: 'd1', disz: 'dressur', stufe: 0, starter: 10 }, { id: 'd2', disz: 'springen', stufe: 0, starter: 10 }], nennung: [] }; spiel.turniere.push(st, T);
    const sp = nennSperre(S, T, T.pruef[0]); st.nennung = []; T.nennung.push({ pid: S.id, prid: 'd1' }); const sp2 = nennSperre(S, T, T.pruef[1]); spiel.turniere = spiel.turniere.filter(x => x !== st && x !== T); return { sp, sp2 }; });
  ok('Turnier am 2. Tag der Stationsprüfung gesperrt', /Prüfung des Zuchtverbands/.test(r.sp), JSON.stringify(r));
  ok('Zweite Prüfung im selben Turnier bleibt möglich', !/Prüfung des Zuchtverbands/.test(r.sp2 || ''), JSON.stringify(r));
  // 15 Mutter-Eintragung bei der Geburt gemerkt
  r = await pg.evaluate(() => { const M = spiel.boxen[2].pferd; const f = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute', ahnen: { mutter: { nr: M.nr }, vater: {} } }; const V = hengstKopie(mk('Vati', 'Hengst', 4)); V.zul = true; zbPapiere(f, M, V); const gem = f.mutterZb;
    spiel.boxen[2].pferd = null; lebendNachNr.__neu = 1; const ok0 = zbMutterOk(f, false); spiel.boxen[2].pferd = M; return { gem, ok0 }; });
  ok('Mutter-Eintragung bei der Geburt gemerkt, zählt auch nach dem Verkauf', r.gem === 0 && r.ok0 === true, JSON.stringify(r));
  // 17 Kalender
  r = await pg.evaluate(() => { const S = spiel.boxen[2].pferd; spiel.kal = null; spiel.tag = 1; const st = { id: 'sty', tag: 5, art: 'slp', typ: 'zucht', name: 'Stationsprüfung in X', pruef: [{ id: 'q', zb: 'station' }], nennung: [{ pid: S.id, prid: 'q' }] }; spiel.turniere.push(st);
    const L1 = kalTermine(jzJetzt()).filter(x => /Stationsprüfung in X/.test(x.text)).map(x => x.tag); spiel.turniere = spiel.turniere.filter(x => x !== st); (spiel.hof || spiel).zbJahr = datum().j; const L2 = kalTermine(jzJetzt() + 4).filter(x => /Jahresgebühr/.test(x.text)).map(x => x.text); return { L1, L2 }; });
  ok('Kalender: Stationsprüfung an beiden Tagen', r.L1.includes(5) && r.L1.includes(6), JSON.stringify(r.L1));
  ok('Kalender: Jahresgebühr im nächsten Frühling', r.L2.length === 1, JSON.stringify(r.L2));
  // 12 alter Spielstand: Termine nachholen
  r = await pg.evaluate(() => { spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere.filter(t => t.typ !== 'zucht'); delete spiel.zbNach; turnierKalender(); return spiel.turniere.filter(t => t.typ === 'zucht' && t.art === 'stutenschau').length; });
  ok('Fehlende Stutenschauen werden nachgeholt', r > 0, r);
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
