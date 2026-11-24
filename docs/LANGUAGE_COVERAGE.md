# Sprachhandbücher · Stand 23. November 2026

Checkmate ist **konzeptorientiert**. Die hier genannten Sprachhandbücher sind eigenständig formulierte deutschsprachige Lehrtexte und enthalten Version, praktische Beispiele, Abweichungen zu anderen Sprachen, Übungen und Quellenbezug. Die Originaldokumentationen werden **nicht** ungeprüft kopiert.

## Bewusst ausgewählte zehn Entwickler-Sprachen

| Sprache | Lehrversion | Orientierung | Verifizierte Referenz |
| --- | --- | --- | --- |
| Python | 3.15 | Aktuelle stabile CPython-Linie | https://docs.python.org/3.15/ |
| JavaScript | ECMAScript 2026 | Sprachstandard, nicht Node-/DOM-API | https://262.ecma-international.org/ |
| TypeScript | 7.0 | Stabile Syntax, JS zur Laufzeit | https://www.typescriptlang.org/docs/ |
| Java | 25 LTS | Langfristig unterstützte JVM-Linie | https://dev.java/learn/ |
| C# | 15 / .NET 11 | Aktuelle C#-Sprachlinie | https://learn.microsoft.com/en-us/dotnet/csharp/ |
| C++ | C++23 | Veröffentlichter ISO-Standard | https://isocpp.org/std/the-Standard |
| PHP | 8.6 | Stabile PHP-Linie vom November 2026 | https://www.php.net/manual/en/ |
| Go | 1.27 | Stabile Go-Linie | https://go.dev/doc/ |
| Rust | 1.100 | Stabile Rust-Linie | https://doc.rust-lang.org/book/ |
| Kotlin | 2.4.21 | Stabile Kotlin-Version, keine RC | https://kotlinlang.org/docs/ |

Dies ist eine **didaktische Top-10-Auswahl**, keine Behauptung, exakt die Plätze 1–10 einer einzelnen Popularitätsrangliste abzubilden. Sie orientiert sich an beruflicher Relevanz, Vielfalt von Programmiermodellen und Übertragbarkeit von Konzepten.

## So funktioniert eine Handbuchseite

1. Gemeinsames Problem und verständliche Analogie
2. Schritt-für-Schritt-Erklärung
3. Eigenes Beispiel in der gewählten Sprache, mit *festgelegter Version*
4. Semantische Fallstricke und Unterschiede zu anderen Sprachen
5. Aufgabe, Hinweis und Musterlösung
6. Best Practices und vertiefender Vergleich

Die Handbücher und Beispiele sind in der Anwendung gebündelt. **Zum Lesen und Lernen ist keine Onlineverbindung nötig.** Quellen sind für die fachliche Nachprüfung durch Herausgeber und fortgeschrittene Leser hinterlegt.

## Verbindliche Qualitätsregeln

- Keine Behauptung von Äquivalenz bei lediglich ähnlicher Syntax.
- Beispielcode muss zur festgelegten Sprachversion passen.
- Versionsabhängige Features niemals als universell darstellen.
- Runtime-Verhalten (Fehlerfälle, Nullbarkeit, Reihenfolge, Ownership, Eager/Lazy) ausdrücklich kennzeichnen.
- Voraussetzungen in der Konzeptgrafik müssen vorhanden und zyklusfrei sein.
- Die internen Lehrtexte dürfen keine fremden Bücher oder vollständigen Dokumentationen unautorisiert kopieren.
- Neue Sprachen und Kapitel benötigen Tests, Versionierungsmetadaten, explizite Quellen und fachliche Prüfung.
- Lernende sollen nicht zwischen Website-Dokumentationen navigieren müssen; alles für die Lektion Notwendige steht in Checkmate.

## Stand und Grenzen

Das erste Release enthält ein **kuratierter Konzept-Handbuchkern**, nicht jede API, Standardbibliotheksfunktion oder alle Kapitel der offiziellen Manuals. Das ausbaubare Inhaltsmodell ermöglicht später Themen wie fortgeschrittene Nebenläufigkeit, Speicherverwaltung, Sicherheitsgrundlagen, Testing, Packaging, Standardbibliotheken und Web-Frameworks. Solche Kapitel werden nicht als bereits vorhanden ausgegeben.

## Desktop-Technologie

Electron, React und strikt typisiertes TypeScript. Statische, geprüfte Handbuchinhalte werden mit der Desktopanwendung ausgeliefert. Eine zusätzliche Datenbank ist für read-only Nachschlagewissen nicht nötig. Für künftig dauerhaft speicherbare Bücher, Kapitelversionen und umfangreiche Lernprofile kann eine lokale SQLite-Datenbank ergänzt werden. Kein Hosting-Server ist erforderlich.

## Redaktioneller Ausbau – sieben weitere Sprachkapitel

