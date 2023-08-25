import unleashClient = require("unleash-client");
import Config = require("./config");

const { initialize } = unleashClient;

export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isReturLegeerklaringEnabled = "isReturLegeerklaringEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
}

export const unleash = initialize({
  url: Config.unleash.serverApiUrl,
  appName: "syfomodiaperson",
  customHeaders: { Authorization: Config.unleash.serverApiToken },
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
