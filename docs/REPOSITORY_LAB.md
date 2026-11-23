# Repository Lab · ChatGPT-gestütztes Lernen

## Zweck

Repository Lab ist ein *lesendes* Lernwerkzeug, kein autonomer Coding-Agent. Die KI erklärt ausgewählte reale Codeausschnitte, inklusive Architektur, Konzepte, Trade-offs, Übungen und Musterlösungen. Die lokale Konzeptbibliothek bleibt unabhängig nutzbar.

## ChatGPT-Login

In dieser ersten Integration nutzt Checkmate die **offizielle Codex-App-Server-Schnittstelle** als lokale Brücke zum cloudbasierten ChatGPT-Konto. Die CLI wird nur als Authentifizierungs- und Protokoll-Client ausgeführt, **kein KI-Modell lokal**.

1. Installiere die offizielle Codex CLI: https://developers.openai.com/codex/cli
2. Starte Checkmate über `npm run desktop`.
3. Öffne **Repository Lab** und klicke **Mit ChatGPT anmelden**.
4. Der systemeigene Browser übernimmt den OAuth-Login. Kehre danach zurück und klicke **Prüfen**.
5. Wähle ein *öffentliches* GitHub-Repository und klicke **Repository prüfen**.
6. Prüfe die Dateiliste und aktiviere die ausdrückliche Zustimmung zur Codeübermittlung.
7. Mit **Lehrkapitel erstellen** wird ChatGPT aufgerufen. Das Ergebnis bleibt lokal als Lernbuch gespeichert.

Ein bereits über die Codex CLI angemeldetes ChatGPT-Konto kann erneut verwendet werden. API-Keys, Drittanbieter-Modelle oder lokale Ollama-Instanzen sind für Checkmate nicht vorgesehen.

**Einschränkung:** OpenAI empfiehlt für neue Open-Source-Apps inzwischen die direkte *Sign in with ChatGPT*-Anbindung, bei der ChatGPT-Planberechtigungen ausdrücklich genehmigt und angezeigt werden. Codex-App-Server-Login ist ein dokumentierter lokaler Übergangsweg; eine spätere Migration soll den Anbieter hinter einer austauschbaren Schnittstelle ersetzen. Die Anmeldung garantiert kein unbegrenztes Inferenzkontingent.

Quellen: https://learn.chatgpt.com/docs/app-server · https://developers.openai.com/siwc/token-sharing-open-source

## Vertrauen und Datenschutz

- Nur **öffentliche GitHub-Repositories**, per GitHub-API und festem Commit-SHA gelesen. Es erfolgt kein Clone, Build oder Ausführen von Quellcode.
- Maximal **16 ausgewählte Quelldateien** pro Analyse. Jede Datei maximal 32 KiB; maximal die ersten 5.000 Zeichen werden als Text übermittelt. Eine vollständige Repository-Erfassung wird **nicht** suggeriert.
- Lockfiles, Build-Ausgaben, .env- und typische Secret-/Key-Dateien werden herausgefiltert. Zeilen mit möglicherweise geheimen Zuweisungen werden vor dem Prompt maskiert. Diese Maßnahmen ersetzen **keine manuelle Prüfung**.
- Die Anwendung zeigt die Dateipfade an und erfordert eine separate Zustimmung vor jeder Analyse.
- Die App-Server-Protokollbrücke gibt **keine** Schreib- oder Ausführungsfreigaben; das Modell wird angewiesen, Quelle als unvertrauenswürdige Daten zu behandeln. Der Codex-Prozess wird in einem eigenen temporären Arbeitsverzeichnis gestartet.
- OAuth-Tokens werden nicht in den Electron-Renderer gegeben oder von Checkmate selbst ausgelesen. Sie werden von der offiziellen Codex CLI verwaltet.
- Bücher liegen lokal im benutzerspezifischen App-Datenordner als `repo-books.json`, nicht in einer Cloud-Datenbank. Bereits gespeicherte Bücher sind ohne Login lesbar.
- Die erste Version besitzt noch keine Multi-Commit-Analyse, automatische semantische Vollabdeckung, KI-basierte Bewertung echter Aufgabenlösungen oder fortlaufenden Projektindex.

## Funktion und Qualitätssicherung

- GitHub-Repository-Parsing, Ausschlussfilter und Sampling sind eigenständig getestet.
- Der IPC-Zugang ist an Checkmates Renderer gebunden; Node-Integration im Renderer ist deaktiviert.
- TypeScript, Unit-Tests und Build werden durch CI unter Linux, macOS und Windows geprüft.
- Ein wirklicher Login-/Inferenztest erfordert eine lokale Codex-Installation und Nutzerzustimmung. Ohne diese Faktoren gilt eine erfolgreiche CI nicht als bestätigte Cloud-KI-Verbindung.
