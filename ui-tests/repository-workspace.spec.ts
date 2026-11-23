import {test,expect} from '@playwright/test';
test('Repository Lab workflow with mocked desktop transport at 10-inch viewport',async({page})=>{
 await page.addInitScript(()=>{
  const stored:{
   id:string;repository:string;head:string;title:string;createdAt:string;model:string;files:number;includedPaths:string[];markdown:string
  }[]=[];
  Object.defineProperty(window,'checkmateRepos',{value:{
   preview:async()=>({repository:'thomcgn/FassWerk',head:'a'.repeat(40),files:150,included:2,excluded:148,bytes:902,
    samplePaths:['README.md','src/Main.java'],source:'Public GitHub'}),
   chatgptStatus:async()=>({available:true,connected:true,email:'account@example.invalid',plan:'plus',detail:'Verbunden'}),
   signIn:async()=>({available:true,connected:true,email:'account@example.invalid',plan:'plus',detail:'Verbunden'}),
   signOut:async()=>({available:true,connected:false,email:null,plan:null,detail:'Getrennt'}),
   models:async()=>[{slug:'gpt-checkmate-test',display_name:'Testmodell'}],
   analyze:async(_url:string,_consent:boolean,_model:string)=>{const book={id:'d50cf5c3-bd33-4b14-9974-f51c23149aaf',repository:'thomcgn/FassWerk',
    head:'a'.repeat(40),title:'Code verstehen: thomcgn/FassWerk',
    createdAt:'2026-11-23T12:00:00.000Z',model:'ChatGPT über Codex',files:2,
    includedPaths:['README.md','src/Main.java'],markdown:'# Analyse\n\n## Generics\n\nEin generischer Typ bewahrt Typzusammenhänge.'};
    stored.unshift(book);return book;},
   saved:async()=>stored,
   remove:async(id:string)=>{const index=stored.findIndex(x=>x.id===id);if(index>=0)stored.splice(index,1);},
   onProgress:()=>()=>{},
  }});
 });
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Code verstehen/})).toBeVisible();
 await page.getByRole('button',{name:/Repository Lab/}).click();
 await expect(page.getByRole('heading',{name:/Fremden Code lesen/})).toBeVisible();
 await expect(page.getByText('account@example.invalid')).toBeVisible();
 await page.getByRole('button',{name:'Repository prüfen'}).click();
 await expect(page.getByText('150',{exact:true})).toBeVisible();
 await page.getByText('Analysierte Dateipfade ansehen').click();
 await expect(page.getByText('src/Main.java')).toBeVisible();
 const action=page.getByRole('button',{name:/Lehrkapitel mit ChatGPT erstellen/});
 await expect(action).toBeDisabled();
 await page.getByRole('checkbox').check();
 await expect(action).toBeEnabled();
 await action.click();
 await expect(page.getByRole('heading',{name:'Code verstehen: thomcgn/FassWerk'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Generics'})).toBeVisible();
 await expect(page.getByText('Ein generischer Typ bewahrt Typzusammenhänge.')).toBeVisible();
 await expect(page.locator('body')).toHaveJSProperty('scrollWidth',1024);
});
test('Concept library and language handbooks are navigable without backend',async({page})=>{
 await page.goto('/');
 await page.getByRole('textbox',{name:'Konzept suchen'}).fill('HashMap');
 await expect(page.getByRole('button',{name:/Schlüssel-Wert-Zuordnungen/})).toBeVisible();
 await page.getByRole('button',{name:/Sprachenhandbücher/}).click();
 await expect(page.getByText('Wissen, das du')).toBeVisible();
 await page.getByRole('button',{name:/Rust 1.100/}).click();
 await expect(page.getByText(/Rust 1.100/).first()).toBeVisible();
});
