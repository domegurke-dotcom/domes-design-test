// v713 (Dome 23.10.): Tritt auf nassem Boden – Herbst/Winter täglich = Matsch, alle 2 Tage im Herbst hält, Winter ohne Pferde erholt sich
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/weide-tritt-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 700 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.stockmass = 160; spiel.boxen[0].pferd = P;
    const W = weiden()[0]; W.ha = 1;
    const tagFuer = s => { for (let t = 20; t < 200; t++) if (datum(t - 1).s === s) return t; };
    const lauf = (s, nachts, tage) => { W.gras = 70; W.matsch = 10; let t = tagFuer(s); for (let i = 0; i < nachts; i++) { spiel.tag = t + i; if (datum(spiel.tag - 1).s !== s) break; const aus = tage === 1 || i % 2 === 0; if (aus) P.weide = { seit: spiel.tag, wid: W.wid }; else delete P.weide; grasNacht(); } delete P.weide; return { m: W.matsch, g: W.gras }; };
    const NAME = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
    const r = {}; [0, 1, 2, 3].forEach(s => { r[s] = { d: lauf(s, 6, 1), z: lauf(s, 6, 2), keine: (() => { W.gras = 70; W.matsch = 40; const t = tagFuer(s); for (let i = 0; i < 6; i++) { spiel.tag = t + i; grasNacht(); } return W.matsch; })() }; });
    out.push('Matsch nach 6 Nächten (täglich / alle 2 Tage / keine Pferde ab 40): ' + [0, 1, 2, 3].map(s => `${NAME[s]} ${r[s].d.m} / ${r[s].z.m} / ${r[s].keine}`).join(' · '));
    ok('Sommer: kaum Matsch, auch täglich', r[1].d.m < 10);
    ok('Herbst täglich: mehr Matsch als alle 2 Tage', r[2].d.m > r[2].z.m + 3, r[2].d.m + ' vs ' + r[2].z.m);
    ok('Herbst alle 2 Tage: bleibt etwa gleich', r[2].z.m <= 13, '' + r[2].z.m);
    ok('Winter täglich: deutlich matschig', r[3].d.m > 25, '' + r[3].d.m);
    ok('Winter alle 2 Tage: immer noch mehr Matsch als ohne Pferde', r[3].z.m > r[3].keine - 30 && r[3].z.m > 10, r[3].z.m + ' vs ' + r[3].keine);
    ok('Winter ohne Pferde: Weide erholt sich', r[3].keine < 40, '' + r[3].keine);
    ok('Herbst/Winter täglich: Gras leidet stärker als alle 2 Tage', r[3].d.g < r[3].z.g, r[3].d.g + ' vs ' + r[3].z.g);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
