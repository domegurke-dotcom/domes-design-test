// Raritäten-Markt-Test (R2/R3, PLAN-RARITAETEN.md): Öffnung im Sommer, Angebot je Rasse, Abwechslung im Folgejahr, Jahreskarte, Brief, Preise, Auktion mit Zuschlag
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/raritaeten-test.js [Ordner für Bildschirmfotos]
const { chromium } = require('playwright'); const path = require('path');
const ORDNER = process.argv[2];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const A = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true;
    const zu = rarOffen(); const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    while (datum().s !== 1 || datum().t !== 1) nacht();
    const L = rarAngebot(), st = [0, 0, 0, 0, 0, 0]; L.forEach(h => st[h.rarStufe]++);
    const je = {}; L.forEach(h => je[h.rasse] = (je[h.rasse] || 0) + 1);
    const bad = L.filter(h => h.geschlecht === 'Wallach' || alterJahre(h) < 6 || alterJahre(h) > 8 || reinAnteil(h.anteile, h.rasse) < 99);
    const gleich = JSON.stringify(rarAngebot().map(h => [h.id, h.name, h.farbe, h.preis])) === (rarCache = null, JSON.stringify(rarAngebot().map(h => [h.id, h.name, h.farbe, h.preis])));
    const ausb = L.filter(h => (h.erfolge || []).some(e => e.stufe === 4 && e.platz === 1));
    const preisOk = L.every(h => { const S = seltenheit(h, true), i = Math.max(1, Math.min(3, S.stufe)) - 1; return h.preis >= RAR.mindest[i] + testWert(h) - 50; });
    const wahl1 = JSON.stringify(spiel.rar.wahl), namen1 = L.map(h => h.name).join();
    return { zu, n: L.length, rassen: Object.keys(je).length, alle2: Object.values(je).every(x => x === 2), st, bad: bad.length, haf: L.filter(h => h.rasse === 'haflinger').every(h => h.rarArt === 'leist'), gleich,
      brief: spiel.post.filter(x => /Raritäten-Markt .* ist eröffnet/.test(x.betreff)).length, groesse: JSON.stringify(spiel.rar).length, ausb: ausb.length, ausbOk: ausb.every(h => seltenheit(h, true).leist), preisOk, wahl1, namen1, tests: L.every(h => h.tests.farbe && h.tests.abst && h.tests.krank) };
  });
  ok('Vor dem ersten Sommer geschlossen', !A.zu); ok('Je Rasse 2 Pferde', A.alle2 && A.n === A.rassen * 2, A.n + ' Pferde, ' + A.rassen + ' Rassen');
  ok('6–8 Jahre, kein Wallach, reinrassig', A.bad === 0); ok('Haflinger nur Leistung', A.haf); ok('Alle mindestens selten', A.st[0] === 0, JSON.stringify(A.st));
  ok('Immer dieselben Pferde (aus dem Zufall erzeugt)', A.gleich); ok('Spielstand wächst kaum (spiel.rar)', A.groesse < 3000, A.groesse + ' Zeichen');
  ok('Einladungsbrief', A.brief === 1); ok('Tests Fellfarbe/Abstammung/Erbkrankheiten', A.tests); ok('Preise ≥ Mindestpreis + Tests', A.preisOk);
  ok('Ausbildungs-Raritäten mit echten S-Siegen in der Turnierliste', A.ausbOk, A.ausb + ' Pferde');
  // Oberfläche: Jahreskarte, Liste, Bieten
  await pg.evaluate(() => { spiel.geld = 200000; zeigeMarkt('raritaeten'); }); await pg.waitForTimeout(300);
  ok('Vor der Jahreskarte keine Pferde', await pg.evaluate(() => !document.querySelector('#nebenSchirm .paar-liste') && !!document.getElementById('rarKarte')));
  const g0 = await pg.evaluate(() => spiel.geld); await pg.click('#rarKarte'); await pg.waitForTimeout(300);
  const g1 = await pg.evaluate(() => spiel.geld); ok('Jahreskarte kostet 25 €', g0 - g1 === 25, String(g0 - g1));
  ok('Liste mit Pferden und Kontinent-Knöpfen', await pg.evaluate(() => document.querySelectorAll('#nebenSchirm .paar').length >= 50 && !!document.querySelector('#nebenSchirm [data-sortseg]')));
  await pg.evaluate(() => zeigeMarkt('raritaeten')); await pg.waitForTimeout(200);
  ok('Jahreskarte nur einmal je Marktjahr', await pg.evaluate(g => spiel.geld === g, g1));
  if (ORDNER) for (const [n, w, h] of [['pc', 1366, 768], ['quer', 844, 390], ['hoch', 390, 844]]) { await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(250); await pg.screenshot({ path: `${ORDNER}/markt-${n}.png` }); }
  // Pferd mit Overo/Leopard/W (falls vorhanden) sonst das erste ansehen
  const idx = await pg.evaluate(() => { const L = [...document.querySelectorAll('#nebenSchirm .paar')]; const i = L.findIndex(x => /Overo|Tiger|Schabracke|Dominant|Weiß/.test(x.textContent)); return i < 0 ? 0 : i; });
  await pg.evaluate(i => document.querySelectorAll('#nebenSchirm .paar')[i].click(), idx); await pg.waitForTimeout(400);
  const Z = await pg.evaluate(() => ({ txt: document.getElementById('dlgInhalt').textContent, bieten: [...document.querySelectorAll('#dlgKnoepfe button')].map(x => x.textContent) }));
  ok('Anpreisung mit Seltenheit und Erbkrankheiten', /Seltenheit/.test(Z.txt) && /Erbkrankheiten \(Test\)/.test(Z.txt), Z.txt.slice(0, 80));
  if (ORDNER) for (const [n, w, h] of [['pc', 1366, 768], ['quer', 844, 390], ['hoch', 390, 844]]) { await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(250); await pg.screenshot({ path: `${ORDNER}/anpreisung-${n}.png` }); }
  await pg.setViewportSize({ width: 1366, height: 768 });
  // Bieten über die Oberfläche und Zuschlag zu Beginn der nächsten Jahreszeit
  await pg.evaluate(() => { const b = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Bieten/.test(x.textContent)); b.click(); }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { const b = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /^Bieten/.test(x.textContent)); b.click(); }); await pg.waitForTimeout(200);
  const B = await pg.evaluate(() => { const a = Object.values(spiel.rar.auk || {})[0]; return a ? { fuehrt: a.fuehrt, gebot: a.gebot, pferdGespeichert: JSON.stringify(spiel.rar).includes('"werte"'), id: a.id } : null; });
  ok('Gebot abgegeben, du führst', B && B.fuehrt === 'du', JSON.stringify(B)); ok('Pferd nicht im Spielstand gespeichert', B && !B.pferdGespeichert);
  const C = await pg.evaluate(id => { const vor = spiel.geld, a = spiel.rar.auk[id]; a.max = 0; const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    do nacht(); while (datum().t !== 1);
    const box = spiel.boxen.find(x => x.pferd && x.pferd.id === id); return { im: !!box, quar: box && !!box.quar, bezahlt: Math.round(vor - spiel.geld), gebot: a.gebot, weg: spiel.rar.weg.includes(id), brief: spiel.post.some(x => /^Zuschlag/.test(x.betreff)),
      fin: Object.values(spiel.finanzSaison || {}).some(J => Object.values(J).some(S => Object.keys(S).some(k => /^Raritäten-Markt: /.test(k) && !/Eintritt/.test(k)))) }; }, B.id);
  ok('Zuschlag: Pferd im Stall', C.im, JSON.stringify(C)); ok('Bezahlt und gebucht (Finanzen „Raritäten-Markt: …“)', C.fin && C.bezahlt >= C.gebot * 0.9); ok('Aus dem Angebot verschwunden', C.weg); ok('Brief „Zuschlag“', C.brief);
  // Folgejahr: neue Pferde, anderes Hauptmerkmal je Rasse
  const F = await pg.evaluate(w1 => { const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    let n = 0; do { nacht(); n++; } while (!(datum().s === 1 && datum().t === 1) && n < 200);
    const W1 = JSON.parse(w1), W2 = spiel.rar.wahl, gleich = Object.keys(W2).filter(r => W1[r] && [].concat(W2[r]).some(k => [].concat(W1[r]).includes(k)) && rarGenotypen(r, false).length > 2);
    return { mj: spiel.rar.mj, karte: spiel.rar.karte, gleich, namen: rarAngebot().map(h => h.name).join() }; }, A.wahl1);
  ok('Neues Marktjahr: Jahreskarte neu nötig', F.karte === false); ok('Anderes Hauptmerkmal als im Vorjahr', F.gleich.length === 0, F.gleich.join(',')); ok('Neue Pferde', F.namen !== A.namen1);
  console.log(out.join('\n')); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
