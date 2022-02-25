import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../Statuspanel";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import VerktoylinjeGjenapne from "../soknad-felles/VerktoylinjeGjenapneSoknad";
import { Brodsmule } from "../../Brodsmuler";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { SykmeldingUtdragContainer } from "../SykmeldingUtdragContainer";

const texts = {
  tittel: "Søknad om sykepenger",
  avbrutt: "Avbrutt av deg",
  avbruttTittel: "Dato avbrutt",
  status: "Status",
};

interface AvbruttSoknadArbeidstakerStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const AvbruttSoknadArbeidstakerStatuspanel = ({
  soknad,
}: AvbruttSoknadArbeidstakerStatuspanelProps) => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.avbrutt}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.avbruttTittel}>
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
      <VerktoylinjeGjenapne soknad={soknad} />
    </Statuspanel>
  );
};

interface AvbruttSoknadArbeidstakerProps {
  brukernavn: string;
  soknad: SykepengesoknadDTO;
  brodsmuler: Brodsmule[];
}

const AvbruttSoknadArbeidstaker = ({
  brukernavn,
  brodsmuler,
  soknad,
}: AvbruttSoknadArbeidstakerProps): ReactElement => {
  return (
    <div>
      <SoknadSpeiling
        tittel={texts.tittel}
        brukernavn={brukernavn}
        brodsmuler={brodsmuler}
      >
        <AvbruttSoknadArbeidstakerStatuspanel soknad={soknad} />
        <SykmeldingUtdragContainer soknad={soknad} />
      </SoknadSpeiling>
    </div>
  );
};

export default AvbruttSoknadArbeidstaker;
