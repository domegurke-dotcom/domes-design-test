// Pensionspferd krank (v633): nicht angebotene Leistungen, Tierarzt 1× je Tag, Besitzer informieren + Behandlung vorschlagen, Rückmeldung zur Einschätzung
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/pension-krank-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(async () => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; const R = {};
    pensionRegeln().offen = true; pensionAnfrageNeu(); pensionAnnehmen(spiel.pensionAnfragen[0]); spiel.tag += 1; hofMorgen();
    const e = einstellerListe()[0], bx = spiel.boxen.find(x => x.pferd && fremd(x.pferd)), p = bx.pferd; R.da = !!(e && p);
    // 1. nicht angebotene Leistung entfällt
    pensionRegeln().leistungen.medizin = false; e.leistungen.medizin = true; e.leistungen.putzen = true; pensionRegeln().leistungen.putzen = true;
    pensionLeistungenBereinigen(); R.entfaellt = !e.leistungen.medizin && !!e.leistungen.putzen;
    e.leistungen.medizin = true; R.betragOhne = pensionLeistBetrag(e) === pensionLeistBetrag({ ...e, leistungen: { putzen: true } }) || true;   // Bereinigung läuft morgens
    pensionMorgen(); R.morgenBereinigt = !e.leistungen.medizin;
    // 2. Tierarzt nur 1× je Tag
    p.tierarztTag = spiel.tag; spiel.aktBox = spiel.boxen.indexOf(bx); aktBox = spiel.aktBox; aktenModus = "pflege"; aktenReiter = "gesundheit"; zeigeSchirm(null); zeigeTag(); zeigeAkte();
    const tk = document.getElementById("tierarztKnopf"); R.knopf = !!tk; if (tk) tk.click(); R.limit = /nur <b>einmal am Tag|einmal am Tag/.test(document.getElementById("dlgInhalt").textContent); document.getElementById("dlg").hidden = true; delete p.tierarztTag;
    // 3. Besitzer informieren
    pensionRegeln().leistungen.medizin = true; befundNeu(p, "strahlfaeule", 2, "Stallluft", "du"); const bf = p.befunde.find(x => x.art === "strahlfaeule"); bf.bemerkt = { von: "du", tag: spiel.tag }; delete bf.inkub; bf.vermutung = { art: "strahlfaeule", von: "du" };
    zeigeAkte(); R.vorKnopf = !!document.querySelector("[data-besvor]");
    besitzerVorschlagDialog(p, bx, bf); const knoepfe = [...document.querySelectorAll("#dlgKnoepfe button")].map(x => x.textContent); R.knoepfe = knoepfe;
    [...document.querySelectorAll("#dlgKnoepfe button")].find(x => /durch uns/.test(x.textContent)).click(); R.gesendet = !!bf.besV && bf.besV.w === "uns"; document.getElementById("dlg").hidden = true;
    // 4. Besitzer vertraut → Behandlung läuft über uns, kein Tierarzt von selbst
    const r0 = Math.random; Math.random = () => 0; e.zufr = 90; spiel.tag += 1; besitzerVorschlagTag(); Math.random = r0;
    R.vertraut = bf.besV.entscheid === "uns" && !!e.leistungen.medizin && !bf.tierarzt; R.haelt = besHaelt(bf);
    R.briefVertrauen = (spiel.post || []).some(x => /Ich vertraue/.test(x.betreff));
    // 5. falsche Einschätzung → Zufriedenheit sinkt + Brief; richtige steigt
    const z0 = e.zufr; bf.besV.art = "hautpilz"; tierarztBesuch(p, bx, null, eName(e)); R.falsch = e.zufr < z0 && (spiel.post || []).some(x => /Einschätzung war falsch/.test(x.betreff));
    // richtig
    befundNeu(p, "strahlfaeule", 2, "Stallluft", "du"); const b2 = p.befunde.find(x => x.art === "strahlfaeule" && x !== bf && !x.diagnose); if (b2) { b2.bemerkt = { von: "du", tag: spiel.tag }; delete b2.inkub; b2.besV = { tag: spiel.tag - 1, w: "tierarzt", art: "strahlfaeule", grad0: b2.grad, entscheid: "tierarzt" }; const z1 = e.zufr; tierarztBesuch(p, bx, null, eName(e)); R.richtig = e.zufr > z1 && (spiel.post || []).some(x => /Einschätzung stimmte/.test(x.betreff)); } else R.richtig = "kein zweiter Befund";
    return R; });
  const out = [], ok = (n, c) => out.push((c === true ? '✓ ' : '✗ ') + n + (c === true ? '' : ' → ' + JSON.stringify(c)));
  ok('Einsteller da', R.da); ok('nicht angebotene Leistung entfällt, angebotene bleibt', R.entfaellt); ok('Morgenrunde bereinigt', R.morgenBereinigt); ok('Tierarzt-Knopf da', R.knopf); ok('Tierarzt nur 1× je Tag (Pensionspferd)', R.limit);
  ok('Knopf „Besitzer informieren“ erscheint', R.vorKnopf); ok('Dialog bietet Tierarzt und Behandlung durch uns', R.knoepfe && R.knoepfe.some(x => /Tierarzt/.test(x)) && R.knoepfe.some(x => /durch uns/.test(x))); ok('Vorschlag gespeichert', R.gesendet);
  ok('Besitzer vertraut: Behandlung über uns, Medikamente-Leistung gebucht, kein Tierarzt', R.vertraut); ok('Besitzer ruft den Tierarzt nicht von selbst (besHaelt)', R.haelt); ok('Brief „Ich vertraue …“', R.briefVertrauen);
  ok('falsche Einschätzung: Zufriedenheit sinkt, Brief', R.falsch); ok('richtige Einschätzung: Zufriedenheit steigt, Brief', R.richtig); ok('keine Seitenfehler', errs.length ? errs : true);
  console.log(out.join('\n')); await b.close();
})();
