import { test, expect, Page } from '@playwright/test';
import { screenshotPath } from './screenshot';

// Gespeicherte Links können Geschäftsbereiche enthalten, die es im Datensatz nicht
// (mehr) gibt – etwa den entfernten Typ "gastro" (Datenauskunftsbegehren-Data#97) oder einen
// frei erfundenen Typ. Solche Links müssen weiterhin funktionieren.

const unknownTypes = [
  { name: 'entfernter Typ', handle: 'gastro' },
  { name: 'Fantasie-Typ', handle: 'e2e-fantasie' },
];

function urlFor(userData: object) {
  return '#' + encodeURI(JSON.stringify({ v: 1, langUi: 'de', langCor: 'de', ...userData }));
}

function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

for (const { name, handle } of unknownTypes) {
  test(`Einstieg über ${name} zeigt wieder die Startseite`, async ({ page }, testInfo) => {
    const errors = collectPageErrors(page);
    await page.goto(urlFor({ entry: 'type', types: [handle] }));

    // Statt einer leeren Eingabemaske erscheinen wieder die Einstiegsmöglichkeiten
    await expect(page.locator('button.one', { hasText: 'Adresshandel' })).toBeVisible();
    await expect(page.locator('div.data-entry-form')).toHaveCount(0);
    await expect.poll(() => page.url()).not.toContain(handle);
    expect(errors).toEqual([]);

    await page.screenshot({ path: screenshotPath(testInfo, `01-einstieg-${handle}.png`), fullPage: true });
  });

  test(`Organisation mit ${name} im Link: bekannte Dienste bleiben, Brief wird generiert`, async ({ page }, testInfo) => {
    const errors = collectPageErrors(page);
    await page.goto(urlFor({ entry: 'org', org: 'Swisscom', types: ['mobile', handle] }));

    const stepUI = page.locator('div.step-ui');
    await expect(stepUI.locator('h2')).toContainText('«Swisscom»');
    await expect(stepUI.locator('input[type="checkbox"][value="mobile"]')).toBeChecked();
    await expect(stepUI.locator('input[type="checkbox"]:checked')).toHaveCount(1);
    await expect.poll(() => page.url()).not.toContain(handle);

    await stepUI.locator('input[type="tel"]').fill('+41 79 123 45 67');
    await stepUI.locator('input#userName').fill('E2E Person');
    await stepUI.locator('textarea#userAddress').fill('E2E Strasse\n1000 E2EOrt');

    await page.screenshot({ path: screenshotPath(testInfo, `01-org-formular-${handle}.png`), fullPage: true });

    await page.locator('button', { hasText: 'Brief generieren' }).click();
    const letter = page.locator('[data-qa="letter"]');
    await expect(letter).toContainText('Swisscom (Schweiz) AG');
    await expect(letter).toContainText('Mobilfunk');
    await expect(letter).toContainText('E2E Person');
    expect(errors).toEqual([]);

    await page.screenshot({ path: screenshotPath(testInfo, `02-org-brief-${handle}.png`), fullPage: true });
  });

  test(`Gespeicherter Brief mit ${name} wird ohne diesen Geschäftsbereich angezeigt`, async ({ page }, testInfo) => {
    const errors = collectPageErrors(page);
    await page.goto(urlFor({
      step: 'data_info_request',
      entry: 'org',
      org: 'Lunchgate AG',
      types: [handle],
      name: 'E2E Person',
      address: 'E2E Strasse\n1000 E2EOrt',
      date: '28.7.2025',
    }));

    const letter = page.locator('[data-qa="letter"]');
    await expect(letter).toContainText('Lunchgate AG');
    await expect(letter).toContainText('Badenerstrasse 255');
    await expect(letter).toContainText('E2E Person');
    await expect(letter).not.toContainText('Gastronomie');
    await expect(letter).not.toContainText('Contact Tracing');
    expect(errors).toEqual([]);

    await page.screenshot({ path: screenshotPath(testInfo, `01-brief-${handle}.png`), fullPage: true });
  });
}
