// Dome (v355): Boxenansichten je Stufe (1 alt/Holz/Sand, 2 Kalkstein/Pflaster, 3 edel/Beton) – erzeugt aus den abgestimmten Entwürfen
(function () {
const L = y => 60 - (y - 212) * 60 / 54, R = y => 340 + (y - 212) * 60 / 54;   // Bodenkanten (Perspektive)
const BODEN = '0,300 0,266 60,212 340,212 400,266 400,300';
const clip = (id, inner) => `<clipPath id="${id}"><polygon points="${BODEN}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
// Kopfsteinpflaster in Perspektive: Reihen werden nach vorn höher, Steine gleich viele je Reihe
function pflaster() { let s = `<rect x="-40" y="212" width="480" height="90" fill="#6f6b66"/>`, y = 212, h = 3.2, r = 0;
  while (y < 302) { const y2 = y + h, n = 15, off = r % 2 ? 0.5 : 0;
    for (let j = -1; j <= n; j++) { const a = (j + off) / n, b = (j + 1 + off) / n, g = 0.08;
      const x1 = L(y) + (R(y) - L(y)) * (a + g / n), x2 = L(y) + (R(y) - L(y)) * (b - g / n), x3 = L(y2) + (R(y2) - L(y2)) * (b - g / n), x4 = L(y2) + (R(y2) - L(y2)) * (a + g / n);
      const c = ['#a9a59e', '#9e9a93', '#b3afa8', '#a3a099'][(j + r * 3 + 16) % 4], gy = h * 0.12;
      s += `<path d="M${x1.toFixed(1)},${(y + gy).toFixed(1)} L${x2.toFixed(1)},${(y + gy).toFixed(1)} L${x3.toFixed(1)},${(y2 - gy).toFixed(1)} L${x4.toFixed(1)},${(y2 - gy).toFixed(1)} Z" fill="${c}" stroke="#5f5b56" stroke-width="${(0.25 + h * 0.05).toFixed(2)}" stroke-linejoin="round"/>`; }
    y = y2; h *= 1.22; r++; }
  return clip('pflClip', s); }
function beton() { let s = `<rect x="-40" y="212" width="480" height="90" fill="#bdbcb8"/>`;
  [0.25, 0.5, 0.75].forEach(f => s += `<line x1="${60 + 280 * f}" y1="212" x2="${L(300) + (R(300) - L(300)) * f}" y2="300" stroke="#a6a5a0" stroke-width=".8"/>`);
  [230, 258].forEach(y => s += `<line x1="${L(y)}" y1="${y}" x2="${R(y)}" y2="${y}" stroke="#a6a5a0" stroke-width=".8"/>`);
  s += `<ellipse cx="200" cy="262" rx="130" ry="16" fill="#fff" opacity=".14"/><g fill="#adaca7"><circle cx="120" cy="240" r=".7"/><circle cx="250" cy="275" r=".7"/><circle cx="300" cy="230" r=".6"/><circle cx="160" cy="285" r=".7"/></g>`;
  return clip('betClip', s); }
function gummi() { let s = `<rect x="-40" y="212" width="480" height="90" fill="#2f2f31"/>`;
  [0.25, 0.5, 0.75].forEach(f => s += `<line x1="${60 + 280 * f}" y1="212" x2="${L(300) + (R(300) - L(300)) * f}" y2="300" stroke="#18181a" stroke-width="1.2"/>`);
  [226, 250, 282].forEach(y => s += `<line x1="${L(y)}" y1="${y}" x2="${R(y)}" y2="${y}" stroke="#18181a" stroke-width="1.2"/>`);
  for (let y = 216; y < 300; y += 5 + (y - 212) * 0.06) for (let k = 0; k < 24; k++) { const x = L(y) + (R(y) - L(y)) * (k + 0.5) / 24; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.35 + (y - 212) * 0.008).toFixed(2)}" fill="#47474a"/>`; }
  return clip('gumClip', s); }
