import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';
type Section=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type Check=readonly [question:string,answer:string,reason:string];
type Manuscript={id:string;title:string;source:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Check[];exercise:string;solution:string};
/** Original Rust textbook chapters, editorially grounded in the official Rust book. */
const MANUSCRIPTS:readonly Manuscript[]=[
{
 id:'rust-smart-pointers',title:'Rust: Box, Rc, RefCell und explizite Ownershipmodelle',
 source:'https://doc.rust-lang.org/book/ch15-00-smart-pointers.html',
 objectives:['Box und Rc als unterschiedliche Besitzerformen erklären.','RefCell und Runtime-Borrowing gegenüber statischem Borrowing abgrenzen.','Referenzzyklen und die Rolle von Weak nachvollziehen.'],
 sections:[
 ['box','Box verlagert Besitz eines Wertes in eine Heap-Allokation',
 'Ein Box<T> besitzt genau den enthaltenen Wert und speichert ihn typischerweise auf dem Heap. Anders als eine normale Referenz verleiht eine Box ihrem Besitzer eine klare Verantwortung für die Freigabe. Wenn die Box ihren Gültigkeitsbereich verlässt, wird der enthaltene Wert normalerweise aufgeräumt. Das kann für rekursive Datenstrukturen wichtig sein: Ein Enum, das ohne Indirektion wieder denselben Typ enthält, hätte keine endlich bekannte Größe. Mit Box wird die rekursive Verknüpfung als Zeiger mit bekannter Größe dargestellt.',
 'Ein Box ist deshalb kein allgemeines Mittel gegen Compilerfehler bei Borrowing. Wer eine Box weitergibt, kann deren Eigentümerschaft genauso bewegen wie bei String oder Vec. Ein &Box<T> ist häufig unnötig, wenn die Funktion nur &T benötigt. Eine API sollte ihren Besitzvertrag klar ausdrücken: Kommt ein Objekt dauerhaft zu einem neuen Besitzer oder soll es nur vorübergehend gelesen werden? Eine Box beantwortet die erste Frage, eine Referenz häufig die zweite.',
 'enum Node { Value(i32), Next(i32, Box<Node>) }\nlet chain = Node::Next(1, Box::new(Node::Value(2)));',
 'Box macht die rekursive Größe der Variante Next endlich darstellbar. Der Typ besitzt weiterhin eine eindeutige Eigentümerkette.'],
 ['rc','Rc zählt Besitzer innerhalb eines Threads',
 'Manche Werte sollen mehreren Bestandteilen eines Programms gehören, ohne dass einer davon allein ihre Lebensdauer bestimmt. Rc<T> nutzt Referenzzählung, um diesen gemeinsamen Besitz innerhalb eines Threads auszudrücken. Ein Rc::clone erzeugt keinen vollständigen neuen T-Wert, sondern erhöht den starken Referenzzähler und erstellt einen weiteren Besitzer desselben Objekts. Das ist ein anderer Vertrag als String::clone, bei dem üblicherweise neue eigene Textdaten entstehen.',
 'Rc ist nicht die richtige Wahl, um beliebige Werte threadsicher zu teilen. Sein Zähler verwendet nicht die notwendige threadsichere Synchronisierung. Für geteilten Besitz über Threads hinweg kann Arc<T> geeignet sein, doch selbst Arc macht einen enthaltenen veränderlichen Wert nicht automatisch beliebig sicher veränderbar. Die Entscheidung zwischen Rc, Arc und einfachem Besitz hängt deshalb von der tatsächlichen Aufgabe ab, nicht davon, wie häufig eine Variable übergeben werden muss.',
 'use std::rc::Rc;\nlet value = Rc::new(String::from("Ada"));\nlet first = Rc::clone(&value);\nlet second = Rc::clone(&value);\nassert_eq!(Rc::strong_count(&value), 3);',
 'Drei Rc-Besitzer verweisen auf denselben String. Es werden nicht drei unabhängige Strings erzeugt.'],
 ['refcell','Interior Mutability verschiebt die Borrow-Prüfung',
 'RefCell<T> erlaubt bestimmte Mutationen über eine sonst unveränderliche äußere Referenz. Die üblichen Regeln für gleichzeitig aktive Lese- und Schreibausleihen gelten aber weiterhin; sie werden in diesem Fall zur Laufzeit durch Ref beziehungsweise RefMut kontrolliert. Wenn bereits eine passende Ausleihe aktiv ist, kann ein widersprüchlicher borrow_mut-Aufruf panic auslösen. Das ist keine Abschaffung des Borrow Checkers, sondern eine bewusste Verlagerung einer Regel in eine Runtime-Überprüfung.',
 'Eine Kombination Rc<RefCell<T>> kann bei Graphen oder GUI-Modellen für mehrere Besitzer mit gemeinsam veränderlichem Zustand nützlich sein. Sie erhöht jedoch die Komplexität des Modells und kann zur Laufzeit Fehler erzeugen, die bei einfachen &mut-Zugriffen schon beim Übersetzen sichtbar wären. Beginne deshalb mit normalen Besitzerverhältnissen, kleineren Gültigkeitsbereichen und klaren Methoden. Wähle RefCell nur, wenn das Datenmodell einen tatsächlichen Bedarf an Interior Mutability begründet.',
 'use std::cell::RefCell;\nlet count = RefCell::new(1);\n*count.borrow_mut() += 1;\nassert_eq!(*count.borrow(), 2);',
 'borrow_mut und borrow unterliegen Runtime-Borrow-Regeln. Gleichzeitig widersprüchliche Ausleihen sind nicht zulässig.'],
 ['cycles','Referenzzählung kann Zyklen nicht alleine auflösen',
 'Wenn zwei Rc-Objekte sich gegenseitig über starke Rc-Referenzen besitzen, können beide Referenzzähler positiv bleiben, obwohl die Anwendung die Gruppe nicht mehr erreichen kann. Dadurch werden die Werte nicht automatisch freigegeben. Das ist eine Speicherleck-Situation, keine Verletzung der Rust-Speichersicherheit. Ein sinnvolles Modell unterscheidet deshalb zwischen Besitzbeziehungen und bloßen Rückverweisen. Für Rückverweise eignet sich häufig Weak<T>, das den starken Besitz nicht erhöht.',
 'In einem Baum können Eltern ihre Kinder besitzen, während Kinder nur schwache Verweise auf Eltern halten. Ein Upgrade einer Weak-Referenz kann scheitern, weil das Ziel bereits freigegeben wurde; die API gibt deshalb Option<Rc<T>> zurück. Der Aufrufer muss diesen regulären Leerfall behandeln. Das Konzept ist typisch für Rust: Besitz und Gültigkeit sind nicht implizit, sondern bewusst im Typ dargestellt. Ein Graph ist korrekt modelliert, wenn das Abbauverhalten ebenso verständlich ist wie das Traversieren.',
 'use std::rc::{Rc,Weak};\nlet parent = Rc::new(String::from("Root"));\nlet back: Weak<String> = Rc::downgrade(&parent);\nassert!(back.upgrade().is_some());',
 'Weak verleiht keinen starken Eigentumsanteil und kann nach dem Freigeben des letzten Besitzers leer sein.']
 ],
 checks:[
 ['Kopiert Rc::clone den gesamten inneren Wert T?','Nein, es erstellt einen weiteren referenzzählenden Besitzer.','Mehrere Rc-Werte können auf dieselbe Ressource zeigen.'],
 ['Wird ein widersprüchlicher RefCell-Borrow schon immer zur Compile-Time verhindert?','Nein, RefCell prüft die aktive Ausleihe zur Laufzeit.','Ein Runtime-Konflikt kann panic auslösen.'],
 ['Warum ist Weak für einen Eltern-Rückverweis in einem Baum oft sinnvoll?','Es verhindert einen zusätzlichen starken Besitz und damit bestimmte Zyklen.','Das Upgrade liefert Option, weil der Zielwert bereits freigegeben sein kann.']
 ],
 exercise:'Modelliere zwei Besitzer eines gemeinsamen, nur lesbaren Konfigurationstextes mit Rc<String>. Ergänze einen schwachen Beobachter über Weak und zeige, wann upgrade None liefert. Begründe, weshalb Rc<RefCell<T>> nur bei tatsächlichem Mutationsbedarf eingesetzt werden sollte.',
 solution:'Erzeuge Rc::new(String::from("...")), zwei weitere Besitzer über Rc::clone und einen Beobachter via Rc::downgrade. Lass sämtliche starken Besitzer ihren Scope verlassen beziehungsweise drop sie; anschließend liefert weak.upgrade() None. Dokumentiere, dass RefCell die Ausleihregeln nur an die Runtime verschiebt, wenn veränderlicher Zugriff benötigt wird.'
},
{
 id:'rust-modules',title:'Rust: Crates, Module und Sichtbarkeitsgrenzen',
 source:'https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html',
 objectives:['Cargo-Package, Crate und Modul voneinander unterscheiden.','pub, use und Pfade bewusst als API-Grenzen nutzen.','Öffentliche Domänenverträge von interner Implementierung trennen.'],
 sections:[
 ['crate','Ein Package kann mehrere ausführbare und eine Library-Crate enthalten',
 'Cargo verwaltet Packages mit einem Manifest in Cargo.toml. Eine Crate ist die grundlegende Compiler-Einheit; in einem Package können beispielsweise ein Library-Crate und mehrere Binary-Crates liegen. Der Einstieg in src/lib.rs beziehungsweise src/main.rs beschreibt gewöhnlich die jeweilige Crate-Root. Diese Begriffe sind nicht austauschbar. Ein Repository kann ein einzelnes Package mit mehreren Binaries enthalten oder aus mehreren Packages in einem Workspace bestehen.',
 'Für eine Anwendung mit einer CLI und wiederverwendbarer Logik ist die Trennung in Library- und Binary-Crate hilfreich. Die Bibliothek kann Parser und Eventregeln anbieten; das Binary verarbeitet Argumente und zeigt Ergebnisse an. So lassen sich Fachregeln ohne Prozessargumente oder Konsolenausgabe testen. Ein Modul ist eine weitere Organisationsgrenze innerhalb einer Crate, nicht automatisch ein eigener Prozess oder eigenständiges Package.',
 '// src/lib.rs\npub mod events;\n// src/main.rs\nuse my_package::events::Event;',
 'Die Library-Crate stellt ein Modul bereit, das Binary kann die öffentliche API über den Crate-Namen benutzen.'],
 ['privacy','Sichtbarkeit folgt einem ausdrücklich beschriebenen Vertrag',
 'Rust-Items sind standardmäßig privat. Mit pub können Funktionen, Typen oder Module nach außen sichtbar gemacht werden, sofern auch der jeweilige Pfad zugänglich ist. Das verhindert, dass jedes Implementierungsdetail automatisch Teil des öffentlichen APIs wird. Wenn ein EventStore private Felder besitzt, muss ein Aufrufer die dafür vorgesehenen Methoden nutzen und kann die internen Invarianten nicht ohne Weiteres umgehen.',
 'Die Sichtbarkeitsregeln sind mehrstufig: Ein pub-Item in einem nicht öffentlich erreichbaren Modul wird nicht zwangsläufig direkt extern zugänglich. Für bestimmte Grenzen gibt es eingeschränkte Sichtbarkeiten wie pub(crate), die Zugriff innerhalb einer Crate ermöglichen. Wähle den kleinsten sinnvollen Bereich. Jedes öffentlich versprochene Item wird zu einem Vertrag, dessen Änderungen für andere Module oder Crates relevant sein können.',
 'mod internal { pub(crate) fn validate() {} }\npub fn check() { internal::validate(); }',
 'validate ist innerhalb der Crate sichtbar, die externe API erhält nur check.'],
 ['paths','use vereinfacht Namen, ändert aber keine Privatrechte',
 'Mit use kannst du einen Pfad in den aktuellen Bereich einführen. Das spart wiederholte lange Namen, macht aber ein privates Item nicht plötzlich öffentlich. Pfade können mit crate:: an der Wurzel der eigenen Crate beginnen, mit super:: auf einen übergeordneten Bereich verweisen oder mit self:: den aktuellen Bereich benennen. Die gewählte Form sollte die Modulstruktur nachvollziehbar halten, auch wenn mehrere Dateien zusammenwirken.',
 'Wenn eine Bibliothek oft verwendete Typen bereitstellen möchte, kann sie diese über pub use an einer klaren API-Stelle erneut exportieren. So müssen Nutzer nicht die gesamte interne Dateistruktur kennen. Gleichzeitig sollte man nicht wahllos alle internen Module reexportieren, denn das erschwert spätere Refactorings. Ein stabiles öffentliches API beschreibt die fachlichen Einheiten, nicht zwangsläufig die Verzeichnisstruktur jedes Implementierungsdetails.',
 'mod model { pub struct Event { pub id: String } }\npub use model::Event;\nlet event = Event { id: String::from("E1") };',
 'pub use stellt einen öffentlichen Zugriffspfad auf Event bereit, ohne den internen Modulnamen als Einstieg erzwingen zu müssen.'],
 ['workspaces','Cargo Workspaces für mehrere zusammenhängende Packages',
 'Wächst ein Rust-Projekt in Parser, CLI und Desktop-Hilfsdienst, können getrennte Packages in einem Cargo Workspace sinnvoll werden. Der Workspace kann gemeinsame Paketmetadaten, einen zusammenhängenden Lock-Zustand und ein gemeinsames Zielverzeichnis nutzen. Das erleichtert reproduzierbare Builds und Tests über mehrere Packages. Eine Aufteilung lohnt sich aber nur, wenn klare Paketgrenzen bestehen; ein einzelnes kleines Programm wird durch fünf Crates nicht automatisch professioneller.',
 'Beachte bei Abhängigkeiten die Richtung: Eine Kernbibliothek für Eventvalidierung sollte nicht von der CLI-Binärdatei abhängen, die sie aufruft. Ein Import aus einem anderen Package ist eine echte externe Crate-Abhängigkeit und muss im Manifest sichtbar sein. Nutze Cargo-Features und Versionsregeln bewusst; vermeide es, den gesamten Entwicklungsstack durch ungeprüfte globale Abhängigkeiten in jede Komponente zu ziehen. Reproduzierbarkeit beginnt bei einer nachvollziehbaren Struktur.',
 '# Cargo.toml Workspace-Skizze\n# [workspace]\n# members = ["crates/core", "crates/cli"]\n# resolver = "2"',
 'Ein Workspace organisiert Packages. Die Beispielzeilen sind auskommentiert, weil sie nur eine Manifest-Skizze darstellen.']
 ],
 checks:[
 ['Ist ein Rust-Modul zwangsläufig eine eigene Crate?','Nein.','Ein Modul organisiert Namensräume innerhalb einer Crate.'],
 ['Macht use ein eigentlich privates Item öffentlich?','Nein.','use führt einen Pfad ein, ändert aber nicht die grundlegende Sichtbarkeitsregel.'],
 ['Warum kann pub(crate) für interne Hilfsfunktionen sinnvoll sein?','Es ermöglicht Zugriff innerhalb der Crate, ohne das externe API auszudehnen.','Die öffentliche Schnittstelle bleibt kleiner und stabiler.']
 ],
 exercise:'Entwerfe ein Cargo-Projekt mit lib.rs, einem Modul domain::event und main.rs. Exponiere Event und eine Funktion create_event über einen stabilen öffentlichen Pfad, halte einen internen Validator privat. Erkläre, welche Namen über pub use exportiert werden und warum.',
 solution:'Definiere in lib.rs mod domain; pub use domain::event::Event; und eine passende public Factory. Der interne Validator bleibt pub(crate) oder privat, je nach benötigtem Bereich. main.rs nutzt die Bibliotheks-API statt internen Modulcode. Ein späterer Refactor der Dateistruktur kann den reexportierten Namen erhalten.'
},
{
 id:'rust-closures',title:'Rust: Closures, Captures und Fn-Trait-Verträge',
 source:'https://doc.rust-lang.org/book/ch13-01-closures.html',
 objectives:['Capture durch Referenz, Mutation und Move auseinanderhalten.','Fn, FnMut und FnOnce anhand des erlaubten Verhaltens erklären.','Closure-Callbacks sinnvoll an Iteratoren und APIs übergeben.'],
 sections:[
 ['capture','Ein Closure kann seine Umgebung verwenden',
 'Ein Rust-Closure kann Werte aus seinem umschließenden Scope erfassen. Die Capture-Art hängt davon ab, wie das Closure die Werte benutzt: reines Lesen über Referenz, Mutation über veränderliche Referenz oder Besitzübernahme. Anders als eine gewöhnliche Funktion kann ein Closure dadurch lokale Daten einer Factory in seinem Verhalten berücksichtigen. Das ist für Filterregeln, Sortierfunktionen und Callback-APIs nützlich. Zugleich verändert das Capture die Frage, wie lange die erfassten Daten leben müssen.',
 'Bei einer einfachen Predicate-Operation kann ein Closure eine Grenze wie minimum aus der Umgebung lesen. Die Iteration über ein Vec kann dann passende Werte auswählen, ohne dass minimum als zusätzlicher Parameter jeder Iterator-Methode übergeben werden muss. Die Stärke ist ein kleiner, präziser Vertrag; eine Closure, die wahllos großen äußeren Zustand verändert, ist dagegen schwerer zu testen und kann Ownership-Probleme verdecken.',
 'let minimum = 18;\nlet ages = vec![15, 18, 24];\nlet selected: Vec<_> = ages.into_iter().filter(|age| *age >= minimum).collect();\nassert_eq!(selected, vec![18, 24]);',
 'Das Closure liest minimum aus seiner Umgebung und entscheidet pro Element über die Filterregel.'],
 ['traits','Fn, FnMut und FnOnce sind verschiedene Fähigkeiten',
 'Rust beschreibt Aufrufverhalten über die Traits Fn, FnMut und FnOnce. Ein FnOnce-Closure kann beim Aufruf erfasste Werte konsumieren und ist damit möglicherweise nur einmal aufrufbar. FnMut erlaubt, den erfassten Zustand zu verändern. Fn beschreibt ein Aufrufverhalten, das keinen exklusiven verändernden Zugriff auf die Capture-Umgebung verlangt. Die Beziehungen zwischen diesen Traits bestimmen, welche Closure an welche API übergeben werden kann.',
 'Ein Closure, das einen String aus seiner Umgebung wegbewegt, kann als FnOnce geeignet sein. Ein Zähler, der bei jedem Aufruf erhöht wird, benötigt gewöhnlich FnMut. Die Wahl der Trait-Grenze ist Teil der API: Eine Funktion, die ihre Callback-Operation nur einmal ausführt, muss nicht zwangsläufig Fn verlangen. Zu starke Bounds würden passende Closures unnötig ausschließen. Ein guter generischer Vertrag fordert nur die tatsächliche Nutzungsart.',
 'let mut calls = 0;\nlet mut next = || { calls += 1; calls };\nassert_eq!(next(), 1);\nassert_eq!(next(), 2);',
 'Das Closure verändert eine erfasste Variable und besitzt damit eine FnMut-artige Anforderung.'],
 ['move','move verschiebt die Capture-Verantwortung',
 'Das Schlüsselwort move fordert, dass erfasste Werte in das Closure übernommen werden, sofern das jeweilige Typverhalten dies vorsieht. Das ist bei Thread-Start und längerlebigen Callbacks oft wichtig, weil die Closure nicht auf eine lokale Referenz zeigen darf, die vorher ungültig wird. Ein move-Closure ist dadurch nicht automatisch FnOnce: Der konkrete Fn-Trait hängt weiterhin davon ab, was es beim Aufruf mit den erfassten Werten tut. Lesen eines übernommenen Strings kann mehrfach möglich bleiben.',
 'Wenn du einen großen Vec allein wegen eines Callbacks bewegst, darf der ursprüngliche Besitzer ihn danach nicht einfach weiterverwenden. Bei gewünschtem geteiltem Besitz kann ein Arc oder anderes bewusstes Ownershipmodell nötig sein. Vermeide es, aus Unsicherheit alle Werte zu klonen, nur damit der Compiler zufrieden ist. Erkläre stattdessen, ob die neue Operation dauerhaft besitzen, nur leihen oder einen unabhängigen Zustand erhalten soll.',
 'let title = String::from("Ada");\nlet printer = move || println!("{title}");\nprinter();\nprinter();\n// title kann hier nicht mehr über den ursprünglichen Namen benutzt werden.',
 'Die Closure besitzt den String; da sie ihn nur liest, kann der Callback mehrfach aufgerufen werden.'],
 ['iterators','Ein Filter-Closure sollte möglichst ohne Seiteneffekte arbeiten',
 'Iteratoradapter wie filter und map erwarten Closures, deren Parameter- und Rückgabetypen zu den jeweiligen Operationen passen. Bei filter ist ein boolesches Ergebnis erforderlich, während map einen neuen Ergebniswert erzeugt. Eine Mutation von externem Zustand in solchen Closures kann die Lesbarkeit reduzieren und bei anderer Ausführungsstrategie überraschend werden. Häufig ist ein klarer collect-Schritt geeigneter als eine Schleife, die nebenbei mehrere andere Collections verändert.',
 'Wenn eine Transformation sehr kompliziert wird, extrahiere sie in eine benannte Funktion. Ein eigener Parser mit einem Result-Rückgabewert ist oft verständlicher als eine lange Closure mit unwrap, mehreren Zustandsvariablen und Fehlerunterdrückung. Der Lernwert liegt darin, die Typbeziehung zu verstehen: Welche Daten liefert der Iterator, welche Art Closure wird aufgerufen und was entsteht nach collect? So wird die funktionale Syntax zu einem Werkzeug statt zu einem Rätsel.',
 'let titles = vec!["Ada", "  ", "Kim"];\nlet selected: Vec<_> = titles.into_iter().map(str::trim).filter(|s| !s.is_empty()).collect();\nassert_eq!(selected, vec!["Ada", "Kim"]);',
 'Die Pipeline beschreibt eine reine Transformation und vermeidet das Verändern fremder Zustände.']
 ],
 checks:[
 ['Kann ein FnOnce-Closure grundsätzlich nur einmal ausgerufen werden?','Es ist nur mindestens einmalige Verwendung vertraglich erlaubt; ein konkretes Closure kann zusätzlich stärkere Traits erfüllen.','FnOnce ist die schwächste der drei Aufrufgarantien und kann konsumierende Captures erlauben.'],
 ['Macht move ein Closure automatisch zu FnOnce?','Nein.','Die Traitklasse hängt davon ab, wie die erfassten Werte beim Aufruf verwendet werden.'],
 ['Was unterscheidet filter und map bei Iteratoren?','filter entscheidet über Behalten, map transformiert jedes Element.','Die Callback-Rückgabetypen bilden zwei unterschiedliche Datenfragen ab.']
 ],
 exercise:'Schreibe eine Rust-Funktion filter_titles, die Titel trimmt, leere Strings ausblendet und eine neue Vec<String> erstellt. Verwende mindestens ein Closure, begründe die Wahl zwischen iter und into_iter und schreibe eine Variante mit einer erfassten Mindestlänge.',
 solution:'Für besessene Eingabe Vec<String> kann into_iter die Strings konsumieren; map(|s| s.trim().to_owned()) erzeugt neue Werte, filter(|s| !s.is_empty()) wählt aus, collect liefert Vec<String>. Für eine nur geliehene Quelle verwende iter und kopiere notwendige Ausgabewerte. Ein minLength-Parameter kann vom Filter-Closure erfasst werden.'
},
{
 id:'rust-sync',title:'Rust: Mutex, Arc, Send und sichere gemeinsame Zustände',
 source:'https://doc.rust-lang.org/book/ch16-03-shared-state.html',
 objectives:['Gemeinsamen Besitz und Synchronisation als getrennte Fragen behandeln.','Arc<Mutex<T>> nach Ownership und Sperrregeln erklären.','Send und Sync an der Grenze paralleler Ausführung verstehen.'],
 sections:[
 ['sharing','Mehrere Threads brauchen eine bewusste Ownershipstrategie',
 'Wenn zwei Threads auf denselben Zustand zugreifen sollen, reicht eine gewöhnliche lokale Referenz nicht in jeder Situation aus. Rust überprüft, ob Werte sicher zwischen Threads übertragen und gemeinsam genutzt werden dürfen. Arc<T> stellt atomar referenzzählenden Besitz bereit, der unter passenden Bedingungen über Threads hinweg geteilt werden kann. Er erzeugt aber keine automatische Sperre für beliebige Veränderungen der inneren Daten. Für veränderbaren gemeinsamen Zustand wird deshalb häufig eine zusätzliche Synchronisationsstrategie benötigt.',
 'Ein typisches Beispiel ist Arc<Mutex<Vec<Event>>>. Die Arc verteilt die Besitzverantwortung über mehrere Worker, während Mutex den Zugriff auf die Collection für jeweils eine aktive schreibende Operation koordiniert. Das kann für kleine gemeinsam genutzte Zustände sinnvoll sein, birgt aber auch Wartezeiten und Deadlocks. Nicht jede parallele Aufgabe benötigt gemeinsame Mutation: Oft können Worker unabhängige Ergebnisse berechnen und über Channels an einen Besitzer zurückgeben.',
 'use std::sync::{Arc,Mutex};\nlet shared = Arc::new(Mutex::new(vec![1,2]));\nlet second = Arc::clone(&shared);\nsecond.lock().unwrap().push(3);',
 'Arc modelliert mehrere Besitzer; Mutex schützt den veränderbaren Vec-Zugriff. unwrap ist in Produktionscode bei Lock-Poisoning bewusst zu behandeln.'],
 ['locks','Eine Sperre braucht einen kurzen, nachvollziehbaren Bereich',
 'Mutex::lock liefert ein Ergebnis, das eine Lock-Guard beinhaltet. Solange dieser Guard lebt, hält die Operation die Sperre. Beim Verlassen des Gültigkeitsbereichs wird der Guard freigegeben. Das ist erneut ein RAII-Prinzip: Ressourcenfreigabe wird an den Objekt-Scope gekoppelt. Halte den Sperrbereich so kurz wie sinnvoll, damit andere Threads nicht unnötig warten müssen. Eine lange Netzwerkanfrage unter einem Mutex kann die gesamte Anwendung ausbremsen.',
 'Das Lock-Ergebnis kann wegen Poisoning fehlschlagen, wenn ein Thread während einer aktiven Sperre panickt. Ein pauschales unwrap ist für Lernbeispiele bequem, darf aber in einer echten Fachanwendung nicht ohne Entscheidung über die Wiederherstellung übernommen werden. Lege fest, ob ein beschädigter Zustand sicher weiterverwendet, verworfen oder neu aufgebaut werden kann. Ein Mutex garantiert kontrollierten Zugriff, nicht die fachliche Korrektheit jeder im kritischen Bereich vorgenommenen Änderung.',
 'fn add(shared: &Mutex<Vec<i32>>, value: i32) {\n    let mut guard = shared.lock().expect("mutex poisoned");\n    guard.push(value);\n}',
 'Der Guard wird beim Funktionsende freigegeben. Bei Poisoning wird hier bewusst mit einer Nachricht gepanickt.'],
 ['traits','Send und Sync erklären wichtige Thread-Grenzen',
 'Send beschreibt grundsätzlich, dass ein Wert zwischen Threads übertragen werden darf. Sync beschreibt, dass geteilte Referenzen auf einen Typ unter passenden Bedingungen sicher zwischen Threads geteilt werden können. Diese Marker-Traits werden für viele Standardtypen automatisch abgeleitet, sofern ihre Bestandteile die Regeln erfüllen. Rc<T> ist beispielsweise nicht für die threadsichere Übertragung seiner Referenzzählung gebaut und deshalb nicht einfach eine Alternative zu Arc<T> in parallelen Worker-Strukturen.',
 'Ein Typ, der mutable geteilte Daten ohne Synchronisation zulässt, kann diese Eigenschaften nicht automatisch erfüllen. Rusts Typregeln verhindern viele Datenrennen zur Compile-Time, aber sie beweisen keine fachlich perfekte Reihenfolge von Operationen. Selbst mit Arc<Mutex<T>> kann eine Anwendung logisch falsch sein, wenn sie zwei getrennte Schritte ausführt, zwischen denen andere Threads den Zustand verändern. Definiere deshalb zusammengehörige Operationen innerhalb eines passenden, möglichst kleinen atomaren Fachvertrags.',
 'use std::sync::Arc;\nlet title = Arc::new(String::from("Ada"));\nlet copy = Arc::clone(&title);\nassert_eq!(copy.as_str(), "Ada");',
 'Gemeinsames Lesen eines Strings benötigt hier keine zusätzliche Mutex-Mutation.'],
 ['channels','Nachrichten können Zustandsbesitz zentralisieren',
 'Ein alternativer Entwurf lässt einen einzelnen Worker den eigentlichen Katalog besitzen. Andere Komponenten senden ihm Änderungswünsche über Channels und erhalten Antworten. So bleibt die Fachregel an einer zentralen Stelle, statt mehrere Threads direkt dieselbe Vec verändern zu lassen. Rusts Standardbibliothek bietet dafür mpsc-Channels. Die Übertragung von Werten folgt Ownership-Regeln: Ein gesendeter String kann in den Empfänger bewegt werden, der Sender verwendet den ursprünglichen Besitzer danach nicht mehr.',
 'Auch Channels brauchen Lebensdauerregeln. Wenn Sender verschwinden, kann der Empfänger über eine entsprechende Fehlerrückgabe erkennen, dass keine neuen Nachrichten mehr kommen. Ein dauerhaft blockierender Empfänger ohne Abschlussstrategie kann eine Anwendung festhängen lassen. Nutze deshalb klar definierte Stop-Signale, Scope-Grenzen und Ergebnisverträge. Die Wahl zwischen Mutex und Channel ist keine Frage von modern gegen alt, sondern von Datenfluss und Verantwortlichkeit.',
 'use std::sync::mpsc;\nlet (tx,rx) = mpsc::channel();\ntx.send(String::from("Ada")).unwrap();\nassert_eq!(rx.recv().unwrap(), "Ada");',
 'Der String wird durch den Channel übertragen. Die unwrap-Aufrufe setzen im Lernbeispiel eine erfolgreiche Verbindung voraus.']
 ],
 checks:[
 ['Macht Arc<T> einen beliebigen veränderbaren T-Inhalt automatisch synchronisiert?','Nein.','Arc regelt referenzzählenden Besitz; Mutation benötigt eine passende Synchronisation.'],
 ['Wofür ist der MutexGuard verantwortlich?','Für die kontrollierte Freigabe der aktiven Sperre am Scope-Ende.','RAII bindet die Sperrlebensdauer an das Guard-Objekt.'],
 ['Ist Rc<T> eine passende Standardlösung für gemeinsame Werte über mehrere Threads?','Nein, für passende threadfähige Referenzzählung wird typischerweise Arc<T> verwendet.','Rc verwendet keine threadsichere Zählerstrategie.']
 ],
 exercise:'Erzeuge einen gemeinsamen Zähler über Arc<Mutex<usize>> und starte mehrere Threads, die jeweils einmal inkrementieren. Warte über JoinHandles auf alle Threads. Beschreibe eine alternative Channel-Architektur, die die Zählung einem einzelnen Empfänger überträgt.',
 solution:'Erzeuge Arc::new(Mutex::new(0)), clone Arc pro thread::spawn(move || ...), rufe lock auf, erhöhe den Wert, verlasse den Guard-Scope und join alle Handles. Das Ergebnis wird nach dem Join gelesen. Alternativ senden Worker Inkrement-Nachrichten an einen Receiver, der den Zähler allein besitzt. Dokumentiere den Umgang mit Poisoning und Thread-Panics.'
},
{
 id:'rust-testing',title:'Rust: Unit-Tests, Integrationstests und Fehlerverträge',
 source:'https://doc.rust-lang.org/book/ch11-00-testing.html',
 objectives:['Unit- und Integrationstests nach Fachverhalten organisieren.','assert_eq, should_panic und Result-basierte Testfunktionen passend einsetzen.','Reproduzierbare Fehlerpfade ohne fragile Timing- oder Dateisystemannahmen absichern.'],
 sections:[
 ['unit','Ein Test überprüft ein beobachtbares Versprechen',
 'Rust unterstützt Tests über #[test] und cargo test. Ein Unit-Test in einem Modul kann bei passender Struktur auch interne Funktionen prüfen, während Tests im tests/-Verzeichnis gewöhnlich als getrennte Integrationstest-Crates gegen das öffentliche API arbeiten. Die richtige Wahl hängt davon ab, welcher Vertrag geschützt werden soll. Eine interne Parserregel kann direkt getestet werden, während die tatsächliche CLI-Verwendung einen umfassenderen Integrationstest verdient.',
 'Ein guter Test beschreibt seine Absicht im Namen und besitzt erwartete Werte, gegen die er überprüft wird. assert_eq vergleicht zwei Werte, assert prüft eine boolesche Bedingung. Allein zu testen, dass ein Ergebnis nicht leer ist, kann zu schwach sein, wenn eine bestimmte Eventliste mit genau zwei gültigen IDs erwartet wird. Nutze konkrete, reproduzierbare Daten statt zufällige Datenbankzustände oder die aktuelle Uhrzeit als verdeckte Voraussetzungen.',
 '#[test]\nfn filters_blank_titles() {\n    let titles = vec!["Ada", "  ", "Kim"];\n    let filtered: Vec<_> = titles.into_iter().filter(|s| !s.trim().is_empty()).collect();\n    assert_eq!(filtered, vec!["Ada", "Kim"]);\n}',
 'Der Test prüft den fachlich relevanten Inhalt und nicht nur die Existenz eines Ergebnisses.'],
 ['errors','Fehler lassen sich mit Result statt panic prüfen',
 'Eine Parserfunktion, die Result<T,E> zurückgibt, kann erfolgreich sein oder mit einem bestimmten Fehler abbrechen. Ein Test sollte beide Wege überprüfen. Mit assert!(result.is_err()) kontrollierst du zunächst die Fehlerseite; bei wichtigen Fachentscheidungen kann zusätzlich die genaue Fehlervariante überprüft werden. Ein unwrap in einem Test kann sinnvoll sein, wenn der Erfolgsfall ausdrücklich erwartet wird und jede Abweichung den Test fehlschlagen lassen soll.',
 'Eine Testfunktion darf außerdem Result<(),E> zurückgeben und ? verwenden, um Fehler als Testfehlschlag weiterzureichen. Das ist praktisch bei Dateioperationen im Setup. should_panic ist für bestimmte ausdrücklich panikartige Verträge verfügbar, aber nicht der richtige Standardtest für gewöhnliche ungültige Nutzereingaben. Für solche Eingaben ist ein Result-Fehler meist die klarere fachliche Vereinbarung.',
 'fn parse_count(s: &str) -> Result<u32, std::num::ParseIntError> {\n    s.parse::<u32>()\n}\n#[test]\nfn rejects_non_numbers() {\n    assert!(parse_count("x").is_err());\n}',
 'Die Fehlervariante ist ein reguläres Ergebnis und keine absichtlich ausgelöste Panic.'],
 ['integration','Integrationstests betrachten die öffentliche Grenze',
 'Ein Test im tests/-Verzeichnis wird als eigenes Test-Crate gebaut und importiert die Bibliothek über ihren Crate-Namen. Damit lassen sich öffentliche Funktionen gegen realistischere Aufrufmuster prüfen, ohne von privaten Implementierungsdetails abhängig zu sein. Ein Refactoring der internen Modulstruktur sollte nicht alle Integrationstests zerbrechen, solange das öffentliche Verhalten unverändert bleibt. Das macht sie zu einer guten Schutzschicht für längerlebige Bibliotheken.',
 'Bei Dateizugriffen benötigen Tests kontrollierte, voneinander getrennte temporäre Verzeichnisse. Wenn zwei Tests dieselbe globale Datei beschreiben, können sie je nach paralleler Reihenfolge unterschiedlich ausfallen. Nutze eindeutige Testpfade und räume Ressourcen nach dem Test auf. Ein Test soll möglichst nicht von Internet, aktuellem Benutzernamen oder den privaten Dateien eines Entwicklers abhängen. Reproduzierbarkeit ist ein Qualitätsmerkmal, kein nachträglicher Luxus.',
 '// tests/catalog.rs\n// use my_library::normalize_title;\n// #[test]\n// fn normalizes_whitespace() {\n//     assert_eq!(normalize_title(" Ada "), "Ada");\n// }',
 'Die auskommentierte Skizze zeigt die Form eines separaten Integrationstests gegen ein öffentliches Library-API.'],
 ['property','Grenzen und Invarianten systematisch wählen',
 'Viele Fehler liegen an Grenzen: 0, 1, Maximalwert, leere Collection, fehlendes Feld und doppelte ID. Anstatt nur den schönsten Erfolgsfall zu testen, leite diese Fälle aus der Fachregel ab. Wenn eine Liste eindeutig sein soll, prüfe zwei Einträge mit derselben ID und die genaue Konfliktentscheidung. Wenn ein Datum ab heute gültig ist, prüfe gestern, heute und morgen mit festem Stichtag. Solche Tests dokumentieren, was die Anwendung verspricht.',
 'Eigenschaftsbasierte Tests können viele Eingaben variieren und nach allgemeinen Regeln suchen, benötigen dafür aber geeignete zusätzliche Werkzeuge. Für das Verständnis ist der erste Schritt eine präzise Invariante: Nach jeder erfolgreich ausgeführten Reservierung darf booked <= capacity gelten. Ob der Algorithmus danach geändert wird, spielt für diesen Test keine Rolle. Ein Test, der denselben Implementierungsalgorithmus kopiert, kann dagegen dessen Fehler unabsichtlich ebenfalls reproduzieren.',
 'fn can_book(capacity: u32, booked: u32, requested: u32) -> bool {\n    booked <= capacity && requested > 0 && requested <= capacity - booked\n}\n#[test]\nfn never_overbooks() { assert!(!can_book(10, 9, 2)); }',
 'Die Rechnung vermeidet Überlauf durch vorherige Grenzprüfung und testet eine konkrete Fachinvariante.']
 ],
 checks:[
 ['Welche Rolle hat ein Test im tests/-Verzeichnis typischerweise?','Er prüft das öffentliche API einer Bibliothek aus einer separaten Test-Crate.','Interne Refactorings sollen den externen Vertrag nicht unnötig verändern.'],
 ['Ist should_panic die einzige sinnvolle Prüfung ungültiger Nutzereingaben?','Nein.','Result-Fehlerfälle können differenzierter und fachlich klarer getestet werden.'],
 ['Weshalb sollte ein Test für das Datum einen festen Stichtag verwenden?','Damit sein Ergebnis unabhängig vom tatsächlichen Ausführungszeitpunkt ist.','Zeitabhängige Grenzfälle müssen reproduzierbar sein.']
 ],
 exercise:'Schreibe eine Rust-Funktion reserve(capacity, booked, requested)->Result<u32,ReserveError>. Teste 0, negative Fälle soweit der Typ sie erlaubt, volle Kapazität und Überlaufnähe sowie eine erfolgreiche Reservierung. Formuliere die Invariante, die nach jeder erfolgreichen Operation gelten muss.',
 solution:'Prüfe booked<=capacity, requested>0 und requested<=capacity-booked vor der Addition. Gib ein klares Err bei Verletzung der Fachregel zurück und sonst Ok(booked+requested). Bei u32 sind negative Eingaben bereits typseitig ausgeschlossen; teste daher die Grenzen 0, u32::MAX und volle Belegung. Nach Erfolg gilt bookedNeu<=capacity.'
}
];
export const RUST_STANDARD_LIBRARY_VOLUME:readonly AuthoredLesson[]=MANUSCRIPTS.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:35,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({id,title,paragraphs:[first,second],code,annotation})),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:'rust',name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Ein Originalbeispiel zu Rust-Ownership und Standardbibliotheksverträgen; die vier Lehrabschnitte erläutern konkrete Auswirkungen und typische Fehlannahmen.',
  differences:'Rust modelliert Besitz, Lifetime und Nebenläufigkeit ausdrücklich im Typsystem, was weder direkte Java-GC-Semantik noch beliebige Runtime-Aliasing-Regeln bedeutet.',
  equivalence:'related',docs:item.source
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
