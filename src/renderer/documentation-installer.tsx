import React,{useEffect,useRef,useState} from 'react';
import {OFFICIAL_PACKS,type DocumentPackStatus,type DocumentationBridge,type PackProgress} from '../shared/documentation';
import {LANGUAGE_SPECS} from '../content/language-reference';
import './documentation-library.css';
declare global{interface Window{checkmateDocs?:DocumentationBridge}}
export function DocumentationInstaller({openLibrary}:{openLibrary:()=>void}):React.JSX.Element{
 const api=window.checkmateDocs;
 const [statuses,setStatuses]=useState<DocumentPackStatus[]>([]);
 const [selected,setSelected]=useState(OFFICIAL_PACKS[0].id);
 const [busy,setBusy]=useState(false);
 const [progress,setProgress]=useState<PackProgress|null>(null);
 const [batch,setBatch]=useState<{current:number;total:number;title:string}|null>(null);
 const [errors,setErrors]=useState<string[]>([]);
 const stop=useRef(false);
 useEffect(()=>{
  if(!api)return;
  void api.packs().then(setStatuses).catch(e=>setErrors([String(e)]));
  return api.onPackProgress(setProgress);
 },[api]);
 const installed=(id:string):boolean=>statuses.some(s=>s.id===id&&s.installed);
 const install=async(id:string):Promise<void>=>{
  if(!api||busy)return;
  setBusy(true);setErrors([]);setSelected(id);
  try{const result=await api.installPack(id);setStatuses(items=>[...items.filter(v=>v.id!==id),result]);}
  catch(e){setErrors([e instanceof Error?e.message:String(e)]);}
  finally{setBusy(false);}
 };
 const installAll=async():Promise<void>=>{
  if(!api||busy)return;
  setBusy(true);stop.current=false;setErrors([]);
  const pending=OFFICIAL_PACKS.filter(p=>!installed(p.id));
  const failures:string[]=[];
  try{
   for(let i=0;i<pending.length;i++){
    if(stop.current)break;
    const item=pending[i];setSelected(item.id);
    setBatch({current:i+1,total:pending.length,title:item.title});
    try{const result=await api.installPack(item.id);setStatuses(prev=>[...prev.filter(p=>p.id!==item.id),result]);}
    catch(e){failures.push(item.title+': '+(e instanceof Error?e.message:String(e)));}
   }
   setStatuses(await api.packs());
   setErrors(failures);
  }catch(e){setErrors(prev=>[...prev,String(e)]);}
  finally{setBusy(false);setBatch(null);stop.current=false;}
 };
 const successful=statuses.filter(s=>s.installed).length;
 return <section className="documentation-library documentation-installer" aria-label="Dokumentationen installieren">
  <header className="documentation-header">
   <span className="eyebrow">CHECKMATE / EINRICHTUNG</span>
   <h2>Sprachreferenzen installieren</h2>
   <p>Hier werden ausschließlich Dokumentationspakete heruntergeladen und verwaltet. Erfolgreich importierte Sprachen erscheinen automatisch unter <strong>Sprachenhandbücher</strong>, wo du sie vollständig offline liest und durchsuchst.</p>
  </header>
  <div className="documentation-batch">
   <div><strong>{successful} von {OFFICIAL_PACKS.length} Paketen installiert</strong>
    <p>Bestehende Pakete bleiben erhalten. Fehlgeschlagene Downloads kannst du einzeln erneut starten.</p></div>
   <div className="documentation-batch-actions">
    {busy&&batch?<button className="secondary-btn" onClick={()=>{stop.current=true;}}>Nach diesem Paket stoppen</button>:
     <button className="primary-btn" disabled={!api||busy||successful===OFFICIAL_PACKS.length} onClick={()=>void installAll()}>Alle fehlenden installieren</button>}
    {successful>0&&<button className="secondary-btn" onClick={openLibrary}>Zu den Handbüchern</button>}
   </div>
  </div>
  {batch&&<p className="documentation-progress" role="status">Paket {batch.current}/{batch.total}: {batch.title}</p>}
  {progress&&<p className="documentation-progress" role="status">{progress.detail}{progress.total>0?' · '+Math.min(100,Math.round(progress.done/progress.total*100))+' %':''}</p>}
  {errors.length>0&&<div className="documentation-error" role="alert">{errors.map((e,i)=><p key={i}>{e}</p>)}</div>}
  <div className="documentation-install-grid">
   {OFFICIAL_PACKS.map(p=>{
    const state=statuses.find(s=>s.id===p.id);
    const language=LANGUAGE_SPECS.find(l=>l.id===p.language);
    return <article className="documentation-install-card" key={p.id}>
     <div className="documentation-install-card-top"><span>{language?.name??p.language}</span><strong className={state?.installed?'installed':'pending'}>{state?.installed?'✓ Importiert':'Nicht installiert'}</strong></div>
     <h3>{p.title}</h3>
     <p>{p.extent}</p>
     {state?.installed&&<small>{state.count} Dokumente · Version {state.sourceCommit?.slice(0,12)}</small>}
     <button className="secondary-btn" disabled={!api||busy} onClick={()=>void install(p.id)}>{state?.installed?'Quellstand aktualisieren':'Paket installieren'}</button>
    </article>;
   })}
  </div>
 </section>;
}
