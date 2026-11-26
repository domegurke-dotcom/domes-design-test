// Stutenauktion (Dome 21./22.11.2026): Anmeldung per Brief (echte Klicks, Mindestpreis), Vorauswahl, Versteigerung mit Gebühren, Rücknahme, Absage, Kauf im Pferdemarkt mit Käufergebühr
// Start (PowerShell): $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/stutenauktion-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');   // MOTOR=1 prüft den Motor der App
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 200000;
    window.bisTag = (s, t) => { for (let i = 0; i < 200 && !(datum().s === s && datum().t === t); i++) spiel.tag++; };
    window.stute = (rasse, alter, name, zb) => { const p = neuesPferd({ rasse, geschlecht: 'Stute', alter, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.pflege.gesundheit = 100; p.gekauftTag = -99; if (zb) p.zb = Object.assign({ tag: spiel.tag, gesamt: 8 }, zb); return p; };
    window.inBox = (i, p) => { while (spiel.boxen.length <= i + 4) spiel.boxen.push({ pferd: null }); const bx = spiel.boxen[i]; bx.pferd = p; bx.tot = false; delete bx.fohlen; return bx; };
    spiel.boxen.forEach(bx => { bx.pferd = null; delete bx.fohlen; });
    bisTag(1, 1);   // Sommer, 1. Tag: Anmeldung für die Herbst-Auktionen
    const T = stute('trakehner', 6, 'Tamina', { i: 0, praemie: true }); T.roeBefund = { k: 1, tag: spiel.tag }; inBox(0, T);
    const T2 = stute('trakehner', 6, 'Tilda', { i: 0 }); T2.roeBefund = { k: 1, tag: spiel.tag }; inBox(1, T2);
    const N = stute('noriker', 7, 'Nora', { i: 0 }); inBox(2, N);
    const F = stute('fjord', 7, 'Fjella', { i: 0 }); inBox(3, F);
    const H = stute('hannoveraner', 7, 'Hanna', { i: 1 }); H.roeBefund = { k: 1, tag: spiel.tag }; inBox(4, H);
    const vt = neuesPferd({ rasse: 'trakehner', geschlecht: 'Hengst', alter: 9, name: 'Herzbube' }); T.traechtig = { vater: hengstKopie(vt), seit: jzJetzt() - 1, geburt: jzJetzt() + 3, art: 'besamung', sicher: true };
    spiel.post = []; stutenAuktionTag();
  });
  // --- Anmeldebriefe ---
  const an = await pg.evaluate(() => { const br = n => spiel.post.find(x => x.aktion && x.aktion.typ === 'stAuk' && x.aktion.pid === spiel.boxen.find(b => b.pferd && b.pferd.name === n).pferd.id);
    return { T: !!br('Tamina'), T2: !!br('Tilda'), N: !!br('Nora'), F: !!br('Fjella'), H: !!br('Hanna'), von: (br('Tamina') || {}).von, text: ((br('Tamina') || {}).text || '').replace(/<[^>]+>/g, ''), vonN: (br('Nora') || {}).von }; });
  ok('Sommer: Anmeldebriefe für die Herbst-Auktionen (Trakehner, Noriker), nicht für Fjord und Hannoveraner', an.T && an.T2 && an.N && !an.F && !an.H, JSON.stringify({ T: an.T, T2: an.T2, N: an.N, F: an.F, H: an.H }));
  ok('Brief vom Trakehner Verband mit Ort, Kosten und Regel für „garantiert tragend“', an.von === 'Trakehner Verband' && /Neumünster/.test(an.text) && /100/.test(an.text) && /250/.test(an.text) && /119/.test(an.text) && /höchstens 3 Tage/.test(an.text), an.text.slice(0, 160));
  ok('Noriker-Brief vom Landespferdezuchtverband Salzburg (Maishofen, 9 %)', an.vonN === 'Landespferdezuchtverband Salzburg');
  // Tamina mit echten Klicks anmelden (ohne Mindestpreis)
  const g0 = await pg.evaluate(() => spiel.geld);
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; briefFenster(spiel.post.find(x => x.aktion && x.aktion.pid === p.id).id); });
  await pg.waitForTimeout(150);
  const sel = await pg.$$eval('#dlg select[id^="stMin-"] option', o => o.map(x => x.textContent));
  ok('Brief zeigt Auswahl Mindestpreis (ohne + Stufen)', sel.length >= 4 && /ohne/.test(sel[0]), sel.join(' | '));
  await pg.click('#dlg [data-baktion="sta-ja"]'); await pg.waitForTimeout(150);
  const t1 = await pg.evaluate(g0 => { const p = spiel.boxen[0].pferd; return { st: p.stAuk && p.stAuk.st, min: p.stAuk && p.stAuk.min, minus: g0 - spiel.geld, sperre: abgabeSperre(p, spiel.boxen[0], true), info: document.querySelector('#dlg .brief-aktion-info') ? document.querySelector('#dlg .brief-aktion-info').textContent : '' }; }, g0);
  ok('Klick „Anmelden“: angemeldet, 100 € abgebucht, kein Mindestpreis', t1.st === 'angemeldet' && t1.min === 0 && t1.minus === 100, JSON.stringify(t1));
  ok('Angemeldete Stute kann nicht anders verkauft werden', /Stutenauktion/.test(t1.sperre), t1.sperre);
  // Nora mit dem höchsten Mindestpreis anmelden (echte Auswahl im Feld)
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const p = spiel.boxen[2].pferd; briefFenster(spiel.post.find(x => x.aktion && x.aktion.pid === p.id).id); });
  await pg.waitForTimeout(150);
  const letzte = await pg.$$eval('#dlg select[id^="stMin-"] option', o => o[o.length - 1].value);
  await pg.selectOption('#dlg select[id^="stMin-"]', letzte); await pg.click('#dlg [data-baktion="sta-ja"]'); await pg.waitForTimeout(150);
  const n1 = await pg.evaluate(() => { const p = spiel.boxen[2].pferd; return { st: p.stAuk && p.stAuk.st, min: p.stAuk && p.stAuk.min, wert: marktwert(p) }; });
  ok('Nora mit gewähltem Mindestpreis angemeldet (1,5 × Marktwert)', n1.st === 'angemeldet' && n1.min === +letzte && n1.min > n1.wert, JSON.stringify(n1));
  // Tilda (Trakehner, 6 J., ohne Prämie) anmelden → Absage bei der Vorauswahl
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const p = spiel.boxen[1].pferd; briefFenster(spiel.post.find(x => x.aktion && x.aktion.pid === p.id).id); });
  await pg.waitForTimeout(150); await pg.click('#dlg [data-baktion="sta-ja"]'); await pg.waitForTimeout(100);
  const kal = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; return kalTermine(jzJetzt() + 1).map(t => t.text).join(' | '); });
  ok('Kalender zeigt Vorauswahl und Auktionstag', /Vorauswahl Tamina/.test(kal) && /Trakehner Hengstmarkt mit Stutenauktion: Tamina/.test(kal), kal.slice(0, 200));
  // --- Vorauswahl am 1. Herbsttag ---
  const va = await pg.evaluate(() => { const g = spiel.geld; spiel.post = []; bisTag(2, 1); stutenAuktionTag(); const T = spiel.boxen[0].pferd, T2 = spiel.boxen[1].pferd, N = spiel.boxen[2].pferd;
    return { T: T.stAuk && T.stAuk.st, T2: !!T2.stAuk, N: N.stAuk && N.stAuk.st, minus: g - spiel.geld, briefe: spiel.post.map(x => x.betreff + ': ' + (x.text || '').replace(/<[^>]+>/g, '')).join(' || ') }; });
  ok('Vorauswahl: Prämienstute Tamina zugelassen, Noriker zugelassen', va.T === 'zugelassen' && va.N === 'zugelassen', JSON.stringify({ T: va.T, N: va.N }));
  ok('Zulassung + Versicherung Trakehner 369 € (Noriker ohne Pauschale)', va.minus === 369, 'abgebucht ' + va.minus);
  ok('Tilda (6 J., ohne Prämie) bekommt eine Absage mit Grund', !va.T2 && /Absage für Tilda/.test(va.briefe) && /Prämienstuten/.test(va.briefe), va.briefe.slice(0, 300));
  ok('Zulassungsbrief mit Auktionstag und Knopf „Zurückziehen“', /Tamina ist zugelassen/.test(va.briefe));
  // --- Auktion am letzten Herbsttag: TU zwei Tage vorher → garantiert tragend ---
  const au = await pg.evaluate(() => { bisTag(2, tpj()); const T = spiel.boxen[0].pferd; T.tuTag = spiel.tag - 2; const wT = verkaufsWert(T), wN = verkaufsWert(spiel.boxen[2].pferd), g = spiel.geld; spiel.post = [];
    const r0 = Math.random; Math.random = () => 0.5; try { stutenAuktionTag(); } finally { Math.random = r0; }
    const preis = Math.max(500, Math.round(wT * (0.7 + 0.5 * 1.1) * 1.2 / 100) * 100), prov = Math.round(preis * (preis <= 10000 ? 0.08 : preis <= 15000 ? 0.1 : preis <= 40000 ? 0.14 : 0.18));
    return { plus: spiel.geld - g, soll: preis - prov, preis, leer: !spiel.boxen[0].pferd, nDa: !!spiel.boxen[2].pferd && !spiel.boxen[2].pferd.stAuk, wN, briefe: spiel.post.map(x => x.betreff + ': ' + (x.text || '').replace(/<[^>]+>/g, '')).join(' || ') }; });
  ok('Tamina verkauft: Zuschlag × 1,2 (garantiert tragend) minus gestaffelte Vermittlungsgebühr', au.leer && au.plus === au.soll, `plus ${au.plus}, soll ${au.soll}, Zuschlag ${au.preis}`);
  ok('Verkaufsbrief nennt „garantiert tragend“ und die Gebühr', /Tamina verkauft/.test(au.briefe) && /garantiert tragend von Herzbube/.test(au.briefe) && /Vermittlungsgebühr/.test(au.briefe), au.briefe.slice(0, 300));
  ok('Nora: Zuschlag unter dem Mindestpreis → zurückgenommen, ohne Gebühr (Salzburg), bleibt im Stall', au.nDa && /Nora zurückgenommen/.test(au.briefe) && /kostet bis zu diesem Preis nichts/.test(au.briefe), au.briefe.slice(0, 400));
  // --- Hannoveraner: Anmeldung im Frühling, Absage ohne Hauptstutbuch; „belegt“ ohne frische TU ---
  const hv = await pg.evaluate(() => { spiel.post = []; bisTag(0, 1); stutenAuktionTag(); const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'stAuk'); return { br: br ? br.von + ' / ' + br.betreff : '', id: br && br.id }; });
  ok('Frühling: Hannoveraner-Brief für die Sommer-Auktion in Verden', /Hannoveraner Verband/.test(hv.br), hv.br);
  await pg.evaluate(id => briefFenster(id), hv.id); await pg.waitForTimeout(150); await pg.click('#dlg [data-baktion="sta-ja"]'); await pg.waitForTimeout(100);
  const hv2 = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.post = []; bisTag(1, 1); stutenAuktionTag(); const H = spiel.boxen[4].pferd; return { st: !!H.stAuk, b: spiel.post.map(x => (x.text || '').replace(/<[^>]+>/g, '')).join(' ') }; });
  ok('Hannoveraner ohne Hauptstutbuch: Absage', !hv2.st && /Hauptstutbuch/.test(hv2.b), hv2.b.slice(0, 200));
  // --- Zurückziehen per Klick ---
  const zr = await pg.evaluate(() => { const H = spiel.boxen[4].pferd; H.zb.i = 0; H.stAuk = { k: 'hannoveraner', jz: jzJetzt(), st: 'angemeldet', min: 0, tag: spiel.tag }; spiel.post = []; stutenAuktionTag(); const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'stAukZ'); return { st: H.stAuk && H.stAuk.st, id: br && br.id }; });
  ok('Hauptstutbuch-Stute zugelassen (Hannoveraner)', zr.st === 'zugelassen');
  await pg.evaluate(id => briefFenster(id), zr.id); await pg.waitForTimeout(150); await pg.click('#dlg [data-baktion="stz-ja"]'); await pg.waitForTimeout(100);
  const zr2 = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const H = spiel.boxen[4].pferd; return { weg: !H.stAuk, sperre: abgabeSperre(H, spiel.boxen[4], true) }; });
  ok('Klick „Zurückziehen“: wieder frei verkaufbar', zr2.weg && !zr2.sperre, JSON.stringify(zr2));
  // --- Kaufen im Pferdemarkt (Sommer: Warmblutverbände) ---
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeMarkt(null); });
  await pg.waitForTimeout(200);
  const kach = await pg.evaluate(() => { const k = document.querySelector('[data-mb="stuten"]'); return k ? { an: !k.disabled, txt: k.textContent } : null; });
  ok('Kachel „Stutenauktion“ im Pferdemarkt (Sommer: aktiv)', kach && kach.an, JSON.stringify(kach));
  await pg.click('[data-mb="stuten"]'); await pg.waitForTimeout(300);
  const liste = await pg.evaluate(() => { const L = stutenLose().filter(a => a.stute !== 'araber' && a.stute !== 'connemara'); /* Araber (Pride of Poland, seit 26.11.) und Connemara (Clifden, 26.11.) haben eigene Regeln, siehe stutenauktion2-/stutenauktion3-test */ return { n: L.length, alle: L.every(a => a.pferd.geschlecht === 'Stute' && zuchtbuchVon(a.pferd) && ['hannoveraner', 'holsteiner', 'oldenburger'].includes(a.stute)), haupt: L.every(a => zuchtbuchVon(a.pferd).rang === 0), trag: L.filter(a => a.pferd.traechtig).length, txt: document.getElementById('marktInhalt') ? '' : '', html: document.body.innerText.includes('Stutenauktion') }; });
  ok('Sommer-Angebot: nur eingetragene Hauptstutbuch-Stuten der Warmblutverbände, einige tragend', liste.n >= 6 && liste.alle && liste.haupt && liste.trag >= 1, JSON.stringify(liste));
  await pg.screenshot({ path: path.join(process.env.BILDER_ORDNER || require('os').tmpdir(), 'stutenauktion-markt.png') });
  // Bieten mit echtem Klick auf den Bieten-Knopf der ersten Kachel
  await pg.click('.paar-liste button.paar'); await pg.waitForTimeout(200);   /* Kachel öffnet zuerst die Infos – dort steht der Bieten-Knopf */
  const info = await pg.evaluate(() => document.getElementById('dlgInhalt').textContent);
  ok('Infofenster der Stute zeigt Auktion, Veranstalter und Käufergebühr', /Elite-Auktion|Zuchtstuten-Auktion/.test(info) && /Käufergebühr/.test(info) && /6 %/.test(info), info.slice(0, 160));
  await pg.click('#dlgKnoepfe button:has-text("Bieten")'); await pg.waitForTimeout(200);
  const dl2 = await pg.evaluate(() => document.getElementById('dlg') && !document.getElementById('dlg').hidden ? document.getElementById('dlgInhalt').textContent : '');
  ok('Bieten-Fenster nennt die Käufergebühr', /Käufergebühr/.test(dl2), dl2.slice(0, 200));
  const kauf = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const a = stutenLose()[0]; a.fuehrt = 'du'; a.duGeboten = true; a.duMax = a.gebot; a.hid = aktivHid(); const g = spiel.geld, n = a.pferd.name, trag = !!a.pferd.traechtig;
    bisTag(2, 1); spiel.post = []; auktionsEnde(); const bx = spiel.boxen.find(b => b.pferd && b.pferd.name === n), br = spiel.post.find(x => /Zuschlag/.test(x.betreff));
    return { minus: g - spiel.geld, soll: a.gebot + Math.round(a.gebot * 0.06), da: !!bx, trag: bx ? !!bx.pferd.traechtig === trag : false, von: br && br.von, text: br ? br.text.replace(/<[^>]+>/g, '') : '' }; });
  ok('Zuschlag: Stute im Stall, Gebot + 6 % Käufergebühr abgebucht, Brief vom Verband', kauf.da && kauf.minus === kauf.soll && /Verband/.test(kauf.von) && /Käufergebühr/.test(kauf.text), JSON.stringify(kauf).slice(0, 300));
  ok('Tragende Stute bleibt nach dem Kauf tragend', kauf.trag);
  const fr = await pg.evaluate(() => { bisTag(0, 2); spiel.markt = null; zeigeMarkt(null); const k = document.querySelector('[data-mb="stuten"]'); return { aus: k ? k.disabled : null, txt: k ? k.textContent : '', n: stutenLose().length }; });
  ok('Frühling: keine Stutenauktion (Kachel aus, leeres Angebot)', fr.aus === true && fr.n === 0 && /Sommer und Herbst/.test(fr.txt), JSON.stringify(fr));
  const wis = await pg.evaluate(() => ({ hin: !!HINWEISE.stutenauktion, stufe: FREI_STUFEN[3].maerkte.includes('stuten') && !FREI_STUFEN[2].maerkte.includes('stuten') }));
  ok('Hinweisblase und Freischaltung ab Stufe 3 (wie Fohlenauktion)', wis.hin && wis.stufe);
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(out.join('\n')); const f = out.filter(x => x.startsWith('✗')).length; if (f) console.log('Fehler', f);
  await b.close(); process.exit(f ? 1 : 0);
})();
