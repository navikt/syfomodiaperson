export interface BehandlerDialogmeldingDTO {
  type: BehandlerType;
  behandlerRef: string;
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
  adresse?: string;
  orgnummer?: string;
  kontor?: string;
  postnummer?: string;
  poststed?: string;
  telefon?: string;
}

export enum BehandlerType {
  FASTLEGE = "FASTLEGE",
}
