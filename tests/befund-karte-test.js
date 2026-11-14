// v980 (Dome 8.11., Aufnahme 22): Karte „Befund“ oben im Reiter Gesundheit – seit wann krank, Einschätzung, Dauer (bei Verdacht keine Dauer)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1464, height: 691 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; VET.verbotAb = 99;
    const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name: 'Bruno' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P; spiel.tag += 5;
    ok('Ohne Befund keine Karte', befundInfoKarte(P) === '');
    const bf = befundNeu(P, 'sehne', 1, 'Test', 'du'); bf.seit = spiel.tag - 3; bf.diagnose = spiel.tag - 1; bf.tierarzt = true; ok('Sehne ist ein Verdachtsfall', !!verdachtVon(P, bf));
    let k = strip(befundInfoKarte(P)); ok('Karte: Name, „krank seit 3 Tagen“, Schweregrad leicht', /Befund: Lahmheit (vorne|hinten)/.test(k) && /krank seit 3 Tagen/.test(k) && /leicht/.test(k), k);
    ok('Verdacht: Einschätzung mit Ursachen und Test, keine Dauer', /nicht sicher|Mögliche Ursachen|Untersuchung Schritt für Schritt/.test(k) && /Dauer: noch nicht zu sagen/.test(k) && !/Bei richtiger Behandlung/.test(k), k);
    ok('Karte steht oben im Reiter Gesundheit (befundKarten)', befundKarten(P, spiel.boxen[0]).trim().startsWith('<div class="bf-karte') && strip(befundKarten(P, spiel.boxen[0])).trim().startsWith('🩺 Befund'));
    P.befunde = []; const b2 = befundNeu(P, 'verletzung', 2, 'Test', 'du'); b2.seit = spiel.tag - 2; b2.diagnose = spiel.tag; b2.tierarzt = true; ok('Verletzung ist eindeutig', !verdachtVon(P, b2));
    k = strip(befundInfoKarte(P)); ok('Eindeutig: Tierarzt-Einschätzung „mittel“ und Dauer „Bei richtiger Behandlung dauert das …“', /stuft es als mittel ein/.test(k) && /Dauer: Bei richtiger Behandlung dauert das/.test(k) && /krank seit 2 Tagen/.test(k), k);
    b2.tierarzt = false; k = strip(befundInfoKarte(P)); ok('Ohne Tierarzt: kein Dauer-Versprechen', /Noch kein Tierarzt/.test(k) && /erst nach einer Untersuchung/.test(k), k);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
