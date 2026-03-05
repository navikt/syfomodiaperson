import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import KorrigertAv from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";
import { Box, Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";
import { SykepengesoknadStatuspanel } from "@/sider/sykepengsoknader/soknad-arbeidstaker-ny/SykepengesoknadStatuspanel";

const texts = {
  tittel: "Søknad om reisetilskudd",
  oppsummeringTittel: "Oppsummering",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SykepengesoknadReisetilskudd({
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
      <Box background="default" padding="space-24" className="mb-8">
        <Heading size="medium" level="2" spacing>
          {texts.oppsummeringTittel}
        </Heading>
        <Oppsummeringsvisning soknad={soknad} />
      </Box>
      <RelaterteSoknader soknad={soknad} />
      <TilbakeTilSoknader />
    </div>
  );
}
