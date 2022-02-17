import React from "react";
import Side from "../../../sider/Side";
import OppfolgingsplanerOversikt from "../oppfoelgingsdialoger/OppfolgingsplanerOversikt";
import IngenPlaner from "../oppfoelgingsdialoger/IngenPlaner";
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
    data: oppfoelgingsdialoger,
    isError: oppfoelgingsdialogerHentingFeilet,
    isLoading: henterOppfoelgingsdialoger,
  } = useOppfolgingsplanerQuery();
  const {
    data: oppfolgingsplanerLPS,
    isError: oppfolgingsplanerLPSHentingFeilet,
    isLoading: henterOppfolgingsplanerLPS,
  } = useOppfolgingsplanerLPSQuery();

  const henter = henterOppfoelgingsdialoger || henterOppfolgingsplanerLPS;

  const hentingFeilet =
    oppfoelgingsdialogerHentingFeilet || oppfolgingsplanerLPSHentingFeilet;

  const aktiveDialoger = activeOppfolgingsplaner(oppfoelgingsdialoger);
  const inaktiveDialoger = oppfoelgingsdialoger.filter(
    (dialog) => !aktiveDialoger.includes(dialog)
  );

  return (
    <Side tittel="Oppfølgingsplaner" aktivtMenypunkt={OPPFOELGINGSPLANER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        {(() => {
          if (
            aktiveDialoger.length === 0 &&
            inaktiveDialoger.length === 0 &&
            oppfolgingsplanerLPS.length === 0
          ) {
            return <IngenPlaner />;
          }
          return (
            <OppfolgingsplanerOversikt
              aktiveDialoger={aktiveDialoger}
              inaktiveDialoger={inaktiveDialoger}
              oppfolgingsplanerLPS={oppfolgingsplanerLPS}
              fnr={fnr}
            />
          );
        })()}
      </SideLaster>
    </Side>
  );
};
