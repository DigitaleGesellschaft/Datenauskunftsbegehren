import { test, expect } from '@playwright/test';

const baseState = '"name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"';

// Regression: "Brief Auskunftsbegehren" via StepOne desires section set entry='followup' +
// desire='data_info_request', causing both the main letter and a followup letter to render
// simultaneously when printing.
test('Brief Auskunftsbegehren zeigt beim Drucken exakt einen Brief', async ({ page }) => {
  const url = `#{"v":1,"entry":"followup","desire":"data_info_request","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('section[id="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).toContainText('Datenauskunftsbegehren');
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
});

test('Normaler Brief zeigt beim Drucken exakt einen Brief', async ({ page }) => {
  const url = `#{"v":1,"step":"print",${baseState}}`;
  await page.goto(url);

  await expect(page.locator('section[id="letter"]')).toHaveCount(1);
});

test('Nachfassen ausbleibende Auskunft zeigt beim Drucken exakt einen Brief', async ({ page }) => {
  const url = `#{"v":1,"entry":"followup","desire":"unanswered","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('section[id="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).toContainText('Ausbleibende Auskunft');
});

test('Nachfassen unvollständige Antwort zeigt beim Drucken exakt einen Brief', async ({ page }) => {
  const url = `#{"v":1,"entry":"followup","desire":"incomplete_answer","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('section[id="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
  await expect(letterSections.first()).toContainText('Ich gehe davon aus, dass insbesondere folgende Informationen fehlen');
});

test('Nachfassen Daten korrigieren zeigt beim Drucken exakt einen Brief', async ({ page }) => {
  const url = `#{"v":1,"entry":"followup","desire":"data_correction","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('section[id="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
  await expect(letterSections.first()).toContainText('Aufgrund Ihrer Auskunft stellte ich fest, dass von Ihnen bearbeitete Personendaten unrichtig sind.');
});

test('Nachfassen Daten löschen zeigt beim Drucken exakt einen Brief', async ({ page }) => {
  const url = `#{"v":1,"entry":"followup","desire":"data_deletion","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('section[id="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
  await expect(letterSections.first()).toContainText('Aufgrund Ihrer Auskunft ersuche ich Sie, folgende Personendaten zu löschen:');
});

test('Kurzer Brief erzeugt beim Drucken eine PDF-Seite', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'PDF-Generierung nur in Chromium verfügbar');

  const url = `#{"v":1,"entry":"followup","desire":"unanswered","step":"print",${baseState}}`;
  await page.goto(url);

  const pdf = await page.pdf({ format: 'A4' });
  // Count PDF pages: each page dictionary has /Type /Page (singular, not /Pages)
  const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
  expect(pageCount).toBe(1);
});

test('Brief Auskunftsbegehren via Einstiegsmaske zeigt nur einen Brief', async ({ page }) => {
  await page.goto('');

  // "Brief Auskunftsbegehren" aus der Desires-Liste in StepOne auswählen
  const briefButton = page.locator('button', { hasText: 'Brief Auskunftsbegehren' });
  await briefButton.click();

  // Adressfelder ausfüllen (StepFollowUp)
  const userNameField = page.locator('input#userName');
  await userNameField.fill('E2E Person');
  const userAddressField = page.locator('textarea#userAddress');
  await userAddressField.fill('E2E Strasse\n1000 E2EOrt');
  const orgAddressField = page.locator('textarea#orgAddress');
  await orgAddressField.fill('E2E Empfänger');

  // Brief generieren
  const generateButton = page.locator('button', { hasText: 'Brief generieren' });
  await generateButton.click();

  // Nur ein Brief soll sichtbar sein
  const letterSections = page.locator('section[id="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).toContainText('Datenauskunftsbegehren');
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
});
