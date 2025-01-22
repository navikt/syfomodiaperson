# Syfomodiaperson

Frontend i Modia for en bruker sin sykefraværsoppfølging

## TL;DR

React-app for oversikt med all informasjon om en gitt person sitt sykefravaer i Modia for syfoveiledere.
Node-app som kjører på Naiserator, og bygges med GitHub Actions

## Kjøre lokalt

Applikasjonen har en mock som kan brukes lokalt. Her mockes diverse endepunkter, dog ikke alle.

Du må ha Node v22 og npm v10 installert.

- For å kjøre koden lokalt:
  - `$ npm install`
  - `$ npm start`
  - Eventuelt kan komandoene kjøres fra `package.json` i intellij.
- Kjør tester med `npm test` eller `npm test:watch`
- Lint JS-kode med `npm run lint` eller `npm run lint:fix`

Appen nås på [http://localhost:8080/sykefravaer](http://localhost:8080/sykefravaer)

Ved første kjøring:

```sh
$ cp .env.template .env # for å sette opp lokale miljøvariabler
$ npm install # installerer avhengigheter
```

## Redis Cache

Bruker teamsykefravr sin felles Redis-cache på Aiven for å cache bruker-sessions.

## Event tracking

Vi bruker amplitude for event tracking, og har `ISyfo - dev` og `ISyfo - prod` projects og
spaces. [Se amplitude](https://app.eu.amplitude.com/analytics/nav/home).

## Feature toggling

Unleash brukes for feature toggling. Se [team siden](https://teamsykefravr-unleash-web.nav.cloud.nais.io/) for
toggles.
