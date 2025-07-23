import { BellIcon } from "@navikt/aksel-icons";
import { Button, Modal } from "@navikt/ds-react";
import React, { useState } from "react";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import {
  useBehandlePaminnelseOppgave,
  usePaminnelseTilBehandler,
} from "@/data/behandlerdialog/usePaminnelseTilBehandler";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { DocumentComponentHeaderH1 } from "@/components/document/DocumentComponentHeaderH1";
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { CloseButton } from "@/components/CloseButton";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";

const texts = {
  button: "Vurder påminnelse til behandler",
  send: "Send påminnelse",
  fjernOppgave: "Fjern oppgave uten å sende påminnelse",
};

interface Props {
  melding: MeldingDTO;
  oppgave: PersonOppgave;
}

export default function PaminnelseMelding({ melding, oppgave }: Props) {
  const [visPaminnelseModal, setVisPaminnelseModal] = useState(false);

  const { getPaminnelseDocument } = useMeldingTilBehandlerDocument();
  const paminnelseTilBehandler = usePaminnelseTilBehandler(
    melding.uuid,
    oppgave.uuid
  );
  const behandleOppgave = useBehandlePaminnelseOppgave();
  const { documentHeader, documentBody, document } =
    getPaminnelseDocument(melding);

  const handleSendPaminnelseClick = () => {
    const paminnelseDTO: PaminnelseDTO = {
      document,
    };
    paminnelseTilBehandler.mutate(paminnelseDTO, {
      onSuccess: () => setVisPaminnelseModal(false),
    });
  };

  return (
    <>
      <div className="flex gap-4">
        <Button
          icon={<BellIcon aria-hidden />}
          size="small"
          onClick={() => {
            setVisPaminnelseModal(true);
            paminnelseTilBehandler.reset();
            behandleOppgave.reset();
          }}
        >
          {texts.button}
        </Button>
        <Button
          variant="secondary"
          size="small"
          loading={behandleOppgave.isPending}
          onClick={() => behandleOppgave.mutate(oppgave.uuid)}
        >
          {texts.fjernOppgave}
        </Button>
      </div>
      <Modal
        width="medium"
        closeOnBackdropClick
        open={visPaminnelseModal}
        onClose={() => setVisPaminnelseModal(false)}
        aria-labelledby="modal-heading"
      >
        <Modal.Header>
          <DocumentComponentHeaderH1 text={documentHeader} />
        </Modal.Header>
        <Modal.Body className="p-8">
          {documentBody.map((component, index) => (
            <DocumentComponentVisning
              documentComponent={component}
              key={index}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          {(paminnelseTilBehandler.isError || behandleOppgave.isError) && (
            <SkjemaInnsendingFeil
              error={paminnelseTilBehandler.error || behandleOppgave.error}
            />
          )}
          <Button
            disabled={behandleOppgave.isPending}
            loading={paminnelseTilBehandler.isPending}
            onClick={handleSendPaminnelseClick}
          >
            {texts.send}
          </Button>
          <CloseButton
            onClick={() => setVisPaminnelseModal(false)}
            disabled={
              paminnelseTilBehandler.isPending || behandleOppgave.isPending
            }
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}
