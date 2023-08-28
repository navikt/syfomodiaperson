import unleashClient = require("unleash-client");
import Config = require("./config");
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

class ActiveForVeilederId extends Strategy {
  constructor() {
    super("ActiveForVeilederId");
  }

  isEnabled(parameters, context) {
    return parameters.veilederIds.indexOf(context.veilederIds) !== -1;
  }
}

class ActiveForEnhetId extends Strategy {
  constructor() {
    super("ActiveForEnhetId");
  }

  isEnabled(parameters, context) {
    return parameters.enhetId.indexOf(context.enhetId) !== -1;
  }
}

export const unleash = initialize({
  url: Config.unleash.serverApiUrl,
  appName: "syfomodiaperson",
  customHeaders: {
    Authorization: Config.unleash.serverApiToken,
  },
  strategies: [new ActiveForVeilederId(), new ActiveForEnhetId()],
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
