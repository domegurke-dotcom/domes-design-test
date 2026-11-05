# Projektübermittlung: Projekt „Zuchtstall“ (Domes Pferdezucht-Spiel)

Stand der Quellen: Themenliste `themen/reihenfolge.md` (aufgeräumt 26.10.2026), Code-Version **v852** (Repo `domegurke-dotcom/domes-design-test`, letzter Commit 26.10.2026). Dieses Dokument ist so geschrieben, dass ein neues Team ohne Vorwissen weiterarbeiten kann. Wo die Quellen etwas nicht sagen, steht „unklar“.

---

## 1. Worum es geht

**Das Spiel.** „Zuchtstall“ ist ein Browser-Pferdezuchtspiel auf Deutsch (Handy und PC). Man führt einen Hof: Pferde kaufen, züchten, pflegen, füttern, trainieren, auf Turniere schicken, verkaufen, Pension anbieten, Mitarbeiter einstellen, bauen. Live unter https://domegurke-dotcom.github.io/domes-design-test/ (GitHub Pages, Branch `main`). Der Code besteht im Kern aus `index.html` (Oberfläche und Logik in einem großen Skript), `pferd.js` (SVG-Pferdezeichnung, Rassen), `kopfneu.js`, `boxstufen.js`, `waschbild.js`, `avatare.js`. Speicherstand im Browser (`localStorage`, gepackt mit lz-string).

**Die Rollen.**
1. **Dome** – Auftraggeberin und Spielerin. Zeichnet selbst (Krita/Inkscape: Pferdeköpfe, Schöpfe, Fell, Mitarbeiter-Avatare), testet auf Handy und PC, entscheidet alles. Dome hat **zwei Claude-Konten** („Claude Team“ und „Claude Pro“), mit denen sie abwechselnd arbeitet; der Austausch zwischen den Konten läuft über `UEBERGABE.md` im Repo.
2. **Projekt-Chat / Koordinator** – das Claude-Projekt, in dem Dome Ideen **plant** (Planung, billig, Sonnet reicht, Opus nur, wenn der Thread es sagt). Hier liegen die Dateien unter `/mnt/project-files`. Der Projekt-Chat schreibt nichts ins Repo.
3. **Themen-Threads** – je Thema ein eigener Thread im Projekt. Dort werden Fragen gestellt, Domes Antworten festgehalten und am Ende ein eigenständiger Coding-Auftrag geschrieben. **Ein Thread pro Thema; Dome schließt ihn, wenn der Auftrag raus ist.**
4. **Coding-Sitzung** – separate Claude-Code-Sitzungen mit dem Repo. Sie **sehen `/mnt/project-files` nicht**. Darum müssen Aufträge **immer eigenständig** sein (keine Verweise auf Projektdateien; alles Nötige steht im Auftrag selbst). Fertige Aufträge liegen als Kopie in `themen/coding-kopie/`, damit Dome sie weitergeben kann. Coding speichert den Auftrag dann als `PLAN-….md` im Repo, baut Etappe für Etappe, zählt die Version hoch, lädt auf `main`, pflegt `UEBERGABE.md`, `CLAUDE.md`, `OFFENE-FRAGEN.md`.

Die Coding-Sitzung kann auch Rückmeldungen liefern (zum Beispiel Abgleich-Antworten), die Dome in den Projekt-Chat zurückbringt.

---

## 2. Wie wir arbeiten

### 2.1 Arbeitsweise im Thread (Domes Regeln)
1. **Nummerierte Fragen direkt im Thread.** Ein Block je Frage, zwischen den Blöcken Leerzeilen. Dome antwortet per Nummer („1. ja, 2. nein, lieber …“).
2. **Der Vorschlag steht fett.** Unterpunkte mit **a) b) c)**, nicht als verschachtelte Zahlen (kein „2.1.3“).
3. **Alles Denkbare bedenken, lieber einmal zu viel fragen** (Dome, 19.10.2026: jedes Thema genau durchgehen).
4. **Entscheidungen mit Datum festhalten** (Domes Antworten werden im Thread protokolliert und in den Auftrag übernommen).
5. **Bei Unklarem, Unrealistischem oder Widersprüchlichem erst nachfragen** („Mir ist xy aufgefallen …“), nie eigenmächtig entscheiden. Überschneidungen (derselbe Wert an zwei Stellen) ansprechen. Selbst gesetzte Zahlen nennen.
6. **Auffälliges immer sagen** (Dome, 19.10.2026): Lücken, vergessene Zusammenhänge, Folgefehler am Ende der Antwort ausdrücklich nennen, auch ohne Nachfrage. Dome vergisst auch mal etwas.
7. **Dome sagt Dinge oft knapp.** Zahlen und Namen aus dem echten Leben prüfen. Recherche im Netz machen, wenn Dome es will.
8. **Dome korrigiert Code-Annahmen.** Darum den **Ist-Stand immer im Repo lesen** (nicht aus dem Gedächtnis oder aus alten Projektdateien annehmen). Coding-Aufträge enthalten deshalb einen Abschnitt „Ist-Stand“ mit Versionsnummer.
9. **Immer wie in echt:** Behandlungen, Abläufe, Preise, Gehälter, Futterwerte sollen der echten Pferdehaltung entsprechen. Körperliche Werte haben eine vererbte Obergrenze (Rasse, Eltern).
10. Sprache: immer **Deutsch**, freundlich und knapp. Briefe im Spiel nutzen „Sie“ (Duzen später im Spiel möglich), Hinweise und Tutorial nutzen „Du“.

