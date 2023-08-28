import React from "react";
import { MeldingTilBehandlerSkjema } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Heading } from "@navikt/ds-react";
import styled from "styled-components";

const texts = {
  header: "Skriv til behandler",
  meldingVisesTilBruker: "Meldingen vises til innbyggeren på Min side.",
};

const MeldingTilBehandlerAlert = styled(Alert)`
  max-width: fit-content;
  margin-bottom: 1.5em;

  .navds-alert__wrapper {
    max-width: fit-content;
  }
`;

export const MeldingTilBehandler = () => {
  return (
    <>
      <Heading level="1" size="large" spacing>
        {texts.header}
      </Heading>
      <>
        <MeldingTilBehandlerAlert variant="warning" size="small">
          {texts.meldingVisesTilBruker}
        </MeldingTilBehandlerAlert>
        <MeldingTilBehandlerSkjema />
      </>
    </>
  );
};
