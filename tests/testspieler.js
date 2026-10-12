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
       fuettern: 0.3, wasser: 0.35, misten: 0.45, putzen: 0.7, postSpaet: 0.5, anfrageAnnehmen: 0.6, futterErstWennLeer: true, tierarzt: 0.35, weide: 0.3, tippsBefolgen: 0.9,
       // Strategie: hält sich an den Start-Tipp, behält Fohlen aus Liebe zu lange, nimmt immer den günstigsten Hengst, verkauft Stuten nie, tilgt kaum
       stuten: 1, hengstTeuerAb: Infinity, fohlenFruehVerkaufenUnter: 300, stuteVerkaufenNach: 99, hengsteBehalten: true, bauReserve: 4000, tilgenAb: 20000, turniere: false, bauKredit: false, stuteAbBoxen: 0, bauWennFrei: 0 },
  2: { name: "Nr. 2 – Fortgeschritten (Spiel ein paar Mal gespielt, etwas Pferdeahnung, einige Fehler, befolgt Tipps teilweise)", stufe: "fort",
       fuettern: 0.1, wasser: 0.12, misten: 0.15, putzen: 0.4, postSpaet: 0.15, anfrageAnnehmen: 0.85, futterErstWennLeer: false, tierarzt: 0.7, weide: 0.7, tippsBefolgen: 0.5,
       // Strategie: Domes Weg fast genau – eine Stute, Hengst nach Kontostand, Fohlen früher verkaufen, wenn das Geld knapp ist, Stute nach dem 3. Fohlen verkaufen
       stuten: 1, hengstTeuerAb: 8000, fohlenFruehVerkaufenUnter: 1500, stuteVerkaufenNach: 3, hengsteBehalten: true, bauReserve: 1500, tilgenAb: 6000, turniere: true, bauKredit: true, stuteAbBoxen: 0, bauWennFrei: 1 },
  3: { name: "Nr. 3 – Experte (Spiel oft gespielt, kennt sich gut aus, wenige Fehler, macht eher sein Ding)", stufe: "exp",
       fuettern: 0.02, wasser: 0.02, misten: 0.03, putzen: 0.05, postSpaet: 0.02, anfrageAnnehmen: 1, futterErstWennLeer: false, tierarzt: 0.95, weide: 0.95, tippsBefolgen: 0.1,
       // Strategie: baut zuerst die Pension aus (sichere Einnahme), zwei Stuten, teurer Hengst ab 6.000 €, verkauft Fohlen gezielt nach der Fohlenschau, tilgt früh für den 2. Hof
       stuten: 2, hengstTeuerAb: 6000, fohlenFruehVerkaufenUnter: 2500, stuteVerkaufenNach: 3, hengsteBehalten: false, bauReserve: 800, tilgenAb: 4000, turniere: true, bauKredit: true, stuteAbBoxen: 12, bauWennFrei: 2 },
};

