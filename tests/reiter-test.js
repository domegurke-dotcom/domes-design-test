// Reiter-Test (v585, PLAN-REITER.md K1; wird in K2/K3 erweitert): Können aus LK, Wachstum (Training, Turnier), Abnahme, Stand des Pferdes, Anforderung
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/reiter-test.js
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
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); return p; };
    const nah = (a, b, e = 0.011) => Math.abs(a - b) < e;
    // --- 1. alter Spielstand: Können aus der LK, einmal und fest ---
    delete spiel.reiter; spiel.lk = { dressur: 7, springen: 5, vielseitigkeit: 3, western: 1 };
    const K = Object.fromEntries(Object.keys(REITER_DISZ).map(g => [g, reiterKoennen(g)]));
    ok('Alt: LK 7/5/3/1 → Können 10/38/66/92', K.dressur === 10 && K.springen === 38 && K.vielseitigkeit === 66 && K.western === 92, JSON.stringify(K));
    ok('Alt: Rennen, Distanz, Gangpferde = 10', K.rennen === 10 && K.distanz === 10 && K.gangpferde === 10);
    spiel.lk.dressur = 2; ok('Danach fest (LK-Änderung ändert das Können nicht)', reiterKoennen('dressur') === 10);
    spiel.lk.dressur = 7;
    ok('Alle LK-Stufen 7…1', [7, 6, 5, 4, 3, 2, 1].map(l => REITER.alt[l]).join() === '10,22,38,52,66,80,92');
    // --- 2. Gruppen und Übungen ---
    ok('Gruppen je Disziplin', reiterGruppeVon('reining') === 'western' && reiterGruppeVon('trail') === 'western' && reiterGruppeVon('trabrennen') === 'rennen' && reiterGruppeVon('toelt') === 'gangpferde' && reiterGruppeVon('distanz') === 'distanz' && reiterGruppeVon('gelassenheit') === undefined);
    const U = k => Object.keys(REITER_DISZ).filter(g => REITER_DISZ[g].ueb[k]).join('+');
    ok('Übungen → Gruppen (Kondition: Vielseitigkeit+Rennen+Distanz; Ausritt: Rennen+Distanz; Trail: Western)', U('kondition') === 'vielseitigkeit+rennen+distanz' && U('ausritt') === 'rennen+distanz' && U('trailarbeit') === 'western' && U('galopptraining') === 'rennen' && U('toeltarbeit') === 'gangpferde' && U('passtraining') === 'gangpferde' && U('bodenarbeit') === '' && U('freiarbeit') === '' && U('spazieren') === '');
    ok('Alle Übungsschlüssel gibt es in UEBUNG', Object.values(REITER_DISZ).every(G => Object.keys(G.ueb).every(k => UEBUNG[k])));
    ok('Gelände-Arbeit zählt beim Rennen nur halb', REITER_DISZ.rennen.ueb.ausritt === 0.5 && REITER_DISZ.rennen.ueb.kondition === 0.5 && REITER_DISZ.rennen.ueb.galopptraining === 1);
    // --- 3. Wachstum mit Abnahme ---
    spiel.reiter.koennen.dressur = 10; const z0 = reiterWachsen('dressur', 1, 'training');
    ok('Zuwachs 1 bei Können 10 → 1 × (1 − 10/120) = 0,917', nah(z0, 1 - 10 / 120, 0.01) && nah(reiterKoennen('dressur'), 10.92, 0.02), String(reiterKoennen('dressur')));
    spiel.reiter.koennen.dressur = 90; const z1 = reiterWachsen('dressur', 1, 'turnier'); ok('Bei Können 90 nur 0,25', nah(z1, 0.25, 0.01), z1.toFixed(3));
    spiel.reiter.koennen.dressur = 99.9; reiterWachsen('dressur', 50, 'turnier'); ok('Deckel 100', reiterKoennen('dressur') <= 100 && reiterKoennen('dressur') >= 99.9);
    const vor = reiterKoennen('dressur'); reiterWachsen('dressur', 0, 'turnier'); reiterWachsen('dressur', -5, 'turnier'); ok('Nie weniger (0 und negative Zuwächse ändern nichts)', reiterKoennen('dressur') === vor);
    ok('Statistik je Herkunft', reiterErgaenzen().zuwachs.dressur.training > 0.9 && reiterErgaenzen().zuwachs.dressur.turnier > 0.2);
    // --- 4. Anforderung je Klasse und Stand des Pferdes ---
    const A = (disz, stufe, x = {}) => reiterAnforderung({ disz, stufe, ...x });
    ok('Klassen E/A/L/M/S = 10/30/50/70/85 (Western gleich)', [0, 1, 2, 3, 4].map(s => A('dressur', s)).join() === '10,30,50,70,85' && [0, 1, 2, 3, 4].map(s => A('reining', s)).join() === '10,30,50,70,85');
    ok('Wettbewerb/Gelassenheit 10', A('dressur', -1) === 10 && A('gelassenheit', -1) === 10);
    ok('Rennen: Ausgleich/Arabber 50, Verkaufsrennen 30, Anglo C/B 30/50, Trab/Pass 50', A('galopprennen', 2, { name: 'Ausgleich II (Vollblut)' }) === 50 && A('galopprennen', 0, { name: 'Araberrennen Kl. C' }) === 50 && A('galopprennen', 0, { verkauf: true, name: 'Verkaufsrennen (Vollblut)' }) === 30 && A('galopprennen', 0, { name: 'Anglo-Araber-Rennen Kl. C' }) === 30 && A('galopprennen', 1, { name: 'Anglo-Araber-Rennen Kl. B' }) === 50 && A('trabrennen', 0, {}) === 50 && A('passrennen', 0, {}) === 50);
    ok('Tölt Einsteiger/D/C/B/A = 10/30/50/70/85', [0, 1, 2, 3, 4].map(s => A('toelt', s)).join() === '10,30,50,70,85');
    ok('Distanz 30 km → 30 · 50 km → 50 · 70 km → 50 · 100 km → 70 · bis 20 km → 10', A('distanz', 0, { km: 30 }) === 30 && A('distanz', 1, { km: 50 }) === 50 && A('distanz', 2, { km: 70 }) === 50 && A('distanz', 3, { km: 100 }) === 70 && A('distanz', 0, { km: 20 }) === 10);
    const KF = (P, art) => reiterKlassenFaktor({ stufe: 0, ...P }, art);
    ok('Klassenfaktor: Hofturnier/Wettbewerb 0,5 · E 1 · A 1,25 · L 1,5 · M 1,75 · S 2', KF({ disz: 'dressur', stufe: 0 }, 'regional') === 1 && KF({ disz: 'dressur', stufe: 1 }, 'regional') === 1.25 && KF({ disz: 'dressur', stufe: 2 }, 'regional') === 1.5 && KF({ disz: 'dressur', stufe: 3 }, 'gross') === 1.75 && KF({ disz: 'dressur', stufe: 4 }, 'gross') === 2 && KF({ disz: 'dressur', stufe: 0 }, 'hof') === 0.5 && KF({ disz: 'dressur', stufe: -1 }, 'hof') === 0.5);
    const jung = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 2, name: 'Jung' });
    ok('Junges Pferd: Stand 0', reiterStand(jung, 'dressur') === 0 && reiterStand(jung, 'springen') === 0 && reiterStand(jung, 'western') === 0);
    const alt = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Alt' }); alt.disz = { springen: 80, gelaende: 80, western: 80 };
    const sSt = reiterStand(alt, 'springen'); ok('Ausgebildetes Pferd: Stand ist eine der Anforderungen (0/10/30/50/70/85)', [0, 10, 30, 50, 70, 85].includes(sSt), 'Springen ' + sSt);
    ok('Tölt-Gruppe bei Pferd ohne Tölt: Stand 0, kein Fehler', reiterStand(neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Ohne' }), 'gangpferde') === 0);
    // --- 5. Training selbst: +0,15 (voll, wenn Pferd nah am Können), ein Drittel sonst ---
    spiel.reiter.koennen.springen = 10; spiel.reiter.zuwachs = {};
    const hoch = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Hoch' });
    const orig = reiterStand; // Stand des Pferdes künstlich: über Können (voll) und weit darunter (Drittel)
    const k0 = reiterKoennen('springen'); reiterTrainiert(jung, 'springen');                                   // Stand 0, Können 10 → Abstand 10 → ein Drittel
    const dDritt = reiterKoennen('springen') - k0; ok('Pferd weit unter dem Können (Abstand ≥ 10): ein Drittel (0,05 × Abnahme)', nah(dDritt, 0.15 / 3 * (1 - 10 / 120) * proTag(1), 0.006), dDritt.toFixed(4));
    spiel.reiter.koennen.springen = 5; const k1 = reiterKoennen('springen'); reiterTrainiert(jung, 'springen');   // Stand 0, Können 5 → Abstand 5 → voll
    const dVoll = reiterKoennen('springen') - k1; ok('Pferd nahe am Können (Abstand < 10): voller Zuwachs 0,15', nah(dVoll, 0.15 * (1 - 5 / 120) * proTag(1), 0.006), dVoll.toFixed(4));
    const kk = reiterKoennen('dressur'); reiterTrainiert(jung, 'bodenarbeit'); reiterTrainiert(jung, 'spazieren'); ok('Bodenarbeit/Spazieren zählen nicht', reiterKoennen('dressur') === kk);
    spiel.reiter.koennen = { ...spiel.reiter.koennen, rennen: 10, distanz: 10, vielseitigkeit: 10 }; const ko = ['rennen', 'distanz', 'vielseitigkeit'].map(reiterKoennen); reiterTrainiert(jung, 'kondition');
    const dd = ['rennen', 'distanz', 'vielseitigkeit'].map((g, i) => reiterKoennen(g) - ko[i]);
    ok('Kondition wirkt in drei Gruppen: Rennen halb, Distanz und Vielseitigkeit voll', dd.every(x => x > 0) && nah(dd[0] * 2, dd[1], 0.002) && nah(dd[1], dd[2], 0.002), dd.map(x => x.toFixed(4)).join(' / '));
    // --- 6. trainieren() selbst vs. Mitarbeiter ---
    const ihr = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Trainiert' }); ihr.energie = 100; spiel.boxen[0].pferd = ihr; spiel.reiter.koennen.dressur = 10;
    const v1 = reiterKoennen('dressur'); let e1 = null; try { e1 = trainieren(ihr, 'longieren', 'reitplatz', null); } catch (er) { out.push('✗ trainieren selbst: ' + er.message); }
    ok('trainieren() selbst: dein Dressur-Können wächst', reiterKoennen('dressur') > v1, (reiterKoennen('dressur') - v1).toFixed(4));
    ihr.energie = 100; const v2 = reiterKoennen('dressur'); try { trainieren(ihr, 'longieren', 'reitplatz', { id: 'm1', name: 'Bereiter', wissen: { ruecken: 50 } }); } catch (er) { out.push('✗ trainieren Mitarbeiter: ' + er.message); }
    ok('trainieren() durch Mitarbeiter: dein Können bleibt', reiterKoennen('dressur') === v2);
    // --- 7. Turnier selbst geritten ---
    const T = (P, art, platz, pl) => { spiel.reiter.koennen[reiterGruppeVon(P.disz)] = 10; return reiterTurnier(P, art, platz, pl); };
    const f = 1 - 10 / 120;
    ok('Turnier Klasse L: Start 0,3 · Platzierung 0,8 · Sieg 1,5 (× 1,5 × Abnahme)', nah(T({ disz: 'dressur', stufe: 2 }, 'regional', 9, false), 0.3 * 1.5 * f) && nah(T({ disz: 'dressur', stufe: 2 }, 'regional', 3, true), 0.8 * 1.5 * f) && nah(T({ disz: 'dressur', stufe: 2 }, 'regional', 1, true), 1.5 * 1.5 * f));
    ok('Hofturnier halbiert, S verdoppelt', nah(T({ disz: 'dressur', stufe: 0 }, 'hof', 1, true), 1.5 * 0.5 * f) && nah(T({ disz: 'springen', stufe: 4 }, 'gross', 1, true), 1.5 * 2 * f));
    ok('Ausgeschieden zählt als Start (Distanz 50 km: Anforderung 50 → ×1,5)', nah(T({ disz: 'distanz', stufe: 1, km: 50 }, 'distanz', null, false), 0.3 * 1.5 * f));
    ok('Rennen/Tölt/Western in der richtigen Gruppe', (() => { T({ disz: 'trabrennen', stufe: 0 }, 'renntag', 1, true); T({ disz: 'toelt', stufe: 0 }, 'gangpferde', 1, true); T({ disz: 'trail', stufe: 1 }, 'regional', 1, true); return reiterKoennen('rennen') > 10 && reiterKoennen('gangpferde') > 10 && reiterKoennen('western') > 10; })());
    ok('Fohlenschau/unbekannte Disziplin: kein Zuwachs', reiterTurnier({ disz: 'gelassenheit', stufe: -1 }, 'hof', 1, true) === 0);
    // --- 8. turnierNacht: selbst geritten zählt, Jockey nicht ---
    const tn = (disz, jockey, name) => { const x = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); x.energie = 100; x.erfolge = []; spiel.boxen[0].pferd = x; spiel.boxen[0].tot = false;
      const g = reiterGruppeVon(disz); spiel.reiter.koennen[g] = 20; const t = { id: 'tt' + name, tag: spiel.tag, art: 'regional', name: 'Test', halle: false, nennung: [{ pid: x.id, prid: 'p1' }], pruef: [{ id: 'p1', disz, stufe: 1, name: disz + ' A', starter: 12, jockey }] };
      spiel.turniere = (spiel.turniere || []).concat([t]); x.turnier = { tid: t.id, tag: spiel.tag }; const v = reiterKoennen(g); turnierNacht(); return reiterKoennen(g) - v; };
    ok('turnierNacht selbst geritten (Dressur): Können wächst', tn('dressur', false, 'N1') > 0);
    ok('turnierNacht mit Jockey (Galopprennen): Können wächst nicht', tn('galopprennen', true, 'N2') === 0);
    return out;
  });
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
