import test from 'node:test';
import assert from 'node:assert/strict';
import {TEXTBOOK,validateTextbook} from '../src/content/textbook.ts';
import {PUBLISHED_TEXTBOOKS,publishedBook,validatePublishedBooks,localizeSharedChapter} from '../src/content/published-books.ts';
import {JAVA_ADVANCED_LESSONS} from '../src/content/java-advanced.ts';
import {TYPESCRIPT_PRACTICE_LESSONS} from '../src/content/typescript-practice.ts';
import {RUST_PRACTICE_LESSONS} from '../src/content/rust-practice.ts';
import {JAVA_NEW_CHAPTERS,TYPESCRIPT_NEW_CHAPTERS,RUST_NEW_CHAPTERS} from '../src/content/book-expansion-v1.ts';
import {CONTROL_FLOW_LESSONS} from '../src/content/control-flow-expansion.ts';
import {NEW_LANGUAGE_CHAPTERS} from '../src/content/seven-language-chapters.ts';
import {SECOND_LANGUAGE_CHAPTERS} from '../src/content/seven-language-second-chapters.ts';
import {THIRD_LANGUAGE_CHAPTERS} from '../src/content/ten-language-third-chapters.ts';
import {PYTHON_FOUNDATIONS_VOLUME} from '../src/content/python-foundations-volume.ts';
import {JAVASCRIPT_CORE_VOLUME} from '../src/content/javascript-core-volume.ts';
import {JAVA_PLATFORM_VOLUME} from '../src/content/java-platform-volume.ts';
import {TYPESCRIPT_TYPE_SYSTEM_VOLUME} from '../src/content/typescript-type-system-volume.ts';
import {RUST_STANDARD_LIBRARY_VOLUME} from '../src/content/rust-standard-library-volume.ts';
import {FIVE_LANGUAGE_PROFESSIONAL_VOLUME} from '../src/content/five-language-professional-volume.ts';
test('published books are complete original editorial content, not model placeholders',()=>{
 assert.deepEqual(validateTextbook(),[]);
 assert.deepEqual(validatePublishedBooks(),[]);
 assert.ok(PUBLISHED_TEXTBOOKS.length>=3);
 assert.ok(PUBLISHED_TEXTBOOKS.some(book=>book.language.id==='java'));
 assert.ok(PUBLISHED_TEXTBOOKS.some(book=>book.language.id==='typescript'));
 assert.ok(PUBLISHED_TEXTBOOKS.some(book=>book.language.id==='rust'));
 for(const book of PUBLISHED_TEXTBOOKS){
  assert.ok(book.lessons.length>=2,book.id);
  for(const lesson of book.lessons){
   assert.ok(TEXTBOOK.some(chapter=>chapter.conceptId===lesson.id)||JAVA_ADVANCED_LESSONS.some(chapter=>chapter.id===lesson.id)||TYPESCRIPT_PRACTICE_LESSONS.some(chapter=>chapter.id===lesson.id)||RUST_PRACTICE_LESSONS.some(chapter=>chapter.id===lesson.id)||[...JAVA_NEW_CHAPTERS,...TYPESCRIPT_NEW_CHAPTERS,...RUST_NEW_CHAPTERS,...CONTROL_FLOW_LESSONS,...NEW_LANGUAGE_CHAPTERS,...SECOND_LANGUAGE_CHAPTERS,...THIRD_LANGUAGE_CHAPTERS,...PYTHON_FOUNDATIONS_VOLUME,...JAVASCRIPT_CORE_VOLUME,...JAVA_PLATFORM_VOLUME,...TYPESCRIPT_TYPE_SYSTEM_VOLUME,...RUST_STANDARD_LIBRARY_VOLUME,...FIVE_LANGUAGE_PROFESSIONAL_VOLUME].some(chapter=>chapter.id===lesson.id));
   assert.equal(lesson.implementation.language,book.language.id);
   assert.ok(lesson.chapter.sections.length>=4);
   assert.ok(lesson.chapter.checkpoints.length>=2);
  }
 }
});
test('book identifiers resolve consistently offline',()=>{
 for(const book of PUBLISHED_TEXTBOOKS)assert.equal(publishedBook(book.id),book);
 assert.equal(publishedBook('non-existent'),undefined);
});


