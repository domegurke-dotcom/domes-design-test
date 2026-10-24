// v682 (Dome 23.10.): Anbau als „+x“ in der Zeile des Hauptgebäudes, Umbau mit wählbarer Boxenzahl, Hofplan ohne eigene Zeichnung für Anbauten
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/anbau-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 80000; spiel.hof.bauHa = 3; spiel.hofFenster = [];
    const st = gebaeude().find(g => g.typ === 'stall' && !g.anbau); ok('Start: ein Boxenstall', !!st, st && JSON.stringify({ b: st.boxen, s: st.stufe }));
    const n0 = st.boxen, boxen0 = spiel.boxen.length;
    ok('Anbau +2 beauftragt', bauStarten('stall', st.stufe, { anbau: st.gid, boxen: 2 }));
    const a = gebaeude().find(g => g.anbau === st.gid); a.bau.rest = 1; bauNacht();
    ok('Anbau fertig: 2 neue Boxen', spiel.boxen.length === boxen0 + 2 && !a.bau);
    let h = bauenHTML();
    ok('Anbau (gleiche Stufe) zählt zum Stall: verschmolzen, 8 Boxen, kein eigener Eintrag (v707)', st.boxen === n0 + 2 && !gebaeude().includes(a) && !/geb-kind/.test(h) && !h.includes('Boxen­stall (Anbau'), st.boxen + '');
    const hp = planSVG(); ok('Hofplan: eine Zeichnung, Zahl = alle Boxen', hp.includes(`>${n0 + 2}<`) || hp.includes(`${n0 + 2}`));
    // Umbau mit wählbarer Boxenzahl
    ok('Umbau-Preis für 2 Boxen kleiner als für alle', umbauPreisN(st, 2) < umbauPreis(st), umbauPreisN(st, 2) + ' < ' + umbauPreis(st));
    umbauDialog(st, 2); ok('Fenster mit Auswahl „Wie viele Boxen?“', !!document.getElementById('umbauMenge') && /2 der/.test(document.getElementById('dlgInhalt').textContent));
    const geld0 = spiel.geld; document.querySelector('#dlgKnoepfe button').click();
    const t = gebaeude().find(g => g.teil); ok('Teil abgespalten: 2 Boxen im Umbau, Rest bleibt', t && t.boxen === 2 && st.boxen === n0 && t.bau && t.bau.art === 'umbau', t && JSON.stringify({ t: t.boxen, st: st.boxen }));
    ok('Genau 2 Boxen gesperrt', spiel.boxen.filter(x => x.gesperrt).length === 2);
    ok('Bezahlt wurde der Preis für 2 Boxen', Math.round(geld0 - spiel.geld) === umbauPreisN({ ...st, boxen: st.boxen + 2 }, 2) - (st.stufe + 1 === 3 ? bauZuschuss(umbauPreisN(st, 2)) : 0), String(geld0 - spiel.geld));
    t.bau.rest = 1; bauNacht(); ok('Fertig: 2 Boxen eine Stufe höher', spiel.boxen.filter(x => x.geb === t.gid).every(x => x.stufe === st.stufe + 1) && t.stufe === st.stufe + 1);
    h = bauenHTML(); ok('Umgebauter Teil steht beim Stall („umgebaut“)', /umgebaut/.test(h));
    // Geld reicht nicht → Teilung wird zurückgenommen
    spiel.geld = -5000; const vorher = gebaeude().length, sb = st.boxen; umbauDialog(st, 2); document.querySelector('#dlgKnoepfe button').click();
    ok('Ohne Geld: nichts geteilt', gebaeude().length === vorher && st.boxen === sb, gebaeude().length + ' / ' + st.boxen);
    spiel.geld = 80000; document.getElementById('dlg').hidden = true;
    bauFenster = false; hofBereich = 'bauen'; zeigeHof('hof');
    return out; });
  if (ORD) { await pg.evaluate(() => { const x = document.querySelector('.geb-kind'); if (x) x.scrollIntoView({ block: 'center' }); }); await pg.waitForTimeout(200); await pg.screenshot({ path: ORD + `/anbau-${W}x${H}.png` }); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
