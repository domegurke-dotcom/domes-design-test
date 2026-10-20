// Hinweisblasen-Test (T1, PLAN-HINWEISE.md): Blasen im Charakter-/Immobilienmenü, Spielstart-Fenster, Leitfaden in der Box (Füttern → Wasser → Misten …), Limits, Hilfe, Einsteiger-Wissen
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/hinweise-test.js [Ordner für Bildschirmfotos]
const { chromium } = require('playwright'); const path = require('path');
const ORDNER = process.argv[2];
(async () => {
  const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const errs = [];
  for (const [ansicht, w, h] of [['hoch', 390, 844], ['quer', 844, 390], ['pc', 1366, 768]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
    await pg.click('#smNeu'); await pg.waitForTimeout(700);
    const t1 = await pg.evaluate(() => { const b = document.getElementById('hinweisBlase'); return b && !b.hidden ? b.textContent : ''; });
    if (ansicht === 'hoch') ok('Charaktermenü: Blase „Spieltempo“', /Spieltempo/.test(t1), t1.slice(0, 40));
    if (ORDNER) await pg.screenshot({ path: `${ORDNER}/charakter-${ansicht}.png` });
    await pg.click('#hinweisBlase'); await pg.waitForTimeout(500);
    const t2 = await pg.evaluate(() => { const b = document.getElementById('hinweisBlase'); return b && !b.hidden ? b.textContent : ''; });
    if (ansicht === 'hoch') ok('Antippen → nächste Blase „Erfahrung“', /Erfahrung/.test(t2), t2.slice(0, 40));
    await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(400);
    await pg.click('#dlgKnoepfe button'); await pg.waitForTimeout(500);
    const t3 = await pg.evaluate(() => { const b = document.getElementById('hinweisBlase'); return b && !b.hidden ? b.textContent : ''; });
    if (ansicht === 'hoch') ok('Immobilien: Blase „Hof kaufen“', /Hof kaufen/.test(t3), t3.slice(0, 40));
    if (ORDNER) await pg.screenshot({ path: `${ORDNER}/immobilien-${ansicht}.png` });
    await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(300); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(1200);
    const st = await pg.evaluate(() => document.getElementById('dlgInhalt').textContent);
    if (ansicht === 'hoch') ok('Spielstart: großes Fenster „So schaffst du die ersten 2 Jahre“', /ersten 2 Jahre/.test(st), st.slice(0, 80));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const p = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 7, name: 'Lotte' }); p.pflege = erzeugePflege(p); spiel.boxen[0].pferd = p; spiel.boxen[0].krippeVoll = false; spiel.boxen[0].mistig = true; aktBox = 0;
      document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeStall(); zeigeTag(); window.scrollTo(0, 0); });
    await pg.waitForTimeout(500); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.waitForTimeout(700);
    const L1 = await pg.evaluate(() => blase && blase.k);
    if (L1 !== 'lf_pferd') console.log('L1 dbg', ansicht, await pg.evaluate(() => [blase && blase.k, document.getElementById('dlg').hidden, JSON.stringify(spiel.tipps)].join(' ')));
    if (ansicht === 'hoch') ok('Leitfaden startet mit „Dein Pferd“', L1 === 'lf_pferd', String(L1));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.click('#hinweisBlase'); await pg.waitForTimeout(900);
    const L2 = await pg.evaluate(() => ({ k: blase && blase.k, ring: !document.getElementById('hinweisRing').hidden }));
    if (ansicht === 'hoch') ok('Danach „Füttern“ mit Ring am Heu', L2.k === 'lf_fuettern' && L2.ring, JSON.stringify(L2));
    if (ORDNER) await pg.screenshot({ path: `${ORDNER}/leitfaden-${ansicht}.png` });
    if (ansicht === 'hoch') {
      await pg.evaluate(() => { spiel.boxen[0].krippeVoll = true; }); await pg.waitForTimeout(1000);
      const L3 = await pg.evaluate(() => blase && blase.k); ok('Gefüttert → nächster Schritt (Wasser/Misten)', L3 === 'lf_wasser' || L3 === 'lf_misten', String(L3));
      const Z = await pg.evaluate(() => { spiel.tipps = Object.fromEntries(LEITFADEN.map(x => [x[0], 1])); spiel.tipps.start = 1; spiel.tipps.geldKnapp = 1; if (blase) blaseWeg(false); delete spiel.hinweisZaehler; let n = 0;
        ['stall', 'markt', 'mitarbeiter', 'bauen', 'weide'].forEach(k => { spiel.tippWarte = [k]; hinweisPruefen(); if (blase) { n++; blaseWeg(false); } }); return { n, zaehler: spiel.hinweisZaehler && spiel.hinweisZaehler.n }; });
      ok('Nebentipps: höchstens 3 je Spieltag', Z.n <= 3 && Z.zaehler <= 3, JSON.stringify(Z));
      const H = await pg.evaluate(() => { hilfeZeigen(); return document.getElementById('dlgInhalt').textContent; }); ok('Hilfe listet gesehene Tipps', /Hilfe/.test(H) && /Füttern|Dein Pferd/.test(H), H.slice(0, 60));
      const E = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; enzyKat = 'einsteiger'; zeigeEnzy(); return document.getElementById('auswahl').textContent; }); ok('Enzyklopädie „Einsteiger-Wissen“', /Einsteiger-Wissen/.test(E) && /Heu ist das Hauptfutter/.test(E));
    }
    await pg.close();
  }
  console.log(out.join('\n')); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
