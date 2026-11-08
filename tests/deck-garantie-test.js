// v959 (Dome 8.11.): Deckgarantie – Nachdecken in der Decksaison beim selben Hengst ohne zweite Decktaxe; ohne Trächtigkeit bis Sommerende Decktaxe zurück
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 1e6; spiel.kal = null; spiel.tag = 1;
    const mk = (name, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); return P; };
    const mkStute = (i, n) => { const s = mk(n, 'Stute'); spiel.boxen[i].pferd = s; return s; };
    const S = mkStute(0, 'Anna'), H = deckhengste(S)[0]; if (!H) { ok('Deckstation-Hengst da', false); return out; }
    const taxe = Math.round(decktaxe(H) / 10) * 10; let g0 = spiel.geld;
    const K1 = deckKern(S, H, 'natur'); ok('1. Decken: Decktaxe + Transport bezahlt', g0 - spiel.geld === taxe + 50, g0 - spiel.geld + ' statt ' + (taxe + 50));
    ok('Garantie wird gemerkt', S.deckGar && S.deckGar.taxe === taxe && S.deckGar.vh === (H.id || H.name), JSON.stringify(S.deckGar));
    S.gedeckt.erfolg = false; delete S.gedeckt; delete S.rosseAb; g0 = spiel.geld;
    ok('Nachdecken beim selben Hengst ist frei', nachdeckFrei(S, H));
    deckKern(S, H, 'natur'); ok('2. Decken: nur Transport (keine zweite Decktaxe)', g0 - spiel.geld === 50, g0 - spiel.geld);
    ok('Garantie bleibt (Taxe nicht doppelt)', S.deckGar.taxe === taxe, S.deckGar.taxe);
    const H2 = deckhengste(S).find(x => (x.id || x.name) !== (H.id || H.name)); if (H2) ok('Anderer Hengst: keine Garantie', !(S.deckGar && S.deckGar.vh === (H2.id || H2.name)) && !nachdeckFrei(S, H2));
    // grüne Umrandung des bezahlten Hengsts (normale Deckstation)
    delete S.gedeckt; delete S.rosseAb; aktBox = 0; spiel.aktBox = 0; zeigeStall(); aktenReiter = 'genetik'; deckModus = true; zeigeAkte();
    ok('Bezahlter Hengst ist grün umrandet (genau einer)', document.querySelectorAll('.paar.garantie').length === 1, document.querySelectorAll('.paar.garantie').length); deckModus = false;
    // Saisonende: ungewiss (nicht untersucht) → keine Erstattung; erst bei sicherem Wissen
    S.gedeckt = { vater: H, art: 'natur', tag: spiel.tag, seit: jzJetzt(), erfolg: false }; spiel.tag = 1; while (!(datum().s === 2 && datum().t === 1)) spiel.tag++; g0 = spiel.geld; const nb = (spiel.post || []).length; deckGarantieTag();
    ok('Sommerende, aber ungewiss (keine Untersuchung, keine Rosse): keine Erstattung', spiel.geld === g0 && S.deckGar, spiel.geld - g0);
    delete S.gedeckt; deckGarantieTag();
    ok('Sobald sicher nicht tragend (Nachweis/Rosse): Decktaxe erstattet', spiel.geld - g0 === taxe, spiel.geld - g0); ok('Brief der Deckstation', (spiel.post || []).length === nb + 1 && /erstattet/.test(spiel.post[0].betreff), spiel.post[0] && spiel.post[0].betreff);
    ok('Garantie danach weg', !S.deckGar); const g1 = spiel.geld; deckGarantieTag(); ok('Nicht doppelt erstattet', spiel.geld === g1);
    // tragend: keine Rückzahlung
    spiel.tag = 1; const T = mkStute(1, 'Berta'); deckKern(T, H, 'natur'); T.gedeckt.erfolg = true; T.traechtig = { vater: H, seit: jzJetzt(), geburt: jzJetzt() + 4, art: 'natur', sicher: true }; delete T.gedeckt; while (!(datum().s === 2 && datum().t === 1)) spiel.tag++; g0 = spiel.geld; deckGarantieTag();
    ok('Tragend: keine Rückzahlung', spiel.geld === g0 && !T.deckGar, spiel.geld - g0);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
