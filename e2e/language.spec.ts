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
  {
    code: 'en',
    label: 'English',
    appTitle: 'Generate your data access request',
    introSnippet: 'Under data protection law, every person has the right',
    languagePickerTitle: 'Language settings',
    uiLanguageLabel: 'Interface language',
  },
  {
    code: 'it',
    label: 'Italiano',
    appTitle: 'Genera la tua richiesta di accesso ai dati',
    introSnippet: 'Secondo la legge sulla protezione dei dati',
    languagePickerTitle: 'Impostazioni lingua',
    uiLanguageLabel: "Lingua dell'interfaccia",
  },
];

test('Standardsprache ist Deutsch', async ({ page }, testInfo) => {
  await page.goto('');
  await expect(page.locator('h1')).toHaveText('Generiere dein Datenauskunftsbegehren');

  await page.screenshot({ path: screenshotPath(testInfo, '01-startseite-deutsch.png'), fullPage: true });
});

for (const lang of languages) {
  test(`UI-Sprache auf ${lang.label} umstellen`, async ({ page }, testInfo) => {
    await page.goto('');

    // Spracheinstellungen öffnen (erster button.circle.one)
    const settingsButton = page.locator('button.circle.one').first();
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

test('UI-Sprache von Deutsch auf Englisch wechseln', async ({ page }, testInfo) => {
  await page.goto('');

  // Seite ist zuerst auf Deutsch
  await expect(page.locator('h1')).toHaveText('Generiere dein Datenauskunftsbegehren');

  // Spracheinstellungen öffnen und auf Englisch wechseln
  await page.locator('button.circle.one').first().click();
  await page.locator('input[name="ui-language"][value="en"]').click();

  // Seite ist jetzt auf Englisch
  await expect(page.locator('h1')).toHaveText('Generate your data access request');

  await page.screenshot({ path: screenshotPath(testInfo, '01-sprache-gewechselt-englisch.png'), fullPage: true });
});

test('Sprachen bleiben nach "Eingaben zurücksetzen" erhalten', async ({ page }, testInfo) => {
  await page.goto('');

  // UI-Sprache auf Englisch, Korrespondenzsprache auf Französisch setzen
  await page.locator('button.circle.one').first().click();
  await page.locator('input[name="ui-language"][value="en"]').click();
  await page.locator('input[name="correspondence-language"][value="fr"]').click();

  await page.screenshot({ path: screenshotPath(testInfo, '01-spracheinstellungen.png'), fullPage: true });

  // Spracheinstellungen schliessen (Close-Button im Overlay)
  await page.locator('.overlay header button').click();

  // Etwas eingeben, damit der Reset-Button erscheint
  await page.locator('input[placeholder="Suche ..."]').click();
  const listContainer = page.locator('div.svelte-select-list');
  await expect(listContainer).toBeVisible();
  await listContainer.locator('div.item').first().click();

  // Eingaben zurücksetzen
  await page.locator('button', { hasText: 'Reset inputs' }).click();

  // UI-Sprache ist noch Englisch
  await expect(page.locator('h1')).toHaveText('Generate your data access request');

  // Korrespondenzsprache ist noch Französisch
  await expect(page.locator('button.circle.one').first()).toBeVisible();
  await page.locator('button.circle.one').first().click();
  await expect(page.locator('input[name="correspondence-language"][value="fr"]')).toBeChecked();
  await expect(page.locator('input[name="ui-language"][value="en"]')).toBeChecked();

  await page.screenshot({ path: screenshotPath(testInfo, '02-sprachen-nach-reset.png'), fullPage: true });
});
