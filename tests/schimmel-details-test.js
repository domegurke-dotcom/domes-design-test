// Schimmel-Details (Dome 30.10., Grey-PDF): Grau-Fohlen dunkel mit Brille, Langhaar bleibt dunkel, Blutmale, Vitiligo, G/G seltener Fliegen und mehr Melanome
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const fehler = []; pg.on('pageerror', e => fehler.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const E = [], ok = (n, w, x) => E.push([n, !!w, x]);
    const mk = (id, jahre, ex, gg) => { const p = { id, rasse: "araber", geschlecht: "Stute", farbe: "rappe", ex: Object.assign(exZufall(zufall(id)), { grauTempo: 6, kurve: 0, maehne: 0, apfel: .1, fliegen: .1 }, ex || {}), swV: 1, nd1V: 1, dunCrV: 1 };
      p.gen = Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]])); p.gen.E = ["E", "E"]; p.gen.A = ["a", "a"]; p.gen.G = gg || ["G", "g"];
      p.geb = { jahr: 0, jz: 0 }; p.alterFest = jahre; return p; };
    const altSet = (p, j) => { p.gebTag = undefined; const st = grauStand(p, j); return st; };
    // Fohlen
    const f = mk("sd-f", 0.3); const so = (() => { const o = grauStand(f, .3); return o; })();
    ok("Grau-Fohlen: Stand fast dunkel", so && so.t < .1, so && so.t);
    // Langhaar dunkel
    const L = mk("sd-l", 20, { ldA: .1 }), sl = grauStand(L, 20);
    ok("Langhaar-dunkel-Typ wird nie ganz weiß", sl.t <= SCHIMMEL_X.langT && sl.tm <= SCHIMMEL_X.langTm, JSON.stringify([sl.t, sl.tm]));
    const N = mk("sd-n", 20, { ldA: .9 }), sn = grauStand(N, 20);
    ok("normaler Schimmel mit 20 ganz weiß", sn.t >= 1, sn.t);
    // G/G Fliegen
    const F1 = mk("sd-fl1", 20, { ldA: .9, fliegen: .6, fliegenAb: 10 }), F2 = mk("sd-fl2", 20, { ldA: .9, fliegen: .6, fliegenAb: 10 }, ["G", "G"]);
    ok("G/g mit Fliegen-Anlage .6 → Fliegenschimmel", /fliegen/.test(fb(F1, 20)), fb(F1, 20));
    ok("G/G mit Fliegen-Anlage .6 → kein Fliegenschimmel", !/fliegen/.test(fb(F2, 20)), fb(F2, 20));
    // Anteile über viele Pferde
    let blut = 0, vit = 0, lang = 0, n = 2000;
    for (let i = 0; i < n; i++) { const p = mk("sd-z" + i, 16); if (anl(p, "blutA") < SCHIMMEL_X.blut) blut++; if (anl(p, "vitA") < SCHIMMEL_X.vit) vit++; if (anl(p, "ldA") < SCHIMMEL_X.langDunkel) lang++; }
    ok("Blutmale etwa 4 %", blut / n > .02 && blut / n < .07, blut / n);
    ok("Vitiligo etwa 10 %", vit / n > .07 && vit / n < .13, vit / n);
    ok("dunkles Langhaar etwa 20 %", lang / n > .16 && lang / n < .24, lang / n);
    // Zeichnung
    const z = zeichnePferd("araber", "schimmel", { seed: "t", blutmal: 1, vitiligo: 1 }).svg, zf = zeichnePferd("araber", "rappe", { seed: "t", alterStufe: "fohlen", grauFohlen: 1 }).svg;
    ok("Blutmale werden gezeichnet", /bml-/.test(z)); ok("Grau-Fohlen-Zeichnung ohne Fehler", zf.length > 1000);
    return E; });
  let alle = true; r.forEach(([n, w, x]) => { console.log((w ? "✓ " : "✗ ") + n + (x != null ? " – " + x : "")); if (!w) alle = false; });
  if (fehler.length) { console.log("✗ Seitenfehler:", fehler); alle = false; }
  console.log(alle ? "Schimmel-Details grün" : "Schimmel-Details ROT"); await b.close(); process.exit(alle ? 0 : 1);
})();
