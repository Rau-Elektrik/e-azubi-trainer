// Der Lernpfad: Abschnitte in Reihenfolge. Ein neuer Abschnitt ist eine neue Datei in ./abschnitte/
// und eine Zeile in ABSCHNITTE. Knoten-IDs entstehen automatisch: <abschnitt>-<nummer>.
import sicherheit from './abschnitte/sicherheit.js';
import installation from './abschnitte/installation.js';
import steuerung from './abschnitte/steuerung.js';
import verteiler from './abschnitte/verteiler.js';
import zaehler from './abschnitte/zaehler.js';
import messsysteme from './abschnitte/messsysteme.js';
import erdung from './abschnitte/erdung.js';
import emob from './abschnitte/emob.js';
import pv from './abschnitte/pv.js';

export const ABSCHNITTE = [sicherheit, installation, steuerung, verteiler, zaehler, messsysteme, erdung, emob, pv];

ABSCHNITTE.forEach((s, si) => {
  s.nr = si + 1;
  s.nodes.forEach((n, ni) => { n.id = `${s.id}-${ni + 1}`; n.section = s; n.index = ni; });
});

export const allNodes = () => ABSCHNITTE.flatMap(s => s.nodes);
export const findNode = id => allNodes().find(n => n.id === id);
export const findSection = id => ABSCHNITTE.find(s => s.id === id);
// Alle Aufgaben eines Abschnitts (für den Abschnittstest)
export const sectionItems = s => s.nodes.filter(n => n.kind === 'lektion').flatMap(n => n.items);

// XP-Regeln
export const XP = {
  lesson: 10, perfect: 5,
  practice: stars => 10 + 5 * stars,
  testPass: 20, testCount: 10, testNeed: 0.8
};
