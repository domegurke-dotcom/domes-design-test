// Aqua wie ein Spieler (v877): mit echten Klicks aus der Box über Pferdepflege → Orte → Aqua, Anwendungen machen, zurück zur Box – alle 3 Stufen, 3 Ansichten
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-spielerweg-test.js [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => {
  const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : '')); const errs = [];
  for (const [W, H] of [[1366, 768], [844, 390], [390, 844]]) for (const stufe of [1, 2, 3]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } }); pg.on('pageerror', e => errs.push(e.message)); const tag = `${W}×${H} Stufe ${stufe}`;
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
    await pg.click('#smNeu'); await pg.waitForTimeout(120); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(120);
    await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(350);
    await pg.evaluate(s => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.sparmodus = true; spiel.geld = 400000; VET.verbotAb = 99; while (datum().s === 3) spiel.tag++;
      gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: s, zustand: 100 }); spiel.anlage.aqua = true;
      const p = neuesPferd({ name: 'Fiona', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); p.wasserGewohnt = 9; p.aquaGewohnt = 9; spiel.boxen[0].pferd = p;
      document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeTag(); zeigeAkte(); }, stufe);
    await pg.waitForTimeout(300);
    const klick = async (sel, was) => { const e = await pg.$(sel); if (!e || !(await e.isVisible())) { ok(`${tag}: ${was} sichtbar`, false, sel); return false; } await e.click(); await pg.waitForTimeout(250); return true; };
    // Weg zu Pferdepflege → Orte
    let weg = true;
    if (await pg.$('[data-m="pflege"]')) weg = await klick('[data-m="pflege"]', 'Pferdepflege');
    if (weg && await pg.$('[data-r="platz"]')) weg = await klick('[data-r="platz"]', 'Reiter Orte');
    if (weg && !(await pg.$('[data-ort="aqua"], [data-okort="aqua"]'))) { const o = await pg.$('[data-bx="orte"]'); if (o) { await o.click(); await pg.waitForTimeout(300); } }
    const k = await pg.$('[data-ort="aqua"], [data-okort="aqua"]'); ok(`${tag}: Aqua-Kachel in Orte vorhanden`, !!k);
    if (k) { await k.click({ force: true }); await pg.waitForTimeout(350); }
    const n0 = await pg.evaluate(() => document.querySelectorAll('[data-aqua]').length); ok(`${tag}: Aqua-Ansicht mit Programmen`, n0 === (stufe === 3 ? 12 : 3), n0);
    // Anwendung 1 (Schwimmen 20) und Wirkung
    const vor = await pg.evaluate(() => ({ e: energie(spiel.boxen[0].pferd), n: spiel.boxen[0].pferd.nass }));
    await pg.click('[data-aqua="schwimmen:20"]'); await pg.waitForTimeout(500);
    const nach = await pg.evaluate(() => ({ e: energie(spiel.boxen[0].pferd), nass: spiel.boxen[0].pferd.nass === spiel.tag, ort: ortModus, meld: (document.querySelector('.klasse') || {}).textContent || '' }));
    ok(`${tag}: Schwimmen gemacht (Energie runter, Pferd nass, Ergebnistext)`, nach.e < vor.e && nach.nass && /Minuten/.test(nach.meld), `${vor.e}→${nach.e}`);
    ok(`${tag}: nach der Anwendung noch in der Aqua-Ansicht`, nach.ort === 'aqua');
    // zweite Anwendung am selben Tag gesperrt
    const gesperrt = await pg.evaluate(() => document.querySelector('[data-aqua="schwimmen:20"]') === null || document.querySelector('[data-aqua="schwimmen:20"]').disabled); ok(`${tag}: zweite Einheit am selben Tag gesperrt`, gesperrt);
    if (stufe === 3) { spiel_tag: { } await pg.evaluate(() => { spiel.tag++; spiel.boxen[0].pferd.energie = energieMax(spiel.boxen[0].pferd); zeigeAkte(); }); await pg.waitForTimeout(300);
      const r = await pg.$('[data-aqua="reha:10"]'); if (r) { await r.click(); await pg.waitForTimeout(500); } ok(`${tag}: Reha am nächsten Tag am Laufband`, await pg.evaluate(() => spiel.boxen[0].pferd.aquaTag && spiel.boxen[0].pferd.aquaTag.prog === 'reha')); }
    if (ORD && stufe === 3) await pg.screenshot({ path: path.join(ORD, `aqua-weg-${W}x${H}.png`) });
    // zurück zur Box
    const z = await pg.$('#ortZurueck'); ok(`${tag}: Zurück-Knopf vorhanden`, !!z);
    if (z) { await z.click(); await pg.waitForTimeout(300); }
    const zurueck = await pg.evaluate(() => ortModus !== 'aqua' && !!spiel.boxen[0].pferd && !document.getElementById('nebenSchirm').classList.contains('offen')); ok(`${tag}: zurück in der Box (Pferd noch da, kein Menü offen)`, zurueck);
    await pg.close();
  }
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
