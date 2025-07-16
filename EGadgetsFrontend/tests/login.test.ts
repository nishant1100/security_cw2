import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  const apiUrl = 'http://localhost:3000/api/auth/login'; // Replace with your API endpoint for login

  test.beforeEach(async ({ page }) => {
    // Navigate to the Login page
    await page.goto('http://localhost:5173/login'); // Adjust the URL if necessary
  });

  test('should render login form', async ({ page }) => {
    // Ensure the login form is visible
    await expect(page.locator('form')).toBeVisible();
    
    // Check for username and password fields
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    // Check for the login button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error message for incorrect credentials', async ({ page }) => {
    // Fill in the form with incorrect credentials
    await page.fill('input[name="username"]', 'invalidUser');
    await page.fill('input[name="password"]', 'wrongPassword');

    // Submit the form
    await page.click('button[type="submit"]');

    // Ensure the error message is visible
    const errorMessage = await page.locator('p.text-red-500');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid username or password'); // Adjust according to your API error response
  });

  test('should successfully log in and navigate to home', async ({ page }) => {
    // Mock the login API response for successful login
    await page.route(apiUrl, (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'mockToken' }), // Mock token
      })
    );

    // Fill in the form with valid credentials
    await page.fill('input[name="username"]', 'validUser');
    await page.fill('input[name="password"]', 'correctPassword');

    // Submit the form
    await page.click('button[type="submit"]');

    // Ensure redirection to the homepage
    await expect(page).toHaveURL('http://localhost:5173/'); // Adjust URL if necessary

    // Verify token is stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('mockToken'); // Ensure token is set
  });
});
