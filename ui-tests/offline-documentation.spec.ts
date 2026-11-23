import {test,expect} from '@playwright/test';

test('official documentation is searched and navigated without opening a browser',async({page,context})=>{
 const external:string[]=[];
 context.on('page',popup=>external.push(popup.url()));
 await page.addInitScript(()=>{
  const docs=[
   {path:'src/chapter-one.md',title:'Rust Einstieg',bytes:130,sha256:'a'.repeat(64),text:true},
   {path:'src/next.md',title:'Ownership Grundlagen',bytes:88,sha256:'b'.repeat(64),text:true}
  ];
  const pack={id:'rust-book',language:'rust',title:'The Rust Programming Language',
   sourceCommit:'a'.repeat(40),sourceUrl:'source',license:'MIT',licenseUrl:'license',
   installedAt:'2026-11-23T00:00:00Z',extent:'Vollständiges Buch',documents:docs,assets:[]};
  const bodies:Record<string,string>={
   'src/chapter-one.md':'# Willkommen\n\nDie Erklärung ist vollständig **offline**.\n\n[Zur zweiten Lektion](next.md)\n\n[Website (nicht öffnen)](https://example.org).',
   'src/next.md':'# Ownership Grundlagen\n\nEin Besitzer verwaltet einen Wert.'
  };
  Object.defineProperty(window,'checkmateDocs',{value:{
   packs:async()=>[{id:'rust-book',installed:true,count:2,sourceCommit:'a'.repeat(40),installedAt:'2026-11-23T00:00:00Z'}],
   loadPack:async(id:string)=>id==='rust-book'?pack:null,
   readDocument:async(_id:string,path:string)=>({path,title:docs.find(d=>d.path===path)?.title??path,text:bodies[path]}),
   readAsset:async()=>{throw Error('No asset');},
   searchPack:async(_id:string,query:string)=>docs.filter(d=>(d.title+' '+bodies[d.path]).toLowerCase().includes(query.toLowerCase())).map(d=>d.path),
   installPack:async()=>({id:'rust-book',installed:true,count:2,sourceCommit:'a'.repeat(40),installedAt:'2026-11-23T00:00:00Z'}),
   onPackProgress:()=>()=>{}
  }});
 });
 await page.goto('/');
 await page.getByRole('button',{name:/Originaldokumentationen/}).click();
 await expect(page.getByRole('heading',{name:'Referenzmaterial aus Originalquellen'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Willkommen'})).toBeVisible();
 await page.getByRole('button',{name:'Zur zweiten Lektion'}).click();
 await expect(page.getByRole('heading',{name:'Ownership Grundlagen'}).first()).toBeVisible();
 await expect(page.getByText('Ein Besitzer verwaltet einen Wert.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Website (nicht öffnen)'})).toHaveCount(0);
 expect(external).toHaveLength(0);
});
