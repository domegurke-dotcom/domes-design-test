// v670: Stallbursche bringt die Pferde in der Morgenrunde raus – sie stehen den ganzen Tag draußen, abends wieder in der Box
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 20000;
    const mk = (n, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.weidegang = 'taeglich'; return P; };
    const A = mk('Anna', 'Stute'), B2 = mk('Berta', 'Stute'); spiel.boxen[0].pferd = A; spiel.boxen[1].pferd = B2; spiel.boxen.forEach(bx => { bx.krippeVoll = true; });
    spiel.mitarbeiter = [{ id: 'm1', name: 'Paul', typ: 'stallbursche', ab: jzJetzt() - 1, bis: null, gehalt: 300, zufr: 80, w: false, wissen: {} }]; spiel.futter.lager.heu = 5000;
    if (datum().s === 3) spiel.kal = null;
    // Morgenrunde
    hofMorgen();
    ok('Nach der Morgenrunde steht Anna draußen auf der Weide', !!A.weide && !!A.weide.nachm, JSON.stringify(A.weide));
    ok('Berta ebenfalls', !!B2.weide);
    ok('Auslauf-Anzeige sagt „heute früh … gebracht“', /heute früh|gebracht/.test(weideNachmHTML(A)), weideNachmHTML(A).replace(/<[^>]+>/g, ' ').slice(0, 120));
    // Abend: wieder in der Box
    const t0 = spiel.tag; naechsteNacht(); ok('Tageswechsel: gestern wieder rein, am neuen Morgen wieder raus (neue Weide-Einteilung)', spiel.tag === t0 + 1 && !!A.weide && A.weide.seit === spiel.tag, JSON.stringify(A.weide));
    ok('Der Tag zählte als Weidetag (weideZuletzt)', A.weideZuletzt != null);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
