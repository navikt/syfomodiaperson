import React, { ReactElement } from "react";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import { UnntakAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { AvventAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/AvventAktivitetskravSkjema";
import { IkkeOppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeOppfyltAktivitetskravSkjema";
import { IkkeAktuellAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeAktuellAktivitetskravSkjema";
import { Modal } from "@navikt/ds-react";
import { SendForhandsvarselSkjema } from "@/components/aktivitetskrav/vurdering/SendForhandsvarselSkjema";

const texts = {
  modalContentLabel: "Vurder aktivitetskrav",
};

export type ModalType = `${Exclude<
  AktivitetskravStatus,
  | AktivitetskravStatus.NY
  | AktivitetskravStatus.AUTOMATISK_OPPFYLT
  | AktivitetskravStatus.STANS
  | AktivitetskravStatus.LUKKET
>}`;

interface VurderAktivitetskravModalProps {
  isOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType | undefined;
  aktivitetskravUuid: string | undefined;
}

export const VurderAktivitetskravModal = ({
  isOpen,
  setModalOpen,
  modalType,
  aktivitetskravUuid,
}: VurderAktivitetskravModalProps) => {
  return (
    <Modal
      onClose={() => setModalOpen(false)}
      open={isOpen}
      aria-labelledby={texts.modalContentLabel}
    >
      {modalType && (
        <Modal.Content className={"min-w-[600px] p-8"}>
          <VurderAktivitetskravModalContent
            setModalOpen={setModalOpen}
            modalType={modalType}
            aktivitetskravUuid={aktivitetskravUuid}
          />
        </Modal.Content>
      )}
    </Modal>
  );
};

interface VurderAktivitetskravModalContentProps {
  setModalOpen: (modalOpen: boolean) => void;
  modalType: ModalType;
  aktivitetskravUuid: string | undefined;
}

const VurderAktivitetskravModalContent = ({
  modalType,
  ...rest
}: VurderAktivitetskravModalContentProps): ReactElement => {
  switch (modalType) {
    case "OPPFYLT": {
      return <OppfyltAktivitetskravSkjema {...rest} />;
    }
    case "UNNTAK": {
      return <UnntakAktivitetskravSkjema {...rest} />;
    }
    case "AVVENT": {
      return <AvventAktivitetskravSkjema {...rest} />;
    }
    case "FORHANDSVARSEL": {
      return <SendForhandsvarselSkjema {...rest} />;
    }
    case "IKKE_OPPFYLT": {
      return <IkkeOppfyltAktivitetskravSkjema {...rest} />;
    }
    case "IKKE_AKTUELL": {
      return <IkkeAktuellAktivitetskravSkjema {...rest} />;
    }
  }
};
