// v986 (Dome 8.11.): Hufschmied-Dauerauftrag – das Etikett nennt die Art, die der Haken anlegt (beschlagenes Pferd → Beschlag, barhufes → Barhuf)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7;
    const mk = (n, beschlag) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.beschlag = beschlag; return P; };
    const A = mk('Bruno', true), B = mk('Berta', false); spiel.boxen[0].pferd = A; spiel.boxen[1].pferd = B;
    hufschmiedDialog([A, B], null); const L = [...document.querySelectorAll('[data-hsauftrag]')].map(c => c.closest('label').textContent.trim());
    ok('Beschlagenes Pferd: „Dauerauftrag (Beschlag)“ auch ohne Haken', /Beschlag/.test(L[0]), L.join(' | ')); ok('Barhufes Pferd: „Dauerauftrag (Barhuf)“', /Barhuf/.test(L[1]), L.join(' | '));
    const c = document.querySelector('[data-hsauftrag="0"]'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); ok('Haken bei beschlagenem Pferd legt einen Beschlag-Auftrag an', A.hufAuftrag === 'beschlag', String(A.hufAuftrag));
    ok('Danach weiter „Dauerauftrag (Beschlag)“', /Beschlag/.test(document.querySelector('[data-hsauftrag="0"]').closest('label').textContent));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
