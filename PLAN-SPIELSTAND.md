# Auftrag für die Coding-Sitzung: Spielstand als Datei und zwei Speicherplätze

**Stand:** 19.10.2026, fertig geplant im Projekt-Chat mit Dome (Fragen 1–38), Code-Stand beim Planen v513. Etappen S1 (mittel), S2 (klein), S3 (mittel), S4 (klein); Reihenfolge S1 → S2 → S3 → S4.

## Zuerst speichern
1. Diese Datei im Repo als `PLAN-SPIELSTAND.md` speichern.
2. In `PROJEKT-CHAT-THEMEN.md` Punkt 9 („Spielstand zwischen PC und Handy übertragen“) ergänzen: „geplant → PLAN-SPIELSTAND.md“.
3. In `PROJEKT-CHAT-THEMEN.md` neuen Punkt anlegen: **„Speicherplatz (noch im Projekt-Chat besprechen)“**: Browser-Speicher (ca. 5 MB) kann bei langen Spielen und zwei Speicherplätzen voll werden. Dome will **nichts automatisch löschen**: besondere Briefe bleiben, Turnierergebnisse müssen ein Pferdeleben lang sichtbar bleiben (Verkaufswert). Gepackt speichern ist schon in S1 Punkt 11 enthalten; offen ist nur, ob und was später aufgeräumt werden darf.
4. Dann Etappe für Etappe umsetzen, abhaken und nach jeder Etappe auf `main` hochladen.

## Änderungen von Dome (19.10.2026, nach S1–S3 – gelten vor dem Text unten)
1. **Keine Rücksicherung** („Letzte Ersetzung rückgängig“ ist raus, S1 Punkt 8 entfällt). Ersetzen/Löschen/Kopieren/Laden fragen nur „Sicher?“.
2. **Neues Spiel legt keinen Speicherstand an** (S1 Punkt 4 geändert): kein Platz bei „Neues Spiel“; ein Einsteiger-Tipp „💾 Spiel speichern nicht vergessen“ erinnert daran; beim **ersten Speichern** wählt der Spieler den Speicherplatz.
3. Überall **„Speicherplatz 1 / Speicherplatz 2“** statt „Platz 1 / Platz 2“.
4. Alte Spielstände (vor S1) landen trotzdem einmal auf Speicherplatz 1 (Claude, damit das laufende Spiel nicht verloren geht – mit Dome klären).

## Ist-Stand (v513)
1. Ein Spielstand je Browser in `localStorage["zuchtstall-v2"]` (alle Höfe in einem Objekt `spiel`). Turnier-Sortierung extra in `localStorage["zuchtstall-tsort"]`.
2. `speichern()` fängt Fehler stumm ab (`try { setItem } catch (e) {}`). Ist der Speicher voll, wird ohne Warnung nicht mehr gespeichert.
3. Größe: ca. 350 KB nach gut 2 Spieljahren (`hof-gesamttest.js`); größte Teile `boxen`, `marktStand`, `post`, `hoefe`, `friedhof`, `rennKauf`, `turniere`.
4. Datei sichern gibt es nur im Notfall-Fenster (`nfSichern`, Datei `zuchtstall-spielstand.json`, rohes `spiel`-Objekt).
5. `spielVerloren()` löscht den Spielstand (`localStorage.removeItem(SPEICHER)`).
6. Spielstände von vor dem Hof-Ausbau (`!s.hofAusbau`) gelten als „alter Spielstand“.

## Etappe S1 – Selbst speichern, zwei Speicherplätze und Autospeicher (mittel)
Grundidee (Dome, 19.10.2026): Ein Speicherplatz enthält nur, was der Spieler **selbst** speichert. Der laufende Stand liegt im **Autospeicher**.

1. **Drei Plätze im Browser:**
   1. **Autospeicher** (einer für alle, bisheriger Schlüssel `zuchtstall-v2`): speichert wie bisher nach jeder Aktion den zuletzt gespielten Stand. Bestehende Spielstände landen so automatisch im Autospeicher und zusätzlich einmal auf Platz 1 (damit es gleich einen Speicherstand gibt).
   2. **Platz 1** (`zuchtstall-p1`) und **Platz 2** (`zuchtstall-p2`): ändern sich nur, wenn der Spieler speichert.
