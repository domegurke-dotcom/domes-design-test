// v892 Gehalt nach Qualifikation: Grundgehalt + Zuschläge, Bewerber, Gehaltswunsch-Brief mit echten Klicks (Zustimmen / Ablehnen / keine Antwort)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/gehalt-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const klick = async (sel) => { await pg.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('fehlt: ' + s); e.click(); }, sel).catch(() => out.push('✗ Klick fehlt: ' + sel)); await pg.waitForTimeout(250); };
  const R = await pg.evaluate(() => { window.zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 400000; VET.verbotAb = 99;
    window.nachtBisJz = () => { const j0 = jzJetzt(); let i = 0; while (jzJetzt() === j0 && i++ < 30) { naechsteNacht(); zu(); } };
    const pf0 = gehaltSoll({ typ: 'pfleger', wissen: wissenStart(10, {}) }), pw0 = gehaltSoll({ typ: 'pferdewirt', wissen: wissenStart(10, {}) });
    const pfX = gehaltSoll({ typ: 'pfleger', wissen: wissenStart(10, { haut: 85, huf: 85, verhalten: 65 }), kurse: { haut: 1 } });
    const pwX = gehaltSoll({ typ: 'pferdewirt', wissen: wissenStart(10, { zucht: 85, haut: 65, futter: 65 }), kurse: { zucht: 1, futter: 1 } });
    const bw = bewerberErzeugen('pferdewirt').map(x => x.gehalt === gehaltSoll({ typ: 'pferdewirt', wissen: x.wissen })), sb = bewerberErzeugen('stallbursche').map(x => x.gehalt >= 300);
    const mk = (id, g) => maErgaenzen({ id, typ: 'pferdewirt', name: id, w: true, wissen: wissenStart(10, { zucht: 85, haut: 65, futter: 65 }), eig: [], gehalt: g, ab: 0, bis: null });
    spiel.mitarbeiter = [mk('Anna', 400), mk('Berta', 400), mk('Carla', 400), mk('Dora', 2000)];
    nachtBisJz();
    const br = n => spiel.post.find(x => /bittet um mehr Gehalt/.test(x.betreff) && x.betreff.startsWith(n));
    return { pf0, pw0, pfX, pwX, bw: bw.every(Boolean), sb: sb.every(Boolean), briefe: ['Anna', 'Berta', 'Carla'].map(n => !!br(n)), dora: !!br('Dora'), ids: ['Anna', 'Berta'].map(n => br(n) && br(n).id), soll: gehaltSoll(spiel.mitarbeiter[0]) }; });
  ok('Grundgehalt Pfleger 250, Pferdewirt 400', R.pf0 === 250 && R.pw0 === 400, R.pf0 + '/' + R.pw0);
  ok('Pfleger mit Erfahrung/Lehrgang/Stärke verdient mehr, bleibt unter erfahrenem Pferdewirt', R.pfX > 250 && R.pfX < R.pwX && R.pwX > 400, R.pfX + '/' + R.pwX);
  ok('Pferdewirt-Bewerber verlangen genau das Soll-Gehalt, Stallbursche unverändert', R.bw && R.sb);
  ok('Gehaltswunsch-Briefe für unterbezahlte Pferdewirte, keiner für den gut bezahlten', R.briefe.every(Boolean) && !R.dora, JSON.stringify(R.briefe) + ' Dora ' + R.dora);
  // Zustimmen (Anna) und Ablehnen (Berta) über das Postfach
  for (const [i, knopf] of [[0, 'gehalt-ja'], [1, 'gehalt-nein']]) { await pg.evaluate(() => { zu(); zeigeHof('post'); const z = document.getElementById('briefZurueck'); if (z) z.click(); }); await pg.waitForTimeout(250); await klick(`[data-brief="${R.ids[i]}"]`); await klick(`[data-baktion="${knopf}"]`); }
  const S = await pg.evaluate(() => { const [A, B, C] = spiel.mitarbeiter; const z = { a: A.gehalt, b: B.gehalt, bNein: B.gehaltNein, cFrage: !!C.gehaltFrage, cZ: zufr(C) };
    zu(); nachtBisJz(); const n = spiel.post.filter(x => /bittet um mehr Gehalt/.test(x.betreff)).length; return { ...z, c2: !C.gehaltFrage, cNein: C.gehaltNein != null, cZ2: zufr(C), bWieder: !!B.gehaltFrage, n }; });
  ok('Zustimmen: Gehalt = Soll', S.a === R.soll, S.a + ' / ' + R.soll);
  ok('Ablehnen: Gehalt bleibt, Pause gesetzt', S.b === 400 && S.bNein != null);
  ok('Keine Antwort: in der nächsten Jahreszeit wie Nein (milder), Berta fragt nicht gleich wieder', S.c2 && S.cNein && S.cZ2 < S.cZ && !S.bWieder, JSON.stringify(S));
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(out.join('\n')); await b.close();
})();
