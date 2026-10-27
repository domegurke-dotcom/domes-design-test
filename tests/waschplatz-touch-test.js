// Waschplatz mit dem Finger (v880): Handy hochkant und quer – Abspritzen → Shampoo → Abspülen (Schaum weg) → Abtrocknen, jeweils mit echten Touch-Gesten (CDP)
// Start (Domes PC, siehe CLAUDE.md): node tests/waschplatz-touch-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : '')); const errs = []; const b = await chromium.launch();
  for (const [W, H] of [[390, 844], [844, 390]]) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true }); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message)); const cdp = await ctx.newCDPSession(pg); const tag = `${W}×${H}`;
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
    await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
    await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.shampoo = 5; spiel.geld = 100000; while (datum().s !== 1) spiel.tag++;
      gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 2, zustand: 100 }); spiel.anlage.waschplatz = true; const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Fiona' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); p.dreck = { fell: 70, maehne: 40, seit: null }; p.wasserGewohnt = 9; spiel.boxen[0].pferd = p;
      document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = 'waschplatz'; zeigeAkte(); });
    await pg.waitForTimeout(400);
    const wisch = async pts0 => { const pts = []; pts0.forEach((q, i) => { if (!i) { pts.push(q); return; } const a = pts0[i - 1]; for (let k = 1; k <= 8; k++) pts.push([a[0] + (q[0] - a[0]) * k / 8, a[1] + (q[1] - a[1]) * k / 8]); });   // weiche Bewegung wie ein Finger (das Spiel ignoriert große Sprünge)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0][0], y: pts[0][1] }] }); for (const [x, y] of pts) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
    const koerper = () => pg.evaluate(() => { document.getElementById('stall').scrollIntoView({ block: 'center' }); const r = document.getElementById('pferdPlatz').getBoundingClientRect(); const P = []; for (let i = 0; i <= 24; i++) P.push([r.left + r.width * (i % 2 ? .68 : .32), r.top + r.height * (.38 + (i % 5) * .06)]); return P; });
    const werkzeug = async w => { await pg.evaluate(w2 => { document.getElementById('dlg').hidden = true; document.querySelector(`[data-wasch="${w2}"]`).click(); }, w); await pg.waitForTimeout(700); };
    const bis = async (cond, n = 30) => { for (let i = 0; i < n; i++) { if (await pg.evaluate(cond)) return true; const P = await koerper(); await wisch(P); await pg.waitForTimeout(80); } return await pg.evaluate(cond); };
    await werkzeug('spritzen'); ok(`${tag}: Abspritzen mit dem Finger – Pferd nass`, await bis(() => nassHeute(spiel.boxen[0].pferd)));
    await werkzeug('shampoo'); ok(`${tag}: Einschäumen mit dem Finger – Schaum am Pferd`, await bis(() => spiel.boxen[0].pferd.schaum === spiel.tag)); ok(`${tag}: Shampoo-Vorrat sinkt`, await pg.evaluate(() => spiel.shampoo === 4));
    await werkzeug('spritzen'); ok(`${tag}: Abspülen mit dem Finger – Schaum weg`, await bis(() => spiel.boxen[0].pferd.schaum == null));
    await werkzeug('trocknen'); ok(`${tag}: Abtrocknen mit dem Finger – Pferd trocken`, await bis(() => !nassHeute(spiel.boxen[0].pferd) || spiel.boxen[0].pferd.getrocknet === spiel.tag));
    ok(`${tag}: Seite scrollt beim Wischen nicht weg (Stall bleibt sichtbar)`, await pg.evaluate(() => { const r = document.getElementById('stall').getBoundingClientRect(); return r.bottom > 80 && r.top < innerHeight - 80; }));
    await ctx.close();
  }
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
