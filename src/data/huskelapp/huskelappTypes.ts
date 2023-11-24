export interface HuskelappRequestDTO {
  oppfolgingsgrunn: Oppfolgingsgrunn;
}

export interface HuskelappResponseDTO {
  uuid: string;
  createdBy: string;
  oppfolgingsgrunn: Oppfolgingsgrunn;
}

export enum Oppfolgingsgrunn {
  AVVENT_DIALOGMOTE = "AVVENT_DIALOGMOTE",
  VURDER_DIALOGMOTE_SENERE = "VURDER_DIALOGMOTE_SENERE",
  FOLG_OPP_FRA_LEGE = "FOLG_OPP_FRA_LEGE",
  FOLG_OPP_FRA_ARBEIDSGIVER = "FOLG_OPP_FRA_ARBEIDSGIVER",
  TA_KONTAKT = "TA_KONTAKT",
  VURDER_TILTAK_BEHOV = "VURDER_TILTAK_BEHOV",
  ANNEN_OPPFOLGNING = "ANNEN_OPPFOLGNING",
}
