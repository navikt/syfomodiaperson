import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { FriskmeldingTilArbeidsformidling } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidling";
import { VeiledningBox } from "@/sider/frisktilarbeid/VeiledningBox";
import { NotificationProvider } from "@/context/notification/NotificationContext";

const texts = {
  title: "Friskmelding til arbeidsformidling",
};

export const FriskmeldingTilArbeidsformidlingSide = (): ReactElement => {
  const { isLoading, isError } = useVedtakQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.FRISKTILARBEID}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn className="-xl:mb-2">
            <NotificationProvider>
              <FriskmeldingTilArbeidsformidling />
            </NotificationProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <VeiledningBox />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
