// v959 (Dome 8.11.): Pfeile/Wischen durch die Boxen gehen in Stall-Reihenfolge, nicht in Baureihenfolge
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const neu = (art, geb) => { const x = JSON.parse(JSON.stringify(spiel.boxen[0])); x.pferd = null; x.fohlen = null; delete x.reserviert; x[art] = true; x.geb = geb; spiel.boxen.push(x); return spiel.boxen.length - 1; };
    // Bau-Reihenfolge: Abfohl 1 Box, Quarantäne 1 Box, später Abfohl +2 Boxen
    const a1 = neu('abfohl', 'gA'), q1 = neu('quar', 'gQ'), a2 = neu('abfohl', 'gA'), a3 = neu('abfohl', 'gA');
    zeigeStall(); aktBox = a1; spiel.aktBox = a1; const weg = []; for (let i = 0; i < 4; i++) { weg.push(aktBox); wechsleBox(1); }
    ok('Vorwärts: Quarantäne vor Abfohl, alle Abfohl-Boxen hintereinander', JSON.stringify(weg) === JSON.stringify([q1, a1, a2, a3]) || JSON.stringify(weg.slice(0, 1)) === JSON.stringify([a1]) && weg[1] === a2 && weg[2] === a3, JSON.stringify(weg) + ' erwartet Abfohl ' + [a1, a2, a3]);
    aktBox = a1; wechsleBox(1); ok('Von Abfohl 1 geht es zu Abfohl 2 (nicht zur Quarantäne)', aktBox === a2, aktBox);
    wechsleBox(1); ok('dann Abfohl 3', aktBox === a3, aktBox); wechsleBox(1); ok('am Ende bleibt es stehen', aktBox === a3, aktBox);
    wechsleBox(-1); wechsleBox(-1); ok('rückwärts: Abfohl 2, Abfohl 1', aktBox === a1, aktBox);
    wechsleBox(-1); ok('davor kommt die Quarantäne', aktBox === q1, aktBox);
    zeigeStall(); ok('Pfeil „weiter“ am letzten Abfohl-Platz aus', (aktBox = a3, zeigeStall(), $('pfeilWeiter').style.display === 'none'));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
