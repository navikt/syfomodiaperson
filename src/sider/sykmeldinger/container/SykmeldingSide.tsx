import React from "react";
import {
  ArbeidssituasjonType,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Side from "../../../components/side/Side";
import SideLaster from "../../../components/side/SideLaster";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import EndreSykmelding from "@/components/endresykmelding/EndreSykmelding";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Box } from "@navikt/ds-react";
import Sykmelding from "@/sider/sykmeldinger/sykmelding/Sykmelding";
import EndreUtenlandskSykmelding from "@/components/endresykmelding/EndreUtenlandskSykmelding";
import Tilbakelenke from "@/components/Tilbakelenke";

const texts = {
  pageTitleSykmelding: "Sykmelding",
  tilbake: "Gå til sykmeldinger",
};

function getSykmelding(
  sykmeldinger: SykmeldingOldFormat[],
  sykmeldingId: string
): SykmeldingOldFormat | undefined {
  return sykmeldinger.find((sykmld) => `${sykmld.id}` === `${sykmeldingId}`);
}

export default function SykmeldingSide() {
  const sykmeldingId = window.location.pathname.split("/")[3];

  const { isLoading, isError, sykmeldinger, arbeidsgiverssykmeldinger } =
    useGetSykmeldingerQuery();

  const sykmelding = getSykmelding(sykmeldinger, sykmeldingId);
  let arbeidsgiversSykmelding = {} as SykmeldingOldFormat | undefined;

  if (
    sykmelding &&
    (sykmelding.status === SykmeldingStatus.SENDT ||
      (sykmelding.status === SykmeldingStatus.BEKREFTET &&
        sykmelding.valgtArbeidssituasjon === ArbeidssituasjonType.ARBEIDSTAKER))
  ) {
    arbeidsgiversSykmelding = getSykmelding(
      arbeidsgiverssykmeldinger,
      sykmeldingId
    );
  }

  return (
    <Side
      tittel={texts.pageTitleSykmelding}
      aktivtMenypunkt={Menypunkter.SYKMELDINGER}
    >
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Box background="surface-default" className="p-4">
          <Sykmelding
            sykmelding={sykmelding}
            arbeidsgiversSykmelding={arbeidsgiversSykmelding}
          />
          {sykmelding?.papirsykmelding && <EndreSykmelding />}
          {sykmelding?.utenlandskSykmelding && <EndreUtenlandskSykmelding />}
          <Tilbakelenke to="/sykefravaer/sykmeldinger" tekst={texts.tilbake} />
        </Box>
      </SideLaster>
    </Side>
  );
}
