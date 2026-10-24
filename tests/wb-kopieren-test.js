// v817 (Dome 24.10.): Whiteboard · Weiden – „📋 Kopieren“: Einteilung einer Jahreszeit in eine andere (oder alle anderen) übernehmen
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/wb-kopieren-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const s = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = true; spiel.spieler.stufe = 'fort';
    while (spiel.boxen.length < 6) spiel.boxen.push({ pferd: null });
    const mk = (n, g) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.fz = 5; return P; };
    ['Anna', 'Berta'].forEach((n, i) => { spiel.boxen[i].pferd = mk(n, 'Stute'); spiel.boxen[i].krippeVoll = true; });
    if (!weiden().some(w => w.wid === 'w2')) weiden().push({ wid: 'w2', name: 'Weide 2', ha: 2, gras: 80, matsch: 0 });
    wbSicht = 'weiden'; wbJz = null; wbAnwenden('p:0', 'w:w2:t'); zeigeSchirm(null); zeigeWhiteboard(); return datum().s; });
  ok('Knopf „Kopieren“ steht neben den Jahreszeiten', await pg.$('[data-wbkopie]') !== null);
  await pg.click('[data-wbkopie]'); await pg.waitForTimeout(200);
  const kn = await pg.$$eval('#dlgKnoepfe button', l => l.map(x => x.textContent));
  ok('Auswahl: drei andere Jahreszeiten + „Alle anderen“ + Abbrechen', kn.length === 5 && kn.includes('Alle anderen'), kn);
  await pg.click('#dlgKnoepfe button[data-txt*="Alle anderen"], #dlgKnoepfe button:nth-child(4)'); await pg.waitForTimeout(250);
  ok('Sicherheitsfrage vor dem Überschreiben', await pg.evaluate(() => /überschrieben/.test(document.getElementById('dlg').textContent)));
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const r1 = await pg.evaluate(s0 => { const A = spiel.boxen[0].pferd; return [1, 2, 3].map(d => { const t = (s0 + d) % 4; const e = spiel.wbPlan && spiel.wbPlan[t] && spiel.wbPlan[t][A.id]; return e && e.auslaufZiel; }); }, s);
  ok('Anna steht in allen anderen Jahreszeiten auf Weide 2', r1.every(z => z === 'w2'), r1);
  // andere Jahreszeit planen und in die aktuelle kopieren
  const r2 = await pg.evaluate(s0 => { const B = spiel.boxen[1].pferd, s1 = (s0 + 1) % 4; wbJz = s1; wbAnwenden('p:1', 'w:w1:t'); wbJz = null; wbKopieren(s1, [s0]); return { live: B.auslaufZiel, wg: B.weidegang }; }, s);
  ok('Kopie in die aktuelle Jahreszeit gilt sofort (live am Pferd)', r2.live === 'w1' && r2.wg === 'taeglich', r2);
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join('; ') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
