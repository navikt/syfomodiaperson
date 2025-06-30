import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import SykepengesoknadStatuspanel from "./SykepengesoknadStatuspanel";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { KorrigertAv } from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { erTilSlutt } from "@/utils/sykepengesoknadUtils";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { Box, Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger",
  oppsummeringTittel: "Oppsummering",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SendtSoknadArbeidstakerNy({
  soknad,
}: Props): ReactElement {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      {soknad.status === Soknadstatus.KORRIGERT && (
        <KorrigertAv soknadId={soknad.id} />
      )}
      <SykepengesoknadStatuspanel soknad={soknad} />
      <SykmeldingUtdragContainer soknad={soknad} />
      <SpeilingEkspanderbartPanel tittel={texts.oppsummeringTittel}>
        <Oppsummeringsvisning
          soknad={{
            ...soknad,
            sporsmal: soknad.sporsmal.filter(
              (sporsmal) => !erTilSlutt(sporsmal)
            ),
          }}
        />
      </SpeilingEkspanderbartPanel>
      <Box>
        <Oppsummeringsvisning
          soknad={{
            ...soknad,
            sporsmal: soknad.sporsmal.filter((sporsmal) =>
              erTilSlutt(sporsmal)
            ),
          }}
        />
      </Box>
      <RelaterteSoknader soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
}
