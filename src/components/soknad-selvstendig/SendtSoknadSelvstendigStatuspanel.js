import React from "react";
import {
  SykmeldingNokkelOpplysning,
  tilLesbarDatoMedArstall,
} from "@navikt/digisyfo-npm";
import Statuspanel, {
  Statusopplysninger,
  StatusNokkelopplysning,
} from "../Statuspanel";
import { soknad as soknadPt } from "../../propTypes";
import { VerktoyKnapp, Verktoylinje } from "../Verktoylinje";

const texts = {
  status: "Status",
  sendtTilNav: "Sendt til NAV",
  innsendt: "Dato sendt",
  tittel: "Utbetaling av sykepenger",
  tilNav: {
    __html:
      'Sykepenger utbetales etter at NAV har innvilget søknaden. <a href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
  },
};

const SendtSoknadSelvstendigStatuspanel = ({ soknad }) => {
  const ETT_AAR_SIDEN = new Date();
  ETT_AAR_SIDEN.setYear(ETT_AAR_SIDEN.getFullYear() - 1);
  const visEndreknapp = soknad.opprettetDato >= ETT_AAR_SIDEN;

  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.sendtTilNav}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel={texts.innsendt}>
          <p>{tilLesbarDatoMedArstall(soknad.innsendtDato)}</p>
        </StatusNokkelopplysning>
        <SykmeldingNokkelOpplysning className="sist" tittel={texts.tittel}>
          <p dangerouslySetInnerHTML={texts.tilNav} />
        </SykmeldingNokkelOpplysning>
      </Statusopplysninger>
      {visEndreknapp && (
        <Verktoylinje>
          <VerktoyKnapp>Endre søknad</VerktoyKnapp>
        </Verktoylinje>
      )}
    </Statuspanel>
  );
};

SendtSoknadSelvstendigStatuspanel.propTypes = {
  soknad: soknadPt,
};

export default SendtSoknadSelvstendigStatuspanel;
