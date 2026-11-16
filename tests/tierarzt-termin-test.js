// Auftrag 25 Block 4, Etappe 4c (v1064): „Tierarzt rufen“ = Termin über den Kalender (frühestens morgen, jemand muss da sein) oder Notfall sofort
// (60 € + 50 € Notdienstgebühr, Behandlung doppelt, GOT § 4). Termin auf einem Hof ohne Mitarbeiter und ohne dich fällt aus, die Anfahrt kostet trotzdem.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/tierarzt-termin-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path'); const O = process.argv[2] && process.argv[2] !== '-' ? process.argv[2] : null;
const [BW, BH] = (process.argv[3] || '1366x768').split('x').map(Number);
(async () => {
  const b = await chromium.launch(); const errs = []; const L = []; const ok = (n, c, x) => L.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || '')));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  const pg = await b.newPage({ viewport: { width: BW, height: BH } }); pg.on('pageerror', e => errs.push(e.message));
  const bild = async n => { if (O) await pg.screenshot({ path: `${O}/${n}-${BW}x${BH}.png` }); };
  const zurBox = async i => { await pg.evaluate(i => { document.getElementById('dlg').hidden = true; spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'gesundheit'; zeigeSchirm(null); zeigeTag(); zeigeAkte(); }, i); await pg.waitForTimeout(300); };
  try {
    await pg.goto('file://' + datei); await pg.waitForTimeout(500);
    await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
    await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.admin = false; VET.verbotAb = 99; spiel.geld = 50000; spiel.einsteller = []; spiel.pensionAnfragen = []; spiel.mitarbeiter = [];
      const mk = (name, i) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; P.pflege.zahn = spiel.tag; P.befunde = []; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; return P; };
      ['Anna', 'Bella'].forEach((n, i) => { const P = mk(n, i), bf = befundNeu(P, 'husten', 2, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag }; }); });
    /* 1. Box → Versorgung → Tierarzt-Knopf: Auswahl Termin / Notfall */
    await zurBox(0); await pg.click('#tierarztKnopf'); await pg.waitForTimeout(300); await bild('T1-auswahl');
    let t = await pg.innerText('#dlgInhalt'), kn = await pg.$$eval('#dlgKnoepfe button', x => x.map(k => k.dataset.txt || k.textContent));
    ok('Fenster „Tierarzt“ bietet Termin morgen, übermorgen und Notfall (60 € + 50 € Notdienst, doppelt)', kn.some(k => /Termin morgen/.test(k)) && kn.some(k => /übermorgen/.test(k)) && kn.some(k => /Notfall · 110/.test(k)) && /jemand muss da sein/i.test(t) && /Notdienstgebühr 50/.test(t), kn.join(' | ') + ' ' + t.slice(0, 200));
    let r0 = await pg.evaluate(() => ({ geld: spiel.geld, post: spiel.post.length, diag: spiel.boxen[0].pferd.befunde[0].diagnose }));
    await pg.click('#dlgKnoepfe button[data-txt="📅 Termin morgen"]'); await pg.waitForTimeout(300); await bild('T2-termin'); await pg.click('#dlgKnoepfe button').catch(() => {});
    let r = await pg.evaluate(() => ({ T: spiel.vetTermine, geld: spiel.geld, diag: spiel.boxen[0].pferd.befunde[0].diagnose, kal: kalTermine(jzJetzt()).concat(kalTermine(jzJetzt() + 1)).filter(x => /Tierarzt: Anna/.test(x.text)).map(x => x.tag), tag: spiel.tag }));
    ok('Termin morgen: steht im Kalender, heute noch kein Besuch und keine Kosten', r.T.length === 1 && r.T[0].tag === r.tag + 1 && r.kal.length === 1 && r.kal[0] === r.tag + 1 && r.geld === r0.geld && !r.diag, JSON.stringify(r));
    /* Kalender per Klick ansehen */
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('kalender'); }); await pg.waitForTimeout(300); await bild('T3-kalender');
    await pg.click(`[data-kaltag="${r.tag + 1}"]`); await pg.waitForTimeout(300); await bild('T3b-kaltag');
    ok('Kalender: Tag antippen zeigt „Tierarzt: Anna“', /Tierarzt: Anna/.test(await pg.innerText('body')));
    /* 2. Nacht → morgens kommt der Tierarzt (du bist da): Diagnose, Rechnung 60 € + Behandlung, kein Fenster */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; spiel.boxen.slice(0, 2).forEach(bx => { bx.krippeVoll = true; bx.mistig = false; bx.wasserTag = spiel.tag; }); naechsteNacht(); zu();
      const A = spiel.boxen[0].pferd, R = (spiel.rechnungen || []).find(q => q.von === 'Tierarztpraxis'); return { diag: !!A.befunde.find(b => b.art === 'husten' && b.diagnose), T: spiel.vetTermine.length, posten: R ? R.posten.map(x => x.text + ' ' + x.betrag) : [] }; });
    ok('am Termin: Tierarzt untersucht Anna, Rechnung mit Hausbesuch 60 € (kein Notdienst)', r.diag && r.T === 0 && r.posten.some(x => /Anna: Hausbesuch und Untersuchung 60/.test(x)) && !r.posten.some(x => /Notdienst/.test(x)), JSON.stringify(r));
    /* 3. Notfall bei Bella (echte Klicks): sofort, 60 + 50, Behandlung doppelt */
    const preis1 = await pg.evaluate(() => { const b = spiel.boxen[1].pferd.befunde[0]; return behandlungsPreis(b); });
    await zurBox(1); await pg.click('#tierarztKnopf'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button[data-txt^="🚨 Notfall"]'); await pg.waitForTimeout(400); await bild('T4-notfall'); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => { const B = spiel.boxen[1].pferd, R = (spiel.rechnungen || []).find(q => q.von === 'Tierarztpraxis'); return { diag: !!B.befunde.find(b => b.art === 'husten' && b.diagnose), posten: R ? R.posten.filter(x => /^Bella/.test(x.text)).map(x => [x.text, x.betrag]) : [] }; });
    const nfB = r.posten.find(x => /Notfall-Hausbesuch/.test(x[0])), nfG = r.posten.find(x => /Notdienstgebühr/.test(x[0])), beh = r.posten.find(x => /Erstbehandlung.*doppelter Satz/.test(x[0]));
    ok(`Notfall: sofort untersucht; 60 € + Notdienstgebühr 50 € + Behandlung doppelt (${beh && beh[1]} € statt ${preis1} €)`, r.diag && nfB && nfB[1] === 60 && nfG && nfG[1] === 50 && beh && beh[1] === Math.round(preis1 * 2), JSON.stringify(r));
    /* 4. zweiter Hof ohne Mitarbeiter, du bist auf dem ersten: Termin fällt aus, Anfahrt kostet */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); const A = spiel.boxen[0].pferd; A.befunde = []; const bf = befundNeu(A, 'mauke', 2, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag };
      vetTerminMachen(A, spiel.tag + 1); spiel.vetTermine[0].hid = 'woanders'; const t0 = JSON.stringify(spiel.vetTermine);
      /* echter Fall: Hof h1 ist nicht der, auf dem du bist – vetTerminTag mit anderem Spieler-Hof aufrufen */
      spiel.vetTermine[0].hid = aktivHid(); spiel.tag += 1; spiel.rechnungen = []; const g = spiel.geld; vetTerminTag('anderer-hof'); zu();
      const R = (spiel.rechnungen || []).find(q => q.von === 'Tierarztpraxis'), x = (spiel.post || []).find(q => /Termin bei Anna ausgefallen/.test(q.betreff));
      return { diag: !!A.befunde.find(b => b.art === 'mauke' && b.diagnose), R: R ? R.posten.map(q => q.text + ' ' + q.betrag) : [], brief: x ? x.text.replace(/<[^>]+>/g, ' ') : '', t0 }; });
    ok('niemand da (anderer Hof, keine Mitarbeiter): Termin fällt aus, Anfahrt 60 € wird berechnet, Brief erklärt es', !r.diag && r.R.some(q => /Anfahrt – Termin ausgefallen 60/.test(q)) && /niemand da/.test(r.brief), JSON.stringify(r).slice(0, 400));
    /* 5. gleicher Fall mit Mitarbeiter: Termin klappt */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; const A = spiel.boxen[0].pferd; spiel.mitarbeiter = [maErgaenzen({ id: 'm1', typ: 'stallbursche', name: 'Sam', gehalt: 300, wissen: {}, eig: [], zufr: 90, ab: jzJetzt() - 1 })];
      vetTerminMachen(A, spiel.tag + 1); spiel.tag += 1; vetTerminTag('anderer-hof'); zu(); return { diag: !!A.befunde.find(b => b.art === 'mauke' && b.diagnose), da: maDa(spiel.mitarbeiter[0]) }; });
    ok('mit Mitarbeiter auf dem Hof: Termin klappt auch ohne dich', r.diag && r.da, JSON.stringify(r));
    /* 6. Pensionspferd: Tierarzt heute schon da → Fenster sagt es, Termin morgen geht */
    r = await pg.evaluate(() => { const P = spiel.boxen[1].pferd; P.tierarztTag = spiel.tag; const echtFremd = fremd; return { id: P.id }; });
    await pg.evaluate(() => { spiel.mitarbeiter = []; });
    /* 7. Termin absagen */
    await zurBox(0); await pg.evaluate(() => { const A = spiel.boxen[0].pferd; vetTerminMachen(A, spiel.tag + 2); }); await pg.click('#tierarztKnopf'); await pg.waitForTimeout(300);
    t = await pg.innerText('#dlgInhalt'); await bild('T5-steht');
    ok('steht schon ein Termin, zeigt das Fenster ihn („übermorgen“) und bietet „Termin absagen“', /Termin steht: übermorgen/.test(t) && !!(await pg.$('#dlgKnoepfe button[data-txt="Termin absagen"]')), t.slice(0, 300));
    await pg.click('#dlgKnoepfe button[data-txt="Termin absagen"]'); await pg.waitForTimeout(250);
    ok('Termin abgesagt: nicht mehr im Kalender', await pg.evaluate(() => !(spiel.vetTermine || []).length));
    /* 8. Krankheits-Brief: Knopf „Tierarzt rufen“ öffnet die Auswahl */
    r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const A = spiel.boxen[0].pferd; A.befunde = []; const bf = befundNeu(A, 'husten', 2, 'Test'); bf.bemerkt = { von: 'Sam', tag: spiel.tag };
      const p = (spiel.post || []).find(q => q.aktion && q.aktion.typ === 'befund'); return { br: p && p.id, typ: p && p.aktion.typ }; });
    if (r.br) { await pg.evaluate(() => zeigeHof('post')); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); } await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(300);
      if (await pg.$('[data-baktion="bf-ta"]')) { await pg.click('[data-baktion="bf-ta"]'); await pg.waitForTimeout(300); ok('Krankheits-Brief: „Tierarzt rufen“ öffnet die Auswahl Termin/Notfall', /Termin/.test(await pg.innerText('#dlgInhalt')) && /Notfall/.test(await pg.innerText('#dlgInhalt'))); await pg.click('#dlgKnoepfe button[data-txt="Abbrechen"]').catch(() => {}); }
      else ok('Krankheits-Brief hat den Knopf „Tierarzt rufen“', false, 'kein bf-ta'); }
    else L.push('– (kein Krankheits-Brief im Postfach, Prüfung übersprungen)');
    /* 9. Termin-Befund „muss operiert werden“ kommt als Brief mit Knöpfen */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); const A = spiel.boxen[0].pferd; A.befunde = []; const bf = befundNeu(A, 'kolik', 5, 'Test'); bf.bemerkt = { von: 'du', tag: spiel.tag };
      vetTerminMachen(A, spiel.tag + 1); spiel.tag += 1; vetTerminTag(aktivHid()); zu(); const p = (spiel.post || []).find(q => q.aktion && q.aktion.typ === 'opNoetig'); return { br: p && p.id, text: p ? p.text.replace(/<[^>]+>/g, ' ') : '' }; });
    ok('Termin findet schwere Kolik: Brief „muss operiert werden“', !!r.br && /Ohne Operation/.test(r.text) && /tragen Sie|trägst du/.test(r.text), JSON.stringify(r).slice(0, 300));
    if (r.br) { await pg.evaluate(() => zeigeHof('post')); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); } await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(300); await bild('T6-op');
      await pg.click('[data-baktion="op-ja"]'); await pg.waitForTimeout(300);
      r = await pg.evaluate(() => ({ k: spiel.boxen[0].pferd.klinik })); ok('Knopf „In die Klinik“: Pferd zur Kolik-OP', r.k && r.k.op === 'kolik', JSON.stringify(r)); }
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
