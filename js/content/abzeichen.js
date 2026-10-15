// Abzeichen: werden nach jeder Lektion geprüft. test(state) entscheidet, ob es verdient ist.
import { ABSCHNITTE } from './kurs.js';
import { JAHRE, WISO, PRUEFUNGEN, lernfelderOfYear, pruefDoneId } from './schule/index.js';

export const ABZEICHEN = [
  { id: 'start', title: 'Erste Lektion', text: 'Die erste Lektion geschafft.', icon: 'bolt', test: s => s.stats.lessons >= 1 },
  { id: 'serie3', title: '3 Tage am Stück', text: 'Drei Tage in Folge gelernt.', icon: 'star', test: s => s.streak.count >= 3 },
  { id: 'serie7', title: 'Eine Woche dran', text: 'Sieben Tage in Folge gelernt.', icon: 'star', test: s => s.streak.count >= 7 },
  { id: 'perfekt5', title: 'Fehlerfrei', text: 'Fünf Lektionen ohne Fehler.', icon: 'check', test: s => s.stats.perfect >= 5 },
  { id: 'praxis5', title: 'Praktiker', text: 'Fünf Praxisaufgaben gelöst.', icon: 'tool', test: s => s.stats.practice >= 5 },
  { id: 'xp500', title: '500 XP', text: '500 Erfahrungspunkte gesammelt.', icon: 'bolt', test: s => s.xp >= 500 },
  { id: 'xp2000', title: '2.000 XP', text: '2.000 Erfahrungspunkte gesammelt.', icon: 'bolt', test: s => s.xp >= 2000 }
].concat(ABSCHNITTE.map(a => ({
  id: 'ab-' + a.id, title: a.short + ' gemeistert', text: `Abschnittstest ${a.title} bestanden.`, icon: a.icon,
  test: s => !!s.done[a.nodes[a.nodes.length - 1].id]
}))).concat(JAHRE.map(j => ({
  id: 'bs-jahr' + j.nr, title: `${j.title} geschafft`, text: `Alle Lernfeldtests im ${j.title} bestanden.`, icon: 'school',
  test: s => lernfelderOfYear(j.nr).every(b => !!s.done[b.testId])
})), [
  { id: 'bs-wiso', title: 'WiSo sicher', text: 'Den WiSo-Test bestanden.', icon: 'user', test: s => !!s.done[WISO.testId] }
], PRUEFUNGEN.map(p => ({
  id: 'bs-' + p.id, title: `${p.title} geübt`, text: `Das Prüfungstraining ${p.title} bestanden.`, icon: 'shield',
  test: s => !!s.done[pruefDoneId(p)]
})));
