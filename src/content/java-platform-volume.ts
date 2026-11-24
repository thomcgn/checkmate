import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';
type Section=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type Check=readonly [question:string,answer:string,reason:string];
type Manuscript={id:string;title:string;source:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Check[];exercise:string;solution:string};
/** Original German book content, with official JDK reference links for editorial review. */
const MANUSCRIPTS:readonly Manuscript[]=[
{
 id:'java-inheritance',title:'Java: Vererbung, Interfaces und Polymorphie',
 source:'https://dev.java/learn/language/oop/inheritance/',
 objectives:['Subtypbeziehungen von fachlicher Rollenmodellierung unterscheiden.','Interface-Verträge, Überschreiben und dynamische Bindung nachvollziehen.','Vererbung gegenüber Komposition anhand von Änderbarkeit und Kopplung bewerten.'],
 sections:[
 ['is-a','Vererbung ist eine fachliche Typbeziehung',
 'Eine Unterklasse erweitert eine Oberklasse und kann deren zugängliche Methoden verwenden oder überschreiben. Diese Beziehung ist nur sinnvoll, wenn sich ein Objekt der Unterklasse in allen relevanten Situationen als Objekt der Oberklasse verwenden lässt. Bei einer Veranstaltung kann ein Konzert fachlich eine Eventart sein; ein Veranstaltungsort ist dagegen kein Event, nur weil beide eine ID besitzen. Eine Vererbungsstruktur sollte die Bedeutung der Domäne wiedergeben und nicht bloß Codewiederverwendung erzwingen.',
 'Java besitzt einfache Klassenvererbung: Eine Klasse erweitert höchstens eine direkte Klasse, kann aber mehrere Interfaces implementieren. Eine gemeinsame Implementierung kann eine abstrakte Oberklasse rechtfertigen, doch sie erzeugt stärkere Kopplung als ein kleines Interface. Wenn verschiedene Objekte lediglich eine Rolle wie HasTitle oder Schedulable erfüllen sollen, ist ein Interface oft die präzisere Abstraktion. Die Wahl betrifft, welche Annahmen andere Teile des Programms über den Typ treffen dürfen.',
 'interface Schedulable { LocalDate date(); }\nrecord Workshop(String title, LocalDate date) implements Schedulable {}',
 'Workshop erfüllt einen fachlichen Vertrag, ohne eine gemeinsame konkrete Oberklassenimplementierung zu benötigen. LocalDate erfordert einen Import.'],
 ['dispatch','Ein Interface-Aufruf verwendet die konkrete Implementierung',
 'Eine Variable vom Typ Schedulable kann auf unterschiedliche Klassen zeigen, die den Vertrag implementieren. Beim Aufruf date() wird die Implementierung des tatsächlich referenzierten Objekts verwendet. Das ist eine Form von Polymorphie und erlaubt es, Code gegen eine fachliche Schnittstelle zu schreiben, statt jede konkrete Eventart mit instanceof zu unterscheiden. Eine Methode, die nur das Datum benötigt, sollte nicht von allen Details einer Workshop- oder Konzertklasse abhängig sein.',
 'Method Overloading und Overriding sind dabei verschieden. Überladen bedeutet, dass Methoden nach Parametern unterschiedliche Signaturen besitzen; die Auswahl ist wesentlich durch die statischen Typen am Aufruf geprägt. Überschreiben bedeutet, dass eine Unterklasse die geerbte Instanzmethode entsprechend den Java-Regeln neu implementiert. Die Annotation @Override zeigt die Absicht und lässt den Compiler prüfen, ob tatsächlich ein geeigneter Vertrag überschrieben wird. Ein gleichnamiger Methodenname reicht dafür nicht aus.',
 'interface Displayable { String label(); }\nfinal class EventLabel implements Displayable {\n    @Override public String label() { return "Workshop"; }\n}\nDisplayable display = new EventLabel();\nSystem.out.println(display.label());',
 'Der Aufruf erfolgt über die Interface-Variable, aber die konkrete Implementierung stammt aus EventLabel.'],
 ['default','Defaultmethoden lösen nicht jede Kompositionsfrage',
 'Interfaces können Defaultmethoden bereitstellen, die aus anderen vertraglich vorausgesetzten Methoden ein Standardverhalten erzeugen. Ein Interface könnte beispielsweise eine kurze Anzeige aus dem Titel zusammensetzen. Das kann wiederholten Code vermeiden, sollte aber nur eine fachlich passende Voreinstellung liefern. Bei mehreren geerbten Defaultmethoden mit kollidierenden Signaturen verlangen die Sprachregeln eine klare Auflösung. Eine Klasse kann nicht beliebig widersprüchliches Verhalten unbemerkt übernehmen.',
 'Auch abstrakte Klassen können gemeinsame Implementierungen und Felder enthalten. Ihre Konstruktion und Lebensdauer folgen aber den normalen Klassenregeln, weshalb Änderung einer Basisklasse viele Unterklassen beeinflussen kann. Wenn die gemeinsame Fähigkeit unabhängig von Objektidentität und Zustandslayout ist, ist Komposition häufig einfacher: Ein Event hält beispielsweise ein PricingPolicy-Objekt, statt von einer tiefen Klasse für jede Preisvariante zu erben. Damit wird aus einer starren Hierarchie ein austauschbarer Vertrag.',
 'interface Named {\n    String name();\n    default String greeting() { return "Hallo " + name(); }\n}',
 'Die Defaultmethode benutzt ausschließlich das Interface-Versprechen name().'],
 ['design','Liskov-Substitution ist eine Denkregel für öffentliche APIs',
 'Wenn eine Unterklasse eine Methode überschreibt, darf sie nicht stillschweigend ein Ergebnis liefern, das dem vom Basistyp versprochenen Vertrag widerspricht. Ein Eventtyp, der von einer anderen Komponente als Schedulable verwendet wird, muss dessen zugesichertes Datumsverhalten tatsächlich liefern. Der Compiler prüft Signaturen, aber keine vollständigen Geschäftsbedingungen. Eine Methode kann denselben Rückgabetyp besitzen und trotzdem fachlich fehlerhaft sein. Deshalb gehören invariantenbasierte Tests zu jeder wirklich verwendeten Abstraktion.',
 'Vermeide ein übergroßes Interface mit allen möglichen Fähigkeiten, nur weil mehrere konkrete Klassen einige davon besitzen. Trenne Rollen nach tatsächlichem Bedarf und benutze kleine Tests gegen den Interface-Typ. Eine gute polymorphe API ist einfach zu lesen: Sie sagt, welches Verhalten der Aufrufer benötigt, nicht wie viele Felder die konkrete Klasse besitzt. Vererbung wird damit ein Mittel zum korrekten Modellieren und nicht zur bloßen Minimierung von Zeilenzahlen.',
 'static boolean isFuture(Schedulable item, LocalDate today) {\n    return !item.date().isBefore(today);\n}',
 'Die Methode verlangt nur das Datum und funktioniert für jede gültige Schedulable-Implementierung.']
 ],
 checks:[
 ['Kann eine Java-Klasse mehrere konkrete Oberklassen direkt erweitern?','Nein, Klassenvererbung ist einfach, Interfaces können mehrfach implementiert werden.','Eine Klasse kann mehrere Verhaltensverträge erfüllen, ohne mehrere Superklassen zu besitzen.'],
 ['Was prüft @Override beim Übersetzen?','Dass tatsächlich eine geeignete Methode überschrieben oder ein Interfacevertrag implementiert wird.','Gleichnamige, aber unpassende Signaturen würden sonst leichter unbemerkt bleiben.'],
 ['Weshalb sollte man nicht jede gemeinsam genutzte Methode in eine Oberklasse verlagern?','Weil Wiederverwendung nicht automatisch eine fachlich korrekte Subtypbeziehung begründet.','Komposition und kleinere Interfaces können Kopplung und falsche Annahmen reduzieren.']
 ],
 exercise:'Entwerfe zwei Eventtypen Workshop und Concert, die einen kleinen gemeinsamen Terminvertrag implementieren. Schreibe eine Methode upcoming(List<? extends Schedulable>, LocalDate), die unabhängig vom konkreten Typ zukünftige Einträge auswählt. Begründe, warum ein Venue kein Schedulable sein muss, selbst wenn es ebenfalls eine ID besitzt.',
 solution:'Definiere interface Schedulable { LocalDate date(); }, zwei Records oder Klassen mit date() und die Methode über Stream oder Schleife. Prüfe Nullvorbedingungen und die Datumsgrenze. Das Interface ist nach dem tatsächlich benötigten Verhalten zu wählen; eine gemeinsame ID allein macht den Venue nicht zu einer zeitlich planbaren Veranstaltung.'
},
{
 id:'java-lambdas',title:'Java: Lambdas, Methodenreferenzen und funktionale Interfaces',
 source:'https://dev.java/learn/lambdas/',
 objectives:['Ein funktionales Interface und einen Lambda-Ausdruck korrekt verknüpfen.','Methodenreferenzen nach ihrer Signatur statt nur nach Kürze auswählen.','Captures, Seiteneffekte und effektive Finalität verständlich erklären.'],
 sections:[
 ['contract','Ein Lambda braucht einen Zielvertrag',
 'Ein Lambda-Ausdruck in Java erhält seine Bedeutung aus einem funktionalen Interface, dessen abstrakter Methodenvertrag zur Signatur passt. Predicate<T> beschreibt beispielsweise eine Bedingung mit einem booleschen Ergebnis. Function<T,R> bildet einen Eingabewert auf einen Rückgabewert ab; Consumer<T> nimmt Werte entgegen und liefert keinen Rückgabewert. Diese Unterscheidung hilft bei Stream-Operationen: filter erwartet eine Entscheidung, map eine Transformation und forEach eine Aktion. Der Methodenname allein ersetzt keine Betrachtung der tatsächlichen Typen.',
 'Mit @FunctionalInterface kann eine eigene Schnittstelle erklären, dass genau ein geeigneter abstrakter Methodenvertrag vorgesehen ist. Ein Interface darf dabei zusätzlich Default- und statische Methoden besitzen. Ein Lambda ist nicht einfach eine beliebige Funktion ohne Typ: Der Compiler prüft, ob die vorgegebene Zielsignatur erfüllt ist. Das macht den Einsatz flexibel, verlangt aber eine klare Wahl der Abstraktion.',
 'Predicate<String> usable = text -> text != null && !text.isBlank();\nSystem.out.println(usable.test("Ada"));',
 'Das Lambda implementiert den Testvertrag von Predicate<String>. Für das vollständige Beispiel java.util.function.Predicate importieren.'],
 ['references','Methodenreferenzen sind eine lesbare Kurzform',
 'Ein Ausdruck wie String::isBlank kann an eine Stelle passen, die ein Predicate<String> erwartet, weil die Methode für einen String-Empfänger eine boolesche Antwort liefert. Eine Methodenreferenz ist sinnvoll, wenn der Name der aufgerufenen Methode die Absicht bereits deutlich beschreibt. Ein Lambda ist dagegen oft klarer, wenn zusätzliche Bedingungen oder Transformationen nötig sind. Es gibt keinen technischen Grund, jede kurze Lambda-Form zwangsweise in eine Methodenreferenz umzuschreiben.',
 'Unterscheide Verweise auf statische Methoden, gebundene Instanzmethoden und ungebundene Instanzmethoden. Bei String::trim wird der String vom funktionalen Vertrag als Empfänger geliefert; bei existingObject::method ist der Empfänger bereits festgelegt. Die Auswahl richtet sich nach den Parametern des funktionalen Interfaces. Ein Kompilierfehler an einer Methodenreferenz kann darauf hinweisen, dass die beabsichtigte Beziehung zwischen Eingabe- und Rückgabetyp nicht korrekt beschrieben ist.',
 'List<String> cleaned = titles.stream()\n    .filter(Objects::nonNull)\n    .map(String::trim)\n    .filter(text -> !text.isEmpty())\n    .toList();',
 'Jede Operation hat einen anderen Vertrag: Filter, Transformation und erneuter Filter. Die Ergebnisliste ist nicht veränderbar.'],
 ['capture','Ein Capture bewahrt eine Bindung unter klaren Regeln',
 'Ein Java-Lambda kann lokale Variablen seines umschließenden Bereichs erfassen, sofern sie final oder effektiv final sind. Eine lokale Variable, die nach ihrer Initialisierung nicht neu zugewiesen wird, gilt dabei als effektiv final. Das verhindert bestimmte widersprüchliche Annahmen über lokale Variablen, wenn ein Lambda später ausgeführt wird. Ein Objekt, auf das eine solche Variable verweist, kann dennoch veränderbar sein; die Regel schützt die Bindung, nicht jedes Objekt tief vor Mutation.',
 'Gerade bei parallelen oder verzögerten Abläufen sind Seiteneffekte gefährlich. Wenn ein Lambda eine externe ArrayList verändert, kann das bei Streams oder asynchroner Verarbeitung zu Rennen und schwer verständlichen Ergebnissen führen. Besser ist häufig eine Pipeline, die Eingaben zu Ergebnissen transformiert und ihre Resultate über einen Collector zusammensetzt. Wo expliziter gemeinsamer Zustand notwendig ist, muss dieser nach eigenen Synchronisationsregeln behandelt werden.',
 'String prefix = "Event: ";\nFunction<String,String> label = title -> prefix + title;\nSystem.out.println(label.apply("Ada"));',
 'prefix bleibt effektiv final; der Ausdruck benutzt seine Bindung zur Erzeugung eines neuen Ergebnisses.'],
 ['design','Lambdas sollen Fachregeln lesbarer machen',
 'Eine lange Lambda-Funktion mit mehreren if-Verzweigungen, Exceptions und Nebenwirkungen ist selten leichter verständlich als eine benannte Methode. Wenn die Prüfung eines Eventtitels einen eigenen fachlichen Namen besitzt, kann eine Methodenreferenz darauf die Absicht besser ausdrücken. Dadurch ist die Regel unabhängig testbar und sowohl in einer Stream-Pipeline als auch in einer normalen Schleife wiederverwendbar. Functional Programming ist kein Wettbewerb um die meisten Operatoren in einer Zeile.',
 'Wähle für APIs geeignete funktionale Interfaces, wenn die Funktion tatsächlich ein austauschbares Verhalten erwartet. Ein Comparator<Event> ist beispielsweise passend für unterschiedliche Sortierregeln. Ein Consumer<Event> ist dagegen ungeeignet, wenn aus dem Event ein neuer geprüfter Datensatz entstehen soll. Übe daher vor jeder Lambda-Schreibweise die Frage: Produziert meine Funktion einen Wert, prüft sie eine Bedingung oder führt sie eine Aktion aus?',
 'Comparator<String> byLength = Comparator.comparingInt(String::length);\nList<String> ordered = titles.stream().sorted(byLength).toList();',
 'Der Comparator ist eine explizite Strategie für die Reihenfolge. Für das vollständige Beispiel Comparator und List importieren.']
 ],
 checks:[
 ['Welcher Vertrag passt am besten für filter?','Predicate<T>.','Ein Filter benötigt eine boolesche Entscheidung pro Element.'],
 ['Dürfen Java-Lambdas lokale Variablen erfassen, die später beliebig neu zugewiesen werden?','Nein, lokale Captures müssen final oder effektiv final sein.','Der Compiler prüft diese Bindungsregel.'],
 ['Ist String::trim grundsätzlich besser als title -> title.trim()?','Nein.','Beide können passend sein; entscheidend sind Lesbarkeit und der verlangte funktionale Vertrag.']
 ],
 exercise:'Schreibe einen Event-Titel-Import über Stream mit Nullfilter, Trim, Blankfilter, Duplikatregel und Sortierung. Verwende passende Lambdas und Methodenreferenzen und erkläre deren jeweilige Zielinterfaces. Lege fest, ob die Ergebnisliste veränderbar sein soll.',
 solution:'Starte mit titles.stream(), filter(Objects::nonNull), map(String::trim), filter(Predicate.not(String::isBlank)) beziehungsweise einem geeigneten Lambda, distinct, sorted und toList. Wenn das Ergebnis veränderbar sein muss, konstruiere eine ArrayList aus der Ausgabe. Tests müssen bei Strings die vereinbarte Gleichheit und den Umgang mit leeren Eingaben prüfen.'
},
{
 id:'java-file-io',title:'Java: Path, Files und kontrollierte Dateioperationen',
 source:'https://dev.java/learn/java-io/',
 objectives:['Path als Dateiadresse und Files als Operations-API unterscheiden.','Textkodierung, Fehlerbehandlung und Ressourcenbesitz festlegen.','Sichere Speicherstrategien sowie Datenvalidierung nach dem Lesen entwerfen.'],
 sections:[
 ['paths','Ein Pfad ist nicht die Datei selbst',
 'Die moderne Java-Dateisystem-API verwendet Path als Beschreibung eines Speicherorts. Path.of("data","events.txt") erstellt zunächst nur eine Pfadinstanz und öffnet keine Datei. Erst Files.readString, Files.newBufferedReader oder andere Operationen führen tatsächliche Zugriffe aus. Dieser Unterschied hilft, Pfadberechnung und I/O als getrennte Aufgaben zu modellieren. Ein Path kann nicht existieren oder auf einen Ordner statt eine reguläre Datei zeigen; die Operation muss daher mit passenden Fehlerfällen umgehen.',
 'Relative Pfade hängen vom aktuellen Arbeitsverzeichnis des Prozesses ab. Das kann zwischen IDE, Terminal, Testlauf und verpackter Desktop-App variieren. Überlasse einen wichtigen Speicherordner deshalb nicht einer versteckten Annahme. Für Nutzerdateien sollte die App einen ausdrücklich gewählten oder konfigurierten Basisordner besitzen. Bei Pfaden aus externen Namen dürfen Traversal-Segmente und Symlinks Sicherheitsfragen aufwerfen; die richtige Prüfung hängt vom konkreten Vertrauensmodell ab.',
 'Path root = Path.of("data");\nPath file = root.resolve("events.txt");\nSystem.out.println(file.getFileName());',
 'Die Operationen auf Path verändern noch keine Datei.'],
 ['encoding','Textdaten benötigen ein vereinbartes Encoding',
 'Files.readString liest Text und verwendet passende Kodierungsregeln; für plattformübergreifend gespeicherte Inhalte lohnt sich ein ausdrücklich benanntes Charset wie StandardCharsets.UTF_8. Ohne klare Konvention können Umlaute oder andere Unicode-Zeichen später beschädigt gelesen werden. Ein Schreiben über Files.writeString ist bequem für kleine Dateien, kann aber einen vorhandenen Inhalt ersetzen. Eine Fachanwendung muss festlegen, wann Überschreiben erlaubt ist und ob ein versehentlich verlorener Datensatz wiederhergestellt werden können muss.',
 'Für große Dateien ist es häufig besser, Zeilen oder Chunks kontrolliert zu lesen, statt die gesamte Datei als String im Speicher zu halten. Ein Stream von Zeilen kann Ressourcen besitzen, die geschlossen werden müssen. Ein normales Files.readString verwaltet die Leseoperation dagegen intern. Die Wahl hängt von Größe, Fehlerverhalten und gewünschter Verarbeitung ab. Eine Formulierung wie liest Dateien ist für einen belastbaren API-Vertrag zu grob: Eingabeformat, Encoding und Größenlimit gehören dazu.',
 'String content = Files.readString(file, StandardCharsets.UTF_8);\nSystem.out.println(content.length());',
 'Für das vollständige Beispiel sind Imports und ein passender throws-/catch-Vertrag für IOException erforderlich.'],
 ['resources','try-with-resources regelt die Lebensdauer',
 'Wenn du einen BufferedReader, InputStream oder einen Files.lines-Stream öffnest, muss die zugehörige Ressource ordnungsgemäß geschlossen werden. try-with-resources ruft am Ende des Blocks close auf, auch wenn im Block ein Fehler auftritt. Das ist zuverlässiger als manuelle close-Aufrufe nur nach dem erfolgreichen Leseweg. Es ist besonders nützlich, wenn mehrere Rückgabepfade existieren oder ein Stream erst während der Iteration einen Fehler auslöst.',
 'try-with-resources kann mehrere Ressourcen verwalten und bewahrt bei einem Fehler während des Blocks zusätzliche Close-Fehler als suppressed Exceptions auf. Solche Details sind für Diagnose und Wartbarkeit relevant. Die Regel ist jedoch nicht, jedes beliebige Objekt in try-with-resources zu packen: Es muss AutoCloseable implementieren. Eine Library-Methode, die die Ressource bereits vollständig intern verwaltet, braucht vom Aufrufer keine zusätzliche close-Anweisung.',
 'try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {\n    String first = reader.readLine();\n    System.out.println(first);\n}',
 'Die Reader-Ressource wird beim Verlassen des Blocks geschlossen. IOException bleibt ein sichtbarer Fehlervertrag.'],
 ['saving','Schreiben ist nicht schon durch Serialisierung erfolgreich',
 'Eine Anwendung kann ein Eventobjekt erfolgreich in Text umwandeln und beim anschließenden Schreiben trotzdem scheitern. Eine volle Festplatte, fehlende Berechtigung oder ein unerwarteter Abbruch gehören zum Speichervertrag. Für wichtige Dateien kann ein temporärer Schreibpfad mit anschließendem kontrolliertem Austausch eine robustere Strategie sein als das direkte Überschreiben. ATOMIC_MOVE ist dabei nicht auf jedem Provider und jeder Kombination aus Pfaden unterstützt; auch Atomizität ist keine allgemeine Garantie dauerhafter Datensicherung.',
 'Nach dem Lesen muss außerdem die fachliche Form geprüft werden. Ein erfolgreich decodierter Text kann ungültiges JSON oder unvollständige Daten enthalten. Trenne den Files-Layer daher von einem Parser für die gewählte Datenstruktur. Tests sollten fehlende Dateien, Berechtigungsprobleme, leere Dateien, zu große Daten und beschädigte Inhalte berücksichtigen. So entsteht eine ehrliche Aussage darüber, wann eine Operation tatsächlich als gespeichert oder geladen gelten darf.',
 'Path temporary = file.resolveSibling(file.getFileName() + ".tmp");\nFiles.writeString(temporary, "example", StandardCharsets.UTF_8);\nFiles.move(temporary, file, StandardCopyOption.REPLACE_EXISTING);',
 'Der vereinfachte Austausch ist nicht automatisch atomar. Für eine echte Speicherstrategie sind die genauen Dateisystemgarantien zu prüfen.']
 ],
 checks:[
 ['Öffnet Path.of("events.txt") unmittelbar eine Datei?','Nein.','Path beschreibt nur einen möglichen Speicherort.'],
 ['Warum gehört ein Files.newBufferedReader oft in try-with-resources?','Der Reader besitzt eine Ressource und muss geschlossen werden.','Try-with-resources sichert die Abschlussoperation über normale und fehlerhafte Pfade.'],
 ['Garantiert ein erfolgreicher Files.readString-Aufruf eine gültige Eventstruktur?','Nein.','Textlesen und fachliches Parsen beziehungsweise Validieren sind unterschiedliche Schritte.']
 ],
 exercise:'Entwerfe EventFileStore mit load(Path), das UTF-8 liest, ein vereinbartes Datenformat validiert und fehlende Datei, fehlerhafte Daten sowie IOException unterscheidet. Skizziere eine sichere Save-Operation über temporäre Datei und Austausch. Dokumentiere, welche Atomizitätsannahmen zulässig sind.',
 solution:'Nutze Files.readString(path, StandardCharsets.UTF_8), wandle danach über einen expliziten Parser in Eventdaten und lasse ungültige Form als eigenen Vertragsfehler sichtbar werden. Bei Save schreibe zunächst in eine temporäre Datei im Zielverzeichnis und tausche erst bei vollständiger Vorbereitung. Beachte, dass ATOMIC_MOVE optional und ein einfacher Replace nicht automatisch crash-sicher ist.'
},
{
 id:'java-date-time',title:'Java: LocalDate, Instant, Duration und Zeitzonen',
 source:'https://dev.java/learn/date-time/',
 objectives:['Datum, Zeitpunkt und Dauer als verschiedene Typen erklären.','LocalDate und Instant nicht ohne Zeitzonenregel ineinander umwandeln.','Zeitabhängige Logik durch Clock und feste Stichtage testbar machen.'],
 sections:[
 ['types','Ein Kalendertag ist kein eindeutiger Zeitpunkt',
 'LocalDate beschreibt einen Kalendertag ohne Uhrzeit und Zeitzone. Für ein Event, das am 24. November stattfindet, kann das fachlich ausreichen. Instant bezeichnet dagegen einen eindeutigen Zeitpunkt auf der UTC-Zeitleiste. Wer beide Typen vermischt, riskiert Fehler beim Sortieren, Speichern und Anzeigen. Ein Datum ohne Zone lässt sich nicht allein in den richtigen Instant umwandeln: Die lokale Uhrzeit und eine bestimmte Zone gehören ebenfalls zur Entscheidung.',
 'Duration beschreibt eine zeitliche Menge zwischen Zeitpunkten, während Period kalenderorientierte Mengen wie Monate oder Jahre ausdrücken kann. Ein Monat besitzt keine feste Anzahl von Sekunden; deshalb ist Period.ofMonths(1) nicht gleich einer konstanten Duration. Ein zuverlässiges API entscheidet zuerst, welche Zeitart die Fachfrage verlangt. Eine Teilnehmerfrist um Mitternacht in Münster benötigt mehr Kontext als einen nackten LocalDate-Wert.',
 'LocalDate day = LocalDate.of(2026, 11, 24);\nInstant moment = Instant.parse("2026-11-24T12:00:00Z");\nDuration hour = Duration.ofHours(1);',
 'Die drei Typen modellieren Tag, absoluten Zeitpunkt und Dauer, nicht dieselbe Sache.'],
 ['zones','Zeitzonen beschreiben Regeln, nicht nur Offsets',
 'ZoneId.of("Europe/Berlin") bezeichnet eine Region mit historischen und gegebenenfalls künftigen Regeln für Offsets und Sommerzeit. Ein festes ZoneOffset wie +01:00 ist dagegen nur eine konkrete Verschiebung zu UTC. Bei künftigen Veranstaltungsterminen kann es wichtig sein, die Region zu speichern, weil sich der jeweilige Offset mit dem Datum ändert. Eine im Januar vereinbarte lokale Uhrzeit lässt sich nicht allein mit dem Offset des heutigen Tages korrekt umrechnen.',
 'Bei einer lokalen Uhrzeit während des Sommerzeitwechsels können bestimmte Zeiten doppelt existieren oder übersprungen werden. Deshalb sollte eine Anwendung, die lokale Veranstaltungen plant, die Regeln zur Auflösung von Lücken und Überlappungen ausdrücklich festlegen. ZonedDateTime kann diese Beziehung zwischen LocalDateTime, ZoneId und Instant darstellen. Für die Datenbank ist zu entscheiden, ob der Ursprungstermin als lokale Veranstaltung in einer Region oder als absoluter Zeitpunkt erhalten bleiben muss.',
 'LocalDateTime local = LocalDateTime.of(2026, 11, 24, 19, 0);\nZoneId zone = ZoneId.of("Europe/Berlin");\nZonedDateTime eventTime = local.atZone(zone);\nInstant utc = eventTime.toInstant();',
 'Die Region legt die für den konkreten Termin gültige Umrechnung fest.'],
 ['clock','Tests brauchen eine kontrollierbare Zeitquelle',
 'LocalDate.now() liest die aktuelle Systemzeit unter einer passenden Zone. In einem Test kann das Ergebnis morgen anders sein als heute. Eine Methode, die künftige Events filtert, sollte deshalb einen Stichtag als Parameter erhalten oder mit einer injizierten Clock arbeiten. Clock.fixed erzeugt eine kontrollierbare Zeitquelle für reproduzierbare Tests. Dadurch wird aus einem zufälligen Echtzeitvergleich eine bewusst definierte Fachregel.',
 'Prüfe die Grenze eines Ereignisses am heutigen Tag: Soll es eingeschlossen sein oder erst ab dem folgenden Tag gelten? Die entsprechende Bedingung !date.isBefore(today) ist etwas anderes als date.isAfter(today). Ein Test mit gestern, heute und morgen macht die Entscheidung sichtbar. Ebenso sind Zeitzonenfehler oft nur an den Tagesgrenzen zu erkennen. Eine Kontrollzeitquelle erlaubt es, diese Randfälle reproduzierbar durchzuspielen.',
 'Clock clock = Clock.fixed(Instant.parse("2026-11-24T10:00:00Z"), ZoneId.of("Europe/Berlin"));\nLocalDate today = LocalDate.now(clock);',
 'Die Anwendung ist im Test unabhängig vom realen Ausführungsdatum.'],
 ['contracts','Zeiten verdienen ein fachliches Speicherschema',
 'Ein Veranstaltungseintrag könnte localDateTime und zoneId speichern, wenn die vereinbarte lokale Uhrzeit der entscheidende Vertrag ist. Ein protokollierter Login-Zeitpunkt ist dagegen häufig als Instant natürlicher. Eine Dauer wie 90 Minuten sollte nicht als unkommentierte Zahl mit unklarer Einheit durch die Anwendung wandern. Duration.ofMinutes(90) beschreibt ihre Bedeutung präziser. Der Datentyp ist ein Werkzeug, aber die Fachentscheidung bleibt explizit.',
 'Bei JSON- und Datenbankgrenzen müssen Format, Zone und mögliche Präzision vereinbart sein. Ein Offset-String ist nicht automatisch identisch mit einer Region. Wer historische oder weit in der Zukunft liegende Termine verwaltet, sollte die relevanten Zeitzonenregeln berücksichtigen. Tests gehören an Sommerzeitwechsel, End-of-Month-Grenzen und die Einschlussregel einer Datumsfilterung. Damit vermeidest du die verbreitete Fehlerquelle, Uhrzeit wie einen harmlosen Integer zu behandeln.',
 'record ScheduledEvent(LocalDateTime localStart, ZoneId zone) {\n    Instant startInstant() { return localStart.atZone(zone).toInstant(); }\n}',
 'Der Record bewahrt die lokale Zeit und die gewünschte Region; die Umwandlungsregel ist zentralisiert.']
 ],
 checks:[
 ['Beschreibt LocalDate einen eindeutigen Zeitpunkt auf der UTC-Zeitleiste?','Nein.','Es ist ein Kalendertag ohne Uhrzeit und Zeitzone.'],
 ['Ist ZoneId.of("Europe/Berlin") mit einem festen Offset +01:00 identisch?','Nein.','Die Region besitzt datumsabhängige Regeln und kann unterschiedliche Offsets haben.'],
 ['Warum sollte ein Eventfilter im Test eine feste Clock oder einen Stichtag nutzen?','Damit seine Ergebnisse reproduzierbar sind.','Grenzfälle dürfen nicht vom zufälligen Ausführungsdatum abhängen.']
 ],
 exercise:'Implementiere upcoming(List<ScheduledEvent>, Clock), die Events ab dem über Clock bestimmten heutigen Berliner Kalendertag einschließt. Teste vor, auf und nach der Datumsgrenze sowie einen Wechsel zwischen Sommer- und Winterzeit. Erläutere die Unterscheidung zwischen LocalDate und Instant.',
 solution:'Nutze LocalDate.now(clock.withZone(ZoneId.of("Europe/Berlin"))) als Stichtag, prüfe Events und die gewünschte Zone und filtere mit !localStart.toLocalDate().isBefore(today) gemäß Vertrag. Verwende Clock.fixed für feste Tests. Prüfe bei Zeitumrechnung gesondert, wie Lücken und Überlappungen in der gewählten Region behandelt werden.'
}
];
export const JAVA_PLATFORM_VOLUME:readonly AuthoredLesson[]=MANUSCRIPTS.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:34,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({id,title,paragraphs:[first,second],code,annotation})),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:'java',name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Ein Java-21+-Beispiel aus dem Kapitel mit ausführlicher Herleitung, fachlichen Entscheidungen und Grenzfällen in den einzelnen Abschnitten.',
  differences:'Die Java-Typregeln, das JDK-I/O-Modell und die Zeit-/Lambda-Semantik müssen nach ihren eigenen Verträgen verstanden werden, nicht nur über Ähnlichkeiten mit anderen Sprachen.',
  equivalence:'related',docs:item.source
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
