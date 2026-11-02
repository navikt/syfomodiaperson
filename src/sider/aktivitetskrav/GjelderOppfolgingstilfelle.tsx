import { BodyShort } from "@navikt/ds-react";
import { formatNumericDateRange } from "@/utils/datoUtils";

import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

interface GjelderOppfolgingstilfelleProps {
  oppfolgingstilfelle: OppfolgingstilfelleDTO;
}

export const GjelderOppfolgingstilfelle = ({
  oppfolgingstilfelle,
}: GjelderOppfolgingstilfelleProps) => {
  return (
    <BodyShort>{`Gjelder tilfelle ${formatNumericDateRange(
      oppfolgingstilfelle.start,
      oppfolgingstilfelle.end,
    )}`}</BodyShort>
  );
};
