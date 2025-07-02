# CustomMadeCV Smoke Tests

This test suite contains comprehensive smoke tests for the CustomMadeCV application, covering all major user flows.

## Test Coverage

### 1. **Login Tests** (`tests/smoke/login.spec.ts`)
- ✅ Display login page elements
- ✅ Successful login with valid credentials
- ✅ Error handling for invalid credentials
- ✅ Form validation
- ✅ Navigation to sign up and forgot password

### 2. **Resume Upload Tests** (`tests/smoke/resume-upload.spec.ts`)
- ✅ Complete resume generation flow (5 steps)
- ✅ Resume file upload
- ✅ Job details entry
- ✅ ATS keyword analysis and selection
- ✅ Resume generation with AI
- ✅ PDF generation and download

### 3. **Resume Builder Tests** (`tests/smoke/resume-builder.spec.ts`)
- ✅ Fill basic information
- ✅ Add work experience
- ✅ Add education
- ✅ Add skills
- ✅ Navigate between sections
- ✅ Generate and download PDF

### 4. **Job Tracker Tests** (`tests/smoke/job-tracker.spec.ts`)
- ✅ Add new job applications
- ✅ Search and filter jobs
- ✅ Edit job details
- ✅ Delete jobs
- ✅ Sort by different columns

## Prerequisites

1. Node.js and npm installed
2. Test user account on custommadecv.com:
   - Email: `pwrighttest@playwrighttest.com`
   - Password: `BNB,m#%B6=d]m+#`

## Running the Tests

### Install Dependencies
```bash
npm install
```

### Run All Smoke Tests
```bash
npm test tests/smoke/
```

### Run Specific Test Suite
```bash
# Login tests only
npm test tests/smoke/login.spec.ts

# Resume upload tests only
npm test tests/smoke/resume-upload.spec.ts

# Resume builder tests only
npm test tests/smoke/resume-builder.spec.ts

# Job tracker tests only
npm test tests/smoke/job-tracker.spec.ts
```

### Run with UI Mode (Interactive)
```bash
npm test -- --ui
```

### Run with Specific Browser
```bash
# Chrome only
npm test -- --project=chromium

# Firefox only
npm test -- --project=firefox

# Safari only
npm test -- --project=webkit
```

### Run in Headed Mode (See Browser)
```bash
npm test -- --headed
```

### Generate HTML Report
```bash
npm test -- --reporter=html
npx playwright show-report
```

## Test Configuration

- **Base URL**: https://custommadecv.com
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: On failure only

## Debugging Tests

### Debug Single Test
```bash
npm test tests/smoke/login.spec.ts -- --debug
```

### Run with Trace Viewer
```bash
npm test -- --trace on
```

### View Test Results
After running tests, view detailed results:
```bash
npx playwright show-report
```

## CI/CD Integration

These tests are designed to run in CI/CD pipelines. Example GitHub Actions workflow:

```yaml
name: Smoke Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test tests/smoke/
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Common Issues & Solutions

### Issue: Login fails
- Verify credentials are correct
- Check if the site is accessible
- Clear browser cookies/cache

### Issue: Resume upload timeout
- The resume processing can take up to 90 seconds
- Ensure stable internet connection
- Check file size (should be under 5MB)

### Issue: Elements not found
- Page structure may have changed
- Update selectors in page objects
- Check for dynamic loading with proper waits

## Best Practices

1. **Run tests in order**: Some tests may depend on data from previous tests
2. **Clean test data**: Periodically clean up test jobs and resumes
3. **Monitor test stability**: Track flaky tests and add retries/waits as needed
4. **Keep tests independent**: Each test should be able to run standalone

## Extending the Tests

To add new test cases:

1. Create new test file in `tests/smoke/` directory
2. Import required page objects
3. Follow the existing pattern:
   - Login in beforeEach
   - Test specific functionality
   - Clean up if needed

Example:
```typescript
import { test, expect } from '@playwright/test';
import { CustomMadeCVLoginPage } from '../../pages/CustomMadeCVLoginPage';

test.describe('New Feature Tests', () => {
  // Your tests here
});
```