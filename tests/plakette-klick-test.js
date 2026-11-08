// v982 (Dome 8.11.): Plaketten neben dem Box-Schild antippen → Erklärung (Seltenheit: Detailfenster, Prämienfohlen/Championat: kurzer Text)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = true;
    const mk = () => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Doutzen' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    let P = mk(); P.fohlenschau = { praemie: true, champion: false, gesamt: 8, schau: 'Fohlenschau', tag: spiel.tag, noten: { typ: 8, koerper: 8, schritt: 8, trab: 8, eindruck: 8 } };
    const dlgText = () => document.getElementById('dlgInhalt').textContent, zu = () => { document.getElementById('dlg').hidden = true; };
    const zeige = p => { spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeSchirm(null); window.scrollTo(0, 0); };
    zeige(P); let g = document.querySelector('#plaketten [data-plak]'); ok('Plakette ist antippbar (data-plak)', !!g);
    g.dispatchEvent(new MouseEvent('click', { bubbles: true })); ok('Prämienfohlen-Plakette: Erklärfenster mit Text', !document.getElementById('dlg').hidden && /Prämienfohlen/.test(dlgText()), dlgText()); zu();
    let R2 = null; for (let i = 0; i < 400 && !R2; i++) { const q = mk(); q.id = 'r' + i + Math.random(); try { if (seltenheit(q).stufe > 0) R2 = q; } catch (e) {} }
    if (R2) { zeige(R2); const gr = document.querySelector('#plaketten [data-plak]'); ok('Seltenheits-Plakette da', !!gr); gr.dispatchEvent(new MouseEvent('click', { bubbles: true })); ok('Seltenheit: Detailfenster öffnet', !document.getElementById('dlg').hidden && /der Rasse/.test(dlgText()), dlgText().slice(0, 150)); zu(); } else ok('Seltenes Pferd gefunden (Stichprobe)', false, 'keins in 400');
    return out; });
  // echter Mausklick (prüft, dass keine andere Ebene die Plakette verdeckt)
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); const el = await pg.$('#plaketten [data-plak]'); await el.scrollIntoViewIfNeeded(); const bb = await el.boundingBox(); await pg.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await pg.waitForTimeout(200);
  const echt = await pg.evaluate(() => !document.getElementById('dlg').hidden); R.push((echt ? '✓ ' : '✗ ') + 'Echter Mausklick auf die Plakette öffnet das Fenster');
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
