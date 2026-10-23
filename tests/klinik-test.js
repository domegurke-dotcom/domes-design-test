// v660: Klinik entlässt erst, wenn die behandelbaren Krankheiten weg sind; Zusatzkosten; Fälliges wird miterledigt; chronische bleiben
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 20000;
    const mk = (name, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; return P; };
    const A = mk('Husti', 0), C = mk('Chron', 1);
    A.pflege.gesundheit = 20; A.pflege.impf = spiel.tag - 3 * tpj(); A.pflege.zahn = spiel.tag; befundNeu(A, 'husten', 2, 'Test'); fahrtStress(A, 'klinik'); A.klinik = { seit: spiel.tag };
    C.pflege.gesundheit = 20; befundNeu(C, 'arthrose', 2, 'Test'); C.klinik = { seit: spiel.tag };
    let n = 0, ent = null; while (n++ < 40 && A.klinik) { naechsteNacht(); }
    ok('Pferd mit Husten bleibt, bis der Husten weg ist', !A.klinik && !befundListe(A).some(x => x.art === 'husten'), 'Tage: ' + n);
    ok('Entlassen mit gesunden Befunden (keine behandelbare Krankheit mehr)', klinikGesund(A));
    const r = (spiel.post || []).find(x => /wieder fit/.test(x.betreff) && /Husti/.test(x.betreff)); ok('Rechnung „wieder fit“ mit Zusatzbehandlung', !!r && /Behandlung der Krankheiten/.test(r.text + JSON.stringify(r.rechnung || r.aktion || '')), r ? r.betreff : 'keine');
    ok('Fällige Impfung wurde miterledigt', A.pflege.impf === spiel.tag || A.pflege.impf >= spiel.tag - 1, 'impf ' + A.pflege.impf + ' tag ' + spiel.tag);
    // chronisch: wird bei genügend Gesundheit entlassen
    n = 0; while (n++ < 40 && C.klinik) naechsteNacht();
    ok('Chronisch krankes Pferd wird trotzdem entlassen (Krankheit bleibt)', !C.klinik && befundListe(C).some(x => x.art === 'arthrose'), 'Tage: ' + n);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
