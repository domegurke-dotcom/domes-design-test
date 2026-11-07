// v945 (Dome 5.11.): Kreis „Fohlen“ links in der Box-Ansicht – Stute mit Fohlen bei Fuß, Waisenfohlen; roter/grüner Punkt; „Duschen üben“ nur mit Waschplatz
// Start: node tests/fohlenkreis-test.js [Ordner für Bilder bei Fehlern]
const { chromium } = require('playwright'); const path = require('path');
const BILD = process.argv[2];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(async () => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99;
    const mk = (name, g, alter) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: alter == null ? 8 : alter, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    const M = mk('Mama', 'Stute'), V = mk('Papa', 'Hengst'), box = spiel.boxen[0]; box.pferd = M;
    const f = geburt(box, V, true); f.gebTag = spiel.tag - 10; box.fohlen = f; aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeTag(); zeigeAkte();
    const kreis = () => document.querySelector('#boxUI .bxs[data-bx="fohlen"]'), punkt = () => { const k = kreis(); const d = k && k.querySelector('.bxd'); return d ? d.className.replace('bxd', '').trim() : ''; };
    ok('Kreis „Fohlen“ links bei Stute mit Fohlen', !!kreis());
    ok('Roter Punkt: heute noch nichts geübt', punkt() === 'r', punkt());
    kreis().click(); await new Promise(r => setTimeout(r, 150));
    const items = [...document.querySelectorAll('#boxUI [data-bxring]')].map(x => x.dataset.bxring);
    ok('Ohne Waschplatz nur Fohlen-ABC im Kreis', items.join() === 'abc', items.join());
    document.querySelector('#boxUI [data-bxring="abc"]').click(); await new Promise(r => setTimeout(r, 150));
    ok('Fohlen-ABC geübt (abcTag = heute)', f.abcTag === spiel.tag); const dlg = document.getElementById('dlg'); ok('Rückmeldung als Fenster', !dlg.hidden && /Fohlen-ABC/.test(dlg.textContent)); document.querySelector('#dlgKnoepfe button') && document.querySelector('#dlgKnoepfe button').click(); dlg.hidden = true;
    ok('Grüner Punkt: alles erledigt (ohne Waschplatz)', punkt() === 'g', punkt());
    // mit Waschplatz
    spiel.gebaeude = spiel.gebaeude || []; spiel.gebaeude.push({ id: 'wp1', typ: 'waschplatz', stufe: 1 }); delete f.abcTag; zeigeAkte();
    ok('Mit Waschplatz: wieder roter Punkt', punkt() === 'r', punkt());
    kreis().click(); await new Promise(r => setTimeout(r, 150));
    const items2 = [...document.querySelectorAll('#boxUI [data-bxring]')].map(x => x.dataset.bxring);
    ok('Mit Waschplatz auch „Duschen üben“', items2.join() === 'abc,dusche', items2.join());
    // Nicht-Fohlen-Fälle
    box.fohlen = null; bxRing = null; zeigeAkte(); ok('Kein Fohlen → kein Kreis', !kreis());
    box.fohlen = f; const e = { id: 'E1' }; zeigeAkte(); ok('Wieder mit Fohlen → Kreis da', !!kreis());
    const W = mk('Waise', 'Stute', 0.1); W.waise = true; W.geb = Object.assign({}, f.geb); W.gebTag = f.gebTag; box.pferd = W; box.fohlen = null; zeigeStall(); zeigeAkte(); ok('Waisenfohlen: Kreis da', !!kreis(), 'alterJZ ' + alterJZ(W) + ', ziel ' + !!fohlenZiel(W, box) + ', ohne ' + bxOhne + ', klinik ' + !!W.klinik + ', turnier ' + !!W.turnier + ', fremd ' + fremd(W));
    box.pferd = mk('Erwachsen', 'Stute'); zeigeStall(); zeigeAkte(); ok('Erwachsene Stute ohne Fohlen: kein Kreis', !kreis());
    return out; });
  R.forEach(x => console.log(x)); const rot = R.filter(x => x.startsWith('✗')).length; if (rot && BILD) await pg.screenshot({ path: path.join(BILD, 'fohlenkreis-fehler.png') });
  console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' | ') : '✓ keine Seitenfehler'); console.log(rot ? `${rot} ✗` : 'alles ✓'); await b.close(); })();
