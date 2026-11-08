// v975: Sammel-Haken „Füttern + Misten“ wirkt in der Tagesroutine des Stallburschen (an = Box gemistet + Krippe gefüllt, aus = nichts)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P;
    const x0 = bewerber('stallbursche')[0]; (spiel.mitarbeiter = spiel.mitarbeiter || []).push({ id: 'sb1', typ: 'stallbursche', name: 'Paul', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null });
    const bx = spiel.boxen[0], lauf = () => { bx.mistig = true; bx.mistStufe = 2; bx.krippeVoll = false; mitarbeiterTag(); return { mist: !bx.mistig, krippe: !!bx.krippeVoll }; };
    P.leist = {}; let r = lauf(); ok('Wunsch an (Standard): Paul mistet und füttert', r.mist && r.krippe, JSON.stringify(r));
    // Sammel-Haken per Oberfläche ausschalten
    wbSicht = 'boxen'; wbWahl = null; wbWuOffen.add(0); zeigeWhiteboard(); const c = document.querySelector('[data-wbwu="0:fuettern+misten"]'); ok('Sammel-Haken ist da und gesetzt', !!c && c.checked);
    c.checked = false; c.dispatchEvent(new Event('change', { bubbles: true })); if (!document.getElementById('dlg').hidden) document.getElementById('dlg').hidden = true;
    r = lauf(); ok('Haken aus: Paul mistet NICHT und füttert NICHT', !r.mist && !r.krippe, JSON.stringify(r));
    wbSicht = 'boxen'; zeigeWhiteboard(); const c2 = document.querySelector('[data-wbwu="0:fuettern+misten"]'); c2.checked = true; c2.dispatchEvent(new Event('change', { bubbles: true }));
    r = lauf(); ok('Haken wieder an: Paul macht beides wieder', r.mist && r.krippe, JSON.stringify(r));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
