// v898 (Dome 30.10.): Pferdewirte (Zucht, Haltung und Service) füttern/misten wie ein Stallbursche, teilen sich die Kapazität mit dem Putzen
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    ['A', 'B', 'C', 'D', 'E'].forEach((n, i) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: n }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; spiel.boxen[i].pferd = p; });
    const mk = typ => maErgaenzen({ id: 'm' + typ, typ, name: 'Test ' + typ, wissen: wissenStart(20, {}), eig: [], gehalt: 300, ab: 0, bis: null });
    spiel.mitarbeiter = [mk('pferdewirtHS')]; maBoxCache = null;
    R.stall = maZuteilung('stall').length; R.pfl = maZuteilung('pfleger').length;
    spiel.mitarbeiter = [mk('pferdewirtHS'), mk('pfleger')]; maBoxCache = null; R.stall2 = maZuteilung('stall').length; R.pfl2 = maZuteilung('pfleger').length;
    spiel.mitarbeiter = [mk('pferdewirt')]; maBoxCache = null; R.stall3 = maZuteilung('stall').length;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok("Pferdewirt Haltung/Service allein: seine 3 Boxen putzt UND versorgt er (gleiche Boxen, Kapazität nur einmal)", R.pfl === 3 && R.stall === 3, JSON.stringify(R));
  ok('mit Pfleger: Pfleger putzt, Pferdewirt versorgt den Rest im Stall', R.stall2 >= 1, JSON.stringify(R));
  ok('Pferdewirt Zucht kann auch in den Stall', R.stall3 === 3, R.stall3);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
