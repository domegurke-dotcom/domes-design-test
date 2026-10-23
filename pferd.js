// =====================================================================
//  Pferde-Generator: Rassen, Fellfarben und SVG-Zeichnung
//  Einheiten: Widerristhöhe = 100, Boden bei y = 0, Pferd schaut nach links
// =====================================================================

// ---------- Fellfarben ----------
const FARBEN_BASIS = {
  schimmel:      { name: "Schimmel (weiß)",        body: "#f3f1ed", mane: "#e2ddd3", muzzle: "#6f6a6a", hoof: "#8a8580", grau: 1 },
  grauschimmel:  { name: "Rappschimmel",           body: "#6f6c6a", mane: "#2a2726", points: "#2f2c2b", head: "#4e4b49", muzzle: "#2f2b2b", pattern: "roan", hoof: "#2c2a29" },
  braunschimmel: { name: "Braunschimmel",          body: "#a2887a", mane: "#3a302c", points: "#4a3d36", head: "#b4a196", muzzle: "#3a302c", pattern: "roan", hoof: "#3a3230" },
  fuchsschimmel: { name: "Fuchsschimmel",          body: "#c9a48e", mane: "#b98a6c", head: "#d6bcab", muzzle: "#6f5a50", pattern: "roan", hoof: "#6a5246" },
  fliegenschimmel: { name: "Fliegenschimmel",      body: "#eeebe5", mane: "#d6d0c6", muzzle: "#6f6a6a", hoof: "#8a8580", grau: 1, pattern: "fleck", fleck: "#8b5a3e" },
  apfelschimmel: { name: "Apfelschimmel",          body: "#b9b9b6", mane: "#626262", points: "#666666", head: "#aaaaa7", muzzle: "#4a4646", grau: .6, pattern: "dapple", dapple: "#e6e6e3", hoof: "#474442" },
  rappe:         { name: "Rappe (schwarz)",        body: "#211e1f", mane: "#121011", hoof: "#2c2a29" },
  brauner:       { name: "Brauner",                body: "#7c3f1d", mane: "#161212", points: "#1b1616", hoof: "#2c2a29" },
  dunkelbrauner: { name: "Dunkelbrauner",          body: "#58301b", russ: "#2a1810", mane: "#120f0f", points: "#161212", hoof: "#2c2a29" },   // v485 (Dome): Ruß oben (Kopf, Hals, Rücken, Kruppe), Bauch/Flanke heller
  fuchs:         { name: "Fuchs",                  body: "#b65a29", mane: "#a64c22", hoof: "#4a3a30" },
  dfuchs:        { name: "Dunkelfuchs",            body: "#86401f", russ: "#4a2010", mane: "#5f2913", hoof: "#3c3029" },
  hellfuchs:     { name: "Fuchs mit Flachsmähne",  body: "#c98843", mane: "#f3e6c2", hoof: "#4a3a30" },
  dunkelfuchs:   { name: "Dunkelfuchs mit Flachsmähne", body: "#96502a", russ: "#52281a", mane: "#eadbb0", hoof: "#3c3029" },
  palomino:      { name: "Palomino",               body: "#dcb164", mane: "#f6eed6", hoof: "#6b5a48" },
  isabell:       { name: "Isabell (Cremello)",     body: "#efe4cc", mane: "#f7f1e3", muzzle: "#d8a699", hoof: "#b9a88f" },
  buckskin:      { name: "Buckskin",               body: "#c9a064", mane: "#171313", points: "#1d1818", hoof: "#2c2a29" },
  russbuckskin:  { name: "Rußfalbe (Sooty Buckskin)", body: "#c2a172", russ: "#5f4d3d", mane: "#141111", points: "#1a1515", hoof: "#2c2a29" },   // v484 (Dome): Buckskin mit Rußanflug (Sty) – dunkler Kopf/Hals, heller Körper
  braunfalbe:    { name: "Braunfalbe",             body: "#c9a878", mane: "#1d1818", points: "#2a2220", stripe: "#2a2220", hoof: "#2c2a29" },
  rotfalbe:      { name: "Rotfalbe",               body: "#d8a882", mane: "#9a5a38", stripe: "#9e5c38", hoof: "#5a4538" },
  mausfalbe:     { name: "Mausfalbe (Grullo)",     body: "#8f887c", mane: "#1a1818", points: "#1f1d1c", stripe: "#1f1d1c", head: "#6d675f", hoof: "#2c2a29" },
  weissfalbe:    { name: "Weißfalbe",              body: "#efe5cc", mane: "#ebdfc4", stripe: "#c3a67a", hoof: "#8a7a66" },
  gelbfalbe:     { name: "Gelbfalbe",              body: "#e2c07f", mane: "#efe3c4", stripe: "#b3844a", hoof: "#6b5a48" },
  windfarben:    { name: "Windfarben (Silver)",    body: "#5c4034", mane: "#ded6c7", points: "#4d362c", hoof: "#3a302a" },
  rappschecke:   { name: "Rappschecke",            body: "#211e1f", mane: "#121011", hoof: "#2c2a29", pattern: "tobiano" },
  braunschecke:  { name: "Braunschecke",           body: "#7c3f1d", mane: "#161212", points: "#1b1616", hoof: "#2c2a29", pattern: "tobiano" },
  fuchsschecke:  { name: "Fuchsschecke",           body: "#b65a29", mane: "#a64c22", hoof: "#4a3a30", pattern: "tobiano" },
  blueroan:      { name: "Blue Roan",              body: "#757c82", mane: "#1a1818", points: "#222021", head: "#2c2a2a", pattern: "roan", hoof: "#2c2a29" },
  rotschimmel:   { name: "Rotschimmel (Roan)",     body: "#c3947c", mane: "#8a4424", points: "#8f4a28", head: "#9a4e2a", pattern: "roan", hoof: "#4a3a30" },
  hellbrauner:   { name: "Hellbrauner",            body: "#a8643a", mane: "#1d1716", points: "#2a201c", hoof: "#2c2a29" },
  schwarzbrauner:{ name: "Schwarzbrauner",         body: "#2a1d18", mane: "#100d0d", points: "#141010", muzzle: "#8a5a3a", hoof: "#2c2a29" },
  lethalwhite:   { name: "Weiß (Lethal White)",    body: "#f7f3ee", mane: "#f3eee6", muzzle: "#e3b5ae", hoof: "#cdbfa8" },
};
// Scheckungen, die auf jeder Grundfarbe vorkommen: Kürzel + "_" + Grundfarbe (z. B. "ov_brauner")
//  to Tobiano (v505) · ov Overo · tv Tovero · tg Tigerschecke · fs Wenigpunkt-Tiger · sb Schabrackentiger · sk Schabracke ohne Punkte (Snowcap) · sa Sabino (v316) · sw Splashed White (v426)
const MUSTER = {
  to: ["Schecke", "tobiano"], ov: ["Overo", "overo"], tv: ["Tovero", "tovero"], tg: ["Tigerschecke", "leopard"], fs: ["Wenigpunkt-Tiger", "fewspot"], sb: ["Schabrackentiger", "blanket"], sk: ["Schabracke ohne Punkte", "snowcap"], sa: ["Sabino", "sabino"], sw: ["Splashed White", "splash"],
};
function musterFarbe(id, t) {
  const m = /^(to|ov|tv|tg|fs|sb|sk|sa|sw)_(.+)$/.exec(id); if (!m || !t[m[2]]) return null;   // v505: to_ = Tobiano auf jeder Grundfarbe (Rapp-/Braun-/Fuchsschecke bleiben eigene Farben)
  const B = t[m[2]], [name, pattern] = MUSTER[m[1]], e = { ...B, pattern, name: `${name} (${B.name.replace(/ \(.*\)$/, "")})` };
  if (pattern === "leopard" || pattern === "fewspot") delete e.stripe;   // v510 (Dome): Aalstrich bleibt bei Scheckungen (wird unter dem Weiß gezeichnet), nur bei fast weißen Tigern nicht
  if (pattern === "tovero" || pattern === "fewspot") { e.head = mix(B.head || B.body, "#f7f5f1", pattern === "fewspot" ? .75 : .2); e.hoof = "#b8a88f"; }
  if (pattern === "leopard") { e.head = mix(B.head || B.body, "#f7f5f1", .45); e.hoof = "#b8a88f"; }
  if (pattern === "tovero" || pattern === "fewspot" || pattern === "leopard") e.muzzle = "#c9a49a";
  if (pattern === "sabino" || pattern === "splash") e.hoof = "#b8a88f";   // weiße Beine → helle Hufe; v506 (Dome): kein pauschal rosa Maul mehr – rosa Haut nur unter dem Kopfabzeichen (Domes Schnippe/Laterne)
  return e;
}
// Roan in 3 Stufen (v439): wenig = Grundfarbe scheint stärker durch, viel = sehr hell; andere Muster unverändert (deren Stufe steckt in der Zeichnung)
function musterStufeFarbe(C, st) {
  if (st == null || st === 1 || C.pattern !== "roan" || C.roanDeck != null) return C;   // roanDeck = Schimmel im Ausgrauen, nicht betroffen
  return { ...C, body: st === 0 ? mix(C.body, C.points || C.mane || C.body, .45) : mix(C.body, "#f2efe9", .35) };   // Stufe 3 („fast weiß“) gibt es beim Roan nicht – wie „viel“
}
const FARBEN = new Proxy(FARBEN_BASIS, { get(t, k) { if (typeof k === "string" && !(k in t)) { const e = musterFarbe(k, t); if (e) t[k] = e; } return t[k]; } });


// ---------- Rassen ----------
// Körperwerte relativ zur Widerristhöhe:
// len Rumpflänge · depth Rumpftiefe · legT Beindicke · neck Halslänge · nAng Halswinkel
// crest Mähnenkamm · head Kopflänge · hAng Kopfwinkel · profile (-1 Hechtkopf … +1 Ramskopf)
// hw Kopfbreite · jw Ganasche · muz Maulgröße · ear Ohrlänge · curl Marwari-Ohren
// mane Mähnenart · maneLen · vol · fore Schopf · tail Schweiflänge · tvol · tset Schweifansatz
// feather Kötenbehang · croup Kruppenneigung · hq Hinterhand · eye Augengröße
const RASSEN = [
  { id: "araber", name: "Araber", herkunft: "Arabische Halbinsel", h: [145, 155],
    text: "Edles Wüstenpferd mit Hechtkopf, großen Augen, flacher Kruppe und hoch getragenem Schweif.",
    farben: ["schimmel", "fliegenschimmel", "fuchs", "dfuchs", "brauner", "rappe"],
    k: { len: .96, depth: .42, legT: .072, neck: .56, nAng: 54, crest: .03, head: .35, hAng: 52, profile: -1, hw: .92, jw: 1.2, muz: .8, ear: .09, mane: "lang", maneLen: .13, vol: .6, fore: .5, tail: .62, tvol: .7, tset: 1, feather: 0, croup: 0, hq: 1, eye: 1.3 } },
  { id: "friese", name: "Friese", herkunft: "Niederlande", h: [158, 172],
    text: "Barockes Rappenpferd mit hoch aufgesetztem Hals, üppiger Mähne und langem Kötenbehang.",
    farben: ["rappe"],
    k: { nk: 1, len: 1.0, depth: .47, legT: .095, neck: .6, nAng: 64, crest: .08, head: .44, hAng: 62, profile: .1, hw: 1, jw: 1, muz: 1, ear: .11, mane: "lang", maneLen: .38, vol: 1.1, fore: 1, tail: .95, tvol: 1.2, tset: .1, feather: .75, croup: .5, hq: 1, eye: 1 } },
  { id: "marwari", name: "Marwari", herkunft: "Indien (Rajasthan)", h: [145, 163],
    text: "Kriegspferd der Rajputen – berühmt für die nach innen gebogenen Ohren, deren Spitzen sich berühren.",
    farben: ["brauner", "fuchs", "dfuchs", "schimmel", "braunfalbe", "braunschecke"],
    k: { nk: 0.3, len: 1.0, depth: .41, legT: .075, neck: .56, nAng: 58, crest: .04, head: .42, hAng: 55, profile: .3, hw: .95, jw: 1, muz: .9, ear: .115, curl: true, mane: "lang", maneLen: .12, vol: .6, fore: .4, tail: .7, tvol: .8, tset: .5, feather: 0, croup: .3, hq: 1, eye: 1.1 } },
  { id: "fjord", name: "Fjordpferd (Norweger)", herkunft: "Norwegen", h: [135, 150],
    text: "Kompaktes Falbpferd aus Norwegen. Fünf Farbschläge: Braunfalbe (norweg. brunblakk, rund 90 %), Rotfalbe (rødblakk), Mausfalbe (grå), Weißfalbe (ulsblakk) und Gelbfalbe (gulblakk, sehr selten). Typisch sind die Urzeichnung – Aalstrich vom Schweif über den Rücken bis in die Mähne, oft Zebrastreifen an den Beinen und dunkle Streifen am Widerrist bzw. an der Schulter – und die kurz und aufrecht geschnittene Stehmähne mit dunklem Mittelstreifen. Weiße Abzeichen sind im Zuchtstandard unerwünscht: höchstens ein kleiner Stern bei Stuten und Wallachen, bei Hengsten noch strenger",
    farben: ["braunfalbe", "rotfalbe", "mausfalbe", "weissfalbe", "gelbfalbe"], farbAnteil: { braunfalbe: .72, rotfalbe: .12, mausfalbe: .07, weissfalbe: .03, gelbfalbe: .06 },
    k: { nk: 1, len: .98, depth: .52, legT: .1, neck: .45, nAng: 48, crest: .08, head: .44, hAng: 50, profile: 0, hw: 1.1, jw: 1.1, muz: 1, ear: .085, mane: "fjord", maneLen: 0, vol: 1, fore: .5, tail: .75, tvol: 1, tset: .2, feather: .15, croup: .5, hq: 1.05, eye: 1 } },
  { id: "haflinger", name: "Haflinger", herkunft: "Südtirol / Österreich", h: [138, 150],
    text: "Kräftiges Gebirgspferd, immer fuchsfarben mit heller Flachsmähne.",
    farben: ["hellfuchs", "dunkelfuchs"],
    k: { nk: 0.8, len: 1.0, depth: .5, legT: .095, neck: .48, nAng: 50, crest: .06, head: .42, hAng: 52, profile: 0, hw: 1.05, jw: 1.05, muz: 1, ear: .09, mane: "lang", maneLen: .2, vol: .9, fore: .8, tail: .8, tvol: 1, tset: .3, feather: .1, croup: .6, hq: 1.05, eye: 1 } },
  { id: "shetty", name: "Shetlandpony", herkunft: "Shetlandinseln (Schottland)", h: [80, 107],
    text: "Kleines, robustes Pony mit kurzen Beinen, dichtem Fell, üppiger Mähne und großem Kopf im Verhältnis.",
    farben: ["rappe", "brauner", "fuchs", "dfuchs", "schimmel", "windfarben", "rappschecke", "braunschecke"],
    k: { nk: 1, kb: 0.04, kw: 6, ts: 0.56, len: .98, depth: .56, legT: .12, neck: .38, nAng: 45, crest: .06, head: .47, hAng: 52, profile: 0, hw: 1.1, jw: 1.1, muz: 1, ear: .08, mane: "lang", maneLen: .28, vol: 1.3, fore: 1.2, tail: .9, tvol: 1.3, tset: .2, feather: .2, croup: .5, hq: 1, eye: 1.05 } },
  { id: "shire", name: "Shire Horse", herkunft: "England", h: [168, 190],
    text: "Eines der größten Pferde der Welt: massiger Kaltblüter mit Ramsnase und langem Fesselbehang.",
    farben: ["rappe", "brauner", "sa_brauner", "dunkelbrauner", "sa_rappe", "schimmel"],
    k: { nk: 1, len: 1.08, depth: .5, legT: .125, neck: .55, nAng: 55, crest: .08, head: .48, hAng: 55, profile: .6, hw: 1.1, jw: 1, muz: 1.05, ear: .1, mane: "lang", maneLen: .15, vol: 1, fore: .6, tail: .6, tvol: 1, tset: .2, feather: 1, croup: .6, hq: 1.05, eye: .95 } },
  { id: "andalusier", name: "Andalusier (PRE)", herkunft: "Spanien", h: [152, 166],
    text: "Barockpferd mit leicht geramsnastem Kopf, kräftigem, hoch aufgesetztem Hals und welliger Langmähne.",
    farben: ["schimmel", "apfelschimmel", "fliegenschimmel", "brauner", "rappe"],
    k: { nk: 0.9, len: .98, depth: .46, legT: .085, neck: .57, nAng: 62, crest: .09, head: .42, hAng: 60, profile: .45, hw: 1, jw: 1, muz: 1, ear: .1, mane: "lang", maneLen: .3, vol: 1.1, fore: .9, tail: .85, tvol: 1.1, tset: .2, feather: .05, croup: .7, hq: 1, eye: 1 } },
  { id: "lipizzaner", name: "Lipizzaner", herkunft: "Slowenien / Österreich", h: [148, 158],
    text: "Die weißen Pferde der Spanischen Hofreitschule – kompakt, mit Ramskopf. Fohlen kommen dunkel zur Welt.",
    farben: ["schimmel", "apfelschimmel", "fliegenschimmel", "brauner", "rappe"],
    k: { nk: 0.8, len: .97, depth: .47, legT: .09, neck: .52, nAng: 58, crest: .08, head: .44, hAng: 58, profile: .6, hw: 1, jw: 1, muz: 1, ear: .1, mane: "lang", maneLen: .2, vol: .9, fore: .7, tail: .75, tvol: 1, tset: .3, feather: 0, croup: .6, hq: 1, eye: 1 } },
  { id: "vollblut", name: "Englisches Vollblut", herkunft: "England", h: [155, 172],
    text: "Das Rennpferd schlechthin: lange Beine, tiefe Brust, langer schräger Hals und feiner Kopf.",
    farben: ["brauner", "dunkelbrauner", "fuchs", "dfuchs", "rappe", "schimmel"],
    k: { len: 1.02, depth: .41, legT: .075, neck: .6, nAng: 45, crest: .02, head: .42, hAng: 50, profile: 0, hw: .92, jw: 1, muz: .9, ear: .1, mane: "kurz", maneLen: .05, vol: .6, fore: .3, tail: .6, tvol: .6, tset: .3, feather: 0, croup: .3, hq: 1, eye: 1.05 } },
  { id: "quarter", name: "Quarter Horse", herkunft: "USA", h: [142, 163],
    text: "Muskulöses Westernpferd mit kurzem Kopf, großen Ganaschen und extrem kräftiger Hinterhand.",
    farben: ["fuchs", "dfuchs", "brauner", "rappe", "palomino", "buckskin", "braunfalbe", "mausfalbe", "blueroan", "rotschimmel", "ov_brauner"],
    warnung: "In dieser Rasse kommt das Overo-Gen (Frame Overo) vor. Werden zwei Overo-Träger verpaart, ist jedes vierte Fohlen ein Lethal-White-Fohlen (O/O): Ihm fehlen Nervenzellen im Darm, es bekommt schwere Koliken und stirbt in den ersten Lebenstagen. Vor der Zucht mit einem Overo den Partner per Gentest prüfen!",
    k: { nk: 0.7, len: .96, depth: .47, legT: .09, neck: .5, nAng: 54, crest: .05, head: .42, hAng: 56, profile: 0, hw: 1.08, jw: 1.06, muz: .95, ear: .085, mane: "kurz", maneLen: .06, vol: .8, fore: .3, tail: .65, tvol: .8, tset: .1, feather: 0, croup: .5, hq: 1.2, eye: 1 } },
  { id: "hannoveraner", name: "Hannoveraner", herkunft: "Deutschland", h: [160, 175],
    text: "Großrahmiges Warmblut für Dressur und Springen – langer Hals, gerader Kopf, viel Rahmen.",
    farben: ["brauner", "dunkelbrauner", "fuchs", "dfuchs", "rappe", "schimmel"],
    k: { nk: 0.4, len: 1.03, depth: .45, legT: .09, neck: .6, nAng: 52, crest: .05, head: .44, hAng: 55, profile: 0, hw: 1, jw: 1, muz: 1, ear: .1, mane: "kurz", maneLen: .05, vol: .7, fore: .3, tail: .65, tvol: .8, tset: .3, feather: 0, croup: .4, hq: 1, eye: 1 } },
  { id: "isi", name: "Islandpferd", herkunft: "Island", h: [130, 145],
    text: "Robustes Gangpferd (Tölt!) mit dichter Doppelmähne und fast allen Farben der Pferdewelt.",
    farben: ["fuchs", "dfuchs", "brauner", "rappe", "schimmel", "braunfalbe", "mausfalbe", "palomino", "windfarben", "isabell", "fuchsschecke", "braunschecke"],
    k: { nk: 0.7, len: 1.0, depth: .53, legT: .1, neck: .45, nAng: 50, crest: .06, head: .44, hAng: 52, profile: 0, hw: 1.05, jw: 1.05, muz: 1, ear: .08, mane: "lang", maneLen: .25, vol: 1.3, fore: 1.1, tail: .9, tvol: 1.3, tset: .2, feather: .15, croup: .6, hq: 1, eye: 1 } },
  { id: "tinker", name: "Tinker (Irish Cob)", herkunft: "Irland / Großbritannien", h: [135, 160],
    text: "Kräftiger Cob, meist gescheckt, mit langer Mähne, Bart und üppigem Fesselbehang.",
    farben: ["rappschecke", "braunschecke", "fuchsschecke", "rappe"],
    k: { nk: 1, len: 1.02, depth: .52, legT: .115, neck: .5, nAng: 52, crest: .1, head: .46, hAng: 55, profile: .4, hw: 1.1, jw: 1, muz: 1.05, ear: .09, mane: "lang", maneLen: .3, vol: 1.3, fore: 1.1, tail: .9, tvol: 1.3, tset: .15, feather: 1, croup: .7, hq: 1.05, eye: 1 } },
  { id: "tekke", name: "Achal-Tekkiner", herkunft: "Turkmenistan", h: [147, 163],
    text: "Schlankes Wüstenpferd mit langem Hals, feiner, kurzer Mähne und einzigartigem metallischem Fellglanz.",
    farben: ["isabell", "palomino", "buckskin", "brauner", "fuchs", "dfuchs", "rappe", "schimmel"],
    k: { len: 1.06, depth: .41, legT: .07, neck: .56, nAng: 56, crest: .02, head: .41, hAng: 54, profile: -.1, hw: .92, jw: 1, muz: .92, ear: .11, earDx: -1.6, mane: "kurz", maneLen: .03, vol: .4, fore: .15, tail: .55, tvol: .45, tset: .4, feather: 0, croup: .3, hq: .95, eye: 1.1, metallic: true } },
  // ---------- Veredler-Rassen (v316) – Spielkopf, bis Dome eigene Köpfe zeichnet ----------
  { id: "trakehner", name: "Trakehner", herkunft: "Ostpreußen / Deutschland", h: [160, 170],
    text: "Edles Reitpferd mit feinem Kopf, langem Hals und viel Ausdruck – ältestes deutsches Warmblut, darf auch andere Warmblutrassen veredeln.",
    farben: ["brauner", "dunkelbrauner", "fuchs", "dfuchs", "rappe", "schimmel"],
    k: { nk: 0.3, len: 1.01, depth: .43, legT: .084, neck: .61, nAng: 53, crest: .04, head: .41, hAng: 54, profile: -.15, hw: .96, jw: 1.05, muz: .94, ear: .1, mane: "kurz", maneLen: .05, vol: .65, fore: .3, tail: .65, tvol: .75, tset: .4, feather: 0, croup: .35, hq: 1, eye: 1.08 } },
  { id: "welshcob", name: "Welsh Cob (Sektion D)", herkunft: "Wales", h: [137, 155],
    text: "Kraftvoller, temperamentvoller Cob aus Wales mit spektakulärem Trab, dichter Mähne und leichtem Fesselbehang – robust und genügsam.",
    farben: ["fuchs", "dfuchs", "brauner", "rappe", "dunkelbrauner", "palomino", "buckskin", "schimmel"],
    k: { nk: 0.9, len: .98, depth: .5, legT: .1, neck: .52, nAng: 58, crest: .09, head: .42, hAng: 55, profile: -.1, hw: 1.04, jw: 1.1, muz: .95, ear: .085, mane: "lang", maneLen: .22, vol: 1.1, fore: .8, tail: .8, tvol: 1.1, tset: .35, feather: .35, croup: .5, hq: 1.05, eye: 1.1 } },
  { id: "clydesdale", name: "Clydesdale", herkunft: "Schottland", h: [163, 183],
    text: "Schottischer Kaltblüter mit viel Weiß (Sabino), hohem Gang und langem, seidigem Fesselbehang – etwas leichter und höherbeiniger als das Shire.",
    farben: ["sa_brauner", "sa_rappe", "brauner", "sa_fuchs", "rappe"],
    k: { nk: 1, len: 1.05, depth: .49, legT: .118, neck: .57, nAng: 57, crest: .08, head: .47, hAng: 56, profile: .45, hw: 1.08, jw: 1, muz: 1.05, ear: .1, mane: "lang", maneLen: .14, vol: .95, fore: .6, tail: .6, tvol: .95, tset: .2, feather: 1, croup: .55, hq: 1.05, eye: .95 } },
  { id: "fell", name: "Fell-Pony", herkunft: "England (Cumbria)", h: [132, 142],
    text: "Robustes Bergpony aus Nordengland, meist schwarz, mit üppiger Mähne und Fesselbehang – trittsicher, ausdauernd und sehr genügsam.",
    farben: ["rappe", "brauner", "dunkelbrauner", "schimmel"],
    k: { nk: 1, len: 1.0, depth: .52, legT: .11, neck: .47, nAng: 52, crest: .08, head: .44, hAng: 53, profile: 0, hw: 1.08, jw: 1.05, muz: 1, ear: .085, mane: "lang", maneLen: .3, vol: 1.3, fore: 1, tail: .9, tvol: 1.3, tset: .2, feather: .7, croup: .6, hq: 1.05, eye: 1 } },
  { id: "dales", name: "Dales-Pony", herkunft: "England (Pennines)", h: [140, 148],
    text: "Größter der englischen Bergponys: kräftig, mit starken Hufen, kräftigem Trab, viel Mähne und Fesselbehang – früher Packpony in den Bleiminen.",
    farben: ["rappe", "brauner", "dunkelbrauner", "schimmel", "blueroan"],
    k: { nk: 1, len: 1.01, depth: .53, legT: .115, neck: .49, nAng: 54, crest: .09, head: .45, hAng: 54, profile: .05, hw: 1.1, jw: 1.05, muz: 1, ear: .085, mane: "lang", maneLen: .3, vol: 1.3, fore: 1, tail: .9, tvol: 1.3, tset: .2, feather: .8, croup: .6, hq: 1.08, eye: 1 } },
  { id: "angloaraber", name: "Anglo-Araber", herkunft: "Frankreich / Polen", h: [155, 165],
    text: "Kreuzung aus Englischem Vollblut und Araber (mindestens 25 % Araber) – leistungsstark, ausdauernd und edel, für Vielseitigkeit, Springen und Rennen.",
    farben: ["fuchs", "dfuchs", "brauner", "dunkelbrauner", "schimmel", "rappe"],
    k: { len: .99, depth: .42, legT: .076, neck: .58, nAng: 50, crest: .03, head: .39, hAng: 52, profile: -.4, hw: .92, jw: 1.1, muz: .86, ear: .095, mane: "kurz", maneLen: .06, vol: .6, fore: .35, tail: .62, tvol: .65, tset: .6, feather: 0, croup: .2, hq: 1, eye: 1.15 } },
  { id: "shagya", name: "Shagya-Araber", herkunft: "Ungarn (Bábolna)", h: [150, 160],
    text: "Großrahmiger Araber aus der ungarischen Militärzucht: edel wie ein Araber, aber kräftiger – sehr oft Schimmel, robust und leistungsbereit.",
    farben: ["schimmel", "apfelschimmel", "fliegenschimmel", "brauner", "fuchs", "dfuchs", "rappe"],
    k: { len: .98, depth: .43, legT: .075, neck: .57, nAng: 54, crest: .03, head: .37, hAng: 52, profile: -.6, hw: .93, jw: 1.15, muz: .84, ear: .09, mane: "lang", maneLen: .12, vol: .6, fore: .45, tail: .62, tvol: .7, tset: .85, feather: 0, croup: .1, hq: 1, eye: 1.25 } },
  // v442 (Dome): Appaloosa, Knabstrupper, Paint Horse – Tigerpferde (Leopard-Komplex) und gescheckter Quarter-Typ
  { id: "appaloosa", name: "Appaloosa", herkunft: "USA (Nez Percé)", h: [142, 160],
    text: "Kompaktes, trittsicheres Westernpferd mit Tigerscheckung – dazu gefleckte Haut, weiße Lederhaut, gestreifte Hufe und oft eine dünne Mähne.",
    farben: ["sb_brauner", "sb_rappe", "sb_fuchs", "tg_brauner", "tg_fuchs", "fs_brauner", "sk_brauner", "brauner", "fuchs", "dfuchs", "rappe"],
    warnung: "Appaloosas tragen das Leopard-Gen (Lp). Werden zwei Lp-Träger verpaart, ist jedes vierte Fohlen Lp/Lp und damit nachtblind (CSNB). Außerdem neigen Tigerpferde stark zur Mondblindheit (periodische Augenentzündung).",
    k: { nk: 0.5, len: .98, depth: .46, legT: .085, neck: .52, nAng: 52, crest: .04, head: .42, hAng: 55, profile: 0, hw: 1.04, jw: 1.04, muz: .95, ear: .085, mane: "kurz", maneLen: .05, vol: .45, fore: .15, tail: .5, tvol: .45, tset: .15, feather: 0, croup: .45, hq: 1.12, eye: 1 } },
  { id: "knabstrupper", name: "Knabstrupper", herkunft: "Dänemark", h: [145, 168],
    text: "Dänisches Tigerpferd vom Pony- bis zum Sporttyp – meist Tigerschecke, vielseitig in Dressur und Springen, menschenbezogen und klug.",
    farben: ["tg_brauner", "tg_rappe", "tg_fuchs", "fs_rappe", "sb_brauner", "sb_fuchs", "brauner", "fuchs", "dfuchs", "rappe"],
    warnung: "Knabstrupper tragen das Leopard-Gen (Lp). Werden zwei Lp-Träger verpaart, ist jedes vierte Fohlen Lp/Lp und damit nachtblind (CSNB). Außerdem neigen Tigerpferde stark zur Mondblindheit (periodische Augenentzündung).",
    k: { nk: 0.4, len: 1.0, depth: .45, legT: .088, neck: .58, nAng: 52, crest: .05, head: .43, hAng: 54, profile: 0, hw: 1, jw: 1, muz: .98, ear: .095, mane: "kurz", maneLen: .05, vol: .7, fore: .3, tail: .65, tvol: .75, tset: .3, feather: 0, croup: .4, hq: 1.02, eye: 1 } },
  { id: "paint", name: "Paint Horse", herkunft: "USA", h: [142, 163],
    text: "Gescheckter Quarter-Typ: muskulös, ruhig und vielseitig – mit Tobiano-, Overo- (Frame, Sabino, Splash) oder Tovero-Zeichnung.",
    farben: ["braunschecke", "fuchsschecke", "rappschecke", "ov_brauner", "ov_fuchs", "tv_brauner", "sa_brauner", "sw_fuchs", "fuchs", "dfuchs", "brauner"],
    warnung: "Im Paint Horse kommt das Overo-Gen (Frame Overo) vor. Werden zwei Overo-Träger verpaart, ist jedes vierte Fohlen ein Lethal-White-Fohlen (O/O): Ihm fehlen Nervenzellen im Darm, es stirbt in den ersten Lebenstagen. Vor der Zucht mit einem Overo den Partner per Gentest prüfen!",
    k: { nk: 0.7, len: .96, depth: .47, legT: .09, neck: .5, nAng: 54, crest: .05, head: .42, hAng: 56, profile: 0, hw: 1.08, jw: 1.06, muz: .95, ear: .085, mane: "kurz", maneLen: .06, vol: .8, fore: .3, tail: .65, tvol: .8, tset: .1, feather: 0, croup: .5, hq: 1.2, eye: 1 } },
  // v445 (Dome): Noriker, Lewitzer, Barock Pinto
  { id: "noriker", name: "Noriker", herkunft: "Österreich (Pinzgau)", h: [155, 165],
    text: "Trittsicheres Kaltblut aus den Alpen – kräftig, aber beweglich, oft braun, als Tiger, Schecke oder „Mohrenkopf“ (Roan mit dunklem Kopf).",
    farben: ["brauner", "rappe", "fuchs", "dunkelfuchs", "hellfuchs", "blueroan", "sb_brauner", "tg_brauner", "braunschecke"],
    warnung: "Im Noriker kommt das Leopard-Gen (Tiger) vor. Werden zwei Tiger verpaart, ist jedes vierte Fohlen Lp/Lp und damit nachtblind (CSNB).",
    k: { nk: 1, len: 1.05, depth: .5, legT: .118, neck: .53, nAng: 55, crest: .08, head: .46, hAng: 56, profile: .1, hw: 1.08, jw: 1.05, muz: 1.02, ear: .095, mane: "lang", maneLen: .2, vol: 1.1, fore: .8, tail: .7, tvol: 1.1, tset: .2, feather: .3, croup: .6, hq: 1.08, eye: .95 } },
  { id: "lewitzer", name: "Lewitzer", herkunft: "Deutschland (Mecklenburg)", h: [130, 148],
    text: "Gescheckt gezüchtetes Reitpony aus Mecklenburg – umgänglich, rittig und robust, ideal für Kinder und kleine Erwachsene.",
    farben: ["braunschecke", "rappschecke", "fuchsschecke", "braunschecke", "fuchsschecke", "brauner", "fuchs", "dfuchs"],
    k: { nk: 0.6, len: .98, depth: .47, legT: .09, neck: .54, nAng: 56, crest: .06, head: .42, hAng: 55, profile: -.1, hw: 1, jw: 1.05, muz: .92, ear: .085, mane: "lang", maneLen: .18, vol: 1, fore: .7, tail: .75, tvol: 1, tset: .3, feather: .1, croup: .45, hq: 1.02, eye: 1.05 } },
  { id: "barockpinto", name: "Barock Pinto", herkunft: "Niederlande", h: [150, 168],
    text: "Gescheckter Barocktyp mit viel Friesenblut – hohe Aufrichtung, üppiges Langhaar und Fesselbehang, meist schwarz-weiß (Tobiano).",
    farben: ["rappschecke", "rappschecke", "braunschecke", "fuchsschecke", "rappe"],
    k: { nk: 1, len: 1.0, depth: .47, legT: .098, neck: .6, nAng: 62, crest: .08, head: .44, hAng: 60, profile: .1, hw: 1, jw: 1, muz: 1, ear: .105, mane: "lang", maneLen: .34, vol: 1.1, fore: .95, tail: .9, tvol: 1.15, tset: .15, feather: .65, croup: .5, hq: 1, eye: 1 } },
];

