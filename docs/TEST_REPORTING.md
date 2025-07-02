# Test Reporting Documentation

This project uses two complementary test reporting solutions:

## 1. Local Summary Reporter

For local development, we use a custom summary reporter that provides a concise test summary in the terminal and saves it to a file.

### Features:
- Shows passed, failed, skipped, and flaky tests
- Displays total test count and duration
- Shows success percentage
- Lists failure details with error messages
- Saves summary to `reports/summary.txt`

### Configuration:
The reporter is configured in `playwright.config.ts`:

```typescript
reporter: [
  ['./reporters/summary-reporter.ts', { 
    outputFile: 'reports/summary.txt',
    showError: true,
    showPassed: true,
    showFailed: true,
    showSkipped: true,
    showFlaky: true
  }]
]
```

### Usage:
Simply run your tests normally:
```bash
npx playwright test
```

The summary will be displayed in the terminal and saved to `reports/summary.txt`.

## 2. GitHub Actions Reporter

For CI/CD, we use the `playwright-report-summary` GitHub Action (gyilmaz fork) that posts test results as pull request comments.

### Features:
- Posts test results as PR comments
- Shows test statistics and trends
- Provides links to artifacts
- Updates existing comments instead of creating new ones

### Configuration:
The GitHub Action is configured in `.github/workflows/playwright-tests.yml`:

```yaml
- name: Report test results
  uses: gyilmaz/playwright-report-summary@v3
  if: always()
  with:
    report-file: reports/results.json
    github-token: ${{ secrets.GITHUB_TOKEN }}
    comment-title: 'Playwright Test Results'
```

### How it works:
1. Tests run in GitHub Actions
2. Results are saved to `reports/results.json` (via the json reporter)
3. The action reads the JSON report and creates/updates a PR comment
4. Test artifacts are uploaded for debugging failed tests

## Report Files

After running tests, you'll find:
- `reports/summary.txt` - Human-readable test summary
- `reports/results.json` - Machine-readable test results (for GitHub Action)
- `reports/html/index.html` - Interactive HTML report
- `test-results/` - Screenshots, videos, and traces for failed tests

## Viewing Reports

### Local:
- Terminal output (immediate feedback)
- `cat reports/summary.txt` (saved summary)
- `npx playwright show-report` (interactive HTML report)

### GitHub:
- PR comments (automated by GitHub Action)
- Artifacts in Actions tab (downloadable reports)