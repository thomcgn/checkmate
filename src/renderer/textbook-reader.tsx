import React,{useState} from 'react';
import {getTextbookChapter} from '../content/textbook';
import {getConcept} from '../content/concepts';
import {relatedConcepts,dependentConcepts} from '../content/concept-library';

interface TextbookReaderProps{
 conceptId:string;
 onSelect?:(id:string)=>void;
 onMarkUnderstood?:()=>void;
 understood?:boolean;
}
export function TextbookReader({conceptId,onSelect,onMarkUnderstood,understood}:TextbookReaderProps):React.JSX.Element{
 const chapter=getTextbookChapter(conceptId);
 const concept=getConcept(conceptId);
 const [revealed,setRevealed]=useState<ReadonlySet<number>>(new Set());
 const [transferShown,setTransferShown]=useState(false);
 const toggle=(index:number):void=>setRevealed(current=>{
  const next=new Set(current);
  if(next.has(index))next.delete(index);else next.add(index);
  return next;
 });
 const related=[...relatedConcepts(concept),...dependentConcepts(conceptId)]
  .filter((item,index,all)=>all.findIndex(other=>other.id===item.id)===index).slice(0,6);
 return <div className="textbook-layout" key={conceptId}>
  <div className="textbook-hero">
   <div><span className="mini-label">CHECKMATE / LEHRBUCHKAPITEL</span><h3>{concept.title}</h3>
    <p>Dieses Kapitel erklärt das Konzept unabhängig von der Syntax einer einzelnen Sprache. Anschließend kannst du direkt zwischen Implementierungen wechseln.</p></div>
   <div className="textbook-reading-time"><strong>{chapter.readingMinutes}</strong><small>Min. Lesezeit</small></div>
  </div>
  <div className="textbook-objectives"><strong>Das kannst du nach diesem Kapitel</strong>
   <ul>{chapter.objectives.map((item,i)=><li key={i}>{item}</li>)}</ul>
  </div>
  <nav className="textbook-toc" aria-label="Inhalt dieses Kapitels"><span className="mini-label">IN DIESEM KAPITEL</span>
   <div>{chapter.sections.map((s,i)=><a href={'#textbook-'+conceptId+'-'+s.id} key={s.id}
     onClick={()=>document.getElementById('textbook-'+conceptId+'-'+s.id)?.focus()}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span> {s.title}</a>)}</div>
  </nav>
  {chapter.sections.map((s,i)=><section id={'textbook-'+conceptId+'-'+s.id} className="textbook-section" key={s.id} tabIndex={-1}>
   <div className="textbook-section-heading"><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h3>{s.title}</h3></div>
   {s.paragraphs.map((paragraph,p)=><p key={p}>{paragraph}</p>)}
   {s.code&&<figure className="textbook-figure"><figcaption>BEISPIEL · SCHRITT FÜR SCHRITT LESEN</figcaption><pre><code>{s.code}</code></pre><p>{s.annotation}</p></figure>}
  </section>)}
  {!!chapter.glossary?.length&&<section className="textbook-glossary" aria-labelledby="textbook-glossary-title">
   <h3 id="textbook-glossary-title">Begriffe auf einen Blick</h3>
   <dl>{chapter.glossary.map(entry=><React.Fragment key={entry.term}>
    <dt>{entry.term}</dt><dd>{entry.definition}</dd>
   </React.Fragment>)}</dl>
  </section>}
  <section className="textbook-review">
   <span className="mini-label">WISSEN AKTIV ABRUFEN</span><h3>Verstehst du das wirklich?</h3>
   <p>Beantworte die Fragen erst im Kopf oder auf Papier. Öffne die Erklärung erst anschließend.</p>
   {chapter.checkpoints.map((question,i)=><div className="textbook-question" key={i}>
    <strong>{String(i+1).padStart(2,'0')} · {question.question}</strong>
    <button type="button" className="secondary-btn" onClick={()=>toggle(i)} aria-expanded={revealed.has(i)} aria-controls={'textbook-answer-'+i}>{revealed.has(i)?'Antwort verbergen':'Antwort und Begründung zeigen'}</button>
    {revealed.has(i)&&<div className="textbook-answer" id={'textbook-answer-'+i} role="status"><strong>{question.answer}</strong><p>{question.reason}</p></div>}
   </div>)}
  </section>
  <section className="textbook-transfer">
   <span className="mini-label">TRANSFER / NEUE SITUATION</span><h3>Kannst du es selbst anwenden?</h3>
   <p>{chapter.transfer.prompt}</p>
   <button type="button" className="secondary-btn" aria-expanded={transferShown} aria-controls="textbook-transfer" onClick={()=>setTransferShown(v=>!v)}>{transferShown?'Lösungsweg verbergen':'Möglichen Lösungsweg erklären'}</button>
   {transferShown&&<div className="textbook-answer" id="textbook-transfer" role="status"><p>{chapter.transfer.answer}</p></div>}
  </section>
  {onMarkUnderstood&&<div className="textbook-progress">
   <button type="button" className={understood?'primary-btn chosen':'primary-btn'} aria-pressed={!!understood} onClick={onMarkUnderstood}>
    {understood?'✓ Als offen markieren':'✓ Kapitel verstanden'}</button>
   <small>Fortschritt wird nur lokal in dieser Anwendung gespeichert.</small>
  </div>}
  {!!related.length&&<section className="related-concepts" aria-label="Verwandte Konzepte">
   <h3>Verwandte Konzepte</h3>
   <div>{related.map(item=>onSelect?<button type="button" key={item.id} onClick={()=>onSelect(item.id)}>{item.title}</button>:
    <span key={item.id}>{item.title}</span>)}</div>
  </section>}
  {!!chapter.sources?.length&&<details className="textbook-sources">
   <summary>Quellen & Vertiefung in den Offline-Handbüchern</summary>
   <p>Die Lehrtexte sind eigenständig formuliert. Die verlinkten offiziellen Referenzen dienen der fachlichen Nachprüfung.</p>
   <ul>{chapter.sources.map(source=><li key={source.url}>
    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span aria-hidden="true"> ↗</span><span className="sr-only"> (öffnet in neuem Fenster)</span></a>
   </li>)}</ul>
  </details>}
 </div>;
}