// Kopfgröße wie in echt (v438, Dome): Kopflänge (Genick bis Maul) im Verhältnis zur Widerristhöhe je Rasse – Richtwerte aus der Literatur/Zuchtstandards.
// Spiel-Kopflänge k.head = KOPF_REAL × KOPF_STIL (Cartoon-Faktor, für alle Rassen gleich). Bei Änderungen am Körper NUR diese Tabelle/den Faktor anpassen,
// nicht k.head einzeln – so bleiben die Rassen untereinander proportional. Neue Rassen hier mit eintragen.
const KOPF_STIL = 1.2;
const KOPF_REAL = { araber: .35, shagya: .35, angloaraber: .355, tekke: .36, vollblut: .36, quarter: .36, marwari: .36, trakehner: .365, hannoveraner: .37, andalusier: .37, lipizzaner: .37,
  knabstrupper: .37, appaloosa: .365, paint: .36, lewitzer: .39, barockpinto: .38, noriker: .40, friese: .38, welshcob: .38, haflinger: .39, fjord: .39, isi: .39, fell: .39, dales: .39, tinker: .39, shire: .40, clydesdale: .40, shetty: .45 };
RASSEN.forEach(r => { if (KOPF_REAL[r.id]) r.k.head = Math.round(KOPF_REAL[r.id] * KOPF_STIL * 1000) / 1000; });
const rasseById = id => RASSEN.find(r => r.id === id);

