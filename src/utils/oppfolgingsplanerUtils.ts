import { erIdag } from "./datoUtils";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import {
  OppfolgingsplanLPS,
  OppfolgingsplanLPSMedPersonoppgave,
} from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";

export const toOppfolgingsplanLPSMedPersonoppgave = (
  oppfolgingsplanLPS: OppfolgingsplanLPS,
  personoppgaver: PersonOppgave[]
): OppfolgingsplanLPSMedPersonoppgave => {
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
};

const oppfolgingsplanerValidNow = (oppfolgingsplaner: OppfolgingsplanDTO[]) => {
  return oppfolgingsplaner.filter((plan) => {
    return (
      new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) > new Date() &&
      plan.godkjentPlan.deltMedNAV
    );
  });
};

const oppfolgingsplanerLPSOpprettetIdag = (
  oppfolgingsplaner: OppfolgingsplanLPSMedPersonoppgave[]
) => {
  return oppfolgingsplaner.filter((plan) => {
    return erIdag(plan.opprettet) && !plan.personoppgave;
  });
};

const planerSortedDescendingByDeltMedNAVTidspunkt = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
) => {
  return oppfolgingsplaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });
};

const virksomheterWithPlan = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
): string[] => {
  const uniqueVirksomheter = new Set(
    oppfolgingsplaner.map((plan) => plan.virksomhet.virksomhetsnummer)
  );

  return [...uniqueVirksomheter];
};

const firstPlanForEachVirksomhet = (
  oppfolgingsplaner: OppfolgingsplanDTO[],
  virksomheter: string[]
) => {
  const newestPlanPerVirksomhet = [] as any[];

  virksomheter.forEach((nummer) => {
    const newestPlanForVirksomhetsnummer = oppfolgingsplaner.find((plan) => {
      return plan.virksomhet.virksomhetsnummer === nummer;
    });
    newestPlanPerVirksomhet.push(newestPlanForVirksomhetsnummer);
  });

  return newestPlanPerVirksomhet;
};

const newestPlanForEachVirksomhet = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
) => {
  const sortedPlaner = planerSortedDescendingByDeltMedNAVTidspunkt(
    oppfolgingsplaner
  );

  const virksomheter = virksomheterWithPlan(sortedPlaner);

  return firstPlanForEachVirksomhet(sortedPlaner, virksomheter);
};

export const activeOppfolgingsplaner = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
): OppfolgingsplanDTO[] => {
  const newestPlans = newestPlanForEachVirksomhet(oppfolgingsplaner);
  return oppfolgingsplanerValidNow(newestPlans);
};

export const activeLPSOppfolgingsplaner = (
  oppfolgingsplaner: OppfolgingsplanLPSMedPersonoppgave[]
) => {
  return oppfolgingsplanerLPSOpprettetIdag(oppfolgingsplaner);
};
