import { test, expect } from '@playwright/test';

test('Seite wird mit Titel angezeigt', async ({ page }) => {
  await page.goto('');

  const h1Text = await page.locator('h1').textContent();
  expect(h1Text).toBe('Generiere dein Datenauskunftsbegehren');
});

test('Info kann angezeigt werden', async ({ page }) => {
  await page.goto('');

  // Info anzeigen
  const creditsButton = page.locator('button.credits');
  await creditsButton.click();

  // Prüfen, dass der entsprechende Text angezeigt wird
  const textLocator = page.locator('text=Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen.');
  await expect(textLocator).toBeVisible();
});