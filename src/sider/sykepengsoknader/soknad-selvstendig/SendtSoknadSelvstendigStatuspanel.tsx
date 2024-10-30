import React, { ReactElement } from "react";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../../../components/speiling/Statuspanel";
import {
  VerktoyKnapp,
  Verktoylinje,
} from "../../../components/speiling/Verktoylinje";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingNokkelOpplysning from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { erOpprettetSisteAar } from "@/utils/sykepengesoknadUtils";
import SykepengerOgSaksbehandlingstiderLink from "@/utils/soknad-felles/SykepengerOgSaksbehandlingstiderLink";

const texts = {
  status: "Status",
  sendtTilNav: "Sendt til Nav",
  innsendt: "Dato sendt",
  tittel: "Utbetaling av sykepenger",
  endre: "Endre søknad",
  tilNav: "Sykepenger utbetales etter at Nav har innvilget søknaden.",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

const SendtSoknadSelvstendigStatuspanel = ({ soknad }: Props): ReactElement => {
  const visEndreknapp = erOpprettetSisteAar(soknad);

  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.sendtTilNav}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.innsendt}>
          <p>{tilLesbarDatoMedArstall(soknad.sendtTilNAVDato)}</p>
        </StatusNokkelopplysning>
        <SykmeldingNokkelOpplysning className="sist" tittel={texts.tittel}>
          <SykepengerOgSaksbehandlingstiderLink tittel={texts.tilNav} />
        </SykmeldingNokkelOpplysning>
      </Statusopplysninger>
      {visEndreknapp && (
        <Verktoylinje>
          <VerktoyKnapp>{texts.endre}</VerktoyKnapp>
        </Verktoylinje>
      )}
    </Statuspanel>
  );
};

export default SendtSoknadSelvstendigStatuspanel;
