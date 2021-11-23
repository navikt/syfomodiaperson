import React, { ReactElement } from "react";
import styled from "styled-components";
import { Innholdstittel } from "nav-frontend-typografi";
import DialogmoteInnkallingSkjemaSeksjon from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjemaSeksjon";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import AppSpinner from "@/components/AppSpinner";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import BehandlerRadioGruppe from "@/components/dialogmote/innkalling/BehandlerRadioGruppe";
import { useBehandlereDialogmeldingQuery } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";

const BehandlerTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
  noBehandlerFound:
    "Det er ikke registrert noen fastlege som bruker dialogmelding. Vil du invitere en behandler til dette dialogmøtet, må du sende innkallingen fra Arena.",
};

interface DialogmoteInnkallingBehandlerProps {
  setSelectedBehandler: (behandler?: BehandlerDialogmeldingDTO) => void;
}

const DialogmoteInnkallingBehandler = ({
  setSelectedBehandler,
}: DialogmoteInnkallingBehandlerProps): ReactElement => {
  const { data: behandlere, isLoading } = useBehandlereDialogmeldingQuery();

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <BehandlerTittel>{texts.title}</BehandlerTittel>
      {isLoading ? (
        <AppSpinner />
      ) : !!behandlere && behandlere.length > 0 ? (
        <BehandlerRadioGruppe
          behandlere={behandlere}
          setSelectedBehandler={setSelectedBehandler}
        />
      ) : (
        <AlertstripeFullbredde type="advarsel">
          {texts.noBehandlerFound}
        </AlertstripeFullbredde>
      )}
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingBehandler;
