import { test, expect } from '@playwright/test';
import { TestData } from '../fixtures/TestData';
import { TestHelpers } from '../fixtures/TestHelpers';

test.describe('E2E Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.clearLocalStorage(page);
    await TestHelpers.clearCookies(page);
  });

  test('should complete full purchase flow', async ({ page }) => {
    const testEmail = TestHelpers.generateRandomEmail();
    const { laptop, phone } = TestData.products;
    
    await page.goto('/');
    
    await page.click('[data-testid="nav-products"]');
    await expect(page).toHaveURL('/products');
    
    await page.fill('[data-testid="search-input"]', laptop.name);
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-testid="product-card"]');
    
    await page.click(`[data-testid="product-${laptop.sku}"]`);
    await expect(page).toHaveURL(new RegExp(`/products/${laptop.sku}`));
    
    await expect(page.locator('[data-testid="product-name"]')).toHaveText(laptop.name);
    await expect(page.locator('[data-testid="product-price"]')).toContainText(laptop.price.toString());
    
    await page.click('[data-testid="add-to-cart"]');
    await page.waitForSelector('[data-testid="cart-notification"]');
    
    await page.goto('/products');
    await page.click(`[data-testid="product-${phone.sku}"]`);
    await page.click('[data-testid="add-to-cart"]');
    
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL('/cart');
    
    const cartItems = await page.locator('[data-testid="cart-item"]').count();
    expect(cartItems).toBe(2);
    
    const totalPrice = laptop.price + phone.price;
    await expect(page.locator('[data-testid="cart-total"]')).toContainText(totalPrice.toFixed(2));
    
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL('/checkout');
    
    await page.fill('[data-testid="email-input"]', testEmail);
    await page.fill('[data-testid="firstname-input"]', TestData.users.validUser.firstName);
    await page.fill('[data-testid="lastname-input"]', TestData.users.validUser.lastName);
    await page.fill('[data-testid="phone-input"]', TestData.users.validUser.phone);
    
    await page.fill('[data-testid="address-street"]', TestData.users.validUser.address.street);
    await page.fill('[data-testid="address-city"]', TestData.users.validUser.address.city);
    await page.selectOption('[data-testid="address-state"]', TestData.users.validUser.address.state);
    await page.fill('[data-testid="address-zip"]', TestData.users.validUser.address.zip);
    
    await page.click('[data-testid="continue-to-payment"]');
    
    await page.fill('[data-testid="card-number"]', TestData.creditCards.valid.number);
    await page.fill('[data-testid="card-name"]', TestData.creditCards.valid.name);
    await page.fill('[data-testid="card-expiry"]', TestData.creditCards.valid.expiry);
    await page.fill('[data-testid="card-cvv"]', TestData.creditCards.valid.cvv);
    
    await page.click('[data-testid="place-order"]');
    
    await page.waitForSelector('[data-testid="order-confirmation"]', { timeout: TestData.timeouts.long });
    await expect(page).toHaveURL(/\/order-confirmation/);
    
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    expect(orderNumber).toMatch(/^[A-Z0-9]{8,}$/);
    
    await expect(page.locator('[data-testid="success-message"]')).toHaveText(TestData.messages.success.purchase);
    
    const receiptItems = await page.locator('[data-testid="receipt-item"]').count();
    expect(receiptItems).toBe(2);
    
    const pdfDownloadButton = page.locator('[data-testid="download-pdf"]');
    await expect(pdfDownloadButton).toBeVisible();
    
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      pdfDownloadButton.click()
    ]);
    
    expect(download.suggestedFilename()).toContain('order');
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should handle out of stock items', async ({ page }) => {
    await TestHelpers.mockAPIResponse(page, '**/api/products/*', {
      ...TestData.products.laptop,
      stock: 0
    });
    
    await page.goto(`/products/${TestData.products.laptop.sku}`);
    
    await expect(page.locator('[data-testid="out-of-stock"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeDisabled();
    
    await page.click('[data-testid="notify-when-available"]');
    await page.fill('[data-testid="notify-email"]', TestHelpers.generateRandomEmail());
    await page.click('[data-testid="submit-notification"]');
    
    await expect(page.locator('[data-testid="notification-success"]')).toBeVisible();
  });

  test('should apply discount codes', async ({ page }) => {
    const discountCode = 'SAVE20';
    const discountPercentage = 0.20;
    
    await page.goto(`/products/${TestData.products.book.sku}`);
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/cart');
    
    const originalPrice = TestData.products.book.price;
    await expect(page.locator('[data-testid="cart-subtotal"]')).toContainText(originalPrice.toFixed(2));
    
    await page.click('[data-testid="add-discount-code"]');
    await page.fill('[data-testid="discount-input"]', discountCode);
    await page.click('[data-testid="apply-discount"]');
    
    await page.waitForSelector('[data-testid="discount-applied"]');
    
    const discountAmount = originalPrice * discountPercentage;
    const finalPrice = originalPrice - discountAmount;
    
    await expect(page.locator('[data-testid="discount-amount"]')).toContainText(discountAmount.toFixed(2));
    await expect(page.locator('[data-testid="cart-total"]')).toContainText(finalPrice.toFixed(2));
  });

  test('should persist cart across sessions', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto(`/products/${TestData.products.laptop.sku}`);
    await page.click('[data-testid="add-to-cart"]');
    
    const cartCount = await page.locator('[data-testid="cart-count"]').textContent();
    expect(cartCount).toBe('1');
    
    await context.close();
    
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    await newPage.goto('/');
    
    const persistedCartCount = await newPage.locator('[data-testid="cart-count"]').textContent();
    expect(persistedCartCount).toBe('1');
    
    await newContext.close();
  });
});

test.describe('E2E Purchase Flow - Mobile', () => {
  test.use({ ...TestData.devices?.mobile || { viewport: { width: 375, height: 667 } } });

  test('should complete purchase on mobile device', async ({ page }) => {
    await page.goto('/');
    
    await page.click('[data-testid="mobile-menu-toggle"]');
    await page.click('[data-testid="mobile-nav-products"]');
    
    await page.click(`[data-testid="product-${TestData.products.phone.sku}"]`);
    
    await page.click('[data-testid="add-to-cart"]');
    
    await page.click('[data-testid="mobile-cart-icon"]');
    
    await TestHelpers.scrollToBottom(page);
    await page.click('[data-testid="checkout-button"]');
    
    const mobileFormFields = await page.locator('input[required]').count();
    expect(mobileFormFields).toBeGreaterThan(0);
    
    await page.evaluate(() => window.scrollTo(0, 0));
    const isFormResponsive = await page.locator('form').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.maxWidth !== 'none' || styles.width === '100%';
    });
    expect(isFormResponsive).toBe(true);
  });
});