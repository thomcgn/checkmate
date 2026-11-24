/** Didaktische Metadaten, die aus den vorhandenen Lehrtexten abgeleitet und redaktionell formuliert sind. */
export interface ConceptMetadata{
 readonly relatedConceptIds:readonly string[];
 readonly glossary:readonly {readonly term:string;readonly definition:string}[];
}
export const CONCEPT_METADATA:Readonly<Record<string,ConceptMetadata>>={
 variables:{relatedConceptIds:['conditionals','records','ownership'],glossary:[
  {term:'Bindung',definition:'Ein Name, der in einem bestimmten Gültigkeitsbereich auf einen Wert verweist.'},
  {term:'Mutation',definition:'Das Verändern eines vorhandenen Werts oder Objekts, ohne den Namen neu zuzuweisen.'}]},
 conditionals:{relatedConceptIds:['variables','errors','equality'],glossary:[
  {term:'Wahrheitswert',definition:'Ein Wert, der genau zwei Zustände annehmen kann: wahr oder falsch.'},
  {term:'Kurzschluss',definition:'Der rechte Teil einer logischen Verknüpfung wird nur ausgewertet, wenn der linke ihn benötigt.'}]},
 sequences:{relatedConceptIds:['key-value','stream-pipelines','iterators'],glossary:[
  {term:'Index',definition:'Die Position eines Elements in einer geordneten Folge; in vielen Sprachen nullbasiert.'},
  {term:'Sequenz',definition:'Eine Sammlung, deren Elemente in einer festen Reihenfolge stehen und mehrfach vorkommen dürfen.'}]},
 'key-value':{relatedConceptIds:['uniqueness','absence','equality'],glossary:[
  {term:'Schlüssel',definition:'Ein eindeutiger Wert, über den ein zugehöriger Wert adressiert wird.'},
  {term:'Lookup',definition:'Das Auflösen eines Schlüssels zu seinem Wert oder das Feststellen seiner Abwesenheit.'}]},
 uniqueness:{relatedConceptIds:['key-value','equality','sequences'],glossary:[
  {term:'Menge',definition:'Eine Sammlung, die jeden Wert höchstens einmal enthält.'},
  {term:'Hashbarkeit',definition:'Die Eigenschaft eines Werts, einen stabilen Hashwert zu liefern und damit als Schlüssel dienbar zu sein.'}]},
 functions:{relatedConceptIds:['closures','contracts','stream-pipelines'],glossary:[
  {term:'Parameter',definition:'Ein benannter Platzhalter für einen Wert, der beim Aufruf übergeben wird.'},
  {term:'Rückgabewert',definition:'Das Ergebnis einer Funktion, das dem Aufrufer nach der Ausführung zur Verfügung steht.'}]},
 records:{relatedConceptIds:['equality','ownership','contracts'],glossary:[
  {term:'Wertgleichheit',definition:'Zwei Objekte gelten als gleich, wenn alle festgelegten Felder übereinstimmen.'},
  {term:'Unveränderlichkeit',definition:'Der Zustand eines Werts kann nach seiner Erzeugung nicht mehr verändert werden.'}]},
 generics:{relatedConceptIds:['contracts','sequences','functions'],glossary:[
  {term:'Typparameter',definition:'Ein Platzhalter für einen Typ, der beim Verwenden konkretisiert wird.'},
  {term:'Type Erasure',definition:'Eine Umsetzung, bei der generische Typinformationen zur Laufzeit nicht mehr vollständig vorhanden sind.'}]},
 'stream-pipelines':{relatedConceptIds:['iterators','sequences','functions'],glossary:[
  {term:'Zwischenoperation',definition:'Eine Verarbeitungsstufe, die einen neuen Strom erzeugt, aber noch nichts konsumiert.'},
  {term:'Terminaloperation',definition:'Eine Operation, die den Strom tatsächlich auswertet und ein Ergebnis liefert.'}]},
 absence:{relatedConceptIds:['errors','equality','key-value'],glossary:[
  {term:'Optional',definition:'Ein Typ, der explizit entweder einen Wert oder Abwesenheit ausdrückt.'},
  {term:'Nullwert',definition:'Ein besonderer Wert, der das Fehlen eines Objekts oder einer Referenz markiert.'}]},
 errors:{relatedConceptIds:['absence','contracts','async'],glossary:[
  {term:'Exception',definition:'Ein Mechanismus, der den normalen Ablauf unterbricht und einen Fehler an eine fängende Stelle weiterleitet.'},
  {term:'Ergebnistyp',definition:'Ein Typ, der Erfolg und Fehler als zwei mögliche Werte ausdrückt, ohne den Ablauf zu unterbrechen.'}]},
 contracts:{relatedConceptIds:['functions','generics','records'],glossary:[
  {term:'Schnittstelle',definition:'Eine Beschreibung der Operationen, die ein Implementierungsanbieter bereitstellen muss.'},
  {term:'Polymorphie',definition:'Die Fähigkeit, unterschiedliche Implementierungen über einen gemeinsamen Vertrag zu verwenden.'}]},
 async:{relatedConceptIds:['errors','iterators','ownership'],glossary:[
  {term:'Future',definition:'Ein Platzhalter für ein Ergebnis, das zu einem späteren Zeitpunkt verfügbar wird.'},
  {term:'Event Loop',definition:'Eine Schleife, die wartende Aufgaben verwaltet, ohne den Hauptthread dauerhaft zu blockieren.'}]},
 ownership:{relatedConceptIds:['records','async','closures'],glossary:[
  {term:'Besitz',definition:'Die Verantwortung einer Stelle für die Lebensdauer und Freigabe eines Werts.'},
  {term:'Leihen',definition:'Ein zeitlich begrenzter Zugriff auf einen Wert, ohne dessen Besitz zu übernehmen.'}]},
 iterators:{relatedConceptIds:['stream-pipelines','sequences','async'],glossary:[
  {term:'Generator',definition:'Eine Funktion, die Werte schrittweise erzeugt und ihre Position zwischen Aufrufen behält.'},
  {term:'Lazy',definition:'Eine Auswertung, die erst beim tatsächlichen Bedarf eines Elements stattfindet.'}]},
 closures:{relatedConceptIds:['functions','ownership','contracts'],glossary:[
  {term:'Capture',definition:'Das Erfassen von Werten aus der Erzeugungsumgebung einer Funktion.'},
  {term:'Rückruf',definition:'Eine Funktion, die einer anderen Stelle übergeben und später von ihr aufgerufen wird.'}]},
 equality:{relatedConceptIds:['records','uniqueness','key-value'],glossary:[
  {term:'Identität',definition:'Zwei Namen zeigen auf dasselbe Objekt, unabhängig vom Inhalt.'},
  {term:'Hash-Invariante',definition:'Gleiche Werte müssen denselben Hashwert liefern, damit hashbasierte Strukturen funktionieren.'}]}
};
