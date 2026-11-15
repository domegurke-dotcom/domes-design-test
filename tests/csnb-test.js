// v1045 (Recherche 15.11.2026): CSNB2-Nachtblindheit nur bei Standardbred-Passgängern, Cream beim Standardbred, SW1 beim Oldenburger
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/csnb-test.js   ·   MOTOR=1 prüft zuchtstall-app/motor/index.html
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  let r = await pg.evaluate(() => {
    const z = { pass: 0, passTr: 0, passKrank: 0, trab: 0, trabTr: 0, blind: 0 };
    for (let i = 0; i < 1500; i++) { const P = neuesPferd({ rasse: 'standardbred', geschlecht: 'Stute', alter: 6, name: 'S' + i }); P.werte = P.werte || erzeugeWerte(P); delete P.erb;
      const n = erbVon(P).csnb, pass = P.werte.gang && P.werte.gang.pass != null;
      if (pass) { z.pass++; if (n >= 1) z.passTr++; if (n === 2) z.passKrank++; } else { z.trab++; if (n) z.trabTr++; }
      if (n === 2 && nachtblind(P)) z.blind++; }
    return z; });
  ok('Passgänger: etwa 5 % Träger (v1050, Dome R7)', r.pass > 200 && r.passTr / r.pass > 0.02 && r.passTr / r.pass < 0.1, JSON.stringify(r));
  ok('Passgänger: reinerbig Betroffene (seit v1050 sehr selten) sind alle nachtblind', r.passKrank <= 8 && r.blind === r.passKrank, JSON.stringify(r));
  ok('Standardbred-Traber: kein CSNB2', r.trab > 200 && r.trabTr === 0, JSON.stringify(r));
  r = await pg.evaluate(() => { const H = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 6, name: 'H' }); const e = erbVon(H);
    const alt = neuesPferd({ rasse: 'standardbred', geschlecht: 'Stute', alter: 6, name: 'Alt' }); alt.werte = alt.werte || erzeugeWerte(alt); alt.erb = { wffs: 0 }; const ea = erbVon(alt);
    return { h: e.csnb, alt: ea.csnb != null && ea.wffs === 0, cr: RASSE_GENE.standardbred.Cr, sw: RASSE_GENE.oldenburger.Sw, test: erbTestKrankheiten(alt).includes('csnb'), info: /CSNB2/.test(LABOR_TESTS.krank.info) }; });
  ok('Hannoveraner frei, alte Spielstände bekommen CSNB2 nachgetragen', r.h === 0 && r.alt, JSON.stringify(r));
  ok('Werte: Standardbred Cr 0,013, Oldenburger Sw 0,016', r.cr === 0.013 && r.sw === 0.016, JSON.stringify(r));
  ok('Erbkrankheiten-Test prüft CSNB2 beim Standardbred', r.test && r.info, JSON.stringify(r));
  // Labor-Ergebnis (Text im Steckbrief)
  r = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'standardbred', geschlecht: 'Stute', alter: 6, name: 'Lab' }); P.werte = P.werte || erzeugeWerte(P); P.erb = null; erbVon(P); P.erb.csnb = 1;
    return /CSNB2/.test(erbErgebnisHTML(P)) && /Träger/.test(erbErgebnisHTML(P)); });
  ok('Labor-Ergebnis zeigt CSNB2-Träger', r);
  r = await pg.evaluate(() => { let n = 0; for (let i = 0; i < 20000; i++) if (allel('standardbred', 'Cr', Math.random) === GEN.Cr[2]) n++; return n; });
  ok('Standardbred: Cream-Allel etwa 1,3 % (Ziehung je Allel)', r > 150 && r < 380, String(r));
  ok('Keine Fehler in der Konsole', errs.length === 0, errs.join(' | '));
  console.log(L.join('\n')); const rot = L.filter(z => z.startsWith('✗')).length; console.log(rot ? `${rot} rot` : 'alles grün'); await b.close(); process.exit(rot ? 1 : 0);
})();