Die Offline-Bibliothek enthält jetzt zusätzliche eigenständig verfasste Einstiegskapitel für Python (Funktionsverträge und veränderliche Defaults), JavaScript (Identität, Truthiness und Konvertierung), C# (Nullable Reference Types), C++ (RAII und Besitz), PHP (Array-Schlüssel und Datenformen), Go (Fehlerwerte und `defer`) sowie Kotlin (Nullsicherheit). Jedes Kapitel enthält mehrere zusammenhängende Abschnitte, Codebeispiele, Verständnisfragen, eine Transferaufgabe und eine erläuterte Lösung. Fachliche Ausgangspunkte sind die direkt im Quellcode hinterlegten offiziellen Dokumentationslinks; es werden keine Originalbuchtexte übernommen.

**Nicht mit vollständigen Fachbüchern verwechseln:** Die Dokumentationspakete sind wesentlich umfangreicher als diese Manuskriptteile. Keine der zehn Buchausgaben gilt als redaktionell abgeschlossen. Eine vollständige Inhalts- und Quellenabdeckung aller zehn Sprachen sowie viele weitere eigenständige Lehrkapitel fehlen weiterhin. Die Bibliothek zeigt den Veröffentlichungsstand, aber noch keine zehn fertigen Sprach-Enzyklopädien.

## Zweiter Originalmanuskript-Block

Als direkte fachliche Fortsetzung der sieben oben beschriebenen Kapitel wurden weitere selbstständig verfasste Lehrkapitel gebündelt: Python **Iteratoren und Generatoren**, JavaScript **Promises und Event Loop**, C# **LINQ und verzögerte Auswertung**, C++ **Wertsemantik, Container und Iteratorinvalidierung**, PHP **Exceptions und Fehlergrenzen**, Go **Context und kontrollierte Goroutinen** sowie Kotlin **Coroutines und strukturierte Nebenläufigkeit**. Jede dieser Lerneinheiten enthält vier ausgearbeitete Lehrabschnitte, Codeillustrationen, überprüfbare Verständnisfragen und eine Aufgabe mit Lösungsweg. Sie stehen ohne KI-Laufzeitkosten vollständig offline zur Verfügung.

Die beiden Manuskriptblöcke sind ausdrücklich ein Zwischenstand: Für alle zehn Sprachen ist weiterhin eine wesentlich größere redaktionelle Gesamtproduktion nötig, bevor das Produkt den vereinbarten Fachbuchmaßstab erreichen kann.

## Dritter Manuskriptblock – Inhalte für alle zehn Sprachen

Zusätzlich enthält die gebündelte Buchbibliothek zehn weitere eigenständige Fachkapitel: **Python** Exceptions und Context Manager; **JavaScript** Closures und Module; **TypeScript** generische Constraints und `keyof`; **Java** Klassen, Konstruktoren und Invarianten; **C#** Task und async/await; **C++** Templates und Concepts; **PHP** Klassen, Namespaces und Composer; **Go** Interfaces und Method Sets; **Rust** Traits und Bounds; **Kotlin** Data Classes und Collection-Mutabilität. Diese Kapitel sind vollständige Lerneinheiten mit vier substantiellen Lehrabschnitten, konkreten Codeillustrationen, Transferaufgaben, Musterlösungen und Verständnisfragen; keine vom Nutzer anzustoßende KI-Generierung.

**Fertigstellungsstatus:** Trotz weiterer tatsächlicher Manuskripttexte ist für keine der zehn Sprachen die vollständige Durcharbeitung aller Sprach- und Standardbibliotheksthemen erreicht. Die Kapitel sind keine Ersatzbehauptung für die gesamte Originaldokumentation. Weitere Manuskriptarbeit hat Vorrang; zusätzliche technische Codebeispiel-Testpipelines sind zurückgestellt.

## Python: zusammenhängender Grundlagenblock (Originalmanuskript)

Die Python-Fachbuchausgabe enthält zusätzlich fünf vollständige eigenständige Lehrkapitel: Sequenzen/Tupel/Dictionaries/Sets und Kopiersemantik; Module/Packages/Importzeitpunkt und virtuelle Umgebungen; dataclasses und veränderliche Defaults; typing/Protocols und Runtime-Validierung; pathlib, JSON, Encoding und sichere Dateiverträge. Die Kapitel sind bewusst als fachlich aufbauender Buchblock statt als separate Kleinstbände veröffentlicht. Die primären Quellen sind die entsprechenden offiziellen Python-Tutorial- und Standardbibliotheksreferenzen, deren Adressen in den Kapiteldaten stehen. Die Texte wurden eigenständig formuliert. Stand weiterhin: **Python und alle anderen neun Fachbücher sind noch nicht vollständig**; die separate neue Code-Snippet-Testpipeline bleibt gemäß Nutzerpriorität zurückgestellt.
