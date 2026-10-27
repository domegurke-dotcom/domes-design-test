// Mitarbeiter S3 (v863, PLAN-MITARBEITER.md): Vorteile je Bereich ab 60/80, nur in den eigenen Boxen, Stallmeister halb, kein doppeltes Zählen
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s3-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nixe' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; spiel.boxen.forEach(x => { x.pferd = null; }); spiel.boxen[0].pferd = p;
    const mk = (typ, w) => maErgaenzen({ id: 'm' + typ, typ, name: 'Test', wissen: wissenStart(20, w), eig: [], gehalt: 300, ab: 0, bis: null });
    const box = spiel.boxen[0], risk = () => { maBoxCache = null; return Object.fromEntries(befundRisiko(p, box, 'box')); };
    spiel.mitarbeiter = []; const r0 = risk();
    spiel.mitarbeiter = [mk('stallbursche', { futter: 85, klima: 65 })]; const r1 = risk(); R.kolik80 = r1.kolik / r0.kolik; R.husten60 = r1.husten / r0.husten;
    spiel.mitarbeiter = [mk('stallbursche', { futter: 65 })]; R.kolik60 = risk().kolik / r0.kolik;
    spiel.mitarbeiter = [mk('stallmeister', { futter: 85 })]; R.sm = risk().kolik / r0.kolik;
    spiel.mitarbeiter = [mk('stallbursche', { futter: 85 }), mk('stallmeister', { futter: 85 })]; R.beide = risk().kolik / r0.kolik;
    spiel.mitarbeiter = [mk('stallbursche', { futter: 85 })]; spiel.boxen[0].maPlan = { stall: '-' }; R.fremdeBox = risk().kolik / r0.kolik; delete spiel.boxen[0].maPlan;
    R.txt = vorteilText('futter', 65); R.txt0 = vorteilText('huf', 30);
    spiel.mitarbeiter = [mk('pfleger', { verhalten: 85 })]; maBoxCache = null; werteErgaenzen(p); p.werte.ist.vertrauen = 30; wertPlus(p, 'vertrauen', 1); const mit = p.werte.ist.vertrauen - 30; spiel.mitarbeiter = []; maBoxCache = null; p.werte.ist.vertrauen = 30; wertPlus(p, 'vertrauen', 1); const ohne = p.werte.ist.vertrauen - 30; R.vertrauen = Math.round(mit / ohne * 100) / 100;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const r = x => Math.round(x * 100) / 100;
  ok('Experte Fütterung: Kolik −20 %', r(R.kolik80) === 0.8, r(R.kolik80)); ok('sehr erfahren Stallhygiene: Husten −10 %', r(R.husten60) === 0.9, r(R.husten60)); ok('sehr erfahren Fütterung: Kolik −10 %', r(R.kolik60) === 0.9, r(R.kolik60));
  ok('Stallmeister halb (−10 % statt −20 %)', r(R.sm) === 0.9, r(R.sm)); ok('zwei Leute im selben Bereich: der bessere zählt (−20 %)', r(R.beide) === 0.8, r(R.beide));
  ok('versorgt er die Box nicht, wirkt nichts', r(R.fremdeBox) === 1, r(R.fremdeBox));
  ok('Antippen zeigt Vorteil und nächste Stufe', /Kolik 10 % seltener/.test(R.txt) && /ab Experte: Kolik 20 %/.test(R.txt) && /noch kein besonderer Vorteil/.test(R.txt0), R.txt + ' | ' + R.txt0);
  ok('Verhalten Experte: Vertrauen wächst schneller', R.vertrauen >= 1.15, R.vertrauen);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
