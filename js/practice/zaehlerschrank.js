// Praxis: Zählerschrank nach VDE-AR-N 4100 (Fassung 2026-04) bestücken.
// Jedes Teil hat die Räume, in die es gehört. Die Prüfung erklärt jeden Fehler.
import { sfx, esc, announce } from '../ui.js';

export const ZONES = {
  apz: { name: 'APZ · Abschlusspunkt Zählerplatz', short: 'APZ', grow: 300 },
  vf: { name: 'Verteilerfeld', short: 'Verteilerfeld', grow: 700 },
  aar: { name: 'AAR · anlagenseitiger Anschlussraum', short: 'AAR', grow: 300 },
  rfz: { name: 'RfZ · Raum für Zusatzanwendungen', short: 'RfZ', grow: 150 },
  zf: { name: 'Zählerfeld · eHZ', short: 'Zählerfeld', grow: 300 },
  nar: { name: 'NAR · netzseitiger Anschlussraum', short: 'NAR', grow: 250 }
};

export const PARTS = [
  { id: 'schiene', name: 'Sammelschiene 5-polig', ok: ['nar'], why: 'Die 5-polige Sammelschiene ist im netzseitigen Anschlussraum vorgeschrieben. Dort kommt die Hauptleitung an, nie von oben.' },
  { id: 'sls', name: 'SLS (selektiver Hauptleitungsschutzschalter)', ok: ['nar'], why: 'Der SLS ist die Trennvorrichtung vor dem Zähler. Er sitzt im netzseitigen Anschlussraum und ist sperr- und plombierbar.' },
  { id: 'kombi', name: 'Kombiableiter (SPD Typ 1+2)', ok: ['nar', 'aar'], why: 'Überspannungsschutz darf als Kombiableiter in den NAR oder als Typ 1 oder 2 in den AAR.' },
  { id: 'hs', name: 'Hauptschalter', ok: ['aar'], why: 'Der Hauptschalter ist die anlagenseitige Trennstelle. Er gehört in den anlagenseitigen Anschlussraum.' },
  { id: 'abzweig', name: 'Hauptleitungsabzweigklemme', ok: ['aar'], why: 'Von der Abzweigklemme im AAR geht die Zuleitung zum Stromkreisverteiler ab.' },
  { id: 'ehz', name: 'Elektronischer Zähler (eHZ)', ok: ['zf'], why: 'Der eHZ wird im Zählerfeld auf die BKE gesteckt.' },
  { id: 'smgw', name: 'Smart-Meter-Gateway', ok: ['rfz'], why: 'Das Gateway ist ein Betriebsmittel des Messstellenbetreibers und gehört in den RfZ.' },
  { id: 'steuer', name: 'Steuerbox (§ 14a EnWG)', ok: ['rfz'], why: 'Steuergeräte des Messstellenbetreibers gehören in den RfZ.' },
  { id: 'router', name: 'Kommunikationsgerät des Netzbetreibers', ok: ['apz'], why: 'Der APZ nimmt die Kommunikationskomponenten des Netzbetreibers auf. Er ist per Datenleitung (mindestens Cat. 5) mit dem Zählerplatz verbunden.' },
  { id: 'rcd', name: 'FI-Schutzschalter der Wohnung', ok: ['vf'], why: 'Schutzgeräte der Kundenanlage gehören ins Verteilerfeld. AAR und RfZ sind keine Stromkreisverteiler.' },
  { id: 'ls', name: 'LS-Schalter der Stromkreise', ok: ['vf'], why: 'Die Leitungsschutzschalter gehören ins Verteilerfeld. AAR und RfZ sind keine Stromkreisverteiler.' },
  { id: 'nh', name: 'Hausanschlusssicherung (NH)', ok: [], why: 'Die Hausanschlusssicherung sitzt im Hausanschlusskasten des Netzbetreibers, nicht im Zählerschrank. Lass sie im Kasten liegen.' }
];

// Prüft eine Belegung: place = { teilId: zoneId | null }
export function checkCabinet(place) {
  const errors = [];
  for (const p of PARTS) {
    const z = place[p.id] || null;
    if (!p.ok.length) { if (z) errors.push({ id: p.id, text: p.why }); continue; }
    if (!z) errors.push({ id: p.id, text: `${p.name} ist noch nicht gesetzt.` });
    else if (!p.ok.includes(z)) errors.push({ id: p.id, text: `${p.name} gehört nicht in ${ZONES[z].short}. ${p.why}` });
  }
  return errors;
}

