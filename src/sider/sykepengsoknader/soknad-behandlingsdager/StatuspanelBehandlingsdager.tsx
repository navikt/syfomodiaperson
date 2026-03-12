import React, { ReactElement } from "react";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";
import { Heading } from "@navikt/ds-react";

const texts = {
  sendt: "Sendt til Nav",
  sender: "Sender til Nav",
  status: "Status",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export function StatuspanelBehandlingsdager({ soknad }: Props): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.status}
      </Heading>
      <SoknadStatustekst soknad={soknad} />
    </div>
  );
}
