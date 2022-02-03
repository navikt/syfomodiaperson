import Side from "../../../sider/Side";
import { MOETEPLANLEGGER } from "@/enums/menypunkter";
import React, { ReactElement } from "react";
import Sidetopp from "../../Sidetopp";
import DialogmoteInnkallingSkjema from "./DialogmoteInnkallingSkjema";
import SideLaster from "../../SideLaster";
import styled from "styled-components";
import { useLedere } from "@/hooks/useLedere";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { Redirect } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";

const texts = {
  title: "Innkalling til dialogmøte",
  alert:
    "I denne nye løsningen sender du innkalling, avlysning, endring av tidspunkt og referat. I Arena trenger du bare endre status til ferdig behandlet.",
};

const DialogmoteInnkallingWarningAlert = styled(AlertstripeFullbredde)`
  margin-bottom: 2.5em;
`;

const DialogmoteInnkallingContainer = (): ReactElement => {
  const { hentingLedereForsokt, hentingLedereFeilet } = useLedere();
  const { triedFetchingToggles, isDm2Enabled } = useDM2FeatureToggles();
  const { brukerKanIkkeVarslesDigitalt } = useNavBrukerData();
  const { aktivtDialogmote } = useDialogmoterQuery();

  if ((triedFetchingToggles && !isDm2Enabled) || aktivtDialogmote) {
    return <Redirect to={moteoversiktRoutePath} />;
  }

  return (
    <Side tittel={texts.title} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster
        henter={!hentingLedereForsokt}
        hentingFeilet={hentingLedereFeilet}
      >
        <Sidetopp tittel={texts.title} />
        <DialogmoteInnkallingWarningAlert type="advarsel">
          {texts.alert}
        </DialogmoteInnkallingWarningAlert>
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        <DialogmoteInnkallingSkjema pageTitle={texts.title} />
      </SideLaster>
    </Side>
  );
};
export default DialogmoteInnkallingContainer;
