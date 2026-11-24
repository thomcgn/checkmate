import test from 'node:test';
import assert from 'node:assert/strict';
import {TEXTBOOK,validateTextbook} from '../src/content/textbook.ts';
import {PUBLISHED_TEXTBOOKS,publishedBook,validatePublishedBooks} from '../src/content/published-books.ts';
import {JAVA_ADVANCED_LESSONS} from '../src/content/java-advanced.ts';
import {TYPESCRIPT_PRACTICE_LESSONS} from '../src/content/typescript-practice.ts';
import {RUST_PRACTICE_LESSONS} from '../src/content/rust-practice.ts';
import {JAVA_NEW_CHAPTERS,TYPESCRIPT_NEW_CHAPTERS,RUST_NEW_CHAPTERS} from '../src/content/book-expansion-v1.ts';
import {CONTROL_FLOW_LESSONS} from '../src/content/control-flow-expansion.ts';
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
   assert.ok(TEXTBOOK.some(chapter=>chapter.conceptId===lesson.id)||JAVA_ADVANCED_LESSONS.some(chapter=>chapter.id===lesson.id)||TYPESCRIPT_PRACTICE_LESSONS.some(chapter=>chapter.id===lesson.id)||RUST_PRACTICE_LESSONS.some(chapter=>chapter.id===lesson.id)||[...JAVA_NEW_CHAPTERS,...TYPESCRIPT_NEW_CHAPTERS,...RUST_NEW_CHAPTERS,...CONTROL_FLOW_LESSONS].some(chapter=>chapter.id===lesson.id));
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
