// Aqua-Nachtrag (v876): Mehrfachauswahl im Hauptmenü-Anhänger, Reha-Zeitraum im Whiteboard, Rennstall-Erholungstag per Aqua
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-nachtrag-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 400000; VET.verbotAb = 99;
    const mk = (n, g, a) => { const p = neuesPferd({ name: n, rasse: 'hannoveraner', geschlecht: g, alter: a }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); p.wasserGewohnt = 9; p.aquaGewohnt = 9; p.energie = energieMax(p); return p; };
    while (spiel.boxen.length < 3) spiel.boxen.push({ pferd: null }); const P = [mk('Anna', 'Stute', 8), mk('Bert', 'Wallach', 9), mk('Cleo', 'Stute', 8)]; P.forEach((p, i) => { spiel.boxen[i].pferd = p; });
    // ohne Aqua-Center keine Kachel
    R.ohne = !/data-anhziel="aqua"/.test(anhKacheln('start', null));
    gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 3, zustand: 100 }); spiel.anlage.aqua = true;
    R.mit = /data-anhziel="aqua"/.test(anhKacheln('start', null)); R.boxOhne = !/data-ort="aqua"/.test(anhKacheln('start', { p: P[0], box: spiel.boxen[0] }));
    R.kand = anhKandidaten('aqua').length;
    // Reha-Pferd: Arthrose
    P[1].befunde = []; befundNeu(P[1], 'arthrose', 1, 'Test'); const x = P[1].befunde[0]; x.diagnose = spiel.tag; x.bemerkt = { von: 'du', tag: spiel.tag }; delete x.inkub;
    anhZiel = 'aqua'; anhAuswahl = new Set(P.map(p => 'p:' + p.id)); zeigeAnhaenger(); document.getElementById('anhLos').click();
    R.dialog = document.querySelectorAll('[data-aqp]').length; const selB = document.querySelector('[data-aqp="' + P[1].id + '"]'); R.vorReha = selB && selB.value === 'reha';
    [...document.querySelectorAll('#dlgKnoepfe button')].find(k => /Losfahren/.test(k.textContent)).click();
    R.gemacht = P.filter(p => p.aquaTag && p.aquaTag.tag === spiel.tag).length;
    // Reha-Zeitraum im Whiteboard
    R.rehaSeit = P[1].rehaSeit === spiel.tag; wbSicht = 'boxen'; spiel.mitarbeiter = []; R.rehaZeile = /Aqua-Reha seit/.test(whiteboardHTML());
    // Rennstall-Erholungstag
    const maSt = maErgaenzen({ id: 'rt', typ: 'renntrainer', name: 'Rex', w: false, wissen: wissenStart(40, {}), eig: [], gehalt: 450, ab: 0, bis: null, kurse: { wasser: 1 } });
    spiel.mitarbeiter = [maSt]; const V = mk('Blitz', 'Hengst', 5); V.rasse = 'vollblut'; spiel.boxen[2].pferd = V; spiel.tag++; V.galoppFolge = 2; V.energie = energieMax(V); delete V.aquaLog;
    spiel.anlage.rennbahn = true; try { trainerMorgen('renntrainer'); } catch (e) { R.trFehler = e.message; }
    R.erholung = V.aquaTag && V.aquaTag.tag === spiel.tag && V.galoppFolge === 0;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Aqua-Kachel im Hauptmenü-Anhänger nur mit Aqua-Center, nicht am Box-Anhänger', R.ohne && R.mit && R.boxOhne); ok('3 Pferde wählbar', R.kand === 3, R.kand);
  ok('Dialog: Programm je Pferd, Reha-Vorschlag bei Arthrose', R.dialog === 3 && R.vorReha, R.dialog); ok('alle drei sind im Wasser gewesen', R.gemacht === 3, R.gemacht);
  ok('Reha-Zeitraum steht im Whiteboard', R.rehaSeit && R.rehaZeile);
  ok('Rennstall: nach 2 Galopptagen Aqua als Erholungstag', R.erholung, R.trFehler || '');
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
