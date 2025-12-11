import {
  isPlanWithinActiveTilfelle,
  OppfolgingsplanLPS,
} from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
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

export function lpsPlanerWithActiveTilfelle(
  lpsplaner: OppfolgingsplanLPS[],
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
): OppfolgingsplanLPS[] {
  const aktivePlanerForOppfolgingstilfelle = oppfolgingstilfelle
    ? lpsplaner.filter((plan) =>
        isPlanWithinActiveTilfelle(plan, oppfolgingstilfelle)
      )
    : [];

  return newestLpsPlanPerVirksomhet(aktivePlanerForOppfolgingstilfelle);
}
