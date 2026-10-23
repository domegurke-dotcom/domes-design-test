// v674: Besitzer-Sammelbriefe – Rückmeldungen und Futterwünsche mehrerer Besitzer an einem Tag in einem Brief, „Alle übernehmen“
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    const mk = (i, name) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P);
      const e = { eid: 'e' + i, vn: 'A' + i, nn: 'B' + i, w: true, pid: P.id, stufe: 1, leistungen: {}, haltung: 'box', preis: 200, zufr: 80, seit: jzJetzt(), einzug: 0, kuendigt: null, log: [], plus: [], befSeen: [], fbJz: jzJetzt(), fbTag: 1 };
      P.einsteller = e.eid; einstellerListe().push(e); return { e, P }; };
    spiel.tag = 50; const A = [mk(1, 'Alma'), mk(2, 'Bolle'), mk(3, 'Cora')];
    const n0 = (spiel.post || []).length;
    A.forEach(x => pensionFeedback(x.e, x.P)); ok('vor dem Senden noch kein Brief', (spiel.post || []).length === n0);
    sammelSenden(); const neu = (spiel.post || []).slice(0, (spiel.post || []).length - n0);
    ok('ein Sammelbrief statt drei', neu.length === 1 && /Rückmeldungen von 3 Besitzern/.test(neu[0].betreff), neu.map(x => x.betreff).join('|'));
    ok('alle drei Pferde im Text', ['Alma', 'Bolle', 'Cora'].every(n => neu[0].text.includes(n)));
    // einzelne bleibt ein normaler Brief
    const m = mk(4, 'Dora'); const n1 = spiel.post.length; pensionFeedback(m.e, m.P); sammelSenden();
    ok('einzelne Rückmeldung bleibt normaler Brief', spiel.post.length === n1 + 1 && /Rückmeldung zu Dora/.test(spiel.post[0].betreff));
    // Futterwünsche
    sammelEintrag('fw', { e: A[0].e, p: A[0].P, betreff: 'x', aktion: true, kurz: 'k1', einzel: 'e1' }); sammelEintrag('fw', { e: A[1].e, p: A[1].P, betreff: 'y', aktion: true, kurz: 'k2', einzel: 'e2' });
    sammelSenden(); const f = spiel.post[0];
    ok('Sammelbrief Futterwünsche mit Aktion', /Neue Futterwünsche \(2/.test(f.betreff) && f.aktion && f.aktion.typ === 'fwalle' && f.aktion.pids.length === 2);
    ok('Briefansicht ohne Fehler', typeof briefAktionHTML === 'function' && typeof briefAktionHTML(f) === 'string');
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
