import React,{useEffect,useMemo,useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {BookOpenText,Boxes,Command,Download,FlaskConical,Search,X} from 'lucide-react';
import {Button} from './primitives';

export type Destination='concepts'|'books'|'handbooks'|'setup'|'repositories';
interface Item{readonly id:Destination;readonly title:string;readonly description:string;readonly icon:React.JSX.Element}
const options:readonly Item[]=[
 {id:'concepts',title:'Konzeptbibliothek',description:'Begriffe, Sprachvergleiche und Übungen',icon:<Boxes size={17}/>},
 {id:'books',title:'Lehrbücher',description:'Fertige Offline-Fachbücher lesen und lernen',icon:<BookOpenText size={17}/>},
 {id:'handbooks',title:'Originaldokumentationen',description:'Offizielle Sprachreferenzen nachschlagen',icon:<BookOpenText size={17}/>},
 {id:'setup',title:'Dokumentationen einrichten',description:'Referenzpakete installieren und verwalten',icon:<Download size={17}/>},
 {id:'repositories',title:'Repository Lab',description:'Echten Quellcode analysieren und verstehen',icon:<FlaskConical size={17}/>}
];

export function CommandPalette({onNavigate}:{onNavigate:(view:Destination)=>void}):React.JSX.Element{
 const [open,setOpen]=useState(false);
 const [query,setQuery]=useState('');
 useEffect(()=>{
  const listener=(event:KeyboardEvent):void=>{
   if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
    event.preventDefault();setOpen(current=>!current);
   }
  };
  window.addEventListener('keydown',listener);
  return()=>window.removeEventListener('keydown',listener);
 },[]);
 const filtered=useMemo(()=>options.filter(i=>(i.title+' '+i.description).toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de').trim())),[query]);
 const activate=(id:Destination):void=>{onNavigate(id);setOpen(false);setQuery('');};
 return <Dialog.Root open={open} onOpenChange={next=>{setOpen(next);if(!next)setQuery('');}}>
  <Dialog.Trigger asChild>
   <Button variant="ghost" size="icon" aria-label="Schnellnavigation öffnen (Strg+K)" title="Schnellnavigation · Strg+K"><Command size={18}/></Button>
  </Dialog.Trigger>
  <Dialog.Portal>
   <Dialog.Overlay className="cm-dialog-overlay"/>
   <Dialog.Content className="cm-dialog-content" aria-describedby="cm-command-description">
    <div className="cm-dialog-heading"><div><Dialog.Title>Schnellnavigation</Dialog.Title>
     <Dialog.Description id="cm-command-description">Öffne einen Bereich ohne lange durch die Seitenleisten zu navigieren.</Dialog.Description></div>
     <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Dialog schließen"><X size={18}/></Button></Dialog.Close>
    </div>
    <label className="cm-command-search"><Search size={18}/><input aria-label="Bereiche durchsuchen" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Wohin möchtest du?"/></label>
    <div className="cm-command-results">{filtered.length?filtered.map(item=><button key={item.id} onClick={()=>activate(item.id)}>
     <span className="cm-command-icon">{item.icon}</span><span><strong>{item.title}</strong><small>{item.description}</small></span></button>):<p>Kein passender Bereich gefunden.</p>}</div>
    <div className="cm-command-footer">ESC zum Schließen · Strg+K zum Öffnen</div>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
