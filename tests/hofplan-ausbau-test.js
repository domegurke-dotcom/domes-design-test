// v959 (Dome 8.11., Aufnahme 16): Ausbau und Anbau im Hofplan nach dem Verschieben (Ziehen) – bei ALLEN Gebäuden: Bestätigen (Haken im Kreis) muss weiter gehen. Je Gebäude/Stufe ein frisches Spiel.
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; let bad = 0, n = 0;
  const neuSpiel = async () => { const pg = await b.newPage({ viewport: { width: 1464, height: 691 } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(350);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(200); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Plan'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(200); return pg; };
  const p0 = await neuSpiel(); const typen = await p0.evaluate(() => Object.keys(BAUTEN).filter(t => planTyp(t))); await p0.close();
  console.log('Gebäudetypen im Hofplan:', typen.join(', '));
  const ziehen = async (pg, gid) => { const el = await pg.$(`#planSvg [data-pit="${gid}"]`); if (!el) return false; const bb = await el.boundingBox(); await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await pg.mouse.down(); await pg.waitForTimeout(250); await pg.mouse.move(bb.x + bb.width / 2 + 40, bb.y + bb.height / 2 + 20, { steps: 5 }); await pg.waitForTimeout(100); await pg.mouse.up(); await pg.waitForTimeout(250); return true; };
  const frisch = (pg, typ, stufe, gid) => pg.evaluate(([typ, stufe, gid]) => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 1e8; VET.verbotAb = 99;
    const alt = gebaeude().filter(x => x.typ === typ); alt.forEach(a => gebaeude().splice(gebaeude().indexOf(a), 1)); const B = BAUTEN[typ], g = { gid, typ, stufe, zustand: 100 }; if (B.jeBox) g.boxen = B.boxen || B.schritt || 1; gebaeude().push(g);
    planAutoSetzen(); Object.keys(hofPlan().pos).forEach(k => { if (k !== gid) delete hofPlan().pos[k]; }); zeigeHof('hof'); const t = [...document.querySelectorAll('button')].find(x => /Hofplan/.test(x.textContent) && x.offsetParent); if (t) t.click(); return !!hofPlan().pos[gid]; }, [typ, stufe, gid]);
  const meld = (ok, text, x) => { n++; console.log((ok ? '✓ ' : '✗ ') + text + (ok || !x ? '' : ' – ' + x)); if (!ok) bad++; };
  for (const typ of typen) for (const stufe of [1, 2]) {
    const gid = 'gx_' + typ, pg = await neuSpiel(); if (!(await frisch(pg, typ, stufe, gid))) { console.log('– ' + typ + ' Stufe ' + stufe + ': nicht im Plan setzbar'); await pg.close(); continue; } await pg.waitForTimeout(300);
    const art = await pg.evaluate(([gid]) => { const g = gebaeude().find(x => x.gid === gid); if (umbauSperre(g)) return 'gesperrt'; return planAusbauMitBlaupause(g) ? 'blaupause' : 'direkt'; }, [gid]), name = `${typ} Stufe ${stufe} (Ausbau ${art})`;
    if (art === 'gesperrt') console.log('– ' + typ + ' Stufe ' + stufe + ': Ausbau gesperrt (z. B. höchste Stufe)');
    else if (art === 'blaupause') {
      await pg.evaluate(id => { planWahl = id; planAusbauStart(gebaeude().find(x => x.gid === id)); }, gid); await pg.waitForTimeout(250); await ziehen(pg, gid);
      const z = await pg.evaluate(id => ({ vor: !!planVorschau && planVorschau.id === id, wahl: planWahl === id, ok: !!document.querySelector('[data-pvok]') }), gid); meld(z.vor && z.wahl && z.ok, name + ': nach dem Ziehen bleibt die Blaupause mit Bestätigen-Knopf', JSON.stringify(z));
      const frei = await pg.evaluate(() => { const P = hofPlan(), v = planVorschau, it = planItems().find(x => x.id === v.id), f = planFreiePos(it.l, it.t, v.id); if (f) { P.pos[v.id] = f; v.alt = { ...f }; } planNeu(); return !!f; }); await pg.waitForTimeout(150);
      if (frei) { await pg.evaluate(() => { const k = document.querySelector('[data-pvok]'); if (k) k.click(); }); await pg.waitForTimeout(250); meld(await pg.evaluate(() => !document.getElementById('dlg').hidden), name + ': Bestätigen öffnet den Ausbau-Dialog'); } else console.log('– ' + name + ': kein freier Platz im Testplan');
    } else {
      await pg.evaluate(id => { planWahl = id; planNeu(); }, gid); await ziehen(pg, gid); await pg.evaluate(id => { planWahl = id; planNeu(); }, gid); await pg.waitForTimeout(250);
      const k = await pg.evaluate(() => { const i = [...document.querySelectorAll('.plan-radial .rl')].findIndex(x => /Ausbauen/.test(x.textContent)); if (i < 0) return 'kein Knopf'; document.querySelectorAll('.plan-radial [data-ri]')[i].click(); return 'ok'; }); await pg.waitForTimeout(250);
      if (k !== 'ok') meld(false, name + ': Ausbauen im Kreis nach dem Ziehen', k);
      else { const ok = await pg.evaluate(() => { const o = document.querySelector('.plan-radial [data-vr="ok"]'); if (!o) return false; o.click(); return true; }); await pg.waitForTimeout(250); meld(ok && await pg.evaluate(() => !document.getElementById('dlg').hidden), name + ': Kreis ✔ nach dem Ziehen öffnet den Ausbau-Dialog', ok ? 'Dialog blieb zu' : 'kein ✔ im Kreis'); } }
    // Anbau (nur Gebäude mit Boxen/Platz-Schritten)
    const jeBox = await pg.evaluate(typ => !!BAUTEN[typ].jeBox, typ);
    if (jeBox) { await pg.evaluate(() => { planVorschauEnde(true); planBest = null; planVRad = false; document.getElementById('dlg').hidden = true; planWahl = null; planNeu(); });
      await pg.evaluate(([id, st]) => { planWahl = id; planAnbauStart(gebaeude().find(x => x.gid === id), BAUTEN[gebaeude().find(x => x.gid === id).typ].schritt || 1, st); }, [gid, stufe]); await pg.waitForTimeout(250); await ziehen(pg, gid);
      const z = await pg.evaluate(id => ({ vor: !!planVorschau && planVorschau.id === id, wahl: planWahl === id, ok: !!document.querySelector('[data-pvok]') }), gid); meld(z.vor && z.wahl && z.ok, `${typ} Stufe ${stufe} (Anbau): nach dem Ziehen bleibt die Blaupause mit Bestätigen-Knopf`, JSON.stringify(z)); }
    await pg.close(); }
  console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler', `(${n} Prüfungen)`); await b.close(); process.exit(bad || errs.length ? 1 : 0); })();
