// v968 (Dome 8.11.): Pferdephysiotherapeutin im Whiteboard – Karte mit Aqua-Plätzen (nicht zuteilbar), Block „Aqua heute“ mit Reihenfolge und „heute sicher“; Aqua-Wunsch „nur bei Reha“ ohne Übungsauswahl
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; VET.verbotAb = 99;
    const mk = (name, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; return P; };
    ['Anna', 'Berta', 'Cora'].forEach((n, i) => { spiel.boxen[i].pferd = mk(n, 'Stute'); spiel.boxen[i].pferd.aquaWunsch = { modus: '2' }; });
    const x0 = bewerber('physio')[0], m = { id: 'ph1', typ: 'physio', name: 'Petra', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 2, zustand: 100 });
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard();
    const karte = document.querySelector('.wb-ma-info');
    ok('Karte der Therapeutin da, mit „von 2 Aqua-Plätzen heute belegt“', !!karte && /Petra/.test(karte.textContent) && /von 2 Aqua-Plätzen heute belegt/.test(karte.textContent), karte && karte.textContent);
    ok('Karte ist nicht zuteilbar (kein Ziehen/Antippen)', !!karte && !karte.hasAttribute('data-wbq') && !document.querySelector('[data-wbq="m:ph1"]'));
    ok('Zuteilen an eine Box wird abgelehnt', wbOk('m:ph1', 'b:0') === true ? !(spiel.boxen[0].maPlan || {}).aqua : true);
    ok('Blauer Knopf „Aqua-Plan“ im Whiteboard, kein Listenblock mehr', !!document.getElementById('wbAquaPlan') && !document.querySelector('.wb-aqua li')); document.getElementById('wbAquaPlan').click(); const bl = document.querySelector('.aq-panel'); ok('Fenster „Aqua-Plan“ mit 3 Pferden, je Zeile Bild im Holzrahmen', !!bl && bl.querySelectorAll('.aq-zeile').length === 3 && bl.querySelectorAll('.aq-rahmen .paar-bild svg, .aq-rahmen .paar-bild img').length === 3, bl && bl.textContent);
    ok('Zeile zeigt Alter, Geschlecht, eigenes/Pension, Übung', /8 Jahre · Stute · ⭐ eigenes Pferd/.test(bl.textContent) && /Schwimmen|schwimmen/.test(bl.textContent), bl.textContent.slice(0, 200));
    ok('Zwei Plätze: zwei dran, eines wartet', bl.querySelectorAll('.aq-st.ok').length === 2 && bl.querySelectorAll('.aq-st.wt').length === 1, bl.innerHTML.length);
    document.querySelector('.info-zu').click(); ok('Zurück führt ins Whiteboard', !!document.getElementById('wbAquaPlan')); ok('Karte zeigt 2 von 2 belegt', /2 von 2 Aqua-Plätzen/.test(document.querySelector('.wb-ma-info').textContent), document.querySelector('.wb-ma-info').textContent);
    // „heute sicher“ schiebt Cora nach oben
    document.getElementById('wbAquaPlan').click(); const namen = () => [...document.querySelectorAll('.aq-text > b')].map(x => x.textContent);
    const vorher = namen().join(); document.querySelector('[data-aqs="2"]').click();
    ok('„heute sicher“: Cora steht zuerst und ist dran', namen()[0] === 'Cora' && /dran/.test(document.querySelector('.aq-zeile').textContent) && vorher !== namen().join(), namen().join());
    ok('Nochmal tippen nimmt es zurück', (document.querySelector('[data-aqs="2"]').click(), namen()[0] !== 'Cora'));
    // Reha geht vor normalen Terminen
    const R2 = spiel.boxen[1].pferd; R2.aquaWunsch = { modus: 'reha' }; const bf = befundNeu(R2, 'sehne', 2, 'Test', 'du'); bf.diagnose = spiel.tag; bf.bemerkt = bf.bemerkt || { tag: spiel.tag, von: 'du' };
    document.querySelector('.info-zu').click(); const AP = aquaPlan(true); ok('Reha-Pferd (Berta) steht vor den normalen Terminen', AP.K[0].p === R2 || AP.K.findIndex(x => x.p === R2) <= 1, AP.K.map(x => x.p.name).join());
    // aquaMorgen arbeitet nach demselben Plan
    spiel.boxen.forEach(bx => { if (bx.pferd) { bx.pferd.aquaSicher = 0; bx.pferd.aquaLog = []; } }); spiel.boxen[2].pferd.aquaSicher = spiel.tag; aquaMorgen();
    ok('Morgens: das „sichere“ Pferd (Cora) war im Wasser', aquaLetzt(spiel.boxen[2].pferd) === spiel.tag, JSON.stringify(spiel.boxen[2].pferd.aquaLog));
    // Wunschzeile: bei „nur bei Reha“ keine Übungsauswahl, Hinweis „Therapeutin entscheidet“
    const sel = md => { spiel.boxen[0].pferd.aquaWunsch = { modus: md }; wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); return { prog: !!document.querySelector('[data-wbaqua="0:prog"]'), hinweis: !!document.querySelector('.wb-pn-z small[title*="Therapeutin"]') }; };
    const sr = sel('reha'), s2 = sel('2'); ok('Nur bei Reha: keine Übungsauswahl, Hinweis „Therapeutin entscheidet“', !sr.prog && sr.hinweis, JSON.stringify(sr)); ok('Alle 2 Tage: Übungsauswahl da', s2.prog, JSON.stringify(s2));
    // Ohne Aqua-Center: keine Karte-Aqua, kein Block
    gebaeude().pop(); wbSicht = 'boxen'; zeigeWhiteboard(); ok('Ohne Aqua-Center kein Aqua-Plan-Knopf', !document.getElementById('wbAquaPlan'));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
