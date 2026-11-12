// Dome 12.11.2026 „so wie in echt“: Quarter (DQHA) und Appaloosa (ApHCG) – Feldprüfung im Westernreiten ab 4 Jahren, Sportleistungsprüfung aus Turniererfolgen,
// keine Stationsprüfung, DQHA-Titel „Leistungszuchtstute“
// BILDER_ORDNER=<Scratchpad-Ordner> speichert Bilder
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.env.BILDER_ORDNER;
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  const bild = async n => { if (ORD) await pg.screenshot({ path: path.join(ORD, n + '.png') }); };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.kal = null; spiel.tag = 1; spiel.turniere = spiel.turniere || []; zbBestand(); turnierKalender();
    window.mk = (n, g, i, rasse = 'hannoveraner', alter = 6) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; };
    window.Q = mk('Queenie', 'Stute', 0, 'quarter', 6); Q.zb = { i: 1, lg: 2, gesamt: 7, tag: 1, art: 'hof' }; window.A = mk('Apple', 'Stute', 1, 'appaloosa', 3); A.zb = { i: 0, lg: 2, gesamt: 7, tag: 1, art: 'hof' }; });
  let r = await pg.evaluate(() => { const T = spiel.turniere.find(t => (t.pruef[0] || {}).zb === 'feld' && t.tag >= spiel.tag + 2), S = spiel.turniere.find(t => (t.pruef[0] || {}).zb === 'station' && t.tag >= spiel.tag + 2);
    return { feldQ: T && zbSperre(Q, T, T.pruef[0]), feldA: T && zbSperre(A, T, T.pruef[0]), stationQ: S && zbSperre(Q, S, S.pruef[0]) }; });
  ok('Quarter ohne Western-Ausbildung: Feldprüfung gesperrt (Western-Ausbildung x von 15)', /Western-Ausbildung/.test(r.feldQ || ''), JSON.stringify(r));
  ok('Appaloosa 3 Jahre: Feldprüfung erst ab 4 Jahren', /ab 4 Jahren/.test(r.feldA || ''), JSON.stringify(r));
  ok('Keine Stationsprüfung beim Westernverband', /keine Stationsprüfung/.test(r.stationQ || ''), JSON.stringify(r));
  r = await pg.evaluate(() => { zuchtverbandDialog(Q, null); const t = $('dlg').textContent; return { station: /Stutenleistungsprüfung \(Station\)/.test(t), sport: /Sportleistungsprüfung \(Westernreiten\)/.test(t) }; });
  ok('Fenster: keine Stationsprüfungen, Abschnitt Sportleistung', !r.station && r.sport, JSON.stringify(r));
  await bild('western-zuchtverband');
  // Feldprüfung im Westernreiten (mit Ausbildung)
  r = await pg.evaluate(() => { const echt = diszAusb; diszAusb = (p, D) => p === Q && ['reining', 'pleasure', 'trail'].some(k => DISZ[k] === D) ? 40 : echt(p, D); let res;
    try { const T = spiel.turniere.find(t => (t.pruef[0] || {}).zb === 'feld' && t.tag >= spiel.tag + 2); const sp = zbSperre(Q, T, T.pruef[0]); zbSlp(Q, 'feld', 'profi', 'Feldprüfung in X', zufall('w1')); const br = (spiel.post || []).slice().reverse().find(x => /Stutenleistungsprüfung: Queenie/.test(x.betreff || '')); res = { sp, slp: Q.zb.slp, brief: br && br.text }; } finally { diszAusb = echt; }
    return { sp: res.sp, slp: res.slp, west: /Westernreiten/.test(res.brief || ''), aufgabe: /Western-Aufgabe/.test(res.brief || ''), springen: /Freispringen/.test(res.brief || ''), lzs: !!Q.zb.lzs, titel: (zuchtbuchVon(Q) || {}).titel }; });
  ok('Mit Western-Ausbildung frei; Brief „Feldprüfung im Westernreiten“ mit Western-Aufgabe, ohne Freispringen', !r.sp && r.west && r.aufgabe && !r.springen, JSON.stringify(r));
  ok('DQHA: bestanden + Leistungsgruppe II → Leistungszuchtstute', r.slp < 5 || (r.lzs && r.titel === 'Leistungszuchtstute'), JSON.stringify(r));
  // Sportleistung: 3 Platzierungen → Knopf → anerkannt (mit Klick)
  await pg.evaluate(() => { $('dlg').hidden = true; const Q2 = mk('Quinn', 'Stute', 2, 'quarter', 7); Q2.zb = { i: 1, lg: 3, gesamt: 6, tag: 1, art: 'hof' }; Q2.erfolge = [1, 2, 3].map(i => ({ tag: 1, turnier: 'T' + i, art: 'turnier', disz: 'reining', stufe: 0, platz: i, von: 10, plaziert: true })); window.Q2 = Q2; zuchtverbandDialog(Q2, null); });
  ok('Knopf „Anerkennen lassen“ bei 3 Platzierungen', !!(await pg.$('#zbSport')));
  await bild('western-sportleistung');
  const g0 = await pg.evaluate(() => spiel.geld); await pg.click('#zbSport'); await pg.waitForTimeout(250);
  r = await pg.evaluate(() => ({ sport: !!Q2.zb.slpSport, slp: Q2.zb.slp, lzs: !!Q2.zb.lzs, geld: spiel.geld, txt: $('dlg').textContent, brief: /Sportleistungsprüfung/.test(((spiel.post || []).slice().reverse().find(x => /Stutenleistungsprüfung: Quinn/.test(x.betreff || '')) || {}).text || '') }));
  ok('Sportleistung anerkannt (30 €), Brief, Fenster „schon anerkannt“', r.sport && r.slp >= 5 && g0 - r.geld === 30 && r.brief && /schon anerkannt/.test(r.txt), JSON.stringify({ ...r, txt: '' }));
  ok('Leistungsgruppe III: keine Leistungszuchtstute', !r.lzs, r.lzs);
  await bild('western-sport-anerkannt');
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
