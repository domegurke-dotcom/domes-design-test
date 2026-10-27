// Mitarbeiter S9 (v870, PLAN-MITARBEITER.md): Hinweisblasen a–h vorhanden, Stufen (Lehrgang/Mitlaufen ab Fortgeschritten), Tutorial-Kapitel Mitarbeiter (Stallhygiene-Bewerber, Kalender), alter Spielstand
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s9-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true;
    R.blasen = ['maStaerke', 'maBewerbung', 'wbPassung', 'maAufstieg', 'maGrenze', 'azubiMitlaufen', 'eigeneErfahrung', 'kalender'].filter(k => !HINWEISE[k]);
    R.stufen = [['anf', 'lehrgang'], ['anf', 'mitlaufen'], ['fort', 'lehrgang'], ['fort', 'mitlaufen']].map(([s, k]) => ERFAHRUNG_STUFEN[s][k] === false ? 0 : 1).join('');
    const K = TUT.find(k => k.n === 'Mitarbeiter'); R.schritte = K ? K.schritte.map(s => s[0]) : [];
    // Tutorial-Bewerber: einer mit Stärke Stallhygiene
    spiel.bewerber = null; K.neu(); const L = bewerber('stallbursche'); R.hyg = L.length ? staerken(L[0].wissen).includes('klima') : 'keine Bewerber';
    // alter Mitarbeiter ohne neue Felder
    const alt = { id: 'x', typ: 'stallbursche', name: 'Alt', wissen: { futter: 20, klima: 30 }, eig: [], gehalt: 300, ab: 0, bis: null }; spiel.mitarbeiter = [alt]; maErgaenzen(alt);
    R.alt = urlaubStatus(alt) + ' / ' + inProbe(alt) + ' / ' + maKapazitaet(alt); kalTermine(jzJetzt()); zeigeHof('mitarbeiter'); zeigeHof('kalender');
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Hinweisblasen a–h vorhanden', R.blasen.length === 0, R.blasen.join(','));
  ok('Lehrgang/Mitlaufen erst ab Fortgeschritten', R.stufen === '0011', R.stufen);
  ok('Tutorial Mitarbeiter: Einstellen + Kalender', ['Einstellen', 'Kalender', 'Termine'].every(x => R.schritte.includes(x)), R.schritte.join(' > '));
  ok('Tutorial-Bewerber mit Stärke Stallhygiene', R.hyg === true, R.hyg);
  ok('alter Mitarbeiter: keine Probezeit, Urlaub „noch nicht geplant“', /noch nicht geplant \/ false/.test(R.alt), R.alt);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
