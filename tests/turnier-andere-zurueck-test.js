// v998 (Dome 8.11.): Turnier-Fenster zeigt, bei welchen Turnieren schon andere eigene Pferde genannt sind · Anhänger → Turnier: „Schließen“ führt zurück zur Pferdewahl
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1100, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; spiel.admin = true;
    const mk = (n, i) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 0), B = mk('Berta', 1); turnierAlleLK = true;
    let T = null, PR = null; for (let d = 1; d <= 80 && !T; d++) { spiel.tag = d; const k = turnierKalender().filter(t => t.tag > spiel.tag).find(t => t.pruef.some(P => passtGrundsaetzlich(A, P) && passtGrundsaetzlich(B, P))); if (k) { T = k; PR = k.pruef.find(P => passtGrundsaetzlich(A, P) && passtGrundsaetzlich(B, P)); } }
    ok('Ein Turnier für beide Pferde gefunden', !!T);
    if (T) { T.nennung.push({ pid: A.id, prid: PR.id, reiter: 'du' });
      turnierDialog(B, () => {}); const txt = document.getElementById('dlgInhalt').textContent.replace(/\s+/g, ' '); ok('Beim Nennen von Berta steht am Turnier: „auch dabei: Anna“', /auch dabei: Anna/.test(txt), txt.slice(0, 300));
      turnierDialog(A, () => {}); const txtA = document.getElementById('dlgInhalt').textContent.replace(/\s+/g, ' '); ok('Beim Nennen von Anna selbst steht dort kein „auch dabei“ (nur ihre eigene Nennung)', !/auch dabei/.test(txtA) && /1× genannt/.test(txtA), txtA.slice(0, 200));
      T.nennung.push({ pid: B.id, prid: PR.id, reiter: 'du' }); turnierDialog(A, () => {}); ok('Jetzt sieht Anna: „auch dabei: Berta“', /auch dabei: Berta/.test(document.getElementById('dlgInhalt').textContent)); }
    // Anhänger → Turnier → Pferd → Schließen = zurück zur Pferdewahl
    anhTurnier(); ok('Pferdewahl „Welches Pferd soll aufs Turnier?“ da', /Welches Pferd soll aufs Turnier/.test(document.getElementById('dlgInhalt').textContent));
    document.querySelector('[data-tw="0"]').click(); ok('Nach Pferdeauswahl: das Turnierfenster', /Turniere für Anna/.test(document.getElementById('dlgInhalt').textContent));
    const zu = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Schließen/.test(x.textContent)); zu.click();
    ok('Schließen führt zurück zu „Welches Pferd soll aufs Turnier?“', !document.getElementById('dlg').hidden && /Welches Pferd soll aufs Turnier/.test(document.getElementById('dlgInhalt').textContent), document.getElementById('dlgInhalt').textContent.slice(0, 120));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
