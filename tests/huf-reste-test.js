// v1042 (Auftrag 13, Reste): Abszess öffnen, Hufrehe-Röntgen mit Rotation und Rehebeschlag, Sehnen-Aufbauplan mit Rückfall und Ultraschall-Kontrolle,
// Stammzellen in der Klinik, Bruchart beim Röhrbeinbruch, Arthroskopie mit Boxenruhe, Enzyklopädie-Reiter „Krankheiten“.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/huf-reste-test.js   ·   BILDER_ORDNER=<Scratchpad> speichert Bilder (1366×768 und 390×844)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; spiel.tag += 5;
    window.neu = (i, art, grad, f) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P);
      const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; let bf = null;
      if (art) { bf = befundNeu(P, art, grad, 'Test', 'du'); bf.diagnose = spiel.tag; bf.tierarzt = true; bf.geklaert = true; if (f) f(bf, P); }
      return [P, bf]; };
    window.akte = i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); };
    window.gestern = (P, a) => { P.behHeute = { tag: spiel.tag - 1, a }; }; });
  const klick = async (sel) => { await pg.click(sel); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(150); };
  const bild = async (name) => { if (!process.env.BILDER_ORDNER) return; await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER, name + '.png'), fullPage: false }); };

  // 1) Abszess öffnen (Tierarzt) mit echtem Klick
  let id = await pg.evaluate(() => { const [P, bf] = neu(0, 'hufabszess', 3); akte(0); return bf.id; });
  ok('Karte „Abszess öffnen“ mit zwei Knöpfen', await pg.locator(`[data-h13="ta:${id}"]`).count() === 1 && await pg.locator(`[data-h13="hs:${id}"]`).count() === 1);
  await pg.locator(`[data-h13="ta:${id}"]`).scrollIntoViewIfNeeded(); await bild('abszess-karte-1366');
  await klick(`[data-h13="ta:${id}"]`);
  let r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'hufabszess'); zeigeAkte();
    return { geo: bf.geoeffnet === spiel.tag, grad: bf.grad, rechnung: JSON.stringify(spiel).includes('Hufabszess geöffnet und Verband'), karte: /Abszess ist geöffnet/.test(document.body.innerText), heil: huf13HeilX(P, bf) }; });
  ok('Abszess geöffnet, Grad 3 → 2, Rechnung, Karte „geöffnet“', r.geo && r.grad === 2 && r.rechnung && r.karte, JSON.stringify(r));
  ok('Geöffneter Abszess heilt schneller (×1,6)', r.heil === 1.6, r.heil);
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'hufabszess'), bx = spiel.boxen[0]; const w = [];
    for (let t = 0; t < 3; t++) { spiel.tag++; gestern(P, { hufbad: 1 }); huf13Nacht(P, bf, bx, 0); w.push(behandlungsWert(P, bf).wert); }
    return { folge: bf.hufbadFolge, w }; });
  ok('Hufbad am 3. Tag hintereinander hilft nicht mehr', r.folge === 3 && r.w[2] < r.w[0], JSON.stringify(r));
  // Hufschmied öffnet beim normalen Besuch
  r = await pg.evaluate(() => { const [P, bf] = neu(1, 'hufabszess', 3); bf.diagnose = null; hufschmiedKommt([P], 'barhuf'); return bf.geoeffnet === spiel.tag; });
  ok('Hufschmied öffnet den Abszess beim Besuch', r);

  // 2) Hufrehe: Röntgen per Klick, Rotation nur bei schwerer Rehe, Rehebeschlag durch den Hufschmied
  id = await pg.evaluate(() => { const [P, bf] = neu(0, 'hufrehe', 4); akte(0); return bf.id; });
  await klick(`[data-h13="rx:${id}"]`);
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'hufrehe'); zeigeAkte(); return { rot: bf.rotation, karte: /Hufbeinrotation etwa/.test(document.body.innerText), heil: huf13HeilX(P, bf) }; });
  ok('Grad 4: Röntgen zeigt Rotation 5–15°, Karte, langsamere Heilung', r.rot >= 5 && r.rot <= 15 && r.karte && r.heil === 0.7, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, bf] = neu(1, 'hufrehe', 2); reheRoentgen(P, bf); document.getElementById('dlg').hidden = true; P.beschlag = true; const w0 = behandlungsWert(P, bf).wert;
    hufschmiedKommt([P], 'beschlag'); const w1 = behandlungsWert(P, bf).wert; return { rot: bf.rotation, rb: bf.rehebeschlag === spiel.tag, posten: JSON.stringify(spiel).includes('Rehebeschlag nach Röntgenbild'), w0, w1 }; });
  ok('Grad 2: keine Rotation; Hufschmied macht Rehebeschlag (Rechnung), Behandlung wirkt besser', r.rot === 0 && r.rb && r.posten && r.w1 > r.w0, JSON.stringify(r));

  // 3) Sehnen-Aufbauplan
  r = await pg.evaluate(() => { const [P, bf] = neu(0, 'sehne', 3); const bx = spiel.boxen[0]; const A = aufbauVon(bf), out = { start: A.phase };
    out.sperre0 = vorrangSperre(P, 'reiten'); spiel.tag += wochenTage(4); gestern(P, {}); huf13Nacht(P, bf, bx, 0); out.phase1 = A.phase; out.schritt = vorrangSperre(P, 'schritt');
    const ro = Math.random; Math.random = () => 0; gestern(P, { reiten: 1 }); huf13Nacht(P, bf, bx, 0); Math.random = ro; out.rueck = { phase: A.phase, grad: bf.grad };
    const ohne = neu(2, 'sehne', 3)[1]; ohne.geklaert = false; out.ohneUntersuchung = aufbauVon(ohne) === null;
    return out; });
  ok('Plan startet mit strenger Boxenruhe, Reiten gesperrt', r.start === 0 && r.sperre0, JSON.stringify(r));
  ok('Nach 4 Wochen Phase 2 (Schritt führen erlaubt)', r.phase1 === 1 && r.schritt === false, JSON.stringify(r));
  ok('Reiten zu früh → Rückfall (Phase zurück, Grad +1)', r.rueck.phase === 0 && r.rueck.grad === 4, JSON.stringify(r));
  ok('Ohne geklärte Lahmheitsuntersuchung kein Plan', r.ohneUntersuchung);
  id = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'sehne'); bf.aufbau = { phase: 1, ab: spiel.tag - 20 }; bf.grad = 2; akte(0); return bf.id; });
  ok('Ultraschall-Knopf, wenn die Kontrolle fällig ist', await pg.locator(`[data-h13="us:${id}"]`).count() === 1);
  await pg.locator(`[data-h13="us:${id}"]`).scrollIntoViewIfNeeded(); await bild('aufbauplan-1366');
  await klick(`[data-h13="us:${id}"]`);
  r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'sehne'); return { phase: bf.aufbau.phase, sch: aufbauSchaden(bf, 'longe'), rei: aufbauSchaden(bf, 'reiten') }; });
  ok('Kontrolle gut → Phase 3; Longe schadet nicht mehr, Reiten noch', r.phase === 2 && r.sch === 0 && r.rei > 0, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'sehne'); bf.grad = 1; bf.aufbau = { phase: 3, ab: spiel.tag - 50 };
    gestern(P, { tierarzt: 1 }); const ro = Math.random; Math.random = () => 0.999; const s0 = spiel.tag; spiel.tag++;
    const mitte = aufbauHaelt(bf); Math.random = () => 0; const gB = bf.grad; Math.random = ro;
    const fertig = aufbauKontrolle(P, bf); return { mitte, fertig, weg: !P.befunde.includes(bf), alt: (P.befundAlt || [])[0] && P.befundAlt[0].wie }; });
  ok('Plan hält den Befund offen; letzte Kontrolle → geheilt (Aufbauplan abgeschlossen)', r.mitte && r.fertig && r.weg && /Aufbauplan/.test(r.alt || ''), JSON.stringify(r));
  r = await pg.evaluate(() => { const [P, bf] = neu(0, 'sehne', 2); bf.aufbau = { phase: 3, ab: spiel.tag - 50 }; gestern(P, { tierarzt: 1 }); const ro = Math.random;
    let n = 0; Math.random = () => (n++ % 2 ? 0.999 : 0); for (let t = 0; t < 6; t++) { spiel.tag++; gestern(P, { tierarzt: 1 }); delete bf.besserTag; befundeNacht(); } Math.random = ro;
    return { noch: P.befunde.includes(bf), grad: bf.grad }; });
  ok('Befund heilt nicht von allein unter Grad 1, solange der Plan läuft', r.noch && r.grad >= 1, JSON.stringify(r));
  r = await pg.evaluate(() => { const [P] = neu(0, 'fesseltraeger', 2); return { reiten: SCHADET.fesseltraeger.reiten, auslauf: SCHADET.fesseltraeger.auslauf }; });
  ok('Fesselträger: Reiten/Auslauf schaden jetzt wirklich (Nachtrag v1020)', r.reiten > 0 && r.auslauf > 0, JSON.stringify(r));

  // 4) Stammzellen in der Klinik (Klick auf die OP-Karte)
  await pg.evaluate(() => { neu(0, 'sehne', 3); akte(0); });
  ok('OP-Karte „Stammzellen-Behandlung“', await pg.locator('[data-opklinik="stammzellen"]').count() === 1);
  await klick('[data-opklinik="stammzellen"]');
  r = await pg.evaluate(() => { const P = spiel.boxen[0].pferd, bf = P.befunde.find(x => x.art === 'sehne'), op = P.klinik && P.klinik.op; P.klinik.bis = spiel.tag; P.pflege.gesundheit = 90; externNacht();
    zeigeAkte(); return { op, raus: !P.klinik, stz: bf.stammzellen, noch: P.befunde.includes(bf), karteWeg: !document.querySelector('[data-opklinik="stammzellen"]'), boxenruhe: !!P.boxenruhe }; });
  ok('Klinik: Stammzellen gespritzt, Befund bleibt (Aufbauplan), Karte verschwindet', r.op === 'stammzellen' && r.raus && r.stz && r.noch && r.karteWeg, JSON.stringify(r));

  // 5) Röhrbeinbruch: Bruchart im Röntgen, OP-Erfolg und Tod je Art
  r = await pg.evaluate(() => { const [P, bf] = neu(0, 'fraktur', 4); bf.geklaert = false; const art0 = bf.bruchArt; bf.uStufe = 3; lahmStufeErgebnis(P, bf); akte(0);
    const txt = document.body.innerText; bf.bruchArt = 'glatt'; const eg = OP_KLINIK.frakturop.erfolgVon(P), tg = todTrotzVon(bf); bf.bruchArt = 'gleichbein'; const ev = OP_KLINIK.frakturop.erfolgVon(P), tv = todTrotzVon(bf);
    return { art0, bekannt: bf.bruchBekannt, karte: new RegExp(BRUCH_ART[art0].n).test(txt), eg, ev, tg, tv }; });
  ok('Röntgen zeigt die Bruchart (Karte)', !!r.art0 && r.bekannt && r.karte, JSON.stringify(r));
  ok('Nicht verschoben: bessere OP-Chance, kaum Todesrisiko', r.eg === 0.85 && r.ev === 0.45 && r.tg < r.tv, JSON.stringify(r));

  // 6) Arthroskopie: mit Arthrose schlechter, danach Boxenruhe, die bleibt
  r = await pg.evaluate(() => { const [P, bf] = neu(0, 'ocd', 2); const e1 = OP_KLINIK.arthroskopie.erfolgVon(P); befundNeu(P, 'arthrose', 1, 'Test'); const e2 = OP_KLINIK.arthroskopie.erfolgVon(P);
    P.befunde = P.befunde.filter(x => x.art !== 'arthrose'); P.klinik = { seit: spiel.tag, op: 'arthroskopie', bis: spiel.tag }; P.pflege.gesundheit = 90; const ro = Math.random; Math.random = () => 0; externNacht(); Math.random = ro;
    const ruhe1 = !!P.boxenruhe && P.ruheBis > spiel.tag; spiel.tag++; befundeNacht(); return { e1, e2, ocdWeg: !P.befunde.some(x => x.art === 'ocd'), ruhe1, ruhe2: !!P.boxenruhe }; });
  ok('Arthroskopie: 0,85 / mit Arthrose 0,6; danach Boxenruhe, die nicht sofort endet', r.e1 === 0.85 && r.e2 === 0.6 && r.ocdWeg && r.ruhe1 && r.ruhe2, JSON.stringify(r));

  // 7) Enzyklopädie: Reiter „Krankheiten“ (echte Klicks)
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; enzyKat = 'rassen'; zeigeEnzy(); });
  await pg.click('[data-kat="krank"]'); await pg.waitForTimeout(200);
  r = await pg.evaluate(() => ({ n: document.querySelectorAll('.enz-karte').length, b: [...document.querySelectorAll('.enz-karte p')].some(x => x.querySelector('b')), t: document.body.innerText.includes('Sehnenschaden') }));
  ok('Enzyklopädie: mindestens 15 Krankheits-Karten ohne <b> im Text (v1044: +7 Magen, Darm, Zähne)', r.n >= 15 && !r.b && r.t, JSON.stringify(r));
  await bild('enz-krankheiten-1366');
  if (process.env.BILDER_ORDNER) {
    await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(200); await bild('enz-krankheiten-390'); await pg.click('#zu').catch(() => {});
    await pg.evaluate(() => { const [P, bf] = neu(0, 'sehne', 2); bf.aufbau = { phase: 1, ab: spiel.tag - 20 }; befundNeu(P, 'hufabszess', 3, 'Test', 'du').diagnose = spiel.tag; akte(0); });
    await pg.waitForTimeout(200); const k = pg.locator('text=Aufbauplan Sehne').first(); if (await k.count()) await k.scrollIntoViewIfNeeded(); await bild('aufbauplan-390');
    const a = pg.locator('text=Abszess öffnen').first(); if (await a.count()) await a.scrollIntoViewIfNeeded(); await bild('abszess-390');
  }
  // 8) Speichern und Laden
  r = await pg.evaluate(() => { speichernJetzt(); const s = lesen('zuchtstall-v2'); return !!s && !!s.boxen; });
  ok('Speichern mit neuen Feldern klappt', r);

  L.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' ; ') : '✓ keine Seitenfehler');
  const fehl = L.some(l => l[0] === '✗') || errs.length; console.log(fehl ? 'FEHLER' : 'alles ok'); await b.close(); process.exit(fehl ? 1 : 0);
})();
