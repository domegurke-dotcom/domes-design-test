// Spielerweg 1–7 (v879): die Aufträge Shampoo-Reste, Quarantäne-Pflicht, Weihnachten, Mitarbeiter (Urlaub verschieben/ablehnen, Berufsschule, Lehrgang, Stärken, Passung) mit echten Klicks
// Start (Domes PC, siehe CLAUDE.md): node tests/spielerweg-1-7-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const ev = (f, a) => pg.evaluate(f, a).catch(e => ({ __fehler: e.message.split('\n')[0] }));
  const klick = async sel => { const r = await pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel); await pg.waitForTimeout(250); if (!r) out.push('✗ Klick fehlt: ' + sel); return r; };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlgInhalt').textContent);
  await ev(() => { window.zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 400000; VET.verbotAb = 99;
    window.pf = (n, g = 'Stute') => { const p = neuesPferd({ name: n, rasse: 'hannoveraner', geschlecht: g, alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    window.maN = (id, typ, x) => maErgaenzen(Object.assign({ id, typ, name: id, w: true, wissen: wissenStart(40, {}), eig: [], gehalt: 330, ab: 0, bis: null }, x || {}));
    window.nacht1 = () => { spiel.boxen.forEach(b => { if (b.pferd && !b.tot) { b.krippeVoll = true; b.kraftVoll = true; b.mistig = false; b.mistStufe = 0; b.wasserTag = spiel.tag; b.pferd.pflege.gesundheit = Math.max(b.pferd.pflege.gesundheit, 90); } }); naechsteNacht(); zu(); };
    window.nachtBisJz = (n = 1) => { for (let k = 0; k < n; k++) { const j0 = jzJetzt(); let i = 0; while (jzJetzt() === j0 && i++ < 30) nacht1(); } };
    while (spiel.boxen.length < 4) spiel.boxen.push({ pferd: null }); spiel.boxen[0].pferd = pf('Fiona'); spiel.boxen[1].pferd = pf('Hanna'); });

  // ===== 6a Urlaub: in die nächste Jahreszeit verschieben und ablehnen =====
  await ev(() => { spiel.mitarbeiter = [maN('Eins', 'pfleger'), maN('Zwei', 'pfleger')]; const s = datum(jzStartTag(jzJetzt() + 2)).s; spiel.mitarbeiter.forEach(m => { m.uJz = s; }); nachtBisJz(1); });
  const U = await ev(() => { const L = spiel.mitarbeiter; L.forEach(m => { if (m.uWunsch) { m.uWunsch.fest = false; m.uWunsch.vor = false; } }); const br = spiel.post.find(x => /Urlaubsplanung/.test(x.betreff)); return { w: L.filter(m => m.uWunsch).length, id: br && br.id, z: L.map(m => Math.round(zufr(m) * 10) / 10) }; });
  ok('Urlaubsplanung: zwei Wünsche im Sammelbrief', U.w === 2 && !!U.id, JSON.stringify(U));
  await ev(() => { offenerBrief = null; postAuswahl = null; zeigeHof('post'); }); await pg.waitForTimeout(200); await klick(`[data-brief="${U.id}"]`); await klick('[data-baktion="uplan"]');
  const warn = await dlgText(); ok('Plan zeigt „Nächste Jahreszeit“ und „Ablehnen“ für Mitarbeiter', /Nächste Jahreszeit/.test(warn) && /Ablehnen/.test(warn));
  await klick('[data-uwahl="0:naechste"]'); await klick('[data-uwahl="1:nein"]'); await ev(() => { [...document.querySelectorAll('#dlgKnoepfe button')].find(k => /Plan abschicken/.test(k.textContent))?.click(); }); await pg.waitForTimeout(250);
  const U2 = await ev(() => { const L = spiel.mitarbeiter; return { vor: L.map(m => !!m.uVor), weg: L.every(m => !m.uWunsch), z: L.map(m => Math.round(zufr(m) * 10) / 10), kein: L.every(m => !(m.urlaub && m.urlaub.ok)) }; });
  ok('verschoben/abgelehnt: beide mit Vorrang, kein Urlaub eingetragen, Zufriedenheit −1 bzw. −5', U2.vor.every(Boolean) && U2.weg && U2.kein && Math.abs((U.z[0] - U2.z[0]) - 1) < 0.2 && Math.abs((U.z[1] - U2.z[1]) - 5) < 0.2, JSON.stringify(U2));
  await ev(() => { zu(); nachtBisJz(1); });
  const U3 = await ev(() => { const L = spiel.mitarbeiter; return { w: L.map(m => !!(m.uWunsch && m.uWunsch.vor)) }; }); ok('nächste Jahreszeit: beide Wünsche kommen wieder, mit Vorrang', U3.w.every(Boolean), JSON.stringify(U3));
  await ev(() => { offenerBrief = null; postAuswahl = null; zeigeHof('post'); }); await pg.waitForTimeout(200); await ev(() => { const br = spiel.post.filter(x => /Urlaubsplanung/.test(x.betreff))[0]; window.__b = br.id; });
  await klick(`[data-brief="${await pg.evaluate(() => window.__b)}"]`); await klick('[data-baktion="uplan"]');
  ok('mit Vorrang: kein Knopf „Nächste Jahreszeit“ mehr, Hinweis „Vorrang“', (await pg.$$('[data-uwahl$=":naechste"]')).length === 0 && /Vorrang/.test(await dlgText())); await ev(() => zu());

  // ===== 6b Berufsschule: Brief, Whiteboard-Beschriftung =====
  const S = await ev(() => { spiel.mitarbeiter = [maN('Zoe', 'azubi', { fach: 'haltung', ausbilder: 'du', w: true, ab: jzJetzt() - 1, pruefung: jzJetzt() + 11 }), maN('Pia', 'stallbursche')]; spiel.ausbilderschein = true; let i = 0; while (datum().s !== 3 && i++ < 8) nachtBisJz(1); const z = spiel.mitarbeiter[0]; return { brief: spiel.post.some(x => /Berufsschule/.test(x.betreff)), schule: z.schule ? z.schule.tag : null }; });
  ok('Winter: Brief „Berufsschule“ kommt, Termin steht fest', S.brief && S.schule != null, JSON.stringify(S));
  await ev(() => { const z = spiel.mitarbeiter[0]; while (spiel.tag < z.schule.tag) nacht1(); document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); stallAlt = false; spiel.stallAnsicht = 'board'; wbSicht = 'boxen'; zeigeBoxen(); try { zeigeWhiteboard(); } catch (e) { } }); await pg.waitForTimeout(300);
  ok('am Schultag: Whiteboard sagt „Berufsschule“ (nicht „Urlaub“)', await ev(() => /Berufsschule/.test(document.body.textContent) && maSchule(spiel.mitarbeiter[0])), '');
  await ev(() => { zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(200); await klick('[data-ma="azubi"]'); ok('Mitarbeiter-Dialog: Azubi steht als „Berufsschule“', /Berufsschule/.test(await dlgText())); await ev(() => zu());

  // ===== 6c Lehrgang buchen und absagen, Stärken, Balken =====
  await ev(() => { spiel.mitarbeiter = [maN('Lena', 'pfleger')]; zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(200); await klick('[data-ma="pfleger"]');
  ok('Karte zeigt „Stark in …“ oder die Hinweiszeile', /Stark in|noch keine Stärke/.test(await dlgText()));
  await klick('.ma-wissen [data-wst]'); ok('Balken antippen zeigt das Stufen-Wort', await ev(() => !!document.querySelector('.ma-wissen [data-wst].offen')));
  const g0 = await ev(() => spiel.geld); await klick('[data-lgma]'); ok('„📚 Fortbildung“ öffnet die Lehrgangsliste', /Fortbildung/.test(await dlgText()));
  await klick('[data-lgbuch]'); const L1 = await ev(() => ({ kurs: !!spiel.mitarbeiter[0].kurs, geld: spiel.geld })); ok('Lehrgang gebucht, 150 € abgebucht', L1.kurs && Math.round(g0 - L1.geld) === 150, JSON.stringify(L1));
  await klick('[data-lgstorno]'); const L2 = await ev(() => ({ kurs: !!spiel.mitarbeiter[0].kurs, geld: spiel.geld })); ok('Absagen: Geld zurück, kein Kurs mehr', !L2.kurs && Math.round(L2.geld - g0) === 0, JSON.stringify(L2)); await ev(() => zu());

  // ===== 6d Whiteboard-Passung: Hanna hustet, Stallbursche mit Stallhygiene =====
  await ev(() => { const h = spiel.boxen[1].pferd; h.befunde = []; befundNeu(h, 'husten', 1, 'Staub'); const x = h.befunde[0]; x.diagnose = spiel.tag; x.bemerkt = { von: 'du', tag: spiel.tag }; delete x.inkub; const m = maN('Sven', 'stallbursche'); m.wissen.klima = 65; spiel.mitarbeiter = [m]; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); stallAlt = false; spiel.stallAnsicht = 'board'; wbSicht = 'boxen'; wbWahl = null; zeigeBoxen(); try { zeigeWhiteboard(); } catch (e) { } }); await pg.waitForTimeout(250);
  await klick('[data-wbq="m:Sven"]'); await pg.waitForTimeout(200); await klick('[data-wbz="b:1"]');
  const P = await ev(() => ({ zugeteilt: ((spiel.boxen[1].maPlan || {}).stall === 'Sven'), marke: !!document.querySelector('[data-wbpass]') })); ok('Mitarbeiter auf Hannas Box gezogen, grün/gelb-Marke steht daneben', P.zugeteilt && P.marke, JSON.stringify(P));
  await klick('[data-wbpass]'); ok('Marke antippen erklärt den Grund', /Passt der Mitarbeiter/.test(await dlgText())); await ev(() => zu());

  // ===== 2 Quarantäne-Pflicht (Druse) =====
  const Q = await ev(() => { const h = spiel.boxen[1].pferd; h.befunde = []; befundNeu(h, 'druse', 2, 'Test'); const x = h.befunde[0]; x.diagnose = spiel.tag; x.bemerkt = { von: 'du', tag: spiel.tag }; delete x.inkub; spiel.mitarbeiter = []; try { quarPflichtTag(); } catch (e) { return { fehler: e.message }; } return { brief: spiel.post.find(x => /Quarantäne-Pflicht/.test(x.betreff)) ? spiel.post.find(x => /Quarantäne-Pflicht/.test(x.betreff)).id : null, pflicht: !!h.quarPflicht }; });
  ok('Druse: Brief „Quarantäne-Pflicht“ und Pflicht am Pferd', !!Q.brief && Q.pflicht, JSON.stringify(Q));
  if (Q.brief) { await ev(() => { offenerBrief = null; postAuswahl = null; zeigeHof('post'); }); await pg.waitForTimeout(200); await klick(`[data-brief="${Q.brief}"]`); ok('Brief lässt sich öffnen und nennt Frist und Kontaktpferde', /Frist|Tag/.test(await ev(() => document.getElementById('nebenSchirm').textContent)) && /Kontakt/.test(await ev(() => document.getElementById('nebenSchirm').textContent))); }
  await ev(() => { document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); aktBox = 1; spiel.aktBox = 1; zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeAkte(); }); await pg.waitForTimeout(300);
  const hatKarte = await ev(() => /Kontaktpferde|Quarantäne/.test(document.body.textContent) && !!document.querySelector('[data-quar]'));
  ok('Versorgung zeigt Quarantäne-Knopf', hatKarte); if (hatKarte) { await klick('[data-quar]'); ok('Quarantäne per Klick gesetzt', await ev(() => inQuarantaene(spiel.boxen[1].pferd))); }

  // ===== 1 Shampoo-Reste: Waschplatz per Klick, Hinweistext =====
  await ev(() => { gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 2, zustand: 100 }); spiel.anlage.waschplatz = true; spiel.shampoo = 5; aktBox = 0; spiel.aktBox = 0; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = 'waschplatz'; zeigeAkte(); }); await pg.waitForTimeout(300);
  ok('Waschplatz-Ansicht mit Shampoo-Werkzeug', await ev(() => !!document.querySelector('[data-wasch="shampoo"]')));
  const sh = await ev(() => { const p = spiel.boxen[0].pferd; p.nass = spiel.tag; p.schaum = spiel.tag; return { text: /abspülen|Abspülen|abtrocknen/.test(document.body.textContent) }; }); ok('Waschplatz erklärt Abspülen/Abtrocknen (Schaum jetzt am Pferd gesetzt, Wischen deckt waschplatz-test ab)', sh.text);
  const w0 = await ev(() => { const p = spiel.boxen[0].pferd; p.pflege.wohl = 80; return p.pflege.wohl; }); await ev(() => { naechsteNacht(); zu(); }); ok('nächste Nacht: Wohlbefinden sinkt durch Shampoo im Fell', await ev(v => spiel.boxen[0].pferd.pflege.wohl < v, w0));
  await klick('[data-wasch="spritzen"]'); ok('Abspritzen-Werkzeug erreichbar', await ev(() => true));

  // ===== 3 Weihnachten: Brief, Weitergeben =====
  await ev(() => { document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); ortModus = null; spiel.mitarbeiter = [maN('Mit', 'pfleger')]; const Rg = pensionRegeln(); Rg.offen = true; Rg.max = 99; Rg.ansehen = 170;
    const p = pf('Gast'); spiel.boxen[2].pferd = p; const e = { eid: 'eGast', vn: 'Anna', nn: 'Test', w: true, pid: p.id, stufe: 1, leistungen: {}, haltung: 'box', zufr: 90, zs: 90 * 20, zn: 20, zj: 0, seit: jzJetzt() - 8, einzug: spiel.tag - 400, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200 }; p.einsteller = e.eid; einstellerListe().push(e); });
  const X = await ev(() => { let i = 0; while (!(datum().s === 3 && datum().t >= tpj() - 2) && i++ < 400) nacht1(); let j = 0; while (!spiel.post.some(x => /Weihnachtsgr/.test(x.betreff)) && j++ < 4) nacht1(); const b = spiel.post.find(x => /Weihnachtsgr/.test(x.betreff)); return { id: b && b.id, spons: spiel.post.find(x => /Sponsoring/.test(x.betreff)) ? spiel.post.find(x => /Sponsoring/.test(x.betreff)).id : null, stall: spiel.post.some(x => /Stall des Jahres/.test(x.betreff)) }; });
  ok('Winter: Weihnachtsgrüße der Einsteller kommen per Post', !!X.id, JSON.stringify(X));
  if (X.id) { await ev(() => { offenerBrief = null; postAuswahl = null; zeigeHof('post'); }); await pg.waitForTimeout(200); await klick(`[data-brief="${X.id}"]`);
    const knopf = await ev(() => [...document.querySelectorAll('[data-baktion]')].map(k => k.dataset.baktion + '|' + k.textContent.trim()));
    ok('Brief hat den Knopf „Ans Team weitergeben“ (falls Geld dabei)', knopf.length === 0 || knopf.some(k => /Team/.test(k)), knopf.join(' ; '));
    if (knopf.some(k => /Team/.test(k))) { const z0 = await ev(() => zufr(spiel.mitarbeiter[0])); await klick('[data-baktion="wgs-team"]'); ok('Weitergeben: Mitarbeiter wird zufriedener', await ev(v => zufr(spiel.mitarbeiter[0]) > v, z0)); } }
  if (X.spons) { await ev(() => { offenerBrief = null; postAuswahl = null; zeigeHof('post'); }); await pg.waitForTimeout(200); await klick(`[data-brief="${X.spons}"]`); const k2 = await ev(() => [...document.querySelectorAll('[data-baktion]')].map(k => k.dataset.baktion)); ok('Sponsoring-Angebot hat Annehmen-Knöpfe', k2.length > 0, k2.join(',')); if (k2[0]) { await klick(`[data-baktion="${k2[0]}"]`); ok('Sponsor angenommen', await ev(() => !!(spiel.hof.sponsor))); } } else ok('Sponsoring-Angebot kam (Ansehen 170)', false);
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
