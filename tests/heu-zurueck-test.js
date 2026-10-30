// v901 (Dome 30.10.): Heu schon gegeben, Pferd kommt auf die Weide mit genug Gras → Heu geht zurück in die Futterkammer
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nixe' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; spiel.boxen[0].pferd = p; aktBox = 0;
    spiel.tag = jzStartTag(Math.floor(jzJetzt() / 4) * 4 + 1) + 2;   // Sommer
    const F = futterkammer(); F.lager.heu = 500; const box = spiel.boxen[0];
    const vor = F.lager.heu; fuetternAusLager(box, 'du', 'rau'); box.krippeVoll = true; R.nach = F.lager.heu; R.krippe = box.krippeVoll;
    p.weideZuletzt = spiel.tag - 1; aufWeide(p, box); R.heuNoetig = heuNoetigP(p); R.zurueck = F.lager.heu; R.krippeDanach = box.krippeVoll; R.vor = vor; R.sommer = datum().s;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Heu wurde gegeben (Lager sinkt, Raufe voll)', R.nach < R.vor && R.krippe, JSON.stringify(R));
  ok(R.heuNoetig ? 'Weide hat zu wenig Gras – Heu bleibt (Test sagt nur, ob die Rückgabe stimmt)' : 'Genug Gras: Heu zurück im Lager, Raufe leer', R.heuNoetig ? R.zurueck === R.nach && R.krippeDanach : Math.abs(R.zurueck - R.vor) < 0.01 && !R.krippeDanach, JSON.stringify(R));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
