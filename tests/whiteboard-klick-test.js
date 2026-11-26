// 26.11.2026: Whiteboard „von Hand verschieben“ mit echter Maus (ziehen) und Antippen – prüft wbAnwenden über die Oberfläche:
// Pferd auf eine Weide ziehen (p.wbHand), Antippen + Ziel antippen, Pferd von Weide zu Weide ziehen, ✕ nimmt es wieder in die Box,
// Pferd in eine freie Box ziehen (Boxen-Ansicht), Mitarbeiter auf eine Box ziehen (maPlan), Ziehen auf ein ungültiges Ziel ändert nichts.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/whiteboard-klick-test.js   ·   MOTOR=1 prüft den Motor der App   ·   BILDER_ORDNER=<Scratchpad> für Bilder
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const ORD = process.env.BILDER_ORDNER || null, MOT = !!process.env.MOTOR;   /* p.wbHand gibt es im Motor bewusst nicht (Weideplan der App) */ if (ORD) fs.mkdirSync(ORD, { recursive: true });
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1366, height: 1500 } });
  const fehler = []; pg.on('pageerror', e => fehler.push(e.message));
  let rot = 0; const ok = (t, b, x) => { console.log((b ? '✓ ' : '✗ ') + t + (b ? '' : ' – ' + (x || ''))); if (!b) rot++; };
  let nr = 0; const bild = async name => { if (!ORD) return; nr++; await pg.waitForTimeout(200); await pg.screenshot({ path: path.join(ORD, 'wb-' + String(nr).padStart(2, '0') + '-' + name + '.png') }); };
  const ev = (f, a) => pg.evaluate(f, a);
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei.replace(/\\/g, '/')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await ev(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 20000;
    while (spiel.boxen.length < 8) spiel.boxen.push({ pferd: null });
    const mk = (n, g) => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); return P; };
    ['Anna', 'Berta', 'Cora'].forEach((n, i) => { spiel.boxen[i].pferd = mk(n, 'Stute'); spiel.boxen[i].krippeVoll = true; });
    if (!weiden().some(w => w.wid === 'w2')) weiden().push({ wid: 'w2', name: 'Weide 2', ha: 2, gras: 80, matsch: 0 });
    weiden().forEach(w => { w.ha = Math.max(w.ha || 0, 2); w.gras = 80; delete w.gesperrt; });
    (spiel.mitarbeiter = spiel.mitarbeiter || []).push({ id: 'maT1', typ: 'stallbursche', name: 'Sven', w: false, wissen: {}, eig: [], gehalt: 300, ab: jzJetzt(), bis: null });
    spiel.maSicht = 'alle'; speichern(); });
  const zeige = async sicht => { await ev(s => { document.getElementById('dlg').hidden = true; wbSicht = s; wbWahl = null; wbJz = null; zeigeWhiteboard(); }, sicht); await pg.waitForTimeout(250); };
  // echtes Ziehen mit der Maus: drücken, kurz warten (180 ms), in Schritten zum Ziel, loslassen
  const ziehe = async (von, nach) => {
    const a = pg.locator(von).first(), b = pg.locator(nach).first();
    if (!(await a.count())) return 'Quelle fehlt: ' + von; if (!(await b.count())) return 'Ziel fehlt: ' + nach;
    await b.scrollIntoViewIfNeeded(); await a.scrollIntoViewIfNeeded();
    const ra = await a.boundingBox(), rb = await b.boundingBox(); if (!ra || !rb) return 'nicht sichtbar';
    await pg.mouse.move(ra.x + ra.width / 2, ra.y + ra.height / 2); await pg.mouse.down(); await pg.waitForTimeout(250);
    const steps = 12; for (let i = 1; i <= steps; i++) { await pg.mouse.move(ra.x + ra.width / 2 + (rb.x + rb.width / 2 - ra.x - ra.width / 2) * i / steps, ra.y + ra.height / 2 + (rb.y + rb.height / 2 - ra.y - ra.height / 2) * i / steps); await pg.waitForTimeout(15); }
    await pg.mouse.up(); await pg.waitForTimeout(300); return '';
  };
  const stand = () => ev(() => { const P = i => spiel.boxen.findIndex(b => b.pferd && b.pferd.name === i), Q = n => (spiel.boxen.find(b => b.pferd && b.pferd.name === n) || {}).pferd;
    return { anna: P('Anna'), berta: { ziel: (wbPlanVon(Q('Berta')) || {}).ziel || null, hand: Q('Berta').wbHand, heute: spiel.tag }, cora: { ziel: (wbPlanVon(Q('Cora')) || {}).ziel || null, hand: Q('Cora').wbHand },
      maPlan: spiel.boxen.map(b => b.maPlan || null), dlg: document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent.slice(0, 120) }; });

  // 1. Weiden-Ansicht: Berta aus „Bleiben in der Box“ auf Weide 2 ziehen
  await zeige('weiden'); await bild('weiden-vorher');
  let f = await ziehe('[data-wbq="p:1"]', '[data-wbz="w:w2:t"]'); let s = await stand();
  ok('Ziehen: Berta auf Weide 2 – Plan gesetzt und als „von Hand“ markiert (wbHand = heute)', !f && s.berta.ziel === 'w2' && (MOT || s.berta.hand === s.berta.heute), f + ' ' + JSON.stringify(s.berta));
  await bild('berta-auf-weide2');
  // 2. Antippen: Cora antippen, dann Weide 2 antippen
  await zeige('weiden'); await pg.click('[data-wbq="p:2"]'); await pg.waitForTimeout(200);
  const gewaehlt = await ev(() => wbWahl); await pg.click('[data-wbz="w:w2:t"]'); await pg.waitForTimeout(250); s = await stand();
  ok('Antippen: Cora gewählt, dann auf Weide 2 gelegt', gewaehlt === 'p:2' && s.cora.ziel === 'w2' && (MOT || s.cora.hand === s.berta.heute), gewaehlt + ' ' + JSON.stringify(s.cora));
  // 3. Berta von Weide 2 auf die erste Weide ziehen
  const w1 = await ev(() => (wbZiele().find(z => !z.pd && z.id !== 'w2') || {}).id);
  await zeige('weiden'); f = await ziehe('[data-wbq="c:1:w2:t"]', `[data-wbz="w:${w1}:t"]`); s = await stand();
  ok('Ziehen: Berta von Weide 2 auf ' + w1, !f && s.berta.ziel === w1, f + ' ' + JSON.stringify(s.berta));
  // 4. Ziehen auf ein ungültiges Ziel (leerer Bereich) ändert nichts
  await zeige('weiden'); f = await ziehe(`[data-wbq="c:1:${w1}:t"]`, '.wb-h'); s = await stand();
  ok('Ziehen ins Leere: Plan bleibt', !f && s.berta.ziel === w1, f + ' ' + JSON.stringify(s.berta));
  // 5. ✕ an der Karte nimmt Berta wieder in die Box
  await zeige('weiden'); const x = pg.locator('[data-wbweg^="1:"]').first();
  if (await x.count()) { await x.scrollIntoViewIfNeeded(); await x.click(); await pg.waitForTimeout(250); }
  s = await stand(); const zurueck = await ev(() => !!document.querySelector('#wbBleibt [data-wbq="p:1"]'));
  ok('✕: Berta bleibt wieder in der Box (steht unter „Bleiben in der Box“)', s.berta.ziel === null && zurueck, JSON.stringify(s.berta) + ' ' + zurueck);
  await bild('berta-zurueck');
  // 6. Boxen-Ansicht: Anna (Box 1) in die freie Box 6 ziehen
  await zeige('boxen'); await bild('boxen-vorher');
  f = await ziehe('[data-wbq="k:0"]', '[data-wbz="b:5"]'); s = await stand();
  ok('Ziehen: Anna von Box 1 in die freie Box 6', !f && s.anna === 5, f + ' ' + JSON.stringify(s));
  // 7. Anna auf eine belegte Box ziehen geht nicht
  await zeige('boxen'); f = await ziehe('[data-wbq="k:5"]', '[data-wbz="b:1"]'); s = await stand();
  ok('Ziehen auf eine belegte Box: Anna bleibt in Box 6', !f && s.anna === 5, f + ' ' + JSON.stringify(s));
  // 8. Mitarbeiter Sven auf Box 2 (Berta) ziehen
  await zeige('boxen'); if (!(await pg.locator('[data-wbq="m:maT1"]').count())) { const g = pg.locator('[data-wbmag="stallbursche"]'); if (await g.count()) { await g.click(); await pg.waitForTimeout(200); } }
  f = await ziehe('[data-wbq="m:maT1"]', '[data-wbz="b:1"]');
  for (let k = 0; k < 2 && !(await ev(() => document.getElementById('dlg').hidden)); k++) { await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200); }
  s = await stand(); await bild('mitarbeiter-zugeteilt');
  ok('Ziehen: Stallbursche Sven fest auf Box 2 (maPlan)', !f && s.maPlan[1] && Object.values(s.maPlan[1]).includes('maT1'), f + ' ' + JSON.stringify(s.maPlan[1]));
  ok('keine Seitenfehler', !fehler.length, fehler.join(' | '));
  await br.close(); process.exit(rot ? 1 : 0);
})();