test('every existing authored Java, TypeScript and Rust chapter belongs to exactly one comprehensive textbook',()=>{
 const extensions=[
  {id:'java',chapters:JAVA_ADVANCED_LESSONS},
  {id:'typescript',chapters:TYPESCRIPT_PRACTICE_LESSONS},
  {id:'rust',chapters:RUST_PRACTICE_LESSONS}
 ] as const;
 for(const extension of extensions){
  const book=publishedBook('checkmate-'+extension.id+'-basics-v1');
  assert.ok(book);
  assert.ok(book.curriculum);
  assert.equal(book.editorialStatus,'in-progress');
  assert.ok(book.curriculum.parts.length>=5);
  const plan=book.curriculum.parts.flatMap(part=>part.chapters);
  assert.ok(plan.length>=30,'expected full editorial roadmap for '+extension.id);
  const ids=new Set(plan.map(chapter=>chapter.id));
  assert.equal(ids.size,plan.length);
  const authored=book.lessons.map(lesson=>lesson.id);
  assert.equal(new Set(authored).size,authored.length);
  assert.ok(extension.chapters.every(chapter=>authored.includes(chapter.id)));
  assert.ok(authored.every(id=>ids.has(id)),'published chapter missing from book plan');
  assert.ok(plan.some(chapter=>!authored.includes(chapter.id)),'missing chapters must not be hidden');
  assert.equal(book.editorialStatus,'in-progress');
  assert.equal(publishedBook('checkmate-'+extension.id+'-practice-v1'),undefined,
   'old miniature practice volumes must not appear as separate books');
  for(const chapter of extension.chapters){
   assert.ok(chapter.chapter.objectives.length>=3);
   assert.ok(chapter.chapter.sections.length>=4);
   assert.ok(chapter.chapter.sections.filter(section=>section.code).length>=3);
   assert.ok(chapter.chapter.sections.reduce((n,section)=>n+section.paragraphs.join(' ').length,0)>2400);
   assert.ok(chapter.chapter.checkpoints.length>=2);
   assert.ok(chapter.chapter.transfer.prompt.length>100);
   assert.ok(chapter.chapter.transfer.answer.length>100);
  }
 }
});

test('a book cannot be labelled editorially complete while planned chapters are absent',()=>{
 const java=publishedBook('checkmate-java-basics-v1');
 assert.ok(java);
 assert.deepEqual(validatePublishedBooks([{...java,editorialStatus:'complete'}])
  .filter(message=>message.includes('fälschlich als fertig')),[
   'Unvollständiger Band fälschlich als fertig bezeichnet: checkmate-java-basics-v1'
  ]);
});

test('new original textbook material is substantive and included in exactly one language book',()=>{
 for(const [language,chapters] of [
  ['java',JAVA_NEW_CHAPTERS],['typescript',TYPESCRIPT_NEW_CHAPTERS],['rust',RUST_NEW_CHAPTERS]
 ] as const){
  const book=publishedBook('checkmate-'+language+'-basics-v1');
  assert.ok(book);
  assert.ok(chapters.length>=1);
  for(const chapter of chapters){
   assert.ok(book.lessons.some(lesson=>lesson.id===chapter.id));
   assert.ok(chapter.chapter.sections.length>=4);
   assert.ok(chapter.chapter.sections.reduce((sum,section)=>sum+section.paragraphs.join(' ').length,0)>2400);
   assert.ok(chapter.chapter.sections.filter(section=>section.code).length>=3);
   assert.ok(chapter.chapter.objectives.length>=3);
   assert.ok(chapter.chapter.checkpoints.length>=3);
   assert.ok(chapter.chapter.transfer.prompt.length>100);
   assert.ok(chapter.chapter.transfer.answer.length>100);
  }
 }
});

