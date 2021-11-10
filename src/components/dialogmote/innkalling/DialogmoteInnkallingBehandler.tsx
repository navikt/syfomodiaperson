import React, { ReactElement } from "react";
import styled from "styled-components";
import { Innholdstittel, Normaltekst } from "nav-frontend-typografi";
import DialogmoteInnkallingSkjemaSeksjon from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjemaSeksjon";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { capitalizeFoersteBokstav } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";

const BehandlerTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
};

const BehandlerInfoRad = styled(Normaltekst)`
  margin-bottom: 0.5em;
`;

interface DialogmoteInnkallingBehandlerProps {
  behandler: BehandlerDialogmeldingDTO;
}

const DialogmoteInnkallingBehandler = ({
  behandler,
}: DialogmoteInnkallingBehandlerProps): ReactElement => {
  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <BehandlerTittel>{texts.title}</BehandlerTittel>
      <BehandlerInfoRad>
        {`${capitalizeFoersteBokstav(
          behandler.type.toLowerCase()
        )}: ${behandlerNavn(behandler)}`}
      </BehandlerInfoRad>
      <BehandlerInfoRad>
        {`${texts.legekontor}: ${behandler.kontor}`}
      </BehandlerInfoRad>
      <BehandlerInfoRad>
        {`${texts.tlf}: ${behandler.telefon}`}
      </BehandlerInfoRad>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingBehandler;
