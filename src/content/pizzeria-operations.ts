import type {BeginnerBook,BeginnerChapter,BeginnerWord,BeginnerStage} from './pizzeria-book.ts';

/** Band 2: aus dem Übungsprogramm wird eine Anwendung, die man anderen geben kann. */
const stage=(id:string,title:string,goal:string):BeginnerStage=>({id,title,goal});
const word=(term:string,definition:string):BeginnerWord=>({term,definition});
const chapter=(id:string,stageId:string,title:string,minutes:number,problem:string,natural:string,pseudo:string,
 objectives:readonly string[],conceptIds:readonly string[],explain:readonly string[],code:string,output:string,
 tryIt:string,misconception:string,solution:string,wordbank:readonly BeginnerWord[],sourceUrl:string):BeginnerChapter=>
 ({id,stage:stageId,title,minutes,problem,rule:{natural,pseudo},objectives,conceptIds,explain,code,output,tryIt,
  misconception,solution,wordbank,sourceUrl});

export const PIZZERIA_OPERATIONS_BOOK:BeginnerBook={
 title:'Die Pizzeria geht in Betrieb',
 subtitle:'Band 2: Datenbank, Anmeldung, Fehler, Tests und Auslieferung',
 audience:'Für alle, die Band 1 gelesen haben und ihren Laden jetzt wirklich betreiben wollen.',
 scenario:'Deine Pizzeria läuft auf deinem Rechner. Jetzt soll sie auch nach dem Neustart funktionieren, Gäste erkennen und Fehler verständlich melden.',
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
   'Du machst den Rechner aus und wieder an. Die Pizzen sind weg. Im Speicher war alles nur vorübergehend.',
   'WENN Daten auch morgen noch da sein sollen, DANN schreibe sie auf die Festplatte. SONST sind sie nach dem Neustart weg.',
   'SPEICHERE bestand → Datei',
   ['Du verstehst den Unterschied zwischen Speicher und Festplatte.','Du kannst einen Wert in eine Datei schreiben.'],
   ['errors','ownership'],[
   'Band 1 hat alles im Arbeitsspeicher gehalten. Das ist wie ein Zettel, den du nach Ladenschluss wegwirfst. Am nächsten Morgen weißt du nichts mehr.',
   'Eine Datei ist ein Zettel, den du in eine Schublade legst. Java kann Text in eine Datei schreiben – mit `Files.writeString`.',
   'Für echte Anwendungen reicht eine Textdatei bald nicht mehr. Aber sie zeigt das Grundprinzip: Zustand muss irgendwo dauerhaft liegen.'
  ],'Files.writeString(Path.of("bestand.txt"), "Salami=3");','Datei bestand.txt mit Salami=3',
   'Schreibe eine zweite Zeile für Käse in dieselbe Datei. Was steht dann drin?',
   'Ein Programm merkt sich Variablen nur, solange es läuft. Die Festplatte bleibt auch nach dem Ausschalten erhalten.',
   'Die Datei enthält zwei Zeilen: Salami=3 und Käse=5 – genau das, was du hingeschrieben hast.',
   [word('Persistenz','Daten speichern, sodass sie auch nach dem Neustart vorhanden sind.'),word('Datei','Ein gespeicherter Zettel auf der Festplatte.')],
   'https://dev.java/learn/'),

  chapter('json-file','persist','Ein Zettel, den der Computer lesen kann',10,
   'Deine Datei hat "Salami=3" drin. Ein anderes Programm kann das nicht gut lesen. Du brauchst ein gemeinsames Format.',
   'WENN Programme Daten austauschen, DANN benutzen sie ein gemeinsames Format wie JSON.',
   '{"zutat":"Salami","menge":3}',
   ['Du kennst JSON als lesbares Datenformat.','Du verstehst, warum Strukturen besser sind als freier Text.'],
   ['contracts','records'],[
   'JSON sieht aus wie ein kleiner Zettel mit Beschriftung: `"zutat": "Salami"` und `"menge": 3`. Der Name steht immer neben dem Wert.',
   'Ein `record` passt perfekt dazu: Er hat dieselben Felder. Java kann ihn automatisch in JSON verwandeln – du musst die Felder nicht selbst zusammenbauen.',
   'WENN ein anderes Programm deine Daten lesen soll, DANN gib ihnen feste Namen. SONST rät es, was "3" bedeutet.'
  ],'record Bestand(String zutat, int menge) {}\n// JSON: {"zutat":"Salami","menge":3}','Lesbarer Text mit zwei benannten Feldern',
   'Ändere die Menge auf 4. Wie sieht das JSON aus?',
   'JSON ist kein Java-Code. Es ist nur Text – den Java lesen und schreiben kann.',
   '{"zutat":"Salami","menge":4}. Nur der Wert hinter menge hat sich geändert.',
   [word('JSON','Ein Textformat mit benannten Feldern für den Datenaustausch.'),word('Format','Eine feste Art, Daten aufzuschreiben.')],
   'https://www.json.org/json-de.html'),

  chapter('database','persist','Ein Regal, das nicht vergisst',11,
   'Deine Datei wird größer und du suchst eine einzelne Zutat ewig. Du brauchst ein Regal mit schneller Suche.',
   'WENN du viele Daten schnell finden willst, DANN benutze eine Datenbank.',
   'SELECT menge FROM zutat WHERE name = "Salami"',
   ['Du verstehst eine Datenbank als durchsuchbares Regal.','Du kennst eine einfache SQL-Abfrage.'],
   ['key-value'],[
   'Eine Datenbank ist wie ein sehr ordentliches Regal mit einem Register. Du fragst nicht „Zeig mir alle Fächer", sondern „Gib mir Salami".',
   'Diese Frage heißt SQL. `SELECT` bedeutet „zeige mir", `WHERE` bedeutet „nur wo …". Das ist eine Regel in einer eigenen kleinen Sprache.',
   'H2 ist eine Datenbank, die in deinem Programm mitläuft. Für den Anfang musst du nichts installieren.'
  ],'CREATE TABLE zutat (name VARCHAR(50), menge INT);\nSELECT menge FROM zutat WHERE name = \'Salami\';','Gibt 3 zurück',
   'Schreibe eine Abfrage für Käse. Was änderst du?',
   'SQL ist keine Java-Methode. Du schreibst eine Frage an die Datenbank, nicht eine Anweisung an dein Programm.',
   'Du ersetzt "Salami" durch "Käse". Alles andere bleibt gleich.',
   [word('Datenbank','Ein dauerhaftes Regal, in dem du Daten schnell wiederfindest.'),word('SQL','Die Sprache, in der man Datenbanken fragt.')],
   'https://dev.java/learn/'),

  chapter('jpa-entity','persist','Eine Karte für die Datenbank',11,
   'Du willst in Java mit Zutaten arbeiten, nicht mit SQL-Zeilen. Es wäre schön, wenn Java die Karten selbst in die Datenbank legt.',
   'WENN du Java-Objekte in einer Datenbank speichern willst, DANN beschreibe sie als Entität.',
   '@Entity class Zutat { @Id String name; int menge; }',
   ['Du verstehst eine Entität als Datenkarte mit Ausweis.','Du erkennst, dass @Id der Schlüssel ist.'],
   ['records','key-value'],[
   'Eine Entität ist eine Java-Klasse, die genau einem Datenbankfach entspricht. `@Entity` sagt Spring: „Diese Karte gehört in die Datenbank."',
   '`@Id` markiert das Feld, das jede Karte eindeutig macht – hier den Namen. Zwei Salami-Karten darf es nicht geben.',
   'Du schreibst weiterhin Java. Spring übersetzt deine Karten in SQL – wie ein Übersetzer zwischen zwei Sprachen.'
  ],'@Entity\nclass Zutat {\n    @Id String name;\n    int menge;\n}','Eine Tabelle zutat mit name und menge',
   'Welches Feld ist der Ausweis deiner Karte?',
   'Ohne @Id weiß die Datenbank nicht, wie sie zwei Karten unterscheiden soll.',
   'Das Feld `name` ist der Ausweis. Über den Namen findest du die Zutat wieder.',
   [word('Entität','Eine Java-Karte, die in der Datenbank gespeichert wird.'),word('@Id','Das Feld, das eine Karte eindeutig macht.')],
   'https://dev.java/learn/'),

  chapter('repository','persist','Der Regalmeister fragt die Datenbank',10,
   'Du willst nach Salami fragen, ohne SQL zu schreiben. Der Regalmeister soll das für dich erledigen.',
   'WENN du Daten aus der Datenbank holen willst, DANN frag das Repository.',
   'regal.findById("Salami")',
   ['Du verstehst ein Repository als Datenzugriff.','Du kannst eine Methode aufrufen, statt SQL zu schreiben.'],
   ['key-value','contracts'],[
   'In Band 1 war das Regal eine einfache Map. Jetzt übernimmt ein Repository die Arbeit. Du gibst ihm den Namen, es liefert die Karte.',
   'Spring schreibt die passende SQL-Abfrage automatisch, wenn du eine Methode wie `findById` benennst. Das spart viel Tipparbeit.',
   'WENN die Küche Zutaten braucht, DANN fragt sie das Regal – nie die Datenbank direkt. So bleibt die Arbeit geteilt.'
  ],'interface ZutatRepository extends JpaRepository<Zutat, String> {}\nregal.findById("Salami");','Die Zutat Salami',
   'Was passiert, wenn es die Zutat nicht gibt?',
   'Ein Repository ist keine Liste. Du bekommst ein Optional zurück, weil etwas fehlen kann.',
   'Du erhältst ein leeres Optional und kannst mit orElse einen Ersatz wählen.',
   [word('Repository','Die Klasse, die dir Daten aus der Datenbank holt.'),word('findById','Suche nach dem eindeutigen Namen.')],
   'https://dev.java/learn/'),

  chapter('migration','persist','Neues Fach im Regal',10,
   'Du willst später auch den Preis einer Zutat speichern. Die alte Tabelle hat dafür kein Fach.',
   'WENN sich die Daten ändern, DANN schreibe eine Migration – keine handwerkliche Änderung zwischendurch.',
   'ALTER TABLE zutat ADD COLUMN preis INT',
   ['Du verstehst Migrationen als geplante Umbauten.','Du erkennst, warum alte Daten erhalten bleiben.'],
   ['contracts','errors'],[
   'Stell dir vor, das Regal hat schon 20 Zutaten. Du kannst es nicht einfach wegwerfen. Du baust ein neues Fach ein – die alten Zettel bleiben liegen.',
   'So eine Änderung heißt Migration. Sie ist ein kleiner, beschriebener Schritt, den dein Programm beim Start ausführt.',
   'WENN du ein Feld hinzufügst, DANN schreibst du eine neue Migration. SONST weiß dein Rechner von gestern nichts mehr.'
  ],'ALTER TABLE zutat ADD COLUMN preis INT DEFAULT 0;','Neues Feld preis mit 0 bei alten Zutaten',
   'Warum ist der Standardwert 0 wichtig?',
   'Alte Datensätze haben das neue Feld noch nicht. Ohne Standardwert bleiben sie leer und alles könnte kaputtgehen.',
   'Weil alte Zutaten sonst keinen Preis hätten. Mit 0 kannst du trotzdem rechnen.',
   [word('Migration','Ein geplanter Umbau der Datenbank, der alte Daten erhält.'),word('Standardwert','Der Wert, den neue Felder am Anfang bekommen.')],
   'https://dev.java/learn/'),

  chapter('login','auth','Der Gast meldet sich an',10,
   'Dein Laden soll wissen, wer gerade bestellt. Dazu gibt der Gast seinen Namen und ein Passwort ein.',
   'WENN ein Gast sich anmeldet, DANN prüfe Name und Passwort. SONST bleibt er ein Unbekannter.',
   'POST /login {name, passwort}',
   ['Du verstehst Anmeldung als Identitätsprüfung.','Du kennst den Unterschied zwischen Gast und Unbekanntem.'],
   ['contracts','errors'],[
   'Anmelden heißt: Der Gast sagt, wer er ist, und beweist es mit einem Passwort. Dein Programm vergleicht beides.',
   'Solange niemand angemeldet ist, darf die Anwendung nur öffentliche Seiten zeigen – zum Beispiel die Speisekarte.',
   'WENN die Prüfung klappt, DANN darf der Gast bestellen. SONST bleibt er auf der Gästeseite.'
  ],'@PostMapping("/login")\nString login(@RequestParam String name) {\n    return "Angemeldet: " + name;\n}','Angemeldet: Mia',
   'Welche Seite darf ein unbekannter Gast sehen?',
   'Anmelden ist nicht dasselbe wie registrieren. Hier prüfst du einen schon bekannten Gast.',
   'Nur öffentliche Seiten wie die Speisekarte. Bestellen darf er erst nach der Anmeldung.',
   [word('Anmeldung','Das Prüfen, ob ein Gast wirklich der ist, der er vorgibt.'),word('Identität','Wer eine Person wirklich ist.')],
   'https://dev.java/learn/'),

  chapter('password','auth','Das Passwort darf nicht auf einem Zettel stehen',11,
   'Du willst Passwörter speichern. Wenn du sie einfach in die Datenbank schreibst, kann jeder sie lesen.',
   'WENN du ein Passwort speicherst, DANN speichere nur einen verschlüsselten Abdruck. SONST kann es jeder lesen.',
   'hash = BCrypt.hashpw(passwort)',
   ['Du verstehst, warum Passwörter nie im Klartext stehen.','Du kennst einen Hash als Einweg-Abdruck.'],
   ['errors','contracts'],[
   'Ein Hash ist wie ein Fingerabdruck: Du kannst ihn prüfen, aber nicht daraus das Original nachbauen. Bei jeder Anmeldung wird das eingegebene Passwort neu gehasht und verglichen.',
   'Zwei gleiche Passwörter können trotzdem verschiedene Hashes haben – das ist gut so, denn es erschwert das Raten.',
   'WENN du ein Passwort speicherst, DANN benutze eine bewährte Bibliothek. SONST machst du einen gefährlichen Fehler.'
  ],'String hash = encoder.encode("geheim");\nboolean ok = encoder.matches("geheim", hash);','true',
   'Warum speicherst du nicht das Passwort selbst?',
   'Ein Hash ist kein Verschlüsseln mit Schlüssel. Du kannst ihn nicht wieder zurückverwandeln – genau das ist der Punkt.',
   'Weil sonst jeder, der die Datenbank liest, das Passwort kennt. Der Hash verrät es nicht.',
   [word('Hash','Ein Einweg-Abdruck eines Passworts.'),word('Klartext','Ein Text, den jeder direkt lesen kann.')],
   'https://dev.java/learn/'),

  chapter('roles','auth','Gast, Küche, Chef',11,
   'Ein Gast darf bestellen, die Küche darf kochen, nur der Chef darf Preise ändern. Alle drei nutzen dieselbe Anwendung.',
   'WENN eine Aufgabe gefährlich ist, DANN darf sie nur eine bestimmte Rolle ausführen.',
   '@PreAuthorize("hasRole(\'CHEF\')")',
   ['Du verstehst Rollen als Rechtebündel.','Du kannst eine Methode mit einer Rolle schützen.'],
   ['contracts','errors'],[
   'Eine Rolle ist wie ein Abzeichen: Gast, Küche oder Chef. Die Anwendung schaut auf das Abzeichen, bevor sie eine Aufgabe erlaubt.',
   'Mit `@PreAuthorize` sagst du: „Erst prüfen, dann ausführen." Der Chef darf den Preis ändern, ein Gast nicht – auch wenn er die Adresse kennt.',
   'WENN jemand eine geschützte Aufgabe aufruft, DANN prüft Spring die Rolle. SONST wird die Anfrage abgelehnt.'
  ],'@PreAuthorize("hasRole(\'CHEF\')")\nvoid preisAendern(int neu) {\n    this.preis = neu;\n}','Nur für Chef aufrufbar',
   'Was passiert, wenn ein Gast diese Methode aufruft?',
   'Eine Rolle schützt nicht nur die Oberfläche. Die Prüfung sitzt an der Methode selbst.',
   'Spring lehnt die Anfrage ab. Der Preis bleibt unverändert.',
   [word('Rolle','Ein Abzeichen, das bestimmte Rechte erlaubt.'),word('Autorisierung','Das Prüfen, ob jemand etwas darf.')],
   'https://dev.java/learn/'),

  chapter('session','auth','Der Gast bekommt ein Armband',10,
   'Nach der Anmeldung vergisst die Anwendung den Gast bei jeder neuen Anfrage wieder. Du brauchst ein Armband, das ihn erkennt.',
   'WENN ein Gast angemeldet ist, DANN merke es dir für die nächsten Anfragen.',
   'Set-Cookie: session=abc123',
   ['Du verstehst eine Session als Merkzettel für den Besuch.','Du kennst ein Cookie als kleines Armband im Browser.'],
   ['contracts'],[
   'Der Browser bekommt ein kleines Armband – ein Cookie. Bei jeder neuen Anfrage zeigt er es vor, und die Anwendung weiß wieder, wer da ist.',
   'Die Session selbst liegt auf dem Server. Im Cookie steht nur eine Nummer, die darauf verweist – wie eine Garderobenmarke.',
   'WENN der Gast etwas Bestellen will, DANN prüft die Anwendung das Armband. SONST gilt er als unbekannt.'
  ],'@GetMapping("/wer")\nString wer(HttpServletRequest req) {\n    return String.valueOf(req.getSession().getAttribute("gast"));\n}','Mia',
   'Wo liegt der Name des Gastes – im Browser oder auf dem Server?',
   'Ein Cookie ist kein Passwort und keine Datenbank. Es ist nur die Marke für die Garderobe.',
   'Auf dem Server in der Session. Der Browser trägt nur die Nummer dazu.',
   [word('Session','Ein Merkzettel auf dem Server für die Dauer eines Besuchs.'),word('Cookie','Ein kleines Armband im Browser mit der Session-Nummer.')],
   'https://dev.java/learn/'),

  chapter('logout','auth','Am Ende geht das Armband zurück',9,
   'Der Gast geht nach Hause. Der nächste Mensch am selben Rechner soll nicht seine Bestellungen sehen.',
   'WENN ein Gast sich abmeldet, DANN ungültig mache seine Session. SONST kann jemand anderes sie benutzen.',
   'POST /logout → session ungültig',
   ['Du verstehst Abmelden als Aufräumen.','Du erkennst, warum Session-Daten nicht ewig leben dürfen.'],
   ['contracts','ownership'],[
   'Abmelden klingt unwichtig, ist aber sicherheitstechnisch entscheidend. Du gibst das Armband zurück und die Garderobe wirft den Zettel weg.',
   'Danach darf der Browser die alte Nummer noch zeigen – sie führt aber zu nichts mehr. Der Gast ist wieder unbekannt.',
   'WENN ein Gast geht, DANN räume auf. SONST wird sein Platz von jemandem übernommen.'
  ],'@PostMapping("/logout")\nvoid logout(HttpServletRequest req) {\n    req.getSession().invalidate();\n}','Session ist ungültig',
   'Was passiert nach dem Abmelden bei einer alten Anfrage?',
   'Abmelden löscht nicht die Datenbank. Es beendet nur die Zugehörigkeit des Gastes.',
   'Die alte Session gilt nicht mehr. Die Anwendung behandelt die Anfrage als unbekannt.',
   [word('Abmelden','Die Session beenden, damit niemand sie weiterbenutzen kann.'),word('ungültig','Nicht mehr erlaubt oder gültig.')],
   'https://dev.java/learn/'),

  chapter('error-contract','robust','Höfliche Fehler für alle',10,
   'Die Salami fehlt. Der Gast sieht eine technische Fehlerseite mit Java-Wörtern. Das versteht niemand.',
   'WENN etwas schiefgeht, DANN antworte mit einer klaren, festen Meldung. SONST rät der Gast.',
   '{"fehler":"Salami fehlt im Regal"}',
   ['Du verstehst einen Fehlervertrag als feste Antwortform.','Du kannst eine Exception in eine verständliche Meldung übersetzen.'],
   ['errors','contracts'],[
   'Ein Fehlervertrag ist wie ein einheitliches Formular: Immer steht dort, was passiert ist – in Alltagssprache und im selben Format.',
   'Intern darf dein Programm eine Exception werfen. Nach außen gibt es ein JSON mit einem `fehler`-Feld. Der Gast sieht keinen Java-Code.',
   'WENN intern etwas schiefgeht, DANN fange es ab und antworte höflich. SONST sieht der Gast den Fehler direkt.'
  ],'@ExceptionHandler(IllegalArgumentException.class)\nString fehler(Exception e) {\n    return "{\\"fehler\\":\\"" + e.getMessage() + "\\"}";\n}','{"fehler":"Salami fehlt im Regal"}',
   'Warum solltest du die technische Meldung nicht direkt zeigen?',
   'Ein Fehlervertrag ändert nicht den Fehler, sondern nur die Art, wie du ihn nach außen zeigst.',
   'Weil sie für Gäste unverständlich und manchmal sogar gefährlich ist. Die höfliche Meldung sagt das Nötige.',
   [word('Fehlervertrag','Eine feste Form für Fehlermeldungen, die alle verstehen.'),word('ExceptionHandler','Eine Stelle, die Fehler sammelt und übersetzt.')],
   'https://dev.java/learn/'),

  chapter('validation','robust','Prüfen, bevor es in die Küche geht',10,
   'Ein Gast bestellt „minus drei Pizzen". Die Küche weiß nicht, was sie tun soll. Du musst die Bestellung vorher prüfen.',
   'WENN Daten in die Anwendung kommen, DANN prüfe sie zuerst. SONST arbeitet die Küche mit Unsinn.',
   '@Valid Bestellung bestellen(@Valid Bestellung b)',
   ['Du verstehst Validierung als Eingangskontrolle.','Du kannst Regeln wie "mindestens 1" festlegen.'],
   ['errors','contracts'],[
   'Validierung ist wie ein Türsteher: Er lässt nur gültige Bestellungen hinein. Negativzahlen oder leere Namen kommen gar nicht erst in die Küche.',
   'In Java schreibst du solche Regeln als Annotationen direkt an die Datenkarte, zum Beispiel `@Min(1)` für die Anzahl.',
   'WENN die Prüfung scheitert, DANN antwortest du mit einem klaren Fehler. SONST gibst du ungültige Daten weiter.'
  ],'record Bestellung(@Min(1) int anzahl, @NotBlank String pizza) {}\n// Controller: void bestellen(@Valid Bestellung b)','Ungültige Bestellung wird abgelehnt',
   'Welche Regel brauchst du für den Pizza-Namen?',
   'Validierung prüft die Form der Daten, nicht ob die Pizza im Regal ist. Das kommt danach.',
   '`@NotBlank` – der Name darf nicht leer sein. Zusammen mit @Min(1) ist die Bestellung gültig.',
   [word('Validierung','Das Prüfen von Daten, bevor sie weiterverarbeitet werden.'),word('@Min','Eine Regel: Der Wert muss mindestens so groß sein.')],
   'https://dev.java/learn/'),

  chapter('retry','robust','Der Lieferant ist gerade nicht erreichbar',11,
   'Deine Anwendung fragt einen Lieferanten. Kurz ist das Netz weg. Beim ersten Fehler willst du nicht gleich aufgeben.',
   'WENN eine Anfrage kurz scheitert, DANN versuche es noch einmal mit einer Pause. SONST bricht der Laden ab.',
   'WENN Fehler: warte kurz, versuche erneut',
   ['Du verstehst Wiederholung als Schutz vor vorübergehenden Fehlern.','Du kennst eine Pause zwischen Versuchen.'],
   ['errors','async'],[
   'Nicht jeder Fehler ist dauerhaft. Wenn der Lieferant gerade telefoniert, hilft eine zweite Anfrage nach kurzer Zeit.',
   'Du schreibst eine kleine Schleife: probieren, kurz warten, noch mal probieren. Nach drei Versuchen gibst du auf und meldest den Fehler.',
   'WENN der Fehler verschwindet, DANN läuft alles weiter. SONST bekommst du eine verständliche Meldung.'
  ],'for (int i = 0; i < 3; i++) {\n    try { return lieferant.fragen(); }\n    catch (Exception e) { Thread.sleep(200); }\n}','Nach maximal drei Versuchen eine Antwort',
   'Warum nicht unendlich oft versuchen?',
   'Wiederholen ist kein Heilmittel für falsche Daten. Wenn etwas dauerhaft kaputt ist, musst du es melden.',
   'Sonst hängt die Anwendung für immer. Nach drei Versuchen ist die Information „nicht erreichbar" ehrlicher.',
   [word('Wiederholung','Ein Fehler wird noch einmal versucht, meist nach einer kurzen Pause.'),word('vorübergehend','Nur kurzzeitig – nicht für immer.')],
   'https://dev.java/learn/'),

  chapter('logging','robust','Ein Tagebuch für den Laden',10,
   'Am Morgen sagt jemand: „Gestern um 18 Uhr war die Bestellung falsch." Du weißt nichts mehr – es gab kein Tagebuch.',
   'WENN etwas im Betrieb passiert, DANN schreibe eine kurze Notiz mit Zeitpunkt. SONST kannst du es später nicht nachvollziehen.',
   'log.info("Bestellung {} angenommen", pizza)',
   ['Du verstehst Logging als Tagebuch der Anwendung.','Du kannst eine Information mit Zeitstempel festhalten.'],
   ['errors','contracts'],[
   'Ein Log ist ein Tagebuch für den Computer. Statt „ich hab da mal was gesehen" steht dort: Uhrzeit, was passiert ist, welche Pizza bestellt wurde.',
   'Du schreibst `log.info(...)` an wichtigen Stellen: Anmeldung, Bestellung, Fehler. Zu viele Notizen sind aber auch schlecht – das Tagebuch wird unlesbar.',
   'WENN du später etwas suchen willst, DANN hilft dir ein gutes Log. SONST rätst du wieder.'
  ],'log.info("Bestellung angenommen: {}", pizza);\nlog.warn("Salami fehlt im Regal");','Zwei Zeilen im Tagebuch',
   'Schreibe eine Log-Zeile für eine abgelehnte Bestellung.',
   'Logging ist nicht dasselbe wie eine Ausgabe an den Gast. Der Gast soll höfliche Meldungen sehen, das Log ist für dich.',
   'Zum Beispiel: log.warn("Bestellung abgelehnt: {}", grund).',
   [word('Log','Ein Tagebuch mit Notizen aus der laufenden Anwendung.'),word('Stufe','Ein Log-Eintrag kann info, warn oder error sein.')],
   'https://dev.java/learn/'),

  chapter('health','robust','Ist der Laden noch offen?',9,
   'Du willst von außen schnell wissen, ob deine Anwendung noch läuft oder schon umgefallen ist.',
   'WENN jemand nach dem Zustand fragt, DANN antworte mit einem kurzen statusbericht.',
   'GET /actuator/health → {"status":"UP"}',
   ['Du kennst einen Health-Check als kurzen Puls.','Du verstehst, dass "UP" = läuft bedeutet.'],
   ['contracts'],[
   'Ein Health-Check ist wie ein Blick auf die Tür: Ist offen? Dann antwortet die Anwendung mit `UP`.',
   'Spring Boot kann das automatisch. Du musst nur die Adresse `/actuator/health` erreichbar machen.',
   'WENN ein Überwachungswerkzeug fragt, DANN antwortet dein Laden mit seinem Zustand. SONST weiß niemand, ob er noch da ist.'
  ],'@GetMapping("/health")\nString health() {\n    return "{\\"status\\":\\"UP\\"}";\n}','{"status":"UP"}',
   'Was würde eine kaputte Anwendung antworten?',
   'Ein Health-Check ersetzt keine Fehlerbehandlung. Er sagt nur, ob die Anwendung erreichbar ist.',
   'Gar nichts oder eine Fehlermeldung. Genau das ist das Signal für den Betrieb.',
   [word('Health-Check','Eine kurze Anfrage, die fragt: Läuft die Anwendung noch?'),word('UP','Der Zustand „läuft" beim Health-Check.')],
   'https://dev.java/learn/'),

  chapter('unit-repeat','testing','Jeden Morgen dieselbe Prüfung',10,
   'Du hast in Band 1 einen Test geschrieben. Du willst ihn nicht mehr von Hand starten.',
   'WENN du eine Regel änderst, DANN lasse alle Tests automatisch laufen.',
   'mvn test',
   ['Du verstehst automatisierte Tests als Sicherheitsnetz.','Du kannst mehrere Prüfungen mit einem Befehl starten.'],
   ['errors','contracts'],[
   'Ein Test, den du nur manuell startest, wird bald vergessen. Mit `mvn test` laufen alle Prüfungen nacheinander.',
   'Du schreibst für jede wichtige Regel einen Test: Preis, Rabatt, Grenzfälle.如果 einer scheitert, siehst du sofort, wo.',
   'WENN grün, DANN ist alles wie erwartet. SONST weißt du, welche Regel kaputt ist.'
  ],'@Test\nvoid rabatt BeiNull() {\n    assertEquals(0, rabatt(0));\n}','Test bestanden',
   'Warum testest du auch den Wert 0?',
   'Ein Test prüft nur, was du hinschreibst. Das ist der Grund, warum du Grenzfälle aktiv ergänzen musst.',
   'Weil dort oft Fehler entstehen – zum Beispiel eine Division oder ein leeres Feld.',
   [word('Automatisiert','Läuft von selbst, ohne dass du jedes Mal daran denken musst.'),word('Sicherheitsnetz','Tests, die dich auffangen, wenn du etwas kaputt machst.')],
   'https://dev.java/learn/'),

  chapter('integration','testing','Zusammen statt einzeln',11,
   'Alle Einzelteile funktionieren – aber bestellt die Anwendung am Ende auch wirklich? Du musst sie zusammen prüfen.',
   'WENN du die ganze Anwendung prüfen willst, DANN starte sie im Test und schicke echte Anfragen.',
   '@SpringBootTest + MockMvc',
   ['Du verstehst einen Integrationstest als Prüfung des Zusammenspiels.','Du kennst eine Anfrage ohne echten Browser.'],
   ['contracts','errors'],[
   'Ein Unit-Test prüft eine kleine Regel. Ein Integrationstest prüft, ob Controller, Service und Regal zusammenarbeiten.',
   'Mit `@SpringBootTest` startest du die Anwendung im Test. Mit MockMvc schickst du eine Anfrage – ganz ohne Browser.',
   'WENN die Antwort stimmt, DANN funktioniert das Zusammenspiel. SONST ist eine Verbindung kaputt.'
  ],'@SpringBootTest\nclass PizzeriaTest {\n    // MockMvc: POST /bestellung → 200 OK\n}','Zusammenspiel geprüft',
   'Was prüft ein Integrationstest, was ein Unit-Test nicht prüft?',
   'Ein Integrationstest ist langsamer als ein Unit-Test. Deshalb benutzt du beide – nicht nur einen.',
   'Ob die Rollen miteinander sprechen. Der Unit-Test prüft nur eine Regel für sich.',
   [word('Integrationstest','Ein Test, der mehrere Teile zusammen prüft.'),word('MockMvc','Ein Werkzeug, das Anfragen ohne Browser simuliert.')],
   'https://dev.java/learn/'),

  chapter('edge-cases','testing','Die fiesen Fälle',10,
   'Der Test mit drei Pizzen klappt. Mit null Pizzen oder einer leeren Bestellung nicht. Du musst die Ränder prüfen.',
   'WENN du einen Test schreibst, DANN denke auch an die extremen Werte.',
   '0, -1, leer, doppelt',
   ['Du kannst Grenzfälle gezielt als Tests formulieren.','Du verstehst, warum "normal" nicht genug ist.'],
   ['errors','uniqueness'],[
   'Grenzfälle sind die Ränder: 0 statt 3, -1 statt 1, ein leerer Name, dieselbe Zutat zweimal. Genau dort passieren die meisten Fehler.',
   'Du schreibst für jeden Rand einen eigenen Test. Das klingt viel, ist aber nur eine Liste kleiner Regeln.',
   'WENN alle Grenzfälle bestehen, DANN kannst du dem Laden eher trauen. SONST bleibt ein Risiko.'
  ],'@Test void keinePizza() { assertEquals(0, anzahl("")); }\n@Test void negativ() { assertTrue(ungueltig(-1)); }','Zwei weitere grüne Tests',
   'Finde einen dritten Grenzfall für die Zutatenliste.',
   'Grenzfälle sind keine seltenen Wünsche. Sie kommen im echten Betrieb überraschend oft vor.',
   'Zum Beispiel dieselbe Zutat zweimal in einer Bestellung – die Set darf sie nur einmal zählen.',
   [word('Grenzfall','Ein extremer Wert am Rand des erlaubten Bereichs.'),word('Erwartung','Das Ergebnis, das du von einem Test erwartest.')],
   'https://dev.java/learn/'),

  chapter('ci','testing','Der Prüfer nach jedem Speichern',10,
   'Du willst nicht daran denken müssen, Tests zu starten. Jeder Speichervorgang soll sie automatisch prüfen.',
   'WENN du Code speicherst, DANN lasse einen Automaten alle Tests laufen.',
   'on: push → mvn test',
   ['Du verstehst CI als automatischen Prüfer.','Du kennst eine einfache Workflow-Datei.'],
   ['errors','contracts'],[
   'CI heißt: Die Prüfung läuft auf einem anderen Rechner, sobald du deinen Code hochlädst. Du bekommst grün oder rot zurück.',
   'Die Regeln stehen in einer kleinen Datei. Sie sagt: „Bei jedem Push: Java installieren, Tests starten."',
   'WENN alles grün ist, DANN darf der Code weiter. SONST siehst du sofort, welcher Test scheitert.'
  ],'name: pruefen\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: mvn test','Automatisches Testergebnis',
   'Was passiert bei einem roten Test?',
   'CI ist nicht die Auslieferung selbst. Sie ist nur die automatische Prüfung vor der Auslieferung.',
   'Der Code wird nicht weitergegeben. Du musst den Fehler beheben und erneut speichern.',
   [word('CI','Automatische Prüfung von Code nach jedem Speichern.'),word('Workflow','Eine Datei mit den Schritten für den Automaten.')],
   'https://dev.java/learn/'),

  chapter('docker','delivery','Die Pizzeria in einer Kiste',11,
   'Du willst deine Anwendung einem Freund geben. Bei ihm fehlt Java oder die Einstellungen sind anders.',
   'WENN du eine Anwendung übergeben willst, DANN packe sie mit ihrer Umgebung in eine Kiste.',
   'FROM eclipse-temurin:21\nCOPY app.jar .\nCMD java -jar app.jar',
   ['Du verstehst einen Container als fertige Kiste.','Du kennst ein Dockerfile als Bauanleitung.'],
   ['ownership','contracts'],[
   'Ein Container ist wie eine Umzugskiste: Die Anwendung und alles, was sie braucht, sind drin. Dein Freund muss nur die Kiste öffnen.',
   'Die Bauanleitung heißt Dockerfile. Sie sagt: Nimm Java, lege die Anwendung hinein, starte sie.',
   'WENN die Kiste gebaut ist, DANN läuft sie überall gleich. SONST heißt es „bei mir geht es, bei dir nicht".'
  ],'FROM eclipse-temurin:21\nCOPY target/pizzeria.jar app.jar\nENTRYPOINT ["java","-jar","app.jar"]','Ein lauffähiges Image',
   'Was wäre ohne Container anders?',
   'Ein Container enthält die Laufzeitumgebung, aber keine Geheimnisse. Die kommen später dazu.',
   'Du müsstest Java und Einstellungen auf jedem Rechner neu einrichten – und hättest mehr Fehlerquellen.',
   [word('Container','Eine fertige Kiste mit Anwendung und Umgebung.'),word('Dockerfile','Die Bauanleitung für so eine Kiste.')],
   'https://docs.docker.com/get-started/'),

  chapter('profiles','delivery','Zwei Küchen: zu Hause und im Betrieb',10,
   'Zu Hause benutzt du H2 im Speicher. Im Betrieb soll eine echte Datenbank laufen. Du willst den Code nicht ändern.',
   'WENN Umgebungen verschieden sind, DANN gib ihnen eigene Profile.',
   'spring.profiles.active=dev|prod',
   ['Du verstehst Profile als verschiedene Einstellungssätze.','Du kannst zwischen dev und prod umschalten.'],
   ['contracts'],[
   'Ein Profil ist wie eine Schublade mit Einstellungen. In `dev` nutzt du eine einfache Datenbank, in `prod` die echte.',
   'Der Code bleibt gleich. Du sagst nur beim Start, welche Schublade gilt – zum Beispiel mit einer Umgebungsvariable.',
   'WENN du die Umgebung wechselst, DANN änderst du nur das Profil. SONST baust du zwei Versionen.'
  ],'spring.profiles.active=dev\n# application-prod.properties:\nspring.datasource.url=jdbc:h2:file:./prod','Passende Einstellungen pro Profil',
   'Welches Profil nutzt du zum Entwickeln?',
   'Profile ersetzen keine Geheimnisse. Passwörter gehören nicht in die Properties-Datei.',
   'Das Profil `dev`. Für den echten Betrieb wird `prod` aktiviert.',
   [word('Profil','Ein Satz Einstellungen für eine Umgebung.'),word('dev','Die Umgebung, in der du entwickelst.')],
   'https://dev.java/learn/'),

  chapter('secrets','delivery','Geheimnisse gehören nicht in den Code',10,
   'Das Datenbank-Passwort steht in deiner Datei. Du willst die Anwendung an einen Freund geben – ohne ihm das Passwort zu verraten.',
   'WENN etwas geheim ist, DANN lies es aus der Umgebung. SONST steht es im Code.',
   'spring.datasource.password=${DB_PASSWORD}',
   ['Du verstehst Umgebungsvariablen als externe Geheimnisse.','Du erkennst, warum Passwörter nicht ins Repository gehören.'],
   ['errors','ownership'],[
   'Ein Geheimnis ist wie ein Schlüssel, den du nicht auf die Tür schreibst. Du gibst ihn der Anwendung beim Start – von außen.',
   'In Spring schreibst du `${DB_PASSWORD}`. Der Wert kommt aus der Umgebung des Rechners, nicht aus deiner Datei.',
   'WENN du die Anwendung weiter gibst, DANN bleiben deine Geheimnisse bei dir. SONST hat sie jeder.'
  ],'spring.datasource.password=${DB_PASSWORD}\n# Start: DB_PASSWORD=geheim java -jar app.jar','Passwort kommt von außen',
   'Was passiert, wenn die Variable fehlt?',
   'Ein Platzhalter ist kein Standardwert. Wenn niemand den Wert gibt, startet die Anwendung nicht – das ist gewollt.',
   'Die Anwendung startet nicht oder meldet einen Fehler. Du merkst sofort, dass etwas fehlt.',
   [word('Geheimnis','Ein Wert, den niemand außer der Anwendung sehen soll.'),word('Umgebungsvariable','Ein Wert, den du dem Programm beim Start von außen gibst.')],
   'https://dev.java/learn/'),

  chapter('frontend','frontend','Ein Fenster für Gäste',11,
   'Deine Pizzeria antwortet mit JSON. Gäste wollen aber etwas ansehen, ohne JSON zu lesen.',
   'WENN ein Gast die Anwendung nutzen will, DANN zeige ihm eine einfache Seite.',
   'fetch("/pizzen").then(...)',
   ['Du verstehst, dass eine Seite Daten vom Server holen kann.','Du kennst fetch als Anfrage aus dem Browser.'],
   ['contracts','async'],[
   'Ein kleines HTML-Fenster kann deine API fragen: „Gib mir die Pizzen." Der Browser holt das JSON und zeigt es als Liste.',
   'Das macht deine Anwendung nicht komplizierter – sie bekommt nur ein Gesicht. Die Regeln bleiben im Server.',
   'WENN der Gast die Seite öffnet, DANN fragt sie die Daten ab. SONST sieht er eine leere Liste.'
  ],'fetch("/pizzen")\n  .then(r => r.json())\n  .then(p => document.body.innerText = p.join(", "));','Salami, Käse, Pilze',
   'Wo stehen die Regeln für die Pizzen?',
   'Das Frontend soll keine Preise berechnen. Es zeigt nur, was der Server ihm gibt.',
   'Auf dem Server. Die Seite zeigt nur das Ergebnis.',
   [word('Frontend','Der Teil, den der Gast im Browser sieht.'),word('fetch','Eine Anfrage aus dem Browser an den Server.')],
   'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'),

  chapter('go-live','frontend','Der erste echte Gast',12,
   'Die Anwendung läuft, die Tests sind grün, die Daten bleiben gespeichert. Jetzt darf sie jemand anderes benutzen.',
   'WENN alles geprüft ist, DANN kannst du deine Pizzeria veröffentlichen. SONST behebe zuerst die offenen Punkte.',
   'Checkliste: Tests grün · Profil prod · Geheimnisse extern · Health-Check OK',
   ['Du kannst eine Veröffentlichungs-Checkliste anwenden.','Du verstehst, dass Betrieb mehr ist als "es läuft".'],
   ['contracts','errors','ownership'],[
   'Geh die Liste durch: Tests grün, richtige Einstellungen, keine Passwörter im Code, Health-Check erreichbar. Dann ist dein Laden bereit.',
   'Band 1 hat dir beigebracht, wie man Regeln in Code übersetzt. Band 2 hat gezeigt, was ein Programm braucht, um für andere zu funktionieren.',
   'WENN ein echter Gast kommt, DANN beobachtest du erst einmal. SONST übersiehst du, was er wirklich braucht.'
  ],'GET /actuator/health → UP\nGET /pizzen → ["Salami","Käse"]','Deine Pizzeria ist erreichbar',
   'Was würdest du als erstes beobachten, wenn ein Gast den Laden nutzt?',
   'Veröffentlichen ist kein Endpunkt, sondern ein Übergang. Du darfst weiter lernen und verbessern.',
   'Ob er die Speisekarte findet und versteht, was passiert. Danach kommen neue Wünsche – und Band 3.',
   [word('Veröffentlichung','Die Anwendung anderen Menschen zugänglich machen.'),word('Checkliste','Eine Liste mit Punkten, die du vorher prüfst.')],
   'https://dev.java/learn/')
 ]
};
