import {LANGUAGES,AREAS,type Concept,type LanguageId,type ConceptArea,type LanguageVariant} from './concepts.ts';
import {COMPLETE_CONCEPTS as CONCEPTS} from './complete-concepts';
import type {Stage} from '../shared/types';

export type ConceptFilters={query?:string;languages?:readonly LanguageId[];area?:ConceptArea|'all';stage?:Stage|'all'};
export function searchConcepts(filters:ConceptFilters={}):Concept[] {
 const q=normalize(filters.query??'');
 const words=q.split(' ').filter(Boolean);
 return CONCEPTS.filter(concept=>{
  if(filters.area&&filters.area!=='all'&&concept.area!==filters.area)return false;
  if(filters.stage&&filters.stage!=='all'&&concept.stage!==filters.stage)return false;
  if(filters.languages?.length&&!filters.languages.every(language=>concept.variants.some(v=>v.language===language)))return false;
  const text=normalize([concept.title,concept.question,concept.intuition,concept.mentalModel,
   AREAS[concept.area],concept.stage,...concept.tags,...concept.variants.flatMap(v=>[LANGUAGES[v.language],v.name,v.explanation])].join(' '));
  return words.every(word=>text.includes(word));
 });
}
function normalize(s:string):string {return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de').replace(/[^a-z0-9#+.\-]+/g,' ').trim();}
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
