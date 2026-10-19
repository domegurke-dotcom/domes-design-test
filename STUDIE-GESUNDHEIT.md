# Gesundheits-Studie (19.10.2026, v531)

Auftrag Dome: je Rasse über 3 Jahre messen, wie oft Pferde krank werden, in jeder Altersklasse, bei guter, mittlerer und schlechter Pflege, mit Behandlung und Heilung. Skript: `tests/gesundheit-studie.js`, Auswertung `tests/gesundheit-auswertung.js`.

## Aufbau
- Je Rasse 40 Pferde (10 je Altersklasse: Fohlen 0,6–1 J., Jungpferd 1–4 J., Erwachsen 4–14 J., Senior 15–26 J.), Stuten und Wallache, alle im Start-Pensionsstall (Stufe 1) mit 40 Boxen, 4 Weiden à 5 ha (je Altersklasse eine Gruppe), Tempo 7 Tage je Jahreszeit, 3 Jahre = 84 Spieltage, je Pflegestufe 2 Durchläufe → 28 Rassen × 3 Stufen × 80 Pferde.
- **Zeitmaßstab:** 1 Spieltag ≈ 13 echte Tage (91 Tage Jahreszeit ÷ 7). 1 Spieljahr = 1 echtes Jahr. Heildauern unten in Spieltagen.
- Pflegestufen: **gut** füttert/tränkt/mistet täglich, putzt 90 %, Weide 85 %, eigenes Putzzeug, sieht täglich nach, Tierarzt am selben Tag, Plan 100 %, Kontrolle nach 4 Tagen, Vorsorge pünktlich, Hufschmied bei Fälligkeit, Klinik bei ≤ 30 %. **mittel** 90/90/70 %, putzt 50 %, Weide 50 %, sieht an 60 % der Tage nach, Tierarzt mit 40 % je Tag, Plan 70 %, Vorsorge 50 %. **schlecht** 85/85/40 %, putzt 15 %, keine Vorsorge, Tierarzt erst ab schwer.
- Nicht enthalten: Zucht/Geburten (Erbkrankheiten der Fohlen), Turniere, Zukäufe, Mitarbeiter, bessere Stallstufen.

