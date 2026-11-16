// v1059 (Auftrag 25 Block 1 Nr. 4, Dome 16.11.2026): angestellter Azubi ab dem 2. Ausbildungsjahr – Einsatz „Arbeit als <Beruf>“ mit halber Kapazität und Fehlerquote des 2. Jahres;
// Fachrichtung Pferderennen → Rennpferdetrainer, Spezialreitweisen → Westerntrainer; Renn-/Westerntrainer bilden im passenden Stall aus. Echte Klicks in der Mitarbeiterliste.
// Aufruf: NODE_PATH=<playwright> node tests/azubi-beruf-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require("playwright"); const path = require("path");
const DATEI = process.env.MOTOR ? path.resolve(__dirname, "../../zuchtstall-app/motor/index.html") : path.resolve(__dirname, "../index.html"), O = process.argv[2];
const L = []; const ok = (n, c, x) => L.push((c ? "✓ " : "✗ ") + n + (c ? "" : " – " + (x || "")));
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on("pageerror", (e) => errs.push(e.message));
  try {
    await pg.goto("file:///" + DATEI.replace(/\\/g, "/")); await pg.waitForTimeout(600);
    await pg.click("#smNeu"); await pg.fill("#chName", "T"); await pg.click("#chLos"); await pg.waitForTimeout(250); await pg.click("#dlgKnoepfe button");
    await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "A"); await pg.click("#dlgKnoepfe button:first-child"); await pg.waitForTimeout(300);
    const R = await pg.evaluate(() => { document.getElementById("dlg").hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = true;
      spiel.stallarten = ["ausbildung"]; spiel.anlage = spiel.anlage || {}; spiel.anlage.reitplatz = 1;
      const mk = (typ, name, x) => { const m = maErgaenzen({ id: "t-" + name, typ, name, gehalt: 400, wissen: {}, eig: [], ...(x || {}) }); spiel.mitarbeiter.push(m); return m; };
      spiel.mitarbeiter = []; const ber = mk("bereiter", "Bea", { ab: jzJetzt() - 4, wissen: { ruecken: 70, verhalten: 70, huf: 50, futter: 50 } });
      const az = mk("azubi", "Alex", { fach: "ausbildung", ab: jzJetzt() - 4, ausbilder: ber.id, gehalt: 120 });
      for (let i = 0; i < 6; i++) { const P = neuesPferd({ rasse: "hannoveraner", geschlecht: "Wallach", alter: 7, name: "R" + i }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.reheOk = spiel.tag; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; P.energie = energieMax(P); }
      return { jahr: ausbildungsJahr(az), stallart: stallarten(), ziele: { renn: FACH.renn.ziel, western: FACH.western.ziel }, rennAusb: (() => { spiel.stallarten = ["renn"]; const r = istAusbilderTyp({ typ: "renntrainer" }); spiel.stallarten = ["western"]; const w = istAusbilderTyp({ typ: "westerntrainer" }); spiel.stallarten = ["ausbildung"]; return [r, w]; })() }; });
    ok(`Azubi ist im 2. Ausbildungsjahr (${R.jahr}), Stallart Ausbildungsstall`, R.jahr === 2 && R.stallart.includes("ausbildung"), JSON.stringify(R));
    ok(`Fachrichtung Pferderennen → ${R.ziele.renn}, Spezialreitweisen → ${R.ziele.western}`, R.ziele.renn === "renntrainer" && R.ziele.western === "westerntrainer");
    ok(`Renn- und Westerntrainer dürfen im passenden Stall ausbilden (${R.rennAusb})`, R.rennAusb[0] && R.rennAusb[1]);
    /* echter Klick: Mitarbeiter → Azubi → „💼 Arbeit als …“ */
    await pg.evaluate(() => mitarbeiterDialog("azubi")); await pg.waitForTimeout(400);
    const kn = pg.locator('[data-azeins$=":beruf"]').first(); ok("Mitarbeiterliste: Knopf „💼 Arbeit als Pferdewirt(in) Klassische Reitausbildung“", (await kn.count()) === 1 && /Arbeit als .*Klassische Reitausbildung/.test(await kn.innerText()), await kn.count() ? await kn.innerText() : "fehlt");
    if (O) await pg.screenshot({ path: O + "/azubi-beruf-liste.png" });
    await kn.click(); await pg.waitForTimeout(300);
    ok("Wechsel gilt ab morgen", await pg.evaluate(() => { const m = spiel.mitarbeiter.find((x) => x.name === "Alex"); return m.einsatzNeu && m.einsatzNeu.e === "beruf" && m.einsatzNeu.ab === spiel.tag + 1; }));
    const T = await pg.evaluate(() => { document.getElementById("dlg").hidden = true; const m = spiel.mitarbeiter.find((x) => x.name === "Alex"); m.einsatz = "beruf"; delete m.einsatzNeu;
      const kap = maKapazitaet(m), zut = maZuteilung("bereiter"), azBoxen = zut.filter((x) => x.m.name === "Alex").map((x) => x.i), beaBoxen = zut.filter((x) => x.m.name === "Bea").map((x) => x.i);
      const stall = maZuteilung("stall").filter((x) => x.m.name === "Alex").length;
      let zuf = Math.random; Math.random = () => 0.5; try { mitarbeiterTag(); } finally { Math.random = zuf; }
      const trainiert = spiel.boxen.slice(0, 6).filter((b) => b.pferd.trainHeute && b.pferd.trainHeute.tag === spiel.tag && (b.pferd.trainHeute.liste || []).some((e) => e.wer === "Alex")).length;
      const fehler = (() => { m.einsatz = "beruf"; let z = Math.random; Math.random = () => 0.01; let n = 0; try { spiel.boxen.slice(0, 6).forEach((b) => { b.pferd.trainHeute = null; b.pferd.energie = energieMax(b.pferd); }); mitarbeiterTag(); n = spiel.boxen.slice(0, 6).filter((b) => b.pferd.trainHeute && (b.pferd.trainHeute.liste || []).some((e) => e.wer === "Alex")).length; } finally { Math.random = z; } return n; })();
      const bea = spiel.mitarbeiter.find((x) => x.name === "Bea"); return { beaDa: maDa(bea), beaDarf: maDarf(bea, "training"), beaKap: maKapazitaet(bea), kap, azBoxen, beaBoxen, stall, trainiert, fehler, name: azubiBerufName(m) }; });
    ok(`halbe Kapazität des Bereiters (${T.kap} statt 3)`, T.kap === 2, JSON.stringify(T));
    ok(`Zuteilung: Alex bekommt eigene Pferde zum Trainieren (${T.azBoxen.join(",")}), Bea ihre (${T.beaBoxen.join(",")}), nicht dieselben`, T.azBoxen.length === 2 && T.beaBoxen.length >= 1 && !T.azBoxen.some((i) => T.beaBoxen.includes(i)), JSON.stringify(T));
    ok(`im Einsatz „Arbeit als …“ macht Alex keinen Stalldienst (${T.stall})`, T.stall === 0);
    ok(`nach dem Arbeitstag hat Alex ${T.trainiert} Pferde trainiert`, T.trainiert === 2, JSON.stringify(T));
    ok(`mit der Fehlerquote (Zufall unter 2 %) lässt er das Training aus (${T.fehler})`, T.fehler === 0);
    const J1 = await pg.evaluate(() => { const m = spiel.mitarbeiter.find((x) => x.name === "Alex"); m.ab = jzJetzt(); const a = [maKapazitaet(m), azubiBeruf(m), maZuteilung("bereiter").filter((x) => x.m.name === "Alex").length]; m.ab = jzJetzt() - 4; return a; });
    ok(`im 1. Ausbildungsjahr wirkt „Arbeit als …“ nicht (Kapazität ${J1[0]}, Beruf ${J1[1]}, Bereiter-Pferde ${J1[2]})`, J1[1] === null && J1[2] === 0);
    ok("Hinweisblase „Azubi im 2. Jahr“ vorhanden", await pg.evaluate(() => !!HINWEISE.azubiBeruf));
    ok("keine Seitenfehler", !errs.length, errs.join(" | "));
  } catch (e) { ok("Ablauf", false, e.message.split("\n")[0]); }
  console.log(L.join("\n")); await b.close(); process.exit(L.some((x) => x.startsWith("✗")) ? 1 : 0);
})();