### 2.2 Feste Spielregeln (STANDING RULES)
1. **STANDING RULE: Jede Änderung wird in Tutorial und Hinweisblasen mitgeplant.** Jede neue Funktion bekommt gleich (a) einen Hinweisblasen-Eintrag, (b) einen Eintrag in der Stufen-Tabelle (ab welcher Erfahrungsstufe sichtbar), (c) ein Tutorial-Stück, (d) einen Enzyklopädie-Eintrag (Zahlen im Adminbereich „Berechnungen zum Nachschlagen“). Jeder Auftrag hat dafür eine eigene Schlussetappe.
2. **Neue Rassen bringen ihre Krankheiten, Veranlagungen und Eigenheiten mit** (Entscheidung 05.10.2026), dazu Hufqualität, Körperbau (Gewicht) und Futtertyp. In der Admin-Rassenansicht nur Varianten wählbar, die es bei der Rasse in echt gibt.
3. **Menüpfade ausgeschrieben** mit Bindestrich, z. B. „Hauptmenü - Stall - Box - Pferdepflege - Ort“. Kürzel siehe 2.5.
4. **Spieltempo: 4, 7 oder 10 Tage pro Jahreszeit, Standard 7.** (Ältere Dateien nennen 3/4/5, das ist überholt.) Neue Regeln müssen bei allen drei Tempi funktionieren; Zeitwerte in Tagen oder über `tpj()` rechnen.
5. **Erfahrungsstufen: Anfänger / Fortgeschritten / Experte** (`spiel.spieler.stufe` = `anf` / `fort` / `exp`, Prüfung `frei(funktion)`, Tabelle `STUFEN`). Pro Spielstand, jederzeit hoch und herunter. Gesperrtes wird versteckt (keine Kachel, keine Briefe, keine Blase). Nichts geht beim Herunterstellen verloren.
6. Spielmechanik nur ändern, wenn Dome es verlangt hat; vorschlagen und fragen. **Ältere, gut funktionierende Sachen nie ungefragt ändern** (25.10.2026).
7. **Versteckte Genetik und versteckte Werte** (Farbgene, Erbkrankheiten, Veranlagungen, Hufqualität, Ansehen) nie in Akte oder Abstammungsschein zeigen; nur über Labortests oder im Adminmodus. Der Tierarzt weiß nichts Verstecktes (Verdacht bei erblichen Ursachen erst ab dem 2. Mal).
8. **Jede Änderung testen.** Screenshots in drei Ansichten (1366×768, 844×390, 390×844) nur bei Änderungen am Aussehen/Layout; Logik per Playwright-Skript. Große Tests (Hof-Gesamttest, Neuladen-Test, Etappen-Test, Tutorial-Spieler) sparsam und nur nach Rückfrage, mit Bilder-Schalter `BILDER=aus|fehler|alle`.
9. Kamera-Aussparung (safe-area) beachten; Anzeige- und Interaktionsboxen dürfen sich nicht überdecken; nach Aktionen nicht aus der Ansicht werfen („Rücksprung“).
10. Beide Pferdeanhänger (Box und Hauptmenü) immer gleich halten.
11. Speicherstände abwärtskompatibel (fehlende Felder mit Standardwerten füllen).
12. Enzyklopädie immer aktuell; Reiter „Vererbung“ und „Berechnungen zum Nachschlagen“ nur im Adminmodus.
13. Version bei **jeder** Auslieferung hochzählen (`SPIEL_VERSION` in index.html, `?v=` an 6 Stellen, `version.json`). Direkt auf `main`, kein Branch, kein Pull Request. `UEBERGABE.md` bei jeder Auslieferung mitpflegen.
14. Vor jeder Aufgabe Aufwand einschätzen (klein/mittel/groß). Coding baut höchstens eine Etappe, dann Test-Anleitung (mit ausgeschriebenen Wegen) und warten; Ausnahme nur, wenn Dome sie ausdrücklich erteilt.
15. Blender-Projekt (3D-Eimer, Heunetz, Heuhaufen, Krippen) läuft **nur zwischen Dome und Coding**, ist kein Thema für den Projekt-Chat.
16. Emojis nur, wenn sie auch auf älteren Handys gehen; sonst kleine SVG-Zeichnung. Neue Bilder zeichnet Dome selbst; bis dahin Emoji-Platzhalter.

### 2.3 Dateistruktur und Ablageorte

**Im Projekt (`/mnt/project-files`):**
| Pfad | Inhalt |
|---|---|
| `CLAUDE.md` | **veraltet** (Stand v160). Gilt nicht mehr; maßgeblich ist `CLAUDE.md` im Repo (Stand v852). |
| `Kuerzel.md` | Domes Kürzel für Wege im Spiel (siehe 2.5) |
| `themen/reihenfolge.md` | **Hauptliste aller Themen** (offen, später, gebaut), aufgeräumt 26.10.2026 |
| `themen/archiv/` | alte Frage-Protokolle (`reihenfolge-protokolle-alt.md`) und alte Liste vor dem Aufräumen (`reihenfolge-vor-aufraeumen-2026-10-26.md`) |
| `themen/coding-kopie/` | **fertige, eigenständige Coding-Aufträge** (Kopien zum Weitergeben), siehe Abschnitt 3.3 |
| `themen/*.md` | Arbeitsstände und Entwürfe der Threads (Fragen, Notizen, Zusammenfassungen) |
| `themen/schleifen-bilder/`, `themen/waschplatz-bilder/`, `themen/symbole/` | Bilder zu Schleifen, Waschplatz/Solarium, Raritäts- und Zuchtbuch-Symbole |
| `werte/*.md` | frühe Planungen (Oktober 5.–6.): Werte-System, Krankheiten, Mitarbeiter, Fütterung, Hof-Ausbau, Turniere, jeweils mit Coding-Zusammenfassung |
| `repo/PROJEKT-CHAT.md` | Kopie der Planungs-Übersicht fürs Repo (Stand 18.10.2026, v425, **veraltet**) |
| `uploads/` | Anhänge ohne lesbare Namen (nicht ausgewertet) |

**Im Repo (`domegurke-dotcom/domes-design-test`):**
| Datei | Inhalt |
|---|---|
| `CLAUDE.md` | Hauptnotizen für Coding (276 KB!): Regeln, Spielsysteme, Tests, Versionierung. Nur gezielt lesen (Kopf, „Feste Regeln“, „Pläne“, „Testen“, dann per Suche). |
| `UEBERGABE.md` | Austausch zwischen den Konten Claude Team und Claude Pro (Regeln stehen oben in der Datei; Nachricht lesen, übernehmen, löschen) |
| `PROJEKT-CHAT.md` | Planungsprozess + Grundregeln (Stand v425, Prozess-Teil weiter gültig, Themenliste veraltet) |
| `PROJEKT-CHAT-THEMEN.md` | große Themen, die Coding nicht eigenmächtig umsetzt (Punkte 1–27 + Rassetypen) |
| `OFFENE-FRAGEN.md` | Fragen, die Coding in Domes Abwesenheit mit der empfohlenen Lösung entschieden hat; mit Dome durchgehen |
| `PLAN-*.md` | umgesetzte und geplante Pläne (z. B. `PLAN-WERTE`, `PLAN-HOF`, `PLAN-BILANZ`, `PLAN-WASCHPLATZ`, `PLAN-MERKMALE`, `PLAN-REITER`, `PLAN-SCHLEIFEN`, `PLAN-TIERHALTEVERBOT-SPEICHER`, `PLAN-HOFPLAN`, `PLAN-OFFENSTALL`, `PLAN-BOXANSICHT`, `PLAN-WEIHNACHTEN`, `PLAN-TUTORIAL-UMBAU`) |
| `BEI-INKSCAPE-BEARBEITEN.md` | Zeichenliste für Dome |
| `tests/` | Playwright-Tests, Anleitung `tests/README.md` |
| `blender/`, `zeichnungen/`, `werkzeuge/` | Blender-Projekt, Domes SVG-Zeichnungen, Hilfsskripte |

Hinweis: `PLAN-MITARBEITER.md` und `PLAN-AQUA.md` gibt es **noch nicht** im Repo (die Aufträge 12 und 13 sind noch nicht umgesetzt; Coding legt sie beim Start an).

