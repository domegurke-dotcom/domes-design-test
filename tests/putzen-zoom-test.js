// v895: Putzen (Bürste, Kamm) bei 1920×1080 mit 125 % Windows-Skalierung (PC-Zoom 1,124) – vorher Fehler „matrixTransform … SVGMatrix“ in svgPunkt, kein Fortschritt
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/putzen-zoom-test.js
const { chromium } = require('playwright'); const path = require('path'); const out = [];
(async () => {
  for (const zoom of [true, false]) {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 } }); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(z => { try { if (z) localStorage.setItem('zuchtstall-pczoom', '1'); localStorage.setItem('zuchtstall-boxfenster', '1'); } catch (e) {} }, zoom);
  await pg.goto('file://' + path.resolve('index.html')); await pg.waitForTimeout(800);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(500);
  const info = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true;
    const bx = spiel.boxen[0]; const p = neuesPferd({ rein: true, rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: 'K' }); p.pflege = erzeugePflege(p); p.dreck = { fell: 80, maehne: 80, seit: null }; bx.pferd = p; bx.krippeVoll = true; bx.mistig = false;
    aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); zeigeAkte(); return { iw: innerWidth, ih: innerHeight, z: document.documentElement.style.zoom || getComputedStyle(document.documentElement).zoom, bx: boxFensterAn && boxFensterAn() }; });
  await pg.waitForTimeout(300);
  // Werkzeug: Ausrüstung-Kreis → Putzkiste → Bürste (neue Ansicht) – oder direkt über wischStart
  const wege = await pg.evaluate(() => [...document.querySelectorAll('[data-bx]')].map(e => e.dataset.bx).join(','));
  await pg.click('[data-bx="ausruestung"]').catch(e => console.log('kein Ausrüstung-Symbol')); await pg.waitForTimeout(300);
  await pg.click('#boxUI [data-bxring="putzkiste"]').catch(e => console.log('kein putzkiste')); await pg.waitForTimeout(300);
  for (const [tool, feld] of [['buerste', 'fell'], ['kamm', 'maehne']]) {
    await pg.evaluate(() => { const p = spiel.boxen[0].pferd; p.dreck = { fell: 80, maehne: 80, seit: null }; });
    const ok = await pg.evaluate(t => { const e = document.querySelector('[data-bxtool="' + t + '"]') || document.querySelector('[data-putz="' + t + '"]'); if (!e) return false; e.click(); return true; }, tool);
    await pg.waitForTimeout(400);
    const r = await pg.evaluate(() => { const e = document.querySelector('#pferdPlatz'); const q = e.getBoundingClientRect(); return { l: q.left, t: q.top, w: q.width, h: q.height, putz: typeof putzModus !== 'undefined' && putzModus }; });
    // mit Maus über den Pferdekörper wischen (Bildschirm-Pixel = CSS-Pixel × Zoom)
    const zf = zoom ? 1.124 : 1; const cx = (r.l + r.w * 0.45) * zf, cy = (r.t + r.h * 0.5) * zf;
    await pg.mouse.move(cx - 150 * zf, cy); await pg.mouse.down();
    for (let k = 0; k < 60; k++) await pg.mouse.move(cx + Math.sin(k / 3) * 150 * zf, cy + (k % 6) * 12 * zf, { steps: 2 });
    await pg.mouse.up(); await pg.waitForTimeout(300);
    const d = await pg.evaluate(() => spiel.boxen[0].pferd.dreck); out.push(((feld === 'fell' ? d.fell < 40 : d.maehne < 40) ? '✓ ' : '✗ ') + tool + ' wirkt' + (zoom ? ' mit PC-Zoom' : ' ohne Zoom') + ' – ' + JSON.stringify(d));
  }
  out.push((errs.length ? '✗ Seitenfehler: ' + errs.slice(0, 2).join(' | ') : '✓ keine Seitenfehler')); await b.close(); }
  console.log(out.join('\n'));
})();
