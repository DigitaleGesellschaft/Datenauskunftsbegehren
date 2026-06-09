import { test, expect } from '@playwright/test';

const baseState = '"name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"';

test('Kurzer Brief erzeugt beim Drucken eine PDF-Seite', async ({ page }) => {
  const url = `#{"v":1,"entry":"followup","desire":"unanswered","step":"print",${baseState}}`;
  await page.goto(url);

  const pdf = await page.pdf({ format: 'A4' });
  // Count PDF pages: each page dictionary has /Type /Page (singular, not /Pages)
  const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
  expect(pageCount).toBe(1);
});
