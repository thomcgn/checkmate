import {test,expect,type Page} from '@playwright/test';

async function expectNoOverflow(page:Page,width:number,height:number):Promise<void>{
 await page.setViewportSize({width,height});
 const metrics=await page.evaluate(()=>({
  horizontal:document.body.scrollWidth>window.innerWidth,
  vertical:document.documentElement.scrollHeight>window.innerHeight+1
 }));
 expect(metrics.horizontal,`horizontaler Überlauf bei ${width}×${height}`).toBe(false);
 expect(metrics.vertical,`Seiten-Scrollen bei ${width}×${height}`).toBe(false);
}

test('barrierefreie Navigation: Sprungmarke, Landmarks, Zustände und Tastatur-Reiter',async({page})=>{
 await page.goto('/');
 await expect(page.locator('main#main-content')).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Hauptnavigation'})).toBeVisible();
 const skip=page.getByRole('link',{name:'Zum Hauptinhalt springen'});
 await page.keyboard.press('Tab');
 await expect(skip).toBeFocused();
 await expect(skip).toBeVisible();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#main-content$/);
 await expect(page.getByRole('navigation',{name:'Hauptnavigation'}).getByRole('button',{name:'Konzeptbibliothek'})).toHaveAttribute('aria-current','page');
 await expect(page.getByRole('navigation',{name:'Hauptnavigation'}).getByRole('button',{name:'Lehrbücher'})).not.toHaveAttribute('aria-current');
 await expect(page).toHaveTitle(/Konzeptbibliothek/);

 const tabs=page.getByRole('tab');
 await expect(tabs).toHaveCount(3);
 const textbook=page.getByRole('tab',{name:/Lehrbuchkapitel/});
 const compare=page.getByRole('tab',{name:/Sprachvergleich/});
 await expect(textbook).toHaveAttribute('aria-selected','true');
 await expect(compare).toHaveAttribute('aria-selected','false');
 await textbook.focus();
 await page.keyboard.press('ArrowRight');
 await expect(compare).toBeFocused();
 await expect(compare).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby','cm-tab-compare');
 await page.keyboard.press('Home');
 await expect(textbook).toHaveAttribute('aria-selected','true');

 const toggle=page.locator('.textbook-question button').first();
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await toggle.click();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('[id^="textbook-answer-"]').first()).toBeVisible();

 const size=await page.getByRole('navigation',{name:'Hauptnavigation'}).getByRole('button',{name:'Lehrbücher'}).boundingBox();
 expect(size?.height).toBeGreaterThanOrEqual(44);
 expect(size?.width).toBeGreaterThanOrEqual(44);
 await page.getByRole('button',{name:'Lehrbücher'}).click();
 await expect(page).toHaveTitle(/Lehrbücher/);
});

test('Lehrbuchbereich: Tastatur-Scrollen, Zustände und klare Beschriftung',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Lehrbücher'}).click();
 const toc=page.locator('.published-toc-items');
 const article=page.locator('.published-article');
 await expect(toc).toHaveAttribute('tabindex','0');
 await expect(article).toHaveAttribute('tabindex','0');
 const scrollbars=await page.evaluate(()=>[getComputedStyle(document.querySelector('.published-toc-items')!).scrollbarWidth,
  getComputedStyle(document.querySelector('.published-article')!).scrollbarWidth]);
 expect(scrollbars.every(value=>value==='none')).toBe(true);
 await toc.focus();
 await expect(toc).toBeFocused();
 const answer=page.locator('.published-question button').first();
 await expect(answer).toHaveAttribute('aria-expanded','false');
 await answer.click();
 await expect(answer).toHaveAttribute('aria-expanded','true');
 const read=page.getByRole('button',{name:/Kapitel verstanden/}).first();
 await expect(read).toHaveAttribute('aria-pressed','false');
 await read.click();
 await expect(page.getByRole('button',{name:/Als noch offen markieren/}).first()).toHaveAttribute('aria-pressed','true');
 await expect(page.getByLabel('Buchkapitel suchen')).toBeVisible();
});

test('Responsives Reflow ohne horizontalen Überlauf und mit erreichbarer Navigation',async({page})=>{
 await page.goto('/');
 for(const [width,height] of [[1024,650],[768,700],[390,844],[320,568]]){
  await expectNoOverflow(page,width,height);
  await expect(page.getByRole('navigation',{name:'Hauptnavigation'}).getByRole('button',{name:'Lehrbücher'})).toBeVisible();
 }
 await page.setViewportSize({width:390,height:844});
 const disclosure=page.getByRole('button',{name:'Themen filter'}).or(page.locator('.sidebar-themes summary'));
 await expect(disclosure.first()).toBeVisible();
 await disclosure.first().click();
 await expect(page.getByRole('button',{name:/Alle Konzepte/})).toBeVisible();
 await expectNoOverflow(page,390,844);
});

test('Reduzierte Bewegung wird respektiert',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 const duration=await page.evaluate(()=>getComputedStyle(document.querySelector('.cm-skip-link')!).transitionDuration);
 expect(Number.parseFloat(duration)).toBeLessThan(0.001);
});
