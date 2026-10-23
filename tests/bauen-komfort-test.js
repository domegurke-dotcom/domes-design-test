// v673: Gebäude benennen, Alles reparieren, Sammelbrief des Handwerkers, Gruppen im Bauen-Fenster; v672: Flächen-Geschenk für alte Spielstände
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000; gebaeude().push({ gid: 'gpdT', typ: 'sandpaddock', stufe: 1, zustand: 40, preis: 300 }); gebaeude().forEach(g => { g.zustand = Math.min(g.zustand, 60); }); zeigeBauenFenster(); });
  const R = [], ok = (n, c, x) => R.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  ok('Gruppen Gebäude / Anlagen / Weiden und Zäune', await pg.evaluate(() => document.querySelectorAll('details.geb-gruppe').length >= 3));
  ok('Knopf „Alles reparieren“ mit Summe', await pg.evaluate(() => /Alles reparieren · /.test((document.querySelector('[data-allrep]') || {}).textContent || '')));
  // umbenennen
  await pg.evaluate(() => document.querySelector('[data-gname="gpdT"]').click()); await pg.fill('#gebNeuName', 'Hengstpaddock'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(100);
  ok('Sandpaddock hat den eigenen Namen', await pg.evaluate(() => paddockName(gebaeude().find(g => g.gid === 'gpdT')) === 'Hengstpaddock' && /Hengstpaddock/.test(document.getElementById('nebenSchirm').textContent)));
  // alles reparieren
  const n = await pg.evaluate(() => { const g0 = spiel.geld; document.querySelector('[data-allrep]').click(); return { g0, text: document.getElementById('dlgInhalt').textContent.slice(0, 120) }; });
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(100);
  const r = await pg.evaluate((g0) => ({ bez: spiel.geld < g0, alleRep: gebaeude().filter(g => g.typ !== 'heudampfer' && g.zustand < 100).every(g => g.rep) }), n.g0);
  ok('Handwerker bestellt: bezahlt, alle Gebäude mit Reparatur', r.bez && r.alleRep);
  const br = await pg.evaluate(() => { spiel.tag += 3; const n0 = (spiel.post || []).filter(x => /Reparaturen fertig|repariert/.test(x.betreff)).length; reparaturTag(); const neu = (spiel.post || []).filter(x => /Reparaturen fertig|repariert/.test(x.betreff)).length - n0; return { neu, alle: gebaeude().every(g => g.zustand === 100 || g.typ === 'heudampfer') }; });
  ok('Ein Sammelbrief statt vieler', br.neu === 1 && br.alle, JSON.stringify(br));
  // Geschenk
  const f = await pg.evaluate(() => { const H = spiel.hof, b0 = H.bauHa; flaechenGeschenk(); const neuSpiel = H.bauHa === b0; delete H.flaecheV; spiel.tag = 20; flaechenGeschenk(); const alt = H.bauHa === b0 + 1, brief = (spiel.post || []).some(x => /Bauland geschenkt/.test(x.betreff)); flaechenGeschenk(); return { neuSpiel, alt, brief, einmal: H.bauHa === b0 + 1 }; });
  ok('Neues Spiel: kein Geschenk; alter Stand: +1 ha, Brief, nur einmal', f.neuSpiel && f.alt && f.brief && f.einmal, JSON.stringify(f));
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