// ---------- Hilfsfunktionen ----------
const f = n => (Math.round(n * 10) / 10).toString();
const P = (x, y) => ({ x, y });
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const sub = (a, b) => P(a.x - b.x, a.y - b.y);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mul = (a, s) => P(a.x * s, a.y * s);
const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);
const norm = a => { const l = Math.hypot(a.x, a.y) || 1; return P(a.x / l, a.y / l); };
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hexRgb(a).map((v, i) => Math.round(v + (hexRgb(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");

function glatt(pts, zu = true, t = 1) {
  const n = pts.length;
  const g = i => zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(pts[0].x)},${f(pts[0].y)}`;
  const end = zu ? n : n - 1;
  for (let i = 0; i < end; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${f(p1.x + (p2.x - p0.x) / 6 * t)},${f(p1.y + (p2.y - p0.y) / 6 * t)} ${f(p2.x - (p3.x - p1.x) / 6 * t)},${f(p2.y - (p3.y - p1.y) / 6 * t)} ${f(p2.x)},${f(p2.y)}`;
  }
  return zu ? d + "Z" : d;
}
const eckig = pts => "M" + pts.map(p => `${f(p.x)},${f(p.y)}`).join("L") + "Z";

function zufall(seedStr) {
  let h = 1779033703;
  for (const c of String(seedStr)) h = Math.imul(h ^ c.charCodeAt(0), 3432918353), h = (h << 13) | (h >>> 19);
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

let _uid = 0;

// ---------- Zeichnen ----------
// Liefert { svg: "<g>…</g>", box: {minX,maxX,minY} } in Pferde-Einheiten (Widerrist = 100)
// Exterieur (PLAN-MERKMALE M1): opt.bau = Abweichung vom Zuchtziel in Streuungen (σ) für rahmen, halsL, halsA, kruppe, fundament, muskel – je σ 5 %, höchstens ±15 % vom Rassenwert (ab ±3 σ)
// rahmen → Rumpflänge (Tiefe halb), halsL → Halslänge, halsA → Halswinkel, fundament → Beindicke, muskel → Hinterhand (Mähnenkamm etwas), kruppe → Kruppenneigung (waagerecht = weniger Neigung)
function bauK(k, bau) {
  if (!bau) return k;
  const f = key => 1 + 0.05 * Math.max(-3, Math.min(3, bau[key] || 0)), fr = f("rahmen"), fm = f("muskel"), s = Math.max(-3, Math.min(3, bau.kruppe || 0)) / 3;
  return { ...k, len: k.len * fr, depth: k.depth * (1 + (fr - 1) / 2), neck: k.neck * f("halsL"), nAng: k.nAng * f("halsA"), legT: k.legT * f("fundament"), hq: (k.hq || 1) * fm, crest: k.crest * (1 + (fm - 1) / 2),
    croup: (k.croup || 0) - 0.15 * Math.max(0.4, Math.abs(k.croup || 0)) * s };
}
function zeichnePferd(rasseId, farbId, opt = {}) {
  { const LX = FARBEN[farbId] && FARBEN[farbId].lexOpt; if (LX) opt = { ...LX, ...opt }; }   // v486: Enzyklopädie-Einträge bringen ihre Zeichnung mit (Rabicano, Brindle, Lp …)
  // Körpertyp: duenn | sportlich | normal | dick
  const typ = opt.typ || "normal";
  const TYP = { duenn: { bauch: -1, hq: 0.88, crest: -0.03, legT: 0.94 }, sportlich: { bauch: -0.45, hq: 1.07, crest: 0.025, legT: 1 }, normal: { bauch: 0, hq: 1, crest: 0, legT: 1 }, dick: { bauch: 1, hq: 1.12, crest: 0.07, legT: 1.04 } }[typ] || { bauch: 0, hq: 1, crest: 0, legT: 1 };
  const R = rasseById(rasseId), stufe = opt.alterStufe || null, kBasis = bauK({ ...R.k, ...ALTERS_K(stufe, R.k), ...(opt.k || {}) }, opt.bau);   // M1: Exterieur des Pferdes wirkt nach dem Alter als Faktor (höchstens ±15 %)
  const k = { ...kBasis, hq: (kBasis.hq || 1) * TYP.hq, crest: kBasis.crest + TYP.crest, legT: kBasis.legT * TYP.legT, nk: Math.max(kBasis.nk || 0, typ === "dick" ? 0.7 : 0) }, C = musterStufeFarbe(FARBEN[farbId] || FARBEN.schimmel, opt.musterStufe);
  const uid = "p" + (++_uid);
  const rnd = zufall(opt.seed || rasseId + farbId);
  const hengst = opt.geschlecht === "Hengst";
  const H = 100, L = k.len * H * 0.92, D = k.depth * H, Lg = H - D - 4;
  const bottom = -Lg, top = bottom - D;
  const w = k.legT * H * 0.8, hh = Math.max(3.5, w * 0.72);
  const croupY = -H + 2 + k.croup * 2.5;
  const hq = k.hq || 1;
  // Mähnenlänge: natürliche Länge der Rasse oder geschnitten (opt.maehne: steh | kurz | mittel | lang)
  const natur = naturMaehne(rasseId);
  const laenge = opt.maehne || natur;
  const mstil = laenge === "steh" ? "fjord" : laenge === "kurz" ? "kurz" : "lang"; // lang, mittel und extralang teilen sich die Zeichnung
  const maneLenE = laenge === "kurz" ? 0.085 : laenge === "mittel" ? (natur === "mittel" ? k.maneLen : 0.15) : laenge === "lang" ? (natur === "lang" ? k.maneLen : 0.26) : laenge === "extralang" ? Math.max(0.42, (natur === "lang" ? k.maneLen : 0.26) * 1.4) : 0;
  const crest = k.crest + (hengst ? 0.04 : 0);
  const alle = []; // für Bounding-Box
  const merke = arr => { alle.push(...arr); return arr; };

  // Farben
  const MST = Math.min(C.pattern === "overo" ? 2 : 3, opt.musterStufe == null ? 1 : opt.musterStufe), M2 = Math.min(2, MST);   // Frame Overo hat in echt höchstens etwa die Hälfte Weiß – „fast weiß“ sieht aus wie „viel“   // v439 Muster-Ausprägung: 0 wenig · 1 typisch · 2 viel · 3 fast weiß (v440)
  const weissMuster = ["tobiano", "tovero", "splash", "sabino"].includes(C.pattern), fastWeiss = MST === 3 && weissMuster;
  const DW = opt.dw == null ? null : opt.dw;   // v440 Dominant White (Gen W): 0 wenig · 1 typisch · 2 viel · 3 ganz weiß
  const ganzWeiss = fastWeiss || DW >= 2;
  const MG = opt.glanz != null ? opt.glanz : C.glanzLex || (k.metallic ? 1 : 0), fidT = C.lexBasis || farbId, bronzeOpt = opt.bronze || C.bronzeLex;   // v485: Lexikon-Einträge (Enzyklopädie) mit festem Glanz/Ton   // v446 (Dome): Metallglanz 0–1 – nicht jeder Achal-Tekkiner glänzt gleich stark, Mischlinge anteilig
  const bronze = MG > .3 && !!bronzeOpt && /buckskin/.test(fidT), perl = MG > .3 && !!bronzeOpt && /isabell/.test(fidT);   // v482: Perlglanz – Isabell (Doppel-Cream) golden-perlmuttfarben statt silbrig   // v482 (Dome): Bronzeglanz – heller, rosig-goldener Buckskin
  const gold = !bronze && MG > .3 && /palomino|buckskin|falbe/i.test(fidT) && !/mausfalbe|weissfalbe/.test(fidT);   // v479: Mausfalbe (schwarzbasiert) und Weißfalbe nicht golden   // v443: Achal-Tekkiner „Gold“ – satteres Goldgelb, dazu goldener Glanz (unten)
  const body = perl ? mix(C.body, "#ead3a2", .55 * MG) : bronze ? mix(C.body, "#d4a878", .6 * MG) : gold ? mix(C.body, "#e8a92a", .5 * MG) : MG > .3 && /isabell/.test(farbId) ? mix(C.body, "#dfe3ea", .35 * MG) : C.body, mane = DW === 3 ? "#efebe2" : C.mane, head = DW === 3 ? "#f4f1ea" : C.head || body;
  const pts = C.points || null;
  const hoof = C.pattern === "tobiano" || ganzWeiss ? "#b8a88f" : (C.hoof || "#3b3531");
  const SW = "#f7f5f1", spotFarbe = C.spot || mix(body, pts || body, .35);
  const dunkel = c => mix(c, "#1b1530", 0.25);
  const INK = "#090609";   // v492 (Dome): Kontur immer schwarz wie in Domes Zeichnung – bei allen Pferden
  const linie = INK;
  const dunkelWert = hexRgb(body).reduce((x, y) => x + y) / 3;
  const schatten = mix(body, dunkelWert < 60 ? "#000000" : "#2b2240", dunkelWert < 60 ? 0.45 : 0.3);
  const licht = dunkelWert < 60 ? mix(body, "#8a9bc0", 0.35) : mix(body, "#ffffff", 0.35);
  const inkFein = (d, sw = 1.3, extra = "") => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" ${extra}/>`;
  let maneOuter = mane, maneStripe = null;
  if (k.mane === "fjord") { maneOuter = "#efe6d2"; maneStripe = C.stripe || mane; }
  // Falben mit Aalstrich: Schopf und Schweif zweifarbig – dunkle Mitte, helle Seiten
  // realistisch: der deutlich zweifarbige Behang (helle Seiten, dunkle Mitte) ist typisch fürs Fjordpferd – andere Falben haben dunklen, einfarbigen Behang
  const dunKern = k.mane === "fjord" ? (C.stripe || null) : null;
  const dunHell = dunKern ? (k.mane === "fjord" ? "#efe6d2" : mstil === "fjord" ? mix(C.body, "#efe6d2", 0.55) : mix(mane, C.body, 0.5)) : null;
  // v440 (Dome): bei viel Weiß sind Mähne und Schweif in Strähnen zweifarbig – weiß dort, wo die Haut darunter weiß ist (Mähne abschnittsweise, Schweif gemischt)
  const rw = zufall((opt.seed || rasseId) + "-strähnen"), maehneWeiss = [];
  let schweifWeiss = 0;
  {
    const ab = (a, l) => { const t1 = a + rw() * Math.max(0, 1 - a - l); maehneWeiss.push([t1, Math.min(1, t1 + l)]); };
    const P_ = C.pattern;
    if (P_ === "tobiano") { if (MST === 1 && rw() < .35) ab(0, .15 + rw() * .15); if (MST === 2) { ab(0, .3 + rw() * .2); if (rw() < .4) ab(0, .15); } if (MST === 3) maehneWeiss.push([0, .72 + rw() * .12]);
      schweifWeiss = [0, rw() < .4 ? .25 : 0, .5, .75][MST]; }
    if (P_ === "tovero") { if (MST === 0 && rw() < .5) ab(0, .2); if (MST === 1) ab(0, .45); if (MST >= 2) maehneWeiss.push([0, MST === 3 ? .88 : .7]); schweifWeiss = [.3, .55, .75, .9][MST]; }
    if (P_ === "sabino") { if (MST === 2 && rw() < .5) ab(0, .2 + rw() * .2); if (MST === 3) maehneWeiss.push([0, .7 + rw() * .2]); schweifWeiss = [0, 0, .3, .7][MST]; }
    if (DW === 2) { ab(0, .4); schweifWeiss = .6; }
  }
  const tailCol = DW === 3 ? mane : dunKern ? dunHell : (k.mane === "fjord" ? mix(maneOuter, maneStripe, 0.25) : mane);
  if (mstil === "fjord" && k.mane !== "fjord") { maneOuter = dunKern ? dunHell : mane; maneStripe = dunKern; }   // Stehmähne: mit Aalstrich zweifarbig wie beim Norweger
  if (mstil !== "fjord" && k.mane === "fjord") { maneOuter = mix("#efe6d2", C.stripe || mane, 0.2); maneStripe = null; }

  // --- Rumpf ---
  const rumpf = merke([
    P(0.2 * L, -H), P(0.32 * L, top + 1.2 + 0.6 * (k.sag || 0)), P(0.48 * L, top + 2.6 + (k.sag || 0)), P(0.66 * L, top + 1.4 + 0.7 * (k.sag || 0)),
    P(0.8 * L, croupY - (hq - 1) * 8), P(L - 0.02 * H, croupY + 2.5 + k.croup * 3),
    P(L + 0.045 * H * hq, top + 0.3 * D), P(L + 0.04 * H * hq, top + 0.6 * D), P(L - 0.01 * H, bottom - 0.05 * D),
    P(0.8 * L, bottom + 0.015 * H), P(0.71 * L, bottom - 0.1 * D + TYP.bauch * (TYP.bauch < 0 ? 0.16 : 0.09) * D), P(0.55 * L, bottom - 0.02 * D + TYP.bauch * (TYP.bauch < 0 ? 0.1 : 0.13) * D),
    P(0.32 * L, bottom + 1.5 + TYP.bauch * (TYP.bauch < 0 ? 1 : 0.11 * D)), P(0.15 * L, bottom + 0.5 + Math.max(0, TYP.bauch) * 0.04 * D), P(0.03 * L, bottom - 0.1 * D),
    P(-0.055 * H - Math.max(0, TYP.bauch) * 2.5, top + 0.68 * D), P(-0.075 * H, top + 0.45 * D), P(-0.03 * H, top + 0.18 * D), P(0.08 * L, top + 0.03 * D),
  ]);

  // --- Hals + Kopf ---
  const Wn = P(0.22 * L, -H + 1), Cn = P(-0.07 * H, top + 0.42 * D);
  // Haltung je nach Gesundheit: normal | leicht | waagerecht | tief | liegend
  // Waagerechte = Buggelenk (Brustspitze) und Maul auf gleicher Höhe
  const haltung = opt.haltung || "normal", liegt = haltung === "liegend";
  // Domes Kopf (kopfneu.js): opt.kopfform = { f, s } oder Schlüssel wie "hecht2"; eigenKopf: false = alter Spielkopf
  const kfWahl = opt.kopfform ? (typeof opt.kopfform === "string" ? opt.kopfform : kopfKey(opt.kopfform)) : null;
  const ekWahl = opt.eigenKopf === false ? null : (ALTE_NASE[opt.eigenKopf] || opt.eigenKopf || kfWahl || RASSE_KOPF[rasseId]);
  const kopfAlter = stufe && KOPF_ALTER[stufe] ? stufe : null;
  const eigenKopf = ekWahl && typeof KOPF_NEU !== "undefined" ? (KOPF_NEU.formen[ekWahl] ? ekWahl : "gerade") : null;
  let ekMatrix = null, ohrL = null;
  const grasen = haltung === "grasen", senk = grasen ? Math.max(0, Math.min(1, opt.senk == null ? 1 : opt.senk)) : 0, amBoden = grasen && opt.fressZiel !== "krippe", hv = grasen ? (["leicht", "waagerecht", "tief"].includes(opt.von) ? opt.von : "normal") : haltung;   // hv: Haltung, von der aus das Pferd frisst (matte Pferde senken den Kopf aus ihrer Haltung und kehren dorthin zurück)   // v723 (Dome): Fressen – opt.senk 0 (Kopf oben) bis 1 (Maul am Boden bzw. an der Krippe)
  const ohrenHaengen = hv === "tief" || liegt || (amBoden && senk > .5);
  const ohrenGeknickt = !ohrenHaengen && opt.ohren === "geknickt";
  const gl = w * 1.5;                       // Höhe der untergeschlagenen Beine beim Liegen
  const dLiegen = liegt ? Lg - gl : 0;      // so weit sinkt der Körper beim Liegen ab
  let a0 = (k.nAng - 20) * Math.PI / 180;
  let N = k.neck * H * 1.1 * ({ waagerecht: 1.6, tief: 2.2, liegend: 2.2 }[hv] ? 1 + Math.max(0, 0.56 - k.neck) * { waagerecht: 1.6, tief: 2.2, liegend: 2.2 }[hv] : 1);
  const hl = k.head * H;
  const th0 = k.hAng * Math.PI / 180;
  let th = th0 + ({ normal: 0, leicht: 8, waagerecht: 12, tief: 16, liegend: 16 }[hv] || 0) * Math.PI / 180;
  const maulY = (aa, tt) => Wn.y - N * Math.sin(aa) + (Math.sin(tt) * 1.01 + Math.cos(tt) * 0.14 * k.muz) * hl;
  const bugY = top + 0.45 * D;
  // Gesunde Pferde tragen den Kopf deutlich über der Waagerechten (hebt v. a. kurze, tief angesetzte Hälse wie beim Shetty)
  const normMinY = bugY - 0.22 * H;
  if (maulY(a0, th0) > normMinY) {
    const c0 = (Math.sin(th0) * 1.01 + Math.cos(th0) * 0.14 * k.muz) * hl;
    a0 = Math.asin(Math.min(0.97, (Wn.y + c0 - normMinY) / N));
    // kurze Hälse (Shetty, Fohlen) nicht senkrecht aufstellen – sonst wirkt der Hals wie ein dünner Stiel
    const aMax = (k.aMax != null ? k.aMax : k.nAng + 6) * Math.PI / 180;
    if (a0 > aMax) a0 = Math.max((k.nAng - 20) * Math.PI / 180, aMax);
  }
  const normY = maulY(a0, th0);
  // „leicht“: mindestens ~18° tiefer als normal (wichtig für Pferde mit kurzem, tief angesetztem Hals),
  // das Maul bleibt aber sichtbar über der Waagerechten
  const leichtY = Math.max(normY + 0.62 * (bugY - normY), Math.min(maulY(a0 - 18 * Math.PI / 180, th), bugY - 0.06 * H));
  const zielY = { leicht: leichtY, waagerecht: bugY, tief: bugY + 0.5 * (-hh - 3 - bugY), liegend: -dLiegen - 2.5 }[hv];
  let a = a0;
  if (zielY != null) {
    // Messpunkt: bei „waagerecht“ die Mitte des Nasenrückens, sonst das Maul
    const c = hv === "waagerecht"
      ? (Math.sin(th) * 0.55 - Math.cos(th) * 0.045) * hl
      : (Math.sin(th) * 1.01 + Math.cos(th) * 0.14 * k.muz) * hl;
    a = Math.asin(Math.max(-0.97, Math.min(Math.sin(a0), (Wn.y + c - zielY) / N)));
  }
  if (amBoden) {   // v723 Grasen/Heu vom Boden: Hals schräg nach vorn-unten, Kopf fast senkrecht, Maul am Boden (kurze Hälse flacher, sonst stehen sie steil)
    const aEnd = (k.neck < .52 ? -36 : -46) * Math.PI / 180, thE = th0 + 34 * Math.PI / 180;
    const cE = (Math.sin(thE) * 1.01 + Math.cos(thE) * 0.14 * k.muz) * hl, nE = (Wn.y + cE + hh * 0.3) / Math.sin(aEnd);
    a += (aEnd - a) * senk; th += (thE - th) * senk; N += (Math.max(N, nE) - N) * senk;
  } else if (grasen) {   // v723 Kraftfutter an der Krippe: Maul etwa auf Brusthöhe – wer den Kopf schon tiefer trägt, bleibt so tief
    const yV = maulY(a, th), yK = 0.85 * bugY;
    if (yV < yK) { const thK = Math.max(th, th0 + 20 * Math.PI / 180), t2 = th + (thK - th) * senk, y = yV + (yK - yV) * senk;
      th = t2; a = Math.asin(Math.max(-0.97, Math.min(0.97, (Wn.y + (Math.sin(th) * 1.01 + Math.cos(th) * 0.14 * k.muz) * hl - y) / N))); }
  }
  const Pll = P(Wn.x - N * Math.cos(a), Wn.y - N * Math.sin(a));
  const u = P(-Math.cos(th), Math.sin(th)), v = P(Math.sin(th), Math.cos(th));
  const hp = (s, b) => P(Pll.x + (u.x * s + v.x * b) * hl, Pll.y + (u.y * s + v.y * b) * hl);
  const pr = k.profile, hw = k.hw, jw = k.jw, m = k.muz;
  const nkK = 1 - 0.32 * (k.nk || 0); // bei kräftigem Hals geht die Ganasche weich in den Hals über
  const kopf = merke([
    hp(-0.03, -0.03), hp(0.12, -0.065), hp(0.3, -0.06 - pr * 0.015), hp(0.55, -0.045 - pr * 0.05), hp(0.8, -0.03 - pr * 0.035),
    hp(0.94, -0.01), hp(1.0, 0.07 * m), hp(1.025, 0.17 * m), hp(0.99, 0.27 * m), hp(0.92, 0.3 * m), hp(0.86, 0.29 * m),
    hp(0.76, 0.32 * hw), hp(0.52, 0.38 * hw), hp(0.34, 0.48 * hw * jw * (0.85 + 0.15 * nkK)), hp(0.18, 0.52 * hw * jw * nkK),
    hp(0.06, 0.45 * hw * nkK), hp(-0.03, 0.22 * hw),
  ]);
  const nk = k.nk || 0; // kräftiger Hals: Kehle setzt weiter vorn unter der Ganasche an
  const T0 = hp(0.15, 0.5 * hw), kSp = (hv === "normal" || hv === "leicht") && senk < .3 && k.ts ? 1 : 0, T1 = hp(0.46 + ((k.ts || 0.46) - 0.46) * kSp, (0.4 - 0.04 * kSp) * hw * Math.min(jw, 1.1));
  let T = P(T0.x + (T1.x - T0.x) * nk, T0.y + (T1.y - T0.y) * nk); const Pn = hp(-0.02, 0.04);
  const d = norm(P(Pn.x - Wn.x, Pn.y - Wn.y));
  const nOut = P(-d.y, d.x);
  const crestCtrl = add(mid(Wn, Pn), mul(nOut, crest * H + 4));
  // Handgezeichneter Kopf: Kehle setzt genau am Ende seiner Ganaschenlinie an
  let ekKehle = null;
  if (eigenKopf) {
    const K = KOPF_NEU, G = K.gap, A = add(Pn, mul(nOut, 1.2)), B = add(A, mul(sub(hp(0.97, 0.0), A), KOPF_GROESSE));
    const ux = K.nase.x - G.x, uy = K.nase.y - G.y, vx = B.x - A.x, vy = B.y - A.y;
    const den = ux * ux + uy * uy, a_ = (vx * ux + vy * uy) / den, b_ = (vy * ux - vx * uy) / den;
    const e_ = A.x - (a_ * G.x - b_ * G.y), f_ = A.y - (b_ * G.x + a_ * G.y);
    const M = (x, y) => P(a_ * x - b_ * y + e_, b_ * x + a_ * y + f_), kp = kopfNeuKehle(eigenKopf, kopfAlter);
    T = M(kp.x, kp.y);
    ekKehle = true;
  }
  // Jungpferde mit Spielkopf: Kehle weiter vorn unter der Ganasche ansetzen – der Hals wird oben breiter
  if (!eigenKopf && stufe && ["fohlen", "jaehrling", "jungpferd"].includes(stufe)) T = hp(0.36, 0.44 * hw * Math.min(jw, 1.1));
  // Kehle: weicher, offener Übergang von der Ganasche in die Halsunterseite
  // weicher Bogen am Kopfansatz: die Linie läuft erst ein Stück an der Ganasche entlang nach hinten und biegt dann nach unten
  const kehle1 = add(add(add(T, mul(sub(Cn, T), 0.3 * (1 - nk))), mul(nOut, 10 * (1 - nk))), P((0.22 + ((k.kb != null ? k.kb : 0.22) - 0.22) * kSp) * hl * nk, 0.14 * hl * nk));
  const kehle2 = add(add(Cn, mul(sub(T, Cn), 0.35 + 0.1 * nk)), mul(nOut, 1.5 - (4 + (k.kw || 0) * kSp) * nk));
  const kehleLen = Math.hypot(Cn.x - T.x, Cn.y - T.y);
  // Jungpferde mit Spielkopf: weicher, gerader Kehlgang wie beim gezeichneten Kopf (sonst wirkt der Hals wie ein dünner Stiel)
  const sanft = ekKehle || (stufe && ["fohlen", "jaehrling", "jungpferd"].includes(stufe));
  const k1 = sanft ? add(add(T, mul(sub(Cn, T), 0.35)), mul(nOut, 0.06 * kehleLen)) : kehle1, k2 = sanft ? add(add(Cn, mul(sub(T, Cn), 0.35)), mul(nOut, 0.04 * kehleLen)) : kehle2;
  // Neuer Kopf (v429): Hals reicht bis unter die Backe – sonst bleibt zwischen Genick, Kopfhinterkante und Mähne eine Lücke (Ecke des alten Spielkopfs)
  const halsKopf = eigenKopf ? hp(0.3, 0.22) : hp(0.06, 0.2);
  const halsD = `M${f(Wn.x)},${f(Wn.y)}Q${f(crestCtrl.x)},${f(crestCtrl.y)} ${f(Pn.x)},${f(Pn.y)}L${f(halsKopf.x)},${f(halsKopf.y)}L${f(T.x)},${f(T.y)}C${f(k1.x)},${f(k1.y)} ${f(k2.x)},${f(k2.y)} ${f(Cn.x)},${f(Cn.y)}L${f(0.35 * L)},${f(top + 0.6 * D)}Z`;
  const kamm = t => { const s = 1 - t; return P(s * s * Wn.x + 2 * s * t * crestCtrl.x + t * t * Pn.x, s * s * Wn.y + 2 * s * t * crestCtrl.y + t * t * Pn.y); };

  // --- Beine ---
  let beinVers = null;   // v723 Grasen: Versatz der Hufe je Bein (Schlüssel xc), das Bein dreht um den Ansatz am Rumpf
  const sx = (xc, x, y) => { const d = beinVers && beinVers[xc.toFixed(3)]; return d ? x + d * Math.max(0, Math.min(1, (y - bottom) / -bottom)) : x; };
  const scher = (xc, a) => beinVers ? a.map(q => P(sx(xc, q.x, q.y), q.y)) : a;
  const vorder = xc => scher(xc, [
    P(xc - 1.0 * w, bottom - 12), P(xc - 1.2 * w, bottom + 1), P(xc - 1.15 * w, -0.74 * Lg), P(xc - 0.9 * w, -0.6 * Lg), P(xc - 0.8 * w, -0.51 * Lg),
    P(xc - 0.92 * w, -0.46 * Lg), P(xc - 0.5 * w, -0.39 * Lg), P(xc - 0.42 * w, -0.2 * Lg), P(xc - 0.72 * w, -0.1 * Lg), P(xc - 0.8 * w, -0.05 * Lg),
    P(xc - 0.9 * w, -hh + 0.5),
    P(xc + 0.4 * w, -hh + 0.5), P(xc + 0.92 * w, -0.08 * Lg), P(xc + 0.42 * w, -0.18 * Lg),
    P(xc + 0.45 * w, -0.36 * Lg), P(xc + 0.62 * w, -0.46 * Lg), P(xc + 0.72 * w, -0.52 * Lg), P(xc + 0.68 * w, -0.64 * Lg),
    P(xc + 1.05 * w, bottom + 1), P(xc + 1.7 * w, bottom - 3), P(xc + 1.4 * w, bottom - 12),
  ]);
  const hinter = hx => scher(hx, [
    P(0.7 * L, bottom - 12), P(0.79 * L, bottom + 0.015 * H), P(hx - 0.25 * w, -0.72 * Lg), P(hx - 0.35 * w, -0.62 * Lg),
    P(hx - 0.7 * w, -0.53 * Lg), P(hx - 0.45 * w, -0.41 * Lg), P(hx - 0.42 * w, -0.2 * Lg), P(hx - 0.72 * w, -0.1 * Lg),
    P(hx - 0.9 * w, -hh + 0.5),
    P(hx + 0.4 * w, -hh + 0.5), P(hx + 0.92 * w, -0.08 * Lg), P(hx + 0.42 * w, -0.18 * Lg),
    P(hx + 0.5 * w, -0.44 * Lg), P(hx + 1.15 * w, -0.57 * Lg), P(hx + 1.0 * w, -0.66 * Lg), P(hx + 1.45 * w + hq, -0.8 * Lg),
    P(L + 0.005 * H * hq, bottom - 0.05 * D), P(L + 0.035 * H * hq, top + 0.62 * D), P(hx, top + 0.45 * D),
  ]);
  const huf = xc => scher(xc, [P(xc - 0.9 * w, -hh), P(xc + 0.42 * w, -hh), P(xc + 0.62 * w, 0), P(xc - 1.2 * w, 0)]);
  const behang = xc => {
    return null; // Kötenbehang vorerst bei allen Pferden ausgeblendet
    const tp = -(0.08 + 0.24 * fl) * Lg;
    return [P(xc + 0.5 * w, tp), P(xc + 0.8 * w + 2 * fl, -0.12 * Lg), P(xc + 1.0 * w + 5.5 * fl, 0), P(xc + 0.4 * w + 2 * fl, -2),
      P(xc + 0.1 * w, 0.8), P(xc - 0.4 * w, -1.2), P(xc - 0.8 * w, 0.8), P(xc - 1.05 * w - 1.2 * fl, 0.6), P(xc - 0.9 * w - 0.6 * fl, -0.06 * Lg), P(xc - 0.6 * w, tp * 0.85)];
  };
  const fx = 0.12 * L, fx2 = 0.2 * L, hx = 0.87 * L, hx2 = 0.8 * L;
  if (amBoden && senk > .6) { const t = (senk - .6) / .4; beinVers = { [fx.toFixed(3)]: -0.13 * L * t, [fx2.toFixed(3)]: 0.07 * L * t, [hx.toFixed(3)]: 0.05 * L * t, [hx2.toFixed(3)]: -0.06 * L * t }; }   // v723 (Dome): beim Grasen ein Vorderbein vor, eins zurück, hinten eins unter dem Bauch – wandert in den letzten Bildern mit
  if (!liegt) merke([P(sx(fx, fx - 1.2 * w, 0), 0), P(hx + 1.2 * w, 0)]);

  // --- Schweif ---
  const Tb = P(L - 0.015 * H, croupY + 1.5 + k.croup * 3.5);
  const tl = Math.min(k.tail * H, -Tb.y - dLiegen - 1.5), tv = k.tvol, s = k.tset;
  const X = Tb.x, Y = Tb.y;
  const schweifD =
    `M${f(X)},${f(Y)}C${f(X + 3)},${f(Y - 18 * s - 0.5)} ${f(X + 8 + 12 * s)},${f(Y - 14 * s + 3)} ${f(X + 7 + 11 * s + tv * 3)},${f(Y + 0.3 * tl - 4 * s)}` +
    `C${f(X + 7 + 9 * s + tv * 5)},${f(Y + 0.6 * tl)} ${f(X + 5 + 8 * s + tv * 5)},${f(Y + 0.85 * tl)} ${f(X + 5 + 7 * s + tv * 5)},${f(Y + tl)}` +
    `L${f(X + 3 + 6 * s + tv * 3)},${f(Y + tl - 4)}Q${f(X + 2 + 6 * s + tv * 2)},${f(Y + tl - 2)} ${f(X + 1.5 + 5.5 * s + tv * 2)},${f(Y + tl + 1.5)}L${f(X + 0.5 + 5 * s + tv)},${f(Y + tl - 3.5)}Q${f(X - 0.5 + 4.5 * s)},${f(Y + tl - 1)} ${f(X - 1.5 + 4.5 * s)},${f(Y + tl + 0.5)}L${f(X - 2.5 + 4 * s)},${f(Y + tl - 3)}Q${f(X - 3.5 + 4 * s)},${f(Y + tl - 1.5)} ${f(X - 4.5 + 4 * s)},${f(Y + tl - 0.5)}` +
    `C${f(X - 3 + 4 * s)},${f(Y + 0.6 * tl)} ${f(X + 2 + 7 * s)},${f(Y + 0.35 * tl)} ${f(X + 3 + 9 * s)},${f(Y + 12 - 14 * s)}` +
    `C${f(X + 2 + 5 * s)},${f(Y + 6 - 12 * s)} ${f(X - 2)},${f(Y + 5 - 4 * s)} ${f(X - 3)},${f(Y + 4)}Z`;
  merke([P(X + 12 + 11 * s + tv * 6, Y - 14 * s), P(X, Y + tl)]);

  // --- Ohren ---
  const el = k.ear * H * 1.25;
  const ohr = (Eb, farbe, ohneMuschel = false) => {
    // Ohren hängen, wenn der Kopf unter der Waagerechten ist (tief / liegend)
    if (ohrenHaengen) ohneMuschel = true;
    const sichel = !ohrenHaengen && !ohrenGeknickt; // alle Pferde: Sichelform (Marwari stark, andere ganz fein)
    const sStark = k.curl ? 1 : 0.32;
    const e = ohrenHaengen ? norm(P(0.85, 0.3)) : ohrenGeknickt ? norm(P(0.6, -0.8)) : sichel ? norm(P(k.curl ? 0.25 : -0.12, -1)) : norm(P(-0.22, -1)), q = P(-e.y, e.x), bw = (sichel && k.curl ? 0.2 : 0.28) * el;
    const b1 = add(Eb, mul(q, -bw)), b2 = add(Eb, mul(q, bw));
    let tip = add(Eb, mul(e, el));
    let c1 = add(add(b1, mul(e, el * 0.75)), mul(q, -bw * 0.2));
    let c2 = add(add(b2, mul(e, el * 0.55)), mul(q, bw * 0.5));
    if (ohrenGeknickt) { tip = add(add(Eb, mul(e, el * 0.6)), mul(norm(P(1, 0.15)), el * 0.42)); c1 = add(add(b1, mul(e, el * 0.62)), mul(q, -bw * 0.1)); c2 = add(add(b2, mul(e, el * 0.45)), mul(q, bw * 0.2)); }
    // Marwari: schmale Mondsichel – beide Kanten biegen parallel nach hinten aus, die Spitze dreht nach innen
    if (sichel) {
      // Marwari: schmale Mondsichel entlang eines Bogens; die Spitze dreht nach vorn/innen
      const phiMax = 1.5 * sStark, R = el * (k.curl ? 0.78 : 1.02 / phiMax), vorn = mul(q, -1), O = add(Eb, mul(vorn, R));
      const mitte = t => { const phi = t * phiMax; return add(O, add(mul(vorn, -R * Math.cos(phi)), mul(e, R * Math.sin(phi)))); };
      const breite = t => k.curl ? bw * Math.pow(1 - t, 0.8) + 0.15 : bw * Math.pow(1 - t * t, 0.9) * (1 - 0.55 * t) + 0.2 + 0.4 * Math.pow(t, 2.5); // abgerundete Spitze
      const aussen = [], innen = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10, c = mitte(t), c2_ = mitte(Math.min(1, t + 0.01)), c0 = mitte(Math.max(0, t - 0.01));
        const tan = norm(sub(c2_, c0)), nrm = P(-tan.y, tan.x);
        aussen.push(add(c, mul(nrm, breite(t)))); innen.push(add(c, mul(nrm, -breite(t))));
      }
      const spitze = mitte(k.curl ? 1.04 : 1.035);
      merke([spitze]);
      const pfad = glatt(aussen.concat([spitze], innen.reverse()), true, 0.9);
      const dunkelOhr = hexRgb(farbe).reduce((x, y) => x + y) / 3 < 70;
      const mus = [];
      for (let i = 1; i <= 8; i++) { const t = i / 10, c = mitte(t), c0 = mitte(t - 0.01), c2_ = mitte(t + 0.01), tan = norm(sub(c2_, c0)), nrm = P(-tan.y, tan.x); mus.push(add(c, mul(nrm, -breite(t) * 0.75))); }
      for (let i = 8; i >= 1; i--) { const t = i / 10, c = mitte(t); mus.push(c); }
      return `<path d="${pfad}" fill="${farbe}" stroke="${INK}" stroke-width="1.9" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>` +
        (ohneMuschel ? "" : `<path d="${glatt(mus, true, 0.8)}" fill="${dunkelOhr ? mix(farbe, "#b59a9a", .5) : mix(farbe, "#2b2240", .35)}"/>`);
    }
    merke([tip]);
    // Ohrmuschel: füllt die vordere Ohrfläche von der Basis bis zur Spitze, nur hinten bleibt ein Rand
    const i1 = add(b1, mul(q, bw * 0.12)), i2 = add(b1, mul(q, bw * 1.45)), itip = add(tip, mul(sub(Eb, tip), 0.06));
    const ic1 = add(c1, mul(q, bw * 0.12)), ic2 = add(mid(itip, i2), mul(q, -bw * 0.05));
    return `<path d="M${f(b1.x)},${f(b1.y)}Q${f(c1.x)},${f(c1.y)} ${f(tip.x)},${f(tip.y)}Q${f(c2.x)},${f(c2.y)} ${f(b2.x)},${f(b2.y)}Z" fill="${farbe}" stroke="${INK}" stroke-width="1.9" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>` + (ohneMuschel ? "" :
      `<path d="M${f(i1.x)},${f(i1.y)}Q${f(ic1.x)},${f(ic1.y)} ${f(itip.x)},${f(itip.y)}Q${f(ic2.x)},${f(ic2.y)} ${f(i2.x)},${f(i2.y)}Z" fill="${hexRgb(farbe).reduce((x, y) => x + y) / 3 < 70 ? mix(farbe, "#b59a9a", .5) : mix(farbe, "#2b2240", .35)}"/>` +
      (hexRgb(farbe).reduce((x, y) => x + y) / 3 < 70 ? `<path d="M${f(add(b1, mul(q, bw * 0.2)).x)},${f(add(b1, mul(q, bw * 0.2)).y)}Q${f(c1.x + 0.6)},${f(c1.y + 0.4)} ${f(tip.x + 0.3)},${f(tip.y + 0.8)}" fill="none" stroke="#9aa8c8" stroke-width="1.2" stroke-linecap="round" opacity=".8" vector-effect="non-scaling-stroke"/>` : ""));
  };
  const Eb = add(hp(-0.02, 0.045), P(k.earDx || 0, 0));

  // --- Mähne ---
  let maehneD = "", streifenD = "";
  if (mstil === "lang" || mstil === "kurz") {
    const n = Math.round(6 + k.vol * 2), oben = [], unten = [];
    const runter = norm(P(0.12, 1));
    for (let i = 0; i <= n; i++) {
      const t = i / n, p = kamm(t);
      oben.push(add(p, mul(nOut, 1.5 + k.vol * 1.5)));
      const len = maneLenE * H * (0.2 + 0.8 * Math.sin(Math.PI * Math.min(1, 0.08 + t * 0.95))) + (i % 2 ? -1.5 : 1.5) * k.vol;
      unten.push(add(p, mul(runter, Math.max(3, len * (i === 0 || i === n ? 0.35 : 1)))));
    }
    // Unterkante als spitze, leicht nach hinten geschwungene Haarbüschel
    let d = glatt(oben, false, 0.9);
    const ub = unten.slice().reverse(); // vom Genick zum Widerrist
    d += `L${f(ub[0].x)},${f(ub[0].y)}`;
    for (let j = 0; j < ub.length - 1; j++) {
      const a0 = ub[j], a1 = ub[j + 1], m0 = mid(a0, a1);
      const base0 = add(a0, mul(sub(kamm(1 - j / n), a0), 0.15));
      const tip = add(add(m0, mul(sub(m0, kamm(1 - (j + 0.5) / n)), 0.22 + (j % 2) * 0.12)), P(2.2 + (j % 3) * 0.8, 0));
      const back = add(a1, mul(sub(kamm(1 - (j + 1) / n), a1), 0.15));
      d += `Q${f(mid(base0, tip).x - 0.8)},${f(mid(base0, tip).y + 0.6)} ${f(tip.x)},${f(tip.y)}Q${f(mid(tip, back).x - 1.2)},${f(mid(tip, back).y - 0.4)} ${f(back.x)},${f(back.y)}`;
    }
    maehneD = d + "Z";
    merke(oben); merke(unten);
  } else if (mstil === "fjord") {
    const oben = [], unten = [], so = [], su = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, p = kamm(t), taper = Math.sin(Math.PI * (0.08 + 0.84 * t));
      oben.push(add(p, mul(nOut, 1 + 7 * taper))); unten.push(add(p, mul(nOut, -1.5)));
      so.push(add(p, mul(nOut, 1 + 5.8 * taper))); su.push(add(p, mul(nOut, 1 + 2.4 * taper)));
    }
    maehneD = glatt(oben.concat(unten.reverse()));
    if (maneStripe) streifenD = glatt(so.slice(1, 12).concat(su.slice(1, 12).reverse()));
    merke(oben);
  }
  // Schopf
  const naturS = k.fore < 0.25 ? null : k.fore < 0.45 ? "kurz" : k.fore < 0.75 ? "mittel" : k.fore < 1 ? "lang" : "extralang";
  const ohneSchopf = opt.schopf === "ohne";   // Fohlen: Schopf muss erst wachsen
  const schopfL = naturS && !ohneSchopf ? (opt.schopf || naturS) : null;
  // gestutzter Fjord-Schopf nur beim Fjordpferd mit natürlichem Schopf – sonst (auch bei Stehmähne) der normale Schopf in gewählter Länge
  const fjordSchopf = k.mane === "fjord" && (!opt.schopf || opt.schopf === naturS);
  const fl = ohneSchopf ? 0 : !schopfL ? k.fore : fjordSchopf ? Math.max(k.fore, 0.5) : schopfL === naturS ? k.fore : ({ kurz: 0.35, mittel: 0.6, lang: 0.85, extralang: 1.15 })[schopfL];
  const schopf = fjordSchopf
    ? [hp(-0.04, -0.04), hp(-0.02, -0.16), hp(0.06, -0.12), hp(0.1, -0.02), hp(0.05, 0.05)]
    : null;
  // Schopf: wächst am Genick zwischen den Ohren und fällt über die Stirn nach unten,
  // liegt dabei an der Stirnlinie an (Kopf-Koordinaten: s entlang des Gesichts, b quer dazu)
  const schopfBueschel = () => {
    const l = 0.08 + 0.42 * fl;   // Länge deutlich sichtbar: kurz – mittel – lang – extra lang
    const R0 = hp(-0.1, -0.03), R1 = hp(-0.07, 0.12);            // Ansatz zwischen den Ohren
    const o1 = hp(-0.01, -0.09), o2 = hp(0.06 + l * 0.35, -0.088);  // Vorderkante, liegt knapp vor der Stirn
    const t1 = hp(0.03 + l, -0.055), v1 = hp(0.01 + l * 0.72, -0.015);
    const t2 = hp(0.02 + l * 0.92, 0.03), v2 = hp(0.0 + l * 0.6, 0.055);
    const t3 = hp(-0.01 + l * 0.72, 0.095), b1 = hp(-0.03, 0.125);
    const c = (p1, p2, ds, db) => { const m = mid(p1, p2), q = hp(0, 0), r = hp(ds, db); return P(m.x + r.x - q.x, m.y + r.y - q.y); };
    const Q = (ctrl, p) => `Q${f(ctrl.x)},${f(ctrl.y)} ${f(p.x)},${f(p.y)}`;
    return `M${f(R0.x)},${f(R0.y)}` + Q(c(R0, o1, 0, -0.02), o1) + Q(c(o1, o2, 0, -0.012), o2) + Q(c(o2, t1, 0, -0.01), t1) +
      Q(c(t1, v1, 0, 0.012), v1) + Q(c(v1, t2, 0, -0.012), t2) + Q(c(t2, v2, 0, 0.012), v2) + Q(c(v2, t3, 0, -0.01), t3) +
      Q(c(t3, b1, 0.03, 0.01), b1) + Q(c(b1, R1, -0.02, 0), R1) + "Z";
  };
  const schopfStraehnen = () => {
    const l = 0.08 + 0.42 * fl;
    return [[hp(-0.05, -0.035), hp(0.0 + l * 0.8, -0.045)], [hp(-0.05, 0.04), hp(0.0 + l * 0.75, 0.015)], [hp(-0.05, 0.1), hp(-0.02 + l * 0.55, 0.075)]]
      .map(([a, b]) => { const m = mid(a, b), r = sub(hp(0, -0.015), hp(0, 0)); return inkFein(`M${f(a.x)},${f(a.y)}Q${f(m.x + r.x)},${f(m.y + r.y)} ${f(b.x)},${f(b.y)}`, 0.9, 'opacity=".45"'); }).join("");
  };

  // --- Details ---
  const auge = hp(0.3, 0.11), er = 0.048 * hl * (k.eye || 1);
  const maulA = hp(1.0, 0.22 * m), maulB = hp(0.88, 0.25 * m);

  // ---------- SVG zusammensetzen ----------
  const beinFill = pts ? `url(#lg-${uid})` : body;
  const beinFillF = pts ? `url(#lgf-${uid})` : dunkel(body);
  const vorderN = vorder(fx), hinterN = hinter(hx), vorderF = vorder(fx2), hinterF = hinter(hx2);
  const behN = [behang(fx), behang(hx)].filter(Boolean), behF = [behang(fx2), behang(hx2)].filter(Boolean);
  const featherCol = pts || body, featherColF = dunkel(pts || body);

  // Teile: [d, fill]
  // Untergeschlagene Beine beim Liegen (Brustlage)
  const G = bottom + gl;
  const K = P(fx - 0.3 * Lg, G - 0.45 * w);
  const vorderLiegend = [P(fx + 1.4 * w, bottom - 8), P(fx - 1.0 * w, bottom - 6), P(K.x - 0.4 * w, K.y - 0.75 * w), P(K.x - 1.0 * w, K.y + 0.1 * w), P(K.x - 0.4 * w, G), P(fx + 1.2 * w, G)];
  const vorderLiegendUnten = [P(K.x - 0.2 * w, G - 0.95 * w), P(K.x + 0.26 * Lg, G - 0.75 * w), P(K.x + 0.26 * Lg + 0.4 * w, G), P(K.x - 0.3 * w, G)];
  const hinterLiegend = [P(hx + 1.2 * w, bottom - 8), P(hx + 1.6 * w, G - 0.9 * w), P(hx + 1.0 * w, G), P(hx - 0.32 * Lg, G), P(hx - 0.32 * Lg - 0.2 * w, G - 0.8 * w), P(hx - 0.05 * Lg, G - 1.1 * w), P(hx - 0.2 * w, bottom - 4)];
  const hufLiegend = [P(K.x + 0.26 * Lg, G - 0.8 * w), P(K.x + 0.26 * Lg + 0.9 * w, G - 0.7 * w), P(K.x + 0.26 * Lg + 1.0 * w, G), P(K.x + 0.26 * Lg - 0.1 * w, G)];
  const hufLiegendH = [P(hx - 0.32 * Lg - 0.9 * w, G - 0.75 * w), P(hx - 0.32 * Lg + 0.1 * w, G - 0.8 * w), P(hx - 0.32 * Lg + 0.1 * w, G), P(hx - 0.32 * Lg - 1.0 * w, G)];
  if (liegt) merke([P(K.x - 1.2 * w, G), P(hx + 1.6 * w, G)]);
  const ptsFill = pts || body;
  const fern = liegt ? [] : [[glatt(vorderF), beinFillF], [glatt(hinterF), beinFillF], ...behF.map(b => [glatt(b), featherColF])];
  const haupt = liegt ? [[halsD, body], [glatt(rumpf), body], [glatt(hinterLiegend), body], [glatt(vorderLiegend), body], [eckig(vorderLiegendUnten), ptsFill], ...(eigenKopf ? [] : [[glatt(kopf), head]])] : [[halsD, body], [glatt(rumpf), body], [glatt(vorderN), beinFill], [glatt(hinterN), beinFill],
    ...behN.map(b => [glatt(b), featherCol]), ...(eigenKopf ? [] : [[glatt(kopf), head]])];
  const umriss = (teile, farbe, sw = 3.6) =>
    `<g fill="${farbe}" stroke="${farbe}" stroke-width="${sw}" stroke-linejoin="round" vector-effect="non-scaling-stroke">` +
    teile.map(t => `<path d="${t[0]}" vector-effect="non-scaling-stroke"/>`).join("") + "</g>" +
    teile.map(t => `<path d="${t[0]}" fill="${t[1]}"/>`).join("");

  // Bounding-Box
  let minX = Infinity, maxX = -Infinity, minY = 0;
  alle.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); });

  let defs = `<clipPath id="cl-${uid}">${haupt.map(t => `<path d="${t[0]}"/>`).join("")}</clipPath>`;
  defs += `<clipPath id="ck-${uid}"><path d="${glatt(kopf)}"/></clipPath>`;
  if (!liegt) defs += `<clipPath id="cb-${uid}"><path d="${glatt(vorderN)}"/></clipPath>`;
  defs += `<clipPath id="cr-${uid}"><path d="${halsD}"/><path d="${glatt(rumpf)}"/></clipPath>`;
  defs += `<clipPath id="cf-${uid}">${fern.map(t => `<path d="${t[0]}"/>`).join("")}</clipPath>`;
  if (pts) {
    defs += `<linearGradient id="lg-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(-0.72 * Lg)}" x2="0" y2="${f(-0.32 * Lg)}"><stop offset=".15" stop-color="${body}"/><stop offset=".85" stop-color="${pts}"/></linearGradient>`;
    defs += `<linearGradient id="lgf-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(-0.72 * Lg)}" x2="0" y2="${f(-0.32 * Lg)}"><stop offset=".15" stop-color="${dunkel(body)}"/><stop offset=".85" stop-color="${dunkel(pts)}"/></linearGradient>`;
  }
  defs += `<linearGradient id="sh-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(-H * 1.1)}" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`;
  // Apfelschimmel / Roan: jeder Fleck mit kreisförmiger Blende (weicher Verlauf von innen nach außen)
  if (C.pattern === "dapple") defs += `<radialGradient id="dg-${uid}"><stop offset="0" stop-color="${C.dapple}" stop-opacity=".95"/><stop offset=".55" stop-color="${C.dapple}" stop-opacity=".7"/><stop offset="1" stop-color="${C.dapple}" stop-opacity="0"/></radialGradient>` +
    `<pattern id="dp-${uid}" patternUnits="userSpaceOnUse" width="8" height="7"><circle cx="4" cy="3.5" r="3" fill="url(#dg-${uid})"/><circle cx="0" cy="0" r="2.7" fill="url(#dg-${uid})"/><circle cx="8" cy="0" r="2.7" fill="url(#dg-${uid})"/><circle cx="0" cy="7" r="2.7" fill="url(#dg-${uid})"/><circle cx="8" cy="7" r="2.7" fill="url(#dg-${uid})"/></pattern>`;
  if (C.pattern === "fleck") { const FP = [[1, 1.2, .42], [3.9, 2.6, .36], [2.2, 4.3, .3], [5.3, 4.9, .4], [4.6, .5, .28], [.4, 3.1, .3], [3, .3, .26], [5.6, 2.2, .3], [1.6, 5.2, .27]], nF = C.fleckSt === 0 ? 2 : C.fleckSt === 2 ? 9 : 5;   // v474: wenige/typisch/viele Fliegen
    defs += `<pattern id="fk-${uid}" patternUnits="userSpaceOnUse" width="6" height="5.5">${FP.slice(0, nF).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.fleck}"/>`).join("")}</pattern>`; }
  if (C.pattern === "roan") defs += `<radialGradient id="rg-${uid}"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<pattern id="rn-${uid}" patternUnits="userSpaceOnUse" width="3" height="3"><circle cx="1" cy="1" r=".85" fill="url(#rg-${uid})"/><circle cx="2.4" cy="2.2" r=".7" fill="url(#rg-${uid})"/></pattern>`;
  // v443 (Dome): beim Achal-Tekkiner glänzen Cream- und Falbfarben golden („Gold“: Goldfalbe/Buckskin, Gold-Palomino)
  const silber = !perl && MG > .3 && /isabell/.test(fidT), mtc = silber ? "#eef2ff" : perl ? "#fff0cf" : bronze ? "#ffd7a6" : gold ? "#ffe08a" : "#fff", mtA = (silber || bronze || perl ? .75 : gold ? .7 : .5) * MG, mtB = (silber || bronze || perl ? .5 : gold ? .48 : .32) * MG;   // v444 (Dome): Isabell silbrig, Braune/Rappen glänzen auch
  // v491 (Dome): auf dunklem Fell wirkte der weiße Glanz zu hart – dort in der Fellfarbe getönt, schwächer und mit weicheren Übergängen (dk 0 = hell … 1 = Rappe)
  const dk = Math.max(0, Math.min(1, (0.5 - hexRgb(body).reduce((x, y) => x + y) / 765) / 0.35)), mtF = MG > 0 ? mix(mtc.length === 4 ? "#ffffff" : mtc, mix(body, "#ffffff", .6), .45 * dk) : mtc, wA = 1 - .3 * dk;
  const mStop = (o, a) => `<stop offset="${o}" stop-color="${mtF}" stop-opacity="${(a * wA).toFixed(3)}"/>`;
  if (MG > 0) defs += `<linearGradient id="mt-${uid}" gradientUnits="userSpaceOnUse" x1="${f(-0.1 * L)}" y1="${f(-H * 1.3)}" x2="${f(L)}" y2="0">` + (dk > 0
    ? mStop(.1, 0) + mStop(.24, mtA * .45) + mStop(.35, mtA) + mStop(.43, mtA * .45) + mStop(.53, 0) + mStop(.62, mtB * .55) + mStop(.68, mtB) + mStop(.74, mtB * .55) + mStop(.84, 0)
    : mStop(.15, 0) + mStop(.35, mtA) + mStop(.48, 0) + mStop(.62, mtB) + mStop(.75, 0)) + `</linearGradient>`;

  const bx = `x="${f(minX - 5)}" y="${f(minY - 5)}" width="${f(maxX - minX + 10)}" height="${f(-minY + 10)}"`;
  if (C.pattern === "dapple" || C.pattern === "roan" || C.pattern === "fleck") defs += `<mask id="mk-${uid}" maskUnits="userSpaceOnUse" ${bx}><g filter="url(#wm6-${uid})"><path d="${halsD}" fill="#fff"/><path d="${glatt(rumpf)}" fill="#fff" transform="translate(0,-3)"/></g></mask><filter id="wm6-${uid}" filterUnits="userSpaceOnUse" ${bx}><feGaussianBlur stdDeviation="5"/></filter>`;
  defs += `<filter id="wm-${uid}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3"/></filter>`;
  defs += `<filter id="wb-${uid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>`;
  let g = `<defs>${defs}</defs>`;

  // Beinabzeichen je Bein (v430): opt.beinAbz = { vn, vf, hn, hf } – vorn/hinten, nah = linke Seite (zum Betrachter), fern = rechte Seite
  // Stufen: ballen, krone, halbeFessel, fessel, halberFuss, fuss, hochweiss. Zebrastreifen (Falben): opt.zebra 0–1, Schulterstreifen opt.schulter
  const BA = opt.beinAbz || {};
  const BEIN_H = { krone: .045, halbeFessel: .085, fessel: .12, halberFuss: .3, fuss: .5, hochweiss: .75 };
  const beinClip = (id, pts) => `<clipPath id="bw-${uid}-${id}"><path d="${glatt(pts)}"/></clipPath>`;
  const beinWeiss = (st, xc, id, farbe) => {
    if (!st) return "";
    let m;
    if (st === "ballen") m = `<ellipse cx="${f(xc + 0.5 * w)}" cy="${f(-hh - 0.4)}" rx="${f(0.5 * w)}" ry="${f(0.42 * hh)}" fill="${farbe}"/>`;
    else {   // v437 (Dome): unregelmäßiger, leicht schräger Rand statt gerader Kante – je höher das Weiß, desto unruhiger
      const hoehe = BEIN_H[st] || 0, rj = zufall((opt.seed || rasseId) + "-bein-" + id), amp = 0.5 + hoehe * 7, schraeg = (rj() - 0.5) * hoehe * 10, wl = [P(xc - 3 * w, 3), P(xc + 3 * w, 3)];
      for (let x = xc + 3 * w; x >= xc - 3 * w; x -= 1.2) wl.push(P(x, -hoehe * Lg - hh - 1 + (rj() - 0.5) * amp + schraeg * (x - xc) / (3 * w)));
      m = `<path d="${glatt(wl)}" fill="${farbe}"/>`; }
    return `<g clip-path="url(#bw-${uid}-${id})">${m}</g>`;
  };
  const zebraStreifen = (xc, id, farbe) => {   // Streifen am Unterarm bzw. Unterschenkel (oberhalb von Knie/Sprunggelenk)
    if (!opt.zebra || !(C.stripe || C.points)) return "";
    const n = 2 + Math.round(opt.zebra * 3), op = (0.3 + 0.45 * opt.zebra).toFixed(2), sw = (1 + 0.7 * opt.zebra).toFixed(2);
    let m = "";
    for (let i = 0; i < n; i++) { const y = -(0.93 - i * 0.3 / Math.max(1, n - 1)) * Lg; m += `<path d="M${f(xc - 1.6 * w)},${f(y + 0.6)}Q${f(xc)},${f(y + 1.6)} ${f(xc + 1.6 * w)},${f(y - 0.4)}" fill="none" stroke="${farbe}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`; }
    return `<g clip-path="url(#bw-${uid}-${id})">${m}</g>`;
  };
  const weissHuf = st => st && st !== "ballen" && st !== "krone";   // ab weißer Fessel: heller Huf (wie in echt)
  const hufFarbe = st => weissHuf(st) ? "#cbbd9c" : hoof;
  // v441 Leopard-Komplex: gestreifte Hufe (helle und dunkle Längsstreifen)
  const LP = opt.lp || null;
  const hufFill = (st, fern) => LP && LP.huf && !weissHuf(st) ? `url(#hs${fern ? "f" : ""}-${uid})` : fern ? dunkel(hufFarbe(st)) : hufFarbe(st);
  if (LP && LP.huf) [["", hoof], ["f", dunkel(hoof)]].forEach(([k, c]) => { defs += `<pattern id="hs${k}-${uid}" patternUnits="userSpaceOnUse" width="2.6" height="10"><rect width="2.6" height="10" fill="${c}"/><rect x="1.5" width="0.9" height="10" fill="${k ? dunkel("#cbbd9c") : "#cbbd9c"}"/></pattern>`; });
  if (!liegt) defs += beinClip("vn", vorderN) + beinClip("hn", hinterN) + beinClip("vf", vorderF) + beinClip("hf", hinterF);
  g = `<defs>${defs}</defs>`;

  // Hintere Beine
  g += `<g>${umriss(fern, INK)}`;
  if (C.pattern === "fleck" && !liegt) g += `<g clip-path="url(#cf-${uid})"><rect ${bx} fill="url(#fk-${uid})" opacity=".8"/></g>`;   // v468 (Dome): Fliegentupfen auch an den fernen Beinen
  if (C.pattern === "tobiano") g += `<rect x="${f(minX)}" y="${f(-0.68 * Lg)}" width="${f(maxX - minX)}" height="${f(0.68 * Lg + 2)}" fill="#dedad3" clip-path="url(#cf-${uid})" filter="url(#wm-${uid})"/>`;
  if (["tovero", "leopard", "fewspot"].includes(C.pattern) || ganzWeiss) {
    g += `<g clip-path="url(#cf-${uid})"><rect x="${f(minX)}" y="${f(-Lg - 6)}" width="${f(maxX - minX)}" height="${f(Lg + 8)}" fill="#dedad3"/>`;
    if (C.pattern === "leopard" && !ganzWeiss) for (let i = 0; i < 9; i++) g += `<ellipse cx="${f(minX + rnd() * (maxX - minX))}" cy="${f(-rnd() * Lg)}" rx="${f(1.6 + rnd() * 1.8)}" ry="${f(1.4 + rnd() * 1.5)}" fill="${dunkel(spotFarbe)}"/>`;
    g += `</g>`;
  }
  if (!liegt) { const sf = dunkel(C.stripe || C.points || body), wf = dunkel("#f6f4ee");
    g += zebraStreifen(fx2, "vf", sf) + zebraStreifen(hx2, "hf", sf) + beinWeiss(BA.vf, fx2, "vf", wf) + beinWeiss(BA.hf, hx2, "hf", wf); }
  g += `<g stroke="${INK}" stroke-width="1.6" vector-effect="non-scaling-stroke">` +
    (liegt ? [] : [[huf(fx2), BA.vf], [huf(hx2), BA.hf]]).map(([h, st]) => `<path d="${eckig(h)}" fill="${hufFill(st, true)}" vector-effect="non-scaling-stroke"/>`).join("") + "</g></g>";


  // Fernes Ohr
  if (!eigenKopf) g += ohr(add(Eb, P(4.5, 0.5)), dunkel(head), true);

  // Hauptkörper
  g += `<g>${umriss(haupt, linie)}`;
  // Überlagerungen
  g += `<g clip-path="url(#cl-${uid})">`;
  const WEISS_MUSTER = ["tobiano", "overo", "tovero", "blanket", "snowcap", "sabino", "splash"], aalStrich = () => `<path d="${glatt([P(0.2 * L, -H + 0.5), P(0.42 * L, top + 2.5), P(0.62 * L, top + 1.6), P(0.82 * L, croupY), Tb], false)}" fill="none" stroke="${C.stripe}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>`;
  if (C.stripe && !ganzWeiss && WEISS_MUSTER.includes(C.pattern)) g += aalStrich();   // v510 (Dome): bei Scheckungen vor dem Weiß – Aalstrich nur in den farbigen Flächen sichtbar
  // v440: Stichelhaare (feine weiße Punkte) mit weichem Übergang – Sabino-Ränder, Rabicano. inner = Flächen (SVG), weite = Breite des Saums
  let stN = 0;
  const stichel = (inner, weite, dichte = 1, T = 11) => { const id = `st${++stN}-${uid}`, rs = zufall("st" + stN + (opt.seed || ""));   // v654: ohne die laufende Zeichen-Nummer (uid) – sonst sprang das Fellmuster bei jedem Neuzeichnen (Fohlen beim Streicheln der Stute)
    let dots = ""; for (let i = 0; i < Math.round(34 * T * T / 121); i++) dots += `<ellipse cx="${f(rs() * T)}" cy="${f(rs() * T)}" rx="${f(0.22 + rs() * 0.3)}" ry="${f(0.35 + rs() * 0.35)}" fill="#fbfaf6" opacity="${f(0.6 + rs() * 0.4)}"/>`;
    return `<pattern id="p${id}" patternUnits="userSpaceOnUse" width="${T}" height="${T}">${dots}</pattern><mask id="m${id}" maskUnits="userSpaceOnUse" ${bx}><g filter="url(#wb-${uid})" fill="#fff" stroke="#fff" stroke-width="${f(weite)}" opacity="${f(Math.min(1, dichte))}">${inner}</g></mask><rect ${bx} fill="url(#p${id})" mask="url(#m${id})"/>`; };
  if (C.pattern === "dapple") g += `<g clip-path="url(#cr-${uid})"><rect ${bx} fill="url(#dp-${uid})" mask="url(#mk-${uid})"/></g>`;
  if (C.pattern === "roan") g += `<g clip-path="url(#cr-${uid})"><rect ${bx} fill="url(#rn-${uid})" mask="url(#mk-${uid})"${C.roanDeck != null && C.roanDeck < 1 ? ` opacity="${C.roanDeck.toFixed(2)}"` : ""}/></g>`;
  if (C.pattern === "fleck") g += `<g clip-path="url(#cl-${uid})"><rect ${bx} fill="url(#fk-${uid})" opacity=".8"/></g>`;
  if (C.pattern === "tobiano") {
    const flecken = [];
    const blob = (cx, cy, rx, ry, n = 13) => {
      const ps = [];
      for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2, r = 0.72 + rnd() * 0.5; ps.push(P(cx + Math.cos(an) * rx * r, cy + Math.sin(an) * ry * r)); }
      return glatt(ps);
    };
    const sc = [0.5, 1, 1.6][M2];
    if (M2 === 0) flecken.push(blob(0.12 * L + rnd() * 0.25 * L, top + 0.05 * D, 0.08 * L, 0.22 * D));   // wenig: ein kleiner Fleck über dem Rücken
    else {
      flecken.push(blob(0.45 * L + (rnd() - .5) * 0.15 * L, top + 0.15 * D * sc, (0.2 * L + rnd() * 0.1 * L) * sc, 0.75 * D * sc));
      if (M2 === 2 || rnd() > 0.3) flecken.push(blob(0.1 * L, -H - 8, 0.12 * L * sc, (0.35 * D + 6) * sc));
      if (M2 === 2 || rnd() > 0.35) flecken.push(blob(0.86 * L, top + 0.3 * D, (0.1 * L + rnd() * 0.08 * L) * sc, 0.45 * D * sc));
    }
    g += `<g filter="url(#wm-${uid})">` + flecken.map(fd => `<path d="${fd}" fill="#f7f5f1"/>`).join("");
    const wl = [P(minX, 2)];
    const bh = [0.38, 0.66, 0.9][M2];
    for (let x = minX; x <= maxX; x += 6) wl.push(P(x, -(bh + 0.1 * Math.sin(x * 0.21) + rnd() * 0.06) * Lg));
    wl.push(P(maxX, 2));
    g += `<path d="${eckig(wl)}" fill="#f7f5f1"/></g>`;
  }
  // Overo, Tovero, Tiger: Flecken / Punkte
  if (["overo", "tovero", "leopard", "fewspot", "blanket", "snowcap", "sabino", "splash"].includes(C.pattern)) {
    const zack = (cx, cy, rx, ry, n = 20, var_ = .55) => { const ps = []; for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2, r = 0.7 + rnd() * var_; ps.push(P(cx + Math.cos(an) * rx * r, cy + Math.sin(an) * ry * r)); } return ps; };
    const punkte = (x0, x1, y0, y1, n, r0, r1, farbe) => { let s = ""; for (let i = 0; i < n; i++) { const r = r0 + rnd() * (r1 - r0); s += `<ellipse cx="${f(x0 + rnd() * (x1 - x0))}" cy="${f(y0 + rnd() * (y1 - y0))}" rx="${f(r)}" ry="${f(r * (.75 + rnd() * .35))}" fill="${farbe}"/>`; } return s; };
    if (C.pattern === "overo") {
      // waagerecht gezackte weiße Flecken an Seite und Hals – kreuzen nie den Rücken, Beine bleiben farbig
      const mx = 0.45 * L + (rnd() - .5) * 0.1 * L, sc = [0.45, 1, 1.5][M2];
      let w = `<path d="${eckig(zack(mx - 0.08 * L, top + 0.66 * D, 0.15 * L * sc, 0.24 * D * Math.min(1.3, sc), 26, .6))}" fill="${SW}"/>`;
      if (M2 > 0) { w += `<path d="${eckig(zack(mx + 0.09 * L, top + 0.56 * D + (rnd() - .5) * 4, 0.14 * L * sc, 0.2 * D * Math.min(1.3, sc), 24, .6))}" fill="${SW}"/>`;
        w += `<path d="${eckig(zack(0.04 * L, top + 0.05 * D - 6, 0.09 * L * sc, 0.3 * D * sc, 16))}" fill="${SW}"/>`;
        if (M2 === 2 || rnd() > .4) w += `<path d="${eckig(zack(0.74 * L, top + 0.62 * D, 0.1 * L * sc, 0.2 * D * sc, 16))}" fill="${SW}"/>`; }
      g += `<g filter="url(#wm-${uid})">${w}</g>`;
    }
    if (C.pattern === "tovero") {
      // fast ganz weiß – Farbe bleibt an Kopf/Ohren („Medicine Hat“), Brust und Flanke
      const fc = [2, 1.7, 0.75][M2];   // Farbflecken: wenig Weiß = große Flecken, viel Weiß = nur Brustschild und Flankenfleck (v440: typisch deutlich mehr Farbe)
      g += `<rect ${bx} fill="${SW}"/><g filter="url(#wm-${uid})"><path d="${glatt(zack(0.02 * L, top + 0.42 * D, 0.1 * L * fc, 0.3 * D * Math.min(1.4, fc), 14, .4))}" fill="${body}"/>`;
      g += `<path d="${glatt(zack(0.93 * L, top + 0.3 * D, 0.11 * L * fc, 0.32 * D * Math.min(1.4, fc), 14, .4))}" fill="${body}"/>`;
      if (M2 === 0 || (M2 === 1 && (rnd(), true))) g += `<path d="${glatt(zack(0.15 * L + (M2 ? 0 : 0.2 * L), -H - 4 + (M2 ? 0 : 0.2 * D), 0.08 * L * fc, 0.18 * D * fc, 12, .4))}" fill="${body}"/>`;
      if (M2 <= 1) { const rt = zufall((opt.seed || rasseId) + "-tovero"), w0 = M2 === 0;   // v440 (Dome): typisch mit Farbe über dem Rücken – wenig: Farbe bedeckt den größten Teil des Rumpfs, weiß bleiben Bauch, Beine und Teile von Hals/Flanke
        g += `<path d="${glatt(zack(0.5 * L + (rt() - .5) * 0.12 * L, top + (w0 ? 0.3 : 0.18) * D, (w0 ? 0.34 : 0.16) * L, (w0 ? 0.5 : 0.32) * D, 16, .45))}" fill="${body}"/>`;
        if (w0) g += `<path d="${glatt(zack(0.08 * L, top - 0.05 * D, 0.13 * L, 0.45 * D, 14, .45))}" fill="${body}"/>`; }
      g += `</g>`;
    }
    if (C.pattern === "sabino") {
      // Sabino (v316): weißer Bauchfleck mit unruhigem, gesprenkeltem Rand, oft ein zweiter an Brust/Flanke – dazu Blesse und hohe weiße Beine (unten bei den Abzeichen)
      const mx = 0.5 * L + (rnd() - .5) * 0.12 * L, sc = [0.35, 1, 2.2][M2];
      let w = `<path d="${eckig(zack(mx, bottom - 0.08 * D * sc, (0.2 * L + rnd() * 0.06 * L) * Math.min(1.9, sc), 0.24 * D * sc, 28, .75))}" fill="${SW}"/>`;
      if (M2 === 2 || (M2 === 1 && rnd() > .45)) w += `<path d="${eckig(zack(0.12 * L, bottom - 0.12 * D * sc, 0.08 * L * sc, 0.18 * D * sc, 18, .7))}" fill="${SW}"/>`;
      g += `<g clip-path="url(#cr-${uid})">${stichel(w, [5, 8, 11][M2])}</g><g filter="url(#wm-${uid})">${w}</g>` + punkte(mx - 0.3 * L * Math.min(1.6, sc), mx + 0.3 * L * Math.min(1.6, sc), bottom - 0.45 * D * Math.min(2, sc), bottom - 0.12 * D, [10, 22, 55][M2], 0.6, 1.4, SW);
    }
    if (C.pattern === "splash") {
      // Splashed White (v426): wie „von unten in weiße Farbe getaucht“ – glatter, klarer Rand, Bauch und Brust weiß, hohe weiße Beine (unten bei den Abzeichen)
      const hoch = [0.12 + rnd() * 0.1, 0.35 + rnd() * 0.4, 0.95 + rnd() * 0.15][M2] + (MST === 3 ? 0.45 : 0), rand = [P(minX - 6, 4)];
      const rsp = zufall((opt.seed || rasseId) + "-splash"), ph1 = rsp() * 6.3, ph2 = rsp() * 6.3;   // v440 (Dome): klarer Rand, aber geschwungen – keine Linie wie mit dem Lineal
      for (let i = 0; i <= 28; i++) { const t = i / 28, x = minX - 6 + (maxX - minX + 12) * t; rand.push(P(x, bottom - hoch * D * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15))) + Math.sin(t * 5.5 + ph1) * D * 0.13 + Math.sin(t * 13 + ph2) * D * 0.045 + (rnd() - .5) * 3)); }
      rand.push(P(maxX + 6, 4));
      g += `<g filter="url(#wm-${uid})"><path d="${glatt(rand)}" fill="${SW}"/></g>`;
    }
    if (C.pattern === "leopard") g += `<rect ${bx} fill="${SW}"/>` + punkte(minX, maxX, minY, 0, [40, 70, 100][M2], 2.2, 4.6, spotFarbe);
    if (C.pattern === "fewspot") g += `<rect ${bx} fill="${SW}"/>` + punkte(0, L, top, bottom, [3, 7, 14][M2], 1.4, [2.2, 2.6, 3][M2], spotFarbe) + `<g filter="url(#wm-${uid})"><rect x="${f(minX)}" y="${f(-0.62 * Lg)}" width="${f(maxX - minX)}" height="${f(0.2 * Lg)}" fill="${mix(body, SW, .35)}" opacity="${[.45, .7, .85][M2]}"/></g>`;   // v497 (Dome): Stufe wirkt – wenige/typisch/mehr Punkte, Restfarbe an Knien/Sprunggelenken
    if (C.pattern === "blanket" || C.pattern === "snowcap") {
      // weiße Decke über Kruppe und Hüfte
      const x0 = ((C.pattern === "snowcap" ? 0.38 : 0.5) + [0.28, 0, -0.25][M2]) * L + (rnd() - .5) * 0.08 * L, rand = [];   // Schabracke klein/typisch/groß
      rand.push(P(L + 8, croupY - 8), P(x0, top - 6));
      for (let i = 0; i <= 8; i++) { const t = i / 8; rand.push(P(x0 + (L + 6 - x0) * t + (rnd() - .5) * 4, top + (0.35 + 0.25 * Math.sin(t * Math.PI) + rnd() * .12) * D)); }
      rand.push(P(L + 8, top + 0.75 * D));
      g += `<clipPath id="bl-${uid}"><path d="${glatt(rand)}"/></clipPath><g filter="url(#wm-${uid})"><path d="${glatt(rand)}" fill="${SW}"/></g>`;
      if (C.pattern === "blanket") g += `<g clip-path="url(#cr-${uid})"><g clip-path="url(#bl-${uid})">${punkte(x0, L + 8, top - 8, top + 0.75 * D, 26, 1.5, 3.1, spotFarbe)}</g></g>`;
    }
  }
  // v440 (Dome): Stufe „fast weiß“ – weißer Körper, Farbe bleibt nur als Kappe hinterm Genick („Medicine Hat“), Brustschild und einzelnen Flecken
  const klecks = (rf, cx, cy, rx, ry, farbe = body) => { const ps = []; for (let i = 0; i < 14; i++) { const an = i / 14 * Math.PI * 2, r = 0.7 + rf() * 0.5; ps.push(P(cx + Math.cos(an) * rx * r, cy + Math.sin(an) * ry * r)); } return `<path d="${glatt(ps)}" fill="${farbe}"/>`; };
  const kappe = add(kamm(0.9), mul(nOut, -3));
  if ((fastWeiss && C.pattern !== "splash") || DW >= 2) {
    const rf = zufall((opt.seed || rasseId) + (DW >= 2 ? "-dw" : "-fastweiss")), pa = DW >= 2 ? "dw" : C.pattern;
    const W_ = { tobiano: [.85, .5, .35, 0], tovero: [1, .9, 0, 0], sabino: [.6, .2, .2, .5], overo: [.7, .3, .2, .7], dw: [.5, .2, .3, .6] }[pa];   // Chance: Kappe, Brustschild, Flankenfleck, Flecken auf dem Rücken
    let rest = "";
    if (DW !== 3) {
      if (rf() < W_[0]) rest += pa === "tovero" ? klecks(rf, kappe.x - 0.01 * L, kappe.y + 0.04 * D, 0.14 * L, 0.22 * D) : klecks(rf, kappe.x, kappe.y, 0.09 * L, 0.15 * D);   // v730 (Dome): Medicine Hat = deutliche „Kappe“ im Genick plus Brustschild
      if (rf() < W_[1]) rest += pa === "tovero" ? klecks(rf, 0.02 * L, top + 0.45 * D, 0.09 * L, 0.26 * D) : klecks(rf, 0.01 * L, top + 0.42 * D, 0.06 * L, 0.18 * D);
      if (rf() < W_[2]) rest += klecks(rf, (0.6 + rf() * 0.25) * L, top + 0.35 * D, 0.08 * L, 0.2 * D);
      if (rf() < W_[3]) { rest += klecks(rf, (0.3 + rf() * 0.1) * L, top + 0.1 * D, 0.11 * L, 0.17 * D); if (rf() < .6) rest += klecks(rf, (0.72 + rf() * 0.1) * L, top + 0.12 * D, 0.09 * L, 0.18 * D); }
    }
    g += `<rect ${bx} fill="${SW}"/>` + (eigenKopf ? "" : `<path d="${glatt(kopf)}" fill="${head}"/>`);
    if (rest) g += (pa === "sabino" || pa === "dw" ? `<g clip-path="url(#cr-${uid})">${stichel(rest, 7)}</g>` : "") + `<g filter="url(#wm-${uid})">${rest}</g>`;
  }
  // v440 Dominant White (Gen W), wenig/typisch: weißer Bauch mit unregelmäßigem Rand, bei „typisch“ großflächig bis zur Körpermitte
  if (DW === 0 || DW === 1) {
    const rd = zufall((opt.seed || rasseId) + "-dw");
    let w = klecks(rd, (0.42 + rd() * 0.1) * L, bottom - (DW ? 0.25 : 0.05) * D, (DW ? 0.42 : 0.22) * L, (DW ? 0.5 : 0.22) * D, SW);
    if (DW === 1) w += klecks(rd, 0.05 * L, top + 0.6 * D, 0.1 * L, 0.3 * D, SW) + klecks(rd, 0.85 * L, top + 0.55 * D, 0.12 * L, 0.3 * D, SW);
    g += `<g clip-path="url(#cr-${uid})">${stichel(w, 6, .7)}</g><g filter="url(#wm-${uid})">${w}</g>`;
  }
  // v440 Rabicano: weiße Stichelhaare an Flanke und Bauch (Stufe 0–3 wie die Muster-Ausprägung)
  if (opt.rabi != null) {
    const sc = [0.65, 1, 1.35, 1.7][opt.rabi] || 1, rr = zufall((opt.seed || rasseId) + "-rabi");
    const fl = klecks(rr, (0.66 + rr() * 0.06) * L, bottom - 0.28 * D, 0.17 * L * sc, 0.3 * D * sc, "#fff") + klecks(rr, 0.45 * L, bottom - 0.05 * D, 0.14 * L * sc, 0.12 * D * sc, "#fff");
    g += `<g clip-path="url(#cr-${uid})">${stichel(fl, 9 * sc, 0.6 + 0.15 * (opt.rabi || 0))}</g>`;
  }
  // v440 Birdcatcher-Tupfen: kleine weiße Tupfen verstreut (Anzahl wächst mit dem Alter)
  if (opt.birdcatcher > 0) {
    const rb = zufall((opt.seed || rasseId) + "-bird"); let t = "";
    for (let i = 0; i < opt.birdcatcher; i++) { const r = 0.45 + rb() * 0.55; t += `<ellipse cx="${f((0.08 + rb() * 0.9) * L)}" cy="${f(top + (0.1 + rb() * 0.7) * D)}" rx="${f(r)}" ry="${f(r * (0.8 + rb() * 0.3))}" fill="#fbfaf6" opacity="${f(0.85 + rb() * 0.15)}"/>`; }
    g += `<g clip-path="url(#cr-${uid})">${t}</g>`;   // v499 (Dome): Birdcatcher = winzige, scharf begrenzte Pünktchen (Snowflake: größere, weiche Flocken)
  }
  // v440 Bend-Or-Flecken: unregelmäßige dunkle Flecken (Farbe aus dem Fell, dunkler) – nur bei Füchsen/Palominos
  if (opt.bendor) {
    const ro = zufall((opt.seed || rasseId) + "-bendor"), fc = mix(body, "#1a0c06", .68); let t = "";
    // v496 (Dome): Lage aus der vererbten Anlage – opt.bendorZone = Zonen (0 Vorhand, 1 Mittelhand, 2 Hinterhand), ohne Angabe überall
    const zonen = Array.isArray(opt.bendorZone) && opt.bendorZone.length ? opt.bendorZone : [0, 1, 2], ZB = [[0.0, 0.26], [0.26, 0.62], [0.62, 0.95]];
    const n = Math.max(2, Math.round((4 + Math.floor(ro() * 4)) * (typeof opt.bendor === "number" ? opt.bendor : 1) * (0.7 + 0.1 * zonen.length)));   /* v504 (Dome): weniger Flecken (typisch 4–7) */   /* opt.bendor .5/1/1.8 = wenige/typisch/viele; auf einer Zone etwas weniger */
    // v503 (Dome): wie in echt unregelmäßig – lockere Gruppen (2–3 je Zone) mit verschieden großen Flecken, dazwischen Lücken; einzelne Flecken auch frei
    const gruppen = []; zonen.forEach(zi => { const z = ZB[zi], m = 2 + Math.floor(ro() * 2); for (let j = 0; j < m; j++) gruppen.push({ x: (z[0] + (z[1] - z[0]) * (0.1 + ro() * 0.8)) * L, y: top + (0.2 + ro() * 0.5) * D, z }); });
    for (let i = 0; i < n; i++) { const G0 = gruppen[Math.floor(ro() * gruppen.length)], frei = ro() < 0.45, gauss = () => (ro() + ro() + ro() - 1.5) / 1.5;
      const cx = frei ? (G0.z[0] + (G0.z[1] - G0.z[0]) * ro()) * L : G0.x + gauss() * 0.14 * L, cy = frei ? top + (0.12 + ro() * 0.66) * D : G0.y + gauss() * 0.3 * D, r = 1.4 + Math.pow(ro(), 1.8) * 3.6;
      t += klecks(ro, cx, cy, r, r * (0.65 + ro() * 0.5), fc); }
    g += `<g clip-path="url(#cr-${uid})" filter="url(#wm-${uid})" opacity=".92">${t}</g>`;
  }
  // v440 Brindle (gestromt): feine dunkle, leicht gewellte senkrechte Streifen
  // v440 Brindle (gestromt): unterbrochene, gewellte senkrechte Streifen – weiß (BR1, vererbt) oder dunkel (Chimäre, Zufall)
  if (opt.brindle) {
    const weiss = opt.brindle === "weiss", rg = zufall((opt.seed || rasseId) + (weiss ? "-brindleW" : "-brindle")), sf = weiss ? "#f1ede6" : mix(body, "#140c08", .55); let t = "";
    const BA = opt.brindleArt || "", sw0 = BA === "fein" ? .55 : 1, op0 = BA === "dezent" ? .45 : 1;   // v500 (Dome): Ausprägung typisch/dezent/fein/teil (nur teilweise)
    for (let x = minX; x < maxX; x += (BA === "fein" ? 1.7 + rg() * 1.2 : 3 + rg() * 2.6)) { let y = minY - 4 + rg() * 8;
      while (y < 2) { const len = 5 + rg() * 14, pts = []; for (let yy = y; yy < y + len; yy += 2.5) pts.push(P(x + Math.sin(yy * 0.22 + x * 0.7) * 1.6 + (rg() - .5) * 0.8, yy));
        if (pts.length > 1) t += `<path d="${glatt(pts, false)}" fill="none" stroke="${sf}" stroke-width="${f((0.5 + rg() * 0.9) * sw0)}" stroke-linecap="round" opacity="${f(((weiss ? 0.45 : 0.6) + rg() * 0.4) * op0)}"/>`;
        y += len + 1 + rg() * 6; } }
    if (BA === "teil") { const rk = zufall((opt.seed || rasseId) + "-brteil"), fl = klecks(rk, 0.82 * L, top + 0.4 * D, 0.2 * L, 0.5 * D, "#fff") + klecks(rk, 0.12 * L, top + 0.35 * D, 0.12 * L, 0.4 * D, "#fff"); t = `<mask id="bt-${uid}" maskUnits="userSpaceOnUse" ${bx}><g filter="url(#wb-${uid})">${fl}</g></mask><g mask="url(#bt-${uid})">${t}</g>`; }   // Streifen nur an Hinterhand und Schulter
    g += `<g clip-path="url(#cr-${uid})" filter="url(#wm-${uid})">${t}</g>`;
  }
  // v444 Kombinationen (Dome): Roan unter einem anderen Muster (Stichelhaare in den farbigen Flecken), Tiger + Tobiano („Pintaloosa“: weiße Platten dazu)
  if (opt.roanMix) g += `<g clip-path="url(#cr-${uid})">${stichel(`<path d="${halsD}" fill="#fff"/><path d="${glatt(rumpf)}" fill="#fff"/>`, 3, .9, 23)}${stichel(`<path d="${glatt(rumpf)}" fill="#fff"/>`, 3, .6, 29)}</g>`;
  if (opt.tobianoMix) { const rt = zufall((opt.seed || rasseId) + "-pinta");
    const pl = klecks(rt, (0.4 + rt() * 0.15) * L, top + 0.25 * D, 0.22 * L, 0.6 * D, SW) + klecks(rt, 0.1 * L, -H - 6, 0.12 * L, 0.35 * D, SW) + (rt() < .6 ? klecks(rt, 0.85 * L, top + 0.35 * D, 0.12 * L, 0.4 * D, SW) : "");
    g += `<g filter="url(#wm-${uid})">${pl}</g>`; }
  // v441 Leopard-Komplex (PLAN-SCHECKUNG.md Schritt 3): Lackschimmel (wird mit dem Alter heller, über Knochen bleibt es dunkel), Snowflake, Frost
  if (LP) {
    const rl = zufall((opt.seed || rasseId) + "-lp"), koerper = `<path d="${halsD}" fill="#fff"/><path d="${glatt(rumpf)}" fill="#fff"/>`;
    if (LP.lack > 0) {
      g += `<g clip-path="url(#cr-${uid})">${stichel(koerper, 3, LP.lack, 29)}${stichel(koerper, 3, LP.lack * 0.85, 23)}${LP.lack > .5 ? stichel(koerper, 3, (LP.lack - .5) * 2, 31) : ""}</g>`;
      const marke = [[0.0, top + 0.45 * D, 0.06, 0.16], [0.13, bottom - 0.12 * D, 0.05, 0.14], [0.8, top + 0.12 * D, 0.06, 0.12], [0.74, bottom - 0.2 * D, 0.06, 0.16], [0.35, top + 0.06 * D, 0.1, 0.08]]
        .map(([x, y, rx, ry]) => klecks(rl, x * L, y, rx * L, ry * D, dunkel(body))).join("");   // „Varnish marks“ an Bug, Ellbogen, Hüfthöcker, Knie, Widerrist
      g += `<g clip-path="url(#cr-${uid})" filter="url(#wb-${uid})" opacity="${f(Math.min(.85, LP.lack))}">${marke}</g>`;
    }
    if (LP.frost) { const fr = klecks(rl, 0.68 * L, top + 0.15 * D, 0.3 * L, 0.32 * D, "#fff") + klecks(rl, 0.38 * L, top + 0.08 * D, 0.18 * L, 0.2 * D, "#fff"); g += `<g clip-path="url(#cr-${uid})">${stichel(fr, 10, .9, 27)}${stichel(fr, 6, .7, 23)}</g>`; }
    if (LP.flocken > 0) { let t = ""; for (let i = 0; i < LP.flocken; i++) { const x = (0.1 + Math.pow(rl(), 0.45) * 0.85) * L, y = top + (0.05 + rl() * 0.7) * D, r = 1.2 + rl() * 1.8;   // v499 (Dome): größere, unregelmäßige Flocken, vor allem über Hüfte/Kruppe
      t += klecks(rl, x, y, r, r * (0.7 + rl() * 0.4), "#f6f3ec"); } g += `<g clip-path="url(#cr-${uid})" filter="url(#wm-${uid})">${t}</g>`; }
  }
  // v454 (Dome): weicher Farbübergang vom Kopf zum Hals – überall dort, wo Kopf und Hals verschieden aussehen (Schecken, Roan, Tiger, Schimmel-Ausgrauen …):
  // die Kopffarbe läuft auf dem Hals hinter der Linie Genick–Kehle weich aus (Verlauf), statt an einer geraden Kante abzubrechen
  const kopfAnders = eigenKopf && C.pattern !== "fleck" && (C.pattern || (C.head && C.head !== C.body) || C.grau != null || opt.roanMix || opt.brindle || (LP && (LP.lack > 0 || LP.flocken > 0 || LP.frost)));   // v492: auch Roan unter Scheckung, Brindle, Lackschimmel/Snowflake/Frost; nicht beim Fliegenschimmel (Kopf hat dieselben Tupfen – der Übergang ließ sie an der Kehle verblassen)
  if (kopfAnders) {
    const bnd = norm(sub(T, Pn)), hin = (d => d.x < 0 ? mul(d, -1) : d)(P(-bnd.y, bnd.x)), dTief = (["roan", "dapple"].includes(C.pattern) || (C.grau != null && !["tobiano", "overo", "tovero", "sabino", "splash"].includes(C.pattern)) || opt.roanMix || opt.brindle || LP ? 1.0 : 0.5) * hl,   /* Punktmuster lang auslaufen, Scheckenweiß kurz (sonst grauer Schleier) */ mt = mid(Pn, T), ende = add(mt, mul(hin, dTief));   // v492: Richtung quer zur Linie Genick–Kehle zum Hals hin (vorher entlang der Kopfachse – wirkte kaum, Roan-Punkte/Tigerfarbe endeten hart am Kopf)
    const vor = mul(hin, -0.3 * hl), q = [add(add(Pn, mul(bnd, -0.4 * hl)), vor), add(add(T, mul(bnd, 0.4 * hl)), vor), add(add(T, mul(bnd, 0.4 * hl)), mul(hin, dTief)), add(add(Pn, mul(bnd, -0.4 * hl)), mul(hin, dTief))];
    g += `<linearGradient id="uh-${uid}" gradientUnits="userSpaceOnUse" x1="${f(mt.x)}" y1="${f(mt.y)}" x2="${f(ende.x)}" y2="${f(ende.y)}"><stop offset="0" stop-color="${head}" stop-opacity="1"/><stop offset=".3" stop-color="${head}" stop-opacity="1"/><stop offset=".55" stop-color="${head}" stop-opacity=".6"/><stop offset=".8" stop-color="${head}" stop-opacity=".2"/><stop offset="1" stop-color="${head}" stop-opacity="0"/></linearGradient>` +
      `<filter id="uf-${uid}" filterUnits="userSpaceOnUse" x="${f(Pn.x - 3 * hl)}" y="${f(Pn.y - 3 * hl)}" width="${f(6 * hl)}" height="${f(6 * hl)}"><feGaussianBlur stdDeviation="${f(0.15 * hl)}"/></filter><g clip-path="url(#cr-${uid})"><path d="${eckig(q)}" fill="url(#uh-${uid})" filter="url(#uf-${uid})"/></g>`;
  }
  if (C.stripe && !ganzWeiss && !WEISS_MUSTER.includes(C.pattern)) g += aalStrich();
  if (C.muzzle && !eigenKopf) g += `<ellipse cx="${f(hp(0.93, 0.12).x)}" cy="${f(hp(0.93, 0.12).y)}" rx="${f(0.13 * hl)}" ry="${f(0.1 * hl)}" transform="rotate(${f(90 - k.hAng)} ${f(hp(0.93, 0.12).x)} ${f(hp(0.93, 0.12).y)})" fill="${C.muzzle}" opacity=".8" filter="url(#wm-${uid})"/>`;
  // Abzeichen (weiß): Kopf und Beine
  const abz = opt.abzeichen || (C.pattern === "sabino" ? { kopf: rnd() < .6 ? "blesse" : "laterne", beine: rnd() < .55 ? "hochweiss" : "strumpf" }
    : C.pattern === "splash" ? { kopf: "laterne", beine: rnd() < .6 ? "hochweiss" : "strumpf" } : {});   // Sabino/Splash: Blesse/Laterne und hohes Weiß an den Beinen (Kopf: beim neuen Kopf über opt.kopfAbz)
  const WEISS = "#fbfaf6";
  if (abz.kopf && !eigenKopf) {
    const band = (s1, s2, b1, b2, rund) => {
      const pts = [];
      for (let i = 0; i <= 8; i++) { const s = s1 + (s2 - s1) * i / 8; pts.push(hp(s, b1 - 0.02)); }
      for (let i = 8; i >= 0; i--) { const s = s1 + (s2 - s1) * i / 8, w = rund ? Math.sin(Math.PI * i / 8) : 1; pts.push(hp(s, b1 + (b2 - b1) * (0.35 + 0.65 * w))); }
      return glatt(pts);
    };
    const fleck = (s, b, r) => { const c = hp(s, b); return `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(r * hl)}" ry="${f(r * 0.75 * hl)}" transform="rotate(${f(-k.hAng)} ${f(c.x)} ${f(c.y)})" fill="${WEISS}"/>`; };
    let m = "";
    const t = abz.kopf;
    if (t === "flocke") m += fleck(0.26, -0.045, 0.045);
    if (t === "stern" || t === "sternschnippe") m += `<path d="${band(0.14, 0.36, -0.08, 0.05, true)}" fill="${WEISS}"/>`;
    if (t === "schnippe" || t === "sternschnippe") m += `<path d="${band(0.84, 1.03, 0.0, 0.13, true)}" fill="${WEISS}"/>`;
    if (t === "blesse") m += `<path d="${band(0.16, 1.04, -0.09, 0.03, false)}" fill="${WEISS}"/>`;
    if (t === "laterne") m += `<path d="${band(0.12, 1.06, -0.1, 0.24, false)}" fill="${WEISS}"/>`;
    if (t === "durchgehend") m += `<path d="${band(0.14, 1.06, -0.09, 0.08, false)}" fill="${WEISS}"/>`;
    g += `<g clip-path="url(#ck-${uid})">${m}</g>`;
  }
  if (!liegt && opt.beinAbz) {
    const sf = C.stripe || C.points || body;
    g += zebraStreifen(fx, "vn", sf) + zebraStreifen(hx, "hn", sf) + beinWeiss(BA.vn, fx, "vn", WEISS) + beinWeiss(BA.hn, hx, "hn", WEISS);
    // Schulterstreifen (primitives Abzeichen der Falben): kurzer dunkler Streifen vom Widerrist über die Schulter
    if (opt.schulter && C.stripe) g += `<g clip-path="url(#cr-${uid})"><path d="M${f(Wn.x + 0.5)},${f(Wn.y + 2)}Q${f(Wn.x - 1.5)},${f(Wn.y + 0.2 * D)} ${f(Wn.x - 3.5)},${f(Wn.y + 0.38 * D)}" fill="none" stroke="${C.stripe}" stroke-width="2.2" stroke-linecap="round" opacity=".55"/></g>`;
  } else if (abz.beine && !liegt) {
    const hoehe = { krone: 0.05, fessel: 0.12, halbefessel: 0.085, halbstrumpf: 0.33, strumpf: 0.55, hochweiss: 0.75 }[abz.beine] || 0;
    const welle = [P(minX - 5, 2)];
    for (let x = minX - 5; x <= maxX + 5; x += 3) welle.push(P(x, -hoehe * Lg - hh - 1 + Math.sin(x * 0.7) * 0.8));
    welle.push(P(maxX + 5, 2));
    g += `<g clip-path="url(#cb-${uid})"><path d="${eckig(welle)}" fill="${WEISS}"/></g>`;
  }
  if (C.head && C.head !== body) g += `<g filter="url(#wm-${uid})"><path d="${glatt([hp(-0.1, -0.1), hp(-0.12, 0.3), add(T, mul(sub(Cn, T), 0.25)), add(Pn, mul(sub(Wn, Pn), 0.18)), hp(-0.1, -0.1)])}" fill="${C.head}" opacity=".85"/></g>`;
  if ((opt.glanzAepfel || C.gAepfel) && !C.pattern) { const hl2 = mix(body, "#ffffff", .3);   // v485 (Dome): Glanzäpfel bei gut genährten, gepflegten Pferden (keine Schimmel-Äpfel)
    g += `<defs><radialGradient id="gag-${uid}"><stop offset="0" stop-color="${hl2}" stop-opacity=".6"/><stop offset=".65" stop-color="${hl2}" stop-opacity=".25"/><stop offset="1" stop-color="${hl2}" stop-opacity="0"/></radialGradient>` +
      `<pattern id="ga-${uid}" patternUnits="userSpaceOnUse" width="9" height="8"><circle cx="4.5" cy="4" r="3.3" fill="url(#gag-${uid})"/><circle cx="0" cy="0" r="3" fill="url(#gag-${uid})"/><circle cx="9" cy="0" r="3" fill="url(#gag-${uid})"/><circle cx="0" cy="8" r="3" fill="url(#gag-${uid})"/><circle cx="9" cy="8" r="3" fill="url(#gag-${uid})"/></pattern></defs>` +
      `<linearGradient id="gam-${uid}" gradientUnits="userSpaceOnUse" x1="${f(0.02 * L)}" y1="0" x2="${f(0.3 * L)}" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="gamk-${uid}" maskUnits="userSpaceOnUse" ${bx}><rect ${bx} fill="url(#gam-${uid})"/></mask>` +
      `<g clip-path="url(#cr-${uid})"><rect ${bx} fill="url(#ga-${uid})" opacity=".6" mask="url(#gamk-${uid})"/></g>`; }   // v487 (Dome): Äpfel laufen zum Hals/Kopf hin weich aus
  if (MG > 0) g += `<rect ${bx} fill="url(#mt-${uid})"/>`;
  // Weiche Schattierung (Airbrush-Look): Schattenformen werden weichgezeichnet
  g += `<rect ${bx} fill="url(#sh-${uid})" opacity=".8"/><g filter="url(#wb-${uid})">`;
  g += `<g clip-path="url(#cr-${uid})"><path d="${glatt([P(-0.12 * H, top + 0.75 * D), P(0.15 * L, bottom - 0.2 * D), P(0.4 * L, bottom - 0.18 * D), P(0.65 * L, bottom - 0.3 * D), P(0.8 * L, bottom - 0.2 * D), P(L + 0.1 * H, top + 0.7 * D), P(L + 0.1 * H, 5), P(-0.12 * H, 5)])}" fill="${schatten}" opacity=".55"/></g>`;
  const kehleD = glatt([T, add(mid(T, Cn), mul(nOut, -2)), Cn, add(Cn, P(8, 6)), add(mid(T, Cn), mul(nOut, 5)), add(T, mul(nOut, 4))]);
  g += `<path d="${kehleD}" fill="${schatten}" opacity="${eigenKopf ? ".18" : ".45"}"/>`;   // v470 (Dome): bei Domes Köpfen schwächer – sonst dunkle Bahn direkt hinter dem Kopf
  if (!eigenKopf) g += `<path d="${glatt([hp(0.1, 0.42 * hw), hp(0.3, 0.47 * hw * jw), hp(0.55, 0.36 * hw), hp(0.8, 0.28 * hw), hp(0.6, 0.3 * hw), hp(0.35, 0.37 * hw * jw)])}" fill="${schatten}" opacity=".45"/>`;
  g += `<path d="${glatt([P(0.24 * L, -H + 3.5), P(0.42 * L, top + 5), P(0.62 * L, top + 4), P(0.8 * L, croupY + 3), P(0.8 * L, croupY + 6.5), P(0.62 * L, top + 7.5), P(0.42 * L, top + 8.5)], true)}" fill="${licht}" opacity=".7"/>`;
  // v492 (Dome): Lichtflecke Schulter/Hüfte als Verlauf ohne Rand – als Fläche sah man auf dunklem Fell ein Oval mit Kante
  g += `<radialGradient id="lt-${uid}"><stop offset="0" stop-color="${licht}" stop-opacity=".4"/><stop offset=".5" stop-color="${licht}" stop-opacity=".22"/><stop offset="1" stop-color="${licht}" stop-opacity="0"/></radialGradient>`;
  g += `<ellipse cx="${f(0.1 * L)}" cy="${f(top + 0.3 * D)}" rx="${f(0.11 * L)}" ry="${f(0.27 * D)}" fill="url(#lt-${uid})"/>`;
  g += `<ellipse cx="${f(0.84 * L)}" cy="${f(top + 0.28 * D)}" rx="${f(0.135 * L)}" ry="${f(0.29 * D)}" fill="url(#lt-${uid})"/>`;
  if (C.russ) g += `<path d="${halsD}" fill="${C.russ}" opacity=".45"/><ellipse cx="${f(0.12 * L)}" cy="${f(top + 0.35 * D)}" rx="${f(0.12 * L)}" ry="${f(0.3 * D)}" fill="${C.russ}" opacity=".35"/><ellipse cx="${f(0.86 * L)}" cy="${f(top + 0.3 * D)}" rx="${f(0.14 * L)}" ry="${f(0.3 * D)}" fill="${C.russ}" opacity=".3"/><ellipse cx="${f(0.5 * L)}" cy="${f(top + 0.08 * D)}" rx="${f(0.32 * L)}" ry="${f(0.16 * D)}" fill="${C.russ}" opacity=".35"/>`;   // v484/v485 (Dome): Rußanflug (Sty) über Hals, Schulter, Rücken und Kruppe – Bauch und Flanke bleiben heller
  if (/schwarzbrauner/.test(farbId)) g += `<ellipse cx="${f(0.76 * L)}" cy="${f(top + 0.6 * D)}" rx="${f(0.09 * L)}" ry="${f(0.2 * D)}" fill="#a8643a" opacity=".4"/><ellipse cx="${f(0.17 * L)}" cy="${f(bottom - 0.18 * D)}" rx="${f(0.07 * L)}" ry="${f(0.13 * D)}" fill="#a8643a" opacity=".35"/>`;   // v481 (Dome): Schwarzbraune – kupferfarbene Flanke und Ellbogen
  g += `</g>`;
  // v464 (Dome): Bauchschatten läuft weich in die nahen Beine aus (vorher harte Kante an der Rumpflinie) – nur unterhalb des Rumpfs, oben so dunkel wie der Schatten dort
  if (!liegt) g += `<defs><linearGradient id="bs-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(bottom - 0.05 * D)}" x2="0" y2="${f(bottom * 0.55)}"><stop offset="0" stop-color="${schatten}" stop-opacity=".55"/><stop offset="1" stop-color="${schatten}" stop-opacity="0"/></linearGradient>` +
    `<mask id="bm-${uid}" maskUnits="userSpaceOnUse" ${bx}><g filter="url(#bf-${uid})"><path d="${glatt(vorderN)}" fill="#fff"/><path d="${glatt(hinterN)}" fill="#fff"/><path d="${glatt(rumpf)}" fill="#000"/></g></mask><filter id="bf-${uid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f(0.06 * D)}"/></filter></defs>` +
    `<g mask="url(#bm-${uid})"><rect ${bx} fill="url(#bs-${uid})"/></g>`;
  g += `</g>`;
  // v688 (Dome 23.10.): gewaschenes Pferd (Shampoo, Öl) glänzt – weiche Lichtflächen auf Rücken, Schulter, Kruppe und Bauchlinie, nur wenn kaum Schmutz drauf ist
  if (opt.fellGlanz && !(opt.dreck > 20)) {
    const gs = dunkelWert < 90 ? 0.5 : dunkelWert < 170 ? 0.42 : 0.3;
    g += `<g clip-path="url(#cl-${uid})"><defs><filter id="fg-${uid}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter></defs><g filter="url(#fg-${uid})" fill="#fff" opacity="${gs}">` +
      `<ellipse cx="${f(0.78 * L)}" cy="${f(top + 0.16 * D)}" rx="${f(0.12 * L)}" ry="${f(0.07 * D)}" transform="rotate(-8 ${f(0.78 * L)} ${f(top + 0.16 * D)})"/>` +
      `<ellipse cx="${f(0.5 * L)}" cy="${f(top + 0.1 * D)}" rx="${f(0.2 * L)}" ry="${f(0.045 * D)}"/>` +
      `<ellipse cx="${f(0.2 * L)}" cy="${f(top + 0.32 * D)}" rx="${f(0.05 * L)}" ry="${f(0.13 * D)}" transform="rotate(10 ${f(0.2 * L)} ${f(top + 0.32 * D)})"/>` +
      `<ellipse cx="${f(0.62 * L)}" cy="${f(top + 0.55 * D)}" rx="${f(0.1 * L)}" ry="${f(0.05 * D)}"/></g></g>`;
  }
  // Schmutz im Fell (opt.dreck 0–100): weiche Schlammflecken am ganzen Körper, dreckige Beine – immer an denselben Stellen.
  // Auf dunklem Fell sieht man eher hellen, getrockneten Staub, auf hellem Fell braunen Schlamm.
  if (opt.dreck > 0) {
    const dr = Math.min(100, opt.dreck) / 100, rd = zufall((opt.seed || rasseId) + "-dreck"), dz = [];
    const dunkelFell = dunkelWert < 110, sehrDunkel = dunkelWert < 70;   // v688 (Dome): auf Rappen und Dunkelbraunen war der Staub kaum zu sehen – heller, kräftiger und mehr Flecken
    const farbe = () => sehrDunkel ? (rd() < 0.5 ? "#c9ad82" : "#bb9e72") : dunkelFell ? (rd() < 0.5 ? "#a88a64" : "#9b7d58") : (rd() < 0.5 ? "#6a4b2c" : "#7d5c39");
    const op = sehrDunkel ? 0.55 + dr * 0.35 : (dunkelFell ? 0.3 : 0.28) + dr * 0.35, n = Math.round((3 + dr * 13) * (sehrDunkel ? 1.35 : 1));
    for (let i = 0; i < n; i++) {
      if (i / n > dr + 0.1) break;
      const cx = (-0.12 + rd() * 1.15) * L, cy = top + (0.15 + rd() * 0.95) * D, r = (2.2 + rd() * 4) * (sehrDunkel ? 1.3 : 1);
      // jeder Fleck aus 2–4 überlappenden Klecksen, damit er unregelmäßig aussieht
      for (let k2 = 0, m = 2 + Math.floor(rd() * 3); k2 < m; k2++) {
        const x = cx + (rd() - 0.5) * r * 1.6, y = cy + (rd() - 0.5) * r, rr = r * (0.45 + rd() * 0.55);
        dz.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr * (1 + rd() * 0.7))}" ry="${f(rr * (0.55 + rd() * 0.35))}" transform="rotate(${f(rd() * 60 - 30)} ${f(x)} ${f(y)})" fill="${farbe()}"/>`);
      }
    }
    for (let i = 0; i < Math.round(dr * 22); i++) dz.push(`<circle cx="${f((-0.15 + rd() * 1.2) * L)}" cy="${f(top + rd() * (D + Lg))}" r="${f(0.5 + rd() * 0.9)}" fill="${farbe()}"/>`);
    g += `<g clip-path="url(#cl-${uid})"><defs><linearGradient id="dm-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(-Lg * 0.65)}" x2="0" y2="0"><stop offset="0" stop-color="${sehrDunkel ? "#c9ad82" : dunkelFell ? "#a88a64" : "#6a4b2c"}" stop-opacity="0"/><stop offset="1" stop-color="${sehrDunkel ? "#bb9e72" : dunkelFell ? "#9b7d58" : "#5a3d22"}" stop-opacity="${(0.2 + dr * 0.55).toFixed(2)}"/></linearGradient>` +
      `<filter id="db-${uid}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".7"/></filter></defs>` +
      `<rect x="${f(minX - 5)}" y="${f(-Lg * 0.65)}" width="${f(maxX - minX + 10)}" height="${f(Lg * 0.65 + 2)}" fill="url(#dm-${uid})"/><g filter="url(#db-${uid})" opacity="${op.toFixed(2)}">${dz.join("")}</g></g>`;
  }
  // Comic-Detaillinien (Schulter, Ellbogen, Hüfte, Knie, Sprunggelenk, Ganasche)
  g += inkFein(`M${f(0.2 * L)},${f(-H + 7)}Q${f(0.16 * L)},${f(top + 0.62 * D)} ${f(0.02 * L)},${f(top + 0.82 * D)}`, 1.3, 'opacity=".7"');
  g += inkFein(`M${f(fx + 1.4 * w)},${f(bottom - 7)}Q${f(fx + 1.8 * w)},${f(bottom - 1)} ${f(fx + 1.3 * w)},${f(bottom + 3)}`, 1.2, 'opacity=".6"');
  g += inkFein(`M${f(0.7 * L)},${f(top + 0.22 * D)}Q${f(0.9 * L)},${f(top + 0.35 * D)} ${f(hx - 0.08 * L)},${f(bottom + 1)}`, 1.3, 'opacity=".7"');
  g += inkFein(`M${f(0.62 * L)},${f(bottom - 0.3 * D)}Q${f(0.66 * L)},${f(bottom - 0.12 * D)} ${f(0.63 * L)},${f(bottom - 2)}`, 1.1, 'opacity=".45"');
  if (!liegt) g += inkFein(`M${f(sx(fx, fx - 0.5 * w, -0.47 * Lg))},${f(-0.47 * Lg)}l${f(0.6 * w)},0`, 1.1, 'opacity=".55"');
  if (!liegt) g += inkFein(`M${f(sx(hx, hx + 0.3 * w, -0.54 * Lg))},${f(-0.54 * Lg)}l${f(0.6 * w)},${f(-1)}`, 1.1, 'opacity=".55"');
  if (!eigenKopf) g += inkFein(`M${f(hp(0.34, 0.2).x)},${f(hp(0.34, 0.2).y)}Q${f(hp(0.52, 0.4).x)},${f(hp(0.52, 0.4).y)} ${f(hp(0.3, 0.47 * hw * jw).x)},${f(hp(0.3, 0.47 * hw * jw).y)}`, 1.4, 'opacity=".75"');
  // Körpertyp-Details
  if (!liegt && typ === "duenn") {
    g += `<g clip-path="url(#cr-${uid})">`;   // Rippen nur innerhalb des Körpers
    for (let i = 0; i < 6; i++) {
      const x = 0.36 * L + i * 0.052 * L, y0 = top + 0.3 * D, y1 = bottom - 0.16 * D + Math.abs(i - 2.5) * 1.2;
      g += inkFein(`M${f(x)},${f(y0)}Q${f(x + 0.04 * L)},${f((y0 + y1) / 2)} ${f(x + 0.012 * L)},${f(y1)}`, 1.15, 'opacity=".55"');
      g += `<path d="M${f(x + 1.2)},${f(y0 + 2)}Q${f(x + 0.04 * L + 1.2)},${f((y0 + y1) / 2)} ${f(x + 0.012 * L + 1.2)},${f(y1 - 2)}" fill="none" stroke="${licht}" stroke-width="1.4" stroke-linecap="round" opacity=".55" vector-effect="non-scaling-stroke"/>`;
    }
    g += inkFein(`M${f(0.76 * L)},${f(croupY + 6)}q${f(0.03 * L)},-5 ${f(0.07 * L)},-1`, 1.3, 'opacity=".65"');
    g += inkFein(`M${f(0.28 * L)},${f(top + 3)}Q${f(0.5 * L)},${f(top + 5.5)} ${f(0.74 * L)},${f(top + 3)}`, 1, 'opacity=".45"');
    g += inkFein(`M${f(0.08 * L)},${f(top + 0.12 * D)}q${f(-2)},${f(0.25 * D)} ${f(0.02 * L)},${f(0.45 * D)}`, 1, 'opacity=".5"');
    g += `</g>`;
  }
  if (!liegt && typ === "sportlich") {
    // Muskelbäuche wie in Cartoon-Muskelzeichnungen: oben hell, unten Schatten, dazwischen feine Furchen (dezent)
    const hell = mix(body, "#ffffff", dunkelWert < 60 ? 0.28 : 0.24), tief = mix(body, "#1b1020", 0.35);
    const Hu = mid(T, Cn), Hm = mid(Pn, Wn);
    let mu = "";
    const muskel = (cx, cy, rx, ry, rot, st = 1) => {
      const r = rot * Math.PI / 180, ox = Math.sin(r), oy = -Math.cos(r);
      mu += `<ellipse cx="${f(cx - ox * ry * 0.18)}" cy="${f(cy - oy * ry * 0.18)}" rx="${f(rx * 0.98)}" ry="${f(ry)}" transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})" fill="${tief}" opacity="${(0.3 * st).toFixed(2)}"/>`;
      mu += `<ellipse cx="${f(cx + ox * ry * 0.22)}" cy="${f(cy + oy * ry * 0.22)}" rx="${f(rx * 0.82)}" ry="${f(ry * 0.72)}" transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})" fill="${hell}" opacity="${(0.55 * st).toFixed(2)}"/>`;
    };
    const ang = (a, b) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    // Hals: Halsmuskel unten, Kammmuskel oben
    muskel(mid(Hu, Cn).x + 4, mid(Hu, Cn).y - 2, 0.05 * L, dist(Hu, Cn) * 0.5, ang(Hu, Cn) - 90, .9);
    muskel(mid(Hm, Wn).x + 3, mid(Hm, Wn).y + 7, 0.045 * L, dist(Hm, Wn) * 0.45, ang(Hm, Wn) - 90, .8);
    // Schulter, Oberarm (Trizeps), Brust, Unterarm
    muskel(0.12 * L, top + 0.36 * D, 0.075 * L, 0.3 * D, 25);
    muskel(0.17 * L, top + 0.74 * D, 0.07 * L, 0.16 * D, -10);
    muskel(-0.035 * H, top + 0.66 * D, 0.035 * L, 0.18 * D, 5, .8);
    muskel(fx + 0.15 * w, -0.66 * Lg, 0.75 * w, 0.17 * Lg, 0, .8);
    // Rücken (Sattellage) und Rippenbogen
    muskel(0.5 * L, top + 0.17 * D, 0.17 * L, 0.11 * D, 90, .6);
    // Hinterhand: Kruppe, Hinterbacke, Oberschenkel, Unterschenkel (Gaskin)
    muskel(0.8 * L, top + 0.2 * D, 0.13 * L, 0.13 * D, 90 + 8, .9);
    muskel(0.93 * L, top + 0.58 * D, 0.065 * L, 0.3 * D, -8);
    muskel(0.79 * L, top + 0.66 * D, 0.065 * L, 0.26 * D, 12);
    muskel(hx + 0.4 * w, -0.66 * Lg, 0.85 * w, 0.14 * Lg, -18, .8);
    g += `<g clip-path="url(#cl-${uid})"><g filter="url(#wm-${uid})">${mu}</g>`;
    // feine Furchen zwischen den Muskelgruppen
    const fu = (d, o = ".4") => inkFein(d, 1, `opacity="${o}"`);
    g += fu(`M${f(0.2 * L)},${f(-H + 6)}Q${f(0.18 * L)},${f(top + 0.42 * D)} ${f(0.06 * L)},${f(top + 0.6 * D)}`);
    g += fu(`M${f(0.07 * L)},${f(top + 0.6 * D)}Q${f(0.17 * L)},${f(top + 0.54 * D)} ${f(0.25 * L)},${f(top + 0.62 * D)}`, ".35");
    g += fu(`M${f(0.72 * L)},${f(top + 0.34 * D)}Q${f(0.82 * L)},${f(top + 0.4 * D)} ${f(0.88 * L)},${f(top + 0.3 * D)}`, ".35");
    g += fu(`M${f(0.87 * L)},${f(top + 0.32 * D)}Q${f(0.84 * L)},${f(top + 0.7 * D)} ${f(0.87 * L)},${f(bottom + 0.03 * H)}`);
    g += fu(`M${f(Hu.x + 3)},${f(Hu.y)}Q${f(mid(Hu, Cn).x + 8)},${f(mid(Hu, Cn).y - 6)} ${f(0.05 * L)},${f(top + 0.28 * D)}`, ".35");
    g += `</g>`;
  }
  if (!liegt && typ === "dick") {
    const fett = (d, o = ".45") => inkFein(d, 1.1, `opacity="${o}"`);
    g += fett(`M${f(0.16 * L)},${f(top + 0.25 * D)}q${f(0.03 * L)},${f(0.2 * D)} ${f(0)},${f(0.45 * D)}`);                      // Polster hinter der Schulter
    g += fett(`M${f(0.4 * L)},${f(bottom + 0.06 * D)}Q${f(0.55 * L)},${f(bottom + 0.16 * D)} ${f(0.7 * L)},${f(bottom - 0.02 * D)}`, ".35"); // Bauchrundung
    g += fett(`M${f(0.62 * L)},${f(top + 6)}q${f(0.08 * L)},${f(-3)} ${f(0.16 * L)},${f(1)}`, ".4");                             // Fettpolster Kruppe
    g += fett(`M${f(mid(Pn, Wn).x - 3)},${f(mid(Pn, Wn).y + 3)}q${f(6)},${f(-3)} ${f(12)},${f(2)}`, ".4");                   // Speckkamm
    g += `<ellipse cx="${f(0.5 * L)}" cy="${f(bottom - 0.1 * D)}" rx="${f(0.2 * L)}" ry="${f(0.12 * D)}" fill="${licht}" opacity=".25"/>`;
  }
  // kurze Fellstriche wie bei einer Tuschezeichnung
  const strich = (p, dx, dy) => inkFein(`M${f(p.x)},${f(p.y)}l${f(dx)},${f(dy)}`, 1, 'opacity=".45"');
  g += strich(P(-0.05 * H, top + 0.62 * D), 1.5, 2.5) + strich(P(-0.03 * H, top + 0.72 * D), 1.5, 2.2) + strich(P(-0.045 * H, top + 0.52 * D), 1.8, 2);
  g += strich(P(0.36 * L, bottom - 1), 1.2, -2.2) + strich(P(0.42 * L, bottom - 1), 1, -2) + strich(P(0.72 * L, bottom - 0.12 * D), -0.5, -2.4);
  g += `<g clip-path="url(#cr-${uid})">` + strich(add(mid(T, Cn), mul(nOut, -2)), 2, 1.5) + strich(add(mid(T, Cn), add(mul(nOut, -2), P(1, 4))), 2, 1.2) + `</g>`;
  // Hufe vorn
  g += `<g stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke">` +
    (liegt ? [[hufLiegend], [hufLiegendH]] : [[huf(fx), BA.vn], [huf(hx), BA.hn]]).map(([h, st]) => `<path d="${eckig(h)}" fill="${hufFill(st)}" vector-effect="non-scaling-stroke"/>`).join("") + "</g>" +
    (liegt ? [] : [fx, hx]).map(xc => `<path d="M${f(sx(xc, xc - 0.55 * w, -hh + 1.2))},${f(-hh + 1.2)}L${f(sx(xc, xc - 0.75 * w, -1.2))},${f(-1.2)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`).join("");
  // Behang über Hufe (vorn)
  if (behN.length) {
    const bc = C.pattern === "tobiano" ? "#f7f5f1" : featherCol;
    g += behN.map(b => `<path d="${glatt(b)}" fill="${bc}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join("");
  }
  g += `</g>`;

  // Schweif (mit Strähnen)
  const tailStr = (o, sc) => `M${f(X + 1 + 3 * s + o)},${f(Y + 8 - 10 * s)}C${f(X + 4 + 8 * s + tv * 2 + o)},${f(Y + 0.35 * tl)} ${f(X + 3 + 6 * s + tv * 3 + o)},${f(Y + 0.7 * tl)} ${f(X + 2 + 5 * s + tv * 2 + o * 0.6)},${f(Y + tl * sc)}`;
  g += `<g class="schweif"><animateTransform attributeName="transform" type="rotate" values="0 ${f(X)} ${f(Y)};5 ${f(X)} ${f(Y)};-2 ${f(X)} ${f(Y)};0 ${f(X)} ${f(Y)}" dur="3.4s" repeatCount="indefinite"/>` +
    `<path d="${schweifD}" fill="${tailCol}" stroke="${INK}" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>` +
    (dunKern ? `<clipPath id="sw-${uid}"><path d="${schweifD}"/></clipPath><g clip-path="url(#sw-${uid})"><path d="${tailStr(-0.6 + 0.4 * tv, 1.05)}" fill="none" stroke="${dunKern}" stroke-width="${f(2.4 + 2.6 * tv)}" stroke-linecap="round"/></g>` +
      `<path d="${schweifD}" fill="none" stroke="${INK}" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>` : "") +
    (schweifWeiss > 0 || opt.rabi != null ? (() => {   // v440: weiße Strähnen im Schweif (Schecken mit viel Weiß) bzw. heller Schweifansatz (Rabicano, „Stinktierschwanz“)
      const n = 9; let h = "";
      for (let i = 0; i < n; i++) { const o = -3.5 + i * (8 + tv * 2) / (n - 1);
        if (rw() < schweifWeiss) h += `<path d="${tailStr(o, 1.05)}" fill="none" stroke="#f4f2ec" stroke-width="${f(1.6 + rw() * 1.6)}" stroke-linecap="round"/>`;
        else if (opt.rabi != null && i % 2) h += `<path d="${tailStr(o, 0.18 + 0.06 * (opt.rabi || 0))}" fill="none" stroke="#f4f2ec" stroke-width="1" stroke-linecap="round" opacity=".85"/>`; }
      return `<clipPath id="sws-${uid}"><path d="${schweifD}"/></clipPath><g clip-path="url(#sws-${uid})">${h}</g>`; })() : "") +
    inkFein(tailStr(0, 0.88), 1.1, 'opacity=".55"') + inkFein(tailStr(2.5 + tv, 0.7), 1, 'opacity=".45"') +
    `<path d="${tailStr(-1.5, 0.6)}" fill="none" stroke="${mix(tailCol, "#ffffff", .45)}" stroke-width="1.6" stroke-linecap="round" opacity=".7" vector-effect="non-scaling-stroke"/>` +
    (opt.filz > 0 ? (() => { const rf = zufall((opt.seed || rasseId) + "-filz"), m = Math.round(1 + Math.min(100, opt.filz) / 100 * 7); let h = "";
      for (let i = 0; i < m; i++) { const t = 0.2 + rf() * 0.65, x = X + 2 + 6 * s + tv * 2.5 + (rf() - 0.5) * 6, y = Y + tl * t, a = rf() * 180;
        h += `<path d="M${f(x - 2.2)},${f(y)}l4.4,0" transform="rotate(${f(a)} ${f(x)} ${f(y)})" stroke="#d9b45a" stroke-width="1.1" stroke-linecap="round"/>`; }
      return h; })() : "") + `</g>`;

  if (eigenKopf) {
    // Handgezeichneter Kopf: Stirn- und Nasenpunkt der Zeichnung auf den Spielkopf abbilden
    const K = KOPF_NEU, G = K.gap, A = add(Pn, mul(nOut, 1.2)), B = add(A, mul(sub(hp(0.97, 0.0), A), KOPF_GROESSE));
    const ux = K.nase.x - G.x, uy = K.nase.y - G.y, vx = B.x - A.x, vy = B.y - A.y;
    const den = ux * ux + uy * uy, a_ = (vx * ux + vy * uy) / den, b_ = (vy * ux - vx * uy) / den;
    const e_ = A.x - (a_ * G.x - b_ * G.y), f_ = A.y - (b_ * G.x + a_ * G.y);
    // nur den Kopf zeigen: alles hinter der Linie Genick–Kehle abschneiden
    const nT = norm(sub(T, Pn)), weit = 4 * hl;
    const zur = mul(u, -0.06 * hl), L1 = add(add(Pn, zur), mul(nT, -weit)), L2 = add(add(T, zur), mul(nT, weit));
    const clip = [L1, L2, add(L2, mul(u, weit)), add(L1, mul(u, weit))];
    const muschel = hexRgb(head).reduce((x, y) => x + y) / 3 < 70 ? mix(head, "#b59a9a", .5) : mix(head, "#2b2240", .35);
    g += `<clipPath id="ek-${uid}"><path d="${eckig(clip)}"/></clipPath>`;
    if (opt.schopfExport) {
      // Schopf in Koordinaten der Krita-Zeichnung umrechnen (Umkehrung der Abbildung)
      const det = a_ * a_ + b_ * b_, ia = a_ / det, ib = -b_ / det;
      const ie = -(ia * e_ - ib * f_), iff = -(ib * e_ + ia * f_);
      return { matrix: [ia, ib, -ib, ia, ie, iff], schopf: schopf ? glatt(schopf) : schopfBueschel(), fl };
    }
    ekMatrix = [a_, b_, -b_, a_, e_, f_].map(x => x.toFixed(5)).join(" ");
    // Licht & Schatten wie beim Spielkopf (in Pferdekoordinaten, dann zurück in Zeichnungskoordinaten)
    const det = a_ * a_ + b_ * b_, ia = a_ / det, ib = -b_ / det, ie = -(ia * e_ - ib * f_), iff = -(ib * e_ + ia * f_);
    const mz = hp(0.93, 0.12);
    const schattLage = (ob, bxS) => `<g transform="matrix(${[ia, ib, -ib, ia, ie, iff].map(x => x.toFixed(5)).join(" ")})">` +
      `<rect x="${f(minX - 60)}" y="${f(minY - 5 - ob)}" width="${f(maxX - minX + 120)}" height="${f(-minY + 10 + ob)}" fill="url(#sh-${uid})" opacity="${C.russ ? .44 : .8}"/>` + (C.pattern === "fleck" ? `<rect ${bxS} fill="url(#fk-${uid})" opacity=".8"/>` : "") +   /* v489 (Dome): Kopf mit demselben Rußanflug wie der Hals – keine eigene Kopffarbe mehr */   // v468: Fliegenschimmel-Tupfen auch im Gesicht; v461: größer als bx – Domes Köpfe ragen vorn über den Rahmen (sonst Streifen an der Nasenkante)
      (C.muzzle && !opt.maul && !(C.grau > .3) ? `<ellipse cx="${f(mz.x)}" cy="${f(mz.y)}" rx="${f(0.13 * hl)}" ry="${f(0.1 * hl)}" transform="rotate(${f(90 - k.hAng)} ${f(mz.x)} ${f(mz.y)})" fill="${C.muzzle}" opacity=".8" filter="url(#wm-${uid})"/>` : "") +   // Schimmel: Domes Ebene „graumaul“ (im Spiel „dunkel“) in kopfNeuSVG (v449)
      (MG > 0 ? `<rect ${bxS} fill="url(#mt-${uid})"${C.russ ? ' opacity=".55"' : ""}/>` : "") + `<g filter="url(#wb-${uid})"><path d="${kehleD}" fill="${schatten}" opacity=".18"/></g></g>`;
    const schatt = schattLage(0, bx), obO = H;   // v490: Ohren bekommen dieselben Schichten (Maske aus der Ohrform) – Rechteck nach oben bis in die Ohrspitzen verlängert, die Verläufe sind userSpaceOnUse und bleiben gleich
    const schattOhr = schattLage(obO, `x="${f(minX - 5)}" y="${f(minY - 5 - obO)}" width="${f(maxX - minX + 10)}" height="${f(-minY + 10 + obO)}"`);   // v472 (Dome): Kopf bekommt dieselben Schichten wie der Hals (Glanz, Kehlschatten) – kein eigener Kieferschatten/Lichtfleck mehr, sonst Kanten am Übergang
    // Ohrstellung (opt.ohrStellung = { R, L, spiel }); ohne Angabe: beide Ohren vorne, bei Unwohlsein (opt.ohren „geknickt“) seitlich
    const OS = opt.ohrStellung || (opt.ohren === "geknickt" ? { R: "seite", L: "seite" } : { R: "vorne", L: "vorne" });
    const schopfFarbe = dunKern ? dunHell : (mstil === "fjord" || k.mane === "fjord" ? maneOuter : mane);
    // v492 (Dome): Domes Ebene „schopf-maehne-uebergang“ (Mähnenfarbe) reicht als Keil mit gerader Kante auf den Hals – dort ausblenden (unter der Mähne ist sie ohnehin verdeckt), bis Dome sie in Inkscape anpasst (BEI-INKSCAPE-BEARBEITEN.md 1d)
    const uebMaske = `<g transform="matrix(${[ia, ib, -ib, ia, ie, iff].map(x => x.toFixed(5)).join(" ")})"><filter id="umf-${uid}" filterUnits="userSpaceOnUse" x="${f(minX - 60)}" y="${f(minY - 2 * H)}" width="${f(maxX - minX + 120)}" height="${f(-minY + 3 * H)}"><feGaussianBlur stdDeviation="${f(0.03 * hl)}"/></filter>` +
      `<rect x="${f(minX - 60)}" y="${f(minY - 2 * H)}" width="${f(maxX - minX + 120)}" height="${f(-minY + 3 * H)}" fill="#fff"/><path d="${halsD}" fill="#000" filter="url(#umf-${uid})"/></g>`;
    ohrL = {};   // v492 (Dome): nahes Ohr erst nach der Mähne zeichnen – sonst verdeckt die Mähne das Ohr, wenn es nach hinten zeigt oder angelegt ist
    g += `<g transform="matrix(${ekMatrix})">${kopfNeuSVG(eigenKopf, "ek" + uid, { fell: C.russ ? mix(head, C.russ, .45) : head, muschel,   /* v492 (Dome): Rußanflug direkt in der Kopffarbe – als eigene Schicht gab er am Rand der Kopffläche einen hellen Haarstrich */ maehne: schopfFarbe, ink: INK, statisch: opt.statisch, augenZu: opt.augenZu, schattierung: schatt, schattOhr, ohrLAussen: ohrL, uebMaske, alter: kopfAlter,
      marwari: !!k.curl, wimper: opt.wimper != null ? opt.wimper : (opt.geschlecht === "Stute" || stufe === "fohlen"), ohrR: OS.R, ohrL: OS.L, ohrSpiel: OS.spiel !== false, seed: opt.seed || rasseId,
      ohneUeb: !schopfL || rasseId === "tekke", abz: opt.kopfAbz, maul: opt.maul || (C.grau > .3 ? "dunkel" : undefined), ohrGr: opt.ohrGr || OHR_RASSE[rasseId] || 1, augenRing: C.grau > .3 && !opt.maul ? { farbe: C.muzzle, st: C.grau } : /schwarzbrauner/.test(farbId) ? { farbe: "#a8643a", st: .5 } : null, /* v481 (Dome): Schwarzbraune – kupferfarben ums Auge (Platzhalter) */ lpHaut: !!(LP && LP.haut) || !!opt.kroete, kroeteHell: !LP && !!opt.kroete, sklera: !!(LP && LP.sklera), augeBlau: opt.augeBlau != null ? opt.augeBlau : /isabell/.test(farbId) })}</g>`;
  }
  // Mähne
  if (maehneD) g += `<path class="maehnePfad" d="${maehneD}" fill="${maneOuter}" stroke="${INK}" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
  if (maehneD && maehneWeiss.length) {   // v440: weiße Mähnenabschnitte mit einzelnen Strähnen am Übergang
    const runter = norm(P(0.12, 1)), lang = maneLenE * H + 12; let m = "";
    for (const [t1, t2] of maehneWeiss) { const ob = [], un = [];
      for (let i = 0; i <= 10; i++) { const t = t1 + (t2 - t1) * i / 10, pk = kamm(t); ob.push(add(pk, mul(nOut, 6))); un.push(add(pk, mul(runter, lang))); }
      m += `<path d="${eckig([...ob, ...un.reverse()])}" fill="#f4f2ec"/>`;
      for (const te of [t1, t2]) if (te > 0.01 && te < 0.99) for (let j = 0; j < 3; j++) { const pk = kamm(te + (rw() - .5) * 0.1), e = add(pk, mul(runter, lang * (0.5 + rw() * 0.5)));
        m += `<path d="M${f(pk.x)},${f(pk.y)}L${f(e.x)},${f(e.y)}" stroke="#f4f2ec" stroke-width="1.3" stroke-linecap="round"/>`; } }
    g += `<clipPath id="mw-${uid}"><path d="${maehneD}"/></clipPath><g clip-path="url(#mw-${uid})">${m}</g><path d="${maehneD}" fill="none" stroke="${INK}" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
  }
  if (mstil === "lang") {
    const runter = norm(P(0.12, 1));
    for (const t of [0.2, 0.38, 0.56, 0.74]) {
      const p = add(kamm(t), mul(nOut, 1)), len = maneLenE * H * (0.2 + 0.8 * Math.sin(Math.PI * Math.min(1, 0.08 + t * 0.95))) * 0.75;
      const e = add(p, mul(runter, len)), c = add(mid(p, e), P(-2, 0));
      g += inkFein(`M${f(p.x)},${f(p.y)}Q${f(c.x)},${f(c.y)} ${f(e.x)},${f(e.y)}`, 1, 'opacity=".5"');
    }
    const h1 = add(kamm(0.3), mul(nOut, 0.5)), h2 = add(kamm(0.75), mul(nOut, 0.5));
    g += `<path d="M${f(h1.x)},${f(h1.y)}Q${f(kamm(0.52).x)},${f(kamm(0.52).y + 2)} ${f(h2.x)},${f(h2.y)}" fill="none" stroke="${mix(maneOuter, "#ffffff", .45)}" stroke-width="2" stroke-linecap="round" opacity=".7" vector-effect="non-scaling-stroke"/>`;
  }
  if (streifenD) g += `<path d="${streifenD}" fill="${maneStripe}"/>`;

  // Kopfdetails
  g += `<g>`;
  if (eigenKopf) {
    // (handgezeichneter Kopf wurde schon vor der Mähne gezeichnet) – hier kommt Domes Schopf obendrauf
    if (ohrL && ohrL.svg && ekMatrix) g += `<g transform="matrix(${ekMatrix})">${ohrL.svg}</g>`;
    const sv = schopfL;
    if (sv && ekMatrix) g += `<g class="schopfTeil" transform="matrix(${ekMatrix})">${schopfNeuSVG(sv, dunKern ? dunHell : (mstil === "fjord" || k.mane === "fjord" ? maneOuter : mane), dunKern || C.stripe || null, INK, kopfAlter)}</g>`;   // Etappe 3 (v433): Aalstrich im Schopf bei allen Falben
  } else {
  if (fl >= 0.25) g += `<path class="schopfTeil" d="${schopf ? glatt(schopf) : schopfBueschel()}" fill="${mstil === "fjord" || k.mane === "fjord" ? maneOuter : mane}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
  if (fl >= 0.25 && !schopf) g += schopfStraehnen();
  g += ohr(Eb, head);
  // Comic-Auge: Weiß, Iris, Pupille, Glanzlicht, Oberlid, Braue – blinzelt
  const ex = er * 1.55, ey = er * 1.42;
  const iris = C.augen || "#2e1a0e";
  const lid = `M${f(-ex)},${f(ey * 0.15)}Q${f(-ex * 0.1)},${f(-ey * 1.45)} ${f(ex)},${f(-ey * 0.05)}`;
  g += `<g transform="translate(${f(auge.x)},${f(auge.y)}) rotate(-14)"><g${opt.augenZu ? ' opacity="0"' : ""}>` +
    (opt.statisch || opt.augenZu ? "" : `<animate attributeName="opacity" values="1;0;1" keyTimes="0;.93;.97" calcMode="discrete" dur="4.5s" repeatCount="indefinite"/>`) +
    `<path d="${lid}Q${f(ex * 0.1)},${f(ey * 1.25)} ${f(-ex)},${f(ey * 0.15)}Z" fill="#fbf7f0"/>` +
    `<clipPath id="ea-${uid}"><path d="${lid}Q${f(ex * 0.1)},${f(ey * 1.25)} ${f(-ex)},${f(ey * 0.15)}Z"/></clipPath>` +
    `<g clip-path="url(#ea-${uid})"><circle cx="${f(-ex * 0.12)}" cy="${f(ey * 0.05)}" r="${f(ey * 1.08)}" fill="${iris}"/>` +
    `<circle cx="${f(-ex * 0.15)}" cy="${f(ey * 0.1)}" r="${f(ey * 0.7)}" fill="#0a0605"/>` +
    `<circle cx="${f(-ex * 0.34)}" cy="${f(-ey * 0.32)}" r="${f(ey * 0.36)}" fill="#fff"/>` +
    `<circle cx="${f(ex * 0.12)}" cy="${f(ey * 0.4)}" r="${f(ey * 0.13)}" fill="#fff" opacity=".8"/></g>` +
    `<path d="M${f(-ex * 0.75)},${f(ey * 0.55)}Q${f(ex * 0.1)},${f(ey * 1.25)} ${f(ex * 0.85)},${f(ey * 0.25)}" fill="none" stroke="${INK}" stroke-width="${f(er * 0.18)}" stroke-linecap="round" opacity=".6"/>` +
    `<path d="${lid}" fill="none" stroke="${INK}" stroke-width="${f(er * 0.42)}" stroke-linecap="round"/>` +
    `<path d="M${f(ex * 0.35)},${f(-ey * 0.62)}l${f(ex * 0.18)},${f(-ey * 0.45)}M${f(ex * 0.7)},${f(-ey * 0.35)}l${f(ex * 0.28)},${f(-ey * 0.35)}" fill="none" stroke="${INK}" stroke-width="${f(er * 0.26)}" stroke-linecap="round"/>` +
    `</g>` +
    // geschlossenes Lid beim Blinzeln (kein Weiß sichtbar)
    (opt.statisch && !opt.augenZu ? "" : `<g opacity="${opt.augenZu ? 1 : 0}">${opt.augenZu ? "" : `<animate attributeName="opacity" values="0;1;0" keyTimes="0;.93;.97" calcMode="discrete" dur="4.5s" repeatCount="indefinite"/>`}` +
      `<path d="M${f(-ex)},${f(ey * 0.15)}Q${f(-ex * 0.05)},${f(ey * 1.1)} ${f(ex)},${f(-ey * 0.05)}" fill="none" stroke="${INK}" stroke-width="${f(er * 0.42)}" stroke-linecap="round"/>` +
      `<path d="M${f(-ex * 0.2)},${f(ey * 0.62)}l${f(-ex * 0.08)},${f(ey * 0.5)}M${f(ex * 0.35)},${f(ey * 0.45)}l${f(ex * 0.12)},${f(ey * 0.48)}" fill="none" stroke="${INK}" stroke-width="${f(er * 0.26)}" stroke-linecap="round"/></g>`) +
    `</g>` +
    `<path d="M${f(-ex * 0.7)},${f(-ey * 1.85)}Q${f(ex * 0.1)},${f(-ey * 2.35)} ${f(ex * 0.95)},${f(-ey * 1.5)}" transform="translate(${f(auge.x)},${f(auge.y)}) rotate(-14)" fill="none" stroke="${INK}" stroke-width="${f(er * 0.2)}" stroke-linecap="round" opacity=".45"/>`;
  // Nüster (Comic-Kringel) + Maul
  const n1 = hp(0.86, 0.07), n2 = hp(0.96, 0.08), n3 = hp(0.91, 0.17);
  g += inkFein(`M${f(n1.x)},${f(n1.y)}Q${f(n2.x)},${f(n2.y)} ${f(n3.x)},${f(n3.y)}`, 1.8);
  g += inkFein(`M${f(maulA.x)},${f(maulA.y)}Q${f(mid(maulA, maulB).x)},${f(mid(maulA, maulB).y + 1)} ${f(maulB.x)},${f(maulB.y)}`, 1.5);
  g += inkFein(`M${f(hp(0.9, 0.3 * m).x)},${f(hp(0.9, 0.3 * m).y)}Q${f(hp(0.84, 0.27).x)},${f(hp(0.84, 0.27).y)} ${f(hp(0.78, 0.31).x)},${f(hp(0.78, 0.31).y)}`, 1.1, 'opacity=".5"');
  }
  g += `</g>`;

  if (opt.debug) g += [T, kehle1, kehle2, Cn].map((q, i) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="1.2" fill="${["red","lime","blue","orange"][i]}"/>`).join("");
  if (opt.nurBein) {
    // nur das vordere Bein (für die Enzyklopädie)
    let b = `<defs>${pts ? `<linearGradient id="lg-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(-0.72 * Lg)}" x2="0" y2="${f(-0.32 * Lg)}"><stop offset=".15" stop-color="${body}"/><stop offset=".85" stop-color="${pts}"/></linearGradient>` : ""}<clipPath id="cb-${uid}"><path d="${glatt(vorderN)}"/></clipPath></defs>`;
    b += umriss([[glatt(vorderN), beinFill]], INK);
    b += `<defs>${beinClip("vn", vorderN)}</defs>` + zebraStreifen(fx, "vn", C.stripe || C.points || body) + beinWeiss(BA.vn, fx, "vn", "#fbfaf6");
    const hoehe = BA.vn ? 0 : { krone: 0.05, fessel: 0.12, halbefessel: 0.085, halbstrumpf: 0.33, strumpf: 0.55, hochweiss: 0.75 }[(opt.abzeichen || {}).beine] || 0;
    if (hoehe) { const wl = [P(fx - 3 * w, 2)]; for (let x = fx - 3 * w; x <= fx + 3 * w; x += 1.5) wl.push(P(x, -hoehe * Lg - hh - 1 + Math.sin(x * 0.7) * 0.8)); wl.push(P(fx + 3 * w, 2)); b += `<g clip-path="url(#cb-${uid})"><path d="${eckig(wl)}" fill="#fbfaf6"/></g>`; }
    b += `<path d="${eckig(huf(fx))}" fill="${hufFarbe(BA.vn)}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    return { svg: `<g>${b}</g>`, box: { minX: fx - 1.6 * w, maxX: fx + 1.8 * w, minY: bottom - 8 } };
  }
  // Einzelteile für Zeichenvorlagen (Krita/Inkscape)
  if (opt.teile) return { svg: `<g transform="translate(0,${f(dLiegen)})">${g}</g>`, box: { minX, maxX, minY: minY + dLiegen }, dy: dLiegen, liegt,
    teile: liegt ? { hals: halsD, rumpf: glatt(rumpf), hinterbein: glatt(hinterLiegend), vorderbein: glatt(vorderLiegend), vorderbeinUnten: eckig(vorderLiegendUnten), maehne: maehneD, schweif: schweifD, kopf: glatt(kopf) }
      : { hals: halsD, rumpf: glatt(rumpf), vorderbeinNah: glatt(vorderN), vorderbeinFern: glatt(vorderF), hinterbeinNah: glatt(hinterN), hinterbeinFern: glatt(hinterF),
        hufVornNah: eckig(huf(fx)), hufVornFern: eckig(huf(fx2)), hufHintenNah: eckig(huf(hx)), hufHintenFern: eckig(huf(hx2)), maehne: maehneD, schweif: schweifD, kopf: glatt(kopf) },
    punkte: { widerrist: Wn, brust: Cn, genick: Pn, kehle: T, nase: hp(0.95, -0.01) }, kopfMatrix: ekMatrix, L, H, D, top, bottom };
  if (opt.punkte) return { svg: `<g>${g}</g>`, box: { minX, maxX, minY }, kopf: glatt(kopf), stirn: hp(0.2, -0.06), nase: hp(0.95, -0.01), genick: hp(-0.03, -0.03), maul: hp(1.0, 0.22 * m), auge, er };
  return { svg: `<g transform="translate(0,${f(dLiegen)})">${g}</g>`, box: { minX, maxX, minY: minY + dLiegen } };
}

// =====================================================================
//  Pferdeakte: Gangwerk, Charakter, Ausbildung (rassetypisch)
// =====================================================================
// gang: Grundnoten Schritt/Trab/Galopp (seit v161 um 1,5 gesenkt: meist 5,5–7, eine 8 hat etwa jedes 20. Pferd) · toelt/pass: Wahrscheinlichkeit, dass die Gangart vorhanden ist
// char: Temperament, Mut, Neugier, Menschenbezug, Arbeitswille, Nervenstärke, Sensibilität (0–100)
// dress: Eignung für die Dressurausbildung (beeinflusst Schwung, Geraderichtung, Versammlung)
// koerper: Rassen-Grundwerte der Anlagen (Reihenfolge wie WERTE_KOERPER) · kopf: Lernfähigkeit, Konzentration, Reaktionsfähigkeit
const PROFIL = {
  araber:       { gang: [5.5, 5.5, 6],   char: [80, 50, 85, 75, 70, 45, 80], dress: .75, koerper: [55, 90, 75, 70, 70, 75, 70, 85, 85, 80], kopf: [75, 55, 80] },
  friese:       { gang: [6, 6.5, 5.5],   char: [45, 60, 60, 80, 75, 65, 60], dress: .85, koerper: [70, 55, 45, 45, 50, 65, 60, 60, 55, 55], kopf: [65, 70, 55] },
  marwari:      { gang: [5.5, 5, 6],     char: [70, 70, 80, 60, 70, 55, 70], dress: .7, pass: .5, passName: "Pass (Revaal)", koerper: [60, 80, 70, 65, 70, 70, 65, 80, 75, 75], kopf: [65, 60, 75] },
  fjord:        { gang: [5.5, 5, 5],     char: [30, 70, 55, 80, 70, 85, 30], dress: .65, koerper: [70, 75, 40, 45, 55, 55, 60, 85, 75, 85], kopf: [60, 65, 55] },
  haflinger:    { gang: [5.5, 5.5, 5],   char: [45, 70, 65, 80, 70, 80, 35], dress: .7, koerper: [70, 70, 45, 50, 60, 60, 60, 80, 70, 80], kopf: [60, 60, 60] },
  shetty:       { gang: [4.5, 5, 4.5],   char: [55, 70, 80, 60, 40, 75, 30], dress: .55, koerper: [75, 70, 30, 50, 70, 55, 60, 85, 70, 85], kopf: [55, 45, 65] },
  shire:        { gang: [5.5, 5, 4.5],   char: [20, 75, 45, 85, 70, 90, 30], dress: .5, koerper: [85, 55, 30, 30, 30, 45, 50, 75, 55, 65], kopf: [55, 70, 40] },
  andalusier:   { gang: [6, 6, 6],       char: [60, 65, 75, 80, 80, 65, 70], dress: .95, koerper: [75, 65, 55, 60, 75, 80, 75, 65, 65, 70], kopf: [75, 70, 70] },
  lipizzaner:   { gang: [5.5, 6, 5.5],   char: [55, 65, 75, 75, 85, 70, 65], dress: 1, koerper: [80, 65, 50, 60, 70, 80, 75, 70, 65, 75], kopf: [80, 75, 65] },
  vollblut:     { gang: [5.5, 5.5, 7.5], char: [90, 55, 85, 60, 80, 35, 85], dress: .7, koerper: [65, 80, 95, 90, 60, 70, 65, 60, 70, 55], kopf: [70, 55, 85] },
  quarter:      { gang: [5.5, 5, 6],     char: [35, 75, 65, 80, 80, 85, 40], dress: .75, koerper: [80, 60, 75, 90, 90, 65, 75, 75, 70, 75], kopf: [65, 70, 85] },
  hannoveraner: { gang: [6.5, 6.5, 6.5], char: [60, 60, 70, 70, 80, 60, 65], dress: 1, koerper: [75, 70, 65, 65, 65, 80, 75, 65, 65, 65], kopf: [75, 70, 70] },
  isi:          { gang: [5.5, 5, 5.5],   char: [60, 70, 80, 75, 80, 75, 45], dress: .7, toelt: 1, pass: .55, koerper: [65, 80, 50, 55, 65, 60, 70, 90, 80, 90], kopf: [65, 60, 65] },
  tinker:       { gang: [5, 5, 4.5],     char: [30, 70, 55, 85, 60, 85, 30], dress: .6, koerper: [75, 65, 40, 45, 50, 55, 55, 80, 65, 80], kopf: [55, 60, 50] },
  tekke:        { gang: [6, 5.5, 7],     char: [85, 55, 85, 55, 75, 40, 80], dress: .7, koerper: [60, 90, 85, 80, 65, 70, 65, 85, 80, 75], kopf: [70, 55, 80] },
  trakehner:    { gang: [6.5, 6.5, 6.5], char: [70, 60, 75, 70, 80, 55, 75], dress: .95, koerper: [70, 78, 70, 70, 65, 80, 75, 68, 70, 68], kopf: [75, 70, 75] },
  welshcob:     { gang: [5.5, 7, 5.5],   char: [65, 70, 75, 75, 75, 70, 50], dress: .75, koerper: [75, 75, 50, 60, 60, 65, 65, 82, 72, 82], kopf: [65, 60, 65] },
  clydesdale:   { gang: [6, 5.5, 4.5],   char: [30, 75, 55, 85, 75, 85, 35], dress: .55, koerper: [85, 60, 30, 35, 35, 50, 55, 75, 60, 70], kopf: [55, 65, 45] },
  fell:         { gang: [5.5, 6, 5],     char: [40, 75, 65, 80, 75, 80, 35], dress: .65, koerper: [75, 80, 45, 50, 60, 60, 62, 88, 75, 90], kopf: [60, 60, 60] },
  dales:        { gang: [5.5, 6, 5],     char: [40, 75, 60, 80, 80, 80, 35], dress: .6, koerper: [80, 80, 45, 50, 55, 55, 60, 86, 75, 88], kopf: [60, 62, 55] },
  angloaraber:  { gang: [6, 6, 7],       char: [80, 62, 80, 65, 80, 45, 80], dress: .85, koerper: [62, 86, 85, 80, 65, 75, 70, 78, 80, 72], kopf: [75, 60, 80] },
  shagya:       { gang: [6, 6, 6],       char: [70, 62, 80, 80, 80, 55, 70], dress: .85, koerper: [65, 86, 75, 70, 70, 75, 70, 86, 80, 82], kopf: [75, 65, 75] },
  appaloosa:    { gang: [5.5, 5, 5.5],   char: [40, 75, 70, 75, 80, 80, 45], dress: .7, koerper: [75, 75, 70, 80, 85, 65, 75, 85, 75, 82], kopf: [65, 70, 80] },   // v442: zäh und trittsicher (Ranch, Distanz)
  knabstrupper: { gang: [6, 6, 6],       char: [55, 65, 75, 80, 80, 65, 60], dress: .9, koerper: [72, 72, 65, 65, 70, 78, 75, 72, 70, 72], kopf: [75, 70, 70] },
  paint:        { gang: [5.5, 5, 6],     char: [35, 75, 65, 80, 80, 85, 40], dress: .75, koerper: [80, 60, 75, 90, 90, 65, 75, 75, 70, 75], kopf: [65, 70, 85] },
  noriker:      { gang: [5.5, 5.5, 4.5], char: [30, 75, 55, 85, 80, 85, 35], dress: .55, koerper: [85, 65, 35, 40, 45, 50, 62, 82, 65, 78], kopf: [60, 70, 50] },   // v445: trittsicher (Koordination)
  lewitzer:     { gang: [5.5, 6, 5.5],   char: [50, 70, 75, 85, 75, 75, 45], dress: .75, koerper: [68, 75, 55, 60, 70, 65, 68, 80, 72, 80], kopf: [65, 65, 65] },
  barockpinto:  { gang: [6, 6.5, 5.5],   char: [45, 65, 65, 80, 75, 70, 55], dress: .85, koerper: [72, 58, 48, 48, 52, 66, 62, 64, 58, 60], kopf: [65, 68, 58] },
};

const CHARAKTER = [
  { key: "temperament", titel: "Temperament",    links: "ruhig",        rechts: "temperamentvoll" },
  { key: "mut",         titel: "Mut",            links: "scheu",        rechts: "mutig" },
  { key: "wachheit",    titel: "Neugier",        links: "verträumt",    rechts: "neugierig" },   // Schlüssel bleibt „wachheit“ (alte Speicherstände)
  { key: "bezug",       titel: "Menschenbezug",  links: "eigenständig", rechts: "verschmust" },
  { key: "wille",       titel: "Arbeitswille",   links: "eigensinnig",  rechts: "leistungsbereit" },
  { key: "nerven",      titel: "Nervenstärke",   links: "nervös",       rechts: "gelassen" },
  { key: "sensibel",    titel: "Sensibilität",   links: "robust",       rechts: "sensibel" },
];
// Körperliche und mentale Werte (0–100). anlage = vererbte Obergrenze; trainierbare Werte füllen sich durch Training bis dorthin auf.
// art: "anlage" = nur vererbt (Wert = Anlage), "training" = trainierbar bis zur Anlage, "erarbeitet" = keine Anlage, nur durch Pflege/Ausbildung (bis 100)
const WERTE_KOERPER = [
  { key: "kraft",          titel: "Kraft",           art: "training", info: "Hinterhandkraft: Sprungkraft, Versammlung halten, im Western enge Wendungen und schnelle Starts. Relativ zur Größe – Ponys sind kräftig." },
  { key: "ausdauer",       titel: "Ausdauer",        art: "training", info: "Wie lange das Pferd Leistung bringen kann, ohne zu ermüden." },
  { key: "geschwindigkeit", titel: "Geschwindigkeit", art: "anlage",   info: "Höchsttempo. Wird vererbt und lässt sich kaum trainieren." },
  { key: "beschleunigung", titel: "Beschleunigung",  art: "training", info: "Wie schnell das Pferd aus dem Stand oder langsamen Tempo antritt." },
  { key: "wendigkeit",     titel: "Wendigkeit",      art: "training", info: "Enge Kurven und schnelle Richtungswechsel." },
  { key: "beweglichkeit",  titel: "Beweglichkeit",   art: "training", info: "Bewegungsumfang und Geschmeidigkeit des ganzen Körpers." },
  { key: "koordination",   titel: "Koordination",    art: "training", info: "Die eigenen Beine sortieren – z. B. ein Hindernis richtig anreiten oder Stangenarbeit." },
  { key: "zaehigkeit",     titel: "Zähigkeit",       art: "training", info: "Wie gut das Pferd Belastung und schwierige Bedingungen wegsteckt." },
  { key: "regeneration",   titel: "Regeneration",    art: "training", info: "Wie schnell sich das Pferd nach dem Training erholt." },
  { key: "konstitution",   titel: "Konstitution",    art: "anlage",   info: "Robustheit des Körpers. Wird vererbt." },
];
const WERTE_KOPF = [
  { key: "lernfaehigkeit", titel: "Lernfähigkeit",    art: "anlage",     info: "Wie schnell das Pferd Neues lernt. Wird vererbt." },
  { key: "konzentration",  titel: "Konzentration",    art: "training",   info: "Lektionen fehlerfrei und aufmerksam durchziehen." },
  { key: "reaktion",       titel: "Reaktionsfähigkeit", art: "training", info: "Schnelle Abfolgen meistern, z. B. Sprungkombinationen." },
  { key: "vertrauen",      titel: "Vertrauen",        art: "erarbeitet", info: "Vertrauen zum Menschen – entsteht nur durch Pflege und gemeinsame Zeit, bei verschmusten Pferden schneller." },
  { key: "gehorsam",       titel: "Gehorsam",         art: "erarbeitet", info: "Wie zuverlässig das Pferd auf Hilfen reagiert – entsteht durch Ausbildung." },
];
// Lernfähigkeit (0–100) → Lerntempo-Faktor wie das frühere „talent“: 33 → ×0,8 · 67 → ×1,0 · 100 → ×1,2
const lernFaktor = lern => Math.round((0.6 + 0.6 * lern / 100) * 100) / 100;
const AUSBILDUNG = ["Takt", "Losgelassenheit", "Anlehnung", "Schwung", "Geraderichtung", "Versammlung"];

function erzeugeWerte(pferd) {
  const pr = PROFIL[pferd.rasse] || PROFIL.hannoveraner;
  const r = zufall("werte-" + pferd.id + pferd.rasse);
  const gauss = () => (r() + r() + r() - 1.5) / 1.5; // ungefähr -1 … 1
  const note = b => Math.max(4, Math.min(10, Math.round((b + gauss() * 2) * 2) / 2));
  const gang = { schritt: note(pr.gang[0]), trab: note(pr.gang[1]), galopp: note(pr.gang[2]) };
  if (pr.toelt && r() < pr.toelt) gang.toelt = note(6);
  if (pr.pass && r() < pr.pass) gang.pass = note(5);
  const charakter = {};
  CHARAKTER.forEach((c, i) => charakter[c.key] = Math.round(Math.max(3, Math.min(97, pr.char[i] + gauss() * 22))));
  const reinOpt = [100, 100, 100, 100, 100, 93.75, 87.5, 75];
  const reinrassig = reinOpt[Math.floor(r() * reinOpt.length)], streuung = AUSBILDUNG.map(() => Math.round(gauss() * 8));
  // Anlagen: Rassen-Grundwert ± Streuung (5–100)
  const ra = zufall("anlage-" + pferd.id + pferd.rasse), ga = () => (ra() + ra() + ra() - 1.5) / 1.5, anlage = {};
  const kb = pr.koerper || PROFIL.hannoveraner.koerper, kk = pr.kopf || PROFIL.hannoveraner.kopf;
  WERTE_KOERPER.forEach((x, i) => anlage[x.key] = Math.round(Math.max(5, Math.min(100, kb[i] + ga() * 14))));
  WERTE_KOPF.slice(0, 3).forEach((x, i) => anlage[x.key] = Math.round(Math.max(5, Math.min(100, kk[i] + ga() * 14))));
  return { reinrassig, gang, charakter, anlage, talent: lernFaktor(anlage.lernfaehigkeit), streuung };
}

// Ausbildungsstand ergibt sich aus Alter, Talent und Rasseneignung (0–100 je Punkt der Skala)
function ausbildungsWerte(pferd) {
  const w = pferd.werte, pr = PROFIL[pferd.rasse] || PROFIL.hannoveraner;
  const a = pferd.alter;
  // Tage im Ausbildungsstall bringen das Pferd schneller voran
  // Ausbildung entsteht nur durch Training (Ausbildungsstall) – ein unausgebildetes Pferd hat überall 0 %
  const basis = a < 3 ? 0 : Math.min(95, (pferd.training || 0) * 0.9) * w.talent;
  // Skala der Ausbildung: jede Stufe baut auf der vorigen auf – sie beginnt erst zu steigen,
  // wenn die vorige mindestens 20 % erreicht hat, und kann sie nicht überholen
  // seit Training daheim (Etappe 4): jede Stufe einzeln gespeichert in pferd.skala (sonst wie bisher aus den Tagen im Ausbildungsstall)
  const sk = Array.isArray(pferd.skala) ? pferd.skala : null;
  let vorher = 100;
  return AUSBILDUNG.map((name, i) => {
    let v = sk ? (sk[i] || 0) : basis * (1.12 - i * 0.13) * Math.pow(pr.dress, i / 4) + (basis > 0 ? w.streuung[i] : 0);
    v = Math.max(0, Math.min(97, v));
    if (i > 0 && !sk) v = Math.min(v, Math.max(0, (vorher - 20) / 80 * 100), vorher);   // gespeicherte Stufen halten die Regel schon beim Training ein (skalaGrenze)
    vorher = v;
    return { name, wert: Math.round(v) };
  });
}
// Klassen der Dressur (E, A, L, M, S): jede verlangt bestimmte Stufen der Ausbildungsskala – S zusätzlich Ausdruck (gutes Gangwerk)
const KLASSEN = [
  { k: "E", name: "Einsteiger", min: { Takt: 20, Losgelassenheit: 20 }, lekt: "Schritt, Trab, Galopp · Zirkel, Volte, Schlangenlinie", fokus: "Gleichmäßigkeit, Takt, Losgelassenheit" },
  { k: "A", name: "Anfänger", min: { Takt: 45, Losgelassenheit: 40, Anlehnung: 30 }, lekt: "Mitteltrab, Mittelgalopp, einfache Galoppwechsel, Rückwärtsrichten", fokus: "Durchlässigkeit, Reaktion auf feine Hilfen" },
  { k: "L", name: "Leicht", min: { Anlehnung: 45, Schwung: 40, Geraderichtung: 30, Versammlung: 10 }, lekt: "Schulterherein, Travers, Kurzkehrt, Außengalopp (auf Trense)", fokus: "Anlehnung, beginnende Versammlung, Geraderichtung" },
  { k: "M", name: "Mittel", min: { Schwung: 60, Geraderichtung: 55, Versammlung: 40 }, lekt: "Traversalen, Schrittpirouetten, Serienwechsel (auf Kandare)", fokus: "stärkere Versammlung, Durchlässigkeit" },
  { k: "S", name: "Schwer", min: { Geraderichtung: 70, Versammlung: 70 }, ausdruck: 7, lekt: "Piaffe, Passage, Galopppirouetten, Wechsel zu zwei und einem Sprung", fokus: "Ausdruck, absolute Versammlung, Exaktheit" },
];
// höchste Klasse, deren Anforderungen das Pferd erfüllt (-1 = noch nicht ausgebildet)
function klasseIndex(werte, gang) {
  const w = Object.fromEntries(werte.map(x => [x.name, x.wert])), g = gang || {}, ausdruck = ((g.schritt || 0) + (g.trab || 0) + (g.galopp || 0)) / 3;
  let k = -1;
  KLASSEN.forEach((c, i) => { if (i === k + 1 && Object.entries(c.min).every(([n, v]) => (w[n] || 0) >= v) && (!c.ausdruck || ausdruck >= c.ausdruck)) k = i; });
  return k;
}
function ausbildungsKlasse(werte, alter, gang) {
  const k = klasseIndex(werte, gang);
  if (k < 0) return alter < 3 ? "Klasse E – Fohlen / Jungpferd, noch nicht ausgebildet" : "Klasse E – noch nicht ausgebildet";
  return `Klasse ${KLASSEN[k].k} (${KLASSEN[k].name})`;
}
const NOTENWORT = n => n >= 10 ? "ausgezeichnet" : n >= 9 ? "sehr gut" : n >= 8 ? "gut" : n >= 7 ? "ziemlich gut" : n >= 6 ? "befriedigend" : n >= 5 ? "genügend" : "mangelhaft";

// Pflege-Startwerte: wann zuletzt Hufschmied, Impfung, Wurmkur und Zahnbehandlung waren (Tag-Nummern)
function erzeugePflege(pferd, heute) {
  const r = zufall("pflege-" + pferd.id);
  const t = heute || (typeof spiel !== "undefined" ? spiel.tag : 1) || 1;
  const T = (typeof spiel !== "undefined" && spiel.tempo) || 7;   // Tage pro Jahreszeit – Termine zählen in Jahreszeiten
  return {
    gesundheit: 100,
    huf: t - Math.floor(r() * 0.8 * T),
    impf: t - Math.floor((0.2 + r() * 1.5) * T),
    wurm: t - Math.floor(r() * 0.8 * T),
    zahn: t - Math.floor((0.3 + r() * 3) * T),
  };
}

// Körperproportionen je Altersstufe (junge Pferde: lange Beine, kurzer flacher Rumpf, großer Kopf, kurzer Schweif)
function ALTERS_K(stufe, k) {
  if (stufe === "fohlen") return { len: k.len * 0.84, depth: k.depth * 0.8, legT: k.legT * 0.72, neck: k.neck * 0.92, head: k.head * 1.14, crest: 0.015, nk: Math.max(0.5, (k.nk || 0) * 0.9), aMax: Math.min(k.nAng, 50),
    tail: k.tail * 0.5, tvol: Math.min(k.tvol, 0.7) * 0.8, feather: 0, croup: -0.6, hq: (k.hq || 1) * 0.94, fore: Math.min(k.fore, 0.5) };
  if (stufe === "jaehrling") return { len: k.len * 0.92, depth: k.depth * 0.88, legT: k.legT * 0.85, neck: k.neck * 0.95, head: k.head * 1.06, crest: k.crest * 0.5, aMax: Math.min(k.nAng + 3, 56), nk: Math.max(0.5, k.nk || 0),
    tail: k.tail * 0.75, tvol: k.tvol * 0.8, feather: (k.feather || 0) * 0.5, croup: k.croup - 0.3 };
  if (stufe === "jungpferd") return { depth: k.depth * 0.95, legT: k.legT * 0.94, neck: k.neck * 0.98, crest: k.crest * 0.75, aMax: Math.min(k.nAng + 5, 62), tail: k.tail * 0.92 };
  if (stufe === "reif") return { sag: 1 };
  if (stufe === "senior") return { sag: 2.6, crest: k.crest * 0.4, hq: (k.hq || 1) * 0.94 };
  return {};
}

// ---------- Neue Köpfe aus Domes „pferd kopf.svg“ (PLAN-KOEPFE.md, Etappe 1) ----------
// Kopfform je Pferd: { f: "gerade" | "hecht" | "ramsnase" | "rams" | "keil" | "schaf" | "schwein", s: 0 (gerade) | 1 leicht | 2 normal | 3 stark }
const KOPFFORMEN = { gerade: "Gerader Kopf", hecht: "Hechtkopf", ramsnase: "Ramsnase", rams: "Ramskopf", keil: "Keilkopf", schaf: "Schafskopf", schwein: "Schweinskopf" };
const KOPF_STUFE = ["", "leicht", "normal", "stark"];
const KOPF_WEISS = "#f6f4ee";   // Farbe der Kopfabzeichen
// Größe von Domes neuen Köpfen im Verhältnis zum Spielkopf (v438, Dome: seit v424 waren alle Köpfe ca. 15 % kleiner als die alten gezeichneten)
var KOPF_GROESSE = 1.15;
// Varianten der Kopfabzeichen (v434, von Dome ausgesucht): unregelmäßiger Rand über Turbulenz
const ABZ_VARIANTE = { "schmaleBlesse~geschwungen": { name: "geschwungen", freq: .022, scale: 25, seed: 11 }, "blesse~unregelmaessig": { name: "unregelmäßiger Rand", freq: .022, scale: 25, seed: 13 } };
// Ohrgröße je Rasse (v430, Dome): Araber klein und fein, Ponys und Quarter klein, Kaltblüter groß – alle anderen 1
const OHR_RASSE = { araber: .82, shagya: .85, angloaraber: .88, quarter: .88, shetty: .85, isi: .88, welshcob: .88, fell: .9, dales: .92, fjord: .9, haflinger: .95, vollblut: .95, lipizzaner: .95,
  appaloosa: .9, paint: .88, knabstrupper: 1, lewitzer: .88, noriker: 1.05, barockpinto: 1, tekke: 1.08, marwari: 1, shire: 1.12, clydesdale: 1.12, tinker: 1.05, friese: 1, andalusier: 1, hannoveraner: 1, trakehner: 1 };
// typische Kopfform je Rasse (fehlt die Rasse: gerader Kopf)
const KOPFFORM_RASSE = { araber: "hecht", shagya: "hecht", angloaraber: "hecht", welshcob: "hecht", vollblut: "keil", trakehner: "keil", hannoveraner: "keil", tekke: "keil",
  shire: "ramsnase", clydesdale: "ramsnase", tinker: "ramsnase", friese: "ramsnase", barockpinto: "ramsnase", andalusier: "ramsnase", lipizzaner: "rams" };
// alte Admin-Wahl (p.nase) → neue Form
const RASSE_KOPF = new Proxy({}, { get: (t, r) => typeof r === "string" ? kopfKey({ f: KOPFFORM_RASSE[r] || "gerade", s: 2 }) : undefined });
const kopfKey = k => !k || k.f === "gerade" || !k.s ? "gerade" : k.f + k.s;
const kopfAusKey = key => { const m = /^([a-z]+?)([123])$/.exec(key || ""); return m ? { f: m[1], s: +m[2] } : { f: "gerade", s: 0 }; };
const kopfName = k => !k || k.f === "gerade" || !k.s ? "Gerader Kopf" : `${KOPFFORMEN[k.f]} (${KOPF_STUFE[k.s]})`;
const ALTE_NASE = { hecht: "hecht2", gerade: "gerade", rams: "rams2" };
// Ohrstellungen in der Reihenfolge der Datei
const OHR_REIHE = ["angelegt", "hinten", "seite", "vorne"];
// Altersköpfe: Nase kürzer (n = Länge Genick–Nase), Auge größer (a) – wie bei den bisherigen Altersköpfen
const KOPF_ALTER = { fohlen: { n: 0.87, a: 1.42 }, jaehrling: { n: 0.9, a: 1.2 }, jungpferd: { n: 0.97, a: 1.06 }, reif: { n: 1.01, a: 0.97 }, senior: { n: 1.02, a: 0.94 } };
// Stauchung entlang der Achse Genick → Nase (Zeichnungskoordinaten): [a, b, c, d, e, f]
function kopfAlterMatrix(alter) {
  const K = KOPF_NEU, n = (KOPF_ALTER[alter] || {}).n || 1;
  const ux0 = K.nase.x - K.gap.x, uy0 = K.nase.y - K.gap.y, l = Math.hypot(ux0, uy0), ux = ux0 / l, uy = uy0 / l;
  const a = 1 + (n - 1) * ux * ux, b = (n - 1) * ux * uy, d = 1 + (n - 1) * uy * uy;
  return [a, b, b, d, K.gap.x - (a * K.gap.x + b * K.gap.y), K.gap.y - (b * K.gap.x + d * K.gap.y)];
}
const kmPunkt = (m, q) => ({ x: m[0] * q.x + m[2] * q.y + m[4], y: m[1] * q.x + m[3] * q.y + m[5] });
const kmText = m => `matrix(${m.map(x => +x.toFixed(5)).join(" ")})`;
// Ohrenspiel: ein Ohr wechselt ab und zu kurz in die Nachbarstellung (nie ins Anlegen)
function ohrSpielZiel(st, r) { return st === "vorne" ? "seite" : st === "hinten" ? "seite" : st === "seite" ? (r < 0.6 ? "vorne" : "hinten") : null; }
// o: { fell, muschel, maehne, ink, schattierung, statisch, augenZu, alter, marwari, wimper, ohrR, ohrL, ohrSpiel, seed,
//      abz: Kopfabzeichen (Liste, z. B. ["stern", "schnippe"]), maul: "mehl" | "kupfer" | "grau", augeBlau } – Etappe 2
function kopfNeuSVG(key, uid, o = {}) {
  const K = KOPF_NEU, F = K.formen[key] || K.formen.gerade, ink = o.ink || "#090609";
  const farbe = s => s.replaceAll("__FELL__", o.fell || "#9a9a9a").replaceAll("__MUSCHEL__", o.muschel || "#c9a0a0").replaceAll("__MAEHNE__", o.maehne || o.fell || "#555")
    .replaceAll("__AAL__", o.maehne || "#555").replaceAll("#090609", ink).replaceAll("__WEISS__", KOPF_WEISS).replaceAll("__MEHL__", mix(o.fell || "#9a9a9a", "#faf8f2", .97)).replaceAll("__DUNKEL__", mix(o.fell || "#9a9a9a", "#171313", .7)).replaceAll("__U__", uid + "-");
  const am = kopfAlterMatrix(o.alter), A = KOPF_ALTER[o.alter] || {}, ac = K.augeMitte, ac2 = kmPunkt(am, ac), as = A.a || 1;
  const rnd = zufall((o.seed || "k") + "-ohren");
  // Ohrgröße je Rasse (v430, o.ohrGr): um den Ohransatz skaliert
  const ohr = seite => { const s = o.ohrGr || 1, B = (K.ohrBasis || {})[(o.marwari ? "marwari" : "basis") + seite], [h, hm] = ohrRoh(seite);
    const um = x => s === 1 || !B ? x : `<g transform="translate(${B.x},${B.y}) scale(${s.toFixed(3)}) translate(${-B.x},${-B.y})">${x}</g>`;
    return um(h) + (o.schattOhr ? `<mask id="${uid}-om${seite}">${um(hm)}</mask><g mask="url(#${uid}-om${seite})">${o.schattOhr}</g>` : ""); };   // v490: Kopf-Schattierung (Verlauf, Glanz, Ruß) auch auf dem Ohr – keine Kante am Ohransatz
  // Maske: Fell und Muschel weiß, Linien schwarz (bleiben scharf)
  const maskeOhr = t => t.replaceAll("__FELL__", "#fff").replaceAll("__MUSCHEL__", "#fff").replaceAll("#090609", "#000");
  // v463 (Dome): Ohren so hell wie der Kopf daneben – der Kopf bekommt oben die helle Schattierung (sh-), die Ohren liegen außerhalb
  const farbeOhr = t => farbe(o.schattierung && !o.schattOhr ? t.replaceAll("__FELL__", mix(o.fell || "#9a9a9a", "#ffffff", .13)) : t);   // ohne schattOhr (alte Aufrufe): feste Aufhellung wie bis v489
  const ohrRoh = (seite) => {   // [Ohr, Maske] – beide mit demselben Rhythmus
    const T = K.ohren[o.marwari ? "marwari" : "basis"][seite], st = OHR_REIHE.includes(o["ohr" + seite]) ? o["ohr" + seite] : "vorne";
    const ziel = o.ohrSpiel && !o.statisch ? ohrSpielZiel(st, rnd()) : null;
    if (!ziel) return [farbeOhr(T[st]), maskeOhr(T[st])];
    // eigener Rhythmus je Ohr: alle 15–30 s für gut 1 s in die Nachbarstellung
    const dur = (15 + rnd() * 15).toFixed(1), a = 0.15 + rnd() * 0.6, b = a + 1.5 / dur;   // v510 (Dome): seltener – alle 15–30 s für gut 1 s
    const zwei = fn => `<g><animate attributeName="opacity" values="1;0;1" keyTimes="0;${a.toFixed(3)};${b.toFixed(3)}" calcMode="discrete" dur="${dur}s" repeatCount="indefinite"/>${fn(T[st])}</g>` +
      `<g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;${a.toFixed(3)};${b.toFixed(3)}" calcMode="discrete" dur="${dur}s" repeatCount="indefinite"/>${fn(T[ziel])}</g>`;
    return [zwei(farbeOhr), zwei(maskeOhr)];
  };
  // Auge: offen (blinzelt) und geschlossenes Lid; Stuten und Fohlen haben eine Wimper mehr
  const blinkAuf = o.statisch || o.augenZu ? "" : '<animate attributeName="opacity" values="1;0;1" keyTimes="0;.93;.97" calcMode="discrete" dur="4.5s" repeatCount="indefinite"/>';
  const blinkZu = o.statisch || o.augenZu ? "" : '<animate attributeName="opacity" values="0;1;0" keyTimes="0;.93;.97" calcMode="discrete" dur="4.5s" repeatCount="indefinite"/>';
  const lidZu = `<path d="M346.69,328.97C368,346 397,336 409.56,305.9M370,341.5L366.5,356M392,336.5L397,350" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`;
  const auge = `<g transform="translate(${ac2.x.toFixed(2)},${ac2.y.toFixed(2)}) scale(${as}) translate(${-ac.x},${-ac.y})">` +
    `<g${o.augenZu ? ' opacity="0"' : ""}>${blinkAuf}${K.augeClip.replace("r15-ekp2-auge-3", uid + "-auge")}${(t => o.sklera ? t.replace("</ellipse>", `</ellipse><ellipse cx="31" cy="1" rx="7.5" ry="19" fill="#f3eee4"/>`) : t)(farbe(o.augeBlau ? K.augeBlau : K.auge).replace("r15-ekp2-auge-3", uid + "-auge"))}${o.wimper ? farbe(K.wimper) : ""}</g>` +
    (o.statisch && !o.augenZu ? "" : `<g opacity="${o.augenZu ? 1 : 0}">${blinkZu}${lidZu}</g>`) + `</g>`;
  const fell = F.fell.replace('transform="', `transform="${kmText(am)} `);
  // Maulfärbung und Kopfabzeichen liegen auf dem Fell, unter Schattierung und Linien (Reihenfolge wie in Domes Datei)
  // Abzeichen-Varianten (v434, Dome): „Name~Variante“ = Domes Form mit unregelmäßigem Rand (Turbulenz), z. B. schmaleBlesse~geschwungen
  const abzSVG = a => { const [k, v] = a.split("~"), A = ABZ_VARIANTE[k + "~" + v], basis = F.abz && F.abz[k]; if (!basis) return ""; if (!A) return basis;
    const fid = `__U__rv${k}`; return `<filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="${A.freq}" numOctaves="2" seed="${A.seed}"/><feDisplacementMap in="SourceGraphic" scale="${A.scale}"/></filter><g filter="url(#${fid})">${basis}</g>`; };
  const zeichen = (o.maul && F.maul && F.maul[o.maul] ? F.maul[o.maul] : "") + (o.abz || []).map(abzSVG).join("");
  return ohr("R") + farbe(fell) + `<clipPath id="${uid}-fell">${fell}</clipPath>` +
    (zeichen ? `<defs>${farbe(kopfDefs(zeichen))}</defs><g clip-path="url(#${uid}-fell)"><g transform="${kmText(am)}">${farbe(zeichen)}</g></g>` : "") +
    (o.augenRing ? `<filter id="${uid}-ar" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter><g clip-path="url(#${uid}-fell)"><g transform="${kmText(am)}"><ellipse cx="${ac.x}" cy="${ac.y}" rx="62" ry="50" fill="${o.augenRing.farbe}" opacity="${(0.25 + 0.3 * o.augenRing.st).toFixed(2)}" filter="url(#${uid}-ar)"/></g></g>` : "") +   // v447: dunkle Haut ums Auge beim Schimmel
    (ALTERS_ZEICHEN[o.alter] ? `<g clip-path="url(#${uid}-fell)"><g transform="${kmText(am)}"><g transform="matrix(${altersZeichenMatrix()})">${ALTERS_ZEICHEN[o.alter].replaceAll("__INK__", ink).replaceAll("__ID__", uid)}</g></g></g>` : "") +   // v468
    (o.lpHaut ? `<g clip-path="url(#${uid}-fell)"><g transform="${kmText(am)}">${lpHautSVG(K, o.seed, o.kroeteHell)}</g></g>` : "") +
    (o.schattierung ? `<g clip-path="url(#${uid}-fell)">${o.schattierung}</g>` : "") +
    (o.uebMaske && !o.ohneUeb ? `<mask id="${uid}-um" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="12000" height="12000">${o.uebMaske}</mask><g mask="url(#${uid}-um)"><g transform="${kmText(am)}">${farbe((F.svg.match(/<path[^>]*class="ueb"[^>]*>(<\/path>)?/g) || []).join(""))}</g></g>` : "") +
    `<g transform="${kmText(am)}">${farbe(o.ohneUeb || o.uebMaske ? F.svg.replaceAll('class="ueb"', 'class="ueb" display="none"') : F.svg)}</g>` + (o.ohrLAussen ? ((o.ohrLAussen.svg = ohr("L")), "") : ohr("L")) + auge;   // v463 (Dome): Tekkiner ohne Schopf-Mähne-Übergang
}
// v468 (Dome): Alterszeichen wie bei den alten Köpfen (bis v423) – graue Haare ums Auge (Maulfleck wirkte komisch – raus, Dome), eingefallene Augengrube, Tränenrinne, Falte am Nasenrücken.
// Aus den alten Koordinaten (Auge 68,96/77,85 · Nase 19,85/127,82) per Ähnlichkeitsabbildung auf Domes Kopf übertragen. Platzhalter, bis Dome die Ebenen zeichnet (BEI-INKSCAPE-BEARBEITEN.md).
const ALTERS_ZEICHEN = {
  reif: `<filter id="__ID__-az" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter><g fill="#d8d3ca" opacity=".3" filter="url(#__ID__-az)"><ellipse cx="68.96" cy="77.85" rx="7" ry="5.5"/></g><path fill="none" stroke="__INK__" stroke-width="1.2" stroke-linecap="round" opacity=".55" d="M61.31 63.25 C65.25 59.20 73.04 58.03 79.00 63.00"/>`,
  senior: `<filter id="__ID__-az" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter><g fill="#d8d3ca" opacity=".5" filter="url(#__ID__-az)"><ellipse cx="68.98" cy="77.87" rx="9" ry="7"/></g>` +
    `<path fill="none" stroke="__INK__" stroke-width="1.5" stroke-linecap="round" d="M60.79 64.62 C64.76 58.60 74.07 57.06 80.01 63.01"/><path fill="none" stroke="__INK__" stroke-width="1.2" stroke-linecap="round" opacity=".7" d="M61.88 88.24 C68.16 92.44 76.70 92.69 83.00 88.81"/>` +
    `<path fill="none" stroke="__INK__" stroke-width="1.2" stroke-linecap="round" opacity=".6" d="M51.54 96.59 C53.44 104.77 51.28 110.95 47.09 117.17"/>` };
