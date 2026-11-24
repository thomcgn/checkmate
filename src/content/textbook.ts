import {CONCEPTS,LANGUAGES} from './concepts.ts';
import {EXPANDED_TEXTBOOK} from './concept-expansion-textbook.ts';
import {COMPLETE_CONCEPT_BY_ID} from './complete-concepts.ts';
import {CONCEPT_METADATA} from './concept-metadata.ts';

export interface ChapterSection {
 readonly id:string;
 readonly title:string;
 readonly paragraphs:readonly string[];
 readonly code?:string;
 readonly annotation?:string;
}
export interface TextbookChapter {
 readonly conceptId:string;
 readonly readingMinutes:number;
 readonly objectives:readonly string[];
 readonly sections:readonly ChapterSection[];
 readonly checkpoints:readonly {question:string;answer:string;reason:string}[];
 readonly transfer:{prompt:string;answer:string};
 readonly glossary?:readonly {readonly term:string;readonly definition:string}[];
 readonly relatedConceptIds?:readonly string[];
 readonly sources?:readonly {readonly label:string;readonly url:string}[];
}
/** Self-contained, original German teaching text. Language implementations are taught in the comparison tab. */
const section=(id:string,title:string,paragraphs:string[],code?:string,annotation?:string):ChapterSection=>({id,title,paragraphs,code,annotation});
const chapter=(conceptId:string,readingMinutes:number,objectives:string[],sections:ChapterSection[],
 checkpoints:{question:string;answer:string;reason:string}[],transfer:{prompt:string;answer:string}):TextbookChapter=>
 ({conceptId,readingMinutes,objectives,sections,checkpoints,transfer});
