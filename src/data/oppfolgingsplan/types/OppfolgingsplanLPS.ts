import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";

export interface OppfolgingsplanLPS {
  uuid: string;
  fnr: string;
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  opprettet: Date;
  sistEndret: Date;
}

export type OppfolgingsplanLPSMedPersonoppgave = OppfolgingsplanLPS & {
  personoppgave?: PersonOppgave;
};
