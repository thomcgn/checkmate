import React,{useState} from 'react';
import {PIZZERIA_BOOK,getBeginnerChapter} from '../content/pizzeria-book.ts';
import './academy.css';

const STORAGE_KEY='checkmate:pizzeria-book:v1';
function readCompleted():readonly string[]{
 try{
  const value:unknown=JSON.parse(localStorage.getItem(STORAGE_KEY)??'[]');
  if(!Array.isArray(value))return [];
  return value.filter((id):id is string=>typeof id==='string'&&PIZZERIA_BOOK.chapters.some(chapter=>chapter.id===id));
 }catch{return [];}
}
export function AcademyReader():React.JSX.Element{
 const [chapterId,setChapterId]=useState(PIZZERIA_BOOK.chapters[0].id);
 const [revealed,setRevealed]=useState(false);
 const [completed,setCompleted]=useState<readonly string[]>(readCompleted);
 const chapter=getBeginnerChapter(chapterId);
 const index=PIZZERIA_BOOK.chapters.indexOf(chapter);
 const stage=PIZZERIA_BOOK.stages.find(item=>item.id===chapter.stage);
 const isComplete=chapter.explain.length>0;
 const toggleComplete=():void=>{
  const next=completed.includes(chapter.id)?completed.filter(id=>id!==chapter.id):[...completed,chapter.id];
  localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
  setCompleted(next);
 };
 const select=(id:string):void=>{setChapterId(id);setRevealed(false);};
 const move=(delta:number):void=>{
  const next=PIZZERIA_BOOK.chapters[index+delta];
  if(next)select(next.id);
 };
 return <section className="academy-library" aria-label="Einsteiger-Lernbuch">
  <header className="documentation-header">
   <span className="eyebrow">CHECKMATE / EINSTEIGERBUCH · BAND 1</span>
   <h2>{PIZZERIA_BOOK.title}</h2>
   <p>{PIZZERIA_BOOK.scenario}</p>
   <small>{PIZZERIA_BOOK.audience} · {PIZZERIA_BOOK.chapters.length} Kapitel · {completed.length} als verstanden markiert</small>
  </header>
  <div className="academy-shell">
   <nav className="academy-chapters cm-scroll-region" aria-label="Kapitel des Einsteigerbuchs" tabIndex={0}>
    {PIZZERIA_BOOK.stages.map(item=>{
     const chapters=PIZZERIA_BOOK.chapters.filter(entry=>entry.stage===item.id);
     if(!chapters.length)return null;
     return <div className="academy-stage" key={item.id}>
      <strong>{item.title}</strong><small>{item.goal}</small>
      {chapters.map(entry=><button type="button" key={entry.id}
       className={entry.id===chapter.id?'selected':''} aria-current={entry.id===chapter.id?'true':undefined}
       onClick={()=>select(entry.id)}>
       <span>{PIZZERIA_BOOK.chapters.indexOf(entry)+1}. {entry.title}</span>
       <small>{entry.minutes} Min. {completed.includes(entry.id)?'· ✓':''} {entry.explain.length?'':'· geplant'}</small>
      </button>)}
     </div>;
    })}
   </nav>
   <article className="academy-article cm-scroll-region" key={chapter.id} aria-labelledby="academy-title" tabIndex={0}>
    <span className="eyebrow">{stage?.title} · KAPITEL {index+1} / {PIZZERIA_BOOK.chapters.length}</span>
    <h3 id="academy-title">{chapter.title}</h3>
    <section className="academy-scenario" aria-labelledby="academy-scenario-title">
     <h4 id="academy-scenario-title">Die Situation in deiner Pizzeria</h4>
     <p>{chapter.problem}</p>
    </section>
    <section className="academy-rule" aria-labelledby="academy-rule-title">
     <h4 id="academy-rule-title">Deine Regel – ganz in Deutsch</h4>
     <p className="academy-natural-rule">{chapter.rule.natural}</p>
     <pre className="academy-pseudo">{chapter.rule.pseudo}</pre>
     <p className="academy-hint">Erst die Regel verstehen, dann erst den Code anschauen.</p>
    </section>
    <section className="academy-objectives" aria-labelledby="academy-goals-title">
     <h4 id="academy-goals-title">Das kannst du danach</h4>
     <ul>{chapter.objectives.map((goal,i)=><li key={i}>{goal}</li>)}</ul>
    </section>
    {isComplete?<>
     <section className="academy-explain" aria-label="Erklärung">
      {chapter.explain.map((paragraph,i)=><p key={i}>{paragraph}</p>)}
     </section>
     {chapter.code&&<figure className="academy-figure">
      <figcaption>ALS CODE – LIES ZEILE FÜR ZEILE</figcaption>
      <pre><code>{chapter.code}</code></pre>
      {chapter.output&&<p><strong>Ausgabe:</strong> <code>{chapter.output}</code></p>}
     </figure>}
     <section className="academy-try" aria-labelledby="academy-try-title">
      <h4 id="academy-try-title">Probier's selbst!</h4>
      <p>{chapter.tryIt}</p>
     </section>
     <section className="academy-careful" aria-labelledby="academy-careful-title">
      <h4 id="academy-careful-title">Vorsicht – das passiert oft</h4>
      <p>{chapter.misconception}</p>
     </section>
     <section className="academy-solution" aria-labelledby="academy-solution-title">
      <h4 id="academy-solution-title">Auflösung</h4>
      <button type="button" aria-expanded={revealed} aria-controls="academy-answer"
       onClick={()=>setRevealed(value=>!value)}>{revealed?'Auflösung verbergen':'Auflösung anzeigen'}</button>
      {revealed&&<p id="academy-answer" role="status">{chapter.solution}</p>}
     </section>
     <section className="academy-words" aria-labelledby="academy-words-title">
      <h4 id="academy-words-title">Zwei neue Wörter</h4>
      <dl>{chapter.wordbank.map(word=><React.Fragment key={word.term}>
       <dt>{word.term}</dt><dd>{word.definition}</dd>
      </React.Fragment>)}</dl>
     </section>
    </>:<div className="academy-planned" role="status">
      <p>Dieses Kapitel ist schon geplant: Du siehst die Alltagsszene, die Regel und die Lernziele. Der vollständige Text wird als Nächstes geschrieben.</p>
     </div>}
    <section className="academy-sources" aria-labelledby="academy-sources-title">
     <h4 id="academy-sources-title">Zum Nachschlagen</h4>
     <a href={chapter.sourceUrl} target="_blank" rel="noopener noreferrer">Offizielle Referenz<span aria-hidden="true"> ↗</span><span className="sr-only"> (öffnet in neuem Fenster)</span></a>
    </section>
    <footer className="academy-actions">
     <button type="button" disabled={index===0} onClick={()=>move(-1)}>← Vorheriges Kapitel</button>
     <button type="button" aria-pressed={completed.includes(chapter.id)} onClick={toggleComplete}>
      {completed.includes(chapter.id)?'✓ Verstanden – zurücksetzen':'✓ Kapitel verstanden'}</button>
     <button type="button" disabled={index===PIZZERIA_BOOK.chapters.length-1} onClick={()=>move(1)}>Nächstes Kapitel →</button>
    </footer>
   </article>
  </div>
 </section>;
}