### 2.4 Ablauf Thema -> Fragen -> Auftrag -> Coding -> Abnahme
1. **Thema** kommt in `reihenfolge.md` (Nummer, Status, Größe, Abhängigkeit). Reihenfolge der offenen Themen: klein vor groß, „Echte Preise“ ganz zuletzt.
2. **Fragen:** Neuer Thread für das Thema. Erst Ist-Stand im Repo lesen (oder Coding per Abgleich-Auftrag fragen lassen, so geschehen in `14-themenliste-abgleich.md`). Dann nummerierte Fragen in Runden, Domes Antworten mit Datum festhalten.
3. **Auftrag:** Am Ende ein **kopierfertiger, eigenständiger Auftrag** (Etappen mit Größe, Ist-Stand, Entscheidungen, Zahlen als Startwerte, Hinweisblasen/Tutorial/Stufen/Enzyklopädie/Tests als Schlussetappe, Beginn: „Zuerst als PLAN-….md speichern und Dome bestätigen“). Kopie in `themen/coding-kopie/`. Thread schließen, Status in `reihenfolge.md` auf „Auftrag bereit“.
4. **Coding:** Dome gibt den Auftrag in die Coding-Sitzung. **Alle Umbauten warten auf Domes ausdrückliches OK an Coding** (Dome 26.10.). Coding baut Etappe für Etappe.
5. **Abnahme:** Dome testet auf Handy und PC. Gebaut heißt noch nicht abgenommen; „Abnahme offen“ steht in der Liste (Abschnitt 3.2). Rückmeldungen und Fehler gehen zurück in einen Thread oder direkt an Coding.

### 2.5 Kürzel von Dome
**hm** Hauptmenü · **start** Startmenü · **Menü** = ☰ oben rechts · **Brief-Popup** = Brief über den gelben Umschlag · **Stall** = hm - Stall · **Box** = hm - Stall - Box · **stb** Steckbrief (Daten, Genetik, afs Aufschlüsselung, gw Gangwerk, Charakter, asb Ausbildung; der *Ausbildungsstall* wird immer ausgeschrieben; seit der Merkmale-Karte gibt es zusätzlich **Merkmale/mkm**) · **ppf** Pferdepflege (vsg Versorgung, asr Ausrüstung, Ort, Test nur Admin) · **pah** = beide Pferdeanhänger · **pmk** Pferdemarkt · **hvw** Hofverwaltung (Hof, Finanzen, Außer Haus, **mab** Mitarbeiter, Post, **esg** Einstellungen) · **enz** Enzyklopädie (Rassen, **ras** Rassenansicht, **vrb** Vererbung, **bzn** Berechnungen zum Nachschlagen) · **gdh** Gnadenhof · **pfh** Pferdefriedhof · **Rücksprung** = nach Abschluss/Abbruch zurück in die Ansicht, in der die Aktion gestartet wurde. Unterbereiche schreibt Dome aus („pmk - Pferdehändler“).

---

## 3. Aktueller Stand

### 3.1 Code-Version
**v852** (`SPIEL_VERSION = "852"`, `version.json` 852; letzter Commit 26.10.2026: „Diagnose fürs Putzen, nur Protokoll“). Neue Spiele starten mit Stufen-Sperre (Standard Anfänger).

### 3.2 Was gebaut ist (mit Abnahme-Status, nach `reihenfolge.md`)
„Abnahme offen“ = laut Liste steht Domes Abnahme noch aus. „–“ = die Liste macht keine Angabe (Abnahme-Status unklar).

| Nr. | Thema | Version | Abnahme |
|---|---|---|---|
| G1 | Spielstand als Datei, 2 Plätze, Autospeicher, Spielprotokoll | v519–v525 | offen |
| G2 | Speicher aufräumen (Post-Grenze, Anzeige, Aufräumen) | v599, v604 | offen |
| G3 | Tierhalteverbot, Veterinäramt, Erlösen | v600–v603 | offen |
| G4 | Dispo, Chronik, Jahresbericht, Spiel-verloren-Bilanz, Bild | v547–v560 | offen (Teile) |
| G5 | Raritäten-Markt | v556–v562 | offen (R2–R4) |
| G6 | Waschplatz mit Wirkung + Pferdesolarium | v563–v567 | offen |
| G7 | Hinweisblasen, Spielumfang je Stufe, Tutorials | v568–v572 | offen |
| G8 | Karte Merkmale | v587–v598 | – |
| G9 | Reiter-Können | v585–v593 | – |
| G10 | Turnierschleifen und Pinnwand | v584–v592 | – |
| G11 | Hofplan als Raster | v752–v796 | offen |
| G12 | Aufzucht-Offenstall mit Ausbau | v827 | – |
| G13 | Weihnachtsgeld für Mitarbeiter | v826 | – |
| G14 | Veredler-Rassen | v316 | erledigt (Dome, 18.10.2026) |
| G15 | Paddock und Sandpaddock | H6 | – |
| G16 | Boxansicht ohne Scrollen (PC, mobil, Tutorial) | v815–v834 | – |
| G17 | Whiteboard | v679–v817 | – |
| G18 | Finanzen-Diagramm (mit Linie Kontostand) | v634, v851 | – |
| G19 | Aufnahmen und „Fehler melden“ | – | – |
| G20 | Update-Fenster „Neu in deinem Spiel“ | v677 | – |
| G21 | Zucht-Ablauf | v535–v546 | – |
| G22 | Anbau / Teil-Umbau | v682 | – |
| G23 | Pension-Ausbau | v680–v814 | – |
| G24 | Neue Köpfe und Scheckmuster | v424–v441 | – |

Außerdem vor der Liste gebaut (laut Repo-`CLAUDE.md`): Werte-System, Krankheiten/Mitarbeiter/Azubi, Fütterung, Hof-Ausbau H1–H8 (Domes Abnahme 18.10.2026 erledigt), weitere Rassen (Appaloosa, Knabstrupper, Paint Horse ab v442; Noriker, Lewitzer, Barock Pinto ab v445).

### 3.3 Aufträge fertig, warten auf Domes OK an Coding
Alle in `/mnt/project-files/themen/coding-kopie/`. Coding hat 12 und 13 gelesen; Baustart erst nach Domes OK.
| Nr. | Thema | Datei | Etappen |
|---|---|---|---|
| 1 | Mitarbeiter | `themen/coding-kopie/12-mitarbeiter-auftrag.md` | S1–S9 |
| 2 | Aqua-Center | `themen/coding-kopie/13-aqua-center-auftrag.md` | A1–A5, kommt nach Nr. 1 |

