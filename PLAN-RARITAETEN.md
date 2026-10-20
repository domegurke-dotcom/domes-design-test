# Auftrag für die Coding-Sitzung: Raritäten-Markt und Seltenheitsstufen

**Stand:** 19.10.2026, im Projekt-Chat mit Dome geplant (Fragen 43–78), Code-Stand beim Planen v513 (jetzt v546).
**Voraussetzungen:** `PLAN-SPIELSTAND.md` (eingebaut) und `PLAN-BILANZ.md` (Dispo B1 und Zähler B2). Reihenfolge: R1 → R2 → R3 → R4. Größen: R1 mittel, R2 groß, R3 mittel, R4 klein/mittel.
Alle Zahlen als Konstanten oben im Code, in der Enzyklopädie (Adminmodus, „Berechnungen zum Nachschlagen“) eintragen.

**Fortschritt:** R1 fertig (v556, `tests/seltenheit-test.js`; Code: `seltenheit`, `seltenGen`, `seltenLeistung`, `SELTEN_SCHWELLE`; Abweichung vom Plan: 3 Leistungs-Kategorien = 3 Chancen, obere 1 % = selten) · **R2 + R3 fertig** (v561, zusammen gebaut, `tests/raritaeten-test.js`; Domes Abnahme steht aus; Abweichungen: Gegenbieter erst, wenn der Spieler mitbietet – sonst würden Raritäten zufällig verschwinden; Gebote laufen je Jahreszeit wie im Auktionshaus) · **R4 fertig** (v562, im selben Test) · **alle Etappen R1–R4 fertig**

## Ziel in einem Satz
Es gibt eine **Seltenheit** (selten, sehr selten, einzigartig, Ausnahmepferd, Jahrhundertpferd), die für **jedes Pferd** berechnet wird (Gene und Leistung), und einen neuen **Raritäten-Markt** im Pferdemarkt, auf dem einmal im Jahr je Rasse 2 sehr teure Raritäten stehen.

## Ist-Stand (v513)
1. Pferdemarkt-Bereiche in `MARKT_BEREICHE`: Privat, Händler, Auktionshaus, Fohlenauktion, Gestüte, Tierschutz. Gestüt-Pferde (`gestuetPferde`) kommen mit Tests (`h.tests = { farbe, gang, krank }`), der Testwert steckt im Preis (`testWert`).
2. Gen-Häufigkeiten je Rasse in `RASSE_GENE` (Häufigkeit des dominanten Allels; nicht genannte Gene kommen nicht vor). 28 Rassen (inzwischen mehr). Genetik wird nie ohne Labortest gezeigt.
3. `marktwert(p)` enthält Gangwerk, Ausbildung, Turniererfolge (`erfolgWert`) und Testwert, aber **keinen** Farb- oder Seltenheitsaufschlag; Charakter und Aufschlüsselung fehlen ganz.
4. Auktionen: `npcLimit` (Gegenbieter), `gebundenesGeld`; AKU steckt in jedem Kauf-/Biete-Fenster.
5. Kontinent-Knöpfe: `sortSegment(konts)` und `kontinentVon(id)` (seit v455/v462, `rasseSortieren`, `KONTINENT`) – in Enzyklopädie, Pferdemarkt und Deckanzeigen.
6. Stallplaketten am Boxschild: `plakettenVon(p)` / `plakettenSVG` (P, ★ Fohlenchampion, C/2/3).
7. Klassen im Spiel: E, A, L, M, S (`KLASSEN` in `pferd.js`); `marktErfolge(h, r)` erzeugt Turniereinträge (max. 20, Siegchance 0,35).
8. Ein Marktpferd braucht im Spielstand ca. 12 KB.

## Die Regel der Seltenheit (für alle Pferde)
Die Seltenheit eines Pferdes ist **die Wahrscheinlichkeit, dass ein zufälliges reinrassiges Pferd derselben Rasse dieses Merkmal hat**. Kleine Zahl = selten.

**Stufen (Dome, 19.10.2026):**
1. unter 5 % = **selten** (1 Stern)
2. unter 1 % = **sehr selten** (2 Sterne)
3. unter 0,1 % = **einzigartig** (blauer Diamant)
4. unter 0,01 % = **Ausnahmepferd** (2 Diamanten), Preis ×1,5
5. unter 0,001 % = **Jahrhundertpferd** (geflügelter Diamant), Preis ×2

