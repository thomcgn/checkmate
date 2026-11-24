import {TEXTBOOK,type TextbookChapter} from './textbook.ts';
import {COMPLETE_CONCEPT_BY_ID} from './complete-concepts.ts';
import {LANGUAGE_SPECS,type LanguageSpec} from './language-reference.ts';
import type {LanguageVariant} from './concepts.ts';
import {JAVA_ADVANCED_LESSONS} from './java-advanced.ts';

/** Published, editorial content shipped inside Checkmate. Never invokes ChatGPT. */
export type PublishedLesson={
 readonly id:string;readonly title:string;readonly chapter:TextbookChapter;
 readonly implementation:LanguageVariant;
};
export type PublishedTextbook={
 readonly id:string;readonly title:string;readonly description:string;
 readonly language:LanguageSpec;readonly edition:string;readonly lessons:readonly PublishedLesson[];
 readonly copyrightNotice:string;
};
export const PUBLISHED_TEXTBOOKS:readonly PublishedTextbook[]=LANGUAGE_SPECS.map(language=>{
 const lessons:PublishedLesson[]=TEXTBOOK.flatMap(chapter=>{
  const concept=COMPLETE_CONCEPT_BY_ID.get(chapter.conceptId);
  const implementation=concept?.variants.find(item=>item.language===language.id);
  return concept&&implementation?[{id:chapter.conceptId,title:concept.title,chapter,implementation}]:[];
 });
 return {
  id:'checkmate-'+language.id+'-basics-v1',
  title:language.name+' verstehen – Grundlagen und Sprachkonzepte',
  description:'Redaktionell ausgearbeitete Kapitel mit Lernzielen, Schritt-für-Schritt-Erklärungen, eigenen Codebeispielen, Verständnisfragen und Übungen.',
  language,edition:'Checkmate Originalausgabe 1.0',lessons,
  copyrightNotice:'Eigenständige Checkmate-Lehrtexte. Verweise auf offizielle Dokumentationen sind Quellenhinweise; fremde Lehrbücher werden nicht übernommen.'
 };
}).filter(book=>book.lessons.length>0).concat([{
 id:'checkmate-java-practice-v1',
 title:'Java verstehen – Typsicherheit, Datenverarbeitung und Tests',
 description:'Vertiefungsband mit durchgehenden EventService-Beispielen: Generics, Collections, Stream-Pipelines und fachliche JUnit-Tests.',
 language:LANGUAGE_SPECS.find(spec=>spec.id==='java')!,
 edition:'Checkmate Originalausgabe · Vertiefungsband 1.0',
 lessons:[...JAVA_ADVANCED_LESSONS],
 copyrightNotice:'Eigenständige Checkmate-Lehrtexte und Beispiele. Fachliche Grundlagen anhand frei zugänglicher offizieller Java-Dokumentation erläutert; keine Übernahme fremder Buchtexte.'
}]);
export function publishedBook(id:string):PublishedTextbook|undefined{
 return PUBLISHED_TEXTBOOKS.find(book=>book.id===id);
}
export function validatePublishedBooks(books:readonly PublishedTextbook[]=PUBLISHED_TEXTBOOKS):readonly string[]{
 const errors:string[]=[];
 const ids=new Set<string>();
 for(const book of books){
  if(ids.has(book.id))errors.push('Doppeltes Buch: '+book.id);
  ids.add(book.id);
  if(book.lessons.length<2)errors.push('Zu wenig Inhalte für ein Lehrbuch: '+book.id);
  const chapters=new Set<string>();
  for(const lesson of book.lessons){
   if(chapters.has(lesson.id))errors.push('Doppeltes Kapitel: '+book.id+'/'+lesson.id);
   chapters.add(lesson.id);
   if(lesson.implementation.language!==book.language.id)errors.push('Falsche Sprachvariante: '+book.id+'/'+lesson.id);
   if(lesson.chapter.objectives.length<3||lesson.chapter.sections.length<4||
      lesson.chapter.checkpoints.length<2||!lesson.chapter.transfer.prompt||
      !lesson.chapter.transfer.answer||lesson.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)<1200)
    errors.push('Unvollständiges redaktionelles Kapitel: '+book.id+'/'+lesson.id);
   if(!lesson.implementation.code.trim()||!lesson.implementation.explanation.trim()||
      !lesson.implementation.differences.trim())errors.push('Sprachbeispiel unvollständig: '+book.id+'/'+lesson.id);
  }
 }
 return errors;
}