Außerdem existiert `themen/coding-kopie/14-themenliste-abgleich.md`: ein Nur-Lese-Auftrag an Coding (Themenliste mit Repo vergleichen, nichts ändern). Codings Antwort vom 26.10. ist in `reihenfolge.md` eingearbeitet; Inhalt der Antwort selbst liegt nicht im Projekt (unklar).

Die übrigen Dateien in `coding-kopie/` (`1-waschplatz`, `2`–`5` Hinweise/Tutorial/Stufen, `6`–`9` Merkmale, `10`–`11` Reiter, `komplett-themen-6-und-9`, `schleifen-auftrag`, `tierhalteverbot-speicher-auftrag`) sind **bereits umgesetzte** Aufträge (Archiv/Vorlage für den Aufbau eines Auftrags).

### 3.4 In Planung / geplant ohne Auftrag
1. **Weihnachten A–C** (Nr. 3): Plan steht in Repo `PLAN-WEIHNACHTEN.md`; Coding hat Etappen und Zahlen vorgeschlagen; wartet auf Domes OK. Weihnachtsgeld D ist gebaut (v826).
2. **Tutorial-Umbau** (Nr. 4): `PLAN-TUTORIAL-UMBAU.md`, nichts gebaut. Offen: erst Pilot (Kapitel 1+2) oder alles; T-D und T-E gleich mit?
3. **Folgen von nicht ausgespültem Shampoo** (Nr. 6) und **Pflicht-Quarantäne/-Tests nach Ausbruch** (Nr. 7): entschieden, warten nur auf Domes OK (Details Abschnitt 5).
4. Alle übrigen offenen Themen (Nr. 8–16) sind noch nicht besprochen oder nur Ideen.

---

## 4. Vollständige Themenliste

Status-Wörter: **gebaut** · **Auftrag bereit** · **geplant** (Plan steht, noch kein Auftrag) · **offen** (nicht besprochen) · **später** (erst, wenn Dome es sagt). Größe: klein / mittel / groß / sehr groß. „(Opus)“ = laut Liste ist Opus als Modell vorgesehen.

### 4.1 Offene Themen
| Nr. | Thema | Status | Größe | Hängt an | Auftrag / Plan |
|---|---|---|---|---|---|
| 1 | Mitarbeiter: Stärken, Berufe, Lerntempo, Whiteboard-Passung, Lehrgänge, Azubi, Probezeit/Urlaub, Kalender | Auftrag bereit (26.10.), S2 entschieden | groß | – | `coding-kopie/12-mitarbeiter-auftrag.md` (S1–S9) |
| 2 | Aqua-Center: Schwimmteich, Schwimmhalle, Wasserlaufband, Reha, Pferdephysiotherapeut | Auftrag bereit (26.10.), kommt nach Nr. 1 | groß | Nr. 1 (Beruf Physiotherapeut), nur Stufe Experte | `coding-kopie/13-aqua-center-auftrag.md` (A1–A5) |
| 3 | Weihnachten Teil A–C: Einsteller-Geschenke, Stall des Jahres, Sponsor | geplant, wartet auf Domes OK | klein | – | Repo `PLAN-WEIHNACHTEN.md` |
| 4 | Tutorial-Umbau: Texte kürzen, erst tippen dann erklären, Hofplan erklären | geplant, nichts gebaut (rund 107 Schritt-Texte über 200 Zeichen) | mittel | – | Repo `PLAN-TUTORIAL-UMBAU.md` (T-A bis T-F) |
| 5 | ~~Box- und Spielansicht~~ | erledigt (Spielansicht aufräumen fertig, Boxansicht gebaut = G16) | – | – | – |
| 6 | Folgen von nicht ausgespültem Shampoo | entschieden, wartet auf OK | klein | Waschplatz (gebaut) | Repo `PROJEKT-CHAT-THEMEN.md` Punkt 24 |
| 7 | Pflicht-Quarantäne/-Tests nach Ausbruch durch das Veterinäramt | entschieden, wartet auf OK | klein | Tierhalteverbot (gebaut) | – |
| 8 | Gruppen-Übung im Aufzucht-Offenstall (Fohlen-ABC mit der Gruppe) | offen | klein | Offenstall (v827) | `PROJEKT-CHAT-THEMEN.md` Punkt 27 |
| 9 | Spieltempo 4/7/10 abstimmen (Krankheit, Heilzeit, Pension) | offen | mittel | – | Repo `OFFENE-FRAGEN.md`, Nachtrag 23.10. |
| 10 | Pferdefriedhof als Gebäude (genehmigter Tierfriedhof, Grabpflege) | offen, nur Idee | mittel | Hofplan (gebaut) | `PROJEKT-CHAT-THEMEN.md` Punkt 26 |
| 11 | Ausbildungsskala für andere Disziplinen (Recherche) | offen | mittel | – | – |
| 12 | Deckhengst ausbauen: Anfragen je Qualität, Termine, Hengst am Decktag weg | offen (Grundstock v312) | mittel | – | – |
| 13 | Ausrüstung (Decken, Schabracken, Sattel) + Sachpreise bei kleinen Turnieren | offen | groß | – | – |
| 14 | Zwei Fohlen in einer Box / Zwillinge (Opus) | offen | groß | – | – |
| 15 | Ausbildungs- und Aufzuchtställe außer Haus: je Disziplin günstig/moderat/teuer (Opus) | offen | groß | Reiter-Können (Platzhalter 65/80/92) | – |
| 16 | Rassetypen innerhalb einer Rasse + Rote-Liste-Rassen (inkl. Araber-Zuchtrichtungen) | offen | groß | Regel: neue Rasse komplett mit Krankheiten/Veranlagungen | – |

### 4.2 Später (erst, wenn Dome es sagt)
| Nr. | Thema | Größe | Hängt an |
|---|---|---|---|
| 17 | Hausturnier-Varianten: Western, Distanz, Gangpferde | mittel | – |
| 18 | Externe Fachleute: Osteopath, Physio, Pferdezahnarzt, Sattler (heute nur Kachel Osteopath ohne Wirkung) | mittel/groß | Nr. 13 (Sattler), Nr. 2 (Physio-Beruf) |
| 19 | Körung, Stutenschau, Hengstleistungsprüfung | groß | Zuchtbuch-Klasse aus Merkmale (gebaut) |
| 20 | Rücken, Fesselung, Stellung, Huf im Pferdebild sichtbar | mittel | Domes neuer Körper in Inkscape |
| 21 | Ponys: Kinder-/Jugendreiter, Gewichtsgrenze, Fahren | mittel | Reiter-Können (gebaut), Nr. 24 |
| 22 | Reiter-Ligen Amateur und Profi | mittel | Reiter-Können/LK, Nr. 24 |
| 23 | Vererbung von Abzeichen und Kopfgröße (Kopfform gebaut v424) | mittel | – |
| 24 | Disziplinen-Überarbeitung: Pony- und Kinderklassen, Amateur-/Profi-Ligen bei Disziplinen und LK-Stufen (`DISZ`, `REITER_DISZ`, `LK_STUFEN`) | groß | Reiter-Können (gebaut) |
| 25 | Echte Preise im ganzen Spiel + Balance Tierschutz-Strategie (Opus, ganz zuletzt) | sehr groß | alles andere |

