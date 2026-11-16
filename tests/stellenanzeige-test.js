// Auftrag 20 Teil M5b-1 (17.11.2026): Stellenanzeige aufgeben → Bewerbungen per Post → Gespräch (3–4 Fragen, Lern-Tipps) → Gehalt → einstellen; Absage nach Warten; Agentur-Gebühr
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/stellenanzeige-test.js [Bilder-Ordner]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2];
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 50000; spiel.mitarbeiter = []; mitarbeiterDialog('stallbursche'); });
  await pg.waitForTimeout(300); if (O) await pg.screenshot({ path: O + '/S1-dialog.png' });
  ok('Mitarbeiter-Fenster: Knopf „Stellenanzeige aufgeben“ und Agentur-Liste', await pg.isVisible('#stelleNeu') && /Personalvermittlung \(Agentur\)/.test(await pg.innerText('#dlgInhalt')));
  /* Anzeige aufgeben: große Anzeige, Gehalt über dem Üblichen */
  await pg.click('#stelleNeu'); await pg.waitForTimeout(250); await pg.check('[name="stMed"][value="zeitungGross"]'); await pg.check('[name="stGeh"][value="mehr"]');
  if (O) await pg.screenshot({ path: O + '/S2-anzeige.png' });
  const g0 = await pg.evaluate(() => spiel.geld); await pg.click('#dlgKnoepfe button[data-txt="Anzeige aufgeben"]'); await pg.waitForTimeout(250);
  let r = await pg.evaluate(() => ({ st: spiel.stellen, geld: spiel.geld }));
  ok('Anzeige läuft, kostet 400 €', r.st && r.st.length === 1 && r.st[0].medium === 'zeitungGross' && r.st[0].geh === 'mehr' && g0 - r.geld === 400, JSON.stringify(r));
  await pg.click('#dlgKnoepfe button').catch(() => {});
  /* Tage vergehen: Bewerbungen kommen */
  r = await pg.evaluate(() => { const vor = (spiel.post || []).length; stellenTag(); const n0 = (spiel.post || []).length - vor; spiel.tag = spiel.stellen[0].ab; stellenTag(); const B = Object.values(spiel.bewerbungen || {});
    return { vorher: n0, n: B.length, briefe: (spiel.post || []).filter(p => p.aktion && p.aktion.typ === 'bewerbung').length, text: ((spiel.post || []).find(p => p.aktion && p.aktion.typ === 'bewerbung') || {}).text || '' }; });
  ok(`vor der Frist keine Bewerbung, danach ${r.n} Bewerbungen als Briefe`, r.vorher === 0 && r.n >= 3 && r.briefe === r.n, JSON.stringify(r).slice(0, 300));
  ok('Bewerbung nennt Erfahrung in Worten, keine Zahlen', /Erfahrung/.test(r.text) && !/\d+ %|\b\d{2}\b\s*\/\s*100/.test(r.text), r.text.slice(0, 200));
  /* Brief öffnen und zum Gespräch einladen (echte Klicks) */
  const br = await pg.evaluate(() => { const p = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'bewerbung'); return p.id; });
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('post'); }); await pg.waitForTimeout(300);   /* echtes Postfach: Brief antippen */
  await pg.click(`[data-brief="${br}"]`); await pg.waitForTimeout(400);
  if (O) await pg.screenshot({ path: O + '/S3-brief.png' });
  await pg.click('[data-baktion="bw-gespraech"]'); await pg.waitForTimeout(250);
  const nFr = await pg.$$eval('[data-gsf]', x => x.length); ok(`Gespräch: Fragenliste (${nFr} Fragen)`, nFr >= 6);
  await pg.click('#dlgKnoepfe button[data-txt="Fragen stellen"]'); await pg.waitForTimeout(250);
  ok('ohne 3 Fragen geht es nicht weiter', await pg.isVisible('[data-gsf]'));
  for (const i of [0, 3, 4]) await pg.check(`[data-gsf="${i}"]`); if (O) await pg.screenshot({ path: O + '/S4-fragen.png' });
  await pg.click('#dlgKnoepfe button[data-txt="Fragen stellen"]'); await pg.waitForTimeout(250);
  const erg = await pg.innerText('#dlgInhalt'); if (O) await pg.screenshot({ path: O + '/S5-ergebnis.png' });
  ok('Ergebnis: 3 Antworten mit Lern-Tipps und Gehaltswunsch', (erg.match(/💡/g) || []).length === 3 && /Gehaltswunsch/.test(erg), erg.slice(0, 300));
  const ein = await pg.$('#dlgKnoepfe button[data-txt^="Einstellen"]'); await ein.click(); await pg.waitForTimeout(250);
  r = await pg.evaluate(() => ({ ma: spiel.mitarbeiter.map(m => [m.name, m.typ, m.gehalt, m.ab, m.probe]), jz: jzJetzt(), st: Object.values(spiel.bewerbungen).map(x => x.status) }));
  ok('eingestellt: fängt nächste Jahreszeit an, mit Probezeit', r.ma.length === 1 && r.ma[0][1] === 'stallbursche' && r.ma[0][3] === r.jz + 1 && r.ma[0][4] > r.ma[0][3], JSON.stringify(r));
  /* Warten: die übrigen sagen nach einer halben Jahreszeit ab */
  r = await pg.evaluate(() => { spiel.tag += Math.ceil(tpj() * STELLE.wartenJz) + 1; stellenTag(); return Object.values(spiel.bewerbungen).map(x => x.status); });
  ok('wer zu lange wartet, nimmt eine andere Stelle', r.filter(s => s === 'neu').length === 0 && r.includes('weg'), JSON.stringify(r));
  /* Agentur: Sofort-Einstellen kostet ein Gehalt */
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; mitarbeiterDialog('pfleger'); }); await pg.waitForTimeout(250);
  r = await pg.evaluate(() => ({ g: spiel.geld, x: (spiel.bewerber.liste.pfleger || [])[0] }));
  const knopf = await pg.$('[data-einst="0"]'); if (knopf) { await knopf.click(); await pg.waitForTimeout(300); }
  const r2 = await pg.evaluate(() => ({ g: spiel.geld, n: spiel.mitarbeiter.length }));
  ok('Agentur: Einstellen kostet ein Gehalt Vermittlungsgebühr', !!knopf && r2.n === 2 && r.g - r2.g === r.x.gehalt, JSON.stringify([r.g, r2, r.x && r.x.gehalt]));
  ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
