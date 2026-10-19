// Zucht-Studie (Plan B in PLAN-STUDIEN.md, 19.10.2026): je Rasse 10 Zuchtstuten (4–14 J.) über 4 Jahre bei guter Pflege (wie Spieler 3 der Gesundheits-Studie)
// Stuten 1–5 → eigener Hengst (immer möglich), Stuten 6–10 → Deckstation (nur Frühling/Sommer, Decktaxe). Jede leere, zuchttaugliche Stute wird 1× am Tag gedeckt, bis sie tragend ist.
// Variante A: ohne Gentest, ohne Abfohlbox · Variante B: alle Elterntiere gentestet (Erbkrankheiten + Farbe), Warnung → anderer Hengst, 10 Abfohlboxen
// Gemessen: Deckversuche, Trächtigkeit je Versuch und je Stute und Saison, Gründe für Zuchtsperre, Verfohlen, Geburten, schwache Fohlen, Erbkrankheiten,
// Fohlentod bis zum Absetzen und im 1. Lebensjahr, Fohlen-Befunde nach dem Absetzen, Waisen, Abstand zwischen zwei Fohlen
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/zucht-studie.js <Ausgabe-Ordner> <rasse> [<rasse> …]   (VARIANTEN=A,B  WDH=2)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const URL_ = 'file://' + path.resolve(__dirname, '..', 'index.html');
const [aus, ...rassen] = process.argv.slice(2);
if (!aus || !rassen.length) { console.log('Aufruf: node tests/zucht-studie.js <Ordner> <rasse> …'); process.exit(1); }
fs.mkdirSync(aus, { recursive: true });
const WDH = +(process.env.WDH || 2), JAHRE = +(process.env.JAHRE || 4);

