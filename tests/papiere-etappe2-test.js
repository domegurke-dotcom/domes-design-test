// Etappe 2 der Lücken-Prüfung (Dome 12.11.2026): Papiere und Zuchtbuch
// Abmelden wirkt auf Papiere, „Für <Jahr> abmelden“, verkaufter ungekörter Vater, Pensionsstuten mit Papieren, Vollblut nur Natursprung, Deckbescheinigung nur für eingetragene Stuten
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder der Fenster
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.env.BILDER_ORDNER;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  const bild = async n => { if (ORD) await pg.screenshot({ path: path.join(ORD, n + '.png') }); };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; zbBestand();
    window.mk = (n, g, i, rasse = 'hannoveraner', alter = 6) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; };
    window.M = mk('Mara', 'Stute', 0); M.zb = { i: 0, gesamt: 7.2 }; window.H = mk('Hektor', 'Hengst', 1); H.hb = { s: 'end', tag: 1 }; });

  // 2: Knopf „Für <Jahr> abmelden“ – vor der Gebühr fürs laufende Jahr, nach der Gebühr fürs nächste
  let r = await pg.evaluate(() => { const H0 = spiel.hof || spiel; delete H0.zbJahr; zuchtverbandDialog(M, null); const t = $('zbRuht') && $('zbRuht').textContent; return { t, j: datum().j }; });
  ok('Vor der Jahresgebühr: Knopf „Für <dieses Jahr> abmelden“', r.t === 'Für ' + r.j + ' abmelden', r.t);
  await pg.click('#zbRuht'); r = await pg.evaluate(() => ({ ruht: M.zb.ruht, j: datum().j, t: $('dlg').textContent }));
  ok('Klick meldet für dieses Jahr ab', r.ruht === r.j && /abgemeldet/.test(r.t), JSON.stringify(r.ruht));
  await bild('etappe2-abgemeldet');
  await pg.click('#zbRuht'); r = await pg.evaluate(() => M.zb.ruht); ok('Erneuter Klick meldet wieder an', r === undefined, r);
  r = await pg.evaluate(() => { (spiel.hof || spiel).zbJahr = datum().j; zuchtverbandDialog(M, null); return { t: $('zbRuht').textContent, j: datum().j, txt: $('dlg').textContent }; });
  ok('Nach der Jahresgebühr: Knopf gilt fürs nächste Jahr', r.t === 'Für ' + (r.j + 1) + ' abmelden' && new RegExp('für ' + r.j + ' bezahlt').test(r.txt), r.t);
  await pg.click('#zbRuht'); r = await pg.evaluate(() => ({ ruht: M.zb.ruht, j: datum().j })); ok('Abgemeldet fürs nächste Jahr', r.ruht === r.j + 1, r.ruht);
  await bild('etappe2-abgemeldet-naechstes-jahr');
  r = await pg.evaluate(() => { const L = []; const g0 = spiel.geld; spiel.kal = null; spiel.tag = 1 + 4 * tpj(); delete (spiel.hof || spiel).zbJahr; zbJahresgebuehr(); return { diff: g0 - spiel.geld, brief: (spiel.post || []).some(x => /Jahresgebühr/.test(x.betreff || '') && /Mara/.test(x.text || '')) }; });
  ok('Im abgemeldeten Jahr keine Jahresgebühr für die Stute', r.diff === 0, JSON.stringify(r));

  // 1: im Deckjahr abgemeldet → Fohlen ohne Papiere (auch nicht nachträglich)
  r = await pg.evaluate(() => { const dj = datum().j; M.zb.ruht = dj; spiel.tag = 1 + 8 * tpj(); const f1 = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute', ahnen: { mutter: { nr: M.nr } } }; zbPapiere(f1, M, hengstKopie(H));
    delete M.zb.ruht; const f2 = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute' }; zbPapiere(f2, M, hengstKopie(H)); return [f1.papiere, !!f1.papiereNie, f2.papiere]; });
  ok('Im Deckjahr abgemeldet: Fohlen ohne Papiere, sonst mit', r[0] === false && r[1] && r[2] === true, r.join());

  // 6: ungekörter eigener Vater, vor der Geburt verkauft → keine Papiere; gekörter verkaufter Vater → Papiere
  r = await pg.evaluate(() => { const U = mk('Ulf', 'Hengst', 2); const kU = hengstKopie(U), kH = hengstKopie(H); spiel.boxen[2].pferd = null; spiel.boxen[1].pferd = null; lebendNachNr.cache = null;
    const f1 = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Hengst' }, f2 = { ...f1 }; zbPapiere(f1, M, kU); zbPapiere(f2, M, kH); spiel.boxen[1].pferd = H;
    return [kU.eigen, kU.zul, f1.papiere, kH.zul, f2.papiere]; });
  ok('Kopie merkt eigen/Zulassung', r[0] === true && r[1] === false && r[3] === true, r.join());
  ok('Ungekörter Vater verkauft: trotzdem keine Papiere; gekörter: Papiere', r[2] === false && r[4] === true, r.join());
  r = await pg.evaluate(() => { const fremdH = { name: 'Station', rasse: 'hannoveraner', id: 'x1', geschlecht: 'Hengst', werte: H.werte, gen: H.gen, ex: H.ex }; const k = hengstKopie(fremdH); const f = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Hengst' }; zbPapiere(f, M, k); return [k.eigen, f.papiere]; });
  ok('Deckstations-Hengst: Papiere', r[0] === false && r[1] === true, r.join());

  // 7: Pensionsstute bekommt Papiere wie beim Privatkauf
  r = await pg.evaluate(() => { let mit = 0, n = 0, fmit = 0; for (let i = 0; i < 60; i++) { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'P' + i }); P.anteile = { hannoveraner: 100 }; P.werte = P.werte || erzeugeWerte(P); P.einsteller = 'e' + i;
      const f = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute' }; zbPapiere(f, P, hengstKopie(H)); n++; if (P.zbMarkt === 'Privat') mit++; if (f.papiere) fmit++; } return { n, mit, fmit }; });
  ok('Pensionsstuten: einmal wie Privatkauf behandelt, manche Fohlen mit Papieren', r.mit === r.n && r.fmit > 3 && r.fmit < r.n, JSON.stringify(r));

  // 14: Deckbescheinigung nur für eingetragene, reinrassige Stuten
  r = await pg.evaluate(() => { const S1 = mk('Eingetragen', 'Stute', 3); S1.zb = { i: 0, gesamt: 7 }; const S2 = mk('Ohne', 'Stute', 4); S2.zb = { i: null }; delete S2.zbBestand;
    const post = () => (spiel.finanzen || []).filter(x => /Deckbescheinigung/.test(x.text || x.t || x.name || JSON.stringify(x))).length;
    const g = () => spiel.geld; let a = g(); deckKern(S1, H, 'natur'); const d1 = a - g(); a = g(); deckKern(S2, H, 'natur'); const d2 = a - g(); return [d1, d2, zuchtbuchVon(S2)]; });
  ok('Deckbescheinigung nur für eingetragene Stute (25 € / 0 €)', r[0] === 25 && r[1] === 0, JSON.stringify(r));

  // 8: Vollblut-Deckhengst – nur Natursprung
  await pg.evaluate(() => { spiel.kal = null; spiel.tag = 1; window.V = mk('Vito', 'Hengst', 5, 'vollblut'); deckhengstDialog(V, null); });
  r = await pg.evaluate(() => ({ versand: !!$('dhVersand'), txt: $('dlg').textContent, natur: !!$('dhNatur') }));
  ok('Vollblut: kein Kästchen Besamung, Hinweis Natursprung', !r.versand && r.natur && /nur im Natursprung/.test(r.txt), r.txt.slice(0, 200));
  await bild('etappe2-vollblut-deckhengst');
  await pg.click('#dhAn'); await pg.waitForTimeout(100);
  r = await pg.evaluate(() => { V.deckFremd.versand = true; V.deckFremd.natur = false; V.deckFremd.test = datum().j; const arts = []; const rnd = Math.random; Math.random = () => 0.01;
    for (let i = 0; i < 6; i++) { delete V.deckFremd.anfrageTag; spiel.tag = 1 + i; deckhengstTag(); } Math.random = rnd;
    (spiel.deckAnfragen || []).filter(a => a.pid === V.id).forEach(a => arts.push(a.art)); return { arts, eig: bstEigene().some(p => p === V) }; });
  ok('Vollblut-Anfragen nur Natursprung, nie auf der Station', r.arts.length > 0 && r.arts.every(a => a === 'natur') && !r.eig, JSON.stringify(r));
  await pg.evaluate(() => { deckhengstDialog(V, null); }); await pg.click('#dhNatur'); r = await pg.evaluate(() => V.deckFremd.natur);
  ok('Natursprung lässt sich beim Vollblut nicht abschalten', r === true, r);

  // 3: zbBestand – alle Höfe, nicht mitten in imHof
  r = await pg.evaluate(() => { const alt = spiel.zbAb; delete spiel.zbAb; hofTiefe++; zbBestand(); const mitten = spiel.zbAb; hofTiefe--; zbBestand(); const nach = spiel.zbAb; return [mitten, nach != null]; });
  ok('zbBestand wartet, solange ein anderer Hof kurz aktiv ist', r[0] == null && r[1], r.join());

  // Handy-Bild Zuchtverband
  if (ORD) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { zuchtverbandDialog(M, null); }); await bild('etappe2-handy-hoch'); await pg.setViewportSize({ width: 844, height: 390 }); await bild('etappe2-handy-quer'); }
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
