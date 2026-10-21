// Tutorial (v639): nach jeder Nacht kontrolliert das Spiel die Post (fremde Briefe werden selbst beantwortet, Briefe zum Kapitel bleiben ungelesen) und Mitarbeiter versorgen die Pferde (außer Anfänger Kapitel 1/2)
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/tutorial-post-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(300); await pg.fill('#chName', 'Test'); await pg.click('#chTutorial'); await pg.waitForTimeout(1800);
  const R = {};
  // Kapitel 1: Spielerin versorgt selbst – Flächen frei, keine automatische Versorgung
  R.k1 = await pg.evaluate(() => { const b = spiel.boxen[0]; return { selbst: tutSelbstVersorgen(), hungrig: !b.krippeVoll, wasser: tutErlaubt(document.querySelector('.stufeEl .sWasser') || document.body), mist: tutErlaubt(document.getElementById('mist') || document.body) }; });
  // fremder Brief (gehört nicht zum Kapitel) wird selbst erledigt, Rechnung bezahlt
  R.post = await pg.evaluate(async () => { const g0 = spiel.geld; rechnungStellen('Hufschmied', 'klinik', [{ text: 'Test', betrag: 40 }], [], 'Rechnung Test', 'Hufe');
    brief('Max Mustermann', 'Zusätzliche Frage', 'Hallo', {}); brief('Hufschmied', 'Rechnung', 'hier die Rechnung', { aktion: { typ: 'rechnung', rid: (spiel.rechnungen[0] || {}).id } });
    tutPostKontrolle(); return { ungelesen: ungelesen(), offeneRechnungen: (spiel.rechnungen || []).length, geld: g0 - spiel.geld }; });
  // Kapitel 3 (Krankes Pony): Mitarbeiter versorgen, Brief der Tierarztpraxis bleibt ungelesen
  R.k3 = await pg.evaluate(async () => { tutKapitel(2); await new Promise(r => setTimeout(r, 1500)); const b = spiel.boxen[0]; b.krippeVoll = false; b.mistig = true; delete b.wasserTag; spiel.tutorial.versTag = null; tutPruefen();
    const ver = b.krippeVoll && !b.mistig; brief('Tierarztpraxis', 'Hausbesuch – Bericht', 'Bericht', {}); brief('Max Mustermann', 'Nochmal eine Frage', 'Hallo', {}); tutPostKontrolle();
    return { selbst: tutSelbstVersorgen(), versorgt: ver, tierarztUngelesen: (spiel.post || []).filter(x => !x.gelesen).map(x => x.von) }; });
  const out = [], ok = (n, c) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(c === false ? 'falsch' : c)));
  ok('Kapitel 1: Spielerin versorgt selbst, Wasser/Mist antippbar, Pferd nicht automatisch versorgt', R.k1.selbst && R.k1.hungrig && R.k1.wasser && R.k1.mist && true);
  ok('fremde Briefe sind erledigt (keine ungelesenen)', R.post.ungelesen === 0 && R.post);
  ok('Rechnung wurde selbst bezahlt', R.post.offeneRechnungen === 0 && R.post.geld === 40 && R.post);
  ok('Kapitel 3: Mitarbeiter versorgen das Pferd', !R.k3.selbst && R.k3.versorgt && R.k3);
  ok('Kapitel 3: Brief der Tierarztpraxis bleibt ungelesen, anderer wird erledigt', R.k3.tierarztUngelesen.length === 1 && R.k3.tierarztUngelesen[0] === 'Tierarztpraxis' && R.k3);
  ok('keine Seitenfehler', !errs.length && errs);
  console.log(out.join('\n')); await b.close();
})();
