import { test, expect, type Page } from '@playwright/test';

async function collectViolations(page: Page) {
  await page.addInitScript(() => {
    const violations: string[] = [];
    (window as unknown as { __cspViolations: string[] }).__cspViolations = violations;
    document.addEventListener('securitypolicyviolation', event => {
      violations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  return () => page.evaluate(() => (window as unknown as { __cspViolations: string[] }).__cspViolations);
}

test('Content Security Policy ist gesetzt', async ({ page }) => {
  await page.goto('');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("script-src 'self'");
  expect(csp).toContain("object-src 'none'");
});

test('Startseite und Brief laufen ohne Verletzung der Content Security Policy', async ({ page }) => {
  const violations = await collectViolations(page);

  await page.goto('');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  expect(await violations()).toEqual([]);

  await page.goto('#{"v":1,"org":"Migros","entry":"org","step":"print","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}');
  await page.reload();
  await expect(page.locator('[data-qa="letter"]')).toContainText('Migros-Genossenschafts-Bund');
  expect(await violations()).toEqual([]);
});
