// Shampoo-Reste (v853, Dome 26.10.): nicht ausgespültes Shampoo bleibt bis zu 3 Tage im Fell
// Start (Domes PC, siehe CLAUDE.md): node tests/shampoo-reste-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.admin = false;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nixe' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0;
    gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 1, zustand: 100 }); spiel.anlage.waschplatz = true;
    const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    const box = spiel.boxen[0], rz = () => Object.fromEntries(befundRisiko(p, box, 'box'));
    while (datum().s !== 1) nacht();
    // Risiken: Mauke und Sommerekzem ×1,5 mit Shampoo im Fell
    p.befunde = []; delete p.schaum; const r0 = rz(); p.schaum = spiel.tag; const r1 = rz(); delete p.schaum;
    R.mauke = r1.mauke / r0.mauke; R.ekz = r0.sommerekzem ? r1.sommerekzem / r0.sommerekzem : null;
    // Fellglanz zählt mit Rest nicht (Marktwert)
    p.fellGlanz = spiel.tag + 3; const w0 = marktwert(p); p.schaum = spiel.tag; const w1 = marktwert(p); delete p.schaum; R.glanzWeg = w1 < w0;
    // Nächte: drei Nächte Wohlbefinden −1, danach weg
    p.fellGlanz = null; p.schaum = spiel.tag; R.hits = 0; R.rest = [];
    for (let i = 0; i < 5; i++) { nacht(); p.befunde = []; if (JSON.stringify(p.wohlLog || {}).includes('Shampoo im Fell')) R.hits++; R.rest.push(p.schaum != null); }
    // Pfleger spülen immer aus
    const x = bewerber('pfleger')[0]; spiel.mitarbeiter = spiel.mitarbeiter || []; spiel.mitarbeiter.push({ id: 'maT', typ: 'pfleger', name: x.name, w: x.w, wissen: { ...x.wissen }, eig: [...x.eig], gehalt: x.gehalt, ab: jzJetzt(), bis: null });
    p.schaum = spiel.tag; R.pflBox = maBoxen('pfleger').includes(0); waschAbend(); R.pflege = p.schaum == null;
    return R; });
  ok('Mauke ×1,5', Math.abs(A(R.mauke) - 1.5) < 0.01, R.mauke); if (R.ekz != null) ok('Sommerekzem ×1,5', Math.abs(R.ekz - 1.5) < 0.01, R.ekz);
  ok('Fellglanz zählt mit Shampoo im Fell nicht', R.glanzWeg);
  ok('3 Nächte Wohlbefinden-Abzug, dann weg', R.hits === 3, 'Treffer ' + R.hits + ', Rest ' + R.rest.join(','));
  ok('Pfleger spülen aus', R.pflBox && R.pflege, 'Box ' + R.pflBox);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
  function A(x) { return x; }
})();
