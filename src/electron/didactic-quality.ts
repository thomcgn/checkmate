import type {LessonSection} from '../shared/repository.ts';

export type DidacticAudit={sections:number;characters:number;hasWalkthrough:boolean;hasPitfalls:boolean};
const markdownHeading=/^#{2,4}\s+\S/mg;
const section=(text:string,words:RegExp):boolean=>text.split('\n').some(line=>/^#{2,4}\s/.test(line)&&words.test(line));
/** A deterministic structure floor, NOT a claim that all factual explanations are correct. */
export function auditDidacticChapter(chapter:LessonSection):DidacticAudit{
 const explanation=chapter.explanation.trim();
 const headings=[...explanation.matchAll(markdownHeading)].length;
 const hasWalkthrough=section(explanation,/schritt|beispiel|anwendung|walkthrough|praxis/i);
 const hasPitfalls=section(explanation,/fehler|grenzen|fallstrick|trade.off|limitations/i);
 if(explanation.length<800||headings<3||!hasWalkthrough||!hasPitfalls||
  chapter.exercise.trim().length<40||chapter.solution.trim().length<40||
  !chapter.evidence?.length||!chapter.learningObjectives||chapter.learningObjectives.length<2||
  !chapter.glossary||chapter.glossary.length<2||!chapter.reviewQuestions||chapter.reviewQuestions.length<2)
  throw Error('Didaktisches Qualitätsminimum nicht erreicht: ausführliche Grundlagen, Beispiele, typische Fehler, Aufgabe, Lösung, Quellenbeleg, Lernziele, Glossar und Selbstkontrolle erforderlich.');
 return {sections:headings,characters:explanation.length,hasWalkthrough,hasPitfalls};
}
