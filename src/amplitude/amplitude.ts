import amplitude from "amplitude-js";

export const initAmplitude = () => {
  amplitude?.getInstance().init("default", "", {
    apiEndpoint: "amplitude.nav.no/collect-auto",
    saveEvents: false,
    includeUtm: true,
    includeReferrer: false,
    platform: window.location.toString(),
  });
};

export interface UserProperties {
  valgtEnhet: string;
}

export const setAmplitudeUserProperties = (userProperties: UserProperties) => {
  amplitude.getInstance().setUserProperties(userProperties);
};

// Prefer loggingHooks.ts to using this directly, to get default variables from Redux.
// If you need to use this, consider appending default metadata manually.
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, string>
) => {
  amplitude?.getInstance().logEvent(eventName, eventData);
};
