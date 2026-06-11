import { test, expect } from '@playwright/test';
import { screenshotPath } from './screenshot';

/**
 * Mirrors the deadline calculation in IcsDownload.svelte:
 * 30 days processing + 10 days buffer, plus weekend adjustment
 * if today is Saturday (+2) or Sunday (+1).
 */
function computeDeadlineDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const weekendBuffer = dayOfWeek === 6 ? 2 : dayOfWeek === 0 ? 1 : 0;
  const daysToAdd = 30 + 10 + weekendBuffer;
  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + daysToAdd);
  const y = deadline.getFullYear();
  const m = String(deadline.getMonth() + 1).padStart(2, '0');
  const d = String(deadline.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Navigating directly via URL hash avoids triggering window.print()
// because setStep() (which calls window.print()) is only invoked on button click.
const PRINT_URL = '#{"v":1,"step":"print","name":"E2E Person","date":"28.7.2025","orgAddressEntry":"E2E Empfänger","address":"E2E Absender"}';

// The "events" array (plural) satisfies the condition in Entry.svelte:
// {#if $userData.entry === 'event' && ($userData.events && $userData.events.length > 0)}
// while "event" (singular) is used by StepEvent to load the selected event.
const EVENT_CALL_URL = '#{"v":1,"entry":"event","events":["call"],"event":"call"}';

test.describe('IcsDownload', () => {
  test('ICS Formular wird auf dem Druckblatt angezeigt', async ({ page }, testInfo) => {
    await page.goto(PRINT_URL);

    const form = page.locator('form.ics-download');
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="date"]')).toBeVisible();
    await expect(form.locator('input[type="time"]')).toBeVisible();
    await expect(form.locator('button')).toBeVisible();

    await page.screenshot({ path: screenshotPath(testInfo, '01-ics-formular.png'), fullPage: true });
  });

  test('ICS Datum ist 40 Tage (plus Wochenend-Puffer) in der Zukunft', async ({ page }) => {
    await page.goto(PRINT_URL);

    const expectedDate = computeDeadlineDate();
    await expect(page.locator('form.ics-download input[type="date"]')).toHaveValue(expectedDate);
  });

  test('ICS Zeit hat den Standardwert 09:00', async ({ page }) => {
    await page.goto(PRINT_URL);

    await expect(page.locator('form.ics-download input[type="time"]')).toHaveValue('09:00');
  });

  test('ICS Datum kann angepasst werden', async ({ page }) => {
    await page.goto(PRINT_URL);

    const dateInput = page.locator('form.ics-download input[type="date"]');
    await dateInput.fill('2099-12-31');
    await expect(dateInput).toHaveValue('2099-12-31');
  });

  test('ICS Datum ist ein Pflichtfeld', async ({ page }) => {
    await page.goto(PRINT_URL);

    await expect(page.locator('form.ics-download input[type="date"]')).toHaveAttribute('required');
    await expect(page.locator('form.ics-download input[type="time"]')).toHaveAttribute('required');
  });
});

test.describe('VariableInput Datum', () => {
  test('Datumseingabe erscheint für Ereignis «Werbeanruf»', async ({ page }, testInfo) => {
    await page.goto(EVENT_CALL_URL);

    const dateLabel = page.locator('label', { hasText: 'Wann' });
    await expect(dateLabel).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();

    await page.screenshot({ path: screenshotPath(testInfo, '01-datumseingabe-werbeanruf.png'), fullPage: true });
  });

  test('Datumseingabe konvertiert yyyy-MM-dd in dd.MM.yyyy für den Brief', async ({ page }, testInfo) => {
    await page.goto(EVENT_CALL_URL);

    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill('2099-06-15');
    await dateInput.dispatchEvent('change');

    const generateButton = page.locator('button', { hasText: 'Brief generieren' });
    await generateButton.click();

    await expect(page.locator('section#letter')).toContainText('15.06.2099');

    await page.screenshot({ path: screenshotPath(testInfo, '01-datum-konvertiert-brief.png'), fullPage: true });
  });

  test('Vorausgefülltes Datum (dd.MM.yyyy) wird als yyyy-MM-dd im Eingabefeld angezeigt', async ({ page }, testInfo) => {
    await page.goto('#{"v":1,"entry":"event","events":["call"],"event":"call","eventDate":"15.06.2099"}');

    await expect(page.locator('input[type="date"]')).toHaveValue('2099-06-15');

    await page.screenshot({ path: screenshotPath(testInfo, '01-vorausgefuelltes-datum.png'), fullPage: true });
  });
});

