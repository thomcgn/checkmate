import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';
type Section=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type Check=readonly [question:string,answer:string,reason:string];
type Manuscript={id:string;title:string;source:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Check[];exercise:string;solution:string};
/** Original Checkmate TypeScript textbook manuscript. Each chapter references official TypeScript docs. */
const MANUSCRIPTS:readonly Manuscript[]=[
{
 id:'ts-object-model',title:'TypeScript: strukturelle Typisierung, Interfaces und Objektverträge',
 source:'https://www.typescriptlang.org/docs/handbook/2/objects.html',
 objectives:['Strukturelle Zuweisbarkeit von nominaler Identität unterscheiden.','Optionale und readonly Properties samt Grenzen verstehen.','Excess Property Checks und Laufzeitvalidierung korrekt einordnen.'],
 sections:[
 ['structure','Die Form zählt, nicht der Klassenname',
 'TypeScript ist grundsätzlich strukturell typisiert. Ein Wert kann zu einem Objekttyp passen, wenn er die benötigten Properties mit kompatiblen Typen besitzt. Es ist nicht zwingend nötig, dass seine Klasse einen bestimmten Namen trägt oder ausdrücklich ein Interface implementiert. Eine Funktion mit dem Parameter {title:string} kann daher sowohl ein Objektliteral als auch einen umfangreicheren Eventdatensatz akzeptieren. Diese Fähigkeit passt gut zu JavaScript mit seinen vielen anonymen Objektwerten, verlangt aber ein klares Verständnis der tatsächlich benötigten Feldstruktur.',
 'Strukturelle Zuweisbarkeit ist eine Aussage des TypeScript-Compilers. Sie erzeugt zur Laufzeit keine Java-ähnliche Klassenprüfung und verifiziert nicht automatisch eingelesenes JSON. Eine API, die ein Event erwartet, sollte fremde Werte deshalb an der Eingangsgrenze prüfen. Innerhalb des geprüften Anwendungscodes kann das Interface dann präzise dokumentieren, welche Felder eine Operation benötigt, ohne ihre konkrete Herkunft zu erzwingen.',
 'interface Titled { title: string }\nfunction label(value: Titled): string { return value.title; }\nconst event = { title: "Ada", id: "E1" };\nconsole.log(label(event));',
 'Das zusätzliche id-Feld hindert den bereits typisierten Wert nicht daran, den Titled-Vertrag zu erfüllen.'],
 ['optional','Optional bedeutet möglicherweise nicht vorhanden',
 'Mit einem Fragezeichen lässt sich eine Property optional deklarieren. Für ein Interface Event mit description?: string muss deshalb berücksichtigt werden, dass event.description fehlen kann. Bei einem normalen Zugriff ergibt sich eine Vereinigung mit undefined; eine Methode wie toUpperCase darf erst nach passender Prüfung aufgerufen werden. Ein optionales Feld ist fachlich nicht dasselbe wie ein verpflichtendes Feld mit leerem String: Beide Situationen können unterschiedliche Entscheidungen in der Benutzeroberfläche auslösen.',
 'Die genaue Zuweisbarkeit von explizitem undefined zu optionalen Properties hängt auch von Compileroptionen wie exactOptionalPropertyTypes ab. Eine API sollte nicht unbewusst zwischen fehlendem Schlüssel und ausdrücklich gesetztem undefined wechseln, wenn diese Unterscheidung für Speicherung oder Updates relevant ist. Ein Patch-Objekt kann mit optionalen Feldern sinnvoll sein, benötigt aber eine definierte Bedeutung: Soll fehlend unverändert heißen, während null bewusst löschen bedeutet? Solche Regeln entstehen nicht aus der Syntax allein.',
 'interface Event { id: string; description?: string }\nfunction description(value: Event): string {\n  return value.description?.trim() ?? "Keine Beschreibung";\n}',
 'Optional Chaining und Nullish Coalescing behandeln den möglicherweise fehlenden Text ohne unbelegte Assertion.'],
 ['readonly','readonly begrenzt Zuweisungen im Typsystem',
 'Ein readonly-Feld darf durch typisierten Code nicht beliebig neu zugewiesen werden. Das macht Konfigurations- und Domänenmodelle leichter verständlich. Der Modifikator verwandelt das JavaScript-Objekt aber nicht automatisch in ein zur Laufzeit eingefrorenes Objekt. Auch verschachtelte Werte sind nicht tief geschützt. Wenn ein readonly-Feld auf eine mutable ArrayList-artige JavaScript-Collection zeigt, kann diese weiterhin über ihren eigenen Vertrag verändert werden.',
 'Bei Daten, die sich über mehrere Komponenten teilen, ist deshalb ein klares Mutabilitätsmodell wichtig. Ein neuer Zustand kann durch Kopieren eines Objekts und Ersetzen seiner Felder erzeugt werden, doch Object Spread ist nur eine flache Kopie. Wer ein verschachteltes Objekt weiterreicht, teilt dessen Referenz möglicherweise weiterhin. Ein solider API-Vertrag unterscheidet die Compile-Time-Zuweisungsregel, die Laufzeitidentität und die fachliche Erwartung einer unabhängigen Momentaufnahme.',
 'interface Config { readonly theme: string; readonly tags: string[] }\nconst config: Config = { theme: "dark", tags: [] };\nconfig.tags.push("new");\n// config.theme = "light"; // Compilerfehler',
 'readonly schützt die Property-Zuweisung, nicht automatisch die Mutationsmethoden einer referenzierten Liste.'],
 ['literals','Objektliterale werden teilweise strenger kontrolliert',
 'TypeScript prüft direkt an eine erwartete Form übergebene Objektliterale häufig auf zusätzliche unbekannte Eigenschaften. Ein Schreibfehler wie titel statt title fällt dadurch an der Aufrufstelle auf. Wird ein Objekt zunächst in einer Variablen gehalten, greifen die strukturellen Zuweisungsregeln an vielen Stellen anders: Zusätzliche Felder sind dann grundsätzlich erlaubt, sofern die erforderlichen Felder passen. Das ist keine inkonsistente Sicherheitsgarantie, sondern ein spezieller Mechanismus zum Auffinden häufiger Tippfehler.',
 'Wer aus dieser Prüfung ableitet, dass TypeScript beliebige Laufzeitobjekte strikt auf eine exakte Liste von Feldern beschränkt, irrt. Ein unbekannter JSON-Wert kann weiterhin zusätzliche oder fehlende Properties besitzen. Für einen Import ist ein expliziter Parser erforderlich, der die erlaubten Felder prüft und ein neues sauberes Eventobjekt erzeugt. Die korrekte Trennung lautet: Der Compiler kontrolliert typisierten Quellcode, die Laufzeitvalidierung kontrolliert tatsächlich eintreffende Daten.',
 'function show(value: {title: string}) { console.log(value.title); }\nshow({title: "Ada"});\n// show({title: "Ada", titel: "Fehler"}); // unnötiges Feld',
 'Direkte frische Objektliterale erhalten eine zusätzliche Prüfung auf überraschende Eigenschaften.']
 ],
 checks:[
 ['Muss ein TypeScript-Objekt eine bestimmte Klasse erweitern, um ein passendes Interface zu erfüllen?','Nein.','Die Typkompatibilität basiert weitgehend auf der benötigten Struktur.'],
 ['Macht readonly eine geschachtelte Array-Property zur Laufzeit tief unveränderlich?','Nein.','Readonly beschränkt primär die typisierten Zuweisungen; der referenzierte Inhalt kann mutable bleiben.'],
 ['Ersetzt der Excess Property Check die Validierung unbekannter JSON-Daten?','Nein.','Er ist eine Compile-Time-Prüfung bestimmter Quelltextformen, kein vollständiger Runtime-Validator.']
 ],
 exercise:'Entwirf die Interfaces Event und EventPatch mit verpflichtender ID, optionaler Beschreibung und readonly-Eigenschaften. Lege eine klare Regel für fehlend, undefined und null in Patch-Daten fest und schreibe einen Parser, der unbekannte JSON-Eingaben nicht blind als Event behauptet.',
 solution:'Definiere beispielsweise Event mit readonly id:string und description?:string. Wähle für EventPatch ausdrücklich, ob null eine Löschung und fehlend keine Änderung bedeutet. Prüfe beim Import typeof raw, null, Arrays und die Typen der Felder, bevor ein neues Event konstruiert wird. Verwende nicht as Event als Ersatz für die Prüfung.'
},
{
 id:'ts-utility-types',title:'TypeScript: Utility Types, Mapped Types und Conditional Types',
 source:'https://www.typescriptlang.org/docs/handbook/utility-types.html',
 objectives:['Pick, Omit, Partial und Readonly aus konkreten Datenverträgen ableiten.','Mapped Types als Transformation von Objektproperties lesen.','Conditional Types und distributives Verhalten von Unions erklären.'],
 sections:[
 ['utility','Utility Types leiten neue Typen aus bestehenden ab',
 'Ein Event besitzt möglicherweise viele Felder, doch ein Listen-Element soll nur id und title anzeigen. Mit Pick<Event,"id"|"title"> lässt sich diese Auswahl als abgeleiteter Typ ausdrücken, ohne die beiden Feldtypen erneut abzuschreiben. Omit entfernt ausgewählte Properties aus einem Typ, Partial macht Properties optional und Readonly kennzeichnet sie als nur lesbar. Solche Utility Types reduzieren widersprüchliche Doppeldefinitionen, wenn sich das zugrunde liegende Modell später verändert.',
 'Eine Typtransformation ist jedoch keine Laufzeitprojektion. Wenn du einen umfangreichen Eventdatensatz in einer HTTP-Antwort tatsächlich auf id und title beschränken willst, musst du ein neues Objekt mit diesen zwei Properties erzeugen. Pick sorgt nur dafür, dass der Compiler die erwartete Form des Ergebnisses kontrollieren kann. Wer eine Datenbankantwort als Pick behauptet, obwohl die übrigen vertraulichen Felder weiterhin enthalten sind, hat keine Sicherheit geschaffen.',
 'interface Event { id: string; title: string; capacity: number }\ntype EventPreview = Pick<Event, "id" | "title">;\nconst preview: EventPreview = {id: "E1", title: "Workshop"};',
 'Der abgeleitete Typ enthält nur die zwei vorgesehenen Felder; eine reale Projektion der Laufzeitdaten bleibt separat nötig.'],
 ['mapped','Mapped Types iterieren über Eigenschaften auf Typebene',
 'Ein Mapped Type kann die Schlüssel eines Typs mit K in keyof T durchlaufen und aus den zugehörigen Werttypen neue Properties bilden. Das erinnert syntaktisch an eine Schleife, ist aber keine Schleife zur Laufzeit. Die Konstruktion { [K in keyof T]: T[K] } bildet die Eigenschaftsstruktur eines Typs ab. Mit Modifikatoren können dabei readonly oder optionale Kennzeichnungen hinzugefügt oder entfernt werden. Für umfangreiche API-Modelle hilft das, Regeln konsistent zu formulieren.',
 'Achte darauf, nicht ohne Grund aus jedem einfachen Typ ein eigenes Mapped-Type-Rätsel zu machen. Ein verständlicher Typname und eine direkte Schnittstelle sind oft besser, wenn nur zwei oder drei stabile Felder gebraucht werden. Mapped Types verdienen ihren Platz, wenn eine echte Transformation über viele Felder wiederverwendet wird. Das Ziel ist, Typbeziehungen klarer und sicherer zu machen, nicht die komplizierteste mögliche Schreibweise zu produzieren.',
 'type Mutable<T> = { -readonly [K in keyof T]: T[K] };\ninterface Model { readonly id: string; readonly title: string }\ntype Editable = Mutable<Model>;',
 'Der Modifikator -readonly verändert die typisierte Zuweisungsregel auf der Typebene. Er führt keine Runtime-Kopie aus.'],
 ['conditional','Conditional Types treffen Entscheidungen über Typbeziehungen',
 'Ein Conditional Type wie T extends string ? "text" : "other" liefert je nach eingesetztem Typ eine unterschiedliche Form. Das ist nützlich, wenn eine API-Rückgabe strukturell von der Eingabe abhängt. Solche Entscheidungen werden zur Übersetzungszeit getroffen und erzeugen keinen regulären if-Zweig in JavaScript. Der Compiler muss die Typbeziehungen auswerten; eine Runtime-Eingabe bleibt weiterhin ein unbekannter Wert, bis der Code sie geprüft hat.',
 'Bei einem generischen Conditional Type mit einem nackten Typparameter wird eine Union häufig distributiv verarbeitet: Jeder Unionbestandteil wird einzeln ausgewertet und die Ergebnisse werden wieder vereinigt. Mit einer Tupelumhüllung wie [T] extends [U] lässt sich dieses Verhalten gezielt verhindern. Das ist besonders relevant beim Entwurf eigener Utility Types. Ohne ein gutes Verständnis der Verteilung kann der Typ ein anderes Ergebnis liefern als intuitiv erwartet.',
 'type Label<T> = T extends string ? "text" : "other";\ntype A = Label<string | number>; // "text" | "other"\ntype B<T> = [T] extends [string] ? "text" : "other";\ntype C = B<string | number>; // "other"',
 'A verteilt den Conditional Type über die Union; die Tupelumhüllung in B verhindert diese Verteilung.'],
 ['limits','Übermäßig komplexe Typen können Wartbarkeit schädigen',
 'Die TypeScript-Typmaschine kann sehr komplexe Beziehungen ausdrücken, ist aber kein Ersatz für Datenmodellierung oder Runtime-Tests. Ein bedingter Typ, dessen Ausgabe ein anderer Entwickler kaum nachvollziehen kann, kann mehr Kosten als Nutzen verursachen. Eine API sollte weiterhin kleine, fachlich verständliche Contracts benutzen. Wenn eine Funktion lediglich die id eines Events prüft, braucht sie oft keine verschachtelte Conditional-Type-Bibliothek, sondern einen einfachen Constraint und einen passenden Rückgabewert.',
 'Utility Types können zudem fachlich unpassende Modelle erzeugen. Ein Partial<Event> macht alle Properties optional, obwohl in einem Patch vielleicht einige Felder nie verändert werden dürfen. Eine präzisere Form ist dann Pick oder Omit plus ein eigener Updatevertrag. Der Compiler kann die Typstruktur prüfen, nicht entscheiden, ob eine Fachregel wie unveränderliche Event-ID sinnvoll ist. Diese Entscheidung muss in der Domäne getroffen und durch gezielte Tests gesichert werden.',
 'type EventPatch = Partial<Pick<Event, "title" | "capacity">>;\nconst change: EventPatch = {title: "Neu"};',
 'Die ID bleibt außerhalb des Patchvertrags, obwohl das ursprüngliche Event sie besitzt.']
 ],
 checks:[
 ['Verändert Pick<Event,"id"> den Laufzeitinhalt des Objekts?','Nein.','Pick ist eine reine Typtransformation; sensible Felder müssen im Runtime-Code wirklich entfernt werden.'],
 ['Was beschreibt [K in keyof T] in einem Mapped Type?','Eine Transformation über die Eigenschaftsnamen von T.','Die Konstruktion wirkt zur Compile-Time, nicht als JavaScript-Schleife.'],
 ['Warum kann [T] extends [U] statt T extends U relevant sein?','Die Tupelumhüllung verhindert die distributive Auswertung über Unions.','Conditional Types können ansonsten für jeden Unionbestandteil einzeln wirken.']
 ],
 exercise:'Baue aus Event{id,title,capacity,createdAt} einen EventPreview-Typ und einen EventPatch, der nur title und capacity ändern darf. Verwende Pick, Omit oder Partial sinnvoll und schreibe echte Projektionsfunktionen, die zur Laufzeit ausschließlich erlaubte Felder weitergeben.',
 solution:'Nutze type EventPreview=Pick<Event,"id"|"title"> und type EventPatch=Partial<Pick<Event,"title"|"capacity">>. Implementiere toPreview(event) mit return {id:event.id,title:event.title}; eine bloße as-Assertion entfernt keine zusätzlichen Felder. Validiere externe Patch-Eingaben separat als unknown.'
},
{
 id:'ts-modules',title:'TypeScript: Module, ESM und auflösbare Imports',
 source:'https://www.typescriptlang.org/docs/handbook/modules/reference.html',
 objectives:['ESM-Importe, Type-only-Importe und Runtime-Dateien unterscheiden.','moduleResolution nach Node- und Bundler-Zielumgebung auswählen.','Paket-Exports und Dateiendungen bei cross-platform Builds nachvollziehen.'],
 sections:[
 ['esm','Typinformationen und Laufzeitmodule sind nicht identisch',
 'Mit import und export können TypeScript-Dateien Module bilden. Nach dem Kompilieren müssen ihre ausgegebenen JavaScript-Module in der tatsächlich verwendeten Laufzeit auffindbar sein. Ein TypeScript-Import kann statisch korrekt typisiert sein und trotzdem zur Laufzeit scheitern, wenn der erzeugte Dateiname, die Endung oder die Modulauflösung nicht zum Host passt. Diese Grenze ist in Electron besonders wichtig, weil Main-Prozess, Preload und Renderer unter verschiedenen Laufzeitregeln laufen können.',
 'Ein Type-only-Import wie import type { Event } from "./event.js" dokumentiert, dass ausschließlich eine Typinformation verwendet wird. Die Typinformation wird bei der Ausgabe normalerweise entfernt und erzeugt keinen gewöhnlichen Laufzeitimport. Ein zur Laufzeit benötigter Funktionswert muss dagegen regulär importiert werden. Wer beide Arten vermischt, bekommt typische Fehler: Der Compiler kennt den Typ, aber der ausführbare JavaScript-Code besitzt nicht den gewünschten Wert.',
 'import type { Event } from "./event.js";\nimport { normalizeTitle } from "./validation.js";\nfunction label(event: Event): string { return normalizeTitle(event.title); }',
 'Event ist nur ein Typ; normalizeTitle wird zur Laufzeit wirklich benötigt. Die Beispieldateien müssen zur Buildstruktur passen.'],
 ['resolution','TypeScript ahmt das Auflösungsverhalten des Zielhosts nach',
 'module und moduleResolution sind keine voneinander unabhängigen Geschmacksoptionen. Node.js und ein Bundler können Module und Dateiendungen auf unterschiedliche Weise auflösen. Für ein direkt in Node ausgeführtes ESM-Projekt sind NodeNext-Regeln häufig passend; eine rein gebündelte Browseranwendung nutzt oft bundler-Auflösung. Entscheidend ist, welche JavaScript-Dateien nach dem Build wirklich von welchem Host geladen werden. Falsche Optionen können einen lokal funktionierenden Entwicklungsmodus erzeugen, dessen Produktionsbuild später scheitert.',
 'Gerade bei Paketabhängigkeiten spielen package.json-Felder wie exports, imports und type eine Rolle. Ein Paket kann verschiedene ESM- und CommonJS-Einstiegspunkte besitzen und dazu passende Typdeklarationen bereitstellen. TypeScript versucht, diese Beziehungen korrekt abzubilden. Deshalb solltest du nicht allein durch Umbenennen von .ts-Dateien oder das Entfernen von Endungen Module reparieren. Beginne mit dem gewählten Zielhost und prüfe anschließend, ob dessen Regeln im Projekt konsequent umgesetzt sind.',
 '// tsconfig-Auszug für ein Node-ESM-Projekt:\n{\n  "compilerOptions": {\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "strict": true\n  }\n}',
 'Die Konfiguration orientiert sich an Node-ESM-Auflösung. Bundlerprojekte brauchen möglicherweise andere Optionen.'],
 ['paths','TypeScript-Aliasse erzeugen nicht automatisch Runtime-Aliasse',
 'Der Compiler kann über paths oder ähnliche Konfigurationen zusätzliche TypeScript-Auflösungen kennen. Das bedeutet nicht, dass Node.js denselben Alias im ausgegebenen JavaScript automatisch erkennt. Bei einer Electron-Anwendung kann ein Import über einen Alias im Type Checker funktionieren, aber beim tatsächlichen Start in einem nicht gebündelten Prozess scheitern. Die Laufzeit, der Bundler oder ein passender Loader muss denselben Vertrag unterstützen.',
 'Für eine große Codebasis lohnt eine klare Struktur: Gemeinsame DTO-Typen dürfen von Main und Renderer genutzt werden, aber Browsercode sollte keine Node-only-Runtime-Module importieren. Ein Type-only-Import ist dabei nicht automatisch eine Sicherheitsstrategie, wenn die eigentliche Laufzeitabhängigkeit an anderer Stelle ungeschützt bleibt. Schaffe klare Abhängigkeitsrichtungen und prüfe, welche Module in den jeweiligen Prozess gelangen dürfen.',
 'import type { RepoSummary } from "../shared/contracts.js";\n// Ein Renderer sollte keinen freien Import von node:fs als Runtime-Abhängigkeit benötigen.',
 'Der geteilte Vertrag beschreibt Daten. Dateioperationen gehören in den dafür vorgesehenen Prozess.'],
 ['build','Ein Produktionsbuild muss den tatsächlichen Host berücksichtigen',
 'Ein erfolgreicher TypeScript-Typecheck beweist nicht, dass ein Electron-Paket korrekt startet. Die Laufzeit muss die importierten JavaScript-Dateien tatsächlich finden, und ein Renderer benötigt die richtigen gebündelten Assets. Auch die Pfade zu Konfiguration und Daten können sich zwischen Dev-Server und verpackter Anwendung unterscheiden. Deshalb sollten Build- und Deploymentkonventionen zusammen dokumentiert werden. Die korrekte Modulstrategie ist Teil der Architektur und nicht nur eine zufällige tsconfig-Datei.',
 'Wähle sinnvolle Modulgrenzen, damit Codetests und fachliche Inhalte ohne Electron-Prozess ausgeführt werden können. Ein reiner Parser benötigt keine Fensterinstanz, keine Node-Filesystem-Rechte und keine Cloudverbindung. Der Main-Prozess kann dagegen einen sicheren IPC-Vertrag zum Dateiimport bereitstellen. Solche Grenzen reduzieren Fehler bei Plattformwechseln und machen Abhängigkeiten sichtbarer, ohne dass für jede Klasse ein eigener Microservice nötig wäre.',
 'export type ParseResult<T> = {ok:true; value:T} | {ok:false; error:string};\nexport function ok<T>(value:T):ParseResult<T> { return {ok:true,value}; }',
 'Das Modul ist unabhängig von Node und DOM und kann dadurch von mehreren Programmbereichen genutzt werden.']
 ],
 checks:[
 ['Wird ein reiner import type beim Kompilieren als regulärer Runtime-Import benötigt?','Nein.','Der importierte Typ existiert im erzeugten JavaScript nicht als normaler Wert.'],
 ['Erzeugt tsconfig paths automatisch einen Node.js-Laufzeitalias?','Nein.','Laufzeit oder Buildprozess müssen die Auflösung ebenfalls unterstützen.'],
 ['Ist moduleResolution beliebig unabhängig vom Zielhost wählbar?','Nein.','Die Konfiguration sollte die Modulauflösung des tatsächlichen Hosts nachbilden.']
 ],
 exercise:'Ordne ein Electron-Projekt in main, preload, renderer und shared. Lege fest, wo eine Datei gelesen werden darf, wo nur der Typ einer IPC-Antwort importiert wird und wann NodeNext beziehungsweise bundler-Auflösung benötigt wird. Erkläre, warum eine tsconfig-Aliasdefinition nicht allein genügt.',
 solution:'Erzeuge shared/contracts.ts nur mit Datentypen, Main mit Node-Dateizugriff, Preload als kontrollierte Bridge und Renderer mit UI-Code. Nutze import type für reine Verträge. Konfiguriere die Modulauflösung passend zu jedem Build-Ziel; bundler für gebündelte Renderer-Ausgabe, NodeNext dort, wo Node das ausgegebene ESM direkt lädt. Runtime-Pfade müssen vom tatsächlichen Host erkannt werden.'
},
{
 id:'ts-node-fs',title:'TypeScript: Node-Dateisystem, Laufzeitvalidierung und IPC-Grenzen',
 source:'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
 objectives:['Node-Dateioperationen von Browser-APIs trennen.','JSON unbekannter Herkunft als unknown prüfen.','IPC-Antworten und Datei-Fehlerzustände als explizite Verträge gestalten.'],
 sections:[
 ['node','Ein Dateisystemzugriff gehört in die passende Laufzeit',
 'Die Node.js-Laufzeit kann über node:fs/promises Dateien lesen und schreiben. Ein normaler Browser-Renderer soll diese Befugnis in einer sicheren Electron-Architektur nicht unkontrolliert erhalten. Für eine Desktop-Anwendung ist daher die Prozessaufteilung wichtig: Main besitzt privilegierte Operationen; der Renderer benötigt nur eine schmale, überprüfbare Bridge für erlaubte Aktionen. TypeScript hilft beim Modellieren dieser Bridge, ersetzt aber nicht die Sicherheitskonfiguration oder tatsächliche Zugriffskontrolle.',
 'Ein Promise<string> als Rückgabetyp aus readFile bedeutet, dass der Type Checker die erwartete Ausgabe kennt. Eine Datei kann dennoch nicht existieren, unlesbar sein oder falsche Daten enthalten. Deshalb müssen technische Datei-Fehler vom erfolgreichen Einlesen ungültiger Inhalte unterschieden werden. Ein Benutzer soll nicht einfach die Meldung erhalten, dass kein Inhalt gefunden wurde, wenn tatsächlich ein Berechtigungsfehler aufgetreten ist.',
 'import {readFile} from "node:fs/promises";\nasync function readText(path:string):Promise<string> {\n  return readFile(path, "utf8");\n}',
 'Dieser Code gehört in einen Node-berechtigten Prozess. Ein Renderer benötigt eine kontrollierte Anwendungsschnittstelle.'],
 ['unknown','Ein JSON-Parser liefert keine geprüfte Domäne',
 'JSON.parse kann primitive Werte, Arrays, Objekte und null liefern. TypeScript-Interfaces werden zur Laufzeit nicht automatisch gegen diese Form geprüft. Ein unbekannter JSON-Text kann eine falsche ID, eine Zahl als Titel oder einen ganz anderen Datensatz enthalten. Deshalb sollte der Aufrufgrenzwert zunächst unknown sein. Ein Parser prüft dann die tatsächlichen Felder und erzeugt ein neues, verlässlicheres Domänenobjekt.',
 'Der Einsatz von as Event ist gerade hier gefährlich. Er sagt dem Compiler, dass die Form bereits stimmt, ohne den Wert zu verändern. Auch eine generische Funktion readJson<T>() könnte leicht ein falsches Versprechen erzeugen, wenn sie keine Runtime-Validierung durchführt. Ein ehrlicher API-Vertrag lautet readJson():Promise<unknown> oder akzeptiert eine gesonderte Parserfunktion, die einen geprüften Typ liefert.',
 'type Event = {id:string;title:string};\nfunction parseEvent(raw:unknown):Event {\n  if (!raw || typeof raw!=="object" || Array.isArray(raw)) throw Error("not an event");\n  const data=raw as Record<string,unknown>;\n  if (typeof data.id!=="string" || typeof data.title!=="string") throw Error("invalid fields");\n  return {id:data.id,title:data.title};\n}',
 'Der Parser konstruiert ein neues Event erst nach expliziten Feldprüfungen.'],
 ['ipc','Eine IPC-Brücke muss Rechte beschränken',
 'Ein Electron-Renderer kann eine vertrauenswürdige, schmale API wie window.checkmate.readDocument(id) erhalten, statt einen allgemeinen Datei- oder Prozesszugriff zu besitzen. Der Main-Prozess muss die eingehende ID jedoch ebenfalls prüfen, denn Typannotationen im Renderer verhindern keine manipulierten Runtime-Nachrichten. Ein offener Kanal mit frei vorgegebenem Dateipfad würde sonst die Sicherheitsgrenze aufweichen. Eine erlaubte Operation sollte anhand einer klaren Liste von Fähigkeiten und gültigen Identifikatoren autorisiert werden.',
 'Die Preload-Schicht kann Methoden mit expliziten Parametern und Rückgaben bereitstellen. Für einen lesenden Dokumentabruf ist ein Vertrag mit Dokument-ID, erwarteter Form und Fehlermeldung angemessen. Ein Main-Handler sollte dann genau diese Operation ausführen, keine beliebigen Kanalnamen oder Dateisystemfunktionen entgegennehmen. So kann die UI dieselben Funktionen auf Linux, Windows und macOS benutzen, ohne selbst die jeweiligen Systemrechte zu übernehmen.',
 'type ReadResult = {ok:true; text:string} | {ok:false; error:string};\ninterface DocumentBridge { readDocument(id:string):Promise<ReadResult> }',
 'Das Beispiel beschreibt einen schmalen IPC-Vertrag. Die Autorisierung und Validierung muss die tatsächliche Main-Implementierung leisten.'],
 ['errors','Fehlerklassen und Abbruch gehören zum Fachablauf',
 'Eine Dateioperation kann wegen fehlender Datei, fehlender Berechtigung, falscher Kodierung oder ungültigem Fachinhalt scheitern. Die UI sollte solche Fehler nicht alle zu einer leeren Liste umdeuten. Ein diskriminiertes Ergebnisobjekt oder ein klarer Exception-Vertrag hilft, sie zu unterscheiden. Besonders beim Import älterer Projekte kann eine Schemaversion nötig sein, damit ein unbekanntes Format nicht stillschweigend als aktuelle Daten gespeichert wird.',
 'Für große Dateien lohnt eine Eingabegrößengrenze, bevor der gesamte Inhalt in den Arbeitsspeicher gelesen wird. Beim Speichern ist zu prüfen, ob bereits eine Datei existiert und ob das Überschreiben ausdrücklich vorgesehen ist. Ein Button, der frühzeitig Erfolg anzeigt, obwohl der Main-Prozess noch schreibt, verletzt den Fachvertrag. TypeScript-Typen machen eine gute API sichtbar; verlässliches Verhalten entsteht durch die tatsächliche Operation und überprüfbare Rückgaben.',
 'type ImportState =\n | {status:"idle"}\n | {status:"loading"}\n | {status:"success";count:number}\n | {status:"error";message:string};',
 'Ein gemeinsames Statusfeld verhindert widersprüchliche Kombinationen aus loading, success und error.']
 ],
 checks:[
 ['Darf ein normaler Electron-Renderer beliebige Dateisystemoperationen erhalten, nur weil TypeScript sie typisiert?','Nein.','Sicherheit verlangt eine schmale, kontrollierte API und echte Main-seitige Prüfung.'],
 ['Was ist problematisch an readJson<T> ohne Runtime-Parser?','Die generische Rückgabe behauptet eine Datenform ohne Prüfung.','Unbekannte JSON-Werte müssen an der Systemgrenze validiert werden.'],
 ['Muss ein Main-Prozess IPC-Daten prüfen, obwohl der Renderer passende TypeScript-Typen besitzt?','Ja.','Typannotationen verhindern keine manipulierten oder unerwarteten Laufzeitnachrichten.']
 ],
 exercise:'Entwirf einen sicheren Importablauf für eine Electron-App: Der Renderer wählt eine bekannte Dokument-ID, Preload bietet nur readDocument(id), Main prüft die ID und liest die Datei. Ergänze Runtime-Parsing eines JSON-Dokuments und klar getrennte Lade-/Fehlerzustände. Erkläre, warum freie Dateipfade im Renderer unerwünscht sind.',
 solution:'Nutze eine explizite Bridge mit readDocument(id:string):Promise<ReadResult>. Main validiert ID, erlaubten Pfad und Berechtigungen, liest mit node:fs/promises und gibt ein kontrolliertes Ergebnis zurück. Der Renderer behandelt unbekannte JSON-Daten über einen Parser und zeigt erst nach Erfolg einen vollständigen Zustand. Die Bridge darf keine frei verwendbaren fs- oder ipcRenderer-Objekte weitergeben.'
}
];
export const TYPESCRIPT_TYPE_SYSTEM_VOLUME:readonly AuthoredLesson[]=MANUSCRIPTS.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:35,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({id,title,paragraphs:[first,second],code,annotation})),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:'typescript',name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Ein konkreter TypeScript-Vertrag aus diesem Kapitel. Die vier Lehrabschnitte erläutern statische Prüfungen, Laufzeitgrenzen und die fachlich bedeutsamen Fälle.',
  differences:'TypeScript-Typen werden in JavaScript-Ausgabe nicht zu einer automatischen Runtime-Validierung. Host- und Modulgrenzen müssen ausdrücklich beachtet werden.',
  equivalence:'related',docs:item.source
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
