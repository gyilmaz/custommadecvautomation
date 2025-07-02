import { test, expect } from '@playwright/test';
import { CustomMadeCVLoginPage } from '../../pages/CustomMadeCVLoginPage';
import { MyResumePage } from '../../pages/MyResumePage';
import { TestData } from '../../fixtures/TestData';
import { CVTestData } from '../../fixtures/CVTestData';

test.describe('Resume Builder Tests', () => {
  let loginPage: CustomMadeCVLoginPage;
  let myResumePage: MyResumePage;

  test.beforeEach(async ({ page }) => {
    // Login first
    loginPage = new CustomMadeCVLoginPage(page);
    await loginPage.navigateToLogin();
    const { email, password } = TestData.users.validUser;
    await loginPage.login(email, password);
    await loginPage.waitForLoginSuccess();
    
    // Navigate to resume builder
    myResumePage = new MyResumePage(page);
    await myResumePage.navigateToMyResume();
  });

  test('should fill basic information section', async ({ page }) => {
    // Select basics section (should be default)
    await myResumePage.selectSection('Basics');
    
    // Fill basic info
    const { personalInfo } = CVTestData.resume;
    await myResumePage.fillBasicInfo({
      name: `${personalInfo.firstName} ${personalInfo.lastName}`,
      label: 'Senior Software Engineer',
      email: personalInfo.email,
      phone: personalInfo.phone,
      summary: personalInfo.summary
    });
    
    // Fill location
    await myResumePage.fillLocation({
      address: '123 Main Street',
      city: 'New York',
      region: 'NY',
      postalCode: '10001',
      country: 'USA'
    });
    
    // Save
    await myResumePage.saveResume();
    
    // Verify save success
    await expect(page.locator('.p-toast-message-success, .success-message')).toBeVisible();
  });

  test('should add work experience', async ({ page }) => {
    // Navigate to work experience section
    await myResumePage.selectSection('Experience');
    
    // Add first experience
    const experience1 = CVTestData.resume.experience[0];
    await myResumePage.addWorkExperience({
      company: experience1.company,
      position: experience1.jobTitle,
      startDate: experience1.startDate,
      endDate: experience1.endDate,
      summary: experience1.description,
      highlights: [
        'Led development team of 5 engineers',
        'Improved system performance by 40%',
        'Implemented CI/CD pipeline'
      ]
    });
    
    // Add second experience
    const experience2 = CVTestData.resume.experience[1];
    await myResumePage.addWorkExperience({
      company: experience2.company,
      position: experience2.jobTitle,
      startDate: experience2.startDate,
      endDate: experience2.endDate,
      summary: experience2.description
    });
    
    // Verify experiences were added
    const experienceCount = await myResumePage.workExperienceItems.count();
    expect(experienceCount).toBeGreaterThanOrEqual(2);
    
    // Save
    await myResumePage.saveResume();
  });

  test('should add education', async ({ page }) => {
    // Navigate to education section
    await myResumePage.selectSection('Education');
    
    // Add education
    const education = CVTestData.resume.education[0];
    await myResumePage.addEducation({
      institution: education.school,
      area: 'Computer Science',
      studyType: education.degree,
      startDate: '2015-09',
      endDate: education.graduationDate,
      score: education.gpa
    });
    
    // Verify education was added
    const educationCount = await myResumePage.educationItems.count();
    expect(educationCount).toBeGreaterThanOrEqual(1);
    
    // Save
    await myResumePage.saveResume();
  });

  test('should add skills', async ({ page }) => {
    // Navigate to skills section
    await myResumePage.selectSection('Skills');
    
    // Add programming languages skill
    await myResumePage.addSkill({
      name: 'Programming Languages',
      level: 'Expert',
      keywords: ['JavaScript', 'TypeScript', 'Python', 'Java']
    });
    
    // Add frameworks skill
    await myResumePage.addSkill({
      name: 'Frontend Frameworks',
      level: 'Advanced',
      keywords: ['React', 'Vue.js', 'Angular']
    });
    
    // Add cloud skills
    await myResumePage.addSkill({
      name: 'Cloud & DevOps',
      level: 'Intermediate',
      keywords: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
    });
    
    // Verify skills were added
    const skillCount = await myResumePage.skillItems.count();
    expect(skillCount).toBeGreaterThanOrEqual(3);
    
    // Save
    await myResumePage.saveResume();
  });

  test('should generate PDF from resume', async ({ page }) => {
    // Fill some basic info first
    await myResumePage.selectSection('Basics');
    await myResumePage.fillBasicInfo({
      name: 'John Smith',
      label: 'Software Engineer',
      email: 'john.smith@example.com',
      phone: '+1-555-123-4567',
      summary: 'Experienced software engineer'
    });
    
    // Save first
    await myResumePage.saveResume();
    
    // Generate PDF
    await myResumePage.generatePDF();
    
    // Verify PDF viewer appears
    await expect(page.locator('.pdf-viewer, iframe')).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    // Test navigation through different sections
    const sections = ['Basics', 'Experience', 'Education', 'Skills', 'Projects', 'Languages'];
    
    for (const section of sections) {
      await myResumePage.selectSection(section);
      await page.waitForTimeout(500);
      
      // Verify section is displayed (check for section-specific element)
      if (section === 'Experience') {
        await expect(myResumePage.addWorkExperienceButton).toBeVisible();
      } else if (section === 'Education') {
        await expect(myResumePage.addEducationButton).toBeVisible();
      } else if (section === 'Skills') {
        await expect(myResumePage.addSkillButton).toBeVisible();
      }
    }
  });

  test('should handle multiple items in sections', async ({ page }) => {
    // Add multiple work experiences
    await myResumePage.selectSection('Experience');
    
    for (let i = 0; i < 3; i++) {
      await myResumePage.addWorkExperience({
        company: `Company ${i + 1}`,
        position: `Position ${i + 1}`,
        startDate: `202${i}-01`,
        endDate: i === 0 ? 'Present' : `202${i + 1}-01`,
        summary: `Description for position ${i + 1}`
      });
    }
    
    // Verify all were added
    const experienceCount = await myResumePage.workExperienceItems.count();
    expect(experienceCount).toBeGreaterThanOrEqual(3);
  });

  test('should validate required fields', async ({ page }) => {
    // Try to save without filling required fields
    await myResumePage.saveResume();
    
    // Should show validation errors or not save successfully
    // Check that success message is NOT shown
    await expect(page.locator('.p-toast-message-success, .success-message')).not.toBeVisible({ timeout: 2000 });
  });

  test('should handle special characters in text fields', async ({ page }) => {
    await myResumePage.selectSection('Basics');
    
    // Fill with special characters
    await myResumePage.fillBasicInfo({
      name: "John O'Smith-Jones",
      label: 'Senior Engineer & Architect',
      email: 'john.smith+test@example.com',
      phone: '+1 (555) 123-4567',
      summary: 'Experience with C++, C#, HTML/CSS & "modern" frameworks'
    });
    
    // Should handle special characters properly
    await myResumePage.saveResume();
    await expect(page.locator('.p-toast-message-success, .success-message')).toBeVisible();
  });

  test('should download resume as PDF', async ({ page }) => {
    // Fill basic info
    await myResumePage.fillBasicInfo({
      name: 'Download Test User',
      label: 'Test Engineer',
      email: 'test@example.com',
      phone: '555-0123',
      summary: 'Test summary for download'
    });
    
    // Save first
    await myResumePage.saveResume();
    
    // Download resume
    const download = await myResumePage.downloadResume();
    
    // Verify download
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});