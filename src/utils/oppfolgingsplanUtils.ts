import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

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
  oppfolgingstilfelle: OppfolgingstilfelleDTO
) => {
  return lpsplaner.filter((plan) => {
    return (
      new Date(plan.opprettet) >= new Date(oppfolgingstilfelle.start) &&
      new Date(plan.opprettet) <= new Date(oppfolgingstilfelle.end)
    );
  });
};

export const lpsPlanerWithActiveTilfelle = (
  lpsplaner: OppfolgingsplanLPS[],
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
): OppfolgingsplanLPS[] => {
  const aktivePlanerForOppfolgingstilfelle = oppfolgingstilfelle
    ? lpsPlanerWithinActiveTilfelle(lpsplaner, oppfolgingstilfelle)
    : [];

  return newestLpsPlanPerVirksomhet(aktivePlanerForOppfolgingstilfelle);
};
