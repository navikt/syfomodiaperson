import { erIdag } from "./datoUtils";
import {
  isPlanValidNow,
  OppfolgingsplanDTO,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
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

export function activeOppfolgingsplaner(
  oppfolgingsplaner: OppfolgingsplanDTO[]
): OppfolgingsplanDTO[] {
  const sortedPlaner =
    planerSortedDescendingByDeltMedNAVTidspunkt(oppfolgingsplaner);
  const virksomheterMedOppfolgingsplan = virksomheterWithPlan(sortedPlaner);

  return firstPlanForEachVirksomhet(
    sortedPlaner,
    virksomheterMedOppfolgingsplan
  ).filter((plan) => isPlanValidNow(plan));
}