test('all new control-flow lessons have independently authored complete reading content',()=>{
 assert.deepEqual(CONTROL_FLOW_LESSONS.map(lesson=>lesson.id),[
  'java-loops','ts-unions','rust-patterns'
 ]);
 for(const lesson of CONTROL_FLOW_LESSONS){
  const book=publishedBook('checkmate-'+lesson.implementation.language+'-basics-v1');
  assert.ok(book?.lessons.some(item=>item.id===lesson.id));
  assert.ok(lesson.chapter.sections.length>=4);
  assert.ok(lesson.chapter.objectives.length>=3);
  assert.ok(lesson.chapter.checkpoints.length>=3);
  assert.ok(lesson.chapter.sections.reduce((sum,part)=>sum+part.paragraphs.join(' ').length,0)>2400);
  assert.ok(lesson.chapter.sections.filter(part=>part.code?.length).length>=3);
  assert.ok(lesson.chapter.transfer.prompt.length>100);
  assert.ok(lesson.chapter.transfer.answer.length>100);
 }
});

test('every previously underserved language has substantial original teaching content',()=>{
 const expected=['python','javascript','csharp','cpp','php','go','kotlin'];
 assert.deepEqual(NEW_LANGUAGE_CHAPTERS.map(lesson=>lesson.implementation.language).sort(),[...expected].sort());
 for(const language of expected){
  const book=publishedBook('checkmate-'+language+'-basics-v1');
  assert.ok(book,language);
  assert.equal(book.editorialStatus,'in-progress');
  const authored=NEW_LANGUAGE_CHAPTERS.find(item=>item.implementation.language===language);
  assert.ok(authored,language);
  assert.equal(book.lessons.filter(lesson=>lesson.id===authored.id).length,1);
  assert.ok(authored.chapter.sections.length>=4);
  assert.ok(authored.chapter.sections.every(section=>section.paragraphs.length>=2&&!!section.code&&!!section.annotation));
  assert.ok(authored.chapter.sections.reduce((n,section)=>n+section.paragraphs.join(' ').length,0)>2200);
  assert.ok(authored.chapter.objectives.length>=3);
  assert.ok(authored.chapter.checkpoints.length>=3);
  assert.ok(authored.chapter.transfer.prompt.length>100);
  assert.ok(authored.chapter.transfer.answer.length>100);
  assert.ok(authored.implementation.docs.startsWith('https://'));
 }
});

test('second original chapters extend all seven language books without filler',()=>{
 const ids=['python','javascript','csharp','cpp','php','go','kotlin'];
 assert.deepEqual(SECOND_LANGUAGE_CHAPTERS.map(ch=>ch.implementation.language).sort(),[...ids].sort());
 for(const language of ids){
  const book=publishedBook('checkmate-'+language+'-basics-v1');
  assert.ok(book);
  const lessons=SECOND_LANGUAGE_CHAPTERS.filter(ch=>ch.implementation.language===language);
  assert.equal(lessons.length,1);
  for(const chapter of lessons){
   assert.equal(book.lessons.filter(item=>item.id===chapter.id).length,1);
   assert.equal(chapter.chapter.sections.length,4);
   assert.ok(chapter.chapter.sections.every(section=>section.paragraphs.length>=2&&!!section.code&&!!section.annotation));
   assert.ok(chapter.chapter.sections.reduce((n,section)=>n+section.paragraphs.join(' ').length,0)>2400);
   assert.equal(chapter.chapter.checkpoints.length,3);
   assert.equal(chapter.chapter.objectives.length,3);
   assert.ok(chapter.chapter.transfer.prompt.length>100);
   assert.ok(chapter.chapter.transfer.answer.length>100);
  }
 }
});

