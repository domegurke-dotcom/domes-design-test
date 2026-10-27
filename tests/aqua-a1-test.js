// Aqua A1 (v872, PLAN-AQUA.md): Gebäude (Stufen, Preise, Flächen, einmal je Hof, nur Experte), Teich im Winter gesperrt, Blaualgen, Schwimmen gesperrt bei Rücken/Hinterhand, Einheit (Energie, nass, Gewöhnung, Werte), Ort-Ansicht
// Start (Domes PC, siehe CLAUDE.md): node tests/aqua-a1-test.js [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.argv[2];
(async () => {
  const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : '')); const errs = [];
  for (const [W, H] of [[1366, 768], [844, 390], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
    await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
    await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
    const R = await pg.evaluate(() => { const R = {}; const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.geld = 400000; VET.verbotAb = 99;
      spiel.stufenAn = true; spiel.spieler.stufe = 'fort'; R.fort = frei('bauen', 'aqua'); spiel.spieler.stufe = 'exp'; R.exp = frei('bauen', 'aqua');
      R.preise = [1, 2, 3].map(st => bauPreis('aqua', st)).join('/'); R.flaeche = [1, 2, 3].map(st => platzVon('aqua', 0, st)).join('/');
      while (datum().s !== 1) { naechsteNacht(); zu(); }
      spiel.hof.bauHa = 5; const ok1 = bauStarten('aqua', 1); try { planAutoSetzen(); } catch (e) { } R.gebaut = ok1; R.bauTage = (gebaeude().find(g => g.typ === 'aqua').bau || {}).rest; R.tpj = tpj();
      R.einmal = bauSperre('aqua'); const g = gebaeude().find(x => x.typ === 'aqua'); delete g.bau; spiel.anlage.aqua = true; g.zustand = 100;
      const box = spiel.boxen[0]; const p = neuesPferd({ name: 'Fiona', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); box.pferd = p; p.energie = energieMax(p);
      R.progs1 = Object.keys(AQUA_PROG).filter(k => !aquaSperre(p, box, k)).join(',');
      const e0 = energie(p), a0 = p.werte.ist.ausdauer; const txt = aquaEinheit(p, box, 'schwimmen', 20, null);
      R.energie = e0 - energie(p); R.nass = p.nass === spiel.tag; R.dreck = p.dreck.fell >= 30; R.ausdauer = p.werte.ist.ausdauer > a0; R.einmalTag = !!aquaSperre(p, box, 'schwimmen'); R.txt = /nass/.test(txt);
      // Rücken/Hinterhand
      spiel.tag++; p.befunde = []; befundNeu(p, 'spat', 1, 'Test'); const sb = p.befunde[0]; sb.diagnose = spiel.tag; sb.bemerkt = { von: 'du', tag: spiel.tag }; delete sb.inkub; R.spat = /Hinterhand/.test(aquaSperre(p, box, 'schwimmen')); p.befunde = [];
      // Asthma gesperrt
      befundNeu(p, 'asthma', 1, 'Test'); const ab = p.befunde[0]; ab.diagnose = spiel.tag; ab.bemerkt = { von: 'du', tag: spiel.tag }; delete ab.inkub; R.asthma = /Asthma/.test(aquaSperre(p, box, 'schwimmen')); p.befunde = [];
      // Blaualgen
      g.algen = spiel.tag + 1; spiel.admin = false; R.algen = /Blaualgen/.test(aquaSperre(p, box, 'schwimmen')); delete g.algen;
      // Winter: Teich zu
      while (datum().s !== 3) spiel.tag++; R.winter = /zugefroren/.test(aquaSperre(p, box, 'schwimmen'));
      g.stufe = 3; R.winter3 = !aquaSperre(p, box, 'schwimmen'); R.progs3 = Object.keys(AQUA_PROG).filter(k => !/Laufband|Stufe 3/.test(aquaSperre(p, box, k))).join(',');
      // Gewöhnung: Kondition erst gewöhnt
      p.aquaGewohnt = 0; p.wasserGewohnt = 0; R.kondUngew = /gewöhnt/.test(aquaSperre(p, box, 'kondition')); p.wasserGewohnt = 5; p.aquaGewohnt = 1; R.halbGewohnt = aquaGewohnt(p);
      // Ort-Ansicht
      aktBox = 0; spiel.aktBox = 0; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = 'aqua'; try { zeigeAkte(); } catch (e) { R.fehler = e.message; }
      R.knoepfe = document.querySelectorAll('[data-aqua]').length; return R; });
    await pg.waitForTimeout(250);
    if (W === 1366) {
      ok('nur Experte darf bauen', !R.fort && R.exp); ok('Preise 15.000 / 60.000 / 150.000', R.preise === '15000/60000/150000', R.preise);
      ok('Fläche 0,05 / 0,03 / 0,05 ha (+30 % Wege)', R.flaeche === '0.065/0.039/0.065', R.flaeche); ok('Bau gestartet, 1 Jahreszeit', R.gebaut && R.bauTage === R.tpj, `${R.bauTage}/${R.tpj}`);
      ok('nur einmal je Hof', /schon gebaut/.test(R.einmal), R.einmal); ok('Teich: nur Schwimmen', R.progs1 === 'schwimmen', R.progs1);
      ok('Einheit: Energie 24, nass, schmutzig, Ausdauer steigt', R.energie === 24 && R.nass && R.dreck && R.ausdauer && R.txt, R.energie);
      ok('nur 1× am Tag', R.einmalTag); ok('Schwimmen gesperrt bei Spat', R.spat); ok('Asthma gesperrt', R.asthma); ok('Blaualgen sperren', R.algen);
      ok('Teich im Winter zu, Halle offen', R.winter && R.winter3); ok('Stufe 3: alle Programme', R.progs3 === 'schwimmen,reha,aufbau,kondition', R.progs3);
      ok('Kondition erst nach Gewöhnung; gewaschen = halb gewöhnt (1 Einheit)', R.kondUngew && R.halbGewohnt);
    }
    ok(`${W}×${H}: Ort-Ansicht mit 12 Knöpfen`, R.knoepfe === 12 && !R.fehler, `${R.knoepfe} ${R.fehler || ''}`);
    if (ORD) await pg.screenshot({ path: path.join(ORD, `aqua-${W}x${H}.png`) });
    await pg.close();
  }
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
