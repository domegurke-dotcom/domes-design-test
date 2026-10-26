// Weihnachten am Hof A–C (v855): Geschenke der Einsteller, Stall des Jahres, Sponsor mit Banner und Futtergutschein
// Start (Domes PC, siehe CLAUDE.md): node tests/weihnachten-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.admin = false; spiel.geld = 100000; speicherSperre = true;
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {};
    const neu = (name, z) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.gekauftTag = -99; return p; };
    spiel.boxen.forEach(x => { x.pferd = null; delete x.fohlen; });
    const einst = (i, name, z, seit) => { const p = neu(name); spiel.boxen[i].pferd = p; const e = { eid: 'e' + name, vn: 'Anna', nn: name, w: true, pid: p.id, stufe: 1, leistungen: {}, haltung: 'box', zufr: z, seit, einzug: spiel.tag - 40, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200 }; p.einsteller = e.eid; einstellerListe().push(e); return e; };
    while (datum().s !== 3 || datum().t !== Math.max(1, tpj() - 1)) { spiel.tag++; }
    const E1 = einst(0, 'Sehr', 90, jzJetzt() - 8), E2 = einst(1, 'Gut', 70, jzJetzt() - 8), E3 = einst(2, 'Karte', 50, jzJetzt() - 8), E4 = einst(3, 'Schlecht', 30, jzJetzt() - 8), E5 = einst(4, 'Neu', 90, jzJetzt());
    [E1, E2, E3, E4, E5].forEach(e => { e.zj = datum().j; e.zs = e.zufr * 100; e.zn = 100; });
    const g0 = spiel.geld, briefe = t => spiel.post.filter(x => t.test(x.betreff)); pensionRegeln().ansehen = 100;
    weihnachtenHof(); const geschenke = briefe(/Weihnachtsgrüße/);
    R.brief = geschenke.length; R.summe = Math.round(spiel.geld - g0); const A = geschenke[0] && geschenke[0].aktion; R.aktion = !!(A && A.typ === 'wgeschenk' && A.summe === R.summe);
    R.max = R.summe >= 60 + 25 + 30 && R.summe <= 100 + 50 + 50; R.text = geschenke[0] && /Sehr/.test(geschenke[0].text) && /Karte/.test(geschenke[0].text) && !/Schlecht/.test(geschenke[0].text);
    weihnachtenHof(); R.einmal = briefe(/Weihnachtsgrüße/).length === 1;
    // Stall des Jahres: durchschnittlicher Hof -> höchstens Anerkennung; sehr schwacher Hof -> kein Preis; guter Hof -> Preis
    R.erste = briefe(/Stall des Jahres/).length === 1; spiel.post.length = 0; pensionRegeln().ansehen = 30; [E1, E2, E3, E4, E5].forEach(e => { e.zs = 3000; }); gebaeude().forEach(g => { g.zustand = 30; }); stallDesJahres();
    R.kein = briefe(/Stall des Jahres/).length === 1 && /kein Preis/.test(briefe(/Stall des Jahres/)[0].betreff); gebaeude().forEach(g => { g.zustand = 95; }); spiel.hof.stallPreise = [];
    // Punkte mit sehr gutem Ruf
    pensionRegeln().ansehen = 180; [E1, E2, E3, E4, E5].forEach(e => { e.zufr = 90; e.zs = 9000; });
    R.punkte = Math.round(stallPunkte().punkte); spiel.hof.weihJ = null; spiel.post.length = 0; const g1 = spiel.geld; stallDesJahres(); R.preis = briefe(/Stall des Jahres 20/).length === 1; R.preisGeld = Math.round(spiel.geld - g1); R.liste = (spiel.hof.stallPreise || []).length === 1;
    R.zeile = /Stall des Jahres/.test(xmasZeileHTML());
    // Vorfall im Jahr schließt Preis aus
    vetVorfall('admin', 'Test', { neu: true }); spiel.post.length = 0; stallDesJahres(); R.vorfall = briefe(/kein Preis/).length === 1; spiel.veterinaer = undefined;
    // Sponsor
    spiel.post.length = 0; spiel.hof.sponsorJ = null; sponsorAngebot(); const SA = briefe(/Sponsoring-Angebot/)[0]; R.angebot = !!(SA && SA.aktion && SA.aktion.typ === 'sponsor');
    pensionRegeln().ansehen = 120; spiel.hof.sponsorJ = null; spiel.post.length = 0; sponsorAngebot(); R.keinAngebot = briefe(/Sponsoring-Angebot/).length === 0; pensionRegeln().ansehen = 180;
    const g2 = spiel.geld; sponsorAnnehmen(SA.aktion, 'gutschein'); R.gut = futterkammer().gutschein === 1500 && !!sponsorAktiv() && spiel.geld === g2;
    R.banner = planBanner({ typ: 'reitplatz' }, 0, 0, 80).includes('pl-banner') && planBanner({ typ: 'stall' }, 0, 0, 80) === '';
    const k0 = spiel.geld; const F = futterkammer(); const kost = FUTTER.heu.preis * 100; const fehl = futterKaufen('heu', 100); R.kauf = fehl === '' && Math.abs(F.gutschein - (1500 - kost)) < 0.02 && spiel.geld === k0;
    pensionRegeln().ansehen = 100; sponsorTag(); R.ende = !spiel.hof.sponsor && briefe(/Sponsoring beendet/).length === 1; R.gutBleibt = futterkammer().gutschein > 0;
    // Geld-Sponsor
    spiel.hof.sponsorJ = null; pensionRegeln().ansehen = 180; const g3 = spiel.geld; sponsorAnnehmen(SA.aktion, 'geld'); R.geld = spiel.geld - g3 === 1000;
    // Team weitergeben
    spiel.mitarbeiter = spiel.mitarbeiter || []; const x = bewerber('stallbursche')[0]; spiel.mitarbeiter.push({ id: 'maW', typ: 'stallbursche', name: x.name, w: x.w, wissen: { ...x.wissen }, eig: [...x.eig], gehalt: x.gehalt, ab: jzJetzt(), bis: null, zufr: 50 });
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('ein Sammelbrief der Einsteller', R.brief === 1); ok('Geld 115–200 € gebucht', R.max, R.summe); ok('Brief-Aktion mit Summe', R.aktion); ok('Texte: Karte ja, Schlechter nicht', R.text); ok('einmal je Jahr', R.einmal);
  ok('durchschnittlicher Hof bekommt eine Antwort des Vereins', R.erste); ok('sehr schwacher Hof: kein Preis', R.kein); ok('guter Hof: Preis, Brief, Liste', R.preis && R.liste, 'Punkte ' + R.punkte + ', Geld ' + R.preisGeld); ok('Zeile in der Hof-Übersicht', R.zeile); ok('Vorfall im Jahr: kein Preis', R.vorfall);
  ok('Sponsor-Angebot ab Ansehen 140, nicht darunter', R.angebot && R.keinAngebot); ok('Futtergutschein 1.500 € ohne Geld', R.gut); ok('Banner nur am Reitplatz', R.banner); ok('Futterkauf verrechnet den Gutschein', R.kauf);
  ok('Ruf unter 110: Sponsoring endet, Gutschein bleibt', R.ende && R.gutBleibt); ok('Geld-Sponsor 1.000 €', R.geld); ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
