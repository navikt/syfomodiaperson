import React, { useState } from "react";
import UtdragFraSykefravaeret from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/sider/nokkelinformasjon/sykmeldingsgrad/Sykmeldingsgrad";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import SideLaster from "@/components/SideLaster";
import { Heading } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { Tildele } from "@/components/tildele/Tildele";
import { TildeltNotification } from "@/components/tildele/oppfolgingsenhet/Oppfolgingsenhet";
import { TildeltOppfolgingsenhetAlert } from "@/components/tildele/oppfolgingsenhet/TildeltOppfolgingsenhetAlert";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const Nokkelinformasjon = () => {
  const { isError: henterSykmeldingerFeilet, isLoading: henterSykmeldinger } =
    useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

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
        henter={henterSykmeldinger}
        hentingFeilet={henterSykmeldingerFeilet}
      >
        <header>
          <Heading spacing size="large" className="hidden" level="1">
            {texts.pageTitle}
          </Heading>
        </header>
        <TildeltOppfolgingsenhetAlert
          tildeltNotification={tildeltNotification}
        />
        <Tildele
          setTildeltOppfolgingsenhetNotification={setTildeltNotification}
        />
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
};
