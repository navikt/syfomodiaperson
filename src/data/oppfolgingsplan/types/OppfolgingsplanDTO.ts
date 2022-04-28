export interface GodkjentPlanGyldighetTidspunktDTO {
  fom: Date;
  tom: Date;
  evalueres: Date;
}

export interface OPVirksomhetDTO {
  navn: string;
  virksomhetsnummer: string;
}

export interface GodkjentPlanDTO {
  opprettetTidspunkt: Date;
  gyldighetstidspunkt: GodkjentPlanGyldighetTidspunktDTO;
  tvungenGodkjenning: boolean;
  deltMedNAV: boolean;
  deltMedNAVTidspunkt: Date;
  deltMedFastlege: boolean;
  deltMedFastlegeTidspunkt?: Date;
  dokumentUuid: string;
}

export interface OppfolgingsplanDTO {
  id: number;
  uuid: string;
  sistEndretAvAktoerId: string;
  sistEndretDato: Date;
  status: string;
  godkjentPlan: GodkjentPlanDTO;
  virksomhet: OPVirksomhetDTO;
}
