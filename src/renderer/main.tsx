import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AREAS,LANGUAGES,type Concept,type LanguageId,type ConceptArea} from '../content/concepts';
import {COMPLETE_CONCEPTS as CONCEPTS} from '../content/complete-concepts';
import {searchConcepts,recommendedConcepts,compareLanguages} from '../content/concept-library';
import {LANGUAGE_SPECS} from '../content/language-reference';
import type {Stage} from '../shared/types';
import {DocumentationLibrary} from './documentation-library';
import {PublishedTextbookLibrary} from './published-textbook-library';
import {DocumentationInstaller} from './documentation-installer';
import {RepositoryWorkspace} from './repository-workspace';
import {TextbookReader} from './textbook-reader';
import {useRef} from 'react';
import {BookOpenText,Boxes,Download,GraduationCap,Search,Command,Settings2,SlidersHorizontal} from 'lucide-react';
import {Button} from './ui/primitives';
import {CommandPalette} from './ui/command-palette';
import './checkmate-theme.css';
import './style.css';
import './checkmate-desktop.css';
import './a11y-responsive.css';

type View='textbook'|'compare'|'practice';
const VIEWS:readonly View[]=['textbook','compare','practice'];
const VIEW_LABELS:Readonly<Record<View,{glyph:string;label:string}>>={
 textbook:{glyph:'▤',label:'Lehrbuchkapitel'},
 compare:{glyph:'◇',label:'Sprachvergleich'},
 practice:{glyph:'⌘',label:'Üben & Verinnerlichen'}
};
const MODE_TITLES:Readonly<Record<LibraryMode,string>>={
 concepts:'Konzeptbibliothek',books:'Lehrbücher',handbooks:'Originaldokumentationen',
 setup:'Dokumentationen einrichten',repositories:'Repository Lab'
};
type LibraryMode='concepts'|'books'|'handbooks'|'repositories'|'setup';
type Knowledge='unknown'|'learning'|'understood';
type StudyState={version:1;progress:Record<string,Knowledge>;notes:Record<string,string>};
const STORAGE_KEY='checkmate:concept-library:v1';
const EMPTY:StudyState={version:1,progress:{},notes:{}};
const isKnowledge=(v:unknown):v is Knowledge=>v==='unknown'||v==='learning'||v==='understood';
function loadStudy():StudyState{
 try{
  const parsed:unknown=JSON.parse(localStorage.getItem(STORAGE_KEY)??'null');
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return EMPTY;
  const raw=parsed as Record<string,unknown>;
  if(raw.version!==1||!raw.progress||typeof raw.progress!=='object'||Array.isArray(raw.progress))return EMPTY;
  const progress:Record<string,Knowledge>={};
  const notes:Record<string,string>={};
  for(const [id,value] of Object.entries(raw.progress))if(isKnowledge(value)&&CONCEPTS.some(c=>c.id===id))progress[id]=value;
  if(raw.notes&&typeof raw.notes==='object'&&!Array.isArray(raw.notes))
   for(const [id,value] of Object.entries(raw.notes))if(typeof value==='string'&&value.length<=6000&&CONCEPTS.some(c=>c.id===id))notes[id]=value;
  return {version:1,progress,notes};
 }catch{return EMPTY;}
}
const stages:Readonly<Record<Stage,string>>={basics:'Basics',intermediate:'Intermediate',advanced:'Advanced'};
const languageIds=Object.keys(LANGUAGES) as LanguageId[];
function App():React.JSX.Element{
 const [study,setStudy]=useState<StudyState>(loadStudy);
 const [libraryMode,setLibraryMode]=useState<LibraryMode>('concepts');
 const [query,setQuery]=useState('');
 const [area,setArea]=useState<ConceptArea|'all'>('all');
 const [stage,setStage]=useState<Stage|'all'>('all');
 const [languageFilter,setLanguageFilter]=useState<LanguageId|'all'>('all');
 const [selectedId,setSelectedId]=useState(CONCEPTS[0].id);
 const [left,setLeft]=useState<LanguageId>('java');
 const [right,setRight]=useState<LanguageId>('python');
 const [view,setView]=useState<View>('textbook');
 const readerRef=useRef<HTMLElement>(null);
 const tabRefs=useRef<Record<View,HTMLButtonElement|null>>({textbook:null,compare:null,practice:null});
 const titleRef=useRef<HTMLHeadingElement>(null);
 const focusTitle=useRef(false);
 const [showHint,setShowHint]=useState(false);
 const [showSolution,setShowSolution]=useState(false);
 const [answer,setAnswer]=useState('');
 const selected=CONCEPTS.find(c=>c.id===selectedId)??CONCEPTS[0];
 const results=useMemo(()=>searchConcepts({query,area,stage,
  languages:languageFilter==='all'?undefined:[languageFilter]}),[query,area,stage,languageFilter]);
 const completed=useMemo(()=>new Set(Object.entries(study.progress).filter(([,v])=>v==='understood').map(([id])=>id)),[study]);
 const recommended=useMemo(()=>recommendedConcepts(completed),[completed]);
 const status=study.progress[selected.id]??'unknown';
 const supported=selected.variants.map(v=>v.language);
 const chosenLeft=supported.includes(left)?left:supported[0];
 const chosenRight=supported.includes(right)&&right!==chosenLeft?right:
  supported.find(x=>x!==chosenLeft)??chosenLeft;
 const comparison=chosenLeft!==chosenRight?compareLanguages(selected,chosenLeft,chosenRight):null;
 const languageProfile=LANGUAGE_SPECS.find(spec=>spec.id===chosenLeft);
 useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(study));},[study]);
 const updateStatus=(next:Knowledge):void=>setStudy(current=>({...current,progress:{...current.progress,[selected.id]:next}}));
 const updateNote=(next:string):void=>{
  setStudy(current=>({...current,notes:{...current.notes,[selected.id]:next.slice(0,6000)}}));
 };
 const select=(concept:Concept):void=>{
  focusTitle.current=true;
  setSelectedId(concept.id);setView('textbook');setShowHint(false);setShowSolution(false);setAnswer('');
 };
 const selectById=(id:string):void=>{const match=CONCEPTS.find(c=>c.id===id);if(match)select(match);};
 const handleTabKey=(event:React.KeyboardEvent<HTMLButtonElement>,current:View):void=>{
  const index=VIEWS.indexOf(current);
  let next:number|undefined;
  if(event.key==='ArrowRight')next=(index+1)%VIEWS.length;
  else if(event.key==='ArrowLeft')next=(index+VIEWS.length-1)%VIEWS.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=VIEWS.length-1;
  if(next!==undefined){event.preventDefault();const target=VIEWS[next];setView(target);tabRefs.current[target]?.focus();}
 };
 const progress=Math.round(completed.size/CONCEPTS.length*100);
 useEffect(()=>{if(readerRef.current)readerRef.current.scrollTop=0;},[selectedId,view,libraryMode]);
 useEffect(()=>{
  document.title=libraryMode==='concepts'?MODE_TITLES.concepts+' · '+selected.title:MODE_TITLES[libraryMode]+' · CHECKMATE';
 },[libraryMode,selected.title]);
 useEffect(()=>{
  if(libraryMode==='concepts'&&focusTitle.current){focusTitle.current=false;titleRef.current?.focus();}
 },[selectedId,libraryMode]);
 return <div className="shell">
  <a className="cm-skip-link" href="#main-content">Zum Hauptinhalt springen</a>
  <nav className="sidebar" aria-label="Hauptnavigation">
   <div className="brand"><span className="brand-crown" aria-hidden="true">♚</span><div><strong>CHECKMATE</strong><small>learn the logic</small></div></div>
   <div className="sidebar-section"><span className="eyebrow">LEARNING OS</span>
    <Button variant="ghost" className={libraryMode==='concepts'?'active-nav':'nav-secondary'} aria-current={libraryMode==='concepts'?'page':undefined} aria-label="Konzeptbibliothek" onClick={()=>setLibraryMode('concepts')}><Boxes size={16} aria-hidden="true"/><span>Konzeptbibliothek</span><small>{CONCEPTS.length}</small></Button>
    <Button variant="ghost" className={libraryMode==='books'?'active-nav':'nav-secondary'} aria-current={libraryMode==='books'?'page':undefined} aria-label="Lehrbücher" onClick={()=>setLibraryMode('books')}><BookOpenText size={16} aria-hidden="true"/><span>Lehrbücher</span><small>Offline</small></Button>
    <Button variant="ghost" className={libraryMode==='handbooks'?'active-nav':'nav-secondary'} aria-current={libraryMode==='handbooks'?'page':undefined} aria-label="Originaldokumentationen" onClick={()=>setLibraryMode('handbooks')}><BookOpenText size={16} aria-hidden="true"/><span>Originaldokumentationen</span></Button>
    <Button variant="ghost" className={libraryMode==='setup'?'active-nav':'nav-secondary'} aria-current={libraryMode==='setup'?'page':undefined} aria-label="Dokumentationen einrichten" onClick={()=>setLibraryMode('setup')}><Download size={16} aria-hidden="true"/><span>Dokumentationen einrichten</span></Button>
    <Button variant="ghost" className={libraryMode==='repositories'?'active-nav':'nav-secondary'} aria-current={libraryMode==='repositories'?'page':undefined} aria-label="Repository Lab" onClick={()=>setLibraryMode('repositories')}><Command size={16} aria-hidden="true"/><span>Repository Lab</span><small>AI</small></Button>
    <div className="nav-secondary"><GraduationCap size={16} aria-hidden="true"/><span>Lernpfad</span><small>{recommended.length} offen</small></div>
   </div>
   {libraryMode==='concepts'&&<details className="sidebar-themes">
    <summary aria-label="Themen filter"><SlidersHorizontal size={18} aria-hidden="true"/></summary>
    <div className="sidebar-section"><span className="eyebrow">THEMEN</span>
    <button type="button" className={area==='all'?'filter active':'filter'} aria-pressed={area==='all'} onClick={()=>setArea('all')}>Alle Konzepte <span>{CONCEPTS.length}</span></button>
    {Object.entries(AREAS).map(([id,name])=><button type="button" key={id} className={area===id?'filter active':'filter'} aria-pressed={area===id} onClick={()=>setArea(id as ConceptArea)}>{name}<span>{CONCEPTS.filter(c=>c.area===id).length}</span></button>)}
    </div>
   </details>}
   <div className="side-bottom" role="group" aria-label="Dein Lernfortschritt"><div className="side-bottom-top"><span>Dein Fortschritt</span><strong>{progress}%</strong></div><div className="progress-track" role="progressbar" aria-label="Verstandene Konzepte" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div style={{width:progress+'%'}}/></div><small>{completed.size} von {CONCEPTS.length} Konzepten verstanden · lokal gespeichert</small></div>
  </nav>
  <main className={"main mode-"+libraryMode} id="main-content" tabIndex={-1}>
   <header className="topbar">
    <div><span className="eyebrow">DEINE WISSENSZENTRALE</span><h1>Code verstehen. <em>Konzepte meistern.</em></h1>
     <p>Die Idee hinter dem Code lernen – und dieselbe Lösung in unterschiedlichen Sprachen erkennen.</p></div>
    <div className="cm-topbar-actions"><CommandPalette onNavigate={setLibraryMode}/><div className="top-chip"><span className="chip-dot" aria-hidden="true"/> Offline-Wissensbasis <small>Kein KI-Zugang erforderlich</small></div><Button variant="ghost" size="icon" title="Dokumentationspakete verwalten" aria-label="Dokumentationspakete verwalten" onClick={()=>setLibraryMode('setup')}><Settings2 size={18} aria-hidden="true"/></Button></div>
   </header>
   {libraryMode==='concepts'?<>
   <section className="toolbar" aria-label="Konzeptbibliothek durchsuchen">
    <label className="search-wrap"><Search size={17} aria-hidden="true"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Suche: HashMap, dict, record, Streams …" aria-label="Konzept suchen"/></label>
    <select value={stage} onChange={e=>setStage(e.target.value as Stage|'all')} aria-label="Schwierigkeitsgrad"><option value="all">Alle Level</option><option value="basics">Basics</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
    <select value={languageFilter} onChange={e=>setLanguageFilter(e.target.value as LanguageId|'all')} aria-label="Sprache filtern">
     <option value="all">Alle Sprachen</option>
     {languageIds.map(id=><option key={id} value={id}>{LANGUAGES[id]}</option>)}
    </select>
    <span className="result-count" role="status" aria-live="polite">{results.length} Konzepte</span>
   </section>
   <div className="workspace">
    <section className="concept-list cm-scroll-region" aria-label="Suchergebnisse" tabIndex={0}>
     {results.map(c=><button type="button" key={c.id} onClick={()=>select(c)} aria-current={selected.id===c.id?'true':undefined} className={'concept-entry '+(selected.id===c.id?'selected':'')}>
      <div className="entry-top"><span className={'level level-'+c.stage}>{stages[c.stage]}</span><span className={'state-dot '+(study.progress[c.id]??'unknown')} aria-hidden="true"/><span className="sr-only">{study.progress[c.id]==='understood'?'Verstanden':study.progress[c.id]==='learning'?'In Bearbeitung':'Noch offen'}</span></div>
      <strong>{c.title}</strong><span className="entry-summary">{c.question}</span>
      <span className="entry-languages">{c.variants.map(v=>LANGUAGES[v.language]).slice(0,4).join(' · ')}{c.variants.length>4?' · +'+(c.variants.length-4):''}</span>
     </button>)}
     {results.length===0&&<div className="empty"><strong>Kein passendes Konzept</strong><p>Versuche eine andere Bezeichnung oder entferne die Filter.</p><button type="button" onClick={()=>{setQuery('');setArea('all');setStage('all');setLanguageFilter('all');}}>Filter zurücksetzen</button></div>}
    </section>
    <article className="reader cm-scroll-region" ref={readerRef} aria-labelledby="concept-title" tabIndex={0}>
     <div className="reader-header"><div className="breadcrumbs">{AREAS[selected.area]} <span>›</span> {stages[selected.stage]}</div>
      <span className={'study-pill '+status} role="status" aria-live="polite">{status==='understood'?'✓ Verstanden':status==='learning'?'◐ In Bearbeitung':'○ Noch offen'}</span>
     </div>
     <h2 id="concept-title" ref={titleRef} tabIndex={-1}>{selected.title}</h2><p className="lead">{selected.question}</p>
     <div className="reader-tabs" role="tablist" aria-label="Lernmodus">{VIEWS.map(v=><button type="button" key={v}
       id={'cm-tab-'+v} role="tab" aria-selected={view===v} aria-controls={'cm-panel-'+v}
       tabIndex={view===v?0:-1} className={view===v?'current':''}
       ref={element=>{tabRefs.current[v]=element;}}
       onClick={()=>setView(v)} onKeyDown={event=>handleTabKey(event,v)}>
       <span aria-hidden="true">{VIEW_LABELS[v].glyph}</span> {VIEW_LABELS[v].label}
      </button>)}</div>
     <div role="tabpanel" id={'cm-panel-'+view} aria-labelledby={'cm-tab-'+view} tabIndex={0}>
     {view==='textbook'?<TextbookReader key={selected.id} conceptId={selected.id} onSelect={selectById}
       onMarkUnderstood={()=>updateStatus(status==='understood'?'learning':'understood')} understood={status==='understood'}/>:view==='compare'?<>
      <div className="teaching-card"><div className="mini-label">DAS PRINZIP</div><p className="intuition">{selected.intuition}</p><p>{selected.mentalModel}</p><p>Das vollständige, ausführliche Kapitel findest du im Reiter „Lehrbuchkapitel“.</p></div>
      <section className="article-section"><h3>Schritt für Schritt</h3><ol className="steps">{selected.walkthrough.map((line,i)=><li key={i}><span>{i+1}</span><p>{line}</p></li>)}</ol></section>
      <section className="article-section"><div className="section-heading"><div><span className="mini-label">DASSELBE PROBLEM, ANDERE SPRACHE</span><h3>Syntax & Semantik vergleichen</h3></div></div>
       <p className="helper">Nicht jede ähnliche Schreibweise bedeutet dasselbe Verhalten. Die Unterschiede stehen direkt unter dem Code.</p>
       {comparison?<div className="comparison">
        <LanguageCard side="A" selected={chosenLeft} variants={supported} choose={setLeft} variant={comparison.left}/>
        <LanguageCard side="B" selected={chosenRight} variants={supported.filter(x=>x!==chosenLeft)} choose={setRight} variant={comparison.right}/>
       </div>:<p className="helper">Für dieses Konzept ist bislang nur ein Sprachbeispiel vorhanden.</p>}
       {comparison&&<p className="comparison-note"><strong>Wichtig:</strong> Diese Umsetzungen behandeln das gleiche Teilproblem, sind aber nicht automatisch austauschbar. Beachte vor allem Typprüfung, Laufzeitverhalten und Fehlerfälle.</p>}
       {languageProfile&&<div className="language-profile">
        <h4>Sprachprofil {LANGUAGES[chosenLeft]}</h4>
        <p><strong>Geprüfte Sprachlinie:</strong> {languageProfile.version} · {languageProfile.platform}</p>
        <p>{languageProfile.learningAdvice}</p>
        <h5>Bewährte Regeln aus der Dokumentation</h5>
        <ul>{languageProfile.bestPractices.map((rule,i)=><li key={i}>{rule}</li>)}</ul>
        <a href={languageProfile.officialSource} target="_blank" rel="noopener noreferrer">Offizielle Referenz<span aria-hidden="true"> ↗</span><span className="sr-only"> (öffnet in neuem Fenster)</span></a>
       </div>}
      </section>
      <section className="article-section"><h3>Warum nicht immer so?</h3><ul className="caveats">{selected.tradeoffs.map((t,i)=><li key={i}>{t}</li>)}</ul></section>
      {selected.prerequisiteIds.length>0&&<section className="article-section"><h3>Darauf baut es auf</h3><div className="prereqs">{selected.prerequisiteIds.map(id=>{const c=CONCEPTS.find(x=>x.id===id);return c?<button type="button" key={id} onClick={()=>selectById(id)}><span aria-hidden="true">{completed.has(id)?'✓':'↗'}</span><span className="sr-only">{completed.has(id)?'Verstanden: ':'Öffnen: '}</span>{c.title}</button>:null;})}</div></section>}
     </>:<>
       <div className="teaching-card exercise"><div className="mini-label">SELBST DENKEN, DANN PRÜFEN</div><h3>Deine Aufgabe</h3><p className="intuition">{selected.exercise}</p>
        <label className="answer-label" htmlFor="practice-answer">Dein Lösungsweg (nur für dich, lokal)</label>
        <textarea id="practice-answer" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Erkläre deinen Ansatz oder skizziere Code. Erst selbst überlegen …" rows={5}/>
        <div className="exercise-actions"><button type="button" className="secondary-btn" aria-expanded={showHint} aria-controls="practice-hint" onClick={()=>setShowHint(!showHint)}>{showHint?'Hinweis ausblenden':'Hinweis anzeigen'}</button><button type="button" className="primary-btn" aria-expanded={showSolution} aria-controls="practice-solution" onClick={()=>setShowSolution(!showSolution)}>{showSolution?'Musterlösung verbergen':'Lösung vergleichen'}</button></div>
        {showHint&&<div className="hint" id="practice-hint" role="status"><strong>Denkanstoß:</strong> {selected.hint}</div>}
        {showSolution&&<div className="solution" id="practice-solution" role="status"><strong>Musterlösung & Erklärung</strong><p>{selected.solution}</p><small>Vergleiche deinen Ansatz: Kannst du die Lösung selbstständig erklären und auf andere Eingaben übertragen?</small></div>}
       </div>
       <section className="article-section"><h3>Deine eigenen Notizen</h3><label htmlFor="learning-note" className="helper">Was war neu? Welche Frage möchtest du später wiederholen?</label><textarea id="learning-note" rows={4} value={study.notes[selected.id]??''} onChange={e=>updateNote(e.target.value)} placeholder="Mein Aha-Moment …"/></section>
       <section className="article-section"><h3>Lernstand festhalten</h3><div className="status-actions"><button type="button" className={status==='learning'?'secondary-btn chosen':'secondary-btn'} aria-pressed={status==='learning'} onClick={()=>updateStatus('learning')}><span aria-hidden="true">◐</span> Noch üben</button><button type="button" className={status==='understood'?'primary-btn chosen':'primary-btn'} aria-pressed={status==='understood'} onClick={()=>updateStatus('understood')}><span aria-hidden="true">✓</span> Ich kann es erklären</button></div><p className="helper">„Verstanden“ ist deine Selbsteinschätzung, keine automatische Bewertung. Geplante Tests sollen das künftig überprüfen.</p></section>
      </>}
     </div>
    </article>
   </div>
   </>:libraryMode==='books'?<PublishedTextbookLibrary/>:libraryMode==='handbooks'?<DocumentationLibrary openSetup={()=>setLibraryMode('setup')}/>:libraryMode==='setup'?<DocumentationInstaller openLibrary={()=>setLibraryMode('handbooks')}/>:<RepositoryWorkspace/>}
   <footer className="footnote"><span>CHECKMATE · Die Idee verstehen, nicht die Syntax auswendig lernen.</span><span>Wissensbasis v0.1 · {languageIds.length} Sprachen · {CONCEPTS.length} Konzepte</span></footer>
  </main>
 </div>;
}
function LanguageCard({side,selected,variants,choose,variant}:{side:string;selected:LanguageId;variants:readonly LanguageId[];choose:(language:LanguageId)=>void;variant:Concept['variants'][number]}):React.JSX.Element{
 return <div className="language-card">
  <div className="language-header"><span className="mini-label">SPRACHE {side}</span><select aria-label={'Sprache '+side} value={selected} onChange={e=>choose(e.target.value as LanguageId)}>{variants.map(id=><option value={id} key={id}>{LANGUAGES[id]}</option>)}</select></div>
  <h4>{variant.name}</h4><pre className="code"><code>{variant.code}</code></pre>
  <p className="language-explanation">{variant.explanation}</p>
  <div className="language-difference"><strong>⚠ Nicht übersehen</strong><p>{variant.differences}</p></div>
  <a className="docs-link" href={variant.docs} target="_blank" rel="noopener noreferrer">Originaldokumentation<span aria-hidden="true"> ↗</span><span className="sr-only"> (öffnet in neuem Fenster)</span></a>
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
