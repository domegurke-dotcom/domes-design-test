// v996 (Dome 8.11.): die Tierarzt-Anfahrt zahlst du nur einmal am Tag – Tierarzt rufen und danach impfen (oder umgekehrt) kostet nur eine Anfahrt
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; spiel.admin = false; Math.random = () => 0.99; spiel.tag = 20;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; P.pflege.impf = 0; spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0), B = mk('Berta', 1), C = mk('Cora', 2), D = mk('Dora', 3);
    const alle = () => ((spiel.post || []).filter(x => x.von === 'Tierarztpraxis')[0] || { text: '' }).text;
    const summe = s => { const i = s.indexOf('zu zahlen'); return i < 0 ? '?' : ((s.slice(i).match(/([0-9.]+) €/) || [])[1] || '?'); };
    const anz = (s, w) => s.split(w).length - 1;
    // 1. Tierarzt rufen, danach impfen
    delete spiel.vetAnfahrt; tierarztBesuch(A, spiel.boxen[0], () => {}, false); document.getElementById('dlg').hidden = true; vorsorge(B, 'impfung'); const t1 = alle();
    ok('Tierarzt gerufen (Hausbesuch 60 €) und danach geimpft (60 €): zusammen 120 €, keine zweite Anfahrt', anz(t1, 'Anna: Hausbesuch und Untersuchung') === 1 && anz(t1, 'Berta: Impfung') === 1 && anz(t1, 'Anfahrt Tierarzt') === 0 && summe(t1) === '120', 'Summe ' + summe(t1) + ' · ' + t1.slice(0, 300));
    // 2. erst impfen, dann Tierarzt rufen
    spiel.tag = 21; delete spiel.vetAnfahrt; vorsorge(C, 'impfung'); tierarztBesuch(D, spiel.boxen[3], () => {}, false); document.getElementById('dlg').hidden = true; const t2 = alle();
    ok('Erst geimpft (Anfahrt 60 + Impfung 60), dann Tierarzt gerufen: Hausbesuch 0 € – Anfahrt nur einmal', anz(t2, 'Anfahrt Tierarzt') === 1 && t2.includes('Dora: Hausbesuch und Untersuchung</td><td>0 €') && t2.includes('Cora: Impfung'), 'Summe ' + summe(t2) + ' · ' + t2.slice(0, 400));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
