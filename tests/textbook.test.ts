import test from 'node:test';
import assert from 'node:assert/strict';
import {CONCEPTS} from '../src/content/concepts.ts';
import {TEXTBOOK,getTextbookChapter,validateTextbook} from '../src/content/textbook.ts';

test('Every concept has its own detailed, internally consistent long-form chapter',()=>{
 assert.deepEqual(validateTextbook(),[]);
 assert.equal(TEXTBOOK.length,CONCEPTS.length);
 for(const chapter of TEXTBOOK){
  assert.ok(chapter.sections.length>=4,chapter.conceptId);
  assert.ok(chapter.objectives.length>=3,chapter.conceptId);
  assert.ok(chapter.checkpoints.length>=2,chapter.conceptId);
  assert.ok(chapter.sections.some(s=>s.code&&s.annotation),chapter.conceptId+' needs explained code');
 }
});
test('Fundamental and advanced chapters explain more than surface syntax',()=>{
 for(const name of ['generics','stream-pipelines','records','key-value']){
  const chapter=getTextbookChapter(name);
  assert.ok(chapter.sections.length>=5,name);
  const text=chapter.sections.flatMap(s=>s.paragraphs).join(' ');
  assert.ok(text.length>=2300,name+' should be a genuine substantial lesson');
  assert.ok(chapter.checkpoints.length>=3,name);
 }
});
test('Never confuse an example with an unexplained magic output',()=>{
 for(const chapter of TEXTBOOK){
  for(const section of chapter.sections){
   if(section.code)assert.ok((section.annotation??'').trim().length>45,chapter.conceptId+'/'+section.id);
  }
 }
});
test('The editor cannot insert chapters with unknown concepts or cyclic duplicates',()=>{
 const chapter=getTextbookChapter('generics');
 assert.ok(validateTextbook([...TEXTBOOK,chapter]).some(x=>x.includes('Doppeltes Kapitel')));
 assert.ok(validateTextbook(TEXTBOOK.filter(c=>c.conceptId!=='generics')).some(x=>x.includes('ohne Lehrbuchkapitel')));
 assert.throws(()=>getTextbookChapter('does-not-exist'));
});
