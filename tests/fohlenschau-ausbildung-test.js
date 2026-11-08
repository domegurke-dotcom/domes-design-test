// v995 (Dome 8.11.): Fohlenschau-Ergebnisse stehen bei Steckbrief → Ausbildung (wie die Turnierergebnisse), nicht mehr in den Daten
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1200, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.tag = 30;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P;
    P.fohlenschau = { praemie: true, champion: false, gesamt: 8, schau: 'Fohlenschau Sommer', tag: 20, noten: { typ: 8, koerper: 8, schritt: 8, trab: 8, eindruck: 8 } }; P.championat = { platz: 2, von: 6, name: 'Fohlenchampionat Test', tag: 25 };
    const h = erfolgeHTML(P); ok('Ausbildung: Block „Fohlenschau“ mit Gesamtnote und Championat', /Fohlenschau/.test(h) && /Gesamtnote 8/.test(h) && /Fohlenchampionat: 2\. von 6/.test(h), h.replace(/<[^>]+>/g, ' ').slice(0, 300));
    ok('Ausbildung: er steht vor den Turnieren', !/🏆 Turniere/.test(h) || h.indexOf('Fohlenschau') < h.indexOf('Turniere'));
    leseAkte(P); const daten = document.getElementById('leseInfo').innerHTML; ok('Daten: keine Zeile „Fohlenschau“ mehr', !/<dt>Fohlenschau<\/dt>/.test(daten)); ok('Daten: Ehrungen (Plakette) bleibt', /<dt>Ehrungen<\/dt>/.test(daten));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
