// Dome 24.10.: Verwaltung (Ansehen/Zufriedenheit) und Lagerung wie in echt (Futterkammer im Stall, Heu-/Strohlager)
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/verwaltung-lager-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'V'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 90000;
    // --- Verwaltung ---
    const v = gebaeude().find(x => x.typ === 'verwaltung'); ok('Büro Stufe 1 vorhanden', !!v && v.stufe === 1, '');
    pensionRegeln().ansehen = 100; const a1 = ansehenWirk(); ok('Stufe 1 wirkt noch nicht (Ansehen 100)', a1 === 100 && maGebaeudeZufr() === maGebaeudeZufr(), a1);
    const z1 = maGebaeudeZufr(); v.stufe = 2; ok('Stufe 2: Ansehen +8', ansehenWirk() === 108, ansehenWirk()); const z2 = maGebaeudeZufr(); ok('Stufe 2: Mitarbeiter-Zufriedenheit +1', z2 === z1 + 1, z1 + ' → ' + z2);
    v.stufe = 3; ok('Stufe 3: Ansehen +16, Zufriedenheit +2', ansehenWirk() === 116 && maGebaeudeZufr() === z1 + 2, ansehenWirk() + ' / ' + maGebaeudeZufr());
    v.zustand = 40; ok('Unter 50 % Zustand wirkt sie nicht', ansehenWirk() === 100 && maGebaeudeZufr() === z1, ansehenWirk()); v.zustand = 100; v.stufe = 1;
    pensionRegeln().ansehen = 195; v.stufe = 3; ok('Ansehen bleibt bei 200 gedeckelt', ansehenWirk() === 200, ansehenWirk()); v.stufe = 1; pensionRegeln().ansehen = 100;
    // --- Lagerung ---
    const F = futterkammer(); ok('Heu liegt im Lager, Hafer in der Futterkammer', lagerOrt('heu') === 'lager' && lagerOrt('streuStroh') === 'lager' && lagerOrt('hafer') === 'kammer' && lagerOrt('muesli') === 'kammer' && lagerOrt('mineral') === 'kammer' && lagerOrt('leckerli') === 'kammer', '');
    const km = kammerMax(); ok('Futterkammer-Platz: Stall Stufe 1 mit 6 Boxen = 200 + 6 × 30 = 380 kg', km === 380, km);
    F.lager.hafer = 0; F.lager.muesli = 0; F.lager.heu = 0; F.liefer = [];
    ok('Kraftfutter bis zum Platz der Futterkammer', futterKaufen('hafer', 300) === '', ''); ok('… darüber nicht (80 kg frei, 100 kg bestellt)', /Kein Platz mehr in den Futterkammern/.test(futterKaufen('muesli', 100)), '');
    ok('Heu ist davon unabhängig (Lager 2.000 kg)', futterKaufen('heu', 1500) === '', ''); ok('Heu: Lager voll', /Heu- und Strohlager/.test(futterKaufen('heu', 600)), '');
    F.liefer = [];
    // Anbau macht die Futterkammer größer
    const st = gebaeude().find(x => x.typ === 'stall'); const kinder = { gid: 'kx', typ: 'stall', stufe: 1, zustand: 100, boxen: 4, anbau: st.gid, preis: 100 }; gebaeude().push(kinder); ok('Anbau (+4 Boxen) vergrößert die Futterkammer um 120 kg', kammerMax() === 500, kammerMax()); gebaeude().pop();
    st.stufe = 3; ok('Stufe 3: 600 + 180 = 780 kg', kammerMax() === 780, kammerMax()); st.stufe = 1;
    // Anzeige
    hofReiter = 'hof'; hofBereich = 'futter'; zeigeHof('hof'); const t = document.getElementById('nebenSchirm').innerText; ok('Futterkammer-Ansicht zeigt beide Lager', /Heu- und Strohlager/.test(t) && /Futterkammern in den Ställen/.test(t), t.slice(0, 200));
    // Korb
    korb().hafer = 500; korbDialog(() => {}); const d = document.getElementById('dlg').innerText; ok('Korb meldet zu wenig Platz in den Futterkammern', /Futterkammern/.test(d) && /nicht genug Platz/.test(d), d.slice(0, 300)); document.getElementById('dlg').hidden = true; delete korb().hafer;
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
