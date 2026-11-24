import test from 'node:test';
import assert from 'node:assert/strict';
import {TEXTBOOK,validateTextbook} from '../src/content/textbook.ts';
import {PUBLISHED_TEXTBOOKS,publishedBook,validatePublishedBooks} from '../src/content/published-books.ts';
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
   assert.ok(TEXTBOOK.some(chapter=>chapter.conceptId===lesson.id));
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
