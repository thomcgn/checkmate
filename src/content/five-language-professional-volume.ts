import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';
type Language='csharp'|'cpp'|'php'|'go'|'kotlin';
type Section=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type Check=readonly [question:string,answer:string,reason:string];
type Manuscript={language:Language;id:string;title:string;source:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Check[];exercise:string;solution:string};
const MANUSCRIPTS:readonly Manuscript[]=[
{
 language:'csharp',id:'cs-records',title:'C#: Records, Wertgleichheit und unveränderliche Zustände',
 source:'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record',
 objectives:['Record Class und Record Struct nach ihrem Wertmodell unterscheiden.','Wertgleichheit, with und verschachtelte Kopien nachvollziehen.','Hash-Schlüssel und fachliche Identität zuverlässig modellieren.'],
 sections:[
 ['values','Wertgleichheit benötigt einen fachlichen Vertrag',
 'Ein C#-Record besitzt eine vom Compiler unterstützte wertorientierte Gleichheitssemantik. Zwei getrennt erzeugte Recordwerte können deshalb aufgrund ihrer Bestandteile gleich sein, obwohl sie nicht dieselbe Objektreferenz darstellen. Das macht Records besonders für Domänenwerte wie EventKey geeignet. Eine gewöhnliche Klasse benutzt dagegen ohne passende Überschreibung grundsätzlich Referenzgleichheit. Die Unterscheidung ist fachlich wichtig: Zwei Events mit gleichem Titel müssen nicht identisch sein, wenn ihre IDs verschieden sind.',
 'Eine record class bleibt trotz Wertgleichheit ein Referenztyp. Eine record struct besitzt dagegen Struct-Wertsemantik. Bei der Entscheidung für einen dieser Typen geht es deshalb um mehr als eine kurze Deklaration. Berücksichtige Objektgröße, Mutabilität, Identität und die erwarteten Kopieroperationen. Für einen Datenbankdatensatz mit eigenständigem Lebenszyklus können andere Gleichheitsregeln sinnvoll sein als für einen kleinen unveränderlichen Schlüssel. Der Compiler kennt die Domänenbedeutung nicht.',
 'public record EventKey(string Title, DateOnly Day);\nvar first = new EventKey("Ada", new DateOnly(2026,12,1));\nvar second = new EventKey("Ada", new DateOnly(2026,12,1));\nConsole.WriteLine(first == second); // True',
 'Der Typ generiert einen wertbasierten Gleichheitsvertrag, der für gleich aufgebaute Schlüssel sinnvoll ist.'],
 ['with','with erzeugt einen neuen äußeren Wert',
 'Mit einem with-Ausdruck kann ein Recordwert auf Basis eines vorhandenen Werts mit geänderten Properties konstruiert werden. Ein Eventtitel kann so geändert werden, ohne die ursprüngliche Recordinstanz direkt zu mutieren. Das ist für UI-State und Konfigurationen nützlich, weil vorheriger und neuer Zustand nebeneinander betrachtet werden können. Die Syntax ist jedoch kein allgemeines Validierungswerkzeug: Ein ungültiger neuer Titel wird nicht automatisch durch den bloßen with-Ausdruck abgewehrt.',
 'Bei verschachtelten mutable Collections ist die Kopie normalerweise flach. Ein neuer äußerer Record kann weiterhin auf dieselbe veränderliche Liste wie sein Vorgänger zeigen. Wer eine unabhängige Momentaufnahme braucht, muss die betroffenen Inhalte ausdrücklich neu konstruieren oder von vornherein geeignete immutable Typen verwenden. Tests sollten deshalb sowohl Gleichheit und Unterschied der äußeren Instanzen als auch die Frage behandeln, ob verschachtelte Änderungen geteilt werden dürfen.',
 'public record Event(string Id,string Title);\nvar oldEvent = new Event("E1","Ada");\nvar updated = oldEvent with { Title="Kim" };\nConsole.WriteLine(oldEvent.Title); // Ada',
 'Der alte Record bleibt unverändert; die neue Instanz übernimmt alle nicht geänderten Bestandteile.'],
 ['hash','Ein Hash-Schlüssel braucht stabile Wertbestandteile',
 'Ein Record generiert zu seiner Gleichheit passende Hashcodes. Das macht ihn oft für Dictionary- und HashSet-Schlüssel attraktiv, sofern seine relevanten Komponenten während der Nutzung stabil bleiben. Ein Datensatz, dessen Gleichheit von später veränderbaren Bestandteilen abhängt, kann dagegen als Schlüssel problematisch sein. Bei einem EventKey aus Titel, Ort und Datum sollte die Fachlogik deshalb genau festlegen, ob sich diese Felder ändern dürfen und ob ein späteres Update eine neue Identität bedeutet.',
 'Die Gleichheit verschachtelter Referenzobjekte ist nicht automatisch eine tiefe rekursive Inhaltsgleichheit. Eine Liste kann weiterhin ihre eigene Referenzgleichheit verwenden, obwohl der äußere Typ ein Record ist. Wer Wertgleichheit für komplexe Strukturen braucht, muss diese Eigenschaft bewusst entwerfen. Ein Record ist eine hilfreiche Abkürzung für bekannte Regeln, nicht die universelle Lösung für Objektvergleich, Persistenz und Änderungsgeschichte.',
 'var keys = new HashSet<EventKey>();\nkeys.Add(new EventKey("Ada",new DateOnly(2026,12,1)));\nConsole.WriteLine(keys.Contains(new EventKey("Ada",new DateOnly(2026,12,1))));',
 'Die Prüfung nutzt die generierte Hash- und Gleichheitssemantik des Schlüssels.'],
 ['models','Datenträger und Entity haben unterschiedliche Verantwortung',
 'Ein kleiner EventKey kann ein reiner Wert sein, während ein Event mit Reservierungsstand und Lebenszyklus eher eine identitätsbehaftete Entität darstellt. Beide Modelle dürfen nicht allein deshalb gleich behandelt werden, weil Record-Syntax verfügbar ist. Für eine Reservierung müssen beispielsweise booked und capacity zusammen überprüft werden. Eine Methode Reserve kann diese Fachregel verlässlich kapseln, während frei unabhängige Propertyupdates ungültige Zwischenstände zulassen könnten.',
 'Beginne das Typdesign mit Fachfragen: Woran erkennst du dasselbe Event, welche Änderungen sind erlaubt und welche Daten müssen dauerhaft gültig bleiben? Wähle anschließend Record Class, Record Struct oder eine normale Klasse nach ihren konkreten Eigenschaften. Gute Typisierung macht die Entscheidung sichtbar; die Tests sichern Grenzwerte und Gleichheit. Ein kurzes Datenmodell ohne Fachvertrag ist nicht automatisch professionell.',
 'public record Capacity(int Total,int Booked) {\n    public bool CanReserve(int amount) => amount>0 && Booked>=0 && Total>=Booked && amount<=Total-Booked;\n}',
 'Eine fachliche Methode beschreibt Reservierungsregeln unabhängig von der Wahl des äußeren Datenträgertyps.']
 ],
 checks:[
 ['Ist record class ein Value Type?','Nein, es ist ein Referenztyp mit wertorientierter Gleichheit.','Record Class und Record Struct unterscheiden sich in ihren Runtime-Eigenschaften.'],
 ['Macht with automatisch eine Deep Copy?','Nein.','Verschachtelte mutable Referenzen können von alter und neuer Instanz geteilt bleiben.'],
 ['Warum sollte ein Record-Schlüssel unveränderliche relevante Felder besitzen?','Damit Gleichheit und Hashcode während der Collection-Nutzung stabil bleiben.','Hashbasierte Zuordnungen setzen verlässliche Schlüsselregeln voraus.']
 ],
 exercise:'Definiere EventKey als Record mit Title, Location und DateOnly. Speichere damit Reservierungszahlen in Dictionary<EventKey,int> und überprüfe einen gleichwertigen neu erzeugten Schlüssel. Demonstriere anschließend, warum eine mutable Liste in einem Record keine automatische Deep Copy ist.',
 solution:'Nutze public record EventKey(string Title,string Location,DateOnly Day) und Dictionary<EventKey,int>. Ein neuer EventKey mit denselben Feldern soll denselben Eintrag finden. Erstelle außerdem einen Record mit List<string>, kopiere ihn mit with und ändere ein Element der Liste: Ohne eigene Kopie ist die Änderung in beiden äußeren Instanzen sichtbar.'
},
{
 language:'cpp',id:'cpp-move-semantics',title:'C++: Move-Semantik, Kopieren und Exception-Sicherheit',
 source:'https://en.cppreference.com/cpp/language/move_constructor',
 objectives:['Copy, Move und Wertübergabe anhand des Ressourcenbesitzes unterscheiden.','std::move korrekt als Cast und nicht als eigentlichen Move verstehen.','noexcept und Rule of Zero in sicherem API-Design berücksichtigen.'],
 sections:[
 ['resources','Move kann Ressourcenbesitz statt Dateninhalt übertragen',
 'Ein C++-Objekt kann eine dynamische Ressource wie einen Speicherpuffer besitzen. Eine Kopie müsste diese Daten gegebenenfalls duplizieren, während eine Move-Operation die verwaltete Ressource an einen neuen Besitzer übergeben kann. Das ist besonders für std::vector und std::string relevant. Die konkrete Implementierung hängt vom Typ ab; ein Move ist nicht pauschal eine Pointerzuweisung. Das bewegte Quellobjekt bleibt gültig, sein Wertzustand ist danach aber häufig nur eingeschränkt festgelegt.',
 'Rückgaben als Wert sind deshalb in modernem C++ oft eine sichere und effiziente Wahl. Copy Elision und geeignete Move-Operationen können zusätzliche Arbeit vermeiden. Eine Referenz auf eine lokale temporäre Collection wäre dagegen nach dem Funktionsende ungültig. Entwerfe zuerst den passenden Ownershipvertrag und optimiere nur gemessene Engpässe. Eine API mit expliziter Wertübergabe ist häufig leichter korrekt zu verwenden als ein kompliziertes Netz aus Zeigern und Views.',
 '#include <string>\n#include <utility>\nstd::string title="Ada";\nstd::string moved=std::move(title);',
 'moved übernimmt unter der üblichen String-Implementierung Ressourcen; title bleibt gültig, sein konkreter Inhalt ist nicht garantiert.'],
 ['cast','std::move führt nicht selbst die Verschiebung aus',
 'std::move ist in erster Linie ein Cast, der einen Ausdruck für die Behandlung als Rvalue bereitstellt. Erst der darauf folgende Konstruktor oder Zuweisungsoperator führt die eigentliche Arbeit aus. Ein Typ ohne Move-Konstruktor kann dabei unter passenden Umständen kopiert werden. Auch const-Objekte können häufig nicht über den üblichen Move-Konstruktor übertragen werden, weil dieser normalerweise eine nicht-konstante Rvalue-Referenz benötigt. Die Aussage std::move macht niemals eine Kopie wäre daher falsch.',
 'Ein unnötiges std::move an der Rückgabestelle kann bestimmte Formen von Copy Elision verhindern oder erschweren. Schreibe deshalb zunächst eine einfache Rückgabe als Wert und verstehe die geltenden Sprachregeln. Wenn du ausdrücklich einen vorhandenen Wert an eine andere Variable übertragen möchtest, ist std::move dagegen sinnvoll. Teste das Ergebnis am neuen Besitzer; verlasse dich nicht auf einen zufällig leer beobachteten Quellcontainer.',
 '#include <vector>\nstd::vector<int> source{1,2,3};\nauto destination=std::move(source);\n// source ist weiterhin gültig, jedoch nicht auf einen bestimmten Inhalt festgelegt.',
 'Die Quellvariable bleibt zerstörbar und zuweisbar, aber ihr konkreter Wertinhalt ist nach der Bewegung nicht zugesichert.'],
 ['noexcept','Exception-Garantien beeinflussen Containerverhalten',
 'Beim Wachstum eines std::vector müssen vorhandene Elemente möglicherweise an einen neuen Speicherort gelangen. Wenn eine Move-Operation werfen könnte, kann die Bibliothek unter passenden Bedingungen die Kopie bevorzugen, um eine stärkere Exception-Garantie zu erhalten. noexcept bei einem korrekt implementierten Move-Konstruktor kann solche Entscheidungen beeinflussen. Die Garantie darf allerdings nur deklariert werden, wenn sie tatsächlich eingehalten wird; eine daraus entstehende Exception kann sonst zu std::terminate führen.',
 'Eine starke Fehlergarantie bedeutet gewöhnlich, dass ein fehlgeschlagener Vorgang seinen beobachtbaren Zustand unverändert lässt. Eine grundlegende Garantie kann schwächer sein, muss aber Ressourcen und Invarianten erhalten. Wer eine eigene Ressource verwaltet, sollte diese Garantien bewusst dokumentieren. Häufig ist es sicherer, Standardtypen als Member zu verwenden, statt manuelle Destruktor- und Move-Operationen zu schreiben.',
 '#include <memory>\nstruct Resource { std::unique_ptr<int> value; Resource(Resource&&) noexcept=default; };',
 'Die unique_ptr-Besitzregeln bilden den grundlegenden Move-Vertrag des Memberwerts ab.'],
 ['zero','Die Rule of Zero reduziert gefährlichen Spezialcode',
 'Eine Klasse mit std::vector, std::string und std::unique_ptr kann ihre Ressourcen über diese Member verwalten. Häufig benötigt sie deshalb keinen eigenen Destruktor und keine explizit ausformulierten Copy-/Move-Operationen. Das folgt der Rule of Zero: Eigene Geschäftsobjekte sollen möglichst nicht selbst Ressourcenmanagement nachbauen. Der Compiler und die Standardbibliothek können dann die passenden generierten Spezialmember bereitstellen, soweit deren Anforderungen erfüllt sind.',
 'Eine Memberstruktur mit unique_ptr ist nicht automatisch kopierbar, weil eindeutiger Besitz nicht beliebig dupliziert werden darf. Das ist kein Fehler, sondern Teil des Vertrags. Wenn du für einen EventCatalog eine unabhängige Wertkopie brauchst, kann ein vector<Event> die passendere Datenstruktur sein. Teste Kopieren und Bewegen nur dort, wo die Operation ausdrücklich vorgesehen ist. Eine falsche Kopiersemantik kann Daten verdoppeln oder einen Besitzervertrag zerstören.',
 '#include <vector>\nstruct EventBuffer { std::vector<int> ids; };\nEventBuffer makeBuffer() { return EventBuffer{{1,2,3}}; }',
 'Der Container verwaltet seinen Speicher selbst; eine manuelle new/delete-Implementierung ist nicht nötig.']
 ],
 checks:[
 ['Ruft std::move unmittelbar einen Move-Konstruktor auf?','Nein, es ist ein Cast; die folgende Operation entscheidet.','Eine Kopie kann unter bestimmten Umständen weiterhin stattfinden.'],
 ['Darf ein bewegtes Objekt danach noch zerstört werden?','Ja.','Es muss gültig bleiben, auch wenn sein konkreter Inhalt nicht definiert ist.'],
 ['Warum kann noexcept bei Move-Operationen nützlich sein?','Es unterstützt bestimmte starke Fehlergarantien bei Containerumlagerungen.','Eine möglicherweise werfende Bewegung kann für den Container ungünstig sein.']
 ],
 exercise:'Entwerfe eine EventBuffer-Klasse auf Basis von std::vector<std::string>. Gib sie aus einer Factory als Wert zurück und bewege anschließend eine Instanz bewusst. Begründe Rule of Zero und erkläre, warum du den Quellcontainer nach Move nicht auf die Eigenschaft leer testen solltest.',
 solution:'Verwende std::vector<std::string> als Member, ohne eigene Speicherfreigabe. Die Factory liefert EventBuffer als Wert. Übertrage danach per std::move in ein neues Objekt, teste die Daten des neuen Besitzers und verlasse dich nur auf den gültigen, nicht genauer spezifizierten Zustand der Quelle.'
},
{
 language:'php',id:'php-pdo-sql',title:'PHP: PDO, Prepared Statements und Transaktionen',
 source:'https://www.php.net/manual/en/pdo.prepared-statements.php',
 objectives:['SQL-Werte von SQL-Struktur unterscheiden.','Prepared Statements zur Trennung von Daten und SQL-Syntax einsetzen.','Mehrstufige Datenänderungen transaktional und mit klarem Fehlervertrag behandeln.'],
 sections:[
 ['injection','Untrusted Werte dürfen nicht als SQL-Code interpretiert werden',
 'Wenn ein Eventtitel ungeprüft an einen SQL-String angehängt wird, kann die Eingabe dessen Bedeutung verändern. PDO unterstützt vorbereitete Anweisungen mit Parametern, um Datenwerte von der festen SQL-Struktur zu trennen. Der Treiber erhält den Wert getrennt vom Abfragetext. Das ist die entscheidende Schutzgrenze gegen viele Formen von SQL-Injection. Die fachliche Gültigkeit eines Titels oder einer Teilnehmerzahl wird dadurch allerdings nicht automatisch hergestellt.',
 'Dynamische Tabellen- oder Spaltennamen lassen sich nicht gewöhnlich wie Datenwerte binden. Solche SQL-Strukturteile müssen aus einer ausdrücklich erlaubten Menge ausgewählt werden. Wenn ein Nutzer eine Sortieroption wählt, darf diese deshalb nicht unkontrolliert als SQL-Syntax weitergegeben werden. Prepared Statements, strukturierte Fachvalidierung und passende Datenbankrechte bilden zusammen eine sichere Grenze. Keiner dieser Bausteine ersetzt die anderen.',
 '$stmt=$pdo->prepare("SELECT title FROM events WHERE id=:id");\n$stmt->execute(["id"=>$eventId]);\n$title=$stmt->fetchColumn();',
 'Die ID wird als Datenparameter übergeben, während die Abfragestruktur unverändert bleibt.'],
 ['binding','Bindung und Treiberverhalten gehören zum Vertrag',
 'PDO unterstützt benannte und positionale Parameter sowie die Bindung bestimmter Werttypen. Eine Integer-ID oder Teilnehmerzahl sollte entsprechend dem Datenmodell behandelt werden. Je nach Datenbanktreiber können Vorbereitungen serverseitig oder emuliert ablaufen; dadurch können sich Fehlerzeitpunkte und Details der Parameterbehandlung unterscheiden. Die Anwendung muss die konkret eingesetzte Plattform verstehen, statt aus einer erfolgreichen Demonstration eine universelle Garantie abzuleiten.',
 'Bei einem Import solltest du fremde Werte bereits vor dem Datenbankzugriff prüfen. Ein leerer String als Event-ID ist unabhängig von SQL-Injection fachlich unzulässig, wenn IDs verpflichtend sind. Ein Prepare-Aufruf macht die ID nicht automatisch eindeutig und stellt auch keine passende Datenbank-Constraint her. Der Datenbankvertrag muss deshalb Schlüssel, Nullwerte und Eindeutigkeit ausdrücklich abbilden. Tests sollten gültige und ungültige Eingaben getrennt betrachten.',
 '$stmt=$pdo->prepare("UPDATE events SET seats=:seats WHERE id=:id");\n$stmt->bindValue(":seats",$seats,PDO::PARAM_INT);\n$stmt->bindValue(":id",$id,PDO::PARAM_STR);\n$stmt->execute();',
 'Die Werte werden über bewusst gewählte Parametertypen übergeben.'],
 ['transaction','Eine Reservierung kann aus mehreren zusammengehörigen Änderungen bestehen',
 'Wenn eine Buchung gleichzeitig einen freien Platz reduziert und eine Teilnehmerzeile schreibt, dürfen nicht nur einzelne Teilschritte dauerhaft werden. Eine Transaktion kann eine solche Operation in eine fachliche Einheit zusammenfassen. PDO bietet beginTransaction, commit und rollBack. Der tatsächliche Schutz hängt von Datenbank, Isolation und beteiligten Operationen ab. Nicht jede Datenbankoperation besitzt unter jedem Treiber identische transaktionale Eigenschaften.',
 'Bei einem Fehler sollte die Anwendung den Rollback versuchen und die Ursache anschließend weitergeben oder in einen verständlichen Fehlervertrag überführen. Ein catch, das den Vorgang stillschweigend als Erfolg zurückmeldet, wäre falsch. Auch parallele Reservierungen benötigen eine Datenbankstrategie, die ein Überbuchen verhindert. Ein bloßer SELECT vor einem UPDATE ist ohne passende Sperr- oder atomare Änderungsregel nicht automatisch sicher.',
 '$pdo->beginTransaction();\ntry {\n    // vorbereitete zusammengehörige Änderungen\n    $pdo->commit();\n} catch (Throwable $e) {\n    if ($pdo->inTransaction()) $pdo->rollBack();\n    throw $e;\n}',
 'Der Fehler bleibt sichtbar; die Transaktion wird bei einem fehlgeschlagenen Ablauf zurückgerollt, sofern sie noch aktiv ist.'],
 ['architecture','Fachfehler und Betriebsfehler auseinanderhalten',
 'Ein EventService sollte mit Event-IDs und Reservierungswünschen arbeiten, nicht mit frei zusammengesetzten SQL-Strings. Ein Repository-Adapter kann die konkrete Persistenz kapseln, während der Service die fachlichen Regeln prüft. So lässt sich der Fachcode ohne produktive Datenbank testen und ein Treiberwechsel verändert nicht automatisch die gesamte Anwendung. Die API muss unterscheiden, ob ein Event nicht gefunden wurde, der Platzbestand erschöpft ist oder die Datenbankverbindung versagt hat.',
 'Roh ausgegebene SQL-Fehler können vertrauliche Details über Tabellen oder Server preisgeben. Die Anwendung sollte technische Ursachen protokollieren, ohne Kennwörter oder Tokens auszugeben, und der UI einen passenden fachlichen Status liefern. Das ist kein Grund, jeden Fehler zu verstecken. Eine saubere Trennung von Fehlerbeschreibung und internen Diagnosedaten macht sowohl Nutzerreaktion als auch Wartung zuverlässiger.',
 'function validatedId(string $value): string {\n    $id=trim($value);\n    if ($id==="") throw new InvalidArgumentException("Missing ID");\n    return $id;\n}',
 'Die Fachprüfung bleibt unabhängig von einer späteren PDO-Parametrisierung.']
 ],
 checks:[
 ['Kann ein Tabellenname gewöhnlich als SQL-Datenparameter gebunden werden?','Nein, SQL-Struktur braucht eine gesondert erlaubte Auswahl.','Parametrisierung trennt Werte vom Abfragetext.'],
 ['Verhindert ein Prepared Statement automatisch eine fachlich negative Kapazität?','Nein.','Die Geschäftsregel muss zusätzlich validiert werden.'],
 ['Warum darf nach fehlgeschlagenen Transaktionsschritten kein Erfolg zurückgegeben werden?','Die Gesamtoperation wurde nicht verlässlich abgeschlossen.','Teilweise gespeicherte Änderungen dürfen keinen erfolgreichen Vertrag vortäuschen.']
 ],
 exercise:'Implementiere eine Reservierungsoperation über PDO, die den Platzbestand nur bei verfügbarer Kapazität erhöht. Nutze parametrisierte Werte, prüfe die Zahl der betroffenen Zeilen und lege fest, wann eine Transaktion benötigt wird. Erläutere die Absicherung gegen parallele Reservierungen.',
 solution:'Formuliere eine atomare parametrisierte UPDATE-Anweisung mit Bedingung booked < capacity, prüfe rowCount und verwende eine Transaktion für weitere abhängige Änderungen. Eine bloße separate SELECT-Prüfung ohne geeignete Transaktionsisolation reicht bei parallelen Zugriffen nicht aus. Behandle Datenbankfehler ausdrücklich.'
},
{
 language:'go',id:'go-generics',title:'Go: Generics, Constraints und Type Relationships',
 source:'https://go.dev/doc/tutorial/generics',
 objectives:['Typparameter mit konkreten Rückgabebeziehungen einsetzen.','comparable und eigene Constraints sinnvoll wählen.','Zero Values und fehlende Ergebnisse korrekt unterscheiden.'],
 sections:[
 ['relationship','Ein Typparameter bewahrt konkrete Typinformationen',
 'Eine Funktion kann über [T any] denselben Algorithmus für verschiedene Elementtypen bereitstellen. Eine Funktion First, die eine Slice []T annimmt, kann T als Rückgabetyp behalten, ohne eine Runtime-Typassertion zu verlangen. Das ist für allgemeine Collection-Hilfsfunktionen sinnvoll. Eine Funktion, die ausschließlich Eventtitel als Strings verarbeitet, braucht dagegen keine komplizierte generische Deklaration. Die Typabstraktion soll eine echte Beziehung ausdrücken und nicht bloß Code möglichst allgemein aussehen lassen.',
 'Bei einer leeren Slice existiert kein erstes Element. Eine Rückgabe nur als T wäre deshalb ohne weiteren Vertrag uneindeutig: Der Zero Value kann auch ein regulärer Wert sein. Der zusätzliche boolesche Erfolgswert trennt den tatsächlichen Treffer von einer leeren Eingabe. Dieselbe Idee findet sich bei Map-Lookups und anderen Go-APIs. Fachliche Abwesenheit und der Zero Value sind nicht automatisch identisch.',
 'func First[T any](items []T) (T,bool) {\n    var zero T\n    if len(items)==0 { return zero,false }\n    return items[0],true\n}',
 'Die Signatur bewahrt den konkreten Elementtyp und signalisiert das Fehlen eines Werts ausdrücklich.'],
 ['constraints','Nicht jede Operation ist für any erlaubt',
 'Ein Parameter T any kann jeden zulässigen Typ annehmen, garantiert aber keine Addition oder einen Gleichheitsvergleich. Für die Verwendung als Map-Key ist beispielsweise ein vergleichbarer Typ nötig. Der Constraint comparable formuliert diese Voraussetzung zur Compile-Time. Für andere Operationen kann eine passende Typmenge oder ein Methodeninterface erforderlich sein. Die Grenze soll sich aus dem Algorithmus ableiten, nicht umgekehrt.',
 'Ein Constraint legt keine beliebigen Fachwerte fest. Ein zulässiger Integer kann trotzdem negativ sein, obwohl eine Teilnehmerzahl dies nicht darf. Eine Funktion mit comparable weiß nicht, dass zwei Events mit gleicher ID als dasselbe fachliche Event gelten sollen. Dafür benötigt sie einen ausdrücklich berechneten Schlüssel. Gute Generics bewahren Typinformationen und erlaubte Operationen; die Fachlogik bleibt weiterhin sichtbar.',
 'func HasDuplicate[T comparable](items []T) bool {\n    seen:=map[T]bool{}\n    for _,v:=range items { if seen[v] { return true }; seen[v]=true }\n    return false\n}',
 'Die Funktion benötigt Gleichheit und Map-Key-Fähigkeit, die comparable für den Typparameter beschreibt.'],
 ['interfaces','Generische Constraints und Runtime-Interfaces unterscheiden sich',
 'Go-Interfaces können Method Sets beschreiben, die normale Werte zur Laufzeit erfüllen. Als Constraints können Interfaces zusätzlich Typmengen formulieren, um zulässige Typparameter einzuschränken. Ein Interface, das spezielle Typmengenoperationen benutzt, ist nicht in jeder Form als gewöhnlicher Runtime-Werttyp geeignet. Wer einen Algorithmus nur über eine Name()-Methode schreiben möchte, braucht möglicherweise überhaupt kein generisches API.',
 'Eine klare Schnittstelle fordert möglichst wenig. Eine Funktion, die lediglich einen Namen anzeigen soll, kann ein kleines Interface als Parameter akzeptieren. Generics lohnen sich stärker, wenn der konkrete Typ über mehrere Eingabe- und Ausgabepositionen erhalten bleiben muss. Die Wahl sollte eine Erklärung ermöglichen, welche Information durch den Typparameter bewahrt wird und warum eine einfache Interfacefunktion dafür nicht ausreichen würde.',
 'type Named interface { Name() string }\nfunc Label[T Named](item T) string { return item.Name() }',
 'Ein Constraint kann das benötigte Verhalten einer generischen Funktion beschreiben.'],
 ['dedupe','Generische Deduplizierung braucht einen Schlüsselvertrag',
 'Eine Eventliste kann zwei verschiedene Objekte mit gleicher fachlicher ID enthalten. Ein allgemeiner Algorithmus, der nur die technische Gleichheit der gesamten Werte benutzt, erkennt diese Geschäftsregel nicht automatisch. Eine Key-Funktion erlaubt es, den für die Deduplizierung passenden Schlüssel aus jedem Event zu extrahieren. Wird die Ausgabe in der Reihenfolge der Eingabe aufgebaut, kann das erste Vorkommen jedes Schlüssels erhalten bleiben. Damit bleibt die Fachentscheidung sichtbar und der Algorithmus generisch.',
 'Teste den Algorithmus mit mehreren Werttypen, leeren Eingaben und doppelten Schlüsseln. Ein Test für dieselbe ID mit anderem Titel ist besonders aussagekräftig, weil er die gewünschte Domänenidentität prüft. Für eine spätere Datenbankverwendung musst du zusätzlich über Eindeutigkeit und Normalisierung entscheiden. Die generische Funktion kann diese Regeln nicht ohne den mitgegebenen Vertrag erraten.',
 'func UniqueBy[T any,K comparable](items []T,key func(T)K) []T {\n    seen:=map[K]bool{}\n    out:=make([]T,0,len(items))\n    for _,item:=range items { k:=key(item); if !seen[k] { seen[k]=true; out=append(out,item) } }\n    return out\n}',
 'Die Key-Funktion bestimmt ausdrücklich die fachliche Gleichheit, statt sie aus dem gesamten Eventobjekt abzuleiten.']
 ],
 checks:[
 ['Wofür eignet sich comparable als Constraint?','Für gleichheitsvergleichbare Typparameter, etwa Map-Keys.','any garantiert diese Operationen nicht.'],
 ['Ersetzt ein Constraint eine fachliche Wertevalidierung?','Nein.','Typfähigkeiten und Geschäftsgrenzen sind getrennte Anforderungen.'],
 ['Warum gibt First[T] zusätzlich bool zurück?','Um einen leeren Eingang von einem gültigen Zero Value unterscheiden zu können.','Zero Value ist bei vielen Typen ein legitimer Wert.']
 ],
 exercise:'Implementiere UniqueBy[T any,K comparable] und dedupliziere eine Liste von Events nach ihrer ID. Bewahre das erste Vorkommen und die Reihenfolge. Prüfe einen leeren Eingang sowie zwei verschiedene Eventwerte mit derselben ID.',
 solution:'Benutze eine Map[K]bool für bereits gesehene Schlüssel und eine neue Slice für die Ergebnisse. Für jedes Event ruft der Algorithmus key(item) auf, prüft den Schlüssel und fügt nur beim ersten Mal hinzu. Eine passende Key-Funktion extrahiert die validierte Event-ID.'
},
{
 language:'kotlin',id:'kt-sealed-states',title:'Kotlin: Sealed Classes, when und fachliche Zustandsmodelle',
 source:'https://kotlinlang.org/docs/sealed-classes.html',
 objectives:['Sealed-Varianten als zulässige Zustandsfamilie verwenden.','Vollständiges when und Statusdaten verbinden.','Asynchrone Übergänge gegen veraltete Antworten absichern.'],
 sections:[
 ['states','Eine sealed-Hierarchie definiert erlaubte Alternativen',
 'Eine asynchrone Suche kann idle, loading, success oder error sein. Mehrere unabhängige Boolean-Flags erlauben dabei viele unlogische Kombinationen. Eine sealed class oder sealed interface beschreibt stattdessen eine Familie erlaubter Varianten. Jede Variante trägt nur die Daten, die zu ihr gehören: Success hat ein Ergebnis, Failure einen Fehlertext, Idle keine zusätzlichen Daten. Das macht ungültige Zustandsformen schwerer ausdrückbar und erleichtert eine eindeutige Darstellung in der Benutzeroberfläche.',
 'Die Regeln für direkte Untertypen einer sealed-Hierarchie sind Teil des Kotlin-Modul- und Package-Modells. Durch die bekannte Familie kann der Compiler bei einem when-Ausdruck die Vollständigkeit prüfen, sofern die Varianten passend behandelt sind. Fügst du eine neue Variante hinzu, werden fehlende Entscheidungen sichtbar. Das ist besonders für größere Apps mit vielen Renderpfaden nützlich, die denselben Status verwenden.',
 'sealed interface LoadState {\n    data object Idle:LoadState\n    data object Loading:LoadState\n    data class Success(val count:Int):LoadState\n    data class Failure(val message:String):LoadState\n}',
 'Die erlaubten Daten hängen von der konkreten Variante ab.'],
 ['when','when behandelt eine Variante mit ihren passenden Daten',
 'Ein when-Ausdruck kann aus einem LoadState eine textuelle Anzeige erzeugen. Wenn die sealed-Familie vollständig bekannt ist, muss die Anwendung alle Varianten behandeln oder einen allgemeinen else-Arm verwenden. Ein explizit vollständiges when ohne else hat den Vorteil, dass eine neue Variante beim Kompilieren eine neue Entscheidung verlangt. Im Success-Zweig kann die Ergebnisanzahl gelesen werden; im Failure-Zweig existiert ausschließlich der Fehlertext.',
 'Die Typprüfung garantiert dabei nicht, dass die Anzeige fachlich gut ist. Ein Failure darf nicht unbemerkt wie eine leere erfolgreiche Suche behandelt werden, wenn Nutzer darauf unterschiedlich reagieren müssen. Das Modell sollte gegebenenfalls einen eigenen Empty-Zustand besitzen. Tests für jede Variante schützen die gewünschte Bedeutung, während der Compiler die grundsätzliche Vollständigkeit der Fallbehandlung unterstützt.',
 'fun describe(state:LoadState):String=when(state) {\n    LoadState.Idle -> "Bereit"\n    LoadState.Loading -> "Lädt"\n    is LoadState.Success -> "Geladen"\n    is LoadState.Failure -> state.message\n}',
 'Jeder Zweig entspricht genau einer erlaubten Variante.'],
 ['async','Ein gültiger Status kann zeitlich trotzdem falsch sein',
 'Ein neuer Suchbegriff kann eine ältere asynchrone Anfrage ersetzen. Selbst wenn beide Antworten gültige Success-Objekte enthalten, darf die erste Antwort nicht nachträglich den neueren Zustand überschreiben. Eine sealed-Hierarchie schützt allein die Form des Zustands, nicht den Zeitpunkt, zu dem das Ergebnis noch aktuell ist. Nutze deshalb eine Anfrage-ID, eine Abbruchregel oder eine zentrale State Machine, die veraltete Antworten zurückweist.',
 'Kotlin-Coroutines erlauben strukturierte Lebensdauer und Cancellation, aber auch ein Abbruchsignal verhindert nicht jede bereits fertiggestellte Antwort. Ein Generationstoken kann deshalb zusätzlich sinnvoll sein. Für einen UI-Test lässt sich die Reihenfolge zweier Antworten kontrolliert vertauschen und prüfen, dass ausschließlich die aktuellste Anfrage übernommen wird. Das ist eine fachliche Gültigkeitsregel, nicht bloß ein Typcheck.',
 'data class RequestState(val id:Long,val view:LoadState)\nfun accept(current:RequestState,id:Long,view:LoadState):RequestState =\n    if(current.id==id) current.copy(view=view) else current',
 'Nur eine zur aktuellen Anfrage passende ID darf den sichtbaren Zustand ändern.'],
 ['error','Reguläres Fehlen und Fehler müssen erkennbar bleiben',
 'Ein erfolgreicher Eventfilter kann eine leere Liste zurückgeben. Das ist keine gescheiterte Netzwerkverbindung. Wer beides als Failure behandelt, verhindert eine sachgerechte Benutzerreaktion. Ein eigenes Empty in einer sealed-Familie kann deshalb sinnvoll sein, wenn die Unterscheidung im Produkt wichtig ist. Das gilt ebenso für Cancelled: Eine vom Nutzer absichtlich abgebrochene Suche sollte nicht automatisch eine rote Systemfehlermeldung auslösen.',
 'Eine zu große Familie unnötiger Statusvarianten erschwert allerdings die Bedienung. Modellieren solltest du nur echte fachliche Zustände. Eine gute Regel ist, dass jede Variante ihren eigenen, beobachtbaren Grund besitzt und nur die dazugehörigen Daten trägt. Die Anwendung kann die Varianten anschließend über vollständige when-Ausdrücke und gezielte Tests darstellen. So wird das Typsystem ein Werkzeug für klare Entscheidungen.',
 'sealed interface SearchResult {\n    data object Empty:SearchResult\n    data class Found(val ids:List<String>):SearchResult\n    data class Failure(val message:String):SearchResult\n}',
 'Leeres Ergebnis, Treffer und Fehler sind drei klar unterschiedliche fachliche Zustände.']
 ],
 checks:[
 ['Welchen Vorteil hat sealed bei einem vollständigen when-Ausdruck?','Neue Varianten können fehlende Fälle beim Kompilieren sichtbar machen.','Der Compiler kennt die geschlossene Familie zulässiger Varianten.'],
 ['Stoppt eine sealed-Klasse selbst veraltete Netzwerkanfragen?','Nein.','Dafür benötigt die UI zusätzliche zeitliche Gültigkeitsregeln.'],
 ['Ist eine erfolgreiche Suche ohne Treffer automatisch ein Fehler?','Nein.','Ein eigener Empty-Zustand kann fachlich passender sein.']
 ],
 exercise:'Definiere einen Suchzustand mit Idle, Loading, Empty, Success und Failure, jeweils mit nur den benötigten Daten. Schreibe einen vollständigen when-Ausdruck und implementiere eine Generation-ID-Regel, die Ergebnisse einer alten Suche verwirft.',
 solution:'Nutze eine sealed interface mit data objects und data classes für die passenden Varianten. Der when-Ausdruck behandelt alle fünf Fälle explizit. Speichere die aktuelle Request-ID im State und übernimm ein Ergebnis nur, wenn seine ID aktuell ist. Teste vertauschte Antwortreihenfolgen und einen regulär leeren Erfolg.'
}
];
export const FIVE_LANGUAGE_PROFESSIONAL_VOLUME:readonly AuthoredLesson[]=MANUSCRIPTS.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:34,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({id,title,paragraphs:[first,second],code,annotation})),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:item.language,name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Das fachliche Sprachbeispiel ist in den vier Abschnitten hergeleitet und mit konkreten Grenzen und Fehlerfällen erläutert.',
  differences:'Die Regeln unterscheiden sich je nach C#, C++, PHP, Go und Kotlin. Eine ähnliche Schreibweise garantiert keine identischen Laufzeit- oder Besitzverträge.',
  equivalence:'related',docs:item.source
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
