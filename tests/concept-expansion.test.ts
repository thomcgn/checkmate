import test from 'node:test';
import assert from 'node:assert/strict';
import {CONCEPTS,getConcept} from '../src/content/concepts.ts';
import {COMPLETE_CONCEPTS,COMPLETE_CONCEPT_BY_ID} from '../src/content/complete-concepts.ts';
import {searchConcepts,validateConceptCatalog,relatedConcepts,dependentConcepts,compareLanguages} from '../src/content/concept-library.ts';
import {TEXTBOOK,getTextbookChapter,validateTextbook} from '../src/content/textbook.ts';
import {PUBLISHED_TEXTBOOKS,validatePublishedBooks} from '../src/content/published-books.ts';

const EXPANDED=['ownership','iterators','closures','equality'];

test('erweiterter Katalog ist vollständig, zyklusfrei und konsistent',()=>{
 assert.deepEqual(validateConceptCatalog(),[]);
 assert.deepEqual(validateConceptCatalog(COMPLETE_CONCEPTS),[]);
 assert.deepEqual(validateTextbook(),[]);
 assert.deepEqual(validatePublishedBooks(),[]);
 assert.ok(CONCEPTS.length>=17);
 for(const id of EXPANDED)assert.ok(getConcept(id),id);
 for(const id of EXPANDED){
  const concept=getConcept(id);
  assert.ok(concept.variants.length>=8,id);
  assert.ok(concept.walkthrough.length>=3,id);
  assert.ok(concept.exercise.length>30&&concept.solution.length>60,id);
  for(const variant of concept.variants){
   assert.ok(variant.docs.startsWith('https://'),id+'/'+variant.language);
   assert.ok(variant.differences.length>50,id+'/'+variant.language);
  }
 }
});

test('die Volltextsuche findet Inhalte aus Lehrtexten und Sprachbeispielen',()=>{
 for(const query of ['borrow-checker','yield','NaN','try-with-resources','Hash-Invariante','Object.is','RAII'])
  assert.ok(searchConcepts({query}).length>0,'keine Treffer für '+query);
 assert.ok(searchConcepts({query:'ownership'}).some(c=>c.id==='ownership'));
 assert.ok(searchConcepts({languages:['rust','python']}).length>=3);
 const ranked=searchConcepts({query:'Gleichheit'});
 assert.equal(ranked[0].id,'equality');
});

test('Querverweise und Lernpfad verknüpfen die Konzepte',()=>{
 assert.ok(relatedConcepts(getConcept('ownership')).some(c=>c.id==='records'));
 assert.ok(relatedConcepts(getConcept('iterators')).some(c=>c.id==='stream-pipelines'));
 assert.ok(dependentConcepts('functions').some(c=>c.id==='closures'));
 assert.ok(dependentConcepts('records').some(c=>c.id==='equality'));
 for(const concept of CONCEPTS)
  for(const related of relatedConcepts(concept))assert.notEqual(related.id,concept.id);
});

test('neue Kapitel besitzen Lernziele, Quellen, Glossar und Aufgaben',()=>{
 assert.equal(TEXTBOOK.length,CONCEPTS.length);
 for(const id of EXPANDED){
  const chapter=getTextbookChapter(id);
  assert.ok(chapter.objectives.length>=3,id);
  assert.ok(chapter.sections.length>=4,id);
  assert.ok(chapter.sections.filter(section=>section.code&&section.annotation).length>=2,id);
  assert.ok(chapter.checkpoints.length>=3,id);
  assert.ok(chapter.transfer.prompt.length>100&&chapter.transfer.answer.length>100,id);
  assert.ok((chapter.sources?.length??0)>=1,id);
  assert.ok(chapter.sources?.every(source=>source.url.startsWith('https://')),id);
  assert.ok((chapter.glossary?.length??0)>=2,id);
  assert.ok(chapter.relatedConceptIds?.every(related=>getConcept(related)),id);
 }
});

test('die Validierung lehnt manipulierte Kataloge und Kapitel ab',()=>{
 const concept=getConcept('variables');
 assert.ok(validateConceptCatalog([{...concept,variants:[concept.variants[0],concept.variants[0]]}]).length>0);
 assert.ok(validateConceptCatalog([{...concept,relatedConceptIds:['does-not-exist']}]).length>0);
 assert.ok(validateConceptCatalog([{...concept,tags:[]}]).length>0);
 const chapter=getTextbookChapter('ownership');
 assert.ok(validateTextbook([{...chapter,glossary:[]}]).length>0);
 assert.ok(validateTextbook([{...chapter,sources:[]}]).length>0);
 assert.ok(validateTextbook([{...chapter,relatedConceptIds:['does-not-exist']}]).length>0);
});

test('der Sprachvergleich funktioniert auch mit Handbuch-Varianten',()=>{
 const records=COMPLETE_CONCEPT_BY_ID.get('records')!;
 const comparison=compareLanguages(records,'java','go');
 assert.equal(comparison.identical,false);
 assert.ok(comparison.right.differences.length>40);
});
