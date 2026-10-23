// v677: Popup „Neu in deinem Spiel“ beim Laden älterer Spielstände (Test-Schalter: unter Playwright aus, außer localStorage „zuchtstall-neu-an“)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true;
    ok('neues Spiel kennt die aktuelle Version', spiel.neuGesehen === +SPIEL_VERSION);
    // alter Stand, Schalter aus (Playwright): kein Fenster, Version wird nachgezogen
    spiel.neuGesehen = 653; neuesPruefen(); ok('Schalter aus: kein Eintrag, Version nachgezogen', !(spiel.hofFenster || []).length && spiel.neuGesehen === +SPIEL_VERSION);
    // Schalter an
    localStorage.setItem('zuchtstall-neu-an', '1'); spiel.neuGesehen = 653; neuesPruefen();
    const H = (spiel.hofFenster || []).join('');
    ok('Schalter an: Fenster mit allen Einträgen', /Neu in deinem Spiel/.test(H) && NEUES.every(n => H.includes(n[1].replace(/&/g, '&amp;'))));
    ok('Verschlechterungen mit ⚠️ und aufgeklappt', /<details open><summary><b>⚠️ Echte Flächenmaße/.test(H));
    spiel.hofFenster = []; neuesPruefen(); ok('zweites Mal nichts mehr', !(spiel.hofFenster || []).length);
    spiel.neuGesehen = 667; neuesPruefen(); const H2 = (spiel.hofFenster || []).join(''); ok('nur neuere Einträge', !/Heilungsdauer/.test(H2) && /Boxstufe/.test(H2));
    localStorage.removeItem('zuchtstall-neu-an'); spiel.hofFenster = [];
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
