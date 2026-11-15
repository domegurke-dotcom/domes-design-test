// v1043 (Auftrag 14, Reste): Fohlen-Grundimmunisierung, Herpes-Formen und Herpes-Impfung der Zuchtstuten, Quarantäne nach dem letzten Fall mit Nasentupfer-Freigabe,
// Druse-Stadien mit „Abszess spalten“ und Träger-Test, Pferdeasthma in zwei Stufen mit Inhalieren, EVA beim Deckhengst, Nachtrag Bewegungs-Schäden (Atemwege).
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/atemwege-reste-test.js   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder (1366×768 und 390×844)
// MOTOR=1 prüft stattdessen zuchtstall-app/motor/index.html
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; spiel.tag += 5;
    window.neu = (i, art, grad, ges) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: ges || 'Wallach', alter: 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P);
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; let bf = null;
      if (art) { bf = befundNeu(P, art, grad, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; bf.geklaert = true; }
      return [P, bf]; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.gestern = (P, a) => { P.behHeute = { tag: spiel.tag - 1, a }; }; });
  const klick = async (sel) => { await pg.locator(sel).first().scrollIntoViewIfNeeded(); await pg.click(sel); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); };
  const bild = async (name) => { if (!process.env.BILDER_ORDNER) return; await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png'), fullPage: false }); };
  const text = () => pg.evaluate(() => document.body.innerText);

  // 1) Grundimmunisierung der Fohlen (3 Impfungen mit echten Klicks)
  let r = await pg.evaluate(() => { const [P] = neu(0); P.gi = 0; P.gebTag = spiel.tag - 2 * tpj(); akte(0);
    return { geb: geburt.toString().includes('gi: 0'), g: geimpft(P), s: impfSchutz(P), f: impfFaellig(P), t: /Grundimmunisierung \(Tierarzt\) 0\/3/.test(document.body.innerText) }; });
  ok('Neue Fohlen starten mit 0 Impfungen; mit 6 Monaten fällig, ohne Schutz', r.geb && !r.g && r.s === 0 && r.f && r.t, JSON.stringify(r));
  await pg.locator('[data-vorsorge="impfung"]').scrollIntoViewIfNeeded(); await bild('grundimmunisierung-1366');
  await klick('[data-vorsorge="impfung"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; zeigeAkte(); return { gi: P.gi, s: impfSchutz(P), g: geimpft(P), knopf: !!document.querySelector('[data-vorsorge="impfung"]'), turnier: !geimpft(P) }; });
  ok('1. Impfung: Teilschutz 30 %, noch nicht geimpft (keine Turniere), nächste erst nach 4 Wochen', r.gi === 1 && r.s === 0.3 && !r.g && !r.knopf && r.turnier, JSON.stringify(r));
  await pg.evaluate(() => { spiel.tag += Math.ceil(4 / 13 * tpj()); akte(0); }); await klick('[data-vorsorge="impfung"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; return { gi: P.gi, s: impfSchutz(P), rest: impfRest(P) }; });
  ok('2. Impfung nach 4 Wochen: Teilschutz 60 %, 3. nach 6 Monaten (v1049, StIKo Vet)', r.gi === 2 && r.s === 0.6 && r.rest === Math.ceil(6 / 3 * 7), JSON.stringify(r));
  await pg.evaluate(() => { spiel.tag += Math.ceil(6 / 3 * tpj()); akte(0); }); await klick('[data-vorsorge="impfung"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd; zeigeAkte(); return { gi: P.gi, g: geimpft(P), s: impfSchutz(P), t: /Impfung \(Tierarzt\)/.test(document.body.innerText) }; });
  ok('3. Impfung: vollständig geimpft, danach normaler Impftermin', r.gi === 3 && r.g && r.s === 1 && r.t, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(1); P.pflege.impf = spiel.tag; return { gi: giVon(P), g: geimpft(P) }; });
  ok('Alter Spielstand/gekauftes Pferd ohne Feld gilt als grundimmunisiert', r.gi === 3 && r.g, JSON.stringify(r));

  // 2) Herpes: drei Formen, Abort-Risiko, Herpes-Impfung der Zuchtstute (Klick) und Kalender
  r = await pg.evaluate(() => { const [P] = neu(2, null, 0, 'Stute'); P.traechtig = { vater: { name: 'V' }, seit: jzJetzt() - 3, geburt: jzJetzt() + 1 }; const ro = Math.random, out = { monat: trMonat(P) };
    const form = x => { Math.random = () => x; const bf = befundNeu(P, 'herpes', 2, 'Test'); Math.random = ro; P.befunde = []; return bf; };
    const a = form(0.5), ab = form(0.1), e = form(0.01);
    out.formen = [a.form, ab.form, e.form]; out.ehmGrad = e.grad; out.anzEhm = anzeichenText(e); out.anzAtem = anzeichenText(a);
    out.cAbort = herpesAbortChance(P, ab); out.cAtem = herpesAbortChance(P, a); P.traechtig.ehv = [5, 7]; out.cAbortGeimpft = herpesAbortChance(P, ab);
    const alt = befundNeu(P, 'herpes', 2, 'Test'); delete alt.form; out.altAnz = anzeichenText(alt); return out; });
  ok('Herpes-Formen: Atemwege / Abort (tragend, letztes Drittel) / EHM (Grad ≥ 3)', r.monat >= 7 && r.formen.join() === 'atem,abort,ehm' && r.ehmGrad >= 3, JSON.stringify(r));
  ok('EHM zeigt Lähmungs-Anzeichen, Atemwegsform nicht', /schwankt/.test(r.anzEhm) && !/schwankt/.test(r.anzAtem) && !!r.altAnz, JSON.stringify(r));
  ok('Abort-Form: hohes Verfohlrisiko, Impfung im 5./7. Monat senkt es', r.cAbort > r.cAtem * 5 && r.cAbortGeimpft < r.cAbort, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[2].pferd; P.befunde = []; P.traechtig = { vater: { name: 'V' }, seit: jzJetzt() - 2, geburt: jzJetzt() + 2 }; akte(2);
    return { m: ehvFaellig(P), knopf: !!document.querySelector('[data-a14="ehv:"]'), kal: [0, 1, 2].some(d => kalTermine(jzJetzt() + d).some(x => /Herpes-Impfung/.test(x.text))) }; });
  ok('Tragende Stute: Karte mit Impfplan, Knopf im fälligen Monat, Termin im Kalender', r.m > 0 && r.knopf && r.kal, JSON.stringify(r));
  await pg.locator('[data-a14="ehv:"]').scrollIntoViewIfNeeded(); await bild('herpes-impfung-1366');
  await klick('[data-a14="ehv:"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[2].pferd; return { ehv: P.traechtig.ehv, re: JSON.stringify(spiel).includes('Herpes-Impfung im'), weg: !ehvFaellig(P) }; });
  ok('Herpes-Impfung per Klick: eingetragen, Rechnung, nicht mehr fällig', (r.ehv || []).length === 1 && r.re && r.weg, JSON.stringify(r));

  // 3) Quarantäne nach dem letzten Fall + Nasentupfer zur Freigabe (Klick)
  r = await pg.evaluate(() => { spiel.boxen.forEach((x, i) => { if (i !== 3) { x.pferd = null; } }); const [P, bf] = neu(3, 'influenza', 2); bf.inkub = spiel.tag - 1; quarPflichtTag(); P.quarantaene = spiel.tag;
    const k1 = P.quarPflicht && P.quarPflicht.krank; befundAbschliessen(P, bf, 'geheilt'); delete P.gesundMeldung; quarPflichtTag(); document.getElementById('dlg').hidden = true; akte(3);
    return { k1, nach: P.quarPflicht && P.quarPflicht.nach, q: inQuarantaene(P), t: /21–28 Tage/.test(document.body.innerText), knopf: !!document.querySelector('[data-a14="tupfer:"]') }; });
  ok('Nach der Heilung bleibt die Quarantäne noch 21–28 Tage (Karte, Nasentupfer-Knopf)', r.k1 && r.nach === 'influenza' && r.q && r.t && r.knopf, JSON.stringify(r));
  await pg.locator('[data-a14="tupfer:"]').scrollIntoViewIfNeeded(); await bild('quarantaene-1366');
  await klick('[data-a14="tupfer:"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[3].pferd, t0 = !!P.quarTupfer; spiel.tag++; atem14Tag(); return { t0, q: inQuarantaene(P), brief: JSON.stringify(spiel.post || spiel.briefe || spiel).includes('negativ') }; });
  ok('Negativer Nasentupfer beendet die Quarantäne am nächsten Morgen', r.t0 && !r.q && r.brief, JSON.stringify(r));

  // 4) Druse: Stadien, Antibiotika nur früh, Abszess spalten (Klick), Träger-Test (Klick)
  let id = await pg.evaluate(() => { const [P, bf] = neu(4, 'druse', 3); bf.inkub = spiel.tag - 5; gestern(P, { antibiotika: 1 }); window._wReif = behandlungsWert(P, bf).wert;
    bf.inkub = spiel.tag; window._wFrueh = behandlungsWert(P, bf).wert; window._st = druseStadium(bf); bf.inkub = spiel.tag - 5; akte(4); return bf.id; });
  r = await pg.evaluate(() => ({ reif: _wReif, frueh: _wFrueh, st: _st }));
  ok('Druse: Antibiotika helfen vor dem Öffnen nicht (v1049, A7: StIKo Vet, sonst kalte Druse)', r.st === 'frueh' && r.frueh <= 0 && r.reif <= 0, JSON.stringify(r));
  ok('Reife Abszesse: Knopf „Abszess spalten“', await pg.locator(`[data-a14="spalt:${id}"]`).count() === 1);
  await pg.locator(`[data-a14="spalt:${id}"]`).scrollIntoViewIfNeeded(); await bild('druse-1366');
  await klick(`[data-a14="spalt:${id}"]`);
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd, bf = P.befunde.find(x => x.art === 'druse'); gestern(P, {}); return { st: druseStadium(bf), grad: bf.grad, re: JSON.stringify(spiel).includes('Druse-Abszess gespalten') }; });
  ok('Gespalten: Stadium „offen“, Grad 3 → 2, Rechnung', r.st === 'offen' && r.grad === 2 && r.re, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd, bf = P.befunde.find(x => x.art === 'druse'); const ro = Math.random; Math.random = () => 0; befundAbschliessen(P, bf, 'geheilt'); Math.random = ro; delete P.gesundMeldung; akte(4);
    return { tr: !!P.druseTraeger, knopf: !!document.querySelector('[data-a14="tt:spuel"]') }; });
  ok('Nach der Heilung kann ein Träger bleiben; Karte „Druse-Träger-Test“', r.tr && r.knopf, JSON.stringify(r));
  await klick('[data-a14="tt:spuel"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[4].pferd, t0 = !!P.traegerTest; const ro = Math.random; Math.random = () => 0.5; spiel.tag++; atem14Tag(); Math.random = ro;
    const e = P.befunde.find(x => x.art === 'luftsackempyem'); const out = { t0, emp: !!e && !!e.diagnose, bek: !!P.druseTraegerBekannt }; if (e) befundAbschliessen(P, e, 'geheilt'); out.weg = !P.druseTraeger; return out; });
  ok('Luftsack-Spülung findet den Träger (Luftsack-Empyem), nach der Behandlung kein Träger mehr', r.t0 && r.emp && r.bek && r.weg, JSON.stringify(r));

  // 5) Pferdeasthma in zwei Stufen, Inhalieren, staubarme Haltung
  r = await pg.evaluate(() => { const [P] = neu(5); P.vl = { ...veranlagungVon(P), atem: 0.6 }; P.futterStatus = {}; const ro = Math.random; Math.random = () => 0;
    P.staubTage = 2 * tpj(); staubNacht(P, { heuStaub: 2 }); const m = P.befunde.find(x => x.art === 'asthmaMild'); const out = { mild: !!m, chronMild: !!KRANK.asthmaMild.chronisch };
    P.staubTage = 4 * tpj(); staubNacht(P, { heuStaub: 2 }); Math.random = ro; out.schwer = !!m && m.art === 'asthma' && KRANK.asthma.chronisch; return out; });
  ok('Staub → erst leichtes Asthma (heilbar), lange Staub → schweres, chronisches Asthma', r.mild && !r.chronMild && r.schwer, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, bf] = neu(5, 'asthmaMild', 2); P.futterStatus = { staub: true }; gestern(P, { inhalieren: 1 }); const wS = behandlungsWert(P, bf); P.futterStatus.staub = false; const wF = behandlungsWert(P, bf);
    akte(5); return { plan: PLAN.asthmaMild.join(), apo: !!APO.inhalieren && !!APO.bronchien, hilft: HILFT.asthmaMild.inhalieren, sS: wS.schaden, wS: wS.wert, wF: wF.wert, t: /Leichtes bis mittleres Asthma/.test(document.body.innerText) }; });
  ok('Inhalieren und Bronchien-Erweiterer im Plan; staubarme Haltung wirkt stärker, Staub schadet; Karte', r.plan === 'inhalieren,bronchien' && r.apo && r.hilft > 0 && r.wF > r.wS && r.sS > 0 && r.t, JSON.stringify(r));
  await pg.locator('text=Leichtes bis mittleres Asthma').first().scrollIntoViewIfNeeded(); await bild('asthma-1366');

  // 6) EVA beim Deckhengst: Gesundheitstest per Klick, Ausscheider darf nicht besamen
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const [H] = neu(0, null, 0, 'Hengst'); H.eva = 1; deckhengstDialog(H, () => { document.getElementById('dlg').hidden = true; }); });
  await pg.click('#dhTest'); await pg.waitForTimeout(200);
  r = await pg.evaluate(() => { const H = spiel.boxen[0].pferd, t = document.getElementById('dlgInhalt').innerText; return { dlg: /EVA positiv/.test(t), pos: dfVon(H).evaPos, ok: dhTestOk(H), besam: dhBesamOk(H), sperre: dhEvaSperre(H) }; });
  ok('Gesundheitstest findet EVA-Ausscheider: keine Besamung/kein Versand', r.dlg && r.pos && r.ok && !r.besam && r.sperre, JSON.stringify(r));
  await bild('eva-1366');
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => ({ t: /Ausscheider/.test(document.getElementById('dlgInhalt').innerText) }));
  ok('Deckhengst-Fenster zeigt den EVA-Befund', r.t, JSON.stringify(r));
  r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const [H] = neu(1, null, 0, 'Hengst'); H.eva = 0; dfVon(H).test = datum().j; dfVon(H).evaPos = evaTraegerVon(H); return { besam: dhBesamOk(H), anteil: A14.evaTraeger }; });
  ok('Hengst ohne EVA darf besamen; Anteil Ausscheider 12/308', r.besam && Math.abs(r.anteil - 12 / 308) < 1e-9, JSON.stringify(r));

  // 7) Nachtrag: Bewegungs-Schäden der Atemwegskrankheiten aus v1021 wirken jetzt
  r = await pg.evaluate(() => ({ m: SCHADET.luftsackmykose.reiten, e: SCHADET.luftsackempyem.reiten, s: SCHADET.sinusitis.reiten }));
  ok('Luftsack-Mykose/Empyem, Sinusitis: Reiten schadet jetzt wirklich', r.m === 0.5 && r.e === 0.3 && r.s === 0.2, JSON.stringify(r));

  if (process.env.BILDER_ORDNER) {
    await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(200);
    await pg.evaluate(() => { const [P, bf] = neu(4, 'druse', 3); bf.inkub = spiel.tag - 5; P.quarantaene = spiel.tag; P.traechtig = null; akte(4); });
    await pg.waitForTimeout(200); const k = pg.locator('text=Druse: Abszesse reif').first(); if (await k.count()) await k.scrollIntoViewIfNeeded(); await bild('druse-390');
    await pg.evaluate(() => { const [P] = neu(0); P.gi = 1; P.pflege.impf = spiel.tag - 5; akte(0); }); await pg.waitForTimeout(200);
    const g = pg.locator('text=Grundimmunisierung').first(); if (await g.count()) await g.scrollIntoViewIfNeeded(); await bild('grundimmunisierung-390');
  }
  // 8) Speichern, Tag beenden
  r = await pg.evaluate(() => { try { naechsteNacht(); } catch (e) { return 'Fehler: ' + e.message; } speichernJetzt(); const s = lesen('zuchtstall-v2'); return !!s && !!s.boxen; });
  ok('Tag beenden und Speichern klappen', r === true, String(r));

  L.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' ; ') : '✓ keine Seitenfehler');
  const fehl = L.some(l => l[0] === '✗') || errs.length; console.log(fehl ? 'FEHLER' : 'alles ok'); await b.close(); process.exit(fehl ? 1 : 0);
})();
