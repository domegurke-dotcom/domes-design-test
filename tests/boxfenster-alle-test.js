// B2 (PLAN-BOXANSICHT.md, Dome 25.10.): jedes Symbol und jeder Kreis-Eintrag am PC – eigenes Pferd und Pensionspferd, in der Box, auf der Weide und auf dem Sandpaddock (v828)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/boxfenster-alle-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false; spiel.ausruestung.putzkiste = true; spiel.geld = 50000; });
  const fall = async (name, setup) => {
    await pg.evaluate(setup); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; bxFenster = null; bxRing = null; bxPutz = false; putzModus = false; document.body.classList.remove('infoOffen'); zeigeSchirm(null); zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(300);
    const syms = await pg.$$eval('#boxUI .bxs', a => a.map(x => x.dataset.bx));
    ok(`${name}: Symbole ${syms.join(', ')}`, syms.length >= 5 && !syms.includes('putzen'), syms);
    const zu = async () => { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.keyboard.press('Escape'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
      await pg.evaluate(() => { bxFenster = null; bxRing = null; if (bxPutz) bxPutzZu(); document.body.classList.remove('infoOffen'); zeigeAkte(); }); await pg.waitForTimeout(150); };
    const pruefFenster = async (was) => pg.evaluate(was => { const I = document.getElementById('info'), dlg = !document.getElementById('dlg').hidden;
      return { f: bxFenster, putz: bxPutz && putzModus, dlg, txt: dlg ? document.querySelector('#dlg').innerText.slice(0, 60) : (I.innerText || '').replace(/\s+/g, ' ').slice(0, 80), sicht: document.body.classList.contains('infoOffen') && I.getBoundingClientRect().height > 60 }; }, was);
    for (const [i, z0] of (await pg.$$eval('#kopfRinge [data-vstab]', a => a.map(x => x.dataset.vstab))).entries()) { await pg.click(`#kopfRinge .kring:nth-child(${i + 1})`); await pg.waitForTimeout(350); const z = await pruefFenster();
      ok(`${name}: Ring ${i + 1} öffnet Versorgung → ${z0}`, z.f === 'versorgung' && z.sicht && await pg.evaluate(t => bxTab === t, z0), z); await zu(); }
    for (const k of syms) {
      if (k === 'fuettern') { await pg.click(`#boxUI [data-bx="${k}"]`); await pg.waitForTimeout(300); const z = await pruefFenster(); ok(`${name}: Füttern öffnet ein Fenster`, z.dlg, z); await zu(); continue; }
      await pg.click(`#boxUI [data-bx="${k}"]`); await pg.waitForTimeout(350);
      const items = await pg.$$eval('#boxUI [data-bxring]', a => a.map(x => x.dataset.bxring + (x.dataset.aus ? '(aus)' : '')));
      if (!items.length) { const z = await pruefFenster(); ok(`${name}: ${k} öffnet ein Fenster mit Inhalt`, z.sicht && z.txt.length > 20, z);
        if (k === 'orte') { const ziele = await pg.$$eval('#info [data-ort]', a => a.map(x => x.dataset.ort)); ok(`${name}: Orte hat anklickbare Ziele (${ziele.join(', ')})`, ziele.length >= 2, ziele); }
        if (ORD) await pg.screenshot({ path: `${ORD}/alle-${name.replace(/\W+/g, '_')}-${k}.png` });
        await zu(); continue; }
      ok(`${name}: ${k} öffnet einen Kreis (${items.join(', ')})`, items.length >= 2);
      for (const it of items) { const id = it.replace('(aus)', '');
        await zu(); await pg.click(`#boxUI [data-bx="${k}"]`); await pg.waitForTimeout(250); await pg.click(`#boxUI [data-bxring="${id}"]`); await pg.waitForTimeout(400);
        const z = await pruefFenster();
        const gut = it.endsWith('(aus)') ? z.dlg : (z.sicht && z.txt.length > 20) || z.dlg || (z.putz && (await pg.$$('#boxUI [data-bxtool="buerste"]')).length > 0);
        ok(`${name}: ${k} → ${it}`, gut, z);
        if (ORD) await pg.screenshot({ path: `${ORD}/alle-${name.replace(/\W+/g, '_')}-${k}-${id}.png` }); }
      await zu(); }
  };
  const neu = () => { spiel.einsteller = []; spiel.boxen.forEach(b => { b.pferd = null; }); const p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Flocke' }); p.pflege = erzeugePflege(p); spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0; return p; };
  await fall('Eigenes Pferd, Box', `(${neu})()`);
  await fall('Eigenes Pferd, Weide', `(() => { const p = (${neu})(); aufWeide(p, spiel.boxen[0]); })()`);
  await fall('Pensionspferd, Box', `(() => { const p = (${neu})(); p.einsteller = 'ex1'; einstellerListe().push({ eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'box', leistungen: {}, zufr: 80, stufe: 1, preis: 200 }); })()`);
  await fall('Pensionspferd, Weide', `(() => { const p = (${neu})(); p.einsteller = 'ex1'; einstellerListe().push({ eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'weide', leistungen: {}, zufr: 80, stufe: 1, preis: 200 }); aufWeide(p, spiel.boxen[0]); })()`);
  // v828 (Dome 25.10.: „besonders wenn die Pferde/Pensionspferde auf der Weide/Sandpaddock sind“)
  const pd = () => { if (!gebaeude().some(g => g.gid === 'gPdT')) gebaeude().push({ gid: 'gPdT', typ: 'sandpaddock', stufe: 2, zustand: 100 }); const g = paddocks().find(x => x.gid === 'gPdT'), b = spiel.boxen[0], p = b.pferd; rausAusBox(b); p.paddock = { seit: spiel.tag, pid: g.gid }; p.paddockZuletzt = spiel.tag; };
  await fall('Eigenes Pferd, Sandpaddock', `(() => { (${neu})(); (${pd})(); })()`);
  await fall('Pensionspferd, Sandpaddock', `(() => { const p = (${neu})(); p.einsteller = 'ex1'; einstellerListe().push({ eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'paddock', leistungen: {}, zufr: 80, stufe: 1, preis: 200 }); (${pd})(); })()`);
  // krank draußen: Plakette statt Denkblase, Tierarzt-Symbol rot, Klemmbrett nennt den Befund
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; befundListe(p).push({ id: 'bfS', art: 'husten', grad: 2, seit: spiel.tag, ursache: 'Test', bemerkt: { von: 'du', tag: spiel.tag }, meldungen: [], vermutung: null }); zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(400);
  let k = await pg.evaluate(() => ({ chips: [...document.querySelectorAll('.bxchip')].map(x => x.textContent), denk: !!document.querySelector('.bxdenk'), ta: (document.querySelector('#boxUI [data-bx="tierarzt"] .bxd') || {}).className, ring: (document.querySelector('#kopfRinge .kring') || {}).textContent }));
  ok('Pensionspferd krank auf dem Sandpaddock: Denkblase auch draußen (Dome 25.10.), Plakette Besitzer informieren, Tierarzt-Symbol rot', k.denk && k.chips.some(c => /Besitzer/.test(c)) && /\br\b/.test(k.ta || ''), k);
  if (ORD) await pg.screenshot({ path: `${ORD}/alle-krank-sandpaddock.png` });
  await pg.click('#boxUI [data-bx="tierarzt"]'); await pg.waitForTimeout(400);
  k = await pg.evaluate(() => ({ f: bxFenster, tab: bxTab, besV: !!document.querySelector('#info [data-besvor]'), ta: !!document.getElementById('tierarztKnopf') }));
  ok('Tierarzt-Symbol öffnet Gesundheit mit „Besitzer informieren“ (Pferd bleibt draußen)', k.f === 'versorgung' && k.tab === 'gesund' && (k.besV || k.ta), k);
  ok('keine Seitenfehler', !errs.length, errs);
  out.forEach(l => console.log(l)); await b.close(); process.exit(out.some(l => l[0] === '✗') ? 1 : 0); })();
