import { test, expect } from '@playwright/test';
import { screenshotPath } from './screenshot';

const baseState = '"name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"';

// Regression: "Brief Auskunftsbegehren" via StepOne desires section set entry='followup' +
// desire='data_info_request', causing both the main letter and a followup letter to render
// simultaneously when printing.
test('Brief Auskunftsbegehren zeigt beim Drucken exakt einen Brief', async ({ page }, testInfo) => {
  const url = `#{"v":1,"entry":"followup","desire":"data_info_request","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('[data-qa="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).toContainText('Datenauskunftsbegehren');
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');

  await page.screenshot({ path: screenshotPath(testInfo, '01-druckansicht-auskunftsbegehren.png'), fullPage: true });
});

test('Normaler Brief zeigt beim Drucken exakt einen Brief', async ({ page }, testInfo) => {
  const url = `#{"v":1,"step":"print",${baseState}}`;
  await page.goto(url);

  await expect(page.locator('[data-qa="letter"]')).toHaveCount(1);

  await page.screenshot({ path: screenshotPath(testInfo, '01-druckansicht-normal.png'), fullPage: true });
});

test('Nachfassen ausbleibende Auskunft zeigt beim Drucken exakt einen Brief', async ({ page }, testInfo) => {
  const url = `#{"v":1,"entry":"followup","desire":"unanswered","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('[data-qa="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).toContainText('Ausbleibende Auskunft');

  await page.screenshot({ path: screenshotPath(testInfo, '01-druckansicht-ausbleibende-auskunft.png'), fullPage: true });
});

test('Nachfassen unvollständige Antwort zeigt beim Drucken exakt einen Brief', async ({ page }, testInfo) => {
  const url = `#{"v":1,"entry":"followup","desire":"incomplete_answer","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('[data-qa="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
  await expect(letterSections.first()).toContainText('Ich gehe davon aus, dass insbesondere folgende Informationen fehlen');

  await page.screenshot({ path: screenshotPath(testInfo, '01-druckansicht-unvollstaendige-antwort.png'), fullPage: true });
});

test('Nachfassen Daten korrigieren zeigt beim Drucken exakt einen Brief', async ({ page }, testInfo) => {
  const url = `#{"v":1,"entry":"followup","desire":"data_correction","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('[data-qa="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
  await expect(letterSections.first()).toContainText('Aufgrund Ihrer Auskunft stellte ich fest, dass von Ihnen bearbeitete Personendaten unrichtig sind.');

  await page.screenshot({ path: screenshotPath(testInfo, '01-druckansicht-daten-korrigieren.png'), fullPage: true });
});

test('Nachfassen Daten löschen zeigt beim Drucken exakt einen Brief', async ({ page }, testInfo) => {
  const url = `#{"v":1,"entry":"followup","desire":"data_deletion","step":"print",${baseState}}`;
  await page.goto(url);

  const letterSections = page.locator('[data-qa="letter"]');
  await expect(letterSections).toHaveCount(1);
  await expect(letterSections.first()).not.toContainText('Ausbleibende Auskunft');
  await expect(letterSections.first()).toContainText('Aufgrund Ihrer Auskunft ersuche ich Sie, folgende Personendaten zu löschen:');

  await page.screenshot({ path: screenshotPath(testInfo, '01-druckansicht-daten-loeschen.png'), fullPage: true });
});


test('Print-Seite zeigt aufgelösten causa-Text ohne Platzhalter', async ({ page }) => {
  const url = `#{"v":1,"langUi":"de","langCor":"de","org":"Migros","entry":"org","types":["payback","online","wlan"],"step":"print",${baseState}}`;
  await page.goto(url);

  const sendByPostPara = page.locator('.step-print p').first();
  await expect(sendByPostPara).not.toContainText('{causa}');
  await expect(sendByPostPara).toContainText('das Datenauskunftsbegehren');
});
