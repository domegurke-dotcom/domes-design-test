// Kommentar-Falle (CLAUDE.md): ein // mitten in der Zeile verschluckt den Code danach. Gefunden 12.11.2026 beim Zucht-Rundgang:
// Totgeburt (Fohlen blieb lebend in der Box), Turnier-Arbeitstag, Verkaufsrennen-Zubehör, Raritäten-Genwahl.
// 1) Totgeburt entfernt das Fohlen wirklich  2) Wächter: kein bekanntes Muster von Code hinter einem Zeilenkommentar
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + x));
  // Wächter (ohne Browser): Code-Anweisungen hinter "// " in derselben Zeile
  const zeilen = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8').split('\n'), funde = [];
  zeilen.forEach((l, i) => { const k = l.indexOf('// '); if (k < 0) return; const vor = l.slice(0, k).trimEnd(); if (!/[;{)]$/.test(vor) || /https?:$/.test(vor)) return; const c = l.slice(k + 3);
    if (/(\b(if|for|const|let|return|delete)\b ?\(?[\w.!]+.*[;{]\s*$)|(\w+\([^)]*\);\s*\w)|(\}\);?\s*$)/.test(c) && /[;{}]\s*$/.test(c)) funde.push((i + 1) + ': ' + c.slice(0, 90));
    if (/\b(delete \w+\.\w+;|buchen\(|begraben\(|zubehoerInsLager\(|p\.arbeitTag = )/.test(c)) funde.push((i + 1) + ': ' + c.slice(0, 90)); });
  ok('Kein Code hinter einem Zeilenkommentar', funde.length === 0, funde.join(' | '));
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    const mk = (n, g, i, alter) => { const P = neuesPferd({ rasse: 'hannoveraner', geschlecht: g, alter, name: n }); P.anteile = { hannoveraner: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.pflege.gesundheit = 100; ahnenFuellen(P); nrVon(P); spiel.boxen[i].pferd = P; return P; };
    const M = mk('Mutti', 'Stute', 0, 7), V = mk('Vati', 'Hengst', 1, 8); M.traechtig = { vater: hengstKopie(V), seit: jzJetzt() - 4, geburt: jzJetzt() };
    const fh = (spiel.friedhof || []).length, alt = { ...GEBURT_TOT }; Object.keys(GEBURT_TOT).forEach(k => { GEBURT_TOT[k] = 1; });   /* Totgeburt erzwingen */
    let fehler = ''; try { jahreszeitBeginn(); } catch (e) { fehler = e.message; } finally { Object.assign(GEBURT_TOT, alt); } document.getElementById('dlg').hidden = true;
    const br = (spiel.post || []).find(x => /tot geboren|Totgeburt/.test(x.betreff || ''));
    return { fehler, fohlen: !!spiel.boxen[0].fohlen, grab: (spiel.friedhof || []).length - fh, brief: br && br.betreff, traechtig: !!M.traechtig };
  }).catch(e => ({ fehler: e.message }));
  out.push('ℹ ' + JSON.stringify(r));
  ok('Totgeburt: Brief und Fohlen nicht mehr in der Box (Grabstein)', !r.fehler && r.brief && !r.fohlen && r.grab === 1, JSON.stringify(r));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
