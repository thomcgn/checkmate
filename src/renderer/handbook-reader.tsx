import React,{useMemo,useState} from 'react';
import {LANGUAGE_SPECS,languagePages,searchLanguagePages,type LanguageStudyPage} from '../content/language-reference';
import type {LanguageId} from '../content/concepts';
import type {Stage} from '../shared/types';

const stages:Readonly<Record<Stage,string>>={basics:'Basics',intermediate:'Intermediate',advanced:'Advanced'};
export function HandbookReader({openConcept}:{openConcept:(id:string)=>void}):React.JSX.Element{
 const [languageId,setLanguageId]=useState<LanguageId>('java');
 const [search,setSearch]=useState('');
 const [chosenId,setChosenId]=useState('variables');
 const [showHint,setShowHint]=useState(false);
 const [showSolution,setShowSolution]=useState(false);
 const [answer,setAnswer]=useState('');
 const [onlyStage,setOnlyStage]=useState<Stage|'all'>('all');
 const handbook=LANGUAGE_SPECS.find(spec=>spec.id===languageId)!;
 const pages=useMemo(()=>searchLanguagePages(search,languageId).filter(x=>onlyStage==='all'||x.concept.stage===onlyStage),[search,languageId,onlyStage]);
 const selected=pages.find(p=>p.concept.id===chosenId)??pages[0]??null;
 const total=languagePages(languageId).length;
 const chooseLanguage=(id:LanguageId):void=>{
  setLanguageId(id);
  setChosenId(languagePages(id)[0]?.concept.id??'variables');
  setShowHint(false);setShowSolution(false);setAnswer('');
 };
 const choosePage=(page:LanguageStudyPage):void=>{
  setChosenId(page.concept.id);setShowHint(false);setShowSolution(false);setAnswer('');
 };
 return <section aria-label="Sprachenhandbücher" className="handbook-view">
   <header className="handbook-top">
    <div><span className="eyebrow">OFFLINE-HANDBÜCHER · VERSIONIERT</span>
     <h2>Wissen, das du <em>direkt nachschlagen</em> kannst.</h2>
     <p>Eigene deutsche Erklärungen, konkrete Beispiele und Übungen. Keine externe Dokumentation zum Lernen erforderlich.</p>
    </div>
   </header>
   <nav className="language-tiles" aria-label="Programmiersprache auswählen">
    {LANGUAGE_SPECS.map(spec=><button key={spec.id} onClick={()=>chooseLanguage(spec.id)}
      className={'language-tile '+(languageId===spec.id?'selected':'')}
      aria-pressed={languageId===spec.id}>
      <strong>{spec.name}</strong><small>{spec.version}</small>
    </button>)}
   </nav>
   <div className="handbook-overview">
    <div><span className="mini-label">SPRACHE & VERWENDETE VERSION</span><h3>{handbook.name} <span>{handbook.version}</span></h3>
     <p>{handbook.learningAdvice}</p><p className="helper">{handbook.versionNote||handbook.platform}</p>
    </div>
    <div className="handbook-stat"><strong>{total}</strong><small>direkt lesbare Konzeptseiten</small><small>Quellenstand: {handbook.updatedAt}</small></div>
   </div>
   <div className="handbook-columns">
    <aside className="handbook-index" aria-label="Handbuch-Inhaltsverzeichnis">
     <label className="search-wrap"><span aria-hidden="true">⌕</span>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Begriff oder Syntax suchen" aria-label="Im Handbuch suchen"/></label>
     <select aria-label="Handbuch-Kapitel nach Niveau" value={onlyStage} onChange={e=>setOnlyStage(e.target.value as Stage|'all')}>
      <option value="all">Alle Lernstufen</option><option value="basics">Basics</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
     </select>
     <div className="handbook-chapters">
      {pages.map((page,i)=><button key={page.concept.id} className={'chapter-link '+(page===selected?'current':'')} onClick={()=>choosePage(page)}>
       <span className="chapter-ordinal">{String(i+1).padStart(2,'0')}</span><span><strong>{page.concept.title}</strong><small>{stages[page.concept.stage]} · {page.variant.name}</small></span>
      </button>)}
      {pages.length===0&&<p className="helper">Keine Treffer. Suchbegriff oder Niveau ändern.</p>}
     </div>
    </aside>
    <article className="handbook-page" aria-live="polite">
     {selected?<React.Fragment key={selected.concept.id}>
      <div className="reader-header"><span className="breadcrumbs">{handbook.name} {handbook.version} <span>›</span> {stages[selected.concept.stage]}</span>
       <span className="study-pill">{selected.variant.name}</span></div>
      <h2>{selected.concept.title}</h2>
      <p className="lead">{selected.concept.question}</p>
      <section className="teaching-card"><div className="mini-label">WARUM BRAUCHEN WIR DAS?</div>
       <p className="intuition">{selected.concept.intuition}</p>
       <p>{selected.concept.mentalModel}</p>
      </section>
      <section className="article-section">
       <h3>So funktioniert das Konzept</h3>
       <ol className="steps">{selected.concept.walkthrough.map((step,i)=><li key={i}><span>{i+1}</span><p>{step}</p></li>)}</ol>
       <p className="handbook-explanation">{selected.variant.explanation}</p>
      </section>
      <section className="article-section">
       <h3>{handbook.name}-Beispiel · {handbook.version}</h3>
       <pre className="code handbook-code"><code>{selected.variant.code}</code></pre>
       <p className="helper">Dieses Beispiel ist auf die oben angegebene Sprachlinie ausgerichtet. Ein Code-Snippet ist keine komplette Anwendung, sofern keine Imports oder Einstiegspunkte angegeben sind.</p>
      </section>
      <section className="article-section semantic-warning">
       <h3>Nicht verwechseln</h3><p>{selected.variant.differences}</p>
       {selected.concept.tradeoffs.map((text,i)=><p key={i}>• {text}</p>)}
      </section>
      <section className="article-section">
       <h3>Selbst ausprobieren</h3><p>{selected.concept.exercise}</p>
       <label htmlFor="handbook-answer" className="answer-label">Dein eigener Lösungsansatz</label>
       <textarea id="handbook-answer" value={answer} onChange={e=>setAnswer(e.target.value)} rows={4} placeholder="Erst selbst nachdenken und Code schreiben …"/>
       <div className="exercise-actions">
        <button className="secondary-btn" onClick={()=>setShowHint(x=>!x)}>{showHint?'Hinweis ausblenden':'Hinweis anzeigen'}</button>
        <button className="primary-btn" onClick={()=>setShowSolution(x=>!x)}>{showSolution?'Lösung ausblenden':'Musterlösung ansehen'}</button>
       </div>
       {showHint&&<div className="hint">{selected.concept.hint}</div>}
       {showSolution&&<div className="solution">{selected.concept.solution}</div>}
       <p className="helper">Die Musterlösung beschreibt das Konzept. Die konkrete Syntax kannst du aus dem obigen Sprachbeispiel ableiten.</p>
      </section>
      <section className="article-section">
       <h3>Best Practices für {handbook.name}</h3>
       <ul className="caveats">{handbook.bestPractices.map((rule,i)=><li key={i}>{rule}</li>)}</ul>
      </section>
      <footer className="handbook-page-footer">
       <button className="secondary-btn" onClick={()=>openConcept(selected.concept.id)}>↗ Sprachübergreifend vergleichen</button>
       <small>Quellenbezug: {handbook.name} {handbook.version}. Offizielle Referenzen werden zur fachlichen Pflege verwendet; du brauchst sie nicht zum Nachschlagen.</small>
      </footer>
     </React.Fragment>:<div className="empty"><h3>Keine Kapitel gefunden</h3><p>Bitte ändere die Suche oder den Filter.</p></div>}
    </article>
   </div>
   <p className="handbook-legal">Handbuchstand 23.11.2026 · Die Texte sind eigenständig erstellte Lernmaterialien, keine vollständige Kopie der offiziellen Sprachhandbücher. Neue Kapitel werden nach fachlicher Prüfung ergänzt.</p>
 </section>;
}
