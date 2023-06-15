import { BellIcon } from "@navikt/aksel-icons";
import { Button, Modal } from "@navikt/ds-react";
import React, { useState } from "react";
import styled from "styled-components";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { usePaminnelseTilBehandler } from "@/data/behandlerdialog/usePaminnelseTilBehandler";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  button: "Send påminnelse til behandler",
  send: "Send",
  cancel: "Avbryt",
};

const StyledButton = styled(Button)`
  align-self: flex-start;
`;

const ModalContent = styled(Modal.Content)`
  padding: 2em;
`;

const VisOgSendPaminnelse = ({ melding }: PaminnelseMeldingProps) => {
  const [visPaminnelse, setVisPaminnelse] = useState(false);

  const { getPaminnelseDocument } = useMeldingTilBehandlerDocument();
  const paminnelseTilBehandler = usePaminnelseTilBehandler(melding.uuid);
  const paminnelseDocument = getPaminnelseDocument(melding);

  const handleSendPaminnelseClick = () => {
    // TODO: Behandle oppgave on click ?
    const paminnelseDTO: PaminnelseDTO = {
      document: paminnelseDocument,
    };
    paminnelseTilBehandler.mutate(paminnelseDTO, {
      onSuccess: () => setVisPaminnelse(false),
    });
  };

  return (
    <>
      <StyledButton
        icon={<BellIcon aria-hidden />}
        onClick={() => {
          setVisPaminnelse(true);
          paminnelseTilBehandler.reset();
        }}
      >
        {texts.button}
      </StyledButton>
      <Modal
        open={visPaminnelse}
        onClose={() => setVisPaminnelse(false)}
        aria-labelledby="modal-heading"
      >
        <ModalContent>
          {paminnelseDocument.map((component, index) => (
            <DocumentComponentVisning
              documentComponent={component}
              key={index}
            />
          ))}
          {paminnelseTilBehandler.isError && (
            <SkjemaInnsendingFeil error={paminnelseTilBehandler.error} />
          )}
          <ButtonRow topPadding={PaddingSize.SM} bottomPadding={PaddingSize.SM}>
            <Button
              loading={paminnelseTilBehandler.isLoading}
              onClick={handleSendPaminnelseClick}
            >
              {texts.send}
            </Button>
            <Button
              variant="tertiary"
              disabled={paminnelseTilBehandler.isLoading}
              onClick={() => setVisPaminnelse(false)}
            >
              {texts.cancel}
            </Button>
          </ButtonRow>
        </ModalContent>
      </Modal>
    </>
  );
};

interface PaminnelseMeldingProps {
  melding: MeldingDTO;
}

export const PaminnelseMelding = ({ melding }: PaminnelseMeldingProps) => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const ubehandledeUbesvartMeldingOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART
  );
  const hasUbesvartMeldingOppgave = ubehandledeUbesvartMeldingOppgaver.some(
    (oppgave) => oppgave.referanseUuid === melding.uuid
  );

  return hasUbesvartMeldingOppgave ? (
    <VisOgSendPaminnelse melding={melding} />
  ) : (
    <></>
  );
};
