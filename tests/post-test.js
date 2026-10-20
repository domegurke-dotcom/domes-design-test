// Post-Test (v599, PLAN-TIERHALTEVERBOT-SPEICHER.md P1): Grenze 300, Schutz für ⭐/ungelesen/Jahresbericht/offene Aktion, Hinweisbrief, Blase ab 250
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/post-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const mk = (i, o) => ({ id: 'b' + i + Math.random().toString(36).slice(2, 5), jz: 1, tag: 1, von: 'Test', betreff: 'Brief ' + i, text: 'x', typ: 'sonstiges', gelesen: true, links: [], hid: aktivHid(), hofName: 'Testhof', ...o });
    spiel.rechnungen = [{ id: 'r-test', betrag: 10, von: 'Tierarztpraxis', tag: 1 }];
    const alt = [
      ...Array.from({ length: 5 }, (_, i) => mk('stern' + i, { stern: true })), ...Array.from({ length: 5 }, (_, i) => mk('neu' + i, { gelesen: false })),
      mk('jb1', { typ: 'jahresbericht', betreff: 'Jahresbericht 1' }), mk('jb2', { typ: 'jahresbericht', betreff: 'Jahresbericht 2' }), mk('rechnung', { betreff: 'Rechnung', aktion: { typ: 'rechnung', rid: 'r-test' } }),
      mk('erledigt', { betreff: 'Alte Rechnung', aktion: { typ: 'rechnung', rid: 'r-weg' } })];   // älteste Briefe zuletzt
    spiel.post = [...Array.from({ length: 300 }, (_, i) => mk(i)), ...alt];   // 314 Briefe
    ok('Ausgangslage: 314 Briefe', spiel.post.length === 314);
    brief('Test', 'Neuer Brief', 'Hallo');
    const P = spiel.post, hat = id => P.some(x => x.betreff === id);
    ok('Nach dem Kürzen höchstens Grenze (300)', P.length <= POST.grenze, P.length);
    ok('⭐-Briefe bleiben (5)', P.filter(x => x.stern).length === 5);
    ok('Ungelesene bleiben (5 + neuer Brief + Hinweisbrief)', P.filter(x => !x.gelesen).length >= 6);
    ok('Jahresberichte bleiben', hat('Jahresbericht 1') && hat('Jahresbericht 2'));
    ok('Brief mit offener Rechnung bleibt', hat('Rechnung'));
    ok('Brief mit erledigter Rechnung wird wie ein normaler gelesener gelöscht (älteste zuerst)', !hat('Alte Rechnung'));
    ok('Hinweisbrief der Hofverwaltung „Post aufgeräumt“ (einmal)', P.filter(x => x.betreff === 'Post aufgeräumt' && x.von === 'Hofverwaltung').length === 1 && /ohne ⭐/.test(P.find(x => x.betreff === 'Post aufgeräumt').text));
    ok('Älteste normale Briefe sind weg, neueste da', !hat('Brief 299') && hat('Brief 0'));
    // zweites Kürzen im selben Jahr: kein zweiter Brief
    while (spiel.post.length <= 300) spiel.post.unshift(mk('fuell' + spiel.post.length)); brief('Test', 'Noch einer', 'x');
    ok('Im selben Spieljahr kein zweiter Hinweisbrief', spiel.post.filter(x => x.betreff === 'Post aufgeräumt').length === 1);
    // alles geschützt: nichts wird gelöscht, kein Absturz
    spiel.post = Array.from({ length: 305 }, (_, i) => mk('st' + i, { stern: true })); brief('Test', 'Einer mehr', 'x');
    ok('Nur geschützte Briefe: keiner wird gelöscht', spiel.post.length === 306 && spiel.post.every(x => x.stern || x.betreff === 'Einer mehr'));
    // Blase ab 250
    spiel.tippsAus = false; spiel.tipps = {}; spiel.tippWarte = []; spiel.post = Array.from({ length: 249 }, (_, i) => mk('b' + i)); brief('Test', 'Nr 250', 'x');
    ok('Ab 250 Briefen wird die Blase postVoll vorgemerkt', (spiel.tippWarte || []).includes('postVoll'));
    spiel.tipps = {}; spiel.tippWarte = []; spiel.post = Array.from({ length: 100 }, (_, i) => mk('c' + i)); brief('Test', 'Nr 101', 'x');
    ok('Unter 250: keine Blase', !(spiel.tippWarte || []).includes('postVoll'));
    ok('Blase im Katalog (Einsteiger-Eintrag, Stufe alle)', HINWEISE.postVoll && HINWEISE.postVoll[5] === 'alle' && !!EINSTEIGER_MEHR[HINWEISE.postVoll[4]]);
    const st = hinweisStufe; ['anf', 'fort', 'exp'].forEach(s => { spiel.spieler.stufe = s; ok('Blase postVoll gilt für Stufe ' + s, hinweisFuer('postVoll') === true); });
    ok('Brieftyp „Post aufgeräumt“ hat einen eigenen Typ', briefTyp('Post aufgeräumt')[1] === 'post-aufgeraeumt');
    return out;
  });
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
