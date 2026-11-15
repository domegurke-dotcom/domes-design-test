// v1038 (Dome 15.11.2026): keine Modi mehr – Freischalt-Stufen 1–4 durch Erfahrungspunkte, „Alles freischalten“, alte Spielstände alles frei,
// Krankheiten im 1. Jahr seltener und ohne Tod, Pfändungsschutz/Tierhalteverbot im 1. Jahr, Weihnachtsspende 2.500 € für alle. Mit echten Klicks.
// Start: [GROESSE=390x844] NODE_PATH=<playwright> node tests/freischalt-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: (([w, h]) => ({ width: w, height: h }))((process.env.GROESSE || '1366x768').split('x').map(Number)) }); pg.on('pageerror', e => errs.push(e.message));
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png' }); };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText);
  const knopf = async t => { await pg.click(`#dlgKnoepfe button:has-text("${t}")`); await pg.waitForTimeout(350); };
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.waitForTimeout(250);
  ok('Startmenü: keine Wahl der Erfahrung mehr', !(await pg.$('[data-stufe]')) && !/Deine Erfahrung/.test(await pg.evaluate(() => document.getElementById('charakter').innerText)));
  await bild('frei-charakter');
  await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200); await pg.fill('#kaufName', 'Freihof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.geld = 50000; });
  const s1 = await pg.evaluate(() => ({ frei: spiel.frei, nr: freiNr(), akt: stufeAktiv(), zucht: freiStufe('zucht'), privat: freiStufe('markt', 'privat'), haendler: freiStufe('markt', 'haendler'), rar: freiStufe('markt', 'raritaeten'),
    futterplan: freiStufe('futterplan'), training: freiStufe('training'), charakter: freiStufe('charakter'), reiterWahl: freiStufe('reiterWahl'), merkNoten: freiStufe('merkNoten'),
    krankF: STUFE().krankF, krankTod: STUFE().krankTod, krank: STUFE().krank, pfaend: pfaendSchutz(), vet: vetVerbotAb(), halle: freiStufe('bauen', 'reithalle'), stall: freiStufe('bauen', 'stall') }));
  ok('neues Spiel: Stufe 1 mit 0 Punkten', s1.nr === 1 && s1.frei && s1.frei.punkte === 0, JSON.stringify(s1.frei));
  ok('Stufe 1: Händler ja, Privat/Raritäten/Zucht nein', s1.haendler && !s1.privat && !s1.rar && !s1.zucht);
  ok('Stufe 1: Stall ja, Reithalle noch nicht', s1.stall && !s1.halle);
  ok('Hilfen für alle: Futterplan, freies Training, Charakter, Reiterwahl, Noten', s1.futterplan && s1.training && s1.charakter && s1.reiterWahl && s1.merkNoten);
  ok('1. Jahr: alle Krankheiten, seltener (×0,5), ohne Tod', s1.krank === null && s1.krankF === 0.5 && s1.krankTod === false, JSON.stringify([s1.krank, s1.krankF, s1.krankTod]));
  ok('1. Jahr: Pfändungsschutz, Tierhalteverbot erst ab 4', s1.pfaend && s1.vet === 4);
  // Pferdemarkt zeigt nur freie Bereiche
  await pg.evaluate(() => zeigeMarkt(null)); await pg.waitForTimeout(300);
  ok('Pferdemarkt: Händler da, Privatanzeigen nicht', !!(await pg.$('[data-mb="haendler"]')) && !(await pg.$('[data-mb="privat"]')));
  // Punkte durch Versorgung: Pferd kaufen (5 Punkte), versorgen, Nacht
  const p0 = await pg.evaluate(() => { const h = Object.values(marktNeu()).find(a => Array.isArray(a) && a.length)[0]; pferdEinstellen(h, h.preis, "Händler"); return spiel.frei.punkte; });
  ok('Kauf bringt 5 Punkte', p0 === 5, p0);
  const p1 = await pg.evaluate(() => { spiel.boxen.forEach(x => { if (x.pferd) { x.krippeVoll = true; x.kraftVoll = true; x.mistig = false; x.wasserTag = spiel.tag; } }); const v = spiel.frei.punkte; naechsteNacht(); return spiel.frei.punkte - v; });
  ok('voll versorgtes Pferd bringt abends 1 Punkt', p1 >= 1, p1);
  const p2 = await pg.evaluate(() => { const v = spiel.frei.punkte; naechsteNacht(); return spiel.frei.punkte - v; });
  ok('unversorgt: kein Punkt', p2 === 0, p2);
  // Stufe 2 bei 150 Punkten: Brief + Privatanzeigen frei
  const s2 = await pg.evaluate(() => { erfahrung(FREI_PUNKTE[2] - spiel.frei.punkte, "Test"); const br = (spiel.post || []).find(x => /Neu freigeschaltet: Stufe 2/.test(x.betreff || '')); return { nr: freiNr(), privat: freiStufe('markt', 'privat'), labor: freiStufe('labor'), zucht: freiStufe('zucht'), br: br && br.text }; });
  ok('Schwelle Stufe 2, Brief mit Liste, Privat + Labor frei, Zucht noch nicht', s2.nr === 2 && s2.privat && s2.labor && !s2.zucht && /Privatanzeigen/.test(s2.br || ''), JSON.stringify(s2).slice(0, 200));
  const s3 = await pg.evaluate(() => { erfahrung(FREI_PUNKTE[3] - spiel.frei.punkte, "Test"); return { nr: freiNr(), zucht: freiStufe('zucht'), hoefe: STUFE().hoefe, renn: freiStufe('stallart', 'renn'), aqua: freiStufe('bauen', 'aqua') }; });
  ok('Schwelle Stufe 3 – Zucht, 2 Höfe, noch kein Rennstall/Aqua', s3.nr === 3 && s3.zucht && s3.hoefe === 2 && !s3.renn && !s3.aqua, JSON.stringify(s3));
  // Einstellungen: Knopf zeigt Stufe und Punkte, „Alles freischalten“ mit Klicks
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; hofReiter = 'einst'; zeigeHof(); }); await pg.waitForTimeout(300);
  const kt = await pg.evaluate(() => (document.getElementById('hfStufe') || {}).innerText || '');
  ok('Einstellungen: Freischalt-Stufe 3 von 4 mit Punkten', /Freischalt-Stufe 3 von 4/.test(kt) && /noch 350 Punkte bis Stufe 4/.test(kt), kt.replace(/\s+/g, ' '));
  await pg.click('#hfStufe'); await pg.waitForTimeout(300); let d = await dlgText();
  ok('Fenster: Balken, Stufen mit ✅/🔒', /Freischalt-Stufe 3 von 4/.test(d) && /✅/.test(d) && /🔒/.test(d) && !!(await pg.$('.frei-balken')), d.slice(0, 120).replace(/\s+/g, ' ')); await bild('frei-fenster');
  await knopf('Alles freischalten'); d = await dlgText(); ok('Rückfrage „nicht rückgängig“', /nicht rückgängig/.test(d));
  await knopf('Ja, alles freischalten');
  const s4 = await pg.evaluate(() => ({ nr: freiNr(), alles: spiel.frei.alles, rar: freiStufe('markt', 'raritaeten'), renn: freiStufe('stallart', 'renn'), aqua: freiStufe('bauen', 'aqua'), hoefe: STUFE().hoefe }));
  ok('alles frei: Raritäten, Rennstall, Aqua, 5 Höfe', s4.nr === 4 && s4.alles && s4.rar && s4.renn && s4.aqua && s4.hoefe === 5, JSON.stringify(s4));
  // nach dem 1. Jahr: Krankheiten echt, kein Schutz mehr
  const j2 = await pg.evaluate(() => { spiel.tag = 4 * tpj() + 2; return { krankF: STUFE().krankF, tod: STUFE().krankTod, pfaend: pfaendSchutz(), vet: vetVerbotAb() }; });
  ok('ab dem 2. Jahr: Krankheiten ×1 mit Tod, kein Pfändungsschutz, Verbot ab 3', j2.krankF === 1 && j2.tod === true && !j2.pfaend && j2.vet === 3, JSON.stringify(j2));
  // Weihnachtsspende 2.500 € (Tempo 7)
  const sp = await pg.evaluate(() => { spiel.spendeNr = 0; const g = spiel.geld; const t0 = spiel.tag; while (datum().s !== 3) spiel.tag++; weihnachtsSpende(); spiel.tag = t0; return spiel.geld - g; });
  ok('Weihnachtsspende 2.500 € für alle (1. Winter)', sp === 2500, sp);
  // alter Spielstand ohne spiel.frei → beim Laden alles frei
  await pg.evaluate(() => { speicherSperre = true; const s = JSON.parse(JSON.stringify(spiel)); delete s.frei; s.spieler.stufe = "anf"; schreiben("zuchtstall-v2", s); });
  await pg.reload(); await pg.waitForTimeout(600);
  const alt = await pg.evaluate(() => ({ frei: spiel.frei, nr: freiNr(), rar: freiStufe('markt', 'raritaeten') }));
  ok('alter Spielstand: alles frei', alt.frei && alt.frei.alles && alt.frei.alt && alt.nr === 4 && alt.rar, JSON.stringify(alt));
  ok('keine Skriptfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); console.log(L.every(x => x.startsWith('✓')) ? 'alles ok' : 'FEHLER'); await b.close(); })();
