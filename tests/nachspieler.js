// Nachspieler = Testspieler „Nr. 4 – Dome“ (v948, Dome 8.11.2026): spielt eine Aufnahme nach, die Dome selbst im Spiel gemacht hat.
// NUR AUF DOMES ANWEISUNG STARTEN.
// Start: REC=<Aufnahme.json> [TEMPO=7] [MODUS=exp] [JAHRE=10] [DIAG=1] node tests/nachspieler.js
// Was er tut: neues Spiel (Pension, wie die Aufnahme), dann je Spieltag die Einträge der Aufnahme in der aufgezeichneten Reihenfolge:
//  - Entscheidungen „Aktion <Funktion>“ (bauen, umbauen, reparieren, Kredit, Futter kaufen, Pensionsanfrage annehmen, Pferd kaufen, verkaufen, Weide, Training, Behandlung, Tierarzt)
//  - Tagesarbeit (Füttern, Kraftfutter, Misten, Wasser) nach Boxnummer – nur, was Dome selbst getan hat; Vergessenes bleibt vergessen
//  - „Einstellung“ (Pensionspreise, Leistungen, Plätze, Bluttest, Weidegang/Auslauf/Huf-Auftrag je Box)
//  Einträge mit ma (Mitarbeiter), n (Nacht), v (verschachtelt) oder tu (Tutorial) werden NICHT nachgespielt – das macht das Spiel selbst.
//  Was er nicht kann, überspringt er und schreibt den Grund ins Protokoll. Die Aufnahme sollte direkt nach dem Spielstart beginnen (Tag 1).
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
const REC = process.env.REC; if (!REC) { console.log("REC=<Aufnahme.json> fehlt"); process.exit(1); }
const rec = JSON.parse(fs.readFileSync(REC, "utf8")); const alle = rec.eintraege || [];
const start = alle.find(e => e.a === "Aufnahme gestartet") || alle[0] || {}, neu = alle.find(e => e.a === "Neues Spiel") || {};
const TEMPO = +process.env.TEMPO || (start.tempo || neu.tempo) || 7, MODUS = process.env.MODUS || start.modus || neu.modus || "exp", DIAG = process.env.DIAG === "1";
const E = alle.filter(e => !e.tu && e.a !== "Aufnahme gestartet" && !e.ma && !e.n && !e.v);   // nur, was Dome selbst getan hat
const tMax = Math.max(...alle.map(e => e.t || 0), 1), t0 = start.t || 1;
const BIS = Math.min(tMax, process.env.JAHRE ? 1 + 4 * TEMPO * +process.env.JAHRE : tMax);
(async () => {
  const browser = await chromium.launch(); const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on("pageerror", e => fehler.push(e.message));
  await pg.goto("file://" + path.resolve(__dirname, "..", "index.html")); await pg.waitForTimeout(800);
  await pg.click("#smNeu"); await pg.fill("#chName", "Nachspieler"); await pg.click(`[data-stufe="${MODUS}"]`); await pg.click("#chLos"); await pg.waitForTimeout(300);
  await pg.click("#dlgKnoepfe button"); await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "Pension Nachspieler"); await pg.click("#dlgKnoepfe button:first-child"); await pg.waitForTimeout(500);
  await pg.evaluate(t => { spiel.tempo = t; speicherSperre = true; spiel.tippsAus = true; }, TEMPO);
  console.log(`===== Nachspieler: ${path.basename(REC)} – ${E.length} Einträge zum Nachspielen von ${alle.length}, Tempo ${TEMPO}, Modus ${MODUS}, Tage ${t0}–${BIS} =====`);
  if (t0 !== 1) console.log("WARNUNG: die Aufnahme beginnt erst an Tag " + t0 + " – der Hof kann vom Hof der Aufnahme abweichen");
  const stat = { ok: 0, skip: {}, log: [] };
  const tage = [...new Set(E.map(e => e.t))].sort((a, b) => a - b).filter(t => t <= BIS);
  let letzteJahr = 0, nachholen = [];
  while (true) {
    const tag = await pg.evaluate(() => spiel.tag);
    if (tag > BIS) break;
    const heute = nachholen.filter(e => tag - e.t <= 2 * TEMPO).concat(E.filter(e => e.t === tag)); nachholen = [];   // Pensionsanfragen, die an Domes Tag noch nicht da waren, werden in den nächsten Tagen noch einmal versucht
    if (heute.length) { const r = await pg.evaluate(([L, DIAG_]) => {
      const zu = () => { $("dlg").hidden = true; }, out = { ok: 0, skip: [], log: [], nach: [] }, knopf = () => { const b = $("dlg").hidden ? null : $("dlgKnoepfe").querySelector("button"); if (b) b.click(); };
      const boxN = n => spiel.boxen[n - 1], pf = n => { const b = boxN(n); return b && b.pferd && !b.tot ? b.pferd : null; };
      const skip = (e, grund) => out.skip.push(`${e.a}${e.bx ? " Box " + e.bx : ""}: ${grund}`), gut = e => { out.ok++; if (DIAG_) out.log.push("Tag " + spiel.tag + ": " + e.a + (e.bx ? " Box " + e.bx : "") + (e.k ? " " + JSON.stringify(e.ar).slice(0, 90) : "")); };
      const markt = () => { let M = {}; try { M = marktNeu(); } catch (er) { } return Object.values(M).filter(Array.isArray).flat().concat((() => { try { return marktpferde(); } catch (er) { return []; } })()); };
      const gebFinden = (g, fn) => { if (!g || !g.geb) return null; return gebaeude().filter(x => x.typ === g.geb && !x.abriss && !x.bau && (!fn || fn(x))).sort((a, b) => Math.abs((a.boxen || 0) - (g.boxen || 0)) - Math.abs((b.boxen || 0) - (g.boxen || 0)))[0] || null; };
      L.forEach(e => { try {
        if (e.ok === 0) { skip(e, "ging bei dir selbst nicht"); return; }
        const A = e.ar || [];
        if (e.a === "Füttern selbst") { const b = boxN(e.bx); if (!b || !b.pferd) return skip(e, "keine Box/kein Pferd"); aktBox = e.bx - 1; if (!b.pferd.weide && !b.krippeVoll) { if (fuetternAusLager(b, "du", "rau")) b.krippeVoll = true; } return gut(e); }
        if (e.a === "Kraftfutter selbst") { const b = boxN(e.bx); if (!b || !b.pferd) return skip(e, "keine Box/kein Pferd"); aktBox = e.bx - 1; if (fuetternAusLager(b, "du", "kraft")) b.kraftVoll = true; return gut(e); }
        if (e.a === "Misten selbst") { const b = boxN(e.bx); if (!b || !b.pferd) return skip(e, "keine Box/kein Pferd"); b.mistig = false; b.mistStufe = 0; return gut(e); }
        if (e.a === "Wasser selbst") { const b = boxN(e.bx); if (!b || !b.pferd) return skip(e, "keine Box/kein Pferd"); b.wasserTag = spiel.tag; return gut(e); }
        if (e.a === "Einstellung") { const R = pensionRegeln();
          if (e.pension) { Object.keys(e.pension.preis || {}).forEach(s => { R.preis[s] = e.pension.preis[s]; }); const an = new Set(e.pension.leist || []); Object.keys(PENSION_LEISTUNG).forEach(k => { if (an.has(k)) { if (leistungMoeglich(k)) R.leistungen[k] = true; else out.skip.push("Einstellung Leistung " + k + ": noch nicht möglich"); } else delete R.leistungen[k]; }); if (e.pension.max != null) R.max = e.pension.max; if (e.pension.bluttest) R.bluttest = e.pension.bluttest; }
          Object.keys(e.boxen || {}).forEach(n => { const p = pf(+n); if (!p || fremd(p)) return out.skip.push("Einstellung Box " + n + ": kein eigenes Pferd"); const s = e.boxen[n]; p.weidegang = s.weidegang || p.weidegang; if (s.auslauf) p.auslauf = s.auslauf; else delete p.auslauf; if (s.ziel) p.auslaufZiel = s.ziel; if (s.huf) p.hufAuftrag = s.huf; });
          return gut(e); }
        if (!e.k) { if (/^(Abgabe|Verkauf|Turnier genannt|Bedeckung|Bauland|Kredit|Kauf:|Reitunterricht|Pferd umgestellt|Whiteboard|Klinik|Tierarzt: Erlösen|Waschen selbst|Abtrocknen selbst|Solarium selbst|Beine waschen|Fohlen Duschen|Land)/.test(e.a)) return out.skip.push(`${e.a}: nicht nachspielbar (Lücke)`); return; }
        if (e.k === "ausbilderschein") { if (spiel.ausbilderschein) return skip(e, "schon gemacht"); if ((spiel.geld || 0) < AUSBILDERSCHEIN) return skip(e, "zu wenig Geld für den Ausbilderschein"); buchen(-AUSBILDERSCHEIN, "Ausbilderschein (Kurs)"); spiel.ausbilderschein = true; return gut(e); }
        if (e.k === "mitarbeiterEinstellen") { mitarbeiterDialog(A[0]); const bs = [...document.querySelectorAll("[data-einst]")], b = (e.fach && bs.find(x => x.dataset.fach === e.fach)) || bs[0]; if (!b) { zu(); return skip(e, "kein Bewerber " + A[0]); } b.click(); zu(); return gut(e); }
        if (e.k === "mitarbeiterKuendigen") { mitarbeiterDialog(A[0]); const b = document.querySelector("[data-kuend]"); if (!b) { zu(); return skip(e, "kein Mitarbeiter " + A[0] + " zum Kündigen"); } b.click(); zu(); return gut(e); }
        if (e.k === "bauStarten") { const r = bauStarten(A[0], A[1] || 1, A[2] || {}); if (r) planAutoSetzen(); zu(); return r ? gut(e) : skip(e, "bauStarten " + A[0] + " nicht möglich (Geld/Platz/Sperre)"); }
        if (e.k === "umbauStarten") { let g = gebFinden(A[0], x => (x.stufe || 1) === (A[0].stufe || 1)); if (!g) return skip(e, "Gebäude " + (A[0] && A[0].geb) + " Stufe " + (A[0] && A[0].stufe) + " nicht da"); let z = g; if (A[0].boxen && g.boxen > A[0].boxen) z = gebTeilen(g, A[0].boxen); const r = umbauStarten(z); if (!r && z !== g) gebZusammen(z, g); zu(); return r ? gut(e) : skip(e, "Umbau nicht möglich"); }
        if (e.k === "reparierenAusfuehren") { const g = gebFinden(A[0]); if (!g) return skip(e, "Gebäude nicht da"); const k = reparaturPreis(g); if (!(k > 0) || (spiel.geld || 0) < k) return skip(e, "Reparatur nicht nötig/zu wenig Geld"); reparierenAusfuehren(g, k); zu(); return gut(e); }
        if (e.k === "kreditNeu") { const r = kreditNeu(A[0], A[1], A[2]); zu(); return r === false ? skip(e, "Kredit abgelehnt") : gut(e); }
        if (e.k === "futterKaufen") { if ((spiel.geld || 0) < 1) return skip(e, "kein Geld"); const r = futterKaufen(A[0], A[1]); zu(); return r === false ? skip(e, "Futter kaufen ging nicht") : gut(e); }
        if (e.k === "pensionAnnehmen") { const w = (spiel.pensionAnfragen || []).filter(a => !a.angenommen), pg = A[0] && A[0].pferd, a = w.find(x => pg && x.pferd && x.pferd.geschlecht === pg.g && x.pferd.rasse === pg.rasse) || w.find(x => pg && x.pferd && x.pferd.geschlecht === pg.g) || w[0]; if (!a) { out.nach.push(e); return skip(e, "keine offene Pensionsanfrage (später noch einmal versucht)"); } const r = pensionAnnehmen(a); zu(); return r === false ? skip(e, "Anfrage ließ sich nicht annehmen") : gut(e); }
        if (e.k === "pferdEinstellen") { const h0 = A[0] || {}, geld = spiel.geld || 0; const L2 = markt().filter(h => h && h.rasse === h0.rasse && (!h0.g || h.geschlecht === h0.g) && (h.preis || 0) <= geld).sort((a, b) => Math.abs(alterJahre(a) - (h0.alter || 0)) - Math.abs(alterJahre(b) - (h0.alter || 0)) || Math.abs((a.preis || 0) - A[1]) - Math.abs((b.preis || 0) - A[1])); if (!L2.length) return skip(e, `kein passendes Pferd (${h0.rasse} ${h0.g || ""} ~${h0.alter} J.) auf dem Markt oder zu wenig Geld`); pferdEinstellen(L2[0], L2[0].preis || A[1] || 0, A[2] || "Pferdemarkt"); zu(); return gut(e); }
        if (e.k === "aufWeide") { const p = pf(A[0] && A[0].box); if (!p) return skip(e, "kein Pferd in Box " + (A[0] && A[0].box)); const w = weiden().find(x => x.wid === A[3]) || weideWahl(p); if (!w) return skip(e, "keine Weide"); aufWeide(p, boxN(A[0].box), null, w.wid); zu(); return gut(e); }
        if (e.k === "rausAusBox") { const b = boxN(A[0] && A[0].box); if (!b || !b.pferd) return skip(e, "keine Box"); rausAusBox(b); return gut(e); }
        if (e.k === "zurueckInBox") { const b = boxN(A[0] && A[0].box); if (!b || !b.pferd) return skip(e, "keine Box"); zurueckInBox(b); return gut(e); }
        if (e.k === "putzen") { const p = pf(A[0] && A[0].box); if (!p) return skip(e, "kein Pferd in Box " + (A[0] && A[0].box)); putzen(p, A[1]); return gut(e); }
        if (e.k === "behandeln") { const p = pf(A[0] && A[0].box); if (!p) return skip(e, "kein Pferd"); behandeln(p, A[1], A[2], "du"); return gut(e); }
        if (e.k === "tierarztBesuch") { const p = pf(A[0] && A[0].box); if (!p) return skip(e, "kein Pferd"); tierarztBesuch(p, boxN(A[0].box), () => {}); knopf(); zu(); return gut(e); }
        if (e.k === "trainieren") { const p = pf(A[0] && A[0].box); if (!p) return skip(e, "kein Pferd"); const r = trainieren(p, A[1], A[2], null); zu(); return r === false ? skip(e, "Training " + A[1] + " ging nicht") : gut(e); }
        if (e.k === "verkaufen") { const p = pf(A[0] && A[0].box); if (!p) return skip(e, "kein Pferd in Box " + (A[0] && A[0].box)); const b = boxVon(p); if (abgabeSperre(p, b, true) || angebotVon(p)) return skip(e, "Verkauf gesperrt/läuft schon"); verkaufDialog(p, () => {}); const fp = $("festPreis"); if (!fp) { zu(); return skip(e, "Verkaufsfenster nicht da"); } if (e.art === "auktion") { const b2 = $("auktionLos"); if (b2) b2.click(); } else { fp.value = Math.round(verkaufsWert(p) * (e.proz || 100) / 100 / 50) * 50; $("festLos").click(); } zu(); return gut(e); }
        skip(e, "Aktion unbekannt");
      } catch (er) { skip(e, "FEHLER " + er.message); } });
      zu(); return out; }, [heute, DIAG]).catch(er => ({ ok: 0, skip: ["Auswertung abgebrochen: " + er.message], log: [] }));
      stat.ok += r.ok; nachholen = r.nach || []; r.skip.forEach(s => { const k = s.replace(/\d+/g, "#").slice(0, 110); stat.skip[k] = (stat.skip[k] || 0) + 1; }); if (DIAG) r.log.forEach(l => console.log("  " + l)); }
    // Tag beenden: bis zum nächsten Tag mit Einträgen (oder bis zum Ende) durchlaufen
    const naechst = tage.find(t => t > tag), ziel = Math.min(nachholen.length ? tag + 1 : (naechst || BIS + 1), BIS + 1);
    const res = await pg.evaluate(z => { let n = 0; while (spiel.tag < z && !spiel.verloren) { naechsteNacht(); $("dlg").hidden = true; n++; if (n > 5000) break; } return { tag: spiel.tag, verloren: !!spiel.verloren, geld: Math.round(spiel.geld || 0) }; }, ziel);
    const j = Math.floor((res.tag - 1) / (4 * TEMPO)) + 1; if (j !== letzteJahr) { letzteJahr = j; const s = await pg.evaluate(() => ({ geld: Math.round(spiel.geld || 0), kredit: Math.round(kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rest : 0), 0)), boxen: spiel.boxen.length, einst: einstellerListe().filter(e => !e.art).length, eigene: spiel.boxen.filter(b => b.pferd && !fremd(b.pferd) && !b.tot).length })); console.log(`Jahr ${j} (Tag ${res.tag}): Kasse ${s.geld} €, Kredite ${s.kredit} €, ${s.boxen} Boxen, ${s.einst} Einsteller, ${s.eigene} eigene Pferde`); }
    if (res.verloren) { console.log("PLEITE an Tag " + res.tag); break; }
    if (res.tag > BIS) break;
  }
  const ende = await pg.evaluate(() => ({ tag: spiel.tag, geld: Math.round(spiel.geld || 0), kredit: Math.round(kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rest : 0), 0)), verloren: !!spiel.verloren }));
  const zust = alle.filter(e => e.a === "Zustand" && e.t <= BIS).pop();
  console.log(`\nERGEBNIS: nachgespielt ${stat.ok} von ${E.length} Einträgen; Ende Tag ${ende.tag}: Kasse ${ende.geld} €, Kredite ${ende.kredit} €${ende.verloren ? " – PLEITE" : ""}${zust && zust.geld != null ? ` (bei dir am Ende: Kasse ${zust.geld} €)` : ""}`);
  const sk = Object.entries(stat.skip).sort((a, b) => b[1] - a[1]); console.log("ÜBERSPRUNGEN (" + sk.reduce((a, b) => a + b[1], 0) + "):"); sk.slice(0, 25).forEach(([k, n]) => console.log(`  ${n}× ${k}`));
  console.log("Seitenfehler: " + (fehler.length ? fehler.join(" | ") : "keine")); await browser.close();
})();
