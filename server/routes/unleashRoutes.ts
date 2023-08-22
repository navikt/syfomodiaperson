import unleashClient = require("unleash-client");
import { Context } from "unleash-client";
import Config = require("../config");
import * as process from "process";

const { initialize, Strategy } = unleashClient;

export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isReturLegeerklaringEnabled = "isReturLegeerklaringEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
}

class ByDevEnhet extends Strategy {
  constructor() {
    super("byDevEnhet");
  }

  isEnabled(parameters: any, context: any) {
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.enheter.indexOf(context.valgtEnhet) !== -1;

    return valgtEnhetMatches && process.env.NAIS_CONTEXT === "dev";
  }
}

class ByProdEnhet extends Strategy {
  constructor() {
    super("byProdEnhet");
  }

  isEnabled(parameters: any, context: any) {
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.enheter.indexOf(context.valgtEnhet) !== -1;

    return valgtEnhetMatches && process.env.NAIS_CONTEXT === "prod";
  }
}

class ByUserId extends Strategy {
  constructor() {
    super("byUserId");
  }

  isEnabled(parameters: any, context: any) {
    if (!context.user) {
      return false;
    }

    return parameters.user.indexOf(context.user) !== -1;
  }
}

class ByEnvironmentToggle extends Strategy {
  constructor() {
    super("byEnvironmentToggle");
  }

  isEnabled(parameters: any) {
    return (
      (parameters.dev === "true" && process.env.NAIS_CONTEXT === "dev") ||
      (parameters.prod === "true" && process.env.NAIS_CONTEXT === "prod")
    );
  }
}

// const unleash = initialize({
//   url: "https://unleash.nais.io/api/",
//   appName: "syfomodiaperson",
//   environment: process.env.NAIS_CONTEXT,
//   strategies: [
//     new ByDevEnhet(),
//     new ByUserId(),
//     new ByProdEnhet(),
//     new ByEnvironmentToggle(),
//   ],
// });

export const unleash = initialize({
  url: "https://teamsykefravr-unleash-api.nav.cloud.nais.io",
  appName: "syfomodiaperson",
  customHeaders: {
    Authorization: "*:development.fe45f8b56cf48ef952592c9f4796a3f6ee",
  },
});

export const unleashNextToggles = (unleashContext: Context): Toggles => {
  return {
    isVirksomhetsinputEnabled: unleash.isEnabled(
      "isVirksomhetsinputEnabled",
      unleashContext
    ),
    isReturLegeerklaringEnabled: unleash.isEnabled(
      "isReturLegeerklaringEnabled",
      unleashContext
    ),
    isMotebehovTilbakemeldingEnabled: unleash.isEnabled(
      "isMotebehovTilbakemeldingEnabled",
      unleashContext
    ),
  };
};

// export const unleashToggles = (toggles: any, valgtEnhet: any, userId: any) => {
//   return {
//     "syfo.dialogmote.virksomhetinput": unleash.isEnabled(
//       "syfo.dialogmote.virksomhetinput",
//       {
//         valgtEnhet: valgtEnhet,
//         user: userId,
//       }
//     ),
//     "syfo.behandlerdialog.legeerklaring": unleash.isEnabled(
//       "syfo.behandlerdialog.legeerklaring",
//       {
//         valgtEnhet: valgtEnhet,
//         user: userId,
//       }
//     ),
//     "syfo.behandlerdialog.returlegeerklaring": unleash.isEnabled(
//       "syfo.behandlerdialog.returlegeerklaring",
//       {
//         valgtEnhet: valgtEnhet,
//         user: userId,
//       }
//     ),
//     "syfo.motebehov.tilbakemelding": unleash.isEnabled(
//       "syfo.motebehov.tilbakemelding",
//       {
//         valgtEnhet: valgtEnhet,
//         user: userId,
//       }
//     ),
//   };
// };
