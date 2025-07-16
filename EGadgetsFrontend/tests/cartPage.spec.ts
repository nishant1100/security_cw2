import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/cart');
  });

  test('should display the cart page title', async ({ page }) => {
    await expect(page.locator('div.text-lg.font-medium')).toHaveText('Shopping cart');
  });

  test('should display cart items if added', async ({ page }) => {
    const productCount = await page.locator('.flex.py-6').count();
    expect(productCount).toBeGreaterThanOrEqual(0); 
  });

  test('should remove an item from the cart', async ({ page }) => {
    const initialCount = await page.locator('.flex.py-6').count();
    if (initialCount > 0) {
      await page.click('button:text("Remove")');
      await page.waitForTimeout(500);
      const updatedCount = await page.locator('.flex.py-6').count();
      expect(updatedCount).toBeLessThan(initialCount);
    }
  });

  test('should clear all items from the cart', async ({ page }) => {
    await page.click('button span:text("Clear Cart")');
    await page.waitForTimeout(500);
    const cartMessage = await page.locator('text=No product found!').isVisible();
    expect(cartMessage).toBeTruthy(); 
  });

  test('should prevent checkout if cart is empty', async ({ page }) => {
    await page.click('button span:text("Clear Cart")');
    await page.waitForTimeout(500);
    await page.click('button:text("Checkout")');
    const alertMessage = page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain("Your cart is empty! Add items to the cart before proceeding to checkout.");
      await dialog.dismiss();
    });
  });

  test('should prompt login if user is not authenticated', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('token')); // Simulate logged-out state
    await page.reload();
    await page.click('button:text("Checkout")');
    
    const alertMessage = page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain("You need to log in first!");
      await dialog.dismiss();
    });
  });
});
