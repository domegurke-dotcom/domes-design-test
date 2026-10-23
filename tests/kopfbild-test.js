// Kopfbilder (v734, Dome 23.10.): Ohren (oben) und Nase (links) haben in jeder Karte denselben Abstand zum Rand – alle Rassen, Alter, Geschlechter.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/kopfbild-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 800 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(async () => { speicherSperre = true; spiel.admin = true; document.getElementById('dlg').hidden = true; spiel.stufenAn = false;
    const bad = [], alter = [0.1, 0.7, 1.5, 2.5, 4, 8, 20]; let n = 0, maxD = 0, minL = 999, minO = 999;
    const luecken = async svg => { const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" ')); await img.decode(); const c = document.createElement('canvas'); c.width = c.height = 300; const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, 300, 300).data; let mx = 300, my = 300;
      for (let yy = 0; yy < 300; yy++) for (let xx = 0; xx < 300; xx++) { const i = (yy * 300 + xx) * 4; if (d[i + 3] > 100 && d[i] + d[i + 1] + d[i + 2] < 300) { if (xx < mx) mx = xx; if (yy < my) my = yy; } } return [mx, my]; };
    for (const ra of rassenABC()) for (let i = 0; i < 12; i++) { const al = alter[i % alter.length], p = neuesPferd({ id: 'kb' + ra.id + i, rasse: ra.id, plaetze: Array(8).fill(ra.id), geschlecht: i % 2 ? 'Stute' : 'Hengst', alter: al, name: 'n' + i });
      const dv = document.createElement('div'); dv.innerHTML = kopfBild(p); document.body.appendChild(dv); await kopfMessen(dv.firstElementChild); const [l, o] = await luecken(dv.innerHTML); dv.remove(); n++; const dd = Math.abs(l - o); maxD = Math.max(maxD, dd); minL = Math.min(minL, l); minO = Math.min(minO, o);
      if (dd > 4 || l < 5 || o < 5) bad.push(ra.id + ' ' + al + ' J. ' + p.geschlecht + ': links ' + l + ' px, oben ' + o + ' px'); }
    return { n, bad, maxD, minL, minO }; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(x)));
  ok(`${R.n} Köpfe: Ohren und Nase haben gleichen Abstand zum Rand (größter Unterschied ${R.maxD} px von 300)`, !R.bad.length, R.bad.slice(0, 10));
  ok('nichts berührt den Rand (kleinster Abstand links ' + R.minL + ' px, oben ' + R.minO + ' px)', R.minL >= 5 && R.minO >= 5, [R.minL, R.minO]);
  ok('keine Seitenfehler', !errs.length, errs);
  console.log(out.join('\n')); await b.close();
})();
