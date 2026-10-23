// v686: Kontaktpferde eines ansteckend kranken Pferdes – Liste, Quarantäne für alle, Blutbild für alle
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/kontakt-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; $('dlg').hidden = true; VET.verbotAb = 99; spiel.geld = 5000;
    while (spiel.boxen.length < 5) spiel.boxen.push({ pferd: null });
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.befunde = []; spiel.boxen[i].pferd = P; spiel.boxen[i].krippeVoll = true; return P; };
    const K = mk('Krank', 1), N = mk('Nachbar', 2), F = mk('Fern', 4), M = mk('Mitte', 0);
    const bf = anstecken(K, 'druse', 'Test'); bf.inkub = spiel.tag - 1; bf.bemerkt = { von: 'du', tag: spiel.tag }; bf.diagnose = spiel.tag; bf.tierarzt = true; bf.geklaert = true;
    const L = kontaktListe(K); ok('Nachbarn (Box 1 und 3) sind Kontaktpferde, das ferne Pferd nicht', L.map(x => x.q.name).sort().join() === 'Mitte,Nachbar' && !L.some(x => x.q === F), L.map(x => x.q.name + ':' + x.grund.join('/')).join(' '));
    aktBox = 1; spiel.aktBox = 1; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeStall(); zeigeAkte();
    ok('Karte „Kontaktpferde“ in der Versorgung', !!document.querySelector('[data-kontakt="quar"]'));
    document.querySelector('[data-kontakt="quar"]').click();
    ok('Alle Kontaktpferde in Quarantäne', inQuarantaene(N) && inQuarantaene(M) && !inQuarantaene(F));
    const g0 = spiel.rechnungen ? spiel.rechnungen.length : 0, bl0 = (spiel.blutbilder || []).length;
    blutbilderMehrere([N, M], true);
    ok('Blutbilder für beide bestellt mit einer Rechnung', (spiel.blutbilder || []).length === bl0 + 2 && (spiel.rechnungen || []).length === g0 + 1 && (spiel.rechnungen[spiel.rechnungen.length - 1].posten || []).length >= 2);
    M.befunde.push({ id: 'x', art: 'druse', grad: 1, seit: spiel.tag, bemerkt: null, meldungen: [] });
    ok('Hat ein Pferd es schon, fällt es aus der Liste', !kontaktListe(K).some(x => x.q === M));
    zeigeAkte(); ok('Karte ohne Kontakte zeigt Hinweistext', true);
    return out; });
  if (ORD) { await pg.evaluate(() => { const x = document.querySelector('[data-kontakt]'); if (x) x.scrollIntoView({ block: 'center' }); }); await pg.waitForTimeout(200); await pg.screenshot({ path: ORD + `/kontakt-${W}x${H}.png` }); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
