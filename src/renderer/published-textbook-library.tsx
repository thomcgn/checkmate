import React,{useMemo,useState} from 'react';
import {PUBLISHED_TEXTBOOKS} from '../content/published-books.ts';
import './published-library.css';

type ReadState=Record<string,readonly string[]>;
const KEY='checkmate:published-textbooks:study:v1';
function readState():ReadState{
 try{
  const value:unknown=JSON.parse(localStorage.getItem(KEY)??'{}');
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  return Object.fromEntries(Object.entries(value).filter(([key,chapters])=>
   key.startsWith('checkmate-')&&Array.isArray(chapters)&&chapters.every(x=>typeof x==='string')));
 }catch{return {};}
}
/** Editorially bundled books. Reading them never requires network, OAuth or AI. */
export function PublishedTextbookLibrary():React.JSX.Element{
 const books=useMemo(()=>[...PUBLISHED_TEXTBOOKS].sort((a,b)=>{
  const rank=(id:string):number=>['java','typescript','rust','python'].indexOf(id);
  const aRank=rank(a.language.id),bRank=rank(b.language.id);
  return (aRank<0?100:aRank)-(bRank<0?100:bRank)||a.title.localeCompare(b.title,'de');
 }),[]);
 const [bookId,setBookId]=useState(books[0]?.id??'');
 const [chapterId,setChapterId]=useState('');
 const [query,setQuery]=useState('');
 const [revealed,setRevealed]=useState<ReadonlySet<number>>(new Set());
 const [transfer,setTransfer]=useState(false);
 const [study,setStudy]=useState<ReadState>(readState);
 const book=books.find(b=>b.id===bookId)??books[0];
 const visible=book?.lessons.filter(c=>c.title.toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de')))||[];
 const lesson=book?.lessons.find(c=>c.id===chapterId)??book?.lessons[0];
 const learned=new Set(study[book?.id??'']??[]);
 const selectBook=(id:string):void=>{setBookId(id);setChapterId('');setQuery('');setRevealed(new Set());setTransfer(false);};
 const selectLesson=(id:string):void=>{setChapterId(id);setRevealed(new Set());setTransfer(false);};
 const markRead=():void=>{
  if(!book||!lesson)return;
  const current=new Set(study[book.id]??[]);
  if(current.has(lesson.id))current.delete(lesson.id);else current.add(lesson.id);
  const updated={...study,[book.id]:[...current]};
  localStorage.setItem(KEY,JSON.stringify(updated));setStudy(updated);
 };
 return <section className="published-library" aria-label="Fertige Checkmate-Lehrbücher">
  <header className="documentation-header">
   <span className="eyebrow">CHECKMATE / LEHRBUCHBIBLIOTHEK</span>
   <h2>Fertige Lehrbücher</h2>
   <p>Diese Bücher sind bereits in Checkmate enthalten. Sie lassen sich vollständig offline lesen – ohne ChatGPT-Anmeldung, API-Key, Download oder Generierung.</p>
   <small>Checkmate Originalausgaben · eigenständig verfasste Lehrtexte · keine fremden Buchinhalte</small>
  </header>
  <div className="published-shell">
   <nav className="published-books" aria-label="Lehrbuch auswählen">
    <strong>BUCHREIHE</strong>
    {books.map(item=><button type="button" className={item.id===book.id?'selected':''} key={item.id} onClick={()=>selectBook(item.id)} aria-current={item.id===book.id?'page':undefined}>
     <span>{item.language.name}</span><small>{item.lessons.length} Kapitel · {item.edition}</small>
    </button>)}
   </nav>
   {book&&lesson?<div className="published-workspace">
    <header className="published-book-header">
     <span className="eyebrow">{book.edition}</span>
     <h3>{book.title}</h3><p>{book.description}</p>
     <span>{learned.size} / {book.lessons.length} Kapitel als verstanden markiert · nur lokal gespeichert</span>
    </header>
    <div className="published-reader-grid">
     <aside className="published-toc" aria-label="Inhaltsverzeichnis">
      <label htmlFor="published-search">INHALTSVERZEICHNIS</label>
      <input id="published-search" aria-label="Buchkapitel suchen" placeholder="Kapitel suchen …" value={query} onChange={e=>setQuery(e.target.value)}/>
      <div className="published-toc-items">
       {visible.map((item,i)=><button type="button" key={item.id} className={lesson.id===item.id?'selected':''} onClick={()=>selectLesson(item.id)}>
        <span>{learned.has(item.id)?'✓':String(book.lessons.indexOf(item)+1).padStart(2,'0')} · {item.title}</span><small>{item.chapter.readingMinutes} Min. Lesezeit</small>
       </button>)}
       {visible.length===0&&<p>Keine passenden Kapitel gefunden.</p>}
      </div>
     </aside>
     <article className="published-article" key={lesson.id}>
      <span className="eyebrow">KAPITEL {book.lessons.indexOf(lesson)+1} / {book.lessons.length}</span>
      <h2>{lesson.title}</h2>
      <section className="published-objectives"><h3>Das lernst du</h3><ul>{lesson.chapter.objectives.map((objective,i)=><li key={i}>{objective}</li>)}</ul></section>
      {lesson.chapter.sections.map((section,i)=><section className="published-section" key={section.id}>
       <h3>{i+1}. {section.title}</h3>
       {section.paragraphs.map((paragraph,j)=><p key={j}>{paragraph}</p>)}
       {section.code&&<figure><figcaption>BEISPIEL · CODE VERSTEHEN</figcaption><pre><code>{section.code}</code></pre><p>{section.annotation}</p></figure>}
      </section>)}
      <section className="published-section published-language-example">
       <h3>{book.language.name}: so sieht es in der Praxis aus</h3>
       <p>{lesson.implementation.explanation}</p>
       <figure><figcaption>{lesson.implementation.name}</figcaption><pre><code>{lesson.implementation.code}</code></pre></figure>
       <p><strong>Unterschiede und Grenzen:</strong> {lesson.implementation.differences}</p>
      </section>
      <section className="published-section">
       <h3>Verständnisfragen</h3><p>Versuche die Antwort erst selbst zu formulieren.</p>
       {lesson.chapter.checkpoints.map((question,i)=><div className="published-question" key={i}>
        <strong>{i+1}. {question.question}</strong>
        <button type="button" onClick={()=>setRevealed(current=>{
         const next=new Set(current);if(next.has(i))next.delete(i);else next.add(i);return next;
        })}>{revealed.has(i)?'Antwort verbergen':'Antwort mit Begründung zeigen'}</button>
        {revealed.has(i)&&<p><strong>{question.answer}</strong> {question.reason}</p>}
       </div>)}
      </section>
      <section className="published-section published-transfer">
       <h3>Praxisaufgabe und Transfer</h3><p>{lesson.chapter.transfer.prompt}</p>
       <button type="button" onClick={()=>setTransfer(v=>!v)}>{transfer?'Lösungsweg verbergen':'Lösungsweg ansehen'}</button>
       {transfer&&<p>{lesson.chapter.transfer.answer}</p>}
      </section>
      <footer className="published-reader-actions">
       <button type="button" onClick={markRead}>{learned.has(lesson.id)?'Als noch offen markieren':'✓ Kapitel verstanden'}</button>
       <button type="button" disabled={book.lessons.indexOf(lesson)===book.lessons.length-1} onClick={()=>{
        const next=book.lessons[book.lessons.indexOf(lesson)+1];if(next)selectLesson(next.id);
       }}>Nächstes Kapitel</button>
      </footer>
     </article>
    </div>
    <small className="published-attribution">{book.copyrightNotice} · <a href={book.language.officialSource} target="_blank" rel="noopener noreferrer">Offizielle Sprachreferenz</a></small>
   </div>:<div className="documentation-placeholder">Noch keine redaktionell veröffentlichten Lehrbücher vorhanden.</div>}
  </div>
 </section>;
}
