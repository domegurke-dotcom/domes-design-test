// v1056 (Dome 18.11.2026, Auftrag 22 R5/R6): Ereignisse am Weg – Schreck nach Charakter, Ausbildung, Gelände-Erfahrung und Gewöhnung; Antwort ändert Vertrauen und Gewöhnung;
// schnell gerittener Ausritt meldet ein Ereignis im Bericht; trocken reiten. Aufruf: node tests/weg-ereignis-test.js   (MOTOR=1 prüft den Motor der App)
const { chromium } = require("playwright"); const path = require("path");
const DATEI = process.env.MOTOR ? path.resolve(__dirname, "../../zuchtstall-app/motor/index.html") : path.resolve(__dirname, "../index.html");
const L = []; const ok = (n, c, x) => { L.push((c ? "✓ " : "✗ ") + n + (c ? "" : " – " + (x || ""))); };
(async () => {
  const b = await chromium.launch(); const s = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; s.on("pageerror", (e) => errs.push(e.message));
  try {
    await s.goto("file:///" + DATEI.replace(/\\/g, "/")); await s.waitForFunction(() => window.spielGestartet, null, { timeout: 60000 }).catch(() => {});
    await s.click("#smNeu"); await s.fill("#chName", "Testerin"); await s.click("#chLos"); await s.waitForTimeout(600);
    for (let k = 0; k < 4; k++) { if (await s.$('[data-immo="pension"]') && await s.isVisible('[data-immo="pension"]')) break; const kn = await s.$("#dlgKnoepfe button"); if (kn && await kn.isVisible()) await kn.click(); await s.waitForTimeout(400); }
    if (await s.$("[data-bl]") && !(await s.isVisible('[data-immo="pension"]'))) { }
    await s.evaluate(() => { spiel.admin = true; spiel.stufenAn = false; });
    const R = await s.evaluate(() => { const mach = (o) => { const p = neuesPferd({ rasse: "hannoveraner", geschlecht: "Wallach", alter: o.alter || 9, name: o.name }); werteErgaenzen(p); Object.assign(p.werte.charakter, o.c); p.anreiten = o.reit; p.einreiten = o.reit; return p; };
      const mutig = mach({ name: "Mutig", c: { mut: 90, nerven: 90 }, reit: 100 }), scheu = mach({ name: "Scheu", c: { mut: 10, nerven: 15 }, reit: 100 }), jung = mach({ name: "Jung", c: { mut: 50, nerven: 50 }, reit: 20, alter: 4 }), mittel = mach({ name: "Mittel", c: { mut: 50, nerven: 50 }, reit: 100 });
      const r = { arten: Object.keys(WEG_ARTEN).length, mutig: wegSchreck(mutig, "reh"), scheu: wegSchreck(scheu, "reh"), jung: wegSchreck(jung, "reh"), mittel: wegSchreck(mittel, "reh"), gruppe: wegSchreck(mittel, "reh", true) };
      r.stufen = [wegStufe(r.mutig), wegStufe(r.mittel), wegStufe(r.scheu)];
      const v0 = mittel.werte.ist.vertrauen; const a = wegAntwort(mittel, "traktor", "hin"); r.hin = { gew: a.gew, plus: a.plus, vt: mittel.werte.ist.vertrauen - v0, danach: wegSchreck(mittel, "traktor"), andere: wegSchreck(mittel, "reh") };
      for (let n = 0; n < 5; n++) wegAntwort(mittel, "traktor", "hin"); r.gewMax = mittel.wegGew.traktor;
      const b0 = wegAntwort(mittel, "plane", "ausweich"), v1 = mittel.werte.ist.vertrauen; r.ausweich = { gew: b0.gew, plus: b0.plus, danach: wegSchreck(mittel, "plane") };
      const c0 = wegAntwort(mittel, "pfuetze", "strafe"); r.strafe = { gew: c0.gew, vt: Math.round((mittel.werte.ist.vertrauen - v1) * 100) / 100 };
      mittel.gelRitte = 30; r.erfahren = wegSchreck(mittel, "reh"); mittel.gelRitte = 0;
      mittel.schweiss = spiel.tag; r.trocken = [trockenReiten(mittel), trockenReiten(mittel), mittel.schweiss]; 
      /* schnell geritten: Ereignis im Bericht */
      spiel.tipps = {}; spiel.tippsAus = false; spiel.tippWarte = [];
      const P = mach({ name: "Ritt", c: { mut: 50, nerven: 50 }, reit: 100 }); P.pflege = erzeugePflege(P); P.reheOk = spiel.tag; spiel.boxen[0].pferd = P; spiel.boxen[0].tot = false; spiel.anlage = spiel.anlage || {}; let mit = 0, text = "", n = 0; const zufall = Math.random;
      for (n = 0; n < 120 && (P.gelRitte || 0) < 40; n++) { P.energie = energieMax(P); P.trainHeute = null; const e = trainieren(P, "ausritt", "gelaende"); const f = (e.folgen || []).find((x) => /^🌳 Am Weg/.test(x)); if (f) { mit++; text = f; } }
      r.ritt = { n, mit, text, gelRitte: P.gelRitte, gew: Object.values(P.wegGew || {}).reduce((a2, x) => a2 + Math.abs(x), 0) };
      const Q = mach({ name: "Selbst", c: {}, reit: 100 }); Q.pflege = erzeugePflege(Q); Q.reheOk = spiel.tag; let selbstMit = 0; for (let k = 0; k < 25; k++) { Q.energie = energieMax(Q); Q.trainHeute = null; const e = trainieren(Q, "ausritt", "gelaende", null, { guete: 1 }); if ((e.folgen || []).some((x) => /Am Weg/.test(x))) selbstMit++; } r.selbst = { mit: selbstMit, ritte: Q.gelRitte };
      r.tipp = !!HINWEISE.ausritt && (spiel.tippWarte || []).includes("ausritt"); r.zecken = (spiel.tippWarte || []).includes("zecken");
      return r; });
    ok(`10 Ereignis-Arten (${R.arten})`, R.arten === 10);
    ok(`mutig und nervenstark erschrickt wenig, scheu stark (${R.mutig} < ${R.mittel} < ${R.scheu})`, R.mutig < R.mittel && R.mittel < R.scheu);
    ok(`Stufen: mutig zögert nur, mittel bleibt stehen, scheu springt zur Seite (${R.stufen.join("/")})`, R.stufen.join() === "1,2,3");
    ok(`junges, kaum gerittenes Pferd erschrickt mehr als ein ausgebildetes (${R.jung} > ${R.mittel})`, R.jung > R.mittel);
    ok(`hinter einem erfahrenen Pferd ruhiger (${R.gruppe} < ${R.mittel})`, R.gruppe < R.mittel);
    ok(`viele Ritte im Gelände machen ruhiger (${R.erfahren} < ${R.mittel})`, R.erfahren < R.mittel && R.mittel - R.erfahren <= 0.21);
    ok(`hingeführt: Gewöhnung +1, Vertrauen steigt (+${R.hin.vt}), beim Traktor danach ruhiger (${R.hin.danach}), beim Reh unverändert (${R.hin.andere})`, R.hin.gew === 1 && R.hin.vt > 0 && R.hin.danach < R.mittel && R.hin.andere === R.mittel, JSON.stringify(R.hin));
    ok(`Gewöhnung höchstens +3 (${R.gewMax})`, R.gewMax === 3);
    ok(`ausgewichen: Gewöhnung −1, kein Vertrauens-Abzug, danach schreckhafter (${R.ausweich.danach})`, R.ausweich.gew === -1 && !R.ausweich.plus && R.ausweich.danach > R.mittel, JSON.stringify(R.ausweich));
    ok(`gestraft: Gewöhnung −1 und Vertrauen sinkt (${R.strafe.vt})`, R.strafe.gew === -1 && R.strafe.vt < 0);
    ok(`schnell gerittener Ausritt: Ereignis im Bericht bei etwa 30 % der gerittenen Ausritte (${R.ritt.mit} von ${R.ritt.gelRitte})`, R.ritt.gelRitte >= 20 && R.ritt.mit / R.ritt.gelRitte >= 0.1 && R.ritt.mit / R.ritt.gelRitte <= 0.6 && /Am Weg: .+ – Ritt /.test(R.ritt.text), JSON.stringify(R.ritt));
    ok(`… jeder nicht abgebrochene Ritt zählt als Gelände-Erfahrung (${R.ritt.gelRitte}) und die Antwort wird gemerkt`, R.ritt.gelRitte >= 20 && R.ritt.gelRitte <= R.ritt.n && R.ritt.gew > 0);
    ok(`selbst geritten (App): kein automatisches Ereignis (${R.selbst.mit}), Ritt zählt trotzdem (${R.selbst.ritte})`, R.selbst.mit === 0 && R.selbst.ritte >= 6 && R.selbst.ritte <= 25);
    ok(`trocken reiten: nur ein verschwitztes Pferd wird trocken (${JSON.stringify(R.trocken)})`, R.trocken[0] === true && R.trocken[1] === false && R.trocken[2] == null);
    ok("Hinweisblase „Ausritt“ wird nach einem Ereignis vorgemerkt", R.tipp);
    ok("nach einem Ritt im Gelände wird der Zecken-Hinweis vorgemerkt (nur Hinweis, keine Krankheit)", R.zecken);
    ok("keine Seitenfehler", !errs.length, errs.join(" | "));
  } catch (e) { ok("Ablauf", false, e.message.split("\n")[0]); }
  console.log(L.join("\n")); await b.close(); process.exit(L.some((x) => x.startsWith("✗")) ? 1 : 0);
})();
