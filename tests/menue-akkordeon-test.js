// v954 (Dome 8.11.): ☰-Menü hat „Aufnahme starten/beenden“; Whiteboard · Boxen: „Dein Wunsch an die Mitarbeiter“ ist ein Akkordeon (zu, bis man es öffnet)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; zeigeSchirm(null); zeigeStall(); });
  // Menü
  await pg.click('#menueKnopf'); ok('Menüpunkt „Aufnahme starten“ da', await pg.evaluate(() => /Aufnahme starten/.test($('mAufnahme').textContent) && !$('menueListe').hidden), await pg.evaluate(() => $('mAufnahme').textContent));
  await pg.click('#mAufnahme'); await pg.waitForTimeout(900); ok('Aufnahme läuft (roter Rahmen)', await pg.evaluate(() => !!AUF.laufend && document.body.classList.contains('aufnahme')));
  await pg.click('#menueKnopf'); ok('Menüpunkt heißt jetzt „Aufnahme beenden“', await pg.evaluate(() => /Aufnahme beenden/.test($('mAufnahme').textContent)), await pg.evaluate(() => $('mAufnahme').textContent));
  await pg.click('#mAufnahme'); ok('Beenden fragt nach dem Namen', await pg.evaluate(() => !$('dlg').hidden && !!$('aufName')));
  await pg.fill('#aufName', 'Menütest'); await pg.click('#dlgKnoepfe button:first-child'); ok('Aufnahme gespeichert und beendet', await pg.evaluate(() => !AUF.laufend && AUF.liste.some(a => /Menütest/.test(a.name))));
  // Whiteboard
  const x0 = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: 'Anni' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[0].pferd = P; const x = bewerber('stallbursche')[0]; (spiel.mitarbeiter = spiel.mitarbeiter || []).push({ id: 'sb', typ: 'stallbursche', name: 'Paul', w: false, wissen: { ...x.wissen }, eig: [], gehalt: x.gehalt, ab: jzJetzt() - 2, bis: null }); wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const d = document.querySelector('details[data-wbwud="0"]'); return { da: !!d, offen: d && d.open, summary: d && d.querySelector('summary').textContent.replace(/\s+/g, ' ').trim(), haken: document.querySelectorAll('[data-wbwu="0:fuettern"]').length }; });
  ok('Wunsch-Block ist ein Akkordeon, anfangs zu', x0.da && !x0.offen, JSON.stringify(x0)); ok('Überschrift zeigt wie viele an sind', /Dein Wunsch an die Mitarbeiter \(\d+ von \d+ an\)/.test(x0.summary || ''), x0.summary);
  await pg.click('details[data-wbwud="0"] summary'); await pg.waitForTimeout(150); ok('Aufklappen zeigt die Haken', await pg.evaluate(() => document.querySelector('details[data-wbwud="0"]').open && document.querySelector('[data-wbwu="0:fuettern"]').offsetParent !== null));
  ok('Aufklappen wählt die Box nicht aus', await pg.evaluate(() => !document.querySelector('.wb-box.gewaehlt')));
  await pg.evaluate(() => zeigeWhiteboard()); ok('Offen bleibt nach dem Neuzeichnen', await pg.evaluate(() => document.querySelector('details[data-wbwud="0"]').open));
  await pg.click('[data-wbwu="0:fuettern"]'); ok('Haken lässt sich ändern', await pg.evaluate(() => wunschEin(spiel.boxen[0].pferd, 'fuettern') === false));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
