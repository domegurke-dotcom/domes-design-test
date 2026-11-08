// v998 (Dome 8.11.): Beinabzeichen an den fernen Beinen (vorn und hinten) sind weiß wie an den nahen – nicht grau – bei allen Farben
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.admin = true;
    const farben = ['fuchs', 'dunkelfuchs', 'brauner', 'dunkelbrauner', 'rappe', 'schimmel', 'palomino', 'falbe'], schlecht = [];
    ['haflinger', 'hannoveraner', 'araber'].forEach(rasse => farben.forEach(f => { try { const P = neuesPferd({ rasse, geschlecht: 'Stute', alter: 8, name: f }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.farbe = f; P.ex = P.ex || {}; Object.assign(P.ex, { bvl: 3, bvr: 3, bhl: 3, bhr: 3 });
      const svg = ganzBild(P), dunkelW = '#f6f4ee'; const n = (svg.match(/fill="#f6f4ee"/g) || []).length; if (n < 2) schlecht.push(rasse + '/' + f + ' (' + n + ')'); } catch (e) { schlecht.push(rasse + '/' + f + ' FEHLER ' + e.message); } }));
    ok('Alle Farben: weiße Beinabzeichen an den fernen Beinen in der hellen Weißfarbe (nicht abgedunkelt)', schlecht.length === 0, schlecht.join(', '));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