### 4.3 Gebaut
Siehe Tabelle in 3.2 (G1–G24).

### 4.4 Alte Nummern -> neue Nummern (für ältere Dateien)
Alt 1, 1b, 1c = G1, G2, G3 · 2 = G4 · 3 = G5 · 4 = G6 · 5, 5b, 5c = G7 · 6 = G8 · 7 = 5 (erledigt, G16) · 8 = 11 · 9 = G9 (Reiter-Können) · 10 = 1 (Mitarbeiter) · 10b = 2 (Aqua) · 11 = 12 · 12 (+ „Thema 20“ Decken) = 13 · 13 = 14 · 14 = 15 (Ausbildungsstall außer Haus) · 15 = 16 · 16 = 25 · 17 = 21 · 18 = 17 · 19 = 18. Die Aufträge 12 und 13 nennen noch die alten Nummern (Hinweis steht am Anfang beider Dateien).

---

## 5. Wichtige getroffene Entscheidungen je Thema

(Kurz, nur nicht Offensichtliches. Alles „Dome, Datum“ stammt aus den Quellen; Zahlen sind meist Startwerte zum Feinjustieren.)

### 5.1 Mitarbeiter (Nr. 1, Auftrag 12, Dome 26.10.2026)
1. Bereich „Stallklima“ heißt jetzt **„Stallhygiene“** (Schlüssel `klima` bleibt im Code). Achter Bereich **„Umgang mit Einstellern“** nur für Pferdewirt Haltung und Service sowie Stallmeister.
2. Stufen-Wörter nach Wert (0–19 Anfänger, 20–39 Grundkenntnisse, 40–59 erfahren, 60–79 sehr erfahren, 80–100 Experte). **Zahlen bleiben sichtbar** (nicht ersetzen), das Wort kommt dazu.
3. **Stärken** = 1–2 höchste Bereiche, golden mit Stern; **bei Gleichstand kein Stern** („noch keine Stärke …“). **Bewerbungen bleiben offen** (nichts wird verschwiegen).
4. Beruf „Pferdewirt Zucht und Haltung“ wird zu **„Pferdewirt Pferdezucht“**. Berufstabelle mit Berufsbereichen, Startwerten und Diensten (S2); Startwerte gelten nur für neue Bewerber.
5. **Pferdepfleger äppelt nicht mehr ab** und macht keine „leichte Arbeit“ mehr; die machen beide Pferdewirte. **S2 gilt wie geschrieben**, auch wenn kleine Ställe dann keine leichte Arbeit durch Mitarbeiter bekommen.
6. **Grenzen:** Berufsbereiche bis 100, übrige Bereiche bei 50 (mit Lehrgang 75), Stallmeister überall bis 75, Spieler unbegrenzt. Wer schon darüber liegt, behält den Wert.
7. **Lerntempo gleich in allen Spieltempi** (je Jahreszeit statt je Tag rechnen). Ziel: Fachkraft „erfahren“ nach ca. 1 Jahr, „sehr erfahren“ nach 3–4 Jahren, Experte nach 8–10 Jahren.
8. **Vorteile je Bereich** ab 60/80 (z. B. Kolik −10 %/−20 %); gilt nur für die Pferde der eigenen Boxen; Stallmeister im ganzen Stallgebäude mit halber Stärke; derselbe Bereich von zwei Leuten wird nicht addiert, es zählt der bessere.
9. **Whiteboard-Passung:** grün = passt (Bereich ab 40 oder passende Eigenschaft), gelb = wenig Erfahrung (unter 20), jeweils mit Schlagwort; nur Hinweis, Zuteilung bleibt frei.
10. **Lehrgänge** (ab Fortgeschritten): 150 €, 2 Tage weg, +10, höchstens 1 je Jahreszeit; feste Termine für die nächste Jahreszeit, 10 % Absage durch den Veranstalter.
11. **Azubi:** Einstellen nur im Herbst (Bewerbungen im Sommer, nur mit freiem Ausbilder); Ausbilder wählbar; Spieler kann Ausbilder sein; drei Einsätze (Stalldienst, Putz-Einsatz, Mitlaufen); Dienstwechsel erst ab nächstem Morgen; Berufsschule im Winter; Urlaub nur im Sommer. „Azubi nur im Herbst“ erfordert Anpassung von Anfänger-Tutorial und Tutorial-Tests (Dome: ok).
12. **Probezeit** (nicht Azubis): 2 Jahreszeiten, kein Urlaub, Gehalt 75 % nur in der 1. Jahreszeit, dort 1 Box weniger, Kündigung fristlos. **Urlaub:** ca. 10 % des Jahres als ein Block (Tempo 4/7/10: 2/3/4 Tage); Sammelbrief „Urlaubsplanung“; Verschieben in die nächste Jahreszeit ärgert weniger (−1) als Ablehnen (−5), verschobener Wunsch hat Vorrang; **Azubi-Urlaub nicht verschiebbar/ablehnbar**.
13. **Kalender** (Hofverwaltung, Wandkalender mit Kacheln): Tempo 4 = 4 Kacheln, 7 = 7, 10 = 2×5; bis zu 3 Jahreszeiten voraus; zeigt nur gemeldete Turniere; Datenmodell erweiterbar halten.
14. Lehrgänge und Mitlaufen des Azubis gibt es ab Fortgeschritten; Stärken, Balken, Whiteboard-Zeichen, Kalender für alle Stufen. Im Tutorial: Testpferd mit leichtem Husten, Bewerber mit Stärke Stallhygiene einstellen.

