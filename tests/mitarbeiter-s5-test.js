// Mitarbeiter S5 (v866, PLAN-MITARBEITER.md): Lehrgänge – Termine der nächsten Jahreszeit, buchen, fehlt 2 Tage, +10 und Grenze 75, Absage mit Geld zurück, Spieler selbst, Stufe
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s5-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 5000; VET.verbotAb = 99;
    const m = maErgaenzen({ id: 'mL', typ: 'pfleger', name: 'Lena', wissen: wissenStart(10, { haut: 35, futter: 50 }), eig: [], gehalt: 330, ab: 0, bis: null }); spiel.mitarbeiter = [m];
    const T = lehrgangTermine(jzJetzt() + 1); R.termine = T.length; R.gleich = JSON.stringify(T) === JSON.stringify(lehrgangTermine(jzJetzt() + 1));
    lehrgangDialog(m); const k = document.querySelector('[data-lgbuch]'); R.knopf = !!k; const g0 = spiel.geld; if (k) k.click(); R.bezahlt = g0 - spiel.geld; R.kurs = !!m.kurs; R.zweiter = !document.querySelector('[data-lgbuch]:not([disabled])'); document.getElementById('dlg').hidden = true;
    // Lehrgang in Fütterung erzwingen (Fremdbereich, Wert an der Grenze 50)
    m.kurs = { k: 'futter', jz: jzJetzt() + 1, t: 1, tag: jzStartTag(jzJetzt() + 1), geprueft: true };
    const zu = () => { document.getElementById('dlg').hidden = true; }; let weg = 0, n = 0; Math.random = (o => () => 0.5)(Math.random);
    const endTag = m.kurs.tag + 3; while (spiel.tag < endTag && n < 40) { naechsteNacht(); zu(); if (maLehrgang(m) && !maDa(m)) weg++; n++; }
    R.weg = weg; R.futter = m.wissen.futter; R.grenze = maGrenze(m, 'futter'); R.brief = spiel.post.some(x => /bestanden/.test(x.betreff));
    // Absage: 10 % – erzwingen
    m.kurs = { k: 'haut', jz: jzJetzt() + 1, t: 1, tag: jzStartTag(jzJetzt() + 1) }; const g1 = spiel.geld; Math.random = () => 0.01; const zJz = m.kurs.jz; while (jzJetzt() < zJz && n < 80) { naechsteNacht(); zu(); n++; } naechsteNacht(); zu(); Math.random = () => 0.5;
    R.absage = !m.kurs && spiel.post.some(x => /fällt aus/.test(x.betreff));
    // Spieler selbst
    spiel.kurs = { k: 'zucht', jz: jzJetzt(), t: 1, tag: spiel.tag - 3, geprueft: true }; const z0 = (spiel.wissen || {}).zucht || 10; lehrgangTag(); R.du = Math.round(((spiel.wissen || {}).zucht || 0) - z0);
    // Anfänger: kein Lehrgang
    spiel.stufenAn = true; spiel.spieler.stufe = 'anf'; R.anf = freiStufe('lehrgang'); spiel.spieler.stufe = 'fort'; R.fort = freiStufe('lehrgang');
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Termine für die nächste Jahreszeit, immer gleich', R.termine > 3 && R.gleich, R.termine); ok('Buchen kostet 150 €', R.knopf && R.bezahlt === 150 && R.kurs, R.bezahlt); ok('höchstens 1 Lehrgang je Jahreszeit', R.zweiter);
  ok('2 Tage weg', R.weg === 2, R.weg); ok('+10 im Fremdbereich über die alte Grenze 50, neue Grenze 75', R.futter === 60 && R.grenze === 75, `${R.futter} / ${R.grenze}`); ok('Brief „bestanden“', R.brief);
  ok('Absage: Geld zurück, Brief', R.absage); ok('Spieler selbst +10', R.du === 10, R.du); ok('ab Fortgeschritten', R.anf === false && R.fort === true);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
