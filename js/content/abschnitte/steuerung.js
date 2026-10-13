// Abschnitt 3: Steuerungstechnik (Schütze, Motoren, Wendeschaltung)
export default {
  id: 'steuerung',
  title: 'Steuerungstechnik',
  short: 'Steuerung',
  icon: 'grid',
  intro: 'Schütz und Selbsthaltung, Drehstrommotor, Wendeschützschaltung mit Verriegelung.',
  karte: [
    'Schütz: Spule A1–A2, Hauptkontakte 1-2, 3-4, 5-6. Hilfskontakte tragen eine Ordnungs- und eine Funktionsziffer.',
    'Funktionsziffern: 1-2 Öffner, 3-4 Schließer. Am Motorschutzrelais: 95-96 Öffner, 97-98 Schließer.',
    'Selbsthaltung: Ein Hilfsschließer liegt parallel zum Ein-Taster. Der Aus-Taster liegt als Öffner davor.',
    'Aus als Öffner und Ein als Schließer: Ein Drahtbruch schaltet ab statt ein.',
    'Rechtsdrehfeld: L1 auf U1, L2 auf V1, L3 auf W1. Zwei Außenleiter tauschen ändert die Drehrichtung.',
    'Wendeschaltung: Die Schütze verriegeln sich über ihre Öffner. Ziehen beide an, gibt es einen Kurzschluss zwischen zwei Außenleitern.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Das Schütz',
      items: [
        { t: 'match', q: 'Ordne die Anschlussbezeichnungen zu.',
          a: [['A1–A2', 'Spule'], ['13-14', 'Hilfsschließer'], ['21-22', 'Hilfsöffner'], ['95-96', 'Öffner des Motorschutzrelais']],
          x: 'Die erste Ziffer ist die Ordnungsziffer, die zweite die Funktionsziffer.' },
        { t: 'choice', q: 'Welche Funktionsziffern hat ein Schließer?',
          a: ['3-4', '1-2', '5-6', '9-0'], r: 0, x: '1-2 steht für Öffner, 3-4 für Schließer.' },
        { t: 'choice', q: 'Warum ist der Aus-Taster ein Öffner?',
          a: ['Damit ein Drahtbruch die Anlage abschaltet', 'Weil Öffner billiger sind', 'Damit man ihn schneller findet', 'Das ist egal'], r: 0,
          x: 'Bei einem Öffner unterbricht ein Drahtbruch den Strompfad, das Schütz fällt ab. Das nennt man Drahtbruchsicherheit.' },
        { t: 'tf', q: 'Die Selbsthaltung entsteht durch einen Hilfsschließer des Schützes parallel zum Ein-Taster.', r: true,
          x: 'Nach dem Loslassen fließt der Strom über den eigenen Schließer weiter.' },
        { t: 'choice', q: 'Was passiert nach einem Spannungsausfall bei einer Schützschaltung mit Selbsthaltung?',
          a: ['Das Schütz fällt ab und bleibt aus', 'Die Anlage läuft von selbst wieder an', 'Der Motor dreht danach links', 'Der FI löst aus'], r: 0,
          x: 'Die Selbsthaltung ist weg. Erst ein neuer Druck auf Ein startet die Anlage wieder.' },
        { t: 'choice', q: 'Wie heißt die erste Ziffer, zum Beispiel die 2 in 23-24?',
          a: ['Ordnungsziffer', 'Polzahl', 'Spannungsziffer', 'Prüfziffer'], r: 0,
          x: 'Sie zählt die Hilfskontakte eines Geräts durch.' }
      ]
    },
    { kind: 'praxis', title: 'Selbsthaltung zeichnen', module: 'schaltplan', task: 'selbst' },
    {
      kind: 'lektion', title: 'Der Drehstrommotor',
      items: [
        { t: 'choice', q: 'Wie schließt du den Motor für Rechtslauf an?',
          a: ['L1 auf U1, L2 auf V1, L3 auf W1', 'L1 auf W1, L2 auf V1, L3 auf U1', 'Alle drei auf U1', 'Die Reihenfolge ist egal'], r: 0,
          x: 'Das ist das Rechtsdrehfeld. Die zweite Variante ergibt Linkslauf.' },
        { t: 'tf', q: 'Vertauscht man zwei Außenleiter, ändert sich die Drehrichtung.', r: true,
          x: 'Genau das macht das zweite Schütz in der Wendeschaltung.' },
        { t: 'choice', q: 'Auf dem Typenschild steht 230/400 V. Wie schaltest du den Motor am 400-V-Netz?',
          a: ['Stern', 'Dreieck', 'Parallel', 'Gar nicht'], r: 0,
          x: 'Die kleinere Spannung gilt für Dreieck, die größere für Stern. Am 400-V-Netz also Stern.' },
        { t: 'choice', q: 'Was passiert, wenn bei einem Drehstrommotor ein Außenleiter fehlt?',
          a: ['Er brummt, läuft schlecht an und wird heiß', 'Er läuft schneller', 'Er dreht links', 'Nichts'], r: 0,
          x: 'Der Motorschutz muss ihn dann abschalten.' },
        { t: 'choice', q: 'Wo sitzt der Öffner 95-96 des Motorschutzrelais?',
          a: ['Im Steuerstromkreis vor der Schützspule', 'Im Hauptstromkreis vor dem Motor', 'Parallel zum Motor', 'Im Schutzleiter'], r: 0,
          x: 'Bei Überlast öffnet er und das Schütz fällt ab.' },
        { t: 'tf', q: 'Am Motor wird immer der Schutzleiter angeschlossen.', r: true, x: 'Das Gehäuse muss geerdet sein.' }
      ]
    },
    { kind: 'praxis', title: 'Motor anschließen', module: 'schaltplan', task: 'motor' },
    {
      kind: 'lektion', title: 'Wendeschützschaltung',
      items: [
        { t: 'choice', q: 'Was tauscht das Schütz für Linkslauf?',
          a: ['Zwei Außenleiter', 'N und PE', 'Alle drei Außenleiter', 'Spule und Kontakt'], r: 0,
          x: 'Meist werden L1 und L3 getauscht, L2 bleibt.' },
        { t: 'choice', q: 'Was passiert ohne Verriegelung, wenn beide Schütze anziehen?',
          a: ['Kurzschluss zwischen zwei Außenleitern', 'Der Motor bleibt stehen', 'Der Motor läuft doppelt so schnell', 'Nichts'], r: 0,
          x: 'Die Sicherung löst aus, im schlimmsten Fall verschweißen die Kontakte.' },
        { t: 'choice', q: 'Wie verriegelt man die Schütze gegenseitig?',
          a: ['Ein Öffner des einen Schützes liegt im Strompfad des anderen', 'Ein Schließer parallel zum Aus-Taster', 'Mit einer zweiten Sicherung', 'Mit einem FI'], r: 0,
          x: 'Das nennt man Schützverriegelung. Oft kommt eine Tasterverriegelung dazu.' },
        { t: 'tf', q: 'Liegt der Öffner eines Schützes in seinem eigenen Strompfad, flattert das Schütz.', r: true,
          x: 'Es zieht an, öffnet damit den eigenen Strompfad, fällt ab und zieht wieder an.' },
        { t: 'order', q: 'Umsteuern von Rechts- auf Linkslauf bei Schützverriegelung:',
          a: ['Aus-Taster drücken', 'Motor kommt zum Stillstand', 'Taster für Linkslauf drücken', 'Schütz für Linkslauf zieht an'],
          x: 'Solange das eine Schütz angezogen ist, sperrt sein Öffner das andere.' }
      ]
    },
    { kind: 'praxis', title: 'Wendeschaltung zeichnen', module: 'schaltplan', task: 'wende' },
    { kind: 'test', title: 'Abschnittstest Steuerung' }
  ]
};
