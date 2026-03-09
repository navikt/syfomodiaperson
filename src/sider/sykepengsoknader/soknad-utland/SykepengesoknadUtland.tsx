import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Box, Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "../soknad-felles/TilbakeTilSoknader";
import Statuspanel, {
  Statusopplysninger,
} from "@/components/speiling/Statuspanel";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
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
      <Statuspanel>
        <Statusopplysninger>
          <Nokkelopplysning
            label={texts.status}
            className={"nokkelopplysning--statusopplysning"}
          >
            <p>{tekst}</p>
          </Nokkelopplysning>
          <Nokkelopplysning
            label={texts.dato}
            className={"nokkelopplysning--statusopplysning"}
          >
            <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
          </Nokkelopplysning>
        </Statusopplysninger>
      </Statuspanel>
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
