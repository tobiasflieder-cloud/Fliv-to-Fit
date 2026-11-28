# Auftrag: FlivFit Version 1.6 – Abenteuer-Modus (Teil 1: Kampf-Kern)

Bitte vorher `CLAUDE.md` und `docs/merkliste.md` lesen (Abschnitt „Spielmodus mit Gamification“).
Alle Texte auf Deutsch. Stil: warm, pastellig, rund, cozy. Ghibli-*inspirierte* Stimmung, aber eigene Figuren.

Dies ist der **erste Teil** des Abenteuer-Modus. Erfahrungspunkte, Level, Items, Equipment und eine Weltkarte kommen in späteren Versionen.
Bitte den Code so anlegen, dass das später gut ergänzt werden kann. Diese Teile jetzt aber **nicht** bauen.

## Grundidee
- Man **besiegt** die Gegner nicht, man **heitert sie auf**: Die Gegner sind grummelige Wesen mit einem **Laune-Balken** statt Lebenspunkten.
  Ist der Balken voll, freut sich das Wesen und kommt ins **Freundebuch**.
- Übungen sind Angriffe. Die **Kategorie** der Übung ist die Angriffsart. Wesen haben **Schwächen** und **Resistenzen** nach Kategorie.
- Der Kampf läuft **automatisch über die Zeit** wie das Timer-Training, damit man möglichst selten ans Handy muss.
- **Man kann nicht verlieren.** Sanft, kein Zwang, keine Strafen.

## 1. Neuer Reiter „🌳 Abenteuer“
- Vierter Reiter auf der Startseite neben Zufall, Pläne und Frei (`S.modus = 'abenteuer'`).
  Alle vier müssen bei ca. 390 px Breite sauber in eine Zeile passen (Schrift ggf. etwas kleiner, Labels ggf. kürzen).
- Inhalt des Reiters:
  1. **Nächstes Wesen:** große Karte mit der Platzhalter-Grafik (siehe 6), Name, kurzer Text („Der Grummelpilz hat schlechte Laune …“),
     Schwächen/Resistenzen als Kategorie-Chips (z. B. „Mag: 🦵 Beine“, „Unbeeindruckt von: 💪 Arme“).
     Darunter klein: „Anderes Wesen wählen“. Das öffnet eine Liste aller schon befreundeten Wesen und des nächsten (erneut spielen erlaubt).
  2. **Womit?** – Geräte-Chips wie im Zufallstraining (Mehrfachauswahl, gleiche Logik wie `geraetErlaubt()`), eigene gespeicherte Auswahl für das Abenteuer.
  3. **Deine Angriffe** – 6 Slots mit den ausgerüsteten Übungen (Vorschaubild, Name, Kategorie-Emojis, Sterne).
     „Bearbeiten“ öffnet die bestehende Übungsauswahl (`renderAuswahl`) mit neuem Zweck `'slots'` (max. 6, Vorauswahl = aktuelle Slots).
     Sind noch keine Slots belegt: automatisch 6 Übungen aus möglichst verschiedenen Kategorien vorbelegen.
     Übungen, die wegen der Geräteauswahl gerade nicht erlaubt sind, ausgegraut zeigen.
  4. Button **„Los geht’s“**. Ist keine ausgerüstete Übung erlaubt: Toast „Keine deiner Angriffe passt zu dieser Geräteauswahl“.
  5. Link **„📖 Freundebuch“**.

## 2. Stärke pro Übung
- Neues Feld `staerke: 1 | 2 | 3` an jeder Übung. Standard 2 (in `norm()` setzen, wenn es fehlt).
- Im Übungs-Editor neues Feld **„Stärke im Abenteuer“** mit drei antippbaren Sternen (Hinweis: „Wie anstrengend ist die Übung?“).
- `exportieren()` schreibt `staerke` mit. In `data/uebungen.json` bei bestehenden Übungen **nichts ändern** (Standard über `norm()`).

## 3. Die Wesen (Konstante `WESEN` im Code)
| id | Name | Laune-Ziel | Mag (Schwäche ×2) | Unbeeindruckt (Resistenz ×0,5) | Farbe |
|---|---|---|---|---|---|
| `pilz` | Grummelpilz | 200 | Beine | Arme | Pfirsich |
| `igel` | Mürrischer Igel | 240 | Bauch | Rücken | Butter |
| `schnecke` | Nebelschnecke | 260 | Schulter | Beine | Lavendel |
| `kraehe` | Brummelkrähe | 290 | Rücken | Bauch | Himmelblau |
| `moosriese` | Moosriese | 360 | Po, Hüfte | Schulter | Salbei |

- Reihenfolge = Weg: Das nächste Wesen ist das erste, das noch nicht im Freundebuch ist. Sind alle befreundet, kann man jedes erneut wählen.
- Jedes Wesen bekommt einen kurzen Intro-Satz und einen Freude-Satz (z. B. „Hihi, das hat gutgetan!“).

## 4. Kampfablauf (automatisch)
Bitte die vorhandene Timer-Engine und den Trainings-Screen so weit wie möglich wiederverwenden (gleiche Töne, Countdown in den letzten 5 s,
Pause/Weiter/Zurück, Wake Lock, Medien der Übung). Die Phasen werden fortlaufend erzeugt, bis das Wesen glücklich ist.