async function lauf(rasse, variante) {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(URL_); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Studie'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Zuchthof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const r = await pg.evaluate(([rasse, V, JAHRE]) => {
    const dlg = () => document.getElementById('dlg'), zu = () => { dlg().hidden = true; }, zuf = Math.random, B_ = V === 'B';
    window.reaktionZeigen = () => {}; window.zeigeStall = () => {}; window.zeigeTag = () => {}; window.zeigeAkte = () => {};
    spiel.tippsAus = true; spiel.admin = false; spiel.geld = 1e7;
    const g0 = spiel.boxen[0]; while (spiel.boxen.length < 40) spiel.boxen.push({ nr: spiel.boxen.length + 1, pferd: null, krippeVoll: false, mistig: false, mistStufe: 0, tot: false, geb: g0.geb, stufe: g0.stufe });
    if (B_) spiel.boxen.slice(30, 40).forEach(x => { x.abfohl = true; });
    spiel.hof.ha = 21; spiel.hof.weideHa = 20; spiel.weiden = ['Stuten', 'Hengst', 'Absetzer'].map((n, i) => ({ wid: 'w' + (i + 1), name: n, ha: 6, gras: 80, matsch: 0 }));
    const F = futterkammer(); F.lagerMax = 1e7; Object.keys(FUTTER).forEach(k => { if (['raufutter', 'kraftfutter', 'zusatz'].includes(FUTTER[k].art)) F.lager[k] = 1e5; });
    const ap = apotheke(); Object.keys(APO).filter(k => APO[k].frei).forEach(k => ap[k] = 999);
    const neu = (o, i) => { const p = neuesPferd({ rasse, ...o }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); p.putzzeug = true; if (B_) { p.tests = { krank: true, farbe: true }; p.gentest = true; } return p; };
    const stuten = []; for (let i = 0; i < 10; i++) { const p = neu({ name: 'Z' + (i + 1), geschlecht: 'Stute', alter: 4 + i * 10 / 9 }); p.studie = { rolle: 'stute', gruppe: i < 5 ? 'eigen' : 'deck' }; spiel.boxen[i].pferd = p; stuten.push(p); }
    const hengst = neu({ name: 'Eigenhengst', geschlecht: 'Hengst', alter: 8 }); hengst.studie = { rolle: 'hengst' }; spiel.boxen[10].pferd = hengst;
    const deckH = neu({ name: 'Stationshengst', geschlecht: 'Hengst', alter: 9 }); deckH.stockmass = deckH.stockmass || deckH.zielStockmass;
    const M = { versuche: 0, tragend: 0, versucheEigen: 0, tragendEigen: 0, versucheDeck: 0, tragendDeck: 0, saison: {}, sperre: {}, warnung: 0, ausweich: 0, kosten: { deck: 0, tierarzt: 0 },
      fohlen: [], verfohlt: 0, stutenTot: [], fehler: {}, wohlHengst: [], wohlStute: [], tragendTage: 0, stutenTage: 0, stutenFohlenTage: 0 };
    const schritt = (k, f) => { try { f(); } catch (e) { M.fehler[k + ': ' + e.message] = (M.fehler[k + ': ' + e.message] || 0) + 1; } };
    let von = null; const buchen0 = buchen; window.buchen = buchen = (x, posten) => { if (x < 0) { const t = von || String(posten); if (/Decktaxe/.test(t)) M.kosten.deck -= x; else if (/Tierarzt|Klinik|OP/i.test(t)) M.kosten.tierarzt -= x; } return buchen0(x, posten); };
    // Geburten mitschreiben
    const geburt0 = geburt; const FO = {};
    window.geburt = geburt = (box, vater) => { const mutter = box.pferd, f = geburt0(box, vater);
      const erb = Object.keys(ERBKRANK).filter(k => erbKrank(f, k));
      FO[f.id] = { id: f.id, mutter: mutter.name, tag: spiel.tag, jz: jzJetzt(), erb, erbTot: !!f.erbTot, lw: !!f.lethalWhite, erbTod: f.erbTod ? f.erbTod.k : null, ges0: null, befunde: [], tod: null, abgesetzt: null, waise: false, abfohl: !!box.abfohl };
      M.fohlen.push(FO[f.id]); return f; };
    const zuchtVerlauf = {}; stuten.forEach(p => { zuchtVerlauf[p.name] = { geburten: [], tragendSeit: null }; });
    const boxVon = p => spiel.boxen.find(x => x.pferd === p);
    const decken = (p, box) => {
      const d = datum(); const seasonKey = `${p.name}-${jzJetzt()}`;
      let kand = p.studie.gruppe === 'eigen' ? [hengst, deckH] : [deckH, hengst];
      kand = kand.filter(h => h === hengst ? !zuchtSperre(hengst, boxVon(hengst)) && !groessenSperre(p, hengst) : d.s <= 1 && !groessenSperre(p, deckH));
      if (!B_) kand = kand.slice(0, 1).filter(h => h === (p.studie.gruppe === 'eigen' ? hengst : deckH));
      for (const h of kand) {
        zu(); aktBox = spiel.boxen.indexOf(box); verpaaren(p, h);
        const t = dlg().hidden ? '' : document.getElementById('dlgInhalt').textContent;
        if (/Erbkrankheit|Lethal|Trotzdem/.test(t) || [...document.querySelectorAll('#dlgKnoepfe button')].some(x => /Trotzdem/.test(x.textContent))) { M.warnung++; zu(); continue; }
        if (h !== kand[0] || (B_ && h !== (p.studie.gruppe === 'eigen' ? hengst : deckH))) M.ausweich++;
        const ok = !!p.traechtig, eig = h === hengst; M.versuche++; if (eig) M.versucheEigen++; else M.versucheDeck++; if (ok) { M.tragend++; if (eig) M.tragendEigen++; else M.tragendDeck++; }
        const S = (M.saison[seasonKey] = M.saison[seasonKey] || { versuche: 0, tragend: false, s: d.s }); S.versuche++; if (ok) S.tragend = true;
        if (ok) zuchtVerlauf[p.name].tragendSeit = spiel.tag;
        zu(); return;
      }
    };
    // Tagesablauf gute Pflege (wie Spieler 3 der Gesundheits-Studie, ohne Training)
    const tag = () => {
      spiel.geld = 1e7; const d = datum(), weideOk = d.s !== 3 && !(d.s === 2 && d.t === tpj());
      spiel.boxen.forEach((box, i) => { const p = box.pferd; if (!p || box.tot) return; aktBox = i;
        if (!p.studie) p.studie = { rolle: 'fohlen' };
        if (p.klinik || p.turnier) return;
        if (p.waise && !p.waise.art) p.waise.art = 'flasche';
        schritt('besuch', () => anzeichenBeimBesuch(box));
        // Zucht zuerst (vor dem Weidegang)
        if (p.studie.rolle === 'stute') { if (p.traechtig) M.tragendTage++; M.stutenTage++; if (box.fohlen) M.stutenFohlenTage++;
          if (!p.traechtig && !p.weide) { const s = zuchtSperre(p, box); if (s) M.sperre[s] = (M.sperre[s] || 0) + 1; else schritt('decken', () => decken(p, box)); } }
        if (!p.weide && !box.krippeVoll) schritt('fuettern', () => { if (fuetternAusLager(box, 'du', 'rau')) box.krippeVoll = true; if (kraftNoetig(p, box)) { fuetternAusLager(box, 'du', 'kraft'); box.kraftVoll = true; } });
        box.wasserTag = spiel.tag;
        if (box.mistig) { box.mistig = false; box.mistStufe = 0; }
        if (zuf() < .9) schritt('putzen', () => { putzen(p, 'buerste'); putzen(p, 'kamm'); });
        if (zuf() < .9) p.ausgekratzt = spiel.tag;
        if (p.boxenruhe && !befundListe(p).some(x => (PLAN[x.art] || []).includes('boxenruhe') && (x.diagnose || x.bemerkt))) p.boxenruhe = false;
        if (!p.weide && weideOk && !p.boxenruhe && !p.quarantaene && !fohlenNochLiegend(box) && zuf() < .85) schritt('weide', () => aufWeide(p, box, null, p.studie.rolle === 'stute' ? 'w1' : p.studie.rolle === 'hengst' ? 'w2' : 'w3'));
        const L = befundListe(p), neuB = L.filter(x => x.bemerkt && !x.diagnose), alt = L.filter(x => x.diagnose && spiel.tag - (x.beh || x.diagnose) >= 4 && !KRANK[x.art].chronisch);
        if (neuB.length || alt.length || L.some(x => x.grad >= 4 && x.bemerkt && x.beh !== spiel.tag)) schritt('tierarzt', () => {
          tierarztBesuch(p, box, () => {}); const t = dlg().hidden ? '' : document.getElementById('dlgInhalt').textContent;
          if (/Klinik/.test(t)) { const k = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Klinik/.test(x.textContent)); if (k) k.click(); } zu(); });
        if (L.some(x => x.diagnose)) { const plan = new Set(); L.filter(x => x.diagnose).forEach(x => (PLAN[x.art] || []).filter(k => !vorrangSperre(p, k)).forEach(k => plan.add(k)));
          plan.forEach(k => { if (k === 'boxenruhe' || k === 'beschlag' || (AKTION[k] && AKTION[k].ueb)) return; schritt('beh', () => behandeln(p, k, APO[k] && APO[k].dosis ? dosisKlasse(gewichtAnzeige(p)) : 0, undefined)); }); }
        if (p.pflege.gesundheit <= 30 && !p.klinik) schritt('klinik', () => ANH_ZIEL.stationaer.aus(p, box));
        schritt('vorsorge', () => { if (!geimpft(p) || spiel.tag - (p.pflege.impf || 0) > 1.8 * tpj()) vorsorge(p, 'impfung'); if (zahnUeber(p)) vorsorge(p, 'zahn');
          if ((d.s === 0 || d.s === 2) && spiel.tag - (p.pflege.wurm || 0) > tpj() && d.t <= 2) behandeln(p, 'wurmkur', dosisKlasse(gewichtAnzeige(p)), undefined); });
        if (hufLaenge(p) >= 1) schritt('hufschmied', () => hufschmiedKommt([p], 'barhuf'));
      });
      (spiel.rechnungen || []).slice().forEach(rc => schritt('rechnung', () => { von = rc.von; rechnungZahlen(rc.id); von = null; zu(); }));
      (spiel.post || []).forEach(x => { x.gelesen = true; }); zu();
    };
    const fohlenFinden = id => { for (const b of spiel.boxen) { if (b.fohlen && b.fohlen.id === id) return { f: b.fohlen, beiFuss: true }; if (b.pferd && b.pferd.id === id) return { f: b.pferd, beiFuss: false }; } const e = (spiel.extern || []).find(x => x.pferd && x.pferd.id === id); return e ? { f: e.pferd, beiFuss: false } : null; };
    const tote0 = (spiel.friedhof || []).length, tage = JAHRE * 4 * tpj(); let tr0 = new Map(stuten.map(p => [p.name, false])); const t0 = performance.now();
    for (let dd = 0; dd < tage; dd++) {
      tag();
      try { naechsteNacht(); } catch (e) { M.fehler['nacht: ' + e.message] = (M.fehler['nacht: ' + e.message] || 0) + 1; } zu();
      // Verfohlen erkennen: tragend weg, ohne Geburt
      stuten.forEach(p => { const war = tr0.get(p.name), box = boxVon(p); if (war && !p.traechtig && !(box && box.fohlen && box.fohlen.gebTag === spiel.tag) && !Object.values(FO).some(f => f.mutter === p.name && spiel.tag - f.tag <= 1)) M.verfohlt++; tr0.set(p.name, !!p.traechtig); });
      Object.values(FO).forEach(o => { if (o.tod) return; const x = fohlenFinden(o.id); if (!x) return; const f = x.f;
        if (o.ges0 == null && f.pflege) o.ges0 = f.pflege.gesundheit;
        if (!x.beiFuss && o.abgesetzt == null) o.abgesetzt = spiel.tag;
        if (f.waise) o.waise = true;
        if (alterJZ(f) < 4) befundListe(f).filter(y => !imInkub(y)).forEach(y => { if (!o.befunde.some(z => z.id === y.id)) o.befunde.push({ id: y.id, art: y.art, grad: y.grad, tag: spiel.tag, beiFuss: x.beiFuss }); }); });
      (spiel.friedhof || []).slice(tote0).forEach(g => { const id = g.pferd && g.pferd.id; if (FO[id] && !FO[id].tod) FO[id].tod = { tag: spiel.tag, ursache: g.ursache || g.pferd.todesursache || '?', alterTage: spiel.tag - FO[id].tag };
        if (g.pferd && g.pferd.studie && g.pferd.studie.rolle === 'stute' && !M.stutenTot.some(s => s.name === g.name)) M.stutenTot.push({ name: g.name, ursache: g.ursache }); });
      if (dd % 7 === 0) { M.wohlHengst.push(Math.round(wohlbefinden(hengst))); M.wohlStute.push(Math.round(stuten.reduce((a, p) => a + wohlbefinden(p), 0) / 10)); }
      if (spiel.verloren) break;
    }
    // Tierschutz-Abholungen und Erbkrankheiten auswerten
    M.tierschutz = (spiel.tierschutz || []).filter(x => FO[x.pferd.id]).length;
    M.fohlen.forEach(o => { const x = fohlenFinden(o.id); o.lebt = !!x; o.alterEndeJZ = x ? alterJZ(x.f) : null; });
    M.zuchtVerlauf = zuchtVerlauf; M.tage = tage; M.ms = Math.round(performance.now() - t0);
    M.stuten = stuten.map(p => ({ name: p.name, alter: Math.round(p.studie ? alterJahre(p) : 0), erb: Object.entries(erbVon(p)).filter(([, v]) => v).map(([k]) => k), kinder: (p.kinder || []).length }));
    M.hengstErb = Object.entries(erbVon(hengst)).filter(([, v]) => v).map(([k]) => k); M.deckErb = Object.entries(erbVon(deckH)).filter(([, v]) => v).map(([k]) => k);
    M.krankNamen = Object.fromEntries(Object.keys(KRANK).map(k => [k, KRANK[k].n])); M.erbNamen = Object.fromEntries(Object.keys(ERBKRANK).map(k => [k, ERBKRANK[k].kurz || ERBKRANK[k].n]));
    // erwartete Häufigkeit betroffener Fohlen aus den Träger-Anteilen der Rasse (rezessiv: q² mit q = Träger/2; dominant: Träger/2)
    M.erwartet = {}; Object.entries(ERBKRANK).forEach(([k, K]) => { const t = K.rassen[rasse] || 0; if (!t) return; const q = t / 2; M.erwartet[k] = { traeger: t, betroffen: K.dominant ? t / 2 : q * q, folge: K.folge }; });
    return M;
  }, [rasse, variante, JAHRE]);
  r.seitenFehler = [...new Set(errs)].slice(0, 5);
  await b.close(); return r;
}

(async () => {
  for (const rasse of rassen) {
    const erg = { rasse, varianten: {} };
    for (const v of (process.env.VARIANTEN || 'A,B').split(',')) for (let w = 0; w < WDH; w++) { const t = Date.now(), M = await lauf(rasse, v); M.sek = Math.round((Date.now() - t) / 1000); (erg.varianten[v] = erg.varianten[v] || []).push(M);
      const tot = M.fohlen.filter(f => f.tod).length;
      console.log(`${rasse} ${v}: ${M.versuche} Deckversuche, ${M.tragend} tragend, ${M.fohlen.length} Fohlen, ${tot} Fohlen tot, ${M.verfohlt} verfohlt, Fehler ${Object.keys(M.fehler).length}, ${M.sek} s`); }
    fs.writeFileSync(path.join(aus, rasse + '.json'), JSON.stringify(erg));
  }
})();