function altersZeichenMatrix() {
  const K = KOPF_NEU, A0 = { x: 68.96, y: 77.85 }, N0 = { x: 19.85, y: 127.82 }, A1 = K.augeMitte, N1 = K.nase;
  const v0 = { x: N0.x - A0.x, y: N0.y - A0.y }, v1 = { x: N1.x - A1.x, y: N1.y - A1.y }, s = Math.hypot(v1.x, v1.y) / Math.hypot(v0.x, v0.y) * .82, w = Math.atan2(v1.y, v1.x) - Math.atan2(v0.y, v0.x) - .12;
  const a = s * Math.cos(w), b = s * Math.sin(w);   // .82 / −0,12: Domes Kopf ist länger und steiler – Merkpunkte bleiben am Auge, Maulfleck auf dem Nasenrücken
  return [a, b, -b, a, A1.x - (a * A0.x - b * A0.y), A1.y - (b * A0.x + a * A0.y)].map(x => x.toFixed(4)).join(" ");
}
// v441 Leopard-Komplex: weiße Lederhaut im Augenwinkel (wie beim Menschen) und gefleckte rosa Haut um Maul und Augen – in Koordinaten von Domes Kopf
function lpHautSVG(K, seed, hell) {   // hell: Krötenmaul auf heller Haut (Doppel-Cream) – dunkle Sprenkel auf rosa statt rosa Flecken auf dunkel
  const r = zufall((seed || "k") + "-lphaut"), N = K.nase, G = K.gap, A = K.augeMitte, ux = G.x - N.x, uy = G.y - N.y, l = Math.hypot(ux, uy), nx = -uy / l, ny = ux / l;
  let s = "";
  for (let i = 0; i < 26; i++) { const t = 0.02 + r() * 0.2, q = (r() - .5) * 150, x = N.x + ux * t + nx * q, y = N.y + uy * t + ny * q, rr = 5 + r() * 12;
    s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rr.toFixed(1)}" ry="${(rr * (0.6 + r() * 0.5)).toFixed(1)}" fill="${hell ? "#8d6b63" : "#d9a9a2"}" opacity="${(hell ? 0.35 + r() * 0.3 : 0.65 + r() * 0.3).toFixed(2)}"/>`; }
  for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, d = 42 + r() * 22, rr = 4 + r() * 7;
    s += `<ellipse cx="${(A.x + Math.cos(a) * d).toFixed(1)}" cy="${(A.y + Math.sin(a) * d * 0.8).toFixed(1)}" rx="${rr.toFixed(1)}" ry="${(rr * 0.75).toFixed(1)}" fill="${hell ? "#8d6b63" : "#d9a9a2"}" opacity="${hell ? ".4" : ".8"}"/>`; }
  return s; }
