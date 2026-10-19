// Gesundheits-Studie (Dome, 19.10.2026): je Rasse 40 Pferde (10 je Altersklasse) über 3 Jahre, in 3 Pflegestufen (3 gut, 2 mittel, 1 schlecht)
// zählt Befunde, kranke Tage, Schwere, Heilung, Tod, Tierarzt, Kosten und Arbeit für kranke Pferde
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/gesundheit-studie.js <Ausgabe-Ordner> <rasse> [<rasse> …]
// Ergebnis: <Ausgabe-Ordner>/<rasse>.json (Auswertung: tests/gesundheit-auswertung.js)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const URL_ = 'file://' + path.resolve(__dirname, '..', 'index.html');
const [aus, ...rassen] = process.argv.slice(2);
if (!aus || !rassen.length) { console.log('Aufruf: node tests/gesundheit-studie.js <Ordner> <rasse> …'); process.exit(1); }
fs.mkdirSync(aus, { recursive: true });

// Pflegestufen: Wahrscheinlichkeit, dass etwas an einem Tag gemacht wird
const STUFEN = {
  3: { name: 'gut', fuettern: 1, misten: 1, wasser: 1, putzen: .9, hufe: .9, weide: .85, besuch: 1, tierarzt: 1, tierarztAb: 1, kontrolle: 4, behandeln: 1, vorsorge: 1, hufschmied: 1, klinik: 1, boxenruheEnde: true, schont: true, training: 4 / 7, putzzeug: 1 },
  2: { name: 'mittel', fuettern: .9, misten: .7, wasser: .9, putzen: .5, hufe: .4, weide: .5, besuch: .6, tierarzt: .4, tierarztAb: 1, kontrolle: 8, behandeln: .7, vorsorge: .5, hufschmied: 1.4, klinik: 1, boxenruheEnde: true, schont: true, training: 3 / 7, putzzeug: .5 },
  1: { name: 'schlecht', fuettern: .85, misten: .4, wasser: .85, putzen: .15, hufe: .1, weide: .3, besuch: .25, tierarzt: .5, tierarztAb: 4, kontrolle: 99, behandeln: .3, vorsorge: 0, hufschmied: 2.2, klinik: .5, boxenruheEnde: true, schont: false, training: 2 / 7, putzzeug: 0 },
};
const WDH = +(process.env.WDH || 2);   // Durchläufe je Pflegestufe (Seuchen machen die Zahlen zufällig)
const KLASSEN = [['Fohlen', .6, .95], ['Jungpferd', 1, 3.9], ['Erwachsen', 4, 14], ['Senior', 15, 26]];

