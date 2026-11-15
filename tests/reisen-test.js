// v1037: Reisen für alle Stufen und alle Herkunftsländer (EU per Lkw ohne Zoll, Großbritannien mit Zoll + Zollagent, weite Reisen 2 Tage). Mit echten Klicks im Anfänger-Modus.
// Start: [GROESSE=390x844] NODE_PATH=<playwright> node tests/reisen-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: (([w, h]) => ({ width: w, height: h }))((process.env.GROESSE || '1366x768').split('x').map(Number)) }); pg.on('pageerror', e => errs.push(e.message));
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png' }); };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText);
  const knopf = async t => { await pg.click(`#dlgKnoepfe button:has-text("${t}")`); await pg.waitForTimeout(350); };
  const versorgen = () => pg.evaluate(() => spiel.boxen.forEach(x => { if (x.pferd) { x.krippeVoll = true; x.mistig = false; x.mistStufe = 0; if (x.pferd.pflege) x.pferd.pflege.gesundheit = Math.max(80, x.pferd.pflege.gesundheit); } }));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200); await pg.fill('#kaufName', 'Reisehof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.geld = 200000; spiel.admin = false; VET.verbotAb = Object.fromEntries(Object.keys(VET.verbotAb).map(k => [k, 99])); });
  ok('Stufe 1: Reisen frei', await pg.evaluate(() => freiNr() === 1 && freiStufe('markt', 'reisen')));
  // alle Rassen mit Herkunftsland im Ausland haben ein Ziel
  const fehlt = await pg.evaluate(() => RASSEN.map(r => r.id).filter(id => !Object.values(REISE).some(R => R.rassen.includes(id))));
  ok('nur deutsche Rassen ohne Reiseziel', fehlt.every(x => ['traber', 'hannoveraner', 'holsteiner', 'oldenburger', 'trakehner', 'lewitzer'].includes(x)), fehlt.join(' '));
  ok('jedes Ziel hat Angebote', await pg.evaluate(() => Object.keys(REISE).every(z => reiseAngebote(z).length >= 6 && reiseAngebote(z).every(h => REISE[z].rassen.includes(h.rasse)))));
  // 1. Spanien: Kachel im Markt antippen, losfahren, Pferd kaufen
  await pg.evaluate(() => zeigeMarkt(null)); await pg.waitForTimeout(300);
  ok('Kachel „Reisen“ im Pferdemarkt', !!(await pg.$('[data-mb="reisen"]'))); await pg.click('[data-mb="reisen"]'); await pg.waitForTimeout(300);
  ok('15 Ziele als Kacheln', (await pg.$$('[data-reise]')).length === 15, (await pg.$$('[data-reise]')).length); await bild('reisen-ziele');
  await pg.click('[data-reise="spanien"]'); await pg.waitForTimeout(300); let d = await dlgText();
  ok('Spanien: Lkw und kein Zoll im Reisefenster', /nach Spanien/.test(d) && /Lkw/.test(d) && /kein Zoll/.test(d), d.slice(0, 200).replace(/\s+/g, ' '));
  const g0 = await pg.evaluate(() => spiel.geld); await knopf('Losfliegen');
  ok('Reise kostet 1.100 €', g0 - await pg.evaluate(() => spiel.geld) === 1100); await bild('reisen-spanien');
  await pg.click('#nebenSchirm .paar'); await pg.waitForTimeout(300); d = await dlgText(); if (!/Zusammen/.test(d)) { await knopf('Kaufen'); d = await dlgText(); }
  ok('Aufstellung EU: Lkw 3.600 €, Zoll 0, keine Einfuhrsteuer', /Lkw \(2\.400 km\)/.test(d) && /3\.600/.test(d) && /EU: keine/.test(d) && !/Einfuhrumsatzsteuer/.test(d), d.replace(/\s+/g, ' ').slice(0, 300)); await bild('reisen-kauf-eu');
  const k1 = await pg.evaluate(() => { const h = reiseAngebote('spanien')[0]; return { h: h.preis, s: reiseKosten(h, 'spanien').summe, n: spiel.boxen.filter(x => x.pferd).length }; });
  ok('Summe = Preis + 3.600 + 250 + 150', k1.s === k1.h + 4000, k1.s + ' / ' + k1.h);
  const g1 = await pg.evaluate(() => spiel.geld); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  d = await dlgText(); const r1 = await pg.evaluate(() => ({ imp: (spiel.importe || []).length, ank: spiel.importe[0].ankunft - spiel.tag, g: spiel.geld }));
  ok('gekauft: Transport statt Quarantäne, Ankunft in ein paar Tagen', /Transport vorbereitet/.test(d) && r1.imp === 1 && r1.ank >= 1 && r1.ank <= 3 && g1 - r1.g === k1.s, JSON.stringify(r1));
  ok('Heimreise-Knopf am letzten Tag', /Heimreise/.test(await pg.evaluate(() => (document.getElementById('reiseHeim') || {}).innerText || '')));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  for (let i = 0; i < r1.ank; i++) { await versorgen(); await pg.evaluate(() => naechsteNacht()); await pg.waitForTimeout(150); }
  const r1b = await pg.evaluate(() => ({ n: spiel.boxen.filter(x => x.pferd).length, imp: (spiel.importe || []).length, brief: (spiel.post || []).find(p => /ist angekommen/.test(p.betreff || p.titel || '')) }));
  ok('Pferd aus Spanien steht im Stall, Brief „lange Fahrt aus Spanien“', r1b.n === k1.n + 1 && r1b.imp === 0 && r1b.brief && /lange Fahrt aus Spanien/.test(r1b.brief.text || r1b.brief.inhalt || JSON.stringify(r1b.brief)), JSON.stringify(r1b).slice(0, 200));
  // 2. Großbritannien: Zoll/Einfuhrsteuer + Zollagent
  const gb = await pg.evaluate(() => { const L = reiseAngebote('grossbritannien'), w = L.find(h => h.geschlecht === 'Wallach') || L[0], K = reiseKosten(w, 'grossbritannien'); return { t: K.posten.map(p => p[0]).join('|'), w: w.geschlecht }; });
  ok('Großbritannien: Zollagent, Zoll und Einfuhrsteuer', /Zollagent/.test(gb.t) && /Zoll/.test(gb.t) && /Einfuhrumsatzsteuer/.test(gb.t), gb.t);
  // 3. Indien: 2 Tage Reise, 60 Tage Quarantäne
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt('reisen'); }); await pg.waitForTimeout(300);
  await pg.click('[data-reise="indien"]'); await pg.waitForTimeout(300); await knopf('Losfliegen');
  ok('Indien Tag 1: Übernachten statt Heimreise', /Übernachten/.test(await pg.evaluate(() => (document.getElementById('reiseHeim') || {}).innerText || '')));
  await versorgen(); await pg.evaluate(() => naechsteNacht()); await pg.waitForTimeout(150);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt('reisen'); }); await pg.waitForTimeout(300);
  ok('Indien Tag 2: noch unterwegs, Marwari im Angebot, dann Heimreise', await pg.evaluate(() => !!reiseUnterwegs() && /Heimreise/.test((document.getElementById('reiseHeim') || {}).innerText || '') && /Marwari/.test(document.getElementById('nebenSchirm').innerText)));
  await bild('reisen-indien');
  await versorgen(); await pg.evaluate(() => naechsteNacht()); await pg.waitForTimeout(150);
  ok('Tag 3: wieder zu Hause', await pg.evaluate(() => !reiseUnterwegs()));
  // 4. alter Spielstand mit Reise ohne „bis“ (nur ein Tag)
  ok('alte Reise ohne „bis“ gilt nur ihren Tag', await pg.evaluate(() => { spiel.reise = { ziel: 'usa', tag: spiel.tag }; const a = !!reiseUnterwegs(); spiel.reise = { ziel: 'usa', tag: spiel.tag - 1 }; return a && !reiseUnterwegs(); }));
  ok('keine Skriptfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); console.log(L.every(x => x.startsWith('✓')) ? 'alles ok' : 'FEHLER'); await b.close(); })();