// nur die Verläufe/Filter, die die gewählten Abzeichen brauchen (mit ihren Verweisen)
let KOPF_DEFS = null;
function kopfDefs(svg) {
  if (!KOPF_DEFS) { KOPF_DEFS = {}; for (const m of KOPF_NEU.defs.matchAll(/<(linearGradient|radialGradient|filter)\b[^>]*\bid="__U__(d\d+)"[^>]*?(\/>|>[\s\S]*?<\/\1>)/g)) KOPF_DEFS[m[2]] = m[0]; }
  const da = new Set(), los = s => { for (const m of s.matchAll(/(?:url\(#|href="#)__U__(d\d+)/g)) if (!da.has(m[1]) && KOPF_DEFS[m[1]]) { da.add(m[1]); los(KOPF_DEFS[m[1]]); } };
  los(svg);
  return [...da].map(k => KOPF_DEFS[k]).join("");
}
// Kehlpunkt (Anschluss an den Hals) des neuen Kopfs, mit Altersstauchung
function kopfNeuKehle(key, alter) { const K = KOPF_NEU, F = K.formen[key] || K.formen.gerade; return kmPunkt(kopfAlterMatrix(alter), K.kap[F.kap]); }
// Schopf aus Domes Datei (kurz, mittel, lang, extralang) – mit Aalstrich (aal = Farbe des Aalstrichs) bei allen Falben (Etappe 3, v433)
function schopfNeuSVG(variante, farbe, aal, ink, alter) {
  const s = KOPF_NEU.schoepfe[variante]; if (!s) return "";
  return `<g transform="${kmText(kopfAlterMatrix(alter))}">${s.replaceAll("__MAEHNE__", farbe).replaceAll("__AAL__", aal || farbe).replaceAll("#090609", ink)}</g>`;
}

// Natürliche Mähnenlänge der Rasse
function naturMaehne(rasseId) {
  const k = rasseById(rasseId).k;
  if (k.mane === "fjord") return "steh";
  if (k.mane === "kurz") return "kurz";
  return k.maneLen >= 0.2 ? "lang" : "mittel";
}
const MAEHNEN = [["steh", "Stehmähne"], ["kurz", "Kurze Mähne"], ["mittel", "Mittlere Mähne"], ["lang", "Lange Mähne"], ["extralang", "Extra lange Mähne"]];
// Schopf: eigene Länge, wächst wie die Mähne
const SCHOEPFE = [["kurz", "Kurzer Schopf"], ["mittel", "Mittlerer Schopf"], ["lang", "Langer Schopf"], ["extralang", "Extra langer Schopf"]];
function naturSchopf(rasseId) {
  const f = rasseById(rasseId).k.fore;
  return f < 0.25 ? null : f < 0.45 ? "kurz" : f < 0.75 ? "mittel" : f < 1 ? "lang" : "extralang";
}

// =====================================================================
//  Namen und Fremdblut (Stammbaum selbst entsteht in index.html)
// =====================================================================
const FREMDBLUT = {
  araber: "vollblut", friese: "andalusier", marwari: "araber", fjord: "haflinger", haflinger: "araber",
  shetty: "isi", shire: "tinker", andalusier: "araber", lipizzaner: "andalusier", vollblut: "araber",
  quarter: "vollblut", hannoveraner: "vollblut", isi: "fjord", tinker: "shire", tekke: "araber",
  trakehner: "vollblut", welshcob: "araber", clydesdale: "shire", fell: "dales", dales: "fell", angloaraber: "vollblut", shagya: "araber",
  appaloosa: "quarter", knabstrupper: "trakehner", paint: "quarter", noriker: "haflinger", lewitzer: "welshcob", barockpinto: "friese",
};
const FARBBESCHREIBUNG = {
  schimmel: "Weißes Fell – Schimmel werden dunkel geboren und hellen mit dem Alter auf.",
  grauschimmel: "Rappe mit Schimmel-Gen auf dem Weg zum weißen Schimmel: immer mehr weiße Haare im schwarzen Fell.",
  braunschimmel: "Brauner mit Schimmel-Gen auf dem Weg zum weißen Schimmel – die schwarzen Beine und das Langhaar hellen mit auf.",
  fuchsschimmel: "Fuchs mit Schimmel-Gen: rötlich-graues Fell, wird mit den Jahren weiß. Nicht zu verwechseln mit dem Rotschimmel (Roan).",
  fliegenschimmel: "Spätphase mancher Schimmel: im weißen Fell erscheinen wieder kleine farbige Sprenkel – meist ab etwa 8–15 Jahren.",
  apfelschimmel: "Grauschimmel mit hellen, runden Flecken (Äpfeln) im Fell.",
  rappe: "Schwarzes Fell, schwarze Mähne und schwarzer Schweif. Sommerrappen sind im Sommerfell tiefschwarz und im Winterfell ausgeblichen, Winterrappen sind nur im Winterfell richtig schwarz und bleichen im Sommer in der Sonne rostbraun aus.",
  brauner: "Braunes Fell mit schwarzer Mähne, schwarzem Schweif und dunklen Beinen.",
  dunkelbrauner: "Brauner mit Rußanflug (Gen Sty): Kopf, Hals, Rücken und Kruppe dunkel überhaucht, Bauch und Flanke heller – mit Metallglanz (Achal-Tekkiner) wirkt der Körper goldbraun.",
  fuchs: "Rotbraunes Fell, Mähne und Schweif gleichfarbig.",
  dfuchs: "Dunkler, schokoladen- bis leberbrauner Fuchs mit gleichfarbiger oder dunklerer Mähne (Sooty-Gen) – sehr dunkle heißen auch Kohlfuchs.",
  hellfuchs: "Fuchs mit heller Flachsmähne – typisch Haflinger.",
  dunkelfuchs: "Dunkler, schokoladiger Fuchs mit Flachsmähne.",
  palomino: "Goldgelbes Fell mit weißer Mähne (Fuchs + ein Cream-Gen).",
  isabell: "Cremefarben mit rosa Haut und blauen Augen (doppeltes Cream-Gen).",
  buckskin: "Gelbbraunes Fell mit schwarzen Beinen und schwarzer Mähne.",
  russbuckskin: "Buckskin mit Rußanflug (Gen Sty): Kopf und Hals dunkel überhaucht, Körper hell gelblich bis silbrig, schwarze Beine und Mähne. Beim Achal-Tekkiner mit Glanz „Gold-Rußfalbe“.",
  braunfalbe: "Falbfarben mit Aalstrich und dunklen Beinen.",
  rotfalbe: "Falbe auf Fuchsbasis, rötlicher Aalstrich.",
  mausfalbe: "Mausgraues Fell mit dunklem Kopf, Beinen und Aalstrich (Grullo).",
  weissfalbe: "Sehr helle, fast weiße Falbfarbe.",
  gelbfalbe: "Gelbliche Falbfarbe mit heller Mähne.",
  windfarben: "Dunkles Fell mit heller, silbriger Mähne (Silver-Gen).",
  rappschecke: "Schwarz-weiß gescheckt (Tobiano).",
  braunschecke: "Braun-weiß gescheckt.",
  fuchsschecke: "Fuchsfarben-weiß gescheckt.",
  blueroan: "Schwarzes Fell mit eingestreuten weißen Haaren, wirkt bläulich.",
  hellbrauner: "Heller, rötlich-goldener Brauner mit schwarzen Beinen, Mähne und Schweif. Wie hell ein Brauner ist, wird über mehrere Gene vererbt.",
  schwarzbrauner: "Fast schwarzer Brauner – erkennbar am helleren, rötlichen „Kupfermaul“, kupferfarbenen Haaren um die Augen, in den Flanken und hinter dem Ellbogen (Agouti-Variante At).",
  lethalwhite: "Fast ganz weißes Fohlen mit rosa Haut von zwei Overo-Eltern (O/O). Ihm fehlen Nervenzellen im Darm – es stirbt in den ersten Lebenstagen (Lethal-White-Overo-Syndrom).",
  sa_brauner: "Sabino: viel unregelmäßiges Weiß – breite Blesse, hohe weiße Beine, weiße Flecken am Bauch mit gesprenkeltem Rand. Typisch für Clydesdales (Gen Sb).",
  sw_brauner: "Splashed White: sieht aus wie von unten in weiße Farbe getaucht – sehr breite Blesse oder Laterne, meist blaue Augen, hohe weiße Beine und weißer Bauch mit glattem, klarem Rand. Dominant (Gen SW), v. a. bei Quarter, Welsh, Islandpferd und Shetty. Manche Splash-Pferde sind taub.",
  ov_brauner: "Overo (Frame): waagerecht gezackte weiße Flecken an Seite und Hals, die den Rücken nie kreuzen. Beine meist farbig, oft viel Weiß im Gesicht. Zwei Overo-Eltern können ein tödliches Lethal-White-Fohlen bekommen.",
  tv_fuchs: "Tovero: Tobiano und Overo zusammen – fast ganz weiß, Farbe meist nur noch an Ohren und Kopf („Medicine Hat“), an der Brust und an der Flanke.",
  tg_brauner: "Tigerschecke (Leopard): weißes Fell mit farbigen Punkten am ganzen Körper. Gen Lp mischerbig + Muster-Gen PATN1.",
  fs_rappe: "Wenigpunkt-Tiger (Fewspot): fast ganz weiß mit nur wenigen Punkten – reinerbiger Tiger (Lp/Lp). Lp/Lp-Pferde sind nachtblind (CSNB).",
  sb_rappe: "Schabrackentiger: weiße „Decke“ über Kruppe und Hüfte mit farbigen Punkten. Gen Lp ohne PATN1.",
  sk_brauner: "Schabracke ohne Punkte (Snowcap): weiße Decke ohne Punkte – reinerbiger Tiger (Lp/Lp) ohne PATN1. Lp/Lp-Pferde sind nachtblind (CSNB).",
  rotschimmel: "Roan auf Fuchs: schon bei der Geburt weiße Stichelhaare im roten Fell – ein unveränderlicher Schimmel, hellt nicht auf.",
};
// Scheckungs-Beispiele für das Lexikon
["ov_brauner", "tv_fuchs", "tg_brauner", "fs_rappe", "sb_rappe", "sk_brauner", "sa_brauner", "sw_brauner"].forEach(id => FARBEN[id]);

// ---------- v405 (Dome): realistischere Pferdenamen – Freizeitpferde einfach, Zuchtpferde besonders (je Rasse), mehr Abwechslung ----------
const NAMEN_HOBBY = {
  Stute: ["Bella", "Luna", "Fee", "Lotte", "Fanny", "Paula", "Kira", "Nala", "Stella", "Lissy", "Mia", "Emma", "Flocke", "Schneeflocke", "Pünktchen", "Krümel", "Biene", "Lilly", "Susi", "Molly", "Daisy", "Ronja", "Lady", "Cindy", "Maja", "Hexe", "Wilma", "Elfe", "Jule", "Gina", "Sternchen", "Mausi", "Toffee", "Cookie", "Lucy", "Tessa", "Leni", "Frieda", "Rosi", "Fritzi", "Polly", "Wendy", "Zora", "Kiki", "Sunny", "Peggy", "Lena", "Amy", "Holly", "Nessie", "Chiara", "Smilla", "Mona", "Uschi", "Hanni", "Nanni", "Bonnie", "Dolly", "Lupina", "Feline"],
  Mann: ["Max", "Moritz", "Jonny", "Charly", "Fritz", "Sammy", "Benny", "Lucky", "Pepe", "Bruno", "Oskar", "Theo", "Emil", "Felix", "Paul", "Anton", "Balou", "Rocky", "Blacky", "Flash", "Snoopy", "Bambi", "Tommy", "Willi", "Leo", "Tobi", "Pablo", "Joker", "Merlin", "Sunny", "Teddy", "Krümel", "Fips", "Jacky", "Ronny", "Hansi", "Fred", "Louis", "Elvis", "Simba", "Nemo", "Pünktchen", "Dakota", "Cooper", "Milo", "Ole", "Bob", "Jimmy", "Cäsar", "Rudi", "Pumuckl", "Tinto", "Speedy", "Frodo", "Rambo", "Gandalf", "Picasso", "Shadow", "Lasse", "Bento"],
};
// Zuchtnamen nach Rassengruppe: [Stuten, Hengste] – teils mit Vorsilbe (Sir, Donna …) zusammengesetzt
const ZUCHT_GRUPPE = { hannoveraner: "warm", trakehner: "warm", lipizzaner: "barock", andalusier: "spanisch", araber: "araber", angloaraber: "araber", shagya: "araber", tekke: "tekke", marwari: "marwari", vollblut: "vollblut", appaloosa: "western", paint: "western", knabstrupper: "knab", noriker: "noriker", lewitzer: "pony", barockpinto: "friese",
  quarter: "western", isi: "isi", friese: "friese", haflinger: "haflinger", fjord: "fjord", shetty: "pony", welshcob: "welsh", fell: "britpony", dales: "britpony", shire: "britkalt", clydesdale: "britkalt", tinker: "tinker" };
const ZUCHT_NAMEN = {
  warm: { vorS: ["Donna", "Lady", "Fürstin", "Gräfin", "Bella", "Royal", "Miss", "Dame"], vorH: ["Sir", "Lord", "Fürst", "Don", "Grand", "Royal", "Baron", "Graf", "Prince", "Count"],
    S: ["Fleur", "Rubina", "Cassandra", "Florentine", "Valentina", "Diamanta", "Sambalina", "Sarabande", "Cornetta", "Quintana", "Bonita", "Esmeralda", "Galante", "Celeste", "Fiorella", "Anastasia", "Wolkenspiel", "Sonnenwende", "Herzdame", "Rondeau", "Belissima", "Dancing Queen", "Feine Dame", "Amour", "Fürstenliebe", "Laurentia", "Rivage", "Siena", "Vivaldi", "Weltschönheit"],
    H: ["Diamant", "Falkenstein", "Rubinstein", "Cornado", "Feuerglanz", "Valentino", "Silberstern", "Wolkenstürmer", "Bellini", "Cassius", "Lancelot", "Sandokan", "Quintus", "Romanov", "Florian", "Montana", "Brillant", "Escudo", "Dynamo", "Weltmeister", "Fürstenball", "Donnerwetter", "Sansibar", "Belvedere", "Quatermain", "Rockefeller", "Lord Byron", "Sorento", "Vivaldi", "Grafenstolz"] },
  barock: { S: ["Favory Bella", "Conversana Dora", "Neapolitana Sole", "Maestoso Mira", "Siglavy Flora", "Pluto Gaja", "Tulipa", "Allegra", "Bona Fortuna", "Capriola"], H: ["Favory Gratia", "Conversano Bona", "Neapolitano Dubovina", "Maestoso Calcedona", "Siglavy Allegra", "Pluto Theodorosta", "Favory Toscana", "Maestoso Mara", "Conversano Fantasia", "Pluto Bona"] },
  spanisch: { S: ["Esperanza", "Paloma", "Bonita", "Altiva", "Orgullosa", "Carmela", "Dulcinea", "Gitana", "Morena", "Estrella", "Luz del Sol", "Reina", "Bailaora", "Soledad", "Primavera"], H: ["Bailador", "Duende", "Fandango", "Valiente", "Gitano", "Hidalgo", "Faraón", "Orgulloso", "Lucero", "Embrujo", "Bravío", "Diamante", "Torero", "Majestuoso", "Relámpago"] },
  araber: { S: ["Jasira", "Nadira", "Samira", "Layla", "Zahra", "Shakira", "Malika", "Yasmina", "Farida", "Nur el Ain", "Bint Sahra", "Kalila", "Rahima", "Safiya", "Amani", "Dalia", "Ghazal", "Hayat", "Lulwa", "Bint Nadja"], H: ["Amir", "Shahin", "Kahil", "Raschid", "El Sharif", "Nazeer", "Bahri", "Jamil", "Malik", "Al Hadid", "Saladin", "Kasim", "Ibn Faris", "Tariq", "Zafir", "Khalid", "El Ghazi", "Mudir", "Ansata Amir", "Ibn Shahin"] },
  tekke: { S: ["Gulsara", "Ak-Dzhamal", "Altyn", "Gyzyl", "Aigul", "Dzhennet", "Gülbahar", "Maral"], H: ["Ak-Bars", "Gelishikli", "Absent", "Arslan", "Gyrat", "Dagestan", "Kaplan", "Altyn Ok"] },
  marwari: { S: ["Rani", "Chandni", "Moti", "Lakshmi", "Padmini", "Savitri", "Kesar", "Meera"], H: ["Raja", "Sultan", "Bhim", "Maharaj", "Shamsher", "Veer", "Ranjit", "Kesari"] },
  vollblut: { S: ["Lady Luck", "Sea Pearl", "Morning Glory", "Desert Rose", "Summer Melody", "Crown Jewel", "Silver Lining", "Moonlight Sonata", "Wild Orchid", "Golden Dawn", "Velvet Storm", "Queen of Hearts", "Starlight Express", "Ocean Pearl", "Royal Grace"], H: ["Silver Arrow", "Northern Star", "Midnight Express", "Golden Gate", "Royal Flight", "Storm Chaser", "Lucky Strike", "Wind of Fortune", "Highland Dream", "Dark Victory", "Spirit of Dawn", "Ocean Breeze", "Flying Dutchman", "Red Baron", "Thunder Bay"] },
  western: { a: ["Smart", "Shining", "Little", "Docs", "Hot", "Chics", "Gunners", "Wimpys", "Peppys", "Spooks", "Lenas", "Jacs", "Dun It", "Whizzen", "Starlights"], b: ["Spark", "Lena", "Jewel", "Gotta Gun", "Whiz", "Chex", "Jac", "Starlight", "Command", "Dun Lady", "Playboy", "Olena", "Sugar", "Badger", "Lil Chic"] },
  isi: { S: ["Hekla", "Freyja", "Sunna", "Perla", "Vaka", "Stjarna", "Drífa", "Gola", "Katla", "Hrefna", "Sóley", "Elding", "Gná", "Brynja", "Snót"], H: ["Fengur", "Hrímnir", "Glói", "Skuggi", "Blesi", "Gnýr", "Ljúfur", "Sleipnir", "Þokki", "Kjarni", "Hrafn", "Logi", "Ófeigur", "Gustur", "Sólon"], von: ["Hólum", "Stóra-Hofi", "Kirkjubæ", "Skarði", "Sauðárkróki", "Árbakka", "Feti", "Selfossi"] },
  friese: { S: ["Jildou", "Tjitske", "Doutzen", "Anneke", "Fokje", "Willemke", "Hiske", "Sjoukje", "Baukje", "Lutske"], H: ["Ytsen", "Tsjalle", "Hearke", "Wybe", "Feike", "Sjoerd", "Gerlof", "Tamme", "Bauke", "Jasper"], von: ["fan de Lijnbaan", "fan 'e Swette", "fan Hof Elsbeth", "fan Wiersma", "fan de Heide"] },
  haflinger: { S: ["Nanni", "Anni", "Bergrose", "Almrose", "Nelke", "Sissi", "Mariella", "Afra", "Stella", "Wildrose", "Edelweiß", "Bianca"], H: ["Nordstern", "Abendwind", "Stolzer Prinz", "Bergkönig", "Merano", "Nebos", "Winterzauber", "Afrikanus", "Starlight", "Bodo", "Waldläufer", "Almsturm"] },
  fjord: { S: ["Sigrid", "Solveig", "Ingrid", "Kari", "Liv", "Ragna", "Tora", "Hedda"], H: ["Gjest", "Rolf", "Odin", "Torvald", "Haakon", "Bjørn", "Sverre", "Leiv"] },
  pony: { S: ["Tilly", "Pippa", "Moppel", "Trixi", "Fluffy", "Krümel", "Bonnie", "Wuschel"], H: ["Barnaby", "Pumpkin", "Muffin", "Nugget", "Biscuit", "Hamish", "Rascal", "Pebbles"] },
  welsh: { S: ["Rhiannon", "Gwen", "Seren", "Myfanwy", "Arwen", "Ceridwen", "Eirlys", "Megan"], H: ["Dafydd", "Bryn", "Dylan", "Glyndwr", "Rhys", "Taliesin", "Owain", "Emrys"], von: ["Llanarth", "Derwen", "Thorneyside", "Nebo", "Menai"] },
  britpony: { S: ["Heather", "Bramble", "Moorland Rose", "Fern", "Lady Mary", "Primrose"], H: ["Laddie", "Highland Lad", "Moorland Prince", "Bracken", "Rowan", "Heathcliff"] },
  britkalt: { S: ["Duchess", "Bonnie", "Molly", "Maggie", "Lady Victoria", "Bluebell"], H: ["Duke", "Hercules", "Big Ben", "Prince Albert", "Clyde", "Sir Winston"] },
  tinker: { S: ["Maggie May", "Bonny", "Lucky Clover", "Molly Malone", "Shannon", "Kathleen"], H: ["Paddy", "Shamrock", "Mister Ben", "Seamus", "Finnegan", "Murphy"] },
  noriker: { S: ["Resi", "Vroni", "Liesl", "Burgl", "Zenzi", "Moni", "Gretl", "Steffi", "Wally", "Rosl"], H: ["Arno Vulkan", "Max Nero", "Sepp Diamant", "Franzl Elmar", "Toni Schaunitz", "Hias Vulkan", "Bertl Nero", "Lois Diamant", "Rupert Elmar", "Hansl Schaunitz"] },   // Hengste mit Linienname (Vulkan, Nero, Diamant, Elmar, Schaunitz)
  knab: { S: ["Frida", "Ingeborg", "Karen", "Sigrun", "Dagmar", "Mette", "Freja", "Astrid", "Tilde", "Ronja"], H: ["Valdemar", "Thor", "Frederik", "Knud", "Ragnar", "Mikkel", "Egil", "Sigurd", "Holger", "Leif"], von: ["fra Skovgaard", "fra Ryegaard", "fra Frederiksborg", "fra Knabstrup", "fra Mosegaard"] },
};
// art "zucht": besonderer Zuchtname je Rasse · "hobby": einfacher Rufname · r: Zufallsfunktion (sonst Math.random)
function pferdeName(g, rasse, art = "hobby", r = Math.random) {
  const pick = a => a[Math.floor(r() * a.length)], mann = g !== "Stute";
  if (art !== "zucht") return pick(mann ? NAMEN_HOBBY.Mann : NAMEN_HOBBY.Stute);
  const Z = ZUCHT_NAMEN[ZUCHT_GRUPPE[rasse] || "warm"];
  if (Z.a) return `${pick(Z.a)} ${pick(Z.b)}`;   // Western: z. B. „Smart Spark“
  const basis = pick(mann ? Z.H : Z.S);
  if (Z.von && r() < 0.6) return Z.von.length && (ZUCHT_GRUPPE[rasse] === "isi") ? `${basis} frá ${pick(Z.von)}` : ZUCHT_GRUPPE[rasse] === "welsh" ? `${pick(Z.von)} ${basis}` : `${basis} ${pick(Z.von)}`;
  if (Z.vorH && r() < 0.4) return `${pick(mann ? Z.vorH : Z.vorS)} ${basis}`;
  return basis;
}
