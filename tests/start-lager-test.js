// v957 (Dome 8.11.): das Heu- und Strohlager ersetzt das Start-Lager (aufwertbar) – immer nur ein Lager im Hofplan
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x)); const zu = () => { document.getElementById('dlg').hidden = true; };
    zu(); spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 100000; speicherSperre = true;
    const gl = gebaeude().find(g => g.typ === 'grundlager'); ok('Start-Lager vorhanden', !!gl); const pos0 = JSON.stringify(hofPlan().pos[gl.gid]); ok('… steht im Hofplan', !!hofPlan().pos[gl.gid]);
    ok('Lager baubar (Sperre leer)', bauSperre('lager') === '', bauSperre('lager'));
    ok('Lager bauen', bauStarten('lager', 1)); zu(); const L = bauLetzt;
    ok('Start-Lager ist weg, nur ein Lager im Bau', !gebaeude().some(g => g.typ === 'grundlager') && gebaeude().filter(g => g.typ === 'lager').length === 1);
    ok('Neues Lager steht an derselben Stelle', JSON.stringify(hofPlan().pos[L.gid]) === pos0, JSON.stringify(hofPlan().pos[L.gid]) + ' ≠ ' + pos0);
    ok('Plan hat nur noch ein Lager', planItems().filter(i => i.typ === 'lager' || i.typ === 'grundlager').length === 1);
    ok('Während des Baus bleiben es 2.000 kg', futterkammer().lagerMax === 2000, futterkammer().lagerMax);
    L.bau.rest = 1; naechsteNacht(); zu(); ok('Fertig: 6.000 kg (2.000 + 4.000)', !L.bau && futterkammer().lagerMax === 6000, futterkammer().lagerMax + ' ' + JSON.stringify(L.bau));
    ok('Danach weiterhin nur ein Lager', gebaeude().filter(g => g.typ === 'lager' || g.typ === 'grundlager').length === 1);
    // Altstand: beide vorhanden → Start-Lager entfällt
    spiel.gebaeude.push({ gid: 'gx', typ: 'grundlager', stufe: 1, zustand: 100, preis: 0 }); gebaeude(); ok('Altstand mit beiden: Start-Lager entfällt', !spiel.gebaeude.some(g => g.typ === 'grundlager'));
    // Abriss: Start-Lager kommt zurück
    abrissFertig(L); ok('Nach dem Abriss gibt es wieder ein Start-Lager', spiel.gebaeude.some(g => g.typ === 'grundlager') && futterkammer().lagerMax === 2000, futterkammer().lagerMax);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
