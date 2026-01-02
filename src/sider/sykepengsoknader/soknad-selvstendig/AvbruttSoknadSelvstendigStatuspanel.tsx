import React, { ReactElement } from "react";
import Statuspanel, {
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

const texts = {
  tittel: "Dato avbrutt",
  status: "Status",
  avbrutt: "Avbrutt av sykmeldt",
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
        <Nokkelopplysning
          label={texts.status}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{texts.avbrutt}</p>
        </Nokkelopplysning>
        <Nokkelopplysning
          label={texts.tittel}
          className={"nokkelopplysning--statusopplysning"}
        >
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </Nokkelopplysning>
      </Statusopplysninger>
    </Statuspanel>
  );
};

export default AvbruttSoknadSelvstendigStatuspanel;
