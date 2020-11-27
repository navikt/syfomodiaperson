import { erIdag } from "./datoUtils";

const oppfolgingsplanerValidNow = (oppfolgingsplaner) => {
  return oppfolgingsplaner.filter((plan) => {
    return (
      new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) > new Date() &&
      plan.godkjentPlan.deltMedNAV
    );
  });
};

const oppfolgingsplanerLPSOpprettetIdag = (oppfolgingsplaner) => {
  return oppfolgingsplaner.filter((plan) => {
    return erIdag(plan.opprettet) && !plan.personoppgave;
  });
};

const planerSortedDescendingByDeltMedNAVTidspunkt = (oppfolgingsplaner) => {
  return oppfolgingsplaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt) -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt)
    );
  });
};

const virksomheterWithPlan = (oppfolgingsplaner) => {
  const uniqueVirksomheter = new Set(
    oppfolgingsplaner.map((plan) => {
      return plan.virksomhet
        ? plan.virksomhet.virksomhetsnummer
        : plan.virksomhetsnummer;
    })
  );

  return [...uniqueVirksomheter];
};

const firstPlanForEachVirksomhet = (oppfolgingsplaner, virksomheter) => {
  const newestPlanPerVirksomhet = [];

  virksomheter.forEach((nummer) => {
    const newestPlanForVirksomhetsnummer = oppfolgingsplaner.find((plan) => {
      return plan.virksomhet
        ? plan.virksomhet.virksomhetsnummer === nummer
        : plan.virksomhetsnummer === nummer;
    });
    newestPlanPerVirksomhet.push(newestPlanForVirksomhetsnummer);
  });

  return newestPlanPerVirksomhet;
};

const newestPlanForEachVirksomhet = (oppfolgingsplaner) => {
  const sortedPlaner = planerSortedDescendingByDeltMedNAVTidspunkt(
    oppfolgingsplaner
  );

  const virksomheter = virksomheterWithPlan(sortedPlaner);

  return firstPlanForEachVirksomhet(sortedPlaner, virksomheter);
};

export const activeOppfolgingsplaner = (oppfolgingsplaner) => {
  const newestPlans = newestPlanForEachVirksomhet(oppfolgingsplaner);
  return oppfolgingsplanerValidNow(newestPlans);
};

export const activeLPSOppfolgingsplaner = (oppfolgingsplaner) => {
  return oppfolgingsplanerLPSOpprettetIdag(oppfolgingsplaner);
};
