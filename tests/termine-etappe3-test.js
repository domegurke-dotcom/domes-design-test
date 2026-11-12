// Etappe 3 der Lücken-Prüfung (Dome 12.11.2026): Termine und Abläufe
// Hofbesuch und Turnier, Hofbesuch absagen, Decktermin nicht am 2. Tag der Leistungsprüfung, Prüfungen bei 4 Tagen je Jahreszeit,
// Jahresgebühr Deckhengst beim Anbieten, Grenze vorläufig gekörter Hengste mit eigenen Stuten, Fremdfohlen auf anderem Hof, Gaststute ohne Pensionslogik, Tipp Deckhengst
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder
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
    spiel.turniere = spiel.turniere || []; window.S = mk('Stella', 'Stute', 0); delete S.zbBestand; S.zb = null; window.H = mk('Hektor', 'Hengst', 1); });

  // 9: Hofbesuch – Turniertag fehlt in der Auswahl; ist sie trotzdem weg, wird erstattet
  let r = await pg.evaluate(() => { const T = { id: 'tx', tag: spiel.tag + 3, art: 'turnier', name: 'Testturnier', pruef: [{ id: 'px', zb: null }], nennung: [{ pid: S.id, prid: 'px' }] }; spiel.turniere.push(T);
    zbHofDialog(S, () => {}); const tage = [...document.querySelectorAll('[data-zbtag]')].map(x => +x.dataset.zbtag); return { tage, t: T.tag, txt: $('dlg').textContent }; });
  ok('Hofbesuch: Turniertag nicht wählbar, Hinweis', !r.tage.includes(r.t) && r.tage.length > 0 && /Turnier oder einer Prüfung/.test(r.txt), JSON.stringify(r.tage));
  await bild('etappe3-hofbesuch-wahl');
  r = await pg.evaluate(() => { const T = spiel.turniere.find(t => t.id === 'tx'); spiel.zbHof = [{ pid: S.id, tag: T.tag, hid: aktivHid(), geld: 200 }]; spiel.tag = T.tag; const g = spiel.geld; zbNacht(); return { diff: spiel.geld - g, zb: !!S.zb, brief: (spiel.post || []).some(x => /Hofbesuch: Stella/.test(x.betreff || '')) }; });
  ok('Hofbesuch am Turniertag: erstattet, nicht eingetragen, Brief', r.diff === 200 && !r.zb && r.brief, JSON.stringify(r));

  // 17: Hofbesuch absagen (mit Klick) – früh mit Erstattung, kurz vorher ohne
  await pg.evaluate(() => { spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere.filter(t => t.id !== 'tx'); spiel.zbHof = [{ pid: S.id, tag: spiel.tag + 4, hid: aktivHid(), geld: 200 }]; zuchtverbandDialog(S, null); });
  ok('Knopf „Termin absagen“', await pg.$('#zbHofAb') != null);
  await bild('etappe3-hofbesuch-gebucht');
  await pg.click('#zbHofAb'); r = await pg.evaluate(() => $('dlg').textContent); ok('Absagen-Fenster nennt Erstattung', /zurück/.test(r), r.slice(0, 120)); await bild('etappe3-hofbesuch-absagen');
  let g0 = await pg.evaluate(() => spiel.geld); await pg.click('#dlgKnoepfe button[data-txt*="Absagen"]');
  r = await pg.evaluate(() => ({ n: (spiel.zbHof || []).length, geld: spiel.geld })); ok('Abgesagt mit 200 € zurück', r.n === 0 && r.geld - g0 === 200, JSON.stringify(r));
  await pg.evaluate(() => { spiel.zbHof = [{ pid: S.id, tag: spiel.tag + 1, hid: aktivHid(), geld: 200 }]; zuchtverbandDialog(S, null); }); await pg.click('#zbHofAb');
  r = await pg.evaluate(() => $('dlg').textContent); ok('Kurz vorher: kein Geld zurück (Hinweis)', /kein Geld zurück/.test(r), r.slice(0, 160));
  g0 = await pg.evaluate(() => spiel.geld); await pg.click('#dlgKnoepfe button[data-txt*="Absagen"]'); r = await pg.evaluate(() => ({ n: (spiel.zbHof || []).length, geld: spiel.geld })); ok('Kurz vorher abgesagt ohne Erstattung', r.n === 0 && r.geld === g0, JSON.stringify(r));

  // 15: Decktermin nicht am 2. Tag der Leistungsprüfung
  r = await pg.evaluate(() => { spiel.kal = null; spiel.tag = 1; const T = { id: 'hx', tag: 3, art: 'hlp', name: 'HLP', pruef: [{ id: 'q', zb: 'hlp' }], nennung: [{ pid: H.id, prid: 'q' }] }; spiel.turniere.push(T); const d = dhFreierTag(H, 3); spiel.turniere = spiel.turniere.filter(t => t !== T); return d; });
  ok('Decktermin frühestens nach der 2-tägigen Leistungsprüfung', r === 5, r);

  // 18: 4 Tage je Jahreszeit – Station/Leistungsprüfung fallen nicht aus
  r = await pg.evaluate(() => { const alt = spiel.tempo; spiel.tempo = 4; let fehl = 0, n = 0; const rnd = Math.random;
    for (let k = 0; k < 40; k++) { spiel.turniere = []; spiel.kal = null; spiel.tag = 1; let x = k + 1; const rz = () => { x = (x * 16807) % 2147483647; return x / 2147483647; };
      zbTermineErzeugen({ s: 0, j: 2000 }, rz, 1 + tpj() * 4, () => 'Ort'); const st = spiel.turniere.filter(t => (t.pruef[0] || {}).zb === 'station'); n++; if (!st.length) fehl++; if (st.some(t => datum(t.tag + 1).s !== datum(t.tag).s)) fehl += 100; }
    spiel.tempo = alt; spiel.turniere = []; return { fehl, n }; });
  ok('Tempo 4: Stationsprüfung immer ausgeschrieben, nie über die Jahreszeit hinaus', r.fehl === 0, JSON.stringify(r));

  // 13: Jahresgebühr Deckhengst beim Anbieten (Klick)
  await pg.evaluate(() => { spiel.turniere = []; spiel.kal = null; spiel.tag = 2; H.hb = { s: 'end', tag: 1 }; delete H.deckFremd; (spiel.hof || spiel).zbJahr = datum().j; deckhengstDialog(H, null); });
  r = await pg.evaluate(() => $('dlg').textContent); ok('Hinweis Jahresgebühr im Fenster', /Jahresgebühr Zuchtverband 200/.test(r) && /wird beim Anbieten fällig/.test(r), r.slice(0, 300));
  g0 = await pg.evaluate(() => spiel.geld); await pg.click('#dhAn'); await pg.waitForTimeout(100);
  r = await pg.evaluate(() => ({ an: H.deckFremd.an, bez: H.deckFremd.jahrBez, geld: spiel.geld, txt: $('dlg').textContent })); ok('Beim Anbieten 200 € Jahresgebühr', r.an && g0 - r.geld === 200 && /bezahlt/.test(r.txt), JSON.stringify({ an: r.an, d: g0 - r.geld }));
  await bild('etappe3-deckhengst-gebuehr');
  await pg.click('#dhAn'); await pg.click('#dhAn'); r = await pg.evaluate(() => spiel.geld); ok('Aus und wieder an: nicht doppelt', g0 - r === 200, g0 - r);
  r = await pg.evaluate(() => { const g = spiel.geld; spiel.tag = 1 + 4 * tpj(); delete (spiel.hof || spiel).zbJahr; zbJahresgebuehr(); const d1 = g - spiel.geld; return { d1, bez: H.deckFremd.jahrBez, j: datum().j }; });
  ok('Nächster Frühling: Jahresgebühr wieder fällig, einmal', r.d1 === 200 && r.bez === r.j, JSON.stringify(r));

  // 16: vorläufig gekörter Hengst – eigene Stuten zählen mit
  r = await pg.evaluate(() => { spiel.kal = null; spiel.tag = 1; H.hb = { s: 'vorl', tag: 1 }; H.deckFremd = { an: false }; const z = hengstZulassung(H); const reg = []; for (let i = 0; i < z.max - 1; i++) reg.push({ tag: 1, stute: 'x' + i }); H.deckFremd.register = reg;
    const E = mk('Eigene', 'Stute', 2); E.zb = { i: 0, gesamt: 7 }; deckKern(E, H, 'natur'); const n1 = dhJahrZahl(H);
    const E2 = mk('Zweite', 'Stute', 3); delete E2.gedeckt; document.getElementById('dlg').hidden = true; verpaaren(E2, H); const txt = $('dlg').textContent; return { max: z.max, n1, txt, gedeckt: !!E2.gedeckt }; });
  ok('Eigene Stute zählt zur Grenze', r.n1 === r.max, JSON.stringify({ n1: r.n1, max: r.max }));
  ok('Weitere Stute: Hinweis „Grenze erreicht“', /Grenze erreicht/.test(r.txt) && !r.gedeckt, r.txt.slice(0, 120));
  await bild('etappe3-grenze');
  r = await pg.evaluate(() => { const E = spiel.boxen[2].pferd; delete E.gedeckt; document.getElementById('dlg').hidden = true; verpaaren(E, H); return /Grenze erreicht/.test($('dlg').textContent); });
  ok('Nachdecken derselben Stute bleibt erlaubt', r === false, r);

  // 10: Fremdfohlen – Hengst auf einem anderen Hof
  r = await pg.evaluate(() => { const vorher = H.nachkommen || 0; spiel.fremdFohlen = [{ hid: H.id, hengst: H.name, besitzer: 'Anna Berg', w: true, stute: 'Gaby', rasse: 'hannoveraner', geburt: jzJetzt() - 1, q: 0.5 }];
    const alt = hofTiefe; hofTiefe = 0; const orig = window.alleEigenenPferde; fremdFohlenJahreszeit(); return { n: (H.nachkommen || 0) - vorher, brief: (spiel.post || []).some(x => /Gaby hat gefohlt/.test(x.betreff || '')) }; });
  ok('Fremdfohlen zählt beim Hengst (über alle Höfe gesucht)', r.n === 1 && r.brief, JSON.stringify(r));

  // 10 (echt): Hengst steht auf einem zweiten Hof · Etappe 2 Punkt 3: zbBestand über alle Höfe
  r = await pg.evaluate(() => { try { zentralBuchen(500000, 'Test'); spiel.geld = 500000; const A = maklerAngebote().find(a => a.boxen); if (!A) return { fehler: 'kein Angebot' }; neuerHof(A, 'Lindenhof'); $('dlg').hidden = true;
    const h2 = hofReihe().find(h => h !== aktivHid()); let H2; imHof(h2, () => { H2 = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 8, name: 'Fernhengst' }); H2.anteile = { hannoveraner: 100 }; H2.werte = H2.werte || erzeugeWerte(H2); spiel.boxen[0].pferd = H2;
      const S2 = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Fernstute' }); S2.anteile = { hannoveraner: 100 }; S2.werte = S2.werte || erzeugeWerte(S2); spiel.boxen[1].pferd = S2; window.S2 = S2; });
    spiel.fremdFohlen = [{ hid: H2.id, hengst: H2.name, besitzer: 'Anna Berg', w: true, stute: 'Hanne', rasse: 'hannoveraner', geburt: jzJetzt() - 1, q: 0.5 }];
    jedenHof(() => fremdFohlenJahreszeit(), true);
    delete spiel.zbAb; S2.zbBestand = undefined; zbBestand();
    return { n: H2.nachkommen || 0, aktiv: aktivHid(), h2, bestand: !!S2.zbBestand }; } catch (x) { return { fehler: x.message + " " + String(x.stack || "").slice(0, 400) }; } });
  ok('Fremdfohlen: Hengst auf dem zweiten Hof bekommt den Nachkommen', r.n === 1 && !r.fehler, JSON.stringify(r));
  ok('zbBestand markiert auch Stuten auf dem zweiten Hof', r.bestand === true, JSON.stringify(r));

  // 11: Gaststute ohne Futterwunsch/Pensionslogik
  r = await pg.evaluate(() => { const G = mk('Gasti', 'Stute', 4); const e = { eid: 'eg1', vn: 'Anna', nn: 'Berg', w: true, pid: G.id, art: 'gast', stufe: 1, leistungen: {}, haltung: 'box', zufr: 70, seit: jzJetzt(), einzug: spiel.tag, bisTag: spiel.tag + 2, preis: 0 }; G.einsteller = 'eg1'; einstellerListe().push(e);
    const z0 = e.zufr; let fehler = ''; try { pensionNacht(); pensionZuchtNacht(); } catch (x) { fehler = x.message; } return { fw: besitzerFutter(G, spiel.boxen[4]), z0, z1: e.zufr, fehler, gedeckt: !!G.gedeckt }; });
  ok('Gaststute: kein Futterwunsch, keine Zufriedenheit, keine Pensionszucht', r.fw === null && r.z0 === r.z1 && !r.gedeckt && !r.fehler, JSON.stringify(r));

  // 19: Tipp Deckhengst
  r = await pg.evaluate(() => { spiel.tippsAus = false; spiel.tipps = spiel.tipps || {}; delete spiel.tipps.deckhengst; spiel.tippWarte = []; deckhengstDialog(H, null); return (spiel.tippWarte || []).includes('deckhengst'); });
  ok('Tipp „Deckhengst“ wird gemerkt', r, r);

  if (ORD) { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => { spiel.tippsAus = true; spiel.zbHof = [{ pid: S.id, tag: spiel.tag + 4, hid: aktivHid(), geld: 200 }]; zuchtverbandDialog(S, null); }); await bild('etappe3-handy-hoch'); await pg.setViewportSize({ width: 844, height: 390 }); await pg.evaluate(() => deckhengstDialog(H, null)); await bild('etappe3-handy-quer'); }
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
