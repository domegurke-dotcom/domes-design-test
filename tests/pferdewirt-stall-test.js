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
    // v1000-Entwurf (Dome 8.11.): Pferdewirt putzt Box 1 von Hand, Füttern/Misten ist von Hand dem Stallburschen zugeteilt → der Pferdewirt zählt dort nur Putzen (1), nicht zusätzlich Füttern
    spiel.mitarbeiter = [mk('pferdewirtHS'), mk('stallbursche')]; spiel.boxen[0].maPlan = { pfleger: 'mpferdewirtHS', stall: 'mstallbursche' }; maBoxCache = null;
    const zs = maZuteilung('stall'), zp = maZuteilung('pfleger'); R.manStallPw = zs.filter(x => x.i === 0 && x.m.id === 'mpferdewirtHS').length; R.manPutzPw = zp.filter(x => x.i === 0 && x.m.id === 'mpferdewirtHS').length; R.manStallSb = zs.filter(x => x.i === 0 && x.m.id === 'mstallbursche').length; spiel.boxen[0].maPlan = {}; maBoxCache = null;
    // Dome 8.11.: der Stallmeister erhöht die Tätigkeiten ALLER, die Pferde pflegen und misten (+2), nicht nur der Stallburschen
    const typen = ['pferdewirtHS', 'pferdewirt', 'pfleger', 'stallbursche', 'azubi'], mitSm = [], ohneSm = [];
    spiel.mitarbeiter = typen.map(mk); maBoxCache = null; typen.forEach((ty, i) => ohneSm.push(maKapazitaet(spiel.mitarbeiter[i])));
    spiel.mitarbeiter = typen.map(mk).concat([mk('stallmeister')]); maBoxCache = null; typen.forEach((ty, i) => mitSm.push(maKapazitaet(spiel.mitarbeiter[i])));
    R.smPlus = typen.map((ty, i) => mitSm[i] - ohneSm[i]); R.smStallb = mitSm[3]; spiel.mitarbeiter = []; maBoxCache = null;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok("Pferdewirt Haltung/Service allein: seine 3 Boxen putzt UND versorgt er (gleiche Boxen, Kapazität nur einmal)", R.pfl === 3 && R.stall === 3, JSON.stringify(R));
  ok('mit Pfleger: Pfleger putzt, Pferdewirt versorgt den Rest im Stall', R.stall2 >= 1, JSON.stringify(R));
  ok('Pferdewirt Zucht kann auch in den Stall', R.stall3 === 3, R.stall3);
  ok('von Hand zugeteilt: Pferdewirt putzt Box 1 (1 Tätigkeit), Füttern/Misten bleibt beim Stallburschen (nicht doppelt beim Pferdewirt)', R.manPutzPw === 1 && R.manStallPw === 0 && R.manStallSb === 1, JSON.stringify(R));
  ok('Stallmeister: +2 Tätigkeiten für Pferdewirte, Pfleger, Stallburschen und Azubis (Stallbursche dann 5)', R.smPlus.every(x => x === 2) && R.smStallb === 5, JSON.stringify(R.smPlus) + ' Stallbursche ' + R.smStallb);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
