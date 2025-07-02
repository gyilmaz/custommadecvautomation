import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ResumeUploadPage extends BasePage {
  // Step navigation
  readonly stepper: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  
  // Step 1: Resume Selection
  readonly useCurrentResumeOption: Locator;
  readonly useSavedResumeOption: Locator;
  readonly uploadNewResumeOption: Locator;
  readonly createFromScratchOption: Locator;
  readonly uploadResumeButton: Locator;
  readonly fileInput: Locator;
  readonly savedResumeDropdown: Locator;
  readonly refreshButton: Locator;
  
  // Step 2: Job Details
  readonly companyNameInput: Locator;
  readonly jobTitleInput: Locator;
  readonly jobDescriptionTextarea: Locator;
  readonly useTrackedJobButton: Locator;
  readonly trackedJobInfo: Locator;
  
  // Step 3: ATS Keywords
  readonly runATSAnalysisButton: Locator;
  readonly atsScore: Locator;
  readonly keywordChips: Locator;
  readonly selectAllTechnicalButton: Locator;
  readonly selectAllSoftSkillsButton: Locator;
  readonly clearAllButton: Locator;
  
  // Step 4: Resume Generation
  readonly additionalInfoTextarea: Locator;
  readonly includeProjectsButton: Locator;
  readonly generateResumeButton: Locator;
  readonly progressBar: Locator;
  readonly currentStepMessage: Locator;
  
  // Step 5: Resume Ready
  readonly generatePDFButton: Locator;
  readonly downloadPDFButton: Locator;
  readonly savePDFButton: Locator;
  readonly editResumeButton: Locator;
  readonly pdfViewer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Step navigation
    this.stepper = page.locator('.resume-stepper');
    this.nextButton = page.locator('button:has-text("Next")').last();
    this.backButton = page.locator('button:has-text("Back")').last();
    
    // Step 1: Resume Selection
    this.useCurrentResumeOption = page.locator('.option-card:has-text("Use Current Resume")');
    this.useSavedResumeOption = page.locator('.option-card:has-text("Use Saved Resume Profile")');
    this.uploadNewResumeOption = page.locator('.option-card:has-text("Upload New Resume")');
    this.createFromScratchOption = page.locator('.option-card:has-text("Create From Scratch")');
    this.uploadResumeButton = page.locator('button:has-text("Upload Resume (PDF)")');
    this.fileInput = page.locator('input[type="file"]#resume');
    this.savedResumeDropdown = page.locator('.profile-selector .p-dropdown');
    this.refreshButton = page.locator('button:has-text("Refresh")');
    
    // Step 2: Job Details
    this.companyNameInput = page.locator('#companyName');
    this.jobTitleInput = page.locator('#jobTitle');
    this.jobDescriptionTextarea = page.locator('#jobDescription');
    this.useTrackedJobButton = page.locator('button:has-text("Use Tracked Job"), button:has-text("Enter Manually")');
    this.trackedJobInfo = page.locator('.tracked-job-info');
    
    // Step 3: ATS Keywords
    this.runATSAnalysisButton = page.locator('button:has-text("Run ATS Analysis")');
    this.atsScore = page.locator('.ats-score-summary h4');
    this.keywordChips = page.locator('.keyword-chip');
    this.selectAllTechnicalButton = page.locator('button:has-text("Select All Technical")');
    this.selectAllSoftSkillsButton = page.locator('button:has-text("Select All Soft Skills")');
    this.clearAllButton = page.locator('button:has-text("Clear All")');
    
    // Step 4: Resume Generation
    this.additionalInfoTextarea = page.locator('#additionalInformationToAdd');
    this.includeProjectsButton = page.locator('button:has-text("Include Projects")');
    this.generateResumeButton = page.locator('button:has-text("Generate Resume")').last();
    this.progressBar = page.locator('.progress-bar');
    this.currentStepMessage = page.locator('.current-step');
    
    // Step 5: Resume Ready
    this.generatePDFButton = page.locator('button:has-text("Generate PDF")');
    this.downloadPDFButton = page.locator('button:has-text("Download PDF")');
    this.savePDFButton = page.locator('button:has-text("Save PDF")');
    this.editResumeButton = page.locator('button:has-text("Edit Resume")');
    this.pdfViewer = page.locator('.pdf-frame');
  }

  async navigateToResumeUpload() {
    await this.page.goto('/resume-upload');
    await this.page.waitForLoadState('networkidle');
  }

  // Step 1 methods
  async selectResumeSource(source: 'current' | 'saved' | 'upload' | 'scratch') {
    switch (source) {
      case 'current':
        await this.useCurrentResumeOption.click();
        break;
      case 'saved':
        await this.useSavedResumeOption.click();
        break;
      case 'upload':
        await this.uploadNewResumeOption.click();
        break;
      case 'scratch':
        await this.createFromScratchOption.click();
        break;
    }
  }

  async uploadResumeFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(1000);
  }

  async selectSavedResume(resumeName: string) {
    await this.savedResumeDropdown.click();
    await this.page.locator(`li:has-text("${resumeName}")`).click();
  }

  async proceedToNextStep() {
    await this.nextButton.click();
    await this.page.waitForTimeout(500);
  }

  async goBackToPreviousStep() {
    await this.backButton.click();
    await this.page.waitForTimeout(500);
  }

  // Step 2 methods
  async fillJobDetails(company: string, title: string, description: string) {
    await this.companyNameInput.fill(company);
    await this.jobTitleInput.fill(title);
    await this.jobDescriptionTextarea.fill(description);
  }

  async toggleJobSource() {
    await this.useTrackedJobButton.click();
  }

  // Step 3 methods
  async runATSAnalysis() {
    await this.runATSAnalysisButton.click();
    await this.page.waitForSelector('.ats-results-section', { timeout: 30000 });
  }

  async getATSScore(): Promise<string> {
    return await this.atsScore.textContent() || '';
  }

  async selectKeyword(keyword: string) {
    await this.page.locator(`.keyword-chip:has-text("${keyword}")`).click();
  }

  async selectAllTechnicalKeywords() {
    await this.selectAllTechnicalButton.click();
  }

  async selectAllSoftSkillKeywords() {
    await this.selectAllSoftSkillsButton.click();
  }

  // Step 4 methods
  async fillAdditionalInfo(info: string) {
    await this.additionalInfoTextarea.fill(info);
  }

  async generateResume() {
    await this.generateResumeButton.click();
  }

  async waitForResumeGeneration() {
    await this.page.waitForSelector('.success-message', { timeout: 120000 });
  }

  // Step 5 methods
  async generatePDF() {
    await this.generatePDFButton.click();
    await this.page.waitForSelector('.pdf-frame', { timeout: 30000 });
  }

  async downloadPDF() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadPDFButton.click()
    ]);
    return download;
  }

  async isPDFVisible(): Promise<boolean> {
    return await this.pdfViewer.isVisible();
  }
}