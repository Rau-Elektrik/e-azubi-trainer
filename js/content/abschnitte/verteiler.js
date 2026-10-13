// Abschnitt 4: Verteiler bestücken
export default {
  id: 'verteiler',
  title: 'Verteiler bestücken',
  short: 'Verteiler',
  icon: 'cabinet',
  intro: 'Hauptschalter, Überspannungsschutz, FI und LS richtig anordnen und Stromkreise sinnvoll aufteilen.',
  karte: [
    'Reihenfolge ab der Einspeisung: Hauptschalter, Überspannungsschutz, FI-Schutzschalter, dahinter die LS-Schalter.',
    'Steckdosen bis 32 A für Laien: FI mit höchstens 30 mA.',
    'Stromkreise auf mehrere FI verteilen, damit ein Fehler nicht die ganze Wohnung abschaltet.',
    'Eine Teilungseinheit (TE) ist 17,5 mm breit. Die Geräte sitzen auf der 35-mm-Hutschiene.',
    'Geräte ab 2 kW wie Herd, Waschmaschine und Geschirrspüler bekommen einen eigenen Stromkreis (DIN 18015-1).',
    'FI Typ AC ist in Deutschland für neue Anlagen nicht zulässig. Jeder Stromkreis wird beschriftet.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Aufbau eines Verteilers',
      items: [
        { t: 'order', q: 'In welcher Reihenfolge sitzen die Geräte ab der Einspeisung?',
          a: ['Hauptschalter', 'Überspannungsschutz Typ 2', 'FI-Schutzschalter', 'LS-Schalter'],
          x: 'Der Überspannungsschutz sitzt vor den FI, damit Ableitströme den FI nicht auslösen.' },
        { t: 'num', q: 'Wie breit sind 12 Teilungseinheiten in Millimetern?', r: 210, tol: 0.5, unit: 'mm',
          x: '1 TE = 17,5 mm, also 12 × 17,5 mm = 210 mm.' },
        { t: 'choice', q: 'Warum verteilt man die Stromkreise auf mehrere FI-Schutzschalter?',
          a: ['Damit bei einem Fehler nicht die ganze Wohnung ausfällt', 'Weil ein FI höchstens drei LS haben darf', 'Wegen der Optik', 'Weil der Netzbetreiber es plombiert'], r: 0,
          x: 'Außerdem addieren sich die Ableitströme vieler Geräte an einem einzigen FI.' },
        { t: 'choice', q: 'Welcher FI-Typ ist in Deutschland für neue Anlagen nicht zulässig?',
          a: ['Typ AC', 'Typ A', 'Typ F', 'Typ B'], r: 0,
          x: 'Typ AC erkennt pulsierende Fehlerströme heutiger Geräte nicht sicher.' },
        { t: 'tf', q: 'Der Herd wird über einen 3-poligen LS angeschlossen, typisch 3 × B16.', r: true,
          x: 'Die Zuleitung ist meist 5 × 2,5 mm².' },
        { t: 'choice', q: 'Welche Charakteristik nimmt man für den Leitungsschutz in Wohnungen?',
          a: ['B', 'C', 'D', 'K'], r: 0,
          x: 'C und D sind für hohe Einschaltströme, etwa bei Motoren oder Trafos.' },
        { t: 'tf', q: 'Waschmaschine und Geschirrspüler dürfen sich einen Stromkreis teilen.', r: false,
          x: 'Nach DIN 18015-1 bekommt jedes Gerät ab 2 kW einen eigenen Stromkreis.' },
        { t: 'choice', q: 'Wofür steht die Abkürzung AFDD?',
          a: ['Fehlerlichtbogen-Schutzeinrichtung (Brandschutzschalter)', 'FI mit doppelter Erkennung', 'Ableiter für Direkteinschläge', 'Abschaltung für Drehstromdosen'], r: 0,
          x: 'Sie erkennt Fehlerlichtbögen, etwa an gequetschten Leitungen oder losen Klemmen.' }
      ]
    },
    { kind: 'praxis', title: 'Wohnungsverteiler bestücken', module: 'verteiler', task: 'wohnung' },
    { kind: 'test', title: 'Abschnittstest Verteiler' }
  ]
};
