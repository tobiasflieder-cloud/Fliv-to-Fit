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
- Timer-Ablauf in `bauePhasen()` (Phasen: bereit, uebung, wechsel, pause; im Abenteuer zusätzlich wandern, rast, grummel, abwehr, puste). Countdown-Töne in den letzten 5 s (`countdownTon`), Wdh.-Phasen ohne Countdown mit „Fertig – eintragen“.

## Gerätefilter
- **Zufall „Womit?“** (Mehrfachauswahl, `geraetErlaubt()`): keine Auswahl = alle Übungen. Sonst ist eine Übung erlaubt, wenn mindestens eines ihrer Geräte gewählt ist; Übungen ohne Gerät nur, wenn „Ohne Gerät“ (`'ohne'`) gewählt ist. Gilt auch für Auf-/Abwärmen (bleibt nichts übrig, fällt der Block weg). Kein Treffer → Toast „Keine Übungen für diese Auswahl“.
- **Übungsliste und Übungsauswahl** (Einfachauswahl, `geraetFilter()`): „Alle“, „Ohne Gerät“ oder ein Gerät.

## Abenteuer (v1.6 Kampf-Kern, v1.7 Karte/Level/Animationen)
Code im Abschnitt `/* ---------- Abenteuer ---------- */` in `index.html`. Vierter Reiter auf der Startseite (`S.modus = 'abenteuer'`).
Grundsätze: für jeden allein, cozy, sanft – man kann nicht verlieren, keine Strafen.
- **Idee:** Grummelige Wesen (`WESEN`) haben einen Laune-Balken (`ziel`). Übungen sind Angriffe; ist der Balken voll, kommt das Wesen ins Freundebuch.
- **Reiter:** Status (Level, EP-Balken, Energie) → Karte mit nächstem Ziel und „Weiter wandern“ → „Womit?“ (eigene Geräteauswahl `AB.geraete`, Logik `geraetErlaubt()`)
  → Angriffs-Slots (`AB.slots`, bearbeiten über `renderAuswahl` mit Zweck `'slots'`, Anzahl `slotAnzahl()`) → Freundebuch.
- **Karte** (`KARTE`, Gebiete mit Stationen in Wegreihenfolge; weitere Gebiete anhängen): Gebiet 1 „Pilzwald“:
  Start → pilz → Rastplatz → igel → schnecke → Rastplatz → kraehe → moosriese. `AB.position` = Index der Station, an der die Figur steht.
  Darstellung als SVG (`karteSvg()`, Weg aus Bézier-Stücken `wegStueck()`, Deko `karteDeko()`), im Reiter scrollbar, im Trainings-Screen als Mini-Ausschnitt.
  Steht man an einem noch nicht befreundeten Wesen (z. B. nach Abbruch), startet der Button direkt den Kampf dort.
- **Sitzung** (`SITZUNG`, `abenteuerStarten()`): vom Tippen auf „Weiter wandern“ bis „Für heute genug“ oder Abbruch. Timer-Engine mit `T.ab`,
  `abenteuerPhaseEnde()` hängt die Phasen fortlaufend an:
  bereit (10 s) → wandern (30 s, Aufwärmen-Übung, Figur läuft live, `figurBewegen()`) → an der Station:
  Wesen → Kampf (bereit mit Intro → Angriff → grummel 5 s → abwehr 15 s → pause → Angriff …),
  Rastplatz → rast (30 s, Abwärmen-Übung, Energie voll, +30 EP) → automatisch weiter wandern.
  Sieg → `abenteuerSieg()` → Sieg-Screen mit „Weiter wandern“ (gleiche Sitzung) und „Für heute genug“ (`sitzungBeenden()` → Zusammenfassung).
  Freundebuch „Besuchen“ startet einen Kampf mit einem Freund direkt (ohne Wanderung, Position bleibt).
  Abbruch (X): Karte und Freunde bleiben, die Laune des halb aufgeheiterten Wesens nicht.
- **Kampf-Formeln:** Bonus (`abBonus`): ×2, wenn eine Kategorie zu `mag` gehört; sonst ×0,5, wenn alle Kategorien in `nein` sind; sonst ×1.
  Laune pro Sekunde Angriff = `staerke × bonus × (1 + 0,05 × (Level − 1))` (`launeProSek`). Bei Wdh.-Übungen höchstens bis zur geschätzten Dauer
  (Wdh. × 3 s); nach „Fertig“ bzw. Zeitablauf wird der Rest gutgeschrieben, beim Überspringen nicht.
  Automatische Angriffswahl (`waehleAngriff`): höchster Bonus, bei Gleichstand zufällig, nicht zweimal direkt hintereinander.
