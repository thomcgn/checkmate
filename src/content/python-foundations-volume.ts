import type {TextbookChapter} from './textbook.ts';
import type {LanguageVariant} from './concepts.ts';
import type {AuthoredLesson} from './seven-language-chapters.ts';

type Section=readonly [id:string,title:string,first:string,second:string,code:string,annotation:string];
type Check=readonly [question:string,answer:string,reason:string];
type Manuscript={id:string;title:string;objectives:readonly string[];sections:readonly Section[];checks:readonly Check[];exercise:string;solution:string;source:string};

/**
 * Original German instructional manuscripts grounded in the published CPython tutorial and library
 * references. Shipped as content, not built with the user's ChatGPT or Codex allowance.
 */
const PYTHON_MANUSCRIPTS:readonly Manuscript[]=[
{
 id:'py-sequences-mappings',title:'Python: Listen, Tupel, Dictionaries und Mengen richtig wählen',
 objectives:['Sequenzen und Zuordnungen nach Ordnung, Identität und Mutabilität unterscheiden.','Slicing und Comprehensions ohne unbeabsichtigte Kopien und Seiteneffekte einsetzen.','Dictionary-Schlüssel und Set-Mitgliedschaft anhand ihrer Gleichheitsregeln erklären.'],
 source:'https://docs.python.org/3/tutorial/datastructures.html',
 sections:[
 ['sequences','Listen modellieren veränderliche Reihenfolgen',
 'Eine Python-Liste speichert eine geordnete Folge von Referenzen auf Objekte. Du kannst Elemente anhängen, entfernen, ersetzen und über ihren Index lesen. Für einen Veranstaltungskalender ist eine Liste sinnvoll, wenn die Reihenfolge relevant ist oder doppelte Einträge bewusst auftreten dürfen. Eine Liste ist jedoch keine Zuordnung von Event-ID auf Event: Für häufige Suchvorgänge nach eindeutigen Schlüsseln kann ein Dictionary die passendere Datenstruktur sein. Die Datenstruktur sollte die Fachfrage beantworten, nicht nur möglichst schnell geschrieben sein.',
 'Slicing mit items[start:stop] erzeugt bei normalen Listen eine neue Liste mit den ausgewählten Elementreferenzen. Das ist eine flache Kopie: Werden die Elemente selbst als veränderliche Objekte geteilt, kann eine Mutation eines verschachtelten Objekts in beiden Listen sichtbar sein. Wer eine sichere Momentaufnahme braucht, muss deshalb klären, ob allein die äußere Reihenfolge unabhängig sein soll oder auch die enthaltenen Datensätze. Mit list.copy() bekommst du ebenfalls eine flache Kopie, keine automatische Duplizierung eines gesamten Objektgraphen.',
 'events = [{"id": "E1"}, {"id": "E2"}]\nselected = events[:1]\nselected[0]["id"] = "changed"\nassert events[0]["id"] == "changed"',
 'selected ist eine andere Liste, aber sie enthält eine Referenz auf dasselbe Dictionary wie die Ursprungsliste.'],
 ['tuples','Tupel signalisieren eine feste Zusammenstellung',
 'Ein Tupel wird mit Kommas gebildet und ist nach seiner Erzeugung als Container unveränderlich: Du kannst keine neuen Positionen anhängen oder einen bestehenden Eintrag direkt ersetzen. Das ist für Wertepaare und kleine fest strukturierte Ergebnisse hilfreich, beispielsweise ein Koordinatenpaar. Ein Tupel kann allerdings Referenzen auf veränderliche Objekte enthalten. Die Unveränderlichkeit der Tupelpositionen ist daher keine Garantie dafür, dass jede verschachtelte Information unveränderlich ist.',
 'Tupel lassen sich entpacken. Bei title, seats = event_pair erwartet Python grundsätzlich zwei passende Elemente und weist die beiden Werte den Namen zu. Diese Lesbarkeit ist bei kleinen Rückgaben nützlich, kann aber bei großen fachlichen Datensätzen unklar werden. Dafür ist eine dataclass oder ein benannter Typ oftmals sinnvoller. Auch die Verwendung als Dictionary-Schlüssel setzt voraus, dass die Bestandteile hashbar sind; ein Tupel mit einer Liste ist deshalb kein gültiger Hash-Schlüssel.',
 'record = ("Workshop", 20)\ntitle, seats = record\nassert title == "Workshop"\nassert isinstance(record, tuple)',
 'Die zwei Positionen sind fest; der Rückgabevertrag sollte dennoch ihre Bedeutung erläutern.'],
 ['mapping','Ein Dictionary modelliert Schlüssel und Werte',
 'Ein Dictionary verbindet eindeutige hashbare Schlüssel mit Werten. Für eine Event-ID ist eine Zuordnung von ID auf Eventdaten häufig passend. Python bewahrt bei Dictionaries die Einfügereihenfolge; daraus folgt jedoch nicht automatisch eine fachliche Sortierung nach Datum oder Titel. Wenn die Anzeige sortiert sein soll, ordne die Werte ausdrücklich, statt aus der Einfügereihenfolge eine andere Bedeutung abzuleiten. Ein vorhandener Schlüssel kann durch erneute Zuweisung überschrieben werden.',
 'Eine fehlende Zuordnung muss bewusst behandelt werden. dict[key] löst KeyError aus, wenn der Schlüssel nicht vorhanden ist; dict.get(key) liefert standardmäßig None. Wenn None selbst ein zulässiger gespeicherter Wert ist, lassen sich fehlender Schlüssel und vorhandener Nullwert durch get allein nicht unterscheiden. Die Prüfung key in data oder ein eindeutiger Sentinel kann erforderlich sein. Auch ein Dictionary ersetzt keine Validierung seiner importierten Werte: Ein Schlüssel mit einem falschen Typ oder leerem Inhalt bleibt ein fachliches Problem.',
 'events = {"E1": {"title": "Java"}}\nassert events["E1"]["title"] == "Java"\nassert "E2" not in events\nassert events.get("E2") is None',
 'Die ID ist hier der fachliche Schlüssel, nicht eine Position in einer Liste.'],
 ['sets','Mengen beantworten Mitgliedschaft und Eindeutigkeit',
 'Ein Set enthält eindeutige hashbare Elemente und eignet sich für Fragen wie: Haben wir diese ID bereits gesehen? Beim Hinzufügen eines bereits vorhandenen Werts entsteht kein zweiter Eintrag. Set-Operationen wie Vereinigung, Schnittmenge und Differenz können dabei klare Fachfragen ausdrücken. Wer jedoch eine stabile Reihenfolge für die Anzeige braucht, sollte nicht auf die Iterationsreihenfolge eines Sets vertrauen. Wenn die Reihenfolge zählt, halte sie getrennt oder sortiere bewusst.',
 'Eine List Comprehension ist praktisch für eine neue Liste aus berechneten Elementen. Eine Set Comprehension erzeugt dagegen eine Menge eindeutiger Werte; eine Dict Comprehension bildet Schlüssel auf Werte ab. Diese syntaktischen Formen sind ausdrucksstark, sollten aber nicht unbemerkt externe Zustände verändern. Bei komplexen Validierungsregeln kann eine ausdrücklich benannte Schleife leichter zu prüfen sein. Eine kompakte Form ist kein Qualitätsbeweis, wenn sie die Fachlogik versteckt.',
 'ids = ["E1", "E2", "E1"]\nunique = set(ids)\nassert unique == {"E1", "E2"}\ntitles = [value["title"] for value in events.values()]',
 'Set modelliert Eindeutigkeit; die Comprehension baut eine neue Liste von Titeln.']
 ],
 checks:[
 ['Macht items[:] eine vollständige Tiefenkopie verschachtelter Dictionaries?','Nein, der Listenslice ist eine flache Kopie.','Die enthaltenen Objekte bleiben referenziert und können gemeinsam verändert werden.'],
 ['Was ist der Unterschied zwischen data[key] und data.get(key) bei fehlendem Schlüssel?','Der erste Zugriff wirft KeyError, get liefert standardmäßig None.','Die beiden Formen definieren unterschiedliche Fehler- beziehungsweise Leerwertverträge.'],
 ['Darf die Iterationsreihenfolge eines Sets als sortierte Reihenfolge betrachtet werden?','Nein.','Eine Menge modelliert Mitgliedschaft und Eindeutigkeit, nicht eine garantierte fachliche Sortierung.']
 ],
 exercise:'Entwerfe eine Eventverwaltung mit einer geordneten Liste von Event-Dictionaries und einem zusätzlichen Set bereits gesehener IDs. Importiere eine Folge mit doppelten IDs und ungültigen Titeln. Gib nur den ersten gültigen Datensatz jeder ID zurück und erkläre, warum du Reihenfolge und Eindeutigkeit getrennt modellierst.',
 solution:'Initialisiere seen = set() und result = []. Prüfe pro Event die Struktur, nichtleere ID und einen String-Titel. Überspringe einen Eintrag, wenn seine ID bereits in seen liegt, sonst füge ID in seen und das Event in result ein. Die Ergebnisliste bewahrt die Reihenfolge der ersten gültigen Vorkommen; das Set sorgt unabhängig davon für eindeutige Mitgliedschaft.'
},
{
 id:'py-modules-packages',title:'Python: Module, Packages und reproduzierbare Projektgrenzen',
 objectives:['Importierte Module von ausgeführten Skripten unterscheiden.','Absolute und relative Imports in Packages richtig einordnen.','Virtuelle Umgebungen, Abhängigkeiten und Import-Seiteneffekte bewusst verwalten.'],
 source:'https://docs.python.org/3/tutorial/modules.html',
 sections:[
 ['module','Eine Python-Datei ist ein Modul mit eigenem Namensraum',
 'Eine .py-Datei kann Funktionen, Klassen und Konstanten definieren und damit ein importierbares Modul sein. Mit import catalog greifst du anschließend über catalog.load auf dessen Namen zu. Der Import trennt Verantwortlichkeiten: Ein Modul für Datenprüfung muss nicht wissen, wie die Desktop-Oberfläche gerendert wird. Wer stattdessen sämtliche Funktionen in eine Startdatei schreibt, erschwert die Trennung von Fachlogik, Dateizugriff und Benutzerinteraktion. Ein Modul sollte eine nachvollziehbare Aufgabe und einen klaren öffentlichen Vertrag haben.',
 'Beim ersten Import wird der Modulcode üblicherweise ausgeführt und das Modul in sys.modules zwischengespeichert. Deshalb sind auf Modulebene gestartete Netzwerkanfragen, Dateioperationen oder Datenbankänderungen riskant: Bereits ein Import kann unerwartete Seiteneffekte auslösen. Für ausführbare Startlogik ist die übliche Bedingung if __name__ == "__main__": hilfreich, weil sie zwischen direktem Skriptstart und Import unterscheidet. Module sollten ohne solche versteckten Startaktionen testbar bleiben.',
 '# catalog.py\ndef normalize(title: str) -> str:\n    return title.strip()\n\nif __name__ == "__main__":\n    print(normalize(" Ada "))',
 'Beim Import wird die Funktion definiert; der Demoaufruf im main-Block ist für einen direkten Start vorgesehen.'],
 ['packages','Packages ordnen mehrere Module',
 'Ein Package fasst Module unter einem gemeinsamen Namensraum zusammen. In einem einfachen Projekt kann src/checkmate/events.py neben src/checkmate/storage.py liegen, während ein __init__.py die Package-Struktur ausdrücklich markiert. Python kennt auch Namespace-Packages ohne __init__.py, doch für ein überschaubares Lehrprojekt ist die klassische Struktur oft verständlicher. Ein Package trennt nicht automatisch Schichten; es ist eine organisatorische Grenze, die zu den fachlichen Zuständigkeiten passen sollte.',
 'Imports innerhalb eines Packages können absolut oder relativ formuliert werden. Absolute Imports wie from checkmate.events import Event machen die vollständige Abhängigkeit sichtbar. Relative Imports wie from .events import Event beziehen sich auf die bestehende Package-Position. Wer eine Package-interne Datei direkt als Skript startet, kann bei relativen Imports Probleme bekommen, weil dann der Package-Kontext fehlt. Häufig ist python -m checkmate.cli aus einem passenden Projektkontext die robustere Startform.',
 'from .events import Event\nfrom .storage import save_event\n\ndef persist(event: Event) -> None:\n    save_event(event)',
 'Die relativen Imports setzen voraus, dass diese Datei als Bestandteil eines Packages geladen wird.'],
 ['resolution','Modulsuche ist eine bewusste Umgebungsfrage',
 'Python sucht beim Import nach passenden Modulen entlang konfigurierter Suchorte. Das kann zu überraschenden Fehlern führen, wenn eine eigene Datei denselben Namen wie ein Standardbibliotheksmodul trägt. Eine Datei namens json.py im Projektordner kann beispielsweise den beabsichtigten Import der Standardbibliothek verdecken. Deshalb sind klare Package-Namen und eine durchdachte Projektstruktur wichtig. sys.path zu verändern, um kurzfristig Importfehler zu verstecken, macht ein Projekt häufig fragil.',
 'Auch zirkuläre Imports können entstehen: Modul A importiert B, während B während seiner Initialisierung schon A benötigt. Dann sind möglicherweise noch nicht alle erwarteten Namen verfügbar. Eine gute Lösung ist oft, gemeinsame Typen und reine Regeln in ein drittes Modul auszulagern oder Abhängigkeiten neu zu ordnen. Das ist ein Architekturproblem und nicht bloß ein Syntaxproblem. Tests, die Module in frischen Prozessen importieren, helfen solche Fehler früh zu entdecken.',
 'import json\npayload = json.dumps({"id": "E1"})\nassert payload.startswith("{")',
 'Die Datei des eigenen Projekts sollte nicht json.py heißen, damit der Bibliotheksimport eindeutig bleibt.'],
 ['environment','Die Laufzeitumgebung gehört zum Projektvertrag',
 'Eine virtuelle Umgebung isoliert installierte Python-Pakete von anderen Projekten. Sie ist keine Kopie sämtlicher Systembibliotheken und kein Sicherheitscontainer, sondern eine klarere Abhängigkeitsgrenze. Für reproduzierbare Builds dokumentierst du die benötigte Python-Version und die Paketversionen, die dein Projekt voraussetzt. Der Paketmanager und die Art der Sperrdatei können variieren; entscheidend ist, dass andere Entwickler die Umgebung kontrolliert wiederherstellen können.',
 'Imports sind nur die erste Hälfte des Problems. Eine Anwendung braucht oft Konfiguration, Dateipfade und sichere Zugangsdaten. Solche Werte sollten nicht beim Modulimport ungeprüft eingelesen und als globale Geheimnisse verteilt werden. Besser ist, sie beim Start ausdrücklich zu übergeben und an einer Grenze zu validieren. So bleiben Module unabhängig testbar und können in CLI, Server oder Desktop-App wiederverwendet werden.',
 'from pathlib import Path\n\ndef find_catalog(root: Path) -> Path:\n    return root / "catalog.json"',
 'Die Funktion erhält den Projektpfad als Parameter und setzt keinen versteckten globalen Arbeitsordner voraus.']
 ],
 checks:[
 ['Wozu dient if __name__ == "__main__":?','Es grenzt direkten Skriptstart von gewöhnlichem Import ab.','So lassen sich Demo- und Startoperationen vom importierbaren API-Code trennen.'],
 ['Warum kann ein direkt gestartetes Package-Modul mit relativen Imports scheitern?','Es fehlt möglicherweise der erforderliche Package-Kontext.','Ein Start über python -m package.module erhält bei passender Struktur den Modulkontext.'],
 ['Ist eine virtuelle Umgebung ein vollständiger Sicherheitscontainer?','Nein.','Sie dient vor allem der Isolation von Python-Paketinstallationen und der Abhängigkeitsverwaltung.']
 ],
 exercise:'Plane die Package-Struktur für eine Event-CLI mit events.py, storage.py und cli.py. Implementiere einen sicheren Einstieg über python -m und erkläre, welche Module ohne Dateioperationen importiert werden können müssen. Formuliere zwei Regeln gegen zirkuläre Imports.',
 solution:'Erzeuge ein Package mit __init__.py und einer __main__.py oder einem cli-Modul. Die Eventvalidierung gehört in events.py, I/O in storage.py, Einstieg in cli.py. Starte via python -m <package>. Halte reine Datenmodelle unabhängig von CLI und Speicheradapter und verlege gemeinsame Typen bei Bedarf in ein separates Modul. Modulimporte dürfen keine unerwartete Speicherung auslösen.'
},
{
 id:'py-dataclasses-model',title:'Python: dataclasses, Felddefaults und verlässliche Datenmodelle',
 objectives:['Eine dataclass von einem gewöhnlichen Dictionary unterscheiden.','default_factory für neue veränderliche Werte pro Instanz nutzen.','Frozen-Dataclasses und verschachtelte Mutabilität sachgerecht einordnen.'],
 source:'https://docs.python.org/3/library/dataclasses.html',
 sections:[
 ['records','Ein Datenobjekt benennt seinen fachlichen Vertrag',
 'Ein Dictionary kann schnell einen Eventdatensatz speichern, aber das Feld title ist dann nur ein freier Schlüssel. Eine mit @dataclass markierte Klasse kann die erwarteten Felder und ihre Typannotationen sichtbar machen. Der Decorator erzeugt abhängig von den Optionen unter anderem __init__, __repr__ und __eq__. Er erzeugt damit ein klares Datenmodell aus benannten Attributen, ersetzt aber nicht automatisch fachliche Validierung oder die Prüfung fremder JSON-Eingaben. Die Typannotationen selbst werden nicht durch den Decorator als allgemeine Laufzeittypen validiert.',
 'Für einen Eventdatensatz kann ein Konstruktor mit title, location und date die Eingabestellen klar machen. Wenn ein leerer Titel fachlich verboten ist, lässt sich das in __post_init__ prüfen. Dadurch gibt es einen zentralen Punkt, an dem die Invariante nach der Konstruktion gelten soll. Auch hier gilt: Die richtige fachliche Grenze ist wichtiger als die bequem generierte Methode. Eine Klasse mit unkontrollierbaren Feldern ist nicht automatisch verlässlicher als ein Dictionary.',
 'from dataclasses import dataclass\n\n@dataclass\nclass Event:\n    title: str\n    capacity: int\n\n    def __post_init__(self):\n        if not self.title.strip() or self.capacity < 0:\n            raise ValueError("invalid event")',
 'Die Feldtypen sind Annotationsinformationen; die konkrete Fachprüfung wird in __post_init__ ausgeführt.'],
 ['factory','Mutable Defaults brauchen eine Fabrik pro Instanz',
 'Eine dataclass kann eine veränderliche Liste als Attribut enthalten. Für jeden neuen Katalog soll dann normalerweise eine eigene Liste erzeugt werden. Dafür gibt es field(default_factory=list). Die Factory wird beim Erzeugen einer Instanz aufgerufen, wenn kein Wert für das Feld übergeben wurde. Das verhindert das versehentliche Teilen derselben Standardliste zwischen unabhängig konstruierten Instanzen. Die Regel knüpft direkt an das Kapitel über Python-Funktionsdefaults an, denn dort zeigt sich das gleiche Grundproblem geteilter veränderlicher Zustände.',
 'Eine default_factory kann auch eine eigene Funktion sein, die einen passenden Standardzustand konstruiert. Sie sollte möglichst keine überraschenden globalen Seiteneffekte verursachen. Wenn du dagegen eine Liste explizit beim Erzeugen des Objekts übergibst, gehört die Entscheidung, ob sie kopiert oder übernommen wird, weiterhin zum Konstruktorvertrag. Der Decorator macht aus fremden Referenzen nicht automatisch sichere Kopien.',
 'from dataclasses import dataclass, field\n\n@dataclass\nclass Catalog:\n    titles: list[str] = field(default_factory=list)\n\nfirst = Catalog()\nsecond = Catalog()\nfirst.titles.append("Ada")\nassert second.titles == []',
 'Jede Instanz erhält beim normalen Defaultpfad ihre eigene Liste.'],
 ['frozen','Frozen verhindert Zuweisungen, aber keine Tiefenmutation',
 'Mit @dataclass(frozen=True) werden normale Attributzuweisungen verhindert. Eine solche Datenklasse kann für wertartige Modelle nützlich sein, deren Zustand nach Konstruktion nicht verändert werden soll. Das bedeutet jedoch nicht, dass sämtliche eingebetteten Objekte unveränderlich sind. Enthält eine Frozen-Dataclass eine Liste, kann eine andere Referenz auf diese Liste ihren Inhalt weiterhin verändern. Auch die generierte Hashfähigkeit hängt von den Optionen und der tatsächlichen Hashbarkeit der Felder ab.',
 'Für einen stabilen Wertschlüssel sind unveränderliche und hashbare Bestandteile wichtig. Ein Tupel aus Strings und Zahlen kann geeignet sein, während eine Liste es nicht ist. Ein EventKey mit einer string-ID und einem Datum kann als Frozen-Dataclass ein lesbares Modell für Dictionary- oder Set-Schlüssel ergeben, sofern alle Felder die passenden Eigenschaften besitzen. Eine falsche Gleichheitsregel ist eine fachliche Modellierungsfrage, kein Mangel an Decorator-Syntax.',
 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass EventKey:\n    title: str\n    day: str\n\nseen = {EventKey("Ada", "2026-11-24")}',
 'Ein Frozen-Datenobjekt mit hashbaren Feldern kann als Set-Element dienen. Die Datumstextform braucht fachliche Prüfung.'],
 ['methods','Datenträger und Fachverhalten müssen zusammenpassen',
 'Eine dataclass darf Methoden besitzen. Für einen einfachen, wertorientierten Eventeintrag kann eine Prüfmethode sinnvoll sein; komplexe Speicherung und Netzwerkkommunikation gehören dagegen oft in separate Komponenten. Es lohnt sich, Konstruktion und Datenänderungen nach fachlichen Operationen zu gestalten. Wer eine capacity nachträglich direkt verändert, kann eine vorher validierte Invariante wieder brechen, sofern das Modell dies nicht verhindert. Bei unveränderlichen Daten kann eine ausdrücklich konstruierte neue Instanz eine nachvollziehbarere Änderung ausdrücken.',
 'dataclasses.replace erzeugt ein neues Objekt mit veränderten Feldern und ruft bei üblicher dataclass-Konstruktion auch die passende Initialisierungslogik auf. Bei init=False-Feldern und speziellen Konstruktoren gelten zusätzliche Regeln; nutze replace deshalb nicht gedankenlos als universelle Kopie. Tests sollten gültige Anfangszustände, die Ablehnung ungültiger Werte und das Verhalten geteilter verschachtelter Strukturen abdecken.',
 'from dataclasses import replace\n\noriginal = Event(title="Ada", capacity=10)\nupdated = replace(original, capacity=20)\nassert original.capacity == 10 and updated.capacity == 20',
 'Die neue Instanz beschreibt eine bewusste Änderung. Die Validierungsregel aus dem Konstruktor bleibt relevant.']
 ],
 checks:[
 ['Validiert @dataclass automatisch alle Feldannotationen zur Laufzeit?','Nein.','Die Annotationen werden nicht zu einer allgemeinen Runtime-Schema-Prüfung.'],
 ['Wozu dient field(default_factory=list)?','Jede Instanz erhält bei Nutzung des Defaults eine neu erzeugte Liste.','So wird nicht versehentlich dieselbe veränderliche Standardliste geteilt.'],
 ['Macht frozen=True verschachtelte Listen unveränderlich?','Nein.','Die Sperre gilt für normale Attributzuweisungen, nicht für alle Mutationen referenzierter Objekte.']
 ],
 exercise:'Erstelle eine dataclass Catalog mit einem unveränderlichen Namen und einer Liste von Eventdaten, die über default_factory je Instanz unabhängig ist. Lege fest, wie du gültige Eventtitel prüfst und ob die Liste über öffentliche Methoden verändert werden darf. Teste zwei Instanzen und die Verwendung einer Frozen-EventKey-Dataclass als Dictionary-Schlüssel.',
 solution:'Definiere field(default_factory=list) für die Liste und __post_init__ für verpflichtende Attribute. Für einen stabilen EventKey verwende @dataclass(frozen=True) mit ausschließlich hashbaren Feldern. Teste, dass eine Änderung der Liste eines Katalogs nicht die andere Instanz betrifft, und prüfe, dass zwei gleiche EventKeys denselben Dictionary-Eintrag repräsentieren.'
},
{
 id:'py-typing-boundaries',title:'Python: Typannotationen, Protocols und sichere Laufzeitgrenzen',
 objectives:['Statische Typannotationen von Runtime-Prüfungen unterscheiden.','Protocol für kleine strukturelle Verhaltensverträge nutzen.','Union, Optional und generische Collections fachlich korrekt annotieren.'],
 source:'https://docs.python.org/3/library/typing.html',
 sections:[
 ['annotations','Ein Type Hint ist keine dynamische Zugangssperre',
 'Python-Typannotationen können Variablen, Funktionen und Attribute verständlicher machen. Eine Signatur wie def seats(event: Event) -> int dokumentiert, welche Werte erwartet und geliefert werden. Werkzeuge wie statische Type Checker können fehlerhafte Aufrufe früh erkennen. Python erzwingt diese Annotationen aber nicht automatisch bei jedem Runtime-Aufruf; eine Funktion kann trotz falscher Annotation mit einem unerwarteten Wert aufgerufen werden. Wer externe JSON-Daten verarbeitet, muss deshalb weiterhin prüfen, was tatsächlich eingetroffen ist.',
 'Die Abgrenzung von None ist besonders wichtig. Ein Wert str | None erlaubt im Typmodell sowohl Text als auch das Fehlen eines Textes. Der Code muss den Nullfall behandeln, bevor er text.strip() aufruft. Eine generische Annotation list[str] beschreibt die beabsichtigten Elemente, kontrolliert aber nicht automatisch jedes bereits vorhandene Element einer eingelesenen Liste. Das Typsystem hilft, den inneren Code konsistent zu entwerfen; die Eingangsgrenze bleibt eine eigene Aufgabe.',
 'def normalized_title(value: str | None) -> str:\n    if value is None:\n        return "Unbekannt"\n    return value.strip()',
 'Die Funktion behandelt den fehlenden Text ausdrücklich, statt sich auf die Annotation allein zu verlassen.'],
 ['generics','Generische Signaturen erhalten Typbeziehungen',
 'Ein generischer Algorithmus kann einen Typzusammenhang ausdrücken: Die Funktion first nimmt eine Sequence[T] entgegen und gibt den ersten Wert als T zurück. Dadurch bleibt beim Aufruf mit Strings ein String-Ergebnis bekannt. Das ist präziser als object zurückzugeben und an jeder Aufrufstelle erneut Typbehauptungen einzufügen. Gleichzeitig muss eine leere Sequenz einen Fehlervertrag erhalten, weil nicht jede Sequence ein erstes Element besitzt.',
 'Seit neueren Python-Versionen gibt es verschiedene Syntaxformen, Typparameter zu deklarieren. Entscheidend für das didaktische Verständnis ist die Beziehung, nicht das Auswendiglernen einer einzelnen Variante. Für echte Bibliotheken sollte die gewählte Syntax zur unterstützten Mindestversion passen. Ein generischer Typparameter erlaubt keine beliebigen Operationen auf T; solche Operationen brauchen geeignete Constraints oder Protokolle.',
 'from collections.abc import Sequence\n\ndef first[T](values: Sequence[T]) -> T:\n    if not values:\n        raise ValueError("empty sequence")\n    return values[0]',
 'Die Typparametersyntax ist für moderne Python-Versionen vorgesehen und bewahrt den konkreten Elementtyp im Ergebnis.'],
 ['protocol','Ein Protocol beschreibt benötigtes Verhalten',
 'Mit typing.Protocol lässt sich ein struktureller Vertrag formulieren. Eine Funktion, die von einem Objekt nur die Methode title() benötigt, sollte nicht zwingend eine bestimmte Basisklasse verlangen. Ein Protocol mit dieser Methode beschreibt den kleinsten sinnvollen Bedarf. Ein statischer Type Checker kann passende Implementierungen erkennen, auch wenn diese das Protocol nicht ausdrücklich als Oberklasse angeben. Das fördert kleine Abhängigkeiten und gut testbare Komponenten.',
 'Protocols sind dennoch kein automatischer Runtime-Validator fremder Objekte. Auch ein mit runtime_checkable markiertes Protocol kann nur eingeschränkte Strukturprüfungen liefern und verifiziert keine vollständigen Signaturen oder fachlichen Werte. Für unbekannte Eingaben sind echte Parser oder explizite Validierungsfunktionen erforderlich. Gute Software trennt, was zur Entwicklungszeit bewiesen werden soll, von dem, was beim tatsächlichen Datenempfang überprüft werden muss.',
 'from typing import Protocol\n\nclass HasTitle(Protocol):\n    def title(self) -> str: ...\n\ndef show(value: HasTitle) -> str:\n    return value.title()',
 'Der Vertrag verlangt nur eine lesende Titelfunktion. Eine passende Klasse benötigt keine explizite Vererbung von HasTitle.'],
 ['boundary','Unknown JSON verlangt eine andere Entscheidung',
 'json.loads kann beliebige JSON-Strukturen liefern. Eine direkte Zuweisung an list[Event] wird dadurch nicht automatisch gerechtfertigt. Du solltest zuerst prüfen, ob eine Liste vorliegt, anschließend jedes Element und dessen benötigte Felder validieren und erst danach konkrete fachliche Objekte erzeugen. So liegt die unvermeidliche dynamische Prüfung an einer zentralen Stelle, während der Rest der Anwendung auf präzise Annotationen bauen kann.',
 'Vermeide blindes cast(Event, raw). Ein typing.cast verändert keinen Laufzeitwert und führt keine Prüfung durch. Es kann sinnvoll sein, wenn externe Rahmenbedingungen einen Wert bereits beweisbar garantieren, aber nicht zum Erfinden eines Vertrages, dessen Grundlage fehlt. Schreibe stattdessen Parser mit klaren Erfolg- und Fehlerfällen. Gerade bei Importdateien und HTTP-Antworten ist das der Unterschied zwischen kontrollierter Ablehnung und einem späteren AttributeError tief im Fachcode.',
 'def parse_title(value: object) -> str:\n    if not isinstance(value, str) or not value.strip():\n        raise ValueError("expected nonblank string")\n    return value.strip()',
 'Die Funktion beweist ihren Rückgabetyp durch einen Runtime-Check und eine explizite Fachbedingung.']
 ],
 checks:[
 ['Ist typing.cast(Event, raw) eine Runtime-Validierung?','Nein.','cast informiert Werkzeuge über eine Annahme, verändert aber den Wert nicht.'],
 ['Wozu dient ein Protocol in einer Funktionssignatur?','Es beschreibt ein benötigtes Verhalten unabhängig von einer konkreten Basisklasse.','Strukturelle Typisierung kann kleine Schnittstellen und Tests erleichtern.'],
 ['Kann eine leere Sequence[T] bei first ohne Fehlerbehandlung sicher einen T-Wert liefern?','Nein.','Die Operation hat ohne Element keinen definierten Rückgabewert und braucht einen Fehlervertrag.']
 ],
 exercise:'Implementiere parse_events(data: object) -> list[Event], die nur eine Liste von Dictionaries mit string-ID und nichtleerem Titel akzeptiert. Gib bei ungültigen Werten eine verständliche ValueError aus. Ergänze eine Protocol-basierte Funktion, die nur einen Titelvertrag benötigt.',
 solution:'Prüfe mit isinstance(data, list), danach jedes Element mit isinstance(row, dict) und jede Pflichtinformation durch tatsächliche Type- und Inhaltschecks. Erzeuge anschließend neue Event-Objekte. Definiere ein HasTitle-Protocol mit title() -> str; implementiere die auswertende Funktion gegen dieses Protocol. Benutze keinen cast als Ersatz für die Datenprüfung.'
},
{
 id:'py-pathlib-files',title:'Python: pathlib, Dateiverarbeitung und Dateiformate',
 objectives:['Path von Dateiinhalt und Prozess-Arbeitsverzeichnis unterscheiden.','Textdateien mit explizitem Encoding und sinnvoller Fehlerbehandlung lesen.','Schreibvorgänge und sichere Dateinamen als fachliche Grenzen behandeln.'],
 source:'https://docs.python.org/3/library/pathlib.html',
 sections:[
 ['paths','Ein Path ist eine Adresse, keine geöffnete Datei',
 'Mit pathlib.Path lassen sich Dateipfade als Objekte kombinieren, vergleichen und nach ihrer Struktur untersuchen. Path("data") / "events.json" beschreibt einen Pfad zu einer Ressource, ohne die Datei bereits zu öffnen. Das ist ein wichtiger Unterschied: Ein Path kann auf etwas zeigen, das noch gar nicht existiert. Auch relative Pfade beziehen sich auf ein Arbeitsverzeichnis, das sich je nach Startart eines Programms ändern kann. Bei einer Desktop- oder CLI-Anwendung sollte der Basisordner deshalb ausdrücklich festgelegt werden.',
 'Die Syntax eines Pfades hängt von der Zielplattform ab. Nutze die Path-Operationen statt Dateisystemtrennzeichen per String-Verkettung zu erraten. Eine vermeintlich harmlose Nutzereingabe darf nicht ungeprüft zu einem erlaubten Speicherpfad werden; ein Dateiname mit .. oder absoluten Pfadangaben könnte sonst aus dem vorgesehenen Arbeitsbereich ausbrechen. Path.resolve kann bei der Prüfung helfen, aber sichere Zugriffsregeln und mögliche Race Conditions müssen zusätzlich betrachtet werden.',
 'from pathlib import Path\n\nroot = Path("data")\ncatalog = root / "events.json"\nassert catalog.name == "events.json"',
 'Die Kombination erzeugt zunächst nur einen Pfadwert; sie legt keine Datei an.'],
 ['text','Text-Encoding muss Teil des Vertrages sein',
 'Path.read_text und Path.write_text bieten kurze Textdateioperationen. Gib das Encoding ausdrücklich an, wenn die gespeicherten Daten über verschiedene Rechner hinweg konsistent sein sollen. UTF-8 ist für viele moderne Projekte eine sinnvolle Wahl. Ohne klare Vereinbarung kann eine Datei auf unterschiedlichen Systemen unterschiedlich interpretiert werden. Für große Dateien kann ein Stream über open geeigneter sein, weil read_text die gesamte Datei als String in den Speicher lädt.',
 'Beim Lesen können FileNotFoundError, PermissionError oder Decodierungsfehler auftreten. Diese Fälle sind nicht identisch. Eine optional fehlende Konfiguration darf vielleicht durch Standardwerte ersetzt werden, ein Berechtigungsfehler sollte dagegen sichtbar bleiben. Vermeide ein pauschales except Exception, das alle Probleme als leeres Dokument behandelt. Ein Lehrbeispiel sollte klar sagen, welche Fehler es weitergibt und welche die aufrufende Schicht behandeln soll.',
 'from pathlib import Path\n\ndef read_catalog(path: Path) -> str:\n    return path.read_text(encoding="utf-8")',
 'Ein einfacher Lesevertrag, der die Fehler nicht versteckt. Für eine fehlende optionale Datei wäre eine explizite Sonderbehandlung nötig.'],
 ['json','Datenformat und Dateisystem sind getrennte Schichten',
 'Die Standardbibliothek json kann Python-Daten in JSON-Text verwandeln und zurücklesen. Das Schreiben eines Dictionaries als JSON ist nicht dasselbe wie die sichere Validierung eines geladenen Datensatzes. Ein gültiges JSON-Dokument kann eine Zahl, ein Array oder ein Objekt mit fehlenden Feldern enthalten. Nach json.loads muss deshalb geprüft werden, ob die konkrete erwartete Form und alle fachlichen Regeln erfüllt sind. Das gilt auch für Dateien, die früher von derselben Anwendung geschrieben wurden.',
 'Achte auf serialisierbare Datentypen. Nicht jedes Python-Objekt, beispielsweise ein beliebiges dataclass-Objekt oder ein datetime-Wert, wird ohne Umwandlung von json.dumps unterstützt. Lege für gespeicherte Daten deshalb eine explizite Repräsentation fest. Für Datumswerte kann eine ISO-konforme Textform geeignet sein, sofern das Format und die Zeitzonenregel beschrieben sind. Ein stabiler Dateivertrag besitzt außerdem eine Version oder Migrationsstrategie, wenn das Schema künftig verändert werden soll.',
 'import json\n\npayload = {"version": 1, "events": [{"id": "E1"}]}\nencoded = json.dumps(payload, ensure_ascii=False)\ndecoded = json.loads(encoded)\nassert decoded["version"] == 1',
 'Das Beispiel zeigt Serialisierung. Die Form der geladenen Eventliste wird dadurch nicht automatisch validiert.'],
 ['saving','Speichern verlangt mehr als einen erfolgreichen Stringaufbau',
 'Path.write_text schreibt einen Text in eine Datei, ersetzt bei einem vorhandenen Pfad typischerweise dessen Inhalt und gibt die Zahl geschriebener Zeichen zurück. Das ist bequem, aber eine Anwendung sollte das Risiko eines teilweise geschriebenen Dokuments berücksichtigen, wenn der Vorgang unterbrochen wird. Für wichtige Daten kann ein kontrollierter temporärer Schreibpfad mit anschließendem Austausch sinnvoll sein, wobei die genauen Atomizitäts- und Haltbarkeitsgarantien vom Dateisystem und der Plattform abhängen. Ein einfacher Dateiname ist noch kein Transaktionskonzept.',
 'Prüfe zudem, wer Daten lesen und schreiben darf. Ein Pfad, der aus einer Nutzereingabe entsteht, braucht möglicherweise eine Prüfung auf erlaubte Verzeichnisse und Dateitypen. Beim Import sollten Größenlimits gelten, damit eine riesige Datei nicht unkontrolliert in den Arbeitsspeicher geladen wird. Der fachliche Erfolgsstatus eines Exports sollte erst nach tatsächlich erfolgreicher Speicheroperation gesetzt werden, nicht schon nach dem Erzeugen des JSON-Strings.',
 'from pathlib import Path\nimport json\n\ndef save_catalog(path: Path, events: list[dict[str, str]]) -> None:\n    path.write_text(json.dumps({"events": events}, ensure_ascii=False), encoding="utf-8")',
 'Die Funktion zeigt eine einfache Schreiboperation, keine atomare Sicherung oder Berechtigungsprüfung.']
 ],
 checks:[
 ['Öffnet Path("events.json") die Datei unmittelbar?','Nein.','Path ist zunächst eine Pfadbeschreibung und führt ohne passende Operation keinen Dateizugriff aus.'],
 ['Garantiert json.loads, dass alle fachlichen Eventfelder vorhanden sind?','Nein.','Es rekonstruiert JSON-Werte, nicht automatisch geprüfte Domänenobjekte.'],
 ['Weshalb ist ein explizites UTF-8-Encoding bei Textdateien sinnvoll?','Es macht die erwartete Textkodierung plattformübergreifend nachvollziehbar.','Ohne Vereinbarung können unterschiedliche Umgebungen Daten anders interpretieren.']
 ],
 exercise:'Erstelle eine Funktion load_catalog(path: Path) -> list[Event], die eine UTF-8-JSON-Datei einliest, eine bekannte Schemaversion verlangt und jeden Eintrag prüft. Behandle eine optional fehlende Datei ausdrücklich, aber verstecke keine Berechtigungs- oder JSON-Fehler. Beschreibe anschließend einen robusteren Schreibpfad mit temporärer Datei und Austausch.',
 solution:'Lies mit path.read_text(encoding="utf-8"), parse mit json.loads und prüfe, dass ein Dictionary mit version==1 und events als Liste vorliegt. Konvertiere jeden Eintrag durch einen eigenen Parser in ein Event. Fange FileNotFoundError nur ab, wenn das Fehlen laut Vertrag eine leere Liste bedeutet. Schreibe neue Inhalte zunächst in einen temporären Pfad im gleichen Dateisystem und tausche danach kontrolliert aus; dokumentiere Plattform- und Haltbarkeitsgrenzen.'
}
];
export const PYTHON_FOUNDATIONS_VOLUME:readonly AuthoredLesson[]=PYTHON_MANUSCRIPTS.map(item=>{
 const chapter:TextbookChapter={
  conceptId:item.id,readingMinutes:34,objectives:item.objectives,
  sections:item.sections.map(([id,title,first,second,code,annotation])=>({
   id,title,paragraphs:[first,second],code,annotation
  })),
  checkpoints:item.checks.map(([question,answer,reason])=>({question,answer,reason})),
  transfer:{prompt:item.exercise,answer:item.solution}
 };
 const implementation:LanguageVariant={
  language:'python',name:item.title,code:item.sections[0]?.[4]??'',
  explanation:'Das einführende Python-Beispiel wird im Fachkapitel Schritt für Schritt hergeleitet, um Fehlerfälle und Auswirkungen der Sprachsemantik einzuordnen.',
  differences:'Die gezeigten Python-Regeln sind sprachspezifisch; insbesondere Mutabilität, Importzeitpunkte und Laufzeitprüfung dürfen nicht unbesehen auf Java, TypeScript oder Rust übertragen werden.',
  equivalence:'related',docs:item.source
 };
 return {id:item.id,title:item.title,chapter,implementation};
});
