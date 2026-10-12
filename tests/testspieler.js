// Testspieler (Dome, v377): drei Spielertypen spielen je 2 Jahre (8 Jahreszeiten) ab einem neuen Spiel.
// NUR AUF DOMES ANWEISUNG STARTEN – kostet Volumen.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/testspieler.js [1|2|3]   (ohne Zahl: alle drei)
// Bericht: Geld je Jahreszeit, Pleite ja/nein, Pferde (Gesundheit, Wohlbefinden, Befunde), Einsteller-Zufriedenheit, Mahnungen, gesehene Tipps.
const { chromium } = require("playwright");
const path = require("path");

// Fehlerquoten je Spielertyp (Anteil der Tage, an denen etwas vergessen bzw. falsch gemacht wird)
const SPIELER = {
  1: { name: "Nr. 1 – Anfänger (kennt Spiel und Pferde nicht, viele Fehler)",
       fuettern: 0.35, wasser: 0.4, misten: 0.5, putzen: 0.8, postSpaet: 0.6, anfrageAnnehmen: 0.5, futterErstWennLeer: true,
       pferdKauf: "teuer", aku: false, mitarbeiterFrueh: true, bauenFrueh: true, tierarzt: 0.3, tippsBefolgen: 0.9 },
  2: { name: "Nr. 2 – etwas Erfahrung (Spiel ein paar Mal gespielt, etwas Pferdeahnung, einige Fehler)",
       fuettern: 0.12, wasser: 0.15, misten: 0.15, putzen: 0.5, postSpaet: 0.2, anfrageAnnehmen: 0.85, futterErstWennLeer: false,
       pferdKauf: "mittel", aku: true, mitarbeiterFrueh: false, bauenFrueh: false, tierarzt: 0.7, tippsBefolgen: 0.5 },
  3: { name: "Nr. 3 – Profi (Spiel oft gespielt, kennt sich mit Pferden aus, wenige Fehler)",
       fuettern: 0.02, wasser: 0.02, misten: 0.03, putzen: 0.05, postSpaet: 0.02, anfrageAnnehmen: 1, futterErstWennLeer: false,
       pferdKauf: "tierschutz", aku: true, mitarbeiterFrueh: false, bauenFrueh: false, tierarzt: 0.95, tippsBefolgen: 0.1 },
};

