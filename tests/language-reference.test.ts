import test from 'node:test';
import assert from 'node:assert/strict';
import {LANGUAGE_SPECS,languagePages,searchLanguagePages,validateLanguageDocumentation} from '../src/content/language-reference.ts';

test('ten versioned language manuals contain sourced in-app chapters',()=>{
 assert.deepEqual(validateLanguageDocumentation(),[]);
 assert.equal(LANGUAGE_SPECS.length,10);
 const expected=['python','javascript','typescript','java','csharp','cpp','php','go','rust','kotlin'];
 assert.deepEqual(LANGUAGE_SPECS.map(x=>x.id),expected);
 for(const language of LANGUAGE_SPECS){
  assert.match(language.version,/\d/);
  assert.equal(language.updatedAt,'2026-11-23');
  assert.ok(languagePages(language.id).length>=8,language.id);
  assert.ok(language.bestPractices.every(x=>x.length>24));
  for(const page of languagePages(language.id)){
   assert.equal(page.variant.language,language.id);
   assert.ok(page.variant.code.length>10,language.id+'/'+page.concept.id);
   assert.ok(page.variant.differences.length>=20,language.id+'/'+page.concept.id);
   assert.ok(page.concept.exercise.length>5);
   assert.ok(page.concept.walkthrough.length>=3);
  }
 }
});
test('version-specific chapters are searchable offline in German',()=>{
 const results=searchLanguagePages('HashMap','java');
 assert.ok(results.some(x=>x.concept.id==='key-value'));
 assert.ok(searchLanguagePages('Map','cpp').some(x=>x.concept.id==='key-value'));
 assert.ok(searchLanguagePages('Exception','php').length>0);
 assert.ok(searchLanguagePages('Record','csharp').length>0);
 assert.ok(searchLanguagePages('Null','kotlin').length>0);
});
test('same conceptual problem is explained without false equivalence',()=>{
 const csharp=languagePages('csharp').find(x=>x.concept.id==='records');
 const rust=languagePages('rust').find(x=>x.concept.id==='records');
 const python=languagePages('python').find(x=>x.concept.id==='records');
 assert.ok(csharp&&rust&&python);
 assert.notEqual(csharp.variant.code,rust.variant.code);
 assert.notEqual(rust.variant.code,python.variant.code);
 assert.match(rust.variant.differences,/Gleichheit|Ownership|Struct/i);
});
