// Schimmel-Rarität (v726, Dome 23.10.): die Anlagen „weiß erst spät“, „bleibt lange dunkelgrau“, „Mähne/Schweif sehr früh weiß“ zählen für die Seltenheit,
// die komplette Kombination kann auf dem Raritäten-Markt auftauchen.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/schimmel-rar-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 800 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' → ' + JSON.stringify(x)));
  const R = await pg.evaluate(() => { speicherSperre = true; spiel.admin = true; document.getElementById('dlg').hidden = true; spiel.stufenAn = false; const r = {};
    // 1. Pferd mit Schimmel-Gen und den drei Anlagen
    const p = neuesPferd({ rein: true, rasse: 'andalusier', geschlecht: 'Stute', alter: 7, name: 'Grau' }); const g = genVon(p); g.G = ['G', 'g']; g.E = ['E', 'E']; p.ex = exVon(p); Object.assign(p.ex, { grauTempo: 18, kurve: .85, maehne: .6 }); p.farbe = farbeAus(g, p.ex);
    const S = seltenheit(p, true); r.voll = { stufe: S.stufe, p: S.p, n: S.gen ? S.gen.merkmale.filter(m => m.k === 'GRAU').length : 0 };
    p.ex.grauTempo = 8; p.ex.kurve = .1; p.ex.maehne = 0; r.normal = (seltenGen(p) || { merkmale: [] }).merkmale.filter(m => m.k === 'GRAU').length;
    // 2. ohne Schimmel-Gen keine Schimmel-Rarität
    const q = neuesPferd({ rein: true, rasse: 'andalusier', geschlecht: 'Stute', alter: 7, name: 'Braun' }); const gq = genVon(q); gq.G = ['g', 'g']; q.ex = exVon(q); Object.assign(q.ex, { grauTempo: 18, kurve: .85, maehne: .6 }); r.ohneG = (seltenGen(q) || { merkmale: [] }).merkmale.filter(m => m.k === 'GRAU').length;
    // 3. Raritäten-Markt: alle Rassen mit Schimmel-Gen bieten die Kombinationen an, setzen sie richtig und zeigen den Text
    const rassen = rassenABC().filter(ra => ((RASSE_GENE[ra.id] || {}).G || 0) > 0).map(ra => ra.id); r.rassen = rassen.length; r.angebot = rassen.filter(ra => rarGenotypen(ra, false).some(x => x.key === 'GRAU:voll')).length;
    r.band = SCHIMMEL_KOMBI.map(c => [c.id, c.q]);
    const ra = rassen.includes('andalusier') ? 'andalusier' : rassen[0], h = neuesPferd({ rein: true, rasse: ra, geschlecht: 'Stute', alter: 7, name: 'Rar' }), voll = rarGenotypen(ra, false).find(x => x.key === 'GRAU:voll');
    rarGenSetzen(h, [voll]); r.exH = { t: h.ex.grauTempo, k: h.ex.kurve, m: h.ex.maehne, G: genVon(h).G.join(''), E: genVon(h).E.join('') };
    const S2 = seltenheit(h, true); r.markt = { stufe: S2.stufe, grau: S2.gen.merkmale.filter(m => m.k === 'GRAU').length };
    r.text = JSON.stringify(rarAnpreisung(h)).replace(/<[^>]+>/g, ' ').slice(0, 900); try { seltenDialog(h); r.dialog = true; document.getElementById('dlg').hidden = true; } catch (e) { r.dialog = String(e); }
    // 4. echter Marktlauf: über mehrere Marktjahre taucht die Kombination mindestens einmal auf
    let gefunden = 0, jahre = 0; for (let mj = 1; mj <= 60 && !gefunden; mj++) { jahre = mj; spiel.rar = { mj: 1000 + mj, karte: true, wahl: {}, vor: {}, auk: {}, weg: [], salz: 'x' + mj }; rarCache = null; if (rarAngebot().some(x => x.rarHaupt === 'GRAU:voll')) gefunden = 1; }
    r.marktlauf = { gefunden, jahre };
    try { r.bzn = /Schimmel-Anlagen \(v726\)/.test(weitereDatenHTML()); } catch (e) { r.bzn = String(e); }
    return r; });
  ok('Pferd mit allen drei Anlagen: 3 Merkmale, mindestens „einzigartig“', R.voll.n === 3 && R.voll.stufe >= 3, R.voll);
  ok('normales Schimmel-Pferd: keine Schimmel-Rarität', R.normal === 0, R.normal);
  ok('ohne Schimmel-Gen keine Schimmel-Rarität', R.ohneG === 0, R.ohneG);
  ok('alle Rassen mit Schimmel-Gen können die Kombination anbieten', R.rassen > 3 && R.angebot === R.rassen, [R.rassen, R.angebot]);
  ok('Markt-Pferd bekommt die Werte (18 J., dunkel, Mähne früh), Schimmel-Gen und E/E', R.exH.t === 18 && R.exH.k === .85 && R.exH.m === .6 && /G/.test(R.exH.G) && R.exH.E === 'EE', R.exH);
  ok('Markt-Pferd ist „einzigartig“ oder besser und zeigt 3 Schimmel-Merkmale', R.markt.stufe >= 3 && R.markt.grau === 3, R.markt);
  ok('Anpreisung und Seltenheits-Fenster ohne Fehler', /Schimmel mit seltener Anlage/.test(R.text) && R.dialog === true, [R.text, R.dialog]);
  ok('im Marktlauf taucht die Kombination in einigen Jahren auf', R.marktlauf.gefunden === 1, R.marktlauf);
  ok('Berechnungen zum Nachschlagen (bzn) nennen die Schimmel-Anlagen', R.bzn === true, R.bzn);
  ok('keine Seitenfehler', !errs.length, errs);
  console.log(out.join('\n')); console.log('Anteile:', JSON.stringify(R.band), 'Marktjahre bis zum ersten Fund:', R.marktlauf.jahre); await b.close();
})();
