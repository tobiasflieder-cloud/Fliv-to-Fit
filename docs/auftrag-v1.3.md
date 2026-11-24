# Auftrag: FlivFit Version 1.3

Bitte vorher `CLAUDE.md` lesen. Alle Texte in der App auf Deutsch, Stil wie bisher (warm, pastellig, rund).

## 1. Neue Kategorien
In `KATEGORIEN` zwei neue Hauptkategorien ergänzen (nicht `extra`, also auch Teil der „Ausgeglichenen Mischung“).
Reihenfolge danach: Arme, Beine, Bauch, Rücken, Po, Schulter, **Hüfte**, **Beckenboden**, Ganzkörper, Aufwärmen, Abwärmen.
- `{id:'Hüfte', emoji:'🌀', farbe:'#F2DCC8'}`
- `{id:'Beckenboden', emoji:'🪷', farbe:'#F4D3DF'}`

Danach hat die Startseite 9 Hauptkategorien. Das Kategorie-Grid soll sauber 3 × 3 aussehen.

## 2. Geräte
### Datenmodell
- Neues Feld pro Übung: `geraete: string[]`, z. B. `['Hantel']`. Ein leeres Array heißt „Ohne Gerät“.
- Liste der Geräte als Konstante:
  ```js
  const GERAETE = [
    {id:'Hantel', emoji:'🏋️'}, {id:'Kettlebell', emoji:'🔔'}, {id:'Theraband', emoji:'🎗️'},
    {id:'Ringe', emoji:'⭕'}, {id:'Klimmzugstange', emoji:'➖'}, {id:'Liegestützgriffe', emoji:'✊'}
  ];
  // zusätzlich als Filter-Option: {id:'ohne', name:'Ohne Gerät', emoji:'🤸'}
  ```
- `norm()` ergänzen: Wenn `geraete` fehlt, Standardwert aus einer Zuordnungstabelle im Code nehmen (siehe Abschnitt 3), sonst `[]`.
  So bekommen auch lokale Kopien am Handy die Geräte, ohne dass der GitHub-Stand sie überschreibt.
- Export (`exportieren()`) schreibt `geraete` mit.

### Übung bearbeiten
- Neues Feld **„Geräte“** unter „Kategorien“: Chips mit Emoji, Mehrfachauswahl. Keine Auswahl bedeutet „Ohne Gerät“ (als Hinweistext anzeigen).

### Übungsliste
- In der Meta-Zeile jeder Übung die Geräte-Emojis anzeigen.
- Zusätzliche, horizontal scrollbare Filterreihe **Geräte**: „Alle“, „🤸 Ohne Gerät“ und alle Geräte (Einfachauswahl wie beim Kategorienfilter).

### Zufallstraining (Startseite, Reiter „Zufall“)
- Neue Karte **„Womit?“** zwischen „Was trainieren?“ und dem Start-Button.
- Chips: „🤸 Ohne Gerät“ + alle Geräte, **Mehrfachauswahl**. Keine Auswahl = alle Übungen erlaubt (Hinweis „Alle Geräte“).
- Logik: Eine Übung ist erlaubt, wenn **mindestens eines** ihrer Geräte gewählt ist. Übungen ohne Gerät sind erlaubt, wenn „Ohne Gerät“ gewählt ist.
  Beispiel: Nur „Hantel“ gewählt → nur Hantel-Übungen. „Hantel“ + „Ohne Gerät“ → Hantel-Übungen und alle ohne Gerät.
- Der Filter gilt auch für Aufwärmen/Abwärmen. Bleibt dort nichts übrig, fällt der Block weg.
- Auswahl pro Profil merken (`S.letzteGeraete`).
- Findet sich keine passende Übung: Toast „Keine Übungen für diese Auswahl“.
- In der Plan-Vorschau die gewählten Geräte in der Unterzeile mit anzeigen.

### Übungsauswahl (freies Training und Pläne)
- Im Auswahl-Screen (`renderAuswahl`) unter dem Kategorienfilter eine zweite Filterreihe für Geräte (Einfachauswahl, wie in der Übungsliste).

## 3. Geräte der bestehenden Übungen (Standard-Zuordnung über `norm()`)
Diese Zuordnung als Tabelle im Code hinterlegen und zusätzlich bei den Einträgen in `data/uebungen.json` als `geraete` eintragen. **Bei diesen bestehenden Einträgen `geaendert` NICHT ändern**, sonst gehen lokale Änderungen am Handy (z. B. Bilder) verloren.

