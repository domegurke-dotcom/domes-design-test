// KIT-Gen (Dome 30.10.): Tobiano, Sabino, Roan, Dominant White – höchstens zwei Anlagen je Pferd, vererbt wird der ganze Platz
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const fehler = []; pg.on('pageerror', e => fehler.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const E = [], ok = (n, w) => E.push([n, !!w]);
    const roh = o => genNorm(Object.assign(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]])), o));
    // 1. verschieben statt streichen
    let g = roh({}); g.To = ["To", "n"]; g.Sb = ["Sb", "n"]; const weg1 = kitFix(g);
    ok("To + Sb auf Platz 0 → Sb rutscht auf Platz 1", !weg1 && g.To[0] === "To" && g.Sb[1] === "Sb" && g.Sb[0] === "n");
    // 2. zu viele → streichen
    g = roh({}); g.To = ["To", "To"]; g.Sb = ["Sb", "n"]; const weg2 = kitFix(g);
    ok("To/To + Sb → Sb gestrichen", weg2 && anzahl(g, "To") === 2 && anzahl(g, "Sb") === 0);
    g = roh({}); g.W = ["W", "n"]; g.To = ["To", "n"]; g.Rn = ["n", "Rn"]; g.Sb = ["n", "Sb"]; kitFix(g);
    ok("4 Anlagen → 2 bleiben (W und To)", KIT.reduce((n, k) => n + anzahl(g, k), 0) === 2 && hat(g, "W") && hat(g, "To"));
    // 3. Vererbung
    const M = roh({ To: ["To", "n"], Sb: ["n", "Sb"] }), V = roh({ Rn: ["Rn", "n"], W: ["n", "W"] });
    let viel = 0, beideMutter = 0, toSb = 0; const arten = {};
    for (let i = 0; i < 2000; i++) { const f = genVererben(M, V), n = KIT.reduce((s, k) => s + anzahl(f, k), 0); if (n > 2) viel++; if (hat(f, "To") && hat(f, "Sb")) beideMutter++;
      const a = KIT.filter(k => hat(f, k)).join("+"); arten[a] = (arten[a] || 0) + 1; }
    ok("Fohlen nie mehr als 2 KIT-Anlagen", viel === 0);
    ok("nie Tobiano und Sabino zugleich von der Mutter (To/Sb-Mutter)", beideMutter === 0);
    ok("4 Kombinationen je etwa ein Viertel", Object.keys(arten).length === 4 && Object.values(arten).every(x => x > 400 && x < 600));
    // 4. alter Spielstand: To/To + Sb → Sb weg, Farbe neu
    const p = { id: "kittest1", rasse: "paint", geschlecht: "Stute", farbe: "braunschecke", gen: roh({}), ex: exZufall(zufall("kt")), swV: 1, nd1V: 1, dunCrV: 1 };
    p.gen = Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]])); p.gen.E = ["E", "E"]; p.gen.A = ["A", "A"]; p.gen.To = ["To", "To"]; p.gen.Sb = ["Sb", "n"];
    genVon(p); ok("altes Pferd: Sb gestrichen, Tobiano bleibt", anzahl(p.gen, "To") === 2 && !hat(p.gen, "Sb") && kitOk(p.gen));
    // 5. Stichprobe Rassen
    let falsch = 0; ["paint", "clydesdale", "isi", "appaloosa", "noriker", "tinker"].forEach(ra => { const z = zufall("kit-" + ra);
      for (let i = 0; i < 500; i++) { const q = genNorm(Object.fromEntries(GENE.map(([k]) => [k, [allel(ra, k, z), allel(ra, k, z)]]))); if (!kitOk(q)) falsch++; } });
    ok("Stichprobe 6 Rassen: alle höchstens 2", falsch === 0);
    return E; });
  let alle = true; r.forEach(([n, w]) => { console.log((w ? "✓ " : "✗ ") + n); if (!w) alle = false; });
  if (fehler.length) { console.log("✗ Seitenfehler:", fehler); alle = false; }
  console.log(alle ? "KIT-Test grün" : "KIT-Test ROT"); await b.close(); process.exit(alle ? 0 : 1);
})();