**Zwei Arten, einzeln oder zusammen:**
1. **Gen-Rarität:** Seltenheit der Gen-Kombination. Merkmal = ein Genotyp (z. B. Splashed White mischerbig), dessen Häufigkeit in der Rasse unter `SELTEN_MERKMAL = 0,30` liegt (Hardy-Weinberg aus `RASSE_GENE`: AA = f², Aa = 2f(1−f), aa = (1−f)²; auch die **rezessive** Seite zählt, z. B. Fuchs beim Friesen mit e = 2 %). Die Wahrscheinlichkeit der Kombination ist das **Produkt** der Häufigkeiten aller seltenen Merkmale des Pferdes (damit zählen auch seltene Kombinationen wie Tobiano + Sabino). Nur farb- und musterrelevante Gene (Liste `GENE`), kein Gangpferde-Gen. `SELTEN_MERKMAL` per Test so abstimmen, dass je Rasse (außer Haflinger) etwa 3–10 % aller Pferde mindestens „selten“ sind.
2. **Leistungs-Rarität:** Rang des Pferdes unter den Pferden **seiner Rasse** (Schwellenwerte je Rasse einmal per Stichprobe berechnen, z. B. 2000 Pferde mit festem Seed, als Tabelle im Code ablegen): Top 5 % / 1 % / 0,1 % in einer der vier Kategorien:
   1. **Gangwerk**: Schnitt aus Schritt, Trab und Galopp
   2. **Aufschlüsselung**: körperliche und mentale Werte
   3. **Charakter**: viele positive Eigenschaften, wenig Schwächen
   4. **Ausbildung** (beste Disziplin, jeweils die höchste Klasse der Disziplin, bei Dressur und Springen also S): **selten** = Klasse S ausgebildet und mindestens 1 Platzierung in S; **sehr selten** = S mit mindestens 5 Siegen in S; **einzigartig** = S mit mindestens 15 Siegen in S, davon mindestens 3 auf einem Großen Reitturnier. Die Siege müssen als **echte Einträge** in der Turnierliste des Pferdes stehen (Datum, Turnier, Prüfung, Platz); sie zählen wie üblich in `erfolgWert`.
3. Hat ein Pferd Gen- **und** Leistungs-Rarität, werden die Wahrscheinlichkeiten multipliziert (Stufe meist eine höher; unter 0,01 % und 0,001 % greifen Ausnahme- und Jahrhundertpferd).
4. Der **Haflinger** hat nur Leistungs-Raritäten (alle seine Gene sind entweder häufig oder kommen nicht vor).

**Wo die Seltenheit sichtbar ist (Dome):**
1. **Hinter dem Namen** im Steckbrief und in Listen: das kleine Symbol (siehe unten).
2. **An der Box** wie beim Prämienfohlen als Stallplakette: in `plakettenVon(p)` einen Eintrag mit dem Symbol ergänzen (rund statt rechteckig; der goldene ★ des Fohlenchampions bleibt unverändert). Die Plakette wandert mit dem Pferd.
3. **ⓘ-Info** am Symbol: Stufe, warum selten (Zahlen), Wirkung und der Hinweis: „Seltenheit macht ein Pferd nur auf dem Raritäten-Markt mehr wert. Im normalen Pferdemarkt zählt sie nicht.“ Derselbe Hinweis steht als eine Zeile im Verkaufsfenster (Pferdemarkt - Pferd verkaufen) und oben im Raritäten-Markt.
4. **Versteckte Genetik bleibt versteckt:** Eine **Gen-Rarität** eines eigenen Pferdes wird erst angezeigt, wenn der Fellfarben-Test gemacht ist (Domes feste Regel). Leistungs-Raritäten sind sofort sichtbar (die Werte kennt der Spieler). Auf dem Raritäten-Markt sind die Tests immer dabei.
5. Der normale Marktwert (`marktwert`) und der normale Verkauf bleiben unverändert.

