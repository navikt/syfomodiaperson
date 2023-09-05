import amplitude from "amplitude-js/amplitude.esm";
import { erProd } from "@/utils/miljoUtil";

/**
 See documentation for naming guidelines: https://github.com/navikt/analytics-taxonomy
 Other documentation on Aksel: https://aksel.nav.no/god-praksis/artikler/mal-brukeratferd-med-amplitude
 */
const getApiKey = () => {
  return erProd()
    ? "e4b68538f8d185f0ee2d913d8e51bd39"
    : "c7bcaaf5d0fddda592412234dd3da1ba";
};

export const logEvent = (eventType: string, eventProperties?: object) => {
  client.logEvent(eventType, eventProperties);
};

export const logPageVisit = (url: string, sideTittel: string) => {
  client.logEvent("besøk", { url: url, sidetittel: sideTittel });
};

const client = amplitude.getInstance();
client.init(getApiKey(), "", {
  apiEndpoint: "amplitude.nav.no/collect",
  saveEvents: false,
  includeUtm: true,
  batchEvents: false,
  includeReferrer: true,
});
