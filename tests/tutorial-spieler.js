// Tutorial-Spieler (v580, Dome 20.10.2026): spielt ein Tutorial wie ein Spieler – immer das angezeigte Ziel antippen (echte Mausklicks), Erklärblasen antippen, Fenster bedienen, wischen beim Putzen/Waschen.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/tutorial-spieler.js <Breite>x<Höhe> [Ordner für Bildschirmfotos | -] [anf|fort|exp]
// Ergebnis: „✓ … durchgespielt“ oder „✗ hängt in Kapitel …“ (Bildschirmfotos nur mit Ordner – nie im Projektordner speichern). Ein Lauf dauert 2–5 Minuten.
const { chromium } = require('playwright');
const [W, H] = (process.argv[2] || '390x844').split('x').map(Number), O = process.argv[3] && process.argv[3] !== '-' ? process.argv[3] : null, SET = process.argv[4] || 'anf', haenger = [];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.stack.slice(0,300)));
  await pg.goto('file://' + require('path').resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(300); await pg.fill('#chName', 'Test');
  if (SET === 'anf') await pg.click('#chTutorial'); else { await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.evaluate(s => { document.getElementById('dlg').hidden = true; tutorialStart({ name: 'Test', avatar: 'a1' }, 7, null, s); }, SET); }
  await pg.waitForTimeout(1500);
  const st = () => pg.evaluate(() => { const T = spiel.tutorial; if (!T) return { ende: true }; const z = blase && blase.sel ? hinweisZiel(blase.sel) : null, r = z && z.getBoundingClientRect();
    const sb = blase && document.getElementById('hinweisBlase'); const bb = sb && !sb.hidden ? sb.getBoundingClientRect() : null;
    return { kap: T.kap, schritt: T.schritt, tag: spiel.tag, heu: spiel.futter && spiel.futter.lager && spiel.futter.lager.heu, liefer: spiel.futter && (spiel.futter.liefer || []).length, k: blase && blase.k, titel: blase && HINWEISE[blase.k] && HINWEISE[blase.k][0], sel: blase && blase.sel, ziel: r ? [r.x + r.width / 2, r.y + r.height / 2].map(Math.round) : null, blase: bb ? [bb.x + 20, bb.y + 12].map(Math.round) : null,
      dlg: document.getElementById('dlg').hidden ? null : document.getElementById('dlgInhalt').textContent.slice(0, 90), knoepfe: [...document.querySelectorAll('#dlgKnoepfe button')].map(x => x.textContent),
      scrollH: document.scrollingElement.scrollHeight, scrollY: Math.round(scrollY), nebenScroll: (() => { const n = document.getElementById('nebenSchirm'); return n.classList.contains('offen') ? [n.scrollHeight, n.clientHeight] : null; })() }; });
  let alt = '', gleich = 0, nr = 0, ende = false;
  for (let i = 0; i < 400; i++) {
    const s = await st(); if (s.ende) break;
    if (s.dlg && /Tutorial (geschafft|beendet)/.test(s.dlg)) { ende = true; break; }
    if (!s.dlg && await pg.evaluate(() => spiel.tutorial && spiel.tutorial.geschafft === spiel.tutorial.kap && !document.getElementById('tutHaken').hidden)) { await pg.waitForTimeout(500); await pg.click('#tutHaken'); await pg.waitForTimeout(1200); continue; }   // grüner Haken beendet das Kapitel
    const key = JSON.stringify([s.kap, s.schritt, s.k, s.dlg]); if (key === alt) gleich++; else { gleich = 0; alt = key; nr++; if (process.env.LAUT) console.log(nr, JSON.stringify(s)); if (O) await pg.screenshot({ path: `${O}/${SET}-${W}-${String(nr).padStart(3, '0')}.png` }); }
    if (gleich > 9) { haenger.push(`Kapitel ${s.kap + 1} Schritt „${s.titel}“`); if (O) await pg.screenshot({ path: `${O}/${SET}-${W}-HAENGT-${s.kap}.png` }); await pg.click('#tutKapWeg').catch(() => {}); gleich = 0; await pg.waitForTimeout(1300); continue; }
    if (s.dlg && (await pg.evaluate(() => spiel.tutorial && spiel.tutorial.geschafft === spiel.tutorial.kap))) { await pg.evaluate(() => { const k = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Schließen|Abbrechen|Zurück/.test(x.textContent)); if (k) k.click(); else document.getElementById('dlg').hidden = true; }); await pg.waitForTimeout(600); continue; }
    if (s.dlg && s.ziel && s.blase) { await pg.mouse.click(s.ziel[0], s.ziel[1]); await pg.waitForTimeout(800); continue; }   // Schritt im Fenster
    if (s.dlg && s.blase && !s.ziel) { await pg.mouse.click(s.blase[0], s.blase[1]); await pg.waitForTimeout(800); continue; }   // Erklär-Schritt über einem Fenster: Blase antippen
    if (s.dlg) {   // Fenster: sinnvoller Knopf
      const wahl = await pg.evaluate(() => { const B = [...document.querySelectorAll('#dlgKnoepfe button')]; const pref = [/Weiter/, /Annehmen|annehmen/, /Einstellen|einstellen/, /Kaufen|kaufen|aufnehmen|Aufnehmen/, /Nennen|nennen/, /Bauen|In Auftrag|beauftragen/, /Tierarzt|Hausbesuch|rufen/, /Speichern|Speicherplatz 1/, /Ja/, /Bestellen|bestellen/, /OK|Verstanden|Schließen/];
        for (const re of pref) { const k = B.find(x => re.test(x.textContent) && !x.disabled); if (k) { k.click(); return k.textContent; } } if (B[0]) { B[0].click(); return B[0].textContent; } return null; });
      if (process.env.LAUT) console.log('   Fenster →', wahl); await pg.waitForTimeout(700); continue; }
    if (s.ziel && /Pferd umstellen/.test(s.titel || '')) {   // Ziehen: Pferd gedrückt halten und in eine freie Box ziehen
      const z = await pg.evaluate(() => { const L = [...document.querySelectorAll('.boxen-liste [data-zubox]')], q = L.find(e => spiel.boxen[+e.dataset.zubox].pferd); if (!q) return null; { const r0 = q.getBoundingClientRect(); if (r0.top < 60 || r0.bottom > innerHeight - 60) q.scrollIntoView({ block: 'center' }); }
        const im = e => { const r = e.getBoundingClientRect(); return r.top > 60 && r.bottom < innerHeight - 60; }, f = L.find(e => !spiel.boxen[+e.dataset.zubox].pferd && !spiel.boxen[+e.dataset.zubox].quar && im(e)); if (!f) return null; const a = q.getBoundingClientRect(), c = f.getBoundingClientRect(); return [a.x + a.width / 2, a.y + a.height / 2, c.x + c.width / 2, c.y + c.height / 2]; });
      if (z) { await pg.mouse.move(z[0], z[1]); await pg.mouse.down(); await pg.waitForTimeout(400); for (let k = 1; k <= 15; k++) await pg.mouse.move(z[0] + (z[2] - z[0]) * k / 15, z[1] + (z[3] - z[1]) * k / 15); await pg.waitForTimeout(200); await pg.mouse.up(); await pg.waitForTimeout(900); }
      continue; }
    if (s.ziel) { await pg.mouse.click(s.ziel[0], s.ziel[1]); await pg.waitForTimeout(800);
      if (process.env.LAUT && /^Heu$/.test(s.titel || '')) console.log('   Heu-Zustand', JSON.stringify(await pg.evaluate(() => ({ aktBox, boxen: spiel.boxen.filter(b => b.pferd).map(b => ({ p: b.pferd.name, kv: b.krippeVoll, weide: !!b.pferd.weide, klinik: !!b.pferd.klinik, stufe: boxenStufe(b) })), dlg: document.getElementById('dlg').hidden ? null : document.getElementById('dlgInhalt').textContent.slice(0, 90) }))));
      if (/Bürste|Kamm|Hufe|Abspritzen|Shampoo|Abspülen|Abtrocknen/.test(s.titel || '')) { for (let w = 0; w < 20; w++) { const y0 = await pg.evaluate(() => scrollY); await pg.waitForTimeout(250); if (y0 === await pg.evaluate(() => scrollY)) break; }   // Bild ruhig (smooth scroll beendet)
        const bx = await pg.evaluate(() => { const r = document.getElementById('pferdPlatz').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
        if (/Hufe/.test(s.titel)) for (let k = 0; k < 80; k++) { if (await pg.evaluate(() => spiel.boxen[0].pferd.ausgekratzt === spiel.tag)) break; const r = await pg.evaluate(() => { const e = document.getElementById('stall').getBoundingClientRect(); return [e.x, e.y, e.width, e.height]; });
          const cx = r[0] + r[2] / 2, cy = r[1] + r[3] * 0.5; await pg.mouse.move(cx - r[2] * 0.12, cy - r[3] * 0.2 + (k % 5) * r[3] * 0.08); await pg.mouse.down(); for (let x = -0.12; x <= 0.12; x += 0.02) await pg.mouse.move(cx + r[2] * x, cy - r[3] * 0.2 + (k % 5) * r[3] * 0.08 + x * 20); await pg.mouse.up(); }
        else for (let k = 0; k < (/Kamm/.test(s.titel) ? 36 : 18); k++) { if (/Hufe/.test(s.titel) && await pg.evaluate(() => spiel.boxen[0].pferd.ausgekratzt === spiel.tag)) break; const y = bx[1] + bx[3] * (/Kamm/.test(s.titel) ? 0.1 + (k % 12) * 0.07 : 0.25 + (k % 6) * 0.12); await pg.mouse.move(bx[0] + bx[2] * 0.15, y); await pg.mouse.down(); for (let x = 0.15; x <= 0.9; x += 0.02) await pg.mouse.move(bx[0] + bx[2] * x, y + (x * 10 % 7)); await pg.mouse.up(); }
        if (/Hufe/.test(s.titel)) await pg.evaluate(() => { document.querySelectorAll('[data-huf], .huf-ziel').forEach(h => h.dispatchEvent(new MouseEvent('click', { bubbles: true }))); });
        if (process.env.LAUT) console.log('   Wischen →', JSON.stringify(await pg.evaluate(() => ({ wisch: !!wisch, el: (() => { const r = document.getElementById('pferdPlatz').getBoundingClientRect(), e = document.elementFromPoint(r.x + r.width * 0.5, r.y + r.height * 0.5); return e && (e.id || e.tagName + '.' + (e.getAttribute('class') || '')) + ' erl=' + tutErlaubt(e); })(), gew: spiel.boxen[0].pferd.gewaschen, nass: spiel.boxen[0].pferd.nass, fell: spiel.boxen[0].pferd.dreck && spiel.boxen[0].pferd.dreck.fell, maehne: spiel.boxen[0].pferd.dreck && spiel.boxen[0].pferd.dreck.maehne, sy: Math.round(scrollY), pp: (() => { const r = document.getElementById('pferdPlatz').getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); })() }))));
        await pg.waitForTimeout(600); }
      continue; }
    if (s.blase) { await pg.mouse.click(s.blase[0], s.blase[1]); await pg.waitForTimeout(800); continue; }
    await pg.waitForTimeout(500);
  }
  console.log(`${ende && !haenger.length ? '✓' : '✗'} Tutorial ${SET} in ${W}×${H} ${ende ? 'bis zum Ende durchgespielt' : 'nicht bis zum Ende gekommen'}${haenger.length ? ' – hängt: ' + haenger.join(', ') : ''}`);
  console.log('Seitenfehler:', errs.join(' ; ') || 'keine'); await b.close(); })();
