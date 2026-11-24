import {CONCEPT_BY_ID,LANGUAGES,AREAS,type Concept,type LanguageId,type ConceptArea,type LanguageVariant} from './concepts.ts';
import {COMPLETE_CONCEPTS as CONCEPTS} from './complete-concepts.ts';
import {CONCEPT_METADATA} from './concept-metadata.ts';
import {TEXTBOOK_BY_CONCEPT} from './textbook.ts';
import type {Stage} from '../shared/types';

export type ConceptFilters={query?:string;languages?:readonly LanguageId[];area?:ConceptArea|'all';stage?:Stage|'all'};

function normalize(s:string):string {
 return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de')
  .replace(/[^a-z0-9#+.\-]+/g,' ').trim();
}
interface IndexField{readonly text:string;readonly weight:number}
/** Der durchsuchbare Text umfasst Konzept, Sprachbeispiele und den vollständigen Lehrbuchtext. */
function searchIndex(concept:Concept):readonly IndexField[] {
 const chapter=TEXTBOOK_BY_CONCEPT.get(concept.id);
 const fields:IndexField[]=[
  {text:normalize(concept.title),weight:8},
  {text:normalize(concept.tags.join(' ')),weight:6},
  {text:normalize(concept.question+' '+concept.intuition+' '+concept.mentalModel),weight:3},
  {text:normalize(concept.walkthrough.join(' ')+' '+concept.tradeoffs.join(' ')),weight:1},
  {text:normalize(concept.exercise+' '+concept.hint+' '+concept.solution),weight:1},
  ...concept.variants.flatMap(variant=>[
   {text:normalize(LANGUAGES[variant.language]+' '+variant.name),weight:3},
   {text:normalize(variant.explanation+' '+variant.differences+' '+variant.code),weight:1}
  ])
 ];
 if(chapter){
  fields.push({text:normalize(chapter.sections.flatMap(section=>
   [section.title,...section.paragraphs,section.annotation??'']).join(' ')),weight:2});
  fields.push({text:normalize(chapter.objectives.join(' ')+' '+chapter.checkpoints
   .flatMap(check=>[check.question,check.answer,check.reason]).join(' ')),weight:1});
  for(const entry of chapter.glossary??[])fields.push({text:normalize(entry.term+' '+entry.definition),weight:2});
 }
 return fields;
}
export function searchConcepts(filters:ConceptFilters={}):Concept[] {
 const words=normalize(filters.query??'').split(' ').filter(Boolean);
 const scored=CONCEPTS.map((concept,index)=>{
  if(filters.area&&filters.area!=='all'&&concept.area!==filters.area)return null;
  if(filters.stage&&filters.stage!=='all'&&concept.stage!==filters.stage)return null;
  if(filters.languages?.length&&!filters.languages.every(language=>concept.variants.some(v=>v.language===language)))return null;
  const fields=[...searchIndex(concept),{text:normalize(AREAS[concept.area]+' '+concept.stage),weight:1}];
  let score=0;
  for(const word of words){
   const best=fields.reduce((max,field)=>field.text.split(' ').some(part=>part===word||part.startsWith(word))?Math.max(max,field.weight):max,0);
   if(!best)return null;
   score+=best;
  }
  return {concept,score,index};
 }).filter((hit):hit is {concept:Concept;score:number;index:number}=>hit!==null);
 scored.sort((a,b)=>b.score-a.score||a.index-b.index);
 return scored.map(hit=>hit.concept);
}
export function compareLanguages(concept:Concept,left:LanguageId,right:LanguageId):{left:LanguageVariant;right:LanguageVariant;identical:boolean}{
 if(left===right)throw Error('Bitte zwei verschiedene Sprachen wählen.');
 const a=concept.variants.find(v=>v.language===left);
 const b=concept.variants.find(v=>v.language===right);
 if(!a||!b)throw Error('Für diese Sprachkombination ist noch kein geprüfter Vergleich verfügbar.');
 return {left:a,right:b,identical:a.equivalence==='equivalent'&&b.equivalence==='equivalent'};
}
export function recommendedConcepts(completed:ReadonlySet<string>):Concept[]{
 return CONCEPTS.filter(c=>!completed.has(c.id)&&c.prerequisiteIds.every(id=>completed.has(id)));
}
/** Querverweise aus Redaktion plus thematisch nahe Konzepte aus Tags und Bereich. */
export function relatedConcepts(concept:Concept):readonly Concept[] {
 const explicit=[...(concept.relatedConceptIds??[]),...(CONCEPT_METADATA[concept.id]?.relatedConceptIds??[])];
 const chosen=new Set(explicit.filter(id=>CONCEPT_BY_ID.has(id)&&id!==concept.id));
 const derived=CONCEPTS.filter(candidate=>candidate.id!==concept.id&&!chosen.has(candidate.id))
  .map(candidate=>({candidate,score:candidate.tags.filter(tag=>concept.tags.includes(tag)).length*2+(candidate.area===concept.area?1:0)}))
  .filter(item=>item.score>=2).sort((a,b)=>b.score-a.score).slice(0,4).map(item=>item.candidate);
 return [...[...chosen].map(id=>CONCEPT_BY_ID.get(id)!),...derived];
}
export function dependentConcepts(id:string):readonly Concept[] {
 return CONCEPTS.filter(concept=>concept.prerequisiteIds.includes(id));
}
export function validateConceptGraph(concepts:readonly Concept[]):readonly string[]{
 const errors:string[]=[];
 const ids=new Set<string>();
 for(const concept of concepts){
  if(ids.has(concept.id))errors.push('Doppeltes Konzept: '+concept.id);
  ids.add(concept.id);
  if(!concept.variants.length)errors.push('Konzept ohne Sprachbeispiel: '+concept.id);
  if(concept.variants.length!==new Set(concept.variants.map(v=>v.language)).size)errors.push('Doppelte Sprache: '+concept.id);
  for(const variant of concept.variants){
   if(!variant.code.trim()||!variant.differences.trim()||!variant.docs.startsWith('https://'))errors.push('Unvollständiger Sprachbeleg: '+concept.id+'/'+variant.language);
  }
 }
 const state=new Map<string,'visiting'|'visited'>();
 function visit(id:string):void {
  if(state.get(id)==='visiting'){errors.push('Zyklische Voraussetzung: '+id);return;}
  if(state.get(id)==='visited')return;
  const concept=concepts.find(c=>c.id===id);
  if(!concept){errors.push('Unbekanntes Konzept: '+id);return;}
  state.set(id,'visiting');
  for(const dep of concept.prerequisiteIds){
   if(dep===id)errors.push('Selbstreferenz: '+id);
   else visit(dep);
  }
  state.set(id,'visited');
 }
 for(const concept of concepts)visit(concept.id);
 return errors;
}
/** Prüft den Katalog, den die Anwendung tatsächlich anzeigt (Basis + Handbuch-Varianten). */
export function validateConceptCatalog(concepts:readonly Concept[]=CONCEPTS):readonly string[]{
 const problems=[...validateConceptGraph(concepts)];
 const ids=new Set(concepts.map(concept=>concept.id));
 for(const concept of concepts){
  if(!concept.question.trim()||!concept.intuition.trim()||!concept.mentalModel.trim()||
     concept.walkthrough.length<2||!concept.tradeoffs.length||!concept.tags.length||
     !concept.exercise.trim()||!concept.hint.trim()||!concept.solution.trim())
   problems.push('Unvollständiges didaktisches Profil: '+concept.id);
  const seen=new Set<LanguageId>();
  for(const variant of concept.variants){
   if(seen.has(variant.language))problems.push('Doppelte Sprache im Gesamtkatalog: '+concept.id+'/'+variant.language);
   seen.add(variant.language);
   if(!variant.explanation.trim())problems.push('Leere Erklärung: '+concept.id+'/'+variant.language);
   if(!['equivalent','similar','related'].includes(variant.equivalence))
    problems.push('Unbekannte Vergleichsart: '+concept.id+'/'+variant.language);
   if(!variant.docs.startsWith('https://'))problems.push('Unzulässige Quelle: '+concept.id+'/'+variant.language);
  }
  for(const related of concept.relatedConceptIds??[])
   if(!ids.has(related)||related===concept.id)problems.push('Ungültiger Querverweis: '+concept.id+'/'+related);
 }
 return problems;
}
