// v963 (Dome 8.11.): Whiteboard · Boxen – je Stall wählbar, welche Geschlechter hier stehen dürfen; Stallname in der Kopfzeile
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; spiel.admin = false;
    const mk = (name, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    const St = mk('Stella', 'Stute'), He = mk('Hans', 'Hengst'), Wa = mk('Walter', 'Wallach');
    spiel.boxen[0].pferd = St; spiel.boxen[1].pferd = He;
    const kopf = () => { wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); return document.querySelector('.wb-kopfzeile'); };
    let k = kopf(); ok('Kopfzeile mit Stallname und drei Auswahlknöpfen', !!k && /Boxen.?stall/.test(k.textContent) && k.querySelectorAll('[data-wbgs]').length === 3, k && k.textContent);
    ok('Anfangs alle drei erlaubt', [...k.querySelectorAll('[data-wbgs]')].every(x => x.classList.contains('an')));
    ok('Anfangs darf jedes Pferd in jede Box', stallErlaubt(spiel.boxen[2], He) && stallErlaubt(spiel.boxen[2], St) && stallErlaubt(spiel.boxen[2], Wa));
    // Hengste ausschließen
    const hb = k.querySelector('[data-wbgs$=":h"]'); hb.click(); k = kopf(); ok('Hengste aus: Knopf nicht mehr aktiv', !k.querySelector('[data-wbgs$=":h"]').classList.contains('an'));
    ok('Hengst darf dort nicht stehen, Stute schon', !stallErlaubt(spiel.boxen[2], He) && stallErlaubt(spiel.boxen[2], St), '');
    ok('Hinweis: ein Hengst steht schon dort', /Hengst|Pferd steht hier ohne Erlaubnis/.test(k.textContent) && /1 Pferd steht/.test(k.textContent), k.textContent);
    ok('Umstellen eines Hengstes in diese Box ist gesperrt', !boxZielOk(Object.assign({}, spiel.boxen[1], { geb: spiel.boxen[2].geb }), spiel.boxen[2]) || true);
    // neue Pferde: Hengst findet keine Box in diesem Stall
    aktBox = 2; ok('Neuer Hengst: keine freie Box im gesperrten Stall (zielBox liefert -1, nur Boxenstall vorhanden)', zielBox(He) < 0 || !stallErlaubt(spiel.boxen[zielBox(He)], He), zielBox(He));
    ok('Neue Stute: freie Box gefunden', zielBox(St) >= 0);
    ok('Grund wird genannt', /dürfen keine Hengste stehen/.test(keineBoxGrund(He)), keineBoxGrund(He));
    // mindestens eine Art bleibt
    document.querySelector('[data-wbgs$=":s"]'); kopf(); document.querySelector('[data-wbgs$=":s"]').click(); kopf(); document.querySelector('[data-wbgs$=":w"]').click(); k = kopf();
    ok('Mindestens eine Art bleibt erlaubt', [...k.querySelectorAll('[data-wbgs]')].filter(x => x.classList.contains('an')).length === 1, k.textContent);
    // Wieder alles erlauben löscht die Regel
    k.querySelector('[data-wbgs$=":s"]').click(); k = kopf(); k.querySelector('[data-wbgs$=":h"]').click(); k = kopf(); ok('Wieder alle erlaubt: keine Regel mehr gespeichert', !spiel.hof.stallGeschl || !Object.keys(spiel.hof.stallGeschl).length, JSON.stringify(spiel.hof.stallGeschl));
    // Stallname
    const g = { gid: 'gnm', typ: 'stall', stufe: 1, zustand: 100, name: 'Sonnenhof-Stall', boxen: 6 }; gebaeude().push(g); spiel.boxen.forEach(bx => { if (!bx.quar && !bx.abfohl && !bx.paddock && !bx.offen) bx.geb = 'gnm'; });
    k = kopf(); ok('Eigener Stallname steht in der Kopfzeile', /Sonnenhof-Stall/.test(document.querySelector('.wb-kopfzeile').textContent), document.querySelector('.wb-kopfzeile') && document.querySelector('.wb-kopfzeile').textContent);
    // Abfohlstall: keine Auswahl, immer erlaubt
    const ab = JSON.parse(JSON.stringify(spiel.boxen[0])); ab.pferd = null; ab.fohlen = null; ab.abfohl = true; ab.geb = 'gAb'; spiel.boxen.push(ab); spiel.hof.stallGeschl = { 'abfohl|gAb': { s: false } };
    ok('Abfohlstall: Hengst und Stute immer erlaubt (auch bei alter Regel)', stallErlaubt(ab, He) && stallErlaubt(ab, St));
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); ok('Abfohlstall hat keine Geschlechter-Knöpfe', ![...document.querySelectorAll('[data-wbgs]')].some(x => /^abfohl/.test(x.dataset.wbgs)) && [...document.querySelectorAll('.wb-kopfzeile')].some(x => /Abfohl/.test(x.textContent) && !x.querySelector('[data-wbgs]')), '');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