**Symbole** (SVG, 32 × 32; Farben fest, nicht ans Theme gebunden). Gemeinsamer Hintergrund aller fünf: Goldmünze = `<defs><radialGradient id="rg" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff0a8"/><stop offset=".55" stop-color="#f1c232"/><stop offset="1" stop-color="#b8821a"/></radialGradient></defs><circle cx="16" cy="16" r="14.5" fill="url(#rg)" stroke="#7a5410" stroke-width="2"/><circle cx="16" cy="16" r="11.6" fill="none" stroke="#fff6c8" stroke-width=".8" opacity=".8"/>` (Gradient-ID je Symbol eindeutig machen, wenn mehrere auf einer Seite stehen). Darauf:
```
selten (1 Stern):
<polygon points="16.00,8.20 18.17,13.41 23.80,13.87 19.52,17.54 20.82,23.03 16.00,20.10 11.18,23.03 12.48,17.54 8.20,13.87 13.83,13.41" fill="#fffbe0" stroke="#7a5410" stroke-width="1.1" stroke-linejoin="round"/>

sehr selten (2 Sterne):
<polygon points="11.20,10.80 12.67,14.38 16.53,14.67 13.58,17.17 14.49,20.93 11.20,18.90 7.91,20.93 8.82,17.17 5.87,14.67 9.73,14.38" fill="#fffbe0" stroke="#7a5410" stroke-width="1.1" stroke-linejoin="round"/><polygon points="20.80,10.80 22.27,14.38 26.13,14.67 23.18,17.17 24.09,20.93 20.80,18.90 17.51,20.93 18.42,17.17 15.47,14.67 19.33,14.38" fill="#fffbe0" stroke="#7a5410" stroke-width="1.1" stroke-linejoin="round"/>

einzigartig (blauer Diamant):
<polygon points="16,7.5 23,13.0 16,25.0 9,13.0" fill="#2f7fe0" stroke="#0f3f8a" stroke-width="1.1" stroke-linejoin="round"/><polygon points="16,7.5 23,13.0 9,13.0" fill="#7fb8ff" stroke="#0f3f8a" stroke-width=".7" stroke-linejoin="round"/>

Ausnahmepferd (2 Diamanten):
<polygon points="10.5,9.5 15.7,13.6 10.5,22.5 5.3,13.6" fill="#2f7fe0" stroke="#0f3f8a" stroke-width="1.1" stroke-linejoin="round"/><polygon points="10.5,9.5 15.7,13.6 5.3,13.6" fill="#7fb8ff" stroke="#0f3f8a" stroke-width=".7" stroke-linejoin="round"/><polygon points="21.5,9.5 26.7,13.6 21.5,22.5 16.3,13.6" fill="#2f7fe0" stroke="#0f3f8a" stroke-width="1.1" stroke-linejoin="round"/><polygon points="21.5,9.5 26.7,13.6 16.3,13.6" fill="#7fb8ff" stroke="#0f3f8a" stroke-width=".7" stroke-linejoin="round"/>

Jahrhundertpferd (geflügelter Diamant):
<g fill="#fffbe0" stroke="#7a5410" stroke-width=".9" stroke-linejoin="round"><polygon points="12.6,16.5 5.5,11.5 7,15 3.8,15.8 7,17.6 5.2,20 8.6,19.8 7.8,22.4 12.6,19.6"/><polygon points="19.4,16.5 26.5,11.5 25,15 28.2,15.8 25,17.6 26.8,20 23.4,19.8 24.2,22.4 19.4,19.6"/></g><polygon points="16,9 20,12.6 16,23 12,12.6" fill="#2f7fe0" stroke="#0f3f8a" stroke-width="1.1" stroke-linejoin="round"/><polygon points="16,9 20,12.6 12,12.6" fill="#7fb8ff" stroke="#0f3f8a" stroke-width=".7" stroke-linejoin="round"/>
```

## Etappe R1 – Seltenheit berechnen und anzeigen (mittel)
1. Funktionen `seltenGen(p, rasse)`, `seltenLeistung(p, rasse)`, `seltenheit(p)` (Wahrscheinlichkeit, Stufe 0–5, Begründungstexte). Rang-Schwellen je Rasse als Tabelle (Stichprobe, fester Seed) im Code.
2. Symbole hinter dem Namen, Stallplakette, ⓘ-Info mit dem Hinweis, Zeile im Verkaufsfenster.
3. Test: je Rasse 2000 Pferde würfeln, Anteil je Stufe ausgeben (Ziel: etwa 3–10 % mindestens „selten“, Haflinger nur über Leistung); eigenes Pferd ohne Fellfarben-Test zeigt keine Gen-Rarität.
4. Enzyklopädie: Eintrag „Seltenheit“ (für alle) und im Adminmodus („Berechnungen zum Nachschlagen“) alle Konstanten und Schwellen.

