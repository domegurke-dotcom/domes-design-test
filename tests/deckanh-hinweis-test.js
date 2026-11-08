// v1000-Entwurf (Dome 8.11.): Hinweisblase zur Deckstation im Pferdeanhänger
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/deckanh-hinweis-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.anlage.anhaenger = true;
    const st = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Stella' }); st.pflege = erzeugePflege(st); st.werte = st.werte || erzeugeWerte(st); st.befunde = []; spiel.boxen[0].pferd = st; spiel.boxen[0].krippeVoll = true;   // eine deckfähige Stute, sonst ist die Kachel gesperrt (ohne Knopf)
    anhZiel = null; zeigeAnhaenger();
    R.kachel = !!document.querySelector('#nebenSchirm [data-anhziel="deckstation"]');
    R.liste = hinweisAnsicht(); R.drin = R.liste.includes('deckAnh');
    R.eintrag = !!HINWEISE.deckAnh && HINWEISE.deckAnh[1].split(/[.!?](\s|$)/).filter(s => s && s.trim().length > 2).length <= 3;
    anhZiel = 'deckstation'; zeigeAnhaenger(); R.nachZiel = hinweisAnsicht().includes('deckAnh');   // in der Stutenwahl keine Blase mehr
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Anhänger-Startseite zeigt die Kachel Deckstation', R.kachel, JSON.stringify(R));
  ok('Hinweis „deckAnh“ gehört zur Anhänger-Startseite', R.drin, JSON.stringify(R.liste));
  ok('Hinweistext vorhanden (höchstens 2 Sätze)', R.eintrag);
  ok('In der Stutenwahl kommt der Hinweis nicht mehr', !R.nachZiel);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
