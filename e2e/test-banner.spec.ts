import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';
import packageJson from '../package.json' with { type: 'json' };

const gitRevision = process.env.GIT_REVISION || execSync('git rev-parse --short HEAD').toString().trim();

test('TestBanner ist sichtbar und zeigt Version und Git-Revision', async ({ page }) => {
  await page.goto('');

  const banner = page.locator('.test-banner');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(packageJson.version);
  await expect(banner).toContainText(gitRevision);
});
