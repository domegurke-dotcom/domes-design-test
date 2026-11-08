// v953 (Dome 8.11.): Pferdewirte sind auf dem Whiteboard in beiden Zeilen zuteilbar (Füttern und Misten · Putzen · Beides), Kapazität gemeinsam
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    [0, 1, 2].forEach(i => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: 'P' + i }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; });
    const x0 = bewerber('pferdewirtHS')[0], m = { id: 'pw1', typ: 'pferdewirtHS', name: 'Amelie', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    ok('Pferdewirt ist aktiv', aktive('pferdewirtHS').length === 1, JSON.stringify(Object.keys(m)));
    // 1. ziehen → Frage mit drei Antworten
    const kn = () => [...document.querySelectorAll('#dlgKnoepfe button')].map(x => x.textContent.trim());
    wbAnwenden('m:pw1', 'b:0'); ok('Frage erscheint', !document.getElementById('dlg').hidden && /Füttern und Misten/.test(kn().join('|')) && /Putzen/.test(kn().join('|')) && /Beides/.test(kn().join('|')), kn().join('|'));
    [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Füttern und Misten/.test(x.textContent)).click();
    ok('Nur „Füttern und Misten“ gesetzt', spiel.boxen[0].maPlan && spiel.boxen[0].maPlan.stall === 'pw1' && !spiel.boxen[0].maPlan.pfleger, JSON.stringify(spiel.boxen[0].maPlan));
    ok('Zuteilung stall: Amelie macht Box 1', maZuteilung('stall').some(x => x.i === 0 && x.m === m));
    // 2. nur Putzen
    wbAnwenden('m:pw1', 'b:1'); [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Putzen/.test(x.textContent)).click();
    ok('Nur „Putzen“ gesetzt', spiel.boxen[1].maPlan && spiel.boxen[1].maPlan.pfleger === 'pw1' && !spiel.boxen[1].maPlan.stall, JSON.stringify(spiel.boxen[1].maPlan));
    // 3. Beides, gemeinsame Kapazität: Box 3 zählt nicht doppelt
    spiel.boxen[0].maPlan = {}; spiel.boxen[1].maPlan = {}; wbAnwenden('m:pw1', 'b:2'); [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Beides/.test(x.textContent)).click();
    ok('Beides gesetzt', spiel.boxen[2].maPlan.stall === 'pw1' && spiel.boxen[2].maPlan.pfleger === 'pw1', JSON.stringify(spiel.boxen[2].maPlan));
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const kap = document.querySelector('.wb-ma[data-wbq="m:pw1"] .wb-kap'); ok('Anzeige nach Tätigkeiten: Box mit Füttern und Putzen = von 6, beide Symbole', kap && /von 6 Tätigkeiten/.test(kap.textContent) && /🧹/.test(kap.textContent) && /🧽/.test(kap.textContent), kap && kap.textContent);
    ok('Beide Zeilen im Whiteboard sichtbar', document.querySelectorAll('.wb-ma-zeile').length >= 2, document.querySelectorAll('.wb-ma-zeile').length);
    // 4. Stallbursche unverändert: keine Frage
    const x1 = bewerber('stallbursche')[0]; spiel.mitarbeiter.push({ id: 'sb1', typ: 'stallbursche', name: 'Paul', w: false, wissen: { ...x1.wissen }, eig: [], gehalt: x1.gehalt, ab: jzJetzt() - 2, bis: null });
    document.getElementById('dlg').hidden = true; wbAnwenden('m:sb1', 'b:1'); ok('Stallbursche: ohne Frage direkt zugeteilt', document.getElementById('dlg').hidden && spiel.boxen[1].maPlan.stall === 'sb1', JSON.stringify(spiel.boxen[1].maPlan));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
