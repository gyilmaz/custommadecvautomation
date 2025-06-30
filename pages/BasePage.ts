import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async doubleClick(selector: string): Promise<void> {
    await this.page.dblclick(selector);
  }

  async rightClick(selector: string): Promise<void> {
    await this.page.click(selector, { button: 'right' });
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async type(selector: string, text: string, delay: number = 0): Promise<void> {
    if (delay > 0) {
      await this.page.type(selector, text, { delay });
    } else {
      await this.page.fill(selector, text);
    }
  }

  async selectOption(selector: string, value: string | string[]): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  async check(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  async uncheck(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async getValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.isChecked(selector);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }

  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.setInputFiles(selector, filePath);
  }

  async clearAndType(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, '');
    await this.page.fill(selector, text);
  }

  async waitAndClick(selector: string, timeout: number = 30000): Promise<void> {
    await this.waitForElement(selector, timeout);
    await this.click(selector);
  }

  async hover(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  async dragAndDrop(source: string, target: string): Promise<void> {
    await this.page.dragAndDrop(source, target);
  }

  async getCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForNavigation();
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  async acceptDialog(): Promise<void> {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async dismissDialog(): Promise<void> {
    this.page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async assertElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertElementNotVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  async assertElementEnabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled();
  }

  async assertElementDisabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled();
  }

  async assertTextContains(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  async assertValue(selector: string, value: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  async assertCount(selector: string, count: number): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(count);
  }

  async assertTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async assertUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }
}