// Krankheiten-Test (v514): neue Erbkrankheiten, Veranlagungen und Befunde (LFS, OAAM, MH, Leberfibrose, Sarkoid, Sonnenbrand, Augenlid-Krebs, EMS, Hyperlipämie,
// Kissing Spines, Hufrolle, Spat, Sehne, Lungenblutung, Röhrbeinbruch, Darmstein, Aorta, Megaösophagus, Shivers, Hodenhochstand, MCOA, Gebiss) + Kopfform-Neigung.
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/krankheiten-test.js
// Erwartet: jede Zeile „✓“ und am Ende „alles ok“.
const { chromium } = require('playwright');
const path = require('path');
const NEU = ['mh', 'sarkoid', 'sonnenbrand', 'augenkrebs', 'ems', 'hyperlipaemie', 'kissing', 'hufrolle', 'spat', 'sehne', 'eiph', 'fraktur', 'darmstein', 'aorta', 'megaoes', 'shivers', 'krypt', 'mcoa'];
const NEU_ERB = ['lfs', 'oaam', 'mh', 'chf'];
const NEU_VL = ['sarkoid', 'hautkrebs', 'ems', 'aorta', 'megaoes', 'shiver', 'krypt', 'biss'];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; const L = [];
  pg.on('pageerror', e => errs.push(e.message));
  const ok = (name, bedingung, info = '') => L.push([bedingung ? '✓' : '✗', name, info]);
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(200); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200);
  const r = await pg.evaluate(([NEU, NEU_ERB, NEU_VL]) => {
    const A = {}; const ev = n => (0, eval)(n);
    const fehler = []; const check = (n, b) => { if (!b) fehler.push(n); };
    // ---- 1. Daten vollständig ----
    NEU.forEach(k => { const K = KRANK[k]; check('KRANK ' + k, K && K.n && K.anz && K.anz.length && K.schwer && K.ico);
      check('HILFT ' + k, HILFT[k] !== undefined); check('PLAN ' + k, PLAN[k] !== undefined); check('URSACHE ' + k, typeof URSACHE[k] === 'function'); check('UCHECK ' + k, !!UCHECK[k]);
      check('VERDACHT ' + k, !!VERDACHT[k]); check('KRANK_INFO ' + k, !!KRANK_INFO[k]); check('TURNIER_GRENZE ' + k, TURNIER_GRENZE[k] != null); });
    NEU_ERB.forEach(k => { const E = ERBKRANK[k]; check('ERBKRANK ' + k, E && E.n && E.kurz); check('ERB_INFO ' + k, !!ERB_INFO[k]);
      Object.keys(E.rassen).forEach(r => check('Rasse ' + r + ' in ' + k, !!rasseById(r))); if (E.folge === 'tod' || E.folge === 'tot') check('Text ' + k, !!E.text); });
    NEU_VL.forEach(k => { check('VERANLAGUNG ' + k, !!VERANLAGUNG[k]); check('VL_INFO ' + k, !!VL_INFO[k]); Object.keys(VERANLAGUNG[k].rassen).forEach(r => check('Rasse ' + r + ' in VL ' + k, !!rasseById(r))); });
    Object.values(OP_KLINIK).forEach(O => O.art.forEach(a => check('OP-Befund ' + a, a === 'pfeifen' || !!KRANK[a])));
    check('Shire leichtfuttrig', LEICHTFUTTRIG.includes('shire'));
    A.datenFehler = fehler.slice();
    // ---- Hilfen ----
    window.leer = () => { spiel.boxen.forEach(bx => { bx.pferd = null; bx.fohlen = null; bx.tot = false; }); };
    window.neu = (rasse, geschlecht, jahre, f) => { const p = neuesPferd({ name: 'T' + Math.floor(Math.random() * 1e4), rasse, geschlecht, alter: jahre }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); if (f) f(p);
      const bx = spiel.boxen[0]; bx.pferd = p; bx.fohlen = null; bx.tot = false; bx.krippeVoll = true; bx.mistig = false; bx.nachtMist = 0; return [p, bx]; };
    window.sommer = () => { for (let t = spiel.tag; t < spiel.tag + 400; t++) if (datum(t - 1).s === 1) { spiel.tag = t; return true; } return false; };
    window.risiko = (p, bx, ort = 'box') => Object.fromEntries(befundRisiko(p, bx, ort));   // Wahrscheinlichkeit je Nacht (mit Zufallsanteil Konstitution)
    window.faktor = (p, bx, ort = 'box') => Object.fromEntries(Object.entries(BEFUND_ZUSATZ).map(([k, fn]) => [k, fn(p, bx, ort, 1, alterJZ(p) / 4)]));   // reiner Faktor der neuen Krankheiten (Sommer)
    window.jahr = x => Math.round(x * 4 * tpj() * 1000) / 10;   // Wahrscheinlichkeit je Jahr in %
    // ---- 2. Erbkrankheiten ----
    leer(); const [m] = neu('araber', 'Stute', 8), [v] = neu('araber', 'Hengst', 8);
    ['lfs', 'oaam'].forEach(k => { m.erb = { ...(m.erb || {}), [k]: 1 }; v.erb = { ...(v.erb || {}), [k]: 1 }; let betroffen = 0; const N = 800;
      for (let i = 0; i < N; i++) { const f = { rasse: 'araber', zielStockmass: 150 }; erbVererben(f, m, v); if (f.erb[k] === 2) { betroffen++; erbGeburt(f, m); if (!f.erbTod || f.erbTod.k !== k) fehler.push(k + ' erbTod fehlt'); } }
      check(k + ' betroffen ≈ 25 % (' + Math.round(betroffen / N * 100) + ')', betroffen / N > 0.19 && betroffen / N < 0.31); });
    { const [hm] = neu('haflinger', 'Stute', 8), [hv] = neu('haflinger', 'Hengst', 8); hm.erb = { chf: 1 }; hv.erb = { chf: 1 }; let n = 0; for (let i = 0; i < 400; i++) { const f = { rasse: 'haflinger' }; erbVererben(f, hm, hv); if (f.erb.chf === 2) { n++; erbGeburt(f, hm); if (!f.erbTod || f.erbTod.jz == null) fehler.push('chf Folge'); } } check('chf betroffen vorhanden', n > 40); }
    // Tod des Fohlens (LFS): erbTodPruefen am nächsten Tag
    { const [mm] = neu('araber', 'Stute', 8); const bx = spiel.boxen[0]; const f = neuesPferd({ name: 'Fohl', rasse: 'araber', geschlecht: 'Hengst', alter: 0.01 }); f.pflege = erzeugePflege(f); f.erb = { lfs: 2 }; erbGeburt(f, mm); bx.fohlen = f; spiel.tag += 2; erbTodPruefen(); check('LFS-Fohlen ist gestorben', !bx.fohlen); }
    // MH: dominant, Befund ab 4 Jahreszeiten
    { const [q] = neu('quarter', 'Hengst', 6); q.erb = { mh: 1 }; q.befunde = []; for (let i = 0; i < 12 && !befundListe(q).some(x => x.art === 'mh'); i++) erbJahreszeit(); check('MH-Befund entsteht', befundListe(q).some(x => x.art === 'mh')); }
    // Labortest zeigt die neuen Krankheiten
    { const [a] = neu('araber', 'Stute', 8); const h = erbErgebnisHTML(a); check('Labor zeigt LFS/OAAM bei Araber', /LFS/.test(h) && /OAAM/.test(h)); const [q] = neu('quarter', 'Stute', 8); check('Labor zeigt MH bei Quarter', /MH/.test(erbErgebnisHTML(q))); const [hf] = neu('haflinger', 'Stute', 8); check('Labor zeigt Leberfibrose/PSSM bei Haflinger', /Leberfibrose/.test(erbErgebnisHTML(hf)) && /PSSM/.test(erbErgebnisHTML(hf))); }
    A.erb = 'geprüft';
    // ---- 3. Risiken (Rassen- und Zustandsunterschiede) ----
    sommer();
    { const [a, bx] = neu('appaloosa', 'Stute', 8, p => { p.vl = { ...veranlagungVon(p), sarkoid: 0.35 }; }); const [h] = neu('hannoveraner', 'Stute', 8, p => { p.vl = { ...veranlagungVon(p), sarkoid: 0.05 }; });
      const ra = faktor(a, bx).sarkoid; const bx2 = spiel.boxen[0]; const rh = faktor(h, bx2).sarkoid; check('Sarkoid: Appaloosa-Veranlagung > Hannoveraner (' + jahr(ra) + ' % vs ' + jahr(rh) + ' %)', ra > rh * 3); }
    { const [p, bx] = neu('haflinger', 'Stute', 9, q => { q.ex = { ...exVon(q), weiss: 0.99 }; }); const w = faktor(p, bx, 'weide').sonnenbrand, k = faktor(p, bx, 'box').sonnenbrand, rosa = rosaHaut(p);
      check('Sonnenbrand: Weide > Box bei rosa Haut (rosa ' + rosa + ': ' + w + ' vs ' + k + ')', rosa > 0 && w > k * 3); const [d] = neu('hannoveraner', 'Stute', 9, q => { q.ex = { ...exVon(q), weiss: 0.01 }; }); check('Sonnenbrand: weniger rosa Haut ohne Abzeichen (' + rosaHaut(d) + ' < ' + rosa + ')', rosaHaut(d) < rosa); }
    { const [p, bx] = neu('haflinger', 'Stute', 12, q => { q.ex = { ...exVon(q), weiss: 0.99 }; q.vl = { ...veranlagungVon(q), hautkrebs: 0.5 }; }); const [j] = neu('haflinger', 'Stute', 3, q => { q.ex = { ...exVon(q), weiss: 0.99 }; }); check('Augenlid-Krebs: nur ältere Pferde', faktor(p, bx).augenkrebs > 0 && faktor(j, spiel.boxen[0]).augenkrebs === 0); }
    { const [d, bx] = neu('shetty', 'Stute', 8, q => { q.fz = 8; q.vl = { ...veranlagungVon(q), ems: 0.6 }; }); const r8 = faktor(d, bx).ems; d.fz = 5; const r5 = faktor(d, bx).ems; check('EMS: dick > normal (' + jahr(r8 * KRANK.ems.gew) + ' % vs ' + jahr(r5 * KRANK.ems.gew) + ' %)', r8 > 0 && r5 === 0);
      d.fz = 8; d.futterStatus = { hunger: true, tag: spiel.tag }; check('Hyperlipämie: dickes Pony das hungert', faktor(d, bx).hyperlipaemie > 0.3 && (d.fz = 5, faktor(d, bx).hyperlipaemie === 0)); const [gro] = neu('hannoveraner', 'Stute', 8, q => { q.fz = 8; q.futterStatus = { hunger: true, tag: spiel.tag }; }); check('Hyperlipämie: nicht bei Großpferden', faktor(gro, spiel.boxen[0]).hyperlipaemie === 0);
      d.fz = 8; d.futterStatus = {}; d.befunde = []; const h0 = risiko(d, bx).hufrehe; befundNeu(d, 'ems', 1, 'x'); check('EMS-Befund erhöht Hufrehe ×3 (' + h0 + ' → ' + risiko(d, bx).hufrehe + ')', risiko(d, bx).hufrehe > h0 * 2.9); }
    { const [v1, bx] = neu('vollblut', 'Hengst', 5, q => { q.arbeitSchnitt = 70; }); const [s1] = neu('shetty', 'Hengst', 5, q => { q.arbeitSchnitt = 70; }); const rv = faktor(v1, bx); const rs = faktor(s1, spiel.boxen[0]);
      check('Sehne: Vollblut > Shetty (' + jahr(rv.sehne * KRANK.sehne.gew) + ' % vs ' + jahr(rs.sehne * KRANK.sehne.gew) + ' %)', rv.sehne > rs.sehne * 3); check('Lungenblutung: nur Rennrassen', rv.eiph > 0 && rs.eiph === 0);
      check('Röhrbeinbruch: junges Vollblut mit schwerer Arbeit', rv.fraktur > rs.fraktur * 3); const [alt] = neu('vollblut', 'Hengst', 14, q => { q.arbeitSchnitt = 70; }); check('Röhrbeinbruch: nicht mehr im Alter', faktor(alt, spiel.boxen[0]).fraktur === 0); }
    { const [a, bx] = neu('araber', 'Stute', 8), [h] = neu('hannoveraner', 'Stute', 8); const ra = faktor(a, bx).darmstein, rh = faktor(h, spiel.boxen[0]).darmstein; check('Darmstein: Araber > Hannoveraner', ra > rh * 3); a.futterStatus = { luzerne: 2, tag: spiel.tag }; check('Darmstein: Luzerne ×3', faktor(a, bx).darmstein > ra * 2.5); }
    { const [f1, bx] = neu('friese', 'Stute', 8, q => { q.vl = { ...veranlagungVon(q), aorta: 0.25, megaoes: 0.15 }; }); const rf = faktor(f1, bx); const [hn] = neu('hannoveraner', 'Stute', 8); const rh = faktor(hn, spiel.boxen[0]); check('Aorta/Megaösophagus nur beim Friesen', rf.aorta > 0 && rf.megaoes > 0 && rh.aorta === 0 && rh.megaoes === 0);
      f1.befunde = []; f1.futterStatus = { einweich: 1, tag: spiel.tag }; const s0 = risiko(f1, bx).schlund; befundNeu(f1, 'megaoes', 1, 'x'); check('Megaösophagus erhöht Schlundverstopfung ×3 (' + s0 + ' → ' + risiko(f1, bx).schlund + ')', s0 > 0 && risiko(f1, bx).schlund > s0 * 2.9); }
    { const [sh, bx] = neu('shire', 'Stute', 8, q => { q.vl = { ...veranlagungVon(q), shiver: 0.35 }; }); const [ha] = neu('hannoveraner', 'Stute', 8, q => { q.vl = { ...veranlagungVon(q), shiver: 0.04 }; }); check('Shivers: Shire > Hannoveraner', faktor(sh, bx).shivers > faktor(ha, spiel.boxen[0]).shivers * 5); }
    { const [kh, bx] = neu('quarter', 'Stute', 8, q => { q.arbeitSchnitt = 40; }); const [sp] = neu('isi', 'Stute', 8, q => { q.arbeitSchnitt = 40; }); const rk = faktor(kh, bx); const rs = faktor(sp, spiel.boxen[0]); check('Hufrolle: Quarter > Isländer', rk.hufrolle > rs.hufrolle); check('Spat: Isländer > Quarter', rs.spat > rk.spat); const [wb] = neu('hannoveraner', 'Stute', 8, q => { q.arbeitSchnitt = 40; }); check('Kissing Spines: Warmblut > Araber', faktor(wb, spiel.boxen[0]).kissing > faktor((() => neu('araber', 'Stute', 8, q => { q.arbeitSchnitt = 40; })[0])(), spiel.boxen[0]).kissing); }
    // ---- 4. Jahres-Erwartung je Rasse (nur die neuen Befunde) ----
    A.tabelle = [];
    RASSEN.forEach(ra => { const [p, bx] = neu(ra.id, 'Stute', 8, q => { q.arbeitSchnitt = 40; }); let sum = 0; const R = risiko(p, bx, 'weide'); NEU.forEach(k => { if (R[k]) sum += R[k]; }); A.tabelle.push([ra.id, Math.round(sum * 4 * tpj() * 100) / 100, NEU.filter(k => R[k] * 4 * tpj() > 0.03).map(k => k + ' ' + Math.round(R[k] * 4 * tpj() * 100) + '%').join(',')]); check('Risiko endlich ' + ra.id, Object.values(R).every(x => isFinite(x) && x >= 0)); });
    // ---- 5. Ablauf jedes neuen Befunds: Nacht, Tierarzt, Anzeige, Verdacht ----
    NEU.forEach(k => { try { leer(); const [p, bx] = neu(k === 'krypt' ? 'quarter' : 'hannoveraner', k === 'krypt' ? 'Hengst' : 'Stute', 8); p.befunde = []; const befund = befundNeu(p, k, KRANK[k].start[0], URSACHE[k](p, 'box', bx));
        befundeNacht(); befundeNacht(); anzeichenText(befund); befundZeilen(p); const Vd = verdachtVon(p, befund); testAngebot(p, befund); befundSicht(p, befund); opKarteHTML(p);
        tierarztBesuch(p, bx, () => {}); document.getElementById('dlg').hidden = true; const l = befundListe(p); check('Tierarzt-Besuch ' + k, true);
        const O = Object.entries(OP_KLINIK).find(([, o]) => o.art.includes(k)); if (O) { const bef = befundListe(p).find(x => x.art === k); if (bef) { bef.diagnose = spiel.tag; bef.bemerkt = { von: 'Tierarzt', tag: spiel.tag }; check('OP-Karte für ' + k, /möglich/.test(opKarteHTML(p)));
            p.klinik = { seit: spiel.tag, op: O[0], bis: spiel.tag }; p.pflege.gesundheit = 90; const erfolg = O[1].erfolg; const ro = Math.random; Math.random = () => 0; externNacht(); Math.random = ro; check('OP ' + k + ' abgeschlossen', !p.klinik && !befundListe(p).some(x => x.art === k) || erfolg < 1); if (O[1].wallach) check('Kryptorchiden-OP macht Wallach', p.geschlecht === 'Wallach'); } } }
      catch (e) { fehler.push('Ablauf ' + k + ': ' + e.message); } });
    // ---- 5b. Renntag: Lungenblutung und Röhrbeinbruch ----
    { leer(); const [r1] = neu('vollblut', 'Hengst', 4); r1.befunde = []; const z = []; const rr = Math.random; Math.random = () => 0; rennRisiko(r1, false, z); Math.random = rr;
      check('Renntag: Lungenblutung + Röhrbeinbruch möglich', befundListe(r1).some(b => b.art === 'eiph') && befundListe(r1).some(b => b.art === 'fraktur') && z.length === 2);
      const [sh] = neu('shetty', 'Hengst', 4); sh.befunde = []; Math.random = () => 0; rennRisiko(sh, false, []); Math.random = rr; check('Renntag: Shetty bekommt keine Lungenblutung', !befundListe(sh).some(b => b.art === 'eiph'));
      const [r2] = neu('vollblut', 'Hengst', 4); r2.befunde = []; let n = 0; for (let i = 0; i < 4000; i++) { r2.befunde = []; rennRisiko(r2, false, []); if (befundListe(r2).some(b => b.art === 'fraktur')) n++; } check('Röhrbeinbruch ≈ 0,16 % der Starts (' + n + ' von 4000)', n >= 1 && n <= 20); }
    // ---- 5c. Ankaufsuntersuchung findet die neuen Krankheiten (v516) ----
    { const zaehl = {}; let mitNeu = 0; const N = 1500, alle = RASSEN.map(r => r.id);
      for (let i = 0; i < N; i++) { const h = neuesPferd({ name: 'M' + i, rasse: alle[i % alle.length], geschlecht: i % 2 ? 'Stute' : 'Hengst', alter: 3 + (i % 14), id: 'aku' + i }); const F = akuFunde(h, 'Händler'); const neuF = F.filter(f => NEU.includes(f.art) || f.gebiss); if (neuF.length) mitNeu++; neuF.forEach(f => { const k = f.art || 'gebiss'; zaehl[k] = (zaehl[k] || 0) + 1; }); }
      A.akuZaehl = zaehl; A.akuAnteil = Math.round(mitNeu / N * 100);
      check('AKU: neue Krankheiten kommen vor, aber nicht bei jedem Pferd (' + A.akuAnteil + ' %)', mitNeu > 0 && mitNeu / N < 0.4);
      ['spat', 'hufrolle', 'kissing', 'sehne', 'sarkoid', 'krypt'].forEach(k => check('AKU findet ' + k + ' (' + (zaehl[k] || 0) + ')', (zaehl[k] || 0) > 0));
      // Röntgen nur in der großen AKU, Haut/Gebiss/Hengst immer
      const h = neuesPferd({ name: 'Rx', rasse: 'quarter', geschlecht: 'Hengst', alter: 12, id: 'akuRx' }); h.akuF = [{ art: 'spat', grad: 1, check: 'roentgen', text: 'Spat (Röntgen)', minus: 0.1 }, { art: 'sarkoid', grad: 1, check: 'klinisch', text: 'Sarkoid', minus: 0.08 }, { gebiss: true, check: 'klinisch', text: 'Gebissfehler', minus: 0.03 }];
      akuMachen(h, 'Händler', 'klein', false, false); check('kleine AKU: Haut/Gebiss ja, Röntgen nein', h.akuErg.funde.includes('Sarkoid') && h.akuErg.funde.includes('Gebissfehler') && !h.akuErg.funde.includes('Spat (Röntgen)'));
      akuMachen(h, 'Händler', 'gross', false, false); check('große AKU findet den Spat im Röntgen', h.akuErg.funde.includes('Spat (Röntgen)'));
      // Händler verdeckt Spat/Sehne zur Hälfte mit Schmerzmittel
      let masked = 0, gesamt = 0, blut = 0; for (let i = 0; i < 1500; i++) { const q = neuesPferd({ name: 'H' + i, rasse: ['quarter', 'vollblut', 'hannoveraner', 'isi'][i % 4], geschlecht: 'Stute', alter: 10 + (i % 6), id: 'hdl' + i }); const F = akuFunde(q, 'Händler');
        F.filter(f => ['spat', 'sehne', 'hufrolle', 'kissing'].includes(f.art)).forEach(f => { gesamt++; if (f.maskiert) masked++; }); if (F.some(f => /^Schmerzmittel/.test(f.text || '') && f.check === 'blutGross')) blut++; }
      check('Händler verdeckt etwa die Hälfte der Spat-/Sehnen-/Hufrolle-/Kissing-Funde (' + masked + ' von ' + gesamt + ')', gesamt > 20 && masked / gesamt > 0.3 && masked / gesamt < 0.7); check('Schmerzmittel im Blut wird dann im großen Blutbild sichtbar (' + blut + ')', blut > 0);
      const m = neuesPferd({ name: 'Mk', rasse: 'quarter', geschlecht: 'Stute', alter: 12, id: 'akuMask' }); m.akuF = [{ art: 'spat', grad: 1, check: 'roentgen', text: 'Spat (Röntgen)', minus: 0.1, maskiert: true }, { check: 'blutGross', text: 'Schmerzmittel im Blut – ein Spat könnte verschleiert sein', minus: 0.05 }];
      const m1 = JSON.parse(JSON.stringify(m)); m1.pflege = erzeugePflege(m1); akuUebernehmen(m1, m, 'Händler'); const bm = befundListe(m1).find(b => b.art === 'spat'); check('verdeckter Spat: Lahmheit erst später sichtbar (Inkubation)', !!bm && bm.inkub > spiel.tag);
      leer(); const p = JSON.parse(JSON.stringify(h)); p.pflege = erzeugePflege(p); akuUebernehmen(p, h, 'Händler');
      check('beim Kauf kommen die Befunde mit (diagnostiziert) und der Gebissfehler', befundListe(p).some(b => b.art === 'spat' && b.diagnose) && befundListe(p).some(b => b.art === 'sarkoid' && b.diagnose) && p.gebissFehler === true); }
    // ---- 5d. Behandlung der neuen Krankheiten (Dome: nicht nur die Krankheit, auch die Behandlung testen) ----
    { const gueltig = k => k === 'boxenruhe' || k === 'beschlag' || !!AKTION[k] || !!APO[k];
      NEU.forEach(k => { Object.keys(HILFT[k] || {}).forEach(a => check('HILFT ' + k + ': ' + a + ' gibt es', gueltig(a))); (PLAN[k] || []).forEach(a => check('PLAN ' + k + ': ' + a + ' gibt es', gueltig(a))); Object.keys(SCHADET[k] || {}).forEach(a => check('SCHADET ' + k + ': ' + a + ' gibt es', gueltig(a)));
        (PLAN[k] || []).forEach(a => check('PLAN ' + k + ': ' + a + ' hilft auch (HILFT)', a === 'boxenruhe' || (HILFT[k] || {})[a] > 0)); if (!(PLAN[k] || []).length) check(k + ': ohne Plan → Tierarzt-Rat oder OP vorhanden', !!KRANK[k].rat || Object.values(OP_KLINIK).some(O => O.art.includes(k)) || k === 'mh'); });
      // Plan des Tierarztes anwenden: Mittel bereitlegen, behandeln (Dosis nach Gewicht), am nächsten Tag zählt die Behandlung
      const anwenden = (p, k) => { const ap = apotheke(), rz = rezeptVon(p); p.beschlag = p.beschlag || (PLAN[k] || []).includes('beschlag'); const out = [];
        (PLAN[k] || []).forEach(a => { if (a === 'beschlag') return; if (a === 'boxenruhe') { p.boxenruhe = true; return; } const mittel = AKTION[a] ? AKTION[a].mittel : a; if (mittel) { if (APO[mittel].frei) ap[mittel] = 20; else rz[mittel] = 20; }
          const M = APO[a]; out.push(behandeln(p, a, M && M.dosis ? dosisKlasse(gewichtAnzeige(p)) : 0, null)); }); return out; };
      const rr = Math.random; Math.random = () => 0.5;   // Pferd wehrt sich nicht (Zufall fest)
      const wert = {}; NEU.forEach(k => { if (!(PLAN[k] || []).length) return; leer(); const [p] = neu(k === 'krypt' ? 'quarter' : 'hannoveraner', 'Stute', 8); p.befunde = []; p.boxenruhe = false; const b = befundNeu(p, k, 2, 'Test'); b.diagnose = spiel.tag; b.tierarzt = true;
        const txt = anwenden(p, k); check('Behandlung ' + k + ' ohne Nebenwirkung/Fehler (' + txt.join(' | ').replace(/<[^>]+>/g, '') + ')', !txt.some(s => /Nebenwirkung|kein Rezept|nichts mehr|Dosis zu|zu hoch/.test(s)));
        spiel.tag++; const BW = behandlungsWert(p, b); wert[k] = Math.round(BW.wert * 100) / 100; const nurLindern = ['aorta', 'shivers'].includes(k);   // nicht heilbar – Behandlung bremst nur
        check('Behandlung ' + k + ' wirkt (Wert ' + wert[k] + ')', (nurLindern ? BW.wert > 0 : BW.wert >= 0.3) && BW.schaden === 0);
        spiel.tag--; delete p.behHeute; p.boxenruhe = false; p.beschlag = false; spiel.tag++; check('ohne Behandlung ' + k + ' kein Wert', behandlungsWert(p, b).wert === 0); spiel.tag--; });
      Math.random = rr; A.behWert = wert;
      // falsche Behandlung schadet (SCHADET)
      [['sehne', 'schritt'], ['fraktur', 'schritt'], ['ems', 'boxenruhe'], ['aorta', 'schritt']].forEach(([k, a]) => { leer(); const [p] = neu('hannoveraner', 'Stute', 8); p.befunde = []; const b = befundNeu(p, k, 2, 'Test'); b.diagnose = spiel.tag; Math.random = () => 0.5;
        if (a === 'boxenruhe') p.boxenruhe = true; else behandeln(p, a, 0, null); Math.random = rr; spiel.tag++; check('falsch behandelt schadet: ' + k + ' + ' + a, behandlungsWert(p, b).schaden > 0); spiel.tag--; p.boxenruhe = false; });
      // falsches Mittel gegen eine neue Krankheit → Nebenwirkung (z. B. Hustensaft bei Spat)
      { leer(); const [p] = neu('hannoveraner', 'Stute', 8); p.befunde = []; befundNeu(p, 'spat', 2, 'Test'); apotheke().hustensaft = 5; Math.random = () => 0.5; const t = behandeln(p, 'hustensaft', dosisKlasse(gewichtAnzeige(p)), null); Math.random = rr; check('falsches Mittel bei Spat → Nebenwirkung', /Nebenwirkung/.test(t)); }
      // Tierarzt-Besuch: Rezept für Rezeptmittel des Plans, Boxenruhe gesetzt, Erstbehandlung zählt den Tag
      NEU.forEach(k => { leer(); const [p, bx] = neu(k === 'krypt' ? 'quarter' : 'hannoveraner', k === 'krypt' ? 'Hengst' : 'Stute', 8); p.befunde = []; p.rezept = {}; p.boxenruhe = false; const b = befundNeu(p, k, 2, 'Test'); tierarztBesuch(p, bx, () => {}); document.getElementById('dlg').hidden = true;
        const rez = (PLAN[k] || []).filter(a => APO[a] && !APO[a].frei); check('Tierarzt ' + k + ': Rezept ' + (rez.join(',') || '–'), rez.every(a => (p.rezept[a] || 0) >= REZEPT_DOSEN)); if ((PLAN[k] || []).includes('boxenruhe')) check('Tierarzt ' + k + ': Boxenruhe', p.boxenruhe === true);
        spiel.tag++; check('Tierarzt ' + k + ': Erstbehandlung zählt (Wert 1)', befundListe(p).every(x => x.art !== k) || behandlungsWert(p, befundListe(p).find(x => x.art === k)).wert === 1); spiel.tag--; });
      // Hufschmied-Rat bei Hufrolle: Beschlag (ohne Rezeptmittel)
      check('Hufschmied rät bei Hufrolle zum Beschlag', hufschmiedRat('hufrolle').includes('beschlag') && !hufschmiedRat('hufrolle').includes('schmerzmittel'));
      // Heilverlauf: behandelt heilt schneller als unbehandelt (nicht chronische) bzw. wird seltener schlimmer (chronische) – je 150 Durchläufe à 10 Nächte
      const verlauf = (k, beh) => { let summe = 0, weg = 0; const N = 150; for (let i = 0; i < N; i++) { leer(); const [p, bx] = neu('hannoveraner', 'Stute', 8); p.befunde = []; p.boxenruhe = false; const b = befundNeu(p, k, 3, 'Test'); b.diagnose = spiel.tag; b.tierarzt = true; b.gewarnt = false;
          for (let n = 0; n < 10; n++) { if (beh) { Math.random = () => 0.5; anwenden(p, k); Math.random = rr; } spiel.tag++; bx.krippeVoll = true; befundeNacht(); if (bx.tot) { bx.tot = false; break; } }
          const x = befundListe(p).find(q => q.art === k); if (!x) weg++; summe += x ? x.grad : 0; } return { grad: Math.round(summe / N * 100) / 100, geheilt: weg }; };
      A.verlauf = {};
      ['sonnenbrand', 'sehne', 'hyperlipaemie', 'kissing', 'spat', 'eiph', 'ems', 'mh'].forEach(k => { const mit = verlauf(k, true), ohne = verlauf(k, false); A.verlauf[k] = { mit, ohne };
        if (['sonnenbrand', 'sehne', 'hyperlipaemie'].includes(k)) check('Verlauf ' + k + ': nicht chronisch – behandelt heilen einige aus (' + mit.geheilt + ')', mit.geheilt > ohne.geheilt);
        check('Verlauf ' + k + ': behandelt besser (Grad ' + mit.grad + ' vs ' + ohne.grad + ', geheilt ' + mit.geheilt + ' vs ' + ohne.geheilt + ')', mit.grad < ohne.grad || mit.geheilt > ohne.geheilt); });
    }
    // ---- 6. Hodenhochstand sperrt die Zucht ----
    { leer(); const [h, bx] = neu('quarter', 'Hengst', 8); h.befunde = []; const vorher = zuchtSperre(h, bx); befundNeu(h, 'krypt', 1, 'x'); check('Zucht gesperrt bei Hodenhochstand', /Hodenhochstand/.test(zuchtSperre(h, bx)) && !/Hodenhochstand/.test(vorher)); }
    // ---- 7. Gebiss ----
    { leer(); const [s, bx] = neu('shetty', 'Stute', 8, q => { q.vl = { ...veranlagungVon(q), biss: 0.5 }; }); s.pflege.zahn = spiel.tag - Math.round(2.5 * tpj()); const frueh = zahnUeber(s); const [h] = neu('hannoveraner', 'Stute', 8, q => { q.vl = { ...veranlagungVon(q), biss: 0.05 }; }); h.pflege.zahn = spiel.tag - Math.round(2.5 * tpj()); check('Gebissfehler: Zahnkontrolle früher fällig', frueh && !zahnUeber(h));
      s.pflege.zahn = spiel.tag - 3 * tpj(); const alt = spiel.boxen[0].pferd; spiel.boxen[0].pferd = s; vorsorge(s, 'zahn'); document.getElementById('dlg').hidden = true; check('Tierarzt findet Gebissfehler beim Raspeln', s.gebissFehler === true); }
    // ---- 8. Kopfform-Neigung ----
    { const anteil = (rasse, f) => { let n = 0; const N = 3000; for (let i = 0; i < N; i++) { const k = kopfZufall(rasse, Math.random); if (k.f === f) n++; } return n / N; };
      const normal = id => { let n = 0; const N = 3000; for (let i = 0; i < N; i++) { const k = kopfZufall(id, Math.random); if (k.f !== 'gerade' && k.f !== 'schaf' && k.f !== 'schwein') n++; } return n / N; };
      check('Marwari ≈ 50 % Ramsnase', Math.abs(anteil('marwari', 'ramsnase') - 0.47) < 0.08); check('Haflinger Hecht ≈ 34 %', Math.abs(anteil('haflinger', 'hecht') - 0.34) < 0.08); check('Noriker Ramsnase ≈ 34 %', Math.abs(anteil('noriker', 'ramsnase') - 0.34) < 0.08);
      ['quarter', 'paint', 'appaloosa', 'isi', 'fell', 'dales', 'shetty', 'lewitzer'].forEach(id => check('Kopf immer gerade: ' + id, normal(id) === 0)); check('Araber bleibt Hechtkopf', anteil('araber', 'hecht') > 0.8); }
    A.fehler = fehler; return A;
  }, [NEU, NEU_ERB, NEU_VL]).catch(e => ({ crash: e.message }));
  if (r.crash) { console.log('✗ Test abgestürzt:', r.crash); await b.close(); process.exit(1); }
  (r.datenFehler || []).forEach(f => L.push(['✗', 'Daten: ' + f, '']));
  ok('Daten vollständig (KRANK, HILFT, PLAN, URSACHE, VERDACHT, Infos, Rassen)', !(r.datenFehler || []).length);
  (r.fehler || []).forEach(f => L.push(['✗', f, '']));
  ok('Einzelprüfungen (Erbgang, Risiken, Abläufe, OPs, Zucht, Gebiss, Kopfform)', !(r.fehler || []).length);
  console.log('Behandlungswert je Krankheit: ' + JSON.stringify(r.behWert));
  console.log('Verlauf nach 10 Nächten (Grad Ø, geheilt von 150): ' + JSON.stringify(r.verlauf));
  console.log('AKU-Funde (1500 Marktpferde, Händler): ' + JSON.stringify(r.akuZaehl) + ' – Pferde mit neuem Fund: ' + r.akuAnteil + ' %');
  console.log('Erwartete neue Befunde je Rasse und Jahr (Stute 8 J., mittlere Arbeit, Weide):'); r.tabelle.forEach(([n, w, d]) => console.log('  ' + n.padEnd(13) + String(w).padEnd(6) + d));
  // ---- 9. Speichern und Neuladen mit neuen Befunden ----
  await pg.evaluate(() => { leer(); const [p] = neu('friese', 'Stute', 8); p.befunde = []; befundNeu(p, 'aorta', 2, 'x'); befundNeu(p, 'sarkoid', 1, 'x'); p.erb = { ...(p.erb || {}), lfs: 1 }; spiel.aktBox = 0; speichern(); });
  await pg.reload(); await pg.waitForTimeout(800);
  const nachLaden = await pg.evaluate(async () => { const s = document.getElementById('smWeiter'); if (!s || s.disabled) return 'kein Startmenü'; s.click(); await new Promise(r => setTimeout(r, 400)); try { zeigeAkte(); zeigeStall(); tagBeenden(); } catch (e) { return 'Fehler: ' + e.message; } return 'ok'; });
  await pg.waitForTimeout(2500);
  ok('Neuladen und Tag beenden mit neuen Befunden', nachLaden === 'ok' && !errs.length, nachLaden + ' ' + errs.join(' | '));
  L.forEach(x => console.log(x.filter(Boolean).join('  ')));
  const alles = L.every(x => x[0] === '✓') && !errs.length; console.log(alles ? 'alles ok' : 'FEHLER' + (errs.length ? ' – Seitenfehler: ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close(); process.exit(alles ? 0 : 1);
})();
