// v1005 (Dome 12.11.2026): Körung je Rasse, Leistungsprüfung, Deckhengst-Anfragen per Brief, Decktermine, Papiere nur mit gekörtem Vater
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x)); const zu = () => { document.getElementById('dlg').hidden = true; };
    zu(); spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; zbBestand();
    const mk = (n, g, i, rasse = 'hannoveraner', alter = 5) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; };
    ok('Alle 28 Rassen haben Hengst-Regeln', RASSEN.every(r => HENGST[r.id]), RASSEN.filter(r => !HENGST[r.id]).map(r => r.id).join());
    const H = mk('Hektor', 'Hengst', 0), V = mk('Vito', 'Hengst', 1, 'vollblut'), Q = mk('Quincy', 'Hengst', 2, 'quarter');
    ok('Neuer Hengst ist nicht gekört', hengstZulassung(H) === null && /Noch nicht gekört/.test(hengstText(H)), hengstText(H));
    ok('Vollblut: Gestütbuch ohne Körung', (hengstZulassung(V) || {}).n === HENGST.vollblut.n, JSON.stringify(hengstZulassung(V)));
    ok('Quarter erst mit Gentest', hengstZulassung(Q) === null && (Q.tests = { krank: true }) && !!hengstZulassung(Q));
    // Körung im Herbst
    spiel.kal = null; spiel.tag = 1 + 2 * tpj(); turnierKalender(); const K = spiel.turniere.filter(t => t.art === 'koerung' && t.tag >= spiel.tag + 2).sort((a, b) => a.tag - b.tag)[0];
    ok('Herbst: Körtermin im Kalender', !!K, spiel.turniere.filter(t => t.art === 'koerung').map(t => t.tag).join());
    zuchtverbandDialog(H, null); ok('Zuchtverband-Fenster für Hengste', /Körung/.test($('dlg').textContent) && /Hannoveraner Verband/.test($('dlg').textContent), $('dlg').textContent.slice(0, 150));
    const kb = K && document.querySelector(`[data-hvnenn="${K.id}"]`), g0 = spiel.geld; if (kb) kb.click();
    ok('Zur Körung angemeldet (250 €)', K && K.nennung.some(n => n.pid === H.id) && g0 - spiel.geld === hengstKosten('koer', H), g0 - spiel.geld); zu();
    spiel.tag = K.tag; turnierMorgen(); ok('Am Körtag außer Haus', !!H.turnier); turnierNacht();
    ok('Körung bewertet', H.hb && ['vorl', 'nein'].includes(H.hb.s) && H.hb.noten, JSON.stringify(H.hb));
    ok('Brief zur Körung', (spiel.post || []).some(x => /Körung: Hektor/.test(x.betreff || '')));
    // Leistungsprüfung (2 Tage) und Frist
    H.hb = { s: 'vorl', tag: spiel.tag }; K.nennung = []; spiel.kal = null; spiel.tag = 1 + 2 * tpj(); const L = spiel.turniere.filter(t => t.art === 'hlp' && !t.pruef[0].fizo && t.tag >= spiel.tag + 2 && datum(t.tag + 1).s === datum(t.tag).s).sort((a, b) => a.tag - b.tag)[0];
    ok('Leistungsprüfung frei für vorläufig gekörten Hengst', L && !hengstSperre(H, L, L.pruef[0]), L ? hengstSperre(H, L, L.pruef[0]) : 'kein Termin');
    if (L) { L.nennung.push({ pid: H.id, prid: L.pruef[0].id, geld: 0, reiter: 'profi' }); spiel.tag = L.tag; delete H.turnier; turnierMorgen(); turnierNacht(); ok('Nach Tag 1 noch auf der Station', !!H.turnier && !H.hb.lp);
      spiel.tag = L.tag + 1; turnierNacht(); ok('Nach Tag 2 Ergebnis', !H.turnier && H.hb.lp > 0, JSON.stringify(H.hb)); }
    { const F = mk('Fristi', 'Hengst', 3); F.hb = { s: 'vorl', tag: 1 }; F.alter = 9; delete F.geb; sichereGeburt(F); hengstFristTag(); ok('Frist verpasst: gestrichen', F.hb.s === 'gestrichen', JSON.stringify(F.hb) + ' Alter ' + alterJZ(F)); }
    // Deckhengst: Angebot, Anfrage, Zusage, Decktermin
    H.hb = { s: 'end', tag: 1 }; spiel.kal = null; spiel.tag = 1; zeigeTag();
    deckhengstDialog(H, null); const an = $('dhAn'); ok('Fenster Deckhengst mit Schalter', !!an); an.checked = true; an.onchange(); ok('Angeboten', H.deckFremd.an === true);
    const tb = document.querySelector('[data-dhtaxe]'); tb.click(); ok('Decktaxe selbst gewählt', H.deckFremd.taxe === +tb.dataset.dhtaxe, H.deckFremd.taxe); zu();
    const rnd = Math.random; Math.random = () => 0.01; for (let i = 0; i < 5 && !(spiel.deckAnfragen || []).length; i++) { delete H.deckFremd.anfrageTag; deckhengstTag(); } Math.random = rnd;
    const A = (spiel.deckAnfragen || [])[0]; ok('Anfrage einer fremden Stute', !!A && A.status === 'offen', JSON.stringify(spiel.deckAnfragen));
    const br = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'deckAnfrage'); ok('Brief mit Zusagen/Ablehnen', !!br && /data-baktion="da-ja"/.test(briefAktionHTML(br)), br && briefAktionHTML(br));
    if (A && br) { dhAntwort(br, true); ok('Zugesagt', A.status === 'ok'); ok('Kalender zeigt den Decktermin', kalTermine(jzVon(A.tag)).some(x => /Decktermin/.test(x.text)));
      // Turnier am Decktag → Termin wandert (Plan 8b)
      spiel.tag = A.tag; H.turnier = { tid: 'x', tag: spiel.tag }; dhTermineTag(); ok('Hengst auf dem Turnier: Termin verschoben', A.status === 'ok' && A.tag > spiel.tag, A.tag + ' / ' + spiel.tag); delete H.turnier;
      const g1 = spiel.geld, e0 = energie(H); spiel.tag = A.tag; dhTermineTag();
      ok('Bedeckung: Decktaxe und Register', A.status === 'gedeckt' && (H.deckFremd.register || []).length === 1 && spiel.geld > g1, A.status + ' ' + (spiel.geld - g1));
      ok('Energie gesunken', energie(H) < e0 || A.art === 'versand', e0 + ' → ' + energie(H)); }
    // Etappe 2: Gaststute bleibt ab dem Vortag in einer freien Box, Abreise mit Boxengeld; Trächtigkeitstaxe später
    { spiel.kal = null; spiel.tag = 1; delete H.turnier; const rnd = Math.random; Math.random = () => 0.01; delete H.deckFremd.anfrageTag; deckhengstTag(); Math.random = rnd;
      const G = spiel.deckAnfragen.find(a => a.status === 'offen'); ok('Zweite Anfrage', !!G); if (G) { G.gast = true; G.art = 'natur'; const bG = spiel.post.find(x => x.aktion && x.aktion.aid === G.id); dhAntwort(bG, true);
        spiel.tag = G.tag - 1; dhTermineTag(); const bx = spiel.boxen.find(b => b.pferd && b.pferd.gastStute === G.id); ok('Gaststute steht ab dem Vortag in einer Box (Pensionspferd)', !!bx && fremd(bx.pferd) && einstellerVon(bx.pferd).art === 'gast', JSON.stringify(G));
        ok('Kalender zeigt die Ankunft', kalTermine(jzVon(G.tag)).some(x => /Gaststute/.test(x.text)));
        spiel.tag = G.tag; dhTermineTag(); ok('Am Decktag gedeckt', G.status === 'gedeckt', G.status);
        const reg = H.deckFremd.register.slice(-1)[0]; ok('Decktaxe zweiteilig (Rest = Trächtigkeitstaxe)', reg.ok ? reg.rest === G.taxe - Math.round(G.taxe / 2) : reg.rest === 0, JSON.stringify(reg));
        const g2 = spiel.geld; spiel.tag = G.tag + 2; dhTermineTag(); ok('Abreise: Box frei, Boxengeld bezahlt', !spiel.boxen.some(b => b.pferd && b.pferd.gastStute === G.id) && spiel.geld - g2 >= 2 * DH.boxengeld, spiel.geld - g2);
        reg.rest = 100; const g3 = spiel.geld; spiel.tag = reg.tag + tpj(); dhGastTag(); ok('Trächtigkeitstaxe nach einer Jahreszeit', spiel.geld - g3 >= 100 && reg.rest === 0 && reg.restBezahlt === 100, spiel.geld - g3); } }
    // Besamung: Hengst außer Haus
    H.stationTag = spiel.tag; ok('Besamungsstation: Training gesperrt', /Besamungsstation/.test(trainSperre(H, spiel.boxen[0]))); delete H.stationTag;
    // Papiere: ungekörter eigener Vater → keine Papiere
    const M = mk('Mama', 'Stute', 4); M.zb = { i: 0, gesamt: 7 }; const U = mk('Ulf', 'Hengst', 5); const f1 = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute' }, f2 = { ...f1 };
    zbPapiere(f1, M, U); U.hb = { s: 'end' }; zbPapiere(f2, M, U); ok('Papiere nur mit gekörtem Vater', f1.papiere === false && f2.papiere === true, [f1.papiere, f2.papiere].join());
    // Steckbrief/Merkmale
    ok('Karte Merkmale: Körungsstatus statt „Körung kommt später“', !/Körung kommt später/.test(merkmaleHTML(H, {}, () => '', () => '', () => '')) && /Hengstbuch/.test(merkmaleHTML(H, {}, () => '', () => '', () => '')));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
