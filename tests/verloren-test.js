// Verloren-Test (B4, PLAN-BILANZ.md): Abschlussbilanz, Tipps, Platz „Verloren“, Nur-ansehen-Modus (nichts änderbar, Zeit steht, Speicherplätze unverändert), Datei
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/verloren-test.js [Ordner für Bildschirmfotos]
const { chromium } = require('playwright'); const path = require('path');
const ORDNER = process.argv[2];
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Sonnenhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  // Spiel mit Pferden, Buchungen und Briefen, auf Speicherplatz 1 gespeichert; dann Insolvenz am nächsten Jahreszeit-Beginn
  const vor = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    spiel.boxen[0].pferd = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Bella' }); spiel.boxen[1].pferd = neu({ rasse: 'araber', geschlecht: 'Wallach', alter: 6, name: 'Amir' });
    buchen(-3000, 'Gehalt Pferdepfleger Max'); buchen(-800, 'Futter'); buchen(400, 'Turniere: Preisgeld');
    brief('Hofverwaltung', 'Testbrief', 'Hallo'); spiel.platz = 1; platzSpeichern(true); document.getElementById('dlg').hidden = true;
    while (datum().t !== tpj()) { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); }
    window.__dbg = spiel.boxen.map(x => x.pferd ? x.pferd.name : '-').join(',');
    kredite().forEach(k => { k.rest = 0; k.offen = []; k.jz = 1e6; });
    spiel.dispo = { jzMinus: 2, drohung: jzJetzt() }; spiel.geld = -60000; spiel.mitarbeiter = [];
    return { tag: spiel.tag, p1: localStorage.getItem('zuchtstall-p1'), post: spiel.post.length };
  });
  await pg.evaluate(() => { spiel.dispo.drohung = jzJetzt() - 1; tagBeenden(); }); await pg.waitForTimeout(2600);
  const A = await pg.evaluate(() => ({ titel: document.querySelector('#charakter h1') && document.querySelector('#charakter h1').textContent, tipps: document.querySelectorAll('#charakter .panel .liste li').length,
    kurve: !!document.querySelector('#charakter svg[aria-label="Kontostand über die Zeit"]'), knoepfe: ['vlPlatz', 'vlNeu', 'vlAnsehen', 'vlBild', 'vlStart'].filter(i => document.getElementById(i)),
    auto: localStorage.getItem('zuchtstall-v2'), verl: lesenVerloren(), personal: /Personalkosten/.test(document.getElementById('charakter').textContent), tippTxt: [...document.querySelectorAll('#charakter .panel .liste li')].map(x => x.textContent).join(' | '), dbg: window.__dbg }));
  ok('Abschlussfenster „Insolvenz“', A.titel === 'Insolvenz', A.titel); ok('1–3 Tipps', A.tipps >= 1 && A.tipps <= 3, String(A.tipps)); ok('Tipp zu Personalkosten (Gehalt war größter Posten)', A.personal);
  ok('Kurve Kontostand', A.kurve); ok('Alle 5 Knöpfe da', A.knoepfe.length === 5, A.knoepfe.join(','));
  ok('Autospeicher gelöscht', !A.auto); ok('Platz „Verloren“ angelegt', !!A.verl, A.verl && JSON.stringify(A.verl.meta));
  ok('Verlorener Stand = vor der Pfändung (2 Pferde)', A.verl && A.verl.spiel.boxen.filter(x => x.pferd).length === 2);
  ok('Post bleibt im verlorenen Stand', A.verl && A.verl.spiel.post.length >= vor.post, String(A.verl && A.verl.spiel.post.length));
  if (ORDNER) for (const [n, w, h] of [['pc', 1366, 768], ['quer', 844, 390], ['hoch', 390, 844]]) { await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(200); await pg.screenshot({ path: `${ORDNER}/abschluss-${n}.png`, fullPage: false }); }
  await pg.setViewportSize({ width: 1366, height: 768 });
  // Datei: verlorener Stand mit Kennzeichen, Prüfung erkennt ihn
  const D = await pg.evaluate(() => { const d = standDatei(lesenVerloren().spiel), P = dateiPruefen(JSON.stringify(d)); return { kennz: d.verloren === true, ok: !!P.verloren && !P.fehler, name: dateiName(lesenVerloren().spiel) }; });
  ok('Datei hat Kennzeichen verloren', D.kennz); ok('Datei wird als verlorenes Spiel erkannt', D.ok); ok('Dateiname mit „_verloren“', /_verloren_/.test(D.name), D.name);
  // Nur ansehen
  await pg.click('#vlAnsehen'); await pg.waitForTimeout(1200);
  const N = await pg.evaluate(() => ({ ans: !!spiel.ansehen, band: !!document.getElementById('ansBand'), haupt: document.getElementById('hauptMenue').classList.contains('offen'), markt: document.getElementById('hmMarkt').classList.contains('ans-aus'), stall: document.getElementById('hmStall').classList.contains('ans-aus'), tag: spiel.tag, geld: spiel.geld }));
  ok('Nur-ansehen-Modus aktiv', N.ans && N.band, JSON.stringify(N)); ok('Hauptmenü offen', N.haupt); ok('Pferdemarkt ausgegraut, Stall nicht', N.markt && !N.stall);
  await pg.click('#hmMarkt'); await pg.waitForTimeout(300);
  ok('Pferdemarkt öffnet nicht, Hinweis kommt', await pg.evaluate(() => document.getElementById('hauptMenue').classList.contains('offen') && !document.getElementById('ansHinweis').hidden));
  await pg.click('#hmStall'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { const k = document.getElementById('kopfTagEnde'); k && k.click(); }); await pg.waitForTimeout(1500);
  const S = await pg.evaluate(() => ({ tag: spiel.tag, geld: spiel.geld, auto: localStorage.getItem('zuchtstall-v2'), p1: localStorage.getItem('zuchtstall-p1') }));
  ok('Tag beenden gesperrt (Zeit steht)', S.tag === N.tag, S.tag + ' / ' + N.tag);
  // Box öffnen, Pferdepflege: Knöpfe gesperrt, Füttern ändert nichts
  await pg.click('.boxen-liste [data-zubox="0"]').catch(e => console.log('Box:', e.message)); await pg.waitForTimeout(400);
  await pg.click('#info [data-m="pflege"]').catch(e => console.log('Pflege:', e.message)); await pg.waitForTimeout(300);
  const P = await pg.evaluate(() => { const kn = [...document.querySelectorAll('#info .karte button')]; const gesperrt = kn.filter(x => x.classList.contains('ans-aus') || ansehenGesperrt(x)).length;
    const vorher = JSON.stringify(spiel.boxen[0]); kn.slice(0, 6).forEach(x => x.click()); return { n: kn.length, gesperrt, gleich: vorher === JSON.stringify(spiel.boxen[0]), reiter: [...document.querySelectorAll('#info .reiter button')].every(x => !ansehenGesperrt(x)) }; });
  ok('Pferdepflege: alle Knöpfe gesperrt', P.n > 0 && P.gesperrt === P.n, P.gesperrt + '/' + P.n); ok('Klicks ändern die Box nicht', P.gleich); ok('Reiter bleiben bedienbar', P.reiter);
  const E = await pg.evaluate(() => ({ geld: spiel.geld, auto: localStorage.getItem('zuchtstall-v2'), p1: localStorage.getItem('zuchtstall-p1'), g: (() => { buchen(-100, 'Test'); return spiel.geld; })() }));
  ok('Geld unverändert, buchen() wirkungslos', E.geld === N.geld && E.g === N.geld); ok('Autospeicher bleibt leer', !E.auto); ok('Speicherplatz 1 unverändert', E.p1 === vor.p1);
  if (ORDNER) for (const [n, w, h] of [['pc', 1366, 768], ['quer', 844, 390], ['hoch', 390, 844]]) { await pg.setViewportSize({ width: w, height: h }); await pg.evaluate(() => zeigeHaupt()); await pg.waitForTimeout(250); await pg.screenshot({ path: `${ORDNER}/ansehen-${n}.png` }); }
  await pg.setViewportSize({ width: 1366, height: 768 });
  await pg.click('#ansEnde'); await pg.waitForTimeout(1200);
  const Z = await pg.evaluate(() => ({ ans: !!spiel.ansehen, start: document.getElementById('startMenue').classList.contains('offen'), vl: !!document.getElementById('smVerloren'), txt: (document.getElementById('smVerloren') || {}).textContent }));
  ok('Beenden → normales Startmenü', !Z.ans && Z.start); ok('Startmenü zeigt Platz „Verloren“', Z.vl, Z.txt);
  console.log(out.join('\n')); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
