export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isBehandlerDialogLegeerklaringEnabled = "isBehandlerDialogLegeerklaringEnabled",
  isReturLegeerklaringEnabled = "isReturLegeerklaringEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isBehandlerDialogLegeerklaringEnabled: false,
  isReturLegeerklaringEnabled: false,
  isMotebehovTilbakemeldingEnabled: false,
};
