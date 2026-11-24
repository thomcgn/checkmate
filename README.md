# CHECKMATE ♚

**Understand the code. Master the craft.**

Checkmate ist eine eigenständige Desktop-Lernsoftware, mit der man Programmierkonzepte verstehen, selbst anwenden und dauerhaft verinnerlichen kann.

## Heute im Entwicklungsstand vorhanden

- **Sprachübergreifende Konzeptbibliothek:** Von Variablen, Listen und Maps bis Generics, Records, Streams, Ownership, Fehlerbehandlung und Nebenläufigkeit.
- **Fertige Offline-Lehrbücher:** Checkmate liefert eigenständig verfasste Buchkapitel und sprachspezifische Beispiele direkt mit der Anwendung aus. Kein ChatGPT-Konto, kein API-Key und keine Modellgenerierung erforderlich.
- **Originaldokumentationen zum Nachschlagen:** Bereits importierte Originalreferenzen für Python, JavaScript, TypeScript, Java, C#, C++, PHP, Go, Rust und Kotlin erscheinen in der Handbuchbibliothek. Dort sind sie ohne Browserwechsel lesbar und durchsuchbar.
- **Vergleich statt bloßer Syntaxübersetzung:** Beispielsweise Java `HashMap`, Python `dict`, Rust `HashMap` und JavaScript `Map` – mit ausdrücklichen Unterschieden bei Semantik und Laufzeitverhalten.
- **Suche und Lernpfad:** Konzeptfilter, Suchbegriffe, Voraussetzungen und Lernstufen.
- **Offline-Nachschlagen:** Die benötigten Erklärungen stehen in Checkmate selbst. Externe Dokumentationen sind nur redaktionelle Quellen, keine Voraussetzung zum Lernen.
- **Eigene Notizen und Lernstand:** Werden in der Desktop-Anwendung lokal gespeichert.
- **Repository Lab:** Öffentliche GitHub-Repositories gezielt prüfen, per ChatGPT-Login begrenzt analysieren und die didaktischen Ergebnisse als lokale Lernbücher wieder öffnen. Die Übertragung erfolgt ausschließlich nach sichtbarer Zustimmung.

**Redaktionelle Lehrbücher**, **Konzeptlektionen** und **importierte Originaldokumentationen** sind getrennte Inhaltsarten. Die Originalreferenzen werden vollständig pro definiertem Quellpaket offline übernommen; zusätzliche Sprach- und Standardbibliothekspakete lassen sich im Einrichtungsbereich installieren. Die inhaltliche Vollständigkeit je Sprache muss paketübergreifend geprüft werden.

## Installation aus dem Quellcode

Voraussetzung: **Node.js 22 LTS** und npm. Unter Arch Linux gegebenenfalls über `fnm` auf Node 22 wechseln. Für die ChatGPT-Anmeldung wird ein sicherer Betriebssystem-Schlüsselbund benötigt.

```bash
npm install
npm run desktop
```

`npm run desktop` baut die Electron-Anwendung und startet sie lokal. Die Bedienoberfläche und die gebündelten Lehrtexte benötigen keinen laufenden Webserver und keine Cloud-KI.

## Offline-Dokumentationsbibliothek

Unter **Dokumentationen einrichten** verwaltest du ausschließlich Downloads und Aktualisierungen. Erfolgreich installierte Dokumentationspakete erscheinen automatisch unter **Originaldokumentationen**. Die Handbuchansicht gruppiert sie nach Sprache und bietet Kapitel-Navigation sowie Suche im lokal gespeicherten Volltext. Der Import speichert Quellstände und prüft Dateien mit SHA-256. Zum Installieren ist Git für Quellarchive und einmalig eine Netzwerkverbindung nötig; die Handbücher sind danach offline nutzbar.

## Repository Lab mit ChatGPT

Das Repository Lab öffnest du in der Seitenleiste. Die Integration verwendet **Sign in with ChatGPT** direkt. Du benötigst keine Codex-CLI und keinen API-Schlüssel. Im Systembrowser meldest du dich an und erlaubst bei entsprechender Berechtigung ausdrücklich die ChatGPT-Plannutzung. Die KI läuft in der Cloud, **keine lokalen KI-Modelle** werden benutzt. Der Zugriff auf Quellcode ist auf öffentliche GitHub-Repositories begrenzt und bleibt lesend; vor dem Versenden siehst du die Auswahl und bestätigst ausdrücklich die Übertragung.

Die erste Version analysiert pro Anfrage eine begrenzte Stichprobe statt alle Commit-Historien. Der Umfang wird sichtbar ausgewiesen. Die Teaching Engine erstellt zuerst Lernziele und einen Lehrplan, danach mehrere Kapitel mit Aufgaben und Musterlösungen. Quellpfade werden gegen die übermittelten Dateien geprüft; eine inhaltliche Verifikation jeder einzelnen Behauptung ist noch nicht implementiert. Lernbücher werden lokal als einzelne, atomar gespeicherte Dateien im App-Datenordner abgelegt. Bestehende Bücher aus `repo-books.json` werden beim ersten Zugriff automatisch übernommen; die alte Datei bleibt als Backup erhalten.

