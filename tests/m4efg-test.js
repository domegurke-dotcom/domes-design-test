// M4E/M4F/M4G (28.11.2026, Dome: „Ja, alle einbauen“): echte Decktaxen/Gastbox, geteilte Decktaxe (Anzahlung + Rest bei Trächtigkeit), Fohlengeld, 50 % Gutschrift,
// Gastbox mit Fohlen bei Fuß und Impfpflicht, höherer Tagessatz nach dem Decken, Deckchance, Ankauf über den Hengstmarkt, 28 weitere private Gestüte. Teilweise mit echten Klicks.
// Start: NODE_PATH=<playwright> node tests/m4efg-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } });
  pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/version\.json/.test(m.text())) errs.push(m.text()); });
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png' }); };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText);
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200);
  await pg.selectOption('#kaufLand', '09'); await pg.waitForTimeout(100); const orte = await pg.$$eval('#kaufOrt option', o => o.map(x => x.value)); await pg.selectOption('#kaufOrt', orte.find(o => /Garmisch|Weilheim|Murnau|München/.test(o)) || orte[0]); await pg.waitForTimeout(100);
  await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 200000; spiel.admin = false; VET.verbotAb = Object.fromEntries(Object.keys(VET.verbotAb).map(k => [k, 99]));
    const d0 = datum(); if (d0.s !== 0) spiel.tag += (4 - d0.s) * tpj() - (d0.t - 1); });
  // 1. Daten: 58 Gestüte, alle Herden berechenbar, echte Decktaxen
  const d1 = await pg.evaluate(() => { const ids = Object.keys(GESTUETE), feh = []; let hg = 0; ids.forEach(id => { try { const H = gHerde(id); hg += H.hengste.length; gVerkauf(id); } catch (e) { feh.push(id + ': ' + e.message); } });
    const t = id => { const H = gHerde(id).hengste.map(h => h.gTaxe); return [Math.min(...H), Math.max(...H)]; };
    return { n: ids.length, feh, hg, kron: t('kronshof'), schw: t('schwaiganger'), hel: gHerde('helenenhof').hengste.map(h => h.gFg), papen: GESTUETE.papenhorst ? 1 : 0, graditz: !!GESTUETE.graditz, westerau: GESTUETE.westerau && GESTUETE.westerau.r }; });
  ok('mindestens 58 Gestüte, alle Herden und Verkaufspferde ohne Fehler', d1.n >= 58 && !d1.feh.length, `${d1.n} · ${d1.hg} Hengste · ${d1.feh.join(' | ')}`);
  ok('Kronshof 1.400–2.100 €, Schwaiganger 140–200 € (echte Werte)', d1.kron[0] >= 1400 && d1.kron[1] <= 2100 && d1.schw[0] >= 140 && d1.schw[1] <= 200, JSON.stringify([d1.kron, d1.schw]));
  ok('Helenenhof: Fohlengeld 2.000–4.500 € je Hengst', d1.hel.length && d1.hel.every(x => x >= 2000 && x <= 4500), d1.hel.join('/'));
  ok('Papenhorst entfernt (Gestüt-Tausch 21.11.), neue Gestüte Graditz/Westerau da', d1.papen === 0 && d1.graditz && d1.westerau, JSON.stringify(d1.westerau));
  // 2. Deckchance gesenkt
  const ch = await pg.evaluate(() => { const S = neuesPferd({ id: 'cs', rasse: 'noriker', geschlecht: 'Stute', alter: 6, name: 'C' }); S.pflege = erzeugePflege(S); S.pflege.wohl = 100; const H = gHerde('schwaiganger').hengste[0]; return [deckChance(S, H, 'natur'), DECK_ART.besamung.chance, DECK_ART.tief.chance, DECK_FRISCH]; });
  ok('Deckchance: junge Stute im Natursprung etwa 55–60 %, Besamung 50 %, TG 30 %', ch[0] > 0.5 && ch[0] < 0.62 && ch[1] === 0.5 && ch[2] === 0.3 && ch[3] === 0.55, ch.map(x => Math.round(x * 100)).join('/'));
  // 3. Gastbox mit Fohlen bei Fuß (echte Klicks): Noriker-Stute mit stehendem Fohlen nach Schwaiganger
  await pg.evaluate(() => { const bx = spiel.boxen.filter(x => !x.pferd && !x.reserviert); const S = neuesPferd({ id: 'st1', rasse: 'noriker', geschlecht: 'Stute', alter: 7, name: 'Resi' }); S.pflege = erzeugePflege(S); bx[0].pferd = S;
    const V = neuesPferd({ id: 'v0', rasse: 'noriker', geschlecht: 'Hengst', alter: 9, name: 'Vater' }); S.traechtig = { vater: V, seit: jzJetzt() - 4, geburt: jzJetzt() }; const f = geburt(bx[0], V, true); f.gebTag = spiel.tag - 5; bx[0].fohlen = f; delete S.traechtig;
    try { impfen ? 0 : 0; } catch (e) {} S.impfung = { tag: spiel.tag }; S.geimpft = spiel.tag;
    const S2 = neuesPferd({ id: 'st2', rasse: 'noriker', geschlecht: 'Stute', alter: 8, name: 'Vroni' }); S2.pflege = erzeugePflege(S2); bx[1].pferd = S2; marktBereich = 'gestuet'; gestuetWahl = 'noriker'; zeigeMarkt(); });
  const impf1 = await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.id === 'st1').pferd; return impfFaellig(p); });
  if (impf1) await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.id === 'st1').pferd; const alt = impfFaellig; window.__impfTest = true; p.impfungen = p.impfungen || []; });
  await pg.waitForTimeout(400); await bild('m4g-schwaiganger');
  await pg.click('[data-gdecken="schwaiganger|0"]'); await pg.waitForTimeout(300); await pg.click('[data-gst="st2"]'); await pg.waitForTimeout(300); let d = await dlgText();
  ok('Deckart-Fenster nennt Tupferprobe und Tagessatz nach dem Decken', /Tupferprobe/.test(d) && /nach dem Decken/.test(d), d.slice(0, 160).replace(/\n/g, ' '));
  await pg.click('#dlgKnoepfe button:has-text("Natursprung")'); await pg.waitForTimeout(300); d = await dlgText();
  const impf2 = await pg.evaluate(() => impfFaellig(spiel.extern && spiel.extern.length ? spiel.extern[0].pferd : spiel.boxen.find(x => x.pferd && x.pferd.id === 'st2').pferd));
  ok('Ungeimpfte Stute wird abgewiesen (oder geimpft aufgenommen)', impf2 ? /Impfung fehlt/.test(d) : /Ab ins Gestüt/.test(d), d.slice(0, 120).replace(/\n/g, ' ')); await bild('m4g-impfung');
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.extern = (spiel.extern || []).filter(e => e.pferd.id !== 'st2'); spiel.boxen.forEach(x => { if (x.reserviert === 'st2') delete x.reserviert; }); });
  // Resi mit Fohlen: Impfung sicher gültig machen über den Kern (die Impfregeln sind nicht Teil dieses Tests)
  const gb = await pg.evaluate(() => { const bx = spiel.boxen.find(x => x.pferd && x.pferd.id === 'st1'), S = bx.pferd, G = GESTUETE.schwaiganger, H = gHerde('schwaiganger').hengste[0], alt = impfFaellig; impfFaellig = () => false; let R; try { R = gGastboxKern(G, H, S, bx); } finally { impfFaellig = alt; }
    const e = (spiel.extern || []).find(x => x.pferd.id === 'st1'); return { ok: R.ok, text: R.text, fohlenMit: !!(e && e.fohlen), boxOhne: !bx.fohlen, tag: e && e.tagPreis, spaet: e && e.spaetPreis }; });
  ok('Gastbox mit Fohlen: Fohlen fährt mit, 14 € je Tag, nach dem Decken 32 €', gb.ok && gb.fohlenMit && gb.boxOhne && gb.tag === 14 && gb.spaet === 32 && /mit /.test(gb.text), JSON.stringify(gb).slice(0, 200));
  const lauf = await pg.evaluate(() => { const g0 = spiel.geld, nb = (spiel.post || []).length; let n = 0; const alt = Math.random; Math.random = () => 0.3;
    try { while ((spiel.extern || []).some(e => e.pferd.id === 'st1') && n < 40) { naechsteNacht(); n++; } } finally { Math.random = alt; }
    const bx = spiel.boxen.find(x => x.pferd && x.pferd.id === 'st1'), neu = (spiel.post || []).slice(0, (spiel.post || []).length - nb), re = neu.find(x => /Gastbox/.test(x.betreff || '') || /Gastbox/.test(x.text || ''));
    return { n, zurueck: !!bx, fohlen: !!(bx && bx.fohlen), traechtig: !!(bx && bx.pferd.traechtig), rest: bx && bx.pferd.deckRest, briefe: neu.map(x => x.betreff).join(' | '), rechnung: re ? (re.text || '').replace(/<[^>]+>/g, ' ').slice(0, 400) : '' }; });
  ok('Stute kommt mit Fohlen zurück', lauf.zurueck && lauf.fohlen, `${lauf.n} Nächte · ${lauf.briefe.slice(0, 160)}`);
  ok('Gastbox-Rechnung trennt die Tage nach dem Decken', /nach dem Decken/.test(lauf.rechnung + lauf.briefe) || /32/.test(lauf.rechnung), lauf.rechnung.slice(0, 200));
  // 4. Geteilte Decktaxe (Celle): Anzahlung, Rest zum Stichtag nur bei Trächtigkeit; Gutschrift wird verrechnet
  const gt = await pg.evaluate(() => { const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert); const S = neuesPferd({ id: 'st3', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 6, name: 'Hanna' }); S.pflege = erzeugePflege(S); bx.pferd = S;
    const H = gHerde('celle').hengste[0]; (spiel.deckGut = spiel.deckGut || []).push({ k: 'g:celle', n: 'Celle', betrag: 100, jahr: datum().j });
    const g0 = spiel.geld, alt = Math.random; Math.random = () => 0.1; let R; try { R = gBesamenKern(GESTUETE.celle, H, S, 'besamung'); } finally { Math.random = alt; }
    const bez = g0 - spiel.geld, rest = S.deckRest && S.deckRest.betrag, gutRest = (spiel.deckGut || []).filter(x => x.k === 'g:celle').reduce((a, x) => a + x.betrag, 0);
    S.traechtig = { vater: S.gedeckt.vater, seit: jzJetzt(), geburt: jzJetzt() + 4, art: 'besamung', sicher: true }; delete S.gedeckt;
    while (!(datum().s === 2)) spiel.tag++; const g1 = spiel.geld, nb = (spiel.post || []).length; deckRestTag(); const zahl = g1 - spiel.geld;
    return { ok: R.ok, text: R.text, taxe: H.gTaxe, bez, rest, gutRest, zahl, brief: (spiel.post || []).length > nb ? spiel.post[0].betreff : '', weg: !S.deckRest }; });
  ok('Celle: 350 € Anzahlung − 100 € Gutschrift + 120 € Tierarzt sofort', gt.ok && gt.bez === 350 - 100 + 120 && gt.gutRest === 0, `${gt.bez} € bezahlt, Taxe ${gt.taxe}`);
  ok('Rest der Decktaxe zum Herbst bei Trächtigkeit abgebucht, mit Brief', gt.rest === gt.taxe - 350 && gt.zahl === gt.rest && /Restbetrag/.test(gt.brief) && gt.weg, `Rest ${gt.rest}, gezahlt ${gt.zahl}, ${gt.brief}`);
  const leer = await pg.evaluate(() => { const S = neuesPferd({ id: 'st4', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 6, name: 'Leni' }); S.pflege = erzeugePflege(S); spiel.boxen.find(x => !x.pferd && !x.reserviert).pferd = S;
    S.deckRest = { betrag: 500, an: 'Celle', vn: 'X', vh: 'x', jahr: datum().j }; const g = spiel.geld; deckRestTag(); return { gezahlt: g - spiel.geld, weg: !S.deckRest }; });
  ok('Nicht tragend zum Stichtag: kein Rest fällig', leer.gezahlt === 0 && leer.weg, JSON.stringify(leer));
  // 5. Fohlengeld bei lebendem Fohlen
  const fg = await pg.evaluate(() => { const S = neuesPferd({ id: 'st5', rasse: 'traber', geschlecht: 'Stute', alter: 6, name: 'Trabi' }); const H = gHerde('helenenhof').hengste[0]; S.deckFg = { betrag: H.gFg, an: 'Gestüt Helenenhof', vn: H.name, vh: deckHid(H), jahr: datum().j };
    const g = spiel.geld; deckFgNachGeburt(S, { name: 'F' }, { vater: hengstKopie(H) }); return { soll: H.gFg, ist: g - spiel.geld, brief: spiel.post[0].betreff }; });
  ok('Fohlengeld nach der Geburt abgebucht', fg.ist === fg.soll && /Fohlengeld/.test(fg.brief), JSON.stringify(fg));
  // 6. Hengstmarkt nach der Körung
  const hm = await pg.evaluate(() => { while (!(datum().s === 2 && datum().t === 1)) spiel.tag++; const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert); const p = neuesPferd({ id: 'jh1', name: 'Junker', rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 3 }); p.pflege = erzeugePflege(p); bx.pferd = p; p.hb = { s: 'end', tag: spiel.tag };
    const J = jzJetzt() - 10; p.geb = { s: J % 4, j: Math.floor(J / 4) }; const alt = Math.random; Math.random = () => 0.5; try { gestuetTag(); } finally { Math.random = alt; }
    const br = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'hMarkt'); return { z: !!hengstZulassung(p), br: br && br.betreff, html: br ? hMarktHTML(br) : '' }; });
  ok('Brief „Hengstmarkt“ für den gekörten 2½-Jährigen', hm.br && /Junker/.test(hm.br) && /Hengstmarkt anbieten/.test(hm.html), JSON.stringify(hm).slice(0, 160));
  await pg.evaluate(() => { const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'hMarkt'); try { postAuf ? postAuf() : 0; } catch (e) {} });
  const verk = await pg.evaluate(() => { const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'hMarkt'), g = spiel.geld; const alt = Math.random; Math.random = () => 0.1; try { hMarktAus('ja', br, br.aktion); } finally { Math.random = alt; }
    return { plus: spiel.geld - g, weg: !spiel.boxen.some(x => x.pferd && x.pferd.id === 'jh1'), celle: gHerde('celle').hengste.some(h => h.name === 'Junker'), antw: br.aktion.antwort }; });
  ok('Zuschlag an das Landgestüt Celle (0,8–1,3 × Marktwert), Hengst deckt dort', verk.plus > 0 && verk.weg && verk.celle && /Celle/.test(verk.antw), JSON.stringify(verk).slice(0, 200));
  const nv = await pg.evaluate(() => { const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert); const p = neuesPferd({ id: 'jh2', name: 'Kuno', rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 3 }); p.pflege = erzeugePflege(p); bx.pferd = p;
    const A = { typ: 'hMarkt', pid: 'jh2', gek: false, bis: spiel.tag + 3 }, g = spiel.geld, alt = Math.random; Math.random = () => 0.9; try { hMarktAus('ja', { aktion: A }, A); } finally { Math.random = alt; } return { minus: g - spiel.geld, da: spiel.boxen.some(x => x.pferd && x.pferd.id === 'jh2'), antw: A.antwort }; });
  ok('Ohne Käufer: nur die Gebühr, Hengst bleibt', nv.minus === 250 && nv.da && /Kein Gebot/.test(nv.antw), JSON.stringify(nv));
  ok('Holsteiner Verband und Treidelhof kaufen nicht mehr an', await pg.evaluate(() => !GESTUETE.holsteinerverband.ank && !GESTUETE.treidelhof.ank && GESTUETE.celle.ank && GESTUETE.marbach.ank));
  // 7. Neue Gestüte im Markt (echte Klicks)
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; marktBereich = 'gestuet'; gestuetWahl = 'vollblut'; zeigeMarkt(); }); await pg.waitForTimeout(400);
  const vb = await pg.evaluate(() => document.getElementById('nebenSchirm').innerText); await bild('m4f-markt-vollblut');
  ok('Markt – Gestüte – Vollblut zeigt die Seite ohne Fehler', /Gestüt/.test(vb), vb.slice(0, 120).replace(/\n/g, ' '));
  await pg.evaluate(() => { gestuetWahl = null; zeigeMarkt(); }); await pg.waitForTimeout(300); await bild('m4f-uebersicht');
  const wz = await pg.$$eval('[data-gest]', x => x.length); await pg.click('[data-gest="graditz"]'); await pg.waitForTimeout(400);
  const gr = await pg.evaluate(() => document.getElementById('nebenSchirm').innerText); await bild('m4f-graditz');
  ok('Übersicht „Weitere Gestüte“: Graditz anklickbar, Seite mit Hengsten', /Graditz/.test(gr) && /Gestütshengste/.test(gr) && wz >= 58, `${wz} Kacheln · ${gr.slice(0, 100).replace(/\n/g, ' ')}`);
  const imp = await pg.evaluate(() => { const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert); bx.pferd = neuesPferd({ id: 'st9', rasse: 'noriker', geschlecht: 'Stute', alter: 6, name: 'Ungeimpft' }); bx.pferd.pflege = erzeugePflege(bx.pferd); const alt = impfFaellig; impfFaellig = () => true; try { return gGastboxKern(GESTUETE.schwaiganger, gHerde('schwaiganger').hengste[0], bx.pferd, bx); } finally { impfFaellig = alt; } });
  ok('Ohne gültige Impfung: Gastbox lehnt ab', !imp.ok && /Impfung fehlt/.test(imp.h3), imp.h3);
  ok('keine Seitenfehler', !errs.length, errs.slice(0, 3).join(' | '));
  console.log(L.join('\n')); console.log(L.some(l => l[0] === '✗') ? 'FEHLER' : 'alles ok'); await b.close();
})();
