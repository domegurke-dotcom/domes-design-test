// PLAN-EIMERBILD E2 (17.11.2026): Krippe füttern bzw. volle Krippe antippen → Blase mit Eimer-Draufsicht und Menge („1,1 kg Hafer, Mineralfutter · 2,2 von 12 Litern“)
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/eimerbild-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2];
(async () => {
  const b = await chromium.launch(); const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); const errs = [];
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  for (const [name, vw, vh] of [['pc', 1366, 768], ['quer', 844, 390], ['hoch', 390, 844]]) {
    const pg = await b.newPage({ viewport: { width: vw, height: vh } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.infoGesehen = { krippe: true, heuhaufen: true };
      const bx = spiel.boxen[0], p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Eimer' }); p.pflege = erzeugePflege(p); p.pflege.gesundheit = 100;
      p.futterplan = { mahl: 2, kg: { heu: 9, hafer: 1.5, mineral: 0.1 }, vom: 'du' }; bx.pferd = p; bx.krippeVoll = false; bx.kraftVoll = false; bx.einstreu = 'stroh';
      spiel.futter.lager.heu = 500; spiel.futter.lager.hafer = 50; spiel.futter.lager.mineral = 5;
      aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); aktenModus = 'pflege'; aktenReiter = 'versorgung'; zeigeStall(); zeigeTag(); document.getElementById('stall').scrollIntoView({ block: 'center' }); });
    await pg.waitForTimeout(300);
    /* echter Klick auf den Futtereimer/die Krippe im Stallbild */
    const ziel = await pg.$('.stufeEl .sKrippe') || await pg.$('#krippe'); await ziel.click({ force: true }); await pg.waitForTimeout(600);
    let st = await pg.evaluate(() => { const b = document.getElementById('eimerBlase'), i = b && b.querySelector('img'); return { da: !!b, txt: b ? b.innerText.replace(/\s+/g, ' ') : '', bild: i ? i.getAttribute('src') : '', geladen: !!(i && i.complete && i.naturalWidth > 0), E: window.eimerBlaseStand || null }; });
    if (O) await pg.screenshot({ path: `${O}/eimer-${name}.png` });
    ok(`${name}: nach dem Füttern Blase mit Eimerbild`, st.da && st.geladen, JSON.stringify(st));
    ok(`${name}: Text nennt Menge und Liter (${st.txt})`, /kg Hafer/.test(st.txt) && /von 12 Litern/.test(st.txt), st.txt);
    ok(`${name}: Bild passt zur Menge (${st.bild})`, /eimer-stufe[12]-hafer-(1|2|3|4|6|9|12)\.webp$/.test(st.bild) && st.E && Math.abs(st.E.liter - (1.5 / 0.5 + 0.1 / 0.65)) < 0.3, JSON.stringify(st.E));
    await pg.waitForTimeout(4300); ok(`${name}: Blase verschwindet von selbst`, !(await pg.$('#eimerBlase')));
    await (await pg.$('.stufeEl .sKrippe') || await pg.$('#krippe')).click({ force: true }); await pg.waitForTimeout(400);
    ok(`${name}: volle Krippe antippen zeigt die Blase wieder`, !!(await pg.$('#eimerBlase')));
    await pg.click('#eimerBlase'); await pg.waitForTimeout(200); ok(`${name}: Antippen schließt die Blase`, !(await pg.$('#eimerBlase')));
    /* E6: Heu füttern → Blase mit Heuhaufen (Stufe 1/2) bzw. Heunetz (Stufe 3) */
    await pg.evaluate(() => document.getElementById('heuhaufen').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await pg.waitForTimeout(500);
    const hb = await pg.evaluate(() => { const b = document.getElementById('eimerBlase'), i = b && b.querySelector('img'); return { txt: b ? b.innerText.replace(/\s+/g, ' ') : '', bild: i ? i.getAttribute('src') : '', ok: !!(i && i.complete && i.naturalWidth), H: window.heuBlaseStand || null }; });
    if (O) await pg.screenshot({ path: `${O}/heu-${name}.png` });
    ok(`${name}: Heu füttern zeigt die Heu-Blase (${hb.txt})`, hb.ok && /kg Heu/.test(hb.txt) && /heuhaufen-(8|10)\.webp$/.test(hb.bild), JSON.stringify(hb));
    if (name === 'pc') { const r3 = await pg.evaluate(() => { const bx = spiel.boxen[0], alt = bx.stufe; bx.stufe = 3; const a = heuInhalt(bx); bx.pferd.futterHeute.genutzt.heu = 3; const c = heuInhalt(bx); bx.stufe = alt; return [a.bild, c.bild]; });
      ok('Box Stufe 3: Heunetz – prall ab 7 kg, sonst halb (3 kg)', /heunetz-8\.webp$/.test(r3[0]) && /heunetz-3\.webp$/.test(r3[1]), JSON.stringify(r3)); }
    await pg.evaluate(() => { const b = document.getElementById('eimerBlase'); if (b) b.remove(); });
    /* E4: Eimerbild im Futterplan (Plan: 1,5 kg Hafer + 0,1 kg Mineral ≈ 3,2 l) */
    await pg.evaluate(() => { const bx = spiel.boxen[0]; futterplanDialog(bx.pferd, bx, () => { document.getElementById('dlg').hidden = true; }); }); await pg.waitForTimeout(300);
    const fp = await pg.evaluate(() => { const e = document.querySelector('.fp-eimer'), i = e && e.querySelector('img'); return { da: !!e, txt: e ? e.innerText : '', bild: i ? i.getAttribute('src') : '', ok: !!(i && i.complete && i.naturalWidth) }; });
    if (O) await pg.screenshot({ path: `${O}/futterplan-${name}.png` });
    ok(`${name}: Futterplan zeigt den Eimer (${fp.txt})`, fp.da && fp.ok && /3,2 von 12 Litern/.test(fp.txt) && /hafer-3\.webp$/.test(fp.bild), JSON.stringify(fp));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
    if (name === 'pc') { const r = await pg.evaluate(() => { const bx = spiel.boxen[0]; bx.stufe = 2; const E2 = eimerInhalt(bx); bx.pferd.futterHeute = { tag: spiel.tag, genutzt: { hafer: 9 }, fehlt: [] }; const E3 = eimerInhalt(bx); bx.pferd.futterHeute = { tag: spiel.tag, genutzt: { sp_senior: 1 }, fehlt: [] }; const E4 = eimerInhalt(bx); bx.pferd.futterHeute = null; const E5 = eimerInhalt(bx); return { E2: E2.bild, E3: [E3.liter, E3.bild], E4: E4.bild, E5: E5.bild }; });
      ok('Krippe (Stufe 2) nimmt das Bild der Wandkrippe', /eimer-stufe2-hafer-/.test(r.E2), JSON.stringify(r));
      ok('über 12 Liter: nur bis 12 Liter (Füllgrenze)', r.E3[0] === 12 && /-12\.webp$/.test(r.E3[1]), JSON.stringify(r));
      ok('Spezialfutter ohne eigenes Bild: wie Müsli; leer = leerer Eimer', /muesli/.test(r.E4) && /eimer-stufe2\.webp$/.test(r.E5), JSON.stringify(r)); }
    await pg.close();
  }
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
