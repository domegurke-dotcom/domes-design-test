// Dome 21.11.2026 (v1067, Auftrag 25 Block 4 Etappe 4e): Senioren-Check als Termin (ab 15 J.), Alterskrankheiten statt allgemeinem Altersfaktor,
// Entlassungsbrief mit Nachsorgeplan und Kontrolltermin, Klinikkeime (Salmonellen-Durchfall, ohne Quarantäne), „Biestmilch getrunken?“ mit IgG-Test und Plasma.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/senioren-nachsorge-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  const zurBox = async i => { await pg.evaluate(i => { document.getElementById('dlg').hidden = true; spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); }, i); await pg.waitForTimeout(300); };
  const nacht = () => pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.boxen.forEach(bx => { if (bx.pferd && !bx.pferd.klinik) { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; } }); naechsteNacht(); zu(); });
  const post = re => pg.evaluate(s => { const R = new RegExp(s); const br = (spiel.post || []).filter(q => R.test(q.betreff)).pop(); return br ? { id: br.id, betreff: br.betreff, text: br.text.replace(/<[^>]+>/g, ' ') } : null; }, re.source);
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 60000; spiel.einsteller = []; spiel.pensionAnfragen = [];
      const mk = (name, i, alter, g) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: g || 'Stute', alter, name }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; P.pflege.zahn = spiel.tag; P.pflege.wurm = spiel.tag; P.befunde = []; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; return P; };
      mk('Oma', 0, 19); mk('Jung', 1, 7); mk('Kolik', 2, 10); speichernJetzt(); speicherSperre = true; });
    /* 1. Altersfaktor: Alterskrankheiten steigen, Verletzungen nicht */
    let r = await pg.evaluate(() => { const box = spiel.boxen[0], O = box.pferd, J = spiel.boxen[1].pferd; const m = (P, bx) => Object.fromEntries(befundRisiko(P, bx, 'box')); const a = m(O, box), j = m(J, spiel.boxen[1]);
      return { lahmO: a.lahmheit, lahmJ: j.lahmheit, verlO: a.verletzung, verlJ: j.verletzung, cush: a.cushing || 0 }; });
    ok(`Alter: Lahmheit 19 J. höher als 7 J., Verletzung gleich, Cushing ab 15 (${r.cush.toFixed(5)})`, r.lahmO > r.lahmJ * 1.5 && Math.abs(r.verlO / r.verlJ - 1) < 0.25 && r.cush > 0, JSON.stringify(r));
    /* 2. Senioren-Check: Karte in der Versorgung, Klick → Termin morgen */
    await zurBox(0); await bild('S1-versorgung');
    const sk = await pg.$('[data-e4e="senior"]'); ok('Box Oma (19 J.): Karte „Senioren-Check“ mit Knopf', !!sk);
    const kein = await pg.evaluate(() => { aktBox = 1; spiel.aktBox = 1; zeigeAkte(); return !document.querySelector('[data-e4e="senior"]'); }); ok('Box Jung (7 J.): kein Senioren-Check', kein);
    await zurBox(0);
    await pg.click('[data-e4e="senior"]'); await pg.waitForTimeout(300); await bild('S2-dialog');
    const dt = await pg.innerText('#dlgInhalt'); ok('Dialog nennt Zähne, Beugeproben, ACTH und Preis', /Zähne/.test(dt) && /Beugeproben/.test(dt) && /ACTH/.test(dt) && /260/.test(dt), dt.slice(0, 300));
    await pg.click('#dlgKnoepfe button[data-txt="📅 Termin morgen"]'); await pg.waitForTimeout(300); await bild('S3-termin');
    r = await pg.evaluate(() => ({ T: spiel.vetTermine, kal: kalTermine(jzJetzt()).concat(kalTermine(jzJetzt() + 1)).filter(x => /Tierarzt: Oma/.test(x.text)).map(x => x.ico + ' ' + x.text), karte: document.body.innerText.includes('Termin steht') }));
    ok('Termin im Kalender („🩺 Tierarzt: Oma (Senioren-Check)“), Karte zeigt „Termin steht“', r.T.length === 1 && r.T[0].was[0] === 'senior' && r.kal.some(x => /🩺 Tierarzt: Oma \(Senioren-Check\)/.test(x)) && r.karte, JSON.stringify(r));
    /* Nacht: unbemerkte Arthrose wird gefunden, Rechnung mit Check + ACTH + Anfahrt */
    await pg.evaluate(() => { const O = spiel.boxen[0].pferd; befundNeu(O, 'arthrose', 2, 'Test'); O.befunde.forEach(x => { delete x.bemerkt; }); spiel.rechnungen = []; });
    await nacht();
    r = await pg.evaluate(() => { const O = spiel.boxen[0].pferd, a = O.befunde.find(x => x.art === 'arthrose'), R = (spiel.rechnungen || []).find(q => q.von === 'Tierarztpraxis'); return { diag: !!(a && a.diagnose), acth: O.acthLabor, j: O.seniorJ === datum().j, posten: R ? R.posten.map(x => x.text + ' ' + x.betrag) : [] }; });
    ok('am Termin: Arthrose gefunden, ACTH im Labor, Rechnung Check 170 + ACTH 90 + Anfahrt', r.diag && r.acth && r.j && r.posten.some(x => /Senioren-Check.*170/.test(x)) && r.posten.some(x => /ACTH.*90/.test(x)) && r.posten.some(x => /Anfahrt/.test(x)), JSON.stringify(r));
    await zurBox(0); ok('danach dieses Jahr kein Senioren-Check-Knopf mehr', !(await pg.$('[data-e4e="senior"]')));
    /* 3. Entlassung aus der Klinik (nach Intensivpflege): Nachsorgeplan im Brief, Kontrolltermin, Karte */
    await pg.evaluate(() => { const J = spiel.boxen[1].pferd; J.befunde = []; J.pflege.gesundheit = 90; J.klinik = { seit: spiel.tag - 2, rechnung: 90, zusatz: 65, leist: { intensiv: 1 } }; spiel.vetTermine = []; });
    await nacht();
    let br = await post(/Jung ist wieder fit/);
    r = await pg.evaluate(() => { const J = spiel.boxen[1].pferd; return { N: J.nachsorge, T: (spiel.vetTermine || []).filter(t => t.pid === J.id).map(t => t.was.join() + ' ' + (t.tag - spiel.tag)) }; });
    ok('Entlassungsbrief mit Nachsorgeplan (Schritt, Kontrolltermin)', br && /Nachsorgeplan/.test(br.text) && /Schritt führen/.test(br.text) && /Kontrolltermin/.test(br.text), br ? br.text.slice(0, 400) : 'kein Brief');
    ok('Kontrolltermin steht im Kalender, p.nachsorge gesetzt', r.N && r.N.kontrolle && r.T.some(x => /^kontrolle/.test(x)), JSON.stringify(r));
    if (br) { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('post'); }); await pg.waitForTimeout(250); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(250); } await pg.click(`[data-brief="${br.id}"]`); await pg.waitForTimeout(350); await bild('S4-entlassung'); }
    await zurBox(1); await bild('S5-nachsorgekarte'); ok('Versorgung zeigt „Nachsorgeplan (Klinik)“', /Nachsorgeplan \(Klinik\)/.test(await pg.innerText('body')));
    /* zu früh angestrengt → höheres Lahmheitsrisiko */
    r = await pg.evaluate(() => { const bx = spiel.boxen[1], J = bx.pferd, vor = Object.fromEntries(befundRisiko(J, bx, 'box')).lahmheit; J.trainHeute = { tag: spiel.tag - 1, liste: [], verbraucht: 45 }; const nach = Object.fromEntries(befundRisiko(J, bx, 'box')).lahmheit; delete J.trainHeute; return { vor, nach, zu: J.nachsorge.zuViel }; });
    ok('in der Schritt-Zeit zu viel gearbeitet: Lahmheitsrisiko ×2, gezählt', Math.abs(r.nach / r.vor - 2) < 0.01 && r.zu === 1, JSON.stringify(r));
    /* Nachkontrolle am Termin */
    await pg.evaluate(() => { spiel.rechnungen = []; }); for (let k = 0; k < 4; k++) { const da = await pg.evaluate(() => (spiel.rechnungen || []).some(q => q.posten.some(x => /Nachkontrolle/.test(x.text)))); if (da) break; await nacht(); }
    r = await pg.evaluate(() => { const R = (spiel.rechnungen || []).find(q => q.posten.some(x => /Nachkontrolle/.test(x.text))); return R ? R.posten.map(x => x.text + ' ' + x.betrag) : null; });
    ok('Nachkontrolle kam als Termin: Rechnung „Nachkontrolle nach der Klinik 65 €“', r && r.some(x => /Nachkontrolle nach der Klinik 65/.test(x)), JSON.stringify(r));
    /* 4. Kolik-OP: Boxenruhe + längere Schritt-Zeit */
    r = await pg.evaluate(() => { const K = spiel.boxen[2].pferd, t = nachsorgePlan(K, 'kolikop'); return { ruhe: K.boxenruhe, rb: K.ruheBis - spiel.tag, sb: K.nachsorge.schrittBis - spiel.tag, t: t.replace(/<[^>]+>/g, ' ') }; });
    ok(`Kolik-OP-Nachsorge: Boxenruhe ${r.rb} Tage, Schritt bis Tag +${r.sb}, etwa 3 Monate genannt`, r.ruhe && r.rb >= 1 && r.sb > r.rb && /3 Monate/.test(r.t), JSON.stringify(r));
    /* 5. Klinikkeime: Salmonellen-Durchfall 1–2 Tage nach der Rückkehr, ohne Quarantäne */
    r = await pg.evaluate(() => { const K = spiel.boxen[2].pferd, mr = Math.random; Math.random = () => 0; klinikKeime(K, 'kolik'); Math.random = mr; return K.salAb - spiel.tag; });
    ok('klinikKeime setzt Durchfall in 1–2 Tagen', r >= 1 && r <= 2, String(r));
    for (let k = 0; k < 2; k++) await nacht();
    r = await pg.evaluate(() => { const K = spiel.boxen[2].pferd, s = K.befunde.find(x => x.art === 'salmonellen'); return { s: !!s, quar: !!(K.quarantaene || inQuarantaene(K)), anst: !!ANSTECKEND.salmonellen, plan: PLAN.salmonellen }; });
    ok('Salmonellen-Durchfall da, keine Quarantäne, nicht ansteckend im Spiel', r.s && !r.quar && !r.anst, JSON.stringify(r));
    /* 6. Biestmilch: Geburt → Brief mit IgG-Test → (zu wenig) → Plasma */
    await pg.evaluate(() => { const bx = spiel.boxen[3]; const M = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Mama' }); M.pflege = erzeugePflege(M); werteErgaenzen(M); M.pflege.impf = spiel.tag; M.befunde = []; bx.pferd = M; bx.tot = false; delete bx.fohlen;
      M.traechtig = { vater: hengstKopie(neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 9, name: 'Papa' })), seit: jzJetzt() - 4, geburt: jzJetzt() }; GEBURT_TOT.ohne = 0; GEBURT_TOT.ma = 0; GEBURT_TOT.abfohl = 0; GEBURT_TOT.maAbfohl = 0; GEBURT_TOT.kamera = 0; });
    let f = null; for (let k = 0; k < 3 && !f; k++) { await nacht(); f = await pg.evaluate(() => { for (const bx of spiel.boxen) if (bx.fohlen && bx.pferd && bx.pferd.name === 'Mama') return { name: bx.fohlen.name, biest: bx.fohlen.biest }; return null; }); }
    ok('Fohlen geboren, Biestmilch-Daten am Fohlen', f && f.biest, JSON.stringify(f));
    await pg.evaluate(() => { for (const bx of spiel.boxen) if (bx.fohlen && bx.pferd && bx.pferd.name === 'Mama') { bx.fohlen.biest.fpt = true; } });
    let bb = await post(/Biestmilch getrunken/); for (let k = 0; k < 2 && !bb; k++) { await nacht(); bb = await post(/Biestmilch getrunken/); }
    ok('Brief „Hat das Fohlen Biestmilch getrunken?“ mit Erklärung', bb && /Kolostrum/.test(bb.text) && /IgG/.test(bb.text), bb ? bb.text.slice(0, 300) : 'kein Brief');
    if (bb) { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('post'); }); await pg.waitForTimeout(250); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(250); }
      await pg.click(`[data-brief="${bb.id}"]`); await pg.waitForTimeout(350); await bild('S6-biestbrief');
      await pg.evaluate(() => { spiel.rechnungen = []; }); const tk = await pg.$('[data-baktion="biest-test"]'); ok('Knopf „IgG-Schnelltest · 45 €“', !!tk);
      if (tk) { await tk.click(); await pg.waitForTimeout(400); await bild('S7-ergebnis'); }
      const pk = await pg.$('[data-baktion="biest-plasma"]'); ok('Ergebnis „zu wenig Abwehrstoffe“ → Knopf Plasma-Infusion', !!pk && /zu wenig Abwehrstoffe/.test(await pg.innerText('body')));
      if (pk) { await pk.click(); await pg.waitForTimeout(400); await bild('S8-plasma'); }
      r = await pg.evaluate(() => { for (const bx of spiel.boxen) if (bx.fohlen && bx.pferd && bx.pferd.name === 'Mama') return { ok: bx.fohlen.biest.ok, R: (spiel.rechnungen || []).flatMap(q => q.posten.map(x => x.text + ' ' + x.betrag)).filter(x => /IgG|Plasma|offen aus/.test(x)), alle: (spiel.rechnungen || []).map(q => q.von + ':' + q.posten.map(x => x.text).join('/')) }; return null; });
      ok('Plasma gegeben, Rechnungen IgG 45 € und Plasma 450 €', r && r.ok && r.R.some(x => /IgG.*45/.test(x)) && r.R.some(x => /Plasma.*450/.test(x)), JSON.stringify(r)); }
    /* 7. ohne Plasma: Sepsis-Brief mit Klinik-Knopf */
    r = await pg.evaluate(() => { for (const bx of spiel.boxen) if (bx.fohlen && bx.pferd && bx.pferd.name === 'Mama') { const B = bx.fohlen.biest; delete B.ok; B.tag = spiel.tag - 5; const mr = Math.random; Math.random = () => 0; biestTag(); Math.random = mr; return B.sepsis > 0; } return null; });
    const sp = await post(/Notfall/); ok('ohne Abwehrstoffe: Sepsis-Brief „Notfall“ mit Klinik-Knopf', r && sp && /Blutvergiftung/.test(sp.text), JSON.stringify(sp && sp.betreff));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
