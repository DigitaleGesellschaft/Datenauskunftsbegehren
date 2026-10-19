import { test, expect, type Page } from '@playwright/test';

const baseState = '"date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"';
const injectedImage = '<img src=x onerror=window.__injected=true>';

async function setOrgAddress(page: Page, orgName: string, address: string) {
  await page.route(/\/data_(de|fr)\.json$/, async route => {
    const response = await route.fetch();
    const json = await response.json();
    const org = json.orgs.find((o: { name: string }) => o.name === orgName);
    org.address = address;
    await route.fulfill({ json });
  });
}

async function wasInjected(page: Page) {
  return page.evaluate(() => (window as unknown as { __injected?: boolean }).__injected === true);
}

test('Adresse der Organisation wird als Text und nicht als HTML dargestellt', async ({ page }) => {
  await setOrgAddress(page, 'Migros', `Migros-Genossenschafts-Bund\n${injectedImage}\n8005 Zürich`);
  await page.goto(`#{"v":1,"org":"Migros","entry":"org","step":"print","name":"E2E Person",${baseState}}`);

  const addressTo = page.locator('[data-qa="letter"] .address-to');
  await expect(addressTo).toContainText('Migros-Genossenschafts-Bund');
  await expect(addressTo).toContainText(injectedImage);
  await expect(addressTo).toContainText('8005 Zürich');
  await expect(addressTo.locator('img')).toHaveCount(0);
  expect(await wasInjected(page)).toBe(false);
});

test('Zeilenumbrüche in der Adresse der Organisation bleiben erhalten', async ({ page }) => {
  await page.goto(`#{"v":1,"org":"Migros","entry":"org","step":"print","name":"E2E Person",${baseState}}`);

  const addressTo = page.locator('[data-qa="letter"] .address-to');
  await expect(addressTo).toContainText('Limmatstrasse 152');
  const text = await addressTo.innerText();
  expect(text).toContain('Migros-Genossenschafts-Bund\nM-Infoline\nLimmatstrasse 152\n8005 Zürich');
});

test('HTML aus dem URL-Fragment wird beim Laden entfernt', async ({ page }) => {
  await page.goto(`#{"v":1,"step":"print","name":"E2E ${injectedImage}Person","date":"${injectedImage}28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}`);

  const letter = page.locator('[data-qa="letter"]');
  await expect(letter).toContainText('E2E Person');
  await expect(letter).toContainText('28.7.2025');
  await expect(letter.locator('img')).toHaveCount(0);
  expect(await wasInjected(page)).toBe(false);
});

test('Eigene Einleitung aus dem URL-Fragment kann keine Kennungsfelder als HTML einfügen', async ({ page }) => {
  await page.goto(`#{"v":1,"step":"print","name":"E2E Person","customOpening":"Einleitung {string:org}","org":"${injectedImage}",${baseState}}`);

  const letter = page.locator('[data-qa="letter"]');
  await expect(letter).toContainText('Einleitung {string:org}');
  await expect(letter.locator('img')).toHaveCount(0);
  expect(await wasInjected(page)).toBe(false);
});

test('Absatz aus dem Datensatz kann keine Kennungsfelder als HTML einfügen', async ({ page }) => {
  await page.route(/\/data_(de|fr)\.json$/, async route => {
    const response = await route.fetch();
    const json = await response.json();
    const org = json.orgs.find((o: { name: string }) => o.name === 'Migros');
    org.privacyStatement.paragraphs = ['Absatz {string:desire}'];
    await route.fulfill({ json });
  });
  await page.goto(`#{"v":1,"org":"Migros","entry":"org","step":"print","name":"E2E Person","desire":"${injectedImage}",${baseState}}`);

  const letter = page.locator('[data-qa="letter"]');
  await expect(letter).toContainText('Absatz {string:desire}');
  await expect(letter.locator('img')).toHaveCount(0);
  expect(await wasInjected(page)).toBe(false);
});

test('Zeilenumbrüche und Sonderzeichen aus dem URL-Fragment bleiben erhalten', async ({ page }) => {
  await page.goto(`#{"v":1,"step":"print","name":"Muster &amp; Partner","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"Bahnhofstrasse 1<br>8001 Zürich"}`);

  const letter = page.locator('[data-qa="letter"]');
  await expect(letter.locator('.address-from')).toContainText('Muster & Partner');
  const address = letter.locator('.address-from [data-label="Deine Adresse"]');
  await expect(address.locator('br')).toHaveCount(1);
  await expect(address).toContainText('Bahnhofstrasse 1');
  await expect(address).toContainText('8001 Zürich');
});
