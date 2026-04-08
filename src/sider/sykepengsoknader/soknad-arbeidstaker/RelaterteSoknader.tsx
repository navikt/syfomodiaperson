import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import {
  getTidligsteSendtDato,
  sorterEtterDato,
} from "@/utils/sykepengesoknadUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { useSykepengesoknaderQuery } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { Box, Heading, Link } from "@navikt/ds-react";

const texts = {
  tittel: "Tidligere utgaver av denne søknaden",
  sendt: "Sendt",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export function RelaterteSoknader({ soknad }: Props): ReactElement | null {
  const { data: sykepengesoknader } = useSykepengesoknaderQuery();
  const relaterteSoknader = sykepengesoknader
    .filter((s) => s.id === soknad.korrigerer)
    .reverse();
  if (relaterteSoknader.length === 0) {
    return null;
  }

  return (
    <Box background="default" padding="space-24" className="mb-2">
      <Heading level="2" size="medium" spacing>
        {texts.tittel}
      </Heading>
      <ul>
        {relaterteSoknader.sort(sorterEtterDato).map((s, index) => (
          <li key={index}>
            <Link href={`/sykefravaer/sykepengesoknader/${s.id}`}>
              {texts.sendt} {tilLesbarDatoMedArstall(getTidligsteSendtDato(s))}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
}
