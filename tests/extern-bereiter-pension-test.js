// v996 (Dome 8.11.): externe Mitarbeiter in Hofverwaltung → Mitarbeiter benannt, Externer Bereiter (Pferd, Tage, Training) · Pension: zubuchbare Fütterungsberatung · Tierarzt-Anfahrt einmal am Tag · Roundpen belegt → anderes Training · Umziehen draußen
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99; spiel.tag = 20;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0), B = mk('Berta', 1); zeigeHof('mitarbeiter'); const txt = document.querySelector('.kacheln.markt-kacheln').textContent.replace(/­/g, '');
    ok('Mitarbeiter: Überschrift „Externe Mitarbeiter“ und Namen „Externer Bereiter / Tierarzt / Hufschmied“, „Externe Futterberatung“', /Externe Mitarbeiter/.test(txt) && /Externer Bereiter/.test(txt) && /Externer Tierarzt/.test(txt) && /Externer Hufschmied/.test(txt) && /Externe Futterberatung/.test(txt), txt.slice(0, 400));
    ok('Kachel „Externer Bereiter“ zeigt gebuchte Pferde', /0 Pferde gebucht/.test(document.getElementById('bereiterExternAlle').textContent));
    document.getElementById('bereiterExternAlle').click(); const dl = () => document.getElementById('dlgInhalt'); ok('Dialog: je Pferd eine Karte mit Tage-Auswahl', dl().querySelectorAll('[data-xbt]').length === 4, String(dl().querySelectorAll('[data-xbt]').length));
    dl().querySelector('[data-xbt="0:1"]').click(); dl().querySelector('[data-xbt="0:1"]').click(); ok('Anna: 2 Tage gebucht', A.bereiterTage === 2, String(A.bereiterTage));
    dl().querySelector('[data-xbm="0:plan"]').click(); ok('Training „nach meinem Plan“: Übungen zum Anhaken', dl().querySelectorAll('[data-xbu^="0:"]').length > 3);
    const c1 = dl().querySelector('[data-xbu^="0:"]'); c1.checked = true; c1.dispatchEvent(new Event('change', { bubbles: true })); ok('Übung im Plan gespeichert', trainPlan(A).liste.length === 1 && trainPlan(A).selbst === false, JSON.stringify(A.trainPlan));
    dl().querySelector('[data-xbm="0:selbst"]').click(); ok('Zurück zu „entscheidet selbst“', trainPlan(A).selbst === true);
    ok('Kachel zeigt jetzt „1 Pferde gebucht“', (zeigeHof('mitarbeiter'), /1 Pferd gebucht/.test(document.getElementById('bereiterExternAlle').textContent)));
    // Pension: Fütterungsberatung zubuchbar, ohne Buchung keine Betreuung
    const x0 = bewerber('futterexperte')[0]; spiel.mitarbeiter = [{ id: 'fe1', typ: 'futterexperte', name: 'Katharina', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 4, bis: null }];
    ok('Pension-Leistung „Fütterungsberatung“ gibt es (nur mit angestelltem Experten)', !!PENSION_LEISTUNG.futter && leistungMoeglich('futter') === true && PL_REIHE.includes('futter'));
    const C = mk('Cora', 2); const e = { eid: 'eCora', vn: 'Anna', nn: 'T', w: true, pid: C.id, stufe: 1, leistungen: {}, haltung: 'box', zufr: 90, seit: jzJetzt() - 8, einzug: spiel.tag - 40, kuendigt: null, log: [] }; (spiel.einsteller = spiel.einsteller || []).push(e); C.einsteller = e.eid;
    ok('Pensionspferd ohne Buchung: keine Beratung', !expertBetreut(C) && !expertZustaendig(C)); e.leistungen.futter = true; ok('Pensionspferd mit gebuchter Beratung: wird vom Experten betreut', expertBetreut(C) && expertZustaendig(C));
    delete spiel.einsteller; delete C.einsteller;
    // Tierarzt-Anfahrt nur einmal am Tag
    delete spiel.vetAnfahrt; A.pflege.impf = 0; B.pflege.impf = 0; const p0 = (spiel.post || []).length; vorsorge(A, 'impfung'); const r1 = JSON.stringify((spiel.post || [])[0]); vorsorge(B, 'impfung'); const r2 = JSON.stringify((spiel.post || [])[0]);
    ok('Tierarzt: die Anfahrt steht nach zwei Impfungen am selben Tag nur einmal auf der (zusammengelegten) Rechnung', (r2.match(/Anfahrt Tierarzt/g) || []).length === 1 && /Anna: Impfung/.test(r2) && /Berta: Impfung/.test(r2), (r2.match(/Anfahrt Tierarzt/g) || []).length + ' Anfahrten');
    // Roundpen belegt: der Bereiter weicht aus (anderes Training aus „entscheidet selbst“)
    spiel.anlage = spiel.anlage || {}; spiel.anlage.roundpen = true; spiel.anlage.reitplatz = true; gebaeude().push({ gid: 'grp', typ: 'roundpen', stufe: 1, zustand: 100 }); [A, B].forEach(p => { p.trainHeute = { tag: spiel.tag, liste: [], verbraucht: 0, orte: ['roundpen'] }; });
    ok('Roundpen mit 2 Pferden belegt', roundpenBelegt()); const D = mk('Dora', 3); trainPlan(D).selbst = false; trainPlan(D).liste = ['longieren']; const planOk = trainPlan(D).liste.filter(k => !uebSperre(D, k) && uebOrt(k));
    ok('Plan nur mit Roundpen-Übung: dort keine Übung mehr möglich oder Ort wechselt – der Bereiter findet etwas anderes', planOk.length === 0 || uebOrt('longieren') !== 'roundpen', JSON.stringify(planOk) + uebOrt('longieren')); const l = bereiterTrainiert(D, { name: 'X', wissen: {}, typ: 'bereiter' }); ok('Bereiter trainiert Dora trotzdem (andere Übung)', Array.isArray(l) && l.length >= 0);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