## Ergebnis je Rasse
| Rasse | gut: Befunde/J · krank · Tierarzt €/J | mittel: Befunde/J · krank · €/J | schlecht: Befunde/J · tot+Tierschutz | rassetypisch (gute Pflege, je 100 Pferdejahre) |
|---|---|---|---|---|
| Achal-Tekkiner | 4,7 · 58 % · 2.133 € | 3,3 · 64 % · 1.492 € | 2,4 · 100 % | Kehlkopfpfeifen 2,6, Augenlid-Krebs 2,2, Sarkoid 1,3, Spat 1,3 |
| Andalusier | 5,4 · 66 % · 2.328 € | 2,9 · 58 % · 1.180 € | 2,3 · 100 % | Melanom 11,0, Kehlkopfpfeifen 3,1, Hufrollenerkrankung 2,2, EMS 2,2 |
| Anglo-Araber | 5,7 · 64 % · 2.326 € | 4 · 70 % · 1.668 € | 3,3 · 100 % | Kehlkopfpfeifen 8,9, Sarkoid 5,8, Darmstein 3,6, Sehnenschaden 1,8 |
| Appaloosa | 4,1 · 64 % · 2.233 € | 3,3 · 61 % · 1.327 € | 2,9 · 100 % | Sarkoid 3,9, Periodische Augenentzündung 2,6, Kehlkopfpfeifen 1,7, Hufrollenerkrankung 1,7 |
| Araber | 3,8 · 49 % · 1.600 € | 3,4 · 66 % · 1.507 € | 2,3 · 100 % | Melanom 9,4, Darmstein 8,5, Sarkoid 5,4, Spat 1,3 |
| Barock Pinto | 4,4 · 50 % · 1.713 € | 4 · 67 % · 1.487 € | 3,4 · 100 % | EMS 7,0, Kehlkopfpfeifen 3,1, Aortenwandschwäche 2,2, Darmstein 1,7 |
| Clydesdale | 4,1 · 56 % · 1.633 € | 3,8 · 69 % · 1.588 € | 4,1 · 100 % | Kehlkopfpfeifen 7,4, EMS 4,8, Shivers 3,5, PSSM 2,6 |
| Dales Pony | 2,8 · 37 % · 1.242 € | 2,8 · 55 % · 1.256 € | 2 · 100 % | EMS 4,0, Darmstein 1,3, Periodische Augenentzündung 0,9, Sarkoid 0,9 |
| Fell Pony | 4,1 · 50 % · 1.817 € | 2,5 · 49 % · 1.049 € | 2,2 · 100 % | Sarkoid 2,7, EMS 2,3, Hyperlipämie 1,4, Spat 0,9 |
| Fjordpferd | 4,3 · 50 % · 1.832 € | 2,9 · 55 % · 1.244 € | 2,5 · 100 % | Sarkoid 1,7, Hyperlipämie 1,7, EMS 1,3, Darmstein 0,9 |
| Friese | 4 · 52 % · 1.743 € | 5,4 · 82 % · 1.975 € | 3,6 · 100 % | Kehlkopfpfeifen 5,2, Aortenwandschwäche 2,6, EMS 2,2, Megaösophagus 1,7 |
| Haflinger | 4,3 · 50 % · 1.761 € | 2,6 · 48 % · 1.076 € | 2,7 · 100 % | EMS 6,1, Sarkoid 2,2, Augenlid-Krebs 2,2, Shivers 1,3 |
| Hannoveraner | 5,1 · 56 % · 1.962 € | 3,3 · 56 % · 1.201 € | 3 · 100 % | Kehlkopfpfeifen 4,4, Sarkoid 1,8, EMS 1,3, Hufrollenerkrankung 1,3 |
| Islandpferd | 4,4 · 56 % · 2.033 € | 2,5 · 47 % · 939 € | 2,1 · 100 % | EMS 3,1, Spat 0,9, Augenlid-Krebs 0,9, Periodische Augenentzündung 0,9 |
| Knabstrupper | 4,3 · 49 % · 1.575 € | 4 · 71 % · 1.652 € | 2,8 · 100 % | Kehlkopfpfeifen 3,0, Periodische Augenentzündung 2,6, Sarkoid 2,2, Spat 2,2 |
| Lewitzer | 3,1 · 38 % · 1.307 € | 2,9 · 51 % · 1.233 € | 2,2 · 100 % | Sarkoid 1,8, Sehnenschaden 1,8, Shivers 0,9, Kissing Spines 0,9 |
| Lipizzaner | 4,2 · 58 % · 1.819 € | 3,3 · 62 % · 1.360 € | 2,9 · 100 % | Melanom 11,0, Kehlkopfpfeifen 3,1, Sarkoid 0,9, Shivers 0,9 |
| Marwari | 3,1 · 39 % · 1.191 € | 3 · 49 % · 1.121 € | 2,5 · 100 % | Kehlkopfpfeifen 2,2, Periodische Augenentzündung 1,7, Spat 0,9, EMS 0,9 |
| Noriker | 3,4 · 43 % · 1.272 € | 3,7 · 76 % · 1.732 € | 2,8 · 100 % | Kehlkopfpfeifen 4,8, EMS 3,5, Sarkoid 1,3, Periodische Augenentzündung 0,9 |
| Paint Horse | 5,1 · 65 % · 2.324 € | 2,8 · 55 % · 1.145 € | 3,7 · 100 % | Sarkoid 4,3, HYPP-Anfall 2,6, Augenlid-Krebs 2,6, PSSM 2,2 |
| Quarter Horse | 4,6 · 64 % · 2.256 € | 3,9 · 80 % · 1.768 € | 3 · 100 % | Sarkoid 4,4, PSSM 2,2, Sehnenschaden 1,3, Hufrollenerkrankung 1,3 |
| Shagya-Araber | 3,8 · 51 % · 1.587 € | 2,7 · 55 % · 1.020 € | 3 · 100 % | Melanom 11,9, Darmstein 3,5, Sarkoid 3,1, Hufrollenerkrankung 1,3 |
| Shetlandpony | 4 · 50 % · 1.839 € | 2,9 · 53 % · 1.202 € | 1,6 · 100 % | EMS 3,9, Darmstein 1,3, Periodische Augenentzündung 0,9, Hyperlipämie 0,9 |
| Shire Horse | 6,2 · 71 % · 2.578 € | 3,6 · 66 % · 1.467 € | 3,3 · 100 % | PSSM 11,8, Kehlkopfpfeifen 6,6, EMS 5,7, Shivers 4,8 |
| Tinker | 4,2 · 63 % · 2.128 € | 2,9 · 58 % · 1.269 € | 2,3 · 100 % | EMS 3,5, PSSM 2,6, Kehlkopfpfeifen 2,6, Darmstein 1,3 |
| Trakehner | 4,7 · 52 % · 1.767 € | 3,9 · 70 % · 1.636 € | 2,6 · 100 % | Kehlkopfpfeifen 6,9, Darmstein 2,2, Periodische Augenentzündung 2,2, Sehnenschaden 1,3 |
| Vollblut | 5,7 · 56 % · 2.051 € | 5,1 · 79 % · 1.895 € | 3,8 · 100 % | Kehlkopfpfeifen 10,1, Sarkoid 4,4, Darmstein 3,5, Sehnenschaden 3,1 |
| Welsh Cob | 3,7 · 45 % · 1.546 € | 3 · 57 % · 1.253 € | 2,1 · 100 % | EMS 5,7, Kehlkopfpfeifen 1,8, Sarkoid 1,3, Darmstein 1,3 |

