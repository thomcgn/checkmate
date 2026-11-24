import {test,expect,type Page} from '@playwright/test';

const open=async(page:Page):Promise<void>=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
};

test('Rust-Band 1 ist umschaltbar, vollständig und nutzt echten Rust-Code',async({page})=>{
 await open(page);
 const rust1=page.getByRole('button',{name:'Rust · Band 1'});
 await expect(rust1).toHaveAttribute('aria-pressed','false');
 await rust1.click();
 await expect(rust1).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('heading',{name:'Die Pizzeria – Regeln in Rust übersetzt'})).toBeVisible();
 await expect(page.getByText(/37 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(37);
 await expect(page.getByRole('heading',{name:'Der erste Gast'})).toBeVisible();
 await expect(page.getByText(/Mia kommt in deine Pizzeria/)).toBeVisible();
 await expect(page.locator('.academy-stage button').filter({hasText:' geplant'})).toHaveCount(0);
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.locator('.academy-figure code').first()).toContainText('if regnet {');
 await expect(page.locator('.academy-natural-rule')).toContainText('WENN es regnet');
 const toggle=page.locator('.academy-solution button');
 await toggle.click();
 await expect(page.locator('#academy-answer')).toContainText('Nass werden');
});

test('Rust-Band 2 zeigt den Axum-/SQLite-Stack statt Spring',async({page})=>{
 await open(page);
 const rust2=page.getByRole('button',{name:'Rust · Band 2'});
 await rust2.click();
 await expect(rust2).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('heading',{name:'Die Pizzeria geht in Betrieb – mit Rust'})).toBeVisible();
 await expect(page.getByText(/25 Kapitel/)).toBeVisible();
 await expect(page.locator('.academy-stage button')).toHaveCount(25);
 await expect(page.getByRole('heading',{name:'Nach dem Neustart ist das Regal leer'})).toBeVisible();
 await expect(page.locator('.academy-figure code').first()).toContainText('fs::write("bestand.txt"');
 await expect(page.getByText(/Dieses Kapitel ist geplant/)).toHaveCount(0);
 await page.locator('.academy-stage button').filter({hasText:'Ein Regal, das nicht vergisst'}).click();
 await expect(page.locator('.academy-figure code').first()).toContainText('Connection::open');
 await expect(page.locator('.academy-figure code').first()).not.toContainText('jdbc:');
});

test('die vier Bände teilen den Lernstand nicht und bleiben nach Reload erhalten',async({page})=>{
 await open(page);
 await page.getByRole('button',{name:'Band 1 · Die Pizzeria'}).click();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await page.getByRole('button',{name:'✓ Kapitel verstanden'}).click();
 await expect(page.getByText(/1 als verstanden markiert/)).toBeVisible();

 await page.getByRole('button',{name:'Rust · Band 1'}).click();
 await expect(page.getByText(/0 als verstanden markiert/)).toBeVisible();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await page.getByRole('button',{name:'✓ Kapitel verstanden'}).click();
 await expect(page.getByText(/1 als verstanden markiert/)).toBeVisible();

 await page.getByRole('button',{name:'Rust · Band 2'}).click();
 await expect(page.getByText(/0 als verstanden markiert/)).toBeVisible();
 await page.getByRole('button',{name:'Rust · Band 1'}).click();
 await expect(page.getByText(/1 als verstanden markiert/)).toBeVisible();

 await page.reload();
 await page.getByRole('button',{name:'Einsteigerbuch'}).click();
 await page.getByRole('button',{name:'Rust · Band 1'}).click();
 await expect(page.getByText(/1 als verstanden markiert/)).toBeVisible();
 await page.getByRole('button',{name:'Band 1 · Die Pizzeria'}).click();
 await expect(page.getByText(/1 als verstanden markiert/)).toBeVisible();
 await page.getByRole('button',{name:'Rust · Band 1'}).click();
 await page.locator('.academy-stage button').filter({hasText:'WENN es regnet'}).click();
 await expect(page.getByRole('button',{name:'✓ Verstanden – zurücksetzen'})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.academy-figure code').first()).toContainText('let regnet = true');
});

test('Rust-Bände bleiben auf kleinem Display ohne horizontalen Überlauf',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await open(page);
 for(const name of ['Rust · Band 1','Rust · Band 2']){
  await page.getByRole('button',{name}).click();
  const metrics=await page.evaluate(()=>({sw:document.body.scrollWidth,iw:window.innerWidth,
   sh:document.documentElement.scrollHeight,ih:window.innerHeight}));
  expect(metrics.sw).toBe(metrics.iw);
  expect(metrics.sh).toBe(metrics.ih);
  await expect(page.locator('.academy-stage button').first()).toBeVisible();
 }
});
