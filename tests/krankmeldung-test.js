// Krankheitsmeldungen bei eigenen Pferden und Pensionspferden (Dome 25.10.: „teste Krankheitsmeldungen bei Pensionspferden und eigenen“)
// unbemerkt = nichts sichtbar · Mitarbeiter bemerkt → Brief mit Knöpfen, Denkblase/Plaketten/Tierarzt-Ampel/Klemmbrett in der Box · Pensionspferd: Besitzer informieren → Antwort am nächsten Morgen
// · Pferd auf dem Sandpaddock · Spieler bemerkt selbst beim Besuch · nach der Diagnose steht der Name auf der Plakette
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/krankmeldung-test.js [BxH] [Ordner]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number), ORD = process.argv[3];
(async () => { const b = await chromium.launch(); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c || x == null ? '' : ' – ' + JSON.stringify(x)));
  const pg = await b.newPage({ viewport: { width: W, height: H }, hasTouch: W < 1000, isMobile: W < 1000 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => localStorage.setItem('zuchtstall-boxfenster', '1'));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; VET.verbotAb = 99; spiel.stufenAn = false; spiel.geld = 50000;
    pensionRegeln().offen = true; pensionAnfrageNeu(); pensionAnnehmen(spiel.pensionAnfragen[0]); spiel.tag += 1; hofMorgen(); document.getElementById('dlg').hidden = true;
    const frei = spiel.boxen.find(x => !x.pferd && boxFrei(x)), p = neuesPferd({ rein: true, rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Flocke' }); p.pflege = erzeugePflege(p); frei.pferd = p;
    window.EIG = p; window.PEN = spiel.boxen.find(x => x.pferd && fremd(x.pferd)).pferd;
    spiel.mitarbeiter = [{ id: 'mpf', typ: 'pferdewirt', name: 'Paula', w: true, wissen: wissenStart(40, { krank: 60 }), eig: [], gehalt: 360, ab: jzJetzt() - 4, bis: null }].map(maErgaenzen);
    window.boxIdx = p => spiel.boxen.findIndex(x => x.pferd === p);
    window.zeig = p => { aktBox = boxIdx(p); spiel.aktBox = aktBox; bxFenster = null; bxRing = null; document.body.classList.remove('infoOffen'); document.getElementById('dlg').hidden = true; zeigeSchirm(null); zeigeStall(); zeigeTag(); };
    window.ui = () => ({ chips: [...document.querySelectorAll('.bxchip')].map(x => x.textContent), denk: (document.querySelector('.bxdenk') || {}).textContent || '', ta: ((document.querySelector('[data-bx="tierarzt"] .bxd') || {}).className || '').replace('bxd', '').trim(),
      gesund: (document.querySelector('#kopfRinge .kring, #bxUnten .bx-bal') || {}).textContent || '', kb: klemmbrettListe(B().pferd, B()).filter(x => !x[2]).map(x => x[1]) });
    window.neuBefund = (p, art, grad) => { const bf = befundNeu(p, art, grad, 'Test', null); delete bf.inkub; bf.angeschaut = spiel.tag; return bf; }; });   // angeschaut: beim Öffnen der Box bemerkst du es heute nicht mehr selbst
  const leise = fn => pg.evaluate(`(() => { const r = Math.random; Math.random = () => 0.01; try { return (${fn})(); } finally { Math.random = r; } })()`);
  for (const wer of ['EIG', 'PEN']) { const n = wer === 'EIG' ? 'Eigenes Pferd' : 'Pensionspferd';
    // 1. unbemerkt: nichts sichtbar
    await pg.evaluate(w => { window.BF = neuBefund(window[w], 'husten', 2); zeig(window[w]); }, wer); await pg.waitForTimeout(300);
    let z = await pg.evaluate(() => ui());
    ok(`${n}: unbemerkte Krankheit bleibt verborgen (keine Plakette, keine Denkblase, Tierarzt-Ampel nicht rot, nichts im Klemmbrett)`, !z.chips.some(c => /Befund|Besitzer informieren/.test(c)) && !z.denk && z.ta !== 'r' && !z.kb.some(k => /Krank/.test(k)), z);
    // 2. Mitarbeiterin bemerkt es morgens → Brief mit Knöpfen
    const np = await pg.evaluate(() => (spiel.post || []).length);
    z = await leise(`() => { befundeMorgen(); const p = window.${wer}, br = spiel.post.slice(0, spiel.post.length - ${np}).find(x => /ist auffällig/.test(x.betreff || '')); return { bemerkt: BF.bemerkt && BF.bemerkt.von, meld: BF.meldungen.length, brief: br && br.betreff, aktion: br && br.aktion && br.aktion.typ, html: br ? briefAktionHTML(br) : '' }; }`);
    ok(`${n}: Mitarbeiterin bemerkt den Husten und meldet es per Brief`, z.bemerkt === 'Paula' && z.meld === 1 && /Flocke|ist auffällig/.test(z.brief || '') && z.aktion === 'befund', z);
    ok(`${n}: Brief hat die Knöpfe „Zum Pferd“ und „Tierarzt rufen“`, /bf-box/.test(z.html) && /bf-ta/.test(z.html), z.html.slice(0, 200));
    ok(`${n}: Knopf „Besitzer informieren“ im Brief ${wer === 'PEN' ? 'vorhanden' : 'nicht vorhanden (eigenes Pferd)'}`, /bf-bes/.test(z.html) === (wer === 'PEN'), z.html.slice(0, 400));
    await pg.evaluate(w => zeig(window[w]), wer); await pg.waitForTimeout(300); z = await pg.evaluate(() => ui());
    ok(`${n}: in der Box Denkblase „Mir geht’s nicht gut“, Tierarzt-Ampel rot, Klemmbrett „Krank? …“`, /nicht gut/.test(z.denk) && z.ta === 'r' && z.kb.some(k => /Krank\?/.test(k)), z);
    if (wer === 'PEN') ok('Pensionspferd: Plakette „Besitzer informieren“', z.chips.some(c => /Besitzer informieren/.test(c)), z.chips);
    if (ORD) await pg.screenshot({ path: `${ORD}/krank-${wer}-${W}x${H}.png` });
    // 3. Pensionspferd: Besitzer informieren über die Plakette → Antwort am nächsten Morgen
    if (wer === 'PEN') {
      await pg.evaluate(() => { [...document.querySelectorAll('.bxchip')].find(c => /Besitzer informieren/.test(c.textContent)).click(); }); await pg.waitForTimeout(400);
      z = await pg.evaluate(() => ({ f: bxFenster, tab: bxTab, knopf: !!document.querySelector('#info [data-besvor]') }));
      ok('Plakette öffnet Versorgung · Gesundheit mit „Besitzer informieren“', z.f === 'versorgung' && z.tab === 'gesund' && z.knopf, z);
      await pg.click('#info [data-besvor]'); await pg.waitForTimeout(300);
      await pg.evaluate(() => { [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Tierarzt vorschlagen/.test(x.textContent)).click(); }); await pg.waitForTimeout(300);
      z = await pg.evaluate(() => ({ besV: BF.besV && BF.besV.w, chips: (bxFensterZu(), zeig(PEN), [...document.querySelectorAll('.bxchip')].map(x => x.textContent)) }));
      ok('Besitzer informiert: Plakette „Besitzer informieren“ verschwindet', z.besV === 'tierarzt' && !z.chips.some(c => /Besitzer informieren/.test(c)), z);
      const np2 = await pg.evaluate(() => (spiel.post || []).length);
      z = await leise(`() => { spiel.tag += 1; besitzerVorschlagTag(); const neu = spiel.post.slice(0, spiel.post.length - ${np2}); return { entscheid: BF.besV.entscheid, briefe: neu.map(x => x.von + ': ' + x.betreff) }; }`);
      ok('Am nächsten Morgen antwortet der Besitzer per Brief', !!z.entscheid && z.briefe.length >= 1, z);
    }
    // 4. nach der Diagnose: Name auf der Plakette
    z = await pg.evaluate(w => { const p = window[w], bx = spiel.boxen[boxIdx(p)]; tierarztBesuch(p, bx, null, fremd(p) ? eName(einstellerVon(p)) : undefined); document.getElementById('dlg').hidden = true; zeig(p); return { diag: !!BF.diagnose, ...ui() }; }, wer);
    ok(`${n}: nach dem Tierarzt steht „Befund: Husten“ auf der Plakette (keine Denkblase mehr nötig)`, z.diag && z.chips.some(c => /Befund: Husten/.test(c)), z);
    await pg.evaluate(w => { const p = window[w]; p.befunde = []; p.befundAlt = []; }, wer);
  }
  // 5. Pferd auf dem Sandpaddock: Mitarbeiterin bemerkt es, Plakette in der Box statt Denkblase
  await pg.evaluate(() => { if (!gebaeude().some(g => g.gid === 'gPdK')) gebaeude().push({ gid: 'gPdK', typ: 'sandpaddock', stufe: 2, zustand: 100 }); const g = paddocks().find(x => x.gid === 'gPdK'), bx = spiel.boxen[boxIdx(EIG)];
    rausAusBox(bx); EIG.paddock = { seit: spiel.tag, pid: g.gid }; EIG.paddockZuletzt = spiel.tag; window.BF = neuBefund(EIG, 'strahlfaeule', 2); });
  const np3 = await pg.evaluate(() => (spiel.post || []).length);
  let z = await leise(`() => { befundeMorgen(); zeig(EIG); const br = spiel.post.slice(0, spiel.post.length - ${np3}).find(x => /ist auffällig/.test(x.betreff || '')); return { bemerkt: BF.bemerkt && BF.bemerkt.von, text: br ? br.text : '' }; }`);
  await pg.waitForTimeout(300); z = { ...z, ...(await pg.evaluate(() => ({ ...ui(), denkImBild: (() => { const d = document.querySelector('.bxdenk'), s = document.getElementById('stall'); if (!d) return false; const a = d.getBoundingClientRect(), q = s.getBoundingClientRect(); return a.top >= q.top - 2 && a.bottom <= q.bottom + 2; })() }))) };
  ok('Sandpaddock: Krankheit wird bemerkt, der Brief nennt den Ort („auf … Sandpaddock, Box …“)', z.bemerkt === 'Paula' && /\(auf [^)]*, Box \d+\)/.test(z.text), z.text.slice(0, 200));
  ok('Sandpaddock: Denkblase „Mir geht’s nicht gut“ auch draußen im Bild, Tierarzt-Ampel rot', /nicht gut/.test(z.denk) && z.denkImBild && z.ta === 'r', z);
  if (ORD) await pg.screenshot({ path: `${ORD}/krank-sandpaddock-${W}x${H}.png` });
  // 6. Spieler bemerkt selbst beim Besuch (Sprechblase)
  z = await leise(`() => { EIG.befunde = []; delete EIG.paddock; zurueckInBox(spiel.boxen[boxIdx(EIG)]); window.BF = neuBefund(EIG, 'husten', 3); delete BF.angeschaut; zeig(EIG); anzeichenBeimBesuch(spiel.boxen[boxIdx(EIG)]); return { von: BF.bemerkt && BF.bemerkt.von }; }`);
  ok('Beim Besuch in der Box bemerkst du es selbst (Sprechblase), danach Denkblase', z.von === 'du', z);
  ok('keine Skriptfehler', !errs.length, errs);
  console.log(`Krankheitsmeldungen ${W}x${H}`); out.forEach(x => console.log(x)); const f = out.filter(x => x.startsWith('✗')).length; console.log(f ? `${f} ✗` : `alle ${out.length} ✓`);
  await b.close(); process.exit(f ? 1 : 0); })();
