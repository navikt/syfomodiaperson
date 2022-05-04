export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  dialogmotekandidat = "syfo.syfomodiaperson.dialogmote.kandidat",
  sykmeldingsgrad = "syfo.syfomodiaperson.sykmeldingsgrad",
  behandlertekst = "syfo.syfomodiaperson.behandlertekst",
}
