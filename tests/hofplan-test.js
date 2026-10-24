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
  // --- H2: Anbauen im Plan ---
  r = await pg.evaluate(() => { const st = gebaeude().find(x => x.typ === 'stall'), P = hofPlan(); planWahl = st.gid; planNeu();
    const knoepfe = [...document.querySelectorAll('#planBox .plan-kn button')].map(b => b.textContent).join('|');
    // Platz schaffen: Stall an eine freie Stelle mit Luft rechts
    const it = planItems().find(x => x.id === st.gid); const z = planFreiePos(it.l + 3, it.t, st.gid); if (z) { P.pos[st.gid] = { x: z.x, y: z.y, r: z.r }; } return { knoepfe, l: it.l, gid: st.gid }; });
  ok('Stall antippen: Anbauen, Ausbauen, Reparieren/Abreißen', /Anbauen/.test(r.knoepfe) && /Ausbauen/.test(r.knoepfe) && /Abreißen/.test(r.knoepfe), r.knoepfe);
  const stGid = r.gid, l0 = r.l;
  await pg.evaluate(() => planNeu());
  await pg.locator('#planBox [data-anbau]').first().click(); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => ({ v: !!planVorschau, ok: !!document.querySelector('[data-pvok]:not([disabled])'), mass: planVorschau && planVorschau.mass }));
  ok('Anbauen zeigt die Vorschau (grün, Bau bestätigen)', r.v && r.ok, JSON.stringify(r));
  await bild('5-anbau-vorschau');
  await pg.selectOption('#pvMenge', '4'); await pg.waitForTimeout(150);
  await pg.locator('[data-pvok]').click(); await pg.waitForTimeout(150);
  r = await pg.evaluate(gid => { const st = gebaeude().find(x => x.gid === gid), k = gebKinder(st).find(x => x.bau), it = planItems().find(x => x.id === gid); return { kind: !!k, l: it.l, l0: it.l0, fest: planFest(it) }; }, stGid);
  ok('Anbau beauftragt: Stall reserviert die neue Länge, Teil orange, nicht verschiebbar', r.kind && r.l > r.l0 && r.fest, JSON.stringify(r));
  await bild('6-anbau-baustelle');
  r = await pg.evaluate(gid => { for (let i = 0; i < 40 && gebaeude().some(x => x.bau && x.anbau === gid); i++) bauNacht(); gebVerschmelzen(); const it = planItems().find(x => x.id === gid); return { l: it.l, l0: it.l0, boxen: gebaeude().find(x => x.gid === gid).boxen, fest: planFest(it) }; }, stGid);
  ok('Anbau fertig: Stall länger, 10 Boxen, wieder frei verschiebbar', r.boxen === 10 && r.l === r.l0 && !r.fest, JSON.stringify(r));
  // Teil-Abriss: nur der abgerissene Teil ist orange
  r = await pg.evaluate(gid => { const st = gebaeude().find(x => x.gid === gid), t = gebTeilen(st, 6); t.abriss = { rest: 2 }; const it = planItems().find(x => x.id === gid); return { l: it.l, l0: it.l0 }; }, stGid);
  ok('Teil-Abriss: Rückbau-Teil orange, Rest bleibt', r.l0 < r.l, JSON.stringify(r));
  await pg.evaluate(gid => { planWahl = gid; planNeu(); }, stGid); await bild('7-teilabriss');
  await pg.evaluate(gid => { const st = gebaeude().find(x => x.gid === gid), t = gebKinder(st).find(x => x.abriss); abrissFertig(t); }, stGid);
  // Ausbauen: Reitplatz wird größer → Vorschau, dann Umbau-Fenster
  r = await pg.evaluate(() => { const rp = gebaeude().find(x => x.typ === 'reitplatz'); rp.zustand = 100; const s1 = planAusbauStart(rp); return { s1, mass: planVorschau && planVorschau.mass }; });
  ok('Reitplatz ausbauen: Vorschau 60 × 20 m', r.s1 && r.mass && r.mass.join('x') === '12x4', JSON.stringify(r));
  r = await pg.evaluate(() => { const v = planVorschau, P = hofPlan(), it = planItems().find(x => x.id === v.id); if (planKonflikt(v.id, planRechteck(it, P.pos[v.id]))) { const z = planFreiePos(it.l, it.t, v.id); if (z) P.pos[v.id] = z; } planNeu(); return !!document.querySelector('[data-pvok]:not([disabled])'); });
  ok('… nach Platz schaffen grün', r);
  await pg.locator('[data-pvok]').click(); await pg.waitForTimeout(200);
  ok('… Weiter öffnet das Umbau-Fenster', await pg.evaluate(() => !document.getElementById('dlg').hidden && /Stufe 2/.test(document.getElementById('dlg').innerText)));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  // --- H3: Box → Ort zeigt den Plan ---
  await pg.evaluate(() => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Lotte' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[0].pferd = P; spiel.boxen[0].krippeVoll = true;
    gebaeude().forEach(g => { if (g.bau && g.bau.art === 'neu') delete g.bau; }); spiel.anlage.roundpen = true;
    document.getElementById('nebenSchirm').classList.remove('offen'); aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeTag(); });
  await pg.waitForTimeout(200);
  await pg.evaluate(() => { spiel.hofFenster = []; document.getElementById('dlg').hidden = true; aktenReiter = 'platz'; aktenModus = 'pflege'; ortModus = null; zeigeAkte(); });
  await pg.waitForTimeout(200);
  r = await pg.evaluate(() => ({ svg: !!document.querySelector('#planOrtSvg'), park: !!document.querySelector('#planOrtSvg [data-ort="anhaenger"]'), rp: !!document.querySelector('#planOrtSvg [data-ort="tr-reitplatz"]'), kachelAnh: [...document.querySelectorAll('.kachel[data-ort="anhaenger"]')].length }));
  ok('Ort zeigt den Hofplan mit Parkplatz (Anhänger) und Reitplatz (Training)', r.svg && r.park && r.rp && r.kachelAnh === 0, JSON.stringify(r));
  await pg.locator('#planOrtSvg').scrollIntoViewIfNeeded(); await bild('8-ort-plan');
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.locator('#planOrtSvg [data-ort="tr-reitplatz"]').click(); await pg.waitForTimeout(200);
  ok('Reitplatz antippen → Training dort', await pg.evaluate(() => ortModus === 'tr-reitplatz'));
  await pg.evaluate(() => { ortModus = null; zeigeAkte(); }); await pg.waitForTimeout(150);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.locator('#planOrtSvg [data-ort="anhaenger"]').click(); await pg.waitForTimeout(200);
  ok('Parkplatz antippen → Pferdeanhänger', await pg.evaluate(() => ortModus === 'anhaenger'));
  await pg.evaluate(() => { ortModus = null; zeigeAkte(); }); await pg.waitForTimeout(150);
  if (await pg.locator('.plan-weiden [data-ort="weide"]').count()) { await pg.locator('.plan-weiden [data-ort="weide"]').first().click(); await pg.waitForTimeout(200);
    ok('Weide unter dem Plan antippen → Weide wählen/Pferd raus', await pg.evaluate(() => !!spiel.boxen[0].pferd.weide || !document.getElementById('dlg').hidden)); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); }
  // --- H4: Bauland kaufen, verkaufen, verschieben ---
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; hofBereich = 'plan'; planWahl = null; planLand = null; zeigeHof('hof'); }); await pg.waitForTimeout(200);
  await pg.locator('[data-plkauf]').click(); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => planStueckKandidaten(-1).map(k => k.seite).join(','));
  ok('Bauland kaufen zeigt Stellen rechts, links, unten', /rechts/.test(r) && /links/.test(r) && /unten/.test(r), r);
  await bild('9-bauland-kauf');
  const ha0 = await pg.evaluate(() => bauHa());
  const kj = await pg.evaluate(() => planStueckKandidaten(-1).findIndex(k => k.seite === 'unten'));
  await pg.locator(`[data-pkand="${kj}"]`).click(); await pg.waitForTimeout(150);
  await pg.locator('#dlgKnoepfe button:first-child').click(); await pg.waitForTimeout(150);
  r = await pg.evaluate(() => ({ ha: bauHa(), st: hofPlan().st.length, bb: planBox(hofPlan()) }));
  ok('0,5 ha unten gekauft: 20 × 20 Kacheln', Math.abs(r.ha - ha0 - 0.5) < 1e-6 && r.st === 2 && r.bb.h === 20, JSON.stringify(r));
  // noch zwei Stücke rechts → 40 × 20: Rennbahn passt
  r = await pg.evaluate(() => { const kauf = seite => { const k = planStueckKandidaten(-1).find(x => x.seite === seite && !hofPlan().st.some(t => t.x === x.x && t.y === x.y)); if (!k) return false; hofPlan().st.push({ x: k.x, y: k.y, b: k.b, h: k.h }); spiel.hof.bauHa += 0.5; spiel.hof.ha += 0.5; return true; };
    kauf('rechts'); kauf('rechts'); const bb = planBox(hofPlan()), alle = hofPlan().st.length; const geht = !bauSperre('rennbahn') || /einmal|schon/.test(bauSperre('rennbahn')); return { bb, alle, geht, sp: bauSperre('rennbahn') }; });
  ok('Mit 2 ha in 40 × 20 Kacheln passt die Rennbahn (200 × 100 m) – nur Platz, kein freier Raum nötig', r.bb.b === 40 && r.bb.h === 20 || /kein Platz/.test(r.sp), JSON.stringify(r));
  // leeres Stück antippen → verkaufen
  r = await pg.evaluate(() => { const P = hofPlan(), i = P.st.findIndex((t, j) => planStueckFrei(P, j) && planZusammen(P.st.filter((x, k) => k !== j))); planLand = { modus: 'stueck', i }; planNeu(); return i; });
  ok('Unbebautes Stück gefunden', r >= 0);
  if (r >= 0) {
    const n0 = await pg.evaluate(() => hofPlan().st.length), g0 = await pg.evaluate(() => spiel.geld);
    await pg.locator('[data-plverk]').click(); await pg.waitForTimeout(150); await pg.locator('#dlgKnoepfe button:first-child').click(); await pg.waitForTimeout(150);
    r = await pg.evaluate(() => ({ n: hofPlan().st.length, geld: spiel.geld }));
    ok('Stück verkauft: ein Stück weniger, 90 % zurück (1.350 €)', r.n === n0 - 1 && r.geld - g0 === 1350, JSON.stringify(r));
  }
  r = await pg.evaluate(() => { const P = hofPlan(), i = P.st.findIndex((t, j) => !planStueckFrei(P, j)); planLand = { modus: 'stueck', i }; planNeu(); return !document.querySelector('[data-plverk]'); });
  ok('Bebautes Stück: kein Verkaufen', r);
  await pg.evaluate(() => { planLand = null; planNeu(); });
  // --- alter Spielstand: alles im Feld, Ort gesperrt ---
  r = await pg.evaluate(() => { delete spiel.hof.plan; delete spiel.hof.planNeu; spiel.hof.bauHa = 1; const P = hofPlan(); return { alt: P.alt, offen: planOffen().length, sperre: planOrtSperre().length, b: planBox(P).b, h: planBox(P).h }; });
  ok('Alter Spielstand: Raster aus seinem Bauland (1 ha ≈ 29 × 14), alles im Feld', r.alt === 1 && r.offen >= 3 && r.b * r.h >= 400, JSON.stringify(r));
  r = true;
  if (r) {
    await pg.evaluate(() => { document.getElementById('nebenSchirm').classList.remove('offen'); const P = spiel.boxen[0].pferd; delete P.weide; aktBox = 0; aktenReiter = 'platz'; ortModus = null; zeigeAkte(); });
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
