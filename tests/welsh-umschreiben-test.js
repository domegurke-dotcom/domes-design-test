// Welsh umschreiben (26.11.2026, seit der Änderung per Brief vom Zuchtverband mit „Umschreiben“ / „So lassen“): A -> B (über 122 cm), C -> D (über 137 cm), D -> C (unter 137 cm, frühestens mit 7 Jahren); nur auf Antrag, unwiderruflich
// Quelle: Zuchtprogramm Welsh Ponys und Cobs, Rheinisches Pferdestammbuch (Stand 02/2025), Abschnitt 5
// Start: $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/welsh-umschreiben-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 300000; });
  const zeige = async (rasse, sm, alter, extra) => {
    await pg.evaluate(([rasse, sm, alter, extra]) => {
      document.getElementById('dlg').hidden = true;
      const p = neuesPferd({ rasse, geschlecht: 'Stute', alter, name: 'Wels' + rasse }); p.anteile = extra === 'misch' ? { [rasse]: 60, hannoveraner: 40 } : { [rasse]: 100 }; p.pflege = p.pflege || erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p);
      p.zielStockmass = sm; p.stockmass = sm; p.papiere = true; p.zb = { i: 0, gesamt: 7, tag: spiel.tag, noten: { typ: 7, koerper: 7, korrekt: 7, schritt: 7, trab: 7, eindruck: 7, gesamt: 7 } };
      while (spiel.boxen.length < 1) spiel.boxen.push({ pferd: null }); spiel.boxen[0].pferd = p; spiel.boxen[0].tot = false; window.__w = p;
      spiel.aktBox = 0; aktBox = 0; aktenModus = 'steckbrief'; aktenReiter = 'steckbrief'; zeigeSchirm(null); zeigeTag(); zeigeAkte();
    }, [rasse, sm, alter, extra]);
    await pg.waitForTimeout(300);
    return pg.evaluate(() => { const U = welshUmschreibung(window.__w); return U ? 'In Sektion ' + welshSekt(U.nach) + ' umschreiben' : null; });
  };
  let t;
  t = await zeige('welsha', 124, 8); ok('Sektion A, 124 cm, 8 Jahre: Umschreiben nach B', t === 'In Sektion B umschreiben', String(t));
  t = await zeige('welsha', 120, 8); ok('Sektion A, 120 cm: nichts', t === null);
  t = await zeige('welsha', 124, 4); ok('Sektion A, 124 cm, erst 4 Jahre: nichts', t === null);
  t = await zeige('welshpony', 130, 8); ok('Sektion B: nichts', t === null);
  t = await zeige('welshc', 136, 8); ok('Sektion C, 136 cm: nichts', t === null);
  t = await zeige('welshcob', 135, 5); ok('Sektion D, 135 cm, 5 Jahre: nichts (erst ab 7)', t === null);
  t = await zeige('welshcob', 135, 8); ok('Sektion D, 135 cm, 8 Jahre: Umschreiben nach C', t === 'In Sektion C umschreiben', String(t));
  t = await zeige('welshcob', 140, 8); ok('Sektion D, 140 cm: nichts', t === null);
  t = await zeige('welshc', 140, 8, 'misch'); ok('Mischling: nichts', t === null);

  t = await zeige('welshc', 140, 8); ok('Sektion C, 140 cm, 8 Jahre: Umschreiben nach D möglich', t === 'In Sektion D umschreiben', String(t));
  const info = await pg.evaluate(() => /Zuchtverband schreibt/.test(document.getElementById('akte') ? document.getElementById('akte').innerText : document.body.innerText)); ok('Steckbrief zeigt nur die Hinweiszeile (kein Knopf mehr)', info && !(await pg.$('#welshUmKnopf')));
  // Brief vom Zuchtverband, einmal
  const brief = async () => pg.evaluate(() => { welshUmBriefTag(); const bs = (spiel.post || []).filter(x => x.aktion && x.aktion.typ === 'welshUm'); return bs.length; });
  let n = await brief(); ok('Zuchtverband schreibt einen Brief', n === 1, String(n)); n = await brief(); ok('nur einmal je Pferd', n === 1, String(n));
  const oeffne = async () => { await pg.evaluate(() => { const old = document.getElementById('wuTest'); if (old) old.remove(); const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'welshUm' && x.aktion.pid === window.__w.id); document.body.insertAdjacentHTML('beforeend', '<div id="wuTest" style="position:fixed;z-index:99999;top:0;left:0;background:#fff">' + briefAktionHTML(br) + '</div>'); briefAktionenBinden(() => {}); }); };
  await oeffne(); const txt = await pg.evaluate(() => document.getElementById('wuTest').innerText); ok('Brief bietet „Welsh Cob umschreiben“ und „So lassen“', /Welsh Cob.*umschreiben/.test(txt) && /So lassen/.test(txt), txt.split(String.fromCharCode(10)).join(' '));
  await pg.click('[data-baktion="wu-nein"]'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button'); await pg.waitForTimeout(200);
  let st = await pg.evaluate(() => [window.__w.rasse, JSON.stringify(window.__w.anteile)]); ok('„So lassen“: Rasse bleibt Sektion C', st[0] === 'welshc' && st[1] === '{"welshc":100}', st.join(' '));
  await pg.evaluate(() => { const br = spiel.post.find(x => x.aktion && x.aktion.typ === 'welshUm'); br.aktion.antwort = undefined; }); await oeffne();
  const vorProt = await pg.evaluate(() => JSON.stringify(spiel.protokoll || {}).includes('Welsh umgeschrieben'));
  await pg.click('[data-baktion="wu-ja"]'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button'); await pg.waitForTimeout(300);
  st = await pg.evaluate(() => { const p = window.__w, z = zuchtbuchVon(p); return [p.rasse, JSON.stringify(p.anteile), z ? z.n : null, p.papiere, JSON.stringify(p.umschreibung ? p.umschreibung.map(x => [x.von, x.nach]) : null), JSON.stringify(spiel.protokoll || {}).includes('Welsh umgeschrieben')]; });
  ok('Nach „Umschreiben“: Sektion D, 100 % Welsh Cob', st[0] === 'welshcob' && st[1] === '{"welshcob":100}', st.slice(0, 2).join(' '));
  ok('Zuchtbuch (Stutbuch I) und Papiere bleiben gültig', st[2] === 'Stutbuch I' && st[3] === true, st[2] + ' ' + st[3]);
  ok('Umschreibung ist am Pferd vermerkt und im Protokoll gezählt', st[4] === '[["welshc","welshcob"]]' && st[5] === true && !vorProt, st[4]);
  t = await pg.evaluate(() => welshUmschreibung(window.__w)); ok('Unwiderruflich: D bei 140 cm braucht keine Umschreibung mehr', t === null);
  // D -> C und A -> B über den Brief
  for (const [r, sm, erw] of [['welshcob', 135, 'welshc'], ['welsha', 125, 'welshpony']]) {
    await zeige(r, sm, 8); await brief(); await oeffne(); await pg.click('[data-baktion="wu-ja"]'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button'); await pg.waitForTimeout(250);
    st = await pg.evaluate(() => [window.__w.rasse, JSON.stringify(window.__w.anteile)]); ok(r + ' (' + sm + ' cm) -> ' + erw, st[0] === erw && st[1] === JSON.stringify({ [erw]: 100 }), st.join(' ')); }
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join(String.fromCharCode(10))); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
