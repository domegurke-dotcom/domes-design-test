// v948: Aufnahme schreibt Entscheidungen und Tagesarbeit mit Zahlen mit (Grundlage für das Nachspielen durch den Testspieler)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; speicherSperre = true; spiel.geld = 50000;
    const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Rec' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); spiel.boxen[1].pferd = p; aktBox = 1; spiel.aktBox = 1;
    aufnahmeStart(); const A = () => AUF.laufend.eintraege;
    // Tagesarbeit mit Boxnummer
    document.getElementById('dlg').hidden = true; wasserEimerFuellen(); ok('Wasser selbst mit Boxnummer', A().some(e => e.a === 'Wasser selbst' && e.bx === 2), JSON.stringify(A().slice(-2)));
    putzen(p, 'buerste'); ok('Putzen als Aktion mit Pferd', A().some(e => e.a === 'Aktion putzen' && e.k === 'putzen' && e.ar[0].pferd === 'Rec' && e.ar[1] === 'buerste'));
    // Entscheidungen mit Zahlen
    const ok1 = bauStarten('reitplatz', 1); ok('Bauen mit Typ und Stufe', A().some(e => e.k === 'bauStarten' && e.ar[0] === 'reitplatz' && e.ar[1] === 1 && e.ok === (ok1 === false ? 0 : 1)), JSON.stringify(A().filter(e => e.k === 'bauStarten')));
    futterKaufen('heu', 100); ok('Futter kaufen mit Menge', A().some(e => e.k === 'futterKaufen' && e.ar[0] === 'heu' && e.ar[1] === 100));
    kreditNeu(1000, 4, 'Test'); ok('Kredit mit Summe', A().some(e => e.k === 'kreditNeu' && e.ar[0] === 1000));
    // verschachtelte Aufrufe zählen nicht doppelt
    const n0 = A().filter(e => e.k === 'bauStarten').length; ok('Keine Doppeleinträge', n0 === 1, n0);
    // Einstellungen: Basis, dann Preisänderung → Eintrag nach der nächsten Nacht
    naechsteNacht(); document.getElementById('dlg').hidden = true;
    ok('Anfangsstand der Einstellungen', A().some(e => e.a === 'Einstellung' && e.anfang === 1));
    const R0 = pensionRegeln(); R0.preis[1] = R0.preis[1] + 20; p.weidegang = 'taeglich'; naechsteNacht(); document.getElementById('dlg').hidden = true;
    const E = A().filter(e => e.a === 'Einstellung' && !e.anfang); ok('Preisänderung erscheint als Einstellung', E.length === 1 && E[0].pension && E[0].pension.preis[1] === R0.preis[1], JSON.stringify(E));
    ok('Weidegang-Änderung (Box 2) erscheint', E[0] && E[0].boxen && E[0].boxen[2] && E[0].boxen[2].weidegang === 'taeglich');
    // Alles wird mitgeschrieben, aber gekennzeichnet: Mitarbeiter (ma), Nacht (n), verschachtelt (v) – das Nachspielen nimmt nur Einträge ohne diese Zeichen
    AKT.nacht++; putzen(p, 'kamm'); AKT.nacht--; ok('Nachtarbeit wird mit n=1 mitgeschrieben', A().some(e => e.k === 'putzen' && e.n === 1));
    behandeln(p, 'wundsalbe', 1, { name: 'Paul' }); ok('Mitarbeiter-Behandlung mit ma=Paul', A().some(e => e.k === 'behandeln' && e.ma === 'Paul'));
    const nS = A().length; AKT.tief++; putzen(p, 'buerste'); AKT.tief--; ok('Verschachtelter Aufruf mit v=1', A().length > nS && A()[A().length - 1].v === 1);
    ok('Eigene Aktionen ohne Kennzeichen', A().filter(e => e.k === 'bauStarten').every(e => !e.ma && !e.n && !e.v));
    // ohne Aufnahme nichts
    aufnahmeEnde(''); const n1 = AUF.liste[AUF.liste.length - 1].eintraege.length; putzen(p, 'kamm'); ok('Ohne laufende Aufnahme kein Eintrag', AUF.liste[AUF.liste.length - 1].eintraege.length === n1);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
