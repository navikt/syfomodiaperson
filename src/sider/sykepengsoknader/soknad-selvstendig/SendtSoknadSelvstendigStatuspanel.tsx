import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Heading } from "@navikt/ds-react";

const texts = {
  status: "Status",
  sendtTilNav: "Sendt til Nav",
  innsendt: "Dato sendt",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SendtSoknadSelvstendigStatuspanel({
  soknad,
}: Props): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      <div>
        <Heading size="xsmall" level="3" className="mb-1">
          {texts.status}
        </Heading>
        <BodyShort size="small">{texts.sendtTilNav}</BodyShort>
      </div>
      <div>
        <Heading size="xsmall" level="3" className="mb-1">
          {texts.innsendt}
        </Heading>
        <BodyShort size="small">
          {tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}
        </BodyShort>
      </div>
    </div>
  );
}
