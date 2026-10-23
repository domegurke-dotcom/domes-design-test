// v707: Anbau zählt zum Stall (verschmolzen), Zaunerweiterungen zur Weide (Eigentum/Pacht getrennt), Boxen in 2er-Schritten abreißen
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/verschmelzen-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000;
    spiel.gebaeude = [{ gid: 'S', typ: 'stall', stufe: 2, zustand: 83, boxen: 6, preis: 6000 }, { gid: 'A', typ: 'stall', stufe: 2, zustand: 78, boxen: 2, anbau: 'S', preis: 2000 }];
    spiel.boxen = []; for (let i = 0; i < 8; i++) spiel.boxen.push({ pferd: null, geb: i < 6 ? 'S' : 'A', stufe: 2 });
    ok('Anbau gleicher Stufe wird verschmolzen', gebVerschmelzen() === 1 && !gebaeude().some(g => g.gid === 'A'));
    const S = gebaeude().find(g => g.gid === 'S'); ok('8 Boxen, Zustand nach Boxen gewichtet (82 %)', S.boxen === 8 && Math.round(S.zustand) === 82 && spiel.boxen.every(x => x.geb === 'S'), S.boxen + ' ' + S.zustand);
    ok('Name ohne „Anbau“', !/Anbau/.test(gebName(S)));
    gebaeude().push({ gid: 'T', typ: 'stall', stufe: 3, zustand: 100, boxen: 2, anbau: 'S', preis: 3000 }); ok('Andere Stufe bleibt getrennt', gebVerschmelzen() === 0 && gebaeude().some(g => g.gid === 'T')); spiel.gebaeude = gebaeude().filter(x => x.gid !== 'T');
    // Zäune
    spiel.hof.pacht = 2; spiel.gebaeude = gebaeude().filter(g => g.typ !== 'weide'); spiel.gebaeude.push({ gid: 'W', typ: 'weide', stufe: 1, zustand: 90, ha: 1, wid: 'w1', preis: 1000 }, { gid: 'W2', typ: 'weide', stufe: 1, zustand: 70, ha: 1, ziel: 'w1', preis: 1000 }, { gid: 'W3', typ: 'weide', stufe: 1, zustand: 100, ha: 1, ziel: 'w1', pacht: true, preis: 1000 }, { gid: 'W4', typ: 'weide', stufe: 1, zustand: 100, ha: 1, ziel: 'w1', pacht: true, preis: 1000 });
    ok('Zaun-Erweiterungen verschmelzen, Pacht getrennt (2 ha eigen, 2 ha Pacht)', gebVerschmelzen() >= 2 && (() => { const z = gebaeude().filter(g => g.typ === 'weide'); return z.length === 2 && z.find(g => g.wid).ha === 2 && z.find(g => g.pacht).ha === 2; })(), JSON.stringify(gebaeude().filter(g => g.typ === 'weide').map(g => g.gid + ':' + g.ha + (g.pacht ? 'P' : ''))));
    // Pacht-Teile untereinander: Elternteil ist der Haupt-Zaun, Pacht-Teile haben anderes pacht-Flag → werden nicht untereinander verschmolzen (Anzeige als „+x“) – hier prüfen wir nur die Trennung
    // Abriss in 2er-Schritten
    abrissDialog(S, null); ok('Abriss-Dialog fragt nach der Anzahl', !!document.getElementById('abrMenge') && document.getElementById('abrMenge').options.length === 4, [...document.getElementById('abrMenge').options].map(o => o.value).join());
    document.getElementById('abrMenge').value = '2'; [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Weiter/.test(x.textContent)).click();
    ok('Bestätigungsfrage für 2 Boxen', /2 Boxen von/.test(document.getElementById('dlgInhalt').textContent));
    [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Abreißen/.test(x.textContent)).click();
    const t = gebaeude().find(g => g.abriss); ok('2 Boxen abgespalten, Abriss läuft, Boxen gesperrt', !!t && t.boxen === 2 && S.boxen === 6 && spiel.boxen.filter(x => x.gesperrt).length === 2);
    abrissFertig(t); ok('Nach dem Abriss 6 Boxen', spiel.boxen.length === 6 && S.boxen === 6);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