test('third authored manuscript pass adds real chapters to all ten language books',()=>{
 const languages=['python','javascript','typescript','java','csharp','cpp','php','go','rust','kotlin'];
 assert.deepEqual(THIRD_LANGUAGE_CHAPTERS.map(item=>item.implementation.language).sort(),[...languages].sort());
 const titles=new Set<string>();
 for(const language of languages){
  const book=publishedBook('checkmate-'+language+'-basics-v1');
  assert.ok(book);
  const chapters=THIRD_LANGUAGE_CHAPTERS.filter(item=>item.implementation.language===language);
  assert.equal(chapters.length,1);
  for(const chapter of chapters){
   assert.ok(!titles.has(chapter.id));titles.add(chapter.id);
   assert.equal(book.lessons.filter(lesson=>lesson.id===chapter.id).length,1);
   assert.equal(chapter.chapter.sections.length,4);
   assert.ok(chapter.chapter.sections.every(section=>section.paragraphs.length===2&&!!section.code&&!!section.annotation));
   assert.ok(chapter.chapter.sections.reduce((sum,section)=>sum+section.paragraphs.join(' ').length,0)>2200);
   assert.equal(chapter.chapter.checkpoints.length,3);
   assert.equal(chapter.chapter.objectives.length,3);
   assert.ok(chapter.chapter.transfer.prompt.length>100);
   assert.ok(chapter.chapter.transfer.answer.length>100);
   assert.ok(chapter.implementation.docs.startsWith('https://'));
  }
 }
});

test('source-grounded Python foundations volume adds five complete original chapters',()=>{
 const book=publishedBook('checkmate-python-basics-v1');
 assert.ok(book);
 assert.equal(book.editorialStatus,'in-progress');
 assert.deepEqual(PYTHON_FOUNDATIONS_VOLUME.map(ch=>ch.id),[
  'py-sequences-mappings','py-modules-packages','py-dataclasses-model','py-typing-boundaries','py-pathlib-files'
 ]);
 for(const ch of PYTHON_FOUNDATIONS_VOLUME){
  assert.equal(book.lessons.filter(item=>item.id===ch.id).length,1);
  assert.equal(ch.chapter.sections.length,4);
  assert.ok(ch.chapter.sections.every(s=>s.paragraphs.length===2&&!!s.code&&!!s.annotation));
  assert.ok(ch.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)>3000);
  assert.equal(ch.chapter.objectives.length,3);
  assert.equal(ch.chapter.checkpoints.length,3);
  assert.ok(ch.chapter.transfer.prompt.length>140);
  assert.ok(ch.chapter.transfer.answer.length>150);
  assert.ok(ch.implementation.docs.startsWith('https://docs.python.org/3/'));
 }
});

test('connected original JavaScript core volume is bundled with deep readable chapters',()=>{
 const book=publishedBook('checkmate-javascript-basics-v1');
 assert.ok(book);
 assert.equal(book.editorialStatus,'in-progress');
 assert.deepEqual(JAVASCRIPT_CORE_VOLUME.map(ch=>ch.id),[
  'js-object-prototypes','js-iterators-generators','js-maps-sets','js-error-boundaries'
 ]);
 for(const ch of JAVASCRIPT_CORE_VOLUME){
  assert.equal(book.lessons.filter(item=>item.id===ch.id).length,1);
  assert.equal(ch.chapter.sections.length,4);
  assert.ok(ch.chapter.sections.every(s=>s.paragraphs.length===2&&!!s.code&&!!s.annotation));
  assert.ok(ch.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)>3000);
  assert.equal(ch.chapter.objectives.length,3);
  assert.equal(ch.chapter.checkpoints.length,3);
  assert.ok(ch.chapter.transfer.prompt.length>140);
  assert.ok(ch.chapter.transfer.answer.length>160);
  assert.ok(ch.implementation.docs.startsWith('https://developer.mozilla.org/'));
 }
});

