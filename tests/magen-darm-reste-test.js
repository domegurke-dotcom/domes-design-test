// v1044 (Auftrag 15, Reste): Kotprobe und selektive Entwurmung mit Resistenz, Omeprazol vorbeugend, Jakobskreuzkraut (Wiese prüfen, Heu, Leberschaden),
// Kotwasser, Zahnkontrolle statt pauschalem Raspeln (Haken/Wellen), Schlundverstopfung-Ursachen, ACTH-Test je Jahreszeit.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/magen-darm-reste-test.js   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder (1366×768 und 390×844)
// MOTOR=1 prüft stattdessen zuchtstall-app/motor/index.html
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; spiel.tag += 5; while (spiel.boxen.length < 12) spiel.boxen.push(JSON.parse(JSON.stringify({ ...spiel.boxen[spiel.boxen.length - 1], pferd: null, fohlen: null })));
    window.neu = (i, art, grad, alter) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: alter || 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.werte.ist.vertrauen = 100;
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; let bf = null;
      if (art) { bf = befundNeu(P, art, grad, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; bf.geklaert = true; }
      return [P, bf]; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.letzterBrief = () => (spiel.post || [])[0] || {}; });
  const klick = async (sel) => { await pg.locator(sel).first().scrollIntoViewIfNeeded(); await pg.click(sel); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); };
  const bild = async (name) => { if (!process.env.BILDER_ORDNER) return; await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png'), fullPage: false }); };

  // 1) Wurmkontrolle: Kotprobe statt pauschaler Wurmkur
  let r = await pg.evaluate(() => { const [P] = neu(0); P.pflege.wurm = spiel.tag - 2 * tpj(); P.wurmTyp = 0; delete P.kot; while (datum().s === 3) spiel.tag++; akte(0);
    return { grund: wurmKurGrund(P), kot: kotFaellig(P), knopfKot: !!document.querySelector('[data-m15="kot"]'), knopfWurm: !!document.querySelector('[data-vorsorge="wurmkur"]'), txt: /Wurmkontrolle/.test(document.body.innerText) }; });
  ok('Erwachsenes Pferd: nach 2 Jahreszeiten keine pauschale Wurmkur mehr, aber Kotprobe fällig', !r.grund && r.kot && r.knopfKot && !r.knopfWurm && r.txt, JSON.stringify(r));
  await bild('wurmkontrolle-1366');
  const geld0 = await pg.evaluate(() => spiel.geld);
  await klick('[data-m15="kot"]');
  r = await pg.evaluate(g0 => { const P = spiel.boxen[0].pferd; return { lauf: P.kot && P.kot.epg == null, geld: g0 - spiel.geld }; }, geld0);
  ok('Klick „Kotprobe“: Probe im Labor, 25 € gebucht', r.lauf && Math.abs(r.geld - 25) < 0.01, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; spiel.tag++; md15Tag(); akte(0); return { epg: P.kot.epg, brief: /Kotprobe/.test(letzterBrief().betreff || ''), grund: wurmKurGrund(P) }; });
  ok('Am nächsten Morgen: Ergebnis per Brief, wenig Eier → keine Wurmkur nötig', r.epg != null && r.epg <= 200 && r.brief && !r.grund, JSON.stringify(r));
  // hohe Eizahl → Wurmkur fällig, Erfolgskontrolle mit Resistenz
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; P.kot = { tag: spiel.tag, epg: 650 }; apotheke().wurmkur = 3; wurmResG().ml = 0.3; spiel.hof.wurmMittel = "ml"; akte(0);
    return { grund: wurmKurGrund(P), knopf: !!document.querySelector('[data-vorsorge="wurmkur"]') }; });
  ok('Über 200 Eier: Wurmkur fällig, Knopf da', r.grund === 'kot' && r.knopf, JSON.stringify(r));
  await pg.locator('[data-vorsorge="wurmkur"]').first().scrollIntoViewIfNeeded(); await pg.click('[data-vorsorge="wurmkur"]'); await pg.waitForTimeout(150);
  await pg.evaluate(() => { const P = spiel.boxen[0].pferd, k = dosisKlasse(gewichtAnzeige(P)); document.querySelector(`[data-wurmdosis="${k}"]`).click(); document.getElementById('dlg').hidden = true; });
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; return { wurm: P.pflege.wurm === spiel.tag, res: wurmRes(), grund: wurmKurGrund(P) }; });
  ok('Wurmkur gegeben: Termin erneuert, Resistenz steigt nur wenig (nötige Kur)', r.wurm && Math.abs(r.res - 0.31) < 0.001 && !r.grund, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; spiel.tag += 2; akte(0); return !!document.querySelector('[data-m15="kot"]'); });
  await klick('[data-m15="kot"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; const vor = P.kot.vor; spiel.tag++; md15Tag(); const B = letzterBrief(); return { vor, epg: P.kot.epg, red: /gesenkt/.test(B.text || ''), resi: /Resistenz/.test(B.text || ''), bek: !!spiel.hof.wurmResBekannt }; });
  ok('Zweite Kotprobe = Erfolgskontrolle: Reduktion unter 95 % meldet Resistenz', r.vor === 650 && r.red && r.resi && r.bek && r.epg > 650 * 0.05, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; const a = wurmRes(); P.kot = { tag: spiel.tag, epg: 30 }; behandeln(P, 'wurmkur', 1); return { plus: Math.round((wurmRes() - a) * 1000) / 1000 }; });
  ok('Unnötige und zu niedrig dosierte Wurmkur: Resistenz steigt deutlich (+0,08)', r.plus === 0.08, JSON.stringify(r));
  r = await pg.evaluate(() => { const [J] = neu(1, null, null, 2); J.pflege.wurm = spiel.tag - tpj(); const [A] = neu(2); A.pflege.wurm = spiel.tag - 4 * tpj(); delete A.kot;
    const [W, bw] = neu(3, 'wuermer', 2); wurmResG().ml = 0.5; spiel.hof.wurmMittel = "ml"; W.behHeute = { tag: spiel.tag - 1, a: { wurmkur: 1 } }; const mit = behandlungsWert(W, bw).wert; wurmResG().ml = 0; spiel.hof.wurmMittel = "ml"; const ohne = behandlungsWert(W, bw).wert;
    return { jung: wurmKurGrund(J), jahr: wurmKurGrund(A), kotJung: kotFaellig(J), mit, ohne }; });
  ok('Jungpferd: keine Wurmkur ohne Befund, Kotprobe jede zweite Jahreszeit (v1049, M3)', r.jung === null && r.kotJung, JSON.stringify(r));
  ok('Erwachsen: Sicherheits-Wurmkur einmal im Jahr', r.jahr === 'jahr', JSON.stringify(r));
  ok('Resistenz schwächt die Wurmkur beim Wurmbefall', r.mit < r.ohne, JSON.stringify(r));
  r = await pg.evaluate(() => { const box = spiel.boxen[2], P = box.pferd; P.kot = { tag: spiel.tag - 3 * tpj(), epg: 50 }; P.pflege.wurm = spiel.tag - tpj();
    return { kot: kotFaellig(P), risikoNeu: wurmRisiko(P) }; });
  ok('Kotprobe nach einer Jahreszeit wieder fällig (außer Winter)', r.kot, JSON.stringify(r));

  // 2) Zahnkontrolle statt Raspeln
  r = await pg.evaluate(() => { const [P] = neu(4); P.pflege.zahn = spiel.tag - Math.round(1.5 * tpj()); delete P.zahnRest; const vorher = zahnHaken(P); const Z = zahnKontrolle(P); document.getElementById('dlg').hidden = true;
    return { vorher, posten: Z.posten.length, zahn: P.pflege.zahn === spiel.tag }; });
  ok('Zahnkontrolle ohne Haken: nur Kontrolle (kein Raspeln)', r.vorher < 0.5 && r.posten === 1 && r.zahn, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd; P.pflege.zahn = spiel.tag - 9 * tpj(); spiel.tag += 0; const h = zahnHaken(P); const bf = befundNeu(P, 'zahnhaken', 2, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; bf.geklaert = true; akte(4);
    return { h, ueber: zahnUeber(P), karte: /Haken und Wellen/.test(document.body.innerText), knopf: document.querySelectorAll('[data-vorsorge="zahn"]').length, termin: /Zahnkontrolle/.test(document.body.innerText) }; });
  ok('Zähne lange nicht kontrolliert: Haken/Wellen, überfällig, Karte und Knopf', r.h > 1.6 && r.ueber && r.karte && r.knopf >= 1 && r.termin, JSON.stringify(r));
  await bild('zahnkontrolle-1366');
  await klick('[data-vorsorge="zahn"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd, B = (spiel.post || []).find(x => /Zahnkontrolle/.test(x.betreff || '')); return { rest: P.zahnRest || 0, befund: befundListe(P).some(b => b.art === 'zahnhaken'), raspeln: B && /Raspeln/.test(JSON.stringify(B)), folge: /Folgetermin|nur zum Teil/.test(JSON.stringify(B || {})), bald: zahnRestTage(P) < 4 * tpj() }; });
  ok('Klick Zahnkontrolle: geraspelt, Befund geheilt, starke Wellen → Folgetermin früher', !r.befund && r.raspeln && r.rest > 0 && r.folge && r.bald, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(5); P.vl = { ...veranlagungVon(P), biss: 0.05 }; P.pflege.zahn = spiel.tag - Math.round(2.5 * tpj()); delete P.zahnRest; const n = zahnUeber(P);
    P.futterStatus = { tag: spiel.tag, rauWenig: true }; const r2 = zahnRestTage(P); P.futterStatus = { tag: spiel.tag }; const r1 = zahnRestTage(P); return { n, schneller: r2 < r1 }; });
  ok('Wenig Raufutter: Haken wachsen schneller', !r.n && r.schneller, JSON.stringify(r));

  // 3) Omeprazol vorbeugend vor dem Turnier
  r = await pg.evaluate(() => { const [P] = neu(6); P.befundAlt = [{ art: "magengeschwuer" }]; /* v1049 (M5): Karte nur nach Magenproblemen */ const vorher = magenVorFaktor(P); spiel.turniere = spiel.turniere || []; spiel.turniere.push({ id: 'tt', name: 'Testturnier', tag: spiel.tag + 2, nennung: [{ pid: P.id }] }); akte(6);
    return { vorher, knopf: !!document.querySelector('[data-m15="ome"]') }; });
  ok('Pferd mit früherem Magengeschwür ist genannt: Karte „Magenschutz vorbeugend“ mit Knopf', r.vorher === 1 && r.knopf, JSON.stringify(r));
  await bild('omeprazol-1366');
  await klick('[data-m15="ome"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[6].pferd; const f = magenVorFaktor(P); fahrtStress(P, 'turnier'); const g = magenVorFaktor(P); delete P.omeVor; const h = magenVorFaktor(P);
    spiel.turniere = spiel.turniere.filter(t => t.id !== 'tt'); return { f, g, h }; });
  ok('Omeprazol senkt das Magengeschwür-Risiko, Turnierfahrt erhöht es', r.f === 0.3 && Math.abs(r.g - 0.6) < 1e-9 && r.h === 2, JSON.stringify(r));

  // 4) Jakobskreuzkraut: Wiese prüfen, Heu vom Mähen, Leberschaden
  r = await pg.evaluate(() => { let w = weiden()[0]; if (!w) { spiel.weiden = spiel.weiden || []; w = { wid: 'wt', name: 'Testwiese', ha: 1, gras: 80, matsch: 0 }; spiel.weiden.push(w); }
    w.jkk = 1; delete w.jkkJz; while (datum().s === 3) spiel.tag++; zeigeHof(); const nb = document.getElementById('nebenSchirm'); nb.innerHTML = weidenHTML(w.wid); weidenBinden(nb, () => {}); return { wid: w.wid, knopf: !!nb.querySelector(`[data-wjkk="${w.wid}"]`) }; });
  ok('Weide/Futterwiese: Knopf „Auf Jakobskreuzkraut prüfen“', r.knopf, JSON.stringify(r));
  await pg.click(`[data-wjkk="${r.wid}"]`); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150);
  r = await pg.evaluate(wid => { const w = weideById(wid), t = document.getElementById('dlgInhalt').innerText; document.getElementById('dlg').hidden = true; return { jkk: w.jkk, gepr: w.jkkJz === jzJetzt(), gef: /ausgestochen/.test(t) }; }, r.wid);
  ok('Prüfen: Pflanzen gefunden und ausgestochen, Fläche fast sauber', r.jkk <= 0.1 && r.gepr && r.gef, JSON.stringify(r));
  r = await pg.evaluate(() => { const F = futterkammer(); F.lager.heu = 1000; delete F.jkkKg; jkkHeuRein(F, { jkk: 1 }, 1000); F.lager.heu = 2000; F.jkkHeuLetzt = 2000;
    const [P] = neu(7); P.jkkDosis = 0; let tage = 0; while (!befundListe(P).some(b => b.art === 'jkkleber') && tage < 30) { spiel.tag++; jkkTag(); tage++; }
    const b = befundListe(P).find(x => x.art === 'jkkleber'); return { tage, b: !!b, dosis: P.jkkDosis, anteil: F.jkkKg / 2000 * 100 }; });
  ok('Heu einer verkrauteten Futterwiese: schleichender Leberschaden nach einigen Tagen', r.b && r.tage >= 2, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[7].pferd, b = befundListe(P).find(x => x.art === 'jkkleber'); b.diagnose = spiel.tag; b.tierarzt = true; b.geklaert = true; akte(7);
    const warn = /frisst noch Kreuzkraut/.test(document.body.innerText); delete futterkammer().jkkKg; P.jkkTag = spiel.tag - 3; P.behHeute = { tag: spiel.tag - 1, a: {} }; const w = behandlungsWert(P, b).wert; return { warn, w }; });
  ok('Befund-Karte warnt, ohne Kreuzkraut erholt sich die Leber', r.warn && r.w > 0, JSON.stringify(r));

  // 5) Kotwasser
  r = await pg.evaluate(() => { const [P, bf] = neu(8, 'kotwasser', 1); P.futterStatus = { tag: spiel.tag, staub: true }; akte(8); const t = document.body.innerText;
    const s1 = behandlungsWert(P, bf); P.futterStatus = { tag: spiel.tag }; P.pflege.zahn = spiel.tag; P.behHeute = { tag: spiel.tag - 1, a: {} }; const s2 = behandlungsWert(P, bf);
    return { karte: /Kotwasser – Ursache suchen/.test(t) && /staubiges Heu/.test(t), risiko: BEFUND_ZUSATZ.kotwasser({ ...P, futterStatus: { tag: spiel.tag, staub: true, oelViel: true } }) > BEFUND_ZUSATZ.kotwasser(P), s1: s1.schaden, w2: s2.wert }; });
  ok('Kotwasser: Karte nennt die Ursache, mehr Ursachen = mehr Risiko, ohne Ursache heilt es', r.karte && r.risiko && r.s1 > 0 && r.w2 > 0, JSON.stringify(r));

  // 6) Schlundverstopfung: weitere Ursachen
  r = await pg.evaluate(() => { const P = spiel.boxen[8].pferd; P.futterStatus = { tag: spiel.tag }; const ohne = futterFaktor(P, 'schlund'); P.futterStatus = { tag: spiel.tag, moehren: 0.3 }; const mit = futterFaktor(P, 'schlund');
    const u = URSACHE.schlund(P); return { ohne, mit, u }; });
  ok('Schlund: ganze Möhren/Äpfel erhöhen das Risiko und stehen als Ursache', r.ohne > 0 && r.mit > r.ohne && /Möhren/.test(r.u), JSON.stringify(r));

  // 7) ACTH je Jahreszeit
  r = await pg.evaluate(() => { const [P] = neu(9, null, null, 20); const b = befundNeu(P, 'cushing', 2, 'Alter', 'du'); b.diagnose = spiel.tag; while (datum().s !== 0) spiel.tag++;
    const alt = Math.random; Math.random = () => 0.01; befundKlaeren(P, b); Math.random = alt; const neg = b.geklaert && !b.acthNeg;   /* v1049 (M7): keine falsch negativen Ergebnisse mehr */ b.geklaert = false;
    while (datum().s !== 2) spiel.tag++; befundKlaeren(P, b); const herbst = b.geklaert && /Herbst-Grenzwerten/.test(letzterBrief().text || ''); return { neg, herbst }; });
  ok('ACTH im Frühling sicher (v1049); im Herbst mit Herbst-Grenzwerten', r.neg && r.herbst, JSON.stringify(r));

  // 8) Mitarbeiter: Kotprobe statt Wurmkur im Frühjahr/Herbst; Kalender; alter Spielstand
  r = await pg.evaluate(() => { const P = spiel.boxen[2].pferd; delete P.kot; P.pflege.wurm = spiel.tag - 2 * tpj(); while (datum().s === 3) spiel.tag++;
    const m = { id: 'mt', name: 'Pia', typ: 'pfleger', ab: 0, aus: {} }; spiel.mitarbeiter = [...(spiel.mitarbeiter || []), m]; apotheke().wurmkur = 5;
    let a = false; try { a = aktive('pfleger').length > 0; } catch (e) { } wurmkurMitarbeiter(); const kot = !!(P.kot && P.kot.epg == null), kur = P.pflege.wurm === spiel.tag; spiel.mitarbeiter = spiel.mitarbeiter.filter(x => x !== m);
    const T = kalTermine(jzJetzt()).concat(kalTermine(jzJetzt() + 1), kalTermine(jzJetzt() + 2), kalTermine(jzJetzt() + 3), kalTermine(jzJetzt() + 4)); return { a, kot, kur, kal: T.some(t => /Zahnkontrolle/.test(t.text)) && T.some(t => /Wurmkur/.test(t.text)) }; });
  ok('Mitarbeiter schickt die Kotprobe ein statt pauschal zu entwurmen', !r.a || (r.kot && !r.kur), JSON.stringify(r)); console.log('Mitarbeiter aktiv: ' + r.a);
  ok('Kalender: Zahnkontrolle und Wurmkur', r.kal, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(10); delete P.kot; delete P.wurmTyp; delete P.zahnRest; delete spiel.hof.wurmRes; delete spiel.hof.wurmResG; akte(10); return { res: wurmRes(), h: zahnHaken(P) >= 0, txt: /Wurmkontrolle/.test(document.body.innerText) }; });
  ok('Alter Spielstand ohne neue Felder: Standardwerte, Versorgung zeigt alles', r.res === 0.1 && r.h && r.txt, JSON.stringify(r));

  // Bilder Handy hochkant
  if (process.env.BILDER_ORDNER) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => akte(4)); await pg.waitForTimeout(200); await bild('zahn-390'); await pg.evaluate(() => akte(0)); await pg.waitForTimeout(200); await bild('wurm-390'); }
  L.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' | ') : '✓ keine Seitenfehler');
  await b.close(); process.exit(L.some(l => l[0] === '✗') || errs.length ? 1 : 0);
})();
