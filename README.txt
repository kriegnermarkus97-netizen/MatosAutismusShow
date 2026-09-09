THE ADVENTURE OF TRUCKER LÖNHARD – WEBSITE
===========================================

SO FÜGST DU DEINE COMICBILDER EIN
---------------------------------
1. Öffne den Ordner "comic".
2. Lösche die Demo-Dateien 1.svg, 2.svg und 3.svg.
3. Kopiere deine Comicseiten hinein.
4. Benenne sie fortlaufend:
   1.png
   2.png
   3.png
   4.png
   usw.

Auch JPG, JPEG und WEBP funktionieren. Die Website erkennt außerdem 01.png / 001.png usw.
Wichtig: Die Nummerierung sollte ohne größere Lücken fortlaufend sein.

Die Website sucht automatisch nach bis zu 250 Seiten. Du musst script.js normalerweise NICHT bearbeiten.

FUNKTIONEN
----------
- automatisches Erkennen nummerierter Comicseiten
- Weiter / Zurück
- Wischen auf Handy/Tablet
- Pfeiltasten am PC
- Vollbildmodus
- Galerie aller Seiten
- automatische Kapitelübersicht (standardmäßig 20 Seiten pro Kapitel)
- gespeicherter Lesefortschritt im Browser
- Button "Von vorne lesen"
- responsive Darstellung für Handy und PC

KAPITELGRÖSSE ÄNDERN
--------------------
In script.js ganz oben steht:
chapterSize: 20

Zum Beispiel auf 10 ändern, wenn jedes Kapitel 10 Seiten haben soll.

WICHTIG BEIM TESTEN
-------------------
Am zuverlässigsten funktioniert die automatische Erkennung, wenn die Website über GitHub Pages oder einen anderen Webserver geöffnet wird.
Beim direkten Doppelklick auf index.html können manche Browser lokale Dateien einschränken.

GITHUB PAGES KURZANLEITUNG
--------------------------
1. Kostenloses Konto auf github.com erstellen.
2. Neues öffentliches Repository anlegen, z.B. trucker-loenhard.
3. Alle Dateien und den Ordner "comic" hochladen.
4. Settings -> Pages öffnen.
5. Source: Deploy from a branch.
6. Branch: main / root auswählen und speichern.
7. Danach wird deine Website unter einer github.io-Adresse veröffentlicht.
