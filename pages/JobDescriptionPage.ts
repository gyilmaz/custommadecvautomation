import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class JobDescriptionPage extends BasePage {
  readonly jobTitleInput: Locator;
  readonly companyNameInput: Locator;
  readonly locationInput: Locator;
  readonly jobDescriptionTextarea: Locator;
  readonly keywordsInput: Locator;
  readonly saveButton: Locator;
  readonly analyzeButton: Locator;
  readonly jobTypeSelect: Locator;
  readonly salaryRangeInput: Locator;
  readonly experienceLevelSelect: Locator;
  readonly savedJobsList: Locator;
  readonly deleteJobButton: Locator;

  constructor(page: Page) {
    super(page);
    this.jobTitleInput = page.locator('[data-testid="job-title"], input[name="jobTitle"], #jobTitle');
    this.companyNameInput = page.locator('[data-testid="company-name"], input[name="companyName"], #companyName');
    this.locationInput = page.locator('[data-testid="location"], input[name="location"], #location');
    this.jobDescriptionTextarea = page.locator('[data-testid="job-description"], textarea[name="jobDescription"], #jobDescription');
    this.keywordsInput = page.locator('[data-testid="keywords"], input[name="keywords"], #keywords');
    this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-job"]');
    this.analyzeButton = page.locator('button:has-text("Analyze"), [data-testid="analyze-job"]');
    this.jobTypeSelect = page.locator('[data-testid="job-type"], select[name="jobType"], #jobType');
    this.salaryRangeInput = page.locator('[data-testid="salary-range"], input[name="salaryRange"], #salaryRange');
    this.experienceLevelSelect = page.locator('[data-testid="experience-level"], select[name="experienceLevel"], #experienceLevel');
    this.savedJobsList = page.locator('[data-testid="saved-jobs"], .saved-jobs-list');
    this.deleteJobButton = page.locator('button:has-text("Delete"), [data-testid="delete-job"]');
  }

  async fillJobDescription(jobData: {
    title: string;
    company: string;
    location: string;
    description: string;
    keywords?: string;
  }) {
    await this.jobTitleInput.fill(jobData.title);
    await this.companyNameInput.fill(jobData.company);
    await this.locationInput.fill(jobData.location);
    await this.jobDescriptionTextarea.fill(jobData.description);
    
    if (jobData.keywords) {
      await this.keywordsInput.fill(jobData.keywords);
    }
  }

  async saveJobDescription() {
    await this.saveButton.click();
  }

  async analyzeJobDescription() {
    await this.analyzeButton.click();
  }

  async selectJobType(type: string) {
    await this.jobTypeSelect.selectOption(type);
  }

  async selectExperienceLevel(level: string) {
    await this.experienceLevelSelect.selectOption(level);
  }

  async getSavedJobsCount(): Promise<number> {
    return await this.savedJobsList.locator('.job-item').count();
  }

  async selectSavedJob(title: string) {
    await this.savedJobsList.locator(`.job-item:has-text("${title}")`).click();
  }

  async deleteJob(title: string) {
    await this.selectSavedJob(title);
    await this.deleteJobButton.click();
  }
}