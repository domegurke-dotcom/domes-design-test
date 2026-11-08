// v962 (Dome 8.11.): leere Box am PC – gleiche feste Höhe wie Boxen mit Pferd (kein Scrollen beim Durchschalten), Text bei den Symbolen links
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1464, height: 691 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Mama' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[0].pferd = P; spiel.boxen[1].einstreu = 'streuStroh'; zeigeSchirm(null); aktBox = 0; spiel.aktBox = 0; zeigeStall(); });
  const mess = async () => { await pg.waitForTimeout(500); return pg.evaluate(() => { const s = document.getElementById('stall').getBoundingClientRect(), h = document.querySelector('header').getBoundingClientRect(); return { box: aktBox, stH: Math.round(s.height), top: Math.round(s.top), hb: Math.round(h.bottom), doc: document.documentElement.scrollHeight, vh: innerHeight, leer: document.body.classList.contains('bxleer'), info: getComputedStyle(document.getElementById('info')).display, text: !!document.querySelector('.bxleertext'), syms: document.querySelectorAll('[data-bxleer]').length }; }); };
  const A = await mess(); await pg.keyboard.press('ArrowRight'); const B = await mess(); await pg.keyboard.press('ArrowRight'); const C = await mess(); await pg.screenshot({ path: process.argv[2] ? process.argv[2] + '/leerlayout.png' : undefined });
  const R = []; const ok = (n, c, x) => R.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  ok('Box mit Pferd: passt auf den Bildschirm', A.doc <= A.vh && !A.leer, JSON.stringify(A));
  ok('Leere Box: gleiche Stallhöhe wie die Box mit Pferd', B.leer && B.stH === A.stH, A.stH + ' / ' + B.stH);
  ok('Leere Box: kein Scrollen, Stall direkt unter der Kopfleiste', B.doc <= B.vh && B.top === B.hb, JSON.stringify(B));
  ok('Leere Box: Infokasten aus, Text und Symbole links', B.info === 'none' && B.text && B.syms >= 1, JSON.stringify(B));
  ok('Zweite leere Box ebenso', C.leer && C.stH === A.stH && C.doc <= C.vh, JSON.stringify(C));
  // Umbau, reserviert, Admin (Dome: rote Schrift quer, Aktionen als Symbole)
  const S = await pg.evaluate(() => { const o = {}; spiel.boxen[1].gesperrt = true; spiel.boxen[2].reserviert = 'x1'; spiel.pensionAnfragen = [{ angenommen: true, pferd: { id: 'x1', name: 'Biene' } }];
    const zeig = i => { aktBox = i; spiel.aktBox = i; zeigeStall(); return { sperr: (document.querySelector('.bxsperr') || {}).textContent || '', syms: [...document.querySelectorAll('[data-bxleer]')].map(x => x.dataset.bxleer), info: getComputedStyle(document.getElementById('info')).display, doc: document.documentElement.scrollHeight <= innerHeight }; };
    o.umbau = zeig(1); o.res = zeig(2); spiel.admin = true; o.admin = zeig(3); spiel.admin = false; return o; });
  ok('Umbau: rote Schrift quer, kein Infokasten, kein Scrollen', /Umbau/.test(S.umbau.sperr) && S.umbau.info === 'none' && S.umbau.doc && S.umbau.syms.length === 0, JSON.stringify(S.umbau));
  ok('Reserviert: „reserviert für Biene“ quer', /reserviert für Biene/.test(S.res.sperr) && S.res.info === 'none', JSON.stringify(S.res));
  ok('Admin: Symbol Rassen links', S.admin.syms.includes('rassen') && S.admin.syms.includes('markt'), JSON.stringify(S.admin));
  // Handy quer (Dome: Queransicht ebenfalls anpassen)
  const q = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true }); q.on('pageerror', e => errs.push(e.message)); await q.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  await q.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await q.waitForTimeout(500);
  await q.click('#smNeu'); await q.fill('#chName', 'T'); await q.click('[data-stufe="exp"]'); await q.click('#chLos'); await q.waitForTimeout(250); await q.click('#dlgKnoepfe button');
  await q.click('[data-immo="pension"]'); await q.fill('#kaufName', 'W'); await q.click('#dlgKnoepfe button:first-child'); await q.waitForTimeout(250);
  await q.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; zeigeSchirm(null); aktBox = 1; spiel.aktBox = 1; zeigeStall(); }); await q.waitForTimeout(600);
  const Q = await q.evaluate(() => ({ leer: document.body.classList.contains('bxleer'), doc: document.documentElement.scrollHeight, vh: innerHeight, info: getComputedStyle(document.getElementById('info')).display, text: !!document.querySelector('.bxleertext'), syms: document.querySelectorAll('[data-bxleer]').length }));
  ok('Handy quer: leere Box ohne Scrollen, Infokasten aus, Text und Symbole', Q.leer && Q.doc <= Q.vh && Q.info === 'none' && Q.text && Q.syms >= 1, JSON.stringify(Q));
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
