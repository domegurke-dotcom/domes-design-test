// Kamm (v636): wirkt mit dem Finger (Touch) über Mähne, Schopf und Schweif – nicht über Bauch/Fell; Handy 390×844
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/kamm-test.js [BxH]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true }); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const cdp = await ctx.newCDPSession(pg);
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const wisch = async pts => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0][0], y: pts[0][1] }] });
    for (const [x, y] of pts) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
  const vorbereiten = () => pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const bx = spiel.boxen[0]; const p = neuesPferd({ rein: true, rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: 'K' }); p.pflege = erzeugePflege(p); p.dreck = { fell: 0, maehne: 80, seit: null }; bx.pferd = p; bx.krippeVoll = true; bx.mistig = false;
    aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); aktenModus = 'pflege'; aktenReiter = 'ausruestung'; putzModus = true; zeigeStall(); zeigeTag(); zeigeAkte(); document.getElementById('stall').scrollIntoView({ block: 'center' });
    document.querySelector('[data-putz="kamm"]').click(); });
  const punkte = sel => pg.evaluate(sel => { const e = document.querySelector('#pferdPlatz ' + sel); if (!e) return null; const r = e.getBoundingClientRect(), P = [];
    if (e.getTotalLength) { const L = e.getTotalLength(), m = e.getScreenCTM(); for (let i = 0; i <= 30; i++) { const q = e.getPointAtLength(L * i / 30); const s = new DOMPoint(q.x, q.y).matrixTransform(m); P.push([s.x, s.y]); } }
    else for (let i = 0; i <= 30; i++) P.push([r.left + r.width * 0.5 + Math.sin(i) * r.width * 0.3, r.top + r.height * i / 30]); return P; }, sel);
  const dreck = () => pg.evaluate(() => spiel.boxen[0].pferd.dreck.maehne);
  const R = {};
  await vorbereiten(); await pg.waitForTimeout(200); { const P = await punkte('.maehnePfad'); for (let i = 0; i < 6; i++) await wisch(P); R.maehne = await dreck(); }
  await vorbereiten(); await pg.waitForTimeout(200); { const P = await punkte('.schweif'); for (let i = 0; i < 8; i++) await wisch(P); R.schweif = await dreck(); }
  await vorbereiten(); await pg.waitForTimeout(200); { const P = await pg.evaluate(() => { const g = s => document.querySelector('#pferdPlatz ' + s).getBoundingClientRect(), m = g('.maehnePfad'), sw = g('.schweif'), lang = sw.right - m.left, rand = Math.max(16, lang * 0.12), y = m.bottom + rand + 10, x0 = m.right + rand + 4, x1 = sw.left - rand - 4, P = []; for (let i = 0; i <= 30; i++) P.push([x0 + (x1 - x0) * i / 30, y]); return P; }); for (let i = 0; i < 6; i++) await wisch(P); R.bauch = await dreck(); }   // Rumpf: zwischen Mähne und Schweif, unterhalb des Halses
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(x)));
  ok('Kamm über die Mähne (Finger) macht die Mähne sauber', R.maehne < 30, R); ok('Kamm über den Schweif (Finger) wirkt auch', R.schweif < 60, R); ok('Kamm über den Bauch wirkt nicht', R.bauch >= 78, R); ok('keine Seitenfehler', !errs.length, errs);
  console.log(out.join('\n')); await b.close();
})();
