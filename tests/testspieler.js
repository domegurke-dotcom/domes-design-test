// Testspieler (Dome, v377/v380): drei Spielertypen spielen je 10 Jahre ab einem neuen Spiel – so logisch wie möglich wie ein echter Spieler.
// NUR AUF DOMES ANWEISUNG STARTEN – kostet Volumen.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/testspieler.js [1|2|3] [Jahre]   (ohne Zahl: alle drei, Standard 10 Jahre)
// Ziel: 2 Höfe – Pensionsstall mit 20 Boxen und Zuchtstall mit 10 eigenen Pferden – und am Ende keine Kredite mehr.
// Grundlage ist Domes Strategie (eine Stute, jedes Jahr ein Fohlen, Fohlen bis 3 Jahre in die Aufzuchtstation, dann verkaufen …),
// aber jeder Spielertyp weicht auf seine Art davon ab (siehe STRATEGIE unten).
const { chromium } = require("playwright");
const path = require("path");

// Fehlerquoten (Anteil der Tage, an denen etwas vergessen wird) und Strategie je Spielertyp
const SPIELER = {
  1: { name: "Nr. 1 – Anfänger (kennt Spiel und Pferde nicht, viele Fehler, befolgt die Tipps stark)", stufe: "anf",
       fuettern: 0.3, wasser: 0.35, misten: 0.45, putzen: 0.7, postSpaet: 0.5, anfrageAnnehmen: 1, futterErstWennLeer: true, tierarzt: 0.35, weide: 0.5, tippsBefolgen: 0.9,
       // Strategie: hält sich an den Start-Tipp, behält Fohlen aus Liebe zu lange, nimmt immer den günstigsten Hengst, verkauft Stuten nie, tilgt kaum
       leistAb: 0, leistungen: ["putzen"], stutenMax: 1, wallachMax: 3, wallachLust: 0.75, kaufAbstand: 8, puffer: 4000, bauAbstand: 8, trainAnteil: 0.2, handelMax: 0, hengstTeuerAb: Infinity, fohlenFruehVerkaufenUnter: 300, stuteVerkaufenNach: 99, hengsteBehalten: false, bauReserve: 4000, tilgenAb: 20000, turniere: false, bauKredit: true, kreditMax: 20000, stuteAbBoxen: 0, bauWennFrei: 0,
       // Bauen: wenig und spät – repariert erst, wenn es schlimm ist; Stall nur bis 12 Boxen, ab Jahr 3 ein Reitplatz, kein Umbau
       maxBoxen: 12, reparaturUnter: 40, neubau: ['reitplatz'], umbau: [] },
  2: { name: "Nr. 2 – Fortgeschritten (Spiel ein paar Mal gespielt, etwas Pferdeahnung, einige Fehler, befolgt Tipps teilweise)", stufe: "fort",
       fuettern: 0.1, wasser: 0.12, misten: 0.15, putzen: 0.4, postSpaet: 0.15, anfrageAnnehmen: 1, futterErstWennLeer: true, tierarzt: 0.7, weide: 0.7, tippsBefolgen: 0.5,
       // Strategie: Domes Weg fast genau – eine Stute, Hengst nach Kontostand, Fohlen früher verkaufen, wenn das Geld knapp ist, Stute nach dem 3. Fohlen verkaufen
       leistAb: 0, leistungen: ["putzen", "decke", "medizin", "einstreu"], preisAbstand: 4, preisAuslastung: 0.8, preisZufr: 65, stutenMax: 3, wallachMax: 2, wallachLust: 0.4, kaufAbstand: 6, puffer: 3000, bauAbstand: 6, trainAnteil: 0.5, handelMax: 0, hengstTeuerAb: 8000, fohlenFruehVerkaufenUnter: 1500, stuteVerkaufenNach: 1, hengsteBehalten: true, bauReserve: 1500, tilgenAb: 6000, turniere: true, bauKredit: true, kreditMax: 22000, stuteAbBoxen: 0, bauWennFrei: 1,
       // Bauen: Stall bis 20 Boxen, Reitplatz ab Jahr 3, Roundpen ab Jahr 5, Boxenstall-Umbau auf Stufe 2 ab Jahr 4, repariert bei unter 60
       maxBoxen: 20, reparaturUnter: 60, neubau: ['reitplatz', 'roundpen'], umbau: [['stall', 2]] },
  3: { name: "Nr. 3 – Experte (Spiel oft gespielt, kennt sich gut aus, wenige Fehler, macht eher sein Ding)", stufe: "exp",
       fuettern: 0, wasser: 0, misten: 0, putzen: 0, postSpaet: 0.02, anfrageAnnehmen: 1, futterErstWennLeer: false, tierarzt: 0.95, weide: 0.95, tippsBefolgen: 0.1,
       // Strategie: baut zuerst die Pension aus (sichere Einnahme), zwei Stuten, teurer Hengst ab 6.000 €, verkauft Fohlen gezielt nach der Fohlenschau, tilgt früh für den 2. Hof
       leistAb: 0, leistungen: ["putzen", "decke", "medizin", "einstreu", "waschen", "bewegen", "solarium", "aqua"], zufriedenPflege: true, reparaturJanuar: true, weidePflege: true, zweiterHof: false, umbauKreditAb: 6, pflegerAb: 4, anbauSchritt: 2, azubi: true, einBauProJahr: true, hausturnier: true, preisAbstand: 2, preisAuslastung: 0.75, preisZufr: 55, stutenMax: 4, wallachMax: 0, wallachLust: 0, kaufAbstand: 4, puffer: 2000, bauAbstand: 4, trainAnteil: 0.85, handelMax: 4, hengstTeuerAb: 6000, fohlenFruehVerkaufenUnter: 2500, stuteVerkaufenNach: 3, hengsteBehalten: false, bauReserve: 800, tilgenAb: 4000, turniere: true, bauKredit: true, kreditMax: 24000, stuteAbBoxen: 12, bauWennFrei: 2,
       // Bauen: Stall bis 20 Boxen, früh Reitplatz (Jahr 2), Waschplatz (3), Roundpen (3), Umbau auf Stufe 2 ab Jahr 3, auf Stufe 3 ab Jahr 6, repariert schon bei unter 75
       maxBoxen: 20, reparaturUnter: 75, spaeter: ["waschplatz", "solarium", "aqua"], zweiterReitplatz: true, neubau: ['reitplatz', 'roundpen', 'sandpaddock'], umbau: [['stall', 2], ['stall', 3], ['reitplatz', 2]] },
};

