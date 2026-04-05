import { test, expect } from '@playwright/test';

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

test('Standardsprache ist Deutsch', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('h1')).toHaveText('Generiere dein Datenauskunftsbegehren');
});

for (const lang of languages) {
  test(`UI-Sprache auf ${lang.label} umstellen`, async ({ page }) => {
    await page.goto('');

    // Spracheinstellungen öffnen (erster button.circle.one)
    const settingsButton = page.locator('button.circle.one').first();
    await settingsButton.click();

    // Sprache auswählen
    await page.locator(`input[name="ui-language"][value="${lang.code}"]`).click();

    // Titel und Intro-Text der App prüfen
    await expect(page.locator('h1')).toHaveText(lang.appTitle);
    await expect(page.locator('main p').first()).toContainText(lang.introSnippet);

    // Spracheinstellungen-Dialog prüfen
    await expect(page.locator('.language-picker h2')).toHaveText(lang.languagePickerTitle);
    await expect(page.locator('.language-picker fieldset').first().locator('legend')).toHaveText(lang.uiLanguageLabel);
  });
}
