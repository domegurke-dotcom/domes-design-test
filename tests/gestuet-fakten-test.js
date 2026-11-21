// 21.11.2026 (Dome „übernehmen“): echte Angaben – Hörstein 4 Hengste, Schwaiganger mit 2 Edelbluthaflingern, Treidelhof 200 € Reservierung je Hengst und Saison,
// Stute nach dem Decken abholen (Brief-Aktion). Quelle notizen/RECHERCHE-FRAGEN-GESTUETE-2026-11-21.md
// Start: NODE_PATH=<playwright> node tests/gestuet-fakten-test.js [Bilderordner] · Erwartet: „alles ok“.
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
  const d = await pg.evaluate(() => ({ hoer: gHerde('hoerstein').hengste.length, schw: gHerde('schwaiganger').hengste.map(h => h.rasse), res: GESTUETE.treidelhof.res }));
  ok('Hörstein hat 4 Deckhengste', d.hoer === 4, d.hoer);
  ok('Schwaiganger: Noriker und 2 Haflinger', d.schw.filter(r => r === 'haflinger').length === 2 && d.schw.includes('noriker'), d.schw.join(','));
  ok('Treidelhof: Reservierung 200 €', d.res === 200);
  // Andalusier-Stute in die Gastbox am Treidelhof
  const gb = await pg.evaluate(() => { const bx = spiel.boxen.find(x => !x.pferd && !x.reserviert); const S = neuesPferd({ id: 'tr1', rasse: 'andalusier', geschlecht: 'Stute', alter: 7, name: 'Lucia' }); S.pflege = erzeugePflege(S); bx.pferd = S;
    const G = GESTUETE.treidelhof, H = gHerde('treidelhof').hengste.find(h => h.rasse === 'andalusier'), alt = impfFaellig; impfFaellig = () => false; let R; try { R = gGastboxKern(G, H, S, bx); } finally { impfFaellig = alt; } return { ok: R.ok, t: R.text }; });
  ok('Gastbox am Treidelhof gebucht', gb.ok, gb.t.replace(/<[^>]+>/g, '').slice(0, 120));
  const l = await pg.evaluate(() => { const g0 = spiel.geld, nb = (spiel.post || []).length; let n = 0, br = null;
    while (n < 30) { naechsteNacht(); n++; br = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'gastAbholen' && x.aktion.pid === 'tr1'); if (br) break; }
    const e = (spiel.extern || []).find(x => x.pferd && x.pferd.id === 'tr1'), F = (spiel.finanzen || spiel.buchungen || []);
    return { n, br: br && br.id, html: br ? briefAktionHTML(br) : '', stand: e && e.stand, res: (spiel.gRes || []).length, text: br ? br.text.replace(/<[^>]+>/g, '') : '' }; });
  ok('Brief „ist gedeckt“ mit Wahl abholen / bleibt', !!l.br && /ga-ja/.test(l.html) && /ga-nein/.test(l.html) && l.stand === 'gedeckt', `${l.n} Nächte · ${l.text.slice(0, 160)}`);
  ok('Reservierung einmal gebucht', l.res === 1, l.res);
  const ab = await pg.evaluate((bid) => { const br = spiel.post.find(x => x.id === bid), g0 = spiel.geld; let fertig = false; briefAktionAus({ dataset: { baktion: 'ga-ja', bid } }, br, br.aktion, () => { fertig = true; });
    const bx = spiel.boxen.find(x => x.pferd && x.pferd.id === 'tr1'); return { fertig, zurueck: !!bx, gedeckt: !!(bx && bx.pferd.gedeckt), art: bx && bx.pferd.gedeckt && bx.pferd.gedeckt.art, extern: (spiel.extern || []).some(x => x.pferd && x.pferd.id === 'tr1'), kosten: g0 - spiel.geld, antw: br.aktion.antwort, html: briefAktionHTML(br) }; }, l.br);
  ok('Jetzt abholen: Stute zurück, gedeckt wie zu Hause, Transport bezahlt', ab.fertig && ab.zurueck && ab.gedeckt && ab.art === 'natur' && !ab.extern && ab.kosten > 0, JSON.stringify(ab).slice(0, 220));
  ok('Brief zeigt danach nur noch die Antwort', /zurück in Box/.test(ab.html) && !/ga-ja/.test(ab.html), ab.html.replace(/<[^>]+>/g, '').slice(0, 100));
  /* 22.11.2026: Stute jeden Tag füttern, misten, tränken – sonst stirbt sie zufällig an Entkräftung (Testfehler, kein Spielfehler) */
  const tu = await pg.evaluate(() => { let n = 0; while (n < 20) { spiel.boxen.forEach(x => { if (x.pferd && !x.pferd.klinik) { x.krippeVoll = true; x.mistig = false; x.mistStufe = 0; x.wasserTag = spiel.tag; } }); naechsteNacht(); n++; const bx = spiel.boxen.find(x => x.pferd && x.pferd.id === 'tr1'); if (!bx.pferd.gedeckt) return { n, traechtig: !!bx.pferd.traechtig }; } return { n, offen: true }; });
  ok('Danach läuft die Trächtigkeit wie beim Decken zu Hause weiter', !tu.offen, JSON.stringify(tu));
  ok('keine Fehler in der Konsole', !errs.length, errs.join(' | ').slice(0, 300));
  console.log(L.join('\n')); console.log(L.every(x => x.startsWith('✓')) ? 'alles ok' : 'FEHLER'); await b.close(); })();
