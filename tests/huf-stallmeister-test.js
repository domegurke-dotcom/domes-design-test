// v1000-Entwurf (Dome 8.11.): Der Pferdewirtschaftsmeister ruft den Hufschmied selbst, wenn Hufe fällig sind (auch ohne Dauerauftrag), legt die Termine auf einen Tag;
// Pensionspferde nur mit gebuchter Leistung „Hufschmied-Termine“ (Besitzer zahlt den Hufschmied). Läuft über echte Tageswechsel (naechsteNacht).
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/huf-stallmeister-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 100000; speicherSperre = true;
    const mkP = (name, i, extra) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; p.beschlag = false; Object.assign(p, extra || {}); spiel.boxen[i].pferd = p; spiel.boxen[i].krippeVoll = true; return p; };
    const mkM = typ => maErgaenzen({ id: 'm' + typ, typ, name: 'Test ' + typ, wissen: wissenStart(20, {}), eig: [], gehalt: 300, ab: 0, bis: null });
    const A = mkP('Alpha', 0), B = mkP('Beta', 1, { hufAuftrag: 'barhuf' }), C = mkP('Gamma', 2), D = mkP('Delta', 3);
    const mkE = (p, leist) => { const e = { eid: 'e' + p.name, vn: 'Anna', nn: p.name, w: true, pid: p.id, stufe: 1, preis: pensionRegeln().preis[1], preisBasis: pensionRegeln().preis[1], leistungen: leist, haltung: 'box', zufr: 90, seit: jzJetzt() - 8, einzug: spiel.tag - 40, kuendigt: null, log: [] }; (spiel.einsteller = spiel.einsteller || []).push(e); p.einsteller = e.eid; };
    mkE(C, { huf: true }); mkE(D, {}); pensionRegeln().leistungen.huf = true;   // der Hof bietet „Hufschmied-Termine“ an (sonst kündigen Besitzer die Buchung in der Nacht)
    const faellig = () => [A, B, C, D].forEach(p => { p.pflege.huf = spiel.tag - 1000; delete p.hufErinnert; });
    const heuteDa = p => p.pflege.huf === spiel.tag;
    const rechnungen = () => (spiel.post || []).filter(x => x.von === 'Hufschmied' && /Rechnung/.test(x.betreff || ''));
    const erinnerungen = () => (spiel.post || []).filter(x => x.von === 'Hufschmied' && /Huftermin/.test(x.betreff || ''));
    const nacht = () => { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; };
    R.moeglichOhne = leistungMoeglich('huf');   // ohne Stallmeister: Leistung gibt es nicht
    // --- A) ohne Pferdewirtschaftsmeister: nur Dauerauftrag, für Alpha ein Erinnerungsbrief
    spiel.mitarbeiter = []; maBoxCache = null; spiel.post = []; faellig(); const r0 = rechnungen().length, e0 = erinnerungen().length; hufschmiedTag();
    R.ohne = { alpha: heuteDa(A), beta: heuteDa(B), gamma: heuteDa(C), delta: heuteDa(D), brief: erinnerungen().length - e0, rechnung: rechnungen().length - r0 };
    // --- B) mit Pferdewirtschaftsmeister
    spiel.mitarbeiter = [mkM('stallmeister')]; maBoxCache = null; R.moeglichMit = leistungMoeglich('huf'); spiel.post = []; spiel.rechnungen = []; faellig(); const r1 = 0, e1 = 0; spiel.hufschmiedHeute = -1; hufschmiedTag();
    const rn = rechnungen().slice(r1), txt = rn.map(x => String(x.text || '').replace(/<[^>]+>/g, ' ')).join(' | ');
    R.mit = { alpha: heuteDa(A), beta: heuteDa(B), gamma: heuteDa(C), delta: heuteDa(D), brief: erinnerungen().filter(x => /Alpha/.test(String(x.text || ''))).length, rechnungen: rn.length, txtAlpha: /Alpha/.test(txt), txtBeta: /Beta/.test(txt), txtGamma: /Gamma/.test(txt), anfahrt: (txt.match(/Anfahrt/g) || []).length };
    // --- C) Besitzer-Nacht: gebuchtes Pferd (Gamma) wartet auf den Stallmeister, ungebuchtes (Delta) macht der Besitzer selbst
    faellig(); besitzerPflegeNacht(); R.nacht = { gamma: heuteDa(C), delta: heuteDa(D) };
    // --- D) echter Tageswechsel mit Stallmeister: Alpha (eigen) und Gamma (gebucht) werden versorgt
    faellig(); const tag0 = spiel.tag; nacht(); R.tageswechsel = { tag: spiel.tag - tag0, alpha: A.pflege.huf >= tag0 + 1, gamma: C.pflege.huf >= tag0 + 1, delta: D.pflege.huf >= tag0 + 1 };
    // --- E) Stallmeister weg (Pension-Fallback): gebucht, aber niemand da → Besitzer macht es selbst
    spiel.mitarbeiter = []; maBoxCache = null; faellig(); besitzerPflegeNacht(); R.fallback = heuteDa(C);
    // --- F) Mindestabstand: Besuch gestern, heute ist Alpha gerade fällig (1,0) → er wartet; überfällig (≥ 1,25) → kommt gleich
    spiel.mitarbeiter = [mkM('stallmeister')]; maBoxCache = null; spiel.post = []; spiel.rechnungen = []; [A, B, C, D].forEach(p => { p.pflege.huf = spiel.tag; delete p.hufErinnert; }); delete B.hufAuftrag; spiel.hufSammelTag = spiel.tag - 1; A.pflege.huf = spiel.tag - Math.ceil(hufIntervall(A)); const alt0 = A.pflege.huf; hufschmiedTag(); R.wartet = A.pflege.huf === alt0; R.briefWartet = erinnerungen().length;
    A.pflege.huf = spiel.tag - Math.ceil(hufIntervall(A) * 1.4); hufschmiedTag(); R.ueberfaellig = A.pflege.huf === spiel.tag;
    spiel.tag += Math.ceil(tpj() / 2); [B, C, D].forEach(p => { p.pflege.huf = spiel.tag; }); A.pflege.huf = spiel.tag - Math.ceil(hufIntervall(A)); hufschmiedTag(); R.nachAbstand = A.pflege.huf === spiel.tag;
    // --- G) sparsam und logisch (Dome 8.11.): Dauerauftrag-Rhythmen ½ JZ, 1 JZ, 2 JZ über 4 Jahreszeiten: wenige Besuche, jedes Pferd nur so oft wie sein Rhythmus, nie zu lang
    spiel.mitarbeiter = [mkM('stallmeister')]; maBoxCache = null; spiel.post = []; spiel.rechnungen = []; delete spiel.hufSammelTag; delete spiel.hufschmiedHeute;
    [3].forEach(i => { spiel.boxen[i].pferd = null; }); [A, B, C].forEach(p => { delete p.einsteller; p.beschlag = false; p.pflege.huf = spiel.tag; p.hufBesuche = 0; delete p.hufErinnert; }); spiel.einsteller = [];
    A.hufAuftrag = B.hufAuftrag = C.hufAuftrag = 'barhuf'; A.hufRhythmus = 0.5; B.hufRhythmus = 1; C.hufRhythmus = 2;
    const ivls = [A, B, C].map(p => auftragIntervall(p)), tage = 4 * tpj(); let besuche = 0, maxRatio = 0, letzter = spiel.hufSammelTag;
    for (let d = 0; d < tage; d++) { spiel.tag++; hufschmiedTag(); if (spiel.hufSammelTag !== letzter) { besuche++; letzter = spiel.hufSammelTag; } [A, B, C].forEach((p, i) => { maxRatio = Math.max(maxRatio, (spiel.tag - p.pflege.huf) / ivls[i]); }); }
    R.sparsam = { ivls, tage, besuche, besucheJe: [A, B, C].map(p => p.hufBesuche), maxRatio: Math.round(maxRatio * 100) / 100, abstand: Math.ceil(tpj() / 2) };
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('ohne Stallmeister gibt es die Pensions-Leistung nicht', R.moeglichOhne === false && R.moeglichMit === true, JSON.stringify([R.moeglichOhne, R.moeglichMit]));
  ok('ohne Stallmeister: nur Dauerauftrag (Beta), Alpha bekommt einen Erinnerungsbrief, Pension unberührt', !R.ohne.alpha && R.ohne.beta && !R.ohne.gamma && !R.ohne.delta && R.ohne.brief >= 1 && R.ohne.rechnung === 1, JSON.stringify(R.ohne));
  ok('mit Stallmeister: Alpha (kein Dauerauftrag) und Beta kommen mit, kein Erinnerungsbrief', R.mit.alpha && R.mit.beta && R.mit.brief === 0, JSON.stringify(R.mit));
  ok('Pension: gebuchtes Pferd (Gamma) wird versorgt, ungebuchtes (Delta) nicht', R.mit.gamma && !R.mit.delta, JSON.stringify(R.mit));
  ok('eine Rechnung, nur für deine Pferde (Alpha, Beta), nicht für das Pensionspferd (Gamma), Anfahrt einmal', R.mit.rechnungen === 1 && R.mit.txtAlpha && R.mit.txtBeta && !R.mit.txtGamma && R.mit.anfahrt === 1, JSON.stringify(R.mit));
  ok('Besitzer-Nacht: gebuchtes Pferd wartet auf den Stallmeister, ungebuchtes macht der Besitzer selbst', !R.nacht.gamma && R.nacht.delta, JSON.stringify(R.nacht));
  ok('echter Tageswechsel: Alpha und Gamma werden vom Hufschmied versorgt, Delta vom Besitzer in der Nacht', R.tageswechsel.tag === 1 && R.tageswechsel.alpha && R.tageswechsel.gamma, JSON.stringify(R.tageswechsel));
  ok('ohne Stallmeister fällt gebucht → Besitzer macht es selbst (kein Stillstand)', R.fallback === true);
  ok('Mindestabstand: knapp fälliges Pferd wartet auf den nächsten Sammeltermin (kein Brief), Überfälliges lässt ihn gleich kommen, nach der halben Jahreszeit kommt er', R.wartet && R.briefWartet === 0 && R.ueberfaellig && R.nachAbstand, JSON.stringify([R.wartet, R.briefWartet, R.ueberfaellig, R.nachAbstand]));
  ok('sparsam: Rhythmen ½/1/2 JZ – Besuche höchstens alle halbe Jahreszeit, kein Pferd öfter als sein Rhythmus (+1), nie länger als 1,3 Intervalle', R.sparsam.besuche <= Math.ceil(R.sparsam.tage / R.sparsam.abstand) && R.sparsam.besucheJe.every((n, i) => n <= Math.ceil(R.sparsam.tage / R.sparsam.ivls[i]) + 1) && R.sparsam.maxRatio <= 1.3, JSON.stringify(R.sparsam));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
