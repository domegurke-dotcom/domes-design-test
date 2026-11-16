// M6b (Dome 16.11.2026): Bodenarbeit auch in der Stallgasse – Box → Pferdepflege → Orte → Stallgasse → Bodenarbeit (echte Klicks)
// Aufruf: NODE_PATH=<pw/node_modules> node tests/stallgasse-test.js [BxH] [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [bw, bh] = (process.argv[2] || '1366x768').split('x').map(Number), ordner = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: bw, height: bh }, hasTouch: bw < 900 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Gasse'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x != null && !c ? ' – ' + x : ''));
  const bild = async n => { if (ordner) { fs.mkdirSync(ordner, { recursive: true }); await pg.screenshot({ path: path.join(ordner, `stallgasse-${bw}x${bh}-${n}.png`) }); } };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 90000;
    const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 6, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.reheOk = spiel.tag;
    const i = spiel.boxen.findIndex(x => !x.pferd); spiel.boxen[i].pferd = P; spiel.boxen[i].krippeVoll = true; spiel.boxen[i].wasserTag = spiel.tag; });
  ok('Stallgasse ist immer offen', await pg.evaluate(() => ortOffen('stallgasse')));
  ok('Bodenarbeit in der Stallgasse erlaubt', await pg.evaluate(() => uebHier('bodenarbeit', 'stallgasse')));
  ok('Longieren nicht in der Stallgasse', await pg.evaluate(() => !uebHier('longieren', 'stallgasse')));
  ok('Freiarbeit nicht in der Stallgasse', await pg.evaluate(() => !uebHier('freiarbeit', 'stallgasse')));
  /* Orte-Reiter öffnen wie ein Spieler: Box antippen → Pferdepflege → Orte */
  await pg.evaluate(() => { zeigeSchirm(null); const i = spiel.boxen.findIndex(x => x.pferd && x.pferd.name === 'Anna'); aktBox = i; spiel.aktBox = i; aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; zeigeAkte(); }); await pg.waitForTimeout(400);
  await bild('orte');
  const kachel = pg.locator('.kachel[data-ort="tr-stallgasse"]');
  ok('Kachel „Stallgasse“ unter dem Hofplan', await kachel.count() === 1, await pg.evaluate(() => [...document.querySelectorAll('.kachel[data-ort]')].map(k => k.dataset.ort).join(',')));
  if (await kachel.count()) { await kachel.click(); await pg.waitForTimeout(400); }
  await bild('stallgasse');
  const ueb = await pg.evaluate(() => [...document.querySelectorAll('[data-ueb], [data-uebung], [data-tr]')].map(e => e.dataset.ueb || e.dataset.uebung || e.dataset.tr));
  ok('In der Stallgasse nur Bodenarbeit (und Spaziergang nicht)', ueb.includes('bodenarbeit') && !ueb.includes('longieren'), JSON.stringify(ueb));
  const knopf = pg.locator('[data-ueb="bodenarbeit"], [data-uebung="bodenarbeit"], [data-tr="bodenarbeit"]').first();
  if (await knopf.count()) { await knopf.click(); await pg.waitForTimeout(500); }
  await bild('nach');
  const T = await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; return p.trainHeute ? { orte: p.trainHeute.orte, l: p.trainHeute.liste.map(e => e.k + '@' + e.ort) } : null; });
  ok('Bodenarbeit in der Stallgasse trainiert', !!T && T.l.includes('bodenarbeit@stallgasse'), JSON.stringify(T));
  /* „selbst gemacht“: gute Ausführung lernt mehr als „schnell“, schlechte weniger (gleicher Zufall: zwei Kopien desselben Pferdes) */
  const fak = await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'), P0 = JSON.parse(JSON.stringify(b.pferd)); delete P0.trainHeute;
    const lauf = (opt) => { const q = JSON.parse(JSON.stringify(P0)); q.id = q.id + (opt ? opt.guete : 's'); const e = trainieren(q, 'bodenarbeit', 'stallgasse', null, opt); return Object.values(e.plus).reduce((a, x) => a + x, 0); };
    return { schnell: lauf(), gut: lauf({ guete: 1 }), schlecht: lauf({ guete: 0 }) }; });
  ok('selbst gut > schnell > selbst schlecht', fak.gut > fak.schnell && fak.schnell > fak.schlecht, JSON.stringify(fak));
  /* Verhalten beim Führen: Reaktionen kommen öfter bei wenig Vertrauen; richtige Antwort hebt, falsche senkt das Vertrauen */
  const vh = await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; const n = (vt) => { p.werte.ist.vertrauen = vt; let k = 0; for (let i = 0; i < 2000; i++) if (fuehrReaktion(p)) k++; return k / 2000; };
    const wenig = n(5), viel = n(95); p.werte.ist.vertrauen = 40; const a = fuehrAntwort(p, 'draengelt', true), v1 = p.werte.ist.vertrauen; const b = fuehrAntwort(p, 'draengelt', false), v2 = p.werte.ist.vertrauen;
    return { wenig, viel, arten: Object.keys(FUEHR_VERHALTEN).length, rplus: a.plus, v1, v2, tipp: !!b.tipp }; });
  ok('wenig Vertrauen → mehr Reaktionen', vh.wenig > vh.viel + 0.2, JSON.stringify(vh));
  ok('richtige Antwort: Vertrauen steigt, falsche: sinkt', vh.rplus > 0 && vh.v2 < vh.v1 && vh.tipp, JSON.stringify(vh));
  ok('keine Seitenfehler', !errs.length, errs.join(' | ').slice(0, 300));
  console.log(out.join('\n')); await b.close();
})();
