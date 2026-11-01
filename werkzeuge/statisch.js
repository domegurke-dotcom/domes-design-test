// Kleiner Web-Server für die Blender-Testseiten (blender/testseiten): node werkzeuge/statisch.js [Port] – dann http://localhost:8765/boxenboden.html
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..", "blender", "testseiten"), PORT = +process.argv[2] || 8765;
const ART = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".glb": "model/gltf-binary" };
http.createServer((q, a) => {
  if (q.method === "POST" && /^\/speichern\/[\w-]+\.json$/.test(q.url)) {   // Export aus der Testseite (z. B. Apfel-Positionen) nach blender/testseiten/boxenboden/
    let b = ""; q.on("data", (d) => b += d); q.on("end", () => { fs.writeFileSync(path.join(WURZEL, "boxenboden", q.url.split("/")[2]), b); a.writeHead(200); a.end("ok"); }); return;
  }
  const p = path.normalize(path.join(WURZEL, decodeURIComponent(q.url.split("?")[0]).replace(/^\/$/, "/index.html")));
  if (!p.startsWith(WURZEL) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { a.writeHead(404); return a.end("nicht gefunden"); }
  a.writeHead(200, { "Content-Type": ART[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(p).pipe(a);
}).listen(PORT, () => console.log("Testseiten auf http://localhost:" + PORT));
