// Weihnachtsgeld für Mitarbeiter (PLAN-WEIHNACHTEN.md D, Dome 25.10.): Vorschlag, Zähler, Fenster am vorletzten Wintertag, Auszahlen, keins, Verfall
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/weihnachtsgeld-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false; spiel.geld = 50000;
    const mk = (id, typ, name, w, ab, gehalt) => ({ id, typ, name, w, ab, gehalt, wissen: {}, eig: [], zufr: 60 });
    const j = jzJetzt();
    spiel.mitarbeiter = [mk('m1', 'stallbursche', 'Tom', false, j - 9, 300), mk('m2', 'pfleger', 'Lena', true, j, 330), mk('m3', 'pferdewirt', 'Ida', true, j - 1, 360)].map(maErgaenzen); });
  // 1. Vorschlag
  let z = await pg.evaluate(() => { const m = spiel.mitarbeiter[0]; wgZaehlen(m, 'k', 2); wgZaehlen(m, 'x', 3, 'einspringen'); const d = wgDaten(m), n = wgDaten(spiel.mitarbeiter[1]); return { v: d.vorschlag, j: d.jahre, k: d.k, x: d.x, neu: n.neu, nv: n.vorschlag }; });
  ok('Vorschlag: 300 € × 25 % × (1 + 10 % für 2 Jahre − 10 % für 2 Krankheitstage + 9 % für 3× eingesprungen) = 80 €', z.v === 80 && z.j === 2 && z.k === 2 && z.x === 3, z);
  ok('Wer erst diese Jahreszeit angefangen hat, bekommt nichts', z.neu && z.nv === 0, z);
  z = await pg.evaluate(() => { const m = spiel.mitarbeiter[0], a = { ...m }; a.wgJ = { j: datum().j, k: 30, x: 30, art: {} }; a.ab = jzJetzt() - 80; return wgDaten(a).vorschlag; });
  ok('Grenzen: höchstens +25 % (Jahre), −50 % (krank), +15 % (Arbeit) → 300 × 25 % × 0,9 = 70 €', z === 70, z);
  z = await pg.evaluate(() => { const A = { id: 'az', typ: 'azubi', name: 'Azu', ab: jzJetzt() - 2, ausbilder: 'm3', gehalt: 100 }; spiel.mitarbeiter.push(maErgaenzen(A)); const d = wgDaten(spiel.mitarbeiter[2]); spiel.mitarbeiter.pop(); return { x: d.x, azubi: d.art.azubi }; });
  ok('Ein angeleiteter Azubi zählt als übernommene Arbeit', z.x === 1 && z.azubi === 1, z);
  // 2. Zähler im Spiel: Krankheit, Nachtdienst, Turnier
  z = await pg.evaluate(() => { const m = spiel.mitarbeiter[2]; delete m.wgJ; const r = Math.random; Math.random = () => 0; try { m.zufr = 30; mitarbeiterLaune(); } finally { Math.random = r; } return { k: (m.wgJ || {}).k, bis: m.krankBis }; });
  ok('Krankmeldung zählt die Krankheitstage fürs Jahr', z.k >= 1, z);
  // 3. bis zum vorletzten Wintertag
  z = await pg.evaluate(() => { let n = 0; while (!(datum().s === 3 && datum().t === tpj() - 1) && n < 60) { document.getElementById('dlg').hidden = true; naechsteNacht(); n++; } spiel.mitarbeiter.forEach(m => { m.zufr = 60; m.bis = null; }); return { n, offen: (spiel.wgOffen || []).length, s: datum().s, t: datum().t }; });
  ok('Am vorletzten Wintertag steht die Frage an (einmal je Hof)', z.offen === 1 && z.s === 3, z);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeSchirm(null); zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(500);
  z = await pg.evaluate(() => ({ dlg: !document.getElementById('dlg').hidden, titel: (document.querySelector('#dlgInhalt h3') || {}).textContent, zeilen: document.querySelectorAll('#wgTabelle tr').length, inputs: [...document.querySelectorAll('#dlgInhalt [data-wg]')].map(x => +x.value) }));
  ok('Fenster „Weihnachtsgeld?“ mit allen 3 Mitarbeitern und Vorschlägen (Lena ist im Winter schon 3 Jahreszeiten da)', z.dlg && /Weihnachtsgeld/.test(z.titel) && z.zeilen === 3 && z.inputs.every(x => x > 0), z);
  await pg.click('#wgInfo'); ok('Info-Knopf klappt die Erklärung auf', await pg.isVisible('#wgInfoText'));
  if (ORD) await pg.screenshot({ path: `${ORD}/weihnachtsgeld-${W}x${H}.png` });
  const vor = await pg.evaluate(() => ({ geld: spiel.geld, z: spiel.mitarbeiter.map(m => m.zufr), v: [...document.querySelectorAll('#dlgInhalt [data-wg]')].map(x => +x.value) }));
  await pg.fill('#dlgInhalt [data-wg="2"]', String(vor.v[2] * 2)); await pg.waitForTimeout(100);
  ok('Summe und Knopf zeigen den neuen Betrag', await pg.evaluate(v => document.getElementById('wgSumme').textContent.replace(/\D/g, '') === String(v), vor.v[0] + vor.v[1] + vor.v[2] * 2));
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(500);
  z = await pg.evaluate(() => ({ geld: spiel.geld, z: spiel.mitarbeiter.map(m => m.zufr), offen: (spiel.wgOffen || []).length, dlg: document.querySelector('#dlgInhalt h3').textContent, buch: JSON.stringify(spiel.finanzen || []).includes('Weihnachtsgeld') }));
  ok('Auszahlen bucht die Summe', Math.round(vor.geld - z.geld) === vor.v[0] + vor.v[1] + vor.v[2] * 2 && z.buch, { vor, z });
  ok('Zufriedenheit: Vorschlag +8, doppelt +15', z.z[0] - vor.z[0] === 8 && z.z[1] - vor.z[1] === 8 && z.z[2] - vor.z[2] === 15, { vor: vor.z, nach: z.z });
  ok('Frage erledigt, Dankesfenster', z.offen === 0 && /Frohe Weihnachten/.test(z.dlg), z);
  // 4. nächstes Jahr: keins
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; let n = 0; do { naechsteNacht(); document.getElementById('dlg').hidden = true; n++; } while (!(datum().s === 3 && datum().t === tpj() - 1) && n < 60); spiel.mitarbeiter.forEach(m => { m.zufr = 60; m.bis = null; }); zeigeTag(); }); await pg.waitForTimeout(500);
  await pg.click('#dlgKnoepfe button:nth-child(2)'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  z = await pg.evaluate(() => ({ z: spiel.mitarbeiter.map(m => [m.name, m.zufr, wgJahre(m)]), offen: (spiel.wgOffen || []).length }));
  ok('Kein Weihnachtsgeld: Tom (lange dabei) −16, Lena (1 Jahr) −12', z.z[0][1] === 44 && z.z[1][1] === 48 && z.offen === 0, z);
  // 5. Verfall nach dem Jahreswechsel
  z = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.wgOffen = [{ hid: aktivHid(), j: datum().j }]; let n = 0; while (datum().s === 3 && n < 10) { naechsteNacht(); document.getElementById('dlg').hidden = true; n++; } wgAbgelaufen(); return (spiel.wgOffen || []).length; });
  ok('Nicht beantwortet: nach dem Jahreswechsel verfällt die Frage', z === 0, z);
  ok('Hinweis-Eintrag und bzn-Absatz vorhanden', await pg.evaluate(() => !!HINWEISE.weihnachtsgeld && /Weihnachtsgeld \(v826/.test(weitereDatenHTML())));
  ok('keine Skriptfehler', !errs.length, errs);
  console.log(`Weihnachtsgeld ${W}x${H}`); out.forEach(x => console.log(x)); const f = out.filter(x => x.startsWith('✗')).length; console.log(f ? `${f} ✗` : `alle ${out.length} ✓`);
  await b.close(); process.exit(f ? 1 : 0); })();
