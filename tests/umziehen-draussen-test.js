// v996 (Dome 8.11.): Umziehen (Orte-Fenster: Box → Paddockbox) geht auch, wenn das Pferd gerade draußen auf der Weide steht; der Stand für die Rückkehr zieht mit (neues Box-Fenster, unter Playwright per Schalter an)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { try { localStorage.setItem('zuchtstall-boxfenster', '1'); } catch (e) {} });
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; spiel.admin = true;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P; spiel.boxen[4].paddock = true; aktBox = 0; spiel.aktBox = 0; P.weide = { wid: 'w1', seit: spiel.tag }; spiel.boxen[0].vorWeide = { m: 1 }; zeigeStall(); zeigeSchirm(null); });
  await pg.waitForTimeout(300); await (await pg.$('[data-bx="orte"]')).click(); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const kachel = await pg.$('#info [data-ort="zuPaddock"]'); ok('Pferd draußen: im Orte-Fenster gibt es die Kachel „Paddock-Box“', !!kachel);
  if (kachel) { await kachel.click(); await pg.waitForTimeout(200); const dlg = await pg.$eval('#dlgInhalt', e => e.textContent); ok('Es kommt die Frage „umstellen?“ (nicht „erst zurück in die Box holen“)', /umstellen/.test(dlg) && !/erst zurück in die Box/.test(dlg), dlg.slice(0, 160));
    const bt = (await pg.$$('#dlgKnoepfe button')).find ? null : null; await pg.evaluate(() => { const x = [...document.querySelectorAll('#dlgKnoepfe button')].find(y => /Umstellen/.test(y.textContent)); if (x) x.click(); });
    const s = await pg.evaluate(() => ({ drin: spiel.boxen[4].pferd && spiel.boxen[4].pferd.name, alt: !!spiel.boxen[0].pferd, weide: !!(spiel.boxen[4].pferd && spiel.boxen[4].pferd.weide), vor: !!spiel.boxen[4].vorWeide }));
    ok('Anna steht jetzt in der Paddockbox (Box 5), ist weiter draußen, der Stand für die Rückkehr zog mit', s.drin === 'Anna' && !s.alt && s.weide && s.vor, JSON.stringify(s)); }
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