## Zusammenfassung (Mittel aller Rassen)
| | gut | mittel | schlecht |
|---|---|---|---|
| Befunde je Pferd und Jahr | 4,3 | 3,4 | 2,8 |
| kranke Tage | 54 % | 62 % | 31 % (bis die Pferde weg sind) |
| Ø Schwere (1–5) / schwer (Grad ≥ 4) | 1,9 / 2 % | 2,0 / 9 % | 2,0 / 9 % |
| Heilung Ø (Spieltage) | 3,4 | 6,2 | 4,0 |
| Tierarzt-Besuche je Pferd und Jahr | 4,9 | 2,4 | 0,1 |
| Tierarzt-Kosten je Pferd und Jahr | 1.843 € | 1.384 € | 40 € |
| tot / vom Tierschutz geholt (3 Jahre) | 9,5 % / 0 % (nur Altersschwäche) | 9 % / 0 % | 18 % / 83 % (nach 2–3 Wochen) |
| Arbeit je Tag für 10 Pferde: Kranke / Routine | 9,5 / 55 | 5,6 / 34 | 0,1 / 28 |
| Befunde je Pferd und Jahr: Fohlen / Jung / Erwachsen / Senior | 4,1 / 4,1 / 4,3 / 4,9 | 3,2 / 3,2 / 3,2 / 4,0 | 2,5 / 2,4 / 2,6 / 3,9 |

Häufigste Befunde bei guter Pflege (je 100 Pferdejahre): Druse 153, Verletzung 92, Hautpilz 48, Husten 30, Erkältung 23, Lahmheit 16, Mauke 14, Kolik 8, Strahlfäule 8, Wurmbefall 7, Hufrehe 5.
Heildauer gute Pflege (Median/Max Spieltage): Verletzung, Husten, Lahmheit, Kolik 1 · Druse 6/38 · Hufrehe 6/20 · Sehnenschaden 7/28 · Hornspalt 5/31 · Arthrose 26/69 (chronisch).

