// Speicher-Test (v604, PLAN-TIERHALTEVERBOT-SPEICHER.md P2): Anzeige, Warnungen, Aufräumen (Briefe, Spam, Friedhof/Archiv), gekürzte Pferde im Stammbaum, Bestenliste, Friedhof
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/speicher-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('KONSOLE:', m.text()); });
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const out = [];
   try {
    const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = false; spiel.stufenAn = false; spiel.admin = false; spiel.tipps = {}; spiel.tippWarte = [];
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); return p; };
    const knopf0 = t => [...document.querySelectorAll('#dlgKnoepfe button')].find(x => t.test(x.textContent)), knopf = t => knopf0(t) || { click() { throw new Error('Knopf fehlt: ' + t + ' – Fenster: ' + $('dlgInhalt').textContent.slice(0, 160)); } };
    // --- 1. Anzeige ---
    speichernJetzt(); const M0 = speicherMass();
    ok('Speicher wird gemessen (Autospeicher zählt)', M0.ges > 0 && M0.unser['zuchtstall-v2'] > 0 && M0.anteil > 0 && M0.anteil < 0.7, mbTxt(M0.ges) + ' MB');
    ok('Anzeige „Speicher: x von ca. 5 MB belegt“ mit Balken, unauffällig', /von ca\. 5 MB belegt/.test(speicherAnzeigeHTML()) && /class="balken"/.test(speicherAnzeigeHTML()) && !/id="spDatei"/.test(speicherAnzeigeHTML()));
    // --- 2. gelb ab 70 %, rot ab 90 % ---
    localStorage.setItem('zz-fuell', 'x'.repeat(Math.round(SPEICHER_QUOTA * 0.72) - M0.ges)); const gelb = speicherAnzeigeHTML();
    ok('Ab 70 %: gelb mit Hinweis, noch kein Datei-Knopf', /#fff3d1/.test(gelb) && /wird voll/.test(gelb) && !/id="spDatei"/.test(gelb));
    speicherTag = null; spiel.tipps = {}; spiel.tippWarte = []; speicherPruefen();
    ok('Ab 70 %: Hinweisblase „speicherVoll“ wird vorgemerkt (einmal je Tag), keine rote Meldung', (spiel.tippWarte || []).includes('speicherVoll') && !(document.getElementById('speicherWarn') && !document.getElementById('speicherWarn').hidden));
    localStorage.setItem('zz-fuell', 'x'.repeat(Math.round(SPEICHER_QUOTA * 0.93) - M0.ges)); const rot = speicherAnzeigeHTML();
    ok('Ab 90 %: rot, Meldung und Knopf „Jetzt als Datei sichern“', /#fde8e6/.test(rot) && /fast voll/.test(rot) && /id="spDatei"/.test(rot) && /Jetzt als Datei sichern/.test(rot));
    speicherTag = null; speicherPruefen(); const w = document.getElementById('speicherWarn');
    ok('Ab 90 %: rote Meldung oben (wie bei fehlgeschlagenem Speichern) mit Download-Knopf', w && !w.hidden && /fast voll/.test(w.textContent) && !!w.querySelector('#swDatei'));
    speicherTag = spiel.tag; speicherPruefen(); localStorage.removeItem('zz-fuell'); if (w) w.hidden = true;
    ok('Zurück auf unauffällig, wenn Platz frei ist', !/#fde8e6|#fff3d1/.test(speicherAnzeigeHTML()));
    // --- 3. Briefe ---
    const j = jzJetzt(), mk = (i, o) => ({ id: 'b' + i + Math.random().toString(36).slice(2, 5), jz: j - 12, tag: 1, von: 'Test', betreff: 'Brief ' + i, text: 'x'.repeat(200), typ: 'sonstiges', gelesen: true, links: {}, hid: aktivHid(), hofName: 'Testhof', ...o });
    spiel.rechnungen = [{ id: 'r-offen', betrag: 10, von: 'Tierarztpraxis', tag: 1 }];
    spiel.post = [mk('alt1', {}), mk('alt2', {}), mk('stern', { stern: true }), mk('jb', { typ: 'jahresbericht', betreff: 'Jahresbericht 1' }), mk('rech', { aktion: { typ: 'rechnung', rid: 'r-offen' } }), mk('neu', { jz: j - 2 }), mk('ungelesen', { gelesen: false }), mk('spam1', { spam: true }), mk('spam2', { spam: true })];
    const Pl = aufraeumenPlan();
    ok('Plan: nur alte, gelesene Briefe ohne ⭐/Jahresbericht/offene Rechnung/Spam (2 von 9)', Pl.briefe.length === 2 && Pl.briefe.every(x => /alt/.test(x.betreff)), Pl.briefe.map(x => x.betreff).join());
    ok('Plan: Spam-Ordner (2 Briefe)', Pl.spam.length === 2);
    aufraeumenDialog(); ok('Fenster zeigt Häkchen, Größen und Hinweis „Briefe mit ⭐ bleiben immer“', /Gelesene Briefe ohne ⭐/.test($('dlgInhalt').textContent) && /ca\. \d+ KB werden frei/.test($('dlgInhalt').textContent) && /bleiben immer/.test($('dlgInhalt').textContent));
    $('arBriefe').checked = true; $('arSpam').checked = true; knopf(/^Aufräumen/).click();
    ok('Sicherheitsfrage mit Summe („Es werden ca. … KB frei. Sicher?“) – noch nichts gelöscht', /Es werden ca\. .* KB.* frei/.test($('dlgInhalt').textContent) && /Sicher\?/.test($('dlgInhalt').textContent) && spiel.post.length === 9);
    knopf(/^Ja, aufräumen/).click(); zu();
    ok('Nach Bestätigung: alte Briefe und Spam weg, ⭐, Jahresbericht, offene Rechnung, ungelesener und neuer Brief bleiben', spiel.post.length === 5 && ['stern', 'jb', 'rech', 'neu', 'ungelesen'].every(n => spiel.post.some(x => x.betreff.endsWith(n) || x.betreff === 'Jahresbericht 1' && n === 'jb')), spiel.post.map(x => x.betreff).join());
    ok('Danach sofort gespeichert', (lesen(SPEICHER) || { post: [] }).post.length === 5);
    // --- 4. Friedhof und Archiv ---
    const Papa = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 12, name: 'Papa' }); Papa.nr = 'N-Papa'; Papa.erfolge = [{ disz: 'dressur', platz: 1, name: 'Dressur A', tag: 3 }]; Papa.todesursache = 'Altersschwäche'; Papa.nachkommen = 1;
    const Fremd = neu({ rasse: 'araber', geschlecht: 'Stute', alter: 14, name: 'Fremdling' }); Fremd.nr = 'N-Fremd'; Fremd.todesursache = 'Kolik';
    const Gone = neu({ rasse: 'friese', geschlecht: 'Stute', alter: 9, name: 'Verkauft1' }); Gone.nr = 'N-Gone'; Gone.erfolge = [{ disz: 'springen', platz: 2, name: 'Springen A', tag: 3 }]; Gone.schleifen = [{ st: 1, pl: 2, c: false }];
    spiel.friedhof = []; spiel.archiv = {}; begraben(Papa, 'Box 1'); begraben(Fremd, 'Box 2'); archivieren(Gone);
    ok('Archiv merkt, wann ein Pferd abgegeben wurde (archiviertJz)', spiel.archiv[Gone.id].archiviertJz === jzJetzt());
    const kind = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 3, name: 'Fips' }); kind.ahnen = { vater: ahnEintrag(Papa) }; spiel.boxen[0].pferd = kind; spiel.boxen[0].krippeVoll = true;
    const best = spiel.chronik = spiel.chronik || {}; (best[aktivHid()] = best[aktivHid()] || {}).beste = [{ id: Gone.id, n: Gone.name, r: Gone.rasse, e: 3, s: 0, pl: 1, w: 1000 }];
    const alle0 = tierKandidaten(); ok('Kandidaten: 2 Grabsteine + 1 Archiv-Pferd', alle0.length === 3);
    tierAufraeumenDialog(); ok('Liste zeigt jedes Pferd mit Größe, Vorfahre-von-Hinweis und Bestenliste', /Papa/.test($('dlgInhalt').textContent) && /Vorfahre von Fips/.test($('dlgInhalt').textContent) && /in der Bestenliste/.test($('dlgInhalt').textContent) && /ca\. \d+ KB/.test($('dlgInhalt').textContent));
    $('arKinder').checked = true; $('arKinder').dispatchEvent(new Event('change')); ok('Filter „ohne Nachkommen bei dir“ blendet Papa aus', !/Papa/.test($('arListe').textContent) && /Fremdling/.test($('arListe').textContent)); $('arKinder').checked = false; $('arKinder').dispatchEvent(new Event('change'));
    $('arErfolg').checked = true; $('arErfolg').dispatchEvent(new Event('change')); ok('Filter „ohne Turniererfolge“ blendet Papa und Verkauft1 aus', !/Papa|Verkauft1/.test($('arListe').textContent) && /Fremdling/.test($('arListe').textContent)); $('arErfolg').checked = false; $('arErfolg').dispatchEvent(new Event('change'));
    // Papa: Details löschen (Vorfahre von Fips → Warnung im Bestätigungsfenster)
    document.querySelector('[data-ark="f' + Papa.id + '"]').click(); knopf(/^Details löschen/).click();
    ok('Bestätigung warnt: Papa ist Vorfahre von Fips (Stammbaum bleibt, Steckbrief geht verloren)', /Papa/.test($('dlgInhalt').textContent) && /Vorfahre von Fips/.test($('dlgInhalt').textContent) && /Stammbaum bleibt/.test($('dlgInhalt').textContent));
    knopf(/^Ja, kürzen/).click(); const bl = /Bestenliste/.test($('dlgInhalt').textContent) && /Wirklich/.test($('dlgInhalt').textContent); ok('Papa steht (nach dem Tod mit Erfolgen) in der Bestenliste → zusätzliche Sicherheitsfrage', bl); if (bl) knopf(/^Ja, trotzdem/).click(); zu();
    const gP = spiel.friedhof.find(g => g.name === 'Papa');
    ok('Details gelöscht, Grabstein bleibt: Name/Rasse/Todesursache/Bilanz bleiben, Werte, Gene, Erfolge weg', gP && gP.pferd.gekuerzt && gP.pferd.name === 'Papa' && gP.pferd.todesursache === 'Altersschwäche' && !!gP.pferd.bilanz && !gP.pferd.werte && !gP.pferd.gen && !gP.pferd.erfolge && gP.pferd.erfolgeAnzahl === 1);
    ok('Gekürztes Pferd ist deutlich kleiner', JSON.stringify(gP.pferd).length < JSON.stringify(Papa).length / 5, JSON.stringify(gP.pferd).length + ' < ' + JSON.stringify(Papa).length);
    // alles weiter fehlerfrei: Friedhof, Pferdepool, Steckbrief der Tochter, Abstammungsschein, Nachkommen, Bestenliste, Abstammungs-Zuschlag
    let fehler = ''; const probe = (n, f) => { try { f(); } catch (e) { fehler += n + ': ' + e.message + ' | '; } };
    probe('Friedhof', () => zeigeFriedhof()); ok('Friedhof zeigt das gekürzte Grab mit Klick auf den Grabstein', !!document.querySelector('[data-grabdetail]') && /Papa/.test(document.getElementById('nebenSchirm').textContent));
    probe('Grabstein-Fenster', () => { grabsteinDialog(gP.pferd); }); ok('Grabstein-Fenster zeigt Name, Todesursache und den Hinweis auf gelöschte Details', /Papa/.test($('dlgInhalt').textContent) && /Altersschwäche/.test($('dlgInhalt').textContent) && /Details .* gelöscht/.test($('dlgInhalt').textContent)); zu();
    probe('Pferdepool', () => pferdePool()); ok('Gekürzte Pferde stehen nicht mehr im Pferdepool (keine kaputten Links)', !pferdePool().some(x => x.p.gekuerzt));
    probe('Abstammungsschein', () => abstammungsschein(kind)); probe('Abstammungs-Zuschlag', () => abstFaktor(kind)); probe('Marktwert', () => marktwert(kind)); probe('Nachkommen', () => nachkommenFenster(Papa)); zu();
    probe('Bestenliste', () => bestenKarteHTML()); probe('Brief-Links', () => briefLinks('<b>Papa</b> und <b>Verkauft1</b>', [])); probe('Reiter-Seite', () => reiterHTML());
    ok('Stammbaum, Zuschlag, Marktwert, Nachkommen, Bestenliste, Briefe, Reiter-Seite laufen mit gekürzten Pferden fehlerfrei', fehler === '', fehler);
    // Bestenliste: zusätzliche Sicherheitsfrage beim Löschen
    tierAufraeumenDialog(); document.querySelector('[data-ark="a' + Gone.id + '"]').click(); knopf(/^Ganz löschen/).click(); knopf(/^Ja, löschen/).click();
    ok('Pferd aus der Bestenliste: zusätzliche Sicherheitsfrage, noch nichts gelöscht', /Bestenliste/.test($('dlgInhalt').textContent) && /Wirklich/.test($('dlgInhalt').textContent) && !!spiel.archiv[Gone.id]);
    knopf(/^Ja, trotzdem/).click(); zu(); ok('Nach „Ja, trotzdem“: Pferd ganz gelöscht', !spiel.archiv[Gone.id]);
    // Fremdling ganz löschen (kein Vorfahre, keine Bestenliste: keine Zusatzfrage)
    tierAufraeumenDialog(); document.querySelector('[data-ark="f' + Fremd.id + '"]').click(); knopf(/^Ganz löschen/).click(); knopf(/^Ja, löschen/).click(); if (/Bestenliste/.test($('dlgInhalt').textContent)) knopf(/^Ja, trotzdem/).click(); zu();
    ok('Fremdling ganz gelöscht, Papa-Grabstein bleibt', !spiel.friedhof.some(g => g.name === 'Fremdling') && spiel.friedhof.some(g => g.name === 'Papa'));
    tierAufraeumenDialog(); document.querySelector('[data-ark="f' + Papa.id + '"]').click(); knopf(/^Details löschen/).click(); zu(); tierAufraeumenDialog(); document.querySelector('[data-ark="f' + Papa.id + '"]').click(); knopf(/^Details löschen/).click();
    ok('Schon gekürzte Pferde: „Details löschen“ meldet, dass nur „Ganz löschen“ geht', /schon gekürzte Pferde lassen sich nur ganz löschen/.test($('dlgInhalt').textContent)); zu();
    // Speichern/Laden bleibt in Ordnung
    speichernJetzt(); const L = lesen(SPEICHER); ok('Gespeichert und wieder gelesen: gekürztes Grab ist da', L && L.friedhof.some(g => g.pferd.gekuerzt && g.pferd.name === 'Papa'));
    const dat = standDatei(L); const rt = JSON.parse(JSON.stringify(dat)); ok('Datei-Export/-Import: gekürztes Pferd übersteht die Datei', rt.spiel.friedhof.some(g => g.pferd.gekuerzt));
    // Rücksicherung gibt es nicht mehr, Platz „Verloren“ als Ersatz
    schreiben(VERLOREN_KEY, { meta: { hof: 'X', datum: 'Y' }, spiel: { tag: 1 } }); const Pv = aufraeumenPlan(); ok('Platz „Verloren“ wird als Aufräum-Punkt erkannt (Größe > 0)', Pv.verloren > 0); loeschen(VERLOREN_KEY);
    } catch (e) { out.push('✗ Abbruch: ' + e.message); }
    return out;
  });
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