async function lauf(rasse, stufe) {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(URL_); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Studie'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Studienhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const r = await pg.evaluate(([rasse, S, KLASSEN]) => {
    const zu = () => { document.getElementById('dlg').hidden = true; }, zuf = Math.random;
    window.reaktionZeigen = () => {}; window.zeigeStall = () => {}; window.zeigeTag = () => {};   // Bildschirm nicht neu zeichnen (schneller)
    spiel.tippsAus = true; spiel.admin = false; spiel.geld = 1e7;
    // Anlage: 40 Boxen im Start-Stall (Stufe 1 wie beim Start), 2 Weiden je 10 ha
    const g0 = spiel.boxen[0]; while (spiel.boxen.length < 40) spiel.boxen.push({ nr: spiel.boxen.length + 1, pferd: null, krippeVoll: false, mistig: false, mistStufe: 0, tot: false, geb: g0.geb, stufe: g0.stufe });
    spiel.hof.ha = 21; spiel.hof.weideHa = 20; spiel.weiden = KLASSEN.map(([kl], i) => ({ wid: 'w' + (i + 1), name: kl, ha: 5, gras: 80, matsch: 0 }));   // 4 Gruppen à 10 Pferde, nach Altersklasse
    const F = futterkammer(); F.lagerMax = 1e7; Object.keys(FUTTER).forEach(k => { if (['raufutter', 'kraftfutter', 'zusatz'].includes(FUTTER[k].art)) F.lager[k] = 1e5; });
    const ap = apotheke(); Object.keys(APO).filter(k => APO[k].frei).forEach(k => ap[k] = 999);
    const pferde = []; let n = 0;
    KLASSEN.forEach(([kl, a, z]) => { for (let i = 0; i < 10; i++) { const alter = a + (z - a) * i / 9, p = neuesPferd({ name: 'S' + (++n), rasse, geschlecht: i % 2 ? 'Stute' : 'Wallach', alter });
      p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.studie = { kl, alter, klinikJa: zuf() < S.klinik }; p.pflege.impf = spiel.tag; p.pflege.wurm = spiel.tag; p.pflege.zahn = spiel.tag; p.pflege.huf = spiel.tag; if (zuf() < S.putzzeug) p.putzzeug = true;
      spiel.boxen[n - 1].pferd = p; pferde.push(p); } });
    // Messung
    const M = { befunde: {}, tage: 0, krankTage: {}, lebendTage: {}, tod: [], tierarzt: 0, kontrolle: 0, klinik: 0, behandlungen: 0, routine: 0, krankArbeit: 0, kosten: { tierarzt: 0, hufschmied: 0, klinik: 0 }, fehler: {} };
    KLASSEN.forEach(([kl]) => { M.krankTage[kl] = 0; M.lebendTage[kl] = 0; });
    let von = null; const buchen0 = buchen; window.buchen = buchen = (x, posten) => { if (x < 0) { const t = von || String(posten); if (/Hufschmied/.test(t)) M.kosten.hufschmied -= x; else if (/Tierarzt/.test(t)) M.kosten.tierarzt -= x; else if (/Klinik|OP|stationär/i.test(t)) M.kosten.klinik -= x; } return buchen0(x, posten); };
    const schritt = (k, f) => { try { f(); } catch (e) { M.fehler[k + ': ' + e.message] = (M.fehler[k + ': ' + e.message] || 0) + 1; } };
    const boxVon = p => spiel.boxen.find(x => x.pferd === p);
    const tag = () => {
      spiel.geld = 1e7;
      spiel.boxen.forEach((box, i) => { const p = box.pferd; if (!p || box.tot || !p.studie) return; aktBox = i;
        if (p.klinik || p.turnier) return;
        if (zuf() < S.besuch) schritt('besuch', () => anzeichenBeimBesuch(box));
        if (!p.weide && !box.krippeVoll && zuf() < S.fuettern) schritt('fuettern', () => { if (fuetternAusLager(box, 'du', 'rau')) box.krippeVoll = true; if (kraftNoetig(p, box)) { fuetternAusLager(box, 'du', 'kraft'); box.kraftVoll = true; } M.routine++; });
        if (box.wasserTag !== spiel.tag && zuf() < S.wasser) { box.wasserTag = spiel.tag; M.routine++; }
        if (box.mistig && zuf() < S.misten) { box.mistig = false; box.mistStufe = 0; M.routine++; }
        if (zuf() < S.putzen) schritt('putzen', () => { putzen(p, 'buerste'); putzen(p, 'kamm'); M.routine++; });
        if (zuf() < S.hufe) { p.ausgekratzt = spiel.tag; M.routine++; }
        const d = datum(), weideOk = d.s !== 3 && !(d.s === 2 && d.t === tpj());
        if (S.boxenruheEnde && p.boxenruhe && !befundListe(p).some(x => (PLAN[x.art] || []).includes('boxenruhe') && (x.diagnose || x.bemerkt))) p.boxenruhe = false;
        if (!p.weide && weideOk && !p.boxenruhe && !p.quarantaene && zuf() < S.weide) schritt('weide', () => { const w = 'w' + (KLASSEN.findIndex(([kl]) => kl === p.studie.kl) + 1); aufWeide(p, box, null, w); M.routine++; });
        // Tierarzt: bemerkt und noch keine Diagnose (gut sofort, mittel mit Verzögerung, schlecht erst ab schwer)
        const L = befundListe(p), neu = L.filter(x => x.bemerkt && !x.diagnose && x.grad >= S.tierarztAb), alt = L.filter(x => x.diagnose && spiel.tag - (x.beh || x.diagnose) >= S.kontrolle && !KRANK[x.art].chronisch);
        if ((neu.length && zuf() < S.tierarzt) || (alt.length && zuf() < S.tierarzt) || (!p.studie.klinikJa ? false : L.some(x => x.grad >= 4 && x.bemerkt && x.beh !== spiel.tag))) schritt('tierarzt', () => {
          if (alt.length && !neu.length) M.kontrolle++; else M.tierarzt++; M.krankArbeit++;
          tierarztBesuch(p, box, () => {}); const t = document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent;
          if (/Klinik/.test(t) && S.klinik) { const k = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Klinik/.test(x.textContent)); if (k) { k.click(); M.klinik++; } } zu(); });
        // Behandlungsplan (inkl. Bewegung) befolgen
        if (L.some(x => x.diagnose)) { const plan = new Set(); L.filter(x => x.diagnose).forEach(x => (PLAN[x.art] || []).filter(k => !vorrangSperre(p, k)).forEach(k => plan.add(k)));
          plan.forEach(k => { if (k === 'boxenruhe' || k === 'beschlag' || zuf() >= S.behandeln) return; M.krankArbeit++; M.behandlungen++;
            if (AKTION[k] && AKTION[k].ueb) { const ue = k === 'longe' ? 'longieren' : k === 'frei' ? 'bodenarbeit' : null; if (ue && !p.weide && energie(p) >= uebKosten(p, ue)) schritt('beh-ueb', () => trainieren(p, ue, uebOrt(ue) || 'reitplatz', null)); return; }
            schritt('beh', () => behandeln(p, k, APO[k] && APO[k].dosis ? dosisKlasse(gewichtAnzeige(p)) : 0, undefined)); }); }
        if (p.studie.klinikJa && p.pflege.gesundheit <= 30 && !p.klinik) schritt('klinik', () => { ANH_ZIEL.stationaer.aus(p, box); M.klinik++; M.krankArbeit++; });
        // Vorsorge
        if (S.vorsorge && zuf() < S.vorsorge) { schritt('vorsorge', () => { if (!geimpft(p) || spiel.tag - (p.pflege.impf || 0) > 1.8 * tpj()) { vorsorge(p, 'impfung'); M.routine++; } if (zahnUeber(p)) { vorsorge(p, 'zahn'); M.routine++; }
          if ((d.s === 0 || d.s === 2) && spiel.tag - (p.pflege.wurm || 0) > tpj() && d.t <= 2) { behandeln(p, 'wurmkur', dosisKlasse(gewichtAnzeige(p)), undefined); M.routine++; } }); }
        if (hufLaenge(p) >= S.hufschmied) schritt('hufschmied', () => { hufschmiedKommt([p], 'barhuf'); M.routine++; });
        // leichtes Training für Erwachsene/Senioren (4–20 Jahre)
        const j = alterJahre(p); if (j >= 4 && j <= 20 && !p.weide && zuf() < S.training && !trainSperre(p, box)) {
          const krank = befundListe(p).some(x => x.bemerkt || x.diagnose);
          ['longieren', 'dressur'].forEach(k => { if (S.schont && krank && schont(p, k, { wissen: { huf: 60, ruecken: 60, haut: 60, futter: 60, klima: 60, verhalten: 60 } })) return; if (!uebSperre(p, k) && uebOrt(k) && energie(p) >= uebKosten(p, k)) schritt('training', () => trainieren(p, k, uebOrt(k), null)); }); }
      });
      (spiel.rechnungen || []).slice().forEach(rc => schritt('rechnung', () => { von = rc.von; rechnungZahlen(rc.id); von = null; zu(); }));
      (spiel.post || []).forEach(x => { x.gelesen = true; }); zu();
    };
    const lebend = () => spiel.boxen.map(x => x.pferd).filter(p => p && p.studie);
    M.ges = []; M.hunger = 0; M.mist = 0; M.durst = 0; M.pferdTage = 0;
    const messen = () => { M.tage++; const Lb = lebend(); if (M.tage % 7 === 0) M.ges.push(Lb.length ? Math.round(Lb.reduce((a, p) => a + p.pflege.gesundheit, 0) / Lb.length) : 0);
      lebend().forEach(p => { const kl = p.studie.kl; M.lebendTage[kl]++;
        const L = befundListe(p).filter(x => !imInkub(x)); if (L.length) M.krankTage[kl]++;
        L.forEach(x => { const B = (M.befunde[x.id] = M.befunde[x.id] || { art: x.art, urs: (x.ursache || '').slice(0, 30), kl, start: spiel.tag, max: 0, bemerkt: null, diagnose: null, ende: null, pferd: p.name });
          B.max = Math.max(B.max, x.grad); B.letzt = spiel.tag; if (x.bemerkt && B.bemerkt == null) B.bemerkt = spiel.tag; if (x.diagnose && B.diagnose == null) B.diagnose = spiel.tag; }); });
      Object.values(M.befunde).forEach(B => { if (B.ende == null && B.letzt < spiel.tag) B.ende = B.letzt + 1; }); };
    const tote0 = (spiel.friedhof || []).length;
    const tage = 3 * 4 * tpj(); let t0 = performance.now();
    for (let d = 0; d < tage; d++) { tag(); spiel.boxen.forEach(x => { if (x.pferd && x.pferd.studie && !x.pferd.klinik) { M.pferdTage++; if (!x.krippeVoll && !x.pferd.weide) M.hunger++; if (x.mistig) M.mist++; if (x.wasserTag !== spiel.tag && !x.pferd.weide) M.durst++; } }); try { naechsteNacht(); } catch (e) { M.fehler['nacht: ' + e.message] = (M.fehler['nacht: ' + e.message] || 0) + 1; } zu(); messen(); if (spiel.verloren) break; }
    (spiel.friedhof || []).slice(tote0).forEach(g => { if (g.pferd && g.pferd.studie) M.tod.push({ kl: g.pferd.studie.kl, ursache: g.pferd.todesursache || '?', alter: Math.round(g.pferd.studie.alter * 10) / 10 }); });
    const offen = Object.values(M.befunde).filter(B => B.ende == null);
    M.chronisch = Object.values(M.befunde).filter(B => KRANK[B.art] && KRANK[B.art].chronisch).length;
    M.beschlagnahmt = (spiel.tierschutz || []).filter(x => x.pferd && x.pferd.studie).length; M.offenAmEnde = offen.length; M.ms = Math.round(performance.now() - t0); M.lebendAmEnde = lebend().length;
    M.befunde = Object.values(M.befunde); M.krankNamen = Object.fromEntries(Object.keys(KRANK).map(k => [k, KRANK[k].n])); M.chron = Object.fromEntries(Object.keys(KRANK).map(k => [k, !!KRANK[k].chronisch]));
    return M;
  }, [rasse, STUFEN[stufe], KLASSEN]);
  r.seitenFehler = [...new Set(errs)].slice(0, 5);
  await b.close(); return r;
}

(async () => {
  for (const rasse of rassen) {
    const erg = { rasse, stufen: {} };
    for (const st of [3, 2, 1]) for (let w = 0; w < WDH; w++) { const t = Date.now(), M = await lauf(rasse, st); M.sek = Math.round((Date.now() - t) / 1000); (erg.stufen[st] = erg.stufen[st] || []).push(M);
      console.log(`${rasse} Stufe ${st} (${STUFEN[st].name}): ${M.befunde.length} Befunde, ${M.tod.length} tot, ${Math.round(Object.values(M.krankTage).reduce((a, b) => a + b, 0) / Object.values(M.lebendTage).reduce((a, b) => a + b, 0) * 100)} % kranke Tage, Fehler ${Object.keys(M.fehler).length}, ${M.sek} s`); }
    fs.writeFileSync(path.join(aus, rasse + '.json'), JSON.stringify(erg));
  }
})();
