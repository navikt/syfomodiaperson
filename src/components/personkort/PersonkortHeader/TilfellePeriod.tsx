import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";
import { BodyShort } from "@navikt/ds-react";

const texts = {
  startDate: "Sykmeldt: ",
};

export function TilfellePeriod() {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  const periode = `${tilLesbarDatoMedArUtenManedNavn(
    startDate
  )} - ${tilLesbarDatoMedArUtenManedNavn(endDate)}`;
  return (
    !!startDate &&
    !!endDate && (
      <div>
        <BodyShort size="small" as="span">
          {texts.startDate}
        </BodyShort>
        <BodyShort size="small" weight="semibold" as="span">
          {periode}
        </BodyShort>
      </div>
    )
  );
}
