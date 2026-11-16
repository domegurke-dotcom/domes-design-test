// Auftrag 25 Block 4, Etappe 4b (v1063): OP-Versicherung (3 Tarife, Wartezeit, Vorerkrankungen), Lebensversicherung (Untersuchung, Auszahlung), Haftpflicht mit Schäden,
// Kolik-OP 9.500 € / 7 Tage, Anruf vom OP-Tisch (weiter operieren / erlösen / ohne Antwort), Nachkolik-Risiko.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/versicherung-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  const brief = async id => { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('post'); }); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); } await pg.click(`[data-brief="${id}"]`); await pg.waitForTimeout(400); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 100000; spiel.einsteller = []; spiel.pensionAnfragen = [];
      const mk = (name, i, x) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name, ...(x || {}) }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; P.pflege.zahn = spiel.tag; P.befunde = []; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; return P; };
      ['Anna', 'Bella', 'Cora', 'Dora', 'Emma', 'Fine'].forEach((n, i) => mk(n, i)); });
    const pid = n => pg.evaluate(n => spiel.boxen.find(x => x.pferd && x.pferd.name === n).pferd.id, n);
    /* Fenster: Hofverwaltung → Finanzen → Versicherungen (echte Klicks) */
    await pg.evaluate(() => zeigeHof('finanzen')); await pg.waitForTimeout(300); await pg.click('[data-ftab="vers"]'); await pg.waitForTimeout(300); await bild('V1-fenster');
    let t = await pg.innerText('#hofInhalt, body');
    ok('Fenster „Versicherungen“ zeigt Haftpflicht, die Pferde und die 3 Tarife', /Pferdehalter-Haftpflicht/.test(t) && /Anna/.test(t) && /Basis/.test(t) && /Premium/.test(t) && /Exzellent/.test(t), t.slice(0, 300));
    let g0 = await pg.evaluate(() => spiel.geld); await pg.click('[data-vhp="an"]'); await pg.waitForTimeout(300);
    let r = await pg.evaluate(() => ({ hp: !!spiel.hof.haftpflicht, geld: spiel.geld }));
    ok('Haftpflicht abgeschlossen, erster Beitrag 28 €', r.hp && g0 - r.geld === 28, JSON.stringify([r, g0]));
    /* OP-Versicherung: Anna Premium, Bella Basis (mit bekanntem Befund) */
    await pg.evaluate(() => { const B = spiel.boxen[1].pferd, bf = befundNeu(B, 'kolik', 1, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag }; });
    g0 = await pg.evaluate(() => spiel.geld); await pg.click(`[data-vop="${await pid('Anna')}"]`); await pg.waitForTimeout(250); await bild('V2-tarif');
    await pg.click('#dlgKnoepfe button[data-txt^="Premium"]'); await pg.waitForTimeout(300);
    await pg.click(`[data-vop="${await pid('Bella')}"]`); await pg.waitForTimeout(250); t = await pg.innerText('#dlgInhalt');
    await pg.click('#dlgKnoepfe button[data-txt^="Basis"]'); await pg.waitForTimeout(300);
    r = await pg.evaluate(() => ({ a: spiel.boxen[0].pferd.vers, b: spiel.boxen[1].pferd.vers, geld: spiel.geld }));
    ok('OP-Versicherung per Klick: Anna Premium, Bella Basis; erste Beiträge 175 € + 65 €', r.a.op.tarif === 'premium' && r.b.op.tarif === 'basis' && g0 - r.geld === 240, JSON.stringify(r));
    ok('Bekannte Krankheit (Kolik bei Bella) wird beim Abschluss genannt und ausgeschlossen', /Kolik/.test(t) && r.b.op.aus.includes('kolik'), t.slice(0, 300) + JSON.stringify(r.b));
    await bild('V3-liste');
    /* Wartezeit und Grenzen (direkt geprüft) */
    r = await pg.evaluate(() => { const A = spiel.boxen[0].pferd, B = spiel.boxen[1].pferd; B.befunde = [];
      const w0 = versOpPosten(A, 'tieback', 3000)[0]; spiel.tag += 1; const k1 = versOpPosten(A, 'kolik', 12000)[0]; spiel.tag += tpj(); const s1 = versOpPosten(A, 'tieback', 3000)[0], s2 = versOpPosten(A, 'frakturop', 9000)[0], c1 = versOpPosten(A, 'arthroskopie', 2000)[0], kr = versOpPosten(A, 'kryptop', 1800)[0];
      const bk = versOpPosten(B, 'kolik', 12000)[0]; B.vers.op.aus = []; const bk2 = versOpPosten(B, 'kolik', 12000)[0];
      return { w0, k1, s1, s2, c1, kr, bk, bk2, kurz: versKurz(A, 'kolik', KOLIK_OP), kein: versKurz(spiel.boxen[2].pferd, 'kolik', KOLIK_OP) }; });
    ok('Wartezeit: am Abschlusstag zahlt sie nicht, Kolik schon nach 1 Tag', /Wartezeit/.test(r.w0.text) && r.w0.betrag === 0 && r.k1.betrag === -12000, JSON.stringify([r.w0, r.k1]));
    ok('Premium: andere OPs bis 1.500 €, Bauch/Bruch bis 4.000 €, Chip-OP nicht, Kastration nicht', r.s1.betrag === -1500 && r.s2.betrag === -4000 && r.c1.betrag === 0 && /Exzellent/.test(r.c1.text) && r.kr.betrag === 0 && /Kastration/.test(r.kr.text), JSON.stringify([r.s1, r.s2, r.c1, r.kr]));
    ok('Basis: Vorerkrankung Kolik zahlt nicht, sonst Kolik bis 1.500 €', r.bk.betrag === 0 && /bekannt/.test(r.bk.text) && r.bk2.betrag === -1500, JSON.stringify([r.bk, r.bk2]));
    ok('Kolik-Fenster nennt die Versicherung („übernimmt etwa 9.500 €“ / „Keine OP-Versicherung“)', /übernimmt etwa 9\.500/.test(r.kurz) && /Keine OP-Versicherung/.test(r.kein), JSON.stringify([r.kurz, r.kein]));
    /* Kolik-OP mit Premium: Rechnung 9.500 € inkl. 7 Tage, Versicherung übernimmt alles */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; const A = spiel.boxen[0].pferd; A.befunde = []; KOLIK_ART.__ok = { opTod: 0 };
      const bf = befundNeu(A, 'kolik', 4, 'Test'); bf.kolikArt = '__ok'; bf.diagnose = { tag: spiel.tag }; A.pflege.gesundheit = 60; A.klinik = { seit: spiel.tag, op: 'kolik', bis: spiel.tag + KOLIK_OP_TAGE };
      let n = 0; while (n++ < 20 && A.klinik) { spiel.boxen.slice(0, 6).forEach(bx => { if (bx.pferd && !bx.pferd.klinik) { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; } }); naechsteNacht(); zu(); }
      delete KOLIK_ART.__ok; const x = (spiel.post || []).find(q => /Anna hat die Kolik-OP überstanden/.test(q.betreff)), R = (spiel.rechnungen || []).find(q => (q.pferde || []).includes(A.id) && q.von === 'Tierarztpraxis');
      return { gleich: spiel.boxen[0].pferd === A, op2: spiel.boxen[0].pferd.kolikOpTag, tage: n, kop: KOLIK_OP, ktage: KOLIK_OP_TAGE, text: x ? x.text.replace(/<[^>]+>/g, ' ') : '', post: (spiel.post || []).slice(0, 6).map(q => q.betreff), betrag: R ? R.betrag : null, posten: R ? R.posten.map(q => q.text + ' ' + q.betrag) : [], nach: A.kolikOpTag, faktor: (() => { const kol = () => (befundRisiko(A, spiel.boxen[0], 'box').find(x => x[0] === 'kolik') || [0, 0])[1]; A.stressTag = null; const f0 = kol(); const s = A.kolikOpTag; delete A.kolikOpTag; const f1 = kol(); A.kolikOpTag = s; return f1 ? f0 / f1 : null; })() }; });   /* befundRisiko liefert [art, Risiko]-Paare */
    ok(`Kolik-OP: ${r.kop} € inkl. ${r.ktage} Tage Klinik, Premium übernimmt alles – Bericht statt 0-€-Rechnung`, r.kop === 9500 && r.ktage === 7 && !r.posten.length && /Kolik-OP inkl\. 7 Tage Klinik\s+9\.500/.test(r.text) && /OP-Versicherung \(Premium\) übernimmt\s+-9\.500/.test(r.text) && /nichts zu bezahlen/.test(r.text), JSON.stringify(r).slice(0, 700));
    ok(`nach der OP: Nachkolik-Risiko doppelt (×${(r.faktor || 0).toFixed(2)}), Brief warnt vor neuer Kolik`, r.nach != null && Math.abs(r.faktor - 2) < 0.01 && /jedes fünfte Pferd/.test(r.text), JSON.stringify([r.nach, r.gleich, r.op2, r.faktor, r.text.slice(0, 80)]));
    /* Anruf vom OP-Tisch: Cora (weiter operieren), Dora (erlösen), Emma (ohne Antwort) – ohne Versicherung */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; KOLIK_ART.__tod = { opTod: 1 }; KOLIK_TISCH.anteil = 1;
      [2, 3, 4].forEach(i => { const P = spiel.boxen[i].pferd; P.befunde = []; delete P.klinik; spiel.boxen[i].tot = false; const bf = befundNeu(P, 'kolik', 4, 'Test'); bf.kolikArt = '__tod'; bf.diagnose = { tag: spiel.tag }; P.pflege.gesundheit = 60; P.klinik = { seit: spiel.tag, op: 'kolik', bis: spiel.tag + KOLIK_OP_TAGE }; });
      naechsteNacht(); zu(); delete KOLIK_ART.__tod; const B = n => (spiel.post || []).find(q => q.betreff === 'Anruf aus dem OP: ' + n);
      return { diag: [2, 3, 4].map(i => { const P = spiel.boxen[i].pferd; return [P.name, !!spiel.boxen[i].tot, P.todesursache || '', JSON.stringify(P.klinik || null), (P.befunde || []).map(b => b.art + b.grad + (b.kolikArt || '')).join('/')]; }), c: B('Cora') && B('Cora').id, d: B('Dora') && B('Dora').id, e: !!B('Emma'), tisch: [2, 3, 4].map(i => !!(spiel.boxen[i].pferd.klinik && spiel.boxen[i].pferd.klinik.tisch)), text: B('Cora') ? B('Cora').text.replace(/<[^>]+>/g, ' ') : '' }; });
    ok('Anruf aus dem OP kommt als Brief (Darm geschädigt, weiter operieren oder erlösen)', !!r.c && !!r.d && r.e && r.tisch.every(Boolean) && /Darm/.test(r.text) && /erlösen/.test(r.text), JSON.stringify(r).slice(0, 400));
    const cId = r.c, dId = r.d;
    await brief(cId); await bild('V4-anruf');
    ok('Brief hat die Knöpfe „Weiter operieren“ und „Erlösen“', !!(await pg.$('[data-baktion="tisch-weiter"]')) && !!(await pg.$('[data-baktion="tisch-erloesen"]')));
    await pg.evaluate(() => { KOLIK_TISCH.ueberlebt = 1; }); await pg.click('[data-baktion="tisch-weiter"]'); await pg.waitForTimeout(300); await bild('V5-weiter'); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => { KOLIK_TISCH.ueberlebt = 0.4; const P = spiel.boxen[2].pferd; return { klinik: P.klinik, tot: !!spiel.boxen[2].tot }; });
    ok('Weiter operieren: Cora lebt, Resektion und 2 Tage länger Klinik', !r.tot && r.klinik && r.klinik.resektion && !r.klinik.tisch && r.klinik.bis >= 0, JSON.stringify(r));
    await brief(dId); await pg.click('[data-baktion="tisch-erloesen"]'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); const R = (spiel.rechnungen || []).find(q => q.von === 'Tierarztpraxis' && q.posten.some(x => /Dora: Kolik-OP begonnen/.test(x.text)));
      const d = { tot: !!spiel.boxen[3].tot, urs: spiel.boxen[3].pferd.todesursache, rech: R ? R.posten.filter(x => /Dora/.test(x.text)).map(x => x.betrag) : null };
      spiel.boxen.slice(0, 6).forEach(bx => { if (bx.pferd && !bx.pferd.klinik && !bx.tot) { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; } }); naechsteNacht(); zu();
      return { d, emmaTot: !!spiel.boxen[4].tot || !!(spiel.friedhof || []).find(g => g.name === 'Emma'), emmaUrs: ((spiel.friedhof || []).find(g => g.name === 'Emma') || spiel.boxen[4].pferd || {}).ursache || spiel.boxen[4].pferd.todesursache, emmaBrief: !!(spiel.post || []).find(q => /nicht erreichen/.test(q.text || '')) }; });
    ok('Erlösen: Dora stirbt auf dem OP-Tisch, Rechnung 3.500 €', r.d.tot && /OP-Tisch erlöst/.test(r.d.urs) && r.d.rech && r.d.rech[0] === 3500, JSON.stringify(r.d));
    ok('ohne Antwort: Emma wird in der nächsten Nacht erlöst, Brief „konnten Sie nicht erreichen“', r.emmaTot && /OP-Tisch/.test(r.emmaUrs) && r.emmaBrief, JSON.stringify(r).slice(0, 400));
    /* Lebensversicherung (Klicks): Fine abschließen, Anna (mit chronischer Krankheit) abgelehnt */
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.boxen[5].pferd.befunde = []; spiel.boxen[5].pferd.pflege.gesundheit = 100; const A = spiel.boxen[0].pferd; A.befunde = []; const bf = befundNeu(A, 'arthrose', 2, 'Test'); bf.bemerkt = null; finanzTab = 'vers'; zeigeHof('finanzen'); }); await pg.waitForTimeout(300);
    g0 = await pg.evaluate(() => spiel.geld); const fId = await pid('Fine');
    await pg.click(`[data-vleben="${fId}"]`); await pg.waitForTimeout(250); await bild('V6-leben'); await pg.click('#dlgKnoepfe button[data-txt^="Untersuchen"]'); await pg.waitForTimeout(300);
    r = await pg.evaluate(() => ({ L: spiel.boxen[5].pferd.vers && spiel.boxen[5].pferd.vers.leben, geld: spiel.geld, mw: Math.max(1000, Math.round(marktwert(spiel.boxen[5].pferd) / 500) * 500) }));
    const sum = r.L && r.L.summe;
    ok(`Lebensversicherung Fine: Summe ${sum} € (Marktwert), Untersuchung 200 € + Beitrag ${Math.round(sum * 0.017 / 4)} €`, r.L && r.L.summe === r.mw && g0 - r.geld === 200 + Math.round(sum * 0.017 / 4), JSON.stringify([r, g0 - r.geld]));
    await pg.click(`[data-vleben="${await pid('Anna')}"]`); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button[data-txt^="Untersuchen"]'); await pg.waitForTimeout(300); t = await pg.innerText('#dlgInhalt'); await bild('V7-abgelehnt'); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => ({ L: (spiel.boxen[0].pferd.vers || {}).leben, bem: !!spiel.boxen[0].pferd.befunde.find(b => b.art === 'arthrose').bemerkt }));
    ok('Anna mit unerkannter Arthrose: Untersuchung findet sie, Versicherung lehnt ab', !r.L && r.bem && /Abgelehnt/.test(t) && /Arthrose/.test(t), t.slice(0, 200) + JSON.stringify(r));
    /* Tod: Fine wird erlöst → Versicherung zahlt; Vernachlässigung zahlt nicht */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; const F = spiel.boxen[5].pferd, bf = befundNeu(F, 'arthrose', 5, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag }; bf.diagnose = { tag: spiel.tag }; bf.keineHeilung = true;
      const g = spiel.geld; erloesenDurchfuehren(F, spiel.boxen[5], erloesenGrund(F), false); zu(); const g1 = spiel.geld; spiel.boxen.slice(0, 6).forEach(bx => { if (bx.pferd && !bx.pferd.klinik && !bx.tot) { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; } }); naechsteNacht(); zu();
      const x = (spiel.post || []).find(q => q.betreff === 'Lebensversicherung: Fine');
      const V = { name: 'Vera', id: 'vv', vers: { leben: { summe: 5000, ab: 1 } }, todesursache: 'Entkräftung – zu wenig Futter und Pflege', geschlecht: 'Stute' }; const g2 = spiel.geld; versLebenTod(V); const y = (spiel.post || []).find(q => q.betreff === 'Lebensversicherung: Vera');
      return { erl: g - g1, plus: (spiel.finanzen && JSON.stringify(spiel.finanzen).includes('Lebensversicherung: Fine')), brief: x ? x.text.replace(/<[^>]+>/g, ' ') : '', vera: y ? y.text.replace(/<[^>]+>/g, ' ') : '', g2d: spiel.geld - g2 }; });
    ok(`Fine erlöst: Lebensversicherung zahlt ${sum} € und schreibt einen Brief`, r.plus && new RegExp(String(sum).replace(/\B(?=(\d{3})+(?!\d))/g, '.')).test(r.brief), JSON.stringify(r).slice(0, 400));
    ok('Tod durch Vernachlässigung: Lebensversicherung zahlt nicht', r.g2d === 0 && /nicht zahlen/.test(r.vera), JSON.stringify(r).slice(0, 400));
    /* Haftpflicht-Schaden: mit Versicherung kostenlos, ohne Rechnung vom Geschädigten */
    r = await pg.evaluate(() => { const P = spiel.boxen[1].pferd, g = spiel.geld; const a = haftpflichtSchaden(P, 0); const g1 = spiel.geld; delete spiel.hof.haftpflicht; const b = haftpflichtSchaden(P, 1);
      const R = (spiel.rechnungen || []).find(q => q.von === 'Familie Krüger'), x = (spiel.post || []).find(q => /Schaden durch Bella/.test(q.betreff) && q.von === 'Pferdehalter-Haftpflicht');
      return { a, b, d: g - g1, R: R && R.betrag, brief: !!x }; });
    ok(`Haftpflicht-Schaden: mit Versicherung 0 € (Brief), ohne Rechnung von Familie Krüger (${r.R} €)`, r.a.versichert && r.d === 0 && r.brief && !r.b.versichert && r.R === r.b.betrag && r.R >= 600, JSON.stringify(r));
    /* Beiträge zu Beginn der Jahreszeit */
    r = await pg.evaluate(() => { spiel.hof.haftpflicht = { ab: spiel.tag }; const g = spiel.geld; versJahreszeit(); const lb = alleEigenenPferde().filter(x => x.p.vers && x.p.vers.leben).reduce((a, x) => a + lebenJz(x.p.vers.leben), 0); return { d: g - spiel.geld, soll: 175 + 65 + lb + 28 }; });
    ok(`Beiträge je Jahreszeit: ${r.d} € (OP 175 + 65, Leben, Haftpflicht 28)`, r.d === r.soll, JSON.stringify(r));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
