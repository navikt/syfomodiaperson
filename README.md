# Syfomodiaperson

Frontend i Modia for en bruker sin sykefraværsoppfølging

## TL;DR

React-app for oversikt med all informasjon om en gitt person sitt sykefravaer i Modia for syfoveiledere.
Node-app som kjører på Naiserator, og bygges med GitHub Actions

## Kjøre lokalt

Applikasjonen har en mock som kan brukes lokalt. Her mockes diverse endepunkter, dog ikke alle.

Du må ha Node v22 og npm v10 installert.

### Sette opp NPM_AUTH_TOKEN

Prosjektet henter pakker fra GitHub Packages, og krever at miljøvariabelen `NPM_AUTH_TOKEN` er satt for å kjøre `npm install`.

**Anbefalt: Bruk `gh` CLI (krever [GitHub CLI](https://cli.github.com/) installert og innlogget)**

```sh
gh auth refresh --scopes read:packages  # Kun første gang, legger til read:packages scope
export NPM_AUTH_TOKEN=$(gh auth token)
```

For å slippe å kjøre export manuelt i hver terminal-sesjon kan du legge dette til i `~/.zshrc` eller `~/.bashrc`:

```sh
export NPM_AUTH_TOKEN=$(gh auth token)
```

**Alternativ: Klassisk Personal Access Token (PAT)**

Opprett en PAT med `read:packages` scope på [github.com/settings/tokens](https://github.com/settings/tokens) og eksporter den:

```sh
export NPM_AUTH_TOKEN=ghp_din_token_her
```

### Starte appen

- For å kjøre koden lokalt:
  - `$ npm install`
  - `$ npm start`
  - Eventuelt kan kommandoene kjøres fra `package.json` i IntelliJ.
- Kjør tester med `npm test` eller `npm test:watch`
- Lint JS-kode med `npm run lint` eller `npm run lint:fix`

Appen nås på [http://localhost:8080/sykefravaer](http://localhost:8080/sykefravaer)

Ved første kjøring:

```sh
$ cp .env.template .env # for å sette opp lokale miljøvariabler
$ npm install # installerer avhengigheter
```

## Valkey Cache

Bruker teamsykefravr sin felles Valkey-cache på Aiven for å cache bruker-sessions.

## Feature toggling

Unleash brukes for feature toggling. Se [team siden](https://teamsykefravr-unleash-web.nav.cloud.nais.io/) for
toggles.
