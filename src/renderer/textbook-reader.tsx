import React,{useState} from 'react';
import {getTextbookChapter} from '../content/textbook';
import {CONCEPTS} from '../content/concepts';
export function TextbookReader({conceptId}:{conceptId:string}):React.JSX.Element{
 const chapter=getTextbookChapter(conceptId);
 const [revealed,setRevealed]=useState<ReadonlySet<number>>(new Set());
 const [transferShown,setTransferShown]=useState(false);
 const toggle=(index:number):void=>setRevealed(current=>{
  const next=new Set(current);
  if(next.has(index))next.delete(index);else next.add(index);
  return next;
 });
 const concept=CONCEPTS.find(x=>x.id===conceptId);
 return <div className="textbook-layout" key={conceptId}>
  <div className="textbook-hero">
   <div><span className="mini-label">CHECKMATE / LEHRBUCHKAPITEL</span><h3>{concept?.title}</h3>
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
   <div className="textbook-section-heading"><span>{String(i+1).padStart(2,'0')}</span><h3>{s.title}</h3></div>
   {s.paragraphs.map((paragraph,p)=><p key={p}>{paragraph}</p>)}
   {s.code&&<figure className="textbook-figure"><figcaption>BEISPIEL · SCHRITT FÜR SCHRITT LESEN</figcaption><pre><code>{s.code}</code></pre><p>{s.annotation}</p></figure>}
  </section>)}
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
 </div>;
}
