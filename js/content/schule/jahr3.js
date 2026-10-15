// Berufsschule, 3. Ausbildungsjahr, Fachrichtung Energie- und Gebäudetechnik: Lernfelder 9 bis 11.
export default [
  {
    id: 'lf9', nr: 9, jahr: 3, stunden: 100,
    title: 'Kommunikation von Systemen in Wohn- und Zweckbauten planen und realisieren',
    ziel: 'Gebäudesystemtechnik, Türkommunikation, Gefahrenmeldeanlagen, Rauchwarnmelder, Antennen- und Breitbandanlagen.',
    karte: [
      'KNX-Linie: bis 1.000 m Leitung, höchstens 350 m von der Spannungsversorgung zum Teilnehmer, keine Ringe.',
      'Fernzugriff auf KNX nur über VPN oder gesicherte Dienste, nie über offene Ports. KNX Secure verschlüsselt.',
      'Rauchwarnmelder nach DIN 14676-1: Schlafräume, Kinderzimmer und Flure als Rettungswege, Deckenmitte, mindestens 50 cm von Wänden, jährliche Inspektion.',
      'Einbruchmeldeanlage: Außenhautüberwachung mit Kontakten und Glasbruchmeldern, Fallenüberwachung mit Bewegungsmeldern.',
      'Antennenanlage: Erdungsleiter mindestens 16 mm² Cu, Potentialausgleich der Koaxleitungen mindestens 4 mm² Cu.',
      'Pegel rechnen: Ausgangspegel minus Leitungsdämpfung minus Dosendämpfung, alles in dB.'
    ],
    lektionen: [
      {
        title: 'Gebäudesystemtechnik planen', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was ist der Hauptvorteil von KNX gegenüber einer konventionellen Installation?',
            a: ['Funktionen lassen sich ohne neue Leitungen ändern und verknüpfen', 'Es braucht keine 230-V-Leitungen mehr', 'Es ist immer billiger', 'Es braucht keine Planung'], r: 0,
            x: 'Taster und Aktoren sind über den Bus verbunden. Was ein Taster schaltet, legt die Programmierung fest.' },
          { t: 'choice', q: 'Wie lang darf die Busleitung einer KNX-Linie insgesamt höchstens sein?',
            a: ['1.000 m', '100 m', '350 m', '10 km'], r: 0,
            x: 'Zwischen Spannungsversorgung und Teilnehmer höchstens 350 m, zwischen zwei Teilnehmern höchstens 700 m.' },
          { t: 'choice', q: 'Welche Topologie ist bei KNX TP nicht erlaubt?',
            a: ['Ein geschlossener Ring', 'Eine Linie', 'Ein Baum', 'Ein Stern'], r: 0,
            x: 'Linie, Baum und Stern lassen sich frei kombinieren. Ringe stören die Telegrammübertragung.' },
          { t: 'choice', q: 'Der Kunde will seine KNX-Anlage vom Handy aus bedienen. Wie richtest du den Fernzugriff ein?',
            a: ['Über ein VPN oder einen gesicherten Fernzugriffsdienst', 'Port 3671 am Router ins Internet freigeben', 'Gar nicht, das geht bei KNX nicht', 'Über eine offene WLAN-Verbindung'], r: 0,
            x: 'Offene KNX-Ports werden im Internet gezielt gesucht. Ein Angreifer könnte dann Licht, Jalousien und Türen steuern.' },
          { t: 'tf', q: 'KNX Secure verschlüsselt die Telegramme auf dem Bus und im IP-Netz.', r: true,
            x: 'Dafür braucht es Geräte, die KNX Secure unterstützen, und eine sorgfältige Verwaltung der Schlüssel.' },
          { t: 'choice', q: 'Welchen Nachteil haben Funk-Smart-Home-Systeme gegenüber KNX TP?',
            a: ['Batterien, begrenzte Reichweite und mögliche Funkstörungen', 'Sie brauchen mehr Leitungen', 'Sie sind nur für Industrie zugelassen', 'Sie lassen sich nicht nachrüsten'], r: 0,
            x: 'Funk ist gut für die Nachrüstung. Im Neubau ist die Busleitung meist die zuverlässigere Wahl.' },
          { t: 'choice', q: 'Wozu dient eine Visualisierung in der Gebäudeautomation?',
            a: ['Zustände anzeigen, Werte darstellen und die Anlage bedienen', 'Die Busspannung erzeugen', 'Den FI ersetzen', 'Leitungen prüfen'], r: 0,
            x: 'Zum Beispiel Energieverbrauch, offene Fenster oder Raumtemperaturen auf einem Touchpanel.' }
        ]
      },
      {
        title: 'Türkommunikation und Rufanlagen', fach: 'fk',
        items: [
          { t: 'choice', q: 'Welchen Vorteil hat eine Türsprechanlage mit 2-Draht-Bus bei der Modernisierung?',
            a: ['Vorhandene Klingelleitungen lassen sich oft weiter nutzen', 'Sie braucht keine Spannungsversorgung', 'Sie funktioniert ohne Leitungen', 'Sie ist immer eine IP-Anlage'], r: 0,
            x: 'Über zwei Adern laufen Sprache, Video und Versorgung. Neue Leitungen ins ganze Haus entfallen.' },
          { t: 'choice', q: 'Eine IP-Türstation wird über das Netzwerkkabel mit Strom versorgt. Wie heißt das?',
            a: ['Power over Ethernet (PoE)', 'Powerline', 'DALI', 'Phantomspeisung'], r: 0,
            x: 'Der Switch muss PoE liefern und genug Leistung für alle angeschlossenen Geräte haben.' },
          { t: 'choice', q: 'Wie viel Leistung stellt ein Switch-Port nach PoE (IEEE 802.3af) höchstens bereit?',
            a: ['15,4 W', '1,5 W', '90 W', '230 W'], r: 0,
            x: 'PoE+ (802.3at) liefert bis 30 W, PoE++ (802.3bt) bis 90 W.' },
          { t: 'tf', q: 'Ein Klingeltransformator ist ein Sicherheitstransformator und liefert Kleinspannung.', r: true,
            x: 'Deshalb dürfen Taster und Klingel mit Kleinspannung betrieben werden. Er sitzt im Verteiler auf der Hutschiene.' },
          { t: 'choice', q: 'Was gilt für eine Videokamera an der Haustür nach dem Datenschutz?',
            a: ['Sie darf nur den eigenen Bereich erfassen, nicht dauerhaft den öffentlichen Gehweg', 'Sie darf die ganze Straße filmen', 'Aufnahmen dürfen beliebig veröffentlicht werden', 'Datenschutz gilt an der Haustür nicht'], r: 0,
            x: 'Berate den Kunden zu Blickwinkel, Speicherung und einem Hinweisschild.' },
          { t: 'choice', q: 'Nach welcher Norm werden Rufanlagen in Krankenhäusern und Pflegeheimen errichtet?',
            a: ['DIN VDE 0834', 'DIN VDE 0100-701', 'DIN 18014', 'VDE-AR-N 4105'], r: 0,
            x: 'Rufanlagen müssen besonders zuverlässig sein. Die Norm regelt Aufbau, Betrieb und Prüfung.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe zu.',
            a: [['door intercom', 'Türsprechanlage'], ['door opener', 'Türöffner'], ['bell push', 'Klingeltaster'], ['indoor station', 'Innenstation']],
            x: 'Die Außenstation heißt „outdoor station“ oder „door station“.' }
        ]
      },
      {
        title: 'Gefahrenmeldeanlagen und Rauchwarnmelder', fach: 'fk',
        items: [
          { t: 'multi', q: 'Wo verlangen die Landesbauordnungen in Wohnungen Rauchwarnmelder?',
            a: ['In Schlafräumen', 'In Kinderzimmern', 'In Fluren, die als Rettungsweg dienen', 'In der Küche als Pflicht'], r: [0, 1, 2],
            x: 'In der Küche drohen Fehlalarme durch Kochdunst. Dort ist ein Wärmemelder besser.' },
          { t: 'choice', q: 'Wo montierst du einen Rauchwarnmelder im Raum?',
            a: ['Möglichst in der Deckenmitte, mindestens 50 cm von Wänden und Einbauten', 'Direkt in der Raumecke', 'Unten an der Wand', 'Neben dem Fenster'], r: 0,
            x: 'Rauch steigt nach oben und verteilt sich unter der Decke. In Ecken bilden sich tote Luftpolster.' },
          { t: 'choice', q: 'Wie oft müssen Rauchwarnmelder nach DIN 14676-1 inspiziert werden?',
            a: ['Alle 12 Monate (± 3 Monate)', 'Alle 5 Jahre', 'Nur beim Batteriewechsel', 'Nie'], r: 0,
            x: 'Geprüft werden Funktion, freie Raucheintrittsöffnungen und die Umgebung des Melders.' },
          { t: 'tf', q: 'Bei vernetzten Rauchwarnmeldern alarmieren alle Melder, wenn einer Rauch erkennt.', r: true,
            x: 'Sinnvoll in großen Wohnungen und Häusern mit mehreren Etagen: Man hört den Alarm auch im Schlafzimmer oben.' },
          { t: 'match', q: 'Ordne die Überwachungsart einer Einbruchmeldeanlage zu.',
            a: [['Außenhautüberwachung', 'Magnetkontakte und Glasbruchmelder an Fenstern und Türen'], ['Fallenüberwachung', 'Bewegungsmelder im Inneren'], ['Objektüberwachung', 'Sicherung eines einzelnen Gegenstands, etwa eines Tresors']],
            x: 'Die Außenhaut meldet schon den Versuch, ins Haus einzudringen. Die Falle meldet, wenn jemand drin ist.' },
          { t: 'choice', q: 'Welche Gefahrenmeldeanlagen darfst du nach der Ausbildungsordnung als Elektroniker errichten?',
            a: ['Anlagen ohne externe Aufschaltung, etwa Rauchwarnmelder und Hausalarmanlagen', 'Brandmeldeanlagen mit Aufschaltung zur Feuerwehr ohne weitere Zertifizierung', 'Gar keine', 'Nur Anlagen der Polizei'], r: 0,
            x: 'Für Brandmeldeanlagen mit Aufschaltung gelten DIN 14675 und eine Zertifizierung des Fachbetriebs.' },
          { t: 'choice', f: 'en', q: 'Was bedeutet „smoke alarm“?',
            a: ['Rauchwarnmelder', 'Feuerlöscher', 'Notausgang', 'Sprinkler'], r: 0,
            x: 'Der Wärmemelder heißt „heat detector“, der Feuerlöscher „fire extinguisher“.' }
        ]
      },
      {
        title: 'Antennen- und Breitbandanlagen', fach: 'fk',
        items: [
          { t: 'choice', q: 'Welchen LNB brauchst du für eine Satellitenanlage mit Multischalter?',
            a: ['Einen Quattro-LNB', 'Einen Single-LNB', 'Keinen, der Multischalter empfängt selbst', 'Einen UKW-Verstärker'], r: 0,
            x: 'Der Quattro-LNB liefert die vier Ebenen (horizontal/vertikal, High/Low) getrennt an den Multischalter.' },
          { t: 'choice', q: 'Was ist der Vorteil eines Einkabelsystems (Unicable)?',
            a: ['Mehrere Receiver lassen sich über eine einzige Leitung versorgen', 'Es braucht keinen LNB', 'Es empfängt mehr Satelliten', 'Es braucht keine Erdung'], r: 0,
            x: 'Praktisch, wenn im Bestand nur eine Koaxleitung pro Wohnung liegt.' },
          { t: 'choice', q: 'Welchen Querschnitt muss der Erdungsleiter eines Antennenmasts aus Kupfer mindestens haben?',
            a: ['16 mm²', '1,5 mm²', '4 mm²', '50 mm²'], r: 0,
            x: 'So steht es in DIN EN 60728-11. Er führt auf kurzem Weg zur Erdungsanlage.' },
          { t: 'choice', q: 'Mit welchem Querschnitt bindest du die Koaxleitungen in den Potentialausgleich ein?',
            a: ['Mindestens 4 mm² Cu', 'Mindestens 0,75 mm² Cu', 'Mindestens 16 mm² Cu', 'Gar nicht nötig'], r: 0,
            x: 'Dafür gibt es Erdungsblöcke, durch die alle Koaxleitungen geführt werden.' },
          { t: 'num', f: 'fr', q: 'Der Multischalter liefert 60 dBµV. Die Leitung ist 20 m lang mit 0,2 dB/m Dämpfung, die Dose dämpft 3 dB. Welcher Pegel kommt an?', r: 53, tol: 0, unit: 'dBµV',
            x: '60 dBµV − 20 · 0,2 dB − 3 dB = 53 dBµV. In dB wird einfach subtrahiert.' },
          { t: 'choice', q: 'Was bedeutet FTTH?',
            a: ['Die Glasfaser reicht bis in die Wohnung', 'Die Glasfaser endet am Verteilerkasten an der Straße', 'Fernsehen über Telefonleitung', 'Ein Funkstandard'], r: 0,
            x: 'Fiber to the Home. Bei FTTB endet die Faser im Keller, bei FTTC am Kabelverzweiger.' },
          { t: 'choice', q: 'Wofür steht APL bei der Telefon- und Datenleitung?',
            a: ['Abschlusspunkt Linientechnik: Übergabe vom Netzbetreiber an die Hausverkabelung', 'Antennen-Pegel-Leitung', 'Automatischer Phasenleiter', 'Ein Router-Anschluss'], r: 0,
            x: 'Bis zum APL ist der Netzbetreiber zuständig, dahinter der Eigentümer.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe zu.',
            a: [['coaxial cable', 'Koaxialkabel'], ['fibre optic cable', 'Glasfaserkabel'], ['attenuation', 'Dämpfung'], ['satellite dish', 'Parabolspiegel']],
            x: 'Der Verstärker heißt „amplifier“, der Multischalter „multiswitch“.' }
        ]
      }
    ]
  },
  {
    id: 'lf10', nr: 10, jahr: 3, stunden: 100,
    title: 'Elektrische Geräte und Anlagen der Haustechnik planen, in Betrieb nehmen und übergeben',
    ziel: 'Warmwasser und Wärmepumpe, Beleuchtung, Blitz- und Überspannungsschutz, Bad und Hausgeräte.',
    karte: [
      'Wärmemenge: Q = m · c · Δϑ. Für Wasser: c = 1,163 Wh/(kg·K).',
      'Wärmepumpe: COP = Wärmeleistung / elektrische Leistung. Steuerbare Verbraucher über 4,2 kW fallen unter § 14a EnWG.',
      'Licht: Lichtstrom in lm, Beleuchtungsstärke in lx = lm/m², Lichtausbeute in lm/W, Farbtemperatur in K. Büro: 500 lx.',
      'Überspannungsschutz: Typ 1 am Gebäudeeintritt, Typ 2 im Verteiler, Typ 3 am Endgerät.',
      'Schutzpotentialausgleich mindestens 6 mm² Cu. Fundamenterder: Maschen höchstens 20 m × 20 m.',
      'Bad: Bereich 1 über der Wanne bis 2,25 m, Bereich 2 weitere 0,6 m. Alle Stromkreise über FI 30 mA.'
    ],
    lektionen: [
      {
        title: 'Warmwasser und Wärme rechnen', fach: 'fr',
        items: [
          { t: 'num', q: 'Ein Speicher mit 80 l wird von 10 °C auf 60 °C erwärmt. Wie viel Wärme ist nötig? c = 1,163 Wh/(kg·K).', r: 4.65, tol: 0.02, unit: 'kWh',
            x: 'Q = 80 kg · 1,163 Wh/(kg·K) · 50 K = 4.652 Wh ≈ 4,65 kWh.' },
          { t: 'num', q: 'Der Speicher hat einen 2-kW-Heizstab. Wie lange dauert das Aufheizen von 4,65 kWh ohne Verluste?', r: 2.33, tol: 0.03, unit: 'h',
            x: 't = Q / P = 4,65 kWh / 2 kW ≈ 2,33 h, also etwa 2 h 20 min.' },
          { t: 'num', q: 'Ein Durchlauferhitzer mit 21 kW erwärmt Wasser um 35 K. Wie viele Liter pro Minute schafft er? c = 4,19 kJ/(kg·K).', r: 8.6, tol: 0.1, unit: 'l/min',
            x: 'ṁ = P / (c · Δϑ) = 21 kW / (4,19 kJ/(kg·K) · 35 K) ≈ 0,143 kg/s ≈ 8,6 l/min.' },
          { t: 'num', q: 'Eine Wärmepumpe hat einen COP von 4 und nimmt 2,5 kW elektrisch auf. Welche Heizleistung gibt sie ab?', r: 10, tol: 0, unit: 'kW',
            x: 'Q = COP · P_el = 4 · 2,5 kW = 10 kW. Drei Viertel der Wärme kommen aus der Umwelt.' },
          { t: 'num', q: 'Eine Wärmepumpe liefert im Jahr 12.000 kWh Wärme und braucht 3.000 kWh Strom. Wie groß ist die Jahresarbeitszahl?', r: 4, tol: 0, unit: '',
            x: 'JAZ = 12.000 kWh / 3.000 kWh = 4. Anders als der COP gilt sie für das ganze Jahr im echten Betrieb.' },
          { t: 'num', q: 'Was kostet das Aufheizen von 4,65 kWh bei 0,32 € je kWh?', r: 1.49, tol: 0.01, unit: '€',
            x: '4,65 kWh · 0,32 €/kWh ≈ 1,49 €.' }
        ]
      },
      {
        title: 'Haustechnische Anlagen', fach: 'fk',
        items: [
          { t: 'choice', q: 'Wie wird ein Durchlauferhitzer mit 21 kW angeschlossen?',
            a: ['An Drehstrom 400 V mit eigenem Stromkreis', 'An eine Schutzkontaktsteckdose', 'An 230 V über einen B16', 'An den Lichtstromkreis'], r: 0,
            x: 'Der Strom liegt bei gut 30 A je Außenleiter. Leitung und Schutzorgan werden passend bemessen.' },
          { t: 'choice', q: 'Was braucht ein offener (druckloser) Untertischspeicher?',
            a: ['Eine spezielle Überlaufarmatur', 'Ein Sicherheitsventil gegen 10 bar', 'Einen Drehstromanschluss', 'Keine Armatur'], r: 0,
            x: 'Das Wasser dehnt sich beim Erwärmen aus und tropft über den Auslauf ab. Eine normale Druckarmatur würde ihn sprengen.' },
          { t: 'choice', q: 'Was regelt § 14a EnWG für Wärmepumpen und Wallboxen über 4,2 kW?',
            a: ['Der Netzbetreiber darf die Leistung bei Netzengpässen bis auf 4,2 kW drosseln, dafür sinkt das Netzentgelt', 'Sie dürfen nur nachts laufen', 'Sie sind verboten', 'Sie brauchen keinen Zähler'], r: 0,
            x: 'Seit 2024 müssen neue steuerbare Verbrauchseinrichtungen steuerbar angeschlossen werden.' },
          { t: 'choice', q: 'Wozu dient die Schnittstelle „SG Ready“ an einer Wärmepumpe?',
            a: ['Sie erlaubt es, den Betrieb von außen anzupassen, etwa bei PV-Überschuss', 'Sie ersetzt den Fühler', 'Sie misst den COP', 'Sie ist eine Sicherung'], r: 0,
            x: 'Über zwei Kontakte kann ein Energiemanager die Wärmepumpe sperren, normal oder verstärkt laufen lassen.' },
          { t: 'tf', q: 'Am Kältemittelkreis einer Split-Klimaanlage darf nur arbeiten, wer dafür zertifiziert ist.', r: true,
            x: 'So verlangt es das Recht über fluorierte Treibhausgase. Den elektrischen Anschluss machst du, den Kältekreis der Kälteprofi.' },
          { t: 'tf', q: 'Metallene Wasser- und Heizungsrohre werden in den Schutzpotentialausgleich einbezogen.', r: true,
            x: 'Sie werden an der Haupterdungsschiene angeschlossen. Im Fehlerfall entstehen so keine gefährlichen Spannungen zwischen Rohr und Gerät.' },
          { t: 'choice', q: 'Welche Skala hat das neue EU-Energielabel für viele Haushaltsgeräte?',
            a: ['A bis G', 'A+++ bis D', '1 bis 10', 'Grün bis Rot ohne Buchstaben'], r: 0,
            x: 'Seit 2021 gilt für Kühlschränke, Spül- und Waschmaschinen, Fernseher und Leuchtmittel wieder A bis G.' },
          { t: 'choice', f: 'en', q: 'Was ist eine „heat pump“?',
            a: ['Wärmepumpe', 'Heizstab', 'Umwälzpumpe', 'Wärmetauscher'], r: 0,
            x: 'Der Wärmetauscher heißt „heat exchanger“, die Umwälzpumpe „circulation pump“.' }
        ]
      },
      {
        title: 'Beleuchtung planen', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne die lichttechnische Größe ihrer Einheit zu.',
            a: [['Lichtstrom', 'Lumen (lm)'], ['Beleuchtungsstärke', 'Lux (lx)'], ['Lichtausbeute', 'Lumen je Watt (lm/W)'], ['Farbtemperatur', 'Kelvin (K)']],
            x: '1 lx = 1 lm/m². Die Lichtausbeute sagt, wie effizient ein Leuchtmittel ist.' },
          { t: 'num', f: 'fr', q: 'Auf 20 m² fallen 4.000 lm. Wie groß ist die mittlere Beleuchtungsstärke?', r: 200, tol: 0, unit: 'lx',
            x: 'E = Φ / A = 4.000 lm / 20 m² = 200 lx.' },
          { t: 'num', f: 'fr', q: 'Eine LED-Lampe gibt 806 lm bei 7,5 W ab. Wie groß ist ihre Lichtausbeute?', r: 107.5, tol: 0.2, unit: 'lm/W',
            x: '806 lm / 7,5 W ≈ 107,5 lm/W. Eine alte Glühlampe schaffte etwa 12 lm/W.' },
          { t: 'num', f: 'fr', q: 'Ein Büro mit 40 m² soll 500 lx bekommen. Jede Leuchte hat 4.000 lm, Raumwirkungsgrad 0,6, Wartungsfaktor 0,8. Wie viele Leuchten brauchst du mindestens?', r: 11, tol: 0, unit: 'Leuchten',
            x: 'n = E · A / (Φ · η · WF) = 500 · 40 / (4.000 · 0,6 · 0,8) ≈ 10,4. Aufgerundet 11 Leuchten.' },
          { t: 'choice', q: 'Welche Beleuchtungsstärke fordert DIN EN 12464-1 für Schreib- und Bildschirmarbeit?',
            a: ['500 lx', '100 lx', '50 lx', '2.000 lx'], r: 0,
            x: 'Verkehrsflächen brauchen deutlich weniger, etwa 100 lx.' },
          { t: 'choice', q: 'Welche Farbtemperatur hat warmweißes Licht?',
            a: ['Unter 3.300 K', '4.000 bis 5.000 K', 'Über 6.500 K', 'Genau 10.000 K'], r: 0,
            x: 'Neutralweiß liegt zwischen 3.300 und 5.300 K, Tageslichtweiß darüber.' },
          { t: 'tf', q: 'Eine Sicherheitsbeleuchtung muss bei Netzausfall weiterleuchten und regelmäßig geprüft werden.', r: true,
            x: 'Sie wird aus Batterien oder einer Zentralbatterie versorgt und zeigt Fluchtwege.' }
        ]
      },
      {
        title: 'Blitz- und Überspannungsschutz, Erdung', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring den Weg des Blitzstroms beim äußeren Blitzschutz in die richtige Reihenfolge.',
            a: ['Fangeinrichtung auf dem Dach', 'Ableitung an der Fassade', 'Erdungsanlage'],
            x: 'Der Blitz wird gezielt eingefangen und außen am Gebäude in die Erde abgeleitet.' },
          { t: 'match', q: 'Ordne den Überspannungsableiter seinem Einsatz zu.',
            a: [['Typ 1', 'Blitzstromableiter am Gebäudeeintritt'], ['Typ 2', 'Überspannungsableiter im Verteiler'], ['Typ 3', 'Geräteschutz nahe am Endgerät']],
            x: 'Hat das Gebäude einen äußeren Blitzschutz oder eine Freileitung, ist Typ 1 nötig, oft als Kombiableiter Typ 1+2.' },
          { t: 'choice', q: 'Was wird an der Haupterdungsschiene verbunden?',
            a: ['Schutzleiter, Fundamenterder und metallene Rohre für Wasser, Gas und Heizung', 'Nur der Neutralleiter', 'Nur die Antennenleitung', 'Die Außenleiter'], r: 0,
            x: 'Das ist der Schutzpotentialausgleich. Er sorgt für gleiches Potential aller leitfähigen Teile.' },
          { t: 'choice', q: 'Welchen Querschnitt hat ein Schutzpotentialausgleichsleiter aus Kupfer mindestens?',
            a: ['6 mm²', '1,5 mm²', '2,5 mm²', '95 mm²'], r: 0,
            x: 'Er muss mindestens halb so groß sein wie der größte Schutzleiter, mindestens 6 mm², höchstens 25 mm² Cu.' },
          { t: 'choice', q: 'Wie groß dürfen die Maschen eines Fundamenterders nach DIN 18014 höchstens sein?',
            a: ['20 m × 20 m', '5 m × 5 m', '50 m × 50 m', 'Es gibt keine Vorgabe'], r: 0,
            x: 'Material: Bandstahl 30 × 3,5 mm oder Rundstahl 10 mm Durchmesser.' },
          { t: 'tf', q: 'Bei wasserundurchlässigem Beton oder Perimeterdämmung wird ein Ringerder außerhalb der Bodenplatte gebraucht.', r: true,
            x: 'Der Beton oder die Dämmung isoliert den Fundamenterder vom Erdreich. Innen bleibt ein Funktionspotentialausgleichsleiter.' },
          { t: 'choice', f: 'en', q: 'Was ist ein „surge protective device (SPD)“?',
            a: ['Überspannungsschutzgerät', 'Leitungsschutzschalter', 'Hauptschalter', 'Netzteil'], r: 0,
            x: 'Der Blitzschutz heißt „lightning protection system (LPS)“.' }
        ]
      },
      {
        title: 'Bad und Hausgeräte', fach: 'fk',
        items: [
          { t: 'choice', q: 'Wie hoch reicht Bereich 1 über einer Badewanne?',
            a: ['Bis 2,25 m über dem Fußboden', 'Bis 1 m', 'Bis zur Decke, egal wie hoch', 'Bis 3 m'], r: 0,
            x: 'Bereich 0 ist das Innere der Wanne, Bereich 1 der Raum darüber.' },
          { t: 'choice', q: 'Wie weit reicht Bereich 2 waagerecht über Bereich 1 hinaus?',
            a: ['0,6 m', '1,2 m', '0,3 m', '2 m'], r: 0,
            x: 'Bei bodengleichen Duschen ohne Wanne gilt eine eigene Regel für Bereich 1 von 1,2 m um den Brausekopf.' },
          { t: 'choice', q: 'Welche Schutzart brauchen Betriebsmittel in den Bereichen 1 und 2 mindestens?',
            a: ['IPX4', 'IPX0', 'IP20', 'IPX8'], r: 0,
            x: 'Wo mit Strahlwasser gereinigt wird, etwa in öffentlichen Bädern, IPX5.' },
          { t: 'tf', q: 'Alle Stromkreise im Bad werden über einen FI mit höchstens 30 mA geschützt.', r: true,
            x: 'So verlangt es DIN VDE 0100-701 für Räume mit Badewanne oder Dusche.' },
          { t: 'choice', q: 'Wo darf eine normale Schutzkontaktsteckdose im Bad hin?',
            a: ['Außerhalb der Bereiche 0, 1 und 2', 'In Bereich 1 neben der Wanne', 'In Bereich 0', 'Überall, wenn sie einen Klappdeckel hat'], r: 0,
            x: 'In Bereich 2 ist nur eine Rasiersteckdose mit Trenntransformator oder SELV erlaubt.' },
          { t: 'choice', q: 'Ab welcher Anschlussleistung bekommt ein Gerät nach DIN 18015-1 einen eigenen Stromkreis?',
            a: ['Ab 2 kW', 'Ab 200 W', 'Ab 10 kW', 'Nie'], r: 0,
            x: 'Waschmaschine, Trockner, Spülmaschine und Backofen bekommen deshalb eigene Stromkreise.' },
          { t: 'choice', q: 'Wie schließt du einen Elektroherd in der Regel an?',
            a: ['Drehstrom mit 5 × 2,5 mm² und 3 × 16 A', 'An eine Schutzkontaktsteckdose', 'Mit 3 × 1,5 mm² an B10', 'An den Lichtstromkreis'], r: 0,
            x: 'Herdanschlussdose in der unteren Installationszone. Die Brücken am Herd richten sich nach der Anleitung.' },
          { t: 'choice', q: 'Wohin gehört ein ausgebautes Elektroaltgerät?',
            a: ['Zu einer Sammelstelle oder zur Rücknahme nach dem ElektroG', 'In den Restmüll', 'In den gelben Sack', 'In den Bauschutt'], r: 0,
            x: 'Altgeräte enthalten Wertstoffe und Schadstoffe. Händler und Kommunen müssen sie zurücknehmen.' }
        ]
      }
    ]
  },
  {
    id: 'lf11', nr: 11, jahr: 3, stunden: 80,
    title: 'Energietechnische Systeme errichten, in Betrieb nehmen und instand halten',
    ziel: 'Netze und Transformatoren, Kompensation, Photovoltaik und Speicher, E-Mobilität, Schaltgeräte und USV.',
    karte: [
      'Schaltgruppe Dyn5: Oberspannung Dreieck, Unterspannung Stern mit herausgeführtem Neutralleiter, 150° Phasenverschiebung.',
      'S = P / cos φ, Q = S · sin φ. Kompensation induktiver Blindleistung mit Kondensatoren.',
      'PV: Module in Reihe addieren die Spannung, parallel den Strom. Die Leerlaufspannung steigt bei Kälte.',
      'Wallbox: eigener Endstromkreis, FI Typ A mit 6-mA-DC-Erkennung oder Typ B. Bis 12 kVA anmelden, darüber Zustimmung.',
      'Trennschalter nur stromlos schalten, Lasttrennschalter Betriebsströme, Leistungsschalter auch Kurzschlüsse.',
      'NH-Sicherungen nie unter Last ziehen. Mit Aufsteckgriff mit Stulpe und Gesichtsschutz arbeiten.'
    ],
    lektionen: [
      {
        title: 'Netze, Transformator und Kompensation', fach: 'fr',
        items: [
          { t: 'choice', f: 'fk', q: 'Was bedeutet die Schaltgruppe Dyn5 eines Ortsnetztrafos?',
            a: ['Oberspannung Dreieck, Unterspannung Stern mit N, 5 · 30° Phasenverschiebung', 'Oberspannung Stern, Unterspannung Dreieck, 5 kV', 'Ein Trafo mit 5 Wicklungen', 'Ein Trafo für Gleichstrom'], r: 0,
            x: 'Der herausgeführte Sternpunkt (n) liefert den Neutralleiter für 230 V.' },
          { t: 'num', q: 'Eine Anlage nimmt 40 kW bei cos φ = 0,8 auf. Wie groß ist die Scheinleistung?', r: 50, tol: 0, unit: 'kVA',
            x: 'S = P / cos φ = 40 kW / 0,8 = 50 kVA.' },
          { t: 'num', q: 'Wie groß ist dabei die Blindleistung? sin φ = 0,6.', r: 30, tol: 0, unit: 'kvar',
            x: 'Q = S · sin φ = 50 kVA · 0,6 = 30 kvar. Probe: √(40² + 30²) = 50.' },
          { t: 'num', q: 'Wie viel Kondensatorleistung brauchst du, um auf cos φ = 1 zu kompensieren?', r: 30, tol: 0, unit: 'kvar',
            x: 'Die ganze induktive Blindleistung muss ausgeglichen werden. In der Praxis zielt man auf cos φ ≈ 0,95.' },
          { t: 'choice', f: 'fk', q: 'Warum kompensiert ein Betrieb seine Blindleistung?',
            a: ['Der Strom in den Leitungen sinkt und Blindstromkosten fallen weg', 'Die Wirkleistung steigt', 'Die Spannung verdoppelt sich', 'Der FI löst seltener aus'], r: 0,
            x: 'Blindstrom belastet Leitungen und Trafo, ohne nutzbare Arbeit zu leisten.' },
          { t: 'num', q: 'Ein Trafo hat 400 kVA, 400 V. Welchen Nennstrom hat er auf der Unterspannungsseite?', r: 577, tol: 2, unit: 'A',
            x: 'I = S / (√3 · U) = 400.000 VA / (1,732 · 400 V) ≈ 577 A.' },
          { t: 'choice', f: 'fk', q: 'Was gehört in eine Ortsnetzstation?',
            a: ['Mittelspannungsschaltanlage, Transformator und Niederspannungsverteilung', 'Nur Zähler', 'Nur ein FI', 'Eine PV-Anlage'], r: 0,
            x: 'Von hier gehen die Niederspannungskabel zu den Hausanschlüssen.' }
        ]
      },
      {
        title: 'Photovoltaik und Speicher', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was passiert, wenn du PV-Module in Reihe schaltest?',
            a: ['Die Spannungen addieren sich, der Strom bleibt gleich', 'Die Ströme addieren sich', 'Die Spannung halbiert sich', 'Nichts ändert sich'], r: 0,
            x: 'Parallel geschaltete Strings addieren dagegen ihre Ströme.' },
          { t: 'num', f: 'fr', q: '20 Module mit je 430 Wp sind auf dem Dach. Wie groß ist die Anlagenleistung?', r: 8.6, tol: 0, unit: 'kWp',
            x: '20 · 430 Wp = 8.600 Wp = 8,6 kWp.' },
          { t: 'num', f: 'fr', q: 'Die Anlage mit 8,6 kWp erzeugt 950 kWh je kWp im Jahr. Wie viel ist das?', r: 8170, tol: 0, unit: 'kWh',
            x: '8,6 kWp · 950 kWh/kWp = 8.170 kWh im Jahr.' },
          { t: 'choice', q: 'Wann ist die Leerlaufspannung eines PV-Strings am höchsten?',
            a: ['An einem kalten, sonnigen Wintertag', 'An einem heißen Sommertag', 'Nachts', 'Bei Regen'], r: 0,
            x: 'Deshalb prüfst du die Stringlänge mit der tiefsten erwarteten Temperatur gegen die maximale Eingangsspannung.' },
          { t: 'choice', q: 'Was macht der MPP-Tracker im Wechselrichter?',
            a: ['Er sucht laufend den Arbeitspunkt mit der größten Leistung', 'Er misst den Netzbezug', 'Er schaltet bei Gewitter ab', 'Er zählt die Module'], r: 0,
            x: 'MPP heißt Maximum Power Point. Er verschiebt sich mit Einstrahlung und Temperatur.' },
          { t: 'tf', q: 'Die DC-Seite einer PV-Anlage steht unter Spannung, solange Licht auf die Module fällt, auch wenn der Wechselrichter aus ist.', r: true,
            x: 'Module lassen sich nicht abschalten. Arbeiten an der DC-Seite brauchen besondere Vorsicht.' },
          { t: 'choice', q: 'Was muss eine Ersatzstromversorgung mit Batteriespeicher bei Netzausfall sicher verhindern?',
            a: ['Dass sie ins öffentliche Netz zurückspeist', 'Dass das Licht angeht', 'Dass der Speicher entladen wird', 'Dass die PV-Anlage weiterläuft'], r: 0,
            x: 'Eine allpolige Netztrennung schützt die Monteure des Netzbetreibers, die das Netz für spannungsfrei halten.' },
          { t: 'choice', f: 'en', q: 'Was ist ein „inverter“ in einer PV-Anlage?',
            a: ['Wechselrichter', 'Wechselschalter', 'Laderegler für das Auto', 'Stromzähler'], r: 0,
            x: 'Der Batteriespeicher heißt „battery storage“, das Modul „PV module“ oder „solar panel“.' }
        ]
      },
      {
        title: 'Ladeinfrastruktur für E-Mobilität', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne die Ladebetriebsart zu.',
            a: [['Mode 2', 'Laden an der Haushaltssteckdose mit Kontrollbox im Kabel'], ['Mode 3', 'Laden an der Wallbox mit Typ-2-Stecker'], ['Mode 4', 'Gleichstrom-Schnellladen mit fest angeschlagenem Kabel']],
            x: 'Mode 2 ist für Dauerbetrieb nicht ideal: Die Schutzkontaktsteckdose ist nicht für stundenlange Volllast gebaut.' },
          { t: 'choice', q: 'Was gilt für eine Wallbox mit 11 kW beim Netzbetreiber?',
            a: ['Sie muss angemeldet werden', 'Sie braucht seine Zustimmung', 'Er muss nicht informiert werden', 'Sie ist verboten'], r: 0,
            x: 'Über 12 kVA, also etwa bei 22 kW, braucht es die vorherige Zustimmung des Netzbetreibers.' },
          { t: 'choice', q: 'Welchen Fehlerstromschutz braucht ein Ladepunkt nach DIN VDE 0100-722?',
            a: ['FI Typ A mit Erkennung von 6 mA Gleichfehlerstrom oder einen FI Typ B', 'Keinen, die Wallbox ist geschützt', 'FI Typ AC', 'Nur einen LS'], r: 0,
            x: 'Fahrzeuge können glatte Gleichfehlerströme erzeugen. Ein einfacher Typ A würde dadurch blind.' },
          { t: 'tf', q: 'Jeder Ladepunkt bekommt einen eigenen Endstromkreis.', r: true,
            x: 'Mehrere Ladepunkte teilen sich keinen Stromkreis und keinen FI.' },
          { t: 'num', f: 'fr', q: 'Ein Auto lädt 44 kWh mit 11 kW. Wie lange dauert das ohne Ladeverluste?', r: 4, tol: 0, unit: 'h',
            x: 't = W / P = 44 kWh / 11 kW = 4 h. Mit Verlusten etwas länger.' },
          { t: 'num', f: 'fr', q: 'Welcher Strom fließt je Außenleiter bei einer 11-kW-Wallbox an 400 V, cos φ = 1?', r: 15.9, tol: 0.1, unit: 'A',
            x: 'I = P / (√3 · U) = 11.000 W / (1,732 · 400 V) ≈ 15,9 A.' },
          { t: 'choice', q: 'Wozu dient ein Lastmanagement bei mehreren Wallboxen?',
            a: ['Es verteilt die verfügbare Anschlussleistung auf die Ladepunkte', 'Es erhöht die Netzspannung', 'Es ersetzt den FI', 'Es lädt die Autos ohne Strom'], r: 0,
            x: 'So reicht oft der vorhandene Hausanschluss für mehrere Ladepunkte.' }
        ]
      },
      {
        title: 'Schaltgeräte, Schalthandlungen und USV', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne das Schaltgerät seiner Fähigkeit zu.',
            a: [['Trennschalter', 'Schaltet nur stromlos, sichtbare Trennstrecke'], ['Lasttrennschalter', 'Schaltet Betriebsströme'], ['Leistungsschalter', 'Schaltet auch Kurzschlussströme ab']],
            x: 'Ein Trennschalter unter Last zieht einen Lichtbogen. Das ist lebensgefährlich.' },
          { t: 'tf', q: 'NH-Sicherungen dürfen unter Last gezogen werden, wenn es schnell gehen muss.', r: false,
            x: 'Vorher die Last abschalten. Gezogen wird mit NH-Aufsteckgriff mit Stulpe, mit Gesichtsschutz und Handschuhen.' },
          { t: 'choice', q: 'Wer darf in einer Anlage Schalthandlungen durchführen?',
            a: ['Wer dazu beauftragt ist, nach Anweisung des Anlagenverantwortlichen', 'Jeder, der den Schaltschrank öffnen kann', 'Nur der Kunde', 'Nur die Feuerwehr'], r: 0,
            x: 'Schalthandlungen werden abgesprochen und dokumentiert, damit niemand überrascht wird.' },
          { t: 'choice', q: 'Welche USV schaltet bei Netzausfall ohne jede Umschaltzeit?',
            a: ['Die Online-USV (Doppelwandler)', 'Die Offline-USV', 'Die Line-Interactive-USV', 'Ein Notstromaggregat'], r: 0,
            x: 'Die Last hängt immer am Wechselrichter, die Batterie liegt dauernd im Zwischenkreis.' },
          { t: 'choice', q: 'Wie verhinderst du, dass ein Notstromaggregat ins Netz zurückspeist?',
            a: ['Mit einem allpoligen Netz-Notstrom-Umschalter mit Nullstellung', 'Mit einem FI Typ A', 'Mit einer Schutzkontaktsteckdose', 'Gar nicht, das ist erlaubt'], r: 0,
            x: 'Netz und Aggregat dürfen nie gleichzeitig verbunden sein. Die Umschaltung muss auch den N trennen, wenn der Netzbetreiber es verlangt.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe zu.',
            a: [['disconnector', 'Trennschalter'], ['switch-disconnector', 'Lasttrennschalter'], ['circuit breaker', 'Leistungsschalter'], ['UPS', 'USV']],
            x: 'UPS steht für „uninterruptible power supply“.' }
        ]
      }
    ]
  }
];
