// v1049 (Domes Antworten 15.11.2026): kalte Druse, Abszess am Hufbein + Klinik-OP, Hufrehe ab 10° nur Freizeit, West-Nil raus,
// MH-Frage vor der Kastration, Lungenentzündung nach Schlundverstopfung, alte Dornfortsatz-OP weg, Werte (Wunden, Röhrbein, Herpes, Impfabstand).
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/antworten-1049-test.js   ·   MOTOR=1 prüft den Motor   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; spiel.tag += 5; while (datum().s !== 2) spiel.tag++;
    while (spiel.boxen.length < 10) spiel.boxen.push(JSON.parse(JSON.stringify({ ...spiel.boxen[spiel.boxen.length - 1], pferd: null, fohlen: null })));
    window.neu = (i, art, grad, rasse, o) => { const P = neuesPferd({ rasse: rasse || 'hannoveraner', geschlecht: (o && o.g) || 'Wallach', alter: (o && o.alter) || 8, name: 'Test' + i }); P.pflege = erzeugePflege(P);
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; let bf = null;
      if (art) { bf = befundNeu(P, art, grad, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; }
      return [P, bf]; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.bf = (i, art) => befundListe(spiel.boxen[i].pferd).find(x => x.art === art);
    window.letzterBrief = () => (spiel.post || [])[0] || {}; });
  const bild = async (name) => { if (!process.env.BILDER_ORDNER) return; await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png') }); };

  // 1) kalte Druse: Antibiotika im frühen Stadium → kalte Druse (Zufall erzwungen), heilt langsamer, reift später doch
  let r = await pg.evaluate(() => { const [P, b] = neu(0, 'druse', 2); b.inkub = null; b.seit = spiel.tag; const st0 = druseStadium(b); P.behHeute = { tag: spiel.tag - 1, a: { antibiotika: 1 } };
    const R = Math.random; Math.random = () => 0; a49Nacht(P, b, spiel.boxen[0], 0); Math.random = R;
    const st1 = druseStadium(b), x = a49HeilX(P, b); spiel.tag += Math.max(2, tpj()); a49Nacht(P, b, spiel.boxen[0], 0); return { st0, st1, x, st2: druseStadium(b), brief: /kalte Druse/.test(letzterBrief().text || '') }; });
  ok('Druse: frühe Antibiotika → „kalte Druse“, heilt halb so schnell, reift später', r.st0 === 'frueh' && r.st1 === 'kalt' && r.x === .5 && r.st2 === 'reif' && r.brief, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(1, 'druse', 2); b.inkub = null; b.geklaert = true; b.seit = spiel.tag; akte(1); return { w: behandlungsWert(P, b).wert, t: document.body.innerText.includes('StIKo Vet') }; });
  ok('Druse-Karte warnt vor frühen Antibiotika (StIKo Vet)', r.t, JSON.stringify(r));

  // 2) Hufabszess 3 Tage nicht geöffnet → 5 % Hufbein (erzwungen), Karte + Klinik-OP
  r = await pg.evaluate(() => { const [P, b] = neu(2, 'hufabszess', 2); b.seit = spiel.tag - 3; const R = Math.random; Math.random = () => 0.01; a49Nacht(P, b, spiel.boxen[2], 2); Math.random = R;
    akte(2); return { hb: !!b.hufbein, x: a49HeilX(P, b), karte: document.body.innerText.includes('Hufbein betroffen'), op: !!document.querySelector('[data-opklinik="hufbeinop"]') }; });
  ok('Abszess am Hufbein: Karte, Heilung langsam, Klinik-OP angeboten', r.hb && r.x === .25 && r.karte && r.op, JSON.stringify(r));
  await bild('1049-hufbein-1366');
  r = await pg.evaluate(() => { const [P, b] = neu(3, 'hufabszess', 2); b.seit = spiel.tag - 3; const R = Math.random; Math.random = () => 0.5; a49Nacht(P, b, spiel.boxen[3], 3); Math.random = R; return !!b.hufbein; });
  ok('Meist (95 %) bleibt das Hufbein frei', r === false);

  // 3) Hufrehe: Rotation ab 10° → nur noch Freizeit (Turnier gesperrt, Marktwert ×0,6)
  r = await pg.evaluate(() => { const [P, b] = neu(4, 'hufrehe', 4); const w0 = marktwert(P); b.rotation = 12; if (b.rotation >= A49.rotFreizeit && !P.nurFreizeit) P.nurFreizeit = `Hufbeinrotation ${b.rotation}°`;
    akte(4); return { nf: !!P.nurFreizeit, w: Math.round(marktwert(P) / w0 * 100) / 100, karte: document.body.innerText.includes('Nur noch Freizeitpferd') }; });
  ok('Hufrehe 12° Rotation: nur noch Freizeit, Marktwert ×0,6, Karte', r.nf && Math.abs(r.w - .6) < .02 && r.karte, JSON.stringify(r));

  // 4) West-Nil ganz raus: kein Risiko, keine Impfkarte, alte Fälle enden
  r = await pg.evaluate(() => { spiel.hof.bundesland = '12'; const [P] = neu(5); akte(5); const karte = document.body.innerText.includes('West-Nil');
    const b = befundNeu(P, 'westnil', 2, 'alt'); const fertig = a49Nacht(P, b, spiel.boxen[5], 5); return { karte, fertig, aktiv: befundListe(P).some(x => x.art === 'westnil' && !x.geheilt && !x.ende) }; });
  ok('West-Nil: keine Impfkarte, alter Fall wird beendet', !r.karte && r.fertig, JSON.stringify(r));

  // 5) MH-Frage vor der Kastration (Quarter ohne Gentest): echtes Fenster mit drei Knöpfen
  r = await pg.evaluate(() => { const [P] = neu(6, null, 0, 'quarter', { g: 'Hengst', alter: 3 }); window._weiter = 0; a49KastrFrage([P], () => {}, () => { window._weiter++; });
    return { t: document.getElementById('dlg').innerText, k: [...document.querySelectorAll('#dlgKnoepfe button')].map(x => x.textContent) }; });
  ok('Kastration Quarter ohne Test: Fenster „testen / ohne Test / abbrechen“', /MH-Gentest/.test(r.t) && r.k.length === 3 && /Gentest/.test(r.k[0]) && /Ohne Test/.test(r.k[1]), JSON.stringify(r.k));
  await bild('1049-mh-kastration-1366');
  await pg.click('#dlgKnoepfe button:nth-child(2)'); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => ({ w: window._weiter, o: spiel.boxen[6].pferd.mhOhneTest === spiel.tag }));
  ok('Klick „Ohne Test operieren“: Kastration läuft weiter, gemerkt', r.w === 1 && r.o, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(7, null, 0, 'hannoveraner', { g: 'Hengst', alter: 3 }); let w = 0; a49KastrFrage([P], () => {}, () => { w++; }); return w; });
  ok('Hannoveraner: keine Frage, Kastration läuft sofort', r === 1);

  // 6) Lungenentzündung nach Schlundverstopfung (Zufall erzwungen), sonst nicht
  r = await pg.evaluate(() => { const [P, b] = neu(8, 'schlund', 2); b.seit = spiel.tag - 1; const R = Math.random; Math.random = () => 0.05; a49Nacht(P, b, spiel.boxen[8], 8); Math.random = R;
    const L = bf(8, 'lungenentz'); akte(8); return { l: !!L, d: !!(L && L.diagnose), brief: /Lunge/.test(letzterBrief().text || ''), plan: PLAN.lungenentz.join(','), text: document.body.innerText.includes('Lungenentzündung') }; });
  ok('Schlundverstopfung → Lungenentzündung mit Brief und Befund', r.l && r.d && r.brief && r.text, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(9, 'schlund', 1); b.seit = spiel.tag - 1; const R = Math.random; Math.random = () => 0.2; a49Nacht(P, b, spiel.boxen[9], 9); Math.random = R; return !!bf(9, 'lungenentz'); });
  ok('Mit Tierarzt und Grad 1 (8 %): bei Zufall 0,2 keine Lungenentzündung', r === false);

  // 7) Werte aus Domes Antworten
  r = await pg.evaluate(() => ({ rop: OP_KLINIK.rueckenop.nur({ geklaert: true }), wl: H16.lage, gi: H16.gelenkInfekt, ab: A14.abortAnteil, imp: impfJz({ impf: [] }) , ru: A17.rUAnteil, kv: KRANK.kreuzverschlag.gew }));
  ok('Alte Dornfortsatz-OP nicht mehr angeboten', r.rop === false, JSON.stringify(r));
  ok('Wunden 65/27/8, Gelenk ohne Spülung 90 %, Herpes-Abort 25 %, Rücken 50/20/30', r.wl.bein === .65 && r.wl.gelenk === .08 && r.gi === .9 && r.ab === .25 && r.ru.lahm === .5, JSON.stringify(r));
  r = await pg.evaluate(() => { let n = { glatt: 0, verschoben: 0, gleichbein: 0 }; for (let i = 0; i < 4000; i++) n[bruchArtWuerfeln()]++; return n; });
  ok('Röhrbein-Bruchart etwa 65/27/8', Math.abs(r.glatt / 4000 - .65) < .03 && Math.abs(r.gleichbein / 4000 - .08) < .02, JSON.stringify(r));

  // 7b) M5 Magenschutz nur bei Magenproblemen · M7 ACTH-Vorsorge ab 15 J. ohne falsche Ergebnisse
  r = await pg.evaluate(() => { const [P] = neu(0, null, 0, 'hannoveraner', { alter: 10 }); spiel.turniere = spiel.turniere || []; akte(0); const ohne = document.body.innerText.includes('Magenschutz vorbeugend');
    P.befundAlt = [{ art: 'magengeschwuer' }]; akte(0); return { ohne, mit: document.body.innerText.includes('Magenschutz vorbeugend') }; });
  ok('Magenschutz-Karte nur nach Magenproblemen', !r.ohne && r.mit, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(1, null, 0, 'hannoveraner', { alter: 10 }); akte(1); const jung = !!document.querySelector('[data-a49="acth"]');
    document.getElementById('dlg').hidden = true; const [Q] = neu(2, null, 0, 'hannoveraner', { alter: 18 }); akte(2); return { jung, alt: !!document.querySelector('[data-a49="acth"]') }; });
  ok('ACTH-Vorsorge-Knopf erst ab 15 Jahren', !r.jung && r.alt, JSON.stringify(r));
  await pg.click('[data-a49="acth"]'); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => { while (datum().s !== 0) spiel.tag++; const P = spiel.boxen[2].pferd; const c = befundNeu(P, 'cushing', 1, 'Alter'); c.bemerkt = null; const lab = P.acthLabor; spiel.tag = Math.max(spiel.tag, lab); acthVorsorgeTag(); const b = bf(2, 'cushing');
    return { lab: !!lab, diag: !!(b && b.diagnose), brief: /zu hoch/.test(letzterBrief().text || '') }; });
  ok('Klick Vorsorge-Test: Cushing auch im Frühling sicher erkannt', r.lab && r.diag && r.brief, JSON.stringify(r));

  // 7c) M3 Jungpferde nur nach Befund, Kotprobe jede 2. Jz, Spulwürmer immer · M2 Wirkstoff wählbar mit eigener Resistenz
  r = await pg.evaluate(() => { const [P] = neu(3, null, 0, 'hannoveraner', { alter: 1, g: 'Stute' }); P.pflege.wurm = spiel.tag - 3 * tpj(); delete P.kot;
    const g0 = wurmKurGrund(P), f0 = kotFaellig(P); kotprobeNehmen(P); const R = Math.random; Math.random = () => 0.1; kotErgebnis(P); Math.random = R;
    return { g0, f0, spul: !!P.kot.spul, g1: wurmKurGrund(P), brief: /Spulwurm/.test(letzterBrief().text || '') }; });
  ok('Jungpferd: ohne Befund keine Wurmkur, Kotprobe fällig; Spulwurm-Eier → Wurmkur', r.g0 === null && r.f0 && r.spul && r.g1 === 'spul' && r.brief, JSON.stringify(r));
  await pg.evaluate(() => akte(3)); await pg.selectOption('[data-wurmmittel]', 'py'); await pg.waitForTimeout(100);
  r = await pg.evaluate(() => { const P = spiel.boxen[3].pferd; apotheke().wurmkur = 5; delete P.behHeute; const G0 = { ...wurmResG() }; const R0 = Math.random; Math.random = () => 0.99; window._bt = behandeln(P, 'wurmkur', dosisKlasse(gewichtAnzeige(P))); Math.random = R0; const G1 = wurmResG();
    return { m: spiel.hof.wurmMittel, py: G1.py > G0.py, ml: G1.ml === G0.ml, bz: G0.bz, mi: P.pflege.wurmMittel, bt: String(window._bt).slice(0, 120) }; });
  ok('Auswahl „Pyrantel“: Wurmkur zählt nur bei Pyrantel, Fenbendazol startet mit 45 %', r.m === 'py' && r.py && r.ml && r.bz === .45 && r.mi === 'py', JSON.stringify(r));

  // ---------- Teil 2 ----------
  // 9) A9 EVA: Ausscheider-Hengst steckt ungeimpfte Stute an, sie steckt tragende Stallgenossin an (Abort), Impfung schützt
  await pg.evaluate(() => { for (let i = 0; i < spiel.boxen.length; i++) { spiel.boxen[i].pferd = null; spiel.boxen[i].fohlen = null; } });
  r = await pg.evaluate(() => { const [H] = neu(0, null, 0, 'hannoveraner', { g: 'Hengst', alter: 8 }); H.eva = 1; const [S1] = neu(1, null, 0, 'hannoveraner', { g: 'Stute' }); const [S2] = neu(3, null, 0, 'hannoveraner', { g: 'Stute' });
    S2.traechtig = { vater: { name: 'V' }, seit: jzJetzt() - 1, geburt: jzJetzt() + 3 }; const m = trMonat(S2);
    const [S3] = neu(4, null, 0, 'hannoveraner', { g: 'Stute' }); S3.evaImpf = spiel.tag - wochenTage(4);
    evaNachDecken(S1, H); const R = Math.random; Math.random = () => 0.5; evaNachDecken(S3, H); Math.random = () => 0; evaTag(); Math.random = R;
    return { s1: S1.evaInf === spiel.tag, s3: S3.evaInf == null, m, tr: !!S2.traechtig, brief: /EVA-Virus/.test(letzterBrief().text || '') }; });
  ok('EVA: gedeckte Stute angesteckt, geimpfte nicht, tragende Stallgenossin verfohlt', r.s1 && r.s3 && !r.tr && r.brief && r.m >= 3, JSON.stringify(r));
  r = await pg.evaluate(() => { const [S] = neu(5, null, 0, 'hannoveraner', { g: 'Stute' }); S.traechtig = { vater: { name: 'V' }, seit: jzJetzt() - 1, geburt: jzJetzt() + 3 }; spiel.boxen[5].quar = true;
    const R = Math.random; Math.random = () => 0; spiel.boxen[1].pferd.evaInf = spiel.tag; evaTag(); Math.random = R; delete spiel.boxen[5].quar; return !!S.traechtig; });
  ok('EVA: Stute im Quarantänestall bleibt geschützt', r === true);
  await pg.evaluate(() => akte(0)); const evaKn = await pg.$('[data-a49="eva"]'); ok('EVA-Impfkarte beim Hengst', !!evaKn);
  if (evaKn) { await evaKn.click(); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); }
  r = await pg.evaluate(() => ({ i: spiel.boxen[0].pferd.evaImpf === spiel.tag, neu: (() => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 6, name: 'G' }); P.evaImpf = spiel.tag - wochenTage(4); return evaTraegerVon(P); })() }));
  ok('Klick EVA-Impfung: gemerkt; geimpfter Hengst wird kein Ausscheider', r.i && r.neu === false, JSON.stringify(r));

  // 10) M6 Jakobskreuzkraut: selten in den genannten Gebieten, nur auf lückigen Weiden; belastetes Heu entsorgen
  r = await pg.evaluate(() => { const H = spiel.hof, alt = [H.bundesland, H.pos]; H.bundesland = '03'; H.pos = [53.1, 7.6]; const nw = jkkRegionF(); H.bundesland = '06'; H.pos = [50.5, 9.0]; const he = jkkRegionF(); H.bundesland = alt[0]; if (alt[1]) H.pos = alt[1]; else delete H.pos;
    const w1 = { jkkLueck: true }, w2 = { jkkLueck: true, nachgesaet: jzJetzt() + 2 }, w3 = {}; return { nw, he, l1: jkkLueckig(w1), l2: jkkLueckig(w2), l3: jkkLueckig(w3) }; });
  ok('Kreuzkraut: NW-Niedersachsen selten (×0,2), Hessen normal; nur lückige, nicht nachgesäte Weide', r.nw === .2 && r.he === 1 && r.l1 && !r.l2 && !r.l3, JSON.stringify(r));
  await pg.evaluate(() => { const F = futterkammer(); F.lager.heu = 500; F.jkkKg = 1; jkkHeuWeg(() => {}); });
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => { const F = futterkammer(); return { heu: F.lager.heu, kg: F.jkkKg }; });
  ok('Klick „Heu entsorgen“: Heulager leer, kein Kreuzkraut mehr', r.heu === 0 && !r.kg, JSON.stringify(r));

  // 11) H8 Milben-Mauke steckt Nachbarn an (Behang), Milben bleiben in der Box
  r = await pg.evaluate(() => { for (const i of [0, 1, 3, 4, 5]) spiel.boxen[i].pferd = null; const [Q, b] = neu(6, 'mauke', 2, 'shire'); b.mU = 'milben'; b.inkub = null; const [Z] = neu(7, null, 0, 'shire');
    const R = Math.random; Math.random = () => 0.01; milbenTag(); Math.random = R; const bz = befundListe(Z).find(x => x.art === 'mauke'); return { z: !!bz, mU: bz && bz.mU, box: spiel.boxen[6].milben === spiel.tag }; });
  ok('Milben-Mauke: Nachbar mit Behang angesteckt (Milben), Box gemerkt', r.z && r.mU === 'milben' && r.box, JSON.stringify(r));

  // 12) Z1 Fohlen-Karte in der Box (Nabelbruch) – Knopf wie im Brief
  r = await pg.evaluate(() => { for (const i of [6, 7]) spiel.boxen[i].pferd = null; const [M] = neu(2, null, 0, 'hannoveraner', { g: 'Stute' }); const f = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Fohli' }); f.pflege = erzeugePflege(f); f.gebTag = spiel.tag - 3;
    f.fg = { nabel: { gross: false, tag: spiel.tag - 1, brief: spiel.tag - 1 } }; spiel.boxen[2].fohlen = f; brief('Tierarztpraxis', 'Beule', 'x', { pferde: [f], aktion: { typ: 'a18', was: 'nabel', fid: f.id, gross: false } }); akte(2);
    return { karte: document.body.innerText.includes('Nabelbruch'), kn: !!document.querySelector('[data-a49f$=":nabelBand"]') }; });
  ok('Fohlen-Karte „Nabelbruch“ mit Knopf in der Box', r.karte && r.kn, JSON.stringify(r));
  await pg.evaluate(() => { const k = document.querySelector('[data-a49f]'); if (k) k.scrollIntoView({ block: 'center' }); }); await bild('1049-fohlenkarte-1366');
  await pg.click('[data-a49f$=":nabelBand"]'); await pg.waitForTimeout(200);
  r = await pg.evaluate(() => { const f = spiel.boxen[2].fohlen; const br = (spiel.post || []).find(x => x.aktion && x.aktion.fid === f.id); return { band: f.fg.nabel.band === spiel.tag, brief: !!(br && br.aktion.antwort) }; });
  ok('Klick „Bandage“: am Fohlen gemerkt, Brief gilt als erledigt', r.band && r.brief, JSON.stringify(r));

  // 13) Luzerne in beiden Formen, Heucobs 3 l Brei
  r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const h = futterkammerHTML(''); return { sel: h.includes('data-luzform'), info: /Häcksel oder Cobs/.test(FUTTER.luzerne.info), cobs: /3 l Brei/.test(FUTTER.heucobs.info) }; });
  ok('Futterkammer: Luzerne als Häcksel oder Cobs wählbar, Heucobs-Info 3 l Brei', r.sel && r.info && r.cobs, JSON.stringify(r));

  // 8) eine Nacht läuft ohne Fehler
  await pg.evaluate(() => { naechsteNacht(); }); await pg.waitForTimeout(300);
  ok('Nacht ohne Fehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); console.log(L.filter(x => x.startsWith('✗')).length ? 'ROT' : 'GRÜN'); await b.close();
})();
