# Übergabe zwischen den Claude-Konten

Dome arbeitet abwechselnd mit zwei Claude-Konten am Spiel: **Claude Team** und **Claude Pro**.
Diese Datei ist der Austausch zwischen beiden – damit das jeweils andere Konto beim nächsten Start weiß, was passiert ist.

## Regeln für diese Datei
1. Beim Start einer Sitzung diese Datei lesen.
2. Steht unten als Absender **das andere Konto**: Infos lesen und übernehmen (CLAUDE.md, Pläne und Code sind schon aktuell – die Datei erklärt nur, was neu ist). Danach den Abschnitt „Nachricht“ **löschen**.
3. Am Ende der eigenen Sitzung (bzw. wenn Dome wechseln will) den Abschnitt „Nachricht“ neu schreiben: Absender = eigenes Konto, was gemacht wurde, was offen ist, worauf zu achten ist. Hochladen auf `main`.
4. Steht als Absender **das eigene Konto**, hat das andere Konto noch nicht gelesen – nichts löschen, nur ergänzen.
5. Weißt du nicht, welches Konto du bist: Dome kurz fragen.
6. Bilder (z. B. Entwürfe, Screenshots) dürfen für die Übergabe in den Projektordner, wenn sie wichtig sind – sobald sie nicht mehr gebraucht werden, wieder löschen (Dome, 18.10.2026). Sonst Test-Screenshots nur im Scratchpad.

---

## Nachricht

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v594, 20.10.2026 (abends)

Übergabe von Claude Team (v560–v582) gelesen und übernommen, Nachricht gelöscht. Phase A läuft (Dome: „starte Phase A“): S1 (v584), K1 (v585), K2 (v586) und M1 (v587) sind fertig, je ein eigener Commit.

### Fortschritt Mehr-Etappen-Lauf (Dome, 20.10.2026; Regeln in CLAUDE.md „Mehr-Etappen-Lauf“)
Vier Phasen (A, B, C, D = großer Test), am Phasenende hält Claude an; Dome schaltet das Modell um und sagt „weiter“.
| Phase | Modell | Etappe | Stand |
|---|---|---|---|
| A | Sonnet | S1 Schleifen, Regeln, `p.schleifen`, Brief | **fertig (v584)** |
| A | Sonnet | K1 Reiter-Können (Daten) | **fertig (v585)** |
| A | Sonnet | K2 Training und Reitunterricht | **fertig (v586)** |
| A | Sonnet | M1 Exterieur-Daten | **fertig (v587)** |
| B | Opus | S2 Pinnwand in der Box | **fertig (v588)** |
| B | Opus | K3 Turnier und Rennen | **fertig (v589)** |
| B | Opus | M2 Karte Merkmale | **fertig (v590)** |
| C | Sonnet | S3 große Pinnwand | **fertig (v591)** |
| C | Sonnet | S4 Tutorial, Hinweis, Stufen, Enzyklopädie (Schleifen) | **fertig (v592)** |
| C | Sonnet | K4 Anzeige, Stufen, Hinweise | **fertig (v593)** |
| C | Sonnet | M3 Wirkungen | **fertig (v594)** |
| C | Sonnet | M4 Rassemerkmale, Besonderheiten, Zuchtbuch | **fertig (v595)** |
| C | Sonnet | M5 Verpaaren, Fremd-Vergleich, Hinweise, Admin | **Kern fertig (v596)**; Tutorial-Kapitel (Anfänger-Satz, Fort „Merkmale lesen…“, Exp „Zuchtverbands-Noten…“) kommen mit der Tutorial-Überarbeitung; Fremd-Vergleich und Blasen M3/M7 offen (OFFENE-FRAGEN 11) |
| D | Sonnet | großer Test ohne Bilder (etappen, hof-gesamt, neuladen) + neue kleine Tests + Tutorial-Spieler – erst nach Domes „weiter“ | offen |

Phase B fertig. **Phase C läuft (Sonnet):** S3, S4, K4, M3 (v594), M4 (v595) und M5-Kern (v596) fertig, Domes Tutorial-Mängelliste ist abgearbeitet (v597, siehe CLAUDE.md), danach Domes Tutorial-Mängelliste (vor Phase D). (Phase C: S3 → S4 → K4 → M3 → M4 → M5.) (Phase B: S2 Pinnwand in der Box → K3 Turnier und Rennen → M2 Karte Merkmale; K3 und der Schleifen-Brief nie gleichzeitig.)

