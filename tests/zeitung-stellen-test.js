// 17.11.2026 (Dome): Die Stellengesuche im Kreisboten sind eigene Bewerber – nicht die der Personalvermittlung. „Bewerbung ansehen“ öffnet sie, einstellen kostet keine Gebühr.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/zeitung-stellen-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2];
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 50000; spiel.mitarbeiter = []; const Z = zeitungDaten(); Z.abo = true; zeitungZustellen(Z); });
  /* Zeitung mit aktueller Ausgabe: Stellengesuche mit eigenem Knopf */
  const sl = await pg.evaluate(() => { const typen = Object.keys(MA_TYP).filter(t => t !== 'azubi' && maVerfuegbar(t)).slice(0, ZEITUNG.stellen); return { typen, zeitung: typen.map(t => (zeitungBewerber(t)[0] || {}).name), agentur: typen.flatMap(t => bewerber(t).map(x => x.name)) }; });
  ok(`Zeitung hat ${sl.zeitung.length} eigene Bewerber (${sl.zeitung.join(', ')})`, sl.zeitung.length >= 1 && sl.zeitung.every(Boolean));
  ok('kein Zeitungs-Bewerber steht auch bei der Agentur', sl.zeitung.every(n => !sl.agentur.includes(n)), JSON.stringify(sl));
  await pg.evaluate(() => { zeigeMarkt('zeitung'); }); await pg.waitForTimeout(400);
  const seite = await pg.evaluate(() => { const z = document.querySelector('[data-zma]'); if (z) z.scrollIntoView(); return !!z; });
  if (O) await pg.screenshot({ path: O + '/Z0-zeitung.png', fullPage: true });
  const T = await pg.evaluate(() => (document.body.innerText || ''));
  ok('Zeitung zeigt „Bewerbung ansehen“ statt „Zu den Mitarbeitern“', (await pg.$$('[data-zma]')).length >= 1 || /Bewerbung ansehen/.test(T), T.slice(0, 200));
  /* Knopf öffnet die Bewerbung im Mitarbeiter-Fenster, vor der Agentur-Liste */
  const typ = sl.typen[0], name = sl.zeitung[0];
  const sicht = await pg.evaluate((t) => { mitarbeiterDialog(t); const x = document.getElementById('dlgInhalt').innerText, i1 = x.indexOf('Stellengesuch aus dem'), i2 = x.indexOf('Personalvermittlung (Agentur)'); return { i1, i2, keine: /keine Gebühr/.test(x) }; }, typ);
  if (O) await pg.screenshot({ path: O + '/Z1-bewerbung.png' });
  ok('Fenster: erst „Stellengesuch aus dem Kreisbote“ (ohne Gebühr), danach die Personalvermittlung', sicht.i1 >= 0 && sicht.i2 > sicht.i1 && sicht.keine, JSON.stringify(sicht));
  /* einstellen: ohne Gebühr, Probezeit, Bewerber verschwindet aus der Zeitung */
  const g0 = await pg.evaluate(() => spiel.geld); await pg.click('[data-einstz="0"]'); await pg.waitForTimeout(300);
  const r = await pg.evaluate((t) => ({ geld: spiel.geld, ma: (spiel.mitarbeiter || []).map(m => m.name + ':' + m.typ), probe: (spiel.mitarbeiter || [])[0] && (spiel.mitarbeiter || [])[0].probe, nochDa: zeitungBewerber(t).length }), typ);
  if (O) await pg.screenshot({ path: O + '/Z2-eingestellt.png' });
  ok(`${name} ist eingestellt, ohne Gebühr, mit Probezeit`, r.ma.includes(name + ':' + typ) && r.geld === g0 && r.probe != null, JSON.stringify(r));
  ok('der Bewerber steht nicht mehr in der Zeitung', r.nochDa === 0);
  /* ohne Abo keine Zeitungs-Bewerber */
  const ohne = await pg.evaluate((t) => { zeitungDaten().abo = false; return zeitungBewerber(t).length; }, typ); ok('ohne Zeitungsabo gibt es keine Zeitungs-Bewerber', ohne === 0);
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
