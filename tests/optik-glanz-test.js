// v688: Glanz nach dem Waschen, Staub auf dunklen Pferden, „wirkt lockerer“ farbig – Bilder mit Ordner
const { chromium } = require('playwright'); const path = require('path');
const ORD = process.argv[2];
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 700, height: 420 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    const S = (rasse, farbe, o) => zeichnePferd(rasse, farbe, { alterStufe: undefined, seed: 'x', geschlecht: 'Stute', ...o }).svg;
    const mit = S('hannoveraner', 'fuchs', { fellGlanz: 1 }), ohne = S('hannoveraner', 'fuchs', {});
    ok('Glanz zeichnet zusätzliche Lichtflächen', mit.length > ohne.length && /fg-/.test(mit) && !/fg-/.test(ohne));
    const dreckig = S('hannoveraner', 'fuchs', { fellGlanz: 1, dreck: 60 }); ok('Mit viel Dreck kein Glanz', !/fg-/.test(dreckig));
    const rappe = S('hannoveraner', 'rappe', { dreck: 60 }), fuchsD = S('hannoveraner', 'fuchs', { dreck: 60 });
    ok('Dreck auf dem Rappen: helle Staubfarbe (#c9ad82/#bb9e72)', /#c9ad82|#bb9e72/.test(rappe) && !/#c9ad82/.test(fuchsD));
    document.body.innerHTML = '<div style="display:flex;flex-wrap:wrap;background:#cfe8f5">' + [['Rappe sauber', 'rappe', {}], ['Rappe staubig', 'rappe', { dreck: 70 }], ['Fuchs glänzt', 'fuchs', { fellGlanz: 1 }], ['Rappe glänzt', 'rappe', { fellGlanz: 1 }]].map(([t, f, o], i) => `<div style="width:340px;height:200px;margin:4px"><b>${t}</b><svg viewBox="-150 -260 420 300" width="340" height="180">${zeichnePferd('hannoveraner', FARBEN[f] || 'fuchs', { alterStufe: undefined, seed: 'x' + i, geschlecht: 'Stute', ...o }).svg}</svg></div>`).join('') + '</div>';
    return out; });
  if (ORD) await pg.screenshot({ path: ORD + '/optik-glanz.png' });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
