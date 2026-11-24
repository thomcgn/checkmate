import test from 'node:test';
import assert from 'node:assert/strict';
import {TEXTBOOK,validateTextbook} from '../src/content/textbook.ts';
import {PUBLISHED_TEXTBOOKS,publishedBook,validatePublishedBooks} from '../src/content/published-books.ts';
import {JAVA_ADVANCED_LESSONS} from '../src/content/java-advanced.ts';
import {TYPESCRIPT_PRACTICE_LESSONS} from '../src/content/typescript-practice.ts';
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
   assert.ok(TEXTBOOK.some(chapter=>chapter.conceptId===lesson.id)||JAVA_ADVANCED_LESSONS.some(chapter=>chapter.id===lesson.id)||TYPESCRIPT_PRACTICE_LESSONS.some(chapter=>chapter.id===lesson.id));
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

test('Java advanced practice volume ships real substantial explanations and checked learning paths',()=>{
 const book=publishedBook('checkmate-java-practice-v1');
 assert.ok(book);
 assert.equal(book.lessons.length,4);
 assert.deepEqual(book.lessons.map(l=>l.id),[
  'java-type-relationships','java-collection-design','java-stream-reasoning','java-test-boundaries'
 ]);
 for(const chapter of book.lessons){
  assert.ok(chapter.chapter.objectives.length>=3);
  assert.ok(chapter.chapter.sections.length>=4);
  assert.ok(chapter.chapter.sections.reduce((n,s)=>n+s.paragraphs.join(' ').length,0)>2400);
  assert.ok(chapter.chapter.sections.filter(s=>s.code).length>=3);
  assert.ok(chapter.chapter.checkpoints.length>=2);
  assert.ok(chapter.chapter.transfer.prompt.length>100);
  assert.ok(chapter.chapter.transfer.answer.length>100);
 }
});

test('TypeScript volume is fully authored and bundled without model generation',()=>{
 const volume=publishedBook('checkmate-typescript-practice-v1');
 assert.ok(volume);
 assert.deepEqual(volume.lessons.map(chapter=>chapter.id),[
  'ts-unknown-boundaries','ts-discriminated-ui','ts-react-async'
 ]);
 for(const chapter of volume.lessons){
  assert.ok(chapter.chapter.objectives.length>=3);
  assert.ok(chapter.chapter.sections.length>=4);
  assert.ok(chapter.chapter.sections.filter(section=>section.code).length>=3);
  assert.ok(chapter.chapter.sections.reduce((n,section)=>n+section.paragraphs.join(' ').length,0)>2400);
  assert.ok(chapter.chapter.checkpoints.length>=3);
  assert.ok(chapter.chapter.transfer.prompt.length>=100);
  assert.ok(chapter.chapter.transfer.answer.length>=100);
 }
});