### 5.2 Aqua-Center (Nr. 2, Auftrag 13, Dome 26.10.2026)
1. Gebäude `aqua`, **drei Stufen**: Schwimmteich / Schwimmhalle / Halle mit Wasserlaufband; 15.000 / 60.000 / 150.000 €; Plätze 1 / 2 / 4; nur einmal je Hof; **nicht im Pferdeanhänger**, nur an der Box plus Mehrfachauswahl im Hauptmenü.
2. **Nur Stufe Experte** (Anfänger und Fortgeschritten: nicht baubar, Physiotherapeut nicht anstellbar, Tierarzt erwähnt Aqua nie). Schubtage und „So verläuft es“ gelten schon ab Fortgeschritten; Höchstenergie-Änderung und Pausennächte für alle Stufen.
3. Programme: Schwimmen (gesperrt bei Rücken-/Hinterhandproblemen), Reha, Aufbau, Kondition; pro Pferd einmal am Tag; Mindestalter 3 Jahre; Teich im Winter gesperrt, Blaualgen (10 % je Jahr, 3 Tage); nass werden und abtrocknen wie am Waschplatz.
4. **Neuer Beruf Pferdephysiotherapeut** (480 € je Jahreszeit, nur mit Aqua-Center anstellbar); Therapeuten höchstens so viele wie Plätze; Helfer mit Häkchen „Hilft beim Aqua“.
5. **Änderungen am Grundspiel** (dürfen früh einzeln ausgeliefert werden): (a) **Höchstenergie** hängt zusätzlich an Ausdauer (Faktor 0,85–1,15) und Alter, Leiste bis 115; Arbeitsstufe relativ zur Höchstenergie; Turnier im Arbeitsschnitt nach Klasse. (b) **Überlastung** = „schwer“ an 3 Nächten hintereinander. (c) **Chronische Befunde mild:** Grad 1 kein Dauerabzug, Grad 2 halber, dafür **Schubtage** (Sprechblase „geht heute steif“, Training nicht gesperrt, Wirkung ×0,85/×0,7/×0,6, Aufwärmen hebt den Malus auf). (d) **Pausennächte:** Pferd auf Turnier, im Anhänger oder im fremden Ausbildungsstall → Befund bleibt gleich, kein „Behandlung vergessen“ (Klinik behandelt selbst).
6. Aqua-Lehrgang „Wasserarbeit“: Falls Lehrgänge (Mitarbeiter S5) noch nicht gebaut sind, gilt als Ersatz Bereich Rücken mindestens 60.
7. Nur Emoji-Platzhalter (🏊🐴🌊), keine eigenen Bilder.

### 5.3 Tierhalteverbot und Speicher (G2/G3, Thread 20.10.2026, alles gebaut v599–v605, Abnahme offen)
1. Neuer Absender **Veterinäramt** (Amtstierarzt, „Sie“); Tierschutzverein bleibt für Abholung/Klinik/Rückkauf.
2. **Vorfälle** zählen je Person (alle Höfe), alles am selben Spieltag = **ein** Vorfall. Stufen: 1. Verwarnung + 2.000 €, 2. Vorfall 5.000 € + Auflagen, dann „Letzte Warnung“, **3. Vorfall = Tierhalteverbot = Spiel verloren; Anfänger erst beim 4.** Verjährung 2 Spieljahre.
3. **Kein Vorfall:** Pferd in Behandlung, altersbedingt nahe am Höchstwert, chronisch krank in Behandlung, Klinik/Aufzucht/Ausbildung, Neukauf in den ersten 7 Spieltagen, Tod trotz Behandlung. Mitarbeiter-Fehler zählen für den Halter.
4. **Kontrollen:** nach Vorfall zufällig in den nächsten 2 Jahreszeiten; nach Meldung (Einsteller, Tierarzt, Hufschmied, **anonym** 5 % je Mangel, max. 25 % am Tag) binnen 7 Spieltagen; tagsüber nach der Morgenrunde (Morgenmist zählt nicht, Mist erst ab Stufe 3); Auflagenfrist mindestens 7 Spieltage egal bei welchem Tempo.
5. Klinik für Beschlagnahmte: nur so gesund, wie Alter und Krankheiten erlauben; Rückkauf schon **nach 1 Jahreszeit**; stirbt es dort, kommt es auf **deinen** Pferdefriedhof.
6. **„Vom Tierarzt erlösen lassen“** (250 €), nur bei „keine Heilung mehr möglich“ oder altersschwach unter 20 %; kein Vorfall; Pensionspferd nur mit Zustimmung des Besitzers.
7. **Post:** Sternbriefe, Jahresberichte, offene Rechnungen/Aktionen und ungelesene Briefe werden nie automatisch gelöscht; Grenze 300; kein Dauertext im Post-Fenster. **Speicher:** Anzeige in Hofverwaltung - Einstellungen (gelb ab 70 %, rot ab 90 %); Aufräumen **nur auf Knopfdruck**, mit Auswahl; Friedhof/Archiv „Details löschen, Grabstein bleibt“ oder „ganz löschen“, Warnung bei Vorfahren, Bestenlisten-Pferde mit Extra-Frage.
8. Von Claude ergänzt, **nicht ausdrücklich von Dome entschieden:** Pensionsansehen −3 bei Kontrolle mit Mängeln, Brief „Akte entlastet“, Erlösen bei Pensionspferd zahlt der Besitzer, Alters-Ausnahme „höchstens 10 Punkte unter dem eigenen Höchstwert“. Diese und weitere selbst gesetzte Zahlen stehen in Repo `OFFENE-FRAGEN.md` zur Durchsicht.

### 5.4 Merkmale (G8, Dome 20.10.2026)
1. Neue Karte **Merkmale** in Box - Steckbrief als Beurteilungsbogen mit Aufklapp-Bereichen (Gesamteindruck, Exterieur, Farbe & Abzeichen, Gangwerk, Interieur, Rassemerkmale, Besonderheiten). Gangwerk/Eigenschaften/Charakter sind keine eigenen Reiter mehr.
2. Zwölf **Exterieur-Werte** `p.bau` (0–100) mit **Zuchtziel je Rasse** als Raute; Abweichungsstufen ideal / leichte Abweichung / deutlicher Fehler / starker Fehler; Vererbung: Mitte der Eltern + 0,2 × Zug zum Zuchtziel + Zufall, 3 % Mutation.
3. Alle Werte fest ab Geburt außer Bemuskelung und Huf (Pflege/Futter wirken). Alte Spielstände werden einmal mit festem Seed ausgewürfelt (kein Brief).
4. **Zuchtbuch-Klasse** (nur Stuten) und Noten wie beim Zuchtverband; Körung/Stutenschau ist ein späteres Thema (Nr. 19). Zeichenaufgaben (Körper in Teilen) liegen bei Dome (Nr. 20).

### 5.5 Reiter-Können (G9, Dome 20.10.2026)
1. **Können 0–100 je Disziplin-Gruppe** (`dressur, springen, vielseitigkeit, western, rennen, distanz, gangpferde`); LK gibt es weiter nur für die ersten vier. Wachstum durch Training, Turnier, Reitunterricht, langsamer je höher; **Verlernen gibt es nicht**.
2. **Abstandsfaktor** Reiter zu Pferd (eine Klasse ≈ 20 Punkte): weiter als das Pferd → Training besser (bis ×1,2); Pferd weiter als der Reiter → bremst (bis ×0,25) und senkt Vertrauen. Turnier-Reiterfaktor ×0,80 bis ×1,08.
3. **Reitunterricht** 60 € je Stunde (auch beim festen Bereiter), ab Anfänger freigeschaltet, wirkt bis Können 60.
4. Hinweis „Dein Pferd ist besser als du“ einmal je Pferd und Disziplin; Kaufen bleibt erlaubt.
5. **Regel:** Wird eine Disziplin neu angelegt oder umgebaut (`DISZ`), `REITER_DISZ` mit anpassen. Ausbildungsstall außer Haus nutzt bis Nr. 15 die Platzhalter 65/80/92.

