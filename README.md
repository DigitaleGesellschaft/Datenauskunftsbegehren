
---

# Datenauskunftsbegehren Generator
![Generiere dein Datenauskunftsbegehren](https://www.digitale-gesellschaft.ch/auskunftsbegehren/datenauskunftsbegehren-og.png)

This is the code behind: https://www.digitale-gesellschaft.ch/auskunftsbegehren

## Contribute
Please open issues here for anything you find not working correctly with the Application. If you miss any organisation or company in the data, feel free to open Pull Requests at the [Data Repository](https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data).

## Develop
### Setup local development environment

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

*Note that you will need to have a data.json File that needs to be generated with this project: https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data*

Copy the data.json file to the folder public/

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

Copy everything in `/public` into a folder served by a Webserver.

### E2E Tests

Execute various E2E Tests using playwright (against localhost):
```
npm run test
```

Execute various E2E Tests using playwright against the deployed version
```
BASE_URL=https://www.digitale-gesellschaft.ch/auskunftsbegehren npm run test
```
---
