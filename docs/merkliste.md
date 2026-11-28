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
