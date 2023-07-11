import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../Statuspanel";
import hentStatustekst from "../../../../utils/soknad-felles/hentSoknadStatustekst";
import hentSykepengetekst from "../../../../utils/soknad-felles/hentSykepengetekst";
import { VerktoyKnapp, Verktoylinje } from "../../Verktoylinje";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { erOpprettetSisteAar } from "@/utils/sykepengesoknadUtils";

const texts = {
  status: "Status",
  tittel: "Utbetaling av sykepenger",
  endre: "Endre søknad",
};

interface StatusOgSykepengeopplysningerProps {
  soknad: SykepengesoknadDTO;
}

const StatusOgSykepengeopplysninger = (
  statusOgSykepengeopplysningerProps: StatusOgSykepengeopplysningerProps
) => {
  const { soknad } = statusOgSykepengeopplysningerProps;
  return (
    <Statusopplysninger>
      <StatusNokkelopplysning tittel={texts.status}>
        <p>{hentStatustekst(soknad)}</p>
      </StatusNokkelopplysning>
      <StatusNokkelopplysning tittel={texts.tittel}>
        <p dangerouslySetInnerHTML={hentSykepengetekst(soknad)} />
      </StatusNokkelopplysning>
    </Statusopplysninger>
  );
};

interface SykepengesoknadStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const SykepengesoknadStatuspanel = ({
  soknad,
}: SykepengesoknadStatuspanelProps): ReactElement => {
  const visEndreknapp =
    erOpprettetSisteAar(soknad) && soknad.status === Soknadstatus.SENDT;

  return (
    <Statuspanel enKolonne>
      <StatusOgSykepengeopplysninger soknad={soknad} />
      {visEndreknapp && (
        <Verktoylinje>
          <VerktoyKnapp>{texts.endre}</VerktoyKnapp>
        </Verktoylinje>
      )}
    </Statuspanel>
  );
};

export default SykepengesoknadStatuspanel;
