# Repository Lab · Direkte ChatGPT-Anmeldung

## Zweck
Checkmate ist eine eigenständige, nicht agentische Desktop-Lernanwendung. Das Repository Lab erklärt Quellcode, Konzepte und Architektur, führt aber keine fremden Repository-Anweisungen aus und verändert keinen Code.

## Sign in with ChatGPT – ohne Codex
Checkmate verwendet die offiziell dokumentierte **Sign in with ChatGPT**-Schnittstelle für lokale Open-Source-Anwendungen: Browser-OAuth mit dynamischer Client-Registrierung, PKCE, CSRF-State, OIDC-Nonce, JWKS-signierter ID-Token-Prüfung und ausdrücklicher Berechtigung `chatgpt.tokens.use.direct`. Danach zeigt es nur Modelle an, die über das verbundene ChatGPT-Konto ermittelt wurden, und verwendet `POST https://api.openai.com/v1/responses` mit `store:false` und `stream:true`.

**Kein Codex-App-Server, kein Codex-Binary, keine ChatGPT-Konversationsübernahme, kein API-Schlüssel und keine lokale KI.** Die Nutzung eines ChatGPT-Plans ist abhängig von OpenAIs Freigabe, dem individuellen Kontingent und der ausdrücklichen Zustimmung im Anmeldedialog. Sie ist nicht unbegrenzt.

1. Checkmate starten, Repository Lab öffnen.
2. **Mit ChatGPT anmelden** auswählen, im Systembrowser Konto und Planberechtigung bestätigen.
3. Das verfügbare Modell auswählen. Falls kein Modell erscheint, Berechtigung oder Kontingent prüfen.
4. Öffentliches GitHub-Repository eingeben, Dateien prüfen und vor Übermittlung ausdrücklich zustimmen.
5. Lernanalyse starten. Das vollständige Ergebnis wird lokal gespeichert, wenn der Stream erfolgreich mit `response.completed` endet.

Der erste Login erfordert eine neue Zustimmung: Frühere Codex-Anmeldungen werden aus Sicherheitsgründen nicht übernommen.

## Geheimnisse und sichere Speicherung
- Host-ID getrennt von den Tokens unter Electron `userData/chatgpt`.
- OAuth-Tokens sind ausschließlich im Electron-Hauptprozess zugänglich und werden vor dem Speichern mit Electron `safeStorage` verschlüsselt.
- Kein Klartext-Fallback: Unter Linux wird das unsichere `basic_text`-Backend ausdrücklich abgelehnt; aktiviere einen funktionierenden Systemschlüsselbund wie KWallet oder GNOME Keyring.
- Keine OAuth-Tokens in Renderer, LocalStorage, GitHub, Protokollen oder Diagnoseausgaben.
- Der Redirect-Listener bindet ausschließlich an `127.0.0.1` und prüft Host, Callback-Pfad und State.
- Sign-out löscht lokale Tokens. Nach einer Trennung über die ChatGPT-Einstellungen kann die Remote-Berechtigung ebenfalls entzogen werden.

## Grenzen der gegenwärtigen Repository-Erfassung
Das Analysemodul verarbeitet bisher **höchstens 16 ausgewählte Dateien** pro Anfrage, bis zu 32 KiB pro Datei und davon die ersten 5.000 Zeichen. Die Auswahl ist eine Stichprobe. Checkmate meldet diese Begrenzung und beansprucht **keine vollständige Analyse** eines großen Projekts. Der umfassende lokale Index und mehrstufige Analysen sind ein eigener ausstehender Ausbau.

Quellcode ist nicht vertrauenswürdig; er wird als Lernmaterial interpretiert, nicht als Promptanweisung oder ausführbares Skript. Geheimnisfilter minimieren Risiken, ersetzen aber keine eigene Prüfung vor dem Senden.

## Qualität und Überprüfung
Die automatisierten Tests prüfen PKCE-nahe Protokollbausteine, Modellfilterung, Streamverarbeitung sowie die Electron-Oberfläche mit simuliertem Transport. TypeScript und Builds werden unter Linux, Windows und macOS geprüft. Die **echte OAuth-Autorisierung und Inferenz** müssen mit einem zugelassenen ChatGPT-Konto lokal getestet werden; CI kann diese persönliche Freigabe nicht simulieren.

### Offizielle Referenzen
- https://developers.openai.com/siwc/token-sharing-open-source/sign-in
- https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference
- https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions
- https://developers.openai.com/siwc/token-sharing-open-source/errors-and-recovery
