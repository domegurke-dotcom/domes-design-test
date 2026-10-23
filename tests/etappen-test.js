// Etappen-Test: spielt Domes Test-Anleitungen für Fütterung F1–F5, Hof-Ausbau H1–H3 und H5 per Skript nach.
// Start (im Repo-Ordner): NODE_PATH=/opt/node22/lib/node_modules node tests/etappen-test.js
// Erwartet: jede Zeile „✓“, am Ende „Fehler []“ und „alles ok“. Bilder: BILDER=fehler|alle BILDER_ORDNER=<Scratchpad-Ordner> (tests/bilder.js).
const { chromium } = require('playwright');
const path = require('path');
const B = require('./bilder');   // Bilder-Schalter: BILDER=aus|fehler|alle, siehe tests/bilder.js
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
      spiel.stufenAn = false; Object.keys(VET.verbotAb).forEach(k => { VET.verbotAb[k] = 99; });   // kein Tierhalteverbot mitten im Test (die Test-Pferde werden nicht immer versorgt);   // v650: neue Spiele starten mit Stufen-Sperre (Anfänger) – dieser Test prüft das ganze Spiel
      const L = [], ok = (name, bed, info = '') => L.push([bed ? '✓' : '✗', ansicht, name, info]);
      const nacht = n => { for (let i = 0; i < n; i++) { spiel.boxen.forEach(bx => { const q = bx.pferd; if (!q || bx.tot || q.klinik) return; fuetternAusLager(bx, 'du'); bx.krippeVoll = true; bx.mistig = false; bx.mistStufe = 0;   // auch Weide-Heu
          q.befunde = []; if (q.pflege) q.pflege.gesundheit = Math.max(q.pflege.gesundheit, 80); bx.zuletzt = q; }); const fr0 = (spiel.friedhof || []).length; naechsteNacht();
          spiel.boxen.forEach(bx => { if (bx.zuletzt && (!bx.pferd || bx.tot) && (spiel.friedhof || []).slice(fr0).some(g => g.pferd === bx.zuletzt)) { bx.pferd = bx.zuletzt; bx.tot = false; bx.pferd.befunde = []; if (bx.pferd.pflege) bx.pferd.pflege.gesundheit = 80; } delete bx.zuletzt; }); if (spiel.friedhof) spiel.friedhof.length = Math.min(spiel.friedhof.length, fr0); } };   // v653: zufällig gestorbene Test-Pferde (Kolik, Alter) wieder in die Box – sonst stürzt der Test später ab   // Tierarzt kümmert sich – hier geht es um die Abläufe
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
          const nochDa = umbauBetroffen(g).einsteller.includes(e); ok('H4 Einsteller nach dem Umbau wieder in seiner Box', nochDa || !einstellerListe().includes(e), nochDa ? '' : 'Einsteller zwischendurch gekündigt (Zufall) – Variante übersprungen');
          if (g.stufe < 3 && nochDa) { fuellen(); umbauStarten(g); zu(); nacht(tpj());
            ok('H4 Ohne Lösung kündigt der Einsteller und zieht aus', !einstellerListe().includes(e) && !spiel.boxen.some(b => b.pferd === ep), ep.name);
}
          spiel.boxen.forEach(b => { if (b.pferd && /^Platzhalter/.test(b.pferd.name)) b.pferd = null; });
        } }

      // ---------- H6a Weiden, Gras, Matsch, Weidepflege ----------
      { if (!weiden().length) { spiel.hof.weideHa = 1; delete spiel.weiden; }
        ok('H6 Weide aus dem eingezäunten Land angelegt', weiden().length >= 1 && Math.abs(weidenSumme() - spiel.hof.weideHa) < 0.01, weiden().map(w => `${w.name} ${w.ha} ha, Gras ${w.gras} %`).join(' | '));
        const n0 = weiden().length; spiel.hof.ha += 1; bauWeideZiel = 'neu'; bauStarten('weide', 1, { ha: 1, ziel: 'neu' }); zu();
        nacht(4);
        ok('H6 Einzäunen als neue Weide', weiden().length === n0 + 1, weiden().map(w => w.name).join(', '));
        const w1 = weiden()[0], w2 = weiden()[weiden().length - 1];
        const bx = spiel.boxen.find(b => b.pferd && !b.tot && !fremd(b.pferd) && !b.pferd.weide && !b.pferd.klinik), q = bx && bx.pferd;
        if (q) { aufWeide(q, bx, null, w2.wid);
          ok('H6 Pferd auf die gewählte Weide', q.weide && q.weide.wid === w2.wid && weidePferde(w2).includes(q), q.name + ' → ' + w2.name);
          w2.ha = 0.1; const g0 = w2.gras, m0 = w2.matsch; for (let i = 0; i < 3; i++) { if (!q.weide) aufWeide(q, bx, null, w2.wid); nacht(1); }   // v296: abends wieder in der Box
          ok('H6 Abends wieder in der Box, Box muss gemistet werden', !q.weide && bx.mistig); aufWeide(q, bx, null, w2.wid);
          ok('H6 Überbesetzt: Gras sinkt, Matsch steigt', w2.gras < g0 && w2.matsch > m0, `Gras ${g0} → ${w2.gras} %, Matsch ${m0} → ${w2.matsch} %`);
          w2.gras = 10; ok('H6 Abgefressen → Heu nötig', heuNoetigP(q));
          w2.matsch = 80; const r0 = Object.fromEntries(befundRisiko(q, bx, 'weide')); w2.aepfel = spiel.tag; const r1 = Object.fromEntries(befundRisiko(q, bx, 'weide'));
          ok('H6 Abäppeln senkt das Wurmrisiko', r1.wuermer < r0.wuermer, `${r0.wuermer.toExponential(2)} → ${r1.wuermer.toExponential(2)}`);
          w2.matsch = 0; const r2 = Object.fromEntries(befundRisiko(q, bx, 'weide'));
          ok('H6 Matsch → mehr Mauke und Strahlfäule', r1.mauke > r2.mauke && r1.strahlfaeule > r2.strahlfaeule);
          vonWeideHolen(bx); w2.ha = 1; w2.gras = 60; }
        w1.gesperrt = true; ok('H6 Gesperrte Weide wird nicht gewählt', !weideWahl({}) || weideWahl({}).wid !== w1.wid); delete w1.gesperrt;
        // Nachsäen (v283): Frühling/Herbst, Weide leer, danach Ruhe ⅓ Jahreszeit
        { const w = weiden()[0], s = datum().s, P = weidePferde(w);
          if (s === 0 || s === 2) { delete w.saatJz; delete w.ruhtBis; delete w.gesperrt;
            if (P.length) ok('H6 Nachsäen gesperrt, solange Pferde draufstehen', weideNachsaeen(w) !== '');
            P.forEach(q => { const b = spiel.boxen.find(x => x.pferd === q); if (b) vonWeideHolen(b); });
            w.gras = 30; const g0 = w.gras; ok('H6 Nachsäen (leere Weide)', weideNachsaeen(w) === '' && w.gesperrt && w.ruhtBis === spiel.tag + Math.max(1, Math.round(tpj() / 3)), 'ruht ' + (w.ruhtBis - spiel.tag) + ' Tage');
            ok('H6 Nachsäen nur einmal je Jahreszeit', weideNachsaeen(w) !== '');
            ok('H6 Ruhende Weide wird nicht gewählt', !weideWahl({}) || weideWahl({}).wid !== w.wid);
            nacht(w.ruhtBis - spiel.tag);
            ok('H6 Nach der Ruhe wieder offen, Gras gewachsen', !w.gesperrt && w.ruhtBis == null && w.gras > g0, `Gras ${g0} → ${w.gras} %`); }
          else ok('H6 Nachsäen außerhalb Frühling/Herbst gesperrt', weideNachsaeen(w) !== ''); }
        ansehen('H6 hvw – Hof – Weiden', () => weidenHTML()); }
      // ---------- H6 Sandpaddocks ----------
      { spiel.hof.ha += 1; spiel.hof.bauHa += 1; const n0 = paddocks().length; const b1 = bauStarten('sandpaddock', 1), b2 = bauStarten('sandpaddock', 2); zu(); let z = 0; while (gebaeude().some(g => g.typ === 'sandpaddock' && g.bau) && z++ < 3 * tpj()) nacht(1);
        ok('H6 Zwei Sandpaddocks gebaut', paddocks().length === n0 + 2, paddocks().map(g => paddockName(g) + ' (Platz ' + paddockPlatz(g) + ')').join(', ') + ' gebaut: ' + b1 + '/' + b2);
        const eigene = () => spiel.boxen.filter(b => b.pferd && !b.tot && !fremd(b.pferd) && !b.pferd.klinik && !inQuarantaene(b.pferd));
        for (let i = eigene().length; i < 2; i++) { const fb = spiel.boxen.find(b => boxFrei(b) && !b.quar); if (fb) { fb.pferd = neuesPferd({ rasse: 'araber', geschlecht: 'Wallach', alter: 9, name: 'Paddi' + i }); fb.pferd.pflege = erzeugePflege(fb.pferd); } }
        const eig = eigene().slice(0, 2), g1 = paddocks()[n0], g2 = paddocks()[n0 + 1];
        if (eig.length === 2 && g1 && g2) { eig.forEach(b => { if (b.pferd.weide) vonWeideHolen(b); }); eig[0].pferd.paddock = { seit: spiel.tag, pid: g1.gid }; eig[1].pferd.paddock = { seit: spiel.tag, pid: g2.gid };
          ok('H6 Pferde in verschiedenen Sandpaddocks', paddockPferde(g1).includes(eig[0].pferd) && paddockPferde(g2).includes(eig[1].pferd));
          nacht(1); ok('H6 Im Sandpaddock kein Box-Abzug', (eig[0].pferd.boxTage || 0) === 0 && /Sandpaddock/.test(JSON.stringify(eig[0].pferd.wohlLog || {})));
          eig.forEach(b => delete b.pferd.paddock); } }

      // ---------- H6 Einstreu ----------
      { const F = futterkammer(), bx = spiel.boxen.find(b => b.pferd && !b.tot && !b.pferd.weide && !b.pferd.klinik);
        ok('H6 Startvorrat Einstreu-Stroh', F.einstreuStart && (F.lager.streuStroh || 0) >= 0, fmtKg(F.lager.streuStroh || 0));
        F.lager.streuStroh = 100; F.lager.pellets = 50; delete bx.einstreu; bx.einstreu = 'pellets';
        const v0 = F.lager.pellets; nacht(1);
        ok('H6 Einstreu wird je Box und Tag verbraucht', F.lager.pellets < v0 && !bx.ohneEinstreu, `Pellets ${v0} → ${F.lager.pellets} kg`);
        const rP = Object.fromEntries(befundRisiko(bx.pferd, bx, 'box')); bx.einstreu = 'streuStroh'; const rS = Object.fromEntries(befundRisiko(bx.pferd, bx, 'box'));
        ok('H6 Pellets: weniger Strahlfäule, Stroh: mehr Husten', rP.strahlfaeule < rS.strahlfaeule && (rS.husten || 0) > (rP.husten || 0));
        Object.keys(EINSTREU).forEach(k => F.lager[k] = 0); nacht(1);
        ok('H6 Ohne Einstreu: Brief und Wohlbefinden sinkt', bx.ohneEinstreu && (spiel.post || []).some(x => /Keine Einstreu/.test(x.betreff || '')) && /keine Einstreu/.test(JSON.stringify(bx.pferd.wohlLog || {})));
        F.lager.streuStroh = 200; nacht(1); ok('H6 Nachgekauft: wieder eingestreut', !bx.ohneEinstreu);
        ansehen('H6 Einstreu-Auswahl', () => einstreuWahl(bx)); ansehen('H6 Futterkammer mit Einstreu', () => futterkammerHTML('')); }

      // ---------- H6 Pension: bessere Einstreu ----------
      { const R = pensionRegeln(); R.leistungen.einstreu = true; R.offen = true; R.max = 9;
        if (!einstellerListe().some(x => pensionBox(x))) { const fb = spiel.boxen.find(b => pensionBoxFrei(b)); if (!fb) { const x = spiel.boxen.find(b => b.pferd && /^Paddi/.test(b.pferd.name)); if (x) x.pferd = null; }
          pensionAnfrageNeu(); const a = spiel.pensionAnfragen.slice(-1)[0]; a.bluttest = 'vorher'; pensionAnnehmen(a); nacht(1); }
        const e = einstellerListe().find(x => pensionBox(x) && !pensionBox(x).pferd.weide), b = e && pensionBox(e);
        if (b && b.pferd && !b.pferd.weide) { const F = futterkammer(); e.leistungen.einstreu = true; b.einstreu = 'streuStroh'; F.lager.spaene = 50; F.lager.streuStroh = 100; nacht(1);
          ok('H6 Pension „bessere Einstreu“: staubarme Sorte statt Stroh', b.einstreu === 'spaene', FUTTER[b.einstreu].n);
          Object.keys(EINSTREU).filter(k => !EINSTREU[k].staub).forEach(k => F.lager[k] = 0); b.einstreu = 'streuStroh'; nacht(1);
          ok('H6 Nur Stroh trotz Buchung → Einsteller unzufrieden', (e.log || []).some(x => /bessere Einstreu/.test(x.grund || '')), (e.log || []).slice(0, 2).map(x => x.grund).join(', ')); }
        else ok('H6 Pension „bessere Einstreu“ (kein Einsteller zum Testen)', true);
        ansehen('H6 Pension mit „bessere Einstreu“', () => pensionHTML('')); }

      // ---------- H6 Futterwiese ----------
      { const w = { wid: 'wtest', name: 'Testwiese', ha: 2, gras: 80, matsch: 0, wiese: true }; weiden().push(w); spiel.hof.ha += 2; spiel.hof.weideHa = weidenSumme(); buchen(5000, 'Testgeld');
        ok('H6 Futterwiese wird nicht als Weide angeboten', !weideWahl({}) || weideWahl({}).wid !== 'wtest');
        const F = futterkammer(); let z = 0; const vor = (F.lager.heu || 0) + (F.lager.heuStaub || 0);
        while (!(w.schnitte >= 1) && z++ < 5 * tpj()) nacht(1);
        const nach = (F.lager.heu || 0) + (F.lager.heuStaub || 0);
        ok('H6 Bauer mäht im Sommer: Heu im Lager, Brief, Lohn', w.schnitte >= 1 && (spiel.post || []).some(x => /gemäht/.test(x.betreff || '')), `${datumText(datum())}: Heu ${Math.round(vor)} → ${Math.round(nach)} kg (inkl. Verbrauch)`);
        spiel.weiden = weiden().filter(x => x !== w); spiel.hof.weideHa = weidenSumme(); }

      // ---------- H7 Stallarten ----------
      { const H = spiel.hof; ok('H7 Start-Hof ist Pensionsstall', H.art === 'pension');
        H.art = 'western'; spiel.stallarten = ['western']; spiel.anlage.trail = false; H.artSeit = jzJetzt(); delete H.artCache; delete H.artVerloren; delete H.artFrist; H.foerderLog = [];
        const vorher = (spiel.post || []).length; stallartJahreszeit();
        ok('H7 Schonfrist: keine Strafe, keine Förderung', !H.artFrist && !H.artVerloren && ((spiel.post || []).length === vorher || /diesmal keine Förderung/.test((spiel.post || [])[0].betreff || '')),   // v650: der Brief „diesmal keine Förderung“ (Schonfrist, keine Strafe) gehört seit v36x dazu
           JSON.stringify({ f: H.artFrist, v: H.artVerloren, p: [vorher, (spiel.post || []).length], b: stallartBed('western').map(x => x[1]), ok: stallartOk(), art: spiel.hof.art, gleich: spiel.hof === H, top: (spiel.post || [])[0] && spiel.post[0].betreff }));
        H.artSeit = jzJetzt() - 5; H.foerderLog = [{ jz: jzJetzt() - 1, b: 300 }]; delete H.artCache; stallartJahreszeit();
        ok('H7 Bedingung fehlt → Warnbrief mit Frist', H.artFrist === jzJetzt() + 1 && (spiel.post || []).some(x => /Bedingungen nicht erfüllt/.test(x.betreff || '')));
        H.artFrist = jzJetzt(); const g0 = spiel.geld; stallartJahreszeit();
        ok('H7 Frist vorbei → Statusverlust und Rückzahlung', H.artVerloren && Math.round(g0 - spiel.geld) === 300, `${Math.round(g0 - spiel.geld)} € zurück`);
        const frei = () => spiel.boxen.find(b => boxFrei(b) && !b.quar), neu = (g, n) => { const b = frei(); if (b) { b.pferd = neuesPferd({ rasse: 'araber', geschlecht: g, alter: 6, name: n }); b.pferd.pflege = erzeugePflege(b.pferd); } };
        H.art = 'zucht'; spiel.stallarten = ['zucht']; neu('Hengst', 'Zuchthengst'); neu('Stute', 'Zuchtstute1'); neu('Stute', 'Zuchtstute2'); spiel.boxen[spiel.boxen.length - 1].abfohl = true; gebaeude().push({ gid: 'gAufTest', typ: 'aufzucht', stufe: 1, zustand: 100 }); delete H.artCache;   // v313: Offenstall ist jetzt Bedingung
        const g1 = spiel.geld; stallartJahreszeit();
        ok('H7 Bedingungen erfüllt → Status zurück, Förderung, Vorteil', !H.artVerloren && vorteil('zucht') && Math.round(spiel.geld - g1) === foerderBetrag(), stallartBed('zucht').map(x => (x[1] ? '✓' : '✗') + x[0]).join(' | '));
        ansehen('H7 hvw – Hof – Übersicht (Stallart)', () => stallartHTML());
        { const g2 = spiel.geld, n = gebaeude().length; spiel.geld += 200000; const g3 = spiel.geld; spiel.hof.bauHa += 2; bauStarten('reitplatz', 3); const B = BAUTEN.reitplatz, pr = bauPreis('reitplatz', 3);
          ok('H7 Bauzuschuss 20 % bei Stufe 3', Math.round(g3 - spiel.geld) === Math.round(pr - pr * BAUZUSCHUSS), `${g3 - spiel.geld} / ${pr}`); spiel.hof.wert -= pr; spiel.gebaeude = gebaeude().slice(0, n); spiel.hof.bauHa -= 2; spiel.geld = g2; }
        spiel.boxen.forEach(b => { if (b.pferd && /^Zucht/.test(b.pferd.name)) b.pferd = null; }); spiel.gebaeude = gebaeude().filter(x => x.gid !== 'gAufTest'); H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }
      // ---------- H7 (e) Gnadenhof: Patenschaften, Tierarztrabatt (v310) ----------
      { const H = spiel.hof, merk = spiel.boxen.map(b => b.pferd); spiel.boxen.forEach(b => { if (b.pferd && !fremd(b.pferd)) b.pferd = null; });
        const fb = spiel.boxen.find(b => !b.pferd); const alt = neuesPferd({ rasse: 'haflinger', geschlecht: 'Stute', alter: 25, name: 'Gnadenoma' }); fb.pferd = alt; alt.pflege = erzeugePflege(alt);
        H.art = 'gnadenhof'; spiel.stallarten = ['gnadenhof']; delete H.artCache; delete H.artVerloren;
        ok('H7e Gnadenhof-Bedingungen erfüllt', vorteil('gnadenhof'), stallartBed('gnadenhof').map(x => (x[1] ? '✓' : '✗') + x[0]).join(', '));
        const R = Math.random, g0 = spiel.geld; Math.random = () => 0.1; patenJahreszeit(); Math.random = R;
        ok('H7e Patenschaft mit erster Zahlung', !!alt.pate && Math.round(spiel.geld - g0) === alt.pate.betrag, alt.pate ? `${alt.pate.vn} ${alt.pate.nn}, ${alt.pate.betrag} €` : 'kein Pate');
        rechnungStellen('Tierarztpraxis', 'klinik', [{ text: 'Gnadenoma: Test', betrag: 100 }], [alt.id], 'Test – Rechnung', 'Test'); zu();
        const re = (spiel.rechnungen || []).filter(x => x.von === 'Tierarztpraxis').pop();
        ok('H7e Tierarztrabatt 20 %', re && re.posten.some(x => /Gnadenhof-Rabatt/.test(x.text) && x.betrag === -20), re ? re.posten.map(x => x.text + ' ' + x.betrag).join(', ') : '');
        if (re) rechnungSchliessen(re, 'Test');
        spiel.boxen.forEach((b, i) => { b.pferd = merk[i]; }); H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }
      // ---------- H7 (d) Deckhengst für fremde Stuten (v312) ----------
      { const H = spiel.hof, merk = spiel.boxen.map(b => b.pferd), abf = spiel.boxen.map(b => b.abfohl); spiel.boxen.forEach(b => { if (b.pferd && !fremd(b.pferd)) b.pferd = null; });
        const frei = spiel.boxen.filter(b => !b.pferd).slice(0, 3), [hg, s1, s2] = frei.map((b, i) => { const q = neuesPferd({ rasse: 'hannoveraner', geschlecht: i ? 'Stute' : 'Hengst', alter: 8, name: 'Zuchttest' + i }); b.pferd = q; q.pflege = erzeugePflege(q); q.pflege.gesundheit = 100; q.befunde = []; return q; });
        spiel.boxen[spiel.boxen.length - 1].abfohl = true; H.art = 'zucht'; spiel.stallarten = ['zucht']; gebaeude().push({ gid: 'gAufTest', typ: 'aufzucht', stufe: 1, zustand: 100 }); delete H.artCache;
        hg.deckFremd = { an: true }; const R = Math.random, g0 = spiel.geld, s0 = datum().s; Math.random = () => 0.01; deckhengstTag(); Math.random = R;
        if (s0 <= 1) { ok('H7d Fremde Stute gedeckt, Decktaxe gebucht', hg.deckFremd.n === 1 && Math.round(spiel.geld - g0) === decktaxe(hg), `${hg.deckFremd.n || 0} × ${decktaxe(hg)} €`);
          const f = (spiel.fremdFohlen || []).find(x => x.hid === hg.id); if (f) { f.geburt = jzJetzt(); fremdFohlenJahreszeit(); }
          ok('H7d Fohlen der fremden Stute zählt als Nachkomme', !f || hg.nachkommen === 1, String(hg.nachkommen || 0)); }
        else ok('H7d außerhalb der Decksaison keine fremden Stuten', !hg.deckFremd.n);
        spiel.boxen.forEach((b, i) => { b.pferd = merk[i]; b.abfohl = abf[i]; }); spiel.gebaeude = gebaeude().filter(x => x.gid !== 'gAufTest'); H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }
      // ---------- H7 (a) Aufzucht-Offenstall (v313) ----------
      { const H = spiel.hof, merk = spiel.boxen.slice(), mBox = spiel.boxen.map(b => b.pferd), g0 = spiel.geld, gl = gebaeude().length; spiel.boxen.forEach(b => { if (b.pferd && !fremd(b.pferd)) b.pferd = null; });
        H.art = 'pension'; ok('H7a Offenstall nur im Zuchtstall', bauSperre('aufzucht') !== '');
        H.art = 'zucht'; spiel.stallarten = ['zucht']; spiel.geld += 50000; H.bauHa += 1; bauStarten('aufzucht', 1); const g = gebaeude().find(x => x.typ === 'aufzucht'); g.bau.rest = 0; bauFertig(g, 'neu'); delete g.bau;
        ok('H7a 10 Offenstall-Plätze, keine normalen freien Boxen', offenBoxen().length === 10 && !(spiel.boxen[freieBox()] || {}).offen);
        const jb = spiel.boxen.find(b => boxFrei(b)), jq = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 1, name: 'Offenjung' }); jb.pferd = jq; jq.pflege = erzeugePflege(jq); werteErgaenzen(jq);
        const tb = spiel.boxen.find(b => boxFrei(b)), tq = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 10, name: 'Offentante' }); tb.pferd = tq; tq.pflege = erzeugePflege(tq);
        ok('H7a Jungpferd und Tante dürfen hinein', !offenSperre(jq, jb) && !offenSperre(tq, tb), offenSperre(jq, jb) + ' / ' + offenSperre(tq, tb));
        inBoxUmziehen(jb, offenPlatz()); inBoxUmziehen(tb, offenPlatz()); const s0 = sozial(jq); offenstallNacht();
        ok('H7a Sozialverhalten steigt im Offenstall', sozial(jq) > s0, `${s0} → ${sozial(jq)}`);
        delete H.artCache; ok('H7a Zuchtstall-Bedingung Offenstall erfüllt', stallartBed('zucht').some(x => /Offenstall/.test(x[0]) && x[1]));
        ansehen('H7a Offenstall-Bild', () => { aktBox = spiel.boxen.findIndex(b => b.pferd === jq); zeigeStall(); });
        spiel.gebaeude = gebaeude().slice(0, gl); spiel.boxen = merk; spiel.boxen.forEach((b, i) => { b.pferd = mBox[i]; }); aktBox = 0; H.bauHa -= 1; H.wert -= g.preis; spiel.geld = g0; H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }
      // ---------- H7 (c) Beritt im Ausbildungsstall (v314) ----------
      { const H = spiel.hof, mMerk = (spiel.mitarbeiter || []).slice(), A0 = { ...spiel.anlage }, eMerk = einstellerListe().slice();
        H.art = 'ausbildung'; spiel.stallarten = ['ausbildung']; spiel.anlage.reitplatz = true; spiel.anlage.roundpen = true;
        spiel.mitarbeiter = [...mMerk, { id: 'maBT', typ: 'bereiter', name: 'Testbereiter', w: true, wissen: wissenStart(30, { ruecken: 60 }), eig: [], gehalt: 420, ab: jzJetzt(), bis: null }]; delete H.artCache;
        ok('H7c Beritt-Plätze im Ausbildungsstall', berittPlaetze() > 0, String(berittPlaetze()));
        fremdAnfrageNeu('beritt'); const a = spiel.pensionAnfragen.find(q => q.art === 'beritt' && !q.angenommen);
        ok('H7c Beritt-Anfrage per Brief', !!a && (spiel.post || []).some(x => /Beritt für/.test(x.betreff || '')));
        if (a) { ok('H7c Beritt annehmen', pensionAnnehmen(a) === ''); a.tag = spiel.tag - 1; pensionEinzug(); zu();
          const e = einstellerListe().find(q => q.art === 'beritt');
          ok('H7c Beritt-Pferd zieht ein (450 € je Jz)', !!e && e.preis === BERITT.preis && !!pensionBox(e), e ? `${e.preis} €` : '');
          if (e) { e.bis = jzJetzt(); fremdEndeJahreszeit(); ok('H7c Beritt-Ende: Besitzer holt ab', !einstellerListe().includes(e)); } }
        spiel.pensionAnfragen = (spiel.pensionAnfragen || []).filter(q => q.art !== 'beritt'); spiel.einsteller = eMerk; spiel.mitarbeiter = mMerk; spiel.anlage = { ...spiel.anlage, ...A0 }; H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }
      // ---------- H7 (b) Rennbahn, Rennpferdetrainer (v311) ----------
      { const H = spiel.hof, merk = spiel.boxen.map(b => b.pferd), mMerk = (spiel.mitarbeiter || []).slice(); spiel.boxen.forEach(b => { if (b.pferd && !fremd(b.pferd)) b.pferd = null; });
        const frei = spiel.boxen.filter(b => !b.pferd).slice(0, 2), rp = frei.map((b, i) => { const q = neuesPferd({ rasse: 'vollblut', geschlecht: 'Stute', alter: 4, name: 'Renner' + i }); b.pferd = q; q.pflege = erzeugePflege(q); q.pflege.gesundheit = 100; q.befunde = []; werteErgaenzen(q); return q; });
        H.art = 'renn'; spiel.stallarten = ['renn']; delete H.artCache; const g0 = spiel.geld; spiel.geld += 50000; H.bauHa += 1; bauStarten('rennbahn', 1); const g = gebaeude().find(x => x.typ === 'rennbahn'); g.bau.rest = 0; bauNacht();
        ok('H7b Rennbahn gebaut', !g.bau && spiel.anlage.rennbahn && ortOffen('rennbahn'));
        ok('H7b Rennpferdetrainer nur im Rennstall', maVerfuegbar('renntrainer') && !maVerfuegbar('westerntrainer'));
        spiel.mitarbeiter = [...mMerk, { id: 'maRT', typ: 'renntrainer', name: 'Testtrainer', w: false, wissen: wissenStart(30, { ruecken: 60 }), eig: [], gehalt: 450, ab: jzJetzt(), bis: null }]; delete H.artCache;
        ok('H7b Rennstall-Bedingungen erfüllt', stallartOk(), stallartBed('renn').map(x => (x[1] ? '✓' : '✗') + x[0]).join(', '));
        rp.forEach(q => { delete q.trainHeute; q.energie = energieMax(q); }); trainerMorgen('renntrainer');
        ok('H7b Trainer trainiert morgens (Galopptraining)', rp.every(q => q.trainHeute && q.trainHeute.liste.some(e => e.k === 'galopptraining')), rp.map(q => q.trainHeute ? q.trainHeute.liste.map(e => e.k).join('+') : '–').join(', '));
        ok('H7b Trainergebühr nur ohne Rennstall', nenngeld({ art: 'regional' }, { nenn: 100, jockey: true }) === 140, String(nenngeld({ art: 'regional' }, { nenn: 100, jockey: true })));
        spiel.gebaeude = gebaeude().filter(x => x !== g); spiel.anlage.rennbahn = false; H.bauHa -= 1; H.wert -= g.preis; spiel.geld = g0; spiel.mitarbeiter = mMerk;
        spiel.boxen.forEach((b, i) => { b.pferd = merk[i]; }); H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }

      // ---------- H8 Hausturnier (v315) ----------
      { const H = spiel.hof, mMerk = (spiel.mitarbeiter || []).slice(), A0 = { ...spiel.anlage }, g0 = spiel.geld;
        H.art = 'ausbildung'; spiel.stallarten = ['ausbildung']; spiel.anlage.reitplatz = true; spiel.anlage.roundpen = true;
        spiel.mitarbeiter = [...mMerk, { id: 'maBH', typ: 'bereiter', name: 'Testbereiter', w: true, wissen: wissenStart(30, {}), eig: [], gehalt: 420, ab: jzJetzt(), bis: null }]; delete H.artCache;
        const sp = hausturnierSperre(); if (sp) ok('H8 Hausturnier (zu spät in der Jahreszeit)', /zu spät/.test(sp), sp);
        else { spiel.geld += 1000; ok('H8 Hausturnier anlegen', hausturnierAnlegen(spiel.tag + 2) === '');
          const t = spiel.turniere.find(x => x.haus === aktivHid()); ok('H8 Hausturnier im Kalender mit E/A', !!t && t.pruef.some(P => P.stufe === 1), t ? t.pruef.length + ' Prüfungen' : '');
          ok('H8 nur einmal je Jahreszeit', hausturnierSperre() !== '');
          if (t) { const ans = pensionRegeln().ansehen, gg = spiel.geld; const tg = spiel.tag; spiel.tag = t.tag; hausturnierMorgen(); spiel.tag = tg;
            ok('H8 Nenngelder der Gäste + Ansehen', spiel.geld > gg && pensionRegeln().ansehen > ans, `+${Math.round(spiel.geld - gg)} €, Ansehen ${ans} → ${pensionRegeln().ansehen}`); }
          spiel.turniere = spiel.turniere.filter(x => !x.haus); }
        ansehen('H8 Hof – Übersicht mit Hausturnier', () => stallartHTML());
        spiel.geld = g0; spiel.mitarbeiter = mMerk; spiel.anlage = { ...spiel.anlage, ...A0 }; H.art = 'pension'; spiel.stallarten = ['pension']; delete H.artCache; }

      // ---------- H1 Kreditrate ----------
      { const k = kredite().find(x => kreditLaeuft(x)) || kredite()[0]; const rest = k.rest; spiel.geld = Math.max(spiel.geld, 20000); delete spiel.verloren; k.jz = -1; kreditJahreszeit();   // v650: Konto vorher füllen (Dispo-Grenze v547 – bei leerem Konto wird die Rate zur Mahnung)
        ok('H1 Kreditrate wird abgebucht', k.rest < rest, `Rest ${rest} → ${k.rest} €` + (k.rest < rest ? '' : ' ' + JSON.stringify({ offen: k.offen, laeuft: kreditLaeuft(k), verl: !!spiel.verloren, geld: spiel.geld, dispo: dispoLimit(), jz: [k.jz, jzJetzt()], n: kredite().length }))); }

      speichern(); return L;
    }, ansicht);
    ergebnisse.push(...r);
    const gut = r.every(z => z[0] === '✓') && !errs.some(e => e.startsWith(ansicht));
    await B.bild(pg, ansicht + '-Ende-der-Prüfungen', gut);   // Zustand nach allen Prüfungen (bei ✗: dieser Zustand, nicht der genaue Schritt – die ✗-Zeile nennt den Schritt)
    // Hofverwaltung über die Oberfläche öffnen (alle Bereiche)
    for (const reiter of ['hof', 'finanzen', 'mitarbeiter', 'post']) { await pg.evaluate(rt => { zeigeHof(rt); }, reiter); await B.bild(pg, ansicht + '-hvw-' + reiter, !errs.some(e => e.startsWith(ansicht))); }
    for (const ber of ['uebersicht', 'plan', 'bauen', 'pension', 'futter']) { await pg.evaluate(bb => { hofBereich = bb; zeigeHof('hof'); }, ber); await B.bild(pg, ansicht + '-hof-' + ber, !errs.some(e => e.startsWith(ansicht))); }
    await pg.reload(); await pg.waitForTimeout(300);
    ergebnisse.push([await pg.evaluate(() => typeof hatSpielstand !== 'undefined' && hatSpielstand) ? '✓' : '✗', ansicht, 'Speichern und Neuladen', '']);
    await pg.close();
  }
  ergebnisse.forEach(z => console.log(z.join('  ')));
  const fehl = ergebnisse.filter(z => z[0] !== '✓');
  console.log('Fehler', JSON.stringify(errs));
  console.log(fehl.length || errs.length ? `${fehl.length} Prüfungen fehlgeschlagen` : 'alles ok');
  if (B.zusammenfassung()) console.log(B.zusammenfassung());
  await b.close();
})();
