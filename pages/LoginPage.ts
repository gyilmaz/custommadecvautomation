import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestData } from '../fixtures/TestData';

export class LoginPage extends BasePage {
  private readonly emailInput = TestData.selectors.forms.emailInput;
  private readonly passwordInput = TestData.selectors.forms.passwordInput;
  private readonly submitButton = TestData.selectors.common.submitButton;
  private readonly errorMessage = TestData.selectors.common.errorMessage;
  private readonly loader = TestData.selectors.common.loader;

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async fillEmail(email: string): Promise<void> {
    await this.clearAndType(this.emailInput, email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.clearAndType(this.passwordInput, password);
  }

  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }

  async waitForLoginToComplete(): Promise<void> {
    await this.page.waitForSelector(this.loader, { state: 'hidden' });
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async loginWithValidCredentials(): Promise<void> {
    const { email, password } = TestData.users.validUser;
    await this.login(email, password);
    await this.waitForLoginToComplete();
  }

  async assertLoginSuccess(): Promise<void> {
    await this.assertUrl(/dashboard|home/);
  }

  async assertLoginError(expectedError: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
    await this.assertTextContains(this.errorMessage, expectedError);
  }

  async clearForm(): Promise<void> {
    await this.fill(this.emailInput, '');
    await this.fill(this.passwordInput, '');
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.submitButton);
  }

  async waitForFormValidation(): Promise<void> {
    await this.waitForTimeout(500);
  }
}