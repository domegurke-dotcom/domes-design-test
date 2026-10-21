// Aufnahme (v640, Dome 21.10.): Start im Startmenü unter „Neues Spiel“, läuft über Spielstart/Tutorial/Neuladen, rotes „Fehler melden“-Kästchen
// in den Infoblasen (immer) und links unter der Datumsanzeige (nur außerhalb des Tutorials), Fehler-Eintrag mit Text und Kontext
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/aufnahme-test.js [BxH] [Bilder-Ordner]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number); const O = process.argv[3];
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, acceptDownloads: true }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, info = '') => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + info));
  const ev = (f, a) => pg.evaluate(f, a);
  const foto = async n => { if (O) await pg.screenshot({ path: `${O}/auf-${W}x${H}-${n}.png` }); };
  const lade = async () => { await pg.waitForLoadState('load'); await pg.waitForTimeout(800); };
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await ev(() => localStorage.clear()); await pg.reload(); await lade();

  // 1. Startmenü: Knopf unter „Neues Spiel“, Start, roter Rahmen
  let r = await ev(() => { const a = document.getElementById('smNeu').getBoundingClientRect(), c = document.getElementById('smAufnahme'); return { da: !!c, unter: c && c.getBoundingClientRect().top >= a.bottom - 1, rahmen: document.body.classList.contains('aufnahme') }; });
  ok('Startmenü: „Aufnahme starten“ steht unter „Neues Spiel“, noch kein Rahmen', r.da && r.unter && !r.rahmen, JSON.stringify(r));
  await pg.click('#smAufnahme'); await pg.waitForTimeout(200);
  r = await ev(() => ({ an: !!AUF.laufend, knopf: document.getElementById('smAufnahme').textContent, rahmen: document.body.classList.contains('aufnahme'), kopf: document.body.classList.contains('auf-kopf') }));
  ok('Aufnahme gestartet im Startmenü: Knopf „beenden“, roter Rahmen, kein Kopf-Kästchen', r.an && /beenden/.test(r.knopf) && r.rahmen && !r.kopf, JSON.stringify(r));
  await foto('1-startmenue');

  // 2. Neues Spiel (ohne Tutorial): Kästchen unter der Datumsanzeige
  await pg.click('#smNeu'); await pg.waitForTimeout(200);
  await pg.fill('#chName', 'Anna'); await pg.click('#chLos'); await pg.waitForTimeout(200); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await ev(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; zeigeStall(); zeigeTag(); });
  await pg.waitForTimeout(900);
  r = await ev(() => { const k = document.getElementById('kopfFehler').getBoundingClientRect(), t = document.getElementById('tagAnzeige').getBoundingClientRect(), h = document.querySelector('header').getBoundingClientRect(), ks = document.getElementById('stall').getBoundingClientRect();
    return { sicht: k.width > 0 && k.height > 0, unterDatum: k.top >= t.bottom - 1, links: k.left < 60, imKopf: k.bottom <= h.bottom + 1, ueberStall: k.bottom > ks.top + 1, eintraege: AUF.laufend.eintraege.map(e => e.a) }; });
  ok('Im Spiel: Kästchen sichtbar, links unter der Datumsanzeige, innerhalb der Kopfleiste (verdeckt nichts)', r.sicht && r.unterDatum && r.links && r.imKopf && !r.ueberStall, JSON.stringify(r));
  ok('Eintrag „Neues Spiel“ steht in der Aufnahme', r.eintraege.includes('Neues Spiel') && r.eintraege.includes('Aufnahme gestartet'), JSON.stringify(r.eintraege));
  await foto('2-kopf');

  // 3. Kästchen → Nein: nichts gespeichert; → Ja: Text, Fertig → Eintrag
  await pg.click('#kopfFehler input'); await pg.waitForTimeout(150);
  ok('Kästchen öffnet „Fehler melden?“ (Ja/Nein), Kästchen bleibt nicht angehakt', await ev(() => !!document.getElementById('aufFehlerFenster') && !document.querySelector('#kopfFehler input').checked));
  await foto('3-frage');
  await pg.click('[data-af="nein"]'); await pg.waitForTimeout(100);
  ok('Nein: Fenster zu, kein Fehler-Eintrag', await ev(() => !document.getElementById('aufFehlerFenster') && !AUF.laufend.eintraege.some(e => e.a === 'FEHLER')));
  await pg.click('#kopfFehler input'); await pg.click('[data-af="ja"]'); await pg.waitForTimeout(100);
  ok('Ja: Textfeld mit „Fertig“', await ev(() => !!document.getElementById('aufFehlerText') && !!document.querySelector('[data-af="fertig"]')));
  await foto('4-text');
  await pg.fill('#aufFehlerText', 'Der Stall zeigt zu wenig Heu.'); await pg.click('[data-af="fertig"]'); await pg.waitForTimeout(150);
  r = await ev(() => ({ zu: !document.getElementById('aufFehlerFenster'), F: AUF.laufend.eintraege.filter(e => e.a === 'FEHLER') }));
  ok('Fertig: Eintrag FEHLER mit Text, Ansicht und Bildgröße, Fenster zu', r.zu && r.F.length === 1 && r.F[0].x === 'Der Stall zeigt zu wenig Heu.' && r.F[0].px === W + 'x' + H && r.F[0].t >= 1, JSON.stringify(r));

  // 4. Infoblase mit Kästchen (außerhalb des Tutorials)
  await ev(() => { spiel.tipps = { start: 1, geldKnapp: 1 }; spiel.tippStart = spiel.tag; spiel.tippsAus = false; document.getElementById('dlg').hidden = true; blaseZeigen('lf_pferd', { leit: true, frei: true }); }); await pg.waitForTimeout(300);
  r = await ev(() => { const k = document.querySelector('#hinweisBlase .hb-fehler'); return { da: !!k, rot: k && getComputedStyle(k).color, sicht: !!k && k.getBoundingClientRect().height > 0 }; });
  ok('Infoblase: rotes Kästchen „Fehler melden“', r.da && r.sicht, JSON.stringify(r));
  await foto('5-blase');
  await pg.click('#hinweisBlase .hb-fehler input'); await pg.waitForTimeout(100);
  ok('Antippen des Kästchens schließt die Blase nicht, Frage erscheint', await ev(() => !!document.getElementById('aufFehlerFenster') && !document.getElementById('hinweisBlase').hidden));
  await pg.click('[data-af="ja"]'); await pg.fill('#aufFehlerText', 'Blasentext falsch'); await pg.click('[data-af="fertig"]'); await pg.waitForTimeout(100);
  r = await ev(() => AUF.laufend.eintraege.filter(e => e.a === 'FEHLER').pop());
  ok('Fehler aus der Blase merkt sich die Blase (bk, bt)', r && /^lf_/.test(r.bk || '') && !!r.bt && r.x === 'Blasentext falsch', JSON.stringify(r));

  // 5. Nach Neuladen weiterlaufen (Aufnahme ist nicht im Spielstand)
  await ev(() => { blaseWeg(false); speichernJetzt(); }); await pg.reload(); await lade();
  r = await ev(() => ({ an: !!AUF.laufend, n: AUF.laufend && AUF.laufend.eintraege.filter(e => e.a === 'FEHLER').length, imSpiel: !!(spiel && (spiel.aufnahme || spiel.aufnahmen)), rahmen: document.body.classList.contains('aufnahme') }));
  ok('Nach Neuladen läuft die Aufnahme weiter (2 Fehler), nichts mehr im Spielstand', r.an && r.n === 2 && !r.imSpiel && r.rahmen, JSON.stringify(r));

  // 6. Tutorial: Blase mit Kästchen, kein Kopf-Kästchen, Klick wird nicht gesperrt
  await ev(() => { zeigeStart(); }); await pg.waitForTimeout(300);
  await pg.click('#smNeu'); await pg.waitForTimeout(200); if (await pg.locator('#dlgKnoepfe button', { hasText: 'Nicht speichern' }).count()) await pg.locator('#dlgKnoepfe button', { hasText: 'Nicht speichern' }).click();
  await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chTutorial'); await pg.waitForTimeout(2200);
  r = await ev(() => ({ tut: !!spiel.tutorial, an: !!AUF.laufend, kopf: document.body.classList.contains('auf-kopf'), blase: !!document.querySelector('#hinweisBlase .hb-fehler'), E: AUF.laufend.eintraege.map(e => e.a) }));
  ok('Tutorial: Aufnahme läuft weiter, Kästchen nur in der Blase (nicht im Kopf)', r.tut && r.an && !r.kopf && r.blase, JSON.stringify(r));
  ok('Tutorial-Start und Kapitel stehen in der Aufnahme', r.E.includes('Tutorial gestartet') && r.E.includes('Tutorial Kapitel'), JSON.stringify(r.E));
  await foto('6-tutorial'); if (process.env.LAUT) console.log('dlg:', await ev(() => document.getElementById('dlg').hidden ? '-' : document.getElementById('dlgInhalt').textContent.slice(0, 200)));
  await pg.click('#hinweisBlase .hb-fehler input'); await pg.waitForTimeout(150);
  ok('Tutorial: Kästchen wird nicht gesperrt, Frage erscheint', await ev(() => !!document.getElementById('aufFehlerFenster')));
  await pg.click('[data-af="ja"]'); await pg.fill('#aufFehlerText', 'Im Tutorial gemeldet'); await pg.click('[data-af="fertig"]'); await pg.waitForTimeout(150);
  r = await ev(() => AUF.laufend.eintraege.filter(e => e.a === 'FEHLER').pop());
  ok('Tutorial-Fehler enthält Kapitel.Schritt (tu) und Blasen-Schlüssel', r && /^\d+\.\d+$/.test(r.tu) && /^tut_/.test(r.bk) && r.x === 'Im Tutorial gemeldet', JSON.stringify(r));

  // 7. Beenden im Startmenü, Download mit Fehlerliste, Löschen
  await ev(() => { zeigeStart(); }); await pg.waitForTimeout(400);
  r = await ev(() => ({ ok: !!document.getElementById('smAufnahme') }));
  await pg.click('#smAufnahme'); await pg.fill('#aufName', 'Mein Lauf'); await pg.locator('#dlgKnoepfe button', { hasText: 'Beenden und speichern' }).click(); await pg.waitForTimeout(200);
  r = await ev(() => ({ laeuft: !!AUF.laufend, L: AUF.liste.map(a => a.name), rahmen: document.body.classList.contains('aufnahme'), liste: !!document.querySelector('[data-aufdl]'), fz: document.querySelector('#startMenue .ma-karte') && document.querySelector('#startMenue .ma-karte').textContent }));
  ok('Beendet im Startmenü: Liste mit Download/Löschen, Rahmen weg, Zahl der Fehler steht dabei', !r.laeuft && r.L.length === 1 && /^Mein Lauf/.test(r.L[0]) && !r.rahmen && r.liste && /3 Fehler gemeldet/.test(r.fz), JSON.stringify(r));
  const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('[data-aufdl]')]); const inh = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  ok('Datei: Format 2, Liste „fehler“ mit 3 Einträgen', inh.typ === 'zuchtstall-aufnahme' && inh.format === 2 && inh.fehler.length === 3 && inh.eintraege.length > 5, JSON.stringify({ f: inh.format, n: (inh.fehler || []).length }));
  await pg.click('[data-aufweg]'); await pg.waitForTimeout(150); await pg.locator('#dlgKnoepfe button', { hasText: 'Löschen' }).click(); await pg.waitForTimeout(150);
  ok('Löschen: Liste leer', await ev(() => AUF.liste.length === 0));

  // 8. Alte Spielstände: Aufnahmen im Spielstand wandern in den eigenen Speicher
  await ev(() => { localStorage.clear(); });
  await pg.reload(); await lade(); await pg.click('#smNeu'); await pg.waitForTimeout(200);
  await pg.fill('#chName', 'Alt'); await pg.click('#chLos'); await pg.waitForTimeout(200); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Althof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await ev(() => { document.getElementById('dlg').hidden = true; spiel.aufnahmen = [{ id: 'alt1', nr: 1, name: 'Alte Aufnahme', von: 'x', bis: 'y', hof: 'h', eintraege: [{ t: 1, a: 'Test' }] }]; spiel.aufnahme = { id: 'alt2', nr: 2, von: 'z', vonTag: 1, eintraege: [{ t: 2, a: 'Laufend' }] }; speicherSperre = false; speichern(); speichernJetzt(); aufSpeichern(true); });
  await pg.reload(); await lade();
  r = await ev(() => ({ liste: AUF.liste.map(a => a.id), laufend: AUF.laufend && AUF.laufend.id, imSpiel: !!(spiel.aufnahmen || spiel.aufnahme), nr: AUF.nr }));
  ok('Alte Aufnahmen aus dem Spielstand sind im eigenen Speicher (Liste + laufende), nicht mehr im Spielstand', r.liste.includes('alt1') && r.laufend === 'alt2' && !r.imSpiel && r.nr >= 2, JSON.stringify(r));

  ok('keine Seitenfehler', !errs.length, JSON.stringify(errs));
  console.log(L.join('\n')); await b.close();
})();
