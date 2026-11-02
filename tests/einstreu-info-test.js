// v942 (Dome 2.11.): Futterkammer – „i“ bei jeder Einstreu klappt Vor- und Nachteile auf; bleibt nach dem Kaufen offen
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/einstreu-info-test.js [Ordner für Bilder]   (~10 s, klein)
const { chromium } = require('playwright'); const path = require('path');
const BILD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; let alle = true;
  for (const [w, h] of [[1366, 768], [844, 390], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; zeigeFutterkammerFenster(() => { }, ''); });
    await pg.waitForTimeout(300);
    const ok = (n, c, x) => { if (!c) alle = false; console.log((c ? '✓ ' : '✗ ') + `${w}x${h} ` + n + (x ? ' – ' + x : '')); };
    const knoepfe = await pg.$$eval('[data-fkinfo]', a => a.map(x => x.dataset.fkinfo));
    ok('vier i-Knöpfe bei den Einstreuarten', knoepfe.sort().join() === ['leinstroh', 'pellets', 'spaene', 'streuStroh'].join(), knoepfe.join(','));
    ok('Futter ohne i-Knopf (nur Einstreu)', (await pg.$$eval('.fk-zeile .gl-info-k', a => a.length)) === 4);
    ok('alle Infos zu Beginn zu', (await pg.$$eval('.fk-einfo', a => a.every(x => x.hidden))));
    const kurz = await pg.$$eval('.fk-zeile:has([data-fkinfo]) .fk-info > small', a => a.map(x => x.innerText));
    ok('Kurztext nur noch „x kg je Box und Tag“ (alte Erklärung entfernt)', kurz.length === 4 && kurz.every(x => /^\d+ kg je Box und Tag/.test(x) && !/saugfähig|staubt|weich|staubarm/.test(x)), kurz.join(' | '));
    await pg.click('[data-fkinfo="pellets"]');
    const t =await pg.$eval('#fke-pellets', e => ({ h: e.hidden, txt: e.innerText }));
    ok('Pellets aufgeklappt mit Vor- und Nachteilen', !t.h && /Vorteile/.test(t.txt) && /Nachteile/.test(t.txt) && /Strahlfäule/.test(t.txt) && /angefeuchtet/.test(t.txt));
    if (BILD) { await pg.$eval('#fke-pellets', e => e.scrollIntoView({ block: 'center' })); await pg.screenshot({ path: path.join(BILD, `einstreu-info-${w}x${h}.png`) }); }
    await pg.click('[data-fkinfo="streuStroh"]');
    ok('zweite Info unabhängig geöffnet', !(await pg.$eval('#fke-streuStroh', e => e.hidden)) && !(await pg.$eval('#fke-pellets', e => e.hidden)));
    await pg.click('[data-fkauf="pellets:20"]'); await pg.waitForTimeout(300);
    ok('nach dem Einkaufen bleiben beide offen', !(await pg.$eval('#fke-pellets', e => e.hidden)) && !(await pg.$eval('#fke-streuStroh', e => e.hidden)));
    await pg.click('[data-fkinfo="pellets"]');
    ok('nochmal antippen klappt zu', await pg.$eval('#fke-pellets', e => e.hidden));
    // Auswahlfenster „Einstreu für Box …“: gleiche Info, alte Kurzerklärung weg, „i“ wählt nichts aus
    await pg.evaluate(() => { const F = futterkammer(); ['streuStroh', 'spaene', 'pellets', 'leinstroh'].forEach(k => F.lager[k] = 200); spiel.boxen[0].einstreu = 'streuStroh'; zeigeStall && 0; einstreuWahl(spiel.boxen[0], () => { }); });
    await pg.waitForTimeout(200);
    const kn = await pg.$$eval('[data-estrinfo]', a => a.map(x => x.dataset.estrinfo));
    ok('Auswahlfenster: vier i-Knöpfe', kn.length === 4, kn.join(','));
    const kurzW = await pg.$$eval('[data-estreu] > small:first-of-type', a => a.map(x => x.innerText));
    ok('Auswahlfenster: nur „x kg je Box und Tag“, alte Erklärung weg', kurzW.length === 4 && kurzW.every(x => /^\d+ kg je Box und Tag/.test(x) && !/saugfähig|staubt|weich|staubarm/.test(x)), kurzW.join(' | '));
    await pg.click('[data-estrinfo="spaene"]');
    ok('Auswahlfenster: i zeigt Vor- und Nachteile, wählt die Sorte nicht', !(await pg.$eval('#estri-spaene', e => e.hidden)) && /Nachteile/.test(await pg.$eval('#estri-spaene', e => e.innerText)) && (await pg.evaluate(() => spiel.boxen[0].einstreu)) === 'streuStroh' && (await pg.$$('#dlg:not([hidden]) [data-estreu]')).length === 4);
    if (BILD) { await pg.screenshot({ path: path.join(BILD, `einstreu-wahl-${w}x${h}.png`) }); }
    await pg.click('[data-estrinfo="spaene"]'); ok('Auswahlfenster: nochmal antippen klappt zu', await pg.$eval('#estri-spaene', e => e.hidden));
    await pg.click('[data-estreu="spaene"]'); await pg.waitForTimeout(200);
    ok('Auswahlfenster: Tippen auf die Sorte wählt sie weiter aus', (await pg.evaluate(() => spiel.boxen[0].einstreu)) === 'spaene');
    ok('Seite ohne Zoom/Querscroll', await pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await pg.close(); }
  console.log(alle && !errs.length ? 'alles ok' : 'FEHLER ' + errs.join(' | ')); await b.close(); })();
