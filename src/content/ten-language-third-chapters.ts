import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';
type Language='python'|'javascript'|'typescript'|'java'|'csharp'|'cpp'|'php'|'go'|'rust'|'kotlin';
type Section=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type Question=readonly [question:string,answer:string,reason:string];
type Manuscript={language:Language;id:string;title:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Question[];exercise:string;solution:string;docs:string};
const manuscripts:readonly Manuscript[]=[
{language:'python',id:'py-context-managers',title:'Python: Exceptions, with und verlässliche Ressourcenverwaltung',
 objectives:['Fehlerschutz und Ressourcenlebensdauer als getrennte Verträge erklären.','with und das Context-Manager-Protokoll verstehen.','Exception-Verkettung und gezielte Behandlung korrekt anwenden.'],
 docs:'https://docs.python.org/3/reference/compound_stmts.html#the-with-statement',
 sections:[
 ['exceptions','Eine Exception beendet den normalen Ergebnisweg',
 'Eine Funktion, die einen ungültigen Titel erhält, kann ValueError auslösen. Das unterscheidet sich von einer erfolgreichen Suche ohne Treffer, die beispielsweise None zurückgeben könnte. Ein try-Block beschreibt die Operation, deren Fehler behandelt werden sollen, und except sollte nur die erwarteten Ausnahmen auffangen. Wer ein nacktes except verwendet und anschließend eine leere Liste zurückgibt, kann einen Programmierfehler oder einen kaputten Dateizugriff als scheinbar erfolgreichen Vorgang tarnen.',
 'Trenne die fachliche Vorbedingung vom technischen Betriebsfehler. Ein ungültiger Titel, eine nicht vorhandene optionale Datei und ein Lesefehler wegen fehlender Berechtigung können unterschiedliche Reaktionen erfordern. Eine Ausnahme sollte erst dort in eine Benutzeranzeige übersetzt werden, wo ausreichend Kontext vorhanden ist. In einer niedrigeren Schicht lässt sich ein Fehler mit raise weitergeben; ein neuer fachlich sinnvoller Fehler kann seine Ursache über raise ... from ... erhalten.',
 'def require_title(value: str) -> str:\n    title = value.strip()\n    if not title:\n        raise ValueError("title is empty")\n    return title',
 'Der Vertrag unterscheidet einen normalen String-Rückgabewert von einem ungültigen Eingabewert.'],
 ['with','Ressourcen brauchen einen eindeutigen Besitzer',
 'Ein geöffnetes Dateiobjekt hält eine Ressource, die nach der Benutzung geschlossen werden muss. Die with-Anweisung organisiert dazu den Eintritt und Austritt eines Context Managers. Wenn der Block normal endet oder eine Exception auslöst, wird dessen Austrittsmethode aufgerufen. Dadurch entfällt die Notwendigkeit, an jedem return-Pfad eine eigene Schließanweisung zu duplizieren. Bei Dateien ist with open(...) daher häufig die erste Wahl.',
 'Ein Context Manager besteht konzeptionell aus __enter__ und __exit__. Die Austrittsmethode kann unter bestimmten Bedingungen eine Exception unterdrücken, wenn sie einen truthy Wert zurückliefert. Das sollte eine bewusste Designentscheidung sein: Ein Datenfehler darf nicht versehentlich verschwinden, weil eine Hilfsklasse pauschal alle Ausnahmen ignoriert. Das Ressourcenprotokoll beschreibt Lebensdauer und Aufräumen, nicht die fachliche Gültigkeit der verarbeiteten Daten.',
 'from pathlib import Path\n\ndef load_title(path: Path) -> str:\n    with path.open(encoding="utf-8") as handle:\n        return handle.readline().strip()',
 'Der File-Handle wird beim Verlassen des with-Blocks geschlossen, auch beim frühen return.'],
 ['contextlib','Ein eigener Context Manager hält komplexen Code klein',
 'Mit contextlib.contextmanager kann eine Generatorfunktion einen Context Manager bereitstellen. Der Code vor yield entspricht der Vorbereitung, der um yield herum liegende try/finally-Block sichert die Abschlussarbeit. Diese Form eignet sich, wenn eine Operation temporär Einstellungen umschaltet, eine Transaktion verwaltet oder eine Ressource aus einer Hilfsbibliothek übernimmt. Sie ist aber kein Grund, jede einfache Funktion in einen eigenen Manager zu verwandeln.',
 'Besonders bei Transaktionen muss klar sein, ob ein erfolgreicher Block ein Commit auslöst und ein fehlerhafter Block zurückgerollt wird. Ein bloßes finally für Schließen erzeugt noch keine Datenbanktransaktion. Achte deshalb auf die dokumentierten Regeln des konkreten Ressourcenobjekts. Tests sollten die Abschlussarbeit sowohl beim regulären Ende als auch bei einer absichtlich ausgelösten Exception nachweisen.',
 'from contextlib import contextmanager\n\n@contextmanager\ndef temporarily_enabled(settings):\n    previous = settings.enabled\n    settings.enabled = True\n    try:\n        yield\n    finally:\n        settings.enabled = previous',
 'Der frühere Zustand wird unabhängig vom Ausgang des Blocks wiederhergestellt.'],
 ['boundaries','Fehlertexte und Exception-Ursachen sichtbar halten',
 'Wenn eine niedrigere Bibliothek eine OSError wirft, kann eine Domänenschicht mit raise CatalogError(...) from exc einen verständlicheren Fehler erzeugen, ohne die ursprüngliche Ursache zu verlieren. Dieses Prinzip ist nützlich, weil der Aufrufer den fachlichen Kontext benötigt und die Diagnose trotzdem nachverfolgen können muss. Aber nicht jede Exception braucht eine neue Hülle; zu viele bedeutungslose Ebenen machen die Ursache wieder schwer lesbar.',
 'Verlasse dich beim Testen nicht nur darauf, dass irgendeine Exception entstanden ist. Prüfe den erwarteten Typ, den Zustand einer Ressource nach dem Fehler und die Wirkung auf Fachobjekte. Ein fehlgeschlagenes Speichern darf nicht als erfolgreich markiert werden, und eine zeitweise aktivierte Konfiguration muss zurückgesetzt sein. Die Kombination aus gezielten Exceptions, sichtbaren Verträgen und with lässt solche Zusicherungen gut überprüfbar werden.',
 'class CatalogError(Exception):\n    pass\n\ndef read_catalog(path):\n    try:\n        return load_title(path)\n    except OSError as exc:\n        raise CatalogError(f"reading {path} failed") from exc',
 'Der neue Fehler nennt den Fachkontext; __cause__ erhält die zugrunde liegende OSError.']
 ],
 checks:[
 ['Schließt with eine Datei auch bei einer Exception?','Ja, sofern der Dateikontext erfolgreich betreten wurde.','Der Context Manager führt beim Austritt seine Abschlusslogik aus.'],
 ['Ist except: pass für alle Fehler eine gute allgemeine Strategie?','Nein.','Sie kann tatsächliche Betriebs- und Programmierfehler unsichtbar machen.'],
 ['Wozu dient raise DomainError(...) from exc?','Es verbindet den neuen Fehler mit seiner Ursache.','Die Diagnose bleibt nachvollziehbar, obwohl der Aufrufer einen fachlichen Fehlervertrag erhält.']
 ],
 exercise:'Baue einen Context Manager, der ein Objekt für die Dauer eines with-Blocks in den Modus enabled=True versetzt und den ursprünglichen Zustand anschließend wiederherstellt. Teste das normale Ende und eine im Block ausgelöste ValueError.',
 solution:'Nutze contextlib.contextmanager, speichere den früheren Wert vor der Änderung, setze enabled=True und gib bei yield die Kontrolle ab. In finally stelle den alten Wert wieder her. Ein Test prüft nach normalem Ende sowie nach einem gezielt abgefangenen ValueError denselben Ursprungszustand.'
},
{language:'javascript',id:'js-modules-closures',title:'JavaScript: Module, Closures und kontrollierter Zustand',
 objectives:['Lexikalischen Gültigkeitsbereich und Closure-Zustand unterscheiden.','ES-Module mit statischen Imports und Exporten nachvollziehen.','Geteilten Zustand ohne unbeabsichtigte globale Mutationen modellieren.'],
 docs:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures',
 sections:[
 ['scope','Eine Funktion erinnert sich an ihren lexikalischen Bereich',
 'Ein Closure besteht aus einer Funktion und den Bindungen ihres umschließenden lexikalischen Gültigkeitsbereichs, auf die sie zugreifen kann. Eine Counter-Factory kann deshalb eine lokale Variable bei wiederholten Aufrufen erhöhen, obwohl die äußere Factory längst zurückgekehrt ist. Das ist kein Kopieren eines alten Zahlenwerts bei jedem Funktionsaufruf; die innere Funktion besitzt Zugriff auf die relevante Bindung. Dadurch lässt sich kleiner privater Zustand ohne globale Variablen ausdrücken.',
 'Closures existieren auch dann, wenn du nicht ausdrücklich den Begriff benutzt. Event-Handler, Callback-Funktionen und Promise-Fortsetzungen können ihre Umgebung erfassen. Bei langlebigen Handlern ist wichtig, welche Referenzen dadurch erreichbar bleiben. Ein Closure, das einen großen Baum von Objekten festhält, kann dessen Freigabe verhindern, solange der Handler selbst noch erreichbar ist. Gute Lebenszyklusregeln ergänzen deshalb die reine Sprachsyntax.',
 'function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = createCounter();\nconsole.log(next(), next()); // 1 2',
 'Die zurückgegebene Funktion verändert dieselbe Bindung über mehrere Aufrufe.'],
 ['loops','Schleifen-Bindungen beeinflussen die erfassten Werte',
 'Bei einer Schleife mit let erhält jeder Durchlauf für die Schleifenvariable eine eigene lexikalische Bindung. Das ist für asynchron aufgerufene Callbacks wichtig: Ein späterer Handler kann so den beabsichtigten Wert seiner Iteration sehen. Eine alte var-Schleife benutzt dagegen eine andere Scope-Semantik; mehrere Closures können auf dieselbe Bindung zeigen, deren Wert nach dem Schleifenende bereits weitergelaufen ist. Der Unterschied ist keine Eigenschaft von setTimeout, sondern der Namensbindung.',
 'Schreibe für neue Programme möglichst let oder const passend zur beabsichtigten Neuzuweisung und vermeide var in moderner Modul- und Anwendungspraxis. Trotzdem solltest du den historischen Unterschied verstehen, wenn du fremden Code analysierst. Besonders in Eventhandlern kann ein versehentlich erfasster, veränderbarer Zustand unerwartete Ergebnisse liefern. Die richtige Lösung ist häufig eine bewusst lokal gebundene Variable pro Operation.',
 'const callbacks = [];\nfor (let index = 0; index < 3; index++) {\n  callbacks.push(() => index);\n}\nconsole.log(callbacks.map(callback => callback())); // [0,1,2]',
 'Mit let erhält jeder Durchlauf die passende Bindung.'],
 ['modules','ES-Module setzen explizite Grenzen',
 'Ein ES-Modul kann Werte über export bereitstellen und andere Module über import nutzen. Dadurch lassen sich Zuständigkeiten sichtbarer trennen als mit einem ungeordneten globalen Namensraum. Importierte Bindungen sind Live-Bindings: Wenn das exportierende Modul einen gebundenen Wert verändert, kann ein Import später dessen aktuellen Wert sehen. Das bedeutet nicht, dass der Importeur die Bindung selbst frei neu zuweisen darf. Export und Import definieren eine Sicht auf einen Modulvertrag.',
 'Module werden in der Regel einmal pro Modulinstanz ausgewertet und können dadurch eigenen Zustand behalten. Das ist für ein Konfigurationsmodul mit veränderbaren Daten relevant: Alle Importe können die Auswirkungen einer Änderung sehen. Baue deshalb APIs mit klaren Funktionen statt wahllos eine veränderliche Collection zu exportieren. Wer einen neuen Prozess oder Test lädt, sollte wissen, ob Zustand pro Modulinstanz, pro Factory oder pro Request gehalten wird.',
 '// counter.js\nlet count = 0;\nexport const next = () => ++count;\n// app.js\nimport { next } from "./counter.js";\nconsole.log(next());',
 'Die exportierte Funktion kontrolliert die Änderung des privaten Modulszustands.'],
 ['design','Stabilität entsteht durch Verantwortung, nicht Syntaxkürze',
 'Eine einzelne Modulvariable ist bequem, kann aber bei mehreren Benutzern oder Tests denselben Zustand teilen, obwohl jede Anfrage unabhängig sein sollte. Eine Factory, die ein eigenes Closure pro Anwendungsinstanz erzeugt, ist dann oft die bessere Wahl. Umgekehrt ist ein wirklich globales, unveränderliches Konfigurationsobjekt nicht automatisch problematisch. Entscheidend ist, ob der Besitz und die Lebensdauer zu der fachlichen Aufgabe passen.',
 'Achte bei React und anderen UI-Frameworks darauf, dass ein Closure einen Wert aus einem bestimmten Renderzeitpunkt erfassen kann. Ein später aufgerufener Callback kann deshalb einen alten Wert sehen, wenn er nicht passend aktualisiert wird. Diese Situation darf nicht mit einem Fehler der Modulmechanik verwechselt werden. Tests für unabhängige Instanzen, wiederholte Aufrufe und bewusst veränderten Zustand helfen, die gewünschte Semantik überprüfbar zu halten.',
 'function createCatalog() {\n  const items = [];\n  return {\n    add: item => { items.push(item); },\n    list: () => [...items]\n  };\n}',
 'Die Factory kapselt den privaten Zustand; list liefert eine neue äußere Liste statt das Original.']
 ],
 checks:[
 ['Was speichert ein Closure konzeptionell?','Zugriff auf die benötigten lexikalischen Bindungen.','Die Funktion kann diese Bindungen auch nach Rückkehr der äußeren Factory nutzen.'],
 ['Sind ES-Imports frei neu zuweisbare Variablen im importierenden Modul?','Nein.','Es handelt sich um importierte Live-Bindings mit eingeschränkter Neuzuweisung durch den Importeur.'],
 ['Warum können zwei Instanzen derselben Factory unabhängigen Zustand besitzen?','Jeder Factory-Aufruf erzeugt seine eigenen lokalen Bindungen.','Die zurückgegebenen Closures erfassen jeweils die Bindungen ihres Aufrufs.']
 ],
 exercise:'Schreibe createEventCatalog(), das add(title) und list() zurückgibt. Erzeuge zwei Instanzen und beweise, dass ihre Listen unabhängig sind. Sorge dafür, dass list() keine direkte mutierbare Referenz auf den internen Arrayzustand herausgibt.',
 solution:'Verwende const items = [] innerhalb der Factory. add prüft den Titel und ruft items.push auf. list gibt [...items] oder items.slice() zurück. Teste beide Factory-Instanzen und versuche, die Rückgabeliste zu verändern; die interne Collection darf davon nicht betroffen sein.'
},
{language:'typescript',id:'ts-generics-advanced',title:'TypeScript: Generic Constraints, keyof und indizierte Zugriffe',
 objectives:['Ein generisches Typverhältnis von einer beliebigen Assertion unterscheiden.','keyof und T[K] für sichere Eigenschaftszugriffe einsetzen.','Constraints und Laufzeitvalidierung an Systemgrenzen trennen.'],
 docs:'https://www.typescriptlang.org/docs/handbook/2/generics.html',
 sections:[
 ['relationships','Ein Typparameter beschreibt eine Beziehung',
 'Bei einer Funktion identity<T>(value: T): T ist die Eingabe mit dem Ergebnis verknüpft. Der Compiler kann aus dem Aufruf den konkreten Typ ableiten und ihn im Rückgabewert erhalten. Das ist stärker als eine Funktion, die any annimmt und any zurückgibt. Ein Generics-Einsatz ist nur dann sinnvoll, wenn die beteiligten Typen tatsächlich in Beziehung stehen. Wer einen Typparameter deklariert, ihn aber in keiner relevanten Position verwendet, erzeugt meist unnötige Komplexität.',
 'TypeScript ist strukturell typisiert. Ein Constraint wie T extends { id: string } verlangt deshalb keine Vererbung von einer bestimmten Klasse, sondern eine passende Form. Die Funktion darf auf id zugreifen und gibt trotzdem den konkreten Eingabetyp T zurück. Diesen Unterschied solltest du an eigenen Datenmodellen üben: Ein Event mit zusätzlichen Feldern soll diese Felder nicht verlieren, nur weil eine Hilfsmethode seine ID prüft.',
 'function withId<T extends { id: string }>(value: T): T {\n  if (!value.id) throw Error("missing ID");\n  return value;\n}\nconst event = withId({ id: "E1", title: "Workshop" });',
 'Das Ergebnis behält auch die title-Eigenschaft, weil der konkrete Typ T erhalten bleibt.'],
 ['keyof','Schlüssel sind selbst ein Typvertrag',
 'Der Operator keyof bildet aus einem Objekttyp seine möglichen Eigenschaftsnamen. Für ein Event mit id und title entsteht eine Auswahl passender Schlüssel. Mit einem zweiten Typparameter K extends keyof T kann eine Funktion sicherstellen, dass nur gültige Schlüssel akzeptiert werden. Der Rückgabetyp T[K] beschreibt dann den Werttyp genau der ausgewählten Eigenschaft. So bleibt die Information erhalten, dass event.id ein String und event.capacity eine Zahl sein könnte.',
 'Ein allgemeines getProperty(object, key) ist besonders hilfreich für Tabellen, Formularsysteme und interne Hilfsfunktionen. Verwechsele das nicht mit beliebigen JSON-Eingaben. Der Compiler akzeptiert einen korrekt typisierten eigenen Wert, aber ein extern importiertes Objekt kann zur Laufzeit falsche oder fehlende Felder besitzen. keyof validiert also keine tatsächlich eingetroffenen Bytes. Es sorgt dafür, dass typisierte Aufrufer innerhalb des Quellcodes passende Schlüssel verwenden.',
 'function getProperty<T, K extends keyof T>(value: T, key: K): T[K] {\n  return value[key];\n}\nconst event = { id: "E1", capacity: 50 };\nconst seats = getProperty(event, "capacity");',
 'Der Rückgabewert seats besitzt den aus der Eigenschaft abgeleiteten Typ number.'],
 ['constraints','Constraints schaffen nutzbare Garantien',
 'Ohne Constraint darfst du auf einer generischen Variablen nicht einfach .length aufrufen, weil nicht jeder mögliche Typ diese Eigenschaft besitzt. Mit T extends { length: number } kann die Funktion die Länge sicher lesen. Die Einschränkung definiert dabei nur die statisch notwendige Struktur. Ein String, ein Array oder ein eigenes Objekt mit length können dieselbe Funktion nutzen, solange ihre Typen den Constraint erfüllen.',
 'Zu starke Constraints vermindern dagegen Wiederverwendbarkeit. Eine Funktion, die nur einen Namen lesen muss, sollte nicht zwingend ein komplettes Event mit zwölf Eigenschaften verlangen. Orientiere die geforderte Struktur an den Operationen innerhalb der Funktion. Dadurch entsteht ein klarer API-Vertrag, der später leichter getestet und verändert werden kann. Generics sind nicht der Preis für Professionalität, sondern ein Mittel, reale Typbeziehungen präzise auszudrücken.',
 'function sizeOf<T extends { length: number }>(value: T): number {\n  return value.length;\n}\nconsole.log(sizeOf("Ada"));\nconsole.log(sizeOf([1,2,3]));',
 'Die Funktion fordert nur die eine Eigenschaft, die sie tatsächlich benutzt.'],
 ['runtime','Typen verschwinden vor der Laufzeit',
 'TypeScript-Typparameter, keyof und Conditional Types verändern zur Laufzeit nicht automatisch die Struktur eines Objekts. Wer ein Ergebnis von fetch oder ipcRenderer.invoke erhält, muss unbekannte Daten weiterhin an einer vertrauenswürdigen Grenze prüfen. Eine Signatur Promise<Event[]> kann den Compiler informieren, beweist aber nicht, dass ein Server tatsächlich ein Event-Array gesendet hat. Das ist besonders wichtig in Electron, wo Hauptprozess und Renderer verschiedene Vertrauensbereiche besitzen können.',
 'Es lohnt sich, Generics mit expliziten Parserfunktionen zu kombinieren: Der Parser liefert aus unknown entweder ein geprüftes T oder einen Fehler, die nachfolgenden Funktionen können daraufhin präzise T-Beziehungen nutzen. Eine Typassertion as T ohne Prüfung beseitigt den Fehler nicht. Das eigentliche Qualitätsmerkmal ist, dass dein Programm unterscheiden kann, was der Compiler über den Quellcode weiß und was der konkrete Laufzeitwert beweist.',
 'function parseString(value: unknown): string {\n  if (typeof value !== "string") throw Error("not a string");\n  return value;\n}\nconst title = parseString(JSON.parse("\"Ada\""));',
 'Der Parser prüft einen konkreten Laufzeitwert, bevor typisierte interne Verarbeitung beginnt.']
 ],
 checks:[
 ['Weshalb ist getProperty<T, K extends keyof T> sicherer als ein beliebiger String-Key?','Der Schlüssel muss zum Objekttyp passen.','T[K] bewahrt außerdem den konkreten Typ des ausgewählten Werts.'],
 ['Warum reicht ein Constraint mit length, wenn nur .length gelesen wird?','Weil der Constraint genau die tatsächlich benötigte Struktur verlangt.','Unnötige Felder würden die Funktion ohne fachlichen Grund einschränken.'],
 ['Validiert ein Generic automatisch die Antwort aus einer JSON-Datei?','Nein.','Die Typinformation existiert nicht als allgemeine Laufzeitprüfung der fremden Daten.']
 ],
 exercise:'Schreibe eine Funktion select<T,K extends keyof T>(source:T,key:K):T[K] und teste sie mit Event{id:string;capacity:number}. Erkläre, weshalb select(event,"capacity") number liefert und select(event,"wrong") nicht kompiliert. Ergänze getrennt einen Parser für unbekannte externe Eventdaten.',
 solution:'Implementiere return source[key]. Die Beziehung K extends keyof T stellt sicher, dass nur vorhandene Schlüssel in typisiertem Quellcode zugelassen sind; T[K] ist der Eigenschaftstyp. Für externe JSON-Eingaben prüfe id und capacity einzeln, bevor du ein Event-Objekt konstruierst.'
},
{language:'java',id:'java-class-design',title:'Java: Klassen, Konstruktoren und fachliche Invarianten',
 objectives:['Klassen als Modelle mit Zustand und Verhalten erklären.','Konstruktoren für einen gültigen Anfangszustand einsetzen.','Kapselung und unveränderliche Rückgaben praktisch gestalten.'],
 docs:'https://dev.java/learn/classes-objects/',
 sections:[
 ['class','Eine Klasse bündelt zusammengehörige Verantwortung',
 'Eine Java-Klasse kann private Felder, Konstruktoren und Methoden besitzen. Ein EventCatalog ist deshalb mehr als eine frei herumliegende Liste: Er kann festlegen, welche Einträge aufgenommen werden dürfen und welche Suche eine fachlich sinnvolle Antwort liefert. Das Objektmodell hilft, Daten und Regeln an einer Stelle zu halten. Wer lediglich für jede Tabelle einen Getter und Setter erzeugt, ohne Invarianten zu schützen, verschenkt diesen Vorteil.',
 'Ein sinnvolles Modell beginnt mit Fachfragen: Was ist ein gültiges Event? Darf ein Titel leer sein? Sind doppelte Veranstaltungs-IDs erlaubt? Wie wird eine Reservierung gezählt? Solche Regeln gehören nicht zufällig nur in eine UI-Komponente, denn die gleiche Domäne kann später auch über eine REST-API oder durch einen Import verwendet werden. Eine Klasse mit klaren Methoden erlaubt unterschiedliche Aufrufer, ohne die Regeln mehrfach nachbauen zu müssen.',
 'final class Event {\n    private final String title;\n    Event(String title) { this.title = Objects.requireNonNull(title); }\n    String title() { return title; }\n}',
 'Die Nullregel wird im Konstruktor erzwungen. Für einen vollständigen Ausschnitt wird java.util.Objects importiert.'],
 ['constructor','Ein Konstruktor ist eine verlässliche Initialisierungsgrenze',
 'Der Konstruktor sollte einen Zustand erzeugen, mit dem sämtliche öffentlichen Methoden sinnvoll umgehen können. Für eine Eventkapazität kann das heißen, dass der Wert nicht negativ sein darf und eine Reservierungszahl anfänglich null ist. Sobald ein Objekt konstruiert wurde, sollten die zentralen Invarianten gelten. Das vermeidet Objektzustände, bei denen Aufrufer erst mehrere Setter in der richtigen Reihenfolge aufrufen müssen, bevor das Objekt überhaupt benutzbar ist.',
 'Nicht jede Validierung muss aufwendig sein. Objects.requireNonNull verhindert null, aber keinen leeren String. Ein Titel mit nur Leerzeichen muss mit trim beziehungsweise isBlank entsprechend der Fachregel behandelt werden. Lege ausdrücklich fest, ob du Originalschreibweise bewahrst oder normalisierst. Ein Konstruktor, der Daten ohne Erklärung verändert, kann später ebenso überraschend sein wie einer, der ungültige Daten akzeptiert.',
 'final class Capacity {\n    private final int seats;\n    Capacity(int seats) {\n        if (seats < 0) throw new IllegalArgumentException("negative seats");\n        this.seats = seats;\n    }\n    int value() { return seats; }\n}',
 'Jede erfolgreich erzeugte Capacity-Instanz erfüllt die vereinbarte Nichtnegativitätsregel.'],
 ['encapsulation','Private Felder allein schaffen noch keine echte Kapselung',
 'Wenn eine Klasse eine veränderbare ArrayList intern speichert, aber ihre Referenz als getter zurückgibt, können fremde Aufrufer die Liste ohne die vorgesehenen Methoden ändern. Das unterläuft fachliche Prüfungen. Eine Rückgabe über List.copyOf kann eine unveränderliche Momentaufnahme liefern, sofern die enthaltenen Elemente nicht null sind. Auch bei übergebenen Collections lohnt sich eine defensive Kopie, wenn sich spätere Änderungen des Aufrufers nicht unbemerkt auf die Klasse auswirken sollen.',
 'Eine unveränderliche List-Hülle macht allerdings die enthaltenen Objekte nicht automatisch tief unveränderlich. Das ist entscheidend, wenn der Katalog veränderbare Eventobjekte enthält. Kapselung verlangt deshalb ein Konzept für die Mutabilität der Elemente. Wo möglich, sind Records oder unveränderliche Value Objects eine gute Grundlage. Bei bewusst veränderbaren Domänenobjekten muss das Änderungsrecht ausdrücklich benannt sein.',
 'final class Catalog {\n    private final List<String> names = new ArrayList<>();\n    void add(String name) { names.add(Objects.requireNonNull(name)); }\n    List<String> names() { return List.copyOf(names); }\n}',
 'Externe Aufrufer erhalten keine veränderbare Referenz auf die interne Liste. Imports für List, ArrayList und Objects sind erforderlich.'],
 ['design','Methoden sollen fachliche Ereignisse ausdrücken',
 'Ein EventCatalog mit setCapacity(int) und setBooked(int) kann ungültige Zwischenzustände zulassen, wenn die Felder unabhängig geändert werden. Eine Methode reserve(int) kann dagegen in einem Schritt prüfen, ob die zusätzliche Reservierung möglich ist. Solche Methoden zeigen die Fachabsicht und schützen den Objektzustand. Es ist oft leichter, reserve und cancel zu testen als ein beliebiges Netz aus Settern und abhängigen Nebenwirkungen.',
 'Wähle Objektgrenzen nach Verantwortung, nicht nach einer generellen Klassenanzahl. Ein sehr großes Serviceobjekt mit Dateizugriff, HTTP-Logik, Datumsberechnung und UI-Rendering ist schwer zu prüfen. Eine reine Kapazitätsregel kann ohne Netzwerk getestet werden, wenn sie unabhängig modelliert ist. Beginne mit kleinen, korrekten Invarianten und erweitere das Modell, sobald die Fachanforderungen konkret sind.',
 'boolean canReserve(int seats, int booked, int requested) {\n    return requested > 0 && booked >= 0 && seats >= 0\n        && booked <= seats && requested <= seats - booked;\n}',
 'Die Subtraktion wird erst nach Prüfung der gültigen Grenzen ausgeführt und vermeidet Überlauf durch Addition.']
 ],
 checks:[
 ['Warum genügt ein privates Feld List<Event> nicht, wenn der Getter die originale ArrayList zurückgibt?','Aufrufer könnten den internen Zustand direkt verändern.','Die Validierungsregeln der Klasse wären damit umgehbar.'],
 ['Was ist die zentrale Aufgabe des Konstruktors?','Einen gültigen Anfangszustand herstellen.','Objektinvarianten sollten nach erfolgreicher Konstruktion gelten.'],
 ['Ist List.copyOf automatisch eine tiefe Kopie aller enthaltenen Elemente?','Nein.','Die Collection wird unveränderlich abgebildet, die Elemente können weiterhin eigene Mutabilität besitzen.']
 ],
 exercise:'Implementiere EventCatalog mit einer internen List<String>, addTitle(String) und titles(). Leere und null-Titel müssen abgelehnt werden; titles() liefert eine unveränderliche Momentaufnahme. Schreibe Tests, dass externe Aufrufer die interne Liste nicht verändern können.',
 solution:'Speichere eine private ArrayList<String>. Prüfe mit Objects.requireNonNull und String.isBlank; füge nur gültige Werte hinzu. Gib List.copyOf(names) zurück. Teste Null/Blank und dass eine Mutation der Rückgabe UnsupportedOperationException auslöst, während ein späteres add die alte Momentaufnahme unverändert lässt.'
},
{language:'csharp',id:'cs-tasks-async',title:'C#: Task, async/await und kooperative Abbruchregeln',
 objectives:['Task-Rückgaben und async-Fortsetzungen korrekt interpretieren.','CancellationToken an asynchrone Arbeit weiterreichen.','HTTP-, Abbruch- und Inhaltsfehler getrennt modellieren.'],
 docs:'https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/',
 sections:[
 ['tasks','Task bedeutet zukünftiges Ergebnis, nicht zwingend neuer Thread',
 'Eine asynchrone Methode gibt häufig Task oder Task<T> zurück. Das beschreibt einen Vorgang, dessen Ergebnis erst später verfügbar sein kann. Das Schlüsselwort await wartet asynchron auf die Fortsetzung, anstatt zwingend den aufrufenden Thread synchron zu blockieren. Diese Fähigkeit hilft bei Netzwerk- und Dateizugriffen. Sie bedeutet nicht, dass jeder Task auf einem eigens gestarteten Thread arbeitet; die konkrete Ausführung hängt von der Operation ab.',
 'Ein CPU-intensiver Algorithmus wird nicht automatisch asynchron, nur weil er in eine async-Methode verschoben wird. Auch eine Methode ohne echte Await-Operation kann synchron laufen. Für UI-Anwendungen ist daher die Unterscheidung zwischen I/O-Warten, Parallelität und CPU-Auslastung wichtig. Gute Methodennamen mit Async und passende Task-Rückgabetypen erleichtern die Benutzung, ersetzen aber keine bewusst geplante Lebensdauer des Auftrags.',
 'static async Task<string> LoadAsync(HttpClient client, string uri) {\n    return await client.GetStringAsync(uri);\n}',
 'Der HTTP-Vorgang ist asynchron; die Methode liefert dem Aufrufer einen Task<string>.'],
 ['errors','Exceptions erscheinen an der Await-Grenze',
 'Eine Task-Operation kann fehlschlagen. Beim await wird die entsprechende Exception in der aufrufenden async-Methode behandelt, sofern dort ein passender try/catch steht. Ein Task sollte deshalb nicht aus Versehen gestartet und ignoriert werden. Besonders bei einer UI-Aktion kann ein vergessenes Ergebnis dazu führen, dass weder ein Ladezustand noch eine verständliche Fehlermeldung erscheint. Eine bewusst nicht erwartete Operation braucht eine eigene Fehlerstrategie.',
 'Bei einer HTTP-Anfrage können Netzfehler, unerwartete Statuscodes und ungültige JSON-Inhalte verschiedene Ursachen haben. Ein erfolgreicher HTTP-Status beweist nicht, dass die Nutzdaten korrekt modelliert sind. Die passende Schicht sollte die HTTP-Antwort prüfen, deserialisierte Daten validieren und Fehler in einen nachvollziehbaren Fachzustand übersetzen. Ein allgemeines catch, das immer eine leere Liste liefert, verschleiert tatsächliche Probleme.',
 'try {\n    string text = await client.GetStringAsync(uri);\n    Console.WriteLine(text);\n} catch (HttpRequestException ex) {\n    Console.Error.WriteLine(ex.Message);\n}',
 'Das Beispiel fängt einen Transport-/HTTP-Requestfehler ab. Andere Fehlerarten brauchen gegebenenfalls eigene Behandlung.'],
 ['cancellation','CancellationToken verbindet Lebensdauer und Aufrufkette',
 'Eine neue Suche kann eine alte Anfrage ersetzen. CancellationToken erlaubt es dem Aufrufer, das Ende der alten Arbeit zu signalisieren. Unterstützende APIs wie viele HttpClient-Methoden akzeptieren einen Token. Die Operation muss ihn jedoch berücksichtigen; ein Token stoppt keine beliebige Berechnung automatisch. Für mehrere zusammenhängende Operationen sollte der Token durch die gesamte Aufrufkette weitergereicht werden, damit Unteraufgaben denselben Lebensdauervertrag teilen.',
 'Eine erwartete OperationCanceledException ist nicht zwangsläufig ein Fehler, den der Nutzer als rote Warnung sehen möchte. Unterscheide selbst ausgelösten Abbruch von tatsächlichen Betriebsproblemen. Selbst bei Cancellation kann eine alte Antwort bereits fertig geworden sein. Deshalb sollte eine UI zusätzlich prüfen, ob das Ergebnis noch zur aktuellen Suchgeneration gehört, bevor es den sichtbaren Zustand aktualisiert.',
 'using var cts = new CancellationTokenSource();\nTask<string> loading = client.GetStringAsync(uri, cts.Token);\n// Bei Verlassen der Ansicht: cts.Cancel();\nstring result = await loading;',
 'Der Token gehört zum Auftrag. Bei Cancel kann der Await-Pfad eine Cancellation-Exception beobachten.'],
 ['concurrency','Task.WhenAll ist ein Vertrag für gemeinsam gestartete Arbeit',
 'Wenn zwei unabhängige Anfragen parallel sinnvoll sind, kannst du sie vor dem gemeinsamen await starten und über Task.WhenAll koordinieren. Das bedeutet nicht, dass die Aufrufe ihre Fehler automatisch gemeinsam reparieren. Wenn eine Aufgabe fehlschlägt, muss der Gesamtvertrag klären, ob ein Teilresultat noch verwendbar ist. Auch die Reihenfolge der Ergebnisanzeige sollte unabhängig vom zufälligen Antwortzeitpunkt festgelegt werden, falls die Fachlogik eine stabile Ordnung verlangt.',
 'Vermeide blockierendes .Result oder .Wait() in Kontexten, in denen asynchrone Fortsetzungen und Threadbindung relevant sind. Solche Zugriffe können Deadlocks oder zumindest unnötige Threadblockierung verursachen. Der bevorzugte Weg ist normalerweise async bis zur passenden äußeren Grenze. Tests sollten erfolgreiches Laden, Abbruch, HTTP-Fehler und zwei überholende Anfragen mit kontrollierten Antworten abdecken.',
 'Task<string> first = client.GetStringAsync(firstUri);\nTask<string> second = client.GetStringAsync(secondUri);\nstring[] values = await Task.WhenAll(first, second);',
 'Beide Aufrufe werden vor dem gemeinsamen Await gestartet. Ihre Fehler bleiben Teil des Ergebnisses der Gesamtoperation.']
 ],
 checks:[
 ['Startet jede Task-Operation automatisch einen eigenen Thread?','Nein.','Task beschreibt einen asynchronen Vorgang, nicht zwingend dessen Threadmodell.'],
 ['Beendet CancellationToken beliebige synchrone Arbeit ohne Prüfung?','Nein.','Die beteiligten APIs oder Algorithmen müssen Abbruch unterstützen beziehungsweise prüfen.'],
 ['Warum ist .Result bei asynchroner UI-Arbeit problematisch?','Es kann blockieren und je nach Kontext Deadlocks begünstigen.','Ein durchgehender async/await-Aufrufpfad ist gewöhnlich verständlicher und sicherer.']
 ],
 exercise:'Entwirf einen EventSearchService mit SearchAsync(string, CancellationToken), der per HttpClient lädt. Beschreibe, wie eine UI die vorige Suche abbricht und alte Antworten nicht mehr übernimmt. Lege getrennte Zustände für Erfolg, Abbruch und Fehler fest.',
 solution:'Die Methode akzeptiert einen Token und gibt ihn an HttpClient weiter. Beim neuen Suchbegriff wird der vorherige CancellationTokenSource abgebrochen und eine neue Generation-ID vergeben. Nach await überprüft die UI, ob die Generation noch aktuell ist. OperationCanceledException wird bei selbst ausgelöstem Abbruch als normaler Ablauf behandelt; Transportfehler führen zu einem Error-State.'
},
{language:'cpp',id:'cpp-templates-constraints',title:'C++: Templates, Concepts und präzise generische Verträge',
 objectives:['Funktions-Templates von Laufzeitpolymorphie unterscheiden.','Concepts und requires als überprüfbare Compile-Time-Anforderungen verwenden.','Fehleranfällige generische APIs gezielt einschränken.'],
 docs:'https://en.cppreference.com/w/cpp/language/constraints',
 sections:[
 ['templates','Templates erzeugen typabhängige Implementierungen',
 'Ein Funktions-Template beschreibt einen Algorithmus, der mit verschiedenen Typen instanziiert werden kann. Eine Funktion add(T a, T b) ist nicht automatisch eine gewöhnliche Methode mit Object-Parametern wie in manchen Laufzeitmodellen. Der Compiler überprüft beim Instanziieren, ob die erforderlichen Ausdrücke für den konkreten Typ gültig sind. Diese Form generischer Programmierung kann effizienten Code erzeugen, verlangt aber einen klaren Vertrag über erlaubte Operationen.',
 'Ein zu allgemeines Template ist oft schlechter lesbar als eine gezielt eingeschränkte Variante. Wenn eine Funktion nur ganzzahlige Werte zählen darf, sollte sie nicht stillschweigend beliebige Typen mit einem passenden Plusoperator akzeptieren. Concepts erlauben es seit C++20, die zulässigen Typanforderungen in benannte oder direkt angegebene Compile-Time-Bedingungen zu fassen. Das kann Fehlermeldungen verbessern und die fachliche Absicht sichtbar machen.',
 'template <typename T>\nT doubleValue(T value) {\n    return value + value;\n}',
 'Das Template verlangt implizit einen passenden Plusoperator und einen für T geeigneten Rückgabewert.'],
 ['concepts','Ein Concept dokumentiert eine Anforderung',
 'Standard-Concepts wie std::integral und std::floating_point beschreiben Kategorien zulässiger Typen. Eine Funktion mit template<std::integral T> akzeptiert nur Typen, die diese Compile-Time-Anforderung erfüllen. Das ist besonders nützlich, wenn der Algorithmus spezifische Eigenschaften eines Typs voraussetzt. Anstatt erst tief im Funktionskörper einen Fehler zu erhalten, können Aufrufer schon an der Deklaration erkennen, für welche Typfamilie die Funktion gedacht ist.',
 'Concepts sind kein Ersatz für eine Runtime-Validierung fachlicher Werte. std::integral erlaubt beispielsweise auch negative Werte, wenn der konkrete Typ sie unterstützt. Eine Teilnehmerzahl darf trotzdem nicht negativ sein, wenn der Geschäftsvertrag dies verbietet. Der Compiler kann überprüfen, ob ein Typ zur gewünschten Kategorie gehört, aber nicht jede vom Nutzer geladene Zahl automatisch fachlich normalisieren.',
 '#include <concepts>\ntemplate <std::integral T>\nT increment(T value) {\n    return value + 1;\n}',
 'Das Concept schränkt zulässige Typen ein. Zahlenüberlauf und Fachgrenzen bleiben separate Fragen.'],
 ['requires','requires kann konkrete Operationen verlangen',
 'Mit requires-Ausdrücken lässt sich beschreiben, dass ein Typ bestimmte Member oder Operationen unterstützt. Eine Funktion, die eine Collection durchlaufen möchte, kann Eigenschaften eines Ranges verlangen, statt unmittelbar eine konkrete std::vector-Implementierung vorauszusetzen. Das erweitert Wiederverwendung, wenn verschiedene Container denselben benötigten Vertrag erfüllen. Gleichzeitig sollte die Anforderung nicht breiter sein als die Operationen, die die Funktion wirklich ausführt.',
 'Eine überladene Funktion kann anhand von Concepts verschiedene Implementierungen anbieten. Dabei muss klar bleiben, welcher Overload für einen Typ ausgewählt wird. Zu viele ineinander verschachtelte requires-Klauseln können die Lesbarkeit genauso beschädigen wie ungeprüfte Templates. Beginne mit bekannten Standard-Concepts und füge eigene nur hinzu, wenn sie eine stabile fachliche Abstraktion ausdrücken.',
 '#include <ranges>\ntemplate <std::ranges::input_range R>\nstd::size_t countRange(R&& values) {\n    std::size_t count = 0;\n    for (auto&& value : values) { (void)value; ++count; }\n    return count;\n}',
 'Die Range-Anforderung beschreibt, dass der Typ als Eingabefolge iterierbar sein muss. Für std::size_t wird <cstddef> benötigt.'],
 ['design','Typvertrag und Besitzervertrag ergänzen sich',
 'Ein Template kann einen passenden Container-Typ akzeptieren und trotzdem eine gefährliche Referenz auf einen temporären Wert zurückgeben. Concepts lösen nicht das gesamte Ownership- und Lebensdauerthema. Wer eine generische Funktion entwirft, muss weiterhin unterscheiden, ob Eingaben als Wert, als Referenz oder als View verwendet werden. Ein Algorithmus, der eine eigene Ergebnismenge zurückgibt, ist oft leichter sicher zu verwenden als einer, der unkontrolliert interne Iteratoren nach außen reicht.',
 'Teste generische Schnittstellen mit mehreren geeigneten Typen und versuche bewusst ungeeignete Typen zu instanziieren. Bei einer fachlichen API sollte ein falscher Typ bereits beim Compile abgelehnt werden, während ungültige Werte über Vorbedingungen oder Fehlerobjekte behandelt werden. Gute generische Programmierung besteht aus einer klaren Grenze zwischen dem, was zur Compile-Time bewiesen werden kann, und dem, was zur Laufzeit entschieden werden muss.',
 '#include <concepts>\ntemplate <std::integral T>\nbool nonNegative(T value) {\n    return value >= 0;\n}',
 'Für vorzeichenlose Typen ist die Bedingung trivial; die Typkategorie allein beschreibt keine Fachgrenzen.']
 ],
 checks:[
 ['Sind C++-Templates bloß ein Runtime-Object-Parameter?','Nein.','Template-Instanziierung und Typprüfung erfolgen typabhängig zur Übersetzungszeit.'],
 ['Was ist der Zweck von std::integral?','Ein Compile-Time-Vertrag für ganzzahlige Typen.','Der Algorithmus kann geeignete Typen in der Signatur einschränken.'],
 ['Verhindert ein Concept automatisch fachlich ungültige Werte wie -1 Sitzplätze?','Nein.','Typanforderungen und Wertvalidierung sind getrennte Verträge.']
 ],
 exercise:'Schreibe eine C++20-Funktion checkedSeats(T count), die nur std::integral-Typen annimmt und negative Eingaben ablehnt. Erkläre, warum eine Compile-Time-Constraint nicht den gesamten Geschäftsvertrag ersetzt, und teste int, unsigned int und einen nicht-integralen Typ.',
 solution:'Definiere template<std::integral T> T checkedSeats(T count) und prüfe negative Werte für vorzeichenbehaftete Typen, beispielsweise mit if constexpr(std::signed_integral<T>). Gib gültige Werte zurück oder wirf std::invalid_argument. Der Versuch mit einem String oder double muss bereits am Template-Constraint scheitern.'
},
{language:'php',id:'php-objects-composer',title:'PHP: Klassen, Namespaces und Composer als Projektstruktur',
 objectives:['Klassen und fachliche Objekte von losen Arrays abgrenzen.','Namespaces und Autoloading im Projekt richtig einordnen.','Composer-Abhängigkeiten reproduzierbar verwalten.'],
 docs:'https://www.php.net/manual/en/language.oop5.php',
 sections:[
 ['objects','Klassen bündeln fachliche Regeln',
 'Ein PHP-Array kann schnell einen Eventdatensatz darstellen, sagt aber nicht zwingend, welche Schlüssel erforderlich sind oder wie der Datensatz verändert werden darf. Eine Klasse kann einen klaren Konstruktor, Properties und Methoden mit dokumentierten Typen besitzen. Das ist hilfreich, wenn mehrere Schichten dieselben Geschäftsregeln verwenden. Ein Event mit ungültiger Kapazität sollte nicht nur zufällig im Controller geprüft werden, wenn es auch an anderen Stellen erzeugt werden kann.',
 'Für kleine immutable Datenmodelle können readonly Properties oder passende Sprachkonstruktionen sinnvoll sein. Auch ein readonly Feld bedeutet aber nicht, dass sämtliche referenzierten Inhalte rekursiv unveränderlich sind. Entscheide, welche Änderungen erlaubt sein müssen und welche Geschäftsoperationen sie auslösen. Eine Methode reserve(1) kann mehr über die Domäne aussagen als zwei beliebige Setter für freie und belegte Plätze.',
 '<?php\nfinal class Event {\n    public function __construct(\n        public readonly string $title,\n        public readonly int $capacity\n    ) {\n        if (trim($title) === "" || $capacity < 0) throw new InvalidArgumentException();\n    }\n}',
 'Der Konstruktor sorgt für einen gültigen Titel und eine nichtnegative Kapazität.'],
 ['namespaces','Namespaces machen Namen und Abhängigkeiten eindeutig',
 'Wächst eine Anwendung, können Bibliotheken dieselben Klassennamen besitzen. Namespaces strukturieren solche Namen und verhindern Kollisionen zwischen Modulen. Eine Domänenklasse kann beispielsweise App\\Domain\\Event heißen, während ein Framework eine völlig andere Event-Klasse bereitstellt. Durch use kannst du Namen importieren, ohne die vollständige Namespace-Angabe an jeder Stelle wiederholen zu müssen.',
 'Namespaces laden Dateien nicht automatisch. Autoloading ist eine zusätzliche Aufgabe, bei der ein Autoloader eine Klassennamenskonvention auf Dateipfade abbildet. In Composer-Projekten wird dafür häufig PSR-4 verwendet. Ein falscher Namespace, ein unpassender Ordnername oder ein inkonsistenter Composer-Eintrag kann eine Klasse trotz korrekter Syntax unauffindbar machen. Die Struktur des Projekts muss deshalb zur Konfiguration passen.',
 'namespace App\\Domain;\nfinal class EventKey {\n    public function __construct(public readonly string $id) {}\n}',
 'Der Namespace bezeichnet den logischen Modulbereich, in dem der Klassenname gilt.'],
 ['composer','Composer verwaltet mehr als Downloads',
 'Mit composer.json beschreibt ein PHP-Projekt seine Paketabhängigkeiten und häufig auch das Autoloading. Für eine Anwendung ist composer.lock wichtig, damit mehrere Umgebungen dieselben konkret aufgelösten Paketversionen erhalten. Ohne eine feste Lock-Datei kann eine Neuinstallation später andere transitive Abhängigkeiten auswählen, obwohl composer.json unverändert wirkt. Ein reproduzierbarer Build benötigt deshalb ein bewusstes Verhältnis zwischen zulässigen Versionsbereichen und konkret gesperrten Versionen.',
 'Bibliotheken und Anwendungen können unterschiedliche Regeln für ihre Lock-Dateien haben. Für eine deploybare Anwendung gehört der Lock-Zustand normalerweise zum überprüften Quellstand. Sicherheitsupdates sollten kontrolliert eingespielt und getestet werden, statt sie durch beliebige Neuauflösungen zu erhalten. Composer-Skripte können außerdem Code ausführen und gehören darum wie andere Build-Werkzeuge zur Vertrauens- und Sicherheitsgrenze.',
 '{\n  "autoload": {\n    "psr-4": { "App\\\\": "src/" }\n  }\n}',
 'Die JSON-Struktur zeigt das Prinzip des PSR-4-Autoloadings. Ein vollständiges composer.json enthält weitere Projektmetadaten.'],
 ['architecture','Klare Module verhindern Framework-Abhängigkeit überall',
 'Eine Domänenklasse sollte nicht zwingend einen HTTP-Request kennen, nur weil der erste Aufrufer ein Controller ist. Halte Datenvalidierung und Fachoperationen in wiederverwendbaren Modulen. Der Controller übersetzt HTTP-Daten in geprüfte Eingaben und Rückgaben in passende Statuscodes. Persistenz wird in einer separaten Komponente behandelt, die den Domänenvertrag nicht unbemerkt ändert. Dadurch lassen sich Geschäftsregeln ohne Datenbank oder Webserver testen.',
 'Vermeide allerdings eine künstliche Klassenhierarchie für jede Zeile Code. Kleine reine Funktionen können völlig angemessen sein. Entscheidend ist die Abhängigkeitsrichtung: Eine Eventregel soll nicht durch einen Wechsel des Webframeworks ungültig werden. Nutze Namespaces und Composer als Werkzeuge für nachvollziehbare Modulgrenzen, nicht als Ersatz für die fachliche Struktur. Die Qualität zeigt sich daran, ob Änderungen lokal bleiben und Fehler gezielt behandelt werden können.',
 'function normalizeTitle(string $raw): string {\n    $result = trim($raw);\n    if ($result === "") throw new InvalidArgumentException("Blank title");\n    return $result;\n}',
 'Eine kleine reine Funktion ist für diese eigenständige Regel sinnvoller als eine unnötig umfangreiche Serviceklasse.']
 ],
 checks:[
 ['Macht die Namespace-Deklaration eine PHP-Datei automatisch ladbar?','Nein.','Autoloading muss zusätzlich konfiguriert und zur Dateistruktur passend eingerichtet werden.'],
 ['Wozu dient composer.lock bei einer Anwendung?','Zur Fixierung konkret aufgelöster Paketversionen.','Mehrere Installationen sollen reproduzierbar dieselben Abhängigkeiten verwenden.'],
 ['Erzwingt readonly bei einer Property vollständige tiefe Unveränderlichkeit?','Nein.','Die Restriktion auf Property-Zuweisungen ist nicht gleichbedeutend mit rekursiv unveränderlichen referenzierten Objekten.']
 ],
 exercise:'Entwerfe eine kleine PHP-Projektstruktur mit App\\Domain\\Event und App\\Service\\EventService. Lege eine PSR-4-Zuordnung in composer.json fest, entscheide welche Klassen keine HTTP-Abhängigkeiten besitzen dürfen, und schreibe einen Test für einen leeren Titel.',
 solution:'Ordne App\\ auf src/ ab und lege Event in src/Domain/Event.php sowie EventService in src/Service/EventService.php ab. Der Konstruktor der Event-Klasse weist leere Titel zurück. Der Controller ruft die Fachlogik auf, besitzt sie aber nicht selbst. Sichere die Composer-Abhängigkeiten der Anwendung über composer.lock.'
},
{language:'go',id:'go-interface-design',title:'Go: Interfaces, Method Sets und kleine Verträge',
 objectives:['Implizite Interface-Erfüllung nachvollziehen.','Wert- und Pointer-Receiver bei Method Sets unterscheiden.','Kleine, konsumorientierte Interfaces gezielt entwerfen.'],
 docs:'https://go.dev/doc/effective_go#interfaces-and-other-types',
 sections:[
 ['implicit','Ein Interface beschreibt Verhalten ohne implements-Klausel',
 'In Go kann ein Typ ein Interface erfüllen, indem er die erforderlichen Methoden besitzt. Es gibt dafür keine ausdrückliche implements-Deklaration wie in einigen anderen Sprachen. Ein Interface Reader verlangt beispielsweise ein bestimmtes Leseverhalten; unterschiedliche Typen können denselben Vertrag unabhängig voneinander erfüllen. Dadurch lassen sich Algorithmen von konkreten Implementierungen entkoppeln, wenn sie tatsächlich nur wenige Operationen benötigen.',
 'Eine Funktion sollte trotzdem nicht jedes Domänenobjekt hinter einem Interface verstecken. Wenn sie ausschließlich mit einem konkreten Eventtyp arbeitet und kein Austausch nötig ist, kann dieser Typ klarer sein. Die Stärke kleiner Interfaces liegt darin, dass die konsumierende Funktion genau das benötigte Verhalten fordert, statt eine große Hierarchie mit vielen ungenutzten Methoden aufzubauen. Die Schnittstelle entsteht aus der Fachoperation, nicht allein aus dem Wunsch nach Abstraktion.',
 'type Named interface { Name() string }\ntype Event struct { title string }\nfunc (e Event) Name() string { return e.title }\nfunc label(value Named) string { return value.Name() }',
 'Event erfüllt Named ohne eine besondere implements-Anweisung.'],
 ['methods','Method Sets unterscheiden Werte und Pointer',
 'Go besitzt Methoden mit Wert- oder Pointer-Receiver. Ein Wert-Receiver arbeitet auf einer Kopie des Receiver-Werts und eignet sich für kleine, unveränderliche Beobachtungen. Ein Pointer-Receiver kann den ursprünglichen Zustand verändern und vermeidet bei größeren Strukturen unnötige Kopien. Die Wahl wirkt sich außerdem darauf aus, ob ein Wert oder nur ein Pointer den Methodenvertrag eines Interfaces erfüllt. Für das Method Set eines konkreten Typs gelten dazu präzise Regeln.',
 'Ein Typ T besitzt grundsätzlich die Methoden mit Receiver T; *T besitzt die Methoden mit Receiver T und *T. Wenn ein Interface eine Methode verlangt, die nur über Pointer-Receiver deklariert ist, erfüllt gewöhnlich *T den Vertrag und nicht T. Der Compiler kann bei bestimmten direkten Methodenaufrufen automatisch eine Adresse nehmen, was aber nicht die allgemeinen Regeln zur Interface-Erfüllung aufhebt. Tests und API-Signaturen sollten diese Unterscheidung sichtbar machen.',
 'type Counter struct { n int }\nfunc (c *Counter) Increment() { c.n++ }\nfunc (c Counter) Value() int { return c.n }\n// *Counter erfüllt Interfaces mit Increment; Counter allein nicht.',
 'Der Pointer-Receiver ist für den verändernden Aufruf erforderlich.'],
 ['nil','Ein Interface kann trotz nil-Pointer selbst nicht nil sein',
 'Ein Interfacewert trägt konzeptionell Informationen über den dynamischen Typ und den konkreten Wert. Wird ein typisierter nil-Pointer in ein Interface gelegt, ist das Interface selbst nicht unbedingt gleich nil, weil es weiterhin den dynamischen Typ enthält. Dieser Unterschied kann insbesondere bei error-Rückgaben gefährlich werden. Eine Funktion darf nicht einen typisierten nil-Pointer als error zurückgeben und erwarten, dass der Aufrufer ihn als nil erkennt.',
 'Wenn kein Fehler vorliegt, gib ausdrücklich nil als Interfacewert zurück. Bei einem tatsächlichen Fehler verwende einen korrekt konstruierten error. Das ist ein Beispiel dafür, warum ein scheinbar simpler nil-Vergleich in Go von der genauen Typstruktur abhängen kann. Klare Konstruktion und einfache Rückgabewege verhindern dieses Problem besser als allgemeine Sonderfallbehandlung bei jedem Aufrufer.',
 'type MyError struct { message string }\nfunc (e *MyError) Error() string { return e.message }\nvar ptr *MyError = nil\nvar err error = ptr\nfmt.Println(err == nil) // false',
 'Das Interface trägt weiterhin den dynamischen Typ *MyError. Für das vollständige Beispiel wird fmt importiert.'],
 ['tests','Interfaces erleichtern austauschbare Testkomponenten',
 'Wenn eine Funktion nur eine Read-Methode benötigt, kann ein kleiner Interfacevertrag einen In-Memory-Testdouble erlauben. Der Test braucht dann weder eine echte Datenbank noch eine Netzwerkverbindung. Zugleich bleibt die Produktionsimplementierung frei, denselben Vertrag auf andere Weise zu erfüllen. Die eigentliche Qualität liegt darin, dass die Fachoperation ihren Bedarf präzise beschreibt. Ein riesiges Repository-Interface mit zwanzig Methoden erschwert dagegen Testdoubles und erhöht die Kopplung.',
 'Prüfe bei einer neuen Interface-Grenze zuerst, welche Methoden wirklich vom Verbraucher verwendet werden. Schreibe den Vertrag dort, wo er gebraucht wird, und lass konkrete Implementierungen unabhängig bleiben. Nutze zusätzlich Compile-Time-Zuweisungen oder Tests, wenn eine bestimmte Interface-Erfüllung ausdrücklich dokumentiert sein soll. Vermeide aber abstrakte Interfaces, für die es keine sinnvolle zweite Implementierung oder stabile Fachgrenze gibt.',
 'type NameReader interface { Name() string }\nfunc greeting(reader NameReader) string {\n    return "Hallo " + reader.Name()\n}',
 'Die Funktion benötigt ausschließlich Name und kann daher mit kleinen, gezielten Testdoubles geprüft werden.']
 ],
 checks:[
 ['Benötigt ein Go-Typ eine implements-Deklaration für ein Interface?','Nein.','Die Erfüllung wird über passende Methoden erkannt.'],
 ['Erfüllt T automatisch ein Interface, dessen Methode nur den Receiver *T hat?','Nein.','Das Method Set von T enthält nicht dieselben Pointer-Receiver-Methoden wie das von *T.'],
 ['Ist ein Interface mit dynamischem Typ *MyError und nil-Wert gleich nil?','Nein.','Das Interface besitzt weiterhin Typinformationen und ist daher nicht das nil-Interface.']
 ],
 exercise:'Implementiere ein Interface TitleReader mit Title() string und zwei Typen, die es erfüllen. Ergänze einen Typ mit Pointer-Receiver und zeige, welche Form das Interface erfüllt. Schreibe einen Test, der über das Interface beide echten Implementierungen und einen kleinen Testdouble verwendet.',
 solution:'Definiere type TitleReader interface { Title() string }. Gib zwei Typen passende Methoden; bei einem davon verwende func (e *Event) Title() string. Übergib dann &Event statt Event an eine Funktion, die TitleReader verlangt. Das Testdouble benötigt nur die eine Methode und keine Fachinfrastruktur.'
},
{language:'rust',id:'rust-traits',title:'Rust: Traits, Bounds und generische Schnittstellen',
 objectives:['Traits als Verhaltensverträge für konkrete Typen erklären.','Trait Bounds und impl Trait gegenüberstellen.','Statische Dispatch-Verträge von Trait-Objects unterscheiden.'],
 docs:'https://doc.rust-lang.org/book/ch10-02-traits.html',
 sections:[
 ['traits','Ein Trait beschreibt gemeinsames Verhalten',
 'Rust verwendet Traits, um gemeinsame Methodenverträge auszudrücken. Ein Trait Summary kann eine Methode summary(&self) -> String verlangen. Unterschiedliche Structs implementieren diesen Vertrag jeweils für ihren eigenen Typ. So kann eine Funktion mit mehreren fachlichen Datenarten arbeiten, solange sie die benötigte Methode bereitstellen. Das ist nicht dasselbe wie ein globaler Klassenstammbaum; die Implementierungen gehören zu konkreten Typen und Trait-Regeln.',
 'Ein Trait darf auch Defaultmethoden bereitstellen, die auf anderen Traitmethoden aufbauen. Eine Standardimplementierung muss jedoch fachlich zu allen möglichen Implementierern passen. Wenn sie stillschweigend einen Eigenschaftswert voraussetzt, den nicht jeder Typ besitzt, kann der Vertrag irreführend werden. Traits sind besonders nützlich, wenn der gemeinsame Bedarf klein und stabil bleibt. Die Wahl der richtigen Abstraktion ist wichtiger als möglichst viele Traits.',
 'trait Summary { fn summary(&self) -> String; }\nstruct Event { title: String }\nimpl Summary for Event {\n    fn summary(&self) -> String { self.title.clone() }\n}',
 'Event implementiert Summary. Die Methode benötigt nur eine geliehene Referenz auf den Besitzer.'],
 ['bounds','Ein Bound macht die erlaubte Operation sichtbar',
 'Eine generische Funktion kann einen Typparameter T mit einem Trait Bound einschränken. Bei T: Summary weiß die Funktion, dass summary auf einem &T verfügbar ist. Ohne diese Einschränkung könnte der Compiler die Methode nicht für jeden möglichen Typ akzeptieren. Mit mehreren Bounds lassen sich zusätzliche Fähigkeiten wie Display oder Clone verlangen, doch jede weitere Anforderung beschränkt die erlaubten Aufrufer.',
 'Die Form impl Summary in einem Parameter ist für viele einfache Fälle eine lesbare Alternative zur expliziten T-Schreibweise. Brauchst du jedoch denselben konkreten Typ an mehreren Stellen der Signatur, kann ein benannter Typparameter die Beziehung klarer ausdrücken. Generics gehören dort hin, wo ein echter Typzusammenhang besteht. Ein unnötig generischer Wrapper erzeugt sonst nur komplizierte Fehlermeldungen.',
 'fn print_summary<T: Summary>(item: &T) {\n    println!("{}", item.summary());\n}\nfn print_other(item: &impl Summary) {\n    println!("{}", item.summary());\n}',
 'Beide Funktionen verlangen den Summary-Vertrag; die genaue Signaturform unterscheidet sich.'],
 ['dispatch','Statischer und dynamischer Dispatch sind verschiedene Verträge',
 'Generische Funktionen mit Trait Bounds werden häufig über Monomorphisierung für die verwendeten konkreten Typen spezialisiert. Ein Trait-Object wie &dyn Summary erlaubt dagegen dynamischen Dispatch über einen Trait-Object-Vertrag. Das kann sinnvoll sein, wenn heterogene Typen beispielsweise in einer gemeinsamen Collection verarbeitet werden sollen. Die Wahl beeinflusst Typinformation, mögliche Laufzeitkosten und die Art, wie das Ergebnis weiterverwendet werden kann.',
 'Nicht jedes Trait ist ohne Weiteres als Trait-Object geeignet. Bestimmte Methodenformen mit generischen Typparametern oder Rückgaben von Self können die dafür nötigen Regeln verletzen. Außerdem ist eine dynamisch dispatchte Methode keine allgemeine Lösung für Ownership. Ein Box<dyn Summary> besitzt sein Objekt, ein &dyn Summary leiht es nur. Diese Unterscheidung bleibt auch bei Traits wesentlich für einen sicheren Lebensdauervertrag.',
 'fn show(item: &dyn Summary) {\n    println!("{}", item.summary());\n}',
 'Die Funktion arbeitet über einen geliehenen Trait-Object-Vertrag. Die implementierende konkrete Struktur bleibt unbekannt.'],
 ['coherence','Implementierungen dürfen nicht beliebig kollidieren',
 'Rust beschränkt, für welche Kombination aus Trait und Typ du Implementierungen schreiben darfst. Die Regeln verhindern, dass zwei unabhängige Bibliotheken später widersprüchliche Implementierungen derselben Typ-Trait-Kombination einführen und ein Projekt dadurch unvorhersehbar wird. Insbesondere ist die sogenannte Orphan Rule relevant, wenn weder Trait noch Typ aus deinem eigenen Crate stammen. Dieses Prinzip ist ein Teil der globalen Verlässlichkeit von Trait-Auflösung.',
 'In einer Anwendung lohnt es sich daher, eigene Domänentypen und kleine Traits sinnvoll zu platzieren. Wenn ein externer Typ einen externen Trait in einer gewünschten Form nicht implementiert, kann ein neuer lokaler Wrapper-Typ die Beziehung ausdrücken. Der Compiler verweigert ungeeignete Implementierungen nicht aus Willkür; er schützt vor langfristigen Konflikten im Ökosystem. Nutze diese Regeln beim Entwurf wiederverwendbarer Bibliotheken.',
 'struct EventId(String);\nimpl std::fmt::Display for EventId {\n    fn fmt(&self, f: &mut std::fmt::Formatter<\u0027_>) -> std::fmt::Result {\n        write!(f, "{}", self.0)\n    }\n}',
 'Der lokale EventId-Typ darf einen externen Trait implementieren. In der Rust-Syntax steht vor dem Lifetime-Unterstrich ein Apostroph.']
 ],
 checks:[
 ['Warum benötigt eine generische Funktion T: Summary, wenn sie summary aufruft?','Damit die zulässigen Methoden von T statisch bekannt sind.','Der Bound beschreibt den notwendigen Verhaltensvertrag.'],
 ['Was ist der Unterschied zwischen &dyn Trait und Box<dyn Trait>?','Das erste leiht, das zweite besitzt das Trait-Object.','Dispatch und Ownership sind voneinander getrennte Eigenschaften.'],
 ['Wozu dient die Orphan Rule?','Sie verhindert bestimmte kollidierende Trait-Implementierungen fremder Typ-/Trait-Kombinationen.','So bleibt die Trait-Auflösung über unabhängige Crates hinweg konsistent.']
 ],
 exercise:'Definiere einen Trait Named mit name(&self) -> &str und implementiere ihn für Event und Person. Schreibe eine Funktion print_name mit generischem Bound und eine weitere mit &dyn Named. Erkläre bei beiden den Dispatch und die Besitzverhältnisse.',
 solution:'Implementiere Named für beide lokalen Structs. Schreibe fn print_name<T: Named>(item: &T) und fn print_dyn(item: &dyn Named). Beide nehmen nur geliehene Objekte; die erste Form erlaubt statische Spezialisierung, die zweite benutzt ein Trait-Object mit dynamischem Dispatch. Füge zwei Typen in eine Vec<Box<dyn Named>> ein, wenn du ausdrücklich heterogene Besitzer benötigst.'
},
{language:'kotlin',id:'kt-data-classes',title:'Kotlin: Data Classes, Collections und kontrollierte Mutabilität',
 objectives:['Data Classes und ihre generierten Methoden richtig einordnen.','Read-only-Collection-Interfaces von unveränderlichen Daten unterscheiden.','copy und verschachtelte Objekte ohne falsche Deep-Copy-Annahme verwenden.'],
 docs:'https://kotlinlang.org/docs/data-classes.html',
 sections:[
 ['data','Eine Data Class beschreibt wertorientierte Daten',
 'Mit data class kann Kotlin Methoden wie equals, hashCode, toString, componentN und copy aus den Properties des primären Konstruktors ableiten. Das ist praktisch für kleine fachliche Datenträger wie EventId oder einen Konfigurationseintrag. Gleichheit richtet sich nach den dafür relevanten primären Konstruktor-Properties. Eigenschaften, die nur im Klassenkörper deklariert werden, sind nicht automatisch an denselben generierten Methoden beteiligt.',
 'Eine Data Class bedeutet nicht, dass jede ihrer Daten unveränderlich ist. Ein var im primären Konstruktor darf weiterhin geändert werden; eine val-Property verhindert zwar eine neue Zuweisung an diese Property, macht ein referenziertes MutableList-Objekt aber nicht tief unveränderlich. Ein gutes Datenmodell wählt deshalb die Mutierbarkeit seiner Bestandteile bewusst. Für IDs und Fachwerte sind val-Properties häufig leichter sicher zu verwenden.',
 'data class Event(val id: String, val title: String)\nval first = Event("E1", "Workshop")\nval second = first.copy(title = "Rust-Workshop")\nprintln(first == second) // false',
 'copy erzeugt einen neuen äußeren Datenträger. Die unveränderten Properties werden übernommen.'],
 ['copy','copy ist keine rekursive Tiefenkopie',
 'Wenn eine Data Class eine Collection oder ein anderes veränderliches Objekt enthält, übernimmt copy normalerweise dessen Referenz, sofern du nicht selbst einen neuen Wert lieferst. Zwei Data-Class-Instanzen können danach dieselbe mutable Liste referenzieren. Eine Änderung über die eine Instanz wird dann auch über die andere sichtbar. Das ist kein Fehler der copy-Methode; ihr Vertrag besteht in der flachen Kopie der relevanten Konstruktorwerte.',
 'Wenn ein fachlicher Zustand unabhängig von einem früheren Zustand bleiben soll, kannst du beim Kopieren auch die relevanten Collections selbst kopieren oder sie von vornherein über kontrolliert unveränderliche Modelle darstellen. Beachte, dass toList eine neue Listendarstellung liefern kann, die enthaltenen veränderbaren Objekte dadurch aber nicht automatisch kopiert werden. Eine vollständige Deep Copy verlangt für jede Datenebene eine sinnvolle Strategie.',
 'data class Catalog(val names: MutableList<String>)\nval a = Catalog(mutableListOf("Ada"))\nval b = a.copy()\nb.names.add("Kim")\nprintln(a.names) // [Ada, Kim]',
 'Die beiden Instanzen teilen dieselbe MutableList, obwohl das äußere Objekt kopiert wurde.'],
 ['collections','List ist read-only, nicht automatisch persistent',
 'In Kotlin stellt List<T> eine lesende Collection-Schnittstelle bereit, während MutableList<T> Mutationsoperationen anbietet. Ein als List<T> typisierter Wert kann trotzdem auf eine Collection zeigen, die an anderer Stelle verändert wird. Deshalb ist read-only nicht dasselbe wie unveränderlich oder persistent. Dieser Unterschied ist für React-ähnliche State-Modelle, UI-Listen und Datenbank-Caches wichtig: Ein alter Snapshot darf nicht unbemerkt durch fremde Mutation verändert werden.',
 'Erzeuge für einen stabilen Fachzustand bei Änderungen häufig eine neue Collection oder verwende explizite persistent collection APIs, falls dein Projekt solche benötigt. Die Standardbibliothek erlaubt Operationen wie filter und map, die neue Ergebnislisten liefern. Verwechsle das nicht mit einer Garantie, dass alle verschachtelten Werte unabhängig sind. Ein klares Modell legt fest, wer Listen ändern darf und ob Aufrufer eine Momentaufnahme oder eine Live-Sicht erhalten.',
 'val names = listOf("Ada", "Kim")\nval selected = names.filter { it.startsWith("A") }\nprintln(selected) // [Ada]',
 'filter erzeugt eine Ergebnisliste. Die Elemente selbst werden dabei nicht automatisch tief kopiert.'],
 ['design','Zustandsänderungen als fachliche Operationen ausdrücken',
 'Ein Eventkatalog sollte nicht jede interne Collection direkt nach außen reichen, wenn er Regeln über eindeutige IDs oder Reservierungslimits schützen muss. Eine Fachmethode wie addEvent kann prüfen, dass der neue Datensatz gültig ist und nicht bereits existiert. Anschließend kann die Methode einen neuen Catalog-Wert liefern, statt den ursprünglichen Zustand unkontrolliert zu ändern. Solche Value-Transformationen sind leichter zu testen, weil Eingabe und Ausgabe klar definiert sind.',
 'Auch Kotlin-Nullsicherheit gehört in diesen Vertrag: Eine optionale Beschreibung ist anders als ein fehlender Eventtitel. Zusammen ergeben Data Classes, val, read-only Interfaces und explizite Updates ein nützliches Modell – aber keines davon reicht isoliert als Garantie für ein korrektes Programm. Teste Identität, geteilte verschachtelte Collections, leere Eingaben und die fachlichen Grenzen. Ein guter Datenträger ist nur so zuverlässig wie die Regeln, mit denen er gebaut und verwendet wird.',
 'data class Catalog(val events: List<Event>)\nfun Catalog.withEvent(event: Event): Catalog =\n    copy(events = events + event)',
 'Die Funktion liefert einen neuen äußeren Katalog; sie sollte zusätzlich Fachregeln zu Duplikaten und Gültigkeit berücksichtigen.']
 ],
 checks:[
 ['Berücksichtigt eine Data Class automatisch alle Properties im Klassenkörper bei equals?','Nein.','Die generierten wesentlichen Methoden leiten sich aus primären Konstruktor-Properties ab.'],
 ['Ist copy bei verschachtelten mutable Collections eine Deep Copy?','Nein.','Referenzierte mutable Objekte können nach dem Kopieren weiterhin geteilt sein.'],
 ['Garantiert der Typ List<T> absolute Unveränderlichkeit des zugrunde liegenden Objekts?','Nein.','Er stellt eine read-only Schnittstelle dar, deren Implementierung anderswo verändert werden kann.']
 ],
 exercise:'Entwerfe data class Event(id,title) und data class Catalog(events: List<Event>). Implementiere eine pure Funktion addUnique(catalog,event), die Duplikate nach id ablehnt und einen neuen Catalog zurückgibt. Teste, dass die alte Eventliste unverändert bleibt.',
 solution:'Prüfe catalog.events.any { it.id == event.id } und wirf bei Duplikat IllegalArgumentException. Ansonsten return catalog.copy(events = catalog.events + event). Teste das unveränderte Original, die neue Anzahl und das Fehlerverhalten bei gleicher ID. Nutze val-Felder für stabile fachliche Datenträger.'
}
];
export const THIRD_LANGUAGE_CHAPTERS:readonly AuthoredLesson[]=manuscripts.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:32,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({
   id,title,paragraphs:[first,second],code,annotation
  })),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:item.language,name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Ein sprachspezifisches Lehrbeispiel aus dem Kapitel. Die fachlichen Gründe, Grenzen und alternativen Entscheidungen werden in vier zusammenhängenden Abschnitten erklärt.',
  differences:'Die konkreten Semantik- und Laufzeitregeln müssen aus den Besonderheiten dieser Sprache abgeleitet werden; ähnliche Syntax in anderen Sprachen garantiert kein identisches Verhalten.',
  equivalence:'related',docs:item.docs
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
