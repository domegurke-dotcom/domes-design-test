// Schickt eine Python-Datei an Domes offenes Blender-Fenster (Add-on „MCP“ von Blender Lab, lauscht auf localhost:9876).
// Aufruf: node werkzeuge/blender-senden.js <datei.py>  – in der Datei das Ergebnis in die Variable `result` schreiben, es kommt als JSON zurück.
// Das Add-on verlangt in jeder Anfrage das Feld strict_json. Voraussetzung: im Blender-Fenster ist der MCP-Server gestartet (Add-on-Einstellungen).
const net = require("net"); const code = require("fs").readFileSync(process.argv[2], "utf8");
const c = net.connect(9876, "127.0.0.1"); let buf = "";
c.on("connect", () => c.write(JSON.stringify({ type: "execute", code, strict_json: false }) + "\0"));
c.on("data", d => { buf += d.toString(); if (buf.includes("\0")) { console.log(buf.replace(/\0/g, "").slice(0, 3000)); c.end(); } });
c.on("error", e => console.log("FEHLER", e.message)); setTimeout(() => { console.log("Zeitüberschreitung"); process.exit(0); }, 20000);
