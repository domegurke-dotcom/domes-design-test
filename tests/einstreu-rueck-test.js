// v902 (Dome 30.10.): Besitzer will „Bessere Einstreu“ kündigen und zurück zu Stroh – Zustimmen / Gegenvorschlag / Ablehnen (echte Klicks im Brief)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const setup = async (nr) => pg.evaluate((nr) => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; pensionRegeln().offen = true; spiel.post = [];
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name: 'Gast' + nr }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P);
    const e = { eid: 'eT' + nr, vn: 'Anna', nn: 'Test', w: true, pid: P.id, stufe: 1, leistungen: { einstreu: true }, haltung: 'box', preis: 200, zufr: 80, seit: jzJetzt(), einzug: spiel.tag, kuendigt: null, log: [], befSeen: [] };
    P.einsteller = 'eT' + nr; einstellerListe().length = 0; einstellerListe().push(e); const box = spiel.boxen[0]; box.pferd = P; box.einstreu = 'spaene'; aktBox = 0;
    const r0 = Math.random; Math.random = () => 0; einstreuRueckBriefe(); Math.random = r0; return spiel.post.length; }, nr);
  const oeffnen = async () => { await pg.evaluate(() => { briefFenster(spiel.post[0].id, null); }); await pg.waitForTimeout(300); };
  // 1. Zustimmen
  let n = await setup(1); ok('Brief kommt', n === 1, n); await oeffnen(); await pg.click('[data-baktion="er-ja"]'); await pg.waitForTimeout(300);
  let r = await pg.evaluate(() => ({ e: spiel.boxen[0].einstreu, l: einstellerListe()[0].leistungen.einstreu })); ok('Zustimmen: Stroh, Zusatzleistung entfällt', r.e === 'streuStroh' && !r.l, JSON.stringify(r));
  // 2. Ablehnen
  n = await setup(2); await oeffnen(); const z0 = await pg.evaluate(() => einstellerListe()[0].zufr); await pg.click('[data-baktion="er-nein"]'); await pg.waitForTimeout(300);
  r = await pg.evaluate(() => ({ e: spiel.boxen[0].einstreu, l: einstellerListe()[0].leistungen.einstreu, z: einstellerListe()[0].zufr })); ok('Ablehnen: bleibt wie es ist, Unzufriedenheit steigt', r.e === 'spaene' && r.l && r.z < z0, JSON.stringify(r) + ' vorher ' + z0);
  // 3. Gegenvorschlag (Zufall 0 → angenommen)
  n = await setup(3); await oeffnen(); await pg.click('[data-baktion="er-gegen"]'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { Math.random = () => 0; }); await pg.click('[data-ergegen="pellets"]'); await pg.waitForTimeout(300);
  r = await pg.evaluate(() => ({ e: spiel.boxen[0].einstreu, l: einstellerListe()[0].leistungen.einstreu })); ok('Gegenvorschlag angenommen: Pellets, Zusatzleistung bleibt', r.e === 'pellets' && r.l, JSON.stringify(r));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
