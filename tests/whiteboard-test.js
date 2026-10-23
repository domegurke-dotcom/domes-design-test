// v679 Whiteboard (Dome 23.10.): Mitarbeiter auf Boxen ziehen, Weideplan Tag A/B, Freund/Feind-Rahmen, ab Fortgeschritten
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/whiteboard-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '844x390').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 1000 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  let R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 20000;
    spiel.stufenAn = true; spiel.spieler.stufe = 'anf'; zeigeBoxen(); ok('Anfänger: kein Whiteboard-Knopf', !document.getElementById('wbUmschalt'));
    spiel.spieler.stufe = 'fort'; zeigeBoxen(); ok('Fortgeschritten: Knopf „Whiteboard“', !!document.getElementById('wbUmschalt'));
    while (spiel.boxen.length < 4) spiel.boxen.push({ pferd: null });
    const mk = (n, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); return P; };
    ['Anna', 'Berta', 'Cora', 'Dora'].forEach((n, i) => { spiel.boxen[i].pferd = mk(n, 'Stute'); spiel.boxen[i].krippeVoll = true; });
    const J = jzJetzt() - 1; spiel.mitarbeiter = [{ id: 'm1', name: 'Paul', typ: 'stallbursche', ab: J, bis: null, gehalt: 300, zufr: 80, w: false, wissen: {} }, { id: 'm2', name: 'Lena', typ: 'stallbursche', ab: J, bis: null, gehalt: 300, zufr: 80, w: true, wissen: {} }];
    spiel.futter.lager.heu = 5000; if (!weiden().some(w => w.wid === 'w2')) weiden().push({ wid: 'w2', name: 'Weide 2', ha: 2, gras: 80, matsch: 0 });
    // Zuteilung ohne Plan: Paul Box 1–3, Lena Box 4
    let Z = maZuteilung('stall'); ok('Ohne Plan: der Reihe nach (Paul 1–3, Lena 4)', Z.filter(x => x.m.id === 'm1').map(x => x.i).join() === '0,1,2' && Z.find(x => x.i === 3).m.id === 'm2', Z.map(x => x.i + ':' + x.m.name).join(' '));
    ok('Fest zuteilen: Lena auf Box 1', wbAnwenden('m:m2', 'b:0') && spiel.boxen[0].maPlan.stall === 'm2');
    Z = maZuteilung('stall'); ok('Mit Plan: Box 1 bekommt Lena, Rest automatisch', Z.find(x => x.i === 0).m.id === 'm2' && Z.length === 4 && Z.filter(x => x.m.id === 'm2').length <= 3, Z.map(x => x.i + ':' + x.m.name).join(' '));
    spiel.mitarbeiter[1].krankBis = spiel.tag + 2; Z = maZuteilung('stall'); ok('Lena krank: Box 1 wird trotzdem versorgt (automatisch)', Z.some(x => x.i === 0), Z.map(x => x.i + ':' + x.m.name).join(' ')); delete spiel.mitarbeiter[1].krankBis;
    // Weideplan
    const A = spiel.boxen[0].pferd, Bp = spiel.boxen[1].pferd;
    wbAnwenden('p:0', 'w:w2:a'); ok('Anna auf Weide 2, linke Hälfte → jeden 2. Tag, Tag A', A.auslaufZiel === 'w2' && A.weidegang === 'jeden2' && A.weideTag === 'a');
    wbAnwenden('p:0', 'w:w2:b'); ok('Auch rechts → jeden Tag', A.weidegang === 'taeglich' && !A.weideTag);
    wbAnwenden('c:1:x:x', 'w:w2:b'); wbAnwenden('p:1', 'w:w2:b'); ok('Berta nur rechts', Bp.weideTag === 'b' && Bp.auslaufZiel === 'w2');
    wbAnwenden('c:1:w2:b', 'w:w2:a'); ok('Berta von rechts nach links verschoben', Bp.weideTag === 'a' && Bp.weidegang === 'jeden2');
    wbWeg(A, 'a'); ok('Anna aus „links“ genommen → nur noch rechts', A.weidegang === 'jeden2' && A.weideTag === 'b');
    wbAnwenden('c:0:w2:b', 'drin'); ok('In die Box gelegt → kein Weidegang', !A.weidegang && !A.auslaufZiel);
    // Tag A / B wirkt
    const heute = wbHalbHeute(), ander = heute === 'a' ? 'b' : 'a';
    Bp.weideTag = heute; ok('weidegangHeute am eigenen Tag', weidegangHeute(Bp, spiel.boxen[1]));
    Bp.weideTag = ander; ok('weidegangHeute am anderen Tag nicht', !weidegangHeute(Bp, spiel.boxen[1]));
    ok('Name der Hälften passt zum Tempo', tpj() % 2 ? wbHalbName('a') === 'Tag A' : wbHalbName('a') === 'gerade Tage', tpj() + ' ' + wbHalbName('a'));
    // Freund/Feind-Rahmen
    wbAnwenden('p:0', 'w:w2:a'); wbAnwenden('p:2', 'w:w2:a');
    const C = spiel.boxen[2].pferd, echt = window.paarBeziehung; window.paarBeziehung = (x, y) => ((x === A && y === C) || (x === C && y === A)) ? window.wbTestBez : null;
    window.wbTestBez = 'feind'; spiel.stallAnsicht = 'board'; zeigeBoxen();
    ok('Whiteboard wird gezeigt', !!document.querySelector('.wb') && !!document.querySelector('[data-wbz="w:w2:a"]'));
    ok('Feinde rot umrandet', document.querySelectorAll('[data-wbz="w:w2:a"] .wb-chip.rot').length === 2, document.querySelector('[data-wbz="w:w2:a"]').textContent);
    window.wbTestBez = 'freund'; zeigeBoxen(); ok('Freunde grün umrandet', document.querySelectorAll('[data-wbz="w:w2:a"] .wb-chip.gruen').length === 2);
    window.paarBeziehung = echt; zeigeBoxen();
    ok('Mitarbeiter-Reihe mit „x von y Boxen“', /von 3 Boxen/.test(document.getElementById('wbMaReihe').textContent), document.getElementById('wbMaReihe').textContent.slice(0, 80));
    return out; });
  out.push(...R);
  // Antippen: Mitarbeiter wählen, dann Box antippen
  await pg.click('[data-wbq="m:m1"]'); await pg.waitForTimeout(150);
  ok('Nach dem Antippen sind Boxen grün umrandet', await pg.evaluate(() => document.querySelectorAll('.wb-box.wb-ziel').length >= 4));
  await pg.click('[data-wbz="b:3"] .wb-nr'); await pg.waitForTimeout(150);
  ok('Paul fest auf Box 4 (antippen)', await pg.evaluate(() => (spiel.boxen[3].maPlan || {}).stall === 'm1'));
  // Ziehen mit der Maus: Dora (Box 4) auf Weide 2 rechts
  const q = await pg.$('[data-wbq="p:3"]'), z = await pg.$('[data-wbz="w:w2:b"]');
  if (q && z) { await q.scrollIntoViewIfNeeded(); const a = await q.boundingBox(); await pg.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await pg.mouse.down(); await pg.mouse.move(a.x + 30, a.y + 30, { steps: 4 }); await pg.waitForTimeout(250);
    await z.scrollIntoViewIfNeeded().catch(() => {}); const c = await z.boundingBox(); await pg.mouse.move(c.x + c.width / 2, c.y + c.height / 2, { steps: 8 }); await pg.mouse.up(); await pg.waitForTimeout(200); }
  ok('Dora per Ziehen auf Weide 2 rechts', await pg.evaluate(() => { const p = spiel.boxen[3].pferd; return p.auslaufZiel === 'w2' && p.weideTag === 'b'; }), await pg.evaluate(() => JSON.stringify({ z: spiel.boxen[3].pferd.auslaufZiel, t: spiel.boxen[3].pferd.weideTag })));
  await pg.waitForTimeout(450); ok('Lösen mit ✕', await pg.evaluate(() => { document.querySelector('[data-wbloes="0:stall"]').click(); return !spiel.boxen[0].maPlan; }));
  // Überlappen / Breite
  ok('Kein waagerechtes Scrollen der Seite', await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), await pg.evaluate(() => document.documentElement.scrollWidth + ' > ' + innerWidth));
  if (ORD) { await pg.screenshot({ path: ORD + `/wb-${W}x${H}.png` }); await pg.evaluate(() => { const r = document.querySelector('.wb-weiden'); if (r) r.scrollIntoView(); }); await pg.waitForTimeout(150); await pg.screenshot({ path: ORD + `/wb-${W}x${H}-weide.png` }); }
  await pg.click('#wbUmschalt'); ok('Zurück zur Boxenansicht', await pg.evaluate(() => !document.querySelector('.wb') && !!document.querySelector('.boxen-liste')));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
