import {TEXTBOOK,type TextbookChapter} from './textbook.ts';
import {COMPLETE_CONCEPT_BY_ID} from './complete-concepts.ts';
import {LANGUAGE_SPECS,type LanguageSpec} from './language-reference.ts';
import type {LanguageVariant} from './concepts.ts';
import {JAVA_ADVANCED_LESSONS} from './java-advanced.ts';
import {TYPESCRIPT_PRACTICE_LESSONS} from './typescript-practice.ts';
import {RUST_PRACTICE_LESSONS} from './rust-practice.ts';
import {bookCurriculum,validateBookCurricula,type BookCurriculum} from './book-curricula.ts';
import {JAVA_NEW_CHAPTERS,TYPESCRIPT_NEW_CHAPTERS,RUST_NEW_CHAPTERS} from './book-expansion-v1.ts';
import {CONTROL_FLOW_LESSONS} from './control-flow-expansion.ts';
import {NEW_LANGUAGE_CHAPTERS} from './seven-language-chapters.ts';
import {SECOND_LANGUAGE_CHAPTERS} from './seven-language-second-chapters.ts';
import {THIRD_LANGUAGE_CHAPTERS} from './ten-language-third-chapters.ts';
import {PYTHON_FOUNDATIONS_VOLUME} from './python-foundations-volume.ts';
import {JAVASCRIPT_CORE_VOLUME} from './javascript-core-volume.ts';
import {JAVA_PLATFORM_VOLUME} from './java-platform-volume.ts';
import {TYPESCRIPT_TYPE_SYSTEM_VOLUME} from './typescript-type-system-volume.ts';
import {RUST_STANDARD_LIBRARY_VOLUME} from './rust-standard-library-volume.ts';
import {FIVE_LANGUAGE_PROFESSIONAL_VOLUME} from './five-language-professional-volume.ts';

/** Original learning material shipped in the application; never generated on the user's device. */
export type PublishedLesson={
 readonly id:string;readonly title:string;readonly chapter:TextbookChapter;
 readonly implementation:LanguageVariant;
 /** True when a shared concept chapter already embeds its language-specific example inline. */
 readonly exampleInline?:boolean;
};
export type PublishedTextbook={
 readonly id:string;readonly title:string;readonly description:string;
 readonly language:LanguageSpec;readonly edition:string;readonly lessons:readonly PublishedLesson[];
 readonly copyrightNotice:string;readonly curriculum?:BookCurriculum;
 readonly editorialStatus:'in-progress'|'complete';
 readonly editorialAuditApproved?:boolean;
};
const authoredExtensions:Readonly<Record<string,readonly PublishedLesson[]>>={
 java:[...JAVA_ADVANCED_LESSONS,...JAVA_NEW_CHAPTERS,...CONTROL_FLOW_LESSONS.filter(item=>item.implementation.language==='java'),...THIRD_LANGUAGE_CHAPTERS.filter(item=>item.implementation.language==='java'),...JAVA_PLATFORM_VOLUME],
 typescript:[...TYPESCRIPT_PRACTICE_LESSONS,...TYPESCRIPT_NEW_CHAPTERS,...CONTROL_FLOW_LESSONS.filter(item=>item.implementation.language==='typescript'),...THIRD_LANGUAGE_CHAPTERS.filter(item=>item.implementation.language==='typescript'),...TYPESCRIPT_TYPE_SYSTEM_VOLUME],
 rust:[...RUST_PRACTICE_LESSONS,...RUST_NEW_CHAPTERS,...CONTROL_FLOW_LESSONS.filter(item=>item.implementation.language==='rust'),...THIRD_LANGUAGE_CHAPTERS.filter(item=>item.implementation.language==='rust'),...RUST_STANDARD_LIBRARY_VOLUME],
 python:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='python'),...PYTHON_FOUNDATIONS_VOLUME],
 javascript:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='javascript'),...JAVASCRIPT_CORE_VOLUME],
 csharp:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='csharp'),...FIVE_LANGUAGE_PROFESSIONAL_VOLUME.filter(item=>item.implementation.language==='csharp')],
 cpp:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='cpp'),...FIVE_LANGUAGE_PROFESSIONAL_VOLUME.filter(item=>item.implementation.language==='cpp')],
 php:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='php'),...FIVE_LANGUAGE_PROFESSIONAL_VOLUME.filter(item=>item.implementation.language==='php')],
 go:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='go'),...FIVE_LANGUAGE_PROFESSIONAL_VOLUME.filter(item=>item.implementation.language==='go')],
 kotlin:[...[...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS].filter(item=>item.implementation.language==='kotlin'),...FIVE_LANGUAGE_PROFESSIONAL_VOLUME.filter(item=>item.implementation.language==='kotlin')]
};
/** A complete table of contents is not proof of verified documentation coverage. No approvals exist yet. */
const SOURCE_AUDIT_APPROVALS:Readonly<Record<string,boolean>>={};
/** Shared conceptual prose is language-neutral, but its original illustrative snippets are Java.
 * Replace those snippets at publication time: exactly one example from the selected language
 * appears in the appropriate section, never a Java sample in a different language book.
 */
