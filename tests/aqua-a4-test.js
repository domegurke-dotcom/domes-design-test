// Aqua A4 + Reha (v873, PLAN-AQUA.md): Physiotherapeut nur mit Gebäude und ≤ Plätze, Kapazität (Stufe 2, 2 Therapeuten, 2 Helfer, Stallmeister = 7), Helfer fehlt bei einer Box, Reha heilt nur mit Therapeut (Arthrose-Verschlechterung halbiert), Lehrgang Wasserarbeit, Pension (Preis, Abrechnung), alter Spielstand
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-a4-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.geld = 400000; VET.verbotAb = 99; spiel.stufenAn = true; spiel.spieler.stufe = 'exp';
    R.ohne = maVerfuegbar('physio');
    gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 2, zustand: 100 }); spiel.anlage.aqua = true;
    R.mit = maVerfuegbar('physio');
    const neu = (id, typ, x) => maErgaenzen(Object.assign({ id, typ, name: id, w: false, wissen: wissenStart(40, {}), eig: [], gehalt: 300, ab: 0, bis: null }, x || {}));
    const T1 = neu('t1', 'physio'), T2 = neu('t2', 'physio'); spiel.mitarbeiter = [T1, T2]; R.voll = maVerfuegbar('physio');
    const H1 = neu('h1', 'pfleger', { aquaHilf: true }), H2 = neu('h2', 'pferdewirtHS', { aquaHilf: true }), SM = neu('sm', 'stallmeister');
    spiel.mitarbeiter = [T1, T2, H1, H2, SM];
    // 10 Pferde mit Wunsch täglich
    while (spiel.boxen.length < 10) spiel.boxen.push({ pferd: null });
    const P = []; for (let i = 0; i < 10; i++) { const p = neuesPferd({ name: 'P' + i, rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); p.aquaWunsch = { modus: '1', prog: 'schwimmen' }; p.wasserGewohnt = 9; p.aquaGewohnt = 9; spiel.boxen[i].pferd = p; P.push(p); }
    const k0 = maKapazitaet(H1); aquaMorgen(); R.anzahl = P.filter(p => p.aquaTag && p.aquaTag.tag === spiel.tag).length; R.helfer = maKapazitaet(H1) === k0 - 1; R.fehlt = P.filter(p => p.aquaFehlt === spiel.tag).length;
    R.trocken = P.filter(p => p.aquaTag && p.aquaTag.tag === spiel.tag).every(p => !p.nass);
    // Reha: Arthrose-Verschlechterung mit Therapeut kleiner
    gebaeude().find(g => g.gid === 'gaq').stufe = 3; spiel.tag++;
    const p = P[0]; p.befunde = []; befundNeu(p, 'arthrose', 2, 'Test'); const ab = p.befunde[0]; ab.diagnose = spiel.tag; ab.bemerkt = { von: 'du', tag: spiel.tag }; delete ab.inkub;
    R.rehaNoetig = aquaRehaNoetig(p); R.wunsch = (aquaWunschHeute(p) || {}).prog;
    delete p.behHeute; aquaEinheit(p, spiel.boxen[0], 'reha', 20, T1); spiel.tag++; R.bw = behandlungsWert(p, ab).wert;
    delete p.behHeute; aquaEinheit(p, spiel.boxen[0], 'reha', 20, null); spiel.tag++; R.bwDu = behandlungsWert(p, ab).wert;
    // Lehrgang Wasserarbeit
    const PW = neu('pw', 'pferdewirt'); spiel.mitarbeiter = [PW]; R.zugVor = maWasserKurs(PW); PW.kurs = { k: 'wasser', jz: jzJetzt(), t: 1, tag: spiel.tag - 3 }; lehrgangTag(); R.zugNach = maWasserKurs(PW);
    // Pension
    R.preis = [1, 2, 3].map(st => { gebaeude().find(g => g.gid === 'gaq').stufe = st; return PENSION_LEISTUNG.aqua.preis; }).join('/');
    R.moeglich = leistungMoeglich('aqua');
    // alter Spielstand: Mitarbeiter ohne neue Felder
    const alt = { id: 'x', typ: 'pfleger', name: 'Alt', wissen: { haut: 30 }, eig: [], gehalt: 330, ab: 0, bis: null }; maErgaenzen(alt); R.alt = maAquaHilft(alt) === false && maKapazitaet(alt) > 0;
    // Mitarbeiter-Dialog mit Helfer-Häkchen
    spiel.mitarbeiter = [H1]; mitarbeiterDialog('pfleger'); R.haken = !!document.querySelector('[data-maaqua]'); zu();
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Physiotherapeut nur mit Aqua-Center', !R.ohne && R.mit); ok('höchstens so viele wie Plätze (Stufe 2: 2)', !R.voll);
  ok('Kapazität Stufe 2: 2 Therapeuten + 2 Helfer + Stallmeister = 7', R.anzahl === 7 && R.fehlt === 3, `${R.anzahl} (ohne Platz: ${R.fehlt})`);
  ok('Helfer fehlt bei einer Box', R.helfer); ok('Personal trocknet ab', R.trocken);
  ok('Reha nötig bei Arthrose → Programm Reha', R.rehaNoetig && R.wunsch === 'reha', R.wunsch);
  ok('Reha mit Therapeut zählt als Behandlung, du ohne Lehrgang nicht', R.bw > 0 && R.bwDu === 0, `${R.bw} / ${R.bwDu}`);
  ok('Lehrgang Wasserarbeit', !R.zugVor && R.zugNach); ok('Pension 30 / 45 / 60 € je Einheit', R.preis === '30/45/60', R.preis); ok('Leistung angeboten nur mit Gebäude', R.moeglich);
  ok('alter Mitarbeiter: kein Helfer, Kapazität normal', R.alt); ok('Helfer-Häkchen im Mitarbeiter-Dialog', R.haken);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