## Bewertung (Claude)
Vergleich mit echter Haltung (grobe Richtwerte aus Tierarzt-/Versicherungsstudien): ein gut gehaltenes Pferd hat ca. 1–1,5 tierarztpflichtige Erkrankungen je Jahr und ist an ca. 5–10 % der Tage krank; Kolik 4–10, Hufrehe 2–7, behandlungswürdige Verletzungen 20–40, Atemwegsinfekte 10–30 je 100 Pferdejahre; Tierarzt ca. 500–1.000 € je Jahr inkl. Vorsorge.
1. **Viel zu viel krank** (54 % der Tage, 4,3 Befunde/Jahr bei guter Pflege) – Hauptursache **Druse 153 je 100 Pferdejahre**: keine Immunität nach überstandener Druse (in echt ~75 % für Jahre), Träger und Weide stecken immer wieder an. Ähnlich Hautpilz (48) und Influenza ohne Immunität. Dazu Verletzungen auf der Weide (92) gut doppelt so häufig wie in echt.
2. **Gute Pflege → mehr Befunde als mittlere**: mehr Weide = mehr Druse-Ansteckung und mehr Verletzungen. In echt ist regelmäßiger Weidegang in fester Gruppe eher gesünder.
3. **Arbeit:** gute Pflege braucht für Kranke ~1 zusätzliche Handlung je Pferd und Tag (17 % aller Handlungen), 4,9 Tierarztbesuche und ~1.840 € je Pferd und Jahr – deutlich zu viel, fast nur wegen der Infekte.
4. **Schwere und Heilung** passen im Zeitmaßstab meist (Verletzung/Husten/Kolik ≈ 2 Wochen, Hufrehe ≈ 2–3 Monate). Zu kurz: Sehnenschaden (7 Spieltage ≈ 3 Monate, in echt 6–12 Monate). Etwas lang: Druse (6 Spieltage ≈ 11 Wochen, in echt 3–6 Wochen).
5. **Kein Krankheitstod** bei guter/mittlerer Pflege (nur Altersschwäche) – in echt endet etwa jede 10. Kolik tödlich.
6. **Alter:** Fohlen und Jungpferde werden nicht öfter krank als Erwachsene; in echt haben Fohlen mehr Infekte (Durchfall, Atemwege), Senioren deutlich mehr (Zähne, Cushing, Arthrose).
7. **Schlechte Pflege:** schon bei 15 % Hungertagen, 15 % ohne Wasser und 60 % nicht gemistet sind nach 2–3 Wochen alle Pferde tot oder beim Tierschutz. Im Zeitmaßstab (1 Tag ≈ 2 Wochen) folgerichtig, als Spiel sehr hart.
8. **Rassen:** auffällig hoch Kehlkopfpfeifen Vollblut (10 je 100 PJ, in echt Lebens-Häufigkeit 3–8 %), Darmstein Araber (8,5, in echt selten außer bei viel Luzerne), Sarkoid Araber/Anglo-Araber (5–6), PSSM Shire (11,8 – Belege sprechen eher für wenig PSSM1 bei Shire/Clydesdale). Passend: Melanom bei Schimmel-Rassen, EMS bei Ponys/Barock, Shivers bei Kaltblut, HYPP/PSSM bei Paint/Quarter, Mondblindheit Appaloosa/Knabstrupper, Aorta/Megaösophagus Friese/Barock Pinto.

## Nachher (v532, 4 Rassen, gute / mittlere Pflege)
| Rasse | Befunde je Pferd und Jahr | kranke Tage | Tierarzt €/Jahr | Tierarzt-Besuche/Jahr | Senior Befunde/Jahr |
|---|---|---|---|---|---|
| Achal-Tekkiner gut | 4,7 → 2,8 | 58 → 21 % | 2.133 → 842 € | 5,6 → 2,7 | 5,3 → 3,0 |
| Vollblut gut | 5,7 → 3,3 | 56 → 31 % | 2.051 → 994 € | 5,5 → 3,2 | 7,0 → 4,2 |
| Araber gut | 3,8 → 2,6 | 49 → 38 % | 1.600 → 894 € | 4,2 → 2,7 | 5,1 → 3,4 |
| Shire gut | 6,2 → 3,0 | 71 → 33 % | 2.578 → 913 € | 6,5 → 3,0 | 6,3 → 4,1 |
| mittel (Ø der 4) | 3,9 → 3,3 | 69 → 52 % | 1.590 → 1.140 € | 2,7 → 2,2 | |

Druse sinkt von ~150 auf ~40 je 100 Pferdejahre. **Noch zu hoch: Weide-Verletzungen (~120 je 100 Pferdejahre, in echt 20–40)** – gesündere Pferde sind öfter draußen. Erste Tode „trotz Behandlung“ (Hufrehe, Druse).

## Plan: Zucht-Test (als Nächstes, Dome 19.10.)
Je Rasse 10 Zuchtstuten + eigener Hengst bzw. Deckstation, 3–5 Jahre, gute Pflege: Trächtigkeitsrate, Fohlen je Stute, Geburtsprobleme (schwere Geburt, schwache Fohlen, Abfohlbox ja/nein), Erbkrankheiten der Fohlen (LFS, OAAM, CHF, SCID, FIS, LWOS, W/W …) mit und ohne Gentest vor der Verpaarung, Fohlen-Krankheiten und -Todesfälle bis zum Absetzen, Waisen. Vergleich mit echten Zahlen (Trächtigkeit ~60–70 % je Saison, Fohlenverluste ~5–10 %).

