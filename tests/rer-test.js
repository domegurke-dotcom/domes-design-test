// RER-Test (v1028): wiederkehrender Kreuzverschlag – Daten vollständig, Risiko nur nach harter Arbeit, Faktoren (Stute, nervös, Stärke, Öl),
// Eichung: Traber-Stute im harten Training (5 von 7 Tagen) ≈ 6 % je Jahr, Spezialfutter, Verdacht/Belastungstest, alte Spielstände bekommen die Anlage.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/rer-test.js · Erwartet: jede Zeile „✓“ und am Ende „alles ok“.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(200); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200);
  const r = await pg.evaluate(() => { spiel.stufenAn = false; const L = []; const ok = (n, c, i = '') => L.push([c ? '✓' : '✗', n, i]);
    const K = KRANK.rer; ok('KRANK.rer vollständig', K && K.n && K.anz.length && K.schwer && K.chronisch && K.rat);
    ['HILFT', 'SCHADET', 'PLAN', 'UCHECK', 'VERDACHT', 'KRANK_INFO', 'TURNIER_GRENZE', 'CHRON', 'STOER_TEXT'].forEach(t => ok(t + '.rer', (0, eval)(t).rer != null));
    ok('URSACHE.rer', typeof URSACHE.rer === 'function'); ok('VERANLAGUNG/VL_INFO', !!VERANLAGUNG.rer && !!VL_INFO.rer);
    Object.keys(VERANLAGUNG.rer.rassen).forEach(x => ok('Rasse ' + x + ' gibt es', !!rasseById(x)));
    ok('nur Experte (fort ohne RER)', KRANK_EXPERTE.includes('rer')); ok('Muskelfutter auch für RER', FUTTER.sp_pssm && SPEZIAL.pssm.fuer.includes('rer'));
    ok('Belastungstest hat Preis', VERDACHT.rer.test.preis > 50 && VERDACHT.rer.test.preis < 300, VERDACHT.rer.test.preis + ' €');
    const neu = (rasse, g, j, f) => { const p = neuesPferd({ name: 'T' + Math.floor(Math.random() * 1e6), rasse, geschlecht: g, alter: j }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); if (f) f(p);
      const bx = spiel.boxen[0]; bx.pferd = p; bx.fohlen = null; bx.tot = false; bx.krippeVoll = true; bx.mistig = false; bx.nachtMist = 0; return [p, bx]; };
    const arbeit = (p, v) => { p.trainHeute = { tag: spiel.tag - 1, liste: [], verbraucht: v }; };
    const ris = (p, bx) => (befundRisiko(p, bx, 'box').find(x => x[0] === 'rer') || [0, 0])[1];
    { const [p, bx] = neu('traber', 'Stute', 5); p.vl = { ...veranlagungVon(p), rer: 0.3 }; arbeit(p, 0); const r0 = ris(p, bx); arbeit(p, 40); const r1 = ris(p, bx);
      ok('kein Risiko ohne harte Arbeit', r0 === 0 && r1 > 0, r0 + ' / ' + r1);
      const zf = (f) => { f(); const x = BEFUND_ZUSATZ.rer(p, bx, 'box', 1, 5); return x; };
      const basis = zf(() => { p.futterStatus = { tag: spiel.tag - 1 }; });
      ok('viel Stärke ×2', Math.abs(zf(() => { p.futterStatus = { tag: spiel.tag - 1, staerkeViel: true }; }) / basis - 2) < 1e-9);
      ok('ölreich ×0,5', Math.abs(zf(() => { p.futterStatus = { tag: spiel.tag - 1, oel: 0.3 }; }) / basis - 0.5) < 1e-9);
      p.futterStatus = { tag: spiel.tag - 1 }; p.geschlecht = 'Wallach'; ok('Stute 1,5× Wallach', Math.abs(basis / BEFUND_ZUSATZ.rer(p, bx, 'box', 1, 5) - 1.5) < 1e-9); p.geschlecht = 'Stute';
    }
    // Eichung: viele Traber-Stuten, 5 von 7 Nächten nach harter Arbeit, normale Fütterung
    const jahrN = 4 * tpj() * 5 / 7; const quote = (rasse, g, N) => { let s = 0; for (let i = 0; i < N; i++) { const [p, bx] = neu(rasse, g, 5); arbeit(p, 40); p.futterStatus = { tag: spiel.tag - 1 }; s += 1 - Math.pow(1 - ris(p, bx), jahrN); } return s / N * 100; };
    const ts = quote('traber', 'Stute', 400), tw = quote('traber', 'Wallach', 300), vs = quote('vollblut', 'Stute', 300), hs = quote('hannoveraner', 'Stute', 200);
    ok('Traber-Stute ≈ 6 %/Jahr', ts > 4 && ts < 8.5, ts.toFixed(1) + ' %'); ok('Traber-Wallach weniger', tw < ts, tw.toFixed(1) + ' %'); ok('Vollblut-Stute 5–12 %', vs > 5 && vs < 12, vs.toFixed(1) + ' %'); ok('Hannoveraner < 0,5 %', hs < 0.5, hs.toFixed(2) + ' %');
    { const [p] = neu('traber', 'Stute', 5); const bf = befundNeu(p, 'rer', 2, URSACHE.rer(p)); bf.bemerkt = spiel.tag; bf.diagnose = spiel.tag; ok('Spezialfutter = Muskelfutter', spezialFuer(p) === 'pssm'); ok('Befund-Name', /RER/.test(KRANK[bf.art].n)); }
    { const [p] = neu("traber", "Stute", 5); veranlagungVon(p); delete p.vl.rer; p.vlReal = 1; const v = veranlagungVon(p); ok('alte Spielstände bekommen die Anlage nach', v.rer > 0, v.rer); }
    return L; });
  r.forEach(([z, n, i]) => console.log(z, n, i)); if (errs.length) console.log('Seitenfehler:', errs.slice(0, 5));
  const bad = r.filter(x => x[0] !== '✓').length + errs.length; console.log(bad ? bad + ' Fehler' : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