## Etappe R2 – Raritäten-Markt (groß)
1. **Wo:** Hauptmenü - Pferdemarkt - neue Kachel „💎 Raritäten-Markt“ (in `MARKT_BEREICHE`). **Marktjahr** wechselt zu Beginn jedes Sommers; das Angebot gilt das ganze Jahr. Beginnt das Spiel nach dem Sommer, steht auf der Kachel „Der erste Raritäten-Markt öffnet im Sommer“.
2. **Eintritt (Dome):** 25 € **Jahreskarte**, einmal beim ersten Öffnen im Marktjahr (Buchung „Raritäten-Markt: Eintritt“, Finanzen unter Pferdemarkt; im Adminmodus frei; Dispo-Sperre aus B1 beachten). Vor dem Bezahlen steht nur „Raritäten-Markt: 2 Pferde je Rasse, Eintritt 25 €“, die Pferde sieht man erst danach.
3. **Angebot:** je Rasse (alle, nur **reinrassig**) **2 Pferde**, Alter 6–8 Jahre, Geschlecht je Pferd zufällig Hengst oder Stute (kein Wallach). Pro Pferd würfeln: **60 % nur Gen-Rarität, 30 % nur Leistungs-Rarität, 10 % beides** (Haflinger immer nur Leistung). Stufen etwa 60 % selten, 30 % sehr selten, 10 % einzigartig (Ausnahme- und Jahrhundertpferd ergeben sich selten durch die Kombination, sie werden nicht gewürfelt).
4. **Abwechslung (Dome):** Je Rasse und Marktjahr wird ein **anderes seltenes Gen/Merkmal gewählt als im Vorjahr** (das Vorjahr je Rasse merken, `spiel.rarVorjahr[rasse]`); im Folgejahr sind es **ganz neue Pferde** mit neuen Namen. Nicht gekaufte Pferde des Vorjahrs sind weg, gekaufte bleiben im Stall. Laufende Auktionen enden spätestens am letzten Tag des Marktjahres.
5. **Erzeugen, nicht speichern:** Die Pferde nie im Spielstand ablegen (je ca. 12 KB), sondern aus `zufall("rar-" + marktjahr + rasse + i + spielername)` immer gleich neu erzeugen (im Speicher zwischenhalten). Gespeichert werden nur: Marktjahr, Eintritt bezahlt, `rarVorjahr`, Gebote, Auktionen und gekaufte Pferde (die gehören dann wie jedes Pferd zum Stall). Gen-Raritäten durch gezieltes Setzen der Gene erzeugen (z. B. `neuesPferd({ gen })`), Leistungs-Raritäten durch Setzen von Gangwerk/Werten/Charakter auf das gewünschte Rangband und **Ausbildung bis S mit echten Turniereinträgen** (Siege/Platzierungen nach den Regeln oben; `marktErfolge` so erweitern, dass die geforderten Siege sicher entstehen).
6. **Nachweis (Dome):** Jedes Pferd hat die Tests **Fellfarben, Abstammungsnachweis und Erbkrankheiten** (plus Gangpferde-Test, wenn die Rasse DMRT3 hat) und die AKU ist wie in jedem Kauf-/Biete-Fenster dazubuchbar. Der Testwert steckt im Preis (`testWert`).
7. **Anzeige:** Liste mit **Kontinent-Knöpfen** (`sortSegment`, Knöpfe erweitern sich automatisch, wenn weitere Kontinente dazukommen) und Seltenheits-Symbol hinter dem Namen. Jede Karte hat eine **Anpreisung** (Dome): *Besonderheit* (was ist es), *Warum besonders* (Zahlen: „in der Rasse bei nur 1 %“), *Wirkung* (Optik, Vererbung) und, wenn vorhanden, **Erbkrankheit/Risiko durch das Gen** (z. B. „⚠️ Overo: Lethal White bei Verpaarung mit einem anderen Overo“, Splashed White: Taubheit möglich, Leopard: Nachtblindheit bei reinerbigen Fohlen, Dominant White: reinerbig nicht lebensfähig) sowie Erbkrankheiten der Rasse aus dem Nachweis. Für **jedes Gen in `GENE`** einen Textbaustein (Besonderheit, Wirkung, Risiko) anlegen; für Leistungs-Raritäten Texte mit Zahlen („Trab 9,4, besser als 99 % der Vollblüter · ausgebildet bis S (Dressur) · 4 Siege in S · Charakter: gelassen und lernbegierig“).
8. **Warnung bei gefährlichen Genen** (Overo, Leopard, Dominant White): sofort beim Ansehen, weil der Nachweis vorliegt.
9. **Einladungsbrief** einmal im Jahr zum Angebotswechsel (Beginn des Sommers) vom „Verband seltener Pferdefarben“, mit **3 Beispielpferden** aus dem neuen Angebot (Name, Rasse, Stufe, Symbol, Preis) und dem Hinweis auf die Jahreskarte. Keine Erinnerung am letzten Tag.
10. Im Adminmodus: Knopf „Raritäten neu würfeln“ zum Testen.

