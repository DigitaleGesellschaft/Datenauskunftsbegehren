import { test, expect, Page } from '@playwright/test';

async function fillUserAddress(page: Page, name: string, address: string) {
  await page.locator('input#userName').fill(name);
  await page.locator('textarea#userAddress').fill(address);
}

async function selectEvent(page: Page, eventLabel: string) {
  await page.goto('');
  await page.locator('button.one', { hasText: eventLabel }).click();
  await expect(page.locator('div.data-entry-form')).toBeVisible();
}

async function generateLetter(page: Page) {
  await page.locator('button', { hasText: 'Brief generieren' }).click();
  await expect(page.locator('section#letter')).toBeVisible();
}

test('Ereignis Werbeanruf: Brief enthält Datum und Telefonnummer', async ({ page }) => {
  await selectEvent(page, 'Ich habe einen Werbeanruf erhalten');
  await page.getByLabel('Wann').fill('2024-03-15');
  await page.getByLabel('Telefon-Nr.').fill('+41 44 123 45 67');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Werbeanruf');
  await expect(letter).toContainText('15.03.2024');
  await expect(letter).toContainText('+41 44 123 45 67');
  await expect(letter).toContainText('E2E Person');
});

test('Ereignis Werbemail: Brief enthält Datum und E-Mail-Adresse', async ({ page }) => {
  await selectEvent(page, 'Ich habe ein Werbemail erhalten');
  await page.getByLabel('Wann').fill('2024-06-20');
  await page.getByLabel('E-Mail-Adresse').fill('test@example.com');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Werbemail');
  await expect(letter).toContainText('20.06.2024');
  await expect(letter).toContainText('test@example.com');
  await expect(letter).toContainText('E2E Person');
});

test('Ereignis Werbung per Post: Brief enthält Datum', async ({ page }) => {
  await selectEvent(page, 'Mir wurde Werbung per Post zugestellt');
  await page.getByLabel('Wann').fill('2024-09-10');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Werbung per Post');
  await expect(letter).toContainText('10.09.2024');
  await expect(letter).toContainText('E2E Person');
});

test('Ereignis Gerücht: Brief enthält den spezifischen Absatz', async ({ page }) => {
  await selectEvent(page, 'Ich habe vernommen, dass ...');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Im Zusammenhang mit');
  await expect(letter).toContainText('werden Personendaten bearbeitet');
  await expect(letter).toContainText('E2E Person');
});