## Nachher 2 (v533, 4 Rassen)
Weide-Verletzungen jetzt ~40 je 100 Pferdejahre (Ziel 30–40), Streit-Verletzung 7 %/15 %. Gute Pflege: 1,9–2,7 Befunde je Pferd und Jahr, 19–31 % kranke Tage, 660–913 € Tierarzt je Jahr, 1,8–2,6 Tierarztbesuche. Mittel: 2,5–3,5 Befunde, 42–52 % kranke Tage. Schlecht (Spieler 1 mit 50 % Klinik und Boxenruhe-Ende): 2,2–3,1 Befunde, 14–20 % tot und 53–64 % beim Tierschutz nach 3 Jahren (vorher 100 % nach 2–3 Wochen).

## Spieler 4 „Selbstbehandler“ und Nachbesserung (v534, 4 Rassen: Tekkiner, Vollblut, Araber, Shire)
Spieler 4 = wie Spieler 3 (gut), behandelt die ersten 2 Tage selbst (nur frei kaufbare Mittel/Aktionen, in 60 % passend zum Befund, sonst falsches Mittel) und ruft den Tierarzt erst bei Misserfolg (nach 2 Tagen oder ab Grad 3). Spieler 2 (mittel) ruft den Tierarzt jetzt nach 1–2 Tagen (60 % je Tag, vorher 40 %).

| Mittel der 4 Rassen | gut (3) | Selbstbehandler (4) | mittel (2) |
|---|---|---|---|
| Befunde je Pferd und Jahr | 2,1 | 2,3 | 2,8 |
| kranke Tage | 28 % | 32 % | 44 % |
| schwere Befunde (Grad ≥ 4) | 2 % | 2,5 % | 5,8 % |
| Heilung Ø (Spieltage) | 1,9 | 2,6 | 4,2 |
| bemerkt nach (Tage) | 0,9 | 1,0 | 2,1 |
| Tierarzt-Besuche je Pferd und Jahr | 2,1 | 1,9 | 2,0 |
| Tierarztkosten je Pferd und Jahr | 759 € | 732 € | 1.045 € |
| tot in 3 Jahren | 9,8 % | 8,8 % | 8,3 % (alle Altersschwäche bzw. Einzelfälle) |
Der Selbstbehandler spart etwa 30 € Tierarzt im Jahr, hat aber ~4 % mehr kranke Tage und verläuft ~0,7 Tage länger je Krankheit – realistisch: selbst behandeln verzögert die Heilung etwas, kostet aber weniger.
Schmutzige Mähne macht nicht mehr krank (nur Fell-Schmutz zählt für Hautpilz/Mauke/Husten; Mähne nur Wohlbefinden −0,5).

## Zweite Studie (v534, 19.10.2026): alle 28 Rassen × 4 Spieler, Vergleich mit v531
Gleicher Aufbau wie oben, aber **3 Durchläufe** je Rasse und Spieler (statt 2) → je Spieler ca. 9.500 Pferdejahre (schlecht 4.200, weil die Pferde wegkommen). Daten: `studie-daten/zweite-studie-v534/` (`_tabelle.md` = Vergleich alt → neu, `_befundarten.txt` = alle Befunde je Spieler). Keine Skriptfehler.
Spieler (v534): **gut** (3) · **mittel** (2, Tierarzt nach 1–2 Tagen) · **schlecht** (1, Futter/Wasser 85 %, Tierarzt ab Grad 4, 50 % Klinik, Boxenruhe endet) · **selbst** (4, wie gut, behandelt erst 2 Tage selbst).

