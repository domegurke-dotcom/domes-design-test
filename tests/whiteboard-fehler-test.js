// Dome 24.10. (Aufnahme „kurzer whiteboard test“): automatisch zugeteilte Mitarbeiter lassen sich entfernen; wer morgens auf die Weide kam, zählt trotzdem als versorgt (kein „heute niemand“, „x von 3“ stimmt)
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/whiteboard-fehler-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anni', 0), B2 = mk('Bea', 1);
    const x0 = bewerber('stallbursche')[0], m = { id: 'mx', typ: 'stallbursche', name: 'Paul', w: x0.w, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt(), bis: null }; (spiel.mitarbeiter = spiel.mitarbeiter || []).push(m);
    if (!aktive('stallbursche').length) { ok('Stallbursche aktiv', false, JSON.stringify(Object.keys(m))); return out; }
    spiel.boxen[0].maPlan = { stall: 'mx' };
    A.weide = { seit: spiel.tag, nachm: 'weide' };   // heute morgen rausgebracht
    const z = maZuteilung('stall'); ok('Fest zugeteilt + heute auf der Weide: zählt als versorgt', z.some(x => x.i === 0 && x.m === m), JSON.stringify(z.map(x => x.i)));
    hofReiter = 'hof'; spiel.stallAnsicht = 'board'; wbSicht = 'boxen'; zeigeWhiteboard();
    const t = document.getElementById('nebenSchirm').innerText; ok('Kein „heute niemand“', !/heute niemand/.test(t), t.slice(0, 200));
    ok('Zähler zeigt 2 von …', /2 von \d+ Boxen/.test(t), (t.match(/\d+ von \d+ Boxen/) || [''])[0]);
    // automatisch zugeteilt bei Bea → ✕ → niemand
    const x = document.querySelector('[data-wbloes="1:stall"]'); ok('✕ auch beim automatisch zugeteilten Mitarbeiter', !!x, '');
    if (x) { x.click(); ok('Box 2: niemand', spiel.boxen[1].maPlan && spiel.boxen[1].maPlan.stall === '-' && !maZuteilung('stall').some(y => y.i === 1), JSON.stringify(spiel.boxen[1].maPlan));
      const y = document.querySelector('[data-wbloes="1:stall"]'); y && y.click(); ok('✕ bei „niemand“: wieder automatisch', !spiel.boxen[1].maPlan && maZuteilung('stall').some(q => q.i === 1), JSON.stringify(spiel.boxen[1].maPlan)); }
    // Pensionspferd: alle gebuchten Extras stehen da (Pflege, Waschen …), auch wenn sie heute nicht dran sind
    gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 1, zustand: 100 }); spiel.anlage.waschplatz = true;
    const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Wallach', alter: 8, name: 'Pluto' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[2].pferd = P;
    const e = { eid: 'eP', vn: 'Leon', nn: 'Werner', w: false, pid: P.id, stufe: 1, leistungen: { putzen: true, waschen: true, einstreu: true }, haltung: 'box', zufr: 90, seit: jzJetzt() - 8, einzug: spiel.tag - 40, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200, besuchTag: spiel.tag };
    P.einsteller = e.eid; P.putzzeug = 'besitzer'; einstellerListe().push(e);
    zeigeWhiteboard(); const t2 = document.getElementById('nebenSchirm').innerText;
    ok('Pension: Pflege steht da (Besitzer pflegt heute selbst)', /Pflege[\s\S]{0,60}Besitzer/.test(t2), t2.slice(t2.indexOf('Pluto'), t2.indexOf('Pluto') + 300));
    ok('Pension: Waschen steht da (heute nicht nötig)', /Waschen[\s\S]{0,30}nicht nötig/.test(t2), '');
    ok('Pension: bessere Einstreu steht da', /bessere Einstreu|Bessere Einstreu/.test(t2), '');
    // Übersicht „Noch offen“: bei „alle 2 Tage“ je Tag prüfen (Peggy Tag A, Jewel Tag B treffen sich nicht)
    spiel.boxen[2].pferd = null; spiel.einsteller = []; gebaeude().push({ gid: 'pd1', typ: 'sandpaddock', stufe: 1, zustand: 100 }); spiel.anlage.paddock = true;
    const zp = wbZiele().find(x => x.pd); ok('Sandpaddock im Whiteboard', !!zp, JSON.stringify(wbZiele().map(x => x.id)));
    if (zp) { wbModusSetzen(zp.id, 'jeden2'); wbSetzen(A, zp.id, 'a'); wbSetzen(B2, zp.id, 'b');
      const k = [A.id, B2.id].sort().join('|'); (spiel.herdePaare = spiel.herdePaare || {})[k] = { streit: 1, tag: spiel.tag - 1 };
      wbSicht = null; zeigeWhiteboard(); const t3 = document.getElementById('nebenSchirm').innerText;
      ok('verschiedene Tage: kein Streit in „Noch offen“', !/gestritten mit/.test(t3), t3.slice(0, 400));
      wbSetzen(B2, zp.id, 'a'); zeigeWhiteboard(); const t4 = document.getElementById('nebenSchirm').innerText;
      ok('gleicher Tag: Streit steht drin (mit Tag)', /gestritten mit/.test(t4) || !/streit/.test(String(wbBez(A, B2))), String(wbBez(A, B2))); }
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
