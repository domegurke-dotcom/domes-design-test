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
    // ==================== K2 ====================
    // --- 9. Abstandsfaktor ---
    const AF = v => abstandFaktor(v);
    ok('Abstandsfaktor an den Stützpunkten: ≥2 1,2 · 1 1,1 · 0 1,0 · −1 0,8 · −2 0,5 · ≤−3 0,25', AF(3) === 1.2 && AF(2) === 1.2 && nah(AF(1), 1.1) && nah(AF(0), 1) && nah(AF(-1), 0.8) && nah(AF(-2), 0.5) && AF(-3) === 0.25 && AF(-5) === 0.25);
    ok('Dazwischen linear (0,5 → 1,05 · −0,5 → 0,9 · −1,5 → 0,65 · −2,5 → 0,375)', nah(AF(0.5), 1.05) && nah(AF(-0.5), 0.9) && nah(AF(-1.5), 0.65) && nah(AF(-2.5), 0.375));
    ok('Vertrauensverlust: v ≤ −2 → 0,3 · v ≤ −1 → 0,1 · sonst 0', abstandVertrauen(-2) === 0.3 && abstandVertrauen(-3) === 0.3 && abstandVertrauen(-1) === 0.1 && abstandVertrauen(-1.5) === 0.1 && abstandVertrauen(-0.9) === 0 && abstandVertrauen(1) === 0);
    const tp = (name, fest) => { const x = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); x.reiterStandFest = fest; return x; };
    const Q = tp('Quint', { dressur: 50 });
    const kf = (g, v) => () => v;
    ok('reiterAbstand: Können 10, Stand 50 → v = −2, ×0,5', (a => nah(a.v, -2) && nah(a.faktor, 0.5) && a.g === 'dressur')(reiterAbstand(Q, 'longieren', kf('dressur', 10))));
    ok('reiterAbstand: Können 90, Stand 50 → v = 2, ×1,2', nah(reiterAbstand(Q, 'longieren', kf('dressur', 90)).faktor, 1.2));
    ok('Bodenarbeit/Freiarbeit/Spazieren: kein Abstand', reiterAbstand(Q, 'bodenarbeit', kf('', 10)) === null && reiterAbstand(Q, 'spazieren', kf('', 10)) === null);
    const Kon = tp('Kon', { vielseitigkeit: 30, rennen: 70, distanz: 10 }); ok('Kondition: Gruppe, in der das Pferd am weitesten ist (Rennen)', reiterUebGruppe(Kon, 'kondition').g === 'rennen');
    ok('Können Mitarbeiter = Rücken (+10 im Ausbildungsstall, höchstens 95)', reiterKoennenMa({ wissen: { ruecken: 40 } }) === 40 + (vorteil('ausbildung') ? 10 : 0) && reiterKoennenMa({ wissen: { ruecken: 100 } }) === 95 && reiterKoennenMa({}) === (vorteil('ausbildung') ? 10 : 0));
    // --- 10. Training: Faktor, Vertrauen, Bericht ---
    const training = (fest, koennen, ma) => { const x = tp('T' + Math.random(), fest); x.energie = 100; x.werte.ist.vertrauen = 50; spiel.boxen[0].pferd = x; spiel.reiter.koennen.dressur = koennen; spiel.reiter.hinw = 0;
      const e = trainieren(x, 'longieren', 'reitplatz', ma || null); return { e, x, sk: Object.values(e.skPlus || {}).reduce((a, b) => a + b, 0), vt: x.werte.ist.vertrauen }; };
    const T1 = training({ dressur: 50 }, 10), T2 = training({ dressur: 50 }, 90), T3 = training({ dressur: 50 }, 50), T4 = training({ dressur: 10 }, 50);
    ok('Reiter 2 Klassen weiter lernt mehr als gleich, gleich mehr als Pferd 2 Klassen weiter (Ausbildungsskala)', T2.sk > T3.sk && T3.sk > T1.sk, `${T2.sk.toFixed(3)} > ${T3.sk.toFixed(3)} > ${T1.sk.toFixed(3)}`);
    ok('Verhältnis weit/gleich etwa 0,5 (Pferd 2 weiter, Können 10 vs. 50: 0,5 gegen 1,0 – Wetter etc. gleich)', nah(T1.sk / T3.sk, 0.5, 0.12), (T1.sk / T3.sk).toFixed(3));
    ok('Vertrauen sinkt bei v ≤ −2 um etwa 0,3 × proTag (Zufall der Vorlieben ±0,1)', T1.vt <= 50 - 0.3 * proTag(1) + 0.11 && T1.vt >= 50 - 0.3 * proTag(1) - 0.15, T1.vt.toFixed(2));
    ok('Reiter weiter oder gleich: der Abstand kostet kein Vertrauen, das Pferd weiter als der Reiter schon', abstandVertrauen(reiterAbstand(tp('x', { dressur: 50 }), 'longieren', kf('dressur', 90)).v) === 0 && abstandVertrauen(reiterAbstand(tp('y', { dressur: 50 }), 'longieren', kf('dressur', 50)).v) === 0 && T2.vt > T1.vt);
    ok('Trainingsbericht nennt „weiter als du – das bremst“ nur beim zu weiten Pferd', T1.e.hinweise.some(h => /weiter als du/.test(h)) && !T3.e.hinweise.some(h => /weiter als/.test(h)));
    const Mq = { id: 'mq', name: 'Frieda', typ: 'bereiter', wissen: { ruecken: 20 } }, Ms = { id: 'ms', name: 'Hans', typ: 'bereiter', wissen: { ruecken: 90 } };
    const TM1 = training({ dressur: 50 }, 10, Mq), TM2 = training({ dressur: 50 }, 10, Ms);
    ok('Mitarbeiter: schwacher Bereiter (Können 20) lernt Pferd Stand 50 weniger als starker (90)', TM2.sk > TM1.sk * 1.5, `${TM2.sk.toFixed(3)} vs ${TM1.sk.toFixed(3)}`);
    ok('Dein Können wächst bei Mitarbeiter-Training nicht', (() => { spiel.reiter.koennen.dressur = 10; const x = tp('Mz', { dressur: 50 }); x.energie = 100; spiel.boxen[0].pferd = x; trainieren(x, 'longieren', 'reitplatz', Ms); return reiterKoennen('dressur') === 10; })());
    // --- 11. Hinweis „weiter als du“ (einmal je Pferd und Gruppe) ---
    spiel.tippsAus = false; spiel.tipps = {}; spiel.tippWarte = []; const H1 = tp('Hinweisa', { dressur: 50, springen: 50 });
    ok('Erstes Training mit zu weitem Pferd: Hinweis wird vorgemerkt', reiterBesserMerken(H1, 'dressur') === true && spiel.tippWarte.includes('reiterBesser'));
    ok('Text nennt das Pferd und Reitunterricht', /Hinweisa/.test(hinweisText(HINWEISE.reiterBesser)) && /Reitunterricht/.test(hinweisText(HINWEISE.reiterBesser)));
    ok('Nicht noch einmal für dasselbe Pferd und dieselbe Gruppe', reiterBesserMerken(H1, 'dressur') === false);
    ok('Andere Gruppe desselben Pferdes: nochmal', (() => { spiel.tipps = { reiterBesser: 1 }; const r = reiterBesserMerken(H1, 'springen'); return r === true && !spiel.tipps.reiterBesser; })());
    ok('Training mit zu weitem Pferd: Merker am Pferd, zweites Training kein neuer Hinweis', (() => { const x = tp('Hinweisb', { dressur: 50 }); x.energie = 100; spiel.reiter.koennen.dressur = 10; spiel.tippWarte = []; spiel.tipps = {}; spiel.boxen[0].pferd = x; trainieren(x, 'longieren', 'reitplatz', null); const a = spiel.tippWarte.length; x.energie = 100; trainieren(x, 'dressur', 'reitplatz', null); return a === 1 && spiel.tippWarte.length === 1 && x.hinw.besser.dressur; })());
    ok('Bereiter-Training löst den Hinweis nicht aus', (() => { const x = tp('Hinweisc', { dressur: 50 }); x.energie = 100; spiel.tippWarte = []; spiel.boxen[0].pferd = x; trainieren(x, 'longieren', 'reitplatz', Mq); return spiel.tippWarte.length === 0; })());
    // --- 12. Kauf-Zeile ---
    const Mk = tp('Marktpferd', { dressur: 70 }); spiel.reiter.koennen.dressur = 10;
    ok('Kauf-Zeile: Pferd weiter als du → „Dieses Pferd ist weiter als du“, nur Markt-Orte', /weiter als du/.test(JSON.stringify(reiterKaufZeile(Mk))) && reiterKaufZeile(tp('Jung', {})).length === 0);
    // --- 13. Reitunterricht ---
    spiel.admin = false; spiel.geld = 1000; spiel.reiter.stunde = {}; spiel.reiter.koennen.dressur = 20; spiel.reiter.zuwachs = {};
    const g0 = spiel.geld, k20 = reiterKoennen('dressur'), U1 = unterrichtNehmen('dressur', null);
    ok('Extern: 60 € abgebucht, Können +1,6 × Abnahme bei Können unter 30 (doppelt)', spiel.geld === g0 - 60 && nah(reiterKoennen('dressur') - k20, 1.6 * (1 - 20 / 120), 0.01), (reiterKoennen('dressur') - k20).toFixed(3));
    ok('Höchstens eine Stunde je Tag und Gruppe', !!unterrichtNehmen('dressur', null).fehler && spiel.geld === g0 - 60);
    spiel.reiter.koennen.springen = 40; const k40 = reiterKoennen('springen'); unterrichtNehmen('springen', null); ok('Können 40: +0,8 × Abnahme (nicht doppelt)', nah(reiterKoennen('springen') - k40, 0.8 * (1 - 40 / 120), 0.01));
    spiel.reiter.koennen.western = 60; const g1 = spiel.geld, U2 = unterrichtNehmen('western', null);
    ok('Ab Können 60: Hinweis statt Stunde, nichts abgebucht', /Turnieren und mit schwierigeren Pferden/.test(U2.fehler) && spiel.geld === g1 && reiterKoennen('western') === 60);
    spiel.reiter.koennen.rennen = 10; spiel.geld = -1990; ok('Zu wenig Geld: keine Stunde', !!unterrichtNehmen('rennen', null).fehler && reiterKoennen('rennen') === 10);
    spiel.geld = 1000; const lehr = { id: 'l1', name: 'Frau Berger', typ: 'bereiter' }; const g2 = spiel.geld; spiel.reiter.koennen.distanz = 10; const U3 = unterrichtNehmen('distanz', lehr);
    ok('Eigener Bereiter: kostenlos, sein Trainingstag entfällt (unterrichtTag)', spiel.geld === g2 && lehr.unterrichtTag === spiel.tag && U3.x > 0);
    ok('Statistik „Unterricht“ im Adminmodus', reiterErgaenzen().zuwachs.dressur.unterricht > 1);
    ok('Dialog öffnet ohne Fehler', (() => { try { unterrichtDialog(); const ok1 = !document.getElementById('dlg').hidden && /Reitunterricht/.test(document.getElementById('dlgInhalt').innerHTML); document.getElementById('dlg').hidden = true; return ok1; } catch (er) { return er.message; } })());
    ok('Reiter-Seite hat den Knopf Reitunterricht, keine +4 %-Spalte mehr', (() => { const h = reiterHTML(); return /id="ruKnopf"/.test(h) && !/<th>Training<\/th>/.test(h); })());
    ok('Ort-Reiter-Satz: Pferd weiter → „bremst“, Reiter weiter → „gutes Training“', (() => { spiel.reiter.koennen.dressur = 10; const a = reiterSatz(tp('S1', { dressur: 50 }), null); spiel.reiter.koennen.dressur = 90; const b2 = reiterSatz(tp('S2', { dressur: 30 }), null), c = reiterSatz(tp('S3', { dressur: 85 }), null); return /bremst/.test(a) && /gutes Training/.test(b2) && c === ''; })());
    // ==================== K3 ====================
    spiel.mitarbeiter = []; spiel.admin = false; spiel.geld = 1e5;
    const RF = (k, P) => reiterTurnierFaktor(k, P), PL = { disz: 'dressur', stufe: 2 };   // Anforderung 50
    ok('Turnier-Reiterfaktor: q = 0,2 → 0,84 · q = 1 → 1,00 · q = 2 → 1,08 · q = 3 → 1,08', nah(RF(10, PL), 0.84) && nah(RF(50, PL), 1) && nah(RF(100, PL), 1.08) && nah(RF(150, PL), 1.08));
    ok('Anforderung mindestens 10 (Wettbewerb: Können 10 → ×1,0)', nah(RF(10, { disz: 'dressur', stufe: -1 }), 1));
    const tp3 = (name, fest) => { const x = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name }); x.reiterStandFest = fest || {}; x.erfolge = []; return x; };
    const T0 = (art, Pr) => ({ id: 'k3' + Math.random(), tag: spiel.tag + 3, art, name: 'Testturnier', halle: false, nennung: [], pruef: [Pr] });
    const stufeSetzen = s => { spiel.stufenAn = true; spiel.spieler = spiel.spieler || {}; spiel.spieler.stufe = s; };
    const pM = { id: 'pm', disz: 'dressur', stufe: 3, name: 'Dressur Kl. M', starter: 12 }, pS = { id: 'ps', disz: 'dressur', stufe: 4, name: 'Dressur Kl. S', starter: 12 };
    spiel.lk.dressur = 7; spiel.reiter.koennen.dressur = 10;
    stufeSetzen('anf'); ok('Anfänger: nur „Du selbst“ (keine Reiterwahl)', reiterOptionen(tp3('A'), T0('regional', pM), pM).map(o => o.id).join() === 'du');
    stufeSetzen('exp'); const O1 = reiterOptionen(tp3('B'), T0('gross', pM), pM);
    ok('Ohne festen Bereiter: Du, Bereiter nach Bedarf (70 €), Profi (150 €)', O1.map(o => o.id).join() === 'du,bedarf,profi' && O1[1].kosten === 70 && O1[2].kosten === 150 && O1[2].koennen === 85);
    ok('Startrecht: du mit LK 7 nicht in M · Bereiter (60) in M ja, in S nicht · Profi in S ja', !!O1[0].ok && !O1[1].ok && !!reiterOptionen(tp3('C'), T0('gross', pS), pS)[1].ok && !reiterOptionen(tp3('C'), T0('gross', pS), pS)[2].ok);
    spiel.mitarbeiter = [{ id: 'br1', name: 'Bernd', typ: 'bereiter', ab: jzJetzt() - 1, bis: null, wissen: { ruecken: 70 }, eig: [], zufr: 80 }];
    const O2 = reiterOptionen(tp3('D'), T0('gross', pM), pM); ok('Mit festem Bereiter: er statt „nach Bedarf“, kostenlos', O2.map(o => o.id).join() === 'du,m:br1,profi' && O2[1].kosten === 0 && O2[1].koennen === reiterKoennenMa(spiel.mitarbeiter[0]));
    spiel.mitarbeiter = [];
    const tm = T0('gross', pM), pm1 = tp3('E'); pm1.pflege.impf = spiel.tag;
    ok('nennSperre: LK reicht nicht, aber ein anderer Reiter darf → nennbar (Experte)', !/LK/.test(nennSperre(pm1, tm, pM)), nennSperre(pm1, tm, pM));
    stufeSetzen('fort'); ok('Fortgeschritten: Reiterwahl ebenso', !/LK/.test(nennSperre(pm1, tm, { ...pM, stufe: 2, id: 'pl', name: 'Dressur Kl. L' })));
    stufeSetzen('anf'); ok('Anfänger: LK-Sperre bleibt', /LK|Klasse|nur/.test(nennSperre(pm1, tm, pM)), nennSperre(pm1, tm, pM)); stufeSetzen('exp');
    const rP = { id: 'rr', disz: 'galopprennen', stufe: 1, name: 'Ausgleich III (Vollblut)', starter: 10, nenn: 80, jockey: true, rassen: ['vollblut'] }, rT = T0('renntag', rP);
    spiel.reiter.koennen.rennen = 20; let RO = reiterOptionen(tp3('F'), rT, rP);
    ok('Rennen: Jockey und „selbst“ (erst ab Können 30)', RO.map(o => o.id).join() === 'jockey,du' && /30/.test(RO[1].ok));
    spiel.reiter.koennen.rennen = 35; RO = reiterOptionen(tp3('F'), rT, rP); ok('Rennen selbst ab Können 30: spart das Reitgeld', !RO[1].ok && RO[1].kosten === -REITGELD * (vorteil('renn') ? 0.5 : 1));
    ok('Nenn-Zeile: reicht / knapp / fehlt', (() => { spiel.reiter.koennen.dressur = 60; const a = reiterNennZeile(tp3('G'), PL); spiel.reiter.koennen.dressur = 44; const b2 = reiterNennZeile(tp3('G'), PL); spiel.reiter.koennen.dressur = 10; const c = reiterNennZeile(tp3('G'), PL); return /reicht/.test(a) && /knapp/.test(b2) && /fehlt/.test(c); })());
    // Nennen über die Oberfläche: Reiter wählen → Profi
    { const x = tp3('Nennpferd', { dressur: 70 }); x.pflege.impf = spiel.tag; spiel.boxen[0].pferd = x; spiel.boxen[0].tot = false; delete spiel.boxen[0].fohlen;
      const Pu = { id: 'pu', disz: 'dressur', stufe: 3, name: 'Dressur Kl. M', starter: 14 }, tu = T0('gross', Pu); spiel.turniere = [tu]; window.turnierKalender = () => spiel.turniere;
      const g0 = spiel.geld; turnierDialog(x, () => {}); const kn = document.querySelector(`[data-tnennen="${tu.id}:pu"]`);
      if (!kn) ok('Nennen-Knopf da (Reiterwahl über LK)', false, document.getElementById('dlgInhalt').textContent.slice(0, 200));
      else { kn.click(); const knoepfe = [...document.querySelectorAll('#dlgKnoepfe button')].map(b => b.textContent);
        ok('Reiterwahl-Fenster mit Profi (du darfst nicht: LK)', /Wer reitet/.test(document.getElementById('dlgInhalt').textContent) && knoepfe.some(k => /Profi/.test(k)) && !knoepfe.some(k => /Selbst/.test(k)), knoepfe.join(' | '));
        [...document.querySelectorAll('#dlgKnoepfe button')].find(b => /Profi/.test(b.textContent)).click();
        const n = tu.nennung[0]; ok('Genannt mit Profi: Nenngeld + 150 € abgebucht', !!n && n.reiter === 'profi' && n.geld === nenngeld(tu, Pu) + 150 && nah(g0 - spiel.geld, n.geld, 0.01), JSON.stringify(n));
        document.getElementById('dlg').hidden = true; } }
    // Warnfenster 8e und Brief 8c
    { const x = tp3('Warnpferd', { dressur: 70 }); spiel.reiter.koennen.dressur = 20; let w = 0; reiterNennWarnung(x, PL, { id: 'du' }, () => w++, () => {});
      const offen = !document.getElementById('dlg').hidden && /weiter als du/.test(document.getElementById('dlgInhalt').textContent); document.getElementById('dlg').hidden = true;
      reiterNennWarnung(x, PL, { id: 'du' }, () => w++, () => {}); ok('Nennen-Warnung „weiter als du“ einmal je Pferd und Disziplin, danach direkt weiter', offen && w === 1);
      let w2 = 0; reiterNennWarnung(tp3('Warn2', { dressur: 70 }), PL, { id: 'profi' }, () => w2++, () => {}); ok('Mit anderem Reiter keine Warnung', w2 === 1 && document.getElementById('dlg').hidden); }
    { const x = tp3('Rueck', { dressur: 70 }); spiel.reiter.koennen.dressur = 20; const n0 = spiel.post.length; reiterRueckBrief(x); const n1 = spiel.post.length; reiterRueckBrief(x);
      ok('Brief vom Ausbildungsstall „… ist jetzt weiter als du“, einmal', n1 === n0 + 1 && spiel.post.length === n1 && /weiter als/.test(spiel.post[0].betreff) && /Klasse M/.test(spiel.post[0].text), spiel.post[0].betreff); }
    ok('Ausbildungsstall anmelden: Warnung bei wenig Können, keine bei viel', (() => { spiel.reiter.koennen.dressur = 20; const a = ausbWarnung(tp3('Aw')); spiel.reiter.koennen.dressur = 75; const b2 = ausbWarnung(tp3('Aw2')); return /erst/.test(a) && /LK 4/.test(a) && b2 === ''; })());
    // Turnier-Nacht: Profi reitet – Erfolg fürs Pferd, nichts für dich
    { const x = tp3('Profipferd'); x.energie = 100; spiel.boxen[0].pferd = x; const Pq = { id: 'pq', disz: 'dressur', stufe: 1, name: 'Dressur Kl. A', starter: 8 }, tq = { id: 'tq', tag: spiel.tag, art: 'regional', name: 'Profiturnier', halle: false, nennung: [{ pid: x.id, prid: 'pq', reiter: 'profi', reiterName: 'Profi von außen' }], pruef: [Pq] };
      spiel.turniere = [tq]; x.turnier = { tid: 'tq', tag: spiel.tag }; spiel.reiter.koennen.dressur = 20; spiel.lkErfolge = {}; turnierNacht();
      ok('Profi geritten: Erfolg beim Pferd, dein Können und deine LK-Erfolge bleiben', x.erfolge.length === 1 && reiterKoennen('dressur') === 20 && !(spiel.lkErfolge.dressur && spiel.lkErfolge.dressur.plaz.some(v => v)) && /geritten von Profi/.test(spiel.post[0].text)); }
    // Bereiter reitet: trainiert an dem Tag nicht
    { spiel.mitarbeiter = [{ id: 'br2', name: 'Berta', typ: 'bereiter', ab: jzJetzt() - 1, bis: null, wissen: { ruecken: 60, verhalten: 50, huf: 40 }, eig: [], zufr: 80, turnierTag: spiel.tag }];
      const x = tp3('Bereitertag'); x.energie = 100; x.pflege.gesundheit = 100; spiel.boxen[0].pferd = x; spiel.boxen.slice(1).forEach(b => { b.pferd = null; }); const vor = x.trainHeute && x.trainHeute.tag === spiel.tag ? x.trainHeute.liste.length : 0; mitarbeiterTag();
      ok('Bereiter mit Turniertag trainiert an dem Tag nicht', (x.trainHeute && x.trainHeute.tag === spiel.tag ? x.trainHeute.liste.length : 0) === vor); spiel.mitarbeiter = []; }
    // LK-Aufstieg wartet auf Können
    { spiel.lk.springen = 7; spiel.reiter.koennen.springen = 10; spiel.lkErfolge = {}; spiel.tippsAus = false; spiel.tipps = {}; spiel.tippWarte = [];
      const m1 = lkErfolg('springen', 0, 2); ok('Erfolge reichen (1 Platzierung), Können 10 < 15: kein Aufstieg, Blase vorgemerkt', m1 === '' && spiel.lk.springen === 7 && spiel.tippWarte.includes('lkWartet'));
      spiel.reiter.koennen.springen = 16; const m2 = lkErfolg('springen', 0, 3); ok('Mit Können 16: Aufstieg auf LK 6 (Erfolge haben sich gesammelt)', /LK 6/.test(m2) && spiel.lk.springen === 6); }
    // --- 14. Bereiter trainiert nach dem Unterricht am nächsten Morgen nicht ---
    ok('Bereiter, der gestern dich unterrichtet hat, trainiert heute kein Pferd – sonst schon', (() => {
      try { spiel.mitarbeiter = [{ id: 'bt1', name: 'Berta', typ: 'bereiter', ab: jzJetzt() - 1, bis: null, wissen: { ruecken: 60, verhalten: 50, huf: 40 }, eig: [], zufr: 80 }]; const m = spiel.mitarbeiter[0];
        const x = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Morgenpferd' }); x.energie = 100; x.pflege.gesundheit = 100; spiel.boxen[0].pferd = x; spiel.boxen[0].tot = false; spiel.boxen.slice(1).forEach(b => { b.pferd = null; });
        m.unterrichtTag = spiel.tag - 1; const vorMit = x.trainHeute && x.trainHeute.tag === spiel.tag ? x.trainHeute.liste.length : 0; mitarbeiterTag();
        const nachMit = x.trainHeute && x.trainHeute.tag === spiel.tag ? x.trainHeute.liste.length : 0;
        const ohne = nachMit === vorMit;
        delete m.unterrichtTag; x.energie = 100; mitarbeiterTag(); const danach = x.trainHeute && x.trainHeute.tag === spiel.tag ? x.trainHeute.liste.length : 0;
        return ohne && danach > nachMit ? true : `ohne Unterricht ${nachMit - vorMit} Einheiten, danach ${danach - nachMit}`;
      } catch (er) { return er.message; } })());
    return out;
  });
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
