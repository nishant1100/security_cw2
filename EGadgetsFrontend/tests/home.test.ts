import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Home Page
    await page.goto('http://localhost:5173'); // Adjust URL if needed
  });

  test('should display Trending Products section', async ({ page }) => {
    // Ensure the "Trending Products" section is visible
    const trendingProductsTitle = await page.locator('h2:text("Trending Products")');
    await expect(trendingProductsTitle).toBeVisible();


  });

  test('should display Recommended For You section', async ({ page }) => {
    // Ensure the "Recommended For You" section is visible
    const recommendedForYouTitle = await page.locator('h2:text("Recommended For You")');
    await expect(recommendedForYouTitle).toBeVisible();


  });

  test('should display category filter dropdown in Top Sellers section', async ({ page }) => {
    // Ensure the category filter dropdown is visible
    const categoryDropdown = await page.locator('select#category');
    await expect(categoryDropdown).toBeVisible();
  });

  test('should navigate to product details on clicking a product card', async ({ page }) => {
    // Ensure there are product cards wrapped in SwiperSlide
    const productSlides = await page.locator('.swiper-slide');
    await expect(productSlides).toHaveCount(5); // Ensure there are product slides

    // Click on the first product card and verify navigation
    const firstProductCard = productSlides.first();
    await firstProductCard.click();

    // Check if the URL contains "/products/"
    await expect(page).toHaveURL(/\/products\//);
  });

});
