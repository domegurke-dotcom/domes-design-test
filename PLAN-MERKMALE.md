Auftrag für die Coding-Sitzung: Karte „Merkmale“
(Beurteilungsbogen wie beim Zuchtverband)
Stand: 20.10.2026, im Projekt-Chat mit Dome geplant (Runden 1–3), Code-Stand beim Planen v575.
Reihenfolge: M1 → M2 → M3 → M4 → M5.
**Stand 20.10.2026: M1 fertig (v587: `p.bau`, `BAU_ZIEL…`/`bauZielRasse`, `bauErgaenzen`, `bauErben`, `muskelIst`/`hufIst`, `opt.bau`/`bauK`, Admin-Aufschlüsselung, `tests/merkmale-test.js`); M2 fertig (v590: Reiter Merkmale mit 5 Aufklapp-Bereichen, Balken mit Raute, Noten, Stärken/Schwächen-Satz, Daten bereinigt, alte Reiter umgeleitet, Stufen `merkBalken`/`merkNoten`/`merkVorschau`, Kürzel). M3 fertig (v594: Marktwert, Disziplin ±4 %, Gesundheit ×1,3/×1,7, Fohlenschau aus dem Körperbau; Prämienanteil vorher 14,6 % → nachher 15,5 %). M4 fertig (v595: Bereiche Rassemerkmale und Besonderheiten, `rasseMerkmale`, `besondListe`, Hahnentritt `p.besond`, Zuchtbuch `zuchtbuchVon`, `exterieurFaktor`, Typnote-Abzug). M5-Kern fertig (v596: `paarVorschau`/`paarVorschauHTML` im Hengst-Fenster mit Knopf „🧬 Merkmale“ + Stute als Vergleich, Blasen merkKarte/merkBalken/merkVergleich/merkFehler/merkHuf/merkMuskel/merkRasse, Einsteiger-Eintrag „Beurteilungsbogen“, bzn, Admin „Merkmale selbst wählen“); offen: Tutorial-Kapitel, Fremd-Vergleich, Blasen M3/M7. Früher: Hinweisblasen/Tutorial/Enzyklopädie-Eintrag mit M5.** M1-Festlegungen (Claude, in `OFFENE-FRAGEN.md`): Alters- und Krankheitsabzug der Bemuskelung, Hufpflege „gut/vernachlässigt“, Richtung von „Rahmen → Tiefe“.

Wann umsetzen (Dome, 20.10.2026): Die Themen 1–5 (Spielstand, Bilanz, Raritäten,
Waschplatz, Hinweise/Stufen/Tutorial) sind schon gebaut. Es gibt keine Wartezeit. Die Hinweise und
das Tutorial werden gerade vom Claude-Team überarbeitet: Anhang B so einbauen, wie die Hinweise
jetzt im Code funktionieren (PLAN-HINWEISE.md, TIPPS/Blasen-System, STUFE_NEU, tutorialStart), und bei
Widerspruch den neuen Stand gewinnen lassen.

Zuerst speichern
   1. Diese Datei im Repo als PLAN-MERKMALE.md speichern, Anhang A als PLAN-MERKMALE-TABELLEN.md,
      Anhang B als PLAN-MERKMALE-TEXTE.md.
   2. Anhang C (Zeichenliste) in BEI-INKSCAPE-BEARBEITEN.md unten anhängen (Dome führt dort ihre
      Liste).
   3. In PROJEKT-CHAT-THEMEN.md Punkt 6 („Neue Karte Merkmale“): „geplant → PLAN-
      MERKMALE.md“. Neue Punkte anlegen: „Körung, Stutenschau,
      Hengstleistungsprüfung“ (Dome, 20.10.2026, später planen; hängt an der Zuchtbuch-Klasse
      unten) und „Rücken, Fesselung, Stellung und Huf im Pferdebild sichtbar“ (wartet auf
      Domes überarbeiteten Körper). PROJEKT-CHAT.md aktualisieren.
   4. Kuerzel.md: neues Kürzel Merkmale / mkm = Box - stb - Merkmale; gw, eig, Charakter sind
      jetzt Abschnitte darin (Box - stb - Merkmale - Gangwerk usw.).
   5. Etappe für Etappe umsetzen, abhaken, nach jeder Etappe auf main hochladen. Regel aus Thema 5
      gilt: jede neue Funktion bekommt gleich Tipp-Eintrag und Stufen-Eintrag.