### Test-Anleitung Phase A (Wege ausgeschrieben)
1. **Schleifen (v584):** Turnier nennen und einen Tag weiterspielen: Hauptmenü – Pferdeanhänger – Turnier (oder Box – Pferdepflege – Ort – Pferdeanhänger – Turnier) → nennen → „Tag beenden“ → am nächsten Tag Brief „Ergebnis: <Pferd> beim <Turnier>“ im Postfach: links neben jeder Prüfungszeile die große Schleife (Platz 1 Gold … 6 Grün, braun = Teilnehmer, auf dem Hofturnier auch ohne Platzierung, Championat-Sieger blau-gold). Danach Box – Steckbrief – Ausbildung – Turniere: kleine Schleifen in der Erfolgsliste, in „Bilanz insgesamt“ die Spaltenköpfe als Schleifen. Fohlenschau: Ergebniszeile mit Schleife.
2. **Reiter-Können (v585/v586):** Hofverwaltung – Reiter: Knopf „🎓 Reitunterricht“ (Wahl der Disziplin, 60 € extern; mit festem Bereiter kostenlos, dafür trainiert er am nächsten Morgen keine Pferde; nur bis Können 60, eine Stunde je Tag und Disziplin). Im **Adminmodus** zeigt dieselbe Seite unten die Zahlen (Können je Gruppe mit Herkunft des Zuwachses). Box – Pferdepflege – Ort – Training – Reitplatz: bei Pferden, die weiter sind als du, steht ein Satz „… ist in Dressur weiter als du: das bremst“; im Trainingsbericht steht dasselbe, das Vertrauen sinkt leicht. Pferdemarkt (Privat, Händler, Tierschutz, Auktionshaus): im Infofenster eines Pferdes die Zeile „Reiter: Dieses Pferd ist weiter als du“. Anfänger-Tutorial, Kapitel „Training“: neuer Schritt „Du und dein Pferd“ am Ende.
3b. **Pinnwand (v588):** Hauptmenü – Stall – Box eines Pferdes mit Schleifen: rechts neben Fenster bzw. Tür hängt die Pinnwand (beste 9), das Pferd darf sie verdecken; Antippen zeigt alle Schleifen. Leckstein jetzt links vom Fenster (Stufe 3: rechts neben dem Heunetz), goldenes Namensschild in Stufe 3 weg. Abfohlbox: Pinnwand kleiner auf der Rückwand, Rotlichtlampe an ihrer Ecke.
3b2. **Große Pinnwand (v591):** in der Box die Pinnwand antippen: abgedunkeltes Fenster mit allen Schleifen (5 je Reihe, hochkant 4), oben „nach Jahr“ / „nach Klasse“ (Auswahl bleibt gespeichert), Schleife antippen = Blase mit Prüfung, Platz, Turnier, Jahreszeit und Jahr; ✕, Tipp daneben oder Escape schließt.
3c. **Turnier-Reiter (v589):** Box – Pferdepflege – Ort – Pferdeanhänger – Turnier: bei jeder Prüfung eine Zeile „Dein Können reicht / ist knapp / fehlt“. Als Fortgeschritten/Experte beim Nennen das Fenster „Wer reitet …?“ (du, dein Bereiter bzw. Bereiter nach Bedarf 70 €, Profi 150 €) – über deiner LK kann ein Bereiter oder Profi starten. Rennen: Jockey oder selbst (ab Können 30). Ergebnisbrief: „geritten von …“. Bei einem Pferd, das weiter ist als du, einmal ein Warnfenster beim Nennen. Ausbildungsstall: Warnung beim Anmelden, Brief bei der Rückkehr. LK steigt nur noch, wenn auch das Können reicht (LK 6 ab 15 … LK 1 ab 90).
3d. **Karte Merkmale (v590):** Box – Steckbrief – Merkmale (die Reiter Gangwerk, Eigenschaften, Charakter gibt es nicht mehr – sie sind Abschnitte darin). Oben „Vergleichen mit …“, darunter Gesamteindruck (Experte: Noten), Exterieur (Stockmaß, Kopf, Gewicht, ab Fortgeschritten 12 Balken mit Raute = Ideal der Rasse), Farbe & Abzeichen, Gangwerk, Interieur (Charakter + Eigenschaften). Geöffnete Bereiche bleiben offen. Daten zeigt Stockmaß, Kopf, Abzeichen usw. nicht mehr.
3. **Exterieur (v587):** noch unsichtbar für Spielerinnen. Adminmodus: Box – Steckbrief – Aufschlüsselung – „Größe & Exterieur“ (zwölf Werte mit Ziel, Mutter, Vater, Quelle; Bemuskelung und Huf mit „heute“-Wert) und „Mutationen“. Das Pferdebild verändert sich leicht je Rahmen, Hals, Kruppe, Fundament und Bemuskelung (höchstens ±15 %); Fohlen behalten ihre Proportionen.

Wecker nur innerhalb einer Phase. Zwischen den Phasen: „Phase X fertig – bitte umschalten“ hier eintragen und aufhören. Fragen: `OFFENE-FRAGEN.md`.

### Offen (unverändert aus der Team-Nachricht)
1. Domes Test im Spiel von v560–v582 (Tutorial als Anfänger am Handy und PC, Raritäten im Sommer, Waschplatz/Solarium, Stufen, Abstammung).
2. **v583:** Hinweisblase blendet sich beim Ziehen eines Pferdes aus (hochkant deckte sie die freien Boxen ab, Dome: „das da“). `tests/tutorial-spieler.js` Anfänger 390×844, 844×390, 1366×768 laufen durch (nicht parallel starten – sonst hängt es zufällig bei „Bürste“).
2b. **Bilder-Schalter für große Tests** (Dome, 20.10.): `BILDER=aus|fehler|alle` + `BILDER_ORDNER` für etappen-test, hof-gesamttest, neuladen-test (`tests/bilder.js`, siehe `tests/README.md`). Geprüft nur mit einem Mini-Probelauf, die großen Tests selbst sind **nicht** gelaufen (Dome: noch nicht starten, vorher fragen, welche Variante).
3. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) nur mit Domes Erlaubnis.
4. Wisch-/Ziehgefühl am echten Handy kann nur Dome prüfen.
