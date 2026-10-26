// Quarantäne-Pflicht des Veterinäramts (v854): Influenza, Herpes, Druse -> Brief, Frist 1 Tag, danach Mangel
// Start (Domes PC, siehe CLAUDE.md): node tests/quarantaene-pflicht-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.admin = false; spiel.geld = 100000;
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {};
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); p.gekauftTag = -99; return p; };
    spiel.boxen.forEach(x => { x.pferd = null; delete x.fohlen; });
    const A = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Krank' }), B2 = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nachbarin' }), C = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Fern' });
    spiel.boxen[0].pferd = A; spiel.boxen[1].pferd = B2; spiel.boxen[2].pferd = C; spiel.boxen.slice(0, 3).forEach(x => { x.krippeVoll = true; x.mistig = false; x.mistStufe = 0; });
    const briefe = t => spiel.post.filter(x => t.test(x.betreff)).length;
    const bf = befundNeu(A, 'druse', 2, 'Test'); bf.bemerkt = true; bf.diagnose = spiel.tag; delete bf.inkub;
    quarPflichtTag(); R.pflichtKrank = !!(A.quarPflicht && A.quarPflicht.krank); R.pflichtNachbar = !!(B2.quarPflicht && !B2.quarPflicht.krank); R.pflichtFern = !!C.quarPflicht; R.brief = briefe(/Quarantäne-Pflicht/);
    quarPflichtTag(); R.einBrief = briefe(/Quarantäne-Pflicht/) === 1;
    R.sofortKeinMangel = !vetMaengel().some(m => m.art === 'quarantaene');
    spiel.tag += 2; R.mangel = vetMaengel().filter(m => m.art === 'quarantaene').length; R.schwer = vetMaengel().filter(m => m.art === 'quarantaene').every(m => m.schwer);
    A.quarantaene = spiel.tag - 50; B2.quarantaene = spiel.tag; R.lang = inQuarantaene(A); R.mangelBlut = vetMaengel().filter(m => m.art === 'quarantaene').map(m => m.text).join('|');
    spiel.blutbilder = [{ pid: B2.id, name: B2.name, gross: false, fertig: spiel.tag + 2, gefunden: [] }]; quarPflichtTag(); R.keinMangel = vetMaengel().filter(m => m.art === 'quarantaene').length;
    // Hautpilz löst nichts aus
    A.befunde = []; delete A.quarPflicht; delete B2.quarPflicht; const h = befundNeu(A, 'hautpilz', 2, 'Test'); h.bemerkt = true; h.diagnose = spiel.tag; delete h.inkub; const n0 = briefe(/Quarantäne-Pflicht/); quarPflichtTag(); R.pilz = briefe(/Quarantäne-Pflicht/) === n0 && !A.quarPflicht;
    // geheilt: Pflicht weg
    A.befunde = []; const d2 = befundNeu(A, 'herpes', 2, 'Test'); d2.bemerkt = true; delete d2.inkub; quarPflichtTag(); R.herpes = !!A.quarPflicht; A.befunde = []; quarPflichtTag(); R.geheilt = !A.quarPflicht;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  ok('krankes Pferd bekommt die Pflicht', R.pflichtKrank); ok('Nachbarbox ist Kontaktpferd', R.pflichtNachbar); ok('Pferd weiter weg nicht', !R.pflichtFern); ok('ein Brief, nicht doppelt', R.brief === 1 && R.einBrief);
  ok('am Tag des Briefs noch kein Mangel', R.sofortKeinMangel); ok('nach der Frist: 2 Mängel, schwer', R.mangel === 2 && R.schwer, R.mangel);
  ok('in Quarantäne: Kontaktpferd ohne Blutbild bleibt Mangel', /Blutbild/.test(R.mangelBlut), R.mangelBlut); ok('mit Quarantäne und Blutbild: keine Mängel', R.keinMangel === 0, R.keinMangel);
  ok('krankes Pferd bleibt in Quarantäne, auch nach Wochen', R.lang); ok('Hautpilz löst nichts aus', R.pilz); ok('Herpes löst aus, Heilung beendet Pflicht', R.herpes && R.geheilt); ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