### 5.6 Waschplatz und Solarium (G6, Dome 19./20.10.2026)
1. Zustände „nass“ und „verschwitzt“; Abtrocknen nötig (Handtuch, Schweißmesser, Solarium); **Winter: kein Abspritzen des ganzen Pferdes**, nur Beine/Hufe mit warmem Wasser ab Stufe 2.
2. **Wasserscheu:** Gewöhnung nach 3 Wäschen (Ängstliche 5), **geht nie verloren**, Wäschen zählen insgesamt.
3. Waschplatz-Stufen 1/2/3 (300/500/800 €): 1/2/3 Plätze; Gummimatten 350 € ab Stufe 2. **Pferdesolarium ist eigenes Gebäude** (1.200/2.000/3.200 €); im Winter 2× am Tag erlaubt und ersetzt das Aufwärmen.
4. **Wasserlaufband gehört nicht in den Waschplatz**, sondern ins Aqua-Center (Nr. 2).
5. Pfleger wäscht nachts so viele Pferde wie Plätze; Einsteller buchen Waschen (6/8/10 €) und Solarium (3/4/5 €); Dome zahlt nichts für Wasser/Strom. Fohlen-ABC „Duschen üben“, Fohlenschau ±0,3 auf die Eindrucksnote.
6. **Offene Folge (Nr. 6):** nicht ausgespültes Shampoo → Wohlbefinden −1 je Nacht, Fell ohne Glanz, Ekzem/Mauke ×1,5, 3 Tage oder bis Abspülen; Pensionsbesitzer −1; Pfleger spülen immer aus. Wartet auf Domes OK.

### 5.7 Hinweise, Tutorial, Erfahrungsstufen (G7, Dome 19./20.10.2026)
1. **Hinweisblasen statt Tipp-Fenster:** blockieren nichts, höchstens 2 Sätze, Knopf „Mehr dazu“ führt in die Enzyklopädie („Einsteiger-Wissen“). **Leitfaden-Modus** für Handlungen beim ersten Mal (zählt nicht gegen das Limit); Nebentipps höchstens 1 je Ansicht und 3 je Spieltag. Nachlesen unter ☰ - Hilfe; Ein/Aus in Hofverwaltung - Einstellungen. Ton: einfache Wörter, Alltagsvergleich, keine Kindersprache, nie versteckte Werte, „wie realistisch es ist“.
2. **Anfänger-Tutorial** vor dem Immobilienmenü, in einem Testhof mit Testgeld, der danach verschwindet; ein Testpferd nach dem anderen, Überblendung, 2 Tage je Pferd, Ziel je Pferd, Überspringen jederzeit (dann bekommt man alle Blasen). Fortgeschrittenen- und Experten-Tutorial nur zum Nachholen beim Aufstieg. Aktuell 15 Anfänger-Kapitel.
3. **Stufen:** Anfänger = nur alter Pensionsstall, kein eigenes Zuchten, Labor gesperrt, Standard-Futterplan, kaum Krankheiten (Risikofaktor 0,25), Weihnachtsspende; Fortgeschritten = Makler-Höfe bis 2, alle Märkte, Zucht, Labor, Turniere bis M, Spende 2.500 €; Experte = alles, keine Spende. Krankheitsrisiko-Faktor 0,25 / 0,6 / 1.
4. **Offen im Tutorial-Umbau (Nr. 4):** Texte kürzen (Schlüsselwörter fett, Rest hinter „Mehr dazu“), erst tippen dann erklären, Hofplan-Bedienung wirklich erklären lassen. Modellvorschlag: Opus für T-D/T-E, Sonnet für Textarbeit.

### 5.8 Weitere Entscheidungen, die man kennen sollte
1. **Schleifen (G10):** echte Rosetten nach FN-Farben (1 Gold bis 6 Grün, braun für Teilnehmer, Champion blau-gold); 4 Stufen je Turnierart; Pinnwand in der Box; Schleifen ein Pferdeleben lang.
2. **Raritäten (G5):** 5 Seltenheitsstufen mit Symbolen, jährlicher Raritäten-Markt im Sommer, seltene Gene mit Nachweis.
3. **Bilanz (G4):** Dispo −2.000 €, Pfändung/Insolvenz, Spiel-verloren-Bilanz mit „Nur ansehen“.
4. **Spielstand (G1):** Datei speichern/laden, 2 Plätze, Autospeicher, gepackt.
5. **Pferdeanhänger** und alle Ziele laufen über eine Liste (`ANHAENGER`/`ANH_ZIEL`); neue Ziele nur dort eintragen.
6. **Eimer/Heunetz/Krippen (Blender):** „Eimer Stufe 1/2“ meint die Ausrüstungsstufe, nicht die Boxenstufe; Einbau erst „in einem Rutsch“ nach Domes Ansage; Krippen sind vorläufig. Regel (Dome 26.10.): **in Etappen nur bauen, was ausdrücklich genannt wurde; im Zweifel fragen.**
7. **Echte Preise (Nr. 25):** Pension, Gehälter, Beritt, Aufzucht, Futter, Tierarzt, Hofplan-Bauten, Bauland, Büro müssen gemeinsam auf echte Zahlen umgestellt werden; bis dahin nur Ausreißer angleichen. Die Tierschutz-Strategie (Stuten mit Fohlen kaufen, nach einem Jahr verkaufen) macht das Spiel zu leicht.
8. **Hinweis zu Rassen:** „Noch warten“ laut Repo: weitere Rassen wie Rote-Liste-Rassen/Rassetypen (Nr. 16), Inzucht-Auswirkungen, Vererbung der Kopfgröße (Nr. 23). Kopfform- und Abzeichen-Vererbung sind seit 18.10.2026 freigegeben (Repo `PLAN-KOEPFE.md`); die Liste führt Abzeichen-Vererbung trotzdem unter „später“ (Nr. 23), das ist **unklar/uneinheitlich**.

---

## 6. Offene Fragen und Ideen für später

