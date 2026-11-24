import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBeginnerBook} from '../src/content/pizzeria-book.ts';
import {PIZZERIA_OPERATIONS_BOOK} from '../src/content/pizzeria-operations.ts';

test('Band 2 ist vollständig, altersgerecht und quellenbelegt',()=>{
 assert.deepEqual(validateBeginnerBook(PIZZERIA_OPERATIONS_BOOK),[]);
 assert.equal(PIZZERIA_OPERATIONS_BOOK.chapters.length,25);
 assert.equal(PIZZERIA_OPERATIONS_BOOK.stages.length,6);
 for(const chapter of PIZZERIA_OPERATIONS_BOOK.chapters){
  assert.ok(chapter.problem.length>40,chapter.id);
  assert.ok(chapter.objectives.length>=2,chapter.id);
  assert.ok(chapter.explain.length>=2,chapter.id);
  assert.ok(chapter.wordbank.length>=2,chapter.id);
  assert.ok(chapter.tryIt.length>30&&chapter.misconception.length>30&&chapter.solution.length>30,chapter.id);
  assert.ok(chapter.rule.natural.includes('WENN'),chapter.id);
  if(chapter.code)assert.ok(chapter.code.split('\n').length<=9,chapter.id);
 }
});

test('Band 2 deckt die betrieblichen Themen in sinnvoller Reihenfolge ab',()=>{
 const ids=PIZZERIA_OPERATIONS_BOOK.chapters.map(chapter=>chapter.id);
 assert.equal(ids[0],'after-restart');
 assert.equal(ids[24],'go-live');
 for(const id of ['database','jpa-entity','repository','login','password','roles',
  'error-contract','validation','retry','logging','unit-repeat','integration','ci',
  'docker','profiles','secrets','frontend','go-live'])assert.ok(ids.includes(id),id);
 assert.ok(ids.indexOf('database')<ids.indexOf('jpa-entity'));
 assert.ok(ids.indexOf('jpa-entity')<ids.indexOf('repository'));
 assert.ok(ids.indexOf('login')<ids.indexOf('roles'));
 assert.ok(ids.indexOf('unit-repeat')<ids.indexOf('ci'));
 assert.ok(ids.indexOf('docker')<ids.indexOf('secrets'));
});
