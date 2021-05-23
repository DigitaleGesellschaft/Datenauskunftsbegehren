
---

# Datenauskunftsbegehren Generator
![Generiere dein Datenauskunftsbegehren](https://www.digitale-gesellschaft.ch/auskunftsbegehren/datenauskunftsbegehren-og.png)

This is the code behind: https://www.digitale-gesellschaft.ch/auskunftsbegehren

## Contribute
Please open issues here for anything you find not working correctly with the Application. If you miss any organisation or company in the data, feel free to open Pull Requests at the [Data Repository](https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data).

## Develop

### Prerequisites

* Install [Node.js LTS](https://nodejs.org)
* Create self signed SSL Certificate for localhost, required for `npm run dev`. Recommended CLI: [mkcert](https://github.com/FiloSottile/mkcert)

```bash
mkcert -install && \
mkcert localhost 127.0.0.1 && \ 
mv localhost+1-key.pem local.key && \ 
mv localhost+1.pem local.cert
```

* Make sample data locally available: `cp ./public/data.example.json ./public/data.json` 

* If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).



### Run local development environment

Install the dependencies...

```bash
npm install
```

… then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the App runnning.

### Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv).


### Deployment

#### Use Artifact from Github Action
Go to https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren/actions and download the Artifact named `Public` from the latest build. Put all the content into a folder server by a webserver.
#### Build your own
Generate production build:

```bash
npm run build
```

Copy everything in `/public` into a folder served by a Webserver.