test('original Java platform manuscript covers object contracts, lambdas, IO and temporal types',()=>{
 const book=publishedBook('checkmate-java-basics-v1');
 assert.ok(book);
 assert.equal(book.editorialStatus,'in-progress');
 assert.deepEqual(JAVA_PLATFORM_VOLUME.map(ch=>ch.id),[
  'java-inheritance','java-lambdas','java-file-io','java-date-time'
 ]);
 for(const ch of JAVA_PLATFORM_VOLUME){
  assert.equal(book.lessons.filter(item=>item.id===ch.id).length,1);
  assert.equal(ch.chapter.sections.length,4);
  assert.ok(ch.chapter.sections.every(s=>s.paragraphs.length===2&&!!s.code&&!!s.annotation));
  assert.ok(ch.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)>3000);
  assert.equal(ch.chapter.objectives.length,3);
  assert.equal(ch.chapter.checkpoints.length,3);
  assert.ok(ch.chapter.transfer.prompt.length>140);
  assert.ok(ch.chapter.transfer.answer.length>150);
  assert.ok(ch.implementation.docs.startsWith('https://dev.java/'));
 }
});

test('TypeScript manuscript adds structural, type transformation, modules and runtime chapters',()=>{
 const book=publishedBook('checkmate-typescript-basics-v1');
 assert.ok(book);
 assert.equal(book.editorialStatus,'in-progress');
 assert.deepEqual(TYPESCRIPT_TYPE_SYSTEM_VOLUME.map(ch=>ch.id),[
  'ts-object-model','ts-utility-types','ts-modules','ts-node-fs'
 ]);
 for(const chapter of TYPESCRIPT_TYPE_SYSTEM_VOLUME){
  assert.equal(book.lessons.filter(lesson=>lesson.id===chapter.id).length,1);
  assert.equal(chapter.chapter.sections.length,4);
  assert.ok(chapter.chapter.sections.every(section=>section.paragraphs.length===2&&!!section.code&&!!section.annotation));
  assert.ok(chapter.chapter.sections.reduce((n,section)=>n+section.paragraphs.join(' ').length,0)>3000);
  assert.equal(chapter.chapter.objectives.length,3);
  assert.equal(chapter.chapter.checkpoints.length,3);
  assert.ok(chapter.chapter.transfer.prompt.length>140);
  assert.ok(chapter.chapter.transfer.answer.length>140);
  assert.ok(chapter.implementation.docs.startsWith('https://www.typescriptlang.org/'));
 }
});

test('Rust standard library chapters are authored deeply and bundled into the single book',()=>{
 const book=publishedBook('checkmate-rust-basics-v1');
 assert.ok(book);
 assert.equal(book.editorialStatus,'in-progress');
 assert.deepEqual(RUST_STANDARD_LIBRARY_VOLUME.map(ch=>ch.id),[
  'rust-smart-pointers','rust-modules','rust-closures','rust-sync','rust-testing'
 ]);
 for(const ch of RUST_STANDARD_LIBRARY_VOLUME){
  assert.equal(book.lessons.filter(item=>item.id===ch.id).length,1);
  assert.equal(ch.chapter.sections.length,4);
  assert.ok(ch.chapter.sections.every(s=>s.paragraphs.length===2&&!!s.code&&!!s.annotation));
  assert.ok(ch.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)>3000);
  assert.equal(ch.chapter.objectives.length,3);
  assert.equal(ch.chapter.checkpoints.length,3);
  assert.ok(ch.chapter.transfer.prompt.length>140);
  assert.ok(ch.chapter.transfer.answer.length>150);
  assert.ok(ch.implementation.docs.startsWith('https://doc.rust-lang.org/'));
 }
});

test('a complete textbook requires audited documentation coverage, not only filled chapter IDs',()=>{
 const java=publishedBook('checkmate-java-basics-v1');
 assert.ok(java);
 assert.notEqual(java.editorialAuditApproved,true);
 const forged={...java,editorialStatus:'complete' as const};
 assert.ok(validatePublishedBooks([forged]).some(error=>error.includes('ohne redaktionell genehmigte Dokumentationsabdeckung')));
});

