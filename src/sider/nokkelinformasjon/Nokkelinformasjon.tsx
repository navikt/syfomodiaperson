import React, { useState } from "react";
import UtdragFraSykefravaeret from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import Sykmeldingsgrad from "@/sider/nokkelinformasjon/sykmeldingsgrad/Sykmeldingsgrad";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import Side from "@/components/side/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import SideLaster from "@/components/side/SideLaster";
import { Heading } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import Oppfolgingsenhet, {
  TildeltNotification,
} from "@/components/oppfolgingsenhet/Oppfolgingsenhet";
import TildeltOppfolgingsenhetAlert from "@/components/oppfolgingsenhet/TildeltOppfolgingsenhetAlert";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export default function Nokkelinformasjon() {
  const { isError: henterSykmeldingerFeilet, isLoading: henterSykmeldinger } =
    useGetSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { toggles } = useFeatureToggles();

  const [selectedOppfolgingstilfelle, setSelectedOppfolgingstilfelle] =
    useState<OppfolgingstilfelleDTO | undefined>();
  const [tildeltNotification, setTildeltNotification] = useState<
    TildeltNotification | undefined
  >(undefined);

  return (
    <Side
      tittel={texts.pageTitle}
      aktivtMenypunkt={Menypunkter.NOKKELINFORMASJON}
    >
      <SideLaster
        isLoading={henterSykmeldinger}
        isError={henterSykmeldingerFeilet}
      >
        <header>
          <Heading spacing size="large" className="hidden" level="1">
            {texts.pageTitle}
          </Heading>
        </header>
        {tildeltNotification && (
          <TildeltOppfolgingsenhetAlert
            tildeltNotification={tildeltNotification}
          />
        )}
        {toggles.isTildelOppfolgingsenhetEnabled && (
          <Oppfolgingsenhet
            setTildeltOppfolgingsenhetNotification={setTildeltNotification}
          />
        )}
        <Sykmeldingsgrad
          selectedOppfolgingstilfelle={
            selectedOppfolgingstilfelle || latestOppfolgingstilfelle
          }
          setSelectedOppfolgingstilfelle={setSelectedOppfolgingstilfelle}
        />
        <UtdragFraSykefravaeret
          selectedOppfolgingstilfelle={
            selectedOppfolgingstilfelle || latestOppfolgingstilfelle
          }
        />
      </SideLaster>
    </Side>
  );
}
