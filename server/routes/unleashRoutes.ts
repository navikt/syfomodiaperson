import unleashClient = require("unleash-client");
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
  url: "https://teamsykefravr-unleash-api.nav.cloud.nais.io/api",
  appName: "syfomodiaperson",
  customHeaders: {
    Authorization:
      "*:development.fe45f8b56cf48ef952592c9f4796a3f6ee61504d15d98c697277f510",
  },
});

export const unleashNextToggles = (): Toggles => {
  return {
    isVirksomhetsinputEnabled: unleash.isEnabled("isVirksomhetsinputEnabled"),
    isReturLegeerklaringEnabled: unleash.isEnabled(
      "isReturLegeerklaringEnabled"
    ),
    isMotebehovTilbakemeldingEnabled: unleash.isEnabled(
      "isMotebehovTilbakemeldingEnabled"
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
