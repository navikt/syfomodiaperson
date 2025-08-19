export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isTildelOppfolgingsenhetEnabled = "isTildelOppfolgingsenhetEnabled",
  isInnstillingUtenForhandsvarselArbeidsuforhetEnabled = "isInnstillingUtenForhandsvarselArbeidsuforhetEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isTildelOppfolgingsenhetEnabled: false,
  isInnstillingUtenForhandsvarselArbeidsuforhetEnabled: false,
};
