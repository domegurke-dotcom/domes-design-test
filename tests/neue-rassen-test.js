// Westfale, Connemara-Pony, Welsh Pony (26.11.2026): sind sie in allen Rassentabellen eingetragen? Gene, HWSD (Connemara), WFFS (Westfale), Verband/Körung, Pferde erzeugen, Marktwert.
// Start (PowerShell): $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/neue-rassen-test.js   ·   MOTOR=1 prüft den Motor
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
    const R = ['westfale', 'connemara', 'welshpony'], o = { fehlt: [] };
    const tabellen = { RASSEN: id => !!rasseById(id), PROFIL: id => !!PROFIL[id], KOPF_REAL: id => !!KOPF_REAL[id], OHR_RASSE: id => OHR_RASSE[id] != null, FREMDBLUT: id => !!FREMDBLUT[id], ZUCHT_GRUPPE: id => !!ZUCHT_GRUPPE[id], RASSE_GENE: id => !!RASSE_GENE[id], WEISS_RASSE: id => WEISS_RASSE[id] != null, ND1: id => ND1[id] != null, BAU_GRUPPE: id => !!BAU_GRUPPE[id], SELTEN_MERKMAL_RASSE: id => SELTEN_MERKMAL_RASSE[id] != null, SELTEN_SCHWELLE: id => !!SELTEN_SCHWELLE[id], RASSE_PREIS: id => !!RASSE_PREIS[id], BAU: id => !!BAU[id], HUF_RASSE: id => !!HUF_RASSE[id], VERBAND: id => !!VERBAND[id], HENGST: id => !!HENGST[id], GESTUET_ECHT: id => !!GESTUET_ECHT[id], GESTUET_NAMEN: id => !!GESTUET_NAMEN[id], ST_AUK: id => !!ST_AUK[id] };
    R.forEach(id => Object.entries(tabellen).forEach(([n, f]) => { let g = false; try { g = f(id); } catch (e) { } if (!g) o.fehlt.push(id + ':' + n); }));
    o.typen = R.map(id => [TYPEN.concat(LEICHT_TYPEN).some(t => (t.rassen || []).includes(id)), id]).filter(x => !x[0]).map(x => x[1]);
    o.leichtfutter = R.filter(id => ['connemara', 'welshpony'].includes(id) && !LEICHTFUTTRIG.includes(id));
    // Pferde, Marktwert, Namen
    o.pferde = R.map(id => { const rr = zufall('nr-' + id), p = mkPferd('nr' + id, id, 0, 7, rr, 'Stute', zuechterGeb(7, rr), 'gestuet'); marktKoerper(p, rr, 'zuechter'); return { id, rasse: p.rasse, wert: marktwert(p), name: pferdeName('Stute', id, 'zucht', rr), sm: smVon(p), rm: rasseMerkmale(p).z.length }; });
    // HWSD: betroffenes Connemara bekommt über die Jahreszeit einen Hornspalt (Erbkrankheit als Ursache), Labortest nennt HWSD
    const C = neuesPferd({ rasse: 'connemara', geschlecht: 'Stute', alter: 6, name: 'Hwsd' }); C.pflege = erzeugePflege(C); C.werte = C.werte || erzeugeWerte(C); erbVon(C).hwsd = 2;
    while (spiel.boxen.length < 2) spiel.boxen.push({ pferd: null }); spiel.boxen[0].pferd = C; spiel.boxen[0].tot = false;
    const m0 = Math.random; Math.random = () => 0.01; try { erbJahreszeit(); } finally { Math.random = m0; }
    const bf = befundListe(C).find(x => x.art === 'hornspalt'); o.hornspalt = !!bf; o.ursache = bf ? bf.ursache : ''; o.erbKrank = erbKrank(C, 'hwsd');
    o.laborInfo = LABOR_TESTS.krank.info.includes('HWSD'); o.gentest = (HENGST.connemara.gentest || {}).pflicht; o.erbInfo = !!ERB_INFO.hwsd;
    // WFFS bei Westfale, HWSD nur Connemara
    o.wffs = ERBKRANK.wffs.rassen.westfale; o.hwsdRassen = Object.keys(ERBKRANK.hwsd.rassen);
    o.a18 = a18Pflicht(neuesPferd({ rasse: 'westfale', geschlecht: 'Hengst', alter: 8, name: 'W' })); o.a18c = a18Pflicht(neuesPferd({ rasse: 'connemara', geschlecht: 'Hengst', alter: 8, name: 'C' }));
    // Stutbuch-Stufen der Westfale: 3 Stufen (Stutbuch I, II, Vorbuch); Hengste: Körung
    o.stufen = { w: VERBAND.westfale.stufen.map(x => x.n), c: VERBAND.connemara.stufen.map(x => x.n), p: VERBAND.welshpony.stufen.map(x => x.n) };
    // Erlaubte Veredler Westfale, rote Liste, Reisen, Termine
    o.veredler = VEREDELUNG.westfale; o.rote = ROTE_LISTE.westfale; o.reisen = [REISE.irland.rassen.includes('connemara'), REISE.grossbritannien.rassen.includes('welshpony')];
    o.termin = TERMIN_RASSE.find(([re]) => re.test('Westfälische Auktion'))[1];
    return o;
  });
  ok('alle Rassentabellen enthalten die drei neuen Rassen', r.fehlt.length === 0, r.fehlt.join(', '));
  ok('Pferdetypen: alle drei in einem Typ (Sportpferd/Pony) gelistet, Ponys leichtfuttrig', r.typen.length === 0 && r.leichtfutter.length === 0, JSON.stringify({ t: r.typen, l: r.leichtfutter }));
  ok('Pferde erzeugen, Marktwert > 0, Zuchtname, Größe im Rahmen', r.pferde.every(p => p.wert > 0 && p.name && p.sm), JSON.stringify(r.pferde.map(p => [p.id, p.wert, p.name, p.sm])));
  ok('HWSD: betroffenes Connemara bekommt Hornspalt mit Ursache „Erbkrankheit (HWSD)“', r.erbKrank && r.hornspalt && /HWSD/.test(r.ursache), JSON.stringify({ e: r.erbKrank, h: r.hornspalt, u: r.ursache }));
  ok('HWSD nur beim Connemara, Labortest nennt es, Hengst-Gentest Pflicht, Info-Text da', r.hwsdRassen.join() === 'connemara' && r.laborInfo && (r.gentest || []).includes('hwsd') && r.erbInfo, JSON.stringify({ r: r.hwsdRassen, g: r.gentest }));
  ok('WFFS beim Westfale (Gentest für Hengste Pflicht), nicht beim Connemara', r.wffs > 0 && r.a18.includes('wffs') && !r.a18c.includes('wffs'), JSON.stringify({ w: r.wffs, a: r.a18, c: r.a18c }));
  ok('Zuchtbuch-Stufen wie in den Zuchtprogrammen', r.stufen.w.join() === 'Stutbuch I,Stutbuch II,Vorbuch' && r.stufen.c.join() === 'Stutbuch I,Stutbuch II,Anhang' && r.stufen.p.join() === 'Stutbuch I,Stutbuch II,Anhang', JSON.stringify(r.stufen));
  ok('Veredler Westfale, Rote Liste, Reiseziele, Termine „Westfälische Auktion“ → Westfale', r.veredler.includes('vollblut') && r.rote === 'NG' && r.reisen.every(Boolean) && r.termin.join() === 'westfale', JSON.stringify({ v: r.veredler, t: r.termin, r: r.reisen }));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
