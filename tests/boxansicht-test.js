// B1 (PLAN-BOXANSICHT.md, Dome 24.10.): Boxansicht neu am PC – runde Symbole am Rand, Ringe in der Kopfleiste, Plaketten neben dem Boxschild, Denkblase
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/boxansicht-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const start = async (w, h) => { const pg = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.errs = errs; if (process.env.PCZOOM) await pg.addInitScript(() => localStorage.setItem('zuchtstall-pczoom', '1'));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = true; spiel.spieler.stufe = 'anf';
      const p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Flocke' }); p.pflege = erzeugePflege(p); spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); });
    await pg.waitForTimeout(400); return pg; };
  const pg = await start(W, H);
  const lage = () => pg.evaluate(() => { const R = e => { const q = e.getBoundingClientRect(); return { l: q.left, t: q.top, r: q.right, b: q.bottom }; }, ueber = (a, c) => a.l < c.r && c.l < a.r && a.t < c.b && c.t < a.b;
    const sym = [...document.querySelectorAll('#boxUI .bxs')], chips = [...document.querySelectorAll('#boxUI .bxchip')], schild = R(document.getElementById('boxSchild').parentElement || document.getElementById('boxSchild'));
    const pfeile = ['pfeilWeiter', 'pfeilZurueck'].map(id => document.getElementById(id)).filter(x => x && x.style.display !== 'none').map(R), pferd = (() => { const g = document.getElementById('pferdKoerper') || document.getElementById('pferdPlatz'), A = { l: 1e9, t: 1e9, r: -1e9, b: -1e9 };
      g.querySelectorAll('path, ellipse, circle, polygon').forEach(el => { if (el.closest('defs, clipPath, mask, pattern')) return; const f = el.getAttribute('fill'); if (f === 'none' || el.getAttribute('fill-opacity') === '0') return; const q = el.getBoundingClientRect(); if (q.width < 2 || q.width > innerWidth * 0.8) return; A.l = Math.min(A.l, q.left); A.t = Math.min(A.t, q.top); A.r = Math.max(A.r, q.right); A.b = Math.max(A.b, q.bottom); }); return A; })();
    return { an: document.body.classList.contains('boxneu'), sym: sym.map(x => x.dataset.bx), ringe: [...document.querySelectorAll('#kopfRinge .kring b')].map(x => x.textContent),
      chips: chips.map(x => x.textContent), denk: (document.querySelector('.bxdenk') || {}).textContent || '',
      aufPfeil: sym.some(s => pfeile.some(p => ueber(R(s), p))), aufSchild: [...sym, ...chips].some(s => ueber(R(s), schild)), aufPferd: sym.some(s => ueber(R(s), pferd)), ueberlapp: sym.some((s, i) => sym.some((t, j) => j > i && ueber(R(s), R(t)))) }; });
  let L = await lage();
  ok('PC: neue Boxansicht ist an', L.an, L);
  ok('Anfänger, gesundes Pferd: 6 Symbole, kein Tierarzt', L.sym.length === 6 && !L.sym.includes('tierarzt'), L.sym);
  ok('drei Ringe in der Kopfleiste (Gesund, Wohl, Pflege)', L.ringe.length === 3 && /Gesund/.test(L.ringe[0]) && /Pflege/.test(L.ringe[2]), L.ringe);
  ok('keine Plakette, keine Denkblase beim gesunden Pferd', !L.chips.length && !L.denk, L);
  ok('Symbole liegen nicht auf Pfeil, Schild oder Pferd und überlappen sich nicht', !L.aufPfeil && !L.aufSchild && !L.aufPferd && !L.ueberlapp, L);
  if (ORD) await pg.screenshot({ path: `${ORD}/boxansicht-gesund-${W}x${H}.png` });
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; befundListe(p).push({ id: 'bfT', art: 'husten', grad: 2, seit: spiel.tag, ursache: 'Test', bemerkt: { von: 'du', tag: spiel.tag }, meldungen: [], vermutung: null }); p.pflege.gesundheit = 62; p.boxenruhe = spiel.tag; p.quarantaene = spiel.tag; zeigeStall(); });
  await pg.waitForTimeout(300); L = await lage();
  ok('bemerkter Befund: Tierarzt-Symbol erscheint (auch für Anfänger)', L.sym.includes('tierarzt'), L.sym);
  ok('Plaketten Boxenruhe, Quarantäne (unklarer Befund steht in der Denkblase, nicht doppelt)', !L.chips.some(c => /Befund/.test(c)) && L.chips.some(c => /Boxenruhe/.test(c)) && L.chips.some(c => /Quarantäne/.test(c)), L.chips);
  ok('Denkblase „Mir geht’s nicht gut“ mit Anzeichen', /nicht gut/.test(L.denk), L.denk);
  ok('Gesundheits-Ring zeigt 62 %', /62/.test(L.ringe[0]), L.ringe);
  ok('auch mit Tierarzt: nichts auf Pfeil, Schild, Pferd', !L.aufPfeil && !L.aufSchild && !L.aufPferd && !L.ueberlapp, L);
  if (ORD) await pg.screenshot({ path: `${ORD}/boxansicht-krank-${W}x${H}.png` });
  // Behandlung läuft → keine Denkblase mehr
  await pg.evaluate(() => { const b = spiel.boxen[0].pferd.befunde.find(x => x.id === 'bfT'); b.diagnose = spiel.tag; b.beh = spiel.tag; zeigeStall(); }); await pg.waitForTimeout(200); L = await lage();
  ok('in Behandlung: keine Denkblase, Plakette nennt die Krankheit', !L.denk && L.chips.some(c => /Befund: (?!unklar)/.test(c)), L.chips);
  // Klicks
  await pg.click('#boxUI [data-bx="orte"]'); await pg.waitForTimeout(500);
  let z = await pg.evaluate(() => ({ m: aktenModus, r: aktenReiter, y: scrollY })); ok('Orte öffnet Pferdepflege → Orte (und scrollt hin)', z.m === 'pflege' && z.r === 'platz' && z.y > 100, z);
  await pg.evaluate(() => window.scrollTo(0, 0)); await pg.click('#boxUI [data-bx="steckbrief"]'); await pg.waitForTimeout(500);
  z = await pg.evaluate(() => ({ m: aktenModus, r: aktenReiter })); ok('Steckbrief öffnet den Steckbrief', z.m === 'steckbrief' && z.r === 'steckbrief', z);
  await pg.evaluate(() => window.scrollTo(0, 0)); await pg.click('#boxUI [data-bx="putzen"]'); await pg.waitForTimeout(500);
  z = await pg.evaluate(() => ({ m: aktenModus, r: aktenReiter, putz: putzModus })); ok('Putzen öffnet die Putzkiste', z.m === 'pflege' && z.r === 'ausruestung' && z.putz, z);
  await pg.evaluate(() => window.scrollTo(0, 0)); await pg.click('#boxUI [data-bx="fuettern"]'); await pg.waitForTimeout(400);
  z = await pg.evaluate(() => ({ dlg: !document.getElementById('dlg').hidden, t: document.querySelector('#dlg h3') && document.querySelector('#dlg h3').textContent })); ok('Füttern öffnet „Futter für …“ (Fütterung heute)', z.dlg && /Futter/.test(z.t), z);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  // Menü offen → keine Ringe/Symbole sichtbar
  await pg.evaluate(() => zeigeSchirm('hauptMenue')); await pg.waitForTimeout(300);
  z = await pg.evaluate(() => ({ r: getComputedStyle(document.getElementById('kopfRinge')).display, u: getComputedStyle(document.getElementById('boxUI')).display })); ok('im Hauptmenü sind Ringe und Symbole versteckt', z.r === 'none' && z.u === 'none', z);
  await pg.evaluate(() => zeigeSchirm(null));
  // Pensionspferd: dritter Ring = Besitzerwünsche
  await pg.evaluate(() => { const p = spiel.boxen[0].pferd; p.einsteller = 'ex1'; einstellerListe().push({ eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'weide', leistungen: {}, zufr: 80, stufe: 1, preis: 200 }); zeigeStall(); }); await pg.waitForTimeout(200); L = await lage();
  ok('Pensionspferd: dritter Ring heißt „Besitzer“', /Besitzer/.test(L.ringe[2] || ''), L.ringe);
  ok('keine Seitenfehler (PC)', !pg.errs.length, pg.errs);
  await pg.close();
  // Handy ohne Test-Schalter: unter Playwright bleibt die alte Ansicht (die alten Tests klicken in den Reitern); mit Schalter siehe tests/boxmobil-test.js
  const h = await start(390, 844); const an = await h.evaluate(() => ({ an: document.body.classList.contains('boxneu'), n: document.querySelectorAll('#boxUI .bxs').length }));
  ok('Handy ohne Test-Schalter: alte Ansicht für alte Tests', !an.an && !an.n, an); await h.close();
  // Tutorial: aus
  const t = await start(1366, 768); await t.evaluate(() => { spiel.tutorial = { kap: 0 }; zeigeStall(); }); const ta = await t.evaluate(() => document.body.classList.contains('boxneu'));
  ok('im Tutorial noch aus (Tutorial kommt zuletzt)', !ta); await t.close();
  out.forEach(l => console.log(l)); await b.close(); process.exit(out.some(l => l[0] === '✗') ? 1 : 0); })();
