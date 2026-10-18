# Zuchtstall – Planungsstand aus dem Projekt-Chat (Stand 18.10.2026, Code v425)

Diese Datei erklärt, wie das Spiel „Zuchtstall“ geplant wird, welche Grundregeln gelten, welche Pläne fertig sind und welche Themen noch offen sind. Sie ist für alle gedacht, die am Code mitarbeiten (Menschen und Claude-Sitzungen).

## 1. Wie die Planung funktioniert

1. Geplant wird in einem eigenen Projekt-Chat mit Claude, programmiert wird in einer separaten Coding-Sitzung mit diesem Repo. Der Projekt-Chat hat keinen Zugriff aufs Repo-Schreiben, die Coding-Sitzung keinen auf den Projekt-Chat.
2. Ablauf je Thema:
   1. Im Projekt-Chat wird ein Thema in Runden durchgesprochen. Claude macht nummerierte Vorschläge, Dome antwortet per Nummer („1. ja, 2. nein, lieber …“).
   2. Jede Entscheidung wird mit Datum festgehalten.
   3. Am Ende entsteht eine kopierfertige Zusammenfassung für die Coding-Sitzung, aufgeteilt in Etappen mit Größe (klein/mittel/groß).
   4. Dome bringt die Zusammenfassung in die Coding-Sitzung. Dort wird sie zuerst als `PLAN-….md` gespeichert, dann Etappe für Etappe umgesetzt und abgehakt. Nach jeder Etappe testet Dome auf Handy und PC.
   5. Rückmeldungen aus dem Code (z. B. „schon gebaut“, „offene Frage“) kommen zurück in den Projekt-Chat. Offene Themen stehen im Repo in `PROJEKT-CHAT-THEMEN.md` und `OFFENE-FRAGEN.md`.
3. Sprache: immer **Deutsch**, freundlich und knapp. Briefe im Spiel nutzen „Sie“ (Duzen erst später im Spiel möglich).
4. Vorschläge, Fragen und Listen sind **immer durchnummeriert**, auch Unterpunkte, damit Dome per Nummer antworten kann.
5. Menüpfade schreibt Dome **ausgeschrieben** mit Bindestrich, z. B. „Hauptmenü - Stall - Box - Pferdepflege - Ort“. Dazu gibt es Kürzel (siehe Abschnitt 3).
6. Unklares, Unrealistisches oder Widersprüchliches wird **erst nachgefragt** („Mir ist xy aufgefallen …“), nie eigenmächtig entschieden. Überschneidungen (z. B. ein Wert an zwei Stellen) werden angesprochen.

## 2. Grundregeln und feste Entscheidungen

1. Spielmechanik nur ändern, wenn Dome es verlangt hat. Ideen vorschlagen und fragen.
2. Jede Änderung testen. Screenshots in drei Ansichten (PC 1366×768, Handy quer 844×390, Handy hochkant 390×844) nur bei Änderungen am Aussehen, reine Logik per Test-Skript.
3. Enzyklopädie immer aktuell halten. Die Reiter „Vererbung“ und „Berechnungen zum Nachschlagen“ sind nur im Adminmodus sichtbar; dort gehören Zahlen und Regeln hin.
4. Versteckte Genetik und versteckte Werte (z. B. das Ansehen bei Briefpartnern) nie dem Spieler zeigen, nur über Labortests bzw. im Adminmodus.
5. Kamera-Aussparung (safe-area) beachten, Anzeige- und Interaktionsboxen dürfen sich nicht überdecken.
6. Nach einer Aktion nicht aus der Ansicht werfen („Rücksprung“: zurück dorthin, wo die Aktion gestartet wurde).
7. Beide Pferdeanhänger (in der Box und im Hauptmenü) immer gleich halten; nur der im Hauptmenü hat Mehrfachauswahl.
8. Speicherstände abwärtskompatibel halten (fehlende Felder mit Standardwerten füllen). Einzige bewusste Ausnahme: der Hof-Ausbau, für den ein neues Spiel nötig war.
9. Kommt eine neue Rasse dazu, kommen immer auch ihre rassetypischen Krankheiten, Veranlagungen und Eigenheiten mit (Entscheidung 05.10.2026).
10. Realismus: Preise, Gehälter, Futterwerte usw. werden nach echten Werten recherchiert. Körperliche Werte haben eine vererbte Obergrenze (Rasse und Eltern): ein Shetty springt nie wie ein Vollblut.
11. Spieltempo: 4, 7 oder 10 Tage pro Jahreszeit, Standard 7.
12. Turniere bleiben für alle Spieler offen, unabhängig von der Stallart.
13. Code-Abläufe: direkt auf `main` hochladen (kein Branch, kein Pull Request), vor jeder Aufgabe Aufwand einschätzen, Version bei jeder Auslieferung hochzählen (`SPIEL_VERSION`, `?v=`, `version.json`). Details stehen in `CLAUDE.md` im Repo.

## 3. Kürzel für Wege im Spiel

| Kürzel | Weg |
|---|---|
| hm | Hauptmenü |
| start | Startmenü |
| Menü | die drei Striche ☰ oben rechts |
| Stall / Box | hm - Stall / hm - Stall - Box |
| stb | Box - Steckbrief (Daten, Genetik, afs = Aufschlüsselung, gw = Gangwerk, Charakter, asb = Ausbildung) |
| ppf | Box - Pferdepflege (vsg = Versorgung, asr = Ausrüstung, Ort, Test nur Admin) |
| pah | beide Pferdeanhänger |
| pmk | hm - Pferdemarkt |
| hvw | hm - Hofverwaltung (Hof, Finanzen, Außer Haus, mab = Mitarbeiter, Post, esg = Einstellungen) |
| enz | hm - Enzyklopädie (Rassen, ras = Rassenansicht, vrb = Vererbung, bzn = Berechnungen zum Nachschlagen) |
| gdh / pfh | Gnadenhof / Pferdefriedhof |
| Rücksprung | nach einer Aktion zurück in die Ansicht, in der sie gestartet wurde |

