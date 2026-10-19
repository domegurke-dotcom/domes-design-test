// Bilanz-Bild-Test (v555, PLAN-BILANZ.md B5): PNG 1080×1350 aus dem Jahresbericht, Pferdebild, Dateiname ohne Umlaute, Download, Knopf im Brief
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/bild-test.js [Ordner für das Beispielbild]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ acceptDownloads: true }); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Süßer Hof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(async () => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; spiel.tippsAus = true;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Sieger' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); spiel.boxen[0].pferd = p;
    const A = { jahr: 2000, hof: 'Süßer Hof', gewinn: 4574, geld: 23606, pferde: 3, siege: 5, plaz: 3, starts: 12, ausgabe: ['Kredit: Zinsen', 294], einnahme: ['Weihnachtsspende', 5000], bestes: { id: p.id, n: 'Sieger', r: 'hannoveraner' } };
    const bild = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ganzBild(p).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" '));
    const blob = await bilanzBildBlob({ ...A, titel: 'Jahresbericht', zeit: 'Jahr 2000', bild });
    ok('PNG-Blob, nicht leer', blob && blob.type === 'image/png' && blob.size > 8000, blob && blob.size + ' Byte');
    const bm = await createImageBitmap(blob); ok('Größe 1080 × 1350', bm.width === 1080 && bm.height === 1350, bm.width + '×' + bm.height);
    const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height; const g = c.getContext('2d'); g.drawImage(bm, 0, 0);
    const farben = new Set(); for (let x = 80; x < 640; x += 20) for (let y = 900; y < 1260; y += 20) { const d = g.getImageData(x, y, 1, 1).data; farben.add(d[0] + ',' + d[1] + ',' + d[2]); }
    ok('Pferdebild ist im Bild (viele verschiedene Farben im Pferdebereich)', farben.size > 8, farben.size + ' Farben');
    const px = g.getImageData(10, 600, 1, 1).data; ok('Hintergrund hell', px[0] > 230 && px[1] > 220);
    const svg = bilanzBildSVG({ ...A, titel: 'Jahresbericht', zeit: 'Jahr 2000', bild: '' }); ok('Keine versteckten Werte im Bild (nur Bilanz-Zahlen, Version)', !/<script|genetik|erb\b/i.test(svg) && /Version/.test(svg) && /Gewinn/.test(svg) && /Kontostand/.test(svg) && /Größte Einnahme/.test(svg));
    ok('Verlust: Titel „Verlust“ und Minuszeichen', /Verlust/.test(bilanzBildSVG({ ...A, gewinn: -1200, bild: '' })) && /−1\.200/.test(bilanzBildSVG({ ...A, gewinn: -1200, bild: '' })));
    ok('Ohne bestes Pferd: kein Fehler, Hinweistext', /Noch kein Pferd mit Erfolgen/.test(bilanzBildSVG({ ...A, bestes: null, bild: '' })));
    ok('Dateiteil ohne Umlaute und Leerzeichen', bildDateiTeil('Süßer Hof Ärger') === 'Suesser-Hof-Aerger', bildDateiTeil('Süßer Hof Ärger'));
    ok('Brief-Aktion „jbild“ zeigt den Knopf „Als Bild teilen“', /Als Bild teilen/.test(briefAktionHTML({ id: 'x', aktion: { typ: 'jbild', daten: A } })));
    const png = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
    return { text: out.join('\n'), png, A };
  });
  console.log(R.text);
  const dl = pg.waitForEvent('download', { timeout: 15000 }); await pg.evaluate(A => bilanzBildTeilen(A), R.A); const d = await dl;
  console.log(d.suggestedFilename() === 'Zuchtstall_Suesser-Hof_Bilanz_Jahr-2000.png' ? '✓ Download mit Dateiname ohne Umlaute – ' + d.suggestedFilename() : '✗ Dateiname falsch – ' + d.suggestedFilename());
  if (process.argv[2]) { fs.writeFileSync(path.join(process.argv[2], 'bilanz-bild.png'), Buffer.from(R.png.split(',')[1], 'base64')); }
  console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