export function mount(container, opts = {}) {
  const place = {};
  let selected = null, tries = 0, solved = false;
  const ac = new AbortController();
  const zoneHTML = id => `<div class="zs-zone" data-zone="${id}" role="button" tabindex="0" style="flex-grow:${ZONES[id].grow}" aria-label="${esc(ZONES[id].name)}">
      <span class="zs-zlabel">${esc(ZONES[id].name)}</span><div class="zs-zparts"></div></div>`;
  container.innerHTML = `
    <div class="prax zs">
      <p class="prax-task">Setze jedes Teil in den richtigen Raum des Zählerschranks. Antippen und dann den Raum antippen, oder ziehen. Teile, die nicht in den Zählerschrank gehören, bleiben im Kasten.</p>
      <p class="lbl">Teile</p>
      <div class="zs-tray" role="group" aria-label="Teile"></div>
      <div class="zs-cab" aria-label="Zählerschrank">
        <div class="zs-col">${zoneHTML('aar')}<div class="zs-zf">${zoneHTML('rfz')}${zoneHTML('zf')}</div>${zoneHTML('nar')}</div>
        <div class="zs-col">${zoneHTML('apz')}${zoneHTML('vf')}</div>
      </div>
      <div class="prax-actions">
        <button class="btn" type="button" data-act="reset">Alles zurück</button>
        <button class="btn primary" type="button" data-act="check">Prüfen</button>
      </div>
      <div class="prax-result" aria-live="polite"></div>
    </div>`;
  const root = container.querySelector('.zs');
  const tray = root.querySelector('.zs-tray');
  const result = root.querySelector('.prax-result');
  let errIds = new Set();

  function chip(p) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'zs-chip' + (selected === p.id ? ' sel' : '') + (errIds.has(p.id) ? ' bad' : '');
    b.dataset.part = p.id;
    b.textContent = p.name;
    b.setAttribute('aria-pressed', String(selected === p.id));
    return b;
  }
  function render() {
    tray.innerHTML = '';
    root.querySelectorAll('.zs-zparts').forEach(z => { z.innerHTML = ''; });
    for (const p of PARTS) {
      const z = place[p.id];
      if (z) root.querySelector(`.zs-zone[data-zone="${z}"] .zs-zparts`).append(chip(p));
      else tray.append(chip(p));
    }
    root.querySelectorAll('.zs-zone').forEach(z => z.classList.toggle('target', !!selected));
  }
  function put(partId, zone) {
    place[partId] = zone || null;
    selected = null; errIds = new Set();
    result.innerHTML = '';
    sfx.place();
    render();
  }

  root.addEventListener('click', e => {
    if (solved) return;
    const c = e.target.closest('.zs-chip');
    if (c) {
      e.stopPropagation();
      if (drag && drag.moved) return;
      const id = c.dataset.part;
      selected = selected === id ? null : id;
      sfx.tick();
      render();
      return;
    }
    const z = e.target.closest('.zs-zone');
    if (z && selected) { put(selected, z.dataset.zone); return; }
    if (e.target.closest('.zs-tray') && selected && place[selected]) { put(selected, null); return; }
    const act = e.target.closest('[data-act]');
    if (act && act.dataset.act === 'reset') {
      for (const k in place) delete place[k];
      selected = null; errIds = new Set(); result.innerHTML = '';
      render();
    }
    if (act && act.dataset.act === 'check') check();
  });
  root.addEventListener('keydown', e => {
    const z = e.target.closest('.zs-zone');
    if (z && (e.key === 'Enter' || e.key === ' ') && selected) { e.preventDefault(); put(selected, z.dataset.zone); }
  });

  // Ziehen mit Maus oder Finger
  let drag = null;
  root.addEventListener('pointerdown', e => {
    const c = e.target.closest('.zs-chip');
    if (!c || solved) return;
    drag = { id: c.dataset.part, sx: e.clientX, sy: e.clientY, moved: false, ghost: null };
  }, { signal: ac.signal });
  window.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 8) {
      drag.moved = true;
      drag.ghost = document.createElement('div');
      drag.ghost.className = 'zs-ghost';
      drag.ghost.textContent = PARTS.find(p => p.id === drag.id).name;
      document.body.append(drag.ghost);
    }
    if (drag.moved) {
      drag.ghost.style.left = e.clientX + 'px';
      drag.ghost.style.top = e.clientY + 'px';
      const under = document.elementFromPoint(e.clientX, e.clientY);
      root.querySelectorAll('.zs-zone').forEach(z => z.classList.toggle('over', !!under && z.contains(under)));
    }
  }, { signal: ac.signal });
  window.addEventListener('pointerup', e => {
    if (!drag) return;
    const d = drag;
    if (d.ghost) d.ghost.remove();
    root.querySelectorAll('.zs-zone.over').forEach(z => z.classList.remove('over'));
    if (d.moved) {
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const z = under && under.closest('.zs-zone');
      if (z && root.contains(z)) put(d.id, z.dataset.zone);
      else if (under && under.closest('.zs-tray')) put(d.id, null);
      setTimeout(() => { drag = null; }, 0);
    } else drag = null;
  }, { signal: ac.signal });
  root.addEventListener('touchmove', e => { if (drag && drag.moved) e.preventDefault(); }, { passive: false, signal: ac.signal });

  function check() {
    const errors = checkCabinet(place);
    errIds = new Set(errors.map(x => x.id));
    render();
    if (errors.length) {
      tries++;
      sfx.fail();
      result.innerHTML = `<div class="prax-bad"><b>Noch ${errors.length} ${errors.length === 1 ? 'Fehler' : 'Fehler'}.</b><ul>${errors.slice(0, 4).map(x => `<li>${esc(x.text)}</li>`).join('')}</ul>${errors.length > 4 ? '<p>Weitere Teile sind rot markiert.</p>' : ''}</div>`;
      announce(`Noch ${errors.length} Fehler.`);
      return;
    }
    solved = true;
    const stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
    sfx.win();
    result.innerHTML = `<div class="prax-ok"><b>Zählerschrank richtig bestückt.</b><p>Hausanschlusssicherung im Hausanschlusskasten, SLS und Sammelschiene im NAR, Gateway und Steuerbox im RfZ, Hauptschalter im AAR.</p>${opts.onDone ? '<button class="btn primary" type="button" data-done>Weiter</button>' : ''}</div>`;
    const done = result.querySelector('[data-done]');
    if (done) { done.addEventListener('click', () => opts.onDone({ stars })); done.focus(); }
    announce('Zählerschrank richtig bestückt.');
  }

  render();
  return { unmount() { ac.abort(); container.innerHTML = ''; } };
}