Ist-Stand (v575)
   1. Box - Steckbrief hat die Reiter Daten, Genetik, Aufschlüsselung (nur Admin), Gangwerk,
      Eigenschaften, Charakter, Ausbildung (Leiste in zeigeAkte, aktenReiter = steckbrief / genetik /
    aufschl / gang / werte / charakter / ausbildung).
  2. „    Vergleichen mit …“ (vglKopf, vergleichPferd, vergleichId) gibt es bei Gangwerk,
     Eigenschaften, Charakter und Ausbildung, aber nur mit eigenen Pferden (alleEigenenPferde).
     Zwei Balken übereinander (.balken.vgl, .vgl-b).
  3. Daten zeigt Stockmaß, Kopf (kopfName(kopfVon(p))), Abzeichen, Beine, Maul, Zeichnung, Augen,
     Gewicht, Besonderheit (Zwergwuchs p.zwerg), Hufgröße (p.hufGr).
  4. Die Zeichnung (zeichnePferd in pferd.js) hat je Rasse Stellschrauben R.k: len, depth, legT, neck,
     nAng, crest, croup, hq u. a. Reihenfolge dort: { ...R.k, ...ALTERS_K(stufe, R.k), ...(opt.k || {}) }.
     Wichtig: opt.k überschreibt die Fohlen-/Jährlings-Proportionen. Darum dafür nicht opt.k
     nehmen, sondern eine neue Option opt.bau (siehe M1).
  5. Vererbung von Werten: erben() mit ERB_SCHLUESSEL, Herkunft je Wert in H (H.gang, H.charakter,
     H.anlage, H.ex), Anzeige im Admin-Reiter Aufschlüsselung (AUFSCHL_TEILE, Teil „Größe &
     Exterieur“, Teil „Mutationen“). werteErgaenzen(p) füllt alte Pferde nach.
  6. Gebissfehler gibt es schon: Veranlagung biss (versteckt), p.gebissFehler (nach Zahnbehandlung
     oder Ankaufsuntersuchung bekannt), Zahnbehandlung zweimal im Jahr.
  7. Fohlenschau: fohlenNoten (Typ, Körperbau, Schritt, Trab, Eindruck), Kopf-Fehler KOPF_WERT,
     KOPF_TYPNOTE, WEISS_RASSE, fjordWeissFehler.
  8. Marktwert marktwert(p) mit abstFaktor; Stufen frei(f), STUFE(), STUFE_NEU; Adminmodus
     spiel.admin.


Entscheidungen (Dome, 20.10.2026)
Aufbau der Karte (M2)
  1. Neuer Reiter Merkmale in Box - Steckbrief, zwischen Genetik und Ausbildung. Neue Leiste:
     Daten, Genetik, Aufschlüsselung (Admin), Merkmale, Ausbildung. Die Reiter
     Gangwerk, Eigenschaften, Charakter fallen als eigene Reiter weg. Intern bleiben aktenReiter =
     "gang" | "werte" | "charakter" gültig und öffnen Merkmale mit dem passenden Abschnitt
     aufgeklappt (damit Training, Hinweise, Tutorial und Tests nicht brechen).
  2. Die Karte ist ein Beurteilungsbogen mit Aufklapp-Bereichen (Akkordeon, Pfeil ▶/▼ wie in
     der Enzyklopädie „Berechnungen zum Nachschlagen“). Reihenfolge: 1. Gesamteindruck · 2.
     Exterieur · 3. Farbe & Abzeichen · 4. Gangwerk · 5. Interieur (Unterbereiche Charakter
     und Eigenschaften mit Körper und Kopf) · 6. Rassemerkmale · 7. Besonderheiten. Beim
     Öffnen der Karte ist nur „Gesamteindruck“ offen; welche Bereiche offen sind, merkt sich das
     Spiel pro Spielstand (spiel.merkOffen).
  3. Oben in der Karte einmal „     Vergleichen mit …“ (vglKopf); der Vergleich gilt für alle Bereiche.
  4. Was in Merkmale gehört, steht nicht mehr in Daten. Aus Daten wandern: Stockmaß,
     Kopf, Gewicht, Besonderheit (Zwergwuchs), Hufgröße (→ Exterieur) und Abzeichen, Beine,
     Maul, Zeichnung, Augen (→ Farbe & Abzeichen). In Daten bleiben: Name, Rasse, Farbe,
     Geschlecht, Alter, Geboren, Fohlenschau, Plaketten, Fohlen, Zucht, Auslauf, Befunde, Marktwert.
     Die Admin-Aufschlüsselung bleibt, wo sie ist, und zeigt auch die neuen Exterieur-Werte samt
     Herkunft.
  5. Darstellung je Merkmal wie die Charakter-Skala: Balken zwischen zwei Gegensätzen, Marke für
     das Pferd, kleine Raute für das Zuchtziel der Rasse, rechts ein Wort („ideal“, „leichte
     Abweichung“, „deutlicher Fehler“, „starker Fehler“, bei den neutralen Merkmalen die Stufe wie
     „kurz“, „lang“). Beim Vergleich zweite Marke in der Vergleichsfarbe.
  6. Gesamteindruck: Zuchtverbands-Noten in halben Noten: Typ, Körperbau, Bewegung,
     Interieur, Gesamt (Gesamt mit einer Kommastelle) und Zuchtbuch-Klasse (nur Stuten, siehe
     M4), darunter 2–3 Sätze „Stärken / Schwächen“.

