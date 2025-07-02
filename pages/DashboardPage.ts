import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly uploadResumeButton: Locator;
  readonly createResumeButton: Locator;
  readonly myResumesSection: Locator;
  readonly addJobDescriptionButton: Locator;
  readonly resumeCards: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.uploadResumeButton = page.locator('button:has-text("Upload Resume"), [data-testid="upload-resume"]');
    this.createResumeButton = page.locator('button:has-text("Create Resume"), [data-testid="create-resume"]');
    this.myResumesSection = page.locator('[data-testid="my-resumes"], section:has-text("My Resumes")');
    this.addJobDescriptionButton = page.locator('button:has-text("Add Job Description"), [data-testid="add-job-description"]');
    this.resumeCards = page.locator('[data-testid="resume-card"], .resume-card');
    this.welcomeMessage = page.locator('[data-testid="welcome-message"], h1, h2').first();
  }

  async navigateToDashboard() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async clickUploadResume() {
    await this.uploadResumeButton.click();
  }

  async clickCreateResume() {
    await this.createResumeButton.click();
  }

  async clickAddJobDescription() {
    await this.addJobDescriptionButton.click();
  }

  async getResumeCount(): Promise<number> {
    return await this.resumeCards.count();
  }

  async selectResumeByTitle(title: string) {
    await this.resumeCards.filter({ hasText: title }).click();
  }

  async isWelcomeMessageVisible(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }
}