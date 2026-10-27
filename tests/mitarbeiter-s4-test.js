// Mitarbeiter S4 (v865, PLAN-MITARBEITER.md): Whiteboard-Passung grün/gelb mit Schlagwort, nur sichtbares Wissen
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s4-test.js [BxH] [Bildordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Paul' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; p.fz = 5; spiel.boxen.forEach(x => { x.pferd = null; }); spiel.boxen[0].pferd = p; spiel.boxen[0].krippeVoll = true;
    const mk = (typ, w, eig) => maErgaenzen({ id: 'm' + typ, typ, name: typ === 'azubi' ? 'Ali' : 'Leon', wissen: wissenStart(10, w), eig: eig || [], gehalt: 300, ab: 0, bis: null, fach: 'haltung' });
    R.ohne = passung(mk('stallbursche', { futter: 45 }), p, spiel.boxen[0]).farbe;
    const k = befundNeu(p, 'kolik', 1, 'Test'); k.diagnose = spiel.tag; k.bemerkt = { von: 'du', tag: spiel.tag }; delete k.inkub;
    const gut = passung(mk('stallbursche', { futter: 45 }), p, spiel.boxen[0]); R.gut = gut.farbe + '|' + gut.tags.map(x => x.t).join(';');
    const schlecht = passung(mk('azubi', {}), p, spiel.boxen[0]); R.schlecht = schlecht.farbe + '|' + schlecht.tags.map(x => x.t).join(';');
    const auf = passung(mk('pfleger', { haut: 30 }, ['aufmerksam']), p, spiel.boxen[0]); R.auf = auf.tags.map(x => x.t).join(';');
    const versteckt = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Geheim' }); versteckt.pflege = erzeugePflege(versteckt); versteckt.befunde = []; versteckt.fz = 5; const v2 = befundNeu(versteckt, 'kolik', 1, 'Test'); delete v2.bemerkt; delete v2.diagnose; delete v2.inkub; R.versteckt = passung(mk('azubi', {}), versteckt, null).tags.length;
    spiel.mitarbeiter = [mk('stallbursche', { futter: 45 })]; spiel.boxen[0].maPlan = { stall: 'mstallbursche' }; wbSicht = 'boxen'; wbWahl = 'm:mstallbursche'; zeigeBoxen();
    R.box = !!document.querySelector('.wb-box.wb-pass-gruen'); R.marke = (document.querySelector('.wb-pass.gruen') || {}).textContent || '';
    const mb = document.querySelector('[data-wbpass]'); if (mb) { mb.click(); R.dialog = !document.getElementById('dlg').hidden && /kennt sich mit Fütterung aus/.test(document.getElementById('dlgInhalt').textContent); document.getElementById('dlg').hidden = true; }
    return R; });
  if (ORD) await pg.screenshot({ path: `${ORD}/s4-${W}x${H}.png` });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('gesundes Pferd ohne Besonderheit: keine Farbe', R.ohne === null, R.ohne); ok('Fütterung 45 bei Kolik: grün', /^gruen\|Fütterung – Kolik/.test(R.gut), R.gut);
  ok('Azubi (5) bei Kolik: gelb „wenig Erfahrung“', /^gelb\|wenig Erfahrung – Kolik/.test(R.schlecht), R.schlecht); ok('aufmerksam bei krankem Pferd', /aufmerksam – krank/.test(R.auf), R.auf);
  ok('unbemerkte Krankheit verrät nichts', R.versteckt === 0, R.versteckt); ok('Box leuchtet grün beim gewählten Mitarbeiter', R.box); ok('Schlagwort neben dem Namen in der Box', /Fütterung – Kolik/.test(R.marke), R.marke); ok('Antippen zeigt den Grund', R.dialog);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(`${W}x${H}\n` + out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
