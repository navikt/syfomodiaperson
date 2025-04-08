import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  tittel: "Dato avbrutt",
  status: "Status\n",
  avbrutt: "Avbrutt av deg\n",
};

interface AvbruttSoknadSelvstendigStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadSelvstendigStatuspanel = ({
  soknad,
}: AvbruttSoknadSelvstendigStatuspanelProps): ReactElement => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.avbrutt}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.tittel}>
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
    </Statuspanel>
  );
};

export default AvbruttSoknadSelvstendigStatuspanel;
