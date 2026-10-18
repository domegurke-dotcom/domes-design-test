// Optik-Prüfung (Dome, 19.10.2026): zeichnet alle Farben, Varianten, Scheckungen, Kopfformen und Altersstufen
// und schneidet die heiklen Stellen vergrößert aus: Kopf/Ohr/Hals-Übergang und Bauch/Beine.
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/optik-pruefung.js <Ausgabeordner> [Gruppe]
// Ergebnis: <Ausgabeordner>/optik_<gruppe>_<n>.png (Bilder NICHT im Projektordner speichern – Scratchpad nehmen)
const { chromium } = require("playwright");
const path = require("path");
const R = path.join(__dirname, "..") + "/";
const AUS = process.argv[2], NUR = process.argv[3];
if (!AUS) { console.log("Ausgabeordner fehlt"); process.exit(1); }

// [Beschriftung, Rasse, Farbe, Optionen]

const GRUPPEN = {
  grundfarben: () => Object.keys(FARBEN_BASIS).filter(k => k !== "lethalwhite").map(f => [f, /schimmel|^fs_/.test(f) ? "andalusier" : "hannoveraner", f, {}]),
  scheckung: () => { const l = []; for (const f of ["rappschecke", "fuchsschecke", "ov_brauner", "tv_fuchs", "sa_brauner", "sw_brauner", "tg_brauner", "sk_brauner", "fs_rappe", "sb_rappe", "blueroan", "rotschimmel"])
    for (const s of [0, 2, 3]) l.push([`${f} Stufe ${s}`, "paint", f, { musterStufe: s }]); return l; },
  sonder: () => [["Rabicano", "hannoveraner", "brauner", { rabi: 1 }], ["Rabicano viel", "hannoveraner", "rappe", { rabi: 2 }], ["Birdcatcher", "araber", "fuchs", { birdcatcher: 20 }],
    ["Bend-Or", "vollblut", "fuchs", { bendor: true }], ["Brindle dunkel", "quarter", "brauner", { brindle: "dunkel" }], ["Brindle weiß", "quarter", "brauner", { brindle: "weiss" }],
    ...[0, 1, 2, 3].map(s => [`Dominant White ${s}`, "araber", "fuchs", { dw: s }]),
    ["Roan unter Schecke", "paint", "rappschecke", { roanMix: true }], ["Pintaloosa", "appaloosa", "tg_brauner", { tobianoMix: true }],
    ["Lackschimmel", "appaloosa", "brauner", { lp: { haut: true, sklera: true, huf: true, lack: .8, flocken: 0, frost: false } }],
    ["Snowflake", "appaloosa", "rappe", { lp: { haut: true, sklera: true, huf: true, lack: 0, flocken: 30, frost: false } }],
    ["Frost", "appaloosa", "brauner", { lp: { haut: true, sklera: true, huf: true, lack: 0, flocken: 0, frost: true } }],
    ["Glanzäpfel Brauner", "hannoveraner", "brauner", { glanzAepfel: true }], ["Glanzäpfel Rappe", "hannoveraner", "rappe", { glanzAepfel: true }], ["Glanzäpfel Palomino", "quarter", "palomino", { glanzAepfel: true }],
    ["Krötenmaul Isabell", "quarter", "isabell", { kroete: true }],
    ["Beine weiß", "hannoveraner", "fuchs", { beinAbz: { vn: "hochweiss", vf: "fuss", hn: "fessel", hf: "krone" } }],
    ["Zebra Falbe", "fjord", "braunfalbe", { zebra: true, schulter: true }]],
  tekke: () => { const l = []; for (const f of ["rappe", "schwarzbrauner", "dunkelbrauner", "brauner", "dfuchs", "fuchs", "russbuckskin", "buckskin", "palomino", "isabell", "schimmel"])
    for (const g of [0, 1]) l.push([`Tekke ${f} ${g ? "Glanz" : "matt"}`, "tekke", f, { glanz: g }]);
    l.push(["Tekke Bronze", "tekke", "buckskin", { glanz: 1, bronze: true }], ["Tekke Perl", "tekke", "isabell", { glanz: 1, bronze: true }]); return l; },
  schimmel: () => { const l = [], W8 = "#f2f0eb"; for (const b of ["rappe", "brauner", "fuchs", "palomino"]) for (const [t, ph] of [[.3, "grau"], [.5, "apfel"], [.8, "apfel"], [1, "weiss"]]) {
      const B = FARBEN_BASIS[b], id = `pr_${b}_${t}_${ph}`, e = { ...B };
      e.body = mix(B.body, W8, Math.min(1, t * .97)); e.mane = mix(B.mane, "#e8e4dc", t * .6); if (B.points) e.points = mix(B.points, "#dcd8d1", Math.min(1, t * .92));
      e.head = mix(B.head || B.body, W8, Math.min(1, t * 1.15)); e.muzzle = mix(B.muzzle || "#3a302c", "#6f6a6a", t); e.grau = t; delete e.russ; delete e.pattern;
      if (ph === "apfel") { e.pattern = "dapple"; e.dapple = mix(e.body, W8, .6); } else if (ph === "grau") { e.pattern = "roan"; e.roanDeck = Math.min(1, .2 + t * 4); }
      FARBEN_BASIS[id] = e; l.push([`Schimmel ${b} ${t} ${ph}`, "andalusier", id, {}]); } return l; },
  koepfe: () => { const l = []; for (const k of Object.keys(KOPF_NEU.formen)) for (const f of ["palomino", "rappe"]) l.push([`Kopf ${k} ${f}`, "quarter", f, { eigenKopf: k }]); return l; },
  ohren: () => { const l = []; for (const st of ["vorne", "seite", "hinten", "angelegt"]) for (const [r, f, m] of [["hannoveraner", "fuchs", "lang"], ["haflinger", "hellfuchs", "extralang"], ["araber", "rappe", "kurz"]])
    l.push([`Ohren ${st} ${r} Mähne ${m}`, r, f, { ohrStellung: { R: st, L: st, spiel: false }, maehne: m }]); return l; },
  alter: () => { const l = []; for (const a of ["fohlen", "jaehrling", "jungpferd", "reif", "senior"]) for (const [r, f] of [["haflinger", "hellfuchs"], ["andalusier", "schimmel"], ["tekke", "dunkelbrauner"], ["tinker", "rappschecke"]])
    l.push([`${a} ${r} ${f}`, r, f, { alterStufe: a, glanz: r === "tekke" ? 1 : undefined }]); return l; },
};

