export interface BehandlerDialogmeldingDTO {
  type: BehandlerType;
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
  fnr: string;
  partnerId: string;
  herId: string;
  hprId?: string;
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