Exterieur-Werte (M1)
  7. Zwölf Werte je Pferd, p.bau = { rahmen, halsL, halsA, schulter, ruecken, kruppe, muskel,
     fundament, fessel, stV, stH, huf }, jeder 0–100 (Pole und Wörter: Anhang A). Dazu bleiben
     Größe (Stockmaß), Kopf (Kopfform, schon vererbt) und Gewicht wie bisher. Angezeigt werden
     die Zeilen: Rahmen, Typ (Note), Hals (Länge und Aufsatz), Schulter/Widerrist, Rücken, Kruppe,
     Bemuskelung, Röhrbein/Gelenke („Fundament“), Fesselung, Stellung vorne, Stellung hinten,
     Huf, Gesamteindruck (Note).
  8. Zuchtziel je Rasse: BAU_ZIEL[rasse][merkmal] = Mitte, Streuung BAU_S = 15 für alle. Startwerte
     nach Rassengruppen in Anhang A (Dome liest die Tabelle gegen; die Tabelle steht nur im Code,
     im Adminmodus wird sie angezeigt). Mischlinge: Mitte aus den Rasseanteilen (anteile)
     gewichtet.
  9. Abweichung d = |Wert − Ziel| / BAU_S. Stufen: ideal d < 0,7 · leichte Abweichung < 1,75
     (kein Abzug) · deutlicher Fehler < 2,33 (etwa 6 %) · starker Fehler ≥ 2,33 (etwa 2 %).
     Hinweis: Das ist Normalverteilung; per Test die Anteile messen.
 10. Vererbung: Kind = Mitte der Eltern + 0,2 × (Zuchtziel des Fohlens − Mitte der Eltern) + Zufall
     (Normal, Streuung 0,6 × BAU_S); mit 3 % zusätzlich Mutation (±1,5 bis ±2,5 × BAU_S). Herkunft je
     Merkmal in H.bau[k] = { wert, quelle: "Schnitt der Eltern" | "Mutation", von } (Admin-
     Aufschlüsselung, Teil „Größe & Exterieur“, und „Mutationen“).
 11. Fest ab Geburt: alle Werte außer muskel und huf. Bemuskelung (Ist-Wert muskelIst(p)) =
     Anlage + 0,4 × (Kraft-Ist − Kraft-Anlage) − 3 × (4 − Futterzustand), wenn Futterzustand unter 4,
     Alter und Krankheit mindern (Boxenruhe, lange Krankheit −5), 0–100. Huf (hufIst(p)):
     Abweichung vom Zuchtziel × 0,7 bei guter Hufpflege (Hufschmied-Termine eingehalten, Hufe
     ausgekratzt), × 1,5 bei vernachlässigter (Namen im Code bei Hufschmied/Hufe prüfen, v317 ff.).
     Bei Fohlen und Jährlingen steht „Fohlen wachsen noch – endgültig mit 3 Jahren“; die Werte
     zeigen die Anlage.
 12. Alte Spielstände, Markt, Deckstation, Archiv, Friedhof: bauErgaenzen(p) (wie
     werteErgaenzen) würfelt einmal aus, fest mit Seed p.id + "-bau", ohne Brief. Es muss überall
     funktionieren, wo es Pferde ohne p.bau gibt (Eltern in ahnen, Marktpferde, Hengste der
     Deckstation, Raritäten). Marktpferde und Deckhengste: stabil (gleicher Seed, gleiches Pferd).
 13. Pferdebild: neue Option opt.bau in zeichnePferd, wirkt nach ALTERS_K als Faktor auf k, höchstens
     ±15 % vom Rassenwert: rahmen → len (und depth halb), halsL → neck, halsA → nAng, kruppe → croup,
     fundament → legT, muskel (Ist) → hq und etwas crest. Schulter, Rücken, Fesselung, Stellung und
     Huf bleiben vorerst nur in Karte und Text, bis Domes überarbeiteter Körper steht. Aufrufer von
     zeichnePferd für Pferde (Stall, Steckbrief, Markt, Kopfbild-Kacheln) geben bauOpt(p) mit;
     Enzyklopädie/Rassenansicht ohne.

