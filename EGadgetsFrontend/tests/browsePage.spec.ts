import { test, expect } from '@playwright/test';

test.describe('Browse Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/browse'); 
  });

  test('should display the browse page title', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Browse Products');
  });

  test('should filter products by category', async ({ page }) => {
    await page.selectOption('#category', 'Album');
    await page.waitForTimeout(500); 

    const products = await page.locator('.product-card-container').count();
    expect(products).toBeGreaterThan(0); 
  });

  test('should sort products by price (low to high)', async ({ page }) => {
    await page.selectOption('#sort', 'price-low-high');
    await page.waitForTimeout(500);

    const prices = await page.$$eval('.product-card-container', cards =>
      cards.map(card => parseFloat(card.querySelector('.price')?.textContent?.replace('$', '') || '0'))
    );

    expect(prices).toEqual([...prices].sort((a, b) => a - b)); 
  });

  test('should sort products by price (high to low)', async ({ page }) => {
    await page.selectOption('#sort', 'price-high-low');
    await page.waitForTimeout(500);

    const prices = await page.$$eval('.product-card-container', cards =>
      cards.map(card => parseFloat(card.querySelector('.price')?.textContent?.replace('$', '') || '0'))
    );

    expect(prices).toEqual([...prices].sort((a, b) => b - a)); 
  });

  test('should clear filters and show all products', async ({ page }) => {
    await page.click('button:has-text("Clear Filters")');
    await page.waitForTimeout(500);

    const products = await page.locator('.product-card-container').count();
    expect(products).toBeGreaterThan(0); 
  });
});
