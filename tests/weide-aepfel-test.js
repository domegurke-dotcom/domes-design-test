// v991 (Dome 8.11.): Weiden werden morgens von allen gesäubert, die auch misten (auch Pferdewirte); Weide mit Pferd ohne Altlast gilt auch als zu säubern; Äpfel liegen hinter Pferd und Fohlen; kein Knopf „zurück in die Box“ bei „hat … gebracht“
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0), B = mk('Berta', 1); const mkM = (typ, id, name) => { const x0 = bewerber(typ)[0]; return { id, typ, name, w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; };
    spiel.mitarbeiter = [mkM('stallbursche', 's1', 'Frieda'), mkM('pferdewirtHS', 'hs', 'Amelie'), mkM('pferdewirt', 'pw', 'Paula')];
    spiel.weiden = [{ wid: 'w1', name: 'Weide 1', ha: 2, gras: 70, matsch: 0, kot: 5 }, { wid: 'w2', name: 'Weide 2', ha: 2, gras: 70, matsch: 0, kot: 3 }, { wid: 'w3', name: 'Weide 3', ha: 2, gras: 70, matsch: 0, kot: 0 }];
    A.weide = { wid: 'w3', seit: spiel.tag };
    paddockMistenMorgen(); const W = spiel.weiden, tg = spiel.tag;
    ok('Drei Mitarbeiter (Stallhelferin, Pferdewirtin HS, Pferdewirtin) säubern drei Weiden', W.every(w => w.aepfel === tg), JSON.stringify(W.map(w => [w.wid, w.aepfel, w.kot])));
    ok('Weide 3 (Pferd da, aber keine Altlast) gilt auch als gesäubert', W[2].aepfel === tg);
    ok('Gesäuberte Weide zeigt keine Äpfel mehr', koppelAepfel(A) === 0);
    W[2].aepfel = null; W[2].kot = 0; ok('Ohne Säuberung zeigt die Weide Äpfel (Pferd da)', koppelAepfel(A) > 0);
    const svg = weideBildSVG(A), iA = svg.indexOf('data-kaepfel'), iV = svg.indexOf('koppelVorne'); ok('Bild: Äpfel liegen in der Ebene hinter Pferd und Fohlen', iA > 0 && iV > 0 && iA < iV, iA + ' / ' + iV);
    // Weide-Hinweis in der Versorgung
    A.weideNachm = { tag: spiel.tag, ma: 's1', name: 'Frieda', erledigt: true }; const h = weideNachmHTML(A); ok('„hat … gebracht (bis abends)“ ohne Knopf „zurück in die Box“', /hat Anna heute früh/.test(h) && !/zurück in die Box/.test(h) && !/wnUmschalten/.test(h), h);
    A.weideNachm = { tag: spiel.tag, ma: 's1', name: 'Frieda' }; ok('Vorher: „bringt … (bis abends)“ mit Knopf „heute drinlassen“ bleibt', /heute drinlassen/.test(weideNachmHTML(A)));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
