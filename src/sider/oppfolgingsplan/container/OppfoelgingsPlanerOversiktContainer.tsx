import React from "react";
import Side from "../../../components/side/Side";
import OppfolgingsplanerOversikt from "../oppfolgingsplaner/OppfolgingsplanerOversikt";
import { activeOppfolgingsplaner } from "@/utils/oppfolgingsplanerUtils";
import SideLaster from "../../../components/side/SideLaster";
import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

export default function OppfoelgingsPlanerOversiktContainer() {
  const getOppfolgingsplaner = useGetOppfolgingsplanerQuery();
  const getLPSOppfolgingsplaner = useGetLPSOppfolgingsplanerQuery();

  const henter =
    getOppfolgingsplaner.isLoading || getLPSOppfolgingsplaner.isLoading;

  const hentingFeilet =
    getOppfolgingsplaner.isError || getLPSOppfolgingsplaner.isError;

  const aktivePlaner = activeOppfolgingsplaner(getOppfolgingsplaner.data);
  const inaktivePlaner = getOppfolgingsplaner.data.filter(
    (plan) => !aktivePlaner.includes(plan)
  );

  return (
    <Side
      tittel="Oppfølgingsplaner"
      aktivtMenypunkt={Menypunkter.OPPFOELGINGSPLANER}
    >
      <SideLaster isLoading={henter} isError={hentingFeilet}>
        <OppfolgingsplanerOversikt
          aktivePlaner={aktivePlaner}
          inaktivePlaner={inaktivePlaner}
          oppfolgingsplanerLPS={getLPSOppfolgingsplaner.data}
        />
      </SideLaster>
    </Side>
  );
}
