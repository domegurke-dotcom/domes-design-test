// v999 (Dome 8.11., Aufnahme 23/24): der feste Futterexperte kontrolliert das Gewicht und stellt seinen Plan nach (p.expertKorr) – dünne Pferde nehmen zu, dicke ab, auch mit ungünstiger Futterverwertung
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = true; spiel.geld = 1e7;
    const F = futterkammer(); Object.keys(FUTTER).forEach(k => { F.lager[k] = 5000; });
    const x0 = bewerber('futterexperte')[0]; spiel.mitarbeiter = [{ id: 'fe1', typ: 'futterexperte', name: 'Katharina', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 4, bis: null }];
    const fall = (rasse, fz, stoffw, i) => { const P = neuesPferd({ rasse, geschlecht: 'Stute', alter: 8, name: rasse + fz }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.werte.charakter = P.werte.charakter || {}; P.werte.charakter.temperament = 95;
      const box = spiel.boxen[i]; box.pferd = P; P.fz = fz; P.typFest = false; P.pflege.zahn = spiel.tag; P.stoffw = stoffw; P.arbeitSchnitt = 0; spiel.ersteBeratung = true; futterBeratung([P], true, '', true); P.umstellung = null; return { P, box }; };
    const lauf = (f, tage) => { const { P, box } = f; for (let d = 0; d < tage; d++) { spiel.tag++; P.pflege.zahn = spiel.tag; P.futterHeute = { tag: spiel.tag - 1, genutzt: { ...futterplanVon(P, box).kg } }; box.krippeVoll = true; futterNacht(P, box, 'box', false); P.pflege.gesundheit = 100; futterexperteTagCheck(); if (P.umstellung) P.umstellung = null; } return P.fz; };
    const dunn = fall('quarter', 3, 0.85, 0), dick = fall('hannoveraner', 9, 1.08, 1);
    const d0 = dunn.P.fz; lauf(dunn, 40); lauf(dick, 40);
    ok('Dünnes Pferd mit ungünstiger Futterverwertung nimmt zu', dunn.P.fz > d0, `fz ${d0} → ${dunn.P.fz}, Korrektur ${dunn.P.expertKorr}`);
    ok('Dickes Pferd: Plan sinkt bis ans Raufutter-Minimum (Verhältnis unter 0,98), Stroh-Anteil bleibt ≤ ⅓', dick.P.futterStatus.ratio <= 0.98 && !dick.P.futterStatus.strohViel, `Verhältnis ${dick.P.futterStatus.ratio}, ${JSON.stringify(dick.P.futterplan.kg)}`);
    ok('Korrektur beim dicken Pferd gesenkt', (dick.P.expertKorr || 1) < 1, `${dunn.P.expertKorr} / ${dick.P.expertKorr}`);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
