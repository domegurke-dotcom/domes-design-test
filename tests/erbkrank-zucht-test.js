// v1048 (Auftrag 18): Erbkrankheiten, Veranlagungen und Zucht – Gentest 45 €, Trägeranteile, Skelett-Atavismus/IMM/DDB2, Pflicht-Gentest + Gesundheitsprüfung bei der Körung,
// Friesen-Verband (Träger × Träger, COI), Veranlagungen (Kehlkopf nach Größe, CPL Hengste, ERU über Leopard, Island-Import, h², Hufrolle/Spat), Hodenhochstand wie echt,
// Inzuchtkoeffizient (Halbgeschwister 12,5 %) und Wirkungen, NI mit/ohne Test, Nabelbruch, Stelzfuß, Fohlenrosse-Durchfall, Wissenskarten, alter Spielstand.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/erbkrank-zucht-test.js   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder (1366×768 und 390×844)   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; spiel.tag += 5; while (datum().s !== 1) spiel.tag++;
    while (spiel.boxen.length < 14) spiel.boxen.push(JSON.parse(JSON.stringify({ ...spiel.boxen[spiel.boxen.length - 1], pferd: null, fohlen: null })));
    window.neu = (i, rasse, o) => { const P = neuesPferd({ rasse: rasse || 'hannoveraner', geschlecht: (o && o.g) || 'Wallach', alter: (o && o.alter) || 8, name: (o && o.name) || 'Test' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.werte.ist.vertrauen = 100;
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; return P; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.bf = (i, art) => befundListe(spiel.boxen[i].pferd).find(x => x.art === art);
    window.briefMit = re => (spiel.post || []).find(x => re.test(x.betreff || '')); });
  const klick = async (sel) => { try { await pg.locator(sel).first().scrollIntoViewIfNeeded({ timeout: 4000 }); await pg.click(sel, { timeout: 4000 }); } catch (e) { L.push("✗ Knopf fehlt: " + sel); return; } await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); };
  const testKlick = async (i, art) => klick(`[data-bftest="${await pg.evaluate(([i, a]) => bf(i, a).id, [i, art])}"]`);
  const briefKnopf = async (re, aktion) => { const id = await pg.evaluate(r => { const x = briefMit(new RegExp(r)); return x && x.id; }, re); if (!id) return false;
    await pg.evaluate(id => briefFenster(id), id); await pg.waitForTimeout(150); const sel = `[data-baktion="a18-${aktion}"]`; if (!(await pg.$(sel))) return false; await pg.click(sel); await pg.waitForTimeout(150); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); return true; };
  const bild = async (name) => { if (!process.env.BILDER_ORDNER) return; await pg.waitForTimeout(100); await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png'), fullPage: false }); };

  // 1) Gentest 45 €, neue Krankheiten im Test, Trägeranteile (500 Pferde je Rasse, nur neue Pferde)
  let r = await pg.evaluate(() => { const S = neuesPferd({ rasse: 'shetty', geschlecht: 'Stute', alter: 6, name: 'S' }), Q = neuesPferd({ rasse: 'quarter', geschlecht: 'Stute', alter: 6, name: 'Q' }), N = neuesPferd({ rasse: 'noriker', geschlecht: 'Stute', alter: 6, name: 'N' });
    const z = (ra, k, n = 500) => { let c = 0; for (let i = 0; i < n; i++) { const P = neuesPferd({ rasse: ra, geschlecht: 'Stute', alter: 6, name: ra + k + i }); if ((erbVon(P)[k] || 0) >= 1) c++; } return c / n; };
    S.anteile = { shetty: 100 }; return { preis: laborPreis(S, 'krank'), sat: erbTestKrankheiten(S).includes('sat'), imm: erbTestKrankheiten(Q).includes('imm'), ddb2: erbTestKrankheiten(N).includes('ddb2'),
      wffs: z('hannoveraner', 'wffs'), fis: z('fell', 'fis'), ca: z('araber', 'ca'), satT: z('shetty', 'sat'), immT: z('quarter', 'imm'), ddbN: z('noriker', 'ddb2'), info: /Skelett-Atavismus/.test(LABOR_TESTS.krank.info) }; });
  ok('Gentest 45 €; Skelett-Atavismus, IMM, DDB2 (Noriker) im Erbkrankheiten-Test', r.preis === 45 && r.sat && r.imm && r.ddb2 && r.info, JSON.stringify(r));
  ok('Trägeranteile: WFFS Hannoveraner ≈ 17 %, FIS Fell ≈ 34 %, CA Araber ≈ 20 %, SAT Shetty ≈ 12 %, IMM Quarter ≈ 7 %, DDB2 Noriker ≈ 35 %',
    r.wffs > .11 && r.wffs < .23 && r.fis > .26 && r.fis < .42 && r.ca > .14 && r.ca < .26 && r.satT > .07 && r.satT < .17 && r.immT > .03 && r.immT < .11 && r.ddbN > .27 && r.ddbN < .44, JSON.stringify(r));
  r = await pg.evaluate(() => { const S = neuesPferd({ rasse: 'shetty', geschlecht: 'Stute', alter: 6, name: 'SS' }), H = neuesPferd({ rasse: 'shetty', geschlecht: 'Hengst', alter: 6, name: 'SH' }); erbVon(S).sat = 1; erbVon(H).sat = 1;
    let tot = 0, traeger = 0, kl = 0, n = 0; for (let i = 0; i < 80; i++) { const f = geburt({ pferd: S }, H, true); if (f.erbTod && f.erbTod.k === 'sat') tot++; }
    erbVon(S).sat = 0; erbVon(S).zwerg_s = 1; erbVon(H).zwerg_s = 0; erbVon(H).sat = 0; for (let i = 0; i < 60; i++) { const f = geburt({ pferd: S }, H, true); if (f.erb.zwerg_s === 1) { traeger++; kl += f.herkunft.sm.wert - f.zielStockmass; } n++; }
    return { tot, kl: traeger ? kl / traeger : 0, text: ERBKRANK.sat.text }; });
  ok('Skelett-Atavismus: aus Träger × Träger etwa jedes 4. Fohlen nicht lebensfähig; ACAN-Träger 2–3 cm kleiner', r.tot >= 8 && r.tot <= 35 && r.kl >= 2 && r.kl <= 3.01, JSON.stringify(r));

  // 2) IMM nach der Impfung, Muskel-Untersuchung mit echten Klicks
  r = await pg.evaluate(() => { const P = neu(0, 'quarter'); erbVon(P).imm = 1; P.pflege.impf = spiel.tag - 1; const R = Math.random; Math.random = () => 0.1; a18Tag(); Math.random = R; const b = bf(0, 'imm'); if (b) { b.diagnose = spiel.tag; b.tierarzt = true; } akte(0); return { da: !!b, g: b && untGruppe(b), name: b && befundSicht(P, b).name, u: b && b.ursache }; });
  ok('IMM: nach der Impfung Muskelschwund (Gruppe Muskel), Ursache nennt die Impfung', r.da && r.g === 'muskel' && /Muskelschwund/.test(r.name) && /Impfung/.test(r.u), JSON.stringify(r));
  for (let n = 0; n < 3; n++) await testKlick(0, 'imm');
  r = await pg.evaluate(() => { const b = bf(0, 'imm'); spiel.tag += 3; befundTestTag(); spiel.tag -= 3; const P = spiel.boxen[0].pferd; P.behHeute = { tag: spiel.tag - 1, a: {} }; return { klar: b.geklaert, f: (b.uFunde || []).join(' | '), kort: HILFT.imm.kortison, reiten: SCHADET.imm.reiten }; });
  ok('Klicks Abtasten → CK/AST → MYH1/Biopsie: IMM geklärt; Kortison hilft, Reiten schadet', r.klar && /IMM-Anlage/.test(r.f) && r.kort > .4 && r.reiten > .2, JSON.stringify(r));

  // 3) Körung: Pflicht-Gentest, Gesundheitsprüfung, Gentest im Pass
  r = await pg.evaluate(() => { const H = neu(1, 'hannoveraner', { g: 'Hengst', alter: 3, name: 'Koerling' }); H.pflege.impf = spiel.tag; H.gi = 3; H.pflege.gi = 3; turnierKalender();
    const t = (spiel.turniere || []).find(x => x.art === 'koerung' && x.tag > spiel.tag + 2) || null; const P = t ? t.pruef[0] : { zb: 'koer' };
    const ohne = hengstSperre(H, null, P); H.tests = { krank: true }; const mit = hengstSperre(H, null, P); return { ohne, mit }; });
  ok('Körung: ohne Pflicht-Gentest (WFFS) gesperrt, mit Gentest nicht mehr wegen des Tests', /Pflicht-Gentest fehlt \(WFFS\)/.test(r.ohne) && !/Gentest/.test(r.mit), JSON.stringify(r));
  r = await pg.evaluate(() => { const H = spiel.boxen[1].pferd; H.hoden = { art: 'leiste', seiten: 1, seite: 'rechts' }; erbVon(H).wffs = 1; const g0 = spiel.geld; hengstKoerung(H, 'Verden', zufall('k1'));
    const br = briefMit(/Körung: Koerling/); return { s: H.hb.s, kosten: g0 - spiel.geld, raus: H.hb.gesund.raus.join('|'), text: br && br.text, krypt: kryptBekannt(H) }; });
  ok('Körung mit Leistenhoden: nicht körfähig (Hoden), Röntgen 400 € bezahlt, Grund und Wallach-Vorschlag im Brief, WFFS-Träger im Pass', r.s === 'nein' && /Hoden/.test(r.raus) && r.kosten >= 400 && /Gesundheitsprüfung/.test(r.text) && /kastrieren/.test(r.text) && /WFFS Träger/.test(r.text) && r.krypt, JSON.stringify(r).slice(0, 400));
  r = await pg.evaluate(() => { const H = neu(2, 'hannoveraner', { g: 'Hengst', alter: 4, name: 'Gekoert' }); H.tests = { krank: true }; H.hoden = { art: 'normal' }; erbVon(H).wffs = 1; H.ocd = false; H.hb = { s: 'end', tag: spiel.tag }; return { t: hengstText(H), pflicht: a18PflichtGetestet(H) }; });
  ok('Gekörter Träger: Hengstkarte zeigt „WFFS Träger“', /WFFS Träger/.test(r.t), JSON.stringify(r));

  // 4) Friesen-Verband: Träger × Träger (Verwarnung, dann 2.000 €), COI über 5 %
  r = await pg.evaluate(() => { const S = neu(3, 'friese', { g: 'Stute', name: 'Fs' }), H = neu(4, 'friese', { g: 'Hengst', name: 'Fh' }); S.tests = { krank: true }; H.tests = { krank: true }; erbVon(S).zwerg_f = 1; erbVon(H).zwerg_f = 1; delete spiel.kfps;
    a18NachDecken(S, H); const w = !!briefMit(/Verwarnung: Träger/); const g0 = spiel.geld; a18NachDecken(S, H); return { w, strafe: g0 - spiel.geld, brief: !!briefMit(/Strafe: Träger/) }; });
  ok('Friesen-Verband: 1. Mal Verwarnung, 2. Mal 2.000 € Strafe', r.w && Math.abs(r.strafe - 2000) < .01 && r.brief, JSON.stringify(r));

  // 5) Inzuchtkoeffizient: Halbgeschwister → 12,5 %, Wirkungen, Anzeige im Abstammungsschein (Klick auf das Pferd)
  r = await pg.evaluate(() => { const V = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 10, name: 'Vati' }), M1 = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 10, name: 'Ma1' }), M2 = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 10, name: 'Ma2' });
    const S = geburt({ pferd: M1 }, V, true), H = geburt({ pferd: M2 }, V, true); S.geschlecht = 'Stute'; H.geschlecht = 'Hengst'; S.geb = { s: 0, j: datum().j - 6 }; H.geb = { s: 0, j: datum().j - 6 };
    const bx = spiel.boxen[5]; bx.pferd = S; S.pflege = erzeugePflege(S); S.befunde = []; const bx2 = spiel.boxen[6]; bx2.pferd = H; H.pflege = erzeugePflege(H); H.befunde = []; alterAktualisieren();
    const F = geburt({ pferd: S }, H, true), coiF = coiVon(F), paar = coiPaar(S, H), fremdS = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 6, name: 'Fremd' });
    window._F = F; const d1 = a18DeckF(F, H), d0 = a18DeckF(fremdS, H); const T = { vater: H }; const v1 = a18VerfohlenF(S, T), v0 = a18VerfohlenF(fremdS, T);
    return { paar, coiF, d1, d0, v1, v0, html: a18CoiPaarHTML(S, H), renn: a18RennF(F) }; });
  ok('COI: Halbgeschwister verpaart → Fohlen 12,5 %', Math.abs(r.paar - .125) < 1e-9 && Math.abs(r.coiF - .125) < 1e-9, JSON.stringify(r));
  ok('Inzucht wirkt: ingezüchtete Stute nimmt schlechter auf, mehr Verfohlen, Rennleistung kleiner; Vorschau rot mit 12,5 %', r.d1 < r.d0 && r.v1 > r.v0 && r.renn < 1 && /stat bad/.test(r.html) && /12,5 %/.test(r.html), JSON.stringify(r).slice(0, 300));
  await pg.evaluate(() => { pferdAnsehen({ p: window._F, ort: 'Test' }); });
  r = await pg.evaluate(() => document.getElementById('dlgInhalt').innerText);
  ok('Abstammungsschein zeigt den Inzuchtkoeffizienten', /Inzuchtkoeffizient \(COI\): 12,5 %/.test(r), r.slice(0, 200));
  await bild('coi-schein-1366'); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });

  // 6) Veranlagungen: Kehlkopf nach Größe, CPL Hengste, ERU über Leopard, Island-Import, h², Hufrolle/Spat
  r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'shire', geschlecht: 'Hengst', alter: 10, name: 'Sh' }); P.stockmass = 180; const gross = a18GroesseF(P); P.stockmass = 160; const normal = a18GroesseF(P);
    const lyH = BEFUND_MAL.lymphoedem(P, null, 'box', 1, 16); P.geschlecht = 'Stute'; const lyS = BEFUND_MAL.lymphoedem(P, null, 'box', 1, 16);
    const A = neuesPferd({ rasse: 'appaloosa', geschlecht: 'Stute', alter: 8, name: 'Ap' }); veranlagungVon(A).eru = .2; A.gen.Lp = ['Lp', 'Lp']; const lp2 = BEFUND_ZUSATZ.mondblind(A, null, 'box', 0, 8); A.gen.Lp = ['n', 'n']; const lp0 = BEFUND_ZUSATZ.mondblind(A, null, 'box', 0, 8);
    const I = neuesPferd({ rasse: 'isi', geschlecht: 'Stute', alter: 8, name: 'Isi' }); delete I.herkunftIsland; const e0 = BEFUND_MAL.sommerekzem(I, null, 'box', 1, 8); I.herkunftIsland = true; const e1 = BEFUND_MAL.sommerekzem(I, null, 'box', 1, 8);
    const W = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'Hr' }); veranlagungVon(W).hufrolle = .3; const h3 = BEFUND_MAL.hufrolle(W); veranlagungVon(W).hufrolle = .1; const h1 = BEFUND_MAL.hufrolle(W);
    let isl = 0; for (let i = 0; i < 300; i++) if (a18Markt({ id: 'mk' + i, rasse: 'isi', geschlecht: 'Stute' }).herkunftIsland) isl++;
    const M = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'OM' }), V = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'OV' }); let hoch = 0, ek = 0; const n = 200;
    veranlagungVon(M).ocd = .9; veranlagungVon(V).ocd = .9; veranlagungVon(M).ekzem = .9; veranlagungVon(V).ekzem = .9;
    for (let i = 0; i < n; i++) { const f = geburt({ pferd: M }, V, true); hoch += f.vl.ocd; ek += f.vl.ekzem; }
    return { gross, normal, lyH, lyS, lp2, lp0, e0, e1, h3, h1, isl, ocd: hoch / n, ekzem: ek / n, raA: VERANLAGUNG.eru.rassen.appaloosa, raK: VERANLAGUNG.eru.rassen.knabstrupper, hb: VL_INFO.hufrolle }; });
  ok('Kehlkopfpfeifen: 180 cm öfter als 160 cm; CPL: Hengste ×5', r.gross > 1.9 && r.normal === 1 && Math.abs(r.lyH / r.lyS - 5) < 1e-9, JSON.stringify(r));
  ok('Mondblindheit: LP/LP 4× lp/lp, Rassenwert Appaloosa .2 ≤ Knabstrupper', Math.abs(r.lp2 / r.lp0 - 4) < 1e-9 && r.raA === .2 && r.raK >= r.raA, JSON.stringify(r));
  ok('Sommerekzem: „Import aus Island“ ×7, etwa 20 % der Markt-Islandpferde (v1050)', Math.abs(r.e1 / r.e0 - 7) < 1e-9 && r.isl > 35 && r.isl < 90, JSON.stringify(r));
  ok('Erblichkeit: OCD (h² .4) folgt den Eltern stärker als Ekzem (h² .15)', r.ocd > r.ekzem + .1, JSON.stringify(r));
  ok('Hufrolle als Veranlagung: 0,3 → ×1, 0,1 → ×0,6', Math.abs(r.h3 - 1) < 1e-9 && Math.abs(r.h1 - .6) < 1e-9 && !!r.hb, JSON.stringify(r));

  // 7) Hodenhochstand: Verdacht mit 18 Monaten, Untersuchung mit Klicks, OP je Lage; Abstieg; Kastration lässt Hoden zurück; Wallach mit Hengstverhalten → Hormontest
  r = await pg.evaluate(() => { const H = neu(7, 'friese', { g: 'Hengst', alter: 1, name: 'Hodi' }); H.hoden = { art: 'leiste', seiten: 1, seite: 'rechts' }; H.geb = { s: datum().s, j: datum().j - 1 }; alterAktualisieren();
    const R = Math.random; Math.random = () => 0.9; a18HodenJz(H, 5); const vor = !!bf(7, 'krypt'); a18HodenJz(H, 6); Math.random = R; const b = bf(7, 'krypt'); akte(7);
    return { vor, da: !!b, bem: !!(b && b.bemerkt), diag: !!(b && b.sicher), brief: !!briefMit(/Hoden ist nicht tastbar/), zucht: zuchtSperre(H) }; });
  ok('Mit 18 Monaten: Verdacht (Brief), noch nicht sicher; einseitig sperrt die Zucht nicht', !r.vor && r.da && r.bem && !r.diag && r.brief && !/Hoden/.test(r.zucht), JSON.stringify(r));
  await testKlick(7, 'krypt'); await testKlick(7, 'krypt');
  r = await pg.evaluate(() => { const b = bf(7, 'krypt'); akte(7); return { klar: b.geklaert, lage: b.lage, f: (b.uFunde || []).join(' | '), opL: !!document.querySelector('[data-opklinik="kryptopLeiste"]'), opB: !!document.querySelector('[data-opklinik="kryptop"]'), preis: OP_KLINIK.kryptopLeiste.preis }; });
  ok('Klicks Abtasten → Ultraschall: Leistenhoden gefunden, nur die Leisten-OP (900 €) angeboten', r.klar && r.lage === 'leiste' && /in der Leiste/.test(r.f) && r.opL && !r.opB && r.preis === 900, JSON.stringify(r));
  await bild('hoden-1366');
  r = await pg.evaluate(() => { const H = spiel.boxen[7].pferd; const R = Math.random; Math.random = () => 0.001; a18HodenJz(H, 7); Math.random = R; return { art: H.hoden.art, weg: !bf(7, 'krypt'), brief: !!briefMit(/Hoden abgestiegen/) }; });
  ok('Leistenhoden steigt noch ab (Zufall): Befund weg, Brief', r.art === 'normal' && r.weg && r.brief, JSON.stringify(r));
  r = await pg.evaluate(() => { const H = neu(8, 'hannoveraner', { g: 'Hengst', alter: 3, name: 'Beid' }); H.hoden = { art: 'bauch', seiten: 2, seite: 'links' }; a18HodenJz(H, 9); const b = bf(8, 'krypt'); a18HodenJz(H, 9); b.diagnose = b.sicher ? b.diagnose : null;
    const sp = zuchtSperre(H), dc = a18DeckF(neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 6, name: 'x' }), H); const t = a18KastrVor(H); H.geschlecht = 'Wallach';
    return { diag: !!b.diagnose, sp, dc, rest: !!H.hodenRest, t: /noch da/.test(t), hv: b.wallachHV }; });
  ok('Beidseitig mit 2 J.: sicher, unfruchtbar (Zuchtsperre, Deckchance 0); normale Kastration lässt Hoden zurück', r.diag && /unfruchtbar/.test(r.sp) && r.dc === 0 && r.rest && r.t && r.hv, JSON.stringify(r));
  r = await pg.evaluate(() => { const W = neu(9, 'hannoveraner', { g: 'Wallach', alter: 6, name: 'Falsch' }); W.hodenRest = true; W.hoden = { art: 'bauch', seiten: 1, seite: 'links' }; a18Tag(); const b = bf(9, 'krypt'); akte(9);
    return { da: !!b, name: b && befundSicht(W, b).name, t: b && testAngebot(W, b) && testAngebot(W, b).n }; });
  ok('Gekaufter Wallach mit Hengstverhalten: Befund, nach dem Abtasten folgt der Hormontest', r.da && /Hengstverhalten/.test(r.name), JSON.stringify(r));
  await testKlick(9, 'krypt');
  r = await pg.evaluate(() => { const W = spiel.boxen[9].pferd, b = bf(9, 'krypt'); return testAngebot(W, b) && testAngebot(W, b).n; });
  ok('Schritt 2: Hormontest (hCG/AMH)', /Hormontest/.test(r || ''), String(r));

  // 8) Fohlen: NI ohne Test (Notfall-Brief, Klick Klinik), NI-Test vor dem Abfohlen mit Fremd-Kolostrum, Nabelbruch, Stelzfuß, Fohlenrosse-Durchfall
  r = await pg.evaluate(() => { const M = neu(10, 'vollblut', { g: 'Stute', alter: 9, name: 'Mama' }), V = neuesPferd({ rasse: 'vollblut', geschlecht: 'Hengst', alter: 9, name: 'Papa' }); M.niBlut = true; M.niAk = true; M.nachkommen = 1;
    const R = Math.random; let f = null; Math.random = () => 0.3; f = geburt(spiel.boxen[10], V); Math.random = R; return { ni: !!(f.fg && f.fg.ni), df: !!(f.fg && f.fg.df), nabel: !!(f.fg && f.fg.nabel), stelz: !!(f.fg && f.fg.stelz) }; });
  ok('Geburt: Stute mit Antikörpern, Fohlen mit passender Blutgruppe → NI angelegt', r.ni, JSON.stringify(r));
  await pg.evaluate(() => { spiel.tag++; a18FohlenTag(); });
  r = await pg.evaluate(() => ({ brief: !!briefMit(/schwach und gelb/) }));
  ok('Am Tag danach: Notfall-Brief „schwach und gelb“', r.brief, JSON.stringify(r));
  let g0 = await pg.evaluate(() => spiel.geld);
  let k = await briefKnopf('schwach und gelb', 'niKlinik');
  r = await pg.evaluate(() => { const f = spiel.boxen[10].fohlen; spiel.tag += 3; a18FohlenTag(); return { ok: f.fg.ni.ok, lebt: !!spiel.boxen[10].fohlen, bek: spiel.boxen[10].pferd.niBekannt, rech: (spiel.post || []).some(x => /Bluttransfusion/.test(x.text || '')) }; });
  ok('Klick „Klinik: Bluttransfusion“: Fohlen überlebt, Rechnung; Stute gilt als NI-bekannt', k && r.ok && r.lebt && r.bek && r.rech, JSON.stringify(r));
  r = await pg.evaluate(() => { const M = spiel.boxen[10].pferd; delete spiel.boxen[10].fohlen; M.traechtig = { vater: hengstKopie(neuesPferd({ rasse: 'vollblut', geschlecht: 'Hengst', alter: 9, name: 'Papa2' })), seit: jzJetzt() - 3, geburt: jzJetzt() + 1 }; a18Jahreszeit(); return !!briefMit(/Bluttest vor dem Abfohlen/); });
  ok('Letzte Jahreszeit vor dem Abfohlen: Tierarzt bietet den NI-Bluttest an', r, String(r));
  k = await briefKnopf('Bluttest vor dem Abfohlen', 'niTest');
  const k2 = await briefKnopf('Ergebnis NI-Bluttest', 'niSchutz');
  r = await pg.evaluate(() => { const M = spiel.boxen[10].pferd; const geb = M.traechtig.geburt; const sch = M.niSchutz === geb; spiel.tag += tpj(); while (jzJetzt() < geb) spiel.tag++; const R = Math.random; Math.random = () => 0.3; const f = geburt(spiel.boxen[10], M.traechtig.vater); Math.random = R; a18FohlenTag();
    return { sch, ni: !!(f.fg && f.fg.ni), kol: !!briefMit(/Fremd-Kolostrum/) }; });
  ok('Klick „Bluttest“ (positiv) → Klick „Fremd-Kolostrum“: Fohlen bekommt keine NI', k && k2 && r.sch && !r.ni && r.kol, JSON.stringify(r));
  r = await pg.evaluate(() => { const f = spiel.boxen[10].fohlen; f.fg = { nabel: { gross: false, tag: spiel.tag }, stelz: { schwer: false, tag: spiel.tag }, df: { tag: spiel.tag } }; spiel.a18df = 0; a18FohlenTag();
    return { n: !!briefMit(/Beule am Nabel/), s: !!briefMit(/steht schlecht auf/), d: !!briefMit(/hat Durchfall/), liegt: fohlenLiegeTage(f) > fohlenLiegeTage({ werte: f.werte }) }; });
  ok('Nabelbruch, Stelzfuß und Durchfall melden sich per Brief; Stelzfuß verlängert das Liegen', r.n && r.s && r.d && r.liegt, JSON.stringify(r));
  g0 = await pg.evaluate(() => spiel.geld);
  const k3 = await briefKnopf('Beule am Nabel', 'nabelBand'), k4 = await briefKnopf('steht schlecht auf', 'stelzSchiene'), k5 = await briefKnopf('hat Durchfall', 'dfTa');
  r = await pg.evaluate(g0 => { const f = spiel.boxen[10].fohlen; const kosten = g0 - spiel.geld; spiel.tag += 2 * tpj() + 1; a18FohlenTag(); return { kosten, band: f.fg.nabel === undefined, stelz: f.fg.stelz.ok, harmlos: !!briefMit(/Fohlenrosse-Durchfall/) }; }, g0);
  ok('Klicks Bandage (30 €), Schiene (60 €), Tierarzt: „harmloser Fohlenrosse-Durchfall“; Nabel zu, Beine gerade', k3 && k4 && k5 && r.kosten >= 90 && r.band && r.stelz && r.harmlos, JSON.stringify(r));
  await pg.evaluate(() => { const br = briefMit(/hat Durchfall/); if (br) briefFenster(br.id); });
  await bild('fohlen-brief-1366'); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });

  // 9) Alter Spielstand, Wissenskarten, Nächte ohne Fehler
  r = await pg.evaluate(() => { const P = neu(11, 'isi', { g: 'Hengst', alter: 5 }); delete P.hoden; P.vl = { ekzem: .5 }; P.vlReal = 1; delete P.erb; P.kryptPruefung = true; const v = veranlagungVon(P), e = erbVon(P);
    for (let n = 0; n < 6; n++) { spiel.tag++; befundeNacht(); befundTestTag(); a18Tag(); } erbJahreszeit();
    return { hufrolle: v.hufrolle != null, spat: v.spat != null, sat: e.sat != null, hoden: hodenVon(P).art, karten: ENZY.krank.eintraege.filter(x => /Inzucht|Hodenhochstand|Isoerythrolyse|Fohlenrosse|Island|Erblichkeit|Gentest und Träger/.test(x[0])).length }; });
  ok('Alter Spielstand: Hufrolle/Spat/SAT nachgetragen, Hoden „normal“, Nächte ohne Fehler; 7 Wissenskarten', r.hufrolle && r.spat && r.sat && r.hoden === 'normal' && r.karten >= 7, JSON.stringify(r));
  if (process.env.BILDER_ORDNER) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { akte(7); }); await pg.waitForTimeout(200); await bild('hoden-390');
    await pg.evaluate(() => { pferdAnsehen({ p: window._F, ort: 'Test' }); }); await bild('coi-schein-390'); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const br = briefMit(/Beule am Nabel/); if (br) briefFenster(br.id); }); await bild('fohlen-brief-390'); }
  ok('Keine Fehler in der Konsole', errs.length === 0, errs.join(' | '));
  console.log(L.join('\n')); const rot = L.filter(z => z.startsWith('✗')).length; console.log(rot ? `${rot} rot` : 'alles grün'); await b.close(); process.exit(rot ? 1 : 0);
})();
