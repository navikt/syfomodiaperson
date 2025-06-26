import React from "react";
import Side from "../../../components/side/Side";
import OppfolgingsplanerOversikt from "../oppfolgingsplaner/OppfolgingsplanerOversikt";
import { activeOppfolgingsplaner } from "@/utils/oppfolgingsplanerUtils";
import SideLaster from "../../../components/side/SideLaster";
import {
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

export default function OppfoelgingsPlanerOversiktContainer() {
  const {
    data: oppfolgingsplaner,
    isError: oppfolgingsplanerHentingFeilet,
    isLoading: henterOppfolgingsplaner,
  } = useOppfolgingsplanerQuery();
  const {
    data: oppfolgingsplanerLPS,
    isError: oppfolgingsplanerLPSHentingFeilet,
    isLoading: henterOppfolgingsplanerLPS,
  } = useOppfolgingsplanerLPSQuery();

  const henter = henterOppfolgingsplaner || henterOppfolgingsplanerLPS;

  const hentingFeilet =
    oppfolgingsplanerHentingFeilet || oppfolgingsplanerLPSHentingFeilet;

  const aktivePlaner = activeOppfolgingsplaner(oppfolgingsplaner);
  const inaktivePlaner = oppfolgingsplaner.filter(
    (plan) => !aktivePlaner.includes(plan)
  );

  return (
    <Side
      tittel="Oppfølgingsplaner"
      aktivtMenypunkt={Menypunkter.OPPFOELGINGSPLANER}
    >
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <OppfolgingsplanerOversikt
          aktivePlaner={aktivePlaner}
          inaktivePlaner={inaktivePlaner}
          oppfolgingsplanerLPS={oppfolgingsplanerLPS}
        />
      </SideLaster>
    </Side>
  );
}
