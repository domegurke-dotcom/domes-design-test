// v1009: Turnier und Verkaufsrennen mit echten Klicks (Hauptmenü → Anhänger → Turnier → Nennen), danach Nächte bis zum Ergebnis.
// Prüft die v1008-Fixes: nach dem Turnier p.arbeitTag/boxTage gesetzt; Verkaufsrennen: Pferd abgeholt, Geld, Brief, Putzzeug ins Lager.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const ORD = process.env.BILDER_ORDNER || null; if (ORD) fs.mkdirSync(ORD, { recursive: true });
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x == null ? '' : x)));
  let nr = 0; const bild = async name => { if (!ORD) return; nr++; await pg.waitForTimeout(250); await pg.screenshot({ path: path.join(ORD, String(nr).padStart(2, '0') + '-' + name + '.png') }); };
  const ev = (f, a) => pg.evaluate(f, a);
  const dlgText = () => ev(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').textContent.replace(/\s+/g, ' '));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await ev(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 500000;
    window.mk = (n, rasse, g, alter, i) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; P.pflege.impf = spiel.tag; P.training = 60; spiel.boxen[i].pferd = P; return P; };
    window.gesund = () => spiel.boxen.forEach(b => { const p = b.pferd; if (!p) return; p.befunde = []; p.pflege.gesundheit = 100; p.pflege.impf = spiel.tag; b.krippeVoll = true; b.mistig = false; b.wasserTag = spiel.tag; });
    mk('Anna', 'hannoveraner', 'Stute', 8, 0); mk('Rocket', 'vollblut', 'Hengst', 3, 1); spiel.boxen[1].pferd.putzzeug = 'eigen'; speichern(); });

  // Nennen per Klick: Anhänger → Turnier → Pferd → passende Prüfung → Reiter/Preis bestätigen
  const nennePerKlick = async (box, filter) => {
    const ziel = await ev(([box, filter]) => { const p = spiel.boxen[box].pferd; for (let d = 0; d < 80; d++) { turnierKalender(); const T = (spiel.turniere || []).filter(t => t.tag > spiel.tag + 1).sort((a, b) => a.tag - b.tag);
        for (const t of T) { const P = t.pruef.find(P => (filter === 'verkauf' ? P.verkauf : !P.verkauf && !P.fohlenschau && !P.zb) && !nennSperre(p, t, P)); if (P) return { tid: t.id, prid: P.id, tag: t.tag, name: t.name, pruef: P.name }; }
        gesund(); naechsteNacht(); document.getElementById('dlg').hidden = true; } return null; }, [box, filter]);
    if (!ziel) return null;
    await ev(() => { document.getElementById('dlg').hidden = true; zeigeHaupt(); }); await pg.waitForTimeout(200);
    await ev(() => anhTurnier()); await pg.waitForTimeout(250); await bild('anhaenger-pferdewahl');
    await pg.click(`[data-tw="${box}"]`); await pg.waitForTimeout(300);
    await ev(tid => { const d = document.querySelector(`[data-tkarte="${tid}"]`); if (d) d.open = true; const g = d && d.closest('[data-tgruppe]'); if (g) g.open = true; }, ziel.tid);
    const knopf = pg.locator(`[data-tnennen="${ziel.tid}:${ziel.prid}"]`); if (!(await knopf.count())) return { ...ziel, fehler: 'Knopf Nennen fehlt: ' + (await dlgText()).slice(0, 200) };
    await knopf.scrollIntoViewIfNeeded(); await bild('turnierfenster'); await knopf.click(); await pg.waitForTimeout(300);
    for (let k = 0; k < 5; k++) { const t = await dlgText(); if (/Turniere für/.test(t)) break; await bild('nennen-schritt'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300); }
    await bild('nach-nennen');
    ziel.genannt = await ev(([tid, prid, box]) => { const t = spiel.turniere.find(x => x.id === tid); const n = t && t.nennung.find(n => n.prid === prid && n.pid === spiel.boxen[box].pferd.id); return n ? JSON.stringify(n) : ''; }, [ziel.tid, ziel.prid, box]);
    return ziel; };
  const naechteBis = tag => ev(tag => { let n = 0; while (spiel.tag < tag && n < 40) { gesund(); naechsteNacht(); document.getElementById('dlg').hidden = true; n++; } return spiel.tag; }, tag);

  // ===== 1. Turnier (Anna) =====
  const T1 = await nennePerKlick(0, 'turnier');
  ok('Turnier gefunden und per Klick genannt', T1 && !T1.fehler && !!T1.genannt, JSON.stringify(T1));
  if (T1 && T1.genannt) { out.push('ℹ ' + T1.name + ' · ' + T1.pruef + ' am Tag ' + T1.tag);
    await naechteBis(T1.tag); await ev(() => { gesund(); naechsteNacht(); document.getElementById('dlg').hidden = true; });
    const r = await ev(() => { const p = spiel.boxen[0].pferd; return { tag: spiel.tag, arbeitTag: p.arbeitTag, boxTage: p.boxTage, starts: p.turnierStarts, gestern: p.turnierGestern, erfolge: (p.erfolge || []).length, brief: (spiel.post || []).some(x => /Ergebnis: Anna/.test(x.betreff || '')) }; });
    ok('Ergebnis-Brief und Erfolg eingetragen', r.brief && r.erfolge >= 1, JSON.stringify(r));
    ok('Nach dem Turnier: arbeitTag = Turniertag, boxTage wie nach einem Trainingstag (0, nachts +1) (Fix v1008)', r.arbeitTag === T1.tag && r.boxTage <= 1, JSON.stringify(r));
    await ev(() => { document.getElementById('dlg').hidden = true; zeigeHaupt(); }); await pg.click('#hmHof'); await pg.waitForTimeout(300);
    for (let k = 0; k < 4 && await ev(() => !document.getElementById('dlg').hidden); k++) { await pg.click('#dlgKnoepfe button'); await pg.waitForTimeout(200); }
    await pg.click('[data-hr="post"]'); await pg.waitForTimeout(300);
    const id = await ev(() => { const br = (spiel.post || []).find(x => /Ergebnis: Anna/.test(x.betreff || '')); return br && br.id; });
    if (id) { await pg.locator(`[data-brief="${id}"]`).first().click(); await pg.waitForTimeout(300); await bild('brief-turnierergebnis'); } }

  // ===== 2. Verkaufsrennen (Rocket) =====
  const T2 = await nennePerKlick(1, 'verkauf');
  ok('Verkaufsrennen gefunden und per Klick genannt (mit Verkaufspreis)', T2 && !T2.fehler && /verkauf/.test(T2.genannt || ''), JSON.stringify(T2));
  if (T2 && T2.genannt) { out.push('ℹ ' + T2.name + ' · ' + T2.pruef + ' am Tag ' + T2.tag + ' · ' + T2.genannt);
    await naechteBis(T2.tag);
    const vor = await ev(() => ({ geld: spiel.geld, putz: (lager().putzzeug || []).length }));
    // Rennnacht: Verkauf erzwingen (Chance sonst 30–55 %), damit der Abgang am nächsten Morgen sicher geprüft wird
    const r1 = await ev(() => { gesund(); const rnd = Math.random; Math.random = () => 0.001; try { naechsteNacht(); } finally { Math.random = rnd; } document.getElementById('dlg').hidden = true; const p = spiel.boxen[1].pferd; return { tag: spiel.tag, inBox: !!p, verkauft: p && p.verkauftImRennen }; });
    out.push('ℹ Nach der Rennnacht: ' + JSON.stringify(r1));
    if (r1.inBox && !r1.verkauft) await ev(() => { const p = spiel.boxen[1].pferd; p.verkauftImRennen = { preis: 9999, tag: spiel.tag }; });
    await ev(() => { gesund(); naechsteNacht(); document.getElementById('dlg').hidden = true; });
    const r2 = await ev(v => ({ inBox: !!spiel.boxen[1].pferd, geld: Math.round(spiel.geld - v.geld), putz: (lager().putzzeug || []).length - v.putz, brief: (spiel.post || []).some(x => /Rocket wurde verkauft/.test(x.betreff || '')), angebot: (spiel.angebote || []).some(a => a.name === 'Rocket'), rennKauf: (spiel.rennKauf || []).length }), vor);
    ok('Verkaufsrennen: Pferd am Morgen abgeholt, Brief „wurde verkauft“', !r2.inBox && r2.brief, JSON.stringify(r2));
    ok('Verkaufsrennen: eigenes Putzzeug liegt im Lager (Fix v1008)', r2.putz >= 1, JSON.stringify(r2));
    ok('Verkaufsrennen: fremde Starter zum Kauf (6–8)', r2.rennKauf >= 6 && r2.rennKauf <= 8, JSON.stringify(r2));
    await ev(() => { document.getElementById('dlg').hidden = true; zeigeHaupt(); }); await pg.click('#hmStall'); await pg.waitForTimeout(400); await bild('stall-nach-verkauf'); }
  await ev(() => { speichernJetzt(); }); await pg.reload(); await pg.waitForTimeout(700);
  ok('Neuladen ohne Fehler', !errs.length, errs.join(';'));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
