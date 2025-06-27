import React from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import SideLaster from "@/components/side/SideLaster";
import * as Tredelt from "@/components/side/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { FriskmeldingTilArbeidsformidling } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidling";
import VeiledningBox from "@/sider/frisktilarbeid/VeiledningBox";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import NyttigeLenkerBox from "@/sider/frisktilarbeid/NyttigeLenkerBox";

const texts = {
  title: "Friskmelding til arbeidsformidling",
};

export default function FriskmeldingTilArbeidsformidlingSide() {
  const { isPending, isError } = useVedtakQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.FRISKTILARBEID}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isPending} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn className="-xl:mb-2">
            <NotificationProvider>
              <FriskmeldingTilArbeidsformidling />
            </NotificationProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <VeiledningBox />
            <NyttigeLenkerBox />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
