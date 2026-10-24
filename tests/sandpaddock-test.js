// v681 (Dome 23.10.): Sandpaddock nach Fläche (Pferdegröße), vergrößern, Überfüllung mit Folgen
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/sandpaddock-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 50000; spiel.hof.bauHa = 3;
    const g = { gid: 'gp1', typ: 'sandpaddock', stufe: 1, zustand: 100 }; gebaeude().push(g); delete hofPlan().pos.gp1; (spiel.anlage = spiel.anlage || {}).paddock = true;
    ok('Stufe 1: 400 m² (≈ 3 Großpferde, 2 Kaltblüter)', paddockFlaeche(g) === 400 && paddockPlatz(g) === 3 && 2 * pdBedarf({ stockmass: 180 }) <= 400);
    ok('Bedarf nach Größe: Shetty < Warmblut < Shire', pdBedarf({ stockmass: 100 }) < pdBedarf({ stockmass: 168 }) && pdBedarf({ stockmass: 168 }) < pdBedarf({ stockmass: 180 }), [100, 168, 180].map(x => pdBedarf({ stockmass: x })).join('/'));
    while (spiel.boxen.length < 5) spiel.boxen.push({ pferd: null });
    const mk = (n, r, i) => { const P = neuesPferd({ rasse: r, geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; spiel.boxen[i].krippeVoll = true; return P; };
    const S = [mk('Mini', 'shetty', 0), mk('Mona', 'shetty', 1), mk('Moni', 'hannoveraner', 2)], WB = mk('Wanda', 'hannoveraner', 3);
    S.forEach(p => { p.paddock = { seit: spiel.tag, pid: 'gp1' }; });
    ok('2 Shettys + 1 Warmblut passen auf 400 m²', paddockPasst(g, S[0]) && paddockBelegtM2(g) <= 400, paddockBelegtM2(g) + ' m²');
    ok('Warmblut passt nicht mehr dazu (Mitarbeiter stellt es nicht dazu)', !paddockPasst(g, WB) && !paddockFrei(WB), paddockBelegtM2(g, WB) + ' m²');
    // vergrößern
    const vor = baulandFrei(); ok('Vergrößern kostet 150 € je Platz (Stufe 1)', bauPreis('sandpaddock', 1, { anbau: 'gp1', boxen: 2 }) === 300);
    ok('Bauauftrag Vergrößerung', bauStarten('sandpaddock', 1, { anbau: 'gp1', boxen: 2 }));
    const a = gebaeude().find(x => x.anbau === 'gp1'); ok('Anbau hat 2 Plätze und braucht Bauland', a && a.boxen === 2 && baulandFrei() < vor, a && JSON.stringify({ b: a.boxen, frei: baulandFrei(), vor }));
    ok('Im Bau zählt er noch nicht', paddockFlaeche(g) === 400); delete a.bau;
    ok('Fertig: 700 m², kein eigener Sandpaddock', paddockFlaeche(g) === 700 && paddocks().length === 1, paddockFlaeche(g) + ' / ' + paddocks().length);
    ok('Jetzt passt Wanda', !!paddockFrei(WB));
    // Überfüllung
    gebaeude().splice(gebaeude().indexOf(a), 1); WB.paddock = { seit: spiel.tag, pid: 'gp1' };
    ok('Überfüllt erkannt', paddockUeber(g) > 1, paddockUeber(g).toFixed(2));
    naechsteNacht();
    ok('Nacht: Wohlbefinden-Eintrag „Sandpaddock zu eng“', /zu eng/.test(JSON.stringify(WB.wohlLog || {})), JSON.stringify(WB.wohlLog || {}).slice(0, 200));
    ok('Verletzungsrisiko erhöht gemerkt', WB.paddockEng && WB.paddockEng.f >= 1.5, JSON.stringify(WB.paddockEng));
    return out; });
  if (ORD) { await pg.evaluate(() => { const B = spiel.boxen[3]; delete B.pferd.paddock; B.pferd.weide = null; delete B.pferd.weide; aktBox = 3; spiel.aktBox = 3; aktenModus = 'pflege'; aktenReiter = 'ort'; ortModus = null; zeigeSchirm(null); zeigeStall(); });
    await pg.waitForTimeout(300); await pg.click('text=Ort'); await pg.waitForTimeout(200); const kp = await pg.$('[data-ort="koppel"]'); if (kp) { await kp.click(); await pg.waitForTimeout(200); } const k = await pg.$('[data-ort="paddock"]'); if (k) { await k.click(); await pg.waitForTimeout(250); } await pg.screenshot({ path: ORD + `/sandpaddock-${W}x${H}.png` }); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
