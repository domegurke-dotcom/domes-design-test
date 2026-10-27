// Mitarbeiter S6 (v867, PLAN-MITARBEITER.md): Azubi – nur im Sommer, Ausbilder wählen/Faktor, 3 Jahre Lernen (Zielwerte), Mitlaufen ab morgen, Pflicht-Lehrgang, Berufsschule, Urlaub nur im Sommer
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s6-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 50000; VET.verbotAb = 99;
    const A = maErgaenzen({ id: 'mA', typ: 'pferdewirtHS', name: 'Anna', wissen: wissenStart(35, { haut: 50, verhalten: 50, futter: 50 }), eig: [], gehalt: 340, ab: 0, bis: null });
    const B2 = maErgaenzen({ id: 'mB', typ: 'pfleger', name: 'Bert', wissen: wissenStart(35, {}), eig: [], gehalt: 330, ab: 0, bis: null });
    spiel.mitarbeiter = [A];
    // nur im Sommer
    while (datum().s !== 0) { naechsteNacht(); document.getElementById('dlg').hidden = true; } spiel.bewerber = null; R.fruehling = bewerber('azubi').length; while (datum().s !== 1) { naechsteNacht(); document.getElementById('dlg').hidden = true; } spiel.bewerber = null; R.sommer = bewerber('azubi').length;
    R.passt = ausbilderPasst({ fach: 'haltung' }, A) && !ausbilderPasst({ fach: 'haltung' }, B2);
    // Lernen 3 Jahre (ohne Lehrgänge/Schule), Tempo 4/7/10
    const sim = (tempo, ausb) => { const alt = spiel.tempo; spiel.tempo = tempo; const z = maErgaenzen({ id: 'zT', typ: 'azubi', name: 'Zoe', wissen: wissenStart(5, {}), eig: [], gehalt: 100, ab: jzJetzt(), bis: null, fach: 'haltung', ausbilder: ausb.id }); spiel.mitarbeiter = [ausb, z];
      const j0 = jzJetzt(), tage = 12 * tpj(); for (let d = 0; d < tage; d++) { z.ab = j0 - Math.floor(d / tpj()); azubiLernTag(z); } spiel.tempo = alt; maMeld = []; return z.wissen; };
    const w = sim(7, A); R.fach = ['futter', 'klima', 'haut', 'verhalten'].map(k => Math.round(w[k])); R.rest = ['huf', 'zucht', 'ruecken'].map(k => Math.round(w[k]));
    R.tempi = [4, 10].map(t => Math.round(sim(t, A).haut)); R.tempo7 = Math.round(w.haut);
    const wu = sim(7, B2); R.unpassend = Math.round(wu.haut);
    // Mitlaufen ab morgen
    const z = maErgaenzen({ id: 'zM', typ: 'azubi', name: 'Mia', wissen: wissenStart(5, {}), eig: [], gehalt: 100, ab: jzJetzt(), bis: null, fach: 'haltung', ausbilder: 'mA' }); spiel.mitarbeiter = [A, z];
    z.einsatzNeu = { e: 'mitlaufen', ab: spiel.tag + 1 }; R.heute = z.einsatz || 'stall'; naechsteNacht(); document.getElementById('dlg').hidden = true; R.morgen = z.einsatz; R.imStall = azubiPasst(z, 'stall') || azubiPasst(z, 'pfleger');
    // Pflicht-Lehrgang + Schule
    delete z.einsatz; z.pflicht = {}; delete z.kurs; azubiPflichtUndSchule(); R.pflicht = !!(z.kurs && z.kurs.pflicht);
    while (datum().s !== 3) { naechsteNacht(); document.getElementById('dlg').hidden = true; } R.schule = !!(z.schule && z.schule.jz === jzJetzt()); R.schuleBrief = spiel.post.some(x => /Berufsschule/.test(x.betreff));
    const h0 = z.wissen.huf; z.schule = { tag: spiel.tag - 3, jz: jzJetzt() }; azubiMorgen(); R.schulePlus = Math.round((z.wissen.huf - h0) * 10) / 10;
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Azubi-Bewerbungen nur im Sommer', R.fruehling === 0 && R.sommer > 0, `${R.fruehling}/${R.sommer}`); ok('passender Ausbilder: Pferdewirt HS für Haltung, Pfleger nicht', R.passt);
  ok('nach 3 Jahren Fachrichtung mit Berufsschule 35–45 (dazu je ein Pflicht-Lehrgang +10 → 40–50)', R.fach.every(v => v + 6 >= 35 && v + 6 <= 46), R.fach.join('/'));
  ok('übrige Bereiche etwa 15–20 (mit Schule)', R.rest.every(v => v + 6 >= 12 && v + 6 <= 22), R.rest.join('/'));
  ok('Tempo 4/7/10 gleich', Math.abs(R.tempi[0] - R.tempo7) <= 2 && Math.abs(R.tempi[1] - R.tempo7) <= 2, `${R.tempi[0]}/${R.tempo7}/${R.tempi[1]}`);
  ok('unpassender Ausbilder: langsamer', R.unpassend < R.tempo7, `${R.unpassend} < ${R.tempo7}`);
  ok('Mitlaufen gilt ab morgen, dann nicht im Stall', R.heute === 'stall' && R.morgen === 'mitlaufen' && !R.imStall, `${R.heute} → ${R.morgen}`);
  ok('Pflicht-Lehrgang angemeldet', R.pflicht); ok('Berufsschule im Winter mit Brief', R.schule && R.schuleBrief); ok('Berufsschule +2', R.schulePlus === 2, R.schulePlus);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
