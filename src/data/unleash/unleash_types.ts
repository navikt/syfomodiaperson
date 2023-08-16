export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  virksomhetinput = "syfo.dialogmote.virksomhetinput",
  behandlerdialogLegeerklaring = "syfo.behandlerdialog.legeerklaring",
  behandlerdialogReturLegeeklaring = "syfo.behandlerdialog.returlegeeklaring",
  vurderMotebehovTilbakemelding = "syfo.motebehov.tilbakemelding",
}
