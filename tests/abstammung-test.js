// Abstammungs-Test (Dome 20.10.2026): erfolgreiche Eltern/Großeltern heben den Marktwert (vor allem bei Fohlen), Prämien-/Champion-Nachkommen heben den Wert der Eltern
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/abstammung-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true;
    const neu = (g, n, a) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: g, alter: a, name: n }); p.pflege = erzeugePflege(p); ahnenFuellen(p); return p; };
    const M = neu('Stute', 'Mama', 9), V = neu('Hengst', 'Papa', 10); spiel.boxen[0].pferd = M; spiel.boxen[1].pferd = V; nrVon(M); nrVon(V);
    const fohlen = () => { const f = neu('Stute', 'Kleine', 0); f.ahnen = ahnenAus(M, V); f.geb = { ...datum() }; f.gebTag = spiel.tag; return f; };
    const f0 = fohlen(), w0 = marktwert(f0);
    const sieg = n => Array.from({ length: n }, () => ({ plaziert: true, stufe: 4, platz: 1, art: 'gross', disz: 'dressur', tag: 1 }));
    M.erfolge = sieg(12); V.erfolge = sieg(12); nrKarte = null;
    const w1 = marktwert(f0); ok('Fohlen erfolgreicher Eltern ist mehr wert (Eltern leben bei dir: aktueller Stand)', w1 > w0 * 1.25 && w1 <= w0 * 1.55, w0 + ' → ' + w1);
    const f2 = fohlen(); M.erfolge = []; V.erfolge = []; nrKarte = null; spiel.boxen[0].pferd = null; spiel.boxen[1].pferd = null; nrKarte = null;
    ok('Eltern nicht mehr da: Stand beim Decken zählt (Schnappschuss ruf)', f2.ahnen.vater.ruf && f2.ahnen.vater.ruf.e > 0 && marktwert(f2) > marktwert({ ...f2, ahnen: null }) * 1.2, JSON.stringify(f2.ahnen.vater.ruf));
    spiel.boxen[0].pferd = M; spiel.boxen[1].pferd = V; nrKarte = null;
    const alt = fohlen(); alt.geb = null; alt.alter = 8; alt.erfolge = []; M.erfolge = sieg(12); V.erfolge = sieg(12); nrKarte = null;
    const zA = abstFaktor(alt), zJ = abstFaktor(f0); ok('Wirkt bei Jungen stärker als bei älteren Pferden', zJ > zA && zA > 1, zJ.toFixed(3) + ' / ' + zA.toFixed(3));
    alt.erfolge = sieg(10); ok('Eigene Erfolge machen den Zuschlag kleiner', abstFaktor(alt) < zA, abstFaktor(alt).toFixed(3));
    ok('Höchstens +50 %', abstZuschlag(f0) <= 0.5, abstZuschlag(f0).toFixed(3));
    const mv0 = marktwert(M), vv0 = marktwert(V); const k = fohlen(); elternGutschrift(k, M, 'praemienFohlen'); elternGutschrift(k, M, 'championFohlen');
    ok('Prämien-/Championfohlen: Mutter und Vater werden wertvoller', marktwert(M) > mv0 && marktwert(V) > vv0 && V.praemienFohlen === 1 && V.championFohlen === 1, mv0 + '→' + marktwert(M) + ' · ' + vv0 + '→' + marktwert(V));
    const ohne = neu('Wallach', 'Markt', 4); ok('Marktpferd ohne bekannte Erfolge der Ahnen: kein Zuschlag', abstFaktor(ohne) === 1);
    // Dome 20.10.: Marktpferde mit bekannten, erfolgreichen Eltern – Gestüt am häufigsten, Händler selten
    const schnitt = L => L.reduce((x, h) => x + abstZuschlag(h), 0) / Math.max(1, L.length);
    const G = ['hannoveraner', 'trakehner', 'araber', 'haflinger', 'friese', 'quarter'].flatMap(r => gestuetPferde(r)), H = marktpferde().filter(h => reinAnteil(h.anteile, h.rasse) >= 99);
    ok('Gestütspferde haben öfter erfolgreiche Eltern als Händlerpferde', schnitt(G) > schnitt(H) && G.some(h => h.ahnen.vater.ruf), schnitt(G).toFixed(3) + ' / ' + schnitt(H).toFixed(3));
    return out.join('\n'); });
  console.log(R); console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close();
})();
