/** Reproducible source-content concept graph; no model inference or silent sampling. */
export type CurriculumStage='foundations'|'language'|'application'|'advanced'|'reference';
export type CurriculumUnit={index:number;title:string;path:string;stage:CurriculumStage;prerequisites:CurriculumStage[];concepts:string[];dependsOnUnits:number[]};
export type CurriculumPart={stage:CurriculumStage;title:string;goal:string;unitIndices:number[]};
export type CurriculumLink={from:number;to:number;concept:string};
export type Curriculum={version:1;units:CurriculumUnit[];parts:CurriculumPart[];links:CurriculumLink[];coveredUnits:number;totalUnits:number};
type UnitInput={title:string;fragments:readonly {path:string;text?:string}[]};
const stages:readonly CurriculumStage[]=['foundations','language','application','advanced','reference'];
const partInfo:Record<CurriculumStage,{title:string;goal:string;prerequisites:CurriculumStage[]}>={
 foundations:{title:'Grundlagen und Orientierung',goal:'Entwicklungsumgebung, Syntax, elementare Werte und Sprachprinzipien verstehen',prerequisites:[]},
 language:{title:'Sprachkonzepte und Datenstrukturen',goal:'Typen, Funktionen, Klassen, Collections und Fehlerbehandlung sicher anwenden',prerequisites:['foundations']},
 application:{title:'Anwendungen entwickeln und testen',goal:'Programme strukturieren, Ein- und Ausgabe, Schnittstellen und Tests beherrschen',prerequisites:['foundations','language']},
 advanced:{title:'Fortgeschrittene Techniken',goal:'Nebenläufigkeit, Performance, Metaprogrammierung und komplexe Systeme beurteilen',prerequisites:['foundations','language']},
 reference:{title:'Vertiefende Referenz und Spezialthemen',goal:'Spezialisierte APIs und Referenzwissen anhand belegter Beispiele erschließen',prerequisites:['foundations','language']}
};
type Concept={id:string;stage:CurriculumStage;match:RegExp;after:readonly string[]};
const concepts:readonly Concept[]=[
 {id:'syntax',stage:'foundations',match:/\b(?:syntax|hello.world|installation|getting.started|setup|introduction|intro|grundlagen|einführung|erste.schritte)\b/i,after:[]},
 {id:'variables',stage:'foundations',match:/\b(?:variable|variables|values|primitive|assignment|binding|wert|werte|variablen|literal)\b/i,after:['syntax']},
 {id:'control-flow',stage:'foundations',match:/\b(?:control.flow|loops?|branching|conditional|if.statement|switch|schleife|verzweigung)\b/i,after:['variables']},
 {id:'types',stage:'language',match:/\b(?:types?|type.system|typing|typen|datentypen|type.checking)\b/i,after:['variables']},
 {id:'functions',stage:'language',match:/\b(?:functions?|methods?|methoden|funktionen|closures?|scope)\b/i,after:['variables']},
 {id:'objects',stage:'language',match:/\b(?:objects?|classes|class|oop|interfaces?|inheritance|traits?|records?|klassen|objekte)\b/i,after:['types']},
 {id:'collections',stage:'language',match:/\b(?:collections?|arrays?|lists?|maps?|sets?|dictionary|dictionaries|iterators?|streams?)\b/i,after:['types']},
 {id:'exceptions',stage:'language',match:/\b(?:exceptions?|errors?|throw|catch|try.except|error.handling|fehlerbehandlung)\b/i,after:['functions']},
 {id:'generics',stage:'advanced',match:/\b(?:generics?|parametric.polymorphism|type.parameters?|type.variables?|generische|genericity)\b/i,after:['types','collections']},
 {id:'testing',stage:'application',match:/\b(?:tests?|testing|unit.test|assertions?|pytest|junit|debugging)\b/i,after:['functions']},
 {id:'files',stage:'application',match:/\b(?:files?|file.io|read.write|serialization|streams?.io|filesystem|dateien|eingabe.ausgabe)\b/i,after:['functions']},
 {id:'networking',stage:'application',match:/\b(?:http|network(?:ing)?|web|server|client|rest.api|sockets?|datenbank|database)\b/i,after:['functions']},
 {id:'async',stage:'advanced',match:/\b(?:async|await|asynchron|coroutines?|promises?|futures?|concurren\w*|threads?|parallel\w*)\b/i,after:['functions','exceptions']},
 {id:'performance',stage:'advanced',match:/\b(?:performance|optimiza\w*|profiling|benchmark\w*|memory.management|memory.model|effizienz)\b/i,after:['collections']},
 {id:'metaprogramming',stage:'advanced',match:/\b(?:reflection|metaprogram\w*|macros?|unsafe|runtime.internals|internals)\b/i,after:['objects']}
];
const fallbackPatterns:ReadonlyArray<{stage:CurriculumStage;pattern:RegExp}>=[
 {stage:'foundations',pattern:/(?:^|[/\s_-])(?:intro(?:duction)?|getting.started|quick.start|installation|setup|overview|tutorial|beginner|basic|syntax|hello.world|erste.schritte|grundlagen|einführung|einleitung|start.here)(?:$|[/\s_.-])/i},
 {stage:'advanced',pattern:/\b(?:concurren|async|await|thread|parallel|performance|optimiz|reflection|metaprogram|unsafe|generics|memory.model|runtime.internals|advanced|internals|coroutines|multithread|memory.management)\w*/i},
 {stage:'application',pattern:/\b(?:testing|test|debug|network|database|http|server|client|web|file|files|input.output|serialization|logging|build|deploy|packag|framework|project|practical)\w*/i},
 {stage:'language',pattern:/\b(?:type|class|object|interface|function|method|collection|list|map|set|array|control|loop|condition|exception|error|inherit|trait|module|operator|expression|variable|string|record|lambda|enum|pattern.match)\w*/i}
];
const stageRank=(stage:CurriculumStage):number=>stages.indexOf(stage);
export function classifyCurriculumUnit(title:string,path:string):CurriculumStage{
 const candidate=title+' '+path.replace(/[/_.-]/g,' ');
 for(const item of fallbackPatterns)if(item.pattern.test(candidate))return item.stage;
 return 'reference';
}
const relevantHeadings=(text:string):string[]=>text.split('\n')
 .filter(line=>/^\s*(?:#{1,4}\s+|[A-Z][^:]{2,50}:)/.test(line)).slice(0,8);
function detectConcepts(input:UnitInput):{primary:Concept|undefined;matches:string[]}{
 const name=input.title+' '+input.fragments.map(f=>f.path).join(' ');
 const excerpt=input.fragments.map(f=>(f.text??'').slice(0,4000)).join('\n');
 const headings=relevantHeadings(excerpt).join(' ');
 const byName=concepts.filter(c=>c.match.test(name));
 const byHeading=concepts.filter(c=>c.match.test(headings));
 const byBody=concepts.filter(c=>c.match.test(excerpt));
 // Strong heading and path evidence outranks incidental references in documentation prose.
 const primary=byName[0]??byHeading[0]??byBody[0];
 return {primary,matches:[...new Set([...byName,...byHeading,...byBody].map(c=>c.id))].slice(0,12)};
}
export function buildCurriculum(inputs:readonly UnitInput[]):Curriculum{
 if(!inputs.length)throw Error('Kein Quellmaterial für einen Lehrplan vorhanden.');
 const primaryConcepts:(Concept|undefined)[]=[];
 const units:CurriculumUnit[]=inputs.map((input,index)=>{
  const path=input.fragments[0]?.path;
  if(!path||!input.title.trim())throw Error('Lehrplaneinheit ohne Titel oder Quelldatei.');
  const found=detectConcepts(input);
  primaryConcepts.push(found.primary);
  const stage=found.primary?.stage??classifyCurriculumUnit(input.title,path);
  return {index,title:input.title,path,stage,prerequisites:[...partInfo[stage].prerequisites],concepts:found.matches,dependsOnUnits:[]};
 });
 const links:CurriculumLink[]=[];
 for(const unit of units){
  const primary=primaryConcepts[unit.index];
  if(!primary)continue;
  for(const dependency of primary.after){
   const provider=units.find(other=>other.index!==unit.index&&
    primaryConcepts[other.index]?.id===dependency&&stageRank(other.stage)<=stageRank(unit.stage));
   if(provider){
    unit.dependsOnUnits.push(provider.index);
    links.push({from:provider.index,to:unit.index,concept:dependency});
   }
  }
 }
 const ordered:CurriculumUnit[]=[];
 const visited=new Set<number>();
 // Dependency-safe topological order; no inferred links may hide source coverage.
 while(ordered.length<units.length){
  const ready=units.filter(u=>!visited.has(u.index)&&u.dependsOnUnits.every(dep=>visited.has(dep)))
   .sort((a,b)=>stageRank(a.stage)-stageRank(b.stage)||a.index-b.index);
  if(!ready.length)throw Error('Zyklischer Lernplan: Voraussetzungen widersprechen einander.');
  const next=ready[0];ordered.push(next);visited.add(next.index);
 }
 const parts:CurriculumPart[]=stages.flatMap(stage=>{
  const group=ordered.filter(unit=>unit.stage===stage);
  return group.length?[{stage,title:partInfo[stage].title,goal:partInfo[stage].goal,unitIndices:group.map(u=>u.index)}]:[];
 });
 const all=parts.flatMap(p=>p.unitIndices);
 if(new Set(all).size!==inputs.length||all.length!==inputs.length)
  throw Error('Lehrplan lässt Quelleneinheiten aus oder enthält Duplikate.');
 if(links.some(link=>all.indexOf(link.from)>=all.indexOf(link.to)))
  throw Error('Die Lehrbuchteile verletzen eine erkannte Lernvoraussetzung.');
 return {version:1,units,parts,links,coveredUnits:all.length,totalUnits:inputs.length};
}
export function curriculumOrder(curriculum:Curriculum):number[]{
 return curriculum.parts.flatMap(part=>part.unitIndices);
}
