import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export interface OppfolgingsplanLPS {
  uuid: string;
  fnr: string;
  virksomhetsnummer: string;
  opprettet: string;
  sistEndret: string;
}

export type OppfolgingsplanLPSMedPersonoppgave = OppfolgingsplanLPS & {
  personoppgave?: PersonOppgave;
};

export function isPlanWithinActiveTilfelle(
  plan: OppfolgingsplanLPS,
  oppfolgingstilfelle: OppfolgingstilfelleDTO,
  isLatestTilfelle = false
): boolean {
  const tilfelleStart = new Date(oppfolgingstilfelle.start);
  const planOpprettet = new Date(plan.opprettet);
  if (isLatestTilfelle) {
    return planOpprettet >= tilfelleStart;
  }
  const tilfelleEnd = new Date(oppfolgingstilfelle.end);
  return tilfelleStart <= planOpprettet && planOpprettet <= tilfelleEnd;
}
