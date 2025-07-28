import { test, expect } from '@playwright/test';

test('Nachfassen bei ausbleibender Antwort', async ({ page }) => {
  const url = '#{"v":1,"step":"data_info_request","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}';
  await page.goto(url);

  // Nachfassen und erhielt keine Antwort auswählen
  const nachfassenButton = page.locator('button', { hasText: 'Nachfassen' });
  await nachfassenButton.click();
  const keineAntwortButton = page.locator('button', { hasText: 'Ich erhielt keine Antwort' });
  await keineAntwortButton.click();

  // Prüfen, dass es sich um die Vorlage ausbleibende Auskunft handelt
  const letterSection = await page.locator('section#letter');
  const sectionText = await letterSection.textContent();
  expect(sectionText).toContain('Datenauskunftsbegehren / Ausbleibende Auskunft');
  expect(sectionText).toContain('E2E Person');
  expect(sectionText).toContain('E2E Absender');
  expect(sectionText).toContain('E2E Empfänger');
  expect(sectionText).toContain('28.7.2025');
});

test('Nachfassen unvollständige Antwort', async ({ page }) => {
  const url = '#{"v":1,"step":"data_info_request","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}';
  await page.goto(url);

  // Nachfassen und unvollständige Antwort auswählen
  const nachfassenButton = page.locator('button', { hasText: 'Nachfassen' });
  await nachfassenButton.click();
  const keineAntwortButton = page.locator('button', { hasText: 'Ich erhielt unvollständige Antwort' });
  await keineAntwortButton.click();

  // Prüfen, dass es sich um die Vorlage unvollständige Antwort handelt
  const letterSection = await page.locator('section#letter');
  const sectionText = await letterSection.textContent();
  expect(sectionText).toContain('Ich gehe davon aus, dass insbesondere folgende Informationen fehlen');
  expect(sectionText).toContain('E2E Person');
  expect(sectionText).toContain('E2E Absender');
  expect(sectionText).toContain('E2E Empfänger');
  expect(sectionText).toContain('28.7.2025');
});

test('Nachfassen Daten korrigieren lassen', async ({ page }) => {
  const url = '#{"v":1,"step":"data_info_request","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}';
  await page.goto(url);

  // Nachfassen und Daten korrigieren auswählen
  const nachfassenButton = page.locator('button', { hasText: 'Nachfassen' });
  await nachfassenButton.click();
  const keineAntwortButton = page.locator('button', { hasText: 'Ich möchte Daten korrigieren lassen' });
  await keineAntwortButton.click();

  // Prüfen, dass es sich um die Vorlage Daten korrigieren handelt
  const letterSection = await page.locator('section#letter');
  const sectionText = await letterSection.textContent();
  expect(sectionText).toContain('Aufgrund Ihrer Auskunft stellte ich fest, dass von Ihnen bearbeitete Personendaten unrichtig sind.');
  expect(sectionText).toContain('E2E Person');
  expect(sectionText).toContain('E2E Absender');
  expect(sectionText).toContain('E2E Empfänger');
  expect(sectionText).toContain('28.7.2025');
});

test('Nachfassen Daten löschen lassen', async ({ page }) => {
  const url = '#{"v":1,"step":"data_info_request","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}';
  await page.goto(url);

  // Nchfassen und Daten löschen
  const nachfassenButton = page.locator('button', { hasText: 'Nachfassen' });
  await nachfassenButton.click();
  const keineAntwortButton = page.locator('button', { hasText: 'Ich möchte Daten löschen lassen' });
  await keineAntwortButton.click();

  // Prüfen, dass es sich um die Vorlage Daten löschen handelt
  const letterSection = await page.locator('section#letter');
  const sectionText = await letterSection.textContent();
  expect(sectionText).toContain('Aufgrund Ihrer Auskunft ersuche ich Sie, folgende Personendaten zu löschen:');
  expect(sectionText).toContain('E2E Person');
  expect(sectionText).toContain('E2E Absender');
  expect(sectionText).toContain('E2E Empfänger');
  expect(sectionText).toContain('28.7.2025');
});