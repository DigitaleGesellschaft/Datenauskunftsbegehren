import { test, expect } from '@playwright/test';
import { screenshotPath } from './screenshot';

const languages = [
  {
    code: 'de',
    label: 'Deutsch',
    appTitle: 'Generiere dein Datenauskunftsbegehren',
    introSnippet: 'Gemäss Datenschutzgesetz hat jede Person das Recht',
    languagePickerTitle: 'Spracheinstellungen',
    uiLanguageLabel: 'Benutzeroberflächensprache',
  },
  {
    code: 'fr',
    label: 'Français',
    appTitle: "Générer une demande d'accès à ses données personnelles",
    introSnippet: 'Chaque personne jouit du droit de connaître',
    languagePickerTitle: 'Paramètres de langue',
    uiLanguageLabel: "Langue de l'interface",
  },
];

test('Standardsprache ist Deutsch', async ({ page }, testInfo) => {
  await page.goto('');
  await expect(page.locator('h1')).toHaveText('Generiere dein Datenauskunftsbegehren');

  await page.screenshot({ path: screenshotPath(testInfo, '01-startseite-deutsch.png'), fullPage: true });
});

test('Sprachwahl-Button zeigt das Translate-Icon statt eines Globus', async ({ page }) => {
  await page.goto('');

  // Das Icon wurde vom Globus (viewBox 24x24) auf das Noun-Project-Translate-Icon (viewBox 100x100) umgestellt
  const languageButton = page.locator('[data-qa="language-switch-button"]');
  const languageIcon = languageButton.locator('svg');
  await expect(languageIcon).toHaveAttribute('viewBox', '0 0 100 100');
  await expect(languageIcon.locator('title')).toHaveText('Language');

  // Kein Kreis mehr um das Icon (kein Rahmen, kein Hintergrund), Icon dafür grösser dargestellt
  await expect(languageButton).toHaveCSS('border-style', 'none');
  await expect(languageButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(languageIcon).toHaveAttribute('width', '38');

  // Aus Konsistenzgründen auch beim Info-Button kein Kreis mehr
  const infoButton = page.locator('[data-qa="credits-button"]');
  await expect(infoButton).toHaveCSS('border-style', 'none');
  await expect(infoButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('Sprachwahl-Dialog: kein Kreis mehr um das Schliessen-Icon', async ({ page }) => {
  await page.goto('');

  await page.locator('[data-qa="language-switch-button"]').click();

  const closeButton = page.locator('[data-qa="overlay-close-button"]');
  await expect(closeButton).toHaveCSS('border-style', 'none');
  await expect(closeButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

for (const lang of languages) {
  test(`UI-Sprache auf ${lang.label} umstellen`, async ({ page }, testInfo) => {
    await page.goto('');

    // Spracheinstellungen öffnen
    const settingsButton = page.locator('[data-qa="language-switch-button"]');
    await settingsButton.click();

    await page.screenshot({ path: screenshotPath(testInfo, '01-spracheinstellungen.png'), fullPage: true });

    // Sprache auswählen
    await page.locator(`input[name="ui-language"][value="${lang.code}"]`).click();

    // Titel und Intro-Text der App prüfen
    await expect(page.locator('h1')).toHaveText(lang.appTitle);
    await expect(page.locator('main p').first()).toContainText(lang.introSnippet);

    // Spracheinstellungen-Dialog prüfen
    await expect(page.locator('.language-picker h2')).toHaveText(lang.languagePickerTitle);
    await expect(page.locator('.language-picker fieldset').first().locator('legend')).toHaveText(lang.uiLanguageLabel);

    await page.screenshot({ path: screenshotPath(testInfo, `02-sprache-${lang.code}.png`), fullPage: true });
  });
}

test.describe('Browsersprache Englisch (nicht unterstützt)', () => {
  test.use({ locale: 'en-US' });

  test('Englischer Browser ohne Hash: Fallback auf Deutsch', async ({ page }, testInfo) => {
    await page.goto('');

    // Englisch wird nicht mehr unterstützt, daher Fallback auf die Standardsprache Deutsch
    await expect(page.locator('h1')).toHaveText('Generiere dein Datenauskunftsbegehren');

    // langUi muss als "de" in die URL geschrieben werden
    await expect
      .poll(async () => {
        const hash = await page.evaluate(() => window.location.hash);
        try {
          return JSON.parse(decodeURIComponent(hash.slice(1))).langUi;
        } catch {
          return undefined;
        }
      })
      .toBe('de');

    // Im Sprachwähler ist konsequenterweise "Deutsch" vorausgewählt
    await page.locator('[data-qa="language-switch-button"]').click();
    await expect(page.locator('input[name="ui-language"][value="de"]')).toBeChecked();

    await page.screenshot({ path: screenshotPath(testInfo, '01-englischer-browser.png'), fullPage: true });
  });
});

const letterSnippets = {
  de: {
    registeredMail: 'EINSCHREIBEN',
    salutation: 'Sehr geehrte Angesprochene',
  },
  fr: {
    registeredMail: 'RECOMMANDÉ',
    salutation: 'Chère Madame, cher Monsieur,',
  },
};

function letterHash(langUi: string, langCor: string): string {
  return encodeURI(JSON.stringify({ step: 'data_info_request', langUi, langCor, v: 1 }));
}

test('UI Deutsch, Korrespondenzsprache Französisch: Seite auf Deutsch, Brief auf Französisch', async ({ page }, testInfo) => {
  await page.goto(`#${letterHash('de', 'fr')}`);

  // UI ist Deutsch — geprüft an der "zurück"-Schaltfläche, da der App-Titel auf der Briefseite nicht gerendert wird
  await expect(page.locator('button.no-print').first()).toHaveText('❮ zur Dateneingabe');

  // Briefinhalt ist Französisch
  await expect(page.locator('#letter .salutation')).toContainText(letterSnippets.fr.salutation);
  await expect(page.locator('#letter .address-to')).toContainText(letterSnippets.fr.registeredMail);

  await page.screenshot({ path: screenshotPath(testInfo, '01-ui-de-brief-fr.png'), fullPage: true });
});

test('UI Französisch, Korrespondenzsprache Deutsch: Seite auf Französisch, Brief auf Deutsch', async ({ page }, testInfo) => {
  await page.goto(`#${letterHash('fr', 'de')}`);

  // UI ist Französisch — geprüft an der "zurück"-Schaltfläche
  await expect(page.locator('button.no-print').first()).toHaveText('❮ à la saisie');

  // Briefinhalt ist Deutsch
  await expect(page.locator('#letter .salutation')).toContainText(letterSnippets.de.salutation);
  await expect(page.locator('#letter .address-to')).toContainText(letterSnippets.de.registeredMail);

  await page.screenshot({ path: screenshotPath(testInfo, '01-ui-fr-brief-de.png'), fullPage: true });
});

test('Wechsel der Benutzeroberflächensprache stellt automatisch auch die Korrespondenzsprache um', async ({ page }, testInfo) => {
  await page.goto('');

  await page.locator('[data-qa="language-switch-button"]').click();

  // Standardmässig sind beide Sprachen Deutsch
  await expect(page.locator('input[name="correspondence-language"][value="de"]')).toBeChecked();

  // UI-Sprache auf Französisch umstellen
  await page.locator('input[name="ui-language"][value="fr"]').click();

  // Die Korrespondenzsprache ist automatisch mitgewechselt
  await expect(page.locator('input[name="correspondence-language"][value="fr"]')).toBeChecked();

  await page.screenshot({ path: screenshotPath(testInfo, '01-korrespondenzsprache-automatisch-mitgewechselt.png'), fullPage: true });
});

test('Korrespondenzsprache kann nach dem automatischen Mitwechseln manuell abweichend gewählt werden', async ({ page }, testInfo) => {
  await page.goto('');

  await page.locator('[data-qa="language-switch-button"]').click();

  // UI-Sprache auf Französisch umstellen — Korrespondenzsprache folgt automatisch
  await page.locator('input[name="ui-language"][value="fr"]').click();
  await expect(page.locator('input[name="correspondence-language"][value="fr"]')).toBeChecked();

  // Korrespondenzsprache manuell wieder auf Deutsch zurückstellen
  await page.locator('input[name="correspondence-language"][value="de"]').click();

  // UI bleibt Französisch, Korrespondenzsprache ist nun Deutsch
  await expect(page.locator('input[name="ui-language"][value="fr"]')).toBeChecked();
  await expect(page.locator('input[name="correspondence-language"][value="de"]')).toBeChecked();

  await page.screenshot({ path: screenshotPath(testInfo, '01-korrespondenzsprache-manuell-abweichend.png'), fullPage: true });
});

test('UI-Sprache von Deutsch auf Französisch wechseln', async ({ page }, testInfo) => {
  await page.goto('');

  // Seite ist zuerst auf Deutsch
  await expect(page.locator('h1')).toHaveText('Generiere dein Datenauskunftsbegehren');

  // Spracheinstellungen öffnen und auf Französisch wechseln
  await page.locator('[data-qa="language-switch-button"]').click();
  await page.locator('input[name="ui-language"][value="fr"]').click();

  // Seite ist jetzt auf Französisch
  await expect(page.locator('h1')).toHaveText("Générer une demande d'accès à ses données personnelles");

  await page.screenshot({ path: screenshotPath(testInfo, '01-sprache-gewechselt-franzoesisch.png'), fullPage: true });
});

test('Sprachen bleiben nach "Eingaben zurücksetzen" erhalten', async ({ page }, testInfo) => {
  await page.goto('');

  // UI-Sprache auf Französisch, Korrespondenzsprache auf Deutsch setzen
  await page.locator('[data-qa="language-switch-button"]').click();
  await page.locator('input[name="ui-language"][value="fr"]').click();
  await page.locator('input[name="correspondence-language"][value="de"]').click();

  await page.screenshot({ path: screenshotPath(testInfo, '01-spracheinstellungen.png'), fullPage: true });

  // Spracheinstellungen schliessen (Close-Button im Overlay)
  await page.locator('[data-qa="overlay-close-button"]').click();

  // Etwas eingeben, damit der Reset-Button erscheint
  await page.locator('[data-qa="org-search-input"]').click();
  const listContainer = page.locator('div.svelte-select-list');
  await expect(listContainer).toBeVisible();
  await listContainer.locator('[data-qa="org-option"]').first().click();

  // Eingaben zurücksetzen
  await page.locator('button', { hasText: 'Réinitialiser les entrées' }).click();

  // UI-Sprache ist noch Französisch
  await expect(page.locator('h1')).toHaveText("Générer une demande d'accès à ses données personnelles");

  // Korrespondenzsprache ist noch Deutsch
  await expect(page.locator('[data-qa="language-switch-button"]')).toBeVisible();
  await page.locator('[data-qa="language-switch-button"]').click();
  await expect(page.locator('input[name="correspondence-language"][value="de"]')).toBeChecked();
  await expect(page.locator('input[name="ui-language"][value="fr"]')).toBeChecked();

  await page.screenshot({ path: screenshotPath(testInfo, '02-sprachen-nach-reset.png'), fullPage: true });
});
