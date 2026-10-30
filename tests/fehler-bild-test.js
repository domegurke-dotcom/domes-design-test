// v900 (Dome 30.10.): Fehler melden – Abbrechen-Knopf, Bild hochladen (verkleinert als JPEG), keine Skriptfehler
const { chromium } = require('playwright'); const path = require('path'); const zlib = require('zlib');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; aufnahmeStart(); });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  // 1. Abbrechen ohne Eintrag
  await pg.evaluate(() => aufFehlerFrage()); await pg.click('[data-af="ja"]'); await pg.click('[data-af="abbruch"]');
  let r = await pg.evaluate(() => ({ offen: !!document.getElementById('aufFehlerFenster'), n: AUF.laufend.eintraege.filter(e => e.a === 'FEHLER').length }));
  ok('Abbrechen schließt das Fenster ohne Eintrag', !r.offen && r.n === 0, JSON.stringify(r));
  // 2. Bild hochladen
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await pg.evaluate(() => aufFehlerFrage()); await pg.click('[data-af="ja"]');
  await pg.setInputFiles('#aufFehlerDatei', { name: 'x.png', mimeType: 'image/png', buffer: png }); await pg.waitForTimeout(400);
  const hinweis = await pg.evaluate(() => document.getElementById('aufFehlerBild').textContent);
  await pg.fill('#aufFehlerText', 'Test mit Bild'); await pg.click('[data-af="fertig"]');
  r = await pg.evaluate(() => { const e = AUF.laufend.eintraege.filter(x => x.a === 'FEHLER').pop(); return e ? { x: e.x, bild: (e.bild || '').slice(0, 22) } : null; });
  ok('Bild wird als JPEG am Eintrag gespeichert', r && r.x === 'Test mit Bild' && /^data:image\/jpeg/.test(r.bild), JSON.stringify(r) + ' | ' + hinweis);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
