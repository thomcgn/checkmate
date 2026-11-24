# Einsteigerbuch „Die Pizzeria" · redaktioneller Plan

Band 1 richtet sich an Schülerinnen und Schüler ab Klasse 7 ohne Programmiererfahrung. Es gibt keinen Syntax-Einstieg über „Hello World", sondern einen durchgehenden Alltagsfall: eine Pizzeria mit Gästen, Zutaten, Regal, Rezepten und am Ende einer kleinen Bestell-App.

## Didaktische Regel

Jedes Kapitel folgt demselben Muster:

1. **Situation in der Pizzeria** – ein echtes Problem in zwei bis drei Sätzen.
2. **Regel auf Deutsch** – WENN … DANN … SONST … als fester mentaler Anker.
3. **Pseudocode** – die Regel in strukturierter, aber stilloser Form.
4. **Lernziele** – zwei konkrete Fähigkeiten.
5. **Erklärung** – kurze Sätze, ein Gedanke pro Absatz.
6. **Mini-Code** – höchstens acht Zeilen, nur eine neue Idee.
7. **Probier's** – eine Mini-Aufgabe mit sofort sichtbarem Ergebnis.
8. **Vorsicht** – der typische Fehler in Kindersprache.
9. **Auflösung** – erst auf Knopfdruck sichtbar.
10. **Wortschatz** – zwei neue Begriffe, erst nach der Geschichte erklärt.

Records und Generics kommen bewusst erst in Stufe 3 und 4. Vorher haben die Lesenden mit Namensschildern, Zutatenkarten und Regalen gearbeitet – damit wirkt `record` wie eine Bestätigung und nicht wie Fremdsprache. Architektur beginnt in Stufe 8 als Rollenteilung (Kassiererin, Küchenchef, Regalmeister); Spring Boot übernimmt in Stufe 9 nur das Verdrahten dieser Rollen.

## Stufen und Kapitel

| Stufe | Kapitel | Schwerpunkt |
|---|---|---|
| 0 · Ohne Computer denken | 1–4 | Reihenfolge, Zustand, WENN/DANN/SONST, Vergleiche |
| 1 · Erste Befehle | 5–8 | Ausgabe, Eingabe, Und/Oder, vollständige SONST-Wege |
| 2 · Wiederholen | 9–11 | Schleifen, Zähler, Listen und Index |
| 3 · Dinge bündeln | 12–14 | Datenkarte, `record`, Wertgleichheit |
| 4 · Box mit Etikett | 15–17 | Generics, Invarianz, Bounds |
| 5 · Rezepte & Rollen | 18–21 | Funktionen, Parameter, Klassen, Vererbung |
| 6 · Regal & Gäste | 22–25 | Map, Set, Streams, Lambdas |
| 7 · Wenn schiefgeht | 26–28 | Optional, Exceptions, erste JUnit-Tests |
| 8 · Vom Programm zur Anwendung | 29–32 | Schichten, eine Aufgabe pro Klasse, Maven, HTTP |
| 9 · Spring-Praxis | 33–36 | DI, Controller, Service, Repository |
| Abschluss | 37 | Pizzeria-API als Gesamtprojekt |

## Stand

Die Kapitel 1–4 sind vollständig ausformuliert (`src/content/pizzeria-book.ts`). Die Kapitel 5–37 besitzen bereits Alltagsszene, Regel, Lernziele, Konzeptverknüpfung und Quelle; der ausformulierte Text wird in der Reihenfolge der Stufen ergänzt. `validateBeginnerBook` verhindert, dass ein Kapitel ohne Alltagsproblem, ohne WENN-Regel, mit zu langem Codebeispiel oder ohne Quelle veröffentlicht wird.

## Fortsetzung

Band 2 „Die Pizzeria geht in Betrieb" ergänzt Datenbank, Anmeldung und Rollen, echte Fehlerbehandlung, Testing, Docker/CI und ein einfaches Frontend. Band 3 behandelt Nebenläufigkeit, Caching, Warteschlangen, Sicherheit, Observability und Arbeiten im Team. Damit bleibt der Sprung von der Übungsanwendung zur echten Anwendung nachvollziehbar statt überfordernd.
