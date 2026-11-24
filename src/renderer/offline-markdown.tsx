import React,{useEffect,useState} from 'react';
import ReactMarkdown from 'react-markdown';
import type {DocumentationBridge,InstalledDocumentPack} from '../shared/documentation';

/** Resolve relative references against the current locally installed document; never navigate to the web. */
export function resolveOfflinePath(current:string,href:string):string|null{
 const clean=href.trim().split('#')[0].split('?')[0];
 if(!clean||/^([a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(clean))return null;
 let decoded='';
 try{decoded=decodeURIComponent(clean);}catch{return null;}
 if(decoded.includes('\\')||decoded.includes('\0'))return null;
 const stack=current.split('/').slice(0,-1);
 for(const item of decoded.split('/')){
  if(!item||item==='.')continue;
  if(item==='..'){if(!stack.length)return null;stack.pop();}
  else stack.push(item);
 }
 return stack.join('/');
}
function OfflineImage({src,alt,documentPath,pack,api}:{src:string;alt?:string;documentPath:string;
 pack:InstalledDocumentPack;api:DocumentationBridge}):React.JSX.Element{
 const [image,setImage]=useState<string|null>(null);
 useEffect(()=>{
  const target=resolveOfflinePath(documentPath,src);
  if(!target||!pack.assets.some(asset=>asset.path===target)){setImage(null);return;}
  let live=true;
  void api.readAsset(pack.id,target).then(value=>{if(live)setImage(value);}).catch(()=>{if(live)setImage(null);});
  return()=>{live=false;};
 },[src,documentPath,pack,api]);
  const description=alt?.trim()?alt:'Abbildung der Dokumentation';
  return image?<img src={image} alt={description} loading="lazy"/>:
   <span className="documentation-image-alt">Abbildung: {description}</span>;
}
export function OfflineMarkdown({source,currentPath,pack,api,onNavigate}:{source:string;currentPath:string;
 pack:InstalledDocumentPack;api:DocumentationBridge;onNavigate:(path:string)=>void}):React.JSX.Element{
 return <div className="documentation-content documentation-rich">
  <ReactMarkdown skipHtml components={{
   h1:({children})=><h4>{children}</h4>,
   h2:({children})=><h4>{children}</h4>,
   h3:({children})=><h5>{children}</h5>,
   h4:({children})=><h6>{children}</h6>,
   a:({href,children})=>{
    const file=resolveOfflinePath(currentPath,href??'');
    const known=file&&pack.documents.some(d=>d.path===file);
    return known?<button type="button" className="documentation-inline-link" onClick={()=>onNavigate(file)}>{children}</button>:
     <span className="documentation-unavailable-link" title="Nur externe Referenz; keine Browsernavigation">{children}<span className="sr-only"> (nur externe Referenz, offline nicht verfügbar)</span></span>;
   },
   img:({src,alt})=><OfflineImage src={src??''} alt={alt} documentPath={currentPath} pack={pack} api={api}/>
  }}>{source}</ReactMarkdown>
 </div>;
}
