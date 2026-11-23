import React,{useEffect,useMemo,useState,useRef} from 'react';
import {OFFICIAL_PACKS,type InstalledDocumentPack,type DocumentView,type DocumentPackStatus,type DocumentationBridge,type PackProgress} from '../shared/documentation';
import {LANGUAGE_SPECS} from '../content/language-reference';
import {OfflineMarkdown} from './offline-markdown';
import './documentation-library.css';
declare global{interface Window{checkmateDocs?:DocumentationBridge}}
function RenderText({source}:{source:string}):React.JSX.Element{
 const chunks=source.split('\n');let fenced=false;const result:React.JSX.Element[]=[];let buffer:string[]=[];
 const flush=(id:number):void=>{if(buffer.length){result.push(<pre key={'code'+id} className="documentation-code"><code>{buffer.join('\n')}</code></pre>);buffer=[];}};
 chunks.forEach((line,i)=>{
  if(line.trim().startsWith('```')){if(fenced){fenced=false;flush(i);}else fenced=true;return;}
  if(fenced){buffer.push(line);return;}
  const title=/^#{1,5}\s+(.+)/.exec(line);
  if(title){result.push(<h3 key={i}>{title[1]}</h3>);return;}
  if(/^\.\. [a-z][a-z0-9_-]*::/.test(line)){result.push(<h4 key={i}>{line}</h4>);return;}
  if(!line.trim())return;
  result.push(<p key={i}>{line}</p>);
 });
 flush(chunks.length);
 return <div className="documentation-content">{result}</div>;
}
export function DocumentationLibrary():React.JSX.Element{
 const api=window.checkmateDocs;
 const [selected,setSelected]=useState('rust-book');
 const [statuses,setStatuses]=useState<DocumentPackStatus[]>([]);
 const [pack,setPack]=useState<InstalledDocumentPack|null>(null);
 const [selectedPath,setSelectedPath]=useState('');
 const [article,setArticle]=useState<DocumentView|null>(null);
 const [matchPaths,setMatchPaths]=useState<readonly string[]|null>(null);
 const [query,setQuery]=useState('');
 const [progress,setProgress]=useState<PackProgress|null>(null);
 const [error,setError]=useState('');
 const [working,setWorking]=useState(false);
 const [batch,setBatch]=useState<{done:number;total:number;name:string}|null>(null);
 const stopBatch=useRef(false);
 useEffect(()=>{
  if(!api)return;
  void api.packs().then(setStatuses).catch(e=>setError(String(e)));
  return api.onPackProgress(setProgress);
 },[api]);
 useEffect(()=>{
  setPack(null);setSelectedPath('');setArticle(null);setMatchPaths(null);setQuery('');setError('');
  if(!api)return;
  void api.loadPack(selected).then(value=>{setPack(value);setSelectedPath(value?.documents[0]?.path??'');}).catch(e=>setError(String(e)));
 },[api,selected]);
 useEffect(()=>{
  if(!api||!pack)return;
  let active=true;
  const timer=setTimeout(()=>{
   void api.searchPack(pack.id,query).then(paths=>{if(active)setMatchPaths(paths);}).catch(e=>{if(active)setError(String(e));});
  },query?300:0);
  return()=>{active=false;clearTimeout(timer);};
 },[api,pack,query]);
 const files=useMemo(()=>pack?.documents.filter(doc=>matchPaths===null||matchPaths.includes(doc.path))??[],[pack,matchPaths]);
 useEffect(()=>{
  if(!api||!pack)return;
  let active=true;
  const path=selectedPath||files[0]?.path;
  if(!path){setArticle(null);return;}
  void api.readDocument(pack.id,path).then(data=>{if(active)setArticle(data);}).catch(e=>{if(active)setError(String(e));});
  return()=>{active=false;};
 },[api,pack,selectedPath,files]);
 const install=async():Promise<void>=>{
  if(!api)return;
  setWorking(true);setError('');setProgress(null);
  try{
   const outcome=await api.installPack(selected);
   setStatuses(old=>[...old.filter(v=>v.id!==selected),outcome]);
   const downloaded=await api.loadPack(selected);
   setPack(downloaded);setMatchPaths(null);setSelectedPath(downloaded?.documents[0]?.path??'');
  }catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setWorking(false);}
 };
 const installAll=async():Promise<void>=>{
  if(!api||working)return;
  stopBatch.current=false;setWorking(true);setError('');
  const pending=OFFICIAL_PACKS.filter(def=>!statuses.some(x=>x.id===def.id&&x.installed));
  if(!pending.length){setWorking(false);return;}
  const failures:string[]=[];let done=0;
  try{
   for(const item of pending){
    if(stopBatch.current)break;
    setSelected(item.id);
    setBatch({done,total:pending.length,name:item.title});
    try{
     const status=await api.installPack(item.id);
     setStatuses(old=>[...old.filter(x=>x.id!==item.id),status]);
     const saved=await api.loadPack(item.id);
     setPack(saved);setSelectedPath(saved?.documents[0]?.path??'');
    }catch(e){failures.push(item.title+': '+(e instanceof Error?e.message:String(e)));}
    done++;
    setBatch({done,total:pending.length,name:item.title});
   }
   setStatuses(await api.packs());
   if(failures.length)setError('Nicht alle Offline-Dokumentationen konnten installiert werden. '+failures.slice(0,4).join(' | ')+(failures.length>4?' · weitere Fehler: '+(failures.length-4):''));
   else if(stopBatch.current)setError('Installation nach dem aktuellen Paket abgebrochen. Bereits installierte Pakete bleiben lokal gespeichert.');
  }finally{setWorking(false);setBatch(null);stopBatch.current=false;}
 };
 const def=OFFICIAL_PACKS.find(x=>x.id===selected);
 const status=statuses.find(x=>x.id===selected);
 return <section className="documentation-library" aria-label="Offizielle Offline-Dokumentationen">
  <header className="documentation-header"><span className="eyebrow">CHECKMATE / OFFIZIELLE DOKUMENTATION</span>
   <h2>Referenzmaterial aus Originalquellen</h2>
   <p>Quellengetreue Textkapitel, lokal gespeichert und ohne Browser durchsuchbar. Jedes Paket umfasst den gesamten angegebenen Quellbereich. Es ersetzt nur dann ein vollständiges Sprachhandbuch, wenn genau dieser Umfang importiert wurde.</p></header>
  <div className="documentation-batch">
   <div><strong>{statuses.filter(x=>x.installed).length} / {OFFICIAL_PACKS.length} Referenzpakete lokal</strong><p>Einmal installieren, anschließend offline lesen und durchsuchen. Alle zugehörigen Quellkapitel und Medien werden lokal gespeichert.</p></div>
   <div className="documentation-batch-actions">
    {batch&&<span role="status">{batch.done} / {batch.total} · {batch.name}</span>}
    {working&&batch?<button className="secondary-btn" onClick={()=>{stopBatch.current=true;}}>Nach diesem Paket stoppen</button>:
      <button className="primary-btn" disabled={!api||working||statuses.filter(x=>x.installed).length===OFFICIAL_PACKS.length} onClick={()=>void installAll()}>Alle fehlenden Pakete installieren</button>}
   </div>
  </div>
  <div className="documentation-shell">
   <aside className="documentation-pack-list">
    <strong>OFFIZIELLE PUBLIKATIONEN</strong>
    {OFFICIAL_PACKS.map(entry=>{
     const installed=statuses.find(s=>s.id===entry.id);
     return <button key={entry.id} className={selected===entry.id?'documentation-pack active':'documentation-pack'} onClick={()=>setSelected(entry.id)}>
      <b>{entry.title}</b><span>{LANGUAGE_SPECS.find(l=>l.id===entry.language)?.name} · {installed?.installed?installed.count+' Dateien gespeichert':'Noch nicht installiert'}</span>
     </button>;
    })}
   </aside>
   <main className="documentation-main">
    <div className="documentation-pack-info">
     <h3>{def?.title}</h3><p>{def?.extent}</p>
     <div className="documentation-pack-stats">{status?.installed?<>Installiert: {status.count} Textdateien · Commit {status.sourceCommit?.slice(0,12)}</>:'Offline-Paket noch nicht installiert'}</div>
     <p className="documentation-credit">Offizielle Originalpublikation · Lizenz: {def?.license} · Quellstand wird mit Commit und Prüfsummen lokal dokumentiert.</p>
     <button className="primary-btn" disabled={!api||working} onClick={()=>void install()}>{working?'Dokumentation wird vollständig importiert …':status?.installed?'Quellstand aktualisieren':'Vollständigen Quelltextbestand importieren'}</button>
     {progress&&progress.id===selected&&<p role="status" className="documentation-progress">{progress.detail} {progress.total>0?Math.min(100,Math.round(progress.done/progress.total*100))+'%':''}</p>}
     {error&&<p role="alert" className="documentation-error">{error}</p>}
    </div>
    {pack?<div className="documentation-reader">
     <aside className="documentation-toc"><input aria-label="Offline-Dokumentation durchsuchen" placeholder="Suche im vollständigen Paket…" value={query} onChange={e=>setQuery(e.target.value)}/>
      <small>{files.length} von {pack.documents.length} Kapiteln</small>
      <div className="documentation-toc-list">{files.map(file=><button key={file.path} className={article?.path===file.path?'selected':''} onClick={()=>setSelectedPath(file.path)}>{file.title}<small>{file.path}</small></button>)}</div>
     </aside>
     <article className="documentation-article">{article?<><h2>{article.title}</h2><small>{article.path} · {pack.sourceCommit.slice(0,12)}</small>{/\.(md|mdx|html|htm)$/i.test(article.path)?<OfflineMarkdown source={article.text} currentPath={article.path} pack={pack} api={api!} onNavigate={setSelectedPath}/>:<RenderText source={article.text}/>} </>:<p>Keine Treffer im Dokumentationspaket.</p>}</article>
    </div>:<div className="documentation-placeholder"><strong>Die Publikation kann komplett offline installiert werden.</strong><p>Importierte Kapitel stehen anschließend ohne Netzwerk bereit. Der Import benötigt einmalig Internetzugang und kann je nach Quellgröße scheitern; Fehler werden angezeigt, statt einen unvollständigen Download als vollständig zu speichern.</p></div>}
   </main>
  </div>
 </section>;
}
