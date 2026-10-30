// Boxansicht mobil (PLAN-BOXANSICHT.md, Dome 25.10.): hochkant Symbolreihe/Balken/Plaketten/Klemmbrett unter dem Bild, quer Symbole am Rand + Ringe,
// Fenster über die ganze Breite, Kreise (Ausrüstung/Steckbrief/Putzkiste), Orte hochkant als Kacheln, Pferd draußen, Klinik/leere Box.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/boxmobil-test.js [BxH] [Ordner]   (Standard 390x844)
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3], HOCH = H > W;
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false;
    const p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Flocke' }); p.pflege = erzeugePflege(p); p.dreck = { fell: 60, maehne: 30 }; spiel.boxen[0].pferd = p; aktBox = 0; spiel.aktBox = 0; zeigeSchirm(null); zeigeStall(); zeigeTag(); });
  await pg.waitForTimeout(500);
  const bild = async n => { if (ORD) await pg.screenshot({ path: `${ORD}/boxmobil-${n}-${W}x${H}.png` }); };
  const klick = async sel => { await pg.click(sel); await pg.waitForTimeout(350); };
  const zust = () => pg.evaluate(() => { const I = document.getElementById('info'), q = I.getBoundingClientRect();
    return { f: bxFenster, ring: bxRing, putz: bxPutz, offen: document.body.classList.contains('infoOffen'), breit: Math.round(q.width), links: Math.round(q.left), oben: Math.round(q.top),
      tabs: [...document.querySelectorAll('#info .vs-tabs button')].map(x => x.dataset.vstab + (x.classList.contains('an') ? '*' : '')), tools: [...document.querySelectorAll('#boxUI .bxtool')].map(x => x.dataset.bxtool || x.dataset.bxring) }; });
  const imBild = async sel => { const raus = await pg.evaluate(s => [...document.querySelectorAll(s)].filter(x => x.offsetParent).filter(x => { const r = x.getBoundingClientRect(); return !(r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1); }).map(x => (x.dataset.bx || x.dataset.bxtool || x.dataset.bxring) + JSON.stringify(x.getBoundingClientRect())), sel); if (raus.length) console.log('außerhalb:', raus.join(' ')); return !raus.length; };
  const ueberlapp = sel => pg.evaluate(s => { const E = [...document.querySelectorAll(s)].filter(x => x.offsetParent), P = [];
    E.forEach((a, i) => E.forEach((c, j) => { if (j <= i) return; const A = a.getBoundingClientRect(), C = c.getBoundingClientRect(), rund = x => /bxs|bxtool/.test(x.className);
      const zu = rund(a) && rund(c) ? Math.hypot(A.x + A.width / 2 - C.x - C.width / 2, A.y + A.height / 2 - C.y - C.height / 2) < (A.width + C.width) / 2 - 2 : A.left < C.right - 2 && C.left < A.right - 2 && A.top < C.bottom - 2 && C.top < A.bottom - 2; if (zu) P.push((a.dataset.bx || a.dataset.bxtool || a.dataset.bxring || a.className) + '/' + (c.dataset.bx || c.dataset.bxtool || c.dataset.bxring || c.className)); })); return P.join(); }, sel);
  ok('Fenster-Modus auf dem Handy an', await pg.evaluate(() => document.body.classList.contains('boxfenster') && document.body.classList.contains('bxmobil')));
  if (HOCH) {
    const z = await pg.evaluate(() => ({ reihe: [...document.querySelectorAll('#bxUnten .bx-reihe [data-bx]')].map(x => x.dataset.bx), balken: [...document.querySelectorAll('#bxUnten .bx-bal')].map(x => x.dataset.vstab), kb: !!document.querySelector('#bxUnten .klemmbrett'),
      ringe: getComputedStyle(document.getElementById('kopfRinge')).display, imBild: document.querySelectorAll('#boxUI .bxs').length, stallUnten: document.getElementById('stall').getBoundingClientRect().bottom, reiheOben: document.querySelector('#bxUnten .bx-reihe').getBoundingClientRect().top }));
    ok('hochkant: Symbolreihe unter dem Bild (Tierarzt, Füttern, Einstreu, Orte, Ausrüstung, Steckbrief)', z.reihe.join() === 'tierarzt,fuettern,einstreu,orte,ausruestung,steckbrief' && z.reiheOben >= z.stallUnten - 1, z);
    ok('hochkant: drei Balken (Gesundheit, Wohlbefinden, Pflege), keine Ringe oben, keine Symbole im Bild', z.balken.join() === 'gesund,heute,heute' && z.ringe === 'none' && z.imBild === 0, z);
    ok('hochkant: Klemmbrett „Flocke · heute“ unter den Balken', z.kb);
    ok('hochkant: Symbolreihe passt in die Breite', await imBild('#bxUnten .bx-reihe .bxs'));
  } else {
    const z = await pg.evaluate(() => ({ sym: [...document.querySelectorAll('#boxUI .bxs')].map(x => x.dataset.bx), ringe: [...document.querySelectorAll('#kopfRinge .kring')].length, unten: document.getElementById('bxUnten').offsetParent }));
    ok('quer: Symbole am Rand, Ringe in der Kopfleiste, nichts unter dem Bild', z.sym.join() === 'tierarzt,fuettern,einstreu,orte,ausruestung,steckbrief' && z.ringe === 3 && !z.unten, z);
    ok('quer: Symbole überdecken sich nicht', !(await ueberlapp('#boxUI .bxs')), await ueberlapp('#boxUI .bxs'));
    ok('quer: Ringe überdecken weder Geld noch Brief/Menü', await pg.evaluate(() => { const R = [...document.querySelectorAll('#kopfRinge .kring')].map(x => x.getBoundingClientRect()), A = ['kontoAnzeige', 'kopfTagEnde'].map(id => document.getElementById(id)).filter(x => x && x.offsetParent).map(x => x.getBoundingClientRect()), m = document.querySelector('header .menue').getBoundingClientRect();
      return R.every(r => A.every(a => r.left >= a.right - 1) && r.right <= m.left - 50); }));
    ok('quer: Symbole im Bild', await imBild('#boxUI .bxs'));
  }
  await bild('start');
  // Versorgung über Balken/Ringe
  await klick(HOCH ? '#bxUnten .bx-bal[data-vstab="gesund"]' : '#kopfRinge [data-vstab="gesund"]'); let z = await zust();
  ok('Gesundheit öffnet Versorgung als Fenster über die ganze Breite unter der Kopfleiste', z.f === 'versorgung' && z.offen && z.breit >= W - 2 && z.links <= 1 && z.tabs.includes('gesund*'), z);
  await bild('versorgung');
  await klick('#info [data-vstab="heute"]'); z = await zust(); ok('Reiter „Heute“ umschalten', z.tabs.includes('heute*'), z);
  await klick('#info .info-zu'); z = await zust(); ok('✕ schließt das Fenster', !z.f && !z.offen, z);
  // Klemmbrett (hochkant in der Hauptansicht)
  if (HOCH) { await klick('#bxUnten .kb-zeile[data-kb="heu"]'); ok('Klemmbrett „Heu“: Heuhaufen leuchtet auf', await pg.evaluate(() => document.querySelectorAll('.bxpuls').length === 1));
    await klick('#bxUnten .kb-zeile[data-kb="putz"]'); z = await zust(); ok('Klemmbrett „Putzen“: Putzkiste mit Werkzeugen im Kreis', z.putz && ['buerste', 'kamm', 'huf', 'streicheln', 'zu'].every(t => z.tools.includes(t)), z);
    await klick('#boxUI [data-bxtool="zu"]'); }
  // Ausrüstung → Kreis → Putzkiste
  await klick(`${HOCH ? '#bxUnten' : '#boxUI'} [data-bx="ausruestung"]`); z = await zust();
  ok('Ausrüstung öffnet den Kreis: Zaumzeug, Putzkiste, Hufschuhe', z.ring === 'ausruestung' && ['zaum', 'putzkiste', 'hufschuhe'].every(t => z.tools.includes(t)), z);
  ok('Kreis-Knöpfe überdecken sich nicht und bleiben im Bild', !(await ueberlapp('#boxUI .bxtool, #boxUI .bxs')) && await imBild('#boxUI .bxtool'), await ueberlapp('#boxUI .bxtool, #boxUI .bxs'));
  await bild('kreis');
  await klick('#boxUI [data-bxring="putzkiste"]'); z = await zust();
  ok('Putzkiste: Werkzeuge im Kreis, kein Fenster', z.putz && !z.offen && ['buerste', 'kamm', 'huf', 'streicheln', 'zu'].every(t => z.tools.includes(t)), z);
  ok('Werkzeuge überdecken sich nicht und bleiben im Bild', !(await ueberlapp('#boxUI .bxtool')) && await imBild('#boxUI .bxtool'), await ueberlapp('#boxUI .bxtool'));
  await klick('#boxUI [data-bxtool="buerste"]');
  ok('Bürste: Wischen läuft, kein Hinweisfeld mehr', await pg.evaluate(() => wisch && wisch.tool === 'buerste' && !document.querySelector('.bxhinweis')));
  await bild('putzen');
  // Wischen mit dem Finger über das Pferd
  const vorher = await pg.evaluate(() => B().pferd.dreck.fell);
  const r = await pg.evaluate(() => { const q = document.getElementById('stall').getBoundingClientRect(); return { x: q.left + q.width * 0.55, y: q.top + q.height * 0.66, w: q.width * 0.6 }; });   // über den Rumpf (Werkzeuge liegen darüber bzw. am Rand)
  const cdp = await pg.context().newCDPSession(pg);
  for (let k = 0; k < 6; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x - r.w * 0.2, y: r.y }] });
    for (let i = 0; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: r.x - r.w * 0.2 + r.w * 0.4 * i / 12, y: r.y + (k % 2 ? 8 : -8) }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  await pg.waitForTimeout(300);
  ok('Wischen mit dem Finger putzt das Fell', await pg.evaluate(v => B().pferd.dreck.fell < v, vorher), { vorher, nachher: await pg.evaluate(() => B().pferd.dreck.fell) });
  await klick('#boxUI [data-bxtool="zu"]'); z = await zust(); ok('✕ schließt die Putzkiste', !z.putz && !z.tools.length, z);
  // Steckbrief-Kreis
  await klick(`${HOCH ? '#bxUnten' : '#boxUI'} [data-bx="steckbrief"]`); z = await zust();
  ok('Steckbrief-Kreis: Daten, Genetik, Merkmale, Ausbildung', ['steckbrief', 'genetik', 'merkmale', 'ausbildung'].every(t => z.tools.includes(t)), z);
  await klick('#boxUI [data-bxring="merkmale"]'); z = await zust(); ok('Merkmale öffnet das Steckbrief-Fenster', z.f === 'steckbrief' && await pg.evaluate(() => aktenReiter === 'merkmale'), z);
  await klick('#info .info-zu');
  // Orte
  await klick(`${HOCH ? '#bxUnten' : '#boxUI'} [data-bx="orte"]`); z = await zust(); ok('Orte öffnet ein Fenster', z.f === 'orte' && z.offen, z);
  if (HOCH) { const k = await pg.evaluate(() => ({ n: document.querySelectorAll('#info .bx-ortk .ok').length, plan: !!document.querySelector('#info .plan-scroll.ort').offsetParent, namen: [...document.querySelectorAll('#info .bx-ortk .ok b')].map(x => x.textContent) }));
    ok('hochkant: Orte als Kacheln statt Karte (Weide dabei)', k.n >= 3 && !k.plan && k.namen.some(n => /Weide/.test(n)), k);
    await bild('orte');
    await pg.evaluate(() => { const b = [...document.querySelectorAll('#info .bx-ortk .ok b')].find(x => /^Weide/.test(x.textContent)); b.closest('button').click(); }); await pg.waitForTimeout(400);
    ok('Kachel „Weide“ wirkt wie der Pfeil im Plan (Pferd auf der Weide oder Rückfrage)', await pg.evaluate(() => !!B().pferd.weide || !document.getElementById('dlg').hidden || /Weide/.test(document.getElementById('info').textContent)));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  } else { ok('quer: Orte zeigt den Hofplan', await pg.isVisible('#info .plan-scroll.ort')); await bild('orte'); }
  await pg.evaluate(() => { bxFensterZu(); }); await pg.waitForTimeout(300);
  // Pferd draußen: Symbole bleiben, Fenster gehen
  await pg.evaluate(() => { const p = B().pferd; if (!p.weide) { p.weide = { seit: spiel.tag, wid: weiden()[0] && weiden()[0].wid }; } zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(400);
  z = await pg.evaluate(() => [...document.querySelectorAll('#bxUnten [data-bx], #boxUI .bxs')].map(x => x.dataset.bx));
  ok('Pferd auf der Weide: Symbole sind da', z.includes('orte') && z.includes('steckbrief'), z);
  await bild('weide');
  await pg.evaluate(() => { delete B().pferd.weide; zeigeStall(); zeigeTag(); });
  // Pensionspferd krank
  await pg.evaluate(() => { const p = B().pferd; p.einsteller = 'ex1'; einstellerListe().push({ eid: 'ex1', vn: 'Ina', nn: 'Test', haltung: 'box', leistungen: {}, zufr: 80, stufe: 1, preis: 200 });
    befundListe(p).push({ id: 'bfT', art: 'husten', grad: 2, seit: spiel.tag, ursache: 'Test', bemerkt: { von: 'du', tag: spiel.tag }, meldungen: [], vermutung: null }); zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(400);
  z = await pg.evaluate(() => ({ denk: !!document.querySelector('#boxUI .bxdenk'), chips: [...document.querySelectorAll('.bxchip')].map(x => x.textContent), drei: document.body.classList.contains('bxhoch') ? [...document.querySelectorAll('#bxUnten .bx-bal')].map(x => x.dataset.vstab).join() : [...document.querySelectorAll('#kopfRinge [data-vstab]')].map(x => x.dataset.vstab).join() }));
  ok('Pensionspferd krank: keine Denkblase (v847), Plakette „Besitzer informieren“, dritter Wert = Besitzer', !z.denk && z.chips.some(c => /Besitzer/.test(c)) && /besitzer$/.test(z.drei), z);
  ok('Plaketten im Bild und ohne Überlappung', await imBild('.bxchip') && !(await ueberlapp('.bxchip, #boxUI .bxs, #boxUI .bxdenk')), await ueberlapp('.bxchip, #boxUI .bxs, #boxUI .bxdenk'));
  await bild('pension-krank');
  await klick(`${HOCH ? '#bxUnten' : '#boxUI'} [data-bx="tierarzt"]`); z = await zust(); ok('Tierarzt öffnet Versorgung · Gesundheit', z.f === 'versorgung' && z.tabs.includes('gesund*') && z.tabs.some(t => t.startsWith('besitzer')), z);
  await klick('#info .info-zu');
  // Klinik und leere Box: alte Ansicht unter dem Bild (dort steht, was geht)
  await pg.evaluate(() => { B().pferd.klinik = { tag: spiel.tag, bis: spiel.tag + 3 }; zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(400);
  ok('Pferd in der Klinik: Inhalt unter dem Bild sichtbar (kein leerer Bildschirm)', await pg.evaluate(() => !document.body.classList.contains('boxfenster') && !!document.getElementById('info').offsetParent && document.getElementById('info').textContent.length > 20));
  await pg.evaluate(() => { delete B().pferd.klinik; spiel.boxen[0].pferd = null; zeigeStall(); zeigeTag(); }); await pg.waitForTimeout(400);
  ok('Leere Box: Inhalt unter dem Bild sichtbar', await pg.evaluate(() => !!document.getElementById('info').offsetParent));
  ok('keine Skriptfehler', !errs.length, errs);
  console.log(`Boxansicht mobil ${W}x${H}`); out.forEach(x => console.log(x)); const f = out.filter(x => x.startsWith('✗')).length; console.log(f ? `${f} ✗` : `alle ${out.length} ✓`);
  await b.close(); process.exit(f ? 1 : 0); })();
