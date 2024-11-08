export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isFlexjarEnabled = "isFlexjarEnabled",
  isFrisktilarbeidEnabled = "isFrisktilarbeidEnabled",
  isOppfolgingISenFaseEnabled = "isOppfolgingISenFaseEnabled",
  isSenFaseFlexjarEnabled = "isSenFaseFlexjarEnabled",
  isHistorikkFlexjarEnabled = "isHistorikkFlexjarEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isFlexjarEnabled: false,
  isFrisktilarbeidEnabled: false,
  isOppfolgingISenFaseEnabled: false,
  isSenFaseFlexjarEnabled: false,
  isHistorikkFlexjarEnabled: false,
};
