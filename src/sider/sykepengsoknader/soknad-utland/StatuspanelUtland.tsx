import React, { ReactElement } from "react";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";

const texts = {
  sendt: "Sendt til Nav",
  dato: "Dato",
  status: "Status",
  ukjentStatus: "Ukjent status",
};

interface SendtDatoProps {
  soknad: SykepengesoknadDTO;
}

const SendtDato = (sendtDatoProps: SendtDatoProps) => {
  const { soknad } = sendtDatoProps;
  return (
    <StatusNokkelopplysning tittel={texts.dato}>
      <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
    </StatusNokkelopplysning>
  );
};

interface StatuspanelUtlandProps {
  soknad: SykepengesoknadDTO;
}

const StatuspanelUtland = (
  statuspanelUtlandProps: StatuspanelUtlandProps
): ReactElement => {
  const { soknad } = statuspanelUtlandProps;
  const tekst =
    soknad.status === Soknadstatus.SENDT ? texts.sendt : texts.ukjentStatus;
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{tekst}</p>
        </StatusNokkelopplysning>
        <SendtDato soknad={soknad} />
      </Statusopplysninger>
    </Statuspanel>
  );
};

export default StatuspanelUtland;
