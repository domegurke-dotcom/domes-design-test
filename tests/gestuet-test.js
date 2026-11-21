// Auftrag 19, Etappe M4b (26.11.2026): echte Gestüte – Gestütsseite, lebende Herde mit Stammbaum, Merken/Kalender, Besuch mit Eintritt und Führung,
// Kauf vor Ort, Hengst buchen (Natursprung in der Gastbox, Versandsamen), Ankauf eines gekörten Hengstes, Termine im HufNetz/Zeitung, alter Spielstand. Mit echten Klicks.
// Start: NODE_PATH=<playwright> node tests/gestuet-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: (([w, h]) => ({ width: w, height: h }))((process.env.GROESSE || '1366x768').split('x').map(Number)) });
  pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/version\.json/.test(m.text())) errs.push(m.text()); });
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png', fullPage: false }); };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText);
  const knopf = async t => { await pg.click(`#dlgKnoepfe button:has-text("${t}")`); await pg.waitForTimeout(350); };
  const schirm = () => pg.evaluate(() => document.getElementById('nebenSchirm').innerText);
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200);
  await pg.selectOption('#kaufLand', '16'); await pg.waitForTimeout(100); const orte = await pg.$$eval('#kaufOrt option', o => o.map(x => x.value)); await pg.selectOption('#kaufOrt', orte.find(o => /Erfurt|Saalfeld|Rudolstadt|Ilmenau/.test(o)) || orte[0]); await pg.waitForTimeout(100);
  await pg.fill('#kaufName', 'Gestütshof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 90000; spiel.admin = false; VET.verbotAb = Object.fromEntries(Object.keys(VET.verbotAb).map(k => [k, 99])); });
  // 1. Daten und Herde
  const h1 = await pg.evaluate(() => { const fehlt = RASSEN.map(r => r.id).filter(r => !gestuetVon(r)); const H = gHerde('celle'), M = gHerde('ebbs'), V = gVerkauf('ebbs'); const namen = M.hengste.map(h => h.name);
    return { fehlt, celle: H.hengste.length, celleSt: H.stuten.length, taxe: H.hengste.every(h => h.gTaxe >= 650 && h.gTaxe <= 1150), meura: M.hengste.length, meuraSt: M.stuten.length,
      vater: V.length && V.every(h => h.ahnen && h.ahnen.vater && M.hengste.concat([]).some(x => x.name === h.ahnen.vater.name) || gKettenCache('ebbs', datum().j).aktiv(datum().j - 3, true).length), vk: V.length, rein: V.every(h => h.rasse === 'haflinger') }; });
  ok('jede Rasse hat ein echtes Gestüt', !h1.fehlt.length, h1.fehlt.join(','));
  ok('Celle: 8 Hengste, keine Stuten, Decktaxe 650–1.150 € (M4E)', h1.celle === 8 && h1.celleSt === 0 && h1.taxe, `${h1.celle}/${h1.celleSt}`);
  ok('Ebbs: 8 Hengste, 14 Stuten, Verkaufspferde reinrassig', h1.meura === 8 && h1.meuraSt === 14 && h1.vk >= 1 && h1.rein, `${h1.meura}/${h1.meuraSt}/${h1.vk}`);
  const h2 = await pg.evaluate(() => { const a = gHerde('ebbs').hengste.map(h => h.nr).join(); G_CACHE.clear(); G_OBJ.clear(); G_KCACHE.clear(); const b2 = gHerde('ebbs').hengste.map(h => h.nr).join();
    const Z = gHerde('ebbs', datum().j + 25).hengste, eigen = Z.filter(h => h.gHer === 'eigene Zucht').length, wechsel = Z.filter(h => !gHerde('ebbs').hengste.some(x => x.nr === h.nr)).length;
    return { gleich: a === b2, eigen, wechsel, groesse: JSON.stringify(spiel.gestuete || {}).length }; });
  ok('Herde aus festem Zufall (gleich nach Neuberechnung)', h2.gleich);
  ok('nach 25 Jahren: Hengste gewechselt, eigene Nachzucht dabei', h2.wechsel >= 4 && h2.eigen >= 1, `${h2.wechsel} neu, ${h2.eigen} eigene Zucht`);
  ok('Spielstand wächst kaum (nur Änderungen gespeichert)', h2.groesse < 300, h2.groesse + ' Zeichen');
  // 2. Markt – Gestüte – Ebbs (echte Klicks)
  await pg.evaluate(() => zeigeMarkt(null)); await pg.waitForTimeout(300); await pg.click('[data-mb="gestuet"]'); await pg.waitForTimeout(300);
  await pg.click('[data-gest="haflinger"]'); await pg.waitForTimeout(500); let t = await schirm();
  ok('Gestütsseite: Name, Hinweis, Hengste, Verkauf, Termine, Karte', /Fohlenhof Ebbs/.test(t) && /Fiktive Pferde, reale Orte/.test(t) && /Gestütshengste \(8\)/.test(t) && /Verkaufspferde/.test(t) && /Stutfohlenauktion/.test(t) && await pg.$('svg.g-karte') !== null, t.slice(0, 120).replace(/\s+/g, ' '));
  await bild('m4b-gestuetsseite');
  await pg.click('[data-gmerk="ebbs"]'); await pg.waitForTimeout(300);
  const k1 = await pg.evaluate(() => { const L = []; for (let k = 0; k < 4; k++) L.push(...kalTermine(jzJetzt() + k).filter(x => /Ebbs/.test(x.text))); return { merk: gZustand('ebbs').merk, n: L.length }; });
  ok('Merken: Termine von Ebbs im Kalender', k1.merk && k1.n >= 4, k1.n + ' Termine');
  // 3. Hinfahren mit dem Auto, Führung, Vorführen, Kauf
  const g0 = await pg.evaluate(() => spiel.geld); await pg.click('[data-gbesuch="ebbs"]'); await pg.waitForTimeout(350); let d = await dlgText();
  ok('Fahrt-Fenster zum Gestüt', /Fahrt nach Ebbs/.test(d) && /Mit dem Auto/.test(d), d.slice(0, 100).replace(/\s+/g, ' '));
  await knopf('Mit dem Auto'); t = await schirm();
  const b1 = await pg.evaluate(g => ({ B: spiel.besuch, abz: g - spiel.geld }), g0);
  ok('Besuch läuft im Gestüt: Hengste im Stall, Verkaufspferde, Heimfahren', b1.B && b1.B.gestuet === 'ebbs' && /Hengste im Stall/.test(t) && /Heimfahren/.test(t), b1.B && b1.B.d);
  await bild('m4b-besuch');
  const g1 = await pg.evaluate(() => spiel.geld); await pg.click('[data-gfuehrung="ebbs"]'); await pg.waitForTimeout(350); d = await dlgText();
  const f1 = await pg.evaluate(g => g - spiel.geld, g1);
  ok('Führung kostet 5 € und erklärt Geschichte und Berufe', f1 === 5 && /1947/.test(d) && /Pferdewirte/.test(d), f1 + ' €');
  await bild('m4b-fuehrung'); await knopf('Danke');
  await pg.click('[data-gvor="ebbs|0"]'); await pg.waitForTimeout(300); d = await dlgText(); ok('Hengst vorführen', /wird vorgeführt/.test(d) && /Trab/.test(d)); await knopf('OK');
  const n0 = await pg.evaluate(() => spiel.boxen.filter(x => x.pferd).length + (spiel.importe || []).length);
  await pg.click('[data-gbpf]'); await pg.waitForTimeout(350); d = await dlgText();
  ok('Verkaufspferd vor Ort: im Gestüt, ansehen, AKU', /im Fohlenhof Ebbs/.test(d) && /Genau ansehen/.test(d) && /AKU/.test(d), d.slice(0, 80).replace(/\s+/g, ' '));
  await knopf('Kaufen'); await pg.waitForTimeout(300); d = await dlgText();
  const kf = await pg.evaluate(() => ({ n: spiel.boxen.filter(x => x.pferd).length + (spiel.importe || []).length, post: (spiel.finanzen[String(datum().j)] || {}) }));
  ok('Kauf im Gestüt: Transport bringt das Pferd', kf.n === n0 + 1 && /morgen/.test(d) && Object.keys(kf.post).some(k => /^Gestüt: /.test(k)), Object.keys(kf.post).filter(k => /Gestüt|Eintritt|Führung/.test(k)).join(' | '));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt(); }); await pg.waitForTimeout(250);
  await pg.click('#besuchHeim'); await pg.waitForTimeout(2600); await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  ok('Heimfahrt beendet den Besuch', await pg.evaluate(() => !spiel.besuch));
  // 4. Hengst buchen: Natursprung in der Gastbox (Haflingerstute), Versandsamen in Celle (Hannoveranerstute)
  await pg.evaluate(() => { const d0 = datum(); if (d0.s !== 0) { spiel.tag += (4 - d0.s) * tpj() - (d0.t - 1); }
    const mk = (id, rasse) => { const p = neuesPferd({ id, name: id === 'st1' ? 'Hanna' : 'Gerda', rasse, geschlecht: 'Stute', alter: 7 }); p.pflege = erzeugePflege(p); p.pflege.gesundheit = 100; p.pflege.wohl = 100; const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert && !x.tot); bx.pferd = p; return bx; };
    mk('st1', 'haflinger'); mk('st2', 'hannoveraner'); speichern(); });
  await pg.evaluate(() => { marktBereich = 'gestuet'; gestuetWahl = 'haflinger'; zeigeMarkt(); }); await pg.waitForTimeout(400);
  await pg.click('[data-gdecken="ebbs|1"]'); await pg.waitForTimeout(350); d = await dlgText();
  ok('Decken: Stute wählen', /welche Stute/.test(d) && /Hanna/.test(d));
  await pg.click('[data-gst="st1"]'); await pg.waitForTimeout(350); d = await dlgText();
  ok('Deckarten von Ebbs: Natursprung (Gastbox) und Versandsamen', /Natursprung \(Gastbox\)/.test(d) && /Versandsamen/.test(d) && /Gastbox 15/.test(d), d.slice(0, 160).replace(/\s+/g, ' '));
  await bild('m4b-deckarten');
  await knopf('Natursprung (Gastbox)'); await pg.waitForTimeout(300); d = await dlgText();
  const gb = await pg.evaluate(() => { const e = (spiel.extern || []).find(x => x.ort === 'gastbox'); return { e: !!e, res: spiel.boxen.some(x => x.reserviert === 'st1'), weg: !spiel.boxen.some(x => x.pferd && x.pferd.id === 'st1') }; });
  ok('Stute fährt in die Gastbox, ihre Box bleibt frei', gb.e && gb.res && gb.weg && /Gastbox/.test(d), JSON.stringify(gb));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  let erg = null; for (let n = 0; n < 16 && !erg; n++) { erg = await pg.evaluate(() => { spiel.boxen.forEach(x => { if (x.pferd) { x.krippeVoll = true; x.mistig = false; x.mistStufe = 0; } }); naechsteNacht(); const zur = spiel.boxen.find(x => x.pferd && x.pferd.id === 'st1');
    return zur ? { tragend: !!zur.pferd.traechtig, vater: zur.pferd.traechtig && zur.pferd.traechtig.vater.name, brief: (spiel.post || []).filter(p => /Hanna (ist tragend|kommt leer)/.test(p.betreff)).map(p => p.betreff), rechnung: (spiel.post || []).some(p => /Gastbox: Hanna/.test(p.betreff)), extern: (spiel.extern || []).length } : null; }); }
  ok('Gastbox: Stute kommt mit Brief zurück (tragend oder leer), Rechnung für die Gastbox', erg && erg.brief.length && erg.rechnung && erg.extern === 0, JSON.stringify(erg));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const d0 = datum(); if (d0.s !== 0) { spiel.tag += (4 - d0.s) * tpj() - (d0.t - 1); } marktBereich = 'gestuet'; gestuetWahl = 'hannoveraner'; zeigeMarkt(); }); await pg.waitForTimeout(400);
  const taxe = await pg.evaluate(() => gHerde('celle').hengste[0].gTaxe), g2 = await pg.evaluate(() => spiel.geld);
  await pg.click('[data-gdecken="celle|0"]'); await pg.waitForTimeout(300); await pg.click('[data-gst="st2"]'); await pg.waitForTimeout(300); await knopf('Versandsamen'); await pg.waitForTimeout(300); d = await dlgText();
  const vs = await pg.evaluate(g => { const p = spiel.boxen.find(x => x.pferd && x.pferd.id === 'st2').pferd; return { ged: !!p.gedeckt, art: p.gedeckt && p.gedeckt.art, abz: g - spiel.geld, rest: p.deckRest && p.deckRest.betrag }; }, g2);
  ok('Versandsamen aus Celle: Anzahlung 350 € + Tierarzt, Rest bei Trächtigkeit (M4E)', vs.ged && vs.art === 'besamung' && vs.abz === 350 + 120 && vs.rest === taxe - 350 && /Besamt/.test(d) && /Anzahlung/.test(d), `${vs.abz} € (Taxe ${taxe}, Rest ${vs.rest})`);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  // 5. Ankauf eines gekörten Junghengstes durch Celle
  const an = await pg.evaluate(() => { const p = neuesPferd({ id: 'jh1', name: 'Junker', rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 3 }); p.pflege = erzeugePflege(p); const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert); bx.pferd = p; p.hb = { s: 'end', tag: spiel.tag };
    const z = hengstZulassung(p); const d0 = datum(); spiel.tag += ((2 - d0.s + 4) % 4) * tpj() - (d0.t - 1); const J = jzJetzt() - 10; p.geb = { s: J % 4, j: Math.floor(J / 4) }; const alt = Math.random; Math.random = () => 0.01; try { gestuetTag(); } finally { Math.random = alt; }
    const br = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'gAnkauf'); return { z: !!z, br: br && br.betreff, preis: br && br.aktion.preis }; });
  ok('Celle macht ein Vorab-Kaufangebot für den gekörten 2½-Jährigen (M4G)', an.br && /Junker/.test(an.br), JSON.stringify(an));
  if (an.br) { await pg.evaluate(() => { const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'gAnkauf'); briefZeigen ? briefZeigen(br) : null; }).catch(() => {});
    const r5 = await pg.evaluate(() => { const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'gAnkauf'), g = spiel.geld; gAnkaufAus('ja', br, br.aktion); return { plus: spiel.geld - g, weg: !spiel.boxen.some(x => x.pferd && x.pferd.id === 'jh1'), imGestuet: gHerde('celle').hengste.some(h => h.name === 'Junker'), html: gAnkaufHTML(br) }; });
    ok('Ankauf: Geld da, Hengst steht jetzt in Celle', r5.weg && r5.imGestuet && r5.plus === an.preis && /Verkauft/.test(r5.html), JSON.stringify(r5).slice(0, 120)); }
  // 6. Termine: HufNetz-Liste ganz Deutschland mit Gestütsterminen, Besuch am Termin
  const tm = await pg.evaluate(() => { const L = []; for (let k = 0; k < 4; k++) L.push(...alleTermine(jzJetzt() + k).filter(t => t.gid)); return { n: L.length, celle: L.some(t => t.gid === 'celle' && t.art === 'parade'), reise: L.some(t => ['cotebrook', 'hanovershoe'].includes(t.gid)) }; });
  ok('Gestütstermine in der Terminliste (ohne Reise-Gestüte)', tm.n >= 20 && tm.celle && !tm.reise, tm.n + ' Termine');
  const pa = await pg.evaluate(() => { let t = null; for (let k = 0; k < 4 && !t; k++) t = alleTermine(jzJetzt() + k).find(x => x.gid === 'celle' && x.art === 'parade'); spiel.tag = t.tag; delete spiel.besuch; delete spiel.besuchHeute; return t; });
  await pg.evaluate(() => { marktBereich = 'gestuet'; gestuetWahl = 'hannoveraner'; zeigeMarkt(); }); await pg.waitForTimeout(400); t = await schirm();
  ok('Gestütsseite zeigt den Termin heute', /Heute: .*Celler Hengstparade/.test(t));
  const g3 = await pg.evaluate(() => spiel.geld); await pg.click('[data-gbesuch="celle"]'); await pg.waitForTimeout(350); await knopf('Mit dem Auto'); t = await schirm();
  const pe = await pg.evaluate(g => ({ abz: g - spiel.geld, fahrt: besuchKosten(spiel.besuch.km, false).summe }), g3);
  ok('Hengstparade: Eintritt 15 € + Fahrt, Parade sichtbar', pe.abz === pe.fahrt + 15 && /Celler Hengstparade/.test(t) && /Die Hengste werden einzeln vorgestellt/.test(t), `${pe.abz} = ${pe.fahrt} + 15`);
  await bild('m4b-parade');
  // 7. Reise-Gestüt: ohne Reise kein Hinfahren, Tiefgefriersamen mit Versand
  await pg.evaluate(() => { marktBereich = 'gestuet'; gestuetWahl = 'shire'; zeigeMarkt(); }); await pg.waitForTimeout(400); t = await schirm();
  ok('Shire (England): nur mit Reise, Tiefgefriersamen', /Nur mit einer Reise/.test(t) && /Tiefgefriersamen/.test(t) && !(await pg.$('[data-gbesuch="cotebrook"]')));
  // 8. alter Spielstand ohne spiel.gestuete, Speichern/Laden
  const al = await pg.evaluate(() => { delete spiel.gestuete; G_CACHE.clear(); try { return { ok: gestuetSeiteHTML(t => '<div>', 'fjord').includes('Gestütshengste') }; } catch (e) { return { ok: false, e: e.message }; } });
  ok('alter Spielstand ohne Gestüts-Daten', al.ok, al.e || '');
  ok('keine Fehler in der Konsole', !errs.length, errs.slice(0, 3).join(' | '));
  console.log(L.join('\n')); console.log(L.every(x => x.startsWith('✓')) ? 'alles ok' : 'FEHLER'); await b.close(); })();