Oben im Trainings-Screen im Abenteuer zusätzlich: kleine Grafik des Wesens, **Laune-Balken** (füllt sich) und **Energie-Balken** des Profils (startet bei 100).

1. **Bereit** (10 s): Wesen stellt sich vor, Vorschau auf den ersten Angriff.
2. **Angriff** = eine Übung aus den Slots, Dauer wie im Training (Zeit-Wert bzw. Wdh. × 3 s; einseitig = links, Wechsel, rechts).
   - **Automatische Wahl:** erlaubte Slot-Übung mit dem höchsten Bonus gegen dieses Wesen, bei Gleichstand zufällig, nie zweimal direkt hintereinander (wenn möglich).
   - **Laune steigt live** jede Sekunde um `staerke × bonus`.
     Bonus: ×2, wenn eine Kategorie der Übung zu „Mag“ gehört; sonst ×0,5, wenn alle Kategorien „unbeeindruckt“ sind; sonst ×1.
   - Kleine Rückmeldung am Balken („+4“, bei Schwäche „Das mag es! ×2“).
3. **Grummel-Angriff** (5 s Ankündigung): „Der Grummelpilz schmollt zurück! Mach dich bereit …“
4. **Abwehr** (15 s): kurze Halte-Übung. Nimm eine erlaubte Übung aus der Kategorie Bauch aus dem Profil-Pool (bevorzugt mit „Plank“ im Namen).
   Gibt es keine, Platzhalter „Bauchspannung halten“.
   - Abwehr ganz durchgehalten → Energie −10. Abwehr übersprungen → Energie −25.
5. **Pause** (`S.pause`) mit Vorschau auf den nächsten Angriff und Button **„Anderen Angriff wählen“** (Liste der erlaubten Slots).
6. Weiter mit 2., bis der Laune-Balken voll ist → **Sieg**.

**Energie leer (≤ 0):** keine Niederlage. Text: „Puh, ich brauche nur eine kurze Pause, dann komme ich wieder!“ → **Puste-Pause** 30 s
(ruhige Übung aus „Abwärmen“, sonst Platzhalter „Tief durchatmen und lockern“). Danach Energie 50, die Laune des Wesens bleibt erhalten, weiter geht’s.

**Abbrechen** (X): wie im Training nachfragen. Ab 1 Minute wird es als abgebrochenes Training im Verlauf gespeichert. Die Laune des Wesens wird in dieser Version nicht gespeichert.

## 5. Sieg & Freundebuch
- **Sieg-Screen:** fröhliche Grafik des Wesens, Freude-Satz, „Der Grummelpilz ist jetzt dein Freund!“ (beim ersten Mal) bzw. „… freut sich, dich wiederzusehen!“.
  Statistik: Minuten, Angriffe, Puste-Pausen. Konfetti und Fanfare wie beim normalen Fertig-Screen.
- **Verlauf:** Eintrag mit `art: 'abenteuer'`, Titel „🌳 Abenteuer: Grummelpilz“. Zählt in Wochenübersicht und Statistik wie jedes Training.
- **Freundebuch** (eigener Screen): Raster aller 5 Wesen. Befreundete in Farbe mit Datum des ersten Mals und „x-mal aufgeheitert“,
  noch nicht befreundete als blasse Silhouette mit „?“.

## 6. Grafik
- Noch keine richtigen Illustrationen: Claude baut **Platzhalter als SVG/CSS** im App-Stil (runde, weiche Formen, Pastellfarben, einfache Gesichter).
- Jedes Wesen soll erkennbar anders aussehen (Pilzhut, Stacheln, Schneckenhaus, Flügel, Moos).
- **Gesicht je nach Laune:** grummelig (< 33 %), neutral (33–66 %), fröhlich (> 66 %), strahlend beim Sieg. Leichte Wipp-Animation.
- Grafiken so anlegen (z. B. eine Funktion `wesenSvg(id, stimmung)`), dass sie später einfach durch Bilddateien ersetzt werden können.

## 7. Speicher (pro Profil)
`localStorage` `flivfit.abenteuer.<Profil>`:
`{slots:[übungs-id …], geraete:[…], freunde:{<wesen-id>:{erstesMal, anzahl}}}`.
Ein laufender Kampf muss nicht gespeichert werden (wie beim Timer-Training).

## 8. Abschluss
- Version **1.6.0** (`APP_VERSION` in `index.html`, `VERSION` in `sw.js`).
- `CLAUDE.md` um einen Abschnitt „Abenteuer“ ergänzen (Ablauf, Formeln, Speicher, Erweiterungspunkte für später).
- `docs/merkliste.md` aktualisieren: Teil 1 als umgesetzt herausnehmen. Für später festhalten: Erfahrungspunkte/Level, Items (z. B. Heil-Smoothie),
  Equipment, Weltkarte mit Etappen und Bossen, Bedingungen („nur ohne Gerät“, „in 10 Minuten“), was eine leere Energie später kosten könnte, eigene Grafiken.
- In Handy-Größe testen: Reiter passen in eine Zeile, Slots bearbeiten, ein kompletter Kampf mit Schwäche-Bonus, Abwehr, Puste-Pause (Energie testweise niedrig setzen), Sieg, Freundebuch, Verlauf.
- Kurz zusammenfassen, was geändert wurde.
