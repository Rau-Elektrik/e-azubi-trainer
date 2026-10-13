// Praxis: PV-Module auf eine Süddachfläche planen und zu Strings verschalten. Maße in Metern.
// Spielregel: 30 cm Randabstand und 30 cm Abstand zu Dachdurchbrüchen. In echt legen Statik,
// Windlastzone und Montagesystem die Abstände fest (Rand- und Eckbereiche haben die größten Soglasten).
// Die Strings werden mit den Datenblattwerten bei Kälte (Leerlaufspannung) und Hitze (MPP-Spannung) geprüft.
import { sfx, esc, announce } from '../ui.js';

export const ROOF = {
  w: 10.0, h: 6.2, margin: 0.3, gap: 0.02,
  module: { a: 1.134, b: 1.722, wp: 430 },
  obstacles: [
    { name: 'Schornstein', x: 7.6, y: 0.8, w: 0.8, h: 0.8, clear: 0.3 },
    { name: 'Dachfenster', x: 1.1, y: 4.4, w: 0.8, h: 1.0, clear: 0.3 }
  ],
  shade: { x: 8.4, y: 0.3, w: 1.3, h: 1.6 },   // Nachmittagsschatten östlich vom Schornstein
  targetKWp: 8.0,
  yieldPerKWp: 950
};

// Beispiel-Datenblatt: Modul und Wechselrichter
export const PV_EL = {
  mod: { voc: 38.6, vmpp: 32.3, isc: 14.0, impp: 13.3, tkVoc: -0.27, tkVmpp: -0.30 },
  tCold: -10, tHot: 70,
  inv: { name: 'Wechselrichter 10 kW', trackers: 2, vmax: 1000, mppMin: 200, mppMax: 800, imax: 16 }
};
const E = PV_EL;
export const vocCold = n => n * E.mod.voc * (1 + E.mod.tkVoc / 100 * (E.tCold - 25));
export const vmppCold = n => n * E.mod.vmpp * (1 + E.mod.tkVmpp / 100 * (E.tCold - 25));
export const vmppHot = n => n * E.mod.vmpp * (1 + E.mod.tkVmpp / 100 * (E.tHot - 25));
const V = v => Math.round(v).toLocaleString('de-DE');
const C = t => `${String(t).replace('-', '−')} °C`;

// Warum ein String mit n Modulen nicht zum Wechselrichter passt (oder null)
export function stringIssue(n) {
  if (!n) return null;
  if (vocCold(n) > E.inv.vmax) return `Uoc bei ${C(E.tCold)} beträgt ${V(vocCold(n))} V und liegt über der maximalen DC-Spannung von ${V(E.inv.vmax)} V. Das zerstört den Wechselrichter.`;
  if (vmppCold(n) > E.inv.mppMax) return `Umpp bei ${C(E.tCold)} beträgt ${V(vmppCold(n))} V und liegt über ${V(E.inv.mppMax)} V. Der Wechselrichter verlässt den MPP-Bereich.`;
  if (vmppHot(n) < E.inv.mppMin) return `Umpp bei ${C(E.tHot)} beträgt nur ${V(vmppHot(n))} V und liegt unter ${V(E.inv.mppMin)} V. An heißen Tagen fällt der String aus dem MPP-Bereich.`;
  return null;
}
export const stringRange = () => {
  let lo = 1, hi = 1;
  while (stringIssue(lo) && lo < 60) lo++;
  hi = lo;
  while (!stringIssue(hi + 1) && hi < 60) hi++;
  return [lo, hi];
};

const overlap = (a, b, pad = 0) => a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;

// Prüft ein Modul gegen Dach, Hindernisse, Schatten und andere Module
export function moduleIssue(m, mods, roof = ROOF) {
  const mg = roof.margin;
  if (m.x < mg - 1e-6 || m.y < mg - 1e-6 || m.x + m.w > roof.w - mg + 1e-6 || m.y + m.h > roof.h - mg + 1e-6) return 'Randabstand von 30 cm nicht eingehalten.';
  for (const o of roof.obstacles) if (overlap(m, o, o.clear - 1e-6)) return `Zu nah am ${o.name}.`;
  if (overlap(m, roof.shade)) return 'Liegt im Schatten des Schornsteins.';
  for (const n of mods) if (n !== m && overlap(m, n, roof.gap - 1e-6)) return 'Überlappt ein anderes Modul.';
  return null;
}
export const kWp = (mods, roof = ROOF) => mods.length * roof.module.wp / 1000;

