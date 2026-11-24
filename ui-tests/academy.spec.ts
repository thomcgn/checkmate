import {test,expect,type Page} from '@playwright/test';

const open=async(page:Page):Promise<void>=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
};

test('Einsteigerbuch: Fahrplan, Alltagsregel und erste Lektion',async({page})=>{
 await open(page);
 await expect(page.getByRole('heading',{name:'Die Pizzeria – von der Regel zum Programm'})).toBeVisible();
 await expect(page.getByText(/37 Kapitel/)).toBeVisible();
 const chapters=page.locator('.academy-stage button');
 await expect(chapters).toHaveCount(37);
 await expect(page.getByRole('heading',{name:'Der erste Gast'})).toBeVisible();
 await expect(page.getByText(/WENN ein Gast bestellt/)).toBeVisible();
 await expect(page.getByText(/Mia kommt in deine Pizzeria/)).toBeVisible();
});

test('WENN-DANN-SONST-Lektion mit Code, Lösung und Lernstand',async({page})=>{
 await open(page);
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.getByRole('heading',{name:'WENN es regnet, DANN Schirm'})).toBeVisible();
 await expect(page.locator('.academy-figure code').first()).toContainText('boolean regnet = true');
 await expect(page.locator('.academy-natural-rule')).toContainText('WENN es regnet');
 const toggle=page.locator('.academy-solution button');
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await toggle.click();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('#academy-answer')).toContainText('Nass werden');

 const understood=page.getByRole('button',{name:'✓ Kapitel verstanden'});
 await understood.click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toHaveAttribute('aria-pressed','true');
 await page.reload();
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toHaveAttribute('aria-pressed','true');
});

test('auch später Kapitel sind vollständig mit Code und Übung geschrieben',async({page})=>{
 await open(page);
 await page.locator('.academy-stage button').filter({hasText:'Der Gast sieht die Antwort'}).click();
 await expect(page.getByRole('heading',{name:'Der Gast sieht die Antwort'})).toBeVisible();
 await expect(page.locator('.academy-figure code').first()).toContainText('Willkommen in der Pizzeria');
 await expect(page.getByText(/Probier's selbst!/)).toBeVisible();
 await expect(page.getByText(/Ohne Anführungszeichen/)).toBeVisible();
});

test('Band 2 ist umschaltbar und vollständig lesbar',async({page})=>{
 await open(page);
 const band2=page.getByRole('button',{name:'Band 2 · In Betrieb'});
 await expect(band2).toHaveAttribute('aria-pressed','false');
 await band2.click();
 await expect(band2).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('heading',{name:'Die Pizzeria geht in Betrieb'})).toBeVisible();
 await expect(page.getByText(/25 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(25);
 await expect(page.getByRole('heading',{name:'Nach dem Neustart ist das Regal leer'})).toBeVisible();
 await expect(page.getByText(/WENN Daten auch morgen noch da sein sollen/)).toBeVisible();
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
 await page.getByRole('button',{name:'Band 1 · Die Pizzeria'}).click();
 await expect(page.getByRole('heading',{name:'Die Pizzeria – von der Regel zum Programm'})).toBeVisible();
});

test('Einsteigerbuch bleibt auf kleinem Display ohne horizontalen Überlauf',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await open(page);
 const metrics=await page.evaluate(()=>({sw:document.body.scrollWidth,iw:window.innerWidth,
  sh:document.documentElement.scrollHeight,ih:window.innerHeight}));
 expect(metrics.sw).toBe(metrics.iw);
 expect(metrics.sh).toBe(metrics.ih);
 await expect(page.locator('.academy-stage button').first()).toBeVisible();
 await page.getByRole('button',{name:'Band 2 · In Betrieb'}).click();
 const band2=await page.evaluate(()=>({sw:document.body.scrollWidth,iw:window.innerWidth,
  sh:document.documentElement.scrollHeight,ih:window.innerHeight}));
 expect(band2.sw).toBe(band2.iw);
 expect(band2.sh).toBe(band2.ih);
});
