# FlivFit – Hinweise für Claude Code

Kleine Kraft-Workout-PWA fürs Handy, für zwei Personen (Profile **Fliv** 🌸 und **Flivi** 🌿).
Gehostet über **GitHub Pages** (Branch `main`, Ordner `/`). Kein Build-Schritt, keine Abhängigkeiten.

## Arbeitsweise
- Planung und Absprache passieren im claude.ai-Chat. Hierher kommen nur fertige Bauaufträge.
- Nur das umsetzen, was im Auftrag steht. Bei Unklarheiten nachfragen statt raten.
- Sprache der App und der Code-Kommentare: Deutsch.
- Nach jeder Änderung: Versionsnummer erhöhen (siehe unten) und kurz zusammenfassen, was sich geändert hat.
- Fertige und getestete Änderungen immer direkt in `main` mergen und pushen (dann sind sie über GitHub Pages live).

## Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | Die komplette App: CSS, HTML und JavaScript in einer Datei |
| `sw.js` | Service Worker (Offline-Cache, Updates) |
| `manifest.webmanifest` | PWA-Manifest |
| `data/uebungen.json` | Gemeinsamer Übungspool und Pläne (Stand auf GitHub) |
| `data/bilder/` | Übungsbilder und -videos (`<übungs-id>-<n>.jpg` bzw. `.mp4`/`.webm`/`.mov`) |
| `fonts/`, `icons/` | Nunito-Schrift, App-Icons |

## Versionierung (wichtig)
Bei jeder Änderung beide Stellen anpassen, sonst laden die Handys das Update nicht:
- `index.html`: `const APP_VERSION = 'x.y.z'`
- `sw.js`: `const VERSION = 'flivfit-x.y.z'`

## Daten & Speicher
- **Übungen** (`data/uebungen.json` → `uebungen[]`):
  `{id, name, kategorien[], geraete[], staerke, profile[], werte:{Fliv:{modus:'zeit'|'wdh', wert}, Flivi:{…}}, beschreibung, einseitig, bilder[], geaendert}`
  - `wert: null` bei Zeit = Standarddauer aus den Einstellungen.
  - `bilder[]` enthält Fotos **und Videos** gemischt (Blob lokal, Pfad auf GitHub; erkannt über `istVideo()`).
    Fotos werden auf 1200 px verkleinert. Videos werden beim Hinzufügen komprimiert (`komprimiereVideo()`: Canvas + MediaRecorder,
    720p, ca. 1,5 Mbit/s, ohne Ton, WebM; dauert so lange wie das Video). Ist das Ergebnis nicht kleiner oder klappt es nicht, wird das Original genommen.
    Limit danach max. 20 MB (`VIDEO_MAX_MB`).
    Pfade vom GitHub-Stand bekommen in `norm()` ein `?v=<geaendert>` angehängt, damit ersetzte Dateien gleichen Namens neu geladen werden.
    Im Training: Fotos wechseln alle 2,5 s, Videos laufen stumm bis zum Ende (einziges Medium: in Schleife), siehe `zeigeMedium()`.
    Der Service Worker lädt Videos immer komplett und cacht sie, damit sie offline laufen.
  - Ältere Felder (`kategorie`, `dauer`) werden in `norm()` automatisch umgewandelt.
  - `staerke`: 1–3 Sterne, „Wie anstrengend?“ (für das Abenteuer). Fehlt sie, setzt `norm()` 2.
  - `geraete`: Liste aus `GERAETE` (Hantel, Kettlebell, Theraband, Ringe, Klimmzugstange, Liegestützgriffe); leeres Array = „Ohne Gerät“.
    Fehlt das Feld (z. B. ältere lokale Kopien am Handy), setzt `norm()` den Standard aus `STD_GERAETE`, sonst `[]`.
- **Pläne** (`plaene[]`): `{id, name, profil, runden, pause, items:[{id, modus?, wert?}], geaendert}`.
- **Lokale Änderungen** am Handy: Übungen in IndexedDB (`flivfit` / `uebungen`, Bilder als Blob), Pläne in `localStorage` `flivfit.plaene.lokal`.
  Beim Start wird zusammengeführt (`bauePool()`): Wer das neuere `geaendert` hat, gewinnt. Ist der GitHub-Stand neuer oder gleich, wird die lokale Kopie gelöscht.
  → **Beim Ändern bestehender Übungen in `uebungen.json` das `geaendert` nur dann erhöhen, wenn die Änderung lokale Bearbeitungen am Handy überschreiben soll.** Neue Übungen bekommen den aktuellen Zeitstempel (ms).
- **Pro Profil in `localStorage`**: `flivfit.einstellungen.<Profil>` (u. a. `letzteZeit`, `letzteKats`, `letzteGeraete`), `flivfit.verlauf.<Profil>`, `flivfit.leistung.<Profil>` (eingetragene Wdh./Sekunden), `flivfit.frei.<Profil>` (laufendes freies Training), `flivfit.abenteuer.<Profil>` (siehe Abenteuer). Aktives Profil: `flivfit.profil`.
- Export (`exportieren()`) erzeugt eine ZIP mit `data/uebungen.json` + `data/bilder/` (inkl. Videos), die Tobi ins Repo hochlädt.

## Kategorien
Arme, Beine, Bauch, Rücken, Po, Schulter, Hüfte, Beckenboden, Ganzkörper (9 Haupt, Startseite als 3 × 3-Grid) sowie Aufwärmen und Abwärmen (werden im Zufallstraining automatisch an Anfang/Ende gesetzt). Eine Übung kann mehrere Kategorien haben.

