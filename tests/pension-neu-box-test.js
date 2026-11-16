// 17.11.2026 (Dome): Kommt ein Pensionspferd neu, steht es im Whiteboard bei „Bleiben in der Box“ – nicht bei „Weide egal“. Erst mit Zuteilung geht es raus.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/pension-neu-box-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2];
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = []; document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000; VET.verbotAb = 99; if (datum().s === 3) spiel.kal = null; spiel.mitarbeiter = [];
    pensionRegeln().offen = true; const haltungen = ['weide', 'sandpaddock'], res = [];
    haltungen.forEach(h => { pensionAnfrageNeu(); const a = spiel.pensionAnfragen[spiel.pensionAnfragen.length - 1]; a.haltung = h; const fehler = pensionAnnehmen(a); spiel.tag += 1; pensionEinzug(); const p = a.pferd, bx = spiel.boxen.findIndex(x => x.pferd === p);
      zeigeWhiteboard(); const pl = wbPlanVon(p); res.push({ h, fehler, drin: bx >= 0, plan: pl, auslauf: p.auslauf }); });
    return res; });
  R.forEach(r => { ok(`Pensionspferd (Wunsch ${r.h}) zieht ein`, !r.fehler && r.drin, JSON.stringify(r)); ok(`  … und steht im Whiteboard „in der Box“ (kein Plan, nicht „Weide egal“)`, r.plan === null && r.auslauf === 'box', JSON.stringify(r)); });
  /* nach Zuteilung geht es raus */
  const T = await pg.evaluate(() => { const bx = spiel.boxen.find(x => x.pferd && fremd(x.pferd)), p = bx.pferd; spiel.mitarbeiter = [{ id: 'm1', name: 'Paul', typ: 'stallbursche', ab: jzJetzt() - 1, bis: null, gehalt: 300, zufr: 80, w: false, wissen: {} }];
    const z = wbZiele().find(x => !x.pd); wbSetzen(p, z.id, 'a'); wbSetzen(p, z.id, 'b'); const pl = wbPlanVon(p); return { plan: pl && pl.ziel, auslauf: p.auslauf }; });
  ok('nach der Zuteilung auf eine Weide hat das Pferd einen Plan', !!T.plan && T.auslauf !== 'box', JSON.stringify(T));
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
