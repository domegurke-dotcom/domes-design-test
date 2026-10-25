// v845 (Dome 25.10.): Leckerli-Tüte am rechten Boxrand – antippen, Möhre/Leckerli geben, Fenster bleibt offen, Regeln wie vorher (3 am Tag)
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/leckerli-test.js [BxH]
const { chromium } = require('playwright'); const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number);
const R = [], ok = (n, v, d) => R.push((v ? '✓ ' : '✗ ') + n + (v || d == null ? '' : ' – ' + d));
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 1000 });
  await pg.addInitScript(() => { localStorage.setItem("zuchtstall-boxfenster", "1"); });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + __dirname + '/../index.html'); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const L = futterkammer().lager; L.moehren = 0.5; L.leckerli = 0.02;
    const p = neuesPferd({ rein: true, rasse: "hannoveraner", geschlecht: "Wallach", alter: 8, name: "Eigen" }); p.pflege = erzeugePflege(p); werteErgaenzen(p); p.werte.ist.vertrauen = 50; spiel.boxen[0].pferd = p;
    spiel.hofFenster = []; aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); });
  await pg.waitForTimeout(500);
  const tuete = async () => { const r = await pg.evaluate(() => { const e = document.querySelector('#leckTuete rect'); const q = e.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, w: q.width, sicht: getComputedStyle(document.getElementById('leckTuete')).display !== 'none' }; }); return r; };
  const t = await tuete(); ok('Tüte ist im Boxbild zu sehen', t.sicht && t.w > 10, JSON.stringify(t));
  ok('Tüte liegt oben (nichts verdeckt sie)', await pg.evaluate(p => { const e = document.elementFromPoint(p.x, p.y); return !!e && !!e.closest('#leckTuete'); }, t), await pg.evaluate(p => { const e = document.elementFromPoint(p.x, p.y); return e ? (e.id || e.getAttribute('class') || e.tagName) : '-'; }, t));
  await pg.mouse.click(t.x, t.y); await pg.waitForTimeout(300);
  ok('Antippen öffnet das Leckerli-Fenster', await pg.evaluate(() => !document.getElementById('dlg').hidden && /Leckerli für Eigen/.test(document.getElementById('dlgInhalt').innerText)));
  const st = () => pg.evaluate(() => { const p = spiel.boxen[0].pferd; return { n: p.leckHeute ? p.leckHeute.n : 0, v: p.werte.ist.vertrauen, m: futterkammer().lager.moehren, offen: !document.getElementById('dlg').hidden, txt: document.getElementById('dlgInhalt').innerText }; });
  for (let i = 0; i < 4; i++) { await pg.click('[data-leckd="moehren"]'); await pg.waitForTimeout(200); }
  const s4 = await st(); ok('4 Möhren gegeben: Zähler 4, Lager −0,4 kg', s4.n === 4 && Math.abs(s4.m - 0.1) < 1e-6, JSON.stringify(s4));
  ok('nur die ersten 3 stärken das Vertrauen (+0,9)', Math.abs(s4.v - 50.9) < 0.01, s4.v);
  ok('Fenster bleibt nach dem Geben offen und zeigt den Zähler', s4.offen && /schon 4 Stück/.test(s4.txt) && /reicht/.test(s4.txt), s4.txt);
  await pg.click('[data-leckd="moehren"]'); await pg.waitForTimeout(200);
  ok('letzte Möhre: Knopf danach gesperrt', await pg.evaluate(() => document.querySelector('[data-leckd="moehren"]').disabled));
  await pg.click('[data-leckd="leckerli"]'); await pg.waitForTimeout(200);
  ok('Leckerli geben geht auch', (await st()).n === 6);
  await pg.click('#dlgKnoepfe button'); await pg.waitForTimeout(200);
  ok('„Fertig“ schließt das Fenster', await pg.evaluate(() => document.getElementById('dlg').hidden));
  if (W >= 1000) { await pg.evaluate(() => bxFensterAuf("versorgung", "heute")); await pg.waitForTimeout(300);
    ok('alte Leckerli-Karte ist im Fenster-Modus weg', await pg.evaluate(() => !document.querySelector('#info [data-leck]'))); await pg.evaluate(() => bxFensterZu()); }
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; p.weide = { seit: spiel.tag, wid: (weiden()[0] || {}).id }; zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(200);
  ok('Pferd draußen: Tüte ausgeblendet', !(await tuete()).sicht);
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
