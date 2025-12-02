import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import SideLaster from "@/components/side/SideLaster";
import { AktivitetskravSide } from "@/sider/aktivitetskrav/AktivitetskravSide";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import * as Tredelt from "@/components/side/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import NyttigeLenkerBox from "@/sider/aktivitetskrav/NyttigeLenkerBox";

const texts = {
  title: "Aktivitetskrav",
  noAccess: "Du har ikke tilgang til denne tjenesten",
};

export const AktivitetskravContainer = (): ReactElement => {
  const { isLoading: henterAktivitetskrav, isError: hentAktivitetskravFeilet } =
    useAktivitetskravQuery();
  const {
    isLoading: henterOppfolgingstilfeller,
    isError: hentOppfolgingstilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  const henter = henterAktivitetskrav || henterOppfolgingstilfeller;
  const hentingFeilet =
    hentAktivitetskravFeilet || hentOppfolgingstilfellerFeilet;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.AKTIVITETSKRAV}>
      <Sidetopp tittel={texts.title} />
      <SideLaster isLoading={henter} isError={hentingFeilet}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <NotificationProvider>
              <AktivitetskravSide />
            </NotificationProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <UtdragFraSykefravaeret />
            <NyttigeLenkerBox />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
