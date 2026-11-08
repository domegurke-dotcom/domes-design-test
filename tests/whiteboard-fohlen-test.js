// v959 (Dome 8.11.): Pferdewirt Zucht übt mit Fohlen ABC und Duschen, wenn es im Whiteboard (Dein Wunsch an die Mitarbeiter) so gewählt ist
// Start: node tests/whiteboard-fohlen-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); const dlgZu = () => { document.getElementById('dlg').hidden = true; };
    dlgZu(); spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e6; VET.verbotAb = 99;
    const mk = (name, g, alter) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    const box = spiel.boxen[0], M = mk('Mama', 'Stute', 8), V = mk('Papa', 'Hengst', 8); box.pferd = M; const f = geburt(box, V, true); f.gebTag = spiel.tag - 20; box.fohlen = f;
    const wbSeite = () => { wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); return [...document.querySelectorAll('[data-wbwu]')].map(x => x.dataset.wbwu); };
    // 1. ohne Pferdewirt keine Haken
    ok('Ohne Pferdewirt: keine Haken Fohlen-ABC/duschen', !wbSeite().some(k => /:(abc|duschen)$/.test(k)), wbSeite().join());
    // 2. Pferdewirt Zucht angestellt
    const x0 = bewerber('pferdewirt')[0], m = { id: 'pz1', typ: 'pferdewirt', name: 'Zora', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    ok('Pferdewirt ist aktiv', aktive('pferdewirt').length === 1);
    let k = wbSeite(); ok('Haken Fohlen-ABC da', k.includes('0:abc'), k.join()); ok('Haken Fohlen duschen fehlt ohne Waschplatz', !k.includes('0:duschen'), k.join());
    ok('Fohlen-ABC standardmäßig an, Duschen aus', wunschEin(M, 'abc') && !wunschEin(M, 'duschen'));
    // 3. Nacht ohne Waschplatz: ABC ja, Duschen nein
    mitarbeiterTag(); ok('ABC geübt (abcTag heute)', f.abcTag === spiel.tag, f.abcTag + ' / ' + spiel.tag); ok('Kein Duschen ohne Waschplatz', f.duschTag == null);
    // 4. Waschplatz, Duschen noch aus → nicht
    spiel.gebaeude = spiel.gebaeude || []; spiel.gebaeude.push({ id: 'wp1', typ: 'waschplatz', stufe: 2 }); delete f.abcTag; k = wbSeite(); ok('Mit Waschplatz: Haken Fohlen duschen da', k.includes('0:duschen'), k.join());
    mitarbeiterTag(); ok('Duschen standardmäßig aus → nicht geduscht', f.duschTag == null && f.abcTag === spiel.tag, f.duschTag);
    // 5. Haken an → duscht
    delete f.abcTag; M.leist = { duschen: true }; mitarbeiterTag(); ok('Haken an: Fohlen geduscht (duschTag heute)', f.duschTag === spiel.tag, f.duschTag + ' / ' + spiel.tag); ok('Wasser gewöhnt zählt', (f.wasserGewohnt || 0) >= 1);
    // 6. ABC-Haken aus
    spiel.tag++; delete f.abcTag; M.leist = { abc: false, duschen: true }; mitarbeiterTag(); ok('ABC-Haken aus: kein ABC', f.abcTag == null, f.abcTag); ok('Duschen läuft weiter', f.duschTag === spiel.tag, f.duschTag);
    // 7. Haken per Klick im Whiteboard
    M.leist = {}; wbSeite(); const c = document.querySelector('[data-wbwu="0:duschen"]'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); ok('Klick auf Haken speichert Wunsch', M.leist && M.leist.duschen === true, JSON.stringify(M.leist));
    // 8. Pferdewirt kann in der Mitarbeiter-Ansicht die Aufgabe abwählen
    ok('Aufgabe „duschen“ beim Pferdewirt wählbar', MA_AUFGABEN_TYP.pferdewirt.includes('duschen') && !!MA_AUFGABEN.duschen); m.aus = { duschen: true }; M.leist = { duschen: true }; spiel.tag++; mitarbeiterTag(); ok('Aufgabe abgewählt: kein Duschen', f.duschTag !== spiel.tag, f.duschTag);
    // 9. Pensionsstute: nie
    box.fohlen = null; const J = mk('Jung', 'Stute', 1); box.pferd = J; M.leist = {}; J.leist = { duschen: true }; m.aus = {}; spiel.tag++; mitarbeiterTag(); ok('Abgesetztes Jungpferd bei Wunsch geduscht', J.duschTag === spiel.tag, J.duschTag);
    // 10. Zusatzleistung: unabhängig von Zuteilung und Putz-Wünschen, eigener Block im Whiteboard
    box.pferd = M; box.fohlen = f; M.leist = { putzen: false, maehne: false, waschen: false, leicht: false, duschen: true }; box.maPlan = { stall: 'pz1' }; m.aus = {}; delete f.abcTag; delete f.duschTag; spiel.tag++;
    mitarbeiterTag(); ok('Zusatzleistung läuft auch bei fester Zuteilung nur zu Füttern/Misten und ohne Putz-Wunsch (ABC + Duschen)', f.abcTag === spiel.tag && f.duschTag === spiel.tag, f.abcTag + ' / ' + f.duschTag);
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const blk = [...document.querySelectorAll('.wb-wu')].find(x => /Zusatzleistung/.test(x.textContent) && !x.matches('details'));
    ok('Eigener Block „Zusatzleistung“ im Whiteboard, getrennt von „Dein Wunsch“', !!blk && !!blk.querySelector('[data-wbwu="0:abc"]') && !!blk.querySelector('[data-wbwu="0:duschen"]') && /heute geübt/.test(blk.textContent), blk && blk.textContent);
    ok('Haken Fohlen-ABC/duschen nicht mehr im Block „Dein Wunsch an die Mitarbeiter“', ![...document.querySelectorAll('details.wb-wu [data-wbwu]')].some(x => /:(abc|duschen)$/.test(x.dataset.wbwu)));
    // 11. Zählen nach Tätigkeiten: Pferdewirt schafft 6, Fohlen üben zählt mit
    ok('Pferdewirt Zucht schafft 6 Tätigkeiten', maKapazitaet(m) === 6, maKapazitaet(m));
    M.leist = {}; [1, 2].forEach(i => { spiel.boxen[i].pferd = mk('Pony' + i, 'Stute', 8); });
    [0, 1, 2].forEach(i => { spiel.boxen[i].maPlan = { stall: 'pz1', pfleger: 'pz1' }; });
    ok('3 Boxen mit Füttern und Putzen = 6 Tätigkeiten, danach kein Fohlen üben mehr', fohlenZuteilung().length === 0, fohlenZuteilung().length);
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const kap2 = document.querySelector('.wb-ma[data-wbq="m:pz1"] .wb-kap'); ok('Whiteboard zeigt 6 von 6 Tätigkeiten', kap2 && /6 von 6 Tätigkeiten/.test(kap2.textContent), kap2 && kap2.textContent);
    [1, 2].forEach(i => { spiel.boxen[i].maPlan = { stall: '-', pfleger: '-' }; });
    ok('Mit freier Kapazität übt er wieder Fohlen (zählt als Tätigkeit)', fohlenZuteilung().some(x => x.i === 0 && x.m === m), fohlenZuteilung().length);
    wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const kap3 = document.querySelector('.wb-ma[data-wbq="m:pz1"] .wb-kap'); ok('Anzeige mit 🍼 für Fohlen üben', kap3 && /🍼/.test(kap3.textContent), kap3 && kap3.textContent);
    // 12. Wurmkur durch Mitarbeiter („Medikamente geben“)
    const R0 = Math.random; Math.random = () => 0.99; while (datum().s % 2) spiel.tag++;
    M.pflege.wurm = spiel.tag - 2 * tpj(); apotheke().wurmkur = 2; M.weide = null; delete M.behHeute; wurmkurMitarbeiter();
    ok('Mitarbeiter gibt die Wurmkur aus der Stallapotheke', M.pflege.wurm === spiel.tag && apotheke().wurmkur === 1, M.pflege.wurm + ' / ' + apotheke().wurmkur);
    m.aus = { behandeln: true }; M.pflege.wurm = spiel.tag - 2 * tpj(); delete M.behHeute; wurmkurMitarbeiter(); ok('Ohne „Medikamente geben“ passiert nichts', M.pflege.wurm !== spiel.tag);
    m.aus = {}; apotheke().wurmkur = 0; delete M.behHeute; wurmkurMitarbeiter(); ok('Eigenes Pferd: ohne Wurmkur im Lager nichts', M.pflege.wurm !== spiel.tag);
    ok('… aber ein Brief „Wurmkur fehlt“ kommt', (spiel.post || []).some(x => x.betreff === 'Wurmkur fehlt'));
    const nb = spiel.post.length; delete M.behHeute; wurmkurMitarbeiter(); ok('Brief nur einmal je Jahreszeit', spiel.post.length === nb);
    Math.random = R0;
    // 13. Einstreu-Empfehlung steht bei den Befunden
    M.befunde = []; const bf = befundNeu(M, 'husten', 1, 'Test', 'du'); bf.diagnose = true; bf.bemerkt = bf.bemerkt || { tag: spiel.tag, von: 'du' }; box.einstreu = 'stroh';
    const kh = befundKarten(M, box); ok('Befund zeigt Einstreu-Empfehlung (Stroh passt bei Husten nicht)', /Einstreu bei Krankheit/.test(kh) && /passt nicht/.test(kh), kh.slice(-300)); box.einstreu = 'spaene'; ok('Mit Spänen: passt', /Späne passt|passt/.test(befundKarten(M, box)) && !/passt nicht/.test(befundKarten(M, box)));
    // 14. Trächtigkeitsuntersuchung steht bei Befunde · Quarantäne · Labor (Versorgung)
    delete M.gedeckt; delete M.traechtig; M.befunde = []; ok('Ohne Decken: kein Knopf Trächtigkeitsuntersuchung', !/data-tu=/.test(befundKarten(M, box)));
    M.gedeckt = { tag: spiel.tag - 3, seit: jzJetzt(), vater: { name: 'Papa' }, art: 'natur', erfolg: true }; ok('Nach dem Decken: Knopf in der Karte Ansteckung und Labor', /data-tu=/.test(befundKarten(M, box)) && /Ansteckung und Labor/.test(befundKarten(M, box)));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
