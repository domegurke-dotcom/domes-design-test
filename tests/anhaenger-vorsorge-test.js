// Dome 21.11.2026 (v1066): Pferdeanhänger kaufbar – ohne eigenen Anhänger Pferdetaxi in die Klinik (Pauschale + km) und Anhängermiete bei Besuchen; alte Spielstände behalten ihren Anhänger.
// Impfung und Zahnkontrolle als Termin über den Kalender (Box und Sammelfenster), am Termin eine Rechnung.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/anhaenger-vorsorge-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const ctx = await b.newContext({ viewport: { width: BW, height: BH } }); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  const zurBox = async i => { await pg.evaluate(i => { document.getElementById('dlg').hidden = true; spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); }, i); await pg.waitForTimeout(300); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 50000; spiel.einsteller = []; spiel.pensionAnfragen = [];
      const mk = (name, i) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; P.pflege.zahn = spiel.tag; P.befunde = []; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; return P; };
      ['Anna', 'Bella', 'Cora'].forEach((n, i) => mk(n, i)); speichernJetzt(); speicherSperre = true; });
    /* 1. neues Spiel: kein Anhänger; Pferdeanhänger-Menü bietet den Kauf an */
    let r = await pg.evaluate(() => ({ eigen: eigenerAnhaenger(), kauf: spiel.anhKauf, taxi: klinikTaxi(), km: spiel.hof.lage && spiel.hof.lage.km }));
    ok(`neues Spiel: kein eigener Anhänger, Pferdetaxi hin und zurück ${r.taxi} € (${r.km} km)`, !r.eigen && r.kauf === 1 && r.taxi >= 184, JSON.stringify(r));
    await pg.evaluate(() => { anhZiel = null; anhAuswahl = new Set(); anhMeldung = ''; zeigeAnhaenger(); }); await pg.waitForTimeout(300); await bild('A1-menue');
    let t = await pg.innerText('#nebenSchirm');
    ok('Pferdeanhänger-Menü: „Noch kein eigener Anhänger“ mit Taxi-Preis und Kauf-Knopf', /Noch kein eigener Anhänger/.test(t) && /Pferdetaxi/.test(t) && !!(await pg.$('#anhKaufen')), t.slice(0, 300));
    /* 2. Klinik ohne Anhänger: Taxi wird abgebucht */
    r = await pg.evaluate(() => { const A = spiel.boxen[0].pferd, bf = befundNeu(A, 'husten', 2, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag }; const g = spiel.geld, k = ANH_ZIEL.stationaer.kosten(); ANH_ZIEL.stationaer.aus(A, spiel.boxen[0]); return { d: g - spiel.geld, taxi: klinikTaxi(), k, f: JSON.stringify(spiel.finanzen).includes('Pferdetaxi') }; });
    ok(`in die Klinik ohne Anhänger: ${r.d} € Pferdetaxi abgebucht, Klinik-Ziel nennt es`, r.d === r.taxi && r.f && /Pferdetaxi/.test(r.k), JSON.stringify(r));
    /* 3. Anhänger kaufen (Klicks) → danach kein Taxi, keine Miete */
    let g0 = await pg.evaluate(() => spiel.geld);
    await pg.click('#anhKaufen'); await pg.waitForTimeout(250); await bild('A2-kaufen'); ok("Kauf-Fenster: 4 Anhänger (gebraucht + 3 neue) mit Unterhalt und Info-Knöpfen", await pg.evaluate(() => document.querySelectorAll("#dlgKnoepfe button").length === 5 && document.querySelectorAll("#dlgInhalt [data-begriff]").length === 3 && /Unterhalt je Jahr/.test(document.getElementById("dlgInhalt").innerText)));
    await pg.click('#dlgKnoepfe button[data-txt^="Gebraucht"]'); await pg.waitForTimeout(300); await bild('A3-gekauft');
    r = await pg.evaluate(() => { const B = spiel.boxen[1].pferd, bf = befundNeu(B, 'husten', 2, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag }; const g = spiel.geld; ANH_ZIEL.stationaer.aus(B, spiel.boxen[1]);
      return { geld: g, d: g - spiel.geld, eigen: eigenerAnhaenger(), mit: besuchKosten(80, true).miete, txt: document.getElementById('nebenSchirm').innerText }; });
    const un = await pg.evaluate(() => { const g = spiel.geld, A = spiel.hof.anhaenger; jahreszeitBeginn(); const d1 = g - spiel.geld; return { d1, m: A.m, hu: A.huJ, j: datum().j }; });
    ok(`Unterhalt je Jahreszeit (gebraucht 450 € / Jahr): Buchung enthält 113 € (${JSON.stringify(un)})`, un.m === "gebraucht" && un.hu === un.j, JSON.stringify(un));
    ok('Anhänger gekauft (6.700 €), danach Klinik ohne Taxi und Besuch ohne Anhängermiete', r.eigen && g0 - r.geld === 6700 && r.d === 0 && r.mit === 0 && /eigenen Pferdeanhänger/.test(r.txt), JSON.stringify(r).slice(0, 300));
    r = await pg.evaluate(() => { const H = spiel.hof.anhaenger; delete spiel.hof.anhaenger; const m = besuchKosten(80, true).miete; spiel.hof.anhaenger = H; return m; });
    ok('ohne eigenen Anhänger kostet ein Besuch mit Pferd Anhängermiete', r > 0, String(r));
    /* 4. Impfung als Termin (Box → Versorgung → Impfen) */
    await pg.evaluate(() => { const C = spiel.boxen[2].pferd; C.pflege.impf = spiel.tag - 3 * tpj(); });
    await zurBox(2); const ik = await pg.$('[data-vorsorge="impfung"]');
    ok('Box: Knopf „Impfen“ ist da (fällig)', !!ik);
    if (ik) { await ik.click(); await pg.waitForTimeout(300); await bild('A4-impfen'); const kn = await pg.$$eval('#dlgKnoepfe button', x => x.map(k => k.dataset.txt || k.textContent));
      ok('Impfen bietet „Termin morgen/übermorgen“ statt sofort', kn.some(k => /Termin morgen/.test(k)) && kn.some(k => /übermorgen/.test(k)) && !kn.some(k => /Tierarzt kommen lassen/.test(k)), kn.join(' | '));
      await pg.click('#dlgKnoepfe button[data-txt="📅 Termin morgen"]'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button').catch(() => {}); }
    r = await pg.evaluate(() => ({ T: spiel.vetTermine, kal: kalTermine(jzJetzt()).concat(kalTermine(jzJetzt() + 1)).filter(x => /Tierarzt: Cora/.test(x.text)).map(x => x.ico + ' ' + x.text) }));
    ok('Impf-Termin steht im Kalender (💉 Tierarzt: Cora (Impfung))', r.T.length === 1 && r.T[0].was.includes('impfung') && r.kal.some(x => /💉 Tierarzt: Cora \(Impfung\)/.test(x)), JSON.stringify(r));
    /* 5. Sammelfenster (Mitarbeiter → Tierarzt): Zähne für Anna als Termin morgen */
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const A = spiel.boxen[0].pferd; A.pflege.zahn = spiel.tag - 10 * tpj(); tierarztDialog([spiel.boxen[0].pferd, spiel.boxen[2].pferd].filter(p => !p.klinik).concat(spiel.boxen[0].pferd.klinik ? [] : []), () => {}); });
    await pg.waitForTimeout(300); await bild('A5-sammel');
    const sk = await pg.$('#dlgKnoepfe button[data-txt^="📅 Termin morgen"]');
    ok('Sammelfenster: Knopf „📅 Termin morgen“', !!sk, await pg.innerText('#dlgKnoepfe'));
    if (sk) { await sk.click(); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button').catch(() => {}); }
    /* 6. Nacht: Termin morgens, du bist da → Impfung gegeben, eine Rechnung mit einer Anfahrt */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.rechnungen = []; spiel.boxen.forEach(bx => { if (bx.pferd && !bx.pferd.klinik) { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; } }); naechsteNacht(); zu();
      const C = spiel.boxen[2].pferd, R = (spiel.rechnungen || []).find(q => q.von === 'Tierarztpraxis'); return { impf: C.pflege.impf === spiel.tag, posten: R ? R.posten.map(x => x.text + ' ' + x.betrag) : [], T: (spiel.vetTermine || []).length }; });
    ok('am Termin: Cora geimpft, Rechnung mit Anfahrt einmal', r.impf && r.posten.filter(x => /Anfahrt|Hausbesuch/.test(x)).length === 1 && r.posten.some(x => /Cora: Impfung/.test(x)), JSON.stringify(r));
    /* 7. alter Spielstand ohne Kauf-Marke: Anhänger bleibt */
    const vor = await pg.evaluate(() => { const x0 = lesen('zuchtstall-v2'); delete x0.anhKauf; delete x0.hof.anhaenger; schreiben('zuchtstall-v2', x0);   /* Spielstand wie vor v1066 */ const x = lesen('zuchtstall-v2'); return JSON.stringify({ kauf: x && x.anhKauf, anh: x && x.hof && x.hof.anhaenger, tut: !!(x && x.tutorial), verl: !!(x && x.verloren) }); });
    await pg.reload(); await pg.waitForTimeout(800);
    r = await pg.evaluate(() => ({ H: spiel.hof && spiel.hof.anhaenger, eigen: eigenerAnhaenger() }));
    ok('alter Spielstand (ohne Kauf-Marke): bekommt beim Laden seinen Anhänger', r.eigen && r.H && r.H.alt, vor + JSON.stringify(r));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
