// Mitarbeiter S2 (v862, PLAN-MITARBEITER.md): Pferdewirt Pferdezucht, Startwerte, Berufsbereiche, Grenzen 50/75/100, Lerntempo je Jahreszeit gleich, Aufgaben Pfleger/Pferdewirte, Aufstiegs-Brief
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s2-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    R.name = MA_TYP.pferdewirt.name; R.alt = Object.values(MA_TYP).some(T => /Zucht und Haltung/.test(T.name + T.w + T.mehr));
    R.pflAuf = (MA_AUFGABEN_TYP.pfleger || []).join(','); R.pwAuf = MA_AUFGABEN_TYP.pferdewirt.includes('leicht');
    const mk = (typ, w) => ({ id: 'm' + typ + Math.random(), typ, name: 'Test', wissen: { ...w }, eig: [], gehalt: 300, ab: 0, bis: null });
    spiel.mitarbeiter = [];
    // Lerntempo: Pfleger Haut ab 35, 1 / 3,5 / 9 Jahre, bei Tempo 4/7/10
    const sim = (tempo, jahre) => { const alt = spiel.tempo; spiel.tempo = tempo; const m = mk('pfleger', wissenStart(10, { haut: 35, huf: 25, verhalten: 25 })); const tage = Math.round(jahre * 4 * tpj()); for (let i = 0; i < tage; i++) maLernTag(m, false); spiel.tempo = alt; maMeld = []; return m.wissen; };
    R.t1 = [4, 7, 10].map(t => Math.round(sim(t, 1).haut)); R.t35 = [4, 7, 10].map(t => Math.round(sim(t, 3.5).haut)); R.t9 = [4, 7, 10].map(t => Math.round(sim(t, 9).haut));
    R.tpj = [4, 7, 10].map(t => { const a = spiel.tempo; spiel.tempo = t; const x = tpj(); spiel.tempo = a; return x; }).join('/');
    // Grenzen: Pfleger Fütterung (kein Berufsbereich) bleibt bei 50, Stallmeister 75, alter Wert über der Grenze bleibt
    const p1 = mk('pfleger', wissenStart(48, {})); for (let i = 0; i < 400; i++) maLernt(p1, 'futter', 1); R.grenzeRest = p1.wissen.futter; R.grenzeBB = (() => { const q = mk('pfleger', wissenStart(10, { haut: 98 })); for (let i = 0; i < 400; i++) maLernt(q, 'haut', 1); return q.wissen.haut; })();
    const sm = mk('stallmeister', wissenStart(70, {})); for (let i = 0; i < 400; i++) maLernt(sm, 'zucht', 1); R.grenzeSM = sm.wissen.zucht;
    const hoch = mk('pfleger', wissenStart(10, { futter: 70 })); maLernt(hoch, 'futter', 5); R.bleibt = hoch.wissen.futter;
    // Aufstieg und Grenze als Brief
    maMeld = []; const an = mk('stallbursche', wissenStart(5, { futter: 39.9, klima: 25 })); maLernt(an, 'futter', 1); const gr = mk('pfleger', wissenStart(49.9, {})); maLernt(gr, 'futter', 1); const n0 = spiel.post.length; maMeldSenden();
    const br = spiel.post.slice(0, spiel.post.length - n0 + 1).map(x => x.text).join(' '); R.brief = /erfahren/.test(br) && /Grenze/.test(br) && spiel.post.length === n0 + 1;
    // Kollege Experte: +25 %
    const a = mk('pfleger', wissenStart(10, { haut: 20 })), bb = mk('pfleger', wissenStart(10, { haut: 20 })); spiel.mitarbeiter = [mk('pferdewirtHS', wissenStart(10, { haut: 85 })), a]; maLernt(a, 'haut', 1); spiel.mitarbeiter = [bb]; maLernt(bb, 'haut', 1); R.kollege = Math.round((a.wissen.haut - 20) / (bb.wissen.haut - 20) * 100) / 100;
    // neue Bewerber: Startwerte
    spiel.bewerber = null; R.bwSB = bewerber('stallbursche').length ? Math.round(bewerber('stallbursche').reduce((s, x) => s + x.wissen.huf, 0) / bewerber('stallbursche').length) : null;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Pferdewirt Pferdezucht, alter Name nirgends mehr', R.name === 'Pferdewirt Pferdezucht' && !R.alt, R.name);
  ok('Pfleger ohne leichte Arbeit und Abäppeln, Pferdewirt mit leichter Arbeit', !/leicht|aepfeln/.test(R.pflAuf) && R.pwAuf, R.pflAuf);
  const nah = (L, lo, hi) => L.every(v => v >= lo && v <= hi) && Math.max(...L) - Math.min(...L) <= 3;
  ok('nach 1 Jahr etwa „erfahren“ (40–46), in allen Tempi gleich', nah(R.t1, 40, 46), R.t1.join('/') + ' (tpj ' + R.tpj + ')');
  ok('nach 3,5 Jahren „sehr erfahren“ (58–64)', nah(R.t35, 58, 64), R.t35.join('/')); ok('nach 9 Jahren Experte (80–86)', nah(R.t9, 80, 86), R.t9.join('/'));
  ok('Fremdbereich endet bei 50', R.grenzeRest === 50, R.grenzeRest); ok('Berufsbereich bis 100', R.grenzeBB === 100, R.grenzeBB); ok('Stallmeister bis 75', R.grenzeSM === 75, R.grenzeSM); ok('Wert über der Grenze bleibt', R.bleibt === 70, R.bleibt);
  ok('Aufstieg und Grenze kommen als ein Brief', R.brief); ok('vom Experten-Kollegen lernt man 25 % schneller', Math.abs(R.kollege - 1.25) <= 0.02, R.kollege);
  ok('neue Stallburschen-Bewerber: Hufe um 5 (statt 10)', R.bwSB != null && R.bwSB <= 8, R.bwSB);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
