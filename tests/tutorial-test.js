// Tutorial-Test (T4, PLAN-HINWEISE.md/PLAN-TUTORIAL.md): Anfänger → Tutorial im Testhof, Kapitel mit Zielen, Überblendung, Überspringen, Abschlussfrage, nichts gespeichert, echtes Spiel frisch
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/tutorial-test.js [Ordner für Bildschirmfotos]
const { chromium } = require('playwright'); const path = require('path');
const ORDNER = process.argv[2];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(300); await pg.fill('#chName', 'Test'); await pg.waitForTimeout(100);
  const auto0 = await pg.evaluate(() => localStorage.getItem('zuchtstall-v2'));
  const f = await pg.evaluate(() => !document.getElementById('chTutorial').hidden); ok('Anfänger: Knopf „Erst das Tutorial“', f);
  await pg.click('#chTutorial'); await pg.waitForTimeout(1200);
  await pg.evaluate(() => { spiel.boxen[0].krippeVoll = spiel.boxen[0].krippeVoll; }); await pg.waitForTimeout(600);
  const A = await pg.evaluate(() => ({ tut: !!spiel.tutorial, kap: spiel.tutorial && spiel.tutorial.kap, band: !!document.getElementById('tutBand'), pferd: spiel.boxen[0].pferd && spiel.boxen[0].pferd.name, auto: localStorage.getItem('zuchtstall-v2'), blase: blase && blase.k, menue: getComputedStyle(document.getElementById('menueKnopf')).visibility }));
  ok('Testhof mit Testpferd Tutti, Band, Kapitel 1', A.tut && A.kap === 0 && A.band && A.pferd === 'Tutti', JSON.stringify({ ...A, auto: !!A.auto })); ok('Nichts gespeichert (Autospeicher unverändert)', A.auto === auto0); ok('Menü im Kapitel 1 versteckt', A.menue === 'hidden');
  if (ORDNER) await pg.screenshot({ path: `${ORDNER}/kap1.png` });
  await pg.click('#hinweisBlase'); await pg.waitForTimeout(600);
  const B = await pg.evaluate(() => blase && blase.k); ok('Erklärung antippen → Schritt „Heu geben“', B === 'tut_0_1', String(B));
  ok('Nur das Gefragte antippbar (Wasser gesperrt, Heu erlaubt)', await pg.evaluate(() => !tutErlaubt(document.querySelector('.stufeEl .sWasser') || document.body) && tutErlaubt(document.getElementById('heuhaufen'))));
  await pg.evaluate(() => { const b = spiel.boxen[0]; b.krippeVoll = true; b.kraftVoll = true; b.wasserTag = spiel.tag; b.mistig = false; }); await pg.waitForTimeout(900);
  const C = await pg.evaluate(() => ({ k: blase && blase.k, kap: spiel.tutorial.kap })); ok('Ziel erreicht → Blase „Geschafft“, bleibt stehen', C.k === 'tut_fertig_0' && C.kap === 0, JSON.stringify(C));
  await pg.waitForTimeout(1200); ok('Ohne Antippen kein Weiterschalten', await pg.evaluate(() => spiel.tutorial.kap === 0));
  await pg.click('#hinweisBlase'); await pg.waitForTimeout(1200);
  const D = await pg.evaluate(() => ({ kap: spiel.tutorial.kap, dreck: spiel.boxen[0].pferd.dreck && spiel.boxen[0].pferd.dreck.fell })); ok('Überblendung zu Kapitel 2 (dreckig)', D.kap === 1 && D.dreck >= 80, JSON.stringify(D));
  if (ORDNER) await pg.screenshot({ path: `${ORDNER}/kap2.png` });
  for (let i = 0; i < 3; i++) { await pg.click('#tutKapWeg'); await pg.waitForTimeout(1100); }
  const E = await pg.evaluate(() => ({ kap: spiel.tutorial.kap, pferd: spiel.boxen[0].pferd.name, menue: getComputedStyle(document.getElementById('menueKnopf')).visibility })); ok('Kapitel überspringen (→ Kapitel 5, Menü sichtbar)', E.kap === 4 && E.menue === 'visible', JSON.stringify(E));
  await pg.click('#tutAllesWeg'); await pg.waitForTimeout(500);
  const F = await pg.evaluate(() => document.getElementById('dlgInhalt').textContent); ok('Tutorial beenden → Abschlussfrage', /nochmal kommen/.test(F), F.slice(0, 60));
  await pg.evaluate(() => [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /nur neue/.test(x.textContent)).click()); await pg.waitForTimeout(600);
  const G = await pg.evaluate(() => ({ immo: !!document.querySelector('[data-immo="pension"]'), band: !!document.getElementById('tutBand'), anlage: JSON.stringify(spiel.anlage), auto: localStorage.getItem('zuchtstall-v2') })); ok('Danach Immobilienmenü, Testhof weg, Autospeicher unverändert', G.immo && !G.band && G.auto === auto0 && !/"waschplatz":true/.test(G.anlage), JSON.stringify(G).slice(0, 120));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(300); await pg.fill('#kaufName', 'Echthof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(800);
  const H = await pg.evaluate(() => ({ tut: !!spiel.tutorial, hof: spiel.hof.name, pferde: spiel.boxen.filter(x => x.pferd).length, geld: spiel.geld, tipps: Object.keys(spiel.tipps || {}).length, auto: !!localStorage.getItem('zuchtstall-v2') }));
  ok('Echtes Spiel frisch (kein Testpferd, kein Tutorial, gespeichert)', !H.tut && H.hof === 'Echthof' && H.pferde === 0 && H.auto, JSON.stringify(H)); ok('„Nur neue Hinweise“: bekannte Tipps als gesehen markiert', H.tipps > 20, String(H.tipps));
  // T5: beim Aufstieg Tutorial anbieten, Fortgeschrittenen-Tutorial im Testhof
  const J = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.spieler.stufe = 'anf'; stufeWaehlen(); [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Fortgeschritten/.test(x.textContent)).click(); return document.getElementById('dlgInhalt').textContent; });
  ok('T5: Aufstieg → „Tutorial jetzt machen?“', /Tutorial jetzt machen/.test(J), J.slice(0, 60));
  await pg.evaluate(() => [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Ja, jetzt/.test(x.textContent)).click()); await pg.waitForTimeout(1300);
  const K = await pg.evaluate(() => ({ set: spiel.tutorial && spiel.tutorial.set, band: (document.getElementById('tutBand') || {}).textContent || '', stute: spiel.boxen[0].pferd && spiel.boxen[0].pferd.name, hengst: spiel.boxen[1].pferd && spiel.boxen[1].pferd.name, zucht: frei('zucht') }));
  ok('T5: Fortgeschrittenen-Tutorial mit Stute und Hengst, Zucht frei', K.set === 'fort' && /Fortgeschrittenen-Tutorial 1\/6/.test(K.band) && K.stute === 'Fee' && K.hengst === 'Donar' && K.zucht, JSON.stringify(K));
  console.log(out.join('\n')); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
