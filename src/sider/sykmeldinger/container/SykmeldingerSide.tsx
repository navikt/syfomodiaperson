import React, { ReactElement } from "react";
import Side from "../../../components/side/Side";
import DineSykmeldinger from "../sykmeldinger/DineSykmeldinger";
import SideLaster from "../../../components/side/SideLaster";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Heading } from "@navikt/ds-react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import VurderBistandsbehov from "@/sider/sykmeldinger/VurderBistandsbehov";

export default function SykmeldingerSide(): ReactElement {
  const { isLoading, isError, sykmeldinger } = useSykmeldingerQuery();
  const { data: oppgaver } = usePersonoppgaverQuery();

  const ubehandletBistandsbehovOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLER_BER_OM_BISTAND
  );

  return (
    <Side tittel="Sykmeldinger" aktivtMenypunkt={Menypunkter.SYKMELDINGER}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          {ubehandletBistandsbehovOppgaver.map((oppgave) => (
            <VurderBistandsbehov oppgave={oppgave} key={oppgave.uuid} />
          ))}
          <Heading size="xlarge" className="text-center mt-4 mb-2">
            Sykmeldinger
          </Heading>
          <DineSykmeldinger sykmeldinger={sykmeldinger} />
        </div>
      </SideLaster>
    </Side>
  );
}
