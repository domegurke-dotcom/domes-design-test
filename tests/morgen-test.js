// Morgenrunde mit Pensionspferd (v630): hofMorgen darf nicht abbrechen (Kommentar verschluckte früher eine Zeile in besitzerAuto → kein Einzug, keine Preisprüfung, keine Mitarbeiter)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/morgen-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; const R = {};
    spiel.stufenAn = true; spiel.spieler.stufe = 'anf';   // Anfänger: futterFest() → besitzerAuto läuft für Pensionspferde
    pensionAnfrageNeu(); const a = spiel.pensionAnfragen[0]; R.anfrage = !!a; R.annehmen = pensionAnnehmen(a) === '';
    spiel.tag += 1; try { hofMorgen(); R.morgen1 = true; } catch (e) { R.morgen1 = false; R.fehler = e.message; }
    R.eingezogen = einstellerListe().length === 1 && !spiel.boxen.some(x => x.reserviert) && spiel.pensionAnfragen.length === 0;
    spiel.tag += 1; try { hofMorgen(); R.morgen2 = true; } catch (e) { R.morgen2 = false; R.fehler = e.message; }
    return R; });
  const out = [], ok = (n, c) => out.push((c ? '✓ ' : '✗ ') + n);
  ok('Anfrage angenommen', R.anfrage && R.annehmen); ok("Morgenrunde 1 läuft durch", R.morgen1); ok('Pferd zieht am nächsten Morgen ein', R.eingezogen); ok('Morgenrunde 2 mit Einsteller läuft durch', R.morgen2); ok('keine Seitenfehler', !errs.length);
  console.log(out.join('\n')); await b.close();
})();
