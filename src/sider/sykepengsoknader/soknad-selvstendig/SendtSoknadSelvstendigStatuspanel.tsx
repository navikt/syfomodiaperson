import React, { ReactElement } from "react";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

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
        <Nokkelopplysning
          label={texts.status}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{texts.sendtTilNav}</p>
        </Nokkelopplysning>
        <Nokkelopplysning
          label={texts.innsendt}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
        </Nokkelopplysning>
      </Statusopplysninger>
    </Statuspanel>
  );
}
