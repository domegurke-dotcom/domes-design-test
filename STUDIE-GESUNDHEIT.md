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
