import React,{useEffect,useMemo,useState} from 'react';
import {OFFICIAL_PACKS,type InstalledDocumentPack,type DocumentPackStatus,type DocumentView,type DocumentationBridge} from '../shared/documentation';
import {LANGUAGE_SPECS} from '../content/language-reference';
import {OfflineMarkdown} from './offline-markdown';
import type {RepoProgress,DocumentationCoursePreview} from '../shared/repository';
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
 const [generating,setGenerating]=useState(false);
 const [cancelRequested,setCancelRequested]=useState(false);
 const [created,setCreated]=useState('');
 const [coursePreview,setCoursePreview]=useState<DocumentationCoursePreview|null>(null);
 const [courseProgress,setCourseProgress]=useState<RepoProgress|null>(null);
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
  setPack(null);setPath('');setArticle(null);setQuery('');setMatches(null);setCoursePreview(null);setCourseProgress(null);
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
 useEffect(()=>{
  const teaching=window.checkmateRepos;
  return teaching?.onProgress(setCourseProgress);
 },[]);
 const prepareFullTextbook=async():Promise<void>=>{
  const teaching=window.checkmateRepos;
  if(!teaching||!pack||creating)return;
  setError('');setCreated('');
  try{
   setCreating(true);
   const summary=await teaching.previewCourse(pack.id);
   setCoursePreview(summary);
  }catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setCreating(false);}
 };
 const createFullTextbook=async():Promise<void>=>{
  const teaching=window.checkmateRepos;
  if(!teaching||!pack||!coursePreview||creating)return;
  setError('');setCreated('');
  try{
   const account=await teaching.chatgptStatus();
   if(!account.connected||!account.sharing)throw Error('Bitte zuerst im Repository Lab mit ChatGPT anmelden.');
   const models=await teaching.models();
   const model=models[0]?.slug;
   if(!model)throw Error('Für das verbundene ChatGPT-Konto ist kein Modell verfügbar.');
   const summary=coursePreview;
   if(summary.packId!==pack.id||summary.sourceCommit!==pack.sourceCommit)
    throw Error('Die Dokumentation wurde geändert. Bitte erneut prüfen.');
   if(!window.confirm('GESAMTES REFERENZWERK in didaktische Lehrbuchbände umwandeln?\\n\\n'+summary.title+
    '\\n'+summary.documents+' Originaldokumente, '+summary.units+' KI-Lerneinheiten, '+summary.characters+' Zeichen Quelltext.\\n\\nJede Einheit wird über deinen ChatGPT-Login verarbeitet. Pro neuem Kapitel sind mindestens zwei Modellanfragen vorgesehen (Erstellung plus getrenntes Fachreview). Das kann viel Kontingent und erhebliche Zeit erfordern. Bereits geprüfte Einheiten werden gespeichert und bei erneutem Start verwendet. Die Originaldokumentation bleibt unverändert.'))return;
   setCreating(true);setGenerating(true);setCancelRequested(false);
   const result=await teaching.generateCourse(pack.id,summary.sourceCommit,true,model);
   setCreated(result.volumes+' Lehrbuchbände aus '+result.documents+' Dokumenten erstellt. Du findest sie in der Lernbuchbibliothek im Repository Lab.');
   setCoursePreview(null);
  }catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setCreating(false);setGenerating(false);setCancelRequested(false);}
 };
 const cancelFullTextbook=async():Promise<void>=>{
  const teaching=window.checkmateRepos;
  if(!teaching||!generating||cancelRequested)return;
  setCancelRequested(true);
  try{await teaching.cancelCourse();}
  catch(e){setError(e instanceof Error?e.message:String(e));setCancelRequested(false);}
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
      {pack?<><div className="documentation-reader-toolbar">
       <button className="primary-btn" disabled={creating||!window.checkmateRepos} onClick={()=>void prepareFullTextbook()}>{creating?'Verarbeitung läuft …':'Gesamte Dokumentation als Lehrbücher aufbereiten'}</button>
       {generating&&<button className="secondary-btn" disabled={cancelRequested} onClick={()=>void cancelFullTextbook()}>{cancelRequested?'Abbruch angefordert …':'Lehrbuchgenerierung abbrechen'}</button>}
       {coursePreview&&<div role="status">{coursePreview.documents} Originalkapitel · {coursePreview.units} didaktische Einheiten · vollständiger Quellenbestand geprüft
        <button className="secondary-btn" disabled={creating} onClick={()=>void createFullTextbook()}>Lehrbuchreihe jetzt generieren</button>
       </div>}
       {created&&<small role="status">{created}</small>}
       {courseProgress&&<small role="status">{courseProgress.detail} · {courseProgress.done}/{courseProgress.total}</small>}
      </div><div className="documentation-reader documentation-reader-standalone">
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
         {/\.(md|mdx|html|htm)$/i.test(article.path)?
          <OfflineMarkdown source={article.text} currentPath={article.path} pack={pack} api={api!} onNavigate={setPath}/>:
          <PlainText source={article.text}/>}
        </>:<p>{documents.length===0?'Keine Treffer im Handbuch.':'Kapitel wird geöffnet …'}</p>}
       </article>
      </div></>:<div className="documentation-placeholder">Handbuch wird geladen …</div>}
     </div>
    </div>
   </>}
 </section>;
}
