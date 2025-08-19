import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

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
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.sendtTilNav}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.innsendt}>
          <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
    </Statuspanel>
  );
}