test.describe('Datumsplatzhalter Übersetzung', () => {
  function demandHash(langUi: string, langCor: string, extra: Record<string, unknown> = {}): string {
    return encodeURI(
      JSON.stringify({
        step: 'incomplete_answer',
        entry: 'followup',
        desire: 'incomplete_answer',
        langUi,
        langCor,
        v: 1,
        ...extra,
      }),
    );
  }

  // Erwartetes Platzhalter-Format je Korrespondenzsprache (Briefsprache: nur de/fr)
  const placeholderByLang = {
    de: 'TT.MM.JJJJ',
    fr: 'JJ.MM.AAAA',
  };

  for (const [lang, placeholder] of Object.entries(placeholderByLang)) {
    test(`Platzhalter-Format für Korrespondenzsprache «${lang}» ist ${placeholder}`, async ({ page }) => {
      await page.goto(`#${demandHash('de', lang)}`);

      await expect(page.locator('#letter')).toContainText(placeholder);

      // Kein Platzhalter einer anderen Sprache ist vorhanden
      for (const [otherLang, otherPlaceholder] of Object.entries(placeholderByLang)) {
        if (otherLang !== lang) {
          await expect(page.locator('#letter')).not.toContainText(otherPlaceholder);
        }
      }
    });
  }

  test('Wechsel der Korrespondenzsprache übersetzt die Platzhalter (Brief und URL)', async ({ page }, testInfo) => {
    await page.goto(`#${demandHash('de', 'de')}`);

    // Platzhalter ist zunächst auf Deutsch — im Brief und in der URL
    await expect(page.locator('#letter')).toContainText('TT.MM.JJJJ');
    await expect(page).toHaveURL(/TT\.MM\.JJJJ/);

    await page.screenshot({ path: screenshotPath(testInfo, '01-platzhalter-deutsch.png'), fullPage: true });

    // Korrespondenzsprache auf Französisch umstellen
    await page.locator('button.circle.one').first().click();
    await page.locator('input[name="correspondence-language"][value="fr"]').click();

    // Platzhalter ist nun auf Französisch — im Brief und in der URL
    await expect(page.locator('#letter')).toContainText('JJ.MM.AAAA');
    await expect(page.locator('#letter')).not.toContainText('TT.MM.JJJJ');
    await expect(page).toHaveURL(/JJ\.MM\.AAAA/);
    await expect(page).not.toHaveURL(/TT\.MM\.JJJJ/);

    await page.screenshot({ path: screenshotPath(testInfo, '02-platzhalter-franzoesisch.png'), fullPage: true });

    // Zurück auf Deutsch wechseln — Platzhalter wird wieder übersetzt
    await page.locator('input[name="correspondence-language"][value="de"]').click();

    await expect(page.locator('#letter')).toContainText('TT.MM.JJJJ');
    await expect(page.locator('#letter')).not.toContainText('JJ.MM.AAAA');
    await expect(page).toHaveURL(/TT\.MM\.JJJJ/);
    await expect(page).not.toHaveURL(/JJ\.MM\.AAAA/);
  });

  test('Ein echtes, eingegebenes Datum bleibt beim Sprachwechsel erhalten', async ({ page }) => {
    // Echtes Datum direkt über die URL setzen (zuverlässiger als Tippen ins contenteditable)
    await page.goto(`#${demandHash('de', 'de', { dataInfoRequestDate: '15.06.2099' })}`);

    await expect(page.locator('#letter')).toContainText('15.06.2099');

    // Korrespondenzsprache auf Französisch umstellen
    await page.locator('button.circle.one').first().click();
    await page.locator('input[name="correspondence-language"][value="fr"]').click();

    // Das echte Datum bleibt unverändert, es wird nicht durch einen Platzhalter ersetzt.
    // (Das noch leere Antwort-Datumsfeld wird hingegen zu JJ.MM.AAAA übersetzt.)
    await expect(page.locator('#letter')).toContainText('15.06.2099');
    await expect(page).toHaveURL(/15\.06\.2099/);
  });
});
