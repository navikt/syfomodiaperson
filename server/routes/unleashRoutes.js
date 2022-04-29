const express = require("express");
let router = express.Router();
const { initialize, Strategy } = require("unleash-client");

class ByEnhetAndEnvironment extends Strategy {
  constructor() {
    super("byEnhetAndEnvironment");
  }

  isEnabled(parameters, context) {
    if (process.env.NAIS_CONTEXT === "dev") {
      return true;
    }
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.valgtEnhet.indexOf(context.valgtEnhet) !== -1;
    const environmentEnabled = parameters.tilgjengeligIProd === "true";

    return valgtEnhetMatches && environmentEnabled;
  }
}

class ByUserId extends Strategy {
  constructor() {
    super("byUserId");
  }

  isEnabled(parameters, context) {
    if (!context.user) {
      return false;
    }

    return parameters.user.indexOf(context.user) !== -1;
  }
}

const unleash = initialize({
  url: "https://unleash.nais.io/api/",
  appName: "syfomodiaperson",
  environment: process.env.NAIS_CONTEXT,
  strategies: [new ByEnhetAndEnvironment(), new ByUserId()],
});

router.post("/toggles", (req, res) => {
  const toggles = req.body.toggles;
  const unleashToggles = toggles.reduce((acc, toggle) => {
    acc[toggle] = unleash.isEnabled(toggle, {
      valgtEnhet: req.query.valgtEnhet,
      user: req.query.userId,
    });
    return acc;
  }, {});

  res.status(200).send(unleashToggles);
});

module.exports = router;
