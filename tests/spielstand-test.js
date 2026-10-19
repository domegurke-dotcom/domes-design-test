// Spielstand-Test (PLAN-SPIELSTAND.md, Stand v522 mit Domes Änderungen vom 19.10.: keine Rücksicherung, neues Spiel ohne Speicherstand, „Speicherplatz 1/2“)
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
  r = await ev(() => { spiel.tippsAus = false; spiel.tipps = Object.fromEntries(Object.keys(TIPPS).filter(k => k !== 'speichern').map(k => [k, 1])); document.getElementById('dlg').hidden = true; tippPruefen(); return document.getElementById('dlgInhalt').textContent; });
  ok('Tipp „Spiel speichern nicht vergessen“ erscheint', /Spiel speichern nicht vergessen/.test(r), r.slice(0, 80));
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
  ok('Startmenü: „Speicherplatz 1/2“ mit Hofnamen, keine Rücksicherung', /Weiterspielen – Lindenhof/.test(r) && /Speicherplatz 2\)/.test(r) && /Speicherplatz 1\s*Sonnenhof/.test(r) && /Speicherplatz 2\s*Lindenhof/.test(r) && !/rückgängig/i.test(r), r.slice(0, 200));
  // 5. Wechsel
  await pg.click('[data-pspiel="1"]'); await lade();
  ok('Wechsel auf Speicherplatz 1: Sonnenhof läuft, nichts ungespeichert', await ev(() => hofName() === 'Sonnenhof' && spiel.platz === 1 && !ungespeichert()));
  await nacht(2); await zumStart(); await pg.click('[data-pspiel="2"]'); await pg.waitForTimeout(150);
  ok('Wechsel mit Fortschritt: Frage', /Ungespeicherter Fortschritt auf Speicherplatz 1 \(Sonnenhof, seit/.test(await dlg()));
  await knopf('Nicht speichern'); await lade(); ok('Nicht speichern: Lindenhof läuft', await ev(() => hofName() === 'Lindenhof'));
  // 6. Kopieren und Löschen (Sicherheitsfrage, keine Rücksicherung)
  await zumStart(); await pg.click('[data-pkopie="1"]'); await pg.waitForTimeout(150); ok('Kopieren auf belegten Speicherplatz: Sicherheitsfrage', /Speicherplatz 2 \(.*\) wird ersetzt/.test(await dlg()));
  await knopf('Abbrechen'); await pg.click('[data-pweg="1"]'); await pg.waitForTimeout(150); ok('Löschen: Sicherheitsfrage', /endgültig gelöscht/.test(await dlg()));
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
    const laden = async (n, f) => { await zumStart(); await pg.click('#smLaden'); await pg.waitForTimeout(150); if (await hat('Nicht speichern')) await knopf('Nicht speichern');
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
  ok('keine Seitenfehler', !errs.length, errs.slice(0, 3).join(' | '));
  L.forEach(x => console.log(x.filter(Boolean).join('  '))); const alles = L.every(x => x[0] === '✓'); console.log(alles ? 'alles ok' : 'FEHLER');
  await b.close(); process.exit(alles ? 0 : 1);
})();
