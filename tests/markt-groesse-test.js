// v961 (Dome 8.11.): Angebot in den Pferdemarkt-Rubriken – Größen und Anzeige ohne Fehler
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = true; spiel.geld = 1e8;
    const zw = (a, lo, hi) => a >= lo && a <= hi; spiel.kal = null;
    for (const [name, s] of [['Frühling', 0], ['Sommer', 1], ['Herbst', 2], ['Winter', 3]]) { spiel.tag = 1; while (datum().s !== s) spiel.tag++; spiel.markt = null; spiel.marktStand = null; const M = marktNeu(), H = marktpferde();
      ok(`${name}: Privatanzeigen 6–10`, zw(M.privat.length, 6, 10), M.privat.length); ok(`${name}: Pferdehändler 12`, H.length === 12, H.length); ok(`${name}: Auktionshaus 8–12`, zw(M.auktion.length, 8, 12), M.auktion.length);
      ok(`${name}: Fohlenauktion ` + (s === 1 || s === 2 ? '10–20' : '(keine)'), s === 1 || s === 2 ? zw(M.fohlen.length, 10, 20) : M.fohlen.length === 0, M.fohlen.length); ok(`${name}: Tierschutz 2–4`, zw(M.notfall.length, 2, 4), M.notfall.length); }
    spiel.tag = 1; while (datum().s !== 1) spiel.tag++; spiel.markt = null; marktNeu(); const g = gestuetPferde('araber'); ok('Gestüt 3–5 je Rasse', zw(g.length, 3, 5), g.length);
    const M2 = marktNeu(), L2 = [...M2.auktion.map(x => x.pferd.id), ...M2.fohlen.map(x => x.pferd.id), ...M2.privat.map(h => h.id), ...marktpferde().map(h => h.id)]; ok('Keine doppelten Pferde-IDs', new Set(L2).size === L2.length, L2.length + ' / ' + new Set(L2).size);
    spiel.rennKauf = []; verkaufsrennenFremde({ name: 'Testrennen' }, { name: 'VR' }, Math.random, false); ok('Verkaufsrennen: 6–8 fremde Starter', zw(spiel.rennKauf.length, 6, 8), spiel.rennKauf.length);
    ['privat', 'haendler', 'auktion', 'fohlen', 'gestuet', 'tierschutz'].forEach(k => { zeigeSchirm(null); zeigeMarkt(k); ok('Rubrik ' + k + ' wird angezeigt', document.querySelectorAll('#nebenSchirm .paar').length > 0 || k === 'gestuet', k); });
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
