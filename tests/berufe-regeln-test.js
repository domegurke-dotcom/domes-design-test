// Berufe-Regeln (v881, Dome 27.10.): Pferdewirt Pferdezucht nur im Zuchtstall (ab klein), Bereiter nur im Ausbildungsstall (ab klein), Pferdewirt Haltung und Service nur Pension/Gnadenhof, Hofhelfer ohne ⭐ Stark
// Start (Domes PC, siehe CLAUDE.md): node tests/berufe-regeln-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; R.boxen = spiel.boxen.length;
    const mit = arten => { spiel.hof.art = arten[0]; spiel.stallarten = arten; return { pw: maVerfuegbar('pferdewirt'), be: maVerfuegbar('bereiter'), hs: maVerfuegbar('pferdewirtHS') }; };
    R.pension = mit(['pension']); R.zucht = mit(['zucht']); R.ausb = mit(['ausbildung']);
    // Hofhelfer: kein ⭐ Stark, keine Sterne an den Balken
    const h = maErgaenzen({ id: 'hh', typ: 'hofhelfer', name: 'Hans', w: false, wissen: wissenStart(5, { klima: 50 }), eig: [], gehalt: 280, ab: 0, bis: null }); spiel.mitarbeiter = [h];
    spiel.hof.art = 'pension'; spiel.stallarten = ['pension']; mitarbeiterDialog('hofhelfer'); const t = document.getElementById('dlgInhalt').textContent; R.hofhelferStark = /Stark in|noch keine Stärke/.test(t) || !!document.querySelector('#dlgInhalt .ma-wissen .stark');
    const p = maErgaenzen({ id: 'pf', typ: 'pfleger', name: 'Pia', w: true, wissen: wissenStart(5, { haut: 60 }), eig: [], gehalt: 330, ab: 0, bis: null }); spiel.mitarbeiter = [p]; mitarbeiterDialog('pfleger'); R.pflegerStark = /Stark in/.test(document.getElementById('dlgInhalt').textContent);
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok(`kleiner Stall (${R.boxen} Boxen): Pferdewirt Pferdezucht nur im Zuchtstall`, !R.pension.pw && R.zucht.pw && !R.ausb.pw, JSON.stringify([R.pension.pw, R.zucht.pw, R.ausb.pw]));
  ok('Bereiter nur im Ausbildungsstall, schon im kleinen Stall', !R.pension.be && !R.zucht.be && R.ausb.be, JSON.stringify([R.pension.be, R.zucht.be, R.ausb.be]));
  ok('Pferdewirt Haltung und Service nur in der Pension', R.pension.hs && !R.zucht.hs && !R.ausb.hs);
  ok('Hofhelfer: keine ⭐ Stärke, kein goldener Balken', !R.hofhelferStark); ok('Pfleger zeigt weiter „Stark in …“', R.pflegerStark);
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