// Zwei Module liegen direkt nebeneinander oder übereinander (gemeinsame Kante)
export function neighbors(a, b) {
  const gx = Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w);
  const gy = Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h);
  const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return (gx >= -1e-6 && gx <= 0.06 && oy > 0.2) || (gy >= -1e-6 && gy <= 0.06 && ox > 0.2);
}

// Prüft die Verschaltung: strings = [[modulId, ...], ...] in Reihenfolge von Plus nach Minus
export function checkStrings(mods, strings) {
  const errs = [];
  const byId = new Map(mods.map(m => [m.id, m]));
  const used = strings.filter(s => s.length);
  const seen = new Map();
  used.forEach((s, k) => s.forEach(id => seen.set(id, (seen.get(id) || 0) + 1)));
  const free = mods.filter(m => !seen.has(m.id)).length;
  if (!used.length) return ['Verschalte die Module zu Strings (Schritt 2).'];
  if (free) errs.push(`${free} ${free === 1 ? 'Modul ist' : 'Module sind'} noch keinem String zugeordnet.`);
  if ([...seen.values()].some(v => v > 1)) errs.push('Ein Modul steckt in zwei Strings.');
  if (used.length > E.inv.trackers) errs.push(`Der Wechselrichter hat nur ${E.inv.trackers} MPP-Tracker. Plane höchstens ${E.inv.trackers} Strings.`);
  used.forEach((s, k) => {
    for (let i = 1; i < s.length; i++) {
      const a = byId.get(s[i - 1]), b = byId.get(s[i]);
      if (!a || !b || !neighbors(a, b)) { errs.push(`String ${k + 1}: Die Module ${i} und ${i + 1} liegen nicht nebeneinander.`); break; }
    }
    const bad = stringIssue(s.length);
    if (bad) errs.push(`String ${k + 1} mit ${s.length} Modulen: ${bad}`);
  });
  return errs;
}

const STRING_NAMES = ['String 1 · MPPT A', 'String 2 · MPPT B'];

