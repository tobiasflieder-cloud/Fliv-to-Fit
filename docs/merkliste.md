# FlivFit – Merkliste

Geplante Änderungen, die noch nicht umgesetzt sind. Erledigte Punkte werden hier gelöscht.

## Video-Komprimierung beim Hochladen (geplant als v1.5.0)
- Beim Hinzufügen eines Videos in „Übung bearbeiten“ wird es in der App kleiner neu aufgenommen, ohne zusätzliche Bibliotheken:
  Video im Hintergrund abspielen, Bild über ein Canvas mit `MediaRecorder` neu aufnehmen.
- Ziel: 720p (längere Seite max. 1280 px), ca. 1,5 Mbit/s, ohne Ton (Videos laufen eh stumm) → ca. 3 MB für 15 s.
- Ergebnis als WebM (läuft auf Android).
- Dauer ≈ Videolänge, dabei Fortschrittsanzeige; die App muss währenddessen offen bleiben.
- Das 20-MB-Limit (`VIDEO_MAX_MB`) gilt erst nach der Komprimierung.
- Falls die Komprimierung fehlschlägt oder das Ergebnis größer wäre: Originalvideo verwenden (mit Limit wie bisher).

## Uhrzeit beim „Übungsstand“
- In den Einstellungen unten steht bisher nur das Datum des Exports („Übungsstand 25.11.2026“).
- Zusätzlich die Uhrzeit anzeigen (z. B. „25.11.2026, 14:32“), damit man nach dem Upload sicher erkennt, welcher Export angekommen ist (`REPO.stand`).

## Ersetzte Bilder/Videos am Handy erkennen
- Der Service Worker cacht Dateien aus `data/bilder/` nach Dateinamen („erst Cache“). Wird eine Datei mit gleichem Namen ersetzt
  (z. B. neues `squats-1.jpg`), zeigt das Handy bis zur nächsten App-Version weiter die alte.
- Lösung: Bei neuem Übungsstand (`stand` in `uebungen.json` ändert sich) die zwischengespeicherten Bilder/Videos verwerfen bzw. neu laden,
  z. B. über einen Versions-Parameter an der Bild-URL (`?v=<stand>`) oder Cache-Bereinigung.

## Idee (langfristig): Spielmodus mit Gamification
- Noch kein Bauauftrag – erst im claude.ai-Chat durchdenken.
- Inspiration: Abenteuer-Fitnessspiele wie Ring Fit Adventure – Training fühlt sich wie ein Spiel an. Eigenes Konzept, kein Nachbau.
- Mögliche Bausteine zum Besprechen: Erfahrungspunkte und Level pro Profil, Wochen-Serien, Abzeichen/Erfolge,
  eine kleine eigene Welt oder Reise, die mit jedem Training weitergeht, gemeinsame Ziele für Fliv & Flivi.
- Offene Fragen: Wie viel Spiel vs. schnelles Training? Gemeinsam oder gegeneinander? Wie mit dem bestehenden Verlauf verknüpfen?
