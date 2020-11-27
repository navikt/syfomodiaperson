import React from "react";
import { VerktoyKnapp, Verktoylinje } from "../Verktoylinje";
import { soknad as soknadPt } from "../../propTypes";

const texts = {
  gjenapne: "Gjenåpne søknad",
};

export const soknadKanGjenapnes = (opprettetDato) => {
  const ETT_AAR_SIDEN = new Date();
  ETT_AAR_SIDEN.setYear(ETT_AAR_SIDEN.getFullYear() - 1);
  return opprettetDato >= ETT_AAR_SIDEN;
};

const VerktoylinjeGjenapneSoknad = ({ soknad }) => {
  return soknadKanGjenapnes(soknad.opprettetDato) ? (
    <Verktoylinje>
      <VerktoyKnapp>{texts.gjenapne}</VerktoyKnapp>
    </Verktoylinje>
  ) : null;
};

VerktoylinjeGjenapneSoknad.propTypes = {
  soknad: soknadPt,
};

export default VerktoylinjeGjenapneSoknad;
