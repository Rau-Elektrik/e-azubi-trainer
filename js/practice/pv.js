// Praxis: PV-Module auf eine Süddachfläche planen. Maße in Metern.
// Spielregel: 30 cm Randabstand und 30 cm Abstand zu Dachdurchbrüchen. In echt legen Statik,
// Windlastzone und Montagesystem die Abstände fest (Rand- und Eckbereiche haben die größten Soglasten).
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

export function mount(container, opts = {}) {
  const R = ROOF;
  const mods = [];
  let portrait = true, tries = 0, solved = false;
  const S = 34;  // Pixel je Meter im SVG
  container.innerHTML = `
    <div class="prax pv">
      <p class="prax-task">Belege die Süddachfläche mit mindestens ${R.targetKWp.toLocaleString('de-DE')} kWp. Ein Modul hat ${R.module.wp} Wp. Tippe auf das Dach, um ein Modul zu setzen, tippe ein Modul an, um es zu entfernen. Halte 30 cm Randabstand und spare Schornstein, Dachfenster und Schatten aus.</p>
      <div class="pv-bar">
        <button class="btn small" type="button" data-act="orient" aria-pressed="true">Hochkant</button>
        <button class="btn small" type="button" data-act="clear">Dach leeren</button>
      </div>
      <svg class="pv-roof" viewBox="0 0 ${R.w * S} ${R.h * S}" role="img" aria-label="Süddachfläche 10 mal 6,2 Meter"></svg>
      <p class="pv-scale"><span>First</span><span>${R.w.toLocaleString('de-DE')} m × ${R.h.toLocaleString('de-DE')} m · Süd · 35°</span><span>Traufe unten</span></p>
      <div class="pv-stats">
        <div><span class="lbl">Module</span><b id="pv-n">0</b></div>
        <div><span class="lbl">Leistung</span><b id="pv-p">0 kWp</b></div>
        <div><span class="lbl">Ertrag</span><b id="pv-e">0 kWh</b></div>
      </div>
      <p class="pv-note">Ertrag als Faustwert: ${R.yieldPerKWp} kWh je kWp und Jahr bei Südausrichtung in Deutschland.</p>
      <div class="prax-actions"><button class="btn primary" type="button" data-act="check">Prüfen</button></div>
      <div class="prax-result" aria-live="polite"></div>
    </div>`;
  const root = container.querySelector('.pv');
  const svg = root.querySelector('.pv-roof'), result = root.querySelector('.prax-result');

  function draw() {
    let s = `<rect x="0" y="0" width="${R.w * S}" height="${R.h * S}" class="pv-tiles"/>`;
    s += `<rect x="${R.margin * S}" y="${R.margin * S}" width="${(R.w - 2 * R.margin) * S}" height="${(R.h - 2 * R.margin) * S}" class="pv-margin"/>`;
    s += `<rect x="${R.shade.x * S}" y="${R.shade.y * S}" width="${R.shade.w * S}" height="${R.shade.h * S}" class="pv-shade"/>`;
    for (const o of R.obstacles) s += `<rect x="${o.x * S}" y="${o.y * S}" width="${o.w * S}" height="${o.h * S}" class="${o.name === 'Schornstein' ? 'pv-chimney' : 'pv-window'}"/>`;
    mods.forEach((m, i) => {
      const bad = moduleIssue(m, mods);
      s += `<rect x="${m.x * S}" y="${m.y * S}" width="${m.w * S}" height="${m.h * S}" class="pv-mod${bad ? ' bad' : ''}" data-i="${i}"/>`;
    });
    svg.innerHTML = s;
    const p = kWp(mods);
    root.querySelector('#pv-n').textContent = mods.length;
    root.querySelector('#pv-p').textContent = `${p.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp`;
    root.querySelector('#pv-e').textContent = `${Math.round(p * R.yieldPerKWp).toLocaleString('de-DE')} kWh`;
  }
  function toRoof(e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x / S, q.y / S];
  }
  svg.addEventListener('click', e => {
    if (solved) return;
    const hit = e.target.closest('.pv-mod');
    if (hit) { mods.splice(+hit.dataset.i, 1); sfx.tick(); result.innerHTML = ''; draw(); return; }
    const [x, y] = toRoof(e);
    // Module rasten in ein Raster ab Randabstand ein, mit 2 cm Fuge zum Nachbarmodul
    const w = portrait ? R.module.a : R.module.b, h = portrait ? R.module.b : R.module.a;
    const px = w + R.gap, py = h + R.gap;
    const maxI = Math.floor((R.w - 2 * R.margin + R.gap) / px) - 1, maxJ = Math.floor((R.h - 2 * R.margin + R.gap) / py) - 1;
    const i = Math.min(Math.max(Math.round((x - w / 2 - R.margin) / px), 0), maxI);
    const j = Math.min(Math.max(Math.round((y - h / 2 - R.margin) / py), 0), maxJ);
    const m = { x: R.margin + i * px, y: R.margin + j * py, w, h };
    if (mods.some(n => overlap(m, n, R.gap - 1e-6))) { sfx.thunk(); announce('Dort liegt schon ein Modul.'); return; }
    mods.push(m);
    sfx.place(); result.innerHTML = '';
    const bad = moduleIssue(m, mods);
    if (bad) announce(bad);
    draw();
  });
  root.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (!act || solved) return;
    if (act.dataset.act === 'orient') {
      portrait = !portrait;
      act.textContent = portrait ? 'Hochkant' : 'Quer';
      act.setAttribute('aria-pressed', String(portrait));
      sfx.tick();
    }
    if (act.dataset.act === 'clear') { mods.length = 0; result.innerHTML = ''; draw(); }
    if (act.dataset.act === 'check') check();
  });
  function check() {
    const issues = mods.map(m => moduleIssue(m, mods)).filter(Boolean);
    const errs = [...new Set(issues)];
    const p = kWp(mods);
    if (p < R.targetKWp) errs.push(`Erst ${p.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp. Ziel sind mindestens ${R.targetKWp.toLocaleString('de-DE')} kWp, also ${Math.ceil(R.targetKWp * 1000 / R.module.wp)} Module.`);
    if (errs.length) {
      tries++; sfx.fail();
      result.innerHTML = `<div class="prax-bad"><b>Noch nicht.</b><ul>${errs.map(t => `<li>${esc(t)}</li>`).join('')}</ul>${issues.length ? '<p>Rot markierte Module verletzen eine Regel.</p>' : ''}</div>`;
      announce(errs[0]);
      return;
    }
    solved = true;
    const stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
    sfx.win();
    result.innerHTML = `<div class="prax-ok"><b>Dach sauber belegt: ${mods.length} Module, ${p.toLocaleString('de-DE', { maximumFractionDigits: 2 })} kWp.</b><p>Über 7 kW installierter Leistung ist ein intelligentes Messsystem Pflicht. Die Anlage wird beim Netzbetreiber angemeldet und im Marktstammdatenregister eingetragen.</p>${opts.onDone ? '<button class="btn primary" type="button" data-done>Weiter</button>' : ''}</div>`;
    const done = result.querySelector('[data-done]');
    if (done) { done.addEventListener('click', () => opts.onDone({ stars })); done.focus(); }
    announce('Dach sauber belegt.');
  }
  draw();
  return { unmount() { container.innerHTML = ''; } };
}