„Ausbildung“ (asb) ist die Karte im Steckbrief; der **Ausbildungsstall** außer Haus wird immer ausgeschrieben.

## 4. Fertig geplante Pläne und Stand

| Nr. | Plan | Im Repo als | Inhalt | Stand |
|---|---|---|---|---|
| 1 | Werte-System | `PLAN-WERTE.md` | Charakter, mentale und körperliche Werte mit Obergrenzen, Charakter → Wohlbefinden, Vorlieben, Training daheim (Roundpen, Reitplatz, Gelände, Reithalle), Ausbildungsskala, Disziplinen (Dressur, Springen, Rennen, Vielseitigkeit, Distanz, Western), Turniere mit Kalender und Reiter-LK, Fohlenschau | umgesetzt |
| 2 | Spieltempo, Mitarbeiter, Krankheiten | Coding-Auftrag Etappen A–H | Tempo 4/7/10, Mitarbeiter mit Wissensbereichen und echten Gehältern, Befunde und Anzeichen, Tierarzt, Stallapotheke, Hufe und Hufschmied, Ansteckung und Quarantäne, Ankaufsuntersuchung, Erbkrankheiten | umgesetzt |
| 3 | Nachtrag Azubi und Stallarten | Teil von Plan 2 | Azubi und Ausbilder, Fachrichtungen je Stallart, Renn- und Westernstall | umgesetzt |
| 4 | Fütterung | `PLAN-FUETTERUNG.md` | Futterkammer und Futterhandel, Futterplan je Pferd mit Nährwerten, Futterzustand 1–9, empfindliche Atemwege, Leckerli, Futterumstellung, Futterexperte | umgesetzt |
| 5 | Hof-Ausbau | `PLAN-HOF.md` | Spielstart über Immobilien-Menü (alter Pensionsstall, halb Kredit), mehrere Höfe, Bauen in Stufen, Pension und Einsteller, Weiden, Paddock, Einstreu, Stallarten mit Bedingungen (1 Jahr Schonfrist), Hausturnier und Verkaufsrennen | umgesetzt |
| 6 | Veredler-Rassen | – | z. B. Clydesdale, Fell-Pony, Dales-Pony, Welsh Cob, Trakehner | gebaut (v316), Abnahme durch Dome offen |

Alle Pläne oben sind umgesetzt (Stand v425); dazu kommen laufend Testkorrekturen.

## 5. Offene Themen in Reihenfolge

Seit 12.10.2026 arbeitet Dome die offenen Themen vom kleinsten zum größten ab. Jedes Thema bekommt eine eigene kopierfertige Zusammenfassung.

1. Spielstand als Datei exportieren und importieren (klein) ← wird gerade geplant
2. Spiel-verloren-Bilanz (klein)
3. Raritäten-Markt (klein/mittel)
4. Hinweisblasen für neue Spieler (mittel)
5. Karte „Merkmale“ (mittel)
6. Spielansicht aufräumen (mittel)
7. Ausbildungsskala für andere Disziplinen (mittel, mit Recherche)
8. Reiter-Erfahrung (mittel)
9. Mitarbeiter-Aufgaben einstellen (mittel)
10. Eigener Deckhengst mit Anfragen und Terminen (mittel/groß)
11. Ausrüstung (Decken, Schabracken …) plus Sachpreise bei kleinen Turnieren (groß)
12. Zwei Fohlen in einer Box und Zwillinge (groß)
13. Aufzucht- und Ausbildungsstall außer Haus umbauen (je Disziplin, Charakter, Abbruch-Brief) (groß)
14. Echte Preise im ganzen Spiel plus Balance der Tierschutz-Strategie (sehr groß, bewusst zuletzt, weil alles davor Preise berührt)

### Thema 1: Spielstand Export/Import (Vorschläge, Antwort von Dome steht noch aus)

Ist-Stand: Es gibt einen Spielstand im Browser (`localStorage["zuchtstall-v2"]`); eine Datei-Sicherung gibt es nur im Notfall-Fenster, wenn das Spiel nicht startet.

1. Speichern unter Hofverwaltung - Einstellungen - „Spielstand als Datei speichern“.
2. Laden im Startmenü - „Spielstand aus Datei laden“, mit Sicherheitsfrage „Dein jetziger Hof wird ersetzt“.
3. Dateiname mit Hofname und Spieldatum, z. B. „Zuchtstall-Sonnenhof-Jahr3-Sommer.json“.
4. Vor dem Laden den alten Stand automatisch als Datei sichern (empfohlen: ja).
5. Keine regelmäßige Erinnerung, nur der Knopf (empfohlen).

### Später, erst wenn Dome es sagt

1. Weitere Rassen (Knabstrupper, Appaloosa, Noriker, Paint Horse).
2. Inzucht-Auswirkungen.
3. Vererbung von Abzeichen und Kopfgröße (die Kopfform-Vererbung ist seit v424 eingebaut).
4. Gangpferdestall und Trabrennbahn (mit Rasse Traber).
5. Selbst reiten.

## 6. Für neue Mitarbeitende

1. Erst `CLAUDE.md` lesen (Spielsysteme, Testen, Versionierung), dann die `PLAN-….md`-Dateien für die Hintergründe.
2. Neue Ideen nicht direkt einbauen, sondern mit Dome abstimmen; größere Themen werden im Projekt-Chat geplant und kommen als Zusammenfassung zurück.
3. Diese Datei wird aktualisiert, wenn im Projekt-Chat ein Thema fertig geplant ist.
