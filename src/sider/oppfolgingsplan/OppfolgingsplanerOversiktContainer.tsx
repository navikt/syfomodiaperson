import React from "react";
import { activeOppfolgingsplaner } from "@/utils/oppfolgingsplanerUtils";
import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerQuery,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import OppfolgingsplanerOversikt from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanerOversikt";

export default function OppfolgingsPlanerOversiktContainer() {
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
