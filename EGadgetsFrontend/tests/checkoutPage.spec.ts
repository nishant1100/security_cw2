import { test, expect } from '@playwright/test';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Checkout Page
    await page.goto('http://localhost:5173/checkout'); // Adjust URL if needed
  });

  test('should display the total price and cart items', async ({ page }) => {
    // Ensure the total price is displayed
    const totalPriceText = await page.locator('p.text-gray-500.mb-2').textContent();
    expect(totalPriceText).toContain('Total Price: Rs.'); // Ensure total price is displayed

    // Ensure the number of items in the cart is displayed
    const itemsCountText = await page.locator('p.text-gray-500.mb-6').textContent();
    expect(itemsCountText).toContain('Items:'); // Ensure items count is displayed
  });


  test('should disable the button during form submission', async ({ page }) => {
    // Fill out the checkout form
    await page.fill('input#name', 'John Doe');
    await page.fill('input#email', 'johndoe@example.com');
    await page.fill('input#phone', '1234567890');
    await page.fill('input#city', 'Kathmandu');
    await page.fill('input#state', 'Bagmati');
    await page.fill('input#country', 'Nepal');
    await page.fill('input#zipcode', '44600');

    // Click the place order button and ensure it is disabled while submitting
    const placeOrderButton = page.locator('button[type="submit"]');
    await placeOrderButton.click();
    await expect(placeOrderButton).toHaveText('Placing Order...'); // Ensure text changes to "Placing Order..."
    await expect(placeOrderButton).toBeDisabled(); // Ensure the button is disabled
  });

  test('should show validation errors for required fields', async ({ page }) => {
    // Click on the submit button without filling out the form
    const placeOrderButton = page.locator('button[type="submit"]');
    await placeOrderButton.click();

    // Ensure validation errors are shown for required fields
    const nameError = await page.locator('p.text-red-500.text-xs').nth(0).textContent();
    expect(nameError).toBe('Full Name is required');

    const emailError = await page.locator('p.text-red-500.text-xs').nth(1).textContent();
    expect(emailError).toBe('Email is required');

    const phoneError = await page.locator('p.text-red-500.text-xs').nth(2).textContent();
    expect(phoneError).toBe('Phone Number is required');
  });
});
