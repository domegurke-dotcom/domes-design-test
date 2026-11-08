// v999 (Dome 8.11.): junge Schimmel (unter 30 % Ausschimmelung) hatten den alten Maulfleck am Kinn – auf Domes Kopf kommt stattdessen ihre Ebene „graumaul“ an die Nase
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.admin = true;
    const mk = W => { let P; for (let i = 0; i < 3000; i++) { P = neuesPferd({ rasse: 'andalusier', geschlecht: 'Stute', alter: 1, name: 'A' }); if (hat(genVon(P), 'G') && P.farbe === 'fuchs') break; }
      P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.ex = P.ex || {}; P.ex.grauTempo = W; P.ex.kurve = 0; P.ex.maehne = 0; return P; };
    const F = KOPF_NEU.formen, d = f => ((F[f].maul.dunkel.match(/ d="([^"]{25})/) || [])[1] || '').trim();
    [[2, 'ca. 30 % grau'], [3.5, 'wenig grau'], [1.2, '50 % grau']].forEach(([W, n]) => { const P = mk(W), st = grauStand(P), svg = ganzBild(P), f = kopfKey(P.kopf);
      ok(`Schimmel ${n} (t ${st.t.toFixed(2)}): kein alter Maulfleck am Kinn`, !/<ellipse[^>]*filter="url\(#wm-/.test(svg));
      if (st.t >= 0.02) ok(`Schimmel ${n}: Domes Graumaul gezeichnet`, d(f) && svg.includes(d(f)), f + ' ' + d(f)); });
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
