import unleashClient = require("unleash-client");
import { Strategy } from "unleash-client";

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

class VeilederIds extends Strategy {
  constructor() {
    super("VeilederIds");
  }

  isEnabled(parameters, context) {
    return parameters.veilederId.indexOf(context.veilederId) !== -1;
  }
}

class EnhetIds extends Strategy {
  constructor() {
    super("EnhetIds");
  }

  isEnabled(parameters, context) {
    return parameters.enhetId.indexOf(context.enhetId) !== -1;
  }
}

export const unleash = initialize({
  url: "https://teamsykefravr-unleash-api.nav.cloud.nais.io/api",
  appName: "syfomodiaperson",
  customHeaders: {
    Authorization:
      "*:development.fe45f8b56cf48ef952592c9f4796a3f6ee61504d15d98c697277f510",
  },
  strategies: [new VeilederIds(), new EnhetIds()],
});

export const toggles = (veilederId, enhetId) => {
  const context = {
    veilederId: veilederId,
    enhetId: enhetId,
  };
  return {
    isVirksomhetsinputEnabled: unleash.isEnabled(
      "isVirksomhetsinputEnabled",
      context
    ),
    isReturLegeerklaringEnabled: unleash.isEnabled(
      "isReturLegeerklaringEnabled",
      context
    ),
    isMotebehovTilbakemeldingEnabled: unleash.isEnabled(
      "isMotebehovTilbakemeldingEnabled",
      context
    ),
  };
};
