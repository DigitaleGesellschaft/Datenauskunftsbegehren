import type { TestInfo } from '@playwright/test';
import path from 'path';

export function screenshotPath(testInfo: TestInfo, name: string): string {
  const safeTitle = testInfo.title
    .replace(/[^\w]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
  return path.join('screenshots', testInfo.project.name, `${safeTitle}--${name}.png`);
}
