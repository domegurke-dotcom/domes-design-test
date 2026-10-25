// Aufzucht-Offenstall mit Ausbau (PLAN-OFFENSTALL.md, Dome 24.10., gebaut 25.10.): Plätze 10/25/50, Preise, Grundriss, Gruppen 1/2/4, Umzug bei Alter, Gruppe voll,
// Versorgung je Gruppe, Mitarbeiter je Gruppe. Start: NODE_PATH=/opt/node22/lib/node_modules node tests/offenstall-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false; spiel.admin = false;
    const H = spiel.hof; H.art = 'zucht'; spiel.stallarten = ['zucht']; delete H.artCache; spiel.geld = 300000; H.bauHa = (H.bauHa || 0) + 3;
    window.mkP = (name, g, jahre) => { const p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: g, alter: Math.max(1, Math.ceil(jahre)), name }); p.geb = gebGenau(jahre); p.pflege = erzeugePflege(p); werteErgaenzen(p); return p; };
    window.rein = p => { const z = offenPlatz(p); if (z < 0) return -1; spiel.boxen[z].pferd = p; return z; }; });
  // Stufe 1
  let z = await pg.evaluate(() => { bauStarten('aufzucht', 1); planAutoSetzen(); const g = gebaeude().find(x => x.typ === 'aufzucht'); g.bau.rest = 0; bauFertig(g, 'neu'); delete g.bau; window.gA = g;
    return { n: offenBoxen().length, G: offenG(), preise: [1, 2, 3].map(s => bauPreis('aufzucht', s)), mass: [1, 2, 3].map(s => planMassTyp('aufzucht', 0, s).join('x')), platz: [1, 2, 3].map(s => platzVon('aufzucht', 0, s)) }; });
  ok('Stufe 1: 10 Plätze in einer Gruppe', z.n === 10 && z.G === 1, z);
  ok('Preise 15.000 / 40.000 / 90.000 €', z.preise.join() === '15000,40000,90000', z.preise);
  ok('Grundriss 8×4 / 10×8 / 16×10 Kacheln, Bauland 0,08 / 0,2 / 0,4 ha (+30 % Wege)', z.mass.join() === '8x4,10x8,16x10' && z.platz.join() === '0.104,0.26,0.52', z);
  z = await pg.evaluate(() => { const jh = mkP('Hengstchen', 'Hengst', 2), st = mkP('Stütchen', 'Stute', 1.5); rein(jh); const sp = offenSperre(st, null); window.jh = jh; window.st = st; return sp; });
  ok('Stufe 1 (eine Herde): Stute nicht zu einem Junghengst', /Junghengst/.test(z), z);
  // Umbau auf Stufe 2
  z = await pg.evaluate(() => { bauFertig(gA, 'umbau'); return { n: offenBoxen().length, G: offenG(), og: offenBoxen().map(b => b.og), jhG: (offenBoxen().find(b => b.pferd === jh) || {}).og, namen: [0, 1].map(k => offenGruppenName(k)) }; });
  ok('Umbau auf Stufe 2: 25 Plätze, 2 Gruppen', z.n === 25 && z.G === 2 && new Set(z.og).size === 2, z);
  ok('Junghengst zieht in die Gruppe „Junghengste“', z.jhG === 1 && z.namen[1] === 'Junghengste', z);
  z = await pg.evaluate(() => { const sp = offenSperre(st, null), zz = rein(st); return { sp, og: zz >= 0 ? spiel.boxen[zz].og : null }; });
  ok('Stufe 2: Stute darf hinein (andere Gruppe als der Junghengst), Platz in „Stuten und Wallache“', !z.sp && z.og === 0, z);
  // Umbau auf Stufe 3
  ok('Fertig-Fenster nennt Plätze und Gruppen', await pg.evaluate(() => { spiel.hofFenster = []; bauFertig(gA, 'umbau'); return (spiel.hofFenster || []).some(h => /50 Plätze in 4 Gruppen/.test(h)); }));
  z = await pg.evaluate(() => {
    const P = { abs: mkP('Absetzer', 'Stute', 0.6), jw: mkP('Jährling', 'Wallach', 1.2), hf: mkP('Hengstfohlen', 'Hengst', 1.2), tante: mkP('Tante', 'Stute', 10), onkel: mkP('Onkel', 'Wallach', 10), alt: mkP('Zweijährige', 'Stute', 2.5) };
    Object.values(P).forEach(rein); window.P3 = P;
    const og = q => (offenBoxen().find(b => b.pferd === q) || {}).og;
    return { n: offenBoxen().length, G: offenG(), g: Object.fromEntries(Object.entries(P).map(([k, q]) => [k, og(q)])), jh: og(jh), st: og(st), groesse: [0, 1, 2, 3].map(k => offenGruppeBoxen(k).length) }; });
  ok('Umbau auf Stufe 3: 50 Plätze, 4 Gruppen (je 12–13)', z.n === 50 && z.G === 4 && z.groesse.every(x => x >= 12 && x <= 13), z);
  ok('Gruppen: Absetzer 0 · Jährlinge (auch Hengst unter 1½ J.) 1 · Junghengst + Onkel 2 · ältere Stuten und Tante 3', z.g.abs === 0 && z.g.jw === 1 && z.g.hf === 1 && z.jh === 2 && z.g.onkel === 2 && z.g.tante === 3 && z.g.alt === 3 && z.st === 1, z);
  // Gruppe voll
  z = await pg.evaluate(() => { let n = 0; while (offenPlatz(P3.abs) >= 0 && n < 20) { rein(mkP('Abs' + n, n % 2 ? 'Stute' : 'Hengst', 0.6)); n++; } const neu = mkP('Spätzle', 'Stute', 0.6); return { sp: offenSperre(neu, null), anderer: offenPlatz(mkP('Ältere', 'Stute', 2.5)) >= 0 }; });
  ok('Gruppe „Absetzer“ voll: Sperre nennt die Gruppe, andere Gruppen haben noch Platz', /Absetzer.*voll/.test(z.sp) && z.anderer, z);
  // Älter werden → neue Gruppe
  z = await pg.evaluate(() => { const q = P3.hf; q.geb = gebGenau(1.6); const vor = (offenBoxen().find(b => b.pferd === q) || {}).og; const nPost = (spiel.post || []).length; offenstallJahreszeit();
    return { vor, nach: (offenBoxen().find(b => b.pferd === q) || {}).og, brief: (spiel.post || []).slice(0, (spiel.post || []).length - nPost).some(x => /neue Gruppen/.test(x.betreff || '')) }; });
  ok('Älter geworden (Hengst ab 1½ J.): zieht zu Beginn der Jahreszeit zu den Junghengsten, Sammelbrief', z.vor === 1 && z.nach === 2 && z.brief, z);
  // Versorgung je Gruppe
  z = await pg.evaluate(() => { offenBoxen().forEach(b => { if (b.pferd) { b.mistig = true; b.krippeVoll = false; } }); futterkammer().lager.heu = 2000;
    const bx = offenBoxen().find(b => b.pferd === P3.tante); aktBox = spiel.boxen.indexOf(bx); spiel.aktBox = aktBox; const html = offenGruppeHTML(P3.tante, bx);
    offenGruppeVersorgen('mist'); offenGruppeVersorgen('heu'); const G3 = offenGruppeBoxen(3).filter(b => b.pferd), G0 = offenGruppeBoxen(0).filter(b => b.pferd);
    return { karte: /Ältere Stuten und Wallache/.test(html) && /data-og="heu"/.test(html), g3: G3.every(b => !b.mistig && b.krippeVoll), g0: G0.every(b => b.mistig && !b.krippeVoll), n3: G3.length }; });
  ok('Karte „Offenstall · Gruppe …“ mit Knöpfen in Versorgung · Heute', z.karte, z);
  ok('Heu und Misten für die ganze Gruppe auf einmal – andere Gruppen bleiben', z.g3 && z.g0 && z.n3 >= 2, z);
  // Mitarbeiter: Arbeit je Gruppe
  z = await pg.evaluate(() => { spiel.mitarbeiter = [{ id: 'sb1', typ: 'stallbursche', name: 'Sb', w: false, wissen: wissenStart(30, {}), eig: [], gehalt: 300, ab: jzJetzt() - 1, bis: null }].map(maErgaenzen);
    const Z = maZuteilung('stall'), o = Z.filter(x => spiel.boxen[x.i].offen), proG = {}; o.forEach(x => { const k = spiel.boxen[x.i].og; (proG[k] = proG[k] || new Set()).add(x.m.id); });
    const belegt = [0, 1, 2, 3].map(k => offenGruppeBoxen(k).filter(b => b.pferd).length), versorgt = [0, 1, 2, 3].map(k => o.filter(x => spiel.boxen[x.i].og === k).length);
    const aufw = [0, 1, 2, 3].filter(k => versorgt[k] > 0).reduce((x, k) => x + Math.max(1, Math.ceil(belegt[k] / 5)), 0);
    return { belegt, versorgt, aufw, einer: Object.values(proG).every(s => s.size === 1) }; });
  ok('Stallbursche (3 Boxen): je angefangene 5 Pferde einer Gruppe = 1 Box, keine Gruppe halb, jede Gruppe macht derselbe', z.einer && z.versorgt.every((n, k) => n === 0 || n === z.belegt[k]) && z.aufw <= 3 + 0.01 && z.aufw >= 1, z);
  // Anzeige in der Box (Fenster-Modus aus, alte Ansicht)
  await pg.evaluate(() => { spiel.hofFenster = []; document.getElementById('dlg').hidden = true; zeigeSchirm(null); aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeStall(); zeigeTag(); zeigeAkte(); }); await pg.waitForTimeout(400);
  ok('Box eines Offenstall-Pferdes zeigt die Gruppen-Karte', await pg.evaluate(() => !!document.querySelector('#info .og-karte')));
  if (ORD) { await pg.evaluate(() => document.querySelector('#info .og-karte').scrollIntoView({ block: 'center' })); await pg.screenshot({ path: `${ORD}/offenstall-${W}x${H}.png` }); }
  ok('bzn-Absatz und Hinweis vorhanden', await pg.evaluate(() => /Aufzucht-Offenstall mit Ausbau \(v827/.test(weitereDatenHTML()) && !!HINWEISE.offenGruppe));
  ok('keine Skriptfehler', !errs.length, errs);
  console.log(`Offenstall ${W}x${H}`); out.forEach(x => console.log(x)); const f = out.filter(x => x.startsWith('✗')).length; console.log(f ? `${f} ✗` : `alle ${out.length} ✓`);
  await b.close(); process.exit(f ? 1 : 0); })();
