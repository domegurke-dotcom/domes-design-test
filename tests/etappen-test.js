// Etappen-Test: spielt Domes Test-Anleitungen für Fütterung F1–F5, Hof-Ausbau H1–H3 und H5 per Skript nach.
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/etappen-test.js
// Erwartet: jede Zeile „✓“, am Ende „Fehler []“ und „alles ok“.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ergebnisse = [], errs = [];
  for (const [w, h, ansicht] of [[1366, 768, 'PC'], [844, 390, 'Handy quer'], [390, 844, 'Handy hochkant']]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    pg.on('pageerror', e => errs.push(ansicht + ': ' + e.message));
    await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
    // H1: Neues Spiel → Charakter → Immobilien-Menü → Kreditbrief → Alter Pensionsstall kaufen
    await pg.click('#smNeu'); await pg.fill('#chName', 'Test'); await pg.click('#chLos');
    await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child');
    await pg.waitForTimeout(300);
    const r = await pg.evaluate((ansicht) => {
      const L = [], ok = (name, bed, info = '') => L.push([bed ? '✓' : '✗', ansicht, name, info]);
      const nacht = n => { for (let i = 0; i < n; i++) { spiel.boxen.forEach(bx => { const q = bx.pferd; if (!q || bx.tot || q.klinik) return; fuetternAusLager(bx, 'du'); bx.krippeVoll = true; bx.mistig = false; bx.mistStufe = 0;   // auch Weide-Heu
          q.befunde = []; if (q.pflege) q.pflege.gesundheit = Math.max(q.pflege.gesundheit, 80); }); naechsteNacht(); } };   // Tierarzt kümmert sich – hier geht es um die Abläufe
      const zu = () => { $('dlg').hidden = true; };
      const ansehen = (name, f) => { try { f(); ok(name + ' öffnet ohne Fehler', true); } catch (e) { ok(name + ' öffnet ohne Fehler', false, e.message); } zu(); };

      // ---------- H1 ----------
      const k = kredite()[0];
      ok('H1 Hof gekauft (Alter Pensionsstall)', spiel.hof && spiel.hof.name === 'Testhof', spiel.hof && spiel.hof.art);
      ok('H1 Startkapital 15.000 − 10.000 Eigenanteil = 5.000 €', Math.round(spiel.geld) === 5000, Math.round(spiel.geld) + ' €');
      ok('H1 Kredit 10.000 € über 10 Jahre (40 Raten)', k && k.summe === 10000 && KREDIT.jz === 40, k && `${k.summe} € / ${KREDIT.jz} Raten`);
      ansehen('H1 hvw – Finanzen – Bank', () => { $('info') && bankHTML(); });

      // Pferd kaufen (für Fütterung) – wie beim Händler
      const h0 = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 7, name: 'Hanni' }); h0.preis = 2000; pferdEinstellen(h0, 2000, 'Händler'); zu();
      const box = spiel.boxen.find(x => x.pferd && x.pferd.id === h0.id), p = box.pferd; werteErgaenzen(p);
      ok('Pferd eingestellt', !!box, box ? 'Box ' + (spiel.boxen.indexOf(box) + 1) : '');
      if (box && box.quar) { /* Neuzugang im Quarantänestall – egal für die Fütterung */ }

      // ---------- F1 Futterkammer ----------
      const F = futterkammer();
      ok('F1 Startvorrat Heu + Mineral + Leckstein', F.lager.heu > 0 && F.lager.mineral > 0 && F.lager.leckstein >= 1, `Heu ${F.lager.heu} kg, Mineral ${F.lager.mineral} kg`);
      ok('F1 Futterkammer fasst 2.000 kg', F.lagerMax === 2000, F.lagerMax + ' kg');
      const heuVor = F.lager.heu, geldVor = spiel.geld;
      ok('F1 Heu kaufen (100 kg)', futterKaufen('heu', 100) === '' && spiel.geld < geldVor, `${Math.round((geldVor - spiel.geld) * 100) / 100} €`);
      ok('F1 Lieferung erst am nächsten Tag', F.lager.heu === heuVor);
      fuetternAusLager(box, 'du'); box.krippeVoll = true;
      const heuNachFuettern = F.lager.heu;
      ok('F1 Füttern nimmt Heu aus dem Lager', heuNachFuettern < heuVor, `${heuVor} → ${heuNachFuettern} kg`);
      naechsteNacht();
      ok('F1 Lieferung ist am Morgen da', F.lager.heu >= heuNachFuettern + 90, `${F.lager.heu} kg`);
      ok('F1 Zu viel bestellen geht nicht (Platz)', futterKaufen('heu', 5000) !== '');
      ansehen('F1 hvw – Hof – Futterkammer', () => futterkammerHTML(''));
      { const merk = { ...F.lager }; RAUFUTTER_REIHE.forEach(x => F.lager[x] = 0); const voll = fuetternAusLager(box, 'du');
        ok('F1 Leeres Heu: Krippe bleibt leer, Hinweis statt Brief', voll === false); Object.assign(F.lager, merk); }

      // ---------- F2 Futterplan ----------
      const B = futterBedarf(p, box), W = planWerte(p, box), C = bedarfCheck(W);
      ok('F2 Bedarf berechnet (Energie MJ)', B.energie > 30 && B.energie < 150, B.energie + ' MJ');
      ok('F2 Standardplan deckt Energie/Raufutter', C[0][2] === 'passt' && C[2][2] === 'passt', C.map(c => c[0] + ' ' + c[2]).join(', '));
      ansehen('F2 Futterplan-Fenster (Box – ppf – vsg)', () => futterplanDialog(p, box, zu));

      // ---------- F3 Futterzustand ----------
      { const fz0 = futterZustand(p); p.futterplan = { mahl: 3, kg: { heu: 14, hafer: 3, mineral: 0.1 } }; F.lager.hafer = 200; F.lager.heu = Math.max(F.lager.heu, 600);
        nacht(fzSchwelle() + 1);
        ok('F3 Überfüttern → Futterzustand steigt', futterZustand(p) > fz0, `${fz0} → ${futterZustand(p)} (${FZ_NAME[futterZustand(p)] || ''})`);
        p.fz = 5; p.fzTage = 0; delete p.futterplan; delete p.umstellung; }

      // ---------- F4 Leckerli, Staub, Umstellung ----------
      F.lager.moehren = 2; const v0 = p.werte.ist.vertrauen || 0;
      const t1 = leckerliGeben(p, 'moehren');
      ok('F4 Leckerli geben (Vertrauen +0,3)', t1 && (p.werte.ist.vertrauen - v0) > 0.29, t1);
      planAendernStart(p, box); p.futterplan = { mahl: 2, kg: { heu: 4, mineral: 0.1 } }; planAendernEnde(p, box);
      ok('F4 Futterumstellung über 3 Tage', !!p.umstellung && umstellungTag(p) === 1);
      delete p.umstellung; delete p.futterplan;

      // ---------- F5 Futterexperte ----------
      { const geld = spiel.geld; spiel.futterTermin = { tag: spiel.tag + 1, pferde: [p.id] }; nacht(1);
        const rech = (spiel.post || []).find(x => /Futterberatung/.test(x.von || x.absender || '') || /Futterberatung|Futterexpert/.test(x.betreff || ''));
        ok('F5 Futterexperte kommt am nächsten Morgen', !spiel.futterTermin && !!rech, rech ? rech.betreff : 'kein Brief');
        ok('F5 Spezialfutter-Katalog', Object.keys(SPEZIAL).length >= 6, Object.keys(SPEZIAL).join(', ')); }

      // ---------- H2 mehrere Höfe ----------
      buchen(200000, 'Testgeld'); buchen(-100000, 'Überweisung an das zentrale Konto'); zentralBuchen(100000, 'von Testhof');   // Eigenanteil kommt vom zentralen Konto
      { const A0 = maklerAngebote().find(a => a.boxen); ok('H2 Zweiter Hof erst, wenn der erste Kredit zur Hälfte getilgt ist', A0 && /Kredit zur Hälfte/.test(immoSperre2(A0)), A0 && immoSperre2(A0)); }
      { const st = Math.ceil(k.rest - k.summe / 2 + 10); buchen(-st, 'Kredit: Sondertilgung'); k.rest = runde2(k.rest - st); k.getilgt = runde2(k.getilgt + st); }   // Sondertilgung wie in hvw – Finanzen – Bank
      const A = maklerAngebote().find(a => a.boxen && !immoSperre2(a));
      ok('H2 Makler hat ein kaufbares Angebot', !!A, A ? A.name || A.art : '');
      if (A) { neuerHof(A, 'Zweithof'); zu();
        ok('H2 Zweiter Hof gekauft', hofAnzahl() === 2, hofReihe().map(h => hofNameVon(h)).join(' | '));
        hofWechseln(hofReihe()[1]); ok('H2 Hof wechseln', hofName() === 'Zweithof'); hofWechseln(hofReihe()[0]); ok('H2 zurück zum ersten Hof', hofName() === 'Testhof'); }
      ansehen('H2 Immobilien – Makler', () => maklerHTML());

      // ---------- H3 Bauen ----------
      { const n0 = spiel.boxen.length, ok1 = bauStarten('stall', 2, { anbau: gebaeude()[0].gid, boxen: 2 }); zu();
        ok('H3 Bauauftrag Stall (2 Boxen)', ok1 === true);
        const g = gebaeude().find(x => x.bau); const rest = g ? g.bau.rest : 0;
        nacht(rest + (datum().s === 3 ? tpj() : 0) + 1);
        ok('H3 Bau fertig → neue Boxen', spiel.boxen.length === n0 + 2, `${n0} → ${spiel.boxen.length} Boxen`);
        const g0 = gebaeude()[0], z0 = g0.zustand; gebaeudeJahreszeit();
        ok('H3 Verfall und Unterhalt je Jahreszeit', g0.zustand < z0, `Zustand ${z0} → ${g0.zustand}`); }
      ansehen('H3 hvw – Hof – Bauen', () => bauenHTML());

      // ---------- H5 Pension ----------
      { const R = pensionRegeln(); R.offen = true; R.max = 3;
        pensionAnfrageNeu(); const a = (spiel.pensionAnfragen || []).slice(-1)[0];
        ok('H5 Anfrage per Brief', !!a && (spiel.post || []).some(x => /Pensionsplatz/.test(x.betreff || '')), a ? a.pferd.name : '');
        ok('H5 Anfrage annehmen', a && pensionAnnehmen(a) === '');
        nacht(1);
        const e = einstellerListe()[0];
        ok('H5 Pensionspferd zieht ein', !!e && alleEigenenPferde().length >= 1 && spiel.boxen.some(x => x.pferd && x.pferd.einsteller === e.eid), e ? eName(e) : '');
        const geld = spiel.geld; pensionJahreszeit();
        ok('H5 Pensionsgeld wird gebucht (oder ist offen)', spiel.geld > geld || (e && e.offen), `${Math.round(spiel.geld - geld)} €`);
        ansehen('H5 hvw – Hof – Pension', () => pensionHTML(''));
        const pb = spiel.boxen.find(x => x.pferd && x.pferd.einsteller); if (pb) ansehen('H5 Pensionspferd – Versorgung', () => pensionVsgHTML(pb.pferd, pb)); }

      // ---------- H4 Umbau-Folgen ----------
      { if (!weideDa()) { spiel.hof.weideHa = Math.max(spiel.hof.weideHa || 0, 2); spiel.anlage.weide = true; }
        const g = gebaeude().find(x => x.typ === 'stall' && umbauBoxen(x).some(b => b.pferd && fremd(b.pferd)) && umbauBoxen(x).some(b => b.pferd && !fremd(b.pferd)));
        ok('H4 Stall mit eigenem Pferd und Einsteller gefunden', !!g);
        if (g) {
          const fuellen = () => ersatzBoxen(g).forEach((b, i) => { b.pferd = neuesPferd({ rasse: 'shetty', geschlecht: 'Wallach', alter: 8, name: 'Platzhalter' + i }); b.pferd.pflege = erzeugePflege(b.pferd); });
          fuellen();   // keine Ersatzbox frei → Einsteller braucht eine Lösung
          const eigen = umbauBetroffen(g).eigen[0], e = umbauBetroffen(g).einsteller[0], ep = pensionBox(e).pferd;
          ok('H4 Umbau möglich (Weide für eigene Pferde)', umbauSperre(g) === '', umbauSperre(g));
          umbauStarten(g); zu();
          ok('H4 Einsteller betroffen → Umbau erst in 1 Jahreszeit', g.plan && g.plan.ab === spiel.tag + tpj() && !g.bau, g.plan ? datumText(datum(g.plan.ab)) : '');
          ok('H4 Brief „Umbau angekündigt“', (spiel.post || []).some(x => /Umbau angekündigt/.test(x.betreff || '')));
          ok('H4 Keine neuen Einsteller in Boxen mit geplantem Umbau', !umbauBoxen(g).some(pensionBoxFrei));
          ansehen('H4 Bauen mit geplantem Umbau', () => bauenHTML());
          if (!g.plan) return [...L, ['✗', ansicht, 'H4 kein Plan', JSON.stringify({ bau: g.bau, st: umbauSperre(g), geld: spiel.geld, n: umbauBetroffen(g).einsteller.length })]];
          g.plan.wahl[e.eid] = 'nachlass';
          nacht(tpj());
          ok('H4 Umbau beginnt nach 1 Jahreszeit, Boxen gesperrt', g.bau && g.bau.art === 'umbau' && umbauBoxen(g).every(b => b.gesperrt), g.bau ? 'noch ' + g.bau.rest + ' Tage' : '');
          ok('H4 Eigenes Pferd ohne Box → Weide', eigen.weide && eigen.umbauWeide === g.gid, eigen.name + ' ' + JSON.stringify({ w: eigen.weide, u: eigen.umbauWeide, k: eigen.klinik, t: eigen.turnier, box: spiel.boxen.findIndex(b => b.pferd === eigen), geb: (spiel.boxen.find(b => b.pferd === eigen) || {}).geb, g: g.gid }));
          ok('H4 Einsteller-Pferd auf der Weide mit Nachlass', ep.weide && e.nachlass === g.gid, ep.name);
          { const geld = spiel.geld, leist = pensionLeistBetrag(e, datum().s); const offen0 = !!e.offen; pensionJahreszeit();
            ok('H4 Pensionsgeld mit 30 % Nachlass', offen0 || e.offen || Math.round(spiel.geld - geld) === Math.round(e.preis * 0.7) + leist, `${Math.round(spiel.geld - geld)} € statt ${e.preis + leist} €`); delete e.offen; }
          nacht(1); ok('H4 Weide-Pferde bleiben über Nacht draußen', eigen.weide && ep.weide);
          const rp = gebaeude().find(x => x.typ === 'reitplatz' && !x.bau && !x.plan && x.stufe < 3);
          if (rp) { umbauStarten(rp); zu(); ok('H4 Reitplatz im Umbau: kein Training dort', !ortOffen('reitplatz') && ortOffen('gelaende')); }
          nacht(Math.max(g.bau ? g.bau.rest : 0, rp && rp.bau ? rp.bau.rest : 0) + 1);
          ok('H4 Umbau fertig → Pferde zurück in die Box', !g.bau && !eigen.weide && !eigen.umbauWeide && !ep.weide && !e.nachlass && g.stufe >= 2, 'Stufe ' + g.stufe);
          if (rp && !rp.bau) ok('H4 Reitplatz nach dem Umbau wieder offen', ortOffen('reitplatz'));
          // Variante ohne Lösung: Einsteller kündigt selbst (Dome: kein „Vertrag ruht“)
          const nochDa = umbauBetroffen(g).einsteller.includes(e); ok('H4 Einsteller nach dem Umbau wieder in seiner Box', nochDa);
          if (g.stufe < 3 && nochDa) { fuellen(); umbauStarten(g); zu(); nacht(tpj());
            ok('H4 Ohne Lösung kündigt der Einsteller und zieht aus', !einstellerListe().includes(e) && !spiel.boxen.some(b => b.pferd === ep), ep.name);
            ok('H4 Brief „ausgezogen“', (spiel.post || []).some(x => /ausgezogen/.test(x.betreff || '') && (x.text || '').includes('Umbau'))); }
          spiel.boxen.forEach(b => { if (b.pferd && /^Platzhalter/.test(b.pferd.name)) b.pferd = null; });
        } }

      // ---------- H1 Kreditrate ----------
      { const rest = k.rest; k.jz = -1; kreditJahreszeit();
        ok('H1 Kreditrate wird abgebucht', k.rest < rest, `Rest ${rest} → ${k.rest} €`); }

      speichern(); return L;
    }, ansicht);
    ergebnisse.push(...r);
    // Hofverwaltung über die Oberfläche öffnen (alle Bereiche)
    for (const reiter of ['hof', 'finanzen', 'mitarbeiter', 'post']) await pg.evaluate(rt => { zeigeHof(rt); }, reiter);
    for (const ber of ['uebersicht', 'plan', 'bauen', 'land', 'pension', 'futter']) await pg.evaluate(bb => { hofBereich = bb; zeigeHof('hof'); }, ber);
    await pg.reload(); await pg.waitForTimeout(300);
    ergebnisse.push([await pg.evaluate(() => typeof hatSpielstand !== 'undefined' && hatSpielstand) ? '✓' : '✗', ansicht, 'Speichern und Neuladen', '']);
    await pg.close();
  }
  ergebnisse.forEach(z => console.log(z.join('  ')));
  const fehl = ergebnisse.filter(z => z[0] !== '✓');
  console.log('Fehler', JSON.stringify(errs));
  console.log(fehl.length || errs.length ? `${fehl.length} Prüfungen fehlgeschlagen` : 'alles ok');
  await b.close();
})();
