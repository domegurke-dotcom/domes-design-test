// v956 (Dome 8.11.): Pferdeanhänger (Hauptmenü) → Deckstation: mehrere Stuten, je Stute Hengst und Art, Transport 50 € je Stute
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x)); const zu = () => { document.getElementById('dlg').hidden = true; };
    zu(); spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 20000; spiel.kal = null; spiel.tag = 1;
    const mk = (n, g, i) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: g, alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; spiel.boxen[i].pferd = P; return P; };
    const A = mk('Anna', 'Stute', 0), B2 = mk('Berta', 'Stute', 1), C = mk('Carlo', 'Wallach', 2), W = mk('Winni', 'Stute', 3); W.traechtig = { seit: 0, geburt: 99, vater: { name: 'X' } };
    ok('Ziel in der Anhänger-Liste', ANHAENGER.start.includes('deckstation') && !!ANH_ZIEL.deckstation);
    zeigeSchirm(null); zeigeAnhaenger(); const k = document.querySelector('[data-anhziel="deckstation"]'); ok('Kachel „Deckstation“ im Hauptmenü-Anhänger', !!k, ''); if (!k) return out;
    ok('Zählt nur Stuten, die decken dürfen (Anna, Berta)', anhKandidaten('deckstation').map(x => x.p.name).sort().join() === 'Anna,Berta', anhKandidaten('deckstation').map(x => x.p.name).join());
    k.click(); ok('Auswahlseite öffnet', anhZiel === 'deckstation');
    anhAuswahl = new Set(anhKandidaten('deckstation').map(x => x.key)); zeigeAnhaenger(); const los = $('anhLos'); ok('Knopf „zur Deckstation bringen“', !!los && /zur Deckstation/.test(los.textContent), los && los.textContent);
    los.click(); ok('Dialog: je Stute Hengst-Kacheln (wie normale Deckstation) und Art', document.querySelectorAll('#dlg .paar-liste .paar[data-dsh^="0:"]').length === 5 && document.querySelectorAll('#dlg .paar-liste .paar[data-dsh^="1:"]').length === 5 && !!document.querySelector('[data-dsa="0"]') && !!document.querySelector('[data-dsa="1"]'), '');
    ok('Kein Auswahllisten-Feld mehr', !document.querySelector('#dlg select'));
    ok('Kachel zeigt Bild, Name, Rasse, Alter · Decktaxe', !!document.querySelector('#dlg .paar .paar-bild svg') && /Jahre · /.test(document.querySelector('#dlg .paar .paar-brett').textContent), document.querySelector('#dlg .paar .paar-brett').textContent);
    ok('Chancen je Art stehen da', /\d+ %/.test(document.querySelector('[data-dsc="0:natur"]').textContent), document.querySelector('[data-dsc="0:natur"]').textContent);
    { const z0 = $('dsKosten').textContent; const c2 = document.querySelectorAll('#dlg .paar[data-dsh^="0:"]'); const tx = x => +((x.querySelector('.paar-brett span:last-child').textContent.match(/([d.]+) €/) || [])[1] || 0); c2[c2.length - 1].click(); ok('Anderen Hengst antippen: markiert und Kosten ändern sich', c2[c2.length - 1].parentNode.classList.contains('markiert') && !c2[0].parentNode.classList.contains('markiert') && $('dsKosten').textContent !== z0, z0 + ' → ' + $('dsKosten').textContent); c2[0].click(); }
    window.__dlgHtml = 1;
    ok('Kosten werden gezeigt', /Zusammen/.test($('dsKosten').textContent), $('dsKosten').textContent);
    const g0 = spiel.geld; [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Losfahren/.test(x.textContent)).click();
    ok('Beide Stuten sind gedeckt', !!A.gedeckt && !!B2.gedeckt, JSON.stringify([!!A.gedeckt, !!B2.gedeckt]));
    ok('Wallach und tragende Stute unberührt', !C.gedeckt && !W.gedeckt);
    ok('Geld abgebucht (mind. 2 × 50 € Transport bei Natursprung)', g0 - spiel.geld >= 100, g0 - spiel.geld);
    const pt = ((document.querySelector('.anh-panel') || {}).textContent || ''); ok('Meldung nennt beide Stuten', /Gedeckt/.test(pt) && /Anna/.test(pt) && /Berta/.test(pt), pt.slice(0, 200));
    // Einzelablauf unverändert (Refactor)
    // Decksaison wie bei der normalen Deckstation: ab Herbst keine Hengste
    spiel.kal = null; spiel.tag = 1 + 2 * tpj(); ok('Herbst: Stuten nicht wählbar (Decksaison)', datum().s === 2 && anhKandidaten('deckstation').length === 0, datum().s + ' / ' + anhKandidaten('deckstation').length); spiel.tag = 1;
    const D = deckhengste(W)[0]; const h = deckhengste(spiel.boxen[0].pferd)[0]; A.gedeckt = null; delete A.rosseAb; const g1 = spiel.geld; verpaaren(A, h); const nb = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Natursprung/.test(x.textContent)); if (nb) nb.click(); ok('Einzelablauf: Stute wird gedeckt', !!A.gedeckt && g1 - spiel.geld >= 50, g1 - spiel.geld);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
