# CHECKMATE ♚

**Understand the code. Master the craft.**

Checkmate ist eine eigenständige Desktop-Lernsoftware, mit der man Programmierkonzepte verstehen, selbst anwenden und dauerhaft verinnerlichen kann.

## Heute im Entwicklungsstand vorhanden

- **Sprachübergreifende Konzeptbibliothek:** Von Variablen, Listen und Maps bis Generics, Records, Streams, Ownership, Fehlerbehandlung und Nebenläufigkeit.
- **Zehn offline lesbare Sprachhandbücher:** Python, JavaScript, TypeScript, Java, C#, C++, PHP, Go, Rust und Kotlin – jeweils mit festgelegter Sprachversion, Erklärung, Beispielcode, Fallstricken, Best Practices und Übung.
- **Vergleich statt bloßer Syntaxübersetzung:** Beispielsweise Java `HashMap`, Python `dict`, Rust `HashMap` und JavaScript `Map` – mit ausdrücklichen Unterschieden bei Semantik und Laufzeitverhalten.
- **Suche und Lernpfad:** Konzeptfilter, Suchbegriffe, Voraussetzungen und Lernstufen.
- **Offline-Nachschlagen:** Die benötigten Erklärungen stehen in Checkmate selbst. Externe Dokumentationen sind nur redaktionelle Quellen, keine Voraussetzung zum Lernen.
- **Eigene Notizen und Lernstand:** Werden in der Desktop-Anwendung lokal gespeichert.

Die Kapiteltexte sind eigenständig für Checkmate geschrieben und keine vollständigen Kopien fremder Sprachreferenzen. Das erste Release bildet einen wachsenden, **kuratierten Lehrbuchkern**, noch nicht jede Standardbibliothek und jeden Spezialfall jeder Sprache ab.

## Installation aus dem Quellcode

Voraussetzung: Node.js 22 oder höher und npm.

```bash
npm install
npm run desktop
```

`npm run desktop` baut die Electron-Anwendung und startet sie lokal. Die Bedienoberfläche und die gebündelten Lehrtexte benötigen keinen laufenden Webserver und keine Cloud-KI.

## Entwicklung und Qualität

```bash
npm run check
```

Dieser Aufruf prüft TypeScript, die Inhaltstests und den Renderer-/Electron-Build. Die CI führt diese Prüfungen auf **Linux, Windows und macOS** aus.

Technologie: **Electron · React · TypeScript**, streng typisiert. Die Handbuchinhalte sind versionierte Projektdateien, persönliche Notizen und Lernstände liegen derzeit im lokalen App-Speicher. Eine zusätzliche Datenbank ist für die gebündelte Wissensbasis nicht nötig.

## Weitere Entwicklung

Eine dauerhafte Bibliothek selbst erzeugter Bücher, eine lokale SQLite-Datenbank für umfangreiche Nutzerdaten, ein interaktiver Code-Editor mit Übungsprüfungen sowie eine offizielle ChatGPT-Anmeldung mit KI-Tutor werden als **separate Funktionen** aufgebaut. Diese Bestandteile werden nicht als bereits implementiert ausgegeben.

Mehr zum redaktionellen Anspruch: [Sprachversionen und Abdeckung](docs/LANGUAGE_COVERAGE.md) · [Qualität und Quellen](docs/CONTENT_REVIEW.md).
