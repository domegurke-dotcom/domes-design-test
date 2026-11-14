// v1035 (Dome 14.11.2026): Azubi-Modus über 3 Spieljahre – der Ausbildungsbetrieb kauft Futter, Einstreu und Lecksteine selbst,
// der Azubi versorgt jeden Tag alle Pferde (Füttern aus der Futterkammer, Misten, Wasser). Kein Pferd darf hungern, keine „nachkaufen“-Briefe an den Azubi,
// Zwischen- und Abschlussprüfung kommen, danach ist die Ausbildung fertig.
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'Mia'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Lehrhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x)); const zu = () => { document.getElementById('dlg').hidden = true; };
    zu(); speicherSperre = true; spiel.tippsAus = true; azubiStarten(); zu();
    const P = () => spiel.boxen.filter(x => x.pferd && !x.tot); ok('4 Betriebspferde', P().length === 4, P().length);
    let nichtGefuettert = 0, tage = 0, zp = false, ap = false; const geld0 = spiel.geld, behLog = {}, unbehandelt = [];
    /* krank → wie ein echter Azubi: Tierarzt rufen (Diagnose, Plan, Rezept – der Betrieb zahlt), dann jeden Tag nach Plan behandeln;
       Rezept leer → Tierarzt erneut; freies Mittel leer → in der Stallapotheke kaufen */
    const behandle = (x) => { const p = x.pferd, bef = befundListe(p).filter(y => y.bemerkt && !imInkub(y)); if (!bef.length) return;
      if (bef.some(y => !y.tierarzt && !y.diagnose) && p.tierarztTag !== spiel.tag) { tierarztBesuch(p, x); zu(); }
      const V = planVorlage(p); if (!V) { behLog['kein Plan: ' + bef.map(y => y.art).join(',')] = (behLog['kein Plan: ' + bef.map(y => y.art).join(',')] || 0) + 1; return; }
      V.akt.forEach(a => { const nochmal = () => { const r = behandeln(p, a.k, a.stufe, 'du'); zu(); return String(r || '').replace(/<[^>]+>/g, ''); };
        let r = nochmal();
        if (/kein Rezept/.test(r) && p.tierarztTag !== spiel.tag) { tierarztBesuch(p, x); zu(); r = nochmal(); }
        if (/Stallapotheke/.test(r)) { const m = (AKTION[a.k] || {}).mittel || a.k; if (APO[m]) { buchen(-APO[m].preis, 'Stallapotheke'); apotheke()[m] = (apotheke()[m] || 0) + 1; r = nochmal(); } }
        const kurz = a.k + ': ' + r.replace(p.name, 'X').slice(0, 60); behLog[kurz] = (behLog[kurz] || 0) + 1; }); };
    for (let d = 0; d < 7 * 4 * 3 + 7 * 2 && !spiel.azubi.fertig; d++) {
      if (d === 5) [['lahmheit', 3], ['husten', 3], ['arthrose', 3], ['mauke', 3]].forEach(([k, g], i) => { const x = P()[i]; if (x) befundNeu(x.pferd, k, g, 'Testfall', 'du'); });   /* gezielt krank machen: Behandlung muss klappen */
      P().forEach((x) => { if (x.pferd.klinik) return; if (!fuetternAusLager(x, 'du')) nichtGefuettert++; else x.krippeVoll = true; x.mistig = false; x.mistStufe = 0; x.wasserTag = spiel.tag; if (d % 7 === 0) x.pferd.dreck = { fell: 0, maehne: 0, seit: null }; behandle(x); });   /* einmal pro Woche gründlich geputzt */
      naechsteNacht(); zu(); tage++;
      P().forEach(x => { if (!x.pferd.klinik && befundListe(x.pferd).some(y => y.bemerkt && !imInkub(y) && y.grad >= 3) && !vetInBehandlung(x.pferd)) unbehandelt.push(spiel.tag + ' ' + x.pferd.name + ' ' + befundListe(x.pferd).map(y => y.art + 'G' + y.grad).join(',')); });
      for (const br of spiel.post) { const A = br.aktion; if (!A || A.typ !== 'azubiPruef' || A.antwort) continue;
        if (A.art === 'zp') zp = true; else ap = true;
        azubiPruefung(A.art, br, null); document.querySelectorAll('[data-azi="0"]').forEach(r => { r.checked = true; r.onchange(); }); document.querySelector('#dlgKnoepfe button').click(); zu(); }
    }
    const nachkaufen = spiel.post.filter(x => /Futterkammer/.test(x.betreff)).map(x => x.betreff);
    ok('Futter hat immer gereicht (jeden Tag alle gefüttert)', nichtGefuettert === 0, nichtGefuettert + ' mal kein Futter');
    ok('Keine „nachkaufen“-Briefe an den Azubi', !nachkaufen.length, nachkaufen.join(', '));
    ok('Alle 4 Pferde leben und sind bei dir', P().length === 4 && P().every(x => !x.pferd.beschlagnahmt), P().map(x => x.pferd.name).join(', '));
    const VF = (spiel.veterinaer || {}).vorfaelle || [];
    out.push('  Info: Behandlungen: ' + Object.entries(behLog).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => v + '× ' + k).join(' | '));
    out.push('  Info: Befunde am Ende: ' + P().map(x => x.pferd.name + ' ' + befundListe(x.pferd).filter(y => y.bemerkt).map(y => y.art + ' G' + y.grad + (y.diagnose ? ' (Diagnose)' : '')).join(',')).join(' · '));
    ok('Kranke Pferde waren jede Nacht in Behandlung', !unbehandelt.length, unbehandelt.length + ': ' + unbehandelt.slice(0, 6).join(' | '));
    ok('Kein Vorfall beim Veterinäramt', !VF.length, JSON.stringify(VF));
    ok('Hufschmied kam vom Betrieb (keine überfälligen Hufe)', P().every(x => !hufUeberfaellig(x.pferd)) && !spiel.post.some(x => x.von === 'Hufschmied' && /Huftermin/.test(x.betreff)), P().map(x => x.pferd.name + ' ' + (spiel.tag - x.pferd.pflege.huf)).join(', '));
    ok('Praxis im Stall gut (≥ 90 %)', spiel.azubi.tage && spiel.azubi.gut / spiel.azubi.tage >= 0.9, Math.round(spiel.azubi.gut / spiel.azubi.tage * 100) + ' %');
    ok('Zwischenprüfung kam', zp && !!spiel.azubi.zp, JSON.stringify(spiel.azubi.zp));
    ok('Abschlussprüfung bestanden, Ausbildung fertig', ap && spiel.azubi.fertig && spiel.azubi.ap && spiel.azubi.ap.pkt >= 50, JSON.stringify(spiel.azubi.ap) + ' nach ' + tage + ' Tagen');
    const fremdBriefe = spiel.post.filter(x => /Hofkredit|willkommen als|Anfrage: Pensionsplatz|Förderung|Schonfrist|Bereit für mehr|Jahresbericht|Keine Einstreu|Futterkammer|Rechnung|Mahnung|Abbuchung|verdorben|repariert werden/.test(x.betreff) || x.von === KREDIT.bank && !/Rate/.test(x.betreff)).map(x => x.von + ': ' + x.betreff);
    ok('Keine Hofbesitzer-Briefe an den Azubi', !fremdBriefe.length, fremdBriefe.join(' | '));
    ok('Kein Start-/Geld-Tipp für den Azubi', !(spiel.tipps || {}).start && !(spiel.tipps || {}).geldKnapp, JSON.stringify(spiel.tipps));
    out.push('  Info: Absender im Postfach: ' + [...new Set(spiel.post.map(x => x.von + ' – ' + x.betreff.replace(/ für .*| von .*/, '')))].join(' · '));
    ok('Sparkonto mit Prämie', spiel.azubi.konto > 5000, spiel.azubi.konto);
    out.push('  Info: Kasse Betrieb ' + Math.round(geld0) + ' → ' + Math.round(spiel.geld) + ' €, Lager ' + JSON.stringify(Object.fromEntries(Object.entries(futterkammer().lager).filter(([, v]) => v > 0).map(([k, v]) => [k, Math.round(v)]))));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
