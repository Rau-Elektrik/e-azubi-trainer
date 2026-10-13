// Fortschritt der Lernenden: XP, Tagesserie, erledigte Lektionen, Abzeichen und Einstellungen.
// Alles bleibt im Browser des Geräts (localStorage). Export und Import laufen über eine JSON-Datei.

const KEY = 'eazubi.v1';

const pad = v => String(v).padStart(2, '0');
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayShift = (key, n) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

const defaults = () => ({
  v: 1,
  xp: 0,
  days: {},
  streak: { count: 0, last: null },
  goal: 30,
  done: {},
  badges: {},
  stats: { lessons: 0, perfect: 0, practice: 0, tests: 0 },
  settings: { sound: true }
});

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) {
      const d = defaults();
      return Object.assign(d, s, { streak: Object.assign(d.streak, s.streak), stats: Object.assign(d.stats, s.stats), settings: Object.assign(d.settings, s.settings) });
    }
  } catch (e) { /* leer oder gesperrt: frisch beginnen */ }
  return defaults();
}

let state = load();
const subs = new Set();

export const store = {
  get state() { return state; },
  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* Speicher voll oder gesperrt */ }
    subs.forEach(fn => fn(state));
  },

  // XP gutschreiben und die Tagesserie fortführen
  addXP(n) {
    const t = dayKey();
    state.xp += n;
    state.days[t] = (state.days[t] || 0) + n;
    const last = state.streak.last;
    if (last !== t) {
      state.streak.count = last === dayShift(t, -1) ? state.streak.count + 1 : 1;
      state.streak.last = t;
    }
    store.save();
  },
  todayXP() { return state.days[dayKey()] || 0; },
  streakNow() {
    const t = dayKey(), last = state.streak.last;
    return last === t || last === dayShift(t, -1) ? state.streak.count : 0;
  },
  week() {
    const t = dayKey(), out = [];
    for (let i = 6; i >= 0; i--) { const k = dayShift(t, -i); out.push({ key: k, xp: state.days[k] || 0 }); }
    return out;
  },

  isDone(id) { return !!state.done[id]; },
  complete(id, info) {
    const prev = state.done[id] || {};
    state.done[id] = {
      at: dayKey(),
      best: Math.max(prev.best || 0, info.score || 0),
      stars: Math.max(prev.stars || 0, info.stars || 0),
      times: (prev.times || 0) + 1
    };
    store.save();
  },
  grantBadge(id) {
    if (state.badges[id]) return false;
    state.badges[id] = dayKey();
    store.save();
    return true;
  },
  setGoal(n) { state.goal = n; store.save(); },
  setSetting(k, v) { state.settings[k] = v; store.save(); },

  exportJSON() { return JSON.stringify(Object.assign({ app: 'e-azubi-trainer', exportiert: new Date().toISOString() }, state), null, 2); },
  importJSON(text) {
    const s = JSON.parse(text);
    if (!s || s.v !== 1 || typeof s.xp !== 'number' || typeof s.done !== 'object') throw new Error('Die Datei ist kein Fortschritt aus dem E-Azubi Trainer.');
    delete s.app; delete s.exportiert;
    const d = defaults();
    state = Object.assign(d, s, { streak: Object.assign(d.streak, s.streak), stats: Object.assign(d.stats, s.stats), settings: Object.assign(d.settings, s.settings) });
    store.save();
  },
  reset() { state = defaults(); store.save(); }
};
