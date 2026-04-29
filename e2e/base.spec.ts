import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';
import packageJson from '../package.json' with { type: 'json' };

const gitRevision = process.env.GIT_REVISION || execSync('git rev-parse --short HEAD').toString().trim();

test('Seite wird mit dynamisch generiertem Titel angezeigt', async ({ page }) => {
  await page.goto('');

  const h1Text = await page.locator('h1').textContent();
  expect(h1Text).toBe('Generiere dein Datenauskunftsbegehren');
});

test('Info kann angezeigt werden und zeigt Version und Git-Revision', async ({ page }) => {
  await page.goto('');

  const creditsButton = page.locator('button.circle.one').last();
  await creditsButton.click();

  const credits = page.locator('.credits');
  await expect(credits.locator('text=Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen.')).toBeVisible();
  await expect(credits).toContainText(packageJson.version);
  await expect(credits).toContainText(gitRevision);
});