## Trainingsarten
- **Zufall**: Zeit + Kategorien + Geräte („Womit?“) wählen → `erstellePlan()` füllt die Zeit reihum aus den Kategorien (Wiederholungen erlaubt, nie zweimal direkt hintereinander). Wdh.-Übungen werden mit 3 s pro Wiederholung geschätzt.
- **Plan**: fester Zirkel mit Runden und eigener Pause, optional eigene Werte pro Übung.
- **Frei**: ohne Timer, Wiederholungen/Sekunden pro Durchgang eintragen, Pausen-Uhr.
- **Abenteuer**: Spielmodus mit Wesen, die man aufheitert (siehe unten).
- Timer-Ablauf in `bauePhasen()` (Phasen: bereit, uebung, wechsel, pause). Countdown-Töne in den letzten 5 s (`countdownTon`), Wdh.-Phasen ohne Countdown mit „Fertig – eintragen“.

## Gerätefilter
- **Zufall „Womit?“** (Mehrfachauswahl, `geraetErlaubt()`): keine Auswahl = alle Übungen. Sonst ist eine Übung erlaubt, wenn mindestens eines ihrer Geräte gewählt ist; Übungen ohne Gerät nur, wenn „Ohne Gerät“ (`'ohne'`) gewählt ist. Gilt auch für Auf-/Abwärmen (bleibt nichts übrig, fällt der Block weg). Kein Treffer → Toast „Keine Übungen für diese Auswahl“.
- **Übungsliste und Übungsauswahl** (Einfachauswahl, `geraetFilter()`): „Alle“, „Ohne Gerät“ oder ein Gerät.

## Abenteuer (v1.6, Teil 1: Kampf-Kern)
Code im Abschnitt `/* ---------- Abenteuer ---------- */` in `index.html`. Vierter Reiter auf der Startseite (`S.modus = 'abenteuer'`).
- **Idee:** Grummelige Wesen (`WESEN`) haben einen Laune-Balken (`ziel`). Übungen sind Angriffe; ist der Balken voll, kommt das Wesen ins Freundebuch.
  Man kann nicht verlieren. Reihenfolge von `WESEN` = Weg; nächstes Wesen = erstes, das noch nicht befreundet ist (`naechstesWesen()`).
- **Vorbereitung:** Geräteauswahl „Womit?“ (eigene, `AB.geraete`, Logik `geraetErlaubt()`), 6 Angriffs-Slots (`AB.slots`, bearbeiten über `renderAuswahl` mit Zweck `'slots'`).
  Leere Slots werden mit Übungen aus möglichst verschiedenen Kategorien vorbelegt (`abSlotsPruefen()`).
- **Formeln:** Bonus (`abBonus`): ×2, wenn eine Kategorie zu `mag` gehört; sonst ×0,5, wenn alle Kategorien in `nein` sind; sonst ×1.
  Laune pro Sekunde Angriff = `staerke × bonus` (`launeProSek`). Bei Wdh.-Übungen höchstens bis zur geschätzten Dauer (Wdh. × 3 s); nach „Fertig“ bzw. Zeitablauf wird der Rest gutgeschrieben, beim Überspringen nicht.
  Automatische Angriffswahl (`waehleAngriff`): höchster Bonus, bei Gleichstand zufällig, nicht zweimal direkt hintereinander.
- **Ablauf** (Timer-Engine, `T.ab` gesetzt; `abenteuerPhaseEnde()` hängt Phasen fortlaufend an):
  bereit (10 s) → Angriff → grummel (5 s) → abwehr (15 s, Bauch-Übung, bevorzugt „Plank“) → pause (mit „Anderen Angriff wählen“) → Angriff …
  Abwehr durchgehalten: Energie −10, übersprungen: −25. Energie ≤ 0 → puste (30 s, Abwärmen-Übung), danach Energie 50.
  Laune voll → `abenteuerSieg()` → Freundebuch + Sieg-Screen (`renderFertig` mit `art:'abenteuer'`). Abbruch wie Training (ab 1 Min. im Verlauf, Laune wird nicht gespeichert).
- **Verlauf:** `art:'abenteuer'`, Titel „🌳 Abenteuer: <Name>“, `uebungen` = Anzahl Angriffe, zusätzlich `wesen`, `puste`, `sieg`.
- **Speicher:** `flivfit.abenteuer.<Profil>` = `{slots:[id], geraete:[], freunde:{<wesen-id>:{erstesMal, anzahl}}}`. Ein laufender Kampf wird nicht gespeichert.
- **Grafik:** Platzhalter-SVGs aus `wesenSvg(id, stimmung)` (Stimmung: grummelig < 33 %, neutral bis 66 %, fröhlich darüber, strahlend beim Sieg).
  Zum Ersetzen durch echte Bilder nur diese Funktion ändern.
- **Erweiterungspunkte für später:** Erfahrungspunkte/Level (`abenteuerSieg`), Items/Equipment (Bonus in `abBonus`/`launeProSek`),
  Weltkarte/Bosse/Bedingungen (Felder in `WESEN`), Folgen leerer Energie (`abenteuerPhaseEnde`).

## Design
Warm, pastellig, rund. Farben als CSS-Variablen in `:root` (`--bg`, `--peach`, `--accent` …), Schrift Nunito. Nur fürs Handy (Hochformat) gedacht; Safe-Areas beachten.

## Testen
Lokal z. B. mit `python3 -m http.server` im Repo-Ordner und im Browser mit Handy-Ansicht (ca. 390 × 800) öffnen.
