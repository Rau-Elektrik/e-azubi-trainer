// Bereich Berufsschule: Lernfelder nach KMK-Rahmenlehrplan Elektroniker/-in (Beschluss 18.12.2020),
// Fachrichtung Energie- und Gebäudetechnik, dazu Wirtschafts- und Sozialkunde.
// Ein neues Lernfeld oder eine neue Lektion ist ein Eintrag in jahr1.js bis jahr4.js oder wiso.js.
// Lektions-IDs entstehen automatisch: <lernfeld>-<nummer>. Eine später eingefügte Lektion bekommt
// einen eigenen Schlüssel (key), damit gespeicherter Fortschritt an den alten Nummern hängen bleibt.
import jahr1 from './jahr1.js';
import jahr2 from './jahr2.js';
import jahr3 from './jahr3.js';
import jahr4 from './jahr4.js';
import wiso from './wiso.js';
import { FAECHER, findFach } from './faecher.js';

export { FAECHER, findFach };
export const LERNFELDER = [...jahr1, ...jahr2, ...jahr3, ...jahr4];
export const WISO = wiso;
// Alles mit Lektionen: die 13 Lernfelder und WiSo
export const BLOECKE = LERNFELDER.concat([WISO]);

export const JAHRE = [
  { nr: 1, title: '1. Lehrjahr', text: 'Grundstufe, gleich für alle Elektroberufe im Handwerk.' },
  { nr: 2, title: '2. Lehrjahr', text: 'Lernfelder 1 bis 6 sind der Stoff für Teil 1 der Gesellenprüfung.' },
  { nr: 3, title: '3. Lehrjahr', text: 'Fachrichtung Energie- und Gebäudetechnik.' },
  { nr: 4, title: '4. Lehrjahr', text: 'Das letzte halbe Jahr bis Teil 2 der Gesellenprüfung.' }
];

BLOECKE.forEach(b => {
  b.short = b.nr ? `LF ${b.nr}` : 'WiSo';
  b.testId = `${b.id}-test`;
  let n = 0;
  b.lektionen.forEach((l, i) => {
    l.id = l.key ? `${b.id}-${l.key}` : `${b.id}-${++n}`;
    l.block = b;
    l.index = i;
    l.items.forEach(it => { if (!it.f) it.f = l.fach; });
  });
});

export const findBlock = id => BLOECKE.find(b => b.id === id);
export const findLektion = id => BLOECKE.flatMap(b => b.lektionen).find(l => l.id === id);
export const lernfelderOfYear = nr => LERNFELDER.filter(b => b.jahr === nr);

// Aufgabe mit Herkunft für die Anzeige über der Frage, etwa „LF 5 · Fachrechnen“
const tagged = (it, b) => {
  const fach = findFach(it.f).title;
  return Object.assign({}, it, { tag: fach === b.short ? fach : `${b.short} · ${fach}` });
};
export const blockItems = b => b.lektionen.flatMap(l => l.items.map(it => tagged(it, b)));
export const lektionItems = l => l.items.map(it => tagged(it, l.block));

// Training nach Fach: alle Lernfelder bis zum gewählten Lehrjahr und WiSo
export function fachItems(fachId, bisJahr) {
  return BLOECKE.filter(b => b.jahr <= bisJahr).flatMap(b => blockItems(b).filter(it => it.f === fachId));
}

// Prüfungstraining nach ElekAusbV 2021 § 7 bis § 14
export const PRUEFUNGEN = [
  { id: 'gp1', title: 'Gesellenprüfung Teil 1', text: 'Elektrotechnische Anlagen und Betriebsmittel: Lernfelder 1 bis 6 gemischt.', count: 20, ab: 2,
    blocks: () => LERNFELDER.filter(b => b.nr <= 6) },
  { id: 'gp2', title: 'Gesellenprüfung Teil 2', text: 'Systementwurf, Funktions- und Systemanalyse und WiSo: alle Lernfelder gemischt.', count: 30, ab: 3,
    blocks: () => BLOECKE }
];
export const findPruefung = id => PRUEFUNGEN.find(p => p.id === id);
// Bestanden wie in der echten Prüfung: ab 50 Punkten „ausreichend“
export const PRUEF_NEED = 0.5;
export const pruefDoneId = p => `${p.id}-schule`;

export const XP_SCHULE = { lesson: 10, perfect: 5, test: 20, fach: 10, pruefung: 30 };
export const TEST_COUNT = 10;
