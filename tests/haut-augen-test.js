// v1046 (Auftrag 16): Haut und Augen – Untersuchung in Stufen (haut/auge), Fluoreszein und Kortison, Wunde (Lage, nähen, Gelenk, Tetanus-Simultanimpfung),
// Mauke-Ursachen, Hautpilz (Kultur, Desinfektion), Mondblindheit (Kammerwasser → Vitrektomie), Sarkoid-Behandlungen, DDB2, neue Krankheiten, Fliegenmaske.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/haut-augen-test.js   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder (1366×768 und 390×844)   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; spiel.tag += 5; while (datum().s !== 1) spiel.tag++;
    while (spiel.boxen.length < 12) spiel.boxen.push(JSON.parse(JSON.stringify({ ...spiel.boxen[spiel.boxen.length - 1], pferd: null, fohlen: null })));
    window.neu = (i, art, grad, rasse) => { const P = neuesPferd({ rasse: rasse || 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.werte.ist.vertrauen = 100;
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; let bf = null;
      if (art) { bf = befundNeu(P, art, grad, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; }
      return [P, bf]; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.bf = (i, art) => befundListe(spiel.boxen[i].pferd).find(x => x.art === art);
    window.letzterBrief = () => (spiel.post || [])[0] || {}; });
  const klick = async (sel) => { await pg.locator(sel).first().scrollIntoViewIfNeeded(); await pg.click(sel); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); };
  const da = sel => pg.evaluate(s => !!document.querySelector(s), sel);
  const bild = async (name) => { if (!process.env.BILDER_ORDNER) return; await pg.evaluate(() => { const k = document.querySelector('[data-h16], [data-opklinik], [data-bftest]'); if (k) k.scrollIntoView({ block: 'center' }); }); await pg.waitForTimeout(100); await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png'), fullPage: false }); };

  // 1) Hornhautgeschwür: Augenuntersuchung mit Fluoreszein klärt es, Kortison schadet
  let r = await pg.evaluate(() => { const [P, b] = neu(0, 'hornhaut', 2); akte(0); return { id: b.id, gruppe: untGruppe(b), name: befundSicht(P, b).name }; });
  ok('Hornhaut: Gruppe „auge“, vorher nur Anzeichen', r.gruppe === 'auge' && /tränt/.test(r.name), JSON.stringify(r));
  await bild('auge-vorher-1366');
  await klick(`[data-bftest="${r.id}"]`);
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, b = bf(0, 'hornhaut'); return { klar: b.geklaert, fluo: b.fluo != null, name: befundSicht(P, b).name, brief: /Fluoreszein/.test(letzterBrief().text || ''), karte: /Kein Kortison/.test(document.body.innerText) }; });
  ok('Klick „Augenuntersuchung“: Fluoreszein findet das Geschwür, Brief und Warnkarte', r.klar && r.fluo && r.name === 'Hornhautgeschwür' && r.brief && r.karte, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, b = bf(0, 'hornhaut'); P.behHeute = { tag: spiel.tag - 1, a: { kortison: 1 } }; const mit = behandlungsWert(P, b); P.behHeute = { tag: spiel.tag - 1, a: { antibiotika: 1, atropin: 1 } }; const gut = behandlungsWert(P, b); return { schad: mit.schaden, gut: gut.wert }; });
  ok('Kortison ins Auge schadet beim Hornhautgeschwür, Antibiotikum + Atropin helfen', r.schad > 0 && r.gut > 0.4, JSON.stringify(r));
  await bild('auge-hornhaut-1366');

  // 2) Mondblindheit: Spaltlampe klärt, Kammerwasserprobe entscheidet über die Vitrektomie
  r = await pg.evaluate(() => { const [P, b] = neu(1, 'mondblind', 2); b.form = 'lepto'; akte(1); return b.id; });
  await klick(`[data-bftest="${r}"]`); await klick(`[data-bftest="${r}"]`);
  r = await pg.evaluate(() => { const b = bf(1, 'mondblind'); return { klar: b.geklaert, stufe: b.uStufe, vit: !!document.querySelector('[data-opklinik="vitrektomie"]'), kammerKnopf: !!document.querySelector('[data-h16^="kammer"]') }; });
  ok('Mondblindheit: Grunduntersuchung + Spaltlampe klären, Vitrektomie erst nach Kammerwasser', r.klar && r.stufe === 2 && !r.vit && r.kammerKnopf, JSON.stringify(r));
  await klick('[data-h16^="kammer"]');
  r = await pg.evaluate(() => { const b = bf(1, 'mondblind'); return { kammer: b.kammer, vit: !!document.querySelector('[data-opklinik="vitrektomie"]'), lepto: OP_KLINIK.vitrektomie.erfolgVon(spiel.boxen[1].pferd) }; });
  ok('Klick „Kammerwasserprobe“: Leptospiren → Vitrektomie angeboten (Erfolg 96 %)', r.kammer === true && r.vit && r.lepto === 0.96, JSON.stringify(r));

  // 3) Hautpilz: Pilzkultur mit Wartezeit, Stall desinfizieren
  r = await pg.evaluate(() => { const [P, b] = neu(2, 'hautpilz', 2); delete b.inkub; akte(2); return b.id; });
  await klick(`[data-bftest="${r}"]`); await klick(`[data-bftest="${r}"]`);
  r = await pg.evaluate(() => { const b = bf(2, 'hautpilz'); const vor = b.geklaert; spiel.tag += 2; befundTestTag(); akte(2); return { vor, klar: b.geklaert, kultur: /Kultur/.test(letzterBrief().text || ''), knopf: !!document.querySelector('[data-h16="desinf"]'), immun: IMMUNITAET.hautpilz.anteil }; });
  ok('Hautpilz: Kultur braucht Zeit, danach geklärt; Karte „Stall desinfizieren“; kaum Immunität', !r.vor && r.klar && r.kultur && r.knopf && r.immun === 0.3, JSON.stringify(r));
  const g0 = await pg.evaluate(() => spiel.geld);
  await klick('[data-h16="desinf"]');
  r = await pg.evaluate(g0 => ({ d: spiel.boxen[2].pferd.desinf === spiel.tag, geld: g0 - spiel.geld }), g0);
  ok('Klick „Stall desinfizieren“: erledigt, 25 € gebucht', r.d && Math.abs(r.geld - 25) < .01, JSON.stringify(r));

  // 4) Mauke mit Milben: Geschabsel findet die Ursache, ohne Milbenmittel hilft wenig
  r = await pg.evaluate(() => { const [P, b] = neu(3, 'mauke', 2, 'shire'); b.mU = 'milben'; akte(3); return { id: b.id, test: testAngebot(P, b).n }; });
  ok('Mauke: Hautuntersuchung als erster Schritt', /Hautuntersuchung/.test(r.test), JSON.stringify(r));
  await klick(`[data-bftest="${r.id}"]`);
  r = await pg.evaluate(() => { const P = spiel.boxen[3].pferd, b = bf(3, 'mauke'); return testAngebot(P, b).n; });
  ok('Mauke (Shire): nächster Schritt Hautgeschabsel auf Milben', /geschabsel/i.test(r), r);
  await klick(`[data-bftest="${(await pg.evaluate(() => bf(3, 'mauke').id))}"]`);
  r = await pg.evaluate(() => { const P = spiel.boxen[3].pferd, b = bf(3, 'mauke'); P.behHeute = { tag: spiel.tag - 1, a: { wundsalbe: 1 } }; const ohne = behandlungsWert(P, b).wert; P.behHeute = { tag: spiel.tag - 1, a: { wundsalbe: 1, milbenmittel: 1 } }; const mit = behandlungsWert(P, b).wert;
    return { u: b.ursache, ohne, mit, karte: /Ursache der Mauke/.test(document.body.innerText) }; });
  ok('Ursache Milben erkannt; Milbenmittel wirkt deutlich besser', /Milben/.test(r.u) && r.mit > r.ohne * 2 && r.karte, JSON.stringify(r));

  // 5) Wunde: Lage, nähen, Gelenk-Notfall, Tetanus-Simultanimpfung
  r = await pg.evaluate(() => { const [P, b] = neu(4, 'verletzung', 2); b.lage = 'bein'; P.pflege.tetanus = -999; P.pflege.impf = -999; befundListe(P).filter(x => x.art === 'tetanus').forEach(x => befundAbschliessen(P, x, 'x')); akte(4); return { naht: !!document.querySelector('[data-h16^="naht"]'), tet: !!document.querySelector('[data-h16="tet"]'), x: haut16HeilX(P, b) }; });
  ok('Beinwunde: Karte mit „Wunde nähen“ und Tetanus-Simultanimpfung, heilt langsamer', r.naht && r.tet && r.x === 0.6, JSON.stringify(r));
  await bild('wunde-1366');
  await klick('[data-h16^="naht"]'); await klick('[data-h16="tet"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd, b = bf(4, 'verletzung'); return { genaeht: b.genaeht === spiel.tag, x: haut16HeilX(P, b), tet: tetanusGeschuetzt(P) }; });
  ok('Klick „nähen“ und „Simultanimpfung“: genäht heilt schneller, Tetanus-Schutz da', r.genaeht && r.x > 1 && r.tet, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd, b = bf(4, 'verletzung'); b.seit = spiel.tag - 3; akte(4); return !document.querySelector('[data-h16^="naht"]'); });
  ok('Nach dem nächsten Morgen kein Nähen mehr', r);
  r = await pg.evaluate(() => { const [P, b] = neu(5, 'verletzung', 2); b.lage = 'gelenk'; akte(5); const gelenk = !!document.querySelector('[data-opklinik="gelenkspuelung"]'); b.seit = spiel.tag - 3; const R = Math.random; Math.random = () => 0.1; haut16Nacht(P, b, spiel.boxen[5], 5); Math.random = R;
    return { gelenk, infekt: !!b.infekt, arthrose: befundListe(P).some(x => x.art === 'arthrose') }; });
  ok('Wunde am Gelenk: Gelenkspülung angeboten, ohne Spülung Gelenkinfektion → Arthrose', r.gelenk && r.infekt && r.arthrose, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, b] = neu(6, 'verletzung', 3); b.lage = 'bein'; const R = Math.random; Math.random = () => 0.1; for (let n = 0; n < 3; n++) { spiel.tag++; haut16Nacht(P, b, spiel.boxen[6], 6); } Math.random = R; return !!b.wildfleisch; });
  ok('Beinwunde ohne Verband: Wildfleisch', r);

  // 6) Sarkoid: Behandlungen in der Klinik zur Wahl
  r = await pg.evaluate(() => { const [P, b] = neu(7, 'sarkoid', 2); b.geklaert = true; b.sattel = false; akte(7); return ['sarkSalbe', 'sarkKryo', 'sarkChemo', 'sarkOp'].filter(k => document.querySelector(`[data-opklinik="${k}"]`)).length; });
  ok('Sarkoid: vier Klinik-Behandlungen zur Wahl', r === 4, String(r));
  await bild('sarkoid-1366');

  // 7) DDB2 und Augenkrebs-Risiko
  r = await pg.evaluate(() => { const z = [0, 0, 0]; for (let i = 0; i < 600; i++) { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Wallach', alter: 14, name: 'H' + i }); z[erbVon(P).ddb2]++; }
    const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Wallach', alter: 14, name: 'X' }); erbVon(P).ddb2 = 0; const a = BEFUND_ZUSATZ.augenkrebs(P, null, 'box', 1, 14); P.erb.ddb2 = 2; const c = BEFUND_ZUSATZ.augenkrebs(P, null, 'box', 1, 14);
    return { z, a, c, test: erbTestKrankheiten(P).includes('ddb2') }; });
  ok('DDB2 beim Haflinger: etwa 37 % Träger, 6 % reinerbig; Gentest prüft es', r.z[1] > 150 && r.z[1] < 300 && r.z[2] > 15 && r.z[2] < 70 && r.test, JSON.stringify(r));
  ok('Reinerbig DDB2: Augenkrebs-Risiko deutlich höher', r.c > 4 * r.a || (r.a === 0 && r.c > 0), JSON.stringify(r));

  // 8) neue Krankheiten und Fliegenmaske
  r = await pg.evaluate(() => ['regenraeude', 'hornhaut', 'bindehaut', 'laeuse', 'warzen', 'nessel'].filter(k => KRANK[k] && HILFT[k] && PLAN[k] && URSACHE[k] && KRANK_INFO[k] && VERDACHT[k] && VERDACHT[k].lahm && TURNIER_GRENZE[k] != null).length);
  ok('Sechs neue Krankheiten vollständig eingetragen', r === 6, String(r));
  r = await pg.evaluate(() => ({ an: ['regenraeude', 'laeuse', 'warzen'].every(k => ANSTECKEND[k]), auge: ['hornhaut', 'bindehaut', 'mondblind', 'augenkrebs', 'mcoa'].every(k => KRANK[k].teil === 'auge') }));
  ok('Regenräude, Läuse, Warzen ansteckend; Augenkrankheiten im Teil „auge“', r.an && r.auge, JSON.stringify(r));
  await pg.evaluate(() => { neu(8, 'bindehaut', 1); akte(8); });
  const g1 = await pg.evaluate(() => spiel.geld);
  await klick('[data-h16="maske"]');
  r = await pg.evaluate(g1 => { const P = spiel.boxen[8].pferd; return { m: !!P.fliegenmaske, geld: g1 - spiel.geld, risiko: BEFUND_ZUSATZ.bindehaut(P, null, 'weide', 1) }; }, g1);
  ok('Klick „Fliegenmaske kaufen“: 35 €, senkt das Risiko für Bindehautentzündung', r.m && Math.abs(r.geld - 35) < .01 && r.risiko < 2 * 1.3, JSON.stringify(r));

  // 9) ein paar Nächte ohne Fehler, Bilder Handy
  await pg.evaluate(() => { for (let n = 0; n < 6; n++) { spiel.tag++; befundeNacht(); befundTestTag(); } akte(0); });
  if (process.env.BILDER_ORDNER) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { akte(4); }); await pg.waitForTimeout(200); await bild('wunde-390'); await pg.evaluate(() => { akte(1); }); await bild('mondblind-390'); }
  ok('Keine Fehler in der Konsole', errs.length === 0, errs.join(' | '));
  console.log(L.join('\n')); const rot = L.filter(z => z.startsWith('✗')).length; console.log(rot ? `${rot} rot` : 'alles grün'); await b.close(); process.exit(rot ? 1 : 0);
})();
