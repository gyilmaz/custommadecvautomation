import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyResumePage extends BasePage {
  // Section navigation
  readonly sectionDropdown: Locator;
  readonly activeSection: Locator;
  
  // Common action buttons
  readonly saveButton: Locator;
  readonly downloadButton: Locator;
  readonly previewButton: Locator;
  readonly generatePDFButton: Locator;
  
  // Basics section
  readonly nameInput: Locator;
  readonly labelInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly summaryTextarea: Locator;
  readonly locationAddressInput: Locator;
  readonly locationCityInput: Locator;
  readonly locationRegionInput: Locator;
  readonly locationPostalCodeInput: Locator;
  readonly locationCountryInput: Locator;
  
  // Work Experience section
  readonly addWorkExperienceButton: Locator;
  readonly workExperienceItems: Locator;
  readonly companyNameInput: Locator;
  readonly positionInput: Locator;
  readonly workStartDateInput: Locator;
  readonly workEndDateInput: Locator;
  readonly workSummaryTextarea: Locator;
  readonly addHighlightButton: Locator;
  
  // Education section
  readonly addEducationButton: Locator;
  readonly educationItems: Locator;
  readonly institutionInput: Locator;
  readonly areaInput: Locator;
  readonly studyTypeInput: Locator;
  readonly eduStartDateInput: Locator;
  readonly eduEndDateInput: Locator;
  readonly scoreInput: Locator;
  
  // Skills section
  readonly addSkillButton: Locator;
  readonly skillItems: Locator;
  readonly skillNameInput: Locator;
  readonly skillLevelSelect: Locator;
  readonly addKeywordButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Section navigation
    this.sectionDropdown = page.locator('.p-dropdown').first();
    this.activeSection = page.locator('.section-content.active');
    
    // Common action buttons
    this.saveButton = page.locator('button:has-text("Save")');
    this.downloadButton = page.locator('button:has-text("Download")');
    this.previewButton = page.locator('button:has-text("Preview")');
    this.generatePDFButton = page.locator('button:has-text("Generate PDF")');
    
    // Basics section
    this.nameInput = page.locator('input[placeholder*="name"]').first();
    this.labelInput = page.locator('input[placeholder*="title"], input[placeholder*="label"]').first();
    this.emailInput = page.locator('input[type="email"], input[placeholder*="email"]').first();
    this.phoneInput = page.locator('input[type="tel"], input[placeholder*="phone"]').first();
    this.summaryTextarea = page.locator('textarea[placeholder*="summary"], textarea[placeholder*="about"]').first();
    this.locationAddressInput = page.locator('input[placeholder*="address"]').first();
    this.locationCityInput = page.locator('input[placeholder*="city"]').first();
    this.locationRegionInput = page.locator('input[placeholder*="state"], input[placeholder*="region"]').first();
    this.locationPostalCodeInput = page.locator('input[placeholder*="zip"], input[placeholder*="postal"]').first();
    this.locationCountryInput = page.locator('input[placeholder*="country"]').first();
    
    // Work Experience section
    this.addWorkExperienceButton = page.locator('button:has-text("Add Work Experience"), button:has-text("Add Experience")');
    this.workExperienceItems = page.locator('.work-experience-item, .experience-item');
    this.companyNameInput = page.locator('input[placeholder*="company"]');
    this.positionInput = page.locator('input[placeholder*="position"], input[placeholder*="title"]');
    this.workStartDateInput = page.locator('input[placeholder*="start date"]');
    this.workEndDateInput = page.locator('input[placeholder*="end date"]');
    this.workSummaryTextarea = page.locator('textarea[placeholder*="description"], textarea[placeholder*="summary"]');
    this.addHighlightButton = page.locator('button:has-text("Add Highlight"), button:has-text("Add Bullet")');
    
    // Education section
    this.addEducationButton = page.locator('button:has-text("Add Education")');
    this.educationItems = page.locator('.education-item');
    this.institutionInput = page.locator('input[placeholder*="institution"], input[placeholder*="school"]');
    this.areaInput = page.locator('input[placeholder*="area"], input[placeholder*="field"]');
    this.studyTypeInput = page.locator('input[placeholder*="degree"], input[placeholder*="study type"]');
    this.eduStartDateInput = page.locator('.education-section input[placeholder*="start date"]');
    this.eduEndDateInput = page.locator('.education-section input[placeholder*="end date"]');
    this.scoreInput = page.locator('input[placeholder*="GPA"], input[placeholder*="score"]');
    
    // Skills section
    this.addSkillButton = page.locator('button:has-text("Add Skill")');
    this.skillItems = page.locator('.skill-item');
    this.skillNameInput = page.locator('input[placeholder*="skill name"]');
    this.skillLevelSelect = page.locator('select[name*="level"], .skill-level-select');
    this.addKeywordButton = page.locator('button:has-text("Add Keyword")');
  }

  async navigateToMyResume() {
    await this.page.goto('/myresume');
    await this.page.waitForLoadState('networkidle');
  }

  async selectSection(sectionName: string) {
    await this.sectionDropdown.click();
    await this.page.locator(`li:has-text("${sectionName}")`).click();
    await this.page.waitForTimeout(500);
  }

  // Basics section methods
  async fillBasicInfo(info: {
    name: string;
    label: string;
    email: string;
    phone: string;
    summary: string;
  }) {
    await this.nameInput.fill(info.name);
    await this.labelInput.fill(info.label);
    await this.emailInput.fill(info.email);
    await this.phoneInput.fill(info.phone);
    await this.summaryTextarea.fill(info.summary);
  }

  async fillLocation(location: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  }) {
    await this.locationAddressInput.fill(location.address);
    await this.locationCityInput.fill(location.city);
    await this.locationRegionInput.fill(location.region);
    await this.locationPostalCodeInput.fill(location.postalCode);
    await this.locationCountryInput.fill(location.country);
  }

  // Work Experience methods
  async addWorkExperience(experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights?: string[];
  }) {
    await this.addWorkExperienceButton.click();
    await this.page.waitForTimeout(500);
    
    const lastExperience = this.workExperienceItems.last();
    await lastExperience.locator('input[placeholder*="company"]').fill(experience.company);
    await lastExperience.locator('input[placeholder*="position"]').fill(experience.position);
    await lastExperience.locator('input[placeholder*="start date"]').fill(experience.startDate);
    await lastExperience.locator('input[placeholder*="end date"]').fill(experience.endDate);
    await lastExperience.locator('textarea').fill(experience.summary);
    
    if (experience.highlights) {
      for (const highlight of experience.highlights) {
        await lastExperience.locator('button:has-text("Add Highlight"), button:has-text("Add Bullet")').click();
        await lastExperience.locator('input[placeholder*="highlight"], input[placeholder*="bullet"]').last().fill(highlight);
      }
    }
  }

  // Education methods
  async addEducation(education: {
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score?: string;
  }) {
    await this.addEducationButton.click();
    await this.page.waitForTimeout(500);
    
    const lastEducation = this.educationItems.last();
    await lastEducation.locator('input[placeholder*="institution"]').fill(education.institution);
    await lastEducation.locator('input[placeholder*="area"]').fill(education.area);
    await lastEducation.locator('input[placeholder*="degree"]').fill(education.studyType);
    await lastEducation.locator('input[placeholder*="start date"]').fill(education.startDate);
    await lastEducation.locator('input[placeholder*="end date"]').fill(education.endDate);
    
    if (education.score) {
      await lastEducation.locator('input[placeholder*="GPA"], input[placeholder*="score"]').fill(education.score);
    }
  }

  // Skills methods
  async addSkill(skill: {
    name: string;
    level: string;
    keywords?: string[];
  }) {
    await this.addSkillButton.click();
    await this.page.waitForTimeout(500);
    
    const lastSkill = this.skillItems.last();
    await lastSkill.locator('input[placeholder*="skill name"]').fill(skill.name);
    
    if (skill.level) {
      await lastSkill.locator('select, .p-dropdown').click();
      await this.page.locator(`li:has-text("${skill.level}")`).click();
    }
    
    if (skill.keywords) {
      for (const keyword of skill.keywords) {
        await lastSkill.locator('button:has-text("Add Keyword")').click();
        await lastSkill.locator('input[placeholder*="keyword"]').last().fill(keyword);
      }
    }
  }

  // Common actions
  async saveResume() {
    await this.saveButton.click();
    await this.page.waitForSelector('.p-toast-message-success, .success-message', { timeout: 10000 });
  }

  async generatePDF() {
    await this.generatePDFButton.click();
    await this.page.waitForSelector('.pdf-viewer, iframe', { timeout: 30000 });
  }

  async downloadResume() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton.click()
    ]);
    return download;
  }
}