// Kleiner Web-Server für die Blender-Testseiten (blender/testseiten): node werkzeuge/statisch.js [Port] – dann http://localhost:8765/boxenboden.html
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..", "blender", "testseiten"), PORT = +process.argv[2] || 8765;
const ART = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".glb": "model/gltf-binary" };
const { execFile } = require("child_process"), BLENDER = "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe", PROJ = path.join(__dirname, "..").split("\\").join("/");
http.createServer((q, a) => {
  if (q.method === "POST" && q.url === "/blender-aepfel") {   // Knopf „In Blender speichern“: Apfel-Positionen als JSON ablegen und aepfel-speichern.py ohne Fenster laufen lassen
    let b = ""; q.on("data", (d) => b += d); q.on("end", () => {
      try {
        const o = JSON.parse(b); if (!/^(stroh|hanf)$/.test(o.mat) || !/^[a-e]$/.test(o.gr) || !/^[a-z]+$/.test(o.pferd)) throw new Error("ungültige Wahl");
        for (const st of [1, 2, 3]) fs.writeFileSync(path.join(WURZEL, "boxenboden", `aepfel-${o.mat}-${o.gr}-${o.pferd}-${st}.json`), JSON.stringify(o.stufen[st]));
        execFile(BLENDER, ["-b", "--python", path.join(PROJ, "blender", "aepfel-speichern.py"), "--", PROJ, o.mat, o.gr, o.pferd], { maxBuffer: 1 << 26, timeout: 600000 }, (e, out) => {
          const z = (out.match(/GESPEICHERT .*/g) || []).map((x) => x.replace("GESPEICHERT ", ""));
          if (e && !z.length) { a.writeHead(500); return a.end(String(e.message).slice(0, 300)); }
          a.writeHead(200); a.end(z.join(", "));
        });
      } catch (e) { a.writeHead(400); a.end(String(e.message)); }
    }); return;
  }
  if (q.method === "POST" && /^\/speichern\/[\w-]+\.json$/.test(q.url)) {   // Export aus der Testseite (z. B. Apfel-Positionen) nach blender/testseiten/boxenboden/
    let b = ""; q.on("data", (d) => b += d); q.on("end", () => { fs.writeFileSync(path.join(WURZEL, "boxenboden", q.url.split("/")[2]), b); a.writeHead(200); a.end("ok"); }); return;
  }
  const p = path.normalize(path.join(WURZEL, decodeURIComponent(q.url.split("?")[0]).replace(/^\/$/, "/index.html")));
  if (!p.startsWith(WURZEL) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { a.writeHead(404); return a.end("nicht gefunden"); }
  a.writeHead(200, { "Content-Type": ART[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(p).pipe(a);
}).listen(PORT, () => console.log("Testseiten auf http://localhost:" + PORT));