2. Jedes Spiel bekommt beim Start eine unsichtbare **Spiel-Nummer** `spiel.spielId` (Zufallswert) und merkt sich seinen Platz (`spiel.platz` = 1 oder 2). Alte Spielstände bekommen beides beim Laden.
3. **Selbst speichern:** Menü ☰ - „💾 Spiel speichern“ und Hofverwaltung - Einstellungen - „💾 Spiel speichern“. Speichert auf den eigenen Platz des Spiels; Meldung „Gespeichert auf Platz 1 (Sonnenhof, Jahr 3 Sommer)“.
4. **Neues Spiel:** fragt nach dem Platz (Dome: ja, damit es von Anfang an einen Speicherstand gibt) (belegt → „Platz 1 (Sonnenhof, Jahr 3 Sommer) wird ersetzt. Sicher?“). Das neue Spiel wird sofort einmal auf diesen Platz gespeichert und läuft im Autospeicher.
5. **Startmenü** zeigt drei Zeilen, immer mit Hofname:
   1. „▶ Weiterspielen – Sonnenhof · läuft: Jahr 4 Frühling (Platz 1)“ = Autospeicher.
   2. „Platz 1 – Sonnenhof · gespeichert: Jahr 3 Sommer, am 19.10.2026“ mit „Spielen“, „🗑️ Löschen“, „📋 In den anderen Platz kopieren“, „💾 Als Datei“.
   3. „Platz 2 – …“ genauso, leer: „frei“.
6. **Platz wechseln** nur im Startmenü (Menü - Hauptmenü - Startmenü). Hat der Autospeicher Fortschritt, der noch nicht auf seinem Platz gespeichert ist: „Ungespeicherter Fortschritt auf Platz 1 (Sonnenhof, seit Jahr 3 Sommer). Jetzt speichern?“ (Speichern / Nicht speichern / Abbrechen). Dann wird der gewählte Platz in den Autospeicher geladen.
7. Adminmodus, Spieltempo und Sparmodus gelten je Spiel (stehen ohnehin in `spiel`). Die **Turnier-Sortierung** wandert in den Spielstand (`spiel.tsort`; alten Wert aus `zuchtstall-tsort` einmalig übernehmen).
8. **Rücksicherung:** Bevor Platz 1 oder 2 ersetzt oder gelöscht wird (Neues Spiel, Kopieren, Laden aus Datei, Löschen), wird der alte Stand **einmal** in `zuchtstall-rueck` gesichert (mit Platznummer und Kurzinfo). Startmenü-Knopf „↩️ Letzte Ersetzung rückgängig (Platz 1: Sonnenhof, Jahr 3 Sommer)“. Immer nur eine Rücksicherung; die nächste überschreibt sie.
9. **Spiel verloren:** Der Autospeicher dieses Spiels wird gelöscht, die Speicherplätze bleiben. Im Abschlussfenster: „Vom letzten Speicherstand neu starten (Platz 1, Sonnenhof, Jahr 3 Sommer)“. Platz 2 bleibt unberührt und kann ebenfalls gespielt werden. Ältere Dateien dürfen immer geladen werden.
10. **Speichern schlägt fehl** (Speicher voll o. Ä.): sofort eine rote Meldung „Dein Spiel konnte nicht gespeichert werden. Bitte jetzt als Datei sichern.“ mit Knopf „💾 Jetzt als Datei sichern“. Höchstens einmal pro Spieltag zeigen, Speichern bei jedem Anlass weiter versuchen.
11. **Gepackt speichern** (Dome, 19.10.): Autospeicher, Platz 1, Platz 2 und Rücksicherung werden im Browser gepackt abgelegt (z. B. `LZString.compressToUTF16`, Bibliothek lokal ins Repo legen, kein CDN). Beim Lesen erkennen: beginnt der Text mit `{`, ist er noch ungepackt (alte Spielstände) → normal lesen und beim nächsten Speichern gepackt schreiben. Es geht nichts verloren; die **Datei** zum Teilen bleibt ungepackt und lesbar. Größe vorher/nachher im Adminmodus (bzn) anzeigen.

