// v688: Weidefarbe nach Gras/Matsch, Rahmen für die Mitarbeiter-Weide, Mäh-Hinweis, frühere Futterwarnung
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; $('dlg').hidden = true; VET.verbotAb = 99;
    const w = weiden()[0]; w.gras = 100; w.matsch = 0; const gut = weideFarbe('#7cbf55', w, 1); w.gras = 5; w.matsch = 80; const schlecht = weideFarbe('#7cbf55', w, 1);
    ok('Gutes Gras = Grundfarbe', gut === '#7cbf55', gut); ok('Wenig Gras und Matsch = deutlich braun', schlecht !== gut && parseInt(schlecht.slice(1, 3), 16) > parseInt(schlecht.slice(3, 5), 16) - 30, schlecht);
    w.gras = 70; w.matsch = 0;
    // Mitarbeiter-Weide
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Zeig' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); spiel.boxen[0].pferd = p;
    ok('Ohne Auswahl kein Rahmen', !weidenMaZiel().has(w.wid)); p.weidegang = 'taeglich'; p.auslaufZiel = w.wid; ok('Mit Weidegang und gewählter Weide: Rahmen', weidenMaZiel().has(w.wid));
    ok('Liste markiert die Weide', /ma-ziel/.test(weidenHTML()) && /für Stallbursche\/Azubi gewählt/.test(weidenHTML()));
    ok('Hofplan ohne blauen Rahmen (Dome 23.10.)', !/stroke="#2a5d8f"/.test(hofplanSVG()));
    // Mähen
    const wi = { wid: 'wx', name: 'Wiese', ha: 1, gras: 80, matsch: 0, wiese: true, schnitte: 1 }; weiden().push(wi);
    const t = k => { const d = datum(); return d; };
    for (let tg = spiel.tag; tg < spiel.tag + 40; tg++) { if (datum(tg - 1).s === 1) { spiel.tag = tg; break; } }
    ok('Sommer, 1 Schnitt: Hinweis auf 2. Schnitt mit Grasgrenze', /2\. Schnitt im Sommer/.test(maehHinweis(wi)), maehHinweis(wi)); wi.gras = 30; ok('Zu wenig Gras: Grund genannt', /zu wenig Gras/.test(maehHinweis(wi)), maehHinweis(wi));
    ok('Weidenliste enthält den Mäh-Hinweis', /🚜/.test(weidenHTML()));
    // Futterwarnung
    const F = futterkammer(); const V = futterVerbrauchTag(); F.lager.heu = Math.max(0, V.raufutter * 3.5); F.warn = {}; const br0 = (spiel.post || []).length; futterVorratPruefen();
    ok('Warnung schon bei 3 Tagen Vorrat (Schwelle 4)', FUTTER_WARN_TAGE === 4 && F.warn.raufutter === 'bald' || V.raufutter === 0, JSON.stringify(F.warn) + ' / ' + V.raufutter);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