Mehr Details zu Anmeldung, Datenschutz und Grenzen: [Repository Lab](docs/REPOSITORY_LAB.md).

## Vorgefertigte Checkmate-Lehrbücher

Unter **Lehrbücher** findest du die bereits veröffentlichten, eigenständig redaktionell verfassten Inhalte. Die Anwendung liefert diese im Renderer-Bundle direkt aus. Eine Generierung durch die Benutzer, ein Modellkonto und ein Download sind zum Lesen nicht erforderlich. Die Buchkapitel enthalten zusammenhängende Erläuterungen, Lernziele, Codebeispiele, Verständnisfragen mit aufklappbaren Antworten und Transferaufgaben. Sprachspezifische Beispiele werden passend zum Buch ausgewählt. Lokaler Lernfortschritt bleibt beim Neustart erhalten.

**Ausbaustand (redaktionell, nicht KI-generiert):** Java, TypeScript und Rust besitzen nun jeweils **ein zusammenhängendes Fachbuch im Aufbau** mit fünf thematischen Buchteilen und einem langfristigen Inhaltsverzeichnis von mehr als 30 Hauptkapiteln. Die bislang vorhandenen Grundlagen und Vertiefungslektionen sind in diese Gesamtpläne eingeordnet und bleiben offline lesbar. Vier zusätzliche Originalkapitel vertiefen Javas primitive Typen und Operatoren, TypeScripts Typinferenz sowie Rusts skalare und strukturierte Datentypen. Drei weitere fertig geschriebene Kapitel erweitern die Grundlagen um **Java-Schleifen**, **TypeScript-Unions/Narrowing** und **Rust-Pattern-Matching**. **Nur bereits geschriebene Kapitel sind anklickbar.** Unveröffentlichte Kapitel sind sichtbar als solche gekennzeichnet; sie werden nicht als fertig gezählt. Die Veröffentlichung eines vollständigen Buches ist erst zulässig, wenn alle geplanten Kapitel als redaktionelle Inhalte vorliegen und die Qualitätstests erfüllen. Künftige Kapitel werden mit Checkmate-Updates ausgeliefert, niemals erst beim Nutzer über ChatGPT generiert. Vorhandene Lernfortschritte aus den früher getrennten Praxisbänden werden beim Wechsel zur Gesamtbuchansicht übernommen.

**Klare Trennung:** Die optional unter **Originaldokumentationen** installierbaren offiziellen Quellen bleiben Referenzmaterial. Sie werden nicht heimlich an ChatGPT gesendet. **ChatGPT wird ausschließlich im ausdrücklich aktivierten Repository Lab** genutzt, um fremden Quellcode auf Nutzeranforderung zu analysieren. Bereits lokal vorhandene, früher generierte Bücher bleiben im Repository Lab lesbar.

## Entwicklung und Qualität

```bash
npm run check
```

Dieser Aufruf prüft TypeScript, die Inhaltstests und den Renderer-/Electron-Build. Die CI führt diese Prüfungen auf **Linux, Windows und macOS** aus.

Die Oberfläche ist auf barrierefreies, responsives Design ausgelegt: Sprungmarke zum Hauptinhalt, sichtbarer Tastaturfokus, mindestens 44 × 44 Pixel große Bedienelemente, echte Reiter- und Zustandsattribute (`aria-selected`, `aria-expanded`, `aria-pressed`, `aria-current`), per Tastatur erreichbare Scrollbereiche ohne sichtbare Doppel-Scrollbalken sowie ein einspaltiges Reflow bis 320 px bzw. 200 % Zoom. `prefers-reduced-motion`, `prefers-contrast` und Windows High Contrast werden berücksichtigt. `npm run test:ui` prüft diese Eigenschaften zusätzlich mit Playwright.

Technologie: **Electron · React · TypeScript**, streng typisiert. Die vorgefertigten Lehrbuchinhalte sind versionierte Projektdateien, persönliche Notizen und Lernstände liegen derzeit im lokalen App-Speicher. Eine zusätzliche Datenbank ist für die gebündelte Wissensbasis nicht nötig.

## Weitere Entwicklung

Das Repository Lab speichert seine ersten KI-Lernbücher lokal; eine erweiterte Bibliothek mit Kapitelversionen, eine robuste SQLite-Datenbank, ein interaktiver Code-Editor und weitergehende KI-gestützte Lernpfade sind weitere Ausbaustufen. Diese sind noch nicht vollständig implementiert.

Mehr zum redaktionellen Anspruch: [Sprachversionen und Abdeckung](docs/LANGUAGE_COVERAGE.md) · [Qualität und Quellen](docs/CONTENT_REVIEW.md).