function sand() { return clip('sandClip', `<rect x="-40" y="212" width="480" height="90" fill="#dcc18c"/><g fill="#c9aa6e"><ellipse cx="110" cy="240" rx="18" ry="3"/><ellipse cx="260" cy="230" rx="24" ry="3.5"/><ellipse cx="320" cy="270" rx="20" ry="3"/><ellipse cx="80" cy="280" rx="22" ry="3"/></g><g fill="#b8955a"><circle cx="150" cy="250" r="1.2"/><circle cx="210" cy="270" r="1"/><circle cx="300" cy="245" r="1.1"/><circle cx="90" cy="226" r="1"/><circle cx="240" cy="288" r="1.2"/></g>`); }
const LECK = (x, y, edel) => `<g class="sLeck"><path d="M${x + 7},${y} v-6" stroke="${edel ? '#c9a24a' : '#6d757e'}" stroke-width="1.4"/><rect x="${x - 1}" y="${y - 1}" width="16" height="4" rx="1" fill="${edel ? '#c9a24a' : '#7d858f'}" stroke="#2b1d14" stroke-width=".8"/><rect x="${x}" y="${y + 2}" width="14" height="12" rx="2" fill="#ece6da" stroke="#2b1d14" stroke-width="1"/><path d="M${x + 3},${y + 5} q4,3 8,0" fill="none" stroke="#d6cdbb" stroke-width="1"/></g>`;
const STROH = `<polygon points="${BODEN}" fill="url(#stroh)" stroke="#2b1d14" stroke-width="1.2"/>`;
// Fenster
const fenster = (wand, bank) => `${wand ? `<rect x="143" y="156" width="114" height="56" fill="${wand}"/>` : ""}<rect x="146" y="153" width="108" height="7" rx="1.5" fill="${bank}" stroke="#2b1d14" stroke-width="1.2"/>`;
const rahmen = (f, W = [152, 88, 248, 154]) => `<g fill="${f}" stroke="#2b1d14" stroke-width="1.4"><rect x="${W[0] - 8}" y="${W[1] - 4}" width="9" height="${W[3] - W[1] + 4}"/><rect x="${W[2] - 1}" y="${W[1] - 4}" width="9" height="${W[3] - W[1] + 4}"/><rect x="${W[0] - 12}" y="${W[1] - 12}" width="${W[2] - W[0] + 24}" height="10"/></g><rect x="${W[0] - 6}" y="${W[3] - 1}" width="${W[2] - W[0] + 12}" height="7" rx="1.5" fill="${f}" stroke="#2b1d14" stroke-width="1.2"/>`;
const W1 = [164, 96, 236, 150], W3 = [140, 80, 260, 158];
// Stufe 1
const bretter = (x0, x1, y0, y1, seed) => { let s = '', x = x0, i = 0; while (x < x1) { const w = 13 + ((i * 7 + seed) % 5), c = ['#9a7046', '#8b6239', '#a57a4c', '#7f5934'][(i + seed) % 4], k = ((i * 3 + seed) % 5) - 2;
  s += `<path d="M${x},${y0 + k} L${x + w},${y0 - k} L${x + w + k * .4},${y1} L${x - k * .3},${y1} Z" fill="${c}" stroke="#3a2614" stroke-width=".9"/>`; if (i % 3 === 0) s += `<circle cx="${x + w / 2}" cy="${y0 + 30 + (i * 13) % 60}" r="1.6" fill="#5a3d24"/>`; x += w; i++; } return s; };
