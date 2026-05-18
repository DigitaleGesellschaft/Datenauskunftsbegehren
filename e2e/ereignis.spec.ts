import { test, expect, Page } from '@playwright/test';
import { screenshotPath } from './screenshot';

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

test('Ereignis Werbeanruf: Brief enthält Datum und Telefonnummer', async ({ page }, testInfo) => {
  await selectEvent(page, 'Ich habe einen Werbeanruf erhalten');
  await page.getByLabel('Wann').fill('2024-03-15');
  await page.getByLabel('Telefon-Nr.').fill('+41 44 123 45 67');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');

  await page.screenshot({ path: screenshotPath(testInfo, '01-werbeanruf-formular.png'), fullPage: true });

  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Werbeanruf');
  await expect(letter).toContainText('15.03.2024');
  await expect(letter).toContainText('+41 44 123 45 67');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '02-werbeanruf-brief.png'), fullPage: true });
});

test('Ereignis Werbemail: Brief enthält Datum und E-Mail-Adresse', async ({ page }, testInfo) => {
  await selectEvent(page, 'Ich habe ein Werbemail erhalten');
  await page.getByLabel('Wann').fill('2024-06-20');
  await page.getByLabel('E-Mail-Adresse').fill('test@example.com');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');

  await page.screenshot({ path: screenshotPath(testInfo, '01-werbemail-formular.png'), fullPage: true });

  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Werbemail');
  await expect(letter).toContainText('20.06.2024');
  await expect(letter).toContainText('test@example.com');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '02-werbemail-brief.png'), fullPage: true });
});

test('Ereignis Werbung per Post: Brief enthält Datum', async ({ page }, testInfo) => {
  await selectEvent(page, 'Mir wurde Werbung per Post zugestellt');
  await expect(page.locator('h2')).toContainText('Mir wurde Werbung per Post zugestellt');
  await page.getByLabel('Wann').fill('2024-09-10');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');

  await page.screenshot({ path: screenshotPath(testInfo, '01-werbung-post-formular.png'), fullPage: true });

  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Werbung per Post');
  await expect(letter).toContainText('10.09.2024');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '02-werbung-post-brief.png'), fullPage: true });
});

test('Ereignis Gerücht: Brief enthält den spezifischen Absatz', async ({ page }, testInfo) => {
  await selectEvent(page, 'Ich habe vernommen, dass ...');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');

  await page.screenshot({ path: screenshotPath(testInfo, '01-geruecht-formular.png'), fullPage: true });

  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Im Zusammenhang mit');
  await expect(letter).toContainText('werden Personendaten bearbeitet');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '02-geruecht-brief.png'), fullPage: true });
});
