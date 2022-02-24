export enum NarmesteLederRelasjonStatus {
  INNMELDT_AKTIV = "INNMELDT_AKTIV",
  DEAKTIVERT = "DEAKTIVERT",
  DEAKTIVERT_ARBEIDSTAKER = "DEAKTIVERT_ARBEIDSTAKER",
  DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING = "DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING",
  DEAKTIVERT_LEDER = "DEAKTIVERT_LEDER",
  DEAKTIVERT_ARBEIDSFORHOLD = "DEAKTIVERT_ARBEIDSFORHOLD",
  DEAKTIVERT_NY_LEDER = "DEAKTIVERT_NY_LEDER",
}

export interface NarmesteLederRelasjonDTO {
  uuid: string;
  arbeidstakerPersonIdentNumber: string;
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  narmesteLederPersonIdentNumber: string;
  narmesteLederEpost: string;
  narmesteLederTelefonnummer: string;
  narmesteLederNavn: string;
  aktivFom: Date;
  aktivTom?: Date;
  arbeidsgiverForskutterer?: boolean;
  timestamp: Date;
  status: NarmesteLederRelasjonStatus;
}
