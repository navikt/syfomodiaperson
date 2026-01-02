import React, { ReactElement } from "react";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

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
    <Nokkelopplysning
      label={texts.dato}
      className={"nokkelopplysning--statusopplysning"}
    >
      <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
    </Nokkelopplysning>
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
        <Nokkelopplysning
          label={texts.status}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{tekst}</p>
        </Nokkelopplysning>
        <SendtDato soknad={soknad} />
      </Statusopplysninger>
    </Statuspanel>
  );
};

export default StatuspanelUtland;
