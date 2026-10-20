// Rang-Schwellen für die Leistungs-Seltenheit (R1, PLAN-RARITAETEN.md): 20.000 Pferde je Rasse mit festen Seeds würfeln und die Grenzen der oberen 5 % / 1 % / 0,1 % ausrechnen.
// Start: NODE_PATH=/opt/node22/lib/node_modules node werkzeuge/seltenheit-schwellen.js <Ausgabedatei.json>
// Das Ergebnis (je Rasse 6 Zahlen: Gangwerk, Aufschlüsselung je 5 %, 1 %, 0,1 %; Charakter zählt seit v558 nicht mehr) in index.html in `SELTEN_SCHWELLE` eintragen.
// NEU berechnen, sobald sich Rassenwerte ändern (PROFIL in pferd.js: gang, char, koerper, kopf) oder neue Rassen dazukommen.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  if (!process.argv[2]) { console.log('Bitte Ausgabedatei angeben.'); return; }
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  const T = await pg.evaluate(() => {
    const N = 20000, out = {}, q = (a, share) => a[Math.floor(a.length * share)];   // a absteigend sortiert
    RASSEN.forEach(ra => {
      const G = [], W = [];
      for (let i = 0; i < N; i++) {
        const w = erzeugeWerte({ id: 'schw' + i, rasse: ra.id });
        G.push((w.gang.schritt + w.gang.trab + w.gang.galopp) / 3);
        const ks = [...WERTE_KOERPER.map(x => x.key), 'lernfaehigkeit', 'konzentration', 'reaktion']; W.push(ks.reduce((a, k) => a + w.anlage[k], 0) / ks.length);   // Vergleichswert: Anlage (volles Potenzial)
      }
      const r2 = x => Math.round(x * 100) / 100; out[ra.id] = [G, W].flatMap(a => { a.sort((x, y) => y - x); return [r2(q(a, .05)), r2(q(a, .01)), r2(q(a, .001))]; });
    });
    return out;
  });
  fs.writeFileSync(process.argv[2], JSON.stringify(T)); console.log(Object.keys(T).length + ' Rassen berechnet'); console.log('Fehler:', errs.join(';') || 'keine'); await b.close();
})();
