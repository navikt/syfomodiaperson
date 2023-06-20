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
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";

const texts = {
  button: "Vurder påminnelse til behandler",
  send: "Send påminnelse",
  fjernOppgave: "Fjern oppgave uten å sende påminnelse",
  cancel: "Lukk",
};

const StyledButton = styled(Button)`
  align-self: flex-start;
`;

const ModalContent = styled(Modal.Content)`
  padding: 2em;
`;

interface VisOgSendPaminnelseProps extends PaminnelseMeldingProps {
  oppgave: PersonOppgave;
}

const VisOgSendPaminnelse = ({
  melding,
  oppgave,
}: VisOgSendPaminnelseProps) => {
  const [visPaminnelseModal, setVisPaminnelseModal] = useState(false);

  const { getPaminnelseDocument } = useMeldingTilBehandlerDocument();
  const paminnelseTilBehandler = usePaminnelseTilBehandler(
    melding.uuid,
    oppgave.uuid
  );
  const behandlePersonoppgave = useBehandlePersonoppgave();
  const paminnelseDocument = getPaminnelseDocument(melding);

  const handleSendPaminnelseClick = () => {
    const paminnelseDTO: PaminnelseDTO = {
      document: paminnelseDocument,
    };
    paminnelseTilBehandler.mutate(paminnelseDTO, {
      onSuccess: () => setVisPaminnelseModal(false),
    });
  };
  const handleFjernOppgaveClick = () => {
    behandlePersonoppgave.mutate(oppgave.uuid, {
      onSuccess: () => setVisPaminnelseModal(false),
    });
  };

  return (
    <>
      <StyledButton
        icon={<BellIcon aria-hidden />}
        onClick={() => {
          setVisPaminnelseModal(true);
          paminnelseTilBehandler.reset();
        }}
      >
        {texts.button}
      </StyledButton>
      <Modal
        open={visPaminnelseModal}
        onClose={() => setVisPaminnelseModal(false)}
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
              disabled={behandlePersonoppgave.isLoading}
              loading={paminnelseTilBehandler.isLoading}
              onClick={handleSendPaminnelseClick}
            >
              {texts.send}
            </Button>
            <Button
              variant="secondary"
              disabled={paminnelseTilBehandler.isLoading}
              loading={behandlePersonoppgave.isLoading}
              onClick={handleFjernOppgaveClick}
            >
              {texts.fjernOppgave}
            </Button>
            <Button
              variant="tertiary"
              disabled={
                paminnelseTilBehandler.isLoading ||
                behandlePersonoppgave.isLoading
              }
              onClick={() => setVisPaminnelseModal(false)}
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
  const ubesvartMeldingOppgave = ubehandledeUbesvartMeldingOppgaver.find(
    (oppgave) => oppgave.referanseUuid === melding.uuid
  );

  return ubesvartMeldingOppgave ? (
    <VisOgSendPaminnelse melding={melding} oppgave={ubesvartMeldingOppgave} />
  ) : (
    <></>
  );
};