export function mount(container, opts = {}) {
  const R = ROOF;
  const mods = [];
  const strings = [[], []];
  let nextId = 1, portrait = true, step = 1, active = 0, tries = 0, solved = false;
  const S = 34;  // Pixel je Meter im SVG
  const [smin, smax] = stringRange();
  container.innerHTML = `
    <div class="prax pv">
      <p class="prax-task">Belege die Süddachfläche mit mindestens ${R.targetKWp.toLocaleString('de-DE')} kWp und verschalte die Module zu Strings für den Wechselrichter. Halte 30 cm Randabstand und spare Schornstein, Dachfenster und Schatten aus.</p>
      <div class="pv-steps" role="group" aria-label="Arbeitsschritt">
        <button class="btn small" type="button" data-step="1" aria-pressed="true">1 · Module setzen</button>
        <button class="btn small" type="button" data-step="2" aria-pressed="false">2 · Strings verschalten</button>
      </div>
      <div class="pv-bar" data-for="1">
        <button class="btn small" type="button" data-act="orient" aria-pressed="true">Hochkant</button>
        <button class="btn small" type="button" data-act="clear">Dach leeren</button>
      </div>
      <div class="pv-bar" data-for="2" hidden>
        <button class="btn small pv-pick s0" type="button" data-string="0" aria-pressed="true">String 1</button>
        <button class="btn small pv-pick s1" type="button" data-string="1" aria-pressed="false">String 2</button>
        <button class="btn small" type="button" data-act="undo">Letztes Modul lösen</button>
        <button class="btn small ghost" type="button" data-act="unstring">String löschen</button>
      </div>
      <p class="pv-hint" aria-live="polite"></p>
      <svg class="pv-roof" viewBox="0 0 ${R.w * S} ${R.h * S}" role="img" aria-label="Süddachfläche 10 mal 6,2 Meter"></svg>
      <p class="pv-scale"><span>First</span><span>${R.w.toLocaleString('de-DE')} m × ${R.h.toLocaleString('de-DE')} m · Süd · 35°</span><span>Traufe unten</span></p>
      <div class="pv-stats">
        <div><span class="lbl">Module</span><b id="pv-n">0</b></div>
        <div><span class="lbl">Leistung</span><b id="pv-p">0 kWp</b></div>
        <div><span class="lbl">Ertrag</span><b id="pv-e">0 kWh</b></div>
      </div>
      <div class="pv-strings" aria-label="Strings"></div>
      <details class="pv-data">
        <summary>Datenblatt: Modul und Wechselrichter</summary>
        <table>
          <tr><th scope="row">Modul</th><td>${R.module.wp} Wp · Uoc ${E.mod.voc.toLocaleString('de-DE')} V · Umpp ${E.mod.vmpp.toLocaleString('de-DE')} V · Isc ${E.mod.isc.toLocaleString('de-DE')} A</td></tr>
          <tr><th scope="row">Temperaturkoeffizient</th><td>Uoc ${String(E.mod.tkVoc).replace('-', '−').replace('.', ',')}&nbsp;%/K · Umpp ${String(E.mod.tkVmpp).replace('-', '−').replace('.', ',')}&nbsp;%/K</td></tr>
          <tr><th scope="row">Auslegung</th><td>Kälte ${C(E.tCold)} für die höchste Spannung, Hitze ${C(E.tHot)} Zelltemperatur für die niedrigste</td></tr>
          <tr><th scope="row">Wechselrichter</th><td>max. ${V(E.inv.vmax)} V DC · MPP ${E.inv.mppMin}–${E.inv.mppMax} V · ${E.inv.trackers} MPP-Tracker · max. ${E.inv.imax} A je Tracker</td></tr>
          <tr><th scope="row">Daraus folgt</th><td>${smin} bis ${smax} Module je String</td></tr>
        </table>
      </details>
      <p class="pv-note">Ertrag als Faustwert: ${R.yieldPerKWp} kWh je kWp und Jahr bei Südausrichtung in Deutschland.</p>
      <div class="prax-actions"><button class="btn primary" type="button" data-act="check">Prüfen</button></div>
      <div class="prax-result" aria-live="polite"></div>
    </div>`;
  const root = container.querySelector('.pv');
  const svg = root.querySelector('.pv-roof'), result = root.querySelector('.prax-result');
  const hint = root.querySelector('.pv-hint');
  const byId = id => mods.find(m => m.id === id);
  const stringOf = id => strings.findIndex(s => s.includes(id));

  function setHint() {
    hint.textContent = step === 1
      ? 'Tippe auf das Dach, um ein Modul zu setzen. Tippe ein Modul an, um es zu entfernen.'
      : `Tippe die Module von ${STRING_NAMES[active].split(' · ')[0]} der Reihe nach an, vom Plus- zum Minus-Ende. Verbinden lassen sich nur direkte Nachbarn.`;
  }
  function draw() {
    let s = `<rect x="0" y="0" width="${R.w * S}" height="${R.h * S}" class="pv-tiles"/>`;
    s += `<rect x="${R.margin * S}" y="${R.margin * S}" width="${(R.w - 2 * R.margin) * S}" height="${(R.h - 2 * R.margin) * S}" class="pv-margin"/>`;
    s += `<rect x="${R.shade.x * S}" y="${R.shade.y * S}" width="${R.shade.w * S}" height="${R.shade.h * S}" class="pv-shade"/>`;
    for (const o of R.obstacles) s += `<rect x="${o.x * S}" y="${o.y * S}" width="${o.w * S}" height="${o.h * S}" class="${o.name === 'Schornstein' ? 'pv-chimney' : 'pv-window'}"/>`;
    mods.forEach(m => {
      const bad = moduleIssue(m, mods), k = stringOf(m.id);
      s += `<rect x="${m.x * S}" y="${m.y * S}" width="${m.w * S}" height="${m.h * S}" class="pv-mod${bad ? ' bad' : ''}${k >= 0 ? ' in s' + k : ''}" data-id="${m.id}"/>`;
    });
    // Strings: Leitung durch die Modulmitten, Plus am Anfang, Minus am Ende
    strings.forEach((str, k) => {
      if (!str.length) return;
      const pts = str.map(id => byId(id)).filter(Boolean).map(m => [(m.x + m.w / 2) * S, (m.y + m.h / 2) * S]);
      const line = pts.map(p => p.join(',')).join(' ');
      if (pts.length > 1) s += `<polyline points="${line}" class="pv-line-under"/><polyline points="${line}" class="pv-line s${k}"/>`;
      pts.forEach((p, i) => { if (i > 0 && i < pts.length - 1) s += `<circle cx="${p[0]}" cy="${p[1]}" r="3" class="pv-node s${k}"/>`; });
      const badge = (p, t) => `<g class="pv-badge s${k}"><circle cx="${p[0]}" cy="${p[1]}" r="9"/><text x="${p[0]}" y="${p[1] + 4}">${t}</text></g>`;
      s += badge(pts[0], '+');
      if (pts.length > 1) s += badge(pts[pts.length - 1], '−');
    });
    svg.innerHTML = s;
    const p = kWp(mods);
    root.querySelector('#pv-n').textContent = mods.length;
    root.querySelector('#pv-p').textContent = `${p.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp`;
    root.querySelector('#pv-e').textContent = `${Math.round(p * R.yieldPerKWp).toLocaleString('de-DE')} kWh`;
    const box = root.querySelector('.pv-strings');
    box.innerHTML = strings.map((str, k) => {
      const n = str.length, bad = n ? stringIssue(n) : null;
      const state = !n ? '<span class="pill">leer</span>' : bad ? '<span class="pill bad">passt nicht</span>' : '<span class="pill ok">passt</span>';
      return `<div class="pv-srow s${k}"><b>${STRING_NAMES[k]}</b><span>${n} Module</span>${n ? `<span>Uoc bei ${C(E.tCold)}: ${V(vocCold(n))} V</span><span>Umpp bei ${C(E.tHot)}: ${V(vmppHot(n))} V</span>` : ''}${state}</div>`;
    }).join('');
    const free = mods.filter(m => stringOf(m.id) < 0).length;
    if (mods.length && strings.some(s2 => s2.length)) box.insertAdjacentHTML('beforeend', `<p class="pv-free">${free ? `${free} ${free === 1 ? 'Modul ist' : 'Module sind'} noch frei.` : 'Alle Module sind verschaltet.'}</p>`);
  }
  function setStep(n) {
    step = n;
    root.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.step === n)));
    root.querySelectorAll('.pv-bar').forEach(b => { b.hidden = +b.dataset.for !== n; });
    svg.classList.toggle('wiring', n === 2);
    setHint(); sfx.tick();
  }
  function setActive(k) {
    active = k;
    root.querySelectorAll('[data-string]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.string === k)));
    setHint();
  }
  function toRoof(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x / S, q.y / S];
  }
  function removeModule(id) {
    const i = mods.findIndex(m => m.id === id);
    if (i < 0) return;
    mods.splice(i, 1);
    // Ein String endet dort, wo ein Modul herausgenommen wird
    strings.forEach(str => { const k = str.indexOf(id); if (k >= 0) str.splice(k); });
  }
  function wire(id) {
    const k = stringOf(id), str = strings[active];
    if (k === active && str[str.length - 1] === id) { str.pop(); sfx.tick(); return; }
    if (k >= 0) { sfx.thunk(); announce(`Dieses Modul gehört schon zu String ${k + 1}.`); hint.textContent = `Dieses Modul gehört schon zu String ${k + 1}. Tippe das letzte Modul eines Strings an, um es wieder zu lösen.`; return; }
    const last = str.length ? byId(str[str.length - 1]) : null;
    if (last && !neighbors(last, byId(id))) {
      sfx.thunk();
      hint.textContent = 'Nur direkte Nachbarn lassen sich verbinden. So bleiben die Leitungen kurz.';
      announce('Nur direkte Nachbarn lassen sich verbinden.');
      return;
    }
    str.push(id);
    sfx.wire();
    setHint();
  }

  svg.addEventListener('click', e => {
    if (solved) return;
    const hit = e.target.closest('.pv-mod');
    result.innerHTML = '';
    if (step === 2) { if (hit) { wire(+hit.dataset.id); draw(); } return; }
    if (hit) { removeModule(+hit.dataset.id); sfx.tick(); draw(); return; }
    const [x, y] = toRoof(e);
    // Module rasten in ein Raster ab Randabstand ein, mit 2 cm Fuge zum Nachbarmodul
    const w = portrait ? R.module.a : R.module.b, h = portrait ? R.module.b : R.module.a;
    const px = w + R.gap, py = h + R.gap;
    const maxI = Math.floor((R.w - 2 * R.margin + R.gap) / px) - 1, maxJ = Math.floor((R.h - 2 * R.margin + R.gap) / py) - 1;
    const i = Math.min(Math.max(Math.round((x - w / 2 - R.margin) / px), 0), maxI);
    const j = Math.min(Math.max(Math.round((y - h / 2 - R.margin) / py), 0), maxJ);
    const m = { id: nextId++, x: R.margin + i * px, y: R.margin + j * py, w, h };
    if (mods.some(n => overlap(m, n, R.gap - 1e-6))) { sfx.thunk(); announce('Dort liegt schon ein Modul.'); return; }
    mods.push(m);
    sfx.place();
    const bad = moduleIssue(m, mods);
    if (bad) announce(bad);
    draw();
  });
  root.addEventListener('click', e => {
    if (solved) return;
    const st = e.target.closest('[data-step]');
    if (st) { setStep(+st.dataset.step); return; }
    const pick = e.target.closest('[data-string]');
    if (pick) { setActive(+pick.dataset.string); sfx.tick(); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'orient') {
      portrait = !portrait;
      act.textContent = portrait ? 'Hochkant' : 'Quer';
      act.setAttribute('aria-pressed', String(portrait));
      sfx.tick();
    }
    if (a === 'clear') { mods.length = 0; strings.forEach(s2 => { s2.length = 0; }); result.innerHTML = ''; draw(); }
    if (a === 'undo') { strings[active].pop(); sfx.tick(); draw(); }
    if (a === 'unstring') { strings[active].length = 0; sfx.tick(); draw(); }
    if (a === 'check') check();
  });

  function check() {
    const issues = mods.map(m => moduleIssue(m, mods)).filter(Boolean);
    let errs = [...new Set(issues)];
    const p = kWp(mods);
    if (p < R.targetKWp) errs.push(`Erst ${p.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp. Ziel sind mindestens ${R.targetKWp.toLocaleString('de-DE')} kWp, also ${Math.ceil(R.targetKWp * 1000 / R.module.wp)} Module.`);
    if (!errs.length) errs = checkStrings(mods, strings);
    if (errs.length) {
      tries++; sfx.fail();
      result.innerHTML = `<div class="prax-bad"><b>Noch nicht.</b><ul>${errs.map(t => `<li>${esc(t)}</li>`).join('')}</ul>${issues.length ? '<p>Rot markierte Module verletzen eine Regel.</p>' : ''}</div>`;
      announce(errs[0]);
      if (/Schritt 2/.test(errs[0]) && step === 1) setStep(2);
      return;
    }
    solved = true;
    const stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
    const used = strings.filter(s2 => s2.length);
    sfx.win();
    result.innerHTML = `<div class="prax-ok"><b>Dach belegt und verschaltet: ${mods.length} Module, ${p.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp.</b>
      <p>${used.map((s2, k) => `String ${k + 1}: ${s2.length} Module, Uoc bei ${C(E.tCold)} ${V(vocCold(s2.length))} V`).join(' · ')}. Lege Plus- und Minusleitung eng nebeneinander, damit die Leiterschleife klein bleibt.</p>
      <p>Über 7 kW installierter Leistung ist ein intelligentes Messsystem Pflicht. Die Anlage wird beim Netzbetreiber angemeldet und im Marktstammdatenregister eingetragen.</p>
      ${opts.onDone ? '<button class="btn primary" type="button" data-done>Weiter</button>' : ''}</div>`;
    const done = result.querySelector('[data-done]');
    if (done) { done.addEventListener('click', () => opts.onDone({ stars })); done.focus(); }
    announce('Dach belegt und verschaltet.');
  }
  setHint();
  draw();
  return { unmount() { container.innerHTML = ''; } };
}
