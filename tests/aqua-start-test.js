// v992 (Dome 8.11.): Aqua-Plan – je Pferd festlegen, ab wann „alle 2 Tage“ beginnt (Auswahl „Beginn“), gilt auch am Morgen
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; VET.verbotAb = 99; Math.random = () => 0.99; spiel.tag = 10;
    ['Anna', 'Berta'].forEach((n, i) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; P.aquaWunsch = { modus: '2' }; spiel.boxen[i].pferd = P; });
    const x0 = bewerber('physio')[0]; spiel.mitarbeiter = [{ id: 'ph1', typ: 'physio', name: 'Petra', w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }]; gebaeude().push({ gid: 'gaq', typ: 'aqua', stufe: 2, zustand: 100 });
    const [A, B] = [0, 1].map(i => spiel.boxen[i].pferd); aquaPlanFenster();
    const sl = [...document.querySelectorAll('[data-aqstart]')]; ok('Je Pferd eine Auswahl „Beginn“ (eigene Pferde, Rhythmus alle 2 Tage)', sl.length === 2, String(sl.length));
    ok('Ohne Wahl: beide dran („sobald möglich“)', aquaPlan(true).V.length === 2);
    const sA = document.querySelector('[data-aqstart="0"]'); sA.value = '2'; sA.dispatchEvent(new Event('change', { bubbles: true }));
    ok('Anna: Beginn „in 2 Tagen“ gespeichert', A.aquaWunsch.start === spiel.tag + 2, JSON.stringify(A.aquaWunsch));
    ok('Anna ist heute nicht mehr im Plan, Berta schon', aquaPlan(true).V.length === 1 && aquaPlan(true).V[0].x.p === B);
    const gr = [...document.querySelectorAll('.aq-zeile.aus')].map(e => e.textContent.replace(/\s+/g, ' ')); ok('Anna steht ausgegraut mit „Beginn in 2 Tagen“', gr.length === 1 && /Anna/.test(gr[0]) && /Beginn in 2 Tagen/.test(gr[0]), gr.join('|'));
    ok('Die Auswahl zeigt „in 2 Tagen“', document.querySelector('[data-aqstart="0"]').value === '2');
    // Tageswechsel: Berta wird morgens gefahren, Anna noch nicht
    const t0 = spiel.tag; naechsteNacht(); ok('Morgen: Berta war im Wasser, Anna noch nicht', aquaLetzt(B) >= t0 && aquaLetzt(A) < t0, JSON.stringify([A.aquaLog, B.aquaLog]));
    spiel.tag += 1; ok('Zwei Tage später: Anna ist dran (Beginn erreicht)', aquaPlan(true).V.some(v => v.x.p === A), String(spiel.tag) + ' start ' + A.aquaWunsch.start);
    const s2 = document.querySelector('[data-aqstart="0"]'); if (s2) { s2.value = '0'; s2.dispatchEvent(new Event('change', { bubbles: true })); } aquaPlanFenster(); const s3 = document.querySelector('[data-aqstart="0"]'); s3.value = '0'; s3.dispatchEvent(new Event('change', { bubbles: true })); ok('„sobald möglich“ löscht den Beginn', A.aquaWunsch.start === undefined, JSON.stringify(A.aquaWunsch));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