| Gerät | IDs |
|---|---|
| Hantel | `reverse-fly`, `romanian-deadlift`, `schulter-seitheben`, `hantel-links-rechts`, `hantel-ueber-kopf`, `hantel-rudern`, `v-fly` |
| Kettlebell | `kettlebell-swing`, `kettlebell-rundherum`, `kettlebell-ran-hoch` |
| Theraband | `plank-band-ziehen`, `bizeps-band`, `band-schwert`, `rudern-band-raus` |
| Ringe | `ringe-beine-ranziehen`, `ringe-arme-vor`, `liegestuetz-ringe` |
| Klimmzugstange | `klimmzuege`, `hanging-leg-raise` |
| Liegestützgriffe | `liegestuetz-griffe` |
| alle übrigen | `[]` (ohne Gerät) |

## 4. Neue Übungen in `data/uebungen.json`
Alle mit `profile: ['Fliv','Flivi']`, `bilder: []`, `werte` weglassen (Standard), `geaendert` = aktueller Zeitstempel in ms.

| id | Name | Kategorien | Geräte | einseitig | Beschreibung |
|---|---|---|---|---|---|
| `kb-kneeling-cross-chop` | Kneeling Cross Chop | Bauch, Schulter | Kettlebell | ja | Im Halbkniestand die Kettlebell mit beiden Händen seitlich neben der Hüfte halten. Diagonal nach oben über die gegenüberliegende Schulter ziehen und dabei den Oberkörper mitdrehen, kontrolliert zurück. Die Hüfte bleibt stabil. |
| `kb-kneeling-around-the-world` | Kneeling Around the World | Bauch, Schulter | Kettlebell | nein | Aufrecht knien, Bauch fest. Die Kettlebell nah am Körper um den Kopf kreisen lassen, ohne ins Hohlkreuz zu gehen. Zwischendurch die Richtung wechseln. |
| `kb-ellenbogen-zu-knie` | Ellenbogen zu Knie | Bauch | Kettlebell | nein | Aufrecht stehen, Kettlebell vor der Brust. Abwechselnd ein Knie hochziehen und den Oberkörper mit der Kettlebell zum Knie drehen. Bauch dabei aktiv anspannen. |
| `kb-side-bend` | Side Bend | Bauch | Kettlebell | ja | Aufrecht stehen, Kettlebell seitlich in einer Hand. Den Oberkörper zur Seite der Kettlebell neigen und mit der seitlichen Bauchmuskulatur wieder aufrichten. Nicht nach vorne oder hinten kippen. |
| `kb-stehend-rotation` | Stehend Rotation | Bauch | Kettlebell | nein | Hüftbreit stehen, Kettlebell mit beiden Händen vor der Brust. Den Oberkörper kontrolliert nach links und rechts drehen, die Hüfte zeigt dabei nach vorne. |
| `kb-curl-up-press` | Curl Up Press | Arme, Schulter | Kettlebell | nein | Kettlebell mit beiden Händen vor den Oberschenkeln. Zur Brust hochbeugen (Curl) und anschließend über den Kopf drücken. Auf demselben Weg kontrolliert zurück. |
| `kb-front-raise` | Front Raise | Schulter | Kettlebell | nein | Kettlebell mit beiden Händen vor den Oberschenkeln. Mit fast gestreckten Armen bis auf Schulterhöhe heben und langsam wieder senken, ohne Schwung. |
| `kb-up-lift` | Up Lift | Schulter, Arme | Kettlebell | nein | Die Kettlebell steht vor dir. Mit beiden Händen greifen und nach oben vor die Brust ziehen, die Ellbogen führen nach außen oben. Langsam wieder absenken. |
| `kb-curl-front-push` | Curl Front Push | Arme, Schulter | Kettlebell | nein | Kettlebell zur Brust hochbeugen, dann gerade nach vorne wegdrücken, bis die Arme gestreckt sind. Zurück zur Brust holen und absenken. |
| `kb-leg-raise-ueber-bell` | Leg Raise über Bell | Bauch | Kettlebell | nein | Auf den Rücken legen, die Kettlebell steht seitlich neben der Hüfte. Die Beine anheben und über die Kettlebell auf die andere Seite führen, ohne sie abzulegen. Unterer Rücken bleibt am Boden. |
| `h-open-and-serve` | Open and Serve | Schulter, Rücken | Hantel | nein | Hanteln vor dem Körper, Ellbogen 90 Grad gebeugt auf Schulterhöhe. Die Arme nach außen öffnen, sodass die Unterarme nach oben zeigen, dann wieder nach vorne zusammenführen wie beim Servieren. |
| `h-liegestuetz-rudern` | Liegestütz Rudern | Arme, Rücken, Bauch | Hantel | nein | Im hohen Stütz auf den Hanteln, Füße breit. Einen Liegestütz machen, dann abwechselnd eine Hantel zur Hüfte rudern. Die Hüfte bleibt ruhig und kippt nicht. |
| `h-rudern-und-zurueck` | Rudern und zurück | Rücken, Arme | Hantel | nein | Mit geradem Rücken vorbeugen. Die Hanteln zur Hüfte rudern, dann die Arme nach hinten strecken und wieder zurückführen. Langsam absenken. |
| `h-trizeps-lift-zum-knie` | Trizeps Lift zum Knie | Arme, Bauch | Hantel | nein | Die Hantel mit gestreckten Armen über den Kopf halten. Hinter den Kopf absenken, wieder hochstrecken und dann nach vorne unten zu einem angezogenen Knie führen. Die Knie wechseln sich ab. |
| `h-front-archer` | Front Archer | Schulter, Rücken | Hantel | nein | Zwei Hanteln mit langen Armen nach vorne ausstrecken. Im Wechsel eine Hantel wie beim Bogenschießen zurückziehen und wieder nach vorne führen. Der Oberkörper bleibt ruhig. |
| `h-ausfallschritt-rotation` | Ausfallschritt Rotation | Beine, Bauch | Hantel | nein | Hantel vor der Brust halten, einen großen Schritt nach vorne. Unten den Oberkörper zum vorderen Bein drehen, zurück zur Mitte und hochdrücken. Die Beine wechseln sich ab. |
| `h-ausfallschritt-schwert` | Ausfallschritt Schwert ziehen | Beine, Schulter | Hantel | ja | Im Ausfallschritt die Hantel an der gegenüberliegenden Hüfte halten. Beim Hochkommen die Hantel wie ein Schwert diagonal nach außen oben ziehen, beim Absenken zurück. Erst eine Seite, dann die andere. |
| `tigerstand-zu-plank` | Tigerstand zu Plank | Bauch, Ganzkörper | – | nein | Im Vierfüßlerstand die Knie ein paar Zentimeter vom Boden abheben (Tigerstand). Die Beine nach hinten in den hohen Stütz strecken und wieder zurück in den Tigerstand. |
| `slow-mountain-climber` | Slow Mountain Climber | Bauch | – | nein | Im hohen Stütz langsam ein Knie zur Brust ziehen, kurz halten und zurückstellen, dann die andere Seite. Die Hüfte bleibt tief und ruhig. |
| `tigerstand-side-swing` | Tigerstand Side Swing | Bauch, Hüfte | – | nein | Aus dem Tigerstand die Hüfte drehen und die Beine seitlich nach vorne durchschwingen, zurück in den Tigerstand, dann zur anderen Seite. |
| `plank-tap` | Plank Tap | Bauch | – | nein | Im Unterarmstütz abwechselnd einen Fuß seitlich abtippen und zurück. Der Körper bleibt eine gerade Linie, die Hüfte ruhig. |
| `hip-raise-faedeln` | Hip Raise fädeln | Po, Hüfte | – | ja | Rückenlage, ein Fuß aufgestellt. Die Hüfte einbeinig anheben und dabei das freie Bein unter dem Standbein hindurchfädeln, dann zurück. Erst eine Seite, dann die andere. |

## 5. Schilder entfernen
Die Schilder **„Neu“** und **„Geändert“** (`.badge`) in der Übungsliste und auf den Plan-Karten komplett entfernen.
Der Export-Hinweis oben in der Übungsliste („X Änderungen sind nur auf diesem Handy · Export“) **bleibt**.

## 6. Abschluss
- Version auf **1.3.0** setzen (`APP_VERSION` in `index.html` und `VERSION` in `sw.js`).
- `CLAUDE.md` aktualisieren: neue Kategorien, Feld `geraete`, Gerätefilter-Logik.
- Kurz im Browser in Handy-Größe testen: Startseite mit 9 Kategorien, „Womit?“-Filter (z. B. nur Schulter + Rücken mit Hantel), Übung bearbeiten mit Geräten, Filter in Übungsliste und Auswahl.
- Danach kurz zusammenfassen, was geändert wurde.