## Etappe S2 – Spielstand als Datei speichern (klein)
1. Knöpfe: Hofverwaltung - Einstellungen - „💾 Spielstand als Datei speichern“ und im Startmenü bei Autospeicher, Platz 1 und Platz 2. Der Spieler **wählt**, welchen Stand er als Datei speichert: „laufendes Spiel (Autospeicher)“, „Platz 1“ oder „Platz 2“ (Dome).
2. **Dateiformat** (lesbares JSON, nicht gepackt, damit Dome Dateien der Coding-Sitzung zur Analyse geben kann):
   ```
   { "typ": "zuchtstall-spielstand", "format": 1, "version": "<SPIEL_VERSION>",
     "gespeichert": "<echtes Datum/Uhrzeit ISO>", "spielId": "…",
     "info": { "hoefe": ["Sonnenhof", …], "spieldatum": "Jahr 3, Sommer, Tag 4", "pferde": 12, "geld": 23450 },
     "spiel": { …komplettes spiel-Objekt… } }
   ```
3. **Dateiname:** `Zuchtstall_<Hofname>_Jahr<j>-<Jahreszeit>_<JJJJ-MM-TT>.json`, z. B. `Zuchtstall_Sonnenhof_Jahr3-Sommer_2026-10-19.json`. Hofname = erster Hof; Zeichen `/ \ : * ? " < > |` und Leerzeichen durch `-` ersetzen, Umlaute dürfen bleiben.
4. **Handy:** wenn `navigator.canShare({ files: [datei] })` geht → Teilen-Menü (`navigator.share`), damit Dome die Datei direkt per **Telegram** oder **E-Mail** schicken kann (Dome hat kein WhatsApp und keine Cloud). Sonst und am PC: normal herunterladen, mit Hinweis „Die Datei kannst du z. B. per Telegram oder E-Mail an dein anderes Gerät schicken und dort im Startmenü laden.“
5. **Kein Link:** Ein Link mit dem Spielstand wäre viel zu lang (über 300.000 Zeichen, Telegram-Nachrichten max. 4.096), eine Online-Ablage bräuchte einen Server. Bewusst nicht gebaut.
6. In Hofverwaltung - Einstellungen steht „Zuletzt als Datei gesichert: 19.10.2026 · Jahr 3 Sommer“ (`spiel.zuletztExport`), sonst „noch nie“. Keine Erinnerungs-Fenster.
7. Das Notfall-Fenster behält „Spielstand sichern (Datei)“, nutzt aber dasselbe Dateiformat und denselben Dateinamen.

## Etappe S3 – Spielstand aus Datei laden (mittel)
1. Knöpfe: Startmenü - „📂 Spielstand aus Datei laden“ und im **Notfall-Fenster** „📂 Spielstand aus Datei laden“. Nicht mitten im Spiel.
2. Ablauf: Platz 1 oder 2 wählen → Datei wählen (`<input type="file" accept=".json,application/json">`) → prüfen → Vorschau → bestätigen → Datei liegt auf dem Platz → Frage „Jetzt spielen?“ (Dome: ja) (ja → wie „Spielen“ im Startmenü, mit Abfrage bei ungespeichertem Fortschritt aus S1 Punkt 6).
3. **Prüfen**, mit klarer Meldung und ohne etwas zu verändern:
   1. kein JSON / kein Zuchtstall-Spielstand: „Diese Datei ist kein Zuchtstall-Spielstand.“
   2. alte Notfall-Dateien (rohes `spiel`-Objekt mit `boxen`) werden wie ein Spielstand angenommen.
   3. von vor dem Hof-Ausbau (`!hofAusbau`): „Dieser Spielstand ist von vor dem Hof-Ausbau und kann nicht mehr gespielt werden.“
   4. `version` neuer als die geladene Spielversion: „Diese Datei stammt aus einer neueren Spielversion. Bitte die Seite neu laden, dein Spiel ist veraltet.“
