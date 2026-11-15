// v1047 (Auftrag 17): Rücken, Muskeln, Nerven, Herz – Rückenuntersuchung in Stufen (Lahmheit + Sattel zuerst, Betäubung), Kissing-Spines-Behandlungen + Aufbauplan,
// Ataxie-Grad + Reitverbot, Wobbler (Risiko, OP), Kreuzverschlag nach Ruhetag, PSSM-Häufigkeit, HYPP-Auslöser, MH-Narkose + Gentest-Frage, Shivers + Hufschmied,
// Aorta, Vorhofflimmern/Herzgeräusch, West-Nil nach Bundesland + Meldung + Impfung, Headshaking + Nasennetz, Vitamin E, Botulismus über Heulage, alter Spielstand.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/ruecken-nerven-test.js   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder (1366×768 und 390×844)   ·   MOTOR=1 prüft den Motor
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
    window.neu = (i, art, grad, rasse, o) => { const P = neuesPferd({ rasse: rasse || 'hannoveraner', geschlecht: (o && o.g) || 'Wallach', alter: (o && o.alter) || 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.werte.ist.vertrauen = 100;
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; let bf = null;
      if (art) { bf = befundNeu(P, art, grad, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; }
      return [P, bf]; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.bf = (i, art) => befundListe(spiel.boxen[i].pferd).find(x => x.art === art);
    window.letzterBrief = () => (spiel.post || [])[0] || {}; });
  const klick = async (sel) => { await pg.locator(sel).first().scrollIntoViewIfNeeded(); await pg.click(sel); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); };
  const testKlick = async (i, art) => klick(`[data-bftest="${await pg.evaluate(([i, a]) => bf(i, a).id, [i, art])}"]`);
  const bild = async (name, sel) => { if (!process.env.BILDER_ORDNER) return; await pg.evaluate(s => { const k = document.querySelector(s || '[data-a17], [data-opklinik], [data-bftest]'); if (k) k.scrollIntoView({ block: 'center' }); }, sel); await pg.waitForTimeout(100); await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png'), fullPage: false }); };

  // 1) Rückenschmerzen: erster Schritt nach dem Abtasten ist immer Lahmheit + Sattel; Sattel passt nicht → Sattler
  let r = await pg.evaluate(() => { const [P, b] = neu(0, 'rueckenschmerz', 2); b.rU = 'sattel'; akte(0); return { g: untGruppe(b), name: befundSicht(P, b).name, t: testAngebot(P, b).n }; });
  ok('Rückenschmerz: Gruppe „ruecken“, erst nur Anzeichen, Schritt 1 Abtasten', r.g === 'ruecken' && r.name === 'Rückenschmerzen' && /abtasten/i.test(r.t), JSON.stringify(r));
  await testKlick(0, 'rueckenschmerz');
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, b = bf(0, 'rueckenschmerz'); return testAngebot(P, b).n; });
  ok('Nächster Schritt: Lahmheitsuntersuchung und Sattel prüfen', /Lahmheit.*Sattel/.test(r), r);
  await bild('ruecken-stufen-1366');
  await testKlick(0, 'rueckenschmerz');
  r = await pg.evaluate(() => { const b = bf(0, 'rueckenschmerz'); return { klar: b.geklaert, u: b.ursache, knopf: !!document.querySelector('[data-a17="sattel"]'), brief: /Sattel/.test(letzterBrief().text || '') }; });
  ok('Geklärt: schlecht passender Sattel, Karte „Sattel anpassen“', r.klar && /Sattel/.test(r.u) && r.knopf && r.brief, JSON.stringify(r));
  let g0 = await pg.evaluate(() => spiel.geld);
  await klick('[data-a17="sattel"]');
  r = await pg.evaluate(g0 => { const P = spiel.boxen[0].pferd, b = bf(0, 'rueckenschmerz'); P.behHeute = { tag: spiel.tag - 1, a: {} }; return { s: P.sattelAngepasst === spiel.tag, geld: g0 - spiel.geld, w: behandlungsWert(P, b).wert }; }, g0);
  ok('Klick „Sattel anpassen“: 120 €, hilft der Heilung', r.s && Math.abs(r.geld - 120) < .01 && r.w > 0.15, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(13, 'rueckenschmerz', 2); b.rU = 'lahm'; b.uStufe = 1; lahmStufeErgebnis(P, b); return { lahm: befundListe(P).some(x => x.art === 'lahmheit' && x.diagnose) }; });
  ok('Lahmheit als eigentliche Ursache: Lahmheits-Befund kommt dazu', r.lahm, JSON.stringify(r));

  // 2) Kissing Spines: Röntgen zeigt, Betäubung beweist; Spritze und OP im Stehen mit 8 Wochen Aufbau
  r = await pg.evaluate(() => { const [P, b] = neu(1, 'kissing', 2); akte(1); return b.id; });
  for (let n = 0; n < 3; n++) await testKlick(1, 'kissing');
  r = await pg.evaluate(() => { const b = bf(1, 'kissing'); return { klar: b.geklaert, stufe: b.uStufe, f: (b.uFunde || []).join(' | ') }; });
  ok('Kissing: nach Abtasten, Lahmheit/Sattel und Röntgen noch nicht sicher', !r.klar && r.stufe === 3 && /Röntgen-Grad/.test(r.f), JSON.stringify(r));
  await testKlick(1, 'kissing');
  r = await pg.evaluate(() => ({ klar: bf(1, 'kissing').geklaert, op: !!document.querySelector('[data-opklinik="ksop"]'), spritze: !!document.querySelector('[data-a17^="spritze"]'), erst: /Röntgenbild und trotzdem keine Schmerzen/.test(letzterBrief().text || '') }));
  ok('Klick „Betäubung“: geklärt, OP im Stehen und Spritze angeboten, Tierarzt erklärt', r.klar && r.op && r.spritze && r.erst, JSON.stringify(r));
  await bild('kissing-1366', '[data-a17^="spritze"]');
  await pg.evaluate(() => { window._R = Math.random; Math.random = () => 0.6; });
  await klick('[data-a17^="spritze"]');
  await pg.evaluate(() => { Math.random = window._R; });
  r = await pg.evaluate(() => { const b = bf(1, 'kissing'); return { grad: b.grad, rueck: b.spritzeRueck != null }; });
  ok('Spritze (Zufall 0,6): besser, aber Rückfall geplant', r.grad === 1 && r.rueck, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[1].pferd, b = bf(1, 'kissing'); b.spritzeRueck = spiel.tag; a17Nacht(P, b, spiel.boxen[1], 1); return b.grad; });
  ok('Nach einigen Monaten kommen die Schmerzen zurück', r === 3, String(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[1].pferd, b = bf(1, 'kissing'); OP_KLINIK.ksop.nachher(P, true); const ph0 = ksPhase(b), rv = aufbauSchaden(b, 'reiten'), sv = aufbauSchaden(b, 'schritt'); akte(1); const karte = /Aufbauplan nach der Rücken-OP/.test(document.body.innerText);
    spiel.tag += wochenTage(4); const ph1 = ksPhase(b), lv = aufbauSchaden(b, 'longe'); spiel.tag += wochenTage(4) + 1; const fertig = a17Nacht(P, b, spiel.boxen[1], 1);
    return { ph0, rv, sv, karte, ph1, lv, fertig, weg: !bf(1, 'kissing'), stehend: !!OP_KLINIK.ksop.stehend }; });
  ok('OP im Stehen: 4 Wochen Schritt (Reiten verboten), dann Longe, nach 8 Wochen geheilt', r.ph0 === 0 && r.rv >= .4 && r.sv === 0 && r.karte && r.ph1 === 1 && r.lv === 0 && r.fertig && r.weg && r.stehend, JSON.stringify(r));

  // 3) Ataxie-Grad und Reitverbot; Wobbler-Risiko und OP
  r = await pg.evaluate(() => { const [P, b] = neu(2, 'wobbler', 3); b.geklaert = true; akte(2); const u3 = reitenUrteil(P, [b]).stufe; const t3 = a17TurnierSperre(P); b.grad = 2; const u2 = reitenUrteil(P, [b]).stufe; akte(2);
    return { u3, t3, u2, karte: /Ataxie-Grad 2 von 5/.test(document.body.innerText), op: !!document.querySelector('[data-opklinik="wobblerop"]') }; });
  ok('Ataxie-Grad 3: nicht reiten, kein Turnier; Grad 2: nur leichte Arbeit (Tierarzt rät ab)', r.u3 === 'nein' && /Ataxie-Grad 3/.test(r.t3) && r.u2 === 'leicht' && r.karte, JSON.stringify(r));
  ok('Wobbler geklärt: OP Wirbelversteifung angeboten', r.op, JSON.stringify(r));
  await bild('ataxie-1366');
  r = await pg.evaluate(() => { const H = neuesPferd({ rasse: 'vollblut', geschlecht: 'Hengst', alter: 1, name: 'J' }); H.futterStatus = { tag: spiel.tag, ratio: 1.3 }; const S = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 1, name: 'K' }); S.futterStatus = { tag: spiel.tag, ratio: 1 };
    return { h: BEFUND_ZUSATZ.wobbler(H, null, 'box', 1, 1), s: BEFUND_ZUSATZ.wobbler(S, null, 'box', 1, 1), alt: BEFUND_ZUSATZ.wobbler(S, null, 'box', 1, 6) }; });
  ok('Wobbler-Risiko: junger Vollbluthengst mit viel Futter ≫ Haflingerstute, ab 4 J. keins', r.h > 4 * r.s && r.alt === 0, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(3, 'wobbler', 3, 'hannoveraner', { alter: 1, g: 'Hengst' }); b.geklaert = true; const box = spiel.boxen[3]; P.klinik = { seit: spiel.tag, op: 'wobblerop', bis: spiel.tag + 6 };
    const R = Math.random; Math.random = () => 0.05; const tot = a17Narkose(P, box, 3); Math.random = R; return { tot, box: box.tot, ursache: P.todesursache }; });
  ok('Wobbler-OP hat ein kleines Todesrisiko (Zufall 0,05 → gestorben)', r.tot && r.box && /Wirbel/.test(r.ursache), JSON.stringify(r));

  // 4) Kreuzverschlag nach Ruhetagen, CK/AST-Bluttest, Weiterreiten schlimmer
  r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'KV' }); P.futterStatus = { tag: spiel.tag, ratio: 1 }; const ohne = BEFUND_ZUSATZ.kreuzverschlag(P, null, 'box', 1, 8);
    P.trainHeute = { tag: spiel.tag - 1, verbraucht: 45 }; P.ruheVor = 0; const normal = BEFUND_ZUSATZ.kreuzverschlag(P, null, 'box', 1, 8); P.ruheVor = 2; const ruhe = BEFUND_ZUSATZ.kreuzverschlag(P, null, 'box', 1, 8);
    return { ohne, normal, ruhe, reiten: SCHADET.kreuzverschlag.reiten, schritt: SCHADET.kreuzverschlag.schritt }; });
  ok('Kreuzverschlag: nur nach harter Arbeit, nach Ruhetagen mit vollem Futter 1,5× (v1049, N8: selten); Reiten/Führen schadet', r.ohne === 0 && r.ruhe === 1.5 * r.normal && r.reiten >= .5 && r.schritt > 0, JSON.stringify(r));
  await pg.evaluate(() => { neu(4, 'kreuzverschlag', 2); akte(4); });
  await testKlick(4, 'kreuzverschlag'); await testKlick(4, 'kreuzverschlag');
  r = await pg.evaluate(() => { const b = bf(4, 'kreuzverschlag'); return { klar: b.geklaert, f: (b.uFunde || []).join(' | '), karte: /Nicht weiterbewegen/.test(document.body.innerText) }; });
  ok('Klick „CK/AST-Bluttest“: geklärt, Karte „Nicht weiterbewegen!“', r.klar && /CK und AST stark/.test(r.f) && r.karte, JSON.stringify(r));

  // 5) PSSM1-Häufigkeit Haflinger/Noriker, reinerbig schwerer
  r = await pg.evaluate(() => { const z = { haflinger: 0, noriker: 0 }; for (const ra of ['haflinger', 'noriker']) for (let i = 0; i < 500; i++) { const P = neuesPferd({ rasse: ra, geschlecht: 'Stute', alter: 6, name: ra + i }); if (erbVon(P).pssm >= 1) z[ra]++; }
    const P = neuesPferd({ rasse: 'quarter', geschlecht: 'Stute', alter: 6, name: 'PS' }); P.befunde = []; erbVon(P).pssm = 2; const b = befundNeu(P, 'pssm', 1, 'Test'); return { z, grad: b.grad, schwer: !!b.schwer17 }; });
  ok('PSSM1: Haflinger etwa 20 %, Noriker etwa 40 % Träger', r.z.haflinger > 60 && r.z.haflinger < 150 && r.z.noriker > 150 && r.z.noriker < 260, JSON.stringify(r));
  ok('Reinerbig PSSM1: schwerer', r.grad === 2 && r.schwer, JSON.stringify(r));

  // 6) HYPP: Luzerne und Transport lösen aus, Acetazolamid beugt vor; H/H keine Papiere
  r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'quarter', geschlecht: 'Wallach', alter: 6, name: 'HY' }); P.pflege = erzeugePflege(P); P.befunde = []; erbVon(P).hypp = 1; const R = Math.random; Math.random = () => 0.1;
    P.futterStatus = { tag: spiel.tag, ratio: 1, luzerne: 0 }; a17PferdNacht(P, {}, 0); const ohne = befundListe(P).length;
    P.futterStatus.luzerne = 2; a17PferdNacht(P, {}, 0); const luz = befundListe(P).some(b => b.art === 'hypp' && /Luzerne/.test(b.ursache));
    P.befunde = []; P.futterStatus.luzerne = 0; P.fahrtTag = spiel.tag - 1; P.behHeute = { tag: spiel.tag - 1, a: { acetazolamid: 1 } }; a17PferdNacht(P, {}, 0); const med = befundListe(P).length;
    Math.random = R; const F = neuesPferd({ rasse: 'quarter', geschlecht: 'Stute', alter: 0, name: 'HH' }); erbVon(F).hypp = 2;
    return { ohne, luz, med, hh: hyppHH(F), turnier: (() => { const Q = neuesPferd({ rasse: 'quarter', geschlecht: 'Stute', alter: 6, name: 'Q' }); Q.befunde = []; Q.behHeute = { tag: spiel.tag, a: { acetazolamid: 1 } }; return a17TurnierSperre(Q); })() }; });
  ok('HYPP: ohne Auslöser kein Anfall, Luzerne löst aus, Acetazolamid schützt beim Transport', r.ohne === 0 && r.luz && r.med === 0, JSON.stringify(r));
  ok('HYPP H/H: keine Eintragung; Acetazolamid auf Turnieren verboten', r.hh && /Acetazolamid/.test(r.turnier), JSON.stringify(r));

  // 7) MH: OP-Fenster fragt nach dem Gentest; Narkose bei MH-Trägern gefährlich
  await pg.evaluate(() => { const [P, b] = neu(5, 'kehlkopf', 2, 'quarter'); b.geklaert = true; erbVon(P).mh = 1; akte(5); });
  await pg.locator('[data-opklinik="tieback"]').first().scrollIntoViewIfNeeded(); await pg.click('[data-opklinik="tieback"]'); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => ({ dlg: /MH-Gentest/.test(document.getElementById('dlg').innerText), knoepfe: [...document.querySelectorAll('#dlgKnoepfe button')].map(x => x.textContent).join('|') }));
  ok('Klick „Zur OP“ beim Quarter: Tierarzt fragt nach dem MH-Gentest', r.dlg && /Gentest/.test(r.knoepfe) && /Trotzdem/.test(r.knoepfe), JSON.stringify(r));
  await bild('mh-frage-1366', '#dlg');
  await pg.click('#dlgKnoepfe button:nth-child(2)'); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => { const P = spiel.boxen[5].pferd, box = spiel.boxen[5]; const inKl = !!P.klinik; const R = Math.random; Math.random = () => 0.1; const tot = a17Narkose(P, box, 5); Math.random = R; return { inKl, tot, u: P.todesursache }; });
  ok('„Trotzdem operieren“: in der Klinik – ungetesteter MH-Träger stirbt in der Narkose (Zufall 0,1)', r.inKl && r.tot && /MH/.test(r.u), JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(5, null, 0, 'quarter'); P.tests = { krank: true }; erbVon(P).mh = 1; P.klinik = { seit: spiel.tag, op: 'tieback', bis: spiel.tag + 4 }; const R = Math.random; Math.random = () => 0.1; const tot = a17Narkose(P, spiel.boxen[5], 5); Math.random = R; return tot; });
  ok('Getestet: die Klinik beugt vor – überlebt (Zufall 0,1)', r === false, String(r));

  // 8) Shivers: große, männliche Pferde öfter; Hufschmied braucht Beruhigungsspritze
  r = await pg.evaluate(() => { const [P, b] = neu(6, 'shivers', 2, 'shire'); P.stockmass = 178; const gross = BEFUND_MAL.shivers(P); P.stockmass = 150; P.geschlecht = 'Stute'; const klein = BEFUND_MAL.shivers(P); const R = hufschmiedArbeit(P, 'barhuf');
    return { gross, klein, spritze: R.posten.some(x => /Beruhigungsspritze/.test(x.text)) }; });
  ok('Shivers: 178 cm Wallach ≫ 150 cm Stute; Hufschmied mit Beruhigungsspritze', r.gross > 5 * r.klein && r.spritze, JSON.stringify(r));

  // 9) Herz: Vorhofflimmern (EKG, Kardioversion), Aorta (Reitverbot), Herzgeräusch
  await pg.evaluate(() => { neu(7, 'vhf', 2); akte(7); });
  await testKlick(7, 'vhf'); await testKlick(7, 'vhf');
  r = await pg.evaluate(() => ({ klar: bf(7, 'vhf').geklaert, op: !!document.querySelector('[data-opklinik="kardioversion"]'), ruhe: OP_KLINIK.kardioversion.ruheWochen }));
  ok('Vorhofflimmern: Abhören + Ruhe-EKG klären, Kardioversion mit 4 Wochen Pause', r.klar && r.op && r.ruhe === 4, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(8, 'aorta', 1, 'friese', { alter: 4 }); const vor = befundSicht(P, b).name; b.geklaert = true; return { vor, risiko: BEFUND_ZUSATZ.aorta(P, null, 'box', 1, 3) > 0, reiten: reitenUrteil(P, [b]).stufe, kolik: KRANK.aorta.anz.some(t => /Kolik/.test(t)) }; });
  ok('Aorta (Friese, 3 J.): Risiko schon jung, Anzeichen Kolik + Puls, nach Diagnose Reitverbot', /Kolik/.test(r.vor) && r.risiko && r.reiten === 'nein' && r.kolik, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(9, 'herzgeraeusch', 1); return { g: untGruppe(b), klar: untKlar(b), turnier: TURNIER_GRENZE.herzgeraeusch }; });
  ok('Herzgeräusch: Gruppe „herz“, Herzultraschall klärt, kein Turnierverbot', r.g === 'herz' && r.klar === 2 && r.turnier === 99, JSON.stringify(r));

  // 10) West-Nil: seit v1049 ganz raus (Dome N6) – geprüft in antworten-1049-test.js
  r = await pg.evaluate(() => { spiel.hof.bundesland = '12'; const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'WN' }); return BEFUND_ZUSATZ.westnil(P, null, 'weide', 1, 8); });
  ok('West-Nil kommt nicht mehr vor (v1049)', r === 0, String(r));

  // 11) Headshaking + Nasennetz, Vitamin E ohne Weide, Botulismus über Heulage
  await pg.evaluate(() => { neu(11, 'headshaking', 2); bf(11, 'headshaking').geklaert = true; akte(11); });
  g0 = await pg.evaluate(() => spiel.geld);
  await klick('[data-a17="nasennetz"]');
  r = await pg.evaluate(g0 => { const P = spiel.boxen[11].pferd, b = bf(11, 'headshaking'); P.behHeute = { tag: spiel.tag - 1, a: {} }; return { n: !!P.nasennetz, geld: g0 - spiel.geld, w: behandlungsWert(P, b).wert }; }, g0);
  ok('Klick „Nasennetz kaufen“: 30 €, hilft teilweise', r.n && Math.abs(r.geld - 30) < .01 && r.w > .15, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'VE' }); P.ohneGras = 0; const a = BEFUND_ZUSATZ.emnd(P); P.ohneGras = 8 * tpj(); const b = BEFUND_ZUSATZ.emnd(P); P.futterStatus = { tag: spiel.tag, vite: 0.05 }; const c = BEFUND_ZUSATZ.emnd(P);
    P.futterStatus = { tag: spiel.tag, weide: true }; P.ohneGras = 5; a17PferdNacht(P, {}, 0); return { a, b, c, zaehler: P.ohneGras, futter: !!FUTTER.vite && PLAN_SORTEN.includes('vite') }; });
  ok('Vitamin-E-Mangel nur nach langer Zeit ohne Weide, Vitamin E im Futter schützt, Weide setzt den Zähler zurück', r.a === 0 && r.b > 0 && r.c === 0 && r.zaehler === 2 && r.futter, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'BO' }); const F = futterkammer(); P.futterStatus = { tag: spiel.tag, heulage: 8 }; F.anbruch = { tag: spiel.tag, rest: 20 }; const frisch = BEFUND_ZUSATZ.botulismus(P);
    F.anbruch.tag = spiel.tag - 10; const alt = BEFUND_ZUSATZ.botulismus(P); P.futterStatus = { tag: spiel.tag }; const heu = BEFUND_ZUSATZ.botulismus(P); delete F.anbruch; return { frisch, alt, heu }; });
  ok('Botulismus: nur bei alter, angebrochener Heulage', r.frisch === 0 && r.alt === 1 && r.heu === 0, JSON.stringify(r));

  // 12) Vollständigkeit, alter Spielstand, ein paar Nächte, Enzyklopädie
  r = await pg.evaluate(() => ['rueckenschmerz', 'isg', 'wirbelarthrose', 'wobbler', 'kreuzverschlag', 'pssm2', 'vhf', 'herzgeraeusch', 'westnil', 'headshaking', 'emnd', 'botulismus'].filter(k => KRANK[k] && HILFT[k] && SCHADET[k] && PLAN[k] && URSACHE[k] && KRANK_INFO[k] && VERDACHT[k] && VERDACHT[k].lahm && TURNIER_GRENZE[k] != null && BEFUND_ZUSATZ[k]).length);
  ok('Zwölf neue Krankheiten vollständig eingetragen', r === 12, String(r));
  r = await pg.evaluate(() => { const [P] = neu(12, null, 0); ['ohneGras', 'ruheVor', 'wnv', 'sattelAngepasst', 'nasennetz'].forEach(k => delete P[k]); const b = befundNeu(P, 'kissing', 2, 'alt'); b.diagnose = spiel.tag; b.tierarzt = true; delete b.uStufe;
    for (let n = 0; n < 8; n++) { spiel.tag++; befundeNacht(); befundTestTag(); } akte(12); return { ok: true, karten: (ENZY.krank.eintraege || []).filter(e => /Ataxie|Kissing Spines|Wobbler|Kreuzverschlag/.test(e[0])).length }; });
  ok('Alter Spielstand ohne neue Felder: 8 Nächte ohne Fehler; Wissenskarten in der Enzyklopädie', r.ok && r.karten >= 3, JSON.stringify(r));
  if (process.env.BILDER_ORDNER) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { akte(2); }); await pg.waitForTimeout(200); await bild('ataxie-390'); await pg.evaluate(() => { akte(11); }); await bild('headshaking-390'); await pg.evaluate(() => { akte(0); }); await bild('ruecken-390'); }
  ok('Keine Fehler in der Konsole', errs.length === 0, errs.join(' | '));
  console.log(L.join('\n')); const rot = L.filter(z => z.startsWith('✗')).length; console.log(rot ? `${rot} rot` : 'alles grün'); await b.close(); process.exit(rot ? 1 : 0);
})();