const BASE_TEXTBOOK:readonly TextbookChapter[]=[
chapter('variables',16,[
 'Zwischen einem Wert, einem Namen und einer veränderbaren Speicherstelle unterscheiden.',
 'Erklären, warum eine Neuzuweisung nicht dasselbe wie das Verändern eines Objekts ist.',
 'Gültigkeitsbereich und Typprüfung anhand von Beispielen beurteilen.'
],[
 section('why','Warum Programme einen Zustand brauchen',[
  'Ein Programm muss sich Dinge merken: Wie viele Getränke sind noch da? Wer ist angemeldet? Welche Seite wurde ausgewählt? Solche Informationen nennen wir Zustand. Die einfachste Möglichkeit, einen Teil davon lesbar zu machen, ist eine Variable oder Namensbindung. Der Name stock sagt dabei mehr als eine anonyme Zahl 12.',
  'Wichtig: Eine Variable ist nicht überall dieselbe „Schublade im Arbeitsspeicher“. Java besitzt lokale Variablen mit statischem Typ; Python bindet Namen an Objekte; Rust lässt den Compiler Besitzregeln überprüfen. Das gemeinsame Konzept ist: Ein Name macht einen Wert in einem bestimmten Kontext verfügbar.',
  'Wenn du Quellcode liest, stelle immer drei Fragen: Welcher Wert liegt gerade vor? Woher kam er? Kann diese Stelle ihn verändern? Diese Fragen funktionieren unabhängig von der Programmiersprache.'
 ]),
 section('trace','Ein Zustand verändert sich',[
  'Beginne mit zwölf Flaschen. Bei einem Verkauf von drei Flaschen ändert sich die gespeicherte Bestandszahl. Danach prüfen wir, ob mindestens fünf Flaschen übrig sind. Das Ergebnis der letzten Zeile hängt ausschließlich davon ab, welchen Wert stock nach der Subtraktion hat.',
  'Gehe den Code Zeile für Zeile durch. Nach der ersten Zeile gilt stock = 12. Nach dem Verkauf gilt stock = 9. Die Bedingung 9 >= 5 ist wahr. Du brauchst noch keinen Debugger, um das Ergebnis vorherzusagen.'
 ],'int stock = 12;\nint sold = 3;\nstock = stock - sold;\nboolean enough = stock >= 5;\nSystem.out.println(enough); // true',
 'Zustandstabelle: Start 12 → Verkauf 3 → Rest 9 → genug? true.'),
 section('mutability','Neuzuweisung, Mutation und Unveränderlichkeit',[
  'Bei stock = stock - sold erhält der Name stock einen neuen Zahlenwert. Bei einer Liste oder einem Objekt kann dagegen derselbe Wertträger intern verändert werden. In Java verhindert final die Neuzuweisung einer Referenz, aber nicht zwingend das Verändern des referenzierten Objekts. TypeScript const hat eine ähnliche Grenze. Python-Tupel sind dagegen unveränderliche Sequenzen.',
  'Das ist für die Praxis wichtig: Wenn mehrere Teile deines Programms dasselbe veränderbare Objekt verwenden, kann eine Änderung an einer Stelle an anderer Stelle sichtbar werden. Ohne dieses Verständnis wirken Seiteneffekte später wie zufällige Fehler.'
 ]),
 section('scope','Typ und Gültigkeitsbereich',[
  'Ein Typ beschreibt, welche Operationen auf einem Wert sinnvoll sind. In Java erkennt der Compiler beispielsweise, dass String und int nicht beliebig addiert oder einander zugewiesen werden dürfen. Python erlaubt dynamische Bindungen, kann aber bei einer unpassenden Operation zur Laufzeit scheitern. TypeScript prüft vor dem Start und entfernt seine Typinformationen beim Übersetzen.',
  'Der Gültigkeitsbereich (Scope) legt fest, wo ein Name benutzt werden darf. Eine lokale Variable innerhalb einer Methode ist normalerweise nicht außerhalb dieser Methode sichtbar. Beschränkter Scope hilft beim Verstehen: Weniger Stellen können den Zustand beeinflussen.'
 ]),
 section('practice','Wann ist die Unterscheidung nützlich?',[
  'Beim Debuggen notierst du für einen Fehler zuerst den tatsächlichen Wert einer Variablen und den Weg dorthin. Bei unklaren Seiteneffekten prüfst du anschließend, ob zwei Namen auf dasselbe Objekt verweisen. Bei einem Typfehler schaust du nicht nur auf die aktuelle Zeile, sondern auf die deklarierte oder inferierte Bedeutung des Namens.',
  'Eine saubere Benennung wie remainingStock statt x ist nicht bloß Geschmack: Sie reduziert den mentalen Aufwand, wenn du Monate später zum Code zurückkehrst.'
 ])
],[
 {question:'Ändert final List<String> items = new ArrayList<>() die Liste zu einer unveränderlichen Collection?',answer:'Nein.',reason:'final schützt die Bindung items vor Neuzuweisung, nicht automatisch den Inhalt des referenzierten ArrayList-Objekts.'},
 {question:'Wodurch unterscheidet sich Python stock += 2 bei einer int-Zahl von list.append(x)?',answer:'Die Zahl bindet sich an einen neuen Wert; append verändert die vorhandene Liste.',reason:'int ist unveränderlich; list ist ein veränderbares Objekt.'}
],{prompt:'Du liest eine Funktion, die einen Bestand verändert. Zeichne eine Tabelle mit dem Wert nach jeder Codezeile und identifiziere alle Stellen, die ihn ändern können.',answer:'Notiere Startwert, jede Zuweisung und ihren neuen Wert. Prüfe bei Objekten zusätzlich Aliase und Methoden mit Seiteneffekten.'}),
chapter('conditionals',17,[
 'Bedingungen als Wahrheitswert-Ausdrücke lesen.',
 'Den Ablauf von if, else und Kurzschlussauswertung vorhersagen.',
 'Grenzfälle und Vorbedingungen eines fachlichen Zweiges erkennen.'
],[
 section('problem','Ein Programm trifft Entscheidungen',[
  'Eine Kasse verkauft nicht beliebig viele Getränke: Der Bestand muss ausreichen und die gewünschte Menge muss positiv sein. Damit haben wir zwei fachliche Regeln. Erst wenn beide erfüllt sind, darf sich der Bestand verändern. Der Programmcode ist die ausführbare Form dieser Regeln.',
  'Eine Bedingung ist ein Ausdruck, der letztlich entscheidet, ob ein bestimmter Pfad ausgeführt wird. Das ist mehr als Syntax: Jede Verzweigung verändert, welche Zustände nach der Ausführung überhaupt möglich sind.'
 ]),
 section('tracing','Die Entscheidung Schritt für Schritt',[
  'Bei einem Bestand von drei Flaschen und einer Bestellung von zwei Flaschen ist die Menge positiv und der Bestand ausreichend. Die beiden Teilbedingungen sind wahr, der Verkaufszweig wird ausgeführt und stock sinkt auf eins.',
  'Änderst du requested auf vier, bleibt der Bestand drei. Damit hast du eine erste Form von Test: dieselbe Funktion mit mehreren Eingaben gedanklich ausführen.'
 ],'int stock = 3;\nint requested = 2;\nif (requested > 0 && stock >= requested) {\n    stock -= requested;\n} else {\n    System.out.println("Verkauf abgelehnt");\n}', 'Grenzfälle: requested = 0, requested = stock, requested = stock + 1 und requested < 0.'),
 section('boolean','Logische Operatoren und Kurzschlussauswertung',[
  '&& verbindet Bedingungen mit logischem UND: Beide müssen wahr sein. || verbindet mit ODER: Eine wahre Bedingung reicht. Der Unterschied wird besonders wichtig, wenn die zweite Bedingung auf einen möglicherweise fehlenden Wert zugreift.',
  'Bei Kurzschlussauswertung wird der zweite Teil von && nicht ausgewertet, wenn der erste bereits falsch ist. Entsprechend wird bei || der zweite Teil nicht ausgewertet, wenn der erste bereits wahr ist. Das ermöglicht sicheres Prüfen, ersetzt aber keine sorgfältige Fehlerbehandlung.'
 ],'if (name != null && !name.isBlank()) {\n    System.out.println(name);\n}', 'Die zweite Prüfung erfolgt nur, wenn name nicht null ist.'),
 section('design','Lesbare Regeln statt verschachteltem Rätsel',[
  'Viele ineinander geschachtelte if-Anweisungen erschweren das Verstehen, weil man mehrere Bedingungen gleichzeitig im Kopf behalten muss. Eine klare Vorbedingung und frühe Rückgabe können eine fachliche Regel besser ausdrücken, solange die Sprache und der Kontext das zulassen.',
  'Benennbare Ausdrücke wie hasEnoughStock machen das „Warum“ sichtbar. Die Regel sollte nachvollziehbar bleiben, auch wenn du später mehr Fälle ergänzen musst.'
 ])
],[
 {question:'Was passiert bei stock=3 und requested=3?',answer:'Der Verkauf ist erlaubt, stock wird 0.',reason:'Der Vergleich >= schließt die Gleichheit ein.'},
 {question:'Wird name.isBlank() bei name == null ausgewertet?',answer:'Nein.',reason:'Der &&-Operator wertet den rechten Ausdruck bei falschem linken Ausdruck nicht aus.'}
],{prompt:'Formuliere eine Zutrittsregel für eine Veranstaltung: Ticket gültig UND Alter mindestens 18. Nenne zwei Ablehnungsfälle.',answer:'Beide Bedingungen sind notwendig. Abgelehnt wird bei ungültigem Ticket oder Alter unter 18, auch wenn die jeweils andere Bedingung erfüllt ist.'}),
chapter('sequences',20,[
 'Indexierte Sequenzen und dynamische Listen unterscheiden.',
 'Den Unterschied zwischen Position und Elementinhalt verstehen.',
 'Kosten von Suchen, Einfügen und Entfernen grob abschätzen.'
],[
 section('model','Warum mehrere Werte nicht einfach mehrere Variablen sind',[
  'Drei Getränke ließen sich noch als first, second und third speichern. Sobald die Anzahl unbekannt ist, scheitert dieses Modell: Du brauchst eine Datenstruktur, deren Elemente du systematisch erreichen und verarbeiten kannst. Eine Sequenz fasst mehrere Werte zusammen und ordnet ihnen Positionen zu.',
  'Eine Liste beantwortet „Welches Element steht an Position zwei?“; sie beantwortet nicht automatisch „Welcher Artikel gehört zur ID A7?“. Diese Unterscheidung führt später direkt zu Maps.'
 ]),
 section('indices','Indexierung und Grenzen',[
  'Die meisten verbreiteten Programmiersprachen verwenden den Index null für das erste Element. Eine Liste mit drei Werten besitzt daher gültige Positionen 0, 1 und 2. Index 3 ist nicht der dritte, sondern der vierte Zugriff und damit außerhalb der Liste.',
  'Denke über Werte und Positionen getrennt nach: Zweimal „Cola“ sind zwei Listeneinträge, auch wenn der Text gleich ist.'
 ],'List<String> drinks = new ArrayList<>(List.of("Cola", "Wasser", "Cola"));\nSystem.out.println(drinks.get(1)); // Wasser\nSystem.out.println(drinks.size()); // 3', 'Positionen: 0→Cola, 1→Wasser, 2→Cola. Der Wert Cola ist doppelt erlaubt.'),
 section('types','Array, Liste, Vektor und Slice',[
  'Ein Array ist häufig eine Sequenz fester Länge. Eine ArrayList beziehungsweise ein Vec ist dagegen ein dynamisch wachsender Container. In Go ist ein Slice eine Sicht auf ein zugrunde liegendes Array; Änderungen, Kapazität und append besitzen daher ein besonderes Verhalten. Python list entspricht konzeptionell eher einer dynamischen Liste als einem Java-Array.',
  'Die Namen unterscheiden sich, weil die Sprachen unterschiedliche Garantien anbieten. Checkmate soll dir deshalb zeigen, welche Aufgaben vergleichbar sind – und an welchen Stellen du vorsichtig sein musst.'
 ]),
 section('costs','Welche Operation ist günstig?',[
  'Bei array-basierten Listen ist der Zugriff über einen bekannten Index gewöhnlich effizient. Ein bestimmtes Element allein anhand seines Inhalts zu finden, erfordert dagegen häufig das Durchsuchen der Liste. Ein Einfügen am Anfang kann viele Elemente verschieben.',
  'Damit wird die Wahl der Datenstruktur zur fachlichen Entscheidung: Brauchst du Reihenfolge? Häufiges Einfügen? Direkten Zugriff über Schlüssel? Keine dieser Fragen beantwortet der Name „Array“ allein.'
 ])
],[
 {question:'Wie viele gültige Indizes hat eine Liste mit fünf Elementen?',answer:'Fünf: 0 bis 4.',reason:'Die Anzahl ist fünf, aber die Indexzählung beginnt bei null.'},
 {question:'Darf eine List zweimal denselben Wert enthalten?',answer:'Ja.',reason:'Listen sichern Reihenfolge, aber nicht die Eindeutigkeit der Werte.'}
],{prompt:'Du speicherst Warenkorbpositionen und willst ihre Anzeigereihenfolge bewahren. Welche Struktur ist naheliegend und wann würdest du stattdessen eine Map ergänzen?',answer:'Eine Liste für die Positionen. Eine ergänzende Map kann schnelle Suche über eindeutige Artikel-IDs ermöglichen.'}),
chapter('key-value',26,[
 'Map, Array und Set nach ihrem Zweck auseinanderhalten.',
 'Schlüssel, Hashing und Gleichheit verständlich erklären.',
 'Fehlende Schlüssel und Überschreiben ohne Denkfehler behandeln.',
 'Java HashMap, Python dict und Rust HashMap semantisch vergleichen.'
],[
 section('problem','Das Problem: Suchen ohne vollständiges Durchlaufen',[
  'Stell dir ein Lager mit 10.000 Artikeln vor. Eine Liste aller Bestände kann jeden Artikel enthalten – aber um den Bestand von „cola“ zu finden, müsstest du möglicherweise viele Einträge untersuchen. Du kennst die Artikelnummer bereits. Du willst also nicht die Position wissen, sondern eine Zuordnung von dieser Nummer zu einem Wert.',
  'Genau das modelliert eine Map: Ein Schlüssel (key) verweist auf den zugehörigen Wert (value). Ein Schlüssel ist innerhalb einer Map eindeutig. Ein neuer Eintrag zum gleichen Schlüssel ergänzt normalerweise keinen zweiten Artikel, sondern ersetzt die vorhandene Zuordnung.',
  'Du solltest dir ein Dictionary deshalb nicht als besondere Array-Syntax merken. Ein Python dict, eine Java HashMap und eine Rust HashMap lösen ein ähnliches Zuordnungsproblem. Ihre Regeln sind aber nicht identisch.'
 ]),
 section('example','Ein Beispiel vollständig durchlaufen',[
  'Wir legen zuerst einen Bestand für Cola an, dann für Wasser. Wenn die nächste Lieferung den Cola-Bestand auf zehn setzt, wird die vorherige Zuordnung für Cola überschrieben. Anschließend liefert die Abfrage über den Schlüssel Cola den aktuellen Wert.',
  'Die Map hat am Ende zwei Schlüssel, nicht drei. Der entscheidende Unterschied zur Liste: Zwei gleiche Schlüssel sind keine zwei Positionen.'
 ],'Map<String, Integer> stock = new HashMap<>();\nstock.put("cola", 12);\nstock.put("water", 7);\nstock.put("cola", 10);\nSystem.out.println(stock.get("cola")); // 10\nSystem.out.println(stock.size()); // 2',
 'Nach jeder Zeile: {} → {cola=12} → {cola=12, water=7} → {cola=10, water=7}.'),
 section('hash','Wie funktioniert Hashing – ohne Magie?',[
  'Eine HashMap verwendet aus dem Schlüssel abgeleitete Hashinformationen, um einen passenden Speicherbereich zu finden. Der Hashwert ist keine eindeutige ID: Zwei verschiedene Schlüssel können denselben Hashwert erhalten. In diesem Fall muss die Datenstruktur weiterhin anhand ihrer Gleichheitsregeln unterscheiden können.',
  'Deshalb gehören bei eigenen Java-Schlüsselklassen equals und hashCode zusammen. Objekte, die equals als gleich betrachtet, müssen denselben Hashcode liefern. Verändert sich ein Schlüssel nach dem Einfügen so, dass sich sein Hashwert ändert, kann er in der Map unauffindbar erscheinen.',
  'Ein Hash-Lookup ist im typischen Fall effizient, aber keine absolute Garantie für konstante Laufzeit unter allen denkbaren Eingaben. Diese Aussage ist präziser als „HashMaps sind immer O(1)“.'
 ]),
 section('absence','Der vielleicht wichtigste Grenzfall: Schlüssel fehlt',[
  'Was passiert, wenn du „juice“ abfragst? In Java liefert get normalerweise null, sofern keine Zuordnung gefunden wurde – aber null könnte auch selbst als Wert in einer HashMap gespeichert sein. Möchtest du sicher wissen, ob ein Schlüssel existiert, nutze containsKey.',
  'Python unterscheidet dict["juice"] (KeyError) von dict.get("juice") (None als Standard). Rust liefert Option<&V>, das du als Some oder None behandeln musst. Go bietet ein zweites bool-Ergebnis, oft „comma-ok“ genannt. Diese Unterschiede sind keine bloßen Syntaxvarianten; sie ändern, wie Fehler und Abwesenheit modelliert werden.'
 ],'if (stock.containsKey("juice")) {\n    System.out.println(stock.get("juice"));\n} else {\n    System.out.println("Artikel nicht eingetragen");\n}', 'containsKey prüft Existenz und verwechselt den Wert 0 nicht mit „fehlend“.'),
 section('ordering','Reihenfolge, Gleichheit und praktische Auswahl',[
  'Eine gewöhnliche Java HashMap garantiert keine Iterationsreihenfolge. Ein modernes Python dict bewahrt die Einfügereihenfolge. In JavaScript ist Map ebenfalls einfügegeordnet. Rusts Standard-HashMap garantiert dagegen keine feste Reihenfolge. Wenn die Reihenfolge Teil der Fachanforderung ist, musst du das ausdrücklich berücksichtigen.',
  'Für Lagerbestände, Einstellungen oder die Zuordnung von Benutzer-IDs sind Maps häufig passend. Für einen Warenkorb, in dem Reihenfolge und Wiederholungen wichtig sind, ist eine Liste oft verständlicher. Soll nur festgehalten werden, welche IDs vorhanden sind, reicht möglicherweise ein Set.'
 ])
],[
 {question:'Nach put("cola", 12) und put("cola", 10): Wie viele Zuordnungen für cola gibt es?',answer:'Eine, mit dem Wert 10.',reason:'In einer Map ist der Schlüssel eindeutig; der zweite put ersetzt die erste Zuordnung.'},
 {question:'Warum ist get("juice") == null nicht immer gleichbedeutend mit „Schlüssel existiert nicht“?',answer:'Weil eine Java HashMap null als Wert speichern kann.',reason:'containsKey prüft die Existenz unabhängig vom gespeicherten Wert.'},
 {question:'Ist ein Python dict ein Java-Array?',answer:'Nein.',reason:'Ein dict bildet Schlüssel auf Werte ab; ein Array dient hauptsächlich dem Zugriff über Positionen.'}
],{prompt:'Entwirf einen Lagerbestand, bei dem Artikel über IDs nachgeschlagen und in der Reihenfolge ihrer Eingabe angezeigt werden. Welche Datenstrukturen brauchst du?',answer:'Eine Map für den Bestand und eine explizit geordnete Struktur für die Anzeige; alternativ eine Map-Implementierung mit definierter Reihenfolge, sofern sie die Anforderungen erfüllt.'}),
chapter('uniqueness',17,[
 'Eindeutigkeit als fachliche Anforderung erkennen.',
 'Set und List voneinander unterscheiden.',
 'Gleichheit und Hashing als Regeln für Duplikate erklären.'
],[
 section('purpose','Wann ist eine doppelte Information falsch?',[
  'Beim Registrieren von Teilnehmern darf dieselbe ID nur einmal gezählt werden. Eine Liste speichert dieselbe ID dagegen ohne Widerspruch mehrfach. Beide Strukturen sind korrekt – für unterschiedliche Anforderungen. Wenn Eindeutigkeit zur Aufgabe gehört, drückt ein Set diese Regel direkt aus.',
  'Damit sparst du dir oft manuell geschriebenen Code zum vorherigen Durchsuchen einer Liste.'
 ]),
 section('trace','Einfügen und Ergebnis erkennen',[
  'Beim ersten Einfügen von A7 ändert sich die Menge. Das zweite Einfügen derselben ID fügt keinen neuen Wert hinzu. In Java meldet add per boolean, ob sich die Menge verändert hat. Python set.add hat dagegen keinen solchen Rückgabewert.'
 ],'Set<String> processed = new HashSet<>();\nSystem.out.println(processed.add("A7")); // true\nSystem.out.println(processed.add("A7")); // false\nSystem.out.println(processed.size()); // 1',
 'Das Set hat nach beiden Aufrufen genau ein Element.'),
 section('equality','Wie erkennt ein Set denselben Wert?',[
  'Ein HashSet kann Elemente nur dann sinnvoll auf Eindeutigkeit prüfen, wenn Gleichheit und Hashwert zusammenpassen. Bei Java-Klassen mit eigenen fachlichen IDs können equals und hashCode implementiert werden. Bei Java Records wird Wertgleichheit automatisch generiert.',
  'In Python müssen Set-Elemente hashbar sein. Eine veränderliche Python list kann nicht direkt als Set-Element verwendet werden. JavaScript Set prüft Objekte nach Referenzidentität – zwei gleich aussehende, separat erzeugte Objekte werden nicht automatisch als ein Element erkannt.'
 ]),
 section('selection','Set, List oder Map?',[
  'Wähle Set für Mitgliedschaft und Eindeutigkeit, List für Reihenfolge und mögliche Wiederholungen, Map für Schlüssel-Wert-Zuordnungen. Falls du sowohl Eindeutigkeit als auch eine definierte Reihenfolge brauchst, ist die konkrete Implementierung entscheidend – eine gewöhnliche HashSet garantiert diese Reihenfolge nicht.'
 ])
],[
 {question:'Was ist die Größe von Set.of("A","B")?',answer:'Zwei.',reason:'Beide Werte sind eindeutig.'},
 {question:'Ist ein HashSet automatisch alphabetisch sortiert?',answer:'Nein.',reason:'Sortierung ist keine Zusage dieser Implementierung.'}
],{prompt:'Du willst erkennen, ob ein Event bereits importiert wurde. Welchen eindeutigen Schlüssel bildest du und wo speicherst du ihn?',answer:'Einen stabilen Fachschlüssel etwa aus Veranstaltungs-ID oder aus Titel, Ort und Datum, sofern diese Kombination wirklich eindeutig ist, und speicherst ihn in einem Set.'}),
chapter('functions',19,[
 'Parameter, Argumente und Rückgabewerte korrekt benennen.',
 'Funktionen aus fachlichen Regeln ableiten.',
 'Reine Funktionen von Funktionen mit Seiteneffekten unterscheiden.'
],[
 section('why','Warum Namen für Verhalten wichtig sind',[
  'Du könntest stock - sold an fünf Stellen im Code wiederholen. Wenn später eine Regel hinzukommt, müsstest du alle Stellen ändern. Eine Funktion oder Methode bündelt die Berechnung unter einem Namen und schafft einen Ort, an dem diese Regel getestet und verstanden werden kann.',
  'Der Unterschied zwischen Argument und Parameter ist dabei einfach: Die Funktion deklariert Parameter wie stock; beim Aufruf übergibst du konkrete Argumente wie 10.'
 ]),
 section('execution','Aufruf Schritt für Schritt',[
  'Bei remaining(10, 3) erhält der Parameter stock den Wert 10 und sold den Wert 3. Der Ausdruck wird ausgewertet. return gibt die 7 an die aufrufende Stelle zurück. Die Funktion ist danach beendet.',
  'Zeichne dir beim Lesen eines Aufrufs ruhig einen kleinen Stackframe: Eingaben, lokale Variablen und Rückgabe. Das ist die Grundlage für späteres Debugging und Rekursion.'
 ],'static int remaining(int stock, int sold) {\n    if (sold < 0 || sold > stock) {\n        throw new IllegalArgumentException("Ungültiger Verkauf");\n    }\n    return stock - sold;\n}\nint available = remaining(10, 3); // 7',
 'Die Vorbedingung verwirft negative Mengen und Überverkauf. Die Berechnung liefert einen Wert, ohne globalen Zustand zu verändern.'),
 section('purity','Seiteneffekte und Testbarkeit',[
  'Eine reine Berechnung verändert keinen Zustand außerhalb ihrer Eingaben und liefert bei gleichen Eingaben dasselbe Ergebnis. Solche Funktionen lassen sich besonders leicht testen. Eine Funktion, die eine Datenbank aktualisiert oder eine Datei schreibt, besitzt dagegen Seiteneffekte und braucht mehr Testaufwand.',
  'Das bedeutet nicht, dass Seiteneffekte verboten sind. Wichtig ist, dass du erkennst, an welchen Stellen dein Code die Außenwelt verändert, und dass diese Stellen klar begrenzt bleiben.'
 ]),
 section('design','Gute Signaturen erklären die Absicht',[
  'Die Signatur sagt dir, welche Eingaben erwartet werden und was zurückkommt. Methoden mit zehn kaum unterscheidbaren Parametern sind schwer zu benutzen; dann kann ein sinnvoller Datenträger helfen. Eine kleine Funktion, deren Name und Rückgabewert das Verhalten erklären, ist wertvoller als eine bloß verkürzte große Methode.'
 ])
],[
 {question:'Was ist bei remaining(10,3) der Parameter und was das Argument?',answer:'stock und sold sind Parameter; 10 und 3 sind Argumente.',reason:'Parameter sind Platzhalter in der Definition, Argumente konkrete übergebene Werte.'},
 {question:'Verändert remaining(10,3) den lokalen Wert 10 des Aufrufers?',answer:'Nein.',reason:'Die Berechnung liefert 7 zurück und ändert keinen äußeren Zustand.'}
],{prompt:'Extrahiere eine wiederholte Preisberechnung in eine Funktion. Welche fachlichen Validierungen würdest du in der Signatur oder Implementierung sichtbar machen?',answer:'Zum Beispiel Preis und Menge als Eingaben, ein klarer Rückgabewert, Ablehnung negativer Mengen und bei Geldwerten eine geeignete Dezimalrepräsentation.'}),
chapter('records',27,[
 'Einen Datenträger vom Verhalten eines Domänenobjekts unterscheiden.',
 'Flache Unveränderlichkeit, Wertgleichheit und Kopieren auseinanderhalten.',
 'Java record, Python dataclass, Kotlin data class und Rust struct differenziert vergleichen.'
],[
 section('why','Warum gibt es Records?',[
  'Stell dir eine Bestellposition vor: Sie besteht aus Artikel-ID, Menge und Einzelpreis. Drei getrennte Parameter können versehentlich vertauscht werden oder auseinandergeraten. Ein Datenträger bündelt die Felder zu einem fachlich benennbaren Wert. Damit kann ein Methodenaufruf statt vieler einzelner Zahlen ein einziges Item annehmen.',
  'In klassischen Java-Klassen brauchte ein solcher Datenträger oft Konstruktor, Getter, equals, hashCode und toString. Ein Java record erzeugt diese Standardmechanik automatisch. Das ist nicht nur weniger Code: Der Compiler macht den Zusammenhang der Felder ausdrücklich sichtbar.'
 ]),
 section('example','Wertgleichheit konkret beobachten',[
  'Zwei Instanzen eines Java record mit denselben Komponenten werden nach ihren Komponenten verglichen. Sie sind nicht dieselbe Objektidentität, können aber fachlich denselben Wert beschreiben. Ein solcher Wertvergleich eignet sich beispielsweise für Schlüssel, Datenübertragung oder Tests.',
  'Probiere gedanklich die nächste Änderung: Wenn amount unterschiedlich ist, liefert equals false. Ein Java record besitzt keine regulären Setter, um die Komponente nachträglich zu überschreiben.'
 ],'record Item(String id, int amount) {\n    Item {\n        if (id == null || id.isBlank() || amount <= 0) {\n            throw new IllegalArgumentException("Ungültige Position");\n        }\n    }\n}\nItem first = new Item("A7", 2);\nItem second = new Item("A7", 2);\nSystem.out.println(first.equals(second)); // true',
 'Der kompakte Konstruktor validiert die Daten. Beide Instanzen erfüllen die Regeln und besitzen gleiche Komponenten.'),
 section('immutable','Flach unveränderlich bedeutet nicht tief unveränderlich',[
  'Ein Record-Feld kann eine Liste oder ein anderes veränderbares Objekt enthalten. Zwar kann die Record-Komponente nicht neu auf ein anderes Objekt zeigen, aber der Inhalt der Liste kann trotzdem veränderbar sein. Deshalb sind Records nicht automatisch tief unveränderlich.',
  'Wenn ein Datenträger wirklich unveränderlich sein soll, müssen auch die darin enthaltenen Werte oder Kopien kontrolliert werden. Das ist ein häufiger Fehler bei Bibliotheksmodellen, Caches und nebenläufigem Code.'
 ],'record Tags(List<String> values) {\n    Tags {\n        values = List.copyOf(values);\n    }\n}', 'List.copyOf erstellt eine nicht modifizierbare Liste als Komponente. Null-Elemente werden abgelehnt.'),
 section('languages','Warum die Alternativen nicht identisch sind',[
  'Python dataclass kann mit frozen=True die gewöhnliche Feldzuweisung verhindern; Python erzwingt Typannotationen aber nicht automatisch zur Laufzeit. Kotlin data class generiert equals, hashCode und copy, wobei copy normalerweise flach ist. Ein Rust struct bündelt Felder, erhält Gleichheit jedoch erst über einen passenden Trait beziehungsweise derive. In TypeScript beschreibt Readonly nur einen statischen Vertrag und ändert die Laufzeitgleichheit nicht.',
  'Die gemeinsame Idee heißt „benannte zusammengehörige Daten“. Die Details – Gleichheit, Speichermodell, Kopierverhalten und Mutierbarkeit – unterscheiden sich fundamental. Diese Unterschiede gehören zur Lösung eines Problems, nicht zu einer bloß anderen Schreibweise.'
 ]),
 section('tradeoff','Records sind nicht für jedes Objekt geeignet',[
  'Ein Datenobjekt mit klaren Werten ist ein guter Kandidat. Eine fachliche Entität mit eigener Identität und vielen kontrollierten Zustandsübergängen kann dagegen in einer normalen Klasse verständlicher sein. Entscheide anhand der Aufgabe: Soll das Objekt vor allem Werte darstellen, oder besitzt es Verhalten und einen Lebenszyklus?'
 ])
],[
 {question:'Sind zwei Java Records mit gleichen Komponenten automatisch dasselbe Objekt?',answer:'Nein, sie können verschiedene Objekte sein, aber equals liefert true.',reason:'Wertgleichheit und Objektidentität sind unterschiedliche Begriffe.'},
 {question:'Macht record Tags(List<String> values) die Liste automatisch unveränderlich?',answer:'Nein.',reason:'Nur die Komponentenreferenz ist final; der Listeninhalt muss separat geschützt werden.'},
 {question:'Ist Readonly<{id:string}> in TypeScript zur Laufzeit dasselbe wie Java record?',answer:'Nein.',reason:'TypeScript-Typen werden beim Übersetzen entfernt und erzeugen keine automatische Wertgleichheit.'}
],{prompt:'Du brauchst einen stabilen Artikelwert, der als Cache-Schlüssel verwendet werden soll. Welche Felder und Regeln gehören in den Datenträger, und welche sollten nicht nachträglich mutieren?',answer:'Nur fachlich relevante, möglichst unveränderliche Komponenten. Besonders für Gleichheit und Hashing benutzte Felder dürfen während der Schlüsselverwendung nicht unkontrolliert verändert werden.'}),
chapter('generics',32,[
 'Den Unterschied zwischen Typ und Typparameter erklären.',
 'Generische Klassen und Methoden anhand konkreter Aufrufe auflösen.',
 'Invarianz und Type Erasure an einem Beispiel verstehen.',
 'Eine einfache generische Methode selbst entwerfen und absichern.'
],[
 section('problem','Warum List<String> existiert',[
  'Stell dir einen Warenkorb mit Artikelnummern vor. Du willst aus der Liste ausschließlich Strings erhalten. Ohne einen Vertrag über die Elementtypen müsstest du bei jeder Entnahme prüfen, ob der Wert wirklich ein String ist. Ein Fehler taucht möglicherweise erst beim Ausführen auf.',
  'Generics verschieben einen Teil dieser Kontrolle auf die Ebene der Typprüfung: List<String> beschreibt eine Liste von Strings, List<Integer> eine Liste von Integer-Werten. Der Code des Containers muss für diese beiden Anwendungsfälle nicht zweimal geschrieben werden.',
  'Das ist kein magischer Behälter, der sich jede beliebige Zutat selbst zurechtlegt. Die konkrete Typinformation wird beim Verwenden des generischen Vertrags festgelegt. Der Compiler kann damit ungültige Kombinationen früh abweisen.'
 ]),
 section('placeholder','T ist ein Typ-Platzhalter, kein Objekt',[
  'In class Box<T> ist T ein Typparameter. Die Klasse beschreibt, dass das Feld value den gleichen Typ besitzt wie der Rückgabewert der Methode get. Erst beim Verwenden von Box<String> wird T in diesem Zusammenhang zu String. Das ist ein Vertrag zwischen mehreren Stellen des Codes.',
  'Wenn du T als Variable mit einem Wert verwechselst, wird der Code verwirrend. T steht für einen Typ, nicht für eine konkrete Cola-Flasche. Ein generischer Vertrag muss die erlaubten Operationen für alle passenden T einhalten.'
 ],'final class Box<T> {\n    private final T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n}\nBox<String> drink = new Box<>("Cola");\nString name = drink.get();\n// Box<String> invalid = new Box<>(42); // Compilerfehler',
 'Box<String> bindet T an String. Konstruktor und get arbeiten mit demselben Typ. Bei 42 passt die Typbeziehung nicht.'),
 section('method','Eine generische Methode ist etwas anderes als eine generische Klasse',[
  'Nicht nur Klassen können Typparameter besitzen. Eine Methode kann für jeden Aufruf ihren eigenen Parameter T definieren. Dadurch kannst du dieselbe first-Methode für Strings oder Zahlen verwenden. Die Methodendeklaration stellt <T> vor den Rückgabetyp.',
  'Eine robuste Funktion muss aber auch fachliche Grenzfälle bedenken: Was passiert, wenn die Liste leer ist? Generics lösen keine Fehler bei ungültigen Indizes. Deshalb kann Optional<T> oder eine dokumentierte Vorbedingung angebracht sein.'
 ],'static <T> Optional<T> first(List<T> items) {\n    if (items.isEmpty()) return Optional.empty();\n    return Optional.of(items.get(0));\n}\nOptional<String> a = first(List.of("Cola", "Wasser"));\nOptional<Integer> b = first(List.of(10, 20));',
 'Im ersten Aufruf ist T gleich String, im zweiten Integer. Bei leerer Liste entsteht Optional.empty statt einer Index-Exception.'),
 section('invariance','Warum List<Integer> nicht List<Number> ist',[
  'Eine verbreitete Stolperfalle ist Invarianz. Integer ist zwar ein Untertyp von Number, trotzdem ist List<Integer> nicht automatisch ein Untertyp von List<Number>. Wenn man das erlauben würde, könnte eine Methode möglicherweise eine Double-Zahl in die ursprüngliche Liste von Integern schreiben – der versprochene Inhaltstyp wäre gebrochen.',
  'Wenn du nur lesen willst, kann ein oberer Wildcard-Typ helfen, etwa List<? extends Number>. Dann kannst du Zahlen als Number betrachten, aber nicht beliebig neue Number-Werte einfügen. Wenn du Werte hinzufügen möchtest, kommt eine untere Grenze wie ? super Integer infrage.',
  'Die Merkhilfe PECS lautet „Producer Extends, Consumer Super“. Sie ersetzt nicht das Verständnis: Entscheidend ist, ob du typisierte Werte aus einer Struktur herausholst oder hineinschreibst.'
 ],'static double sum(List<? extends Number> numbers) {\n    double result = 0;\n    for (Number number : numbers) result += number.doubleValue();\n    return result;\n}',
 'Die Methode akzeptiert z. B. List<Integer> und List<Double>, weil sie die Elemente nur als Number liest.'),
 section('runtime','Was Type Erasure bedeutet',[
  'Java verwendet für viele generische Typen Type Erasure. Die Typprüfung ist Teil der Übersetzung; zur Laufzeit existiert nicht automatisch ein eigener Klassenkörper Box<String> neben Box<Integer>. Deshalb sind manche Typprüfungen oder die direkte Erzeugung new T() nicht möglich.',
  'Rust führt generische Typen dagegen häufig durch Monomorphisierung in konkrete Varianten über. TypeScript entfernt seine Typinformationen ebenfalls, besitzt aber ohnehin die JavaScript-Laufzeit. Python-Typannotationen werden häufig von statischen Tools ausgewertet und sind grundsätzlich keine automatische Laufzeitvalidierung. Wieder gilt: vergleichbares Problem, unterschiedliche technische Lösung.'
 ]),
 section('practice','Wann Generics sinnvoll sind – und wann nicht',[
  'Generics lohnen sich, wenn eine Beziehung zwischen Typen ausgedrückt wird: eine Collection enthält Werte eines bestimmten Typs, ein Repository liefert das passende Entitätsobjekt oder eine Methode gibt denselben Typ zurück, den sie erhält. Generische Parameter ohne erkennbare Beziehung machen eine API dagegen unnötig kompliziert.',
  'Beim Lernen hilft es, für jeden Typparameter eine Tabelle auszufüllen: Wo wird T deklariert? Welcher konkrete Typ ersetzt T an der Aufrufstelle? Welche Stellen müssen danach denselben Typ verwenden? Welche Fehlermeldung würde ein falsches Argument erzeugen?'
 ])
],[
 {question:'Ist T in Box<T> eine Variable mit einem Wert?',answer:'Nein, T ist ein Typparameter.',reason:'Der Compiler löst damit Typbeziehungen zwischen Konstruktor, Feld und Methoden auf.'},
 {question:'Darf eine Methode List<Number> mit einer List<Integer> aufgerufen werden?',answer:'Nicht ohne Weiteres.',reason:'Java-Generics sind hier invariant, um unzulässiges Einfügen anderer Number-Untertypen zu verhindern.'},
 {question:'Welche Wildcard passt zu einer Liste, aus der du lediglich Number-Werte lesen willst?',answer:'? extends Number.',reason:'Der Container produziert Werte, die mindestens als Number gelesen werden können.'}
],{prompt:'Entwirf ein generisches Result<T>, das entweder einen Wert T oder einen Fehler enthält. Welche Zustände sind zulässig, und wie verhinderst du einen Zustand mit beidem?',answer:'Modelliere ausdrücklich disjunkte Erfolgs- und Fehlerzustände, zum Beispiel mit einem sealed Interface und zwei Implementierungen oder einem geeigneten Result-Typ. Der Typparameter T steht nur für den erfolgreichen Wert.'}),
chapter('stream-pipelines',34,[
 'Quelle, Zwischenoperation und Terminaloperation sicher unterscheiden.',
 'filter, map und collect/toList schrittweise vorhersagen.',
 'Lazy vs. eager Evaluation und Stream-Einmalverwendung erklären.',
 'Verstehen, wann eine Schleife besser lesbar ist.'
],[
 section('problem','Warum Streams überhaupt?',[
  'Stell dir vor, ein Service besitzt eine Liste von Veranstaltungen. Gesucht werden nur Events in Münster, die in der Zukunft liegen, und anschließend sollen ihre Titel angezeigt werden. Du könntest jede Regel in einer for-Schleife abarbeiten. Eine Stream-Pipeline kann dieselbe Datenverarbeitung als Folge benannter Transformationen ausdrücken.',
  'Eine Pipeline ist keine Collection. Sie beschreibt, welche Verarbeitung aus einer Quelle stattfinden soll. Datenquelle, Operationen und Ergebnis musst du deshalb gedanklich voneinander trennen. Genau diese Trennung macht Streams anfangs ungewohnt.'
 ]),
 section('pipeline','Die drei Phasen erkennen',[
  'Ein Stream beginnt mit einer Quelle, etwa List.of(1,2,3,4,5). Zwischenoperationen beschreiben Filterung oder Veränderung. Die Terminaloperation startet die Auswertung und liefert das Resultat. In Java sind filter und map bei einer typischen sequenziellen Pipeline lazy: Erst toList fordert die Werte wirklich an.',
  'Prüfe vor dem Lesen des Ergebnisses den Typ jeder Zwischenstufe. Nach filter bleiben Integer übrig. Nach map(n -> n*n) sind es weiterhin Integer, aber mit anderen Werten. Mit toList entsteht eine Liste.'
 ],'List<Integer> result = List.of(1, 2, 3, 4, 5).stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * n)\n    .toList();\nSystem.out.println(result); // [4, 16]',
 'Quelle [1,2,3,4,5] → Filter [2,4] → Abbildung [4,16] → Liste [4,16].'),
 section('functions','Lambdas und Method References verstehen',[
  'Die Schreibweise n -> n % 2 == 0 ist eine Lambda-Funktion: Sie bekommt eine Zahl und gibt einen Wahrheitswert zurück. filter nutzt dieses Prädikat, um Elemente zu behalten oder zu verwerfen. map erwartet dagegen eine Funktion, die aus einem Eingabewert einen Ausgabewert erzeugt.',
  'Method References wie String::toUpperCase sind eine kompakte Schreibweise für geeignete Funktionsaufrufe. Sie sind kein eigener Algorithmus. Wenn dir eine Methodenreferenz unklar ist, schreibe sie gedanklich als Lambda aus.'
 ],'List<String> upper = List.of("Ada", "Kim").stream()\n    .map(String::toUpperCase)\n    .toList();\n// Entspricht inhaltlich: .map(name -> name.toUpperCase())',
 'map verändert nicht die ursprünglichen Strings; es erzeugt die transformierten Ergebnisse.'),
 section('trace','Datenfluss gegen Filterschritte testen',[
  'Für eine gute Stream-Erklärung reicht die Angabe des Ergebnisses nicht. Versuche zunächst jede Stufe auf Papier auszuführen. Warum verschwindet Cola bei name.length() > 4? Weil Cola vier Zeichen besitzt und vier nicht größer als vier ist. Das ist ein typischer Grenzfall, den viele überlesen.',
  'Die Pipeline lässt sich mit Zwischenlisten gedanklich erklären, auch wenn die Java-Laufzeit nicht zwingend solche Zwischenlisten erzeugt. Dieses Denkmodell dient dem Verständnis, nicht als Beschreibung der tatsächlichen Speicherimplementierung.'
 ]),
 section('laziness','Lazy Evaluation, Seiteneffekte und einmalige Verwendung',[
  'Viele Java-Stream-Zwischenoperationen werden erst durch eine Terminaloperation ausgewertet. Ein Stream wird dabei verbraucht und sollte danach nicht erneut verwendet werden. Dasselbe Stream-Objekt zweimal mit toList oder count zu konsumieren, ist ein Fehler.',
  'Vermeide Seiteneffekte in filter und map, wenn möglich. Eine Mutation außerhalb der Pipeline kann das Ergebnis von Ausführungsdetails abhängig machen. Parallel Streams verschärfen das Problem; parallel bedeutet nicht automatisch schneller. Zuerst müssen Korrektheit und Lesbarkeit stimmen.'
 ],'Stream<Integer> numbers = List.of(1, 2, 3).stream();\nlong count = numbers.count();\n// numbers.toList(); // Fehler: Stream bereits verwendet',
 'Nach count ist dieser Stream konsumiert. Erzeuge für einen neuen Durchlauf einen neuen Stream aus der Quelle.'),
 section('language','Die gleiche Idee in Python, Rust und TypeScript',[
  'In Python liefert eine List-Comprehension wie [n*n for n in numbers if n % 2 == 0] sofort eine Liste. Ein Generatorausdruck ist dagegen lazy. Rusts Iteratoren mit filter, map und collect arbeiten in vieler Hinsicht ähnlich zu Java-Stream-Pipelines, allerdings mit anderen Ownership-Regeln.',
  'TypeScript/JavaScript Array.filter und Array.map erzeugen normalerweise sofort neue Arrays. Dass alle Beispiele filter und map heißen, macht das Auswertungsmodell nicht identisch. Deshalb solltest du beim Sprachwechsel immer fragen: Wann wird gerechnet? Wie lange leben die Daten? Kann ich das Ergebnis erneut verwenden?'
 ]),
 section('when','Wann eine for-Schleife die bessere Wahl ist',[
  'Wenn du viele Abbruchbedingungen, Zustandsänderungen, komplexe Fehlermeldungen oder voneinander abhängige Schritte hast, kann eine normale Schleife klarer sein. Ein Stream lohnt sich dort, wo eine Quelle auf nachvollziehbare Weise gefiltert, umgeformt und zusammengefasst wird.',
  'Guter Code soll verstanden werden. Die richtige Entscheidung ist nicht „möglichst viele Streams“, sondern die einfachste Darstellung der tatsächlichen Fachregel.'
 ])
],[
 {question:'Was löst die Auswertung einer üblichen Java-Pipeline mit filter und map aus?',answer:'Eine Terminaloperation wie toList oder count.',reason:'Zwischenoperationen legen die Verarbeitung zunächst nur lazy fest.'},
 {question:'Warum liefert name.length() > 4 für "Cola" false?',answer:'Weil Cola genau vier Zeichen besitzt.',reason:'Der Operator > ist strikt größer; >= würde vier einschließen.'},
 {question:'Ist JavaScript Array.map automatisch lazy wie Java Stream.map?',answer:'Nein.',reason:'Die JavaScript-Array-Methode führt die Abbildung typischerweise direkt aus und erzeugt ein neues Array.'}
],{prompt:'Filtere aktive Events, die in der Zukunft liegen, und bilde nur ihre Titel ab. Erkläre den Typ vor und nach map und formuliere einen Grenzfall für Events exakt zum aktuellen Zeitpunkt.',answer:'Vor map bleiben Event-Objekte, danach String-Titel. Ob ein Event zum aktuellen Zeitpunkt zählt, hängt von > oder >= und der festgelegten Zeitregel ab.'}),
chapter('absence',23,[
 'Abwesenheit von einem fachlichen Fehler unterscheiden.',
 'null, None, undefined, Option und Optional korrekt einordnen.',
 'Fehlende Werte bewusst behandeln, statt Exceptions zu verstecken.'
],[
 section('why','Nicht gefunden ist ein normales Ergebnis',[
  'Eine Artikelsuche kann keinen Treffer liefern, obwohl die Software korrekt funktioniert. Deshalb ist „kein Wert“ zunächst kein Programmierfehler. Ein gutes API-Modell zeigt diese Möglichkeit in seinem Vertrag. Sonst steht später ein null an einer Stelle, an der eine Methode ein echtes Objekt erwartet.',
  'Optional, Option und ähnliche Typen drücken die Möglichkeit des Fehlens ausdrücklich aus. Das Ziel ist nicht nur, NullPointerExceptions zu vermeiden, sondern alle erlaubten Ergebniszustände lesbar zu machen.'
 ]),
 section('example','Sicher weiterarbeiten',[
  'Optional.ofNullable kann aus einem möglicherweise fehlenden Wert einen Optional-Wert erzeugen. map führt eine Transformation nur aus, wenn tatsächlich ein Wert vorhanden ist. Mit orElse gibst du einen Ersatzwert an.',
  'Bei String::toUpperCase wird also kein Methodenaufruf auf null ausgeführt. Für eine unbekannte Suche erscheint stattdessen der Ersatztext.'
 ],'Optional<String> name = Optional.ofNullable(findName());\nString label = name.map(String::toUpperCase)\n                   .orElse("NICHT GEFUNDEN");',
 'Ist findName() null, bleibt Optional leer. Die map-Funktion wird übersprungen und orElse liefert den Ersatz.'),
 section('differences','Verschiedene Sprachen, verschiedene Verträge',[
  'Rust Option<T> ist ein Enum aus Some(T) und None. Ein Compiler kann damit bestimmte Fälle erzwingen. In Python bedeutet None ebenfalls Abwesenheit, aber eine Annotation wie str | None prüft diese Regel nicht automatisch zur Laufzeit.',
  'TypeScript nutzt häufig Union-Typen wie string | undefined. In Go können Maps mit einem zusätzlichen ok-Wert melden, ob ein Schlüssel existiert. Manchmal ist der eigentliche Wert null beziehungsweise 0 – daher darf „Wert sieht leer aus“ nicht mit „Schlüssel fehlt“ verwechselt werden.'
 ]),
 section('rules','Ersatzwert oder Fehler?',[
  'Wenn das Fachproblem einen fehlenden Artikel erlaubt, ist ein Optional oder eine andere explizite Alternative passend. Wenn ein fehlender Artikel dagegen eine Vertragsverletzung ist, kann ein Fehler angemessen sein. Die Entscheidung gehört zur Fachlogik.',
  'Eine gefährliche Abkürzung ist Optional.get() ohne vorherige Prüfung. Damit verschiebst du den Fehler nur an eine andere Stelle. Vergiss außerdem nicht, dass orElse seinen Ersatzwert schon berechnet, während orElseGet eine Funktion zur bedarfsabhängigen Berechnung erhält.'
 ])
],[
 {question:'Was passiert, wenn Optional.empty().map(...) aufgerufen wird?',answer:'Die Funktion wird nicht ausgeführt; der Optional bleibt leer.',reason:'map wirkt nur auf vorhandene Werte.'},
 {question:'Sind in Java Map.get(key) == null und !Map.containsKey(key) grundsätzlich gleichwertig?',answer:'Nein.',reason:'Die Map darf null als Wert speichern.'}
],{prompt:'Eine Benutzersuche liefert keinen Treffer. Ist das ein Fehler oder ein erlaubtes Ergebnis? Formuliere einen API-Vertrag und begründe ihn.',answer:'Bei einer normalen Suche ist Abwesenheit erwartbar und sollte als optionales Ergebnis modelliert werden. Beim Laden eines garantiert vorhandenen Systemkontos kann fehlende Existenz dagegen ein Fehler sein.'}),
chapter('errors',24,[
 'Fehlerzustände von normaler Abwesenheit trennen.',
 'Exceptions, Result-Typen und Go-error-Rückgaben vergleichen.',
 'Fehler dort behandeln, wo sinnvolle Reaktion möglich ist.'
],[
 section('meaning','Fehler sind Teil der Schnittstelle',[
  'Eine Datei kann fehlen, eine Zahl außerhalb des erlaubten Bereichs liegen oder ein Server nicht erreichbar sein. Eine robuste Anwendung tut nicht so, als könnten diese Zustände nie vorkommen. Sie definiert vielmehr, wie sie sichtbar werden und wer darauf reagieren kann.',
  'In Java unterbricht throw den normalen Kontrollfluss. Rust modelliert erwartbare Fehler häufig als Result<T,E>. Go gibt oft ein Paar aus Wert und error zurück. Die gemeinsame Aufgabe lautet: Erfolg und Scheitern eindeutig unterscheiden.'
 ]),
 section('example','Eingaben gezielt prüfen',[
  'Eine Methode, die nur positive Mengen akzeptiert, sollte ungültige Werte direkt am Eingang ablehnen. Dann können alle späteren Schritte davon ausgehen, dass ihre Vorbedingung erfüllt ist. Der Aufrufer kann eine verständliche Meldung anzeigen oder die Operation abbrechen.',
  'Ein catch sollte möglichst nur die Fehler fangen, auf die der Code sinnvoll reagieren kann. Ein pauschaler catch, der den Fehler ignoriert, erschwert das Debugging und lässt den Nutzer mit falschen Ergebnissen zurück.'
 ],'static int positive(int value) {\n    if (value <= 0) {\n        throw new IllegalArgumentException("Menge muss positiv sein");\n    }\n    return value;\n}\ntry {\n    positive(-2);\n} catch (IllegalArgumentException error) {\n    System.out.println(error.getMessage());\n}',
 'Die Vorbedingung scheitert, der catch fängt diese konkrete Exception und zeigt eine fachlich brauchbare Meldung.'),
 section('taxonomy','Drei Arten von Problemen',[
  'Ungültige Nutzereingaben sind oft erwartbare Validierungsfälle. Infrastrukturfehler wie ein verlorenes Netzwerk erfordern häufig Wiederholung oder einen sicheren Abbruch. Programmierfehler wie ein unerwarteter Nullzugriff weisen dagegen auf eine falsche Annahme im Code hin.',
  'Nicht jede Art sollte auf dieselbe Weise behandelt werden. Ein stilles „return null“ bei jeder Exception macht diese Unterscheidung unmöglich und verschluckt wichtige Ursachen.'
 ]),
 section('resources','Ressourcen sicher freigeben',[
  'Fehler dürfen nicht dazu führen, dass Dateien oder Datenbankverbindungen offen bleiben. Java try-with-resources und C++ RAII sorgen über unterschiedliche Sprachmechanismen dafür, dass Ressourcen bei Verlassen des Gültigkeitsbereichs freigegeben werden.',
  'Im produktiven Code solltest du also nicht nur fragen, welcher Fehler ausgelöst wird, sondern auch, welcher Zustand danach zurückbleibt: Wurde die Transaktion abgebrochen? Wurde die Ressource geschlossen? Kann die Anwendung den Vorgang wiederholen?'
 ])
],[
 {question:'Soll ein catch alle Fehler ignorieren, um einen Absturz zu verhindern?',answer:'Nein.',reason:'Das verschleiert Ursache und kann falsche Folgeergebnisse erzeugen.'},
 {question:'Welche Alternative benutzt Rust für erwartbare Fehler oft?',answer:'Result<T,E>.',reason:'Erfolg Ok(T) und Fehler Err(E) sind explizite, typisierte Zustände.'}
],{prompt:'Eine Datenbankverbindung fällt beim Speichern aus. Welche Informationen braucht eine gute Fehlermeldung und welche darf sie nicht preisgeben?',answer:'Sie soll dem Nutzer eine sinnvolle Aktion nennen und für Entwickler eine nachvollziehbare Ursache protokollieren, ohne Passwort, Token oder andere Geheimnisse offenzulegen.'}),
chapter('contracts',23,[
 'Abhängigkeit gegen Schnittstelle und konkrete Implementierung erklären.',
 'Nominale und strukturelle Typkompatibilität unterscheiden.',
 'Eine fachliche Implementierung durch eine Test-Implementierung austauschen.'
],[
 section('purpose','Was eine Schnittstelle verspricht',[
  'Ein Warenkorb kann per Karte, bar oder mit einem Gutschein bezahlt werden. Die Kasse sollte nicht jedes Mal vollständig umgeschrieben werden, wenn eine neue Zahlungsart hinzukommt. Ein Vertrag legt fest, welches Verhalten alle Zahlarten anbieten müssen.',
  'In Java kann ein Interface eine Methode pay definieren; unterschiedliche Klassen implementieren sie. Der restliche Code kann gegen den Vertrag programmiert werden, statt gegen eine bestimmte Klasse.'
 ]),
 section('dispatch','Polymorphie in Aktion',[
  'Eine Variable vom Typ Payment kann ein Objekt der Klasse Cash halten. Beim Aufruf wird die konkrete Implementierung ausgeführt. Diese Aufrufentscheidung macht den Code flexibler, weil der aufrufende Teil nicht alle Varianten kennen muss.',
  'Entscheidend ist aber, dass alle Implementierungen dieselbe fachliche Bedeutung einhalten. Zwei Methoden mit gleichem Namen, die völlig unterschiedliche Regeln verwenden, sind keine brauchbare Abstraktion.'
 ],'interface Payment { boolean pay(int cents); }\nfinal class Cash implements Payment {\n    public boolean pay(int cents) { return cents >= 0; }\n}\nPayment payment = new Cash();\nSystem.out.println(payment.pay(250)); // true',
 'Payment benennt den Vertrag; Cash liefert das tatsächliche Verhalten.'),
 section('other-languages','Interfaces, Traits und Protocols',[
  'Rust verwendet Traits, um Fähigkeiten zu beschreiben. Go-Interfaces werden implizit erfüllt, wenn ein Typ den erforderlichen Methodensatz besitzt. TypeScript ist weitgehend strukturell typisiert: Entscheidend ist die passende Form. Python Protocol kann Typprüfern ebenfalls eine strukturelle Beziehung beschreiben.',
  'Diese Unterschiede sind relevant, wenn du Bibliotheken entwirfst. Eine ausdrücklich deklarierte implements-Klausel und eine automatisch erkannte strukturelle Übereinstimmung sind nicht dasselbe Versprechen.'
 ]),
 section('design','Abstraktion mit Maß',[
  'Ein Interface ist sinnvoll, wenn es mehrere realistische Implementierungen oder eine klare Grenze gibt. Ein Interface nur für eine triviale Klasse schafft nicht automatisch Clean Code. Wähle Namen, die eine Fähigkeit oder Rolle beschreiben, und prüfe, ob du das Verhalten in einem Test isolieren kannst.'
 ])
],[
 {question:'Welche Methode läuft bei Payment p = new Cash(); p.pay(100)?',answer:'Die Cash-Implementierung.',reason:'Dynamischer Dispatch wählt die Implementierung des tatsächlichen Objekts.'},
 {question:'Braucht Go eine ausdrückliche implements-Klausel?',answer:'Nein.',reason:'Ein passender Methodensatz erfüllt das Interface implizit.'}
],{prompt:'Entwirf einen NotificationSender für E-Mail und Push-Nachrichten. Welche Methoden gehören in den Vertrag und welche Implementierungsdetails dürfen verborgen bleiben?',answer:'Der Vertrag beschreibt den Versand mit fachlichen Eingaben und Ergebnis. SMTP/HTTP-Konfiguration und Providerdetails bleiben in den Implementierungen.'}),
chapter('async',27,[
 'Warten von Rechnen unterscheiden.',
 'Asynchronität, Nebenläufigkeit und Parallelität korrekt benennen.',
 'Lebensdauer, Abbruch und Fehler in asynchronen Aufgaben mitdenken.'
],[
 section('problem','Die Anwendung darf beim Warten nicht einfrieren',[
  'Eine Repository-Analyse fordert Daten über das Netzwerk an und wartet auf eine Antwort. Würde die Oberfläche währenddessen synchron blockieren, könnten Schaltflächen und Statusanzeigen nicht mehr reagieren. Asynchronität macht es möglich, andere Arbeit zu erledigen, solange eine Aufgabe auf ein Ereignis wartet.',
  'Das bedeutet nicht, dass mehrere CPU-intensive Berechnungen automatisch parallel laufen. Warten auf I/O, nebenläufige Aufgaben und tatsächliche parallele Ausführung sind drei Begriffe, die du trennen solltest.'
 ]),
 section('model','Promises, Futures und Tasks',[
  'Ein Promise oder Future steht für einen Wert, der später verfügbar sein kann. Eine async-Funktion kann ihre Ausführung an einer await-Stelle unterbrechen, bis das Ergebnis vorliegt. In JavaScript wird dadurch normalerweise nicht der gesamte Eventloop-Thread blockiert.',
  'Java CompletableFuture bietet ähnliche Ziele mit einem anderen Ausführungsmodell; join kann explizit den aufrufenden Thread blockieren. Rust-Futures brauchen einen Executor, der sie abfragt. Go-Goroutinen werden von der Go-Laufzeit verwaltet. Das sind wesentliche Unterschiede.'
 ],'async function loadTitle(): Promise<string> {\n    const response = await fetch("/api/title");\n    if (!response.ok) throw new Error("Abfrage fehlgeschlagen");\n    return response.text();\n}', 'Der await-Ausdruck wartet auf Netzwerk-I/O. Fehlerhafte HTTP-Antworten müssen ausdrücklich behandelt werden.'),
 section('lifecycle','Abbruch und Fehler gehören dazu',[
  'Wenn der Nutzer das Fenster schließt oder eine neue Suche startet, sollte eine alte Anfrage möglichst abbrechbar sein. Sonst kann ihr Ergebnis später den aktuellen Zustand überschreiben. In JavaScript hilft dafür häufig AbortController.',
  'Der Zeitpunkt einer Statusmeldung ist ebenfalls Teil des Designs: „Verbindung wird aufgebaut“, „Dateien werden gelesen“ und „Kapitel wird erstellt“ geben dem Nutzer mehr Orientierung als ein endlos drehender Spinner ohne Kontext.'
 ]),
 section('safety','Wann Nebenläufigkeit schwierig wird',[
  'Mehrere Aufgaben können denselben Zustand verändern. Dann entstehen mögliche Datenrennen und Reihenfolgeprobleme. Nicht jede Sprache erlaubt unsynchronisierten Zugriff auf veränderbare Daten gleich leicht. Rusts Borrowing, Go-Channels und Java-Synchronisation lösen Teile dieser Probleme auf unterschiedliche Weise.',
  'Beginne mit einer klaren Regel: Wer besitzt den Zustand? Wer darf ihn ändern? Wann ist das Ergebnis gültig? Wenn du diese drei Fragen nicht beantworten kannst, ist paralleler Code vermutlich noch nicht ausreichend verstanden.'
 ])
],[
 {question:'Macht await aus einer CPU-Schleife automatisch parallele Arbeit?',answer:'Nein.',reason:'await steuert asynchrone Fortsetzung, ersetzt aber keine Thread- oder Prozessparallelisierung.'},
 {question:'Wozu dient AbortController?',answer:'Eine unterstützte asynchrone Operation kann abgebrochen werden.',reason:'So können veraltete Netzwerkantworten und unnötige Arbeit vermieden werden.'}
],{prompt:'Du startest zwei Repository-Suchen kurz hintereinander. Wie stellst du sicher, dass die ältere Antwort nicht die neuere Anzeige überschreibt?',answer:'Brich die vorige Anfrage ab oder verwende eine Anfragen-ID/Generation und übernehme nur die Antwort der aktuell gültigen Suche.'})
];
const RAW_TEXTBOOK:readonly TextbookChapter[]=[...BASE_TEXTBOOK,...EXPANDED_TEXTBOOK];
/** Quellen und Begriffe werden aus dem geprüften Sprachregister abgeleitet, nicht aus fremden Texten kopiert. */
export const TEXTBOOK:readonly TextbookChapter[]=RAW_TEXTBOOK.map(chapter=>{
 const metadata=CONCEPT_METADATA[chapter.conceptId];
 const concept=COMPLETE_CONCEPT_BY_ID.get(chapter.conceptId);
 const seen=new Set<string>();
 const sources=(concept?.variants??[]).flatMap(variant=>{
  if(seen.has(variant.docs)||!variant.docs.startsWith('https://'))return [];
  seen.add(variant.docs);
  return [{label:LANGUAGES[variant.language]+' · '+variant.name,url:variant.docs}];
 }).slice(0,4);
 return {...chapter,glossary:metadata?.glossary??[],relatedConceptIds:metadata?.relatedConceptIds??[],sources};
});
export const TEXTBOOK_BY_CONCEPT:ReadonlyMap<string,TextbookChapter>=new Map(TEXTBOOK.map(c=>[c.conceptId,c]));
export function getTextbookChapter(id:string):TextbookChapter{
 const content=TEXTBOOK_BY_CONCEPT.get(id);
 if(!content)throw Error('Für dieses Konzept fehlt das Lehrbuchkapitel: '+id);
 return content;
}
export function validateTextbook(chapters:readonly TextbookChapter[]=TEXTBOOK):readonly string[]{
 const problems:string[]=[];
 const known=new Set(CONCEPTS.map(c=>c.id));
 const seen=new Set<string>();
 for(const chapter of chapters){
  if(!known.has(chapter.conceptId))problems.push('Unbekanntes Konzept: '+chapter.conceptId);
  if(seen.has(chapter.conceptId))problems.push('Doppeltes Kapitel: '+chapter.conceptId);
  seen.add(chapter.conceptId);
  if(chapter.objectives.length<3)problems.push('Zu wenige Lernziele: '+chapter.conceptId);
  if(chapter.sections.length<4)problems.push('Zu wenige Abschnitte: '+chapter.conceptId);
  if(chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)<1200)problems.push('Zu oberflächlicher Lehrtext: '+chapter.conceptId);
  if(chapter.checkpoints.length<2)problems.push('Zu wenige Verständnisfragen: '+chapter.conceptId);
  if(!chapter.transfer.prompt||!chapter.transfer.answer)problems.push('Keine Transferaufgabe: '+chapter.conceptId);
   if(!chapter.sources?.length||!chapter.sources.every(source=>source.url.startsWith('https://')))
    problems.push('Keine geprüfte Quelle: '+chapter.conceptId);
   if((chapter.glossary?.length??0)<2)problems.push('Zu wenig erläuterte Begriffe: '+chapter.conceptId);
   for(const related of chapter.relatedConceptIds??[])
    if(!known.has(related)||related===chapter.conceptId)problems.push('Ungültiger Querverweis: '+chapter.conceptId+'/'+related);
  const sectionIds=new Set<string>();
  for(const s of chapter.sections){
   if(sectionIds.has(s.id))problems.push('Doppelter Abschnitt: '+chapter.conceptId+'/'+s.id);
   sectionIds.add(s.id);
   if(s.paragraphs.some(p=>p.trim().length<45))problems.push('Unvollständiger Absatz: '+chapter.conceptId+'/'+s.id);
   if(s.code&&!s.annotation)problems.push('Codebeispiel ohne Erklärung: '+chapter.conceptId+'/'+s.id);
  }
 }
 for(const id of known)if(!seen.has(id))problems.push('Konzept ohne Lehrbuchkapitel: '+id);
 return problems;
}
