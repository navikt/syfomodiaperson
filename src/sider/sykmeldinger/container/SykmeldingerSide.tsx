import React, { ReactElement } from "react";
import Side from "../../../components/side/Side";
import DineSykmeldinger from "../sykmeldinger/DineSykmeldinger";
import SideLaster from "../../../components/side/SideLaster";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { BistandsbehovOppgaver } from "@/sider/sykmeldinger/VurderBistandsbehov";
import { Heading } from "@navikt/ds-react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

export default function SykmeldingerSide(): ReactElement {
  const { isLoading, isError, sykmeldinger } = useSykmeldingerQuery();

  return (
    <Side tittel="Sykmeldinger" aktivtMenypunkt={Menypunkter.SYKMELDINGER}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          <BistandsbehovOppgaver />
          <Heading size="xlarge" className="text-center mt-4 mb-2">
            Sykmeldinger
          </Heading>
          <DineSykmeldinger sykmeldinger={sykmeldinger} />
        </div>
      </SideLaster>
    </Side>
  );
}
