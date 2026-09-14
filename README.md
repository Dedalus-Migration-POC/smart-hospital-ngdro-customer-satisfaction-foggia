# Customer Satisfaction Foggia

Applicazione Angular 18 per il questionario di gradimento del Policlinico
Riuniti di Foggia (Dedalus Italia S.p.A.). Il progetto contiene **due
applicazioni distinte** costruite dallo stesso workspace Angular:

- **App pubblica** (questionario): consente al paziente di accedere tramite
  OTP a un link questionario e compilarlo.
- **App admin** (back-office): gestione questionari, sezioni, template, unità
  sanitarie e accessi operatore/ruolo, protetta da autenticazione Keycloak.

## Requisiti

- Node.js compatibile con Angular CLI 18
- Yarn (package manager dichiarato in `package.json`), ma gli script `npm`
  funzionano ugualmente

Installazione dipendenze:

```bash
yarn install
# oppure
npm install
```

## Development server

App pubblica (proxy verso `/survey` configurato in `proxy.conf.js`):

```bash
npm start
```

Disponibile su `http://localhost:4200/`.

App admin (porta 4201):

```bash
npm run start:admin
# oppure, con proxy alternativo per ambienti di sviluppo
npm run start:admin-dev
```

## Build

Build app pubblica (configurazione di default `production`):

```bash
npm run build
```

Build con configurazione specifica (public o admin), ad esempio:

```bash
ng build --configuration development
ng build --configuration integration
ng build --configuration staging
ng build --configuration admin/production
ng build --configuration admin/development
ng build --configuration admin/integration
ng build --configuration admin/staging
```

I file generati vengono scritti in `dist/`. Dopo la build, `post-build.js`
può essere eseguito per iniettare titolo/versione/favicon nell'`index.html`
generato:

```bash
node post-build.js <deployUrl>
```

Build incrementale in watch mode:

```bash
npm run watch
```

## Test

Esecuzione test unitari (Karma/Jasmine):

```bash
npm test
```

## Formattazione

Il progetto usa Prettier (niente punto e virgola, apici singoli, trailing
comma, indentazione a 2 spazi):

```bash
npm run format
```

## Struttura del progetto

```
src/
  main.ts              # entry point app pubblica
  main.admin.ts         # entry point app admin
  app/
    app.module.ts        # root module app pubblica
    app-routing.module.ts
    pages/
      auth/              # accesso via OTP al questionario (feature NgRx)
      questionnaire/      # compilazione questionario (feature NgRx)
      privacy/
    admin/
      admin.module.ts    # root module app admin
      admin-routing.module.ts
      pages/             # dashboard, login, gestione survey/section/template/units
      store/             # feature NgRx dell'app admin
      config/            # interceptor HTTP e route guard
  environments/          # environment app pubblica + environment.admin/*
  assets/i18n/           # traduzioni (ngx-translate)
```

Ogni feature NgRx (sia app pubblica che admin) segue lo stesso schema di file:
`actions.ts`, `reducer.ts`, `selectors.ts`, `effects.ts`, `service.ts`,
`mock.ts`.

## Ambienti

Gli ambienti (`environment.ts` e varianti `development`/`integration`/
`staging`/`production`) definiscono `production`, `keycloakEndpoint` e
`viewAnalyticsEndpoint`. Quelli dell'app admin si trovano sotto
`src/environments/environment.admin/`.

## Ulteriori informazioni

Per approfondire l'architettura e le convenzioni del progetto vedere
[`.github/copilot-instructions.md`](.github/copilot-instructions.md).

Per approfondire Angular CLI: `ng help` oppure la
[documentazione ufficiale](https://angular.dev/tools/cli).
