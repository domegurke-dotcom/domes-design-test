// 17.11.2026 (Dome): Ohne Angestellten, der die Pferde auf die Weide bringt, startet das Pferd jeden Morgen im Stall – auch wenn der Weideplan im Whiteboard offen ist. Mit Stallbursche geht es wie bisher raus.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/weideplan-ohne-helfer-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2];
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + datei); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate((m) => { window.__motor = m; }, !!process.env.MOTOR);
  const R = await pg.evaluate(() => { const out = []; document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 20000; VET.verbotAb = 99; if (datum().s === 3) spiel.kal = null;
    const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.weidegang = 'taeglich'; spiel.boxen[0].pferd = P; spiel.boxen[0].krippeVoll = true; spiel.futter.lager.heu = 5000; spiel.mitarbeiter = [];
    const hn = () => (document.documentElement.innerHTML.match(/Niemand bringt die Pferde raus/g) || []).length; let n0 = 0;
    const wo = () => P.weide ? 'weide' : P.paddock ? 'paddock' : 'box';
    const plan = () => { const z = wbZiele().find(x => !x.pd); wbSetzen(P, z.id, 'a'); wbSetzen(P, z.id, 'b'); };
    zeigeWhiteboard(); plan(); wbSyncAlle(); out.push(['Plan gesetzt, niemand da: Pferd bleibt in der Box', wo() === 'box', wo()]);
    n0 = hn(); out.push(['Hinweis „Niemand bringt die Pferde raus“ im Weideplan', n0 > 0, n0]);
    naechsteNacht(); zeigeWhiteboard(); wbSyncAlle(); out.push(['nächster Morgen, Whiteboard geöffnet: immer noch im Stall', wo() === 'box', wo()]);
    out.push(['Auch die Morgenrunde ohne Mitarbeiter stellt niemanden raus', (() => { hofMorgen(); return wo() === 'box'; })(), wo()]);
    /* mit Stallbursche: der Plan gilt wie bisher */
    spiel.mitarbeiter = [{ id: 'm1', name: 'Paul', typ: 'stallbursche', ab: jzJetzt() - 1, bis: null, gehalt: 300, zufr: 80, w: false, wissen: {} }];
    naechsteNacht(); wbSyncAlle(); out.push(['mit Stallbursche: Pferd steht draußen (Weide)', wo() === 'weide', wo()]);
    zeigeWhiteboard(); out.push(['mit Mitarbeiter wird der Hinweis nicht noch einmal gezeigt', hn() <= n0, hn() + ' / ' + n0]);
    /* Stallbursche geht (Aufgabe „Weide“ abgewählt): wieder Stall */
    spiel.mitarbeiter[0].aus = { weide: true }; naechsteNacht(); zeigeWhiteboard(); wbSyncAlle(); out.push(['Stallbursche darf nicht „Weide“: morgens im Stall', wo() === 'box', wo()]);
    /* Dome 17.11. abends: von Hand im Whiteboard verschoben – 2D-Spiel: steht sofort draußen (wie selbst rausgebracht), am nächsten Morgen wieder im Stall; 3D-App (Motor): bleibt ein Plan */
    const motor = !!window.__motor; wbWeg(P, null); wbSyncAlle(); const z2 = wbZiele().find(x => !x.pd); wbAnwenden('p:0', 'w:' + z2.id + ':t');
    out.push([motor ? 'Motor: von Hand verschoben ohne Mitarbeiter – bleibt in der Box' : '2D: von Hand verschoben ohne Mitarbeiter – steht sofort draußen', wo() === (motor ? 'box' : 'weide'), wo()]);
    naechsteNacht(); zeigeWhiteboard(); wbSyncAlle(); out.push(['… am nächsten Morgen wieder im Stall', wo() === 'box', wo()]);
    return out; });
  R.forEach(([n, c, x]) => ok(n, c, x)); ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  if (O) { await pg.screenshot({ path: O + '/W1-weideplan.png' }); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