const quer = sd => { const n = 6; let s = ''; const yT = sd === 'L' ? [158, 152] : [158, 152];
  for (let k = 0; k < n; k++) { const f0 = k / n, f1 = (k + 1) / n, kr = ((k * 5) % 3 - 1) * 1;
    const yo = (a, b, f) => a + (b - a) * f;
    const P = sd === 'L' ? [[0, yo(158, 266, f0) + kr], [60, yo(152, 212, f0)], [60, yo(152, 212, f1)], [0, yo(158, 266, f1) + kr]] : [[400, yo(158, 266, f0) + kr], [340, yo(152, 212, f0)], [340, yo(152, 212, f1)], [400, yo(158, 266, f1) + kr]];
    s += `<path d="M${P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L')} Z" fill="${['#8b6239', '#9a7046', '#7f5934', '#a57a4c'][k % 4]}" stroke="#3a2614" stroke-width=".9"/>`; }
  const oben = sd === 'L' ? '0,50 60,50 60,152 0,158' : '400,50 340,50 340,152 400,158', unten = sd === 'L' ? '60,212 60,152 0,158 0,266' : '340,212 340,152 400,158 400,266';
  let nb = ''; for (let i = 0; i < 6; i++) { const x0 = sd === 'L' ? i * 10 : 340 + i * 10; nb += `<rect x="${x0}" y="50" width="10" height="110" fill="${['#8b6239', '#9a7046', '#7f5934'][i % 3]}" stroke="#3a2614" stroke-width=".8"/>`; }
  return `<clipPath id="qo${sd}"><polygon points="${oben}"/></clipPath><g clip-path="url(#qo${sd})">${nb}<polygon points="${oben}" fill="#1a0f05" opacity=".55"/></g>
    <clipPath id="qu${sd}"><polygon points="${unten}"/></clipPath><g clip-path="url(#qu${sd})">${s}<polygon points="${unten}" fill="#2b1a0c" opacity=".15"/></g>
    <line x1="${sd === 'L' ? 60 : 340}" y1="152" x2="${sd === 'L' ? 0 : 400}" y2="158" stroke="#6b4a2c" stroke-width="4" stroke-linecap="round"/><line x1="${sd === 'L' ? 60 : 340}" y1="152" x2="${sd === 'L' ? 0 : 400}" y2="158" stroke="#9a7046" stroke-width="1.5"/>`; };
const nachbarHolz = x => `<g><rect x="${x}" y="0" width="260" height="300" fill="#3a2a1c"/>${bretter(x, x + 260, 16, 300, 3)}<rect x="${x}" y="0" width="260" height="16" fill="#7a5534" stroke="#2b1d14" stroke-width="1.2"/>
  <rect x="${x}" y="16" width="260" height="128" fill="#2a1d12"/><g fill="#8b6239" stroke="#3a2614" stroke-width=".8">${Array.from({ length: 11 }, (_, i) => `<rect x="${x + 6 + i * 24}" y="16" width="6" height="128" transform="rotate(${(i % 3 - 1) * 1.2} ${x + 9 + i * 24} 80)"/>`).join('')}</g>
  <rect x="${x}" y="140" width="260" height="9" fill="#7a5534" stroke="#2b1d14" stroke-width="1.2"/><rect x="${x === -260 ? -10 : 400}" y="0" width="10" height="300" fill="#6a4a2c" stroke="#2b1d14" stroke-width="1.4"/></g>`;
const st1 = { wand: `<defs><clipPath id="wo1"><path d="M60,50 H340 V212 H60 Z M164,96 V150 H236 V96 Z" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#wo1)">${bretter(60, 340, 50, 212, 1)}</g>${rahmen('#8f6a45', W1)}`,
  boden: STROH, seiten: quer('L') + quer('R'), krippeWeg: true, traenkeWeg: true,
  vorn: `<defs><radialGradient id="dunkel1" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".45" stop-color="#1a0f05" stop-opacity=".18"/><stop offset="1" stop-color="#1a0f05" stop-opacity=".5"/></radialGradient></defs>
  <rect x="-10" y="0" width="420" height="300" fill="url(#dunkel1)" pointer-events="none"/>
  <path d="M200,100 L150,300 L250,300 Z" fill="#fff4cc" opacity=".12"/>
  ${LECK(306, 132)}

  <g fill="none" stroke="#f4f1ea" stroke-width=".6" opacity=".85"><path d="M61,55 L91.0,55.0"/><path d="M61,55 L88.8,66.2"/><path d="M61,55 L82.2,76.2"/><path d="M61,55 L72.2,82.8"/><path d="M61,55 L61.0,85.0"/><path d="M71.0,55.0 Q69.1,55.4 70.3,58.7 Q67.7,58.9 68.1,62.1 Q64.9,61.7 64.7,64.3 Q61.4,63.1 61.0,65.0"/><path d="M79.0,55.0 Q76.8,56.9 77.7,61.7 Q74.2,63.2 73.7,67.7 Q69.2,68.2 67.7,71.7 Q62.9,70.8 61.0,73.0"/><path d="M87.0,55.0 Q84.6,58.4 85.1,64.7 Q80.7,67.6 79.4,73.4 Q73.6,74.7 70.7,79.1 Q64.4,78.6 61.0,81.0"/></g><g><path d="M80,72 v6" stroke="#f4f1ea" stroke-width=".4"/><circle cx="80" cy="79.5" r="1.6" fill="#2b1d14"/></g>
  <g class="sKrippe" role="button" aria-label="Futtereimer" style="cursor:pointer"><rect x="62" y="222" width="50" height="46" fill="transparent"/><path d="M70,236 L104,236 L100,262 L74,262 Z" fill="#8a5a33" stroke="#2b1d14" stroke-width="1.2"/><ellipse cx="87" cy="236" rx="17" ry="4" fill="#3a2614" stroke="#2b1d14" stroke-width="1.1"/><ellipse class="sFutter" cx="87" cy="236" rx="16" ry="3.4" fill="#c49a5a"/><path d="M72,244 h30 M73,253 h28" stroke="#5a3d24" stroke-width="1"/></g>
  <g class="sWasser" role="button" aria-label="Wassereimer" style="cursor:pointer"><rect x="294" y="220" width="46" height="46" fill="transparent"/><path d="M300,234 L334,234 L330,262 L304,262 Z" fill="#7d858f" stroke="#2b1d14" stroke-width="1.2"/><ellipse cx="317" cy="234" rx="17" ry="4" fill="#4a5058" stroke="#2b1d14" stroke-width="1.1"/><g class="sWasserVoll"><ellipse cx="317" cy="234" rx="16" ry="3.4" fill="#5fa8d3"/><ellipse cx="312" cy="233" rx="6" ry="1.2" fill="#bfe3f5"/></g><path d="M302,236 Q317,220 332,236" fill="none" stroke="#2b1d14" stroke-width="1"/></g>`,
  nachbar: nachbarHolz(-260) + nachbarHolz(400) };
