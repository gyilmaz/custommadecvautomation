import { test, expect } from '@playwright/test';
import { CustomMadeCVLoginPage } from '../../pages/CustomMadeCVLoginPage';
import { ResumeUploadPage } from '../../pages/ResumeUploadPage';
import { TestData } from '../../fixtures/TestData';
import { CVTestData } from '../../fixtures/CVTestData';
import * as path from 'path';

test.describe('Resume Upload and Generation Tests', () => {
  let loginPage: CustomMadeCVLoginPage;
  let resumeUploadPage: ResumeUploadPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    loginPage = new CustomMadeCVLoginPage(page);
    await loginPage.navigateToLogin();
    const { email, password } = TestData.users.validUser;
    await loginPage.login(email, password);
    await loginPage.waitForLoginSuccess();
    
    // Navigate to resume upload
    resumeUploadPage = new ResumeUploadPage(page);
    await resumeUploadPage.navigateToResumeUpload();
  });

  test('should complete full resume generation flow', async ({ page }) => {
    // Step 1: Resume Selection - Upload new resume
    await resumeUploadPage.selectResumeSource('upload');
    
    const resumePath = path.join(__dirname, '../../fixtures/sample-resume.txt');
    await resumeUploadPage.uploadResumeFile(resumePath);
    
    // Wait for upload to complete
    await page.waitForTimeout(2000);
    await resumeUploadPage.proceedToNextStep();
    
    // Step 2: Job Details
    const { title, company, description } = CVTestData.jobDescription;
    await resumeUploadPage.fillJobDetails(company, title, description);
    await resumeUploadPage.proceedToNextStep();
    
    // Step 3: ATS Keywords Analysis
    await resumeUploadPage.runATSAnalysis();
    
    // Check ATS score is displayed
    const atsScore = await resumeUploadPage.getATSScore();
    expect(atsScore).toContain('%');
    
    // Select some keywords
    await resumeUploadPage.selectAllTechnicalKeywords();
    await resumeUploadPage.proceedToNextStep();
    
    // Step 4: Resume Generation
    await resumeUploadPage.fillAdditionalInfo('Please emphasize my leadership experience and cloud architecture skills.');
    await resumeUploadPage.generateResume();
    
    // Wait for generation to complete (this may take a while)
    await resumeUploadPage.waitForResumeGeneration();
    
    // Step 5: Resume Ready
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Generate PDF
    await resumeUploadPage.generatePDF();
    
    // Verify PDF is visible
    const isPDFVisible = await resumeUploadPage.isPDFVisible();
    expect(isPDFVisible).toBe(true);
  });

  test('should use current resume if available', async ({ page }) => {
    // Check if current resume option is available
    const currentResumeOption = page.locator('.option-card:has-text("Use Current Resume")');
    const isDisabled = await currentResumeOption.evaluate(el => el.classList.contains('disabled'));
    
    if (!isDisabled) {
      await resumeUploadPage.selectResumeSource('current');
      await resumeUploadPage.proceedToNextStep();
      
      // Should be on job details step
      await expect(resumeUploadPage.companyNameInput).toBeVisible();
    } else {
      // If no current resume, upload one first
      await resumeUploadPage.selectResumeSource('upload');
      const resumePath = path.join(__dirname, '../../fixtures/sample-resume.txt');
      await resumeUploadPage.uploadResumeFile(resumePath);
    }
  });

  test('should handle job tracker integration', async ({ page }) => {
    // Navigate to job details step
    await resumeUploadPage.selectResumeSource('current');
    await resumeUploadPage.proceedToNextStep();
    
    // Check if tracked job is available
    const trackedJobInfo = await resumeUploadPage.trackedJobInfo.isVisible();
    
    if (trackedJobInfo) {
      // Toggle to manual entry
      await resumeUploadPage.toggleJobSource();
      
      // Fields should be editable
      await expect(resumeUploadPage.companyNameInput).toBeEnabled();
      await expect(resumeUploadPage.jobTitleInput).toBeEnabled();
      
      // Toggle back to tracked job
      await resumeUploadPage.toggleJobSource();
      
      // Fields should be disabled
      await expect(resumeUploadPage.companyNameInput).toBeDisabled();
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Try to proceed without selecting resume source
    await resumeUploadPage.proceedToNextStep();
    
    // Should still be on step 1
    await expect(resumeUploadPage.uploadNewResumeOption).toBeVisible();
    
    // Select upload but don't upload file
    await resumeUploadPage.selectResumeSource('upload');
    await resumeUploadPage.proceedToNextStep();
    
    // Should still be on step 1
    await expect(resumeUploadPage.uploadResumeButton).toBeVisible();
  });

  test('should handle ATS keyword selection', async ({ page }) => {
    // Quick navigation to ATS step
    await resumeUploadPage.selectResumeSource('current');
    await resumeUploadPage.proceedToNextStep();
    
    const { title, company, description } = CVTestData.jobDescription;
    await resumeUploadPage.fillJobDetails(company, title, description);
    await resumeUploadPage.proceedToNextStep();
    
    // Run ATS analysis
    await resumeUploadPage.runATSAnalysis();
    
    // Select individual keywords
    const keywords = await resumeUploadPage.keywordChips.all();
    if (keywords.length > 0) {
      // Click first keyword
      await keywords[0].click();
      
      // Verify it's selected
      const isSelected = await keywords[0].evaluate(el => el.classList.contains('selected'));
      expect(isSelected).toBe(true);
      
      // Clear all selections
      await resumeUploadPage.clearAllButton.click();
      
      // Verify cleared
      const selectedCount = await page.locator('.keyword-chip.selected').count();
      expect(selectedCount).toBe(0);
    }
  });

  test('should navigate back through steps', async ({ page }) => {
    // Navigate to step 2
    await resumeUploadPage.selectResumeSource('current');
    await resumeUploadPage.proceedToNextStep();
    
    // Should be on job details
    await expect(resumeUploadPage.companyNameInput).toBeVisible();
    
    // Go back
    await resumeUploadPage.goBackToPreviousStep();
    
    // Should be back on resume selection
    await expect(resumeUploadPage.uploadNewResumeOption).toBeVisible();
  });
});