// v998 (Dome 8.11.): Whiteboard-Übersicht zeigt bei „Weiden“ Auffälligkeiten (Pferd steht nicht, wo es laut Plan soll) wie bei „Boxen“: „⚠️ Noch offen (n)“ mit Liste
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0), B = mk('Berta', 1); A.weidegang = 'nie'; B.weidegang = 'nie';
    const weidenKarte = () => { wbSicht = 'uebersicht'; wbWahl = null; zeigeWhiteboard(); const k = document.querySelector('.wb-vorschau[data-wbsicht="weiden"]'); return { offen: k ? k.querySelector('.wb-offen') : null, text: k ? k.textContent.replace(/\s+/g, ' ') : '' }; };
    let r = weidenKarte(); ok('Alles in Ordnung: keine Liste „Noch offen“ bei Weiden', !r.offen, r.text.slice(0, 120));
    // Anna steht auf der Weide, soll laut Plan aber in der Box bleiben
    A.weide = { wid: 'w1', seit: spiel.tag }; r = weidenKarte(); ok('Auffälligkeit: Anna steht draußen, soll laut Plan in die Box → „⚠️ Noch offen (1)“ bei Weiden', !!r.offen && /Noch offen \(1\)/.test(r.text) && /Anna/.test(r.text) && /Plan/.test(r.text), r.text.slice(0, 300));
    B.weide = { wid: 'w1', seit: spiel.tag }; r = weidenKarte(); ok('Zweites Pferd draußen: „Noch offen (2)“', /Noch offen \(2\)/.test(r.text), r.text.slice(0, 200));
    // dieselbe Darstellung wie bei Boxen (gleiche Klasse wb-offen, gleiche Überschrift)
    const boxk = document.querySelector('.wb-vorschau[data-wbsicht="boxen"] .wb-offen'); const weidk = document.querySelector('.wb-vorschau[data-wbsicht="weiden"] .wb-offen'); ok('Gleiches Aussehen wie bei Boxen (Klasse und Überschrift)', !!weidk && (!boxk || boxk.className === weidk.className) && /^⚠️ Noch offen/.test(weidk.textContent.trim()));
    delete A.weide; delete B.weide; r = weidenKarte(); ok('Wieder in Ordnung: Liste verschwindet', !r.offen);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
