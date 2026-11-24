import {TEXTBOOK,type TextbookChapter} from './textbook.ts';
import {COMPLETE_CONCEPT_BY_ID} from './complete-concepts.ts';
import {LANGUAGE_SPECS,type LanguageSpec} from './language-reference.ts';
import type {LanguageVariant} from './concepts.ts';
import {JAVA_ADVANCED_LESSONS} from './java-advanced.ts';
import {TYPESCRIPT_PRACTICE_LESSONS} from './typescript-practice.ts';
import {RUST_PRACTICE_LESSONS} from './rust-practice.ts';
import {bookCurriculum,validateBookCurricula,type BookCurriculum} from './book-curricula.ts';

/** Original learning material shipped in the application; never generated on the user's device. */
export type PublishedLesson={
 readonly id:string;readonly title:string;readonly chapter:TextbookChapter;
 readonly implementation:LanguageVariant;
};
export type PublishedTextbook={
 readonly id:string;readonly title:string;readonly description:string;
 readonly language:LanguageSpec;readonly edition:string;readonly lessons:readonly PublishedLesson[];
 readonly copyrightNotice:string;readonly curriculum?:BookCurriculum;
 readonly editorialStatus:'in-progress'|'complete';
};
const authoredExtensions:Readonly<Record<string,readonly PublishedLesson[]>>={
 java:JAVA_ADVANCED_LESSONS,
 typescript:TYPESCRIPT_PRACTICE_LESSONS,
 rust:RUST_PRACTICE_LESSONS
};
const originalBooks:readonly PublishedTextbook[]=LANGUAGE_SPECS.map(language=>{
 const original:PublishedLesson[]=TEXTBOOK.flatMap(chapter=>{
  const concept=COMPLETE_CONCEPT_BY_ID.get(chapter.conceptId);
  const implementation=concept?.variants.find(item=>item.language===language.id);
  return concept&&implementation?[{id:chapter.conceptId,title:concept.title,chapter,implementation}]:[];
 });
 const lessons=[...original,...(authoredExtensions[language.id]??[])];
 const curriculum=bookCurriculum(language.id);
 const plan=curriculum?.parts.flatMap(part=>part.chapters)??[];
 const published=new Map(lessons.map(chapter=>[chapter.id,chapter]));
 const ordered=curriculum?plan.flatMap(chapter=>{
  const found=published.get(chapter.id);return found?[found]:[];
 }):lessons;
 const complete=!!curriculum&&plan.length===ordered.length&&
  plan.every(chapter=>published.has(chapter.id));
 return {
  id:'checkmate-'+language.id+'-basics-v1',
  title:language.name+' verstehen – das Checkmate-Fachbuch',
  description:curriculum?
   'Systematisch von den Grundlagen bis zu fortgeschrittenen Anwendungen. Fertige Kapitel sind sofort offline lesbar; weitere Kapitel werden redaktionell ergänzt.':
   'Redaktionell ausgearbeitete Grundlagen mit Lernzielen, Erklärungen, Codebeispielen und Übungen.',
  language,edition:'Checkmate · Redaktioneller Ausbau 1',
  lessons:ordered,curriculum,editorialStatus:complete?'complete' as const:'in-progress' as const,
  copyrightNotice:'Eigenständige Checkmate-Lehrtexte und Codebeispiele. Offizielle Dokumentationen werden als weiterführende Quellen verlinkt, nicht als fremde Bücher kopiert.'
 };
}).filter(book=>book.lessons.length>0);
export const PUBLISHED_TEXTBOOKS:readonly PublishedTextbook[]=originalBooks;
export function publishedBook(id:string):PublishedTextbook|undefined{
 return PUBLISHED_TEXTBOOKS.find(book=>book.id===id);
}
export function validatePublishedBooks(books:readonly PublishedTextbook[]=PUBLISHED_TEXTBOOKS):readonly string[]{
 const errors=[...validateBookCurricula()];
 const ids=new Set<string>();
 for(const book of books){
  if(ids.has(book.id))errors.push('Doppeltes Buch: '+book.id);
  ids.add(book.id);
  if(book.lessons.length<2)errors.push('Zu wenig Inhalte: '+book.id);
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
  if(book.curriculum){
   const planned=book.curriculum.parts.flatMap(part=>part.chapters);
   const known=new Set(planned.map(item=>item.id));
   for(const lesson of book.lessons)
    if(!known.has(lesson.id))errors.push('Lehrbuchkapitel fehlt im Inhaltsplan: '+book.id+'/'+lesson.id);
   for(const item of planned.filter(item=>chapters.has(item.id)))
    if(!item.title.trim())errors.push('Veröffentlichtes Kapitel ohne Titel: '+book.id+'/'+item.id);
   const trulyComplete=book.lessons.length===planned.length;
   if(book.editorialStatus==='complete'&&!trulyComplete)
    errors.push('Unvollständiger Band fälschlich als fertig bezeichnet: '+book.id);
   if(book.editorialStatus==='in-progress'&&trulyComplete)
    errors.push('Fertige Kapitelreihe nicht als vollständig markiert: '+book.id);
  }else if(book.editorialStatus==='complete'){
   errors.push('Abgeschlossene Buchausgabe ohne überprüfbares Gesamtcurriculum: '+book.id);
  }
 }
 return errors;
}
