// Nachtrag 27.10. (v875): Aqua-Wunsch im Whiteboard, Azubi-Einsatz am Whiteboard, Kalender Rückkehr Aufzucht/Ausbildungsstall, Hinweis „Mittel reicht nur noch für morgen“, Tutorial Mitarbeiter mit Whiteboard
// Start (Domes PC, siehe CLAUDE.md): node tests/nachtrag-27-10-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 400000; VET.verbotAb = 99;
    const box = spiel.boxen[0]; const p = neuesPferd({ name: 'Fiona', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); box.pferd = p;
    const neu = (id, typ, x) => maErgaenzen(Object.assign({ id, typ, name: id, w: false, wissen: wissenStart(40, {}), eig: [], gehalt: 300, ab: 0, bis: null }, x || {}));
    // Aqua-Wunsch im Whiteboard
    wbSicht = 'boxen'; spiel.mitarbeiter = [neu('st', 'stallbursche')]; R.ohneAqua = !/data-wbaqua/.test(whiteboardHTML());
    gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 3, zustand: 100 }); spiel.anlage.aqua = true; R.ohnePersonal = !/data-wbaqua/.test(whiteboardHTML());
    spiel.mitarbeiter = [neu('st', 'stallbursche'), neu('ph', 'physio')]; spiel.stufenAn = false; zeigeWhiteboard(); R.mitPersonal = /data-wbaqua/.test(whiteboardHTML());
    // Azubi-Einsatz
    const Z = neu('zo', 'azubi', { fach: 'haltung', ausbilder: 'du', w: true }); spiel.mitarbeiter = [Z, neu('st', 'stallbursche')]; R.eins = /data-wbeins/.test(whiteboardHTML());
    azubiEinsatzWahl(Z); document.querySelector('[data-azw="putzen"]').click(); R.einsatzNeu = Z.einsatzNeu && Z.einsatzNeu.e === 'putzen' && Z.einsatzNeu.ab === spiel.tag + 1;
    // Kalender Rückkehr
    const f = neuesPferd({ name: 'Wirbel', rasse: 'hannoveraner', geschlecht: 'Wallach', alter: 2.5 }); f.pflege = erzeugePflege(f); spiel.extern = [{ pferd: f, ort: 'aufzucht', seit: spiel.tag }];
    let hit = false; for (let k = 0; k <= 3; k++) { if (kalTermine(jzJetzt() + k).some(x => /Wirbel/.test(x.text) && x.ico === '🚚')) hit = true; } R.kalender = hit;
    spiel.extern = [{ pferd: f, ort: 'ausbildung', seit: spiel.tag, abbruch: true }]; R.kalAb = kalTermine(jzJetzt()).some(x => /Wirbel/.test(x.text)); spiel.extern = [];
    // Mittel knapp
    p.befunde = []; befundNeu(p, 'arthrose', 2, 'Test'); const x = p.befunde[0]; x.diagnose = spiel.tag; x.bemerkt = { von: 'du', tag: spiel.tag }; delete x.inkub;
    const mittel = Object.keys(APO).find(k => !APO[k].frei && (PLAN.arthrose || []).includes(k)); R.mittel = mittel || '(keins im Plan)';
    if (mittel) { rezeptVon(p)[mittel] = 1; R.knapp = mittelKnapp(p).includes(mittel); rezeptVon(p)[mittel] = 3; R.nichtKnapp = !mittelKnapp(p).includes(mittel); rezeptVon(p)[mittel] = 1; R.karte = /Mittel wird knapp/.test(befundKarten(p, box)); mittelKnappTag(); R.blase = !!spiel.mittelKnapp; }
    // Tutorial Mitarbeiter
    const K = TUT.find(k => k.n === 'Mitarbeiter'); R.tut = K.schritte.map(s => s[0]); try { K.neu(); } catch (e) { R.tutFehler = e.message; }
    R.hanna = !!(spiel.boxen[0].pferd && spiel.boxen[0].pferd.name === 'Hanna' && spiel.boxen[0].pferd.befunde.some(b => b.art === 'husten'));
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Aqua-Wunsch erst mit Aqua-Center und Personal', R.ohneAqua && R.ohnePersonal && R.mitPersonal); ok('Azubi-Einsatz-Knopf im Whiteboard', R.eins); ok('Einsatz-Wechsel gilt ab morgen', R.einsatzNeu);
  ok('Kalender: Rückkehr aus Aufzucht (3 Jahre) und angekündigte Rückkehr', R.kalender && R.kalAb);
  ok('Mittel knapp erkannt, Karte und Blase', R.mittel === '(keins im Plan)' || (R.knapp && R.nichtKnapp && R.karte && R.blase), R.mittel);
  ok('Tutorial Mitarbeiter: Whiteboard-Schritte und Hanna mit Husten', ['Boxen', 'Mitarbeiter wählen', 'Hanna versorgen'].every(s => R.tut.includes(s)) && R.hanna && !R.tutFehler, R.tutFehler || '');
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
