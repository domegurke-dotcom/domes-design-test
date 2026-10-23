// v669: Einstreu eines Pensionspferdes – Besitzer stimmt per Brief zu oder lehnt ab, Box ändert sich erst dann
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; pensionRegeln().offen = true;
    const F = futterkammer(); ['streuStroh', 'spaene', 'pellets', 'leinstroh'].forEach(k => F.lager[k] = 500);
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name: 'Gast' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P);
    const e = { eid: 'eT', vn: 'Anna', nn: 'Test', w: true, pid: P.id, stufe: 1, leistungen: {}, haltung: 'box', preis: 200, zufr: 80, seit: jzJetzt(), einzug: spiel.tag, kuendigt: null, log: [], befSeen: [] };
    P.einsteller = 'eT'; einstellerListe().push(e); const box = spiel.boxen[0]; box.pferd = P; box.einstreu = 'streuStroh'; aktBox = 0;
    einstreuWahl(box, () => { }); document.querySelector('[data-estreu="spaene"]').click();
    ok('Einstreu bleibt, Wunsch ist vorgemerkt', box.einstreu === 'streuStroh' && box.einstreuWunsch && box.einstreuWunsch.k === 'spaene');
    ok('Fenster sagt: Besitzer wird gefragt', /Besitzer wird gefragt/.test(document.getElementById('dlgInhalt').textContent)); document.getElementById('dlg').hidden = true;
    spiel.tag += 1; const r0 = Math.random; Math.random = () => 0; einstreuAntworten(); Math.random = r0;
    ok('Besser (Späne statt Stroh): Besitzer stimmt zu, Box ändert sich, Brief', box.einstreu === 'spaene' && !box.einstreuWunsch && (spiel.post || []).some(x => /Einstreu für Gast/.test(x.betreff) && /freuen/.test(x.text)));
    // schlechter: ablehnen (Zufall hoch)
    box.einstreuWunsch = { k: 'streuStroh', tag: spiel.tag - 1 }; Math.random = () => 0.99; einstreuAntworten(); Math.random = r0;
    ok('Schlechter (Stroh statt Späne): Besitzer lehnt ab, Einstreu bleibt', box.einstreu === 'spaene' && (spiel.post || []).some(x => /nicht annehmen/.test(x.text)));
    // Tierarzt empfiehlt: kann nicht ablehnen
    P.einstreuRat = { art: 'husten', tag: spiel.tag, von: 'Tierarzt' }; befundNeu(P, 'husten', 2, 'Test'); box.einstreu = 'streuStroh'; box.einstreuWunsch = { k: 'pellets', tag: spiel.tag - 1 }; Math.random = () => 0.99; einstreuAntworten(); Math.random = r0;
    ok('Vom Tierarzt empfohlen: Besitzer lehnt nicht ab', box.einstreu === 'pellets');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
