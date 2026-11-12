// v1006 (Dome 12.11.2026): Deckhengst Etappe 3 – eigene Besamungsstation (nur Experte): Erlaubnis, Plätze, Hengst bleibt daheim, Pauschale, Tiefgefriersamen, Gasthengste, EU-Zulassung
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x)); const zu = () => { document.getElementById('dlg').hidden = true; };
    zu(); spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 200000; spiel.kal = null; spiel.tag = 1; zbBestand();
    const rnd = Math.random, mitZufall = (z, f) => { Math.random = () => z; try { f(); } finally { Math.random = rnd; } };
    // Stufen-Sperre: nur Experte
    spiel.stufenAn = true; spiel.spieler.stufe = 'fort'; ok('Fortgeschritten: Station gesperrt', !freiStufe('bauen', 'besamung')); spiel.spieler.stufe = 'exp'; ok('Experte: Station frei', freiStufe('bauen', 'besamung')); spiel.stufenAn = false;
    ok('Gebäude in der Bauliste und im Hofplan', !!BAUTEN.besamung && BAU_REIHE.includes('besamung') && planMassTyp('besamung', 0, 2).join() === '5,3', planMassTyp('besamung', 0, 2));
    const mk = (n, i, gekoert = true) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 6, name: n }); P.anteile = { hannoveraner: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; ahnenFuellen(P); nrVon(P);
      if (gekoert) P.hb = { s: 'end', tag: 1 }; P.deckFremd = { an: true, versand: true, natur: true, test: datum().j }; spiel.boxen[i].pferd = P; return P; };
    const H1 = mk('Atlas', 0), H2 = mk('Boreas', 1, false);
    const g = { gid: 'gbst', typ: 'besamung', stufe: 1, zustand: 100, preis: BAUTEN.besamung.preis[0], bau: { art: 'neu', rest: 5 } }; gebaeude().push(g);
    ok('Im Bau: Station arbeitet nicht', bstStufe() === 0 && !bstAktiv());
    // Erlaubnis beantragen (geht schon im Bau)
    besamungDialog(null); const ab = $('bstAntrag'); ok('Fenster mit Antrag-Knopf', !!ab && /Vertragstierarzt/.test($('dlg').textContent)); const g0 = spiel.geld; if (ab) ab.click();
    ok('Antrag gestellt (300 €, Wartezeit 1 Jahreszeit)', g.erl && g.erl.ab === spiel.tag + tpj() && g0 - spiel.geld === BST.antrag, JSON.stringify(g.erl) + ' ' + (g0 - spiel.geld)); zu();
    delete g.bau; spiel.tag = g.erl.ab; bstTag();
    ok('Nur 1 gekörter Hengst: Erlaubnis noch offen, Brief', !g.erl.ok && (spiel.post || []).some(x => /Erlaubnis noch offen/.test(x.betreff || '')));
    H2.hb = { s: 'end', tag: 1 }; const g1 = spiel.geld; spiel.tag++; bstTag();
    ok('2 gekörte Hengste: Erlaubnis erteilt, Tierarzt bezahlt', !!g.erl.ok && g1 - spiel.geld === BST.tierarzt && bstAktiv(), JSON.stringify(g.erl) + ' ' + (g1 - spiel.geld));
    ok('Hengst hat Platz auf der eigenen Station', bstPlatzFuer(H1) && bstPlatzFuer(H2));
    const H3 = mk('Castor', 2); ok('Stufe 1: nur 2 Plätze – dritter Hengst ohne Platz', !bstPlatzFuer(H3) && bstPlatzFrei() === 0); spiel.boxen[2].pferd = null;
    // v1007: nur gekörte Hengste auf die Station, kranke zählen für die Erlaubnis mit
    { const U = mk('Ungekört', 2, false); ok('Ungekörter Hengst bekommt keinen Stationsplatz', !bstEigene().includes(U) && !bstPlatzFuer(U));
      deckhengstDialog(U, null); const tx = [...document.querySelectorAll('[data-dhtaxe]')].map(x => +x.dataset.dhtaxe); ok('Ungekört: Decktaxe-Knöpfe höchstens 250 €, 250 € markiert', tx.every(t => t <= DH.ungekoertTaxe) && +document.querySelector('[data-dhtaxe].an').dataset.dhtaxe === dhTaxe(U), tx.join()); zu(); spiel.boxen[2].pferd = null; }
    { const bf = befundNeu(H2, 'verletzung', 3, 'Test'); ok('Kranker gekörter Hengst zählt für die Erlaubnis', bstHengste().includes(H2) && bstAktiv()); H2.befunde = (H2.befunde || []).filter(x => x !== bf); }
    // Anfrage mit eigener Station: Pauschale, Hengst bleibt daheim
    spiel.kal = null; spiel.tag = 2; mitZufall(0.01, () => { delete H1.deckFremd.anfrageTag; deckhengstTag(); });
    const A = (spiel.deckAnfragen || []).find(a => a.pid === H1.id && a.status === 'offen'); ok('Anfrage über die eigene Station (mit Pauschale)', !!A && A.art !== 'natur' && A.pauschale === bstPauschale(), JSON.stringify(A));
    if (A) { A.art = 'station'; A.gast = false; const br = spiel.post.find(x => x.aktion && x.aktion.aid === A.id); dhAntwort(br, true);
      const g2 = spiel.geld; spiel.tag = A.tag; dhTermineTag();
      ok('Besamt auf dem Hof: Hengst nicht außer Haus, kein Stallgeld', A.status === 'gedeckt' && H1.stationTag !== spiel.tag, A.status + ' ' + H1.stationTag);
      ok('Pauschale + halbe Decktaxe bekommen', spiel.geld - g2 === Math.round(A.taxe / 2) + A.pauschale && g.n === 1, spiel.geld - g2);
      ok('Brief an Besitzerin unterschreibt mit „Ihre“', (() => { const x = spiel.post.find(y => /Bedeckung/.test(y.betreff || '')); return !x || !A.w || x.w === true || /Ihre/.test(JSON.stringify(x)); })(), JSON.stringify(spiel.post.find(y => /Bedeckung/.test(y.betreff || '')) || {}).slice(0, 200));
      ok('Brief nennt die eigene Station',(spiel.post || []).some(x => /Besamungsstation mit Frischsamen/.test(x.text || x.inhalt || JSON.stringify(x)))); }
    deckhengstDialog(H1, null); ok('Deckhengst-Fenster nennt die eigene Station', /eigene Besamungsstation/.test($('dlg').textContent) && !!$('dhBst')); zu();
    // Stufe 2: Tiefgefriersamen
    g.stufe = 2; H1.energie = 100; besamungDialog(null); const tb = document.querySelector(`[data-bsttg="${H1.id}"]`); ok('Stufe 2: Knopf Einfrieren', !!tb); const g3 = spiel.geld; if (tb) tb.click(); zu();
    const L = (g.tg || [])[0]; ok('8 Portionen im Lager, 150 € bezahlt', L && L.portionen === BST.tgPortionen && g3 - spiel.geld === BST.tgKosten, JSON.stringify(g.tg) + ' ' + (g3 - spiel.geld));
    besamungDialog(null); ok('Heute kein zweites Mal', !document.querySelector(`[data-bsttg="${H1.id}"]`)); zu();
    spiel.tag++; const g4 = spiel.geld; mitZufall(0, () => bstTag()); ok('Portion verkauft', L && L.portionen === BST.tgPortionen - 1 && spiel.geld > g4, L && L.portionen);
    spiel.boxen[0].pferd = null; spiel.boxen[0].pferd = H1;   // Hengst bleibt
    // Gasthengst im Winter für die nächste Decksaison
    const j = datum().j; spiel.tag = 1 + 3 * tpj() + 1; mitZufall(0.001, () => bstTag());
    const G = (g.gaeste || []).find(x => x.status === 'offen'), bg = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'bstGast');
    ok('Winter: Anfrage eines Gasthengsts für nächstes Jahr', !!G && G.jahr === j + 1 && !!bg && /bg-ja/.test(briefAktionHTML(bg)), JSON.stringify(g.gaeste));
    if (G && bg) { bstGastAntwort(bg, true); ok('Gasthengst zugesagt', G.status === 'ok');
      spiel.tag = 1 + 4 * tpj(); H1.deckFremd.test = H2.deckFremd.test = datum().j; for (let i = 0; i < 3; i++) { mitZufall(0.01, () => bstTag()); spiel.tag++; }
      ok('Decksaison: Tage und Besamungen gezählt', G.tage === 3 && G.n >= 1, G.tage + '/' + G.n);
      const g5 = spiel.geld, tg5 = (g.tg || []).reduce((x, L) => x + (L.summe || 0), 0); spiel.tag = 1 + 6 * tpj(); const portVor = (g.tg || []).reduce((a, x) => a + x.portionen, 0); /* Lagergebühr gilt für die Portionen vor einem zufälligen Verkauf */ bstTag(); const tgPlus = (g.tg || []).reduce((x, L) => x + (L.summe || 0), 0) - tg5;
      ok('Herbst: Abrechnung des Gasthengsts', G.status === 'fertig' && spiel.geld - g5 - tgPlus + BST.tierarzt + portVor * BST.tgLager === G.summe && G.summe > 0, G.status + ' ' + (spiel.geld - g5) + ' / ' + G.summe); }
    // Stufe 3: EU-Zulassung
    g.stufe = 3; besamungDialog(null); const eb = $('bstEU'); ok('Stufe 3: Knopf EU-Zulassung', !!eb); if (eb) eb.click(); zu();
    spiel.tag = g.eu.ab; bstTag(); ok('EU-Zulassung: höhere Pauschale', bstEU() && bstPauschale() === Math.round(BST.pauschale * BST.euF / 10) * 10, bstPauschale());
    ok('Stufe 3: 8 Plätze', bstPlaetze() === 8);
    // Ohne Station: Besamung wie bisher außer Haus
    gebaeude().splice(gebaeude().indexOf(g), 1); ok('Ohne Station: kein Platz mehr', !bstPlatzFuer(H1) && !bstAktiv());
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
