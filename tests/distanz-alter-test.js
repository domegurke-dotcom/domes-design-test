// Distanz-Mindestalter wie in echt (VDD-Reglement Nr. 2.2): Einführungsritt 5, Kurze und Mittlere Distanz 6, Lange Distanz 7 Jahre;
// Mittlere Distanz 80 km zählt für die FEI-Einsteigerritte (80–100 km). Traber-Qualifikation: Text nennt 1.900 m (Zweijährige 1.600 m).
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = []; pg.on('pageerror', e => fehler.push(e.message));
  let rot = 0; const ok = (t, b, x) => { console.log((b ? '✓ ' : '✗ ') + t + (b ? '' : ' – ' + (x || ''))); if (!b) rot++; };
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/'));
  await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child');
  await pg.evaluate(() => { spiel.stufenAn = false; });
  // Kalender so lange weiterdrehen, bis ein Distanzritt drinsteht
  const r = await pg.evaluate(() => {
    let T = null;
    for (let i = 0; i < 60 && !T; i++) { T = (spiel.turniere || []).find(t => (t.pruef || []).some(P => P.disz === 'distanz')); if (!T) naechsteNacht(); }
    if (!T) return { fehlt: true };
    return { pr: T.pruef.filter(P => P.disz === 'distanz').map(P => ({ n: P.name, ab: P.ab, km: P.km, cei: P.cei || 0 })) };
  });
  ok('Distanzritt steht im Kalender', !r.fehlt, JSON.stringify(r));
  if (!r.fehlt) {
    const P = n => r.pr.find(x => x.n.startsWith(n)) || {};
    ok('Einführungsritt ab 5 Jahren (30 km)', P('Einführungsritt').ab === 20 && P('Einführungsritt').km === 30, JSON.stringify(P('Einführungsritt')));
    ok('Kurze Distanz ab 6 Jahren (50 km)', P('Kurze').ab === 24 && P('Kurze').km === 50, JSON.stringify(P('Kurze')));
    ok('Mittlere Distanz ab 6 Jahren, Strecke 62–80 km, Name nennt die Strecke', P('Mittlere').ab === 24 && P('Mittlere').km >= 62 && P('Mittlere').km <= 80 && P('Mittlere').n.includes(P('Mittlere').km + ' km'), JSON.stringify(P('Mittlere')));
    ok('Lange Distanz ab 7 Jahren (100 km)', P('Lange').ab === 28 && P('Lange').km === 100, JSON.stringify(P('Lange')));
    ok('CEI 1* ab 6, 2* ab 7, 3* ab 8 Jahren', P('CEI 1').ab === 24 && P('CEI 2').ab === 28 && P('CEI 3').ab === 32, JSON.stringify(r.pr));
  }
  const v = await pg.evaluate(() => { const K = new Set(); for (let i = 0; i < 40 * tpj(); i++) { (spiel.turniere || []).forEach(t => (t.pruef || []).forEach(P => { if (P.disz === 'distanz' && P.name.startsWith('Mittlere')) K.add(t.id + ':' + P.km); })); naechsteNacht(); }
    return [...K].map(x => +x.split(':').pop()); });
  ok('Über 10 Jahre: Strecken verschieden, alle 62–80 km, volle 80 km kommen vor, aber nicht immer', v.length > 5 && v.every(k => k >= 62 && k <= 80) && v.includes(80) && v.some(k => k < 80), v.join(' '));
  const q = await pg.evaluate(() => {
    const p = { distQuali: { kurz: 0, lang: 0, km: [] } };
    distQualiZaehlen(p, { km: 50 }, 14); distQualiZaehlen(p, { km: 50 }, 14); const vor = noviceFertig(Object.assign(p, { alter: 6 }));
    distQualiZaehlen(p, { km: 80 }, 14); distQualiZaehlen(p, { km: 80 }, 17); const halb = { ...p.distQuali };
    distQualiZaehlen(p, { km: 80 }, 15);
    return { vor, kurz: halb.kurz, langHalb: halb.lang, lang: p.distQuali.lang, fertig: p.distQuali.kurz >= 2 && p.distQuali.lang >= 2 };
  });
  ok('Mittlere Distanz (80 km) zählt als langer Einsteigerritt, über 16 km/h nicht', q.kurz === 2 && q.langHalb === 1 && q.lang === 2 && q.fertig, JSON.stringify(q));
  const t = await pg.evaluate(() => ({ info: UEBUNG.trabquali.info, zwei: trabQualiStand(neuesPferd({ rasse: 'traber', geschlecht: 'Stute', alter: 2, name: 'Zwei' })),
    alt: (() => { const p = neuesPferd({ rasse: 'traber', geschlecht: 'Stute', alter: 5, name: 'Alt' }); p.skalaT = [0, 0, 0, 0, 0]; delete p.trabQuali; return trabQualiStand(p); })() }));
  ok('Qualifikationslauf: Info nennt 1.900 m und 1.600 m für Zweijährige', /1\.900 m/.test(t.info) && /1\.600 m/.test(t.info) && /1:25,0 oder schneller/.test(t.info), t.info);
  ok('Sperrtext: Zweijährige 1.600 m, Ältere 1.900 m', /1\.600 m/.test(t.zwei) && /1\.900 m/.test(t.alt), t.zwei + ' | ' + t.alt);
  ok('keine Seitenfehler', !fehler.length, fehler.join(' | '));
  await br.close(); process.exit(rot ? 1 : 0);
})();
