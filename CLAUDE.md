# FlivFit – Hinweise für Claude Code

Kleine Kraft-Workout-PWA fürs Handy, für zwei Personen (Profile **Fliv** 🌸 und **Flivi** 🌿).
Gehostet über **GitHub Pages** (Branch `main`, Ordner `/`). Kein Build-Schritt, keine Abhängigkeiten.

## Arbeitsweise
- Planung und Absprache passieren im claude.ai-Chat. Hierher kommen nur fertige Bauaufträge.
- Nur das umsetzen, was im Auftrag steht. Bei Unklarheiten nachfragen statt raten.
- Sprache der App und der Code-Kommentare: Deutsch.
- Nach jeder Änderung: Versionsnummer erhöhen (siehe unten) und kurz zusammenfassen, was sich geändert hat.

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
  `{id, name, kategorien[], geraete[], profile[], werte:{Fliv:{modus:'zeit'|'wdh', wert}, Flivi:{…}}, beschreibung, einseitig, bilder[], geaendert}`
  - `wert: null` bei Zeit = Standarddauer aus den Einstellungen.
  - `bilder[]` enthält Fotos **und Videos** gemischt (Blob lokal, Pfad auf GitHub; erkannt über `istVideo()`).
    Fotos werden auf 1200 px verkleinert, Videos nicht, aber auf max. 20 MB begrenzt (`VIDEO_MAX_MB`).
    Im Training: Fotos wechseln alle 2,5 s, Videos laufen stumm bis zum Ende (einziges Medium: in Schleife), siehe `zeigeMedium()`.
    Der Service Worker lädt Videos immer komplett und cacht sie, damit sie offline laufen.
  - Ältere Felder (`kategorie`, `dauer`) werden in `norm()` automatisch umgewandelt.
  - `geraete`: Liste aus `GERAETE` (Hantel, Kettlebell, Theraband, Ringe, Klimmzugstange, Liegestützgriffe); leeres Array = „Ohne Gerät“.
    Fehlt das Feld (z. B. ältere lokale Kopien am Handy), setzt `norm()` den Standard aus `STD_GERAETE`, sonst `[]`.
- **Pläne** (`plaene[]`): `{id, name, profil, runden, pause, items:[{id, modus?, wert?}], geaendert}`.
- **Lokale Änderungen** am Handy: Übungen in IndexedDB (`flivfit` / `uebungen`, Bilder als Blob), Pläne in `localStorage` `flivfit.plaene.lokal`.
  Beim Start wird zusammengeführt (`bauePool()`): Wer das neuere `geaendert` hat, gewinnt. Ist der GitHub-Stand neuer oder gleich, wird die lokale Kopie gelöscht.
  → **Beim Ändern bestehender Übungen in `uebungen.json` das `geaendert` nur dann erhöhen, wenn die Änderung lokale Bearbeitungen am Handy überschreiben soll.** Neue Übungen bekommen den aktuellen Zeitstempel (ms).
- **Pro Profil in `localStorage`**: `flivfit.einstellungen.<Profil>` (u. a. `letzteZeit`, `letzteKats`, `letzteGeraete`), `flivfit.verlauf.<Profil>`, `flivfit.leistung.<Profil>` (eingetragene Wdh./Sekunden), `flivfit.frei.<Profil>` (laufendes freies Training). Aktives Profil: `flivfit.profil`.
- Export (`exportieren()`) erzeugt eine ZIP mit `data/uebungen.json` + `data/bilder/` (inkl. Videos), die Tobi ins Repo hochlädt.

## Kategorien
Arme, Beine, Bauch, Rücken, Po, Schulter, Hüfte, Beckenboden, Ganzkörper (9 Haupt, Startseite als 3 × 3-Grid) sowie Aufwärmen und Abwärmen (werden im Zufallstraining automatisch an Anfang/Ende gesetzt). Eine Übung kann mehrere Kategorien haben.

## Trainingsarten
- **Zufall**: Zeit + Kategorien + Geräte („Womit?“) wählen → `erstellePlan()` füllt die Zeit reihum aus den Kategorien (Wiederholungen erlaubt, nie zweimal direkt hintereinander). Wdh.-Übungen werden mit 3 s pro Wiederholung geschätzt.
- **Plan**: fester Zirkel mit Runden und eigener Pause, optional eigene Werte pro Übung.
- **Frei**: ohne Timer, Wiederholungen/Sekunden pro Durchgang eintragen, Pausen-Uhr.
- Timer-Ablauf in `bauePhasen()` (Phasen: bereit, uebung, wechsel, pause). Countdown-Töne in den letzten 5 s (`countdownTon`), Wdh.-Phasen ohne Countdown mit „Fertig – eintragen“.

## Gerätefilter
- **Zufall „Womit?“** (Mehrfachauswahl, `geraetErlaubt()`): keine Auswahl = alle Übungen. Sonst ist eine Übung erlaubt, wenn mindestens eines ihrer Geräte gewählt ist; Übungen ohne Gerät nur, wenn „Ohne Gerät“ (`'ohne'`) gewählt ist. Gilt auch für Auf-/Abwärmen (bleibt nichts übrig, fällt der Block weg). Kein Treffer → Toast „Keine Übungen für diese Auswahl“.
- **Übungsliste und Übungsauswahl** (Einfachauswahl, `geraetFilter()`): „Alle“, „Ohne Gerät“ oder ein Gerät.

## Design
Warm, pastellig, rund. Farben als CSS-Variablen in `:root` (`--bg`, `--peach`, `--accent` …), Schrift Nunito. Nur fürs Handy (Hochformat) gedacht; Safe-Areas beachten.

## Testen
Lokal z. B. mit `python3 -m http.server` im Repo-Ordner und im Browser mit Handy-Ansicht (ca. 390 × 800) öffnen.
