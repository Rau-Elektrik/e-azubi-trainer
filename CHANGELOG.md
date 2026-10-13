# Änderungen

## 1.1.0 · 13.10.2026
- PV-Dachplanung mit Strings: Nach dem Belegen verschaltest du die Module zu bis zu zwei Strings. Die Leitungen werden mit Plus- und Minus-Ende aufs Dach gezeichnet. Die App rechnet die Leerlaufspannung bei −10 °C und die MPP-Spannung bei 70 °C und prüft sie gegen den Wechselrichter (max. 1.000 V, MPP 200–800 V, 2 MPP-Tracker). Verbunden werden nur direkte Nachbarn.
- Neue Lektion »Strings auslegen« im Abschnitt Photovoltaik: Datenblattwerte, Temperaturkoeffizient, Stringlänge, MPP-Tracker, Verschattung und sicheres Trennen.
- Bisheriger Fortschritt bleibt erhalten, auch wenn neue Lektionen zwischen bestehende kommen.
- Bilder der App in der README. `npm run screenshots` erzeugt sie neu.

## 1.0.2 · 13.10.2026
- Updates kommen zuverlässig an: Beim Aktualisieren lädt die App ihre Dateien immer frisch vom Server und nicht aus dem Browser-Zwischenspeicher.

## 1.0.1 · 13.10.2026
- Beim allerersten Öffnen lädt die Seite nicht mehr unnötig neu.

## 1.0.0 · 13.10.2026
Erste Version des E-Azubi Trainers.
- Lernpfad mit 9 Abschnitten: Sicherheit, Installationsschaltungen, Steuerungstechnik, Verteiler, Zählerschrank, Messsysteme, Erdung, E-Mobilität, Photovoltaik
- Lektionen mit Auswahl, Mehrfachauswahl, Richtig oder Falsch, Reihenfolge, Zuordnen und Rechnen. Falsche Antworten kommen am Ende noch einmal.
- Abschnittstests mit mindestens 80 % zum Bestehen
- Praxisaufgaben: Schaltplan-Trainer (9 Blätter), Verteiler, Wallbox, Zählerschrank, Erdungsmessung, PV-Dachplanung
- Werkstatt mit freiem Zeichenblatt und Netz-Puzzle
- XP, Tagesserie, Tagesziel und Abzeichen. Fortschritt als Datei sichern und laden.
- Installierbar, offline nutzbar, mit Update-Meldung
