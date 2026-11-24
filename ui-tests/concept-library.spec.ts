import {test,expect,type Page} from '@playwright/test';

const entry=(page:Page)=>page.locator('.concept-entry').filter({hasText:'Besitz & Lebensdauer'});

test('erweiterte Konzeptbibliothek: Sprachfilter, Volltextsuche und Lehrbuchvertiefung',async({page})=>{
 await page.goto('/');
 const count=page.locator('.result-count');
 await expect(count).toContainText('17 Konzepte');

 const language=page.getByRole('combobox',{name:'Sprache filtern'});
 await language.selectOption('php');
 await expect(count).not.toContainText('17 Konzepte');
 await language.selectOption('all');
 await page.getByRole('textbox',{name:'Konzept suchen'}).fill('borrow-checker');
 await expect(entry(page)).toBeVisible();
 await entry(page).click();

 await expect(page.getByRole('heading',{name:'Begriffe auf einen Blick'})).toBeVisible();
 await expect(page.locator('.textbook-glossary dt').first()).toHaveText('Besitz');
 await expect(page.getByText('Quellen & Vertiefung in den Offline-Handbüchern')).toBeVisible();
 await expect(page.getByRole('region',{name:'Verwandte Konzepte'})).toBeVisible();

 const understood=page.getByRole('button',{name:'✓ Kapitel verstanden'});
 await expect(understood).toHaveAttribute('aria-pressed','false');
 await understood.click();
 await expect(page.getByRole('button',{name:'✓ Als offen markieren'})).toHaveAttribute('aria-pressed','true');

 await page.getByRole('tab',{name:/Sprachvergleich/}).click();
 await expect(page.getByRole('heading',{name:/Sprachprofil/})).toBeVisible();
 await expect(page.getByText(/Bewährte Regeln aus der Dokumentation/)).toBeVisible();
});

test('verwandte Konzepte navigieren innerhalb der Bibliothek',async({page})=>{
 await page.goto('/');
 await page.getByRole('textbox',{name:'Konzept suchen'}).fill('ownership');
 await entry(page).click();
 const related=page.getByRole('region',{name:'Verwandte Konzepte'});
 await expect(related).toBeVisible();
 await related.getByRole('button').first().click();
 await expect(page.getByRole('heading',{name:/README|Records|Asynchronität|Closures/}).first()).toBeVisible();
});
