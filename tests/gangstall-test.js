// Gangpferdestall (v884, Dome 27.10.): Ovalbahn bauen (Klick), Stallart wechseln (Klick), Bedingungen, Vorteile (Nenngeld, Tölt-Tempo), Tölt-Training auf der Ovalbahn
// Start (Domes PC, siehe CLAUDE.md): node tests/gangstall-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : '')); const errs = [];
  for (const [W, H] of [[1366, 768], [844, 390], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: W, height: H } }); pg.on('pageerror', e => errs.push(e.message)); const tag = `${W}×${H}`;
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
    await pg.click('#smNeu'); await pg.waitForTimeout(120); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(120);
    await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(350);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.sparmodus = true; spiel.geld = 400000; VET.verbotAb = 99; while (datum().s === 3) spiel.tag++;
      document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); spiel.hof.bauHa += 2; try { planLandAbgleich(); } catch (e) { } hofBereich = 'bauen'; zeigeHof('hof'); });
    await pg.waitForTimeout(300);
    ok(`${tag}: Ovalbahn als Bau-Kachel vorhanden`, !!(await pg.$('[data-bau="ovalbahn"]')));
    const ob = await pg.$('[data-bau="ovalbahn"]'); if (ob) { await ob.scrollIntoViewIfNeeded(); await ob.click(); await pg.waitForTimeout(400); }
    ok(`${tag}: Bau-Fenster geht auf`, await pg.evaluate(() => !document.getElementById('dlg').hidden));
    // Bau fertig (Hilfswerte), dann Stallart per Klick wechseln
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; if (!gebaeude().some(g => g.typ === 'ovalbahn')) gebaeude().push({ gid: 'gov', typ: 'ovalbahn', stufe: 1, zustand: 100 }); gebaeude().filter(g => g.typ === 'ovalbahn').forEach(g => delete g.bau); spiel.anlage.ovalbahn = true; try { planAutoSetzen(); } catch (e) { } hofBereich = 'uebersicht'; zeigeHof('hof'); });
    await pg.waitForTimeout(300);
    ok(`${tag}: Stallart „Gangpferdestall“ zur Wahl`, !!(await pg.$('[data-stallart="gang"]')));
    await pg.evaluate(() => { document.querySelectorAll('details.bzn-e').forEach(d => d.open = true); const bt = document.querySelector('[data-stallart="gang"]'); if (bt) bt.click(); }); await pg.waitForTimeout(300);
    const w2 = await pg.$('#dlgKnoepfe button'); if (w2) { await w2.click(); await pg.waitForTimeout(400); }
    const R = await pg.evaluate(() => ({ art: spiel.hof.art, bed: stallartBed('gang').map(x => x[1]), vor: vorteil('gang') }));
    ok(`${tag}: Hof ist jetzt Gangpferdestall`, R.art === 'gang', R.art);
    ok(`${tag}: Ovalbahn erfüllt, Pferde und Pferdewirt fehlen noch`, R.bed[0] && !R.bed[1] && !R.bed[2], JSON.stringify(R.bed)); ok(`${tag}: Vorteile gelten in der Schonfrist`, R.vor);
    const R2 = await pg.evaluate(() => {
      const mk = (n, i) => { const p = neuesPferd({ name: n, rasse: 'isi', geschlecht: 'Stute', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); if (p.werte.gang.toelt == null) p.werte.gang.toelt = 6; spiel.boxen[i].pferd = p; return p; };
      while (spiel.boxen.length < 3) spiel.boxen.push({ pferd: null });
      const a = mk('Glodis', 0); mk('Svala', 1); const q = neuesPferd({ name: 'Hanni', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8 }); q.pflege = erzeugePflege(q); q.werte = q.werte || erzeugeWerte(q); werteErgaenzen(q); spiel.boxen[2].pferd = q;
      return { bed: stallartBed('gang').map(x => x[1]), gp: gangpferd(a), gq: gangpferd(q) }; });
    ok(`${tag}: Isländer mit Tölt zählen als Gangpferd, Hannoveraner nicht`, R2.gp && !R2.gq);
    ok(`${tag}: 2 Gangpferde erfüllen die zweite Bedingung`, R2.bed[1] === true);
    const N = await pg.evaluate(() => { const P = { disz: 'toelt', nenn: 20, stufe: 1 }, hof = spiel.hof; const mit = nenngeld({}, P); hof.artVerloren = true; const ohne = nenngeld({}, P); delete hof.artVerloren; return { mit, ohne }; });
    ok(`${tag}: Nenngeld Tölt halbiert (20 → 10)`, N.mit === 10 && N.ohne === 20, JSON.stringify(N));
    const T = await pg.evaluate(() => ({ typOk: MA_TYP.westerntrainer.staelle.includes('gang'), wo: UEBUNG.toeltarbeit.wo, wo2: UEBUNG.passtraining.wo, ort: uebOrt('toeltarbeit') }));
    ok(`${tag}: Pferdewirt Spezialreitweisen auch im Gangpferdestall einstellbar`, T.typOk); ok(`${tag}: Tölt- und Passtraining zuerst auf der Ovalbahn`, T.wo === 'gang' && T.wo2 === 'gang' && T.ort === 'ovalbahn', T.ort);
    const F = await pg.evaluate(() => { const p = spiel.boxen[0].pferd; UEBUNG.toeltarbeit.gangP = 0.3;   /* groß, damit die Rundung auf 2 Stellen nicht stört */ const nz = () => { p.gangToelt = 0; for (let i = 0; i < 1; i++) { p.energie = energieMax(p); p.trainHeute = null; trainieren(p, 'toeltarbeit', 'ovalbahn', null); } return p.gangToelt || 0; };
      const mit = nz(); spiel.hof.art = 'zucht'; const ohne = nz(); spiel.hof.art = 'gang'; return { mit, ohne }; });
    ok(`${tag}: Töltarbeit mit Vorteil etwa 20 % schneller`, F.ohne > 0 && Math.abs(F.mit / F.ohne - 1.2) < 0.08, JSON.stringify(F));
    // Trainer wählt für Gangpferd Tölt/Pass, für Nicht-Gangpferd nicht
    const W2 = await pg.evaluate(() => { const g = trainerWahl(spiel.boxen[0].pferd, 'westerntrainer'), q = trainerWahl(spiel.boxen[2].pferd, 'westerntrainer'); return { g, q }; });
    ok(`${tag}: Pferdewirt wählt für das Gangpferd Tölt/Pass`, W2.g.some(k => k === 'toeltarbeit' || k === 'passtraining'), JSON.stringify(W2.g));
    // Trainingsort in der Box
    await pg.evaluate(() => { document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); aktBox = 0; spiel.aktBox = 0; zeigeStall(); zeigeTag(); zeigeAkte(); }); await pg.waitForTimeout(300);
    if (await pg.$('[data-m="pflege"]')) { await (await pg.$('[data-m="pflege"]')).click(); await pg.waitForTimeout(200); }
    if (await pg.$('[data-r="platz"]')) { await (await pg.$('[data-r="platz"]')).click(); await pg.waitForTimeout(200); }
    if (!(await pg.$('[data-ort="training"], [data-okort="training"], [data-ort="tr-ovalbahn"], [data-okort="tr-ovalbahn"]'))) { const o = await pg.$('[data-bx="orte"]'); if (o) { await o.click(); await pg.waitForTimeout(300); } }
    let ov = await pg.$('[data-ort="tr-ovalbahn"], [data-okort="tr-ovalbahn"]');
    if (!ov) { const tk = await pg.$('[data-ort="training"], [data-okort="training"]'); if (tk) { await tk.click({ force: true }); await pg.waitForTimeout(300); } ov = await pg.$('[data-ort="tr-ovalbahn"], [data-okort="tr-ovalbahn"]'); }
    ok(`${tag}: Ovalbahn als Trainingsort anwählbar`, !!ov);
    if (ov) { await ov.click({ force: true }); await pg.waitForTimeout(350); ok(`${tag}: Ovalbahn zeigt Töltarbeit`, await pg.evaluate(() => /Tölt/i.test(document.body.innerText))); }
    await pg.close();
  }
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
