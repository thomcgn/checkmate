import {test,expect,type Page} from '@playwright/test';

const open=async(page:Page):Promise<void>=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
};

const goBand1=async(page:Page)=>{
 const button=page.getByRole('button',{name:'Go · Band 1'});
 await expect(button).toHaveAttribute('aria-pressed','false');
 await button.click();
 await expect(button).toHaveAttribute('aria-pressed','true');
 return button;
};

test('Go · Band 1 ist umschaltbar, vollständig und zeigt Go-Code',async({page})=>{
 await open(page);
 await goBand1(page);
 await expect(page.getByRole('heading',{name:'Die Pizzeria – von der Regel zum Go-Programm'})).toBeVisible();
 await expect(page.getByText(/37 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(37);
 await expect(page.locator('.documentation-header .eyebrow')).toContainText('GO · BAND 1');
 await expect(page.getByRole('heading',{name:'Der erste Gast'})).toBeVisible();
 await expect(page.getByText(/WENN ein Gast bestellt/)).toBeVisible();
 await page.locator('.academy-stage button').filter({hasText:'Ein Namensschild für den Bestand'}).click();
 await expect(page.locator('.academy-figure code').first()).toContainText('bestand := 3');
 await expect(page.locator('.academy-figure code').first()).toContainText('fmt.Println(bestand)');
 await expect(page.locator('.academy-figure code').first()).not.toContainText('System.out');
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
});

test('Go-Regel, Mini-Code, Auflösung und Lernstand funktionieren',async({page})=>{
 await open(page);
 await goBand1(page);
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.getByRole('heading',{name:'WENN es regnet, DANN Schirm'})).toBeVisible();
 await expect(page.locator('.academy-natural-rule')).toContainText('WENN es regnet');
 await expect(page.locator('.academy-pseudo')).toContainText('SONST');
 const code=page.locator('.academy-figure code').first();
 await expect(code).toContainText('if regnet {');
 await expect(code).toContainText('} else {');
 await expect(code).toContainText('fmt.Println("Nass werden")');
 const toggle=page.locator('.academy-solution button');
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await toggle.click();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('#academy-answer')).toContainText('Nass werden');
 await page.getByRole('button',{name:'✓ Kapitel verstanden'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toHaveAttribute('aria-pressed','true');
});

test('Java- und Go-Lernstand liegen in getrennten localStorage-Schlüsseln',async({page})=>{
 await open(page);
 await page.getByRole('button',{name:'✓ Kapitel verstanden'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toBeVisible();
 await goBand1(page);
 await expect(page.getByRole('button',{name:'✓ Kapitel verstanden'})).toBeVisible();
 await page.getByRole('button',{name:'✓ Kapitel verstanden'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toBeVisible();
 await page.reload();
 await open(page);
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toBeVisible();
 await goBand1(page);
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toBeVisible();
 const stored=await page.evaluate(()=>({
  java:localStorage.getItem('checkmate:pizzeria-book:v1'),
  go:localStorage.getItem('checkmate:pizzeria-go-book:v1'),
  goOperations:localStorage.getItem('checkmate:pizzeria-go-operations:v1')
 }));
 assertStored(stored.java);
 assertStored(stored.go);
 expect(stored.goOperations).toBeNull();
});

function assertStored(value:string|null):void{
 expect(value).not.toBeNull();
 expect(JSON.parse(value??'[]')).toContain('first-guest');
}

test('Go · Band 2 nutzt net/http, database/sql und ist umschaltbar',async({page})=>{
 await open(page);
 const band2=page.getByRole('button',{name:'Go · Band 2'});
 await expect(band2).toHaveAttribute('aria-pressed','false');
 await band2.click();
 await expect(band2).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.documentation-header .eyebrow')).toContainText('GO · BAND 2');
 await expect(page.getByRole('heading',{name:'Die Pizzeria geht in Betrieb – Go-Ausgabe'})).toBeVisible();
 await expect(page.getByText(/25 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(25);
 await expect(page.getByRole('heading',{name:'Nach dem Neustart ist das Regal leer'})).toBeVisible();
 await expect(page.locator('.academy-figure code').first()).toContainText('os.WriteFile');
 await expect(page.locator('.academy-sources a').first()).toHaveAttribute('href','https://pkg.go.dev/os');
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
 await page.locator('.academy-stage button').filter({hasText:'Ein Regal, das nicht vergisst'}).click();
 await expect(page.locator('.academy-figure code').first()).toContainText('sql.Open("sqlite"');
 await expect(page.locator('.academy-figure code').first()).toContainText('QueryRow');
 await goBand1(page);
 await expect(page.getByRole('heading',{name:'Die Pizzeria – von der Regel zum Go-Programm'})).toBeVisible();
 await page.getByRole('button',{name:'Band 1 · Die Pizzeria'}).click();
 await expect(page.getByRole('heading',{name:'Die Pizzeria – von der Regel zum Programm'})).toBeVisible();
});

test('alle vier Bände bleiben auf kleinem Display ohne horizontalen Überlauf',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await open(page);
 for(const label of ['Go · Band 1','Go · Band 2','Band 1 · Die Pizzeria','Band 2 · In Betrieb']){
  await page.getByRole('button',{name:label,exact:true}).click();
  const metrics=await page.evaluate(()=>({sw:document.body.scrollWidth,iw:window.innerWidth,
   sh:document.documentElement.scrollHeight,ih:window.innerHeight}));
  expect(metrics.sw,label).toBe(metrics.iw);
  expect(metrics.sh,label).toBe(metrics.ih);
 }
 await expect(page.locator('.academy-stage button').first()).toBeVisible();
});
