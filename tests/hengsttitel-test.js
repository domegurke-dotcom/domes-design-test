// Hengst-Titel (Etappe A2, 27.11.2026): Prämienhengst, Leistungshengst, Elitehengst, Hauptprämiensieger, Islandpferde-Prämienbuch, Noriker, Friesen; dazu Körnoten Oldenburger 7,0 / Holsteiner HLP 7,8
// Start: $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/hengsttitel-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 300000;
    const o = {}, mk = (rasse, n, alter) => { const p = neuesPferd({ rasse, geschlecht: 'Hengst', alter, name: n }); p.anteile = { [rasse]: 100 }; p.werte = p.werte || erzeugeWerte(p); p.papiere = true; return p; };
    const noten = { typ: 8, koerper: 8, korrekt: 7, schritt: 8, trab: 8, eindruck: 8, gesamt: 7.8 }, nach = (rasse, n) => { const q = mk(rasse, n, 6); q.zb = { i: 0, gesamt: 7, tag: spiel.tag, leist: 1 }; return q; };
    o.noten = [HENGST.oldenburger.note, HENGST.holsteiner.lp.note, HENGST.hannoveraner.lp.note];
    // Hannoveraner: Prämienhengst, Leistungshengst, Elitehengst
    const h = mk('hannoveraner', 'Hektor', 10); h.hb = { s: 'vorl', noten, gesamt: 7.8, tag: spiel.tag };
    o.vorl = hengstEhren(h).map(x => [x.k, x.ok]);
    h.hb.s = 'end'; h.hb.lp = 7.2; o.lp72 = hengstEhren(h).filter(x => x.ok).map(x => x.k);
    h.hb.lp = 7.6; o.lp76 = hengstEhren(h).filter(x => x.ok).map(x => x.k);
    h.hb.noten = { ...noten, korrekt: 5 }; o.min5 = hengstEhren(h).find(x => x.k === 'praem').ok; h.hb.noten = noten;
    h.kinder = [nach('hannoveraner', 'K1')]; o.e10 = hengstEhren(h).find(x => x.k === 'elite').ok;
    h.kinder.push(nach('hannoveraner', 'K3')); o.e15 = hengstEhren(h).find(x => x.k === 'elite').ok;
    const w0 = marktwert(h); h.hb.titel = { praem: spiel.tag, elite: spiel.tag }; const w1 = marktwert(h); o.faktor = Math.round(w1 / w0 * 100) / 100; o.namen = hengstTitelNamen(h); o.text = hengstText(h);
    // Altbestand ohne echte Körung bekommt keinen Titel
    const a = mk('hannoveraner', 'Alt', 40); a.hb = { s: 'end', bestand: true, tag: spiel.tag }; o.altLeer = hengstEhren(a).length === 0;
    // Oldenburger: Hauptprämiensieger nur mit 8 Fohlen
    const ol = mk('oldenburger', 'Olaf', 40); ol.hb = { s: 'end', noten, gesamt: 7.8, lp: 7.6, tag: spiel.tag };
    ol.kinder = Array.from({ length: 7 }, (_, i) => { const q = nach('oldenburger', 'F' + i); return q; }); o.ol7 = hengstEhren(ol).find(x => x.k === 'haupt').ok;
    ol.kinder.push(nach('oldenburger', 'F8')); o.ol8 = hengstEhren(ol).find(x => x.k === 'haupt').ok;
    // Island: Prämienbuch ab 6 J., FIZO 8,2
    const is = mk('isi', 'Ísak', 5); is.hb = { s: 'end', noten, gesamt: 7.8, lp: 8.3, tag: spiel.tag }; o.is5 = hengstEhren(is).find(x => x.k === 'praemb').ok;
    const is6 = mk('isi', 'Ísak6', 6); is6.hb = { s: 'end', noten, gesamt: 7.8, lp: 8.1, tag: spiel.tag }; o.is81 = hengstEhren(is6).find(x => x.k === 'praemb').ok; is6.hb.lp = 8.2; o.is82 = hengstEhren(is6).find(x => x.k === 'praemb').ok;
    // Noriker: 15 Nachkommen
    const no = mk('noriker', 'Nero', 4 * 8); no.hb = { s: 'end', noten, gesamt: 7.8, lp: 7.2, tag: spiel.tag };
    no.kinder = Array.from({ length: 14 }, (_, i) => nach('noriker', 'N' + i)); o.no14 = hengstEhren(no).find(x => x.k === 'praemh').ok; no.kinder.push(nach('noriker', 'N15')); o.no15 = hengstEhren(no).find(x => x.k === 'praemh').ok;
    // Friese: Stern ab Prüfung 7,0
    const fr = mk('friese', 'Fritz', 4 * 8); fr.hb = { s: 'end', noten, gesamt: 7.8, lp: 6.9, tag: spiel.tag }; o.fr69 = hengstEhren(fr).find(x => x.k === 'stern').ok; fr.hb.lp = 7.1; o.fr71 = hengstEhren(fr).find(x => x.k === 'stern').ok;
    // keine Titel für Rassen ohne belegte Hengst-Titel
    const ar = mk('araber', 'Ali', 4 * 8); ar.hb = { s: 'end', noten, gesamt: 7.8, tag: spiel.tag }; o.araber = hengstEhren(ar).length;
    o.wapGold = /<svg/.test(hengstWappen(h)); h.hb.s = 'vorl'; o.wapSilber = /<svg/.test(hengstWappen(h)); h.hb.s = 'end'; const un = mk('hannoveraner', 'Ungekoert', 10); o.wapNein = hengstWappen(un) === ''; o.stAbz = /<svg/.test(stutenTitelAbz('Elitestute')) && stutenTitelAbz('') === '';
    // A0: Quarter, Paint, Appaloosa mit echter Körung und Titeln
    o.westH = ['quarter', 'paint', 'appaloosa'].map(r => [HENGST[r].sys, HENGST[r].note, HENGST[r].lp && HENGST[r].lp.note]);
    const qh = mk('quarter', 'Quirin', 6); qh.hb = { s: 'end', noten, gesamt: 7.8, lp: 7.2, tag: spiel.tag };
    o.q0 = hengstEhren(qh).filter(x => x.ok).map(x => x.k);
    qh.erfolge = [{ disz: 'reining', stufe: 3, plaziert: true, platz: 1, von: 40 }, { disz: 'reining', stufe: 3, plaziert: true, platz: 1, von: 40 }]; delete qh.zbZ; qh.zbZ = { s: 0, vsS: 0, m: 0, mAlle: 0, vs: 0, vsM: 0, vsL: 0, wp: { reining: 12 } };
    o.qRom = hengstEhren(qh).filter(x => x.ok).map(x => x.k);
    const mkK = (i) => { const q = mk('quarter', 'Q' + i, 3); q.papiere = true; q.ahnen = { mutter: { nr: 'm' + (i % 3) } }; return q; }; qh.kinder = [0, 1, 2, 3, 4].map(mkK);
    o.qElite = hengstEhren(qh).filter(x => x.ok).map(x => x.k);
    const ph = mk('paint', 'Pablo', 5); ph.hb = { s: 'end', noten: { ...noten, korrekt: 5 }, gesamt: 7.6, lp: 7.1, tag: spiel.tag }; o.paint = hengstEhren(ph).filter(x => x.ok).map(x => x.k);
    const ap = mk('appaloosa', 'Apo', 6); ap.hb = { s: 'end', noten, gesamt: 7.6, lp: 7.6, tag: spiel.tag }; o.appa = hengstEhren(ap).filter(x => x.ok).map(x => x.k);
    // Siegerhengst: nur FN-Rassen, nur bei sehr guter Körung
    const sieg = []; for (let i = 0; i < 60; i++) { const s = mk('westfale', 'S' + i, 5); s.hb = null; sieg.push(s); }
    let sg = 0, kg = 0, fehl = ''; try { for (let i = 0; i < 40; i++) { const s = mk('westfale', 'S' + i, 5); spiel.boxen[0].pferd = s; hengstKoerung(s, 'Test', Math.random); if (s.hb && (s.hb.s === 'vorl' || s.hb.s === 'end')) kg++; if (s.hb && s.hb.titel && s.hb.titel.sieger) sg++; } } catch (e) { fehl = e.message; }
    o.sieg = { sg, kg, fehl };
    // Fenster mit echten Klicks
    spiel.boxen[0].pferd = h; spiel.boxen[0].tot = false; hengstVerbandDialog(h, () => {}); o.dlgTitel = !!document.querySelector('[data-hvtitel]') === false ? 'keine Knöpfe (beide Titel verliehen)' : 'Knopf da';
    const dlgText = document.getElementById('dlg').innerText; o.dlgHatTitel = /Prämienhengst/.test(dlgText) && /Elitehengst/.test(dlgText);
    h.hb.titel = {}; hengstVerbandDialog(h, () => {}); o.knoepfe = document.querySelectorAll('[data-hvtitel]').length;
    return o;
  });
  ok('Körnote Oldenburger 7,0, Holsteiner HLP 7,8, Hannoveraner HLP 7,0', JSON.stringify(r.noten) === JSON.stringify([7, 7.8, 7]), JSON.stringify(r.noten));
  ok('vorläufig im Hengstbuch: nur Prämienhengst offen, Leistungs-/Elitehengst nicht', JSON.stringify(r.vorl.map(x => x[1])) === JSON.stringify([false, false, false]), JSON.stringify(r.vorl));
  ok('Prüfung 7,2: noch kein Titel; 7,6: Prämienhengst + Leistungshengst', r.lp72.length === 0 && r.lp76.includes('praem') && r.lp76.includes('leist') && !r.lp76.includes('elite'), JSON.stringify([r.lp72, r.lp76]));
  ok('Teilnote 5 verhindert Prämienhengst', r.min5 === false);
  ok('Elitehengst erst ab 10 Punkten (1 Kind = 5, 3 = 15)', r.e10 === false && r.e15 === true, [r.e10, r.e15].join());
  ok('Titel erhöhen Marktwert (×1,2) und stehen in Namen/Text', r.faktor > 1.1 && r.namen.length === 2 && /Prämienhengst/.test(r.text), r.faktor + ' ' + r.namen.join());
  ok('Altbestand-Hengst ohne Körung: keine Titel', r.altLeer === true);
  ok('Oldenburger Hauptprämiensieger: 7 Fohlen nein, 8 ja', r.ol7 === false && r.ol8 === true, [r.ol7, r.ol8].join());
  ok('Island: Prämienbuch erst ab 6 J. und FIZO 8,2', r.is5 === false && r.is81 === false && r.is82 === true, [r.is5, r.is81, r.is82].join());
  ok('Noriker: Prämienhengstbuch ab 15 Nachkommen', r.no14 === false && r.no15 === true, [r.no14, r.no15].join());
  ok('Friese: Stern-Hengst ab Prüfung 7,0', r.fr69 === false && r.fr71 === true, [r.fr69, r.fr71].join());
  ok('Araber: keine eigenen Hengst-Titel', r.araber === 0);
  ok('Fenster zeigt Titel; Knöpfe zum Beantragen vorhanden', r.dlgHatTitel === true && r.knoepfe >= 1, r.knoepfe);
  ok('Wappen: gekörter Hengst ja (gold/silber), ungekörter nein, Stuten-Titel-Abzeichen', r.wapGold && r.wapSilber && r.wapNein && r.stAbz, JSON.stringify([r.wapGold, r.wapSilber, r.wapNein, r.stAbz]));
  ok('Quarter/Paint/Appaloosa: echte Körung (koer) mit Noten und Leistungsprüfung', JSON.stringify(r.westH) === JSON.stringify([['koer', 7.5, 7], ['koer', 7, 7], ['koer', 7, 7.5]]), JSON.stringify(r.westH));
  ok('Quarter: Leistungszuchthengst (Prüfung 7,0), noch kein ROM/Elite', r.q0.includes('leistzucht') && !r.q0.includes('leistsport') && !r.q0.includes('elitew'), JSON.stringify(r.q0));
  ok('Quarter: mit ROM Leistungssporthengst', r.qRom.includes('leistsport'), JSON.stringify(r.qRom));
  ok('Quarter: 5 Nachkommen aus 3 Stuten = Elitehengst, dazu Premium- und Supremehengst', ['elitew', 'premium', 'supreme'].every(k => r.qElite.includes(k)), JSON.stringify(r.qElite));
  ok('Paint: Prämienhengst nur ohne Teilnote unter 5,0 (hier 5 → ja), kein Elitehengst', r.paint.includes('praemp') && !r.paint.includes('elitep'), JSON.stringify(r.paint));
  ok('Appaloosa: Prämienhengst (LG I) und Prämien-Sportleistungshengst', r.appa.includes('praema') && r.appa.includes('spleist') && !r.appa.includes('elitea'), JSON.stringify(r.appa));
  ok('Siegerhengst: Körung läuft ohne Fehler, Sieger nur unter den Gekörten', !r.sieg.fehl && r.sieg.sg <= r.sieg.kg, JSON.stringify(r.sieg));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(x => x[0] === '✗') ? 1 : 0);
})();