(async () => {
  const b = await chromium.launch();
  for (const name of Object.keys(GRUPPEN)) {
    if (NUR && NUR !== name) continue;
    const pg = await b.newPage({ viewport: { width: 1400, height: 900 } });
    await pg.setContent("<body style='margin:0;background:#bbb;font:11px sans-serif'></body>");
    await pg.addScriptTag({ path: R + "kopfneu.js" }); await pg.addScriptTag({ path: R + "pferd.js" });
    const n = await pg.evaluate(src => { const liste = eval("(" + src + ")")(), JE = 9; let seite = 0;
      liste.forEach(([txt, r, f, o], i) => { if (i % JE === 0) document.body.insertAdjacentHTML("beforeend", `<div class="seite" id="s${seite++}" style="display:flex;flex-wrap:wrap;width:1400px"></div>`);
        let svg; try { svg = zeichnePferd(r, f, { statisch: 1, seed: "p" + i, ...o }); } catch (e) { svg = null; }
        const z = svg, bx = z ? z.box : null, w = bx ? bx.maxX - bx.minX : 1, h = bx ? -bx.minY : 1;
        const ab = (vb, bw) => z ? `<svg xmlns="http://www.w3.org/2000/svg" width="${bw}" height="${bw * vb[3] / vb[2]}" viewBox="${vb.join(" ")}" style="background:#dfeefa">${z.svg}</svg>` : `<b style="color:red">FEHLER</b>`;
        const kopf = [bx.minX - 2, bx.minY - 0.08 * h, w * .38, h * .5], bein = [bx.minX + w * .15, bx.minY + h * .45, w * .8, h * .45];
        document.querySelector(`#s${seite - 1}`).insertAdjacentHTML("beforeend", `<div style="width:464px;margin:1px;background:#fff"><div>${txt}</div>${ab(kopf, 230)}${ab(bein, 230)}</div>`); });
      return seite; }, GRUPPEN[name].toString());
    for (let s = 0; s < n; s++) { const el = await pg.$(`#s${s}`); await el.screenshot({ path: `${AUS}/optik_${name}_${s + 1}.png` }); }
    console.log(name, n, "Bild(er)");
    await pg.close();
  }
  await b.close();
})();
