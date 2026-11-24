# FlivFit

Kleine Kraft-Workout-App fürs Handy: eigener Übungspool mit Bildern, Training nach Zeit und Kategorie, Timer mit Pausen und Piepen, Verlauf.

## Einrichten (einmalig)
1. Neues GitHub-Repo anlegen, z. B. `flivfit`.
2. Den gesamten Inhalt dieser ZIP hochladen (index.html, sw.js, manifest.webmanifest, Ordner `data`, `fonts`, `icons`).
3. Settings → Pages → Branch `main`, Ordner `/ (root)` → Save.
4. Die Seite am Handy öffnen und „Zum Startbildschirm hinzufügen“ bzw. „App installieren“ wählen.

## Neue Übungen & Pläne auf beide Handys bringen
1. In der App Übungen oder Pläne anlegen bzw. bearbeiten.
2. Übungen → „Export“ (oder Einstellungen → „Für GitHub exportieren“) → ZIP speichern.
3. ZIP entpacken und den Ordner `data` im Repo hochladen (alte Dateien ersetzen).
4. Beim nächsten Öffnen mit Internet laden beide Handys den neuen Stand.

## Neue App-Version
Dateien ersetzen und in `sw.js` die Versionsnummer (`VERSION`) hochzählen. Den Ordner `data` nicht mit einem älteren Stand überschreiben.

Lokale Daten (Verlauf, Einstellungen, eingetragene Wiederholungen, noch nicht exportierte Übungen und Pläne) liegen nur auf dem jeweiligen Handy.
