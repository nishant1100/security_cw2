import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  const apiUrl = 'http://localhost:3000/api/auth/register'; // Replace with your API endpoint for registration

  test.beforeEach(async ({ page }) => {
    // Navigate to the Register page
    await page.goto('http://localhost:5173/register'); // Adjust the URL if necessary
  });

  test('should render register form', async ({ page }) => {
    // Ensure the register form is visible
    await expect(page.locator('form')).toBeVisible();

    // Check for username, email, password fields, bio field, and the submit button
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('textarea[name="bio"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  
  test('should successfully register and show success message', async ({ page }) => {
    // Mock the register API response for a successful registration
    await page.route(apiUrl, (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Registration successful. Please check your email for verification before logging in.' }),
      })
    );

    // Fill in the form with valid data
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'validPassword123');
    await page.fill('textarea[name="bio"]', 'This is a test bio.');

    // Submit the form
    await page.click('button[type="submit"]');

    // Ensure the success message is visible
    const successMessage = await page.locator('p.text-green-500');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText('Registration successful. Please check your email for verification before logging in.');

    // Ensure the submit button is disabled and shows "Check Email"
    const submitButton = await page.locator('button[type="submit"]');
    await expect(submitButton).toHaveText('Check Email');
    await expect(submitButton).toBeDisabled();
  });

  test('should disable the submit button after successful registration', async ({ page }) => {
    // Mock the register API response for a successful registration
    await page.route(apiUrl, (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Registration successful.' }),
      })
    );

    // Fill in the form with valid data
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'validPassword123');
    await page.fill('textarea[name="bio"]', 'This is a test bio.');

    // Submit the form
    await page.click('button[type="submit"]');

    // Ensure the submit button is disabled after submission
    const submitButton = await page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should show success message and stay on the registration page after successful registration', async ({ page }) => {
    // Mock the register API response for successful registration
    await page.route(apiUrl, (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Registration successful' }), // Mock successful response
      })
    );

    // Fill in the registration form
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('textarea[name="bio"]', 'This is a bio.');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check if the success message is visible
    const successMessage = await page.locator('p.text-green-500');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText(
      'Registration successful. Please check your email for verification before logging in.'
    );

    // Ensure that the user stays on the registration page and is not redirected
    await expect(page).toHaveURL('http://localhost:5173/register'); // Adjust URL if necessary
  });
});
