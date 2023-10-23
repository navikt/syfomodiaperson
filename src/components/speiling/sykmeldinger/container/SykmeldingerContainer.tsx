import React, { ReactElement } from "react";
import Side from "../../../../sider/Side";
import DineSykmeldinger from "../sykmeldinger/DineSykmeldinger";
import Pengestopp from "../../../pengestopp/Pengestopp";
import SideLaster from "../../../SideLaster";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import { HackathonOppgave } from "@/components/speiling/sykmeldinger/HackathonOppgave";

const SykmeldingerSide = (): ReactElement => {
  const { isInitialLoading, isError, sykmeldinger } = useSykmeldingerQuery();

  return (
    <Side tittel="Sykmeldinger" aktivtMenypunkt={Menypunkter.SYKMELDINGER}>
      <SideLaster henter={isInitialLoading} hentingFeilet={isError}>
        <div>
          <Pengestopp sykmeldinger={sykmeldinger} />
          <HackathonOppgave />
          <DineSykmeldinger sykmeldinger={sykmeldinger} />
        </div>
      </SideLaster>
    </Side>
  );
};

export default SykmeldingerSide;
