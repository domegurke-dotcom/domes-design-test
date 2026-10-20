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
  // ==================== M2: Karte „Merkmale“ (eigene Seite mit echter Akte) ====================
  const pg2 = await b.newPage({ viewport: { width: 390, height: 844 } }); pg2.on('pageerror', e => errs.push(e.message));
  await pg2.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg2.waitForTimeout(700);
  await pg2.click('#smNeu'); await pg2.waitForTimeout(150); await pg2.fill('#chName', 'Test'); await pg2.click('#chLos'); await pg2.waitForTimeout(150);
  await pg2.click('#dlgKnoepfe button'); await pg2.click('[data-immo="pension"]'); await pg2.fill('#kaufName', 'Testhof'); await pg2.click('#dlgKnoepfe button:first-child'); await pg2.waitForTimeout(400);
  const R2 = await pg2.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; spiel.tippsAus = true;
    const neu = (n, f) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: n }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); bauErgaenzen(p); const Z = bauZiel(p); BAU_KEYS.forEach(k => { p.bau[k] = Math.round(Z[k]); }); p.werte.ist.kraft = p.werte.anlage.kraft; p.fz = 5; if (f) f(p.bau); return p; };
    const A = neu('Anna', b => { b.schulter = 25; b.halsL = 90; }), Bq = neu('Berta');
    spiel.boxen[0].pferd = A; spiel.boxen[1].pferd = Bq; aktBox = 0; spiel.aktBox = 0; delete spiel.merkOffen;
    const stufe = s => { spiel.stufenAn = true; spiel.spieler.stufe = s; };
    const zeig = r => { aktenModus = 'steckbrief'; aktenReiter = r; zeigeSchirm(null); zeigeStall(); zeigeAkte(); return document.getElementById('info'); };
    stufe('exp'); let I = zeig('steckbrief');
    const tabs = [...I.querySelectorAll('.reiter button')].map(x => x.dataset.r).join();
    ok('Reiter: Daten, Genetik, Merkmale, Ausbildung (Gangwerk/Eigenschaften/Charakter weg)', tabs === 'steckbrief,genetik,merkmale,ausbildung', tabs);
    const daten = I.querySelector('.karte').textContent;
    ok('Daten ohne Stockmaß, Kopf, Abzeichen, Beine, Augen, Gewicht', !/Stockmaß|Abzeichen|Augen|Gewicht/.test(daten) && /Rasse/.test(daten) && /Marktwert/.test(daten));
    I = zeig('merkmale'); const offen = [...I.querySelectorAll('[data-merk]')].filter(d => d.open).map(d => d.dataset.merk).join(), alle = [...I.querySelectorAll('[data-merk]')].map(d => d.dataset.merk).join();
    ok('Sieben Aufklapp-Bereiche, beim ersten Öffnen nur Gesamteindruck offen', alle === 'gesamt,exterieur,farbe,gang,interieur,rasse,besond' && offen === 'gesamt', alle + ' / offen ' + offen);
    ok('Ein „Vergleichen mit …“ oben', I.querySelectorAll('#vglKnopf').length === 1);
    const ex = I.querySelector('[data-merk="exterieur"]'); ex.open = true; ex.dispatchEvent(new Event('toggle'));
    ok('Offener Bereich wird gemerkt (spiel.merkOffen)', spiel.merkOffen.exterieur === true && zeig('merkmale').querySelector('[data-merk="exterieur"]').open);
    I = zeig('merkmale'); const t = I.querySelector('.karte').textContent;
    ok('Exterieur: Stockmaß, Kopf, Gewicht + 12 Merkmale (Hals als 2 Balken) mit Raute', /Stockmaß/.test(t) && /Kopf/.test(t) && I.querySelectorAll('[data-merk="exterieur"] .skala.merk').length === 12 && I.querySelectorAll('[data-merk="exterieur"] .raute').length === 12);
    ok('Farbe & Abzeichen: Abzeichen, Beine, Augen', /Abzeichen/.test(I.querySelector('[data-merk="farbe"]').textContent) && /Augen/.test(I.querySelector('[data-merk="farbe"]').textContent));
    ok('Gangwerk und Interieur (Charakter + Eigenschaften) als Abschnitte', /Schritt/.test(I.querySelector('[data-merk="gang"]').textContent) && /Charakter/.test(I.querySelector('[data-merk="interieur"]').textContent) && /Eigenschaften/.test(I.querySelector('[data-merk="interieur"]').textContent) && !!I.querySelector('#vorliebenKnopf'));
    ok('Experte: Noten-Tabelle (Typ, Körperbau, Bewegung, Interieur, Gesamt)', !!I.querySelector('.merk-noten') && /Körperbau/.test(I.querySelector('.merk-noten').textContent));
    ok('Fehler-Wörter: steile Schulter = starker Fehler, langer Hals = deutlicher Fehler', /sehr steil · starker Fehler/.test(t) && /sehr lang · deutlicher Fehler|lang · deutlicher Fehler/.test(t), (t.match(/Schulter \/ Widerrist[^S]*/) || [''])[0]);
    ok('Satz: Schwächen „zu steile Schulter“ und „zu langer Hals“', /Schwächen: zu steile Schulter und zu langer Hals\./.test(staerkenSatz(A)), staerkenSatz(A));
    ok('Satz ohne Schwächen (alles am Ziel)', /^Stärken: .*Keine auffälligen Schwächen\.$/.test(staerkenSatz(Bq)), staerkenSatz(Bq));
    stufe('fort'); I = zeig('merkmale'); ok('Fortgeschritten: Balken ja, Noten nein', I.querySelectorAll('.skala.merk').length === 12 && !I.querySelector('.merk-noten'));
    stufe('anf'); I = zeig('merkmale'); ok('Anfänger: keine Exterieur-Balken, Satz im Gesamteindruck, Vergleichen da', I.querySelectorAll('.skala.merk').length === 0 && /Stärken|Schwächen|durchschnittliches/.test(I.querySelector('[data-merk="gesamt"]').textContent) && !!I.querySelector('#vglKnopf'));
    stufe('exp'); vergleichId = Bq.id; I = zeig('merkmale'); ok('Vergleich: zweite Marke in jedem Exterieur-Balken und zweite Notenzeile', I.querySelectorAll('[data-merk="exterieur"] .skala.merk i.vgl').length === 12 && !!I.querySelector('.merk-noten .vgl-zeile')); vergleichId = null;
    spiel.admin = true; I = zeig('merkmale'); ok('Adminmodus: Zahlen (Wert, Ziel, d; Muskel/Huf mit Anlage und Ist)', /Ziel \d+ · d \d/.test(I.textContent) && /Anlage \d+ · Ist/.test(I.textContent)); spiel.admin = false;
    spiel.merkOffen = {}; I = zeig('gang'); ok('Alter Reiter „gang“ öffnet Merkmale mit Abschnitt Gangwerk', aktenReiter === 'merkmale' && I.querySelector('[data-merk="gang"]').open);
    spiel.merkOffen = {}; I = zeig('charakter'); ok('Alter Reiter „charakter“ öffnet Interieur', I.querySelector('[data-merk="interieur"]').open);
    // Noten
    const N = merkNoten(A);
    ok('Merkmalnote 9 − 2,5 × d (halbe Noten, 3 … 9,5): am Ziel 9, Schulter weit weg 3', N.merkmal.rahmen === 9 && N.merkmal.schulter === 3 && BAU_KEYS.every(k => N.merkmal[k] >= 3 && N.merkmal[k] <= 9.5 && N.merkmal[k] * 2 === Math.round(N.merkmal[k] * 2)));
    ok('Gesamt = 0,2 Typ + 0,3 Körperbau + 0,3 Bewegung + 0,2 Interieur', Math.abs(N.gesamt - Math.round((0.2 * N.typ + 0.3 * N.koerper + 0.3 * N.bewegung + 0.2 * N.interieur) * 10) / 10) < 1e-9 && N.typ === typNote(A));
    const st = []; for (let i = 0; i < 300; i++) { const x = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'S' + i, id: 'st' + i }); x.pflege = erzeugePflege(x); x.werte = x.werte || erzeugeWerte(x); werteErgaenzen(x); x.fz = 5; st.push(merkNoten(x)); }
    const m = k => st.reduce((a, x) => a + x[k], 0) / st.length;
    out.push(`ℹ️ Schnitt von 300 Hannoveranern: Körperbau ${m('koerper').toFixed(2)} · Typ ${m('typ').toFixed(2)} · Bewegung ${m('bewegung').toFixed(2)} · Interieur ${m('interieur').toFixed(2)} · Gesamt ${m('gesamt').toFixed(2)}`);
    ok('Körperbau-Schnitt in der Nähe von 7 (M3 stimmt fein ab)', Math.abs(m('koerper') - 7) < 0.6, m('koerper').toFixed(2));
    // ==================== M3: Wirkungen ====================
    const idealP = n => { const p = neu(n); const Z = bauZiel(p); BAU_KEYS.forEach(k => { p.bau[k] = Math.round(Z[k]); }); p.werte.ist.kraft = p.werte.anlage.kraft; p.fz = 5; p.pflege.huf = spiel.tag; p.ausgekratzt = spiel.tag; return p; };
    const setze = (p, k, d) => { p.bau[k] = Math.max(0, Math.min(100, Math.round(bauZiel(p)[k] + d * BAU_S))); };
    const I0 = idealP('Ideal'), w0 = marktwert(I0);
    ok('Marktwert ideal: nur Stärken (12 × 0,7 % → +8 %-Deckel)', Math.abs(bauWertFaktor(I0) - 1.08) < 1e-9, bauWertFaktor(I0).toFixed(3));
    const F1 = idealP('F1'); setze(F1, 'schulter', 2); ok('Ein deutlicher Fehler: −3 % statt einer Stärke (+0,7 %)', Math.abs(bauWertFaktor(F1) - (1 - 0.03 + 11 * 0.007)) < 1e-9, bauWertFaktor(F1).toFixed(4));
    const F2 = idealP('F2'); setze(F2, 'schulter', 3); ok('Ein starker Fehler: −6 %', Math.abs(bauWertFaktor(F2) - (1 - 0.06 + 11 * 0.007)) < 1e-9);
    const F3 = idealP('F3'); BAU_KEYS.forEach(k => setze(F3, k, 3)); ok('Alles starker Fehler: höchstens −25 %', Math.abs(bauWertFaktor(F3) - 0.75) < 1e-9);
    { const x = idealP('Mw'), a = marktwert(x); setze(x, 'schulter', 2); const b2 = marktwert(x); BAU_KEYS.forEach(k => setze(x, k, 3)); const c = marktwert(x); ok('Marktwert sinkt mit schlechterem Exterieur (gleiches Pferd)', c < b2 && b2 < a, c + ' < ' + b2 + ' < ' + a); }
    ok('Faktor immer zwischen 60 % und 125 %', (() => { for (let i = 0; i < 300; i++) { const x = { id: 'mw' + i, rasse: 'hannoveraner', name: 'x', anteile: { hannoveraner: 100 } }; bauErgaenzen(x); const f = bauWertFaktor(x); if (f < 0.6 || f > 1.25) return false; } return true; })());
    // Disziplin
    const D0 = idealP('D0'), D1 = idealP('D1'); BAU_KEYS.forEach(k => setze(D1, k, 3));
    const f0 = bauDisziplinFaktor(D0, 'dressur'), f1 = bauDisziplinFaktor(D1, 'dressur');
    ok('Disziplin: ideal +4 %, alles weit weg bis −4 % (am Rand 0/100 etwas weniger)', Math.abs(f0 - 1.04) < 0.004 && f1 >= 0.96 && f1 < 0.99, f0.toFixed(3) + ' / ' + f1.toFixed(3));
    ok('Gewichte je Disziplin summieren zu 1 (11 Disziplinen, alle in DISZ)', Object.entries(BAU_DISZ).every(([k, G]) => DISZ[k] && Math.abs(Object.values(G).reduce((a, b) => a + b, 0) - 1) < 1e-9) && Object.keys(DISZ).every(k => BAU_DISZ[k]), Object.keys(DISZ).filter(k => !BAU_DISZ[k]).join());
    ok('diszWert: Pferd mit gutem Exterieur etwas besser als mit schlechtem (gleiche Werte)', diszWert(D0, 'dressur').wert > diszWert(D1, 'dressur').wert);
    // Gesundheit
    const G = idealP('G'), r = () => Object.fromEntries(befundRisiko(G, spiel.boxen[0], 'box')), a0 = r(), alt = { ...G.bau };
    setze(G, 'stV', 2); setze(G, 'huf', 3); setze(G, 'ruecken', 2); const a1 = r();
    ok('Befundrisiko: deutlicher Fehler Stellung ×1,3 (Sehne), Huf 3 σ (bei guter Hufpflege nur deutlich) ×1,3 (Strahlfäule), Rücken deutlich ×1,3 (Kissing), Kolik unverändert', a0.sehne > 0 && Math.abs(a1.sehne / a0.sehne - 1.3) < 1e-6 && Math.abs(a1.strahlfaeule / a0.strahlfaeule - 1.3) < 1e-6 && Math.abs(a1.kissing / a0.kissing - 1.3) < 1e-6 && Math.abs(a1.kolik / a0.kolik - 1) < 1e-6, [a1.sehne / a0.sehne, a1.strahlfaeule / a0.strahlfaeule, a1.kissing / a0.kissing].map(x => x.toFixed(3)).join(' / '));
    G.bau = { ...alt }; setze(G, 'stV', -3.5); G.pflege.huf = spiel.tag - 10 * tpj(); G.bau.huf = 100; setze(G, 'stV', 3.5); const a2 = r(); ok('Starker Fehler ×1,7 (Stellung 3,5 σ)', Math.abs(a2.sehne / a0.sehne - 1.7) < 1e-6, (a2.sehne / a0.sehne).toFixed(3)); G.pflege.huf = spiel.tag; G.bau = { ...alt }; setze(G, 'stV', 1.2); ok('Leichte Abweichung kostet nichts', Math.abs(r().sehne / a0.sehne - 1) < 1e-6);
    // Fohlenschau
    const fs = []; for (let i = 0; i < 400; i++) { const f = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'FS' + i, id: 'fs' + i }); f.pflege = erzeugePflege(f); f.werte = f.werte || erzeugeWerte(f); werteErgaenzen(f); fs.push(fohlenNoten(f, Math.random)); }
    const pra = fs.filter(x => x.gesamt >= FS_PRAEMIE).length / fs.length * 100; out.push(`ℹ️ Fohlenschau: ${pra.toFixed(1)} % Prämienfohlen (vorher 13–17 % je Rasse, Schnitt 14,6)`);
    ok('Fohlenschau: Körperbau-Note aus dem Exterieur (Schnitt um 7), Prämienfohlen-Anteil im alten Bereich', Math.abs(fs.reduce((a, x) => a + x.koerper, 0) / fs.length - 7) < 0.4 && pra > 8 && pra < 24, pra.toFixed(1));
    const fz = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Fz', id: 'fz1' }); fz.werte = fz.werte || erzeugeWerte(fz); fz.pflege = erzeugePflege(fz); werteErgaenzen(fz); bauErgaenzen(fz); BAU_KEYS.forEach(k => { fz.bau[k] = Math.round(bauZiel(fz)[k]); }); const nb = fohlenNoten(fz, null, true).koerper; BAU_KEYS.forEach(k => setze(fz, k, 3)); ok('Fohlenschau: schlechtes Exterieur senkt die Körperbau-Note', fohlenNoten(fz, null, true).koerper < nb, fohlenNoten(fz, null, true).koerper + ' < ' + nb);
    // Lese-Modus (Marktpferd)
    const M = neuesPferd({ rasse: 'araber', geschlecht: 'Hengst', alter: 7, name: 'Markt' }); M.pflege = erzeugePflege(M); M.werte = M.werte || erzeugeWerte(M); werteErgaenzen(M);
    leseAkte(M); aktenReiter = 'merkmale'; zeigeAkte(); ok('Lese-Modus (Markt): Karte Merkmale mit Balken', document.querySelectorAll('#info .skala.merk').length === 12 && !!M.bau);
    return out;
  });
  const R4 = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); spiel.admin = false; spiel.stufenAn = false;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); bauErgaenzen(p); return p; };
    // --- M4: Rassemerkmale ---
    const H = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'RM1', id: 'rm1' }); H.besond = { hahn: false };
    const R1 = rasseMerkmale(H); ok('Rassemerkmale: Zeilen Größe, Farbe, Abzeichen, Kopfform, Exterieur', ['Größe', 'Farbe', 'Abzeichen', 'Kopfform', 'Exterieur insgesamt'].every(n => R1.z.some(x => x.n === n)) && !R1.misch);
    const Mi = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Mi', id: 'rm2' }); Mi.anteile = { hannoveraner: 50, shetty: 50 };
    ok('Mischling: keine Rassenprüfung, kein Typ-Abzug', rasseMerkmale(Mi).misch && rmTypAbzug(Mi) === 0);
    const Fr = neu({ rasse: 'friese', geschlecht: 'Stute', alter: 8, name: 'Fr', id: 'rm3' }); Fr.ex = Fr.ex || {}; Fr.ex.weiss = 1; ['bvl', 'bvr', 'bhl', 'bhr'].forEach(k => { Fr.ex[k] = 1; });
    const RF = rasseMerkmale(Fr); ok('Friese mit viel Weiß: Abzeichen = schwerer Verstoß, Marktwert ×0,85', RF.z.find(x => x.n === 'Abzeichen').st >= 2 && rasseWertFaktor(Fr) <= RM_ZAHL.wertVerstoss, RF.z.find(x => x.n === 'Abzeichen').st + ' / ' + rasseWertFaktor(Fr));
    const hv = JSON.stringify(besondListe(H)) + JSON.stringify(rasseMerkmale(H)) + merkmaleHTML(H, null, () => '', () => '', () => '');
    ok('Versteckte Gene (Cr, Lp, ex.…) stehen nicht auf der Karte', !/\bCr\b|\bLp\b|Patn|ex\./.test(hv));
    // --- Hahnentritt ---
    let n0 = 0, n1 = 0, n2 = 0; const N = 3000, ff = () => ({}); const A = { besond: { hahn: false }, id: 'a' }, B = { besond: { hahn: true }, id: 'b' };
    for (let i = 0; i < N; i++) { if (besondErben(A, A, ff()).hahn) n0++; if (besondErben(A, B, ff()).hahn) n1++; if (besondErben(B, B, ff()).hahn) n2++; }
    ok('Hahnentritt-Vererbung: ohne ≈ 0,3 %, ein Elternteil ≈ 10 %, zwei ≈ 30 %', n0 / N < 0.012 && Math.abs(n1 / N - 0.1) < 0.03 && Math.abs(n2 / N - 0.3) < 0.04, [n0, n1, n2].map(x => (x / N * 100).toFixed(1)).join(' / '));
    const Hh = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Hh', id: 'rm4' }); Hh.besond = { hahn: false }; const w0 = besondWertFaktor(Hh); Hh.besond.hahn = true;
    ok('Hahnentritt: Marktwert ×0,85, Besonderheit in der Liste', nah0(besondWertFaktor(Hh) / w0, RM_ZAHL.hahnWert) && besondListe(Hh).some(x => x.k === 'hahn'));
    function nah0(a, b) { return Math.abs(a - b) < 1e-9; }
    // --- Zuchtbuch ---
    const Z = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Z', id: 'rm5' }); const zb = zuchtbuchVon(Z);
    ok('Zuchtbuch: Stute ab 3 J. hat eine Klasse', !!zb && ZUCHTBUCH.some(k => k[1] === zb.n));
    const Hn = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Hn', id: 'rm6' }); const Fo = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 1, name: 'Fo', id: 'rm7' });
    ok('Zuchtbuch: Hengst, Jungpferd und Mischling ohne Klasse', zuchtbuchVon(Hn) === null && zuchtbuchVon(Fo) === null && zuchtbuchVon(Mi) === null);
    ok('Zuchtbuch-Schwellen 8/7/6', ZUCHTBUCH.map(k => k[0]).join() === '8,7,6,0' && ZUCHTBUCH[0][1] === 'Hauptstutbuch');
    // --- Wirkung auf Typnote und Marktwert ---
    const T = neu({ rasse: 'friese', geschlecht: 'Stute', alter: 1, name: 'T', id: 'rm8' }); const t0 = typRoh(T); T.kopf = { f: 'schwein', s: 3 };
    ok('Typnote sinkt bei Verstoß (Schweinskopf bzw. Rassemerkmal)', typRoh(T) < t0);
    const Mw = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Mw', id: 'rm9' }); Mw.besond = { hahn: false }; const m0 = marktwert(Mw); Mw.besond.hahn = true;
    ok('Marktwert sinkt mit Hahnentritt', marktwert(Mw) < m0, marktwert(Mw) + ' < ' + m0);
    ok('Exterieur-Faktor zwischen 60 % und 125 %', (() => { for (let i = 0; i < 100; i++) { const x = neu({ rasse: 'friese', geschlecht: 'Stute', alter: 8, name: 'e' + i, id: 'ef' + i }); const f = exterieurFaktor(x); if (f < 0.6 || f > 1.25) return false; } return true; })());
    return out;
  });
  R.push(...R4);
  const R5 = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); spiel.admin = false; spiel.stufenAn = false;
    const neu = (o, ab) => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); bauErgaenzen(p); BAU_KEYS.forEach(k => { p.bau[k] = Math.round(bauZiel(p)[k]); }); Object.entries(ab || {}).forEach(([k, d]) => { p.bau[k] = Math.max(0, Math.min(100, Math.round(bauZiel(p)[k] + d * BAU_S))); }); p.besond = { hahn: false }; return p; };
    // --- M5: Verpaaren-Vorschau ---
    const st = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Tutti', id: 'v1' }, { schulter: -2 }), bruno = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Bruno', id: 'v2' }, { schulter: 2 }), max = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Max', id: 'v3' }, { schulter: -2 });
    const vb = paarVorschau(st, bruno).map(x => x[1]).join('|'), vm = paarVorschau(st, max).map(x => x[1]).join('|');
    ok('Vorschau: Gegenteil „gleicht aus: Schulter“', /gleicht aus: Schulter/.test(vb), vb);
    ok('Vorschau: gleiche Abweichung „verstärkt: Schulter“', /verstärkt: Schulter/.test(vm), vm);
    const ideal = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'I', id: 'v4' }), id2 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'I2', id: 'v5' });
    ok('Vorschau: zwei ideale Pferde → keine Zeile', paarVorschau(ideal, id2).length === 0);
    const hb = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'H', id: 'v6' }), hs = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'S', id: 'v7' }); hb.besond.hahn = true; hs.besond.hahn = true;
    ok('Vorschau: „Risiko: Hahnentritt bei beiden“', paarVorschau(hb, hs).some(x => /Risiko: Hahnentritt/.test(x[1])));
    const viele = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'V', id: 'v8' }, { rahmen: 2, halsL: 2, halsA: 2, schulter: 2, ruecken: 2, kruppe: 2 }), viele2 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'V2', id: 'v9' }, { rahmen: 2, halsL: 2, halsA: 2, schulter: 2, ruecken: 2, kruppe: 2 });
    ok('Vorschau: höchstens 4 Zeilen', paarVorschau(viele, viele2).length === 4, paarVorschau(viele, viele2).length);
    const txt = paarVorschauHTML(st, bruno); spiel.spieler = spiel.spieler || {}; 
    ok('Vorschau: nur Wörter, keine Zahlen/Gene', !/\d|Cr\b|Lp\b/.test(txt.replace(/<[^>]*>/g, '')), txt.replace(/<[^>]*>/g, ' ').slice(0, 120));
    // Stufen: Anfänger sieht keine Vorschau
    spiel.stufenAn = true; spiel.spieler.stufe = 'anf'; ok('Anfänger: keine Vorschau', paarVorschauHTML(st, bruno) === ''); spiel.spieler.stufe = 'fort'; ok('Fortgeschritten: Vorschau da', paarVorschauHTML(st, bruno) !== ''); spiel.stufenAn = false;
    // Hinweise
    ok('Hinweise M1…M8 im Katalog mit Einsteiger-Eintrag', ['merkKarte', 'merkBalken', 'merkVergleich', 'merkFehler', 'merkHuf', 'merkMuskel', 'merkRasse'].every(k => HINWEISE[k] && EINSTEIGER_MEHR[HINWEISE[k][4]] === '🧬 Beurteilungsbogen'));
    ok('Enzyklopädie: Eintrag „Beurteilungsbogen“', ENZY.einsteiger.eintraege.some(e => e[0] === '🧬 Beurteilungsbogen'));
    const f = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Fe', id: 'v10' }, { huf: 2.5, muskel: -2.5, schulter: 2.5 }); B().pferd = f;
    const L = merkHinweise(f); ok('Auslöser: Fehler, Huf, Muskel', ['merkFehler', 'merkHuf', 'merkMuskel'].every(k => L.includes(k)), L.join());
    return out;
  });
  R.push(...R5);
  R.push(...R2);
  const html = require('fs').readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8'), ras = (html.match(/\.\.\.kopfOpt\(wahl\), bau: undefined/g) || []).length, alle = (html.match(/kopfOpt\(wahl\)/g) || []).length;
  R.push((ras === alle && alle >= 2 ? '✓ ' : '✗ ') + 'Rassenansicht/Gene selbst wählen: kopfOpt(wahl) immer mit bau: undefined (ohne Exterieur) – ' + ras + ' von ' + alle);
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
