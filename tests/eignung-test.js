// v1004 (Dome 12.11.2026): Eignungsprüfung der Stuten – Verbände, Stutenschau, Hofbesuch, SLP (Feld/Station), Papiere, Bestand, eigene Knöpfe
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x)); const zu = () => { document.getElementById('dlg').hidden = true; };
    zu(); spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 50000; spiel.kal = null; spiel.tag = 1;
    zbBestand();   // neues Spiel: ab jetzt müssen Stuten zur Prüfung
    const mk = (n, g, i, rasse = 'hannoveraner', alter = 6) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; };
    ok('Alle 28 Rassen haben einen Verband', RASSEN.every(r => VERBAND[r.id]), RASSEN.filter(r => !VERBAND[r.id]).map(r => r.id).join());
    const A = mk('Anna', 'Stute', 0), B2 = mk('Berta', 'Stute', 1), C = mk('Carlo', 'Wallach', 2), V = mk('Vicky', 'Stute', 3, 'vollblut'); V.anteile = { vollblut: 100 };
    ok('Neue Stute ist nicht eingetragen', zuchtbuchVon(A) === null, JSON.stringify(zuchtbuchVon(A)));
    ok('Vollblut: Gestütbuch automatisch (Abstammung)', (zuchtbuchVon(V) || {}).n === 'Gestütbuch', JSON.stringify(zuchtbuchVon(V)));
    turnierKalender(); const T = spiel.turniere.filter(zbTermin);
    ok('Frühling: Stutenschau, Feld- und Stationsprüfung im Kalender', ['schau', 'feld', 'station'].every(z => T.some(t => t.pruef[0].zb === z)), T.map(t => t.pruef[0].zb + '@' + t.tag).join());
    // Turnierfenster zeigt keine Zuchtverbands-Termine mehr
    turnierDialog(A, null); ok('Turnierfenster ohne Stutenschau/SLP', !/Stutenschau|Stutenleistungsprüfung/.test($('dlg').textContent), ''); zu();
    // Anhänger-Ziel
    ok('Anhänger: Zuchtverband für Stute frei, Wallach gesperrt', !ANH_ZIEL.zuchtverband.sperre(A, spiel.boxen[0]) && ANH_ZIEL.zuchtverband.sperre(C, spiel.boxen[2]) === 'nur Stuten und Hengste');
    zeigeSchirm(null); zeigeAnhaenger(); const kz = document.querySelector('[data-anhziel="zuchtverband"]'); ok('Kachel „Zuchtverband“ im Hauptmenü-Anhänger', !!kz); if (kz) { kz.click(); ok('Stutenauswahl öffnet', !!document.querySelector('[data-zvw="0"]') && !document.querySelector('[data-zvw="2"]')); document.querySelector('[data-zvw="0"]').click(); }
    ok('Fenster Zuchtverband zeigt Verband', /Hannoveraner Verband/.test($('dlg').textContent), $('dlg').textContent.slice(0, 120));
    // Stutenschau anmelden
    const ts = T.filter(t => t.pruef[0].zb === 'schau').sort((a, b) => a.tag - b.tag)[0], kn = document.querySelector(`[data-zbnenn="${ts.id}"]`);
    ok('Knopf „Anmelden“ bei der Stutenschau', !!kn, ts.tag + ' / ' + spiel.tag); const g0 = spiel.geld; if (kn) kn.click();
    ok('Angemeldet und 60 € bezahlt', ts.nennung.some(n => n.pid === A.id) && g0 - spiel.geld === 60, g0 - spiel.geld);
    ok('Feldprüfung gesperrt, solange nicht eingetragen', /erst ins Zuchtbuch/.test(zbSperre(A, T.find(t => t.pruef[0].zb === 'feld'), { zb: 'feld' })));
    zu();
    // Schau-Tag
    A.dreck = { fell: 0, maehne: 0 }; spiel.tag = ts.tag; turnierMorgen(); ok('Am Schautag außer Haus', !!A.turnier, JSON.stringify(A.turnier));
    const post0 = (spiel.post || []).length; turnierNacht();
    ok('Ergebnis: Noten gespeichert', !!(A.zb && A.zb.noten && A.zb.noten.gesamt), JSON.stringify(A.zb));
    const zA = zuchtbuchVon(A); ok('Stufe ist eine Hannoveraner-Abteilung', zA && ['Hauptstutbuch', 'Stutbuch', 'Vorbuch'].includes(zA.n), JSON.stringify(zA));
    const br = (spiel.post || []).find(x => /Eintragung: Anna/.test(x.betreff || '')); ok('Brief vom Hannoveraner Verband mit Notentabelle', !!br && /Korrektheit des Gangs/.test(br.text), br ? br.text.slice(0, 200) : (spiel.post || []).slice(-2).map(x => x.betreff).join('|'));
    ok('Zweite Eintragung gesperrt', /einmal/.test(zbSperre(A, null, { zb: 'hof' })), zbSperre(A, null, { zb: 'hof' }));
    // Stationsprüfung (reitet selbst an)
    spiel.tag = 1; spiel.kal = null; ts.nennung = []; const st = spiel.turniere.filter(t => zbTermin(t) && t.pruef[0].zb === 'station' && t.tag >= 3 && datum(t.tag + 1).s === datum(t.tag).s).sort((a, b) => a.tag - b.tag)[0];
    ok('Stationsprüfung frei für eingetragene Stute', st && !zbSperre(A, st, st.pruef[0]), st ? zbSperre(A, st, st.pruef[0]) : 'kein Termin');
    if (st) { zuchtverbandDialog(A, null); const k2 = document.querySelector(`[data-zbnenn="${st.id}"]`); const g1 = spiel.geld; if (k2) k2.click(); ok('Station angemeldet (750 + Tierarzt 120)', g1 - spiel.geld === 870, g1 - spiel.geld); zu();
      spiel.tag = st.tag; delete A.turnier; turnierMorgen(); turnierNacht(); ok('Nach dem 1. Tag noch auf der Station', !!A.turnier && !A.zb.slp, JSON.stringify(A.turnier));
      spiel.tag = st.tag + 1; turnierNacht(); ok('Nach dem 2. Tag zurück mit SLP-Note', !A.turnier && A.zb.slp > 0, JSON.stringify(A.zb));
      ok('Brief Stutenleistungsprüfung', (spiel.post || []).some(x => /Stutenleistungsprüfung: Anna/.test(x.betreff || ''))); }
    // Hofbesuch
    spiel.tag = 1; zbHofDialog(B2, () => {}); const tb = document.querySelector('[data-zbtag]'); const g2 = spiel.geld; if (tb) tb.click();
    ok('Hofbesuch gebucht (200 + 60)', (spiel.zbHof || []).some(h => h.pid === B2.id) && g2 - spiel.geld === 260, g2 - spiel.geld);
    const hb = spiel.zbHof.find(h => h.pid === B2.id); spiel.tag = hb.tag; zbNacht(); ok('Hofbesuch: Stute bewertet (eingetragen oder abgelehnt)', !!B2.zb && 'i' in B2.zb, JSON.stringify(B2.zb));
    // Mischling höchstens unterste Abteilung
    const M = mk('Mix', 'Stute', 4); M.anteile = { hannoveraner: 50, shire: 50 }; ok('Mischling erkannt', istMischling(M));
    const iM = zbStufeFinden(M, { typ: 9, koerper: 9, korrekt: 9, schritt: 9, trab: 9, eindruck: 9, gesamt: 9 }); ok('Mischling mit Note 9: nur Vorbuch', iM === VERBAND.hannoveraner.stufen.length - 1, iM);
    // Bestand: alter Spielstand
    const O = mk('Olga', 'Stute', 5); delete spiel.zbAb; delete O.zb; delete O.zbBestand; const zO = zuchtbuchVon(O); ok('Alter Spielstand: Stute gilt als eingetragen', !!zO && O.zb && O.zb.bestand, JSON.stringify(zO));
    // Papiere
    const N = mk('Nina', 'Stute', 2); spiel.zbAb = 0; delete N.zbBestand; delete N.zb; const f = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute', ahnen: { mutter: { nr: N.nr } } }; zbPapiere(f, N);
    ok('Fohlen einer nicht eingetragenen Stute: keine Papiere', f.papiere === false, f.papiere); ok('Wertfaktor ohne Papiere 0,85', Math.abs(zbWertFaktor(f) - 0.85) < 1e-9, zbWertFaktor(f));
    // Kaufpferde: Papiere und Eintragung je Herkunft
    { const quote = q => { let e = 0, pa = 0; for (let i = 0; i < 200; i++) { const k = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 7, name: 'k' + i, id: 'kauf' + q + i }); k.anteile = { hannoveraner: 100 }; k.werte = erzeugeWerte(k); ahnenFuellen(k); zbKauf(k, q); if (zuchtbuchVon(k)) e++; if (k.papiere) pa++; } return [e / 2, pa / 2]; };
      const G = quote('Gestüt'), H = quote('Händler'), TS = quote('Tierschutz'); out.push('ℹ eingetragen/Papiere in %: Gestüt ' + G + ' · Händler ' + H + ' · Tierschutz ' + TS);
      ok('Gestüt meist eingetragen, Händler seltener, Tierschutz kaum', G[0] > 70 && H[0] < 40 && TS[0] < 10 && G[1] === 100, [G, H, TS].join(' | ')); }
    // Marktanzeige zeigt Papiere/Eintragung, Enzyklopädie zeigt Verband und Veredler
    { spiel.markt = null; spiel.marktStand = null; const M = marktNeu(), L = [...M.privat, ...M.auktion.map(a => a.pferd), ...gestuetPferde('hannoveraner'), ...marktpferde()];
      ok('Marktpferde haben ihren Papier-Status schon in der Anzeige', L.every(h => h.zbMarkt), L.filter(h => !h.zbMarkt).length);
      const st = gestuetPferde('hannoveraner').concat(L).find(h => h.geschlecht === 'Stute' && zuchtbuchVon(h)); ok('Anzeige-Kachel nennt die Abteilung', !!st && pferdKachel(st, { ort: 'Gestüt' }).includes('📄 ' + zuchtbuchVon(st).n), st && pferdKachel(st, { ort: 'Gestüt' }));
      ok('Enzyklopädie: Hannoveraner mit Verband und Veredlern', /Hannoveraner Verband/.test(rasseZbHTML('hannoveraner')) && /Trakehner/.test(rasseZbHTML('hannoveraner')) && /Keine Veredler/.test(rasseZbHTML('fjord'))); }
    // Box: Karte Merkmale hat den Knopf
    const html = merkmaleHTML(A, {}, () => '', () => '', () => ''); ok('Karte Merkmale: Knopf Zuchtverband', /data-zuchtverband/.test(html));
    // Notenverteilung (300 Hannoveraner-Stuten, ohne Tageseinfluss): Schnitt um 6–7,5
    const G = []; for (let i = 0; i < 300; i++) { const q = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 5, name: 'q' + i }); q.werte = erzeugeWerte(q); G.push(zbNoten(q).gesamt); }
    const mw = G.reduce((a, x) => a + x, 0) / G.length; out.push('ℹ Notenschnitt Hannoveraner: ' + mw.toFixed(2) + ' · ab 6: ' + Math.round(G.filter(x => x >= 6).length / 3) + ' % · ab 7,5: ' + Math.round(G.filter(x => x >= 7.5).length / 3) + ' %');
    ok('Notenschnitt plausibel (5,5–7,8)', mw > 5.5 && mw < 7.8, mw);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
