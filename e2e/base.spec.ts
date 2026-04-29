import { test, expect } from '@playwright/test';
import { screenshotPath } from './screenshot';

test('Seite wird mit dynamisch generiertem Titel angezeigt', async ({ page }, testInfo) => {
  await page.goto('');

  const h1Text = await page.locator('h1').textContent();
  expect(h1Text).toBe('Generiere dein Datenauskunftsbegehren');

  await page.screenshot({ path: screenshotPath(testInfo, '01-startseite.png'), fullPage: true });
});

test('Info kann angezeigt werden', async ({ page }, testInfo) => {
  await page.goto('');

  await page.screenshot({ path: screenshotPath(testInfo, '01-startseite.png'), fullPage: true });

  // Info anzeigen (letzter button.circle.one in der Header-Leiste)
  const creditsButton = page.locator('button.circle.one').last();
  await creditsButton.click();

  // Prüfen, dass der entsprechende Text angezeigt wird
  const textLocator = page.locator('text=Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen.');
  await expect(textLocator).toBeVisible();

  await page.screenshot({ path: screenshotPath(testInfo, '02-info-overlay.png'), fullPage: true });
});
