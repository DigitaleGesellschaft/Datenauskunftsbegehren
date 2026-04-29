import { test, expect, Page } from '@playwright/test';
import { screenshotPath } from './screenshot';

async function fillUserAddress(page: Page, name: string, address: string) {
  await page.locator('input#userName').fill(name);
  await page.locator('textarea#userAddress').fill(address);
}

async function selectType(page: Page, typeLabel: string) {
  await page.goto('');
  await page.locator('button.one', { hasText: typeLabel }).click();
  await expect(page.locator('div.data-entry-form')).toBeVisible();
}

async function generateLetter(page: Page) {
  await page.locator('button', { hasText: 'Brief generieren' }).click();
  await expect(page.locator('section#letter')).toBeVisible();
}

test('Geschäftsbereich Adresshandel: Brief enthält spezifischen Absatz', async ({ page }, testInfo) => {
  await selectType(page, 'Adresshandel');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Adresshandel');
  await expect(letter).toContainText('Zielgruppen');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-adresshandel.png'), fullPage: true });
});

test('Geschäftsbereich Kreditauskunft: Brief enthält spezifischen Absatz', async ({ page }, testInfo) => {
  await selectType(page, 'Kreditauskunft');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Kreditauskunft');
  await expect(letter).toContainText('Bonitätsprüfung');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-kreditauskunft.png'), fullPage: true });
});

test('Geschäftsbereich Gastrodaten: Brief enthält spezifischen Absatz', async ({ page }, testInfo) => {
  await selectType(page, 'Gastrodaten');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Gastronomie');
  await expect(letter).toContainText('Contact Tracing');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-gastrodaten.png'), fullPage: true });
});

test('Geschäftsbereich Kundenkarten-Anbieter: Brief enthält spezifischen Absatz', async ({ page }, testInfo) => {
  await selectType(page, 'Kundenkarten-Anbieter');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Kundenkarte');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-kundenkarte.png'), fullPage: true });
});

test('Geschäftsbereich Mobilfunkprovider: Brief enthält BÜPF-Absatz und Handy-Nummer', async ({ page }, testInfo) => {
  await selectType(page, 'Mobilfunkprovider');
  await page.getByLabel('Handy-Nummer').fill('+41 79 123 45 67');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Mobilfunk');
  await expect(letter).toContainText('BÜPF');
  await expect(letter).toContainText('+41 79 123 45 67');
  await expect(letter).toContainText('Art. 45 FMG');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-mobilfunk.png'), fullPage: true });
});

test('Geschäftsbereich Mobilität: Brief enthält Fahrzeug-Absatz und Fahrzeuginformationen', async ({ page }, testInfo) => {
  await selectType(page, 'Mobilität');
  await page.getByLabel('Infos zum Fahrzeug').fill('VW Golf, ZH 123 456');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Mobilität');
  await expect(letter).toContainText('Fahrzeug');
  await expect(letter).toContainText('VW Golf, ZH 123 456');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-mobilitaet.png'), fullPage: true });
});

test('Geschäftsbereich Online-Portal: Brief enthält E-Mail-Adresse', async ({ page }, testInfo) => {
  await selectType(page, 'Online-Portal');
  await page.getByLabel('E-Mail-Adresse').fill('test@example.com');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('Online-Portal');
  await expect(letter).toContainText('Kundenaktivität');
  await expect(letter).toContainText('test@example.com');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-online-portal.png'), fullPage: true });
});

test('Geschäftsbereich Parkplatz-Anbieter: Brief enthält spezifischen Absatz', async ({ page }, testInfo) => {
  await selectType(page, 'Parkplatz-Anbieter');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('parkingprovider');
  await expect(letter).toContainText('Parkieren');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-parkplatz.png'), fullPage: true });
});

test('Geschäftsbereich WLAN-Anbieter: Brief enthält BÜPF-Absatz und Handy-Nummer', async ({ page }, testInfo) => {
  await selectType(page, 'WLAN-Anbieter');
  await page.getByLabel('Handy-Nummer').fill('+41 79 987 65 43');
  await fillUserAddress(page, 'E2E Person', 'E2E Strasse\n1000 E2EOrt');
  await generateLetter(page);

  const letter = page.locator('section#letter');
  await expect(letter).toContainText('WLAN');
  await expect(letter).toContainText('BÜPF');
  await expect(letter).toContainText('+41 79 987 65 43');
  await expect(letter).toContainText('Art. 45 FMG');
  await expect(letter).toContainText('E2E Person');

  await page.screenshot({ path: screenshotPath(testInfo, '01-brief-wlan.png'), fullPage: true });
});
