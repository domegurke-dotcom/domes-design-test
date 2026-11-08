// v998 (Dome 8.11.): eine leere Box (auch Abfohlbox), in der keine Einstreu liegt, zeigt den nackten Boden – nicht plötzlich wieder Stroh
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; const box = spiel.boxen[2]; box.abfohl = true; box.pferd = P;
    const F = futterkammer(); Object.keys(EINSTREU).forEach(k => { F.lager[k] = 0; }); box.einstreu = 'streuStroh';
    einstreuNacht(box); ok('Pferd in der Box, kein Einstreu im Lager: „ohne Einstreu“ gesetzt', box.ohneEinstreu === true && !!box.einstreu);
    box.pferd = null; box.pferd = null; // Pferd zieht aus (Verkauf/Abgabe …)
    // die Nacht für leere Boxen läuft in naechsteNacht – wir spielen eine Nacht
    naechsteNacht();
    ok('Leere Abfohlbox nach der Nacht: keine Einstreu mehr (nackter Boden, kein Stroh)', !box.einstreu || box.ohneEinstreu === true, JSON.stringify({ e: box.einstreu, o: box.ohneEinstreu }));
    aktBox = 2; spiel.aktBox = 2; zeigeStall(); zeigeSchirm(null); const stroh = document.querySelector('#abfBoden, #stall [clip-path*="abfBoden"]'); ok('Bild: die leere Abfohlbox zeichnet keinen Strohboden', !stroh && document.getElementById('boden').getAttribute('fill') === 'transparent', document.getElementById('boden').getAttribute('fill'));
    // Gegenprobe: mit Einstreu im leeren Raum bleibt das Stroh sichtbar (Dome: „bleibt, bis man Box leeren drückt“)
    box.einstreu = 'streuStroh'; delete box.ohneEinstreu; zeigeStall(); zeigeSchirm(null); ok('Gegenprobe: leere Abfohlbox MIT Einstreu zeigt Stroh', !!document.querySelector('#abfBoden') || document.getElementById('boden').getAttribute('fill') !== 'transparent');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