| Mittel aller Rassen (alt v531 → neu v534) | gut | mittel | schlecht | selbst (neu) |
|---|---|---|---|---|
| Befunde je Pferd und Jahr | 4,3 → **2,0** | 3,4 → 2,4 | 2,8 → 2,3 | 2,0 |
| kranke Tage | 54 → **27 %** | 62 → 40 % | 31 → 63 % | 30 % |
| schwer (Grad ≥ 4) | 2 → 2 % | 9 → 6 % | 9 → 20 % | 3 % |
| Heilung Ø (Spieltage) | 3,4 → 1,9 | 6,2 → 4,2 | 4,0 → 11,9 | 2,6 |
| bemerkt nach (Tage) | 0,8 → 0,9 | 1,9 → 2,0 | 1,9 → 6,7 | 1,0 |
| Tierarzt-Besuche je Pferd und Jahr | 4,9 → **2,0** | 2,4 → 1,8 | 0,1 → 0,4 | 1,7 |
| Tierarzt + Klinik je Pferd und Jahr | 1.843 → **730 €** | 1.384 → 950 € | 40 → 800 € | 693 € |
| Hufschmied je Pferd und Jahr | 120 € | 89 → 91 € | 21 → 55 € | 119 € |
| tot in 3 Jahren / beim Tierschutz | 9,5 → 9,7 % / 0 | 9,2 → 9,3 % / 0 | 17,5 → 16,4 % / 83 → **53 %** | 9,4 % / 0 |
| Handlungen je Tag für 10 Pferde: Kranke / Routine | 9,5 → **4,5** / 57 | 5,6 → 3,9 / 36 | 0,1 → 1,8 / 21 | 5,2 / 57 |
| Befunde je Jahr Fohlen / Jung / Erwachsen / Senior | 4,2/4,1/4,3/4,9 → **1,8/1,8/2,0/2,6** | 2,3/2,2/2,2/3,1 | 2,1/2,1/2,3/3,0 | 1,8/1,9/1,9/2,6 |
| kranke Tage Fohlen / Jung / Erwachsen / Senior (neu) | 20/20/28/41 % | 35/34/37/55 % | 61/60/63/69 % | 21/24/31/45 % |

**Häufigste Befunde, gute Pflege (je 100 Pferdejahre, alt → neu):** Druse 153 → 38 · Verletzung 92 → 35 · Husten 30 → 27 · Erkältung 23 → 22 · Lahmheit 16 → 17 · Mauke 14 → 13 · Kolik 8 → 8,5 · Strahlfäule 8 → 7 · Hautpilz 48 → 5,6 · Hufrehe 5 → 4,5 · Wurmbefall 7 → 1,1. Heildauer (Median Spieltage): fast alles 1–2, Hufrehe 7, Sehne 28, chronische (Sarkoid, Spat, PSSM …) bleiben.
**Todesursachen gut (alle Rassen, 3.360 Pferde, 3 Jahre):** Altersschwäche 319, Hufrehe 3, Kolik 2, Hyperlipämie 1 („trotz Behandlung“). Mittel zusätzlich Röhrbeinbruch 2. Schlecht: Entkräftung 414.
**Rassetypisch (gute Pflege, je 100 PJ):** Melanom bei Schimmel-Rassen 11 (Andalusier, Araber, Lipizzaner, Shagya), EMS bei Ponys/Kaltblut/Barock 2–6 (Shire 6, Welsh Cob 5, Haflinger 4,7), Shivers Shire 5/Clydesdale 3, PSSM Noriker/Tinker/Quarter/Paint 2–3, HYPP Quarter 2, Sarkoid/Mondblindheit Appaloosa/Knabstrupper 3–4, Aorta Friese 3, Sommerekzem Isländer 2, Hufrolle Hannoveraner 3. Die auffälligen Werte von v531 (Kehlkopfpfeifen Vollblut 10, Darmstein Araber 8,5, PSSM Shire 12) sind weg.

### Bewertung (Claude): wie in echt?
- **Gute Pflege jetzt nah dran:** 2 Befunde je Pferd und Jahr (echt ca. 1–1,5 tierarztpflichtige, dazu kleine Sachen wie Mauke/Strahlfäule, die im Spiel mitzählen), 2 Tierarztbesuche und ~730 € je Jahr (echt 500–1.000 € inkl. Vorsorge), Kolik 8,5 (echt 4–10), Hufrehe 4,5 (2–7), Verletzung 35 (20–40), Lahmheit 17 (10–30). Klinik 2 je 100 Pferdejahre passt.
- **Noch zu hoch:** Druse 38 je 100 Pferdejahre ist weiter der häufigste Befund in fast allen Rassen (echt: einzelne Ausbrüche, im Mittel eher 1–5). Atemwege (Husten + Erkältung + Druse + Influenza) zusammen ~88 (echt 10–30). Kranke Tage 27 % (echt 5–10 %; im Spiel zählen chronische Befunde wie Melanom/Sarkoid/EMS jeden Tag mit, Senioren 41 %).
- **Zu wenig tödlich:** Kolik endet bei guter Pflege in 0,25 % der Fälle tödlich (2 von ~810), Hufrehe in 0,7 % (echt Kolik 6–10 %, Hufrehe ~10 %).
- **Zu viel Arbeit mit Kranken?** Nein mehr: bei guter Pflege ~4,5 zusätzliche Handlungen je Tag für 10 Pferde (8 % aller Handlungen, vorher 17 %). Mittel 3,9, Selbstbehandler 5,2. Das ist spielbar.
- **Alter:** Fohlen/Jungpferde 1,8, Senioren 2,6 Befunde je Jahr – Senioren passen, Fohlen werden aber nicht öfter krank als Erwachsene (echt mehr Durchfall/Atemwegsinfekte).
- **Selbstbehandler** ≈ gut (etwas mehr kranke Tage, etwas billiger) – realistisch.
- **Schlecht:** 63 % kranke Tage, 16 % tot, 53 % vom Tierschutz geholt (vorher 83 %) – als Folge echter Vernachlässigung plausibel.
- **Mittel:** Pferde stehen im Schnitt bei ~65 % Gesundheit und kommen ~1× im Jahr in die Klinik (101 je 100 Pferdejahre, v531: ähnlich) – Ursache ist nicht Krankheit, sondern Hunger/Mist (an 1 von 10 Tagen kein Futter, an 3 von 10 Tagen nicht gemistet → −19/−9,5 und unter 30 % erholt sich ein Pferd nur in der Klinik).

