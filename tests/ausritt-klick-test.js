// v1056/v1057 (Dome 18.11.2026: „prüfen wie ein Spieler“): Ausritt im 2D-Spiel mit echten Klicks – Orte → Gelände → Ausritt; im Bericht steht ab und zu ein Ereignis am Weg.
// Aufruf: node tests/ausritt-klick-test.js [BxH] [Ordner für Bilder]   (MOTOR=1 prüft den Motor der App)
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
const [bw, bh] = (process.argv[2] || "1366x768").split("x").map(Number), ordner = process.argv[3];
const DATEI = process.env.MOTOR ? path.resolve(__dirname, "../../zuchtstall-app/motor/index.html") : path.resolve(__dirname, "../index.html");
const L = []; const ok = (n, c, x) => { L.push((c ? "✓ " : "✗ ") + n + (c ? "" : " – " + (x || ""))); };
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: bw, height: bh }, hasTouch: bw < 900 }); const errs = []; pg.on("pageerror", (e) => errs.push(e.message));
  const bild = async (n) => { if (ordner) { fs.mkdirSync(ordner, { recursive: true }); await pg.screenshot({ path: path.join(ordner, `ausritt-${bw}x${bh}-${n}.png`) }); } };
  try {
    await pg.goto("file:///" + DATEI.replace(/\\/g, "/")); await pg.waitForTimeout(700);
    await pg.click("#smNeu"); await pg.fill("#chName", "T"); await pg.click("#chLos"); await pg.waitForTimeout(300); await pg.click("#dlgKnoepfe button");
    await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "Plan"); await pg.click("#dlgKnoepfe button:first-child"); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById("dlg").hidden = true; spiel.stufenAn = false; spiel.tippsAus = !!window.__ohneTipps; spiel.geld = 90000; spiel.tipps = Object.fromEntries(Object.keys(HINWEISE).filter((k) => k !== "ausritt").map((k) => [k, 1])); spiel.tippStart = spiel.tag; spiel.spieler.stufe = "fort";
      const P = neuesPferd({ rasse: "hannoveraner", geschlecht: "Wallach", alter: 9, name: "Rocco" }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.reheOk = spiel.tag; P.beschlag = true; spiel.boxen[0].pferd = P; spiel.boxen[0].tot = false; P.energie = energieMax(P); speichern && speichern(); });
    /* wie ein Spieler: Menü schließen = Box-Ansicht, dann Reiter „Pferdepflege“ → „Orte“ */
    await pg.evaluate(() => zeigeSchirm(null)); await pg.waitForTimeout(400);
    for (let k = 0; k < 4; k++) { const v = pg.locator("#dlgKnoepfe button:visible").filter({ hasText: /Verstanden|OK|Weiter/ }).first(); if (!(await v.count())) break; await v.click(); await pg.waitForTimeout(400); }   /* Start-Tipp „Verstanden“ antippen wie ein Spieler */ await bild("0-box");
    await pg.locator("[data-m=\"pflege\"]:visible").first().click(); await pg.waitForTimeout(300);
    await pg.locator("[data-r=\"platz\"]:visible").first().click(); await pg.waitForTimeout(400); await bild("1-orte");
    const gel = pg.locator('[data-ort="tr-gelaende"]:visible').first(); ok("Orte: Gelände ist zu sehen", await gel.count() > 0);
    await gel.click(); await pg.waitForTimeout(300);
    await pg.waitForFunction(() => blase && blase.k === "ausritt" && !document.getElementById("hinweisBlase").hidden, null, { timeout: 8000 }).catch(() => {}); await bild("2-gelaende");
    const hb = await pg.evaluate(() => { const b = document.getElementById("hinweisBlase"); return b && !b.hidden ? b.innerText : ""; }); ok("Hinweisblase „Ausritt“ erscheint im Gelände (" + hb.replace(/\s+/g, " ").slice(0, 60) + "…)", /Ausritt/.test(hb) && /Unheimliches|Mut/.test(hb), hb);
    await pg.locator("#hinweisBlase").click().catch(() => {}); await pg.waitForTimeout(300); ok("Antippen schließt die Blase und merkt sie sich", await pg.evaluate(() => document.getElementById("hinweisBlase").hidden && !!spiel.tipps.ausritt));
    ok("Gelände: Kachel „Ausritt“", await pg.locator('[data-ueb="ausritt"]').count() === 1);
    let mit = 0, ritte = 0, text = "", zeile = "";
    for (let n = 0; n < 30 && mit < 2; n++) {
      await pg.evaluate(() => { const p = spiel.boxen[0].pferd; p.energie = energieMax(p); p.trainHeute = null; p.schweiss = null; document.getElementById("dlg").hidden = true; });
      if (!(await pg.locator('[data-ueb="ausritt"]:visible').count())) { const g2 = pg.locator('[data-ort="tr-gelaende"]:visible').first(); if (await g2.count()) { await g2.click(); await pg.waitForTimeout(200); } }
      await pg.locator('[data-ueb="ausritt"]:visible').first().click(); await pg.waitForTimeout(250); ritte++;
      const t = await pg.evaluate(() => document.body.innerText); const m = t.match(/🌳 Am Weg:[^\n]+/); if (m) { mit++; text = m[0]; if (mit === 1) await bild("3-ereignis"); }
      if (!zeile && /Ausritt/.test(t) && /Ausdauer|Gelände/.test(t)) zeile = "ok";
    }
    ok(`Klick auf „Ausritt“ zeigt den Trainingsbericht`, zeile === "ok");
    ok(`nach ${ritte} geklickten Ausritten stand ${mit}× ein Ereignis am Weg im Bericht (${text.slice(0, 110)}…)`, mit >= 1 && /Am Weg: .+ – Rocco (spitzt|bleibt|erschrickt)/.test(text) && /(Vertrauen|scheut)/.test(text), text);
    const R = await pg.evaluate(() => { const p = spiel.boxen[0].pferd; return { ritte: p.gelRitte || 0, gew: p.wegGew || {} }; });
    ok(`das Spiel hat mitgezählt: ${R.ritte} Gelände-Ritte, Gewöhnung ${JSON.stringify(R.gew)}`, R.ritte >= 1 && Object.keys(R.gew).length >= 1);
    /* Pferdewissen-Karte und bzn-Eintrag */
    const W = await pg.evaluate(() => { const k = ENZY.wissen.eintraege.find((e) => /Scheuen im Gelände/.test(e[0])); spiel.admin = true; let bzn = ""; try { bzn = weitereDatenHTML(); } catch (e) { bzn = "Fehler " + e.message; } return { karte: k ? k[1] : "", bzn: (bzn.match(/Ereignisse am Weg[^<]*<\/b>[^]*?<\/p>/) || [""])[0] }; });
    ok("Pferdewissen: Karte „Scheuen im Gelände“ mit Fakten (Christensen, rote Schleife, Pferdelänge)", /Christensen/.test(W.karte) && /rote Schleife/.test(W.karte) && /Pferdelänge/.test(W.karte), W.karte.slice(0, 80));
    ok("bzn: Abschnitt „Ereignisse am Weg“ mit den Zahlen", /wegSchreck/.test(W.bzn) && /rittPause/.test(W.bzn) && /\+4 Energie/.test(W.bzn), W.bzn.slice(0, 160));
    const br = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1); ok("kein seitliches Scrollen", br);
    ok("keine Skriptfehler", !errs.length, errs.join(" | "));
  } catch (e) { ok("Ablauf", false, e.message.split("\n")[0]); }
  console.log(L.join("\n")); await b.close(); process.exit(L.some((x) => x.startsWith("✗")) ? 1 : 0);
})();
