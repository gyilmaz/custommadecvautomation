import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class JobTrackerPage extends BasePage {
  // Table elements
  readonly jobTable: Locator;
  readonly tableRows: Locator;
  readonly companyHeader: Locator;
  readonly positionHeader: Locator;
  readonly statusHeader: Locator;
  readonly dateHeader: Locator;
  
  // Search and filter
  readonly companySearchInput: Locator;
  readonly positionSearchInput: Locator;
  readonly statusFilter: Locator;
  
  // Add job form
  readonly addJobButton: Locator;
  readonly companyNameInput: Locator;
  readonly positionInput: Locator;
  readonly jobUrlInput: Locator;
  readonly dateAppliedInput: Locator;
  readonly statusDropdown: Locator;
  readonly jobDescriptionTextarea: Locator;
  readonly notesTextarea: Locator;
  readonly saveJobButton: Locator;
  readonly cancelButton: Locator;
  
  // Edit/Delete actions
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;
  
  // Pagination
  readonly paginationControls: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly pageInfo: Locator;

  constructor(page: Page) {
    super(page);
    
    // Table elements
    this.jobTable = page.locator('.job-tracker-table, table');
    this.tableRows = page.locator('tbody tr');
    this.companyHeader = page.locator('th:has-text("Company")');
    this.positionHeader = page.locator('th:has-text("Position")');
    this.statusHeader = page.locator('th:has-text("Status")');
    this.dateHeader = page.locator('th:has-text("Date")');
    
    // Search and filter
    this.companySearchInput = page.locator('input[placeholder*="Search by company"]');
    this.positionSearchInput = page.locator('input[placeholder*="Search by position"]');
    this.statusFilter = page.locator('.status-filter select, .p-dropdown.status-filter');
    
    // Add job form
    this.addJobButton = page.locator('button:has-text("Add Job"), button:has-text("Add Application")');
    this.companyNameInput = page.locator('input[placeholder*="company name"]');
    this.positionInput = page.locator('input[placeholder*="position"]');
    this.jobUrlInput = page.locator('input[placeholder*="Job posting URL"]');
    this.dateAppliedInput = page.locator('input[type="date"]');
    this.statusDropdown = page.locator('select[name="status"], .status-dropdown');
    this.jobDescriptionTextarea = page.locator('textarea[placeholder*="job description"]');
    this.notesTextarea = page.locator('textarea[placeholder*="notes"]');
    this.saveJobButton = page.locator('button:has-text("Save"), button:has-text("Add")').last();
    this.cancelButton = page.locator('button:has-text("Cancel")');
    
    // Edit/Delete actions
    this.editButton = page.locator('button:has-text("Edit")');
    this.deleteButton = page.locator('button:has-text("Delete")');
    this.confirmDeleteButton = page.locator('button:has-text("Yes"), button:has-text("Confirm")').last();
    
    // Pagination
    this.paginationControls = page.locator('.pagination-controls, .p-paginator');
    this.nextPageButton = page.locator('button:has-text("Next"), .p-paginator-next');
    this.previousPageButton = page.locator('button:has-text("Previous"), .p-paginator-prev');
    this.pageInfo = page.locator('.page-info, .p-paginator-current');
  }

  async navigateToJobTracker() {
    await this.page.goto('/job-tracker');
    await this.page.waitForLoadState('networkidle');
  }

  // Search and filter methods
  async searchByCompany(company: string) {
    await this.companySearchInput.fill(company);
    await this.page.waitForTimeout(500); // Debounce
  }

  async searchByPosition(position: string) {
    await this.positionSearchInput.fill(position);
    await this.page.waitForTimeout(500); // Debounce
  }

  async filterByStatus(status: string) {
    await this.statusFilter.click();
    await this.page.locator(`li:has-text("${status}"), option:has-text("${status}")`).click();
  }

  // Add job methods
  async clickAddJob() {
    await this.addJobButton.click();
    await this.page.waitForSelector('.modal, .p-dialog', { timeout: 5000 });
  }

  async fillJobForm(job: {
    company: string;
    position: string;
    jobUrl?: string;
    dateApplied: string;
    status: string;
    jobDescription?: string;
    notes?: string;
  }) {
    await this.companyNameInput.fill(job.company);
    await this.positionInput.fill(job.position);
    
    if (job.jobUrl) {
      await this.jobUrlInput.fill(job.jobUrl);
    }
    
    await this.dateAppliedInput.fill(job.dateApplied);
    
    // Handle status dropdown
    await this.statusDropdown.click();
    await this.page.locator(`li:has-text("${job.status}"), option:has-text("${job.status}")`).click();
    
    if (job.jobDescription) {
      await this.jobDescriptionTextarea.fill(job.jobDescription);
    }
    
    if (job.notes) {
      await this.notesTextarea.fill(job.notes);
    }
  }

  async saveJob() {
    await this.saveJobButton.click();
    await this.page.waitForSelector('.p-toast-message-success, .success-message', { timeout: 10000 });
  }

  async cancelJobForm() {
    await this.cancelButton.click();
  }

  // Table interaction methods
  async getJobCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getJobByCompanyAndPosition(company: string, position: string): Promise<Locator> {
    return this.tableRows.filter({ 
      hasText: company 
    }).filter({ 
      hasText: position 
    });
  }

  async editJob(company: string, position: string) {
    const row = await this.getJobByCompanyAndPosition(company, position);
    await row.locator('button:has-text("Edit")').click();
  }

  async deleteJob(company: string, position: string) {
    const row = await this.getJobByCompanyAndPosition(company, position);
    await row.locator('button:has-text("Delete")').click();
    await this.confirmDeleteButton.click();
  }

  async getJobStatus(company: string, position: string): Promise<string> {
    const row = await this.getJobByCompanyAndPosition(company, position);
    return await row.locator('.status-cell, td:nth-child(3)').textContent() || '';
  }

  // Pagination methods
  async goToNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForTimeout(500);
  }

  async goToPreviousPage() {
    await this.previousPageButton.click();
    await this.page.waitForTimeout(500);
  }

  async getCurrentPageInfo(): Promise<string> {
    return await this.pageInfo.textContent() || '';
  }

  // Sort methods
  async sortByCompany() {
    await this.companyHeader.click();
    await this.page.waitForTimeout(500);
  }

  async sortByPosition() {
    await this.positionHeader.click();
    await this.page.waitForTimeout(500);
  }

  async sortByStatus() {
    await this.statusHeader.click();
    await this.page.waitForTimeout(500);
  }

  async sortByDate() {
    await this.dateHeader.click();
    await this.page.waitForTimeout(500);
  }
}