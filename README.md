
---

# Datenauskunftsbegehren Generator
![Generiere dein Datenauskunftsbegehren](https://www.digitale-gesellschaft.ch/auskunftsbegehren/datenauskunftsbegehren-og.png)

This is the code behind: https://www.digitale-gesellschaft.ch/auskunftsbegehren

## Contribute
Please open issues here for anything you find not working correctly with the Application. If you miss any organisation or company in the data, feel free to open Pull Requests at the [Data Repository](https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data).

## Develop
### Setup local development environment

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

Works with:

- Node v24

Download the latest data files:

```bash
wget -O public/data_de.json https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases/latest/download/data_de.json
wget -O public/data_fr.json https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases/latest/download/data_fr.json
```

...then install the dependencies and playwright browsers...

```bash
npm install
npx playwright install
```

...then start the webpage

```bash
npm run dev
```

Navigate to [localhost:5173](http://localhost:5173). You should see the App runnning.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

### Translations

Translation files are located in the [locales](./src/locales/) folder:

| File | Purpose | How to update |
|------|---------|---------------|
| `de-CH.json` | UI strings (German) | `npm run i18n` |
| `fr-CH.json` | UI strings (French) | `npm run i18n` |
| `en.json` | UI strings (English) | `npm run i18n` |
| `it-CH.json` | UI strings (Italian) | `npm run i18n` |
| `de-CH.letter.json` | Letter text (German) | Edit manually |
| `fr-CH.letter.json` | Letter text (French) | Edit manually |

The letter files (`*.letter.json`) are maintained manually — they contain the full legal text of the letters and use a separate locale namespace (`de-letter`, `fr-letter`).

If translation strings are added inside the source code, re-run the generation of the locale files:

```bash
npm run i18n
```

This only **adds** missing keys (with empty values) — existing translations are preserved.

Note: the scripts only scan UI components (not `src/letter/`). New translation keys in letter components must be added manually to the letter JSON files. If new source subdirectories are added, update the `UI_GLOBS` list in `tooling/i18n.sh`.

Then continue to translate the locale files and **commit all changed files** to the repo.

#### Programs to fill in translations

Poedit is an open-source program but lacks the possibility to display the languages side-by-side. BabelEdit needs a licence and is not free, even though it supports the file format. For now, the easiest is:

- Provide german defaults in source code
- Replace default german text in other language versions

### Configuring the default language

The default language is German (`de`). It can be changed via the `VITE_DEFAULT_LANG` environment variable — useful when hosting the app on a website in a different language.

Valid values: `de`, `fr`, `en`, `it`

> Note: The correspondence language (used for the generated letter) only supports `de` and `fr`. Any other value falls back to `de`.

Either pass it directly at build time:

```bash
VITE_DEFAULT_LANG=fr npm run build
```

Or add it to a `.env` file in the project root:

```
VITE_DEFAULT_LANG=fr
```

### Building and running in production mode

To create an optimised version of the app:

```bash
npm run preview
```

Navigate to [localhost:8080](http://localhost:8080). You should see the App runnning.

### Deployment

#### Use Artifact from Github Action
Go to https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren/actions and download the Artifact named `Public` from the latest build. Put all the content into a folder server by a webserver.

#### Build your own
Generate production build:

```bash
npm run build
```

Check the produced output before deployment:
```bash
docker run --rm -v ./dist:/usr/share/nginx/html:ro -p 8080:80 nginx
```

Copy everything in `/dist` into a folder served by a Webserver.

### E2E Tests

Execute various E2E Tests using playwright (against localhost):
```
npm run test
```

Run a single test:

```
npm run test -- --grep "Datenauskunftsbegehren für Swisscom generieren"
```

Execute various E2E Tests using playwright against the deployed version
```
BASE_URL=https://www.digitale-gesellschaft.ch/auskunftsbegehren npm run test
```
---
