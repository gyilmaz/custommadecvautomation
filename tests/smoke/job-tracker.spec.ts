import { test, expect } from '@playwright/test';
import { CustomMadeCVLoginPage } from '../../pages/CustomMadeCVLoginPage';
import { JobTrackerPage } from '../../pages/JobTrackerPage';
import { TestData } from '../../fixtures/TestData';
import { CVTestData } from '../../fixtures/CVTestData';

test.describe('Job Tracker Tests', () => {
  let loginPage: CustomMadeCVLoginPage;
  let jobTrackerPage: JobTrackerPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    loginPage = new CustomMadeCVLoginPage(page);
    await loginPage.navigateToLogin();
    const { email, password } = TestData.users.validUser;
    await loginPage.login(email, password);
    await loginPage.waitForLoginSuccess();
    
    // Navigate to job tracker
    jobTrackerPage = new JobTrackerPage(page);
    await jobTrackerPage.navigateToJobTracker();
  });

  test('should display job tracker page elements', async ({ page }) => {
    await expect(jobTrackerPage.addJobButton).toBeVisible();
    await expect(jobTrackerPage.jobTable).toBeVisible();
    await expect(jobTrackerPage.companySearchInput).toBeVisible();
    await expect(jobTrackerPage.positionSearchInput).toBeVisible();
  });

  test('should add a new job application', async ({ page }) => {
    const jobData = {
      company: CVTestData.jobDescription.company,
      position: CVTestData.jobDescription.title,
      jobUrl: 'https://example.com/job/12345',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Applied',
      jobDescription: CVTestData.jobDescription.description,
      notes: 'Submitted application through company website'
    };

    // Click add job button
    await jobTrackerPage.clickAddJob();
    
    // Fill job form
    await jobTrackerPage.fillJobForm(jobData);
    
    // Save job
    await jobTrackerPage.saveJob();
    
    // Verify job appears in table
    const jobRow = await jobTrackerPage.getJobByCompanyAndPosition(jobData.company, jobData.position);
    await expect(jobRow).toBeVisible();
    
    // Verify status
    const status = await jobTrackerPage.getJobStatus(jobData.company, jobData.position);
    expect(status).toContain(jobData.status);
  });

  test('should search jobs by company name', async ({ page }) => {
    // Add a test job first
    const jobData = {
      company: 'Test Company ABC',
      position: 'Software Engineer',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Applied'
    };

    await jobTrackerPage.clickAddJob();
    await jobTrackerPage.fillJobForm(jobData);
    await jobTrackerPage.saveJob();

    // Search for the job
    await jobTrackerPage.searchByCompany('Test Company ABC');
    
    // Verify filtered results
    const jobRow = await jobTrackerPage.getJobByCompanyAndPosition(jobData.company, jobData.position);
    await expect(jobRow).toBeVisible();
  });

  test('should filter jobs by status', async ({ page }) => {
    // Filter by status
    await jobTrackerPage.filterByStatus('Applied');
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
    
    // All visible jobs should have "Applied" status
    const rows = await jobTrackerPage.tableRows.all();
    for (const row of rows) {
      const statusCell = await row.locator('.status-cell, td:nth-child(3)').textContent();
      if (statusCell) {
        expect(statusCell).toContain('Applied');
      }
    }
  });

  test('should edit existing job application', async ({ page }) => {
    // First add a job
    const jobData = {
      company: 'Edit Test Company',
      position: 'Frontend Developer',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Applied'
    };

    await jobTrackerPage.clickAddJob();
    await jobTrackerPage.fillJobForm(jobData);
    await jobTrackerPage.saveJob();

    // Edit the job
    await jobTrackerPage.editJob(jobData.company, jobData.position);
    
    // Update status
    await jobTrackerPage.statusDropdown.click();
    await page.locator('li:has-text("Interview Scheduled")').click();
    
    // Add notes
    await jobTrackerPage.notesTextarea.fill('Phone interview scheduled for next week');
    
    // Save changes
    await jobTrackerPage.saveJob();
    
    // Verify updated status
    const updatedStatus = await jobTrackerPage.getJobStatus(jobData.company, jobData.position);
    expect(updatedStatus).toContain('Interview Scheduled');
  });

  test('should delete job application', async ({ page }) => {
    // First add a job
    const jobData = {
      company: 'Delete Test Company',
      position: 'Backend Developer',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Applied'
    };

    await jobTrackerPage.clickAddJob();
    await jobTrackerPage.fillJobForm(jobData);
    await jobTrackerPage.saveJob();

    // Verify job exists
    let jobRow = await jobTrackerPage.getJobByCompanyAndPosition(jobData.company, jobData.position);
    await expect(jobRow).toBeVisible();

    // Delete the job
    await jobTrackerPage.deleteJob(jobData.company, jobData.position);
    
    // Wait for deletion
    await page.waitForTimeout(1000);
    
    // Verify job is deleted
    jobRow = await jobTrackerPage.getJobByCompanyAndPosition(jobData.company, jobData.position);
    await expect(jobRow).not.toBeVisible();
  });

  test('should sort jobs by different columns', async ({ page }) => {
    // Sort by company
    await jobTrackerPage.sortByCompany();
    await page.waitForTimeout(500);
    
    // Sort by position
    await jobTrackerPage.sortByPosition();
    await page.waitForTimeout(500);
    
    // Sort by date
    await jobTrackerPage.sortByDate();
    await page.waitForTimeout(500);
    
    // Sort by status
    await jobTrackerPage.sortByStatus();
    await page.waitForTimeout(500);
    
    // Verify table is still visible after sorting
    await expect(jobTrackerPage.jobTable).toBeVisible();
  });

  test('should handle pagination if multiple jobs exist', async ({ page }) => {
    // Check if pagination controls are visible
    const isPaginationVisible = await jobTrackerPage.paginationControls.isVisible();
    
    if (isPaginationVisible) {
      // Get current page info
      const pageInfo = await jobTrackerPage.getCurrentPageInfo();
      expect(pageInfo).toBeTruthy();
      
      // Try navigating if next button is enabled
      const isNextEnabled = await jobTrackerPage.nextPageButton.isEnabled();
      if (isNextEnabled) {
        await jobTrackerPage.goToNextPage();
        await expect(jobTrackerPage.jobTable).toBeVisible();
        
        // Go back
        await jobTrackerPage.goToPreviousPage();
        await expect(jobTrackerPage.jobTable).toBeVisible();
      }
    }
  });

  test('should validate required fields when adding job', async ({ page }) => {
    await jobTrackerPage.clickAddJob();
    
    // Try to save without filling required fields
    await jobTrackerPage.saveJob();
    
    // Should show validation errors or stay on form
    await expect(jobTrackerPage.companyNameInput).toBeVisible();
    
    // Fill only company name
    await jobTrackerPage.companyNameInput.fill('Test Company');
    await jobTrackerPage.saveJob();
    
    // Should still be on form (position is required)
    await expect(jobTrackerPage.positionInput).toBeVisible();
  });

  test('should cancel job form', async ({ page }) => {
    await jobTrackerPage.clickAddJob();
    
    // Fill some data
    await jobTrackerPage.companyNameInput.fill('Test Company');
    await jobTrackerPage.positionInput.fill('Test Position');
    
    // Cancel
    await jobTrackerPage.cancelJobForm();
    
    // Modal should be closed
    await expect(jobTrackerPage.companyNameInput).not.toBeVisible();
    
    // Should be back on main page
    await expect(jobTrackerPage.jobTable).toBeVisible();
  });
});