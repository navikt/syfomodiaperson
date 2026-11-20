import { ReactElement } from "react";
import Side from "../../../components/side/Side";
import AlleSykmeldinger from "../sykmeldinger/AlleSykmeldinger";
import SideLaster from "../../../components/side/SideLaster";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import VurderBistandsbehov from "@/sider/sykmeldinger/VurderBistandsbehov";
import Sidetopp from "@/components/side/Sidetopp";
import * as Tredelt from "@/components/side/TredeltSide";
import BistandsbehovHistorikk from "@/sider/sykmeldinger/historikk/BistandsbehovHistorikk";

const texts = {
  title: "Sykmeldinger",
};

export default function SykmeldingerSide(): ReactElement {
  const { isLoading, isError, sykmeldinger } = useGetSykmeldingerQuery();
  const {
    data: oppgaver,
    isLoading: isLoadingOppgaver,
    isError: isErrorOppgaver,
  } = usePersonoppgaverQuery();

  const ubehandletBistandsbehovOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver ?? [],
    PersonOppgaveType.BEHANDLER_BER_OM_BISTAND,
  );

  return (
    <Side tittel="Sykmeldinger" aktivtMenypunkt={Menypunkter.SYKMELDINGER}>
      <SideLaster isLoading={isLoading} isError={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <div>
              {ubehandletBistandsbehovOppgaver.map((oppgave) => (
                <VurderBistandsbehov oppgave={oppgave} key={oppgave.uuid} />
              ))}
              <Sidetopp tittel={texts.title} />
              <AlleSykmeldinger sykmeldinger={sykmeldinger} />
            </div>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <BistandsbehovHistorikk
              oppgaver={oppgaver ?? []}
              isLoading={isLoadingOppgaver}
              isError={isErrorOppgaver}
            />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
