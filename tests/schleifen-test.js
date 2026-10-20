// Schleifen-Test (v584, PLAN-SCHLEIFEN.md S1): Zuordnung Turnierart/Platz → Schleife, Übernahme alter Spielstände, Brief-Platzhalter, Turnier-Nacht
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/schleifen-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); const zu = () => { document.getElementById('dlg').hidden = true; };
    window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {}; window.reaktionZeigen = () => {};
    zu(); spiel.tippsAus = true; spiel.admin = false; spiel.geld = 1e6; spiel.stufenAn = false;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); return p; };
    // --- 1. Regeln (Abschnitt 2) ---
    const R = (art, platz, pl, aus, titel) => JSON.stringify(schleifeRegel(art, platz, pl, aus, titel));
    ok('Platz 1–6 farbig (Regional: Stufe 2)', [1, 2, 3, 4, 5, 6].every(x => R('regional', x, true) === JSON.stringify({ st: 2, pl: x, c: false })));
    ok('Platziert, aber Platz 7: braun, auf jedem Turnier', R('gross', 7, true) === '{"st":3,"pl":0,"c":false}' && R('regional', 9, true) === '{"st":2,"pl":0,"c":false}');
    ok('Nicht platziert: nur Haus-/Hofturnier braun', R('hof', 8, false) === '{"st":1,"pl":0,"c":false}' && R('regional', 8, false) === 'null' && R('gross', 8, false) === 'null' && R('championat', 8, false) === 'null');
    ok('Ausgeschieden: nie', R('hof', 3, true, true) === 'null' && R('distanz', 1, true, true) === 'null');
    ok('Titel + Platz 1 = Champion, Platz 2 mit Titel nicht', R('championat', 1, true, false, true) === '{"st":4,"pl":1,"c":true}' && R('championat', 2, true, false, true) === '{"st":4,"pl":2,"c":false}');
    ok('Stufen je Turnierart', [['hof', 1], ['regional', 2], ['distanz', 2], ['gangpferde', 2], ['renntag', 2], ['fohlenschau', 2], ['gross', 3], ['championat', 4], ['international', 4]].every(([a, s]) => schleifenStufe(a) === s));
    // --- 2. Bilder ---
    const alle = []; for (let st = 1; st <= 4; st++) for (let pl = 0; pl <= 6; pl++) alle.push(schleifeSVG(st, pl, false, 32)); alle.push(schleifeSVG(4, 1, true, 32));
    ok('29 Schleifenbilder', alle.length === 29 && alle.every(s => s.startsWith('<svg')));
    const host = document.createElement('div'); host.innerHTML = alle.join(''); const ids = [...host.querySelectorAll('radialGradient')].map(g => g.id);
    ok('Alle Bilder lesbar, Verlaufs-IDs eindeutig', host.querySelectorAll('svg').length === 29 && new Set(ids).size === 29, new Set(ids).size + ' IDs');
    ok('Größe einstellbar (58 px)', /width="58"/.test(schleifeSVG(2, 1, false, 58)));
    ok('Stufe 1/2 Zahl, Stufe 3/4 Pferdekopf, braun Hufeisen', />1<\/text>/.test(schleifeSVG(1, 1, false)) && !/<text/.test(schleifeSVG(3, 1, false)) && /M13\.3,16\.4/.test(schleifeSVG(3, 0, false)) && /M13\.3,16\.4/.test(schleifeSVG(1, 0, false)));
    // --- 3. Übernahme alter Spielstände ---
    const p = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Alt' });
    p.erfolge = [
      { tag: 50, turnier: 'Champ', art: 'championat', disz: 'dressur', stufe: 3, pruef: 'Dressur Kl. M', platz: 1, von: 10, plaziert: true },
      { tag: 40, turnier: 'Reg', art: 'regional', disz: 'dressur', stufe: 2, pruef: 'Dressur Kl. L', platz: 2, von: 14, plaziert: true },
      { tag: 30, turnier: 'Hof', art: 'hof', disz: 'dressur', stufe: 0, pruef: 'Dressurwettbewerb', platz: 9, von: 12, plaziert: false },
      { tag: 20, turnier: 'Reg', art: 'regional', disz: 'springen', stufe: 1, pruef: 'Springen A', platz: 9, von: 12, plaziert: false },
      { tag: 10, turnier: 'Vorbesitzer', art: 'gross', disz: 'dressur', stufe: 2, pruef: 'Dressur Kl. L', platz: 5, von: 20, plaziert: true, frueher: true },
      { tag: 5, turnier: 'Distanz', art: 'distanz', disz: 'distanz', stufe: 0, pruef: 'Distanzritt 60 km', platz: 12, von: 12, plaziert: false, aus: true }];
    p.titel = [{ titel: 'Championat Dressur', pruef: 'Dressur Kl. M', tag: 50 }];
    const L = schleifenHolen(p);
    ok('Übernahme: 4 Schleifen (Champion, Platz 2, Hof braun, Vorbesitzer Platz 5); unplatziert/ausgeschieden keine', L.length === 4, JSON.stringify(L.map(e => e.st + ':' + e.pl + (e.c ? 'c' : ''))));
    ok('Übernahme: Champion aus p.titel, Reihenfolge alt → neu', L[3].c === true && L[0].tag === 10 && L[3].tag === 50);
    ok('Übernahme nur einmal (Merker, keine Verdopplung)', schleifenHolen(p).length === 4 && p.schleifenV === 1);
    const f = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Fohlen' });
    f.fohlenschau = { tag: 3, schau: 'Schau', klasse: 'Stutfohlen', platz: 1, von: 8, praemie: true, champion: true }; f.championat = { tag: 4, name: 'Fohlenchampionat', platz: 5, von: 12, plaziert: false };
    const LF = schleifenHolen(f);
    ok('Fohlenschau: Fohlenchampion = Champion-Schleife; unplatziertes Championat keine', LF.length === 1 && LF[0].c === true && LF[0].st === 2, JSON.stringify(LF));
    // --- 4. neue Schleife: erst Übernahme, dann Eintrag (keine Doppelzählung) ---
    const q = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Neu' }); q.erfolge = [{ tag: 1, turnier: 'X', art: 'regional', pruef: 'Dressur Kl. A', platz: 3, von: 10, plaziert: true }];
    const e = schleifeGeben(q, 'gross', 2, 16, true, false, 'Dressur Kl. L', 'Großes Turnier'); q.erfolge.unshift({ tag: spiel.tag, art: 'gross', pruef: 'Dressur Kl. L', platz: 2, von: 16, plaziert: true });
    ok('schleifeGeben: Übernahme + neue Schleife = 2, kein Duplikat', q.schleifen.length === 2 && e.st === 3 && e.pl === 2 && e.platz === 2 && e.von === 16 && e.tag === spiel.tag);
    ok('Nicht platziert (Großes Turnier): keine Schleife', schleifeGeben(q, 'gross', 11, 16, false, false, 'x', 'y') === null && q.schleifen.length === 2);
    const r = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Viel' }); for (let i = 0; i < 320; i++) schleifeGeben(r, 'hof', 1, 5, true, false, 'x', 'y');
    ok('Obergrenze 300', r.schleifen.length === 300);
    // --- 5. Brief-Platzhalter ---
    ok('Marke: [[S:2:1]], [[S:2:0]], [[S:c]]', schleifeMarke({ st: 2, pl: 1 }) === '[[S:2:1]]' && schleifeMarke({ st: 2, pl: 0 }) === '[[S:2:0]]' && schleifeMarke({ st: 4, pl: 1, c: true }) === '[[S:c]]' && schleifeMarke(null) === '');
    const t0 = '<li>[[S:3:2]] A</li><li>[[S:c]] B</li><li>[[S:1:0]] C</li>', t1 = schleifenErsetzen(t0);
    ok('Platzhalter wird zu SVG (58 px), Text bleibt', (t1.match(/<svg/g) || []).length === 3 && !/\[\[S:/.test(t1) && /width="58"/.test(t1));
    brief('Turnierbüro', 'Ergebnis: Test', '<ul>' + t0 + '</ul>', {}); const br = spiel.post[0];
    ok('Brief speichert nur den Platzhalter (kein SVG im Spielstand)', br.text.includes('[[S:3:2]]') && !br.text.includes('<svg'));
    ok('Anzeige im Brief ersetzt ihn', (briefMitLinks(br, br.text).match(/<svg/g) || []).length === 3);
    // --- 6. Turnier-Nacht: Brief + p.schleifen passen zusammen ---
    const arten = ['hof', 'regional', 'gross', 'championat', 'gangpferde', 'renntag'];
    let schlN = 0, markeN = 0, ohne = 0, fehl = [];
    arten.forEach((art, ai) => { for (let n = 0; n < 6; n++) {
      const x = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'T' + ai + n }); x.werte = x.werte || erzeugeWerte(x); werteErgaenzen(x); x.erfolge = [];
      const bx = spiel.boxen[0]; bx.pferd = x; bx.tot = false;
      const t = { id: 'tt' + ai + n, tag: spiel.tag, art, name: 'Testturnier ' + art, halle: false, nennung: [{ pid: x.id, prid: 'p1' }], pruef: [{ id: 'p1', disz: 'dressur', stufe: 1, name: 'Dressur Kl. A', starter: 12 + n * 2, titel: art === 'championat' ? 'Championat Dressur' : undefined }] };
      spiel.turniere = (spiel.turniere || []).concat([t]); x.turnier = { tid: t.id, tag: spiel.tag };
      const n0 = spiel.post.length;
      try { turnierNacht(); } catch (er) { fehl.push(er.message); return; }
      const bf = spiel.post[0], E = x.erfolge[0], S = (x.schleifen || []), soll = E ? schleifeRegel(art, E.platz, E.plaziert, false, E.platz === 1 && !!t.pruef[0].titel) : null;
      if (!E) { fehl.push('kein Erfolg ' + art); return; }
      if (!!soll !== (S.length === 1) ) fehl.push(art + ': Schleife ' + S.length + ' soll ' + JSON.stringify(soll));
      if (soll && S[0].st !== soll.st) fehl.push(art + ' Stufe');
      const hatM = /\[\[S:/.test(bf.text); if (hatM !== !!soll) fehl.push(art + ': Marke ' + hatM + ' soll ' + !!soll); if (hatM) markeN++; if (S.length) schlN++; else ohne++;
      if (/🥇|🥈|🥉|🎀/.test(bf.text)) fehl.push('Emoji im Brief');
    } });
    ok('Turnier-Nacht (36 Starts, 6 Arten): Brief-Marke und p.schleifen stimmen mit den Regeln überein', fehl.length === 0, (fehl.join(' | ') || '') + ` · ${schlN} mit, ${ohne} ohne Schleife`);
    ok('Turnier-Nacht: Schleife im Steckbrief-Erfolge (kleine Schleife)', (() => { const h = erfolgSchleife({ art: 'regional', platz: 1, plaziert: true }); return /width="22"/.test(h); })());
    ok('Alte Brief-Texte mit Emoji bleiben unverändert', schleifenErsetzen('🥇 Sieg 🎀') === '🥇 Sieg 🎀');
    return out;
  });
  // ==================== S2: Pinnwand in der Box (eigene Seite, echte Stallzeichnung) ====================
  const pg2 = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg2.on('pageerror', e => errs.push(e.message));
  await pg2.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg2.waitForTimeout(700);
  await pg2.click('#smNeu'); await pg2.waitForTimeout(150); await pg2.fill('#chName', 'Test'); await pg2.click('#chLos'); await pg2.waitForTimeout(150);
  await pg2.click('#dlgKnoepfe button'); await pg2.click('[data-immo="pension"]'); await pg2.fill('#kaufName', 'Testhof'); await pg2.click('#dlgKnoepfe button:first-child'); await pg2.waitForTimeout(400);
  const R2 = await pg2.evaluate(() => {
    const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false;
    const neu = o => { const p = neuesPferd(o); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); return p; };
    const p = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Wand' }); p.erfolge = [];
    [['hof', 0, 1], ['regional', 2, 2], ['gross', 1, 3], ['championat', 1, 4], ['regional', 5, 5], ['hof', 3, 6], ['gross', 6, 7], ['regional', 4, 8], ['regional', 1, 9], ['hof', 2, 10], ['championat', 2, 11]].forEach(([a, pl, t]) => { spiel.tag = t; schleifeGeben(p, a, pl || 9, 12, true, a === 'championat' && pl === 1, 'P' + t, 'T' + t); });
    const S = schleifenSortiert(p), sig = S.map(e => (e.c ? 'c' : '') + e.st + ':' + e.pl).join(' ');
    ok('Reihenfolge: Champion, Stufe 4 → 1, Platz 1 → 6, braun zuletzt', sig === 'c4:1 4:2 3:1 3:6 2:1 2:2 2:4 2:5 1:2 1:3 1:0', sig);
    const q = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Gleich' }); q.erfolge = []; spiel.tag = 3; schleifeGeben(q, 'regional', 1, 10, true, false, 'alt', 'a'); spiel.tag = 8; schleifeGeben(q, 'regional', 1, 10, true, false, 'neu', 'b');
    ok('Gleichstand: die neueste zuerst', schleifenSortiert(q)[0].pruef === 'neu');
    const svg = pinnwandSVG(p, 266.5, 84); ok('Wand zeigt höchstens 9 Schleifen (3 × 3)', (svg.match(/class="schleife"/g) || []).length === 9);
    ok('Ohne Schleife keine Pinnwand', pinnwandSVG(neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 9, name: 'Leer' }), 0, 0) === '');
    const b0 = spiel.boxen[0]; b0.pferd = p; b0.tot = false; b0.leckstein = jzJetzt(); aktBox = 0; spiel.aktBox = 0;
    const zeig = f => { delete b0.paddock; delete b0.abfohl; f(b0); zeigeSchirm(null); zeigeStall(); const g = document.querySelector('#stall .sPinn'); return g; };
    [[1, [260.5, 86]], [2, [266.5, 84]], [3, [272.5, 82]]].forEach(([st, l]) => { const g = zeig(x => { x.stufe = st; }); const r = g && g.querySelector('rect[rx="3"]');
      ok(`Stufe ${st}: Pinnwand 60 × 55 an ${l.join(' / ')}`, !!r && +r.getAttribute('x') === l[0] && +r.getAttribute('y') === l[1] && +r.getAttribute('width') === 60 && +r.getAttribute('height') === 55 && g.style.display !== 'none'); });
    { const g = zeig(x => { x.stufe = 3; x.paddock = true; }), r = g && g.querySelector('rect[rx="3"]'); ok('Paddockbox (Stufe 3): Lage wie Stufe 2 (266,5 / 84)', !!r && +r.getAttribute('x') === 266.5 && +r.getAttribute('y') === 84); }
    { const g = zeig(x => { x.stufe = 2; }), wand = g.parentNode, pf = document.getElementById('pferdPlatz') || document.getElementById('pferd');
      ok('Pinnwand liegt in der Wand-Gruppe (hinter dem Pferd)', wand.classList.contains('stufeEl') && !!pf && !!(wand.compareDocumentPosition(pf) & Node.DOCUMENT_POSITION_FOLLOWING)); }
    { const g = zeig(x => { x.stufe = 3; x.abfohl = true; }); ok('Abfohlbox: Pinnwand wird mit der Rückwand verkleinert (liegt in .abfHinten)', !!g && !!g.closest('.abfHinten'));
      const lampe = [...document.querySelectorAll('#stall .abfohlEl g[transform*="scale(1.35)"]')][0], tr = lampe && lampe.getAttribute('transform').match(/translate\(([\d.]+),([\d.]+)\)/);
      const ex = 200 + (272.5 + 60 - 200) * 0.8, ey = 86 + (82 + 55 - 86) * 0.8; ok('Abfohlbox: Rotlichtlampe rechts neben der Pinnwand, berührt die untere rechte Ecke', !!tr && Math.abs(+tr[1] - 14.85 - ex) < 1.5 && Math.abs(+tr[2] + 15 - ey) < 1.5, tr && tr.slice(1).join(',')); }
    { zeig(x => { x.stufe = 1; }); const l = document.querySelector('#stall .sLeck rect'); ok('Leckstein links vom Fenster (x 107)', !!l && +l.getAttribute('x') === 107); }
    { zeig(x => { x.stufe = 3; }); const l = document.querySelector('#stall .sLeck rect'); ok('Stufe 3: Leckstein rechts neben dem Heunetz (x 116, Heunetz endet bei ~118, Fensterrahmen ab 132)', !!l && +l.getAttribute('x') === 116);
      ok('Stufe 3: kein goldenes Namensschild mehr', !document.querySelector('#stall .sName')); }
    { b0.tot = true; const g = zeig(x => { x.stufe = 2; }); ok('Totes Pferd: keine Pinnwand', g.style.display === 'none' && g.innerHTML === ''); b0.tot = false; }
    { const f = neu({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 0, name: 'Fohlen' }); f.erfolge = []; schleifeGeben(f, 'fohlenschau', 1, 8, true, true, 'Stutfohlen', 'Schau'); b0.fohlen = f; const g = zeig(x => { x.stufe = 2; }); ok('Mit Fohlen bei Fuß: Pinnwand zeigt die Schleifen der Mutter', (g.innerHTML.match(/class="schleife"/g) || []).length === 9 && !/Champion-Schleife.*Fohlen/.test(g.innerHTML)); delete b0.fohlen; }
    { const g = zeig(x => { x.stufe = 2; }); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); const ov = document.getElementById('pinnGross'), n = () => (ov.innerHTML.match(/class="pinn-s"/g) || []).length;
      ok('Antippen öffnet die große Pinnwand mit allen Schleifen (11), abgedunkelter Hintergrund', !!ov && !ov.hidden && n() === 11 && getComputedStyle(ov).position === 'fixed');
      ok('Standard „nach Jahr“: Jahresüberschriften, neuestes Jahr zuerst', ov.querySelectorAll('.pinn-jahr').length >= 1 && (() => { const J = [...ov.querySelectorAll('.pinn-jahr')].map(h => +h.textContent.replace(/\D/g, '')); return J.every((v, i) => !i || J[i - 1] > v); })());
      ov.querySelector('[data-psort="klasse"]').click(); ok('„nach Klasse“: ohne Jahresüberschriften, gespeichert in spiel.pinnSort', !document.querySelector('#pinnGross .pinn-jahr') && spiel.pinnSort === 'klasse' && n() === 11);
      ok('Reihenfolge nach Klasse = Wand-Reihenfolge', [...document.querySelectorAll('#pinnGross .pinn-s')].map(b => b.getAttribute('aria-label').split(' · ')[0]).length === 11);
      ov.querySelector('.pinn-zu').click(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); ok('Letzte Auswahl wird beim nächsten Öffnen wieder eingestellt', !document.querySelector('#pinnGross .pinn-jahr') && document.querySelector('#pinnGross [data-psort="klasse"]').classList.contains('an'));
      document.querySelector('#pinnGross .pinn-s').click(); const bl = document.querySelector('#pinnGross .pinn-blase'); ok('Tipp auf eine Schleife: Blase mit Prüfung, Platz, Turnier, Jahreszeit', !bl.hidden && /Platz von|Sieger/.test(bl.textContent) && /Jahr \d+/.test(bl.textContent), bl.textContent);
      ov.querySelector('.pinn-karte').dispatchEvent(new MouseEvent('click', { bubbles: true })); ok('Tipp in die Karte schließt nicht', !ov.hidden);
      ov.dispatchEvent(new MouseEvent('click', { bubbles: true })); ok('Tipp neben die Pinnwand schließt', ov.hidden);
      g.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); ok('Auch mit Tastatur (Enter) und ✕ schließt', !ov.hidden && (ov.querySelector('.pinn-zu').click(), ov.hidden));
      g.dispatchEvent(new MouseEvent('click', { bubbles: true })); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); ok('Escape schließt', ov.hidden); spiel.pinnSort = 'jahr'; }
    ok('Tipp-Text: Prüfung · Platz von Starter / Turnier / Jahreszeit, Jahr', /^P\d+ · \d\. Platz von 12 \/ T\d+ \/ (Frühling|Sommer|Herbst|Winter), Jahr \d+$/.test(schleifeText(S[2])), schleifeText(S[2]));
    return out;
  });
  R.push(...R2);
  R.forEach(l => console.log(l)); console.log(errs.length ? 'Seitenfehler: ' + errs.join(' | ') : 'keine Seitenfehler');
  const bad = R.filter(l => l.startsWith('✗')).length + errs.length; console.log(bad ? 'Fehler ' + bad : 'alles ok'); await b.close(); process.exit(bad ? 1 : 0);
})();
