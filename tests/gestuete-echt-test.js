// Auftrag 19 Teil M4b-1 (17.11.2026): Markt „Gestüte“ zeigt echte Gestüte mit Ort und Hinweis „Fiktive Pferde, reale Orte“ (schwach belegte Rassen vorerst wie bisher)
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/gestuete-echt-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2];
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  for (const [name, vw, vh] of [['pc', 1366, 768], ['hoch', 390, 844]]) {
    const pg = await b.newPage({ viewport: { width: vw, height: vh } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; marktBereich = 'gestuet'; gestuetWahl = null; zeigeMarkt(); });
    await pg.waitForTimeout(400); if (O) await pg.screenshot({ path: `${O}/gestuete-${name}.png`, fullPage: true });
    const txt = await pg.evaluate(() => document.getElementById('nebenSchirm').innerText);
    ok(`${name}: Übersicht nennt echte Gestüte mit Ort`, /Landgestüt Celle/.test(txt) && /Gestüt Marbach/.test(txt) && /Gomadingen-Marbach/.test(txt) && /fiktive Pferde/i.test(txt), txt.slice(0, 200));
    await pg.click('[data-gest="hannoveraner"]'); await pg.waitForTimeout(500); if (O) await pg.screenshot({ path: `${O}/celle-${name}.png` });
    const t2 = await pg.evaluate(() => document.getElementById('nebenSchirm').innerText);
    ok(`${name}: Gestütsseite Celle mit Ort und Hinweis`, /Landgestüt Celle/.test(t2) && /Celle \(Niedersachsen\)/.test(t2) && /Fiktive Pferde, reale Orte/.test(t2), t2.slice(0, 200));
    const h = await pg.evaluate(() => { const p = gestuetPferde('hannoveraner')[0]; return p && p.gestuet; }); ok(`${name}: Gestütspferde tragen den echten Namen (${h})`, h === 'Landgestüt Celle', h);
    const t3 = await pg.evaluate(() => GESTUET_NAMEN.tekke + ' / ' + GESTUET_NAMEN.tinker); ok(`${name}: offene/schwach belegte Rassen unverändert (${t3})`, !/Celle|Marbach/.test(t3) && t3.length > 5, t3);
    await pg.close();
  }
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
