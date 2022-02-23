import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";

const newestLpsPlanPerVirksomhet = (lpsplaner: OppfolgingsplanLPS[]) => {
  return lpsplaner.filter((plan) => {
    return (
      lpsplaner.findIndex((plan2) => {
        return (
          plan2.virksomhetsnummer === plan.virksomhetsnummer &&
          plan2.uuid !== plan.uuid &&
          new Date(plan2.opprettet) > new Date(plan.opprettet)
        );
      }) < 0
    );
  });
};

const lpsPlanerWithinActiveTilfelle = (
  lpsplaner: OppfolgingsplanLPS[],
  startDateNewestActiveTilfelle?: Date
) => {
  if (startDateNewestActiveTilfelle === undefined) {
    return [];
  }

  return lpsplaner.filter((plan) => {
    return new Date(plan.opprettet) > new Date(startDateNewestActiveTilfelle);
  });
};

export const lpsPlanerWithActiveTilfelle = (
  lpsplaner: OppfolgingsplanLPS[],
  startDateNewestActiveTilfelle?: Date
) => {
  const newestPlanPerVirksomhet = newestLpsPlanPerVirksomhet(lpsplaner);

  return lpsPlanerWithinActiveTilfelle(
    newestPlanPerVirksomhet,
    startDateNewestActiveTilfelle
  );
};
