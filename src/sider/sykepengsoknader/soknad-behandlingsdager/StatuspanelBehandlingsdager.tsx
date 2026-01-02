import React, { ReactElement } from "react";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import SoknadStatustekst from "@/utils/soknad-felles/SoknadStatustekst";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

const texts = {
  sendt: "Sendt til Nav",
  sender: "Sender til Nav",
  hjelpetekst:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
  status: "Status",
};

interface StatuspanelBehandlingsdagerProps {
  soknad: SykepengesoknadDTO;
}

export function StatuspanelBehandlingsdager({
  soknad,
}: StatuspanelBehandlingsdagerProps): ReactElement {
  return (
    <div>
      <Nokkelopplysning
        label={texts.status}
        className={"nokkelopplysning--statusopplysning"}
      >
        <SoknadStatustekst soknad={soknad} />
      </Nokkelopplysning>
    </div>
  );
}
