import React, { ReactElement } from "react";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import StatuspanelUtland from "./StatuspanelUtland";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Box, Heading } from "@navikt/ds-react";
import TilbakeTilSoknader from "../soknad-felles/TilbakeTilSoknader";

const texts = {
  tittel: "Søknad om sykepenger under opphold utenfor Norge",
  oppsummering: "Oppsummering av søknaden",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SykepengesoknadUtland({ soknad }: Props): ReactElement {
  return (
    <div>
      <Heading level="1" size="large">
        {texts.tittel}
      </Heading>
      <StatuspanelUtland soknad={soknad} />
      <Box padding="4" borderRadius="small">
        <Heading spacing size="small">
          {texts.oppsummering}
        </Heading>
        <Oppsummeringsvisning soknad={soknad} />
      </Box>
      <TilbakeTilSoknader />
    </div>
  );
}
