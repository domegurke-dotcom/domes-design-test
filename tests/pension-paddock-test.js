// v680 (Dome 23.10.): Pensionsplätze getrennt nach Boxen und Paddockboxen, eigener Aufpreis je Stufe der Paddockbox
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/pension-paddock-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 20000;
    spiel.boxen = [{ pferd: null }, { pferd: null }, { pferd: null }, { pferd: null, paddock: true }, { pferd: null, paddock: true }];
    const Rg = pensionRegeln(); Rg.offen = true; Rg.max = 99; Rg.leistungen.paddockbox = true;
    ok('Neues Spiel: Paddockbox-Plätze stehen auf 0', Rg.maxPaddock === 0 && Rg.pdAuf[1] === 50, String(Rg.maxPaddock));
    delete Rg.pdV; delete Rg.maxPaddock; pensionRegeln(); ok('Alter Spielstand mit Paddockboxen: „alle“', Rg.maxPaddock === 99);
    Rg.maxPaddock = 0; ok('Paddockboxen auf „keine“ → 0 Paddock-Plätze', pensionPlaetzeArt(true) === 0);
    const anf = pd => ({ aid: 'x' + Math.random(), vn: 'A', nn: 'B', w: true, pferd: neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'P' + Math.random().toString(36).slice(2, 5) }), leistungen: pd ? { paddockbox: true } : {}, haltung: 'box', tag: spiel.tag - 1, bis: spiel.tag + 3, bluttest: 'keiner' });
    let a = anf(true); ok('Paddockbox-Wunsch wird abgelehnt, wenn keine Paddock-Plätze', /Paddockbox/.test(pensionAnnehmen(a) || ''), pensionAnnehmen(a));
    a = anf(false); ok('Normale Anfrage kommt in eine normale Box', !pensionAnnehmen(a) && !spiel.boxen[a.box].paddock); (spiel.pensionAnfragen = spiel.pensionAnfragen || []).push(a);
    Rg.max = 1; a = anf(false); ok('Box-Plätze voll (1) → nächste normale Anfrage geht nicht (Paddockbox gesperrt)', !!pensionAnnehmen(a), pensionAnnehmen(a));
    Rg.maxPaddock = 99; Rg.pdAuf[1] = 80; a = anf(true); ok('Paddockbox-Wunsch geht mit freien Paddock-Plätzen', !pensionAnnehmen(a) && spiel.boxen[a.box].paddock);
    (spiel.pensionAnfragen = spiel.pensionAnfragen || []).push(a); spiel.tag++; pensionEinzug();
    const e = einstellerListe().find(x => x.pid === a.pferd.id); ok('Einzug: Aufpreis 80 € festgeschrieben', e && e.pdA === 80, JSON.stringify(e && { pdA: e.pdA, preis: e.preis }));
    ok('Abrechnung: Box + 80 € Aufpreis', e && leistPreis(e, 'paddockbox') === 80);
    Rg.pdAuf[1] = 120; ok('Spätere Preisänderung gilt nicht für den bisherigen Einsteller', leistPreis(e, 'paddockbox') === 80);
    ok('Nachfrage sinkt bei teurem Aufpreis', pdNachfrage() < 1, String(pdNachfrage()));
    Rg.pdAuf[1] = 20; ok('… und steigt bei günstigem', pdNachfrage() > 1, String(pdNachfrage()));
    ok('Belegt-Zähler: 1 Box, 1 Paddockbox', pensionBelegt(false) === 1 && pensionBelegt(true) === 1, pensionBelegt(false) + '/' + pensionBelegt(true));
    hofBereich = 'pension'; zeigeHof('hof');
    const t = document.getElementById('nebenSchirm').textContent;
    ok('Anzeige: Plätze in Paddockboxen und Preis je Paddockbox', /Plätze in Paddockboxen/.test(t) && /Preis je Paddockbox/.test(t) && /Paddockbox Stufe 1/.test(t));
    return out; });
  if (ORD) { await pg.evaluate(() => { const x = [...document.querySelectorAll('h4')].find(h => /Paddockbox/.test(h.textContent)); if (x) x.scrollIntoView(); }); await pg.waitForTimeout(150); await pg.screenshot({ path: ORD + `/pension-pd-${W}x${H}.png` }); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
