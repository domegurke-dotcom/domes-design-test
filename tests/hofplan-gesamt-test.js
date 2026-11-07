// v950 (Dome 8.11.): Hofplan ist beim Öffnen immer eine Gesamtansicht ohne Scrollen (100 %); gescrollt wird nur im Zoom
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); let bad = 0; const errs = [];
  for (const [W, H] of [[1464, 691], [1366, 768], [1920, 1080], [844, 390], [390, 844], [768, 1024]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 900 }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Plan'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; zeigeHof('hof'); });
    await pg.evaluate(() => { const t = [...document.querySelectorAll('button')].find(x => /Hofplan/.test(x.textContent) && x.offsetParent); if (t) t.click(); }); await pg.waitForTimeout(400);
    const m = () => pg.evaluate(() => { const sc = document.querySelector('#planBox .plan-scroll'), s = $('planSvg').getBoundingClientRect(), p = document.querySelector('#nebenSchirm').getBoundingClientRect(); return { ganz: s.top >= p.top - 1 && s.bottom <= p.bottom + 1 && s.left >= 0 && s.right <= innerWidth + 1, innen: sc.scrollHeight > sc.clientHeight + 1 || sc.scrollWidth > sc.clientWidth + 1, breit: Math.round(s.width) }; });
    const a = await m(); const ok1 = a.ganz && !a.innen; console.log((ok1 ? '✓ ' : '✗ ') + `${W}x${H}: Gesamtansicht ohne Scrollen`, ok1 ? '' : JSON.stringify(a)); if (!ok1) bad++;
    await pg.click('[data-pzoom="1"]'); await pg.waitForTimeout(250); const z = await m(); const ok2 = z.innen && z.breit > a.breit; console.log((ok2 ? '✓ ' : '✗ ') + `${W}x${H}: nach Zoom größer und scrollbar im Rahmen`, ok2 ? '' : JSON.stringify(z)); if (!ok2) bad++;
    await pg.close(); }
  console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(bad || errs.length ? 1 : 0); })();
