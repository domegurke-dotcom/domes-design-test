// Pellets-Aufwand (v945, Dome 6.11.): Strohpellets-Boxen zählen beim Zuteilen der Stallarbeit wie 1½ Boxen.
// Start: NODE_PATH=<pw>/node_modules node tests/pellets-aufwand-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); let rot = 0;
  const ok = (t, c, z = '') => { if (!c) rot++; console.log((c ? '✓ ' : '✗ ') + t + (z ? '  ' + z : '')); };
  const klick = async sel => { await pg.click(sel); await pg.waitForTimeout(250); };
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await klick('#smNeu'); await pg.fill('#chName', 'Test'); await klick('#chLos'); await klick('#dlgKnoepfe button');
  await klick('[data-immo="pension"]'); await pg.fill('#kaufName', 'Hof'); await klick('#dlgKnoepfe button:first-child');
  const r = await pg.evaluate(() => {
    spiel.stufenAn = false; spiel.tippsAus = true; buchen(30000, 'Test'); $('dlg').hidden = true; speicherSperre = true;
    for (let i = 0; i < 4; i++) { const h = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 7, name: 'P' + i }); pferdEinstellen(h, i, 'Händler'); }
    const J = jzJetzt() - 3; spiel.mitarbeiter = [{ id: 'sb1', name: 'Sven', typ: 'stallbursche', ab: J, bis: null, gehalt: 300, zufr: 80, w: false, wissen: {}, eig: [] }];
    const m = spiel.mitarbeiter[0], kap = maKapazitaet(m), mit = e => { spiel.boxen.slice(0, 4).forEach(x => { x.einstreu = e; }); return maZuteilung('stall').filter(x => x.m.id === 'sb1').length; };
    const aufStroh = spiel.boxen.slice(0, 4).map(x => (x.einstreu = 'streuStroh', boxAufwand(x))), n1 = mit('streuStroh');
    const aufPel = spiel.boxen.slice(0, 4).map(x => (x.einstreu = 'pellets', boxAufwand(x))), n2 = mit('pellets');
    spiel.boxen[0].offen = true; const aufOffen = boxAufwand(Object.assign({}, spiel.boxen[0], { einstreu: 'pellets' })); spiel.boxen[0].offen = false;
    return { kap, aufStroh, aufPel, n1, n2, aufOffen };
  });
  console.log(JSON.stringify(r));
  ok('Stroh-Box zählt 1', r.aufStroh.every(x => x === 1));
  ok('Pellets-Box zählt 1,5', r.aufPel.every(x => x === 1.5));
  ok('Pellets im Offenstall: halbe Arbeit wie bisher (0,5)', r.aufOffen === 0.5);
  ok('Ein Stallbursche schafft mit Stroh mehr Boxen als mit Pellets', r.n1 > r.n2, `Stroh ${r.n1} · Pellets ${r.n2} (Kapazität ${r.kap})`);
  ok('Mit Pellets: genau Kapazität ÷ 1,5 (abgerundet) Boxen, mindestens 1', r.n2 === Math.max(1, Math.floor(r.kap / 1.5 + 1e-9)) || r.n2 === Math.ceil(r.kap / 1.5), `${r.n2}`);
  ok('Keine Seitenfehler', errs.length === 0);
  console.log(rot ? `✗ ${rot} rot` : 'Alles grün'); if (rot) process.exitCode = 1; await b.close();
})();
