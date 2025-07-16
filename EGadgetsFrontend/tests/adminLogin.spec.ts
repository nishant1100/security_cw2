import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  
  test.beforeEach(async ({ page }) => {
    // Visit the admin login page before each test
    await page.goto('http://localhost:5173/admin');
  });

  test('should display the admin login form', async ({ page }) => {
    // Check if the page has the correct title
    await expect(page).toHaveTitle('SonicSummit');
    
    // Ensure the form elements are present
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    console.log(await submitButton.isVisible());  // Debugging line
  });


  test('should navigate to dashboard on successful login', async ({ page }) => {
    // Mock the successful response (adjust accordingly based on your mock setup)
    await page.route('**/api/admin/admin', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          token: 'mock-token',
        }),
      });
    });

    // Fill out the form with valid credentials
    await page.fill('input#username', 'validUsername');
    await page.fill('input#password', 'validPassword');
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Wait for navigation to the dashboard page
    await expect(page).toHaveURL('http://localhost:5173/dashboard');
  });

//   test('should show error message for invalid credentials', async ({ page }) => {
//     // Fill out the form with invalid data
//     await page.fill('input#username', 'invalidUsername');
//     await page.fill('input#password', 'invalidPassword');
    
//     // Submit the form
//     const submitButton = page.locator('button[type="submit"]');
//     await expect(submitButton).toBeVisible();
//     await submitButton.click();
    
//     // Check for error message
//     await expect(page.locator('p.text-red-500')).toBeVisible();
//     await expect(page.locator('p.text-red-500')).toHaveText('Please provide a valid email and password');
//   });

});
