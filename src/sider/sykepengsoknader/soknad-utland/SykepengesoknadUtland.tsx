import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "../soknad-felles/TilbakeTilSoknader";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";

const texts = {
  tittel: "Søknad om sykepenger under opphold utenfor Norge",
  oppsummering: "Oppsummering av søknaden",
  sendt: "Sendt til Nav",
  dato: "Dato",
  status: "Status",
  ukjentStatus: "Ukjent status",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SykepengesoknadUtland({ soknad }: Props): ReactElement {
  const tekst =
    soknad.status === Soknadstatus.SENDT ? texts.sendt : texts.ukjentStatus;
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <Heading size="xsmall" level="3" className="mb-1">
            {texts.status}
          </Heading>
          <BodyShort size="small">{tekst}</BodyShort>
        </div>
        <div>
          <Heading size="xsmall" level="3" className="mb-1">
            {texts.dato}
          </Heading>
          <BodyShort size="small">
            {tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}
          </BodyShort>
        </div>
      </div>
      <Box padding="space-16" borderRadius="2">
        <Heading spacing size="small">
          {texts.oppsummering}
        </Heading>
        <Oppsummeringsvisning soknad={soknad} />
      </Box>
      <TilbakeTilSoknader />
    </div>
  );
}
