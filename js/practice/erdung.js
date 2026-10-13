// Praxis: Ausbreitungswiderstand eines Erders mit der Sondenmethode (Strom-Spannungs-Verfahren) messen.
// Modell: halbkugelförmige Erder im homogenen Boden. Der gemessene Wert hängt von der Lage der Sonde ab:
// R(x) = ρ/2π · (1/r − 1/d − 1/(x·d) + 1/((1−x)·d)). Bei x ≈ 0,618 ergibt sich genau der wahre Wert ρ/(2πr).
import { sfx, esc, announce } from '../ui.js';

export function measured(p, d, x, open) {
  const t = p.rho / (2 * Math.PI) * (1 / p.r - 1 / d - 1 / (x * d) + 1 / ((1 - x) * d));
  return open ? t : (t * p.par) / (t + p.par);
}
export const trueR = p => p.rho / (2 * Math.PI * p.r);

const fmt1 = v => v.toLocaleString('de-DE', { maximumFractionDigits: v < 10 ? 2 : 1, minimumFractionDigits: v < 10 ? 2 : 1 });

export function mount(container, opts = {}) {
  const p = { rho: 100, r: 0.6 + Math.random() * 0.7, par: 1.2 };
  const R0 = trueR(p);
  let open = false, d = 10, x = 0.5, tries = 0, solved = false;
  const pts = [];
  let seed = 7;
  const noise = () => { seed = (seed * 9301 + 49297) % 233280; return (seed / 233280 - 0.5) * 0.012; };

  container.innerHTML = `
    <div class="prax er">
      <p class="prax-task">Miss den Ausbreitungswiderstand des Fundamenterders mit der Sondenmethode. Öffne zuerst die Trennstelle. Setze dann Hilfserder H und Sonde S und miss an mehreren Stellen.</p>
      <svg class="er-scene" viewBox="0 0 360 150" role="img" aria-label="Messaufbau mit Erder, Sonde und Hilfserder"></svg>
      <div class="er-controls">
        <label class="er-switch"><input type="checkbox" id="er-open"> Trennstelle an der Haupterdungsschiene geöffnet</label>
        <label for="er-d">Hilfserder H: <b id="er-dv">10 m</b> vom Erder</label>
        <input type="range" id="er-d" min="5" max="60" step="1" value="10">
        <label for="er-x">Sonde S: <b id="er-xv">50 %</b> der Strecke E–H</label>
        <input type="range" id="er-x" min="10" max="90" step="1" value="50">
        <button class="btn" type="button" data-act="measure">Messen</button>
      </div>
      <div class="er-out">
        <svg class="er-chart" viewBox="0 0 320 170" role="img" aria-label="Messwerte über der Sondenposition"></svg>
        <ol class="er-list" aria-label="Messwerte"></ol>
      </div>
      <div class="er-answer">
        <label for="er-val">Ausbreitungswiderstand R<sub>A</sub></label>
        <div class="num-row"><input id="er-val" inputmode="decimal" autocomplete="off" placeholder="z. B. 18,5"><span>Ω</span></div>
        <button class="btn primary" type="button" data-act="eval">Auswerten</button>
      </div>
      <div class="prax-result" aria-live="polite"></div>
    </div>`;
  const root = container.querySelector('.er');
  const q = s => root.querySelector(s);
  const scene = q('.er-scene'), chart = q('.er-chart'), list = q('.er-list'), result = q('.prax-result');

  function drawScene() {
    const sx = v => 30 + v * (310 / 60);   // Meter → Pixel
    const hx = sx(d), px = sx(d * x);
    scene.innerHTML = `
      <rect x="0" y="80" width="360" height="70" class="er-soil"/>
      <line x1="0" y1="80" x2="360" y2="80" class="er-ground"/>
      <rect x="6" y="38" width="40" height="42" class="er-house"/>
      <path d="M2 40 L26 22 L50 40" class="er-roof"/>
      <path d="M10 82 h32 v6 h-32z" class="er-erder"/>
      <text x="26" y="104" class="er-t">E</text>
      <circle cx="${30 - 18}" cy="62" r="5" class="${open ? 'er-open' : 'er-closed'}"/>
      <text x="4" y="74" class="er-ts">${open ? 'offen' : 'zu'}</text>
      <line x1="${px}" y1="66" x2="${px}" y2="100" class="er-spike"/>
      <text x="${px}" y="116" class="er-t">S</text>
      <line x1="${hx}" y1="66" x2="${hx}" y2="104" class="er-spike h"/>
      <text x="${hx}" y="120" class="er-t">H</text>
      <rect x="150" y="6" width="56" height="26" rx="3" class="er-meter"/>
      <text x="178" y="23" class="er-mt">${pts.length ? fmt1(pts[pts.length - 1].v) + ' Ω' : '– Ω'}</text>
      <path d="M160 32 C 120 50, 60 55, 30 82" class="er-lead"/>
      <path d="M178 32 C 180 50, ${px} 50, ${px} 66" class="er-lead s"/>
      <path d="M196 32 C 230 50, ${hx} 46, ${hx} 66" class="er-lead h"/>
      <text x="${(30 + hx) / 2}" y="142" class="er-ts">${d} m</text>`;
  }
  function drawChart() {
    const W = 320, H = 170, L = 40, B = 140, T = 10, Rr = 310;
    const sameD = pts.filter(t => t.d === d && t.open === open);
    const vals = sameD.map(t => t.v).concat(R0);
    const vmax = Math.max(...vals) * 1.15, vmin = Math.max(0, Math.min(...vals) * 0.8);
    const yx = v => B - (v - vmin) / (vmax - vmin || 1) * (B - T);
    const xx = s => L + (s - 0.1) / 0.8 * (Rr - L);
    let s = `<line x1="${L}" y1="${B}" x2="${Rr}" y2="${B}" class="er-axis"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" class="er-axis"/>`;
    for (const tk of [0.2, 0.4, 0.62, 0.8]) s += `<line x1="${xx(tk)}" y1="${B}" x2="${xx(tk)}" y2="${B + 4}" class="er-axis"/><text x="${xx(tk)}" y="${B + 16}" class="er-tick">${Math.round(tk * 100)} %</text>`;
    s += `<rect x="${xx(0.52)}" y="${T}" width="${xx(0.72) - xx(0.52)}" height="${B - T}" class="er-band"/>`;
    for (const tk of [vmin, (vmin + vmax) / 2, vmax]) s += `<text x="${L - 4}" y="${yx(tk) + 4}" class="er-tick" text-anchor="end">${fmt1(tk)}</text>`;
    const sorted = sameD.slice().sort((a, b) => a.x - b.x);
    if (sorted.length > 1) s += `<polyline points="${sorted.map(t => `${xx(t.x)},${yx(t.v)}`).join(' ')}" class="er-line"/>`;
    for (const t of sorted) s += `<circle cx="${xx(t.x)}" cy="${yx(t.v)}" r="4" class="er-dot"/>`;
    s += `<text x="${(L + Rr) / 2}" y="${H - 2}" class="er-tick">Sondenposition · Messungen bei ${d} m${open ? '' : ', Trennstelle zu'}</text>`;
    chart.innerHTML = s;
    list.innerHTML = pts.slice(-8).map(t => `<li>H ${t.d} m · S ${Math.round(t.x * 100)} % · ${t.open ? 'offen' : 'zu'}: <b>${fmt1(t.v)} Ω</b></li>`).join('');
  }
  const sync = () => {
    q('#er-dv').textContent = `${d} m`;
    q('#er-xv').textContent = `${Math.round(x * 100)} % · ${(d * x).toLocaleString('de-DE', { maximumFractionDigits: 1 })} m`;
    drawScene(); drawChart();
  };
  q('#er-open').addEventListener('change', e => { open = e.target.checked; sfx.klack(); sync(); });
  q('#er-d').addEventListener('input', e => { d = +e.target.value; sync(); });
  q('#er-x').addEventListener('input', e => { x = +e.target.value / 100; sync(); });

  root.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (!act || solved) return;
    if (act.dataset.act === 'measure') {
      const v = measured(p, d, x, open) * (1 + noise());
      pts.push({ d, x, open, v });
      sfx.tick();
      announce(`Messwert ${fmt1(v)} Ohm`);
      sync();
    }
    if (act.dataset.act === 'eval') evaluate();
  });

  function evaluate() {
    const raw = q('#er-val').value.trim().replace(/\s/g, '').replace(',', '.');
    const val = parseFloat(raw);
    const errs = [];
    const good = pts.filter(t => t.open && t.d >= 20);
    const set = good.filter(t => t.d === d);
    if (!pts.some(t => t.open)) errs.push('Die Trennstelle war bei keiner Messung offen. Sonst misst du parallele Erdungen über PEN, Rohre und Nachbarerder mit.');
    else if (!good.length) errs.push('Der Hilfserder steht zu nah. Er muss mindestens 20 m vom Erder entfernt sein, damit sich die Spannungstrichter nicht überlappen.');
    else if (set.length < 3) errs.push('Miss bei gleichem Hilfserderabstand an mindestens drei Sondenpositionen, zum Beispiel bei 52 %, 62 % und 72 %.');
    else {
      const near = set.filter(t => t.x >= 0.57 && t.x <= 0.67);
      const span = Math.max(...set.map(t => t.x)) - Math.min(...set.map(t => t.x));
      const vs = set.map(t => t.v), lo = Math.min(...vs), hi = Math.max(...vs);
      if (!near.length) errs.push('Eine Messung muss bei rund 62 % der Strecke E–H liegen.');
      else if (span < 0.15) errs.push('Verteile die Sondenpositionen weiter, damit du das Plateau erkennst.');
      else if (hi / lo > 1.1) errs.push('Die Werte schwanken um mehr als 10 %. Es gibt kein Plateau. Setze den Hilfserder weiter weg.');
      else if (!isFinite(val)) errs.push('Trage den gemessenen Ausbreitungswiderstand ein.');
      else {
        const ref = near.reduce((s, t) => s + t.v, 0) / near.length;
        if (Math.abs(val - ref) / ref > 0.05) errs.push(`Dein Wert passt nicht zur Messung bei 62 %. Dort hast du ${fmt1(ref)} Ω gemessen.`);
      }
    }
    if (errs.length) {
      tries++; sfx.fail();
      result.innerHTML = `<div class="prax-bad"><b>Noch nicht.</b><ul>${errs.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
      announce(errs[0]);
      return;
    }
    solved = true;
    const stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
    sfx.win();
    result.innerHTML = `<div class="prax-ok"><b>Messung gültig: R<sub>A</sub> ≈ ${fmt1(R0)} Ω.</b><p>Im TT-System mit FI 30 mA gilt R<sub>A</sub> · I<sub>Δn</sub> ≤ 50 V. Das ergibt höchstens 1.667 Ω, die Bedingung ist erfüllt. Nach der Messung die Trennstelle wieder schließen.</p>${opts.onDone ? '<button class="btn primary" type="button" data-done>Weiter</button>' : ''}</div>`;
    const done = result.querySelector('[data-done]');
    if (done) { done.addEventListener('click', () => opts.onDone({ stars })); done.focus(); }
    announce('Messung gültig.');
  }

  sync();
  return { unmount() { container.innerHTML = ''; } };
}
