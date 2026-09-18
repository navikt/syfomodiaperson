import React, { ReactElement } from "react";
import { Modal } from "@navikt/ds-react";
import { IkkeAktuellSkjema } from "./IkkeAktuellSkjema";

const texts = {
  heading: "Ikke aktuell",
};

interface Props {
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  soknadId: string;
}

export function IkkeAktuellModal({
  isOpen,
  setModalOpen,
  soknadId,
}: Props): ReactElement {
  return (
    <Modal
      closeOnBackdropClick
      onClose={() => setModalOpen(false)}
      open={isOpen}
      header={{ heading: texts.heading }}
    >
      <Modal.Body className="min-w-[400px] p-8">
        <IkkeAktuellSkjema soknadId={soknadId} setModalOpen={setModalOpen} />
      </Modal.Body>
    </Modal>
  );
}
