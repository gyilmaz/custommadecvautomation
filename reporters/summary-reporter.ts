import { Reporter, TestCase, TestResult, FullResult, Suite } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface SummaryReporterOptions {
  outputFile?: string;
  showError?: boolean;
  showPassed?: boolean;
  showFailed?: boolean;
  showSkipped?: boolean;
  showFlaky?: boolean;
}

export default class SummaryReporter implements Reporter {
  private options: SummaryReporterOptions;
  private results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    total: 0,
    duration: 0,
    failures: [] as Array<{ test: string; error: string }>,
  };

  constructor(options: SummaryReporterOptions = {}) {
    this.options = {
      outputFile: options.outputFile || 'reports/summary.txt',
      showError: options.showError !== false,
      showPassed: options.showPassed !== false,
      showFailed: options.showFailed !== false,
      showSkipped: options.showSkipped !== false,
      showFlaky: options.showFlaky !== false,
    };
  }

  onBegin(config: any, suite: Suite) {
    this.results.total = suite.allTests().length;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.duration += result.duration;

    if (result.status === 'passed') {
      this.results.passed++;
    } else if (result.status === 'failed') {
      this.results.failed++;
      if (this.options.showError && result.error) {
        this.results.failures.push({
          test: test.titlePath().join(' › '),
          error: result.error.message || 'Unknown error',
        });
      }
    } else if (result.status === 'skipped') {
      this.results.skipped++;
    } else if (result.status === 'flaky') {
      this.results.flaky++;
    }
  }

  async onEnd(result: FullResult) {
    const summary = this.generateSummary();
    
    // Print to console
    console.log('\n' + summary);
    
    // Write to file if specified
    if (this.options.outputFile) {
      const outputDir = path.dirname(this.options.outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(this.options.outputFile, summary);
    }
  }

  private generateSummary(): string {
    const lines: string[] = [];
    const percentage = this.results.total > 0 
      ? Math.round((this.results.passed / this.results.total) * 100) 
      : 0;
    const duration = (this.results.duration / 1000).toFixed(1);

    lines.push('═'.repeat(60));
    lines.push('TEST SUMMARY');
    lines.push('═'.repeat(60));
    lines.push('');
    
    if (this.options.showPassed) {
      lines.push(`✓ Passed:  ${this.results.passed}`);
    }
    if (this.options.showFailed) {
      lines.push(`✗ Failed:  ${this.results.failed}`);
    }
    if (this.options.showSkipped) {
      lines.push(`- Skipped: ${this.results.skipped}`);
    }
    if (this.options.showFlaky) {
      lines.push(`⚡ Flaky:   ${this.results.flaky}`);
    }
    
    lines.push('─'.repeat(60));
    lines.push(`Total:     ${this.results.total} tests`);
    lines.push(`Duration:  ${duration}s`);
    lines.push(`Success:   ${percentage}%`);
    
    if (this.results.failures.length > 0 && this.options.showError) {
      lines.push('');
      lines.push('FAILURES:');
      lines.push('─'.repeat(60));
      for (const failure of this.results.failures) {
        lines.push(`\n❌ ${failure.test}`);
        lines.push(`   ${failure.error.split('\n')[0]}`);
      }
    }
    
    lines.push('═'.repeat(60));
    
    return lines.join('\n');
  }
}