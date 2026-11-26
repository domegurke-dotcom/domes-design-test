// 26.11.2026: Traber-Regeln § 28 TRO und Wiederqualifikation (§ 51 Abs. 4 TRO) im Turnierfenster mit echten Klicks
// (Hauptmenü-Anhänger → Turnier → Pferd anklicken → „Alle zeigen“ → Grund in der Zeile bzw. „Nennen“ / „✓ genannt“ anklicken).
// Prüft: Zweijährige vor dem 15. Juni gesperrt · Stute in den ersten 6 Monaten nach dem Abfohlen gesperrt · viermal disqualifiziert → neu qualifizieren
// · qualifizierter Wallach nennt per Klick · krank abmelden per Klick → Schutzsperre im selben Fenster.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/traber28-klick-test.js   ·   MOTOR=1 prüft den Motor der App   ·   BILDER_ORDNER=<Scratchpad> für Bilder
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const ORD = process.env.BILDER_ORDNER || null; if (ORD) fs.mkdirSync(ORD, { recursive: true });
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on('pageerror', e => fehler.push(e.message));
  let rot = 0; const ok = (t, b, x) => { console.log((b ? '✓ ' : '✗ ') + t + (b ? '' : ' – ' + (x || ''))); if (!b) rot++; };
  let nr = 0; const bild = async name => { if (!ORD) return; nr++; await pg.waitForTimeout(200); await pg.screenshot({ path: path.join(ORD, 'traber28-' + String(nr).padStart(2, '0') + '-' + name + '.png') }); };
  const ev = (f, a) => pg.evaluate(f, a);
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei.replace(/\\/g, '/')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  // Pferde: 0 Zweijähriger (qualifiziert), 1 Stute 6 J. (vor kurzem abgefohlt, Fohlen abgesetzt), 2 Wallach 5 J. (viermal disqualifiziert), 3 Wallach 6 J. (qualifiziert)
  const T = await ev(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 200000;
    const mk = (n, g, alter, i) => { const P = neuesPferd({ rasse: 'traber', geschlecht: g, alter, name: n }); P.anteile = { traber: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P);
      P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; P.training = 60; P.befunde = []; P.skalaT = [80, 80, 80, 80, 80]; P.trabQuali = { tag: spiel.tag, zeit: 84 }; spiel.boxen[i].pferd = P; return P; };
    mk('Zweier', 'Hengst', 2, 0); const S = mk('Mama', 'Stute', 6, 1); S.abfohlTag = spiel.tag - 1; const D = mk('Pech', 'Wallach', 5, 2); D.trabNeuQuali = spiel.tag; mk('Flott', 'Wallach', 6, 3);
    /* Trabrenntag im Frühling suchen (Spiel startet Frühling Tag 1) */
    turnierKalender(); const t = (spiel.turniere || []).filter(x => x.tag > spiel.tag + 1 && datum(x.tag).s === 0 && x.pruef.some(P => P.disz === 'trabrennen')).sort((a, b) => a.tag - b.tag)[0];
    speichern(); return t ? { tid: t.id, tag: t.tag, s: datum(t.tag).s, heute: spiel.tag, zwei: (t.pruef.find(P => P.jung && P.jung[0] === 8) || {}).id, kl3: (t.pruef.find(P => P.disz === 'trabrennen' && !P.jung && P.stufe === 0) || {}).id } : null; });
  ok('Trabrenntag im Frühling gefunden', !!(T && T.zwei && T.kl3), JSON.stringify(T));
  if (!T) { await br.close(); process.exit(1); }
  // Fenster öffnen: Anhänger → Turnier → Pferd (Klick) → Karte aufklappen → „Alle zeigen“ (Klick), damit gesperrte Prüfungen mit Grund sichtbar sind
  const oeffne = async box => {
    await ev(() => { document.getElementById('dlg').hidden = true; turnierAlleLK = false; zeigeHaupt(); anhTurnier(); }); await pg.waitForTimeout(200);
    await pg.click(`[data-tw="${box}"]`); await pg.waitForTimeout(250);
    if (await pg.locator('#tAlleLK').count() && !(await ev(() => turnierAlleLK))) { await pg.click('#tAlleLK'); await pg.waitForTimeout(250); }
    await ev(tid => { const d = document.querySelector(`[data-tkarte="${tid}"]`); if (d) { d.open = true; const g = d.closest('[data-tgruppe]'); if (g) g.open = true; } }, T.tid);
  };
  const zeile = (prid) => ev(([tid, prid]) => { const d = document.querySelector(`[data-tkarte="${tid}"]`); if (!d) return { fehlt: 'Karte' };
    const li = [...d.querySelectorAll('.tp-zeile')].find(l => l.querySelector(`[data-tnennen="${tid}:${prid}"], [data-tzurueck="${tid}:${prid}"]`) || l.textContent.includes(spiel.turniere.find(x => x.id === tid).pruef.find(P => P.id === prid).name));
    return li ? { text: li.textContent.replace(/\s+/g, ' '), nennen: !!li.querySelector('[data-tnennen]'), genannt: !!li.querySelector('[data-tzurueck]'), stat: (li.querySelector('.stat') || {}).textContent || '' } : { fehlt: 'Zeile' }; }, [T.tid, prid]);

  // 1. Zweijähriger: im Frühling kein Rennen (erst ab 15. Juni)
  await oeffne(0); await bild('zweijaehriger');
  const z1 = await zeile(T.zwei);
  ok('Zweijähriger: Rennen für Zweijährige im Frühling gesperrt, Grund „15. Juni“ in der Zeile, kein Nennen-Knopf', /15\. Juni/.test(z1.stat) && !z1.nennen, JSON.stringify(z1));

  // 2. Stute kurz nach dem Abfohlen
  await oeffne(1); await bild('stute');
  const z2 = await zeile(T.kl3);
  ok('Stute nach dem Abfohlen: Trabrennen gesperrt, Grund „sechs Monate“', /sechs Monate/.test(z2.stat) && !z2.nennen, JSON.stringify(z2));

  // 3. Viermal disqualifiziert
  await oeffne(2); await bild('disqualifiziert');
  const z3 = await zeile(T.kl3);
  ok('Viermal disqualifiziert: gesperrt bis zur neuen Qualifikation', /viermal in Folge disqualifiziert/.test(z3.stat) && !z3.nennen, JSON.stringify(z3));
  // neu qualifizieren (Übung Qualifikationslauf), dann steht der Nennen-Knopf da
  const q = await ev(() => { const P = spiel.boxen[2].pferd; P.skalaT = [80, 80, 80, 80, 10]; let n = 0; while (P.trabNeuQuali && n++ < 40) { delete P.trainHeute; P.energie = 100; try { trainieren(P, 'trabquali', 'rennbahn'); } catch (e) { return 'Fehler ' + e.message; } } return P.trabNeuQuali ? 'nicht geschafft' : ''; });
  await oeffne(2); const z3b = await zeile(T.kl3);
  ok('Nach dem Qualifikationslauf: Nennen-Knopf wieder da', q === '' && z3b.nennen, q + ' ' + JSON.stringify(z3b));

  // 4. Qualifizierter Wallach: Nennen per Klick
  await oeffne(3);
  const z4 = await zeile(T.kl3);
  ok('Qualifizierter Wallach: Nennen-Knopf da', z4.nennen, JSON.stringify(z4));
  if (z4.nennen) {
    const k = pg.locator(`[data-tnennen="${T.tid}:${T.kl3}"]`); await k.scrollIntoViewIfNeeded(); await k.click(); await pg.waitForTimeout(300);
    for (let i = 0; i < 6; i++) { const t = await ev(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent); if (/Turniere für/.test(t)) break; await bild('nennen-schritt'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300); }
    await ev(tid => { const d = document.querySelector(`[data-tkarte="${tid}"]`); if (d) d.open = true; }, T.tid);
    const g = await ev(([tid, prid]) => !!spiel.turniere.find(x => x.id === tid).nennung.find(n => n.prid === prid && n.pid === spiel.boxen[3].pferd.id), [T.tid, T.kl3]);
    ok('Per Klick genannt', g); await bild('genannt');

    // 5. Krank → „✓ genannt“ anklicken = abmelden → Schutzsperre (§ 28 TRO) im selben Fenster
    await ev(() => { const P = spiel.boxen[3].pferd; P.pflege.gesundheit = 30; });
    const kr = await ev(() => krankHinweis(spiel.boxen[3].pferd, null));
    if (!kr) await ev(() => { const P = spiel.boxen[3].pferd; P.befunde = [{ art: 'lahmheit', grad: 3, bemerkt: true, tag: spiel.tag, diagnose: true }]; });
    await oeffne(3);
    const kz = pg.locator(`[data-tzurueck="${T.tid}:${T.kl3}"]`);
    ok('Knopf „✓ genannt“ zum Abmelden da', await kz.count() > 0);
    if (await kz.count()) { const g0 = await ev(() => spiel.geld); await kz.scrollIntoViewIfNeeded(); await kz.click(); await pg.waitForTimeout(300);
      await ev(tid => { const d = document.querySelector(`[data-tkarte="${tid}"]`); if (d) d.open = true; }, T.tid); await bild('schutzsperre');
      const r = await ev(([tid, prid]) => { const P = spiel.boxen[3].pferd; return { schutz: P.trabSchutz, tTag: spiel.turniere.find(x => x.id === tid).tag, noch: !!spiel.turniere.find(x => x.id === tid).nennung.find(n => n.prid === prid && n.pid === P.id), krank: krankHinweis(P, null) }; }, [T.tid, T.kl3]);
      const z5 = await zeile(T.kl3); const g1 = await ev(() => spiel.geld);
      ok('Krank abgemeldet: Nennung weg, Nenngeld zurück, Schutzsperre gesetzt', !r.noch && r.schutz >= r.tTag && g1 > g0, JSON.stringify(r) + ' Geld ' + g0 + '→' + g1);
      ok('Gleiches Rennen zeigt jetzt „Schutzsperre“ statt Nennen-Knopf', /Schutzsperre/.test(z5.stat) && !z5.nennen, JSON.stringify(z5));
      const z6 = await zeile(T.zwei);
      ok('Rennen für Zweijährige zeigt beim 6-Jährigen „Altersgrenze“ (nicht die Schutzsperre)', /Altersgrenze/.test(z6.stat), JSON.stringify(z6));
      // nach der Sperre (und gesund) wieder frei – geprüft am Grund für einen Tag nach der Sperre
      const frei = await ev(([tid, prid]) => { const P = spiel.boxen[3].pferd; P.pflege.gesundheit = 100; P.befunde = []; return trab28Sperre(P, P.trabSchutz + 1, false); }, [T.tid, T.kl3]);
      ok('Nach Ablauf der Schutzsperre wieder startberechtigt', frei === '', frei); }
  }
  ok('keine Seitenfehler', !fehler.length, fehler.join(' | '));
  await br.close(); process.exit(rot ? 1 : 0);
})();
