import React from "react";
import { Button, Modal, Textarea } from "@navikt/ds-react";
import styled from "styled-components";
import { Systemtittel } from "nav-frontend-typografi";

const texts = {
  header: "Huskelapp",
  textAreaLabel: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
};

interface HuskelappModalProps {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

const StyledModal = styled(Modal)`
  padding: 1em 1.5em;
  max-width: 50em;
  width: 100%;
`;

const ModalContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
`;

const RightAlignedButtons = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: 1em;
  gap: 1em;
`;

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  //const {lagretTekst} = useHuskelapp()
  const lagretTekst = "jeg har lagret!";

  return (
    <StyledModal
      aria-label={"huskelapp"}
      open={isOpen}
      onClose={() => toggleOpen(!isOpen)}
    >
      <Systemtittel>{texts.header}</Systemtittel>
      <ModalContent>
        <Textarea
          label={texts.textAreaLabel}
          hideLabel
          defaultValue={lagretTekst}
        />
        <RightAlignedButtons>
          <Button variant="secondary" onClick={() => toggleOpen(false)}>
            {texts.close}
          </Button>
          <Button variant="primary" onClick={() => alert("lagre")}>
            {texts.save}
          </Button>
        </RightAlignedButtons>
      </ModalContent>
    </StyledModal>
  );
};
