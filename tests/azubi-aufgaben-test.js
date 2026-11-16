// M6b (Dome 16.11.2026): Azubi-Aufgaben Weide/Bodenarbeit/Longieren, Bewertung durch den Ausbilder, 20 % „Bewegen von Pferden“ in der Prüfung
// Aufruf: NODE_PATH=<pw/node_modules> node tests/azubi-aufgaben-test.js [BxH] [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [bw, bh] = (process.argv[2] || '1366x768').split('x').map(Number), ordner = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: bw, height: bh } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'Mia'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Betrieb'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x != null && !c ? ' – ' + x : ''));
  const bild = async n => { if (ordner) { fs.mkdirSync(ordner, { recursive: true }); await pg.screenshot({ path: path.join(ordner, `azubi-auf-${bw}x${bh}-${n}.png`) }); } };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; azubiStarten(); });
  const st = await pg.evaluate(() => ({ auf: azubiAufgabenJetzt(), brief: (spiel.post.find(x => /Willkommen in der Ausbildung/.test(x.betreff)) || {}).text || '' }));
  ok('1. Jahr: Aufgaben Weide und Bodenarbeit (Longe erst ab Jahr 3)', st.auf.join() === 'weide,boden', JSON.stringify(st.auf));
  ok('Willkommensbrief nennt die Aufgaben', /Aufgaben in dieser Jahreszeit/.test(st.brief) && /Bodenarbeit mit Betriebspferden/.test(st.brief));
  /* Bodenarbeit mit einem Betriebspferd per Klick: Box → Orte → Stallgasse → Bodenarbeit */
  await pg.evaluate(() => { zeigeSchirm(null); const i = spiel.boxen.findIndex(x => x.pferd && x.pferd.betrieb); aktBox = i; spiel.aktBox = i; aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; zeigeAkte(); }); await pg.waitForTimeout(400);
  await pg.locator('.kachel[data-ort="tr-stallgasse"]').click(); await pg.waitForTimeout(400);
  await bild('stallgasse');
  const knopfB = pg.locator('[data-ueb="bodenarbeit"], [data-uebung="bodenarbeit"], [data-tr="bodenarbeit"]').first();
  if (!(await knopfB.count())) console.log('DBG', await pg.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 700)));
  else { await knopfB.click(); await pg.waitForTimeout(500); }
  await bild('bodenarbeit');
  ok('Bodenarbeit mit Betriebspferd zählt als Aufgabe', await pg.evaluate(() => azubiAufgabenStand().find(x => x.k === 'boden').ist === 1), JSON.stringify(await pg.evaluate(() => azubiAufgabenStand())));
  ok('Bodenarbeit mit eigenem/fremdem Pferd zählt nicht', await pg.evaluate(() => { const q = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 7, name: 'Fremd' }); werteErgaenzen(q); trainieren(q, 'bodenarbeit', 'stallgasse'); return azubiAufgabenStand().find(x => x.k === 'boden').ist === 1; }));
  /* Weidegang: abends noch als „auf der Weide“ vermerkt */
  ok('Weidegang zählt am Abend', await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.betrieb); b.pferd.weide = { w: 'test' }; azubiAbend(); delete b.pferd.weide; return azubiAufgabenStand().find(x => x.k === 'weide').ist === 1; }));
  /* Ende der Jahreszeit: Bewertung im Vergütungsbrief */
  const bew = await pg.evaluate(() => { const A = spiel.azubi; A.startJz = jzJetzt() - 1; A.auf.jz = jzJetzt() - 1; azubiJahreszeit(); const br = spiel.post.filter(x => /Ausbildungsvergütung/.test(x.betreff)).pop(); return { text: br ? br.text : '', bew: A.bew, auf: A.auf || null }; });
  ok('Brief mit Bewertung, Note und neuen Aufgaben', /Bewertung/.test(bew.text) && /Note:/.test(bew.text) && /Aufgaben in dieser Jahreszeit/.test(bew.text), bew.text.slice(-400));
  ok('Bewertung gespeichert (Punkte < 100, weil Ziel nicht erreicht)', bew.bew && bew.bew.length === 1 && bew.bew[0].pkt > 0 && bew.bew[0].pkt < 100, JSON.stringify(bew.bew));
  /* 3. Jahr: Longieren dazu */
  ok('3. Jahr: Longieren kommt dazu', await pg.evaluate(() => { spiel.azubi.startJz = jzJetzt() - 9; return azubiAufgabenJetzt().includes('longe'); }));
  /* Prüfung: Praxis = 80 % Versorgung + 20 % Bewegen */
  const pr = await pg.evaluate(() => { const A = spiel.azubi; A.tage = 10; A.gut = 10; A.bew = [{ jz: 0, pkt: 50 }]; let txt = ''; const alt = dialog; dialog = (h) => { txt = h; }; try { azubiAuswerten('zp', null, [1, 2, 3, 4, 5], [0, 0, 0, 0, 0], null); } finally { dialog = alt; } return { zp: A.zp, txt }; });
  ok('Prüfung: Praxis 100 Versorgung + 50 Bewegen → 90, Ergebnis 95', pr.zp && pr.zp.pkt === 95 && /Bewegen von Pferden/.test(pr.txt), JSON.stringify(pr.zp));
  ok('keine Seitenfehler', !errs.length, errs.join(' | ').slice(0, 300));
  console.log(out.join('\n')); await b.close();
})();
