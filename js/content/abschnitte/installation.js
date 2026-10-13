// Abschnitt 2: Installationsschaltungen (mit Praxis im Schaltplan-Trainer)
export default {
  id: 'installation',
  title: 'Installationsschaltungen',
  short: 'Installation',
  icon: 'bolt',
  intro: 'Von der Ausschaltung bis zum Treppenlicht: Stromlaufpläne selbst zeichnen und prüfen.',
  karte: [
    'Geschaltet wird immer der Außenleiter. Der Neutralleiter geht direkt zum Verbraucher.',
    'Ausschaltung: eine Schaltstelle. Serienschaltung: zwei Wippen mit gemeinsamem Eingang P für zwei Lampengruppen.',
    'Wechselschaltung: zwei Schaltstellen, zwei korrespondierende Adern zwischen den Wechselschaltern.',
    'Kreuzschaltung: ab drei Schaltstellen. Die Kreuzschalter sitzen zwischen den beiden Wechselschaltern.',
    'Stromstoßschaltung: alle Taster parallel auf die Spule A1. Der Kontakt 1-2 schaltet die Leuchte und hält seine Stellung.',
    'Treppenlichtschaltung: Die Taster geben L auf Klemme 3. Der Zeitschalter schaltet die Leuchten am Ausgang ↑ für die Nachlaufzeit ein.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Schalter und Schaltstellen',
      items: [
        { t: 'match', q: 'Ordne jede Schaltung ihrem Einsatz zu.',
          a: [['Ausschaltung', 'eine Schaltstelle'], ['Wechselschaltung', 'zwei Schaltstellen'], ['Kreuzschaltung', 'drei oder mehr Schaltstellen'], ['Serienschaltung', 'zwei Lampengruppen von einer Stelle']],
          x: 'Für viele Schaltstellen ist die Stromstoßschaltung oft einfacher als eine lange Kreuzschaltung.' },
        { t: 'choice', q: 'Welcher Leiter wird vom Schalter unterbrochen?',
          a: ['Der Außenleiter L', 'Der Neutralleiter N', 'Der Schutzleiter PE', 'Das ist egal'], r: 0,
          x: 'Liegt der Schalter im N, bleibt die Leuchte auch ausgeschaltet unter Spannung.' },
        { t: 'choice', q: 'Wie viele Adern laufen zwischen zwei Wechselschaltern, ohne PE gezählt?',
          a: ['Zwei korrespondierende Adern', 'Eine', 'Drei', 'Vier'], r: 0,
          x: 'Die beiden Korrespondierenden verbinden die Klemmen 1 und 2 der Schalter.' },
        { t: 'choice', q: 'Wo sitzt der Kreuzschalter in einer Kreuzschaltung?',
          a: ['In den korrespondierenden Adern zwischen den Wechselschaltern', 'Direkt an L vor dem ersten Schalter', 'Zwischen Leuchte und N', 'Parallel zur Leuchte'], r: 0,
          x: 'Außen sitzen immer die beiden Wechselschalter.' },
        { t: 'tf', q: 'Bei der Stromstoßschaltung liegen alle Taster parallel.', r: true,
          x: 'Jeder Taster gibt L auf die Spule A1. So lassen sich beliebig viele Schaltstellen anschließen.' },
        { t: 'tf', q: 'Am Serienschalter hängen beide Leuchten am selben Ausgang.', r: false,
          x: 'Jede Wippe hat ihren eigenen Ausgang: 1 für die eine Lampengruppe, 2 für die andere.' }
      ]
    },
    { kind: 'praxis', title: 'Ausschaltung zeichnen', module: 'schaltplan', task: 'aus' },
    { kind: 'praxis', title: 'Serienschaltung zeichnen', module: 'schaltplan', task: 'serie' },
    { kind: 'praxis', title: 'Wechselschaltung zeichnen', module: 'schaltplan', task: 'wechsel' },
    { kind: 'praxis', title: 'Kreuzschaltung zeichnen', module: 'schaltplan', task: 'kreuz' },
    {
      kind: 'lektion', title: 'Taster, Fernschalter und Zeitschalter',
      items: [
        { t: 'choice', q: 'Was wird an Klemme 3 eines Treppenlicht-Zeitschalters angeschlossen?',
          a: ['Die Taster', 'Die Leuchten', 'Der Neutralleiter', 'Der Schutzleiter'], r: 0,
          x: 'Bei der Vierleiterschaltung geben die Taster L auf Klemme 3. Die Leuchten hängen am Ausgang ↑.' },
        { t: 'choice', q: 'Warum ist die Stromstoßschaltung bei vielen Schaltstellen praktisch?',
          a: ['Beliebig viele Taster lassen sich parallel anschließen', 'Sie braucht keinen Neutralleiter', 'Sie kommt ohne Spule aus', 'Sie ist immer billiger'], r: 0,
          x: 'Zu jeder neuen Schaltstelle reicht ein weiterer Taster parallel.' },
        { t: 'order', q: 'Wie läuft ein Schaltvorgang beim Stromstoßschalter ab?',
          a: ['Taster wird gedrückt', 'Spule A1–A2 bekommt Spannung', 'Kontakt 1-2 wechselt die Stellung', 'Taster wird losgelassen', 'Kontakt hält seine Stellung'],
          x: 'Der Stromstoßschalter merkt sich seine Stellung bis zum nächsten Impuls.' },
        { t: 'tf', q: 'Ein Treppenlicht-Zeitschalter kommt ohne Neutralleiter aus.', r: false,
          x: 'Er braucht L und N als Versorgung, sonst schaltet er nicht.' },
        { t: 'choice', q: 'Was passiert, wenn jemand während der Nachlaufzeit erneut drückt?',
          a: ['Die Nachlaufzeit beginnt von vorn', 'Das Licht geht sofort aus', 'Nichts', 'Der Zeitschalter fällt aus'], r: 0,
          x: 'Ein nachschaltbarer Zeitschalter startet die Zeit bei jedem Tastendruck neu.' },
        { t: 'multi', q: 'Was brauchst du für eine Stromstoßschaltung mit drei Schaltstellen?',
          a: ['Drei Taster', 'Einen Stromstoßschalter mit Spule und Kontakt', 'Eine Leuchte', 'Zwei Wechselschalter', 'Einen Kreuzschalter'], r: [0, 1, 2],
          x: 'Wechsel- und Kreuzschalter brauchst du hier nicht.' }
      ]
    },
    { kind: 'praxis', title: 'Stromstoßschaltung zeichnen', module: 'schaltplan', task: 'stoss' },
    { kind: 'praxis', title: 'Treppenlicht zeichnen', module: 'schaltplan', task: 'treppe' },
    { kind: 'test', title: 'Abschnittstest Installation' }
  ]
};
