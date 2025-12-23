import { test, expect } from '@playwright/test';

test('Der generierte Brief enthält die Daten aus der Url', async ({ page }) => {
  const url = '#{"v":1,"step":"data_info_request","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}';
  await page.goto(url);

  const letterSection = await page.locator('section#letter');

  const sectionText = await letterSection.textContent();
  
  // Prüfen, dass die Daten aus der URL im Brief zu finden sind
  expect(sectionText).toContain('E2E Person');
  expect(sectionText).toContain('E2E Absender');
  expect(sectionText).toContain('E2E Empfänger');
  expect(sectionText).toContain('28.7.2025');
});

test('Datenauskunftsbegehren für Swisscom generieren', async ({ page }) => {
  await page.goto('');

  // Organisationsauswahl öffnen, prüfen, dass diese gut belegt ist und Swisscom auswählen
  const searchInput = page.locator('input[placeholder="Suche ..."]');
  
  await searchInput.click();

  const listContainer = page.locator('div.listContainer');
  await expect(listContainer).toContainText('Agrisano');
  await expect(listContainer).toContainText('Coop Rechtsschutz');
  await expect(listContainer).toContainText('Mercedes');
  await expect(listContainer).toContainText('Swiss Life');

  await searchInput.fill('Swisscom');
  const swisscomOption = listContainer.locator('div.item >> nth=2');
  await swisscomOption.click();

  // Eingabemaske erscheint
  const stepUI = page.locator('div.step-ui');
  await expect(stepUI).toBeVisible();
  await expect(stepUI.locator('h2')).toContainText('Mach noch einige Angaben für das Auskunftsbegehren «Swisscom»');
  const mobileCheckbox = stepUI.locator('input[type="checkbox"][value="mobile"]');
  await expect(mobileCheckbox).toBeChecked();
  const onlineCheckbox = stepUI.locator('input[type="checkbox"][value="online"]');
  await expect(onlineCheckbox).toBeChecked();
  const wlanCheckbox = stepUI.locator('input[type="checkbox"][value="wlan"]');
  await expect(wlanCheckbox).toBeChecked();

  // E-Mail Feld ist da und verschwindet nachdem Online-Portal abgewählt wird
  const emailField = stepUI.locator('input[type="email"]');
  await expect(emailField).toBeVisible();
  await onlineCheckbox.click();
  await expect(emailField).toBeHidden();

  // Felder ausfüllen
  const telField = stepUI.locator('input[type="tel"]');
  await telField.fill('+41 123 45 67');
  const userNameField = stepUI.locator('input#userName');
  await userNameField.fill('E2E Test');
  const userAddressField = stepUI.locator('textarea#userAddress');
  await userAddressField.fill('E2E Strasse\n1000 E2EOrt');

  // Brief erstellen und Inhalt prüfen
  const generateButton = page.locator('button', { hasText: 'Brief generieren' });
  await generateButton.click();
  const letterSection = page.locator('section#letter');
  await expect(letterSection).toContainText('E2E Test');
  await expect(letterSection).toContainText('E2E Strasse');
  await expect(letterSection).toContainText('1000 E2EOrt');
  await expect(letterSection).toContainText('Swisscom (Schweiz) AG');
  await expect(letterSection).toContainText('Mobilfunk');
  await expect(letterSection).toContainText('WLAN');
  await expect(letterSection).not.toContainText('Online-Portal');
});