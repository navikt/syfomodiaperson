import unleashClient = require("unleash-client");

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
