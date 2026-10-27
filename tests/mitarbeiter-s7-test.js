// Mitarbeiter S7 (v868, PLAN-MITARBEITER.md): Probezeit (2 Jz, 75 % Gehalt und 1 Box weniger in der 1. Jz, fristlos), Urlaub als Block über den Sammelbrief „Urlaubsplanung“
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s7-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}, zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 50000; VET.verbotAb = 99;
    const jz = jzJetzt();
    const P = maErgaenzen({ id: 'mP', typ: 'stallbursche', name: 'Paul', w: false, wissen: wissenStart(30, {}), eig: [], gehalt: 300, ab: jz + 1, bis: null, probe: jz + 1 + PROBE.jz });
    const A = maErgaenzen({ id: 'mA', typ: 'stallbursche', name: 'Alt', w: false, wissen: wissenStart(30, {}), eig: [], gehalt: 300, ab: 0, bis: null });
    spiel.mitarbeiter = [P, A];
    const bis = () => { const j0 = jzJetzt(); let n = 0; while (jzJetzt() === j0 && n++ < 20) { naechsteNacht(); zu(); } };
    const g0 = spiel.geld; bis();   // Jahreszeit-Wechsel: Paul fängt an
    R.kap = [maKapazitaet(P), maKapazitaet(A)]; R.probe = inProbe(P) && !inProbe(A);
    const geldVor = spiel.geld; spiel.mitarbeiter = [P]; const tB = spiel.post.length; bis();   // Ende der 1. Jz: 75 %
    R.gehalt = spiel.finanzen ? null : null; const g = (spiel.finanzen || spiel.buchungen || []);
    R.gehaltTxt = JSON.stringify(spiel).includes('Einarbeitung 75 %');
    R.kap2 = maKapazitaet(P); R.probe2 = inProbe(P);
    // in der Probezeit kein Urlaub
    R.keinWunschProbe = !P.uWunsch || P.uWunsch.jz >= P.probe;
    bis(); R.probe3 = inProbe(P);
    // Urlaubsplanung: Wunsch für alle, die dran sind – Pauls Lieblings-Jahreszeit = nächste
    spiel.mitarbeiter = [P, A]; A.urlaubJahr = -1; P.urlaubJahr = -1; delete A.uWunsch; delete P.uWunsch;
    const n = jzJetzt() + 1, s = datum(jzStartTag(n)).s; P.uJz = s; A.uJz = s;
    const vorher = spiel.post.length; urlaubJahreszeit(); const br = spiel.post.find(x => /Urlaubsplanung/.test(x.betreff));
    R.brief = !!br && br.aktion && br.aktion.typ === 'uplan'; R.wuensche = [P, A].filter(m => m.uWunsch).length;
    R.tage = P.uWunsch ? P.uWunsch.bis - P.uWunsch.von + 1 : 0; R.tageSoll = urlaubTage();
    R.konflikt = urlaubKonflikte([P, A]).length > 0 || Math.abs(P.uWunsch.von - A.uWunsch.von) >= urlaubTage();
    // Dialog: verschieben, Paul genehmigen, Alt ablehnen
    P.uWunsch.fest = false; A.uWunsch.fest = false; urlaubPlanDialog();
    R.schiebKnopf = document.querySelectorAll('[data-uschieb]').length; const zA = zufr(A);
    P.uWunsch.wahl = 'ok'; A.uWunsch.wahl = 'nein'; const pv = P.uWunsch.von; urlaubPlanAbschicken([P, A]); zu();
    R.genehmigt = !!(P.urlaub && P.urlaub.ok && P.urlaub.von === pv); R.abgelehnt = !A.uWunsch && A.uVor && zufr(A) < zA;
    R.status = urlaubStatus(P);
    // Azubi: nur genehmigen
    const Z = maErgaenzen({ id: 'mZ', typ: 'azubi', name: 'Zoe', w: true, wissen: wissenStart(5, {}), eig: [], gehalt: 100, ab: 0, bis: null, fach: 'haltung', ausbilder: 'du' });
    Z.uWunsch = { jz: n, von: jzStartTag(n), bis: jzStartTag(n) + 2, von0: jzStartTag(n), fest: false, vor: false }; spiel.mitarbeiter = [Z]; urlaubPlanDialog();
    R.azubiKnoepfe = [...document.querySelectorAll('[data-uwahl]')].map(x => x.dataset.uwahl.split(':')[1]).join(','); zu();
    // offen geblieben = genehmigt zu Beginn der Jahreszeit
    bis(); R.offenOk = !!(Z.urlaub && Z.urlaub.ok) && !Z.uWunsch;
    // fristlose Kündigung in der Probezeit
    const Q = maErgaenzen({ id: 'mQ', typ: 'pfleger', name: 'Quinn', w: true, wissen: wissenStart(30, {}), eig: [], gehalt: 330, ab: jzJetzt(), bis: null, probe: jzJetzt() + 2 });
    spiel.mitarbeiter = [Q]; probeFristlos(Q, false); R.fristlos = !spiel.mitarbeiter.includes(Q) && spiel.post.some(x => /Probezeit/.test(x.betreff));
    // Lehrgang nicht auf Urlaub
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Probezeit nur für neue Fachkräfte', R.probe); ok('1. Jahreszeit 1 Box weniger', R.kap[0] === R.kap[1] - 1, R.kap.join('/'));
  ok('1. Jahreszeit 75 % Gehalt gebucht', R.gehaltTxt); ok('2. Jahreszeit volle Boxen, noch Probezeit', R.kap2 === R.kap[1] && R.probe2, R.kap2);
  ok('Urlaubswunsch erst für die Zeit nach der Probezeit', R.keinWunschProbe); ok('nach 2 Jahreszeiten Probezeit vorbei', !R.probe3);
  ok('Sammelbrief „Urlaubsplanung“ mit Aktion', R.brief); ok('Wünsche für beide', R.wuensche === 2, R.wuensche); ok('Block nach Tempo', R.tage === R.tageSoll, `${R.tage}/${R.tageSoll}`);
  ok('Warnung bei gleichem Beruf (oder keine Überschneidung)', R.konflikt); ok('Verschieben-Knöpfe', R.schiebKnopf === 4, R.schiebKnopf);
  ok('genehmigt → Urlaub eingetragen', R.genehmigt); ok('abgelehnt → Zufriedenheit sinkt, Vorrang', R.abgelehnt); ok('Status im Dialog', /genehmigt/.test(R.status), R.status);
  ok('Azubi: nur genehmigen', R.azubiKnoepfe === 'ok', R.azubiKnoepfe); ok('offen zu Beginn der Jahreszeit = genehmigt', R.offenOk); ok('fristlos in der Probezeit, mit Brief', R.fristlos);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