## Zucht-Studie (v534, 19.10.2026): alle 28 Rassen
Skript `tests/zucht-studie.js`, Auswertung `tests/zucht-auswertung.js`, Daten `studie-daten/zucht-studie-v534/` (`_auswertung.txt`).
Aufbau: je Rasse 10 Zuchtstuten (4–14 J.), 4 Jahre (112 Spieltage), gute Pflege wie Spieler 3, Weide 85 %. Stuten 1–5 → eigener Hengst, Stuten 6–10 → Deckstation (nur Frühling/Sommer). Jede leere, zuchttaugliche Stute wird 1× am Tag gedeckt. 3 Durchläufe je Variante → je Variante 840 Stuten.
- **A:** ohne Gentest, ohne Abfohlbox, niemand bei der Geburt.
- **B:** alle Eltern gentestet (Erbkrankheiten + Farbe); bei Warnung wird der andere Hengst genommen (deshalb deckt dort der eigene Hengst auch Stuten der Deckstation-Gruppe); 10 Abfohlboxen.

| | A | B | echt (Richtwerte) |
|---|---|---|---|
| tragend je Deckversuch | 85 % | 87 % | 50–65 % je Rosse |
| tragend je Stute und Jahreszeit mit Deckversuch | 99,9 % | 97 % | 80–90 % je Saison |
| verfohlt / Totgeburt | 1 / 0 von 2.100 | 1 / 0 | 5–10 % (inkl. früher Embryoverlust) |
| Fohlen je Stute in 4 Jahren | 2,49 | 2,54 | 2,4–3 (60–75 % Abfohlrate, 1. Jahr leer) |
| Abstand zwischen 2 Fohlen | 6 Jz (eigener Hengst) bzw. 8 Jz (Deckstation), nie 4 | 6 Jz | 1 Jahr möglich (Fohlenrosse, 30-Tage-Rosse) |
| schwach geboren | 15 % (niemand dabei) | 4,6 % (Abfohlbox) | Schwergeburt 4–10 % |
| Fohlen tot bis Absetzen | 0 von 2.094 | 0 von 2.132 | 3–10 % |
| Stute tot bei der Geburt | 0 | 0 | ~1 % |
| Befunde der Fohlen bei Fuß | 0 | 0 | Fohlendurchfall, Nabel-/Gelenkinfekt, Lungenentzündung häufig |
| Befunde nach dem Absetzen bis 1 Jahr | 0,69 je Fohlen (Verletzung, Druse, Husten …) | 0,69 | plausibel |
| Fohlen mit Erbkrankheit | 43 (PSSM1 41, HYPP 2) – passt zu den Träger-Anteilen (erwartet ~2–3 %) | 0 | – |
| Zuchtsperre (Stuten-Tage) | „hat ein Fohlen“ 22.454, krank 1.404, zu schwach 407 | ähnlich | – |
| Decktaxe / Tierarzt je Lauf (10 Stuten + Nachzucht, 4 J.) | 3.371 € / 50.699 € | 4.406 € / 52.778 € | – |

