import type { Page } from '@playwright/test';

// Entfernt einen Geschäftsbereich aus den geladenen Daten, so wie es eine neue Version des
// Datensatzes tun würde. Die Organisationen bleiben erhalten, verlieren aber den Typ. Damit
// hängen die Tests nicht davon ab, welcher Stand des Datensatzes heruntergeladen wurde.
export async function removeTypeFromDataset(page: Page, handle: string) {
  await page.route(/\/data_(de|fr)\.json$/, async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.types = json.types.filter((type: { handle: string }) => type.handle !== handle);
    for (const org of json.orgs) {
      if (!org.types) continue;
      org.types = org.types.filter((type: string) => type !== handle);
      if (org.types.length === 0) delete org.types;
    }
    await route.fulfill({ json });
  });
}
