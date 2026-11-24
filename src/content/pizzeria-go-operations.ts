import type {BeginnerBook,BeginnerChapter,BeginnerWord,BeginnerStage} from './pizzeria-book.ts';
import {validateGoBook} from './pizzeria-go-book.ts';

/**
 * Band 2 in Go: aus dem Übungsprogramm wird eine Anwendung, die man anderen geben kann.
 *
 * Pragmatische Stack-Entscheidung (Begründung in docs/GO_PIZZERIA_BOOK.md):
 * - HTTP/JSON/Sessions/Logs/Tests: nur die Go-Standardbibliothek
 *   (net/http, encoding/json, database/sql, log/slog, net/http/httptest, testing).
 * - Datenbank: database/sql mit einem echten, reinen Go-Treiber (modernc.org/sqlite).
 *   Für die Migration wird ein versionsverwalteter SQL-Ordner selbst angewendet.
 * - Passwörter: golang.org/x/crypto/bcrypt als bewährte, externe Bibliothek.
 * - DI/Rollen: explizites Verdrahten in main und Middleware statt Spring-Container.
 * - Auslieferung: go build, GitHub Actions, mehrstufiges Dockerfile, Umgebungsvariablen.
 */
const stage=(id:string,title:string,goal:string):BeginnerStage=>({id,title,goal});
const word=(term:string,definition:string):BeginnerWord=>({term,definition});
const chapter=(id:string,stageId:string,title:string,minutes:number,problem:string,natural:string,pseudo:string,
 objectives:readonly string[],conceptIds:readonly string[],explain:readonly string[],code:string,output:string,
 tryIt:string,misconception:string,solution:string,wordbank:readonly BeginnerWord[],sourceUrl:string):BeginnerChapter=>
 ({id,stage:stageId,title,minutes,problem,rule:{natural,pseudo},objectives,conceptIds,explain,code,output,tryIt,
  misconception,solution,wordbank,sourceUrl});

