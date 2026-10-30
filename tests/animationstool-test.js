// Animationstool (animationstool/index.html): Vorlagen passen zu den PDF-Stützfolgen, Bedienung mit echten Mausklicks.
// Aufruf: node tests/animationstool-test.js <Scratchpad-Ordner für Bilder und die gespeicherte Datei>
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true }); const p = await ctx.newPage();
 const fehler = []; p.on('pageerror', e => fehler.push(e.message));
 const ok = (n, c) => console.log((c ? '✓ ' : '✗ ') + n);
 await p.goto('file:///' + path.resolve('animationstool/index.html').split(String.fromCharCode(92)).join('/')); await p.waitForTimeout(600);
 await p.evaluate(() => localStorage.removeItem('animationstool-v1')); await p.reload(); await p.waitForTimeout(600);
 for (const [g, soll] of [['schritt', '3:2:3:2:3:2:3:2'], ['trab', '2:0:2:0'], ['galoppR', '1:3:2:3:1:0'], ['galoppL', '1:3:2:3:1:0']]) { p.once('dialog', d => d.accept()); await p.selectOption('#gang', g); await p.click('#vorlageLaden'); await p.waitForTimeout(200);
  ok('Vorlage ' + g + ': Stützfolge ' + await p.textContent('#folge') + ', Takte ' + await p.textContent('#takte'), (await p.textContent('#pdfVergleich')).includes('passt')); }
 p.once('dialog', d => d.accept()); await p.selectOption('#gang', 'schritt'); await p.click('#vorlageLaden'); await p.waitForTimeout(200);
 // 1. zwischen zwei Keyframes ein Gelenk ziehen → neuer Keyframe, Huf bewegt
 await p.evaluate(() => ANI.zeitSetzen(0.03)); await p.waitForTimeout(100);
 const n0 = await p.evaluate(() => ANI.S.kf.length);
 const g = p.locator('[data-g="VR_huf"] circle').first(); const bb = await g.boundingBox();
 const vor = await p.evaluate(() => ANI.poseBei(0.03).VR_huf);
 await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x - 40, bb.y - 30, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(150);
 const nach = await p.evaluate(() => ANI.poseBei(0.03).VR_huf), n1 = await p.evaluate(() => ANI.S.kf.length);
 ok('Ziehen legt Keyframe an (' + n0 + ' → ' + n1 + ')', n1 === n0 + 1);
 ok('Huf hat sich bewegt', Math.abs(nach.x - vor.x) > 3 && Math.abs(nach.y - vor.y) > 3);
 const lang = await p.evaluate(() => { const P = ANI.poseBei(0.03), R = ANI.S.ruhe.P, d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y); return [d(P.VR_fessel, P.VR_huf), d(R.VR_fessel, R.VR_huf)]; });
 ok('Knochenlänge gehalten (' + lang.map(v => v.toFixed(2)).join(' / ') + ')', Math.abs(lang[0] - lang[1]) < 0.05);
 await p.screenshot({ path: out + '/bedien-gezogen.png' });
 // 2. Rückgängig
 await p.keyboard.press('Control+z'); await p.waitForTimeout(150);
 ok('Strg+Z macht es rückgängig', (await p.evaluate(() => ANI.S.kf.length)) === n0);
 // 3. Widerrist zieht das ganze Pferd
 await p.evaluate(() => ANI.zeitSetzen(0)); await p.waitForTimeout(100);
 const w = await p.locator('[data-g="widerrist"] circle').first().boundingBox(); const k0 = await p.evaluate(() => ANI.poseBei(0).nase);
 await p.mouse.move(w.x + w.width / 2, w.y + w.height / 2); await p.mouse.down(); await p.mouse.move(w.x + w.width / 2, w.y - 20, { steps: 5 }); await p.mouse.up();
 const k1 = await p.evaluate(() => ANI.poseBei(0).nase); ok('Widerrist hebt das ganze Pferd (Nase mit)', k1.y < k0.y - 2);
 await p.keyboard.press('Control+z');
 // 4. Tasten: Pfeil rechts springt zum nächsten Keyframe
 await p.keyboard.press('ArrowRight'); const t1 = await p.evaluate(() => ANI.S.t); ok('→ springt zum nächsten Keyframe (' + t1.toFixed(3) + ')', t1 > 0 && t1 < 0.1);
 // 5. Abspielen
 await p.click('#play'); await p.waitForTimeout(500); await p.click('#play'); const t2 = await p.evaluate(() => ANI.S.t); ok('Abspielen bewegt die Zeit', Math.abs(t2 - t1) > 0.1);
 // 6. Speichern als Datei und wieder laden
 const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#speichern')]); const datei = out + '/' + dl.suggestedFilename(); await dl.saveAs(datei);
 const D = JSON.parse(fs.readFileSync(datei, 'utf8')); ok('Datei gespeichert: ' + dl.suggestedFilename() + ' (' + D.keyframes.length + ' Keyframes)', D.typ === 'zuchtstall-animation' && D.keyframes.length === n0);
 p.once('dialog', d => d.accept()); await p.selectOption('#gang', 'trab'); await p.click('#vorlageLaden'); await p.waitForTimeout(200);
 await p.setInputFiles('#ladenDatei', datei); await p.waitForTimeout(400);
 ok('Datei geladen: Name und Stützfolge wieder Schritt', (await p.inputValue('#name')) === 'Schritt' && (await p.textContent('#folge')) === '3:2:3:2:3:2:3:2');
 // 7. Rassenwechsel überträgt die Bewegung
 await p.selectOption('#rasse', 'shetty'); await p.waitForTimeout(400);
 const r = await p.evaluate(() => { const P = ANI.poseBei(0.2); return Object.values(P).every(q => isFinite(q.x) && isFinite(q.y)); });
 ok('Shetty: Bewegung übertragen, keine kaputten Punkte; Stützfolge ' + await p.textContent('#folge'), r);
 await p.locator('#buehne').screenshot({ path: out + '/bedien-shetty.png' });
 // 8. Vorlagebild
 await p.setInputFiles('#bildDatei', path.resolve('pdfs/Bilder/horse_gaits_the-walk.jpg')); await p.waitForTimeout(500);
 ok('Vorlagebild liegt unter der Bühne', await p.locator('#vorlageBild').count() === 1);
 await p.click('#bildZiehen'); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100); const vb = await p.locator('#vorlageBild').boundingBox();
 await p.mouse.move(vb.x + 50, vb.y + 50); await p.mouse.down(); await p.mouse.move(vb.x + 120, vb.y + 80, { steps: 5 }); await p.mouse.up();
 const vb2 = await p.locator('#vorlageBild').boundingBox(); ok('Bild verschieben mit der Maus (' + Math.round(vb2.x - vb.x) + ' px)', vb2.x - vb.x > 20);
 await p.screenshot({ path: out + '/bedien-bild.png' });
 // 9. Neu laden: Autospeicher
 await p.reload(); await p.waitForTimeout(600); ok('Nach Neuladen ist die Bewegung noch da (Rasse ' + await p.inputValue('#rasse') + ')', (await p.inputValue('#rasse')) === 'shetty');
 console.log('Seitenfehler:', fehler.length ? fehler.join(' | ') : 'keine'); await b.close(); })();
