import { test, expect } from '@playwright/test';
import { screenshotPath } from './screenshot';
import { execSync } from 'node:child_process';
import packageJson from '../package.json' with { type: 'json' };

const gitRevision = process.env.GIT_REVISION || execSync('git rev-parse --short HEAD').toString().trim();

test('Seite wird mit dynamisch generiertem Titel angezeigt', async ({ page }, testInfo) => {
  await page.goto('');

  const h1Text = await page.locator('h1').textContent();
  expect(h1Text).toBe('Generiere dein Datenauskunftsbegehren');

  await page.screenshot({ path: screenshotPath(testInfo, '01-startseite.png'), fullPage: true });
});

test('Info kann angezeigt werden', async ({ page }, testInfo) => {
  await page.goto('');

  await page.screenshot({ path: screenshotPath(testInfo, '01-startseite.png'), fullPage: true });

  // Info anzeigen
  const creditsButton = page.locator('[data-qa="credits-button"]');
  await creditsButton.click();

  // Prüfen, dass der entsprechende Text angezeigt wird
  const textLocator = page.locator('text=Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen.');
  await expect(textLocator).toBeVisible();

  await page.screenshot({ path: screenshotPath(testInfo, '02-info-overlay.png'), fullPage: true });
  });

test('Info kann angezeigt werden und zeigt Version und Git-Revision', async ({ page }) => {
  await page.goto('');

  const creditsButton = page.locator('[data-qa="credits-button"]');
  await creditsButton.click();

  const credits = page.locator('.credits');
  await expect(credits.locator('text=Es werden keine Personendaten bei der Verwendung des Generators erhoben: Sämtliche Dateneingaben und Auswahlen verbleiben im Browser der Benutzer:innen.')).toBeVisible();
  await expect(credits).toContainText(packageJson.version);
  await expect(credits).toContainText(gitRevision);
});

test('Credits führen Testing auf und keinen Abschnitt Kampagne mehr', async ({ page }) => {
  await page.goto('');

  await page.locator('[data-qa="credits-button"]').click();

  const credits = page.locator('.credits');
  await expect(credits.getByText('Konzept und Umsetzung')).toBeVisible();
  await expect(credits.locator('li', { hasText: 'Testing' })).toContainText('Pierre');
  await expect(credits).not.toContainText('Kampagne');
});

test('Credits danken Stiftung Mercator und Digitalfonds mit Logos neben dem Text', async ({ page }) => {
  await page.goto('');

  await page.locator('[data-qa="credits-button"]').click();

  const credits = page.locator('.credits');
  await expect(credits.getByRole('heading', { name: 'Vielen Dank für die Unterstützung!' })).toBeVisible();
  await expect(credits).toContainText('nur dank Hunderten von Arbeitsstunden');
  await expect(credits.getByRole('link', { name: 'Stiftung Mercator Schweiz' })).toHaveAttribute('href', 'https://www.stiftung-mercator.ch/');
  await expect(credits.getByRole('link', { name: 'Digitalfonds', exact: true })).toHaveAttribute('href', 'http://digitalfonds.ch/');
  await expect(credits.getByRole('link', { name: 'Mitglied' })).toHaveAttribute('href', 'https://www.digitale-gesellschaft.ch/uber-uns/kontakt/');
  await expect(credits.getByRole('link', { name: 'Spende' })).toHaveAttribute('href', 'https://www.digitale-gesellschaft.ch/uber-uns/unterstuetzer-werden/');
  await expect(credits).not.toContainText('Digitalisierung + Gesellschaft');

  const textBox = await credits.getByText('Nichtsdestotrotz fallen').boundingBox();
  for (const alt of ['Logo Stiftung Mercator', 'Logo Digitalfonds']) {
    const logo = credits.getByRole('img', { name: alt });
    await expect(logo).toBeVisible();
    const logoBox = await logo.boundingBox();
    expect(logoBox!.x).toBeGreaterThan(textBox!.x + textBox!.width);
  }
});

test('Credits danken auf Französisch der Fondation Mercator Suisse und dem Fonds numérique', async ({ page }) => {
  await page.goto('');

  await page.locator('[data-qa="language-switch-button"]').click();
  await page.locator('input[name="ui-language"][value="fr"]').click();
  await page.locator('[data-qa="overlay-close-button"]').click();
  await page.locator('[data-qa="credits-button"]').click();

  const credits = page.locator('.credits');
  await expect(credits.getByRole('heading', { name: 'Merci pour ton soutien !' })).toBeVisible();
  await expect(credits).toContainText('grâce à des centaines d’heures de travail militant bénévole');
  await expect(credits.getByRole('link', { name: 'Fondation Mercator Suisse' })).toHaveAttribute('href', 'https://www.stiftung-mercator.ch/fr/');
  await expect(credits.getByRole('link', { name: 'Fonds numérique', exact: true })).toHaveAttribute('href', 'http://digitalfonds.ch/');
  await expect(credits.getByRole('link', { name: 'membre', exact: true })).toHaveAttribute('href', 'https://www.societe-numerique.ch/a-propos-de-nous/nous-contacter/');
  await expect(credits.getByRole('link', { name: 'don', exact: true })).toHaveAttribute('href', 'https://www.societe-numerique.ch/a-propos-de-nous/devenir-membre-donateur-ou-soutien/');
  for (const alt of ['Logo Fondation Mercator', 'Logo Fonds numérique']) {
    await expect(credits.getByRole('img', { name: alt })).toBeVisible();
  }
});

test('Gesetzesverweise in den Credits werden nicht umgebrochen', async ({ page }) => {
  await page.goto('');

  await page.locator('[data-qa="credits-button"]').click();

  const references = page.locator('.credits .no-wrap');
  await expect(references).toHaveCount(5);
  for (const reference of await references.all()) {
    await expect(reference).toHaveCSS('white-space', 'nowrap');
  }
});
