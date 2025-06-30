import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class TestHelpers {
  static async waitForAnimation(page: Page, duration: number = 500): Promise<void> {
    await page.waitForTimeout(duration);
  }

  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `test.user.${timestamp}.${random}@example.com`;
  }

  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static generateRandomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomPhoneNumber(): string {
    const areaCode = this.generateRandomNumber(200, 999);
    const firstPart = this.generateRandomNumber(100, 999);
    const secondPart = this.generateRandomNumber(1000, 9999);
    return `${areaCode}-${firstPart}-${secondPart}`;
  }

  static async retryAction<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  static async scrollToBottom(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  static async scrollToTop(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  static async getLocalStorageItem(page: Page, key: string): Promise<string | null> {
    return await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, key);
  }

  static async setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key, value });
  }

  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
    });
  }

  static async getCookie(page: Page, name: string): Promise<any> {
    const cookies = await page.context().cookies();
    return cookies.find(cookie => cookie.name === name);
  }

  static async setCookie(page: Page, cookie: any): Promise<void> {
    await page.context().addCookies([cookie]);
  }

  static async clearCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async blockImages(page: Page): Promise<void> {
    await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());
  }

  static async mockAPIResponse(
    page: Page,
    url: string | RegExp,
    response: any,
    status: number = 200
  ): Promise<void> {
    await page.route(url, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  static async interceptRequest(
    page: Page,
    url: string | RegExp,
    handler: (request: any) => Promise<void>
  ): Promise<void> {
    await page.route(url, async route => {
      const request = route.request();
      await handler(request);
      await route.continue();
    });
  }

  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  static async saveTestData(filename: string, data: any): Promise<void> {
    const filePath = path.join('fixtures', 'data', filename);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  static async loadTestData(filename: string): Promise<any> {
    const filePath = path.join('fixtures', 'data', filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  static async highlightElement(page: Page, selector: string): Promise<void> {
    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).style.border = '2px solid red';
        (element as HTMLElement).style.backgroundColor = 'yellow';
      }
    }, selector);
  }

  static async removeHighlight(page: Page, selector: string): Promise<void> {
    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).style.border = '';
        (element as HTMLElement).style.backgroundColor = '';
      }
    }, selector);
  }

  static async measurePerformance(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });
  }

  static async getElementBoundingBox(page: Page, selector: string): Promise<any> {
    return await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        };
      }
      return null;
    }, selector);
  }

  static async waitForFunction(
    page: Page,
    fn: string | (() => unknown),
    timeout: number = 30000,
    polling: number = 100
  ): Promise<void> {
    await page.waitForFunction(fn, { timeout, polling });
  }

  static createTestId(prefix: string, suffix?: string): string {
    const base = prefix.toLowerCase().replace(/\s+/g, '-');
    return suffix ? `${base}-${suffix}` : base;
  }

  static async getConsoleMessages(page: Page): Promise<string[]> {
    const messages: string[] = [];
    page.on('console', msg => messages.push(msg.text()));
    return messages;
  }

  static async clearConsoleMessages(page: Page): Promise<void> {
    page.removeAllListeners('console');
  }
}