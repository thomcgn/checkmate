import type {LanguageId} from '../content/concepts';

export type PackDefinition={
 readonly id:string;readonly language:LanguageId;readonly title:string;
 readonly repo:string;readonly ref:string;readonly prefix:string;
 readonly license:string;readonly licenseUrl:string;
 readonly extent:string;readonly sourceUrl:string;
};
export type DocumentEntry={readonly path:string;readonly title:string;readonly text:string};
export type InstalledDocumentPack={
 readonly id:string;readonly language:LanguageId;readonly title:string;readonly sourceCommit:string;
 readonly sourceUrl:string;readonly license:string;readonly licenseUrl:string;
 readonly installedAt:string;readonly extent:string;readonly documents:readonly DocumentEntry[];
};
export type DocumentPackStatus={id:string;installed:boolean;count:number;sourceCommit:string|null;installedAt:string|null};
export type PackProgress={id:string;phase:'downloading'|'extracting'|'saving'|'finished';detail:string;done:number;total:number};
export type DocumentationBridge={
 packs():Promise<DocumentPackStatus[]>;
 installPack(id:string):Promise<DocumentPackStatus>;
 loadPack(id:string):Promise<InstalledDocumentPack|null>;
 onPackProgress(callback:(v:PackProgress)=>void):()=>void;
};

/**
 * Each source scope describes a complete *specific upstream publication*, not the
 * complete specification, API catalog or standard library of a programming language.
 * All imported bytes are pinned to a Git commit and attributed.
 */
export const OFFICIAL_PACKS:readonly PackDefinition[]=[
 {id:'rust-book',language:'rust',title:'The Rust Programming Language (The Book)',
  repo:'rust-lang/book',ref:'main',prefix:'src/',license:'MIT / Apache-2.0',
  licenseUrl:'https://github.com/rust-lang/book/blob/main/LICENSE-MIT',
  extent:'Vollständiger Textbestand von The Rust Programming Language aus dem offiziellen Buch-Repository; nicht Rust Reference oder Standardbibliothek.',
  sourceUrl:'https://github.com/rust-lang/book'},
 {id:'typescript-guide',language:'typescript',title:'TypeScript Handbook und Dokumentationsseiten',
  repo:'microsoft/TypeScript-Website',ref:'v2',prefix:'packages/documentation/copy/en/',
  license:'CC BY 4.0 (Dokumentation)',
  licenseUrl:'https://github.com/microsoft/TypeScript-Website/blob/v2/LICENSE',
  extent:'Sämtliche englischen Markdown-Dokumentationsseiten des offiziellen TypeScript-Website-Quellbestands; nicht automatisch alle API-Typdefinitionen.',
  sourceUrl:'https://github.com/microsoft/TypeScript-Website'},
 {id:'python-manual',language:'python',title:'Python Documentation (CPython Source)',
  repo:'python/cpython',ref:'3.15',prefix:'Doc/',license:'Python Software Foundation License Version 2',
  licenseUrl:'https://github.com/python/cpython/blob/main/Doc/license.rst',
  extent:'Textquellen der offiziellen CPython-3.15-Dokumentation im Doc-Verzeichnis; ohne generierte HTML-Indizes und Sphinx-Erweiterungen.',
  sourceUrl:'https://github.com/python/cpython'}
];
