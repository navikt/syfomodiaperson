import unleashClient = require("unleash-client");
import Config = require("./config");
import { Strategy } from "unleash-client";

const { initialize } = unleashClient;

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
  url: Config.unleash.serverApiUrl + "/api",
  appName: "syfomodiaperson",
  customHeaders: { Authorization: Config.unleash.serverApiToken },
  strategies: [new VeilederIds(), new EnhetIds()],
});

export function getToggles(veilederId, enhetId) {
  const context = {
    veilederId: veilederId,
    enhetId: enhetId,
  };
  return {
    isVirksomhetsinputEnabled: unleash.isEnabled(
      "isVirksomhetsinputEnabled",
      context
    ),
    isTildelOppfolgingsenhetEnabled: unleash.isEnabled(
      "isTildelOppfolgingsenhetEnabled",
      context
    ),
    isKartleggingssporsmalEnabled: unleash.isEnabled(
      "isKartleggingssporsmalEnabled",
      context
    ),
    isFlexjarKartleggingssporsmalEnabled: unleash.isEnabled(
      "isFlexjarKartleggingssporsmalEnabled",
      context
    ),
  };
}
