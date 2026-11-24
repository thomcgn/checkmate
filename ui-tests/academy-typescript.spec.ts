import {test,expect,type Page} from '@playwright/test';

const open=async(page:Page):Promise<void>=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
};

test('TypeScript · Band 1 ist umschaltbar und vollständig lesbar',async({page})=>{
 await open(page);
 const band=page.getByRole('button',{name:'TypeScript · Band 1'});
 await expect(band).toHaveAttribute('aria-pressed','false');
 await band.click();
 await expect(band).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.eyebrow').filter({hasText:'TYPESCRIPT · BAND 1'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Die Pizzeria – von der Regel zum Programm'})).toBeVisible();
 await expect(page.getByText(/37 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(37);
 await expect(page.getByRole('heading',{name:'Der erste Gast'})).toBeVisible();
 await expect(page.getByText(/WENN ein Gast bestellt/)).toBeVisible();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.locator('.academy-figure code').first()).toContainText('const regnet: boolean = true');
 const toggle=page.locator('.academy-solution button');
 await toggle.click();
 await expect(page.locator('#academy-answer')).toContainText('Nass werden');
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
});

test('der Lernstand der TypeScript-Bücher hat eigene localStorage-Schlüssel',async({page})=>{
 await open(page);
 await page.getByRole('button',{name:'TypeScript · Band 1'}).click();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await page.getByRole('button',{name:'✓ Kapitel verstanden'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toHaveAttribute('aria-pressed','true');
 const storage=await page.evaluate(()=>({
  ts:localStorage.getItem('checkmate:pizzeria-typescript-book:v1'),
  java:localStorage.getItem('checkmate:pizzeria-book:v1')
 }));
 expect(storage.ts).toContain('rain-rule');
 expect(storage.java).toBeNull();

 await page.reload();
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
 await expect(page.getByRole('button',{name:'Band 1 · Die Pizzeria'})).toHaveAttribute('aria-pressed','true');
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.getByRole('button',{name:'✓ Kapitel verstanden'})).toBeVisible();
 await page.getByRole('button',{name:'TypeScript · Band 1'}).click();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toHaveAttribute('aria-pressed','true');
});

test('TypeScript · Band 2 ist umschaltbar und mit Node.js-Inhalten lesbar',async({page})=>{
 await open(page);
 const band=page.getByRole('button',{name:'TypeScript · Band 2'});
 await band.click();
 await expect(band).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.eyebrow').filter({hasText:'TYPESCRIPT · BAND 2'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Die Pizzeria geht in Betrieb'})).toBeVisible();
 await expect(page.getByText(/25 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(25);
 await expect(page.getByRole('heading',{name:'Nach dem Neustart ist das Regal leer'})).toBeVisible();
 await expect(page.locator('.academy-figure code').first()).toContainText('node:fs/promises');
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
 await page.locator('.academy-stage button').filter({hasText:'Ein Regal, das nicht vergisst'}).click();
 await expect(page.locator('.academy-figure code').first()).toContainText('node:sqlite');

 await page.getByRole('button',{name:'Band 2 · In Betrieb'}).click();
 await expect(page.getByRole('heading',{name:'Die Pizzeria geht in Betrieb'})).toBeVisible();
 await expect(page.locator('.academy-figure code').first()).toContainText('Files.writeString');
 await page.getByRole('button',{name:'TypeScript · Band 1'}).click();
 await expect(page.locator('.academy-stage button')).toHaveCount(37);
});

test('alle vier Bänder bleiben auf kleinem Display ohne Ueberlauf',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await open(page);
 const metrics=async():Promise<{sw:number;iw:number;sh:number;ih:number}>=>
  page.evaluate(()=>({sw:document.body.scrollWidth,iw:window.innerWidth,
   sh:document.documentElement.scrollHeight,ih:window.innerHeight}));
 for(const label of ['TypeScript · Band 1','TypeScript · Band 2','Band 1 · Die Pizzeria']){
  await page.getByRole('button',{name:label}).click();
  const size=await metrics();
  expect(size.sw).toBe(size.iw);
  expect(size.sh).toBe(size.ih);
 }
 await expect(page.locator('.academy-stage button').first()).toBeVisible();
});
