// Auftrag 25 Block 2 (20.11.2026): Stellenanzeige Teil 2 – neue Berufe (Pferderennen, Spezialreitweisen, Fütterungsberater, Physiotherapeut, Hofhelfer),
// Probetag (50 €, echte Arbeit am Tag, Bericht), Teilzeit/Minijob (40/20/10 Stunden, Gehalt und Kapazität anteilig), Wissen in der Probezeit als Wörter.
// Start (im Repo-Ordner): NODE_PATH=<playwright> node tests/stellenanzeige2-test.js [Bilder-Ordner] [BxH]   ·   MOTOR=1 prüft den Motor
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
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.admin = false; spiel.geld = 50000; spiel.mitarbeiter = []; spiel.stallarten = ['renn']; spiel.tempo = 7;
      for (let i = 0; i < 4; i++) { const P = neuesPferd({ rasse: 'vollblut', geschlecht: 'Wallach', alter: 6, name: 'V' + i }); P.pflege = erzeugePflege(P); werteErgaenzen(P); P.pflege.impf = spiel.tag; spiel.boxen[i].pferd = P; spiel.boxen[i].tot = false; } });
    /* Fragen: je 6 Fachfragen mit Tipp und gültigem Bereich für die 4 neuen Berufe */
    let r = await pg.evaluate(() => ['renntrainer', 'westerntrainer', 'futterexperte', 'physio'].map(t => { const G = GESPRAECH[t] || []; return [t, G.length, G.every(q => q.length === 3 && q[0].endsWith('?') && q[1].length > 20 && (/^eig:/.test(q[2]) || WISSEN.some(w => w[0] === q[2]))), STELLE_TYPEN.includes(t)]; }).concat([['hofhelfer', (GESPRAECH.hofhelfer || []).length, true, STELLE_TYPEN.includes('hofhelfer')]]));
    ok('4 neue Berufe mit je 6 Fachfragen (Tipp + Wissensbereich), Hofhelfer ohne Fachfragen', r.slice(0, 4).every(x => x[1] === 6 && x[2] && x[3]) && r[4][1] === 0 && r[4][3], JSON.stringify(r));
    /* Pferdewirt Pferderennen im Rennstall: Anzeige mit echten Klicks */
    await pg.evaluate(() => mitarbeiterDialog('renntrainer')); await pg.waitForTimeout(300);
    ok('Rennstall: Pferdewirt Pferderennen hat den Knopf „Stellenanzeige aufgeben“', await pg.isVisible('#stelleNeu'), (await pg.innerText('#dlgInhalt')).slice(0, 200));
    await pg.click('#stelleNeu'); await pg.waitForTimeout(250); await bild('B1-anzeige');
    ok('Anzeige-Fenster zeigt die Stellenart (Vollzeit, Teilzeit, Minijob)', (await pg.$$('[name="stArt"]')).length === 3);
    await pg.check('[name="stMed"][value="online"]'); await pg.click('#dlgKnoepfe button[data-txt="Anzeige aufgeben"]'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => { spiel.tag = spiel.stellen[0].ab; let n = 0; for (let i = 0; i < 6 && !n; i++) { stellenTag(); n = Object.keys(spiel.bewerbungen || {}).length; if (!n) { spiel.stellen = []; stelleAufgeben('renntrainer', 'zeitungGross', 'mehr'); spiel.tag = spiel.stellen[0].ab; } }
      const p = (spiel.post || []).find(x => x.aktion && x.aktion.typ === 'bewerbung'); return { n, br: p && p.id, bid: p && p.aktion.bid }; });
    ok(`Bewerbungen als Pferdewirt Pferderennen kommen (${r.n})`, r.n >= 1 && !!r.br, JSON.stringify(r));
    const bid = r.bid;
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeHof('post'); }); await pg.waitForTimeout(300);
    await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(400); await pg.click('[data-baktion="bw-gespraech"]'); await pg.waitForTimeout(250);
    const fr = await pg.$$eval('[data-gsf]', x => x.map(c => c.parentElement.innerText.trim())); await bild('B2-fragen');
    ok(`Gespräch: 2 Fragen für alle + 6 Fachfragen (${fr.length}), u. a. Startmaschine`, fr.length === 8 && fr.some(t => /Startmaschine/.test(t)), fr.join(' | '));
    for (const i of [2, 3, 5]) await pg.check(`[data-gsf="${i}"]`);
    await pg.click('#dlgKnoepfe button[data-txt="Fragen stellen"]'); await pg.waitForTimeout(250); await bild('B3-ergebnis');
    const g0 = await pg.evaluate(() => spiel.geld);
    ok('Ergebnis zeigt den Knopf „Probetag · 50 €“', await pg.isVisible('#dlgKnoepfe button[data-txt^="🧹 Probetag"]'), await pg.innerText('#dlgKnoepfe'));
    await pg.click('#dlgKnoepfe button[data-txt^="🧹 Probetag"]'); await pg.waitForTimeout(300); await bild('B4-probetag');
    r = await pg.evaluate((bid) => ({ geld: spiel.geld, probe: spiel.bewerbungen[bid].probe, tag: spiel.tag, kal: kalTermine(jzJetzt()).concat(kalTermine(jzJetzt() + 1)).filter(t => /Probetag/.test(t.text)).length }), bid);
    ok('Probetag gebucht: 50 € abgebucht, Termin morgen, steht im Kalender', g0 - r.geld === 50 && r.probe && r.probe.tag === r.tag + 1 && r.kal === 1, JSON.stringify(r));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
    /* Nacht: am Morgen ist der Bewerber da und arbeitet wirklich mit (Renntraining) */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; spiel.boxen.slice(0, 4).forEach(bx => { fuetternAusLager(bx, 'du'); bx.krippeVoll = true; bx.wasserTag = spiel.tag; }); naechsteNacht(); zu();
      const pt = (spiel.mitarbeiter || []).filter(m => m.probetag); return { n: pt.length, da: pt[0] && maDa(pt[0]), titel: pt[0] && maTitel(pt[0]), train: spiel.boxen.slice(0, 4).filter(bx => bx.pferd.trainHeute && bx.pferd.trainHeute.tag === spiel.tag).length, liste: (() => { mitarbeiterDialog('renntrainer'); const t = document.getElementById('dlgInhalt').innerText; zu(); return /Angestellt/.test(t); })() }; });
    ok(`am Probetag ist der Bewerber als Mitarbeiter da („${r.titel}“) und arbeitet mit (${r.train} Pferde trainiert), steht aber nicht unter „Angestellt“`, r.n === 1 && r.da && /Probetag/.test(r.titel) && r.train >= 1 && !r.liste, JSON.stringify(r));
    /* nächste Nacht: Bericht per Brief, Probearbeiter wieder weg, kein Lohn */
    r = await pg.evaluate((bid) => { const zu = () => { document.getElementById('dlg').hidden = true; }; const g = spiel.geld; spiel.boxen.slice(0, 4).forEach(bx => { fuetternAusLager(bx, 'du'); bx.krippeVoll = true; bx.wasserTag = spiel.tag; }); naechsteNacht(); zu();
      const p = (spiel.post || []).find(x => /^Probetag:/.test(x.betreff)); return { n: (spiel.mitarbeiter || []).filter(m => m.probetag).length, br: p && p.id, text: p ? p.text.replace(/<[^>]+>/g, ' ') : '', bericht: spiel.bewerbungen[bid].probe.bericht, status: spiel.bewerbungen[bid].status }; }, bid);
    ok('nach dem Probetag: Bericht per Brief (Arbeit + Eindruck in Worten, keine Zahlen), Probearbeiter ist wieder weg', r.n === 0 && !!r.br && /Pferde? trainiert/.test(r.text) && /können Sie|kannst du/.test(r.text) && /Eindruck|Umgang/.test(r.text) && !/\b\d{2,3}\s*(%|Punkte)/.test(r.text) && r.status === 'neu', JSON.stringify(r).slice(0, 500));
    /* Bericht-Brief öffnen → „Entscheiden“ → Einstellen */
    await pg.evaluate(() => zeigeHof('post')); await pg.waitForTimeout(300); if (await pg.$('#briefZurueck')) { await pg.click('#briefZurueck'); await pg.waitForTimeout(300); }   /* der zuletzt gelesene Brief ist noch offen */ await pg.click(`[data-brief="${r.br}"]`); await pg.waitForTimeout(400); await bild('B5-bericht');
    ok('Brief zum Probetag hat den Knopf „Entscheiden“', /Entscheiden/.test(await pg.innerText('[data-baktion="bw-gespraech"]')));
    await pg.click('[data-baktion="bw-gespraech"]'); await pg.waitForTimeout(250); await bild('B6-entscheiden');
    const et = await pg.innerText('#dlgInhalt');
    ok('Entscheidung zeigt Antworten und Probetag-Bericht, kein zweiter Probetag', /Probetag/.test(et) && /trainiert/.test(et) && !(await pg.$('#dlgKnoepfe button[data-txt^="🧹 Probetag"]')), et.slice(0, 300));
    await (await pg.$('#dlgKnoepfe button[data-txt^="Einstellen"]')).click(); await pg.waitForTimeout(250);
    r = await pg.evaluate(() => ({ ma: spiel.mitarbeiter.map(m => [m.typ, m.ab, m.probe, m.stunden || 40]), jz: jzJetzt() }));
    ok('eingestellt als Pferdewirt Pferderennen (Vollzeit, nächste Jahreszeit, Probezeit)', r.ma.length === 1 && r.ma[0][0] === 'renntrainer' && r.ma[0][1] === r.jz + 1 && r.ma[0][3] === 40, JSON.stringify(r));
    /* Probezeit: Wissen als Wörter, danach als Zahlen */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; const m = spiel.mitarbeiter[0]; m.ab = jzJetzt(); m.probe = jzJetzt() + 2; mitarbeiterDialog('renntrainer'); const a = [...document.querySelector('.ma-karte').querySelectorAll('.ma-wissen > span > small')].map(x => x.textContent); zu();
      m.probe = jzJetzt(); mitarbeiterDialog('renntrainer'); const c = [...document.querySelector('.ma-karte').querySelectorAll('.ma-wissen > span > small')].map(x => x.textContent); zu(); return { a, c }; });
    ok('in der Probezeit steht das Wissen in Worten, danach als Zahl', r.a.length >= 5 && r.a.every(t => !/\d/.test(t)) && r.c.every(t => /^\d+$/.test(t)), JSON.stringify(r));
    /* Minijob und Teilzeit: Gehalt und Kapazität anteilig */
    await pg.evaluate(() => { spiel.mitarbeiter = []; spiel.bewerbungen = {}; spiel.stellen = []; mitarbeiterDialog('stallbursche'); }); await pg.waitForTimeout(250);
    await pg.click('#stelleNeu'); await pg.waitForTimeout(250); await pg.check('[name="stArt"][value="mini"]'); await pg.check('[name="stMed"][value="zeitungGross"]'); await bild('B7-minijob');
    await pg.click('#dlgKnoepfe button[data-txt="Anzeige aufgeben"]'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button').catch(() => {});
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); const S = spiel.stellen[0]; spiel.tag = S.ab; stellenTag(); const B = Object.values(spiel.bewerbungen), x = B[0] && B[0].x, p = (spiel.post || []).find(q => q.aktion && q.aktion.typ === 'bewerbung' && spiel.bewerbungen[q.aktion.bid] === B[0]);
      if (!x) return { n: 0 }; const neu = stelleEinstellen('stallbursche', x, x.gehalt); neu.ab = jzJetzt(); neu.probe = jzJetzt();
      const voll = { id: 'v', typ: 'stallbursche', name: 'Voll', wissen: {}, eig: [], ab: jzJetzt() }, teil = { ...voll, id: 't', stunden: 20 };
      mitarbeiterDialog('stallbursche'); const txt = document.getElementById('dlgInhalt').innerText, fb = !!document.querySelector('[data-lgma]'); zu();
      return { n: B.length, art: S.art, std: x.stunden, gehalt: x.gehalt, soll: MA_TYP.stallbursche.gehalt, betreff: p && p.betreff, kMini: maKapazitaet({ ...neu, eig: [] }), kTeil: maKapazitaet(teil), kVoll: maKapazitaet(voll), titel: maTitel(neu), txt: /Minijob/.test(txt), fb }; });
    ok(`Minijob: Bewerber mit 10 Stunden, Gehalt etwa ein Viertel (${r.gehalt} € statt ${r.soll} €), Brief nennt die Stellenart`, r.n >= 1 && r.art === 'mini' && r.std === 10 && r.gehalt >= r.soll * 0.18 && r.gehalt <= r.soll * 0.4 && /Minijob/.test(r.betreff || ''), JSON.stringify(r));
    ok(`Kapazität anteilig: Vollzeit ${r.kVoll}, Teilzeit ${r.kTeil}, Minijob ${r.kMini} Boxen`, r.kVoll === 3 && r.kTeil === 2 && r.kMini === 1, JSON.stringify(r));
    ok('Mitarbeiterliste zeigt „(Minijob)“, Minijobber ohne Fortbildungs-Knopf', /Minijob/.test(r.titel) && r.txt && !r.fb, JSON.stringify(r));
    /* Hofhelfer: nur die 2 Fragen für alle, beide genügen */
    r = await pg.evaluate(() => { spiel.mitarbeiter = []; spiel.bewerbungen = {}; spiel.stellen = []; stelleAufgeben('hofhelfer', 'zeitungGross', 'mehr'); spiel.tag = spiel.stellen[0].ab; stellenTag(); const e = Object.entries(spiel.bewerbungen)[0]; if (e) gespraechDialog(e[0]); return { bid: e && e[0], art: spiel.stellen[0] && spiel.stellen[0].art }; });
    await pg.waitForTimeout(250);
    const nH = await pg.$$eval('[data-gsf]', x => x.length); await bild('B8-hofhelfer');
    if (nH === 2) { await pg.check('[data-gsf="0"]'); await pg.check('[data-gsf="1"]'); await pg.click('#dlgKnoepfe button[data-txt="Fragen stellen"]'); await pg.waitForTimeout(250); }
    ok('Hofhelfer: nur 2 Fragen, Gespräch geht mit beiden weiter; keine Teilzeit-Wahl (keine Boxen)', nH === 2 && /Gehaltswunsch/.test(await pg.innerText('#dlgInhalt')) && r.art === 'voll', JSON.stringify(r) + ' ' + nH);
    /* Freischalt-Stufe 1: keine Teilzeit-Wahl; alter Spielstand (Mitarbeiter ohne stunden) = Vollzeit */
    r = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.stufenAn = true; spiel.frei = { punkte: 0, stufe: 1 }; stelleDialog('stallbursche', () => {}); const s1 = document.querySelectorAll('[name="stArt"]').length; zu();
      spiel.frei = { punkte: 150, stufe: 2 }; stelleDialog('stallbursche', () => {}); const s2 = document.querySelectorAll('[name="stArt"]').length; zu(); spiel.stufenAn = false;
      return { s1, s2, alt: maTitel({ typ: 'pfleger', name: 'Alt' }), kAlt: maKapazitaet({ id: 'a', typ: 'pfleger', name: 'Alt', wissen: {}, eig: [], ab: jzJetzt() }) }; });
    ok('Teilzeit/Minijob erst ab Freischalt-Stufe 2; alte Mitarbeiter sind Vollzeit', r.s1 === 0 && r.s2 === 3 && r.alt === 'Pferdepfleger' && r.kAlt === 3, JSON.stringify(r));
    ok('keine Seitenfehler', !errs.length, errs.join(' | '));
  } catch (e) { ok('Ablauf', false, e.message.split('\n')[0]); await bild('FEHLER'); }
  console.log(L.join('\n')); await b.close(); process.exit(L.some(x => x.startsWith('✗')) ? 1 : 0);
})();
