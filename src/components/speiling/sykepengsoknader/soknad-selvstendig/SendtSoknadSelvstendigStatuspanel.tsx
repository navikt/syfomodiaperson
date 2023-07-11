import React, { ReactElement } from "react";
import Statuspanel, {
  Statusopplysninger,
  StatusNokkelopplysning,
} from "../../Statuspanel";
import { VerktoyKnapp, Verktoylinje } from "../../Verktoylinje";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingNokkelOpplysning from "../../sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { erOpprettetSisteAar } from "@/utils/sykepengesoknadUtils";

const texts = {
  status: "Status",
  sendtTilNav: "Sendt til NAV",
  innsendt: "Dato sendt",
  tittel: "Utbetaling av sykepenger",
  endre: "Endre søknad",
  tilNav: {
    __html:
      'Sykepenger utbetales etter at NAV har innvilget søknaden. <a href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
  },
};

interface SendtSoknadSelvstendigStatuspanelProps {
  soknad: SykepengesoknadDTO;
}

const SendtSoknadSelvstendigStatuspanel = ({
  soknad,
}: SendtSoknadSelvstendigStatuspanelProps): ReactElement => {
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
          <p dangerouslySetInnerHTML={texts.tilNav} />
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
