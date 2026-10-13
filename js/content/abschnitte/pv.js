// Abschnitt 9: Photovoltaik
export default {
  id: 'pv',
  title: 'Photovoltaik',
  short: 'Photovoltaik',
  icon: 'sun',
  intro: 'Anlagengröße, Strings, Dachplanung mit Randabständen, Anmeldung und Messkonzept.',
  karte: [
    'Anlagenleistung in kWp = Anzahl der Module × Modulleistung.',
    'Faustwert für Deutschland: etwa 900 bis 1.100 kWh je kWp im Jahr bei Südausrichtung.',
    'Module in Reihe bilden einen String. Die Spannungen addieren sich, bei Kälte steigt die Leerlaufspannung.',
    'String auslegen: Uoc bei −10 °C muss unter der maximalen DC-Spannung des Wechselrichters bleiben, Umpp bei 70 °C über der unteren MPP-Grenze.',
    'Module eines Strings liegen nebeneinander. Plus- und Minusleitung eng parallel führen, PV-Steckverbinder nie unter Last trennen.',
    'Am Dachrand und in den Ecken wirken die größten Windsoglasten (DIN EN 1991-1-4). Die Abstände legen Statik und Montagesystem fest.',
    'Anmeldung beim Netzbetreiber, Eintrag ins Marktstammdatenregister innerhalb eines Monats nach Inbetriebnahme.',
    'Über 7 kW installierter Leistung ist ein intelligentes Messsystem Pflicht. DC-Seite mit Solarleitung H1Z2Z2-K.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Anlage berechnen',
      items: [
        { t: 'num', q: '20 Module mit je 430 Wp: Wie groß ist die Anlage?', r: 8.6, tol: 0.01, unit: 'kWp', x: '20 × 430 Wp = 8.600 Wp = 8,6 kWp.' },
        { t: 'num', q: 'Die Anlage mit 8,6 kWp bringt rund 950 kWh je kWp. Wie viel Strom erzeugt sie im Jahr?', r: 8170, tol: 10, unit: 'kWh',
          x: '8,6 kWp · 950 kWh/kWp = 8.170 kWh.' },
        { t: 'choice', q: 'Was passiert mit der Spannung, wenn Module in Reihe geschaltet werden?',
          a: ['Die Spannungen addieren sich', 'Die Ströme addieren sich', 'Die Spannung halbiert sich', 'Nichts'], r: 0,
          x: 'Bei Parallelschaltung addieren sich dagegen die Ströme.' },
        { t: 'tf', q: 'Bei Kälte steigt die Leerlaufspannung eines Moduls.', r: true,
          x: 'Deshalb rechnest du den String für tiefe Temperaturen nach, damit der Wechselrichter nicht überlastet wird.' },
        { t: 'choice', q: 'Wo wirken auf dem Dach die größten Windsoglasten?',
          a: ['Am Rand und in den Ecken', 'In der Dachmitte', 'Unter den Modulen', 'Im Schornstein'], r: 0,
          x: 'Dort braucht das Montagesystem mehr Befestigungspunkte oder größere Abstände.' },
        { t: 'choice', q: 'Bis wann muss eine neue PV-Anlage im Marktstammdatenregister eingetragen sein?',
          a: ['Innerhalb eines Monats nach Inbetriebnahme', 'Innerhalb von fünf Jahren', 'Gar nicht', 'Vor dem Kauf der Module'], r: 0,
          x: 'Das Register führt die Bundesnetzagentur.' },
        { t: 'num', q: 'Ein String hat 12 Module mit je 37,5 V Leerlaufspannung. Wie hoch ist die Leerlaufspannung des Strings?', r: 450, tol: 0.5, unit: 'V',
          x: '12 × 37,5 V = 450 V. Bei Frost liegt sie noch höher.' },
        { t: 'choice', q: 'Welche Leitung verlegst du auf der DC-Seite?',
          a: ['Solarleitung H1Z2Z2-K', 'NYM-J', 'Klingeldraht', 'Lautsprecherkabel'], r: 0,
          x: 'Sie ist UV-beständig und für die hohen Gleichspannungen ausgelegt.' }
      ]
    },
    {
      kind: 'lektion', title: 'Planung und Betrieb',
      items: [
        { t: 'choice', q: 'Ab welcher installierten Leistung ist für eine PV-Anlage ein intelligentes Messsystem Pflicht?',
          a: ['Über 7 kW', 'Ab 1 kW', 'Ab 30 kW', 'Nie'], r: 0, x: 'So regelt es § 29 Messstellenbetriebsgesetz.' },
        { t: 'tf', q: 'Ein verschattetes Modul kann die Leistung des ganzen Strings senken.', r: true,
          x: 'Bypassdioden mildern das, besser ist es, Schatten bei der Planung zu meiden.' },
        { t: 'choice', q: 'Welche Ausrichtung bringt in Deutschland meist den höchsten Jahresertrag?',
          a: ['Süd mit rund 30 bis 35 Grad Neigung', 'Nord mit 60 Grad', 'Senkrecht nach Osten', 'Waagerecht im Schatten'], r: 0,
          x: 'Ost-West-Dächer liefern etwas weniger, dafür gleichmäßiger über den Tag.' },
        { t: 'choice', q: 'Was macht der Wechselrichter?',
          a: ['Er wandelt den Gleichstrom der Module in netzkonformen Wechselstrom', 'Er speichert Strom', 'Er misst den Verbrauch', 'Er kühlt die Module'], r: 0,
          x: 'Dazu sucht er laufend den Punkt maximaler Leistung (MPP).' },
        { t: 'tf', q: 'Die genauen Randabstände der Module legen Statik und Montagesystem fest.', r: true,
          x: 'Dazu kommen Brandschutzvorgaben der Landesbauordnung, zum Beispiel an Brandwänden.' }
      ]
    },
    {
      kind: 'lektion', key: 'strings', title: 'Strings auslegen',
      items: [
        { t: 'match', q: 'Ordne die Werte aus dem Moduldatenblatt zu.',
          a: [['Uoc', 'Leerlaufspannung ohne Last'], ['Isc', 'Kurzschlussstrom'], ['Umpp', 'Spannung im Punkt maximaler Leistung'], ['Wp', 'Leistung unter Standard-Testbedingungen']],
          x: 'Standard-Testbedingungen (STC) heißen 1.000 W/m² Einstrahlung und 25 °C Zelltemperatur.' },
        { t: 'choice', q: 'Warum rechnest du die Stringspannung für Kälte nach?',
          a: ['Bei Kälte steigt die Leerlaufspannung und darf die maximale DC-Spannung des Wechselrichters nicht überschreiten', 'Bei Kälte sinkt der Strom auf null', 'Weil Schnee die Module kurzschließt', 'Weil der Wechselrichter bei Kälte abschaltet'], r: 0,
          x: 'Kritisch ist ein klarer, kalter Wintermorgen: Sonne auf kalte Zellen, der Wechselrichter läuft noch nicht und zieht keinen Strom.' },
        { t: 'num', q: 'Ein Modul hat bei 25 °C eine Leerlaufspannung von 38,6 V. Der Temperaturkoeffizient ist −0,27 %/K. Wie hoch ist Uoc bei −10 °C? Auf eine Nachkommastelle.', r: 42.2, tol: 0.1, unit: 'V',
          x: '35 K kälter · 0,27 %/K = 9,45 % mehr. 38,6 V · 1,0945 = 42,2 V.' },
        { t: 'num', q: 'Der Wechselrichter verträgt höchstens 1.000 V DC. Wie viele Module mit 42,25 V bei −10 °C darfst du höchstens in Reihe schalten?', r: 23, tol: 0, unit: 'Module',
          x: '1.000 V : 42,25 V = 23,7. Abgerundet sind das 23 Module. Liegt die obere MPP-Grenze niedriger, wird es noch weniger.' },
        { t: 'num', q: 'An heißen Tagen sinkt Umpp auf 27,9 V je Modul. Der MPP-Bereich des Wechselrichters beginnt bei 200 V. Wie viele Module braucht ein String mindestens?', r: 8, tol: 0, unit: 'Module',
          x: '200 V : 27,9 V = 7,2. Aufgerundet sind das 8 Module. Mit weniger fällt der String im Sommer aus dem MPP-Bereich.' },
        { t: 'tf', q: 'Strings an zwei verschiedenen MPP-Trackern dürfen unterschiedlich lang sein.', r: true,
          x: 'Jeder Tracker sucht seinen eigenen Arbeitspunkt. Parallele Strings am selben Tracker müssen dagegen gleich lang und gleich ausgerichtet sein.' },
        { t: 'choice', q: 'Einige Module liegen nachmittags im Schatten. Wie verschaltest du sie am besten?',
          a: ['Auf einen eigenen String an einem eigenen MPP-Tracker', 'Mit allen anderen in einen langen String', 'Parallel zu einem fremden String', 'Gar nicht, sie bleiben lose liegen'], r: 0,
          x: 'So bremst der Schatten die übrigen Module nicht aus. Noch besser ist es, verschattete Flächen gar nicht erst zu belegen.' },
        { t: 'tf', q: 'Plus- und Minusleitung eines Strings führst du möglichst eng nebeneinander.', r: true,
          x: 'Eine kleine Leiterschleife nimmt bei einem Blitzeinschlag in der Nähe weniger Überspannung auf.' },
        { t: 'tf', q: 'PV-Steckverbinder darfst du unter Last trennen.', r: false,
          x: 'Ein Gleichstrom-Lichtbogen erlischt nicht von selbst. Erst den DC-Lasttrennschalter am Wechselrichter öffnen, dann trennen.' },
        { t: 'order', q: 'Bringe die Schritte der Stringplanung in die richtige Reihenfolge.',
          a: ['Datenblätter von Modul und Wechselrichter lesen', 'Leerlaufspannung bei Kälte berechnen', 'Höchstzahl der Module je String bestimmen', 'MPP-Spannung bei Hitze prüfen', 'Strings auf die MPP-Tracker verteilen'],
          x: 'Danach planst du die Leitungswege so, dass die Module eines Strings nebeneinander liegen.' }
      ]
    },
    { kind: 'praxis', title: 'Dach belegen und verschalten', module: 'pv', task: 'standard' },
    { kind: 'test', title: 'Abschnittstest Photovoltaik' }
  ]
};
