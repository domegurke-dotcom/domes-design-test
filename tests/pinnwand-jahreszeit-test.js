// v974 (Dome 8.11.): große Pinnwand – „nach Jahr“: je Jahr die Schleifen nach Jahreszeit hintereinander (Frühling, Sommer, Herbst, Winter); Umschalter: aktiver Knopf weiß
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.kal = null;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Doutzen' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P);
    const T = tpj(), tagIn = (j, s) => 1 + (j * 4 + s) * T + 1;   // Jahr j (0 = erstes), Jahreszeit s
    const e = (j, s, platz) => ({ st: 2, pl: platz, c: false, von: 8, platz, pruef: 'Dressur E', turnier: 'Test', tag: tagIn(j, s) });
    P.schleifen = [e(0, 3, 3), e(0, 0, 1), e(0, 1, 2), e(1, 2, 1), e(1, 0, 4)]; P.schleifenV = 1;
    const html = pinnGrossHTML(P, 'jahr'), jh = [...html.matchAll(/<h4 class="pinn-jahr">([^<]*)<\/h4>/g)].map(x => x[1]);
    const teile = html.split('<h4 class="pinn-jahr">').slice(1).map(s => [...s.matchAll(/data-jz="(-?[0-9])"/g)].map(x => +x[1]));
    ok('Jahre absteigend', jh.join('|') === 'Jahr 2|Jahr 1', jh.join('|'));
    ok('Je Jahr Frühling vor Sommer vor Herbst vor Winter, hintereinander', JSON.stringify(teile) === JSON.stringify([[0, 2], [0, 1, 3]]), JSON.stringify(teile));
    ok('Keine Jahreszeit-Überschriften, Symbol an der Schleife', !/class="pinn-jz"/.test(html) && /pinn-jzi/.test(html));
    ok('Sortierung „nach Klasse“ ohne Jahreszeit-Symbole', !/pinn-jzi/.test(pinnGrossHTML(P, 'klasse')));
    const host = document.createElement('div'); host.innerHTML = html; document.body.appendChild(host); const a = host.querySelector('[data-psort="jahr"]'), n = host.querySelector('[data-psort="klasse"]'), cs = x => getComputedStyle(x).backgroundColor;
    ok('Aktiver Knopf weiß, nicht aktiver nicht weiß', a.classList.contains('an') && /255, 255, 255\)$/.test(cs(a)) && !/255, 255, 255\)$/.test(cs(n)), cs(a) + ' / ' + cs(n)); host.remove();
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
