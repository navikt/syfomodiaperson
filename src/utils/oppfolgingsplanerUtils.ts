import { erIdag } from "./datoUtils";
import {
  OppfolgingsplanLPS,
  OppfolgingsplanLPSMedPersonoppgave,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";

export function toOppfolgingsplanLPSMedPersonoppgave(
  oppfolgingsplanLPS: OppfolgingsplanLPS,
  personoppgaver: PersonOppgave[]
): OppfolgingsplanLPSMedPersonoppgave {
  const personoppgave = personoppgaver.find(
    (personoppgave) => personoppgave.referanseUuid === oppfolgingsplanLPS.uuid
  );

  if (personoppgave) {
    return {
      ...oppfolgingsplanLPS,
      personoppgave,
    };
  }

  return oppfolgingsplanLPS;
}

export function oppfolgingsplanerLPSOpprettetIdag(
  oppfolgingsplaner: OppfolgingsplanLPSMedPersonoppgave[]
) {
  return oppfolgingsplaner.filter(
    (plan) => erIdag(plan.opprettet) && !plan.personoppgave
  );
}
