// v942 (Dome, nach Recherche): Einstreu-Werte – Pellets ohne Härte-Malus, Leinstroh/Hanf zählt als staubend und wird bei Atemwegskrankheiten nicht mehr empfohlen
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/einstreu-werte-test.js   (~5 s, klein)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true;
    ok('Pellets: kein Härte-Malus mehr', EINSTREU.pellets.wohl === undefined && !EINSTREU.pellets.wohlTxt && EINSTREU.pellets.strahl === 0.7);
    ok('Pellets-Text ohne „hart“', !/hart/.test(FUTTER.pellets.info), FUTTER.pellets.info);
    ok('Leinstroh/Hanf zählt als staubend, bleibt weich (+0,8)', EINSTREU.leinstroh.staub === true && EINSTREU.leinstroh.wohl === 0.8 && EINSTREU.leinstroh.strahl === 0.8);
    ok('Leinstroh/Hanf-Text ohne „staubarm“ als Vorteil', !/und staubarm|weich und staubarm/.test(FUTTER.leinstroh.info) && /Staub/.test(FUTTER.leinstroh.info), FUTTER.leinstroh.info);
    ok('Späne bleiben staubarm, Stroh staubend', !EINSTREU.spaene.staub && EINSTREU.streuStroh.staub === true && EINSTREU.spaene.strahl === 1 && EINSTREU.streuStroh.strahl === 1);
    ['husten', 'erkaeltung', 'asthma', 'influenza', 'druse'].forEach(k => ok('Rat bei ' + k + ' ohne Leinstroh/Hanf, mit Späne und Pellets', !EINSTREU_RAT[k][0].includes('leinstroh') && EINSTREU_RAT[k][0].includes('spaene') && EINSTREU_RAT[k][0].includes('pellets')));
    ok('Rat bei Kolik/Hufrehe/Arthrose, Strahlfäule und Mauke unverändert mit Leinstroh/Hanf', ['kolik', 'hufrehe', 'arthrose', 'strahlfaeule', 'mauke', 'hufabszess'].every(k => EINSTREU_RAT[k][0].includes('leinstroh')));
    ok('Rang: Leinstroh/Hanf nicht mehr „besser“ als Stroh in der Pension (staub-Flag)', einstreuRang('leinstroh') === 0.8 && einstreuRang('streuStroh') === 0 && einstreuRang('pellets') === 1 && einstreuRang('spaene') === 1);
    return out; });
  R.forEach(l => console.log(l)); console.log(R.every(l => l.startsWith('✓')) && !errs.length ? 'alles ok' : 'FEHLER ' + errs.join(' | ')); await b.close(); })();