async function spiele(nr) {
  const S = SPIELER[nr];
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on("pageerror", e => fehler.push(e.message));
  await pg.goto("file://" + path.resolve(__dirname, "..", "index.html")); await pg.waitForTimeout(800);
  await pg.click("#smNeu"); await pg.fill("#chName", "Testspieler " + nr); await pg.click("#chLos"); await pg.waitForTimeout(300);
  await pg.click("#dlgKnoepfe button"); await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "Testhof " + nr); await pg.click("#dlgKnoepfe button:first-child");
  await pg.waitForTimeout(500);

  const bericht = await pg.evaluate(S => {
    const zuf = () => Math.random(), log = [], geldLog = [], tippsGesehen = [];
    let mahnungen = 0, pleite = false, gekauft = null;
    const zu = () => { $("dlg").hidden = true; };   // Fenster (Tipps, Meldungen) wegklicken
    const befolgt = [];
    const tippsMerken = () => { const t = $("dlg").hidden ? "" : $("dlgInhalt").innerText.split("\n")[0]; if (!t.startsWith("💡") || tippsGesehen.includes(t)) return; tippsGesehen.push(t);
      if (zuf() > S.tippsBefolgen) return; befolgt.push(t);   // Tipp befolgen: weniger Fehler im passenden Bereich
      const halb = k => { S[k] = S[k] / 2; };
      if (t.includes("2 Jahre")) { S.anfrageAnnehmen = Math.max(S.anfrageAnnehmen, 0.95); S.futterErstWennLeer = false; S.mitarbeiterFrueh = false; S.bauenFrueh = false; if (S.pferdKauf === "teuer") S.pferdKauf = "tierschutz"; }
      if (t.includes("Box")) { halb("fuettern"); halb("wasser"); halb("misten"); } if (t.includes("Putzen")) halb("putzen");
      if (t.includes("Post") || t.includes("Postfach")) halb("postSpaet"); if (t.includes("krank") || t.includes("Tierarzt")) S.tierarzt = Math.min(1, S.tierarzt + 0.3);
      if (t.includes("Pferdemarkt")) S.aku = true; if (t.includes("Futterkammer")) S.futterErstWennLeer = false; };
    const tage = 8 * tpj();
    for (let d = 0; d < tage && !pleite; d++) {
      const ansichten = [() => zeigeSchirm(null), () => zeigeMarkt(), () => zeigeHof("hof"), () => zeigeHof("post"), () => zeigeHof("mitarbeiter"), () => { aktenModus = "pflege"; zeigeSchirm(null); }, () => { aktenModus = "steckbrief"; zeigeSchirm(null); }];
      for (const a of ansichten) { try { a(); for (let k = 0; k < 3; k++) { tippPruefen(); tippsMerken(); zu(); } } catch (e) { } }
      zeigeSchirm(null);
      // Post: Rechnungen, Kreditraten, Pensionsanfragen
      if (zuf() > S.postSpaet) {
        (spiel.rechnungen || []).slice().forEach(r => { if ((spiel.geld || 0) >= r.betrag) { if (r.stufe) mahnungen++; rechnungZahlen(r.id); zu(); } });
        kredite().forEach(k => { if ((k.offen || []).length) { kreditOffenZahlen(k.id); zu(); } });
        (spiel.pensionAnfragen || []).filter(a => !a.angenommen).forEach(a => { if (zuf() < S.anfrageAnnehmen && !pensionAnnehmen(a)) (spiel.post || []).forEach(br => { if (br.aktion && br.aktion.aid === a.aid) br.aktion.antwort = "ja"; }); });
        (spiel.post || []).forEach(b => { b.gelesen = true; });
      }
      // Futter nachkaufen
      const F = futterkammer(), heu = RAUFUTTER_REIHE.reduce((a, k) => a + (F.lager[k] || 0), 0), bedarf = spiel.boxen.filter(b => b.pferd).length * 10 * tpj();
      if (S.futterErstWennLeer ? heu < 20 : heu < bedarf) { const menge = Math.min(Math.max(200, bedarf * 2), Math.floor(F.lagerMax - lagerBelegt())); if (menge > 0 && (spiel.geld || 0) > menge * FUTTER.heu.preis) { const f = futterKaufen("heu", menge); if (f) log.push(`Tag ${spiel.tag}: Futter: ${f}`); } }
      // erstes eigenes Pferd (ab Tag 3)
      if (!gekauft && spiel.tag >= 3) {
        const M = marktNeu(), L = S.pferdKauf === "tierschutz" ? (M.notfall || []) : (M.privat || []).slice().sort((a, b) => (b.preis || 0) - (a.preis || 0));
        const h = S.pferdKauf === "mittel" ? L[Math.floor(L.length / 2)] : L[0];
        if (h && spiel.boxen.some(boxFrei) && (spiel.geld || 0) > (h.preis || 0) + (S.aku ? 420 : 0)) { if (S.aku) buchen(-420, "AKU (Testspieler)"); pferdEinstellen(h, h.preis || 0, "Pferdekauf"); zu(); gekauft = `${h.name} (${fmt(h.preis || 0)}${S.aku ? ", mit AKU" : ", ohne AKU"})`; }
      }
      // Fehler Anfänger: früh Mitarbeiter / bauen
      if (S.mitarbeiterFrueh && spiel.tag === 5 && !(spiel.mitarbeiter || []).length) log.push("Tag 5: würde einen Pferdepfleger einstellen (330 €/Jz) – im Skript nur als Kosten gebucht"), (spiel.testLohn = 330);
      if (spiel.testLohn && datum().t === 1) buchen(-spiel.testLohn, "Lohn (Testspieler)");
      if (S.bauenFrueh && spiel.tag === 8) { const ok = bauStarten("reitplatz", 1); zu(); log.push(`Tag 8: Reitplatz bauen – ${ok ? "gestartet" : "ging nicht"}`); }
      // Stallarbeit je Box
      spiel.boxen.forEach((box, i) => { const p = box.pferd; if (!p || box.tot || p.klinik || p.weide) return; aktBox = i;
        if (zuf() > S.fuettern) { if (fuetternAusLager(box, "du", "rau")) box.krippeVoll = true; if (kraftNoetig(p, box)) { fuetternAusLager(box, "du", "kraft"); box.kraftVoll = true; } }
        if (zuf() > S.wasser) box.wasserTag = spiel.tag;
        if (zuf() > S.misten) { box.mistig = false; box.mistStufe = 0; }
        if (!fremd(p) && zuf() > S.putzen) { putzen(p, "buerste"); putzen(p, "kamm"); }
        if (!fremd(p) && (p.befunde || []).some(b => b.bemerkt && !b.diagnose) && zuf() < S.tierarzt) { try { tierarztBesuch(p, box, () => {}); } catch (e) { log.push("Tierarzt-Fehler: " + e.message); } zu(); }
      });
      zu(); naechsteNacht(); zu();
      if (spiel.verloren) { pleite = true; log.push(`Tag ${spiel.tag}: PLEITE / Zwangsversteigerung`); }
      if (datum().t === 1) geldLog.push(`${jzName(jzJetzt())}: ${fmt(spiel.geld || 0)}`);
    }
    const pferde = spiel.boxen.filter(b => b.pferd).map(b => { const p = b.pferd; return `${p.name}${fremd(p) ? " (Einsteller)" : ""}: Gesundheit ${Math.round(p.pflege.gesundheit)} %, Wohl ${Math.round(p.pflege.wohl || 0)} %, Befunde ${(p.befunde || []).length}`; });
    const einsteller = einstellerListe().map(e => `${eName(e)}: Zufriedenheit ${Math.round(e.zufr || 0)}`);
    return { gekauft, pleite, befolgt, kredit: fmt(kredite().reduce((a, k) => a + (k.rest || 0), 0)), boxen: spiel.boxen.length, hoefe: (spiel.hofReihe || []).length, eigene: eigenePferdeHof().length, geld: fmt(spiel.geld || 0), geldLog, pferde, einsteller, mahnungen, tippsGesehen, log };
  }, S);

  console.log(`\n===== ${S.name} =====`);
  console.log(JSON.stringify(bericht, null, 1));
  if (fehler.length) console.log("Spielfehler:", fehler);
  await browser.close();
}

(async () => {
  const nr = process.argv[2];
  for (const n of nr ? [nr] : [1, 2, 3]) await spiele(n);
})();
