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
    { kind: 'praxis', title: 'Dachfläche belegen', module: 'pv', task: 'standard' },
    { kind: 'test', title: 'Abschnittstest Photovoltaik' }
  ]
};
