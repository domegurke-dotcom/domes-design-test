// v1000-Entwurf (Dome 8.11.): Whiteboard · Boxen · „Versorgung heute“ in Gruppen Stalldienst (z. B. 2/3), Pflege, Bewegung; Antippen zeigt die Punkte mit ✔/✗
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/whiteboard-versgruppen-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 100000;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Stella' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; spiel.boxen[0].pferd = p;
    spiel.boxen[0].krippeVoll = true; spiel.boxen[0].mistig = true; spiel.boxen[0].wasserTag = spiel.tag;   // Misten fehlt
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard();
    const box = () => document.querySelectorAll('.wb-box')[0], gruppen = () => [...box().querySelectorAll('details.wb-vg')];
    R.titel = gruppen().map(d => d.querySelector('summary').textContent.replace(/\s+/g, ' ').trim());
    R.klassen = gruppen().map(d => d.className);
    const st = gruppen().find(d => /Stalldienst/.test(d.textContent));
    R.stallZu = st && !st.open; R.vorMisten = st ? st.querySelector('summary').textContent.replace(/\s+/g, ' ').trim() : ''; R.stallPunkte = st ? [...st.querySelectorAll('.wb-pn-z')].map(s => s.textContent.replace(/\s+/g, ' ').trim()) : [];
    if (st) { st.open = true; st.dispatchEvent(new Event('toggle', { bubbles: false })); }
    zeigeWhiteboard(); const st2 = gruppen().find(d => /Stalldienst/.test(d.textContent)); R.merkt = !!st2 && st2.open;
    { const pf = gruppen().find(d => /Pflege/.test(d.textContent)); R.pflege = pf ? [...pf.querySelectorAll('.wb-pn-z')].map(s => s.textContent.replace(/\s+/g, ' ').trim()) : []; }
    p.geputzt = { tag: spiel.tag, mit: ['buerste', 'kamm'] }; p.ausgekratzt = spiel.tag; zeigeWhiteboard(); { const pf = gruppen().find(d => /Pflege/.test(d.textContent)); R.pflegeGeputzt = pf ? [...pf.querySelectorAll('.wb-pn-z')].map(s => s.textContent.replace(/\s+/g, ' ').trim()) : []; }
    spiel.boxen[0].mistig = false; zeigeWhiteboard(); const st3 = gruppen().find(d => /Stalldienst/.test(d.textContent)); R.nachMisten = st3 ? st3.querySelector('summary').textContent.replace(/\s+/g, ' ').trim() + ' / ' + st3.className : '';
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Gruppe „Stalldienst“ mit Zähler, Misten fehlt → 3/4 (oder x/y mit Futter), rot', R.titel.some(t => /Stalldienst/.test(t) && /\d\/\d/.test(t)) && R.klassen.some(c => /nein/.test(c)), JSON.stringify(R.titel));
  ok('Gruppe ist zugeklappt, Antippen zeigt die Punkte mit ✔/✗', R.stallZu && R.stallPunkte.length >= 3 && R.stallPunkte.some(s => /^✗/.test(s)) && R.stallPunkte.some(s => /^✔/.test(s)), JSON.stringify(R.stallPunkte));
  ok('aufgeklappt bleibt beim Neuzeichnen', R.merkt);
  ok('nach dem Misten zählt die Gruppe einen Punkt mehr', (a => (b => a && b && +b[1] === +a[1] + 1 && a[2] === b[2])(R.nachMisten.match(/(\d)\/(\d)/)))(R.vorMisten.match(/(\d)\/(\d)/)), R.vorMisten + ' → ' + R.nachMisten);
  ok('Gruppe Pflege enthält „Putzen“: ✗ solange nicht geputzt, ✔ danach', R.pflege.some(s => /^✗ 🧽 Putzen/.test(s)) && R.pflegeGeputzt.some(s => /^✔ 🧽 Putzen/.test(s)), JSON.stringify([R.pflege, R.pflegeGeputzt]));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
