// Fächer der Berufsschule. Jede Aufgabe im Bereich Berufsschule gehört zu genau einem Fach (f).
// Die Lernfelder bündeln den Stoff nach Arbeitsaufträgen, die Fächer nach Art der Aufgabe.
export const FAECHER = [
  { id: 'fk', title: 'Fachkunde', text: 'Technologie: Bauteile, Anlagen, Normen und Schutzmaßnahmen.', icon: 'book' },
  { id: 'fr', title: 'Fachrechnen', text: 'Technische Mathematik mit Formel, Einheit und Ergebnis.', icon: 'chart' },
  { id: 'sp', title: 'Schaltpläne', text: 'Schaltzeichen, Plantypen, Kennzeichnung und Logik.', icon: 'grid' },
  { id: 'wiso', title: 'WiSo', text: 'Wirtschafts- und Sozialkunde, eigener Prüfungsbereich in Teil 2.', icon: 'user' },
  { id: 'en', title: 'Fachenglisch', text: 'Englische Fachbegriffe aus Datenblättern und Anleitungen.', icon: 'card' }
];

export const findFach = id => FAECHER.find(f => f.id === id);
