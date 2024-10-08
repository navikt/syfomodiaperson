import React, { useState } from "react";
import UtdragFraSykefravaeret from "../../components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/sider/nokkelinformasjon/sykmeldingsgrad/Sykmeldingsgrad";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import Side from "@/sider/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import SideLaster from "@/components/SideLaster";
import { Heading } from "@navikt/ds-react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const Nokkelinformasjon = () => {
  const { isLoading: henterOppfolgingsplaner } = useOppfolgingsplanerQuery();
  const { isError: henterSykmeldingerFeilet } = useSykmeldingerQuery();
  const { isLoading: henterLedere, isError: henterLedereFeilet } =
    useLedereQuery();

  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const [selectedOppfolgingstilfelle, setSelectedOppfolgingstilfelle] =
    useState<OppfolgingstilfelleDTO | undefined>();

  const henter = henterOppfolgingsplaner || henterLedere;
  const hentingFeilet = henterSykmeldingerFeilet || henterLedereFeilet;

  return (
    <Side
      tittel={texts.pageTitle}
      aktivtMenypunkt={Menypunkter.NOKKELINFORMASJON}
    >
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <header>
          <Heading spacing size="large" className="hidden" level="1">
            {texts.pageTitle}
          </Heading>
        </header>
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
