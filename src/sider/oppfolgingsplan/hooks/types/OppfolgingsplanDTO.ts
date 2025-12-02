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

export function isPlanValidNow(plan: OppfolgingsplanDTO): boolean {
  return (
    new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) >= new Date() &&
    plan.godkjentPlan.deltMedNAV
  );
}
