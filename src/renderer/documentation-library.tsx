import React,{useEffect,useMemo,useState} from 'react';
import {OFFICIAL_PACKS,type InstalledDocumentPack,type DocumentPackStatus,type DocumentView,type DocumentationBridge} from '../shared/documentation';
import {LANGUAGE_SPECS} from '../content/language-reference';
import {OfflineMarkdown} from './offline-markdown';
import './documentation-library.css';
declare global{interface Window{checkmateDocs?:DocumentationBridge}}
function PlainText({source}:{source:string}):React.JSX.Element{
 return <div className="documentation-content"><pre className="documentation-plain">{source}</pre></div>;
}
export function DocumentationLibrary({openSetup}:{openSetup:()=>void}):React.JSX.Element{
 const api=window.checkmateDocs;
 const [statuses,setStatuses]=useState<DocumentPackStatus[]>([]);
 const [language,setLanguage]=useState<string|null>(null);
 const [selected,setSelected]=useState<string|null>(null);
 const [pack,setPack]=useState<InstalledDocumentPack|null>(null);
 const [path,setPath]=useState('');
 const [article,setArticle]=useState<DocumentView|null>(null);
 const [query,setQuery]=useState('');
 const [matches,setMatches]=useState<readonly string[]|null>(null);
 const [error,setError]=useState('');
 const [creating,setCreating]=useState(false);
 const [created,setCreated]=useState('');
 useEffect(()=>{
  if(!api)return;
  void api.packs().then(setStatuses).catch(e=>setError(String(e)));
 },[api]);
 const available=useMemo(()=>OFFICIAL_PACKS.filter(p=>statuses.some(s=>s.id===p.id&&s.installed)),[statuses]);
 const availableLanguages=useMemo(()=>LANGUAGE_SPECS.filter(l=>available.some(p=>p.language===l.id)),[available]);
 const currentLanguage=language&&availableLanguages.some(l=>l.id===language)?language:availableLanguages[0]?.id??null;
 const packs=available.filter(p=>p.language===currentLanguage);
 const current=selected&&packs.some(p=>p.id===selected)?selected:packs[0]?.id??null;
 useEffect(()=>{
  setPack(null);setPath('');setArticle(null);setQuery('');setMatches(null);
  if(!api||!current)return;
  let alive=true;
  void api.loadPack(current).then(data=>{
   if(!alive)return;
   setPack(data);setPath(data?.documents[0]?.path??'');
  }).catch(e=>{if(alive)setError(String(e));});
  return()=>{alive=false;};
 },[api,current]);
 useEffect(()=>{
  if(!api||!pack)return;
  let alive=true;
  const timer=setTimeout(()=>{
   void api.searchPack(pack.id,query).then(result=>{if(alive)setMatches(result);})
    .catch(e=>{if(alive)setError(String(e));});
  },query?250:0);
  return()=>{alive=false;clearTimeout(timer);};
 },[api,pack,query]);
 const documents=useMemo(()=>pack?.documents.filter(d=>matches===null||matches.includes(d.path))??[],[pack,matches]);
 const currentPath=documents.some(d=>d.path===path)?path:documents[0]?.path??'';
 useEffect(()=>{
  setArticle(null);
  if(!api||!pack||!currentPath)return;
  let alive=true;
  void api.readDocument(pack.id,currentPath).then(value=>{if(alive)setArticle(value);})
   .catch(e=>{if(alive)setError(String(e));});
  return()=>{alive=false;};
 },[api,pack,currentPath]);
 const createLesson=async():Promise<void>=>{
  const teaching=window.checkmateRepos;
  if(!teaching||!pack||!article||creating)return;
  setError('');setCreated('');
  try{
   const account=await teaching.chatgptStatus();
   if(!account.connected||!account.sharing)throw Error('Bitte zuerst im Repository Lab mit ChatGPT anmelden.');
   const models=await teaching.models();
   const model=models[0]?.slug;
   if(!model)throw Error('Für das verbundene ChatGPT-Konto ist kein Modell verfügbar.');
   if(!window.confirm('Aus dem angezeigten Dokumentationskapitel ein deutsches Lehrbuch erstellen? Dazu wird der Kapiteltext (maximal 12.000 Zeichen) nach deiner Zustimmung an ChatGPT übermittelt.'))return;
   setCreating(true);
   const book=await teaching.analyzeDocument(pack.id,article.path,true,model);
   setCreated('Lehrbuch „'+book.title+'“ gespeichert. Du findest es im Repository Lab.');
  }catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setCreating(false);}
 };
 const installed=statuses.filter(s=>s.installed).length;
 return <section className="documentation-library documentation-handbooks" aria-label="Installierte Sprachenhandbücher">
  <header className="documentation-header">
   <span className="eyebrow">CHECKMATE / BIBLIOTHEK</span>
   <h2>Sprachenhandbücher</h2>
   <p>Deine installierten Referenzwerke: Kapitel und Volltextsuche sind lokal verfügbar, ohne Browserwechsel. Weitere Sprachreferenzen fügst du über die Einrichtung hinzu.</p>
   <div className="documentation-reader-toolbar"><span>{availableLanguages.length} Sprachen · {installed} Referenzpakete installiert</span><button className="secondary-btn" onClick={openSetup}>Dokumentationen verwalten</button></div>
  </header>
  {error&&<div className="documentation-error" role="alert">{error}</div>}
  {availableLanguages.length===0?<div className="documentation-placeholder">
    <h3>Deine Handbuchbibliothek ist noch leer</h3>
    <p>Installiere zuerst die offiziellen Dokumentationspakete. Danach findest du sie automatisch hier als Handbücher.</p>
    <button className="primary-btn" onClick={openSetup}>Zur Einrichtung</button>
   </div>:
   <>
    <nav className="documentation-language-tabs" aria-label="Installierte Programmiersprachen">
     {availableLanguages.map(l=><button key={l.id} className={l.id===currentLanguage?'active':''} onClick={()=>{setLanguage(l.id);setSelected(null);}}>{l.name}</button>)}
    </nav>
    <div className="documentation-shell">
     <aside className="documentation-pack-list" aria-label="Handbücher der gewählten Sprache">
      <strong>HANDBÜCHER · {LANGUAGE_SPECS.find(l=>l.id===currentLanguage)?.name}</strong>
      {packs.map(p=>{
       const state=statuses.find(x=>x.id===p.id);
       return <button className={current===p.id?'documentation-pack active':'documentation-pack'} key={p.id} onClick={()=>setSelected(p.id)}>
        <b>{p.title}</b><span>{state?.count??0} Kapitel · lokal gespeichert</span>
       </button>;
      })}
     </aside>
     <div className="documentation-main">
      {pack?<div className="documentation-reader documentation-reader-standalone">
       <aside className="documentation-toc">
        <label className="documentation-toc-label" htmlFor="offline-search">IN DIESEM HANDBUCH SUCHEN</label>
        <input id="offline-search" aria-label="Offline-Dokumentation durchsuchen" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Begriff, API, Klasse, Funktion …"/>
        <small>{documents.length} / {pack.documents.length} Kapitel</small>
        <div className="documentation-toc-list">{documents.map(doc=><button className={doc.path===currentPath?'selected':''} key={doc.path} onClick={()=>setPath(doc.path)}>
         {doc.title}<small>{doc.path}</small>
        </button>)}</div>
       </aside>
       <article className="documentation-article">
        {article?<><h2>{article.title}</h2><small>{article.path} · Version {pack.sourceCommit.slice(0,12)}</small>
         <div className="documentation-reader-toolbar"><button className="secondary-btn" disabled={creating||!window.checkmateRepos} onClick={()=>void createLesson()}>{creating?'Lehrbuch wird erstellt …':'Aus Kapitel ein Lehrbuch erstellen'}</button>{created&&<small role="status">{created}</small>}</div>
         {/\.(md|mdx|html|htm)$/i.test(article.path)?
          <OfflineMarkdown source={article.text} currentPath={article.path} pack={pack} api={api!} onNavigate={setPath}/>:
          <PlainText source={article.text}/>}
        </>:<p>{documents.length===0?'Keine Treffer im Handbuch.':'Kapitel wird geöffnet …'}</p>}
       </article>
      </div>:<div className="documentation-placeholder">Handbuch wird geladen …</div>}
     </div>
    </div>
   </>}
 </section>;
}
