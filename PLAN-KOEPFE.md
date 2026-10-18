# Plan: Neue Pferdeköpfe (Datei „pferd kopf.svg“)

Mit Dome besprochen am 18.10.2026 (Stand Spiel v423). Alle Köpfe werden komplett getauscht (`kopfteile.js`, `kopfalter.js`, `RASSE_KOPF` in pferd.js). Modell: **Opus**. In Etappen bauen, nach jeder Etappe hochladen und Dome schauen lassen.

**Tipp für Claude:** Die SVG ist 1,1 MB groß – nie komplett lesen, sondern mit kleinen Python-Skripten (xml.etree, `inkscape:label`) auswerten.

## Aufbau der Datei (inkscape:label)
- `kopf`
  - `marwarie-ohren rechts`: angelegt, nach hinten, zur seite, nach vorne (Namen von Dome am 18.10. korrigiert)
  - `basisohren rechts`: ohr-rechts-angelegt, -nach hinten, -zur seite, -nach vorne
  - `kopfformen`
    - `basiskopfform`: `gerader kopf` (darin `maulfärbung`, `kopfabzeichen`), `hechtkopf` / `ramsnase` / `ramskopf` je -leicht/-normal/-stark, `basiskopfform-kehleanschlusspunkt (kap)`
    - `keilkopf`, `schafskopf`, `schweinskopf` je -leicht/-normal/-stark + eigener kap
  - `marwarieohren links`, `basisohren links` (wie rechts)
  - `auge`: Formen `blaues auge` und `braunes auge` (in g162-13/g161-77), `stute + fohlen` = **zusätzliche** Wimper (nur Stuten und Fohlen; Hengst/Wallach ohne diese Form, die normale Wimper haben alle). Achtung: Namen stehen auch auf einzelnen Pfaden/Kreisen, nicht nur auf Gruppen.
  - `genikanschlusspunkt (gap)`, `schopfanschlusspunkt (schap)`
- `schopf`: extralang, lang, mittel, kurz + schap (Aalstrich laut Dome im Schopf)
- **Reihenfolge der Ebenen = vorne/hinten, genau so übernehmen.**

## Entscheidungen
- **Kopfformen:** gerader Kopf = Mitte (Stufe 0). Hechtkopf, Ramsnase, Ramskopf, Keilkopf, Schafskopf, Schweinskopf je Stufe 1–3 (leicht/normal/stark), entfernen sich immer weiter vom geraden Kopf.
- **Vererbung (jetzt erlaubt):** Form 50/50 von Mutter/Vater (gerade möglich, wenn ein Elternteil gerade), Stufe = Mittel der Eltern, je 25 % ±1, 2 % Mutation zu „stark“.
- **Je Rasse:** Hechtkopf (Araber, Shagya, Anglo-Araber, Welsh), Keilkopf (Vollblut, Trakehner, Warmblüter), Ramsnase (Kaltblüter, Tinker, Friese), Ramskopf (Kladruber, einige Barockpferde), gerade (Ponys, Haflinger, Quarter …). Marktpferde Stufe: leicht 40 % · normal 45 % · stark 15 % (gerade bei Rassen ohne typische Form häufig).
- **Schafs-/Schweinskopf** (Exterieurfehler): Shetty/Mini 8 % / 10 %, Kaltblut 8 % / 3 %, Rest 3 % / 2 %. Marktwert −5 % (normal) / −10 % (stark), leicht ohne Abzug; Fohlenschau etwas schlechtere Typnote. (Dome: ok)
- **Kopfabzeichen:** alte löschen. Schnippe mit allen anderen kombinierbar oder allein, alle anderen nur einzeln.
- **Maulfärbung:** höchstens eine. Eine versteckte, vererbte Veranlagung (Pangaré, je Rasse unterschiedlich häufig): Mehlmaul bei Braunen/Falben, Kupfermaul bei Füchsen, Graumaul bei Rappen. Krötenmaul später (Dome zeichnet noch).
- **Augen:** blau nur über Gene/Abzeichen: Doppel-Cream (Cremello, Perlino, Smoky Cream), Splash White, Frame Overo, Blesse/Laterne über dem Auge (ein- oder beidseitig, „Glasauge“). Sonst braun. Häufigkeiten beim Einbau Dome vorschlagen, in enz – Vererbung eintragen.
- **Ohren:** Stellungen vorne / zur Seite / hinten / angelegt. Linkes und rechtes Ohr unabhängig (jede Mischung). Grundstellung nach Vertrauen und Charakter: viel Vertrauen/neugierig → meist vorne, gelassen → meist seitlich, scheu/nervös/wenig Vertrauen → öfter hinten (je Ohr gewürfelt). Ohrenspiel: ab und zu wechselt ein Ohr kurz die Stellung (Reihenfolge aus der Datei). Angelegt nur beidseitig und nur im Extremfall (Streit, starker Schmerz, starke Abneigung). Marwari: gleiche Regeln mit eigenen 4 Stellungen. Keine Hängeohren mehr.
- **Wimpern:** alle haben die normale Wimper; Stuten und Fohlen zusätzlich `stute + fohlen`.
- **Schöpfe:** alte ersetzen (kurz, mittel, lang, extralang). Aalstrich im Schopf/zwischen den Ohren an Gen D (Falbe); Körper folgt, wenn Dome ihn zeichnet.
- **Anschlusspunkte:** kap (Kehle), gap (Genick), schap (Schopf) zum Ansetzen an Hals und Schopf nutzen.

## Etappen
1. Kopfformen mit Vererbung und Rassen, Anschlusspunkte, Ohren (Stellung + Ohrenspiel), Wimpern – **fertig (v424)**, Domes Abnahme steht aus.
   - Umsetzung: `werkzeuge/kopf-export.js` erzeugt `kopfneu.js` (`KOPF_NEU`) aus der SVG – nach Änderungen an der SVG einfach neu laufen lassen. `kopfteile.js`/`kopfalter.js` sind gelöscht.
   - pferd.js: `kopfNeuSVG`, `schopfNeuSVG`, `KOPFFORM_RASSE`, `KOPF_ALTER` (Altersköpfe: Stauchung Genick–Nase + größeres Auge). index.html: `p.kopf`, `kopfZufall`, `kopfVon`, `kopfErben`, `ohrenVon`, `kopfOpt`.
   - Schöpfe kommen schon aus der neuen Datei (sonst passen sie nicht), Aalstrich darin erst in Etappe 3 (bis dahin nur beim Fjord dunkle Mitte wie bisher).
   - v425 (Dome): Ohren in der Herde (`paarBeziehung`): gerade gestritten → angelegt, mögen sich nicht → hinten, Freunde → öfter vorne. Kopfform steht im Steckbrief (Daten) – Projekt-Chat plant dazu evtl. noch mehr.
2. Kopfabzeichen, Maulfärbung, Augenfarbe
3. Schöpfe mit Aalstrich

Danach: Enzyklopädie (Vererbung, bzn), Admin-Rassenansicht (Kopfform/Ohren wählbar), Screenshots in allen drei Ansichten, CLAUDE.md-Text für Dome.
