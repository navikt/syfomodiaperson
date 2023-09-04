import amplitude from "amplitude-js/amplitude.esm";

const getApiKey = () => {
  // if (window.location.href.includes("www.example.org")) {
  //   return "API_KEY_PROD"; // prod
  // }
  // return "API_KEY_DEV"; // dev
  return "c7bcaaf5d0fddda592412234dd3da1ba";
};

export const logEvent = () => {
  loggInstance.logEvent("besøk");
};

export const loggInstance = amplitude.getInstance();
loggInstance.init(getApiKey(), "", {
  apiEndpoint: "amplitude.nav.no/collect",
  saveEvents: false,
  includeUtm: true,
  batchEvents: false,
  includeReferrer: true,
});