- **Energie** (`AB.energie`, bleibt zwischen Kämpfen erhalten): Maximum `100 + 5 × (Level − 1)` (`maxEnergie`). Neuer Tag seit `AB.energieDatum` → voll
  (`energieAuffrischen`). Abwehr durchgehalten −10, übersprungen −25. Energie ≤ 0 → puste (30 s), danach 50 % des Maximums. Rastplatz → Maximum.
- **EP & Level** (nur im Abenteuer): 10 EP pro Minute Sitzungszeit (laufend gebucht in `sitzungBuchen`), +30 EP pro Rastplatz,
  Wesen: `ziel / 2`, beim ersten Mal `ziel`; Moosriese beim ersten Mal +150 Gebiets-Bonus.
  Level n → n+1 braucht `100 × n` EP (`levelInfo`). Pro Level: +5 % Laune-Wirkung, +5 max. Energie. 7. Slot ab Level 3, 8. ab Level 6.
  Gebiet 2 (gibt es noch nicht) öffnet sich ab Level 5, wenn der Moosriese befreundet ist (`KARTE[0].weiter`, nur als Hinweis).
  Level-ups werden in `AB_LEVELUPS` gesammelt und als Overlay gezeigt (`levelUpZeigen`).
- **Verlauf:** ein Eintrag pro Sitzung (`id` der Sitzung, wird bei jedem Sieg und am Ende aktualisiert), ab 1 Minute, auch bei Abbruch:
  `art:'abenteuer'`, Titel „🌳 Abenteuer: Grummelpilz, Igel“ (bzw. „Pilzwald“), `dauer`, `uebungen` = Angriffe, `wesen:[ids]`, `ep`, `puste`.
- **Speicher:** `flivfit.abenteuer.<Profil>` = `{slots:[id], geraete:[], freunde:{<wesen-id>:{erstesMal, anzahl}}, position, energie, energieDatum,
  ep, uebernahmeV17}`. Das Level wird immer aus `ep` berechnet. Ein laufender Kampf wird nicht gespeichert.
  **Übernahme aus v1.6** (`abUebernahme`, einmalig): EP aus Abenteuer-Minuten im Verlauf und Freundebuch (erstes Mal doppelt, Wiederholungen `ziel / 2`),
  Position = Station nach dem letzten befreundeten Wesen.
- **Grafik:** Platzhalter-SVGs: `wesenSvg(id, stimmung)` (grummelig < 33 %, neutral bis 66 %, fröhlich darüber, strahlend beim Sieg, skeptisch kurz bei
  Resistenz), Karte `karteSvg()`, Figur `figurSvg()`. Zum Ersetzen durch echte Bilder nur diese Funktionen ändern.
- **Animationen** (nur CSS/SVG, bei `prefers-reduced-motion` aus bzw. reduziert, `WENIG_BEWEGUNG`): Treffer alle 2–3 s (`treffer`: kichern + Herzchen in
  Kategorie-Farbe; Schwäche: lachen, Funkenregen, „Das mag es!“; Resistenz: skeptischer Blick + graues Wölkchen), Stimmungswechsel „Plopp“ mit Glitzer,
  Grummel-Angriff (Backen aufblasen, Wolke fliegt zum Energie-Balken, Balken wackelt), Sieg mit Blüten-Konfetti, EP-Zähl-Animation, Level-up-Overlay.
- **Erweiterungspunkte für später:** Items/Equipment (Bonus in `abBonus`/`launeProSek`), Gebiet 2 und weitere Gebiete mit Bossen (`KARTE`),
  Bedingungen (Felder in `WESEN`/`KARTE`), eigene Grafiken.

## Design
Warm, pastellig, rund. Farben als CSS-Variablen in `:root` (`--bg`, `--peach`, `--accent` …), Schrift Nunito. Nur fürs Handy (Hochformat) gedacht; Safe-Areas beachten.

## Testen
Lokal z. B. mit `python3 -m http.server` im Repo-Ordner und im Browser mit Handy-Ansicht (ca. 390 × 800) öffnen.
