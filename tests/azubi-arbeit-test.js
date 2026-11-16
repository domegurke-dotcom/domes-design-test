// 19.11.2026 (Dome: „schau ob der Azubi auch richtig arbeitet“): angestellter Azubi über die ganze Ausbildung mit echten Nächten (naechsteNacht).
// 1. Jahr Stalldienst (füttert/mistet seine Boxen, vergisst anfangs öfter), ab dem 2. Jahr „Arbeit als Bereiter“ (trainiert mit halber Kraft),
// lernt in den Bereichen der Fachrichtung, Abschlussprüfung, Übernahme als Bereiter. Tempo 4 Tage je Jahreszeit, damit es schnell geht.
// Aufruf: NODE_PATH=<playwright> node tests/azubi-arbeit-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require("playwright"); const path = require("path");
const DATEI = process.env.MOTOR ? path.resolve(__dirname, "../../zuchtstall-app/motor/index.html") : path.resolve(__dirname, "../index.html");
const L = []; const ok = (n, c, x) => L.push((c ? "✓ " : "✗ ") + n + (c ? "" : " – " + (x || "")));
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on("pageerror", (e) => errs.push(e.message));
  try {
    await pg.goto("file:///" + DATEI.replace(/\\/g, "/")); await pg.waitForTimeout(600);
    await pg.click("#smNeu"); await pg.fill("#chName", "T"); await pg.click("#chLos"); await pg.waitForTimeout(250); await pg.click("#dlgKnoepfe button");
    await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "A"); await pg.click("#dlgKnoepfe button:first-child"); await pg.waitForTimeout(300);
    const R = await pg.evaluate(() => { const zu = () => { document.getElementById("dlg").hidden = true; }; zu(); speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = true; spiel.tempo = 4; spiel.geld = 500000;
      spiel.stallarten = ["ausbildung"]; spiel.anlage = spiel.anlage || {}; spiel.anlage.reitplatz = 1; spiel.einsteller = []; spiel.pensionAnfragen = [];
      const mk = (typ, name, x) => { const m = maErgaenzen({ id: "t-" + name, typ, name, gehalt: 400, wissen: {}, eig: [], zufr: 90, ...(x || {}) }); spiel.mitarbeiter.push(m); return m; };
      spiel.mitarbeiter = []; const ber = mk("bereiter", "Bea", { ab: jzJetzt() - 8, wissen: { ruecken: 70, verhalten: 70, huf: 50, futter: 50, klima: 40, haut: 40, zucht: 20 } });
      const az = mk("azubi", "Alex", { fach: "ausbildung", ab: jzJetzt(), ausbilder: ber.id, gehalt: 100, wissen: { futter: 5, klima: 5, haut: 5, huf: 5, ruecken: 5, verhalten: 5, zucht: 5 } }); azubiErgaenzen(az);
      for (let i = 0; i < Math.min(8, spiel.boxen.length); i++) { const P = neuesPferd({ rasse: "hannoveraner", geschlecht: "Wallach", alter: 7, name: "R" + i }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.reheOk = spiel.tag; P.pflege.impf = spiel.tag; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; P.energie = energieMax(P); }
      Object.assign(spiel.futter.lager, { heu: 5000, hafer: 500, mineral: 100, streuStroh: 5000, stroh: 2000 });
      const w0 = { ...az.wissen }, leer = () => ({ tage: 0, da: 0, boxen: 0, gefuettert: 0, vergessen: 0, trainiert: 0, zugeteilt: 0, maxZu: 0 }), J = { 1: leer(), 2: leer(), 3: leer() };
      let bestanden = null, typNachher = null, gesetzt = false, tage = 0, wissenJ2 = null;
      for (let d = 0; d < 4 * 4 * 3 + 12 && !typNachher; d++) {
        const A = spiel.mitarbeiter.find((x) => x.name === "Alex"); if (!A) break;
        const j = A.typ === "azubi" ? ausbildungsJahr(A) : 0;
        if (j >= 2 && !gesetzt && A.typ === "azubi") { A.einsatz = "beruf"; gesetzt = true; wissenJ2 = { ...A.wissen }; }   /* ab dem 2. Jahr: Einsatz „Arbeit als Bereiter“ (wie der Klick in der Mitarbeiterliste) */
        naechsteNacht(); zu(); tage++;
        const A2 = spiel.mitarbeiter.find((x) => x.name === "Alex"); if (!A2) break;
        if (A2.typ !== "azubi") { typNachher = A2.typ; break; }
        const j2 = ausbildungsJahr(A2), S = J[j2]; const da = !!S && maDa(A2); if (S) S.tage++; if (da) { S.da++; if (A2.einsatz === "beruf") S.daB = (S.daB || 0) + 1;   /* Tage ohne Alex (krank, Schule, Lehrgang) zählen nicht, versorgt wird trotzdem (sonst hungern die Pferde) */ const zuN = A2.einsatz === "beruf" ? maZuteilung("bereiter").filter((x) => x.m.id === A2.id).length : 0; S.zugeteilt += zuN; const beaDa = spiel.mitarbeiter.some((x) => x.name === "Bea" && maDa(x)); if (beaDa) S.maxZu = Math.max(S.maxZu, zuN); else S.maxUeber = Math.max(S.maxUeber || 0, zuN);   /* fehlt Bea, übernimmt Alex 1 Pferd mehr (Überstunden-Regel) */
        if (A2.einsatz !== "beruf") { const meine = maZuteilung("stall").filter((x) => x.m.id === A2.id).map((x) => x.i); S.boxen += meine.length; S.gefuettert += meine.filter((i) => spiel.boxen[i].krippeVoll).length; S.vergessen += ((spiel.maVergessen && spiel.maVergessen.tag === spiel.tag && spiel.maVergessen.liste) || []).filter((v) => meine.includes(v.i) && v.name === "Alex").length; }
        if (j2 >= 2) (window.__tag = window.__tag || []).push([spiel.tag, maDa(A2) ? "da" : (maUrlaub(A2) ? "Urlaub" : maSchule(A2) ? "Schule" : maLehrgang(A2) ? "Lehrgang" : maKrank(A2) ? "krank" : "weg"), A2.einsatz, maZuteilung("bereiter").filter((x) => x.m.id === A2.id).length, spiel.boxen.slice(0, 8).filter((bx) => bx.pferd && bx.pferd.trainHeute && bx.pferd.trainHeute.tag === spiel.tag && (bx.pferd.trainHeute.liste || []).some((e) => e.wer === "Alex")).length, spiel.boxen.slice(0, 8).filter((bx) => bx.pferd && bx.pferd.trainHeute && bx.pferd.trainHeute.tag === spiel.tag && (bx.pferd.trainHeute.liste || []).some((e) => e.wer === "Bea")).length].join(" "));
        S.trainiert += spiel.boxen.slice(0, 8).filter((bx) => bx.pferd && bx.pferd.trainHeute && bx.pferd.trainHeute.tag === spiel.tag && (bx.pferd.trainHeute.liste || []).some((e) => e.wer === "Alex")).length;
        }
        /* was Alex nicht schafft, macht der Spieler: alle Pferde versorgt, damit nichts anderes stört */
        spiel.boxen.slice(0, 8).forEach((bx) => { if (!bx.pferd || bx.tot) return; if (!bx.krippeVoll) { fuetternAusLager(bx, "du"); bx.krippeVoll = true; } bx.mistig = false; bx.mistStufe = 0; bx.wasserTag = spiel.tag; bx.pferd.pflege.impf = spiel.tag; bx.pferd.befunde = []; bx.pferd.boxenruhe = null; bx.pferd.dreck = { fell: 0, maehne: 0, seit: null }; bx.pferd.pflege.gesundheit = 100; bx.pferd.pflege.huf = spiel.tag;   /* der Spieler putzt täglich und hält die Pferde gesund – sonst schont das Personal kranke Pferde bzw. sie sterben an Vernachlässigung */   /* gesund halten: kranke Pferde schont das Personal, das soll den Test nicht stören */ });
        Object.assign(spiel.futter.lager, { heu: 5000, hafer: 500, mineral: 100, streuStroh: 5000, stroh: 2000 });   /* Lager voll halten (Futter verdirbt mit der Zeit) */
        for (const br of spiel.post) { if (!br.gelesen && /Abschlussprüfung bestanden/.test(br.betreff) && !bestanden) { bestanden = br.betreff; azubiUebernehmen(A2); } }
      }
      const A = spiel.mitarbeiter.find((x) => x.name === "Alex");
      return { tage, J, bestanden, typNachher: typNachher || (A && A.typ), w0, wJ2: wissenJ2, wEnde: A && A.wissen, kapJ1: 2, tagLog: window.__tag, briefe: spiel.post.filter((x) => /Alex/.test(x.betreff)).map((x) => x.betreff) }; });
    const J = R.J;
    ok(`1. Jahr Stalldienst: Alex hat an jedem Arbeitstag seine Boxen (${(J[1].boxen / Math.max(1, J[1].da)).toFixed(1)} im Schnitt, ${J[1].da} Arbeitstage)`, J[1].da >= 3 && J[1].boxen / J[1].da >= 1.5 && J[1].trainiert === 0, JSON.stringify(J[1]));
    ok(`1. Jahr: er vergisst manchmal etwas, aber selten (${J[1].vergessen} von ${J[1].boxen} Box-Tagen)`, J[1].vergessen <= J[1].boxen * 0.35, JSON.stringify(J[1]));
    ok(`2. Jahr „Arbeit als Bereiter“: höchstens 2 Pferde zugeteilt (halbe Kraft, max. ${J[2].maxZu}; fehlt Bea, ${J[2].maxUeber || 0} mit Überstunden), an Arbeitstagen ${(J[2].trainiert / Math.max(1, J[2].daB || 0)).toFixed(2)} trainiert, keinen Stalldienst`, J[2].da >= 3 && J[2].maxZu === 2 && (J[2].maxUeber || 0) <= 3 && J[2].trainiert / (J[2].daB || 1) >= 1.5 && J[2].trainiert >= J[2].zugeteilt * 0.85 && J[2].boxen <= 2, JSON.stringify(J[2]));
    ok(`3. Jahr ebenso (${(J[3].trainiert / Math.max(1, J[3].daB || 0)).toFixed(2)} Pferde je Arbeitstag)`, J[3].da >= 2 && J[3].maxZu <= 2 && (J[3].maxUeber || 0) <= 3 && J[3].trainiert / (J[3].daB || 1) >= 1.5, JSON.stringify(J[3]));
    const F = ["ruecken", "verhalten", "huf", "futter"], plus = (a, b) => F.map((k) => Math.round(((b || {})[k] || 0) - ((a || {})[k] || 0))), p1 = plus(R.w0, R.wJ2), p2 = plus(R.wJ2, R.wEnde);
    ok(`lernt in den Fachbereichen Rücken/Verhalten/Huf/Futter (1. Jahr +${p1.join("/")}, danach +${p2.join("/")})`, p1.some((x) => x > 0) && p2.slice(0, 2).every((x) => x > 0), JSON.stringify({ w0: R.w0, wJ2: R.wJ2, wEnde: R.wEnde }));
    ok(`Abschlussprüfung bestanden und als Bereiter übernommen (${R.bestanden} → ${R.typNachher}, ${R.tage} Tage)`, !!R.bestanden && R.typNachher === "bereiter", JSON.stringify({ bestanden: R.bestanden, typ: R.typNachher, tage: R.tage, briefe: R.briefe.slice(0, 8) }));
    ok("keine Seitenfehler", !errs.length, errs.join(" | "));
  } catch (e) { ok("Ablauf", false, e.message.split("\n")[0]); }
  console.log(L.join("\n")); await b.close(); process.exit(L.some((x) => x.startsWith("✗")) ? 1 : 0);
})();
