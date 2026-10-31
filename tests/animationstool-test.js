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
 const g = p.locator('[data-g="VL_huf"] circle').first(); const bb = await g.boundingBox();
 const vor = await p.evaluate(() => ANI.poseBei(0.03).VL_huf);
 await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x - 40, bb.y - 30, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(150);
 const nach = await p.evaluate(() => ANI.poseBei(0.03).VL_huf), n1 = await p.evaluate(() => ANI.S.kf.length);
 ok('Ziehen legt Keyframe an (' + n0 + ' → ' + n1 + ')', n1 === n0 + 1);
 ok('Huf hat sich bewegt', Math.abs(nach.x - vor.x) > 3 && Math.abs(nach.y - vor.y) > 3);
 const lang = await p.evaluate(() => { const P = ANI.poseBei(0.03), R = ANI.S.ruhe.P, d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y); return [d(P.VL_fessel, P.VL_huf), d(R.VL_fessel, R.VL_huf)]; });
 ok('Knochenlänge gehalten (' + lang.map(v => v.toFixed(2)).join(' / ') + ')', Math.abs(lang[0] - lang[1]) < 0.05);
 await p.screenshot({ path: out + '/bedien-gezogen.png' });
 // 2. Rückgängig
 await p.keyboard.press('Control+z'); await p.waitForTimeout(150);
 ok('Strg+Z macht es rückgängig', (await p.evaluate(() => ANI.S.kf.length)) === n0);
 // 3. Widerrist zieht das ganze Pferd
 await p.evaluate(() => { ANI.zeitSetzen(0); window.scrollTo(0, 0); }); await p.waitForTimeout(150);
 const w = await p.locator('[data-g="widerrist"] circle').first().boundingBox(); const k0 = await p.evaluate(() => ANI.poseBei(0).nase);
 await p.mouse.move(w.x + w.width / 2, w.y + w.height / 2); await p.mouse.down(); await p.mouse.move(w.x + w.width / 2, w.y - 20, { steps: 5 }); await p.mouse.up();
 const k1 = await p.evaluate(() => ANI.poseBei(0).nase); ok('Widerrist hebt das ganze Pferd (Nase mit) ' + k0.y.toFixed(1) + ' → ' + k1.y.toFixed(1), k1.y < k0.y - 2);
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
 // 10. Skelett einrichten: Punkt auf der Zeichnung verschieben, fernes Bein zieht mit, Huf bleibt am Boden, Bewegung wird übertragen, bleibt nach Neuladen
 await p.evaluate(() => window.scrollTo(0, 0)); await p.click('#skelettKnopf'); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(150);
 ok('Einrichten-Modus: Band sichtbar, Abspielen gesperrt', await p.isVisible('#skelettBand') && await p.evaluate(() => getComputedStyle(document.querySelector('.steuer')).pointerEvents === 'none'));
 const r0 = await p.evaluate(() => JSON.parse(JSON.stringify(ANI.S.ruhe.P)));
 const kn = await p.locator('[data-g="VL_karpal"] circle').first().boundingBox();
 await p.mouse.move(kn.x + kn.width / 2, kn.y + kn.height / 2); await p.mouse.down(); await p.mouse.move(kn.x + kn.width / 2 + 12, kn.y + kn.height / 2 - 10, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(100);
 const hf = await p.locator('[data-g="HL_huf"] circle').first().boundingBox();
 await p.mouse.move(hf.x + hf.width / 2, hf.y + hf.height / 2); await p.mouse.down(); await p.mouse.move(hf.x + hf.width / 2 - 15, hf.y + hf.height / 2 - 20, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(100);
 const r1 = await p.evaluate(() => JSON.parse(JSON.stringify(ANI.S.ruhe.P)));
 ok('Vorderfußwurzel verschoben, fernes Bein mit (' + (r1.VL_karpal.x - r0.VL_karpal.x).toFixed(1) + ' / ' + (r1.VR_karpal.x - r0.VR_karpal.x).toFixed(1) + ')', r1.VL_karpal.x - r0.VL_karpal.x > 1 && Math.abs((r1.VL_karpal.x - r0.VL_karpal.x) - (r1.VR_karpal.x - r0.VR_karpal.x)) < .01);
 ok('Huf verschoben und bleibt auf dem Boden (y = ' + r1.HL_huf.y + ')', r1.HL_huf.x < r0.HL_huf.x - 1 && r1.HL_huf.y === 0);
 ok('Ellbogen unverändert (nur der eine Punkt)', r1.VL_ellbogen.x === r0.VL_ellbogen.x && r1.VL_ellbogen.y === r0.VL_ellbogen.y);
 await p.locator('#buehne').screenshot({ path: out + '/skelett-einrichten.png' });
 await p.click('#skelettFertig'); await p.waitForTimeout(300);
 const kfK = await p.evaluate(() => { const R = ANI.S.ruhe.P, P = ANI.S.kf[0].P, d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y); return [d(P.VL_karpal, P.VL_fessel), d(R.VL_karpal, R.VL_fessel)]; });
 ok('Bewegung auf das neue Skelett übertragen (Knochen ' + kfK.map(v => v.toFixed(1)).join(' / ') + '), Stützfolge ' + await p.textContent('#folge'), Math.abs(kfK[0] - kfK[1]) < .3);
 ok('Hinweis: eigenes Skelett gespeichert', (await p.textContent('#skelettInfo')).includes('eigenes Skelett'));
 await p.reload(); await p.waitForTimeout(600);
 const r2 = await p.evaluate(() => ANI.S.ruhe.P.VL_karpal.x); ok('Nach Neuladen ist das eigene Skelett noch da', Math.abs(r2 - r1.VL_karpal.x) < .11);
 p.once('dialog', d => d.accept()); await p.click('#skelettSchaetz'); await p.waitForTimeout(300);
 const r3 = await p.evaluate(() => ANI.S.ruhe.P.VL_karpal.x); ok('Schätzung wiederhergestellt', Math.abs(r3 - r0.VL_karpal.x) < .01 && (await p.textContent('#skelettInfo')).includes('Schätzung'));
 // 11. Seiten (Dome 31.10.): man sieht die LINKE Seite – nahe Beine sind VL/HL; alte Daten (Format 1) werden beim Laden getauscht
 const seite = await p.evaluate(() => { const R = ANI.S.ruhe.P, sicht = k => document.querySelector('[data-g="' + k + '"] circle.sicht'); return Math.abs(R.VL_huf.x - R.VR_huf.x) < .01 && Math.abs(R.HL_karpal ? 0 : R.HL_huf.x - R.HR_huf.x) < .01 && sicht('VL_huf').getAttribute('opacity') === '1' && sicht('VR_huf').getAttribute('opacity') !== '1'; });
 ok('Nahe Beine sind die linken (VL/HL kräftig), ferne stehen parallel genau dahinter', seite);
 const alt = await p.evaluate(() => { const D = JSON.parse(localStorage.getItem('animationstool-v1')); D.format = 1; const tausch = P => { const N = {}; for (const k in P) { const m = /^([VH])([LR])_(.+)$/.exec(k); N[m ? m[1] + (m[2] === 'L' ? 'R' : 'L') + '_' + m[3] : k] = P[k]; } return N; };
   D.keyframes = D.keyframes.map(k => ({ t: k.t, P: tausch(k.P) })); localStorage.setItem('animationstool-v1', JSON.stringify(D)); return D.keyframes[0].P.VR_huf[0]; });
 await p.reload(); await p.waitForTimeout(600);
 ok('Alte Datei (Seiten vertauscht) wird beim Laden umgestellt', await p.evaluate(x => Math.abs(ANI.S.kf[0].P.VL_huf.x - x) < .11, alt));
 // 12. Schatten des Keyframes davor/danach, Schrittlänge wirkt sofort, Hilfe
 p.once('dialog', d => d.accept()); await p.click('#original'); await p.waitForTimeout(200);
 await p.evaluate(() => ANI.zeitSetzen(.1)); await p.waitForTimeout(100);
 ok('Schatten: Keyframe davor (blau) und danach (orange) sichtbar', await p.evaluate(() => document.querySelectorAll('#figur line[stroke="#2a6fd0"]').length > 5 && document.querySelectorAll('#figur line[stroke="#e07a1a"]').length > 5));
 const sl1 = await p.textContent('#schrittlaenge'); await p.locator('#sweep').fill('20'); await p.waitForTimeout(300); const sl2 = await p.textContent('#schrittlaenge');
 ok('Schrittlänge wirkt sofort (' + sl1.split(' (')[0] + ' → ' + sl2.split(' (')[0] + ')', parseInt(sl2) < parseInt(sl1) - 10 && (await p.textContent('#folge')) === '3:2:3:2:3:2:3:2');
 await p.click('#hilfeKnopf'); ok('Hilfe öffnet', await p.isVisible('#hilfe')); await p.click('#hilfeZu'); ok('Hilfe schließt', !(await p.isVisible('#hilfe')));
 // 13. Bein ändern (Dome 31.10.): weiter vor / weiter nach hinten / höher heben – Huf rutscht nie, Takt darf sich ändern
 const cm = await p.evaluate(() => ANI.S.ruhe.cmJe);
 const landeX = b => ANI.S.kf.filter(k => k.P[b + '_huf'].y >= -0.6).map(k => k.P[b + '_huf'].x - k.P[b + (b[0] === 'V' ? '_bug' : '_hueft')].x);
 const huebe = b => Math.min(...ANI.S.kf.map(k => k.P[b + '_huf'].y));
 for (const [bn, knopf, art, zeichen] of [['VL', '#beinVor', 'vor', -1], ['HL', '#beinVor', 'vor', -1], ['VL', '#beinHinten', 'hinten', 1], ['HL', '#beinHinten', 'hinten', 1]]) {
  p.once('dialog', d => d.accept()); await p.click('#original'); await p.waitForTimeout(200);
  const vor0 = await p.evaluate(new Function('b', 'const l = ' + landeX.toString() + '; return l(b);'), bn);
  await p.selectOption('#beinWahl', bn); await p.click(knopf); await p.waitForTimeout(250);
  const vor1 = await p.evaluate(new Function('b', 'const l = ' + landeX.toString() + '; return l(b);'), bn);
  const ext = a => zeichen < 0 ? Math.min(...a) : Math.max(...a), d = Math.round((ext(vor1) - ext(vor0)) * zeichen * cm);
  const rutsch = await p.evaluate(() => ANI.pruefen().filter(f => f.art === 'rutsch').length);
  ok(bn + ' ' + (art === 'vor' ? 'fußt weiter vorn auf' : 'fußt weiter hinten ab') + ' (' + d + ' cm), Huf rutscht nicht, Takt ' + await p.textContent('#folge'), d >= 3 && d <= 8 && rutsch === 0);
 }
 p.once('dialog', d => d.accept()); await p.click('#original'); await p.waitForTimeout(200);
 const h0 = await p.evaluate(new Function('b', 'const h = ' + huebe.toString() + '; return h(b);'), 'VL');
 await p.selectOption('#beinWahl', 'VL'); await p.click('#beinHoch'); await p.click('#beinHoch'); await p.waitForTimeout(250);
 const h1 = await p.evaluate(new Function('b', 'const h = ' + huebe.toString() + '; return h(b);'), 'VL');
 ok('Vorne links wird höher gehoben (' + Math.round((h0 - h1) * cm) + ' cm), Takt bleibt ' + await p.textContent('#folge'), (h0 - h1) * cm > 6 && (await p.textContent('#folge')) === '3:2:3:2:3:2:3:2' && (await p.evaluate(() => ANI.pruefen().length)) === 0);
 await p.click('#beinTief'); await p.click('#beinTief'); await p.waitForTimeout(250);
 ok('„weniger hoch“ nimmt es zurück', Math.abs((await p.evaluate(new Function('b', 'const h = ' + huebe.toString() + '; return h(b);'), 'VL')) - h0) < .3);
 const cmAlt = cm;
 // 14. Rechts wie links
 await p.click('#rechtsWieLinks'); await p.waitForTimeout(200);
 const gleich = await p.evaluate(() => { const k = ANI.S.kf[0], Q = ANI.poseBei((k.t + .5) % 1); return Math.abs((k.P.VR_huf.x - k.P.VR_bug.x) - (Q.VL_huf.x - Q.VL_bug.x)) < .5; });
 ok('Rechts wie links: rechtes Vorderbein = linkes, einen halben Schritt später', gleich);
 // 15. Prüfen findet einen verzogenen Knochen, Reparieren behebt ihn
 p.once('dialog', d => d.accept()); await p.click('#original'); await p.waitForTimeout(200);
 await p.evaluate(() => ANI.zeitSetzen(ANI.S.kf[2].t)); await p.uncheck('#knochenFest'); await p.waitForTimeout(100);
 const kp = await p.locator('[data-g="VL_karpal"] circle').first().boundingBox();
 await p.mouse.move(kp.x + kp.width / 2, kp.y + kp.height / 2); await p.mouse.down(); await p.mouse.move(kp.x + 40, kp.y - 30, { steps: 5 }); await p.mouse.up(); await p.check('#knochenFest');
 await p.click('#pruefKnopf'); await p.waitForTimeout(100); const pr = await p.textContent('#pruefErg');
 ok('Prüfen findet den verzogenen Knochen', /verzogener Knochen/.test(pr));
 await p.click('#reparieren'); await p.waitForTimeout(200); const rep2 = await p.textContent('#pruefErg'); ok('Reparieren: danach alles in Ordnung' + (/Alles in Ordnung/.test(rep2) ? '' : ' – ' + rep2.slice(0, 300)), /Alles in Ordnung/.test(rep2));
 await p.screenshot({ path: out + '/anfaenger.png' });
 console.log('Seitenfehler:', fehler.length ? fehler.join(' | ') : 'keine'); await b.close(); })();
