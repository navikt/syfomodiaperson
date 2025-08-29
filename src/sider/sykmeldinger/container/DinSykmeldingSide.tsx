import React from "react";
import {
  ArbeidssituasjonType,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Side from "../../../components/side/Side";
import SideLaster from "../../../components/side/SideLaster";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import EndreSykmelding from "@/components/endresykmelding/EndreSykmelding";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Box } from "@navikt/ds-react";
import SykmeldingSide from "@/sider/sykmeldinger/sykmelding/SykmeldingSide";
import EndreUtenlandskSykmelding from "@/components/endresykmelding/EndreUtenlandskSykmelding";
import Tilbakelenke from "@/components/Tilbakelenke";

const texts = {
  pageTitleSykmelding: "Sykmelding",
  tilbake: "Gå til dine sykmeldinger",
};

function getSykmelding(
  sykmeldinger: SykmeldingOldFormat[],
  sykmeldingId: string
): SykmeldingOldFormat | undefined {
  return sykmeldinger.find((sykmld) => `${sykmld.id}` === `${sykmeldingId}`);
}

export default function DinSykmeldingSide() {
  const sykmeldingId = window.location.pathname.split("/")[3];

  const { isLoading, isError, sykmeldinger, arbeidsgiverssykmeldinger } =
    useSykmeldingerQuery();

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
          <SykmeldingSide
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
