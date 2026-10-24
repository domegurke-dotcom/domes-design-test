// Hofplan als Raster (PLAN-HOFPLAN.md): H1 Raster/Platzieren · H2 Anbauen/Ausbauen/Reparieren/Abreißen · H3 Ort aus dem Plan · H4 Bauland zukaufen
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/hofplan-test.js [BxH] [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [bw, bh] = (process.argv[2] || '390x844').split('x').map(Number), ordner = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: bw, height: bh }, hasTouch: bw < 900 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Plan'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x != null && !c ? ' – ' + x : ''));
  const bild = async n => { if (ordner) { fs.mkdirSync(ordner, { recursive: true }); await pg.screenshot({ path: path.join(ordner, `hofplan-${bw}x${bh}-${n}.png`) }); } };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 90000; });
  // --- H1: neues Spiel ---
  let r = await pg.evaluate(() => { const P = hofPlan(), I = planItems(), bb = planBox(P);
    const rects = I.filter(it => P.pos[it.id]).map(it => planRechteck(it, P.pos[it.id])); let ueber = 0; rects.forEach((a, i) => rects.forEach((c, j) => { if (i < j && planUeber(a, c)) ueber++; }));
    return { ha: bauHa(), b: bb.b, h: bb.h, offen: planOffen().length, typen: I.map(it => it.typ).sort().join(','), ueber, frei: baulandFrei(), weideland: weideland() }; });
  ok('Neues Spiel: 0,5 ha Bauland = 20 × 10 Kacheln', r.ha === 0.5 && r.b === 20 && r.h === 10, JSON.stringify(r));
  ok('Neues Spiel: Stall, Reitplatz, Parkplatz stehen schon im Plan', r.offen === 0 && /park/.test(r.typen) && /stall/.test(r.typen) && /reitplatz/.test(r.typen), JSON.stringify(r));
  ok('nichts überschneidet sich', r.ueber === 0);
  ok('Weideland wie bisher 1 ha (Hof 1,5 ha − 0,5 ha Bauland)', Math.abs(r.weideland - 1) < 1e-6, r.weideland);
  r = await pg.evaluate(() => [planMassTyp('stall', 6, 1), planMassTyp('stall', 8, 1), planMassTyp('reitplatz', 0, 1), planMassTyp('reitplatz', 0, 3), planMassTyp('sandpaddock', 0, 1), planMassTyp('sandpaddock', 2, 1), planMassTyp('rennbahn', 0, 1)].map(x => x.join('x')).join(' '));
  ok('Grundrisse: Stall 6 = 3×2, 8 = 3×2, Reitplatz 8×4 / 16×8, Sandpaddock 4×4 (+300 m² → 7×4), Rennbahn 40×20', r === '3x2 3x2 8x4 16x8 4x4 7x4 40x20', r);
  // Hofplan öffnen
  await pg.evaluate(() => { hofBereich = 'plan'; zeigeHof('hof'); });
  await pg.waitForTimeout(300);
  ok('Hofplan zeigt das Raster', await pg.locator('#planSvg').count() === 1);
  await bild('1-neu');
  // Gebäude auswählen und drehen
  r = await pg.evaluate(() => { const id = planItems().find(it => it.typ === 'stall').id; planWahl = id; planNeu(); const p0 = { ...hofPlan().pos[id] }; planDrehen(id); planNeu(); return { p0, p1: hofPlan().pos[id] }; });
  ok('Stall drehen', r.p1 && r.p1.r !== r.p0.r, JSON.stringify(r));
  // --- neues Gebäude: wartet im Feld „Zum Bauen“ ---
  r = await pg.evaluate(() => { const ok = bauStarten('roundpen', 1); const g = bauLetzt || gebaeude().find(x => x.typ === 'roundpen'); return { ok, gid: g.gid, wartet: planWartet(g), rest: g.bau.rest }; });
  ok('Roundpen bestellt: liegt im Feld, Bau wartet', r.ok && r.wartet, JSON.stringify(r));
  const gid = r.gid, rest0 = r.rest;
  r = await pg.evaluate(gid => { bauNacht(); return gebaeude().find(x => x.gid === gid).bau.rest; }, gid);
  ok('… Bauzeit läuft nicht, solange es nicht steht', r === rest0, r);
  await pg.evaluate(() => { planWahl = null; planNeu(); });
  await pg.click(`[data-pchip="${gid}"]`); await pg.waitForTimeout(150);
  ok('Antippen im Feld wählt es aus', await pg.evaluate(gid => planWahl === gid, gid));
  // auf eine belegte Stelle tippen → rot, auf freie → steht
  const ziel = await pg.evaluate(() => { const P = hofPlan(), it = planItems().find(x => x.typ === 'reitplatz'), R = planRechteck(it, P.pos[it.id]); return { x: R.x + 1, y: R.y + 1 }; });
  const klick = async c => { await pg.locator('#planSvg').scrollIntoViewIfNeeded(); const bx = await pg.locator('#planSvg').boundingBox(), bb = await pg.evaluate(() => planBox(hofPlan())); await pg.mouse.click(bx.x + (c.x - bb.x + .5) / bb.b * bx.width, bx.y + (c.y - bb.y + .5) / bb.h * bx.height); await pg.waitForTimeout(200); };
  await klick(ziel);
  ok('Auf belegte Stelle: passt nicht', await pg.evaluate(gid => !hofPlan().pos[gid] && /Passt dort nicht/.test(planMeld), gid));
  const frei = await pg.evaluate(() => { const p = planFreiePos(4, 4); return { x: p.x + 1, y: p.y + 1 }; });
  await klick(frei);
  r = await pg.evaluate(gid => ({ pos: hofPlan().pos[gid], wartet: planWartet(gebaeude().find(x => x.gid === gid)) }), gid);
  ok('Auf freie Stelle: Roundpen steht, Bau beginnt', r.pos && !r.wartet, JSON.stringify(r));
  r = await pg.evaluate(gid => { bauNacht(); return gebaeude().find(x => x.gid === gid).bau ? gebaeude().find(x => x.gid === gid).bau.rest : 0; }, gid);
  ok('… jetzt läuft die Bauzeit', r < rest0, r);
  await bild('2-roundpen');
  // Ziehen mit der Maus (PC) bzw. gedrückt halten (Touch)
  r = await pg.evaluate(() => { const it = planItems().find(x => x.typ === 'park'), p = hofPlan().pos[it.id], z = planFreiePos(it.l, it.t, it.id, { cx: 0, cy: 0, r: p.r }); return { id: it.id, p, z }; });
  if (r.z) {
    await pg.locator('#planSvg').scrollIntoViewIfNeeded(); const bx = await pg.locator('#planSvg').boundingBox(), bb = await pg.evaluate(() => planBox(hofPlan())), px = c => ({ x: bx.x + (c.x - bb.x + .5) / bb.b * bx.width, y: bx.y + (c.y - bb.y + .5) / bb.h * bx.height });
    const a = px({ x: r.p.x, y: r.p.y }), z = px({ x: r.z.x, y: r.z.y });
    await pg.mouse.move(a.x, a.y); await pg.mouse.down(); await pg.waitForTimeout(250); await pg.mouse.move((a.x + z.x) / 2, (a.y + z.y) / 2, { steps: 4 }); await pg.mouse.move(z.x, z.y, { steps: 4 }); await pg.mouse.up(); await pg.waitForTimeout(250);
    const p2 = await pg.evaluate(id => hofPlan().pos[id], r.id);
    ok('Parkplatz mit der Maus verschoben', p2.x === r.z.x && p2.y === r.z.y, JSON.stringify({ p2, z: r.z }));
  }
  // kein Platz → Bauen gesperrt
  r = await pg.evaluate(() => { const s = bauSperre('rennbahn'); const k = bauStarten('rennbahn', 1); return { s, k }; });
  ok('Rennbahn (2 ha) passt nicht: gesperrt mit Hinweis', /kein Platz im Hofplan/.test(r.s) && r.k === false, JSON.stringify(r));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  // Anbau, der nicht passt: Stall eingekeilt
  r = await pg.evaluate(() => { const st = gebaeude().find(x => x.typ === 'stall'), P = hofPlan(), it = planItems().find(x => x.id === st.gid), p = P.pos[st.gid], R = planRechteck(it, p);
    const blocker = { gid: 'blk', typ: 'waschplatz', stufe: 1, zustand: 100, preis: 300 }; gebaeude().push(blocker);
    const vor = p.r ? { x: R.x, y: R.y + R.h, r: 0 } : { x: R.x + R.b, y: R.y, r: 0 }; P.pos.blk = vor; const frei = !planKonflikt('blk', planRechteck(planItems().find(x => x.id === 'blk'), vor));
    const m = planBauPruefen('stall', 1, { anbau: st.gid, boxen: 4 }); spiel.gebaeude = gebaeude().filter(x => x !== blocker); delete P.pos.blk; return { frei, m }; });
  ok('Anbau ohne Platz daneben wird abgelehnt', !r.frei || /kein Platz/.test(r.m), JSON.stringify(r));
  // --- alter Spielstand: alles im Feld, Ort gesperrt ---
  r = await pg.evaluate(() => { delete spiel.hof.plan; delete spiel.hof.planNeu; spiel.hof.bauHa = 1; const P = hofPlan(); return { alt: P.alt, offen: planOffen().length, sperre: planOrtSperre().length, b: planBox(P).b, h: planBox(P).h }; });
  ok('Alter Spielstand: Raster aus seinem Bauland (1 ha ≈ 29 × 14), alles im Feld', r.alt === 1 && r.offen >= 3 && r.b * r.h >= 400, JSON.stringify(r));
  await pg.evaluate(() => { document.getElementById('nebenSchirm').classList.remove('offen'); aktBox = spiel.boxen.findIndex(b => !b.pferd); if (aktBox < 0) aktBox = 0;
    const p = mkPferd ? null : null; });
  r = await pg.evaluate(() => { if (!spiel.boxen.some(b => b.pferd)) { const box = spiel.boxen[0]; box.pferd = (typeof zufallsPferd === 'function' ? zufallsPferd() : null); } return !!spiel.boxen.some(b => b.pferd); });
  if (r) {
    await pg.evaluate(() => { aktBox = spiel.boxen.findIndex(b => b.pferd); zeigeSchirm && zeigeSchirm(null); aktenReiter = 'platz'; ortModus = null; zeigeAkte && zeigeAkte(); });
    await pg.waitForTimeout(200);
    ok('Ort gesperrt mit Knopf „Zum Hofplan“', await pg.locator('#ortZumPlan').count() === 1);
    await bild('3-ort-gesperrt');
  }
  await pg.evaluate(() => { hofBereich = 'plan'; zeigeHof('hof'); }); await pg.waitForTimeout(200);
  ok('Hinweis „Dein Hof auf dem Raster“ im Hofplan', await pg.locator('.plan-hinweis').count() >= 1);
  await bild('4-alt');
  r = await pg.evaluate(() => { planAutoSetzen(); return { offen: planOrtSperre().length }; });
  ok('Nach dem Aufstellen ist Ort frei', r.offen === 0, JSON.stringify(r));
  // Bauland gekauft → neues Stück
  r = await pg.evaluate(() => { const n0 = hofPlan().st.length; spiel.hof.bauHa += 0.5; spiel.hof.ha += 0.5; return { n0, n1: hofPlan().st.length }; });
  ok('Mehr Bauland → neues 0,5-ha-Stück', r.n1 === r.n0 + 1, JSON.stringify(r));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' ; ') : '✓ keine Seitenfehler');
  await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0);
})();
