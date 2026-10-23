// v685: Pferde außer Haus (Aufzucht/Ausbildung) und Fohlen in der Pferdeliste antippbar → Steckbrief mit Rücksprung
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  await pg.evaluate(() => { speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; $('dlg').hidden = true; spiel.geld = 20000;
    const h = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 1, name: 'Fernweh' }); h.pflege = erzeugePflege(h); h.werte = h.werte || erzeugeWerte(h);
    (spiel.extern = spiel.extern || []).push({ pferd: h, ort: 'aufzucht', seit: spiel.tag, offen: 0 });
    hofReiter = 'pferde'; zeigeHof('pferde'); });
  const z = await pg.$('[data-pfext="0"]'); ok('Zeile des Pferdes außer Haus ist antippbar', !!z);
  if (z) { await z.click(); await pg.waitForTimeout(300); }
  ok('Steckbrief öffnet sich', await pg.evaluate(() => !$('lese').hidden && /Fernweh/.test($('leseTitel').textContent)));
  await pg.click('#leseZu'); await pg.waitForTimeout(200);
  ok('Zurück in der Pferdeliste', await pg.evaluate(() => $('lese').hidden && !!document.querySelector('[data-pfext="0"]')));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
