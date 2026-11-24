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

test('geplante Kapitel zeigen Lernziele statt leerer Seite',async({page})=>{
 await open(page);
 await page.locator('.academy-stage button').filter({hasText:'Der Gast sieht die Antwort'}).click();
 await expect(page.getByRole('heading',{name:'Der Gast sieht die Antwort'})).toBeVisible();
 await expect(page.getByText(/Dieses Kapitel ist schon geplant/)).toBeVisible();
 await expect(page.getByText(/Du kennst den Befehl für eine Ausgabe/)).toBeVisible();
});

test('Einsteigerbuch bleibt auf kleinem Display ohne horizontalen Überlauf',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await open(page);
 const metrics=await page.evaluate(()=>({sw:document.body.scrollWidth,iw:window.innerWidth,
  sh:document.documentElement.scrollHeight,ih:window.innerHeight}));
 expect(metrics.sw).toBe(metrics.iw);
 expect(metrics.sh).toBe(metrics.ih);
 await expect(page.locator('.academy-stage button').first()).toBeVisible();
});
