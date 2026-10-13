// Gemeinsame Helfer: Farben aus dem Theme, Klang, Symbole und kleine DOM-Werkzeuge.
import { store } from './store.js';

export const TAU = Math.PI * 2;
export const pad2 = v => String(v).padStart(2, '0');
export const fmt = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${pad2(s % 60)}`; };
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
export const FONT = '"Barlow Condensed","Arial Narrow","Roboto Condensed",sans-serif';

// HTML sicher in Vorlagen einsetzen
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Farben aus den CSS-Variablen ----------
export const C = {};
const TOKENS = ['tile', 'tile-lock', 'ink', 'muted', 'line', 'wire', 'live', 'live-hot', 'glow', 'lamp', 'filament', 'on-live', 'plate',
  'paper', 'grid', 'c-l1', 'c-l2', 'c-l3', 'c-n', 'c-pe', 'c-pe2', 'c-dead', 'edge', 'pick', 'ok', 'bad', 'bg', 'roof', 'roof-2', 'module', 'module-line', 'soil'];
const themeHooks = new Set();
export function onTheme(fn) { themeHooks.add(fn); return () => themeHooks.delete(fn); }
export function readColors() {
  const cs = getComputedStyle(document.documentElement);
  for (const k of TOKENS) C[k] = cs.getPropertyValue('--' + k).trim();
  themeHooks.forEach(f => f());
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);
new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });

export const hexA = (hex, a) => {
  let h = (hex || '#000').replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const v = parseInt(h.slice(0, 6), 16) || 0;
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
};

let announceTimer = 0;
export function announce(msg) {
  const box = document.getElementById('status');
  if (!box) return;
  clearTimeout(announceTimer);
  box.textContent = '';
  announceTimer = setTimeout(() => { box.textContent = msg; }, 60);
}

export const boltsSVG = k => [0, 1, 2].map(j =>
  `<svg viewBox="0 0 24 24" class="bolt${j < k ? ' on' : ''}" aria-hidden="true"><path d="M13.5 2 4.5 13.6h6.3L9.8 22l9.7-12.3h-6.4z"/></svg>`).join('');

// ---------- Symbole (Strichzeichnungen) ----------
const P = {
  bolt: '<path d="M13.5 2 4.5 13.6h6.3L9.8 22l9.7-12.3h-6.4z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  book: '<path d="M4 5h6.5v14H4zM13.5 5H20v14h-6.5z"/>',
  tool: '<path d="M14.5 6.5l3-3 3 3-3 3M14.5 6.5L5 16l3 3 9.5-9.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  path: '<path d="M6 20c0-4 5-4 6-8s6-4 6-8"/><circle cx="6" cy="20" r="1.6"/><circle cx="18" cy="4" r="1.6"/>',
  chart: '<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20c1.2-4 4-5.5 7.5-5.5s6.3 1.5 7.5 5.5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  card: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
  earth: '<path d="M12 3v7M6 10h12M8 14h8M10 18h4"/>',
  meter: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 7h8v4H8zM12 15v2"/>',
  cabinet: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 9h16M4 15h16M9 12h2"/>',
  grid: '<path d="M4 4h16v16H4zM4 12h16M12 4v16"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  refresh: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>'
};
export const icon = (name, size = 24, cls = '') =>
  `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[name] || ''}</svg>`;

// ---------- Kleiner Element-Baukasten ----------
export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Kurze Hinweise unten am Bildschirm
let toastTimer = 0;
export function toast(text, ms = 3200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

// ---------- Klang ----------
export const sfx = (() => {
  let ac = null;
  const audio = () => {
    if (!store.state.settings.sound) return null;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) { return null; }
  };
  const tone = (freq, dur, type, vol, when = 0) => {
    const a = audio(); if (!a) return;
    const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.03);
  };
  const noise = (dur, vol) => {
    const a = audio(); if (!a) return;
    const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = a.createBufferSource(), g = a.createGain();
    s.buffer = buf; g.gain.value = vol; s.connect(g); g.connect(a.destination); s.start();
  };
  const PENTA = [0, 2, 4, 7, 9];
  return {
    click() { tone(1800, 0.03, 'square', 0.018); tone(900, 0.05, 'triangle', 0.03); },
    lock() { tone(420, 0.07, 'triangle', 0.05); tone(300, 0.09, 'triangle', 0.04, 0.05); },
    thunk() { tone(130, 0.14, 'sine', 0.09); },
    tick() { tone(1500, 0.025, 'sine', 0.025); },
    wire() { tone(1100, 0.04, 'sine', 0.03); tone(1650, 0.05, 'sine', 0.02, 0.03); },
    place() { tone(520, 0.05, 'triangle', 0.05); tone(780, 0.06, 'triangle', 0.03, 0.04); },
    klack() { tone(2400, 0.02, 'square', 0.015); tone(650, 0.045, 'triangle', 0.045); },
    contactor() { tone(95, 0.12, 'sine', 0.1); tone(170, 0.08, 'square', 0.025); tone(2600, 0.02, 'square', 0.012, 0.012); },
    spark() { noise(0.28, 0.32); tone(55, 0.3, 'sawtooth', 0.04); },
    fail() { tone(220, 0.16, 'square', 0.03); tone(165, 0.26, 'square', 0.03, 0.14); },
    right() { tone(660, 0.12, 'sine', 0.06); tone(990, 0.18, 'sine', 0.05, 0.08); },
    wrong() { tone(196, 0.2, 'triangle', 0.07); },
    ping(k) {
      const semi = PENTA[k % 5] + 12 * Math.min(2, Math.floor(k / 5));
      const f = 523.25 * Math.pow(2, semi / 12);
      tone(f, 0.45, 'sine', 0.06); tone(f * 2, 0.25, 'sine', 0.015);
    },
    win() {
      tone(100, 1.4, 'triangle', 0.05);   // Netzbrummen: 100 Hz bei 50 Hz Wechselstrom
      [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => tone(f, 0.7, 'sine', 0.07, 0.15 + k * 0.11));
    }
  };
})();
