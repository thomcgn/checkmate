import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AREAS,LANGUAGES,type Concept,type LanguageId,type ConceptArea} from '../content/concepts';
import {COMPLETE_CONCEPTS as CONCEPTS} from '../content/complete-concepts';
import {searchConcepts,recommendedConcepts,compareLanguages} from '../content/concept-library';
import type {Stage} from '../shared/types';
import {DocumentationLibrary} from './documentation-library';
import {PublishedTextbookLibrary} from './published-textbook-library';
import {DocumentationInstaller} from './documentation-installer';
import {RepositoryWorkspace} from './repository-workspace';
import {TextbookReader} from './textbook-reader';
import {useRef} from 'react';
import {BookOpenText,Boxes,Download,GraduationCap,Search,Command,Settings2} from 'lucide-react';
import {Button} from './ui/primitives';
import {CommandPalette} from './ui/command-palette';
import './checkmate-theme.css';
import './style.css';
import './checkmate-desktop.css';

type View='textbook'|'compare'|'practice';
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
 const [selectedId,setSelectedId]=useState(CONCEPTS[0].id);
 const [left,setLeft]=useState<LanguageId>('java');
 const [right,setRight]=useState<LanguageId>('python');
 const [view,setView]=useState<View>('textbook');
 const readerRef=useRef<HTMLElement>(null);
 const [showHint,setShowHint]=useState(false);
 const [showSolution,setShowSolution]=useState(false);
 const [answer,setAnswer]=useState('');
 const selected=CONCEPTS.find(c=>c.id===selectedId)??CONCEPTS[0];
 const results=useMemo(()=>searchConcepts({query,area,stage}),[query,area,stage]);
 const completed=useMemo(()=>new Set(Object.entries(study.progress).filter(([,v])=>v==='understood').map(([id])=>id)),[study]);
 const recommended=useMemo(()=>recommendedConcepts(completed),[completed]);
 const status=study.progress[selected.id]??'unknown';
 const supported=selected.variants.map(v=>v.language);
 const chosenLeft=supported.includes(left)?left:supported[0];
 const chosenRight=supported.includes(right)&&right!==chosenLeft?right:
  supported.find(x=>x!==chosenLeft)??chosenLeft;
 const comparison=chosenLeft!==chosenRight?compareLanguages(selected,chosenLeft,chosenRight):null;
 useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(study));},[study]);
 const updateStatus=(next:Knowledge):void=>setStudy(current=>({...current,progress:{...current.progress,[selected.id]:next}}));
 const updateNote=(next:string):void=>{
  setStudy(current=>({...current,notes:{...current.notes,[selected.id]:next.slice(0,6000)}}));
 };
 const select=(concept:Concept):void=>{
  setSelectedId(concept.id);setView('textbook');setShowHint(false);setShowSolution(false);setAnswer('');
 };
 const selectById=(id:string):void=>{const match=CONCEPTS.find(c=>c.id===id);if(match)select(match);};
 const progress=Math.round(completed.size/CONCEPTS.length*100);
 useEffect(()=>{if(readerRef.current)readerRef.current.scrollTop=0;},[selectedId,view,libraryMode]);
 return <div className="shell">
  <aside className="sidebar" aria-label="Hauptnavigation">
   <div className="brand"><span className="brand-crown" aria-hidden="true">♚</span><div><strong>CHECKMATE</strong><small>learn the logic</small></div></div>
   <div className="sidebar-section"><span className="eyebrow">LEARNING OS</span>
    <Button variant="ghost" className={libraryMode==='concepts'?'active-nav':'nav-secondary'} onClick={()=>setLibraryMode('concepts')}><Boxes size={16} aria-hidden="true"/><span>Konzeptbibliothek</span><small>{CONCEPTS.length}</small></Button>
    <Button variant="ghost" className={libraryMode==='books'?'active-nav':'nav-secondary'} onClick={()=>setLibraryMode('books')}><BookOpenText size={16} aria-hidden="true"/><span>Lehrbücher</span><small>Offline</small></Button>
    <Button variant="ghost" className={libraryMode==='handbooks'?'active-nav':'nav-secondary'} onClick={()=>setLibraryMode('handbooks')}><BookOpenText size={16} aria-hidden="true"/><span>Originaldokumentationen</span></Button>
    <Button variant="ghost" className={libraryMode==='setup'?'active-nav':'nav-secondary'} onClick={()=>setLibraryMode('setup')}><Download size={16} aria-hidden="true"/><span>Dokumentationen einrichten</span></Button>
    <Button variant="ghost" className={libraryMode==='repositories'?'active-nav':'nav-secondary'} onClick={()=>setLibraryMode('repositories')}><Command size={16} aria-hidden="true"/><span>Repository Lab</span><small>AI</small></Button>
    <div className="nav-secondary"><GraduationCap size={16} aria-hidden="true"/><span>Lernpfad</span><small>{recommended.length} offen</small></div>
   </div>
   {libraryMode==='concepts'&&<div className="sidebar-section"><span className="eyebrow">THEMEN</span>
    <button className={area==='all'?'filter active':'filter'} onClick={()=>setArea('all')}>Alle Konzepte <span>{CONCEPTS.length}</span></button>
    {Object.entries(AREAS).map(([id,name])=><button key={id} className={area===id?'filter active':'filter'} onClick={()=>setArea(id as ConceptArea)}>{name}<span>{CONCEPTS.filter(c=>c.area===id).length}</span></button>)}
   </div>}
   <div className="side-bottom"><div className="side-bottom-top"><span>Dein Fortschritt</span><strong>{progress}%</strong></div><div className="progress-track"><div style={{width:progress+'%'}}/></div><small>{completed.size} von {CONCEPTS.length} Konzepten verstanden · lokal gespeichert</small></div>
  </aside>
  <main className={"main mode-"+libraryMode}>
   <header className="topbar">
    <div><span className="eyebrow">DEINE WISSENSZENTRALE</span><h1>Code verstehen. <em>Konzepte meistern.</em></h1>
     <p>Die Idee hinter dem Code lernen – und dieselbe Lösung in unterschiedlichen Sprachen erkennen.</p></div>
    <div className="cm-topbar-actions"><CommandPalette onNavigate={setLibraryMode}/><div className="top-chip"><span className="chip-dot"/> Offline-Wissensbasis <small>Kein KI-Zugang erforderlich</small></div><Button variant="ghost" size="icon" title="Dokumentationspakete verwalten" aria-label="Dokumentationspakete verwalten" onClick={()=>setLibraryMode('setup')}><Settings2 size={18}/></Button></div>
   </header>
   {libraryMode==='concepts'?<>
   <section className="toolbar" aria-label="Konzeptbibliothek durchsuchen">
    <label className="search-wrap"><Search size={17} aria-hidden="true"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Suche: HashMap, dict, record, Streams …" aria-label="Konzept suchen"/></label>
    <select value={stage} onChange={e=>setStage(e.target.value as Stage|'all')} aria-label="Schwierigkeitsgrad"><option value="all">Alle Level</option><option value="basics">Basics</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
    <span className="result-count">{results.length} Konzepte</span>
   </section>
   <div className="workspace">
    <section className="concept-list" aria-label="Suchergebnisse">
     {results.map(c=><button key={c.id} onClick={()=>select(c)} className={'concept-entry '+(selected.id===c.id?'selected':'')}>
      <div className="entry-top"><span className={'level level-'+c.stage}>{stages[c.stage]}</span><span className={'state-dot '+(study.progress[c.id]??'unknown')}/></div>
      <strong>{c.title}</strong><span className="entry-summary">{c.question}</span>
      <span className="entry-languages">{c.variants.map(v=>LANGUAGES[v.language]).slice(0,4).join(' · ')}{c.variants.length>4?' · +'+(c.variants.length-4):''}</span>
     </button>)}
     {results.length===0&&<div className="empty"><strong>Kein passendes Konzept</strong><p>Versuche eine andere Bezeichnung oder entferne die Filter.</p><button onClick={()=>{setQuery('');setArea('all');setStage('all');}}>Filter zurücksetzen</button></div>}
    </section>
    <article className="reader" ref={readerRef} aria-labelledby="concept-title">
     <div className="reader-header"><div className="breadcrumbs">{AREAS[selected.area]} <span>›</span> {stages[selected.stage]}</div>
      <span className={'study-pill '+status}>{status==='understood'?'✓ Verstanden':status==='learning'?'◐ In Bearbeitung':'○ Noch offen'}</span>
     </div>
     <h2 id="concept-title">{selected.title}</h2><p className="lead">{selected.question}</p>
     <nav className="reader-tabs" aria-label="Lernmodus"><button className={view==='textbook'?'current':''} onClick={()=>setView('textbook')}>▤ Lehrbuchkapitel</button><button className={view==='compare'?'current':''} onClick={()=>setView('compare')}>◇ Sprachvergleich</button><button className={view==='practice'?'current':''} onClick={()=>setView('practice')}>⌘ Üben & Verinnerlichen</button></nav>
     {view==='textbook'?<TextbookReader key={selected.id} conceptId={selected.id}/>:view==='compare'?<>
      <div className="teaching-card"><div className="mini-label">DAS PRINZIP</div><p className="intuition">{selected.intuition}</p><p>{selected.mentalModel}</p><p>Das vollständige, ausführliche Kapitel findest du im Reiter „Lehrbuchkapitel“.</p></div>
      <section className="article-section"><h3>Schritt für Schritt</h3><ol className="steps">{selected.walkthrough.map((line,i)=><li key={i}><span>{i+1}</span><p>{line}</p></li>)}</ol></section>
      <section className="article-section"><div className="section-heading"><div><span className="mini-label">DASSELBE PROBLEM, ANDERE SPRACHE</span><h3>Syntax & Semantik vergleichen</h3></div></div>
       <p className="helper">Nicht jede ähnliche Schreibweise bedeutet dasselbe Verhalten. Die Unterschiede stehen direkt unter dem Code.</p>
       {comparison?<div className="comparison">
        <LanguageCard side="A" selected={chosenLeft} variants={supported} choose={setLeft} variant={comparison.left}/>
        <LanguageCard side="B" selected={chosenRight} variants={supported.filter(x=>x!==chosenLeft)} choose={setRight} variant={comparison.right}/>
       </div>:<p className="helper">Für dieses Konzept ist bislang nur ein Sprachbeispiel vorhanden.</p>}
       {comparison&&<p className="comparison-note"><strong>Wichtig:</strong> Diese Umsetzungen behandeln das gleiche Teilproblem, sind aber nicht automatisch austauschbar. Beachte vor allem Typprüfung, Laufzeitverhalten und Fehlerfälle.</p>}
      </section>
      <section className="article-section"><h3>Warum nicht immer so?</h3><ul className="caveats">{selected.tradeoffs.map((t,i)=><li key={i}>{t}</li>)}</ul></section>
      {selected.prerequisiteIds.length>0&&<section className="article-section"><h3>Darauf baut es auf</h3><div className="prereqs">{selected.prerequisiteIds.map(id=>{const c=CONCEPTS.find(x=>x.id===id);return c?<button key={id} onClick={()=>selectById(id)}>{completed.has(id)?'✓':'↗'} {c.title}</button>:null;})}</div></section>}
     </>:<>
       <div className="teaching-card exercise"><div className="mini-label">SELBST DENKEN, DANN PRÜFEN</div><h3>Deine Aufgabe</h3><p className="intuition">{selected.exercise}</p>
        <label className="answer-label" htmlFor="practice-answer">Dein Lösungsweg (nur für dich, lokal)</label>
        <textarea id="practice-answer" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Erkläre deinen Ansatz oder skizziere Code. Erst selbst überlegen …" rows={5}/>
        <div className="exercise-actions"><button className="secondary-btn" onClick={()=>setShowHint(!showHint)}>{showHint?'Hinweis ausblenden':'Hinweis anzeigen'}</button><button className="primary-btn" onClick={()=>setShowSolution(!showSolution)}>{showSolution?'Musterlösung verbergen':'Lösung vergleichen'}</button></div>
        {showHint&&<div className="hint"><strong>Denkanstoß:</strong> {selected.hint}</div>}
        {showSolution&&<div className="solution"><strong>Musterlösung & Erklärung</strong><p>{selected.solution}</p><small>Vergleiche deinen Ansatz: Kannst du die Lösung selbstständig erklären und auf andere Eingaben übertragen?</small></div>}
       </div>
       <section className="article-section"><h3>Deine eigenen Notizen</h3><label htmlFor="learning-note" className="helper">Was war neu? Welche Frage möchtest du später wiederholen?</label><textarea id="learning-note" rows={4} value={study.notes[selected.id]??''} onChange={e=>updateNote(e.target.value)} placeholder="Mein Aha-Moment …"/></section>
       <section className="article-section"><h3>Lernstand festhalten</h3><div className="status-actions"><button className={status==='learning'?'secondary-btn chosen':'secondary-btn'} onClick={()=>updateStatus('learning')}>◐ Noch üben</button><button className={status==='understood'?'primary-btn chosen':'primary-btn'} onClick={()=>updateStatus('understood')}>✓ Ich kann es erklären</button></div><p className="helper">„Verstanden“ ist deine Selbsteinschätzung, keine automatische Bewertung. Geplante Tests sollen das künftig überprüfen.</p></section>
      </>}
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
  <a className="docs-link" href={variant.docs} target="_blank" rel="noopener noreferrer">Originaldokumentation ↗</a>
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
