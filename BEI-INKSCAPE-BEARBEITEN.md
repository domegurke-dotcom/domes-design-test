# Bei Inkscape bearbeiten

Was in `pferd kopf.svg` noch fehlt oder nicht ganz der Realität entspricht. Gesammelt von Claude für Dome, Stand v429 (18.10.2026).
Nach dem Zeichnen einfach hochladen – `werkzeuge/kopf-export.js` übernimmt neue oder geänderte Ebenen, Claude baut sie ins Spiel ein.
**Wichtig:** Jede Änderung in **allen 19 Kopfformen** machen (jede Form hat ihre eigenen Gruppen `kopfabzeichen` und `maulfärbung`). Ebenennamen genau so schreiben wie hier angegeben.

## Muss geändert werden (Fehler)

### 1. Laterne: Farbverlauf
- **Problem:** Der Verlauf blendet im unteren Gesichtsteil auf 0 % Deckkraft aus – zwischen Auge und Nase scheint das Fell durch („braun in der Mitte“).
- **In echt:** Eine Laterne ist von der Stirn bis über die Nüstern durchgehend weiß und reicht seitlich über das Auge.
- **Ändern:** Die Fläche überall voll weiß lassen. Weich auslaufen nur am äußeren Rand zur Backe hin (z. B. nur ein schmaler Blur am Rand oder ein Verlauf, der erst ganz außen ausblendet).
- Bei **breite Blesse** und **Blesse** kurz prüfen, ob dort auch zu viel ausblendet – sie sollen ebenfalls von der Stirn bis zur Nase durchgehen.

## Fehlt noch (neue Ebenen)

### 2. Milchmaul (unter `kopfabzeichen`)
- **Was ist das:** Die Lippen selbst sind weiß (Haut darunter rosa) – nicht zu verwechseln mit der Schnippe (weißer Fleck auf der Nase zwischen den Nüstern, Lippen bleiben farbig).
- **Ebenen:** `milchmaul` (Ober- und Unterlippe weiß, von der Maulspitze bis etwa zum Maulwinkel). Wenn du es genauer willst, zusätzlich `weisse oberlippe` und `weisse unterlippe` einzeln.
- Kommt oft zusammen mit Blesse/Laterne vor, aber auch allein oder mit Schnippe → wird im Spiel wie die Schnippe kombinierbar.

### 3. Krötenmaul (unter `maulfärbung`)
- **Was ist das:** Rosa Haut mit dunklen Flecken/Sprenkeln um Maul und Nüstern (oft auch um die Augen).
- **Wann:** bei Tigerschecken (Leopard), Champagne und Cream (Cremello/Perlino). Champagne gibt es im Spiel noch nicht – kommt später als Gen.
- **Ebene:** `kroetenmaul`. Optional für die Augenpartie `kroetenaugen` (gesprenkelte Haut rund ums Auge).

### 4. Aufhellung um die Augen (optional, unter `maulfärbung`)
- **In echt:** Pangaré (Mehlmaul) hellt nicht nur das Maul auf, sondern auch einen Ring um die Augen. Schwarzbraune haben ebenfalls hellere Augenpartien.
- **Ebene:** `mehlaugen` (heller, weicher Ring ums Auge). Das Spiel zeigt sie dann zusammen mit dem Mehlmaul bzw. Kupfermaul.

### 5. Weitere Kopfabzeichen (optional, unter `kopfabzeichen`)
- `strich`: schmaler weißer Streifen nur auf dem Nasenrücken, ohne Verbindung zur Stirn.
- `unterbrochene blesse`: Stern oben + Strich unten, dazwischen farbig.
- Beides gibt es in echt häufig, im Pass wird es so eingetragen.

### 6. Teilweise blaues Auge (optional, unter `auge`)
- **In echt:** Bei Splash, Overo und viel Weiß ist das Auge oft nur zum Teil blau (z. B. blauer Sektor oder blauer Ring in einem braunen Auge).
- **Ebene:** `teilblaues auge`.

## Prüfen / im Auge behalten

### 7. Dunkles Maul (bisher Ebene `graumaul`)
- Ebene darf umbenannt werden in `dunkles maul` (das Skript versteht beide Namen). Die Farbe mischt das Spiel aus der Fellfarbe.
- Die Fläche ist recht klein und auf hellen Falben nur schwach zu sehen. In echt (siehe Fjordpferde) ist die ganze Nasenspitze bis über die Nüstern dunkel → etwas größer zeichnen.

### 8. Flocke und Stern
- Sitzen ganz vorn an der Stirnkante und sind im Spiel sehr klein (auf der Handy-Kachel in der Enzyklopädie kaum zu sehen). In der Seitenansicht sieht man in echt auch nur den Rand – aber etwas weiter zur Stirnmitte hin und etwas größer wäre deutlicher.

### 9. Blaues Auge
- Im Spiel ist von der Iris nur wenig zu sehen, das Blau fällt kaum auf. Eventuell die blaue Iris etwas größer/heller zeichnen.

### 10. Schöpfe (Etappe 3)
- **Aalstrich im Schopf** fehlt noch: bei Falben (Fjord usw.) ist die Mitte des Schopfs dunkel, außen hell. Eigene Ebene je Schopflänge, z. B. `aalstrich kurz`, `aalstrich mittel` usw. (Platzhalterfarbe #f8baba ist im Skript schon vorgesehen).
- Fohlen haben in echt einen kurzen, wuscheligen Schopf (der im Spiel erst wächst) – passt so.

## Hinweise (keine Fehler, nur zur Info)
- **Wimpern:** In echt haben Hengste, Wallache und Stuten gleich lange Wimpern. Die Zusatz-Wimper für Stuten und Fohlen ist eine schöne Spiel-Idee und darf bleiben – nur zur Info.
- **Pupille:** Echte Pferde haben eine waagerecht-längliche Pupille. Im Comic-Stil ist rund völlig in Ordnung.
- **Ohrgröße:** Ist in echt je Rasse verschieden (Araber klein und nach innen gebogen, Kaltblüter und Ponys mit Winterfell eher groß/breit). Das muss nicht gezeichnet werden – Claude kann die Ohren je Rasse im Spiel etwas größer/kleiner machen, wenn du das möchtest.
- **Hängeohren** (Schlappohren) gibt es in echt bei manchen alten Pferden und bei einzelnen Rassen-Linien – du hast entschieden: keine Hängeohren mehr. Bleibt so.
