// v816 (Dome 24.10.): Einsteller zieht mit offener Rechnung aus → Schuld bleibt, Mahnungen laufen weiter, am Ende Inkasso
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/pension-schuld-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false;
    const mk = () => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Schuldi' }); P.pflege = erzeugePflege(P); spiel.boxen[0].pferd = P; P.einsteller = 'ex1';
      const e = { eid: 'ex1', vn: 'Ina', nn: 'Test', w: true, haltung: 'box', leistungen: {}, zufr: 30, stufe: 1, preis: 200, offen: { box: 200, leist: 0, faellig: spiel.tag + 2, mahn: 1, gebuehr: 20 }, kuendigt: jzJetzt() - 1, kuendGrund: 'preis' }; einstellerListe().push(e); return e; };
    // 1. Auszug mit offener Rechnung
    mk(); const post0 = spiel.post.length; pensionAuszug(einstellerListe()[0], 'zu teuer');
    ok('Einsteller ist weg, die Schuld steht in pensionSchulden', !einstellerListe().length && (spiel.pensionSchulden || []).length === 1, JSON.stringify(spiel.pensionSchulden));
    ok('Brief „schuldet noch Geld“', spiel.post.slice(0, spiel.post.length - post0 + 1).some(x => /schuldet noch Geld/.test(x.betreff)));
    // 2. Mahnung, wenn nicht bezahlt
    const R0 = Math.random; Math.random = () => 0.99; spiel.tag = spiel.pensionSchulden[0].faellig; pensionZahlungTag();
    ok('nicht bezahlt → Mahnung mit Gebühr, Schuld bleibt', spiel.pensionSchulden.length === 1 && spiel.pensionSchulden[0].mahn === 2 && spiel.post.some(x => /Mahnung an Ina Test/.test(x.betreff)), JSON.stringify(spiel.pensionSchulden[0]));
    // 3. bezahlt
    Math.random = () => 0.1; const g0 = spiel.geld; spiel.tag = spiel.pensionSchulden[0].faellig; pensionZahlungTag();
    ok('zahlt doch → Geld gebucht, Schuld weg, Brief', !spiel.pensionSchulden.length && spiel.geld > g0 && spiel.post.some(x => /hat bezahlt/.test(x.betreff)), `${g0} → ${spiel.geld}`);
    // 4. Inkasso
    mk(); pensionAuszug(einstellerListe()[0], 'zu teuer'); Math.random = () => 0.99; let n = 0; while (spiel.pensionSchulden.length && n++ < 10) { spiel.tag = spiel.pensionSchulden[0].faellig; pensionZahlungTag(); }
    ok('nie bezahlt → nach den Mahnungen Inkasso-Brief, Schuld erledigt', !spiel.pensionSchulden.length && spiel.post.some(x => /Inkasso/.test(x.betreff)), String(n));
    Math.random = R0;
    // 5. Hof-Feld
    ok('pensionSchulden gehört zum Hof (HOF_FELDER)', HOF_FELDER.includes('pensionSchulden'));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join('; ') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
