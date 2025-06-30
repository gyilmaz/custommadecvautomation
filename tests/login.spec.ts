import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestData } from '../fixtures/TestData';
import { TestHelpers } from '../fixtures/TestHelpers';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page elements', async ({ page }) => {
    await expect(page.locator(TestData.selectors.forms.emailInput)).toBeVisible();
    await expect(page.locator(TestData.selectors.forms.passwordInput)).toBeVisible();
    await expect(page.locator(TestData.selectors.common.submitButton)).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const { email, password } = TestData.users.validUser;
    
    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
    await loginPage.clickSubmit();
    
    await loginPage.waitForLoginToComplete();
    await loginPage.assertLoginSuccess();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.fillEmail('invalid@email.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickSubmit();
    
    await loginPage.assertLoginError(TestData.messages.error.invalidCredentials);
  });

  test('should validate required fields', async ({ page }) => {
    await loginPage.clickSubmit();
    
    await expect(page.locator(TestData.selectors.forms.emailInput))
      .toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(TestData.selectors.forms.passwordInput))
      .toHaveAttribute('aria-invalid', 'true');
  });

  test('should validate email format', async ({ page }) => {
    const invalidEmails = ['invalid', 'test@', '@test.com', 'test@test'];
    
    for (const email of invalidEmails) {
      await loginPage.clearForm();
      await loginPage.fillEmail(email);
      await loginPage.fillPassword('validPassword123');
      await loginPage.clickSubmit();
      
      await loginPage.waitForFormValidation();
      const isErrorVisible = await loginPage.isErrorMessageVisible();
      expect(isErrorVisible).toBeTruthy();
    }
  });

  test('should remember user after login', async ({ page, context }) => {
    await loginPage.loginWithValidCredentials();
    
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.secure).toBe(true);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/auth/login', route => route.abort());
    
    await loginPage.fillEmail(TestData.users.validUser.email);
    await loginPage.fillPassword(TestData.users.validUser.password);
    await loginPage.clickSubmit();
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(TestData.messages.error.networkError);
  });

  test('should disable submit button during login', async ({ page }) => {
    await loginPage.fillEmail(TestData.users.validUser.email);
    await loginPage.fillPassword(TestData.users.validUser.password);
    
    const submitButtonEnabled = await loginPage.isSubmitButtonEnabled();
    expect(submitButtonEnabled).toBe(true);
    
    await loginPage.clickSubmit();
    
    const submitButtonEnabledDuringLogin = await loginPage.isSubmitButtonEnabled();
    expect(submitButtonEnabledDuringLogin).toBe(false);
  });

  test('should redirect to requested page after login', async ({ page }) => {
    const returnUrl = '/products/special-offer';
    await page.goto(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    
    await loginPage.loginWithValidCredentials();
    
    await expect(page).toHaveURL(returnUrl);
  });

  test('should clear error messages on input change', async ({ page }) => {
    await loginPage.fillEmail('invalid@email.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickSubmit();
    
    await loginPage.assertLoginError(TestData.messages.error.invalidCredentials);
    
    await loginPage.fillEmail('new@email.com');
    
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(false);
  });
});

test.describe('Login Page - Accessibility Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await expect(page.locator(TestData.selectors.forms.emailInput))
      .toHaveAttribute('aria-label', /email/i);
    await expect(page.locator(TestData.selectors.forms.passwordInput))
      .toHaveAttribute('aria-label', /password/i);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator(TestData.selectors.forms.emailInput)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(TestData.selectors.forms.passwordInput)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(TestData.selectors.common.submitButton)).toBeFocused();
  });

  test('should announce errors to screen readers', async ({ page }) => {
    await loginPage.clickSubmit();
    
    const errorElement = page.locator(TestData.selectors.common.errorMessage);
    await expect(errorElement).toHaveAttribute('role', 'alert');
    await expect(errorElement).toHaveAttribute('aria-live', 'polite');
  });
});

test.describe('Login Page - Performance Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.goto();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good performance metrics', async ({ page }) => {
    await loginPage.goto();
    const metrics = await TestHelpers.measurePerformance(page);
    
    expect(metrics.domContentLoaded).toBeLessThan(1000);
    expect(metrics.pageLoadTime).toBeLessThan(2000);
  });
});