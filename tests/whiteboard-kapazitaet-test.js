// v999 (Dome, Aufnahme 25): Pferdewirt – von Hand eingetragenes Füttern/Misten zählt beim Putzen mit; Karte zeigt nie „9 von 6“, und die Zahl stimmt mit den Eintragungen
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    [0, 1, 2, 3, 4, 5].forEach(i => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: 'P' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; });
    const x0 = bewerber('pferdewirtHS')[0], m = { id: 'pw1', typ: 'pferdewirtHS', name: 'Amelie', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    [0, 1, 2].forEach(i => { spiel.boxen[i].maPlan = { stall: 'pw1', pfleger: 'pw1' }; });
    const tat = () => ['stall', 'pfleger'].reduce((s, a) => s + maZuteilung(a).filter(x => x.m === m).length, 0), cap = maKapazitaet(m);
    ok('Pferdewirt hat nie mehr Tätigkeiten als seine Kapazität', tat() <= cap, tat() + ' von ' + cap);
    ok('Die 3 Boxen mit Füttern + Putzen stehen alle bei ihm', [0, 1, 2].every(i => maZuteilung('stall').some(x => x.i === i && x.m === m) && maZuteilung('pfleger').some(x => x.i === i && x.m === m)));
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const kap = document.querySelector('.wb-ma[data-wbq="m:pw1"] .wb-kap');
    ok('Karte zeigt „n von ' + cap + '“ mit n ≤ ' + cap, kap && (+((kap.textContent.match(/(\d+) von/) || [])[1]) <= cap), kap && kap.textContent);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
