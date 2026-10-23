// v715 (Dome 23.10.): Avatare der Angestellten – nach Geschlecht, möglichst jeder nur einmal; Whiteboard und Mitarbeiter-Fenster
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/avatar-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 1000 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = true; spiel.spieler.stufe = 'fort'; VET.verbotAb = 99;
    ok('Avatare geladen: 12 Frauen, 11 Männer', MA_BILDER.w.length === 12 && MA_BILDER.m.length === 11);
    ok('jeder Avatar ist ein SVG', [...MA_BILDER.w, ...MA_BILDER.m].every(s => /^<svg [^>]*viewBox/.test(s) && s.includes('</svg>')));
    const J = jzJetzt() - 1, L = [];
    for (let i = 0; i < 13; i++) L.push({ id: 'tw' + i, name: 'Frau' + i, typ: 'stallbursche', ab: J, bis: null, gehalt: 300, zufr: 80, w: true, wissen: {}, eig: [] });
    for (let i = 0; i < 4; i++) L.push({ id: 'tm' + i, name: 'Mann' + i, typ: 'pfleger', ab: J, bis: null, gehalt: 300, zufr: 80, w: false, wissen: {}, eig: [] });
    spiel.mitarbeiter = L; const nrW = L.filter(m => m.w).map(maAvaNr), nrM = L.filter(m => !m.w).map(maAvaNr);
    ok('Frauen: die ersten 12 haben 12 verschiedene Gesichter', new Set(nrW.slice(0, 12)).size === 12, nrW.join(','));
    ok('die 13. Frau wiederholt erst jetzt eins', new Set(nrW).size === 12);
    ok('Männer: 4 verschiedene Gesichter', new Set(nrM).size === 4, nrM.join(','));
    ok('Gesicht bleibt je Person fest', L.every(m => maAvaNr(m) === m.av));
    ok('Frau bekommt nie ein Männer-Bild (Index im Frauen-Pool)', nrW.every(n => n >= 0 && n < 12));
    spiel.mitarbeiter = L.slice(0, 2).concat(L.slice(13, 15)); spiel.mitarbeiter.forEach(m => delete m.av);
    const h = spiel.mitarbeiter.map(m => maAva(m, 30)).join(''); ok('maAva liefert Kreis mit SVG', (h.match(/class="ma-ava"/g) || []).length === 4 && h.includes('xMidYMin slice'));
    while (spiel.boxen.length < 4) spiel.boxen.push({ pferd: null });
    ['Anna', 'Berta'].forEach((n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; });
    wbSicht = 'boxen'; zeigeBoxen();
    ok('Whiteboard Boxen: kleine Avatare bei den zugeteilten Mitarbeitern', document.querySelectorAll('.wb-ma-zeile .ma-ava').length >= 1, '' + document.querySelectorAll('.wb-ma-zeile .ma-ava').length);
    ok('Whiteboard unten: Avatar statt Symbol', document.querySelectorAll('#wbMaReihe .wb-ma .ma-ava').length === spiel.mitarbeiter.length);
    mitarbeiterDialog('stallbursche');
    ok('hvw Mitarbeiter: Avatar bei den Angestellten', document.querySelectorAll('#dlg .ma-karte .ma-ava').length >= 1);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler');
  if (ORD) { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; wbSicht = 'boxen'; zeigeBoxen(); }); await pg.waitForTimeout(300); await pg.screenshot({ path: ORD + `/ava-wb-${W}x${H}.png` }); await pg.evaluate(() => { mitarbeiterDialog('stallbursche'); }); await pg.waitForTimeout(300); await pg.screenshot({ path: ORD + `/ava-ma-${W}x${H}.png` }); }
  await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
