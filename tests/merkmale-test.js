// Merkmale-Test (v587, PLAN-MERKMALE.md M1; wird in M2–M5 erweitert): Exterieur-Werte p.bau – Zuchtziel, Verteilung, Vererbung, Ist-Werte, Bild, Admin-Anzeige
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/merkmale-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false; spiel.geld = 1e6; spiel.stufenAn = false;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); bauErgaenzen(p); return p; };
    const nah = (a, b, e = 0.001) => Math.abs(a - b) < e;
    // --- 1. Zuchtziel ---
    ok('Zwölf Merkmale', BAU_KEYS.length === 12 && BAU_S === 15);
    const Zr = id => bauZielRasse(id);
    ok('Warmblut (Hannoveraner): 55/60/58/65/55/55/55/55/55/50, Stellung 50', ['rahmen', 'halsL', 'halsA', 'schulter', 'ruecken', 'kruppe', 'muskel', 'fundament', 'fessel', 'huf'].map(k => Zr('hannoveraner')[k]).join() === '55,60,58,65,55,55,55,55,55,50' && Zr('hannoveraner').stV === 50 && Zr('hannoveraner').stH === 50);
    ok('Edel: Vollblut halsA 50, halsL 58, fundament 45 · Araber Rücken 38 · Marwari wie Edel', Zr('vollblut').halsA === 50 && Zr('vollblut').halsL === 58 && Zr('vollblut').fundament === 45 && Zr('araber').ruecken === 38 && Zr('araber').rahmen === 62 && Zr('marwari').kruppe === 62);
    ok('Barock: Friese fundament 58/fessel 60 · Andalusier/Lipizzaner Muskel 60 · Barock Pinto Gruppenwert', Zr('friese').fundament === 58 && Zr('friese').fessel === 60 && Zr('andalusier').muskel === 60 && Zr('lipizzaner').muskel === 60 && Zr('barockpinto').muskel === 58);
    ok('Western: Quarter Kruppe 42 · Paint 45', Zr('quarter').kruppe === 42 && Zr('paint').kruppe === 45 && Zr('quarter').muskel === 72);
    ok('Kaltblut/Cob: Tinker/Fell/Dales Fundament 66 · Fjord Hals 38 · Haflinger Cob 62 · Noriker Kaltblut 72', Zr('tinker').fundament === 66 && Zr('fell').fundament === 66 && Zr('dales').fundament === 66 && Zr('fjord').halsL === 38 && Zr('haflinger').fundament === 62 && Zr('noriker').fundament === 72);
    ok('Isländer und Kleinpony', Zr('isi').rahmen === 42 && Zr('isi').huf === 55 && Zr('shetty').fessel === 45 && Zr('shetty').rahmen === 38);
    ok('Alle Rassen haben eine Gruppe', RASSEN.every(r => BAU_GRUPPE[r.id]), RASSEN.filter(r => !BAU_GRUPPE[r.id]).map(r => r.id).join());
    const misch = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Misch' }); misch.anteile = { hannoveraner: 50, araber: 50 };
    ok('Mischling: Mitte als gewichteter Schnitt (Hannoveraner/Araber 50/50: Rahmen 58,5)', nah(bauZiel(misch).rahmen, (55 + 62) / 2) && nah(bauZiel(misch).ruecken, (55 + 38) / 2));
    // --- 2. Auswürfeln, stabil, Verteilung ---
    const p1 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'A', id: 'test-stabil' }); delete p1.bau; const b1 = JSON.stringify(bauErgaenzen(p1)); const p2 = { ...p1, bau: undefined }; delete p2.bau;
    ok('Fest und stabil: gleiche Pferde-ID ergibt gleiche Werte', JSON.stringify(bauErgaenzen(p2)) === b1 && BAU_KEYS.every(k => p1.bau[k] >= 0 && p1.bau[k] <= 100 && Number.isInteger(p1.bau[k])));
    const alt = neu({ rasse: 'friese', geschlecht: 'Stute', alter: 8, name: 'Alt' }); delete alt.bau; const kO = kopfOpt(alt);
    ok('Altes Pferd ohne p.bau: wird beim Zeichnen/Anzeigen aufgefüllt (kopfOpt liefert bau)', !!alt.bau && kO.bau && Object.keys(kO.bau).length === 6);
    const verteil = id => { let n = 0, deut = 0, stark = 0, ideal = 0; for (let i = 0; i < 600; i++) { const p = { id: 'v-' + id + i, rasse: id, name: 'x', anteile: { [id]: 100 } }; bauErgaenzen(p); const Z = bauZiel(p); BAU_KEYS.forEach(k => { const d = Math.abs(p.bau[k] - Z[k]) / BAU_S; n++; if (d < 0.7) ideal++; if (d >= 1.75) deut++; if (d >= 2.33) stark++; }); } return { ideal: ideal / n, deut: deut / n, stark: stark / n }; };
    ['hannoveraner', 'araber', 'tinker', 'quarter', 'shetty'].forEach(id => { const v = verteil(id); ok(`Verteilung ${id}: ideal (d < 0,7) ≈ 51 %, ab deutlich (d ≥ 1,75) ≈ 8 % (6 % + 2 %), stark ≈ 2 %`, nah(v.ideal, 0.51, 0.05) && nah(v.deut, 0.08, 0.02) && nah(v.stark, 0.02, 0.012), `ideal ${(v.ideal * 100).toFixed(1)} · ab deutlich ${(v.deut * 100).toFixed(1)} · stark ${(v.stark * 100).toFixed(1)}`); });
    // --- 3. Vererbung ---
    const M = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Mutter' }), V = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Vater' });
    BAU_KEYS.forEach(k => { M.bau[k] = 30; V.bau[k] = 70; });
    let muts = 0, n = 0, abw = 0, sumD = 0; const F = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Fohlen' });
    for (let i = 0; i < 1500; i++) { const f = { id: 'ff' + i, name: 'F', rasse: 'hannoveraner', anteile: { hannoveraner: 100 } }, her = bauErben(M, V, f); BAU_KEYS.forEach(k => { n++; if (her[k].quelle === 'Mutation') muts++; else { const erw = 50 + 0.2 * (Zr('hannoveraner')[k] - 50); abw += Math.abs(f.bau[k] - erw); sumD++; } }); }
    ok('Mutation bei etwa 3 % der Merkmale', nah(muts / n, 0.03, 0.006), (muts / n * 100).toFixed(2) + ' %');
    ok('Ohne Mutation: Kind liegt um die Eltern-Mitte (+ 0,2 × Zuchtziel-Zug), mittlere Abweichung ≈ 0,6 σ-Normal (≈ 7,2)', nah(abw / sumD, 0.6 * BAU_S * 0.8, 1.8), (abw / sumD).toFixed(2));
    const fx = { id: 'fx', name: 'F', rasse: 'hannoveraner', anteile: { hannoveraner: 100 } }, hx = bauErben(M, V, fx);
    ok('Herkunft je Merkmal: wert, quelle, von', BAU_KEYS.every(k => hx[k].wert === fx.bau[k] && (hx[k].quelle === 'Schnitt der Eltern' && /Mutter/.test(hx[k].von) || hx[k].quelle === 'Mutation')));
    ok('Werte bleiben 0–100 und ganzzahlig', (() => { for (let i = 0; i < 500; i++) { const f = { id: 'fy' + i, name: 'F', rasse: 'hannoveraner', anteile: { hannoveraner: 100 } }; M.bau.rahmen = 2; V.bau.rahmen = 98; bauErben(M, V, f); if (!BAU_KEYS.every(k => f.bau[k] >= 0 && f.bau[k] <= 100 && Number.isInteger(f.bau[k]))) return false; } return true; })());
    // geburt() im Spiel: Fohlen erbt, Herkunft liegt in herkunft.bau
    try { const box = spiel.boxen[0]; const st = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Stute1' }), he = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Hengst1' }); BAU_KEYS.forEach(k => { st.bau[k] = 20; he.bau[k] = 80; });
      box.pferd = st; st.traechtig = { vater: he, seit: spiel.tag - 4, geburt: spiel.tag, art: 'natur', sicher: true }; const f = geburt(box, he);
      ok('geburt(): Fohlen hat p.bau und herkunft.bau, Werte aus der Elternmitte (20/80 → 50, Mutationen ausgenommen)', !!f.bau && !!f.herkunft.bau && BAU_KEYS.every(k => f.herkunft.bau[k].wert === f.bau[k]) && BAU_KEYS.filter(k => f.herkunft.bau[k].quelle !== 'Mutation').every(k => Math.abs(f.bau[k] - (50 + 0.2 * (bauZielRasse(f.rasse)[k] - 50))) < 40), BAU_KEYS.map(k => f.bau[k]).join('/'));
      const kopie = hengstKopie(he); ok('Hengst-Kopie (Deckstation, Archiv) trägt p.bau', !!kopie.bau && kopie.bau.rahmen === 80);
    } catch (er) { ok('geburt()', false, er.message); }
    // --- 4. Ist-Werte ---
    const E = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Ist' }); E.bau.muskel = 60; E.werte.anlage.kraft = 80; E.werte.ist.kraft = 80; E.fz = 5; delete E.boxenruhe; E.befunde = [];
    ok('Bemuskelung Ist = Anlage bei Kraft-Ist = Anlage, Futterzustand ≥ 4', muskelIst(E) === 60);
    E.werte.ist.kraft = 60; ok('Kraft −20 → −8', nah(muskelIst(E), 52, 0.06), String(muskelIst(E)));
    E.werte.ist.kraft = 80; E.fz = 2; ok('Futterzustand 2 (unter 4): −3 × 2 = −6', nah(muskelIst(E), 54, 0.06), String(muskelIst(E))); E.fz = 5;
    E.boxenruhe = true; ok('Boxenruhe −5', nah(muskelIst(E), 55, 0.06)); E.boxenruhe = false;
    E.befunde = [{ art: 'lahmheit', grad: 1, seit: spiel.tag - 3 * tpj() }]; ok('Lange Krankheit −5', nah(muskelIst(E), 55, 0.06)); E.befunde = [{ art: 'husten', grad: 1, seit: spiel.tag }]; ok('Frische Krankheit: kein Abzug', muskelIst(E) === 60); E.befunde = [];
    const op = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Alter' }); op.bau.muskel = 60; op.werte.ist.kraft = op.werte.anlage.kraft; op.fz = 5; op.alter = 25; delete op.geb; ok('Alter ab 15: −1 je Jahr, höchstens −10', nah(muskelIst(op), 50, 0.06), String(muskelIst(op)));
    const fo = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 1, name: 'Jung' }); fo.bau.muskel = 60; fo.fz = 2; ok('Fohlen/Jährling: zeigt die Anlage (keine Abzüge)', muskelIst(fo) === 60 && hufIst(fo) === fo.bau.huf && bauWaechst(fo));
    const H = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Huf' }); H.bau.huf = 80; const hz = bauZiel(H).huf;   // Ziel 50, Abweichung +30
    H.pflege.huf = spiel.tag; H.ausgekratzt = spiel.tag; ok('Huf: gute Pflege ×0,7 (50 + 30 × 0,7 = 71)', nah(hufIst(H), hz + 30 * 0.7, 0.06), String(hufIst(H)));
    H.pflege.huf = spiel.tag - 10 * tpj(); H.ausgekratzt = spiel.tag; ok('Huf: Hufschmied-Termin lange überfällig ×1,5 (95)', nah(hufIst(H), Math.min(100, hz + 30 * 1.5), 0.06), String(hufIst(H)));
    H.pflege.huf = spiel.tag; H.ausgekratzt = spiel.tag - 3 * tpj(); ok('Huf: zwei Jahreszeiten nicht ausgekratzt ×1,5', nah(hufIst(H), Math.min(100, hz + 30 * 1.5), 0.06));
    H.pflege.huf = spiel.tag - Math.round(1.2 * hufIntervall(H)); H.ausgekratzt = spiel.tag; ok('Huf: dazwischen ×1,0 (80)', nah(hufIst(H), 80, 0.06), String(hufIst(H)));
    // --- 5. Pferdebild ---
    const bo = bauOpt(E); ok('bauOpt: sechs Abweichungen in σ', Object.keys(bo).sort().join() === 'fundament,halsA,halsL,kruppe,muskel,rahmen' && Object.values(bo).every(x => typeof x === 'number'));
    const k0 = { len: 1, depth: .5, neck: .5, nAng: 50, legT: .09, hq: 1, crest: .06, croup: .5 };
    const kx = bauK(k0, { rahmen: 9, halsL: -9, halsA: 9, kruppe: 9, fundament: -9, muskel: 9 }), ky = bauK(k0, { rahmen: -9, halsL: 9, halsA: -9, kruppe: -9, fundament: 9, muskel: -9 });
    ok('Bild: höchstens ±15 % vom Rassenwert (ab ±3 σ)', nah(kx.len, 1.15, 0.001) && nah(ky.len, 0.85, 0.001) && nah(kx.neck, 0.425, 0.001) && nah(ky.neck, 0.575, 0.001) && nah(kx.nAng, 57.5, 0.01) && nah(kx.legT, 0.0765, 0.0001) && nah(kx.hq, 1.15, 0.001) && nah(kx.depth, .5 * 1.075, 0.001), JSON.stringify(kx));
    ok('Bild: Kruppe waagerecht → weniger Neigung, abfallend → mehr (höchstens ±15 % von max(0,4; Wert))', kx.croup < k0.croup && ky.croup > k0.croup && Math.abs(kx.croup - k0.croup) <= 0.15 * 0.5 + 1e-9);
    ok('Bild: ohne bau oder mit 0 ändert sich nichts', bauK(k0, undefined) === k0 && JSON.stringify(bauK(k0, { rahmen: 0, halsL: 0, halsA: 0, kruppe: 0, fundament: 0, muskel: 0 })) === JSON.stringify(k0));
    const nm = s => s.replace(/p\d+/g, 'p'), svgA0 = zeichnePferd('hannoveraner', 'rappe', { seed: 's', statisch: 1 }).svg, svgB0 = zeichnePferd('hannoveraner', 'rappe', { seed: 's', statisch: 1, bau: { rahmen: 3, halsL: -3, halsA: 3, kruppe: 3, fundament: 3, muskel: 3 } }).svg, svgC0 = zeichnePferd('hannoveraner', 'rappe', { seed: 's', statisch: 1, bau: { rahmen: 0, halsL: 0, halsA: 0, kruppe: 0, fundament: 0, muskel: 0 } }).svg, svgA = nm(svgA0), svgB = nm(svgB0), svgC = nm(svgC0);
    ok('Bild: Extremwerte ändern die Zeichnung, Null nicht', svgA !== svgB && svgA === svgC);
    const fA = zeichnePferd('hannoveraner', 'rappe', { seed: 's', statisch: 1, alterStufe: 'fohlen' }).svg, fB = zeichnePferd('hannoveraner', 'rappe', { seed: 's', statisch: 1, alterStufe: 'fohlen', bau: { rahmen: 3 } }).svg;
    ok('Bild: Fohlen behalten ihre Fohlen-Proportionen (Faktor wirkt auf den Fohlenwert, nicht auf den Erwachsenen)', fA !== fB && bauK({ len: 0.84, depth: .4 }, { rahmen: 3 }).len < 0.84 * 1.16);
    // --- 6. Admin-Aufschlüsselung ---
    const geb = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 3, name: 'Kind' }); geb.herkunft = { bau: bauErben(M, V, { ...geb, id: geb.id }) }; aufschlTeil = 'exterieur'; spiel.admin = true;
    const h = aufschluesselungHTML(geb);
    ok('Aufschlüsselung „Größe & Exterieur“ zeigt alle zwölf Werte mit Ziel und Herkunft', BAU_KEYS.every(k => h.includes(BAU_NAME[k])) && /Ziel/.test(h) && /Schnitt der Eltern|Mutation/.test(h) && /heute/.test(h));
    const stamm = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Stamm' }); delete stamm.herkunft; ok('Stammpferd: „angeboren (Stammpferd)“', /angeboren \(Stammpferd\)/.test(aufschluesselungHTML(stamm)));
    const mp = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 3, name: 'Mut' }); mp.herkunft = { bau: { rahmen: { wert: 90, quelle: 'Mutation', von: '–' } } }; aufschlTeil = 'mutation'; ok('Mutationen listen Exterieur-Mutationen', /Exterieur: Rahmen/.test(aufschluesselungHTML(mp)));
    aufschlTeil = null; spiel.admin = false;
    return out;
  });
  const html = require('fs').readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8'), ras = (html.match(/\.\.\.kopfOpt\(wahl\), bau: undefined/g) || []).length, alle = (html.match(/kopfOpt\(wahl\)/g) || []).length;
  R.push((ras === alle && alle >= 2 ? '✓ ' : '✗ ') + 'Rassenansicht/Gene selbst wählen: kopfOpt(wahl) immer mit bau: undefined (ohne Exterieur) – ' + ras + ' von ' + alle);
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
