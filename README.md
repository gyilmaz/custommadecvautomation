# Playwright TypeScript Test Automation Framework

A robust and scalable test automation framework built with Playwright and TypeScript, featuring Page Object Model pattern, comprehensive test utilities, and CI/CD integration.

## Features

- 🎭 **Playwright** - Modern web testing framework
- 📘 **TypeScript** - Type-safe test development
- 🏗️ **Page Object Model** - Maintainable test architecture
- 🔧 **Test Utilities** - Reusable helper functions
- 📊 **Multiple Reporters** - HTML, JSON, and list reporters
- 🎯 **Cross-browser Testing** - Chrome, Firefox, Safari, and mobile browsers
- 🚀 **CI/CD Ready** - GitHub Actions workflow included
- 🎨 **Code Quality** - ESLint and Prettier configured
- 💡 **VS Code Integration** - Optimized settings and extensions

## Project Structure

```
custommadecvautomation/
├── .github/workflows/    # CI/CD configurations
├── .vscode/             # VS Code settings
├── fixtures/            # Test data and utilities
├── pages/               # Page Object Model classes
├── reports/             # Test execution reports
├── tests/               # Test specifications
├── test-results/        # Test artifacts
├── playwright.config.ts # Playwright configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- VS Code (recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd custommadecvautomation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Install system dependencies (if needed):
```bash
sudo npx playwright install-deps
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run specific browser tests
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run mobile tests
```bash
npm run test:mobile
```

### View test report
```bash
npm run report
```

## Code Quality

### Run ESLint
```bash
npm run lint
```

### Fix ESLint issues
```bash
npm run lint:fix
```

### Format code with Prettier
```bash
npm run format
```

### Check formatting
```bash
npm run format:check
```

## Writing Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Expected Title');
  });
});
```

### Using Page Objects
```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await loginPage.assertLoginSuccess();
});
```

### Using Test Helpers
```typescript
import { TestHelpers } from '../fixtures/TestHelpers';

test('test with helpers', async ({ page }) => {
  const email = TestHelpers.generateRandomEmail();
  await TestHelpers.mockAPIResponse(page, '/api/users', { success: true });
});
```

## Configuration

### Playwright Configuration
Edit `playwright.config.ts` to customize:
- Base URL
- Timeouts
- Browsers
- Reporter settings
- Test directory
- Output directories

### TypeScript Configuration
Edit `tsconfig.json` to modify TypeScript compiler options.

### Environment Variables
Create a `.env` file for environment-specific configurations:
```
BASE_URL=http://localhost:3000
API_URL=http://localhost:3001
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

## CI/CD

The project includes GitHub Actions workflow that:
- Runs tests on multiple browsers
- Performs parallel test execution with sharding
- Runs linting and formatting checks
- Uploads test artifacts
- Merges test reports

Workflow is triggered on:
- Push to main/develop branches
- Pull requests to main branch
- Daily schedule (2 AM UTC)

## Best Practices

1. **Page Objects**: Create a page object for each page/component
2. **Test Data**: Use fixtures for test data management
3. **Selectors**: Use data-testid attributes for reliable element selection
4. **Assertions**: Use Playwright's built-in assertions
5. **Parallelization**: Tests run in parallel by default
6. **Isolation**: Each test runs in a clean browser context
7. **Screenshots**: Captured automatically on failure
8. **Retries**: Failed tests retry automatically in CI

## Troubleshooting

### Permission Issues
If you encounter permission issues on Linux/Mac:
```bash
npm install --no-bin-links
```

### Browser Installation Issues
```bash
npx playwright install --force
sudo npx playwright install-deps
```

### Timeout Issues
Increase timeouts in `playwright.config.ts`:
```typescript
use: {
  actionTimeout: 30000,
  navigationTimeout: 60000,
}
```

## Contributing

1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Run linting and formatting
5. Submit a pull request

## License

This project is licensed under the ISC License.