4. **Vorschau:** Hof/Höfe, Spieldatum, Anzahl Pferde, Geld, gespeichert am (echtes Datum), Spielversion. Knöpfe „Ja, laden“ / „Abbrechen“.
5. **Warnung ältere Datei:** Gibt es dieselbe `spielId` schon im Autospeicher oder auf einem Platz und ist der dortige Stand weiter (`spiel.tag` größer): „Auf Platz 2 bist du in diesem Spiel schon weiter (Jahr 4 Herbst). Trotzdem laden?“
6. Ist der Zielplatz belegt: Sicherheitsfrage wie bei S1 Punkt 4, vorher Rücksicherung (S1 Punkt 8).
7. Laden: Datei durch dieselbe Ergänzung fehlender Felder schicken wie beim normalen Start (abwärtskompatibel), speichern, Seite sauber neu starten (keine halb laufenden Zeitgeber).
8. **Verlorene Spiele:** Ältere Sicherungen lassen sich nach einem Verlust immer laden und weiterspielen (Dome). Eine Datei vom Zustand *nach* der Zwangsversteigerung gibt es derzeit nicht (Spielstand wird gelöscht); falls Thema 2 („Spiel-verloren-Bilanz“, letzter Stand zum Ansehen) so eine Datei möglich macht, wird sie nur zum Ansehen geöffnet – das wird in Thema 2 geplant.

## Etappe S4 – Spielprotokoll für Analyse (klein)
1. **Zähler je Jahreszeit** in `spiel.protokoll["<jahr>-<jz>"]`, z. B.: selbst gefüttert, vom Personal gefüttert, selbst geputzt, gemistet, Hufe ausgekratzt, Training je Disziplin, Turnierstarts/Siege, Pferde gekauft (je Markt), verkauft, gezüchtet, Fohlen geboren, Tierarzt-/Klinikbesuche, Todesfälle, Briefe gelesen, Kredite, Bauaufträge, Mitarbeiter eingestellt/gekündigt.
2. Größe: ca. 1–2 KB pro Spieljahr, darum **immer an** (Dome, 19.10.). Für den Spieler unsichtbar; wird für die Bilanz in Thema 2 gebraucht.
3. Zusätzlich Schalter in Hofverwaltung - Einstellungen: **„🧪 Testspiel: ausführliches Protokoll“** (Standard aus). Wenn an: jede Aktion mit Spieltag in `spiel.tagebuch` (Aktion, Pferd, Ort, Betrag). Nur für Test- und Lernspiele, die Dome der Coding-Sitzung zur Analyse gibt; braucht spürbar mehr Speicher (Anzeige der ungefähren Größe beim Schalter).
4. Zähler und Tagebuch sieht der Spieler nicht; im Adminmodus unter Enzyklopädie - Berechnungen zum Nachschlagen als Übersicht.

## Enzyklopädie
1. Neuer Eintrag „Spielstand und Speicherplätze“: zwei Plätze, Datei speichern/teilen/laden, Rücksicherung, was beim Verlieren passiert, Hinweis auf Telegram/E-Mail.
2. Im Adminmodus (bzn): Dateiformat, Schlüssel im Browser, Rücksicherung, Protokoll-Felder.

## Testen
1. Test-Skript: altes Spiel unter `zuchtstall-v2` → Autospeicher + Platz 1; neues Spiel auf Platz 2; spielen, selbst speichern, wechseln (mit und ohne ungespeicherten Fortschritt), neu laden; Kopieren, Löschen, Rücksicherung rückgängig.
2. Datei speichern und auf dem anderen Platz laden: Spielstand identisch (bis auf `zuletztExport`).
3. Falsche Datei, kaputtes JSON, Datei vor Hof-Ausbau, Datei mit höherer Version, ältere Datei derselben `spielId` → jeweils richtige Meldung, nichts verändert.
4. Speicher voll simulieren (`setItem` wirft) → rote Meldung erscheint, höchstens einmal pro Spieltag.
5. Spiel verlieren auf Platz 1 → Autospeicher weg, Platz 1 und 2 bleiben, „Vom letzten Speicherstand neu starten“ funktioniert, ältere Datei lässt sich laden.
6. Screenshots Startmenü, Lade-Vorschau und Einstellungen in PC 1366×768, Handy quer 844×390, Handy hochkant 390×844.

## Fortschritt (Claude hakt ab)
- [x] S1 Selbst speichern, zwei Plätze, Autospeicher, Rücksicherung, gepackt (v519, `tests/spielstand-test.js`)
- [x] S2 Spielstand als Datei speichern (v520)
- [x] S3 Spielstand aus Datei laden (v521/v522, Notfall-Fenster kann auch laden)
- [ ] S4 Spielprotokoll – **offen** (Volumen reichte nicht; für die nächste Sitzung)
