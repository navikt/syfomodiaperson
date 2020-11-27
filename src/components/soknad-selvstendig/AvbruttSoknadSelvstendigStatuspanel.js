import React from "react";
import { tilLesbarDatoMedArstall } from "@navikt/digisyfo-npm";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../Statuspanel";
import { soknad as soknadPt } from "../../propTypes";
import VerktoylinjeGjenapneSoknad from "../soknad-felles/VerktoylinjeGjenapneSoknad";

const texts = {
  status: "Status\n",
  avbrutt: "Avbrutt av deg\n",
};

const AvbruttSoknadSelvstendigStatuspanel = ({ soknad }) => {
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          <p>{texts.avbrutt}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel="Dato avbrutt">
          <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
      <VerktoylinjeGjenapneSoknad soknad={soknad} />
    </Statuspanel>
  );
};

AvbruttSoknadSelvstendigStatuspanel.propTypes = {
  soknad: soknadPt,
};

export default AvbruttSoknadSelvstendigStatuspanel;
