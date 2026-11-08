// v968 (Dome 8.11., Aufnahme 18): Pferd aus der Paddockbox lässt sich nicht auf den Sandpaddock planen – jetzt mit Meldung
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const mk = (name) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Hengst', alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    gebaeude().push({ gid: 'gpd1', typ: 'sandpaddock', stufe: 1, zustand: 100 }); spiel.boxen[0].pferd = mk('Faraon'); spiel.boxen[0].paddock = true; spiel.boxen[1].pferd = mk('Gandalf'); spiel.boxen[2].pferd = mk('Bruno'); spiel.boxen[2].paddock = true; spiel.boxen[2].pferd.boxenruhe = true;
    const pd = wbZiele().find(x => x.pd); ok('Sandpaddock vorhanden', !!pd);
    const zu = () => document.getElementById('dlg').hidden = true, tx = () => document.getElementById('dlgInhalt').innerText;
    let r = wbAnwenden('p:0', 'w:' + pd.id + ':t'); ok('Pferd aus der Paddockbox: abgelehnt mit Meldung „eigener Auslauf“', r === false && !document.getElementById('dlg').hidden && /Paddockbox und hat dort seinen eigenen Auslauf/.test(tx()), tx()); zu();
    r = wbAnwenden('p:2', 'w:' + pd.id + ':t'); ok('Mit Boxenruhe: Meldung „darf nicht raus“', r === false && /Boxenruhe und darf nicht raus/.test(tx()), tx()); zu();
    r = wbAnwenden('p:1', 'w:' + pd.id + ':t'); ok('Pferd aus normaler Box: geht, keine Meldung', r === true && document.getElementById('dlg').hidden, tx());
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
