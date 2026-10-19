// Spielstand-Test (PLAN-SPIELSTAND.md, Stand v525 inkl. S4 Spielprotokoll mit Domes Änderungen vom 19.10.: keine Rücksicherung, neues Spiel ohne Speicherstand, „Speicherplatz 1/2“)
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/spielstand-test.js  → jede Zeile „✓“, am Ende „alles ok“
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const URL_ = 'file://' + path.resolve(__dirname, '..', 'index.html');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, info = '') => L.push([c ? '✓' : '✗', n, c ? '' : info]);
  const ev = (f, a) => pg.evaluate(f, a);
  const dlg = () => ev(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent);
  const knopf = async t => { await pg.locator('#dlgKnoepfe button', { hasText: t }).first().click(); await pg.waitForTimeout(150); };
  const hat = async t => (await pg.locator('#dlgKnoepfe button', { hasText: t }).count()) > 0;
  const lade = async () => { await pg.waitForLoadState('load'); await pg.waitForTimeout(700); };
  const zumLaden = () => ev(() => { document.getElementById('dlg').hidden = true; zeigeLadenMenue(); });   // v528: Speicherplätze liegen unter Startmenü → Laden
  const zumStart = () => ev(() => { document.getElementById('dlg').hidden = true; zeigeStart(); });
  const nacht = n => ev(n => { for (let i = 0; i < n; i++) { naechsteNacht(); document.getElementById('dlg').hidden = true; } speichern(); speichernJetzt(); }, n);
  const neuesSpiel = async (name, hof) => { await pg.click('#smNeu'); await pg.waitForTimeout(150); if (await hat('Nicht speichern')) await knopf('Nicht speichern');
    await pg.fill('#chName', name); await pg.click('#chLos'); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', hof); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200);
    await ev(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; }); };
  const speichernUeberMenue = async platz => { await ev(() => { document.getElementById('dlg').hidden = true; }); await pg.click('#menueKnopf'); await pg.click('#mSpeichern'); await pg.waitForTimeout(150);
    if (platz && await hat('Speicherplatz ' + platz)) await knopf('Speicherplatz ' + platz); if (await hat('Ersetzen')) await knopf('Ersetzen'); };

  await pg.goto(URL_); await ev(() => localStorage.clear()); await pg.reload(); await lade();
  // 1. Neues Spiel: kein Speicherstand, Tipp erinnert ans Speichern
  await neuesSpiel('Anna', 'Sonnenhof');
  let r = await ev(() => ({ id: spiel.spielId, platz: spiel.platz, p1: lesenPlatz(1), p2: lesenPlatz(2), ung: ungespeichert(), auto: localStorage.getItem('zuchtstall-v2')[0] }));
  ok('Neues Spiel: Spiel-Nummer, aber noch kein Speicherplatz', !!r.id && !r.platz && !r.p1 && !r.p2, JSON.stringify(r).slice(0, 120));
  ok('Neues Spiel gilt als „noch nicht gespeichert“, Autospeicher gepackt', r.ung === true && r.auto !== '{');
  await nacht(1);
  r = await ev(() => { spiel.tippsAus = false; spiel.tippStart = 1; spiel.tipps = Object.fromEntries(Object.keys(TIPPS).filter(k => k !== 'speichern').map(k => [k, 1])); document.getElementById('dlg').hidden = true; const n = document.getElementById('nacht'); if (n) { n.classList.remove('an'); n.hidden = true; } tippPruefen(); return document.getElementById('dlgInhalt').textContent; });
  ok('Tipp „Spiel speichern nicht vergessen“ erscheint', /Spiel speichern nicht vergessen/.test(r), r.slice(0, 80));   // tippStart = 1 fest: lief tippPruefen zufällig erst nach dem Tageswechsel zum ersten Mal, stand er auf Tag 2 (v525)
  await ev(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; });
  // 2. Erstes Speichern: Speicherplatz wählen
  await speichernUeberMenue(1);
  r = await ev(() => ({ t: document.getElementById('dlgInhalt').textContent, platz: spiel.platz, p1: (lesenPlatz(1) || {}).meta, ung: ungespeichert() }));
  ok('Erstes Speichern: Speicherplatz wählen → „Gespeichert auf Speicherplatz 1 (Sonnenhof, …)“', /Gespeichert auf Speicherplatz 1 \(Sonnenhof, /.test(r.t) && r.platz === 1 && r.p1 && r.p1.hof === 'Sonnenhof', r.t);
  ok('nach dem Speichern nichts ungespeichert', r.ung === false);
  await nacht(2); ok('nach 2 Tagen: ungespeicherter Fortschritt', await ev(() => ungespeichert()));
  await speichernUeberMenue(); ok('zweites Speichern ohne Frage auf Speicherplatz 1', await ev(() => !ungespeichert() && lesenPlatz(1).meta.tag === spiel.tag));
  // 3. Zweites Spiel auf Speicherplatz 2
  await nacht(1); await zumStart(); await pg.click('#smNeu'); await pg.waitForTimeout(150);
  ok('Neues Spiel bei ungespeichertem Fortschritt: Frage „Jetzt speichern?“', /Ungespeicherter Fortschritt auf Speicherplatz 1/.test(await dlg()));
  await knopf('Speichern'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Ben'); await pg.click('#chLos'); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Lindenhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200); await ev(() => { spiel.tippsAus = true; });
  await speichernUeberMenue(2);
  r = await ev(() => ({ p1: lesenPlatz(1).meta.hof, p2: lesenPlatz(2).meta.hof, platz: spiel.platz }));
  ok('Sonnenhof auf Speicherplatz 1, Lindenhof auf Speicherplatz 2', r.p1 === 'Sonnenhof' && r.p2 === 'Lindenhof' && r.platz === 2, JSON.stringify(r));
  // 4. Startmenü
  await zumStart(); r = await ev(() => document.getElementById('startMenue').innerText);
  ok('Startmenü: Weiterspielen + Kachel „Laden“, keine Speicherplatz-Karten, kein „Laufendes Spiel als Datei“', /Weiterspielen – Lindenhof/.test(r) && /Speicherplatz 2\)/.test(r) && /Laden/.test(r) && !/Speicherplatz 1\s*Sonnenhof/.test(r) && !/Laufendes Spiel als Datei/.test(r), r.slice(0, 200));
  await zumLaden(); r = await ev(() => document.getElementById('startMenue').innerText);
  ok('Laden: „Speicherplatz 1/2“ mit Hofnamen, „Spielstand downloaden“, „Spielstand aus Datei laden“, kein Kopieren', /Speicherplatz 1\s*Sonnenhof/.test(r) && /Speicherplatz 2\s*Lindenhof/.test(r) && /Spielstand downloaden/.test(r) && /Spielstand aus Datei laden/.test(r) && !/kopieren/i.test(r) && !/rückgängig/i.test(r), r.slice(0, 300));
  // 5. Wechsel
  await zumLaden(); await pg.click('[data-pspiel="1"]'); await lade();
  ok('Wechsel auf Speicherplatz 1: Sonnenhof läuft, nichts ungespeichert', await ev(() => hofName() === 'Sonnenhof' && spiel.platz === 1 && !ungespeichert()));
  await nacht(2); await zumLaden(); await pg.click('[data-pspiel="2"]'); await pg.waitForTimeout(150);
  ok('Wechsel mit Fortschritt: Frage', /Ungespeicherter Fortschritt auf Speicherplatz 1 \(Sonnenhof, seit/.test(await dlg()));
  await knopf('Nicht speichern'); await lade(); ok('Nicht speichern: Lindenhof läuft', await ev(() => hofName() === 'Lindenhof'));
  // 6. Kopieren und Löschen (Sicherheitsfrage, keine Rücksicherung)
  await zumLaden(); ok('kein Kopieren-Knopf mehr', await ev(() => !document.querySelector('[data-pkopie]')));
  await pg.click('[data-pweg="1"]'); await pg.waitForTimeout(150); ok('Löschen: Sicherheitsfrage', /endgültig gelöscht/.test(await dlg()));
  await knopf('Abbrechen'); ok('nach Abbrechen beide Speicherplätze unverändert', await ev(() => lesenPlatz(1).meta.hof === 'Sonnenhof' && lesenPlatz(2).meta.hof === 'Lindenhof' && !localStorage.getItem('zuchtstall-rueck')));
  // 7. Speicher voll
  r = await ev(() => { const alt = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new Error('voll'); }; const w = () => { const e = document.getElementById('speicherWarn'); return !!e && !e.hidden; };
    spiel.geld += 1; speichern(); speichernJetzt(); const a = w(); document.getElementById('speicherWarn').hidden = true; spiel.geld += 1; speichern(); speichernJetzt(); const b2 = w();
    spiel.tag++; speichern(); speichernJetzt(); const c = w(); spiel.tag--; Storage.prototype.setItem = alt; document.getElementById('speicherWarn').hidden = true; spiel.geld -= 2; speichern(); speichernJetzt(); return { a, b: b2, c }; });
  ok('Speicher voll: rote Meldung, am selben Tag nicht nochmal, am nächsten wieder', r.a && !r.b && r.c);
  // 8. Datei speichern + laden
  const [dl] = await Promise.all([pg.waitForEvent('download'), ev(() => dateiSpeichern('auto'))]);
  const D = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  ok('Datei: Format und Name', D.typ === 'zuchtstall-spielstand' && D.format === 1 && D.info.hoefe[0] === 'Lindenhof' && /^Zuchtstall_Lindenhof_Jahr\d\d-/.test(await ev(() => dateiName(spiel))));
  const tmp = path.resolve(__dirname, '..', '_s3-test'); fs.mkdirSync(tmp, { recursive: true });
  try { const schreibe = (n, x) => { const f = path.join(tmp, n); fs.writeFileSync(f, typeof x === 'string' ? x : JSON.stringify(x)); return f; };
    const laden = async (n, f) => { await zumLaden(); await pg.click('#smLaden'); await pg.waitForTimeout(150); if (await hat('Nicht speichern')) await knopf('Nicht speichern');
      const [fc] = await Promise.all([pg.waitForEvent('filechooser'), knopf('Speicherplatz ' + n)]); await fc.setFiles(f); await pg.waitForTimeout(300); return dlg(); };
    ok('Laden: kaputtes JSON → Meldung', /kein Zuchtstall-Spielstand/.test(await laden(1, schreibe('k.json', '{ kaputt'))));
    ok('Laden: vor dem Hof-Ausbau → Meldung', /vor dem Hof-Ausbau/.test(await laden(1, schreibe('a.json', { ...D, spiel: { ...D.spiel, hofAusbau: undefined } }))));
    ok('Laden: neuere Version → Meldung', /neueren Spielversion/.test(await laden(1, schreibe('n.json', { ...D, version: '999' }))));
    const v = await laden(1, schreibe('o.json', { ...D, spiel: { ...D.spiel, tag: 0 } })); await knopf('Ja, laden');
    ok('Laden: Vorschau, ältere Datei → „schon weiter … Trotzdem laden?“', /Vorschau/.test(v) && /schon weiter/.test(await dlg()));
    await knopf('Abbrechen');
    await laden(1, schreibe('g.json', D)); await knopf('Ja, laden'); ok('Laden auf belegten Speicherplatz: Sicherheitsfrage', /Speicherplatz 1 \(.*\) wird ersetzt/.test(await dlg())); await knopf('Ersetzen');
    ok('Datei auf Speicherplatz 1: Stand identisch', await ev(s => JSON.stringify(lesenPlatz(1).spiel) === JSON.stringify({ ...JSON.parse(s), platz: 1 }), JSON.stringify(D.spiel)));
    await knopf('Jetzt spielen'); await lade(); ok('Jetzt spielen: Lindenhof läuft auf Speicherplatz 1', await ev(() => hofName() === 'Lindenhof' && spiel.platz === 1 && !ungespeichert()));
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  // 9. Spiel verloren
  await ev(() => { spiel.verloren = { tag: spiel.tag, jz: jzJetzt(), kredit: 'Hofkredit', offen: 3, schuld: 1, pferde: 0 }; spielVerloren(); });
  r = await ev(() => ({ auto: localStorage.getItem('zuchtstall-v2'), p: !!lesenPlatz(1) && !!lesenPlatz(2), k: (document.getElementById('vlPlatz') || {}).textContent || '' }));
  ok('Spiel verloren: Autospeicher weg, Speicherplätze bleiben, Neustart-Knopf', r.auto === null && r.p && /Speicherplatz 1, Lindenhof/.test(r.k), r.k);
  await pg.click('#vlPlatz'); await lade(); ok('Neustart vom Speicherstand', await ev(() => hatSpielstand && hofName() === 'Lindenhof' && !spiel.verloren));
  // 10. alter Spielstand (vor S1) → Speicherplatz 1
  const alt = await ev(() => { const s = JSON.parse(JSON.stringify(spiel)); delete s.spielId; delete s.platz; delete s.tsort; return JSON.stringify(s); });
  await ev(a => { speicherSperre = true; localStorage.clear(); localStorage.setItem('zuchtstall-v2', a); localStorage.setItem('zuchtstall-tsort', 'disz'); localStorage.setItem('zuchtstall-rueck', 'x'); }, alt);
  await pg.reload(); await lade();
  r = await ev(() => ({ id: spiel.spielId, platz: spiel.platz, p1: !!lesenPlatz(1), tsort: spiel.tsort, ung: ungespeichert(), rueck: localStorage.getItem('zuchtstall-rueck') }));
  ok('alter Spielstand: Spiel-Nummer, Speicherplatz 1, Turnier-Sortierung, alte Rücksicherung entfernt', !!r.id && r.platz === 1 && r.p1 && r.tsort === 'disz' && !r.ung && r.rueck === null, JSON.stringify(r));
  // 7. S4 Spielprotokoll + Aufnahmen (v529): Zähler immer an, Aufnahme starten/beenden, roter Rahmen, Liste mit Herunterladen/Löschen, bleibt nach dem Neuladen
  await neuesSpiel('Prot', 'Protokollhof');
  r = await ev(() => { const p = neuesPferd({ name: 'Zaehli', rasse: 'haflinger', geschlecht: 'Stute', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); const bx = spiel.boxen[0]; bx.pferd = p;
    fuetternAusLager(bx, 'du', 'rau'); trainieren(p, 'spazieren', 'gelaende', null); kreditNeu(1000, 4, 'Test'); const z = datum().j + '-' + datum().s; return { P: spiel.protokoll[z], auf: !!spiel.aufnahme, rahmen: document.body.classList.contains('aufnahme') }; });
  ok('Protokoll zählt je Jahreszeit (Füttern, Training, Kredit), ohne Aufnahme kein Tagebuch, kein roter Rahmen', r.P && r.P['Füttern selbst'] === 1 && r.P['Training Spaziergang (selbst)'] === 1 && r.P['Kredit aufgenommen'] >= 2 && !r.auf && !r.rahmen, JSON.stringify(r));
  await ev(() => zeigeHof('einst')); await pg.click('#hfAufnahme'); await pg.waitForTimeout(100);
  r = await ev(() => { const p = spiel.boxen[0].pferd; trainieren(p, 'bodenarbeit', 'reitplatz', null); buchen(-12, 'Testposten'); speichern(); speichernJetzt(); zeigeHof('einst');
    const rahmen = getComputedStyle(document.body, '::after'); return { an: !!spiel.aufnahme, T: spiel.aufnahme.eintraege, knopf: document.getElementById('hfAufnahme').textContent, cls: document.body.classList.contains('aufnahme'), bs: rahmen.borderTopWidth + ' ' + rahmen.borderTopColor, pos: rahmen.position }; });
  ok('Aufnahme läuft: Einträge mit Tag, Pferd, Ort und Buchungen, Knopf „beenden“, roter Rahmen', r.an && r.T.some(e => /Training/.test(e.a) && e.p === 'Zaehli' && e.t >= 1) && r.T.some(e => e.a === 'Geld' && e.x === 'Testposten' && e.b === -12) && /Aufnahme beenden/.test(r.knopf) && r.cls && r.pos === 'fixed' && /^3px/.test(r.bs), JSON.stringify(r).slice(0, 300));
  await zumStart(); r = await ev(() => document.body.classList.contains('aufnahme')); ok('Im Startmenü kein roter Rahmen', r === false);
  await ev(() => { document.getElementById('dlg').hidden = true; zeigeSchirm(null); zeigeHof('einst'); });
  await pg.click('#hfAufnahme'); await pg.waitForTimeout(100); await pg.fill('#aufName', 'Mein Test'); await knopf('Beenden und speichern'); await pg.waitForTimeout(100);
  r = await ev(() => ({ laeuft: !!spiel.aufnahme, L: spiel.aufnahmen, cls: document.body.classList.contains('aufnahme'), dl: !!document.querySelector('[data-aufdl]'), weg: !!document.querySelector('[data-aufweg]') }));
  ok('Aufnahme beendet: steht in der Liste mit Herunterladen und Löschen, Rahmen weg', !r.laeuft && r.L.length === 1 && /^Mein Test \(/.test(r.L[0].name) && r.dl && r.weg && !r.cls, JSON.stringify(r).slice(0, 300));
  await pg.reload(); await lade();
  r = await ev(() => { const z = datum().j + '-' + datum().s; return { f: spiel.protokoll && spiel.protokoll[z] && spiel.protokoll[z]['Füttern selbst'], n: (spiel.aufnahmen || []).length }; });
  ok('Protokoll und Aufnahme bleiben nach dem Neuladen', r.f === 1 && r.n === 1, JSON.stringify(r));
  await ev(() => { document.getElementById('dlg').hidden = true; zeigeSchirm(null); zeigeHof('einst'); });
  ok('Aufnahmen-Liste erst nach Auswahl sichtbar', await ev(() => !!document.getElementById('hfAufListe') && !document.querySelector('[data-aufdl]'))); await pg.click('#hfAufListe'); await pg.waitForTimeout(100);
  const [adl] = await Promise.all([pg.waitForEvent('download'), pg.click('[data-aufdl]')]); const dpfad = await adl.path(); const dinh = JSON.parse(fs.readFileSync(dpfad, 'utf8'));
  ok('Herunterladen: Datei mit Typ „zuchtstall-aufnahme“ und Einträgen', dinh.typ === 'zuchtstall-aufnahme' && dinh.eintraege.length >= 2 && /^Zuchtstall_Mein-Test/.test(adl.suggestedFilename()), adl.suggestedFilename());
  await pg.click('[data-aufweg]'); await pg.waitForTimeout(150); ok('Löschen: Sicherheitsfrage', /endgültig gelöscht/.test(await dlg())); await knopf('Abbrechen');
  ok('nach Abbrechen noch da', await ev(() => spiel.aufnahmen.length === 1));
  await pg.click('[data-aufweg]'); await pg.waitForTimeout(150); await knopf('Löschen'); await pg.waitForTimeout(150);
  ok('Löschen: Aufnahme weg', await ev(() => spiel.aufnahmen.length === 0 && !document.querySelector('[data-aufdl]')));
  // 8. Startmenü „Speichern & Laden“: laufendes Spiel auf Speicherplatz speichern
  await ev(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; zeigeLadenMenue(); }); await pg.click('[data-pspeich="2"]'); await pg.waitForTimeout(150);
  r = await ev(() => ({ t: document.getElementById('dlgInhalt').textContent, platz: spiel.platz, p2: (lesenPlatz(2) || {}).meta }));
  ok('Speichern & Laden: Spiel auf Speicherplatz 2 gespeichert', /Gespeichert auf Speicherplatz 2/.test(r.t) && r.platz === 2 && r.p2 && r.p2.hof === 'Protokollhof', JSON.stringify(r).slice(0, 200));
  ok('Aufnahme-Liste ohne Auswahl zu: Kachel heißt „Speichern & Laden“', await ev(() => { document.getElementById('dlg').hidden = true; zeigeStart(); return /Speichern & Laden/.test(document.getElementById('startMenue').innerText); }));
  ok('keine Seitenfehler', !errs.length, errs.slice(0, 3).join(' | '));
  L.forEach(x => console.log(x.filter(Boolean).join('  '))); const alles = L.every(x => x[0] === '✓'); console.log(alles ? 'alles ok' : 'FEHLER');
  await b.close(); process.exit(alles ? 0 : 1);
})();
