import React, { ReactElement } from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { AvventAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/AvventAktivitetskravSkjema";
import { IkkeAktuellAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/IkkeAktuellAktivitetskravSkjema";
import { Modal } from "@navikt/ds-react";
import { VurderAktivitetskravSkjemaProps } from "@/sider/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";

const texts = {
  modalContentLabel: "Vurder aktivitetskrav",
  header: {
    avvent: "Avvent",
    ikkeAktuell: "Ikke aktuell",
  },
};

export type ModalType = `${Extract<
  AktivitetskravStatus,
  AktivitetskravStatus.AVVENT | AktivitetskravStatus.IKKE_AKTUELL
>}`;

interface VurderAktivitetskravModalProps
  extends VurderAktivitetskravSkjemaProps {
  isOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType | undefined;
}

export const VurderAktivitetskravModal = ({
  isOpen,
  setModalOpen,
  modalType,
  aktivitetskravUuid,
}: VurderAktivitetskravModalProps) => {
  const header = (): string => {
    switch (modalType) {
      case "AVVENT":
        return texts.header.avvent;
      case "IKKE_AKTUELL":
        return texts.header.ikkeAktuell;
      case undefined:
        return "";
    }
  };

  return (
    <Modal
      closeOnBackdropClick
      onClose={() => setModalOpen(false)}
      open={isOpen}
      aria-labelledby={texts.modalContentLabel}
      header={{ heading: header() }}
    >
      {modalType && (
        <Modal.Body className={"min-w-[600px] p-8"}>
          <VurderAktivitetskravModalContent
            setModalOpen={setModalOpen}
            modalType={modalType}
            aktivitetskravUuid={aktivitetskravUuid}
          />
        </Modal.Body>
      )}
    </Modal>
  );
};

interface VurderAktivitetskravModalContentProps
  extends Pick<
    VurderAktivitetskravModalProps,
    "setModalOpen" | "aktivitetskravUuid" | "modalType"
  > {
  modalType: ModalType;
}

const VurderAktivitetskravModalContent = ({
  modalType,
  ...rest
}: VurderAktivitetskravModalContentProps): ReactElement => {
  switch (modalType) {
    case "AVVENT": {
      return <AvventAktivitetskravSkjema {...rest} />;
    }
    case "IKKE_AKTUELL": {
      return <IkkeAktuellAktivitetskravSkjema {...rest} />;
    }
  }
};
