import { Checkbox } from "nav-frontend-skjema";
import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import React from "react";
import { BodyShort } from "@navikt/ds-react";

const tekster = {
  kanSkyldesYrkesskade: "Sykmeldingen kan skyldes en yrkesskade/yrkessykdom",
  skadedato: "Skadedato",
};

interface Props {
  dato?: Date;
}

export function Yrkesskade({ dato }: Props) {
  return (
    <div>
      <Checkbox label={tekster.kanSkyldesYrkesskade} checked disabled />
      {dato && (
        <div className="mt-2">
          <BodyShort size="small" weight="semibold">
            {tekster.skadedato}
          </BodyShort>
          <BodyShort size="small">
            {tilDatoMedUkedagOgManedNavn(dato)}
          </BodyShort>
        </div>
      )}
    </div>
  );
}
