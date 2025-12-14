export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isTildelOppfolgingsenhetEnabled = "isTildelOppfolgingsenhetEnabled",
  isKartleggingssporsmalEnabled = "isKartleggingssporsmalEnabled",
  isFlexjarKartleggingssporsmalEnabled = "isFlexjarKartleggingssporsmalEnabled",
  isForsokForsterketOppfolgingMerkingEnabled = "isForsokForsterketOppfolgingMerkingEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isTildelOppfolgingsenhetEnabled: false,
  isKartleggingssporsmalEnabled: false,
  isFlexjarKartleggingssporsmalEnabled: false,
  isForsokForsterketOppfolgingMerkingEnabled: false,
};
