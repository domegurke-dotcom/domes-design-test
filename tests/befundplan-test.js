// v685: Plan des Tierarztes in der Versorgung – heilt nicht mehr / Reiten möglich / Bewegung / Verbote
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/befundplan-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; $('dlg').hidden = true; VET.verbotAb = 99;
    const mk = n => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.befunde = []; return P; };
    const bef = (P, art, grad = 2) => { const x = { id: 'b' + Math.random().toString(36).slice(2, 6), art, grad, gradMax: grad, seit: spiel.tag, bemerkt: { von: 'du', tag: spiel.tag }, meldungen: [], diagnose: spiel.tag, tierarzt: true, geklaert: true }; P.befunde.push(x); return x; };
    const A = mk('Arthra'), S = mk('Sehna'), G = mk('Gesunda');
    bef(A, 'arthrose'); bef(S, 'sehne', 3);
    ok('Arthrose: Reiten möglich', reitenUrteil(A, bekannteBefunde(A)).stufe === 'ja');
    ok('Sehne: nicht reiten', reitenUrteil(S, bekannteBefunde(S)).stufe === 'nein');
    spiel.boxen[0].pferd = A; spiel.boxen[1] = spiel.boxen[1] || { pferd: null }; spiel.boxen[1].pferd = S;
    const hA = befundPlanHTML(A), hS = befundPlanHTML(S);
    ok('Arthrose: „heilt nicht mehr ganz“ und „Reiten ist möglich“', /heilt nicht mehr ganz/.test(hA) && /Reiten ist möglich/.test(hA));
    ok('Sehne: „Nicht reiten“, Verbote genannt, Heilungsdauer', /Nicht reiten/.test(hS) && /nicht:/.test(hS) && /⏳/.test(hS) && !/heilt nicht mehr ganz/.test(hS));
    ok('Plan nennt tägliche Behandlung', /Jeden Tag:/.test(hS));
    ok('Gesundes Pferd: keine Karte', befundPlanHTML(G) === '');
    aktBox = 0; spiel.aktBox = 0; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeStall(); zeigeAkte();
    ok('Karte erscheint in der Versorgung', !!document.querySelector('.plan-karte'));
    return out; });
  if (ORD) { await pg.evaluate(() => { const x = document.querySelector('.plan-karte'); if (x) x.scrollIntoView({ block: 'center' }); }); await pg.waitForTimeout(200); await pg.screenshot({ path: ORD + `/befundplan-${W}x${H}.png` }); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
