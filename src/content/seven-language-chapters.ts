import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';

type Language='python'|'javascript'|'csharp'|'cpp'|'php'|'go'|'kotlin';
export type AuthoredLesson={readonly id:string;readonly title:string;readonly chapter:TextbookChapter;readonly implementation:LanguageVariant};
type SectionInput=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type QuestionInput=readonly [question:string,answer:string,reason:string];
type SourceLesson={
 language:Language;id:string;title:string;objectives:readonly string[];
 sections:readonly SectionInput[];questions:readonly QuestionInput[];
 exercise:string;solution:string;source:string;
};
const lessons:readonly SourceLesson[]=[
{
 language:'python',id:'py-function-defaults',title:'Python-Funktionen, Namensbindung und Defaultargumente',
 objectives:['Funktionen und Keywordargumente als klare API-Verträge formulieren.','Veränderliche Defaultwerte von Aufrufzustand unterscheiden.','Gültigkeitsbereiche und die Übergabe von Objektreferenzen nachvollziehen.'],
 source:'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
 sections:[
 ['parameters','Parameter beschreiben eine Schnittstelle',
 'Eine Python-Funktion erhält Namen für die Werte, mit denen sie arbeiten soll. Die Funktion def register(title, seats) kann aus einem Titel und einer Platzanzahl einen Eintrag erzeugen. Die Parameter sind lokale Namensbindungen: Der Aufrufer übergibt Objekte, und innerhalb der Funktion sind diese unter den Parameternamen zugänglich. Python führt dabei keine Kopie eines beliebig großen Objekts allein wegen der Übergabe durch. Ob die Funktion den Zustand verändern kann, hängt unter anderem vom übergebenen Objekttyp und von den tatsächlich ausgeführten Operationen ab.',
 'Positionsargumente werden nach ihrer Reihenfolge zugeordnet; Keywordargumente benennen ausdrücklich den zugehörigen Parameter. Das erhöht die Lesbarkeit, wenn eine Funktion mehrere gleichartige Werte akzeptiert. Schreibe für öffentliche Funktionen nur so viele Parameter wie nötig und überprüfe fachliche Grenzen, beispielsweise eine negative Anzahl von Sitzplätzen. Ein Type Hint wie seats: int dokumentiert den erwarteten Typ, ist jedoch ohne weitere Prüfung keine automatisch ausgeführte Runtime-Validierung.',
 'def register(title: str, seats: int) -> dict[str, object]:\n    if seats < 0:\n        raise ValueError("seats must not be negative")\n    return {"title": title, "seats": seats}\n\nentry = register(title="Workshop", seats=20)',
 'Das Keywordargument benennt den Vertrag. Die Prüfung von seats ist tatsächliche Laufzeitlogik, keine Wirkung der Annotation.'],
 ['defaults','Warum veränderliche Defaultargumente überraschen',
 'Ein Defaultwert wird bei der Ausführung der def-Anweisung ermittelt, nicht bei jedem Aufruf erneut. Ist dieser Default eine veränderliche Liste, wird dieselbe Liste bei aufeinanderfolgenden Aufrufen wiederverwendet. Eine Funktion append_event(event, events=[]) kann deshalb Daten eines früheren Aufrufs in einem späteren Aufruf wiederfinden. Das ist eine häufige Fehlerquelle, weil der Code aussieht, als bekäme jeder Aufruf eine neue leere Liste.',
 'Wenn für jeden Aufruf eine unabhängige Liste benötigt wird, verwende None als Default und erstelle die Liste innerhalb der Funktion. Ein unveränderlicher Defaultwert wie ein Integer oder ein String hat dieses spezifische Änderungsproblem nicht. Auch eine absichtlich wiederverwendete Liste kann sinnvoll sein, aber dann sollte der gemeinsam geteilte Zustand ausdrücklich benannt und nicht in einem beiläufigen Default versteckt werden.',
 'def append_event(name: str, events: list[str] | None = None) -> list[str]:\n    if events is None:\n        events = []\n    events.append(name)\n    return events\n\nassert append_event("A") == ["A"]\nassert append_event("B") == ["B"]',
 'Die neue Liste wird erst beim Aufruf erzeugt. Der zweite Aufruf erbt keinen Zustand vom ersten.'],
 ['scope','Namensbindung ist nicht Objektmutation',
 'Wenn eine Funktion einen Parameter auf einen neuen Wert setzt, ändert sie damit zunächst ihre lokale Namensbindung. Das ist nicht dasselbe wie das Verändern eines übergebenen Objekts. Ein Ausdruck events = [] innerhalb der Funktion bindet den lokalen Namen neu; ein events.append("A") verändert dagegen die bestehende Liste, die möglicherweise auch der Aufrufer verwendet. Dieser Unterschied erklärt viele scheinbar widersprüchliche Resultate bei Python-Funktionen.',
 'Lokale Namen gehören zu einem Gültigkeitsbereich. Möchte eine innere Funktion eine Variable aus einem umschließenden Funktionsbereich neu binden, kann nonlocal benötigt werden. Für globale Namen existiert global, doch dauerhafter versteckter Modulzustand erschwert Tests und Wiederverwendung. Eine Funktion mit expliziten Argumenten und einem Rückgabewert ist für Geschäftsanwendungen oft leichter nachzuvollziehen.',
 'def renamed(value: list[str]) -> None:\n    value = ["Lokal"]  # nur der lokale Name wird neu gebunden\n\ndef mutated(value: list[str]) -> None:\n    value.append("Gemeinsam")\n\nnames = ["Vorher"]\nrenamed(names)\nmutated(names)\nassert names == ["Vorher", "Gemeinsam"]',
 'Die zweite Funktion verändert das gemeinsam referenzierte Listenobjekt, die erste nicht.'],
 ['design','Funktionen auf fachliche Verantwortung zuschneiden',
 'Eine registrierende Funktion sollte nicht heimlich Dateien speichern, globale Listen ändern und gleichzeitig eine Ausgabe formatieren. Trenne Eingabevalidierung, Berechnung und persistente Seiteneffekte, damit jede Operation einen klaren Vertrag besitzt. Besonders bei Defaultparametern kann ein versteckter Zustand sonst über Tests und mehrere Benutzeraktionen hinweg erhalten bleiben. Die Rückgabe eines neuen Datensatzes statt der Mutation einer globalen Liste ist häufig der einfachere Ausgangspunkt.',
 'Teste eine Funktion mit Positions- und Keywordargumenten sowie fehlenden und ungültigen Werten. Nutze für Fehlerfälle assert mit der erwarteten Exception in einem Testframework statt bloß zu prüfen, ob irgendeine Ausgabe erscheint. Die Dokumentation einer Funktion sollte erklären, welche Eingaben zulässig sind, was zurückgegeben wird und ob ein übergebenes Objekt verändert wird. Genau das ist das Fundament für spätere Themen wie Generatoren, Decorators und asynchrone Funktionen.',
 'def normalize_title(title: str) -> str:\n    normalized = title.strip()\n    if not normalized:\n        raise ValueError("empty title")\n    return normalized\n\nassert normalize_title("  Rust  ") == "Rust"',
 'Die Funktion hat ein klar definiertes Ergebnis und verändert keine externe Collection.']
 ],
 questions:[
 ['Wann wird ein Python-Defaultargument ausgewertet?','Bei Ausführung der Funktionsdefinition.','Ein veränderlicher Default kann daher über Aufrufe hinweg dasselbe Objekt bezeichnen.'],
 ['Verändert value = [] in einer Funktion die ursprünglich übergebene Liste?','Nein, es bindet den lokalen Parameternamen neu.','Eine Mutation wie value.append(...) verändert dagegen das referenzierte Listenobjekt.'],
 ['Erzwingt ein Hinweis seats: int automatisch einen Integer zur Laufzeit?','Nein.','Type Hints dienen primär Dokumentation und Werkzeugen; fachliche Laufzeitprüfungen müssen ausdrücklich stattfinden.']
 ],
 exercise:'Implementiere add_tag(tag: str, tags: list[str] | None = None) -> list[str], die jeden Aufruf ohne übergebene Liste unabhängig behandelt, leere Tags ablehnt und eine übergebene Liste absichtlich erweitert. Teste zwei getrennte Aufrufe und die gemeinsame Liste.',
 solution:'Verwende tags = [] if tags is None else tags. Prüfe normalized = tag.strip() und lehne leere Werte mit ValueError ab. Rufe tags.append(normalized) auf und gib tags zurück. Teste add_tag("a") und add_tag("b") getrennt sowie zweimaligen Aufruf mit derselben expliziten Liste; dort ist Mutation gewollt.'
},
{
 language:'javascript',id:'js-identity-and-coercion',title:'JavaScript-Werte, Identität und kontrollierte Konvertierung',
 objectives:['Primitive Werte von referenzierten Objekten unterscheiden.','===, Object.is und Truthiness situationsgerecht verwenden.','Zahlen- und Textkonvertierungen ohne versteckte Annahmen behandeln.'],
 source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
 sections:[
 ['values','Werte und Bindungen sind nicht dasselbe',
 'JavaScript kennt primitive Werte wie number, string, boolean, bigint, symbol, null und undefined sowie Objekte. Eine Variable speichert eine Bindung an einen Wert. const verbietet, diese Bindung später auf einen anderen Wert umzusetzen, doch ein referenziertes Objekt kann weiterhin verändert werden. const catalog = { count: 0 } lässt normalerweise catalog.count = 1 zu. Das ist keine Ausnahme von const, sondern der Unterschied zwischen einer Bindung und dem Zustand des referenzierten Objekts.',
 'Wenn du Funktionen mit Objektargumenten aufrufst, können Mutationen für den Aufrufer sichtbar sein. Wer verlässliche UI-Zustände benötigt, arbeitet deshalb häufig mit neu konstruierten Objekten und klaren Update-Funktionen. Primitive Strings werden nicht wie Arrays an Ort und Stelle verändert. Auch const macht ein Objekt nicht automatisch tief unveränderlich; Object.freeze ist ebenfalls nur eine flache Sperre der direkten eigenen Eigenschaften und ersetzt kein vollständiges Zustandsmodell.',
 'const settings = { theme: "dark" };\nsettings.theme = "light"; // erlaubt\n// settings = {}; // neue Bindung: verboten\nconst next = { ...settings, theme: "dark" };',
 'Die Kopie über Spread schafft ein neues äußeres Objekt; verschachtelte Objekte können weiterhin geteilt sein.'],
 ['equality','Gleichheit hat mehrere Bedeutungen',
 'Bei === findet normalerweise keine Typumwandlung für den Vergleich statt. Die Werte 3 und "3" sind deshalb nicht streng gleich. Zwei getrennt erzeugte Objektliterale sind ebenfalls nicht per === gleich, obwohl sie identische Eigenschaften enthalten: Der Vergleich prüft ihre Identität. Das ist wichtig für Set, Map und React-Updates. Wer fachliche Gleichheit zweier Events anhand der ID benötigt, sollte ausdrücklich diese ID vergleichen und nicht versehentlich die Objektidentität.',
 'Object.is ähnelt ===, unterscheidet aber insbesondere NaN und die beiden Vorzeichen von null anders. Für gewöhnliche fachliche Objektvergleiche ist weder Object.is noch JSON.stringify ein universeller Ersatz. Eine Schlüsselregel wie a.id === b.id ist häufig verständlicher und stabiler. JavaScript kennt außerdem ==, das Konvertierungsregeln einsetzt; diese Regeln sind im Allgemeinen schwerer zu überblicken und sollten nicht aus Bequemlichkeit an Systemgrenzen verwendet werden.',
 'const a = { id: "E1" };\nconst b = { id: "E1" };\nconsole.log(a === b);      // false\nconsole.log(a.id === b.id); // true\nconsole.log(3 === "3");    // false',
 'Der Vergleich zweier identischer IDs ist eine ausdrückliche fachliche Entscheidung.'],
 ['truthy','Truthy ist nicht dasselbe wie gültig',
 'JavaScript benutzt in if-Bedingungen Truthiness. Die Werte 0, "", null, undefined, NaN und false werden als falsy behandelt, während leere Arrays und leere Objekte truthy sind. Wenn eine erlaubte Teilnehmerzahl 0 ist, wäre if (participants) als Gültigkeitsprüfung falsch. Die Prüfung muss zum Fachvertrag passen: Number.isInteger(participants) und ein erlaubter Wertebereich sind präziser als eine zufällige Wahrheitswertkonvertierung.',
 'Der Operator ?? wählt nur bei null oder undefined einen Ersatz, während || auch bei 0, false und leerem String auf die rechte Seite ausweicht. Das macht einen sichtbaren Unterschied bei Konfigurationen. Ein explizit gesetztes Limit 0 darf nicht versehentlich auf 10 zurückfallen, wenn 0 eine zulässige Bedeutung besitzt. Verwende daher Nullish Coalescing, wenn wirklich nur ein fehlender Wert ersetzt werden soll.',
 'const requested = 0;\nconsole.log(requested || 10); // 10\nconsole.log(requested ?? 10); // 0\nconsole.log(Boolean([]));    // true',
 'Der Unterschied zwischen fehlendem Wert und falsy-Wert gehört zum API-Vertrag.'],
 ['boundaries','Konvertierung und Zahlengrenzen prüfen',
 'Number("42") liefert die Zahl 42; Number("") liefert dagegen 0. parseInt kann in einem Text auch nur einen führenden Zahlenteil verwenden. Wer eine Nutzer-ID oder Geldbetrag verarbeitet, darf deshalb nicht ohne fachliche Prüfung eine dieser Funktionen auf beliebige Eingaben anwenden. Prüfe gegebenenfalls zuerst, ob die gesamte Eingabe dem erwarteten Format entspricht, und danach, ob das Resultat endlich und in einem zulässigen Bereich liegt.',
 'Die Zahlensorte number verwendet binäre Gleitkommazahlen und kann nicht jede große ganze Zahl exakt darstellen. Number.isSafeInteger unterscheidet sichere Ganzzahlen; BigInt ist für beliebig große ganze Zahlen geeignet, lässt sich aber nicht beliebig mit number mischen. Für Gebühren, Dauerangaben und IDs muss zuerst die fachliche Repräsentation geklärt werden. Die Sprache nimmt dir diese Entscheidung nicht ab, auch wenn der implizite Konvertierungsmechanismus verlockend bequem wirkt.',
 'function parseSeats(input) {\n  if (typeof input !== "string" || !/^(0|[1-9]\\d*)$/.test(input)) return null;\n  const result = Number(input);\n  return Number.isSafeInteger(result) && result <= 500 ? result : null;\n}',
 'Die Funktion prüft Format und sicheren Wertebereich getrennt. Der String "12x" wird nicht stillschweigend akzeptiert.']
 ],
 questions:[
 ['Sind zwei separat erzeugte {id:"A"}-Objekte über === gleich?','Nein.','=== prüft bei Objekten die Identität, nicht die rekursive Gleichheit ihrer Eigenschaften.'],
 ['Weshalb ist value || 10 ungeeignet, wenn 0 gültig ist?','Weil 0 falsy ist und ersetzt wird.','Mit ?? wird nur null oder undefined durch den Ersatzwert ausgetauscht.'],
 ['Kann const das Objekt vor Eigenschaftenänderungen schützen?','Nein.','const verbietet die Neuzuweisung der Bindung, nicht jede Mutation des referenzierten Objekts.']
 ],
 exercise:'Implementiere einen Parser für die Teilnehmerzahl 0 bis 500, der nur Dezimalziffern aus einem String akzeptiert. Erkläre, warum Number("") und parseInt("12x") nicht als stillschweigende Erfolgsergebnisse behandelt werden dürfen. Teste "0", "500", "501", "", "12x" und 12.',
 solution:'Prüfe zuerst typeof input === "string" und ein vollständiges Muster wie /^(0|[1-9]\\d*)$/. Anschließend mit Number konvertieren und Number.isSafeInteger sowie den Maximalwert kontrollieren. Leere Strings, gemischte Texte und Nicht-Strings liefern den Fehlerfall zurück, statt als Zahl zu gelten.'
},
{
 language:'csharp',id:'cs-nullable-contracts',title:'C#: Nullable Reference Types und belastbare Datenverträge',
 objectives:['Nullable-Analyse und tatsächliche Laufzeit-Nullwerte trennen.','Nullzustände an öffentlichen Methoden und Objektmodellen ausdrücken.','Pattern Matching und explizite Vorbedingungen korrekt verwenden.'],
 source:'https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references',
 sections:[
 ['analysis','Ein Warnsystem ist kein unsichtbarer Laufzeitwächter',
 'In C# kann der Compiler mit aktivierten Nullable Reference Types analysieren, ob eine Referenz möglicherweise null ist. string ist dann als nicht-null vorgesehene Referenz annotiert, string? signalisiert einen erlaubten Nullzustand. Die Warnungen helfen beim Erkennen fragwürdiger Dereferenzierungen, erzeugen aber keine neue, separate String-Klasse und verhindern nicht jede NullReferenceException zur Laufzeit. Code aus älteren Bibliotheken, Reflection oder dynamisch gelesenen Daten muss weiterhin sorgfältig behandelt werden.',
 'Bei Werttypen wie int bedeutet int? dagegen einen Nullable<T>-Wert, der tatsächlich einen Nullzustand repräsentieren kann. Die Unterscheidung zwischen Referenz-Nullanalyse und nullable Werttypen ist wichtig, wenn du APIs entwirfst. Ein Event mit optionaler Beschreibung könnte string? besitzen, während seine ID zwingend string ist. Diese Festlegung gehört zur Fachlogik und sollte nicht von einem zufälligen Compilerhinweis abhängen.',
 '#nullable enable\npublic record Event(string Id, string? Description);\nEvent value = new("E1", null);\nConsole.WriteLine(value.Description?.Length ?? 0);',
 'Die optionale Description wird über ?. geschützt; ?? definiert den Ersatzwert für den Nullfall.'],
 ['flow','Der Compiler verfolgt Nullzustände entlang des Kontrollflusses',
 'Wenn ein Wert zunächst string? ist, erlaubt der Compiler nach einer wirksamen Prüfung auf null häufig einen normalen Zugriff. Ein if (title is null) return; schließt den Nullfall für den weiteren Zweig aus. Beim Pattern Matching mit is not null drückst du dieselbe Absicht aus. Das ist klarer als ein pauschales Ausrufezeichen nach jeder möglicherweise fehlenden Variable. Die Null-Forgiving-Annotation ! entfernt eine Warnung, ändert den tatsächlichen Wert aber überhaupt nicht.',
 'Gerade bei Event- oder Benutzerprofilen solltest du entscheiden, ob fehlende Daten regulär sind. Wenn eine Titelangabe verpflichtend ist, überprüfe sie bei der Konstruktion oder am API-Eingang. Wenn sie bewusst optional ist, muss der Aufrufer einen leeren Zustand sinnvoll darstellen können. Nullable Reference Types machen diese Vertragsentscheidung im Code sichtbar, ersetzen aber weder fachliche Validierung noch die Kontrolle fremder JSON-Daten.',
 'static int TitleLength(string? title) {\n    if (title is null) return 0;\n    return title.Length;\n}',
 'Die Prüfung verengt den Nullzustand, ohne über ! eine unbelegte Annahme zu erzwingen.'],
 ['arguments','Vorbedingungen gehören an die öffentliche Grenze',
 'Eine Methode kann argumentseitig zusichern, dass ein String nie null sein darf. Die Signatur allein ist nicht genug, wenn Aufrufe aus unannotierten Projekten oder über Reflection erfolgen. Deshalb können ArgumentNullException.ThrowIfNull und fachliche Prüfungen sinnvoll sein. Wenn auch ein leerer oder nur aus Leerzeichen bestehender Name ungültig ist, benötigt diese Regel zusätzlich eine eigene Prüfung. Ein nicht-null String ist eben noch kein fachlich gültiger Titel.',
 'Für zurückgegebene Werte kann eine API zwischen einer nullable Rückgabe und einem Try-Muster mit bool unterscheiden. Häufig ist ein TryGet-Aufruf mit einem Out-Parameter lesbar, wenn das Fehlen eines Ergebnisses normal ist. Eine Exception sollte dagegen einen tatsächlichen Fehler oder eine Vertragsverletzung ausdrücken. Diese Entscheidungen solltest du mit Tests für gültige, leere, fehlende und zu lange Eingaben absichern.',
 'static string Normalize(string title) {\n    ArgumentNullException.ThrowIfNull(title);\n    var result = title.Trim();\n    if (result.Length == 0) throw new ArgumentException("Empty title", nameof(title));\n    return result;\n}',
 'Null und Blank werden als unterschiedliche ungültige Eingaben behandelt.'],
 ['models','Nullsicherheit über mehrere Schichten erhalten',
 'Datenmodelle durchlaufen oft Controller, Service, Persistenz und Benutzeroberfläche. Ist ein Feld an der API-Grenze optional, darf es nicht zufällig in der nächsten Schicht als verpflichtend behandelt werden. Dokumentiere, ob ein leerer Wert erlaubt ist, wie ein nicht gefundenes Objekt dargestellt wird und wann eine Exception entstehen darf. Ein nullable Typ kann dabei helfen, ist aber kein vollständiges Geschäftsregelwerk. Ein String mit der falschen ID-Form wird nicht durch die Nullable-Analyse erkannt.',
 'Teste auch die Übergänge zu externen Systemen. Ein aus JSON deserialisiertes Objekt kann andere Werte besitzen als die Typdefinition vermuten lässt; je nach Serializer-Konfiguration sind zusätzliche Prüfungen nötig. Nutze für relevante Daten Validierung an der Eingangsgrenze und bevorzuge klar konstruierte, konsistente Domänenobjekte. Die stärkste Wirkung der Compileranalyse entsteht dann zusammen mit eindeutigen Schnittstellen und nicht durch das blinde Unterdrücken aller Warnungen.',
 'static bool IsUsable(Event? value) => value is { Id.Length: > 0 };',
 'Ein Property Pattern kann den Nullzustand und eine einfache Feldbedingung zusammen auswerten. Komplexere ID-Regeln brauchen weitere Prüfung.']
 ],
 questions:[
 ['Verhindert string ohne Fragezeichen jede NullReferenceException zur Laufzeit?','Nein.','Nullable Reference Types führen primär zu statischer Analyse und Warnungen; externe Nullwerte bleiben möglich.'],
 ['Was bewirkt title! bei einer möglicherweise nullen Referenz?','Es unterdrückt die Nullwarnung, verändert aber den Wert nicht.','Ein tatsächlich nuller Wert kann bei späterem Zugriff weiterhin eine Exception auslösen.'],
 ['Worin unterscheiden sich string? und int? grundsätzlich?','string? annotiert Referenz-Nullbarkeit; int? repräsentiert einen Nullable<int>-Wert.','Nullable Value Types besitzen einen konkreten Nullzustand, während Referenzannotation die statische Analyse steuert.']
 ],
 exercise:'Schreibe eine C#-Methode NormalizeTitle(string? raw), die null und blank getrennt ablehnt und den getrimmten Titel zurückgibt. Prüfe die Methodensignatur und schreibe Tests für null, "   ", " Ada " und einen gültigen Titel ohne Leerzeichen.',
 solution:'Verwende if (raw is null) throw new ArgumentNullException(nameof(raw)); dann var text = raw.Trim(); falls text.Length == 0 wirf ArgumentException. Im Erfolgsfall gib text zurück. Mit nullable aktiv sollte der Compiler nach der Prüfung den weiteren Aufruf auf raw akzeptieren.'
},
{
 language:'cpp',id:'cpp-raii-ownership',title:'C++: RAII, Besitz und verlässliche Ressourcenverwaltung',
 objectives:['Objektlebensdauer und Ressourcenbesitz mit RAII erklären.','unique_ptr und Referenzen nach ihren Rollen unterscheiden.','Exception-Sicherheit bei Datei- und Speicherressourcen begründen.'],
 source:'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii',
 sections:[
 ['lifetime','Ressourcen sind mehr als dynamischer Speicher',
 'Ein Programm reserviert Speicher, öffnet Dateien, sperrt Mutexe und hält Netzwerkverbindungen. Wenn eine Funktion auf mehreren Wegen endet, müssen diese Ressourcen trotzdem korrekt freigegeben werden. C++ verwendet dafür häufig RAII: Die Akquisition wird an die Initialisierung eines Objekts gebunden, dessen Destruktor die passende Freigabe übernimmt. Verlässt das Objekt seinen Gültigkeitsbereich, wird sein Destruktor auch beim Stack-Unwinding durch eine Exception ausgeführt. Das ist robuster als getrennte manuelle Aufräumaufrufe auf jedem Rückgabepfad.',
 'Die Standardbibliothek bringt dafür bereits viele Werkzeuge mit. std::vector verwaltet seinen Speicher, std::string seine dynamische Zeichenfolge, std::ifstream einen Dateistream und std::lock_guard eine Mutex-Sperre. Der erste Entwurf sollte deshalb nicht aus verstreuten new/delete-Paaren bestehen. Wer den Besitz einer Ressource in einem klaren Objektmodell ausdrückt, reduziert die Zahl gefährlicher manueller Sonderfälle.',
 '#include <fstream>\n#include <string>\nstd::string readFirstLine(const std::string& path) {\n    std::ifstream file(path);\n    if (!file) throw std::runtime_error("cannot open file");\n    std::string line;\n    std::getline(file, line);\n    return line;\n}',
 'Der Dateistream wird über seinen Destruktor geschlossen – auch wenn die Funktion früher endet. Für das vollständige Beispiel wird zusätzlich <stdexcept> benötigt.'],
 ['pointers','Besitz unterscheidet unique_ptr von einem rohen Zeiger',
 'std::unique_ptr<T> modelliert eindeutigen Besitz eines dynamisch erzeugten Objekts. Er kann bewegt, aber nicht einfach kopiert werden. std::make_unique<T> ist ein üblicher Weg zur sicheren Konstruktion. Ein roher Zeiger T* oder eine Referenz T& kann dagegen Zugriff ohne Besitzübernahme ausdrücken. Der Compiler weiß bei rohen Zeigern allerdings nicht automatisch, ob eine Referenz auf bereits freigegebenen Speicher zeigt. Ein API-Vertrag muss deshalb deutlich festlegen, wer die Ressource besitzt und wie lange geliehene Zugriffe gültig sind.',
 'std::shared_ptr<T> repräsentiert geteilten Referenzzählungsbesitz und verursacht entsprechende Kosten. Zyklen aus shared_ptr können verhindern, dass Objekte freigegeben werden; std::weak_ptr ist ein wichtiges Mittel, um solche Eigentumszyklen aufzubrechen. Gemeinsamer Besitz sollte eine echte fachliche Anforderung sein und nicht aus Unsicherheit überall verwendet werden. Häufig genügen Werttypen, Referenzen und eine klare eindeutige Eigentümerschaft.',
 '#include <memory>\nstruct Event { int id; };\nauto owned = std::make_unique<Event>(Event{17});\nEvent& view = *owned;\nview.id = 18;',
 'owned besitzt das Event; view ist ein Zugriff ohne eigene Lebensdauerverwaltung.'],
 ['exceptions','Exception-Sicherheit wird durch Invarianten hergestellt',
 'Exception-Sicherheit bedeutet nicht nur, Leaks zu vermeiden. Ein Objekt kann nach einem fehlgeschlagenen Verarbeitungsschritt auch in einem widersprüchlichen Zustand zurückbleiben. Eine grundlegende Garantie ist, dass bestehende Invarianten erhalten bleiben und keine Ressourcen verloren gehen; eine stärkere Garantie kann verlangen, dass eine fehlgeschlagene Operation den sichtbaren Zustand unverändert lässt. Solche Garantien müssen zum jeweiligen Algorithmus und dessen realen Fehlerstellen passen.',
 'RAII hilft bei der Ressourcenfreigabe, aber nicht automatisch bei jeder fachlichen Transaktion. Wenn du erst eine Map änderst und anschließend einen zweiten Schritt ausführst, können Exceptions zwischen den beiden Operationen entstehen. Oft ist es besser, neue Daten zunächst vollständig in temporären Objekten aufzubauen und sie erst nach erfolgreicher Vorbereitung auszutauschen. Der Kern ist dieselbe Frage wie bei einer Datenbanktransaktion: Welche Zustände dürfen nach einem Fehler sichtbar sein?',
 '#include <utility>\nstd::vector<int> current{1, 2};\nstd::vector<int> replacement{3, 4};\ncurrent.swap(replacement);',
 'Ein Austausch vorbereiteter Container trennt Vorbereitung und Commit. Für dieses Beispiel muss auch <vector> eingebunden werden.'],
 ['interfaces','Lebensdauer gehört an die Schnittstellengrenze',
 'Eine Funktion, die nur einen Text lesen soll, benötigt normalerweise keinen Besitz über einen neu erzeugten String. const std::string& kann eine geliehene Sicht auf einen vorhandenen String ausdrücken; std::string_view eignet sich für viele reine Lesesituationen, darf aber nicht länger als seine zugrunde liegenden Zeichen verwendet werden. Rückgaben von Referenzen oder Views auf lokale Variablen sind besonders gefährlich, weil deren Objekte beim Funktionsende zerstört werden. Solche Dangling References entstehen nicht durch einen falschen Algorithmus, sondern durch einen falschen Lebensdauervertrag.',
 'Bevorzuge Rückgaben als Werte, wenn sie Besitz sauber und effizient ausdrücken. Moderne C++-Compiler können viele unnötige Kopien vermeiden oder bewegen. Ein unnötig komplexes Netz aus Referenzen und Zeigern ist deshalb nicht automatisch schneller. Teste Ressourcenpfade wie frühzeitige Rückkehr, Exceptions und das Verlassen von Scopes. Ein gutes API erlaubt dem Aufrufer zu erkennen, ob er besitzt, nur leiht oder etwas verändern darf.',
 'std::string title() {\n    std::string value = "Ada";\n    return value; // als Wert sicher\n}\n// const std::string& bad() { std::string x="A"; return x; }',
 'Die Rückgabe als Wert besitzt eine klar gültige Lebensdauer. Die auskommentierte Alternative wäre eine Dangling Reference.']
 ],
 questions:[
 ['Was ist die Kernaussage von RAII?','Eine Ressource ist an die Lebensdauer eines verwaltenden Objekts gebunden.','Destruktoren übernehmen Freigabe auch bei Exceptions und frühen Rückgabepfaden.'],
 ['Darf std::unique_ptr einfach kopiert werden?','Nein, er modelliert eindeutigen Besitz und wird bei Bedarf bewegt.','Eine Kopie würde die eindeutige Eigentümerschaft verletzen.'],
 ['Warum ist std::string_view auf einen lokalen temporären String gefährlich?','Weil die View die Speicherlebensdauer nicht verlängert.','Nach dem Ende des Strings würde die View auf ungültige Daten verweisen.']
 ],
 exercise:'Entwerfe einen EventStore, der einen std::vector<Event> als Wert besitzt und const std::vector<Event>& list() const zurückgibt. Erläutere, unter welchen Bedingungen die geliehene Referenz gültig bleibt und warum die Funktion keine Referenz auf eine lokal erzeugte Kopie zurückgeben darf.',
 solution:'Lege vector<Event> als Member an. Implementiere list() const { return events_; }. Die Referenz darf nur solange genutzt werden, wie der Store lebt und die betreffenden Containeroperationen ihre Gültigkeit nicht verletzen; bei einer lokal erzeugten Kopie wäre die Referenz nach dem Methodenende ungültig. Eine alternative Rückgabe als Wert erzeugt einen separaten Besitzer.'
},
{
 language:'php',id:'php-array-semantics',title:'PHP-Arrays: Listen, Zuordnungen und Schlüsselregeln',
 objectives:['PHP-Arrays als geordnete Maps statt getrennte List- und Map-Typen verstehen.','Schlüsselkonvertierung und fehlende Einträge bewusst behandeln.','Mutation und Datenvalidierung an Fachgrenzen klar definieren.'],
 source:'https://www.php.net/manual/en/language.types.array.php',
 sections:[
 ['one-type','Ein Array kann zwei sehr verschiedene Aufgaben erfüllen',
 'PHP verwendet einen Array-Typ, der sowohl numerisch indizierte Listen als auch assoziative Zuordnungen modellieren kann. Ein Array kann Integer- und String-Schlüssel enthalten und bewahrt seine Einfügereihenfolge. Das ist bequem, birgt aber die Gefahr, dass ein Datenmodell unbemerkt zwischen einer Folge von Elementen und einer Schlüssel-Tabelle wechselt. Eine Liste von Events sollte eine andere fachliche Bedeutung haben als eine Zuordnung von Event-ID auf Eventdaten.',
 'Die Array-Syntax mit eckigen Klammern erzeugt sowohl [10, 20] als auch ["Ada" => 10]. Du darfst daher nicht aus der bloßen Sprachkonstruktion schließen, dass Arrayzugriff immer ein fortlaufender Index ist. Beim JSON-Export kann die Anordnung der Keys beeinflussen, ob eine Folge als JSON-Array oder JSON-Objekt erscheint. Für einen API-Vertrag ist der genaue Typ der Datenform deshalb wichtiger als die allgemeine Bezeichnung array.',
 '$events = [ ["id" => "E1"], ["id" => "E2"] ];\n$byId = ["E1" => ["title" => "Workshop"]];\necho $events[0]["id"];\necho $byId["E1"]["title"];',
 'Die erste Struktur ist eine Liste, die zweite eine Zuordnung. Beide werden technisch als PHP-Array ausgedrückt.'],
 ['keys','Schlüssel besitzen Konvertierungsregeln',
 'PHP-Array-Schlüssel können Integer oder String sein; bestimmte andersartige Eingaben werden konvertiert. So können rein dezimale Stringformen in manchen Fällen zu Integer-Schlüsseln werden. Ein Boolescher Schlüssel wird beispielsweise auf eine ganze Zahl abgebildet. Dadurch können scheinbar verschiedene Eingaben denselben Eintrag meinen oder überschreiben. Wenn eine eindeutige ID exakt als String erhalten bleiben muss, solltest du die ID-Form ausdrücklich kontrollieren.',
 'Beim Lesen über $map[$key] ist ein fehlender Schlüssel ein eigenständiger Fall. Ein Zugriff auf einen nicht vorhandenen Schlüssel erzeugt eine Warnung und kann null liefern, was nicht mit einer gültigen expliziten null-Zuordnung verwechselt werden darf. array_key_exists prüft, ob ein Schlüssel vorhanden ist, auch wenn sein Wert null ist. isset liefert dagegen false bei fehlendem Schlüssel und bei null als Wert. Die gewünschte Semantik entscheidet, welches Werkzeug passt.',
 '$items = ["E1" => null];\nvar_dump(array_key_exists("E1", $items)); // true\nvar_dump(isset($items["E1"]));            // false',
 'Ein vorhandener Nullwert und ein fehlender Schlüssel sind fachlich verschiedene Zustände.'],
 ['mutability','Einfügen und Entfernen verändert die Key-Struktur',
 'Mit $list[] = $value wird ein nächster numerischer Schlüssel verwendet, aber eine zuvor mit Lücken versehene oder anderweitig veränderte Struktur muss nicht automatisch wieder exakt bei 0, 1, 2 liegen. array_values kann die Werte in eine neu indizierte Liste übertragen. Das ist besonders wichtig nach array_filter: Der Filter bewahrt standardmäßig die ursprünglichen Schlüssel. Wer das Ergebnis als fortlaufende JSON-Liste ausgeben möchte, sollte die Form daher bewusst normalisieren.',
 'Eine weitere Stolperfalle besteht darin, ein Array als austauschbare Datentransportform zu benutzen, ohne seine Felder zu prüfen. Ein Kunde kann eine ID als fehlendes Feld, leeren String oder falsche Zahl liefern. Die Tatsache, dass der Arrayzugriff syntaktisch möglich ist, bedeutet nicht, dass die Daten korrekt sind. Prüfe die erwarteten Schlüssel und deren Werttypen am Eingang, bevor du aus ihnen Domänenobjekte oder Datenbankoperationen aufbaust.',
 '$values = [10, 20, 30];\n$selected = array_filter($values, fn($n) => $n > 10);\n$normal = array_values($selected);\n// $normal hat die Indizes 0 und 1',
 'Die Reindizierung ist ein bewusster Schritt, um eine echte Liste aus dem Filterergebnis zu machen.'],
 ['contracts','Datenvertrag und SQL-Grenze trennen',
 'Ein Array ist keine Garantie, dass seine Inhalte für einen Datenbankzugriff sicher sind. Auch mit einem korrekt validierten Array müssen SQL-Werte über parametrisierte Queries verarbeitet werden. Variablen direkt an SQL-Text anzuhängen ist keine Folge der Array-Semantik und darf nicht aus Bequemlichkeit entstehen. Strikte Parametertypen und klare Normalisierung erleichtern es, aus HTTP-Eingaben konsistente fachliche Werte zu machen.',
 'In einer längerlebigen Anwendung sind benannte Klassen oder readonly Datenobjekte oft besser als anonyme Arrays mit vielen frei benannten Keys. Sie dokumentieren, welche Felder vorhanden sein müssen. Trotzdem sind Arrays für kurze Listen und flexible Zuordnungen ein Grundbaustein der Sprache. Eine gute Entscheidung berücksichtigt Lesbarkeit, Datenform, Mutierbarkeit und die Anforderungen der angeschlossenen Systeme.',
 'function hasTitle(array $row): bool {\n    return array_key_exists("title", $row)\n        && is_string($row["title"])\n        && trim($row["title"]) !== "";\n}',
 'Die Prüfung schützt vor fehlendem Schlüssel, falschem Werttyp und leerem Text.']
 ],
 questions:[
 ['Sind PHP-Listen und assoziative Maps zwei unabhängige eingebaute Array-Typen?','Nein, beide nutzen den PHP-Array-Typ.','Die Schlüssel und die fachliche Nutzung entscheiden über die Datenform.'],
 ['Warum unterscheiden sich array_key_exists und isset bei einem Nullwert?','array_key_exists prüft Existenz; isset ist bei null false.','Ein vorhandener Nullwert muss von einem fehlenden Eintrag unterschieden werden können.'],
 ['Warum kann array_values nach array_filter nötig sein?','Weil array_filter ursprüngliche Schlüssel erhalten kann.','Für eine fortlaufend indizierte Liste kann eine ausdrückliche Reindizierung erforderlich sein.']
 ],
 exercise:'Verarbeite eine PHP-Liste von Event-Arrays mit den Schlüsseln id und title. Filtere Einträge ohne nichtleeren String-Titel, reindiziere die Ergebnisliste und gib sie als JSON aus. Teste eine Liste mit ungültigen und gültigen Elementen sowie einen vorhandenen null-Titel.',
 solution:'Nutze array_filter mit einer Validierungsfunktion, die array_key_exists und is_string prüft. Für String-Titel trim verwenden und leere Werte zurückweisen. Anschließend array_values($filtered) und json_encode($normalized, JSON_THROW_ON_ERROR) ausgeben. Die Reindizierung bewahrt den beabsichtigten JSON-Listenvertrag.'
},
{
 language:'go',id:'go-errors-defer',title:'Go: Fehlerwerte, defer und klare Ressourcengrenzen',
 objectives:['(Wert, error) als ausdrücklichen Fehlervertrag verstehen.','defer für zuverlässiges Aufräumen richtig platzieren.','Fehler mit Kontext weiterreichen statt sie zu verschlucken.'],
 source:'https://go.dev/doc/effective_go',
 sections:[
 ['errors','Ein Fehler ist ein Rückgabewert',
 'In Go geben viele Funktionen neben ihrem normalen Ergebnis einen zweiten Wert vom Typ error zurück. Dieser Fehler muss vom Aufrufer ausdrücklich geprüft werden. Eine Funktion, die eine Datei öffnet, kann beispielsweise (*os.File, error) zurückgeben. Ist der Fehler nicht nil, darf der zurückgegebene Datei-Handle nicht einfach als erfolgreich eröffnet behandelt werden. Diese Konstruktion macht den möglichen Fehlerpfad in der Signatur sichtbar und setzt eine Gewohnheit voraus: Jede wichtige Fehlerquelle erhält eine passende Entscheidung.',
 'Go verlangt keine globale Exception-Hierarchie, um gewöhnliche betriebliche Fehler zu modellieren. Das error-Interface besitzt die Methode Error() string. Dadurch können Fehler verständlich beschreiben, was schiefging. Eine Funktion kann einen Fehler durchreichen oder mit fmt.Errorf zusätzliche Kontextinformation versehen. Wer alle Fehler stillschweigend ignoriert, verliert dagegen genau die Informationen, die später zur Diagnose nötig wären.',
 'func countFile(path string) (int, error) {\n    data, err := os.ReadFile(path)\n    if err != nil {\n        return 0, fmt.Errorf("read %s: %w", path, err)\n    }\n    return len(data), nil\n}',
 'Das vollständige Beispiel benötigt die Imports fmt und os. %w erhält die Fehlerkette für errors.Is beziehungsweise errors.As.'],
 ['defer','Aufräumen gehört direkt zur erfolgreichen Akquisition',
 'Wenn eine Funktion eine Datei öffnet, sollte klar sein, wann sie sie wieder schließt. defer plant den aufgerufenen Funktionsausdruck zur Ausführung ein, wenn die umgebende Funktion zurückkehrt. Das ist praktisch, weil sowohl der normale Rückgabepfad als auch ein früher Fehlerpfad die Aufräumregel teilen. Typischerweise prüfst du zuerst, ob die Akquisition erfolgreich war, und registrierst danach die Freigabe. Ein defer auf einem möglicherweise nilen Handle wäre dagegen ein unklarer Vertrag.',
 'Beachte, dass Argumente eines defer-Aufrufs bei Ausführung der defer-Anweisung ausgewertet werden. Mehrere Deferred Calls werden in umgekehrter Reihenfolge ausgeführt. Bei Ressourcen wie Dateien kann auch Close selbst Fehler liefern. Ob ein solcher Fehler relevant ist, hängt davon ab, ob du liest, schreibst oder Daten dauerhaft speichern willst. Bei einem schreibenden Stream muss ein fehlgeschlagener Abschluss möglicherweise ausdrücklich in das Rückgabeergebnis eingehen.',
 'file, err := os.Open(path)\nif err != nil { return err }\ndefer file.Close()\n// Datei lesen und weitere Fehler prüfen',
 'Der Skizzenausschnitt gehört in eine Funktion, die error zurückgeben kann; die Schließregel wird nach erfolgreichem Open registriert.'],
 ['wrapping','Fehlerkontext ist Teil der Wartbarkeit',
 'Ein nackter Fehler wie permission denied kann im Log schwer zuzuordnen sein, wenn ein Programm viele Dateien oder Netzwerkverbindungen verarbeitet. Mit fmt.Errorf("load catalog: %w", err) wird der Ursprung beschrieben und die Fehlerkette erhalten. Das erlaubt dem Aufrufer, mit errors.Is auf bekannte Sentinel-Fehler oder errors.As auf bestimmte Fehlertypen zu prüfen, ohne von einer reinen Fehlermeldung abhängig zu sein. Textvergleiche gegen err.Error() sind dagegen oft fragil.',
 'Ein guter Fehlerpfad unterscheidet erwartete Fälle, wie eine nicht existierende optionale Konfigurationsdatei, von tatsächlichen Betriebsfehlern. Wenn ein fehlendes Benutzerprofil fachlich zulässig ist, könnte ein eigenständiges Ergebnis oder ein speziell behandelter Fehler angemessen sein. Wer jeden Fehler zu nil umschreibt, lässt den Aufrufer glauben, der Ablauf sei erfolgreich gewesen. Eine saubere API sagt dagegen, wann sie keine Daten gefunden und wann sie ihre Aufgabe nicht erfüllen konnte.',
 'if errors.Is(err, os.ErrNotExist) {\n    return 0, nil // nur falls fehlende Datei fachlich als leer gilt\n}\nreturn 0, fmt.Errorf("load catalog: %w", err)',
 'Die Rückgabe nil ist eine bewusste Fachentscheidung; das vollständige Beispiel steht in einem passenden Funktionszweig.'],
 ['design','Go-Fehlerbehandlung ist sichtbar, nicht automatisch',
 'Die wiederholte Form if err != nil wirkt für Umsteiger zunächst ausführlich. Ihr Vorteil ist, dass Fehlerpfade an den Stellen stehen, an denen sie entstehen. Trotzdem kann Code unübersichtlich werden, wenn eine Funktion zu viele Aufgaben übernimmt. Teile umfangreiche Abläufe in kleine Operationen mit klaren Rückgabetypen. Eine Funktion sollte genau erklären, ob sie Ressourcen besitzt, welche Fehler sie erzeugen kann und wer sie schließen muss.',
 'Teste Dateifehler, unlesbare Eingaben und einen erfolgreichen Ablauf. Nutze für fehlerhafte Testdaten möglichst temporäre Verzeichnisse und kontrollierte Dateirechte, statt auf zufällige Systemumstände zu hoffen. Vermeide panic für gewöhnliche Eingabe- oder Netzwerkprobleme. panic ist kein Ersatz für einen normalen error-Vertrag, und recover sollte nicht zum Standardmechanismus der Geschäftslogik werden. Gut lesbare Go-Anwendungen machen Risiken ausdrücklich zum Teil ihres Ablaufes.',
 'func validateTitle(title string) error {\n    if strings.TrimSpace(title) == "" {\n        return errors.New("title must not be empty")\n    }\n    return nil\n}',
 'Die fachliche Vorbedingung besitzt einen einfachen, klaren error-Rückgabewert. Für die vollständige Funktion sind Imports strings und errors erforderlich.']
 ],
 questions:[
 ['Was bedeutet err == nil bei einer Go-Funktion mit Fehler-Rückgabe?','Es wurde kein Fehler über diesen Rückgabekanal signalisiert.','Die Funktion muss dennoch den vereinbarten Erfolgsvertrag einhalten.'],
 ['Wann wird defer file.Close() gewöhnlich registriert?','Nach einem erfolgreichen Öffnen der Datei.','Vor der Registrierung muss klar sein, dass ein gültiger File-Handle existiert.'],
 ['Warum ist fmt.Errorf mit %w besser für eine Fehlerkette als bloß %v?','Es erhält den eingebetteten Fehler für errors.Is und errors.As.','Der Aufrufer kann dadurch den zugrunde liegenden Fehlertyp erkennen, ohne Meldungstexte zu vergleichen.']
 ],
 exercise:'Implementiere loadCatalog(path string) ([]byte, error) mit os.ReadFile. Im Fehlerfall soll der Dateipfad als Kontext über fmt.Errorf und %w erhalten bleiben. Schreibe einen Test für eine fehlende Datei mit errors.Is(err, os.ErrNotExist) und einen Erfolgsfall mit einer temporären Datei. Erläutere, wann defer sinnvoll wäre.',
 solution:'Rufe data, err := os.ReadFile(path) auf; bei err != nil gib nil, fmt.Errorf("load %s: %w", path, err) zurück. Erfolgreich return data, nil. errors.Is erkennt weiterhin os.ErrNotExist. Da os.ReadFile den Handle intern verwaltet, ist hier kein eigenes defer nötig; bei os.Open plus Lesen registriere defer file.Close() nach erfolgreichem Open.'
},
{
 language:'kotlin',id:'kt-null-safety-model',title:'Kotlin: Nullsicherheit, sichere Aufrufe und Ausdrucksmodelle',
 objectives:['Nullable und nicht-nullable Typen im Kotlin-Code unterscheiden.','?. und ?: anhand einer konkreten fachlichen Regel einsetzen.','!! und Plattformtypen an Interop-Grenzen kritisch beurteilen.'],
 source:'https://kotlinlang.org/docs/null-safety.html',
 sections:[
 ['types','Null ist eine ausdrückliche Typentscheidung',
 'Kotlin unterscheidet normalerweise zwischen String und String?. Ein String-Wert soll nicht null sein, während String? den Nullfall ausdrücklich erlaubt. Auf einem nullable Wert kannst du nicht ohne Prüfung beliebige Member aufrufen. Diese Regel verändert die Art, wie Datenmodelle geschrieben werden: Eine verpflichtende Event-ID ist nicht dasselbe wie eine freiwillige Beschreibung. Wenn du den Unterschied im Typ ausdrückst, können Aufrufer früher erkennen, welche Fälle sie behandeln müssen.',
 'Das heißt nicht, dass zur Laufzeit niemals Nullprobleme vorkommen. Besonders bei Java-Interop kann Kotlin Plattformtypen erhalten, deren Nullbarkeit nicht vollständig durch Kotlin-Typannotationen beschrieben ist. Auch Reflection und ausdrücklich unsichere Operationen können Verträge verletzen. Nullsicherheit ist deshalb besonders wirksam, wenn die eigenen Modelle konsequent klar sind und unkontrollierte Fremdeingaben an einer definierten Grenze geprüft werden.',
 'data class Event(val id: String, val description: String?)\nval event = Event("E1", null)\nprintln(event.description?.length)',
 'Die Beschreibung darf fehlen, die ID ist im Kotlin-Modell als nicht-null modelliert.'],
 ['safe-call','?. führt nur bei vorhandenem Empfänger weiter',
 'Der sichere Aufruf ?. liefert null, wenn sein Empfänger null ist; andernfalls wird das nachfolgende Member ausgewertet. Dadurch lässt sich eine mögliche Beschreibung lesen, ohne vorher für jeden einfachen Zugriff einen eigenen if-Block zu benötigen. Der Elvis-Operator ?: kann anschließend einen Ersatzwert bestimmen. Die Kombination macht eine häufige Darstellung leicht lesbar: Wenn die Beschreibung vorhanden ist, zeige sie; andernfalls nimm einen ausdrücklich festgelegten Standardtext.',
 'Bei Verkettungen ist entscheidend, an welcher Stelle Null auftreten kann. Eine Kette aus ?. und ?: sollte nicht zu einem Ratespiel werden, das fachliche Unterschiede versteckt. Eine nicht vorhandene Beschreibung ist vielleicht normal, eine fehlende ID dagegen eine ungültige Eingabe. Behandle solche Fälle getrennt, damit ein Fehler nicht heimlich als leerer Text ausgegeben wird. Nullsicherheit soll einen Vertrag dokumentieren, nicht jede ungültige Situation stillschweigend kaschieren.',
 'val description: String? = null\nval display = description?.uppercase() ?: "Keine Beschreibung"\nprintln(display)',
 'Der Ersatz wird ausschließlich bei null gewählt. Ein leerer vorhandener String ist ein eigener Fall.'],
 ['smart-casts','Kontrollfluss kann Nullbarkeit präzisieren',
 'Nach einer Prüfung wie if (title != null) kann Kotlin den Wert in vielen Situationen als nicht-null behandeln. Das nennt sich Smart Cast. Er ist jedoch nur möglich, wenn der Compiler die Stabilität des geprüften Werts ausreichend begründen kann. Bei veränderlichen Properties oder parallel veränderbarem Zustand kann dieselbe Annahme zwischen Prüfung und Zugriff nicht immer gelten. Eine lokale, unveränderliche Variable ist häufig die einfachste Form, einen stabilen Vertrag auszudrücken.',
 'Das doppelte Ausrufezeichen !! erzwingt einen Zugriff unter der Annahme, dass der Wert nicht null ist. Wenn er doch null ist, führt dies zu einer Exception. Nutze !! deshalb nicht als generelle Methode, Compilerhinweise zum Schweigen zu bringen. Oft sind ein früher return, ein Elvis-Fehler oder ein klarer Smart Cast besser. Wer einen kritischen Nullfall fachlich ablehnen möchte, sollte einen beschreibenden Fehlervertrag wählen statt ihn zufällig durch NPE signalisieren zu lassen.',
 'fun titleLength(title: String?): Int {\n    if (title == null) return 0\n    return title.length\n}',
 'Die frühe Rückgabe behandelt null; der verbleibende Zweig besitzt einen nicht-null Titel.'],
 ['model','Nullbarkeit, Collections und Datenklassen ergänzen sich',
 'Eine List<String?> erlaubt nullable Elemente, während List<String>? eine ganze möglicherweise fehlende Liste beschreibt. Beides ist nicht dasselbe. Ein Datenmodell für Veranstaltungen kann eine immer vorhandene Liste von optionalen Beschreibungen benötigen oder eine optionale komplette Teilnehmerliste. Die Typen sollten diese fachlichen Unterschiede zeigen, damit die Auswertung nicht versehentlich eine leere Liste mit einer gar nicht geladenen Liste verwechselt.',
 'Kotlin-data classes generieren nützliche Methoden wie equals, hashCode, toString und copy auf Basis ihrer primären Konstruktor-Properties. Sie erzeugen aber nicht automatisch tiefe Unveränderlichkeit. Eine List in einer data class kann auf eine weiterhin veränderbare Implementierung verweisen. Auch die copy-Methode erstellt keine rekursive Tiefe-Kopie verschachtelter Objekte. Für verlässliche Domänenmodelle musst du daher Mutabilität, Nullbarkeit und Besitz beziehungsweise Teilen von Collections gemeinsam betrachten.',
 'data class Catalog(val titles: List<String>)\nval original = Catalog(listOf("Java"))\nval changed = original.copy(titles = original.titles + "Kotlin")',
 'Die plus-Operation konstruiert eine neue Liste mit einem zusätzlichen Wert; copy ersetzt die Listenreferenz im neuen Datenobjekt.']
 ],
 questions:[
 ['Worin unterscheiden sich String? und String in Kotlin?','String? erlaubt null als regulären Wert, String ist nicht-null vorgesehen.','Der Compiler verlangt für nullable Empfänger eine sichere Behandlung.'],
 ['Was tut der Operator !! bei tatsächlichem null?','Er löst eine Exception aus.','!! ist eine nicht überprüfte Zusicherung und keine automatische Fehlerheilung.'],
 ['Sind List<String?> und List<String>? identisch?','Nein.','Ersteres erlaubt fehlende Elemente; letzteres erlaubt eine fehlende Liste als Ganzes.']
 ],
 exercise:'Schreibe eine Kotlin-Funktion displayTitle(title: String?): String. Bei null soll "Unbekannt" erscheinen, bei einem blanken Titel "Ohne Titel", sonst der getrimmte Titel. Verwende Nullsicherheit bewusst und teste null, "", "   " sowie " Ada ".',
 solution:'Implementiere val text = title?.trim() ?: return "Unbekannt"; danach if (text.isBlank()) return "Ohne Titel"; schließlich return text. Dadurch werden der nicht vorhandene und der vorhandene, aber leere Wert fachlich getrennt. !! ist nicht nötig.'
}
];
export const NEW_LANGUAGE_CHAPTERS:readonly AuthoredLesson[]=lessons.map(input=>{
 const [first]=input.sections;
 const mainCode=first?.[4]??'';
 const chapter:TextbookChapter={
  conceptId:input.id,readingMinutes:28,
  objectives:input.objectives,
  sections:input.sections.map(([id,title,paragraphOne,paragraphTwo,code,annotation])=>({
   id,title,paragraphs:[paragraphOne,paragraphTwo],code,annotation
  })),
  checkpoints:input.questions.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:input.exercise,answer:input.solution}
 };
 const implementation:LanguageVariant={
  language:input.language,name:input.title,code:mainCode,
  explanation:'Das folgende Beispiel zeigt einen zentralen Zusammenhang des Kapitels in '+input.language+
   '. Es wird im Lehrtext eingeführt, mit typischen Fehlern abgegrenzt und durch Verständnisfragen sowie eine Transferaufgabe vertieft.',
  differences:'Die konkret geltenden Typ-, Besitz- und Laufzeitregeln sind sprachspezifisch; allgemeine Konzepte dürfen nicht ohne Prüfung eins zu eins übertragen werden.',
  equivalence:'related',docs:input.source
 };
 return {id:input.id,title:input.title,chapter,implementation};
});
