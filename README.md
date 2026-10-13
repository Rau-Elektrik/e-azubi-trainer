# E-Azubi Trainer

Lern-App für Auszubildende im Elektrohandwerk. Ein Lernpfad wie bei Duolingo führt durch Lektionen, Praxisaufgaben und Abschnittstests. Die Azubis sammeln dabei XP, halten eine Tagesserie und verdienen Abzeichen.

**App öffnen:** https://rau-elektrik.github.io/e-azubi-trainer/

## Inhalte (Version 1.0)

| Abschnitt | Lektionen | Praxis |
| --- | --- | --- |
| 1 · Sicherheit und Grundlagen | Fünf Sicherheitsregeln, ohmsches Gesetz und Leistung, Aderfarben und Schutzmaßnahmen | – |
| 2 · Installationsschaltungen | Schalter und Schaltstellen, Taster und Zeitschalter | Aus-, Serien-, Wechsel-, Kreuz-, Stromstoß- und Treppenlichtschaltung zeichnen |
| 3 · Steuerungstechnik | Schütz, Drehstrommotor, Wendeschützschaltung | Selbsthaltung, Motor anschließen, Wendeschaltung |
| 4 · Verteiler bestücken | Aufbau, Reihenfolge, FI-Typen | Wohnungsverteiler |
| 5 · Zählerschrank (VDE-AR-N 4100:2026-04) | Aufbau, Regeln und Zuständigkeit | Zählerschrank bestücken |
| 6 · Messsysteme | mME, iMSys, Gateway, Pflichtfälle, § 14a | – |
| 7 · Erdung und Messen | Erder nach DIN 18014, Erdungswiderstand messen | Sondenmethode mit Plateau |
| 8 · E-Mobilität | Wallbox planen, Stecker und Kommunikation | Wallbox im Verteiler nachrüsten |
| 9 · Photovoltaik | Anlage berechnen, Planung und Betrieb | Dachfläche belegen |

Dazu kommt die **Werkstatt**: Dort lassen sich alle Praxisaufgaben frei üben. Es gibt dort ein freies Zeichenblatt für eigene Stromlaufpläne und ein Netz-Puzzle zum Abschalten.

## Installieren

Der Trainer ist eine installierbare Web-App (PWA). Er läuft auf Handy, Tablet und PC und funktioniert nach dem ersten Öffnen auch offline.

- **Android und PC (Chrome, Edge):** Seite öffnen, im Browsermenü »App installieren« wählen. Oder in der App unter Profil auf »Jetzt installieren« tippen.
- **iPhone und iPad (Safari):** Seite öffnen, auf Teilen tippen, dann »Zum Home-Bildschirm«.

Updates kommen automatisch. Nach einer neuen Veröffentlichung zeigt die App »Eine neue Version ist da« mit dem Knopf »Jetzt laden«.

Der Fortschritt liegt nur auf dem jeweiligen Gerät. Unter Profil lässt er sich als Datei sichern und auf einem anderen Gerät wieder laden.

### Warum keine EXE?

Eine Web-App braucht keinen Installer und keine Virenschutz-Ausnahme. Sie läuft auf jedem Gerät, auch auf dem Handy der Azubis, und aktualisiert sich von selbst. Falls später doch eine Windows-Datei gebraucht wird, lässt sie sich aus diesem Projekt bauen, zum Beispiel mit Tauri oder Electron.

## Weiterentwickeln

Das Projekt kommt ohne Build-Schritt aus. Alle Dateien liegen so, wie sie im Browser laufen.

```
index.html               App-Hülle
css/app.css              Aussehen (hell und dunkel)
js/main.js               Lernpfad, Werkstatt, Fortschritt, Profil, Updates
js/lesson.js             Ablauf einer Lektion und die Aufgabentypen
js/store.js              Fortschritt, XP und Tagesserie
js/content/kurs.js       Reihenfolge der Abschnitte und XP-Regeln
js/content/abschnitte/   ein Abschnitt pro Datei: Lernkarte, Lektionen, Praxis, Test
js/content/abzeichen.js  Abzeichen
js/practice/             Praxisaufgaben: Schaltplan, Verteiler, Zählerschrank, Erdung, PV, Netz-Puzzle
tests/run-tests.mjs      automatische Prüfungen
sw.js                    Offline-Speicher und Update-Meldung
```

### Eine Frage ergänzen

Öffne die Datei des Abschnitts, zum Beispiel `js/content/abschnitte/verteiler.js`, und füge in `items` einer Lektion eine Zeile hinzu:

```js
{ t: 'choice', q: 'Wie breit ist eine Teilungseinheit?', a: ['17,5 mm', '18 mm', '20 mm', '35 mm'], r: 0, x: 'Eine TE ist 17,5 mm breit.' }
```

| Typ | Bedeutung | Lösung `r` |
| --- | --- | --- |
| `choice` | eine richtige Antwort | Nummer der Antwort, ab 0 gezählt |
| `multi` | mehrere richtige Antworten | Liste der Nummern, z. B. `[0, 2]` |
| `tf` | richtig oder falsch | `true` oder `false` |
| `order` | Reihenfolge | entfällt, `a` steht in der richtigen Reihenfolge |
| `match` | Paare zuordnen | entfällt, `a` ist eine Liste von Paaren |
| `num` | Rechenaufgabe | Zahl, dazu `tol` (Toleranz) und `unit` |

`x` ist die Erklärung, die nach der Antwort erscheint.

### Einen Abschnitt ergänzen

1. Eine neue Datei in `js/content/abschnitte/` anlegen. Am einfachsten kopierst du eine vorhandene.
2. Sie in `js/content/kurs.js` importieren und in `ABSCHNITTE` eintragen.
3. Die Datei in `sw.js` in die Liste `CORE` aufnehmen, damit sie offline verfügbar ist.

### Testen und veröffentlichen

```bash
npm start
```
startet die App unter http://localhost:4880. Auf dem eigenen Rechner läuft sie ohne Offline-Speicher, damit Änderungen sofort sichtbar sind.

```bash
npm test
```
prüft alle Schaltpläne, Praxisaufgaben und Fragen. Beim Hochladen auf GitHub laufen dieselben Prüfungen automatisch.

**Neue Version veröffentlichen:**

1. Die Versionsnummer erhöhen, und zwar gleich in `js/version.js` und `sw.js`.
2. Den Eintrag in `CHANGELOG.md` ergänzen.
3. Hochladen (`git push`). GitHub Pages baut die Seite in ein bis zwei Minuten neu, danach meldet die App das Update.

## Fachlicher Hinweis

Die Inhalte folgen unter anderem DIN VDE 0100, DIN VDE 0105-100, VDE-AR-N 4100 (Fassung 2026-04), DIN 18014, DIN VDE 0100-722, dem Messstellenbetriebsgesetz und § 14a EnWG. Die App dient dem Lernen. Verbindlich sind immer der Normtext und die Technischen Anschlussbedingungen (TAB) des zuständigen Netzbetreibers.
