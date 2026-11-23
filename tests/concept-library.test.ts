import test from 'node:test';
import assert from 'node:assert/strict';
import {CONCEPTS,LANGUAGES,getConcept} from '../src/content/concepts.ts';
import {searchConcepts,compareLanguages,recommendedConcepts,validateConceptGraph} from '../src/content/concept-library.ts';
test('Alle Konzepte sind eindeutig, belegt und bilden einen azyklischen Lernpfad',()=>{
 assert.deepEqual(validateConceptGraph(CONCEPTS),[]);
 assert.ok(CONCEPTS.length>=12);
 assert.ok(CONCEPTS.some(c=>c.stage==='advanced'));
});
test('Suche versteht Synonyme und ist sprachübergreifend',()=>{
 assert.ok(searchConcepts({query:'HashMap'}).some(c=>c.id==='key-value'));
 assert.ok(searchConcepts({query:'Dictionary'}).some(c=>c.id==='key-value'));
 assert.ok(searchConcepts({query:'Record'}).some(c=>c.id==='records'));
 assert.ok(searchConcepts({query:'  DaTeN  '}).length>0);
 assert.ok(searchConcepts({languages:['java','python','rust']}).length>3);
 assert.equal(searchConcepts({area:'concurrency'}).length,1);
});
test('Python dict ist eine Map, Python list eine Sequenz',()=>{
 assert.equal(getConcept('key-value').variants.find(v=>v.language==='python')?.name,'dict');
 assert.equal(getConcept('sequences').variants.find(v=>v.language==='python')?.name,'list');
});
test('Java record / Rust struct / Python dataclass werden nicht als identisch ausgegeben',()=>{
 const concept=getConcept('records');
 for(const [a,b] of [['java','rust'],['java','python']] as const){
  const comparison=compareLanguages(concept,a,b);
  assert.equal(comparison.identical,false);
  assert.ok(comparison.left.differences.length>25);
  assert.ok(comparison.right.differences.length>25);
 }
 assert.throws(()=>compareLanguages(concept,'java','java'));
 assert.throws(()=>compareLanguages(concept,'go','java'));
});
test('Unbekannte Verweise und Zyklen werden abgelehnt',()=>{
 const concept=getConcept('variables');
 assert.ok(validateConceptGraph([{...concept,prerequisiteIds:['missing']}]).length>0);
 assert.ok(validateConceptGraph([{...concept,prerequisiteIds:[concept.id]}]).length>0);
});
test('Fortschritt empfiehlt nur freigeschaltete Konzepte',()=>{
 const fresh=recommendedConcepts(new Set());
 assert.ok(fresh.some(c=>c.id==='variables'));
 assert.ok(!fresh.some(c=>c.id==='generics'));
 const next=recommendedConcepts(new Set(['variables','functions','sequences']));
 assert.ok(next.some(c=>c.id==='generics'));
});
test('Vergleichssprachen sind im gemeinsamen Register erfasst',()=>{
 for(const c of CONCEPTS)for(const variant of c.variants)assert.ok(LANGUAGES[variant.language]);
});
