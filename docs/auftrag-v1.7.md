# Auftrag: FlivFit Version 1.7 – Abenteuer Teil 2: Karte, Level & Animationen

Bitte vorher `CLAUDE.md` (Abschnitt „Abenteuer“) und `docs/merkliste.md` lesen. Baut auf v1.6 auf.
Alle Texte auf Deutsch, Stil cozy, warm, pastellig, rund. Sanft: keine Strafen, man kann nicht verlieren.

## 1. Karte „Pilzwald“ (Gebiet 1)
- Im Reiter „🌳 Abenteuer“ ersetzt die **Karte** die bisherige Karte „Nächstes Wesen“ als oberstes Element.
  Darunter bleiben „Womit?“, „Deine Angriffe“ und „📖 Freundebuch“.
- **Weg mit Stationen** (Konstante, z. B. `KARTE`, so angelegt, dass später weitere Gebiete angehängt werden können):
  Start → `pilz` → 🏕️ Rastplatz → `igel` → `schnecke` → 🏕️ Rastplatz → `kraehe` → `moosriese` (Ende Gebiet 1)
- Darstellung als **SVG-Platzhalter** im App-Stil: geschwungener Pfad durch eine weiche Waldlandschaft (Bäume, Pilze, Wiese als einfache Formen).
  Stationen als runde Punkte, Wesen-Stationen mit Mini-Version von `wesenSvg()`. Erreichte/befreundete Stationen farbig, kommende blass.
  Für Handy-Hochformat gestalten; die Karte darf vertikal scrollen oder als hoher Ausschnitt angezeigt werden, die aktuelle Position muss sichtbar sein.
- **Figur** des Profils (einfache runde Figur mit Profil-Emoji 🌸 / 🌿) steht an der aktuellen Station.
- Unter der Karte: Name des nächsten Ziels + Button **„Weiter wandern“**. Steht man am Ende des Gebiets: Hinweis „Gebiet 2 kommt bald“ (bzw. „ab Level 5“, siehe 3).
- Befreundete Wesen können weiterhin über das Freundebuch erneut besucht werden (startet den Kampf direkt, ohne Wanderung, Position auf der Karte bleibt).
- Position auf der Karte wird pro Profil gespeichert. **Übernahme aus v1.6:** Startposition = Station nach dem letzten bereits befreundeten Wesen in Wegreihenfolge.

## 2. Ablauf einer Abenteuer-Sitzung
Timer-Engine wie in v1.6 weiterverwenden, Phasen fortlaufend anhängen. Eine **Sitzung** = vom Tippen auf „Weiter wandern“ bis „Für heute genug“ oder Abbruch.
1. **Wandern** (30 s): Übung aus Kategorie „Aufwärmen“ (Geräteauswahl beachten), sonst Platzhalter „Auf der Stelle laufen“.
   Oben im Screen eine kleine Kartenansicht, auf der die Figur während der 30 s **live** zur nächsten Station läuft.
2. **An der Station:**
   - **Wesen:** Kampf startet direkt (Ablauf wie v1.6, die Bereit-Phase zeigt das Intro).
   - **Rastplatz:** „Zeit für eine Rast“ → Energie auf Maximum, 30 s Dehnpause (Übung aus „Abwärmen“, sonst „Locker dehnen und durchatmen“), +30 EP.
     Danach geht es **automatisch** mit der nächsten Wanderung weiter.
3. **Nach einem Sieg:** Sieg-Screen (siehe 5) mit zwei Buttons: **„Weiter wandern“** (nächste Wanderung, gleiche Sitzung) und **„Für heute genug“** (Sitzung beenden).
4. **Abbruch** (X) wie bisher mit Nachfrage. Fortschritt auf der Karte (erreichte Stationen, Freunde) bleibt erhalten; die Laune eines halb aufgeheiterten Wesens nicht.

**Verlauf:** pro Sitzung **ein** Eintrag `art:'abenteuer'` mit Gesamtdauer (Wandern + Kämpfe + Pausen), Titel z. B. „🌳 Abenteuer: Grummelpilz, Igel“,
Anzahl Angriffe, aufgeheiterte Wesen, verdiente EP. Zählt in Wochenübersicht und Statistik. Ab 1 Minute speichern, auch bei Abbruch.

## 3. Energie
- Energie bleibt **zwischen Kämpfen erhalten** (pro Profil gespeichert) statt bei jedem Kampf auf 100 zu starten.
- **Neuer Tag** (Datum geändert seit dem letzten Abenteuer) → Energie automatisch wieder voll.
- Maximum = 100 + 5 × (Level − 1). Rastplatz füllt auf Maximum. Puste-Pause wie bisher (danach 50 % des Maximums).