export const PIZZERIA_GO_OPERATIONS_BOOK:BeginnerBook={
 title:'Die Pizzeria geht in Betrieb – Go-Ausgabe',
 subtitle:'Band 2: Datenbank, Anmeldung, Fehler, Tests und Auslieferung mit Go',
 audience:'Für alle, die den Go-Band 1 gelesen haben und ihren Laden jetzt wirklich betreiben wollen.',
 scenario:'Deine Go-Pizzeria läuft auf deinem Rechner. Jetzt soll sie auch nach dem Neustart funktionieren, Gäste erkennen und Fehler verständlich melden.',
 stages:[
  stage('persist','Stufe 1 · Der Laden bleibt offen','Daten überleben den Neustart – von der Datei bis zur Datenbank.'),
  stage('auth','Stufe 2 · Wer darf was?','Anmeldung, Passwörter, Rollen und ein sicheres Armband.'),
  stage('robust','Stufe 3 · Wenn etwas schiefgeht','Fehler, Prüfung, Wiederholung und ein Tagebuch für den Laden.'),
  stage('testing','Stufe 4 · Automatisch prüfen','Tests, die jeden Morgen laufen – auch ohne dich.'),
  stage('delivery','Stufe 5 · Ausliefern','Die Pizzeria in einer Kiste, mit Geheimnissen außerhalb des Codes.'),
  stage('frontend','Stufe 6 · Das Gesicht','Ein kleines Fenster für Gäste und der erste echte Gast.')
 ],
 chapters:[
  chapter('after-restart','persist','Nach dem Neustart ist das Regal leer',10,
   'Du machst den Rechner aus und wieder an. Die Pizzen sind weg. Im Arbeitsspeicher war alles nur vorübergehend.',
   'WENN Daten auch morgen noch da sein sollen, DANN schreibe sie auf die Festplatte. SONST sind sie nach dem Neustart weg.',
   'os.WriteFile("bestand.txt", ...)',
   ['Du verstehst den Unterschied zwischen Speicher und Festplatte.','Du kannst einen Wert in eine Datei schreiben.'],
   ['errors','ownership'],[
   'Band 1 hat alles im Arbeitsspeicher gehalten. Das ist wie ein Zettel, den du nach Ladenschluss wegwirfst. Am nächsten Morgen weißt du nichts mehr.',
   'Eine Datei ist ein Zettel, den du in eine Schublade legst. In Go schreibt `os.WriteFile` Text auf die Festplatte. Der dritte Wert, `0644`, sagt, wer die Datei lesen darf.',
   'Für echte Anwendungen reicht eine Textdatei bald nicht mehr. Aber sie zeigt das Grundprinzip: Zustand muss irgendwo dauerhaft liegen.'
  ],'os.WriteFile("bestand.txt", []byte("Salami=3\\n"), 0644)','Datei bestand.txt mit Salami=3',
   'Schreibe eine zweite Zeile für Käse in dieselbe Datei. Was steht dann drin?',
   'Ein Programm merkt sich Variablen nur, solange es läuft. Die Festplatte bleibt auch nach dem Ausschalten erhalten.',
   'Die Datei enthält zwei Zeilen: Salami=3 und Käse=5 – genau das, was du hingeschrieben hast.',
   [word('Persistenz','Daten speichern, sodass sie auch nach dem Neustart vorhanden sind.'),word('Datei','Ein gespeicherter Zettel auf der Festplatte.')],
   'https://pkg.go.dev/os'),

  chapter('json-file','persist','Ein Zettel, den der Computer lesen kann',10,
   'Deine Datei hat "Salami=3" drin. Ein anderes Programm kann das nicht gut lesen. Du brauchst ein gemeinsames Format.',
   'WENN Programme Daten austauschen, DANN benutzen sie ein gemeinsames Format wie JSON.',
   '{"zutat":"Salami","menge":3}',
   ['Du kennst JSON als lesbares Datenformat.','Du verstehst, warum Tags die Feldnamen festlegen.'],
   ['contracts','records'],[
   'JSON sieht aus wie ein kleiner Zettel mit Beschriftung: `"zutat": "Salami"` und `"menge": 3`. Der Name steht immer neben dem Wert.',
   'Ein Go-Struct passt perfekt dazu. Die Anhänge in den Anführungszeichen heißen Tags: `json:"zutat"` sagt `encoding/json`, wie das Feld draußen heißt. Ohne Tag würde Go "Zutat" schreiben.',
   'WENN ein anderes Programm deine Daten lesen soll, DANN gib ihnen feste Namen. SONST rät es, was "3" bedeutet.'
  ],'type Bestand struct {\n    Zutat string `json:"zutat"`\n    Menge int    `json:"menge"`\n}\ndata, _ := json.Marshal(Bestand{"Salami", 3})','{"zutat":"Salami","menge":3}',
   'Ändere die Menge auf 4. Wie sieht das JSON aus?',
   'JSON ist kein Go-Code. Es ist nur Text – den Go mit encoding/json lesen und schreiben kann.',
   '{"zutat":"Salami","menge":4}. Nur der Wert hinter menge hat sich geändert.',
   [word('JSON-Tag','Die Anmerkung am Struct-Feld, die den Namen im JSON festlegt.'),word('Marshal','Go-Daten in JSON-Text verwandeln.')],
   'https://pkg.go.dev/encoding/json'),

  chapter('database','persist','Ein Regal, das nicht vergisst',11,
   'Deine Datei wird größer und du suchst eine einzelne Zutat ewig. Du brauchst ein Regal mit schneller Suche.',
   'WENN du viele Daten schnell finden willst, DANN benutze eine Datenbank.',
   'SELECT menge FROM zutat WHERE name = ?',
   ['Du verstehst eine Datenbank als durchsuchbares Regal.','Du kennst eine einfache SQL-Abfrage mit Platzhalter.'],
   ['key-value'],[
   'Eine Datenbank ist wie ein sehr ordentliches Regal mit einem Register. Du fragst nicht „Zeig mir alle Fächer", sondern „Gib mir Salami".',
   'Diese Frage heißt SQL. `SELECT` bedeutet „zeige mir", `WHERE` bedeutet „nur wo …". Das Fragezeichen ist ein Platzhalter – so bleiben Gäste-Namen sicher.',
   'In Go nutzt du `database/sql`. Das Paket bringt selbst keinen Treiber mit; du registrierst einen echten, zum Beispiel den reinen Go-Treiber `modernc.org/sqlite`.'
  ],'db, _ := sql.Open("sqlite", "pizzeria.db")\nvar menge int\nerr := db.QueryRow("SELECT menge FROM zutat WHERE name = ?", "Salami").Scan(&menge)\nfmt.Println(menge)','3',
   'Schreibe eine Abfrage für Käse. Was änderst du?',
   'SQL ist keine Go-Funktion. Du schreibst eine Frage an die Datenbank, nicht eine Anweisung an dein Programm.',
   'Du ersetzt "Salami" durch "Käse". Alles andere bleibt gleich.',
   [word('Datenbank','Ein dauerhaftes Regal, in dem du Daten schnell wiederfindest.'),word('SQL','Die Sprache, in der man Datenbanken fragt.')],
   'https://pkg.go.dev/database/sql'),

  chapter('jpa-entity','persist','Eine Karte für die Datenbank',11,
   'Du willst in Go mit Zutaten arbeiten, nicht mit SQL-Zeilen. Es wäre schön, wenn eine Zeile einfach in deine Datenkarte wandert.',
   'WENN du eine Datenbankzeile lesen willst, DANN scanne sie in ein Struct.',
   'row.Scan(&z.Name, &z.Menge)',
   ['Du verstehst ein Struct als Datenkarte mit Ausweis.','Du erkennst, dass der Primary Key in SQL steht.'],
   ['records','key-value'],[
   'Ein Struct ist eine Go-Karte, die zu einem Datenbankfach passt. Go hat kein `@Entity`: Du schreibst das Struct selbst und sagst in `Scan`, welche Spalte in welches Feld kommt.',
   'Der Ausweis ist in der Datenbank der Primary Key, zum Beispiel `name VARCHAR(50) PRIMARY KEY`. Zwei Salami-Karten darf es nicht geben.',
   'Wichtig: `database/sql` liest keine Struct-Tags. Die Reihenfolge in `Scan` ist deine Übersetzung zwischen Datenbank und Go.'
  ],'type Zutat struct{ Name string; Menge int }\nvar z Zutat\nerr := db.QueryRow("SELECT name, menge FROM zutat WHERE name = ?", "Salami").Scan(&z.Name, &z.Menge)\nfmt.Println(z)','{Salami 3}',
   'Welches Feld ist der Ausweis deiner Karte?',
   'Ohne Primary Key weiß die Datenbank nicht, wie sie zwei Karten unterscheiden soll. Ein Tag ersetzt das nicht.',
   'Das Feld `Name` ist der Ausweis. Über den Namen findest du die Zutat wieder.',
   [word('Struct','Eine Go-Datenkarte mit benannten Feldern.'),word('Primary Key','Das Feld, das eine Zeile eindeutig macht.')],
   'https://pkg.go.dev/database/sql#Row.Scan'),

  chapter('repository','persist','Der Regalmeister fragt die Datenbank',10,
   'Du willst nach Salami fragen, ohne überall SQL zu schreiben. Der Regalmeister soll das für dich erledigen.',
   'WENN du Daten aus der Datenbank holen willst, DANN frag das Regal-Interface.',
   'Menge(name string) (int, error)',
   ['Du verstehst ein Repository als Datenzugriff.','Du kannst ein kleines Interface selbst schreiben.'],
   ['key-value','contracts'],[
   'Band 1 hatte eine Map im Regal. Jetzt übernimmt ein eigener Typ die Arbeit: Er kennt die Datenbank und liefert die gesuchte Menge.',
   'Go hat kein Spring Data, das Methoden automatisch zu SQL macht. Du schreibst die Abfrage selbst – dafür ist sie sichtbar und prüfbar.',
   'WENN die Küche Zutaten braucht, DANN fragt sie das Interface – nie die Datenbank direkt. So bleibt die Arbeit geteilt.'
  ],'type Regal interface {\n    Menge(name string) (int, error)\n}\n// sqlRegal erfüllt es, in-memory-Regal auch.',
   '(Salami → 3, fehlt → error)',
   'Was passiert, wenn es die Zutat nicht gibt?',
   'Ein Repository ist keine Liste. In Go bekommst du einen error zurück, den der Aufrufer prüfen muss.',
   'Du erhältst 0 und einen error. Der Aufrufer entscheidet, ob er „nachbestellen" sagt.',
   [word('Repository','Der Typ, der dir Daten aus der Datenbank holt.'),word('Interface','Die kleine Methode, über die du fragst.')],
   'https://go.dev/doc/effective_go#interfaces'),

  chapter('migration','persist','Neues Fach im Regal',10,
   'Du willst später auch den Preis einer Zutat speichern. Die alte Tabelle hat dafür kein Fach.',
   'WENN sich die Daten ändern, DANN schreibe eine Migration – keine handwerkliche Änderung zwischendurch.',
   'ALTER TABLE zutat ADD COLUMN preis INT',
   ['Du verstehst Migrationen als geplante Umbauten.','Du erkennst, warum alte Daten erhalten bleiben.'],
   ['contracts','errors'],[
   'Stell dir vor, das Regal hat schon 20 Zutaten. Du kannst es nicht einfach wegwerfen. Du baust ein neues Fach ein – die alten Zettel bleiben liegen.',
   'Go bringt kein Migration-Werkzeug mit. Eine pragmatische Variante: SQL-Dateien mit Nummern im Ordner `migrations/` ablegen und beim Start in einer Tabelle merken, welche schon liefen.',
   'WENN du ein Feld hinzufügst, DANN schreibst du eine neue Datei. SONST weiß dein Rechner von gestern nichts mehr. Ein fertiges Werkzeug wäre golang-migrate.'
  ],'data, err := os.ReadFile("migrations/001_preis.sql")\n_, err = db.Exec(string(data))\n// VERSIONEN in schema_migration merken',
   'Neues Feld preis mit 0 bei alten Zutaten',
   'Warum ist der Standardwert 0 wichtig?',
   'Alte Datensätze haben das neue Feld noch nicht. Ohne Standardwert bleiben sie leer und alles könnte kaputtgehen.',
   'Weil alte Zutaten sonst keinen Preis hätten. Mit 0 kannst du trotzdem rechnen.',
   [word('Migration','Ein geplanter, gespeicherter Umbau der Datenbank.'),word('Standardwert','Der Wert, den neue Felder am Anfang bekommen.')],
   'https://github.com/golang-migrate/migrate'),

  chapter('login','auth','Der Gast meldet sich an',10,
   'Dein Laden soll wissen, wer gerade bestellt. Dazu gibt der Gast seinen Namen und ein Passwort ein.',
   'WENN ein Gast sich anmeldet, DANN prüfe Name und Passwort. SONST bleibt er ein Unbekannter.',
   'POST /login {name, passwort}',
   ['Du verstehst Anmeldung als Identitätsprüfung.','Du kennst den Unterschied zwischen Gast und Unbekanntem.'],
   ['contracts','errors'],[
   'Anmelden heißt: Der Gast sagt, wer er ist, und beweist es mit einem Passwort. Dein Programm vergleicht beides über das Regal.',
   'Solange niemand angemeldet ist, darf die Anwendung nur öffentliche Seiten zeigen – zum Beispiel die Speisekarte.',
   'WENN die Prüfung klappt, DANN darf der Gast bestellen. SONST bleibt er auf der Gästeseite.'
  ],'name, pass := r.FormValue("name"), r.FormValue("passwort")\nif !regal.PasswortStimmt(r.Context(), name, pass) {\n    http.Error(w, "Unbekannt", http.StatusUnauthorized)\n    return\n}\nfmt.Fprintln(w, "Angemeldet: "+name)','Angemeldet: Mia',
   'Welche Seite darf ein unbekannter Gast sehen?',
   'Anmelden ist nicht dasselbe wie registrieren. Hier prüfst du einen schon bekannten Gast.',
   'Nur öffentliche Seiten wie die Speisekarte. Bestellen darf er erst nach der Anmeldung.',
   [word('Anmeldung','Das Prüfen, ob ein Gast wirklich der ist, der er vorgibt.'),word('Identität','Wer eine Person wirklich ist.')],
   'https://pkg.go.dev/net/http#Request.FormValue'),

  chapter('password','auth','Das Passwort darf nicht auf einem Zettel stehen',11,
   'Du willst Passwörter speichern. Wenn du sie einfach in die Datenbank schreibst, kann jeder sie lesen.',
   'WENN du ein Passwort speicherst, DANN speichere nur einen verschlüsselten Abdruck. SONST kann es jeder lesen.',
   'bcrypt.GenerateFromPassword(...)',
   ['Du verstehst, warum Passwörter nie im Klartext stehen.','Du kennst einen Hash als Einweg-Abdruck.'],
   ['errors','contracts'],[
   'Ein Hash ist wie ein Fingerabdruck: Du kannst ihn prüfen, aber nicht daraus das Original nachbauen. Bei jeder Anmeldung wird das eingegebene Passwort neu gehasht und verglichen.',
   'Zwei gleiche Passwörter können trotzdem verschiedene Hashes haben – das ist gut so, denn es erschwert das Raten.',
   'WENN du ein Passwort speicherst, DANN benutze eine bewährte Bibliothek. In Go ist das `golang.org/x/crypto/bcrypt`. SONST machst du einen gefährlichen Fehler.'
  ],'hash, _ := bcrypt.GenerateFromPassword([]byte("geheim"), bcrypt.DefaultCost)\nok := bcrypt.CompareHashAndPassword(hash, []byte("geheim")) == nil\nfmt.Println(ok)','true',
   'Warum speicherst du nicht das Passwort selbst?',
   'Ein Hash ist kein Verschlüsseln mit Schlüssel. Du kannst ihn nicht wieder zurückverwandeln – genau das ist der Punkt.',
   'Weil sonst jeder, der die Datenbank liest, das Passwort kennt. Der Hash verrät es nicht.',
   [word('Hash','Ein Einweg-Abdruck eines Passworts.'),word('bcrypt','Eine bewährte Bibliothek zum Hashen und Prüfen von Passwörtern.')],
   'https://pkg.go.dev/golang.org/x/crypto/bcrypt'),

  chapter('roles','auth','Gast, Küche, Chef',11,
   'Ein Gast darf bestellen, die Küche darf kochen, nur der Chef darf Preise ändern. Alle drei nutzen dieselbe Anwendung.',
   'WENN eine Aufgabe gefährlich ist, DANN darf sie nur eine bestimmte Rolle ausführen.',
   'nurChef(next)',
   ['Du verstehst Rollen als Rechtebündel.','Du kannst eine Middleware als Wächter schreiben.'],
   ['contracts','errors'],[
   'Eine Rolle ist wie ein Abzeichen: Gast, Küche oder Chef. Die Anwendung schaut auf das Abzeichen, bevor sie eine Aufgabe erlaubt.',
   'In Go wickelst du den Handler in eine Middleware. Sie prüft die Rolle im Context und ruft den nächsten Schritt nur bei Erfolg.',
   'WENN jemand eine geschützte Aufgabe aufruft, DANN prüft die Middleware die Rolle. SONST wird die Anfrage abgelehnt.'
  ],'func nurChef(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        if !istChef(r) { http.Error(w, "Nein", http.StatusForbidden); return }\n        next.ServeHTTP(w, r)\n    })\n}','Nur für Chef aufrufbar',
   'Was passiert, wenn ein Gast diese Methode aufruft?',
   'Eine Rolle schützt nicht nur die Oberfläche. Die Middleware sitzt am Eingang der geschützten Aufgabe.',
   'Die Middleware lehnt die Anfrage ab. Der Preis bleibt unverändert.',
   [word('Middleware','Eine Hülle um einen Handler, die vorher etwas prüft.'),word('Autorisierung','Das Prüfen, ob jemand etwas darf.')],
   'https://pkg.go.dev/net/http#Handler'),

  chapter('session','auth','Der Gast bekommt ein Armband',10,
   'Nach der Anmeldung vergisst die Anwendung den Gast bei jeder neuen Anfrage wieder. Du brauchst ein Armband, das ihn erkennt.',
   'WENN ein Gast angemeldet ist, DANN merke es dir für die nächsten Anfragen.',
   'Set-Cookie: session=abc123',
   ['Du verstehst eine Session als Merkzettel für den Besuch.','Du kennst ein Cookie als kleines Armband im Browser.'],
   ['contracts'],[
   'Der Browser bekommt ein kleines Armband – ein Cookie. Bei jeder neuen Anfrage zeigt er es vor, und die Anwendung weiß wieder, wer da ist.',
   'Die Session selbst liegt auf dem Server, zum Beispiel in einer Map. Im Cookie steht nur eine Nummer, die darauf verweist – wie eine Garderobenmarke.',
   'WENN der Gast etwas bestellen will, DANN prüft die Anwendung das Armband. SONST gilt er als unbekannt.'
  ],'id := zufallstoken()\nsessions[id] = "Mia"\nhttp.SetCookie(w, &http.Cookie{Name: "session", Value: id, HttpOnly: true})','Set-Cookie: session=abc123',
   'Wo liegt der Name des Gastes – im Browser oder auf dem Server?',
   'Ein Cookie ist kein Passwort und keine Datenbank. Es ist nur die Marke für die Garderobe.',
   'Auf dem Server in der Session-Map. Der Browser trägt nur die Nummer dazu.',
   [word('Session','Ein Merkzettel auf dem Server für die Dauer eines Besuchs.'),word('Cookie','Ein kleines Armband im Browser mit der Session-Nummer.')],
   'https://pkg.go.dev/net/http#SetCookie'),

  chapter('logout','auth','Am Ende geht das Armband zurück',9,
   'Der Gast geht nach Hause. Der nächste Mensch am selben Rechner soll nicht seine Bestellungen sehen.',
   'WENN ein Gast sich abmeldet, DANN ungültig mache seine Session. SONST kann jemand anderes sie benutzen.',
   'delete(sessions, id)',
   ['Du verstehst Abmelden als Aufräumen.','Du erkennst, warum Session-Daten nicht ewig leben dürfen.'],
   ['contracts','ownership'],[
   'Abmelden klingt unwichtig, ist aber sicherheitstechnisch entscheidend. Du gibst das Armband zurück und die Garderobe wirft den Zettel weg.',
   'Danach darf der Browser die alte Nummer noch zeigen – sie führt aber zu nichts mehr. Der Gast ist wieder unbekannt.',
   'WENN ein Gast geht, DANN räume auf. SONST wird sein Platz von jemandem übernommen.'
  ],'delete(sessions, cookie.Value)\nhttp.SetCookie(w, &http.Cookie{Name: "session", Value: "", MaxAge: -1})','Session ist ungültig',
   'Was passiert nach dem Abmelden bei einer alten Anfrage?',
   'Abmelden löscht nicht die Datenbank. Es beendet nur die Zugehörigkeit des Gastes.',
   'Die alte Session gilt nicht mehr. Die Anwendung behandelt die Anfrage als unbekannt.',
   [word('Abmelden','Die Session beenden, damit niemand sie weiterbenutzen kann.'),word('ungültig','Nicht mehr erlaubt oder gültig.')],
   'https://pkg.go.dev/net/http#Cookie'),

  chapter('error-contract','robust','Höfliche Fehler für alle',10,
   'Die Salami fehlt. Der Gast sieht eine technische Meldung mit Go-Wörtern. Das versteht niemand.',
   'WENN etwas schiefgeht, DANN antworte mit einer klaren, festen Meldung. SONST rät der Gast.',
   '{"fehler":"Salami fehlt im Regal"}',
   ['Du verstehst einen Fehlervertrag als feste Antwortform.','Du kannst einen error in eine verständliche Meldung übersetzen.'],
   ['errors','contracts'],[
   'Ein Fehlervertrag ist wie ein einheitliches Formular: Immer steht dort, was passiert ist – in Alltagssprache und im selben Format.',
   'Intern darf dein Programm einen error zurückgeben. Nach außen gibt es JSON mit einem `fehler`-Feld. Der Gast sieht keinen Code.',
   'WENN intern etwas schiefgeht, DANN fange es ab und antworte höflich. SONST sieht der Gast den Fehler direkt.'
  ],'type Fehler struct{ Meldung string }\nfunc (f Fehler) Error() string { return f.Meldung }\njson.NewEncoder(w).Encode(map[string]string{"fehler": err.Error()})','{"fehler":"Salami fehlt im Regal"}',
   'Warum solltest du die technische Meldung nicht direkt zeigen?',
   'Ein Fehlervertrag ändert nicht den Fehler, sondern nur die Art, wie du ihn nach außen zeigst.',
   'Weil sie für Gäste unverständlich und manchmal sogar gefährlich ist. Die höfliche Meldung sagt das Nötige.',
   [word('Fehlervertrag','Eine feste Form für Fehlermeldungen, die alle verstehen.'),word('error','Ein Go-Wert mit Error(), den du nach außen übersetzen kannst.')],
   'https://go.dev/blog/error-handling-and-go'),

  chapter('validation','robust','Prüfen, bevor es in die Küche geht',10,
   'Ein Gast bestellt „minus drei Pizzen". Die Küche weiß nicht, was sie tun soll. Du musst die Bestellung vorher prüfen.',
   'WENN Daten in die Anwendung kommen, DANN prüfe sie zuerst. SONST arbeitet die Küche mit Unsinn.',
   'WENN anzahl < 1 ODER name leer: ablehnen',
   ['Du verstehst Validierung als Eingangskontrolle.','Du kannst Regeln wie "mindestens 1" festlegen.'],
   ['errors','contracts'],[
   'Validierung ist wie ein Türsteher: Er lässt nur gültige Bestellungen hinein. Negativzahlen oder leere Namen kommen gar nicht erst in die Küche.',
   'Go hat keine Annotations wie `@Min`. Du schreibst die Prüfung ein paar Zeilen direkt in den Handler – kurz und sichtbar.',
   'WENN die Prüfung scheitert, DANN antwortest du mit einem klaren Fehler. SONST gibst du ungültige Daten weiter.'
  ],'if anzahl < 1 || pizza == "" {\n    http.Error(w, "anzahl >= 1 und pizza nicht leer", http.StatusBadRequest)\n    return\n}','Ungültige Bestellung wird abgelehnt',
   'Welche Regel brauchst du für den Pizza-Namen?',
   'Validierung prüft die Form der Daten, nicht ob die Pizza im Regal ist. Das kommt danach.',
   'Der Name darf nicht leer sein. Zusammen mit anzahl >= 1 ist die Bestellung gültig.',
   [word('Validierung','Das Prüfen von Daten, bevor sie weiterverarbeitet werden.'),word('Status 400','Der HTTP-Code für eine schlechte Anfrage.')],
   'https://pkg.go.dev/net/http#StatusBadRequest'),

  chapter('retry','robust','Der Lieferant ist gerade nicht erreichbar',11,
   'Deine Anwendung fragt einen Lieferanten. Kurz ist das Netz weg. Beim ersten Fehler willst du nicht gleich aufgeben.',
   'WENN eine Anfrage kurz scheitert, DANN versuche es noch einmal mit einer Pause. SONST bricht der Laden ab.',
   'WENN Fehler: warte kurz, versuche erneut',
   ['Du verstehst Wiederholung als Schutz vor vorübergehenden Fehlern.','Du kennst eine Pause zwischen Versuchen.'],
   ['errors','async'],[
   'Nicht jeder Fehler ist dauerhaft. Wenn der Lieferant gerade telefoniert, hilft eine zweite Anfrage nach kurzer Zeit.',
   'Du schreibst eine kleine Schleife: probieren, kurz warten, noch mal probieren. Nach drei Versuchen gibst du den Fehler zurück.',
   'WENN der Fehler verschwindet, DANN läuft alles weiter. SONST bekommst du eine verständliche Meldung.'
  ],'for i := 0; i < 3; i++ {\n    antwort, err := lieferant.Fragen(ctx)\n    if err == nil { return antwort, nil }\n    time.Sleep(200 * time.Millisecond)\n}','Nach maximal drei Versuchen eine Antwort',
   'Warum nicht unendlich oft versuchen?',
   'Wiederholen ist kein Heilmittel für falsche Daten. Wenn etwas dauerhaft kaputt ist, musst du es melden.',
   'Sonst hängt die Anwendung für immer. Nach drei Versuchen ist die Information „nicht erreichbar" ehrlicher.',
   [word('Wiederholung','Ein Fehler wird noch einmal versucht, meist nach einer kurzen Pause.'),word('vorübergehend','Nur kurzzeitig – nicht für immer.')],
   'https://pkg.go.dev/time#Sleep'),

  chapter('logging','robust','Ein Tagebuch für den Laden',10,
   'Am Morgen sagt jemand: „Gestern um 18 Uhr war die Bestellung falsch." Du weißt nichts mehr – es gab kein Tagebuch.',
   'WENN etwas im Betrieb passiert, DANN schreibe eine kurze Notiz mit Zeitpunkt. SONST kannst du es später nicht nachvollziehen.',
   'slog.Info("Bestellung", "pizza", pizza)',
   ['Du verstehst Logging als Tagebuch der Anwendung.','Du kannst eine Information mit Stufe und Zeitstempel festhalten.'],
   ['errors','contracts'],[
   'Ein Log ist ein Tagebuch für den Computer. Statt „ich hab da mal was gesehen" steht dort: Uhrzeit, Stufe, was passiert ist, welche Pizza bestellt wurde.',
   'Seit Go 1.21 gehört `log/slog` zur Standardbibliothek. Du schreibst `slog.Info` an wichtigen Stellen: Anmeldung, Bestellung, Fehler.',
   'Zu viele Notizen sind aber auch schlecht – das Tagebuch wird unlesbar. WENN du später etwas suchen willst, DANN hilft dir ein gutes Log.'
  ],'slog.Info("Bestellung annehmen", "pizza", pizza)\nslog.Warn("Salami fehlt im Regal")','Zwei Zeilen im Tagebuch (INFO und WARN)',
   'Schreibe eine Log-Zeile für eine abgelehnte Bestellung.',
   'Logging ist nicht dasselbe wie eine Ausgabe an den Gast. Der Gast soll höfliche Meldungen sehen, das Log ist für dich.',
   'Zum Beispiel: slog.Warn("Bestellung abgelehnt", "grund", grund).',
   [word('Log','Ein Tagebuch mit Notizen aus der laufenden Anwendung.'),word('Stufe','Ein Log-Eintrag kann INFO, WARN oder ERROR sein.')],
   'https://pkg.go.dev/log/slog'),

  chapter('health','robust','Ist der Laden noch offen?',9,
   'Du willst von außen schnell wissen, ob deine Anwendung noch läuft oder schon umgefallen ist.',
   'WENN jemand nach dem Zustand fragt, DANN antworte mit einem kurzen Statusbericht.',
   'GET /health → {"status":"UP"}',
   ['Du kennst einen Health-Check als kurzen Puls.','Du verstehst, dass "UP" = läuft bedeutet.'],
   ['contracts'],[
   'Ein Health-Check ist wie ein Blick auf die Tür: Ist sie offen? Dann antwortet die Anwendung mit `UP`.',
   'Go hat keinen Actuator wie Spring Boot. Du schreibst selbst einen kleinen Handler – das sind drei Zeilen.',
   'WENN ein Überwachungswerkzeug fragt, DANN antwortet dein Laden mit seinem Zustand. SONST weiß niemand, ob er noch da ist.'
  ],'http.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {\n    json.NewEncoder(w).Encode(map[string]string{"status": "UP"})\n})','{"status":"UP"}',
   'Was würde eine kaputte Anwendung antworten?',
   'Ein Health-Check ersetzt keine Fehlerbehandlung. Er sagt nur, ob die Anwendung erreichbar ist.',
   'Gar nichts oder eine Fehlermeldung. Genau das ist das Signal für den Betrieb.',
   [word('Health-Check','Eine kurze Anfrage, die fragt: Läuft die Anwendung noch?'),word('UP','Der Zustand „läuft" beim Health-Check.')],
   'https://pkg.go.dev/net/http#ServeMux'),

  chapter('unit-repeat','testing','Jeden Morgen dieselbe Prüfung',10,
   'Du hast in Band 1 einen Test geschrieben. Du willst ihn nicht mehr von Hand starten.',
   'WENN du eine Regel änderst, DANN lasse alle Tests automatisch laufen.',
   'go test ./...',
   ['Du verstehst automatisierte Tests als Sicherheitsnetz.','Du kannst mehrere Prüfungen mit einem Befehl starten.'],
   ['errors','contracts'],[
   'Ein Test, den du nur manuell startest, wird bald vergessen. Mit `go test ./...` laufen alle Prüfungen nacheinander.',
   'Typisch für Go sind Tabellentests: Du schreibst mehrere Fälle in eine Liste und prüfst sie in einer Schleife. Das ist kurz und übersichtlich.',
   'WENN grün, DANN ist alles wie erwartet. SONST weißt du, welche Regel kaputt ist.'
  ],'func TestRabatt(t *testing.T) {\n    for _, tc := range []struct{ in, want int }{{50, 5}, {0, 0}} {\n        if got := rabatt(tc.in); got != tc.want { t.Errorf("got %d, want %d", got, tc.want) }\n    }\n}','ok  pizzeria  0.01s',
   'Warum testest du auch den Wert 0?',
   'Ein Test prüft nur, was du hinschreibst. Das ist der Grund, warum du Grenzfälle aktiv ergänzen musst.',
   'Weil dort oft Fehler entstehen – zum Beispiel eine Division durch 0 oder ein leeres Feld.',
   [word('Tabellentest','Mehrere Testfälle in einer Liste, die in einer Schleife geprüft werden.'),word('Sicherheitsnetz','Tests, die dich auffangen, wenn du etwas kaputt machst.')],
   'https://pkg.go.dev/testing'),

  chapter('integration','testing','Zusammen statt einzeln',11,
   'Alle Einzelteile funktionieren – aber bestellt die Anwendung am Ende auch wirklich? Du musst sie zusammen prüfen.',
   'WENN du die ganze Anwendung prüfen willst, DANN starte sie im Test und schicke echte Anfragen.',
   'httptest.NewServer(handler())',
   ['Du verstehst einen Integrationstest als Prüfung des Zusammenspiels.','Du kennst eine Anfrage ohne echten Browser.'],
   ['contracts','errors'],[
   'Ein Unit-Test prüft eine kleine Regel. Ein Integrationstest prüft, ob Handler, Service und Regal zusammenarbeiten.',
   'In Go hilft `net/http/httptest`: Es startet deinen Server im Test. Du schickst eine echte HTTP-Anfrage – ganz ohne Browser.',
   'WENN die Antwort stimmt, DANN funktioniert das Zusammenspiel. SONST ist eine Verbindung kaputt.'
  ],'srv := httptest.NewServer(handler())\ndefer srv.Close()\nresp, _ := http.Post(srv.URL+"/bestellung", "text/plain", strings.NewReader("Salami"))\nfmt.Println(resp.StatusCode)','200',
   'Was prüft ein Integrationstest, was ein Unit-Test nicht prüft?',
   'Ein Integrationstest ist langsamer als ein Unit-Test. Deshalb benutzt du beide – nicht nur einen.',
   'Ob die Rollen miteinander sprechen. Der Unit-Test prüft nur eine Regel für sich.',
   [word('Integrationstest','Ein Test, der mehrere Teile zusammen prüft.'),word('httptest','Ein Go-Paket, das Server und Anfragen im Test bereitstellt.')],
   'https://pkg.go.dev/net/http/httptest'),

  chapter('edge-cases','testing','Die fiesen Fälle',10,
   'Der Test mit drei Pizzen klappt. Mit null Pizzen oder einer leeren Bestellung nicht. Du musst die Ränder prüfen.',
   'WENN du einen Test schreibst, DANN denke auch an die extremen Werte.',
   '0, -1, leer, doppelt',
   ['Du kannst Grenzfälle gezielt als Tests formulieren.','Du verstehst, warum "normal" nicht genug ist.'],
   ['errors','uniqueness'],[
   'Grenzfälle sind die Ränder: 0 statt 3, -1 statt 1, ein leerer Name, dieselbe Zutat zweimal. Genau dort passieren die meisten Fehler.',
   'In Go schreibst du eine Tabelle mit allen Fällen. Das klingt viel, ist aber nur eine Liste kleiner Regeln.',
   'WENN alle Grenzfälle bestehen, DANN kannst du dem Laden eher trauen. SONST bleibt ein Risiko.'
  ],'cases := []struct{ anzahl int; pizza string; fehler bool }{\n    {0, "Salami", true}, {-1, "Salami", true}, {1, "", true}, {1, "Salami", false},\n}','Vier Grenzfälle geprüft',
   'Finde einen dritten Grenzfall für die Zutatenliste.',
   'Grenzfälle sind keine seltenen Wünsche. Sie kommen im echten Betrieb überraschend oft vor.',
   'Zum Beispiel dieselbe Zutat zweimal in einer Bestellung – die Map als Menge darf sie nur einmal zählen.',
   [word('Grenzfall','Ein extremer Wert am Rand des erlaubten Bereichs.'),word('Erwartung','Das Ergebnis, das du von einem Test erwartest.')],
   'https://go.dev/doc/tutorial/add-a-test'),

  chapter('ci','testing','Der Prüfer nach jedem Speichern',10,
   'Du willst nicht daran denken müssen, Tests zu starten. Jeder Speichervorgang soll sie automatisch prüfen.',
   'WENN du Code speicherst, DANN lasse einen Automaten alle Tests laufen.',
   'on: push → go test ./...',
   ['Du verstehst CI als automatischen Prüfer.','Du kennst eine einfache Workflow-Datei.'],
   ['errors','contracts'],[
   'CI heißt: Die Prüfung läuft auf einem anderen Rechner, sobald du deinen Code hochlädst. Du bekommst grün oder rot zurück.',
   'Die Regeln stehen in einer kleinen YAML-Datei. Sie sagt: „Bei jedem Push: Go installieren, Tests starten."',
   'WENN alles grün ist, DANN darf der Code weiter. SONST siehst du sofort, welcher Test scheitert.'
  ],'on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-go@v5\n      - run: go test ./...','Automatisches Testergebnis',
   'Was passiert bei einem roten Test?',
   'CI ist nicht die Auslieferung selbst. Sie ist nur die automatische Prüfung vor der Auslieferung.',
   'Der Code wird nicht weitergegeben. Du musst den Fehler beheben und erneut speichern.',
   [word('CI','Automatische Prüfung von Code nach jedem Speichern.'),word('Workflow','Eine Datei mit den Schritten für den Automaten.')],
   'https://docs.github.com/en/actions'),

  chapter('docker','delivery','Die Pizzeria in einer Kiste',11,
   'Du willst deine Anwendung einem Freund geben. Bei ihm fehlt Go oder die Einstellungen sind anders.',
   'WENN du eine Anwendung übergeben willst, DANN packe sie mit ihrer Umgebung in eine Kiste.',
   'FROM golang → FROM scratch',
   ['Du verstehst einen Container als fertige Kiste.','Du kennst ein Dockerfile als Bauanleitung.'],
   ['ownership','contracts'],[
   'Ein Container ist wie eine Umzugskiste: Die Anwendung und alles, was sie braucht, sind drin. Dein Freund muss nur die Kiste öffnen.',
   'Bei Go ist die Kiste besonders klein. Du baust eine statische Binary mit `CGO_ENABLED=0` und legst sie in ein `scratch`-Image.',
   'WENN die Kiste gebaut ist, DANN läuft sie überall gleich. SONST heißt es „bei mir geht es, bei dir nicht".'
  ],'FROM golang:1.22 AS bau\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /app .\nFROM scratch\nCOPY --from=bau /app /app\nENTRYPOINT ["/app"]','Ein kleines Image mit der Pizzeria',
   'Was wäre ohne Container anders?',
   'Ein Container enthält die Laufzeitumgebung, aber keine Geheimnisse. Die kommen später dazu.',
   'Du müsstest Go und Einstellungen auf jedem Rechner neu einrichten – und hättest mehr Fehlerquellen.',
   [word('Container','Eine fertige Kiste mit Anwendung und Umgebung.'),word('Dockerfile','Die Bauanleitung für so eine Kiste.')],
   'https://docs.docker.com/get-started/'),

  chapter('profiles','delivery','Zwei Küchen: zu Hause und im Betrieb',10,
   'Zu Hause benutzt du eine lokale SQLite-Datei. Im Betrieb soll eine echte Datenbank laufen. Du willst den Code nicht ändern.',
   'WENN Umgebungen verschieden sind, DANN gib ihnen eigene Einstellungen.',
   'APP_ENV=dev | prod',
   ['Du verstehst Umgebungsvariablen als Einstellungssätze.','Du kannst zwischen dev und prod umschalten.'],
   ['contracts'],[
   'Ein Modus ist wie eine Schublade mit Einstellungen. In `dev` nutzt du eine lokale Datei, in `prod` die echte Datenbank.',
   'Go hat keine Spring-Profile. Du liest beim Start `APP_ENV` und `DB_DSN` mit `os.Getenv` – der Code bleibt gleich.',
   'WENN du die Umgebung wechselst, DANN änderst du nur die Variablen. SONST baust du zwei Versionen.'
  ],'modus := os.Getenv("APP_ENV")\nif modus == "" { modus = "dev" }\ndsn := os.Getenv("DB_DSN")','dev → lokale DB, prod → echte DB',
   'Welches Profil nutzt du zum Entwickeln?',
   'Umgebungsvariablen ersetzen keine Geheimnisse. Passwörter gehören nicht in den Code.',
   'Den Modus `dev`. Für den echten Betrieb wird `prod` gesetzt.',
   [word('Modus','Ein Satz Einstellungen für eine Umgebung.'),word('dev','Die Umgebung, in der du entwickelst.')],
   'https://pkg.go.dev/os#Getenv'),

  chapter('secrets','delivery','Geheimnisse gehören nicht in den Code',10,
   'Das Datenbank-Passwort steht in deiner Datei. Du willst die Anwendung an einen Freund geben – ohne ihm das Passwort zu verraten.',
   'WENN etwas geheim ist, DANN lies es aus der Umgebung. SONST steht es im Code.',
   'DB_PASSWORD=... go run .',
   ['Du verstehst Umgebungsvariablen als externe Geheimnisse.','Du erkennst, warum Passwörter nicht ins Repository gehören.'],
   ['errors','ownership'],[
   'Ein Geheimnis ist wie ein Schlüssel, den du nicht auf die Tür schreibst. Du gibst ihn der Anwendung beim Start – von außen.',
   'In Go schreibst du `os.Getenv("DB_PASSWORD")`. Fehlt der Wert, brichst du bewusst ab. So merkst du sofort, dass etwas fehlt.',
   'WENN du die Anwendung weiter gibst, DANN bleiben deine Geheimnisse bei dir. SONST hat sie jeder.'
  ],'passwort := os.Getenv("DB_PASSWORD")\nif passwort == "" { log.Fatal("DB_PASSWORD fehlt") }','Passwort kommt von außen',
   'Was passiert, wenn die Variable fehlt?',
   'Ein leerer Wert ist kein Standardwert. Wer ihn prüft, startet nicht heimlich mit einem falschen Passwort.',
   'Die Anwendung meldet einen Fehler und startet nicht. Du merkst sofort, dass etwas fehlt.',
   [word('Geheimnis','Ein Wert, den niemand außer der Anwendung sehen soll.'),word('Umgebungsvariable','Ein Wert, den du dem Programm beim Start von außen gibst.')],
   'https://pkg.go.dev/os#Getenv'),

  chapter('frontend','frontend','Ein Fenster für Gäste',11,
   'Deine Pizzeria antwortet mit JSON. Gäste wollen aber etwas ansehen, ohne JSON zu lesen.',
   'WENN ein Gast die Anwendung nutzen will, DANN zeige ihm eine einfache Seite.',
   'fetch("/pizzen").then(...)',
   ['Du verstehst, dass eine Seite Daten vom Server holen kann.','Du kennst fetch als Anfrage aus dem Browser.'],
   ['contracts','async'],[
   'Ein kleines HTML-Fenster kann deine API fragen: „Gib mir die Pizzen." Der Browser holt das JSON und zeigt es als Liste.',
   'Das macht deine Go-Anwendung nicht komplizierter – sie bekommt nur ein Gesicht. Die Regeln bleiben im Server.',
   'WENN der Gast die Seite öffnet, DANN fragt sie die Daten ab. SONST sieht er eine leere Liste.'
  ],'fetch("/pizzen")\n  .then(r => r.json())\n  .then(p => document.body.innerText = p.join(", "));','Salami, Käse, Pilze',
   'Wo stehen die Regeln für die Pizzen?',
   'Das Frontend soll keine Preise berechnen. Es zeigt nur, was der Server ihm gibt.',
   'Auf dem Go-Server. Die Seite zeigt nur das Ergebnis.',
   [word('Frontend','Der Teil, den der Gast im Browser sieht.'),word('fetch','Eine Anfrage aus dem Browser an den Server.')],
   'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'),

  chapter('go-live','frontend','Der erste echte Gast',12,
   'Die Anwendung läuft, die Tests sind grün, die Daten bleiben gespeichert. Jetzt darf sie jemand anderes benutzen.',
   'WENN alles geprüft ist, DANN kannst du deine Pizzeria veröffentlichen. SONST behebe zuerst die offenen Punkte.',
   'go test · APP_ENV=prod · Health-Check',
   ['Du kannst eine Veröffentlichungs-Checkliste anwenden.','Du verstehst, dass Betrieb mehr ist als "es läuft".'],
   ['contracts','errors','ownership'],[
   'Geh die Liste durch: Tests grün, richtige Einstellungen, keine Passwörter im Code, Health-Check erreichbar. Dann ist dein Laden bereit.',
   'Der Go-Band 1 hat dir beigebracht, wie man Regeln in Code übersetzt. Dieser Band hat gezeigt, was ein Programm braucht, um für andere zu funktionieren.',
   'WENN ein echter Gast kommt, DANN beobachtest du erst einmal. SONST übersiehst du, was er wirklich braucht.'
  ],'go test ./...\ncurl localhost:8080/health\ncurl localhost:8080/pizzen','Deine Pizzeria ist erreichbar',
   'Was würdest du als erstes beobachten, wenn ein Gast den Laden nutzt?',
   'Veröffentlichen ist kein Endpunkt, sondern ein Übergang. Du darfst weiter lernen und verbessern.',
   'Ob er die Speisekarte findet und versteht, was passiert. Danach kommen neue Wünsche.',
   [word('Veröffentlichung','Die Anwendung anderen Menschen zugänglich machen.'),word('Checkliste','Eine Liste mit Punkten, die du vorher prüfst.')],
   'https://go.dev/doc/tutorial/web-service-gin')
  ]
};

export const GO_OPERATIONS_BY_ID:ReadonlyMap<string,BeginnerChapter>=
 new Map(PIZZERIA_GO_OPERATIONS_BOOK.chapters.map(chapter=>[chapter.id,chapter]));
export function getGoOperationsChapter(id:string):BeginnerChapter{
 const chapter=GO_OPERATIONS_BY_ID.get(id);
 if(!chapter)throw Error('Unbekanntes Go-Betriebskapitel: '+id);
 return chapter;
}
export function validateGoOperationsBook(book:BeginnerBook=PIZZERIA_GO_OPERATIONS_BOOK):readonly string[]{
 return validateGoBook(book);
}