## Etappe R3 – Preise, Kaufen per Auktion (mittel)
1. **Preis** (auf 50 € gerundet), mit `m = marktwert(p) − testWert(p)`:
   1. **Gen-Rarität:** `max(Mindestpreis, m × Faktor)`; Faktoren **5 / 12 / 30**, Mindestpreise **10.000 / 25.000 / 60.000 €** (selten / sehr selten / einzigartig).
   2. **Leistungs-Rarität:** Faktoren **2 / 4 / 8** (der Marktwert enthält Ausbildung, Gänge und Erfolge schon), dieselben Mindestpreise.
   3. **Beides:** Gen-Faktoren.
   4. Ausnahmepferd ×1,5, Jahrhundertpferd ×2.
   5. Dazu die Testkosten (`testWert`), im Mittel ca. 260 €.
   Beispiele (Gen-Rarität, Marktwert-Median 6–8 J.): Shetty 10.500 / 25.250 / 61.750 €, Araber 16.500 / 39.250 / 97.750 €, Vollblut 25.500 / 60.850 / 151.750 €. Dome will die Preise im Spiel prüfen und danach nachjustieren.
2. **Kaufen nur per Auktion** wie im Auktionshaus (Höchstgebot `duMax`, Gegenbieter `npcLimit` unverändert, also bis zum 6-Fachen möglich, Dome: 400.000 € für ein einzigartiges Pferd ist realistisch). Startgebot = der Preis aus Punkt 1. Dauer und Ablauf wie im Auktionshaus, endet spätestens am Ende des Marktjahres. `gebundenesGeld` und die Dispo-Sperre (B1) gelten. AKU wie überall.
3. **Neuzugang:** wie jeder Kauf in die nächste freie Box des aktiven Hofs (Quarantänebox zuerst, `neuzugangBox()`, Quarantäne eine Jahreszeit), Transport automatisch.
4. Finanzen: Kategorie „Pferdemarkt: Raritäten“; Zähler für Thema 2 („Raritäten gekauft/verkauft“, `spiel.protokoll`).

## Etappe R4 – Eigene Raritäten anbieten (klein/mittel)
1. Auf dem Raritäten-Markt (nach Jahreskarte) Knopf „Eigenes Pferd anbieten“ (Dome: ja). Zugelassen sind eigene Pferde, die mindestens „selten“ sind **und** bei Gen-Rarität den Fellfarben-Test und den Abstammungsnachweis haben (Leistungs-Raritäten brauchen nur ihre sichtbaren Werte).
2. Verkaufspreis-Richtwert nach R3 Punkt 1; Verkauf als Auktion nach den Regeln der eigenen Auktion (Start ½ Wert, Abbruchstrafe wie bisher), die Gegenbieter richten sich nach dem Raritätenpreis. Zwischenstand und Ergebnis per Brief wie bei bisherigen Verkäufen. Annahme der Planung, bitte beim Testen mit Dome prüfen.
3. Im normalen Verkaufsfenster steht der Hinweis, dass Raritäten nur hier mehr wert sind.

## Testen
1. R1: Verteilung je Rasse (Stichprobe), Symbole in allen Größen, Plakette neben P/★, Hinweis-Texte, Gen-Rarität erst nach Fellfarben-Test sichtbar.
2. R2: Alle Rassen haben 2 Pferde (Haflinger nur Leistung), Alter 6–8, kein Wallach, reinrassig; Stufenverteilung; im Folgejahr andere Gene/Pferde; gleiche Pferde bei jedem Öffnen; Spielstand wächst nicht (Größe vor/nach); Kontinent-Knöpfe; Jahreskarte nur einmal pro Marktjahr; Brief mit 3 Beispielen; Siege der Ausbildungs-Raritäten stehen in der Turnierliste.
3. R3: Preise stimmen mit der Tabelle, Auktion mit Gegenbietern, Dispo-Sperre, Quarantänebox, AKU.
4. R4: Eigenes Pferd anbieten und verkaufen, Ablehnung ohne Nachweis.
5. Screenshots in PC 1366×768, Handy quer 844×390, Handy hochkant 390×844 für Raritäten-Markt, Anpreisung, Plakette und Info-Fenster.
