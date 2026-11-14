// Pension nach Lage (v1028): Makler-Angebote haben Bundesland + nächste Großstadt mit Entfernung, der gekaufte Hof übernimmt sie,
// Pension-Richtwert × Länderfaktor × Stadtnähe, Anfragen × Stadtgröße; Anzeige im Makler und im Pension-Panel. Mit echten Klicks (Makler → Kaufen).
// Start: NODE_PATH=<playwright> node tests/pension-lage-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const r1 = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const start = { rw: pensionRichtwert(1), nf: lageNachfrage(), pf: lagePreisF(), H: { bl: spiel.hof.bundesland, ort: spiel.hof.ort, lage: spiel.hof.lage } };
    const k = kredite()[0]; if (k) k.getilgt = k.summe; zentral().geld = 5e6;
    const A = maklerAngebote(); return { start, A: A.map(a => ({ mid: a.mid, land: a.land, lage: a.lage, text: a.text, boxen: a.boxen })) }; });
  ok('Starthof (Standard Verden): Lage aus dem Ort', r1.start.H.bl === '03' && r1.start.H.ort === 'Verden (Aller)' && r1.start.H.lage && r1.start.pf === 1.05 * (r1.start.H.lage.km <= 15 ? 1.2 : r1.start.H.lage.km <= 30 ? 1.1 : 1), JSON.stringify(r1.start));
  ok('jedes Angebot hat eine Lage', r1.A.every(a => a.lage && a.lage.stadt && a.lage.ew >= 1e5 && a.lage.km >= 3 && a.lage.km <= 120), r1.A.map(a => a.lage && a.lage.stadt + ' ' + a.lage.km).join(', '));
  ok('Lage steht im Text', r1.A.every(a => a.text.includes(' km bis ' + a.lage.stadt)));
  // v1030 (Etappe M1): Lage kommt aus festen Orten je Bundesland; die Stadt ist die nächste Großstadt (Luftlinie)
  const vert = await pg.evaluate(() => { let falsch = 0; maklerAngebote().forEach(A => { const g = lageAusOrt(A.land, A.ort); if (!g || g.stadt !== A.lage.stadt || g.km !== A.lage.km) falsch++; }); return { falsch }; });
  ok('Lage passt zum Ort', vert.falsch === 0, vert.falsch);
  // Kaufen mit Klicks: ein Hof mit Boxen
  const ziel = r1.A.find(a => a.boxen > 0 && a.land === '03') || r1.A.find(a => a.boxen > 0);
  await pg.evaluate(() => zeigeImmobilien()); await pg.waitForTimeout(300);
  if (ORD) await pg.screenshot({ path: ORD + '/lage-makler.png', fullPage: false });
  await pg.click(`[data-makler="${ziel.mid}"]`); await pg.waitForTimeout(300);
  const kaufTxt = await pg.evaluate(() => document.getElementById('dlg').innerText);
  await pg.fill('#kaufName', 'Lagehof'); const knopf = await pg.$$('#dlgKnoepfe button'); await knopf[0].click(); await pg.waitForTimeout(400);
  for (let i = 0; i < 4; i++) { const d = await pg.evaluate(() => !document.getElementById('dlg').hidden); if (!d) break; await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300); }
  const r2 = await pg.evaluate(mid => { const hid = hofReihe().find(h => h !== 'h1' && hofVon(h).lage); if (!hid) return { fehlt: true, hoefe: hofReihe().length };
    hofWechseln(hid); const H = spiel.hof, R = pensionRegeln(); R.offen = true; R.preis = { ...PENSION_PREIS };
    const erw = (PENSION_LAND[H.bundesland] || 1) * (H.lage.km <= 15 ? 1.2 : H.lage.km <= 30 ? 1.1 : 1);
    return { lage: H.lage, bl: H.bundesland, pf: lagePreisF(), erw, nf: lageNachfrage(), rw: pensionRichtwert(1), roh: PENSION_PREIS[1] * (1 + (ansehenWirk() - 100) / 400) }; }, ziel.mid);
  ok('gekaufter Hof hat Lage', !r2.fehlt && r2.lage && r2.lage.stadt === ziel.lage.stadt, JSON.stringify(r2).slice(0, 160));
  if (!r2.fehlt) { ok('Preisfaktor = Land × Stadtnähe', Math.abs(r2.pf - r2.erw) < 1e-9, r2.pf.toFixed(3));
    ok('Richtwert × Lage', Math.abs(r2.rw - r2.roh * r2.pf) < 1e-6, Math.round(r2.rw) + ' €'); ok('Nachfrage-Faktor 1–1,5', r2.nf >= 1 && r2.nf <= 1.5, r2.nf.toFixed(3)); }
  // Formel: München 10 km → ×1,2 Preis und hohe Nachfrage; Rostock 70 km → keine Nachfrage-Wirkung
  const r3 = await pg.evaluate(() => ({ m: [lagePreisF({ bundesland: '09', lage: { stadt: 'München', ew: 1505036, km: 10 } }), lageNachfrage({ lage: { stadt: 'München', ew: 1505036, km: 10 } })],
    r: [lagePreisF({ bundesland: '13', lage: { stadt: 'Rostock', ew: 204929, km: 70 } }), lageNachfrage({ lage: { stadt: 'Rostock', ew: 204929, km: 70 } })] }));
  ok('München 10 km: Preis ×1,38, Nachfrage ×1,42', Math.abs(r3.m[0] - 1.38) < 1e-9 && Math.abs(r3.m[1] - (1 + 0.5 * (1 - 10 / 60))) < 1e-9, r3.m.map(x => x.toFixed(3)).join(' / '));
  ok('Rostock 70 km: Preis ×0,9, Nachfrage 1', Math.abs(r3.r[0] - 0.9) < 1e-9 && r3.r[1] === 1, r3.r.join(' / '));
  // Pension-Panel mit Klick über die Hofverwaltung
  await pg.evaluate(() => { zeigeHof('hof'); }); await pg.waitForTimeout(300);
  const pn = await pg.evaluate(() => { const h = typeof pensionHTML === 'function' ? pensionHTML() : ''; return h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); });
  ok('Panel zeigt Lage', /Lage 📍/.test(pn) && / km bis /.test(pn), pn.slice(pn.indexOf('Lage'), pn.indexOf('Lage') + 160));
  console.log('Kauffenster:', kaufTxt.replace(/\s+/g, ' ').slice(0, 200));
  L.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler');
  const bad = L.some(l => l[0] === '✗') || errs.length; console.log(bad ? 'FEHLER' : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0); })();
