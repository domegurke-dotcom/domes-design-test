// v960 (Dome 8.11.): Raritäten-Markt – Gegenbieter (vorher bot nie jemand mit: max 0) und Gebotsregler (nicht mehr bis 4× Wert, genaue Eingabe)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e9; VET.verbotAb = 99; spiel.admin = true;
    // Raritäten-Markt öffnen (Sommer)
    spiel.kal = null; spiel.tag = 1; while (datum().s !== 1) spiel.tag++; spiel.rar = { mj: datum().j, karte: true, vor: {}, wahl: {}, auk: {}, weg: [] }; rarCache = null; const L = rarAngebot();
    ok('Raritäten da', L.length >= 20, L.length);
    // Gegenbieter: Spieler bietet nur 10 % über dem Preis
    let mit = 0, n = 0, maxNull = 0; const start = spiel.tag;
    L.forEach(h => { const a = rarAuktion(h); a.gebot = h.preis; a.gebote = 1; a.duMax = Math.ceil(h.preis * 1.1 / 50) * 50; a.fuehrt = 'du'; a.duGeboten = true; a.endeTag = spiel.tag + tpj(); a.hid = aktivHid(); });
    for (let i = 0; i < tpj(); i++) auktionsNacht();
    L.forEach(h => { const a = rarAuktion(h); n++; if (a.gebote > 1 || a.fuehrt === 'npc') mit++; if (!a.max) maxNull++; });
    const anteil = mit / n; ok('Alle Raritäten-Auktionen haben ein Höchstgebot der anderen Bieter (vorher 0)', maxNull === 0, maxNull + ' von ' + n);
    ok('Bei Gebot +10 % bieten in 70–95 % der Auktionen andere mit (' + Math.round(anteil * 100) + ' %)', anteil >= 0.7 && anteil <= 0.95, anteil);
    // alter Spielstand: max 0 und maxV 2 wird repariert
    const h0 = L[0]; const a0 = rarAuktion(h0); a0.max = 0; a0.maxV = 2; a0.gebot = h0.preis; a0.gebote = 1; a0.duMax = h0.preis; a0.fuehrt = 'du'; a0.vorbei = false; auktionsNacht(); ok('Alte Auktion mit max 0 bekommt ein Limit', a0.max > 0, a0.max);
    // Regler
    const h1 = L[1]; const a1 = rarAuktion(h1); a1.gebot = h1.preis; a1.gebote = 0; a1.fuehrt = null; a1.duMax = 0; a1.duGeboten = false; a1.vorbei = false; delete a1.endeTag; bieten(a1);
    const rg = document.getElementById('gebotRegler'), zh = document.getElementById('gebotZahl'), neu = +rg.min, st = bietSchritt(a1);
    ok('Regler reicht höchstens 150 % des Werts über das Mindestgebot (Wert ' + h1.preis + ')', +rg.max <= neu + 30 * st && +rg.max > neu, rg.min + ' – ' + rg.max);
    ok('Regler hat feine Schritte (höchstens 150 Stufen)', (+rg.max - neu) / +rg.step <= 160, rg.step);
    ok('Feld zum genauen Eintippen da', !!zh && +zh.min === neu && +zh.max === +rg.max);
    zh.value = String(neu + 1234); zh.dispatchEvent(new Event('change')); ok('Eintippen rundet auf 50 € und setzt Anzeige und Feld', +zh.value === neu + 1250 && document.getElementById('gebotWert').textContent.replace(/[^0-9]/g, '') === String(neu + 1250), zh.value + ' / ' + document.getElementById('gebotWert').textContent);
    zh.value = String(neu * 20); zh.dispatchEvent(new Event('change')); ok('Zu hohe Eingabe wird auf das Maximum gekappt', +rg.value === +rg.max && +zh.value === +rg.max, rg.value + ' / ' + zh.value);
    zh.value = String(neu + 500); zh.dispatchEvent(new Event('change')); [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Bieten/.test(x.textContent)).click();
    ok('Bieten übernimmt genau den eingegebenen Betrag als Höchstgebot', a1.duMax === neu + 500 && a1.fuehrt === 'du' && a1.gebot === neu, a1.duMax + ' / ' + (neu + 500));
    // Brief „Überboten“: Erneut bieten auch in der nächsten Jahreszeit (Auktion läuft noch)
    { const h = L[2], a = rarAuktion(h); a.vorbei = false; a.jz = jzJetzt() - 1; a.endeTag = spiel.tag + 3; a.duGeboten = true; a.fuehrt = 'npc'; a.gebot = h.preis + 500; a.mj = spiel.rar.mj;
      const html = briefAktionHTML({ id: 'bx', aktion: { typ: 'bieten', pferd: h.id } }); ok('Überboten-Brief einer laufenden Raritäten-Auktion hat „Erneut bieten“ (auch nach Wechsel der Jahreszeit)', /Erneut bieten/.test(html), html);
      a.endeTag = spiel.tag - 1; ok('Abgelaufene Auktion: kein Knopf', !/Erneut bieten/.test(briefAktionHTML({ id: 'bx', aktion: { typ: 'bieten', pferd: h.id } }))); a.endeTag = spiel.tag + 3; }
    // Filter nach Seltenheit zusammen mit dem Kontinent-Filter
    document.getElementById('dlg').hidden = true; spiel.rar.karte = true; spiel.sortKont = false; spiel.sortRar = false; zeigeSchirm(null); zeigeMarkt('raritaeten');
    const sicht = () => [...document.querySelectorAll('#nebenSchirm [data-rarstufe]')].filter(c => c.style.display !== 'none');
    const alle = sicht().length, seg = document.querySelector('[data-rarseg]'); ok('Seltenheits-Filter da (Alle + Stufen)', !!seg && seg.querySelectorAll('button').length >= 2, seg && seg.textContent);
    const stufen = [...new Set(sicht().map(c => c.dataset.rarstufe))]; const s0 = stufen[0], erwartet = sicht().filter(c => c.dataset.rarstufe === s0).length;
    document.querySelector('[data-rarseg] [data-rar="' + s0 + '"]').click(); ok('Stufe wählen zeigt nur diese Stufe (' + erwartet + ' von ' + alle + ')', sicht().length === erwartet && sicht().every(c => c.dataset.rarstufe === s0), sicht().length);
    const asien = [...document.querySelectorAll('[data-sortseg] [data-sort]')].find(x => x.dataset.sort === 'Asien');
    if (asien) { asien.click(); const s = sicht(); ok('Zusammen mit Kontinent Asien: nur Asien und diese Stufe', s.every(c => kontinentVon(c.dataset.rasse) === 'Asien' && c.dataset.rarstufe === s0), s.length); }
    document.querySelector('[data-rarseg] [data-rar=""]').click(); const nurAsien = sicht(); ok('Alle Seltenheiten: wieder alle Stufen' + (asien ? ' (Asien bleibt)' : ''), (asien ? nurAsien.length === [...document.querySelectorAll('#nebenSchirm [data-rarstufe]')].filter(c => kontinentVon(c.dataset.rasse) === 'Asien').length && nurAsien.length > 0 : nurAsien.length === alle), nurAsien.length);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