Rassen: Trächtigkeit je Versuch am niedrigsten bei Anglo-Araber 69 %, Tekkiner 73 %, Vollblut 74 %, Welsh Cob 77 %, Hannoveraner 78 % (heißere/sensiblere Pferde → weniger Wohlbefinden), am höchsten Clydesdale 94 %. Appaloosa und Knabstrupper in B: **0 Fohlen** – fast jede Verpaarung bekommt die Leopard-Warnung (Lp × Lp), wer sie befolgt, kann diese Rassen nicht züchten.
Erbkrankheiten-Mechanik funktioniert: mit Gentest und Ausweichen keine betroffenen Fohlen, ohne Gentest im erwarteten Umfang. Seltene rezessive tödliche (LFS, OAAM, CHF, SCID, FIS, WFFS) liegen bei < 0,5 % je Fohlen – bei 2.000 Fohlen kein Fall, das passt zu den Träger-Anteilen.

## Nachbesserung v535 (Domes Antworten) und Kontroll-Studie
Dome (19.10.): Punkte 1–3, 7–10 anpassen, 5/6 bleiben, 4 offen (Frage). Umgesetzt in v535 (Details in bzn „Zucht wie in echt (v535)“ und „Krankheits-Studie, Nachbesserung (v535)“). Kontrolle: alle 28 Rassen, Gesundheit 1 Lauf je Spieler, Zucht 3 Läufe je Variante (A Natursprung ohne Gentest, B Besamung mit Gentest + Abfohlbox, Trächtigkeitsuntersuchung 1 Tag nach dem Decken). Daten `studie-daten/v535-kontrolle/`.

| Gesundheit, gute Pflege (v534 → v535) | |
|---|---|
| Befunde je Pferd und Jahr | 2,0 → **1,4** (echt 1–1,5) |
| Tierarzt je Pferd und Jahr | 730 → **554 €**, 2,0 → 1,4 Besuche |
| Atemwege (Druse + Husten + Erkältung + Influenza) je 100 PJ | ~88 → **~23** (Druse 38 → ~2) |
| Kolik: Tod je Fall | 0,25 % → **6,3 %** (echt 6–10 %) |
| Hufrehe: Tod je Fall | 0,7 % → **14 %** (echt ~10–15 %) |
| Altersschwäche (je Lauf, 28 Rassen × 40 Pferde) | ~106 → 20 |
| kranke Tage | 27 → 25 % (chronische Befunde zählen mit) |

| Zucht v535 | A Natursprung | B Besamung | echt |
|---|---|---|---|
| tragend je Deckversuch | 55 % | 48 % | 50–65 % (Besamung 45–60 %) |
| tragend je Stute und Jahreszeit (Fr/So) | 90–93 % | 87 % | 80–90 % |
| Herbst | 61 % | 34 % | wenige Rossen |
| Fohlen je Stute und Jahr (ab Jahr 2) | 1,1 (von 4 Möglichkeiten 3,3) | 1,04 | 0,65–0,8 |
| verfohlt | 3,6 % | 3,2 % | 3–5 % (+ früher Embryoverlust) |
| Fohlen tot bis Absetzen | 4,6 % | 2,6 % | 3–10 % |
| Stute stirbt bei der Geburt | ~0,4 % | ~0,7 % | ~0,5–1 % |
| schwach geboren | 14 % | 4,7 % (Abfohlbox) | – |
| Fohlen mit Erbkrankheit | 67 (PSSM1 54, FIS 3, HYPP 3, CA 2, ACAN 2, MH 2, NFS 1) | 3 | – |
Appaloosa/Knabstrupper züchten jetzt auch mit Gentest (Leopard-Hinweis statt Warnung). Fohlen bekommen jedes Jahr ein Geschwister (Fohlenrosse).

## Nachträge v536 (Dome)
Stille Rosse (40 % der Rossen fallen nicht auf) – die Trächtigkeitsuntersuchung lohnt sich jetzt. Besamung so sicher wie Natursprung (Frisch 65 %, Versand 60 %). Kolik stirbt nur nach der OP (25 %) oder bei abgelehnter OP. Ungemistete Box −4. Hengste weniger einsam. Probelauf (4 Rassen): Kolik-Tod je Fall 6 % (alle nach OP), mittlerer Spieler Klinik 101 → 48 je 100 Pferdejahre; Zucht 91 % (Natursprung) bzw. 84 % (Besamung) tragend je Saison.
