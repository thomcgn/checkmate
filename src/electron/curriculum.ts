/** Deterministic, source-wide curriculum index. It never asks the model to invent missing topics. */
export type CurriculumStage='foundations'|'language'|'application'|'advanced'|'reference';
export type CurriculumUnit={index:number;title:string;path:string;stage:CurriculumStage;prerequisites:CurriculumStage[]};
export type CurriculumPart={stage:CurriculumStage;title:string;goal:string;unitIndices:number[]};
export type Curriculum={version:1;units:CurriculumUnit[];parts:CurriculumPart[];coveredUnits:number;totalUnits:number};
type UnitInput={title:string;fragments:readonly {path:string}[]};
const stages:readonly CurriculumStage[]=['foundations','language','application','advanced','reference'];
const partInfo:Record<CurriculumStage,{title:string;goal:string;prerequisites:CurriculumStage[]}>={
 foundations:{title:'Grundlagen und Orientierung',goal:'Entwicklungsumgebung, Syntax, elementare Werte und Sprachprinzipien verstehen',prerequisites:[]},
 language:{title:'Sprachkonzepte und Datenstrukturen',goal:'Typen, Funktionen, Klassen, Collections und Fehlerbehandlung sicher anwenden',prerequisites:['foundations']},
 application:{title:'Anwendungen entwickeln und testen',goal:'Programme strukturieren, Ein- und Ausgabe, Schnittstellen und Tests beherrschen',prerequisites:['foundations','language']},
 advanced:{title:'Fortgeschrittene Techniken',goal:'Nebenläufigkeit, Performance, Metaprogrammierung und komplexe Systeme beurteilen',prerequisites:['foundations','language']},
 reference:{title:'Vertiefende Referenz und Spezialthemen',goal:'Spezialisierte APIs und Referenzwissen anhand belegter Beispiele erschließen',prerequisites:['foundations','language']}
};
const patterns:ReadonlyArray<{stage:CurriculumStage;pattern:RegExp}>=[
 {stage:'foundations',pattern:/(?:^|[/\s_-])(?:intro(?:duction)?|getting.started|quick.start|installation|setup|overview|tutorial|beginner|basic|syntax|hello.world|erste.schritte|grundlagen|einführung|einleitung|start.here)(?:$|[/\s_.-])/i},
 {stage:'advanced',pattern:/\b(?:concurren|async|await|thread|parallel|performance|optimiz|reflection|metaprogram|unsafe|generics|memory.model|runtime.internals|advanced|internals|coroutines|multithread|memory.management)\w*/i},
 {stage:'application',pattern:/\b(?:testing|test|debug|network|database|http|server|client|web|file|files|input.output|serialization|logging|build|deploy|packag|framework|project|practical|testing)\w*/i},
 {stage:'language',pattern:/\b(?:type|class|object|interface|function|method|collection|list|map|set|array|control|loop|condition|exception|error|inherit|trait|module|operator|expression|variable|string|record|lambda|enum|pattern.match)\w*/i}
];
export function classifyCurriculumUnit(title:string,path:string):CurriculumStage{
 const candidate=title+' '+path.replace(/[/_.-]/g,' ');
 for(const item of patterns)if(item.pattern.test(candidate))return item.stage;
 return 'reference';
}
export function buildCurriculum(inputs:readonly UnitInput[]):Curriculum{
 if(!inputs.length)throw Error('Kein Quellmaterial für einen Lehrplan vorhanden.');
 const units:CurriculumUnit[]=inputs.map((input,index)=>{
  const path=input.fragments[0]?.path;
  if(!path||!input.title.trim())throw Error('Lehrplaneinheit ohne Titel oder Quelldatei.');
  const stage=classifyCurriculumUnit(input.title,path);
  return {index,title:input.title,path,stage,prerequisites:[...partInfo[stage].prerequisites]};
 });
 const ordered=units.slice().sort((a,b)=>stages.indexOf(a.stage)-stages.indexOf(b.stage)||a.index-b.index);
 const parts:CurriculumPart[]=stages.flatMap(stage=>{
  const group=ordered.filter(unit=>unit.stage===stage);
  return group.length?[{stage,title:partInfo[stage].title,goal:partInfo[stage].goal,unitIndices:group.map(u=>u.index)}]:[];
 });
 const visited=new Set(parts.flatMap(part=>part.unitIndices));
 if(visited.size!==inputs.length||parts.reduce((n,p)=>n+p.unitIndices.length,0)!==inputs.length)
  throw Error('Lehrplan lässt Quelleneinheiten aus oder enthält Duplikate.');
 return {version:1,units,parts,coveredUnits:visited.size,totalUnits:inputs.length};
}
export function curriculumOrder(curriculum:Curriculum):number[]{
 return curriculum.parts.flatMap(part=>part.unitIndices);
}
