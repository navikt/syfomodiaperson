import React from "react";
import Side from "../../../sider/Side";
import OppfolgingsplanerOversikt from "../oppfolgingsplaner/OppfolgingsplanerOversikt";
import IngenPlaner from "../oppfolgingsplaner/IngenPlaner";
import { OPPFOELGINGSPLANER } from "@/enums/menypunkter";
import { activeOppfolgingsplaner } from "@/utils/oppfolgingsplanerUtils";
import SideLaster from "../../SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

export const OppfoelgingsPlanerOversiktContainer = () => {
  const fnr = useValgtPersonident();
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
    <Side tittel="Oppfølgingsplaner" aktivtMenypunkt={OPPFOELGINGSPLANER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        {(() => {
          if (
            aktivePlaner.length === 0 &&
            inaktivePlaner.length === 0 &&
            oppfolgingsplanerLPS.length === 0
          ) {
            return <IngenPlaner />;
          }
          return (
            <OppfolgingsplanerOversikt
              aktivePlaner={aktivePlaner}
              inaktivePlaner={inaktivePlaner}
              oppfolgingsplanerLPS={oppfolgingsplanerLPS}
              fnr={fnr}
            />
          );
        })()}
      </SideLaster>
    </Side>
  );
};
