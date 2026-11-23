import type {LanguageId} from '../content/concepts';

export type PackDefinition={
 readonly id:string;readonly language:LanguageId;readonly title:string;
 readonly repo:string;readonly ref:string;readonly prefix:string;
 readonly license:string;readonly licenseUrl:string;
 readonly extent:string;readonly sourceUrl:string;
 readonly extensions:readonly string[];
};
export type DocumentEntry={readonly path:string;readonly title:string;readonly bytes:number;readonly sha256:string;readonly text:boolean};
export type DocumentView={readonly path:string;readonly title:string;readonly text:string};
export type InstalledDocumentPack={
 readonly id:string;readonly language:LanguageId;readonly title:string;readonly sourceCommit:string;
 readonly sourceUrl:string;readonly license:string;readonly licenseUrl:string;
 readonly installedAt:string;readonly extent:string;readonly documents:readonly DocumentEntry[];readonly assets:readonly DocumentEntry[];
};
export type DocumentPackStatus={id:string;installed:boolean;count:number;sourceCommit:string|null;installedAt:string|null};
export type PackProgress={id:string;phase:'downloading'|'extracting'|'saving'|'finished';detail:string;done:number;total:number};
export type DocumentationBridge={
 packs():Promise<DocumentPackStatus[]>;
 installPack(id:string):Promise<DocumentPackStatus>;
 loadPack(id:string):Promise<InstalledDocumentPack|null>;
 readDocument(id:string,documentPath:string):Promise<DocumentView>;
 searchPack(id:string,query:string):Promise<readonly string[]>;
 onPackProgress(callback:(v:PackProgress)=>void):()=>void;
};
/** Scoped official publications; no false claim that one publication equals every language API. */
const pack=(id:string,language:LanguageId,title:string,repo:string,ref:string,prefix:string,
 license:string,extent:string,extensions:readonly string[]):PackDefinition=>
 ({id,language,title,repo,ref,prefix,license,extent,extensions,
  sourceUrl:'https://github.com/'+repo,
  licenseUrl:'https://github.com/'+repo+'/blob/'+encodeURIComponent(ref)+'/LICENSE'});

export const OFFICIAL_PACKS:readonly PackDefinition[]=[
 pack('python-manual','python','CPython Documentation','python/cpython','3.15','Doc/',
  'PSF License 2','Gesamter editierbarer Textbestand des CPython-3.15-Dokumentationsverzeichnisses, einschließlich Sphinx-Quellen und Referenzkapiteln.',['.rst','.md','.txt']),
 pack('javascript-mdn','javascript','MDN JavaScript Guide & Reference','mdn/content','main','files/en-us/web/javascript/',
  'CC BY-SA (je Seite beachten)','Alle JavaScript-Guide- und Reference-Seiten aus MDNs englischem Content-Quellbestand; kein separater ECMAScript-Normtext.',['.md','.mdx']),
 pack('typescript-manual','typescript','TypeScript Handbook & Documentation','microsoft/TypeScript-Website','v2','packages/documentation/copy/en/',
  'CC BY 4.0','Alle offiziellen englischen TypeScript-Webseiten-Textquellen einschließlich des vollständigen Handbook.',['.md','.mdx']),
 pack('java-jdk-docs','java','OpenJDK Technical Documentation','openjdk/jdk','master','doc/',
  'GPL-2.0 with Classpath Exception (dateibezogene Ausnahmen prüfen)','Alle im OpenJDK-Quellrepository vorhandenen technischen Dokumente unter doc. Nicht die vollständige JLS oder Java-SE-Javadoc.',['.md','.txt','.html']),
 pack('csharp-dotnet','csharp','Microsoft C# Documentation','dotnet/docs','main','docs/csharp/',
  'CC BY 4.0; Codebeispiele MIT','Alle offiziellen C#-Lern- und Referenzquellen unter docs/csharp, mit Quellstand statt unbelegter Sprachversionsbehauptung.',['.md','.mdx']),
 pack('cpp-guidelines','cpp','C++ Core Guidelines','isocpp/CppCoreGuidelines','master','.',
  'CC BY 4.0','Vollständige öffentlich verfügbare C++ Core Guidelines aus dem Quellrepository; keine Behauptung, damit sei cppreference oder ISO C++ vollständig enthalten.',['.md','.markdown']),
 pack('php-manual','php','PHP Manual · English Source','php/doc-en','master','.',
  'CC BY 3.0 (Handbuchtext)','Offizielle vollständige englische DocBook-XML-Quellsammlung des PHP Manuals. XML wird als lesbarer Text aufbereitet; externe Entity-Referenzen werden nicht nachgeladen.',['.xml']),
 pack('go-documentation','go','Go Official Documentation','golang/website','master','_content/doc/',
  'BSD 3-Clause','Alle offiziell gepflegten Go-Webdokumentationsquellen unter _content/doc einschließlich Tutorials und Referenzartikel.',['.md','.html','.txt']),
 pack('rust-book','rust','The Rust Programming Language','rust-lang/book','main','src/',
  'MIT / Apache-2.0','Der vollständige Quelltext des offiziellen Rust Books einschließlich Anhängen. Rust Reference und Standardbibliothek sind eigene Publikationen.',['.md']),
 pack('rust-reference','rust','The Rust Reference','rust-lang/reference','master','src/',
  'MIT / Apache-2.0','Der vollständige Text der offiziellen Rust-Sprachreferenz.',['.md']),
 pack('kotlin-docs','kotlin','Kotlin Documentation','JetBrains/kotlin-web-site','master','docs/topics/',
  'Apache-2.0','Alle offiziellen Kotlin-Dokumentationskapitel unter docs/topics, inklusive Sprachkonzepten, Coroutines und Multiplatform.',['.md','.mdx'])
];