const st2 = { vorn: `<defs><radialGradient id="dunkel2" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#1a0f05" stop-opacity=".08"/><stop offset="1" stop-color="#1a0f05" stop-opacity=".25"/></radialGradient></defs><rect x="-10" y="0" width="420" height="300" fill="url(#dunkel2)" pointer-events="none"/>`, wand: `${fenster('url(#kalkstein)', '#a98357')}${rahmen('#a98357')}${LECK(306, 132)}`, boden: STROH };
// Stufe 3
const lampe = x => `<path d="M${x},50 v10" stroke="#2b1d14" stroke-width="1"/><path d="M${x - 10},60 h20 l-4,8 h-12 z" fill="#2f2f33" stroke="#111" stroke-width="1"/><ellipse cx="${x}" cy="68" rx="6" ry="1.8" fill="#ffe9a8"/><path d="M${x},68 L${x - 24},110 L${x + 24},110 Z" fill="#fff6c8" opacity=".22"/>`;
const nachbarEdel = x => `<g><rect x="${x}" y="0" width="260" height="300" fill="#2a2420"/><rect x="${x}" y="0" width="260" height="16" fill="#4a3022" stroke="#2b1d14" stroke-width="1.2"/>
  <rect x="${x}" y="150" width="260" height="150" fill="#6a4630" stroke="#2b1d14" stroke-width="1.2"/>${Array.from({ length: 13 }, (_, i) => `<line x1="${x + i * 20}" y1="150" x2="${x + i * 20}" y2="300" stroke="#4a3022" stroke-width=".8"/>`).join('')}
  <g stroke="#1c1c1e" stroke-width="2.6">${Array.from({ length: 24 }, (_, i) => `<line x1="${x + 6 + i * 11}" y1="16" x2="${x + 6 + i * 11}" y2="146"/>`).join('')}</g><g fill="#c9a24a">${Array.from({ length: 24 }, (_, i) => `<circle cx="${x + 6 + i * 11}" cy="18" r="1.6"/>`).join('')}</g>
  <rect x="${x}" y="144" width="260" height="8" fill="#c9a24a" stroke="#7a5a1a" stroke-width="1"/><rect x="${x === -260 ? -10 : 400}" y="0" width="10" height="300" fill="#4a3022" stroke="#2b1d14" stroke-width="1.4"/></g>`;
