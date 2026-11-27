// Auftrag 27 (27.11.2026): Offenstall-Gruppen – Knopf „Fohlen-ABC: alle nacheinander“, Gruppen-Wirkung ×1,2 (Tante/Onkel/fertiges Fohlen, höchstens einmal), kein Bonus in der Einzelbox
// Start: $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/offenstall-gruppen-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(async () => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x != null && !c ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false;
    const Hf = spiel.hof; Hf.art = 'zucht'; spiel.stallarten = ['zucht']; delete Hf.artCache; spiel.geld = 300000; Hf.bauHa = (Hf.bauHa || 0) + 3;
    const mkP = (name, g, jahre) => { const p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: g, alter: Math.max(1, Math.ceil(jahre)), name }); p.geb = gebGenau(jahre); p.pflege = erzeugePflege(p); werteErgaenzen(p); return p; };
    bauStarten('aufzucht', 1); planAutoSetzen(); const g = gebaeude().find(x => x.typ === 'aufzucht'); g.bau.rest = 0; bauFertig(g, 'neu'); delete g.bau; spiel.hofFenster = []; document.getElementById('dlg').hidden = true;
    const setze = p => { const z = offenPlatz(p); spiel.boxen[z].pferd = p; return spiel.boxen[z]; };
    const A = mkP('Anna', 'Stute', 0.6), Bb = mkP('Bella', 'Stute', 0.6), C = mkP('Cora', 'Stute', 0.6);
    [A, Bb, C].forEach(setze);
    // ohne Tante: Zuwachs wie heute
    const x0 = 7 / tpj(); fohlenABC(A); const dA = A.fohlenABC; ok('ohne Tante: Zuwachs wie heute', Math.abs(dA - Math.round(x0 * 100) / 100) < 0.011, dA + ' / ' + x0);
    // mit Tante: ×1,2
    const T = mkP('Tante', 'Stute', 10); setze(T); const m1 = fohlenABC(Bb); ok('mit Tante: ×1,2', Math.abs(Bb.fohlenABC - Math.round(x0 * 1.2 * 100) / 100) < 0.011, Bb.fohlenABC); ok('Meldung nennt die Tante', /Tante Tante/.test(m1), m1);
    // Tante und fertiges Fohlen zusammen: weiterhin nur ×1,2
    const F = mkP('Fertig', 'Stute', 0.7); F.fohlenABC = FOHLEN_ABC_MAX; setze(F); fohlenABC(C); ok('Tante + fertiges Fohlen: höchstens ×1,2', Math.abs(C.fohlenABC - Math.round(x0 * 1.2 * 100) / 100) < 0.011, C.fohlenABC);
    // Knopf für alle nacheinander
    [A, Bb, C].forEach(q => { delete q.abcTag; q.fohlenABC = 0; });
    const box = setze(A); aktBox = spiel.boxen.indexOf(box); spiel.aktBox = aktBox; zeigeStall(); zeigeTag(); zeigeAkte();
    const txt = x => x.replace(/<[^>]+>/g, ''), mN = txt(offenGruppeHTML(A, box)).match(new RegExp('nacheinander 0/(' + String.fromCharCode(92) + 'd+)')); const N = mN ? +mN[1] : 0; ok('Knopf mit Zähler 0/N (N ≥ 3, Fertig-Fohlen zählt nicht)', N >= 3, txt(offenGruppeHTML(A, box)).slice(0, 200));
    offenGruppeVersorgen('abc'); ok('alle drei geübt', [A, Bb, C].every(q => q.abcTag === spiel.tag && q.fohlenABC > 0), [A, Bb, C].map(q => q.fohlenABC).join());
    ok('Fertiges Fohlen nicht erneut geübt', F.abcTag !== spiel.tag);
    const dlg = document.getElementById('dlg'); ok('Sammelmeldung mit allen Namen', !dlg.hidden && ['Anna', 'Bella', 'Cora'].every(n => dlg.textContent.includes(n)), dlg.textContent.slice(0, 200));
    ok('Zähler danach N/N', txt(offenGruppeHTML(A, box)).includes('nacheinander ' + N + '/' + N), txt(offenGruppeHTML(A, box)).slice(0, 200));
    // Einzelbox: kein Bonus
    const E = mkP('Einzel', 'Stute', 0.6); E.fohlenABC = 0; const zb = spiel.boxen.findIndex(x => !x.offen && !x.pferd); if (zb >= 0) { spiel.boxen[zb].pferd = E; fohlenABC(E); ok('Einzelbox: kein Bonus', Math.abs(E.fohlenABC - Math.round(x0 * 100) / 100) < 0.011, E.fohlenABC); }
    return out; });
  R.forEach(x => console.log(x)); const rot = R.filter(x => x.startsWith('✗')).length;
  console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(' | ') : '✓ keine Seitenfehler'); console.log(rot ? `${rot} ✗` : 'alles ✓'); await b.close(); })();
