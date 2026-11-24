import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';
type Section=readonly [id:string,title:string,one:string,two:string,code:string,annotation:string];
type Check=readonly [question:string,answer:string,reason:string];
type Manuscript={id:string;title:string;source:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Check[];exercise:string;solution:string};
/** Original Checkmate manuscripts following publicly available official JavaScript language explanations. */
const MANUSCRIPTS:readonly Manuscript[]=[
{
 id:'js-object-prototypes',title:'JavaScript: Objekte, Prototypen und Property-Lookup',
 source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain',
 objectives:['Eigene und geerbte Eigenschaften im Lookup unterscheiden.','Objektidentität und veränderliche Prototypen nachvollziehen.','class-Syntax als Modell auf der Prototypmechanik einordnen.'],
 sections:[
 ['lookup','Eine Eigenschaft kann auf dem Objekt oder in seiner Kette liegen',
 'JavaScript-Objekte besitzen eigene Eigenschaften und eine interne Verknüpfung zu einem Prototypobjekt. Bei einem Zugriff wie event.describe wird zunächst nach einer eigenen passenden Eigenschaft gesucht. Existiert sie dort nicht, folgt die Laufzeit der Prototypkette und sucht weiter. Das ermöglicht es, dass mehrere Instanzen eine gemeinsame Methode verwenden, statt die Funktion bei jeder Objektkonstruktion separat als eigene Property zu speichern. Eine geerbte Methode wird dadurch nicht zu einer eigenen Eigenschaft der jeweiligen Instanz.',
 'Die Unterscheidung ist bei Daten aus anderen Quellen wichtig. Object.hasOwn(event, "id") fragt nach einer eigenen Property und berücksichtigt keine nur geerbte Eigenschaft. Der Operator in prüft dagegen, ob die Eigenschaft irgendwo in der Kette erreichbar ist. Wer ein importiertes Objekt allein anhand von "id" in object akzeptiert, kann daher einen geerbten Wert für eine angeblich explizit gelieferte ID halten. Für strenge Eingabeverträge solltest du die eigene Datenform und den Werttyp gesondert kontrollieren.',
 'const base = { describe() { return this.title; } };\nconst event = Object.create(base);\nevent.title = "Workshop";\nconsole.log(event.describe());\nconsole.log(Object.hasOwn(event, "describe")); // false',
 'Die Methode stammt aus dem Prototyp, während title eine eigene Property ist.'],
 ['shadow','Eine eigene Property kann eine geerbte verdecken',
 'Eine Instanz darf eine eigene Eigenschaft besitzen, deren Name ebenfalls im Prototyp auftaucht. Beim Zugriff gewinnt dann die eigene Property. Dieses Shadowing ist bei Methoden und Konfigurationen relevant: Ein Objekt kann eine geerbte Funktion mit einem anderen Wert überschreiben und damit Aufrufer überraschen. Wenn du über for...in iterierst, kannst du außerdem enumerable geerbte Eigenschaften sehen. Object.keys dagegen liefert nur eigene enumerable String-Keys.',
 'Für einen Datenexport ist deshalb nicht jede beliebige Objektenumeration geeignet. Entscheide, ob nur die tatsächlich gespeicherten Felder erscheinen sollen. Bei einem Event könnte eine explizite Projektion {id:event.id,title:event.title} klarer sein als die ungeprüfte Übernahme aller sichtbaren Eigenschaften. Das ist auch eine Sicherheitsfrage, wenn externe Eingaben dynamische Property-Namen enthalten. Prototypen sind ein Kern der Sprache, aber nicht jede Prototyp-Eigenschaft gehört in dein fachliches Datenformat.',
 'const base = { label: "Original" };\nconst child = Object.create(base);\nchild.label = "Eigene Angabe";\nconsole.log(child.label); // Eigene Angabe\nconsole.log(Object.keys(child)); // ["label"]',
 'Der eigene Wert verdeckt den Wert des Prototyps beim gewöhnlichen Property-Zugriff.'],
 ['class','class ist Syntax über einem prototypbasierten Modell',
 'Die class-Syntax erlaubt Konstruktoren, Methoden und Vererbung in einer für viele Entwickler vertrauten Form. JavaScript wird dadurch jedoch nicht zu einer Sprache mit einer unabhängigen klassenbasierten Objektlaufzeit: Die Methoden werden weiterhin über Prototypen zugänglich. Wer den Prototypmechanismus kennt, versteht besser, warum Object.getPrototypeOf(instance) oder instanceof zu bestimmten Ergebnissen führen. Gleichzeitig ist instanceof nicht immer eine geeignete Prüfung für Daten aus JSON oder anderen Realms.',
 'Bei Methodenaufrufen hängt this vom Aufrufkontext ab. Wird eine Methode aus einem Objekt herausgelöst und als gewöhnliche Funktion übergeben, kann ihr Empfänger verloren gehen. Für Callbacks ist es deshalb wichtig, ob eine Methode gebunden wird, ein Wrapper sie mit einem Objekt aufruft oder eine Arrow Function lexikalisch this erfasst. Ein unkontrollierter Callback-Fehler ist nicht automatisch ein Problem der Klassendeklaration, sondern kann aus der konkreten Aufrufweise entstehen.',
 'class Event {\n  constructor(title) { this.title = title; }\n  describe() { return this.title; }\n}\nconst event = new Event("Ada");\nconsole.log(Object.hasOwn(event, "describe")); // false',
 'Die Instanz besitzt title, die Methode ist auf Event.prototype definiert.'],
 ['security','Externe Objektkeys sind eine Vertrauensgrenze',
 'Bei ungeprüften Eingaben können Namen wie __proto__, constructor oder prototype besonders relevant sein, wenn Programme mit dynamischen Property-Zuweisungen und rekursiven Merges arbeiten. Eine unsichere Merge-Funktion kann Prototypobjekte verändern und so Verhalten an überraschenden Stellen beeinflussen. Dieses Problem wird als Prototype Pollution bezeichnet. Die richtige Verteidigung hängt vom Datenfluss ab: überprüfte Schemata, zulässige Schlüssel, Map statt freier Objektzuordnungen und sorgfältige Merge-Logik sind mögliche Bausteine.',
 'Ein Objekt mit null-Prototyp kann manche geerbten Namenskollisionen vermeiden, ersetzt aber nicht die Prüfung untrusted Daten. Noch wichtiger ist, dass ein Programm nicht ungeprüft aus einem Nutzerdatensatz heraus beliebige Eigenschaften interner Systemobjekte verändert. Trenne eingelesene Daten von Objekten, die Methoden und Programmverhalten besitzen. Ein gut konstruiertes Event-Datenmodell enthält ausdrücklich benannte Felder und eine eindeutige Konvertierung an der Systemgrenze.',
 'const data = Object.create(null);\ndata["E1"] = "Workshop";\nconsole.log(Object.getPrototypeOf(data) === null); // true',
 'Der null-Prototyp ist eine mögliche einfache Dictionary-Form; die Nutzereingaben müssen dennoch geprüft werden.']
 ],
 checks:[
 ['Prüft Object.hasOwn(obj,"key") die gesamte Prototypkette?','Nein, nur eigene Eigenschaften.','Mit in werden auch geerbte Eigenschaften berücksichtigt.'],
 ['Wird eine class-Methode automatisch als eigene Property jeder Instanz gespeichert?','Nein, gewöhnliche Klassenmethoden liegen auf dem Prototyp.','Mehrere Instanzen können dadurch dieselbe Methode nutzen.'],
 ['Ist ein rekursiver Merge mit beliebigen Nutzerkeys grundsätzlich sicher?','Nein.','Je nach Implementierung können gefährliche Prototyp-Eigenschaften verändert werden.']
 ],
 exercise:'Schreibe eine Funktion parseEvent(raw), die ausschließlich eigene string-Properties id und title von einem unbekannten JSON-Objekt akzeptiert. Teste eine geerbte id-Property, eine fehlende Property und eine gültige Eingabe. Zeige, warum ein in-Test allein fachlich nicht ausreicht.',
 solution:'Prüfe raw !== null, typeof raw === "object", !Array.isArray(raw), anschließend Object.hasOwn(raw,"id") und Object.hasOwn(raw,"title") sowie typeof der Werte und einen nichtleeren Titel. Baue ein neues reines Datenobjekt statt das Eingabeobjekt unkontrolliert weiterzureichen. Ein geerbter id-Wert muss abgelehnt werden.'
},
{
 id:'js-iterators-generators',title:'JavaScript: Iterationsprotokolle und Generatorfunktionen',
 source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators',
 objectives:['Iterable und Iterator fachlich unterscheiden.','for...of, for...in und Generatoren nicht verwechseln.','Einmalige Datenströme und Abbruchpfade zuverlässig handhaben.'],
 sections:[
 ['iterator','Iteration ist ein Vertrag über next',
 'Das Iteratorprotokoll verwendet eine next-Methode, die Ergebnisse mit value und done liefert. Ein Iterable besitzt dagegen eine Methode unter Symbol.iterator, die einen Iterator bereitstellt. Arrays, Maps und Sets können über for...of verarbeitet werden, weil sie dieses Protokoll unterstützen. Gewöhnliche Objektliterale sind dagegen nicht direkt über for...of iterierbar. Das Protokoll macht es möglich, fachliche Datenströme ohne eine konkrete Array-Implementierung anzubieten.',
 'Eine API, die ein Iterable akzeptiert, darf nicht automatisch mehrfaches Lesen oder einen Indexzugriff voraussetzen. Ein Generator kann nach seinem ersten Durchlauf erschöpft sein. Eine Array-Instanz kann bei jedem for...of dagegen einen neuen Iterator liefern. Das ist bei Funktionen wichtig, die erst zählen und danach erneut transformieren: Mit einem einmaligen Iterator könnte der zweite Schritt eine leere Folge sehen. Dokumentiere, ob du eine wiederholbar nutzbare Collection oder nur einen Stream benötigst.',
 'const values = [10, 20];\nconst iterator = values[Symbol.iterator]();\nconsole.log(iterator.next()); // {value:10,done:false}\nconsole.log(iterator.next()); // {value:20,done:false}',
 'Die Iteration wird schrittweise über next fortgesetzt; danach folgt ein done-Ergebnis.'],
 ['for','for...of liest Werte; for...in liest Property-Namen',
 'Die beiden Schleifenformen sehen ähnlich aus, beantworten aber unterschiedliche Fragen. for...of verwendet das Iterationsprotokoll und liefert die Werte einer Iterable-Quelle. for...in enumeriert erreichbare enumerable String-Property-Namen eines Objekts, einschließlich geeigneter geerbter Properties. Eine for...in-Schleife über ein Array ist deshalb nicht automatisch dieselbe Operation wie eine Wertiteration: Sie arbeitet mit Keys und kann von zusätzlichen Properties betroffen sein.',
 'Für die Verarbeitung einer Eventliste ist for...of häufig die klarste Schleife. Willst du die eigenen Felder eines Datenobjekts verarbeiten, sind Object.entries oder Object.keys oft verständlicher als eine ungeprüfte for...in-Iteration. Achte auch auf die Abbruchbedingungen: break beendet die aktuelle Schleife, während ein Iterator möglicherweise eine return-Methode zur Bereinigung anbietet. Bei Ressourcen-Generatoren kann das eine Rolle für finally-Blöcke spielen.',
 'const items = ["Ada", "Kim"];\nfor (const item of items) console.log(item);\nfor (const key in items) console.log(key); // "0", "1"',
 'for...of liefert Elemente, for...in deren enumerable Property-Namen.'],
 ['yield','Ein Generator pausiert und setzt später fort',
 'Eine function*-Deklaration erstellt eine Generatorfunktion. Beim Aufruf entsteht ein Generatorobjekt; die tatsächliche Arbeit läuft schrittweise bei next-Aufrufen bis zum nächsten yield. Lokaler Zustand bleibt zwischen den Fortsetzungen erhalten. Das ist geeignet, um schrittweise Eventtitel zu erzeugen, ohne unmittelbar eine vollständige Ergebnisliste aufzubauen. Sobald ein Generator beendet ist, lässt sich derselbe Generator nicht wie eine frische Factory erneut starten.',
 'Ein Generatorausdruck ist nicht automatisch eine leistungsfähigere oder asynchrone Verarbeitung. Ein synchroner Generator führt bei jedem next seine Berechnungen im aktuellen Thread aus. Lange CPU-Aufgaben können daher weiterhin die Oberfläche blockieren. Für asynchrone Datenströme existieren andere Schnittstellen wie Async Iterables; sie besitzen eigene Fehler- und Abbruchregeln. Verwende yield, wenn eine schrittweise, lesbare Datenerzeugung gebraucht wird, nicht weil sie eine heimliche Parallelisierung verspricht.',
 'function* titles(events) {\n  for (const event of events) if (event?.title) yield event.title;\n}\nconst values = titles([{title:"Ada"},{title:"Kim"}]);\nconsole.log([...values]); // ["Ada","Kim"]\nconsole.log([...values]); // []',
 'Ein Generatorobjekt ist nach vollständigem Verbrauch erschöpft.'],
 ['cleanup','Abbruch und Fehler beeinflussen die Lebensdauer',
 'Ein Generator kann einen try/finally-Block besitzen, der Abschlussarbeit ausführt, wenn der Generator regulär endet oder über passende Iterator-Abbruchmechanismen geschlossen wird. Das kann hilfreich sein, wenn eine schrittweise Verarbeitung Ressourcen zugeordnet bekommt. Allerdings solltest du dich nicht darauf verlassen, dass eine nie gestartete Generatorinstanz bereits Vorbereitung oder Abschluss ausgeführt hat. Die Lebensdauer hängt davon ab, ob der Generator tatsächlich betreten und später verlassen wurde.',
 'Wenn ein Callback während einer Iteration eine Exception auslöst, muss der Aufrufer entscheiden, ob sie fachlich behandelt oder weitergereicht wird. Ein generischer catch, der nur eine leere Liste zurückgibt, verschleiert dagegen die Ursache. Teste Iteration bis zum Ende, Abbruch beim ersten Treffer und den Fehler während der Verarbeitung. Für eine Importpipeline ist außerdem relevant, ob der Datenstrom nur teilweise verbraucht wurde und ob ein erneuter Versuch eine frische Quelle benötigt.',
 'function* numbers() {\n  try { yield 1; yield 2; }\n  finally { console.log("Generator abgeschlossen"); }\n}\nfor (const n of numbers()) { if (n === 1) break; }',
 'Die Schleife beendet den aktiven Generator frühzeitig; der finally-Block wird dabei ausgeführt.']
 ],
 checks:[
 ['Ist jedes gewöhnliche Objektliteral direkt über for...of iterierbar?','Nein.','Dafür braucht es ein passendes Symbol.iterator-Protokoll.'],
 ['Was liefert for...in bei einem Array?','Enumerable Property-Namen, typischerweise Index-Keys als Strings.','for...of ist für die Werte einer Iterable-Quelle zuständig.'],
 ['Kann dieselbe Generatorinstanz nach vollständigem Verbrauch erneut bei null starten?','Nein.','Für einen neuen Durchlauf muss die Generatorfunktion erneut aufgerufen werden.']
 ],
 exercise:'Implementiere function* upcomingTitles(events, cutoff), die nur gültige künftige Events aus einer Arrayfolge erzeugt. Teste stückweisen next-Aufruf, vollständigen Verbrauch und den zweiten Versuch, dieselbe Instanz zu durchlaufen. Erkläre, ob die Funktion einen Iterator oder eine fertige Arrayliste liefert.',
 solution:'Nutze function* mit einer for...of-Schleife. Prüfe jedes Element und seinen Datumstyp vor dem Vergleich, yield dann den Titel. Teste das erste next()-Ergebnis, danach [...generator] und abschließend eine leere zweite Aufzählung. Die Funktion liefert bei Aufruf ein neues Generatorobjekt und produziert erst beim Lesen Werte.'
},
{
 id:'js-maps-sets',title:'JavaScript: Map, Set und fachliche Identitätsregeln',
 source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
 objectives:['Map und Object anhand ihrer Schlüssel- und Prototypverträge auswählen.','Set-Deduplizierung von fachlicher Datensatzgleichheit unterscheiden.','Fehlende und vorhandene undefined-Werte nachvollziehbar behandeln.'],
 sections:[
 ['map','Map ist eine explizite Schlüssel-Wert-Sammlung',
 'Map speichert Zuordnungen von Schlüsseln auf Werte. Anders als gewöhnliche Objekte kann eine Map auch Objektwerte und andere Wertarten unmittelbar als Schlüssel verwenden. Ihre Iteration folgt der Einfügereihenfolge der Einträge. Das ist für Caches oder fachliche Zuordnungen nützlich, wenn die Schlüssel selbst keine sinnvollen Property-Namen darstellen. Die Map besitzt Methoden wie set, get, has und delete, deren Namen den beabsichtigten Umgang mit der Sammlung deutlich ausdrücken.',
 'Ein Objektliteral ist weiterhin für benannte Datensatzfelder geeignet. Für eine Eventstruktur mit id, title und date drückt ein Objekt die zusammengehörigen Eigenschaften gut aus. Eine Zuordnung von Event-ID auf solche Datensätze kann hingegen als Map modelliert werden. Entscheide also zwischen dem Datensatz als Wert und der Sammlung als Index. Diese Trennung macht fachliche Regeln über Eindeutigkeit und erlaubte Schlüssel leichter überprüfbar.',
 'const byId = new Map();\nbyId.set("E1", {title:"Workshop"});\nconsole.log(byId.get("E1")?.title); // Workshop\nconsole.log(byId.has("E2")); // false',
 'Map.has prüft, ob eine Zuordnung existiert. Map.get allein kann auch einen ausdrücklich gespeicherten undefined-Wert liefern.'],
 ['identity','Objektschlüssel nutzen Identität',
 'Zwei separat konstruierte Objekte mit gleichen Properties sind normalerweise nicht derselbe Map-Schlüssel. Auch ein Set behandelt solche Objekte grundsätzlich als unterschiedliche Elemente. Das ist wichtig, wenn du Events nach ihrer fachlichen ID zusammenfassen willst: new Set(events) entfernt dann nicht automatisch alle Datensätze mit gleicher ID. Du brauchst einen ausdrücklich extrahierten Schlüssel wie event.id, um fachliche Duplikate zuverlässig zu erkennen.',
 'Die Map-Schlüsselgleichheit basiert auf SameValueZero. Das ist bei Zahlen und insbesondere bei NaN relevant, ändert aber nicht die Identitätsregel für unterschiedliche Objektreferenzen. Für stabile Datenmodelle solltest du diese Technik nicht erraten, sondern die fachliche Identität dokumentieren. Ein Benutzer kann denselben Event zweimal importieren, obwohl zwei unterschiedliche JavaScript-Objekte daraus entstanden sind. Der Import muss anhand definierter Werte entscheiden, welcher Datensatz behalten wird.',
 'const first = {id:"E1"};\nconst second = {id:"E1"};\nconst set = new Set([first, second]);\nconsole.log(set.size); // 2\nconsole.log(new Set([first.id,second.id]).size); // 1',
 'Die Objektinstanzen sind verschiedene Identitäten; die gemeinsamen ID-Strings sind derselbe fachliche Schlüssel.'],
 ['missing','Fehlende Zuordnung und undefined-Wert sind nicht identisch',
 'Map.get(key) liefert undefined, wenn ein Schlüssel nicht existiert. Eine Map kann jedoch ausdrücklich undefined unter einem vorhandenen Schlüssel speichern. Ein get-Aufruf allein unterscheidet die Fälle deshalb nicht. Verwende has, wenn die Existenz unabhängig vom Wert relevant ist. Auch der Unterschied zwischen null und undefined sollte in einem API-Vertrag bewusst entschieden werden; beide können bei der Anzeige als fehlende Werte behandelt werden, sind aber nicht automatisch fachlich austauschbar.',
 'Bei Caches kann undefined beispielsweise bedeuten, dass ein Wert bewusst nicht geladen wurde, während das Nichtvorhandensein des Keys etwas anderes beschreibt. In vielen Fällen ist es verständlicher, ein eigenes Ergebnisobjekt mit einem status-Feld zu modellieren, statt mehrere versteckte Nullkonventionen zu kombinieren. Eine Map ist ein leistungsfähiger Index, kein vollständiger Ersatz für das Datenmodell oder die Prüfung externer Eingaben.',
 'const cache = new Map([["E1", undefined]]);\nconsole.log(cache.get("E1")); // undefined\nconsole.log(cache.has("E1")); // true\nconsole.log(cache.has("E2")); // false',
 'Die Explizitheit von has verhindert die Verwechslung zweier Zustände.'],
 ['dedupe','Deduplizierung braucht eine Konfliktentscheidung',
 'Wenn zwei Events dieselbe ID besitzen, muss die Fachlogik festlegen, welcher Eintrag bleibt. Eine Map kann den letzten Wert unter einem Schlüssel überschreiben. Für einen Import, bei dem das erste gültige Event gewinnen soll, musst du vor set ausdrücklich prüfen, ob der Schlüssel bereits vorhanden ist. Die Einfügereihenfolge einer Map zeigt keine automatische Sortierung nach Datum, selbst wenn sie beim Iterieren stabil ist. Für einen chronologischen Bericht solltest du die Werte gezielt sortieren.',
 'Auch bei der Wahl zwischen Set und Map sind einfache Fragen hilfreich. Möchtest du nur wissen, ob eine ID vorkommt, genügt ein Set<string>. Möchtest du zu einer ID die vollständigen Eventdaten erhalten, ist eine Map<string, Event> geeigneter. Beide Strukturen sind nur dann zuverlässig, wenn IDs vor der Aufnahme normalisiert und überprüft werden. Ein leerer String oder eine falsch typisierte ID wird nicht durch eine geschickte Collection automatisch fachlich korrekt.',
 'function uniqueById(events) {\n  const byId = new Map();\n  for (const event of events) {\n    if (typeof event?.id === "string" && event.id && !byId.has(event.id)) byId.set(event.id,event);\n  }\n  return [...byId.values()];\n}',
 'Die erste gültige ID gewinnt, während die Reihenfolge der erstmaligen Einträge erhalten bleibt. Der Titel müsste zusätzlich geprüft werden.']
 ],
 checks:[
 ['Warum entfernt new Set([{id:"E1"},{id:"E1"}]) keine fachlichen Duplikate?','Weil die Objektinstanzen unterschiedliche Referenzen besitzen.','Die Set-Gleichheit vergleicht nicht automatisch alle Datenfelder.'],
 ['Wie unterscheidet man Map.get(key) === undefined bei fehlendem Key und gespeichertem undefined?','Mit Map.has(key).','Die Existenz des Schlüssels ist eine eigene Information.'],
 ['Garantiert die Map-Iterationsreihenfolge eine chronologische Eventsortierung?','Nein.','Map bewahrt Einfügereihenfolge, keine aus den Werten abgeleitete fachliche Ordnung.']
 ],
 exercise:'Implementiere deduplicateEvents(events), das nach einer geprüften string-ID dedupliziert und das erste gültige Event jeder ID behält. Bewahre die ursprüngliche Reihenfolge, teste zwei gleichwertige, aber getrennte Objekte und einen Eintrag ohne ID. Begründe die Wahl zwischen Map und Set.',
 solution:'Iteriere über die Eingabe, prüfe Event-Objekt, ID und Titel. Nutze eine Map<string,Event>, teste !map.has(id) vor set und gib [...map.values()] zurück. Die Map kann Datensätze zu IDs speichern; wenn nur der Mitgliedschaftstest benötigt würde, wäre ein Set<string> ausreichend.'
},
{
 id:'js-error-boundaries',title:'JavaScript: Exceptions, Fehlerursachen und Abschlussregeln',
 source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
 objectives:['Gewöhnlich fehlende Werte von gescheiterten Operationen unterscheiden.','try/catch/finally und Error.cause korrekt einsetzen.','Asynchrone und synchrone Fehlerwege nicht vermischen.'],
 sections:[
 ['throw','Eine Exception ist ein Abbruch des normalen Pfads',
 'Mit throw kann JavaScript einen Fehler signalisieren. Es ist üblich, Error-Objekte oder spezialisierte Untertypen wie TypeError zu werfen, damit Stack und Zusatzinformationen erhalten bleiben. Eine Funktion, die einen ungültigen Eventtitel erhält, kann dadurch ihren Vertrag ausdrücklich ablehnen. Das ist etwas anderes als eine Suche, die gültig ausgeführt wurde, aber kein Event gefunden hat. Der zweite Fall kann als undefined, null oder Result-Objekt modelliert werden; eine Exception sollte nicht als einzige Sprache für jeden normalen Leerwert verwendet werden.',
 'Ein Fehler kann an mehreren Stellen entstehen: eine Datei kann fehlen, eine Antwort kann beschädigt sein oder eine Eingabe kann fachlich ungültig sein. Ein pauschales catch, das in allen Fällen eine leere Liste erzeugt, täuscht Erfolg vor und kann Datenverlust begünstigen. Besser ist, nur die Fehler zu behandeln, für die die jeweilige Schicht tatsächlich zuständig ist. Alle anderen dürfen mit zusätzlichem Kontext weitergereicht werden.',
 'function normalizeTitle(value) {\n  if (typeof value !== "string" || !value.trim()) {\n    throw new TypeError("Expected a nonblank title");\n  }\n  return value.trim();\n}',
 'Ungültige Eingaben führen zu einem klaren Fehlerpfad statt zu einem angeblich erfolgreichen leeren Ergebnis.'],
 ['catch','Fehlerursachen nicht durch neue Meldungen verlieren',
 'Wenn du einen niedrigeren Fehler in einen für die Anwendung verständlichen Domänenfehler übersetzen möchtest, sollte die ursprüngliche Ursache nach Möglichkeit erhalten bleiben. Der Error-Konstruktor unterstützt dafür die cause-Option. Ein Ladefehler kann so mit der Information versehen werden, welche Eventdatei verarbeitet werden sollte, während die eigentliche Ursache für die Diagnose verfügbar bleibt. In einem UI-Fehlerdialog solltest du nicht automatisch alle technischen Details oder vertraulichen Dateipfade ausgeben.',
 'Ein catch fängt auch geworfene Nicht-Error-Werte ab, denn JavaScript erzwingt nicht, dass throw nur Error-Objekte verwendet. Bei unbekannten Fehlerwerten musst du deshalb gegebenenfalls deren Form prüfen, bevor du message liest. Eine defensive Funktion kann error instanceof Error verwenden und andernfalls einen neutralen Text erzeugen. Erfinde keinen TypeError, wenn tatsächlich eine Dateiberechtigung versagt hat; die Fehlerklassifikation muss zu den Informationen passen.',
 'try {\n  await loadCatalog();\n} catch (error) {\n  throw new Error("Catalog load failed", {cause:error});\n}',
 'Der neue Fehler bewahrt die ursprüngliche Ursache über cause. Der Ausschnitt gehört in eine async-Funktion.'],
 ['finally','finally dient Abschlussarbeit, nicht zur Ergebnisüberschreibung',
 'Ein finally-Block wird bei normalen und fehlerhaften Ausführungspfaden nach try beziehungsweise catch ausgeführt. Das ist nützlich für Aufräumlogik wie das Freigeben einer Sperre oder das Rücksetzen eines Ladeindikators. Eine Rückgabe oder ein throw innerhalb von finally kann allerdings einen zuvor geplanten Rückgabewert beziehungsweise Fehler überdecken. Deshalb sollte finally im Normalfall nicht einen neuen, konkurrierenden Ergebnispfad erzwingen.',
 'Ein Ressourcenobjekt muss zudem selbst eine passende Schließoperation besitzen. finally macht aus einem beliebigen Wert keinen automatisch sicheren Datei-Handle. Im Browser und in Node.js unterscheiden sich die verfügbaren APIs. Beim Entwurf eines Ablaufs ist deshalb wichtig, wer die Ressource erworben hat und wer sie freigeben darf. Gute Fehlerbehandlung ist nicht nur Syntax, sondern ein Vertrag über den Zustand nach einem erfolgreichen oder fehlgeschlagenen Vorgang.',
 'let busy = true;\ntry {\n  await performImport();\n} finally {\n  busy = false;\n}',
 'Die Abschlussaktion setzt den Ladezustand zurück. Die Funktionen gehören in einen passenden asynchronen Kontext.'],
 ['promises','Asynchrone Ablehnungen sind eigene Fehlerwege',
 'Bei einem Promise können Fehler über .catch oder innerhalb von async-Funktionen am await-Punkt behandelt werden. Ein umgebendes synchrones try/catch fängt eine später eintreffende Promise-Ablehnung nicht automatisch auf, wenn die Promise nicht erwartet oder zurückgegeben wird. Deshalb ist das unbeabsichtigte Ignorieren einer Promise riskant. Wer in einem Button-Handler eine asynchrone Operation startet, muss ihre Fehlerbehandlung und die sichtbaren UI-Zustände bewusst planen.',
 'Auch fetch unterscheidet einen HTTP-Fehlerstatus vom Scheitern des Transportes. Eine Antwort mit 404 kann eine erfüllte Promise sein, deren response.ok false ist. Wenn danach noch JSON verarbeitet wird, können zusätzliche Parsing- und Validierungsfehler entstehen. Ein klarer Ablauf prüft die Schritte einzeln. Für Tests solltest du sowohl abgelehnte Promises als auch erfolgreiche HTTP-Übertragung mit ungültigem Inhalt simulieren.',
 'async function fetchTitle(url) {\n  const response = await fetch(url);\n  if (!response.ok) throw Error("HTTP " + response.status);\n  const value = await response.json();\n  return normalizeTitle(value.title);\n}',
 'Netzwerk, HTTP-Status, JSON-Parsing und fachliche Titelprüfung besitzen unterschiedliche Fehlerquellen.']
 ],
 checks:[
 ['Kann return in finally einen vorherigen throw unterdrücken?','Ja.','Die abrupte Kontrollflussänderung im finally kann den ursprünglichen Fehler überdecken.'],
 ['Ist jeder beliebige geworfene Wert garantiert ein Error-Objekt?','Nein.','JavaScript erlaubt throw auch für andere Werte; die Fehlerform sollte geprüft werden.'],
 ['Fängt ein synchrones try/catch automatisch eine später abgelehnte, nicht erwartete Promise?','Nein.','Asynchrone Fehler müssen über Promise.catch oder await gezielt behandelt werden.']
 ],
 exercise:'Baue eine Funktion importEvent(url), die per fetch lädt, HTTP-Fehler prüft, JSON-Felder validiert und Fehler mit Ursache weitergibt. Eine UI soll einen selbst ausgelösten Abbruch nicht als allgemeinen Fehler anzeigen. Skizziere Tests für 404, ungültiges JSON, fehlenden Titel und echten Netzwerkfehler.',
 solution:'Definiere eine async-Funktion mit await fetch, response.ok und einer Parserfunktion für die Datenform. Fange Fehler nur an der geeigneten Schicht und reiche bei Bedarf new Error("Import failed",{cause:error}) weiter. Ein AbortController kann Abbruch unterstützen, der über signal.aborted als eigener Zustand behandelt wird. Prüfe im Test die getrennten Fehlertypen, statt jeden Fall in ein leeres Ergebnis umzuwandeln.'
}
];
export const JAVASCRIPT_CORE_VOLUME:readonly AuthoredLesson[]=MANUSCRIPTS.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:33,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({
   id,title,paragraphs:[first,second],code,annotation
  })),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:'javascript',name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Ein sprachspezifisches Originalbeispiel aus dem Lehrtext. Die Ausführungsregeln und Grenzfälle sind in den vier Kapitelsektionen ausführlich behandelt.',
  differences:'JavaScript besitzt eigene Objekt-, Iterations- und asynchrone Laufzeitregeln. Ähnliche Konstruktionen in Python, TypeScript und Java dürfen nicht ohne Prüfung gleichgesetzt werden.',
  equivalence:'related',docs:item.source
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
