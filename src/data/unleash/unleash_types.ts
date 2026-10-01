export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isTildelOppfolgingsenhetEnabled = "isTildelOppfolgingsenhetEnabled",
  isKartleggingssporsmalEnabled = "isKartleggingssporsmalEnabled",
  isFlexjarKartleggingssporsmalEnabled = "isFlexjarKartleggingssporsmalEnabled", // Benytter Lumi, ikke Flexjar
  isForsokForsterketOppfolgingMerkingEnabled = "isForsokForsterketOppfolgingMerkingEnabled",
  isUtenlandsoppholdEnabled = "isUtenlandsoppholdEnabled",
  isLumiUtenlandsoppholdEnabled = "isLumiUtenlandsoppholdEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isTildelOppfolgingsenhetEnabled: false,
  isKartleggingssporsmalEnabled: false,
  isFlexjarKartleggingssporsmalEnabled: false,
  isForsokForsterketOppfolgingMerkingEnabled: false,
  isUtenlandsoppholdEnabled: false,
  isLumiUtenlandsoppholdEnabled: false,
};
