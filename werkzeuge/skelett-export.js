// Wandelt zeichnungen/skelett.svg + zeichnungen/skelett-punkte.json in skelett.js um (window.SKELETT).
// Aufruf: node werkzeuge/skelett-export.js   (kein Playwright nötig)
// Skelett tauschen: neue SVG nach zeichnungen/skelett.svg, Punkte/Clips in skelett-punkte.json anpassen, erneut laufen lassen.
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const svg = fs.readFileSync(path.join(ROOT, "zeichnungen", "skelett.svg"), "utf8");
const daten = JSON.parse(fs.readFileSync(path.join(ROOT, "zeichnungen", "skelett-punkte.json"), "utf8"));
const inner = svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>")).replace(/\s*\n\s*/g, "");
fs.writeFileSync(path.join(ROOT, "skelett.js"), "// erzeugt von werkzeuge/skelett-export.js – nicht von Hand ändern\nwindow.SKELETT = " + JSON.stringify({ daten, svg: inner }) + ";\n");
console.log("skelett.js", Math.round(fs.statSync(path.join(ROOT, "skelett.js")).size / 1024), "KB");