Wirkungen (M3, maßvoll)
 14. Noten (Formeln, Zahlen per Test abstimmen): Merkmalnote n = 9 − 2,5 × d (3 … 9,5, halbe
     Noten). Körperbau = gewichteter Schnitt der zwölf Merkmale (Gewicht 1,5 für Fundament,
     Fesselung, Stellung vorne/hinten, Rücken, Kruppe; sonst 1). Typ = bisherige Typ-Formel aus
     fohlenNoten (herausziehen als typNote(p)), minus 0,5 je Rassemerkmal-Verstoß (höchstens −1,5).
     Bewegung = Schnitt aus Schritt, Trab, Galopp (bei Tölt-/Passpferden Tölt statt Galopp) der
     gezeigten Gangwerte (gangGezeigt), bei Fohlen die Veranlagung; Hahnentritt −1. Interieur = 3 +
     7 × M / 100 mit M = Schnitt aus Arbeitswille, Nervenstärke, Menschenbezug, Mut (Charakter,
     hoch = gut) und Lernfähigkeit, Konzentration, Gehorsam. Gesamt = 0,2 Typ + 0,3 Körperbau +
     0,3 Bewegung + 0,2 Interieur. Der Schnitt aller Körperbau-Noten soll bei etwa 7,0 liegen (wie
     bisher bei der Fohlenschau); das 9 − 2,5·d bei Abweichung nachjustieren.
 15. Fohlenschau: Körperbau-Note aus dem neuen Körperbau (statt fund), Typnote aus typNote;
     danach den Anteil Prämienfohlen (ab 7,5) vorher/nachher messen, er soll gleich bleiben (± 3
     Prozentpunkte).
 16. Marktwert: deutlicher Fehler −3 %, starker Fehler −6 % je Merkmal, zusammen höchstens −25
     %. Stärken (d < 0,4): +0,7 % je Merkmal, höchstens +8 %. Dazu Rassemerkmale (M4),
     Besonderheiten, Zuchtbuch-Klasse. Gesamt nie unter 60 % und nicht über +25 % des bisherigen
     Werts. Reihenfolge: nach abstFaktor.
 17. Disziplinen: Disziplin-Wert × (1 + 0,04 × Σ w · s), s = clamp(1 − d/1,5, −1, 1) je Merkmal,
     Gewichte w (Summe 1) je Disziplin in Anhang A, also höchstens ±4 %. Gilt für alle Disziplinen in
     DISZ (Turnier, Fohlen nicht).
 18. Gesundheit: bei deutlichem / starkem Fehler Risikofaktor ×1,3 / ×1,7 in der Nachtberechnung
     für die zugehörigen bestehenden Befunde: Stellung vorne/hinten, Fesselung, Fundament →
     Sehnen-, Fesselträger-, Gelenk-Befunde; Huf → Huf-Befunde (Strahlfäule, Hufrehe,
     Hufgeschwür); Rücken → Rückenbefund, falls es einen gibt. Namen im Code suchen, nichts
     Neues erfinden. Auch hier gilt die Stufen-Regel (Anfänger ×0,25 usw.), weil der Faktor auf das
     Basisrisiko wirkt.

