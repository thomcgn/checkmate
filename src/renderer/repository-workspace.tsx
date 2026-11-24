import React,{useCallback,useEffect,useState} from 'react';
import type {ChatGPTModel,ChatGPTStatus,RepoBridge,RepoProgress,RepositoryAnalysis,RepositoryPreview,StudyChapterRecord,StudyChapterStatus} from '../shared/repository';
import './repository-workspace.css';
import {estimateRemainingSeconds,formatDuration} from '../shared/teaching-progress';
declare global{interface Window{checkmateRepos?:RepoBridge}}
function elapse(start:number):string{
 const elapsed=Math.floor((Date.now()-start)/1000);
 return String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');
}
function TeachingMarkdown({value}:{value:string}):React.JSX.Element{
 const lines=value.split('\n');
 const nodes:React.JSX.Element[]=[];
 let code:string[]=[];let inCode=false;let lang='';
 for(let i=0;i<lines.length;i++){
  const line=lines[i];const key='line-'+i;
  if(line.trim().startsWith('```')){
   if(inCode){nodes.push(<pre className="learning-code" key={key}><code>{code.join('\n')}</code></pre>);code=[];inCode=false;}
   else{inCode=true;lang=line.slice(3).trim();}
   continue;
  }
  if(inCode){code.push(line);continue;}
  const heading=/^(#{1,4})\s+(.+)$/.exec(line);
  if(heading){const title=heading[2];if(heading[1].length<=2)nodes.push(<h3 key={key}>{title}</h3>);else nodes.push(<h4 key={key}>{title}</h4>);continue;}
  if(/^\s*[-*] /.test(line)){nodes.push(<p className="learning-list-line" key={key}>• {line.replace(/^\s*[-*] /,'')}</p>);continue;}
  if(/^\d+\.\s/.test(line)){nodes.push(<p className="learning-list-line" key={key}>{line}</p>);continue;}
  if(line.trim())nodes.push(<p key={key}>{line}</p>);
 }
 if(code.length)nodes.push(<pre key="last-code" className="learning-code"><code>{code.join('\n')}</code></pre>);
 return <div className="learning-markdown" data-code-language={lang}>{nodes}</div>;
}
export function RepositoryWorkspace():React.JSX.Element{
 const api=window.checkmateRepos;
 const [url,setUrl]=useState('https://github.com/thomcgn/FassWerk');
 const [preview,setPreview]=useState<RepositoryPreview|null>(null);
 const [status,setStatus]=useState<ChatGPTStatus|null>(null);
 const [models,setModels]=useState<ChatGPTModel[]>([]);
 const [model,setModel]=useState('');
 const [books,setBooks]=useState<RepositoryAnalysis[]>([]);
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [consent,setConsent]=useState(false);
 const [progress,setProgress]=useState<RepoProgress|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [clock,setClock]=useState(0);
 const [studyRecords,setStudyRecords]=useState<StudyChapterRecord[]>([]);
 const [activeChapter,setActiveChapter]=useState(0);
 const refresh=useCallback(async():Promise<void>=>{
  if(!api)return;
  const [account,stored]=await Promise.all([api.chatgptStatus(),api.saved()]);
  setStatus(account);setBooks(stored);
  if(account.connected&&account.sharing){try{const available=await api.models();setModels(available);setModel(prev=>available.some(x=>x.slug===prev)?prev:available[0]?.slug??'');}catch(error){setModels([]);setModel('');setError(error instanceof Error?error.message:String(error));}}
  else {setModels([]);setModel('');}
 },[api]);
 useEffect(()=>{void refresh().catch(e=>setError(String(e)));},[refresh]);
 useEffect(()=>api?.onProgress(setProgress),[api]);
 useEffect(()=>{
  if(!busy)return;
  const t=setInterval(()=>setClock(v=>v+1),1000);
  return ()=>clearInterval(t);
 },[busy]);
 const check=async():Promise<void>=>{
  if(!api)return;setError('');setBusy(true);setConsent(false);setPreview(null);setProgress(null);
  try{setPreview(await api.preview(url));}catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setBusy(false);}
 };
 const signIn=async():Promise<void>=>{
  if(!api)return;setBusy(true);setError('');
  try{setStatus(await api.signIn());await refresh();}catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setBusy(false);}
 };
 const signOut=async():Promise<void>=>{
  if(!api||busy)return;setBusy(true);setError('');
  try{setStatus(await api.signOut());setModels([]);setModel('');}catch(e){setError(e instanceof Error?e.message:String(e));setStatus(await api.chatgptStatus());setModels([]);setModel('');}
  finally{setBusy(false);}
 };
 const analyze=async():Promise<void>=>{
  if(!api||!preview||!consent||!model)return;setBusy(true);setError('');
  try{
   const result=await api.analyze(url,true,model);
   setBooks(stored=>[result,...stored]);setSelectedId(result.id);
  }catch(e){setError(e instanceof Error?e.message:String(e));}
  finally{setBusy(false);}
 };
 const remove=async(id:string):Promise<void>=>{
  if(!api||busy)return;
  if(!window.confirm('Dieses gespeicherte Lernbuch wirklich löschen?'))return;
  try{await api.remove(id);setBooks(current=>current.filter(x=>x.id!==id));if(selectedId===id)setSelectedId(null);}
  catch(e){setError(e instanceof Error?e.message:String(e));}
 };
 const book=books.find(b=>b.id===selectedId);
 useEffect(()=>{
  setStudyRecords([]);setActiveChapter(0);
  if(!api||!selectedId)return;
  let alive=true;
  void api.studyProgress(selectedId).then(records=>{if(alive)setStudyRecords(records);})
   .catch(e=>{if(alive)setError(e instanceof Error?e.message:String(e));});
  return()=>{alive=false;};
 },[api,selectedId]);
 const updateMastery=async(next:StudyChapterStatus):Promise<void>=>{
  if(!api||!book?.teachingBook||busy)return;
  try{
   const record=await api.setStudyProgress(book.id,activeChapter,next);
   setStudyRecords(current=>[...current.filter(item=>item.chapterIndex!==activeChapter),record]);
  }catch(e){setError(e instanceof Error?e.message:String(e));}
 };
 const completedChapters=book?.teachingBook?.chapters.filter((_,i)=>studyRecords.some(record=>record.chapterIndex===i&&record.status==='understood')).length??0;
 return <div className="repo-workspace">
  <div className="repo-hero"><div>
    <span className="repo-overline">CHECKMATE / REPOSITORY LAB</span>
    <h2>Fremden Code lesen.<br/><em>Eigenen Code beherrschen.</em></h2>
    <p>Lerne Architektur, Konzepte und Entscheidungen an echtem Quellcode. ChatGPT schreibt dein persönliches Lehrkapitel – kein Agent verändert das Repository.</p>
   </div><div className="repo-hero-symbol" aria-hidden="true">♚<span>{'{ }'}</span></div>
  </div>
  {!api&&<div className="repo-note">Für die Repository-Analyse bitte die Electron-Desktop-App starten. Die browserbasierte Vorschau zeigt nur die Bibliothek.</div>}
  <div className="repo-layout">
   <div className="repo-left">
    <section className="repo-panel">
     <div className="repo-panel-title"><span className="repo-step">01</span><div><h3>ChatGPT verbinden</h3><p>Eigener ChatGPT-Login, keine lokalen Modelle.</p></div></div>
     <div className="repo-account">
      <span className={status?.connected?'repo-led good':'repo-led'}/>
      <div><strong>{status?.connected?(status.sharing?'ChatGPT verbunden':'Berechtigung zur Plannutzung fehlt'):status?.available?'Anmeldung erforderlich':'Anmeldung nicht verfügbar'}</strong>
       <small>{status?.connected?status.email||status.plan||'ChatGPT-Konto':status?.detail||'Status wird gelesen …'}</small></div>
     </div>
     <div className="repo-actions"><button className="repo-primary" disabled={!api||busy} onClick={()=>void(status?.connected?refresh():signIn())}>{status?.connected?'Status aktualisieren':'Mit ChatGPT anmelden'}</button>
      <button className="repo-secondary" disabled={!api||busy} onClick={()=>void refresh()}>↻ Prüfen</button></div>
     <p className="repo-hint">{status?.detail??'Verbindung wird geprüft …'} Die Anmeldung erfolgt direkt mit ChatGPT. Zugangsdaten bleiben verschlüsselt im Hauptprozess und werden niemals an die Oberfläche weitergegeben.</p>
     {status?.connected&&status.sharing&&<div className="repo-model-select"><label htmlFor="repo-model" className="repo-label">CHATGPT-MODELL</label><select id="repo-model" aria-label="ChatGPT-Modell" value={model} onChange={e=>setModel(e.target.value)}>{models.map(m=><option key={m.slug} value={m.slug}>{m.display_name}</option>)}</select>
       {models.length===0&&<small>Für dieses Konto wurde noch kein nutzbares Modell geladen.</small>}
       <button className="repo-secondary" disabled={busy} onClick={()=>void signOut()}>ChatGPT-Konto trennen</button></div>}
    </section>
    <section className="repo-panel">
     <div className="repo-panel-title"><span className="repo-step">02</span><div><h3>Repository auswählen</h3><p>Vorerst öffentlich zugängliche GitHub-Repositories.</p></div></div>
     <label htmlFor="repo-address" className="repo-label">GITHUB-ADRESSE</label>
     <input id="repo-address" className="repo-address" value={url} onChange={e=>{setUrl(e.target.value);setPreview(null);setConsent(false);}} placeholder="https://github.com/owner/repo"/>
     <button className="repo-secondary repo-wide" disabled={!api||busy} onClick={()=>void check()}>{busy&&!preview?'Quelldateien werden geprüft …':'Repository prüfen'}</button>
     {preview&&<div className="repo-preview">
      <div className="repo-preview-heading"><span className="repo-led good"/><strong>{preview.repository}</strong><span>{preview.head.slice(0,9)}</span></div>
      <div className="repo-stat-grid"><div><strong>{preview.files}</strong><small>Dateien gesamt</small></div><div><strong>{preview.included}</strong><small>für Lernprobe</small></div><div><strong>{preview.excluded}</strong><small>nicht übermittelt</small></div></div>
      <p>Begrenzte Stichprobe: Ausgewählte Quelldateien werden als Text analysiert. Vollständigkeit des gesamten Repositories wird nicht behauptet.</p>
      <details><summary>Analysierte Dateipfade ansehen</summary><ul>{preview.samplePaths.map(p=><li key={p}>{p}</li>)}</ul></details>
      <label className="repo-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Ich möchte diese ausgewählten Quellcodeausschnitte an ChatGPT zur Lernanalyse senden.</span></label>
      <button className="repo-primary repo-wide" disabled={!api||busy||!consent||!status?.sharing||!model} onClick={()=>void analyze()}>♚ Lehrkapitel mit ChatGPT erstellen</button>
     </div>}
    </section>
    <section className="repo-panel repo-books">
     <div className="repo-panel-title"><span className="repo-step">03</span><div><h3>Deine Lernbücher</h3><p>Ergebnisse bleiben auf diesem Rechner gespeichert.</p></div></div>
     {books.length===0?<p className="repo-hint">Noch keine Analysen gespeichert. Nach der ersten erfolgreichen Analyse entsteht hier deine Bibliothek.</p>:books.map(b=><div className={'repo-book '+(b.id===selectedId?'chosen':'')} key={b.id}>
      <button onClick={()=>setSelectedId(b.id)}><strong>▤ {b.title}</strong><small>{new Date(b.createdAt).toLocaleDateString('de-DE')} · {b.files} Dateien · {b.head.slice(0,8)}</small></button>
      <button className="repo-delete" aria-label={'Buch '+b.title+' löschen'} title="Lernbuch löschen" onClick={()=>void remove(b.id)}>×</button>
     </div>)}
    </section>
   </div>
   <section className="repo-panel repo-reader">
    <div className="repo-reader-head"><div><span className="repo-overline">LIVE LEARNING / DEIN STUDIERZIMMER</span><h3>{book?book.title:'Dein nächstes Aha-Erlebnis'}</h3></div><span className="repo-status">{progress?.phase==='done'?'✓ Gespeichert':busy?'● In Arbeit':'Bereit'}</span></div>
    {error&&<div className="repo-error" role="alert">{error}</div>}
    {progress&&<div className="repo-progress">
     <div><strong>{progress.detail}</strong><span>{progress.phase==='fetching'||progress.phase==='analyzing'?progress.done+'/'+progress.total:progress.phase}</span></div>
     <div className="repo-track"><span style={{width:(progress.total?Math.round(progress.done/progress.total*100):0)+'%'}}/></div>
     <small>Verstrichen: {elapse(progress.startedAt)}{estimateRemainingSeconds(progress,Date.now())!==null?' · ETA ca. '+formatDuration(estimateRemainingSeconds(progress,Date.now())!):''}{busy?' · Schätzung abhängig von Modell und Kontingent.':''}</small>
    </div>}
    {book?<><div className="repo-book-meta">{book.model} · Commit {book.head.slice(0,12)} · {book.files} Quelldateien</div>
     {!!book.teachingBook?.chapters.length&&<div className="repo-progress" aria-label="Lernfortschritt für das Lehrbuch">
      <strong>Lernfortschritt: {completedChapters} von {book.teachingBook.chapters.length} Kapiteln verstanden</strong>
      <label htmlFor="repo-study-chapter" className="repo-label">KAPITEL</label>
      <select id="repo-study-chapter" value={activeChapter} onChange={e=>setActiveChapter(Number(e.target.value))}>
       {book.teachingBook.chapters.map((chapter,i)=><option key={i} value={i}>{i+1}. {chapter.title}</option>)}
      </select>
      <div className="repo-actions">
       <button className="repo-secondary" disabled={busy} onClick={()=>void updateMastery('learning')}>In Bearbeitung</button>
       <button className="repo-secondary" disabled={busy} onClick={()=>void updateMastery('understood')}>Verstanden</button>
       <button className="repo-secondary" disabled={busy} onClick={()=>void updateMastery('unread')}>Zurücksetzen</button>
      </div>
     </div>}
     <TeachingMarkdown value={book.markdown}/></>:
     <div className="repo-empty-state">
      <div className="repo-empty-symbol">♚</div>
      <h3>Aus Quellcode wird Verständnis.</h3>
      <p>Verbinde ChatGPT, prüfe ein Repository und starte die Analyse. Dein Lernkapitel entsteht hier mit Architektur, konkreten Konzepten, Aufgaben und Lösungen.</p>
      <div className="repo-learning-stages"><span>01 · Entdecken</span><span>02 · Verstehen</span><span>03 · Anwenden</span><span>04 · Verinnerlichen</span></div>
     </div>}
   </section>
  </div>
 </div>;
}
