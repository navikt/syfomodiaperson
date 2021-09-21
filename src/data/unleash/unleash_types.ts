export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  dm2 = "syfo.syfomodiaperson.dm2",
  dm2VarselFysiskBrev = "syfo.syfomodiaperson.dm2varselFysiskBrev",
  dm2InnkallingFastlege = "syfo.syfomodiaperson.dm2innkallingFastlege",
}
