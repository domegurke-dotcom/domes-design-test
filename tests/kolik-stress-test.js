// v671: Hengst unruhig wegen Stuten im Stall → Kolik-Risiko ×1,5 in der Folgenacht, Ursache „Stress“
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Hengst', alter: 8, name: 'Hengsti' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); const box = spiel.boxen[0]; box.pferd = P; box.krippeVoll = true;
    const k0 = befundRisiko(P, box, 'box').find(x => x[0] === 'kolik')[1]; P.stressTag = spiel.tag; const k1 = befundRisiko(P, box, 'box').find(x => x[0] === 'kolik')[1];
    ok('Kolik-Risiko ×1,5 nach unruhiger Nacht', Math.abs(k1 / k0 - 1.5) < 1e-6, k0 + ' → ' + k1);
    P.stressTag = spiel.tag - 3; const k2 = befundRisiko(P, box, 'box').find(x => x[0] === 'kolik')[1]; ok('Nach 3 Tagen wieder normal', Math.abs(k2 / k0 - 1) < 1e-6);
    P.stressTag = spiel.tag; ok('Ursache nennt den Stress', URSACHE.kolik(P, 'box', box) === 'Stress – Stuten im Stall');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
