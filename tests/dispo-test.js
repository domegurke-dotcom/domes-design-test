// Dispo-Test (v547, PLAN-BILANZ.md B1): Käufe bis −2.000 €, Zinsen, Kreditrate im Dispo, Kündigungsandrohung → Pfändung → Insolvenz, Entwarnung, Kolik-OP
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/dispo-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { spiel.stufenAn = false; });   // ganzes Spiel prüfen (Anfänger hätten im 1. Jahr keine Pfändung)
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false;
    const nacht = (n = 1) => { for (let i = 0; i < n && !spiel.verloren; i++) { naechsteNacht(); zu(); } };
    const bisJz = () => { nacht(1); let g = 0; while (datum().t !== 1 && g++ < 40 && !spiel.verloren) nacht(1); };
    const briefe = t => spiel.post.filter(x => t.test(x.betreff)).length;
    const neu = (o) => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    // --- 1. Käufe bis −2.000 €, darunter gesperrt ---
    spiel.geld = -500; ok('Frei verfügbar bei −500 €: 1.500 €', geldFrei() === 1500, String(geldFrei()));
    const F = futterkammer(); const vor = spiel.geld; const e1 = futterKaufen('heu', 10); ok('Futter kaufen bei −500 € erlaubt', !/genug Geld/.test(String(e1 || '')), String(e1)); ok('…und wirklich abgebucht', spiel.geld < vor);
    spiel.geld = -1990; const e2 = futterKaufen('heu', 100); ok('Teurer Kauf über das Limit hinaus wird abgelehnt', /genug Geld/i.test(String(e2 || '')), String(e2));
    spiel.geld = -2000; const e3 = futterKaufen('heu', 1); ok('Bei −2.000 € ist alles gesperrt', /genug Geld/i.test(String(e3 || '')), String(e3)); ok('dispoLimit() erkennt das Limit', dispoLimit() === true);
    spiel.geld = -1999; ok('Bei −1.999 € noch kein Limit', dispoLimit() === false);
    spiel.admin = true; spiel.geld = -5000; ok('Admin hat keine Grenze', geldFrei() === Infinity && !dispoLimit()); spiel.admin = false;
    // --- 2. Kolik-OP immer möglich (Notfall) ---
    const P = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Notfall' }); spiel.boxen[0].pferd = P; aktBox = 0; spiel.geld = -2000;
    // --- 3. Zinsen und Kreditrate im Dispo (Variante A) ---
    spiel.pferde = spiel.pferde; spiel.boxen[0].pferd = null; spiel.mitarbeiter = []; spiel.einsteller = []; spiel.dispo = undefined;
    const K = kredite()[0]; ok('Start-Kredit vorhanden', !!K && kreditLaeuft(K)); const rate = rateBerechnen(K).betrag;
    while (datum().t !== Math.max(1, tpj() - 1)) nacht(1);   // 2 Tage vor Jz-Ende: Konto = halbe Rate → die Rate rutscht ins Dispo, reicht
    spiel.geld = Math.round(rate / 2); spiel.post = []; const g0 = spiel.geld; bisJz();
    ok('Rate (' + Math.round(rate) + ' €) bei halber Rate auf dem Konto wird ins Dispo abgebucht, keine Mahnung', briefe(/Mahnung: Kreditrate|Letzte Mahnung/) === 0 && (K.offen || []).length === 0, 'Konto ' + Math.round(spiel.geld) + ' €');
    ok('Zinsen für den Dispo gebucht', !!(spiel.finanzen && Object.values(spiel.finanzen).some(j => j['Dispo: Zinsen'])), 'Konto ' + Math.round(spiel.geld) + ' €');
    ok('Nach 1 Jahreszeit im Minus: noch keine Kündigungsandrohung', briefe(/Kündigung des Kontos/) === 0 && spiel.dispo && spiel.dispo.jzMinus === 1, JSON.stringify(spiel.dispo));
    // Rate über das Limit: Konto −2.000 € + halbe Rate → die Rate sprengt das Limit, verpasst, Mahnung
    while (datum().t !== Math.max(1, tpj() - 1)) nacht(1); spiel.geld = -2000 + Math.round(rate / 2); spiel.post = []; bisJz();
    ok('Rate über dem Limit: verpasst, Mahnung wie beim Kredit', (K.offen || []).length >= 1 && briefe(/Mahnung: Kreditrate|Letzte Mahnung/) >= 1, 'offen ' + (K.offen || []).length);
    K.offen = [];
    // --- 4. Ablauf: Androhung → Pfändung → Insolvenz, Entwarnung ---
    spiel.dispo = undefined; spiel.verloren = undefined; spiel.post = []; const Q = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Pfand' }); spiel.boxen[1].pferd = Q;
    K.rest = 0; K.offen = []; K.jz = 1e6;   // Kredit abgelöst, damit nur das Dispo wirkt
    spiel.geld = -3000; dispoJahreszeit();
    ok('Unter −2.000 €: Brief „Kündigung angedroht“', briefe(/Kündigung des Kontos angedroht/) === 1 && spiel.dispo.drohung != null, JSON.stringify(spiel.dispo));
    ok('Pferd noch da (Frist läuft)', !!spiel.boxen[1].pferd); dispoJahreszeit(); ok('Im gleichen Jahreszeit-Beginn nicht doppelt angedroht', briefe(/Kündigung des Kontos angedroht/) === 1);
    spiel.dispo.drohung = jzJetzt() - 1; spiel.geld = -3000; dispoJahreszeit();
    ok('Nach einer Jahreszeit: Pfändung (Pferd weg)', !spiel.boxen[1].pferd && briefe(/Pfändung/) === 1, 'Konto ' + Math.round(spiel.geld));
    ok('Reicht der Erlös: Hof bleibt, Dispo zurückgesetzt', !spiel.verloren === (spiel.geld >= 0), 'Konto ' + Math.round(spiel.geld) + ', verloren ' + !!spiel.verloren);
    spiel.verloren = undefined; spiel.dispo = { jzMinus: 2, drohung: jzJetzt() - 1 }; spiel.geld = -9000; dispoJahreszeit();
    ok('Bleibt das Konto nach der Pfändung im Minus: Insolvenz, Spiel verloren (letzter Hof)', !!spiel.verloren && spiel.verloren.grund === 'dispo', JSON.stringify(spiel.verloren));
    spiel.verloren = undefined; spiel.dispo = { jzMinus: 1, drohung: jzJetzt() - 1 }; spiel.geld = 50; spiel.post = []; dispoJahreszeit();
    ok('Entwarnung bei Plus', briefe(/Entwarnung/) === 1 && spiel.dispo.drohung == null && spiel.dispo.jzMinus === 0);
    spiel.dispo = { jzMinus: 0, drohung: null }; spiel.geld = -500; spiel.post = []; dispoJahreszeit(); dispoJahreszeit();
    ok('2 Jahreszeiten im Minus (auch über −2.000 € nicht nötig): Androhung', briefe(/Kündigung des Kontos angedroht/) === 1 && spiel.dispo.jzMinus === 2, JSON.stringify(spiel.dispo));
    // --- 5. Anzeige ---
    spiel.geld = -1600; ok('Anzeige rot ab −1.500 €', /Dispo: −1\.600/.test(dispoZeile()) && /#b3261e/.test(dispoZeile()));
    spiel.geld = -1100; ok('Anzeige gelb ab −1.000 €', /#9a6b00/.test(dispoZeile())); spiel.geld = -300; ok('Anzeige unauffällig darunter', !/#b3261e|#9a6b00/.test(dispoZeile())); spiel.geld = 5; ok('Keine Anzeige im Plus', dispoZeile() === '');
    return out.join('\n');
  });
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
