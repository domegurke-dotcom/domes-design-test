// Fress-Animation (v723, Dome 23.10.): Kopf senkt sich nach dem Füttern (Heu → Boden, Kraftfutter → Krippe), bleibt unten, hebt sich wieder;
// Fütterungen laufen nacheinander, Putzen hebt den Kopf, Boxwechsel beendet; auf der Weide grasen die Pferde zu verschiedenen Zeiten.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/fress-test.js [BxH] [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(x)));
  const vorbereiten = () => pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.infoGesehen = { krippe: true, heuhaufen: true };
    FRESS.box = 1500; FRESS.weide = 1500;   // Test: kürzer als im Spiel
    for (let i = 0; i < 2; i++) { const bx = spiel.boxen[i]; const p = neuesPferd({ rein: true, rasse: i ? 'shetty' : 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'F' + i }); p.pflege = erzeugePflege(p); p.pflege.gesundheit = 100;
      p.futterplan = { mahl: 2, kg: { heu: 9, hafer: 1, mineral: 0.1 }, vom: 'du' }; bx.pferd = p; bx.krippeVoll = false; bx.kraftVoll = false; bx.einstreu = 'stroh'; }
    spiel.futter.lager.heu = 500; spiel.futter.lager.hafer = 50; spiel.futter.lager.mineral = 5;
    aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); aktenModus = 'pflege'; aktenReiter = 'versorgung'; zeigeStall(); zeigeTag(); document.getElementById('stall').scrollIntoView({ block: 'center' }); });
  const senk = () => pg.evaluate(() => { const e = document.getElementById('pferdKoerper'); return e ? Number(e.dataset.senk || 0) : -1; });
  const zeichnen = async ms => { const r = []; const t0 = Date.now(); while (Date.now() - t0 < ms) { r.push(await senk()); await pg.waitForTimeout(60); } return r; };
  const zuDialog = () => pg.evaluate(() => { document.getElementById('dlg').hidden = true; });

  // 1. Heu, gleich danach Kraftfutter: zwei vollständige Durchgänge nacheinander
  await vorbereiten(); await pg.waitForTimeout(200);
  await pg.evaluate(() => document.getElementById('heuhaufen').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await zuDialog();
  const ziel1 = await pg.evaluate(() => fressBox && fressBox.liste[0]);
  await pg.waitForTimeout(150);
  await pg.evaluate(() => document.getElementById('krippe').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await zuDialog();
  const liste = await pg.evaluate(() => fressBox && fressBox.liste.slice());
  const r = await zeichnen(8500);
  let durch = 0, oben = true; const zwischen = new Set();
  r.forEach(x => { if (x > 0 && x < 1) zwischen.add(x); if (x === 1 && oben) { durch++; oben = false; } if (x === 0) oben = true; });
  ok('Heu: Kopf geht zum Boden', ziel1 === 'boden', ziel1);
  const st1 = await pg.evaluate(() => Math.min(3, Math.max(1, boxenStufe(B()) || 2)));
  ok('Kraftfutter wird hinten angestellt (Heu läuft weiter)', JSON.stringify(liste) === JSON.stringify(['boden', st1 === 1 ? 'boden' : 'krippe']), liste);
  ok('zwei vollständige Durchgänge (runter – unten – hoch)', durch === 2 && r[r.length - 1] === 0, r.join(' '));
  ok('Zwischenbilder beim Senken/Heben', zwischen.size >= 4, [...zwischen]);
  ok('erste Fütterung wird nicht abgebrochen (Kopf erst ganz oben, dann die zweite)', (() => { const i = r.indexOf(1), j = r.indexOf(0, i); return i >= 0 && j > i && r.slice(i, j).every((x, k, a) => k === 0 || x <= a[k - 1]); })(), r.join(' '));

  // 2. Putzen hebt den Kopf
  await vorbereiten(); await pg.waitForTimeout(200);
  await pg.evaluate(() => document.getElementById('heuhaufen').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await zuDialog(); await pg.waitForTimeout(1300);
  const vorPutz = await senk();
  if (ORD) { await pg.evaluate(() => document.getElementById('stall').scrollIntoView({ block: 'center' })); await pg.screenshot({ path: `${ORD}/fress_box_heu_${W}x${H}.png` }); }
  await pg.evaluate(() => { aktenReiter = 'ausruestung'; putzModus = true; zeigeAkte(); document.querySelector('[data-putz="buerste"]').click(); });
  await pg.waitForTimeout(250);
  ok('unten beim Fressen', vorPutz === 1, vorPutz);
  ok('Bürste: Kopf sofort oben, keine Animation mehr', (await senk()) === 0 && await pg.evaluate(() => !fressBox), await senk());
  await pg.evaluate(() => wischEnde(false));

  // 3. Boxwechsel beendet die Animation
  await vorbereiten(); await pg.waitForTimeout(200);
  await pg.evaluate(() => document.getElementById('heuhaufen').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await zuDialog(); await pg.waitForTimeout(500);
  await pg.evaluate(() => { aktBox = 1; spiel.aktBox = 1; zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(300);
  ok('Boxwechsel: Animation endet, das andere Pferd steht normal', await pg.evaluate(() => !fressBox) && (await senk()) === 0, await senk());

  // 3b. Kraftfutter allein: Kopf nur bis zur Krippe (ohne Beinstellung)
  await vorbereiten(); await pg.waitForTimeout(200);
  await pg.evaluate(() => document.getElementById('krippe').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await zuDialog(); await pg.waitForTimeout(1300);
  const kz = await pg.evaluate(() => [fressBox && fressBox.liste[0], Math.min(3, Math.max(1, boxenStufe(B()) || 2))]);
  ok('Kraftfutter: Kopf zur Krippe (Stufe 1: Futtereimer am Boden)', kz[0] === (kz[1] === 1 ? 'boden' : 'krippe') && (await senk()) === 1, kz);
  for (const st of [2, 3]) {   // Krippe an der Wand / hängender Eimer: Kopf nur bis zur Krippe
    await vorbereiten(); await pg.evaluate(st => { B().stufe = st; zeigeStall(); zeigeTag(); document.getElementById('krippe').dispatchEvent(new MouseEvent('click', { bubbles: true })); document.getElementById('dlg').hidden = true; }, st);
    await pg.waitForTimeout(1300);
    ok(`Stufe ${st}: Kraftfutter → Kopf bis zur Krippe`, await pg.evaluate(() => fressBox && fressBox.liste[0] === 'krippe') && (await senk()) === 1, await senk());
    if (ORD) { await pg.evaluate(() => document.getElementById('stall').scrollIntoView({ block: 'center' })); await pg.screenshot({ path: `${ORD}/fress_box_krippe${st}_${W}x${H}.png` }); }
    await pg.evaluate(() => { B().stufe = 1; fressStop(); });
  }
  if (ORD) { await pg.evaluate(() => document.getElementById('stall').scrollIntoView({ block: 'center' })); await pg.screenshot({ path: `${ORD}/fress_box_krippe_${W}x${H}.png` }); }

  // 4. Weide: alle Pferde grasen, aber nicht alle zugleich
  const weide = await pg.evaluate(async () => { fressStop(); spiel.sparmodus = false;
    const w = weiden()[0]; if (!w) return { fehlt: true }; w.gras = 80; const ps = [];
    for (let i = 0; i < 4; i++) { const bx = spiel.boxen[i] || (spiel.boxen[i] = { pferd: null }); if (!bx.pferd) { const p = neuesPferd({ rein: true, rasse: 'haflinger', geschlecht: 'Stute', alter: 6 + i, name: 'W' + i }); p.pflege = erzeugePflege(p); p.pflege.gesundheit = 100; bx.pferd = p; }
      ps.push(bx.pferd); }
    ps.forEach(p => { p.weide = { seit: spiel.tag, wid: w.id }; });
    const jetzt = Date.now(); ps.forEach((p, i) => { weideFress[p.id] = { ab: jetzt + i * 900, start: null }; });
    aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeTag(); return { n: document.querySelectorAll('#weideBild [data-gras]').length, heu: heuNoetigP(ps[0]) }; });
  const proben = []; for (let i = 0; i < 40; i++) { proben.push(await pg.evaluate(() => [...document.querySelectorAll('#weideBild [data-gras]')].map(e => Number(e.dataset.senk)))); await pg.waitForTimeout(100); }
  if (ORD) { await pg.evaluate(() => { const e = document.getElementById('weideBild'); if (e) e.scrollIntoView({ block: 'center' }); }); await pg.screenshot({ path: `${ORD}/fress_weide_${W}x${H}.png` }); }
  const grast = proben.some(z => z.some(x => x === 1)), versetzt = proben.some(z => z.some(x => x === 1) && z.some(x => x === 0));
  if (weide.heu) ok('Weide (Heu nötig – Jahreszeit ohne Gras: kein Grasen)', proben.every(z => z.length === 0), proben[0]);
  else { ok('Weide: Pferde im Bild können grasen', weide.n >= 2, weide); ok('Weide: Pferde grasen', grast, proben.slice(-3)); ok('Weide: nicht alle gleichzeitig', versetzt, proben); }

  ok('keine Seitenfehler', !errs.length, errs);
  console.log(out.join('\n')); await b.close();
})();