Rassemerkmale, Besonderheiten, Zucht (M4)
 19. Rassemerkmale (Aufklappbereich): je Zeile ✓ / „untypisch, aber erlaubt“ / ✗ (Verstoß): Größe
     im Rahmen (Stockmaß gegen h der Rasse), Farbe erlaubt (R.farben), Abzeichen erlaubt
     (WEISS_RASSE: strenge Rassen Friese, Fell, Fjord, Dales), Kopfform typisch (KOPFFORM_RASSE), Ohren,
     Behang/Fesselbehang, Gangart/Tölt (Islandpferd), Besonderheiten (Metallglanz Tekkiner,
     Marwari-Ohren), Gesamtabweichung der zwölf Exterieur-Zielwerte. Verstoß: Typnote −0,5,
     Marktwert −5 %. Schwerer Verstoß = „nicht zuchtbuchfähig“ (Farbe nicht zugelassen, bei
     strengen Rassen zu viel Weiß): Marktwert −15 % (ersetzt die 5 %, nicht addiert), Typnote −0,5 je
     Verstoß. Mischlinge sind ausgenommen („Mischling – keine Rassenprüfung“). Nie versteckte
     Gene zeigen: nur sichtbare Merkmale; eine Farbe, die erst ein Gentest zeigt, fließt erst nach
     dem Test ein.
 20. Besonderheiten (Aufklappbereich): Gebissfehler (gibt es schon; erst sichtbar, wenn
     p.gebissFehler, Marktwert −3 %), Hahnentritt (neu, 0,3 %, sichtbar sofort; Bewegung −1,
     Marktwert −15 %; vererbt sich zu 10 % mit einem betroffenen Elternteil, 30 % mit zwei),
     Kryptorchismus (neu, nur Hengste, 1 %, sichtbar erst ab 2 Jahren, bei der
     Ankaufsuntersuchung oder nach Tierarzt; Zuchtausschluss zuchtSperre, Marktwert −20 %,
     vererbt 15 % / 40 %; Kastration löst es: Wallach ohne Abzug, der OP-Preis bleibt wie bisher),
     Zwergwuchs (gibt es). Datenfeld p.besond = { hahn, krypt }. Hahnentritt und Kryptorchismus
     gehören in die Ankaufsuntersuchung (AKU) und in die Vererbungs-Aufschlüsselung (Admin).
     Anfänger sieht nur „auffälliger Fehler“ im Satz, Fortgeschritten die Namen, Experte zusätzlich
     „Neue Anlage: Hals länger als bei den Eltern“ aus den Mutationen (H.bau[k].quelle ===
     "Mutation").
 21. Zuchtbuch-Klasse (nur Anzeige und Marktwert; Stuten ab 3 Jahren, Rasse mit Zuchtbuch,
     kein Mischling): Gesamt ≥ 8,0 Hauptstutbuch (+5 % Marktwert), ≥ 7,0 Stutbuch I (+2 %), ≥
     6,0 Stutbuch II (±0), darunter Vorbuch (−3 %). Hengste: keine Zeile, stattdessen „Körung
     kommt später“. Körung, Stutenschau und Hengstleistungsprüfung sind ein eigenes späteres
     Thema.
 22. Verpaaren-Vorschau (Box - Steckbrief - Genetik - Verpaaren mit …, ab Fortgeschritten, nur
     Wörter, nie Zahlen, nie Gene): höchstens 4 Zeilen je Paar: „gleicht aus: Hals“, wenn einer ≥
     1,5 Abweichung auf einer Seite hat und der Partner auf der Gegenseite liegt (d ≥ 0,7);
     „verstärkt: Rücken“, wenn beide dieselbe Abweichung ≥ 1,2 haben („beide steile Schulter –
     Fohlen wahrscheinlich auch“); „Risiko: Gebissfehler / Hahnentritt / Kryptorchismus
     bei beiden“, wenn beide betroffen und bekannt sind; „Fohlen nicht zuchtbuchfähig
     möglich“, wenn ein sichtbarer schwerer Verstoß in einem vererbbaren sichtbaren Merkmal
     vorliegt (Abzeichen, Größe, Kopfform). Jede Hengst-Kachel in der Deckstation und in „Eigene
     Zucht“ bekommt einen Knopf „        Merkmale“, der die Karte des Hengstes (Lese-Modus) mit
     der Stute als Vergleich öffnet.
 23. Vergleichen mit Fremden: im Markt-Steckbrief (Lese-Modus) zeigt „Vergleichen mit …“ die
     eigenen Pferde; in der Deckstation wie oben. Vor dem Kauf sieht man Exterieur, Gangwerk,
     Rassemerkmale und Besonderheiten sofort (wie beim Ansehen in echt), das Interieur bei
     fremden Pferden nur grob („eher ruhig“); genau erst im eigenen Stall.

