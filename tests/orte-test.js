// v763 (Domes Aufnahme 24.10., Etappe 1): Fressdauer, Pinnwand größer, Weide im Ort-Plan anklickbar, Büro = Labor, Tutorials-Liste, Schalter „Spielumfang“ weg
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/orte-test.js [BxH] [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [bw, bh] = (process.argv[2] || '1366x768').split('x').map(Number), ordner = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: bw, height: bh }, hasTouch: bw < 900 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Plan'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x != null && !c ? ' – ' + x : ''));
  const bild = async n => { if (ordner) { fs.mkdirSync(ordner, { recursive: true }); await pg.screenshot({ path: path.join(ordner, `orte-${bw}x${bh}-${n}.png`) }); } };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 90000; });
  await pg.evaluate(() => { const mk = (n, r, i) => { const P = neuesPferd({ rasse: r, geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; spiel.boxen[i].krippeVoll = true; return P; }; mk('Anna', 'haflinger', 0); });
  ok('Fressen: 5 Sekunden in der Fressposition', await pg.evaluate(() => FRESS.box === 5000));
  // Ort-Plan: Weide
  const pferd = await pg.evaluate(() => { const i = spiel.boxen.findIndex(x => x.pferd); return i; });
  ok('ein Pferd im Stall zum Testen', pferd >= 0);
  if (pferd >= 0) {
    await pg.evaluate(i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; weiden().forEach(w => { if (!w.wiese) w.gesperrt = { bis: spiel.tag + 3 }; }); zeigeAkte(); }, pferd);
    await pg.waitForTimeout(300);
    ok('Weide-Pfeil im Plan ist anklickbar, auch wenn alle Weiden ruhen', await pg.locator('.pl-pfeil[data-ort="weide"]').count() === 1);
    await pg.locator('.pl-pfeil[data-ort="weide"]').dispatchEvent('click'); await pg.waitForTimeout(300);
    ok('… und sagt, warum es nicht geht', await pg.evaluate(() => /gesperrt|Weide/.test(document.getElementById('dlgInhalt').textContent) && !document.getElementById('dlg').hidden), await pg.evaluate(() => document.getElementById('dlgInhalt').textContent.slice(0, 80)));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
    // Büro
    const buero = await pg.evaluate(() => !!document.querySelector('#planSvg [data-ort="labor"], .plan-scroll.ort [data-ort="labor"]'));
    ok('Büro im Plan öffnet das Labor (data-ort="labor")', buero);
    await pg.evaluate(() => { const e = document.querySelector('.plan-scroll.ort [data-ort="labor"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await pg.waitForTimeout(300);
    ok('… Fenster „Büro“ mit den Gentests', await pg.evaluate(() => ortModus === 'labor' && /Büro/.test(document.body.textContent)));
    await bild('buero');
  }
  // Einstellungen
  await pg.evaluate(() => { zeigeHof('einst'); }); await pg.waitForTimeout(300);
  ok('Schalter „Spielumfang je Stufe“ ist weg', await pg.locator('#hfStufenAn').count() === 0);
  ok('Knopf heißt „Tutorials“', await pg.evaluate(() => /Tutorials/.test(document.getElementById('hfTutorial').textContent) && !/wiederholen/.test(document.getElementById('hfTutorial').textContent)));
  await pg.click('#hfTutorial'); await pg.waitForTimeout(200);
  ok('Tutorials-Fenster hat „Alle Tutorials ansehen“', await pg.evaluate(() => /Alle Tutorials ansehen/.test(document.getElementById('dlgKnoepfe').textContent)));
  await pg.click('#dlgKnoepfe button:has-text("Alle Tutorials ansehen")'); await pg.waitForTimeout(200);
  const anz = await pg.evaluate(() => [document.querySelectorAll('#dlgInhalt [data-tset]').length, TUT_SETS.anf().length + TUT_SETS.fort().length + TUT_SETS.exp().length]);
  ok('Liste zeigt alle Kapitel aller Tutorials', anz[0] === anz[1] && anz[0] > 20, JSON.stringify(anz));
  await bild('tutorials');
  // einzelnes Kapitel → zurück zur Liste
  await pg.click('#dlgInhalt [data-tset="fort"][data-tkap="1"]'); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => ({ e: !!(spiel.tutorial && spiel.tutorial.einzel), k: spiel.tutorial && spiel.tutorial.kap, s: spiel.tutorial && spiel.tutorial.set }));
  ok('Einzelkapitel startet (Fortgeschritten, Kapitel 2)', r.e && r.k === 1 && r.s === 'fort', JSON.stringify(r));
  await pg.evaluate(() => tutKapitelFertig(true)); await pg.waitForTimeout(2000);
  const liste = await pg.evaluate(() => /Alle Tutorials/.test(document.getElementById('dlgInhalt').textContent) && !document.getElementById('dlg').hidden);
  ok('nach dem Kapitel zurück zur Tutorial-Liste (ohne Abschlussfrage)', liste);
  ok('Tutorial-Band ist weg, echtes Spiel läuft', await pg.evaluate(() => !spiel.tutorial && !document.getElementById('tutBand')));
  // Pinnwand
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const bx = spiel.boxen.find(x => x.pferd); const p = bx.pferd; p.schleifen = Array.from({ length: 12 }, (_, i) => ({ st: 1 + i % 3, pl: 1 + i % 6, c: false, von: 8, platz: 1 + i % 6, pruef: 'Dressur A', turnier: 'Test', tag: 5 + i })); pinnwandOeffnen(p); });
  await pg.waitForTimeout(300);
  const w = await pg.evaluate(() => ({ k: document.querySelector('.pinn-karte').getBoundingClientRect().width, s: document.querySelector('.pinn-s svg').getBoundingClientRect().width }));
  ok('Pinnwand größer (Breite, Schleifen)', w.k > 600 || bw < 700, JSON.stringify(w)); ok('Schleifen groß (≥ 60 px am PC)', w.s >= 60 || bw < 700, JSON.stringify(w));
  await bild('pinnwand');
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close();
})();
