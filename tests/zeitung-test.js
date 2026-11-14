// Etappe M1 (v1030): Orte zur Hofwahl (je Bundesland 2 + 1 je 10.000 km²), Hof-Lage aus dem Ort, Makler je Ort, Lokalzeitung (Abo, Kleinanzeigen mit
// Besichtigung, Termine im Umkreis von 100 km, Stellengesuche, eigene Kleinanzeige). Mit echten Klicks: Startwahl, Pferdemarkt → Lokalzeitung → Abo → Besichtigung → Kauf.
// Start: NODE_PATH=<playwright> node tests/zeitung-test.js [Bilderordner] · Erwartet: „alles ok“.
const { chromium } = require('playwright'); const path = require('path'); const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = [], ok = (n, c, x = '') => L.push((c ? '✓ ' : '✗ ') + n + (x !== '' ? ' (' + x + ')' : ''));
  const bild = async n => { if (ORD) await pg.screenshot({ path: ORD + '/' + n + '.png' }); };
  const dlgText = () => pg.evaluate(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlg').innerText);
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(400);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.waitForTimeout(200);
  // Startwahl: Bundesland + Ort
  ok('Kauffenster hat Bundesland und Ort', !!(await pg.$('#kaufLand')) && !!(await pg.$('#kaufOrt')));
  const vorher = await pg.$$eval('#kaufOrt option', o => o.map(x => x.textContent));
  await pg.selectOption('#kaufLand', '09'); await pg.waitForTimeout(100);
  const bay = await pg.$$eval('#kaufOrt option', o => o.map(x => x.textContent));
  ok('Niedersachsen 6 Orte, Bayern 9 Orte', vorher.length === 6 && bay.length === 9, vorher.length + ' / ' + bay.length);
  await pg.selectOption('#kaufOrt', 'Landshut'); await pg.waitForTimeout(100);
  ok('Lage-Hinweis im Kauffenster', /km bis /.test(await pg.$eval('#kaufLage', e => e.textContent)), await pg.$eval('#kaufLage', e => e.textContent));
  await bild('m1-startwahl');
  await pg.fill('#kaufName', 'Zeitungshof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const r1 = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000;
    const H = spiel.hof, alle = Object.keys(BL_NAME).map(k => [k, (HOF_ORTE[k] || []).length, hofOrtZahl(k)]), M = maklerAngebote();
    return { bl: H.bundesland, ort: H.ort, lage: H.lage, pos: hofPos(), alle, makler: Object.keys(BL_NAME).map(k => M.filter(A => A.land === k).length), mlage: M.every(A => A.lage && A.ort && A.lage.km >= 3 && A.lage.km <= 120) }; });
  ok('Hof liegt in Landshut (Bayern)', r1.bl === '09' && r1.ort === 'Landshut' && r1.lage && r1.lage.stadt, JSON.stringify(r1.lage));
  ok('jedes Bundesland ≥ 2 Orte nach Fläche', r1.alle.every(([, n, soll]) => n >= 2 && n === soll), r1.alle.map(x => x[0] + ':' + x[1]).join(' '));
  ok('Makler: je Ort ein Angebot', r1.makler.every((n, i) => n === r1.alle[i][1]) && r1.mlage, r1.makler.join(','));
  // Makler-Liste nach Bundesland (Klicks)
  await pg.evaluate(() => zeigeImmobilien()); await pg.waitForTimeout(300);
  await pg.selectOption('#mkLandWahl', '10'); await pg.waitForTimeout(300);
  const saar = await pg.$$eval('[data-makler]', l => l.map(x => x.innerText.replace(/\s+/g, ' ')));
  ok('Saarland zeigt 2 Höfe mit Ort', saar.length === 2 && saar.every(t => /St\. Wendel|Merzig/.test(t)), saar.map(t => t.slice(0, 60)).join(' | '));
  await bild('m1-makler');
  // Pferdemarkt → Lokalzeitung
  await pg.evaluate(() => zeigeMarkt(null)); await pg.waitForTimeout(300);
  const kachel = await pg.$eval('[data-mb="zeitung"]', e => e.innerText.replace(/\s+/g, ' '));
  ok('Kachel Lokalzeitung', /Lokal/.test(kachel), kachel);
  await pg.click('[data-mb="zeitung"]'); await pg.waitForTimeout(300); await bild('m1-zeitung-ohne-abo');
  const g0 = await pg.evaluate(() => spiel.geld); await pg.click('#ztAbo'); await pg.waitForTimeout(400);
  const r2 = await pg.evaluate(g0 => ({ abz: g0 - spiel.geld, Z: spiel.hof.zeitung, text: document.getElementById('nebenSchirm').innerText }), g0);
  ok('Abo kostet 135 €', r2.abz === 135, r2.abz); ok('Ausgabe dieser Jahreszeit', r2.Z.abo && r2.Z.heft === (await pg.evaluate(() => jzJetzt())));
  const nAnz = await pg.$$eval('#nebenSchirm .paar', l => l.length);
  ok('4–7 Kleinanzeigen', nAnz >= 4 && nAnz <= 7, nAnz);
  ok('Termine im Umkreis (Ingolstadt o. ä.)', /Termine in der Region/.test(r2.text) && /\(\d+ km\)/.test(r2.text), (r2.text.match(/📅 Termine[\s\S]{0,200}/) || [''])[0].replace(/\s+/g, ' '));
  ok('Stellengesuche', /Stellengesuche/.test(r2.text));
  const umk = await pg.evaluate(() => { const p = hofPos(); return { kl: zeitungKlein(jzJetzt()).every(h => h.anzKm <= 100 && h.anzOrt), ter: [0, 1, 2, 3].flatMap(i => regionTermine(jzJetzt() + i)).every(t => t.km <= 100) }; });
  ok('alles im Umkreis von 100 km', umk.kl && umk.ter);
  await bild('m1-zeitung');
  // Besichtigung ausmachen (heute) und kaufen – mit Klicks
  await pg.click('#nebenSchirm .paar'); await pg.waitForTimeout(300);
  await pg.click('#dlgKnoepfe button:has-text("Besichtigung")'); await pg.waitForTimeout(300);
  ok('Besichtigungsfenster mit Tagen', !!(await pg.$('#besTag')), (await dlgText()).slice(0, 80).replace(/\s+/g, ' '));
  const nTage = await pg.$$eval('#besTag option', o => o.length);
  ok('Termine bis Ende der nächsten Jahreszeit', nTage >= 8, nTage);
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const kal = await pg.evaluate(() => kalTermine(jzJetzt()).filter(t => /Besichtigung/.test(t.text)).length);
  ok('Besichtigung steht im Kalender', kal === 1, kal);
  const kText = await pg.$eval('#nebenSchirm .paar', e => e.innerText); ok('Kachel: Besichtigung heute', /Besichtigung heute/.test(kText));
  const boxenVor = await pg.evaluate(() => spiel.boxen.filter(b => b.pferd).length);
  await pg.click('#nebenSchirm .paar'); await pg.waitForTimeout(300);
  await pg.click('#dlgKnoepfe button:has-text("Hinfahren und ansehen")'); await pg.waitForTimeout(300);   // M3: Besichtigung = Fahrt
  await pg.click('#dlgKnoepfe button:has-text("Mit Pferdeanhänger")'); await pg.waitForTimeout(300);
  await pg.click('#nebenSchirm .paar'); await pg.waitForTimeout(300); if (!/verlangt werden/.test(await dlgText())) { await pg.click('#dlgKnoepfe button:has-text("Ansehen")'); await pg.waitForTimeout(300); }
  await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r3 = await pg.evaluate(() => ({ n: spiel.boxen.filter(b => b.pferd).length, txt: document.getElementById('dlg').innerText }));
  ok('Pferd gekauft und im Stall', r3.n === boxenVor + 1, r3.txt.slice(0, 60).replace(/\s+/g, ' '));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; besuchHeim(); document.getElementById('dlg').hidden = true; marktBereich = 'zeitung'; zeigeMarkt('zeitung'); }); await pg.waitForTimeout(300);
  ok('gekauftes Pferd nicht mehr in der Zeitung', (await pg.$$eval('#nebenSchirm .paar', l => l.length)) === nAnz - 1);
  // eigene Kleinanzeige über „Pferd verkaufen“
  await pg.evaluate(() => { const p = spiel.boxen.find(b => b.pferd).pferd; p.pflege.gesundheit = 100; verkaufDialog(p, () => {}); }); await pg.waitForTimeout(300);
  const g1 = await pg.evaluate(() => spiel.geld); await pg.click('#zeitungLos'); await pg.waitForTimeout(300);
  const r4 = await pg.evaluate(g1 => { const a = (spiel.angebote || [])[0]; return { abz: g1 - spiel.geld, a, ende: jzStartTag(jzJetzt() + 1) }; }, g1);
  ok('Kleinanzeige: 25 €, läuft bis Jahreszeitende', r4.abz === 25 && r4.a && r4.a.zeitung && r4.a.endeTag === r4.ende, JSON.stringify(r4.a).slice(0, 120));
  // Jahreszeitwechsel: Abo abbuchen, neue Ausgabe; mit Mitarbeiter im Büro
  const r5 = await pg.evaluate(() => { const g = spiel.geld; spiel.mitarbeiter = [{ typ: 'stallbursche', name: 'X', ab: 0 }]; zeitungJahreszeit(); const Z = spiel.hof.zeitung; const a = { abz: g - spiel.geld, lage: Z.lage, gelesen: Z.gelesen };
    Z.kuendigung = true; zeitungJahreszeit(); spiel.mitarbeiter = []; return { ...a, nachK: Z.abo }; });
  ok('neue Jahreszeit: 135 € abgebucht, Zeitung im Büro', r5.abz === 135 && r5.lage === 'buero' && r5.gelesen === false, JSON.stringify(r5));
  ok('Kündigung beendet das Abo', r5.nachK === false);
  // Etappe M2 (v1031): Privatinserate aus ganz Deutschland mit Standort und Entfernung (Klick auf die Rubrik)
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; marktBereich = null; zeigeMarkt(null); }); await pg.waitForTimeout(300);
  await pg.click('[data-mb="privat"]'); await pg.waitForTimeout(400);
  const ins = await pg.$$eval('#nebenSchirm .paar', l => l.map(x => x.innerText.replace(/\s+/g, ' ')));
  const insOrt = await pg.evaluate(() => marktNeu().privat.map(h => inseratOrt(h)));
  ok('Inserate mit Standort und km', ins.length > 0 && ins.every(t => /📍 .+ · \d+ km/.test(t)), ins.slice(0, 2).join(' | '));
  ok('Standorte aus ganz Deutschland, fest je Pferd', insOrt.every(o => o.ort && o.km >= 0 && o.km < 900) && JSON.stringify(insOrt) === JSON.stringify(await pg.evaluate(() => marktNeu().privat.map(h => inseratOrt(h)))), insOrt.map(o => o.ort + ' ' + o.km).join(', '));
  await bild('m2-inserate');
  // alter Spielstand ohne Ort: Zeitung fragt nach der Lage
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; delete spiel.hof.bundesland; delete spiel.hof.ort; delete spiel.hof.lage; marktBereich = 'zeitung'; zeigeMarkt(); }); await pg.waitForTimeout(300);
  ok('ohne Lage: Ortswahl in der Zeitung', !!(await pg.$('#ztwLand')));
  await pg.selectOption('#ztwLand', '01'); await pg.selectOption('#ztwOrt', 'Husum'); await pg.click('#ztOrtOk'); await pg.waitForTimeout(300);
  ok('Ort nachgetragen', await pg.evaluate(() => spiel.hof.ort === 'Husum' && spiel.hof.bundesland === '01'));
  L.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler');
  const bad = L.some(l => l[0] === '✗') || errs.length; console.log(bad ? 'FEHLER' : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0); })();
