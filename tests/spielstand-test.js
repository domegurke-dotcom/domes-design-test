// Spielstand-Test (PLAN-SPIELSTAND.md): Autospeicher, Platz 1/2, selbst speichern, Wechsel mit/ohne ungespeicherten Fortschritt, Kopieren, Löschen,
// Rücksicherung, Speicher voll, Spiel verloren, alter Spielstand → Platz 1, gepackt speichern, Datei speichern/laden.
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/spielstand-test.js
// Erwartet: jede Zeile „✓“ und am Ende „alles ok“.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const URL_ = 'file://' + path.resolve(__dirname, '..', 'index.html');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, info = '') => L.push([c ? '✓' : '✗', n, info]);
  const ev = (f, a) => pg.evaluate(f, a);
  const knopf = async t => { const k = pg.locator('#dlgKnoepfe button', { hasText: t }).first(); await k.click(); await pg.waitForTimeout(150); };
  const neuesSpiel = async (name, hof, platzText) => {
    await pg.click('#smNeu'); await pg.waitForTimeout(150);
    if (platzText) { await knopf(platzText); if (await pg.locator('#dlgKnoepfe button', { hasText: 'Ersetzen' }).count()) await knopf('Ersetzen'); if (await pg.locator('#dlgKnoepfe button', { hasText: 'Nicht speichern' }).count()) await knopf('Nicht speichern'); }
    await pg.fill('#chName', name); await pg.click('#chLos'); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', hof); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200);
  };
  const zumStart = () => ev(() => { document.getElementById('dlg').hidden = true; zeigeStart(); });
  const nacht = n => ev(n => { for (let i = 0; i < n; i++) { naechsteNacht(); document.getElementById('dlg').hidden = true; } speichern(); speichernJetzt(); }, n);
  const lade = async () => { await pg.waitForLoadState('load'); await pg.waitForTimeout(700); };

  await pg.goto(URL_); await ev(() => localStorage.clear()); await pg.reload(); await lade();

  // 1. Neues Spiel (beide Plätze frei → Platz 1 ohne Frage)
  await neuesSpiel('Anna', 'Sonnenhof');
  let r = await ev(() => ({ id: spiel.spielId, platz: spiel.platz, p1: (lesenPlatz(1) || {}).meta, auto: localStorage.getItem('zuchtstall-v2')[0], p1roh: localStorage.getItem('zuchtstall-p1')[0], ung: ungespeichert() }));
  ok('Neues Spiel: Spiel-Nummer und Platz 1', !!r.id && r.platz === 1);
  ok('Neues Spiel liegt sofort auf Platz 1', r.p1 && r.p1.hof === 'Sonnenhof' && r.p1.spielId === r.id);
  ok('Autospeicher und Platz sind gepackt gespeichert', r.auto !== '{' && r.p1roh !== '{');
  ok('direkt nach dem Start nichts ungespeichert', r.ung === false);

  // 2. Spielen → ungespeichert → selbst speichern (Menü)
  await nacht(3);
  ok('nach 3 Tagen: ungespeicherter Fortschritt', await ev(() => ungespeichert()));
  await ev(() => { document.getElementById('dlg').hidden = true; }); await pg.click('#menueKnopf'); await pg.click('#mSpeichern'); await pg.waitForTimeout(150);
  r = await ev(() => ({ txt: document.getElementById('dlgInhalt').textContent, ung: ungespeichert(), tag: (lesenPlatz(1) || {}).meta.tag, jetzt: spiel.tag }));
  ok('Menü – Spiel speichern: Meldung „Gespeichert auf Platz 1 (Sonnenhof, …)“', /Gespeichert auf Platz 1 \(Sonnenhof, /.test(r.txt), r.txt);
  ok('nach dem Speichern nichts ungespeichert, Platz 1 hat den Tag', !r.ung && r.tag === r.jetzt);

  // 3. Neues Spiel auf Platz 2 (mit ungespeichertem Fortschritt → Frage)
  await nacht(2); await zumStart();
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await knopf('Platz 2');
  r = await ev(() => document.getElementById('dlgInhalt').textContent);
  ok('Neues Spiel bei ungespeichertem Fortschritt: Frage „Jetzt speichern?“', /Ungespeicherter Fortschritt auf Platz 1/.test(r), r);
  await knopf('Speichern'); await pg.fill('#chName', 'Ben'); await pg.click('#chLos'); await pg.waitForTimeout(150); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Lindenhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200);
  r = await ev(() => ({ p1: lesenPlatz(1).meta, p2: lesenPlatz(2).meta, hof: hofName(), platz: spiel.platz, id1: lesenPlatz(1).spiel.spielId, id2: spiel.spielId }));
  ok('Platz 1 wurde vorher gespeichert (Sonnenhof, weiter als vorher)', r.p1.hof === 'Sonnenhof' && r.p1.tag > 1);
  ok('neues Spiel Lindenhof läuft auf Platz 2 mit eigener Spiel-Nummer', r.hof === 'Lindenhof' && r.platz === 2 && r.p2.hof === 'Lindenhof' && r.id1 !== r.id2);

  // 4. Startmenü zeigt drei Zeilen mit Hofnamen
  await zumStart();
  r = await ev(() => document.getElementById('startMenue').innerText);
  ok('Startmenü: Weiterspielen – Lindenhof · läuft … (Platz 2)', /Weiterspielen – Lindenhof/.test(r) && /\(Platz 2\)/.test(r));
  ok('Startmenü: Platz 1 – Sonnenhof, Platz 2 – Lindenhof', /Platz 1\s*Sonnenhof · gespeichert/.test(r) && /Platz 2\s*Lindenhof · gespeichert/.test(r), r.slice(0, 300));

  // 5. Platz wechseln ohne ungespeicherten Fortschritt → direkt, nach Neuladen läuft Sonnenhof
  await pg.click('[data-pspiel="1"]'); await lade();
  r = await ev(() => ({ hof: hofName(), platz: spiel.platz, offen: document.getElementById('startMenue').classList.contains('offen'), ung: ungespeichert() }));
  ok('Wechsel auf Platz 1: Sonnenhof läuft, direkt im Spiel', r.hof === 'Sonnenhof' && r.platz === 1 && !r.offen);
  ok('nach dem Wechsel kein „ungespeicherter Fortschritt“', r.ung === false);

  // 6. Wechsel mit ungespeichertem Fortschritt: „Nicht speichern“ verwirft, „Abbrechen“ bleibt
  await nacht(2); const tagVorher = await ev(() => spiel.tag); await zumStart();
  await pg.click('[data-pspiel="2"]'); await pg.waitForTimeout(150);
  ok('Wechsel mit Fortschritt: Frage erscheint', /Ungespeicherter Fortschritt auf Platz 1 \(Sonnenhof, seit/.test(await ev(() => document.getElementById('dlgInhalt').textContent)));
  await knopf('Abbrechen'); ok('Abbrechen: Sonnenhof läuft weiter', await ev(() => hofName() === 'Sonnenhof'));
  await pg.click('[data-pspiel="2"]'); await pg.waitForTimeout(150); await knopf('Nicht speichern'); await lade();
  r = await ev(() => ({ hof: hofName(), p1tag: lesenPlatz(1).meta.tag }));
  ok('Nicht speichern: Lindenhof läuft, Platz 1 hat den alten Stand', r.hof === 'Lindenhof' && r.p1tag < tagVorher);

  // 7. Kopieren, Rücksicherung, rückgängig
  await zumStart(); await pg.click('[data-pkopie="1"]'); await pg.waitForTimeout(150); await knopf('Kopieren');
  r = await ev(() => ({ p2: lesenPlatz(2).meta.hof, r: (lesen('zuchtstall-rueck') || {}).platz, rh: ((lesen('zuchtstall-rueck') || {}).meta || {}).hof, knopf: !!document.getElementById('smRueck') }));
  ok('Kopieren 1 → 2: Platz 2 = Sonnenhof, Lindenhof in der Rücksicherung', r.p2 === 'Sonnenhof' && r.r === 2 && r.rh === 'Lindenhof' && r.knopf);
  await pg.click('#smRueck'); await pg.waitForTimeout(150); await knopf('Rückgängig');
  r = await ev(() => ({ p2: lesenPlatz(2).meta.hof, rh: ((lesen('zuchtstall-rueck') || {}).meta || {}).hof }));
  ok('Rückgängig: Platz 2 wieder Lindenhof (Sonnenhof-Kopie in der Rücksicherung)', r.p2 === 'Lindenhof' && r.rh === 'Sonnenhof');
  await pg.click('[data-pweg="2"]'); await pg.waitForTimeout(150); await knopf('Löschen');
  ok('Löschen: Platz 2 frei, Rücksicherung = Lindenhof', await ev(() => !lesenPlatz(2) && lesen('zuchtstall-rueck').meta.hof === 'Lindenhof'));
  await pg.click('#smRueck'); await pg.waitForTimeout(150); await knopf('Rückgängig');
  ok('Löschen rückgängig: Platz 2 wieder Lindenhof', await ev(() => lesenPlatz(2) && lesenPlatz(2).meta.hof === 'Lindenhof'));

  // 8. Speicher voll: rote Meldung höchstens 1× je Spieltag
  r = await ev(() => { const alt = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new Error('QuotaExceededError'); };
    const w = () => { const e = document.getElementById('speicherWarn'); return !!e && !e.hidden; };
    spiel.geld += 1; speichern(); speichernJetzt(); const a = w(); document.getElementById('speicherWarn').hidden = true;
    spiel.geld += 1; speichern(); speichernJetzt(); const b2 = w();
    spiel.tag++; spiel.geld += 1; speichern(); speichernJetzt(); const c = w(); const txt = document.getElementById('speicherWarn').textContent; spiel.tag--;
    Storage.prototype.setItem = alt; document.getElementById('speicherWarn').hidden = true; spiel.geld -= 3; speichern(); speichernJetzt(); return { a, b: b2, c, txt }; });
  ok('Speicher voll: rote Meldung erscheint', r.a && /konnte nicht gespeichert werden/.test(r.txt) && /Jetzt als Datei sichern/.test(r.txt));
  ok('Speicher voll: am selben Tag nicht nochmal, am nächsten Tag wieder', !r.b && r.c);

  // 9. Datei speichern (Autospeicher): Format und Dateiname
  await zumStart(); await pg.click('[data-pspiel="1"]'); await lade();
  const [dl] = await Promise.all([pg.waitForEvent('download'), ev(() => dateiSpeichern('auto'))]);
  const name = await ev(() => dateiName(spiel)), datei = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));   // Name aus dateiName(): der Test-Chromium verwirft Download-Namen mit Umlaut
  ok('Datei: Name Zuchtstall_Sonnenhof_JahrXX-Jahreszeit_JJJJ-MM-TT.json', /^Zuchtstall_Sonnenhof_Jahr\d\d-(Frühling|Sommer|Herbst|Winter)_\d{4}-\d\d-\d\d\.json$/.test(name), name);
  ok('Datei: Format (typ, format 1, version, spielId, info, spiel – lesbar, nicht gepackt)', datei.typ === 'zuchtstall-spielstand' && datei.format === 1 && !!datei.version && !!datei.spielId && datei.info && datei.info.hoefe[0] === 'Sonnenhof' && datei.spiel && datei.spiel.boxen);
  ok('nach dem Datei-Sichern: „zuletzt als Datei gesichert“ gemerkt', await ev(() => !!(spiel.zuletztExport && spiel.zuletztExport.am)));

  // 10. Spiel verloren: Autospeicher weg, Plätze bleiben, vom Speicherstand neu starten
  await ev(() => { document.getElementById('dlg').hidden = true; platzSpeichern(true); spiel.verloren = { tag: spiel.tag, jz: jzJetzt(), kredit: 'Hofkredit', offen: 3, schuld: 1000, pferde: 0 }; spielVerloren(); });
  r = await ev(() => ({ auto: localStorage.getItem('zuchtstall-v2'), p1: !!lesenPlatz(1), p2: !!lesenPlatz(2), knopf: (document.getElementById('vlPlatz') || {}).textContent || '' }));
  ok('Spiel verloren: Autospeicher gelöscht, Platz 1 und 2 bleiben', r.auto === null && r.p1 && r.p2);
  ok('Spiel verloren: Knopf „Vom letzten Speicherstand neu starten (Platz 1, Sonnenhof …)“', /Vom letzten Speicherstand neu starten/.test(r.knopf) && /Platz 1, Sonnenhof/.test(r.knopf), r.knopf);
  await pg.click('#vlPlatz'); await lade();
  ok('Neustart vom Speicherstand: Sonnenhof läuft wieder', await ev(() => hatSpielstand && hofName() === 'Sonnenhof' && !spiel.verloren));

  // 11. Alter Spielstand (vor S1, ungepackt, ohne Spiel-Nummer) → Autospeicher + Platz 1, Turnier-Sortierung übernommen
  const alt = await ev(() => { const s = JSON.parse(JSON.stringify(spiel)); delete s.spielId; delete s.platz; delete s.tsort; delete s.zuletztExport; return JSON.stringify(s); });
  await ev(a => { speicherSperre = true; localStorage.clear(); localStorage.setItem('zuchtstall-v2', a); localStorage.setItem('zuchtstall-tsort', 'disz'); }, alt);
  await pg.reload(); await lade();
  r = await ev(() => ({ id: spiel.spielId, platz: spiel.platz, p1: (lesenPlatz(1) || {}).meta, tsort: spiel.tsort, roh: localStorage.getItem('zuchtstall-v2')[0], ung: ungespeichert() }));
  ok('alter Spielstand: Spiel-Nummer, Platz 1 und Kopie auf Platz 1', !!r.id && r.platz === 1 && r.p1 && r.p1.spielId === r.id);
  ok('alter Spielstand: jetzt gepackt, Turnier-Sortierung übernommen, nichts ungespeichert', r.roh !== '{' && r.tsort === 'disz' && r.ung === false);

  // 12. Größe: gepackt deutlich kleiner
  r = await ev(() => ({ j: JSON.stringify(spiel).length, p: localStorage.getItem('zuchtstall-v2').length }));
  ok('gepackt kleiner als ungepackt (' + r.j + ' → ' + r.p + ' Zeichen)', r.p < r.j / 2);

  ok('keine Seitenfehler', !errs.length, errs.slice(0, 3).join(' | '));
  L.forEach(x => console.log(x.filter(Boolean).join('  ')));
  const alles = L.every(x => x[0] === '✓'); console.log(alles ? 'alles ok' : 'FEHLER');
  await b.close(); process.exit(alles ? 0 : 1);
})();
