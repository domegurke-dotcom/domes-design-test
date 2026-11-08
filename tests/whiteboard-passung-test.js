// v962 (Dome 8.11.): Whiteboard-Passung – „wenig Erfahrung – im Training“ (Rücken) nur bei Bereitern/Trainern, nicht bei Stallburschen/Pflegern
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Duchess' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P; P.arbeitSchnitt = 12;
    const mk = (typ, r) => ({ id: typ + 'x', typ, name: typ, wissen: { ruecken: r, verhalten: 50, futter: 50, haut: 50, huf: 50 }, eig: [] });
    const tags = m => passung(m, P, spiel.boxen[0]).tags.map(x => x.t).join('|');
    ok('Stallbursche (Rücken 5): keine Warnung „im Training“', !/im Training/.test(tags(mk('stallbursche', 5))), tags(mk('stallbursche', 5)));
    ok('Pfleger (Rücken 5): keine Warnung „im Training“', !/im Training/.test(tags(mk('pfleger', 5))), tags(mk('pfleger', 5)));
    ok('Bereiter (Rücken 5): Warnung bleibt', /wenig Erfahrung – im Training/.test(tags(mk('bereiter', 5))), tags(mk('bereiter', 5)));
    ok('Bereiter (Rücken 60): „gut“ bleibt', /Rücken|im Training/.test(tags(mk('bereiter', 60))) && !/wenig/.test(tags(mk('bereiter', 60))), tags(mk('bereiter', 60)));
    const bf = befundNeu(P, 'kissing', 1, 'Test', 'du'); bf.diagnose = true; bf.bemerkt = bf.bemerkt || { tag: spiel.tag, von: 'du' };
    ok('Bei bekanntem Rücken-Befund bleibt die Warnung auch beim Stallburschen', /wenig Erfahrung/.test(tags(mk('stallbursche', 5))), tags(mk('stallbursche', 5)));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
