// Etappe 5 (Dome 12.11.2026): eigene Stuten mit eigenem Tiefgefriersamen besamen (auch von verstorbenen Hengsten) · Stuteneintragung auf der Fohlenschau
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.env.BILDER_ORDNER;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  const bild = async n => { if (ORD) await pg.screenshot({ path: path.join(ORD, n + '.png') }); };
  const klick = async sel => { const r = await pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel); await pg.waitForTimeout(200); if (!r) out.push('✗ Klick fehlt: ' + sel); return r; };
  const knopf = async txt => { const r = await pg.evaluate(t => { const e = [...document.querySelectorAll('#dlg button, .knopf, button')].find(x => x.offsetParent && x.textContent.includes(t)); if (!e) return false; e.click(); return true; }, txt); await pg.waitForTimeout(250); if (!r) out.push('✗ Knopf fehlt: ' + txt); return r; };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere || []; zbBestand();
    window.mk = (n, g, i, rasse = 'hannoveraner', alter = 6) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; }; });

  // ---- Teil 1: eigener Tiefgefriersamen eines verstorbenen Hengstes ----
  await pg.evaluate(() => { const H = mk('Donnerhall', 'Hengst', 1); H.hb = { s: 'end', tag: 1 };
    gebaeude().push({ gid: 'gb1', typ: 'besamung', stufe: 2, zustand: 100, erl: { ok: 1 } }); const g = bstGeb();
    g.tg = [{ hid: H.id, name: H.name, rasse: H.rasse, portionen: 3, papiere: true, taxe: 500, kopie: hengstKopie(H) }];
    spiel.boxen[1].pferd = null;   // Hengst ist tot/fort
    window.M = mk('Mira', 'Stute', 0); M.zb = { i: 0, gesamt: 7.2 }; delete M.gedeckt; delete M.traechtig;
    aktBox = 0; spiel.aktBox = 0; aktenReiter = 'genetik'; deckModus = true; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeAkte(); });
  let r = await pg.evaluate(() => ({ kachel: !!document.querySelector('[data-tgeigen]'), txt: (document.querySelector('[data-tgeigen]') || {}).textContent || '', titel: [...document.querySelectorAll('.paar-titel')].map(x => x.textContent).join(' | ') }));
  ok('Deckauswahl: Abschnitt „Eigener Tiefgefriersamen“ mit dem toten Hengst', r.kachel && /Eigener Tiefgefriersamen/.test(r.titel) && /3 Portionen/.test(r.txt) && /†/.test(r.txt), JSON.stringify(r));
  if (ORD) { await pg.evaluate(() => { const e = document.querySelector('[data-tgeigen]'); if (e) e.scrollIntoView({ block: 'center' }); }); await bild('etappe5-deckauswahl'); }
  await klick('[data-tgeigen]'); await bild('etappe5-hengst-ansehen');
  await knopf('Besamen'); r = await pg.evaluate(() => $('dlg').textContent); ok('Bestätigung: Tierarzt, Chance, Papiere-Hinweis', /eigenem Tiefgefriersamen/.test(r) && /Chance je Rosse/.test(r) && /Papiere/.test(r), r.slice(0, 200));
  await bild('etappe5-besamen-fenster');
  const g0 = await pg.evaluate(() => spiel.geld); await klick('#dlgKnoepfe button[data-txt*="Besamen"]');
  r = await pg.evaluate(() => ({ art: M.gedeckt && M.gedeckt.art, tg: M.gedeckt && M.gedeckt.vater.tgEigen, zul: M.gedeckt && M.gedeckt.vater.zul, port: bstGeb().tg[0].portionen, geld: spiel.geld, txt: $('dlg').textContent }));
  ok('Besamt: Portion verbraucht, 150 € Tierarzt + 25 € Deckbescheinigung', r.art === 'tief' && r.tg && r.zul && r.port === 2 && g0 - r.geld === 175 && /Besamt!/.test(r.txt), JSON.stringify({ ...r, d: g0 - r.geld, txt: '' }));
  r = await pg.evaluate(() => { const V = M.gedeckt.vater; M.traechtig = { vater: V, seit: jzJetzt() - 4, geburt: jzJetzt() }; delete M.gedeckt; const box = spiel.boxen[0]; let f = null, fehler = '';
    try { geburt(box, V); f = box.fohlen; } catch (e) { fehler = e.message; } return { fehler, f: !!f, papiere: f && f.papiere, vater: f && f.ahnen && f.ahnen.vater && f.ahnen.vater.name }; });
  ok('Geburt: Fohlen vom toten Hengst mit Papieren', !r.fehler && r.f && r.papiere === true && r.vater === 'Donnerhall', JSON.stringify(r));
  r = await pg.evaluate(() => { const g = bstGeb(); g.tg[0].papiere = false; const V = JSON.parse(JSON.stringify(g.tg[0].kopie)); V.eigen = true; V.zul = false; const f = { rasse: 'hannoveraner', anteile: { hannoveraner: 100 }, geschlecht: 'Stute' }; zbPapiere(f, M, V); return f.papiere; });
  ok('Ungekörter Hengst: Fohlen ohne Papiere', r === false, r);
  r = await pg.evaluate(() => { spiel.boxen[0].fohlen = null; const g = bstGeb(); g.tg[0].portionen = 0; deckModus = true; zeigeAkte(); return !!document.querySelector('[data-tgeigen]'); });
  ok('Ohne Portionen: kein Abschnitt mehr', r === false, r);
  r = await pg.evaluate(() => { const g = bstGeb(); g.tg[0].portionen = 2; spiel.kal = null; spiel.tag = 1 + 3 * tpj(); deckModus = true; zeigeAkte(); const k = [...document.querySelectorAll('.paar[disabled]')].find(x => /Donnerhall/.test(x.title) && /Winterruhe/.test(x.title)); const res = !!k; spiel.kal = null; spiel.tag = 1; return res; });
  ok('Winter: Kachel gesperrt (Winterruhe)', r === true, r);

  // ---- Teil 2: Stuteneintragung auf der Fohlenschau ----
  await pg.evaluate(() => { deckModus = false; document.getElementById('dlg').hidden = true; window.S = mk('Stina', 'Stute', 2); delete S.zbBestand; S.zb = null;
    const F = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Fini' }); F.anteile = { hannoveraner: 100 }; F.werte = F.werte || erzeugeWerte(F); F.pflege = erzeugePflege(F); F.papiere = false; F.ahnen = { mutter: { nr: S.nr, name: S.name } }; spiel.boxen[2].fohlen = F; window.F = F;
    spiel.kal = null; spiel.tag = 1 + tpj(); const T = { id: 'fsx', tag: spiel.tag + 4, art: 'fohlenschau', typ: 'zucht', name: 'Fohlenschau in Testdorf', pruef: [{ id: 'pfs', disz: 'fohlenschau', fohlenschau: true, klasse: 'stut', stufe: -1, starter: 10, name: 'Stutfohlen', nenn: FS_NENNGELD, preis: 0 }], nennung: [] }; spiel.turniere.push(T);
    zuchtverbandDialog(S, null); });
  r = await pg.evaluate(() => $('dlg').textContent); ok('Hinweis im Zuchtverband-Fenster', /auf derselben Schau gleich ins Stutbuch/.test(r), r.slice(0, 120));
  await klick('[data-fsnenn="fsx:pfs"]');
  r = await pg.evaluate(() => !!document.querySelector('[data-fszb="fsx:pfs"]')); ok('Nach dem Nennen: Knopf „gleich eintragen lassen“', r, r);
  await bild('etappe5-fohlenschau-genannt');
  let g1 = await pg.evaluate(() => spiel.geld); await klick('[data-fszb="fsx:pfs"]');
  r = await pg.evaluate(() => ({ zb: spiel.turniere.find(t => t.id === 'fsx').nennung[0].zbMutter, geld: spiel.geld, txt: document.querySelector('[data-fszb]').textContent }));
  ok('Angemeldet (60 €), Knopf zeigt ✓', r.zb === true && g1 - r.geld === 60 && /wird eingetragen/.test(r.txt), JSON.stringify(r));
  await bild('etappe5-fohlenschau-eintragung');
  r = await pg.evaluate(() => ({ schau: zbSperre(S, null, { zb: 'schau' }), hof: zbSperre(S, null, { zb: 'hof' }) })); ok('Danach Stutenschau/Hofbesuch gesperrt', /Fohlenschau angemeldet/.test(r.schau) && /Fohlenschau angemeldet/.test(r.hof), JSON.stringify(r));
  g1 = await pg.evaluate(() => spiel.geld); await klick('[data-fszb="fsx:pfs"]'); r = await pg.evaluate(() => ({ zb: spiel.turniere.find(t => t.id === 'fsx').nennung[0].zbMutter, geld: spiel.geld }));
  ok('Wieder abgemeldet: 60 € zurück', !r.zb && r.geld - g1 === 60, JSON.stringify(r));
  await klick('[data-fszb="fsx:pfs"]');
  r = await pg.evaluate(() => { const T = spiel.turniere.find(t => t.id === 'fsx'); spiel.tag = T.tag; const box = spiel.boxen[2]; const zeile = fohlenschauErgebnis(S, box, T, T.pruef[0], zufall('x1')); return { zeile, zb: S.zb, fini: F.papiere, brief: (spiel.post || []).some(x => /Eintragung: Stina/.test(x.betreff || '')) }; });
  ok('Fohlenschau: Mutter vorgestellt, Brief, Ergebnis-Zeile', !!r.zb && r.brief && /der Kommission vorgestellt/.test(r.zeile), JSON.stringify({ zb: r.zb && r.zb.i, brief: r.brief }));
  ok('Eingetragen → Fohlen bekommt nachträglich Papiere', r.zb.i == null || r.fini === true, JSON.stringify({ i: r.zb.i, fini: r.fini }));

  if (ORD) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { spiel.tag = 1 + tpj(); S.zb = null; spiel.turniere.find(t => t.id === 'fsx').nennung[0].zbMutter = true; zuchtverbandDialog(S, null); }); await bild('etappe5-handy-hoch'); await pg.setViewportSize({ width: 844, height: 390 }); await bild('etappe5-handy-quer'); }
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
