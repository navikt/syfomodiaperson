import React from "react";
import { sykepengesoknad as sykepengesoknadPt } from "@navikt/digisyfo-npm";
import { VerktoyKnapp, Verktoylinje } from "../Verktoylinje";

const getSistSendtDato = (s) => {
  if (s.sendtTilNAVDato && s.sendtTilArbeidsgiverDato) {
    if (s.sendtTilNAVDato.getTime() > s.sendtTilArbeidsgiverDato.getTime()) {
      return s.sendtTilNAVDato;
    }
    return s.sendtTilArbeidsgiverDato;
  }
  if (s.sendtTilNAVDato) {
    return s.sendtTilNAVDato;
  }
  return s.sendtTilArbeidsgiverDato;
};

const EndreSendKnapperad = ({ sykepengesoknad }) => {
  const frist = new Date();
  const ANTALL_MAANEDER_KORRIGERING_ER_MULIG = 3;
  frist.setMonth(frist.getMonth() - ANTALL_MAANEDER_KORRIGERING_ER_MULIG);
  const sendtDato = getSistSendtDato(sykepengesoknad);
  const visEndreknapp = sendtDato.getTime() >= frist.getTime();
  const visSendTilNavKnapp = sykepengesoknad.sendtTilNAVDato === null;
  const visSendTilArbeidsgiverKnapp =
    sykepengesoknad.sendtTilArbeidsgiverDato === null;

  return (
    (visEndreknapp || visSendTilNavKnapp || visSendTilArbeidsgiverKnapp) && (
      <Verktoylinje>
        {visEndreknapp && <VerktoyKnapp>Endre søknad</VerktoyKnapp>}
        {visSendTilNavKnapp && <VerktoyKnapp>Send til NAV</VerktoyKnapp>}
        {visSendTilArbeidsgiverKnapp && (
          <VerktoyKnapp>Send til arbeidsgiver</VerktoyKnapp>
        )}
      </Verktoylinje>
    )
  );
};

EndreSendKnapperad.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
};

export default EndreSendKnapperad;