export function localizeSharedChapter(chapter:TextbookChapter,variant:LanguageVariant):TextbookChapter{
 const exampleIndex=chapter.sections.findIndex(section=>Boolean(section.code));
 const insertionIndex=exampleIndex>=0?exampleIndex:0;
 return {...chapter,sections:chapter.sections.map((section,index)=>({
  ...section,
  code:index===insertionIndex?variant.code:undefined,
  annotation:index===insertionIndex?variant.explanation+' '+variant.differences:undefined
 }))};
}
const originalBooks:readonly PublishedTextbook[]=LANGUAGE_SPECS.map(language=>{
 const original:PublishedLesson[]=TEXTBOOK.flatMap(chapter=>{
  const concept=COMPLETE_CONCEPT_BY_ID.get(chapter.conceptId);
  const implementation=concept?.variants.find(item=>item.language===language.id);
  return concept&&implementation?[{id:chapter.conceptId,title:concept.title,chapter:localizeSharedChapter(chapter,implementation),implementation,exampleInline:true}]:[];
 });
 const lessons=[...original,...(authoredExtensions[language.id]??[])];
 const curriculum=bookCurriculum(language.id);
 const plan=curriculum?.parts.flatMap(part=>part.chapters)??[];
 const published=new Map(lessons.map(chapter=>[chapter.id,chapter]));
 const ordered=curriculum?plan.flatMap(chapter=>{
  const found=published.get(chapter.id);return found?[found]:[];
 }):lessons;
 const audited=SOURCE_AUDIT_APPROVALS[language.id]===true;
 const complete=audited&&!!curriculum&&plan.length===ordered.length&&
  plan.every(chapter=>published.has(chapter.id));
 return {
  id:'checkmate-'+language.id+'-basics-v1',
  title:language.name+' verstehen – das Checkmate-Fachbuch',
  description:curriculum?
   'Systematisch von den Grundlagen bis zu fortgeschrittenen Anwendungen. Fertige Kapitel sind sofort offline lesbar; weitere Kapitel werden redaktionell ergänzt.':
   'Redaktionell ausgearbeitete Grundlagen mit Lernzielen, Erklärungen, Codebeispielen und Übungen.',
  language,edition:'Checkmate · Redaktioneller Ausbau 1',
  lessons:ordered,curriculum,editorialAuditApproved:audited,editorialStatus:complete?'complete' as const:'in-progress' as const,
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
   if(lesson.exampleInline){
    const snippets=lesson.chapter.sections.flatMap(section=>section.code?[section.code]:[]);
    if(snippets.length!==1||snippets[0]!==lesson.implementation.code)
     errors.push('Fremdsprachiger oder doppelter Code im Grundlagenkapitel: '+book.id+'/'+lesson.id);
   }
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
   if(book.editorialStatus==='complete'&&!book.editorialAuditApproved)
    errors.push('Fachbuch ohne redaktionell genehmigte Dokumentationsabdeckung als vollständig bezeichnet: '+book.id);
   if(book.editorialStatus==='in-progress'&&trulyComplete&&book.editorialAuditApproved)
    errors.push('Fertige Kapitelreihe nicht als vollständig markiert: '+book.id);
  }else if(book.editorialStatus==='complete'){
   errors.push('Abgeschlossene Buchausgabe ohne überprüfbares Gesamtcurriculum: '+book.id);
  }
 }
 return errors;
}
