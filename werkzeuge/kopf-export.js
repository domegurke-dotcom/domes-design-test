// Wandelt Domes „pferd kopf.svg“ in kopfneu.js um (Etappen von PLAN-KOEPFE.md).
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node werkzeuge/kopf-export.js
// Die SVG ist groß – sie wird nur im Browser ausgewertet, nie komplett gelesen.
// Kopfformen: fell = Fellfläche (ein Pfad, auch für clipPath), svg = alles übrige. Farben werden durch Platzhalter ersetzt: __FELL__ (#d9d9d9), __MUSCHEL__ (#f2f8ba), __MAEHNE__ (#31d2ff), __AAL__ (#f8baba)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.setContent(`<body>${fs.readFileSync(path.join(ROOT, "zeichnungen", "pferd-kopf.svg"), "utf8").replace(/<\?xml[^>]*>/, "")}</body>`);
  const K = await p.evaluate(() => {
    const svg = document.querySelector("svg"), LBL = "inkscape:label";
    const lab = e => e.getAttribute(LBL) || "";
    const alle = [...svg.querySelectorAll("*")];
    const finde = (l, inner) => (inner || svg).querySelector ? [...(inner || svg).querySelectorAll("*")].find(e => lab(e) === l) : null;
    const kinder = e => [...e.children];
    const r3 = s => s.replace(/-?\d*\.\d+(e-?\d+)?/g, x => { const v = +x; return Math.abs(v) < 5e-4 ? "0" : String(Math.round(v * 1000) / 1000); });
    const M = m => `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map(v => Math.round(v * 10000) / 10000).join(" ")})`;
    const farben = s => s.replace(/ style=""/g, "").replace(/#d9d9d9/gi, "__FELL__").replace(/#f2f8ba/gi, "__MUSCHEL__").replace(/#31d2ff/gi, "__MAEHNE__").replace(/#f8baba/gi, "__AAL__");
    // Element sauber serialisieren: ohne Inkscape-Attribute und ids, mit dem Transform des Elternteils (Weltkoordinaten der Datei)
    const ser = (e, ohne = []) => {
      const c = e.cloneNode(true);
      const putz = n => { if (n.nodeType !== 1) return; if (n.getAttribute("inkscape:groupmode") === "layer" && n.getAttribute("style")) n.setAttribute("style", n.getAttribute("style").replace(/display:none;?/g, ""));   // v465: in Inkscape ausgeblendete Ebenen (nur beim Zeichnen) trotzdem übernehmen
        for (const a of [...n.attributes]) if (/^(inkscape|sodipodi):/.test(a.name) || a.name === "id") n.removeAttribute(a.name);
        if (n.getAttribute("style")) n.setAttribute("style", n.getAttribute("style").replace(/display:inline;?/g, "").replace(/;$/, "")); [...n.childNodes].forEach(putz); };
      // Teile ausblenden, die eine spätere Etappe braucht (z. B. Kopfabzeichen)
      for (const l of ohne) [...c.querySelectorAll("*")].filter(n => (n.getAttribute(LBL) || "") === l).forEach(n => n.remove());
      [...c.querySelectorAll("text")].forEach(n => n.remove());
      [c, ...c.querySelectorAll("*")].filter(n => (n.getAttribute(LBL) || "") === "schopf-maehne-uebergang").forEach(n => n.setAttribute("class", "ueb"));   // v463: beim Tekkiner ausblendbar (kopfNeuSVG o.ohneUeb)
      putz(c);
      const pm = e.parentNode.getCTM();
      return farben(r3(`<g transform="${M(pm)}">${c.outerHTML.replace(/ xmlns(:\w+)?="[^"]*"/g, "")}</g>`));
    };
    // einzelner Pfad mit vollständigem Transform (für clipPath – dort sind keine Gruppen erlaubt)
    const pfad = e => farben(r3(`<path transform="${M(e.getCTM())}" style="${(e.getAttribute("style") || "").replace(/display:inline;?/g, "")}" d="${e.getAttribute("d")}"/>`));
    // Mittelpunkt eines Anschlusspunkts (Kreis) in Weltkoordinaten
    const punkt = g => { const c = g.querySelector("circle"), m = c.getCTM(); const x = +c.getAttribute("cx"), y = +c.getAttribute("cy"); return { x: Math.round((m.a * x + m.c * y + m.e) * 100) / 100, y: Math.round((m.b * x + m.d * y + m.f) * 100) / 100 }; };
    const out = { breite: 2050, hoehe: 1700, formen: {}, kap: {}, ohren: { basis: { R: {}, L: {} }, marwari: { R: {}, L: {} } }, schoepfe: {} };
    const ST = { leicht: 1, normal: 2, stark: 3 }, FAM = { hechtkopf: "hecht", ramsnase: "ramsnase", ramskopf: "rams", keilkopf: "keil", schafskopf: "schaf", schweinskopf: "schwein" };
    // Etappe 2: Kopfabzeichen und Maulfärbung je Kopfform – Verläufe/Filter kommen einmal in out.defs (ids mit Platzhalter __U__, je Pferd ersetzt)
    const ABZ = { "flocke": "flocke", "stern": "stern", "keilstern": "keilstern", "schnippe": "schnippe", "schmale blesse": "schmaleBlesse", "blesse": "blesse", "breite blesse": "breiteBlesse", "laterne": "laterne" };
    const MAUL = { "mehlmaul": "mehl", "kupfermaul": "kupfer", "graumaul": "dunkel", "dunkles maul": "dunkel" };   // „graumaul“ heißt im Spiel „dunkles Maul“ (Dome, v428)
    const defIds = new Map();
    const urls = s => [...(s || "").matchAll(/url\(#([^)]+)\)/g)].map(m => m[1]);
    const merkDef = id => { if (defIds.has(id)) return; const d = document.getElementById(id); if (!d) return; defIds.set(id, "__U__d" + defIds.size);
      for (const n of [d, ...d.querySelectorAll("*")]) { for (const a of n.attributes) urls(a.value).forEach(merkDef); const h = n.getAttribute("xlink:href") || n.getAttribute("href"); if (h && h[0] === "#") merkDef(h.slice(1)); } };
    // nur die eigene Gruppe der Form (manche Formen liegen in der Datei ineinander verschachtelt)
    const teil = (form, gruppe, name) => { const g = kinder(form).find(n => lab(n) === gruppe), el = g && kinder(g).find(n => lab(n) === name); if (!el) return null;
      for (const n of [el, ...el.querySelectorAll("*")]) for (const a of n.attributes) urls(a.value).forEach(merkDef);
      const st0 = el.getAttribute("style"); if (st0 && /display:none/.test(st0)) el.setAttribute("style", st0.replace(/display:none;?/g, ""));   // v465: Abzeichen/Maul werden einzeln gewählt – in Inkscape ausgeblendet ist egal
      const r = ser(el).replace(/#e5e5e5/gi, "__WEISS__"); if (st0 != null) el.setAttribute("style", st0); return r; };
    const zeichen = form => ({ abz: Object.fromEntries(Object.entries(ABZ).map(([l, k]) => [k, teil(form, "kopfabzeichen", l)]).filter(x => x[1])), maul: Object.fromEntries(Object.entries(MAUL).map(([l, k]) => [k, teil(form, "maulfärbung", l)]).filter(x => x[1])) });
    for (const e of alle) {
      const l = lab(e);
      const m = /^(hechtkopf|ramsnase|ramskopf|keilkopf|schafskopf|schweinskopf)-(leicht|normal|stark)$/.exec(l);
      if (m) out.formen[FAM[m[1]] + ST[m[2]]] = { kap: ["keil", "schaf", "schwein"].includes(FAM[m[1]]) ? FAM[m[1]] : "basis", svg: ser(e, ["maulfärbung", "kopfabzeichen", "fell"]), fell: pfad([...e.children].find(c => lab(c) === "fell")), ...zeichen(e) };
      if (l === "gerader kopf") out.formen.gerade = { kap: "basis", svg: ser(e, ["maulfärbung", "kopfabzeichen", "fell"]), fell: pfad([...e.children].find(c => lab(c) === "fell")), ...zeichen(e) };
      const k = /^(basiskopfform|keilkopf|schafskopf|schweinskopf)-kehleanschlusspunkt/.exec(l);
      if (k) out.kap[{ basiskopfform: "basis", keilkopf: "keil", schafskopf: "schaf", schweinskopf: "schwein" }[k[1]]] = punkt(e);
      if (/^genikanschlusspunkt/.test(l)) out.gap = punkt(e);
      if (/^schopfanschlusspunkt/.test(l) && e.parentNode && lab(e.parentNode) === "kopf") out.schap = punkt(e);
    }
    // Ohren: Reihenfolge der Datei (angelegt, hinten, seite, vorne)
    const OS = l => /angelegt/.test(l) ? "angelegt" : /hinten/.test(l) ? "hinten" : /seite/.test(l) ? "seite" : "vorne";
    for (const [ebene, art, seite] of [["marwarieohren rechts", "marwari", "R"], ["basisohren rechts", "basis", "R"], ["marwarieohren links", "marwari", "L"], ["basisohren links", "basis", "L"]]) {
      const g = alle.find(e => lab(e) === ebene);
      for (const o of kinder(g)) out.ohren[art][seite][OS(lab(o))] = ser(o);
      // Ohransatz (unten Mitte der Ebene in Weltkoordinaten) – um diesen Punkt wird das Ohr je Rasse größer/kleiner (v430)
      const r = g.getBoundingClientRect(), sv = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, sx = vb.width / sv.width, sy = vb.height / sv.height;
      (out.ohrBasis = out.ohrBasis || {})[art + seite] = { x: Math.round(((r.left + r.right) / 2 - sv.left) * sx + vb.x), y: Math.round((r.bottom - sv.top) * sy + vb.y) };
    }
    // Auge: blaues Auge (Etappe 2) erst einmal entfernen, Zusatz-Wimper für Stuten/Fohlen getrennt
    const auge = alle.find(e => lab(e) === "auge");
    const wimper = [...auge.querySelectorAll("*")].find(e => lab(e) === "stute + fohlen");
    out.wimper = ser(wimper);
    out.auge = ser(auge, ["stute + fohlen", "blaues auge"]);
    out.augeBlau = ser(auge, ["stute + fohlen", "braunes auge"]);
    const clip = document.getElementById("r15-ekp2-auge-3");
    out.augeClip = r3(clip.outerHTML.replace(/ xmlns(:\w+)?="[^"]*"/g, "").replace(/ id="path[^"]*"/, ""));
    // Augen-Mitte (für Blinzeln und Fohlenaugen)
    const iris = [...auge.querySelectorAll("*")].find(e => lab(e) === "braunes auge"), bb = iris.getBBox(), im = iris.getCTM();
    const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
    out.augeMitte = { x: Math.round((im.a * cx + im.c * cy + im.e) * 100) / 100, y: Math.round((im.b * cx + im.d * cy + im.f) * 100) / 100 };
    // Schöpfe
    for (const e of alle) { const m = /^schopf (kurz|mittel|lang|extralang)$/.exec(lab(e)); if (m) out.schoepfe[m[1]] = ser(e); }
    // Nasenpunkt: vorderster Punkt der Kontur des geraden Kopfs in Richtung Genick → Nüster
    const gk = alle.find(e => lab(e) === "gerader kopf"), kon = [...gk.children].find(e => lab(e) === "kontur"), nl = [...gk.children].find(e => lab(e) === "nasenloch");
    const welt = (el, x, y) => { const m = el.getCTM(); return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; };
    const nb = nl.getBBox(), nm = welt(nl, nb.x + nb.width / 2, nb.y + nb.height / 2);
    const dx = nm.x - out.gap.x, dy = nm.y - out.gap.y, dl = Math.hypot(dx, dy);
    let best = null; const len = kon.getTotalLength();
    for (let i = 0; i <= 600; i++) { const q = kon.getPointAtLength(len * i / 600), w = welt(kon, q.x, q.y), s = ((w.x - out.gap.x) * dx + (w.y - out.gap.y) * dy) / dl; if (!best || s > best.s) best = { ...w, s }; }
    out.nase = { x: Math.round(best.x * 100) / 100, y: Math.round(best.y * 100) / 100 };
    out.nuester = { x: Math.round(nm.x * 100) / 100, y: Math.round(nm.y * 100) / 100 };
    // Verläufe und Filter der Abzeichen (ohne Inkscape-Attribute, ids/Verweise auf Platzhalter umgestellt)
    const umbenennen = t => t.replace(/url\(#([^)]+)\)/g, (x, id) => defIds.has(id) ? `url(#${defIds.get(id)})` : x).replace(/href="#([^"]+)"/g, (x, id) => defIds.has(id) ? `href="#${defIds.get(id)}"` : x);
    for (const k of Object.keys(out.formen)) for (const art of ["abz", "maul"]) for (const z of Object.keys(out.formen[k][art] || {})) out.formen[k][art][z] = umbenennen(out.formen[k][art][z]);
    out.defs = [...defIds].map(([id, neu]) => { const c = document.getElementById(id).cloneNode(true);
      for (const n of [c, ...c.querySelectorAll("*")]) for (const a of [...n.attributes]) if (/^(inkscape|sodipodi):/.test(a.name) || (a.name === "id" && n !== c)) n.removeAttribute(a.name);
      c.setAttribute("id", neu); return umbenennen(r3(c.outerHTML.replace(/ xmlns(:\w+)?="[^"]*"/g, "").replace(/xlink:href/g, "href"))).replace(/#e5e5e5/gi, "__WEISS__").replace(/#e6e6e6/gi, "__MEHL__").replace(/#656565|#4d4d4d/gi, "__DUNKEL__"); }).join("");   // dunkles Maul: Farbe aus dem Fell (v428)
    return out;
  });
  await b.close();
  const js = "// Neue Pferdeköpfe aus Domes Datei „pferd kopf.svg“ (PLAN-KOEPFE.md) – erzeugt mit werkzeuge/kopf-export.js, nicht von Hand ändern\n" +
    "// Koordinaten = Zeichenfläche der SVG (2050 × 1700), Pferd schaut nach links. Platzhalter: __FELL__, __MUSCHEL__, __MAEHNE__, __AAL__\n" +
    "const KOPF_NEU = " + JSON.stringify(K) + ";\n";
  fs.writeFileSync(path.join(ROOT, "kopfneu.js"), js);
  console.log("kopfneu.js:", js.length, "Zeichen ·", Object.keys(K.formen).length, "Kopfformen · gap", K.gap, "nase", K.nase, "kap", K.kap, "schap", K.schap, "auge", K.augeMitte);
})();