## 4. Level & Erfahrungspunkte (nur im Abenteuer)
- **EP verdienen** (normale Trainings geben **keine** EP):
  - 10 EP pro Minute Abenteuer-Zeit (Wandern, Kämpfe, Pausen; anteilig, gerundet beim Sitzungsende bzw. laufend)
  - +30 EP pro erreichtem Rastplatz
  - Pro aufgeheitertem Wesen: `ziel / 2` EP, beim **ersten** Mal (neuer Freund) doppelt (`ziel`).
  - Moosriese beim ersten Mal zusätzlich +150 EP Gebiets-Bonus.
- **Level-Kurve:** Für den Aufstieg von Level n auf n+1 braucht man `100 × n` EP (Level 2 nach 100, Level 3 nach weiteren 200 …). Start Level 1.
- **Was ein Level bringt:**
  - Laune-Wirkung × (1 + 0,05 × (Level − 1)) – in `launeProSek` einrechnen
  - Max. Energie +5 pro Level
  - 7. Angriffs-Slot ab Level 3, 8. ab Level 6 (gesperrte Slots mit Schloss und „ab Level X“ anzeigen)
  - Gebiet 2 öffnet sich später ab Level 5 **und** wenn der Moosriese befreundet ist (jetzt nur als Hinweis anzeigen, Gebiet 2 gibt es noch nicht)
- **Anzeige:** Im Abenteuer-Reiter neben/über der Karte: „Level 4“ + EP-Balken („120 / 400 EP“) + Energie.
  Auf dem Sieg-Screen und am Sitzungsende die verdienten EP („+250 EP“) mit kleiner Zähl-Animation.
  **Level-up:** eigene kleine Animation/Overlay „Level 4! 🎉“ mit Liste, was neu ist (z. B. „+5 Energie“, „7. Angriffs-Slot frei“).
- **Übernahme aus v1.6:** Beim ersten Start von v1.7 die schon vorhandenen Abenteuer-Einträge im Verlauf und das Freundebuch einmalig in EP umrechnen
  (Minuten × 10 + Wesen-EP nach obiger Regel, erstes Mal doppelt), damit niemand bei Level 1 anfängt.

## 5. Animationen im Kampf (cozy: Freude statt Schaden)
- **Treffer** (alle 2–3 s während eines Angriffs, nicht jede Sekunde): Wesen zuckt/kichert kurz (kleines Hüpfen bzw. Squash & Stretch),
  2–4 kleine Herzchen/Sternchen/Funken steigen auf – Farbe passend zur Kategorie der Übung.
- **Schwäche (×2):** größerer Effekt: Funkenregen, Wesen wackelt vor Lachen, Text „Das mag es!“ größer aufploppen.
- **Resistenz (×½):** Wesen guckt skeptisch (Augenbrauen), kleines graues Wölkchen statt Herzchen.
- **Stimmungswechsel** (grummelig → neutral → fröhlich): kurzer „Plopp“ mit Glitzer.
- **Grummel-Angriff:** Wesen bläst die Backen auf, eine kleine Grummelwolke fliegt Richtung Energie-Balken, der kurz wackelt.
- **Sieg:** Wesen strahlt und hüpft, **Blüten-Konfetti** statt normalem Konfetti.
- Nur CSS/SVG-Animationen, flüssig auf dem Handy; bei `prefers-reduced-motion` reduzieren.

## 6. Speicher
`flivfit.abenteuer.<Profil>` erweitern um z. B. `{position, energie, energieDatum, ep, level, uebernahmeV17}` (Namen frei, in `CLAUDE.md` dokumentieren).

## 7. Abschluss
- Version **1.7.0** (`APP_VERSION` in `index.html`, `VERSION` in `sw.js`).
- `CLAUDE.md` Abschnitt „Abenteuer“ aktualisieren (Karte, Sitzung, Energie, EP-/Level-Formeln, Animationen, Speicher).
- `docs/merkliste.md`: Karte, Level/EP und Animationen als umgesetzt herausnehmen. Für später bleiben: Items (z. B. Heil-Smoothie), Equipment,
  Gebiet 2 und weitere Gebiete mit Bossen, Bedingungen („nur ohne Gerät“, „in 10 Minuten“), eigene Grafiken.
- In Handy-Größe testen: Karte mit Position, Wanderung mit laufender Figur, Rastplatz (Energie voll, automatisch weiter), Kampf mit Animationen
  (Schwäche, Resistenz, Stimmungswechsel, Grummel-Angriff), Sieg mit EP und Level-up, „Weiter wandern“ / „Für heute genug“, Verlauf-Eintrag,
  Energie am nächsten Tag voll (Datum testweise ändern), Übernahme aus v1.6.
- Danach wie üblich in `main` mergen und kurz zusammenfassen, was geändert wurde.
