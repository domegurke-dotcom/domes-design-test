// =====================================================================
//  Pferde-Generator: Rassen, Fellfarben und SVG-Zeichnung
//  Einheiten: Widerristhöhe = 100, Boden bei y = 0, Pferd schaut nach links
// =====================================================================

// ---------- Fellfarben ----------
const FARBEN_BASIS = {
  schimmel:      { name: "Schimmel (weiß)",        body: "#f3f1ed", mane: "#e2ddd3", muzzle: "#6f6a6a", hoof: "#8a8580" },
  grauschimmel:  { name: "Rappschimmel",           body: "#6f6c6a", mane: "#2a2726", points: "#2f2c2b", head: "#4e4b49", muzzle: "#2f2b2b", pattern: "roan", hoof: "#2c2a29" },
  braunschimmel: { name: "Braunschimmel",          body: "#a2887a", mane: "#3a302c", points: "#4a3d36", head: "#b4a196", muzzle: "#3a302c", pattern: "roan", hoof: "#3a3230" },
  fuchsschimmel: { name: "Fuchsschimmel",          body: "#c9a48e", mane: "#b98a6c", head: "#d6bcab", muzzle: "#6f5a50", pattern: "roan", hoof: "#6a5246" },
  fliegenschimmel: { name: "Fliegenschimmel",      body: "#eeebe5", mane: "#d6d0c6", muzzle: "#6f6a6a", hoof: "#8a8580", pattern: "fleck", fleck: "#8b5a3e" },
  apfelschimmel: { name: "Apfelschimmel",          body: "#b9b9b6", mane: "#626262", points: "#666666", head: "#aaaaa7", muzzle: "#4a4646", pattern: "dapple", dapple: "#e6e6e3", hoof: "#474442" },
  rappe:         { name: "Rappe (schwarz)",        body: "#211e1f", mane: "#121011", hoof: "#2c2a29" },
  brauner:       { name: "Brauner",                body: "#7c3f1d", mane: "#161212", points: "#1b1616", hoof: "#2c2a29" },
  dunkelbrauner: { name: "Dunkelbrauner",          body: "#402419", mane: "#120f0f", points: "#161212", hoof: "#2c2a29" },
  fuchs:         { name: "Fuchs",                  body: "#b65a29", mane: "#a64c22", hoof: "#4a3a30" },
  hellfuchs:     { name: "Fuchs mit Flachsmähne",  body: "#c98843", mane: "#f3e6c2", hoof: "#4a3a30" },
  dunkelfuchs:   { name: "Dunkelfuchs mit Flachsmähne", body: "#8f4a24", mane: "#eadbb0", hoof: "#3c3029" },
  palomino:      { name: "Palomino",               body: "#dcb164", mane: "#f6eed6", hoof: "#6b5a48" },
  isabell:       { name: "Isabell (Cremello)",     body: "#efe4cc", mane: "#f7f1e3", muzzle: "#d8a699", hoof: "#b9a88f" },
  buckskin:      { name: "Buckskin",               body: "#c9a064", mane: "#171313", points: "#1d1818", hoof: "#2c2a29" },
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
  schwarzbrauner:{ name: "Schwarzbrauner",         body: "#2a1d18", mane: "#100d0d", points: "#141010", head: "#3a2a22", muzzle: "#8a5a3a", hoof: "#2c2a29" },
  lethalwhite:   { name: "Weiß (Lethal White)",    body: "#f7f3ee", mane: "#f3eee6", muzzle: "#e3b5ae", hoof: "#cdbfa8" },
};
// Scheckungen, die auf jeder Grundfarbe vorkommen: Kürzel + "_" + Grundfarbe (z. B. "ov_brauner")
//  ov Overo · tv Tovero · tg Tigerschecke · fs Wenigpunkt-Tiger · sb Schabrackentiger · sk Schabracke ohne Punkte (Snowcap)
const MUSTER = {
  ov: ["Overo", "overo"], tv: ["Tovero", "tovero"], tg: ["Tigerschecke", "leopard"], fs: ["Wenigpunkt-Tiger", "fewspot"], sb: ["Schabrackentiger", "blanket"], sk: ["Schabracke ohne Punkte", "snowcap"],
};
function musterFarbe(id, t) {
  const m = /^(ov|tv|tg|fs|sb|sk)_(.+)$/.exec(id); if (!m || !t[m[2]]) return null;
  const B = t[m[2]], [name, pattern] = MUSTER[m[1]], e = { ...B, pattern, name: `${name} (${B.name.replace(/ \(.*\)$/, "")})` };
  delete e.stripe;
  if (pattern === "tovero" || pattern === "fewspot") { e.head = mix(B.head || B.body, "#f7f5f1", pattern === "fewspot" ? .75 : .2); e.hoof = "#b8a88f"; }
  if (pattern === "leopard") { e.head = mix(B.head || B.body, "#f7f5f1", .45); e.hoof = "#b8a88f"; }
  if (pattern === "tovero" || pattern === "fewspot" || pattern === "leopard") e.muzzle = "#c9a49a";
  return e;
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
    farben: ["schimmel", "fliegenschimmel", "fuchs", "brauner", "rappe"],
    k: { len: .96, depth: .42, legT: .072, neck: .56, nAng: 54, crest: .03, head: .35, hAng: 52, profile: -1, hw: .92, jw: 1.2, muz: .8, ear: .09, mane: "lang", maneLen: .13, vol: .6, fore: .5, tail: .62, tvol: .7, tset: 1, feather: 0, croup: 0, hq: 1, eye: 1.3 } },
  { id: "friese", name: "Friese", herkunft: "Niederlande", h: [158, 172],
    text: "Barockes Rappenpferd mit hoch aufgesetztem Hals, üppiger Mähne und langem Kötenbehang.",
    farben: ["rappe"],
    k: { nk: 1, len: 1.0, depth: .47, legT: .095, neck: .6, nAng: 64, crest: .08, head: .44, hAng: 62, profile: .1, hw: 1, jw: 1, muz: 1, ear: .11, mane: "lang", maneLen: .38, vol: 1.1, fore: 1, tail: .95, tvol: 1.2, tset: .1, feather: .75, croup: .5, hq: 1, eye: 1 } },
  { id: "marwari", name: "Marwari", herkunft: "Indien (Rajasthan)", h: [145, 163],
    text: "Kriegspferd der Rajputen – berühmt für die nach innen gebogenen Ohren, deren Spitzen sich berühren.",
    farben: ["brauner", "fuchs", "schimmel", "braunfalbe", "braunschecke"],
    k: { nk: 0.3, len: 1.0, depth: .41, legT: .075, neck: .56, nAng: 58, crest: .04, head: .42, hAng: 55, profile: .3, hw: .95, jw: 1, muz: .9, ear: .115, curl: true, mane: "lang", maneLen: .12, vol: .6, fore: .4, tail: .7, tvol: .8, tset: .5, feather: 0, croup: .3, hq: 1, eye: 1.1 } },
  { id: "fjord", name: "Fjordpferd (Norweger)", herkunft: "Norwegen", h: [135, 150],
    text: "Kompaktes Falbpferd mit Aalstrich und typisch gestutzter Stehmähne mit dunklem Mittelstreifen.",
    farben: ["braunfalbe", "rotfalbe", "mausfalbe", "weissfalbe", "gelbfalbe"],
    k: { nk: 1, len: .98, depth: .52, legT: .1, neck: .45, nAng: 48, crest: .08, head: .44, hAng: 50, profile: 0, hw: 1.1, jw: 1.1, muz: 1, ear: .085, mane: "fjord", maneLen: 0, vol: 1, fore: .5, tail: .75, tvol: 1, tset: .2, feather: .15, croup: .5, hq: 1.05, eye: 1 } },
  { id: "haflinger", name: "Haflinger", herkunft: "Südtirol / Österreich", h: [138, 150],
    text: "Kräftiges Gebirgspferd, immer fuchsfarben mit heller Flachsmähne.",
    farben: ["hellfuchs", "dunkelfuchs"],
    k: { nk: 0.8, len: 1.0, depth: .5, legT: .095, neck: .48, nAng: 50, crest: .06, head: .42, hAng: 52, profile: 0, hw: 1.05, jw: 1.05, muz: 1, ear: .09, mane: "lang", maneLen: .2, vol: .9, fore: .8, tail: .8, tvol: 1, tset: .3, feather: .1, croup: .6, hq: 1.05, eye: 1 } },
  { id: "shetty", name: "Shetlandpony", herkunft: "Shetlandinseln (Schottland)", h: [80, 107],
    text: "Kleines, robustes Pony mit kurzen Beinen, dichtem Fell, üppiger Mähne und großem Kopf im Verhältnis.",
    farben: ["rappe", "brauner", "fuchs", "schimmel", "windfarben", "rappschecke", "braunschecke"],
    k: { nk: 1, kb: 0.04, kw: 6, ts: 0.56, len: .98, depth: .56, legT: .12, neck: .38, nAng: 45, crest: .06, head: .47, hAng: 52, profile: 0, hw: 1.1, jw: 1.1, muz: 1, ear: .08, mane: "lang", maneLen: .28, vol: 1.3, fore: 1.2, tail: .9, tvol: 1.3, tset: .2, feather: .2, croup: .5, hq: 1, eye: 1.05 } },
  { id: "shire", name: "Shire Horse", herkunft: "England", h: [168, 190],
    text: "Eines der größten Pferde der Welt: massiger Kaltblüter mit Ramsnase und langem Fesselbehang.",
    farben: ["rappe", "brauner", "dunkelbrauner", "schimmel"],
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
    farben: ["brauner", "dunkelbrauner", "fuchs", "rappe", "schimmel"],
    k: { len: 1.02, depth: .41, legT: .075, neck: .6, nAng: 45, crest: .02, head: .42, hAng: 50, profile: 0, hw: .92, jw: 1, muz: .9, ear: .1, mane: "kurz", maneLen: .05, vol: .6, fore: .3, tail: .6, tvol: .6, tset: .3, feather: 0, croup: .3, hq: 1, eye: 1.05 } },
  { id: "quarter", name: "Quarter Horse", herkunft: "USA", h: [142, 163],
    text: "Muskulöses Westernpferd mit kurzem Kopf, großen Ganaschen und extrem kräftiger Hinterhand.",
    farben: ["fuchs", "brauner", "rappe", "palomino", "buckskin", "braunfalbe", "mausfalbe", "blueroan", "rotschimmel", "ov_brauner"],
    warnung: "In dieser Rasse kommt das Overo-Gen (Frame Overo) vor. Werden zwei Overo-Träger verpaart, ist jedes vierte Fohlen ein Lethal-White-Fohlen (O/O): Ihm fehlen Nervenzellen im Darm, es bekommt schwere Koliken und stirbt in den ersten Lebenstagen. Vor der Zucht mit einem Overo den Partner per Gentest prüfen!",
    k: { nk: 0.7, len: .96, depth: .47, legT: .09, neck: .5, nAng: 54, crest: .05, head: .42, hAng: 56, profile: 0, hw: 1.08, jw: 1.06, muz: .95, ear: .085, mane: "kurz", maneLen: .06, vol: .8, fore: .3, tail: .65, tvol: .8, tset: .1, feather: 0, croup: .5, hq: 1.2, eye: 1 } },
  { id: "hannoveraner", name: "Hannoveraner", herkunft: "Deutschland", h: [160, 175],
    text: "Großrahmiges Warmblut für Dressur und Springen – langer Hals, gerader Kopf, viel Rahmen.",
    farben: ["brauner", "dunkelbrauner", "fuchs", "rappe", "schimmel"],
    k: { nk: 0.4, len: 1.03, depth: .45, legT: .09, neck: .6, nAng: 52, crest: .05, head: .44, hAng: 55, profile: 0, hw: 1, jw: 1, muz: 1, ear: .1, mane: "kurz", maneLen: .05, vol: .7, fore: .3, tail: .65, tvol: .8, tset: .3, feather: 0, croup: .4, hq: 1, eye: 1 } },
  { id: "isi", name: "Islandpferd", herkunft: "Island", h: [130, 145],
    text: "Robustes Gangpferd (Tölt!) mit dichter Doppelmähne und fast allen Farben der Pferdewelt.",
    farben: ["fuchs", "brauner", "rappe", "schimmel", "braunfalbe", "mausfalbe", "palomino", "windfarben", "isabell", "fuchsschecke", "braunschecke"],
    k: { nk: 0.7, len: 1.0, depth: .53, legT: .1, neck: .45, nAng: 50, crest: .06, head: .44, hAng: 52, profile: 0, hw: 1.05, jw: 1.05, muz: 1, ear: .08, mane: "lang", maneLen: .25, vol: 1.3, fore: 1.1, tail: .9, tvol: 1.3, tset: .2, feather: .15, croup: .6, hq: 1, eye: 1 } },
  { id: "tinker", name: "Tinker (Irish Cob)", herkunft: "Irland / Großbritannien", h: [135, 160],
    text: "Kräftiger Cob, meist gescheckt, mit langer Mähne, Bart und üppigem Fesselbehang.",
    farben: ["rappschecke", "braunschecke", "fuchsschecke", "rappe"],
    k: { nk: 1, len: 1.02, depth: .52, legT: .115, neck: .5, nAng: 52, crest: .1, head: .46, hAng: 55, profile: .4, hw: 1.1, jw: 1, muz: 1.05, ear: .09, mane: "lang", maneLen: .3, vol: 1.3, fore: 1.1, tail: .9, tvol: 1.3, tset: .15, feather: 1, croup: .7, hq: 1.05, eye: 1 } },
  { id: "tekke", name: "Achal-Tekkiner", herkunft: "Turkmenistan", h: [147, 163],
    text: "Schlankes Wüstenpferd mit langem Hals, feiner, kurzer Mähne und einzigartigem metallischem Fellglanz.",
    farben: ["isabell", "palomino", "buckskin", "brauner", "fuchs", "rappe", "schimmel"],
    k: { len: 1.06, depth: .41, legT: .07, neck: .56, nAng: 56, crest: .02, head: .41, hAng: 54, profile: -.1, hw: .92, jw: 1, muz: .92, ear: .11, earDx: -1.6, mane: "kurz", maneLen: .03, vol: .4, fore: .15, tail: .55, tvol: .45, tset: .4, feather: 0, croup: .3, hq: .95, eye: 1.1, metallic: true } },
];

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
function zeichnePferd(rasseId, farbId, opt = {}) {
  // Körpertyp: duenn | sportlich | normal | dick
  const typ = opt.typ || "normal";
  const TYP = { duenn: { bauch: -1, hq: 0.88, crest: -0.03, legT: 0.94 }, sportlich: { bauch: -0.45, hq: 1.07, crest: 0.025, legT: 1 }, normal: { bauch: 0, hq: 1, crest: 0, legT: 1 }, dick: { bauch: 1, hq: 1.12, crest: 0.07, legT: 1.04 } }[typ] || { bauch: 0, hq: 1, crest: 0, legT: 1 };
  const R = rasseById(rasseId), stufe = opt.alterStufe || null, kBasis = { ...R.k, ...ALTERS_K(stufe, R.k), ...(opt.k || {}) };
  const k = { ...kBasis, hq: (kBasis.hq || 1) * TYP.hq, crest: kBasis.crest + TYP.crest, legT: kBasis.legT * TYP.legT, nk: Math.max(kBasis.nk || 0, typ === "dick" ? 0.7 : 0) }, C = FARBEN[farbId] || FARBEN.schimmel;
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
  const body = C.body, mane = C.mane, head = C.head || body;
  const pts = C.points || null;
  const hoof = C.pattern === "tobiano" ? "#b8a88f" : (C.hoof || "#3b3531");
  const SW = "#f7f5f1", spotFarbe = C.spot || mix(body, pts || body, .35);
  const dunkel = c => mix(c, "#1b1530", 0.25);
  const INK = "#261a14";
  const linie = INK, manLinie = INK;
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
  const tailCol = dunKern ? dunHell : (k.mane === "fjord" ? mix(maneOuter, maneStripe, 0.25) : mane);
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
  const ekWahl = opt.eigenKopf === false ? null : (opt.eigenKopf || RASSE_KOPF[rasseId]);
  const kopfAlter = stufe && typeof KOPFTEILE_ALTER !== "undefined" && KOPFTEILE_ALTER[stufe] ? stufe : null;
  const KOPF = () => kopfAlter ? KOPFTEILE_ALTER[kopfAlter] : KOPFTEILE;
  // kürzerer Kopf (Fohlen …): Nase entsprechend näher am Genick
  const nasenPunkt = A => { const Z = hp(0.97, 0.0); if (!kopfAlter) return Z; const K0 = KOPFTEILE, K1 = KOPF();
    const r = Math.hypot(K1.nase.x - K1.genick.x, K1.nase.y - K1.genick.y) / Math.hypot(K0.nase.x - K0.genick.x, K0.nase.y - K0.genick.y); return add(A, mul(sub(Z, A), r)); };
  const eigenKopf = ekWahl && typeof KOPFTEILE !== "undefined" ? ekWahl : null;
  let ekMatrix = null;
  const ohrenHaengen = haltung === "tief" || liegt;
  const ohrenGeknickt = !ohrenHaengen && opt.ohren === "geknickt";
  const gl = w * 1.5;                       // Höhe der untergeschlagenen Beine beim Liegen
  const dLiegen = liegt ? Lg - gl : 0;      // so weit sinkt der Körper beim Liegen ab
  let a0 = (k.nAng - 20) * Math.PI / 180;
  const N = k.neck * H * 1.1 * ({ waagerecht: 1.6, tief: 2.2, liegend: 2.2 }[haltung] ? 1 + Math.max(0, 0.56 - k.neck) * { waagerecht: 1.6, tief: 2.2, liegend: 2.2 }[haltung] : 1);
  const hl = k.head * H;
  const th0 = k.hAng * Math.PI / 180;
  const th = th0 + ({ normal: 0, leicht: 8, waagerecht: 12, tief: 16, liegend: 16 }[haltung] || 0) * Math.PI / 180;
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
  const zielY = { leicht: leichtY, waagerecht: bugY, tief: bugY + 0.5 * (-hh - 3 - bugY), liegend: -dLiegen - 2.5 }[haltung];
  let a = a0;
  if (zielY != null) {
    // Messpunkt: bei „waagerecht“ die Mitte des Nasenrückens, sonst das Maul
    const c = haltung === "waagerecht"
      ? (Math.sin(th) * 0.55 - Math.cos(th) * 0.045) * hl
      : (Math.sin(th) * 1.01 + Math.cos(th) * 0.14 * k.muz) * hl;
    a = Math.asin(Math.max(-0.97, Math.min(Math.sin(a0), (Wn.y + c - zielY) / N)));
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
  const T0 = hp(0.15, 0.5 * hw), kSp = (haltung === "normal" || haltung === "leicht") && k.ts ? 1 : 0, T1 = hp(0.46 + ((k.ts || 0.46) - 0.46) * kSp, (0.4 - 0.04 * kSp) * hw * Math.min(jw, 1.1));
  let T = P(T0.x + (T1.x - T0.x) * nk, T0.y + (T1.y - T0.y) * nk); const Pn = hp(-0.02, 0.04);
  const d = norm(P(Pn.x - Wn.x, Pn.y - Wn.y));
  const nOut = P(-d.y, d.x);
  const crestCtrl = add(mid(Wn, Pn), mul(nOut, crest * H + 4));
  // Handgezeichneter Kopf: Kehle setzt genau am Ende seiner Ganaschenlinie an
  let ekKehle = null;
  if (eigenKopf) {
    const K = KOPF(), A = add(Pn, mul(nOut, 1.2)), B = nasenPunkt(A);
    const ux = K.nase.x - K.genick.x, uy = K.nase.y - K.genick.y, vx = B.x - A.x, vy = B.y - A.y;
    const den = ux * ux + uy * uy, a_ = (vx * ux + vy * uy) / den, b_ = (vy * ux - vx * uy) / den;
    const e_ = A.x - (a_ * K.genick.x - b_ * K.genick.y), f_ = A.y - (b_ * K.genick.x + a_ * K.genick.y);
    const M = (x, y) => P(a_ * x - b_ * y + e_, b_ * x + a_ * y + f_), Mv = (x, y) => norm(P(a_ * x - b_ * y, b_ * x + a_ * y));
    T = M(K.kehle.x, K.kehle.y);
    ekKehle = true;
  }
  // Jungpferde mit Spielkopf: Kehle weiter vorn unter der Ganasche ansetzen – der Hals wird oben breiter
  if (!eigenKopf && stufe && ["fohlen", "jaehrling", "jungpferd"].includes(stufe)) T = hp(0.36, 0.44 * hw * Math.min(jw, 1.1));
  const underCtrl = add(mid(T, Cn), mul(nOut, 1));
  // Kehle: weicher, offener Übergang von der Ganasche in die Halsunterseite
  // weicher Bogen am Kopfansatz: die Linie läuft erst ein Stück an der Ganasche entlang nach hinten und biegt dann nach unten
  const kehle1 = add(add(add(T, mul(sub(Cn, T), 0.3 * (1 - nk))), mul(nOut, 10 * (1 - nk))), P((0.22 + ((k.kb != null ? k.kb : 0.22) - 0.22) * kSp) * hl * nk, 0.14 * hl * nk));
  const kehle2 = add(add(Cn, mul(sub(T, Cn), 0.35 + 0.1 * nk)), mul(nOut, 1.5 - (4 + (k.kw || 0) * kSp) * nk));
  const kehleLen = Math.hypot(Cn.x - T.x, Cn.y - T.y);
  // Jungpferde mit Spielkopf: weicher, gerader Kehlgang wie beim gezeichneten Kopf (sonst wirkt der Hals wie ein dünner Stiel)
  const sanft = ekKehle || (stufe && ["fohlen", "jaehrling", "jungpferd"].includes(stufe));
  const k1 = sanft ? add(add(T, mul(sub(Cn, T), 0.35)), mul(nOut, 0.06 * kehleLen)) : kehle1, k2 = sanft ? add(add(Cn, mul(sub(T, Cn), 0.35)), mul(nOut, 0.04 * kehleLen)) : kehle2;
  const halsD = `M${f(Wn.x)},${f(Wn.y)}Q${f(crestCtrl.x)},${f(crestCtrl.y)} ${f(Pn.x)},${f(Pn.y)}L${f(hp(0.06, 0.2).x)},${f(hp(0.06, 0.2).y)}L${f(T.x)},${f(T.y)}C${f(k1.x)},${f(k1.y)} ${f(k2.x)},${f(k2.y)} ${f(Cn.x)},${f(Cn.y)}L${f(0.35 * L)},${f(top + 0.6 * D)}Z`;
  const kamm = t => { const s = 1 - t; return P(s * s * Wn.x + 2 * s * t * crestCtrl.x + t * t * Pn.x, s * s * Wn.y + 2 * s * t * crestCtrl.y + t * t * Pn.y); };

  // --- Beine ---
  const vorder = xc => [
    P(xc - 1.0 * w, bottom - 12), P(xc - 1.2 * w, bottom + 1), P(xc - 1.15 * w, -0.74 * Lg), P(xc - 0.9 * w, -0.6 * Lg), P(xc - 0.8 * w, -0.51 * Lg),
    P(xc - 0.92 * w, -0.46 * Lg), P(xc - 0.5 * w, -0.39 * Lg), P(xc - 0.42 * w, -0.2 * Lg), P(xc - 0.72 * w, -0.1 * Lg), P(xc - 0.8 * w, -0.05 * Lg),
    P(xc - 0.9 * w, -hh + 0.5),
    P(xc + 0.4 * w, -hh + 0.5), P(xc + 0.92 * w, -0.08 * Lg), P(xc + 0.42 * w, -0.18 * Lg),
    P(xc + 0.45 * w, -0.36 * Lg), P(xc + 0.62 * w, -0.46 * Lg), P(xc + 0.72 * w, -0.52 * Lg), P(xc + 0.68 * w, -0.64 * Lg),
    P(xc + 1.05 * w, bottom + 1), P(xc + 1.7 * w, bottom - 3), P(xc + 1.4 * w, bottom - 12),
  ];
  const hinter = hx => [
    P(0.7 * L, bottom - 12), P(0.79 * L, bottom + 0.015 * H), P(hx - 0.25 * w, -0.72 * Lg), P(hx - 0.35 * w, -0.62 * Lg),
    P(hx - 0.7 * w, -0.53 * Lg), P(hx - 0.45 * w, -0.41 * Lg), P(hx - 0.42 * w, -0.2 * Lg), P(hx - 0.72 * w, -0.1 * Lg),
    P(hx - 0.9 * w, -hh + 0.5),
    P(hx + 0.4 * w, -hh + 0.5), P(hx + 0.92 * w, -0.08 * Lg), P(hx + 0.42 * w, -0.18 * Lg),
    P(hx + 0.5 * w, -0.44 * Lg), P(hx + 1.15 * w, -0.57 * Lg), P(hx + 1.0 * w, -0.66 * Lg), P(hx + 1.45 * w + hq, -0.8 * Lg),
    P(L + 0.005 * H * hq, bottom - 0.05 * D), P(L + 0.035 * H * hq, top + 0.62 * D), P(hx, top + 0.45 * D),
  ];
  const huf = xc => [P(xc - 0.9 * w, -hh), P(xc + 0.42 * w, -hh), P(xc + 0.62 * w, 0), P(xc - 1.2 * w, 0)];
  const behang = xc => {
    return null; // Kötenbehang vorerst bei allen Pferden ausgeblendet
    const tp = -(0.08 + 0.24 * fl) * Lg;
    return [P(xc + 0.5 * w, tp), P(xc + 0.8 * w + 2 * fl, -0.12 * Lg), P(xc + 1.0 * w + 5.5 * fl, 0), P(xc + 0.4 * w + 2 * fl, -2),
      P(xc + 0.1 * w, 0.8), P(xc - 0.4 * w, -1.2), P(xc - 0.8 * w, 0.8), P(xc - 1.05 * w - 1.2 * fl, 0.6), P(xc - 0.9 * w - 0.6 * fl, -0.06 * Lg), P(xc - 0.6 * w, tp * 0.85)];
  };
  const fx = 0.12 * L, fx2 = 0.2 * L, hx = 0.87 * L, hx2 = 0.8 * L;
  if (!liegt) merke([P(fx - 1.2 * w, 0), P(hx + 1.2 * w, 0)]);

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
  const fl = ohneSchopf ? 0 : !schopfL ? k.fore : mstil === "fjord" ? Math.max(k.fore, 0.5) : schopfL === naturS ? k.fore : ({ kurz: 0.35, mittel: 0.6, lang: 0.85, extralang: 1.15 })[schopfL];
  const schopf = mstil === "fjord"
    ? [hp(-0.04, -0.04), hp(-0.02, -0.16), hp(0.06, -0.12), hp(0.1, -0.02), hp(0.05, 0.05)]
    : null;
  // Schopf: wächst am Genick zwischen den Ohren und fällt über die Stirn nach unten,
  // liegt dabei an der Stirnlinie an (Kopf-Koordinaten: s entlang des Gesichts, b quer dazu)
  const schopfBueschel = () => {
    const l = 0.16 + 0.22 * fl;
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
    const l = 0.16 + 0.22 * fl;
    return [[hp(-0.05, -0.035), hp(0.0 + l * 0.8, -0.045)], [hp(-0.05, 0.04), hp(0.0 + l * 0.75, 0.015)], [hp(-0.05, 0.1), hp(-0.02 + l * 0.55, 0.075)]]
      .map(([a, b]) => { const m = mid(a, b), r = sub(hp(0, -0.015), hp(0, 0)); return inkFein(`M${f(a.x)},${f(a.y)}Q${f(m.x + r.x)},${f(m.y + r.y)} ${f(b.x)},${f(b.y)}`, 0.9, 'opacity=".45"'); }).join("");
  };

  // --- Details ---
  const auge = hp(0.3, 0.11), er = 0.048 * hl * (k.eye || 1);
  const nuester = hp(0.9, 0.1);
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
  if (C.pattern === "fleck") defs += `<pattern id="fk-${uid}" patternUnits="userSpaceOnUse" width="6" height="5.5"><circle cx="1" cy="1.2" r=".42" fill="${C.fleck}"/><circle cx="3.9" cy="2.6" r=".36" fill="${C.fleck}"/><circle cx="2.2" cy="4.3" r=".3" fill="${C.fleck}"/><circle cx="5.3" cy="4.9" r=".4" fill="${C.fleck}"/><circle cx="4.6" cy=".5" r=".28" fill="${C.fleck}"/></pattern>`;
  if (C.pattern === "roan") defs += `<radialGradient id="rg-${uid}"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<pattern id="rn-${uid}" patternUnits="userSpaceOnUse" width="3" height="3"><circle cx="1" cy="1" r=".85" fill="url(#rg-${uid})"/><circle cx="2.4" cy="2.2" r=".7" fill="url(#rg-${uid})"/></pattern>`;
  if (k.metallic) defs += `<linearGradient id="mt-${uid}" gradientUnits="userSpaceOnUse" x1="${f(-0.1 * L)}" y1="${f(-H * 1.3)}" x2="${f(L)}" y2="0"><stop offset=".15" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".38"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity=".22"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/></linearGradient>`;

  const bx = `x="${f(minX - 5)}" y="${f(minY - 5)}" width="${f(maxX - minX + 10)}" height="${f(-minY + 10)}"`;
  if (C.pattern === "dapple" || C.pattern === "roan" || C.pattern === "fleck") defs += `<mask id="mk-${uid}" maskUnits="userSpaceOnUse" ${bx}><g filter="url(#wm6-${uid})"><path d="${halsD}" fill="#fff"/><path d="${glatt(rumpf)}" fill="#fff" transform="translate(0,-3)"/></g></mask><filter id="wm6-${uid}" filterUnits="userSpaceOnUse" ${bx}><feGaussianBlur stdDeviation="5"/></filter>`;
  defs += `<filter id="wm-${uid}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3"/></filter>`;
  defs += `<filter id="wb-${uid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>`;
  let g = `<defs>${defs}</defs>`;

  // Hintere Beine
  g += `<g>${umriss(fern, INK)}`;
  if (C.pattern === "tobiano") g += `<rect x="${f(minX)}" y="${f(-0.68 * Lg)}" width="${f(maxX - minX)}" height="${f(0.68 * Lg + 2)}" fill="#dedad3" clip-path="url(#cf-${uid})" filter="url(#wm-${uid})"/>`;
  if (["tovero", "leopard", "fewspot"].includes(C.pattern)) {
    g += `<g clip-path="url(#cf-${uid})"><rect x="${f(minX)}" y="${f(-Lg - 6)}" width="${f(maxX - minX)}" height="${f(Lg + 8)}" fill="#dedad3"/>`;
    if (C.pattern === "leopard") for (let i = 0; i < 9; i++) g += `<ellipse cx="${f(minX + rnd() * (maxX - minX))}" cy="${f(-rnd() * Lg)}" rx="${f(1.6 + rnd() * 1.8)}" ry="${f(1.4 + rnd() * 1.5)}" fill="${dunkel(spotFarbe)}"/>`;
    g += `</g>`;
  }
  g += `<g stroke="${INK}" stroke-width="1.6" vector-effect="non-scaling-stroke">` +
    (liegt ? [] : [huf(fx2), huf(hx2)]).map(h => `<path d="${eckig(h)}" fill="${dunkel(hoof)}" vector-effect="non-scaling-stroke"/>`).join("") + "</g></g>";

  // Kopfbewegung (leichtes Nicken): Kopf-Gruppe
  const nick = `<animateTransform attributeName="transform" type="rotate" values="0 ${f(Pn.x)} ${f(Pn.y)};0 ${f(Pn.x)} ${f(Pn.y)};-3 ${f(Pn.x)} ${f(Pn.y)};0 ${f(Pn.x)} ${f(Pn.y)}" keyTimes="0;.8;.9;1" dur="6s" repeatCount="indefinite"/>`;

  // Fernes Ohr
  if (!eigenKopf) g += ohr(add(Eb, P(4.5, 0.5)), dunkel(head), true);

  // Hauptkörper
  g += `<g>${umriss(haupt, linie)}`;
  // Überlagerungen
  g += `<g clip-path="url(#cl-${uid})">`;
  if (C.pattern === "dapple") g += `<g clip-path="url(#cr-${uid})"><rect ${bx} fill="url(#dp-${uid})" mask="url(#mk-${uid})"/></g>`;
  if (C.pattern === "roan") g += `<g clip-path="url(#cr-${uid})"><rect ${bx} fill="url(#rn-${uid})" mask="url(#mk-${uid})"/></g>`;
  if (C.pattern === "fleck") g += `<g clip-path="url(#cl-${uid})"><rect ${bx} fill="url(#fk-${uid})" opacity=".8"/></g>`;
  if (C.pattern === "tobiano") {
    const flecken = [];
    const blob = (cx, cy, rx, ry, n = 13) => {
      const ps = [];
      for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2, r = 0.72 + rnd() * 0.5; ps.push(P(cx + Math.cos(an) * rx * r, cy + Math.sin(an) * ry * r)); }
      return glatt(ps);
    };
    flecken.push(blob(0.45 * L + (rnd() - .5) * 0.15 * L, top + 0.15 * D, 0.2 * L + rnd() * 0.1 * L, 0.75 * D));
    if (rnd() > 0.3) flecken.push(blob(0.1 * L, -H - 8, 0.12 * L, 0.35 * D + 6));
    if (rnd() > 0.35) flecken.push(blob(0.86 * L, top + 0.3 * D, 0.1 * L + rnd() * 0.08 * L, 0.45 * D));
    g += `<g filter="url(#wm-${uid})">` + flecken.map(fd => `<path d="${fd}" fill="#f7f5f1"/>`).join("");
    const wl = [P(minX, 2)];
    for (let x = minX; x <= maxX; x += 6) wl.push(P(x, -(0.66 + 0.1 * Math.sin(x * 0.21) + rnd() * 0.06) * Lg));
    wl.push(P(maxX, 2));
    g += `<path d="${eckig(wl)}" fill="#f7f5f1"/></g>`;
  }
  // Overo, Tovero, Tiger: Flecken / Punkte
  if (["overo", "tovero", "leopard", "fewspot", "blanket", "snowcap"].includes(C.pattern)) {
    const zack = (cx, cy, rx, ry, n = 20, var_ = .55) => { const ps = []; for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2, r = 0.7 + rnd() * var_; ps.push(P(cx + Math.cos(an) * rx * r, cy + Math.sin(an) * ry * r)); } return ps; };
    const punkte = (x0, x1, y0, y1, n, r0, r1, farbe) => { let s = ""; for (let i = 0; i < n; i++) { const r = r0 + rnd() * (r1 - r0); s += `<ellipse cx="${f(x0 + rnd() * (x1 - x0))}" cy="${f(y0 + rnd() * (y1 - y0))}" rx="${f(r)}" ry="${f(r * (.75 + rnd() * .35))}" fill="${farbe}"/>`; } return s; };
    if (C.pattern === "overo") {
      // waagerecht gezackte weiße Flecken an Seite und Hals – kreuzen nie den Rücken, Beine bleiben farbig
      const mx = 0.45 * L + (rnd() - .5) * 0.1 * L;
      let w = `<path d="${eckig(zack(mx - 0.08 * L, top + 0.64 * D, 0.15 * L, 0.24 * D, 26, .6))}" fill="${SW}"/><path d="${eckig(zack(mx + 0.09 * L, top + 0.56 * D + (rnd() - .5) * 4, 0.14 * L, 0.2 * D, 24, .6))}" fill="${SW}"/>`;
      w += `<path d="${eckig(zack(0.04 * L, top + 0.05 * D - 6, 0.09 * L, 0.3 * D, 16))}" fill="${SW}"/>`;
      if (rnd() > .4) w += `<path d="${eckig(zack(0.74 * L, top + 0.62 * D, 0.1 * L, 0.2 * D, 16))}" fill="${SW}"/>`;
      g += `<g filter="url(#wm-${uid})">${w}</g>`;
    }
    if (C.pattern === "tovero") {
      // fast ganz weiß – Farbe bleibt an Kopf/Ohren („Medicine Hat“), Brust und Flanke
      g += `<rect ${bx} fill="${SW}"/><g filter="url(#wm-${uid})"><path d="${glatt(zack(0.02 * L, top + 0.42 * D, 0.1 * L, 0.3 * D, 14, .4))}" fill="${body}"/>`;
      g += `<path d="${glatt(zack(0.93 * L, top + 0.3 * D, 0.11 * L, 0.32 * D, 14, .4))}" fill="${body}"/>`;
      if (rnd() > .5) g += `<path d="${glatt(zack(0.15 * L, -H - 4, 0.08 * L, 0.18 * D, 12, .4))}" fill="${body}"/>`;
      g += `</g>`;
    }
    if (C.pattern === "leopard") g += `<rect ${bx} fill="${SW}"/>` + punkte(minX, maxX, minY, 0, 70, 2.2, 4.6, spotFarbe);
    if (C.pattern === "fewspot") g += `<rect ${bx} fill="${SW}"/>` + punkte(0, L, top, bottom, 7, 1.4, 2.6, spotFarbe) + `<g filter="url(#wm-${uid})"><rect x="${f(minX)}" y="${f(-0.62 * Lg)}" width="${f(maxX - minX)}" height="${f(0.2 * Lg)}" fill="${mix(body, SW, .35)}" opacity=".7"/></g>`;
    if (C.pattern === "blanket" || C.pattern === "snowcap") {
      // weiße Decke über Kruppe und Hüfte
      const x0 = (C.pattern === "snowcap" ? 0.38 : 0.5) * L + (rnd() - .5) * 0.08 * L, rand = [];
      rand.push(P(L + 8, croupY - 8), P(x0, top - 6));
      for (let i = 0; i <= 8; i++) { const t = i / 8; rand.push(P(x0 + (L + 6 - x0) * t + (rnd() - .5) * 4, top + (0.35 + 0.25 * Math.sin(t * Math.PI) + rnd() * .12) * D)); }
      rand.push(P(L + 8, top + 0.75 * D));
      g += `<clipPath id="bl-${uid}"><path d="${glatt(rand)}"/></clipPath><g filter="url(#wm-${uid})"><path d="${glatt(rand)}" fill="${SW}"/></g>`;
      if (C.pattern === "blanket") g += `<g clip-path="url(#cr-${uid})"><g clip-path="url(#bl-${uid})">${punkte(x0, L + 8, top - 8, top + 0.75 * D, 26, 1.5, 3.1, spotFarbe)}</g></g>`;
    }
  }
  if (C.stripe) g += `<path d="${glatt([P(0.2 * L, -H + 0.5), P(0.42 * L, top + 2.5), P(0.62 * L, top + 1.6), P(0.82 * L, croupY), Tb], false)}" fill="none" stroke="${C.stripe}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>`;
  if (C.muzzle && !eigenKopf) g += `<ellipse cx="${f(hp(0.93, 0.12).x)}" cy="${f(hp(0.93, 0.12).y)}" rx="${f(0.13 * hl)}" ry="${f(0.1 * hl)}" transform="rotate(${f(90 - k.hAng)} ${f(hp(0.93, 0.12).x)} ${f(hp(0.93, 0.12).y)})" fill="${C.muzzle}" opacity=".8" filter="url(#wm-${uid})"/>`;
  // Abzeichen (weiß): Kopf und Beine
  const abz = opt.abzeichen || {};
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
  if (abz.beine && !liegt) {
    const hoehe = { krone: 0.05, fessel: 0.12, halbefessel: 0.085, halbstrumpf: 0.33, strumpf: 0.55, hochweiss: 0.75 }[abz.beine] || 0;
    const welle = [P(minX - 5, 2)];
    for (let x = minX - 5; x <= maxX + 5; x += 3) welle.push(P(x, -hoehe * Lg - hh - 1 + Math.sin(x * 0.7) * 0.8));
    welle.push(P(maxX + 5, 2));
    g += `<g clip-path="url(#cb-${uid})"><path d="${eckig(welle)}" fill="${WEISS}"/></g>`;
  }
  if (C.head && C.head !== body) g += `<g filter="url(#wm-${uid})"><path d="${glatt([hp(-0.1, -0.1), hp(-0.12, 0.3), add(T, mul(sub(Cn, T), 0.25)), add(Pn, mul(sub(Wn, Pn), 0.18)), hp(-0.1, -0.1)])}" fill="${C.head}" opacity=".85"/></g>`;
  if (k.metallic) g += `<rect ${bx} fill="url(#mt-${uid})"/>`;
  // Weiche Schattierung (Airbrush-Look): Schattenformen werden weichgezeichnet
  g += `<rect ${bx} fill="url(#sh-${uid})" opacity=".8"/><g filter="url(#wb-${uid})">`;
  g += `<g clip-path="url(#cr-${uid})"><path d="${glatt([P(-0.12 * H, top + 0.75 * D), P(0.15 * L, bottom - 0.2 * D), P(0.4 * L, bottom - 0.18 * D), P(0.65 * L, bottom - 0.3 * D), P(0.8 * L, bottom - 0.2 * D), P(L + 0.1 * H, top + 0.7 * D), P(L + 0.1 * H, 5), P(-0.12 * H, 5)])}" fill="${schatten}" opacity=".55"/></g>`;
  g += `<path d="${glatt([T, add(mid(T, Cn), mul(nOut, -2)), Cn, add(Cn, P(8, 6)), add(mid(T, Cn), mul(nOut, 5)), add(T, mul(nOut, 4))])}" fill="${schatten}" opacity=".45"/>`;
  if (!eigenKopf) g += `<path d="${glatt([hp(0.1, 0.42 * hw), hp(0.3, 0.47 * hw * jw), hp(0.55, 0.36 * hw), hp(0.8, 0.28 * hw), hp(0.6, 0.3 * hw), hp(0.35, 0.37 * hw * jw)])}" fill="${schatten}" opacity=".45"/>`;
  g += `<path d="${glatt([P(0.24 * L, -H + 3.5), P(0.42 * L, top + 5), P(0.62 * L, top + 4), P(0.8 * L, croupY + 3), P(0.8 * L, croupY + 6.5), P(0.62 * L, top + 7.5), P(0.42 * L, top + 8.5)], true)}" fill="${licht}" opacity=".7"/>`;
  g += `<ellipse cx="${f(0.1 * L)}" cy="${f(top + 0.3 * D)}" rx="${f(0.08 * L)}" ry="${f(0.2 * D)}" fill="${licht}" opacity=".35"/>`;
  g += `<ellipse cx="${f(0.84 * L)}" cy="${f(top + 0.28 * D)}" rx="${f(0.1 * L)}" ry="${f(0.22 * D)}" fill="${licht}" opacity=".35"/>`;
  g += `</g></g>`;
  // Comic-Detaillinien (Schulter, Ellbogen, Hüfte, Knie, Sprunggelenk, Ganasche)
  g += inkFein(`M${f(0.2 * L)},${f(-H + 7)}Q${f(0.16 * L)},${f(top + 0.62 * D)} ${f(0.02 * L)},${f(top + 0.82 * D)}`, 1.3, 'opacity=".7"');
  g += inkFein(`M${f(fx + 1.4 * w)},${f(bottom - 7)}Q${f(fx + 1.8 * w)},${f(bottom - 1)} ${f(fx + 1.3 * w)},${f(bottom + 3)}`, 1.2, 'opacity=".6"');
  g += inkFein(`M${f(0.7 * L)},${f(top + 0.22 * D)}Q${f(0.9 * L)},${f(top + 0.35 * D)} ${f(hx - 0.08 * L)},${f(bottom + 1)}`, 1.3, 'opacity=".7"');
  g += inkFein(`M${f(0.62 * L)},${f(bottom - 0.3 * D)}Q${f(0.66 * L)},${f(bottom - 0.12 * D)} ${f(0.63 * L)},${f(bottom - 2)}`, 1.1, 'opacity=".45"');
  if (!liegt) g += inkFein(`M${f(fx - 0.5 * w)},${f(-0.47 * Lg)}l${f(0.6 * w)},0`, 1.1, 'opacity=".55"');
  if (!liegt) g += inkFein(`M${f(hx + 0.3 * w)},${f(-0.54 * Lg)}l${f(0.6 * w)},${f(-1)}`, 1.1, 'opacity=".55"');
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
    (liegt ? [hufLiegend, hufLiegendH] : [huf(fx), huf(hx)]).map(h => `<path d="${eckig(h)}" fill="${hoof}" vector-effect="non-scaling-stroke"/>`).join("") + "</g>" +
    (liegt ? [] : [fx, hx]).map(xc => `<path d="M${f(xc - 0.55 * w)},${f(-hh + 1.2)}L${f(xc - 0.75 * w)},${f(-1.2)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`).join("");
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
    inkFein(tailStr(0, 0.88), 1.1, 'opacity=".55"') + inkFein(tailStr(2.5 + tv, 0.7), 1, 'opacity=".45"') +
    `<path d="${tailStr(-1.5, 0.6)}" fill="none" stroke="${mix(tailCol, "#ffffff", .45)}" stroke-width="1.6" stroke-linecap="round" opacity=".7" vector-effect="non-scaling-stroke"/></g>`;

  if (eigenKopf) {
    // Handgezeichneter Kopf: Stirn- und Nasenpunkt der Zeichnung auf den Spielkopf abbilden
    const K = KOPF(), A = add(Pn, mul(nOut, 1.2)), B = nasenPunkt(A);
    const ux = K.nase.x - K.genick.x, uy = K.nase.y - K.genick.y, vx = B.x - A.x, vy = B.y - A.y;
    const den = ux * ux + uy * uy, a_ = (vx * ux + vy * uy) / den, b_ = (vy * ux - vx * uy) / den;
    const e_ = A.x - (a_ * K.genick.x - b_ * K.genick.y), f_ = A.y - (b_ * K.genick.x + a_ * K.genick.y);
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
    const schatt = `<g transform="matrix(${[ia, ib, -ib, ia, ie, iff].map(x => x.toFixed(5)).join(" ")})">` +
      `<rect ${bx} fill="url(#sh-${uid})" opacity=".8"/>` +
      (C.muzzle ? `<ellipse cx="${f(mz.x)}" cy="${f(mz.y)}" rx="${f(0.13 * hl)}" ry="${f(0.1 * hl)}" transform="rotate(${f(90 - k.hAng)} ${f(mz.x)} ${f(mz.y)})" fill="${C.muzzle}" opacity=".8" filter="url(#wm-${uid})"/>` : "") +
      `<g filter="url(#wb-${uid})"><path d="${glatt([hp(0.1, 0.42 * hw), hp(0.3, 0.47 * hw * jw), hp(0.55, 0.36 * hw), hp(0.8, 0.28 * hw), hp(0.6, 0.3 * hw), hp(0.35, 0.37 * hw * jw)])}" fill="${schatten}" opacity=".45"/>` +
      `<ellipse cx="${f(hp(0.3, -0.1).x)}" cy="${f(hp(0.3, -0.1).y)}" rx="${f(0.22 * hl)}" ry="${f(0.07 * hl)}" transform="rotate(${f(90 - k.hAng)} ${f(hp(0.3, -0.1).x)} ${f(hp(0.3, -0.1).y)})" fill="${licht}" opacity=".45"/></g></g>`;
    g += `<g transform="matrix(${ekMatrix})">${kopfteileSVG(eigenKopf, "ek" + uid, { fell: head, muschel, ink: INK, statisch: opt.statisch, augenZu: opt.augenZu, schattierung: schatt, alter: kopfAlter })}</g>`;
  }
  // Mähne
  if (maehneD) g += `<path d="${maehneD}" fill="${maneOuter}" stroke="${INK}" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
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
    const sv = schopfL;
    if (sv && ekMatrix) g += `<g transform="matrix(${ekMatrix})">${schopfSVG(sv, dunKern ? dunHell : (mstil === "fjord" || k.mane === "fjord" ? maneOuter : mane), INK, false, dunKern, "sk" + uid, kopfAlter)}</g>`;
  } else {
  if (fl >= 0.25) g += `<path d="${schopf ? glatt(schopf) : schopfBueschel()}" fill="${mstil === "fjord" || k.mane === "fjord" ? maneOuter : mane}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
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
    const hoehe = { krone: 0.05, fessel: 0.12, halbefessel: 0.085, halbstrumpf: 0.33, strumpf: 0.55, hochweiss: 0.75 }[(opt.abzeichen || {}).beine] || 0;
    if (hoehe) { const wl = [P(fx - 3 * w, 2)]; for (let x = fx - 3 * w; x <= fx + 3 * w; x += 1.5) wl.push(P(x, -hoehe * Lg - hh - 1 + Math.sin(x * 0.7) * 0.8)); wl.push(P(fx + 3 * w, 2)); b += `<g clip-path="url(#cb-${uid})"><path d="${eckig(wl)}" fill="#fbfaf6"/></g>`; }
    b += `<path d="${eckig(huf(fx))}" fill="${hoof}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
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
// gang: Grundnoten Schritt/Trab/Galopp · toelt/pass: Wahrscheinlichkeit, dass die Gangart vorhanden ist
// char: Temperament, Mut, Wachheit, Menschenbezug, Arbeitswille, Nervenstärke (0–100)
// dress: Eignung für die Dressurausbildung (beeinflusst Schwung, Geraderichtung, Versammlung)
const PROFIL = {
  araber:       { gang: [7, 7, 7.5],   char: [80, 50, 85, 75, 70, 45], dress: .75 },
  friese:       { gang: [7.5, 8, 7],   char: [45, 60, 60, 80, 75, 65], dress: .85 },
  marwari:      { gang: [7, 6.5, 7.5], char: [70, 70, 80, 60, 70, 55], dress: .7, pass: .5, passName: "Pass (Revaal)" },
  fjord:        { gang: [7, 6.5, 6.5], char: [30, 70, 55, 80, 70, 85], dress: .65 },
  haflinger:    { gang: [7, 7, 6.5],   char: [45, 70, 65, 80, 70, 80], dress: .7 },
  shetty:       { gang: [6, 6.5, 6],   char: [55, 70, 80, 60, 40, 75], dress: .55 },
  shire:        { gang: [7, 6.5, 6],   char: [20, 75, 45, 85, 70, 90], dress: .5 },
  andalusier:   { gang: [7.5, 7.5, 7.5], char: [60, 65, 75, 80, 80, 65], dress: .95 },
  lipizzaner:   { gang: [7, 7.5, 7],   char: [55, 65, 75, 75, 85, 70], dress: 1 },
  vollblut:     { gang: [7, 7, 9],     char: [90, 55, 85, 60, 80, 35], dress: .7 },
  quarter:      { gang: [7, 6.5, 7.5], char: [35, 75, 65, 80, 80, 85], dress: .75 },
  hannoveraner: { gang: [8, 8, 8],     char: [60, 60, 70, 70, 80, 60], dress: 1 },
  isi:          { gang: [7, 6.5, 7],   char: [60, 70, 80, 75, 80, 75], dress: .7, toelt: 1, pass: .55 },
  tinker:       { gang: [6.5, 6.5, 6], char: [30, 70, 55, 85, 60, 85], dress: .6 },
  tekke:        { gang: [7.5, 7, 8.5], char: [85, 55, 85, 55, 75, 40], dress: .7 },
};

const CHARAKTER = [
  { key: "temperament", titel: "Temperament",    links: "ruhig",        rechts: "temperamentvoll" },
  { key: "mut",         titel: "Mut",            links: "scheu",        rechts: "mutig" },
  { key: "wachheit",    titel: "Wachheit",       links: "verträumt",    rechts: "aufgeweckt" },
  { key: "bezug",       titel: "Menschenbezug",  links: "eigenständig", rechts: "verschmust" },
  { key: "wille",       titel: "Arbeitswille",   links: "eigensinnig",  rechts: "leistungsbereit" },
  { key: "nerven",      titel: "Nervenstärke",   links: "nervös",       rechts: "gelassen" },
];
const AUSBILDUNG = ["Takt", "Losgelassenheit", "Anlehnung", "Schwung", "Geraderichtung", "Versammlung"];

function erzeugeWerte(pferd) {
  const pr = PROFIL[pferd.rasse] || PROFIL.hannoveraner;
  const r = zufall("werte-" + pferd.id + pferd.rasse);
  const gauss = () => (r() + r() + r() - 1.5) / 1.5; // ungefähr -1 … 1
  const note = b => Math.max(4, Math.min(10, Math.round((b + gauss() * 1.1) * 2) / 2));
  const gang = { schritt: note(pr.gang[0]), trab: note(pr.gang[1]), galopp: note(pr.gang[2]) };
  if (pr.toelt && r() < pr.toelt) gang.toelt = note(7.5);
  if (pr.pass && r() < pr.pass) gang.pass = note(6.5);
  const charakter = {};
  CHARAKTER.forEach((c, i) => charakter[c.key] = Math.round(Math.max(3, Math.min(97, pr.char[i] + gauss() * 22))));
  const reinOpt = [100, 100, 100, 100, 100, 93.75, 87.5, 75];
  return {
    reinrassig: reinOpt[Math.floor(r() * reinOpt.length)],
    gang, charakter,
    talent: Math.round((0.8 + r() * 0.4) * 100) / 100,
    streuung: AUSBILDUNG.map(() => Math.round(gauss() * 8)),
  };
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
  let vorher = 100;
  return AUSBILDUNG.map((name, i) => {
    let v = basis * (1.12 - i * 0.13) * Math.pow(pr.dress, i / 4) + (basis > 0 ? w.streuung[i] : 0);
    v = Math.max(0, Math.min(97, v));
    if (i > 0) v = Math.min(v, Math.max(0, (vorher - 20) / 80 * 100), vorher);
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

// Pflege-Startwerte: wann zuletzt Hufschmied, Impfung, Wurmkur und Zahnkontrolle waren (Tag-Nummern)
function erzeugePflege(pferd, heute) {
  const r = zufall("pflege-" + pferd.id);
  const t = heute || (typeof spiel !== "undefined" ? spiel.tag : 1) || 1;
  return {
    gesundheit: 100,
    huf: t - Math.floor(3 + r() * 30),
    impf: t - Math.floor(20 + r() * 150),
    wurm: t - Math.floor(5 + r() * 70),
    zahn: t - Math.floor(30 + r() * 300),
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
const KOPF_ALTER = { fohlen: "fohlen", jaehrling: "jaehrling", jungpferd: "jungpferd", reif: "reif", senior: "senior" };

// Gezeichnete Kopfform (Domes Zeichnungen) je Rasse – fehlt eine Rasse hier, bleibt der Spielkopf
const RASSE_KOPF = { araber: "hecht", friese: "gerade", fjord: "gerade", haflinger: "gerade", shetty: "gerade", vollblut: "gerade",
  quarter: "gerade", hannoveraner: "gerade", isi: "gerade", tekke: "gerade", shire: "rams", lipizzaner: "rams" };

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
const MAEHNE_WACHSTUM = 5; // alle 5 Tage wächst die Mähne eine Stufe

// =====================================================================
//  Genetik: Abstammung (Mutter, Muttersvater, Vater, Vatersvater) und Rassenanteile
// =====================================================================
const FREMDBLUT = {
  araber: "vollblut", friese: "andalusier", marwari: "araber", fjord: "haflinger", haflinger: "araber",
  shetty: "isi", shire: "tinker", andalusier: "araber", lipizzaner: "andalusier", vollblut: "araber",
  quarter: "vollblut", hannoveraner: "vollblut", isi: "fjord", tinker: "shire", tekke: "araber",
};
const NAMEN_STUTE = ["Bella", "Luna", "Fee", "Amira", "Freya", "Nala", "Zora", "Dana", "Aurora", "Wilma", "Rosalie", "Gräfin", "Melodie", "Primel", "Selma"];
const NAMEN_HENGST = ["Donnerhall", "Sturmwind", "Apollo", "Merlin", "Farid", "Orkan", "Picasso", "Zeus", "Gandalf", "Samir", "Titan", "Odin", "Rubin", "Falko", "Kaiser"];
function erzeugeAhnen(pferd) {
  const r = zufall("ahnen-" + pferd.id);
  const anteil = pferd.werte ? pferd.werte.reinrassig : 100;
  const fremd = 100 - anteil;          // Fremdblut-Anteil des Pferdes
  const fremdRasse = FREMDBLUT[pferd.rasse] || "vollblut";
  const name = (liste) => liste[Math.floor(r() * liste.length)];
  const vaterTraegt = r() < 0.5;       // welcher Elternteil bringt das Fremdblut mit
  const elternMix = Math.max(0, 100 - 2 * fremd);
  const vaterPct = vaterTraegt ? elternMix : 100, mutterPct = vaterTraegt ? 100 : elternMix;
  // Großvater: wer selbst gemischt ist, hat entweder einen reinrassigen oder einen fremdrassigen Vater
  const gv = (pct) => pct >= 100 ? { rasse: pferd.rasse, pct: 100 } : (pct >= 50 ? { rasse: pferd.rasse, pct: 100 } : { rasse: fremdRasse, pct: 100 });
  const vv = gv(vaterPct), mv = gv(mutterPct);
  return {
    fremdRasse,
    vater:   { name: name(NAMEN_HENGST), rasse: vaterPct > 0 ? pferd.rasse : fremdRasse, pct: vaterPct > 0 ? vaterPct : 100 },
    vatersvater: { name: name(NAMEN_HENGST), rasse: vv.rasse, pct: vv.pct },
    mutter:  { name: name(NAMEN_STUTE), rasse: mutterPct > 0 ? pferd.rasse : fremdRasse, pct: mutterPct > 0 ? mutterPct : 100 },
    muttersvater: { name: name(NAMEN_HENGST), rasse: mv.rasse, pct: mv.pct },
  };
}

const FARBBESCHREIBUNG = {
  schimmel: "Weißes Fell – Schimmel werden dunkel geboren und hellen mit dem Alter auf.",
  grauschimmel: "Rappe mit Schimmel-Gen auf dem Weg zum weißen Schimmel: immer mehr weiße Haare im schwarzen Fell.",
  braunschimmel: "Brauner mit Schimmel-Gen auf dem Weg zum weißen Schimmel – die schwarzen Beine und das Langhaar hellen mit auf.",
  fuchsschimmel: "Fuchs mit Schimmel-Gen: rötlich-graues Fell, wird mit den Jahren weiß. Nicht zu verwechseln mit dem Rotschimmel (Roan).",
  fliegenschimmel: "Spätphase mancher Schimmel: im weißen Fell erscheinen wieder kleine farbige Sprenkel – meist ab etwa 8–15 Jahren.",
  apfelschimmel: "Grauschimmel mit hellen, runden Flecken (Äpfeln) im Fell.",
  rappe: "Schwarzes Fell, schwarze Mähne und schwarzer Schweif. Sommerrappen bleiben das ganze Jahr tiefschwarz, Winterrappen bleichen im Sommer in der Sonne rostbraun aus und sind nur im Winterfell richtig schwarz.",
  brauner: "Braunes Fell mit schwarzer Mähne, schwarzem Schweif und dunklen Beinen.",
  dunkelbrauner: "Sehr dunkles Braun, wirkt fast schwarz.",
  fuchs: "Rotbraunes Fell, Mähne und Schweif gleichfarbig.",
  hellfuchs: "Fuchs mit heller Flachsmähne – typisch Haflinger.",
  dunkelfuchs: "Dunkler, schokoladiger Fuchs mit Flachsmähne.",
  palomino: "Goldgelbes Fell mit weißer Mähne (Fuchs + ein Cream-Gen).",
  isabell: "Cremefarben mit rosa Haut und blauen Augen (doppeltes Cream-Gen).",
  buckskin: "Gelbbraunes Fell mit schwarzen Beinen und schwarzer Mähne.",
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
  schwarzbrauner: "Fast schwarzer Brauner – erkennbar am helleren, rötlichen „Kupfermaul“ und an den Flanken (Agouti-Variante At).",
  lethalwhite: "Fast ganz weißes Fohlen mit rosa Haut von zwei Overo-Eltern (O/O). Ihm fehlen Nervenzellen im Darm – es stirbt in den ersten Lebenstagen (Lethal-White-Overo-Syndrom).",
  ov_brauner: "Overo (Frame): waagerecht gezackte weiße Flecken an Seite und Hals, die den Rücken nie kreuzen. Beine meist farbig, oft viel Weiß im Gesicht. Zwei Overo-Eltern können ein tödliches Lethal-White-Fohlen bekommen.",
  tv_fuchs: "Tovero: Tobiano und Overo zusammen – fast ganz weiß, Farbe meist nur noch an Ohren und Kopf („Medicine Hat“), an der Brust und an der Flanke.",
  tg_brauner: "Tigerschecke (Leopard): weißes Fell mit farbigen Punkten am ganzen Körper. Gen Lp mischerbig + Muster-Gen PATN1.",
  fs_rappe: "Wenigpunkt-Tiger (Fewspot): fast ganz weiß mit nur wenigen Punkten – reinerbiger Tiger (Lp/Lp). Lp/Lp-Pferde sind nachtblind (CSNB).",
  sb_rappe: "Schabrackentiger: weiße „Decke“ über Kruppe und Hüfte mit farbigen Punkten. Gen Lp ohne PATN1.",
  sk_brauner: "Schabracke ohne Punkte (Snowcap): weiße Decke ohne Punkte – reinerbiger Tiger (Lp/Lp) ohne PATN1. Lp/Lp-Pferde sind nachtblind (CSNB).",
  rotschimmel: "Roan auf Fuchs: schon bei der Geburt weiße Stichelhaare im roten Fell – ein unveränderlicher Schimmel, hellt nicht auf.",
};
// Scheckungs-Beispiele für das Lexikon
["ov_brauner", "tv_fuchs", "tg_brauner", "fs_rappe", "sb_rappe", "sk_brauner"].forEach(id => FARBEN[id]);
