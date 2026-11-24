import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';

type Language='python'|'javascript'|'csharp'|'cpp'|'php'|'go'|'kotlin';
type Section=readonly [id:string,title:string,explanation:string,implications:string,code:string,annotation:string];
type Q=readonly [question:string,answer:string,reason:string];
type Manuscript={language:Language;id:string;title:string;objectives:readonly string[];sections:readonly Section[];questions:readonly Q[];exercise:string;answer:string;reference:string};
const chapters:readonly Manuscript[]=[
{language:'python',id:'py-iteration-generators',title:'Python-Iteratoren, Generatoren und Auswertungszeitpunkte',
 objectives:['Iterable und Iterator anhand des Iterationsprotokolls unterscheiden.','Generatoren und yield ohne versteckte Listenbildung erklären.','Erschöpfung, Seiteneffekte und Speicherverhalten an Tests belegen.'],
 reference:'https://docs.python.org/3/tutorial/classes.html#iterators',
 sections:[
 ['protocol','Eine for-Schleife verlangt eine iterierbare Quelle',
 'In Python ist eine for-Schleife nicht auf einen eingebauten Array-Typ festgelegt. Sie verwendet das Iterationsprotokoll: iter(source) liefert einen Iterator und next(iterator) gibt jeweils das nächste Element zurück. Ist die Quelle erschöpft, signalisiert der Iterator dies mit StopIteration. Listen sind iterierbar und erzeugen Iteratoren; ein Iterator selbst kann ebenfalls iterierbar sein. Das sind aber unterschiedliche Rollen, die vor allem bei einmaligen Datenströmen wichtig werden.',
 'Wenn eine Funktion ein beliebiges Iterable akzeptiert, darf sie nicht automatisch voraussetzen, dass len, Indexzugriff oder mehrfaches Durchlaufen möglich sind. Eine Generatorinstanz ist nach einmaligem Verbrauch erschöpft. Der gleiche Code, der mit einer Liste zweimal Ergebnisse liefert, kann mit einem Generator beim zweiten Durchlauf nichts mehr erzeugen. Die Schnittstelle sollte deshalb deutlich sagen, ob sie einmal konsumiert oder eine wiederverwendbare Sammlung erwartet.',
 'values = [2, 4, 6]\niterator = iter(values)\nassert next(iterator) == 2\nassert list(iterator) == [4, 6]\nassert list(iterator) == []',
 'Der erste nächste Wert wurde einzeln abgerufen; die restlichen Werte werden beim Umwandeln verbraucht.'],
 ['yield','Ein Generator pausiert zwischen Ergebnissen',
 'Eine Funktion mit yield erzeugt beim Aufruf normalerweise ein Generatorobjekt, ohne ihren gesamten Funktionskörper sofort auszuführen. Beim ersten Abruf läuft der Körper bis zum nächsten yield und kann später an derselben Stelle fortsetzen. Lokale Variablen bleiben zwischen diesen Fortsetzungen erhalten. Das macht Generatoren geeignet, eine Folge schrittweise zu produzieren, etwa Zeilen aus einer Datei oder Datensätze aus einem großen Archiv.',
 'Schrittweise Erzeugung bedeutet nicht automatisch, dass jede Verarbeitung speichersparend ist. Wenn du alle Generatorwerte mit list(...) materialisierst, wird wieder die vollständige Ergebnisliste aufgebaut. Außerdem können Generatoren Seiteneffekte ausführen, die erst bei tatsächlicher Iteration eintreten. Ein Generator, der Datenbankzugriffe oder Dateizugriffe ausführt, sollte deshalb einen klaren Lebensdauer- und Fehlervertrag besitzen.',
 'def even_numbers(limit: int):\n    for number in range(limit):\n        if number % 2 == 0:\n            yield number\n\nstream = even_numbers(6)\nassert next(stream) == 0\nassert list(stream) == [2, 4]',
 'Der Generator produziert Werte erst während der Iteration und bleibt danach erschöpft.'],
 ['comprehensions','Generatorausdruck und List Comprehension unterscheiden',
 'Eine List Comprehension wie [x * x for x in values] erzeugt eine neue Liste. Ein Generatorausdruck wie (x * x for x in values) beschreibt dagegen eine schrittweise Auswertung. Beide können denselben sichtbaren Ergebnisstrom liefern, aber ihre Auswertungszeit und ihr Speicherverhalten sind verschieden. Bei überschaubaren Werten, die mehrfach gebraucht werden, kann eine echte Liste die einfachere Wahl sein. Für große oder nur einmal gelesene Datenmengen kann die spätere Auswertung nützlich sein.',
 'Die äußere Iterable eines Generatorausdrucks wird bei dessen Erzeugung ausgewertet, während die innere Berechnung weitgehend bei Iteration erfolgt. Das kann bei veränderlichen Eingaben und Seiteneffekten überraschende Ergebnisse erzeugen. Fachlich robuste Verarbeitung sollte deshalb nicht von zufälligen Mutationen während einer verzögerten Iteration abhängen. Schreibe Tests, die den Zeitpunkt der Veränderung ausdrücklich abdecken, wenn eine API mit solchen Quellen umgehen muss.',
 'numbers = range(10)\nlist_result = [n*n for n in numbers if n % 2 == 0]\ngen_result = (n*n for n in numbers if n % 2 == 0)\nassert list_result == list(gen_result)',
 'Die Ergebnisse sind hier gleich; die Materialisierung und Zeitpunkte der Auswertung unterscheiden sich.'],
 ['interfaces','Eine sichere Pipeline besitzt klare Verbrauchsregeln',
 'Bei einem Filter über Veranstaltungsdaten muss die Reihenfolge stimmen: Erst ungültige oder fehlende Einträge behandeln, dann auf deren Felder zugreifen. Eine Pipeline aus Generatorausdrücken ist nicht deshalb sauber, weil sie kurz ist. Zu viele verzögerte Schichten können die Stelle verbergen, an der ein Fehler erstmals auftaucht. Eine klar benannte Generatorfunktion mit einer nachvollziehbaren Schleife kann leichter zu prüfen sein als ein verschachtelter Einzeiler.',
 'Wenn du einen Datenstrom nur einmal lesen darfst, sag das in der Dokumentation und im Namen. Wenn Aufrufer die Ergebnisse mehrfach brauchen, kannst du sie ausdrücklich materialisieren oder eine Factory liefern, die bei Bedarf einen neuen Iterator erzeugt. Das Iterationsprotokoll ist mächtig, weil es Listen, Dateien und eigene Objekte verbindet. Genau deswegen darf ein allgemeiner Algorithmus nicht stillschweigend nur die Fähigkeiten einer Liste voraussetzen.',
 'def valid_titles(events):\n    for event in events:\n        if event is not None and isinstance(event.get("title"), str):\n            title = event["title"].strip()\n            if title:\n                yield title',
 'Die Funktion gibt einen einmaligen Generator aus geprüften Titeln zurück; die Eingabe muss ein Iterable aus passenden Mapping-Objekten sein.']
 ],
 questions:[
 ['Worin unterscheiden sich Iterable und Iterator?','Ein Iterable liefert einen Iterator; ein Iterator kennt seinen aktuellen Verbrauchsstand.','Ein Iterator kann nur einmalige oder bereits teilweise verbrauchte Werte bereitstellen.'],
 ['Wann läuft der Körper einer Generatorfunktion?','Während der Iteration, nicht vollständig beim Aufruf.','yield ermöglicht das Pausieren und Fortsetzen mit erhaltenem lokalen Zustand.'],
 ['Warum kann list(generator) beim zweiten Mal leer sein?','Der Generator wurde beim ersten Durchlauf erschöpft.','Die gleiche Instanz startet die Erzeugungsfunktion nicht automatisch neu.']
 ],
 exercise:'Schreibe einen Generator upcoming_titles(events, cutoff), der ungültige und vergangene Events überspringt und Titel schrittweise liefert. Prüfe mit Tests die erste Ausgabe, vollständigen Verbrauch, leere Eingaben und den zweiten Durchlauf derselben Generatorinstanz.',
 answer:'Definiere eine Funktion mit yield innerhalb einer for-Schleife. Validiere den Eventeintrag und den Datumswert vor dem Vergleich; nutze einen übergebenen cutoff statt der aktuellen Uhrzeit. Erzeuge eine Generatorinstanz, rufe next einmal auf und danach list. Bei einer erneuten list-Auswertung derselben Instanz werden keine weiteren Werte erzeugt.'
},
{language:'javascript',id:'js-promises-async',title:'JavaScript-Promises, Event Loop und kontrollierte Fehlerbehandlung',
 objectives:['Microtasks und asynchrone Fortsetzungen grob einordnen.','Promise-Ablehnungen, HTTP-Status und Laufzeitfehler unterscheiden.','Abbruch und veraltete Antworten als eigene Ablaufregeln implementieren.'],
 reference:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
 sections:[
 ['promises','Ein Promise ist eine Vereinbarung über spätere Fertigstellung',
 'JavaScript-Promises repräsentieren ein asynchrones Ergebnis. Ein Promise kann pending sein und später erfüllt oder abgelehnt werden. then registriert eine Fortsetzung bei Erfüllung, catch behandelt Ablehnungen und finally führt passende Abschlussarbeit aus, unabhängig davon, ob der Vorgang erfolgreich war. Bei der Verkettung entsteht jeweils ein neues Promise, dessen Zustand sich aus der vorigen Fortsetzung ergibt. Das macht zusammengesetzte Abläufe besser lesbar als tief verschachtelte Callbacks.',
 'Die Schlüsselidee ist nicht, dass ein Promise eine eigene CPU startet. JavaScript-Code kann weiterhin den Hauptthread blockieren, wenn er sehr lange synchron rechnet. Promise-Fortsetzungen werden als Microtasks abgearbeitet; sie laufen erst, wenn die aktuelle synchrone Ausführung und die jeweils geltenden Event-Loop-Regeln dies erlauben. Für UI-Probleme muss deshalb zwischen wartender I/O-Arbeit und tatsächlicher CPU-Arbeit unterschieden werden.',
 'const result = Promise.resolve(4)\n  .then(value => value * 2)\n  .then(value => "Wert: " + value);\nresult.then(console.log);',
 'Die zweite Fortsetzung verarbeitet das Ergebnis der ersten; sie ist keine synchrone Rückgabe aus dem ursprünglichen Aufruf.'],
 ['await','async und await verändern die Schreibweise, nicht die Fehlerregeln',
 'Innerhalb einer async-Funktion kannst du await verwenden, um auf die Erfüllung eines Promise zu warten. Bei einer Ablehnung kann an der await-Stelle eine Exception auftreten und über try/catch behandelt werden. Der Aufrufer der async-Funktion erhält dennoch stets ein Promise. Das ist wichtig, wenn du eine Funktion als void aufrufst und ihre Ablehnungen nicht beachtest: Ein vergessenes Promise kann zu einer unhandled rejection werden.',
 'Die Reihenfolge mehrerer await-Aufrufe kann Aufgaben unnötig serialisieren. Sind zwei unabhängige Leseoperationen gleichzeitig sinnvoll, lässt sich Promise.all nutzen. Bei Promise.all führt eine einzelne Ablehnung zur Ablehnung des kombinierten Promise, während andere bereits gestartete Aufgaben dadurch nicht automatisch abgebrochen werden. Wähle bewusst zwischen gemeinsamem Erfolg und einer Ergebnissammlung, die auch Fehler einzeln abbilden kann.',
 'async function loadBoth() {\n  const [a, b] = await Promise.all([fetch("/a"), fetch("/b")]);\n  if (!a.ok || !b.ok) throw new Error("HTTP status");\n  return [await a.text(), await b.text()];\n}',
 'Die Requests starten gemeinsam; der HTTP-Status wird gesondert geprüft.'],
 ['fetch','Ein erfolgreicher Transport ist nicht unbedingt ein erfolgreicher HTTP-Status',
 'fetch lehnt bei bestimmten Netzwerk- und Abbruchfehlern ab, aber ein HTTP-404 liefert gewöhnlich eine erfüllte Response. Deshalb ist die Prüfung response.ok wichtig. Erst anschließend sollten die Daten gelesen und validiert werden. JSON.parse oder response.json erzeugen keine automatische Typgarantie. Wer einen Eventtitel erwartet, muss den tatsächlichen Payload prüfen, bevor er Methoden darauf aufruft.',
 'Eine Anwendung sollte Fehler nach Bedeutung behandeln. Ein fehlender optionaler Datensatz kann ein regulärer leerer Zustand sein; ein HTTP-500 oder eine unlesbare Antwort kann einen erneuten Versuch erlauben. Wiederholungen müssen begrenzt sein und sollten keine Schreiboperationen unkontrolliert doppelt ausführen. Die Versuchung, jeden Fehler in catch zu ignorieren, führt zu leeren Anzeigen ohne erkennbare Ursache und erschwert die Diagnose.',
 'async function readJson(url) {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error("HTTP " + response.status);\n  const data = await response.json();\n  if (!data || typeof data !== "object") throw new Error("Invalid payload");\n  return data;\n}',
 'Das Beispiel prüft nur die äußere Objektform. Spezifische benötigte Felder müssen zusätzlich validiert werden.'],
 ['cancellation','Abbruch schützt vor nutzloser Arbeit, Generationen vor alten Ergebnissen',
 'Wenn ein Nutzer im Suchfeld schnell zwei Begriffe eingibt, können die Antworten in anderer Reihenfolge eintreffen als die Anfragen. Die alte Antwort darf nicht nachträglich die aktuellere Anzeige überschreiben. AbortController kann eine fetch-Anfrage über das zugehörige Signal abbrechen; er macht aber nicht jede beliebige Promise-Operation rückgängig. Bereits abgeschlossene Antworten können außerdem noch Fortsetzungen ausgelöst haben. Eine Generation-ID oder ein aktueller Request-Token ist deshalb eine hilfreiche zweite Schutzebene.',
 'Unterscheide selbst ausgelöste Abbrüche von echten Fehlern. Eine UI soll keine rote Fehlermeldung anzeigen, nur weil die alte Suche durch eine neue ersetzt wurde. Prüfe vor jedem State-Update, ob die Antwort noch zur aktuellen Suche gehört. Genau diese fachliche Gültigkeit macht einen asynchronen Ablauf robust. Weder await noch TypeScript ersetzen die Entscheidung, welche Antwort noch autorisiert ist, die Anzeige zu verändern.',
 'let generation = 0;\nasync function search(term) {\n  const requestId = ++generation;\n  const result = await readJson("/search?q=" + encodeURIComponent(term));\n  if (requestId !== generation) return;\n  console.log(result);\n}',
 'Die Generation prüft Aktualität. Für einen produktiven Suchdialog gehört eine passende catch- und Abbruchbehandlung hinzu.']
 ],
 questions:[
 ['Startet Promise.resolve eine neue CPU-Ausführungseinheit?','Nein.','Promises organisieren asynchrone Ergebnisse und Fortsetzungen, nicht automatisch Threads.'],
 ['Warum prüft man bei fetch den HTTP-Status?','Ein HTTP-404 lässt das fetch-Promise üblicherweise erfüllt zurück.','Transporterfolg und fachlicher Status der Antwort sind unterschiedliche Dinge.'],
 ['Warum ist AbortController allein kein vollständiger Race-Condition-Schutz?','Nicht jede Operation ist abbrechbar, und Antworten können bereits angekommen sein.','Eine zusätzliche Prüfung auf die aktuelle Anfrage verhindert veraltete Updates.']
 ],
 exercise:'Entwirf eine Suchfunktion, die alte fetch-Anfragen abbricht, nur Ergebnisse der aktuellen Suche darstellt und HTTP-Fehler getrennt von einem freiwilligen Abbruch behandelt. Skizziere Tests für zwei vertauschte Antwortreihenfolgen und einen 404-Status.',
 answer:'Verwende einen AbortController pro Anfrage und brich den Vorgänger beim Start einer neuen Suche ab. Vergib eine Generation-ID, prüfe response.ok und den JSON-Vertrag, und setze den State nur, wenn ID aktuell und Signal nicht abgebrochen ist. Im catch bei signal.aborted keine Fehleranzeige erzeugen. Simuliere verzögerte Promises mit umgekehrter Reihenfolge.'
},
{language:'csharp',id:'cs-linq-deferred',title:'C#: LINQ, verzögerte Auswertung und Collection-Verträge',
 objectives:['IEnumerable, Where und Select als Verarbeitungskette erklären.','Deferred Execution von materialisierten Ergebnissen unterscheiden.','Mehrfachauswertung, Mutation und Ordnungsannahmen bewusst behandeln.'],
 reference:'https://learn.microsoft.com/en-us/dotnet/csharp/linq/',
 sections:[
 ['queries','Eine LINQ-Abfrage beschreibt die Verarbeitung einer Quelle',
 'Mit LINQ lassen sich Collections durch Where filtern, Select transformieren und OrderBy sortieren. Diese Aufrufe arbeiten für IEnumerable<T> mit einer einheitlichen Ausdrucksweise, unabhängig davon, ob die ursprünglichen Daten aus einer Liste oder einer anderen iterierbaren Quelle stammen. Die Stärke liegt darin, dass eine Abfrage die Datenfrage sichtbar macht. Eine Eventliste kann beispielsweise zuerst ungültige Termine ausblenden und anschließend nur ihre Titel liefern.',
 'Wichtig ist die Unterscheidung zwischen dem IEnumerable-Vertrag und einer konkret materialisierten Liste. Eine LINQ-Abfrage kann die Verarbeitung erst bei einer Iteration ausführen. Wer annimmt, Where habe bereits unmittelbar alle Elemente durchgerechnet, missversteht die Zeitpunkte möglicher Fehler und Seiteneffekte. Materialisierende Operatoren wie ToList erzeugen dagegen eine neue Collection mit den zu diesem Zeitpunkt ausgewerteten Ergebnissen.',
 'var titles = events\n    .Where(e => e is not null && e.Active)\n    .Select(e => e!.Title)\n    .ToList();',
 'Die Filterregel vermeidet Null-Events. Das ! im Beispiel unterdrückt nur eine Compilerwarnung; sauberer wäre ein Typfilter oder expliziter Guard.'],
 ['deferred','Eine Abfrage kann beim zweiten Durchlaufen anders aussehen',
 'Eine deferred IEnumerable-Abfrage wird bei erneutem Enumerieren häufig erneut ausgewertet. Wurde die zugrunde liegende veränderliche Liste zwischenzeitlich erweitert, kann eine spätere Enumeration andere Ergebnisse enthalten. Das ist kein Fehler in LINQ, sondern Folge der verzögerten Ausführung. Wenn ein Bericht eine feste Momentaufnahme benötigt, sollte er die Ergebnisse bewusst materialisieren. Wenn aktuelle Daten bei jeder Abfrage gewünscht sind, kann ein dynamisches IEnumerable dagegen passend sein.',
 'Mehrfachauswertung ist außerdem ein Performance-Thema. Wenn Where und Select teure Operationen ausführen oder die Quelle Datenbankabfragen auslöst, kann ein zweiter Durchlauf die Arbeit wiederholen. Bei IQueryable<T> werden manche Operationen an einen externen Provider übersetzt; deshalb sollte man nicht blind die Semantik einer In-Memory-Liste auf eine Datenbankabfrage übertragen. Das genaue Ausführungsmodell der Quelle ist Teil des Vertrages.',
 'var source = new List<int> { 1, 2 };\nvar query = source.Where(value => value > 1);\nsource.Add(3);\nvar result = query.ToList(); // 2 und 3',
 'Die Liste wurde vor der Enumeration erweitert. Die deferred Query sieht die neue Eingabe.'],
 ['operators','Filter, Projektion und Gruppierung sind verschiedene Aufgaben',
 'Where behält passende Elemente; Select berechnet pro Eingabe ein Ergebnis; SelectMany kann verschachtelte Folgen auf eine gemeinsame Folge projizieren. GroupBy gruppiert Elemente nach einem Schlüssel. Diese Operatoren sind fachlich verschieden und sollten nicht nur danach gewählt werden, welcher Einzeiler den kürzesten Code ergibt. Eine Eventverwaltung benötigt beispielsweise eine Gruppe pro Veranstaltungsort, aber der Schlüssel muss vorher eindeutig und sinnvoll normalisiert werden.',
 'Die Reihenfolge der Operatoren kann Kosten und Bedeutung verändern. Ein früher selektiver Filter vor einer aufwendigen Projektion spart häufig Arbeit. Beim Sortieren müssen alle relevanten Werte für eine vollständige Ordnung berücksichtigt werden. Gleichheit und Gruppierung hängen vom jeweiligen Comparer beziehungsweise EqualityComparer ab. Wenn zwei Eventeinträge denselben normalisierten Schlüssel haben sollen, muss diese Identitätsregel ausdrücklich modelliert sein.',
 'var counts = events\n    .GroupBy(e => e.Location)\n    .Select(group => new { Location = group.Key, Count = group.Count() })\n    .OrderBy(row => row.Location)\n    .ToList();',
 'Die Gruppierung ist eine fachliche Entscheidung über Location-Gleichheit. Eine Normalisierung kann davor nötig sein.'],
 ['boundaries','Eine LINQ-Pipeline ersetzt keinen Datenvertrag',
 'LINQ kann Nullwerte filtern, aber unvollständige oder fehlerhafte Daten müssen an der Eingangsgrenze weiterhin überprüft werden. Ein DTO aus JSON besitzt nicht automatisch alle benötigten Strings, selbst wenn die Klassenproperties als nicht-null definiert sind. Die Query darf deshalb nicht darauf bauen, dass jeder Eventeintrag aus einer fremden Quelle bereits gültig ist. Eine Validierung kann beispielsweise sicherstellen, dass Titel und IDs nicht leer sind und Datumswerte einen zulässigen Bereich besitzen.',
 'Tests sollten mehr als nur eine zufällige Ergebnismenge prüfen. Beobachte insbesondere leere Eingaben, doppelte Schlüssel, nicht erwartete Nullwerte, festgelegte Reihenfolge und die Frage, ob eine Momentaufnahme oder eine Live-Abfrage zurückgegeben wird. Wenn der Rückgabetyp IEnumerable<T> ist, muss dokumentiert sein, ob der Aufrufer die Enumeration wiederholen darf. Verständliche Datenverarbeitung entsteht aus transparenten Verträgen, nicht allein aus einer eleganten Methodenkette.',
 'static IReadOnlyList<int> PositiveSnapshot(IEnumerable<int> numbers) =>\n    numbers.Where(value => value > 0).ToList();',
 'Die Materialisierung gibt für diese einfachen Integerwerte eine unabhängige Momentaufnahme zurück.']
 ],
 questions:[
 ['Wann wird eine typische IEnumerable-LINQ-Where-Abfrage ausgewertet?','Bei der Enumeration.','Viele LINQ-Operatoren sind deferred und materialisieren nicht automatisch.'],
 ['Warum kann dieselbe Query nach Mutation der Ursprungsliste neue Werte liefern?','Sie wird bei einer erneuten Enumeration erneut ausgeführt.','Eine ausdrücklich materialisierte Liste hält dagegen die früher ausgewerteten Ergebnisse fest.'],
 ['Ersetzt Where die Validierung fremder JSON-Objekte?','Nein.','Eine Filterkette setzt sinnvolle Feld- und Typverträge voraus, die an der Systemgrenze geprüft werden müssen.']
 ],
 exercise:'Implementiere ActiveTitlesSnapshot(IEnumerable<Event> events), das null-Elemente ausblendet, aktive Events auswählt, ihre Titel trimmt, leere Titel verwirft und eine nach Titel sortierte Momentaufnahme zurückgibt. Teste die Behandlung einer nachträglich veränderten Ursprungscollection.',
 answer:'Nutze eine explizite Validierung von Events und Titeln, dann Where, Select, weitere Filterung und OrderBy. Abschließend ToList oder ToArray ausführen und als IReadOnlyList<string> zurückgeben. Mutationen der ursprünglichen Eventliste nach dem Aufruf dürfen die bereits berechneten Stringwerte nicht verändern.'
},
{language:'cpp',id:'cpp-values-containers',title:'C++: Wertsemantik, Container und sichere Iteration',
 objectives:['std::vector, std::array und std::span nach ihrer Speicherrolle unterscheiden.','Iteratorinvalidierung bei Containeränderungen erklären.','Wert- und Referenzübergabe als API-Vertrag auswählen.'],
 reference:'https://en.cppreference.com/w/cpp/container/vector',
 sections:[
 ['values','Wertsemantik ist der gewöhnliche Ausgangspunkt',
 'C++-Objekte können als Werte geführt werden. Ein std::string oder std::vector verwaltet seine Ressourcen über Konstruktion und Destruktion und lässt sich in vielen Fällen sicher als Wert zurückgeben. Das erleichtert lokale Verantwortlichkeit: Die aufrufende Funktion erhält einen eigenen verwalteten Wert, der nicht an die Lebensdauer einer lokalen Variable im Aufrufer gebunden ist. Moderne Kopierelision und Move-Operationen helfen, unnötigen Aufwand zu vermeiden, ohne jede Rückgabe als Referenz ausdrücken zu müssen.',
 'Referenzen sind sinnvoll, wenn eine Funktion Daten nur lesen oder gezielt verändern soll. Ein const std::vector<Event>& kann den Besitz beim Aufrufer belassen; eine std::vector<Event>& erlaubt veränderliche Zugriffe. Ein Rückgabewert als Referenz auf eine lokale temporäre Collection ist dagegen gefährlich, weil deren Lebensdauer beim Funktionsende endet. Die Signatur soll zeigen, ob eine Funktion einen eigenen Wert liefert, einen fremden leiht oder den fremden Zustand ändert.',
 '#include <vector>\nstd::vector<int> doubled(const std::vector<int>& values) {\n    std::vector<int> result;\n    for (int value : values) result.push_back(value * 2);\n    return result;\n}',
 'Das Ergebnis besitzt seine eigene Lebensdauer. Die Eingabe wird nur gelesen.'],
 ['containers','Feste und dynamische Folge nicht vermischen',
 'std::array<T,N> speichert genau N Elemente im Objekt und besitzt einen festen Größenvertrag. std::vector<T> kann seine Größe dynamisch ändern und verwaltet dazu Speicher. std::span<T> ist eine nicht besitzende Sicht auf eine zusammenhängende Folge. Diese Typen lösen unterschiedliche fachliche Aufgaben. Wer eine Funktion nur über bestehende Elemente lesen lassen möchte, kann häufig einen span<const T> entgegennehmen, ohne sich auf genau einen Container-Typ festzulegen.',
 'Eine View wie span hält die zugrunde liegenden Daten nicht selbst am Leben. Wird der Besitzer zerstört oder verschiebt eine Containeroperation die Elemente an einen anderen Speicherort, kann eine zuvor gespeicherte span ungültig werden. Das gleiche Grundproblem betrifft andere Iteratoren und Referenzen. Benenne deshalb den Lebensdauervertrag, statt zu behaupten, eine View sei eine automatisch sichere Kopie der Daten.',
 '#include <array>\n#include <span>\nstd::array<int, 3> fixed{1, 2, 3};\nstd::span<const int> view{fixed};',
 'view besitzt nicht das Array. Es bleibt nur gültig, solange die referenzierten Elemente existieren.'],
 ['invalidation','Einfügen kann Iteratoren und Referenzen ungültig machen',
 'std::vector nutzt einen zusammenhängenden Speicherbereich. Bei einem Wachstum kann eine Reallokation nötig werden, wodurch alte Iteratoren, Zeiger und Referenzen auf die Elemente ungültig werden. Selbst ohne Reallokation können Einfüge- und Löschoperationen die Gültigkeit bestimmter Positionen beeinflussen. Wer einen Iterator auf das erste Element speichert und danach mehrfach push_back aufruft, darf ihn nicht automatisch weiterverwenden. Das ist eine reale Lebensdauerfrage und nicht nur eine Compilerwarnung.',
 'Wenn du während einer Iteration Elemente entfernen möchtest, verwende ein Verfahren, dessen Regeln du verstehst, etwa erase/remove oder die passenden C++20-Erase-Helfer. Ein unbedachtes erase innerhalb einer range-for-Schleife kann die Iteration invalidieren. Oft ist es lesbarer, den zu entfernenden Bereich als separate Operation auszudrücken. Prüfe in Tests leere Container, das Entfernen des ersten und letzten Elements und mehrfaches Wachstum.',
 '#include <vector>\n#include <algorithm>\nstd::vector<int> values{1, 2, 3, 4};\nstd::erase_if(values, [](int value) { return value % 2 == 0; });',
 'std::erase_if für std::vector entfernt passende Elemente; für das vollständige Beispiel gelten C++20 und die angegebenen Includes.'],
 ['design','Eine klare Collection-API schützt vor Dangling Views',
 'Ein Eventkatalog kann einen vector<Event> besitzen und seine Daten über Funktionen zugänglich machen. Eine Funktion, die den ganzen Katalog als veränderliche Referenz herausgibt, überlässt der Außenwelt sämtliche Invarianten. Eine Funktion, die eine unveränderliche Momentaufnahme als Wert liefert, macht Änderungen dagegen explizit und unabhängig. Alternativ kann eine geliehene Sicht effizient sein, muss aber an die Lebensdauer des Katalogs gebunden bleiben.',
 'Performance-Entscheidungen verdienen Messungen statt Reflexe. Ein unnötiges Kopieren großer Container kann teuer sein, doch eine falsch gehaltene Referenz verursacht im schlimmsten Fall Undefined Behavior. Beginne mit einem fachlich verständlichen Besitzmodell. Optimiere danach nur die relevanten Pfade und halte die Lebensdauergrenzen in API und Tests nachvollziehbar. Diese Denkweise verbindet Wertsemantik mit den RAII-Grundlagen aus dem vorigen Kapitel.',
 '#include <vector>\nclass Catalog {\n    std::vector<int> ids_;\npublic:\n    std::vector<int> snapshot() const { return ids_; }\n};',
 'Der Rückgabewert ist eine eigene Collection. Eine alternative View müsste explizit die begrenzte Lebensdauer dokumentieren.']
 ],
 questions:[
 ['Besitzt std::span die Elemente, auf die es verweist?','Nein.','Es handelt sich um eine nicht besitzende View mit begrenzter Gültigkeit.'],
 ['Warum kann vector::push_back einen alten Iterator ungültig machen?','Weil das Wachstum eine Reallokation auslösen kann.','Die Elemente können an einen neuen Speicherort verschoben werden.'],
 ['Ist Rückgabe eines std::vector als Wert grundsätzlich falsch wegen Kopierkosten?','Nein.','Wertsemantik, Move-Operationen und Kopierelision können sichere und effiziente Schnittstellen ermöglichen.']
 ],
 exercise:'Baue eine C++-Klasse Catalog, die vector<string> besitzt, add(string) anbietet und snapshot() als Wert zurückgibt. Demonstriere, dass Änderungen der Momentaufnahme den Katalog nicht verändern. Ergänze eine zweite read-only Schnittstelle mit einer geliehenen View und dokumentiere deren Lebensdauer.',
 answer:'Implementiere private std::vector<std::string> titles_; add fügt ein, snapshot() const liefert titles_ als Wert. Eine passende geliehene Sicht könnte std::span<const std::string> über titles_ sein, darf aber nicht länger als die gespeicherten Elemente verwendet werden. Teste die unabhängige Momentaufnahme sowie den Fall, dass der Katalog sich danach ändert.'
},
{language:'php',id:'php-exceptions-contracts',title:'PHP: Typdeklarationen, Exceptions und Fehlergrenzen',
 objectives:['strict_types und Parametertypen richtig einordnen.','Exceptions von normalen fehlenden Ergebnissen trennen.','Eingaben validieren und Fehler an der richtigen Schicht behandeln.'],
 reference:'https://www.php.net/manual/en/language.exceptions.php',
 sections:[
 ['types','Typsignaturen helfen nur mit klaren Datenverträgen',
 'PHP kann Parameter- und Rückgabetypen deklarieren. Mit declare(strict_types=1) lässt sich die Behandlung bestimmter skalarer Argumenttypen am Aufrufort strikter gestalten. Diese Deklaration ist keine globale Projektoption und beweist nicht, dass eine eingelesene JSON-Struktur alle gewünschten Schlüssel besitzt. Wer ein Array von Events aus einem HTTP-Request übernimmt, muss dessen innere Form weiterhin ausdrücklich prüfen. Ein Typ array sagt zunächst nichts über die vorhandenen Keys oder die Gültigkeit der Werte aus.',
 'Für robuste Anwendungen sollte jede öffentliche Eingangsgrenze klar dokumentieren, welche Informationen erforderlich sind. Eine Funktion zum Anlegen eines Events muss vielleicht einen nichtleeren Titel und eine positive Kapazität verlangen. Auch wenn die Parameter als string und int deklariert sind, entstehen solche fachlichen Grenzen nicht automatisch aus dem Typsystem. Deshalb gehört die Validierung an den Anfang der Operation oder in einen klar benannten Konstruktor.',
 '<?php\ndeclare(strict_types=1);\nfunction availableSeats(int $capacity, int $booked): int {\n    if ($capacity < 0 || $booked < 0 || $booked > $capacity) {\n        throw new InvalidArgumentException("Invalid seats");\n    }\n    return $capacity - $booked;\n}',
 'Die Typsignatur und die fachliche Plausibilitätsregel sind getrennte Teile des Vertrags.'],
 ['exceptions','Eine Exception meldet einen gescheiterten Ablauf',
 'In PHP können Funktionen Exceptions werfen, die über try/catch behandelt werden. Eine Exception ist sinnvoll, wenn eine Operation ihren Vertrag nicht erfüllen kann, etwa wegen ungültiger Eingaben oder einer unerreichbaren Datenquelle. Das ist etwas anderes als eine erfolgreiche Suche ohne Treffer. Eine Suchfunktion kann beispielsweise null zurückgeben, wenn das Fehlen fachlich normal ist, während ein fehlerhafter Datenbankzugriff eine Exception auslösen sollte.',
 'Wer sämtliche Throwable-Ausnahmen pauschal verschluckt und anschließend einen leeren Datensatz zurückliefert, macht aus einem Betriebsfehler einen scheinbaren Erfolg. Besser ist, dass diejenige Schicht entscheidet, die den Fehler sinnvoll in eine Nutzeranzeige oder einen API-Status übersetzen kann. Eine Bibliotheksfunktion darf Exceptions an ihren Aufrufer weitergeben; sie muss nicht an jeder Stelle Fehlermeldungen ausgeben oder einen Ersatzwert erfinden.',
 'try {\n    echo availableSeats(10, 3);\n} catch (InvalidArgumentException $error) {\n    error_log($error->getMessage());\n}',
 'Der Catch behandelt genau den erwarteten Vertragsfehler. Ein anderer Fehler wird nicht versehentlich als derselbe Fall ausgegeben.'],
 ['finally','Ressourcen brauchen eine klare Abschlussregel',
 'Ein finally-Block wird im Rahmen einer try/catch/finally-Konstruktion für die Abschlusslogik verwendet, unabhängig davon, ob ein passender Catch ausgeführt wurde. Das ist nützlich, wenn eine Operation eigene Ressourcen zuverlässig schließen muss. Nicht jedes PHP-Objekt verlangt manuelles Freigeben; viele Bibliotheken verwalten ihre Ressourcen selbst. Wo ein eigener Stream oder ein Lock geöffnet wurde, sollte aber eindeutig feststehen, wer für die Freigabe verantwortlich ist.',
 'Eine gute Methode behandelt die Fehlerquellen nach der Bedeutung für den Aufrufer. Wenn das Schreiben einer Datei scheitert, sollte ein Rückgabewert nicht einfach einen erfolgreichen Export vortäuschen. Fehler beim finalen Flush oder Close können ebenfalls relevant sein. Für solche Fälle hilft ein expliziter Vertrag, der zwischen vorbereiteten Daten und erfolgreich dauerhaft gespeicherten Daten unterscheidet. Das Konzept ist unabhängig von der konkreten try/catch-Syntax.',
 '$handle = fopen($path, "rb");\nif ($handle === false) throw new RuntimeException("Cannot open file");\ntry {\n    $data = stream_get_contents($handle);\n    if ($data === false) throw new RuntimeException("Cannot read file");\n} finally {\n    fclose($handle);\n}',
 'Der Stream wird nach erfolgreichem Öffnen im finally geschlossen.'],
 ['layers','Fehler und Normalfälle nicht vermischen',
 'Eine API-Anwendung benötigt verschiedene Antworten für nicht gefunden, ungültige Eingabe, Berechtigungsfehler und unerwartete Systemstörung. Diese Fälle unterscheiden sich fachlich. Wenn alle als leeres Array ausgegeben werden, kann der Client nicht richtig reagieren. Ein Exception-Typ und ein sauberer Schichtvertrag helfen, die Ursache zu erhalten. Zusätzlich sollten Logs keine Passwörter, Tokens oder private Nutzerdaten unbedacht enthalten.',
 'Trenne daher Eingabevalidierung, fachliche Operation und Präsentation. Eine Methode kann einen geprüften Datensatz zurückgeben oder einen klar benannten Fehler signalisieren; die HTTP-Schicht übersetzt dies in eine passende Statusmeldung. Schreibe Tests für 0, fehlende Felder, Nullwerte, beschädigte Dateiinhalte und echte Betriebsfehler. Eine rote Fehlermeldung nach einem ungültigen Titel ist kein Ersatz für eine verlässliche Eingangsvalidierung.',
 'function normalizeTitle(string $raw): string {\n    $text = trim($raw);\n    if ($text === "") throw new InvalidArgumentException("Empty title");\n    return $text;\n}',
 'Die Funktion unterscheidet ungültigen Text von einem normalen erfolgreichen Ergebnis.']
 ],
 questions:[
 ['Prüft ein PHP-Parametertyp array automatisch die enthaltenen Event-Keys?','Nein.','Eine Array-Deklaration sagt nichts über die konkrete Feldstruktur aus.'],
 ['Soll ein Datenbankfehler als erfolgreicher leerer Suchtreffer getarnt werden?','Nein.','Nicht gefunden und fehlgeschlagene Operation sind unterschiedliche fachliche Zustände.'],
 ['Wann ist finally für einen geöffneten Stream sinnvoll?','Wenn die Freigabe auf allen Rückgabepfaden gesichert werden soll.','Die Abschlussregel darf nicht von einem einzelnen erfolgreichen Verarbeitungspfad abhängen.']
 ],
 exercise:'Implementiere readRequiredTitle(array $row): string, das fehlende oder ungültige title-Einträge über InvalidArgumentException ablehnt. Verwende array_key_exists, is_string und trim. Entwirf einen Aufruf mit try/catch, der nur den fachlichen Vertragsfehler behandelt.',
 answer:'Prüfe array_key_exists("title", $row) und is_string($row["title"]); bei Verletzung wirf InvalidArgumentException. Entferne führende und folgende Leerzeichen, lehne blank ab und gib den normalisierten Text zurück. Der Aufrufer kann diesen einen Fehler gezielt in eine Eingabeaufforderung übersetzen, während Betriebsfehler weiterlaufen.'
},
{language:'go',id:'go-context-concurrency',title:'Go: Context, Goroutinen und kontrollierte Beendigung',
 objectives:['Goroutinen von normalem synchronem Aufruf unterscheiden.','Context als Abbruch- und Deadline-Signal weiterreichen.','Nicht beendete Worker und Channel-Blockaden vermeiden.'],
 reference:'https://go.dev/blog/context',
 sections:[
 ['goroutines','Eine Goroutine ist kein automatisch verwalteter Auftrag',
 'Eine Funktion kann in Go mit go f() als Goroutine gestartet werden. Der aufrufende Ablauf wartet dann nicht automatisch auf ihr Ergebnis. Das ist hilfreich bei unabhängigen Operationen, birgt aber eine Verantwortung: Wer stoppt die Arbeit, wenn der Nutzer die Anfrage abbricht oder das Programm den Auftrag nicht mehr braucht? Eine vergessene Goroutine kann auf einen Channel warten, Ressourcen halten oder über lange Zeit nutzlos rechnen. Nebenläufigkeit wird erst durch klare Lebensdauerregeln robust.',
 'Ein Channel kann Werte zwischen Goroutinen transportieren und dabei die Synchronisierung unterstützen. Ein Sende- oder Empfangsvorgang kann blockieren, sofern keine passende Gegenoperation oder Pufferkapazität vorhanden ist. Deshalb sollte ein Worker nicht ausschließlich auf einen Channel warten, wenn die zugehörige Anfrage längst abgebrochen wurde. Ein zusätzlicher select-Zweig für ein Abbruchsignal kann helfen, den Ablauf kontrolliert zu verlassen.',
 'done := make(chan struct{})\ngo func() {\n    defer close(done)\n    // begrenzte, kontrollierte Arbeit\n}()\n<-done',
 'Der wartende Aufrufer erhält ein Abschlussereignis. Ohne die letzte Zeile würde er nicht automatisch auf die Goroutine warten.'],
 ['context','Context trägt Abbruch und Fristen über Funktionsgrenzen',
 'Das Paket context beschreibt den Kontext einer Operation. Ein Context kann ein Done-Signal, eine Deadline und eine Fehlermeldung für den Abbruch bereitstellen. Wenn eine HTTP-Anfrage weitere Datenbank- oder Netzwerkarbeit auslöst, sollte die Stornierung der Ursprungshandlung nach Möglichkeit durch die beteiligten Funktionen weitergereicht werden. Das verhindert, dass längst irrelevante Unteraufgaben stillschweigend weiterarbeiten.',
 'Context ist keine magische Unterbrechung beliebiger CPU-Schleifen. Der jeweilige Worker oder die aufgerufene API muss regelmäßig prüfen, ob der Context bereits beendet wurde. Wenn du context.WithCancel oder context.WithTimeout verwendest, rufe die zugehörige cancel-Funktion auf, damit Ressourcen freigegeben werden. Der Context sollte normalerweise der erste Parameter einer Funktion sein, wenn er zu deren Operation gehört.',
 'ctx, cancel := context.WithTimeout(context.Background(), time.Second)\ndefer cancel()\nselect {\ncase <-ctx.Done():\n    return ctx.Err()\ncase result := <-results:\n    _ = result\n}',
 'Der Ausschnitt gehört in eine Funktion mit geeignetem error-Rückgabetyp und bestehenden Imports sowie einem results-Channel.'],
 ['workers','Worker müssen ein Ende haben',
 'Ein Worker kann über eine Channel-Schleife Nachrichten verarbeiten. Die Schleife sollte aber wissen, wann keine Arbeit mehr kommt oder die Verarbeitung abgebrochen wurde. Ein geschlossener Channel kann den Abschluss der Quelle anzeigen; ein Context kann den Nutzerabbruch signalisieren. Beachte bei fan-out-Architekturen, dass mehrere Worker nicht unkoordiniert denselben Channel schließen dürfen. Die Verantwortung zum Schließen gehört normalerweise zur sendenden Seite, die weiß, dass keine weiteren Werte folgen.',
 'Die Auswahl zwischen gebufferten und ungebufferten Channels beeinflusst das Blockierverhalten. Ein Puffer kann Lastspitzen auffangen, macht aber keine unendlich große Warteschlange sicher. Definiere Grenzen für gleichzeitig laufende Aufgaben und eine Strategie für Überlast. Gute Nebenläufigkeit bedeutet nicht, möglichst viele Goroutinen zu starten, sondern bewusst steuerbar zu bleiben und Fehler nachvollziehbar an eine zentrale Stelle zu melden.',
 'func worker(ctx context.Context, jobs <-chan int) {\n    for {\n        select {\n        case <-ctx.Done(): return\n        case value, ok := <-jobs:\n            if !ok { return }\n            _ = value\n        }\n    }\n}',
 'Der Worker beendet sich beim Abbruch oder wenn die Job-Quelle geschlossen wurde.'],
 ['tests','Zeitabhängigkeit und Race Conditions systematisch prüfen',
 'Tests für nebenläufige Programme müssen nicht auf zufällige Sleeps setzen. Du kannst kontrollierte Channels und eine eigene Timeout-Grenze nutzen, um den Ablauf reproduzierbar zu beobachten. Prüfe, ob ein Worker bei Abbruch endet, ob er einen geschlossenen Channel korrekt verarbeitet und ob eine Überlastgrenze eingehalten wird. Zusätzlich kann der Race Detector bei go test -race bestimmte ungeschützte gemeinsame Speicherzugriffe erkennen.',
 'Ein grüner Race-Detector-Lauf beweist nicht, dass jede zeitliche Interaktion korrekt ist. Deadlocks, fehlende fachliche Reihenfolge und verlorene Ergebnisse sind eigene Fehlertypen. Entscheidend sind beobachtbare Verträge: Welches Ergebnis muss spätestens vorliegen, wann darf ein Worker nichts mehr senden und wer besitzt den Abschlusskanal? Eine kleine, kontrollierte Architektur ist oft zuverlässiger als ein beeindruckend großer Satz nebenläufiger Helfer.',
 'func cancelled(ctx context.Context) bool {\n    select {\n    case <-ctx.Done(): return true\n    default: return false\n    }\n}',
 'Die Funktion prüft einen aktuellen Abbruchzustand ohne blockierendes Warten.']
 ],
 questions:[
 ['Beendet sich eine Goroutine automatisch, wenn der Aufrufer keinen Wert mehr benötigt?','Nein.','Die Arbeit braucht eigene Abschluss- oder Abbruchregeln.'],
 ['Stoppt context.WithCancel jede beliebige Berechnung augenblicklich?','Nein.','Die beteiligte Operation muss das Signal respektieren oder selbst prüfen.'],
 ['Wer sollte einen Job-Channel normalerweise schließen?','Die sendende Seite, die sicher weiß, dass keine Werte mehr folgen.','Mehrere konkurrierende Schließversuche können zu Panics führen.']
 ],
 exercise:'Implementiere einen Worker, der ints aus jobs empfängt und beim Abbruch von ctx oder beim Schließen von jobs endet. Zeige einen Test mit context.WithCancel, bei dem ein done-Channel das Ende bestätigt. Vermeide Sleep als einziges Synchronisationsmittel.',
 answer:'Nutze eine for/select-Schleife mit case <-ctx.Done(): return sowie case value, ok := <-jobs: if !ok return. Starte den Worker als Goroutine und schließe einen done-Channel über defer. Im Test rufe cancel und warte per select auf done beziehungsweise einen begrenzten Timeout-Context. Beende alle Goroutinen im Test auch bei Fehlern.'
},
{language:'kotlin',id:'kt-coroutines-structure',title:'Kotlin: Coroutines, Cancellation und strukturierte Nebenläufigkeit',
 objectives:['Suspend-Funktion und Coroutine-Scope voneinander unterscheiden.','Strukturierte Lebensdauer statt unkontrollierter globaler Jobs erklären.','Cancellation und Fehlerpfade für UI- und Hintergrundarbeit korrekt behandeln.'],
 reference:'https://kotlinlang.org/docs/coroutines-basics.html',
 sections:[
 ['suspend','Suspend ist kein eigener Thread',
 'Eine suspend-Funktion kann ihre Ausführung an geeigneten Suspend-Punkten unterbrechen, ohne einen zugrunde liegenden Thread während des Wartens blockieren zu müssen. Das bedeutet nicht, dass die Funktion automatisch parallel läuft oder für jede Coroutine ein eigener Thread entsteht. Welche Threads und Ausführungsregeln gelten, hängt vom Dispatcher und vom aufrufenden Scope ab. Eine lange CPU-Schleife wird nicht allein deshalb reaktionsfreundlich, weil die umgebende Funktion suspend heißt.',
 'Für ein klares Programm solltest du IO-Arbeit, CPU-Arbeit und UI-Aktualisierungen unterscheiden. Ein Netzwerkrequest kann suspendiert auf seine Antwort warten; rechenintensive Verarbeitung benötigt eine passende Ausführungsstrategie. Die Lesbarkeit von sequentiellem suspend-Code ist ein großer Vorteil, ersetzt aber keine Fehlerbehandlung. Eine Suspend-Funktion kann eine Exception werfen oder durch Cancellation beendet werden, und die äußere Schicht muss wissen, was dann mit ihren Ergebnissen passiert.',
 'suspend fun fetchTitle(): String {\n    delay(100)\n    return "Workshop"\n}',
 'delay suspendiert an einem geeigneten Punkt; es ist kein blockierendes Thread.sleep. Ein Scope ist zum Aufruf erforderlich.'],
 ['scopes','Ein Scope bestimmt, zu welcher Aufgabe ein Kind gehört',
 'Strukturierte Nebenläufigkeit verknüpft gestartete Coroutines mit einem übergeordneten Scope und Job. Das ist wichtig, weil ein Benutzer eine Ansicht schließen oder eine neue Suche starten kann. Wenn die Arbeit an den Lebenszyklus der Ansicht gebunden ist, sollte sie beim Verlassen nicht als vergessene globale Aufgabe weiterlaufen. Ein unkontrollierter GlobalScope kann solche Verantwortlichkeiten verwischen und erschwert es, Fehler und Abbruch an der richtigen Stelle zu behandeln.',
 'Bei einer CoroutineScope- oder coroutineScope-Struktur kann ein Kindauftrag Fehler und Cancellation nach definierten Regeln an den Elternkontext weitergeben. Supervisor-Strategien unterscheiden sich davon. Es gibt keine einzelne Einstellung, die immer besser ist: Entscheidend ist, ob ein fehlgeschlagener Teilauftrag die übrigen stoppen soll oder nicht. Dieser Vertrag sollte bei parallelen Datenabfragen und UI-Aktionen sichtbar dokumentiert sein.',
 'suspend fun loadBoth(): Pair<String, String> = coroutineScope {\n    val a = async { fetchTitle() }\n    val b = async { fetchTitle() }\n    a.await() to b.await()\n}',
 'Die beiden Kindaufgaben gehören zum coroutineScope und werden beim Abschluss berücksichtigt.'],
 ['cancel','Cancellation braucht kooperative Ausführung',
 'Das Abbrechen eines Jobs signalisiert den zugehörigen Coroutines, dass sie ihre Arbeit beenden sollen. Viele suspending Funktionen reagieren darauf durch CancellationException. Eine CPU-intensive Schleife ohne Suspend-Punkte muss dagegen gegebenenfalls isActive prüfen oder andere kooperative Mechanismen nutzen. Wer CancellationException in einem allgemeinen catch auffängt und stillschweigend ignoriert, kann die geplante Abbruchsemantik zerstören.',
 'Für eine Suchfunktion ist der Abbruch der alten Anfrage ein natürlicher Teil des Produktverhaltens. Eine bewusst ersetzte Suche sollte normalerweise keine rote Fehlermeldung anzeigen. Gleichzeitig kann eine bereits eingetroffene Antwort noch für die falsche Suchgeneration verarbeitet werden. Deshalb helfen zusätzlich eine aktuelle Request-ID oder eine zentrale State Machine. Cancellation ist ein Werkzeug zur Lebensdauerverwaltung, nicht automatisch eine Garantie gegen jede Race Condition.',
 'suspend fun process(): String {\n    currentCoroutineContext().ensureActive()\n    return fetchTitle()\n}',
 'ensureActive prüft, ob der laufende Coroutine-Kontext noch aktiv ist.'],
 ['safety','Tests müssen Abbruch und Fehlerzustand sichtbar machen',
 'Eine Coroutine-Anwendung sollte Tests dafür haben, dass Kindjobs nach Verlassen ihres Scopes nicht weiterlaufen, ein Fehler die erwartete Wirkung hat und alte Ergebnisse die aktuelle Benutzerentscheidung nicht überschreiben. Mit geeigneten Coroutine-Testwerkzeugen lässt sich virtuelle Zeit steuern, damit Tests nicht unnötig auf reale Delays warten. Vermeide deshalb Teststrategien, die nur bei zufälligem Timing auf deinem eigenen Laptop erfolgreich sind.',
 'Auch die Fehlersemantik verdient klare APIs. Nicht gefunden kann ein reguläres leeres Ergebnis sein, während ein HTTP-Fehler oder beschädigte Antwort einen anderen Status verlangt. Kotlin-Nullsicherheit hilft beim Wertmodell, Coroutines beim zeitlichen Ablauf. Zusammen entsteht eine belastbare Anwendung nur dann, wenn Werteform, Job-Lebensdauer und fachliche Zustandsübergänge jeweils ausdrücklich kontrolliert werden.',
 'suspend fun firstValid(values: List<String?>): String? =\n    values.firstOrNull { !it.isNullOrBlank() }',
 'Die reine Datenfunktion benötigt trotz suspend keine asynchronen Operationen. In echtem Code wäre eine nicht-suspendierende Signatur meist klarer.']
 ],
 questions:[
 ['Ist jede suspend-Funktion automatisch parallel oder auf einem eigenen Thread?','Nein.','Suspension, Parallelität und Dispatching sind unterschiedliche Konzepte.'],
 ['Warum ist ein an einen UI-Scope gebundener Job oft besser als ein unkontrollierter globaler Job?','Seine Lebensdauer folgt einer sichtbaren fachlichen Aufgabe.','Abbruch und Fehler lassen sich an die übergeordnete Komponente binden.'],
 ['Warum darf CancellationException nicht pauschal verschluckt werden?','Dadurch kann der vorgesehene Abbruchmechanismus unterlaufen werden.','Cancellation ist ein Signal an die kooperativ laufende Struktur.']
 ],
 exercise:'Skizziere eine suspend-Funktion searchLatest(term), die eine alte Suche abbrechen kann und deren Ergebnis nur übernommen wird, wenn die Anfrage noch aktuell ist. Beschreibe Scope, Job, Cancellation und die zusätzliche Generation-ID. Teste zwei in unterschiedlicher Reihenfolge fertig werdende Antworten.',
 answer:'Verwalte den aktuellen Job in einem zum UI-Lebenszyklus gehörenden Scope, brich ihn beim nächsten Suchbegriff ab und starte eine neue Anfrage mit neuer Generation-ID. Prüfe vor dem State-Update, ob diese ID noch aktuell ist. Propagiere CancellationException; andere Fehler gehen in den passenden Error-State. Verwende kontrollierte Coroutine-Testdispatcher, um Antwortreihenfolgen nachzustellen.'
}
];
export const SECOND_LANGUAGE_CHAPTERS:readonly AuthoredLesson[]=chapters.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:30,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({
   id,title,paragraphs:[first,second],code,annotation
  })),
  checkpoints:item.questions.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.answer}
 };
 const implementation:LanguageVariant={
  language:item.language,name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Dieses Kapitel zeigt anhand eines konkreten Beispiels zentrale Sprachregeln und erklärt ihre Auswirkung auf das Programmverhalten.',
  differences:'Die vorgestellten Sprachregeln unterscheiden sich in Besitz, Fehlerbehandlung und Auswertung von anderen Sprachfamilien. Sie dürfen nicht pauschal übertragen werden.',
  equivalence:'related',docs:item.reference
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
