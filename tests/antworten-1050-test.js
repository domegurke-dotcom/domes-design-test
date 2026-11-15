// v1050 (Domes Antworten 15.11.2026, Zucht + Rassen): Hannoveraner Splash 0,5 %, Kopfstufen Hannoveraner/Oldenburger/Holsteiner, Traber-Rennalter,
// Nachtblindheit 5 % Träger, Inzucht halbiert, Hodenhochstand je Rasse, Wallach mit Hengstverhalten (1/5 echt), Island-Import 20 %/Ekzem ×7/Fohlen-Import, NI 10 %, Körung-Röntgen.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/antworten-1050-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99; while (spiel.boxen.length < 10) spiel.boxen.push(JSON.parse(JSON.stringify({ ...spiel.boxen[spiel.boxen.length - 1], pferd: null, fohlen: null })));
    window.neu = (i, rasse, o) => { const P = neuesPferd({ rasse: rasse || 'hannoveraner', geschlecht: (o && o.g) || 'Wallach', alter: (o && o.alter) || 8, name: 'Test' + i }); P.pflege = erzeugePflege(P); const bx = spiel.boxen[i]; bx.pferd = P; bx.tot = false; bx.fohlen = null; P.befunde = []; return P; };
    window.letzterBrief = () => (spiel.post || [])[0] || {}; });
  let r;
  // 1) Rassen
  r = await pg.evaluate(() => { const n = 3000; let sw = 0; const K = { hannoveraner: 0, oldenburger: 0, holsteiner: 0 }, S = { hannoveraner: 0, oldenburger: 0, holsteiner: 0 };
    for (let i = 0; i < n; i++) { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 5, name: 'h' + i }); if (anzahl(genVon(P), 'Sw') > 0) sw++; }
    for (const ra of Object.keys(K)) for (let i = 0; i < 500; i++) { const k = kopfZufall(ra, Math.random); if (k.f === 'keil') K[ra] = Math.max(K[ra], k.s); if (k.f !== 'keil' && k.f !== 'gerade' && k.f !== 'schaf' && k.f !== 'schwein') S[ra]++; }
    return { sw: sw / n, K, S, holst: Object.keys(RASSE_GENE.holsteiner).filter(g => ['To', 'O', 'Sw'].includes(g)), csnb: ERBKRANK.csnb.rassen.standardbred }; });
  ok('Hannoveraner Splash etwa 1 % Träger (Allel 0,5 %)', r.sw > .003 && r.sw < .02, JSON.stringify(r.sw));
  ok('Köpfe: Hannoveraner/Oldenburger keil höchstens Stufe 1, Holsteiner höchstens 2', r.K.hannoveraner <= 1 && r.K.oldenburger <= 1 && r.K.holsteiner <= 2 && r.K.holsteiner >= 1, JSON.stringify(r.K));
  ok('Holsteiner ohne Schecken-Gene; Nachtblindheit Standardbred 0,05', !r.holst.length && r.csnb === .05, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = { disz: 'trabrennen', rassen: ['traber'], ab: 12 };
    const s = neu(0, 'traber', { g: 'Stute', alter: 11 }), h = neu(1, 'traber', { g: 'Hengst', alter: 14 }), w = neu(2, 'traber', { g: 'Wallach', alter: 15 });
    const T = { tag: spiel.tag + 3 }; const sp = x => { try { return nennSperre(x, T, P); } catch (e) { return 'FEHLER ' + e.message; } };
    return { s: sp(s), h: sp(h), w: sp(w) }; });
  ok('Traber: Stute mit 11 J. und Wallach mit 15 J. zu alt, Hengst mit 14 J. darf', /zu alt/.test(r.s) && !/zu alt/.test(r.h) && /zu alt/.test(r.w), JSON.stringify(r));

  // 2) Zucht
  r = await pg.evaluate(() => ({ verf: Math.round(a18VerfohlenF({}, null) * 100) / 100, coi: Math.round((1 + 4 * coiWirkung(.125)) * 100) / 100, renn: Math.round((1 - .5 * coiWirkung(.125)) * 1000) / 1000,
    k: [VERANLAGUNG.krypt.rassen.friese, VERANLAGUNG.krypt.rassen.isi, VERANLAGUNG.krypt.rassen.hannoveraner, VERANLAGUNG.krypt.rassen.vollblut], ni: A18.niSens, isl: [A18.islandAnteil, A18.islandEkzem, H16.islandImport] }));
  ok('Inzucht halbiert: 12,5 % → Verfohlen ×1,26, Leistung −3 %', r.coi === 1.26 && r.renn === .968, JSON.stringify(r));
  ok('Hodenhochstand Friese 14 %, Isländer 6 %, Warmblut 3 %, Vollblut 1,5 %; NI 10 %; Island 20 %/×7', r.k.join() === '0.14,0.06,0.03,0.015' && r.ni === .1 && r.isl.join() === '0.2,7,7', JSON.stringify(r));
  r = await pg.evaluate(() => { let echt = 0, verh = 0; const n = 20000; for (let i = 0; i < n; i++) { const h = a18Markt({ id: 'w' + i, geschlecht: 'Wallach', rasse: 'hannoveraner' }); if (h.hodenRest) echt++; if (h.hvVerhalten) verh++; } return { echt: echt / n, verh: verh / n }; });
  ok('Markt-Wallache: etwa 0,2 % mit Hodenrest, 0,8 % nur Verhalten', Math.abs(r.echt - .002) < .0015 && Math.abs(r.verh - .008) < .003, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = neu(3, 'hannoveraner'); P.hvVerhalten = true; P.gekauftTag = spiel.tag - 3; a18Tag(); const B = letzterBrief(); return { br: /benimmt sich wie ein Hengst/.test(B.betreff || ''), akt: B.aktion && B.aktion.was }; });
  ok('Wallach mit angelerntem Hengstverhalten: Brief mit Hormontest', r.br && r.akt === 'hvTest', JSON.stringify(r));
  await pg.evaluate(() => { const B = letzterBrief(); B.gelesen = true; zeigePost && zeigePost(); }).catch(() => {});
  r = await pg.evaluate(() => { const B = letzterBrief(); a18AktionAus('hvTest', B, B.aktion); const P = spiel.boxen[3].pferd; return { a: B.aktion.antwort, hv: !!P.hvVerhalten, br: /kein Hodengewebe/.test(letzterBrief().text || '') }; });
  ok('Hormontest: kein Hodengewebe, Brief erklärt angelerntes Verhalten', /kein Hodengewebe/.test(r.a || '') && !r.hv && r.br, JSON.stringify(r));
  r = await pg.evaluate(() => { const P = neu(4, 'isi', { g: 'Stute' }); P.herkunftIsland = true; const a = BEFUND_MAL.sommerekzem(P, spiel.boxen[4], null, 1, 20); P.islandFohlen = true; const f = BEFUND_MAL.sommerekzem(P, spiel.boxen[4], null, 1, 20); return { a, f }; });
  ok('Island-Import: Ekzem ×7, als Fohlen importiert kein Zuschlag', Math.abs(r.a / r.f - 7) < .01, JSON.stringify(r));

  // 3) Körung-Röntgen
  r = await pg.evaluate(() => { const f = neu(5, 'friese', { g: 'Hengst', alter: 3 }), h = neu(6, 'hannoveraner', { g: 'Hengst', alter: 3 }), i4 = neu(7, 'isi', { g: 'Hengst', alter: 4 }), i6 = neu(8, 'isi', { g: 'Hengst', alter: 6 });
    const k = p => a18KoerGesund(p).kosten; return { f: k(f), h: k(h), i4: k(i4), i6: k(i6), t6: /Sprunggelenke/.test(a18KoerGesund(i6).text) }; });
  ok('Körung-Röntgen: Hannoveraner ja, Friese nein, Islandpferd nur Spat ab 5 J.', r.h === 400 && !r.f && !r.i4 && r.i6 === 200 && r.t6, JSON.stringify(r));

  await pg.evaluate(() => { naechsteNacht(); }); await pg.waitForTimeout(300);
  ok('Nacht ohne Fehler', !errs.length, errs.join(' | '));
  console.log(L.join('\n')); console.log(L.filter(x => x.startsWith('✗')).length ? 'ROT' : 'GRÜN'); await b.close();
})();
