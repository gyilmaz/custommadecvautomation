import { test, expect } from '@playwright/test';
import { CustomMadeCVLoginPage } from '../../pages/CustomMadeCVLoginPage';
import { TestData } from '../../fixtures/TestData';

test.describe('CustomMadeCV Login Tests', () => {
  let loginPage: CustomMadeCVLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new CustomMadeCVLoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should display login page elements', async ({ page }) => {
    await expect(loginPage.welcomeMessage).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.googleButton).toBeVisible();
    await expect(loginPage.facebookButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signUpLink).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const { email, password } = TestData.users.validUser;
    
    await loginPage.login(email, password);
    await loginPage.waitForLoginSuccess();
    
    // Should redirect to resume page
    await expect(page).toHaveURL(/.*\/resume/);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@email.com', 'wrongpassword');
    
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Invalid email or password');
  });

  test('should show error with empty email', async ({ page }) => {
    await loginPage.passwordInput.fill('password123');
    await loginPage.loginButton.click();
    
    // Check for HTML5 validation or error message
    const emailValidity = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValidity).toBe(false);
  });

  test('should show error with empty password', async ({ page }) => {
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.loginButton.click();
    
    // Check for HTML5 validation or error message
    const passwordValidity = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(passwordValidity).toBe(false);
  });

  test('should navigate to sign up page', async ({ page }) => {
    await loginPage.clickSignUp();
    await expect(page).toHaveURL(/.*\/signup/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/.*\/forgot-password/);
  });

  test('should maintain email value after failed login attempt', async ({ page }) => {
    const testEmail = 'test@example.com';
    await loginPage.login(testEmail, 'wrongpassword');
    
    // Wait for error
    await expect(loginPage.errorMessage).toBeVisible();
    
    // Email should still be in the input
    const emailValue = await loginPage.emailInput.inputValue();
    expect(emailValue).toBe(testEmail);
  });
});