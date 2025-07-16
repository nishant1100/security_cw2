import { test, expect } from '@playwright/test';

test.describe('Single Product Page', () => {
  const productId = '67c342d6071fdbd3d5efc209'; // Example product ID (you can update it based on real data)

  test.beforeEach(async ({ page }) => {
    // Navigate to the Single Product page using the example product ID
    await page.goto(`http://localhost:5173/products/${productId}`);
  });

  test('should display product title', async ({ page }) => {
    // Ensure the product title is visible on the page
    const title = await page.locator('h1');
    await expect(title).toHaveText('Bulletproof: The Mixtape');
  });



  test('should display product details: artist, description, category', async ({ page }) => {
    // Ensure artist name is visible
    const artistName = await page.locator('p:has-text("Artist: 50 cent")');
    await expect(artistName).toBeVisible();

    // Ensure the product description is visible
    const description = await page.locator('p:has-text("2006 50\'s MIXTAPE")');
    await expect(description).toBeVisible();

    // Ensure the product category is visible
    const category = await page.locator('p:has-text("Category: Mixtape")');
    await expect(category).toBeVisible();
  });

  test('should display "Add to Cart" button and handle click', async ({ page }) => {
    // Ensure the "Add to Cart" button is visible
    const addToCartButton = await page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeVisible();

    // Simulate clicking the "Add to Cart" button
    await addToCartButton.click();

    // Verify if a success message or the cart is updated (this can vary depending on your implementation)
    const cartNotification = await page.locator('text="Item added to cart"'); // Replace with actual notification if available
    await expect(cartNotification).toBeVisible();
  });
});