**Offene Entscheidungen**
1. Reihenfolge der Bauten: Dome muss Mitarbeiter (Nr. 1) und danach Aqua (Nr. 2) per ausdrücklichem OK an Coding freigeben.
2. Weihnachten A–C: Zahlen sind Vorschläge von Claude (Einsteller-Geschenke nach Zufriedenheit, Stall des Jahres Bronze/Silber/Gold 500/1.500/3.000 €, Sponsor ab Ansehen 140), warten auf Domes Ja.
3. Tutorial-Umbau: erst Pilot (Kapitel 1+2) oder alles? T-D und T-E gleich mit?
4. Shampoo-Folgen (Nr. 6) und Pflicht-Quarantäne (Nr. 7) bauen, wenn Dome ja sagt.
5. Spieltempo-Abstimmung (Nr. 9): Studie zeigt bei Tempo 10 ca. 2,8 Befunde je Pferd und Jahr gegen ca. 1,8 bei Tempo 7, Heilung 7 statt 3,5 Tage, 2 von 6 Läufen mit Tierhalteverbot; Pensionseinnahmen ebenfalls prüfen. Noch nichts geändert.
6. Selbst gesetzte Zahlen aus dem Veterinäramt-/Speicher-Auftrag und aus der Nachtsitzung 23.10. (Repo `OFFENE-FRAGEN.md`) mit Dome durchgehen.
7. Abnahmen, die Dome noch machen muss: siehe „offen“ in 3.2 (G1–G7, G11).

**Ideen und spätere Themen**
1. **Reiter-Ligen** Amateur und Profi (Nr. 22) und **Disziplinen-Überarbeitung** (Nr. 24: Pony-/Kinderklassen, Amateur-/Profi-Ligen bei Disziplinen und LK-Stufen). Ob es dazu schon einen Plan gibt: Die Liste nennt keinen; Codings Antwort auf die Abgleich-Frage dazu liegt nicht im Projekt (**unklar**).
2. **Vererbung von Abzeichen und Kopfgröße** (Nr. 23).
3. **Ponys** (Nr. 21): Erwachsene können Ponys/Shettys in echt nicht reiten (Gewichtsgrenze ca. 20 % des Pferdegewichts); Wege: Kinder/Jugendliche als Reiter, Fahren (Kutsche) oder beides. Bis dahin starten Ponys wie alle Pferde.
4. **Ausrüstung** (Nr. 13): Decken, Schabracken, Sattel plus Sachpreise bei kleinen Turnieren; Voraussetzung auch für Sattler (Nr. 18) und „schlechter Sattel“ als Schub-Auslöser (Aqua A3).
5. **Rassetypen/Rote Liste** (Nr. 16): z. B. Knabstrupper Pony/Sport/Barock, Friese Barock/Sport, Welsh Sektionen, Haflinger alt/modern, Shetty Mini/Standard, Quarter Halter/Racing/Working, Araber-Zuchtrichtungen (Krankheitszahlen LFS ägyptische Linien ca. 10 % Träger, andere ca. 2 %), Tinker-Größen; Rote-Liste-Beispiele (GEH): Alt-Oldenburger, Leutstettener, Rottaler, Senner, Dülmener, Schleswiger Kaltblut, Schwarzwälder Fuchs u. a.
6. **Pferdefriedhof als Gebäude** (Nr. 10): in Deutschland dürfen Pferde meist nicht auf dem eigenen Grundstück vergraben werden, daher als genehmigter Tierfriedhof planen; Preise, Platz je Pferd, voller Friedhof offen.
7. **Externe Fachleute auf Termin** (Nr. 18), **Hausturnier-Varianten** (Nr. 17), **Körung/Stutenschau/HLP** (Nr. 19), **Körper in Teilen** (Nr. 20, wartet auf Dome), **Deckhengst** (Nr. 12), **Zwillinge** (Nr. 14), **Ausbildungsställe außer Haus** (Nr. 15), **Gruppen-Übung im Offenstall** (Nr. 8).
8. Aus früheren Listen „später“: Gangpferdestall und Trabrennbahn (mit Rasse Traber), Selbst reiten, Inzucht-Auswirkungen (Stand v425; ob noch aktuell: **unklar**).
9. Veraltete Kopfzeilen: `PLAN-BOXANSICHT.md` und `PLAN-OFFENSTALL.md` sagen oben noch „noch nichts gebaut“, obwohl gebaut (Hinweis an Coding aus dem Abgleich-Auftrag).

**Bekannte Unstimmigkeiten in den Quellen**
1. `/mnt/project-files/CLAUDE.md` (v160) und Repo-`PROJEKT-CHAT.md` (v425) sind veraltet.
2. Versionsangabe Hofplan: G11 nennt v752–v796 (Liste) bzw. v752–v754 (Abgleich-Auftrag und Repo). Maßgeblich ist die Liste, genauer Stand **unklar**.
3. Die Liste führt Weihnachten-Etappen als „Coding hat vorgeschlagen“, die Vorschläge selbst stehen nur im Repo-Plan.

---

## 7. Kurzer Einstiegsplan für das neue Team

**Als Erstes lesen (in dieser Reihenfolge):**
1. Dieses Dokument.
2. `/mnt/project-files/themen/reihenfolge.md` (aktuelle Themenliste).
3. Im Repo (flach klonen: `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/domegurke-dotcom/domes-design-test`): den Anfang von `UEBERGABE.md` (Regeln und aktuelle Nachricht), `CLAUDE.md` (Kopf bis „Pläne“, dann nur gezielt suchen), `PROJEKT-CHAT.md` (nur Abschnitte 1–3 zum Prozess), `PROJEKT-CHAT-THEMEN.md`, `OFFENE-FRAGEN.md`.
4. Je nach Thema den passenden Auftrag in `themen/coding-kopie/` bzw. den `PLAN-….md` im Repo.
5. `Kuerzel.md` für Domes Wege.

**Einen neuen Thread starten:**
1. Thema in `reihenfolge.md` wählen (Dome sagt, welches; sonst kleinste offene zuerst). Modell: Sonnet, Opus nur wenn Liste oder Thread es verlangt (Nr. 14, 15, 25).
2. **Ist-Stand im Repo lesen** (Version, `PLAN-*`, Code-Suche) und, falls nötig, Coding per Nur-Lese-Auftrag fragen lassen (Vorlage: `14-themenliste-abgleich.md`). Nichts aus alten Projektdateien als aktuell annehmen.
3. Mit nummerierten Fragen starten (ein Block je Frage, Leerzeilen, Vorschlag fett, Unterpunkte a) b) c)), alles Denkbare bedenken, Unstimmigkeiten sofort ansprechen, Zahlen und Namen aus dem echten Leben prüfen (Recherche, wenn Dome will).
4. Immer mitplanen: Hinweisblasen, Tutorial, Stufen-Eintrag, Enzyklopädie, Tests, bei neuen Rassen die Krankheiten/Veranlagungen, bei Pferdeeigenschaften die Vererbung, bei allen Zeiten die Tempi 4/7/10.
5. Antworten mit Datum festhalten; am Ende **eigenständigen Auftrag** schreiben (nach dem Muster in `coding-kopie/12-…` und `13-…`), Kopie nach `themen/coding-kopie/` legen, `reihenfolge.md` aktualisieren (Status „Auftrag bereit“).
6. Dome schließt den Thread. Weitergabe an Coding macht Dome; Baustart nach ihrem ausdrücklichen OK.
7. Nach Codings Rückmeldung (Abnahme, Fehler, Abgleich) Liste und Status nachführen.
