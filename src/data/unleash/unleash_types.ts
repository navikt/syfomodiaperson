export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isSenFaseFlexjarEnabled = "isSenFaseFlexjarEnabled",
  isHistorikkFlexjarEnabled = "isHistorikkFlexjarEnabled",
  isBeOmOppfolgingsplanEnabled = "isBeOmOppfolgingsplanEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isSenFaseFlexjarEnabled: false,
  isHistorikkFlexjarEnabled: false,
  isBeOmOppfolgingsplanEnabled: false,
};
