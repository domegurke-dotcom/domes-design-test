// Dome 24.10. (Aufnahme „kurzer whiteboard test“): automatisch zugeteilte Mitarbeiter lassen sich entfernen; wer morgens auf die Weide kam, zählt trotzdem als versorgt (kein „heute niemand“, „x von 3“ stimmt)
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/whiteboard-fehler-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anni', 0), B2 = mk('Bea', 1);
    const x0 = bewerber('stallbursche')[0], m = { id: 'mx', typ: 'stallbursche', name: 'Paul', w: x0.w, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt(), bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    if (!aktive('stallbursche').length) { ok('Stallbursche aktiv', false, JSON.stringify(Object.keys(m))); return out; }
    spiel.boxen[0].maPlan = { stall: 'mx' };
    A.weide = { seit: spiel.tag, nachm: 'weide' };   // heute morgen rausgebracht
    const z = maZuteilung('stall'); ok('Fest zugeteilt + heute auf der Weide: zählt als versorgt', z.some(x => x.i === 0 && x.m === m), JSON.stringify(z.map(x => x.i)));
    hofReiter = 'hof'; spiel.stallAnsicht = 'board'; wbSicht = 'boxen'; zeigeWhiteboard();
    const t = document.getElementById('nebenSchirm').innerText; ok('Kein „heute niemand“', !/heute niemand/.test(t), t.slice(0, 200));
    ok('Zähler zeigt 2 von …', /2 von \d+ Boxen/.test(t), (t.match(/\d+ von \d+ Boxen/) || [''])[0]);
    // automatisch zugeteilt bei Bea → ✕ → niemand
    const x = document.querySelector('[data-wbloes="1:stall"]'); ok('✕ auch beim automatisch zugeteilten Mitarbeiter', !!x, '');
    if (x) { x.click(); ok('Box 2: niemand', spiel.boxen[1].maPlan && spiel.boxen[1].maPlan.stall === '-' && !maZuteilung('stall').some(y => y.i === 1), JSON.stringify(spiel.boxen[1].maPlan));
      const y = document.querySelector('[data-wbloes="1:stall"]'); y && y.click(); ok('✕ bei „niemand“: wieder automatisch', !spiel.boxen[1].maPlan && maZuteilung('stall').some(q => q.i === 1), JSON.stringify(spiel.boxen[1].maPlan)); }
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
