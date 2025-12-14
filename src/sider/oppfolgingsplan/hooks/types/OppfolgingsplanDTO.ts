export interface OppfolgingsplanDTO {
  id: number;
  uuid: string;
  sistEndretAvAktoerId: string;
  sistEndretDato: Date;
  status: string;
  godkjentPlan: GodkjentPlanDTO;
  virksomhet: OPVirksomhetDTO;
}

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

export function isPlanValidNow(plan: OppfolgingsplanDTO): boolean {
  return (
    new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) >= new Date() &&
    plan.godkjentPlan.deltMedNAV
  );
}

export function partitionOppfolgingsplanerByAktivPlan(
  planer: OppfolgingsplanDTO[]
): [OppfolgingsplanDTO[], OppfolgingsplanDTO[]] {
  const aktivePlaner = aktiveOppfolgingsplaner(planer);
  const sortedAktivePlaner =
    planerSortedDescendingByDeltMedNAVTidspunkt(aktivePlaner);

  const inaktivePlaner = planer.filter((plan) => !aktivePlaner.includes(plan));
  const sortedInaktivePlaner =
    planerSortedDescendingByDeltMedNAVTidspunkt(inaktivePlaner);

  return [sortedAktivePlaner, sortedInaktivePlaner];
}

function planerSortedDescendingByDeltMedNAVTidspunkt(
  oppfolgingsplaner: OppfolgingsplanDTO[]
) {
  return oppfolgingsplaner.sort(
    (a, b) =>
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
  );
}

function virksomheterWithPlan(
  oppfolgingsplaner: OppfolgingsplanDTO[]
): string[] {
  const uniqueVirksomheter = new Set(
    oppfolgingsplaner.map((plan) => plan.virksomhet.virksomhetsnummer)
  );
  return [...uniqueVirksomheter];
}

function firstPlanForEachVirksomhet(
  oppfolgingsplaner: OppfolgingsplanDTO[],
  virksomheter: string[]
) {
  const newestPlanPerVirksomhet = [] as any[];

  virksomheter.forEach((nummer) => {
    const newestPlanForVirksomhetsnummer = oppfolgingsplaner.find(
      (plan) => plan.virksomhet.virksomhetsnummer === nummer
    );
    newestPlanPerVirksomhet.push(newestPlanForVirksomhetsnummer);
  });

  return newestPlanPerVirksomhet;
}

export function aktiveOppfolgingsplaner(
  oppfolgingsplaner: OppfolgingsplanDTO[]
): OppfolgingsplanDTO[] {
  const sortedPlaner =
    planerSortedDescendingByDeltMedNAVTidspunkt(oppfolgingsplaner);
  const virksomheterMedOppfolgingsplan = virksomheterWithPlan(sortedPlaner);

  return firstPlanForEachVirksomhet(
    oppfolgingsplaner,
    virksomheterMedOppfolgingsplan
  ).filter((plan) => isPlanValidNow(plan));
}
