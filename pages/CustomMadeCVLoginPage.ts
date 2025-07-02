import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomMadeCVLoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly signUpLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly googleButton: Locator;
  readonly facebookButton: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.signUpLink = page.locator('button.p-button-link:has-text("Create Account")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot password")');
    this.errorMessage = page.locator('.error-message');
    this.googleButton = page.locator('.google-btn');
    this.facebookButton = page.locator('.facebook-btn');
    this.welcomeMessage = page.locator('h2:has-text("Welcome Back")');
  }

  async navigateToLogin() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithGoogle() {
    await this.googleButton.click();
  }

  async loginWithFacebook() {
    await this.facebookButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isLoginPageVisible(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async waitForLoginSuccess() {
    await this.page.waitForURL('**/resume', { timeout: 30000 });
  }

  async goto() {
    await this.navigateToLogin();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.loginButton.click();
  }

  async waitForLoginToComplete() {
    await this.page.waitForLoadState('networkidle');
  }

  async assertLoginSuccess() {
    await this.page.waitForURL('**/resume', { timeout: 30000 });
  }

  async assertLoginError(expectedMessage: string) {
    await this.errorMessage.waitFor({ state: 'visible' });
    const errorText = await this.getErrorMessage();
    if (errorText !== expectedMessage) {
      throw new Error(`Expected error message '${expectedMessage}' but got '${errorText}'`);
    }
  }

  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async waitForFormValidation() {
    await this.page.waitForTimeout(500);
  }

  async loginWithValidCredentials() {
    const validUser = {
      email: 'pwrighttest@playwrighttest.com',
      password: 'BNB,m#%B6=d]m+#'
    };
    await this.login(validUser.email, validUser.password);
    await this.waitForLoginSuccess();
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }
}