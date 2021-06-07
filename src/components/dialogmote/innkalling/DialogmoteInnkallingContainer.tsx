import Side from "../../../sider/Side";
import { MOETEPLANLEGGER } from "../../../enums/menypunkter";
import React, { ReactElement } from "react";
import Sidetopp from "../../Sidetopp";
import DialogmoteInnkallingSkjema from "./DialogmoteInnkallingSkjema";
import SideLaster from "../../SideLaster";
import styled from "styled-components";
import { useLedere } from "../../../hooks/useLedere";
import { useValgtPersonident } from "../../../hooks/useValgtBruker";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";

const texts = {
  pageTitle: "Innkalling til dialogmøte",
  pageHeader: "Innkalling til dialogmøte",
  alert:
    "I denne nye løsningen sender du innkalling, avlysning, endring av tidspunkt og referat. I Arena trenger du bare endre status til ferdig behandlet.",
};

const DialogmoteInnkallingWarningAlert = styled(AlertstripeFullbredde)`
  margin-bottom: 2.5em;
`;

const DialogmoteInnkallingContainer = (): ReactElement => {
  const fnr = useValgtPersonident();
  const { henterLedere, hentingLedereFeilet } = useLedere();

  const henter = henterLedere;
  const hentingFeilet = hentingLedereFeilet;

  return (
    <Side fnr={fnr} tittel={texts.pageTitle} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.pageHeader} />
        <DialogmoteInnkallingWarningAlert type="advarsel">
          {texts.alert}
        </DialogmoteInnkallingWarningAlert>
        <DialogmoteInnkallingSkjema pageTitle={texts.pageTitle} />
      </SideLaster>
    </Side>
  );
};
export default DialogmoteInnkallingContainer;
