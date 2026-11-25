// 25.11.2026 – Auftrag 33 (Dome 24.11.): Begriffe mit Info-Knopf (rundes i): Senioren-Check, ACTH-Test, Nachsorgeplan, Biestmilch, IgG-Test, Plasma, Blutvergiftung, Salmonellen.
// Prüft mit echten Klicks: i antippen klappt die Erklärung auf, nochmal antippen zu. Termin-Fenster zeigen den Kalender (Auftrag 30).
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/begriff-info-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 50000;
      const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 18, name: 'Oma' }); P.pflege = erzeugePflege(P); werteErgaenzen(P); spiel.boxen[0].pferd = P; spiel.boxen[0].tot = false; });
    /* Senioren-Check-Fenster */
    await pg.evaluate(() => seniorCheckDialog(spiel.boxen[0].pferd)); await pg.waitForTimeout(300);
    const t0 = await pg.evaluate(() => [...document.querySelectorAll('#dlgInhalt [data-begriff]')].map(x => x.dataset.begriff));
    ok('Senioren-Check: Info-Knöpfe ' + t0.join(','), t0.includes('senior') && t0.includes('acth'), t0.join(','));
    ok('Senioren-Check zeigt den Kalender (7 Tage)', await pg.evaluate(() => document.querySelectorAll('#dlgInhalt .tk-tag').length === 7));
    const zu = await pg.evaluate(() => document.querySelector('#dlgInhalt .begriff-txt').hidden);
    await pg.click('#dlgInhalt [data-begriff="senior"]'); await pg.waitForTimeout(200); await bild('B1-senior-offen');
    const auf = await pg.evaluate(() => { const s = document.querySelector('#dlgInhalt [data-begriff="senior"]').nextElementSibling; return !s.hidden && s.textContent; });
    ok('Klick auf i klappt die Erklärung auf', zu && !!auf && /Vorsorge-Untersuchung/.test(auf), String(auf));
    ok('Fenster bleibt offen', await pg.evaluate(() => !document.getElementById('dlg').hidden));
    await pg.click('#dlgInhalt [data-begriff="senior"]'); await pg.waitForTimeout(200);
    ok('zweiter Klick klappt sie wieder zu', await pg.evaluate(() => document.querySelector('#dlgInhalt [data-begriff="senior"]').nextElementSibling.hidden));
    /* Biestmilch-Brief: Texte mit Biestmilch, IgG, Plasma */
    const h = await pg.evaluate(() => { const html = `x ${begriffI('biest')} ${begriffI('igg')} ${begriffI('plasma')} ${begriffI('sepsis')} ${begriffI('nachsorge')}`; return (html.match(/data-begriff/g) || []).length; });
    ok('Begriffe Biestmilch, IgG, Plasma, Blutvergiftung, Nachsorgeplan haben Texte', h === 5, String(h));
    ok('Salmonellen-Rat beginnt mit Info-Knopf', await pg.evaluate(() => /data-begriff="salmonellen"/.test(KRANK.salmonellen.rat)));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
