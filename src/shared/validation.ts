import type {LearningStatus, TutorRequest} from './types';
export const STATUSES:readonly LearningStatus[]=['unseen','learning','practicing','understood'];
export function assertStatus(value:unknown):asserts value is LearningStatus{if(!STATUSES.includes(value as LearningStatus))throw Error('Ungültiger Lernstatus');}
export function assertText(value:unknown,max:number):asserts value is string{if(typeof value!=='string'||value.length>max)throw Error('Ungültiger Text');}
export function validateTutor(value:unknown):TutorRequest{if(!value||typeof value!=='object')throw Error('Ungültige Frage');const x=value as Record<string,unknown>;assertText(x.lessonId,100);assertText(x.question,3000);assertText(x.model,160);if(!x.question.trim()||!x.model.trim())throw Error('Frage und Modell fehlen');return {lessonId:x.lessonId as string,question:x.question as string,model:x.model as string};}
export function normalizeBookTitle(value:string):string{assertText(value,120);const title=value.trim();if(title.length<3)throw Error('Der Buchtitel muss mindestens drei Zeichen haben');return title;}
