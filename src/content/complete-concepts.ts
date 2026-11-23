import {CONCEPTS,type Concept} from './concepts.ts';
import {EXTRA_VARIANTS} from './language-reference.ts';

/** One canonical reading catalog: original concepts plus versioned handbook variants. */
export const COMPLETE_CONCEPTS:readonly Concept[]=CONCEPTS.map(concept=>({
 ...concept,
 variants:[...concept.variants,...EXTRA_VARIANTS.filter(v=>v.conceptId===concept.id)],
}));
export const COMPLETE_CONCEPT_BY_ID:ReadonlyMap<string,Concept>=
 new Map(COMPLETE_CONCEPTS.map(concept=>[concept.id,concept]));