async function spiele(nr, jahre) {
  const S = SPIELER[nr];
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on("pageerror", e => fehler.push(e.message));
  await pg.goto("file://" + path.resolve(__dirname, "..", "index.html")); await pg.waitForTimeout(800);
  await pg.click("#smNeu"); await pg.fill("#chName", "Testspieler " + nr);
  await pg.click(`[data-stufe="${S.stufe}"]`); await pg.click("#chLos"); await pg.waitForTimeout(300);
  await pg.click("#dlgKnoepfe button"); await pg.click('[data-immo="pension"]'); await pg.fill("#kaufName", "Pension " + nr); await pg.click("#dlgKnoepfe button:first-child");
  await pg.waitForTimeout(500);

  console.log(`\n===== ${S.name} =====`);
  for (let j = 1; j <= jahre; j++) {
    const r = await pg.evaluate(([S, j]) => { const T = (window.__T = window.__T || { S, log: [], tipps: [], befolgt: [], fohlenVerkauft: 0, fohlenErloes: 0, verkauft: [], ziel: null, mahn: 0, pleite: false });
      const zuf = Math.random, zu = () => { $("dlg").hidden = true; }, Sx = T.S;
      const merk = t => { T.log.push(`J${j} T${spiel.tag}: ${t}`); };
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
      const verkaufen = (p, grund) => { const b = boxVon(p); if (!b || abgabeSperre(p, b, true) || angebotVon(p)) return false;
        if ((p.pflege.gesundheit || 0) < 85 && befundListe(p).length) { gesundMachen(p); return false; }   // erst gesund machen – bester Preis
        try { verkaufDialog(p, () => {}); const fp = $("festPreis"); if (!fp) { zu(); return false; } fp.value = Math.round(verkaufsWert(p) / 50) * 50; $("festLos").click(); zu(); } catch (e) { zu(); return false; }
        T.verkauft.push(`${p.name} (${alterText(p)}, ${grund}, Wert ${fmt(verkaufsWert(p))})`); return true; };
      // ---------- Post ----------
      const post = () => { if (zuf() < Sx.postSpaet) return;
        (spiel.rechnungen || []).slice().forEach(r => { if ((spiel.geld || 0) >= r.betrag) { if (r.stufe) T.mahn++; rechnungZahlen(r.id); zu(); } });
        kredite().forEach(k => { if ((k.offen || []).length) { kreditOffenZahlen(k.id); zu(); } });
        if (!istZucht()) (spiel.pensionAnfragen || []).filter(a => !a.angenommen && (Sx.stufe === "anf" || !(a.leistungen || {}).bewegen)).forEach(a => { if (zuf() < Sx.anfrageAnnehmen && !pensionAnnehmen(a)) (spiel.post || []).forEach(br => { if (br.aktion && br.aktion.aid === a.aid) br.aktion.antwort = "ja"; }); });
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
      const stallarbeit = () => { const s = datum().s, weideOk = s !== 3 && !(s === 2 && datum().t === tpj());
        spiel.boxen.forEach((box, i) => { const p = box.pferd; if (!p || box.tot || p.klinik || p.turnier) return; aktBox = i;
          if (!p.weide && !box.krippeVoll && zuf() > Sx.fuettern) { if (fuetternAusLager(box, "du", "rau")) box.krippeVoll = true; if (kraftNoetig(p, box)) { fuetternAusLager(box, "du", "kraft"); box.kraftVoll = true; } }   // erst füttern (Heu geht mit raus)
          if (box.mistig && zuf() > Sx.misten) { box.mistig = false; box.mistStufe = 0; }
          if (!fremd(p) && !p.weide && weideOk && !p.boxenruhe && !p.quarantaene && zuf() < Sx.weide) { const w = weideWahl(p); if (w && !grasWenig(p)) { try { aufWeide(p, box, null, w.wid); if (!wanneVoll(wanneOrt(p))) wannenFuellen(); } catch (e) { } } }
          if (box.wasserTag !== spiel.tag && zuf() > Sx.wasser) box.wasserTag = spiel.tag;
          if (!fremd(p) && zuf() > Sx.putzen) { putzen(p, "buerste"); putzen(p, "kamm"); }
          if (fremd(p)) { const e = einstellerVon(p); if (e && !e.art) try { pensionAufgaben(e, box).filter(x => !x.ok && zuf() > Sx.fuettern).forEach(x => {   // gebuchte Pensionsleistungen erledigen
              if (x.k === "weide" && weideOk) { const w = weideWahl(p); if (w) { aufWeide(p, box, null, w.wid); if (!wanneVoll(wanneOrt(p))) wannenFuellen(); } }
              if (x.k === "putzen") { putzen(p, "buerste"); putzen(p, "kamm"); } if (x.k === "pfleger") p.ausgekratzt = spiel.tag; if (x.k === "decke") e.decke = spiel.tag;
              if (x.k === "futter") { const WF = besitzerFutter(p, box); if (WF) p.futterplan = JSON.parse(JSON.stringify(WF)); }
              if (x.k === "medizin") befundListe(p).filter(b => b.diagnose).forEach(b => (PLAN[b.art] || []).forEach(k => { if (k !== "boxenruhe") try { behandeln(p, k, dosisKlasse(gewichtAnzeige(p)), "du"); } catch (er) { } })); }); } catch (er) { } }
          if (!fremd(p)) {   // Tierarzt rufen, dann den Plan befolgen (Dosis nach Gewicht)
            if (befundListe(p).some(b => b.bemerkt && !b.diagnose) && zuf() < Sx.tierarzt && (spiel.geld || 0) > TIERARZT_BESUCH) { try { tierarztBesuch(p, box, () => {}); } catch (e) { } knopf(); zu(); }
            const plan = new Set(); befundListe(p).filter(b => b.diagnose).forEach(b => (PLAN[b.art] || []).forEach(k => plan.add(k)));
            plan.forEach(k => { if (k === "boxenruhe") return; if (zuf() < Sx.tierarzt) { try { behandeln(p, k, dosisKlasse(gewichtAnzeige(p)), "du"); } catch (e) { } } });
          }
        }); };
      // ---------- Mitarbeiter: bis 5 Pferde selbst, ab dem 6. ein Stallbursche ----------
      const personal = () => { const n = pferdeZahl(), sb = (spiel.mitarbeiter || []).filter(m => m.typ === "stallbursche" && m.bis == null).length;
        if (n >= 6 && sb < Math.ceil((n - 5) / 3) && (spiel.geld || 0) > reserve() + 600) { try { mitarbeiterDialog("stallbursche"); const b = document.querySelector("[data-einst]"); if (b) { b.click(); merk(`Stallbursche eingestellt (${n} Pferde)`); } } catch (e) { } zu(); } };
      // ---------- Zucht nach Domes Strategie (mit Abweichungen je Typ) ----------
      const zucht = () => { const d = datum(), geld = spiel.geld || 0, E = eigene();
        // 1) Stuten besorgen (Tierschutz), nur auf dem Zuchthof bzw. solange es nur einen Hof gibt
        const stuten = E.filter(p => p.geschlecht === "Stute" && alterJahre(p) >= 3 && alterJahre(p) <= 18);
        const ziel = istZucht() ? 10 : Sx.stuten;
        if (spiel.boxen.length >= Sx.stuteAbBoxen && stuten.length < Math.min(ziel, Sx.stuten + (istZucht() ? 3 : 0)) && spiel.letzterKauf !== jzJetzt() && geld > reserve() + 800) {
          const M = marktNeu(), h = [...(M.notfall || []), ...(M.privat || [])].sort((a, b) => (a.preis || 0) - (b.preis || 0)).find(x => x.geschlecht === "Stute" && x.alter >= 4 && x.alter <= 14 && !(spiel.marktGekauft || []).includes(x.id) && (x.preis || 0) < geld - reserve());
          if (h && spiel.boxen.some(boxFrei)) { buchen(-AKU.mittel.preis, "AKU (Testspieler)"); pferdEinstellen(h, h.preis || 0, "Stute gekauft"); (spiel.marktGekauft = spiel.marktGekauft || []).push(h.id); spiel.letzterKauf = jzJetzt(); zu(); merk(`Stute ${h.name} gekauft (${fmt(h.preis || 0)})`); } }
        // 2) Decken – Frühling/Sommer, Hengst teuer oder günstig nach Kontostand
        if (d.s <= 1) stuten.forEach(p => { const b = boxVon(p); if (!b || p.traechtig || b.fohlen && alterJZ(b.fohlen) < 1 || zuchtSperre(p, b)) return;
          if ((p.fohlenZahl || 0) >= Sx.stuteVerkaufenNach) return;
          const H = deckhengste(p).filter(h => !groessenSperre(p, h)).sort((a, b) => decktaxe(a) - decktaxe(b)); if (!H.length) return;
          const h = geld > Sx.hengstTeuerAb ? H[H.length - 1] : H[0]; if (geld < decktaxe(h) + reserve()) return;
          try { verpaaren(p, h); knopf(); } catch (e) { } zu(); if (p.traechtig) { p.fohlenZahl = (p.fohlenZahl || 0) + 1; merk(`${p.name} gedeckt von ${h.name} (${fmt(decktaxe(h))})`); } });
        // 3) Fohlen: ab der 3. Jahreszeit in die Aufzuchtstation – oder früher verkaufen, wenn das Geld knapp ist
        spiel.boxen.forEach(b => { const f = b.fohlen; if (!f || fremd(f) || alterJZ(f) < 2) return;
          if (geld < Sx.fohlenFruehVerkaufenUnter) { const fr = freieBox(); if (fr >= 0) { fohlenUmstellen(b, fr); if (verkaufen(f, "Fohlen früh verkauft – Geld knapp")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(f); } } return; }
          const A = ANH_ZIEL.aufzucht; if (!A.sperre(f, b, true)) { try { A.aus(f, b, true); merk(`${f.name} in die Aufzuchtstation`); } catch (e) { } } });
        E.filter(p => alterJZ(p) >= 2 && alterJZ(p) < AUSBILDUNGSALTER && !p.weide).forEach(p => { const b = boxVon(p); if (!b || b.fohlen) return;
          if (geld < Sx.fohlenFruehVerkaufenUnter) { if (verkaufen(p, "Jungpferd früh verkauft – Geld knapp")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(p); } return; }
          const A = ANH_ZIEL.aufzucht; if (!A.sperre(p, b, false)) { try { A.aus(p, b, false); merk(`${p.name} (${alterText(p)}) in die Aufzuchtstation`); } catch (e) { } } });
        // Geld knapp: Jungpferde aus der Aufzuchtstation holen und verkaufen
        if (geld < Sx.fohlenFruehVerkaufenUnter / 2) (spiel.extern || []).filter(e => e.ort === "aufzucht").slice(0, 1).forEach(e => { const nb = zurueckholen(e); if (nb >= 0 && verkaufen(e.pferd, "Jungpferd aus der Aufzucht – Geld knapp")) { T.fohlenVerkauft++; T.fohlenErloes += verkaufsWert(e.pferd); } });
        // 4) Zurück aus der Aufzucht (3 Jahre): gute Stute behalten (Nachzucht), sonst verkaufen; Hengste trainieren, solange Geld da ist
        E.filter(p => alterJahre(p) >= 3 && alterJahre(p) < 5 && p.mutterId !== undefined || alterJahre(p) === 3).forEach(p => {
          if (angebotVon(p)) return;
          if (p.geschlecht === "Stute" && marktwert(p) > 3000 && stuten.length < (istZucht() ? 10 : Sx.stuten + 1)) return;   // gute Stute: weiterzüchten
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
      // ---------- Ausbau: Pension bis 20 Boxen, Pensionsplätze nachziehen ----------
      const ausbau = () => { if (istZucht()) return; const R = pensionRegeln(), boxen = spiel.boxen.filter(b => !b.quar && !b.abfohl && !b.offen).length, frei = spiel.boxen.filter(boxFrei).length;
        R.max = Math.max(R.max || 0, boxen - eigene().length - 1);
        if (boxen < 20 && frei <= Sx.bauWennFrei && !imBau().length && datum().s !== 3) { const n = Math.min(14, Math.max(6, 20 - boxen)), n2 = n % 2 ? n + 1 : n, k = bauPreis("stall", 1, { boxen: n2 });
          const fehlt = k + Sx.bauReserve + reserve() - (spiel.geld || 0);
          if (fehlt > 0 && Sx.bauKredit && kreditRahmen() >= fehlt) { const s2 = Math.ceil(fehlt / 500) * 500; kreditNeu(s2, 20, "Baukredit"); merk(`Baukredit ${fmt(s2)} (20 Raten) für den Stallbau`); }
          if ((spiel.geld || 0) > k + Sx.bauReserve + reserve()) { if (bauStarten("stall", 1, { boxen: n2 })) merk(`Boxenstall mit ${n2} Boxen gebaut (${fmt(k)})`); zu(); } } };
      // ---------- Kredite: aufnehmen, wenn knapp; tilgen, wenn viel da ist ----------
      const finanzen = () => { const rate = kredite().reduce((a, k) => a + (kreditLaeuft(k) ? k.rate : 0), 0);
        if ((spiel.geld || 0) < rate + 300 && kreditRahmen() >= 1000) { const s = Math.min(kreditRahmen(), 3000); kreditNeu(s, 20, "Kredit Testspieler"); merk(`Kredit ${fmt(s)} aufgenommen`); }
        const ueber = (spiel.geld || 0) - Sx.tilgenAb - reserve(); if (ueber > 500) { const k = kredite().filter(k => kreditLaeuft(k) && !(k.offen || []).length).sort((a, b) => a.rest - b.rest)[0];
          if (k) { const b = Math.min(ueber, k.rest); buchen(-b, "Kredit: Sondertilgung"); k.rest = runde2(k.rest - b); k.getilgt = runde2(k.getilgt + b); if (!kreditLaeuft(k)) { kreditFertigBrief(k); merk(`${k.name} abbezahlt`); } } } };
      // ---------- 2. Hof (Zuchtstall) über den Makler ----------
      const zweiterHof = () => { if (hofReihe().length > 1 || aktivHid() !== "h1") return; const boxen = spiel.boxen.length; if (boxen < (Sx.stufe === "exp" ? 12 : 18)) return;
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
        jedenHof(() => { schritt("post", post); schritt("futter", futter); schritt("personal", personal); schritt("finanzen", finanzen); schritt("zucht", zucht); schritt("stallarbeit", stallarbeit); schritt("turniere", turniere); schritt("ausbau", ausbau); });   // erst decken/verkaufen, dann rausbringen
        schritt("zweiterHof", zweiterHof); schritt("zuchtKasse", zuchtKasse); zu();
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
  if (fehler.length) console.log("Spielfehler:", [...new Set(fehler)].slice(0, 10));
  await browser.close();
}

(async () => {
  const nr = process.argv[2], jahre = +process.argv[3] || 10;
  for (const n of nr && nr !== "alle" ? [nr] : [1, 2, 3]) await spiele(n, jahre);
})();
