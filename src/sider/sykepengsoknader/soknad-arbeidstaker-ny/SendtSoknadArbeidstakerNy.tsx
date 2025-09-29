import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import {
  Soknadstatus,
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import KorrigertAv from "../soknad-arbeidstaker/KorrigertAv";
import { RelaterteSoknader } from "../soknad-arbeidstaker/RelaterteSoknader";
import { erTilSlutt } from "@/utils/sykepengesoknadUtils";
import { Box, Heading } from "@navikt/ds-react";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import SykmeldingUtdrag from "@/sider/sykepengsoknader/soknad-felles/SykmeldingUtdrag";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
import TilbakeTilSoknader from "@/sider/sykepengsoknader/soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger",
  oppsummeringTittel: "Oppsummering",
  status: "Status",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SendtSoknadArbeidstakerNy({
  soknad,
}: Props): ReactElement {
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const sykmelding = sykmeldinger.find((s) => {
    return s.id === soknad.sykmeldingId;
  });
  const isSykmeldingUtdragVisible =
    !!sykmelding &&
    soknad &&
    (!soknad.soknadstype || soknad.soknadstype === Soknadstype.ARBEIDSTAKERE);

  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      {soknad.status === Soknadstatus.KORRIGERT && (
        <KorrigertAv soknadId={soknad.id} />
      )}
      <Nokkelopplysning
        label={texts.status}
        className="nokkelopplysning--statusopplysning"
      >
        <SoknadStatustekst soknad={soknad} />
      </Nokkelopplysning>
      {isSykmeldingUtdragVisible && (
        <SykmeldingUtdrag sykmelding={sykmelding} />
      )}
      <Box background="surface-default" className="p-4 mb-2">
        <Heading level="2" size="medium" className="mb-4">
          {texts.oppsummeringTittel}
        </Heading>
        <Oppsummeringsvisning
          soknad={{
            ...soknad,
            sporsmal: soknad.sporsmal.filter(
              (sporsmal) => !erTilSlutt(sporsmal)
            ),
          }}
        />
      </Box>
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
