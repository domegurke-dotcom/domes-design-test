// v1041 (Dome 14.11.2026): Termin-Liste für ganz Deutschland im Pferdemarkt (im neuen Spiel im HufNetz) – alle Pferdemärkte/Auktionen aus REGION_TERMINE
// mit Entfernung zum Hof, Filter nach Art, Sortieren nach Datum/Entfernung, am Termin-Tag hinfahren (auch weit weg, mit Hotel). Mit echten Klicks.
// Start: [GROESSE=390x844] NODE_PATH=<playwright> node tests/termine-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: (([w, h]) => ({ width: w, height: h }))((process.env.GROESSE || '1366x768').split('x').map(Number)) }); pg.on('pageerror', e => errs.push(e.message));
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png', fullPage: false }); };
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200);
  await pg.selectOption('#kaufLand', '09'); await pg.waitForTimeout(100); await pg.selectOption('#kaufOrt', 'Landshut'); await pg.waitForTimeout(100);
  await pg.fill('#kaufName', 'Terminhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.geld = 20000; });
  // 1. Kachel schon in Stufe 1 sichtbar
  await pg.evaluate(() => zeigeMarkt(null)); await pg.waitForTimeout(300);
  ok('Kachel „Termine“ im Pferdemarkt (Stufe 1)', !!(await pg.$('[data-mb="termine"]')), await pg.evaluate(() => spiel.frei && spiel.frei.stufe));
  await pg.click('[data-mb="termine"]'); await pg.waitForTimeout(300); await bild('termine-liste');
  const r1 = await pg.evaluate(() => { const zeilen = [...document.querySelectorAll('#nebenSchirm .fin-posten')].map(x => x.innerText.replace(/\s+/g, ' ')); const erw = termineListe();
    const weit = erw.filter(t => t.km > ZEITUNG.umkreis).length; return { n: zeilen.length, erw: erw.length, weit, z: zeilen.slice(0, 3), alleKm: erw.every(t => t.km != null) }; });
  ok('Liste zeigt alle Termine bis Ende nächster Jahreszeit', r1.n === r1.erw && r1.n >= 5, r1.n + ' / ' + r1.erw);
  ok('auch Termine weiter als 100 km (ganz Deutschland)', r1.weit > 0, r1.weit + ' weiter weg');
  ok('jede Zeile mit Entfernung', r1.alleKm && r1.z.every(z => / km\)/.test(z)), r1.z.join(' | '));
  // 2. Filter Auktion
  await pg.click('[data-tw="art"][data-twv="auktion"]'); await pg.waitForTimeout(250);
  const r2 = await pg.evaluate(() => [...document.querySelectorAll('#nebenSchirm .fin-posten')].map(x => x.innerText));
  ok('Filter „Auktionen“ zeigt nur Auktionen', r2.length > 0 && r2.every(t => /Auktion/.test(t) && !/Fohlenauktion/.test(t.split('·')[0])), r2.length + ' Zeilen');
  await pg.click('[data-tw="art"][data-twv=""]'); await pg.waitForTimeout(200);
  // 3. Sortieren nach Entfernung
  await pg.click('[data-tw="sort"][data-twv="km"]'); await pg.waitForTimeout(250); await bild('termine-km');
  const r3 = await pg.evaluate(() => [...document.querySelectorAll('#nebenSchirm .fin-posten small')].map(x => +((x.innerText.match(/\((\d+) km\)/) || [])[1])));
  ok('nach Entfernung sortiert', r3.length > 1 && r3.every((k, i) => !i || k >= r3[i - 1]), r3.slice(0, 6).join(', '));
  // 4. Termin-Tag eines weiten Termins: hinfahren (zwei Tage mit Hotel)
  const ziel = await pg.evaluate(() => { const t = termineListe().filter(x => x.km > BESUCH.tagKm).sort((a, b) => a.tag - b.tag)[0]; if (!t) return null; spiel.tag = t.tag; zeigeMarkt('termine'); return t; });
  await pg.waitForTimeout(300);
  ok('weiter Termin gefunden (> 250 km)', !!ziel, ziel ? ziel.n + ' ' + ziel.km + ' km' : '-');
  if (ziel) { const kn = await pg.$(`[data-dtermin="${ziel.n}"]`); ok('Knopf „Heute – hinfahren“ am Termin-Tag', !!kn); await bild('termine-heute');
    if (kn) { await kn.click(); await pg.waitForTimeout(350); const d = await pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText.replace(/\s+/g, ' '));
      ok('Besuchsfenster mit Hotel für weite Fahrt', /Hotel/.test(d) && d.includes(ziel.ort), d.slice(0, 200)); await bild('termine-fahrt'); } }
  console.log(L.join('\n')); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' | ') : '✓ keine Seitenfehler');
  console.log(L.some(l => l[0] === '✗') || errs.length ? 'FEHLER' : 'alles ok'); await b.close(); })();
