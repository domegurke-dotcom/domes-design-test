// Dome 21.11.2026: zum Spielstart ein Erbe von 50.000 € – nach dem Hofkauf per Brief, auf dem Hofkonto, zählt nicht als Gewinn; nicht im Tutorial-Testhof.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/erbe-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Lindenhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
    let r = await pg.evaluate(() => { const br = (spiel.post || []).find(q => q.betreff === 'Ein Erbe für Ihren Hof' || q.betreff === 'Ein Erbe für deinen Hof'); const J = (spiel.finanzen || {})[String(datum().j)] || {};
      return { geld: spiel.geld, erbe: spiel.erbe, br: br && br.id, text: br ? br.text.replace(/<[^>]+>/g, ' ') : '', posten: J.Erbe || null, neutral: BILANZ_NEUTRAL.includes('Erbe'), soll: START_KAPITAL - IMMOBILIEN.find(I => I.id === 'pension').eigen + START_ERBE }; });
    ok(`Spielstart: ${r.geld} € auf dem Konto (5.000 € nach dem Hofkauf + 50.000 € Erbe)`, r.geld === r.soll && r.erbe === 50000 && r.posten && r.posten.ein === 50000, JSON.stringify(r).slice(0, 300));
    ok('Brief vom Notariat: Erbe von 50.000 €, Hofname genannt, zählt nicht als Gewinn', !!r.br && /50\.000/.test(r.text) && /Lindenhof/.test(r.text) && /nicht als Gewinn/.test(r.text) && r.neutral, r.text.slice(0, 300));
    const tipp = await pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').innerText); await bild('E0-tipp');
    ok('Start-Tipp erwähnt das Erbe', !tipp || /Erbe/.test(tipp) || !/ersten 2 Jahre/.test(tipp), tipp.slice(0, 200));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; zeigeHof('post'); }); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); }
    await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(400); await bild('E1-brief');
    /* Finanzen: Erbe steht in „darin enthalten“ */
    await pg.evaluate(() => { finanzTab = 'konto'; zeigeHof('finanzen'); }); await pg.waitForTimeout(300); await bild('E2-finanzen');
    const t = await pg.innerText('body');
    ok('Finanzen zeigen das Erbe getrennt („darin enthalten: … Erbe +50.000 €“)', /darin enthalten:[^)]*Erbe \+50\.000/.test(t), (t.match(/darin enthalten[^)]*\)/) || [''])[0].slice(0, 300));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
