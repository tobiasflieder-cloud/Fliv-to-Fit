# FlivFit – Merkliste

Geplante Änderungen, die noch nicht umgesetzt sind. Erledigte Punkte werden hier gelöscht.

## Idee (langfristig): Spielmodus mit Gamification
- Noch kein Bauauftrag – erst im claude.ai-Chat durchdenken.
- **Für jeden allein:** Fliv und Flivi spielen jeweils ihr eigenes Abenteuer (Fortschritt pro Profil, kein Gegeneinander).
- **Welt:** hübsch, warm, von Ghibli *inspiriert* (Stimmung: Natur, sanfte Farben, gemütlich-magisch), aber eigene Welt, eigene Figuren, kein Nachbau.
  Passt zum bestehenden Design (pastellig, rund).
- **Spielprinzip** angelehnt an Abenteuer-Fitnessspiele wie Ring Fit Adventure (eigenes Konzept, kein Nachbau):
  - Training = Kampf: Übungen sind Angriffe bzw. Verteidigung.
  - Gegner und Bosse mit **Schwächen** (z. B. anfällig für bestimmte Kategorien wie Beine oder Bauch) und **Bedingungen**
    (z. B. „nur Übungen ohne Gerät“, „Boss erst ab Level 5“, „in 10 Minuten besiegen“).
  - **Levelaufstieg** mit Erfahrungspunkten aus Trainings.
  - **Items** (z. B. Heiltränke, Stärkungen) und **Equipment** (Ausrüstung mit Werten).
  - Eine Reise durch die Welt, die mit jedem Training weitergeht.
- **Entschieden:**
  - **Eigener Modus** neben Zufall, Plan und Frei (vierter Reiter auf der Startseite).
  - **Auswahl am Anfang:** Vor dem Abenteuer wählt man (wie bei „Womit?“) die verfügbaren Geräte.
    Die Angriffe/Übungen richten sich danach: Mit Hantel gewählt dürfen auch Hantel-Übungen kommen, sonst nicht
    (gleiche Logik wie `geraetErlaubt()`).
  - **Grafik:** Claude baut erst Platzhalter-Grafiken (SVG/CSS, im Stil der App). Später ggf. durch richtige Illustrationen ersetzen.
  - **Sanft, kein Zwang:** keine Strafen bei Trainingspausen, kein Fortschrittsverlust. Man spielt einfach weiter, wenn man kann.
- Noch offen:
  - Wie genau werden Übungen zu Angriffen? (z. B. Kategorie = Angriffsart, Wdh./Sekunden = Schaden, eingetragene Leistung zählt mit)
  - Wie lang ist ein Kampf / eine Spielrunde? (feste Zeit wie beim Zufallstraining oder bis der Gegner besiegt ist)
  - Umfang: in mehreren Versionen schrittweise bauen (erst Level/XP, dann Gegner, dann Items/Equipment, dann Welt)?