async function spiele(nr, jahre) {
  const S = SPIELER[nr]; S.diag = process.env.DIAG === "1";   // DIAG=1: ausführliches Protokoll
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on("pageerror", e => fehler.push(e.message));
  await pg.goto("file://" + path.resolve(__dirname, "..", "index.html")); await pg.waitForTimeout(800);
  await pg.click("#smNeu"); await pg.fill("#chName", "Testspieler " + nr);
  await pg.click(`[data-stufe="${process.env.MODUS || S.stufe}"]`);   // MODUS=exp: alle spielen im Experten-Modus
   await pg.click("#chLos"); await pg.waitForTimeout(300);
  await pg.click("#dlgKnoepfe button"); await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "Pension " + nr); await pg.click("#dlgKnoepfe button:first-child");
  await pg.waitForTimeout(500);
  if (+process.env.TEMPO) await pg.evaluate(t => { spiel.tempo = t; }, +process.env.TEMPO);   // TEMPO=4|7|10: Tage pro Jahreszeit (Start Tag 1 = Frühling, kein Datumsversatz)

  console.log(`\n===== ${S.name} =====`);
  for (let j = 1; j <= jahre; j++) {
    const r = await pg.evaluate(([S, j]) => { const T = (window.__T = window.__T || { S, log: [], tipps: [], befolgt: [], fohlenVerkauft: 0, fohlenErloes: 0, verkauft: [], ziel: null, mahn: 0, pleite: false });
      const zuf = Math.random, zu = () => { $("dlg").hidden = true; }, Sx = T.S;
      if (Sx.fb == null) { Sx.fb = Sx.fuettern; Sx.mb = Sx.misten; } { const lern = Math.max(0.25, 1 - 0.12 * (j - 1)); Sx.fuettern = Sx.fb * lern; Sx.misten = Sx.mb * lern; }   // Dome 6.11.: alle werden beim Füttern und Misten Jahr für Jahr besser (Vergessen-Quote −12 % je Jahr, höchstens auf ein Viertel)
      const merk = t => { T.log.push(`J${j} T${spiel.tag}: ${t}`); };
      if (!window.__buchenW) { const o = window.buchen; window.buchen = function (b, t) { try { const T2 = window.__T, txt = String(t || ""); T2.ring = T2.ring || []; T2.ring.push({ t: txt, b, tag: spiel.tag }); if (T2.ring.length > 300) T2.ring.shift(); T2.namen = T2.namen || {}; T2.buch = T2.buch || {};
        Object.keys(T2.namen).forEach(n => { if (txt.includes(n) && !/^Verkauf/.test(txt)) T2.buch[n].push({ t: txt, b, tag: spiel.tag }); });
        if (/^Verkauf/.test(txt) && b > 0) { const n = txt.split(": ").pop(), L = (T2.buch || {})[n] || [], ek = -L.filter(x => x.b < 0 && /gekauft|Kauf|Auktion|Verkaufsrennen|Pferdemarkt|Händler|Gestüt|AKU|Einkauf/i.test(x.t)).reduce((a, x) => a + x.b, 0), ko = -L.filter(x => x.b < 0 && !/gekauft|Kauf|Auktion|Verkaufsrennen|Pferdemarkt|Händler|Gestüt|AKU|Einkauf/i.test(x.t)).reduce((a, x) => a + x.b, 0);
          (T2.handelBuch = T2.handelBuch || []).push(`Tag ${spiel.tag}: ${n} verkauft für ${Math.round(b)} € · Einkauf ${Math.round(ek)} € · Kosten ${Math.round(ko)} € (${L.filter(x => x.b < 0 && !/gekauft|Kauf|Auktion|Verkaufsrennen|Pferdemarkt|Händler|Gestüt|AKU|Einkauf/i.test(x.t)).map(x => x.t + " " + Math.round(-x.b)).join(", ") || "–"}) → ${Math.round(b - ek - ko) >= 0 ? "Gewinn" : "Verlust"} ${Math.round(b - ek - ko)} €`); } } catch (e) { } return o.apply(this, arguments); }; window.__buchenW = 1; }
      const knopf = () => { const b = $("dlg").hidden ? null : $("dlgKnoepfe").querySelector("button"); if (b) b.click(); };
      // ---------- Tipps ansehen und (je nach Typ) befolgen ----------
      const tippsMerken = () => { const t = $("dlg").hidden ? "" : $("dlgInhalt").innerText.split("\n")[0]; if (!t.startsWith("💡") || T.tipps.includes(t)) return; T.tipps.push(t);
        if (zuf() > Sx.tippsBefolgen) return; T.befolgt.push(t); const halb = k => { Sx[k] = Sx[k] / 2; };
        if (t.includes("2 Jahre")) { Sx.anfrageAnnehmen = Math.max(Sx.anfrageAnnehmen, 0.95); Sx.futterErstWennLeer = false; }
        if (t.includes("Box")) { halb("fuettern"); halb("wasser"); halb("misten"); } if (t.includes("Putzen")) halb("putzen");
        if (t.includes("Post")) halb("postSpaet"); if (t.includes("krank") || t.includes("Tierarzt")) Sx.tierarzt = Math.min(1, Sx.tierarzt + 0.3);
        if (t.includes("Futterkammer")) Sx.futterErstWennLeer = false; if (t.includes("Weide")) Sx.weide = Math.min(1, Sx.weide + 0.3); if (t.includes("knapp")) Sx.bauReserve += 1500; };
      const ansichten = [() => zeigeSchirm(null), () => zeigeMarkt(), () => zeigeHof("hof"), () => zeigeHof("post"), () => zeigeHof("mitarbeiter"), () => { aktenModus = "pflege"; zeigeSchirm(null); }, () => { aktenModus = "steckbrief"; zeigeSchirm(null); }];
      const tippRunde = () => { for (const a of ansichten) { try { a(); for (let k = 0; k < 3; k++) { tippPruefen(); tippsMerken(); zu(); } } catch (e) { } } zeigeSchirm(null); };
      // ---------- Hilfen ----------
      const eigene = () => eigenePferdeHof();
      const pferdeZahl = () => spiel.boxen.filter(b => b.pferd && !b.tot).length;
      const kreditSumme = () => { let s = 0; jedenHof(() => { s += kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rest : 0), 0); }); return Math.round(s); };
      const reserve = () => kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rate : 0), 0) + 150 * Math.max(1, eigene().length) + 300;   // Rate + Futter/Tierarzt-Puffer für die eigenen Pferde
      const istZucht = () => spiel.hof && spiel.hof.art === "zucht";
      const gesundMachen = p => { const b = boxVon(p); if (b && befundListe(p).some(x => x.bemerkt) && (spiel.geld || 0) > TIERARZT_BESUCH + 200) { try { tierarztBesuch(p, b, () => {}); } catch (e) { } zu(); } };
      const verkaufen = (p, grund, fa = 1) => { const b = boxVon(p); if (!b || abgabeSperre(p, b, true) || angebotVon(p)) return false;
        if ((p.pflege.gesundheit || 0) < 85 && befundListe(p).length) { gesundMachen(p); return false; }   // erst gesund machen – bester Preis
        try { verkaufDialog(p, () => {}); const fp = $("festPreis"); if (!fp) { zu(); return false; } fp.value = Math.round(verkaufsWert(p) * fa / 50) * 50; $("festLos").click(); zu(); } catch (e) { zu(); return false; }
        T.verkauft.push(`${p.name} (${alterText(p)}, ${grund}, Wert ${fmt(verkaufsWert(p))})`); return true; };
      const anfZaehl = (k, a) => { T.anf = T.anf || {}; T.anf[j] = T.anf[j] || {}; T.anfSeen = T.anfSeen || {}; const id = k + a.aid; if (T.anfSeen[id]) return; T.anfSeen[id] = 1; T.anf[j][k] = (T.anf[j][k] || 0) + 1; };   // Diagnose: wie viele Pensionsanfragen kamen, wie viele wurden angenommen, warum nicht
      // ---------- Post ----------
      const post = () => { if (zuf() < Sx.postSpaet) return;
        (spiel.rechnungen || []).slice().forEach(r => { if ((spiel.geld || 0) >= r.betrag) { if (r.stufe) T.mahn++; rechnungZahlen(r.id); zu(); } });
        kredite().forEach(k => { if ((k.offen || []).length) { kreditOffenZahlen(k.id); zu(); } });
        if (!istZucht()) (spiel.pensionAnfragen || []).filter(a => { const h = Sx.zufriedenPflege && a.pferd && a.pferd.geschlecht === "Hengst"; if (!a.angenommen && h) anfZaehl("Hengst abgelehnt", a); return !a.angenommen && !h; }).forEach(a => { if (zuf() < Sx.anfrageAnnehmen) { const rs = pensionAnnehmen(a); anfZaehl(rs ? rs.slice(0, 45) : "angenommen", a); if (!rs) (spiel.post || []).forEach(br => { if (br.aktion && br.aktion.aid === a.aid) br.aktion.antwort = "ja"; }); } });
        (spiel.post || []).forEach(b => { b.gelesen = true; }); };
      // ---------- Futter ----------
      const futter = () => { const F = futterkammer(), bedarf = {};   // alles, was in den Futterplänen steht (Heu, Luzerne, Aufzuchtfutter …), für eine Jahreszeit auf Vorrat
        spiel.boxen.forEach(b => { if (!b.pferd || b.tot) return; [b.pferd, b.fohlen].filter(Boolean).forEach(p => { try { Object.entries(tagesRation(p, b, false).kg).forEach(([k, x]) => { if (x > 0 && FUTTER[k] && !FUTTER[k].stueck) bedarf[k] = (bedarf[k] || 0) + x; }); } catch (e) { } }); });
        const unterwegs = k => (F.liefer || []).filter(x => x.k === k).reduce((a, x) => a + x.menge, 0);
        Object.entries(bedarf).forEach(([k, x]) => { const hat = (F.lager[k] || 0) + unterwegs(k), soll = x * tpj();
          if (Sx.futterErstWennLeer ? hat < x * 1.5 : hat < soll) { const menge = Math.min(Math.ceil(soll * (Sx.futterErstWennLeer ? 1 : 2)), Math.floor(F.lagerMax - lagerBelegt() - Object.keys(bedarf).reduce((a, q) => a + unterwegs(q), 0)));
            if (menge > 0 && (spiel.geld || 0) > menge * FUTTER[k].preis) futterKaufen(k, menge); } });
        const ap = apotheke(); Object.keys(APO).filter(k => APO[k].frei).forEach(k => { if (!(ap[k] > 0) && (spiel.geld || 0) > 500 && eigene().some(p => (p.behPlan || []).includes(k) || befundListe(p).some(b => (PLAN[b.art] || []).includes(k)))) { ap[k] = (ap[k] || 0) + 5; buchen(-(APO[k].preis || 10) * 5, "Stallapotheke"); } }); };
      // ---------- Stallarbeit (was Mitarbeiter schon gemacht haben, bleibt erledigt) ----------
      // Weidepflege (Dome 7.11., Experte): Pferde, die sich nicht vertragen, kommen auf verschiedene Weiden; im Herbst geht jedes Pferd nur jeden 2. Tag raus (Weide schonen)
      const streitet = (p, q) => { const x = (spiel.herdePaare || {})[[p.id, q.id].sort().join("|")]; return !!x && (x.streit || 0) >= 3 && spiel.tag - (x.zuletzt || 0) <= tpj(); };
      const wWahl = (p, i) => { if (!Sx.weidePflege) return weideWahl(p); if (datum().s === 2 && (spiel.tag + i) % 2 === 0) return null; const ok = w => !w.gesperrt && w.matsch < GRAS.matschAb && w.gras >= GRAS.wenig && !weidePferde(w).some(q => q !== p && streitet(p, q)); const sc = w => weidePferde(w).reduce((a, q) => a + (q !== p ? (((spiel.herdePaare || {})[[p.id, q.id].sort().join("|")] || {}).streit || 0) : 0), 0);   // je weniger Streit mit den Pferden dort, desto besser (Dome: andere Zusammensetzungen probieren, nicht für jedes Pferd eine eigene Weide)
        const w0 = weideWahl(p); if (w0 && ok(w0) && sc(w0) === 0) return w0; return weiden().filter(w => !w.gesperrt && !w.wiese && w.ha > 0 && ok(w)).sort((a, b) => sc(a) - sc(b) || b.gras - a.gras)[0] || null; };
      const stallarbeit = () => { const s = datum().s, weideOk = s !== 3 && !(s === 2 && datum().t === tpj());
        const zfBox = i => { const q = spiel.boxen[i].pferd, e = q && fremd(q) ? einstellerVon(q) : null; return e ? e.zufr : (q && !fremd(q) ? -1 : 100); }, selbst = new Set(spiel.boxen.map((b, i) => (b.pferd && !b.tot ? i : -1)).filter(i => i >= 0).sort((a, b) => Sx.zufriedenPflege ? zfBox(a) - zfBox(b) : 0).slice(0, Math.max(3, pferdeZahl() - 3 * (spiel.mitarbeiter || []).filter(m => m.typ === "stallbursche" && m.bis == null).length - 2 * (spiel.mitarbeiter || []).filter(m => m.typ === "azubi" && m.bis == null && maAktiv(m)).length)));   // der Spieler versorgt nur 3 Pferde selbst, den Rest machen Angestellte (Dome 6.11.)
        spiel.boxen.forEach((box, i) => { const p = box.pferd; if (!p || box.tot || p.klinik || p.turnier || !selbst.has(i)) return; aktBox = i;
          if (!p.weide && !box.krippeVoll && zuf() > Sx.fuettern) { if (fuetternAusLager(box, "du", "rau")) box.krippeVoll = true; if (kraftNoetig(p, box)) { fuetternAusLager(box, "du", "kraft"); box.kraftVoll = true; } }   // erst füttern (Heu geht mit raus)
          if (box.mistig && zuf() > Sx.misten) { box.mistig = false; box.mistStufe = 0; }
          if (!fremd(p) && !p.weide && !p.auslauf && weideOk && !reheGefaehrdet(p) && !p.boxenruhe && !p.quarantaene && zuf() < Sx.weide) { const w = wWahl(p, i); if (w && !grasWenig(p)) { try { aufWeide(p, box, null, w.wid); if (!wanneVoll(wanneOrt(p))) wannenFuellen(); } catch (e) { } } }
          if (Sx.weidePflege && !p.weide && !p.paddock && s !== 3 && (reheGefaehrdet(p) || p.auslauf === "paddock") && !p.boxenruhe && !p.quarantaene && paddocks().length) { const pg = paddockFrei(p); if (pg) { try { rausAusBox(box); p.paddock = { seit: spiel.tag, pid: pg.gid }; p.paddockZuletzt = spiel.tag; p.boxTage = 0; } catch (er) { } } }
          if (box.wasserTag !== spiel.tag && zuf() > Sx.wasser) box.wasserTag = spiel.tag;
          if (!fremd(p) && zuf() > Sx.putzen) { putzen(p, "buerste"); putzen(p, "kamm"); }
          if (fremd(p)) { const e = einstellerVon(p); if (e && !e.art) try { pensionAufgaben(e, box).filter(x => !x.ok && zuf() > Sx.fuettern).forEach(x => {   // gebuchte Pensionsleistungen erledigen
              if (x.k === "weide" && weideOk && !reheGefaehrdet(p)) { const w = wWahl(p, i); if (w) { aufWeide(p, box, null, w.wid); if (!wanneVoll(wanneOrt(p))) wannenFuellen(); } }
              if (x.k === "putzen") { putzen(p, "buerste"); putzen(p, "kamm"); p.ausgekratzt = spiel.tag; } if (x.k === "pfleger") p.ausgekratzt = spiel.tag; if (x.k === "decke") e.decke = spiel.tag;
              if (x.k === "futter") { const WF = besitzerFutter(p, box); if (WF) p.futterplan = JSON.parse(JSON.stringify(WF)); }
              if (x.k === "medizin") befundListe(p).filter(b => b.diagnose).forEach(b => (PLAN[b.art] || []).forEach(k => { if (k !== "boxenruhe") try { behandeln(p, k, dosisKlasse(gewichtAnzeige(p)), "du"); } catch (er) { } })); }); } catch (er) { } }
          if (!fremd(p)) {   // Tierarzt rufen, dann den Plan befolgen (Dosis nach Gewicht)
            if (befundListe(p).some(b => b.bemerkt && !b.diagnose) && zuf() < Sx.tierarzt && (spiel.geld || 0) > TIERARZT_BESUCH) { try { tierarztBesuch(p, box, () => {}); } catch (e) { } knopf(); zu(); }
            const plan = new Set(); befundListe(p).filter(b => b.diagnose).forEach(b => (PLAN[b.art] || []).forEach(k => plan.add(k)));
            plan.forEach(k => { if (k === "boxenruhe") return; if (zuf() < Sx.tierarzt) { try { behandeln(p, k, dosisKlasse(gewichtAnzeige(p)), "du"); } catch (e) { } } });
          }
        }); };
      // eigene Pferde (Handel, Zucht): immer putzen, Hufe, Dauerauftrag Hufschmied, Tierarzt/Behandlung – sonst gibt es Vorfälle beim Veterinäramt
      const eigenePflege = () => { eigene().forEach(p => { const b = boxVon(p); if (!b || p.klinik || p.turnier) return; aktBox = spiel.boxen.indexOf(b); if (!p.hufAuftrag) p.hufAuftrag = "barhuf"; putzen(p, "buerste"); putzen(p, "kamm"); p.ausgekratzt = spiel.tag;
          if (befundListe(p).some(x => x.bemerkt && !x.diagnose) && (spiel.geld || 0) > TIERARZT_BESUCH) { try { tierarztBesuch(p, b, () => {}); } catch (er) { } knopf(); zu(); }
          const plan = new Set(); befundListe(p).filter(x => x.diagnose).forEach(x => (PLAN[x.art] || []).forEach(k => plan.add(k))); plan.forEach(k => { if (k !== "boxenruhe") { try { behandeln(p, k, dosisKlasse(gewichtAnzeige(p)), "du"); } catch (er) { } } }); }); zu(); };
      // ---------- Experte: wo Stallbursche/Azubi etwas nicht gemacht haben, springt er ein (Dome 7.11.) ----------
      const luecken = () => { if (!Sx.zufriedenPflege) return; spiel.boxen.forEach((box, i) => { const p = box.pferd; if (!p || box.tot || p.klinik || p.turnier) return; aktBox = i; const was = [];
          if (!p.weide && !box.krippeVoll) { if (fuetternAusLager(box, "du", "rau")) { box.krippeVoll = true; was.push("gefüttert"); } if (kraftNoetig(p, box)) { fuetternAusLager(box, "du", "kraft"); box.kraftVoll = true; } }
          if (box.mistig) { box.mistig = false; box.mistStufe = 0; was.push("gemistet"); } if (box.wasserTag !== spiel.tag) { box.wasserTag = spiel.tag; was.push("Wasser"); }
          if (fremd(p)) { const e = einstellerVon(p); if (e && !e.art) { try { pensionAufgaben(e, box).filter(x => !x.ok).forEach(x => { if (x.k === "putzen") { putzen(p, "buerste"); putzen(p, "kamm"); p.ausgekratzt = spiel.tag; was.push("Pflege"); } if (x.k === "maehne") { besitzerWunschLaenge(p); pflegerSchneiden(p); was.push("Mähne"); } if (x.k === "decke") e.decke = spiel.tag; if (x.k === "futter") { const WF = besitzerFutter(p, box); if (WF) { p.futterplan = JSON.parse(JSON.stringify(WF)); was.push("Futterplan"); } } if (x.k === "medizin") { befundListe(p).filter(b => b.diagnose).forEach(b => (PLAN[b.art] || []).forEach(k => { if (k !== "boxenruhe") { try { behandeln(p, k, dosisKlasse(gewichtAnzeige(p)), "du"); } catch (er) { } } })); was.push("Medizin"); } }); } catch (er) { } } }
          if (Sx.diag && fremd(p)) { const e2 = einstellerVon(p); if (e2 && !e2.art) { try { const rest = pensionAufgaben(e2, box).filter(x => !x.ok && x.k === "putzen"); if (rest.length) dl("J" + j + " T" + spiel.tag + ": Pflege bei " + p.name + " (Box " + bnr(i) + ") nach dem Putzen noch offen: geputzt=" + JSON.stringify(p.geputzt) + ", ausgekratzt=" + p.ausgekratzt + ", Besuch=" + (e2.besuchTag === spiel.tag)); } catch (er) { } } }
          if (was.length && Sx.diag) dl("J" + j + " T" + spiel.tag + ": Lücke bei " + p.name + " (Box " + bnr(i) + "): nicht erledigt, Experte hat " + was.join(", ")); }); };
      // ---------- Experte: Ausbilderschein im ersten Frühling, im Sommer einen Azubi (kostet weniger als ein Stallbursche, Dome 7.11.) ----------
      const ausbildung = () => { if (!Sx.azubi || istZucht()) return; const d = datum();
        if (!spiel.ausbilderschein) { if (d.s === 0 && (spiel.geld || 0) > AUSBILDERSCHEIN + reserve()) { buchen(-AUSBILDERSCHEIN, "Ausbilderschein (Kurs)"); spiel.ausbilderschein = true; merk("Ausbilderschein gemacht (" + fmt(AUSBILDERSCHEIN) + ")"); } return; }
        if (d.s === 1 && !(spiel.mitarbeiter || []).some(m => m.typ === "azubi" && m.bis == null) && (spiel.geld || 0) > reserve() + 300) { try { mitarbeiterDialog("azubi"); const b = document.querySelector("[data-einst]"); if (b) { b.click(); merk("Azubi eingestellt (Ausbildung beginnt im Herbst)"); } } catch (er) { } zu(); } };
      // ---------- Mitarbeiter: nur 3 Pferde selbst, ab dem 4. ein Stallbursche (je 3 Boxen) – Dome 6.11. ----------
      const personal = () => { const n = pferdeZahl(), sb = (spiel.mitarbeiter || []).filter(m => m.typ === "stallbursche" && m.bis == null).length;
        const azPlan = Sx.azubi ? 2 : 0; if (n >= 4 && sb < Math.ceil(Math.max(0, n - 3 - azPlan) / 3) && (spiel.geld || 0) > reserve() + 600) { try { mitarbeiterDialog("stallbursche"); const b = document.querySelector("[data-einst]"); if (b) { b.click(); merk(`Stallbursche eingestellt (${n} Pferde)`); } } catch (e) { } zu(); } };
      // ---------- Zucht nach Domes Strategie (mit Abweichungen je Typ) ----------
      const zucht = () => { if (j <= 2) return;   // Dome 6.11.: die ersten 2 Jahre nur Pensionspferde, eigene Pferde erst danach
        const d = datum(), geld = spiel.geld || 0, E = eigene();
        // 1) Stuten besorgen (Tierschutz), nur auf dem Zuchthof bzw. solange es nur einen Hof gibt
        const stuten = E.filter(p => p.geschlecht === "Stute" && alterJahre(p) >= 3 && alterJahre(p) <= 18);
        const sz = Sx.stutenMax, ziel = istZucht() ? 10 : sz;
        if (spiel.boxen.length >= Sx.stuteAbBoxen && stuten.length < Math.min(ziel, sz + (istZucht() ? 3 : 0)) && kaufFrei() && geld > polster() + 800) {
          const M = marktNeu(), h = [...(M.notfall || []), ...(M.privat || [])].sort((a, b) => (a.preis || 0) - (b.preis || 0)).find(x => x.geschlecht === "Stute" && x.alter >= 4 && x.alter <= 14 && !(spiel.marktGekauft || []).includes(x.id) && (x.preis || 0) < geld - polster());
          if (h && spiel.boxen.some(boxFrei)) { buchen(-AKU.mittel.preis, "AKU (Testspieler)"); pferdEinstellen(h, h.preis || 0, "Stute gekauft"); (spiel.marktGekauft = spiel.marktGekauft || []).push(h.id); spiel.letzterKauf = jzJetzt(); zu(); merk(`Stute ${h.name} gekauft (${fmt(h.preis || 0)})`); } }
        // 2) Decken – Frühling/Sommer, Hengst teuer oder günstig nach Kontostand
        if (d.s <= 1) stuten.forEach(p => { const b = boxVon(p); if (!b || p.traechtig || b.fohlen && alterJZ(b.fohlen) < 1 || zuchtSperre(p, b)) return;
          if ((p.fohlenZahl || 0) >= Sx.stuteVerkaufenNach) return;
          const H = deckhengste(p).filter(h => !groessenSperre(p, h)).sort((a, b) => decktaxe(a) - decktaxe(b)); if (!H.length) return;
          const h = geld > Sx.hengstTeuerAb ? H[H.length - 1] : H[0]; if (geld < decktaxe(h) + polster()) return;
          try { verpaaren(p, h); knopf(); } catch (e) { } zu(); if (p.traechtig) { p.fohlenZahl = (p.fohlenZahl || 0) + 1; merk(`${p.name} gedeckt von ${h.name} (${fmt(decktaxe(h))})`); } });
        // 3) Fohlen: ab der 3. Jahreszeit in die Aufzuchtstation – oder früher verkaufen, wenn das Geld knapp ist
        spiel.boxen.forEach(b => { const f = b.fohlen; if (!f || fremd(f) || alterJZ(f) < 2) return;
          if (geld < Sx.fohlenFruehVerkaufenUnter) { const fr = freieBox(); if (fr >= 0) { fohlenUmstellen(b, fr); if (verkaufen(f, "Fohlen früh verkauft – Geld knapp")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(f); } } return; }
          const A = ANH_ZIEL.aufzucht; if (!A.sperre(f, b, true)) { try { A.aus(f, b, true); merk(`${f.name} in die Aufzuchtstation`); } catch (e) { } } });
        E.filter(p => !p.tsKauf && alterJZ(p) >= 2 && alterJZ(p) < AUSBILDUNGSALTER && !p.weide).forEach(p => { const b = boxVon(p); if (!b || b.fohlen) return;
          if (geld < Sx.fohlenFruehVerkaufenUnter) { if (verkaufen(p, "Jungpferd früh verkauft – Geld knapp")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(p); } return; }
          const A = ANH_ZIEL.aufzucht; if (!A.sperre(p, b, false)) { try { A.aus(p, b, false); merk(`${p.name} (${alterText(p)}) in die Aufzuchtstation`); } catch (e) { } } });
        // Geld knapp: Jungpferde aus der Aufzuchtstation holen und verkaufen
        if (geld < Sx.fohlenFruehVerkaufenUnter / 2) (spiel.extern || []).filter(e => e.ort === "aufzucht").slice(0, 1).forEach(e => { const nb = zurueckholen(e); if (nb >= 0 && verkaufen(e.pferd, "Jungpferd aus der Aufzucht – Geld knapp")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(e.pferd); } });
        // 4) Zurück aus der Aufzucht (3 Jahre): gute Stute behalten (Nachzucht), sonst verkaufen; Hengste trainieren, solange Geld da ist
        E.filter(p => !p.tsKauf && alterJahre(p) >= 3 && alterJahre(p) < 5 && p.mutterId !== undefined || alterJahre(p) === 3).forEach(p => {
          if (angebotVon(p)) return;
          if (p.geschlecht === "Stute" && marktwert(p) > 3000 && stuten.length < (istZucht() ? 10 : sz + 1)) return;   // gute Stute: weiterzüchten
          if (p.geschlecht === "Hengst" && Sx.hengsteBehalten && geld > reserve() + 2000) return;   // Hengst behalten und trainieren
          if (verkaufen(p, p.geschlecht === "Hengst" ? "Hengst – Geld wird gebraucht" : "Jungpferd mit 3 Jahren")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(p); } });
        // 5) Stute nach dem x. Fohlen verkaufen (Typ 2 und 3), sobald das Fohlen abgesetzt ist
        stuten.forEach(p => { const b = boxVon(p); if ((p.fohlenZahl || 0) >= Sx.stuteVerkaufenNach && !p.traechtig && b && !b.fohlen) verkaufen(p, `Stute nach ${p.fohlenZahl} Fohlen`); });
        // 6) Hengste trainieren (Spieler selbst), solange das Geld reicht – sonst verkaufen
        E.filter(p => p.geschlecht === "Hengst" && alterJahre(p) >= 3 && !p.weide).forEach(p => { if (geld < reserve()) { verkaufen(p, "Hengst – Geld knapp"); return; }
          try { trainieren(p, alterJZ(p) >= 10 ? "longieren" : "bodenarbeit", spiel.anlage && spiel.anlage.reitplatz ? "reitplatz" : "gelaende"); } catch (e) { } }); };
      // ---------- Turniere / Fohlenschau (Typ 2 und 3) ----------
      const turniere = () => { if (!Sx.turniere) return; const L = (spiel.turniere || []).filter(t => t.tag > spiel.tag && t.tag <= spiel.tag + 3);
        const kandidaten = [...eigene().filter(p => alterJahre(p) >= 4 && !p.traechtig), ...spiel.boxen.filter(b => b.fohlen && !fremd(b.fohlen)).map(b => b.fohlen)];
        kandidaten.forEach(p => { if (genanntBei(p).length) return; for (const t of L) { const P = t.pruef.find(P => !nennSperre(p, t, P) && (P.fohlenschau || (P.stufe === 0 && (p.training || 0) >= 40))); if (P && (spiel.geld || 0) > reserve() + nenngeld(t, P) + 200) { t.nennung.push({ pid: p.id, prid: P.id, geld: nenngeld(t, P) }); buchen(-nenngeld(t, P), "Turniere: Nenngeld"); merk(`${p.name} genannt: ${t.name}`); break; } } }); };
      // ---------- Hausturnier (Dome 7.11.): einmal im Jahr, wenn möglich – eine Jahreszeit im Voraus planen, eigene Pferde nennen ----------
      const hausturnier = () => { if (!Sx.hausturnier || istZucht() || typeof hausturnierSperre !== "function") return;
        if (!hausturnierSperre()) { const z = hausZiel(), tage = []; for (let t = spiel.tag + 1; t <= spiel.tag + 2 * tpj() + 2; t++) { const d = datum(t); if (d.j * 4 + d.s === z.jz) tage.push(t); }
          if (tage.length && (spiel.geld || 0) > reserve() + hausKosten() + 500) { const f = hausturnierAnlegen(tage[Math.floor(tage.length / 2)]); if (!f) merk("Hausturnier geplant (" + fmt(hausKosten()) + ")"); } }
        (spiel.turniere || []).filter(t => t.haus === aktivHid() && t.tag > spiel.tag && t.tag <= spiel.tag + 3).forEach(t => eigene().filter(p => alterJahre(p) >= 4 && !p.traechtig && !p.klinik).forEach(p => { try { if (genanntBei(p).length) return; const P = (t.pruef || []).find(P => !nennSperre(p, t, P)); if (P && (spiel.geld || 0) > reserve() + nenngeld(t, P) + 100) { t.nennung.push({ pid: p.id, prid: P.id, geld: nenngeld(t, P) }); buchen(-nenngeld(t, P), "Turniere: Nenngeld"); kost(p, "Nenngeld Hausturnier", -nenngeld(t, P)); merk(p.name + " beim Hausturnier genannt"); } } catch (er) { } })); };
      // ---------- Verkaufsrennen (Vollblut-Handelspferde, nach mindestens 1 Jz im Stall): Verkaufspreis 110 % Marktwert ----------
      const verkaufsrennen = () => { if (!Sx.handelMax || istZucht()) return; const L = (spiel.turniere || []).filter(t => t.tag > spiel.tag && t.tag <= spiel.tag + 3);
        eigene().filter(p => p.handel && p.rasse === "vollblut" && (spiel.tag - (p.handelTag || 0)) / tpj() >= 1 && !p.traechtig).forEach(p => { if (genanntBei(p).length) return; for (const t of L) { const P = (t.pruef || []).find(P => P.verkauf && !nennSperre(p, t, P)); if (P && (spiel.geld || 0) > reserve() + nenngeld(t, P) + TRAINER_GEBUEHR + 200) { t.nennung.push({ pid: p.id, prid: P.id, geld: nenngeld(t, P), verkauf: Math.round(marktwert(p) * 1.1 / 50) * 50 }); buchen(-nenngeld(t, P), "Turniere: Nenngeld"); merk(p.name + " im Verkaufsrennen genannt (Preis " + fmt(Math.round(marktwert(p) * 1.1 / 50) * 50) + ")"); break; } } }); };
      // ---------- Aufzucht und Ausbildungsstall (Dome 7.11.): Platz schaffen, Pferde zurückholen, nach Turnieren verkaufen ----------
      const externSchritt = () => { if (!Sx.handelMax || istZucht() || j <= 2) return; const L = (spiel.turniere || []).filter(t => t.tag > spiel.tag && t.tag <= spiel.tag + 3);
        (spiel.extern || []).slice().forEach(e => { const p = e.pferd; if (!p) return;
          if (e.ort === "aufzucht" && alterJZ(p) >= AUSBILDUNGSALTER) { if (freieBox() >= 0 && eigene().length < eigeneMax() && zurueckholen(e) >= 0) { zu(); kost(p, "Aufzucht " + Math.round(spiel.tag - e.seit) + " Tage", -(spiel.tag - e.seit) * KOSTEN.aufzucht); merk(p.name + " aus der Aufzucht geholt (" + alterText(p) + ")"); } }
          else if (e.ort === "ausbildung") {
            try { if (!genanntBei(p).length && alterJahre(p) >= 4) for (const t of L) { const P = (t.pruef || []).find(P => !P.verkauf && P.stufe === 0 && !nennSperre(p, t, P)); if (P && (spiel.geld || 0) > reserve() + nenngeld(t, P) + 200) { t.nennung.push({ pid: p.id, prid: P.id, geld: nenngeld(t, P) }); buchen(-nenngeld(t, P), "Turniere: Nenngeld"); kost(p, "Nenngeld " + t.name, -nenngeld(t, P)); merk(p.name + " aus dem Ausbildungsstall genannt: " + t.name); break; } } } catch (er) { }
            const turn = (p.erfolge || []).length > (e.tsErf || 0), lange = (spiel.tag - e.seit) / tpj() >= 8;
            const alt13 = alterJahre(p) >= 13; if ((turn || lange || alt13) && freieBox() >= 0 && eigene().length < eigeneMax() && zurueckholen(e) >= 0) { zu(); kost(p, "Ausbildungsstall " + Math.round(spiel.tag - e.seit) + " Tage", -(spiel.tag - e.seit) * KOSTEN.ausbildung); p.handel = true; p.handelTag = p.handelTag || spiel.tag; p.tsHeim = { tag: spiel.tag, erf: (p.erfolge || []).length }; merk(p.name + " aus dem Ausbildungsstall geholt (" + (turn ? "war auf Turnieren" : alt13 ? "13 Jahre" : "lange genug") + ") – geht zu Hause noch auf Turniere, dann Verkauf"); if (alt13 && verkaufen(p, "13 Jahre alt", 1.06)) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(p); } } } });
        // zu viele eigene Pferde im Stall (Boxen für Eigene voll) → eines nach außen: bis 3 Jahre in die Aufzucht, sonst in den Ausbildungsstall
        if (eigene().length >= eigeneMax() && eigeneGesamt() < eigeneMax() + 4 && (spiel.geld || 0) > polster()) { const cand = eigene().filter(p => { const b = boxVon(p); return b && !p.traechtig && !p.klinik && !p.turnier && !angebotVon(p) && !b.fohlen && p.geschlecht !== "Hengst"; });
          for (const p of cand) { const b = boxVon(p), z = alterJZ(p) < AUSBILDUNGSALTER ? "aufzucht" : "ausbildung"; let g = ""; try { g = ANH_ZIEL[z].sperre(p, b, false) || ""; } catch (er) { g = "x"; } if (g) continue;
            try { ANH_ZIEL[z].aus(p, b, false); const e = (spiel.extern || []).find(x => x.pferd === p); if (e) e.tsErf = (p.erfolge || []).length; zu(); merk(p.name + " (" + alterText(p) + ") " + (z === "aufzucht" ? "in die Aufzucht" : "in den Ausbildungsstall") + " – Box frei für Neues"); } catch (er) { } break; } } };
      // ---------- Ausbau: Pension bis 20 Boxen, Pensionsplätze nachziehen ----------
      const ausbau = () => { if (istZucht()) return; const R = pensionRegeln(), boxen = spiel.boxen.filter(b => !b.quar && !b.abfohl && !b.offen).length, frei = spiel.boxen.filter(boxFrei).length;
        R.max = Sx.handelMax ? boxen - Math.min(eigeneMax(), eigene().length + 1) : Math.max(R.max || 0, boxen - eigene().length - 1);
        if (boxen < Sx.maxBoxen && frei <= Sx.bauWennFrei && !imBau().length && datum().s !== 3 && !(Sx.einBauProJahr && (spiel.tsBauJahr === j || (spiel.tsBauArt === "anbau" && gebaeude().some(x => x.typ === "stall" && !x.abriss && (x.stufe || 1) < 2))))) { const n = Sx.anbauSchritt || Math.min(14, Math.max(6, 20 - boxen)), n2 = n % 2 ? n + 1 : n, k = bauPreis("stall", 1, { boxen: n2 });
          const fehlt = k + Sx.bauReserve + reserve() - (spiel.geld || 0);
          const offen = kredite().filter(x => kreditLaeuft(x)), offenSumme = offen.reduce((a, x) => a + x.rest, 0), s2 = Math.ceil(Math.max(0, fehlt) / 500) * 500;   // Baukredit nur in Maßen (Dome 6.11.): höchstens 60 % der Baukosten, Gesamtschulden unter der Grenze, nur einer zur Zeit, nur bei laufender Pension, nach einem Fehlschlag 4 Jahreszeiten Pause
          if (fehlt > 0 && Sx.bauKredit && einnahmenOk() && s2 <= k * 0.6 && offenSumme + s2 <= Sx.kreditMax && !offen.some(x => /Baukredit/.test(x.name || "")) && jzJetzt() - (spiel.letzterBauFehl ?? -99) >= 4 && kreditRahmen() >= s2) { kreditNeu(s2, 20, "Baukredit"); merk(`Baukredit ${fmt(s2)} (20 Raten) für den Stallbau`); }
          if ((spiel.geld || 0) > k + Sx.bauReserve + reserve()) { if (bauStarten("stall", 1, { boxen: n2 }) && planAutoSetzen() >= 0) merk(`Boxenstall mit ${n2} Boxen gebaut (${fmt(k)})`), (spiel.tsBauJahr = j, spiel.tsBauArt = "anbau"); else spiel.letzterBauFehl = jzJetzt(); zu(); } } };
      // ---------- Logik statt fester Jahrespläne (Dome 6.11.): ausgeben nur mit Polster, kaufen/bauen nur bei sicheren Einnahmen und mit Abstand ----------
      const polster = () => Sx.puffer + reserve();   // so viel bleibt nach jeder freiwilligen Ausgabe in der Kasse
      const kannZahlen = k => (spiel.geld || 0) >= 0 && (spiel.geld || 0) - k >= polster();
      const einnahmenOk = () => { const bx = spiel.boxen.filter(b => !b.quar && !b.abfohl && !b.offen).length; return einstellerListe().length >= Math.min(3, Math.ceil(bx / 3)); };   // die Pension läuft (genug Einsteller)
      const eigeneMax = () => Math.max(1, Math.floor((spiel.boxen.filter(b => !b.quar && !b.abfohl && !b.offen).length - 4) / 2));   // Dome 7.11.: bei 6 Boxen 1 Box für eigene Pferde, bei 8 Boxen 2, bei 10 Boxen 3 usw.
      const eigeneGesamt = () => eigene().length + (spiel.extern || []).filter(e => e.ort === "aufzucht" || e.ort === "ausbildung").length;   // Pferde in der Aufzucht/im Ausbildungsstall zählen mit, brauchen aber keine Box (Dome 7.11.)
      const kaufFrei = h => j > 2 && spiel.boxen.some(boxFrei) && jzJetzt() - (spiel.letzterKauf ?? -99) >= (h ? 1 : Sx.kaufAbstand) && (!Sx.handelMax || (eigene().length < eigeneMax() && eigeneGesamt() < eigeneMax() + 4)) && (istZucht() || einnahmenOk()) && kannZahlen(0);
      // ---------- Eigene Pferde ab Jahr 3: Wallache dazukaufen, trainieren, Handel (Dome 6.11.) ----------
      const marktListe = () => { const M = marktNeu(); return Object.values(M).filter(Array.isArray).flat().concat((() => { try { return marktpferde(); } catch (e) { return []; } })()).concat(RASSEN.filter((r, i) => (i + jzJetzt()) % 5 === 0).flatMap(r => { try { return gestuetPferde(r.id); } catch (e) { return []; } })).filter(x => x && x.geschlecht); };   // auch Gestüte (je Jahreszeit andere Rassen)   // (Auktionseinträge sind Hüllen ohne Pferd – die laufen über das Bieten in handel())
      const einkaufen = (filter, text, handel) => { if (!kaufFrei(handel)) return false; const geld = spiel.geld || 0;
        const h = marktListe().filter(x => filter(x) && !(spiel.marktGekauft || []).includes(x.id) && (x.preis || 0) < geld - polster()).sort((a, b) => (a.preis || 0) - (b.preis || 0))[0]; if (!h) return false;
        buchen(-AKU.mittel.preis, "AKU (Testspieler)"); pferdEinstellen(h, h.preis || 0, text); T.namen = T.namen || {}; T.buch = T.buch || {}; T.namen[h.name] = 1; T.buch[h.name] = [{ t: "Einkauf " + text, b: -(h.preis || 0), tag: spiel.tag }, { t: "AKU", b: -AKU.mittel.preis, tag: spiel.tag }]; (spiel.marktGekauft = spiel.marktGekauft || []).push(h.id); spiel.letzterKauf = jzJetzt(); zu();
        const bx = spiel.boxen.find(b => b.pferd && b.pferd.id === h.id); if (bx) { bx.pferd.tsNotfall = (marktNeu().notfall || []).some(n => n.id === h.id); bx.pferd.tsKauf = true; if (handel) { bx.pferd.handel = true; bx.pferd.handelTag = spiel.tag; } } merk(`${handel ? 'Handelspferd' : 'Wallach'} ${h.name} gekauft (${fmt(h.preis || 0)}, ${h.alter} J.)`); return true; };
      const wallache = () => { if (j <= 2 || istZucht() || !Sx.wallachMax) return; const n = eigene().filter(p => p.geschlecht === "Wallach" && p.tsKauf).length; if (n >= Sx.wallachMax || zuf() > Sx.wallachLust * 0.5) return;   // nur manchmal, wenn Lust und Geld da sind
        einkaufen(x => x.geschlecht === "Wallach" && x.alter >= 4 && x.alter <= 12, "Wallach gekauft", false); };
      const handel = () => { if (j <= 2 || !Sx.handelMax || istZucht()) return; const H = eigene().filter(p => p.handel), geld = spiel.geld || 0;
        // verkaufen: mit 2 Schleifen nach 4 Jahreszeiten (x1,15), spätestens nach 8 – oder sofort zum Marktwert, wenn das Geld knapp wird
        H.forEach(p => { const seit = (spiel.tag - (p.handelTag || 0)) / tpj(), sch = (p.schleifen || []).length, knapp = geld < reserve();
          const heimFertig = !!p.tsHeim && ((p.erfolge || []).length > p.tsHeim.erf || (spiel.tag - p.tsHeim.tag) / tpj() >= 3);   // aus dem Ausbildungsstall zurück: erst zu Hause noch ein Turnier (Marktwert steigt), spätestens nach 3 Jz verkaufen; mit 13 Jahren immer
          if (alterJahre(p) >= 13 || (seit >= (p.tsNotfall ? 6 : 0) && (heimFertig || (!p.tsHeim && ((seit >= 4 && sch >= 2) || seit >= 8)) || (knapp && seit >= 1)))) {   // Tierschutzpferde frühestens nach 1,5 Jahren (6 Jz) verkaufen
           if (verkaufen(p, `Handel: ${sch} Schleifen, ${Math.round(seit)} Jz gehalten${knapp ? ", Geld wird gebraucht" : ""}`, knapp ? 1 : Math.max(0.9, 1.06 - 0.05 * (p.tsVerkN || 0)))) { p.tsVerkN = (p.tsVerkN || 0) + 1; T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(p); } } });
        spiel.tsAuk = spiel.tsAuk || [];   // Handelspferde kommen vom Auktionshaus (Jungpferde, Startgebot = halber Marktwert): auf ein Pferd bieten, gewonnene Pferde als Handel markieren
        eigene().filter(p => spiel.tsAuk.includes(p.id) && !p.handel).forEach(p => { p.handel = true; p.tsKauf = true; p.handelTag = spiel.tag; merk("Auktionspferd " + p.name + " gewonnen (" + alterText(p) + ")"); });
        if (datum().s !== 3 && H.length < Sx.handelMax && kaufFrei(true)) { const k = (spiel.rennKauf || []).filter(k => k.bis >= spiel.tag && k.pferd.geschlecht !== "Hengst" && alterJahre(k.pferd) >= 1 && alterJahre(k.pferd) <= 9 && k.preis <= 0.95 * marktwert(k.pferd) && (spiel.geld || 0) - k.preis > polster()).sort((a, b) => a.preis - b.preis)[0];
          if (k && rennKaufen(k, null)) { const bx = spiel.boxen.find(b => b.pferd && b.pferd.id === k.pferd.id); if (bx) { bx.pferd.handel = true; bx.pferd.tsKauf = true; bx.pferd.handelTag = spiel.tag; } spiel.letzterKauf = jzJetzt(); zu(); merk("Verkaufsrennen: " + k.pferd.name + " gekauft (" + fmt(k.preis) + ")"); return; } }
        if (datum().s !== 3 && H.length < Sx.handelMax && zuf() < 0.4) { const M2 = marktNeu(); if (einkaufen(x => x.geschlecht !== "Hengst" && ((alterJahre(x) >= 1 && alterJahre(x) <= 9) || (x.geschlecht === "Stute" && x.fohlenBeiFuss && alterJahre(x) <= 14)) && x.preis != null && x.preis <= ((M2.privat || []).includes(x) ? 0.85 : (M2.notfall || []).includes(x) ? 1 : 1.3) * marktwert(x), "Handelspferd gekauft (Privat/Händler/Gestüt/Tierschutz)", true)) return; }   // Privat unter 85 %, Tierschutz zum Marktwert, Händler/Gestüt (110–150 % Aufschlag) bis 130 %
        const M = marktNeu(), laufend = (M.auktion || []).filter(a => a.fuehrt === "du").length; if (datum().s === 3 || H.length + laufend >= Sx.handelMax || !kaufFrei(true) || zielBox() < 0) return;
        const a = (M.auktion || []).filter(a => a.pferd && !a.duGeboten && a.pferd.geschlecht !== "Hengst" && alterJahre(a.pferd) >= 1 && alterJahre(a.pferd) <= 9).sort((x, y) => x.start - y.start)[0]; if (!a) return; const frei = (spiel.geld || 0) - gebundenesGeld(a) - polster(), g = Math.min(Math.round(a.wert * 1.4 / 50) * 50, Math.floor(frei / 50) * 50);
        if (g >= a.start) { a.gebot = a.start; a.gebote = (a.gebote || 0) + 1; a.duMax = g; a.fuehrt = "du"; a.duGeboten = true; a.hid = aktivHid(); spiel.tsAuk.push(a.pferd.id); spiel.letzterKauf = jzJetzt(); merk("Auktion: Gebot auf " + a.pferd.name + " (" + alterText(a.pferd) + ", Wert " + fmt(a.wert) + ", Höchstgebot " + fmt(g) + ")"); } };
      const notlage = () => { if (j <= 2 || (spiel.geld || 0) >= reserve() / 2) return; const p = eigene().filter(x => (x.tsKauf || x.geschlecht === "Wallach") && !angebotVon(x)).sort((a, b) => marktwert(b) - marktwert(a))[0]; if (p) verkaufen(p, "Geld knapp – verkauft", 1); };   // wer knapp bei Kasse ist, verkauft ein Pferd
      const training = () => { if (j <= 2 || !Sx.trainAnteil) return; eigene().filter(p => !p.traechtig && !p.weide && !p.klinik && !p.turnier && !(boxVon(p) && boxVon(p).fohlen) && (p.geschlecht !== "Hengst") && zuf() < Sx.trainAnteil).forEach(p => { const az = alterJZ(p); if (az < 2) return;
          const reihe = az < 12 ? ["bodenarbeit", "spazieren"] : az < 16 ? ["dressur", "stangen", "ausritt"] : ["dressur", "springen", "kondition", "ausritt"], k = reihe.filter(x => UEBUNG[x] && UEBUNG[x].ab <= az)[(spiel.tag + az) % reihe.filter(x => UEBUNG[x] && UEBUNG[x].ab <= az).length];
          if (!k) return; const ort = (UEB_WO[UEBUNG[k].wo] || []).slice().sort((x, y) => (y === "gelaende") - (x === "gelaende")).find(o => o === "gelaende" || (spiel.anlage && spiel.anlage[o])); if (!ort) return; try { trainieren(p, k, ort); } catch (e) { } }); };
      // ---------- Bauen: reparieren, neu bauen, ausbauen (je Spielertyp anders, Dome 6.11.) ----------
      const bauen = () => { if (imBau().length) return; const geld = () => spiel.geld || 0, G = gebaeude();
        // reparieren: Pflicht, wenn es schlimm ist (Zustand unter 25), sonst nur mit Polster
        const rep = G.filter(g => !g.abriss && !g.rep && !ohnePflege(g.typ) && g.zustand < (Sx.reparaturJanuar && datum().s === 0 ? Math.max(75, Sx.reparaturUnter) : Sx.reparaturUnter) && reparaturPreis(g) > 0).sort((a, b) => a.zustand - b.zustand)[0];
        if (rep && (rep.zustand < 25 || (Sx.reparaturJanuar && datum().s === 0) ? geld() > reparaturPreis(rep) + 100 : kannZahlen(reparaturPreis(rep)))) { const k = reparaturPreis(rep); reparierenAusfuehren(rep, k); zu(); merk(`${gebName(rep).replace(/\u00ad/g, '')} repariert (Zustand ${Math.round(rep.zustand)}, ${fmt(k)})`); return; }
        if (datum().s === 3 || jzJetzt() - (spiel.letzterBau ?? -99) < Sx.bauAbstand || !einnahmenOk()) return;   // nur mit Abstand und bei laufender Pension
        const stallG = G.find(x => x.typ === "stall" && !x.abriss && (x.stufe || 1) < 2);   // Dome 6.11.: früh die Boxen auf Stufe 2 – hat Vorrang vor allem Neubau; der Baukredit gilt auch hier nur in Maßen
        if (stallG && !umbauSperre(stallG) && !(Sx.einBauProJahr && spiel.tsBauJahr === j)) { const kd = Sx.umbauKreditAb != null && jzJetzt() >= Sx.umbauKreditAb, nB = Math.min(2, stallG.boxen || 2), k = Math.round(umbauPreis(stallG) * nB / (stallG.boxen || nB)), fehlt = k + (kd ? 500 : Sx.bauReserve + polster()) - geld(), s2 = Math.ceil(Math.max(0, fehlt) / 500) * 500, offen = kredite().filter(x => kreditLaeuft(x)), summe = offen.reduce((a, x) => a + x.rest, 0);
          if (fehlt > 0 && Sx.bauKredit && s2 <= k * (kd ? 1 : 0.6) && summe + s2 <= Sx.kreditMax && !offen.some(x => /Baukredit/.test(x.name || "")) && jzJetzt() - (spiel.letzterBauFehl ?? -99) >= 4 && kreditRahmen() >= s2) { kreditNeu(s2, 20, "Baukredit"); merk(`Baukredit ${fmt(s2)} (20 Raten) für den Umbau auf Stufe 2`); }
          if (kd ? geld() >= k + 500 : kannZahlen(k + Sx.bauReserve)) { const zT = nB < (stallG.boxen || 0) ? gebTeilen(stallG, nB) : stallG; if (umbauStarten(zT)) { spiel.letzterBau = jzJetzt(); spiel.tsBauJahr = j; spiel.tsBauArt = "umbau"; merk(`${nB} Boxen auf Stufe 2 umgebaut (${fmt(k)})`); } else { spiel.letzterBauFehl = jzJetzt(); if (zT !== stallG) gebZusammen(zT, stallG); } zu(); } return; }
        for (const typ of Sx.neubau) { if (G.some(g => g.typ === typ) || !BAUTEN[typ]) continue; if (typ === "sandpaddock" && !spiel.boxen.some(b => b.pferd && reheGefaehrdet(b.pferd))) continue;   // Sandpaddock erst, wenn Pferde im Frühling Hufrehe-Gefahr haben
          const k = bauPreis(typ, 1, {});   // der Reihe nach: was als Nächstes dran ist, wird abgewartet
          if (kannZahlen(k + Sx.bauReserve)) { if (bauStarten(typ, 1) && planAutoSetzen() >= 0) { spiel.letzterBau = jzJetzt(); merk(`${BAUTEN[typ].n.replace(/\u00ad/g, '')} gebaut (${fmt(k)})`); } zu(); } return; }
        for (const [typ, st] of Sx.umbau) { const g = G.find(x => x.typ === typ && !x.abriss && (x.stufe || 1) === st - 1); if (!g || umbauSperre(g) || (typ === "stall" && Sx.einBauProJahr && spiel.tsBauJahr === j)) continue; const nB2 = typ === "stall" && Sx.einBauProJahr ? Math.min(2, g.boxen || 2) : 0, k = nB2 ? Math.round(umbauPreis(g) * nB2 / (g.boxen || nB2)) : umbauPreis(g);
          if (kannZahlen(k + Sx.bauReserve)) { const gT = nB2 && nB2 < (g.boxen || 0) ? gebTeilen(g, nB2) : g; if (!umbauStarten(gT)) { if (gT !== g) gebZusammen(gT, g); } else { spiel.letzterBau = jzJetzt(); if (nB2) { spiel.tsBauJahr = j; spiel.tsBauArt = "umbau"; } merk(`${gebName(g).replace(/\u00ad/g, '')} auf Stufe ${st} ausgebaut (${fmt(k)})`); } zu(); } return; } };
      // ---------- Zusatzbau ohne Vorrang (Dome 6.11.): Solarium/Aqua-Center erst, wenn alles andere steht und reichlich Geld da ist ----------
      const zusatzbau = () => { if (!(Sx.spaeter || []).length || imBau().length || datum().s === 3 || jzJetzt() - (spiel.letzterBau ?? -99) < Sx.bauAbstand || !einnahmenOk()) return; const G = gebaeude();
        if (Sx.neubau.some(t => BAUTEN[t] && !G.some(g => g.typ === t) && !(t === "sandpaddock" && !spiel.boxen.some(b => b.pferd && reheGefaehrdet(b.pferd))))) return; if (!spiel.boxen.some(b => boxenStufe(b) >= 3)) return;   // Luxus (Waschplatz, Solarium, Aqua) erst mit mindestens einer Stufe-3-Box
         const typ = Sx.spaeter.find(t => BAUTEN[t] && !G.some(g => g.typ === t)); if (!typ) return; const k = bauPreis(typ, 1, {});
        if (kannZahlen(k + 2 * Sx.bauReserve)) { if (bauStarten(typ, 1) && planAutoSetzen() >= 0) { spiel.letzterBau = jzJetzt(); merk(`${BAUTEN[typ].n.replace(/­/g, '')} gebaut (${fmt(k)}, Zusatz)`); } zu(); } };
      const roundpen2 = () => { if (!Sx.zweiterReitplatz || imBau().length || datum().s === 3 || einstellerListe().filter(e => !e.art).length < 6) return; const G = gebaeude(); if (!G.some(g => g.typ === "roundpen") || G.filter(g => g.typ === "roundpen").length >= 2 || G.filter(g => g.typ === "reitplatz").length < 2) return; const k = bauPreis("roundpen", 1, {}); if (kannZahlen(k + Sx.bauReserve)) { if (bauStarten("roundpen", 1) && planAutoSetzen() >= 0) merk("2. Roundpen gebaut (" + fmt(k) + ", Reitplatz war belegt)"); zu(); } };
      const reitplatz2 = () => { if (!Sx.zweiterReitplatz || imBau().length || datum().s === 3 || einstellerListe().filter(e => !e.art).length < 6) return; const G = gebaeude(); if (G.filter(g => g.typ === "reitplatz").length >= 2) return; const k = bauPreis("reitplatz", 1, {}); if (kannZahlen(k + Sx.bauReserve)) { if (bauStarten("reitplatz", 1) && planAutoSetzen() >= 0) merk("2. Reitplatz gebaut (" + fmt(k) + ", Reitplatz war belegt)"); zu(); } };
      const briefLog = () => { const L = spiel.post || []; T.postIds = T.postIds || {}; L.forEach(b => { if (T.postIds[b.id]) return; T.postIds[b.id] = 1; if (["Veterinäramt", "Tierschutzverein", "Bank", "Turnierbüro"].includes(b.von) || /Strafe|Mahn|Kündig|Pfänd|Warnung|Verbot|Auflage/.test(b.betreff)) merk("Brief von " + b.von + ": " + b.betreff + " – " + String(b.text).replace(/<[^>]*>/g, " ").replace(/s+/g, " ").slice(0, 600)); }); };
      const buchTrack = () => { T.namen = T.namen || {}; T.buch = T.buch || {}; [...eigene(), ...(spiel.extern || []).filter(e => e.pferd && (e.ort === "aufzucht" || e.ort === "ausbildung")).map(e => e.pferd)].forEach(p => { if (T.namen[p.name]) return; T.namen[p.name] = 1; T.buch[p.name] = (T.buch[p.name] || []).concat((T.ring || []).filter(r => r.t.includes(p.name) && r.b < 0).map(r => ({ t: r.t, b: r.b, tag: r.tag }))); }); };
      const kost = (p, t, b) => { T.namen = T.namen || {}; T.buch = T.buch || {}; T.namen[p.name] = 1; (T.buch[p.name] = T.buch[p.name] || []).push({ t, b, tag: spiel.tag }); };
      // ---------- Diagnose: warum kündigen Einsteller? (Dome 6.11.) – Zufriedenheit und Gründe ins Protokoll ----------
      const kuendigung = () => { einstellerListe().forEach(e => { if (e.kuendigt == null || e.tsGemeldet) return; e.tsGemeldet = true; spiel.tsKuend = jzJetzt(); merk(`Einsteller ${eName(e)} kündigt (Zufriedenheit ${Math.round(e.zufr)}, ${e.kuendGrund || "?"}): ${(e.log || []).map(x => x.grund).join("; ") || "keine Gründe vermerkt"}`); }); };
      // ---------- Experte: alles tun, damit die Einsteller zufrieden bleiben (Dome 6.11.): Gummimatten in Stufe-2-Boxen, Weidegang, wo er fehlt ----------
      const zufriedenheit = () => { if (!Sx.zufriedenPflege || istZucht()) return; const P = BODEN_WIRKUNG.GUMMI_PREIS;
        const gb = spiel.boxen.find(x => x.pferd && fremd(x.pferd) && boxenStufe(x) >= 2 && !x.gummi && !x.offen && !x.paddock); if (gb && kannZahlen(P + Sx.bauReserve)) { buchen(-P, "Gummimatten"); gb.gummi = true; merk(`Gummimatten in Box ${bnr(spiel.boxen.indexOf(gb))} (Einsteller zufriedener)`); }
        if (datum().s === 3) return; einstellerListe().filter(e => !e.art && (e.log || []).some(x => /Weidegang/.test(x.grund))).forEach(e => { const bx = spiel.boxen.find(x => x.pferd && fremd(x.pferd) && einstellerVon(x.pferd) === e); if (!bx) return; const q = bx.pferd;
          if (q.weide || paddockVon(q) || q.boxenruhe || q.quarantaene || q.klinik || reheGefaehrdet(q)) return; const w = weideWahl(q); if (w) { try { aufWeide(q, bx, null, w.wid); } catch (er) { } } }); };
      // ---------- Pensionspreise anheben, wenn es gut läuft (Dome 6.11., Fortgeschritten und Experte): Pension fast voll, Einsteller zufrieden, 2 Jahreszeiten keine Kündigung → +10 % je Boxstufe ----------
      const angebotBonus = () => { const R = pensionRegeln(), G = gebaeude().filter(g => !g.bau && !g.abriss); return Object.keys(R.leistungen).filter(k => R.leistungen[k]).length * 0.08 + ["roundpen", "reithalle", "waschplatz", "solarium", "aqua", "sandpaddock"].filter(t => G.some(g => g.typ === t)).length * 0.1 + (G.filter(g => g.typ === "reitplatz").length >= 2 ? 0.1 : 0) + (G.some(g => g.typ === "stall" && (g.stufe || 1) >= 3) ? 0.1 : 0); };   // Preisaufschlag nur, wenn es auch etwas dafür gibt (höchstens das Doppelte des Richtwerts)
      const preise = () => { if (!Sx.preisAbstand || istZucht()) return; const R = pensionRegeln(); if (jzJetzt() - (spiel.letztePreis ?? -99) < Sx.preisAbstand || jzJetzt() - (spiel.tsKuend ?? -99) < 2) return;
        const L = einstellerListe().filter(e => !e.art), bx = spiel.boxen.filter(b => !b.quar && !b.abfohl && !b.offen).length - eigene().length; if (Sx.zufriedenPflege && bx > 0 && L.length / bx < 0.5) { const alt0 = {}; [1, 2, 3].forEach(st => { if (!spiel.boxen.some(b => !b.paddock && !b.quar && !b.abfohl && !b.offen && boxenStufe(b) === st) || R.preis[st] <= PENSION_PREIS[st]) return; alt0[st] = R.preis[st]; R.preis[st] = Math.max(PENSION_PREIS[st], R.preis[st] - Math.max(10, Math.round(R.preis[st] * 0.1 / 10) * 10)); });
          if (Object.keys(alt0).length) { spiel.letztePreis = jzJetzt(); merk(`Pensionspreis gesenkt (Pension halb leer): ${Object.keys(alt0).map(st => `Stufe ${st} ${fmt(alt0[st])} → ${fmt(R.preis[st])}`).join(", ")}`); return; } }
        if (!L.length || bx <= 0 || pensionPlaetze() > 0) return;   // nur anheben, wenn alle Pensionsplätze belegt sind
         const z = L.reduce((a, e) => a + e.zufr, 0) / L.length; if (z < Sx.preisZufr) return;
        const alt = {}; [1, 2, 3].forEach(st => { if (!spiel.boxen.some(b => !b.paddock && !b.quar && !b.abfohl && !b.offen && boxenStufe(b) === st)) return; alt[st] = R.preis[st]; R.preis[st] = Math.min(Math.max(PENSION_PREIS[st], Math.round(pensionRichtwert(st) * Math.min(2, 1 + angebotBonus()) / 10) * 10), R.preis[st] + Math.max(10, Math.round(R.preis[st] * 0.1 / 10) * 10)); });
        spiel.letztePreis = jzJetzt(); merk(`Pensionspreis angehoben: ${Object.keys(alt).map(st => `Stufe ${st} ${fmt(alt[st])} → ${fmt(R.preis[st])}`).join(", ")} (Auslastung ${Math.round(L.length / bx * 100)} %, Zufriedenheit ${Math.round(z)})`); };
      // ---------- Voraussetzungen für Zusatzleistungen (Dome 6.11.: jeder Spieler kann das wie ein echter Spieler) ----------
      const maDa = typen => (spiel.mitarbeiter || []).some(m => typen.includes(m.typ) && m.bis == null);
      const pensBoxen = () => spiel.boxen.filter(b => !b.quar && !b.abfohl && !b.offen && !b.tot);
      const staubarm = () => pensBoxen().every(b => EINSTREU[b.einstreu] && !EINSTREU[b.einstreu].staub);
      const kannErfuellen = k => k === "putzen" || k === "medizin" || k === "waschen" ? true : true;   // Pflege macht der Spieler selbst; ein Pfleger erst, wenn er mindestens Sx.pflegerAb Pferde über seine 3 hinaus pflegen müsste (pflegerBedarf, Dome 7.11.)   // Bewegen: ein Bereiter nach Bedarf kommt von außerhalb (BEREITER_EXTERN), dafür braucht es keinen festen Bereiter
      const vorbereiten = () => { if (istZucht() || j < Sx.leistAb) return; const R = pensionRegeln(), k = Sx.leistungen.find(x => !R.leistungen[x] && leistungMoeglich(x) && !kannErfuellen(x)); if (!k) return;
        if (k === "putzen" || k === "medizin" || k === "waschen") { if ((spiel.geld || 0) > reserve() + 700) { try { mitarbeiterDialog("pfleger"); const b = document.querySelector("[data-einst]"); if (b) { b.click(); merk(`Pferdepfleger eingestellt (für die Zusatzleistung ${PENSION_LEISTUNG[k].n.replace(/\u00ad/g, '')})`); } } catch (e) { } zu(); } return; }
        if (k === "einstreu") { const F = futterkammer(); pensBoxen().filter(b => !(EINSTREU[b.einstreu] && !EINSTREU[b.einstreu].staub)).slice(0, 2).forEach(b => { if ((F.lager.spaene || 0) < EINSTREU.spaene.kg && (spiel.geld || 0) > 400 + reserve()) { try { futterKaufen("spaene", 200); } catch (e) { } }
            try { einstreuWahl(b); const x = document.querySelector('[data-estreu="spaene"]'); if (x && !x.disabled) { x.click(); merk(`Box ${bnr(spiel.boxen.indexOf(b))} auf Späne umgestellt`); } else zu(); } catch (e) { zu(); } }); } };
      const pflegerBedarf = () => { if (istZucht() || maDa(["pfleger", "pferdewirt", "pferdewirtHS"])) return; const n = einstellerListe().filter(e => !e.art && e.leistungen && (e.leistungen.putzen || e.leistungen.waschen || e.leistungen.medizin)).length; if (n - 3 < (Sx.pflegerAb || 4) || (spiel.geld || 0) <= reserve() + 700) return;
        try { mitarbeiterDialog("pfleger"); const b = document.querySelector("[data-einst]"); if (b) { b.click(); merk("Pferdepfleger eingestellt (" + n + " Pferde mit gebuchter Pflege, 3 macht er selbst)"); } } catch (er) { } zu(); };
      const einstreuWunsch = () => { if (istZucht()) return; einstellerListe().filter(e => !e.art && e.leistungen && e.leistungen.einstreu).forEach(e => { const b = spiel.boxen.find(x => x.pferd && fremd(x.pferd) && einstellerVon(x.pferd) === e); if (!b || b.offen || (EINSTREU[b.einstreu] && !EINSTREU[b.einstreu].staub)) return; const F = futterkammer(); if ((F.lager.spaene || 0) < EINSTREU.spaene.kg && (spiel.geld || 0) > 400 + reserve()) { try { futterKaufen("spaene", 200); } catch (er) { } }
          try { einstreuWahl(b); const x = document.querySelector('[data-estreu="spaene"]'); if (x && !x.disabled) { x.click(); merk("Box " + bnr(spiel.boxen.indexOf(b)) + " auf Späne umgestellt (Einsteller wünscht staubarme Einstreu)"); } else zu(); } catch (er) { zu(); } }); };   // Dome 7.11.: nur wenn ein Einsteller bessere Einstreu haben will
      // Einstreu-Vorrat für alle Boxen eine Jahreszeit im Voraus (wie jeder Spieler)
      const einstreuLager = () => { const F = futterkammer(), bed = {}; pensBoxen().forEach(b => { if (EINSTREU[b.einstreu]) bed[b.einstreu] = (bed[b.einstreu] || 0) + EINSTREU[b.einstreu].kg * tpj(); });
        Object.entries(bed).forEach(([k, x]) => { const unterwegs = (F.liefer || []).filter(q => q.k === k).reduce((a, q) => a + q.menge, 0); if ((F.lager[k] || 0) + unterwegs < x) { const menge = Math.min(Math.ceil(x * 2), Math.floor(F.lagerMax - lagerBelegt())); if (menge > 0 && (spiel.geld || 0) > menge * FUTTER[k].preis + 300) { try { futterKaufen(k, menge); } catch (e) { } } } }); };
      // ---------- Diagnose (DIAG=1): was bleibt liegen, warum sind Besitzer unzufrieden, warum werden Pferde krank, warum wird nicht gebaut/gekauft ----------
      const dl = t => { (T.dlog = T.dlog || []).push(t); };
      const diagnose = () => { T.dg = T.dg || {}; const D = (T.dg[j] = T.dg[j] || { tage: 0, boxen: 0, hunger: 0, hungerE: 0, mist: 0, mistE: 0, wasser: 0, wasserE: 0, weide: 0 }); D.tage++;
        spiel.boxen.forEach((b, i) => { const p = b.pferd; if (!p || b.tot) return; const e = fremd(p);
          if (p.weide) { const wv = weideVon(p); p.tsWeide = spiel.tag; p.tsMatsch = wv ? Math.round(wv.matsch) : null; p.tsGras = wv ? Math.round(wv.gras) : null; } if (!p.klinik) { D.boxen++; if (!b.krippeVoll && !p.weide) { D.hunger++; if (e) D.hungerE++; } if (b.mistig) { D.mist++; if (e) D.mistE++; } if (b.wasserTag !== spiel.tag) { D.wasser++; if (e) D.wasserE++; } if (p.weide) D.weide++; }
          befundListe(p).forEach(x => { if (x.tsG) return; x.tsG = true; dl(`Befund J${j} T${spiel.tag}: ${p.name} (${e ? "Einsteller" : "eigen"}, ${alterText(p)}) ${(KRANK[x.art] && KRANK[x.art].n) || x.art}, Grad ${x.grad}, Ursache: ${x.ursache || "?"} | Box ${bnr(i)}: Stufe ${boxenStufe(b)}, Zustand ${Math.round(gebZustand(b))}, Einstreu ${b.einstreu || "-"}, ${b.mistig ? "ungemistet" : "gemistet"}, Gesundheit ${Math.round((p.pflege && p.pflege.gesundheit) || 0)} % | ${["Frühling", "Sommer", "Herbst", "Winter"][datum().s]}, Herkunft: ${p.gekauftTag != null ? "gekauft vor " + (spiel.tag - p.gekauftTag) + " Tagen" : "länger im Stall"}${p.handel ? " (Handelspferd)" : ""}${p.quarantaene ? ", in Quarantäne" : ""}, Weide: ${p.tsWeide == null ? "noch nie draußen" : p.tsWeide === spiel.tag ? "heute draußen" : "zuletzt vor " + (spiel.tag - p.tsWeide) + " Tagen"}${p.tsWeide != null ? " (Matsch " + p.tsMatsch + " %, Gras " + p.tsGras + " %)" : ""}${/mauke|strahl/.test(x.art) ? " | Mauke-Details: " + JSON.stringify({ nass: p.nass, nassBeine: p.nassBeine, schweiss: p.schweiss, gewaschen: p.gewaschen, getrocknet: p.getrocknet, dreck: p.dreck, boxMist: b.mistStufe, einstreu: b.einstreu, hufAuftrag: p.hufAuftrag, ausgekratzt: p.ausgekratzt }) : ""}`); }); });
        const d = datum();
        if (d.t === 1 && T.dz !== jzJetzt()) { T.dz = jzJetzt(); const geld = spiel.geld || 0, G = gebaeude(), R = pensionRegeln(), E = einstellerListe().filter(e => !e.art), bx = pensBoxen().length;
          dl(`── J${j} Jahreszeit ${d.s} (Tag ${spiel.tag}): Kasse ${fmt(geld)}, Kredite ${fmt(kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rest : 0), 0))}, ${E.length} Einsteller von ${bx} Boxen`);
          E.forEach(e => dl(`   Besitzer ${eName(e)}: Zufriedenheit ${Math.round(e.zufr)} – ${(e.log || []).slice(0, 6).map(x => x.grund).join("; ") || "keine Beschwerden"} | zufrieden über: ${(e.plus || []).slice(0, 3).map(x => x.grund).join("; ") || "–"}`));
          E.filter(e => (e.log || []).some(x => /Weidegang/.test(x.grund))).forEach(e => { const b2 = spiel.boxen.find(x => x.pferd && fremd(x.pferd) && einstellerVon(x.pferd) === e), p2 = b2 && b2.pferd; dl("   kein Weidegang bei " + eName(e) + " (" + (p2 ? p2.name : "?") + "): Haltungswunsch " + e.haltung + ", Plan p.auslauf=" + ((p2 && p2.auslauf) || "-") + ", Quote diese Jz " + JSON.stringify(e.weideZ || null) + ", letzte Weide Tag " + (p2 && p2.weideZuletzt) + ", Hufrehe-Gefahr " + (p2 && reheGefaehrdet(p2)) + ", Boxenruhe " + (p2 && !!p2.boxenruhe) + ", Weiden: " + weiden().map(w => w.name + " Gras " + Math.round(w.gras) + "% Matsch " + Math.round(w.matsch) + "%" + (w.gesperrt ? " gesperrt" : "")).join("; ")); });
          const rep = G.filter(g => !g.abriss && !ohnePflege(g.typ) && g.zustand < 75).map(g => `${BAUTEN[g.typ].n.replace(/\u00ad/g, '')} Zustand ${Math.round(g.zustand)} (Reparatur ${fmt(reparaturPreis(g))})`);
          dl(`   Reparatur: ${rep.join(", ") || "nichts nötig"}${rep.length ? ` – Kasse ${fmt(geld)}, Polster ${fmt(polster())}` : ""}`);
          const sg = G.find(x => x.typ === "stall" && !x.abriss && (x.stufe || 1) < 2); if (sg) { const k = umbauPreis(sg), fehlt = k + Sx.bauReserve + polster() - geld; dl(`   Umbau Stufe 2: ${fmt(k)}; fehlt ${fmt(Math.max(0, fehlt))} (Kasse ${fmt(geld)}, Polster ${fmt(polster())}); Kredit erlaubt bis ${fmt(k * 0.6)} → ${fehlt <= 0 ? "Geld reicht" : fehlt <= k * 0.6 ? "mit Kredit möglich" : "zu teuer, Kredit reicht nicht"}`); }
          dl(`   Kaufen: Jahr>2 ${j > 2 ? "ja" : "NEIN"}, freie Box ${spiel.boxen.some(boxFrei) ? "ja" : "NEIN"}, Abstand ${jzJetzt() - (spiel.letzterKauf ?? -99) >= Sx.kaufAbstand ? "ja" : "NEIN"}, Pension läuft ${einnahmenOk() ? "ja" : "NEIN"}, Polster ${kannZahlen(0) ? "ja" : "NEIN"}`);
          const MA = (spiel.mitarbeiter || []).filter(m => m.bis == null).map(m => m.typ); dl(`   Personal: ${MA.join(", ") || "keins"}; Pferde ${spiel.boxen.filter(b => b.pferd && !b.tot).length}; angeboten: ${Object.keys(R.leistungen).filter(k => R.leistungen[k]).join(", ") || "nichts"}; Preis Stufe 1: ${fmt(R.preis[1])}`);
        }
        if (d.s === 3 && d.t === tpj()) dl("══ Jahr " + j + " Pensionsanfragen: " + JSON.stringify((T.anf || {})[j] || {}));
        if (d.s === 3 && d.t === tpj()) { const D2 = T.dg[j]; dl(`══ Jahr ${j} Versorgung abends (Durchschnitt je Tag, ${D2.tage} Tage): ${(D2.boxen / D2.tage).toFixed(1)} Pferde; ohne Heu/Futter ${(D2.hunger / D2.tage).toFixed(1)} (Einsteller ${(D2.hungerE / D2.tage).toFixed(1)}), ungemistet ${(D2.mist / D2.tage).toFixed(1)} (Einsteller ${(D2.mistE / D2.tage).toFixed(1)}), ohne Wasser ${(D2.wasser / D2.tage).toFixed(1)} (Einsteller ${(D2.wasserE / D2.tage).toFixed(1)}), auf der Weide ${(D2.weide / D2.tage).toFixed(1)}`); } };
      // ---------- Zusatzleistungen der Pension anbieten (Dome 6.11., je Spieler anders): eine neue je Jahreszeit, nur wenn sie im Spiel möglich ist ----------
      const angebot = () => { if (istZucht() || j < Sx.leistAb) return; const R = pensionRegeln(); const KL = Sx.leistungen.filter(x => !R.leistungen[x] && leistungMoeglich(x) && kannErfuellen(x)); KL.forEach(k => {
        R.leistungen[k] = true; spiel.letzteLeistung = jzJetzt(); merk(`Zusatzleistung in der Pension angeboten: ${PENSION_LEISTUNG[k].n.replace(/\u00ad/g, '')}`); }); };
      // ---------- Weidepflege (Dome 7.11.): zu Beginn jeder Jahreszeit abäppeln, im Frühling/Herbst die schlechteste Weide nachsäen (ruht dann); jeden Abend entscheiden, wer morgen raus darf: nur auf Weiden mit Matsch unter 50 % und Gras über 20 %, im Herbst jedes Pferd nur jeden 2. Tag, sonst Sandpaddock oder Box (gilt auch für Pferde, die Angestellte rausbringen) ----------
      const weidePflege2 = () => { if (!Sx.weidePflege || istZucht()) return; const d = datum(); if (d.t !== 1) return; const W = weiden().filter(w => !w.wiese && w.ha > 0); W.forEach(w => { w.aepfel = spiel.tag; w.kot = 0; });
        if (d.s === 0 || d.s === 2) { const w = W.filter(x => !x.gesperrt && !weidePferde(x).length && (x.gras < 60 || x.matsch >= 30)).sort((a, b) => a.gras - b.gras)[0]; if (w) { let f = ""; try { f = weideNachsaeen(w); } catch (er) { } if (!f) merk("Weide " + w.name + " nachgesät (ruht, Gras " + Math.round(w.gras) + " %, Matsch " + Math.round(w.matsch) + " %)"); } } };
      const weideSchutz = () => { if (!Sx.weidePflege || istZucht()) return; const s = datum().s, offen = weiden().filter(w => !w.gesperrt && !w.wiese && w.ha > 0 && w.matsch < GRAS.matschAb && w.gras >= GRAS.wenig).length > 0, pd = paddocks().length > 0; let pdFrei = pd ? paddockPlatzGesamtFrei() : 0;
        spiel.boxen.forEach((b, i) => { const p = b.pferd; if (!p || b.tot) return; const frei = offen && !(s === 2 && (spiel.tag + 1 + i) % 2 === 0);
          if (frei) { if (p.tsAusl) { delete p.auslauf; delete p.tsAusl; } } else if (!p.auslauf) { if (pd && pdFrei >= pdBedarf(p)) { p.auslauf = "paddock"; pdFrei -= pdBedarf(p); } else p.auslauf = "box"; p.tsAusl = 1; } }); };
      // ---------- Experte: Land dazupachten, wenn die Weiden zu klein werden oder matschen (Dome 7.11.): je 0,5 ha, höchstens 2 ha Pacht, nur mit Polster ----------
      const landPachten = () => { if (!Sx.weidePflege || istZucht() || datum().t !== 1 || datum().s === 3 || imBau().length) return; const H = spiel.hof; if (!H || (H.pacht || 0) >= 8) return;
        const W = weiden().filter(w => !w.gesperrt && !w.wiese && w.ha > 0); if (!W.length) return; const bedarf = spiel.boxen.reduce((a, b) => a + (b.pferd && !b.tot ? weideBedarf(b.pferd) : 0), 0);
        const fehlt = bedarf - weidenSumme(), matsch = W.some(w => w.matsch >= GRAS.matschAb && weidePferde(w).length >= 2) && bedarf > weidenSumme() * 0.8; if (!(fehlt > 0 || matsch)) return;   // nur pachten, wenn der Platz wirklich fehlt (mehr Pferde als Weidefläche) oder eine voll besetzte Weide matscht
        const x = Math.max(0.5, Math.ceil(Math.max(0, fehlt) / 0.5) * 0.5), zaun = bauPreis("weide", 1, { ha: x }), w = W.slice().sort((a, b) => weidePferde(b).length - weidePferde(a).length || b.matsch - a.matsch)[0]; if (!kannZahlen(zaun + x * PACHT_PREIS * 4)) return;
        H.pacht = runde2((H.pacht || 0) + x); if (bauStarten("weide", 1, { ha: x, ziel: w.wid }) && planAutoSetzen() >= 0) merk("Land gepachtet: " + x + " ha für " + w.name + " (Zaun " + fmt(zaun) + ", Pacht " + fmt(x * PACHT_PREIS) + " je Jahreszeit)"); else H.pacht = runde2(H.pacht - x); zu(); };
      // ---------- Kredite: aufnehmen, wenn knapp; tilgen, wenn viel da ist ----------
      const finanzen = () => { const rate = kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rate : 0), 0);
        if ((spiel.geld || 0) < rate + 300 && kreditRahmen() >= 1000) { const s = Math.min(kreditRahmen(), 3000); kreditNeu(s, 20, "Kredit Testspieler"); merk(`Kredit ${fmt(s)} aufgenommen`); }
        const ueber = (spiel.geld || 0) - Sx.tilgenAb - reserve(); if (ueber > 500) { const k = kredite().filter(k => kreditLaeuft(k) && !(k.offen || []).length && !(/Baukredit/.test(k.name || "") && imBau().length)).sort((a, b) => a.rest - b.rest)[0];
          if (k) { const b = Math.min(ueber, k.rest); buchen(-b, "Kredit: Sondertilgung"); k.rest = runde2(k.rest - b); k.getilgt = runde2(k.getilgt + b); if (!kreditLaeuft(k)) { kreditFertigBrief(k); merk(`${k.name} abbezahlt`); } } } };
      // ---------- 2. Hof (Zuchtstall) über den Makler ----------
      const zweiterHof = () => { if (j <= 2 || Sx.zweiterHof === false || hofReihe().length > 1 || aktivHid() !== "h1") return; const boxen = spiel.boxen.length; if (boxen < (Sx.stufe === "exp" ? 12 : 18)) return;
        let L; try { L = maklerAngebote(); } catch (e) { return; } const A = L.filter(x => !immoSperre2(x) || /zentralen Konto|Eigenanteil/.test(immoSperre2(x) || "")).sort((a, b) => a.preis - b.preis)[0]; if (!A) return;
        const eigen = Math.ceil(A.preis / 2), fehlt = eigen - zentral().geld; if (fehlt > 0) { if ((spiel.geld || 0) - fehlt < reserve() + 1000) return; buchen(-fehlt, "Überweisung ans zentrale Konto"); zentralBuchen(fehlt, "Überweisung"); }
        if (immoSperre2(A)) return; neuerHof(A, "Zucht " + spiel.spieler.name.slice(-1)); zu(); const hid = hofReihe()[hofReihe().length - 1];
        imHof(hid, () => { spiel.hof.art = "zucht"; spiel.stallarten = ["zucht"]; }); merk(`2. Hof gekauft: ${A.n} (${fmt(A.preis)}) – wird Zuchtstall`);
        // Zuchtpferde umziehen
        eigene().filter(p => p.geschlecht === "Stute" || p.geschlecht === "Hengst").forEach(p => { const b = boxVon(p); if (b && !ANH_ZIEL.umzug.sperre(p, b)) { try { umziehen(p, b, hid); } catch (e) { } } }); zu(); };
      const zuchtKasse = () => { const H = hofReihe(); if (H.length < 2) return; const hid = H[1]; let g2 = 0; imHof(hid, () => { g2 = spiel.geld || 0; });
        if (g2 < 1500 && (spiel.geld || 0) > reserve() + 2500) { const x = 1500; buchen(-x, "Überweisung an den Zuchthof"); imHof(hid, () => buchen(x, "Überweisung vom Pensionshof")); } };
      // ---------- ein Jahr spielen ----------
      for (let d = 0; d < 4 * tpj() && !T.pleite; d++) {
        tippRunde();
        const schritt = (n, f) => { try { f(); } catch (e) { T.err = T.err || {}; if (!T.err[n]) { T.err[n] = 1; merk(`Skriptfehler in ${n}: ${e.message}`); } } };
        jedenHof(() => { schritt("post", post); schritt("weidePflege2", weidePflege2); schritt("futter", futter); schritt("ausbildung", ausbildung); schritt("personal", personal); schritt("finanzen", finanzen); schritt("zucht", zucht); schritt("stallarbeit", stallarbeit); schritt("luecken", luecken); schritt("eigenePflege", eigenePflege); schritt("turniere", turniere); schritt("verkaufsrennen", verkaufsrennen); schritt("hausturnier", hausturnier); schritt("extern", externSchritt); schritt("ausbau", ausbau); schritt("bauen", bauen); schritt("zusatzbau", zusatzbau); schritt("reitplatz2", reitplatz2); schritt("roundpen2", roundpen2); schritt("buchTrack", buchTrack); schritt("kuendigung", kuendigung); schritt("briefLog", briefLog); schritt("zufriedenheit", zufriedenheit); schritt("landPachten", landPachten); schritt("preise", preise); schritt("einstreuWunsch", einstreuWunsch); schritt("einstreuLager", einstreuLager); schritt("pflegerBedarf", pflegerBedarf); schritt("vorbereiten", vorbereiten); schritt("angebot", angebot); schritt("notlage", notlage); schritt("wallache", wallache); schritt("handel", handel); schritt("training", training); schritt("weideSchutz", weideSchutz); });   // erst decken/verkaufen, dann rausbringen
        schritt("zweiterHof", zweiterHof); schritt("zuchtKasse", zuchtKasse); zu();
        if (Sx.diag) jedenHof(() => schritt("diagnose", diagnose));
        naechsteNacht(); zu(); if (spiel.verloren) { T.pleite = true; merk("PLEITE / Zwangsversteigerung"); }
      }
      // ---------- Jahresbericht ----------
      const H = hofReihe(); let zeile = []; let pensionBoxen = 0, zuchtPferde = 0;
      jedenHof(() => { const art = spiel.hof.art, eig = eigenePferdeHof().length, ein = einstellerListe().length;
        if (art === "zucht") zuchtPferde = Math.max(zuchtPferde, eig); else pensionBoxen = Math.max(pensionBoxen, spiel.boxen.length);
        zeile.push(`${spiel.hof.name} (${art}): ${spiel.boxen.length} Boxen, ${eig} eigene, ${ein} Einsteller, Kasse ${fmt(spiel.geld || 0)}`); });
      const kred = kreditSumme(), zielOk = H.length >= 2 && pensionBoxen >= 20 && zuchtPferde >= 10 && kred === 0;
      if (zielOk && !T.ziel) T.ziel = `Jahr ${j}`;
      return { jahr: j, zentral: fmt(zentral().geld), kredite: fmt(kred), hoefe: zeile, fohlenVerkauft: T.fohlenVerkauft, fohlenErloes: fmt(T.fohlenErloes), ziel: T.ziel || "nein", pleite: T.pleite };
    }, [S, j]);
    console.log(`Jahr ${r.jahr}: Kredite ${r.kredite} · zentral ${r.zentral} · Fohlen/Jungpferde verkauft ${r.fohlenVerkauft} (${r.fohlenErloes}) · Ziel: ${r.ziel}${r.pleite ? " · PLEITE" : ""}`);
    r.hoefe.forEach(h => console.log("   " + h));
    if (r.pleite) break;
  }
  const fin = await pg.evaluate(() => { const F = spiel.finanzen || {}, j = Object.keys(F).sort().slice(-2, -1)[0] || Object.keys(F).sort().pop(), J = F[j] || {};
    return `Finanzen ${j} (letztes volles Jahr, Pensionshof): ` + Object.entries(J).map(([k, v]) => [k, Math.round(v.ein - v.aus)]).filter(x => x[1]).sort((a, b) => a[1] - b[1]).map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`).join(" · "); });
  console.log(fin);
  const T = await pg.evaluate(() => ({ log: window.__T.log, verkauft: window.__T.verkauft, tipps: window.__T.tipps.length, befolgt: window.__T.befolgt.length, mahn: window.__T.mahn }));
  console.log(`Tipps gesehen ${T.tipps}, befolgt ${T.befolgt} · Mahnungen ${T.mahn}`);
  console.log("Verkauft:", T.verkauft.join("; ") || "–");
  console.log("Wichtige Ereignisse:\n  " + T.log.join("\n  "));
  console.log("HANDEL-BILANZ (je verkauftem Pferd: Verkauf · Einkauf · Kosten):\n  " + ((await pg.evaluate(() => window.__T.handelBuch)) || ["(keine echten Verkäufe)"]).join("\n  "));
  if (S.diag) console.log("DIAGNOSE:\n  " + ((await pg.evaluate(() => window.__T.dlog)) || []).join("\n  "));
  if (fehler.length) console.log("Spielfehler:", [...new Set(fehler)].slice(0, 10));
  await browser.close();
}

(async () => {
  const nr = process.argv[2], jahre = +process.argv[3] || 10;
  for (const n of nr && nr !== "alle" ? [nr] : [1, 2, 3]) await spiele(n, jahre);
})();