test('professional manuscripts add grounded material to C#, C++, PHP, Go and Kotlin',()=>{
 const languages=['csharp','cpp','php','go','kotlin'];
 assert.deepEqual(FIVE_LANGUAGE_PROFESSIONAL_VOLUME.map(ch=>ch.implementation.language).sort(),[...languages].sort());
 for(const lang of languages){
  const book=publishedBook('checkmate-'+lang+'-basics-v1');
  assert.ok(book);
  assert.equal(book.editorialStatus,'in-progress');
  const chapter=FIVE_LANGUAGE_PROFESSIONAL_VOLUME.find(ch=>ch.implementation.language===lang);
  assert.ok(chapter);
  assert.equal(book.lessons.filter(item=>item.id===chapter.id).length,1);
  assert.equal(chapter.chapter.sections.length,4);
  assert.ok(chapter.chapter.sections.every(s=>s.paragraphs.length===2&&!!s.code&&!!s.annotation));
  assert.ok(chapter.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)>3000);
  assert.equal(chapter.chapter.objectives.length,3);
  assert.equal(chapter.chapter.checkpoints.length,3);
  assert.ok(chapter.chapter.transfer.prompt.length>140);
  assert.ok(chapter.chapter.transfer.answer.length>140);
  assert.ok(chapter.implementation.docs.startsWith('https://'));
 }
});


test('each common chapter renders only its selected language implementation throughout all ten textbooks',()=>{
 for(const book of PUBLISHED_TEXTBOOKS){
  for(const lesson of book.lessons.filter(item=>item.exampleInline)){
   const original=TEXTBOOK.find(chapter=>chapter.conceptId===lesson.id);
   assert.ok(original,'shared chapter must derive from the canonical conceptual source: '+lesson.id);
   const codeSections=lesson.chapter.sections.filter(section=>!!section.code);
   assert.equal(codeSections.length,1,book.language.id+'/'+lesson.id+' must show one contextual example');
   assert.equal(codeSections[0]?.code,lesson.implementation.code,
    book.language.id+'/'+lesson.id+' must render the actual '+book.language.name+' implementation');
   assert.ok(codeSections[0]?.annotation?.includes(lesson.implementation.differences));
   assert.equal(lesson.chapter.sections.length,original.sections.length);
   for(let index=0;index<original.sections.length;index++){
    assert.deepEqual(lesson.chapter.sections[index]?.paragraphs,original.sections[index]?.paragraphs);
    assert.equal(lesson.chapter.sections[index]?.title,original.sections[index]?.title);
   }
  }
 }
});

test('Java-only shared snippets cannot leak to Python, Rust, C#, JavaScript and other languages',()=>{
 const original=TEXTBOOK.find(chapter=>chapter.conceptId==='variables');
 assert.ok(original);
 assert.ok(original.sections.some(section=>section.code?.includes('System.out.println')));
 for(const book of PUBLISHED_TEXTBOOKS){
  const lesson=book.lessons.find(chapter=>chapter.id==='variables');
  if(!lesson)continue;
  const snippets=lesson.chapter.sections.flatMap(section=>section.code?[section.code]:[]);
  assert.deepEqual(snippets,[lesson.implementation.code]);
  if(book.language.id!=='java')assert.ok(snippets.every(code=>!code.includes('System.out.println')),
    'Java example in '+book.language.name+' book');
 }
});

test('shared section without any original code still gets one correct language sample',()=>{
 const example=TEXTBOOK[0];
 assert.ok(example);
 const variant=publishedBook('checkmate-python-basics-v1')?.lessons.find(lesson=>lesson.id==='variables')?.implementation;
 assert.ok(variant);
 const stripped={...example,sections:example.sections.map(section=>({...section,code:undefined,annotation:undefined}))};
 const localized=localizeSharedChapter(stripped,variant);
 assert.deepEqual(localized.sections.flatMap(section=>section.code?[section.code]:[]),[variant.code]);
 assert.ok(stripped.sections.every(section=>!section.code),'source must remain untouched');
});
