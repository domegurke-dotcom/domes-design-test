// Ablauftest Zucht und Kolik-OP (v535–v537): Decken (Natursprung/Besamung/Tiefgefrier), Trächtigkeitsuntersuchung, stille Rosse, Geburt, Fohlenrosse, Kolik-OP
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/zucht-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.geld = 1e6; spiel.admin = false;
    const g0 = spiel.boxen[0]; while (spiel.boxen.length < 12) spiel.boxen.push({ nr: spiel.boxen.length + 1, pferd: null, krippeVoll: false, mistig: false, mistStufe: 0, tot: false, geb: g0.geb, stufe: g0.stufe });
    spiel.boxen.slice(8, 12).forEach(x => { x.abfohl = true; });
    const neu = (o) => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    const knoepfe = () => [...document.querySelectorAll('#dlgKnoepfe button')].map(x => x.textContent);
    const klick = t => { const k = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => t.test(x.textContent)); if (k) k.click(); return !!k; };
    const weiter = () => { if ([...document.querySelectorAll('#dlgKnoepfe button')].some(x => /Trotzdem/.test(x.textContent))) klick(/Trotzdem/); };   // Warnung „keine freie Box“ wegklicken
    const nacht = (n = 1) => { for (let i = 0; i < n; i++) { naechsteNacht(); zu(); } };
    // --- 1. Deck-Fenster ---
    const S = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 7, name: 'Stella' }), H = neu({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 9, name: 'Hektor' });
    spiel.boxen[0].pferd = S; spiel.boxen[1].pferd = H; aktBox = 0;
    while (datum().s > 1) nacht();   // Frühling/Sommer
    verpaaren(S, H); weiter(); let k = knoepfe();
    ok('Eigener Hengst: Natursprung + Besamung, kein Tiefgefrier', k.some(x => /Natursprung/.test(x)) && k.some(x => /Besamung/.test(x)) && !k.some(x => /Tiefgefrier/.test(x)), k.join(' | '));
    const txt = document.getElementById('dlgInhalt').innerText; ok('Chancen im Fenster', /Chance je Rosse etwa \d+ %/.test(txt));
    const ch = a => Math.round(deckChance(S, H, a) * 100); ok('Chance Besamung (frisch) ≈ Natursprung', Math.abs(ch('besamung') - ch('natur')) <= 6, `Natur ${ch('natur')} %, Besamung ${ch('besamung')} %`);
    zu();
    // Deckstation: alle drei
    const D = deckhengste(S)[0]; verpaaren(S, D); weiter(); k = knoepfe(); ok('Deckstation: Tiefgefrier wählbar', k.some(x => /Tiefgefrier/.test(x)), k.join(' | ')); zu();
    // --- 2. Decken Natursprung, Trächtigkeitsuntersuchung ---
    S.pflege.gesundheit = 100; const gAlt = spiel.geld; verpaaren(S, H); weiter(); klick(/Natursprung/); zu();
    ok('Nach dem Decken: gedeckt, noch nicht tragend', !!S.gedeckt && !S.traechtig); ok('Sperre „gerade gedeckt“', zuchtSperre(S, spiel.boxen[0]) === 'gerade gedeckt', zuchtSperre(S, spiel.boxen[0]));
    traechtigkeitsUntersuchung(S, () => {}); ok('Untersuchung am selben Tag: zu früh', /zu früh/.test(document.getElementById('dlgInhalt').innerText)); zu();
    // erzwingen: erfolg true
    S.gedeckt.erfolg = true; S.gedeckt.verlust = null; nacht(1); const g1 = spiel.geld;
    traechtigkeitsUntersuchung(S, () => {}); ok('Untersuchung nach 1 Tag: tragend', /Tragend/.test(document.getElementById('dlgInhalt').innerText)); ok('Untersuchung kostet 60 €', g1 - spiel.geld === TU_PREIS, String(g1 - spiel.geld)); zu();
    nacht(2); ok('Nach 3 Tagen mit Ultraschall: sicher tragend', !!S.traechtig && S.traechtig.sicher === true && !S.gedeckt, JSON.stringify(S.traechtig && { sicher: S.traechtig.sicher }));
    ok('Brief „ist tragend“', spiel.post.some(x => /ist tragend/.test(x.betreff)));
    // --- 3. Stille Rosse / leer ---
    const S2 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Leer' }); spiel.boxen[2].pferd = S2;
    S2.gedeckt = { vater: hengstKopie(H), art: 'natur', tag: spiel.tag, seit: jzJetzt(), erfolg: false, verlust: null };
    let still = 0, laut = 0; for (let i = 0; i < 100; i++) { const X = { ...S2, gedeckt: { ...S2.gedeckt } }; S2.gedeckt = { vater: hengstKopie(H), art: 'natur', tag: spiel.tag - 2, seit: jzJetzt(), erfolg: false, verlust: null }; deckNacht(); if (S2.gedeckt) still++; else laut++; }
    ok('Stille Rosse ≈ 40 %', still > 20 && still < 60, `still ${still} / laut ${laut}`);
    S2.gedeckt = { vater: hengstKopie(H), art: 'natur', tag: spiel.tag, seit: jzJetzt(), erfolg: false, verlust: null }; nacht(1); traechtigkeitsUntersuchung(S2, () => {}); ok('Untersuchung leer: nicht tragend, sofort wieder deckbar', /Nicht tragend/.test(document.getElementById('dlgInhalt').innerText) && !S2.gedeckt && S2.rosseAb == null && zuchtSperre(S2, spiel.boxen[2]) === '', zuchtSperre(S2, spiel.boxen[2])); zu();
    // --- 4. Geburt, Fohlenrosse, Brief ---
    spiel.post = []; S.traechtig.geburt = jzJetzt(); S.traechtig.seit = jzJetzt() - 4;
    // Geburt erzwingen ohne Verluste: Zufall mehrfach versuchen
    let geboren = false; for (let i = 0; i < 40 && !geboren; i++) { const S3 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'G' + i }); S3.traechtig = { vater: hengstKopie(H), seit: jzJetzt() - 4, geburt: jzJetzt(), sicher: true }; const bx = spiel.boxen[3]; bx.pferd = S3; bx.fohlen = null; delete bx.fohlen; bx.abfohl = false; jahreszeitBeginn(); if (spiel.boxen[3].fohlen) { geboren = true; } else { spiel.boxen[3].pferd = null; } }
    ok('Fohlen geboren', geboren); const br = spiel.post.find(x => /hat ein Fohlen bekommen/.test(x.betreff)); ok('Geburts-Brief mit „Wieder decken“', !!br && /Wieder decken/.test(br.text || br.inhalt || JSON.stringify(br)), br ? br.betreff : 'kein Brief');
    const M = spiel.boxen[3].pferd; ok('Am Geburtstag: nicht deckbar („gerade abgefohlt“)', zuchtSperre(M, spiel.boxen[3]) === 'gerade abgefohlt', zuchtSperre(M, spiel.boxen[3]));
    nacht(1); const sp = zuchtSperre(M, spiel.boxen[3]); ok('Tag danach: Fohlenrosse, deckbar', sp === '' || sp === 'Winterruhe', sp);
    // liegendes Fohlen: nur Besamung
    if (spiel.boxen[3].fohlen) { spiel.boxen[3].fohlen.gebTag = spiel.tag; aktBox = 3; verpaaren(M, H); weiter(); k = knoepfe(); ok('Liegendes Fohlen: kein Natursprung, Besamung ja', !k.some(x => /Natursprung/.test(x)) && k.some(x => /Besamung/.test(x)), k.join(' | ')); zu(); }
    // --- 5. Totgeburt/Stute stirbt: Konstanten ---
    ok('Totgeburt 5 % ohne Aufsicht, 1,5 % Nachtdienst+Abfohlbox', GEBURT_TOT.ohne === 0.05 && GEBURT_TOT.maAbfohl === 0.015);
    // --- 6. Kolik-OP ---
    const K = neu({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 9, name: 'Kolik' }); spiel.boxen[4].pferd = K; aktBox = 4;
    let tod = 0, durch = 0, ohneOP = 0; for (let i = 0; i < 200; i++) { const q = neu({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 9, name: 'OP' + i }); const bx = spiel.boxen[5]; bx.pferd = q; bx.tot = false; bx.krippeVoll = true;
      q.klinik = { seit: spiel.tag, op: 'kolik', bis: spiel.tag + KOLIK_OP_TAGE }; const ko = befundNeu(q, 'kolik', 4, 'Test'); ko.diagnose = spiel.tag; ko.bemerkt = { von: 'du', tag: spiel.tag };
      for (let t = 0; t < 8 && bx.pferd === q && q.klinik; t++) { try { naechsteNacht(); } catch (e) { } zu(); }
      if (bx.tot || (spiel.friedhof || []).some(g => g.pferd && g.pferd.name === q.name)) tod++; else durch++; bx.pferd = null; bx.tot = false; }
    ok('Kolik-OP: etwa 25 % sterben', tod > 20 && tod < 80, `${tod} von 200 gestorben, ${durch} durch`);
    // Kolik im Stall ohne OP-Ablehnung stirbt nicht „trotz Behandlung“
    let stall = 0; for (let i = 0; i < 100; i++) { const q = neu({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 9, name: 'ST' + i }); const bx = spiel.boxen[6]; bx.pferd = q; bx.tot = false; bx.krippeVoll = true; const ko = befundNeu(q, 'kolik', 4, 'Test'); ko.diagnose = spiel.tag; ko.tierarzt = true; ko.beh = spiel.tag; ko.gradMax = 4;
      try { naechsteNacht(); } catch (e) { } zu(); if (bx.tot) stall++; bx.pferd = null; bx.tot = false; }
    ok('Schwere Kolik ohne OP (nur Tierarzt/zu Hause): etwa 70 % sterben, mehr als mit OP', stall > 50 && stall < 90 && stall / 100 > tod / 200, `${stall} von 100 ohne OP, ${tod} von 200 mit OP`);
    return out;
  });
  R.forEach(x => console.log(x)); console.log('Seitenfehler:', errs.length ? errs.join('; ') : 'keine'); await b.close(); process.exit(R.some(x => x[0] === '✗') || errs.length ? 1 : 0);
})();
