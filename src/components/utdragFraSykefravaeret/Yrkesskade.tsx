import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import React from "react";
import { BodyShort, Checkbox } from "@navikt/ds-react";

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
      <Checkbox
        value={tekster.kanSkyldesYrkesskade}
        size="small"
        readOnly
        checked
      >
        {tekster.kanSkyldesYrkesskade}
      </Checkbox>
      {dato && (
        <>
          <BodyShort size="small" weight="semibold">
            {tekster.skadedato}
          </BodyShort>
          <BodyShort size="small">
            {tilDatoMedUkedagOgManedNavn(dato)}
          </BodyShort>
        </>
      )}
    </div>
  );
}