const st3 = { wand: `<defs><clipPath id="w3"><path d="M60,50 H340 V212 H60 Z M140,80 V158 H260 V80 Z" clip-rule="evenodd"/></clipPath><linearGradient id="lack" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a3a24"/><stop offset=".5" stop-color="#7a5236"/><stop offset="1" stop-color="#5a3a24"/></linearGradient>
    <linearGradient id="edel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".45" stop-color="#c3c9cf"/><stop offset="1" stop-color="#8d959d"/></linearGradient></defs>
  <g clip-path="url(#w3)"><rect x="60" y="50" width="280" height="162" fill="#f2ede4"/><g stroke="#e0d8ca" stroke-width=".8">${Array.from({ length: 8 }, (_, i) => `<line x1="60" y1="${66 + i * 12}" x2="340" y2="${66 + i * 12}"/>`).join('')}</g>
    <rect x="60" y="150" width="280" height="62" fill="url(#lack)"/>${Array.from({ length: 14 }, (_, i) => `<line x1="${60 + i * 20}" y1="150" x2="${60 + i * 20}" y2="212" stroke="#3f2818" stroke-width=".8"/>`).join('')}<rect x="60" y="148" width="280" height="4" fill="#c9a24a" stroke="#7a5a1a" stroke-width=".6"/></g>
  ${rahmen('#5a3a24', W3)}<rect x="128" y="66" width="144" height="3" fill="#c9a24a"/><rect x="134" y="157" width="132" height="2.5" fill="#c9a24a"/>
    <g><rect x="318" y="58" width="16" height="10" rx="2" fill="#f4f4f4" stroke="#2b1d14" stroke-width="1"/><circle cx="322" cy="63" r="3" fill="#2f2f33"/><circle cx="322" cy="63" r="1.2" fill="#5fa8d3"/><circle cx="331" cy="61" r="1" fill="#e04040"/><path d="M326,58 v-6" stroke="#2b1d14" stroke-width="1"/></g>
    <g class="sHeunetz" role="button" aria-label="Heunetz – Heu füttern" style="cursor:pointer"><rect x="62" y="110" width="62" height="66" fill="transparent"/><path d="M82,124 v-6 M104,124 v-6" stroke="#c9a24a" stroke-width="1.6"/><path class="sHeu" d="M74,124 Q93,116 112,124 Q118,150 104,166 Q93,172 82,166 Q68,150 74,124 Z" fill="#e3c95e" stroke="#2b1d14" stroke-width="1.2"/>
      <clipPath id="netzClip"><path d="M74,124 Q93,116 112,124 Q118,150 104,166 Q93,172 82,166 Q68,150 74,124 Z"/></clipPath><g clip-path="url(#netzClip)" stroke="#3a2a1c" stroke-width=".8" fill="none" opacity=".75">${[0,1,2,3,4,5].map(i => `<path d="M${72 + i * 8},122 L${80 + i * 8 - 16},168"/><path d="M${72 + i * 8},122 L${64 + i * 8 + 16},168"/>`).join('')}</g><circle cx="93" cy="117" r="2.4" fill="none" stroke="#c9a24a" stroke-width="1.4"/></g>`,
  boden: STROH, krippeWeg: true, traenkeWeg: true, heuWeg: true, gross: true,
  nachbarWand: ['L', 'R'].map(sd => { const p = sd === 'L' ? '0,50 60,50 60,212 0,266' : '400,50 340,50 340,212 400,266'; return `<clipPath id="nw${sd}"><polygon points="${p}"/></clipPath><g clip-path="url(#nw${sd})"><rect x="${sd === 'L' ? 0 : 340}" y="50" width="60" height="220" fill="#f2ede4"/>${Array.from({ length: 8 }, (_, i) => `<line x1="${sd === 'L' ? 0 : 340}" y1="${66 + i * 12}" x2="${sd === 'L' ? 60 : 400}" y2="${66 + i * 12}" stroke="#e0d8ca" stroke-width=".8"/>`).join('')}<rect x="${sd === 'L' ? 0 : 340}" y="150" width="60" height="120" fill="#6a4630"/><polygon points="${p}" fill="#1a0f05" opacity=".5"/></g>`; }).join(''),
  seiten: ['L', 'R'].map(sd => { const p = sd === 'L' ? '60,212 60,152 0,158 0,266' : '340,212 340,152 400,158 400,266'; let l = ''; for (let i = 1; i < 6; i++) { const x = sd === 'L' ? 60 - i * 10 : 340 + i * 10, y0 = 152 + i, y1 = 212 + i * 9; l += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="#3f2818" stroke-width=".8"/>`; } return `<polygon points="${p}" fill="url(#lack)" stroke="#2b1d14" stroke-width="1.3"/>${l}`; }).join('') + `<line x1="60" y1="152" x2="0" y2="158" stroke="#c9a24a" stroke-width="2.5"/><line x1="340" y1="152" x2="400" y2="158" stroke="#c9a24a" stroke-width="2.5"/>`
    + `<g class="sKrippe" role="button" aria-label="Futterkrippe" style="cursor:pointer"><rect x="-2" y="140" width="82" height="60" fill="transparent"/><path d="M4,155.6 L54,150.6 L74,156.6 L24,161.6 Z" fill="#3f2818" stroke="#2b1d14" stroke-width="1.2"/>
      <path d="M10,155.4 L52,151.4 L66,156.2 L25,160.4 Z" fill="url(#edel)" stroke="#5f666d" stroke-width=".8"/><path class="sFutter" d="M14,155.3 L50,152 L62,155.9 L27,159.4 Z" fill="#c49a5a"/>
      <path d="M4,155.6 L24,161.6 L26,187.6 L5,181.6 Z" fill="#5a3a24" stroke="#2b1d14" stroke-width="1.3"/>
      <path d="M24,161.6 L74,156.6 L70,184.6 Q34,197.6 26,187.6 Z" fill="url(#lack)" stroke="#2b1d14" stroke-width="1.5"/>
      <g stroke="#3f2818" stroke-width=".8"><line x1="37" y1="160.4" x2="37" y2="191"/><line x1="50" y1="159.1" x2="50" y2="190"/><line x1="62" y1="157.9" x2="61" y2="187"/></g>
      <path d="M4,155.6 L24,161.6 L74,156.6" fill="none" stroke="#c9a24a" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M26,187.6 Q34,197.6 70,184.6" fill="none" stroke="#c9a24a" stroke-width="1.6"/>
      <g fill="#c9a24a" stroke="#7a5a1a" stroke-width=".5"><circle cx="28" cy="166" r="1.5"/><circle cx="69" cy="162" r="1.5"/><circle cx="29" cy="183" r="1.5"/><circle cx="68" cy="180" r="1.5"/></g></g>`,
  vorn: `    ${LECK(306, 132, true)}${lampe(100)}${lampe(300)}<rect x="266" y="98" width="48" height="20" rx="3" fill="#c9a24a" stroke="#7a5a1a" stroke-width="1"/><text x="290" y="112" font-size="8.5" text-anchor="middle" fill="#3a2a0a" font-family="Georgia, serif" font-weight="700" class="sName"></text>
    <g fill="#c9a24a" stroke="#7a5a1a" stroke-width=".6"><circle cx="57" cy="150" r="2.4"/><circle cx="343" cy="150" r="2.4"/><circle cx="60" cy="52" r="2.4"/><circle cx="340" cy="52" r="2.4"/></g>
    <g><rect x="364" y="150" width="20" height="10" rx="2" fill="#c9a24a" stroke="#7a5a1a" stroke-width="1"/><path d="M374,160 V236" stroke="#c9a24a" stroke-width="3.4"/><path d="M373,160 V236" stroke="#f2d98a" stroke-width="1"/>
      <path d="M342,166 h34 q0,15 -17,19 q-17,-4 -17,-19 z" fill="url(#edel)" stroke="#2b1d14" stroke-width="1.4"/><path d="M342,166 h34" stroke="#c9a24a" stroke-width="2.4"/><ellipse cx="359" cy="167" rx="15" ry="3.2" fill="#6fb6df" stroke="#2b1d14" stroke-width="1"/><ellipse cx="355" cy="166.4" rx="5" ry="1" fill="#e2f3fb"/></g>`,
  nachbar: nachbarEdel(-260) + nachbarEdel(400) };

window.BOXSTUFE = { 1: st1, 2: st2, 3: st3, boden: { sand: sand(), pflaster: pflaster(), beton: beton(), gummi: gummi() } };
})();