Stufen, Admin, Hinweise (M2/M5)
 24. Stufen (frei() / STUFE(), neue Schlüssel merkBalken, merkNoten, merkVorschau; STUFE_NEU ergänzen):
     Anfänger: Gangwerk-Noten und Eigenschaften-Balken wie bisher (fürs Training nötig),
     Charakter wie bisher nur Vorlieben/Abneigungen, Exterieur und Rassemerkmale nur als
     2–3 Sätze „Stärken / Schwächen“ (Satzbau in Anhang A), Besonderheiten nur als
     „auffälliger Fehler“, kein Verpaaren, aber Vergleichen. Fortgeschritten: dazu Exterieur-
     Balken, Charakter-Skalen, Rassemerkmale, Besonderheiten mit Namen, Verpaaren-Vorschau.
     Experte: dazu Zuchtverbands-Noten, Zuchtbuch-Klasse, Mutations-Hinweise. Adminmodus:
     zusätzlich Zahlen (Wert, Ziel, d).
 25. Hinweisblasen, Tutorial, Enzyklopädie, bzn, Rassenansicht-Admin „Merkmale
     selbst wählen“: siehe Anhang B.
 26. Alles Neue beachtet die Regeln aus CLAUDE.md: Kamera-Aussparung, Anzeigeboxen überdecken
     sich nicht, Zoomen im Steckbrief unverändert.

Etappen
  1. M1 Exterieur-Daten (mittel): p.bau, BAU_ZIEL, bauErgaenzen, Vererbung samt H.bau,
     Mutationen, Aufschlüsselung (Admin), opt.bau im Bild, Muskel-/Huf-Ist. Alte Spielstände
     auffüllen.
  2. M2 Karte (groß): neuer Reiter, Aufklapp-Bereiche, Balken, Noten, Sätze, Daten bereinigen,
     Gangwerk/Eigenschaften/Charakter einbinden, Vergleichen, Stufen, Kürzel, Weiterleitung der
     alten Reiter.
  3. M3 Wirkungen (mittel): Noten, Fohlenschau, Marktwert, Disziplinen, Gesundheit;
     Verteilungen messen.
  4. M4 Rassemerkmale, Besonderheiten, Zuchtbuch (mittel): Punkte 19–21, AKU,
     Zuchtsperre.
  5. M5 Verpaaren, Fremd-Vergleich, Hinweise, Tutorial, Enzyklopädie, bzn, Admin
     (mittel): Punkte 22–25.

Testen
  1. tests/merkmale-test.js: Verteilung der Fehlerstufen (deutlich etwa 4–8 %, stark etwa 1–3 % je
     Merkmal, mehrere hundert Pferde je Rasse), Vererbung (Kind liegt nahe der Eltern-Mitte,
     Mutation etwa 3 %), alte Pferde ohne p.bau (Spielstand laden), Marktpferde stabil, Noten
     (Körperbau-Schnitt etwa 7,0), Marktwert-Grenzen (−25 % / +8 % / 60 %), Bild: Fohlen behalten
     ihre Proportionen, ±15 %, Disziplin ±4 %, Gesundheit ×1,3 / ×1,7.
  2. Karte: alle Aufklapp-Bereiche, Merken des offenen Zustands, Vergleichen (eigenes, Markt,
     Deckstation), Stufen (Anfänger Sätze und Balken für Gangwerk/Eigenschaften, Fortgeschritten
     Balken, Experte Noten), alte Reiter-Namen öffnen den richtigen Abschnitt, Daten ohne
     Doppeltes.
  3. Screenshots in PC (1366×768), Handy quer (844×390) und hochkant (390×844), Kamera-
     Aussparung.
  4. Rassemerkmale: Friese mit viel Weiß = schwerer Verstoß, Mischling ohne Prüfung, versteckte
     Gene tauchen nirgends auf.
  5. Aufschlüsselung (Admin): neue Werte samt Herkunft und Mutation; bzn und Enzyklopädie
     aktuell halten.
