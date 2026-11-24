import {test,expect} from '@playwright/test';
test('Repository Lab workflow with mocked desktop transport at 10-inch viewport',async({page})=>{
 await page.addInitScript(()=>{
  const stored:{
   id:string;repository:string;head:string;title:string;createdAt:string;model:string;files:number;includedPaths:string[];markdown:string
  }[]=[];
  Object.defineProperty(window,'checkmateRepos',{value:{
   preview:async()=>({repository:'thomcgn/FassWerk',head:'a'.repeat(40),files:150,included:2,excluded:148,bytes:902,
    samplePaths:['README.md','src/Main.java'],source:'Public GitHub'}),
   chatgptStatus:async()=>({available:true,connected:true,sharing:true,email:'account@example.invalid',plan:'plus',detail:'Verbunden'}),
   signIn:async()=>({available:true,connected:true,sharing:true,email:'account@example.invalid',plan:'plus',detail:'Verbunden'}),
   signOut:async()=>({available:true,connected:false,sharing:false,email:null,plan:null,detail:'Getrennt'}),
   models:async()=>[{slug:'gpt-checkmate-test',display_name:'Testmodell'}],
   analyze:async(_url:string,_consent:boolean,_model:string)=>{const book={id:'d50cf5c3-bd33-4b14-9974-f51c23149aaf',repository:'thomcgn/FassWerk',
    head:'a'.repeat(40),title:'Code verstehen: thomcgn/FassWerk',
    createdAt:'2026-11-23T12:00:00.000Z',model:'ChatGPT',files:2,
    includedPaths:['README.md','src/Main.java'],markdown:'# Analyse\n\n## Generics\n\nEin generischer Typ bewahrt Typzusammenhänge.'};
    stored.unshift(book);return book;},
   saved:async()=>stored,
   studyProgress:async()=>[],
   setStudyProgress:async(bookId:string,chapterIndex:number,status:string)=>({bookId,chapterIndex,status,updatedAt:new Date().toISOString()}),
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
 await expect(page.locator('body')).toHaveJSProperty('scrollWidth',page.viewportSize()?.width);
});
test('Concept library and language handbooks are navigable without backend',async({page})=>{
 await page.goto('/');
 await page.getByRole('textbox',{name:'Konzept suchen'}).fill('HashMap');
 await expect(page.getByRole('button',{name:/Schlüssel-Wert-Zuordnungen/})).toBeVisible();
 await page.getByRole('button',{name:/Originaldokumentationen/}).click();
 await expect(page.getByRole('heading',{name:'Deine Handbuchbibliothek ist noch leer'})).toBeVisible();
 await page.getByRole('button',{name:'Zur Einrichtung'}).click();
 await expect(page.getByRole('heading',{name:'Sprachreferenzen installieren'})).toBeVisible();
 await expect(page.getByRole('button',{name:/Paket installieren/}).first()).toBeDisabled();
});

test('published books are bundled and readable entirely without desktop backend, OAuth or network',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Lehrbücher/}).click();
 await expect(page.getByRole('heading',{name:'Checkmate-Fachbücher'})).toBeVisible();
 await expect(page.getByRole('heading',{name:/Java verstehen/})).toBeVisible();
 await expect(page.getByText(/Fachbuch im Aufbau/)).toBeVisible();
 await expect(page.getByRole('button',{name:/JDK, IDE, Quelltexte und der erste Build/})).toBeDisabled();
 await expect(page.getByRole('button',{name:/Primitive Typen, Konvertierung und Zahlen/})).toBeEnabled();
 await expect(page.getByRole('heading',{name:'Variablen & Bindungen'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Verständnisfragen'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Antwort mit Begründung zeigen'}).first()).toBeVisible();
 await expect(page.getByRole('button',{name:/Kapitel verstanden/})).toBeVisible();
 await expect(page.getByRole('button',{name:/generier|ChatGPT/i})).toHaveCount(0);
 await page.getByRole('button',{name:/Kapitel verstanden/}).click();
 await expect(page.getByText(/1 \/ \d+ Kapitel als verstanden/)).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:/Lehrbücher/}).click();
 await expect(page.getByText(/1 \/ \d+ Kapitel als verstanden/)).toBeVisible();
 await expect(page.locator('body')).toHaveJSProperty('scrollWidth',page.viewportSize()?.width);
});

test('old Java practice progress migrates once into the unified textbook',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>localStorage.setItem('checkmate:published-textbooks:study:v1',JSON.stringify({
  'checkmate-java-practice-v1':['java-type-relationships']
 })));
 await page.reload();
 await page.getByRole('button',{name:/Lehrbücher/}).click();
 await expect(page.getByText(/1 \/ \d+ Kapitel als verstanden/)).toBeVisible();
 await page.getByRole('button',{name:/Invarianz, Bounds, Wildcards und PECS/}).click();
 await page.getByRole('button',{name:'Als noch offen markieren'}).click();
 await expect(page.getByText(/0 \/ \d+ Kapitel als verstanden/)).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:/Lehrbücher/}).click();
 await expect(page.getByText(/0 \/ \d+ Kapitel als verstanden/)).toBeVisible();
});
