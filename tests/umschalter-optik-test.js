// v994 (Dome 8.11.): alle Umschalter einheitlich – aktiv = Farbe der aktiven Steckbrief-Karte, nicht aktiv = beige/braun, gerade Schrift; Turnier-Sortierung mit Mehrfachauswahl
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; spiel.admin = true;
    const rgb = el => getComputedStyle(el).backgroundColor, AN = 'rgb(255, 250, 240)', AUS = 'rgb(228, 211, 180)', P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P;
    const probe = (name, html) => { const h = document.createElement('div'); h.innerHTML = html; document.body.appendChild(h); const an = h.querySelector('.an'), aus = h.querySelector('button:not(.an)'); const okA = an && rgb(an) === AN && getComputedStyle(an).fontStyle === 'normal' && +getComputedStyle(an).fontWeight >= 700, okI = aus && rgb(aus) === AUS && getComputedStyle(aus).fontStyle === 'normal'; h.remove(); ok(name + ': aktiv = Karten-Farbe (fett), inaktiv = beige', !!okA && !!okI, an && aus ? rgb(an) + ' / ' + rgb(aus) : 'nicht gefunden'); };
    probe('Pinnwand', '<span class="pinn-sort"><button class="mini-knopf an" data-psort="jahr">a</button><button class="mini-knopf" data-psort="klasse">b</button></span>');
    probe('Whiteboard Mitarbeiter Alle/Gruppen', '<div class="wb-ma-kopf"><button class="mini-knopf an" data-wbmas="alle">Alle</button><button class="mini-knopf" data-wbmas="gruppen">Gruppen</button></div>');
    probe('Turnier-Sortierung', '<div><button class="mini-knopf an" data-tsort="datum">a</button><button class="mini-knopf" data-tsort="disz">b</button></div>');
    probe('Futterplan Mahlzeiten', '<div><button class="mini-knopf an" data-fpmahl="2">2</button><button class="mini-knopf" data-fpmahl="3">3</button></div>');
    probe('Finanzen Konto/Bank', '<div class="fin-tabs"><button class="an" data-ftab="konto">Konto</button><button data-ftab="bank">Bank</button></div>');
    probe('Finanzen Tabelle/Diagramm', '<div class="fin-ansicht"><button class="an" data-fansicht="tabelle">T</button><button data-fansicht="diagramm">D</button></div>');
    probe('Finanzen Jahre', '<div class="fin-jahre"><button class="an" data-fj="1">1</button><button data-fj="2">2</button></div>');
    probe('Postfach-Ordner', '<div class="post-ordner"><button class="an" data-ordner="eingang">E</button><button data-ordner="stern">S</button></div>');
    probe('Versorgung Heute/Gesundheit', '<div class="vs-tabs"><button class="an" data-vs="heute">H</button><button data-vs="gesund">G</button></div>');
    probe('Bereiter-Modus', '<div><button class="mini-knopf an" data-bmodus="selbst">a</button><button class="mini-knopf" data-bmodus="plan">b</button></div>');
    probe('Azubi-Einsatz', '<div><button class="mini-knopf an" data-azeins="x:stall">a</button><button class="mini-knopf" data-azeins="x:putzen">b</button></div>');
    probe('Hufschmied-Rhythmus', '<div><button class="mini-knopf an" data-hsrhythmus="x:y">a</button><button class="mini-knopf" data-hsrhythmus="x:z">b</button></div>');
    // Reiter (Vorlage) – unverändert gleiche Farben
    const rh = document.createElement('div'); rh.className = 'reiter'; rh.innerHTML = '<button class="an">A</button><button>B</button>'; document.body.appendChild(rh); ok('Reiter (Steckbrief) liefern dieselben Farben', rgb(rh.children[0]) === AN && rgb(rh.children[1]) === AUS, rgb(rh.children[0]) + ' / ' + rgb(rh.children[1])); rh.remove();
    // Turnier-Sortierung: Mehrfachauswahl
    turnierSortierung = 'datum'; for (let d = 1; d <= 80; d++) { spiel.tag = d; document.getElementById('dlg').hidden = true; turnierDialog(P, () => {}); if (document.querySelector('#dlgInhalt [data-tsort]')) break; } const an = () => [...document.querySelectorAll('#dlgInhalt [data-tsort].an')].map(x => x.dataset.tsort).sort().join(',');
    if (document.querySelector('#dlgInhalt [data-tsort]')) { ok('Start: nur „Datum“ aktiv', an() === 'datum', an()); document.querySelector('#dlgInhalt [data-tsort="machbar"]').click(); ok('Machbarkeit dazu: Datum und Machbarkeit aktiv', an() === 'datum,machbar', an());
      document.querySelector('#dlgInhalt [data-tsort="disz"]').click(); ok('Disziplin dazu: alle drei aktiv', an() === 'datum,disz,machbar', an()); document.querySelector('#dlgInhalt [data-tsort="datum"]').click(); document.querySelector('#dlgInhalt [data-tsort="machbar"]').click(); document.querySelector('#dlgInhalt [data-tsort="disz"]').click(); ok('Alle abgewählt: „Datum“ bleibt als Standard aktiv', an() === 'datum', an()); } else ok('Turnier-Dialog zeigt Sortier-Knöpfe', false, 'keine Turniere im Kalender');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
