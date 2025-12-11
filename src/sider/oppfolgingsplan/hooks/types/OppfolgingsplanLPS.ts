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
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): boolean {
  return new Date(plan.opprettet) >= new Date(oppfolgingstilfelle.start);
}
