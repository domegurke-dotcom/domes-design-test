# Nebenthemen Tierhalteverbot + Speicher aufräumen (Thread 20.10.2026)

## Ist-Stand im Code (v596, gelesen 20.10.2026)
Tierhalteverbot:
1. Tod durch Vernachlässigung (Entkräftung oder unbehandelte Krankheit, nur eigene Pferde) → `tierschutzEinsatz()`: Strafe 2.000 € (`STRAFE_VERNACHLAESSIGUNG`), Ansehen Tierschutzverein −5, alle Pferde mit Gesundheit ≤ 30 % (nicht altersschwach, nicht in Klinik) werden beschlagnahmt → Klinik (+16 %/Tag bis 75 %) → Rückkauf 2 Jahreszeiten lang (halber Marktwert + Klinikkosten). Pensionspferde ≤ 30 % gehen an Besitzer zurück (Pensionsansehen −15).
2. Fohlen ohne eigene Box: Hinweis, letzte Warnung, Abholung durch Tierschutz (Ansehen −5).
3. Tod der Stute durch Vernachlässigung → Tierschutz nimmt Fohlen bei Fuß mit.
4. Tierarzt schreibt „Sorge um …“ bei unbehandelter, schlimmer werdender Krankheit. Schwere Fälle, die trotz Behandlung sterben, zählen nicht.
5. Kein Zähler: jeder Vorfall kostet gleich viel, keine Steigerung, kein Verbot.

Speicher:
1. Gepackt gespeichert (LZString, v519): Autospeicher, Platz 1, Platz 2, Rücksicherung.
2. Post: höchstens 120 Briefe, dann werden die ältesten gelöscht; nur Jahresberichte geschützt. **Sternbriefe werden mitgelöscht** (widerspricht Domes Wunsch).
3. Turnier: `p.erfolge` letzte 60 Einträge; Lebensbilanz `p.bilanz` und Schleifen `p.schleifen` (bis 300) ein Pferdeleben lang.
4. Archiv verkaufter/abgegebener Pferde: höchstens 40, Bestenlisten-Pferde geschützt.
5. Friedhof: unbegrenzt, ganzes Pferd gespeichert (wichtig für Stammbaum).
6. Messung Coding (v513, ungepackt): ~350 KB nach gut 2 Spieljahren.

## Runde 1: Fragen 1–19 gestellt (20.10.2026), Antworten folgen

### Domes Antworten Runde 1 (20.10.2026, 17:09)
1. ok – Absender Veterinäramt
2. Rückfrage → Beispiel erklärt (mehrere Pferde am selben Tag = ein Vorfall)
3. ok – 2.000 € / 5.000 € + Auflagen / Verbot
4. ok, aber Kontrolle in den nächsten 2 Jahreszeiten (Tempo 4) → Frage 20
5. ok, aber: Pferd unter 30 % wegen Alter/Krankheit, nicht Vernachlässigung? Klinik kann so ein Pferd nicht gesund machen → Fragen 21–23
6. ok (Verjährung 2 Jahre) · 7. ok (Verbot = Spiel verloren) · 8. Anzeige in Hof, ok · 9.–14. ok
15. ok, aber Spieler braucht Hinweis, wann automatisch gelöscht wird → Frage 24
16. ok · 17. ok
18. ok, aber Friedhof und/oder Archiv aufräumen mit Auswahl (was, wieviel) → Fragen 25–26
19. ok
Fund Code: altersschwach = gesundheitMax ≤ 40 (ab ~33 J.); Pferde in Behandlung werden heute beschlagnahmt; Klinik päppelt jedes Pferd auf 75 %. Kein Einschläfern im Spiel.

## Runde 2: Fragen 20–26 gestellt (20.10.2026)

### Domes Antworten Runde 2 (20.10.2026, 17:17)
Rückfrage zu 2: ab wann zählt eine Box als „voller Mist“? (Code: `b.mistStufe` 1–6, jeden Morgen 1, +1 je ungemisteter Nacht) → Frage 27
20. noch offen → Frage 29
21. ok · 22. ok, aber Rückkauf schon nach **1 Jahreszeit** · 23. ja, „Vom Tierarzt erlösen lassen“ einbauen · 24. nur b und c (keine Dauerzeile im Post-Fenster) · 25. ok · 26. ok

## Runde 3: Fragen 27–29 gestellt (Mängelliste Kontrolle, Uhrzeit Kontrolle, Frage 20 erneut)

### Domes Antworten Runde 3 (20.10.2026, 17:22) (Dome schrieb 36/37 für 28/29)
27. ok, Mängelliste passt
28. ok (Kontrolle tagsüber; Morgenmist zählt nicht, nur Stufe ≥ 3). Rückfrage: wer meldet, wenn kein Personal/Tierarzt/Hufschmied/Einsteller? → Fragen 30–31
29. ok (Kontrolle in den nächsten 2 Jz, Frist mind. 7 Spieltage)
## Runde 4: Fragen 30 (anonyme Meldung) und 31 (Kontrolle nach Meldung binnen 7 Tagen) gestellt
Antwort 17:26: 30 ja (anonyme Meldung 5 %/Mangel, max 25 %/Tag), 31 ja (Kontrolle binnen 7 Spieltagen nach Meldung).
## Runde 5: Fragen 32 (Erlösen 250 €), 33 (Höfe gemeinsam), 34 (Jahresbericht/Abschluss), 35 (Tutorial), 36 (Hinweisblasen) gestellt
Antwort 17:30: 32 ja und ja, 33–36 ok. → Auftrag fertig: coding-kopie/tierhalteverbot-speicher-auftrag.md (V1–V4, P1–P2, T, Tests).
Von Claude ergänzt (nicht ausdrücklich entschieden): Pensionsansehen −3 bei Kontrolle mit Mängeln, Brief „Akte entlastet“ bei Verjährung, Erlösen bei Pensionspferd zahlt der Besitzer, Alters-Ausnahme „nahe am eigenen Höchstwert (≤ 10 Punkte darunter)“.
