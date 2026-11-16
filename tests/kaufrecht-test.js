// Auftrag 25 Block 4, Etappe 4d (v1065): Röntgen nach dem Leitfaden 2018 (3 Stufen, Marktwert −8 % / −20 %), Auktionspferde mit veröffentlichtem Röntgen,
// Kaufrecht: Hinweis im Kauf-Fenster und im Kaufvertrag-Brief, Rücktritt bei Händler/Gestüt innerhalb von 2 Jahreszeiten, privat nicht.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/kaufrecht-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  const brief = async id => { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('post'); }); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); } await pg.click(`[data-brief="${id}"]`); await pg.waitForTimeout(400); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 200000; spiel.einsteller = []; spiel.pensionAnfragen = []; spiel.boxen.forEach(bx => { bx.pferd = null; bx.tot = false; }); });
    /* 1. Röntgen-Stufen und Marktwert */
    let r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 7, name: 'Rö' }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.befunde = []; const w0 = marktwert(P); P.roeBefund = { k: 2 }; const w2 = marktwert(P); P.roeBefund = { k: 3 }; const w3 = marktwert(P); return { w0, q2: w2 / w0, q3: w3 / w0, L: ROENTGEN.slice(1) }; });
    ok(`Röntgen 2018: „ohne besonderen Befund“, „Risiko nicht einschätzbar“ ×${r.q2.toFixed(2)}, „Risiko“ ×${r.q3.toFixed(2)} im Marktwert`, Math.abs(r.q2 - 0.92) < 0.02 && Math.abs(r.q3 - 0.8) < 0.02 && r.L[0] === 'ohne besonderen Befund' && /nicht einschätzbar/.test(r.L[1]) && /Risiko für Lahmheit/.test(r.L[2]), JSON.stringify(r));
    /* 2. Händler: Hinweis im Kauf-Fenster, Kauf mit echten Klicks, verdeckte Lahmheit */
    r = await pg.evaluate(() => { const h = marktpferde()[0]; h.akuF = [{ art: 'lahmheit', grad: 1, check: 'beuge', maskiert: true, text: 'Schmerzmittel im Blut – eine Lahmheit wurde verschleiert!', minus: 0.08 }]; h.akuKlasse = 1; marktBereich = 'haendler'; zeigeSchirm('markt'); zeigeMarkt(); return { name: h.name, preis: h.preis }; });
    await pg.waitForTimeout(400); await pg.click(`.paar:has-text("${r.name}")`); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button[data-txt^="Kaufen"]'); await pg.waitForTimeout(300); await bild('K1-haendler');
    let t = await pg.innerText('#dlgInhalt');
    ok('Händler-Kauffenster nennt das Kaufrecht (6 Monate, Rücktritt, Röntgen kein Mangel)', /6 Monate/.test(t) && /zurücktreten/.test(t) && /Röntgenbefund ohne Beschwerden ist kein Mangel/.test(t), t.slice(0, 400));
    const haName = r.name, haPreis = r.preis;
    await pg.click('#dlgKnoepfe button[data-txt="Kaufen"]'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(n => { document.getElementById('dlg').hidden = true; const bx = spiel.boxen.find(x => x.pferd && x.pferd.name === n), p = bx.pferd, br = (spiel.post || []).find(q => q.betreff === 'Kaufvertrag: ' + n);
      return { kauf: p.kauf, bk: p.befunde.filter(b => b.beimKauf).map(b => b.art + ':' + (b.inkub || 0)), brief: br ? br.text.replace(/<[^>]+>/g, ' ') : '', von: br && br.von }; }, haName);
    ok('nach dem Kauf: Kaufvertrag-Brief vom Pferdehändler mit dem Recht; Mangel beim Kauf gemerkt', r.kauf && r.kauf.recht === 'unternehmer' && r.kauf.preis === haPreis && r.bk.length === 1 && /6 Monate/.test(r.brief) && r.von === 'Pferdehändler', JSON.stringify(r).slice(0, 500));
    /* Tage vergehen: Lahmheit zeigt sich, wird bemerkt → Brief „Rücktritt möglich“ */
    r = await pg.evaluate(n => { const zu = () => { document.getElementById('dlg').hidden = true; }; const P = () => spiel.boxen.find(x => x.pferd && x.pferd.name === n).pferd; let br = null;
      const b0 = P().befunde.find(x => x.beimKauf); const inkub0 = b0 && b0.inkub > spiel.tag; b0.inkub = 0; b0.grad = 2; b0.bemerkt = { von: 'du', tag: spiel.tag };   /* zeigt sich nach dem Kauf (Schmerzmittel wirkt nicht mehr) */
      spiel.boxen.forEach(bx => { if (bx.pferd) { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; } }); naechsteNacht(); zu(); br = (spiel.post || []).find(q => /Rücktritt möglich/.test(q.betreff)); if (!inkub0) br = null;   /* das Schmerzmittel muss beim Kauf noch gewirkt haben */
      return { br: br && br.id, text: br ? br.text.replace(/<[^>]+>/g, ' ') : '', kauf: P().kauf }; }, haName);
    ok('verdeckte Lahmheit zeigt sich: Brief „Rücktritt möglich“ mit § 477 und Kaufpreis', !!r.br && /477/.test(r.text) && new RegExp(String(haPreis).replace(/\B(?=(\d{3})+(?!\d))/g, '.')).test(r.text), JSON.stringify(r).slice(0, 400));
    const g0 = await pg.evaluate(() => spiel.geld);
    await brief(r.br); await bild('K2-ruecktritt');
    ok('Brief hat „Zurücktreten“ und „Behalten“', !!(await pg.$('[data-baktion="rt-ja"]')) && !!(await pg.$('[data-baktion="rt-nein"]')));
    await pg.click('[data-baktion="rt-ja"]'); await pg.waitForTimeout(300); await bild('K3-zurueck'); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(n => ({ geld: spiel.geld, da: !!spiel.boxen.find(x => x.pferd && x.pferd.name === n) }), haName);
    ok(`Rücktritt: Pferd ist weg, Kaufpreis ${haPreis} € erstattet`, !r.da && r.geld - g0 === haPreis, JSON.stringify([r, g0]));
    /* 3. Privat: Hinweis im Fenster, kein Rücktritt */
    r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const h = (marktNeu().privat || [])[0]; if (!h) return null; delete h.anzOrt; h.akuF = [{ art: 'lahmheit', grad: 1, check: 'beuge', text: 'Beugeprobe positiv', minus: 0.08 }]; privatKaufen(h); return { name: h.name, text: document.getElementById('dlgInhalt').innerText }; });
    await bild('K4-privat');
    ok('Privatkauf-Fenster: Gewährleistung meist ausgeschlossen, nur bei Arglist', r && /Gewährleistung ist meist ausgeschlossen/.test(r.text) && /arglistig/.test(r.text), JSON.stringify(r).slice(0, 300));
    r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const h = (marktNeu().privat || [])[0]; pferdEinstellen(h, h.preis, 'Privatkauf'); document.getElementById('dlg').hidden = true; const bx = spiel.boxen.find(x => x.pferd && x.pferd.name === h.name), p = bx.pferd;
      p.befunde.forEach(b => { b.inkub = 0; b.bemerkt = { von: 'du', tag: spiel.tag }; }); kaufMangelTag(); return { recht: p.kauf && p.kauf.recht, n: (spiel.post || []).filter(q => q.betreff === 'Mangel bei ' + p.name + ': Rücktritt möglich').length }; });
    ok('Privatkauf: Krankheit zeigt sich, aber kein Rücktritt', r.recht === 'privat' && r.n === 0, JSON.stringify(r));
    /* 4. Händler-Kauf, Mangel erst nach 2 Jahreszeiten: kein Rücktritt mehr */
    r = await pg.evaluate(() => { const h = marktpferde().find(x => !spiel.boxen.some(b => b.pferd && b.pferd.id === x.id)); h.akuF = [{ art: 'lahmheit', grad: 1, check: 'beuge', text: 'Beugeprobe positiv', minus: 0.08 }]; pferdEinstellen(h, h.preis, 'Händler'); document.getElementById('dlg').hidden = true;
      const p = spiel.boxen.find(x => x.pferd && x.pferd.name === h.name).pferd; spiel.tag += 2 * tpj() + 1; p.befunde.forEach(b => { b.inkub = 0; b.bemerkt = { von: 'du', tag: spiel.tag }; }); kaufMangelTag(); return { kauf: p.kauf || null, n: (spiel.post || []).filter(q => q.betreff === 'Mangel bei ' + p.name + ': Rücktritt möglich').length }; });
    ok('nach mehr als 2 Jahreszeiten: kein Rücktritt mehr', !r.kauf && r.n === 0, JSON.stringify(r));
    /* 5. Große AKU: Röntgen im Protokoll, Stufe bleibt nach dem Kauf, drückt den Marktwert */
    r = await pg.evaluate(() => { const h = marktpferde().find(x => !spiel.boxen.some(b => b.pferd && b.pferd.id === x.id)); delete h.akuF; akuFunde(h, 'Händler'); h.akuKlasse = 3; const txt = akuMachen(h, 'Händler', 'gross', false, false).replace(/<[^>]+>/g, ' ');
      pferdEinstellen(h, h.preis, 'Händler'); document.getElementById('dlg').hidden = true; const p = spiel.boxen.find(x => x.pferd && x.pferd.name === h.name).pferd; const w = marktwert(p); const s = p.roeBefund; delete p.roeBefund; const w0 = marktwert(p); p.roeBefund = s;
      const br = (spiel.post || []).find(q => q.betreff === 'Kaufvertrag: ' + p.name); return { txt, roe: p.roeBefund, q: w / w0, brief: br ? br.text.replace(/<[^>]+>/g, ' ') : '' }; });
    ok(`Große AKU: Protokoll „Röntgen (Leitfaden 2018): Befund mit Risiko … −20 %“, Stufe bleibt am Pferd (Marktwert ×${r.q.toFixed(2)}), steht im Kaufvertrag`, /Röntgen \(Leitfaden 2018\): Befund mit Risiko für Lahmheit/.test(r.txt) && /20 %/.test(r.txt) && /kein Mangel/.test(r.txt) && r.roe && r.roe.k === 3 && Math.abs(r.q - 0.8) < 0.03 && /Röntgen: Befund mit Risiko/.test(r.brief), JSON.stringify(r).slice(0, 600));
    /* 6. Auktionshaus: Röntgen vorab veröffentlicht (Kachel und Bieten-Fenster) */
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; marktBereich = 'auktion'; zeigeSchirm('markt'); zeigeMarkt(); }); await pg.waitForTimeout(400); await bild('K5-auktion');
    r = await pg.evaluate(() => { const A = marktNeu().auktion || []; return { n: A.length, mit: A.filter(a => a.pferd.roeBefund).length, stufen: A.map(a => a.pferd.roeBefund && a.pferd.roeBefund.k), text: document.body.innerText.includes('Röntgen:') }; });
    ok(`Auktionshaus: alle ${r.n} Pferde mit veröffentlichtem Röntgen, Kachel zeigt „Röntgen:“`, r.n > 0 && r.mit === r.n && r.text, JSON.stringify(r));
    await pg.click('.paar >> nth=0'); await pg.waitForTimeout(300); const bk = await pg.$('#dlgKnoepfe button[data-txt^="Bieten"]'); if (bk) { await bk.click(); await pg.waitForTimeout(300); }
    t = await pg.innerText('#dlgInhalt'); await bild('K6-bieten');
    ok('Bieten-Fenster: Röntgen (veröffentlicht) und „Versteigerung: … zurückgeben geht nicht“', /Röntgen \(veröffentlicht\)/.test(t) && /Versteigerung/.test(t), t.slice(0, 400));
    /* 7. Eigene Untersuchung (groß): Röntgen bleibt am Pferd */
    r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const i = spiel.boxen.findIndex(x => !x.pferd); const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 9, name: 'Uwe' }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.befunde = []; spiel.boxen[i].pferd = P; P.akuKlasse = 2; untersuchungDialog(P, spiel.boxen[i], () => {}); return { i }; });
    await pg.click('[data-uk="gross"]'); await pg.waitForTimeout(300); t = await pg.innerText('#dlgInhalt'); await bild('K7-untersuchung');
    r = await pg.evaluate(i => spiel.boxen[i].pferd.roeBefund, r.i);
    ok('Eigene große Untersuchung: „Röntgen (Leitfaden 2018): Befund, Risiko nicht einschätzbar“, bleibt am Pferd', /Risiko nicht einschätzbar/.test(t) && r && r.k === 2, t.slice(0, 300) + JSON.stringify(r));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
